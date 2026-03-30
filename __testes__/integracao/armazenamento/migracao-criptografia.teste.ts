import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { bd } from '../../../src/utilitarios/armazenamento/bd'
import { consultasBD } from '../../../src/utilitarios/armazenamento/bd'
import { gerarChaveDEK } from '../../../src/utilitarios/seguranca/criptografia'
import { gerenciadorChaves } from '../../../src/utilitarios/seguranca/gerenciadorChaves'
import type { Registro, Pausa } from '../../../src/tipos'

describe('migração de criptografia — bd.ts', () => {
  let agoraMock = 0

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

  describe('migrarParaCifrado', () => {
    it('cifra registros e pausas em texto plano', async () => {
      // Setup: criar registros em texto plano
      agoraMock = new Date('2026-03-20T10:00:00.000Z').getTime()
      const registro1: Registro = {
        id: 'reg-1',
        timestamp: agoraMock,
        metodo: 'fumado',
        intencao: 'social',
        intensidade: 'leve',
        descricao: 'tarde descansando',
        data: new Date(agoraMock),
      }

      agoraMock = new Date('2026-03-21T10:00:00.000Z').getTime()
      const registro2: Registro = {
        id: 'reg-2',
        timestamp: agoraMock,
        metodo: 'vaporizado',
        intencao: 'foco',
        intensidade: 'media',
        descricao: 'durante trabalho',
        data: new Date(agoraMock),
      }

      const pausa1: Pausa = {
        id: 'pausa-1',
        iniciadoEm: new Date('2026-03-20T14:00:00.000Z').getTime(),
        status: 'concluida',
        duracaoPlanejada: 3600000,
        duracaoReal: 2700000,
        valorEconomia: 15.5,
      }

      const pausa2: Pausa = {
        id: 'pausa-2',
        iniciadoEm: new Date('2026-03-21T09:00:00.000Z').getTime(),
        status: 'concluida',
        duracaoPlanejada: 1800000,
        duracaoReal: 1800000,
        valorEconomia: 8.25,
      }

      // Salvar em texto plano
      await consultasBD.salvarRegistro(registro1)
      await consultasBD.salvarRegistro(registro2)
      await consultasBD.salvarPausa(pausa1)
      await consultasBD.salvarPausa(pausa2)

      // Gerar DEK
      const dek = await gerarChaveDEK()

      // Executar migração
      await consultasBD.migrarParaCifrado(dek)

      // Verificar que ficaram cifrados (têm _payload)
      const todosRegistros = await bd.registros.toArray()
      const todasPausas = await bd.pausas.toArray()

      expect(todosRegistros).toHaveLength(2)
      expect(todasPausas).toHaveLength(2)

      todosRegistros.forEach((reg) => {
        expect(reg).toHaveProperty('_payload')
        expect((reg as any)._payload).toHaveProperty('_criptografado', true)
        expect((reg as any)._payload).toHaveProperty('c')
        expect((reg as any)._payload).toHaveProperty('iv')
        expect((reg as any)._payload).toHaveProperty('t')
      })

      todasPausas.forEach((pausa) => {
        expect(pausa).toHaveProperty('_payload')
        expect((pausa as any)._payload).toHaveProperty('_criptografado', true)
      })
    })

    it('não cifra dados já cifrados', async () => {
      // Setup: registros já cifrados
      const dek = await gerarChaveDEK()

      agoraMock = new Date('2026-03-20T10:00:00.000Z').getTime()
      const registro: Registro = {
        id: 'reg-1',
        timestamp: agoraMock,
        metodo: 'fumado',
        intencao: 'social',
        intensidade: 'leve',
        descricao: 'tarde descansando',
        data: new Date(agoraMock),
      }

      // Salvar já cifrado
      await consultasBD.salvarRegistro(registro)

      // Aplicar migração uma vez
      await consultasBD.migrarParaCifrado(dek)

      const apoCifragem1 = await bd.registros.get('reg-1')
      expect(apoCifragem1).toHaveProperty('_payload')
      const ciphertextAntes = (apoCifragem1 as any)._payload.c

      // Aplicar migração novamente — não deve re-cifrar
      await consultasBD.migrarParaCifrado(dek)

      const apoCifragem2 = await bd.registros.get('reg-1')
      const ciphertextDepois = (apoCifragem2 as any)._payload.c

      // Ciphertext deve ser igual (idempotência)
      expect(ciphertextDepois).toBe(ciphertextAntes)
    })
  })

  describe('migrarParaTextoPlano', () => {
    it('descriptografa registros e pausas cifrados', async () => {
      // Setup: criar dados cifrados
      const dek = await gerarChaveDEK()

      agoraMock = new Date('2026-03-20T10:00:00.000Z').getTime()
      const registroOriginal: Registro = {
        id: 'reg-1',
        timestamp: agoraMock,
        metodo: 'fumado',
        intencao: 'social',
        intensidade: 'leve',
        descricao: 'tarde descansando',
        data: new Date(agoraMock),
      }

      const pausaOriginal: Pausa = {
        id: 'pausa-1',
        iniciadoEm: new Date('2026-03-20T14:00:00.000Z').getTime(),
        status: 'concluida',
        duracaoPlanejada: 3600000,
        duracaoReal: 2700000,
        valorEconomia: 15.5,
      }

      // Salvar (será em texto plano por enquanto)
      await consultasBD.salvarRegistro(registroOriginal)
      await consultasBD.salvarPausa(pausaOriginal)

      // Cifrar
      await consultasBD.migrarParaCifrado(dek)

      // Verificar que estão cifrados
      const registroCifrado = await bd.registros.get('reg-1')
      expect(registroCifrado).toHaveProperty('_payload')

      // Executar migração inversa
      await consultasBD.migrarParaTextoPlano(dek)

      // Verificar que ficaram decifrados
      const registroDecifrado = await bd.registros.get('reg-1')
      const pausaDecifrada = await bd.pausas.get('pausa-1')

      // Não devem ter _payload
      expect(registroDecifrado).not.toHaveProperty('_payload')
      expect(pausaDecifrada).not.toHaveProperty('_payload')

      // Dados devem corresponder aos originais
      expect((registroDecifrado as any).id).toBe(registroOriginal.id)
      expect((registroDecifrado as any).metodo).toBe(registroOriginal.metodo)
      expect((registroDecifrado as any).intencao).toBe(registroOriginal.intencao)
      expect((pausaDecifrada as any).id).toBe(pausaOriginal.id)
      expect((pausaDecifrada as any).duracaoPlanejada).toBe(pausaOriginal.duracaoPlanejada)
    })

    it('não descriptografa dados já em texto plano', async () => {
      // Setup: registros em texto plano
      const dek = await gerarChaveDEK()

      agoraMock = new Date('2026-03-20T10:00:00.000Z').getTime()
      const registro: Registro = {
        id: 'reg-1',
        timestamp: agoraMock,
        metodo: 'fumado',
        intencao: 'social',
        intensidade: 'leve',
        descricao: 'tarde descansando',
        data: new Date(agoraMock),
      }

      await consultasBD.salvarRegistro(registro)

      const metodoAntes = (await bd.registros.get('reg-1')).metodo

      // Tentar migrar para texto plano (não fará nada)
      await consultasBD.migrarParaTextoPlano(dek)

      const metodoDepois = (await bd.registros.get('reg-1')).metodo

      // Deve permanecer igual
      expect(metodoDepois).toBe(metodoAntes)
    })

    it('verifica corruptela lança erro se DEK for inválida', async () => {
      // Setup: cifrar com uma DEK
      const dekCorreta = await gerarChaveDEK()
      const dekErrada = await gerarChaveDEK()

      agoraMock = new Date('2026-03-20T10:00:00.000Z').getTime()
      const registro: Registro = {
        id: 'reg-1',
        timestamp: agoraMock,
        metodo: 'fumado',
        intencao: 'social',
        intensidade: 'leve',
        descricao: 'tarde descansando',
        data: new Date(agoraMock),
      }

      await consultasBD.salvarRegistro(registro)
      await consultasBD.migrarParaCifrado(dekCorreta)

      // Tentar descriptografar com chave errada
      const promise = consultasBD.migrarParaTextoPlano(dekErrada)

      // Deve lançar erro (autenticação falhou ou decrypt falhou)
      await expect(promise).rejects.toThrow()
    })
  })

  describe('fluxo completo: ativar → mudar → desativar', () => {
    it('mantém dados intactos em ciclo completo', async () => {
      // Criar registros em texto plano
      agoraMock = new Date('2026-03-20T10:00:00.000Z').getTime()
      const registroOriginal: Registro = {
        id: 'reg-1',
        timestamp: agoraMock,
        metodo: 'fumado',
        intencao: 'social',
        intensidade: 'leve',
        descricao: 'tarde descansando',
        data: new Date(agoraMock),
      }

      await consultasBD.salvarRegistro(registroOriginal)

      // 1. Ativar proteção (migra para cifrado)
      const dek1 = await gerarChaveDEK()
      await consultasBD.migrarParaCifrado(dek1)

      let registroCheck = await bd.registros.get('reg-1')
      expect(registroCheck).toHaveProperty('_payload')

      // 2. Trocar senha (DEK fica igual, só o envelope muda) — não precisa migrar
      // (na prática, o useProtecao faria isso, mas aqui é só sobre dados)

      // 3. Desativar proteção (migra para texto plano)
      await consultasBD.migrarParaTextoPlano(dek1)

      registroCheck = await bd.registros.get('reg-1')
      expect(registroCheck).not.toHaveProperty('_payload')
      expect((registroCheck as any).metodo).toBe(registroOriginal.metodo)
      expect((registroCheck as any).intencao).toBe(registroOriginal.intencao)
    })
  })
})
