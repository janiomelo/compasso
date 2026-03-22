import { useEffect, useState } from 'react'

export const useConectividade = () => {
  const [online, setOnline] = useState(() => navigator.onLine)

  useEffect(() => {
    const aoEntrarOnline = () => setOnline(true)
    const aoEntrarOffline = () => setOnline(false)

    window.addEventListener('online', aoEntrarOnline)
    window.addEventListener('offline', aoEntrarOffline)

    return () => {
      window.removeEventListener('online', aoEntrarOnline)
      window.removeEventListener('offline', aoEntrarOffline)
    }
  }, [])

  return {
    online,
    offline: !online,
  }
}
