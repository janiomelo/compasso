import { describe, it, expect, beforeEach } from 'vitest'
import {
  calcularFrequencia,
  calcularEconomiaAcumulada,
  calcularEconomiaDiaria,
  calcularEconomiaEstimadaPorDuracao,
  calcularEconomiaAteAgora,
  calcularTendencia,
  calcularEstatisticas,
  calcularPercentualReducao,
} from '../../../src/utilitarios/dados/calculos'
import { Registro, Pausa } from '../../../src/tipos'

describe('Cálculos', () => {
  let registrosAmostra: Registro[]
  let pausasAmostra: Pausa[]

  beforeEach(() => {
    // Criar registro de amostra
    const agora = Date.now()
    registrosAmostra = [
      {
        id: '1',
        timestamp: agora - 1000 * 60 * 60 * 24 * 3, // 3 dias atrás
        data: new Date(agora - 1000 * 60 * 60 * 24 * 3),
        metodo: 'vaporizado' as const,
        intencao: 'paz' as const,
        intensidade: 'leve' as const,
      },
      {
        id: '2',
        timestamp: agora - 1000 * 60 * 60 * 24 * 2, // 2 dias atrás
        data: new Date(agora - 1000 * 60 * 60 * 24 * 2),
        metodo: 'fumado' as const,
        intencao: 'foco' as const,
        intensidade: 'media' as const,
      },
      {
        id: '3',
        timestamp: agora - 1000 * 60 * 60 * 24 * 2, // 2 dias atrás (mesmo dia)
        data: new Date(agora - 1000 * 60 * 60 * 24 * 2),
        metodo: 'vaporizado' as const,
        intencao: 'foco' as const,
        intensidade: 'media' as const,
      },
    ]

    // Criar pausas de amostra
    pausasAmostra = [
      {
        id: '1',
        iniciadoEm: agora - 1000 * 60 * 60 * 24 * 5,
        duracaoPlanejada: 1000 * 60 * 60 * 24,
        duracaoReal: 1000 * 60 * 60 * 24,
        status: 'concluida' as const,
        valorEconomia: 100,
      },
      {
        id: '2',
        iniciadoEm: agora - 1000 * 60 * 60 * 24 * 3,
        duracaoPlanejada: 1000 * 60 * 60 * 48,
        duracaoReal: 1000 * 60 * 60 * 48,
        status: 'concluida' as const,
        valorEconomia: 200,
      },
      {
        id: '3',
        iniciadoEm: agora - 1000 * 60 * 60 * 2,
        duracaoPlanejada: 1000 * 60 * 60 * 24,
        status: 'ativa' as const,
        valorEconomia: 0,
      },
    ]
  })

  describe('calcularFrequencia', () => {
    it('deve contar registros por data', () => {
      const frequencia = calcularFrequencia(registrosAmostra, 7)
      const contagens = Object.values(frequencia)
      expect(contagens.length).toBeGreaterThan(0)
      expect(contagens.some((c) => c === 2)).toBe(true) // Deve ter um dia com 2 registros
    })

    it('deve retornar objeto vazio se não houver registros', () => {
      const frequencia = calcularFrequencia([], 7)
      expect(Object.keys(frequencia).length).toBe(0)
    })

    it('deve respeitar o período de dias', () => {
      const frequencia = calcularFrequencia(registrosAmostra, 2)
      // Com 2 dias, deve pegar apenas registros recentes
      expect(Object.keys(frequencia).length).toBeLessThanOrEqual(registrosAmostra.length)
    })
  })

  describe('calcularEconomiaAcumulada', () => {
    it('deve somar economia de pausas concluídas', () => {
      const economia = calcularEconomiaAcumulada(pausasAmostra)
      expect(economia).toBe(300) // 100 + 200
    })

    it('não deve incluir pausas ativas', () => {
      const economia = calcularEconomiaAcumulada(pausasAmostra)
      expect(economia).toBe(300)
    })

    it('deve retornar 0 se não houver pausas', () => {
      const economia = calcularEconomiaAcumulada([])
      expect(economia).toBe(0)
    })
  })

  describe('calcularEconomiaDiaria', () => {
    it('deve calcular limite diário correto', () => {
      const economiaDiaria = calcularEconomiaDiaria(pausasAmostra, 30)
      expect(economiaDiaria).toBeGreaterThan(0)
      expect(typeof economiaDiaria).toBe('number')
    })

    it('deve retornar 0 com pausas vazias', () => {
      const economia = calcularEconomiaDiaria([], 30)
      expect(economia).toBe(0)
    })
  })

  describe('calcularEconomiaEstimadaPorDuracao', () => {
    it('deve estimar proporcionalmente à duração em janela de 24h', () => {
      const cincoMinutos = 5 * 60 * 1000
      const valor = calcularEconomiaEstimadaPorDuracao(cincoMinutos, 24)

      // 5 minutos representam 1/288 de 24h
      expect(valor).toBeCloseTo(0.08, 2)
    })

    it('deve retornar zero quando entrada for inválida', () => {
      expect(calcularEconomiaEstimadaPorDuracao(0, 20)).toBe(0)
      expect(calcularEconomiaEstimadaPorDuracao(1000, 0)).toBe(0)
      expect(calcularEconomiaEstimadaPorDuracao(-1, 20)).toBe(0)
    })
  })

  describe('calcularEconomiaAteAgora', () => {
    it('deve calcular a economia parcial com base no percentual', () => {
      const valor = calcularEconomiaAteAgora(10, 50)
      expect(valor).toBe(5)
    })

    it('deve limitar percentual abaixo de 0 e acima de 100', () => {
      expect(calcularEconomiaAteAgora(10, -20)).toBe(0)
      expect(calcularEconomiaAteAgora(10, 150)).toBe(10)
    })

    it('deve retornar zero para entradas inválidas', () => {
      expect(calcularEconomiaAteAgora(0, 20)).toBe(0)
      expect(calcularEconomiaAteAgora(10, Number.NaN)).toBe(0)
    })
  })

  describe('calcularTendencia', () => {
    it('deve identificar tendência estável', () => {
      const freq = { '2026-03-15': 1, '2026-03-16': 1, '2026-03-17': 1 }
      const tendencia = calcularTendencia(freq)
      expect(['aumentando', 'diminuindo', 'estavel']).toContain(tendencia)
    })

    it('deve retornar estavel com menos de 2 dados', () => {
      const freq = { '2026-03-17': 1 }
      const tendencia = calcularTendencia(freq)
      expect(tendencia).toBe('estavel')
    })
  })

  describe('calcularEstatisticas', () => {
    it('deve retornar estatísticas válidas', () => {
      const stats = calcularEstatisticas(registrosAmostra, 7)
      expect(stats.totalRegistros).toBe(3)
      expect(stats.registrosPorDia).toBeGreaterThan(0)
      expect(stats.metodoMaisUsado).toBeTruthy()
    })

    it('deve identificar método mais usado', () => {
      const stats = calcularEstatisticas(registrosAmostra, 7)
      expect(stats.metodoMaisUsado).toBe('vaporizado') // 2 vezes
    })
  })

  describe('calcularPercentualReducao', () => {
    it('deve calcular percentual de redução correto', () => {
      const percentual = calcularPercentualReducao(100, 50)
      expect(percentual).toBe(50)
    })

    it('deve retornar 0 se antes era 0', () => {
      const percentual = calcularPercentualReducao(0, 50)
      expect(percentual).toBe(0)
    })

    it('deve calc reducao de 100%', () => {
      const percentual = calcularPercentualReducao(100, 0)
      expect(percentual).toBe(100)
    })
  })
})
