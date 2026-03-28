# Arquitetura Técnica — Compasso Web App

**Status:** Documento de Arquitetura v1.1  
**Data:** 22 de março de 2026  
**Escopo:** MVP com stack React + TypeScript + Vite  

---

## 0. Atualizacao de Execucao (22/03/2026)

### 0.1. Concluido nesta iteracao

- Pacote A: normalizacao de contratos de dominio (`duracaoPlanejada`, `historicoPausa`) com compatibilidade de dados legados.
- Pacote B: saneamento do store global (remoção de estado e ações mortas de UI).
- Pacote C: camada compartilhada de apresentação (`rotulos.ts` + `estilos/compartilhados.scss`).
- Pacote D: fatiamento de componentes em Registro e Principal (hook de fluxo + componentes por responsabilidade).
- Pacote E: testes de UI comportamental para Registro, Pausa e Principal.
- Fase 4 (concluida): exportacao/importacao de dados com compressao gzip, validacao de versao e migracao legada.
- Fase 4 (concluida): politica de retencao por origem de backup (`automatico` e `manual`) com restauracao preferencial.
- Fase 4 (concluida): resiliencia de importacao (arquivo corrompido e rollback transacional em falha de escrita).
- Fase 4 (concluida): rota `/config` integrada com backup, restauracao, exportacao, importacao e validacao.
- Fase 4 (concluida): testes de fluxo de dados (backup, exportacao e importacao) na camada de integracao.
- Fase 5 (concluida): PWA habilitado com manifest + service worker para funcionamento offline basico.
- Fase 5 (concluida): aviso de conectividade offline na UI, informando indisponibilidade/enfileiramento de metricas e sincronizacoes.
- Fase 5 (concluida): configuracao de tema escuro/claro na rota `/config` com persistencia local.
- Fase 5 (concluida): testes de PWA/offline (registro de service worker e aviso offline).
- Fase 6 (concluida): pagina de analytics com ritmo semanal, tendencias e relatorios basicos.
- Fase 6 (concluida): ResumoEconomia detalhado, metrica de valor percebido e comparativo de periodos.
- Fase 6 (concluida): DicasReducao com rotacao manual e insights baseados em padroes de uso.
- Fase 6 (concluida): testes de integracao de analise para ritmo e economia.
- Fase 7 (concluida): cobertura com `@vitest/coverage-v8`, script `npm run coverage` e thresholds minimos no `vitest.config.ts`.
- Fase 7 (concluida): edge cases e stress tests (1200+ registros) para utilitarios de calculo.
- Fase 7 (concluida): lazy loading de rotas no `src/App.tsx` com `React.lazy` + `Suspense`.
- Fase 7 (concluida): README restaurado como base do projeto e desdobramento em documentos complementares (`docs/FUNDAMENTOS-PRODUTO.md` e `docs/GUIA-DESENVOLVIMENTO.md`).

### 0.2. Estado atual validado

- `npm run type-check`: OK.
- `npm run build`: OK.
- `npm run coverage`: 98/98 testes passando.
- Cobertura global atual: 91.12% statements, 83.67% branches, 87.85% functions, 91.12% lines.
- CI automatizada com gate de qualidade (`type-check + lint + testes + build`).
- Commits de referencia:
  - `a95676f` (Pacote A)
  - `a3add5c` (Pacote B)
  - `bae308d` (Pacote C)
  - `e3f154c` (Pacote D)
  - `9f74363` (Pacote E)

### 0.3. O que falta (lacunas objetivas)

- Nao ha lacunas bloqueantes no escopo definido ate a Fase 7.
- Proximas lacunas sao evolutivas (nao criticas): observabilidade mais detalhada, refinamento de acessibilidade e monitoramento de performance em producao.

### 0.4. Proximos passos recomendados

1. Consolidar backlog da proxima iteracao (Fase 8) com foco em UX de longo prazo e telemetria opt-in.
2. Definir checklist de release do MVP (documentacao, QA exploratorio, validacao manual em mobile).

---

## 1. Visão Geral da Arquitetura

O Compasso é uma aplicação web responsiva, mobile-first, construída como uma Single Page Application (SPA) com separação clara entre camadas de apresentação, lógica de negócio, manipulação de estado e persistência de dados.

A arquitetura segue princípios de clean code com foco em:
- **Modularidade**: cada camada com responsabilidade bem definida
- **Escalabilidade**: fácil de adicionar features sem quebrar existentes  
- **Testabilidade**: lógica separada dos componentes visuais
- **Privacidade**: dados armazenados localmente, sem backend obrigatório no MVP

---

## 2. Stack Técnico

### 2.1. Dependências Principais

```json
{
  "Buildtool": "Vite",
  "Frontend Framework": "React 18+",
  "Linguagem": "TypeScript 5+",
  "Roteamento": "React Router v6",
  "Estilização": "Sass + BEM",
  "Ícones": "lucide-react",
  "Gerenciamento de Estado": "Context API + useReducer",
  "Persistência Local": "IndexedDB (via dexie.js)",
  "Compressão": "pako (gzip no browser)",
  "UI Utilities": "clsx (className builder)"
}
```

### 2.2. Dependências de Desenvolvimento

```json
{
  "Tipagem": "TypeScript",
  "Linter": "ESLint",
  "Formatador": "Prettier",
  "Testes": "Vitest + React Testing Library",
  "Build": "Vite build tools"
}
```

---

## 3. Estrutura de Pastas

