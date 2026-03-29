import { HeroPrincipal } from './componentes/HeroPrincipal'
import { CartaoUltimoRegistro, CartaoSeteDias, CartaoEconomia } from './componentes/CartoesMetricas'
import { ListaRegistrosRecentes } from './componentes/ListaRegistrosRecentes'
import { CTARegistro } from './componentes/CTARegistro'
import { ChecklistPosOnboarding } from './componentes/ChecklistPosOnboarding'
import { SecaoEntendaCompasso } from './componentes/SecaoEntendaCompasso'
import { useRegistro } from '../../ganchos'
import styles from './pagina-principal.module.scss'

export const PaginaPrincipal = () => {
  const { registros } = useRegistro()
  const estadoVazio = registros.length === 0

  return (
    <div className={styles.pagina}>
      <header className={styles.topo}>
        <span className={styles.eyebrow}>Início</span>
        <h1 className={styles.titulo}>Seu compasso recente</h1>
        <p className={styles.subtitulo}>Um espaço pessoal para pessoas adultas registrarem momentos, acompanharem pausas e observarem padrões com privacidade por padrão neste dispositivo.</p>
      </header>

      <HeroPrincipal />

      <ChecklistPosOnboarding />

      <SecaoEntendaCompasso />

      {estadoVazio ? (
        <section className={styles.estadoVazio} aria-label="Primeiro passo na home">
          <p className={styles.estadoVazio__descricao}>
            Comece com um registro rápido. A partir dele, a home mostra seu ritmo e próximos insights com mais contexto.
          </p>
          <CTARegistro />
        </section>
      ) : (
        <>
          <section className={styles.grade}>
            <CartaoUltimoRegistro />
            <CartaoSeteDias />
            <CartaoEconomia />
          </section>

          <CTARegistro />

          <ListaRegistrosRecentes limite={4} />
        </>
      )}

    </div>
  )
}
