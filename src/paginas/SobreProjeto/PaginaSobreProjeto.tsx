import { ChevronLeft, Compass, HeartHandshake, Info, Shield, Sparkles, UserCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import styles from './pagina-sobre-projeto.module.scss'

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
          Origem, valores e responsabilidade pública do projeto nesta fase.
        </p>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroIcone}>
          <Compass size={24} />
        </div>
        <div>
          <h2>Por que ele existe</h2>
          <p>
            O Compasso existe para apoiar autoconsciência e continuidade de hábitos com uma
            abordagem prática, local-first e sem julgamento.
          </p>
        </div>
      </section>

      <article className={styles.blocoLeitura}>
        <section className={styles.secaoTexto}>
          <div className={styles.cartaoTopo}>
            <Info size={18} />
            <h2>O que o Compasso é</h2>
          </div>
          <ul>
            <li>Ferramenta pessoal de registro de ritmo, pausas e contexto de uso.</li>
            <li>Produto orientado a autonomia, redução de danos e privacidade por padrão.</li>
            <li>Projeto em evolução incremental, com documentação pública.</li>
          </ul>
        </section>

        <section className={styles.secaoTexto}>
          <div className={styles.cartaoTopo}>
            <Shield size={18} />
            <h2>O que o Compasso não é</h2>
          </div>
          <ul>
            <li>Não é ferramenta clínica.</li>
            <li>Não substitui acompanhamento profissional.</li>
            <li>Não intermedeia compra, venda ou produtos.</li>
            <li>Não promete resultado terapêutico.</li>
          </ul>
        </section>

        <section className={styles.secaoTexto}>
          <div className={styles.cartaoTopo}>
            <Sparkles size={18} />
            <h2>Valores do projeto</h2>
          </div>
          <ul>
            <li>Clareza acima de discurso vago.</li>
            <li>Dados sob controle da pessoa usuária.</li>
            <li>Proteção local por senha e criptografia em repouso como compromisso de privacidade.</li>
            <li>Linguagem brasileira direta e respeitosa.</li>
            <li>Transparência verificável em documentação e produto.</li>
          </ul>
        </section>

        <section className={styles.secaoTexto}>
          <div className={styles.cartaoTopo}>
            <UserCircle2 size={18} />
            <h2>Quem mantém o projeto</h2>
          </div>
          <p>
            <strong>Janio Melo</strong>, identificado publicamente como janiomelo.dev, é o responsável atual pelo projeto.
          </p>
          <p>
            Canal oficial: <a href="mailto:contato@compasso.digital">contato@compasso.digital</a>
          </p>
          <p>
            Site: <a href="https://compasso.digital" target="_blank" rel="noreferrer">compasso.digital</a>
          </p>
        </section>

        <section className={styles.secaoTexto}>
          <div className={styles.cartaoTopo}>
            <HeartHandshake size={18} />
            <h2>Financiamento nesta fase</h2>
          </div>
          <ul>
            <li>Projeto independente.</li>
            <li>Sem monetização ativa nesta fase.</li>
            <li>Apoio/doações e modelo pago continuam em aberto para decisão futura.</li>
          </ul>
        </section>

        <section className={styles.secaoTexto}>
          <div className={styles.cartaoTopo}>
            <Compass size={18} />
            <h2>Responsável atual</h2>
          </div>
          <p>
            Janio Melo. Com 10 anos de experiência no desenvolvimento de softwares comerciais,
            atua na criação de soluções tecnológicas para o terceiro setor e atualmente coordena a
            área de produtos na Mandua Tecnologia.
          </p>
        </section>
      </article>
    </div>
  )
}