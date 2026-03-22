// Testes de UI do Wizard de Registro — Pacote E

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import { ProvedorApp } from '../../src/loja/ContextoApp'
import { PaginaRegistro } from '../../src/paginas/Registro/PaginaRegistro'
import { bd } from '../../src/utilitarios/armazenamento/bd'

const envolverProvider = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <ProvedorApp>{children}</ProvedorApp>
  </BrowserRouter>
)

describe('Wizard de Registro — UI', () => {
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

  it('renderiza etapa inicial com métodos', () => {
    render(<PaginaRegistro />, { wrapper: envolverProvider })

    expect(screen.getByText('Como foi?')).toBeDefined()
    expect(screen.getByText('Vapor')).toBeDefined()
    expect(screen.getByText('Flor')).toBeDefined()
    expect(screen.getByText('Continuar')).toBeDefined()
  })

  it('avança para a etapa de intenção', async () => {
    render(<PaginaRegistro />, { wrapper: envolverProvider })

    fireEvent.click(screen.getByText('Vapor'))
    fireEvent.click(screen.getByText('Continuar'))

    await waitFor(() => {
      expect(screen.getByText('Qual era sua intenção?')).toBeDefined()
    })
  })

  it('volta da etapa de intenção para método', async () => {
    render(<PaginaRegistro />, { wrapper: envolverProvider })

    fireEvent.click(screen.getByText('Vapor'))
    fireEvent.click(screen.getByText('Continuar'))

    await waitFor(() => {
      expect(screen.getByText('Qual era sua intenção?')).toBeDefined()
    })

    fireEvent.click(screen.getByText('Voltar'))

    await waitFor(() => {
      expect(screen.getByText('Como foi?')).toBeDefined()
    })
  })

  it('completa o fluxo até exibir botão de salvar', async () => {
    render(<PaginaRegistro />, { wrapper: envolverProvider })

    fireEvent.click(screen.getByText('Vapor'))
    fireEvent.click(screen.getByText('Continuar'))

    await waitFor(() => {
      expect(screen.getByText('Qual era sua intenção?')).toBeDefined()
    })
    fireEvent.click(screen.getByText('Foco'))
    fireEvent.click(screen.getByText('Continuar'))

    await waitFor(() => {
      expect(screen.getByText('Qual foi a intensidade?')).toBeDefined()
    })
    fireEvent.change(screen.getByRole('slider'), { target: { value: '7' } })
    fireEvent.click(screen.getByText('Continuar'))

    await waitFor(() => {
      expect(screen.getByText('Quer adicionar uma observação?')).toBeDefined()
    })
    expect(screen.getByText('Salvar registro')).toBeDefined()
  })
})
