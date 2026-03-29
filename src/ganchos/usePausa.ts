import { useCallback, useEffect, useRef, useState } from 'react'
import { useApp } from './useApp'
import { useTelemetria } from './useTelemetria'
import {
  iniciarPausa as iniciarPausaServico,
  encerrarPausa as encerrarPausaServico,
  interromperPausa as interromperPausaServico,
  cancelarPausa as cancelarPausaServico,
} from '../servicos/servicoPausa'
import type { EntradaPausa, Pausa, ProgressoPausa } from '../tipos'
import { TEMPO_MINIMO_CONSIDERAR_PAUSA_MS } from '../utilitarios/constantes'
import { calcularEconomiaEstimadaPorDuracao } from '../utilitarios/dados/calculos'

const INTERVALO_CRONOMETRO_MS = 1000

type ResultadoCancelamentoPausa = {
  registradaNoHistorico: boolean
}

export const usePausa = () => {
  const { estado, despacho } = useApp()
  const { rastrearEvento } = useTelemetria()
  const [progresso, setProgresso] = useState<ProgressoPausa | null>(null)
  const intervaloRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const pausaAtiva = estado.pausaAtiva

  // --- cronômetro ---
  const calcularProgresso = useCallback((pausa: Pausa): ProgressoPausa => {
    const decorridoMs = Date.now() - pausa.iniciadoEm
    const restanteMs = Math.max(pausa.duracaoPlanejada - decorridoMs, 0)
    const percentualBruto = (decorridoMs / pausa.duracaoPlanejada) * 100

    return {
      decorridoMs,
      restanteMs,
      percentualConclusao: Math.min(Math.max(percentualBruto, 0), 100),
      concluida: restanteMs === 0,
    }
  }, [])

  useEffect(() => {
    if (!pausaAtiva) {
      if (intervaloRef.current) {
        clearInterval(intervaloRef.current)
        intervaloRef.current = null
      }

      setProgresso(null)
      return
    }

    // atualizar imediatamente e depois a cada segundo
    setProgresso(calcularProgresso(pausaAtiva))

    intervaloRef.current = setInterval(() => {
      setProgresso(calcularProgresso(pausaAtiva))
    }, INTERVALO_CRONOMETRO_MS)

    return () => {
      if (intervaloRef.current) {
        clearInterval(intervaloRef.current)
      }
    }
  }, [pausaAtiva, calcularProgresso])

  // --- ações ---
  const iniciar = useCallback(
    async (dados: EntradaPausa): Promise<Pausa> => {
      const valorEconomiaPadrao = calcularEconomiaEstimadaPorDuracao(
        dados.duracaoPlanejada,
        estado.configuracoes.valorEconomia,
      )

      const pausa = await iniciarPausaServico({
        ...dados,
        valorEconomia: dados.valorEconomia ?? valorEconomiaPadrao,
      })

      despacho({ tipo: 'INICIAR_PAUSA', payload: pausa })
      rastrearEvento('iniciou_pausa', {
        duracaoPlanejadaMs: pausa.duracaoPlanejada,
      })

      return pausa
    },
    [despacho, rastrearEvento, estado.configuracoes.valorEconomia],
  )

  const encerrar = useCallback(
    async (motivoEncerramento?: string): Promise<void> => {
      if (!pausaAtiva) {
        return
      }

      const pausaEncerrada = await encerrarPausaServico(pausaAtiva.id, motivoEncerramento)

      despacho({ tipo: 'ENCERRAR_PAUSA', payload: pausaEncerrada })
    },
    [pausaAtiva, despacho],
  )

  const interromper = useCallback(
    async (motivoEncerramento?: string): Promise<void> => {
      if (!pausaAtiva) {
        return
      }

      const pausaInterrompida = await interromperPausaServico(pausaAtiva.id, motivoEncerramento)

      despacho({ tipo: 'ENCERRAR_PAUSA', payload: pausaInterrompida })
    },
    [pausaAtiva, despacho],
  )

  const cancelar = useCallback(
    async (motivoEncerramento?: string): Promise<ResultadoCancelamentoPausa> => {
      if (!pausaAtiva) {
        return { registradaNoHistorico: false }
      }

      const duracaoDecorridaMs = Date.now() - pausaAtiva.iniciadoEm

      if (duracaoDecorridaMs < TEMPO_MINIMO_CONSIDERAR_PAUSA_MS) {
        await cancelarPausaServico(pausaAtiva.id)

        despacho({ tipo: 'CANCELAR_PAUSA' })

        return { registradaNoHistorico: false }
      }

      const pausaInterrompida = await interromperPausaServico(pausaAtiva.id, motivoEncerramento)

      despacho({ tipo: 'ENCERRAR_PAUSA', payload: pausaInterrompida })

      return { registradaNoHistorico: true }
    },
    [pausaAtiva, despacho, rastrearEvento],
  )

  return {
    pausaAtiva,
    historico: estado.historicoPausa,
    progresso,
    iniciar,
    encerrar,
    interromper,
    cancelar,
  }
}
