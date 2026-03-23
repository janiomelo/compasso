import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import type { Registro, Pausa } from '../../../src/tipos'
import {
  calcularFrequencia,
  calcularTendencia,
  calcularEstatisticas,
  identificarPadroesUso,
  calcularValorPercebido,
  compararEconomiaPorPeriodo,
} from '../../../src/utilitarios/dados/calculos'

// ────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────

const criarRegistro = (overrides: Partial<Registro> = {}): Registro => {
  const agora = Date.now()
  return {
    id: Math.random().toString(36).slice(2),
    timestamp: agora,
    data: new Date(agora),
    metodo: 'vapor',
    intencao: 'foco',
    intensidade: 'media',
    ...overrides,
  }
}

const criarPausa = (overrides: Partial<Pausa> = {}): Pausa => ({
  id: Math.random().toString(36).slice(2),
  iniciadoEm: Date.now(),
  duracaoPlanejada: 3600000,
  status: 'concluida',
  valorEconomia: 10,
  ...overrides,
})

// ────────────────────────────────────────────────────────────
// calcularFrequencia — edge cases
// ────────────────────────────────────────────────────────────

describe('calcularFrequencia — edge cases', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-03-22T12:00:00.000Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('ignora registros exatamente fora do limite do período', () => {
    const agora = Date.now()

    const dentroLimite = criarRegistro({ timestamp: agora - 6 * 24 * 60 * 60 * 1000 + 1000 })
    const foraLimite = criarRegistro({ timestamp: agora - 8 * 24 * 60 * 60 * 1000 })

    const freq = calcularFrequencia([dentroLimite, foraLimite], 7)
    const total = Object.values(freq).reduce((a, b) => a + b, 0)

    expect(total).toBe(1)
  })

  it('agrupa corretamente múltiplos registros no mesmo dia', () => {
    const base = new Date('2026-03-22T00:00:00.000Z').getTime()

    const registros = Array.from({ length: 5 }, (_, i) =>
      criarRegistro({ timestamp: base + i * 600000 })
    )

    const freq = calcularFrequencia(registros, 1)
    const chave = new Date(base).toISOString().split('T')[0]

    expect(freq[chave]).toBe(5)
  })

  it('retorna mapa vazio quando lista está vazia', () => {
    expect(calcularFrequencia([], 30)).toEqual({})
  })
})

// ────────────────────────────────────────────────────────────
// calcularTendencia — edge cases
// ────────────────────────────────────────────────────────────

describe('calcularTendencia — edge cases', () => {
  it('detecta tendência claramente aumentando', () => {
    const freq = {
      '2026-03-15': 1,
      '2026-03-16': 1,
      '2026-03-17': 1,
      '2026-03-18': 5,
      '2026-03-19': 6,
      '2026-03-20': 7,
    }
    expect(calcularTendencia(freq)).toBe('aumentando')
  })

  it('detecta tendência claramente diminuindo', () => {
    const freq = {
      '2026-03-15': 8,
      '2026-03-16': 7,
      '2026-03-17': 6,
      '2026-03-18': 1,
      '2026-03-19': 1,
      '2026-03-20': 1,
    }
    expect(calcularTendencia(freq)).toBe('diminuindo')
  })

  it('retorna estável com frequência uniforme', () => {
    const freq = {
      '2026-03-18': 2,
      '2026-03-19': 2,
      '2026-03-20': 2,
      '2026-03-21': 2,
    }
    expect(calcularTendencia(freq)).toBe('estavel')
  })

  it('retorna estável com mapa vazio', () => {
    expect(calcularTendencia({})).toBe('estavel')
  })
})

// ────────────────────────────────────────────────────────────
// calcularEstatisticas — edge cases
// ────────────────────────────────────────────────────────────

describe('calcularEstatisticas — edge cases', () => {
  it('retorna zeros e nulos para lista vazia', () => {
    const stats = calcularEstatisticas([], 7)
    expect(stats.totalRegistros).toBe(0)
    expect(stats.registrosPorDia).toBe(0)
    expect(stats.metodoMaisUsado).toBeNull()
    expect(stats.intencaoMaisComum).toBeNull()
  })

  it('lida com registros fora do período sem quebrar', () => {
    const antigo = criarRegistro({ timestamp: Date.now() - 60 * 24 * 60 * 60 * 1000 })
    const stats = calcularEstatisticas([antigo], 7)
    expect(stats.totalRegistros).toBe(0)
  })
})

// ────────────────────────────────────────────────────────────
// identificarPadroesUso — edge cases
// ────────────────────────────────────────────────────────────

describe('identificarPadroesUso — edge cases', () => {
  it('retorna nulls e zero para lista vazia', () => {
    const padroes = identificarPadroesUso([])
    expect(padroes.metodoPredominante).toBeNull()
    expect(padroes.intencaoPredominante).toBeNull()
    expect(padroes.janelaMaisComum).toBeNull()
    expect(padroes.intensidadeMedia).toBe(0)
  })

  it('identifica corretamente com um único método', () => {
    const registros = [
      criarRegistro({ metodo: 'extracao', intencao: 'paz', intensidade: 'leve' }),
      criarRegistro({ metodo: 'extracao', intencao: 'paz', intensidade: 'leve' }),
    ]
    const padroes = identificarPadroesUso(registros)
    expect(padroes.metodoPredominante).toBe('extracao')
    expect(padroes.intensidadeMedia).toBe(3)
  })

  it('identifica janela como madrugada para timestamps entre meia-noite e 6h', () => {
    const madrugada = new Date('2026-03-22T03:00:00.000Z').getTime()
    const registros = [criarRegistro({ timestamp: madrugada })]
    const padroes = identificarPadroesUso(registros)
    expect(padroes.janelaMaisComum).toBe('madrugada')
  })

  it('calcula intensidade média corretamente para mix de intensidades', () => {
    const registros = [
      criarRegistro({ intensidade: 'leve' }),  // → 3
      criarRegistro({ intensidade: 'media' }), // → 5
      criarRegistro({ intensidade: 'alta' }),  // → 8
    ]
    const padroes = identificarPadroesUso(registros)
    expect(padroes.intensidadeMedia).toBeCloseTo(5.3, 1)
  })
})

