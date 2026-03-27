import { renderHook, act, waitFor } from '@testing-library/react'
import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ProvedorApp } from '../../../src/loja/ContextoApp'
import { useRegistro } from '../../../src/ganchos/useRegistro'
import { bd } from '../../../src/utilitarios/armazenamento/bd'

const envolverProvider = ({ children }: { children: React.ReactNode }) => (
  <ProvedorApp>{children}</ProvedorApp>
)

describe('fluxo de registros', () => {
  let agoraMock = Date.now()

  beforeEach(async () => {
    vi.restoreAllMocks()
    vi.spyOn(Date, 'now').mockImplementation(() => agoraMock)
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

  it('cria registro e reflete imediatamente no estado do contexto', async () => {
    const { result } = renderHook(() => useRegistro(), { wrapper: envolverProvider })

    // aguardar hidratação bootstrap
    await waitFor(() => expect(result.current.registros).toBeDefined())

    expect(result.current.registros).toHaveLength(0)

    await act(async () => {
      await result.current.criar({
        metodo: 'vaporizado',
        intencao: 'foco',
        intensidade: 'media',
      })
    })

    expect(result.current.registros).toHaveLength(1)
    expect(result.current.registros[0].metodo).toBe('vaporizado')
  })

  it('registrosHoje filtra apenas registros do dia corrente', async () => {
    const agoraReal = Date.now()
    const ontem = agoraReal - 24 * 60 * 60 * 1000

    // registro de ontem
    agoraMock = ontem
    const { result } = renderHook(() => useRegistro(), { wrapper: envolverProvider })
    await waitFor(() => expect(result.current.registros).toBeDefined())

    await act(async () => {
      await result.current.criar({ metodo: 'fumado', intencao: 'paz', intensidade: 'leve' })
    })

    // registro de hoje
    agoraMock = agoraReal
    await act(async () => {
      await result.current.criar({ metodo: 'vaporizado', intencao: 'foco', intensidade: 'media' })
    })

    // hoje: deve ter apenas 1
    await waitFor(() => {
      expect(result.current.registrosHoje).toHaveLength(1)
      expect(result.current.registrosHoje[0].metodo).toBe('vaporizado')
    })
  })

  it('deleta registro e remove do estado', async () => {
    const { result } = renderHook(() => useRegistro(), { wrapper: envolverProvider })
    await waitFor(() => expect(result.current.registros).toBeDefined())

    let idCriado = ''
    await act(async () => {
      const registro = await result.current.criar({ metodo: 'outro', intencao: 'outro', intensidade: 'alta' })
      idCriado = registro.id
    })

    expect(result.current.registros).toHaveLength(1)

    await act(async () => {
      await result.current.deletar(idCriado)
    })

    expect(result.current.registros).toHaveLength(0)
  })
})
