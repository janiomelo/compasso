import React from 'react'
import styles from './cartao.module.scss'
import clsx from 'clsx'

export interface PropriedadesCartao extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  clicavel?: boolean
}

export const Cartao = React.forwardRef<HTMLDivElement, PropriedadesCartao>(
  ({ children, clicavel = false, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          styles.cartao,
          {
            [styles['cartao--clicavel']]: clicavel,
          },
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Cartao.displayName = 'Cartao'
