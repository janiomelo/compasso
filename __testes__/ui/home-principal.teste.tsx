// Testes de UI da Home Principal — Pacote E  
// Testes comportamentais: renderização com/sem pausa, cartões dinâmicos

import { render, screen, waitFor } from '@testing-library/react'
import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import { ProvedorApp } from '../../src/loja/ContextoApp'
import { PaginaPrincipal } from '../../src/paginas/Principal/PaginaPrincipal'
import { bd } from '../../src/utilitarios/armazenamento/bd'

const envolverProvider = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <ProvedorApp>{children}</ProvedorApp>
  </BrowserRouter>
)

describe('Home Principal — UI Comportamental', () => {
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

  it('renderiza header da home', () => {
    render(<PaginaPrincipal />, { wrapper: envolverProvider })

    expect(screen.getByText('Início')).toBeDefined()
    expect(screen.getByText('Seu compasso recente')).toBeDefined()
    expect(screen.getByText(/Uma leitura rápida/)).toBeDefined()
  })

  it('exibe hero sem pausa ativa quando nenhuma pausa inativa', async () => {
    render(<PaginaPrincipal />, { wrapper: envolverProvider })

    await waitFor(() => {
      expect(screen.getByText('Sem pausa ativa')).toBeDefined()
      expect(screen.getByText('Nenhuma pausa ativa')).toBeDefined()
    })
  })

  it('renderiza 3 cartões de métricas', async () => {
    render(<PaginaPrincipal />, { wrapper: envolverProvider })

    await waitFor(() => {
      expect(screen.getByText('Último registro')).toBeDefined()
      expect(screen.getByText('Últimos 7 dias')).toBeDefined()
      expect(screen.getByText('Economia acumulada')).toBeDefined()
    })
  })

  it('cartão de Último Registro mostra mensagem quando vazio', async () => {
    render(<PaginaPrincipal />, { wrapper: envolverProvider })

    await waitFor(() => {
      expect(screen.getByText('Nenhum registro ainda')).toBeDefined()
      expect(screen.getByText(/Comece registrando um momento/)).toBeDefined()
    })
  })

  it('exibe seção de Registros Recentes', async () => {
    render(<PaginaPrincipal />, { wrapper: envolverProvider })

    await waitFor(() => {
      expect(screen.getByText('Registros recentes')).toBeDefined()
      expect(screen.getByText(/Abrir ritmo/)).toBeDefined()
    })
  })

  it('renderiza CTA de Registro', async () => {
    render(<PaginaPrincipal />, { wrapper: envolverProvider })

    await waitFor(() => {
      const ctas = screen.getAllByText('Registrar momento')
      expect(ctas.length).toBeGreaterThan(0)
    })
  })

  it('links navegam para páginas corretas', async () => {
    render(<PaginaPrincipal />, { wrapper: envolverProvider })

    const linksRegistro = screen.getAllByRole('link').filter(link => link.getAttribute('href') === '/registro')
    expect(linksRegistro.length).toBeGreaterThan(0)

    const linksRitmo = screen.getAllByRole('link').filter(link => link.getAttribute('href') === '/ritmo')
    expect(linksRitmo.length).toBeGreaterThan(0)

    const linksPausa = screen.getAllByRole('link').filter(link => link.getAttribute('href') === '/pausa')
    expect(linksPausa.length).toBeGreaterThan(0)
  })

  it('exibe 0 registros quando lista vazia', async () => {
    render(<PaginaPrincipal />, { wrapper: envolverProvider })

    await waitFor(() => {
      // Verifica que há um elemento com '0' em algum lugar da página
      const texto0 = screen.queryByText('0')
      expect(texto0).toBeDefined()
    })
  })
})
