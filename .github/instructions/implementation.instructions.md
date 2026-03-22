---
applyTo: "src/**"
---

# Implementação e código — Compasso

> Para arquitetura completa: `docs/agents/architecture.md`

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | React 18 + TypeScript (strict) |
| Build | Vite |
| Roteamento | react-router-dom v6 (lazy + Suspense) |
| Estilos | SCSS Modules (`*.module.scss`) |
| Estado global | Context API (`ContextoApp` / `useApp()`) |
| Persistência | Dexie (IndexedDB) |
| Ícones | lucide-react |
| Compressão | pako (gzip para export/import) |
| Testes | Vitest + Testing Library |

---

## Estrutura de pastas

```
src/
  paginas/           # uma pasta por página, com tsx + module.scss
  componentes/
    comum/           # componentes reutilizáveis (Botao, Modal, Cartao…)
  estilos/           # variáveis SCSS, globals, compartilhados
  servicos/          # lógica de dados pura (sem React)
  loja/              # Context, reducer, hooks (useApp, useArmazenamento…)
  utilitarios/       # funções puras (formatações, cálculos)
  tipos/             # interfaces e tipos TypeScript
  bd.ts              # instância Dexie
```

---

## Convenções de código

### Nomes

- Componentes React: `PascalCase` em português (`PaginaRegistro`, `CartaoMetrica`).
- Hooks: `camelCase` com prefixo `use` em português (`useArmazenamento`, `useApp`).
- Funções de serviço: `camelCase` em português (`obterResumoDadosLocais`, `exportarDados`).
- Constantes de configuração e enums: `SCREAMING_SNAKE_CASE`.
- Arquivos SCSS: `kebab-case` com sufixo `.module.scss`.

### Componentes

- Sempre componentes funcionais com tipagem explícita.
- Props em português quando são de domínio. Props de callback podem usar prefixo `ao` (`aoConfirmar`, `aoFechar`).
- Não usar `any`. Não usar asserções de tipo sem comentário justificando.
- Lazy loading obrigatório para todas as páginas em `App.tsx`.

### Estado e dados

- Estado global via `useApp()`. Estado local de UI permanece no componente.
- Nunca acessar `bd` (Dexie) diretamente do componente — sempre via serviço ou hook.
- Operações de dados assíncronas devem ter tratamento de erro explícito.
- Mutations passam pelo `despacho` do contexto; nunca mutação direta de estado.

### Estilos

- Cada página/componente tem seu próprio `*.module.scss`.
- Variáveis de design via `@use '../../estilos/variaveis' as *`.
- Classes em `camelCase` dentro do módulo.
- Sem estilos inline. Sem `!important`.

---

## Padrões proibidos

- `console.log` fora de blocos de desenvolvimento explicitamente marcados.
- Chamadas a APIs externas sem ADR aprovado.
- Cookies, `sessionStorage` ou rastreadores de terceiros.
- Componentes com mais de uma responsabilidade bem definida.
- Importações circulares entre camadas (componente → serviço ✓ | serviço → componente ✗).

---

## Gate de qualidade

Executar antes de qualquer commit com mudança funcional:

```bash
npm run type-check && npm run lint && npm run build && npm run coverage
```
