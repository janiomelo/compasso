---
applyTo: "docs/**,*.md"
---

# Documentação — Compasso

> Índice principal de documentação: `docs/README.md`

---

## Princípios

- Documentação é parte do produto e deve evoluir junto com o código.
- Cada assunto deve ter **uma única fonte canônica**.
- Arquivos satélites devem **referenciar** a fonte canônica, sem duplicar texto.
- Decisões aprovadas (ADR) não devem ser reescritas; mudanças de direção exigem novo ADR.

---

## Fonte canônica por domínio

| Domínio | Fonte canônica |
|---|---|
| Produto (contexto completo para implementação) | `docs/agents/product-context.md` |
| Arquitetura técnica | `docs/agents/architecture.md` |
| Design system e UI | `docs/agents/design-system.md` |
| Decisões abertas | `docs/DECISOES-EM-ABERTO.md` |
| ADRs (decisões aprovadas) | `docs/decisions/` |
| Checklists operacionais | `docs/checklists/` |
| Planejamento por fase | `docs/fases-desenvolvimento/` |
| Licenças e origem de assets | `docs/assets-e-licencas.md` |

---

## ADRs (registros de decisão)

- Toda decisão relevante de produto, arquitetura ou design deve ter um ADR.
- Arquivo: `docs/decisions/adr-NNN-slug-descritivo.md`.
- Estrutura mínima: contexto → decisão → alternativas → consequências → data.
- ADR aprovado é imutável: para revisão de direção, criar novo ADR referenciando o anterior.

Situações que exigem ADR:

- Qualquer envio de dados para serviço externo.
- Mudança de estratégia de persistência.
- Inclusão de dependência com impacto em privacidade.
- Mudança de estratégia de tema/design system.

---

## Padrões de escrita

- Português claro, com acentuação e cedilha.
- Parágrafos curtos e objetivos.
- Tabelas para comparação; listas para enumerações.
- Evitar jargão desnecessário.

---

## Transparência pública

- Conteúdo público para usuários (privacidade, termos, dados locais, projeto) está dentro da aplicação e é a fonte da verdade.
- Em `docs/`, manter apenas documentação de apoio técnico, compliance e rastreabilidade.
