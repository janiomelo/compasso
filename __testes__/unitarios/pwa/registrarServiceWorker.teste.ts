import { afterEach, describe, expect, it, vi } from 'vitest'
import { registrarServiceWorker } from '../../../src/pwa/registrarServiceWorker'

describe('registrarServiceWorker', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('registra service worker ao carregar a janela em produção', async () => {
    const registrarMock = vi.fn().mockResolvedValue(undefined)

    Object.defineProperty(window.navigator, 'serviceWorker', {
      configurable: true,
      value: { register: registrarMock },
    })

    registrarServiceWorker({ emProducao: true })
    window.dispatchEvent(new Event('load'))

    expect(registrarMock).toHaveBeenCalledWith('/sw.js')
  })

  it('remove registros e caches do app fora de produção', async () => {
    const registrarMock = vi.fn().mockResolvedValue(undefined)
    const desregistrarMock = vi.fn().mockResolvedValue(true)
    const getRegistrationsMock = vi.fn().mockResolvedValue([{ unregister: desregistrarMock }])
    const keysMock = vi.fn().mockResolvedValue(['compasso-cache-v1', 'outra-chave'])
    const deleteMock = vi.fn().mockResolvedValue(true)

    Object.defineProperty(window.navigator, 'serviceWorker', {
      configurable: true,
      value: {
        register: registrarMock,
        getRegistrations: getRegistrationsMock,
      },
    })

    vi.stubGlobal('caches', {
      keys: keysMock,
      delete: deleteMock,
    })

    registrarServiceWorker({ emProducao: false })

    await vi.waitFor(() => {
      expect(getRegistrationsMock).toHaveBeenCalledTimes(1)
      expect(desregistrarMock).toHaveBeenCalledTimes(1)
      expect(keysMock).toHaveBeenCalledTimes(1)
      expect(deleteMock).toHaveBeenCalledWith('compasso-cache-v1')
    })

    expect(registrarMock).not.toHaveBeenCalled()
  })
})
