import React from 'react'
import styles from './botao.module.scss'
import clsx from 'clsx'

export interface PropriedadesBotao extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: 'primaria' | 'secundaria' | 'vazia' | 'perigosa'
  tamanho?: 'pequeno' | 'medio' | 'grande'
  desativado?: boolean
  carregando?: boolean
  children: React.ReactNode
}

export const Botao = React.forwardRef<HTMLButtonElement, PropriedadesBotao>(
  (
    {
      variante = 'primaria',
      tamanho = 'medio',
      desativado = false,
      carregando = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={clsx(
          styles.botao,
          styles[`botao--${variante}`],
          styles[`botao--${tamanho}`],
          {
            [styles['botao--desativado']]: desativado || carregando,
          },
          className
        )}
        disabled={desativado || carregando}
        {...props}
      >
        {carregando ? '⏳ ...' : children}
      </button>
    )
  }
)

Botao.displayName = 'Botao'
