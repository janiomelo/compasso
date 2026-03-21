import React from 'react'
import styles from './modal.module.scss'
import clsx from 'clsx'

export interface PropriedadesModal {
  aberto: boolean
  titulo?: string
  aoFechar: () => void
  children: React.ReactNode
  className?: string
}

export const Modal: React.FC<PropriedadesModal> = ({
  aberto,
  titulo,
  aoFechar,
  children,
  className,
}) => {
  React.useEffect(() => {
    if (aberto) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [aberto])

  if (!aberto) return null

  return (
    <div className={styles['modal-backdrop']} onClick={aoFechar}>
      <div
        className={clsx(styles.modal, className)}
        onClick={(e) => e.stopPropagation()}
      >
        {titulo && (
          <div className={styles['modal-header']}>
            <h2>{titulo}</h2>
            <button
              className={styles['modal-fechar']}
              onClick={aoFechar}
              aria-label="Fechar modal"
            >
              ✕
            </button>
          </div>
        )}
        <div className={styles['modal-corpo']}>{children}</div>
      </div>
    </div>
  )
}

Modal.displayName = 'Modal'
