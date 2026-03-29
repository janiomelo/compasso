import { BookOpen, Boxes, ChevronLeft, FileBadge2, Github, Palette, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import styles from './pagina-licencas-creditos.module.scss'

const VENDORS = [
  ['React', 'MIT'],
  ['React DOM', 'MIT'],
  ['React Router DOM', 'MIT'],
  ['Lucide React', 'ISC'],
  ['Dexie', 'Apache-2.0'],
  ['Pako', 'MIT'],
  ['clsx', 'MIT'],
] as const

export const PaginaLicencasCreditos = () => {
  return (
    <div className={styles.pagina}>
      <Link to="/config" className={styles.voltar}>
        <ChevronLeft size={16} />
        <span>Voltar para Configurações</span>
      </Link>

      <header className={styles.topo}>
        <span className={styles.eyebrow}>Configurações</span>
        <h1 className={styles.titulo}>Licenças e créditos</h1>
        <p className={styles.subtitulo}>
          Resumo de origem visual e bibliotecas essenciais para contexto de uso nesta tela.
        </p>
      </header>

      <article className={styles.blocoLeitura}>
        <section className={styles.cartaoDestaque}>
          <div className={styles.cartaoTopo}>
            <Palette size={18} />
            <h2>Origem visual atual</h2>
          </div>
          <ul>
            <li>Ícones funcionais padronizados em Lucide.</li>
            <li>Símbolo de marca provisório preservado como SVG base e variantes de uso.</li>
            <li>Manifest, service worker e favicon já apontam para assets próprios.</li>
            <li>Não há CDN ou imagens remotas para assets de interface; telemetria Umami usa script externo opcional com consentimento.</li>
          </ul>
        </section>

        <section className={styles.cartao}>
          <div className={styles.cartaoTopo}>
            <BookOpen size={18} />
            <h2>Bibliotecas principais</h2>
          </div>
          <p>
            Esta tela exibe apenas bibliotecas essenciais de runtime/UI. A lista completa de terceiros fica no arquivo de notices.
          </p>

          <dl className={styles.listaLicencas}>
            {VENDORS.map(([nome, licenca]) => (
              <div key={nome}>
                <dt>{nome}</dt>
                <dd>{licenca}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className={styles.cartao}>
          <div className={styles.cartaoTopo}>
            <FileBadge2 size={18} />
            <h2>Notices e distribuição</h2>
          </div>
          <ul>
            <li>O projeto mantém o arquivo THIRD_PARTY_NOTICES.md como artefato público inicial.</li>
            <li>As licenças originais seguem disponíveis em node_modules/*/LICENSE*.</li>
            <li>Antes de release, revisar notices contra o lockfile vigente e manter esta página como resumo.</li>
          </ul>
        </section>

        <section className={styles.cartao}>
          <div className={styles.cartaoTopo}>
            <Boxes size={18} />
            <h2>Responsabilidade atual</h2>
          </div>
          <p>
            A marca provisória está sob responsabilidade de Janio Melo nesta fase. O repositório
            oficial e a documentação pública concentram o histórico verificável dessas decisões.
          </p>
        </section>

        <section className={styles.cartao}>
          <div className={styles.cartaoTopo}>
            <Github size={18} />
            <h2>Onde verificar</h2>
          </div>
          <ul>
            <li>
              <a href="https://github.com/janiomelo/compasso" target="_blank" rel="noreferrer">
                Repositório oficial do Compasso
              </a>
            </li>
            <li>
              <a
                href="https://github.com/janiomelo/compasso/blob/master/THIRD_PARTY_NOTICES.md"
                target="_blank"
                rel="noreferrer"
              >
                THIRD_PARTY_NOTICES.md
              </a>
            </li>
          </ul>
        </section>
      </article>
    </div>
  )
}