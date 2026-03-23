// Hook de Fluxo de Registro — Pacote D
// Encapsula toda a lógica de estado do wizard

import { useState, useCallback, type FormEvent } from 'react'
import { useRegistro } from '../../ganchos'
import type { EntradaRegistro } from '../../tipos'
import { PERGUNTAS_REGISTRO } from './config/perguntasRegistro'

const ESTADO_INICIAL: EntradaRegistro = {
  metodo: 'vapor',
  intencao: 'foco',
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

  const indiceUltimaEtapa = PERGUNTAS_REGISTRO.length - 1
  const indiceObservacao = PERGUNTAS_REGISTRO.findIndex((etapa) => etapa.id === 'observacao')
  const indiceConclusao = PERGUNTAS_REGISTRO.findIndex((etapa) => etapa.id === 'conclusao')

  const atualizar = useCallback<AtualizarCampo>(
    (campo, valor) => {
      setForm((anterior) => ({ ...anterior, [campo]: valor }))
      setSucesso(false)
      setErro(null)
    },
    []
  )

  const handleSubmit = useCallback(
    async (evento: FormEvent) => {
      evento.preventDefault()

      if (etapaAtual !== indiceObservacao) {
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
      setErro(null)
    },
    [indiceUltimaEtapa]
  )

  const voltar = useCallback(
    () => setEtapaAtual((anterior) => Math.max(anterior - 1, 0)),
    []
  )

  const abrirObservacao = useCallback(() => {
    setObservacaoAberta(true)
  }, [])

  const registrarOutro = useCallback(() => {
    setForm(ESTADO_INICIAL)
    setEtapaAtual(0)
    setObservacaoAberta(false)
    setRegistroConcluido(null)
    setSucesso(false)
    setErro(null)
  }, [])

  return {
    form,
    atualizar,
    etapaAtual,
    observacaoAberta,
    registroConcluido,
    avancar,
    voltar,
    abrirObservacao,
    registrarOutro,
    handleSubmit,
    aguardando,
    sucesso,
    erro,
  }
}
