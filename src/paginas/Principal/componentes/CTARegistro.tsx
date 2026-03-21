// CTA de Registro — Pacote D
// Botão de chamada para ação de registro

import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import type { FC } from 'react'
import styles from '../pagina-principal.module.scss'

export const CTARegistro: FC = () => (
  <Link to="/registro" className={styles.ctaRegistro}>
    <div>
      <span className={styles.ctaRegistro__eyebrow}>Registrar momento</span>
      <strong className={styles.ctaRegistro__titulo}>Registre como você está agora</strong>
    </div>
    <span className={styles.ctaRegistro__icone}><Sparkles size={20} /></span>
  </Link>
)
