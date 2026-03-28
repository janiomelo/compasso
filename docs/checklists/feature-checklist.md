# Checklist de feature

Use este checklist antes de considerar uma funcionalidade pronta para merge.

---

## Produto

- [ ] A funcionalidade está alinhada com os princípios do produto (`product-context.md`).
- [ ] Não viola privacidade por padrão (nenhum dado sai do dispositivo sem ação explícita).
- [ ] O tom e a linguagem da UI estão corretos (sem moralismo, sem julgamento, português correto).
- [ ] IDs técnicos não aparecem na interface.
- [ ] Se houver impacto em privacidade ou arquitetura: ADR criado e aprovado.

## Código

- [ ] Nomes de componentes, hooks e funções de domínio em português.
- [ ] Nenhum componente com mais de uma responsabilidade bem definida.
- [ ] Nenhum acesso direto a `bd` (Dexie) nos componentes — sempre via serviço ou hook.
- [ ] Nenhum `console.log` permanente.
- [ ] Nenhum `any` sem comentário justificando.
- [ ] Sem estilos inline. Sem `!important`.
- [ ] Se for nova página: registrada em `App.tsx` com lazy loading e exportada em `src/paginas/index.ts`.

## UI e estilos

- [ ] Funciona em 375px de largura (mobile-first).
- [ ] Hierarquia de títulos correta (h1 → h2 → h3).
- [ ] Botões usam verbo no infinitivo.
- [ ] Mensagens de confirmação explicam a consequência.
- [ ] Sem backticks ou notação de código no texto visível.
- [ ] Página filha tem link de retorno no topo com `ChevronLeft`.
- [ ] Ícones verificados como disponíveis na versão instalada do lucide-react.

## Qualidade

- [ ] `npm run type-check` — sem erros.
- [ ] `npm run lint` — zero warnings.
- [ ] `npm run build` — sem erros.
- [ ] `npm run coverage` — thresholds atingidos.
- [ ] Testes escritos para: utilitários novos, serviços novos, fluxos críticos de UI.
- [ ] Casos de borda cobertos: banco vazio, dados legados, falha de operação.
- [ ] Nenhum teste em `skip` ou `only` commitado.

## Documentação

- [ ] Se for nova decisão arquitetural: ADR criado em `docs/decisions/`.
- [ ] Se for nova funcionalidade visível ao usuário: documentos de transparência atualizados se necessário.
- [ ] Arquitetura ou estrutura de pastas atualizada em `docs/agents/architecture.md` se houver mudança.
