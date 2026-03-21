import { BrowserRouter as Roteador, Routes, Route } from 'react-router-dom'
import { useApp } from './ganchos'
import { ProvedorApp } from './loja/ContextoApp'
import './App.scss'

// Páginas (placeholder)
const PaginaPrincipal = () => <div className="pagina">
  <h1>🧭 Compasso — Bem-vindo</h1>
  <p>Acompanhe seu ritmo, pausas e equilíbrio com privacidade radical.</p>
  <p className="status-setup">Setup em progresso... Veja a Fase 1 no arquivo PROJETO WEB APP.md</p>
</div>

const PaginaRegistro = () => <div className="pagina">
  <h2>Registrar Momento</h2>
  <p>Formulário de registro em construção.</p>
</div>

const PaginaPausa = () => <div className="pagina">
  <h2>Pausa de Compasso</h2>
  <p>Tela de pausa em construção.</p>
</div>

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