```
compasso/
├── src/
│   ├── ativos/                      # Imagens, ícones, fontes
│   │   ├── icones/
│   │   ├── imagens/
│   │   └── fontes/
│   │
│   ├── estilos/                     # Estilos globais e tema
│   │   ├── globals.scss             # Reset, tipografia base
│   │   ├── variaveis.scss           # Cores, espaçamentos, breakpoints
│   │   ├── pontosCut.scss           # Media queries reutilizáveis
│   │   └── tema/
│   │       ├── escuro.scss
│   │       └── claro.scss
│   │
│   ├── tipos/                       # Tipos TypeScript compartilhados
│   │   ├── index.ts
│   │   ├── registro.tipos.ts
│   │   ├── pausa.tipos.ts
│   │   ├── aplicacao.tipos.ts
│   │   └── armazenamento.tipos.ts
│   │
│   ├── utilitarios/                 # Funções utilitárias e helpers
│   │   ├── armazenamento/
│   │   │   ├── bd.ts                # Dexie BD setup e consultas
│   │   │   ├── exportar.ts          # Exportar em JSON + gzip
│   │   │   ├── importar.ts          # Importar de JSON comprimido
│   │   │   └── backup.ts            # Lógica de backup/restauração
│   │   ├── dados/
│   │   │   ├── calculos.ts          # Cálculos de economia, frequência
│   │   │   ├── formatacao.ts        # Formatação de datas, moeda
│   │   │   └── filtros.ts           # Filtros para relatórios
│   │   ├── compressor/
│   │   │   ├── compactar.ts         # Comprime JSON com gzip (pako)
│   │   │   └── descompactar.ts      # Descomprime e valida
│   │   ├── validadores/
│   │   │   ├── registro.validador.ts
│   │   │   ├── pausa.validador.ts
│   │   │   └── dados.validador.ts
│   │   └── constantes.ts            # Constantes da aplicação
│   │
│   ├── ganchos/                     # React hooks customizados
│   │   ├── useRegistro.ts           # Lógica CRUD registro
│   │   ├── usePausa.ts              # Lógica de pausa e cronômetro
│   │   ├── useRitmo.ts              # Cálculos de ritmo e padrões
│   │   ├── useEconomia.ts           # Cálculos de economia
│   │   ├── useArmazenamento.ts      # Interface com IndexedDB
│   │   ├── useTema.ts               # Alternância de tema
│   │   ├── useArmazemLocal.ts       # localStorage helper
│   │   └── useTamanhJanela.ts       # Breakpoint detection
│   │
│   ├── loja/                        # Context + Reducer (Gerenciamento de Estado)
│   │   ├── ContextoApp.tsx          # Context principal
│   │   ├── redutor.ts               # Redutor com ações
│   │   ├── fatias/
│   │   │   ├── fatiasRegistro.ts    # Ações para registro
│   │   │   ├── fatiasPausa.ts       # Ações para pausa
│   │   │   ├── fatiasConfig.ts      # Ações para configurações
│   │   │   └── fatiasUI.ts          # Ações para estado da UI
│   │   └── index.ts                 # Export centralizado
│   │
│   ├── componentes/                 # Componentes React
│   │   ├── layout/                  # Componentes de layout e template
│   │   │   ├── CarcacaApp.tsx       # Wrapper principal
│   │   │   ├── Cabecalho.tsx        # Cabeçalho
│   │   │   ├── Rodape.tsx           # Rodapé (mobile nav)
│   │   │   ├── Barra.tsx            # Barra lateral (desktop)
│   │   │   └── carcaca-app.module.scss
│   │   │
│   │   ├── layout/navegacao/
│   │   │   ├── NavMovel.tsx         # Bottom nav (mobile only)
│   │   │   ├── NavDesktop.tsx       # Top/side nav (desktop)
│   │   │   ├── LinkNav.tsx          # Link com estado ativo
│   │   │   └── navegacao.module.scss
│   │   │
│   │   ├── paginas/                 # Componentes de página (rotas)
│   │   │   ├── PaginaPrincipal.tsx  # Home / Tela inicial
│   │   │   ├── PaginaRegistro.tsx   # Registrar momento
│   │   │   ├── PaginaPausa.tsx      # Pausa de compasso
│   │   │   ├── PaginaRitmo.tsx      # Ritmo recente
│   │   │   ├── PaginaConfig.tsx     # Configurações
│   │   │   └── paginas.module.scss
│   │   │
│   │   ├── secoes/                  # Seções dentro de páginas
│   │   │   ├── FormRegistro/
│   │   │   │   ├── FormRegistro.tsx
│   │   │   │   ├── SeletorMetodo.tsx
│   │   │   │   ├── ChipsIntencao.tsx
│   │   │   │   ├── EscalaIntensidade.tsx
│   │   │   │   └── form-registro.module.scss
│   │   │   ├── StatusPausa/
│   │   │   │   ├── StatusPausa.tsx
│   │   │   │   ├── CronometroP.tsx
│   │   │   │   ├── ConfigPausa.tsx
│   │   │   │   └── status-pausa.module.scss
│   │   │   ├── GraficoRitmo/
│   │   │   │   ├── GraficoRitmo.tsx
│   │   │   │   ├── BarraFrequencia.tsx
│   │   │   │   ├── LinhaRitmo.tsx
│   │   │   │   └── grafico-ritmo.module.scss
│   │   │   ├── ResumoEconomia/
│   │   │   │   ├── ResumoEconomia.tsx
│   │   │   │   ├── CartaoEconomia.tsx
│   │   │   │   └── resumo-economia.module.scss
│   │   │   └── DicasReducao/
│   │   │       ├── DicasReducao.tsx
│   │   │       ├── CartaoDica.tsx
│   │   │       └── dicas.module.scss
│   │   │
│   │   ├── comum/                   # Componentes reutilizáveis
│   │   │   ├── Botao/
│   │   │   │   ├── Botao.tsx
│   │   │   │   └── botao.module.scss
│   │   │   ├── Cartao/
│   │   │   │   ├── Cartao.tsx
│   │   │   │   └── cartao.module.scss
│   │   │   ├── Modal/
│   │   │   │   ├── Modal.tsx
│   │   │   │   └── modal.module.scss
│   │   │   ├── Distintivo/
│   │   │   │   ├── Distintivo.tsx
│   │   │   │   └── distintivo.module.scss
│   │   │   ├── Chip/
│   │   │   │   ├── Chip.tsx
│   │   │   │   └── chip.module.scss
│   │   │   ├── Alterna/
│   │   │   │   ├── AlternaTema.tsx
│   │   │   │   └── alterna.module.scss
│   │   │   ├── Carregamento/
│   │   │   │   ├── Girador.tsx
│   │   │   │   ├── Esqueleto.tsx
│   │   │   │   └── carregamento.module.scss
│   │   │   ├── Vazio/
│   │   │   │   ├── EstadoVazio.tsx
│   │   │   │   └── vazio.module.scss
│   │   │   └── Abas/
│   │   │       ├── Abas.tsx
│   │   │       ├── PainelAba.tsx
│   │   │       └── abas.module.scss
│   │   │
│   │   └── icones/                  # Ícones customizados (wrapper lucide)
│   │       ├── BotaoIcone.tsx
│   │       └── icones.module.scss
│   │
│   ├── paginas/                     # Componentes de página (rotas)
│   │   ├── Principal.tsx
│   │   ├── Registro.tsx
│   │   ├── Pausa.tsx
│   │   ├── Ritmo.tsx
│   │   └── Config.tsx
│   │
│   ├── servicos/                    # Serviços e lógica de negócio
│   │   ├── servicoRegistro.ts       # CRUD e consultas para registro
│   │   ├── servicoPausa.ts          # Lógica de pausa
│   │   ├── servicoRitmo.ts          # Análise de ritmo e padrões
│   │   ├── servicoEconomia.ts       # Cálculos de economia
│   │   ├── servicoDados.ts          # Service para sincronização de dados
│   │   └── servicoNotificacao.ts    # Notificações (toast, alertas)
│   │
│   ├── App.tsx                      # Componente raiz
│   ├── main.tsx                     # Entrypoint
│   └── index.html                   # HTML base
│
├── public/                          # Ativos estáticos
│   └── manifest.json                # Manifesto PWA
│
├── vite.config.ts                   # Config Vite
├── tsconfig.json                    # Config TypeScript
├── tsconfig.app.json
├── tsconfig.node.json
├── package.json
├── package-lock.json
└── .env.example                     # Variáveis de ambiente exemplo
```

