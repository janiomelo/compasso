# Checklist de release

Use este checklist antes de um release público ou entrega de milestone.

---

## Qualidade técnica

- [ ] Gate completo passando: `npm run type-check && npm run lint && npm run build && npm run coverage`.
- [ ] Todos os testes passando (sem `skip` ou `only`).
- [ ] Thresholds de cobertura atingidos (ver `vitest.config.ts`).
- [ ] Nenhum erro ou warning de console no navegador (ambiente de produção simulado).
- [ ] Build de produção testado com `npm run preview`.

## UI e produto

- [ ] Validação manual das telas principais em mobile (375px).
- [ ] Validação manual em tema escuro e tema claro.
- [ ] Fluxo de Registro funcional end-to-end.
- [ ] Fluxo de Pausa funcional end-to-end.
- [ ] Exportação e importação de dados funcionais.
- [ ] Backup manual e restauração funcionais.
- [ ] Nenhum texto com erro de português, acento ou cedilha ausente.
- [ ] Nenhum ID técnico exposto na interface.

## Privacidade e segurança

- [ ] Nenhum dado enviado a servidor externo.
- [ ] Nenhum rastreador ou analytics externo presente.
- [ ] Todas as dependências com impacto em privacidade têm ADR aprovado.
- [ ] `docs/transparencia/` atualizado se houver mudança de comportamento relevante para o usuário.

## PWA

- [ ] Manifest correto (nome, ícones, cores).
- [ ] Service worker registrado e funcional.
- [ ] Funcionalidade básica disponível offline.
- [ ] `AvisoOffline` exibido corretamente quando sem conexão.

## Documentação

- [ ] `docs/agents/architecture.md` reflete o estado atual.
- [ ] `docs/agents/README.md` referencia todos os documentos existentes.
- [ ] ADRs de decisões desta fase criados e referenciados.
- [ ] `docs/PROJETO WEB APP.md` atualizado com o que foi concluído na fase.
- [ ] `README.md` (raiz) atualizado se houver mudança no mapa de documentação.

## Histórico

- [ ] Commits com mensagens descritivas e em português.
- [ ] Nenhum commit com gate falhando no histórico.
- [ ] Tag de versão criada após merge.
