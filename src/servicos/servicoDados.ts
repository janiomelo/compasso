import { estadoInicial } from '../loja/redutor'
import type { Configuracoes, EstadoApp, EstadoOnboarding, OrigemBackup, PersistenciaApp } from '../tipos'
import { consultasBD } from '../utilitarios/armazenamento/bd'
import pako from 'pako'
import { VERSAO_APP } from '../utilitarios/constantes'
import type { EnvelopeCriptografado, ParametrosKDFResultado, ResultadoCifra } from '../utilitarios/seguranca/tipos'
import { cifrar, descifia, exportarChave, gerarChaveDEK, importarChave } from '../utilitarios/seguranca/criptografia'
import { derivarChavePBKDF2, redeserivarChave } from '../utilitarios/seguranca/kdf'
import { gerenciadorChaves } from '../utilitarios/seguranca/gerenciadorChaves'

interface PacoteExportacao {
  versao: string
  exportadoEm: string
  dados: PersistenciaApp
}

interface EnvelopeBackupCriptografado extends EnvelopeCriptografado {
  dekCriptografada: string
  ivDek: string
  tagDek: string
}

interface PacoteExportacaoCriptografado {
  versao: string
  exportadoEm: string
  criptografado: true
  envelope: EnvelopeBackupCriptografado
}

type PacoteImportavel = PacoteExportacao | PacoteExportacaoCriptografado

interface OpcoesExportacao {
  senhaBkp?: string
}

interface OpcoesImportacao {
  senha?: string
}

const LIMITES_BACKUP: Record<OrigemBackup, number> = {
  automatico: 5,
  manual: 20,
}

const bytesParaBase64 = (bytes: Uint8Array): string => btoa(String.fromCharCode(...bytes))
const base64ParaBytes = (valor: string): Uint8Array =>
  new Uint8Array(atob(valor).split('').map((caractere) => caractere.charCodeAt(0)))

const ehPacoteCriptografado = (valor: unknown): valor is PacoteExportacaoCriptografado => {
  if (!valor || typeof valor !== 'object') {
    return false
  }

  const pacote = valor as Partial<PacoteExportacaoCriptografado>
  return pacote.criptografado === true && typeof pacote.envelope === 'object' && pacote.envelope !== null
}

const obterBytesArquivo = async (arquivo: File | Blob | Uint8Array | ArrayBuffer): Promise<Uint8Array> => {
  if (arquivo instanceof Uint8Array) {
    return arquivo
  }

  if (arquivo instanceof ArrayBuffer) {
    return new Uint8Array(arquivo)
  }

  const leitor = arquivo as Blob & { arrayBuffer?: () => Promise<ArrayBuffer> }
  const buffer = typeof leitor.arrayBuffer === 'function'
    ? await leitor.arrayBuffer()
    : await new Response(arquivo).arrayBuffer()

  return new Uint8Array(buffer)
}

const parsearPacote = (bytes: Uint8Array): PacoteImportavel => {
  try {
    const json = pako.ungzip(bytes, { to: 'string' })
    return JSON.parse(json) as PacoteImportavel
  } catch {
    const json = new TextDecoder().decode(bytes)
    return JSON.parse(json) as PacoteImportavel
  }
}

const validarPacoteCriptografado = (pacote: Partial<PacoteExportacaoCriptografado>, erros: string[]) => {
  if (!pacote.envelope || typeof pacote.envelope !== 'object') {
    erros.push('Envelope criptografado inválido')
    return
  }

  const envelope = pacote.envelope as Partial<EnvelopeBackupCriptografado>

  if (typeof envelope.versao !== 'number') erros.push('Versão do envelope não encontrada')
  if (envelope.algoritmo !== 'aes-256-gcm') erros.push('Algoritmo de criptografia inválido')
  if (!envelope.kdfAlgoritmo) erros.push('Algoritmo KDF não encontrado')
  if (!envelope.kdfParametros || typeof envelope.kdfParametros !== 'object') erros.push('Parâmetros KDF inválidos')
  if (!envelope.salt) erros.push('Salt não encontrado')
  if (!envelope.iv) erros.push('IV não encontrado')
  if (!envelope.tag) erros.push('Tag não encontrada')
  if (!envelope.payload) erros.push('Payload não encontrado')
  if (!envelope.dekCriptografada) erros.push('DEK criptografada não encontrada')
  if (!envelope.ivDek) erros.push('IV da DEK não encontrado')
  if (!envelope.tagDek) erros.push('Tag da DEK não encontrada')
}