// ────────────────────────────────────────────────────────────
// calcularValorPercebido — edge cases
// ────────────────────────────────────────────────────────────

describe('calcularValorPercebido — edge cases', () => {
  it('retorna 0 para lista vazia', () => {
    expect(calcularValorPercebido([], 0)).toBe(0)
  })

  it('retorna 0 quando não há amostras de humor', () => {
    const registros = [criarRegistro(), criarRegistro()]
    expect(calcularValorPercebido(registros, 0)).toBe(0)
  })

  it('sobe com economia alta mesmo sem dados de humor', () => {
    const registros = [criarRegistro()]
    const semEconomia = calcularValorPercebido(registros, 0)
    const comEconomia = calcularValorPercebido(registros, 300)
    expect(comEconomia).toBeGreaterThan(semEconomia)
  })

  it('sobe com ganhos de humor consistentes', () => {
    const base = [criarRegistro({ humorAntes: 4, humorDepois: 4 })]
    const melhorado = [criarRegistro({ humorAntes: 4, humorDepois: 8 })]
    expect(calcularValorPercebido(melhorado, 0)).toBeGreaterThan(calcularValorPercebido(base, 0))
  })

  it('não ultrapassa 100', () => {
    const registros = Array.from({ length: 10 }, () =>
      criarRegistro({ humorAntes: 1, humorDepois: 10 })
    )
    expect(calcularValorPercebido(registros, 9999)).toBeLessThanOrEqual(100)
  })
})

// ────────────────────────────────────────────────────────────
// compararEconomiaPorPeriodo — edge cases
// ────────────────────────────────────────────────────────────

describe('compararEconomiaPorPeriodo — edge cases', () => {
  it('retorna zeros para lista vazia', () => {
    const comp = compararEconomiaPorPeriodo([], 30)
    expect(comp.atual).toBe(0)
    expect(comp.anterior).toBe(0)
    expect(comp.variacaoPercentual).toBe(0)
  })

  it('retorna variação 0 quando período anterior é zero', () => {
    const pausaAtual = criarPausa({ iniciadoEm: Date.now() - 5 * 24 * 60 * 60 * 1000, valorEconomia: 50 })
    const comp = compararEconomiaPorPeriodo([pausaAtual], 30)
    expect(comp.variacaoPercentual).toBe(0)
    expect(comp.atual).toBeCloseTo(50, 2)
  })

  it('ignora pausas ativas (não concluídas)', () => {
    const ativa = criarPausa({ status: 'ativa', valorEconomia: 999 })
    const comp = compararEconomiaPorPeriodo([ativa], 30)
    expect(comp.atual).toBe(0)
    expect(comp.anterior).toBe(0)
  })

  it('calcula variação positiva corretamente', () => {
    const agora = Date.now()
    const diaMs = 24 * 60 * 60 * 1000
    const anterior = criarPausa({ iniciadoEm: agora - 45 * diaMs, valorEconomia: 100 })
    const atual = criarPausa({ iniciadoEm: agora - 5 * diaMs, valorEconomia: 200 })

    const comp = compararEconomiaPorPeriodo([anterior, atual], 30)
    expect(comp.anterior).toBeCloseTo(100, 2)
    expect(comp.atual).toBeCloseTo(200, 2)
    expect(comp.variacaoPercentual).toBeCloseTo(100, 2)
  })
})

// ────────────────────────────────────────────────────────────
// Stress test — performance com volume alto de registros
// ────────────────────────────────────────────────────────────

describe('stress tests — 1000+ registros', () => {
  const VOLUME = 1200

  it('calcularFrequencia não degrada com 1200 registros', () => {
    const agora = Date.now()
    const registros = Array.from({ length: VOLUME }, (_, i) =>
      criarRegistro({ timestamp: agora - (i % 30) * 24 * 60 * 60 * 1000 })
    )

    const inicio = performance.now()
    const freq = calcularFrequencia(registros, 30)
    const duracao = performance.now() - inicio

    expect(Object.values(freq).reduce((a, b) => a + b, 0)).toBe(VOLUME)
    expect(duracao).toBeLessThan(100) // menos de 100ms
  })

  it('identificarPadroesUso não degrada com 1200 registros', () => {
    const registros = Array.from({ length: VOLUME }, (_, i) =>
      criarRegistro({
        metodo: i % 2 === 0 ? 'vapor' : 'flor',
        intencao: 'foco',
        intensidade: 'media',
      })
    )

    const inicio = performance.now()
    const padroes = identificarPadroesUso(registros)
    const duracao = performance.now() - inicio

    expect(padroes.metodoPredominante).toBe('vapor')
    expect(duracao).toBeLessThan(100)
  })

  it('calcularEstatisticas não degrada com 1200 registros', () => {
    const agora = Date.now()
    const registros = Array.from({ length: VOLUME }, (_, i) =>
      criarRegistro({
        timestamp: agora - (i % 30) * 24 * 60 * 60 * 1000,
        metodo: 'vapor',
        intencao: 'foco',
      })
    )

    const inicio = performance.now()
    const stats = calcularEstatisticas(registros, 30)
    const duracao = performance.now() - inicio

    expect(stats.totalRegistros).toBe(VOLUME)
    expect(duracao).toBeLessThan(100)
  })
})
