import type { EntradaPausa, EstatPausa, Pausa, ProgressoPausa } from '../tipos'
import { consultasBD } from '../utilitarios/armazenamento/bd'

const criarId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return `pausa-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

export async function iniciarPausa(dados: EntradaPausa): Promise<Pausa> {
  const pausaAtiva = await consultasBD.obterPausaAtiva()

  if (pausaAtiva) {
    throw new Error('Já existe uma pausa ativa')
  }

  const pausa: Pausa = {
    id: criarId(),
    iniciadoEm: Date.now(),
    duracaoPlanejada: dados.duracaoPlanejada,
    status: 'ativa',
    valorEconomia: dados.valorEconomia ?? 0,
    notas: dados.notas,
  }

  return consultasBD.salvarPausa(pausa)
}

export async function encerrarPausa(idPausa: string, motivoEncerramento?: string): Promise<Pausa> {
  const pausa = await consultasBD.obterPausaPorId(idPausa)

  if (!pausa) {
    throw new Error('Pausa não encontrada')
  }

  const agora = Date.now()
  const pausaAtualizada: Pausa = {
    ...pausa,
    duracaoReal: agora - pausa.iniciadoEm,
    status: 'concluida',
    motivoEncerramento,
  }

  return consultasBD.salvarPausa(pausaAtualizada)
}

export async function interromperPausa(idPausa: string, motivoEncerramento?: string): Promise<Pausa> {
  const pausa = await consultasBD.obterPausaPorId(idPausa)

  if (!pausa) {
    throw new Error('Pausa não encontrada')
  }

  const agora = Date.now()
  const pausaAtualizada: Pausa = {
    ...pausa,
    duracaoReal: agora - pausa.iniciadoEm,
    status: 'interrompida',
    motivoEncerramento,
  }

  return consultasBD.salvarPausa(pausaAtualizada)
}

export async function obterPausaAtiva(): Promise<Pausa | null> {
  return consultasBD.obterPausaAtiva()
}

export async function obterHistoricoPausa(limite?: number): Promise<Pausa[]> {
  return consultasBD.obterHistoricoPausa(limite)
}

export async function calcularProgressoPausa(idPausa: string): Promise<ProgressoPausa> {
  const pausa = await consultasBD.obterPausaPorId(idPausa)

  if (!pausa) {
    throw new Error('Pausa não encontrada')
  }

  const fim = pausa.duracaoReal ?? Date.now() - pausa.iniciadoEm
  const decorridoMs = fim
  const restanteMs = Math.max(pausa.duracaoPlanejada - decorridoMs, 0)
  const percentualBruto = (decorridoMs / pausa.duracaoPlanejada) * 100

  return {
    decorridoMs,
    restanteMs,
    percentualConclusao: Math.min(Math.max(percentualBruto, 0), 100),
    concluida: restanteMs === 0 || pausa.status !== 'ativa',
  }
}

export async function obterEstatPausa(idPausa: string): Promise<EstatPausa> {
  const pausa = await consultasBD.obterPausaPorId(idPausa)

  if (!pausa) {
    throw new Error('Pausa não encontrada')
  }

  return {
    duracaoPlanejada: pausa.duracaoPlanejada,
    duracaoReal: pausa.duracaoReal ?? Date.now() - pausa.iniciadoEm,
    economiaAcumulada: pausa.valorEconomia,
    status: pausa.status,
  }
}