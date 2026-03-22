import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { bd } from '../../../src/utilitarios/armazenamento/bd'
import { salvarConfiguracoes } from '../../../src/servicos/servicoDados'
import { criarRegistro } from '../../../src/servicos/servicoRegistro'
import { encerrarPausa, iniciarPausa } from '../../../src/servicos/servicoPausa'
import {
  exportarDados,
  importarDados,
  hidratarEstado,
  validarDadosImport,
} from '../../../src/servicos/servicoDados'
import type { Configuracoes } from '../../../src/tipos'
import { VERSAO_APP } from '../../../src/utilitarios/constantes'

const configuracoesBase: Configuracoes = {
  valorEconomia: 90,
  moedaEconomia: 'BRL',
  tema: 'escuro',
  temaAuto: true,
  notificacoesAtivas: true,
  sonsAtivos: true,
  autoBackup14Dias: true,
  diasRetencaoDados: 180,
}

describe('servicoDados: importacao e exportacao', () => {
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

  it('exporta backup comprimido e importa preservando estado', async () => {
    await salvarConfiguracoes(configuracoesBase)

    agoraMock = new Date('2026-03-22T10:00:00.000Z').getTime()
    await criarRegistro({ metodo: 'vapor', intencao: 'foco', intensidade: 'media' })

    agoraMock = new Date('2026-03-22T11:00:00.000Z').getTime()
    const pausa = await iniciarPausa({ duracaoPlanejada: 60 * 60 * 1000, valorEconomia: 12 })
    await encerrarPausa(pausa.id, 'Teste de round-trip')

    const exportacao = await exportarDados()

    expect(exportacao.nomeArquivo.endsWith('.json.gz')).toBe(true)
    expect(exportacao.blob.size).toBeGreaterThan(0)

    await bd.transaction('rw', bd.registros, bd.pausas, bd.configuracoes, async () => {
      await bd.registros.clear()
      await bd.pausas.clear()
      await bd.configuracoes.clear()
    })

    const vazio = await hidratarEstado()
    expect(vazio.registros).toHaveLength(0)
    expect(vazio.historicoPausa).toHaveLength(0)

    const resultado = await importarDados(exportacao.conteudo)
    expect(resultado.sucesso).toBe(true)
    expect(resultado.erros).toHaveLength(0)

    const restaurado = await hidratarEstado()
    expect(restaurado.registros).toHaveLength(1)
    expect(restaurado.historicoPausa).toHaveLength(1)
    expect(restaurado.configuracoes.valorEconomia).toBe(90)
  })

  it('recusa importar pacote invalido', async () => {
    const pacoteInvalido = { foo: 'bar' }
    const validacao = await validarDadosImport(pacoteInvalido)

    expect(validacao.valido).toBe(false)
    expect(validacao.erros.length).toBeGreaterThan(0)

    const blobInvalido = new Blob([JSON.stringify(pacoteInvalido)], { type: 'application/json' })
    const resultado = await importarDados(blobInvalido)

    expect(resultado.sucesso).toBe(false)
    expect(resultado.erros.length).toBeGreaterThan(0)
  })

  it('recusa importar backup com major de versao diferente', async () => {
    const pacoteIncompativel = {
      versao: '9.0.0',
      exportadoEm: new Date().toISOString(),
      dados: {
        registros: [],
        pausas: [],
        configuracoes: configuracoesBase,
        metadados: {
          ultimaSincronizacao: Date.now(),
          versaoApp: VERSAO_APP,
          criadoEm: Date.now(),
        },
      },
    }

    const validacao = await validarDadosImport(pacoteIncompativel)
    expect(validacao.valido).toBe(false)
    expect(validacao.erros.some((erro) => erro.includes('Versão incompatível'))).toBe(true)
  })

  it('importa pausa legada com duracaoPlanjada convertendo para duracaoPlanejada', async () => {
    const pacoteLegado = {
      versao: VERSAO_APP,
      exportadoEm: new Date().toISOString(),
      dados: {
        registros: [],
        pausas: [
          {
            id: 'pausa-legada',
            iniciadoEm: Date.now(),
            duracaoPlanjada: 3600000,
            status: 'concluida',
            valorEconomia: 10,
            motivoEncerramento: 'import legado',
          },
        ],
        configuracoes: configuracoesBase,
        metadados: {
          ultimaSincronizacao: Date.now(),
          versaoApp: VERSAO_APP,
          criadoEm: Date.now(),
        },
      },
    }

    const bytes = new TextEncoder().encode(JSON.stringify(pacoteLegado))
    const resultado = await importarDados(bytes)

    expect(resultado.sucesso).toBe(true)

    const estado = await hidratarEstado()
    expect(estado.historicoPausa).toHaveLength(1)
    expect(estado.historicoPausa[0].duracaoPlanejada).toBe(3600000)
  })

  it('falha com arquivo corrompido sem alterar estado', async () => {
    await salvarConfiguracoes(configuracoesBase)
    await criarRegistro({ metodo: 'flor', intencao: 'paz', intensidade: 'leve' })

    const estadoAntes = await hidratarEstado()
    expect(estadoAntes.registros).toHaveLength(1)

    const bytesCorrompidos = new Uint8Array([1, 255, 0, 7, 42, 99, 12])
    const resultado = await importarDados(bytesCorrompidos)

    expect(resultado.sucesso).toBe(false)
    expect(resultado.erros.length).toBeGreaterThan(0)

    const estadoDepois = await hidratarEstado()
    expect(estadoDepois.registros).toHaveLength(1)
    expect(estadoDepois.registros[0].metodo).toBe('flor')
  })

  it('faz rollback transacional quando importacao falha durante escrita', async () => {
    await salvarConfiguracoes(configuracoesBase)
    await criarRegistro({ metodo: 'vapor', intencao: 'foco', intensidade: 'media' })

    const pacoteComFalhaDeEscrita = {
      versao: VERSAO_APP,
      exportadoEm: new Date().toISOString(),
      dados: {
        registros: [
          {
            id: 'registro-import-valido',
            timestamp: Date.now(),
            data: new Date(),
            metodo: 'outro',
            intencao: 'outro',
            intensidade: 'alta',
          },
        ],
        // Pausa sem id para induzir falha no bulkPut dentro da transacao.
        pausas: [
          {
            iniciadoEm: Date.now(),
            duracaoPlanejada: 3600000,
            status: 'concluida',
            valorEconomia: 15,
          },
        ],
        configuracoes: configuracoesBase,
        metadados: {
          ultimaSincronizacao: Date.now(),
          versaoApp: VERSAO_APP,
          criadoEm: Date.now(),
        },
      },
    }

    const bytes = new TextEncoder().encode(JSON.stringify(pacoteComFalhaDeEscrita))
    const resultado = await importarDados(bytes)

    expect(resultado.sucesso).toBe(false)

    const estadoAposFalha = await hidratarEstado()
    // Se houve rollback, estado anterior permanece intacto.
    expect(estadoAposFalha.registros).toHaveLength(1)
    expect(estadoAposFalha.registros[0].metodo).toBe('vapor')
  })
})
