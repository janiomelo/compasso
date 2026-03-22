# Compasso — guia do desenvolvedor

> Documentação de produto e decisões de design em [`docs/PROJETO WEB APP.md`](docs/PROJETO%20WEB%20APP.md).

---

## Pré-requisitos

- Node.js ≥ 18
- npm ≥ 9

---

## Instalação

```bash
git clone <repo>
cd compasso
npm install
```

---

## Desenvolvimento

| Comando | O que faz |
|---|---|
| `npm run dev` | Inicia servidor local em `http://localhost:5173` (com hot-reload) |
| `npm run build` | Build de produção (type-check + vite build) — saída em `dist/` |
| `npm run preview` | Serve o build em `dist/` localmente |

---

## Qualidade

| Comando | O que faz |
|---|---|
| `npm run type-check` | TypeScript sem emit |
| `npm run lint` | ESLint com zero warnings (modo strict) |
| `npm test` | Vitest em modo watch |
| `npm run coverage` | Vitest + cobertura v8 (relatório em `coverage/`) |

### Gate completo antes de commitar

```bash
npm run type-check && npm run lint && npm run build && npm run coverage
```

### Thresholds de cobertura

| Métrica | Mínimo |
|---|---|
| Linhas | 60% |
| Funções | 60% |
| Branches | 55% |
| Declarações | 60% |

---

## Estrutura

```
src/
  App.tsx                  # Roteador principal (lazy loading por rota)
  componentes/             # Componentes visuais reutilizáveis
  estilos/                 # Tokens (variáveis SCSS) e reset global
  ganchos/                 # Custom hooks (useApp, useRegistro, usePausa…)
  loja/                    # ContextoApp + reducer + estado global
  paginas/                 # Uma pasta por rota (Principal, Registro, Pausa, Ritmo, Config)
  servicos/                # Camada de acesso a dados (Dexie / IndexedDB)
  tipos/                   # Tipos e interfaces TypeScript exportados globalmente
  utilitarios/             # Funções puras (calculos.ts, formatacao.ts, rotulos.ts…)

__testes__/
  setup/                   # Configuração do ambiente de testes (fake-indexeddb)
  unitarios/               # Funções puras, sem DOM
  integracao/              # Fluxos completos (armazenamento, análise, navegação)
  ui/                      # Componentes renderizados com RTL
```

---

## Stack

| Tecnologia | Versão | Uso |
|---|---|---|
| React | 18 | UI |
| TypeScript | 5 | Tipagem |
| Vite | 4 | Build + dev server |
| React Router | 6 | Roteamento SPA |
| Dexie | 3 | Wrapper IndexedDB |
| Sass Modules | — | Estilos escopados |
| Vitest | 0.34 | Testes + cobertura |
| React Testing Library | — | Testes de UI |

---

## Convenções

- **Idioma**: português em tudo que o usuário vê; inglês apenas para termos consagrados do ecossistema.
- **Commits**: `feat:`, `fix:`, `test:`, `docs:`, `refactor:` — em português.
- **Nomes de arquivo**: PascalCase para componentes e páginas; kebab-case para estilos e testes.
- **Testes**: cada arquivo de teste termina em `.teste.ts` ou `.teste.tsx`.
