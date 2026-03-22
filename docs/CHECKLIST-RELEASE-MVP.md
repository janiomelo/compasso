# Checklist de Release MVP

Data base: 22/03/2026
Uso: preencher antes de cada release para branch principal.

## 1. Qualidade de codigo

- [ ] `npm run type-check` sem erros
- [ ] `npm run lint` sem erros
- [ ] `npm run build` sem erros
- [ ] `npm run coverage` sem falhar thresholds
- [ ] Nenhum arquivo alterado sem commit

## 2. Testes e comportamento

- [ ] Fluxo de registro validado manualmente
- [ ] Fluxo de pausa validado manualmente
- [ ] Fluxo de ritmo/analytics validado manualmente
- [ ] Fluxo de backup/export/import validado manualmente
- [ ] Validacao rapida em mobile (viewport pequeno)
- [ ] Validacao rapida em desktop (viewport amplo)

## 3. PWA e offline

- [ ] Manifest carregando corretamente
- [ ] Service worker registrado
- [ ] Aviso offline renderiza quando `navigator.onLine = false`
- [ ] App continua funcional para leitura de dados offline

## 4. Dados e seguranca

- [ ] Importacao rejeita arquivo invalido/corrompido
- [ ] Restauracao nao quebra estado local
- [ ] Nenhum dado sensivel exposto em URL
- [ ] Politicas de validacao de entrada mantidas

## 5. Acessibilidade minima

- [ ] Botoes e inputs com rotulos claros
- [ ] Navegacao por teclado (Tab/Enter/Escape) funcional nas telas principais
- [ ] Contraste visual aceitavel (WCAG AA como referencia)
- [ ] Estados de foco visiveis

## 6. Documentacao

- [ ] `README.md` atualizado se houver mudanca de onboarding
- [ ] `docs/PROJETO WEB APP.md` atualizado com estado real da fase
- [ ] Mudancas de produto refletidas em `docs/FUNDAMENTOS-PRODUTO.md` (quando aplicavel)
- [ ] Changelog/release notes preparados (resumo curto)

## 7. Publicacao

- [ ] Tag de release definida
- [ ] Release notes publicadas
- [ ] Pos-release smoke test concluido

## 8. Registro da execucao

- Data:
- Responsavel:
- Commit base:
- Resultado final: `aprovado` / `reprovado`
- Observacoes:
