# Fluxo de definição de funcionalidade

Este documento descreve como definir uma nova funcionalidade no Compasso antes de passar para implementação.

---

## Quando usar este fluxo

- Sempre que uma nova tela, fluxo ou comportamento for proposto.
- Antes de qualquer linha de código ser escrita.
- Quando uma funcionalidade existente for alterada de forma que mude o comportamento do usuário.

---

## Etapas

### 1. Verificar alinhamento com o produto

Antes de definir qualquer coisa, responder:

- Essa funcionalidade atende ao público-alvo do Compasso? (ver `product-context.md`)
- Ela viola algum princípio inegociável? (privacidade, sem julgamento, sem backend obrigatório)
- Ela entra no escopo da fase atual ou é evolução futura?

Se a resposta for negativa a qualquer item, documentar a decisão de não fazer em `docs/DECISOES-EM-ABERTO.md`.

### 2. Definir o problema, não a solução

Descrever:

- Quem tem o problema.
- O que a pessoa está tentando fazer.
- Por que a forma atual não resolve ou não existe.

Evitar começar já pelo "como vai funcionar".

### 3. Escrever a proposta de funcionalidade

Formato mínimo:

```markdown
## [Nome da funcionalidade]

**Problema:** [descrição do problema]
**Proposta:** [o que o produto passará a fazer]
**Escopo:** [o que está incluído e o que não está]
**Critérios de aceitação:**
- [ ] ...
- [ ] ...
**Impacto em dados:** [sim/não — se sim, descrever]
**Impacto em privacidade:** [sim/não — se sim, exige ADR]
```

### 4. Avaliar impacto técnico

- A funcionalidade exige nova tabela no banco?
- Exige novo tipo no domínio, nova rota, novo serviço?
- Exige dependência nova? (avaliar licença e impacto em privacidade)
- Exige ADR? (ver `docs.instructions.md` — seção ADRs)

### 5. Revisar com o checklist de feature

Antes de passar para implementação, verificar `checklists/feature-checklist.md`.

---

## Saídas esperadas

- Proposta de funcionalidade escrita e revisada.
- Critérios de aceitação definidos.
- ADR criado (se aplicável).
- Referência adicionada ao backlog ou fase correspondente.
