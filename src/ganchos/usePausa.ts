import { useCallback, useEffect, useRef, useState } from 'react'
import { useApp } from './useApp'
import {
  iniciarPausa as iniciarPausaServico,
  encerrarPausa as encerrarPausaServico,
  interromperPausa as interromperPausaServico,
} from '../servicos/servicoPausa'
import type { EntradaPausa, Pausa, ProgressoPausa } from '../tipos'

const INTERVALO_CRONOMETRO_MS = 1000

export const usePausa = () => {
  const { estado, despacho } = useApp()
  const [progresso, setProgresso] = useState<ProgressoPausa | null>(null)
  const intervaloRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const pausaAtiva = estado.pausaAtiva

  // --- cronômetro ---
  const calcularProgresso = useCallback((pausa: Pausa): ProgressoPausa => {
    const decorridoMs = Date.now() - pausa.iniciadoEm
    const restanteMs = Math.max(pausa.duracaoPlanjada - decorridoMs, 0)
    const percentualBruto = (decorridoMs / pausa.duracaoPlanjada) * 100

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
      const pausa = await iniciarPausaServico(dados)

      despacho({ tipo: 'INICIAR_PAUSA', payload: pausa })

      return pausa
    },
    [despacho],
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

  return {
    pausaAtiva,
    historico: estado.historioPausa,
    progresso,
    iniciar,
    encerrar,
    interromper,
  }
}
