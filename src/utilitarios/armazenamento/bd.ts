import Dexie, { Table } from 'dexie'
import type {
  BackupLocal,
  Configuracoes,
  MetadadosProteção,
  OrigemBackup,
  Pausa,
  PersistenciaApp,
  Registro,
  RegistroConfiguracao,
  RegistroProteção,
} from '../../tipos'
import { NOME_BD, VERSAO_APP } from '../constantes'
import {
  cifrarPausa,
  cifrarRegistro,
  descifrarPausa,
  descifrarRegistro,
  ehEnvelopeCifrado,
  type PausaCifrada,
  type RegistroCifrado,
} from './criptografiaDados'
import { gerenciadorChaves } from '../seguranca/gerenciadorChaves'

type RegistroPersistido = Registro | RegistroCifrado
type PausaPersistida = Pausa | PausaCifrada

class BancoCompasso extends Dexie {
  registros!: Table<RegistroPersistido, string>
  pausas!: Table<PausaPersistida, string>
  configuracoes!: Table<RegistroConfiguracao, 'principal'>
  protecao!: Table<RegistroProteção, 'principal'>
  backups!: Table<BackupLocal, number>

  constructor() {
    super(NOME_BD)

    this.version(1).stores({
      registros: 'id, timestamp, metodo, intencao',
      pausas: 'id, iniciadoEm, status',
      configuracoes: 'chave',
      backups: '++id, criadoEm',
    })

    this.version(2).stores({
      registros: 'id, timestamp, metodo, intencao',
      pausas: 'id, iniciadoEm, status',
      configuracoes: 'chave',
      backups: '++id, criadoEm, origem',
    })

    this.version(3).stores({
      registros: 'id, timestamp, metodo, intencao',
      pausas: 'id, iniciadoEm, status',
      configuracoes: 'chave',
      protecao: 'chave',
      backups: '++id, criadoEm, origem',
    })

    this.version(4)
      .stores({
        registros: 'id, timestamp, metodo, intencao',
        pausas: 'id, iniciadoEm, status',
        configuracoes: 'chave',
        protecao: 'chave',
        backups: '++id, criadoEm, origem',
      })
      .upgrade(async (tx) => {
        const MAPA_METODO_LEGADO: Record<string, string> = {
          vapor: 'vaporizado',
          flor: 'fumado',
          extracao: 'comestivel',
        }
        await tx
          .table('registros')
          .toCollection()
          .modify((registro: Record<string, unknown>) => {
            const metodo = registro['metodo'] as string
            if (metodo in MAPA_METODO_LEGADO) {
              registro['metodo'] = MAPA_METODO_LEGADO[metodo]
            }
          })
      })
  }
}

export const bd = new BancoCompasso()

type PausaLegada = Omit<Pausa, 'duracaoPlanejada'> & {
  duracaoPlanejada?: number
  duracaoPlanjada?: number
}

const MAPA_METODO_LEGADO: Record<string, string> = {
  vapor: 'vaporizado',
  flor: 'fumado',
  extracao: 'comestivel',
}

const normalizarMetodoLegado = (registro: Registro): Registro => {
  const metodo = MAPA_METODO_LEGADO[registro.metodo] as Registro['metodo'] | undefined
  return metodo ? { ...registro, metodo } : registro
}

const normalizarPausa = (pausa: PausaLegada): Pausa => {
  const { duracaoPlanjada, duracaoPlanejada, ...restante } = pausa

  return {
    ...restante,
    duracaoPlanejada: duracaoPlanejada ?? duracaoPlanjada ?? 0,
  }
}

const obterDEKSeDisponivel = (): CryptoKey | null => {
  try {
    return gerenciadorChaves.obterDEK()
  } catch {
    return null
  }
}

const ehRegistroCifrado = (registro: RegistroPersistido): registro is RegistroCifrado => {
  return typeof registro === 'object' && registro !== null && '_payload' in registro && ehEnvelopeCifrado(registro._payload)
}

const ehPausaCifrada = (pausa: PausaPersistida): pausa is PausaCifrada => {
  return typeof pausa === 'object' && pausa !== null && '_payload' in pausa && ehEnvelopeCifrado(pausa._payload)
}

const normalizarRegistroPersistido = async (registro: RegistroPersistido, dek: CryptoKey | null): Promise<Registro | null> => {
  if (!ehRegistroCifrado(registro)) {
    return registro
  }

  if (!dek) {
    return null
  }

  return descifrarRegistro(registro, dek)
}

const normalizarPausaPersistida = async (pausa: PausaPersistida, dek: CryptoKey | null): Promise<Pausa | null> => {
  if (!ehPausaCifrada(pausa)) {
    return normalizarPausa(pausa as PausaLegada)
  }

  if (!dek) {
    return null
  }

  return descifrarPausa(pausa, dek)
}

