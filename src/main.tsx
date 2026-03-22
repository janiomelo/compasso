import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { registrarServiceWorker } from './pwa/registrarServiceWorker'
import './estilos/globals.scss'

registrarServiceWorker()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
