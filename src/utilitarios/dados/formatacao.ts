import { MOEDAS } from '../constantes'

/**
 * Formata data para string legível
 * Ex: "21 de março de 2026"
 */
export const formatarData = (data: Date | number): string => {
  const d = typeof data === 'number' ? new Date(data) : data
  return d.toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Formata data e hora
 * Ex: "21 de março de 2026 às 14:30"
 */
export const formatarDataHora = (data: Date | number): string => {
  const d = typeof data === 'number' ? new Date(data) : data
  return d.toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Formata hora (HH:mm:ss)
 */
export const formatarHora = (data: Date | number): string => {
  const d = typeof data === 'number' ? new Date(data) : data
  return d.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

/**
 * Formata moeda
 * Ex: formatarMoeda(100, 'BRL') => "R$ 100,00"
 */
export const formatarMoeda = (valor: number, moeda: keyof typeof MOEDAS = 'BRL'): string => {
  const config = MOEDAS[moeda]
  return new Intl.NumberFormat(config.localizacao, {
    style: 'currency',
    currency: moeda,
  }).format(valor)
}

/**
 * Formata duração em ms para string legível
 * Ex: formatarDuracao(3661000) => "1h 1m 1s"
 */
export const formatarDuracao = (ms: number): string => {
  const totalSegundos = Math.floor(ms / 1000)
  const horas = Math.floor(totalSegundos / 3600)
  const minutos = Math.floor((totalSegundos % 3600) / 60)
  const segundos = totalSegundos % 60

  const partes = []
  if (horas > 0) partes.push(`${horas}h`)
  if (minutos > 0) partes.push(`${minutos}m`)
  if (segundos > 0 || partes.length === 0) partes.push(`${segundos}s`)

  return partes.join(' ')
}

/**
 * Formata número com separador de milhares
 * Ex: formatarNumero(1000) => "1.000"
 */
export const formatarNumero = (valor: number, casasDecimais: number = 0): string => {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: casasDecimais,
    maximumFractionDigits: casasDecimais,
  }).format(valor)
}

/**
 * Trunca string e adiciona "..."
 */
export const truncarString = (str: string, limite: number = 50): string => {
  return str.length > limite ? str.slice(0, limite) + '...' : str
}
