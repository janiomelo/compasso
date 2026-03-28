# Fase 9.2 — Unificar documentacao em docs raiz

> **Status:** Concluida  
> **Parte de:** [Fase 9 - Concluir e Consolidar](Fase%209%20-%20Concluir%20e%20Consolidar.md)  
> **Prioridade:** Alta  
> **Objetivo:** consolidar a documentacao geral em `docs/` raiz, eliminar repeticao e manter cada tema em um unico lugar, sem alterar decisoes e contextos ja aprovados.

---

## 1. Contexto

Depois da separacao entre fluxo de agentes e fluxo geral, ainda existe fragmentacao de conteudo no `docs/`.

A Fase 9.2 organiza a documentacao com tres principios:

1. **Fonte unica por assunto:** cada tema tem um unico arquivo canônico.
2. **Sem duplicacao textual:** quando um tema aparece em outro documento, usar referencia cruzada.
3. **Sem reescrever decisao aprovada:** ADRs e contexto de produto nao mudam de significado nesta fase.

---

## 2. Escopo desta fase

### Inclui

- Organizar arquivos de documentacao geral na raiz de `docs/` por dominio.
- Mover `docs/transparencia/assets-e-licencas.md` para raiz de `docs/`.
- Criar matriz de ownership dos documentos (quem e fonte da verdade de cada tema).
- Trocar blocos repetidos por links internos entre documentos.
- Preservar historico e rastreabilidade via git (movendo arquivos sem perder historico).

### Nao inclui

- Criar novas regras de produto.
- Alterar ADRs em `docs/decisions/` (apenas ajustar referencias se necessario).
- Reescrever contexto de produto em `docs/agents/product-context.md`.
- Alterar conteudo publico dentro da aplicacao.

---

## 3. Estrutura alvo

Estrutura consolidada:

```
docs/
├── README.md                          # indice principal da documentacao
├── FUNDAMENTOS-PRODUTO.md
├── PROJETO WEB APP.md
├── GUIA-DESENVOLVIMENTO.md
├── DECISOES-EM-ABERTO.md
├── assets-e-licencas.md               # fonte canônica de compliance
├── decisions/                         # ADRs
├── checklists/                        # checklists gerais
├── fases-desenvolvimento/             # planejamento por fase
└── agents/                            # contexto e workflows para agentes
```

---

## 4. Regra de autoria (source of truth)

| Tema | Fonte canônica | Uso nos demais docs |
|---|---|---|
| Contexto de produto para implementacao | `docs/agents/product-context.md` | Referenciar, sem duplicar |
| Arquitetura tecnica detalhada | `docs/agents/architecture.md` | Referenciar, sem duplicar |
| Decisoes arquiteturais | `docs/decisions/` | Referenciar ADR especifico |
| Backlog de decisoes | `docs/DECISOES-EM-ABERTO.md` | Resumir e apontar para ADR |
| Licencas e origem de assets | `docs/assets-e-licencas.md` | Referenciar, sem copiar listas |
| Checklist de qualidade/release | `docs/checklists/` | Referenciar, sem duplicar |
| Planejamento por fase | `docs/fases-desenvolvimento/` | Referenciar fases relacionadas |

---

## 5. Execucao

### Etapa 1 — Inventario e mapa de duplicacao

- [x] Levantar todos os arquivos em `docs/` e subpastas.
- [x] Marcar por arquivo: canônico, derivado, legado.
- [x] Identificar duplicacoes de texto por tema.

Resultado:

- Grupos ativos canônicos consolidados em `docs/`, `docs/checklists/`, `docs/decisions/`, `docs/agents/` e `docs/fases-desenvolvimento/`.
- Duplicacao relevante identificada e tratada: checklist de release legado removido e consolidado no canônico.

### Etapa 2 — Consolidacao fisica de arquivos

- [x] Mover `docs/transparencia/assets-e-licencas.md` para `docs/assets-e-licencas.md`.
- [x] Atualizar referencias para o novo caminho.
- [x] Remover legados desnecessarios do fluxo principal.

### Etapa 3 — Deduplicacao de conteudo

- [x] Remover trechos repetidos em documentos satelites.
- [x] Substituir por referencia para documento canonico.
- [x] Manter semantica de ADRs e contexto (apenas ajustes de caminho/link).

### Etapa 4 — Indice principal de docs

- [x] Criar/atualizar `docs/README.md` como indice unico.
- [x] Organizar por trilhas: produto, arquitetura, decisoes, operacao, fases.
- [x] Marcar explicitamente grupos ativos.

### Etapa 5 — Governanca continua

- [x] Definir regra no processo: documento novo so entra com tema canonico definido.
- [x] Incluir check de PR para evitar duplicacao.
- [x] Definir revisao mensal de links e obsolescencia em `docs/README.md`.

---

## 6. Critérios de pronto

- [x] `docs/assets-e-licencas.md` na raiz como fonte ativa de licencas/assets.
- [x] Nenhum arquivo ativo em `docs/` com duplicacao integral relevante.
- [x] `docs/README.md` atualizado como indice central.
- [x] Links internos de docs ajustados para a nova estrutura.
- [x] ADRs e contextos preservados semanticamente.

---

## 7. Resultado

A Fase 9.2 concluiu a unificacao da documentacao geral em `docs/` raiz, com separacao clara entre:

- documentacao geral do projeto (`docs/`),
- documentacao para agentes (`docs/agents/`),
- decisoes aprovadas (`docs/decisions/`),
- checklists operacionais (`docs/checklists/`).

Com isso, a base documental ficou sem redundancia estrutural relevante e com governanca explícita para manutencao.

---

## 8. Dependencias

- [Fase 9 - Concluir e Consolidar](Fase%209%20-%20Concluir%20e%20Consolidar.md)
- [Fase 9.1 - Unificar Documentação para Agentes](Fase%209.1%20-%20Unificar%20Documenta%C3%A7%C3%A3o%20para%20Agentes.md)
- [docs/DECISOES-EM-ABERTO.md](../DECISOES-EM-ABERTO.md)
- [docs/decisions/](../decisions/)
