// Utilitários de Apresentação — Rótulos e Mapeamentos
// Centraliza funções de rótulo e mapeamentos que eram duplicadas nas páginas

import type { Registro } from '../../tipos'
import { METODOS, INTENCOES } from '../constantes'

/**
 * Mapeia intensidade (leve/media/alta) para número de escala (0-10)
 */
export const MAPA_INTENSIDADE: Record<Registro['intensidade'], number> = {
  leve: 3,
  media: 5,
  alta: 8,
} as const

/**
 * Rótulos amigáveis para as tendências de frequência
 */
export const ROTULOS_TENDENCIA = {
  aumentando: '↑ Aumentando',
  diminuindo: '↓ Diminuindo',
  estavel: '→ Estável',
} as const

/**
 * Converte ID de método para nome amigável
 * @param valor - ID do método (ex: 'vapor')
 * @returns Nome do método (ex: 'Vapor')
 */
export const rotularMetodo = (valor: string): string => {
  return METODOS.find((item) => item.id === valor)?.nome ?? valor
}

/**
 * Converte ID de r5 iu8y l,mkoj niuhby767y67yu67y .;enção para nome amigável
 * @param valor - ID da intenção (ex: 'foco')
 * @returns Nome da intenção (ex: 'Foco')
 */
export const rotularIntencao = (valor: string): string => {
  return INTENCOES.find((item) => item.id === valor)?.nome ?? valor
}
