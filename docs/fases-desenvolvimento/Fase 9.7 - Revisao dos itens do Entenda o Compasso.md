## Fase 9.7 — Revisão dos itens do "Entenda o Compasso"

Status: aprovado para implementação
Data: 29/03/2026

---

## 1. Contexto

A seção "Entenda o Compasso" existe na página principal como um pós-onboarding: guia o usuário recém-chegado a entender onde as coisas estão e a configurar o que importa antes de usar de verdade. O completismo não é o objetivo — o objetivo é que o usuário saia com confiança nas configurações de privacidade e segurança.

O critério de permanência de um item é:

> **É importante E não foi coberto no onboarding? Ou é importante o suficiente para pedir uma segunda vez?**

Se não passar nesse filtro, o item sai.

---

## 2. O que o onboarding cobre hoje

O onboarding tem 3 etapas:

| Etapa | O que aborda |
|---|---|
| 1 — Bem-vindo | O que o app faz, link opcional para `/projeto` |
| 2 — Antes de continuar | Limites do produto (não clínico, não terapêutico), confirmação de maioridade |
| 3 — Aceite e entrada | Aceite de Termos e Política de Privacidade; menção genérica: "seus registros ficam neste dispositivo" |

**O que o onboarding não cobre com profundidade:**
- Como os dados ficam salvos na prática (IndexedDB, criptografia opcional, limites)
- Que a telemetria começa ativada e pode ser desativada
- Que existe proteção por senha e como configurar

---

## 3. Análise item a item

### Item 1 — "Conheça o app" → `/como-funciona`

- **O que é:** Página pública estática explicando funcionamento técnico (exportação, backup, limites de segurança do ambiente local).
- **Coberto no onboarding:** Não. Mas o onboarding já introduz o produto em linguagem acessível.
- **È importante o suficiente?** Não. Quem quer aprofundar vai encontrar essa página por curiosidade navegando nas configs. Não há ação real — a conclusão é apenas "marcar como lido". O título "Conheça o app" é genérico demais.
- **Decisão: remover.**

### Item 2 — "Como seus dados ficam salvos" → `/config/dados-locais-seguranca`

- **O que é:** Tela de configuração explicando o armazenamento local, a criptografia opcional e os limites.
- **Coberto no onboarding:** Parcialmente, só com "seus registros ficam neste dispositivo". Sem profundidade.
- **É importante o suficiente?** Sim. É o "por que você pode confiar" — diretamente ligado ao princípio de privacidade local. Tem profundidade técnica relevante para quem quer entender antes de depositar dados.
- **Decisão: manter.**

### Item 3 — "Telemetria anônima" → `/config`

- **O que é:** Link para as Configurações, onde o usuário pode revisar e alterar o consentimento de telemetria.
- **Coberto no onboarding:** O onboarding ativa a telemetria por padrão ao concluir, sem apresentar uma escolha explícita ao usuário. O usuário aceita os Termos mas não toca conscientemente nesse interruptor.
- **É importante o suficiente?** Sim. A telemetria estar ativa por padrão sem escolha explícita torna esse item o mais crítico da seção — é onde o produto pede uma segunda atenção deliberada.
- **Decisão: manter.**

### Item 4 — "Proteção por senha" → `/config`

- **O que é:** Link para as Configurações, onde o usuário pode ativar criptografia local com senha.
- **Coberto no onboarding:** Não. Não é mencionado em nenhuma etapa.
- **É importante o suficiente?** Sim. É uma ação real com consequência real (dados criptografados), não foi apresentada antes, e é diretamente ligada à promessa de privacidade do produto.
- **Decisão: manter.**

### Item 5 — "Uso e limites do projeto" → `/projeto`

- **O que é:** Página pública institucional sobre o que o produto é e não é.
- **Coberto no onboarding:** Sim — o onboarding tem link opcional para `/projeto` na etapa 1 ("Entender melhor o projeto").
- **É importante o suficiente para pedir de novo?** Não. O onboarding já cobre os limites do produto em linguagem direta na etapa 2. Repetir como item de checklist enfraquece o sinal dos outros.
- **Decisão: remover.**

---

## 4. Resultado aprovado

De 5 para 4 itens:
- 3 com ligação direta à privacidade e configuração;
- 1 com ação de uso real do produto (primeiro registro).

| Ordem | Título atual | Decisão |
|---|---|---|
| 1 | Conheça o app | **Remover** |
| 2 | Como seus dados ficam salvos | Manter |
| 3 | Telemetria anônima | Manter |
| 4 | Proteção por senha | Manter |
| 5 | Uso e limites do projeto | **Remover** |

### Novo item adicionado

| Novo item | Destino | Motivo |
|---|---|---|
| Registrar primeiro momento | `/registro` | Reforça ação prática central do produto e reduz checklist puramente informativo |

### Nota sobre "Apoie / Doe"

A ideia de um item de colaboração/doação foi considerada. Para esta seção específica, a recomendação é **não** incluir doação no checklist inicial, para manter o foco em confiança, privacidade e ativação do uso. O CTA de apoio pode existir em áreas institucionais (ex.: página `/apoie`) sem competir com o fluxo de entrada.

---

## 5. Impactos técnicos

- Remover os itens `conhecaApp` e `usoLimites` do array `itens` em `SecaoEntendaCompasso.tsx`
- Remover as chaves `conhecaApp` e `usoLimites` do tipo `EstadoVistos`
- Adicionar o item `primeiroRegistro` apontando para `/registro`, com conclusão automática quando existir ao menos um registro
- Ajustar o texto do `resumoFechado` para refletir os 4 itens
- Atualizar os testes que verificam contagem de itens ou textos relacionados
- Verificar se os ícones seguem coerentes com os novos itens

---

## 6. Critérios de conclusão

- [x] Array `itens` ajustado para 4 entradas
- [x] Tipo `EstadoVistos` atualizado
- [x] Imports de ícones ajustados
- [ ] Testes atualizados e passando
- [ ] Gate de qualidade completo (`type-check`, `lint`, `build`, `coverage`)
