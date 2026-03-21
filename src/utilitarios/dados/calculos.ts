import { Registro, Pausa } from '../../tipos'

/**
 * Calcula frequência de registros em um período (dias)
 * Retorna um mapa: { "2026-03-21": 3, "2026-03-20": 2 }
 */
export const calcularFrequencia = (
  registros: Registro[],
  dias: number = 7
): Record<string, number> => {
  const agora = new Date()
  const limiteTempo = agora.getTime() - dias * 24 * 60 * 60 * 1000

  // Filtrar registros dentro do período
  const registrosFiltrados = registros.filter((r) => r.timestamp >= limiteTempo)

  // Agrupar por data
  const frequencia: Record<string, number> = {}

  registrosFiltrados.forEach((registro) => {
    const data = new Date(registro.timestamp)
    const chave = data.toISOString().split('T')[0] // YYYY-MM-DD
    frequencia[chave] = (frequencia[chave] || 0) + 1
  })

  return frequencia
}

/**
 * Calcula economia total acumulada baseada em pausas concluídas
 */
export const calcularEconomiaAcumulada = (pausas: Pausa[]): number => {
  return pausas
    .filter((p) => p.status === 'concluida')
    .reduce((total, pausa) => total + pausa.valorEconomia, 0)
}

/**
 * Calcula economia diária média
 */
export const calcularEconomiaDiaria = (
  pausas: Pausa[],
  dias: number = 30
): number => {
  const agora = new Date()
  const limiteTempo = agora.getTime() - dias * 24 * 60 * 60 * 1000

  const pausasFiltradas = pausas.filter(
    (p) => p.iniciadoEm >= limiteTempo && p.status === 'concluida'
  )

  if (pausasFiltradas.length === 0) return 0

  const totalEconomia = pausasFiltradas.reduce((total, p) => total + p.valorEconomia, 0)
  return totalEconomia / dias
}

/**
 * Calcula tendência de frequência (aumentando, diminuindo, estável)
 */
export const calcularTendencia = (
  frequencia: Record<string, number>
): 'aumentando' | 'diminuindo' | 'estavel' => {
  const datas = Object.keys(frequencia).sort()

  if (datas.length < 2) return 'estavel'

  // Comparar primeira metade com segunda metade
  const meio = Math.floor(datas.length / 2)
  const primeirosValores = datas.slice(0, meio).map((d) => frequencia[d])
  const ultimosValores = datas.slice(meio).map((d) => frequencia[d])

  const mediaPrimeira = primeirosValores.reduce((a, b) => a + b, 0) / primeirosValores.length
  const mediaUltima = ultimosValores.reduce((a, b) => a + b, 0) / ultimosValores.length

  const diferenca = mediaUltima - mediaPrimeira
  const percentual = (diferenca / mediaPrimeira) * 100

  if (percentual > 10) return 'aumentando'
  if (percentual < -10) return 'diminuindo'
  return 'estavel'
}

/**
 * Calcula estatísticas gerais dos registros
 */
export const calcularEstatisticas = (registros: Registro[], dias: number = 30) => {
  const agora = new Date()
  const limiteTempo = agora.getTime() - dias * 24 * 60 * 60 * 1000

  const registrosFiltrados = registros.filter((r) => r.timestamp >= limiteTempo)

  const totalRegistros = registrosFiltrados.length
  const registrosPorDia = totalRegistros / dias

  // Métodos mais usados
  const metodosCont: Record<string, number> = {}
  registrosFiltrados.forEach((r) => {
    metodosCont[r.metodo] = (metodosCont[r.metodo] || 0) + 1
  })

  const metodoMaisUsado = Object.entries(metodosCont).sort((a, b) => b[1] - a[1])[0]

  // Intenções mais comuns
  const intencoesCont: Record<string, number> = {}
  registrosFiltrados.forEach((r) => {
    intencoesCont[r.intencao] = (intencoesCont[r.intencao] || 0) + 1
  })

  const intencaoMaisComum = Object.entries(intencoesCont).sort((a, b) => b[1] - a[1])[0]

  return {
    totalRegistros,
    registrosPorDia: parseFloat(registrosPorDia.toFixed(2)),
    metodoMaisUsado: metodoMaisUsado ? metodoMaisUsado[0] : null,
    intencaoMaisComum: intencaoMaisComum ? intencaoMaisComum[0] : null,
  }
}

/**
 * Calcula percentual de redução em um período
 */
export const calcularPercentualReducao = (
  registrosAntes: number,
  registrosDepois: number
): number => {
  if (registrosAntes === 0) return 0
  const reducao = ((registrosAntes - registrosDepois) / registrosAntes) * 100
  return parseFloat(reducao.toFixed(2))
}

/**
 * Formata número de dias para intervalo legível
 */
export const intervaloEmDias = (ms: number): number => {
  return Math.floor(ms / (24 * 60 * 60 * 1000))
}
