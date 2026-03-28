# Arquitetura do Registro — Estado Atual

**Última atualização:** 27 de março de 2026  
**Fase:** 8 (em andamento)  
**Status:** Análise de estrutura para refinamento de UX de longo prazo

---

## 1. Visão Geral e Diagrama

O fluxo de Registro é um **wizard linear de 5 etapas** que guia o usuário através de uma série de decisões curtas para registrar um momento de consumo (uso). O processo é **offline-first**, armazena tudo em IndexedDB local, e não possui caminho de bifurcação — sempre avança ou volta.

```
┌─────────────────────────────────────────────────────┐
│ FLUXO DE REGISTRO (Wizard Linear)                   │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Etapa 1 (índice 0)      →  Escolher forma de uso   │
│ Etapa 2 (índice 1)      →  Escolher intenção        │
│ Etapa 3 (índice 2)      →  Escolher intensidade     │
│ Etapa 4 (índice 3)      →  Adicionar observação     │
│ Etapa 5 (índice 4)      →  Tela de conclusão       │
│                                                     │
│ Navegação: Linear (anterior/próximo)                │
│ Salvamento: Ocorre no submit da etapa 4 (observação)│
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 2. Estrutura de Arquivos Principal

### 2.1 Página de Registro

```
src/paginas/Registro/
├── PaginaRegistro.tsx              # Componente raiz, renderiza layout e acções
├── useFluxoRegistro.ts             # Hook que gerencia todo estado do wizard
├── pagina-registro.module.scss     # Estilos da página
├── componentes/
│   └── RegistroEtapaRenderer.tsx   # Renderizador de cada etapa (switch/case)
└── config/
    └── perguntasRegistro.ts        # Definição de etapas, opções, tipagem
```

### 2.2 Camadas de Integração

```
src/ganchos/
├── useRegistro.ts                  # Hook que integra com serviço de persistência
└── useApp.ts                       # Contexto global (estado dos registros)

src/servicos/
└── servicoRegistro                 # Serviço de criação/atualização/deleção no BD

