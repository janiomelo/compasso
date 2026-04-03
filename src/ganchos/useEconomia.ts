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

  const possuiHistoricoEconomia = useMemo(
    () => historicoPausa.some((p) => p.status === 'concluida'),
    [historicoPausa],
  )

  const economiaConfigurada = useMemo(
    () => configuracoes.valorEconomia > 0,
    [configuracoes.valorEconomia],
  )

  const moedaEconomia = useMemo(
    () => configuracoes.moedaEconomia,
    [configuracoes.moedaEconomia],
  )

  return {
    totalAcumulado,
    taxaDiaria,
    economiaUltimaPausa,
    projecao30Dias,
    possuiHistoricoEconomia,
    economiaConfigurada,
    moedaEconomia,
  }
}
