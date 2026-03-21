import { useCallback, useState } from 'react'
import type { Configuracoes, EstadoApp } from '../tipos'
import {
  fazerBackupLocal,
  hidratarEstado,
  limparDados,
  restaurarBackupLocal,
  salvarConfiguracoes,
  validarPersistencia,
} from '../servicos/servicoDados'

export const useArmazenamento = () => {
  const [carregando, setCarregando] = useState(false)

  const executar = useCallback(async <T>(operacao: () => Promise<T>): Promise<T> => {
    setCarregando(true)

    try {
      return await operacao()
    } finally {
      setCarregando(false)
    }
  }, [])

  const carregarEstadoInicial = useCallback(() => executar<EstadoApp>(() => hidratarEstado()), [executar])
  const salvarConfiguracoesPersistidas = useCallback(
    (configuracoes: Configuracoes) => executar(() => salvarConfiguracoes(configuracoes)),
    [executar],
  )
  const fazerBackupLocalPersistido = useCallback(() => executar(() => fazerBackupLocal()), [executar])
  const restaurarBackupLocalPersistido = useCallback(() => executar(() => restaurarBackupLocal()), [executar])
  const validarPersistenciaLocal = useCallback(() => executar(() => validarPersistencia()), [executar])
  const limparDadosPersistidos = useCallback(() => executar(() => limparDados()), [executar])

  return {
    carregando,
    carregarEstadoInicial,
    salvarConfiguracoes: salvarConfiguracoesPersistidas,
    fazerBackupLocal: fazerBackupLocalPersistido,
    restaurarBackupLocal: restaurarBackupLocalPersistido,
    validarPersistencia: validarPersistenciaLocal,
    limparDados: limparDadosPersistidos,
  }
}