const descifrarPacoteCriptografado = async (
  pacote: PacoteExportacaoCriptografado,
  opcoes?: OpcoesImportacao
): Promise<PacoteExportacao> => {
  const { envelope } = pacote

  const kdfParametros: ParametrosKDFResultado = {
    ...envelope.kdfParametros,
    algoritmo: envelope.kdfAlgoritmo,
  }

  let dek: CryptoKey

  if (opcoes?.senha) {
    const kek = await redeserivarChave(opcoes.senha, envelope.salt, kdfParametros)

    const dekCifrada: ResultadoCifra = {
      ciphertext: base64ParaBytes(envelope.dekCriptografada),
      iv: base64ParaBytes(envelope.ivDek),
      tag: base64ParaBytes(envelope.tagDek),
      algoritmo: 'aes-256-gcm',
    }

    const dekRaw = await descifia(dekCifrada, kek)
    dek = await importarChave(dekRaw)
  } else {
    dek = gerenciadorChaves.obterDEK()
  }

  const payloadCifrado: ResultadoCifra = {
    ciphertext: base64ParaBytes(envelope.payload),
    iv: base64ParaBytes(envelope.iv),
    tag: base64ParaBytes(envelope.tag),
    algoritmo: 'aes-256-gcm',
  }

  const payloadBytes = await descifia(payloadCifrado, dek)
  const json = new TextDecoder().decode(payloadBytes)
  return JSON.parse(json) as PacoteExportacao
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
    protecaoAtiva: Boolean(configuracoes.protecaoAtiva),
    timeoutBloqueio:
      typeof configuracoes.timeoutBloqueio === 'number'
        ? configuracoes.timeoutBloqueio
        : estadoInicial.configuracoes.timeoutBloqueio,
    manterDesbloqueadoNestaSessao: Boolean(configuracoes.manterDesbloqueadoNestaSessao),
  }
}

const obterVersaoMajor = (versao: string): number | null => {
  const correspondencia = versao.match(/^(\d+)\./)
  return correspondencia ? Number(correspondencia[1]) : null
}

