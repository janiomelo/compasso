import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import App from '../../src/App'
import { estadoInicial } from '../../src/loja/redutor'
import * as servicoDados from '../../src/servicos/servicoDados'
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

const concluirOnboarding = async () => {
  const agora = Date.now()

  await bd.configuracoes.put({
    chave: 'principal',
    valor: {
      ...estadoInicial.configuracoes,
      onboarding: {
        concluidoEm: agora,
        confirmouMaioridadeEm: agora,
        aceitouTermosPrivacidadeEm: agora,
        versaoTermos: '2026-03',
        versaoPolitica: '2026-03',
      },
    },
  })
}

describe('Dados locais e segurança — navegação de volta contextual', () => {
  beforeEach(async () => {
    vi.restoreAllMocks()
    vi.spyOn(servicoDados, 'obterResumoDadosLocais').mockResolvedValue({
      totalRegistros: 0,
      totalPausas: 0,
      totalPreferenciasSalvas: 0,
      tamanhoAproximadoBytes: 0,
      ultimoBackupManualEm: null,
      ultimoBackupAutomaticoEm: null,
    })
    localStorage.clear()
    configurarMatchMedia()
    await bd.delete()
    await bd.open()
  })

  afterAll(async () => {
    await bd.delete()
    bd.close()
  })

  it('mostra "Voltar para Início" quando acessada pela home', async () => {
    await concluirOnboarding()
    window.history.pushState({}, '', '/')

    render(<App />)

    const linkDadosLocais = await screen.findByRole('link', {
      name: /Como seus dados ficam salvos/i,
    })

    fireEvent.click(linkDadosLocais)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Dados locais e segurança' })).toBeDefined()
    })

    const linkVoltar = screen.getByRole('link', { name: /Voltar para Início/i })
    expect(linkVoltar.getAttribute('href')).toBe('/')
  })

  it('mantém "Voltar para Configurações" quando acessada pelas configurações', async () => {
    await concluirOnboarding()
    window.history.pushState({}, '', '/config')

    render(<App />)

    const linkDadosLocais = await screen.findByRole('link', {
      name: /Dados locais e segurança/i,
    })

    fireEvent.click(linkDadosLocais)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Dados locais e segurança' })).toBeDefined()
    })

    const linkVoltar = screen.getByRole('link', { name: /Voltar para Configurações/i })
    expect(linkVoltar.getAttribute('href')).toBe('/config')
  })
})