src/tipos/
└── index.ts                        # Tipos: Registro, EntradaRegistro, PerguntaRegistro
```

---

## 3. Componentes e Fluxo Detalhado

### 3.1 **PaginaRegistro.tsx** — Orquestrador Principal

**Responsabilidade:** Renderizar layout, header, formulário, acções e integrar com o hook do fluxo.

**Fluxo:**
1. Importa `useFluxoRegistro()` para obter todo o estado e funções
2. Renderiza header com título "Registrar momento"
3. Renderiza barra de progresso (indicadores visuais de quantas etapas completadas)
4. Renderiza seção da etapa atual via `RegistroEtapaRenderer`
5. Renderiza acções (botões: Voltar, Continuar, Registrar outro, Ir para início)
6. Gerencia visibilidade de acções conforme a etapa atual

**Props para RegistroEtapaRenderer:**
```typescript
interface RegistroEtapaRendererProps {
  pergunta: PerguntaRegistro      // Metadados da etapa (id, tipo, título, etc)
  form: EntradaRegistro            // Estado atual do formulário
  atualizar: (campo, valor) => void // Função para atualizar campo
  observacaoAberta: boolean         // Flag se textarea de observação está visível
  abrirObservacao: () => void      // Função para abrir textarea
  registroConcluido: EntradaRegistro | null // Dados após salvamento (para conclusão)
}
```

---

### 3.2 **useFluxoRegistro.ts** — Gerenciador de Estado do Wizard

**Responsabilidade:** Centralizar toda a lógica de estado, navegação e salvamento.

**Estado Gerenciado:**

```typescript
{
  form: EntradaRegistro             // Dados do formulário sendo preenchido
  etapaAtual: number                // Índice atual [0-4]
  observacaoAberta: boolean         // Flag se textarea de observação está visível
  registroConcluido: EntradaRegistro | null  // Referência ao último registro salvo
  aguardando: boolean               // Flag de requisição em progresso
  sucesso: boolean                  // Flag de sucesso de salvamento
  erro: string | null               // Mensagem de erro, se houver
}
```

**Estados Iniciais (ESTADO_INICIAL):**
```typescript
{
  metodo: 'vaporizado',            // Forma de uso padrão
  intencao: 'foco',                // Intenção padrão
  intensidade: 'media',            // Intensidade padrão
  humorAntes: undefined,
  humorDepois: undefined,
  notas: '',                        // Observação vazia
}
```

**Funções Principais:**

| Função | O que faz | Quando é chamada |
|--------|-----------|------------------|
| `atualizar(campo, valor)` | Atualiza um campo do formulário e limpa erros/sucesso | Cada mudança de seleção/texto |
| `avancar()` | Move para próxima etapa (itera etapaAtual +1) | Click em "Continuar" |
| `voltar()` | Volta para etapa anterior (itera etapaAtual -1) | Click em "Voltar" |
| `abrirObservacao()` | Define observacaoAberta=true (expande textarea) | Click em "Adicionar observação" |
| `handleSubmit(evento)` | Valida e **salva o registro** via `criar()` do hook useRegistro | Click em "Continuar" (etapa 4) |
| `registrarOutro()` | Reseta tudo (form inicial, etapa 0, flags) | Click em "Registrar outro momento" |

**Fluxo de Salvamento:**
1. Usuário está na etapa 4 (observação)
2. Click em "Continuar" dispara `handleSubmit`
3. `handleSubmit` chama `criar(form)` via hook `useRegistro`
4. Serviço persiste em BD (IndexedDB)
5. Estado é atualizado: `registroConcluido = form`, `etapaAtual` avança para 4 (conclusão)
6. Etapa 5 renderiza tela de conclusão

---

### 3.3 **RegistroEtapaRenderer.tsx** — Renderizador de Etapas

**Responsabilidade:** Renderizar UI diferenciada para cada tipo de etapa.

**Lógica: Switch/Case sobre tipo e id:**

1. **Etapa 1: "forma-uso"** (tipo: `escolha-unica`)
   - Grid de 4 botões icônicos (Vaporizado, Fumado, Comestível, Outro)
   - Ícones: Wind, Compass, Sparkles, Info
   - Campo: `metodo`
   - Seleção exclusiva (apenas um ativo por vez)

2. **Etapa 2: "intencao"** (tipo: `escolha-unica`)
   - Lista com 6 opções (Paz, Foco, Social, Descanso, Criatividade, Outro)
   - Ícones associados: HeartHandshake, Target, Users, Moon, Sparkles, HelpCircle
   - Campo: `intencao`
   - Seleção exclusiva

3. **Etapa 3: "intensidade"** (tipo: `escolha-unica`)
   - 3 botões: Leve, Média, Alta
   - Cada um tem descrição (ex.: "mais sutil", "intermediária", "mais intensa")
   - Campo: `intensidade`
   - Seleção exclusiva

4. **Etapa 4: "observacao"** (tipo: `texto-opcional`)
   - Inicialmente: botão "Adicionar observação"
   - Ao clicar no botão: Expande `<textarea />` (máx 500 caracteres)
   - Campo: `notas`
   - Exibe contador de caracteres
   - **Importante:** Ao clicar em "Continuar" aqui, o formulário é submetido (submit do form)

5. **Etapa 5: "conclusao"** (tipo: `conclusao`)
   - Tela estática (não renderiza nenhum input)
   - Exibe resumo em formato `<dl>` (description list):
     - Forma de uso
     - Intenção
     - Intensidade
     - Observação (opcional, só se preenchida)
   - Usa `registroConcluido` para exibir valores salvos

---

### 3.4 **perguntasRegistro.ts** — Metadados do Wizard

**Tipos Principais:**

```typescript
type TipoEtapaRegistro = 'escolha-unica' | 'texto-opcional' | 'conclusao'

