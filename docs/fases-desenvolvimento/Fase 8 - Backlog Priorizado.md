# Fase 8 - Backlog Priorizado

Data: 22/03/2026
Status: Planejado
Escopo: consolidar hardening de producao, governanca de release e evolucao de produto.

## 1. Objetivo da fase

Transformar pendencias evolutivas da Fase 7 em entregas rastreaveis e testaveis, sem ampliar escopo alem do necessario para o MVP.

## 2. Itens priorizados

| ID | Tipo | Prioridade | Esforco | Dependencias | Criterio de pronto |
|---|---|---|---|---|---|
| F8-01 | chore | alta | baixa | nenhuma | CI roda `npm run coverage` e falha se threshold nao atingir o minimo |
| F8-02 | docs | alta | baixa | F8-01 | checklist de release criado e versionado em `docs/checklists/release-checklist.md` |
| F8-03 | docs | alta | baixa | nenhuma | decisoes abertas registradas com responsavel e prazo |
| F8-04 | feat | media | media | F8-01 | `public/robots.txt` e `public/sitemap.xml` publicados |
| F8-05 | feat | media | media | nenhuma | metadados base (title/description/og) revisados no `index.html` |
| F8-06 | feat | media | media | nenhuma | estrategia de observabilidade minima definida (erros e performance) |
| F8-07 | refactor | media | media | nenhuma | plano de acessibilidade com checklist WCAG AA aplicado nas telas principais |
| F8-08 | feat | baixa | alta | validacao de produto | definicao sobre sincronizacao opcional (sim/nao) e impacto arquitetural documentado |
| F8-09 | docs | baixa | media | nenhuma | manifesto de marca inicial publicado em `docs/` |
| F8-10 | feat | baixa | media | nenhuma | landing de validacao inicial definida (estrutura e proposta de valor) |

## 3. Ordem recomendada

1. F8-01 (gate de cobertura no CI)
2. F8-02 (checklist de release)
3. F8-03 (decisoes em aberto com dono e data)
4. F8-04 e F8-05 (SEO tecnico minimo)
5. F8-06 e F8-07 (observabilidade e acessibilidade)
6. F8-08, F8-09 e F8-10 (produto e expansao)

## 4. Riscos

- Escopo de fase crescer com itens de produto nao essenciais ao MVP.
- Misturar mudancas tecnicas e de posicionamento no mesmo PR.
- Perder foco em validacao objetiva por teste/build.

## 5. Guardrails de execucao

- PR pequeno, reversivel e com criterio de aceite claro.
- Nao iniciar item de prioridade baixa sem fechar os de prioridade alta.
- Cada entrega deve atualizar docs relacionados.

## 6. Definicao de pronto da Fase 8

- CI com cobertura no gate.
- Checklist de release preenchivel e utilizado.
- Decisoes abertas com status (`aberta`, `em andamento`, `decidida`).
- Itens tecnicos de SEO minimo entregues.
- Plano de observabilidade/acessibilidade formalizado.
