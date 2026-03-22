import { estadoInicial } from '../loja/redutor'
import type { Configuracoes, EstadoApp, EstadoOnboarding, OrigemBackup, PersistenciaApp } from '../tipos'
import { consultasBD } from '../utilitarios/armazenamento/bd'
import pako from 'pako'
import { VERSAO_APP } from '../utilitarios/constantes'

interface PacoteExportacao {
  versao: string
  exportadoEm: string
  dados: PersistenciaApp
}

const LIMITES_BACKUP: Record<OrigemBackup, number> = {
  automatico: 5,
  manual: 20,
}

const normalizarOnboarding = (onboarding: unknown): EstadoOnboarding | undefined => {
  if (!onboarding || typeof onboarding !== 'object') {
    return undefined
  }

  const candidato = onboarding as Partial<EstadoOnboarding>

  if (
    typeof candidato.concluidoEm !== 'number' ||
    typeof candidato.confirmouMaioridadeEm !== 'number' ||
    typeof candidato.aceitouTermosPrivacidadeEm !== 'number' ||
    typeof candidato.versaoTermos !== 'string' ||
    typeof candidato.versaoPolitica !== 'string'
  ) {
    return undefined
  }

  return {
    concluidoEm: candidato.concluidoEm,
    confirmouMaioridadeEm: candidato.confirmouMaioridadeEm,
    aceitouTermosPrivacidadeEm: candidato.aceitouTermosPrivacidadeEm,
    versaoTermos: candidato.versaoTermos,
    versaoPolitica: candidato.versaoPolitica,
  }
}

const normalizarConfiguracoes = (configuracoes?: Configuracoes): Configuracoes => {
  if (!configuracoes) {
    return estadoInicial.configuracoes
  }

  return {
    ...estadoInicial.configuracoes,
    ...configuracoes,
    onboarding: normalizarOnboarding(configuracoes.onboarding),
  }
}

const obterVersaoMajor = (versao: string): number | null => {
  const correspondencia = versao.match(/^(\d+)\./)
  return correspondencia ? Number(correspondencia[1]) : null
}

export async function exportarDados(): Promise<{
  blob: Blob
  conteudo: Uint8Array
  nomeArquivo: string
  timestamp: number
}> {
  const estado = await hidratarEstado()

  const dadosExport: PacoteExportacao = {
    versao: VERSAO_APP,
    exportadoEm: new Date().toISOString(),
    dados: {
      registros: estado.registros,
      pausas: estado.historicoPausa,
      configuracoes: estado.configuracoes,
      metadados: estado.metadados,
    },
  }

  const json = JSON.stringify(dadosExport)
  const comprimido = pako.gzip(json)
  const blob = new Blob([comprimido], { type: 'application/gzip' })

  const agora = new Date()
  const nomeArquivo = `compasso-backup-${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, '0')}-${String(agora.getDate()).padStart(2, '0')}.json.gz`

  return {
    blob,
    conteudo: comprimido,
    nomeArquivo,
    timestamp: Date.now(),
  }
}

export async function validarDadosImport(dados: unknown): Promise<{ valido: boolean; erros: string[] }> {
  const erros: string[] = []

  if (!dados || typeof dados !== 'object') {
    return { valido: false, erros: ['Formato inválido'] }
  }

  const pacote = dados as Partial<PacoteExportacao>

  if (!pacote.versao) erros.push('Versão não encontrada')
  if (!pacote.exportadoEm) erros.push('Data de exportação não encontrada')
  if (!pacote.dados || typeof pacote.dados !== 'object') erros.push('Dados não encontrados')

  if (pacote.versao) {
    const majorPacote = obterVersaoMajor(pacote.versao)
    const majorApp = obterVersaoMajor(VERSAO_APP)

    if (majorPacote === null || majorApp === null) {
      erros.push('Versão inválida')
    } else if (majorPacote !== majorApp) {
      erros.push(`Versão incompatível: backup ${pacote.versao} / app ${VERSAO_APP}`)
    }
  }

  const dadosPersistencia = pacote.dados as Partial<PersistenciaApp> | undefined

  if (!dadosPersistencia || !Array.isArray(dadosPersistencia.registros)) {
    erros.push('registros inválido')
  }

  if (!dadosPersistencia || !Array.isArray(dadosPersistencia.pausas)) {
    erros.push('pausas inválido')
  }

  if (!dadosPersistencia || !dadosPersistencia.configuracoes) {
    erros.push('configurações inválido')
  }

  if (!dadosPersistencia || !dadosPersistencia.metadados) {
    erros.push('metadados inválido')
  }

  if (Array.isArray(dadosPersistencia?.registros)) {
    dadosPersistencia.registros.forEach((registro, indice) => {
      if (!registro.id || !registro.timestamp || !registro.metodo) {
        erros.push(`Registro inválido no índice ${indice}`)
      }
    })
  }

  return {
    valido: erros.length === 0,
    erros,
  }
}

