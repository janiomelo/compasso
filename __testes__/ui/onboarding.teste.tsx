import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import App from '../../src/App'
import { estadoInicial } from '../../src/loja/redutor'
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

describe('Onboarding — fluxo inicial', () => {
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

  it('deve abrir onboarding no primeiro acesso', async () => {
    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('Primeiro acesso')).toBeDefined()
      expect(screen.getByText('Um espaço pessoal para acompanhar seu ritmo')).toBeDefined()
    })
  })

  it('deve redirecionar rotas protegidas para onboarding enquanto não concluído', async () => {
    window.history.pushState({}, '', '/registro')
    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('Um espaço pessoal para acompanhar seu ritmo')).toBeDefined()
    })
  })

  it('deve concluir onboarding e liberar entrada no app', async () => {
    window.history.pushState({}, '', '/onboarding')
    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('Um espaço pessoal para acompanhar seu ritmo')).toBeDefined()
    })

    fireEvent.click(screen.getByText('Começar'))
    fireEvent.click(screen.getByText('Entender e continuar'))
    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }))

    fireEvent.click(screen.getByLabelText('Confirmo que tenho 18 anos ou mais'))
    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }))

    fireEvent.click(screen.getByLabelText('Li e aceito os Termos de Uso e a Política de Privacidade'))
    fireEvent.click(screen.getByRole('button', { name: 'Entrar no Compasso' }))

    await waitFor(() => {
      expect(screen.getByText('Seu compasso recente')).toBeDefined()
    })
  })

  it('deve permitir revisar onboarding sem bloquear uso quando já concluído', async () => {
    await bd.configuracoes.put({
      chave: 'principal',
      valor: {
        ...estadoInicial.configuracoes,
        onboarding: {
          concluidoEm: Date.now(),
          confirmouMaioridadeEm: Date.now(),
          aceitouTermosPrivacidadeEm: Date.now(),
          versaoTermos: '2026-03',
          versaoPolitica: '2026-03',
        },
      },
    })

    window.history.pushState({}, '', '/onboarding?revisar=1')
    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('Revisão do onboarding')).toBeDefined()
      expect(screen.getByText('Começar')).toBeDefined()
    })
  })
})
