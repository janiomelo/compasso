import { render, screen, waitFor } from '@testing-library/react'
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import App from '../../src/App'
import { bd } from '../../src/utilitarios/armazenamento/bd'

const configurarMatchMedia = () => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: query.includes('light'),
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
}

describe('Rotas públicas — SEO e descoberta', () => {
  beforeEach(async () => {
    vi.restoreAllMocks()
    configurarMatchMedia()
    await bd.delete()
    await bd.open()
    window.history.pushState({}, '', '/')
  })

  afterAll(async () => {
    await bd.delete()
    bd.close()
  })

  it('deve abrir /privacidade sem bloquear em onboarding', async () => {
    window.history.pushState({}, '', '/privacidade')

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('Política de Privacidade — Compasso')).toBeDefined()
      expect(screen.queryByText('Primeiro acesso')).toBeNull()
    })
  })

  it('deve abrir /como-funciona sem bloquear em onboarding', async () => {
    window.history.pushState({}, '', '/como-funciona')

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('Dados Locais e Segurança — Compasso')).toBeDefined()
      expect(screen.queryByText('Primeiro acesso')).toBeNull()
    })
  })

  it('deve redirecionar /sobre para /projeto', async () => {
    window.history.pushState({}, '', '/sobre')

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('Sobre e Transparência — Compasso')).toBeDefined()
    })
  })

  it('deve abrir /termos sem bloquear em onboarding', async () => {
    window.history.pushState({}, '', '/termos')

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('Termos de Uso — Compasso')).toBeDefined()
      expect(screen.queryByText('Primeiro acesso')).toBeNull()
    })
  })
})
