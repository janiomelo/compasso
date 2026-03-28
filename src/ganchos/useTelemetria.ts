import { useCallback, useEffect, useRef } from 'react'
import { useApp } from './useApp'
import { iniciarUmami, rastrearEventoUmami, type DadosEventoTelemetria, type EventoTelemetria } from '../utilitarios/telemetria'

export const useTelemetria = () => {
  const { estado } = useApp()
  const consentido = estado.configuracoes.telemetria?.consentido === true
  const ultimaRotaRastreadaRef = useRef<string | null>(null)

  useEffect(() => {
    iniciarUmami(consentido)
  }, [consentido])

  const rastrearEvento = useCallback(
    (evento: EventoTelemetria, dados?: DadosEventoTelemetria) => {
      if (!consentido) {
        return
      }

      rastrearEventoUmami(evento, dados)
    },
    [consentido],
  )

  const rastrearPageview = useCallback(
    (rota: string) => {
      if (!consentido || ultimaRotaRastreadaRef.current === rota) {
        return
      }

      ultimaRotaRastreadaRef.current = rota
      rastrearEventoUmami('pageview', { rota })
    },
    [consentido],
  )

  return {
    consentido,
    rastrearEvento,
    rastrearPageview,
  }
}
