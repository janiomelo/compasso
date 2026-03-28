# Fase 9.1 — Unificar Documentação para Agentes

> **Status:** Planejado  
> **Parte de:** [Fase 9 - Concluir e Consolidar](Fase%209%20-%20Concluir%20e%20Consolidar.md)  
> **Prioridade:** Alta — bloqueia sincronização de todas as instruções do Copilot

---

## 1. Contexto e problema

A documentação de agentes está espalhada em três camadas sem governança clara:

| Camada | Localização | Propósito hoje |
|---|---|---|
| **Quick Reference** | `.github/copilot-instructions.md` + `.github/instructions/*.md` | Guias sucintos para o Copilot durante codificação |
| **Authoritative Source** | `docs/agents/` | Documentação completa: produto, arquitetura, ADRs, workflows |
| **Decisões** | `docs/DECISOES-EM-ABERTO.md` + `docs/decisions/adr-*.md` | Histórico de decisões abertas e fechadas |

**Consequência:** Sem governança, o conteúdo diverge. Exemplo já ocorrido: `.github/instructions/product.instructions.md` dizia "Próximas: Telemetria opt-in" enquanto ADR-002 (28/03/2026) aprovava "ativada por padrão".

---

## 2. Decisão de arquitetura de documentação

**Cada camada tem responsabilidade exclusiva:**

- **`.github/copilot-instructions.md`** — Ponto de entrada único. Contém: resumo do projeto, regras gerais e links de navegação para as instruções por domínio. Não duplica conteúdo detalhado.

- **`.github/instructions/*.md`** — Guias rápidos por domínio (produto, código, UI, testes, docs). Cada arquivo começa com um link para o documento completo equivalente em `docs/agents/`. Não repete conteúdo de `docs/agents/`.

- **`docs/agents/`** — Fonte da verdade para produto e arquitetura. Documentação completa, rastreável, com ADRs. Atualizada primeiro a cada mudança relevante.

- **`docs/DECISOES-EM-ABERTO.md`** — Backlog de decisões pendentes. Quando fechada, a decisão vai para um ADR em `docs/decisions/` e o documento apenas aponta para o ADR.

---

## 3. Matriz de sincronização

Arquivo em `docs/agents/` é a **fonte da verdade**. O `.github/instructions/` é o **resumo com link**.

| `.github/instructions/` | `docs/agents/` equivalente | Status |
|---|---|---|
| `product.instructions.md` | `product-context.md` | 🔴 DIVERGÊNCIA — telemetria opt-in vs. por padrão |
| `implementation.instructions.md` | `architecture.md` | ✅ Sincronizado |
| `ui.instructions.md` | `design-system.md` | ✅ Sincronizado |
| `testing.instructions.md` | *(sem equivalente completo)* | ⚠️ Autoridade em `.github/` — OK |
| `docs.instructions.md` | *(este processo)* | 🟡 Em andamento |

---

## 4. Itens a executar

### 4.1 Correção urgente (bloqueador)

- [ ] Atualizar `.github/instructions/product.instructions.md` (Fases do produto):
  - Remover: "Próximas: Telemetria opt-in"
  - Adicionar: "Fase 8 (em andamento): ... telemetria anônima ativada por padrão com desativação fácil (ADR-002)"
  - Adicionar no topo: link para `docs/agents/product-context.md`

### 4.2 Criar matriz central de sincronização

- [ ] Criar `docs/agents/SINCRONIZACAO.md` com:
  - Tabela de mapeamento `.github/instructions/` ↔ `docs/agents/`
  - Status de sincronização (✅ / 🔴 / ⚠️)
  - Data da última revisão de cada par
  - Processo resumido de atualização

### 4.3 Adicionar links de cruzamento em `.github/instructions/`

Adicionar no topo de cada arquivo de instrução:

```markdown
> ⓘ **Guia rápido.** Para a versão completa com contexto e rastreabilidade:
> [`docs/agents/[arquivo-equivalente].md`](../../docs/agents/...)
```

Arquivos a atualizar:
- [ ] `product.instructions.md` → link para `product-context.md`
- [ ] `implementation.instructions.md` → link para `architecture.md`
- [ ] `ui.instructions.md` → link para `design-system.md`

### 4.4 Revisar e atualizar `docs/agents/README.md`

- [ ] Confirmar se `adr-001-product-principles.md` é template ou decisão documentada — esclarecer no README
- [ ] Atualizar lista de arquivos existentes (incluir ADR-002, Fase 8.12)
- [ ] Adicionar seção: "Como manter esta documentação sincronizada"

### 4.5 Atualizar `docs/DECISOES-EM-ABERTO.md`

- [ ] D-06: marcar todas as ações derivadas como concluídas e adicionar link direto para ADR-002

### 4.6 Criar processo permanente em `docs/agents/SINCRONIZACAO.md`

O processo a ser seguido ao fim de cada fase ou ADR aprovado:

1. Identificar impacto: a mudança afeta `.github/` ou `docs/agents/` (ou ambos)?
2. Atualizar `docs/agents/` **primeiro** (authoritative source)
3. Resumir em `.github/instructions/` **depois**, com link
4. Fechar decisão em `docs/DECISOES-EM-ABERTO.md` se aplicável (link para ADR)
5. Atualizar status na matriz em `docs/agents/SINCRONIZACAO.md`

---

## 5. Estrutura final esperada

```
.github/
├── copilot-instructions.md       ← ENTRY POINT (navegação e regras gerais)
└── instructions/
    ├── product.instructions.md   ← Guia rápido + link → docs/agents/product-context.md
    ├── implementation.instructions.md  ← + link → architecture.md
    ├── ui.instructions.md        ← + link → design-system.md
    ├── testing.instructions.md   ← Autoridade (sem equivalente completo)
    └── docs.instructions.md      ← Governa este processo

docs/agents/
├── README.md                     ← Índice e mapa de navegação
├── SINCRONIZACAO.md              ← NOVO: matriz de sincronização + processo
├── product-context.md            ← Autoridade de produto
├── architecture.md               ← Autoridade técnica
├── design-system.md              ← Autoridade de UI
├── decisions/
│   ├── adr-001-product-principles.md
│   └── adr-002-telemetria-opt-in.md
├── checklists/
└── workflows/
```

---

## 6. Critério de pronto

- [ ] `.github/instructions/product.instructions.md` sem menção a "telemetria opt-in"
- [ ] Cada arquivo `.github/instructions/` tem link para equivalente em `docs/agents/`
- [ ] `docs/agents/SINCRONIZACAO.md` criado com matriz e processo
- [ ] `docs/agents/README.md` revisado e correto
- [ ] `docs/DECISOES-EM-ABERTO.md` com D-06 totalmente fechada e todas as ações derivadas concluídas
- [ ] Nenhum conflito de conteúdo entre `.github/` e `docs/agents/`

---

## 7. Referências

- [Fase 9 - Concluir e Consolidar](Fase%209%20-%20Concluir%20e%20Consolidar.md)
- [docs/agents/README.md](../agents/README.md)
- [docs/DECISOES-EM-ABERTO.md](../DECISOES-EM-ABERTO.md)
- [docs/decisions/adr-002-telemetria-opt-in.md](../decisions/adr-002-telemetria-opt-in.md)
- [.github/copilot-instructions.md](../../.github/copilot-instructions.md)
