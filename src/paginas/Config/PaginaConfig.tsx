import { BookOpen, Database, Info, Palette, ShieldCheck } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp, useArmazenamento } from '../../ganchos'
import styles from './pagina-config.module.scss'

export const PaginaConfig = () => {
  const { estado, despacho } = useApp()
  const { carregando, salvarConfiguracoes } = useArmazenamento()

  const [mensagem, setMensagem] = useState<string | null>(null)
  const [erro, setErro] = useState<string | null>(null)

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

      <section className={styles.painelLinks}>
        <div className={styles.painelLinksTopo}>
          <ShieldCheck size={18} />
          <h2>Leitura e operação</h2>
        </div>

        <p className={styles.painelLinksResumo}>
          Essas páginas explicam como o Compasso funciona hoje, o que fica salvo localmente e onde verificar as referências públicas do projeto.
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
        </div>
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

      {mensagem && <p className={styles.mensagemSucesso}>{mensagem}</p>}
      {erro && <p className={styles.mensagemErro}>{erro}</p>}
    </div>
  )
}
