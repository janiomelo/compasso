import { estadoInicial } from '../loja/redutor'
import type { Configuracoes, EstadoApp, PersistenciaApp } from '../tipos'
import { consultasBD } from '../utilitarios/armazenamento/bd'

export async function hidratarEstado(): Promise<EstadoApp> {
  const { registros, pausas, configuracoes } = await consultasBD.obterEstadoPersistido()
  const pausaAtiva = pausas.find((pausa) => pausa.status === 'ativa') ?? null

  return {
    ...estadoInicial,
    registros,
    pausaAtiva,
    historioPausa: pausas,
    configuracoes: configuracoes ?? estadoInicial.configuracoes,
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

export async function fazerBackupLocal(): Promise<void> {
  const estado = await hidratarEstado()

  const dados: PersistenciaApp = {
    registros: estado.registros,
    pausas: estado.historioPausa,
    configuracoes: estado.configuracoes,
    metadados: estado.metadados,
  }

  await consultasBD.salvarBackup(dados)
  await consultasBD.limparBackupsAntigos()
}

export async function restaurarBackupLocal(): Promise<boolean> {
  const backup = await consultasBD.obterBackupMaisRecente()

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

export async function limparDados(): Promise<void> {
  await consultasBD.limparTudo()
}