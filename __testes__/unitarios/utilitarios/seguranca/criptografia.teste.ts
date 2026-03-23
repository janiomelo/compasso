/**
 * Testes: Criptografia AES-256-GCM — Compasso
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  gerarIV,
  cifrar,
  descifia,
  cifrarTexto,
  descifriaTexto,
  gerarChaveDEK,
  exportarChave,
  importarChave,
} from '../../../../src/utilitarios/seguranca/criptografia';
import type { ResultadoCifra } from '../../../../src/utilitarios/seguranca/tipos';

describe('criptografia.ts — AES-256-GCM', () => {
  let chaveTestDEK: CryptoKey;

  beforeEach(async () => {
    chaveTestDEK = await gerarChaveDEK();
  });

  describe('gerarIV', () => {
    it('deve gerar um IV de 12 bytes', () => {
      const iv = gerarIV();
      expect(iv).toBeInstanceOf(Uint8Array);
      expect(iv.length).toBe(12);
    });

    it('cada IV deve ser único (aleatório)', () => {
      const iv1 = gerarIV();
      const iv2 = gerarIV();
      expect(iv1).not.toEqual(iv2);
    });
  });

  describe('cifrar e descifia', () => {
    it('deve cifrar e descifia dados com sucesso', async () => {
      const dadosOriginais = new TextEncoder().encode('Dados sensíveis');

      // Cifrar
      const resultado = await cifrar(dadosOriginais, chaveTestDEK);
      expect(resultado.ciphertext).toBeDefined();
      expect(resultado.iv).toBeDefined();
      expect(resultado.tag).toBeDefined();
      expect(resultado.algoritmo).toBe('aes-256-gcm');

      // Descifia
      const descifrado = await descifia(resultado, chaveTestDEK);
      expect(Array.from(descifrado)).toEqual(Array.from(dadosOriginais));
    });

    it('deve cifrar string UTF-8', async () => {
      const texto = 'Olá, Mundo! 🌍';
      const resultado = await cifrar(texto, chaveTestDEK);
      const descifrado = await descifia(resultado, chaveTestDEK);

      expect(new TextDecoder().decode(descifrado)).toBe(texto);
    });

    it('ciphertext deve ser diferente cada vez (IV aleatório)', async () => {
      const dados = new TextEncoder().encode('Dados');

      const resultado1 = await cifrar(dados, chaveTestDEK);
      const resultado2 = await cifrar(dados, chaveTestDEK);

      // IVs devem ser diferentes (aleatórios)
      expect(resultado1.iv).not.toEqual(resultado2.iv);
      // Ciphertexts devem ser diferentes (devido a IVs diferentes)
      expect(resultado1.ciphertext).not.toEqual(resultado2.ciphertext);
    });

    it('deve detectar alteração nos dados (tag inválida)', async () => {
      const dados = new TextEncoder().encode('Dados originais');
      const resultado = await cifrar(dados, chaveTestDEK);

      // Alterar um byte do ciphertext
      resultado.ciphertext[0] ^= 0xFF;

      // Descifia deve falhar
      await expect(descifia(resultado, chaveTestDEK)).rejects.toThrow(
        'tag inválida'
      );
    });

    it('deve ejetar se IV for alterado', async () => {
      const dados = new TextEncoder().encode('Dados');
      const resultado = await cifrar(dados, chaveTestDEK);

      // Alterar IV
      resultado.iv[0] ^= 0xFF;

      // Descifia deve falhar
      await expect(descifia(resultado, chaveTestDEK)).rejects.toThrow();
    });

    it('deve ejetar se chave estiver errada', async () => {
      const dados = new TextEncoder().encode('Dados');
      const resultado = await cifrar(dados, chaveTestDEK);

      // Gerar uma chave diferente
      const chaveErrada = await gerarChaveDEK();

      // Descifia com chave errada deve falhar
      await expect(descifia(resultado, chaveErrada)).rejects.toThrow();
    });

    it('deve permanecer cifrado (não é texto plano)', async () => {
      const textoOriginal = 'Informação confidencial';
      const resultado = await cifrar(textoOriginal, chaveTestDEK);

      // Ciphertext não deve conter o texto original
      const ciphertextString = String.fromCharCode(...resultado.ciphertext);
      expect(ciphertextString).not.toContain(textoOriginal);
    });
  });

  describe('cifrarTexto e descifriaTexto', () => {
    it('deve cifrar e descifia texto com retorno em Base64', async () => {
      const texto = 'Meu texto secreto';

      const resultado = await cifrarTexto(texto, chaveTestDEK);
      expect(resultado.ciphertextB64).toBeDefined();
      expect(resultado.ivB64).toBeDefined();
      expect(resultado.tagB64).toBeDefined();

      const descifrado = await descifriaTexto(
        resultado.ciphertextB64,
        resultado.ivB64,
        resultado.tagB64,
        chaveTestDEK
      );

      expect(descifrado).toBe(texto);
    });

    it('deve suportar emojis e caracteres especiais', async () => {
      const texto = 'Compasso 🧭 — privacidade local ✅';

      const resultado = await cifrarTexto(texto, chaveTestDEK);
      const descifrado = await descifriaTexto(
        resultado.ciphertextB64,
        resultado.ivB64,
        resultado.tagB64,
        chaveTestDEK
      );

      expect(descifrado).toBe(texto);
    });
  });

  describe('gerarChaveDEK', () => {
    it('deve gerar uma chave AES-256 válida', async () => {
      const chave = await gerarChaveDEK();
      expect(chave).toBeDefined();
      expect(chave.type).toBe('secret');
      expect(chave.algorithm.name).toBe('AES-GCM');
    });

    it('cada chave deve ser única', async () => {
      const chave1 = await gerarChaveDEK();
      const chave2 = await gerarChaveDEK();

      // CryptoKey não pode ser comparada diretamente
      // Verificar produzindo ciphertexts diferentes
      const dados = new TextEncoder().encode('teste');
      const resultado1 = await cifrar(dados, chave1);
      const resultado2 = await cifrar(dados, chave2);

      // IVs são aleatórios, então ciphertexts serão diferentes
      // Validação: chave1 não consegue descifia dados de chave2
      await expect(descifia(resultado2, chave1)).rejects.toThrow();
    });
  });

  describe('exportarChave e importarChave', () => {
    it('deve exportar e reimportar uma chave', async () => {
      const chaveOriginal = await gerarChaveDEK();
      const dados = new TextEncoder().encode('teste de serialização');

      // Cifrar com chave original
      const resultado1 = await cifrar(dados, chaveOriginal);

      // Exportar chave
      const chaveBruta = await exportarChave(chaveOriginal);
      expect(chaveBruta).toBeInstanceOf(Uint8Array);
      expect(chaveBruta.length).toBe(32); // 256 bits = 32 bytes

      // Reimportar chave
      const chaveReimportada = await importarChave(chaveBruta);

      // Descifia com chave reimportada deve funcionar
      const descifrado = await descifia(resultado1, chaveReimportada);
      expect(Array.from(descifrado)).toEqual(Array.from(dados));
    });

    it('deve falhar ao importar dados inválidos', async () => {
      const dadosInvalidos = new Uint8Array(16); // Tamanho errado

      await expect(importarChave(dadosInvalidos)).rejects.toThrow();
    });
  });

  describe('Testes de Segurança', () => {
    it('não deve deixar padrões visíveis em ciphertexts', async () => {
      // Cifrar o mesmo dado várias vezes
      const dados = new TextEncoder().encode('A');
      const ciphertexts: Uint8Array[] = [];

      for (let i = 0; i < 10; i++) {
        const resultado = await cifrar(dados, chaveTestDEK);
        ciphertexts.push(resultado.ciphertext);
      }

      // Todos devem ser diferentes (por causa do IV aleatório)
      for (let i = 0; i < ciphertexts.length - 1; i++) {
        expect(ciphertexts[i]).not.toEqual(ciphertexts[i + 1]);
      }
    });

    it('deve funcionar com dados vazios', async () => {
      const dadosVazios = new Uint8Array(0);
      const resultado = await cifrar(dadosVazios, chaveTestDEK);
      const descifrado = await descifia(resultado, chaveTestDEK);

      expect(descifrado.length).toBe(0);
    });

    it('deve funcionar com dados muito grandes', async () => {
      // 10 MB de dados
      const dadosGrandes = new Uint8Array(10 * 1024 * 1024);
      // getRandomValues aceita no maximo 65536 bytes por chamada
      const bloco = 65536;
      for (let offset = 0; offset < dadosGrandes.length; offset += bloco) {
        const fim = Math.min(offset + bloco, dadosGrandes.length);
        crypto.getRandomValues(dadosGrandes.subarray(offset, fim));
      }

      const resultado = await cifrar(dadosGrandes, chaveTestDEK);
      const descifrado = await descifia(resultado, chaveTestDEK);

      expect(descifrado).toEqual(dadosGrandes);
    });
  });
});
