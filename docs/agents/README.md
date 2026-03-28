# Compasso — documentação para agentes de IA

Este diretório concentra o contexto de produto, arquitetura e design do projeto Compasso para uso por agentes de IA (GitHub Copilot e similares).

> **Decisões arquiteturais (ADRs)** estão em [`docs/decisions/`](../decisions/).  
> **Checklists de desenvolvimento** estão em [`docs/checklists/`](../checklists/).

---

## Mapa de documentos

| Arquivo | Propósito |
|---|---|
| `product-context.md` | Contexto completo de produto: proposta, público, princípios, limites |
| `architecture.md` | Arquitetura técnica: stack, estrutura, camadas, contratos |
| `design-system.md` | Sistema de design: tokens, componentes, padrões visuais |

### Workflows

| Arquivo | Propósito |
|---|---|
| `workflows/feature-definition.md` | Como definir e especificar uma nova funcionalidade |
| `workflows/implementation-flow.md` | Fluxo de implementação, revisão e merge |
| `workflows/testing-validation.md` | Estratégia de testes e critérios de validação |

---

## Como usar este diretório

- **Antes de implementar qualquer feature:** leia `product-context.md` e `architecture.md`.
- **Antes de criar componentes ou telas:** leia `design-system.md`.
- **Antes de uma decisão arquitetural ou de produto relevante:** crie um ADR em [`docs/decisions/`](../decisions/).
- **Para verificar qualidade antes de merge ou release:** consulte [`docs/checklists/`](../checklists/).
- **Para fluxos recorrentes de desenvolvimento:** consulte `workflows/`.

---

## Como criar um novo ADR

1. Copie o template de `decisions/adr-001-product-principles.md`.
2. Nomeie com o próximo número sequencial: `adr-NNN-slug.md`.
3. Preencha todas as seções: contexto, decisão, alternativas, consequências, data.
4. Referencie o ADR no `README.md` deste diretório (tabela acima).

Somente criar ADR quando houver decisão real e necessária para manutenção do projeto.

---

## Estado atual do projeto

- **MVP:** concluído (Fases 1–7).
- **Fase 8.5:** concluída — proteção por senha, bloqueio local e criptografia em repouso.
- **Fase 8.6:** em andamento — árvore de registro configurável e evolução flexível das perguntas.
- **Próximas decisões abertas:** ver `docs/DECISOES-EM-ABERTO.md`.