interface PerguntaRegistro {
  id: string                          // Identificador único
  tipo: TipoEtapaRegistro            // Determina renderização
  titulo: string                      // Ex.: "Qual foi a forma de uso?"
  descricao: string                   // Texto de suporte
  campo?: keyof EntradaRegistro       // Campo do form atualizado
  obrigatoria: boolean                // Sem impacto atual (MVP não valida)
  opcoes?: OpcaoPerguntaRegistro[]    // Se escolha-unica
}

interface OpcaoPerguntaRegistro {
  id: string                          // Ex.: 'vaporizado'
  rotulo: string                      // Ex.: 'Vaporizado'
  valor: string                       // Ex.: 'vaporizado' (salvo no form)
  descricao?: string                  // Ex.: 'mais sutil' (para intensidade)
}
```

**Array PERGUNTAS_REGISTRO:** Define a sequência e metadados das 5 etapas.

**Opções Pré-definidas:**
- `OPCOES_FORMA_USO` — 4 formas
- `OPCOES_INTENCAO` — 6 intenções
- `OPCOES_INTENSIDADE` — 3 níveis

---

## 4. Fluxo de Dados End-to-End

```
┌──────────────────────────────────────────────────────────────────┐
│ FLUXO DE DADOS DO REGISTRO (Entrada → Persistência)              │
└──────────────────────────────────────────────────────────────────┘

1. Etapa 1: Usuário clica em "Vaporizado"
   ├─ RegistroEtapaRenderer chama: atualizar('metodo', 'vaporizado')
   ├─ useFluxoRegistro atualiza: form.metodo = 'vaporizado'
   └─ PaginaRegistro re-renderiza c/ nova seleção

2. Etapa 2: Usuário clica em "Foco"
   ├─ atualizar('intencao', 'foco')
   ├─ form.intencao = 'foco'
   └─ Re-renderiza

3. Etapa 3: Usuário clica em "Alta"
   ├─ atualizar('intensidade', 'alta')
   ├─ form.intensidade = 'alta'
   └─ Re-renderiza

4. Etapa 4: Usuário abre textarea e escreve
   ├─ atualizar('notas', 'Momento tranquilo...')
   ├─ form.notas = 'Momento tranquilo...'
   └─ Re-renderiza com contador

5. Etapa 4 (final): Usuário clica "Continuar" → submit do form
   ├─ PaginaRegistro chama: handleSubmit(evento)
   ├─ handleSubmit valida e chama: criar(form) [via useRegistro]
   ├─ Serviço cria objeto Registro com timestamp, id único
   ├─ Persiste em IndexedDB (BD local)
   ├─ Despacha ação: 'ADICIONAR_REGISTRO' (para contexto global)
   ├─ useFluxoRegistro atualiza:
   │  ├─ registroConcluido = form (salvo)
   │  ├─ etapaAtual = 4 (conclusão)
   │  └─ aguardando = false
   └─ PaginaRegistro renderiza tela de conclusão

6. Tela de Conclusão (Etapa 5)
   ├─ RegistroEtapaRenderer renderiza resumo
   ├─ Mostra: forma de uso, intenção, intensidade, observação
   └─ Botões: "Registrar outro momento" ou "Ir para o início"

7. Usuário clica "Registrar outro momento"
   ├─ registrarOutro() reseta tudo
   ├─ form = ESTADO_INICIAL
   ├─ etapaAtual = 0
   ├─ observacaoAberta = false
   ├─ PaginaRegistro volta à etapa 1
   └─ Ciclo recomeça
