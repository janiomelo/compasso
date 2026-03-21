import React from 'react'
import styles from './distintivo.module.scss'
import clsx from 'clsx'

export interface PropriedadesDistintivo extends React.HTMLAttributes<HTMLSpanElement> {
  rotulo: string
  cor?: 'sucesso' | 'aviso' | 'erro' | 'info' | 'padrao'
}

export const Distintivo = React.forwardRef<HTMLSpanElement, PropriedadesDistintivo>(
  ({ rotulo, cor = 'padrao', className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={clsx(
          styles.distintivo,
          styles[`distintivo--${cor}`],
          className
        )}
        {...props}
      >
        {rotulo}
      </span>
    )
  }
)

Distintivo.displayName = 'Distintivo'
