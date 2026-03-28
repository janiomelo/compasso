import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { registrarServiceWorker } from './pwa/registrarServiceWorker'
import './estilos/globals.scss'

const CHAVE_RETORNO_404 = 'compasso.retorno404'

const restaurarRotaApos404 = () => {
  const rotaSalva = sessionStorage.getItem(CHAVE_RETORNO_404)

  if (!rotaSalva) {
    return
  }

  sessionStorage.removeItem(CHAVE_RETORNO_404)

  const rotaAtual = `${window.location.pathname}${window.location.search}${window.location.hash}`
  if (rotaSalva === rotaAtual) {
    return
  }

  window.history.replaceState(null, '', rotaSalva)
}

restaurarRotaApos404()

registrarServiceWorker()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
