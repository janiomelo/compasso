// Testes de UI da Pausa — Pacote E

import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import { ProvedorApp } from '../../src/loja/ContextoApp'
import { PaginaPausa } from '../../src/paginas/Pausa/PaginaPausa'
import { bd, consultasBD } from '../../src/utilitarios/armazenamento/bd'
import { DURACOES_PAUSA } from '../../src/utilitarios/constantes'

const envolverProvider = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <ProvedorApp>{children}</ProvedorApp>
  </BrowserRouter>
)

describe('Pausa — UI', () => {
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

  it('renderiza seção inicial para começar pausa', async () => {
    render(<PaginaPausa />, { wrapper: envolverProvider })

    await waitFor(() => {
      expect(screen.getByText('Começar uma pausa')).toBeDefined()
      expect(screen.getByText('Iniciar pausa')).toBeDefined()
    })
  })

  it('mostra opções de duração', () => {
    render(<PaginaPausa />, { wrapper: envolverProvider })

    expect(screen.getByText('24 horas')).toBeDefined()
    expect(screen.getByText('48 horas')).toBeDefined()
    expect(screen.getByText('7 dias')).toBeDefined()
  })

  it('inicia pausa e exibe progresso', async () => {
    render(<PaginaPausa />, { wrapper: envolverProvider })

    fireEvent.click(screen.getByText('Iniciar pausa'))

    await waitFor(() => {
      expect(screen.getByText('Sua pausa está em andamento')).toBeDefined()
      expect(screen.getByRole('progressbar')).toBeDefined()
      expect(screen.getByText('Cancelar pausa')).toBeDefined()
      expect(screen.queryByText('Concluir pausa')).toBeNull()
      expect(screen.getByText(/Concluir disponível em/i)).toBeDefined()
    })
  })

  it('exibe concluir quando a pausa ativa já passou do tempo mínimo', async () => {
    await consultasBD.salvarPausa({
      id: 'pausa-ativa-antiga',
      iniciadoEm: Date.now() - (6 * 60 * 1000),
      duracaoPlanejada: DURACOES_PAUSA.HORAS_24,
      status: 'ativa',
      valorEconomia: 0,
    })

    render(<PaginaPausa />, { wrapper: envolverProvider })

    await waitFor(() => {
      expect(screen.getByText('Concluir pausa')).toBeDefined()
      expect(screen.getByText('Cancelar pausa')).toBeDefined()
    })
  })

  it('cancela pausa curta sem registrar no histórico', async () => {
    render(<PaginaPausa />, { wrapper: envolverProvider })

    fireEvent.click(screen.getByText('Iniciar pausa'))

    await waitFor(() => {
      expect(screen.getByText('Cancelar pausa')).toBeDefined()
    })

    fireEvent.click(screen.getByText('Cancelar pausa'))

    await waitFor(() => {
      expect(screen.getByText('Começar uma pausa')).toBeDefined()
      expect(screen.getByText('Pausa cancelada em menos de 5 minutos. Este ciclo não foi salvo no histórico.')).toBeDefined()
      expect(screen.queryByText('Histórico recente')).toBeNull()
    })
  })
})
