# Contexto de produto — Compasso

**Última atualização:** março de 2026

---

## O que é

Compasso é um utilitário web mobile-first de autoconsciência e equilíbrio de hábitos. Ajuda pessoas que mantêm um consumo recorrente a entender seus padrões, programar pausas e perceber ganhos de bem-estar e economia — sem linguagem moralista ou clínica.

---

## Problema que resolve

Quem procura ferramentas digitais nesse espaço normalmente encontra:

- Apps com narrativa de "parar de vez", focados em abstinência total.
- Apps técnicos voltados a nicho específico (cultivo, produto, etc.).
- Anotações improvisadas em bloco de notas ou planilha.
- Conteúdos dispersos sobre pausas, hidratação e hábitos, sem organização prática.

O Compasso ocupa o espaço intermediário: **leve, privado e útil para o dia a dia**.

---

## Proposta de valor

O produto ajuda a pessoa usuária a:

- Registrar rapidamente o contexto de uso.
- Entender padrões pessoais sem precisar de interpretação externa.
- Programar pausas curtas ou mais longas.
- Perceber ganhos de bem-estar e economia ao longo do tempo.
- Acompanhar o hábito sem sensação de julgamento.

---

## O que não é

| O produto não é | Por quê importa |
|---|---|
| Ferramenta clínica | Não diagnóstica, não prescreve, não acompanha tratamento |
| Substituto de orientação médica | Limites claros na UI e na documentação |
| Plataforma de compra/venda | Sem intermediação, sem marketplace |
| Comunidade de discussão de produto | Não há fórum, chat ou espaço social |
| App de abstinência | Redução de danos, não abstinência como meta única |

---

## Público-alvo

Pessoa adulta brasileira que:

- Consome algo recorrentemente (substância, hábito ou comportamento).
- Quer mais equilíbrio e autoconsciência, não necessariamente parar.
- Valoriza privacidade e desconfia de apps que coletam dados.
- Prefere linguagem próxima e sem jargão clínico ou importado.

---

## Princípios inegociáveis

### Privacidade por padrão

Dados do usuário ficam no dispositivo. Nunca enviados a servidor sem ação explícita e consentida. Nenhum rastreador, analytics externo ou cookie de terceiros.

### Offline-first no MVP

O produto funciona sem internet. PWA habilitado com service worker básico.

### Sem julgamento

A interface não qualifica "uso bom" ou "uso ruim". Sem mensagens de culpa, conquistas gamificadas por abstinência ou comparações sociais.

### Linguagem brasileira

Português com acentuação correta, culturalmente próximo, sem tradução literal de conceitos importados.

### Evolução incremental

Nenhuma feature entra sem gate de qualidade completo. Progresso documentado por fases.

---

## Fases do produto

| Fase | Status | Escopo |
|---|---|---|
| 1–3 | Concluída | Registro, pausa, layout base |
| 4 | Concluída | Exportação/importação, backup, restauração |
| 5 | Concluída | PWA, offline, tema claro/escuro |
| 6 | Concluída | Ritmo, economia, dicas de redução de danos |
| 7 | Concluída | Cobertura de testes, lazy loading, documentação |
| 8 | Em andamento | Linguagem visual iconográfica, intensidade em três níveis |

---

## Limites permanentes

- Dados não saem do dispositivo sem ação explícita do usuário.
- IDs técnicos nunca são exibidos na UI.
- Nenhuma dependência com impacto em privacidade sem ADR aprovado.
- Sem funcionalidades que requeiram conta obrigatória no MVP.
