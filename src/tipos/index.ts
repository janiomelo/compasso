// ============================================================
// TIPOS PRINCIPAIS — Compasso
// ============================================================

// Registro (momento de uso)
export interface Registro {
  id: string;
  timestamp: number;
  data: Date;
  metodo: 'vapor' | 'flor' | 'extracao' | 'outro';
  intencao: 'paz' | 'foco' | 'social' | 'descanso' | 'criatividade' | 'outro';
  intensidade: 'leve' | 'media' | 'alta';
  humorAntes?: number;
  humorDepois?: number;
  notas?: string;
  localizacao?: string;
  companhia?: string[];
  duracao?: number;
}

export interface EntradaRegistro {
  metodo: Registro['metodo'];
  intencao: Registro['intencao'];
  intensidade: Registro['intensidade'];
  humorAntes?: number;
  humorDepois?: number;
  notas?: string;
  localizacao?: string;
  companhia?: string[];
  duracao?: number;
}

export interface FiltroRegistro {
  dataInicial?: number;
  dataFinal?: number;
  limite?: number;
}

// Pausa de compasso
export interface Pausa {
  id: string;
  iniciadoEm: number;
  duracaoPlanejada: number;
  duracaoReal?: number;
  status: 'ativa' | 'concluida' | 'interrompida';
  valorEconomia: number;
  notas?: string;
  motivoEncerramento?: string;
}

export interface EntradaPausa {
  duracaoPlanejada: number;
  valorEconomia?: number;
  notas?: string;
}

export interface ProgressoPausa {
  decorridoMs: number;
  restanteMs: number;
  percentualConclusao: number;
  concluida: boolean;
}

export interface EstatPausa {
  duracaoPlanejada: number;
  duracaoReal: number;
  economiaAcumulada: number;
  status: Pausa['status'];
}

// Dados de economia
export interface DadosEconomia {
  totalAcumulado: number;
  taxaDiaria: number;
  economiaUltimaPausa: number;
  projecao30Dias: number;
}

// Dados de ritmo
export interface DadosRitmo {
  frequencia7Dias: EntradaFrequencia[];
  frequencia30Dias: EntradaFrequencia[];
  tendencia: 'aumentando' | 'diminuindo' | 'estavel';
}

export interface EntradaFrequencia {
  data: string;
  quantidade: number;
}

// Configurações
export interface Configuracoes {
  valorEconomia: number;
  moedaEconomia: 'BRL' | 'USD';
  tema: 'escuro' | 'claro';
  temaAuto: boolean;
  notificacoesAtivas: boolean;
  sonsAtivos: boolean;
  autoBackup14Dias: boolean;
  diasRetencaoDados?: number;
}

// Estado da UI
export interface EstadoUI {
  carregando: boolean;
  paginaAtual: 'principal' | 'registro' | 'pausa' | 'ritmo' | 'config';
  modal: { aberto: boolean; tipo?: string; dados?: unknown };
  avisos: Aviso[];
  barraAberta: boolean;
}

export interface Aviso {
  id: string;
  mensagem: string;
  tipo: 'sucesso' | 'erro' | 'info' | 'aviso';
  duracao?: number;
}

// Estado Global da Aplicação
export interface EstadoApp {
  registros: Registro[];
  pausaAtiva: Pausa | null;
  historicoPausa: Pausa[];
  configuracoes: Configuracoes;
  ui: EstadoUI;
  metadados: {
    ultimaSincronizacao: number;
    versaoApp: string;
    criadoEm: number;
  };
}

export interface PersistenciaApp {
  registros: Registro[];
  pausas: Pausa[];
  configuracoes: Configuracoes;
  metadados: EstadoApp['metadados'];
}

export interface RegistroConfiguracao {
  chave: 'principal';
  valor: Configuracoes;
}

export interface BackupLocal {
  id?: number;
  criadoEm: number;
  dados: PersistenciaApp;
  versaoApp: string;
}

// Tipos para Ações do Redutor
export type AcaoApp =
  | { tipo: 'ADICIONAR_REGISTRO'; payload: Registro }
  | { tipo: 'ATUALIZAR_REGISTRO'; payload: Registro }
  | { tipo: 'DELETAR_REGISTRO'; payload: string }
  | { tipo: 'LISTAR_REGISTROS'; payload: Registro[] }
  | { tipo: 'INICIAR_PAUSA'; payload: Pausa }
  | { tipo: 'ENCERRAR_PAUSA'; payload: Pausa }
  | { tipo: 'DEFINIR_CONFIGURACAO'; payload: Partial<Configuracoes> }
  | { tipo: 'ALTERNAR_TEMA' }
  | { tipo: 'MOSTRAR_AVISO'; payload: Aviso }
  | { tipo: 'ESCONDER_AVISO'; payload: string }
  | { tipo: 'DEFINIR_CARREGANDO'; payload: boolean }
  | { tipo: 'REIDRATAR_ESTADO'; payload: EstadoApp };
