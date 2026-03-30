import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useProtecao } from '../../../src/ganchos/useProtecao'
import { useApp } from '../../../src/ganchos/useApp'
import * as kdf from '../../../src/utilitarios/seguranca/kdf'
import * as criptografia from '../../../src/utilitarios/seguranca/criptografia'
import { gerenciadorChaves } from '../../../src/utilitarios/seguranca/gerenciadorChaves'
import { consultasBD } from '../../../src/utilitarios/armazenamento/bd'

vi.mock('../../../src/ganchos/useApp')
vi.mock('../../../src/utilitarios/seguranca/kdf')
vi.mock('../../../src/utilitarios/seguranca/criptografia')
vi.mock('../../../src/utilitarios/seguranca/gerenciadorChaves')
vi.mock('../../../src/utilitarios/armazenamento/bd')

describe('useProtecao.tsx — Hook de proteção e segurança', () => {
  let despacho: ReturnType<typeof vi.fn>
  let estadoMock: any

  beforeEach(() => {
    vi.clearAllMocks()

    despacho = vi.fn()
    estadoMock = {
      registros: [],
      pausaAtiva: null,
      historicoPausa: [],
      configuracoes: {
        consumoRecorrente: 'cafe',
        moeda: 'BRL',
        valorMedio: 10,
        frequenciaMedia: 1,
        protecaoAtiva: false,
        timeoutBloqueio: 5 * 60 * 1000,
        manterDesbloqueadoNestaSessao: false,
        consentimentoTelemetria: false,
        valorEconomia: 0,
      },
      protecao: {
        ativado: false,
        desbloqueado: false,
        timeoutBloqueioMs: 5 * 60 * 1000,
        manterDesbloqueadoNestaSessao: false,
      },
    }

    vi.mocked(useApp).mockReturnValue({
      estado: estadoMock,
      despacho,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Método: bloquear', () => {
    it('limpa DEK e despacha BLOQUEAR_APP', () => {
      const { result } = renderHook(() => useProtecao())

      result.current.bloquear()

      expect(gerenciadorChaves.limparDEK).toHaveBeenCalled()
      expect(despacho).toHaveBeenCalledWith({ tipo: 'BLOQUEAR_APP' })
    })
  })

  describe('Método: ativarProtecao', () => {
    it('valida senha com menos de 8 caracteres', async () => {
      const { result } = renderHook(() => useProtecao())

      await expect(result.current.ativarProtecao('1234567')).rejects.toThrow(
        'Senha deve ter pelo menos 8 caracteres',
      )
    })

    it('rejeita senha vazia', async () => {
      const { result } = renderHook(() => useProtecao())

      await expect(result.current.ativarProtecao('')).rejects.toThrow(
        'Senha deve ter pelo menos 8 caracteres',
      )
    })

    it('ativa proteção com senha válida', async () => {
      const saltMock = new Uint8Array([1, 2, 3, 4])
      const dekMock = { type: 'secret' }
      const dekRawMock = new Uint8Array([5, 6, 7, 8])

      vi.mocked(kdf.derivarChavePBKDF2).mockResolvedValue({
        kek: { type: 'kek' },
        salt: saltMock,
        parametros: {
          algoritmo: 'PBKDF2',
          iteracoes: 600000,
        },
      } as any)

      vi.mocked(criptografia.gerarChaveDEK).mockResolvedValue(dekMock as any)
      vi.mocked(criptografia.exportarChave).mockResolvedValue(dekRawMock)
      vi.mocked(criptografia.cifrar).mockResolvedValue({
        ciphertext: new Uint8Array([9, 10, 11, 12]),
        iv: new Uint8Array([13, 14, 15, 16]),
        tag: new Uint8Array([17, 18, 19, 20]),
      } as any)

      vi.mocked(consultasBD.salvarMetadadosProtecao).mockResolvedValue(undefined)
      vi.mocked(consultasBD.migrarParaCifrado).mockResolvedValue(undefined)

      const { result } = renderHook(() => useProtecao())

      const senha = 'senhaSegura123'

      await result.current.ativarProtecao(senha)

      expect(kdf.derivarChavePBKDF2).toHaveBeenCalledWith(senha)
      expect(criptografia.gerarChaveDEK).toHaveBeenCalled()
      expect(consultasBD.salvarMetadadosProtecao).toHaveBeenCalled()
      expect(consultasBD.migrarParaCifrado).toHaveBeenCalled()
      expect(gerenciadorChaves.guardarDEK).toHaveBeenCalledWith(dekMock, 5 * 60 * 1000)
    })
  })

  describe('Método: desbloquear', () => {
    it('rejeita se proteção não configurada', async () => {
      vi.mocked(consultasBD.obterMetadadosProtecao).mockResolvedValue(null)

      const { result } = renderHook(() => useProtecao())

      await expect(result.current.desbloquear('senha123')).rejects.toThrow(
        'Proteção não configurada neste dispositivo',
      )
    })

    it('desbloqueia com senha correta', async () => {
      const metadadosMock = {
        salt: 'c3FWVGc=',
        paramsKdf: {
          algoritmo: 'PBKDF2' as const,
          iteracoes: 600000,
        },
        dekCriptografada: 'DGVsb3dvcmxk',
        ivDek: 'aW52ZWN0b3I=',
        tagDek: 'dGFn',
        criptografiaDados: true,
        ativoDesdeEm: Date.now(),
      }

      const dekMock = { type: 'dek' }
      const kekMock = { type: 'kek' }
      const dekRawMock = new Uint8Array([5, 6, 7, 8])

      vi.mocked(consultasBD.obterMetadadosProtecao).mockResolvedValue(metadadosMock as any)
      vi.mocked(kdf.redeserivarChave).mockResolvedValue(kekMock as any)
      vi.mocked(criptografia.descifia).mockResolvedValue(dekRawMock)
      vi.mocked(criptografia.importarChave).mockResolvedValue(dekMock as any)

      const { result } = renderHook(() => useProtecao())

      await result.current.desbloquear('senhaSegura123')

      expect(kdf.redeserivarChave).toHaveBeenCalledWith(
        'senhaSegura123',
        metadadosMock.salt,
        metadadosMock.paramsKdf,
      )

      expect(gerenciadorChaves.guardarDEK).toHaveBeenCalledWith(dekMock, 5 * 60 * 1000)
      expect(despacho).toHaveBeenCalledWith({ tipo: 'DESBLOQUEAR_APP' })
    })
  })

  describe('Método: desativarProtecao', () => {
    it('descriptografa dados, limpa proteção e desativa', async () => {
      const dekMock = { type: 'dek' }
      vi.mocked(gerenciadorChaves.obterDEK).mockReturnValue(dekMock as any)
      vi.mocked(consultasBD.migrarParaTextoPlano).mockResolvedValue(undefined)
      vi.mocked(consultasBD.limparMetadadosProtecao).mockResolvedValue(undefined)

      const { result } = renderHook(() => useProtecao())

      await result.current.desativarProtecao()

      expect(gerenciadorChaves.obterDEK).toHaveBeenCalled()
      expect(consultasBD.migrarParaTextoPlano).toHaveBeenCalledWith(dekMock)
      expect(gerenciadorChaves.limparDEK).toHaveBeenCalled()
      expect(consultasBD.limparMetadadosProtecao).toHaveBeenCalled()
      expect(despacho).toHaveBeenCalledWith({ tipo: 'DESATIVAR_PROTECAO' })
    })

    it('lança erro se usuário não estiver desbloqueado', async () => {
      vi.mocked(gerenciadorChaves.obterDEK).mockImplementation(() => {
        throw new Error('DEK não disponível — app bloqueado')
      })

      const { result } = renderHook(() => useProtecao())

      await expect(result.current.desativarProtecao()).rejects.toThrow('DEK não disponível')
      expect(consultasBD.migrarParaTextoPlano).not.toHaveBeenCalled()
    })
  })

  describe('Método: trocarSenha', () => {
    it('troca senha após desbloqueio bem-sucedido', async () => {
      const metadadosMock = {
        salt: 'c3FWVGc=',
        paramsKdf: { algoritmo: 'PBKDF2' as const, iteracoes: 600000 },
        dekCriptografada: 'DGVsb3dvcmxk',
        ivDek: 'aW52ZWN0b3I=',
        tagDek: 'dGFn',
        criptografiaDados: true,
        ativoDesdeEm: Date.now(),
      }

      const dekMock = { type: 'dek' }
      const kekMock = { type: 'kek' }
      const dekRawMock = new Uint8Array([5, 6, 7, 8])
      const novoKdfMock = {
        kek: { type: 'novoKek' },
        salt: new Uint8Array([1, 2, 3, 4]),
        parametros: { algoritmo: 'PBKDF2', iteracoes: 600000 },
      }

      vi.mocked(consultasBD.obterMetadadosProtecao).mockResolvedValueOnce(metadadosMock as any)
      vi.mocked(kdf.redeserivarChave).mockResolvedValue(kekMock as any)
      vi.mocked(criptografia.descifia).mockResolvedValue(dekRawMock)
      vi.mocked(criptografia.importarChave).mockResolvedValue(dekMock as any)
      vi.mocked(kdf.derivarChavePBKDF2).mockResolvedValue(novoKdfMock as any)
      vi.mocked(criptografia.exportarChave).mockResolvedValue(dekRawMock)
      vi.mocked(criptografia.cifrar).mockResolvedValue({
        ciphertext: new Uint8Array([9, 10]),
        iv: new Uint8Array([11, 12]),
        tag: new Uint8Array([13, 14]),
      } as any)
      vi.mocked(consultasBD.salvarMetadadosProtecao).mockResolvedValue(undefined)

      const { result } = renderHook(() => useProtecao())

      await result.current.trocarSenha('senhaAntiga123', 'senhaNova456')

      expect(kdf.derivarChavePBKDF2).toHaveBeenCalledWith('senhaNova456')
      expect(consultasBD.salvarMetadadosProtecao).toHaveBeenCalled()
    })
  })

  describe('Método: atualizarTimeoutSessao', () => {
    it('estende sessão quando desbloqueado', () => {
      const estadoDesbloqueado = {
        ...estadoMock,
        protecao: {
          ativado: true,
          desbloqueado: true,
          timeoutBloqueioMs: 5 * 60 * 1000,
          manterDesbloqueadoNestaSessao: false,
        },
      }

      vi.mocked(useApp).mockReturnValue({
        estado: estadoDesbloqueado,
        despacho,
      })

      const { result } = renderHook(() => useProtecao())

      const novoTimeout = 10 * 60 * 1000

      result.current.atualizarTimeoutSessao(novoTimeout)

      expect(gerenciadorChaves.estenderSessao).toHaveBeenCalledWith(novoTimeout)
      expect(despacho).toHaveBeenCalledWith({
        tipo: 'DEFINIR_CONFIGURACAO',
        payload: { timeoutBloqueio: novoTimeout },
      })
    })

    it('não estende sessão quando bloqueado', () => {
      const estadoBloqueado = {
        ...estadoMock,
        protecao: {
          ativado: true,
          desbloqueado: false,
          timeoutBloqueioMs: 5 * 60 * 1000,
          manterDesbloqueadoNestaSessao: false,
        },
      }

      vi.mocked(useApp).mockReturnValue({
        estado: estadoBloqueado,
        despacho,
      })

      const { result } = renderHook(() => useProtecao())

      const novoTimeout = 10 * 60 * 1000

      result.current.atualizarTimeoutSessao(novoTimeout)

      expect(gerenciadorChaves.estenderSessao).not.toHaveBeenCalled()
      expect(despacho).toHaveBeenCalledWith({
        tipo: 'DEFINIR_CONFIGURACAO',
        payload: { timeoutBloqueio: novoTimeout },
      })
    })
  })

  describe('Método: obterDEKSessao', () => {
    it('retorna DEK do gerenciador', () => {
      const dekMock = { type: 'dek' }
      vi.mocked(gerenciadorChaves.obterDEK).mockReturnValue(dekMock as any)

      const { result } = renderHook(() => useProtecao())

      const dek = result.current.obterDEKSessao()

      expect(dek).toBe(dekMock)
      expect(gerenciadorChaves.obterDEK).toHaveBeenCalled()
    })
  })

  describe('Propriedade: estadoProtecao', () => {
    it('expõe estado de proteção do contexto', () => {
      const { result } = renderHook(() => useProtecao())

      expect(result.current.estadoProtecao).toEqual(estadoMock.protecao)
    })

    it('informa quando protecao ativada', () => {
      const novoEstado = {
        ...estadoMock,
        protecao: {
          ativado: true,
          desbloqueado: true,
          timeoutBloqueioMs: 10 * 60 * 1000,
          manterDesbloqueadoNestaSessao: true,
        },
      }

      vi.mocked(useApp).mockReturnValue({
        estado: novoEstado,
        despacho,
      })

      const { result } = renderHook(() => useProtecao())

      expect(result.current.estadoProtecao.ativado).toBe(true)
      expect(result.current.estadoProtecao.desbloqueado).toBe(true)
    })
  })
})
