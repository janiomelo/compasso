# Arquitetura técnica — Compasso

**Última atualização:** março de 2026

---

## Visão geral

Compasso é uma SPA (Single Page Application) React com separação clara entre apresentação, lógica de negócio e persistência. Não há backend no MVP. Todos os dados ficam no dispositivo do usuário.

---

## Stack

| Camada | Tecnologia | Versão aproximada |
|---|---|---|
| Framework | React | 18 |
| Linguagem | TypeScript (strict) | 5+ |
| Build | Vite | 5+ |
| Roteamento | react-router-dom | v6 |
| Estilos | SCSS Modules | — |
| Estado global | Context API (custom) | — |
| Persistência | Dexie (IndexedDB) | 3+ |
| Ícones | lucide-react | (verificar versão antes de usar ícone novo) |
| Compressão | pako | — |
| Testes | Vitest + @testing-library/react | — |
| Cobertura | @vitest/coverage-v8 | — |
| PWA | vite-plugin-pwa | — |

---

## Estrutura de pastas

```
src/
  paginas/              # uma pasta por página
    NomePagina/
      PaginaNomePagina.tsx
      pagina-nome-pagina.module.scss
      componentes/      # componentes exclusivos da página
  componentes/
    comum/              # Botao, Modal, Cartao, Chip, Distintivo, AvisoOffline
  estilos/
    variaveis.scss      # tokens de espaçamento, cor, tipografia
    globals.scss        # CSS custom properties de tema (:root)
    compartilhados.scss # classes utilitárias reutilizáveis
  servicos/
    servicoDados.ts     # lógica de exportação, importação, backup, resumo
  loja/
    ContextoApp.tsx     # Provider + reducer + tipos de ação
    useApp.ts           # hook de acesso ao contexto
    useArmazenamento.ts # operações de dados com feedback de UI
  utilitarios/
    rotulos.ts          # formatações e rótulos de apresentação
    calculos.ts         # lógica de cálculo pura
  tipos/
    index.ts            # interfaces de domínio
  bd.ts                 # instância Dexie (IndexedDB)
  App.tsx               # roteamento principal com lazy + Suspense
  main.tsx              # entrada da aplicação
```

---

## Camadas e responsabilidades

### Apresentação (`paginas/`, `componentes/`)

- Renderiza estado.
- Captura eventos do usuário.
- Chama hooks ou serviços. Nunca acessa `bd` diretamente.
- Não contém lógica de negócio.

### Estado global (`loja/`)

- `ContextoApp`: estado da aplicação + reducer.
- `useApp()`: hook de leitura e despacho.
- `useArmazenamento()`: operações de persistência com feedback.
- Mutations sempre via `despacho`. Nunca mutação direta.

### Serviços (`servicos/`)

- Funções puras ou quase-puras de lógica de dados.
- Podem acessar `bd` (Dexie) diretamente.
- Não importam React ou hooks.

### Persistência (`bd.ts`)

- Instância única do Dexie.
- Tabelas: `registros`, `pausas`, `configuracoes`, `backups`.
- Acesso via serviços ou hook `useArmazenamento`.

---

## Roteamento

Todas as rotas são lazy-loaded com `React.lazy` + `Suspense`:

| Rota | Componente |
|---|---|
| `/` | `PaginaPrincipal` |
| `/registrar` | `PaginaRegistro` |
| `/pausa` | `PaginaPausa` |
| `/ritmo` | `PaginaRitmo` |
| `/config` | `PaginaConfig` |
| `/config/privacidade-transparencia` | `PaginaPrivacidadeTransparencia` |
| `/config/dados-locais-seguranca` | `PaginaDadosLocaisSeguranca` |
| `/config/licencas-creditos` | `PaginaLicencasCreditos` |
| `/config/sobre-projeto` | `PaginaSobreProjeto` |

---

## PWA e offline

- Manifest e service worker via `vite-plugin-pwa`.
- Funcionalidade básica offline garantida (cache de assets estáticos).
- Componente `AvisoOffline` informa o usuário quando sem conectividade.
- Dados nunca dependem de rede — sempre locais.

---

## Persistência e exportação

- IndexedDB via Dexie para dados de domínio.
- `localStorage` para timestamps de eventos operacionais (`CHAVES_EVENTOS`).
- Exportação: JSON serializado + compressão gzip (pako) → arquivo `.json.gz`.
- Importação: descompressão + validação de versão + migração de legado + rollback em falha.
- Backup automático e manual com política de retenção por origem.

---

## Estado atual do build

- `npm run type-check`: OK
- `npm run lint`: OK (zero warnings)
- `npm run build`: OK
- `npm run coverage`: 98 testes passando; thresholds atingidos
