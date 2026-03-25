# Dados Locais e Segurança — Compasso

Última atualização: 23/03/2026

## Objetivo

Explicar de forma direta como os dados são armazenados no dispositivo, quais operações de backup/importação existem e quais limites de segurança dependem do ambiente local.

## 1. Armazenamento local

Na fase atual do projeto, os dados do Compasso ficam no dispositivo/navegador da pessoa usuária.

Isso inclui, entre outros:

- registros de momentos;
- pausas e histórico de pausas;
- configurações de uso.

Quando proteção local está ativa, os dados principais de registros e pausas passam a ser gravados com criptografia em repouso.

## 1.1. Proteção por senha local

- a pessoa usuária pode ativar senha local no app;
- o desbloqueio é exigido após bloqueio manual ou inatividade;
- a senha não cria conta remota e não transfere dados para servidor.

## 2. Exportação, importação e restauração

Operações disponíveis no app:

- exportar arquivo de dados;
- importar arquivo;
- restaurar backup.

No estado atual, há suporte a pacote de exportação/importação criptografado, além do pacote plano.

Essas operações dependem de ação explícita da pessoa usuária.

## 3. Backup

- backup manual pode ser gerado no app;
- backups podem ser exportados em formato criptografado quando proteção/senha estiver ativa;
- backups exportados passam a depender do local onde forem guardados (dispositivo, pasta sincronizada, nuvem pessoal, etc.).

## 4. Apagar dados

A exclusão local deve ser tratada como ação clara e acessível no app.

Quando executada, remove os dados salvos localmente no ambiente atual.

## 5. Limites de segurança

O Compasso adota boas práticas proporcionais ao estágio atual, mas não promete segurança absoluta.

A proteção real também depende de:

- segurança do dispositivo;
- segurança do navegador;
- configurações do sistema operacional;
- cuidado com arquivos exportados.

Mesmo com proteção local, não há promessa de segurança absoluta.

## 6. Transparência no produto

Sempre que possível, o app deve mostrar de forma simples:

- o que está salvo localmente;
- quando houve exportação/restauração;
- como apagar dados locais.

## 7. Referências

- Política de privacidade resumida: `docs/transparencia/POLITICA-DE-PRIVACIDADE.md`
- Política de privacidade completa: `docs/transparencia/POLITICA-DE-PRIVACIDADE-COMPLETA.md`
- Origem de assets e licenças: `docs/transparencia/assets-e-licencas.md`
- Notices de terceiros: `THIRD_PARTY_NOTICES.md`
