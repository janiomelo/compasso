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
const URL_POLITICA = 'https://github.com/janiomelo/compasso/blob/master/docs/transparencia/POLITICA-DE-PRIVACIDADE.md'
const URL_TERMOS = 'https://github.com/janiomelo/compasso/blob/master/docs/transparencia/TERMOS-DE-USO.md'

const LINKS = [
  {
    titulo: 'Política de Privacidade',
    descricao: 'Versão pública resumida do tratamento de dados e dos limites atuais do produto.',
    href: URL_POLITICA,
    externo: true,
    icone: Lock,
  },
  {
    titulo: 'Termos de Uso',
    descricao: 'Escopo do app, limites de uso e responsabilidades nesta fase do projeto.',
    href: URL_TERMOS,
    externo: true,
    icone: Scale,
  },
  {
    titulo: 'Dados locais e segurança',
    descricao: 'Página operacional com backup, proteção por senha, criptografia local e ações de dados.',
    href: '/config/dados-locais-seguranca',
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
    href: '/config/sobre-projeto',
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
          O essencial sobre dados, proteção local por senha e formas de verificação nesta fase do Compasso.
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

      <article className={styles.blocoLeitura}>
        <section className={styles.secaoTexto}>
          <h2>Hoje, o Compasso é</h2>
          <p>
            Um utilitário pessoal para registrar ritmo, pausas e contexto de uso, com foco em autonomia, privacidade por padrão e continuidade prática.
          </p>
        </section>

        <section className={styles.secaoTexto}>
          <h2>Hoje, o Compasso não é</h2>
          <ul>
            <li>Não é ferramenta clínica.</li>
            <li>Não substitui orientação profissional.</li>
            <li>Não intermedeia compra e venda.</li>
          </ul>
        </section>

        <section className={styles.secaoTexto}>
          <h2>Tratamento de dados nesta fase</h2>
          <ul>
            <li>Armazenamento local neste navegador e dispositivo.</li>
            <li>Proteção local por senha com bloqueio por inatividade.</li>
            <li>Criptografia em repouso de registros e pausas quando proteção está ativa.</li>
            <li>Exportação manual sob seu controle.</li>
            <li>Importação e restauração por ação explícita da pessoa usuária.</li>
            <li>Sem conta obrigatória nesta fase.</li>
          </ul>
        </section>

        <section className={styles.secaoTexto}>
          <h2>Como verificar</h2>
          <ul>
            <li>Projeto aberto com documentação pública.</li>
            <li>Política de privacidade e termos de uso acessíveis.</li>
            <li>Licenças, notices e créditos documentados.</li>
            <li>Repositório oficial disponível para consulta.</li>
          </ul>
        </section>

        <section className={styles.secaoTexto}>
          <h2>Contato e responsabilidade</h2>
          <p>
            Responsável atual pelo projeto: <strong>Janio Melo</strong>.
          </p>
          <p>
            Canal oficial: <a href="mailto:contato@compasso.digital">contato@compasso.digital</a>
          </p>
        </section>

        <section className={styles.secaoTexto}>
          <h2>Quando isso muda</h2>
          <p>
            Mudanças relevantes em armazenamento, sincronização, conta ou tratamento remoto de
            dados devem refletir em documentação pública e nas páginas de confiança do produto.
          </p>
        </section>
      </article>

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