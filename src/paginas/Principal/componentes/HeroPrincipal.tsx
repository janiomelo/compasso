// Hero da Página Principal — Pacote D
// Section com pausa ativa ou sem pausa, com CTA's principais

import { Link } from 'react-router-dom'
import { PauseCircle } from 'lucide-react'
import { usePausa, useRegistro, useEconomia } from '../../../ganchos'
import { formatarDuracao, formatarMoeda } from '../../../utilitarios/dados/formatacao'
import styles from '../pagina-principal.module.scss'

export const HeroPrincipal = () => {
  const { pausaAtiva, progresso } = usePausa()
  const { registrosHoje } = useRegistro()
  const { totalAcumulado } = useEconomia()

  return (
    <section className={styles.hero}>
      <div className={styles.hero__conteudo}>
        <div className={styles.hero__icone}>
          <PauseCircle size={22} strokeWidth={2.2} />
        </div>

        {pausaAtiva && progresso ? (
          <>
            <div className={styles.hero__texto}>
              <span className={styles.hero__kicker}>Pausa ativa</span>
              <h2 className={styles.hero__titulo}>Você já percorreu {Math.round(progresso.percentualConclusao)}% da pausa.</h2>
              <p className={styles.hero__descricao}>
                {formatarDuracao(progresso.decorridoMs)} já passaram e faltam {formatarDuracao(progresso.restanteMs)} para completar a meta.
              </p>
            </div>

            <div className={styles.hero__progresso}>
              <div
                className={styles.hero__barra}
                style={{ width: `${progresso.percentualConclusao}%` }}
                role="progressbar"
                aria-valuenow={progresso.percentualConclusao}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>

            <div className={styles.hero__metricas}>
              <span>{formatarDuracao(pausaAtiva.duracaoPlanejada)} de meta</span>
              <span>{formatarMoeda(pausaAtiva.valorEconomia)} em economia prevista</span>
            </div>
          </>
        ) : (
          <>
            <div className={styles.hero__texto}>
              <span className={styles.hero__kicker}>Sem pausa ativa</span>
              <h2 className={styles.hero__titulo}>Nenhuma pausa ativa</h2>
              <p className={styles.hero__descricao}>
                Se quiser observar melhor o seu ritmo, uma pausa curta já cria contraste suficiente para perceber padrões.
              </p>
            </div>
            <div className={styles.hero__metricas}>
              <span>{registrosHoje.length} registro{registrosHoje.length !== 1 ? 's' : ''} hoje</span>
              <span>{formatarMoeda(totalAcumulado)} já acumulados</span>
            </div>
          </>
        )}

        <div className={styles.hero__acoes}>
          <Link to={pausaAtiva ? '/pausa' : '/pausa'} className={styles.botaoPrimario}>
            {pausaAtiva ? 'Abrir pausa' : 'Iniciar pausa'}
          </Link>
          <Link to="/registro" className={styles.botaoSecundario}>
            Registrar momento
          </Link>
        </div>
      </div>
    </section>
  )
}
