import { usePausa, useRegistro, useEconomia, useRitmo } from '../../ganchos'
import { formatarMoeda, formatarDuracao } from '../../utilitarios/dados/formatacao'
import styles from './pagina-principal.module.scss'

const ROTULOS_TENDENCIA = {
  aumentando: '↑ Aumentando',
  diminuindo: '↓ Diminuindo',
  estavel: '→ Estável',
} as const

export const PaginaPrincipal = () => {
  const { pausaAtiva, progresso } = usePausa()
  const { registrosHoje, registrosRecentes } = useRegistro()
  const { totalAcumulado } = useEconomia()
  const { tendencia, estatisticas } = useRitmo(7)

  return (
    <div className={styles.pagina}>
      <header className={styles.topo}>
        <h1 className={styles.titulo}>🧭 Compasso</h1>
        <p className={styles.subtitulo}>Acompanhe seu ritmo com privacidade radical.</p>
      </header>

      {pausaAtiva && progresso && (
        <section className={styles.cartao + ' ' + styles.cartaoPausa}>
          <div className={styles.cartaoLabel}>Pausa ativa</div>
          <div className={styles.pausaProgresso}>
            <div
              className={styles.pausaBarra}
              style={{ width: `${progresso.percentualConclusao}%` }}
              role="progressbar"
              aria-valuenow={progresso.percentualConclusao}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
          <div className={styles.pausaDetalhes}>
            <span>{formatarDuracao(progresso.decorridoMs)} decorrido</span>
            <span>{Math.round(progresso.percentualConclusao)}%</span>
            <span>{formatarDuracao(progresso.restanteMs)} restante</span>
          </div>
        </section>
      )}

      <section className={styles.resumo}>
        <div className={styles.cartao}>
          <div className={styles.cartaoLabel}>Hoje</div>
          <div className={styles.cartaoValor}>{registrosHoje.length}</div>
          <div className={styles.cartaoUnidade}>registro{registrosHoje.length !== 1 ? 's' : ''}</div>
        </div>
        <div className={styles.cartao}>
          <div className={styles.cartaoLabel}>7 dias</div>
          <div className={styles.cartaoValor}>{estatisticas.totalRegistros}</div>
          <div className={styles.cartaoUnidade}>registro{estatisticas.totalRegistros !== 1 ? 's' : ''}</div>
        </div>
        <div className={styles.cartao}>
          <div className={styles.cartaoLabel}>Economia</div>
          <div className={styles.cartaoValor}>{formatarMoeda(totalAcumulado)}</div>
          <div className={styles.cartaoUnidade}>acumulado</div>
        </div>
        <div className={styles.cartao}>
          <div className={styles.cartaoLabel}>Tendência</div>
          <div className={styles.cartaoValor + ' ' + styles['cartaoValor--tendencia']}>
            {ROTULOS_TENDENCIA[tendencia]}
          </div>
        </div>
      </section>

      <section className={styles.secao}>
        <h2 className={styles.secaoTitulo}>Últimos registros</h2>
        {registrosRecentes(5).length === 0 ? (
          <p className={styles.vazio}>Nenhum registro ainda. Adicione seu primeiro momento.</p>
        ) : (
          <ul className={styles.listaRegistros}>
            {registrosRecentes(5).map((registro) => (
              <li key={registro.id} className={styles.itemRegistro}>
                <div className={styles.itemRegistroMetodo}>{registro.metodo}</div>
                <div className={styles.itemRegistroIntencao}>{registro.intencao}</div>
                <div className={styles.itemRegistroIntensidade}>{registro.intensidade}</div>
                <time className={styles.itemRegistroHora} dateTime={new Date(registro.timestamp).toISOString()}>
                  {new Date(registro.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </time>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
