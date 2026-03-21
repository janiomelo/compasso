import Dexie, { Table } from 'dexie'
import type {
  BackupLocal,
  Configuracoes,
  Pausa,
  PersistenciaApp,
  Registro,
  RegistroConfiguracao,
} from '../../tipos'
import { NOME_BD, VERSAO_APP } from '../constantes'

class BancoCompasso extends Dexie {
  registros!: Table<Registro, string>
  pausas!: Table<Pausa, string>
  configuracoes!: Table<RegistroConfiguracao, 'principal'>
  backups!: Table<BackupLocal, number>

  constructor() {
    super(NOME_BD)

    this.version(1).stores({
      registros: 'id, timestamp, metodo, intencao',
      pausas: 'id, iniciadoEm, status',
      configuracoes: 'chave',
      backups: '++id, criadoEm',
    })
  }
}

export const bd = new BancoCompasso()

type PausaLegada = Omit<Pausa, 'duracaoPlanejada'> & {
  duracaoPlanejada?: number
  duracaoPlanjada?: number
}

const normalizarPausa = (pausa: PausaLegada): Pausa => {
  const { duracaoPlanjada, duracaoPlanejada, ...restante } = pausa

  return {
    ...restante,
    duracaoPlanejada: duracaoPlanejada ?? duracaoPlanjada ?? 0,
  }
}

export const consultasBD = {
  async obterRegistros() {
    return bd.registros.orderBy('timestamp').reverse().toArray()
  },

  async obterRegistrosRecentes(dias: number) {
    const desde = Date.now() - dias * 24 * 60 * 60 * 1000
    return bd.registros.where('timestamp').aboveOrEqual(desde).sortBy('timestamp')
  },

  async obterRegistrosPorPeriodo(dataInicial: number, dataFinal: number) {
    return bd.registros.where('timestamp').between(dataInicial, dataFinal, true, true).toArray()
  },

  async obterRegistroPorId(id: string) {
    return bd.registros.get(id)
  },

  async salvarRegistro(registro: Registro) {
    await bd.registros.put(registro)
    return registro
  },

  async deletarRegistro(id: string) {
    await bd.registros.delete(id)
  },

  async obterPausaAtiva() {
    return (await bd.pausas.where('status').equals('ativa').first()) ?? null
  },

  async obterHistoricoPausa(limite?: number) {
    const pausasPersistidas = await bd.pausas.orderBy('iniciadoEm').reverse().toArray() as PausaLegada[]
    const pausas = pausasPersistidas.map(normalizarPausa)
    return typeof limite === 'number' ? pausas.slice(0, limite) : pausas
  },

  async obterPausaPorId(id: string) {
    return bd.pausas.get(id)
  },

  async salvarPausa(pausa: Pausa) {
    await bd.pausas.put(pausa)
    return pausa
  },

  async salvarConfiguracoes(configuracoes: Configuracoes) {
    const registro: RegistroConfiguracao = { chave: 'principal', valor: configuracoes }
    await bd.configuracoes.put(registro)
    return registro
  },

  async obterConfiguracoes() {
    const registro = await bd.configuracoes.get('principal')
    return registro?.valor
  },

  async salvarBackup(dados: PersistenciaApp) {
    const backup: BackupLocal = {
      criadoEm: Date.now(),
      dados,
      versaoApp: VERSAO_APP,
    }

    const id = await bd.backups.add(backup)
    return { ...backup, id }
  },

  async obterBackupMaisRecente() {
    return bd.backups.orderBy('criadoEm').reverse().first()
  },

  async limparBackupsAntigos(maximo = 5) {
    const backups = await bd.backups.orderBy('criadoEm').reverse().toArray()
    const excedentes = backups.slice(maximo)

    await Promise.all(excedentes.map((backup) => backup.id ? bd.backups.delete(backup.id) : Promise.resolve()))

    return excedentes.length
  },

  async obterEstadoPersistido() {
    const [registros, pausas, configuracoes] = await Promise.all([
      consultasBD.obterRegistros(),
      consultasBD.obterHistoricoPausa(),
      consultasBD.obterConfiguracoes(),
    ])

    return {
      registros,
      pausas,
      configuracoes,
    }
  },

  async importarTudo(dados: PersistenciaApp) {
    return bd.transaction('rw', bd.registros, bd.pausas, bd.configuracoes, async () => {
      await bd.registros.clear()
      await bd.pausas.clear()
      await bd.configuracoes.clear()

      await bd.registros.bulkPut(dados.registros)
      await bd.pausas.bulkPut(dados.pausas.map((pausa) => normalizarPausa(pausa as PausaLegada)))
      await bd.configuracoes.put({ chave: 'principal', valor: dados.configuracoes })
    })
  },

  async limparTudo() {
    return bd.transaction('rw', bd.registros, bd.pausas, bd.configuracoes, bd.backups, async () => {
      await bd.registros.clear()
      await bd.pausas.clear()
      await bd.configuracoes.clear()
      await bd.backups.clear()
    })
  },
}