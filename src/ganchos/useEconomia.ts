import { useMemo } from 'react'
import { useApp } from './useApp'
import {
  calcularEconomiaAcumulada,
  calcularEconomiaDiaria,
} from '../utilitarios/dados/calculos'

export const useEconomia = () => {
  const { estado } = useApp()
  const { historicoPausa, configuracoes } = estado

  const totalAcumulado = useMemo(
    () => calcularEconomiaAcumulada(historicoPausa),
    [historicoPausa],
  )

  const taxaDiaria = useMemo(
    () => calcularEconomiaDiaria(historicoPausa, 30),
    [historicoPausa],
  )

  const economiaUltimaPausa = useMemo(() => {
    const ultima = historicoPausa.find((p) => p.status === 'concluida')
    return ultima?.valorEconomia ?? 0
  }, [historicoPausa])

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
