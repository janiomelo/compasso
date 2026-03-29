import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { mkdir, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { pathToFileURL } from 'node:url'
import {
  MANIFESTO_PAGINAS_PUBLICAS,
  URL_BASE_PUBLICA,
} from '../src/conteudo-publico/manifestoPaginasPublicas.ts'
import { ConteudoPrivacidade } from '../src/paginas/Privacidade/conteudo.tsx'
import { ConteudoComoFunciona } from '../src/paginas/ComoFunciona/conteudo.tsx'
import { ConteudoProjeto } from '../src/paginas/Projeto/conteudo.tsx'
import { ConteudoTermos } from '../src/paginas/Termos/conteudo.tsx'
import { ConteudoApoie } from '../src/paginas/Apoie/conteudo.tsx'
import { ConteudoSaibaMaisTelemetria } from '../src/paginas/SaibaMaisTelemetria/conteudo.tsx'

const DIRETORIO_PUBLICO_PADRAO = path.resolve(process.cwd(), 'public')

const COMPONENTES_CONTEUDO = {
  privacidade: ConteudoPrivacidade,
  'como-funciona': ConteudoComoFunciona,
  projeto: ConteudoProjeto,
  termos: ConteudoTermos,
  apoie: ConteudoApoie,
  telemetria: ConteudoSaibaMaisTelemetria,
}

const ESTILO_BASE = `
  :root {
    color-scheme: light;
    --cor-fundo: #f6f1e8;
    --cor-superficie: rgba(255, 252, 247, 0.92);
    --cor-texto: #1d1a17;
    --cor-texto-suave: #5f554a;
    --cor-borda: rgba(74, 57, 36, 0.16);
    --cor-destaque: #295446;
    --cor-destaque-contraste: #f8f7f2;
    --sombra: 0 24px 60px rgba(35, 23, 12, 0.12);
  }

  * {
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
  }

  body {
    margin: 0;
    min-height: 100vh;
    font-family: "Georgia", "Times New Roman", serif;
    background:
      radial-gradient(circle at top, rgba(41, 84, 70, 0.08), transparent 34%),
      linear-gradient(180deg, #fbf7ef 0%, #f4ecdf 100%);
    color: var(--cor-texto);
  }

  a {
    color: var(--cor-destaque);
  }

  main {
    width: min(100%, 72rem);
    margin: 0 auto;
    padding: 2rem 1rem 4rem;
  }

  .hero {
    display: grid;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .marca {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    width: fit-content;
    color: inherit;
    text-decoration: none;
  }

  .marca img {
    display: block;
    width: 2.5rem;
    height: 2.5rem;
  }

  .marca strong {
    font-size: 1.1rem;
    letter-spacing: 0.02em;
  }

  .topo {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    align-items: center;
    justify-content: space-between;
  }

  .topo p {
    margin: 0;
    max-width: 40rem;
    color: var(--cor-texto-suave);
    line-height: 1.6;
  }

  .botaoAbrir {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.85rem 1.15rem;
    border-radius: 999px;
    background: var(--cor-destaque);
    color: var(--cor-destaque-contraste);
    text-decoration: none;
    font-weight: 700;
    white-space: nowrap;
  }

  .cartao {
    background: var(--cor-superficie);
    border: 1px solid var(--cor-borda);
    border-radius: 1.5rem;
    padding: clamp(1.25rem, 2vw, 2rem);
    box-shadow: var(--sombra);
    backdrop-filter: blur(10px);
  }

  article {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    line-height: 1.8;
  }

  article h1,
  article h2,
  article h3 {
    line-height: 1.2;
    margin: 0;
  }

  article h1 {
    font-size: clamp(2rem, 4vw, 3.2rem);
  }

  article h2 {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--cor-borda);
    font-size: clamp(1.2rem, 2vw, 1.6rem);
  }

  article h3 {
    font-size: 1.05rem;
  }

  article p,
  article ul,
  article ol,
  article pre {
    margin: 0;
  }

  article ul,
  article ol {
    padding-left: 1.25rem;
  }

  article li + li {
    margin-top: 0.45rem;
  }

  article pre {
    padding: 0.9rem 1rem;
    border-radius: 1rem;
    background: rgba(41, 84, 70, 0.08);
    overflow-x: auto;
  }

  .rodape {
    margin-top: 1.5rem;
    color: var(--cor-texto-suave);
    font-size: 0.95rem;
  }

  @media (min-width: 768px) {
    main {
      padding-top: 3rem;
      padding-left: 1.5rem;
      padding-right: 1.5rem;
    }

    .hero {
      margin-bottom: 2rem;
    }
  }
`

const ENTRADA_INICIAL = {
  rota: '/',
  prioridade: 1,
  frequencia: 'weekly',
}

const escaparHtml = (valor) =>
  valor
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')

const resolverUrlAbsoluta = (valor) => new URL(valor, URL_BASE_PUBLICA).toString()

const slugDaRota = (rota) => rota.replace(/^\//, '')

const renderizarConteudo = (pagina) => {
  const ComponenteConteudo = COMPONENTES_CONTEUDO[pagina.id]

  return renderToStaticMarkup(
    createElement(
      StaticRouter,
      { location: pagina.rota },
      createElement(
        'main',
        null,
        createElement(
          'section',
          { className: 'hero' },
          createElement(
            'a',
            { className: 'marca', href: '/' },
            createElement('img', { src: '/brand/compasso-navbar.svg', alt: '', 'aria-hidden': 'true' }),
            createElement('strong', null, 'Compasso'),
          ),
          createElement(
            'div',
            { className: 'topo' },
            createElement(
              'p',
              null,
              'Página pública institucional do Compasso. O app principal continua disponível com privacidade local e funcionamento offline-first.',
            ),
            createElement('a', { className: 'botaoAbrir', href: '/' }, 'Abrir app'),
          ),
        ),
        createElement(
          'section',
          { className: 'cartao' },
          createElement('article', null, createElement(ComponenteConteudo)),
        ),
        createElement(
          'p',
          { className: 'rodape' },
          'Compasso. Conteúdo público entregue como HTML estático para melhorar abertura direta, indexação e preview.',
        ),
      ),
    ),
  )
}

const montarDocumentoHtml = (pagina, conteudoHtml) => {
  const titulo = escaparHtml(pagina.titulo)
  const descricao = escaparHtml(pagina.descricao)
  const canonical = escaparHtml(pagina.canonical)
  const imagemSocial = escaparHtml(resolverUrlAbsoluta(pagina.imagemSocial))
  const altImagemSocial = escaparHtml(pagina.altImagemSocial)
  const robots = pagina.indexavel ? 'index,follow' : 'noindex,nofollow'

  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#295446" />
    <meta name="description" content="${descricao}" />
    <meta name="robots" content="${robots}" />
    <meta property="og:locale" content="pt_BR" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Compasso" />
    <meta property="og:title" content="${titulo}" />
    <meta property="og:description" content="${descricao}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${imagemSocial}" />
    <meta property="og:image:alt" content="${altImagemSocial}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${titulo}" />
    <meta name="twitter:description" content="${descricao}" />
    <meta name="twitter:image" content="${imagemSocial}" />
    <link rel="icon" type="image/svg+xml" href="/brand/compasso-favicon.svg" />
    <link rel="manifest" href="/manifest.webmanifest" />
    <link rel="canonical" href="${canonical}" />
    <title>${titulo}</title>
    <style>${ESTILO_BASE}</style>
  </head>
  <body>
    ${conteudoHtml}
  </body>
</html>
`
}

export const gerarPaginaPublica = async (pagina, diretorioPublico) => {
  const diretorioPagina = path.join(diretorioPublico, slugDaRota(pagina.rota))
  const conteudoHtml = renderizarConteudo(pagina)
  const documentoHtml = montarDocumentoHtml(pagina, conteudoHtml)

  await rm(diretorioPagina, { recursive: true, force: true })
  await mkdir(diretorioPagina, { recursive: true })
  await writeFile(path.join(diretorioPagina, 'index.html'), documentoHtml, 'utf8')
}

export const gerarSitemap = async (diretorioPublico) => {
  const caminhoSitemap = path.join(diretorioPublico, 'sitemap.xml')
  const urls = [
    ENTRADA_INICIAL,
    ...MANIFESTO_PAGINAS_PUBLICAS.filter((pagina) => pagina.indexavel).map((pagina) => ({
      rota: pagina.rota,
      prioridade: pagina.prioridade,
      frequencia: pagina.frequencia,
    })),
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${escaparHtml(resolverUrlAbsoluta(url.rota))}</loc>
    <changefreq>${url.frequencia}</changefreq>
    <priority>${url.prioridade.toFixed(1)}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`

  await writeFile(caminhoSitemap, xml, 'utf8')
}

export const gerarArtefatosPublicos = async ({
  diretorioPublico = DIRETORIO_PUBLICO_PADRAO,
} = {}) => {
  await Promise.all(
    MANIFESTO_PAGINAS_PUBLICAS.map((pagina) => gerarPaginaPublica(pagina, diretorioPublico)),
  )
  await gerarSitemap(diretorioPublico)
}

const arquivoExecutado = process.argv[1]
const scriptFoiExecutadoDiretamente =
  typeof arquivoExecutado === 'string' && import.meta.url === pathToFileURL(arquivoExecutado).href

if (scriptFoiExecutadoDiretamente) {
  await gerarArtefatosPublicos()
}