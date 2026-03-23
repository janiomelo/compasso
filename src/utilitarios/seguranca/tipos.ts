/**
 * Tipos de criptografia e segurança — Compasso
 * Utilizados para cifra, derivação de chave e gerenciamento de sessão
 */

/**
 * Resultado de uma operação KDF (Key Derivation Function)
 * Contém a chave derivada e os parâmetros necessários para rederivação
 */
export interface ResultadoKDF {
  kek: CryptoKey; // Key Encryption Key derivada da senha
  salt: Uint8Array; // Random salt usado na derivação
  parametros: ParametrosKDFResultado; // Parâmetros Para rederivação
}

/**
 * Parâmetros do KDF que serão salvos e reutilizados
 */
export interface ParametrosKDFResultado {
  algoritmo: 'pbkdf2-sha256' | 'argon2id';
  iteracoes?: number; // PBKDF2
  memoria?: number; // Argon2id (KB)
  paralelismo?: number; // Argon2id
  tempo?: number; // Argon2id
}

/**
 * Resultado de uma operação de cifra
 * Contém os dados cifrados e metadados necessários para decifra
 */
export interface ResultadoCifra {
  ciphertext: Uint8Array; // Dados cifrados
  iv: Uint8Array; // Initialization Vector (nonce para GCM)
  tag: Uint8Array; // Authentication tag (12 bytes para GCM)
  algoritmo: 'aes-256-gcm';
}

/**
 * Envelope de arquivo criptografado (para backup/exportação)
 * Inclui versão, metadados e payload cifrado
 */
export interface EnvelopeCriptografado {
  versao: number; // 1 para MVP
  timestamp: number;
  algoritmo: 'aes-256-gcm';
  kdfAlgoritmo: 'pbkdf2-sha256' | 'argon2id';
  kdfParametros: ParametrosKDFResultado;
  salt: string; // Base64
  iv: string; // Base64
  tag: string; // Base64
  payload: string; // Base64 dos dados cifrados
}

/**
 * Dados de configuração passados para criptar uma chave (DEK) com KEK
 */
export interface OpcoesCifracao {
  iv?: Uint8Array; // Se omitido, gera aleatório
  aad?: Uint8Array; // Authenticated Additional Data (opcional)
}

/**
 * Resultado de cifrar a DEK com a KEK
 */
export interface ChaveCriptografada {
  kekCriptografada: Uint8Array; // DEK cifrada com KEK
  iv: Uint8Array;
  tag: Uint8Array;
}
