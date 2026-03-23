/**
 * Criptografia de dados em repouso — Compasso
 * 
 * Cifra/descifra objetos antes de persistir no IndexedDB.
 * Só atua quando proteção está ativa; caso contrário opera transparentemente.
 * 
 * Estratégia:
 * - Serializa o objeto para JSON
 * - Cifra com AES-256-GCM usando a DEK da sessão
 * - Persiste o envelope Base64 no lugar dos dados originais
 */

import { cifrar, descifia } from '../seguranca/criptografia'
import type { ResultadoCifra } from '../seguranca/tipos'
import type { Pausa, Registro } from '../../tipos'

/** Envelope armazenado no lugar dos dados originais quando criptografado */
export interface EnvelopeDado {
  _criptografado: true
  c: string // ciphertext Base64
  iv: string // IV Base64
  t: string // tag Base64
}

const bytesParaBase64 = (bytes: Uint8Array): string => btoa(String.fromCharCode(...bytes))
const base64ParaBytes = (base64: string): Uint8Array =>
  new Uint8Array(atob(base64).split('').map((ch) => ch.charCodeAt(0)))

/** 
 * Verifica se um valor armazenado é um envelope cifrado
 */
export function ehEnvelopeCifrado(valor: unknown): valor is EnvelopeDado {
  return (
    typeof valor === 'object' &&
    valor !== null &&
    '_criptografado' in valor &&
    (valor as EnvelopeDado)._criptografado === true
  )
}

/**
 * Cifra um objeto qualquer com a DEK fornecida.
 * Retorna um EnvelopeDado para persistir no banco.
 */
export async function cifrarDado<T>(dado: T, dek: CryptoKey): Promise<EnvelopeDado> {
  const json = JSON.stringify(dado)
  const resultado: ResultadoCifra = await cifrar(json, dek)

  return {
    _criptografado: true,
    c: bytesParaBase64(resultado.ciphertext),
    iv: bytesParaBase64(resultado.iv),
    t: bytesParaBase64(resultado.tag),
  }
}

/**
 * Descifra um EnvelopeDado e retorna o objeto original.
 * Lança se a chave estiver errada ou os dados tiverem sido adulterados.
 */
export async function descifrarDado<T>(envelope: EnvelopeDado, dek: CryptoKey): Promise<T> {
  const resultadoCifra: ResultadoCifra = {
    ciphertext: base64ParaBytes(envelope.c),
    iv: base64ParaBytes(envelope.iv),
    tag: base64ParaBytes(envelope.t),
    algoritmo: 'aes-256-gcm',
  }

  const dadosBytes = await descifia(resultadoCifra, dek)
  const json = new TextDecoder().decode(dadosBytes)
  return JSON.parse(json) as T
}

/**
 * Cifra cada campo sensível de um registro de uso.
 * Os campos de índice (id, timestamp) ficam em claro para o Dexie indexar.
 * Os demais ficam no payload cifrado.
 */
export async function cifrarRegistro(
  registro: Registro,
  dek: CryptoKey
): Promise<RegistroCifrado> {
  const { id, timestamp } = registro
  const payload = await cifrarDado(registro, dek)

  return {
    id,
    timestamp,
    _payload: payload,
  }
}

/**
 * Descifra um RegistroCifrado e retorna o Registro original.
 */
export async function descifrarRegistro(
  cifrado: RegistroCifrado,
  dek: CryptoKey
): Promise<Registro> {
  const registro = await descifrarDado<Registro>(cifrado._payload, dek)

  return {
    ...registro,
    data: registro.data instanceof Date ? registro.data : new Date(registro.data),
  }
}

/**
 * Cifra cada campo sensível de uma pausa.
 * Os campos de índice (id, iniciadoEm, status) ficam em claro.
 */
export async function cifrarPausa(
  pausa: Pausa,
  dek: CryptoKey
): Promise<PausaCifrada> {
  const { id, iniciadoEm, status } = pausa
  const payload = await cifrarDado(pausa, dek)

  return {
    id,
    iniciadoEm,
    status,
    _payload: payload,
  }
}

/**
 * Descifra uma PausaCifrada e retorna a Pausa original.
 */
export async function descifrarPausa(
  cifrada: PausaCifrada,
  dek: CryptoKey
): Promise<Pausa> {
  return descifrarDado<Pausa>(cifrada._payload, dek)
}

// ––––– Tipos dos envelopes que ficam no banco –––––

/** Versão cifrada de Registro. Mantém índices em claro. */
export interface RegistroCifrado {
  id: string
  timestamp: number
  _payload: EnvelopeDado
}

/** Versão cifrada de Pausa. Mantém índices em claro. */
export interface PausaCifrada {
  id: string
  iniciadoEm: number
  status: Pausa['status']
  _payload: EnvelopeDado
}
