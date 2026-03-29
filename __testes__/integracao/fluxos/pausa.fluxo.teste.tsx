import { renderHook, act, waitFor } from '@testing-library/react'
import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ProvedorApp } from '../../../src/loja/ContextoApp'
import { usePausa } from '../../../src/ganchos/usePausa'
import { useApp } from '../../../src/ganchos/useApp'
import { bd } from '../../../src/utilitarios/armazenamento/bd'

const envolverProvider = ({ children }: { children: React.ReactNode }) => (
  <ProvedorApp>{children}</ProvedorApp>
)

const useCenarioPausa = () => {
  const pausa = usePausa()
  const { despacho } = useApp()

  return {
    pausa,
    despacho,
  }
}

describe('fluxo de pausa', () => {
  let agoraMock = new Date('2026-03-21T08:00:00.000Z').getTime()

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

  it('inicia pausa, reflete no contexto e calcula progresso', async () => {
    const { result } = renderHook(() => usePausa(), { wrapper: envolverProvider })
    await waitFor(() => expect(result.current.pausaAtiva).toBeNull())

    await act(async () => {
      await result.current.iniciar({ duracaoPlanejada: 24 * 60 * 60 * 1000, valorEconomia: 50 })
    })

    expect(result.current.pausaAtiva).not.toBeNull()
    expect(result.current.pausaAtiva?.status).toBe('ativa')
    expect(result.current.progresso).not.toBeNull()
  })

  it('não permite duas pausas simultâneas', async () => {
    const { result } = renderHook(() => usePausa(), { wrapper: envolverProvider })
    await waitFor(() => expect(result.current.pausaAtiva).toBeNull())

    await act(async () => {
      await result.current.iniciar({ duracaoPlanejada: 24 * 60 * 60 * 1000 })
    })

    await expect(
      act(async () => {
        await result.current.iniciar({ duracaoPlanejada: 12 * 60 * 60 * 1000 })
      }),
    ).rejects.toThrow('Já existe uma pausa ativa')
  })

  it('usa valor médio configurado quando iniciar pausa sem valor explícito', async () => {
    const { result } = renderHook(() => useCenarioPausa(), { wrapper: envolverProvider })

    await act(async () => {
      result.current.despacho({
        tipo: 'DEFINIR_CONFIGURACAO',
        payload: {
          valorEconomia: 32,
          moedaEconomia: 'BRL',
        },
      })
    })

    await act(async () => {
      await result.current.pausa.iniciar({ duracaoPlanejada: 24 * 60 * 60 * 1000 })
    })

    expect(result.current.pausa.pausaAtiva?.valorEconomia).toBeCloseTo(32, 2)
  })

  it('interrompe pausa curta com economia proporcional ao tempo decorrido', async () => {
    const { result } = renderHook(() => useCenarioPausa(), { wrapper: envolverProvider })

    await act(async () => {
      result.current.despacho({
        tipo: 'DEFINIR_CONFIGURACAO',
        payload: {
          valorEconomia: 24,
          moedaEconomia: 'BRL',
        },
      })
    })

    await act(async () => {
      await result.current.pausa.iniciar({ duracaoPlanejada: 24 * 60 * 60 * 1000 })
    })

    // avança 5 minutos
    agoraMock += 5 * 60 * 1000

    await act(async () => {
      await result.current.pausa.interromper('teste proporcional')
    })

    expect(result.current.pausa.historico[0].valorEconomia).toBeCloseTo(0.08, 2)
  })

  it('encerra pausa, move para histórico e limpa pausaAtiva', async () => {
    const { result } = renderHook(() => usePausa(), { wrapper: envolverProvider })
    await waitFor(() => expect(result.current.pausaAtiva).toBeNull())

    await act(async () => {
      await result.current.iniciar({ duracaoPlanejada: 24 * 60 * 60 * 1000, valorEconomia: 30 })
    })

    // avança 12 horas
    agoraMock = new Date('2026-03-21T20:00:00.000Z').getTime()

    await act(async () => {
      await result.current.encerrar('Meta alcançada')
    })

    expect(result.current.pausaAtiva).toBeNull()
    expect(result.current.historico).toHaveLength(1)
    expect(result.current.historico[0].status).toBe('concluida')
    expect(result.current.progresso).toBeNull()
  })

  it('interrompe pausa e registra status correto no histórico', async () => {
    const { result } = renderHook(() => usePausa(), { wrapper: envolverProvider })
    await waitFor(() => expect(result.current.pausaAtiva).toBeNull())

    await act(async () => {
      await result.current.iniciar({ duracaoPlanejada: 48 * 60 * 60 * 1000 })
    })

    await act(async () => {
      await result.current.interromper('Imprevisto')
    })

    expect(result.current.pausaAtiva).toBeNull()
    expect(result.current.historico[0].status).toBe('interrompida')
    expect(result.current.historico[0].motivoEncerramento).toBe('Imprevisto')
  })
})