---

## 4. Camadas da Arquitetura

### 4.1. Camada de Apresentação (UI Layout & Components)

**Responsabilidade:** Renderizar interface, capturar eventos de usuário, comunicar com estado

**Subcomponentes:**
- **Templates/Layout:** `AppShell` (mobile + desktop responsivo)
- **Páginas:** Dashboard, CheckIn, Pause, Rhythm, Settings
- **Seções:** CheckInForm, PauseStatus, RhythmChart, EconomySummary
- **Componentes Comuns:** Button, Card, Modal, Badge, Chip, etc.

**Arquivos principais:**
- `src/components/layout/AppShell.tsx`
- `src/components/pages/*.tsx`
- `src/components/sections/**/*.tsx`
- `src/components/common/**/*.tsx`
- `src/components/**/*.module.scss` (estilos BEM)

### 4.2. Camada de Hooks & Lógica Interativa

**Responsabilidade:** Gerenciar lógica reativa, interações e cálculos

**Hooks customizados:**
- `useRegistro()` — criar, listar, atualizar, deletar registros
- `usePausa()` — iniciar, pausar, encerrar pausa, cronômetro
- `useRitmo()` — calcular frequência, padrões, tendências
- `useEconomia()` — calcular economia acumulada, comparações
- `useArmazenamento()` — salvar e carregar dados do IndexedDB
- `useTema()` — alternar tema escuro/claro
- `useArmazemLocal()` — helper de localStorage
- `useTamanhJanela()` — detectar pontos de corte

**Arquivos principais:**
- `src/ganchos/useRegistro.ts`
- `src/ganchos/usePausa.ts`
- `src/ganchos/useRitmo.ts`
- `src/ganchos/useEconomia.ts`
- `src/ganchos/useArmazenamento.ts`
- etc.

### 4.3. Camada de Gerenciamento de Estado (Context + Reducer)

**Responsabilidade:** Centralizar e sincronizar estado da aplicação