```

---

## 5. Integração com Camadas Externas

### 5.1 Hook `useRegistro` (src/ganchos/useRegistro.ts)

**O que faz:**
- Encapsula operações CRUD de registros
- Integra com serviço de persistência (`servicoRegistro`)
- Despacha acções para contexto global (`useApp`)

**Funções usadas no fluxo:**
- `criar(dados: EntradaRegistro): Promise<Registro>` — Salva novo registro
  - Chamada por `handleSubmit` quando usuário submit na etapa 4
  - Retorna objeto `Registro` com id, timestamp, e todos os dados

### 5.2 Contexto Global `useApp` (via `useRegistro`)

**O que é:**
- Context que centraliza estado global da app
- Mantém array de todos os `Registro` da sessão/BD

**Ação despachada:**
- `{ tipo: 'ADICIONAR_REGISTRO', payload: novoRegistro }`
- Adiciona novo registro ao array global

### 5.3 Serviço `servicoRegistro` (src/servicos/)

**O que faz:**
- Interage direto com IndexedDB (Dexie)
- Cria objetos `Registro` com id único e timestamp

---

## 6. Estrutura de Dados Persistida

### Tipo `Registro` (BD)
```typescript
interface Registro {
  id: string;                   // UUID único
  timestamp: number;            // Milissegundos desde epoch
  data: Date;                   // Objeto Date
  metodo: 'vaporizado' | 'fumado' | 'comestivel' | 'outro';
  intencao: 'paz' | 'foco' | 'social' | 'descanso' | 'criatividade' | 'outro';
  intensidade: 'leve' | 'media' | 'alta';
  humorAntes?: number;          // Futuro
  humorDepois?: number;         // Futuro
  notas?: string;               // Observação do usuário
  localizacao?: string;         // Futuro
  companhia?: string[];         // Futuro
  duracao?: number;             // Futuro
}
```

### Tipo `EntradaRegistro` (Formulário)
```typescript
interface EntradaRegistro {
  metodo: Registro['metodo'];
  intencao: Registro['intencao'];
  intensidade: Registro['intensidade'];
  humorAntes?: number;
  humorDepois?: number;
  notas?: string;
  localizacao?: string;
  companhia?: string[];
  duracao?: number;
}
```

**Diferença:**
- `Registro` tem `id`, `timestamp`, `data` (gerados pelo serviço)
- `EntradaRegistro` é apenas os dados preenchidos pelo usuário

---

## 7. Estados de Validação e Erros

**Validação Atual:**
- Nenhuma validação obrigatória implementada (mesmo com `obrigatoria: true` no tipo)
- Usuário pode avançar sem preencher nada

**Tratamento de Erro:**
- Se `criar()` falhar, `erro` é populado com mensagem
- Mensagem é exibida no `<p className={styles.mensagemErro}>`
- Usuário permanece na etapa 4 e pode tentar novamente

**Flags de Pausa/Espera:**
- `aguardando` — true durante requisição (desabilita botão "Continuar")
- `sucesso` — true após salvamento bem-sucedido (não é usado visualmente atualmente)

---

## 8. Barra de Progresso

```
Renderizada em PaginaRegistro:
├─ Mapeia PERGUNTAS_REGISTRO (5 itens)
├─ Renderiza 5 indicadores (spans)
├─ Indica como ativo (classe 'progresso__item--ativo')
│  se indice <= etapaAtual
└─ Visual: bolinhas que preenchem conforme avança
```

---

## 9. Acções (Botões) — Lógica Condicional

| Cenário | Botões Renderizados |
|---------|-------------------|
| **Etapa 0 (forma-uso)** | Nenhum "Anterior", "Continuar" |
| **Etapa 1 (intenção)** | "Voltar", "Continuar" |
| **Etapa 2 (intensidade)** | "Voltar", "Continuar" |
| **Etapa 3 (observação)** | "Voltar", "Continuar" (submit) |
| **Etapa 4 (conclusão)** | "Registrar outro", "Ir para início" |

**Detalhes:**
- Botão "Continuar" na etapa 4 é tipo `submit` (dispara `handleSubmit`)
- Botão "Voltar" nunca aparece na etapa 0
- Conclusão oferece dois caminhos: reiniciar wizard ou voltar à home

---

## 10. Peculiaridades e Pontos de Atenção Atuais

### 10.1 Observação como Etapa Separada
- A observação é uma **etapa inteira**, não um campo opcional ao lado
- Pode parecer "pesada" para um campo que é 100% opcional
- Usuário precisa clicar "Continuar" para sair da etapa de observação (mesmo que deixe em branco)

### 10.2 Salvamento Só Ocorre na Etapa 4
- Não há salvamento "progressivo" das etapas anteriores
- Se usuário voltar e mudar algo, o novo valor sobrescreve na memória
- Cancelamento = perda de dados (sem confirmação)

### 10.3 Sem Validação de Obrigatoriedade
- Tipo diz `obrigatoria: true`, mas não é enforçado
- Usuário pode avançar sem selecionar forma de uso/intenção/intensidade
- Valor padrão é usado se não preenchido

### 10.4 Sem Campos Futuros Ativos
- `humorAntes`, `humorDepois`, `companhia`, `localizacao`, `duracao` são opcionais
- Não há UI de captura para eles no MVP
- Ficam `undefined` ao salvar

### 10.5 Tela de Conclusão é Estática
- Após salvar, a tela 5 só exibe resumo
- Não há gamificação, motivação ou incentivo visual
- Seria espaço para futuros elementos (emoji, streak, frase motivacional, etc.)

---

## 11. Caminhos de Navegação Possíveis

```
Cenário 1: Fluxo Normal Completo
┌─ Etapa 0 → Etapa 1 → Etapa 2 → Etapa 3 → Etapa 4 (submit) → Etapa 5
└─ "Ir para início" → Home

