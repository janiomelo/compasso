import { useCallback } from 'react'
import { useApp } from './useApp'
import { useArmazenamento } from './useArmazenamento'

export const useConsentimentoTelemetria = () => {
  const { estado, despacho } = useApp()
  const { salvarConfiguracoes, carregando } = useArmazenamento()

  const definirConsentimentoTelemetria = useCallback(
    async (consentido: boolean | null) => {
      const telemetria = {
        consentido,
        atualizadoEm: Date.now(),
      }

      const novasConfiguracoes = {
        ...estado.configuracoes,
        telemetria,
      }

      await salvarConfiguracoes(novasConfiguracoes)
      despacho({ tipo: 'DEFINIR_CONFIGURACAO', payload: { telemetria } })
    },
    [despacho, estado.configuracoes, salvarConfiguracoes],
  )

  return {
    carregandoConsentimentoTelemetria: carregando,
    consentimentoTelemetria: estado.configuracoes.telemetria?.consentido ?? null,
    definirConsentimentoTelemetria,
  }
}