export async function importarDados(
  arquivo: File | Blob | Uint8Array | ArrayBuffer
): Promise<{ sucesso: boolean; erros: string[] }> {
  try {
    let bytes: Uint8Array

    if (arquivo instanceof Uint8Array) {
      bytes = arquivo
    } else if (arquivo instanceof ArrayBuffer) {
      bytes = new Uint8Array(arquivo)
    } else {
      const leitor = arquivo as Blob & { arrayBuffer?: () => Promise<ArrayBuffer> }
      const buffer = typeof leitor.arrayBuffer === 'function'
        ? await leitor.arrayBuffer()
        : await new Response(arquivo).arrayBuffer()
      bytes = new Uint8Array(buffer)
    }

    let pacote: PacoteExportacao
    try {
      const json = pako.ungzip(bytes, { to: 'string' })
      pacote = JSON.parse(json) as PacoteExportacao
    } catch {
      // Fallback para compatibilidade com backup em JSON sem compressão.
      const json = new TextDecoder().decode(bytes)
      pacote = JSON.parse(json) as PacoteExportacao
    }

    const validacao = await validarDadosImport(pacote)
    if (!validacao.valido) {
      return {
        sucesso: false,
        erros: validacao.erros,
      }
    }

    await consultasBD.importarTudo(pacote.dados)

    return {
      sucesso: true,
      erros: [],
    }
  } catch (erro) {
    const mensagem = erro instanceof Error
      ? erro.message
      : typeof erro === 'string'
        ? erro
        : JSON.stringify(erro)

    return {
      sucesso: false,
      erros: [mensagem || 'Falha ao importar dados'],
    }
  }
}

export async function hidratarEstado(): Promise<EstadoApp> {
  const { registros, pausas, configuracoes } = await consultasBD.obterEstadoPersistido()
  const pausaAtiva = pausas.find((pausa) => pausa.status === 'ativa') ?? null

  return {
    ...estadoInicial,
    registros,
    pausaAtiva,
    historicoPausa: pausas,
    configuracoes: normalizarConfiguracoes(configuracoes),
    metadados: {
      ...estadoInicial.metadados,
      ultimaSincronizacao: Date.now(),
    },
  }
}

export async function salvarConfiguracoes(configuracoes: Configuracoes): Promise<Configuracoes> {
  await consultasBD.salvarConfiguracoes(configuracoes)
  return configuracoes
}

export async function fazerBackupLocal(opcoes?: {
  origem?: OrigemBackup
  limite?: number
}): Promise<void> {
  const origem = opcoes?.origem ?? 'automatico'
  const limite = opcoes?.limite ?? LIMITES_BACKUP[origem]
  const estado = await hidratarEstado()

  const dados: PersistenciaApp = {
    registros: estado.registros,
    pausas: estado.historicoPausa,
    configuracoes: estado.configuracoes,
    metadados: estado.metadados,
  }

  await consultasBD.salvarBackup(dados, origem)
  await consultasBD.limparBackupsAntigos(limite, origem)
}

export async function restaurarBackupLocal(opcoes?: {
  origemPreferencial?: OrigemBackup
}): Promise<boolean> {
  const origemPreferencial = opcoes?.origemPreferencial ?? 'manual'
  const origemAlternativa: OrigemBackup = origemPreferencial === 'manual' ? 'automatico' : 'manual'

  const backupPreferencial = await consultasBD.obterBackupMaisRecente(origemPreferencial)
  const backup = backupPreferencial ?? await consultasBD.obterBackupMaisRecente(origemAlternativa)

  if (!backup) {
    return false
  }

  await consultasBD.importarTudo(backup.dados)
  return true
}

export async function validarPersistencia(): Promise<{ valido: boolean; erros: string[] }> {
  const { registros, pausas, configuracoes } = await consultasBD.obterEstadoPersistido()
  const erros: string[] = []

  if (!configuracoes) {
    erros.push('Configurações não encontradas')
  }

  const pausasAtivas = pausas.filter((pausa) => pausa.status === 'ativa')
  if (pausasAtivas.length > 1) {
    erros.push('Existe mais de uma pausa ativa')
  }

  registros.forEach((registro, indice) => {
    if (!registro.id || !registro.timestamp || !registro.metodo) {
      erros.push(`Registro inválido no índice ${indice}`)
    }
  })

  return {
    valido: erros.length === 0,
    erros,
  }
}

export async function obterResumoDadosLocais(): Promise<{
  totalRegistros: number
  totalPausas: number
  totalPreferenciasSalvas: number
  tamanhoAproximadoBytes: number
  ultimoBackupManualEm: number | null
  ultimoBackupAutomaticoEm: number | null
}> {
  const { registros, pausas, configuracoes } = await consultasBD.obterEstadoPersistido()
  const [backupManual, backupAutomatico] = await Promise.all([
    consultasBD.obterBackupMaisRecente('manual'),
    consultasBD.obterBackupMaisRecente('automatico'),
  ])

  const totalPreferenciasSalvas = configuracoes
    ? Object.values(configuracoes).filter((valor) => valor !== undefined).length
    : 0

  const tamanhoAproximadoBytes = new TextEncoder().encode(
    JSON.stringify({ registros, pausas, configuracoes })
  ).length

  return {
    totalRegistros: registros.length,
    totalPausas: pausas.length,
    totalPreferenciasSalvas,
    tamanhoAproximadoBytes,
    ultimoBackupManualEm: backupManual?.criadoEm ?? null,
    ultimoBackupAutomaticoEm: backupAutomatico?.criadoEm ?? null,
  }
}

export async function limparDados(): Promise<void> {
  await consultasBD.limparTudo()
}