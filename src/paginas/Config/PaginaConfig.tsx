import { BookOpen, Database, Heart, Info, Palette, ShieldCheck } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp, useArmazenamento, useTelemetria, useConsentimentoTelemetria } from '../../ganchos'
import { useProtecao } from '../../ganchos/useProtecao'
import styles from './pagina-config.module.scss'

export const PaginaConfig = () => {
  const { estado, despacho } = useApp()
  const { carregando, salvarConfiguracoes } = useArmazenamento()
  const { rastrearEvento } = useTelemetria()
  const { consentimentoTelemetria, definirConsentimentoTelemetria, carregandoConsentimentoTelemetria } = useConsentimentoTelemetria()
  const {
    ativarProtecao,
    desativarProtecao,
    trocarSenha,
    bloquear,
    atualizarTimeoutSessao,
  } = useProtecao()

  const [mensagem, setMensagem] = useState<string | null>(null)
  const [erro, setErro] = useState<string | null>(null)
  const [senhaProtecao, setSenhaProtecao] = useState('')
  const [confirmacaoSenhaProtecao, setConfirmacaoSenhaProtecao] = useState('')
  const [senhaAtual, setSenhaAtual] = useState('')
  const [novaSenha, setNovaSenha] = useState('')

  const opcoesTimeout = [
    { rotulo: '5 minutos', valor: 5 * 60 * 1000 },
    { rotulo: '15 minutos', valor: 15 * 60 * 1000 },
    { rotulo: '30 minutos', valor: 30 * 60 * 1000 },
    { rotulo: '60 minutos', valor: 60 * 60 * 1000 },
  ]

  const definirTema = async (tema: 'escuro' | 'claro') => {
    limparFeedback()

    const novasConfiguracoes = {
      ...estado.configuracoes,
      tema,
      temaAuto: false,
    }

    await salvarConfiguracoes(novasConfiguracoes)
    despacho({ tipo: 'DEFINIR_CONFIGURACAO', payload: { tema, temaAuto: false } })
    document.body.classList.toggle('tema-claro', tema === 'claro')
    setMensagem(`Tema ${tema === 'claro' ? 'claro' : 'escuro'} aplicado.`)
  }

  const definirTemaAutomatico = async () => {
    limparFeedback()

    const novasConfiguracoes = {
      ...estado.configuracoes,
      temaAuto: true,
    }

    await salvarConfiguracoes(novasConfiguracoes)
    despacho({ tipo: 'DEFINIR_CONFIGURACAO', payload: { temaAuto: true } })
    setMensagem('Tema automático ativado. O app seguirá a preferência do sistema.')
  }

  const limparFeedback = () => {
    setMensagem(null)
    setErro(null)
  }

  const ativarProtecaoNaPagina = async () => {
    limparFeedback()

    if (senhaProtecao.length < 8) {
      setErro('Use uma senha com pelo menos 8 caracteres.')
      return
    }

    if (senhaProtecao !== confirmacaoSenhaProtecao) {
      setErro('A confirmação de senha não confere.')
      return
    }

    try {
      await ativarProtecao(senhaProtecao)
      await salvarConfiguracoes({
        ...estado.configuracoes,
        protecaoAtiva: true,
      })

      setSenhaProtecao('')
      setConfirmacaoSenhaProtecao('')
      setMensagem('Proteção ativada. Seus dados locais passam a ser protegidos.')
    } catch (causa) {
      setErro(causa instanceof Error ? causa.message : 'Falha ao ativar proteção')
    }
  }

  const desativarProtecaoNaPagina = async () => {
    limparFeedback()

    try {
      await desativarProtecao()
      await salvarConfiguracoes({
        ...estado.configuracoes,
        protecaoAtiva: false,
      })
      setMensagem('Proteção desativada para este dispositivo.')
    } catch (causa) {
      setErro(causa instanceof Error ? causa.message : 'Falha ao desativar proteção')
    }
  }

  const trocarSenhaNaPagina = async () => {
    limparFeedback()

    if (novaSenha.length < 8) {
      setErro('A nova senha deve ter pelo menos 8 caracteres.')
      return
    }

    try {
      await trocarSenha(senhaAtual, novaSenha)
      setSenhaAtual('')
      setNovaSenha('')
      setMensagem('Senha atualizada com sucesso.')
    } catch (causa) {
      setErro(causa instanceof Error ? causa.message : 'Falha ao trocar senha')
    }
  }

  const atualizarTimeoutNaPagina = async (timeoutMs: number) => {
    limparFeedback()

    atualizarTimeoutSessao(timeoutMs)
    await salvarConfiguracoes({
      ...estado.configuracoes,
      timeoutBloqueio: timeoutMs,
    })

    setMensagem('Tempo de bloqueio automático atualizado.')
  }

  const alternarManterSessao = async (marcado: boolean) => {
    limparFeedback()

    despacho({
      tipo: 'DEFINIR_CONFIGURACAO',
      payload: { manterDesbloqueadoNestaSessao: marcado },
    })

    await salvarConfiguracoes({
      ...estado.configuracoes,
      manterDesbloqueadoNestaSessao: marcado,
    })

    setMensagem(marcado
      ? 'Sessão permanecerá desbloqueada enquanto esta aba estiver ativa.'
      : 'Bloqueio automático por inatividade reativado.')
  }

  const alternarTelemetria = async (novoEstado: boolean) => {
    limparFeedback()

    await definirConsentimentoTelemetria(novoEstado)
    rastrearEvento('alterou_consentimento_telemetria', { consentido: novoEstado })

    setMensagem(novoEstado
      ? 'Telemetria ativada. Vamos coletar contadores de uso anônimos.'
      : 'Telemetria desativada. O app continuará funcionando normalmente.')
  }

  const temaEfetivo = useMemo(() => {
    if (!estado.configuracoes.temaAuto) {
      return estado.configuracoes.tema
    }

    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'claro' : 'escuro'
  }, [estado.configuracoes.tema, estado.configuracoes.temaAuto])

  const aceiteLocalFormatado = useMemo(() => {
    const timestampAceite = estado.configuracoes.onboarding?.aceitouTermosPrivacidadeEm

    if (!timestampAceite) {
      return 'Ainda não registrado neste dispositivo.'
    }

    return new Date(timestampAceite).toLocaleString('pt-BR', {
      dateStyle: 'long',
      timeStyle: 'short',
    })
  }, [estado.configuracoes.onboarding?.aceitouTermosPrivacidadeEm])

  return (
    <div className={styles.pagina}>
      <header className={styles.topo}>
        <span className={styles.eyebrow}>Configurações</span>
        <h1 className={styles.titulo}>Configurações</h1>
        <p className={styles.subtitulo}>
          Ajuste a aparência da interface e acesse as páginas de dados, transparência e contexto do produto.
        </p>
      </header>

      <section className={styles.cartaoTema}>
        <div className={styles.cartaoTemaTopo}>
          <Palette size={18} />
          <h2>Aparência</h2>
        </div>

        <p className={styles.cartaoTemaResumo}>
          Escolha entre seguir o sistema ou definir manualmente o tema do app neste dispositivo.
        </p>

        <div className={styles.gradeTema}>
        <button
          className={styles.acao + (estado.configuracoes.temaAuto ? ' ' + styles['acao--ativa'] : '')}
          onClick={() => void definirTemaAutomatico()}
          disabled={carregando}
        >
          <span>Tema automático</span>
        </button>

        <button
          className={styles.acao + (!estado.configuracoes.temaAuto && estado.configuracoes.tema === 'escuro' ? ' ' + styles['acao--ativa'] : '')}
          onClick={() => void definirTema('escuro')}
          disabled={carregando}
        >
          <span>Tema escuro</span>
        </button>

        <button
          className={styles.acao + (!estado.configuracoes.temaAuto && estado.configuracoes.tema === 'claro' ? ' ' + styles['acao--ativa'] : '')}
          onClick={() => void definirTema('claro')}
          disabled={carregando}
        >
          <span>Tema claro</span>
        </button>
        </div>

        <p className={styles.temaResumo}>
          Tema em uso: <strong>{temaEfetivo === 'claro' ? 'Claro' : 'Escuro'}</strong>
          {estado.configuracoes.temaAuto ? ' (automático)' : ' (manual)'}
        </p>
      </section>

      <section className={styles.painelProtecao}>
        <div className={styles.painelLinksTopo}>
          <ShieldCheck size={18} />
          <h2>Privacidade e dados</h2>
        </div>

        <p className={styles.painelLinksResumo}>
          Controle a coleta de dados de uso anônimos e entenda como funcionam.
        </p>

        <div className={styles.telemetriaPainel}>
          <div className={styles.telemetriaPainel__topo}>
            <div>
              <h3 className={styles.telemetriaPainel__titulo}>Telemetria anônima</h3>
              <p className={styles.telemetriaPainel__descricao}>
                Contadores de uso agregados. Sem dados pessoais ou conteúdo.
              </p>
            </div>

            <label className={styles.switchTelemetria + (carregandoConsentimentoTelemetria ? ' ' + styles['switchTelemetria--desativado'] : '')}>
              <span className={styles.switchTelemetria__rotulo}>Ativar telemetria anônima</span>
              <input
                type="checkbox"
                checked={consentimentoTelemetria === true}
                onChange={(evento) => void alternarTelemetria(evento.target.checked)}
                disabled={carregandoConsentimentoTelemetria}
                className={styles.switchTelemetria__controle}
              />
              <span className={styles.switchTelemetria__visual} aria-hidden="true" />
              <span className={styles.switchTelemetria__estado}>
                {consentimentoTelemetria === true ? 'Ativada' : 'Desativada'}
              </span>
            </label>
          </div>

          <p className={styles.telemetriaPainel__meta}>
            Coletado: páginas visitadas, pausas iniciadas, momentos registrados.
          </p>
        </div>

        <Link to="/telemetria" className={styles.itemNavegacao + ' ' + styles.itemNavegacao__espacado} target="_blank" rel="noopener noreferrer">
          <span className={styles.itemNavegacaoTexto}>
            <strong>Saiba mais sobre telemetria</strong>
            <small>O que coletamos, como funciona offline e como desativar.</small>
          </span>
        </Link>
      </section>

      <section className={styles.painelProtecao}>
        <div className={styles.painelLinksTopo}>
          <ShieldCheck size={18} />
          <h2>Proteção e bloqueio</h2>
        </div>

        <p className={styles.painelLinksResumo}>
          Defina uma senha local para bloquear o acesso ao app neste dispositivo.
        </p>

        <p className={styles.painelLinksResumo}>
          Se você esquecer a senha local, não conseguimos recuperar os dados deste dispositivo.
        </p>

        {!estado.configuracoes.protecaoAtiva && (
          <div className={styles.formProtecao}>
            <label htmlFor="senha-protecao">Nova senha</label>
            <input
              id="senha-protecao"
              type="password"
              value={senhaProtecao}
              onChange={(evento) => setSenhaProtecao(evento.target.value)}
              placeholder="Mínimo de 8 caracteres"
            />

            <label htmlFor="confirmacao-senha-protecao">Confirmar senha</label>
            <input
              id="confirmacao-senha-protecao"
              type="password"
              value={confirmacaoSenhaProtecao}
              onChange={(evento) => setConfirmacaoSenhaProtecao(evento.target.value)}
              placeholder="Repita sua senha"
            />

            <button type="button" className={styles.acao} onClick={() => void ativarProtecaoNaPagina()} disabled={carregando}>
              Ativar proteção
            </button>
          </div>
        )}

        {estado.configuracoes.protecaoAtiva && (
          <div className={styles.formProtecao}>
            <p className={styles.onboardingMeta}>
              Status atual: <strong>{estado.protecao.desbloqueado ? 'Desbloqueado' : 'Bloqueado'}</strong>
            </p>

            <label htmlFor="timeout-bloqueio">Bloquear após inatividade</label>
            <select
              id="timeout-bloqueio"
              value={estado.configuracoes.timeoutBloqueio}
              onChange={(evento) => void atualizarTimeoutNaPagina(Number(evento.target.value))}
              disabled={carregando}
            >
              {opcoesTimeout.map((opcao) => (
                <option key={opcao.valor} value={opcao.valor}>
                  {opcao.rotulo}
                </option>
              ))}
            </select>

            <label className={styles.checkboxLinha}>
              <input
                type="checkbox"
                checked={estado.configuracoes.manterDesbloqueadoNestaSessao}
                onChange={(evento) => void alternarManterSessao(evento.target.checked)}
                disabled={carregando}
              />
              <span>Manter desbloqueado nesta sessão</span>
            </label>

            <button type="button" className={styles.acao} onClick={bloquear} disabled={carregando || !estado.protecao.desbloqueado}>
              Bloquear agora
            </button>

            <label htmlFor="senha-atual-protecao">Senha atual</label>
            <input
              id="senha-atual-protecao"
              type="password"
              value={senhaAtual}
              onChange={(evento) => setSenhaAtual(evento.target.value)}
              placeholder="Senha atual"
            />

            <label htmlFor="nova-senha-protecao">Nova senha</label>
            <input
              id="nova-senha-protecao"
              type="password"
              value={novaSenha}
              onChange={(evento) => setNovaSenha(evento.target.value)}
              placeholder="Nova senha"
            />

            <button type="button" className={styles.acao} onClick={() => void trocarSenhaNaPagina()} disabled={carregando}>
              Trocar senha
            </button>

            <button type="button" className={styles.acaoPerigo} onClick={() => void desativarProtecaoNaPagina()} disabled={carregando}>
              Desativar proteção
            </button>
          </div>
        )}
      </section>

      <section className={styles.painelOnboarding}>
        <div className={styles.painelLinksTopo}>
          <ShieldCheck size={18} />
          <h2>Onboarding e consentimento</h2>
        </div>

        <p className={styles.painelLinksResumo}>
          Confira quando o aceite local foi registrado e revise o fluxo inicial quando quiser.
        </p>

        <p className={styles.onboardingMeta}>
          Aceite local registrado: <strong>{aceiteLocalFormatado}</strong>
        </p>

        <Link to="/onboarding?revisar=1" className={styles.itemNavegacao}>
          <span className={styles.itemNavegacaoIcone}>
            <Info size={18} />
          </span>
          <span className={styles.itemNavegacaoTexto}>
            <strong>Revisar onboarding</strong>
            <small>Reabra o resumo de proposta, privacidade, maioridade e aceite.</small>
          </span>
        </Link>
      </section>

      <section className={styles.painelLinks}>
        <div className={styles.painelLinksTopo}>
          <ShieldCheck size={18} />
          <h2>Referências e transparência</h2>
        </div>

        <p className={styles.painelLinksResumo}>
          Páginas de consulta sobre funcionamento, privacidade local e referências públicas do projeto.
        </p>

        <div className={styles.listaNavegacao}>
          <Link to="/config/dados-locais-seguranca" className={styles.itemNavegacao}>
            <span className={styles.itemNavegacaoIcone}>
              <Database size={18} />
            </span>
            <span className={styles.itemNavegacaoTexto}>
              <strong>Dados locais e segurança</strong>
              <small>O que está salvo aqui e o que você pode fazer com esses dados.</small>
            </span>
          </Link>

          <Link to="/config/privacidade-transparencia" className={styles.itemNavegacao}>
            <span className={styles.itemNavegacaoIcone}>
              <ShieldCheck size={18} />
            </span>
            <span className={styles.itemNavegacaoTexto}>
              <strong>Privacidade e transparência</strong>
              <small>O que o projeto faz hoje, como trata dados e onde ler mais.</small>
            </span>
          </Link>

          <Link to="/config/licencas-creditos" className={styles.itemNavegacao}>
            <span className={styles.itemNavegacaoIcone}>
              <BookOpen size={18} />
            </span>
            <span className={styles.itemNavegacaoTexto}>
              <strong>Licenças e créditos</strong>
              <small>Origem visual, notices e bibliotecas relevantes desta fase.</small>
            </span>
          </Link>

          <Link to="/config/sobre-projeto" className={styles.itemNavegacao}>
            <span className={styles.itemNavegacaoIcone}>
              <Info size={18} />
            </span>
            <span className={styles.itemNavegacaoTexto}>
              <strong>Sobre o projeto</strong>
              <small>Propósito, valores e responsabilidade pública do Compasso.</small>
            </span>
          </Link>

          <Link to="/apoie" className={styles.itemNavegacao}>
            <span className={styles.itemNavegacaoIcone}>
              <Heart size={18} />
            </span>
            <span className={styles.itemNavegacaoTexto}>
              <strong>Apoiar o Compasso</strong>
              <small>Contribuição voluntária para manutenção e evolução do projeto.</small>
            </span>
          </Link>
        </div>
      </section>

      {mensagem && <p className={styles.mensagemSucesso}>{mensagem}</p>}
      {erro && <p className={styles.mensagemErro}>{erro}</p>}
    </div>
  )
}
