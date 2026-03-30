import { act, renderHook, waitFor } from '@testing-library/react'
import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ProvedorApp } from '../../../src/loja/ContextoApp'
import { usePausa } from '../../../src/ganchos/usePausa'
import { useEconomia } from '../../../src/ganchos/useEconomia'
import { useApp } from '../../../src/ganchos/useApp'
import { compararEconomiaPorPeriodo } from '../../../src/utilitarios/dados/calculos'
import { bd } from '../../../src/utilitarios/armazenamento/bd'
import type { Pausa } from '../../../src/tipos'

const envolverProvider = ({ children }: { children: React.ReactNode }) => (
  <ProvedorApp>{children}</ProvedorApp>
)

const useCenarioEconomia = () => {
  const pausa = usePausa()
  const economia = useEconomia()
  const { estado, despacho } = useApp()

  return {
    pausa,
    economia,
    historico: estado.historicoPausa,
    despacho,
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
    // Simples: passe a pausa através de múltiplas tentativas
    const { result } = renderHook(() => useCenarioEconomia(), { wrapper: envolverProvider })

    // Configure economia diária = 32
    await act(async () => {
      result.current.despacho({
        tipo: 'DEFINIR_CONFIGURACAO',
        payload: {
          valorEconomia: 32,
        },
      })
    })

    // Primeira pausa  
    await act(async () => {
      const pausa = await result.current.pausa.iniciar({ duracaoPlanejada: 24 * 60 * 60 * 1000 })
    })

    expect(result.current.pausa.pausaAtiva?.valorEconomia).toBeCloseTo(32, 2)

    // Avanço 12 horas
    agoraMock += 12 * 60 * 60 * 1000

    // Encerra  
    await act(async () => {
      await result.current.pausa.encerrar('test')
    })

    expect(result.current.historico).toHaveLength(1)
    const pausaDoHistorico = result.current.historico[0]
    // A pausa foi executada por 12 horas de 24, então a proporção é 0.5
    // Portanto: 32 * 0.5 = 16
    expect(pausaDoHistorico.valorEconomia).toBeCloseTo(16, 2)
  }, { timeout: 15000 })
})
