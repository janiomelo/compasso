// Hero da Página Principal — Pacote D
// Section com pausa ativa ou sem pausa, com CTA's principais

import { Link } from 'react-router-dom'
import { PauseCircle } from 'lucide-react'
import { usePausa, useEconomia } from '../../../ganchos'
import { formatarDuracao, formatarMoeda } from '../../../utilitarios/dados/formatacao'
import styles from '../pagina-principal.module.scss'

export const HeroPrincipal = () => {
  const { pausaAtiva, progresso } = usePausa()
  const { totalAcumulado, economiaConfigurada } = useEconomia()

  return (
    <section className={styles.hero}>
      <div className={styles.hero__conteudo}>
        <div className={styles.hero__icone}>
          <PauseCircle size={22} strokeWidth={2.2} />
        </div>

        <div className={styles.hero__bloco}>
          {pausaAtiva && progresso ? (
            <>
              <div className={styles.hero__texto}>
                <h2 className={styles.hero__titulo}>Pausa ativa</h2>
                <p className={styles.hero__descricao}>
                  {Math.round(progresso.percentualConclusao)}% concluídos e {formatarDuracao(progresso.restanteMs)} restantes.
                </p>
              </div>

              <div className={styles.hero__metricas}>
                {economiaConfigurada && (
                  <span>{formatarMoeda(pausaAtiva.valorEconomia)} em ganho estimado</span>
                )}
                <span>{formatarDuracao(pausaAtiva.duracaoPlanejada)} de meta total</span>
              </div>
            </>
          ) : (
            <>
              <div className={styles.hero__texto}>
                <h2 className={styles.hero__titulo}>Nenhuma pausa ativa</h2>
                <p className={styles.hero__descricao}>
                  Se quiser mais clareza do ritmo, inicie uma pausa curta.
                </p>
              </div>

              <div className={styles.hero__metricas}>
                {economiaConfigurada && totalAcumulado > 0 && (
                  <span>{formatarMoeda(totalAcumulado)} já acumulados</span>
                )}
              </div>
            </>
          )}
        </div>

        <div className={styles.hero__acoes}>
          <Link to="/pausa" className={styles.botaoPrimario}>
            {pausaAtiva ? 'Acompanhar pausa' : 'Iniciar pausa'}
          </Link>
        </div>
      </div>
    </section>
  )
}
