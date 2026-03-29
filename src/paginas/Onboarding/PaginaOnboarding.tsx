import { ChevronLeft, ExternalLink, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp, useArmazenamento } from '../../ganchos'
import { useTelemetria } from '../../ganchos/useTelemetria'
import { VERSAO_POLITICA_PRIVACIDADE, VERSAO_TERMOS_USO } from '../../utilitarios/constantes'
import styles from './pagina-onboarding.module.scss'

const URL_SOBRE_PROJETO = '/projeto'
const URL_POLITICA = '/privacidade'
const URL_TERMOS = '/termos'

const TOTAL_ETAPAS = 3

export const PaginaOnboarding = ({ modoRevisao = false }: { modoRevisao?: boolean }) => {
  const navegar = useNavigate()
  const { estado, despacho } = useApp()
  const { salvarConfiguracoes, carregando } = useArmazenamento()
  const { rastrearEvento } = useTelemetria()

  const [etapaAtual, setEtapaAtual] = useState(1)
  const [confirmouMaioridade, setConfirmouMaioridade] = useState(false)
  const [aceitouTermosPrivacidade, setAceitouTermosPrivacidade] = useState(false)
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

  const concluirOnboarding = async () => {
    if (modoRevisao) {
      navegar('/config', { replace: true })
      return
    }

    const agora = Date.now()
    const telemetria = estado.configuracoes.telemetria?.consentido === null
      ? {
          consentido: true,
          atualizadoEm: agora,
        }
      : (estado.configuracoes.telemetria ?? {
          consentido: true,
          atualizadoEm: agora,
        })

    const onboarding = {
      concluidoEm: agora,
      confirmouMaioridadeEm: agora,
      aceitouTermosPrivacidadeEm: agora,
      versaoTermos: VERSAO_TERMOS_USO,
      versaoPolitica: VERSAO_POLITICA_PRIVACIDADE,
      posOnboarding: {
        intiniado: agora,
        checklist: [
          { id: 'dados-locais' as const },
          { id: 'telemetria' as const },
          { id: 'protecao-senha' as const },
          { id: 'primeiro-registro' as const },
        ],
      },
    }

    try {
      setErro(null)

      const novasConfiguracoes = {
        ...estado.configuracoes,
        telemetria,
        onboarding,
      }

      await salvarConfiguracoes(novasConfiguracoes)
      despacho({
        tipo: 'DEFINIR_CONFIGURACAO',
        payload: {
          telemetria,
          onboarding,
        },
      })
      rastrearEvento('conclusao_onboarding', {
        etapas: TOTAL_ETAPAS,
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
              <li>Uso permitido apenas para maiores de 18 anos</li>
            </ul>

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

        {etapaAtual === 3 && (
          <article className={styles.etapa}>
            <div className={styles.tituloComIcone}>
              <ShieldCheck size={20} />
              <h1>Aceite e entrada</h1>
            </div>
            <p>
              Para usar o Compasso, você precisa concordar com os Termos de Uso e a Política de Privacidade. Nesta fase, seus registros ficam neste dispositivo.
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
                onClick={() => void concluirOnboarding()}
                disabled={(!modoRevisao && !aceitouTermosPrivacidadeMarcado) || carregando}
              >
                {modoRevisao ? 'Voltar para Configurações' : 'Entrar no Compasso'}
              </button>
            </div>
          </article>
        )}

        {erro && <p className={styles.mensagemErro}>{erro}</p>}
      </section>
    </div>
  )
}
