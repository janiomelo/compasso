// Constantes da Aplicação — Compasso

// Métodos disponíveis
export const METODOS = [
  { id: 'vapor', nome: 'Vapor' },
  { id: 'flor', nome: 'Flor' },
  { id: 'extracao', nome: 'Extração' },
  { id: 'outro', nome: 'Outro' },
] as const

// Intenções disponíveis
export const INTENCOES = [
  { id: 'paz', nome: 'Paz' },
  { id: 'foco', nome: 'Foco' },
  { id: 'social', nome: 'Social' },
  { id: 'descanso', nome: 'Descanso' },
  { id: 'criatividade', nome: 'Criatividade' },
  { id: 'outro', nome: 'Outro' },
] as const

// Intensidades disponíveis
export const INTENSIDADES = [
  { id: 'leve', nome: 'Leve', valor: 1 },
  { id: 'media', nome: 'Média', valor: 2 },
  { id: 'alta', nome: 'Alta', valor: 3 },
] as const

// Durações de pausa pré-definidas (em ms)
export const DURACOES_PAUSA = {
  HORAS_24: 24 * 60 * 60 * 1000,
  HORAS_48: 48 * 60 * 60 * 1000,
  DIAS_7: 7 * 24 * 60 * 60 * 1000,
  DIAS_14: 14 * 24 * 60 * 60 * 1000,
} as const

// Moedas suportadas
export const MOEDAS = {
  BRL: { codigo: 'BRL', simbolo: 'R$', localizacao: 'pt-BR' },
  USD: { codigo: 'USD', simbolo: '$', localizacao: 'en-US' },
} as const

// Temas disponíveis
export const TEMAS = ['escuro', 'claro'] as const

// Versão da aplicação
export const VERSAO_APP = '0.1.0'

// Versões públicas de referência para aceite no onboarding.
export const VERSAO_TERMOS_USO = '2026-03'
export const VERSAO_POLITICA_PRIVACIDADE = '2026-03'

// Versão do banco de dados
export const VERSAO_BD = 1

// Nome do banco de dados
export const NOME_BD = 'CompassoBD'

// Tempo padrão de expiração de aviso (ms)
export const TEMPO_AVISO_PADRAO = 3000

// Limite de registros por página (para paginação)
export const REGISTROS_POR_PAGINA = 20

// Dias de retenção de dados padrão
export const DIAS_RETENCAO_PADRAO = 365

// Limite máximo de caracteres em notas
export const MAX_CHARS_NOTAS = 500
