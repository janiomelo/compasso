export type EventoTelemetria =
  | 'pageview'
  | 'clique_comece'
  | 'conclusao_onboarding'
  | 'iniciou_pausa'
  | 'registrou_momento'
  | 'alterou_consentimento_telemetria'

export type DadosEventoTelemetria = Record<string, string | number | boolean>
