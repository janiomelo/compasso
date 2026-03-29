# Fase 9.8 — Cobertura de Testes Críticos

**Objetivo:** Elevar cobertura de módulos críticos de <80% para ≥85-90%, priorizando segurança, estado e telemetria.

**Data de início:** 29 de março de 2026  
**Status:** Em andamento

---

## Contexto

Análise de cobertura via `npm run coverage` expôs gaps em módulos críticos:

- **Proteção (segurança):** 41.71% — não testa fluxos de unlock, KDF, timeout
- **Telemetria:** 59.37% — tracking events sem casos de edge
- **Estado (reducer):** 68.67% — branches de ações não covered
- **Hook central:** 66.66% — dispatch e context initialization
- **Pausa (UI funções):** 92.85% statements, mas **60% functions** — handlers de botão não testados
- **Serviço de pausa:** 76.27% — operações de encerrar/cancelar/interromper incompletas

---

## Objetivos por módulo

### 🔴 Critério (41.71% → 85%+)

**Arquivo:** [src/ganchos/useProtecao.ts](../../src/ganchos/useProtecao.ts)

**Cenários faltando:**
- Ativação com senha válida
- Tentativa de unlock com senha errada
- Timeout de proteção
- KDF verification paths
- Estado inicial e transições

**Arquivo de teste:** `__testes__/unitarios/ganchos/useProtecao.teste.ts` (criar)

---

### 🟠 Telemetria (59.37% → 85%+)

**Arquivo:** [src/utilitarios/telemetria/umami.ts](../../src/utilitarios/telemetria/umami.ts)

**Cenários faltando:**
- Event dispatch (view, click, custom events)
- Error handling
- Offline scenarios
- Umami client initialization

**Arquivo de teste:** `__testes__/unitarios/utilitarios/telemetria.teste.ts` (criar)

---

### 🟠 Reducer de Estado (68.67% → 85%+)

**Arquivo:** [src/loja/redutor.ts](../../src/loja/redutor.ts)

**Cenários faltando:**
- `INICIAR_PAUSA` — todas as branches
- `ENCERRAR_PAUSA` — com e sem economia
- `CANCELAR_PAUSA`
- `INTERROMPER_PAUSA`
- `COMPLETAR_ONBOARDING`
- Mutações de estado e side effects

**Arquivo de teste:** `__testes__/unitarios/loja/redutor.teste.ts` (criar/expandir)

---

### 🟡 useApp Hook (66.66% → 85%+)

**Arquivo:** [src/ganchos/useApp.ts](../../src/ganchos/useApp.ts)

**Cenários faltando:**
- Context initialization
- Dispatch call paths
- Error scenarios

**Arquivo de teste:** `__testes__/unitarios/ganchos/useApp.teste.ts` (criar)

---

### 🟡 Pausa — Funções (60% → 85%+)

**Arquivo:** [src/paginas/Pausa/PaginaPausa.tsx](../../src/paginas/Pausa/PaginaPausa.tsx)

**Handlers faltando cobertura:**
- `iniciarPausa()`
- `encerrarPausa()`
- `interromperPausa()`
- `cancelarPausa()`
- Estados de erro e loading
- Branches condicionais por `interromperDisponivel`, `cancelarDisponivel`

**Arquivo de teste:** [__testes__/ui/pausa.teste.tsx](../../__testes__/ui/pausa.teste.tsx) (expandir)

---

### 🟡 Serviço de Pausa (76.27% → 85%+)

**Arquivo:** [src/servicos/servicoPausa.ts](../../src/servicos/servicoPausa.ts)

**Cenários faltando:**
- Encerramento com economia
- Cancelamento com rollback
- Interrupção com histórico
- Casos de erro com BD

**Arquivo de teste:** `__testes__/unitarios/servicos/servicoPausa.teste.ts` (expandir)

---

## Ordem de execução

1. ✅ **Fase 9.8.1** — `useProtecao.ts` (segurança crítica)
2. ✅ **Fase 9.8.2** — `umami.ts` (isolado, baixo risco)
3. ✅ **Fase 9.8.3** — `redutor.ts` (estado central)
4. ✅ **Fase 9.8.4** — `useApp.ts` (context hook)
5. ✅ **Fase 9.8.5** — `PaginaPausa.tsx` (handlers de UI)
6. ✅ **Fase 9.8.6** — `servicoPausa.ts` (serviço de domínio)

---

## Acceptance criteria

- [ ] `npx vitest run` — **todos 191 testes passando**
- [ ] `npm run coverage` — **todos os módulos ≥85% (linhas e funções)**
- [ ] Type-check: `npm run type-check` — **sem erros**
- [ ] Lint: `npm run lint` — **sem avisos**
- [ ] Build: `npm run build` — **sem erros**
- [ ] Commits atômicos com referência para cada fase

---

## Notas de implementação

- Seguir convenções em [.github/instructions/testing.instructions.md](.github/instructions/testing.instructions.md)
- Usar mocks via `vi.mock()` para Dexie, Umami, crypto
- Testes em português, nomes descritivos
- Não testar detalhes de implementação — testar comportamento observável
- Casos de borda e stress tests incluídos
- Zero warnings de lint em arquivos novos

---

## Referências

- [Workflow de validação de testes](../agents/workflows/testing-validation.md)
- [Instruções de testes](.github/instructions/testing.instructions.md)
- [Coverage report](../../coverage/coverage-summary.json)
