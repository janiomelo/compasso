import type { DadosEventoTelemetria, EventoTelemetria } from './eventos'

declare global {
  interface Window {
    umami?: {
      track: (nomeEvento: string, dados?: DadosEventoTelemetria) => void
    }
  }
}

const ID_SCRIPT_UMAMI = 'compasso-umami-script'
const URL_SCRIPT_UMAMI = 'https://cloud.umami.is/script.js'

let umamiInicializado = false

const obterWebsiteId = () => import.meta.env.VITE_UMAMI_WEBSITE_ID as string | undefined

const scriptJaCarregado = () => document.getElementById(ID_SCRIPT_UMAMI) as HTMLScriptElement | null

const carregarScriptUmami = (websiteId: string) => {
  const scriptExistente = scriptJaCarregado()

  if (scriptExistente) {
    return
  }

  const script = document.createElement('script')
  script.id = ID_SCRIPT_UMAMI
  script.defer = true
  script.src = URL_SCRIPT_UMAMI
  script.setAttribute('data-website-id', websiteId)
  script.setAttribute('data-auto-track', 'false')

  document.head.appendChild(script)
}

export const iniciarUmami = (consentido: boolean) => {
  if (!consentido || umamiInicializado) {
    return
  }

  const websiteId = obterWebsiteId()

  if (!websiteId) {
    return
  }

  carregarScriptUmami(websiteId)
  umamiInicializado = true
}

export const rastrearEventoUmami = (evento: EventoTelemetria, dados?: DadosEventoTelemetria) => {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return
  }

  const rastreador = window.umami

  if (!rastreador) {
    return
  }

  rastreador.track(evento, dados)
}
