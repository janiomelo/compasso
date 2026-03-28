import { ChevronLeft } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { ReactNode } from 'react'
import styles from './pagina-texto-publico.module.scss'

type Props = {
  children: ReactNode
  voltarPara?: string
  rotuloVoltar?: string
}

export const PaginaTextoPublico = ({ children, voltarPara = '/', rotuloVoltar = 'Voltar' }: Props) => {
  const navegar = useNavigate()
  const temHistorico = typeof window !== 'undefined' && window.history.length > 1
  const voltarParaFinal = voltarPara

  const voltar = () => {
    if (temHistorico) {
      navegar(-1)
      return
    }

    navegar(voltarParaFinal)
  }

  return (
    <div className={styles.pagina}>
      <Link to="/" className={styles.marca} aria-label="Ir para a página inicial do Compasso">
        <span className={styles.marcaIcone}>
          <img src="/brand/compasso-navbar.svg" alt="" aria-hidden="true" />
        </span>
        <span className={styles.marcaTexto}>Compasso</span>
      </Link>

      <div className={styles.acoesTopo}>
        <button type="button" className={styles.botaoVoltar} onClick={voltar}>
          <ChevronLeft size={16} />
          <span>{rotuloVoltar}</span>
        </button>

        {!temHistorico && (
          <Link to={voltarParaFinal} className={styles.linkInicio}>
            Ir para início
          </Link>
        )}
      </div>

      <article className={styles.blocoLeitura}>{children}</article>

      <div className={styles.acoesCalcado}>
        <button type="button" className={styles.botaoVoltar} onClick={voltar}>
          <ChevronLeft size={16} />
          <span>{rotuloVoltar}</span>
        </button>
      </div>
    </div>
  )
}
