// Testes de UI da Home Principal — Pacote E  
// Testes comportamentais: renderização com/sem pausa, cartões dinâmicos

import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import { ProvedorApp } from '../../src/loja/ContextoApp'
import { estadoInicial } from '../../src/loja/redutor'
import { PaginaPrincipal } from '../../src/paginas/Principal/PaginaPrincipal'
import { criarRegistro } from '../../src/servicos/servicoRegistro'
import { bd, consultasBD } from '../../src/utilitarios/armazenamento/bd'

const envolverProvider = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <ProvedorApp>{children}</ProvedorApp>
  </BrowserRouter>
)

describe('Home Principal — UI Comportamental', () => {
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

  it('renderiza header da home', () => {
    render(<PaginaPrincipal />, { wrapper: envolverProvider })

    expect(screen.getByText('Início')).toBeDefined()
    expect(screen.getByText('Seu compasso recente')).toBeDefined()
    expect(screen.getByText(/Um espaço pessoal para pessoas adultas/)).toBeDefined()
  })

  it('exibe seção Entenda o Compasso com cards navegáveis', async () => {
    render(<PaginaPrincipal />, { wrapper: envolverProvider })

    await waitFor(() => {
      expect(screen.getByText('Entenda o Compasso')).toBeDefined()
      expect(screen.getByText('Conheça o app')).toBeDefined()
      expect(screen.getByText('Como seus dados ficam salvos')).toBeDefined()
      expect(screen.getByText('Telemetria anônima')).toBeDefined()
      expect(screen.getByText('Proteção por senha')).toBeDefined()
      expect(screen.getByText('Uso e limites do projeto')).toBeDefined()
      expect(screen.queryByText('Fazer primeiro registro')).toBeNull()
      expect(screen.getAllByText('Ver').length).toBeGreaterThan(0)
      expect(screen.getByText('Ativada por padrão')).toBeDefined()
      expect(screen.getByText('Configurar')).toBeDefined()
    })
  })

  it('marca item de leitura ao clicar em uso e limites do projeto', async () => {
    const { unmount } = render(<PaginaPrincipal />, { wrapper: envolverProvider })

    const botaoUsoLimites = await screen.findByText('Uso e limites do projeto')
    fireEvent.click(botaoUsoLimites)

    const chaveVistos = Object.keys(localStorage).find((chave) =>
      chave.startsWith('compasso_entenda_vistos:')
    )

    expect(chaveVistos).toBeTruthy()

    const vistos = JSON.parse(localStorage.getItem(chaveVistos as string) ?? '{}')
    expect(vistos.usoLimites).toBe(true)

    unmount()
    render(<PaginaPrincipal />, { wrapper: envolverProvider })

    await waitFor(() => {
      expect(screen.getByText('Revisado')).toBeDefined()
    })
  })

  it('marca telemetria como revisada ao abrir o item de telemetria', async () => {
    const { unmount } = render(<PaginaPrincipal />, { wrapper: envolverProvider })

    const itemTelemetria = await screen.findByText('Telemetria anônima')
    fireEvent.click(itemTelemetria)

    const chaveVistos = Object.keys(localStorage).find((chave) =>
      chave.startsWith('compasso_entenda_vistos:')
    )

    expect(chaveVistos).toBeTruthy()

    const vistos = JSON.parse(localStorage.getItem(chaveVistos as string) ?? '{}')
    expect(vistos.telemetria).toBe(true)

    unmount()
    render(<PaginaPrincipal />, { wrapper: envolverProvider })

    await waitFor(() => {
      expect(screen.getByText('Ativada')).toBeDefined()
    })
  })

  it('recolhe seção por padrão quando tudo estiver concluído e permite revisar', async () => {
    const agora = Date.now()

    await consultasBD.salvarConfiguracoes({
      ...estadoInicial.configuracoes,
      protecaoAtiva: true,
      telemetria: {
        consentido: true,
        atualizadoEm: agora + 1000,
      },
      onboarding: {
        concluidoEm: agora,
        confirmouMaioridadeEm: agora,
        aceitouTermosPrivacidadeEm: agora,
        versaoTermos: 'v1',
        versaoPolitica: 'v1',
      },
    })

    localStorage.setItem(`compasso_entenda_vistos:${agora}`, JSON.stringify({
      conhecaApp: true,
      dadosLocais: true,
      usoLimites: true,
      telemetria: true,
    }))

    render(<PaginaPrincipal />, { wrapper: envolverProvider })

    await waitFor(() => {
      expect(screen.getByText('5 de 5 concluídos · revisar dados, telemetria e proteção')).toBeDefined()
      expect(screen.getByRole('button', { name: /Expandir/i })).toBeDefined()
      expect(screen.queryByText('Conheça o app')).toBeNull()
    })

    fireEvent.click(screen.getByRole('button', { name: /Expandir/i }))

    await waitFor(() => {
      expect(screen.getByText('Conheça o app')).toBeDefined()
      expect(screen.getByText('Como seus dados ficam salvos')).toBeDefined()
    })
  })

  it('exibe hero sem pausa ativa quando nenhuma pausa inativa', async () => {
    render(<PaginaPrincipal />, { wrapper: envolverProvider })

    await waitFor(() => {
      expect(screen.getByText('Nenhuma pausa ativa')).toBeDefined()
      expect(screen.getByText(/inicie uma pausa curta/i)).toBeDefined()
    })
  })

  it('estado vazio prioriza CTA e nao mostra cards de metricas', async () => {
    render(<PaginaPrincipal />, { wrapper: envolverProvider })

    await waitFor(() => {
      expect(screen.getByText(/Comece com um registro rápido/)).toBeDefined()
      expect(screen.queryByText('Último registro')).toBeNull()
      expect(screen.queryByText('Últimos 7 dias')).toBeNull()
      expect(screen.queryByText('Economia acumulada')).toBeNull()
    })
  })

  it('estado vazio não exibe checklist na primeira dobra', async () => {
    render(<PaginaPrincipal />, { wrapper: envolverProvider })

    await waitFor(() => {
      expect(screen.queryByText('Próximos passos')).toBeNull()
      expect(screen.queryByText('Entender seus dados')).toBeNull()
    })
  })

  it('estado vazio oculta seção de registros recentes', async () => {
    render(<PaginaPrincipal />, { wrapper: envolverProvider })

    await waitFor(() => {
      expect(screen.queryByText('Registros recentes')).toBeNull()
      expect(screen.queryByText(/Abrir ritmo/)).toBeNull()
    })
  })

  it('renderiza CTA de Registro com copy correto', async () => {
    render(<PaginaPrincipal />, { wrapper: envolverProvider })

    await waitFor(() => {
      expect(screen.getByText('Novo registro')).toBeDefined()
      const titulosCTA = screen.getAllByText('Registrar momento')
      expect(titulosCTA.length).toBeGreaterThan(0)
    })
  })

  it('links navegam para páginas corretas', async () => {
    render(<PaginaPrincipal />, { wrapper: envolverProvider })

    const linksRegistro = screen.getAllByRole('link').filter(link => link.getAttribute('href') === '/registro')
    expect(linksRegistro.length).toBeGreaterThan(0)

    const linksPausa = screen.getAllByRole('link').filter(link => link.getAttribute('href') === '/pausa')
    expect(linksPausa.length).toBeGreaterThan(0)

    const linksComoFunciona = screen.getAllByRole('link').filter(link => link.getAttribute('href') === '/como-funciona')
    expect(linksComoFunciona.length).toBeGreaterThan(0)

    const linksProjeto = screen.getAllByRole('link').filter(link => link.getAttribute('href') === '/projeto')
    expect(linksProjeto.length).toBeGreaterThan(0)

    const linksConfig = screen.getAllByRole('link').filter(link => link.getAttribute('href') === '/config')
    expect(linksConfig.length).toBeGreaterThan(0)
  })

  it('exibe cards e seção de registros recentes quando já existem registros', async () => {
    await criarRegistro({ metodo: 'vaporizado', intencao: 'foco', intensidade: 'media' })

    render(<PaginaPrincipal />, { wrapper: envolverProvider })

    await waitFor(() => {
      expect(screen.getByText('Último registro')).toBeDefined()
      expect(screen.getByText('Últimos 7 dias')).toBeDefined()
      expect(screen.getByText('Registros recentes')).toBeDefined()
    })
  })

  it('hero sem pausa ativa não exibe contagem de registros do dia', async () => {
    render(<PaginaPrincipal />, { wrapper: envolverProvider })

    await waitFor(() => {
      expect(screen.queryByText(/registro.*hoje/i)).toBeNull()
    })
  })

  it('hero sem pausa ativa não exibe linha de economia quando não configurada', async () => {
    render(<PaginaPrincipal />, { wrapper: envolverProvider })

    await waitFor(() => {
      expect(screen.queryByText(/já acumulados/i)).toBeNull()
    })
  })
})
