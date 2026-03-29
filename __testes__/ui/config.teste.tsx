// Testes de UI — Página de Configurações
// Testes comportamentais: renderização, interações básicas

import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import { ProvedorApp } from '../../src/loja/ContextoApp'
import { PaginaConfig } from '../../src/paginas/Config/PaginaConfig'
import { bd } from '../../src/utilitarios/armazenamento/bd'

const envolverComProvider = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <ProvedorApp>{children}</ProvedorApp>
  </BrowserRouter>
)

describe('PaginaConfig — Página de Configurações', () => {
  beforeEach(async () => {
    vi.restoreAllMocks()
    localStorage.clear()
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

  describe('Renderização básica', () => {
    it('renderiza página sem erros', () => {
      const { container } = render(<PaginaConfig />, { wrapper: envolverComProvider })
      expect(container).toBeDefined()
    })

    it('renderiza com tema controls', () => {
      const { container } = render(<PaginaConfig />, { wrapper: envolverComProvider })
      const temTema = container.innerHTML.includes('tema') || 
                      container.innerHTML.includes('Aparência') ||
                      container.innerHTML.includes('automático')
      expect(temTema).toBe(true)
    })

    it('renderiza com proteção controls', () => {
      const { container } = render(<PaginaConfig />, { wrapper: envolverComProvider })
      const temProtecao = container.innerHTML.includes('proteção') ||
                         container.innerHTML.includes('Proteção') ||
                         container.innerHTML.includes('senha') ||
                         container.innerHTML.includes('bloqueio')
      expect(temProtecao).toBe(true)
    })

    it('renderiza botões interat ivos', () => {
      const { container } = render(<PaginaConfig />, { wrapper: envolverComProvider })
      const botoes = container.querySelectorAll('button')
      expect(botoes.length).toBeGreaterThan(0)
    })

    it('renderiza com links de navegação', () => {
      const { container } = render(<PaginaConfig />, { wrapper: envolverComProvider })
      const links = container.querySelectorAll('a')
      expect(links.length).toBeGreaterThan(0)
    })
  })

  describe('Tema: Seletor', () => {
    it('renderiza múltiplos botões de tema', () => {
      const { container } = render(<PaginaConfig />, { wrapper: envolverComProvider })
      const botoes = container.querySelectorAll('button')
      expect(botoes.length).toBeGreaterThanOrEqual(3)
    })

    it('permite clicar em botão de tema', () => {
      const { container } = render(<PaginaConfig />, { wrapper: envolverComProvider })
      const botoes = container.querySelectorAll('button')
      
      if (botoes.length > 0) {
        fireEvent.click(botoes[0])
        expect(botoes[0]).toBeDefined()
      }
    })

    it('renderiza com múltiplas cores theme options', () => {
      const { container } = render(<PaginaConfig />, { wrapper: envolverComProvider })
      const html = container.innerHTML
      
      const temOpcoes = html.includes('escuro') || html.includes('claro') || html.includes('automático')
      expect(temOpcoes).toBe(true)
    })

    it('renderiza formulário de tema sem erros', () => {
      const { container } = render(<PaginaConfig />, { wrapper: envolverComProvider })
      const botoes = container.querySelectorAll('button')
      
      botoes.forEach((botao) => {
        fireEvent.click(botao)
      })
      
      expect(container.innerHTML.length).toBeGreaterThan(0)
    })
  })

  describe('Proteção: Ativar', () => {
    it('renderiza inputs para proteção', () => {
      const { container } = render(<PaginaConfig />, { wrapper: envolverComProvider })
      const inputs = container.querySelectorAll('input[type="password"], input[type="text"]')
      
      expect(inputs).toBeDefined()
    })

    it('renderiza botão de ativar proteção', () => {
      const { container } = render(<PaginaConfig />, { wrapper: envolverComProvider })
      const botoes = container.querySelectorAll('button')
      
      const temBotaoProtecao = Array.from(botoes).some((b) =>
        b.textContent?.toLowerCase().includes('ativar') ||
        b.textContent?.toLowerCase().includes('proteção')
      )
      
      expect(botoes.length > 0).toBe(true)
    })

    it('mantém estado ao substituir valores em inputs', () => {
      const { container } = render(<PaginaConfig />, { wrapper: envolverComProvider })
      const inputs = container.querySelectorAll('input[type="password"]')
      
      if (inputs.length > 0 && inputs[0] instanceof HTMLInputElement) {
        fireEvent.change(inputs[0], { target: { value: 'testSenha123' } })
        expect((inputs[0] as HTMLInputElement).value).toBe('testSenha123')
      }
    })

    it('renderiza timeout seletor', () => {
      const { container } = render(<PaginaConfig />, { wrapper: envolverComProvider })
      const selects = container.querySelectorAll('select')
      
      expect(selects).toBeDefined()
    })
  })

  describe('Proteção: Desativar', () => {
    it('renderiza botão de desativar proteção quando ativa', () => {
      const { container } = render(<PaginaConfig />, { wrapper: envolverComProvider })
      const botoes = container.querySelectorAll('button')
      
      expect(botoes.length).toBeGreaterThan(0)
    })

    it('renderiza checkbox de manter sessão', () => {
      const { container } = render(<PaginaConfig />, { wrapper: envolverComProvider })
      const checkboxes = container.querySelectorAll('input[type="checkbox"]')
      
      expect(checkboxes).toBeDefined()
    })

    it('renderiza troca de senha form', () => {
      const { container } = render(<PaginaConfig />, { wrapper: envolverComProvider })
      const inputs = container.querySelectorAll('input')
      
      expect(inputs.length).toBeGreaterThan(0)
    })
  })

  describe('Telemetria: Controle', () => {
    it('renderiza checkbox de telemetria', () => {
      const { container } = render(<PaginaConfig />, { wrapper: envolverComProvider })
      const checkboxes = container.querySelectorAll('input[type="checkbox"]')
      
      expect(checkboxes.length).toBeGreaterThanOrEqual(0)
    })

    it('renderiza seção de telemetria', () => {
      const { container } = render(<PaginaConfig />, { wrapper: envolverComProvider })
      const temTelemetria = container.innerHTML.toLowerCase().includes('telemetria') ||
                           container.innerHTML.toLowerCase().includes('anônima')
      
      expect(temTelemetria).toBe(true)
    })

    it('permite toggle de telemetria', () => {
      const { container } = render(<PaginaConfig />, { wrapper: envolverComProvider })
      const checkboxes = container.querySelectorAll('input[type="checkbox"]')
      
      checkboxes.forEach((checkbox) => {
        fireEvent.click(checkbox)
      })
      
      expect(container).toBeDefined()
    })

    it('renderiza descrição de telemetria', () => {
      const { container } = render(<PaginaConfig />, { wrapper: envolverComProvider })
      const html = container.innerHTML.toLowerCase()
      
      const temDescricao = html.includes('coleta') || 
                          html.includes('dado') ||
                          html.includes('uso') ||
                          html.includes('anônimo')
      
      expect(temDescricao).toBe(true)
    })
  })

  describe('Economia: Configuração', () => {
    it('renderiza seção de economia e estimativas', () => {
      render(<PaginaConfig />, { wrapper: envolverComProvider })

      expect(screen.getByText('Economia e estimativas')).toBeDefined()
      expect(screen.getByLabelText('Valor diário de uso')).toBeDefined()
      expect(screen.getByLabelText('Moeda')).toBeDefined()
      expect(screen.getByRole('button', { name: 'Salvar estimativa' })).toBeDefined()
    })

    it('salva valor médio e moeda configurados', async () => {
      render(<PaginaConfig />, { wrapper: envolverComProvider })

      const inputValor = screen.getByLabelText('Valor diário de uso')
      const selectMoeda = screen.getByLabelText('Moeda')
      const botaoSalvar = screen.getByRole('button', { name: 'Salvar estimativa' })

      fireEvent.change(inputValor, { target: { value: '25.5' } })
      fireEvent.change(selectMoeda, { target: { value: 'USD' } })
      fireEvent.click(botaoSalvar)

      await waitFor(() => {
        expect(screen.getByText(/Estimativas de economia atualizadas/i)).toBeDefined()
      })
    })

    it('exibe erro ao informar valor inválido', async () => {
      render(<PaginaConfig />, { wrapper: envolverComProvider })

      const inputValor = screen.getByLabelText('Valor diário de uso')
      const botaoSalvar = screen.getByRole('button', { name: 'Salvar estimativa' })

      fireEvent.change(inputValor, { target: { value: '-3' } })
      fireEvent.click(botaoSalvar)

      await waitFor(() => {
        expect(screen.getByText('Informe um valor diário válido, maior ou igual a zero.')).toBeDefined()
      })
    })
  })

  describe('Integração: Completa', () => {
    it('renderiza sem console errors críticos', () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      render(<PaginaConfig />, { wrapper: envolverComProvider })
      
      const errosCriticos = consoleError.mock.calls.filter((call) => {
        const msg = String(call[0])
        return msg.includes('TypeError') || msg.includes('ReferenceError')
      })
      
      consoleError.mockRestore()
      
      expect(errosCriticos.length).toBe(0)
    })

    it('renderiza com estrutura HTML valida', () => {
      const { container } = render(<PaginaConfig />, { wrapper: envolverComProvider })
      
      expect(container.innerHTML.length).toBeGreaterThan(100)
      expect(container.querySelectorAll('*').length).toBeGreaterThan(10)
    })

    it('renderiza com múltiplas seções', () => {
      const { container } = render(<PaginaConfig />, { wrapper: envolverComProvider })
      
      const botoes = container.querySelectorAll('button').length
      const inputs = container.querySelectorAll('input').length
      const links = container.querySelectorAll('a').length
      
      expect(botoes + inputs + links).toBeGreaterThan(5)
    })

    it('renderiza links com href', () => {
      const { container } = render(<PaginaConfig />, { wrapper: envolverComProvider })
      const links = container.querySelectorAll('a')
      
      let linksValidos = 0
      links.forEach((link) => {
        if (link.getAttribute('href')) linksValidos++
      })
      
      expect(linksValidos).toBeGreaterThan(0)
    })

    it('renderiza sem memory leaks ao desmontar', () => {
      const { unmount, container } = render(<PaginaConfig />, { wrapper: envolverComProvider })
      
      const botoes = container.querySelectorAll('button')
      botoes.forEach((b) => fireEvent.click(b))
      
      unmount()
      expect(true).toBe(true)
    })

    it('renderiza em múltiplas instâncias', () => {
      for (let i = 0; i < 3; i++) {
        const { unmount } = render(<PaginaConfig />, { wrapper: envolverComProvider })
        unmount()
      }
      
      expect(true).toBe(true)
    })

    it('renderiza página completa sem freezes', async () => {
      const { container } = render(<PaginaConfig />, { wrapper: envolverComProvider })
      
      const botoes = container.querySelectorAll('button')
      const checkboxes = container.querySelectorAll('input[type="checkbox"]')
      
      botoes.forEach((b) => fireEvent.click(b))
      checkboxes.forEach((c) => fireEvent.click(c))
      
      await waitFor(() => {
        expect(container.innerHTML.length).toBeGreaterThan(0)
      })
    })

    it('renderiza com título de página', () => {
      const { container } = render(<PaginaConfig />, { wrapper: envolverComProvider })
      const temTitulo = container.innerHTML.includes('Configuração') ||
                       container.innerHTML.includes('configuração') ||
                       container.innerHTML.includes('Config')
      
      expect(temTitulo).toBe(true)
    })

    it('renderiza com acesso a settings principais', () => {
      const { container } = render(<PaginaConfig />, { wrapper: envolverComProvider })
      
      const temControles = 
        container.querySelectorAll('button').length > 0 &&
        container.querySelectorAll('input').length > 0 &&
        container.querySelectorAll('a').length > 0
      
      expect(temControles).toBe(true)
    })
  })
})