export async function exportarDados(opcoes?: OpcoesExportacao): Promise<{
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

  let pacoteFinal: PacoteImportavel = dadosExport

  const protecaoAtiva = estado.configuracoes.protecaoAtiva
  const senhaBkp = opcoes?.senhaBkp

  if (protecaoAtiva || senhaBkp) {
    const payload = new TextEncoder().encode(JSON.stringify(dadosExport))

    let dek: CryptoKey
    let salt: Uint8Array
    let paramsKdf: ParametrosKDFResultado
    let dekCriptografada: ResultadoCifra

    if (protecaoAtiva) {
      const metadadosProtecao = await consultasBD.obterMetadadosProtecao()

      if (!metadadosProtecao) {
        throw new Error('Metadados de proteção não encontrados para exportação criptografada')
      }

      dek = gerenciadorChaves.obterDEK()
      salt = base64ParaBytes(metadadosProtecao.salt)
      paramsKdf = {
        ...metadadosProtecao.paramsKdf,
        algoritmo: metadadosProtecao.paramsKdf.algoritmo,
      }
      dekCriptografada = {
        ciphertext: base64ParaBytes(metadadosProtecao.dekCriptografada),
        iv: base64ParaBytes(metadadosProtecao.ivDek),
        tag: base64ParaBytes(metadadosProtecao.tagDek),
        algoritmo: 'aes-256-gcm',
      }
    } else {
      if (!senhaBkp) {
        throw new Error('Senha de backup não informada')
      }

      const resultadoKdf = await derivarChavePBKDF2(senhaBkp)
      dek = await gerarChaveDEK()
      const dekRaw = await exportarChave(dek)

      salt = resultadoKdf.salt
      paramsKdf = {
        algoritmo: resultadoKdf.parametros.algoritmo,
        iteracoes: resultadoKdf.parametros.iteracoes,
      }
      dekCriptografada = await cifrar(dekRaw, resultadoKdf.kek)
    }

    const payloadCifrado = await cifrar(payload, dek)

    pacoteFinal = {
      versao: VERSAO_APP,
      exportadoEm: new Date().toISOString(),
      criptografado: true,
      envelope: {
        versao: 1,
        timestamp: Date.now(),
        algoritmo: 'aes-256-gcm',
        kdfAlgoritmo: paramsKdf.algoritmo,
        kdfParametros: paramsKdf,
        salt: bytesParaBase64(salt),
        iv: bytesParaBase64(payloadCifrado.iv),
        tag: bytesParaBase64(payloadCifrado.tag),
        payload: bytesParaBase64(payloadCifrado.ciphertext),
        dekCriptografada: bytesParaBase64(dekCriptografada.ciphertext),
        ivDek: bytesParaBase64(dekCriptografada.iv),
        tagDek: bytesParaBase64(dekCriptografada.tag),
      },
    }
  }

  const json = JSON.stringify(pacoteFinal)
  const comprimido = pako.gzip(json)
  const blob = new Blob([comprimido], { type: 'application/gzip' })

  const agora = new Date()
  const sufixo = ehPacoteCriptografado(pacoteFinal) ? '.enc.json.gz' : '.json.gz'
  const nomeArquivo = `compasso-backup-${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, '0')}-${String(agora.getDate()).padStart(2, '0')}${sufixo}`

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

  const pacote = dados as Partial<PacoteImportavel>

  if (!pacote.versao) erros.push('Versão não encontrada')
  if (!pacote.exportadoEm) erros.push('Data de exportação não encontrada')

  if ((pacote as Partial<PacoteExportacaoCriptografado>).criptografado === true) {
    validarPacoteCriptografado(pacote as Partial<PacoteExportacaoCriptografado>, erros)

    return {
      valido: erros.length === 0,
      erros,
    }
  }

  if (!(pacote as Partial<PacoteExportacao>).dados || typeof (pacote as Partial<PacoteExportacao>).dados !== 'object') {
    erros.push('Dados não encontrados')
  }

  if (pacote.versao) {
    const majorPacote = obterVersaoMajor(pacote.versao)
    const majorApp = obterVersaoMajor(VERSAO_APP)

    if (majorPacote === null || majorApp === null) {
      erros.push('Versão inválida')
    } else if (majorPacote !== majorApp) {
      erros.push(`Versão incompatível: backup ${pacote.versao} / app ${VERSAO_APP}`)
    }
  }

  const pacotePlano = pacote as Partial<PacoteExportacao>
  const dadosPersistencia = pacotePlano.dados as Partial<PersistenciaApp> | undefined

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
  arquivo: File | Blob | Uint8Array | ArrayBuffer,
  opcoes?: OpcoesImportacao
): Promise<{ sucesso: boolean; erros: string[] }> {
  try {
    const bytes = await obterBytesArquivo(arquivo)
    const pacoteImportavel = parsearPacote(bytes)

    const validacao = await validarDadosImport(pacoteImportavel)
    if (!validacao.valido) {
      return {
        sucesso: false,
        erros: validacao.erros,
      }
    }

    const pacote = ehPacoteCriptografado(pacoteImportavel)
      ? await descifrarPacoteCriptografado(pacoteImportavel, opcoes)
      : pacoteImportavel

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
  const configuracoesNormalizadas = normalizarConfiguracoes(configuracoes)

  return {
    ...estadoInicial,
    registros,
    pausaAtiva,
    historicoPausa: pausas,
    configuracoes: configuracoesNormalizadas,
    protecao: {
      ativado: configuracoesNormalizadas.protecaoAtiva,
      desbloqueado: !configuracoesNormalizadas.protecaoAtiva,
      timeoutBloqueioMs: configuracoesNormalizadas.timeoutBloqueio,
      manterDesbloqueadoNestaSessao: configuracoesNormalizadas.manterDesbloqueadoNestaSessao,
    },
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