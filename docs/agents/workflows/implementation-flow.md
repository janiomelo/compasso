# Fluxo de implementação

Este documento descreve o fluxo padrão de implementação de funcionalidades no Compasso.

---

## Pré-requisitos

- Proposta de funcionalidade definida e revisada (`workflows/feature-definition.md`).
- Critérios de aceitação claros.
- ADR criado se a funcionalidade impactar privacidade, arquitetura ou stack.

---

## Fluxo

### 1. Preparar o ambiente

```bash
git pull                  # garantir base atualizada
npm install               # instalar dependências se houver mudança
npm run type-check        # confirmar que a base está limpa
```

### 2. Criar branch

Nomenclatura: `feat/nome-descritivo` ou `fix/nome-descritivo`.

```bash
git checkout -b feat/nome-da-funcionalidade
```

### 3. Implementar em camadas

Ordem recomendada:

1. **Tipos** (`src/tipos/`) — definir interfaces e tipos novos.
2. **Serviços** (`src/servicos/`) — lógica de dados, sem React.
3. **Estado** (`src/loja/`) — actions, reducer, hooks se necessário.
4. **Componentes e páginas** (`src/paginas/`, `src/componentes/`) — apresentação.
5. **Estilos** — SCSS module adjacente ao componente.
6. **Rota** — registrar em `App.tsx` com lazy loading se for nova página.
7. **Export** — adicionar em `src/paginas/index.ts` se necessário.

### 4. Seguir convenções

- Nomes em português (domínio e UI).
- Componentes com responsabilidade única.
- Nenhum acesso direto a `bd` nos componentes.
- Sem `console.log` permanente.
- Sem estilos inline.

### 5. Executar gate de qualidade

```bash
npm run type-check && npm run lint && npm run build && npm run coverage
```

Todos devem passar antes de qualquer commit.

### 6. Escrever testes

- Testes de serviços e utilitários: obrigatórios.
- Testes de fluxos críticos de UI: obrigatórios.
- Testes de páginas puramente informativas: opcionais.

### 7. Verificar critérios de aceitação

Revisar cada item da proposta antes de considerar pronto.

### 8. Commit

Mensagem de commit em português, descritiva:

```
feat: adiciona exportação de dados em formato comprimido
fix: corrige cálculo de economia na semana parcial
docs: atualiza arquitetura com novo serviço de dados
```

### 9. Revisar com checklist de feature

`checklists/feature-checklist.md`

---

## O que não fazer

- Não commitar com gate falhando.
- Não deixar `TODO` ou `FIXME` sem issue registrada.
- Não criar abstração para uso único.
- Não adicionar dependência sem avaliar impacto em privacidade e licença.
