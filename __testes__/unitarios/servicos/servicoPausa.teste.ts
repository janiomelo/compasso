/**
 * Testes: Serviço de Pausa — Compasso
 *
 * Cobre:
 * - Iniciar pausa
 * - Encerrar pausa com e sem motivo
 * - Interromper pausa
 * - Cancelar pausa
 * - Obter pausa ativa
 * - Tratamento de erros
 */

import { describe, expect, it, beforeEach, afterEach, afterAll, vi } from 'vitest'
import {
  iniciarPausa,
  encerrarPausa,
  interromperPausa,
  cancelarPausa,
  obterPausaAtiva,
} from '../../../src/servicos/servicoPausa'
import { bd, consultasBD } from '../../../src/utilitarios/armazenamento/bd'

describe('servicoPausa.ts — Operações de Pausa', () => {
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

  describe('iniciarPausa', () => {
    it('cria pausa com sucesso', async () => {
      const entrada = {
        duracaoPlanejada: 24 * 60 * 60 * 1000,
        valorEconomia: 50,
      }

      const pausa = await iniciarPausa(entrada)

      expect(pausa.id).toBeDefined()
      expect(pausa.status).toBe('ativa')
      expect(pausa.iniciadoEm).toBeGreaterThan(0)
      expect(pausa.duracaoPlanejada).toBe(entrada.duracaoPlanejada)
      expect(pausa.valorEconomia).toBe(entrada.valorEconomia)
    })

    it('cria pausa sem economia quando não informado', async () => {
      const entrada = {
        duracaoPlanejada: 24 * 60 * 60 * 1000,
      }

      const pausa = await iniciarPausa(entrada)

      expect(pausa.valorEconomia).toBe(0)
    })

    it('cria pausa com notas customizadas', async () => {
      const entrada = {
        duracaoPlanejada: 48 * 60 * 60 * 1000,
        valorEconomia: 100,
        notas: 'Descanso recomendado',
      }

      const pausa = await iniciarPausa(entrada)

      expect(pausa.notas).toBe('Descanso recomendado')
    })

    it('rejeita nova pausa se já existe uma ativa', async () => {
      const entrada1 = {
        duracaoPlanejada: 24 * 60 * 60 * 1000,
      }

      const entrada2 = {
        duracaoPlanejada: 12 * 60 * 60 * 1000,
      }

      await iniciarPausa(entrada1)

      await expect(iniciarPausa(entrada2)).rejects.toThrow('Já existe uma pausa ativa')
    })

    it('gera ID único para cada pausa', async () => {
      const entrada = {
        duracaoPlanejada: 24 * 60 * 60 * 1000,
      }

      // Cancela primeira pausa para permitir segunda
      const pausa1 = await iniciarPausa(entrada)
      await cancelarPausa(pausa1.id)

      const pausa2 = await iniciarPausa(entrada)

      expect(pausa1.id).not.toBe(pausa2.id)
    })

    it('registra timestamp de início correto', async () => {
      const antes = Date.now()

      await iniciarPausa({
        duracaoPlanejada: 24 * 60 * 60 * 1000,
      })

      const depois = Date.now()

      const pausa = await obterPausaAtiva()
      expect(pausa?.iniciadoEm).toBeGreaterThanOrEqual(antes)
      expect(pausa?.iniciadoEm).toBeLessThanOrEqual(depois)
    })
  })

  describe('encerrarPausa', () => {
    it('encerra pausa ativa', async () => {
      const pausa = await iniciarPausa({
        duracaoPlanejada: 24 * 60 * 60 * 1000,
        valorEconomia: 50,
      })

      const pausaEncerrada = await encerrarPausa(pausa.id)

      expect(pausaEncerrada.status).toBe('concluida')
      expect(pausaEncerrada.duracaoReal).toBeGreaterThan(0)
    })

    it('registra motivo de encerramento', async () => {
      const pausa = await iniciarPausa({
        duracaoPlanejada: 24 * 60 * 60 * 1000,
      })

      const motivo = 'Meta alcançada'
      const pausaEncerrada = await encerrarPausa(pausa.id, motivo)

      expect(pausaEncerrada.motivoEncerramento).toBe(motivo)
    })

    it('calcula duração real corretamente', async () => {
      const pausa = await iniciarPausa({
        duracaoPlanejada: 24 * 60 * 60 * 1000,
      })

      const tempoDecorrido = 5 * 60 * 1000 // 5 minutos

      // Aguarda 5ms para garantir diferença de tempo
      await new Promise((resolve) => setTimeout(resolve, 5))

      const pausaEncerrada = await encerrarPausa(pausa.id)

      expect(pausaEncerrada.duracaoReal).toBeGreaterThanOrEqual(5)
    })

    it('rejeita encerramento de pausa inexistente', async () => {
      await expect(encerrarPausa('id-inexistente')).rejects.toThrow('Pausa não encontrada')
    })

    it('move pausa de ativa para histórico', async () => {
      const pausa = await iniciarPausa({
        duracaoPlanejada: 24 * 60 * 60 * 1000,
      })

      expect(await obterPausaAtiva()).not.toBeNull()

      await encerrarPausa(pausa.id)

      expect(await obterPausaAtiva()).toBeNull()
    })

    it('encerra sem motivo quando não informado', async () => {
      const pausa = await iniciarPausa({
        duracaoPlanejada: 24 * 60 * 60 * 1000,
      })

      const pausaEncerrada = await encerrarPausa(pausa.id)

      expect(pausaEncerrada.motivoEncerramento).toBeUndefined()
    })
  })

  describe('interromperPausa', () => {
    it('interrompe pausa e marca status', async () => {
      const pausa = await iniciarPausa({
        duracaoPlanejada: 24 * 60 * 60 * 1000,
      })

      const pausaInterrompida = await interromperPausa(pausa.id)

      expect(pausaInterrompida.status).toBe('interrompida')
      expect(pausaInterrompida.duracaoReal).toBeGreaterThan(0)
    })

    it('registra motivo de interrupção', async () => {
      const pausa = await iniciarPausa({
        duracaoPlanejada: 24 * 60 * 60 * 1000,
      })

      const motivo = 'Situação imprevista'
      const pausaInterrompida = await interromperPausa(pausa.id, motivo)

      expect(pausaInterrompida.motivoEncerramento).toBe(motivo)
    })

    it('diferencia entre encerramento e interrupção', async () => {
      const entrada = {
        duracaoPlanejada: 24 * 60 * 60 * 1000,
      }

      // Pausa 1 — encerrada normalmente
      const pausa1 = await iniciarPausa(entrada)
      const p1Encerrada = await encerrarPausa(pausa1.id, 'Concluída')
      await cancelarPausa(pausa1.id)

      // Pausa 2 — interrompida
      const pausa2 = await iniciarPausa(entrada)
      const p2Interrompida = await interromperPausa(pausa2.id, 'Imprevisto')

      expect(p1Encerrada.status).toBe('concluida')
      expect(p2Interrompida.status).toBe('interrompida')
    })

    it('rejeita interrupção de pausa inexistente', async () => {
      await expect(interromperPausa('id-inexistente')).rejects.toThrow('Pausa não encontrada')
    })

    it('move pausa de ativa para histórico após interrupção', async () => {
      const pausa = await iniciarPausa({
        duracaoPlanejada: 24 * 60 * 60 * 1000,
      })

      expect(await obterPausaAtiva()).not.toBeNull()

      await interromperPausa(pausa.id)

      expect(await obterPausaAtiva()).toBeNull()
    })
  })

  describe('cancelarPausa', () => {
    it('deleta pausa do armazenamento', async () => {
      const pausa = await iniciarPausa({
        duracaoPlanejada: 24 * 60 * 60 * 1000,
      })

      expect(await obterPausaAtiva()).not.toBeNull()

      await cancelarPausa(pausa.id)

      expect(await obterPausaAtiva()).toBeNull()
    })

    it('rejeita cancelamento de pausa inexistente', async () => {
      await expect(cancelarPausa('id-inexistente')).rejects.toThrow('Pausa não encontrada')
    })

    it('permite iniciar nova pausa após cancelamento', async () => {
      const pausa = await iniciarPausa({
        duracaoPlanejada: 24 * 60 * 60 * 1000,
      })

      await cancelarPausa(pausa.id)

      // Deve permitir iniciar nova pausa
      const novaPausa = await iniciarPausa({
        duracaoPlanejada: 12 * 60 * 60 * 1000,
      })

      expect(novaPausa.id).toBeDefined()
      expect(novaPausa.status).toBe('ativa')
    })
  })

  describe('obterPausaAtiva', () => {
    it('retorna nula quando não há pausa ativa', async () => {
      const pausa = await obterPausaAtiva()
      expect(pausa).toBeNull()
    })

    it('retorna pausa ativa quando existe', async () => {
      const pausaCriada = await iniciarPausa({
        duracaoPlanejada: 24 * 60 * 60 * 1000,
        valorEconomia: 75,
      })

      const pausaAtiva = await obterPausaAtiva()

      expect(pausaAtiva).not.toBeNull()
      expect(pausaAtiva?.id).toBe(pausaCriada.id)
      expect(pausaAtiva?.status).toBe('ativa')
      expect(pausaAtiva?.valorEconomia).toBe(75)
    })

    it('não retorna pausas encerradas', async () => {
      const pausa = await iniciarPausa({
        duracaoPlanejada: 24 * 60 * 60 * 1000,
      })

      await encerrarPausa(pausa.id)

      const pausaAtiva = await obterPausaAtiva()
      expect(pausaAtiva).toBeNull()
    })

    it('não retorna pausas interrompidas', async () => {
      const pausa = await iniciarPausa({
        duracaoPlanejada: 24 * 60 * 60 * 1000,
      })

      await interromperPausa(pausa.id)

      const pausaAtiva = await obterPausaAtiva()
      expect(pausaAtiva).toBeNull()
    })
  })

  describe('composição de operações', () => {
    it('fluxo completo: iniciar → encerrar', async () => {
      const pausa = await iniciarPausa({
        duracaoPlanejada: 24 * 60 * 60 * 1000,
        valorEconomia: 100,
      })

      expect(await obterPausaAtiva()).not.toBeNull()

      const pausaEncerrada = await encerrarPausa(pausa.id, 'Concluída com êxito')

      expect(pausaEncerrada.status).toBe('concluida')
      expect(pausaEncerrada.motivoEncerramento).toBe('Concluída com êxito')
      expect(await obterPausaAtiva()).toBeNull()
    })

    it('fluxo completo: iniciar → interromper', async () => {
      const pausa = await iniciarPausa({
        duracaoPlanejada: 24 * 60 * 60 * 1000,
      })

      expect(await obterPausaAtiva()).not.toBeNull()

      const pausaInterrompida = await interromperPausa(pausa.id, 'Imprevisto')

      expect(pausaInterrompida.status).toBe('interrompida')
      expect(pausaInterrompida.motivoEncerramento).toBe('Imprevisto')
      expect(await obterPausaAtiva()).toBeNull()
    })

    it('fluxo completo: iniciar → cancelar', async () => {
      const pausa = await iniciarPausa({
        duracaoPlanejada: 24 * 60 * 60 * 1000,
      })

      expect(await obterPausaAtiva()).not.toBeNull()

      await cancelarPausa(pausa.id)

      expect(await obterPausaAtiva()).toBeNull()
    })
  })
})
