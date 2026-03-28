## Como ficaria a primeira tela

Hoje ela está bonita, mas ainda muito “leve” para descoberta. Eu faria ela responder em poucos segundos:

- o que é o Compasso
- para quem serve
- o que a pessoa vai fazer ali
- qual é o cuidado com privacidade

Algo nessa linha:

**Bem-vindo ao Compasso**  
Um espaço para registrar momentos, acompanhar pausas e observar seu ritmo com mais clareza, sem anúncios e com privacidade por padrão.

Ou:

**Bem-vindo ao Compasso**  
O Compasso ajuda você a registrar seu dia, perceber padrões e acompanhar seu ritmo de forma simples e privada.

E abaixo:

- **Começar**
- **Entender melhor o projeto**

---

## Plano de implementação

### Objetivo

Fazer a etapa inicial do onboarding responder em poucos segundos:

- o que é o Compasso;
- para quem ele serve;
- o que a pessoa fará no app;
- como a privacidade funciona na prática.

### Escopo desta fase

- Ajustar microcopy da etapa 1 do onboarding.
- Reforçar promessa de privacidade sem tom clínico.
- Preservar visual e fluxo já existentes.
- Garantir consistência com testes atuais.

Fora de escopo nesta fase:

- redesenho completo do onboarding;
- mudança no número de etapas;
- inclusão de telemetria externa;
- alteração de estratégia de persistência.

### Arquivos envolvidos

| Arquivo | Papel na mudança |
|---|---|
| `src/paginas/Onboarding/PaginaOnboarding.tsx` | Copy da etapa 1 e CTA secundária |
| `src/paginas/Onboarding/pagina-onboarding.module.scss` | Ajustes finos de espaçamento/leitura, se necessário |
| `__testes__/ui/onboarding.teste.tsx` | Validação da nova mensagem e CTA |
| `docs/fases-desenvolvimento/Fase 8.10 - SEO.md` | Histórico e critérios da fase |

### Backlog por entrega

#### Entrega 1 — Microcopy da etapa 1

Implementar uma versão final do bloco inicial com esta estrutura:

- título: **Bem-vindo ao Compasso**;
- parágrafo: explicar utilidade, simplicidade e privacidade local;
- botões: **Começar** e **Entender melhor o projeto**.

Critérios de aceite:

- texto não moralista, sem jargão clínico;
- leitura clara em mobile;
- mensagem de privacidade explícita e objetiva.

#### Entrega 2 — Ajustes de hierarquia visual (conservadores)

Somente se necessário após revisão da copy:

- aumentar contraste do parágrafo da etapa 1;
- ajustar espaçamento entre título, descrição e CTAs;
- manter padrão visual já estabelecido no onboarding.

Critérios de aceite:

- nenhuma quebra de layout em 375px;
- sem regressão em desktop;
- sem alterar identidade visual global.

#### Entrega 3 — Testes e validação

Atualizar e complementar testes de onboarding para refletir a nova copy:

- presença de **Bem-vindo ao Compasso**;
- presença de **Começar**;
- presença de **Entender melhor o projeto**;
- fluxo segue navegando para etapa 2 sem regressão.

Critérios de aceite:

- testes de onboarding passando;
- build sem erro;
- lint e type-check sem warnings.

### Sequência recomendada de execução

1. Ajustar texto da etapa 1 em `PaginaOnboarding.tsx`.
2. Rodar testes de onboarding.
3. Ajustar SCSS apenas se a leitura ficar comprimida.
4. Reexecutar lint, type-check, build e cobertura.
5. Fazer revisão final de texto (acentuação, tom e clareza).

### Checklist operacional

- [x] Copy da etapa 1 atualizada.
- [x] CTA secundária mantida para página de contexto do projeto.
- [x] Mensagem de privacidade clara na primeira dobra.
- [x] Testes de onboarding atualizados.
- [x] `npm run type-check` sem erro.
- [x] `npm run lint` sem warning.
- [x] `npm run build` sem erro.
- [x] `npm run coverage` dentro do threshold.

### Métricas de sucesso (qualitativas e de produto)

- Menos dúvidas sobre "o que é o Compasso" no primeiro acesso.
- Menor abandono entre etapa 1 e etapa 2 do onboarding.
- Menos confusão sobre privacidade e uso local dos dados.

### Riscos e mitigação

| Risco | Mitigação |
|---|---|
| Copy ficar longa demais para mobile | Limitar a 1 parágrafo curto e revisar quebra de linha em 375px |
| Privacidade ficar implícita demais | Incluir expressão explícita: "privacidade por padrão" |
| Regressão em testes por texto rígido | Atualizar asserts para as novas strings oficiais |

### Definição de pronto

A fase é considerada concluída quando:

- a etapa 1 comunica valor + público + ação + privacidade em poucos segundos;
- o fluxo completo de onboarding continua funcionando;
- os testes e gates de qualidade passam integralmente.