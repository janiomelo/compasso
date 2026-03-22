import { act, renderHook, waitFor } from '@testing-library/react'
import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ProvedorApp } from '../../../src/loja/ContextoApp'
import { usePausa } from '../../../src/ganchos/usePausa'
import { useEconomia } from '../../../src/ganchos/useEconomia'
import { useApp } from '../../../src/ganchos/useApp'
import { compararEconomiaPorPeriodo } from '../../../src/utilitarios/dados/calculos'
import { bd } from '../../../src/utilitarios/armazenamento/bd'

const envolverProvider = ({ children }: { children: React.ReactNode }) => (
  <ProvedorApp>{children}</ProvedorApp>
)

const useCenarioEconomia = () => {
  const pausa = usePausa()
  const economia = useEconomia()
  const { estado } = useApp()

  return {
    pausa,
    economia,
    historico: estado.historicoPausa,
  }
}

describe('analise de economia', () => {
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

  it('calcula projecao mensal a partir da taxa diaria', async () => {
    const base = new Date('2026-03-22T10:00:00.000Z').getTime()
    const { result } = renderHook(() => useCenarioEconomia(), { wrapper: envolverProvider })

    await waitFor(() => expect(result.current.historico).toBeDefined())

    const registrarPausaConcluida = async (diasAtras: number, valorEconomia: number) => {
      agoraMock = base - diasAtras * diaMs
      await act(async () => {
        await result.current.pausa.iniciar({
          duracaoPlanejada: 3600000,
          valorEconomia,
        })
      })

      agoraMock += 1800000
      await act(async () => {
        await result.current.pausa.encerrar('teste')
      })
    }

    await registrarPausaConcluida(2, 30)
    await registrarPausaConcluida(6, 20)
    await registrarPausaConcluida(10, 10)

    await waitFor(() => {
      expect(result.current.economia.totalAcumulado).toBeCloseTo(60, 2)
      expect(result.current.economia.taxaDiaria).toBeCloseTo(2, 2)
      expect(result.current.economia.projecao30Dias).toBeCloseTo(60, 2)
    })
  })

  it('compara economia entre periodo atual e anterior', async () => {
    const base = new Date('2026-03-22T10:00:00.000Z').getTime()
    const { result } = renderHook(() => useCenarioEconomia(), { wrapper: envolverProvider })

    await waitFor(() => expect(result.current.historico).toBeDefined())

    const registrarPausaConcluida = async (diasAtras: number, valorEconomia: number) => {
      agoraMock = base - diasAtras * diaMs
      await act(async () => {
        await result.current.pausa.iniciar({
          duracaoPlanejada: 1800000,
          valorEconomia,
        })
      })

      agoraMock += 900000
      await act(async () => {
        await result.current.pausa.encerrar('teste')
      })
    }

    // Periodo anterior (31-60 dias)
    await registrarPausaConcluida(45, 10)
    await registrarPausaConcluida(40, 10)

    // Periodo atual (0-30 dias)
    await registrarPausaConcluida(12, 20)
    await registrarPausaConcluida(7, 30)

    const comparativo = compararEconomiaPorPeriodo(result.current.historico, 30)

    expect(comparativo.anterior).toBeCloseTo(20, 2)
    expect(comparativo.atual).toBeCloseTo(50, 2)
    expect(comparativo.variacaoPercentual).toBeCloseTo(150, 2)
  })
})
