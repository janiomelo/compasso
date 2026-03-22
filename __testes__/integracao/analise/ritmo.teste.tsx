import { act, renderHook, waitFor } from '@testing-library/react'
import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ProvedorApp } from '../../../src/loja/ContextoApp'
import { useRegistro } from '../../../src/ganchos/useRegistro'
import { useRitmo } from '../../../src/ganchos/useRitmo'
import { identificarPadroesUso } from '../../../src/utilitarios/dados/calculos'
import { bd } from '../../../src/utilitarios/armazenamento/bd'

const envolverProvider = ({ children }: { children: React.ReactNode }) => (
  <ProvedorApp>{children}</ProvedorApp>
)

const useCenarioRitmo = () => {
  const registro = useRegistro()
  const ritmo = useRitmo(7)

  return {
    registro,
    ritmo,
  }
}

describe('analise de ritmo', () => {
  let agoraMock = Date.now()
  const diaMs = 24 * 60 * 60 * 1000

  beforeEach(async () => {
    vi.restoreAllMocks()
    vi.spyOn(Date, 'now').mockImplementation(() => agoraMock)
    await bd.delete()
    await bd.open()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  afterAll(async () => {
    await bd.delete()
    bd.close()
  })

  it('calcula frequencia semanal e detecta tendencia aumentando', async () => {
    const base = new Date('2026-03-22T20:00:00.000Z').getTime()
    const { result, rerender } = renderHook(() => useCenarioRitmo(), { wrapper: envolverProvider })

    await waitFor(() => expect(result.current.registro.registros).toBeDefined())

    const criarNoDia = async (diasAtras: number, quantidade: number, metodo: 'vapor' | 'flor' = 'vapor') => {
      for (let i = 0; i < quantidade; i += 1) {
        agoraMock = base - diasAtras * diaMs + i * 60000
        await act(async () => {
          await result.current.registro.criar({
            metodo,
            intencao: 'foco',
            intensidade: 'media',
          })
        })
      }
    }

    await criarNoDia(6, 1)
    await criarNoDia(5, 1)
    await criarNoDia(4, 1, 'flor')
    await criarNoDia(3, 2)
    await criarNoDia(2, 2)
    await criarNoDia(1, 3)

    agoraMock = base
    rerender()

    await waitFor(() => {
      expect(result.current.ritmo.estatisticas.totalRegistros).toBe(10)
      expect(result.current.ritmo.tendencia).toBe('aumentando')
    })

    const totalDaFrequencia = Object.values(result.current.ritmo.frequencia7Dias)
      .reduce((total, valor) => total + valor, 0)

    expect(totalDaFrequencia).toBe(10)
  })

  it('identifica padroes de metodo e janela horaria', async () => {
    const base = new Date('2026-03-22T21:00:00.000Z').getTime()
    const { result } = renderHook(() => useCenarioRitmo(), { wrapper: envolverProvider })

    await waitFor(() => expect(result.current.registro.registros).toBeDefined())

    const entradas: Array<{ metodo: 'vapor' | 'flor'; intencao: 'foco' | 'paz' }> = [
      { metodo: 'vapor', intencao: 'foco' },
      { metodo: 'vapor', intencao: 'foco' },
      { metodo: 'vapor', intencao: 'paz' },
      { metodo: 'flor', intencao: 'foco' },
    ]

    for (let i = 0; i < entradas.length; i += 1) {
      agoraMock = base - i * 3600000
      await act(async () => {
        await result.current.registro.criar({
          metodo: entradas[i].metodo,
          intencao: entradas[i].intencao,
          intensidade: 'leve',
          humorAntes: 4,
          humorDepois: 6,
        })
      })
    }

    const padroes = identificarPadroesUso(result.current.registro.registros)

    expect(padroes.metodoPredominante).toBe('vapor')
    expect(padroes.intencaoPredominante).toBe('foco')
    expect(['tarde', 'noite']).toContain(padroes.janelaMaisComum)
    expect(padroes.intensidadeMedia).toBeGreaterThan(0)
  })
})
