import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { bd } from '../../../src/utilitarios/armazenamento/bd'
import {
  criarRegistro,
  deletarRegistro,
  obterRegistroPorId,
  obterRegistros,
  obterRegistrosRecentes,
} from '../../../src/servicos/servicoRegistro'

describe('servicoRegistro', () => {
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

  it('cria e recupera registros em ordem decrescente', async () => {
    agoraMock = new Date('2024-01-10T10:00:00.000Z').getTime()
    const primeiro = await criarRegistro({
      metodo: 'vapor',
      intencao: 'foco',
      intensidade: 'leve',
    })

    agoraMock = new Date('2024-01-11T10:00:00.000Z').getTime()
    const segundo = await criarRegistro({
      metodo: 'flor',
      intencao: 'descanso',
      intensidade: 'media',
    })

    const registros = await obterRegistros()

    expect(registros).toHaveLength(2)
    expect(registros[0].id).toBe(segundo.id)
    expect(registros[1].id).toBe(primeiro.id)
  })

  it('filtra registros por periodo e lista recentes', async () => {
    agoraMock = new Date('2024-01-01T12:00:00.000Z').getTime()
    await criarRegistro({
      metodo: 'vapor',
      intencao: 'social',
      intensidade: 'leve',
    })

    agoraMock = new Date('2024-01-05T12:00:00.000Z').getTime()
    const alvo = await criarRegistro({
      metodo: 'extracao',
      intencao: 'criatividade',
      intensidade: 'alta',
    })

    agoraMock = new Date('2024-01-09T12:00:00.000Z').getTime()
    await criarRegistro({
      metodo: 'outro',
      intencao: 'outro',
      intensidade: 'media',
    })

    const porPeriodo = await obterRegistros({
      dataInicial: new Date('2024-01-03T00:00:00.000Z').getTime(),
      dataFinal: new Date('2024-01-06T23:59:59.999Z').getTime(),
    })

    const recentes = await obterRegistrosRecentes(3)

    expect(porPeriodo).toHaveLength(1)
    expect(porPeriodo[0].id).toBe(alvo.id)
    expect(recentes).toHaveLength(1)
  })

  it('remove um registro persistido', async () => {
    agoraMock = new Date('2024-02-10T10:00:00.000Z').getTime()
    const registro = await criarRegistro({
      metodo: 'flor',
      intencao: 'paz',
      intensidade: 'leve',
    })

    await deletarRegistro(registro.id)

    await expect(obterRegistroPorId(registro.id)).rejects.toThrow('Registro não encontrado')
  })
})