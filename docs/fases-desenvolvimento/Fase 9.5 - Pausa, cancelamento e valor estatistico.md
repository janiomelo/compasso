## Fase 9.5 - Pausa, cancelamento e valor estatístico

Status: proposta para validação conjunta
Data: 29/03/2026

---

## 1. Contexto

A tela de Pausa precisa equilibrar dois objetivos:

- ser um controle pessoal flexível e sem julgamento;
- gerar histórico útil para leitura de padrões.

No produto, a pausa já foi posicionada como espaço de acompanhamento e controle (não punitivo), com linguagem clara e acolhedora.

---

## 2. Pergunta central

Faz sentido exigir pausas mínimas longas (4h ou 6h) para serem válidas?

Resposta recomendada: **não como regra obrigatória de registro**.

Motivo:

- pausas curtas também podem ter valor comportamental;
- limite de horas alto aumenta frustração e reduz adesão;
- produto é de uso pessoal, não de certificação de meta;
- no início, reduzir atrito vale mais do que filtrar agressivamente.

---

## 3. O que queremos preservar

- clareza sem ambiguidade entre concluir e cancelar;
- histórico com sinal útil (menos ruído);
- ausência de culpa para tentativa curta;
- consistência com os fundamentos de redução de danos e linguagem não moralista.

---

## 4. Opções avaliadas

### Opção A - Sem limite de tempo para concluir

- Pro: simples de explicar.
- Contra: histórico pode receber muitas pausas com pouca qualidade analítica.

### Opção B - Limite alto (4h ou 6h) para concluir

- Pro: histórico mais "limpo" em tese.
- Contra: rígido para uso real; desestimula tentativa curta; piora percepção de controle pessoal.

### Opção C - Limite curto operacional (recomendado)

- Pro: reduz ruído sem punir tentativa; fácil de entender.
- Contra: ainda exige explicação de regra na UI.

---

## 5. Recomendação de produto (Fase 9.5)

Manter a lógica com **limite curto** para qualidade mínima do registro.

Regra recomendada:

1. `Concluir pausa`:
- fica disponível após tempo mínimo.
- registra como `concluida`.

2. `Cancelar pausa` com tempo menor que minimo:
- encerra sem registrar no histórico principal.
- comunica: "não foi salvo no histórico".

3. `Cancelar pausa` com tempo igual ou maior que minimo:
- registra no historico como `interrompida`.

Tempo mínimo recomendado:

- **padrão: 5 minutos** (já consistente com implementação atual);
- alternativa de evolução: 10 ou 15 minutos, se houver evidências de ruído excessivo.

Não recomendado no MVP:

- limite de 4h/6h para validar pausa;
- configuração avançada de limite por usuário sem antes validar demanda.

---

## 6. Tentativas "valem"?

Sim, mas com leitura correta.

- tentativa muito curta vale para autoconsciência do momento;
- não precisa poluir histórico principal de desempenho de pausa;
- pode virar métrica secundária futura (ex.: contador local de tentativas curtas), sem destaque punitivo.

Diretriz de linguagem:

- evitar termos como "falha", "erro", "quebrou";
- preferir "tentativa", "ciclo curto", "não foi para o histórico".

---

## 7. Quando registra no histórico

Tabela de regra:

| Ação | Tempo decorrido | Resultado | Histórico |
|---|---|---|---|
| Concluir pausa | >= minimo | conclui ciclo | registra `concluida` |
| Cancelar pausa | < minimo | descarta ciclo | não registra |
| Cancelar pausa | >= minimo | interrompe ciclo | registra `interrompida` |

---

## 8. Configurável ou fixo?

Recomendação por fase:

- MVP/Fase 9.5: **fixo** (5 minutos).
- Fase futura: opção "avançada" com presets discretos (5, 10, 15), se houver evidências em pesquisa qualitativa.

Risco de configurar cedo demais:

- aumenta carga cognitiva;
- dificulta suporte e comparação de comportamento;
- adiciona complexidade antes da necessidade real.

---

## 9. Critérios de validação conjunta

1. Usuário entende, sem dúvida, diferença entre concluir e cancelar.
2. Usuário sabe quando algo entra ou não no histórico.
3. Mensagem de cancelamento curto e clara e sem culpa.
4. Histórico fica útil para leitura de padrão sem excesso de ruído.
5. Linguagem da tela de Pausa permanece humana e objetiva.

---

## 10. Plano de validação (curto)

1. Rodar revisão de copy e UX na tela de Pausa com foco em clareza sem ambiguidade.
2. Validar cenários de 0-5 min, 5-15 min e >= meta em testes de UI e integração.
3. Revisar impacto no histórico recente da Home (densidade e legibilidade).
4. Coletar feedback qualitativo interno sobre entendimento das regras.
5. Confirmar se 5 min permanece adequado ou se deve ir para 10 min.

---

## 11. Decisão proposta para fechamento da Fase 9.5

- manter limite curto de qualidade do registro (padrão 5 min);
- manter concluir/cancelar com semântica explícita;
- manter cancelamento curto sem histórico;
- registrar cancelamento acima do limite como interrompida;
- adiar configurabilidade de limite para fase posterior, condicionada a evidências.
