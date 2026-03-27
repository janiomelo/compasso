import { act, renderHook } from '@testing-library/react'
import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ProvedorApp } from '../../../src/loja/ContextoApp'
import { useArmazenamento } from '../../../src/ganchos/useArmazenamento'
import { criarRegistro } from '../../../src/servicos/servicoRegistro'
import { bd } from '../../../src/utilitarios/armazenamento/bd'
import type { Configuracoes } from '../../../src/tipos'

const envolverProvider = ({ children }: { children: React.ReactNode }) => (
  <ProvedorApp>{children}</ProvedorApp>
)

const configuracoesBase: Configuracoes = {
  valorEconomia: 110,
  moedaEconomia: 'BRL',
  tema: 'escuro',
  temaAuto: true,
  notificacoesAtivas: true,
  sonsAtivos: true,
  autoBackup14Dias: true,
  diasRetencaoDados: 365,
}

describe('fluxo de dados (backup, exportacao e importacao)', () => {
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

  it('gera backup manual e restaura estado após limpeza', async () => {
    const { result } = renderHook(() => useArmazenamento(), { wrapper: envolverProvider })

    await act(async () => {
      await result.current.salvarConfiguracoes(configuracoesBase)
    })

    await criarRegistro({ metodo: 'vaporizado', intencao: 'foco', intensidade: 'media' })

    await act(async () => {
      await result.current.fazerBackupLocal({ origem: 'manual' })
    })

    await bd.transaction('rw', bd.registros, bd.pausas, bd.configuracoes, async () => {
      await bd.registros.clear()
      await bd.pausas.clear()
      await bd.configuracoes.clear()
    })

    let estado = null as Awaited<ReturnType<typeof result.current.carregarEstadoInicial>> | null

    await act(async () => {
      estado = await result.current.carregarEstadoInicial()
    })

    expect(estado.registros).toHaveLength(0)

    await act(async () => {
      const restaurado = await result.current.restaurarBackupLocal({ origemPreferencial: 'manual' })
      expect(restaurado).toBe(true)
    })

    await act(async () => {
      estado = await result.current.carregarEstadoInicial()
    })

    expect(estado.registros).toHaveLength(1)
    expect(estado.configuracoes.valorEconomia).toBe(110)
  })

  it('exporta e importa backup preservando registros', async () => {
    const { result } = renderHook(() => useArmazenamento(), { wrapper: envolverProvider })

    await act(async () => {
      await result.current.salvarConfiguracoes(configuracoesBase)
    })

    await criarRegistro({ metodo: 'fumado', intencao: 'paz', intensidade: 'leve' })

    let exportacao: Awaited<ReturnType<typeof result.current.exportarDados>> | null = null

    await act(async () => {
      exportacao = await result.current.exportarDados()
      await result.current.limparDados()
    })

    let estadoVazio = null as Awaited<ReturnType<typeof result.current.carregarEstadoInicial>> | null
    await act(async () => {
      estadoVazio = await result.current.carregarEstadoInicial()
    })

    expect(estadoVazio.registros).toHaveLength(0)

    await act(async () => {
      const resultado = await result.current.importarDados(exportacao!.conteudo)
      expect(resultado.sucesso).toBe(true)
    })

    let estadoFinal = null as Awaited<ReturnType<typeof result.current.carregarEstadoInicial>> | null
    await act(async () => {
      estadoFinal = await result.current.carregarEstadoInicial()
    })

    expect(estadoFinal.registros).toHaveLength(1)
    expect(estadoFinal.registros[0].metodo).toBe('fumado')
  })
})
