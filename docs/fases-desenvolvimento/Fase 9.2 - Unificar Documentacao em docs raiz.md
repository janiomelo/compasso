# Fase 9.2 — Unificar documentacao em docs raiz

> **Status:** Em execução  
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

Estrutura esperada apos consolidacao:

```
docs/
├── README.md                          # indice principal da documentacao
├── FUNDAMENTOS-PRODUTO.md
├── PROJETO WEB APP.md
├── GUIA-DESENVOLVIMENTO.md
├── DECISOES-EM-ABERTO.md
├── assets-e-licencas.md               # movido de docs/transparencia/
├── decisions/                         # ADRs
├── checklists/                        # checklists gerais
├── fases-desenvolvimento/             # planejamento por fase
├── agents/                            # contexto e workflows para agentes
└── transparencia/                     # legado/historico (quando aplicavel)
```

Observacao: `docs/transparencia/` deixa de ser fonte ativa; quando existir conteudo legado, deve apontar para o arquivo canonico na raiz.

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

## 5. Plano de migracao

### Etapa 1 — Inventario e mapa de duplicacao

- [x] Levantar todos os arquivos em `docs/` e subpastas.
- [x] Marcar por arquivo: canônico, derivado, legado.
- [x] Identificar duplicacoes de texto por tema.

Saida executada (inventario por grupo):

| Grupo | Status | Papel |
|---|---|---|
| `docs/FUNDAMENTOS-PRODUTO.md` | ativo | canônico (fundamentos) |
| `docs/PROJETO WEB APP.md` | ativo | canônico (arquitetura macro) |
| `docs/GUIA-DESENVOLVIMENTO.md` | ativo | canônico (operacao dev) |
| `docs/DECISOES-EM-ABERTO.md` | ativo | canônico (backlog de decisoes) |
| `docs/decisions/` | ativo | canônico (ADRs aprovados) |
| `docs/checklists/` | ativo | canônico (checklists gerais) |
| `docs/assets-e-licencas.md` | ativo | canônico (compliance de assets/licencas) |
| `docs/agents/` | ativo | canônico (contexto de agentes) |
| `docs/fases-desenvolvimento/` | ativo | canônico (planejamento e execucao por fase) |

Duplicacoes detectadas (para tratar na Etapa 3):

- Tema "status de fases" aparece em múltiplos documentos de fase com sobreposicao parcial (aceitavel, desde que referenciado).

### Etapa 2 — Consolidacao fisica de arquivos

- [x] Mover `docs/transparencia/assets-e-licencas.md` para `docs/assets-e-licencas.md`.
- [x] Atualizar todas as referencias para o novo caminho.

Saida esperada: licencas/assets com caminho unico em `docs/` raiz.

### Etapa 3 — Deduplicacao de conteudo

- [x] Remover trechos repetidos em documentos satelites (ex.: checklist de release migrado para fonte canônica).
- [x] Substituir por "ver documento canonico" com link.
- [ ] Garantir que decisoes (ADRs) e contexto aprovado nao sejam alterados semanticamente.

Saida esperada: cada assunto descrito integralmente em um unico lugar.

### Etapa 4 — Indice principal de docs

- [x] Criar/atualizar `docs/README.md` como indice unico.
- [x] Organizar por trilhas: produto, arquitetura, decisoes, operacao, fases.
- [x] Marcar explicitamente o que e ativo e o que e legado.

Saida esperada: navegacao clara e sem ambiguidade.

### Etapa 5 — Governanca continua

- [ ] Definir regra no processo: documento novo so entra com dono e tema canonico definido.
- [ ] Incluir check no PR: "ha duplicacao deste tema em outro arquivo?"
- [ ] Revisao mensal de links quebrados e arquivos obsoletos.

Saida esperada: estrutura mantida apos a Fase 9.2, sem regressao.

---

## 6. Critérios de pronto

A Fase 9.2 sera considerada concluida quando:

- [x] `docs/assets-e-licencas.md` existir na raiz e for a unica fonte ativa de licencas/assets.
- [ ] Nenhum arquivo ativo em `docs/` duplicar integralmente conteudo de outro.
- [x] `docs/README.md` existir (ou estar atualizado) como indice central.
- [ ] Todos os links internos de docs estiverem validos.
- [ ] ADRs e contextos existentes permanecerem semanticamente inalterados.

---

## 7. Riscos e mitigacao

| Risco | Impacto | Mitigacao |
|---|---|---|
| Quebra de links apos mover arquivos | Medio | Atualizacao automatica + varredura por `grep` |
| Reintroducao de duplicacao no futuro | Medio | Regra de PR + ownership por tema |
| Mudanca acidental de sentido em ADR/contexto | Alto | Revisao focada em "semantica nao alterada" |
| Misturar doc de agente com doc geral novamente | Medio | Fronteira clara: `docs/agents/` vs `docs/` raiz |

---

## 8. Dependencias

- [Fase 9 - Concluir e Consolidar](Fase%209%20-%20Concluir%20e%20Consolidar.md)
- [Fase 9.1 - Unificar Documentação para Agentes](Fase%209.1%20-%20Unificar%20Documenta%C3%A7%C3%A3o%20para%20Agentes.md)
- [docs/DECISOES-EM-ABERTO.md](../DECISOES-EM-ABERTO.md)
- [docs/decisions/](../decisions/)
