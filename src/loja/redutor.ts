import { EstadoApp, AcaoApp, Configuracoes, EstadoUI } from '../tipos'

// Estado inicial padrão
export const estadoInicial: EstadoApp = {
  registros: [],
  pausaAtiva: null,
  historicoPausa: [],
  configuracoes: {
    valorEconomia: 100, // R$ 100 por consumo típico
    moedaEconomia: 'BRL',
    tema: 'escuro',
    temaAuto: true,
    notificacoesAtivas: true,
    sonsAtivos: true,
    autoBackup14Dias: true,
    diasRetencaoDados: 365,
  } as Configuracoes,
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

    default:
      return estado
  }
}
