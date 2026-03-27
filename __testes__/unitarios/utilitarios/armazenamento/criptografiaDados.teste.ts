import { describe, expect, it } from 'vitest'
import { gerarChaveDEK } from '../../../../src/utilitarios/seguranca/criptografia'
import {
  cifrarDado,
  cifrarPausa,
  cifrarRegistro,
  descifrarDado,
  descifrarPausa,
  descifrarRegistro,
  ehEnvelopeCifrado,
} from '../../../../src/utilitarios/armazenamento/criptografiaDados'
import type { Pausa, Registro } from '../../../../src/tipos'

describe('criptografiaDados', () => {
  it('deve identificar envelope cifrado', () => {
    const envelopeValido = {
      _criptografado: true as const,
      c: 'abc',
      iv: 'def',
      t: 'ghi',
    }

    expect(ehEnvelopeCifrado(envelopeValido)).toBe(true)
    expect(ehEnvelopeCifrado({})).toBe(false)
    expect(ehEnvelopeCifrado(null)).toBe(false)
  })

  it('deve cifrar e descifrar um objeto JSON', async () => {
    const dek = await gerarChaveDEK()
    const dadoOriginal = { nome: 'Compasso', numero: 42, ativo: true }

    const envelope = await cifrarDado(dadoOriginal, dek)
    const recuperado = await descifrarDado<typeof dadoOriginal>(envelope, dek)

    expect(ehEnvelopeCifrado(envelope)).toBe(true)
    expect(recuperado).toEqual(dadoOriginal)
  })

  it('deve cifrar e descifrar registro mantendo id e timestamp em claro', async () => {
    const dek = await gerarChaveDEK()
    const registro: Registro = {
      id: 'reg-1',
      timestamp: Date.now(),
      data: new Date(),
      metodo: 'vaporizado',
      intencao: 'foco',
      intensidade: 'media',
      notas: 'teste',
    }

    const cifrado = await cifrarRegistro(registro, dek)
    const decifrado = await descifrarRegistro(cifrado, dek)

    expect(cifrado.id).toBe(registro.id)
    expect(cifrado.timestamp).toBe(registro.timestamp)
    expect(decifrado).toEqual(registro)
  })

  it('deve cifrar e descifrar pausa mantendo campos de indice em claro', async () => {
    const dek = await gerarChaveDEK()
    const pausa: Pausa = {
      id: 'pausa-1',
      iniciadoEm: Date.now(),
      duracaoPlanejada: 3600000,
      status: 'ativa',
      valorEconomia: 20,
      notas: 'pausa de teste',
    }

    const cifrada = await cifrarPausa(pausa, dek)
    const decifrada = await descifrarPausa(cifrada, dek)

    expect(cifrada.id).toBe(pausa.id)
    expect(cifrada.iniciadoEm).toBe(pausa.iniciadoEm)
    expect(cifrada.status).toBe(pausa.status)
    expect(decifrada).toEqual(pausa)
  })
})
