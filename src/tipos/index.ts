// ============================================================
// TIPOS PRINCIPAIS — Compasso
// ============================================================

// Registro (momento de uso)
export interface Registro {
  id: string;
  timestamp: number;
  data: Date;
  metodo: 'vaporizado' | 'fumado' | 'comestivel' | 'outro';
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
  metodo?: Registro['metodo'];
  intencao?: Registro['intencao'];
  intensidade?: Registro['intensidade'];
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
  onboarding?: EstadoOnboarding;
  protecaoAtiva: boolean;
  timeoutBloqueio: number;
  manterDesbloqueadoNestaSessao: boolean;
  telemetria?: {
    consentido: boolean | null;
    atualizadoEm: number;
  };
}

export interface ItemChecklistPosOnboarding {
  id: 'dados-locais' | 'telemetria' | 'protecao-senha' | 'primeiro-registro';
  concluidoEm?: number;
}

export interface EstadoPosOnboarding {
  concluidoEm?: number; // Timestamp quando todos os itens foram marcados como concluídos
  intiniado?: number; // Timestamp quando o checklist foi primeiro mostrado
  checklist: ItemChecklistPosOnboarding[];
}

export interface EstadoOnboarding {
  concluidoEm: number;
  confirmouMaioridadeEm: number;
  aceitouTermosPrivacidadeEm: number;
  versaoTermos: string;
  versaoPolitica: string;
  posOnboarding?: EstadoPosOnboarding; // Nova sub-estrutura para pós-onboarding
}

// Estado da UI
export interface EstadoUI {
  carregando: boolean;
  modal: { aberto: boolean; tipo?: string; dados?: unknown };
  avisos: Aviso[];
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
  protecao: EstadoProteção;
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

export type OrigemBackup = 'automatico' | 'manual';

export interface BackupLocal {
  id?: number;
  criadoEm: number;
  dados: PersistenciaApp;
  versaoApp: string;
  origem: OrigemBackup;
}

// Tipos para Ações do Redutor
export type AcaoApp =
  | { tipo: 'ADICIONAR_REGISTRO'; payload: Registro }
  | { tipo: 'ATUALIZAR_REGISTRO'; payload: Registro }
  | { tipo: 'DELETAR_REGISTRO'; payload: string }
  | { tipo: 'SINCRONIZAR_DADOS_DESBLOQUEIO'; payload: { registros: Registro[]; historicoPausa: Pausa[]; pausaAtiva: Pausa | null } }
  | { tipo: 'INICIAR_PAUSA'; payload: Pausa }
  | { tipo: 'ENCERRAR_PAUSA'; payload: Pausa }
  | { tipo: 'CANCELAR_PAUSA' }
  | { tipo: 'DEFINIR_CONFIGURACAO'; payload: Partial<Configuracoes> }
  | { tipo: 'DEFINIR_CARREGANDO'; payload: boolean }
  | { tipo: 'REIDRATAR_ESTADO'; payload: EstadoApp }
  | { tipo: 'ATIVAR_PROTECAO'; payload: EstadoProteção }
  | { tipo: 'DESATIVAR_PROTECAO' }
  | { tipo: 'BLOQUEAR_APP' }
  | { tipo: 'DESBLOQUEAR_APP' };

// ============================================================
// PROTEÇÃO E SEGURANÇA
// ============================================================

/**
 * Metadados de proteção persistidos no banco
 * Não inclui a chave descriptografada (DEK) — fica em memória
 */
export interface MetadadosProteção {
  salt: string; // Base64: salt para KDF
  paramsKdf: ParametrosKDF;
  dekCriptografada: string; // Base64: DEK cifrada com KEK
  ivDek: string; // Base64: IV usado para cifrar a DEK
  tagDek: string; // Base64: tag de autenticação da DEK
  criptografiaDados: boolean;
  ativoDesdeEm: number; // timestamp de quando foi ativado
}

export interface RegistroProteção {
  chave: 'principal';
  valor: MetadadosProteção;
}

/**
 * Estado de proteção da aplicação em runtime
 */
export interface EstadoProteção {
  ativado: boolean;
  desbloqueado: boolean;
  ultimoDesbloqueioEm?: number;
  timeoutBloqueioMs: number; // ms de inatividade antes de bloquear
  manterDesbloqueadoNestaSessao: boolean;
}

/**
 * Parâmetros do algoritmo KDF
 * Permitir evolução (ex: de PBKDF2 para Argon2id no futuro)
 */
export interface ParametrosKDF {
  algoritmo: 'pbkdf2-sha256' | 'argon2id';
  // PBKDF2
  iteracoes?: number; // ex: 100000
  // Argon2id
  memoria?: number; // em KB
  paralelismo?: number;
  tempo?: number;
}

/**
 * Chave em memória durante a sessão
 * Nunca deve ser persistida
 */
export interface ChaveSessionProteção {
  dek: CryptoKey; // Data Encryption Key (AES-256)
  descartarEm: number; // timestamp quando deve limpar da memória
}
