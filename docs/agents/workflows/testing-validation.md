# Testes e validação

Este documento descreve a estratégia de testes do Compasso e os critérios de validação antes de considerar uma funcionalidade pronta.

---

## Stack de testes

| Ferramenta | Uso |
|---|---|
| Vitest | Runner, assertions, mocks |
| @testing-library/react | Renderização e queries de componente |
| @testing-library/user-event | Simulação realista de interação |
| @vitest/coverage-v8 | Relatório de cobertura |

---

## Thresholds mínimos obrigatórios

| Métrica | Mínimo |
|---|---|
| Linhas | 60% |
| Funções | 60% |
| Branches | 55% |
| Declarações | 60% |

Definidos em `vitest.config.ts`. A CI falha se não forem atingidos.

---

## O que deve ter cobertura

### Obrigatório

- Utilitários de cálculo (`src/utilitarios/`): cobertura alta (80%+), incluindo edge cases.
- Serviços de dados (`src/servicos/`): todas as funções principais.
- Hooks de domínio (`src/loja/`): comportamento sob estado inicial, mutações, erros.
- Fluxos críticos de UI: Registro, Pausa, backup, exportação, importação, restauração.
- Lógica condicional de componentes: cada branch visível deve ter teste.

### Opcional

- Páginas puramente informativas sem lógica de estado.
- Estilos SCSS.
- Componentes de layout puro.

---

## Padrões de escrita de teste

```typescript
// Descritivo em português
describe('useArmazenamento', () => {
  it('deve exportar os dados em formato gzip', async () => { ... })
  it('deve rejeitar arquivo corrompido na importação', async () => { ... })
})
```

- Testar comportamento observável, não detalhes de implementação.
- Preferir `getByRole`, `getByText`, `getByLabelText` a `getByTestId`.
- Mocks de Dexie centralizados em `src/__mocks__/` ou via `vi.mock`.
- Sem `it.only` ou `describe.only` commitado.

---

## Casos de borda obrigatórios

- Banco vazio (primeira execução).
- Banco com dados de versão anterior (migração).
- Arquivo de importação corrompido (rollback).
- Volume alto de registros (1200+) para cálculos de ritmo e economia.
- Estado offline durante operações que dependem de recursos locais.

---

## Comandos

```bash
npm test                  # watch mode (desenvolvimento)
npm run coverage          # relatório completo (CI e pre-commit)
```

---

## Critérios de validação antes de considerar pronto

- [ ] Gate completo passando: `type-check && lint && build && coverage`.
- [ ] Thresholds de cobertura atingidos.
- [ ] Nenhum teste em `skip` ou `only`.
- [ ] Casos de borda relevantes para a funcionalidade têm cobertura.
- [ ] Validação manual do fluxo em mobile (375px).
- [ ] Nenhum erro de console no navegador.
