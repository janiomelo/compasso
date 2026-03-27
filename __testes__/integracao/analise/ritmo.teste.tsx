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
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(agoraMock)
    await bd.delete()
    await bd.open()
  })

  afterEach(() => {
    vi.useRealTimers()
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

    const criarNoDia = async (diasAtras: number, quantidade: number, metodo: 'vaporizado' | 'fumado' = 'vaporizado') => {
      for (let i = 0; i < quantidade; i += 1) {
        agoraMock = base - diasAtras * diaMs + i * 60000
        vi.setSystemTime(agoraMock)
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
    await criarNoDia(4, 1, 'fumado')
    await criarNoDia(3, 2)
    await criarNoDia(2, 2)
    await criarNoDia(1, 3)

    agoraMock = base
  vi.setSystemTime(agoraMock)
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

    const entradas: Array<{ metodo: 'vaporizado' | 'fumado'; intencao: 'foco' | 'paz' }> = [
      { metodo: 'vaporizado', intencao: 'foco' },
      { metodo: 'vaporizado', intencao: 'foco' },
      { metodo: 'vaporizado', intencao: 'paz' },
      { metodo: 'fumado', intencao: 'foco' },
    ]

    for (let i = 0; i < entradas.length; i += 1) {
      agoraMock = base - i * 3600000
      vi.setSystemTime(agoraMock)
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

    expect(padroes.metodoPredominante).toBe('vaporizado')
    expect(padroes.intencaoPredominante).toBe('foco')
    expect(['tarde', 'noite']).toContain(padroes.janelaMaisComum)
    expect(padroes.intensidadeMedia).toBeGreaterThan(0)
  })
})
