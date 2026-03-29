import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { HeroPrincipal } from '../../src/paginas/Principal/componentes/HeroPrincipal'

vi.mock('../../src/ganchos', () => ({
  usePausa: vi.fn(),
  useEconomia: vi.fn(),
}))

import { useEconomia, usePausa } from '../../src/ganchos'

const usePausaMock = vi.mocked(usePausa)
const useEconomiaMock = vi.mocked(useEconomia)

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
)

describe('HeroPrincipal — ganho estimado', () => {
  beforeEach(() => {
    usePausaMock.mockReturnValue({
      pausaAtiva: {
        id: 'pausa-1',
        iniciadoEm: Date.now(),
        duracaoPlanejada: 60 * 60 * 1000,
        status: 'ativa',
        valorEconomia: 0,
      },
      progresso: {
        percentualConclusao: 50,
        restanteMs: 30 * 60 * 1000,
        decorridoMs: 30 * 60 * 1000,
        concluida: false,
      },
      historico: [],
      iniciar: vi.fn(),
      encerrar: vi.fn(),
      interromper: vi.fn(),
    })
  })

  it('nao exibe ganho estimado quando economia nao estiver configurada', () => {
    useEconomiaMock.mockReturnValue({
      totalAcumulado: 0,
      taxaDiaria: 0,
      economiaUltimaPausa: 0,
      projecao30Dias: 0,
      possuiHistoricoEconomia: false,
      economiaPotencialPausaAtiva: 0,
      economiaConfigurada: false,
    })

    render(<HeroPrincipal />, { wrapper })

    expect(screen.queryByText(/ganho estimado/i)).toBeNull()
    expect(screen.getByText(/de meta total/i)).toBeDefined()
  })

  it('exibe ganho estimado quando economia estiver configurada', () => {
    useEconomiaMock.mockReturnValue({
      totalAcumulado: 10,
      taxaDiaria: 1,
      economiaUltimaPausa: 5,
      projecao30Dias: 30,
      possuiHistoricoEconomia: true,
      economiaPotencialPausaAtiva: 2,
      economiaConfigurada: true,
    })

    render(<HeroPrincipal />, { wrapper })

    expect(screen.getByText(/ganho estimado/i)).toBeDefined()
  })
})
