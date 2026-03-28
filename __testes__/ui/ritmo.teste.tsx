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
})
