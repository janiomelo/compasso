// Hook de Fluxo de Registro — Pacote D
// Encapsula toda a lógica de estado do wizard

import { useState, useCallback, type FormEvent } from 'react'
import { useRegistro } from '../../ganchos'
import type { EntradaRegistro } from '../../tipos'

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
  const [intensidadeEscala, setIntensidadeEscala] = useState(5)
  const [aguardando, setAguardando] = useState(false)
  const [sucesso, setSucesso] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

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
      setAguardando(true)
      setErro(null)

      try {
        await criar(form)
        setSucesso(true)
        setForm(ESTADO_INICIAL)
        setEtapaAtual(0)
        setIntensidadeEscala(5)
      } catch (e) {
        setErro(e instanceof Error ? e.message : 'Falha ao salvar registro')
      } finally {
        setAguardando(false)
      }
    },
    [criar]
  )

  const avancar = useCallback(
    () => setEtapaAtual((anterior) => Math.min(anterior + 1, 3)),
    []
  )

  const voltar = useCallback(
    () => setEtapaAtual((anterior) => Math.max(anterior - 1, 0)),
    []
  )

  return {
    form,
    atualizar,
    etapaAtual,
    intensidadeEscala,
    setIntensidadeEscala,
    avancar,
    voltar,
    handleSubmit,
    aguardando,
    sucesso,
    erro,
  }
}
