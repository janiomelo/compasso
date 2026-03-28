# Instruções gerais — GitHub Copilot

Este arquivo define o comportamento padrão do Copilot em todo o repositório.
Instruções detalhadas por domínio estão em `.github/instructions/`.

---

## Identidade do projeto

**Compasso** é um utilitário web mobile-first de autoconsciência e equilíbrio de hábitos.
O produto é focado em privacidade local, redução de danos e linguagem brasileira acessível.
Não é ferramenta clínica, não substitui orientação médica, não tem backend obrigatório no MVP.

Para contexto completo de produto, arquitetura e decisões:
→ `docs/agents/README.md`

---

## Regras que sempre se aplicam

### Português first

- Interfaces públicas, parâmetros, variáveis de domínio e documentação **em português**.
- Termos técnicos consagrados (ex.: `useState`, `localStorage`, `gzip`) ficam em inglês.
- Nunca exibir IDs técnicos diretamente na UI.
- Antes de qualquer mudança em texto visível, conferir acentuação, cedilha e pontuação.

### Tom e linguagem

- Sem tom moralista, clínico ou proibicionista.
- Texto de interface deve soar humano, discreto e cotidiano.
- Sem jargões de "detox", "limpar", "largar o vício".

### Privacidade por padrão

- Dados do usuário ficam em IndexedDB local (via Dexie). Nunca enviar para servidor externo.
- Nenhum rastreador, analytics externo ou cookie de terceiros.
- Qualquer exceção a essa regra exige ADR documentado em `docs/decisions/`.

### Qualidade

- Gate obrigatório antes de qualquer commit com mudanças funcionais:
  ```bash
  npm run type-check && npm run lint && npm run build && npm run coverage
  ```
- Thresholds mínimos de cobertura estão definidos em `vitest.config.ts`.
- Zero warnings de lint são aceitos.

---

## Instrução detalhada por domínio

| Domínio | Arquivo |
|---|---|
| Produto e contexto | `.github/instructions/product.instructions.md` |
| Implementação e código | `.github/instructions/implementation.instructions.md` |
| Testes e cobertura | `.github/instructions/testing.instructions.md` |
| UI e componentes | `.github/instructions/ui.instructions.md` |
| Documentação | `.github/instructions/docs.instructions.md` |
