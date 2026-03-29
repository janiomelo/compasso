import { HeroPrincipal } from './componentes/HeroPrincipal'
import { CartaoUltimoRegistro, CartaoSeteDias, CartaoEconomia } from './componentes/CartoesMetricas'
import { ListaRegistrosRecentes } from './componentes/ListaRegistrosRecentes'
import { CTARegistro } from './componentes/CTARegistro'
import { ChecklistPosOnboarding } from './componentes/ChecklistPosOnboarding'
import styles from './pagina-principal.module.scss'

export const PaginaPrincipal = () => {
  return (
    <div className={styles.pagina}>
      <header className={styles.topo}>
        <span className={styles.eyebrow}>Início</span>
        <h1 className={styles.titulo}>Seu compasso recente</h1>
        <p className={styles.subtitulo}>Uma leitura rápida do momento, com foco em decisão e continuidade.</p>
      </header>

      <HeroPrincipal />

      <ChecklistPosOnboarding />

      <section className={styles.grade}>
        <CartaoUltimoRegistro />
        <CartaoSeteDias />
        <CartaoEconomia />
      </section>

      <CTARegistro />

      <ListaRegistrosRecentes limite={4} />
    </div>
  )
}
