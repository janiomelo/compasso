import { afterEach, describe, expect, it, vi } from 'vitest'
import { registrarServiceWorker } from '../../../src/pwa/registrarServiceWorker'

describe('registrarServiceWorker', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('registra service worker ao carregar a janela', async () => {
    const registrarMock = vi.fn().mockResolvedValue(undefined)

    Object.defineProperty(window.navigator, 'serviceWorker', {
      configurable: true,
      value: { register: registrarMock },
    })

    registrarServiceWorker()
    window.dispatchEvent(new Event('load'))

    expect(registrarMock).toHaveBeenCalledWith('/sw.js')
  })
})
