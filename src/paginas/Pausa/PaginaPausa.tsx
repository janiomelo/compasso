import { useState } from 'react'
import { usePausa } from '../../ganchos'
import { formatarDuracao, formatarMoeda } from '../../utilitarios/dados/formatacao'
import { DURACOES_PAUSA } from '../../utilitarios/constantes'
import styles from './pagina-pausa.module.scss'

const OPCOES_DURACAO = [
  { chave: 'HORAS_24', rotulo: '24 horas', ms: DURACOES_PAUSA.HORAS_24 },
  { chave: 'HORAS_48', rotulo: '48 horas', ms: DURACOES_PAUSA.HORAS_48 },
  { chave: 'DIAS_7', rotulo: '7 dias', ms: DURACOES_PAUSA.DIAS_7 },
  { chave: 'DIAS_14', rotulo: '14 dias', ms: DURACOES_PAUSA.DIAS_14 },
] as const

export const PaginaPausa = () => {
  const { pausaAtiva, progresso, historico, iniciar, encerrar, interromper } = usePausa()
  const [duracaoSelecionada, setDuracaoSelecionada] = useState(DURACOES_PAUSA.HORAS_24)
  const [aguardando, setAguardando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const handleIniciar = async () => {
    setErro(null)
    setAguardando(true)

    try {
      await iniciar({ duracaoPlanjada: duracaoSelecionada })
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Falha ao iniciar pausa')
    } finally {
      setAguardando(false)
    }
  }

  const handleEncerrar = async () => {
    setAguardando(true)

    try {
      await encerrar('Concluída manualmente')
    } finally {
      setAguardando(false)
    }
  }

  const handleInterromper = async () => {
    setAguardando(true)

    try {
      await interromper('Interrompida pelo usuário')
    } finally {
      setAguardando(false)
    }
  }

  const ultimasCinco = historico.slice(0, 5)

  return (
    <div className={styles.pagina}>
      <header className={styles.topo}>
        <h1 className={styles.titulo}>Pausa de Compasso</h1>
        <p className={styles.subtitulo}>Períodos de clareza intencional.</p>
      </header>

      {pausaAtiva && progresso ? (
        <section className={styles.pausaAtiva}>
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

          <div className={styles.pausaInfos}>
            <div className={styles.pausaInfo}>
              <span className={styles.pausaInfoRotulo}>Restante</span>
              <span className={styles.pausaInfoValor}>{formatarDuracao(progresso.restanteMs)}</span>
            </div>
            <div className={styles.pausaInfo}>
              <span className={styles.pausaInfoRotulo}>Meta</span>
              <span className={styles.pausaInfoValor}>{formatarDuracao(pausaAtiva.duracaoPlanjada)}</span>
            </div>
            <div className={styles.pausaInfo}>
              <span className={styles.pausaInfoRotulo}>Economia</span>
              <span className={styles.pausaInfoValor}>{formatarMoeda(pausaAtiva.valorEconomia)}</span>
            </div>
          </div>

          <div className={styles.acoes}>
            <button
              className={styles.botaoPrimario}
              onClick={handleEncerrar}
              disabled={aguardando}
            >
              Concluir pausa
            </button>
            <button
              className={styles.botaoSecundario}
              onClick={handleInterromper}
              disabled={aguardando}
            >
              Interromper
            </button>
          </div>
        </section>
      ) : (
        <section className={styles.iniciar}>
          <h2 className={styles.secaoTitulo}>Iniciar nova pausa</h2>

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
                {opcao.rotulo}
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
        </section>
      )}

      {ultimasCinco.length > 0 && (
        <section className={styles.historico}>
          <h2 className={styles.secaoTitulo}>Histórico recente</h2>
          <ul className={styles.lista}>
            {ultimasCinco.map((pausa) => (
              <li key={pausa.id} className={styles.itemHistorico}>
                <span className={styles.itemStatus + ' ' + styles[`itemStatus--${pausa.status}`]}>
                  {pausa.status}
                </span>
                <span className={styles.itemDuracao}>
                  {formatarDuracao(pausa.duracaoReal ?? pausa.duracaoPlanjada)}
                </span>
                <span className={styles.itemEconomia}>{formatarMoeda(pausa.valorEconomia)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
