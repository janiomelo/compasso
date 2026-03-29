import { Activity, Home, PauseCircle, PlusCircle, Settings2 } from 'lucide-react'
import { FormEvent, lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { BrowserRouter as Roteador, NavLink, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom'
import { useApp, useTelemetria } from './ganchos'
import { useProteção } from './ganchos/useProtecao'
import { ProvedorApp } from './loja/ContextoApp'
import { AvisoOffline } from './componentes/comum/AvisoOffline'
import './App.scss'

const PaginaPrincipal = lazy(async () => {
  const { PaginaPrincipal: P } = await import('./paginas/Principal/PaginaPrincipal')
  return { default: P }
})
const PaginaRegistro = lazy(async () => {
  const { PaginaRegistro: P } = await import('./paginas/Registro/PaginaRegistro')
  return { default: P }
})
const PaginaPausa = lazy(async () => {
  const { PaginaPausa: P } = await import('./paginas/Pausa/PaginaPausa')
  return { default: P }
})
const PaginaRitmo = lazy(async () => {
  const { PaginaRitmo: P } = await import('./paginas/Ritmo/PaginaRitmo')
  return { default: P }
})
const PaginaConfig = lazy(async () => {
  const { PaginaConfig: P } = await import('./paginas/Config/PaginaConfig')
  return { default: P }
})
const PaginaPrivacidadeTransparencia = lazy(async () => {
  const { PaginaPrivacidadeTransparencia: P } = await import(
    './paginas/PrivacidadeTransparencia/PaginaPrivacidadeTransparencia'
  )
  return { default: P }
})
const PaginaDadosLocaisSeguranca = lazy(async () => {
  const { PaginaDadosLocaisSeguranca: P } = await import(
    './paginas/DadosLocaisSeguranca/PaginaDadosLocaisSeguranca'
  )
  return { default: P }
})
const PaginaLicencasCreditos = lazy(async () => {
  const { PaginaLicencasCreditos: P } = await import(
    './paginas/LicencasCreditos/PaginaLicencasCreditos'
  )
  return { default: P }
})
const PaginaSobreProjeto = lazy(async () => {
  const { PaginaSobreProjeto: P } = await import('./paginas/SobreProjeto/PaginaSobreProjeto')
  return { default: P }
})
const PaginaOnboarding = lazy(async () => {
  const { PaginaOnboarding: P } = await import('./paginas/Onboarding/PaginaOnboarding')
  return { default: P }
})
const PaginaPrivacidade = lazy(async () => {
  const { PaginaPrivacidade: P } = await import('./paginas/Privacidade/PaginaPrivacidade')
  return { default: P }
})
const PaginaComoFunciona = lazy(async () => {
  const { PaginaComoFunciona: P } = await import('./paginas/ComoFunciona/PaginaComoFunciona')
  return { default: P }
})
const PaginaProjeto = lazy(async () => {
  const { PaginaProjeto: P } = await import('./paginas/Projeto/PaginaProjeto')
  return { default: P }
})
const PaginaTermos = lazy(async () => {
  const { PaginaTermos: P } = await import('./paginas/Termos/PaginaTermos')
  return { default: P }
})
const PaginaApoie = lazy(async () => {
  const { PaginaApoie: P } = await import('./paginas/Apoie/PaginaApoie')
  return { default: P }
})
const PaginaSaibaMaisTelemetria = lazy(async () => {
  const { PaginaSaibaMaisTelemetria: P } = await import(
    './paginas/SaibaMaisTelemetria/PaginaSaibaMaisTelemetria'
  )
  return { default: P }
})

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

const RotasAplicacao = ({ onboardingConcluido }: { onboardingConcluido: boolean }) => {
  const localizacao = useLocation()
  const { rastrearPageview } = useTelemetria()
  const rotasPublicas = new Set([
    '/privacidade',
    '/como-funciona',
    '/projeto',
    '/termos',
    '/sobre',
    '/apoie',
    '/telemtria',
  ])
  const emOnboarding = localizacao.pathname === '/onboarding'
  const emPaginaPublica = rotasPublicas.has(localizacao.pathname)
  const emModoRevisaoOnboarding =
    emOnboarding && new URLSearchParams(localizacao.search).get('revisar') === '1'

  const protegerRota = (elemento: JSX.Element) => {
    if (!onboardingConcluido) {
      return <Navigate to="/onboarding" replace />
    }

    return elemento
  }

  useEffect(() => {
    rastrearPageview(`${localizacao.pathname}${localizacao.search}`)
  }, [localizacao.pathname, localizacao.search, rastrearPageview])

  return (
    <div className="app">
      {!emOnboarding && !emPaginaPublica && (
        <header className="app-header">
          <div className="app-header__linha">
            <Link to="/" className="marca" aria-label="Ir para a página inicial do Compasso">
              <span className="marca__icone">
                <img src="/brand/compasso-navbar.svg" alt="" aria-hidden="true" />
              </span>
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
      )}

      {!emOnboarding && !emPaginaPublica && <AvisoOffline />}

      <main className={emOnboarding ? 'principal principal--onboarding' : 'principal'}>
        <Suspense
          fallback={
            <div className="principal principal--carregando" aria-live="polite" aria-label="Carregando página" />
          }
        >
          <Routes>
            <Route path="/privacidade" element={<PaginaPrivacidade />} />
            <Route path="/como-funciona" element={<PaginaComoFunciona />} />
            <Route path="/projeto" element={<PaginaProjeto />} />
            <Route path="/termos" element={<PaginaTermos />} />
            <Route path="/sobre" element={<Navigate to="/projeto" replace />} />
            <Route path="/apoie" element={<PaginaApoie />} />
            <Route path="/telemtria" element={<PaginaSaibaMaisTelemetria />} />

            <Route
              path="/onboarding"
              element={
                onboardingConcluido && !emModoRevisaoOnboarding
                  ? <Navigate to="/" replace />
                  : <PaginaOnboarding modoRevisao={emModoRevisaoOnboarding} />
              }
            />

            <Route path="/" element={protegerRota(<PaginaPrincipal />)} />
            <Route path="/registro" element={protegerRota(<PaginaRegistro />)} />
            <Route path="/pausa" element={protegerRota(<PaginaPausa />)} />
            <Route path="/ritmo" element={protegerRota(<PaginaRitmo />)} />
            <Route path="/config" element={protegerRota(<PaginaConfig />)} />
            <Route
              path="/config/privacidade-transparencia"
              element={protegerRota(<PaginaPrivacidadeTransparencia />)}
            />
            <Route
              path="/config/dados-locais-seguranca"
              element={protegerRota(<PaginaDadosLocaisSeguranca />)}
            />
            <Route
              path="/config/licencas-creditos"
              element={protegerRota(<PaginaLicencasCreditos />)}
            />
            <Route path="/config/sobre-projeto" element={protegerRota(<PaginaSobreProjeto />)} />
            <Route
              path="*"
              element={<Navigate to={onboardingConcluido ? '/' : '/onboarding'} replace />}
            />
          </Routes>
        </Suspense>
      </main>

    </div>
  )
}

const ConteudoApp = () => {
  const { estado } = useApp()
  const { desbloquear, bloquear } = useProteção()
  const onboardingConcluido = Boolean(estado.configuracoes.onboarding?.concluidoEm)
  const [senhaDesbloqueio, setSenhaDesbloqueio] = useState('')
  const [erroDesbloqueio, setErroDesbloqueio] = useState<string | null>(null)
  const [desbloqueando, setDesbloqueando] = useState(false)

  const protecaoExigeDesbloqueio =
    estado.configuracoes.protecaoAtiva &&
    !estado.protecao.desbloqueado &&
    onboardingConcluido

  const mensagemBloqueio = useMemo(() => {
    if (!estado.protecao.ultimoDesbloqueioEm) {
      return 'Digite sua senha para acessar seus dados locais.'
    }

    return 'O app foi bloqueado por inatividade. Digite sua senha para continuar.'
  }, [estado.protecao.ultimoDesbloqueioEm])

  const tentarDesbloquear = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()

    if (!senhaDesbloqueio) {
      setErroDesbloqueio('Informe a senha para desbloquear.')
      return
    }

    try {
      setErroDesbloqueio(null)
      setDesbloqueando(true)
      await desbloquear(senhaDesbloqueio)
      setSenhaDesbloqueio('')
    } catch (erro) {
      setErroDesbloqueio(erro instanceof Error ? erro.message : 'Não foi possível desbloquear agora.')
    } finally {
      setDesbloqueando(false)
    }
  }

  useEffect(() => {
    const mediaTema = window.matchMedia('(prefers-color-scheme: light)')

    const aplicarTema = () => {
      const temaPreferidoSistema = mediaTema.matches ? 'claro' : 'escuro'
      const temaAtivo = estado.configuracoes.temaAuto ? temaPreferidoSistema : estado.configuracoes.tema

      document.body.classList.toggle('tema-claro', temaAtivo === 'claro')
      document.body.setAttribute('data-tema-ativo', temaAtivo)
    }

    aplicarTema()

    mediaTema.addEventListener('change', aplicarTema)

    return () => {
      mediaTema.removeEventListener('change', aplicarTema)
    }
  }, [estado.configuracoes.tema, estado.configuracoes.temaAuto])

  useEffect(() => {
    if (!onboardingConcluido) {
      return
    }

    if (!estado.configuracoes.protecaoAtiva || !estado.protecao.desbloqueado) {
      return
    }

    if (estado.protecao.manterDesbloqueadoNestaSessao) {
      return
    }

    const timeoutMs = estado.configuracoes.timeoutBloqueio

    if (!timeoutMs || timeoutMs < 1000) {
      return
    }

    let timeoutId: ReturnType<typeof setTimeout> | null = null

    const reagendarBloqueio = () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      timeoutId = setTimeout(() => {
        bloquear()
      }, timeoutMs)
    }

    const eventosAtividade: Array<keyof WindowEventMap> = [
      'mousemove',
      'mousedown',
      'keydown',
      'touchstart',
      'scroll',
    ]

    eventosAtividade.forEach((nomeEvento) => {
      window.addEventListener(nomeEvento, reagendarBloqueio, { passive: true })
    })

    reagendarBloqueio()

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      eventosAtividade.forEach((nomeEvento) => {
        window.removeEventListener(nomeEvento, reagendarBloqueio)
      })
    }
  }, [
    bloquear,
    estado.configuracoes.protecaoAtiva,
    estado.configuracoes.timeoutBloqueio,
    estado.protecao.desbloqueado,
    estado.protecao.manterDesbloqueadoNestaSessao,
    onboardingConcluido,
  ])

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
      <RotasAplicacao onboardingConcluido={onboardingConcluido} />

      {protecaoExigeDesbloqueio && (
        <div className="bloqueio-overlay" role="dialog" aria-modal="true" aria-labelledby="bloqueio-titulo">
          <section className="bloqueio-card">
            <p className="bloqueio-eyebrow">Proteção ativa</p>
            <h1 id="bloqueio-titulo">Desbloquear Compasso</h1>
            <p className="bloqueio-texto">{mensagemBloqueio}</p>

            <form className="bloqueio-form" onSubmit={(evento) => void tentarDesbloquear(evento)}>
              <label htmlFor="senha-desbloqueio">Senha</label>
              <input
                id="senha-desbloqueio"
                type="password"
                value={senhaDesbloqueio}
                onChange={(evento) => setSenhaDesbloqueio(evento.target.value)}
                autoComplete="current-password"
                placeholder="Digite sua senha"
              />

              {erroDesbloqueio && <p className="bloqueio-erro">{erroDesbloqueio}</p>}

              <button type="submit" disabled={desbloqueando}>
                {desbloqueando ? 'Desbloqueando...' : 'Desbloquear'}
              </button>
            </form>
          </section>
        </div>
      )}
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
