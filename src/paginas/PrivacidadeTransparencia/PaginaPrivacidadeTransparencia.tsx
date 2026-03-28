import {
  ChevronLeft,
  BookOpen,
  FileText,
  Github,
  Lock,
  Scale,
  ShieldCheck,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import styles from './pagina-privacidade-transparencia.module.scss'

const URL_REPOSITORIO = 'https://github.com/janiomelo/compasso'
const URL_POLITICA = '/privacidade'
const URL_TERMOS = '/termos'

const LINKS = [
  {
    titulo: 'Política de Privacidade',
    descricao: 'Texto oficial completo sobre dados e privacidade nesta fase.',
    href: URL_POLITICA,
    externo: false,
    icone: Lock,
  },
  {
    titulo: 'Termos de Uso',
    descricao: 'Escopo do app, limites de uso e responsabilidades.',
    href: URL_TERMOS,
    externo: false,
    icone: Scale,
  },
  {
    titulo: 'Dados locais e segurança',
    descricao: 'Texto oficial sobre armazenamento local, backup e segurança.',
    href: '/como-funciona',
    externo: false,
    icone: ShieldCheck,
  },
  {
    titulo: 'Repositório do projeto',
    descricao: 'Código-fonte, histórico de mudanças e documentação pública do Compasso.',
    href: URL_REPOSITORIO,
    externo: true,
    icone: Github,
  },
  {
    titulo: 'Licenças e créditos',
    descricao: 'Origem dos assets, iconografia, notices e estado atual das dependências.',
    href: '/config/licencas-creditos',
    externo: false,
    icone: BookOpen,
  },
  {
    titulo: 'Sobre o projeto',
    descricao: 'Propósito, valores, mantenedor atual e contexto público do Compasso.',
    href: '/projeto',
    externo: false,
    icone: FileText,
  },
] as const

export const PaginaPrivacidadeTransparencia = () => {
  return (
    <div className={styles.pagina}>
      <Link to="/config" className={styles.voltar}>
        <ChevronLeft size={16} />
        <span>Voltar para Configurações</span>
      </Link>

      <header className={styles.topo}>
        <span className={styles.eyebrow}>Configurações</span>
        <h1 className={styles.titulo}>Privacidade e transparência</h1>
        <p className={styles.subtitulo}>
          Resumo curto com atalhos para os textos oficiais e fontes públicas do projeto.
        </p>
      </header>

      <section className={styles.resumo}>
        <div className={styles.resumoIcone}>
          <ShieldCheck size={24} />
        </div>
        <div>
          <h2>Resumo rápido</h2>
          <p>
            Seus dados ficam neste dispositivo por padrão. O Compasso não exige conta nesta fase e
            oferece proteção local com criptografia em repouso quando ativada.
          </p>
        </div>
      </section>

      <section className={styles.secaoLinks}>
        <div className={styles.secaoTopo}>
          <FileText size={18} />
          <h2>Documentos e referências</h2>
        </div>

        <div className={styles.gradeLinks}>
          {LINKS.map((item) => {
            const Icone = item.icone

            if (item.externo) {
              return (
                <a
                  key={item.titulo}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.linkCard}
                >
                  <span className={styles.linkCardIcone}>
                    <Icone size={18} />
                  </span>
                  <span className={styles.linkCardTexto}>
                    <strong>{item.titulo}</strong>
                    <small>{item.descricao}</small>
                  </span>
                </a>
              )
            }

            return (
              <Link key={item.titulo} to={item.href} className={styles.linkCard}>
                <span className={styles.linkCardIcone}>
                  <Icone size={18} />
                </span>
                <span className={styles.linkCardTexto}>
                  <strong>{item.titulo}</strong>
                  <small>{item.descricao}</small>
                </span>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}