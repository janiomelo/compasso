import { describe, it, expect } from 'vitest'
import {
  formatarData,
  formatarDataHora,
  formatarHora,
  formatarMoeda,
  formatarDuracao,
  formatarNumero,
  truncarString,
} from '../../../src/utilitarios/dados/formatacao'

describe('Formatação de Dados', () => {
  describe('formatarData', () => {
    it('deve formatar data corretamente', () => {
      const data = new Date(2026, 2, 21)
      const resultado = formatarData(data)
      expect(resultado).toContain('21')
      expect(resultado).toContain('março')
      expect(resultado).toContain('2026')
    })

    it('deve aceitar timestamp', () => {
      const timestamp = new Date(2026, 2, 21).getTime()
      const resultado = formatarData(timestamp)
      expect(resultado).toContain('21')
    })
  })

  describe('formatarMoeda', () => {
    it('deve formatar moeda BRL corretamente', () => {
      const resultado = formatarMoeda(100, 'BRL')
      expect(resultado).toContain('100')
      expect(resultado).toContain('R$')
    })

    it('deve formatar moeda USD corretamente', () => {
      const resultado = formatarMoeda(100, 'USD')
      expect(resultado).toContain('100')
      expect(resultado).toContain('$')
    })

    it('deve usar BRL por padrão', () => {
      const resultado = formatarMoeda(100)
      expect(resultado).toContain('R$')
    })
  })

  describe('formatarDuracao', () => {
    it('deve formatar segundos', () => {
      const ms = 5000 // 5 segundos
      expect(formatarDuracao(ms)).toBe('5s')
    })

    it('deve formatar minutos e segundos', () => {
      const ms = 61000 // 1m 1s
      expect(formatarDuracao(ms)).toContain('1m')
      expect(formatarDuracao(ms)).toContain('1s')
    })

    it('deve formatar horas, minutos e segundos', () => {
      const ms = 3661000 // 1h 1m 1s
      expect(formatarDuracao(ms)).toContain('1h')
      expect(formatarDuracao(ms)).toContain('1m')
      expect(formatarDuracao(ms)).toContain('1s')
    })

    it('deve retornar 0s para durações zeradas', () => {
      expect(formatarDuracao(0)).toBe('0s')
    })
  })

  describe('formatarNumero', () => {
    it('deve formatar número com separador de milhares', () => {
      const resultado = formatarNumero(1000)
      expect(resultado).toBe('1.000')
    })

    it('deve respeitar casas decimais', () => {
      const resultado = formatarNumero(1234.567, 2)
      expect(resultado).toBe('1.234,57')
    })
  })

  describe('truncarString', () => {
    it('deve truncar string acima do limite', () => {
      const str = 'a'.repeat(100)
      const resultado = truncarString(str, 50)
      expect(resultado.length).toBe(53) // 50 + '...'
      expect(resultado.endsWith('...')).toBe(true)
    })

    it('não deve truncar string abaixo do limite', () => {
      const str = 'Olá mundo'
      const resultado = truncarString(str, 50)
      expect(resultado).toBe('Olá mundo')
    })
  })
})
