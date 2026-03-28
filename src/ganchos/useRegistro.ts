import { useCallback } from 'react'
import { useApp } from './useApp'
import { useArmazenamento } from './useArmazenamento'
import { useTelemetria } from './useTelemetria'
import {
  criarRegistro as criarRegistroServico,
  atualizarRegistro as atualizarRegistroServico,
  deletarRegistro as deletarRegistroServico,
} from '../servicos/servicoRegistro'
import type { EntradaRegistro, Registro } from '../tipos'

export const useRegistro = () => {
  const { estado, despacho } = useApp()
  const { fazerBackupLocal } = useArmazenamento()
  const { rastrearEvento } = useTelemetria()

  const criar = useCallback(
    async (dados: EntradaRegistro): Promise<Registro> => {
      const novoRegistro = await criarRegistroServico(dados)

      despacho({ tipo: 'ADICIONAR_REGISTRO', payload: novoRegistro })
      rastrearEvento('registrou_momento', {
        intencao: novoRegistro.intencao,
        intensidade: novoRegistro.intensidade,
      })

      return novoRegistro
    },
    [despacho, rastrearEvento],
  )

  const atualizar = useCallback(
    async (id: string, dados: Partial<Registro>): Promise<Registro> => {
      const registroAtualizado = await atualizarRegistroServico(id, dados)

      despacho({ tipo: 'ATUALIZAR_REGISTRO', payload: registroAtualizado })

      return registroAtualizado
    },
    [despacho],
  )

  const deletar = useCallback(
    async (id: string): Promise<void> => {
      await deletarRegistroServico(id)

      despacho({ tipo: 'DELETAR_REGISTRO', payload: id })
    },
    [despacho],
  )

  const registrosHoje = () => {
    const hoje = new Date()
    const inicioDia = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate()).getTime()

    return estado.registros.filter((r) => r.timestamp >= inicioDia)
  }

  const registrosRecentes = (limite = 10) => estado.registros.slice(0, limite)

  const backup = useCallback(async () => {
    await fazerBackupLocal()
  }, [fazerBackupLocal])

  return {
    registros: estado.registros,
    registrosHoje: registrosHoje(),
    registrosRecentes,
    criar,
    atualizar,
    deletar,
    backup,
  }
}
