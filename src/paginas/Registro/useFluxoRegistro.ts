// Hook de Fluxo de Registro — Pacote D
// Encapsula toda a lógica de estado do wizard

import { useState, useCallback, useEffect, type FormEvent } from 'react'
import { useRegistro } from '../../ganchos'
import type { EntradaRegistro } from '../../tipos'
import { PERGUNTAS_REGISTRO } from './config/perguntasRegistro'

const ESTADO_INICIAL: EntradaRegistro = {
  intensidade: 'media',
  humorAntes: undefined,
  humorDepois: undefined,
  notas: '',
}

type AtualizarCampo = <K extends keyof EntradaRegistro>(
  campo: K,
  valor: EntradaRegistro[K]
) => void

export const useFluxoRegistro = () => {
  const { criar } = useRegistro()
  const [form, setForm] = useState<EntradaRegistro>(ESTADO_INICIAL)
  const [etapaAtual, setEtapaAtual] = useState(0)
  const [observacaoAberta, setObservacaoAberta] = useState(false)
  const [registroConcluido, setRegistroConcluido] = useState<EntradaRegistro | null>(null)
  const [aguardando, setAguardando] = useState(false)
  const [sucesso, setSucesso] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [etapaPendenteAutoAvanco, setEtapaPendenteAutoAvanco] = useState<number | null>(null)

  const indiceUltimaEtapa = PERGUNTAS_REGISTRO.length - 1
  const indiceObservacao = PERGUNTAS_REGISTRO.findIndex((etapa) => etapa.id === 'observacao')
  const indiceConclusao = PERGUNTAS_REGISTRO.findIndex((etapa) => etapa.id === 'conclusao')
  const indiceUltimaEtapaAutoAvanco = PERGUNTAS_REGISTRO.findIndex((etapa) => etapa.id === 'intensidade')

  useEffect(() => {
    if (etapaPendenteAutoAvanco === null) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setEtapaAtual((anterior) => {
        if (anterior !== etapaPendenteAutoAvanco) {
          return anterior
        }

        return Math.min(anterior + 1, indiceUltimaEtapa)
      })
      setEtapaPendenteAutoAvanco(null)
    }, 120)

    return () => window.clearTimeout(timeoutId)
  }, [etapaPendenteAutoAvanco, indiceUltimaEtapa])

  const atualizar = useCallback<AtualizarCampo>(
    (campo, valor) => {
      setForm((anterior) => ({ ...anterior, [campo]: valor }))
      setSucesso(false)
      setErro(null)
    },
    []
  )

  const atualizarComAutoAvanco = useCallback<AtualizarCampo>(
    (campo, valor) => {
      atualizar(campo, valor)

      if (etapaAtual <= indiceUltimaEtapaAutoAvanco) {
        setEtapaPendenteAutoAvanco(etapaAtual)
      }
    },
    [atualizar, etapaAtual, indiceUltimaEtapaAutoAvanco]
  )

  const handleSubmit = useCallback(
    async (evento: FormEvent) => {
      evento.preventDefault()

      if (etapaAtual !== indiceObservacao) {
        return
      }

      if (!form.metodo) {
        setErro('Escolha a forma de uso para continuar.')
        return
      }

      if (!form.intencao) {
        setErro('Escolha a intenção principal para continuar.')
        return
      }

      setAguardando(true)
      setErro(null)

      try {
        await criar(form)
        setRegistroConcluido(form)
        setSucesso(true)
        setEtapaAtual(indiceConclusao)
        setObservacaoAberta(false)
      } catch (e) {
        setErro(e instanceof Error ? e.message : 'Falha ao salvar registro')
      } finally {
        setAguardando(false)
      }
    },
    [criar, etapaAtual, form, indiceConclusao, indiceObservacao]
  )

  const avancar = useCallback(
    () => {
      setEtapaAtual((anterior) => Math.min(anterior + 1, indiceUltimaEtapa))
      setEtapaPendenteAutoAvanco(null)
      setErro(null)
    },
    [indiceUltimaEtapa]
  )

  const voltar = useCallback(
    () => {
      setEtapaPendenteAutoAvanco(null)
      setEtapaAtual((anterior) => Math.max(anterior - 1, 0))
      setErro(null)
    },
    []
  )

  const abrirObservacao = useCallback(() => {
    setObservacaoAberta(true)
  }, [])

  const fecharObservacao = useCallback(() => {
    setObservacaoAberta(false)
  }, [])

  const registrarOutro = useCallback(() => {
    setForm(ESTADO_INICIAL)
    setEtapaAtual(0)
    setEtapaPendenteAutoAvanco(null)
    setObservacaoAberta(false)
    setRegistroConcluido(null)
    setSucesso(false)
    setErro(null)
  }, [])

  return {
    form,
    atualizar,
    atualizarComAutoAvanco,
    etapaAtual,
    observacaoAberta,
    registroConcluido,
    avancar,
    voltar,
    abrirObservacao,
    fecharObservacao,
    registrarOutro,
    handleSubmit,
    aguardando,
    sucesso,
    erro,
  }
}
