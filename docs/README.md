# Documentacao do Compasso

Este indice centraliza a navegacao da documentacao do projeto.

## Regras de uso

- Cada assunto tem uma fonte canônica.
- Evite duplicar conteudo entre arquivos.
- Em documentos satelite, use links para a fonte canônica.
- Decisao aprovada nao se reescreve: nova direcao exige novo ADR.

## Trilhas de documentacao

### 1) Produto e estrategia

- `FUNDAMENTOS-PRODUTO.md` (canônico)
- `DECISOES-EM-ABERTO.md` (canônico para backlog de decisoes)
- `fases-desenvolvimento/` (canônico para planejamento/execucao por fase)

### 2) Arquitetura e desenvolvimento

- `PROJETO WEB APP.md` (canônico)
- `GUIA-DESENVOLVIMENTO.md` (canônico)
- `checklists/` (canônico para qualidade operacional)

### 3) Decisoes e governanca tecnica

- `decisions/` (canônico para ADRs)

### 4) Agentes de IA

- `agents/` (canônico para contexto de agente, arquitetura detalhada e workflows)

### 5) Compliance de assets e licencas

- `assets-e-licencas.md` (canônico)

## Estado dos grupos (ativo x legado)

| Grupo | Estado | Observacao |
|---|---|---|
| `FUNDAMENTOS-PRODUTO.md` | ativo | Fonte de fundamentos do produto |
| `PROJETO WEB APP.md` | ativo | Fonte de arquitetura macro |
| `GUIA-DESENVOLVIMENTO.md` | ativo | Fonte de operacao tecnica |
| `DECISOES-EM-ABERTO.md` | ativo | Backlog de decisoes |
| `decisions/` | ativo | ADRs aprovados |
| `checklists/` | ativo | Listas operacionais |
| `fases-desenvolvimento/` | ativo | Planejamento por fase |
| `agents/` | ativo | Contexto para agentes |
| `assets-e-licencas.md` | ativo | Compliance de origem/licencas |

## Governanca continua

### Ownership por tema

| Tema | Responsavel primario | Fonte canônica |
|---|---|---|
| Produto e fundamentos | Produto | `FUNDAMENTOS-PRODUTO.md` |
| Arquitetura e stack | Engenharia | `PROJETO WEB APP.md` |
| Operacao de desenvolvimento | Engenharia | `GUIA-DESENVOLVIMENTO.md` |
| Decisoes aprovadas | Engenharia + Produto | `decisions/` |
| Compliance de licencas/assets | Engenharia | `assets-e-licencas.md` |
| Planejamento de fases | Produto + Engenharia | `fases-desenvolvimento/` |

### Check obrigatorio em PR de documentacao

- [ ] Este tema ja possui fonte canônica definida em `docs/README.md`?
- [ ] O texto novo evita duplicar conteudo existente?
- [ ] Os links internos foram validados?
- [ ] Se houve mudanca de direcao, ADR novo foi criado (sem reescrever ADR antigo)?

### Revisao mensal de docs

- Revisar links quebrados em `docs/**/*.md`.
- Revisar arquivos obsoletos e converter em referencia para fonte canônica.
- Atualizar este indice quando houver mudanca estrutural.

## Ordem recomendada de leitura

1. `FUNDAMENTOS-PRODUTO.md`
2. `PROJETO WEB APP.md`
3. `GUIA-DESENVOLVIMENTO.md`
4. `DECISOES-EM-ABERTO.md`
5. `decisions/`
6. `fases-desenvolvimento/`
