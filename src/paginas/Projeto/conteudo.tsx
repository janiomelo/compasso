import { Link } from 'react-router-dom'

export const ConteudoProjeto = () => (
  <>
    <h1>Sobre e Transparência — Compasso</h1>

    <p>
      <strong>Última atualização:</strong> 23/03/2026
    </p>

    <h2>Por que o Compasso existe</h2>
    <p>
      O Compasso existe para apoiar autoconsciência e continuidade de hábitos com uma abordagem prática, local-first e sem julgamento.
    </p>

    <h2>O que o Compasso é</h2>
    <ul>
      <li>ferramenta pessoal de registro de ritmo, pausas e contexto de uso;</li>
      <li>produto orientado a autonomia, redução de danos e privacidade por padrão;</li>
      <li>projeto em evolução incremental, com documentação pública.</li>
    </ul>

    <h2>O que o Compasso não é</h2>
    <ul>
      <li>ferramenta clínica;</li>
      <li>substituto de acompanhamento profissional;</li>
      <li>plataforma de compra, venda ou intermediação de produtos;</li>
      <li>promessa de resultado terapêutico.</li>
    </ul>

    <h2>Valores do projeto</h2>
    <ul>
      <li>clareza acima de discurso vago;</li>
      <li>dados sob controle da pessoa usuária;</li>
      <li>proteção local por senha e criptografia em repouso como compromisso de privacidade por padrão;</li>
      <li>linguagem brasileira direta e respeitosa;</li>
      <li>transparência verificável em documentação e produto.</li>
    </ul>

    <h2>Quem mantém o projeto</h2>
    <p>
      <strong>Responsável atual:</strong> Janio Melo (janiomelo.dev)
    </p>
    <p>
      <strong>Canal de contato único:</strong> contato@compasso.digital
    </p>
    <p>
      <strong>Site oficial:</strong> https://compasso.digital
    </p>
    <p>
      <strong>Repositório oficial:</strong> https://github.com/janiomelo/compasso
    </p>

    <h2>Bio pública do mantenedor</h2>
    <p>
      Janio Melo. Com 10 anos de experiência no desenvolvimento de softwares comerciais, atua na criação de soluções tecnológicas para o terceiro setor e atualmente coordena a área de produtos na Mandua Tecnologia.
    </p>

    <h2>Financiamento e monetização</h2>

    <h3>Status atual:</h3>
    <ul>
      <li>projeto independente;</li>
      <li>sem monetização ativa nesta fase.</li>
    </ul>

    <h3>Direção futura (quando aplicável):</h3>
    <ul>
      <li>apoio/doações: [preencher quando existir]</li>
      <li>modelo pago: [preencher quando houver decisão]</li>
    </ul>

    <h2>Como verificar a transparência</h2>
    <ul>
      <li><Link to="/privacidade">Política de privacidade completa</Link></li>
      <li><Link to="/como-funciona">Dados locais e segurança</Link></li>
      <li><Link to="/termos">Termos de uso</Link></li>
      <li>Licenças e créditos: acesse em Configurações → Licenças e créditos</li>
      <li>Repositório do projeto: <a href="https://github.com/janiomelo/compasso" target="_blank" rel="noreferrer">github.com/janiomelo/compasso</a></li>
      <li>Notices de terceiros: acesse no repositório oficial</li>
    </ul>
  </>
)
