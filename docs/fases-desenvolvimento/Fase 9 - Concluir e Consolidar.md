# Fase 9 — Concluir e Consolidar

> **Status:** Planejado  
> **Data de início prevista:** Após conclusão da Fase 8  
> **Objetivo:** Fechar o MVP com qualidade, documentação e infraestrutura prontos para o lançamento da Fase 10. Sem novas features de produto.

---

## 1. Objetivo da fase

A Fase 9 existe para fechar o que está aberto antes de lançar, não para adicionar funcionalidade nova. A regra central é: **se não é necessário para lançar com qualidade, fica para depois da Fase 10.**

Ao concluir esta fase, o produto deve estar:

- ✅ Com cobertura de testes atingindo os thresholds mínimos
- ✅ Com documentação para agentes unificada e não-conflitante
- ✅ Com documentação pública dentro da aplicação revisada e atualizada
- ✅ Com checklist de release completo e validado
- ✅ Com pipeline de deploy confiável e reproduzível
- ✅ Sem decisões arquiteturais abertas que bloqueiem o lançamento

---

## 2. O que não entra nesta fase

Para manter o foco, são explicitamente excluídas:

- ❌ Novas features de produto (registros, pausas, ritmo, etc.)
- ❌ Telemetria avançada (funis, AB tests, segmentação)
- ❌ Compartilhamento de dados entre usuários
- ❌ Sincronização via cloud ou backend
- ❌ Refatorações técnicas não urgentes

---

## 3. Itens priorizados

| ID | Tipo | Prioridade | Esforço | Dependências | Critério de pronto |
|---|---|---|---|---|---|
| F9-01 | docs | alta | média | — | Documentação para agentes unificada (ver Fase 9.1) |
| F9-02 | test | alta | alta | — | Cobertura de testes ≥ thresholds (type-check + lint + coverage passam) |
| F9-03 | chore | alta | baixa | — | Checklist de release revisado e atualizado para Fase 10 |
| F9-04 | chore | alta | baixa | F9-01 | `.github/instructions/product.instructions.md` sincronizado com ADR-002 |
| F9-05 | docs | média | baixa | — | `docs/DECISOES-EM-ABERTO.md` sem decisões bloqueadoras em aberto |
| F9-06 | chore | média | média | — | Pipeline de deploy conferido e documentado |
| F9-07 | a11y | média | média | — | Revisão de acessibilidade básica (WCAG AA nas telas principais) |
| F9-08 | perf | baixa | baixa | — | Revisão de performance (LCP, bundle size, lazy loading) |
| F9-09 | docs | baixa | baixa | F9-01, F9-02 | README.md final revisado com status "pronto para lançamento" |

---

## 4. Ordem recomendada

1. **F9-01** — Unificar documentação para agentes (base para tudo que vem depois)
2. **F9-04** — Sincronizar `.github/instructions/` com decisões atuais
3. **F9-02** — Fechar gaps de cobertura de testes
4. **F9-05** — Limpar decisões em aberto
5. **F9-03** — Revisar checklist de release
6. **F9-06** — Conferir pipeline de deploy
7. **F9-07 + F9-08** — Revisões de qualidade (acessibilidade e performance)
8. **F9-09** — README final pronto para lançamento

---

## 5. Critério de saída da fase

A Fase 9 está concluída quando:

- [ ] `npm run type-check && npm run lint && npm run build && npm run coverage` passam sem erros
- [ ] Toda documentação para agentes está unificada (ver Fase 9.1)
- [ ] Nenhuma decisão em aberto bloqueia o lançamento
- [ ] Checklist de release da Fase 10 está pronto
- [ ] Deploy manual funcionário para ambiente de produção

---

## 6. Referências

- [Fase 8 - Backlog Priorizado](Fase%208%20-%20Backlog%20Priorizado.md)
- [Fase 9.1 - Unificar Documentação para Agentes](Fase%209.1%20-%20Unificar%20Documentação%20para%20Agentes.md)
- [docs/DECISOES-EM-ABERTO.md](../DECISOES-EM-ABERTO.md)
- [docs/agents/README.md](../agents/README.md)
