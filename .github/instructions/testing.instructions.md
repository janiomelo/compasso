---
applyTo: "src/**/*.test.*,src/**/*.spec.*,src/**/__tests__/**"
---

# Testes e cobertura — Compasso

> Para o workflow completo de validação: `docs/agents/workflows/testing-validation.md`

---

## Stack de testes

- **Vitest** — runner e assertions
- **@testing-library/react** — renderização e interações de componente
- **@testing-library/user-event** — simulação de eventos realistas
- **@vitest/coverage-v8** — cobertura via V8

---

## Thresholds mínimos

| Métrica | Mínimo |
|---|---|
| Linhas | 60% |
| Funções | 60% |
| Branches | 55% |
| Declarações | 60% |

Os thresholds são aplicados automaticamente via `vitest.config.ts`. A CI falha se não forem atingidos.

---

## O que testar

### Obrigatório

- **Utilitários e serviços puros:** cobertura alta (80%+). Funções de cálculo, formatação, validação.
- **Hooks de domínio:** comportamento sob estado inicial, mutações e casos de borda.
- **Fluxos críticos de UI:** Registro, Pausa, operações de dados (backup, exportação, importação, restauração).
- **Componentes com lógica de exibição condicional:** testar cada branch visível.

### Não obrigatório (mas bem-vindo)

- Páginas puramente informativas sem lógica (ex.: `PaginaSobreProjeto`, `PaginaLicencasCreditos`).
- Estilos SCSS e classes CSS.

---

## Convenções

- Arquivos de teste adjacentes ao código: `PaginaRegistro.test.tsx` na mesma pasta de `PaginaRegistro.tsx`.
- Descrever em português o que o teste verifica: `it('deve registrar um uso com sucesso')`.
- Não testar detalhes de implementação — testar comportamento observável.
- Usar `screen.getByRole`, `getByText`, `getByLabelText` em preferência a `getByTestId`.
- Mocks de `bd` (Dexie) encapsulados em `src/__mocks__/` ou via `vi.mock`.

---

## Comandos

```bash
npm test              # modo watch (desenvolvimento)
npm run coverage      # relatório completo (CI e pre-commit)
```

---

## Stress tests e edge cases

- Testes com volume alto de registros (1200+) para utilitários de cálculo.
- Importação de arquivo corrompido deve ser testada com rollback transacional.
- Cenários de banco vazio e banco com dados legados devem ter cobertura.
