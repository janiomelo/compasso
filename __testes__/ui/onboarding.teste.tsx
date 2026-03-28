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
      expect(screen.getByText('Bem-vindo ao Compasso')).toBeDefined()
      expect(screen.getByText(/privacidade por padrão/i)).toBeDefined()
      expect(screen.getByText('Registrar momentos do seu dia com objetividade.')).toBeDefined()
      expect(screen.getByText('Acompanhar pausas no seu tempo.')).toBeDefined()
      expect(screen.getByText('Perceber padrões com mais clareza.')).toBeDefined()
      expect(screen.getByRole('link', { name: /Entender melhor o projeto/i })).toBeDefined()
    })
  })

  it('deve redirecionar rotas protegidas para onboarding enquanto não concluído', async () => {
    window.history.pushState({}, '', '/registro')
    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('Bem-vindo ao Compasso')).toBeDefined()
    })
  })

  it('deve concluir onboarding e liberar entrada no app', async () => {
    window.history.pushState({}, '', '/onboarding')
    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('Bem-vindo ao Compasso')).toBeDefined()
    })

    fireEvent.click(screen.getByText('Começar'))
    fireEvent.click(screen.getByText('Entendi e quero continuar'))
    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }))

    fireEvent.click(screen.getByLabelText('Confirmo que tenho 18 anos ou mais'))
    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }))

    fireEvent.click(screen.getByLabelText('Li e aceito os Termos de Uso e a Política de Privacidade'))
    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }))

    // etapa 6: telemetria — avança sem alterar preferência
    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }))

    fireEvent.click(screen.getByRole('button', { name: 'Fazer isso depois' }))

    await waitFor(() => {
      expect(screen.getByText('Seu compasso recente')).toBeDefined()
    })
  })

  it('deve permitir ativar protecao durante o onboarding', async () => {
    window.history.pushState({}, '', '/onboarding')
    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('Bem-vindo ao Compasso')).toBeDefined()
    })

    fireEvent.click(screen.getByText('Começar'))
    fireEvent.click(screen.getByText('Entendi e quero continuar'))
    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }))
    fireEvent.click(screen.getByLabelText('Confirmo que tenho 18 anos ou mais'))
    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }))

    fireEvent.click(screen.getByLabelText('Li e aceito os Termos de Uso e a Política de Privacidade'))
    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }))

    // etapa 6: telemetria — avança sem alterar preferência
    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }))

    fireEvent.click(screen.getByRole('button', { name: 'Ativar agora' }))
    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: 'senha-forte-123' } })
    fireEvent.change(screen.getByLabelText('Confirmar senha'), { target: { value: 'senha-forte-123' } })
    fireEvent.click(screen.getByRole('button', { name: 'Ativar proteção e entrar' }))

    await waitFor(async () => {
      expect(screen.getByText('Seu compasso recente')).toBeDefined()
      const configuracoes = await bd.configuracoes.get('principal')
      expect(configuracoes?.valor.protecaoAtiva).toBe(true)
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
