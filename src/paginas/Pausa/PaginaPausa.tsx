import { History, PauseCircle, PlayCircle, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { useApp, usePausa } from '../../ganchos'
import { rotularStatusPausa } from '../../utilitarios/apresentacao/rotulos'
import { formatarDuracao, formatarMoeda } from '../../utilitarios/dados/formatacao'
import { DURACOES_PAUSA, TEMPO_MINIMO_CONSIDERAR_PAUSA_MS } from '../../utilitarios/constantes'
import styles from './pagina-pausa.module.scss'

const OPCOES_DURACAO = [
  { chave: 'HORAS_24', rotulo: '24 horas', ms: DURACOES_PAUSA.HORAS_24 },
  { chave: 'HORAS_48', rotulo: '48 horas', ms: DURACOES_PAUSA.HORAS_48 },
  { chave: 'DIAS_7', rotulo: '7 dias', ms: DURACOES_PAUSA.DIAS_7 },
  { chave: 'DIAS_14', rotulo: '14 dias', ms: DURACOES_PAUSA.DIAS_14 },
] as const

export const PaginaPausa = () => {
  const { pausaAtiva, progresso, historico, iniciar, encerrar, cancelar } = usePausa()
  const { estado } = useApp()
  const [duracaoSelecionada, setDuracaoSelecionada] = useState(DURACOES_PAUSA.HORAS_24)
  const [aguardando, setAguardando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [mensagem, setMensagem] = useState<string | null>(null)

  const economiaHabilitada = estado.configuracoes.valorEconomia > 0

  const handleIniciar = async () => {
    setErro(null)
    setMensagem(null)
    setAguardando(true)

    try {
      await iniciar({ duracaoPlanejada: duracaoSelecionada })
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Falha ao iniciar pausa')
    } finally {
      setAguardando(false)
    }
  }

  const handleEncerrar = async () => {
    setErro(null)
    setMensagem(null)
    setAguardando(true)

    try {
      await encerrar('Concluída manualmente')
    } finally {
      setAguardando(false)
    }
  }

  const handleCancelar = async () => {
    setErro(null)
    setMensagem(null)
    setAguardando(true)

    try {
      const resultado = await cancelar('Cancelada pelo usuário')

      if (!resultado.registradaNoHistorico) {
        setMensagem('Pausa cancelada em menos de 5 minutos. Este ciclo não foi salvo no histórico.')
      }
    } finally {
      setAguardando(false)
    }
  }

  const ultimasCinco = historico.slice(0, 5)

  return (
    <div className={styles.pagina}>
      <header className={styles.topo}>
        <span className={styles.eyebrow}>Pausa</span>
        <h1 className={styles.titulo}>Pausa de Compasso</h1>
        <p className={styles.subtitulo}>Acompanhe o progresso, visualize sua meta e decida quando encerrar.</p>
      </header>

      {pausaAtiva && progresso ? (
        <section className={styles.hero + ' ' + styles['hero--ativa']}>
          <div className={styles.hero__icone}>
            <PauseCircle size={28} strokeWidth={2.2} />
          </div>

          <div className={styles.hero__texto}>
            <h2 className={styles.hero__titulo}>Sua pausa está em andamento</h2>
            <p className={styles.hero__descricao}>Concluir fica disponível após 5 minutos. Cancelar antes de 5 minutos descarta este ciclo; após isso, registra como interrompida.</p>
          </div>

          <div className={styles.cronometro}>
            <div className={styles.cronometroValor}>
              {formatarDuracao(progresso.decorridoMs)}
            </div>
            <div className={styles.cronometroRotulo}>decorrido</div>
          </div>

          <div className={styles.barraContainer}>
            <div
              className={styles.barra}
              style={{ width: `${progresso.percentualConclusao}%` }}
              role="progressbar"
              aria-valuenow={progresso.percentualConclusao}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>

          <div
            className={
              styles.pausaInfos +
              (economiaHabilitada ? '' : ' ' + styles['pausaInfos--semEconomia'])
            }
          >
            <div className={styles.pausaInfo}>
              <span className={styles.pausaInfoRotulo}>Restante</span>
              <span className={styles.pausaInfoValor}>{formatarDuracao(progresso.restanteMs)}</span>
            </div>
            <div className={styles.pausaInfo}>
              <span className={styles.pausaInfoRotulo}>Meta</span>
              <span className={styles.pausaInfoValor}>{formatarDuracao(pausaAtiva.duracaoPlanejada)}</span>
            </div>
            {economiaHabilitada && (
              <div className={styles.pausaInfo}>
                <span className={styles.pausaInfoRotulo}>Economia</span>
                <span className={styles.pausaInfoValor}>{formatarMoeda(pausaAtiva.valorEconomia)}</span>
              </div>
            )}
          </div>

          <div className={styles.acoes}>
            {progresso.decorridoMs >= TEMPO_MINIMO_CONSIDERAR_PAUSA_MS && (
              <button
                className={styles.botaoPrimario}
                onClick={handleEncerrar}
                disabled={aguardando}
              >
                Concluir pausa
              </button>
            )}
            <button
              className={styles.botaoSecundario}
              onClick={handleCancelar}
              disabled={aguardando}
            >
              Cancelar pausa
            </button>
          </div>

          {progresso.decorridoMs < TEMPO_MINIMO_CONSIDERAR_PAUSA_MS && (
            <p className={styles.hero__nota}>
              Concluir disponível em {formatarDuracao(TEMPO_MINIMO_CONSIDERAR_PAUSA_MS - progresso.decorridoMs)}.
            </p>
          )}
        </section>
      ) : (
        <section className={styles.hero}>
          <div className={styles.hero__icone}>
            <PlayCircle size={28} strokeWidth={2.2} />
          </div>
          <div className={styles.hero__texto}>
            <h2 className={styles.hero__titulo}>Começar uma pausa</h2>
            <p className={styles.hero__descricao}>Uma pausa curta já ajuda a observar padrões, clarear rotina e ganhar contraste para decidir melhor.</p>
          </div>

          <div className={styles.opcoesGrid}>
            {OPCOES_DURACAO.map((opcao) => (
              <button
                key={opcao.chave}
                className={
                  styles.opcaoDuracao +
                  (duracaoSelecionada === opcao.ms ? ' ' + styles['opcaoDuracao--ativa'] : '')
                }
                onClick={() => setDuracaoSelecionada(opcao.ms)}
              >
                <span className={styles.opcaoDuracao__titulo}>{opcao.rotulo}</span>
                <span className={styles.opcaoDuracao__subtitulo}>pausa guiada</span>
              </button>
            ))}
          </div>

          {erro && <p className={styles.erro}>{erro}</p>}

          <button
            className={styles.botaoPrimario + ' ' + styles.botaoIniciar}
            onClick={handleIniciar}
            disabled={aguardando}
          >
            {aguardando ? 'Iniciando...' : 'Iniciar pausa'}
          </button>

          <div className={styles.hero__nota}>
            <Sparkles size={16} />
            <span>Durante a pausa, você pode cancelar a qualquer momento. A opção de concluir aparece após 5 minutos.</span>
          </div>

          {mensagem && <p className={styles.aviso}>{mensagem}</p>}
        </section>
      )}

      {ultimasCinco.length > 0 && (
        <section className={styles.historico}>
          <div className={styles.historico__topo}>
            <History size={18} />
            <h2 className={styles.secaoTitulo}>Histórico recente</h2>
          </div>
          <ul className={styles.lista}>
            {ultimasCinco.map((pausa) => (
              <li key={pausa.id} className={styles.itemHistorico}>
                <span className={styles.itemStatus + ' ' + styles[`itemStatus--${pausa.status}`]}>
                  {rotularStatusPausa(pausa.status)}
                </span>
                <span className={styles.itemDuracao}>
                  {formatarDuracao(pausa.duracaoReal ?? pausa.duracaoPlanejada)}
                </span>
                {economiaHabilitada && (
                  <span className={styles.itemEconomia}>{formatarMoeda(pausa.valorEconomia)}</span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
