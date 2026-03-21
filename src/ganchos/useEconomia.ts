import { useMemo } from 'react'
import { useApp } from './useApp'
import {
  calcularEconomiaAcumulada,
  calcularEconomiaDiaria,
} from '../utilitarios/dados/calculos'

export const useEconomia = () => {
  const { estado } = useApp()
  const { historioPausa, configuracoes } = estado

  const totalAcumulado = useMemo(
    () => calcularEconomiaAcumulada(historioPausa),
    [historioPausa],
  )

  const taxaDiaria = useMemo(
    () => calcularEconomiaDiaria(historioPausa, 30),
    [historioPausa],
  )

  const economiaUltimaPausa = useMemo(() => {
    const ultima = historioPausa.find((p) => p.status === 'concluida')
    return ultima?.valorEconomia ?? 0
  }, [historioPausa])

  const projecao30Dias = useMemo(
    () => taxaDiaria * 30,
    [taxaDiaria],
  )

  // economia potencial da pausa ativa (calculado com o valorEconomia configurado)
  const economiaPotencialPausaAtiva = useMemo(() => {
    if (!estado.pausaAtiva) {
      return 0
    }

    return estado.pausaAtiva.valorEconomia > 0
      ? estado.pausaAtiva.valorEconomia
      : configuracoes.valorEconomia
  }, [estado.pausaAtiva, configuracoes.valorEconomia])

  return {
    totalAcumulado,
    taxaDiaria,
    economiaUltimaPausa,
    projecao30Dias,
    economiaPotencialPausaAtiva,
  }
}
