import { BookOpen, ChevronLeft, Compass, FileText, Lock, Scale, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import styles from './pagina-sobre-projeto.module.scss'

const LINKS = [
  {
    titulo: 'Sobre e transparência (texto completo)',
    descricao: 'Propósito, valores, mantenedor e contexto público do projeto.',
    href: '/projeto',
    icone: FileText,
  },
  {
    titulo: 'Política de privacidade',
    descricao: 'Documento completo sobre tratamento de dados nesta fase.',
    href: '/privacidade',
    icone: Lock,
  },
  {
    titulo: 'Termos de uso',
    descricao: 'Escopo do app, limites e responsabilidades.',
    href: '/termos',
    icone: Scale,
  },
  {
    titulo: 'Dados locais e segurança',
    descricao: 'Como armazenamento local, backup e proteção funcionam.',
    href: '/como-funciona',
    icone: ShieldCheck,
  },
  {
    titulo: 'Licenças e créditos',
    descricao: 'Origem de assets, notices e bibliotecas desta fase.',
    href: '/config/licencas-creditos',
    icone: BookOpen,
  },
] as const

export const PaginaSobreProjeto = () => {
  return (
    <div className={styles.pagina}>
      <Link to="/config" className={styles.voltar}>
        <ChevronLeft size={16} />
        <span>Voltar para Configurações</span>
      </Link>

      <header className={styles.topo}>
        <span className={styles.eyebrow}>Configurações</span>
        <h1 className={styles.titulo}>Sobre o projeto</h1>
        <p className={styles.subtitulo}>
          Resumo rápido com links diretos para os textos oficiais do Compasso.
        </p>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroIcone}>
          <Compass size={24} />
        </div>
        <div>
          <h2>Resumo</h2>
          <p>
            O Compasso é um utilitário pessoal com foco em autonomia, privacidade por padrão e
            linguagem sem julgamento. Para leitura completa, use os links abaixo.
          </p>
        </div>
      </section>

      <article className={styles.blocoLeitura}>
        <section className={styles.secaoTexto}>
          <h2>Textos oficiais</h2>
          <ul>
            {LINKS.map((item) => {
              const Icone = item.icone

              return (
                <li key={item.titulo}>
                  <Link to={item.href}>
                    <Icone size={14} aria-hidden="true" /> {item.titulo}
                  </Link>
                  <p>{item.descricao}</p>
                </li>
              )
            })}
          </ul>
        </section>
      </article>
    </div>
  )
}