Cenário 2: Usuário Volta e Muda
┌─ Etapa 0 → Etapa 1 → (voltar) → Etapa 0 → (avançar) → Etapa 1 → ...
└─ Outros dados na memória são preservados

Cenário 3: Registrar Novo Logo Após
┌─ Etapa 5 → "Registrar outro" → Etapa 0 (reset completo)
└─ Form volta a ESTADO_INICIAL

Cenário 4: Voltar para Home sem Completar
┌─ Etapa X (qualquer) → Usuário fecha/navega → Dados Perdidos
└─ Sem confirmação de descarte
```

---

## 12. Checklist de Elementos Chave

- ✅ Página: [PaginaRegistro.tsx](../../../src/paginas/Registro/PaginaRegistro.tsx)
- ✅ Hook Principal: [useFluxoRegistro.ts](../../../src/paginas/Registro/useFluxoRegistro.ts)
- ✅ Renderizador: [RegistroEtapaRenderer.tsx](../../../src/paginas/Registro/componentes/RegistroEtapaRenderer.tsx)
- ✅ Config: [perguntasRegistro.ts](../../../src/paginas/Registro/config/perguntasRegistro.ts)
- ✅ Hook de Persistência: [useRegistro.ts](../../../src/ganchos/useRegistro.ts)
- ✅ Tipos: [src/tipos/index.ts](../../../src/tipos/index.ts)
- ✅ Estilos: [pagina-registro.module.scss](../../../src/paginas/Registro/pagina-registro.module.scss)

---

## Próximos Passos Sugeridos

1. **Validação:** Implementar validação de campos obrigatórios antes de avançar
2. **Indicador Obrigatoriedade:** Visualmente diferenciar campos obrigatórios (se necessário)
3. **Tela de Conclusão:** Adicionar elementos visuais/motivacionais (emoji, frase, etc.)
4. **Campos Futuros:** Ativar captura de humor antes/depois, duração, etc.
5. **Confirmação de Descarte:** Perguntar antes de descartar dados se usuário sair no meio
6. **Otimizar Observação:** Considerar se deve ser campo inline (como "Alguma observação?" após intensidade) ou etapa separada

---

**Documento preparado para:** Planejamento de melhorias na Fase 8.9 (Melhorias Registrar Momento)
