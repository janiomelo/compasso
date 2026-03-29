/**
 * Testes: Hook useApp — Compasso
 *
 * Cobre:
 * - Retorno de contexto válido dentro de ProvedorApp
 * - Erro fora de ProvedorApp
 * - Acesso a estado e dispatch
 */

import { renderHook, act } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach, afterEach, afterAll } from 'vitest'
import { ProvedorApp } from '../../../src/loja/ContextoApp'
import { useApp } from '../../../src/ganchos/useApp'
import { bd } from '../../../src/utilitarios/armazenamento/bd'

const envolverProvider = ({ children }: { children: React.ReactNode }) => (
  <ProvedorApp>{children}</ProvedorApp>
)

describe('useApp — Hook de Contexto Central', () => {
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

  it('retorna contexto válido quando dentro de ProvedorApp', () => {
    const { result } = renderHook(() => useApp(), { wrapper: envolverProvider })

    expect(result.current).toBeDefined()
    expect(result.current.estado).toBeDefined()
    expect(result.current.despacho).toBeDefined()
  })

  it('lança erro quando usado fora de ProvedorApp', () => {
    // Nota: renderHook sem wrapper vai renderizar o componente sem um provider,
    // gerando erro esperado
    expect(() => {
      renderHook(() => useApp())
    }).toThrow('useApp deve ser usado dentro de um ProvedorApp')
  })

  it('fornece acesso ao estado da aplicação', () => {
    const { result } = renderHook(() => useApp(), { wrapper: envolverProvider })

    const { estado } = result.current

    expect(estado.registros).toBeDefined()
    expect(estado.pausaAtiva).toBe(null)
    expect(estado.historicoPausa).toBeDefined()
    expect(estado.configuracoes).toBeDefined()
    expect(estado.protecao).toBeDefined()
    expect(estado.ui).toBeDefined()
    expect(estado.metadados).toBeDefined()
  })

  it('fornece acesso ao estado de registros', () => {
    const { result } = renderHook(() => useApp(), { wrapper: envolverProvider })

    const { estado } = result.current

    expect(Array.isArray(estado.registros)).toBe(true)
    expect(estado.registros).toHaveLength(0)
  })

  it('fornece acesso ao estado de configurações', () => {
    const { result } = renderHook(() => useApp(), { wrapper: envolverProvider })

    const { estado } = result.current

    expect(estado.configuracoes.valorEconomia).toBe(0)
    expect(estado.configuracoes.moedaEconomia).toBe('BRL')
    expect(estado.configuracoes.tema).toBe('escuro')
    expect(estado.configuracoes.protecaoAtiva).toBe(false)
    expect(estado.configuracoes.telemetria).toBeDefined()
  })

  it('fornece acesso ao estado de proteção', () => {
    const { result } = renderHook(() => useApp(), { wrapper: envolverProvider })

    const { estado } = result.current

    expect(estado.protecao.ativado).toBe(false)
    expect(estado.protecao.desbloqueado).toBe(false)
    expect(estado.protecao.timeoutBloqueioMs).toBe(15 * 60 * 1000)
  })

  it('fornece função despacho para disparar ações', () => {
    const { result } = renderHook(() => useApp(), { wrapper: envolverProvider })

    const { despacho } = result.current

    expect(typeof despacho).toBe('function')
  })

  it('pode disparar ação para adicionar registro', () => {
    const { result } = renderHook(() => useApp(), { wrapper: envolverProvider })

    const novoRegistro = {
      id: 'test-1',
      criadoEm: Date.now(),
      consumo: 'Cerveja',
      intensidade: 'leve' as const,
    }

    act(() => {
      result.current.despacho({
        tipo: 'ADICIONAR_REGISTRO',
        payload: novoRegistro,
      })
    })

    expect(result.current.estado.registros).toHaveLength(1)
    expect(result.current.estado.registros[0].id).toBe('test-1')
  })

  it('pode disparar ação para atualizar configuração', () => {
    const { result } = renderHook(() => useApp(), { wrapper: envolverProvider })

    act(() => {
      result.current.despacho({
        tipo: 'DEFINIR_CONFIGURACAO',
        payload: {
          valorEconomia: 123,
        },
      })
    })

    expect(result.current.estado.configuracoes.valorEconomia).toBe(123)
  })

  it('pode disparar ação para ativar carregamento', () => {
    const { result } = renderHook(() => useApp(), { wrapper: envolverProvider })

    // Estado inicial de carregamento pode variar
    const carregandoAntes = result.current.estado.ui.carregando

    act(() => {
      result.current.despacho({
        tipo: 'DEFINIR_CARREGANDO',
        payload: !carregandoAntes,
      })
    })

    expect(result.current.estado.ui.carregando).toBe(!carregandoAntes)
  })

  it('retorna contexto atualizado em múltiplos renders', () => {
    const { result, rerender } = renderHook(() => useApp(), { wrapper: envolverProvider })

    const estado1 = result.current.estado.registros.length

    act(() => {
      result.current.despacho({
        tipo: 'ADICIONAR_REGISTRO',
        payload: {
          id: 'test-registro',
          criadoEm: Date.now(),
          consumo: 'Teste',
          intensidade: 'leve' as const,
        },
      })
    })

    rerender()

    const estado2 = result.current.estado.registros.length

    expect(estado2).toBe(estado1 + 1)
  })

  it('atualiza estado após dispatch de ação', () => {
    const { result } = renderHook(() => useApp(), { wrapper: envolverProvider })

    expect(result.current.estado.registros).toHaveLength(0)

    const novo = {
      id: 'novo-1',
      criadoEm: Date.now(),
      consumo: 'Café',
      intensidade: 'leve' as const,
    }

    act(() => {
      result.current.despacho({
        tipo: 'ADICIONAR_REGISTRO',
        payload: novo,
      })
    })

    expect(result.current.estado.registros).toHaveLength(1)
    expect(result.current.estado.registros[0].consumo).toBe('Café')
  })

  it('fornece acesso a metadados', () => {
    const { result } = renderHook(() => useApp(), { wrapper: envolverProvider })

    const { estado } = result.current

    expect(estado.metadados).toBeDefined()
    expect(estado.metadados.versaoApp).toBe('0.1.0')
    expect(estado.metadados.criadoEm).toBeGreaterThan(0)
  })

  it('fornece acesso a histórico de pausas', () => {
    const { result } = renderHook(() => useApp(), { wrapper: envolverProvider })

    const { estado } = result.current

    expect(Array.isArray(estado.historicoPausa)).toBe(true)
    expect(estado.historicoPausa).toHaveLength(0)
  })

  it('fornece acesso a pausa ativa (nula inicialmente)', () => {
    const { result } = renderHook(() => useApp(), { wrapper: envolverProvider })

    const { estado } = result.current

    expect(estado.pausaAtiva).toBeNull()
  })
})
