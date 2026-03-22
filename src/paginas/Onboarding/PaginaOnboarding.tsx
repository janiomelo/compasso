import { ChevronLeft, ExternalLink, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp, useArmazenamento } from '../../ganchos'
import { VERSAO_POLITICA_PRIVACIDADE, VERSAO_TERMOS_USO } from '../../utilitarios/constantes'
import styles from './pagina-onboarding.module.scss'

const URL_SOBRE_PROJETO = 'https://github.com/janiomelo/compasso/blob/main/docs/transparencia/SOBRE-E-TRANSPARENCIA.md'
const URL_POLITICA = 'https://github.com/janiomelo/compasso/blob/main/docs/transparencia/POLITICA-DE-PRIVACIDADE.md'
const URL_TERMOS = 'https://github.com/janiomelo/compasso/blob/main/docs/transparencia/TERMOS-DE-USO.md'

const TOTAL_ETAPAS = 5

export const PaginaOnboarding = ({ modoRevisao = false }: { modoRevisao?: boolean }) => {
  const navegar = useNavigate()
  const { estado, despacho } = useApp()
  const { salvarConfiguracoes, carregando } = useArmazenamento()

  const [etapaAtual, setEtapaAtual] = useState(1)
  const [confirmouMaioridade, setConfirmouMaioridade] = useState(false)
  const [aceitouTermosPrivacidade, setAceitouTermosPrivacidade] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

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

    const onboarding = {
      concluidoEm: agora,
      confirmouMaioridadeEm: agora,
      aceitouTermosPrivacidadeEm: agora,
      versaoTermos: VERSAO_TERMOS_USO,
      versaoPolitica: VERSAO_POLITICA_PRIVACIDADE,
    }

    try {
      setErro(null)

      const novasConfiguracoes = {
        ...estado.configuracoes,
        onboarding,
      }

      await salvarConfiguracoes(novasConfiguracoes)
      despacho({ tipo: 'DEFINIR_CONFIGURACAO', payload: { onboarding } })
      navegar('/', { replace: true })
    } catch {
      setErro('Não foi possível concluir o onboarding agora. Tente novamente em instantes.')
    }
  }

  return (
    <div className={styles.pagina}>
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
            <h1>Um espaço pessoal para acompanhar seu ritmo</h1>
            <p>
              Registre momentos, acompanhe pausas e observe seu equilíbrio recente com uma rotina simples e privada por padrão.
            </p>
            <div className={styles.acoes}>
              <button type="button" className={styles.botaoPrimario} onClick={avancar}>
                Começar
              </button>
              <a href={URL_SOBRE_PROJETO} target="_blank" rel="noreferrer" className={styles.linkSecundario}>
                <span>Entender melhor o projeto</span>
                <ExternalLink size={14} />
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
                Entender e continuar
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
              <li>Você pode exportar, importar ou apagar os dados quando quiser.</li>
            </ul>
            <div className={styles.acoes}>
              <button type="button" className={styles.botaoSecundario} onClick={voltar}>
                <ChevronLeft size={16} />
                Voltar
              </button>
              <div className={styles.acoesDireita}>
                <a href={URL_POLITICA} target="_blank" rel="noreferrer" className={styles.linkSecundario}>
                  <span>Ler política de privacidade</span>
                  <ExternalLink size={14} />
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
                checked={confirmouMaioridade}
                onChange={(evento) => setConfirmouMaioridade(evento.target.checked)}
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
                disabled={!modoRevisao && !confirmouMaioridade}
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
              Para usar o Compasso, você precisa concordar com os Termos de Uso e a Política de Privacidade desta fase do projeto.
            </p>

            <label className={styles.checkboxLinha}>
              <input
                type="checkbox"
                checked={aceitouTermosPrivacidade}
                onChange={(evento) => setAceitouTermosPrivacidade(evento.target.checked)}
              />
              <span>Li e aceito os Termos de Uso e a Política de Privacidade</span>
            </label>

            <div className={styles.linksLinha}>
              <a href={URL_TERMOS} target="_blank" rel="noreferrer" className={styles.linkSecundario}>
                <span>Termos de Uso</span>
                <ExternalLink size={14} />
              </a>
              <a href={URL_POLITICA} target="_blank" rel="noreferrer" className={styles.linkSecundario}>
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
                disabled={(!modoRevisao && !aceitouTermosPrivacidade) || carregando}
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
