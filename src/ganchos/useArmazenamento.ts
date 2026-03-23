import { useCallback, useState } from 'react'
import type { Configuracoes, EstadoApp } from '../tipos'
import {
  exportarDados,
  fazerBackupLocal,
  hidratarEstado,
  importarDados,
  limparDados,
  restaurarBackupLocal,
  salvarConfiguracoes,
  validarPersistencia,
} from '../servicos/servicoDados'
import type { OrigemBackup } from '../tipos'

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
  const fazerBackupLocalPersistido = useCallback(
    (opcoes?: { origem?: OrigemBackup; limite?: number }) => executar(() => fazerBackupLocal(opcoes)),
    [executar],
  )
  const restaurarBackupLocalPersistido = useCallback(
    (opcoes?: { origemPreferencial?: OrigemBackup }) => executar(() => restaurarBackupLocal(opcoes)),
    [executar],
  )
  const exportarDadosPersistidos = useCallback(
    (opcoes?: { senhaBkp?: string }) => executar(() => exportarDados(opcoes)),
    [executar],
  )
  const importarDadosPersistidos = useCallback(
    (arquivo: File | Blob | Uint8Array | ArrayBuffer, opcoes?: { senha?: string }) =>
      executar(() => importarDados(arquivo, opcoes)),
    [executar],
  )
  const validarPersistenciaLocal = useCallback(() => executar(() => validarPersistencia()), [executar])
  const limparDadosPersistidos = useCallback(() => executar(() => limparDados()), [executar])

  return {
    carregando,
    carregarEstadoInicial,
    salvarConfiguracoes: salvarConfiguracoesPersistidas,
    fazerBackupLocal: fazerBackupLocalPersistido,
    restaurarBackupLocal: restaurarBackupLocalPersistido,
    exportarDados: exportarDadosPersistidos,
    importarDados: importarDadosPersistidos,
    validarPersistencia: validarPersistenciaLocal,
    limparDados: limparDadosPersistidos,
  }
}