export const consultasBD = {
  async obterRegistros() {
    const dek = obterDEKSeDisponivel()
    const registros = await bd.registros.orderBy('timestamp').reverse().toArray()
    const normalizados = await Promise.all(registros.map((registro) => normalizarRegistroPersistido(registro, dek)))
    return normalizados.filter((registro): registro is Registro => Boolean(registro))
  },

  async obterRegistrosRecentes(dias: number) {
    const desde = Date.now() - dias * 24 * 60 * 60 * 1000
    const dek = obterDEKSeDisponivel()
    const registros = await bd.registros.where('timestamp').aboveOrEqual(desde).sortBy('timestamp')
    const normalizados = await Promise.all(registros.map((registro) => normalizarRegistroPersistido(registro, dek)))
    return normalizados.filter((registro): registro is Registro => Boolean(registro))
  },

  async obterRegistrosPorPeriodo(dataInicial: number, dataFinal: number) {
    const dek = obterDEKSeDisponivel()
    const registros = await bd.registros.where('timestamp').between(dataInicial, dataFinal, true, true).toArray()
    const normalizados = await Promise.all(registros.map((registro) => normalizarRegistroPersistido(registro, dek)))
    return normalizados.filter((registro): registro is Registro => Boolean(registro))
  },

  async obterRegistroPorId(id: string) {
    const dek = obterDEKSeDisponivel()
    const registro = await bd.registros.get(id)

    if (!registro) {
      return undefined
    }

    return normalizarRegistroPersistido(registro, dek) ?? undefined
  },

  async salvarRegistro(registro: Registro) {
    const metadadosProtecao = await consultasBD.obterMetadadosProtecao()

    if (metadadosProtecao?.criptografiaDados) {
      const dek = gerenciadorChaves.obterDEK()
      const registroCifrado = await cifrarRegistro(registro, dek)
      await bd.registros.put(registroCifrado)
      return registro
    }

    await bd.registros.put(registro)
    return registro
  },

  async deletarRegistro(id: string) {
    await bd.registros.delete(id)
  },

  async obterPausaAtiva() {
    const dek = obterDEKSeDisponivel()
    const pausaAtiva = await bd.pausas.where('status').equals('ativa').first()

    if (!pausaAtiva) {
      return null
    }

    return (await normalizarPausaPersistida(pausaAtiva, dek)) ?? null
  },

  async obterHistoricoPausa(limite?: number) {
    const dek = obterDEKSeDisponivel()
    const pausasPersistidas = await bd.pausas.orderBy('iniciadoEm').reverse().toArray()
    const pausas = (await Promise.all(pausasPersistidas.map((pausa) => normalizarPausaPersistida(pausa, dek))))
      .filter((pausa): pausa is Pausa => Boolean(pausa))

    return typeof limite === 'number' ? pausas.slice(0, limite) : pausas
  },

  async obterPausaPorId(id: string) {
    const dek = obterDEKSeDisponivel()
    const pausa = await bd.pausas.get(id)

    if (!pausa) {
      return undefined
    }

    return normalizarPausaPersistida(pausa, dek) ?? undefined
  },

  async salvarPausa(pausa: Pausa) {
    const metadadosProtecao = await consultasBD.obterMetadadosProtecao()

    if (metadadosProtecao?.criptografiaDados) {
      const dek = gerenciadorChaves.obterDEK()
      const pausaCifrada = await cifrarPausa(pausa, dek)
      await bd.pausas.put(pausaCifrada)
      return pausa
    }

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

  async salvarMetadadosProtecao(metadados: MetadadosProteção) {
    const registro: RegistroProteção = { chave: 'principal', valor: metadados }
    await bd.protecao.put(registro)
    return registro
  },

  async obterMetadadosProtecao() {
    const registro = await bd.protecao.get('principal')
    return registro?.valor
  },

  async limparMetadadosProtecao() {
    await bd.protecao.delete('principal')
  },

  async salvarBackup(dados: PersistenciaApp, origem: OrigemBackup = 'automatico') {
    const backup: BackupLocal = {
      criadoEm: Date.now(),
      dados,
      versaoApp: VERSAO_APP,
      origem,
    }

    const id = await bd.backups.add(backup)
    return { ...backup, id }
  },

  async obterBackupMaisRecente(origem?: OrigemBackup) {
    const backups = await bd.backups.orderBy('criadoEm').reverse().toArray()

    if (!origem) {
      return backups[0]
    }

    return backups.find((backup) => (backup.origem ?? 'automatico') === origem)
  },

  async limparBackupsAntigos(maximo = 5, origem: OrigemBackup = 'automatico') {
    const backups = await bd.backups.orderBy('criadoEm').reverse().toArray()
    const backupsDaOrigem = backups.filter((backup) => (backup.origem ?? 'automatico') === origem)
    const excedentes = backupsDaOrigem.slice(maximo)

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
    return bd.transaction('rw', bd.registros, bd.pausas, bd.configuracoes, bd.protecao, async () => {
      await bd.registros.clear()
      await bd.pausas.clear()
      await bd.configuracoes.clear()
      await bd.protecao.clear()

      await bd.registros.bulkPut(dados.registros.map(normalizarMetodoLegado))
      await bd.pausas.bulkPut(dados.pausas.map((pausa) => normalizarPausa(pausa as PausaLegada)))
      await bd.configuracoes.put({ chave: 'principal', valor: dados.configuracoes })
    })
  },

  async limparTudo() {
    return bd.transaction('rw', bd.registros, bd.pausas, bd.configuracoes, bd.protecao, bd.backups, async () => {
      await bd.registros.clear()
      await bd.pausas.clear()
      await bd.configuracoes.clear()
      await bd.protecao.clear()
      await bd.backups.clear()
    })
  },
}
