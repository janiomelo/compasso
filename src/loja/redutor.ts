import { EstadoApp, AcaoApp, Configuracoes, EstadoUI } from '../tipos'

// Estado inicial padrão
export const estadoInicial: EstadoApp = {
  registros: [],
  pausaAtiva: null,
  historioPausa: [],
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
    paginaAtual: 'principal',
    modal: { aberto: false },
    avisos: [],
    barraAberta: false,
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

    case 'LISTAR_REGISTROS':
      return {
        ...estado,
        registros: acao.payload,
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
        historioPausa: [acao.payload, ...estado.historioPausa],
      }

    case 'DEFINIR_CONFIGURACAO':
      return {
        ...estado,
        configuracoes: {
          ...estado.configuracoes,
          ...acao.payload,
        },
      }

    case 'ALTERNAR_TEMA':
      return {
        ...estado,
        configuracoes: {
          ...estado.configuracoes,
          tema: estado.configuracoes.tema === 'escuro' ? 'claro' : 'escuro',
        },
      }

    case 'MOSTRAR_AVISO':
      return {
        ...estado,
        ui: {
          ...estado.ui,
          avisos: [...estado.ui.avisos, acao.payload],
        },
      }

    case 'ESCONDER_AVISO':
      return {
        ...estado,
        ui: {
          ...estado.ui,
          avisos: estado.ui.avisos.filter((a) => a.id !== acao.payload),
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
