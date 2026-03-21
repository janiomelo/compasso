import { useMemo } from 'react'
import { useApp } from './useApp'
import {
  calcularFrequencia,
  calcularTendencia,
  calcularEstatisticas,
  calcularPercentualReducao,
} from '../utilitarios/dados/calculos'

export const useRitmo = (dias = 7) => {
  const { estado } = useApp()
  const { registros } = estado

  const frequencia7Dias = useMemo(
    () => calcularFrequencia(registros, 7),
    [registros],
  )

  const frequencia30Dias = useMemo(
    () => calcularFrequencia(registros, 30),
    [registros],
  )

  const tendencia = useMemo(
    () => calcularTendencia(dias <= 7 ? frequencia7Dias : frequencia30Dias),
    [dias, frequencia7Dias, frequencia30Dias],
  )

  const estatisticas = useMemo(
    () => calcularEstatisticas(registros, dias),
    [registros, dias],
  )

  const percentualReducao = useMemo(() => {
    // compara semana anterior com semana atual
    const agora = Date.now()
    const semanaMs = 7 * 24 * 60 * 60 * 1000
    const registrosSemanaAtual = registros.filter((r) => r.timestamp >= agora - semanaMs).length
    const registrosSemanaAnterior = registros.filter(
      (r) => r.timestamp >= agora - 2 * semanaMs && r.timestamp < agora - semanaMs,
    ).length

    return calcularPercentualReducao(registrosSemanaAnterior, registrosSemanaAtual)
  }, [registros])

  return {
    frequencia7Dias,
    frequencia30Dias,
    tendencia,
    estatisticas,
    percentualReducao,
  }
}
