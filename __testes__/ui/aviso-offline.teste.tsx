import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { AvisoOffline } from '../../src/componentes/comum/AvisoOffline'

const definirOnline = (valor: boolean) => {
  Object.defineProperty(window.navigator, 'onLine', {
    configurable: true,
    value: valor,
  })
}

describe('AvisoOffline', () => {
  afterEach(() => {
    definirOnline(true)
  })

  it('renderiza mensagem quando dispositivo está offline', () => {
    definirOnline(false)
    render(<AvisoOffline />)

    expect(screen.getByRole('status')).toBeDefined()
    expect(screen.getByText(/Você está offline/)).toBeDefined()
  })

  it('não renderiza quando dispositivo está online', () => {
    definirOnline(true)
    render(<AvisoOffline />)

    expect(screen.queryByRole('status')).toBeNull()
  })
})
