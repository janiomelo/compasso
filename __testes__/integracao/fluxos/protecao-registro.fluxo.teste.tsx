import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import App from '../../../src/App'
import { bd, consultasBD } from '../../../src/utilitarios/armazenamento/bd'

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

const criarRegexRotulo = (rotulo: string) => new RegExp(rotulo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')

const concluirOnboarding = async () => {
  await waitFor(() => {
    expect(screen.getByText('Bem-vindo ao Compasso')).toBeDefined()
  })

  fireEvent.click(screen.getByRole('button', { name: 'Começar' }))

  await waitFor(() => {
    expect(screen.getByText('Antes de continuar')).toBeDefined()
  })

  fireEvent.click(screen.getByLabelText('Confirmo que tenho 18 anos ou mais'))
  fireEvent.click(screen.getByRole('button', { name: 'Continuar' }))

  await waitFor(() => {
    expect(screen.getByText('Aceite e entrada')).toBeDefined()
  })

  fireEvent.click(screen.getByLabelText('Li e aceito os Termos de Uso e a Política de Privacidade'))
  fireEvent.click(screen.getByRole('button', { name: 'Entrar no Compasso' }))

  await waitFor(() => {
    expect(screen.getByText('Seu compasso recente')).toBeDefined()
  })
}

const registrarMomento = async ({
  metodo,
  intencao,
  intensidade,
}: {
  metodo: string
  intencao: string
  intensidade: string
}) => {
  fireEvent.click(screen.getByRole('link', { name: 'Registrar' }))

  await screen.findByRole('heading', { name: 'Registrar momento' })
  const botaoMetodo = await screen.findByRole('button', { name: criarRegexRotulo(metodo) })

  fireEvent.click(botaoMetodo)

  await waitFor(() => {
    expect(screen.getByText('Qual era sua intenção principal?')).toBeDefined()
  })

  fireEvent.click(await screen.findByRole('button', { name: criarRegexRotulo(intencao) }))

  await waitFor(() => {
    expect(screen.getByText('Qual foi a intensidade?')).toBeDefined()
  })

  fireEvent.click(await screen.findByRole('button', { name: criarRegexRotulo(intensidade) }))

  await waitFor(() => {
    expect(screen.getByText('Algo a mais para guardar deste momento?')).toBeDefined()
  })

  fireEvent.click(screen.getByRole('button', { name: 'Concluir registro' }))

  await waitFor(() => {
    expect(screen.getByText('Seu momento foi registrado')).toBeDefined()
  })

  fireEvent.click(screen.getByRole('button', { name: 'Ir para o início' }))

  await waitFor(() => {
    expect(screen.getByText('Seu compasso recente')).toBeDefined()
  })
}

const ativarProtecaoPorSenha = async (senha: string) => {
  fireEvent.click(screen.getByRole('link', { name: 'Abrir configurações' }))

  await waitFor(() => {
    expect(screen.getByRole('heading', { name: 'Configurações' })).toBeDefined()
  })

  fireEvent.change(screen.getByLabelText('Nova senha'), { target: { value: senha } })
  fireEvent.change(screen.getByLabelText('Confirmar senha'), { target: { value: senha } })
  fireEvent.click(screen.getByRole('button', { name: 'Ativar proteção' }))

  await waitFor(() => {
    expect(screen.getByText('Proteção ativada. Seus dados locais passam a ser protegidos.')).toBeDefined()
  })
}

describe('fluxo caixa-preta de proteção com registros', () => {
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

  it('mantém acessíveis os momentos criados antes e depois de ativar senha, após sair e voltar ao app', async () => {
    const senha = 'SenhaFluxo123'
    const { unmount } = render(<App />)

    await concluirOnboarding()

    await registrarMomento({
      metodo: 'Vaporizado',
      intencao: 'Foco - concentrar',
      intensidade: 'Média',
    })

    await ativarProtecaoPorSenha(senha)

    await registrarMomento({
      metodo: 'Fumado',
      intencao: 'Paz - acalmar',
      intensidade: 'Alta',
    })

    unmount()

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('Desbloquear Compasso')).toBeDefined()
    })

    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: senha } })
    fireEvent.click(screen.getByRole('button', { name: 'Desbloquear' }))

    await waitFor(() => {
      expect(screen.getByText('Seu compasso recente')).toBeDefined()
      expect(screen.getByText('Registros recentes')).toBeDefined()
      expect(screen.getAllByText('Vaporizado').length).toBeGreaterThan(0)
      expect(screen.getAllByText('Fumado').length).toBeGreaterThan(0)
    })

    const registrosPersistidos = await bd.registros.toArray()
    const registrosDesbloqueados = await consultasBD.obterRegistros()
    const quantidadeCifrada = registrosPersistidos.filter(
      (registro) => typeof registro === 'object' && registro !== null && '_payload' in registro,
    ).length

    expect(registrosPersistidos).toHaveLength(2)
    expect(registrosDesbloqueados).toHaveLength(2)
    expect(registrosDesbloqueados.map((registro) => registro.metodo)).toEqual(
      expect.arrayContaining(['vaporizado', 'fumado']),
    )
    expect(quantidadeCifrada).toBeGreaterThan(0)
  })
})