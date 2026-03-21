// Lista de Registros Recentes — Pacote D
// Seção com lista de registros e link para ritmo completo

import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { FC } from 'react'
import { rotularMetodo, rotularIntencao } from '../../../utilitarios/apresentacao/rotulos'
import { formatarDataHora } from '../../../utilitarios/dados/formatacao'
import { useRegistro } from '../../../ganchos'
import styles from '../pagina-principal.module.scss'

export const ListaRegistrosRecentes: FC<{ limite?: number }> = ({ limite = 4 }) => {
  const { registrosRecentes } = useRegistro()
  const recentes = registrosRecentes(limite)

  return (
    <section className={styles.secao}>
      <div className={styles.secao__topo}>
        <h2 className={styles.secao__titulo}>Registros recentes</h2>
        <Link to="/ritmo" className={styles.linkInline}>Abrir ritmo <ArrowRight size={15} /></Link>
      </div>
      {recentes.length === 0 ? (
        <p className={styles.vazio}>Nenhum registro ainda. Adicione seu primeiro momento.</p>
      ) : (
        <ul className={styles.listaRegistros}>
          {recentes.map((registro) => (
            <li key={registro.id} className={styles.itemRegistro}>
              <div>
                <div className={styles.itemRegistro__titulo}>{rotularMetodo(registro.metodo)} <span>· {rotularIntencao(registro.intencao)}</span></div>
                <div className={styles.itemRegistro__subtitulo}>{formatarDataHora(registro.timestamp)}</div>
              </div>
              <span className={styles.itemRegistro__intensidade}>{registro.intensidade}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
