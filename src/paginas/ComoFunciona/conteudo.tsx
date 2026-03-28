import { Link } from 'react-router-dom'

export const ConteudoComoFunciona = () => (
  <>
    <h1>Dados Locais e Segurança — Compasso</h1>

    <p>
      <strong>Última atualização:</strong> 23/03/2026
    </p>

    <h2>Objetivo</h2>
    <p>
      Explicar de forma direta como os dados são armazenados no dispositivo, quais operações de backup/importação existem e quais limites de segurança dependem do ambiente local.
    </p>

    <h2>1. Armazenamento local</h2>
    <p>
      Na fase atual do projeto, os dados do Compasso ficam no dispositivo/navegador da pessoa usuária.
    </p>
    <p>
      Isso inclui, entre outros:
    </p>
    <ul>
      <li>registros de momentos;</li>
      <li>pausas e histórico de pausas;</li>
      <li>configurações de uso.</li>
    </ul>
    <p>
      Quando proteção local está ativa, os dados principais de registros e pausas passam a ser gravados com criptografia em repouso.
    </p>

    <h2>1.1. Proteção por senha local</h2>
    <ul>
      <li>a pessoa usuária pode ativar senha local no app;</li>
      <li>o desbloqueio é exigido após bloqueio manual ou inatividade;</li>
      <li>a senha não cria conta remota e não transfere dados para servidor.</li>
    </ul>

    <h2>2. Exportação, importação e restauração</h2>
    <p>
      Operações disponíveis no app:
    </p>
    <ul>
      <li>exportar arquivo de dados;</li>
      <li>importar arquivo;</li>
      <li>restaurar backup.</li>
    </ul>
    <p>
      No estado atual, há suporte a pacote de exportação/importação criptografado, além do pacote plano.
    </p>
    <p>
      Essas operações dependem de ação explícita da pessoa usuária.
    </p>

    <h2>3. Backup</h2>
    <ul>
      <li>backup manual pode ser gerado no app;</li>
      <li>backups podem ser exportados em formato criptografado quando proteção/senha estiver ativa;</li>
      <li>backups exportados passam a depender do local onde forem guardados (dispositivo, pasta sincronizada, nuvem pessoal, etc.).</li>
    </ul>

    <h2>4. Apagar dados</h2>
    <p>
      A exclusão local deve ser tratada como ação clara e acessível no app.
    </p>
    <p>
      Quando executada, remove os dados salvos localmente no ambiente atual.
    </p>

    <h2>5. Limites de segurança</h2>
    <p>
      O Compasso adota boas práticas proporcionais ao estágio atual, mas não promete segurança absoluta.
    </p>
    <p>
      A proteção real também depende de:
    </p>
    <ul>
      <li>segurança do dispositivo;</li>
      <li>segurança do navegador;</li>
      <li>configurações do sistema operacional;</li>
      <li>cuidado com arquivos exportados.</li>
    </ul>
    <p>
      Mesmo com proteção local, não há promessa de segurança absoluta.
    </p>

    <h2>6. Transparência no produto</h2>
    <p>
      Sempre que possível, o app deve mostrar de forma simples:
    </p>
    <ul>
      <li>o que está salvo localmente;</li>
      <li>quando houve exportação/restauração;</li>
      <li>como apagar dados locais.</li>
    </ul>

    <h2>7. Referências</h2>
    <ul>
      <li><Link to="/privacidade">Política de privacidade completa</Link></li>
      <li><Link to="/projeto">Sobre o projeto e valores</Link></li>
      <li>Licenças e créditos: acesse em Configurações → Licenças e créditos</li>
    </ul>
  </>
)
