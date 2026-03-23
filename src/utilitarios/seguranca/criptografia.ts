/**
 * Criptografia AES-256-GCM — Compasso
 * Implementa cifra e decifra usando Web Crypto API nativa
 * 
 * GCM (Galois/Counter Mode) fornece:
 * - Confidencialidade (cifra do dados)
 * - Autenticação (detecção de alteração)
 * - Nonce/IV aleatório a cada operação
 */

import type { ResultadoCifra, OpcoesCifracao } from './tipos';

const cripto = globalThis.crypto;

/**
 * Tamanho do IV (Initialization Vector / Nonce) em bytes
 * 96 bits (12 bytes) é recomendado para GCM
 */
const TAMANHO_IV = 12;

/**
 * Gera um IV aleatório de 96 bits (12 bytes)
 * Crítico: nunca reutilizar o mesmo IV com a mesma chave
 */
export function gerarIV(): Uint8Array {
  if (!cripto) {
    throw new Error('Web Crypto API não disponível neste ambiente');
  }
  return cripto.getRandomValues(new Uint8Array(TAMANHO_IV));
}

/**
 * Cifra dados com AES-256-GCM
 * 
 * @param dados - Dados a cifrar (Uint8Array ou string convertida para UTF-8)
 * @param chave - Chave AES-256 (CryptoKey de 256 bits)
 * @param opcoes - Opções adicionais (IV customizado, AAD, etc)
 * @returns Ciphertext, IV e tag de autenticação
 * 
 * @throws Se os parâmetros forem inválidos ou a origem falhar
 */
export async function cifrar(
  dados: Uint8Array | string,
  chave: CryptoKey,
  opcoes?: OpcoesCifracao
): Promise<ResultadoCifra> {
  // Converter dados para Uint8Array se necessário
  const dadosBytes = typeof dados === 'string'
    ? new TextEncoder().encode(dados)
    : dados;

  // Gerar ou usar IV fornecido
  const iv = opcoes?.iv ?? gerarIV();

  // Cifrar com AES-256-GCM
  // GCM retorna automaticamente a tag de autenticação
  const ciphertext = await cripto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv as unknown as BufferSource,
      // AAD é opcional; se fornecido, é autenticado mas não cifrado
      ...(opcoes?.aad && { additionalData: opcoes.aad }),
    },
    chave,
    dadosBytes as unknown as BufferSource
  );

  // SubtleCrypto.encrypt para GCM retorna: ciphertext (16 bytes tag + conteúdo)
  // Extrair a tag (últimos 16 bytes)
  const ciphertextArray = new Uint8Array(ciphertext);
  const tag = ciphertextArray.slice(-16);
  const ciphertextSemTag = ciphertextArray.slice(0, -16);

  return {
    ciphertext: ciphertextSemTag,
    iv,
    tag,
    algoritmo: 'aes-256-gcm',
  };
}

/**
 * Decifra dados com AES-256-GCM
 * 
 * @param resultado - Resultado de cifragem (ciphertext, IV, tag)
 * @param chave - Mesma chave AES-256 usada na cifragem
 * @param opcoes - Opções adicionais (AAD para autenticação)
 * @returns Dados originais descriptografados
 * 
 * @throws Se a tag de autenticação for inválida (dados foram alterados ou chave errada)
 */
export async function descifia(
  resultado: ResultadoCifra,
  chave: CryptoKey,
  opcoes?: OpcoesCifracao
): Promise<Uint8Array> {
  // Reconstruir o buffer para decifra: ciphertext + tag
  const bufferCompletoDescifra = new Uint8Array(
    resultado.ciphertext.length + resultado.tag.length
  );
  bufferCompletoDescifra.set(resultado.ciphertext, 0);
  bufferCompletoDescifra.set(resultado.tag, resultado.ciphertext.length);

  try {
    const dados = await cripto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: resultado.iv as unknown as BufferSource,
        ...(opcoes?.aad && { additionalData: opcoes.aad }),
      },
      chave,
      bufferCompletoDescifra
    );

    return new Uint8Array(dados);
  } catch (erro) {
    // Falha de decifra = tag invalida ou chave errada
    throw new Error(
      `Falha ao descifia (tag inválida ou chave incorreta): ${erro instanceof Error ? erro.message : 'erro desconhecido'}`
    );
  }
}

/**
 * Cifra uma string UTF-8 e retorna como Base64
 * Conveniente para serialização e armazenamento
 */
export async function cifrarTexto(
  texto: string,
  chave: CryptoKey
): Promise<{ ciphertextB64: string; ivB64: string; tagB64: string }> {
  const resultado = await cifrar(texto, chave);
  return {
    ciphertextB64: btoa(String.fromCharCode(...resultado.ciphertext)),
    ivB64: btoa(String.fromCharCode(...resultado.iv)),
    tagB64: btoa(String.fromCharCode(...resultado.tag)),
  };
}

/**
 * Decifra uma string Base64 e retorna como texto UTF-8
 */
export async function descifriaTexto(
  ciphertextB64: string,
  ivB64: string,
  tagB64: string,
  chave: CryptoKey
): Promise<string> {
  const ciphertext = new Uint8Array(atob(ciphertextB64).split('').map(c => c.charCodeAt(0)));
  const iv = new Uint8Array(atob(ivB64).split('').map(c => c.charCodeAt(0)));
  const tag = new Uint8Array(atob(tagB64).split('').map(c => c.charCodeAt(0)));

  const resultado: ResultadoCifra = { ciphertext, iv, tag, algoritmo: 'aes-256-gcm' };
  const dados = await descifia(resultado, chave);

  return new TextDecoder().decode(dados);
}

/**
 * Gera uma chave DEK (Data Encryption Key) aleatória para AES-256-GCM
 * Esta será a chave que cifra os dados de verdade
 */
export async function gerarChaveDEK(): Promise<CryptoKey> {
  return cripto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true, // extractable: permitir exportar para cifra com KEK
    ['encrypt', 'decrypt']
  );
}

/**
 * Exportar uma chave CryptoKey para Uint8Array
 * Necessário para cifrar a DEK com a KEK
 */
export async function exportarChave(chave: CryptoKey): Promise<Uint8Array> {
  const buffer = await cripto.subtle.exportKey('raw', chave);
  return new Uint8Array(buffer);
}

/**
 * Importar uma chave de Uint8Array
 * Necessário ao descifra a DEK
 */
export async function importarChave(dados: Uint8Array): Promise<CryptoKey> {
  if (dados.byteLength !== 32) {
    throw new Error('Chave inválida: esperado 32 bytes para AES-256');
  }

  return cripto.subtle.importKey(
    'raw',
    dados as unknown as BufferSource,
    { name: 'AES-GCM' },
    true,
    ['encrypt', 'decrypt']
  );
}
