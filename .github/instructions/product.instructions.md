---
applyTo: "**"
---

# Produto e contexto — Compasso

> Instrução de suporte ao Copilot. Para o documento completo de produto: `docs/agents/product-context.md`

---

## O que é o Compasso

Utilitário web mobile-first de autoconsciência e equilíbrio de hábitos. O produto ajuda pessoas que mantêm um consumo recorrente a entender seus padrões, programar pausas e perceber ganhos de bem-estar e economia — sem peso de culpa e sem linguagem clínica.

---

## O que não é

- Ferramenta clínica ou de diagnóstico.
- Substituto de orientação médica ou psicológica.
- Plataforma de compra, venda ou intermediação.
- Comunidade de discussão de produto ou substância.

---

## Público-alvo e tom

Pessoa adulta brasileira que consome algo recorrentemente e quer mais equilíbrio, não abstinência forçada. Tom: humano, discreto, cotidiano. Linguagem próxima, não traduzida, sem jargão técnico ou importado.

---

## Princípios inegociáveis

| Princípio | O que significa na prática |
|---|---|
| Privacidade por padrão | Dados só no dispositivo; sem backend; sem rastreador |
| Offline-first no MVP | Funciona sem internet; PWA habilitado |
| Sem julgamento | Interface não qualifica "uso bom" ou "uso ruim" |
| Linguagem brasileira | Português com acento, sem anglicismos desnecessários |
| Evolução incremental | Nenhuma feature entra sem gate de qualidade |

---

## Fases do produto

- **MVP (concluído):** Registro, pausa, ritmo, economia, configurações, backup, exportação/importação.
- **Fase 8 (em andamento):** Refinamento de UX de longo prazo, linguagem visual iconográfica, intensidade em três níveis.
- **Próximas:** Telemetria opt-in, compartilhamento controlado, planejamento de pausa.

---

## Restrições de produto permanentes

- Dados não saem do dispositivo sem ação explícita e consentida do usuário.
- Nenhuma tela deve exibir IDs técnicos, enums ou chaves de banco diretamente.
- Qualquer exceção às restrições de privacidade exige ADR em `docs/agents/decisions/`.
