import { useCallback } from 'react'
import { useApp } from './useApp'
import { derivarChavePBKDF2, redeserivarChave } from '../utilitarios/seguranca/kdf'
import {
  cifrar,
  descifia,
  exportarChave,
  gerarChaveDEK,
  importarChave,
} from '../utilitarios/seguranca/criptografia'
import { gerenciadorChaves } from '../utilitarios/seguranca/gerenciadorChaves'
import { consultasBD } from '../utilitarios/armazenamento/bd'
import type { EstadoProteção } from '../tipos'

const bytesParaBase64 = (bytes: Uint8Array): string => btoa(String.fromCharCode(...bytes))
const base64ParaBytes = (base64: string): Uint8Array =>
  new Uint8Array(atob(base64).split('').map((c) => c.charCodeAt(0)))

export const useProteção = () => {
  const { estado, despacho } = useApp()

  const bloquear = useCallback(() => {
    gerenciadorChaves.limparDEK()
    despacho({ tipo: 'BLOQUEAR_APP' })
  }, [despacho])

  const ativarProtecao = useCallback(
    async (senha: string) => {
      if (!senha || senha.length < 8) {
        throw new Error('Senha deve ter pelo menos 8 caracteres')
      }

      const resultadoKdf = await derivarChavePBKDF2(senha)
      const dek = await gerarChaveDEK()
      const dekRaw = await exportarChave(dek)

      const resultadoDekCriptografada = await cifrar(dekRaw, resultadoKdf.kek)

      await consultasBD.salvarMetadadosProtecao({
        salt: bytesParaBase64(resultadoKdf.salt),
        paramsKdf: {
          algoritmo: resultadoKdf.parametros.algoritmo,
          iteracoes: resultadoKdf.parametros.iteracoes,
        },
        dekCriptografada: bytesParaBase64(resultadoDekCriptografada.ciphertext),
        ivDek: bytesParaBase64(resultadoDekCriptografada.iv),
        tagDek: bytesParaBase64(resultadoDekCriptografada.tag),
        criptografiaDados: true,
        ativoDesdeEm: Date.now(),
      })

      const timeout = estado.configuracoes.timeoutBloqueio
      gerenciadorChaves.guardarDEK(dek, timeout)

      const novoEstadoProtecao: EstadoProteção = {
        ativado: true,
        desbloqueado: true,
        ultimoDesbloqueioEm: Date.now(),
        timeoutBloqueioMs: timeout,
        manterDesbloqueadoNestaSessao: estado.configuracoes.manterDesbloqueadoNestaSessao,
      }

      despacho({ tipo: 'ATIVAR_PROTECAO', payload: novoEstadoProtecao })
      despacho({
        tipo: 'DEFINIR_CONFIGURACAO',
        payload: {
          protecaoAtiva: true,
        },
      })
    },
    [despacho, estado.configuracoes.timeoutBloqueio, estado.configuracoes.manterDesbloqueadoNestaSessao],
  )

  const desbloquear = useCallback(
    async (senha: string) => {
      const metadados = await consultasBD.obterMetadadosProtecao()

      if (!metadados) {
        throw new Error('Proteção não configurada neste dispositivo')
      }

      const kek = await redeserivarChave(senha, metadados.salt, {
        algoritmo: metadados.paramsKdf.algoritmo,
        iteracoes: metadados.paramsKdf.iteracoes,
      })

      const dekCriptografada = {
        ciphertext: base64ParaBytes(metadados.dekCriptografada),
        iv: base64ParaBytes(metadados.ivDek),
        tag: base64ParaBytes(metadados.tagDek),
        algoritmo: 'aes-256-gcm' as const,
      }

      const dekRaw = await descifia(dekCriptografada, kek)
      const dek = await importarChave(dekRaw)

      gerenciadorChaves.guardarDEK(dek, estado.configuracoes.timeoutBloqueio)
      despacho({ tipo: 'DESBLOQUEAR_APP' })
    },
    [despacho, estado.configuracoes.timeoutBloqueio],
  )

  const desativarProtecao = useCallback(async () => {
    gerenciadorChaves.limparDEK()
    await consultasBD.limparMetadadosProtecao()

    despacho({ tipo: 'DESATIVAR_PROTECAO' })
    despacho({ tipo: 'DEFINIR_CONFIGURACAO', payload: { protecaoAtiva: false } })
  }, [despacho])

  const trocarSenha = useCallback(
    async (senhaAtual: string, senhaNova: string) => {
      await desbloquear(senhaAtual)

      const dek = gerenciadorChaves.obterDEK()
      const dekRaw = await exportarChave(dek)

      const novoKdf = await derivarChavePBKDF2(senhaNova)
      const novaDekCriptografada = await cifrar(dekRaw, novoKdf.kek)

      await consultasBD.salvarMetadadosProtecao({
        salt: bytesParaBase64(novoKdf.salt),
        paramsKdf: {
          algoritmo: novoKdf.parametros.algoritmo,
          iteracoes: novoKdf.parametros.iteracoes,
        },
        dekCriptografada: bytesParaBase64(novaDekCriptografada.ciphertext),
        ivDek: bytesParaBase64(novaDekCriptografada.iv),
        tagDek: bytesParaBase64(novaDekCriptografada.tag),
        criptografiaDados: true,
        ativoDesdeEm: Date.now(),
      })
    },
    [desbloquear],
  )

  const atualizarTimeoutSessao = useCallback(
    (timeoutMs: number) => {
      if (estado.protecao.desbloqueado) {
        gerenciadorChaves.estenderSessao(timeoutMs)
      }

      despacho({
        tipo: 'DEFINIR_CONFIGURACAO',
        payload: { timeoutBloqueio: timeoutMs },
      })
    },
    [despacho, estado.protecao.desbloqueado],
  )

  const obterDEKSessao = useCallback(() => gerenciadorChaves.obterDEK(), [])

  return {
    estadoProtecao: estado.protecao,
    ativarProtecao,
    desbloquear,
    bloquear,
    desativarProtecao,
    trocarSenha,
    atualizarTimeoutSessao,
    obterDEKSessao,
  }
}
