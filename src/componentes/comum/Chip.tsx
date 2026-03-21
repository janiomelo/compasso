import React from 'react'
import styles from './chip.module.scss'
import clsx from 'clsx'

export interface PropriedadesChip extends React.HTMLAttributes<HTMLButtonElement> {
  rotulo: string
  selecionado?: boolean
  removivel?: boolean
  onRemover?: () => void
  variante?: 'padrao' | 'sucesso' | 'aviso' | 'erro'
}

export const Chip = React.forwardRef<HTMLButtonElement, PropriedadesChip>(
  (
    {
      rotulo,
      selecionado = false,
      removivel = false,
      onRemover,
      variante = 'padrao',
      className,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={clsx(
          styles.chip,
          styles[`chip--${variante}`],
          {
            [styles['chip--selecionado']]: selecionado,
          },
          className
        )}
        {...props}
      >
        <span>{rotulo}</span>
        {removivel && (
          <button
            className={styles['chip-remover']}
            onClick={(e) => {
              e.stopPropagation()
              onRemover?.()
            }}
            type="button"
            aria-label={`Remover ${rotulo}`}
          >
            ✕
          </button>
        )}
      </button>
    )
  }
)

Chip.displayName = 'Chip'
