import { ChaveSessionProteção } from '../../tipos'

class GerenciadorChaves {
  private chaveSessao: ChaveSessionProteção | null = null
  private timeoutId: ReturnType<typeof setTimeout> | null = null

  guardarDEK(dek: CryptoKey, timeoutMs: number): void {
    this.limparTimeout()

    this.chaveSessao = {
      dek,
      descartarEm: Date.now() + timeoutMs,
    }

    this.timeoutId = setTimeout(() => {
      this.limparDEK()
    }, timeoutMs)
  }

  obterDEK(): CryptoKey {
    if (!this.chaveSessao) {
      throw new Error('Aplicativo bloqueado: chave de sessão indisponível')
    }

    if (Date.now() > this.chaveSessao.descartarEm) {
      this.limparDEK()
      throw new Error('Sessão expirada: desbloqueie novamente')
    }

    return this.chaveSessao.dek
  }

  estenderSessao(timeoutMs: number): void {
    if (!this.chaveSessao) {
      return
    }

    this.chaveSessao = {
      ...this.chaveSessao,
      descartarEm: Date.now() + timeoutMs,
    }

    this.limparTimeout()
    this.timeoutId = setTimeout(() => {
      this.limparDEK()
    }, timeoutMs)
  }

  obterEstadoSessao(): { desbloqueado: boolean; descartarEm?: number } {
    if (!this.chaveSessao) {
      return { desbloqueado: false }
    }

    return {
      desbloqueado: true,
      descartarEm: this.chaveSessao.descartarEm,
    }
  }

  limparDEK(): void {
    this.chaveSessao = null
    this.limparTimeout()
  }

  private limparTimeout(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
      this.timeoutId = null
    }
  }
}

export const gerenciadorChaves = new GerenciadorChaves()
