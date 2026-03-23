import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import App from '../../src/App'
import { bd } from '../../src/utilitarios/armazenamento/bd'
import { estadoInicial } from '../../src/loja/redutor'
import { derivarChavePBKDF2 } from '../../src/utilitarios/seguranca/kdf'
import { cifrar, exportarChave, gerarChaveDEK } from '../../src/utilitarios/seguranca/criptografia'

const bytesParaBase64 = (bytes: Uint8Array): string => btoa(String.fromCharCode(...bytes))

const configurarMatchMedia = () => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: query.includes('light'),
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
}

describe('Protecao de app — bloqueio local', () => {
  beforeEach(async () => {
    vi.restoreAllMocks()
    configurarMatchMedia()
    await bd.delete()
    await bd.open()
    window.history.pushState({}, '', '/')
  })

  afterAll(async () => {
    await bd.delete()
    bd.close()
  })

  it('deve bloquear a abertura e liberar com senha correta', async () => {
    const senha = 'senha-forte-1234'
    const kdf = await derivarChavePBKDF2(senha)
    const dek = await gerarChaveDEK()
    const dekRaw = await exportarChave(dek)
    const dekCriptografada = await cifrar(dekRaw, kdf.kek)

    await bd.configuracoes.put({
      chave: 'principal',
      valor: {
        ...estadoInicial.configuracoes,
        protecaoAtiva: true,
        timeoutBloqueio: 15 * 60 * 1000,
        manterDesbloqueadoNestaSessao: false,
        onboarding: {
          concluidoEm: Date.now(),
          confirmouMaioridadeEm: Date.now(),
          aceitouTermosPrivacidadeEm: Date.now(),
          versaoTermos: '2026-03',
          versaoPolitica: '2026-03',
        },
      },
    })

    await bd.protecao.put({
      chave: 'principal',
      valor: {
        salt: bytesParaBase64(kdf.salt),
        paramsKdf: {
          algoritmo: kdf.parametros.algoritmo,
          iteracoes: kdf.parametros.iteracoes,
        },
        dekCriptografada: bytesParaBase64(dekCriptografada.ciphertext),
        ivDek: bytesParaBase64(dekCriptografada.iv),
        tagDek: bytesParaBase64(dekCriptografada.tag),
        criptografiaDados: true,
        ativoDesdeEm: Date.now(),
      },
    })

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('Desbloquear Compasso')).toBeDefined()
    })

    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: senha } })
    fireEvent.click(screen.getByRole('button', { name: 'Desbloquear' }))

    await waitFor(() => {
      expect(screen.getByText('Seu compasso recente')).toBeDefined()
    })
  })
})
