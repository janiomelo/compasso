import { BrowserRouter as Roteador, Routes, Route } from 'react-router-dom'
import { useApp } from './ganchos'
import { ProvedorApp } from './loja/ContextoApp'
import { PaginaPrincipal, PaginaRegistro, PaginaPausa } from './paginas'
import './App.scss'

const PaginaRitmo = () => <div className="pagina">
  <h2>Ritmo & Análise</h2>
  <p>Dashboard de ritmo em construção.</p>
</div>

const PaginaConfig = () => <div className="pagina">
  <h2>Configurações</h2>
  <p>Painel de configurações em construção.</p>
</div>

const ConteudoApp = () => {
  const { estado } = useApp()

  if (estado.ui.carregando) {
    return (
      <div className="app app--bootstrapando">
        <main className="principal principal--bootstrapando">
          <section className="estado-bootstrap">
            <h1>Carregando seu Compasso</h1>
            <p>Reidratando registros, pausas e configurações salvas neste dispositivo.</p>
          </section>
        </main>
      </div>
    )
  }

  return (
    <Roteador>
      <div className="app">
        <header className="cabecalho">
          <h1>🧭 Compasso</h1>
          <nav className="nav-desktop">
            <a href="/">Principal</a>
            <a href="/registro">Registrar</a>
            <a href="/pausa">Pausa</a>
            <a href="/ritmo">Ritmo</a>
            <a href="/config">Config</a>
          </nav>
        </header>

        <main className="principal">
          <Routes>
            <Route path="/" element={<PaginaPrincipal />} />
            <Route path="/registro" element={<PaginaRegistro />} />
            <Route path="/pausa" element={<PaginaPausa />} />
            <Route path="/ritmo" element={<PaginaRitmo />} />
            <Route path="/config" element={<PaginaConfig />} />
          </Routes>
        </main>

        <nav className="nav-movel">
          <a href="/">Principal</a>
          <a href="/pausa">Pausa</a>
          <a href="/ritmo">Ritmo</a>
          <a href="/config">Config</a>
        </nav>
      </div>
    </Roteador>
  )
}

function App() {
  return (
    <ProvedorApp>
      <ConteudoApp />
    </ProvedorApp>
  )
}

export default App
