---
applyTo: "docs/**,*.md"
---

# Documentação — Compasso

> Para estrutura completa de documentação do agente: `docs/agents/README.md`

---

## Princípios

- Documentação é parte do produto. Deve ser mantida junto com o código.
- Documentos de produto ficam em `docs/agents/` (contexto para agentes de IA).
- Documentos de transparência pública ficam em `docs/transparencia/`.
- Documentos técnicos de uso geral ficam em `docs/` diretamente.

---

## Estrutura dos documentos de agente

```
docs/agents/
  README.md              # mapa geral e ponto de entrada
  product-context.md     # contexto completo de produto
  architecture.md        # arquitetura técnica
  design-system.md       # sistema de design e padrões visuais
  workflows/             # fluxos de trabalho recorrentes
  checklists/            # listas de verificação operacionais
  decisions/             # ADRs (Architecture Decision Records)
```

---

## ADRs (registros de decisão)

- Toda decisão relevante de produto, arquitetura ou design deve ter um ADR.
- Arquivo: `docs/agents/decisions/adr-NNN-slug-descritivo.md`.
- Usar o template padrão: contexto → decisão → alternativas → consequências → data.
- ADRs são imutáveis após aprovação. Para reverter, criar novo ADR referenciando o anterior.
- Situações que **exigem** ADR:
  - Qualquer envio de dado para servidor externo.
  - Mudança de estratégia de persistência.
  - Adição de dependência de terceiro com impacto em privacidade.
  - Mudança de estratégia de tema ou design system.

---

## Padrões de escrita

- Português correto com acentuação e cedilha.
- Parágrafos curtos. Uma ideia por parágrafo.
- Tabelas para comparações, listas para enumerações simples.
- Sem jargão desnecessário. Se o termo técnico for inevitável, explicar na primeira ocorrência.
- Títulos descritivos: o leitor deve entender o conteúdo da seção sem precisar lê-la.

---

## Documentos de transparência pública

Esses arquivos são referenciados na interface do produto. Qualquer mudança impacta o usuário final:

| Arquivo | Propósito |
|---|---|
| `docs/transparencia/POLITICA-DE-PRIVACIDADE.md` | Resumo acessível |
| `docs/transparencia/POLITICA-DE-PRIVACIDADE-COMPLETA.md` | Versão completa |
| `docs/transparencia/TERMOS-DE-USO.md` | Termos de uso |
| `docs/transparencia/DADOS-LOCAIS-E-SEGURANCA.md` | Explicação técnica acessível |
| `docs/transparencia/SOBRE-E-TRANSPARENCIA.md` | Identidade e responsabilidade |
| `docs/transparencia/assets-e-licencas.md` | Compliance de origem e licenças |

Mudanças nesses arquivos devem ser revisadas com o mesmo cuidado de mudanças de UI.
