import { EstadoApp, AcaoApp, Configuracoes, EstadoUI } from '../tipos'

// Estado inicial padrão
export const estadoInicial: EstadoApp = {
  registros: [],
  pausaAtiva: null,
  historicoPausa: [],
  configuracoes: {
    valorEconomia: 100,
    moedaEconomia: 'BRL',
    tema: 'escuro',
    temaAuto: true,
    notificacoesAtivas: true,
    sonsAtivos: true,
    autoBackup14Dias: true,
    diasRetencaoDados: 365,
    protecaoAtiva: false,
    timeoutBloqueio: 15 * 60 * 1000,
    manterDesbloqueadoNestaSessao: false,
  } as Configuracoes,
  protecao: {
    ativado: false,
    desbloqueado: false,
    timeoutBloqueioMs: 15 * 60 * 1000,
    manterDesbloqueadoNestaSessao: false,
  },
  ui: {
    carregando: false,
    modal: { aberto: false },
    avisos: [],
  } as EstadoUI,
  metadados: {
    ultimaSincronizacao: 0,
    versaoApp: '0.1.0',
    criadoEm: Date.now(),
  },
}

// Redutor principal
export const redutor = (estado: EstadoApp, acao: AcaoApp): EstadoApp => {
  switch (acao.tipo) {
    case 'ADICIONAR_REGISTRO':
      return {
        ...estado,
        registros: [acao.payload, ...estado.registros],
      }

    case 'ATUALIZAR_REGISTRO':
      return {
        ...estado,
        registros: estado.registros.map((r) =>
          r.id === acao.payload.id ? acao.payload : r
        ),
      }

    case 'DELETAR_REGISTRO':
      return {
        ...estado,
        registros: estado.registros.filter((r) => r.id !== acao.payload),
      }

    case 'INICIAR_PAUSA':
      return {
        ...estado,
        pausaAtiva: acao.payload,
      }

    case 'ENCERRAR_PAUSA':
      return {
        ...estado,
        pausaAtiva: null,
        historicoPausa: [acao.payload, ...estado.historicoPausa],
      }

    case 'DEFINIR_CONFIGURACAO':
      return {
        ...estado,
        configuracoes: {
          ...estado.configuracoes,
          ...acao.payload,
        },
        protecao: {
          ...estado.protecao,
          timeoutBloqueioMs:
            typeof acao.payload.timeoutBloqueio === 'number'
              ? acao.payload.timeoutBloqueio
              : estado.protecao.timeoutBloqueioMs,
          manterDesbloqueadoNestaSessao:
            typeof acao.payload.manterDesbloqueadoNestaSessao === 'boolean'
              ? acao.payload.manterDesbloqueadoNestaSessao
              : estado.protecao.manterDesbloqueadoNestaSessao,
        },
      }

    case 'DEFINIR_CARREGANDO':
      return {
        ...estado,
        ui: {
          ...estado.ui,
          carregando: acao.payload,
        },
      }

    case 'REIDRATAR_ESTADO':
      return acao.payload

    case 'ATIVAR_PROTECAO':
      return {
        ...estado,
        protecao: acao.payload,
        configuracoes: {
          ...estado.configuracoes,
          protecaoAtiva: true,
        },
      }

    case 'DESATIVAR_PROTECAO':
      return {
        ...estado,
        protecao: {
          ativado: false,
          desbloqueado: false,
          timeoutBloqueioMs: estado.protecao.timeoutBloqueioMs,
          manterDesbloqueadoNestaSessao: false,
        },
        configuracoes: {
          ...estado.configuracoes,
          protecaoAtiva: false,
        },
      }

    case 'BLOQUEAR_APP':
      return {
        ...estado,
        protecao: {
          ...estado.protecao,
          desbloqueado: false,
        },
      }

    case 'DESBLOQUEAR_APP':
      return {
        ...estado,
        protecao: {
          ...estado.protecao,
          desbloqueado: true,
          ultimoDesbloqueioEm: Date.now(),
        },
      }

    default:
      return estado
  }
}
