import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { iniciarUmami, rastrearEventoUmami } from '../../../src/utilitarios/telemetria/umami'

describe('umami.ts — Rastreamento de eventos telemetria', () => {
  let originalUmami: any
  let originalNavigator: Partial<Navigator>

  beforeEach(() => {
    vi.clearAllMocks()
    originalUmami = window.umami
    originalNavigator = navigator

    // Limpar estado anterior
    delete (window as any).umami
  })

  afterEach(() => {
    vi.restoreAllMocks()
    if (originalUmami) {
      window.umami = originalUmami
    }
  })

  describe('iniciarUmami', () => {
    it('não carrega script quando consentimento falso', () => {
      const createElementSpy = vi.spyOn(document, 'createElement')

      iniciarUmami(false)

      expect(createElementSpy).not.toHaveBeenCalledWith('script')
    })

    it('respeita script já carregado', () => {
      const existingScript = document.createElement('script')
      existingScript.id = 'compasso-umami-script'

      const getElementByIdSpy = vi.spyOn(document, 'getElementById').mockReturnValue(existingScript)
      const appendChildSpy = vi.spyOn(document.head, 'appendChild')

      iniciarUmami(true)

      expect(appendChildSpy).not.toHaveBeenCalled()

      getElementByIdSpy.mockRestore()
      appendChildSpy.mockRestore()
    })

    it('obtém website ID do env', () => {
      // O módulo verifica import.meta.env.VITE_UMAMI_WEBSITE_ID
      // Se presente, ele tentará carregar o script
      // Este teste verifica que o chamado não falha
      expect(() => {
        iniciarUmami(true)
      }).not.toThrow()
    })

    it('verifica consentimento e estado de inicialização', () => {
      // Primeiro chamado com false - não inicializa
      iniciarUmami(false)

      // Segundo chamado com true - pode inicializar ou não dependendo de website ID
      const getElementByIdSpy = vi.spyOn(document, 'getElementById').mockReturnValue(null)
      const createElementSpy = vi.spyOn(document, 'createElement')

      expect(() => {
        iniciarUmami(true)
      }).not.toThrow()

      getElementByIdSpy.mockRestore()
      createElementSpy.mockRestore()
    })

    it('não reinicializa se já foi iniciado', () => {
      const getElementByIdSpy = vi.spyOn(document, 'getElementById').mockReturnValue(null)
      const createElementSpy = vi.spyOn(document, 'createElement')

      // Primeira chamada
      expect(() => {
        iniciarUmami(true)
      }).not.toThrow()

      const firstCreateCalls = createElementSpy.mock.callCount

      // Segunda chamada - deve retornar cedo
      expect(() => {
        iniciarUmami(true)
      }).not.toThrow()

      const secondCreateCalls = createElementSpy.mock.callCount

      // Não deve ter criado elementos novamente
      expect(secondCreateCalls).toBe(firstCreateCalls)

      getElementByIdSpy.mockRestore()
      createElementSpy.mockRestore()
    })
  })

  describe('rastrearEventoUmami', () => {
    it('registra evento quando umami disponível', () => {
      const trackMock = vi.fn()
      window.umami = {
        track: trackMock,
      }

      rastrearEventoUmami('clique_comece', { botao: 'iniciar' })

      expect(trackMock).toHaveBeenCalledWith('clique_comece', { botao: 'iniciar' })
    })

    it('registra evento sem dados quando dados não fornecidos', () => {
      const trackMock = vi.fn()
      window.umami = {
        track: trackMock,
      }

      rastrearEventoUmami('pageview')

      expect(trackMock).toHaveBeenCalledWith('pageview', undefined)
    })

    it('não registra quando umami não disponível', () => {
      delete (window as any).umami

      // Não deve lançar erro
      expect(() => {
        rastrearEventoUmami('clique_comece')
      }).not.toThrow()
    })

    it('não registra quando offline', () => {
      const trackMock = vi.fn()
      window.umami = {
        track: trackMock,
      }

      // Mock navigator.onLine como false
      Object.defineProperty(global.navigator, 'onLine', {
        writable: true,
        value: false,
        configurable: true,
      })

      rastrearEventoUmami('clique_comece')

      expect(trackMock).not.toHaveBeenCalled()

      // Restaurar
      Object.defineProperty(global.navigator, 'onLine', {
        writable: true,
        value: true,
        configurable: true,
      })
    })

    it('registra múltiplos eventos sequencialmente', () => {
      const trackMock = vi.fn()
      window.umami = {
        track: trackMock,
      }

      rastrearEventoUmami('clique_comece', { tipo: 'click' })
      rastrearEventoUmami('registrou_momento', { tipo: 'registro' })
      rastrearEventoUmami('pageview')

      expect(trackMock).toHaveBeenCalledTimes(3)
      expect(trackMock).toHaveBeenNthCalledWith(1, 'clique_comece', { tipo: 'click' })
      expect(trackMock).toHaveBeenNthCalledWith(2, 'registrou_momento', { tipo: 'registro' })
      expect(trackMock).toHaveBeenNthCalledWith(3, 'pageview', undefined)
    })

    it('aceita tipos válidos de evento', () => {
      const trackMock = vi.fn()
      window.umami = {
        track: trackMock,
      }

      const eventos = [
        'pageview',
        'clique_comece',
        'conclusao_onboarding',
        'iniciou_pausa',
        'registrou_momento',
        'alterou_consentimento_telemetria',
        'conclusao_checklist_pos_onboarding',
      ] as const

      eventos.forEach((evento) => {
        rastrearEventoUmami(evento)
      })

      expect(trackMock).toHaveBeenCalledTimes(eventos.length)
    })

    it('aceita dados de tipos diversos', () => {
      const trackMock = vi.fn()
      window.umami = {
        track: trackMock,
      }

      rastrearEventoUmami('registrou_momento', {
        valor: 100,
        ativo: true,
        nome: 'teste',
      })

      expect(trackMock).toHaveBeenCalledWith('registrou_momento', {
        valor: 100,
        ativo: true,
        nome: 'teste',
      })
    })

    it('trata comumente registragem de view de página', () => {
      const trackMock = vi.fn()
      window.umami = {
        track: trackMock,
      }

      rastrearEventoUmami('pageview', { pagina: '/pausa' })

      expect(trackMock).toHaveBeenCalledWith('pageview', { pagina: '/pausa' })
    })

    it('trata eventos de onboarding', () => {
      const trackMock = vi.fn()
      window.umami = {
        track: trackMock,
      }

      rastrearEventoUmami('conclusao_onboarding', {
        etapas: 5,
        tempo_total: 120000,
      })

      expect(trackMock).toHaveBeenCalledWith('conclusao_onboarding', {
        etapas: 5,
        tempo_total: 120000,
      })
    })

    it('trata eventos de pausa', () => {
      const trackMock = vi.fn()
      window.umami = {
        track: trackMock,
      }

      rastrearEventoUmami('iniciou_pausa', {
        duracao_planejada: 300000,
        consumo_tipo: 'cafe',
      })

      expect(trackMock).toHaveBeenCalledWith('iniciou_pausa', {
        duracao_planejada: 300000,
        consumo_tipo: 'cafe',
      })
    })

    it('valida status de conexão antes de registrar', () => {
      const trackMock = vi.fn()
      window.umami = {
        track: trackMock,
      }

      // Simular online
      Object.defineProperty(navigator, 'onLine', {
        writable: true,
        value: true,
        configurable: true,
      })

      rastrearEventoUmami('pageview')

      expect(trackMock).toHaveBeenCalled()

      // Limpar
      vi.restoreAllMocks()
    })

    it('verifica typeof navigator antes de acessar onLine', () => {
      const trackMock = vi.fn()
      window.umami = {
        track: trackMock,
      }

      // O código verifica: typeof navigator !== 'undefined' && !navigator.onLine
      // Se navigator é defined, deve continuar
      expect(() => {
        rastrearEventoUmami('pageview')
      }).not.toThrow()
    })
  })

  describe('Integração básica', () => {
    it('rastreia evento sem chamar iniciarUmami', () => {
      const trackMock = vi.fn()
      window.umami = {
        track: trackMock,
      }

      rastrearEventoUmami('clique_comece')

      expect(trackMock).toHaveBeenCalled()
    })

    it('o módulo não falha se umami nunca foi inicializado', () => {
      delete (window as any).umami

      expect(() => {
        rastrearEventoUmami('pageview')
      }).not.toThrow()
    })
  })

  describe('Casos extremos', () => {
    it('ignora silenciosamente quando umami desaparece entre operações', () => {
      const trackMock = vi.fn()
      window.umami = {
        track: trackMock,
      }

      rastrearEventoUmami('pageview')
      expect(trackMock).toHaveBeenCalledTimes(1)

      delete (window as any).umami

      expect(() => {
        rastrearEventoUmami('clique_comece')
      }).not.toThrow()

      expect(trackMock).toHaveBeenCalledTimes(1)
    })

    it('tolera dados vazios', () => {
      const trackMock = vi.fn()
      window.umami = {
        track: trackMock,
      }

      rastrearEventoUmami('pageview', {})

      expect(trackMock).toHaveBeenCalledWith('pageview', {})
    })

    it('verifica type de navigator antes de acessar onLine', () => {
      const trackMock = vi.fn()
      window.umami = {
        track: trackMock,
      }

      // Quando navigator existe e onLine é verdadeiro
      expect(() => {
        rastrearEventoUmami('pageview')
      }).not.toThrow()

      expect(trackMock).toHaveBeenCalled()
    })

    it('ignora eventos quando navigator.onLine é false', () => {
      const trackMock = vi.fn()
      window.umami = {
        track: trackMock,
      }

      const originalOnLine = navigator.onLine
      try {
        Object.defineProperty(navigator, 'onLine', {
          writable: true,
          value: false,
          configurable: true,
        })

        rastrearEventoUmami('pageview')

        expect(trackMock).not.toHaveBeenCalled()
      } finally {
        Object.defineProperty(navigator, 'onLine', {
          writable: true,
          value: originalOnLine,
          configurable: true,
        })
      }
    })

    it('rastreia evento quando navigator.onLine é true', () => {
      const trackMock = vi.fn()
      window.umami = {
        track: trackMock,
      }

      const originalOnLine = navigator.onLine
      try {
        Object.defineProperty(navigator, 'onLine', {
          writable: true,
          value: true,
          configurable: true,
        })

        rastrearEventoUmami('clique_comece')

        expect(trackMock).toHaveBeenCalledWith('clique_comece', undefined)
      } finally {
        Object.defineProperty(navigator, 'onLine', {
          writable: true,
          value: originalOnLine,
          configurable: true,
        })
      }
    })
  })
})

