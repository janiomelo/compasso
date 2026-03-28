import type { EntradaRegistro, FiltroRegistro, Registro } from '../tipos'
import { consultasBD } from '../utilitarios/armazenamento/bd'

const criarId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return `registro-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

export async function criarRegistro(dados: EntradaRegistro): Promise<Registro> {
  if (!dados.metodo) {
    throw new Error('Forma de uso obrigatória')
  }

  if (!dados.intencao) {
    throw new Error('Intenção obrigatória')
  }

  const agora = Date.now()

  const registro: Registro = {
    id: criarId(),
    timestamp: agora,
    data: new Date(agora),
    ...dados,
    metodo: dados.metodo,
    intencao: dados.intencao,
  }

  return consultasBD.salvarRegistro(registro)
}

export async function obterRegistros(filtros?: FiltroRegistro): Promise<Registro[]> {
  if (filtros?.dataInicial !== undefined && filtros?.dataFinal !== undefined) {
    const registros = await consultasBD.obterRegistrosPorPeriodo(filtros.dataInicial, filtros.dataFinal)
    return typeof filtros.limite === 'number' ? registros.slice(0, filtros.limite) : registros
  }

  const registros = await consultasBD.obterRegistros()
  return typeof filtros?.limite === 'number' ? registros.slice(0, filtros.limite) : registros
}

export async function atualizarRegistro(id: string, dados: Partial<Registro>): Promise<Registro> {
  const registroAtual = await consultasBD.obterRegistroPorId(id)

  if (!registroAtual) {
    throw new Error('Registro não encontrado')
  }

  const registroAtualizado: Registro = {
    ...registroAtual,
    ...dados,
  }

  return consultasBD.salvarRegistro(registroAtualizado)
}

export async function deletarRegistro(id: string): Promise<void> {
  await consultasBD.deletarRegistro(id)
}

export async function obterRegistroPorId(id: string): Promise<Registro> {
  const registro = await consultasBD.obterRegistroPorId(id)

  if (!registro) {
    throw new Error('Registro não encontrado')
  }

  return registro
}

export async function obterRegistrosRecentes(dias: number): Promise<Registro[]> {
  const registros = await consultasBD.obterRegistrosRecentes(dias)
  return registros.sort((a, b) => b.timestamp - a.timestamp)
}