**Estrutura:**
- **ContextoApp.tsx** — Context que expõe estado e dispatch
- **redutor.ts** — Redutor principal que orquestra todas as ações
- **fatias/** — Separação lógica por domínio (registro, pausa, config, ui)

**Store State Structure:**
```typescript
{
  // Check-ins
  checkIns: CheckIn[],
  
  // Pausa ativa
  activePause: Pause | null,
  pauseHistory: Pause[],
  
  // Configurações
  settings: {
    economyValue: number,        // R$ gasto normalmente
    economyCurrency: string,     // BRL
    theme: 'dark' | 'light',
    notificationsEnabled: boolean,
    autoBackup: boolean
  },
  
  // UI State
  ui: {
    loading: boolean,
    sidebarOpen: boolean,
    mobileNavOpen: boolean,
    toasts: Toast[],
    modal: { isOpen: boolean; type: string; data?: any }
  },
  
  // Metadata
  lastSync: number,
  appVersion: string
}
```

**Ações disponíveis:**
- `ADD_CHECK_IN` / `UPDATE_CHECK_IN` / `DELETE_CHECK_IN`
- `START_PAUSE` / `END_PAUSE` / `RESUME_PAUSE`
- `SET_SETTING`
- `SET_THEME` / `TOGGLE_THEME`
- `SHOW_TOAST` / `HIDE_TOAST`
- `OPEN_MODAL` / `CLOSE_MODAL`
- `SET_LOADING`
- `HYDRATE_STATE` (para import de dados)

**Arquivos principais:**
- `src/store/AppContext.tsx`
- `src/store/appReducer.ts`
- `src/store/slices/*.ts`

### 4.4. Camada de Serviços & Lógica de Negócio

**Responsabilidade:** Orquestrar operações complexas, manter regras de negócio

**Services:**
- **servicoRegistro.ts**
  - `criarRegistro(dados: EntradaRegistro): Promise<Registro>`
  - `obterRegistros(filtros?: FiltroPesquisa): Promise<Registro[]>`
  - `atualizarRegistro(id: string, dados: Parcial<Registro>): Promise<Registro>`
  - `deletarRegistro(id: string): Promise<void>`
  - `obterRegistroPorId(id: string): Promise<Registro>`
  - `obterRegistrosRecentes(dias: number): Promise<Registro[]>`

- **servicoPausa.ts**
  - `iniciarPausa(duracao: number, config?: ConfigPausa): Promise<Pausa>`
  - `encerrarPausa(idPausa: string): Promise<Pausa>`
  - `obterPausaAtiva(): Promise<Pausa | null>`
  - `obterHistorioPausa(limite: number): Promise<Pausa[]>`
  - `calcularProgressoPausa(idPausa: string): Promise<ProgressoPausa>`
  - `obterEstatPausa(idPausa: string): Promise<EstatPausa>`

- **servicoRitmo.ts**
  - `obterFrequenciaPorDia(dias: number): Promise<DadosFrequencia[]>`
  - `obterFrequenciaPorSemana(semanas: number): Promise<DadosFrequencia[]>`
  - `calcularTendencia(dados: Registro[]): Promise<Tendencia>`
  - `obterPadroes(): Promise<Padrao[]>`
  - `obterInsights(): Promise<Insight[]>`

- **servicoEconomia.ts**
  - `calcularEconomiaAcumulada(idPausa: string): Promise<number>`
  - `calcularEconomiaDiaria(): Promise<number>`
  - `obterComparacoesEconomia(): Promise<Comparacao[]>`
  - `obterProjecaoEconomia(dias: number): Promise<Projecao>`

- **servicoDados.ts**
  - `exportarDados(): Promise<{ comprimido: Blob; timestamp: number }>`
  - `importarDados(arquivo: File): Promise<ResultadoImport>`
  - `validarDadosImport(dados: any): Promise<ResultadoValidacao>`
  - `fazerBackupLocal(): Promise<void>`
  - `restaurarBackupLocal(): Promise<boolean>`

- **servicoNotificacao.ts**
  - `mostrarAviso(mensagem: string, tipo: 'sucesso' | 'erro' | 'info'): void`
  - `mostrarAlerta(titulo: string, mensagem: string): Promise<boolean>`
  - `agendarNotificacao(titulo: string, opcoes?: OpcoesNotificacao): void`

**Arquivos principais:**
- `src/servicos/*.ts`

### 4.5. Camada de Persistência & Armazenamento

**Responsabilidade:** Gerenciar dados localmente (IndexedDB), import/export, compressão

**Estrutura:**

- **bd.ts** (Dexie setup)
  ```typescript
  - Tabela: registros
  - Tabela: pausas
  - Tabela: configuracoes
  - Tabela: backups
  ```

- **exportar.ts**
  - Serializa estado para JSON
  - Comprime com pako (gzip)
  - Gera Blob para download
  - Formata com timestamp

- **importar.ts**
  - Descomprime arquivo gzip
  - Valida schema
  - Restaura para IndexedDB
  - Retorna resultado com status

- **backup.ts**
  - Backup automático periódico
  - Restauração de backup
  - Limpeza de backups antigos

**Arquivos principais:**
- `src/utilitarios/armazenamento/bd.ts`
- `src/utilitarios/armazenamento/exportar.ts`
- `src/utilitarios/armazenamento/importar.ts`
- `src/utilitarios/armazenamento/backup.ts`

### 4.6. Camada de Utilitários & Helpers

**Responsabilidade:** Funções puras, formatação, validação, constantes

**Módulos:**
- **data/** — Cálculos (frequência, economia, padrões)
- **formatters/** — Formatação (datas, moeda, duração)
- **validators/** — Validação de entrada (check-in, pausa, etc)
- **compressor/** — Compressão/descompressão com pako
- **constants.ts** — Enums, valores fixos, strings

**Arquivos principais:**
- `src/utils/data/*.ts`
- `src/utils/storage/*.ts`
- `src/utils/compressor/*.ts`
- `src/utils/validators/*.ts`
- `src/utils/constants.ts`

---

## 5. Fluxos Principais

### 5.1. Fluxo de Registro (Check-in)

```
Usuario clica "Registrar Momento"
  ↓
Modal/Page FormRegistro abre
  ↓
Usuário preenche: Método, Intenção, Intensidade, Notas (opcional)
  ↓
Submete formulário
  ↓
Componente captura event → dispara hook useRegistro().criar()
  ↓
useRegistro() valida dados → chama servicoRegistro.criarRegistro()
  ↓
Service persiste no IndexedDB via bd.registros.adicionar()
  ↓
Retorna Registro criado com ID e timestamp
  ↓
Redutor atualiza estado (ADICIONAR_REGISTRO)
  ↓
Context notifica componentes subscritos
  ↓
UI atualiza: mostra aviso "Momento registrado" + retorna ao PaginaPrincipal
  ↓
PaginaPrincipal recalcula ritmo e frequência em tempo real
```

### 5.2. Fluxo de Pausa

```
Usuario clica "Iniciar Pausa"
  ↓
Modal ConfigPausa abre
  ↓
Usuário escolhe duração (24h, 48h, 7d, 14d, customizado)
  ↓
Clica confirmar
  ↓
Componente dispara hook usePausa().iniciar()
  ↓
usePausa() chama servicoPausa.iniciarPausa(duracao)
  ↓
Service cria Pausa record no IndexedDB
  ↓
Redutor atualiza INICIAR_PAUSA + armazena idPausa no Context
  ↓
PaginaPausa mostra cronômetro ativo atualizando a cada segundo
  ↓
Durante pausa: usuário pode checar economicidade, dicas, etc
  ↓
Pausa termina naturalmente (timeout) OU usuário clica "Encerrar"
  ↓
usePausa().encerrar() → servicoPausa.encerrarPausa()
  ↓
Service calcula stats (duração real, economia, etc)
  ↓
Redutor atualiza ENCERRAR_PAUSA + adiciona ao historioPausa
  ↓
UI mostra resumo da pausa (tempo, economia, feedback)
  ↓
Volta ao PaginaPrincipal ou PaginaRitmo
```

### 5.3. Fluxo de Exportação (Download)

```
Usuário vai em PaginaConfig → "Baixar meus dados"
  ↓
Clica botão "Exportar como backup"
  ↓
showDialog confirma ação
  ↓
Componente chama servicoDados.exportarDados()
  ↓
Service extrai todos os dados de IndexedDB:
  - registros[]
  - pausas[]
  - configuracoes{}
  - metadados{}
  ↓
Serializa para JSON estruturado
  ↓
Comprime com pako.gzip() → Blob binário comprimido
  ↓
Gera nome: "compasso-backup-2026-03-21.json.gz"
  ↓
Trigger download via blob URL + <a> tag
  ↓
Browser baixa arquivo .json.gz
  ↓
UI mostra aviso "Dados exportados com sucesso"
```

### 5.4. Fluxo de Importação (Upload)

```
Usuário vai em PaginaConfig → "Restaurar dados"
  ↓
Clica: "Selecionar arquivo de backup"
  ↓
File input abre, usuário escolhe .json.gz
  ↓
Componente lê arquivo → passa para servicoDados.importarDados(arquivo)
  ↓
Service descomprime com pako.ungzip()
  ↓
Parse JSON → obtém dados estruturados
  ↓
Valida schema com servicoDados.validarDadosImport()
  ↓
Se válido:
  - Cria transação no IndexedDB
  - Limpa tabelas existentes (com confirmação)
  - Insere novos dados em batch
  - Comita transação
  ↓
Se válido, retorna sucesso → Redutor dispara REIDRATAR_ESTADO
  ↓
Context atualiza estado com novos dados
  ↓
UI recalcula dashboards, gráficos, economia
  ↓
Aviso: "Dados restaurados com sucesso"
  ↓
App reinicia para garantir sincronia
```

---

## 6. Tipos TypeScript Principais

```typescript
// Registro (check-in)
interface Registro {
  id: string;                        // UUID
  timestamp: number;                 // ms desde epoch
  data: Date;                        // novo field para consultas
  metodo: 'vapor' | 'flor' | 'extracao' | 'outro';
  intencao: 'paz' | 'foco' | 'social' | 'descanso' | 'criatividade' | 'outro';
  intensidade: 'leve' | 'media' | 'alta';
  humorAntes?: number;               // 1-5 opcional
  humorDepois?: number;              // 1-5 opcional
  notas?: string;                    // observação curta
  localizacao?: string;              // contexto opcional
  companhia?: string[];              // companhia opcional
  duracao?: number;                  // minutos usado (opcional)
}

// Pausa
interface Pausa {
  id: string;
  iniciadoEm: number;
  duracaoPlanjada: number;           // ms
  duracaoReal?: number;              // ms (null se ainda ativa)
  status: 'ativa' | 'concluida' | 'interrompida';
  valorEconomia: number;             // R$ estimado na pausa
  notas?: string;
  motivoEncerramento?: string;       // por que encerrou
}

// Economia
interface DadosEconomia {
  totalAcumulado: number;            // total em R$
  taxaDiaria: number;                // R$ por dia
  economiaUltimaPausa: number;
  projecao30Dias: number;
  comparacoes: ComparacaoEconomia[];
}

// Ritmo e Padrões
interface DadosRitmo {
  frequencia7Dias: EntradaFrequencia[];
  frequencia30Dias: EntradaFrequencia[];
  tendencia: 'aumentando' | 'diminuindo' | 'estavel';
  padroes: Padrao[];
  insights: Insight[];
}

// Configurações
interface Configuracoes {
  valorEconomia: number;             // R$ gasto normalmente
  moedaEconomia: 'BRL' | 'USD';
  tema: 'escuro' | 'claro';
  temaAuto: boolean;                 // seguir preferência do SO
  notificacoesAtivas: boolean;
  sonsAtivos: boolean;
  autoBackup14Dias: boolean;         // backup automático
  diasRetencaoDados?: number;        // 365, 730, etc
}

// Estado Global
interface EstadoApp {
  registros: Registro[];
  pausaAtiva: Pausa | null;
  historioPausa: Pausa[];
  configuracoes: Configuracoes;
  ui: EstadoUI;
  metadados: {
    ultimaSincronizacao: number;
    versaoApp: string;
    criadoEm: number;
  };
}

interface EstadoUI {
  carregando: boolean;
  paginaAtual: 'principal' | 'registro' | 'pausa' | 'ritmo' | 'config';
  modal: { aberto: boolean; tipo?: string; dados?: unknown };
  avisos: Aviso[];
  barra: { aberta: boolean };
}
```

---

## 7. Componentes Principais (Breakdown)

### 7.1. Layout & Template

| Componente | Responsabilidade | Props | Estados |
|---|---|---|---|
| `CarcacaApp` | Wrapper principal, layout responsivo | `children` | navAberta, tema |
| `Cabecalho` | Cabeçalho com marca + menu | — | — |
| `NavMovel` | Bottom nav (mobile only) | — | rotaAtiva |
| `NavDesktop` | Top/side nav (desktop) | — | rotaAtiva |
| `AlternaTema` | Botão escuro/claro | — | temaCurrent |

### 7.2. Páginas (Rotas)

| Página | Rota | Função |
|---|---|---|
| PaginaPrincipal | `/` | Home, resumo, últimos registros, estado da pausa |
| PaginaRegistro | `/registro` | Formulário para registrar momento |
| PaginaPausa | `/pausa` | Tela de pausa ativa com cronômetro |
| PaginaRitmo | `/ritmo` | Gráficos, frequência, padrões, insights |
| PaginaConfig | `/config` | Configurações, tema, valor economia, export/import |

### 7.3. Seções (Reusable Blocks)

| Seção | Função | Status |
|---|---|---|
| `FormRegistro` | Formulário de registro | Componente + validação |
| `StatusPausa` | Card com estado da pausa | Mostra tempo/progresso |
| `CronometroP` | Cronômetro em tempo real | useEffect com intervalo |
| `GraficoRitmo` | Gráfico de frequência | Canvas/SVG simples |
| `ResumoEconomia` | Bloco de economia | Cartões com cálculos |
| `DicasReducao` | Dicas de redução de danos | Rotação aleatória |

### 7.4. Componentes Comuns

| Componente | Props | Exemplos |
|---|---|---|
| `Botao` | variante, tamanho, desativado, onClick | primaria, secundaria, vazia |
| `Cartao` | filhos, classe | — |
| `Modal` | aberto, titulo, aoFechar, filhos | — |
| `Distintivo` | rotulo, cor | sucesso, aviso, info |
| `Chip` | rotulo, selecionado, onClick | método, intenção |
| `Abas` | abas, abaAtiva, aoMudarAba | — |
| `EstadoVazio` | titulo, descricao, icone | — |

---

## 8. Sistema de Estilos (Sass + BEM)

### 8.1. Arquitetura de Estilos

```
estilos/
├── globals.scss              # Reset, base
├── variaveis.scss            # Cores, espacos, tipografia
├── pontosCut.scss            # Media queries
└── tema/
    ├── escuro.scss
    └── claro.scss

componentes/
├── layout/
│   └── carcaca-app.module.scss
├── paginas/
│   └── paginas.module.scss
├── secoes/
│   ├── FormRegistro/
│   │   └── form-registro.module.scss
│   └── ...
└── comum/
    ├── Botao/
    │   └── botao.module.scss
    └── ...
```

### 8.2. Convenção BEM

```scss
// Block (Bloco)
.carcaca-app { }

// Block__Element (Bloco__Elemento)
.carcaca-app__cabecalho { }
.carcaca-app__principal { }
.carcaca-app__rodape { }

// Block__Element--Modifier (Bloco__Elemento--Modificador)
.carcaca-app__principal--barra-aberta { }

// Variante de tema
.carcaca-app--escuro { }
.carcaca-app--claro { }
```

### 8.3. Pontos de Corte (Breakpoints)

```scss
// Variáveis
$pontoCorte-movel: 320px;
$pontoCorte-tablet: 768px;
$pontoCorte-desktop: 1024px;

// Mixins
@mixin media-tablet {
  @media (min-width: $pontoCorte-tablet) { @content; }
}
@mixin media-desktop {
  @media (min-width: $pontoCorte-desktop) { @content; }
}

// Uso
.meu-componente {
  // Mobile first
  font-size: 14px;
  
  @include media-tablet {
    font-size: 16px;
  }
  
  @include media-desktop {
    font-size: 18px;
  }
}
```

---

## 9. Fluxo de Dados (State Management)

### 9.1. Provider Setup

```typescript
// main.tsx
import { ProvedorApp } from './loja/ContextoApp';

root.render(
  <ProvedorApp>
    <App />
  </ProvedorApp>
);

// ContextoApp.tsx
export const ProvedorApp: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [estado, dispatch] = useReducer(redutor, estadoInicial);
  
  return (
    <ContextoApp.Provider value={{ estado, dispatch }}>
      {children}
    </ContextoApp.Provider>
  );
};
```

### 9.2. Hook de Uso

```typescript
// src/ganchos/useApp.ts
export const useApp = () => {
  const contexto = useContext(ContextoApp);
  if (!contexto) {
    throw new Error('useApp deve ser usado dentro de ProvedorApp');
  }
  return contexto;
};

// Uso em componente
const { estado, dispatch } = useApp();
const { registros, configuracoes } = estado;
```

---

## 10. Integração IndexedDB

### 10.1. Schema

```typescript
// bd.ts usando Dexie
import Dexie from 'dexie';

export const bd = new Dexie('CompassoBD');

bd.version(1).stores({
  registros: '++id, timestamp, data',        // indexed by timestamp, data
  pausas: '++id, iniciadoEm',                // indexed by iniciadoEm
  configuracoes: '++id',
  backups: '++id, criadoEm'
});

export type RegistroBD = Registro;
export type PausaBD = Pausa;
export type ConfigBD = Configuracoes;
export type BackupBD = { id?: number; criadoEm: number; dados: string; };
```

### 10.2. Queries Helper

```typescript
// utilitarios/armazenamento/bd.ts
export const consultasBD = {
  // Registros
  async obterRegistrosRecentes(dias: number) {
    const desde = Date.now() - (dias * 86400000);
    return bd.registros.where('timestamp').above(desde).toArray();
  },
  
  async obterRegistrosPorDia(data: Date) {
    const inicio = new Date(data).setHours(0,0,0,0);
    const fim = inicio + 86400000;
    return bd.registros.where('timestamp').between(inicio, fim).toArray();
  },
  
  // Pausas
  async obterPausaAtiva() {
    return bd.pausas.where('status').equals('ativa').first();
  },
  
  // Operações em massa
  async importarTudo(dados: DadosImport) {
    return bd.transaction('rw', bd.registros, bd.pausas, bd.configuracoes, async () => {
      await bd.registros.bulkAdd(dados.registros);
      await bd.pausas.bulkAdd(dados.pausas);
      await bd.configuracoes.bulkPut([dados.configuracoes]);
    });
  }
};
```

---

## 11. Compressão Gzip (Import/Export)

### 11.1. Compressor Helper

```typescript
// utilitarios/compressor/compactar.ts
import pako from 'pako';

export async function compactarDados(dados: any): Promise<Uint8Array> {
  const json = JSON.stringify(dados);
  return pako.gzip(json);
}

// utilitarios/compressor/descompactar.ts
export async function descompactarDados(comprimido: Uint8Array): Promise<any> {
  const json = pako.ungzip(comprimido, { to: 'string' });
  return JSON.parse(json);
}
```

### 11.2. Função de Exportação

```typescript
// servicos/servicoDados.ts
export async function exportarDados(): Promise<{
  blob: Blob;
  nomeArquivo: string;
  timestamp: number;
}> {
  // 1. Extrair todos os dados
  const registros = await bd.registros.toArray();
  const pausas = await bd.pausas.toArray();
  const configuracoes = await bd.configuracoes.toArray();
  
  const dadosExport = {
    versao: VERSAO_APP,
    exportadoEm: new Date().toISOString(),
    dados: { registros, pausas, configuracoes }
  };
  
  // 2. Comprimir
  const comprimido = await compactarDados(dadosExport);
  
  // 3. Gerar blob
  const blob = new Blob([comprimido], { type: 'application/gzip' });
  
  // 4. Nome com timestamp
  const agora = new Date();
  const nomeArquivo = `compasso-backup-${agora.getFullYear()}-${String(agora.getMonth()+1).padStart(2,'0')}-${String(agora.getDate()).padStart(2,'0')}.json.gz`;
  
  return { blob, nomeArquivo, timestamp: Date.now() };
}
```

### 11.3. Validação de Importação

```typescript
// servicos/servicoDados.ts
export async function validarDadosImport(dados: any): Promise<{
  valido: boolean;
  erros: string[];
}> {
  const erros: string[] = [];
  
  if (!dados.versao) erros.push('Versão não encontrada');
  if (!dados.dados) erros.push('Dados não encontrados');
  if (!Array.isArray(dados.dados.registros)) erros.push('registros inválido');
  if (!Array.isArray(dados.dados.pausas)) erros.push('pausas inválido');
  
  // Validar schema de cada registro
  dados.dados.registros.forEach((reg: any, idx: number) => {
    if (!reg.id || !reg.timestamp || !reg.metodo) {
      erros.push(`Registro inválido no índice ${idx}`);
    }
  });
  
  return {
    valido: erros.length === 0,
    erros
  };
}
```

---

## 12. Testes (Estrutura)

```
__testes__/
├── unitarios/
│   ├── utilitarios/
│   │   ├── calculos.teste.ts
│   │   └── formatadores.teste.ts
│   ├── servicos/
│   │   ├── servicoRegistro.teste.ts
│   │   └── servicoDados.teste.ts
│   └── ganchos/
│       ├── useRegistro.teste.ts
│       └── usePausa.teste.ts
├── integracao/
│   ├── fluxos/
│   │   ├── registro.fluxo.teste.ts
│   │   ├── pausa.fluxo.teste.ts
│   │   └── exportacao.fluxo.teste.ts
│   └── armazenamento/
│       ├── bd.integracao.teste.ts
│       └── import-export.teste.ts
└── componentes/
    ├── FormRegistro.teste.tsx
    └── PaginaPrincipal.teste.tsx
```

---

## 13. Variáveis de Ambiente

```
# .env.example

# App Metadata
VITE_NOME_APP=Compasso
VITE_VERSAO_APP=0.1.0
VITE_AMBIENTE=desenvolvimento

# Telemetria (Umami)
# Obtenha em https://umami.is/docs/websites
# Deixar vazio para desativar coleta
VITE_UMAMI_WEBSITE_ID=

# Storage
VITE_NOME_BD=CompassoBD
VITE_VERSAO_BD=1
```

Observacoes atuais:

- `VITE_UMAMI_WEBSITE_ID` e usado pela camada de telemetria; vazio desativa coleta.

---

## 14. Build & Deploy

### 14.1. Vite Config

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import sassl from 'rollup-plugin-sass';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    chunkSizeWarningLimit: 1000
  },
  server: {
    port: 5173,
    strictPort: false
  }
});
```

### 14.2. PWA (Manifesto)

```json
// public/manifest.json
{
  "name": "Compasso — Ritmo, Pausas e Equilíbrio",
  "short_name": "Compasso",
  "description": "Acompanhe seu ritmo, pausas e equilíbrio com privacidade radical",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#1a1a1a",
  "background_color": "#ffffff",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

---

## 15. Sequência de Desenvolvimento — TDD Pragmático

A sequência abaixo segue **TDD pragmático**: testes reais que agregam valor, não testes artificiais. O layout é definido primeiro para remover ambiguidade. Testes unitários cobrem utilitários e lógica pura. Testes de integração cobrem fluxos reais mocando apenas abstrações externas.

---

### **Fase 0: Design & Wireframes** ← Fundação
O design e layout devem ser definidos ANTES do código para evitar redesenho.

**Entregáveis:**
- [ ] Wireframes das 5 páginas principais (mobile + desktop)
  - PaginaPrincipal
  - PaginaRegistro (modal ou tela dedicada)
  - PaginaPausa (cronômetro)
  - PaginaRitmo (gráficos)
  - PaginaConfig (settings)
- [ ] Componentes básicos identificados (tamanhos, variantes)
- [ ] Fluxos de interação (entrada → ação → saída)
- [ ] Design System:
  - Paleta de cores (tema escuro/claro)
  - Tipografia (escalas)
  - Espaçamento (grid)
  - Ícones necessários (lucide-react)
  - Breakpoints (mobile, tablet, desktop)

**Rastreamento:** Miro, Figma ou similar
**Saída:** Design pronto para implementação, zero ambiguidade

---

### **Fase 1: Setup & Foundation + Unit Tests (TDD)**
Estrutura base + testes de unidades isoladas.

**Entregáveis:**
- [ ] Criar estrutura Vite + React + TypeScript
- [ ] Setup Context API + useReducer
- [ ] Configurar Sass + BEM
- [ ] Criar componentes base (Botao, Cartao, Modal, etc)
- [ ] Criar tipos principais (Registro, Pausa, etc)

**Testes Unitários (TDD Real):**
- [ ] `src/utilitarios/dados/formatacao.teste.ts`
  - Formatação de datas
  - Formatação de moeda
  - Formatação de duração
- [ ] `src/utilitarios/dados/calculos.teste.ts`
  - Cálculo de economia
  - Cálculo de frequência
  - Cálculo de tendência
- [ ] `src/utilitarios/validadores/*.teste.ts`
  - Validação de dados de Registro
  - Validação de dados de Pausa
  - Validação de importação
- [ ] Constantes e enums

**Saída:** App rodando, componentes base prontos, testes em verde ✅

---

### **Fase 2: Persistência Local + Storage Tests**
IndexedDB setup e persistência básica.

**Entregáveis:**
- [ ] Dexie setup (bd.ts com schema)
- [ ] servicoRegistro.ts (CRUD básico)
- [ ] servicoPausa.ts (CRUD básico)
- [ ] servicoDados.ts (backup/restauração)
- [ ] Hooks: useArmazenamento()

**Testes de Integração (Mock apenas BD abstração):**
- [ ] `__testes__/integracao/armazenamento/bd.integracao.teste.ts`
  - CRUD de Registros
  - CRUD de Pausas
  - Queries por data/período
  - Transações
- [ ] `__testes__/integracao/armazenamento/persistencia.teste.ts`
  - Salvar e recuperar dados
  - Validação de schema
  - Limpeza de dados antigos

**Saída:** Dados sendo salvos/recuperados corretamente ✅

---

### **Fase 3: Features Principais + Core Integration Tests**
Features do MVP integradas.

**Entregáveis:**
- [ ] Hook useRegistro() (criar, listar, atualizar, deletar)
- [ ] FormRegistro (componente + validação)
- [ ] Hook usePausa() (iniciar, encerrar, cronômetro)
- [ ] StatusPausa + CronometroP
- [ ] Hook useRitmo() (getFrequencia, calcularTendencia, getPatterns)
- [ ] Hook useEconomia() (calcularAcumulada, getProjecoes)
- [ ] PaginaPrincipal (estado, blocos principais)
- [ ] Integração com Context + Redutor

**Testes de Integração (Mock apenas IndexedDB via abstração):**
- [ ] `__testes__/integracao/fluxos/registro.fluxo.teste.ts`
  - Criar registro → salvar → atualizar state → UI reflete
  - Listar registros recentes
  - Atualizar registro existente
- [ ] `__testes__/integracao/fluxos/pausa.fluxo.teste.ts`
  - Iniciar pausa → cronômetro em tempo real
  - Encerrar pausa → calcular economia
  - Pausa interrompida
- [ ] `__testes__/integracao/estado/contexto.teste.ts`
  - Ações do redutor com estado real
  - Context com múltiplos subscribers

**Saída:** MVP funcional com dados reais, fluxos testados ✅

---

### **Fase 3.5: Revisão de Layout & UX Responsiva**
Consolidar uma linguagem mais próxima de app mobile, mas com execução sólida em telas desktop.

**Entregáveis:**
- [ ] Revisar shell principal de navegação
- [ ] Redesenhar Home com hierarquia mais clara de blocos
- [ ] Redesenhar fluxo de Registro em etapas
- [ ] Redesenhar dobra inicial da tela de Pausa
- [ ] Definir gramática visual da tela de Ritmo
- [ ] Especificar responsividade por comportamento, não só por breakpoint
- [ ] Inventariar componentes visuais e estados ativos

**Saída:** Direção visual revisada, pronta para implementação incremental ✅

---

### **Fase 4: Data Management (Export/Import) + Tests**
Backup e restauração de dados.

**Entregáveis:**
- [ ] Compressão: compactarDados() + descompactarDados() (pako)
- [ ] Export: exportarDados() (JSON → gzip → download)
- [ ] Import: importarDados() (upload → descomprimir → validar → restaurar)
- [ ] Validação de schema
- [ ] Backup automático
- [ ] Restauração de backup

**Testes de Integração:**
- [ ] `__testes__/integracao/dados/exportacao.teste.ts`
  - Estado → JSON estruturado
  - JSON → gzip comprimido
  - Download e integridade
- [ ] `__testes__/integracao/dados/importacao.teste.ts`
  - Upload → descompressão
  - Validação schema
  - Restauração em IndexedDB
  - Fallback em caso de erro
- [ ] `__testes__/integracao/dados/backup.teste.ts`
  - Backup automático periódico
  - Limpeza de backups antigos
  - Restauração bem-sucedida

**Saída:** Usuário pode fazer backup e restaurar completamente ✅

---

### **Fase 5: Visual Polish, Theme & PWA**
Refinamento visual e funcionalidade offline.

**Entregáveis:**
- [x] Tema escuro/claro (useTema + AlternaTema)
- [x] Responsividade refinada (mobile, tablet, desktop)
- [x] Animações e transições suaves
- [x] Service Worker setup
- [x] PWA manifest
- [x] Offline capability básica
- [x] Loading states + Empty states
- [x] Error handling visual

**Testes E2E:**
- [x] Alternância de tema persiste
- [x] App funciona offline
- [x] PWA instala na tela inicial
- [x] Responsividade em 3+ resoluções

**Saída:** MVP visualmente polido, online/offline, PWA ready ✅

---

### **Fase 6: Analytics & Reporting**
Dashboards e visualizações.

**Entregáveis:**
- [x] PaginaRitmo com gráficos (frequência, tendência)
- [x] ResumoEconomia detalhado
- [x] DicasReducao (rotação de dicas)
- [x] Insights baseados em padrões
- [x] Relatórios básicos

**Testes de Integração:**
- [x] `__testes__/integracao/analise/ritmo.teste.tsx`
  - Cálculo de frequência por período
  - Detecção de tendências
  - Identificação de padrões
- [x] `__testes__/integracao/analise/economia.teste.tsx`
  - Projeções de economia
  - Comparações de períodos

**Saída:** Dashboards funcionando, insights visuais ✅

---

### **Fase 7: Coverage & Refinement**
Aumentar cobertura e polir edges.

**Entregáveis:**
- [ ] Aumentar cobertura para ~80%
- [ ] Testes de edge cases
- [ ] Validação de performance
- [ ] Documentação final (JSDoc, README)
- [ ] Otimizações identificadas

**Testes:**
- [ ] Edge cases (datas extremas, valores zero, etc)
- [ ] Stress tests (1000+ registros)
- [ ] Performance profiling

**Saída:** App robusto, testado, documentado ✅

---

## 16. Filosofia: TDD Pragmático vs. TDD Dogmático

### ❌ O que NÃO fazemos (TDD Artificial)
- Teste de componente que apenas renderiza (não agrega)
- Mock de tudo (inclusive código nosso)
- Testes que testam testes
- Cobertura pela cobertura

### ✅ O que FAZEMOS (TDD Real)
- Teste unitário para lógica pura (cálculos, validadores)
- Teste de integração para fluxos (dado X, espero Y)
- Mock apenas de abstração — ex: bd.registros.obter() é mock, Index edDB interno não
- Testes que economizam tempo de debugging depois

### 🎯 Benefício Prático
```
Fase 1-2: 100% de confiança nos cálculos e storage
Fase 3: Confiança nos fluxos (UI é testada via integração)
Fase 3.5: Clareza visual antes de acelerar novas superfícies de UI
Fase 4-7: Refinamento seguro com regressão evitada
```

---

## 17. Ordem de Implementação dentro de cada Fase

Dentro de cada fase, a ordem importa:

1. **Tipos & Constantes** (base para tudo)
2. **Utilitários** (funções puras)
3. **Serviços** (lógica de negócio)
4. **Hooks** (interface com Context)
5. **Componentes** (UI)
6. **Testes** (conforme vai, não depois)

Sempre assim: **tipo → serviço → hook → componente → teste**.

---

## 18. Critério de Sucesso por Fase

| Fase | Critério | Confirmação |
|---|---|---|
| 0 | Design completo, sem ambiguidade | Design System pronto |
| 1 | App roda, componentes funcionam | `npm run dev` → funciona |
| 2 | Dados persistem corretamente | Testes de integração ✅ |
| 3 | MVP funcional end-to-end | Fluxo completo testado |
| 3.5 | Direção visual consolidada | Layout pronto para implementação |
| 4 | Export/import íntegro | Round-trip data intacta |
| 5 | Polido visualmente | Parece produção |
| 6 | Dashboards informativos | Insights geram valor |
| 7 | Robusto e documentado | Pronto para deploy |

---

## 16. Considerações Importantes

### 16.1. Performance
- Lazy load de rotas com React.lazy()
- Virtualização de listas grandes com react-window
- Memoização de componentes pesados
- Debouncing em busca e filtros

### 16.2. Compatibilidade
- Suporte IndexedDB (>95% dos browsers)
- Fallback para localStorage em caso de indisponibilidade
- Graceful degradation para features modernas

### 16.3. Segurança
- Validação rigorosa de entrada (imports)
- Sanitização de strings (DOMPurify se necessário)
- Nenhum dado sensível em URLs ou sessionStorage
- CSP (Content Security Policy) headers

### 16.4. Acessibilidade
- ARIA labels em botões e inputs
- Keyboard navigation (Tab, Enter, Escape)
- Color contrast mínimo WCAG AA
- Focus indicators visíveis

### 16.5. SEO
- Meta tags dinâmicas (title, description)
- Sitemap.xml se houver static content
- Robots.txt para crawling
- Open Graph tags para compartilhamento

---

## 17. Dependências Finais (package.json)

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.12.0",
    "dexie": "^3.2.4",
    "pako": "^2.1.0",
    "lucide-react": "^0.263.1",
    "clsx": "^2.0.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.0",
    "vite": "^4.4.0",
    "typescript": "^5.1.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "sass": "^1.63.0",
    "eslint": "^8.45.0",
    "@typescript-eslint/parser": "^5.62.0",
    "@typescript-eslint/eslint-plugin": "^5.62.0",
    "prettier": "^3.0.0",
    "vitest": "^0.34.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^5.16.0"
  }
}
```

---

## 19. Política de Nomenclatura — Português First

O projeto Compasso segue rigorosamente a política **português first** estabelecida pelo usuário para todo código, comentários, documentação e estruturas internas.

### 19.1. Regras

1. **Nomes de variáveis, funções e tipos:** sempre em português
   - ✅ `criarRegistro()`, `servicoEconomia.ts`, `Registro`, `useRitmo()`
   - ❌ `createCheckIn()`, `economyService.ts`, `CheckIn`, `useRhythm()`

2. **Nomes de arquivos e pastas:** em português (exceto extensões)
   - ✅ `servicoRegistro.ts`, `ganchos/`, `utilitarios/`
   - ❌ `checkInService.ts`, `hooks/`, `utils/`

3. **Comentários e documentação:** em português
   - ✅ `// Cria um novo registro`
   - ❌ `// Creates a new check-in`

4. **Imports consagrados:** mantêm nome original em inglês
   - ✅ `import React from 'react'`
   - ✅ `import { Dexie } from 'dexie'`
   - ❌ `import Reagir from 'reagir'` (não faz sentido)

5. **Strings visíveis ao usuário:** em português
   - ✅ `"Momento registrado com sucesso"`
   - ❌ `"Check-in created successfully"`

### 19.2. Conversões Principais

| Termo Inglês | Termo Português | Contexto |
|---|---|---|
| check-in | registro | ação de registrar momento |
| pause | pausa | intervalo programado |
| rhythm | ritmo | padrão de frequência |
| economy | economia | cálculos financeiros |
| harm reduction | redução de danos | abordagem de bem-estar |
| hook | gancho | React hook |
| component | componente | componente React |
| service | serviço | serviço de lógica |
| reducer | redutor | redutor do Context |
| state | estado | estado da aplicação |
| dispatch | despacho/dispatch | ação para o redutor |
| storage | armazenamento | persistência local |
| database | banco de dados / bd | IndexedDB |
| theme | tema | modo visual |
| modal | modal | diálogo modal |
| toast | aviso/notificação | feedback visual |

### 19.3. Convenção de Pastas em Português

```
Inglês              →  Português
src/assets          →  src/ativos
src/styles          →  src/estilos
src/types           →  src/tipos
src/utils           →  src/utilitarios
src/hooks           →  src/ganchos
src/store           →  src/loja
src/components      →  src/componentes
src/services        →  src/servicos
```

### 19.4. Benefícios da Abordagem

- ✅ Interfaceintuitiva para usuários brasileiros
- ✅ Consistência no codebase
- ✅ Reduz confusão conceitual ao misturar idiomas
- ✅ Documentação e comentários naturais
- ✅ Facilita onboarding de desenvolvedores brasileiros
- ✅ Alinha com posicionamento de marca (português natural)

---

### 18.1. Registrar Momento

**O que faz:** Captura rapidamente um momento de uso com contexto

**Campos:**
- Método (dropdown com ícones)
- Intenção (chips multi-select)
- Intensidade (escala 3-pontos)
- Notas (textarea opcional)

**Resultado:**
- Salva no IndexedDB com timestamp
- Atualiza frequência no Dashboard
- Toast de confirmação

### 18.2. Pausa de Compasso

**O que faz:** Cria um intervalo cronometrado com economia visual

**Configuração:**
- Duração pré-definida ou custom
- Valor estimado da economia
- Mensagen personalizadas

**Resultado:**
- Timer em tempo real
- Contagem regressiva
- Economia acumulada
- Dicas de HarmReduction durante pausa

---

**Fim do Documento de Arquitetura**

*Próxima etapa:* Validação dessa estrutura antes de iniciar implementação
