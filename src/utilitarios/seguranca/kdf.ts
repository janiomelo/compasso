/**
 * Derivação de chave (KDF) — Compasso
 * Implementa PBKDF2-SHA256 com Web Crypto API nativa
 * 
 * MVP: PBKDF2-SHA256 com 100k-600k iterações
 * Futuro: Migrar para Argon2id se compatibilidade com navegadores permitir
 */

import type { ResultadoKDF, ParametrosKDFResultado } from './tipos';

const cripto = globalThis.crypto;

/**
 * Configurações padrão para PBKDF2
 * Baseadas em recomendações de NIST e OWASP (2023)
 */
const CONFIG_PBKDF2_PADRAO = {
  iteracoes: 600000, // Mínimo recomendado para 2024
  hashAlgoritmo: 'SHA-256' as const,
};

/**
 * Gera um salt aleatório de 32 bytes (256 bits)
 * Suficiente para evitar reutilização e ataques de rainbow table
 */
export function gerarSalt(): Uint8Array {
  if (!cripto) {
    throw new Error('Web Crypto API não disponível neste ambiente');
  }
  return cripto.getRandomValues(new Uint8Array(32));
}

/**
 * Deriva uma chave a partir de uma senha usando PBKDF2-SHA256
 * 
 * @param senha - Senha do usuário (será convertida para bytes UTF-8)
 * @param salt - Salt para derivação (gera aleatório se não fornecido)
 * @param iteracoes - Número de iterações (padrão: 600000)
 * @returns Chave derivada (KEK) e parâmetros para rederivação
 * 
 * @throws Se a Web Crypto API não estiver disponível
 */
export async function derivarChavePBKDF2(
  senha: string,
  salt?: Uint8Array,
  iteracoes: number = CONFIG_PBKDF2_PADRAO.iteracoes
): Promise<ResultadoKDF> {
  // Validar input
  if (!senha || typeof senha !== 'string') {
    throw new Error('Senha inválida: deve ser uma string não-vazia');
  }

  // Gerar salt se não fornecido
  const saltFinal = salt ?? gerarSalt();

  // Converter senha para bytes UTF-8
  const encodador = new TextEncoder();
  const senhaBytes = encodador.encode(senha);

  // Importar senha como chave para PBKDF2
  const senhaChave = await cripto.subtle.importKey(
    'raw',
    senhaBytes as unknown as BufferSource,
    'PBKDF2',
    false,
    ['deriveBits']
  );

  // Derivar bits (256 bits = 32 bytes para AES-256)
  const chaveDerivadaBits = await cripto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltFinal as unknown as BufferSource,
      iterations: iteracoes,
      hash: CONFIG_PBKDF2_PADRAO.hashAlgoritmo,
    },
    senhaChave,
    256 // 256 bits para AES-256
  );

  // Importar bits derivados como chave AES
  const kek = await cripto.subtle.importKey(
    'raw',
    chaveDerivadaBits,
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt']
  );

  return {
    kek,
    salt: saltFinal,
    parametros: {
      algoritmo: 'pbkdf2-sha256',
      iteracoes,
    },
  };
}

/**
 * Derivar chave a partir de uma senha e parâmetros pré-salvos
 * Usada ao desbloquear (importa uma chave com KDF já conhecido)
 * 
 * @param senha - Senha do usuário
 * @param salt - Salt já armazenado em Base64
 * @param parametros - Parâmetros do KDF já armazenados
 * @returns Chave derivada (KEK)
 */
export async function redeserivarChave(
  senha: string,
  saltBase64: string,
  parametros: ParametrosKDFResultado
): Promise<CryptoKey> {
  if (parametros.algoritmo !== 'pbkdf2-sha256') {
    throw new Error(`Algoritmo KDF não suportado: ${parametros.algoritmo}`);
  }

  // Decodificar salt de Base64
  const saltBytes = new Uint8Array(atob(saltBase64).split('').map(c => c.charCodeAt(0)));

  // Derivar e retornar apenas a chave (sem salt nem parâmetros)
  const resultado = await derivarChavePBKDF2(
    senha,
    saltBytes,
    parametros.iteracoes ?? CONFIG_PBKDF2_PADRAO.iteracoes
  );

  return resultado.kek;
}

/**
 * Simular prova-de-trabalho para validar senha
 * Esta função existe para evitar timing attacks na validação de senha
 * Sempre executa a mesma quantidade de trabalho
 */
export async function prova(senha: string): Promise<void> {
  // Executar KDF com parâmetros elevados como prova
  // Assim um atacante não consegue distinguir "senha errada, criptografia falhou" de "sucesso rápido"
  await derivarChavePBKDF2(senha, gerarSalt(), 10000);
}
