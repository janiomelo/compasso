import { describe, expect, it } from 'vitest'
import { PERGUNTAS_REGISTRO } from '../../../src/paginas/Registro/config/perguntasRegistro'

describe('PERGUNTAS_REGISTRO', () => {
  it('deve manter a ordem oficial das etapas do check-in', () => {
    expect(PERGUNTAS_REGISTRO.map((etapa) => etapa.id)).toEqual([
      'forma-uso',
      'intencao',
      'intensidade',
      'observacao',
      'conclusao',
    ])
  })

  it('deve ter campo e opcoes nas etapas de escolha-unica obrigatoria', () => {
    const etapasEscolha = PERGUNTAS_REGISTRO.filter((etapa) => etapa.tipo === 'escolha-unica')

    expect(etapasEscolha.length).toBe(3)

    etapasEscolha.forEach((etapa) => {
      expect(etapa.obrigatoria).toBe(true)
      expect(etapa.campo).toBeDefined()
      expect(Array.isArray(etapa.opcoes)).toBe(true)
      expect(etapa.opcoes?.length).toBeGreaterThan(1)
    })
  })

  it('deve manter observacao como etapa opcional', () => {
    const observacao = PERGUNTAS_REGISTRO.find((etapa) => etapa.id === 'observacao')

    expect(observacao).toBeDefined()
    expect(observacao?.tipo).toBe('texto-opcional')
    expect(observacao?.obrigatoria).toBe(false)
  })
})
