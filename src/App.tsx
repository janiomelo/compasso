import { Activity, Home, PauseCircle, PlusCircle, Settings2 } from 'lucide-react'
import { useEffect } from 'react'
import { BrowserRouter as Roteador, NavLink, Routes, Route, Link } from 'react-router-dom'
import { useApp } from './ganchos'
import { ProvedorApp } from './loja/ContextoApp'
import { PaginaPrincipal, PaginaRegistro, PaginaPausa, PaginaRitmo, PaginaConfig } from './paginas'
import { AvisoOffline } from './componentes/comum/AvisoOffline'
import './App.scss'

type ItemNavegacao = {
  para: string
  rotulo: string
  icone: typeof Home
  fim?: boolean
}

const NAVEGACAO: ItemNavegacao[] = [
  { para: '/', rotulo: 'Início', icone: Home, fim: true },
  { para: '/registro', rotulo: 'Registrar', icone: PlusCircle },
  { para: '/pausa', rotulo: 'Pausa', icone: PauseCircle },
  { para: '/ritmo', rotulo: 'Ritmo', icone: Activity },
]

const ConteudoApp = () => {
  const { estado } = useApp()

  useEffect(() => {
    const temaPreferidoSistema = window.matchMedia('(prefers-color-scheme: light)').matches ? 'claro' : 'escuro'
    const temaAtivo = estado.configuracoes.temaAuto ? temaPreferidoSistema : estado.configuracoes.tema
    document.body.classList.toggle('tema-claro', temaAtivo === 'claro')
  }, [estado.configuracoes.tema, estado.configuracoes.temaAuto])

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
        <header className="app-header">
          <div className="app-header__linha">
            <Link to="/" className="marca" aria-label="Ir para a página inicial do Compasso">
              <span className="marca__icone" aria-hidden="true">🧭</span>
              <span className="marca__texto">Compasso</span>
            </Link>

            <nav className="app-nav" aria-label="Navegação principal">
              {NAVEGACAO.map((item) => {
                const Icone = item.icone

                return (
                  <NavLink
                    key={item.para}
                    to={item.para}
                    end={item.fim ?? false}
                    className={({ isActive }) =>
                      'app-nav__link' + (isActive ? ' app-nav__link--ativa' : '')
                    }
                  >
                    <Icone size={16} strokeWidth={2} />
                    <span>{item.rotulo}</span>
                  </NavLink>
                )
              })}
            </nav>

            <NavLink
              to="/config"
              className={({ isActive }) =>
                'app-header__atalho' + (isActive ? ' app-header__atalho--ativo' : '')
              }
              aria-label="Abrir configurações"
            >
              <Settings2 size={18} strokeWidth={2} />
            </NavLink>
          </div>
        </header>

        <AvisoOffline />

        <main className="principal">
          <Routes>
            <Route path="/" element={<PaginaPrincipal />} />
            <Route path="/registro" element={<PaginaRegistro />} />
            <Route path="/pausa" element={<PaginaPausa />} />
            <Route path="/ritmo" element={<PaginaRitmo />} />
            <Route path="/config" element={<PaginaConfig />} />
          </Routes>
        </main>
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
