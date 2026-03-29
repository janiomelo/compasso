/**
 * Testes: Redutor de Estado — Compasso
 *
 * Cobre:
 * - Todas as ações de mutação de estado
 * - Pausas (iniciar, encerrar, cancelar)
 * - Registros (adicionar, atualizar, deletar)
 * - Configurações
 * - Proteção
 * - UI state
 */

import { describe, expect, it } from 'vitest'
import { redutor, estadoInicial } from '../../../src/loja/redutor'
import type { EstadoApp, AcaoApp, RegistroConsumo, PausaConcluida } from '../../../src/tipos'

describe('redutor.ts — Estado da Aplicação', () => {
  describe('ADICIONAR_REGISTRO', () => {
    it('adiciona novo registro no início da lista', () => {
      const novoRegistro: RegistroConsumo = {
        id: '1',
        criadoEm: Date.now(),
        consumo: 'Cerveja',
        intensidade: 'moderada',
        notas: 'Teste',
      }

      const acao: AcaoApp = {
        tipo: 'ADICIONAR_REGISTRO',
        payload: novoRegistro,
      }

      const novoEstado = redutor(estadoInicial, acao)

      expect(novoEstado.registros).toHaveLength(1)
      expect(novoEstado.registros[0]).toEqual(novoRegistro)
    })

    it('mantém ordem de registros mais recentes primeiro', () => {
      const registro1: RegistroConsumo = {
        id: '1',
        criadoEm: 1000,
        consumo: 'Cerveja',
        intensidade: 'leve',
      }

      const registro2: RegistroConsumo = {
        id: '2',
        criadoEm: 2000,
        consumo: 'Vinho',
        intensidade: 'moderada',
      }

      let estado = redutor(estadoInicial, {
        tipo: 'ADICIONAR_REGISTRO',
        payload: registro1,
      })

      estado = redutor(estado, {
        tipo: 'ADICIONAR_REGISTRO',
        payload: registro2,
      })

      expect(estado.registros[0].id).toBe('2')
      expect(estado.registros[1].id).toBe('1')
    })
  })

  describe('ATUALIZAR_REGISTRO', () => {
    it('atualiza registro existente por ID', () => {
      const registro: RegistroConsumo = {
        id: '1',
        criadoEm: Date.now(),
        consumo: 'Cerveja',
        intensidade: 'leve',
      }

      let estado = redutor(estadoInicial, {
        tipo: 'ADICIONAR_REGISTRO',
        payload: registro,
      })

      const registroAtualizado = {
        ...registro,
        intensidade: 'forte' as const,
        notas: 'Atualizado',
      }

      estado = redutor(estado, {
        tipo: 'ATUALIZAR_REGISTRO',
        payload: registroAtualizado,
      })

      expect(estado.registros[0].intensidade).toBe('forte')
      expect(estado.registros[0].notas).toBe('Atualizado')
      expect(estado.registros).toHaveLength(1)
    })
  })

  describe('DELETAR_REGISTRO', () => {
    it('remove registro por ID', () => {
      const registro: RegistroConsumo = {
        id: '1',
        criadoEm: Date.now(),
        consumo: 'Cerveja',
        intensidade: 'leve',
      }

      let estado = redutor(estadoInicial, {
        tipo: 'ADICIONAR_REGISTRO',
        payload: registro,
      })

      estado = redutor(estado, {
        tipo: 'DELETAR_REGISTRO',
        payload: '1',
      })

      expect(estado.registros).toHaveLength(0)
    })

    it('não afeta outros registros', () => {
      const registro1: RegistroConsumo = {
        id: '1',
        criadoEm: 1000,
        consumo: 'Cerveja',
        intensidade: 'leve',
      }

      const registro2: RegistroConsumo = {
        id: '2',
        criadoEm: 2000,
        consumo: 'Vinho',
        intensidade: 'moderada',
      }

      let estado = redutor(estadoInicial, {
        tipo: 'ADICIONAR_REGISTRO',
        payload: registro1,
      })

      estado = redutor(estado, {
        tipo: 'ADICIONAR_REGISTRO',
        payload: registro2,
      })

      estado = redutor(estado, {
        tipo: 'DELETAR_REGISTRO',
        payload: '1',
      })

      expect(estado.registros).toHaveLength(1)
      expect(estado.registros[0].id).toBe('2')
    })
  })

  describe('INICIAR_PAUSA', () => {
    it('inicia pausa ativa', () => {
      const pausaInicial = {
        id: 'pausa-1',
        iniciadaEm: Date.now(),
        planejadaAte: Date.now() + 86400000,
        status: 'ativa' as const,
        duracaoPlanejada: 86400000,
      }

      const estado = redutor(estadoInicial, {
        tipo: 'INICIAR_PAUSA',
        payload: pausaInicial,
      })

      expect(estado.pausaAtiva).toEqual(pausaInicial)
    })

    it('limpa pausa anterior ao iniciar nova', () => {
      const pausa1 = {
        id: 'pausa-1',
        iniciadaEm: 1000,
        planejadaAte: 88400000,
        status: 'ativa' as const,
        duracaoPlanejada: 86400000,
      }

      const pausa2 = {
        id: 'pausa-2',
        iniciadaEm: 2000,
        planejadaAte: 89400000,
        status: 'ativa' as const,
        duracaoPlanejada: 86400000,
      }

      let estado = redutor(estadoInicial, {
        tipo: 'INICIAR_PAUSA',
        payload: pausa1,
      })

      estado = redutor(estado, {
        tipo: 'INICIAR_PAUSA',
        payload: pausa2,
      })

      expect(estado.pausaAtiva?.id).toBe('pausa-2')
    })
  })

  describe('ENCERRAR_PAUSA', () => {
    it('move pausa de ativa para histórico', () => {
      const pausaInicial = {
        id: 'pausa-1',
        iniciadaEm: Date.now(),
        planejadaAte: Date.now() + 86400000,
        status: 'ativa' as const,
        duracaoPlanejada: 86400000,
      }

      let estado = redutor(estadoInicial, {
        tipo: 'INICIAR_PAUSA',
        payload: pausaInicial,
      })

      const pausaConcluida: PausaConcluida = {
        id: 'pausa-1',
        iniciadaEm: Date.now(),
        encerradaEm: Date.now() + 43200000,
        planejadaAte: Date.now() + 86400000,
        status: 'concluida' as const,
        duracaoPlanejada: 86400000,
        duracaoReal: 43200000,
      }

      estado = redutor(estado, {
        tipo: 'ENCERRAR_PAUSA',
        payload: pausaConcluida,
      })

      expect(estado.pausaAtiva).toBeNull()
      expect(estado.historicoPausa).toHaveLength(1)
      expect(estado.historicoPausa[0]).toEqual(pausaConcluida)
    })

    it('adiciona múltiplas pausas ao histórico em ordem (mais recente primeiro)', () => {
      const pausa1: PausaConcluida = {
        id: 'pausa-1',
        iniciadaEm: 1000,
        encerradaEm: 44200000,
        planejadaAte: 87400000,
        status: 'concluida',
        duracaoPlanejada: 86400000,
        duracaoReal: 43200000,
      }

      const pausa2: PausaConcluida = {
        id: 'pausa-2',
        iniciadaEm: 2000,
        encerradaEm: 45200000,
        planejadaAte: 88400000,
        status: 'concluida',
        duracaoPlanejada: 86400000,
        duracaoReal: 43200000,
      }

      let estado = redutor(estadoInicial, {
        tipo: 'ENCERRAR_PAUSA',
        payload: pausa1,
      })

      estado = redutor(estado, {
        tipo: 'ENCERRAR_PAUSA',
        payload: pausa2,
      })

      expect(estado.historicoPausa).toHaveLength(2)
      expect(estado.historicoPausa[0].id).toBe('pausa-2')
      expect(estado.historicoPausa[1].id).toBe('pausa-1')
    })
  })

  describe('CANCELAR_PAUSA', () => {
    it('limpa pausa ativa sem adicionar ao histórico', () => {
      const pausaInicial = {
        id: 'pausa-1',
        iniciadaEm: Date.now(),
        planejadaAte: Date.now() + 86400000,
        status: 'ativa' as const,
        duracaoPlanejada: 86400000,
      }

      let estado = redutor(estadoInicial, {
        tipo: 'INICIAR_PAUSA',
        payload: pausaInicial,
      })

      estado = redutor(estado, {
        tipo: 'CANCELAR_PAUSA',
        payload: undefined,
      })

      expect(estado.pausaAtiva).toBeNull()
      expect(estado.historicoPausa).toHaveLength(0)
    })
  })

  describe('DEFINIR_CONFIGURACAO', () => {
    it('atualiza configuração individual', () => {
      const estado = redutor(estadoInicial, {
        tipo: 'DEFINIR_CONFIGURACAO',
        payload: {
          valorEconomia: 50,
        },
      })

      expect(estado.configuracoes.valorEconomia).toBe(50)
      expect(estado.configuracoes.moedaEconomia).toBe('BRL') // Mantém outras
    })

    it('atualiza múltiplas configurações', () => {
      const estado = redutor(estadoInicial, {
        tipo: 'DEFINIR_CONFIGURACAO',
        payload: {
          valorEconomia: 100,
          tema: 'claro',
          notificacoesAtivas: false,
        },
      })

      expect(estado.configuracoes.valorEconomia).toBe(100)
      expect(estado.configuracoes.tema).toBe('claro')
      expect(estado.configuracoes.notificacoesAtivas).toBe(false)
    })

    it('sincroniza timeout na proteção quando atualizado', () => {
      const novoTimeout = 30 * 60 * 1000

      const estado = redutor(estadoInicial, {
        tipo: 'DEFINIR_CONFIGURACAO',
        payload: {
          timeoutBloqueio: novoTimeout,
        },
      })

      expect(estado.protecao.timeoutBloqueioMs).toBe(novoTimeout)
    })

    it('sincroniza manterDesbloqueadoNestaSessao na proteção quando atualizado', () => {
      const estado = redutor(estadoInicial, {
        tipo: 'DEFINIR_CONFIGURACAO',
        payload: {
          manterDesbloqueadoNestaSessao: true,
        },
      })

      expect(estado.protecao.manterDesbloqueadoNestaSessao).toBe(true)
    })
  })

  describe('DEFINIR_CARREGANDO', () => {
    it('atualiza estado de carregamento', () => {
      let estado = redutor(estadoInicial, {
        tipo: 'DEFINIR_CARREGANDO',
        payload: true,
      })

      expect(estado.ui.carregando).toBe(true)

      estado = redutor(estado, {
        tipo: 'DEFINIR_CARREGANDO',
        payload: false,
      })

      expect(estado.ui.carregando).toBe(false)
    })
  })

  describe('REIDRATAR_ESTADO', () => {
    it('substitui estado inteiro por novo', () => {
      const novoEstado: EstadoApp = {
        ...estadoInicial,
        registros: [
          {
            id: 'registro-1',
            criadoEm: Date.now(),
            consumo: 'Teste',
            intensidade: 'leve',
          },
        ],
      }

      const estado = redutor(estadoInicial, {
        tipo: 'REIDRATAR_ESTADO',
        payload: novoEstado,
      })

      expect(estado).toEqual(novoEstado)
      expect(estado.registros).toHaveLength(1)
    })
  })

  describe('ATIVAR_PROTECAO', () => {
    it('ativa proteção e marca como desbloqueada', () => {
      const estado = redutor(estadoInicial, {
        tipo: 'ATIVAR_PROTECAO',
        payload: {
          ativado: true,
          desbloqueado: true,
          ultimoDesbloqueioEm: Date.now(),
          timeoutBloqueioMs: 15 * 60 * 1000,
          manterDesbloqueadoNestaSessao: false,
        },
      })

      expect(estado.protecao.ativado).toBe(true)
      expect(estado.protecao.desbloqueado).toBe(true)
      expect(estado.configuracoes.protecaoAtiva).toBe(true)
    })
  })

  describe('DESATIVAR_PROTECAO', () => {
    it('desativa proteção e bloqueia aplicação', () => {
      let estado = redutor(estadoInicial, {
        tipo: 'ATIVAR_PROTECAO',
        payload: {
          ativado: true,
          desbloqueado: true,
          ultimoDesbloqueioEm: Date.now(),
          timeoutBloqueioMs: 15 * 60 * 1000,
          manterDesbloqueadoNestaSessao: false,
        },
      })

      estado = redutor(estado, {
        tipo: 'DESATIVAR_PROTECAO',
        payload: undefined,
      })

      expect(estado.protecao.ativado).toBe(false)
      expect(estado.protecao.desbloqueado).toBe(false)
      expect(estado.configuracoes.protecaoAtiva).toBe(false)
    })
  })

  describe('BLOQUEAR_APP', () => {
    it('marca aplicação como bloqueada', () => {
      const estado = redutor(estadoInicial, {
        tipo: 'BLOQUEAR_APP',
        payload: undefined,
      })

      expect(estado.protecao.desbloqueado).toBe(false)
    })
  })

  describe('DESBLOQUEAR_APP', () => {
    it('marca aplicação como desbloqueada e registra timestamp', () => {
      const agora = Date.now()
      const estado = redutor(estadoInicial, {
        tipo: 'DESBLOQUEAR_APP',
        payload: undefined,
      })

      expect(estado.protecao.desbloqueado).toBe(true)
      expect(estado.protecao.ultimoDesbloqueioEm).toBeGreaterThanOrEqual(agora)
    })
  })

  describe('ação inválida', () => {
    it('retorna estado sem mudar quando ação é desconhecida', () => {
      const acao = {
        tipo: 'ACAO_DESCONHECIDA',
        payload: undefined,
      } as any

      const estado = redutor(estadoInicial, acao)

      expect(estado).toEqual(estadoInicial)
    })
  })

  describe('composição de múltiplas ações', () => {
    it('aplica sequência de ações corretamente', () => {
      let estado = estadoInicial

      // Adiciona registros
      estado = redutor(estado, {
        tipo: 'ADICIONAR_REGISTRO',
        payload: {
          id: '1',
          criadoEm: 1000,
          consumo: 'Cerveja',
          intensidade: 'leve',
        },
      })

      // Configura economia
      estado = redutor(estado, {
        tipo: 'DEFINIR_CONFIGURACAO',
        payload: {
          valorEconomia: 75,
        },
      })

      // Inicia pausa
      estado = redutor(estado, {
        tipo: 'INICIAR_PAUSA',
        payload: {
          id: 'pausa-1',
          iniciadaEm: 2000,
          planejadaAte: 88400000,
          status: 'ativa',
          duracaoPlanejada: 86400000,
        },
      })

      expect(estado.registros).toHaveLength(1)
      expect(estado.configuracoes.valorEconomia).toBe(75)
      expect(estado.pausaAtiva?.id).toBe('pausa-1')
    })
  })
})
