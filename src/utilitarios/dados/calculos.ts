import { Registro, Pausa } from '../../tipos'

export type JanelaHorario = 'madrugada' | 'manha' | 'tarde' | 'noite'

export interface PadroesUso {
  metodoPredominante: Registro['metodo'] | null
  intencaoPredominante: Registro['intencao'] | null
  janelaMaisComum: JanelaHorario | null
  intensidadeMedia: number
}

export interface ComparativoPeriodoEconomia {
  atual: number
  anterior: number
  variacaoPercentual: number
}

const obterChaveMaisFrequente = <T extends string>(entradas: T[]): T | null => {
  if (entradas.length === 0) {
    return null
  }

  const contagem = entradas.reduce<Record<string, number>>((acumulado, item) => {
    acumulado[item] = (acumulado[item] ?? 0) + 1
    return acumulado
  }, {})

  const chaveMaisFrequente = Object.entries(contagem).sort((a, b) => b[1] - a[1])[0]?.[0]
  return (chaveMaisFrequente as T) ?? null
}

const obterJanelaHorario = (timestamp: number): JanelaHorario => {
  const hora = new Date(timestamp).getHours()

  if (hora < 6) {
    return 'madrugada'
  }

  if (hora < 12) {
    return 'manha'
  }

  if (hora < 18) {
    return 'tarde'
  }

  return 'noite'
}

/**
 * Calcula frequencia de registros em um periodo (dias)
 * Retorna um mapa: { "2026-03-21": 3, "2026-03-20": 2 }
 */
export const calcularFrequencia = (
  registros: Registro[],
  dias: number = 7
): Record<string, number> => {
  const agora = new Date()
  const limiteTempo = agora.getTime() - dias * 24 * 60 * 60 * 1000

  // Filtrar registros dentro do periodo
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
 * Calcula economia total acumulada baseada em pausas concluidas
 */
export const calcularEconomiaAcumulada = (pausas: Pausa[]): number => {
  return pausas
    .filter((p) => p.status === 'concluida')
    .reduce((total, pausa) => total + pausa.valorEconomia, 0)
}

/**
 * Calcula economia diaria media
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
 * Calcula tendencia de frequencia (aumentando, diminuindo, estavel)
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
 * Calcula estatisticas gerais dos registros
 */
export const calcularEstatisticas = (registros: Registro[], dias: number = 30) => {
  const agora = new Date()
  const limiteTempo = agora.getTime() - dias * 24 * 60 * 60 * 1000

  const registrosFiltrados = registros.filter((r) => r.timestamp >= limiteTempo)

  const totalRegistros = registrosFiltrados.length
  const registrosPorDia = totalRegistros / dias

  // Metodos mais usados
  const metodosCont: Record<string, number> = {}
  registrosFiltrados.forEach((r) => {
    metodosCont[r.metodo] = (metodosCont[r.metodo] || 0) + 1
  })

  const metodoMaisUsado = Object.entries(metodosCont).sort((a, b) => b[1] - a[1])[0]

  // Intencoes mais comuns
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
 * Calcula percentual de reducao em um periodo
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
 * Identifica padroes basicos de uso a partir do historico de registros
 */
export const identificarPadroesUso = (registros: Registro[]): PadroesUso => {
  if (registros.length === 0) {
    return {
      metodoPredominante: null,
      intencaoPredominante: null,
      janelaMaisComum: null,
      intensidadeMedia: 0,
    }
  }

  const pesosIntensidade: Record<Registro['intensidade'], number> = {
    leve: 3,
    media: 5,
    alta: 8,
  }

  const intensidadeMedia =
    registros.reduce((total, registro) => total + pesosIntensidade[registro.intensidade], 0) /
    registros.length

  return {
    metodoPredominante: obterChaveMaisFrequente(registros.map((registro) => registro.metodo)) as Registro['metodo'] | null,
    intencaoPredominante: obterChaveMaisFrequente(registros.map((registro) => registro.intencao)) as Registro['intencao'] | null,
    janelaMaisComum: obterChaveMaisFrequente(registros.map((registro) => obterJanelaHorario(registro.timestamp))),
    intensidadeMedia: parseFloat(intensidadeMedia.toFixed(1)),
  }
}

/**
 * Score de 0 a 100 combinando melhora de humor, consistencia e economia
 */
export const calcularValorPercebido = (registros: Registro[], totalEconomia: number): number => {
  if (registros.length === 0) {
    return 0
  }

  const amostrasHumor = registros.filter(
    (registro) => typeof registro.humorAntes === 'number' && typeof registro.humorDepois === 'number'
  )

  const ganhoMedioHumor = amostrasHumor.length === 0
    ? 0
    : amostrasHumor.reduce((total, registro) => total + Math.max((registro.humorDepois ?? 0) - (registro.humorAntes ?? 0), 0), 0) /
      amostrasHumor.length

  const consistencia = amostrasHumor.length === 0
    ? 0
    : amostrasHumor.filter((registro) => (registro.humorDepois ?? 0) >= (registro.humorAntes ?? 0)).length / amostrasHumor.length

  const componenteHumor = Math.min((ganhoMedioHumor / 10) * 60, 60)
  const componenteConsistencia = Math.min(consistencia * 25, 25)
  const componenteEconomia = Math.min((totalEconomia / 300) * 15, 15)

  return parseFloat((componenteHumor + componenteConsistencia + componenteEconomia).toFixed(1))
}

/**
 * Compara economia do periodo atual contra o periodo imediatamente anterior
 */
export const compararEconomiaPorPeriodo = (
  pausas: Pausa[],
  dias: number = 30,
): ComparativoPeriodoEconomia => {
  const agora = Date.now()
  const periodoMs = dias * 24 * 60 * 60 * 1000
  const limitePeriodoAtual = agora - periodoMs
  const limitePeriodoAnterior = agora - 2 * periodoMs

  const pausasConcluidas = pausas.filter((pausa) => pausa.status === 'concluida')

  const atual = pausasConcluidas
    .filter((pausa) => pausa.iniciadoEm >= limitePeriodoAtual)
    .reduce((total, pausa) => total + pausa.valorEconomia, 0)

  const anterior = pausasConcluidas
    .filter((pausa) => pausa.iniciadoEm >= limitePeriodoAnterior && pausa.iniciadoEm < limitePeriodoAtual)
    .reduce((total, pausa) => total + pausa.valorEconomia, 0)

  const variacaoPercentual = anterior === 0
    ? 0
    : parseFloat((((atual - anterior) / anterior) * 100).toFixed(2))

  return {
    atual: parseFloat(atual.toFixed(2)),
    anterior: parseFloat(anterior.toFixed(2)),
    variacaoPercentual,
  }
}

/**
 * Formata numero de dias para intervalo legivel
 */
export const intervaloEmDias = (ms: number): number => {
  return Math.floor(ms / (24 * 60 * 60 * 1000))
}
