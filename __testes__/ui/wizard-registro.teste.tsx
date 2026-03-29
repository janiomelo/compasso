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

    expect(screen.getByText('Qual foi a forma de uso?')).toBeDefined()
    expect(screen.getByText('Vaporizado')).toBeDefined()
    expect(screen.getByText('Fumado')).toBeDefined()
    expect(screen.queryByText('Continuar')).toBeNull()
    expect(screen.getByRole('button', { name: 'Vaporizado' }).getAttribute('aria-pressed')).toBe('false')
    expect(screen.getByRole('button', { name: 'Fumado' }).getAttribute('aria-pressed')).toBe('false')
  })

  it('avança automaticamente para a etapa de intenção ao escolher forma de uso', async () => {
    render(<PaginaRegistro />, { wrapper: envolverProvider })

    fireEvent.click(screen.getByText('Vaporizado'))

    await waitFor(() => {
      expect(screen.getByText('Qual era sua intenção principal?')).toBeDefined()
    })

    expect(screen.getByRole('button', { name: 'Foco - concentrar' }).getAttribute('aria-pressed')).toBe('false')
  })

  it('volta da etapa de intenção para método', async () => {
    render(<PaginaRegistro />, { wrapper: envolverProvider })

    fireEvent.click(screen.getByText('Vaporizado'))

    await waitFor(() => {
      expect(screen.getByText('Qual era sua intenção principal?')).toBeDefined()
    })

    fireEvent.click(screen.getByText('Voltar'))

    await waitFor(() => {
      expect(screen.getByText('Qual foi a forma de uso?')).toBeDefined()
    })
  })

  it('avança automaticamente até a etapa de observação nas escolhas principais', async () => {
    render(<PaginaRegistro />, { wrapper: envolverProvider })

    fireEvent.click(screen.getByText('Vaporizado'))

    await waitFor(() => {
      expect(screen.getByText('Qual era sua intenção principal?')).toBeDefined()
    })

    fireEvent.click(screen.getByText('Foco - concentrar'))

    await waitFor(() => {
      expect(screen.getByText('Qual foi a intensidade?')).toBeDefined()
    })

    expect(screen.getByRole('button', { name: /Leve/i }).getAttribute('aria-pressed')).toBe('false')
    expect(screen.getByRole('button', { name: /Média/i }).getAttribute('aria-pressed')).toBe('false')
    expect(screen.getByRole('button', { name: /Alta/i }).getAttribute('aria-pressed')).toBe('false')

    fireEvent.click(screen.getByText('Alta'))

    await waitFor(() => {
      expect(screen.getByText('Algo a mais para guardar deste momento?')).toBeDefined()
      expect(screen.getByPlaceholderText('Escreva algo, se quiser')).toBeDefined()
    })
  })

  it('mantém observação opcional visível e permite concluir sem escrever nada', async () => {
    render(<PaginaRegistro />, { wrapper: envolverProvider })

    fireEvent.click(screen.getByText('Vaporizado'))

    await waitFor(() => {
      expect(screen.getByText('Qual era sua intenção principal?')).toBeDefined()
    })

    fireEvent.click(screen.getByText('Foco - concentrar'))

    await waitFor(() => {
      expect(screen.getByText('Qual foi a intensidade?')).toBeDefined()
    })

    fireEvent.click(screen.getByText('Alta'))

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Escreva algo, se quiser')).toBeDefined()
    })

    fireEvent.click(screen.getByText('Concluir registro'))

    await waitFor(() => {
      expect(screen.getByText('Seu momento foi registrado')).toBeDefined()
      expect(screen.getByText('Ir para o início')).toBeDefined()
      expect(screen.getByText('Registrar outro momento')).toBeDefined()
    })
  })

  it('permite voltar mesmo após o autoavanço até a etapa inicial', async () => {
    render(<PaginaRegistro />, { wrapper: envolverProvider })

    fireEvent.click(screen.getByText('Vaporizado'))

    await waitFor(() => {
      expect(screen.getByText('Qual era sua intenção principal?')).toBeDefined()
    })

    fireEvent.click(screen.getByText('Relaxar - descansar'))

    await waitFor(() => {
      expect(screen.getByText('Qual foi a intensidade?')).toBeDefined()
    })

    fireEvent.click(screen.getByText('Voltar'))

    await waitFor(() => {
      expect(screen.getByText('Qual era sua intenção principal?')).toBeDefined()
    })

    fireEvent.click(screen.getByText('Voltar'))

    await waitFor(() => {
      expect(screen.getByText('Qual foi a forma de uso?')).toBeDefined()
    })
  })
})
