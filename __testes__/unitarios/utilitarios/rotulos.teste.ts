import { describe, it, expect } from 'vitest'
import {
  rotularMetodo,
  rotularIntencao,
  rotularIntensidade,
  rotularStatusPausa,
  MAPA_INTENSIDADE,
} from '../../../src/utilitarios/apresentacao/rotulos'

describe('rotularMetodo', () => {
  it('deve rotular vaporizado', () => {
    expect(rotularMetodo('vaporizado')).toBe('Vaporizado')
  })

  it('deve rotular fumado', () => {
    expect(rotularMetodo('fumado')).toBe('Fumado')
  })

  it('deve rotular comestível', () => {
    expect(rotularMetodo('comestivel')).toBe('Comestível')
  })

  it('deve rotular outro', () => {
    expect(rotularMetodo('outro')).toBe('Outro')
  })

  it('deve retornar o valor bruto quando ID desconhecido', () => {
    expect(rotularMetodo('desconhecido')).toBe('desconhecido')
  })
})

describe('rotularIntencao', () => {
  it('deve rotular paz', () => {
    expect(rotularIntencao('paz')).toBe('Paz')
  })

  it('deve rotular foco', () => {
    expect(rotularIntencao('foco')).toBe('Foco')
  })

  it('deve rotular social', () => {
    expect(rotularIntencao('social')).toBe('Social')
  })

  it('deve rotular descanso', () => {
    expect(rotularIntencao('descanso')).toBe('Descanso')
  })

  it('deve rotular criatividade', () => {
    expect(rotularIntencao('criatividade')).toBe('Criatividade')
  })

  it('deve rotular outro', () => {
    expect(rotularIntencao('outro')).toBe('Outro')
  })

  it('deve retornar o valor bruto quando ID desconhecido', () => {
    expect(rotularIntencao('desconhecido')).toBe('desconhecido')
  })
})

describe('rotularIntensidade', () => {
  it('deve rotular leve', () => {
    expect(rotularIntensidade('leve')).toBe('Leve')
  })

  it('deve rotular media', () => {
    expect(rotularIntensidade('media')).toBe('Média')
  })

  it('deve rotular alta', () => {
    expect(rotularIntensidade('alta')).toBe('Alta')
  })

  it('deve retornar o valor bruto quando ID desconhecido', () => {
    expect(rotularIntensidade('desconhecido')).toBe('desconhecido')
  })
})

describe('rotularStatusPausa', () => {
  it('deve rotular ativa', () => {
    expect(rotularStatusPausa('ativa')).toBe('Ativa')
  })

  it('deve rotular concluida', () => {
    expect(rotularStatusPausa('concluida')).toBe('Concluída')
  })

  it('deve rotular interrompida', () => {
    expect(rotularStatusPausa('interrompida')).toBe('Interrompida')
  })

  it('deve retornar o valor bruto quando status desconhecido', () => {
    expect(rotularStatusPausa('desconhecido')).toBe('desconhecido')
  })
})

describe('MAPA_INTENSIDADE', () => {
  it('deve mapear leve para 3', () => {
    expect(MAPA_INTENSIDADE.leve).toBe(3)
  })

  it('deve mapear media para 5', () => {
    expect(MAPA_INTENSIDADE.media).toBe(5)
  })

  it('deve mapear alta para 8', () => {
    expect(MAPA_INTENSIDADE.alta).toBe(8)
  })

  it('deve ter os três níveis de intensidade', () => {
    expect(Object.keys(MAPA_INTENSIDADE)).toHaveLength(3)
  })
})
