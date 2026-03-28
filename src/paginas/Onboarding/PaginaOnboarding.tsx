import { ChevronLeft, ExternalLink, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp, useArmazenamento } from '../../ganchos'
import { useProteção } from '../../ganchos/useProtecao'
import { useTelemetria } from '../../ganchos/useTelemetria'
import { VERSAO_POLITICA_PRIVACIDADE, VERSAO_TERMOS_USO } from '../../utilitarios/constantes'
import styles from './pagina-onboarding.module.scss'

const URL_SOBRE_PROJETO = '/projeto'
const URL_POLITICA = '/privacidade'
const URL_TERMOS = '/termos'
const URL_DADOS_SEGURANCA = '/como-funciona'
const URL_SAIBA_MAIS_TELEMETRIA = '/saiba-mais/telemetria'

const TOTAL_ETAPAS = 7

export const PaginaOnboarding = ({ modoRevisao = false }: { modoRevisao?: boolean }) => {
  const navegar = useNavigate()
  const { estado, despacho } = useApp()
  const { salvarConfiguracoes, carregando } = useArmazenamento()
  const { ativarProtecao } = useProteção()
  const { rastrearEvento } = useTelemetria()

  const [etapaAtual, setEtapaAtual] = useState(1)
  const [confirmouMaioridade, setConfirmouMaioridade] = useState(false)
  const [aceitouTermosPrivacidade, setAceitouTermosPrivacidade] = useState(false)
  const [telemetriaAtiva, setTelemetriaAtiva] = useState(() => {
    const consentimentoAtual = estado.configuracoes.telemetria?.consentido
    return modoRevisao ? consentimentoAtual === true : consentimentoAtual ?? true
  })
  const [querProtegerAgora, setQuerProtegerAgora] = useState(false)
  const [senhaProtecao, setSenhaProtecao] = useState('')
  const [confirmacaoSenhaProtecao, setConfirmacaoSenhaProtecao] = useState('')
  const [erro, setErro] = useState<string | null>(null)

  const confirmouMaioridadeMarcado = modoRevisao ? true : confirmouMaioridade
  const aceitouTermosPrivacidadeMarcado = modoRevisao ? true : aceitouTermosPrivacidade

  const avancar = () => {
    setErro(null)

    setEtapaAtual((etapa) => Math.min(TOTAL_ETAPAS, etapa + 1))
  }

  const voltar = () => {
    setErro(null)
    setEtapaAtual((etapa) => Math.max(1, etapa - 1))
  }

  const concluirOnboarding = async (ativarProtecaoAgora = false) => {
    if (modoRevisao) {
      navegar('/config', { replace: true })
      return
    }

    const agora = Date.now()

    const onboarding = {
      concluidoEm: agora,
      confirmouMaioridadeEm: agora,
      aceitouTermosPrivacidadeEm: agora,
      versaoTermos: VERSAO_TERMOS_USO,
      versaoPolitica: VERSAO_POLITICA_PRIVACIDADE,
    }
    const telemetria = {
      consentido: telemetriaAtiva,
      atualizadoEm: agora,
    }

    try {
      setErro(null)

      const protecaoAtivaNoFluxo = !modoRevisao && ativarProtecaoAgora

      if (protecaoAtivaNoFluxo) {
        if (senhaProtecao.length < 8) {
          setErro('Use uma senha com pelo menos 8 caracteres para ativar a proteção.')
          return
        }

        if (senhaProtecao !== confirmacaoSenhaProtecao) {
          setErro('A confirmação da senha não confere.')
          return
        }
      }

      if (protecaoAtivaNoFluxo) {
        await ativarProtecao(senhaProtecao)
      }

      const novasConfiguracoes = {
        ...estado.configuracoes,
        onboarding,
        telemetria,
        protecaoAtiva: estado.configuracoes.protecaoAtiva || protecaoAtivaNoFluxo,
      }

      await salvarConfiguracoes(novasConfiguracoes)
      despacho({
        tipo: 'DEFINIR_CONFIGURACAO',
        payload: {
          onboarding,
          telemetria,
          protecaoAtiva: estado.configuracoes.protecaoAtiva || protecaoAtivaNoFluxo,
        },
      })
      rastrearEvento('conclusao_onboarding', {
        etapas: TOTAL_ETAPAS,
        telemetriaAtiva,
      })
      navegar('/', { replace: true })
    } catch {
      setErro('Não foi possível concluir o onboarding agora. Tente novamente em instantes.')
    }
  }

  return (
    <div className={styles.pagina}>
      <div className={styles.marcaOnboarding} aria-label="Compasso">
        <span className={styles.marcaOnboardingIcone}>
          <img src="/brand/compasso-navbar.svg" alt="" aria-hidden="true" />
        </span>
        <span className={styles.marcaOnboardingTexto}>Compasso</span>
      </div>

      <header className={styles.cabecalhoCompacto}>
        <span className={styles.eyebrow}>{modoRevisao ? 'Revisão do onboarding' : 'Primeiro acesso'}</span>
        <p className={styles.subtitulo}>Etapa {etapaAtual} de {TOTAL_ETAPAS}</p>
      </header>

      <section className={styles.painel}>
        <div className={styles.progresso} role="progressbar" aria-valuemin={1} aria-valuemax={TOTAL_ETAPAS} aria-valuenow={etapaAtual}>
          {Array.from({ length: TOTAL_ETAPAS }).map((_, indice) => (
            <span
              key={indice}
              className={styles.progressoItem + (indice + 1 <= etapaAtual ? ' ' + styles['progressoItem--ativo'] : '')}
            />
          ))}
        </div>

        {etapaAtual === 1 && (
          <article className={styles.etapa}>
            <h1>Bem-vindo ao Compasso</h1>
            <p>
              Um espaço para pessoas adultas registrarem momentos, acompanharem pausas e observarem o próprio ritmo com
              mais clareza, sem anúncios e com privacidade por padrão.
            </p>
            <ul>
              <li>Registrar momentos do seu dia com objetividade.</li>
              <li>Acompanhar pausas no seu tempo.</li>
              <li>Perceber padrões com mais clareza.</li>
            </ul>
            <div className={styles.acoes}>
              <button
                type="button"
                className={styles.botaoPrimario}
                onClick={() => {
                  rastrearEvento('clique_comece')
                  avancar()
                }}
              >
                Começar
              </button>
              <a href={URL_SOBRE_PROJETO} className={styles.linkSecundario} target="_blank" rel="noreferrer">
                <span>Entender melhor o projeto</span>
              </a>
            </div>
          </article>
        )}

        {etapaAtual === 2 && (
          <article className={styles.etapa}>
            <h1>Antes de continuar</h1>
            <ul>
              <li>O Compasso ajuda no registro pessoal e na observação de hábitos.</li>
              <li>Não é ferramenta clínica ou terapêutica.</li>
              <li>Não substitui orientação profissional.</li>
              <li>Não faz intermediação de compra ou venda.</li>
            </ul>
            <div className={styles.acoes}>
              <button type="button" className={styles.botaoSecundario} onClick={voltar}>
                <ChevronLeft size={16} />
                Voltar
              </button>
              <button type="button" className={styles.botaoPrimario} onClick={avancar}>
                Entendi e quero continuar
              </button>
            </div>
          </article>
        )}

        {etapaAtual === 3 && (
          <article className={styles.etapa}>
            <h1>Seus dados ficam com você</h1>
            <ul>
              <li>Seus registros ficam neste dispositivo.</li>
              <li>O uso não depende de conta obrigatória nesta fase.</li>
              <li>Você pode exportar, importar ou apagar seus dados quando quiser.</li>
            </ul>
            <div className={styles.acoes}>
              <button type="button" className={styles.botaoSecundario} onClick={voltar}>
                <ChevronLeft size={16} />
                Voltar
              </button>
              <div className={styles.acoesDireita}>
                <a href={URL_POLITICA} className={styles.linkSecundario} target="_blank" rel="noreferrer">
                  <span>Ler política de privacidade</span>
                </a>
                <button type="button" className={styles.botaoPrimario} onClick={avancar}>
                  Continuar
                </button>
              </div>
            </div>
          </article>
        )}

        {etapaAtual === 4 && (
          <article className={styles.etapa}>
            <h1>Uso para maiores de 18 anos</h1>
            <p>O Compasso não foi criado para crianças ou adolescentes.</p>

            <label className={styles.checkboxLinha}>
              <input
                type="checkbox"
                checked={confirmouMaioridadeMarcado}
                onChange={(evento) => setConfirmouMaioridade(evento.target.checked)}
                disabled={modoRevisao}
              />
              <span>Confirmo que tenho 18 anos ou mais</span>
            </label>

            <div className={styles.acoes}>
              <button type="button" className={styles.botaoSecundario} onClick={voltar}>
                <ChevronLeft size={16} />
                Voltar
              </button>
              <button
                type="button"
                className={styles.botaoPrimario}
                onClick={avancar}
                disabled={!modoRevisao && !confirmouMaioridadeMarcado}
              >
                Continuar
              </button>
            </div>
          </article>
        )}

        {etapaAtual === 5 && (
          <article className={styles.etapa}>
            <div className={styles.tituloComIcone}>
              <ShieldCheck size={20} />
              <h1>Aceite e início</h1>
            </div>
            <p>
              Para usar o Compasso, você precisa concordar com os Termos de Uso e a Política de Privacidade.
            </p>

            <label className={styles.checkboxLinha}>
              <input
                type="checkbox"
                checked={aceitouTermosPrivacidadeMarcado}
                onChange={(evento) => setAceitouTermosPrivacidade(evento.target.checked)}
                disabled={modoRevisao}
              />
              <span>Li e aceito os Termos de Uso e a Política de Privacidade</span>
            </label>

            <div className={styles.linksLinha}>
              <a href={URL_TERMOS} className={styles.linkSecundario} target="_blank" rel="noreferrer">
                <span>Termos de Uso</span>
                <ExternalLink size={14} />
              </a>
              <a href={URL_POLITICA} className={styles.linkSecundario} target="_blank" rel="noreferrer">
                <span>Política de Privacidade</span>
                <ExternalLink size={14} />
              </a>
            </div>

            <div className={styles.acoes}>
              <button type="button" className={styles.botaoSecundario} onClick={voltar}>
                <ChevronLeft size={16} />
                Voltar
              </button>
              <button
                type="button"
                className={styles.botaoPrimario}
                onClick={avancar}
                disabled={(!modoRevisao && !aceitouTermosPrivacidadeMarcado) || carregando}
              >
                {modoRevisao ? 'Voltar para Configurações' : 'Continuar'}
              </button>
            </div>
          </article>
        )}

        {etapaAtual === 6 && (
          <article className={styles.etapa}>
            <div className={styles.tituloComIcone}>
              <ShieldCheck size={20} />
              <h1>Telemetria anônima</h1>
            </div>

            <p>Coletamos eventos de uso anônimos para melhorar o app.</p>

            <div className={styles.blocoExplicacao}>
              <p>Coletamos:</p>
              <ul>
                <li>páginas visitadas;</li>
                <li>conclusão do onboarding;</li>
                <li>início de pausa e registro de momento.</li>
              </ul>
            </div>

            <a href={URL_SAIBA_MAIS_TELEMETRIA} target="_blank" rel="noreferrer" className={styles.linkSecundario}>
              <span>Saiba mais</span>
              <ExternalLink size={14} />
            </a>

            <div className={styles.acoes}>
              <button type="button" className={styles.botaoSecundario} onClick={voltar}>
                <ChevronLeft size={16} />
                Voltar
              </button>

              <div className={styles.acoesDireita}>
                {!modoRevisao && (
                  <button
                    type="button"
                    className={styles.botaoSecundario}
                    onClick={() => setTelemetriaAtiva((atual) => !atual)}
                  >
                    {telemetriaAtiva ? 'Desativar telemetria' : 'Ativar telemetria'}
                  </button>
                )}
                <button type="button" className={styles.botaoPrimario} onClick={avancar}>
                  Continuar
                </button>
              </div>
            </div>
          </article>
        )}

        {etapaAtual === 7 && (
          <article className={styles.etapa}>
            <div className={styles.tituloComIcone}>
              <ShieldCheck size={20} />
              <h1>Quer ativar proteção por senha?</h1>
            </div>

            <p>Se você ativar, seus dados locais ficam criptografados neste dispositivo.</p>

            <div className={styles.blocoExplicacao}>
              <p>O que isso significa:</p>
              <ul>
                <li>o app pedirá desbloqueio para abrir;</li>
                <li>os dados protegidos não ficam legíveis sem a senha correta;</li>
                <li>você pode ativar isso agora ou depois.</li>
              </ul>
            </div>

            <a href={URL_DADOS_SEGURANCA} target="_blank" rel="noreferrer" className={styles.linkSecundario}>
              <span>Entender como essa proteção funciona</span>
              <ExternalLink size={14} />
            </a>

            {modoRevisao ? (
              <p className={styles.observacaoProtecao}>
                A proteção por senha pode ser ativada ou alterada em Configurações.
              </p>
            ) : (
              <>
                {querProtegerAgora && (
                  <div className={styles.formProtecao}>
                    <label htmlFor="onboarding-senha-protecao">Senha</label>
                    <input
                      id="onboarding-senha-protecao"
                      type="password"
                      value={senhaProtecao}
                      onChange={(evento) => setSenhaProtecao(evento.target.value)}
                      autoComplete="new-password"
                      placeholder="Mínimo de 8 caracteres"
                    />

                    <label htmlFor="onboarding-confirmacao-senha-protecao">Confirmar senha</label>
                    <input
                      id="onboarding-confirmacao-senha-protecao"
                      type="password"
                      value={confirmacaoSenhaProtecao}
                      onChange={(evento) => setConfirmacaoSenhaProtecao(evento.target.value)}
                      autoComplete="new-password"
                      placeholder="Repita a senha"
                    />
                  </div>
                )}
              </>
            )}

            <div className={styles.acoes}>
              <button type="button" className={styles.botaoSecundario} onClick={voltar}>
                <ChevronLeft size={16} />
                Voltar
              </button>

              <div className={styles.acoesDireita}>
                {!modoRevisao && !querProtegerAgora && (
                  <>
                    <button
                      type="button"
                      className={styles.botaoSecundario}
                      onClick={() => {
                        setQuerProtegerAgora(true)
                        setErro(null)
                      }}
                    >
                      Ativar agora
                    </button>
                    <button type="button" className={styles.botaoPrimario} onClick={() => void concluirOnboarding(false)}>
                      Fazer isso depois
                    </button>
                  </>
                )}

                {modoRevisao && (
                  <button type="button" className={styles.botaoPrimario} onClick={() => void concluirOnboarding(false)}>
                    Voltar para Configurações
                  </button>
                )}

                {!modoRevisao && querProtegerAgora && (
                  <button type="button" className={styles.botaoPrimario} onClick={() => void concluirOnboarding(true)} disabled={carregando}>
                    Ativar proteção e entrar
                  </button>
                )}
              </div>
            </div>
          </article>
        )}

        {erro && <p className={styles.mensagemErro}>{erro}</p>}
      </section>
    </div>
  )
}
