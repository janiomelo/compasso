import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { criarRegistro } from '../../../src/servicos/servicoRegistro'
import {
  calcularProgressoPausa,
  encerrarPausa,
  iniciarPausa,
  obterPausaAtiva,
} from '../../../src/servicos/servicoPausa'
import {
  fazerBackupLocal,
  hidratarEstado,
  restaurarBackupLocal,
  salvarConfiguracoes,
  validarPersistencia,
} from '../../../src/servicos/servicoDados'
import { bd } from '../../../src/utilitarios/armazenamento/bd'
import type { Configuracoes } from '../../../src/tipos'

const configuracoesBase: Configuracoes = {
  valorEconomia: 120,
  moedaEconomia: 'BRL',
  tema: 'escuro',
  temaAuto: true,
  notificacoesAtivas: true,
  sonsAtivos: true,
  autoBackup14Dias: true,
  diasRetencaoDados: 365,
}

describe('persistencia com Dexie', () => {
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

  it('mantem somente uma pausa ativa e calcula progresso', async () => {
    agoraMock = new Date('2024-03-01T08:00:00.000Z').getTime()
    const pausa = await iniciarPausa({ duracaoPlanejada: 24 * 60 * 60 * 1000, valorEconomia: 45 })

    await expect(iniciarPausa({ duracaoPlanejada: 60 * 60 * 1000 })).rejects.toThrow('Já existe uma pausa ativa')

    agoraMock = new Date('2024-03-01T14:00:00.000Z').getTime()
    const progresso = await calcularProgressoPausa(pausa.id)

    expect(progresso.percentualConclusao).toBe(25)
    expect((await obterPausaAtiva())?.id).toBe(pausa.id)

    await encerrarPausa(pausa.id, 'Meta concluída')

    expect(await obterPausaAtiva()).toBeNull()
  })

  it('gera backup local, limita historico e restaura o estado', async () => {
    await salvarConfiguracoes(configuracoesBase)

    agoraMock = new Date('2024-04-01T09:00:00.000Z').getTime()
    await criarRegistro({
      metodo: 'vaporizado',
      intencao: 'foco',
      intensidade: 'media',
    })

    agoraMock = new Date('2024-04-01T10:00:00.000Z').getTime()
    const pausa = await iniciarPausa({ duracaoPlanejada: 2 * 60 * 60 * 1000, valorEconomia: 30 })
    await encerrarPausa(pausa.id, 'Encerrada para teste')

    for (let indice = 0; indice < 7; indice += 1) {
      agoraMock = new Date(`2024-04-0${indice + 2}T10:00:00.000Z`).getTime()
      await fazerBackupLocal()
    }

    expect(await bd.backups.count()).toBe(5)

    await bd.transaction('rw', bd.registros, bd.pausas, bd.configuracoes, async () => {
      await bd.registros.clear()
      await bd.pausas.clear()
      await bd.configuracoes.clear()
    })

    expect((await hidratarEstado()).registros).toHaveLength(0)

    const restaurado = await restaurarBackupLocal()
    const estado = await hidratarEstado()

    expect(restaurado).toBe(true)
    expect(estado.registros).toHaveLength(1)
    expect(estado.historicoPausa).toHaveLength(1)
    expect(estado.configuracoes.valorEconomia).toBe(120)
  })

  it('valida inconsistencias basicas da persistencia', async () => {
    let resultado = await validarPersistencia()
    expect(resultado.valido).toBe(false)
    expect(resultado.erros).toContain('Configurações não encontradas')

    await salvarConfiguracoes(configuracoesBase)
    await criarRegistro({
      metodo: 'fumado',
      intencao: 'descanso',
      intensidade: 'leve',
    })

    resultado = await validarPersistencia()
    expect(resultado.valido).toBe(true)
    expect(resultado.erros).toHaveLength(0)
  })

  it('aplica retencao por origem de backup e prioriza restauracao manual', async () => {
    await salvarConfiguracoes(configuracoesBase)

    agoraMock = new Date('2024-05-01T09:00:00.000Z').getTime()
    await criarRegistro({ metodo: 'vaporizado', intencao: 'foco', intensidade: 'media' })

    for (let indice = 0; indice < 6; indice += 1) {
      agoraMock = new Date(`2024-05-0${indice + 2}T10:00:00.000Z`).getTime()
      await fazerBackupLocal({ origem: 'automatico', limite: 3 })
    }

    for (let indice = 0; indice < 4; indice += 1) {
      agoraMock = new Date(`2024-05-${indice + 10}T11:00:00.000Z`).getTime()
      await fazerBackupLocal({ origem: 'manual', limite: 2 })
    }

    const backups = await bd.backups.orderBy('criadoEm').reverse().toArray()
    const automaticos = backups.filter((backup) => backup.origem === 'automatico')
    const manuais = backups.filter((backup) => backup.origem === 'manual')

    expect(automaticos).toHaveLength(3)
    expect(manuais).toHaveLength(2)

    await bd.transaction('rw', bd.registros, bd.pausas, bd.configuracoes, async () => {
      await bd.registros.clear()
      await bd.pausas.clear()
      await bd.configuracoes.clear()
    })

    const restaurado = await restaurarBackupLocal({ origemPreferencial: 'manual' })
    expect(restaurado).toBe(true)

    const estado = await hidratarEstado()
    expect(estado.registros).toHaveLength(1)
    expect(estado.configuracoes.valorEconomia).toBe(120)
  })
})