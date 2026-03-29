import { render, screen, waitFor } from '@testing-library/react'
import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import { ProvedorApp } from '../../src/loja/ContextoApp'
import { PaginaRitmo } from '../../src/paginas/Ritmo/PaginaRitmo'
import { criarRegistro } from '../../src/servicos/servicoRegistro'
import { bd } from '../../src/utilitarios/armazenamento/bd'

const envolverProvider = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <ProvedorApp>{children}</ProvedorApp>
  </BrowserRouter>
)

describe('Ritmo — UI', () => {
  beforeEach(async () => {
    vi.restoreAllMocks()
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

  it('exibe estado vazio para agrupamento de intenções', async () => {
    render(<PaginaRitmo />, { wrapper: envolverProvider })

    await waitFor(() => {
      expect(screen.getByText('Intenções que mais aparecem')).toBeDefined()
      expect(screen.getByText('Quando você registrar os primeiros momentos, as intenções mais frequentes aparecem aqui.')).toBeDefined()
    })
  })

  it('agrupa intenções registradas visualmente', async () => {
    await criarRegistro({ metodo: 'vaporizado', intencao: 'foco', intensidade: 'media' })
    await criarRegistro({ metodo: 'fumado', intencao: 'foco', intensidade: 'alta' })
    await criarRegistro({ metodo: 'comestivel', intencao: 'social', intensidade: 'leve' })

    render(<PaginaRitmo />, { wrapper: envolverProvider })

    await waitFor(() => {
      expect(screen.getByText('Intenções que mais aparecem')).toBeDefined()
      expect(screen.getByText('Foco')).toBeDefined()
      expect(screen.getByText('Social')).toBeDefined()
      expect(screen.getByText('2 momentos')).toBeDefined()
      expect(screen.getByText('67% dos registros visíveis')).toBeDefined()
    })
  })

  it('mostra leitura simples e oculta tendencia com menos de 3 registros', async () => {
    await criarRegistro({ metodo: 'vaporizado', intencao: 'foco', intensidade: 'media' })

    render(<PaginaRitmo />, { wrapper: envolverProvider })

    await waitFor(() => {
      expect(screen.getByText('Leitura simples')).toBeDefined()
      expect(screen.getByText('Base inicial')).toBeDefined()
      expect(screen.queryByText('Tendência')).toBeNull()
      expect(screen.queryByText('Valor percebido')).toBeNull()
      expect(screen.queryByText(/\/ 10/)).toBeNull()
    })
  })

  it('oculta tendencia quando historico ainda nao cobre 7 dias', async () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    const base = new Date('2026-03-29T20:00:00.000Z').getTime()

    for (let i = 0; i < 3; i += 1) {
      vi.setSystemTime(base - i * 24 * 60 * 60 * 1000)
      await criarRegistro({ metodo: 'vaporizado', intencao: 'foco', intensidade: 'media' })
    }

    vi.setSystemTime(base)
    render(<PaginaRitmo />, { wrapper: envolverProvider })

    await waitFor(() => {
      expect(screen.queryByText('Tendência')).toBeNull()
      expect(screen.getByText('Média semanal')).toBeDefined()
    })

  })
})
