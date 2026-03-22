import { CloudOff } from 'lucide-react'
import { useConectividade } from '../../ganchos/useConectividade'

export const AvisoOffline = () => {
  const { offline } = useConectividade()

  if (!offline) {
    return null
  }

  return (
    <div className="aviso-offline" role="status" aria-live="polite">
      <CloudOff size={16} />
      <span>
        Você está offline. O app segue funcionando localmente, mas algumas métricas em tempo real e sincronizações
        ficarão desabilitadas ou enfileiradas.
      </span>
    </div>
  )
}
