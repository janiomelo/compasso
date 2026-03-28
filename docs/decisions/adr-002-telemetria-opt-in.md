# ADR-002 — Telemetria com Umami ativada por padrão (resolvendo D-06)

**Status:** Aprovado  
**Data:** 28 de março de 2026  
**Escopo:** Observabilidade, privacidade, conformidade legal  
**Associado a:** [D-06: Telemetria na Fase 8](../../DECISOES-EM-ABERTO.md)

---

## 1. Problema

**Situação atual:**
- Compasso roda com privacidade por padrão (dados no dispositivo).
- Nenhuma telemetria disponível sobre como usuários usam o app.
- Sem observabilidade, é impossível saber:
  - Se o app está resolvendo o problema (taxas de conclusão/abandono).
  - Como melhorar design com dados reais.
  - Se vale a pena continuar desenvolvendo.

**Decisão aberta (D-06):** Implementar telemetria opt-in na Fase 8 ou adiar?

**Resolução:** Telemetria ativada por padrão (não opt-in) com **transparência radical** e **desativação óbvia**. Continua respeitando privacidade via dados anônimos e controle total do usuário.

---

## 2. Contexto

### 2.1 Princípios inegociáveis de Compasso

Conforme [adr-001-product-principles.md](adr-001-product-principles.md) e [.github/instructions/product.instructions.md](../../.github/instructions/product.instructions.md):

- ✅ **Privacidade por padrão:** dados só no dispositivo; sem backend; sem rastreador.
- ✅ **Sem julgamento:** interface não qualifica "uso bom" ou "uso ruim".
- ✅ **Linguagem brasileira:** português com acento, sem anglicismos.
- ✅ **Evolução incremental:** nenhuma feature sem gate de qualidade.

**Implicação:** Telemetria não pode ser secretária, forçada ou prestar-se a manipulação.

### 2.2 Contexto regulatório

- **LGPD (Lei Geral de Proteção de Dados - Brasil):** usuário tem direito de saber e consentir sobre coleta.
- **GDPR (UE):** similar, com requisitos de cookie consent explícito.
- **Compasso não armazena contas:** reduz complexidade, mas exige anonimato absoluto.

### 2.3 Precedentes

- [Política de Privacidade](../../transparencia/POLITICA-DE-PRIVACIDADE-COMPLETA.md) já menciona "Se esse modelo mudar no futuro — por exemplo, com […] **analytics** […] — esta política deverá ser atualizada."
- Roadmap público em [.github/instructions/product.instructions.md](../../.github/instructions/product.instructions.md) lista "Próximas: Telemetria opt-in" como pós-MVP.

---

## 3. Decisão

**Aprova-se a implementação de telemetria ativada por padrão com Umami conforme:**

### 3.1 Princípio e temporalidade

- **O quê:** Telemetria **ativada por padrão** com transparência clara e desativação fácil.
- **Quando:** Fase 8.12 (próxima sprint após aprovação desta ADR).
- **Por quanto tempo:** indefinido (telemetria estratégica contínua pós-MVP).

### 3.2 Ferramenta e hospedagem

| Critério | Escolha | Justificativa |
|---|---|---|
| **Plataforma** | **Umami** (open-source) | Privacy-respeitosa, sem venda de dados, LGPD/GDPR compliant |
| **Hospedagem** | **Cloud gratuito (umami.is)** | Plano free suficiente para MVP (até 100k eventos/mês); sem backend adicional |
| **Alternativa** | Self-hosted futuro (Heroku/Railway) | Se cloud instável ou limites excedidos |

### 3.3 Eventos rastreados (inicialmente)

Apenas **5 eventos anônimos**, sem dados sensíveis:

| Evento | Registra | Não registra |
|---|---|---|
| `pageview` | visit de página (rota) | — |
| `clique_comece` | botão "Começar" acionado | — |
| `conclusao_onboarding` | etapas completadas, duração | senhas, dados pessoais |
| `iniciou_pausa` | tipo pausa, duração | valores de consumo |
| `registrou_momento` | intenção, intensidade | conteúdo de texto, quantidade |

**Identificador:** Sessão anônima por navegação (não persistida entre desinstalações).

### 3.4 Consentimento e transparência (ativada por padrão)

1. **Onboarding — Etapa 6 (Informativa + Desativar):**
   ```
   📊 Coletamos eventos anônimos

   • Páginas que você visita
   • Momentos que registra
   • Pausas que inicia
   
   Seus eventos ajudam a evoluir o app e você pode desativar aqui ou em Configurações > Privacidade a qualquer momento.
   
   [Desativar] [Saiba mais] [Continuar]
   ```
   - Telemetria já ATIVA por padrão (não pergunta, informa).
   - Botão "Desativar" em lugar de destaque.
   - Link "Saiba mais" para página pública com explicação simples.
   - Usuário pode prosseguir sem fazer nada (aceita implicitamente).

2. **Configurações — Privacidade e dados:**
   - Toggle "Permitir telemetria" sempre visível.
   - Usuário pode desativar ou reativar a qualquer momento.
   - Muda em tempo real (sem reload necessário).

3. **Usuários antigos (sem decisão prévia):**
   - Nenhum pop-up ou aviso agressivo.
   - Toggle silencioso em Config > Privacidade (consentimento default: null).
   - Primeira vez que acessam Config, veem toggle e podem desativar.

4. **Persistência:** Consentimento salvo em `localStorage` (`telemetria.consentido: boolean | null`).
   - `true` = ativado (novos usuários começam assim)
   - `false` = desativado por escolha do usuário
   - `null` = ainda sem decisão (usuários antigos, antes de abrir Config)

### 3.5 Coleta vinculada ao consentimento

- Se `consentido === false`: nenhum dado enviado para Umami.
- Se `consentido === true` (padrão para novos usuários): eventos anônimos são enviados ao Umami quando houver conexão.
- Se `consentido === null` (usuários antigos): sem coleta até que abram Config e decidam.
- Se offline: o app continua funcionando normalmente e a telemetria nao bloqueia fluxo.
- No MVP, eventos offline podem ser perdidos (sem fila local de telemetria nesta fase).

### 3.6 Transparência permanente

- **Política de Privacidade** atualizada com cláusula clara sobre Umami.
- **CHANGELOG.md** registra adição.
- **README.md** e documentação técnica mencionam telemetria.
- **Nenhum ID técnico exposto ao usuário** (Umami abstrai isso).

---

## 4. Justificativa

### 4.1 Por que yes a telemetria

**Benefício ao produto:**
- ✅ Entender real adoção (taxas de WoW, drop de onboarding).
- ✅ Validar hipóteses de design (AB testing futuro).
- ✅ Identificar gargalos antes de analisar código.
- ✅ Comunicar progresso a stakeholders com dados.

**Benefício ao usuário:**
- ✅ Melhoria incremental baseada em uso real.
- ✅ Menos guesswork, mais precisão em prioridades.
- ✅ Product roadmap mais transparente.

### 4.2 Por que Umami especificamente

1. **Open-source:** código auditável, sem lock-in vendor.
2. **Privacy-first:** não vende dados, anonimiza por padrão.
3. **LGPD/GDPR ready:** oferece garantias de conformidade.
4. **Simple:** sem configuração complexa, sem cookies intrusivos.
5. **Plano free suficiente:** até 100k eventos/mês cobre MVP.
6. **Sem backend adicional no MVP:** cloud simplifica deploy.

### 4.3 Por que ativada por padrão (com transparência radical)

- **Evolução:** Sem dados, é impossível saber se o app evoluir, se vale manter.
- **Transparência:** A etapa 6 do onboarding explica TUDO de forma cristalina (sem dark patterns).
- **Controle:** Botão de desativar tão visível quanto continuar (não hidden menu).
- **Legal:** LGPD Brasil permite com "interesse legítimo" documentado (indie dev que quer evoluir).
- **Ética:** Honra a promessa "você está no controle" porque realmente está (toggle sempre acessível).

### 4.4 Por que agora (Fase 8.12)

- Produto está maduro (MVP concluído, onboarding estável).
- Próxima fase é refinamento (UX de longo prazo), requer dados.
- 5 eventos são escopo mínimo, não sobrecarregam.
- Time preparado (cobertura de testes em padrão).

---

## 5. Conformidade

### 5.1 LGPD (Brasil)

| Requisito | Compasso | Evidência |
|---|---|---|
| Consentimento informado | ✅ Sim | Transparência clara em onboarding + toggle sempre acessível |
| Finalidade clara | ✅ Sim | "Ajudar a melhorar" explícito em UI |
| Usuário revoga | ✅ Sim | Toggle em Configurações |
| Dados não sensíveis | ✅ Sim | Sem ID de usuário, sem dados de consumo |
| Armazenamento seguro | ✅ Sim | Umami compliant, cliente decide confiança |
| Direito ao esquecimento | ✅ Sim | Dados deletáveis via Umami dashboard |

### 5.2 GDPR (UE)

| Requisito | Compasso | Evidência |
|---|---|---|
| Consentimento informed | ✅ Sim | UI clara + link política |
| Cookie consent | ✅ Parcial | Umami não usa cookies; localStorage apenas |
| DPA (Data Processing Agreement) | ℹ️ Umami handles | Usuário garante conformidade Umami ↔ EU |
| Dados não profiling | ✅ Sim | Sem predição comportamental no MVP |

### 5.3 Restrições inegociáveis do projeto

| Restrição | Cumprimento |
|---|---|
| Privacidade por transparência | ✅ Dados anônimos + controle total do usuário + desativação num clique |
| Sem backend obrigatório | ✅ Umami cloud é serviço externo, não backend da app |
| Offline-first | ✅ App funciona sem internet e telemetria nao bloqueia uso |
| Sem ID técnico em UI | ✅ Umami abstrai IDs |
| Português first | ✅ UI em português, eventos com nomes PT |

---

## 6. Impactos

### 6.1 Implementação

**Arquivos novos:**
- `src/utilitarios/telemetria/` (3 arquivos)
- `src/ganchos/useTelemetria.ts`, `useConsentimentoTelemetria.ts`
- `docs/decisions/adr-002-telemetria-opt-in.md` (este arquivo)
- ~10 arquivos de teste

**Arquivos modificados:**
- `src/tipos/index.ts` (tipo `Configuracoes.telemetria`)
- `src/paginas/Onboarding/PaginaOnboarding.tsx` (etapa 6)
- `src/paginas/Config/PaginaConfig.tsx` (toggle telemetria)
- `.env.example` (`VITE_UMAMI_WEBSITE_ID`)
- Política de privacidade

**Dependências:**
- `@umami/sdk` (~15 KB gzipped)

### 6.2 Performance

- **Bundle:** +5 KB gzipped (negligenciável).
- **Runtime:** Envio async, não-bloqueante.
- **Offline:** Nenhum impacto (consulta localStorage).

### 6.3 Cobertura de testes

- Novos arquivos: ~90% cobertura obrigatória.
- Impacto global: +1-2% cobertura total.
- Nenhum teste quebra (novo código isolado).

### 6.4 Segurança

**Riscos:**
- 🔴 Vazamento de dados de consumo (mitigação: payload restrito + audit).
- 🟡 Umami service down ou sem internet (mitigação: sem envio; app segue funcionando).

**Garantias:**
- ✅ Sem ID de conta ou email.
- ✅ Sem valor numérico de consumo.
- ✅ Sem criptografia quebrada (deixa p/ Umami SSL).

### 6.5 Experiência do usuário

**Alterações:**
- ✅ Onboarding +1 etapa (5-10 segundos).
- ✅ Config +1 toggle (2 segundos).
- ✅ Nenhuma alteração de fluxo crítico.

### 6.6 Manutenção

**Dívida técnica:** Pequena. Código isolado em `utilitarios/telemetria/`, fácil de desativar.

**Comunicação:** Política de privacidade requer manutenção anual (acompanhar mudanças Umami).

---

## 7. Alternativas consideradas e descartadas

### 7.1 ❌ Sem telemetria

- **Rejeitado:** impede observabilidade pós-MVP.
- **Problema:** não saber o que melhorar leva a decisões arbitrárias.

### 7.2 ⚠️ Telemetria opt-out (rastreamento secreto)

- **Rejeitado inicialmente, mas reconsiderado:** A diferença entre "ativar por padrão com transparência" vs. "opt-out puro" é a clareza em UI.
- **Escolha:** Transparência radical em onboarding + toggle visível = não é dark pattern.

### 7.3 ❌ Google Analytics / Mixpanel / Heap

- **Rejeitado:** coleta agressiva, venda de dados, GDPR/LGPD risky.
- **Problema:** reputacional (não é "privacy-first").

### 7.4 ❌ Self-hosted Umami no MVP

- **Rejeitado:** adiciona backend, complexidade deploy, custo.
- **Mantém-se como:** planejado para Fase 9+ se cloud insuficiente.

### 7.5 ⚠️ Plano pago Umami (não free)

- **Descartado por:** orçamento, mas reconhecido como fail-safe se 100k/mês insuficiente.

---

## 8. Riscos e mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| Usuário confia menos por ter telemetria | Média | Alto | UI clara, política transparente, blog educativo |
| Umami price + limites em future | Baixa | Médio | Contrato back-up self-hosted, alternativa Plausible |
| Compliance violado por erro de payload | Média | Alto | Audit de código, testes, validação antes deploy |
| UX prejudicada por popup de consentimento | Baixa | Médio | Design clean (não obstrui), posição fim de onboarding |
| Dados deletados da Umami sem backup | Muito Baixa | Médio | Export mensal para CSV (manual, pós-MVP) |

---

## 9. Critério de sucesso

Estas questões devem responder "sim" após Fase 8.12 estar em produção:

- ✅ 0% checklists de release quebram (telemetria mantém gate).
- ✅ Onboarding roda sem telemetria se `consentido=false` (backcompat).
- ✅ Dados chegam em Umami dashboard (verificável).
- ✅ Usuários podem desativar em 2 cliques (Config).
- ✅ Política de privacidade reflete realidade (audit).
- ✅ Cobertura de testes ≥ 60% em telemetria (vitest).

---

## 10. Próximas fases e extensões

### Pós 8.12 (imediato)

- Monitorar taxa de telemetria ativa e taxa de desativação.
- Refinar payloads conforme insentivos de design.

### Fase 8.13 (opcional)

- Telemetria avançada (funis, retenção, segmentação).
- Export de dados em CSV para stakeholders.

### Fase 9+ (futuro)

- Telemetria de feedback in-app ("97% completam pausa!").
- Compartilhamento controlado de estatísticas (community insights).
- Self-hosted Umami se plano free insuficiente.

---

## 11. Referências

| Documento | Propósito |
|---|---|
| [ADR-001: Product Principles](adr-001-product-principles.md) | Princípios que esta ADR reforça |
| [DECISOES-EM-ABERTO.md D-06](../../DECISOES-EM-ABERTO.md#d-06) | Decisão aberta que esta ADR resolve |
| [Pagina de Privacidade no app](../../../src/paginas/Privacidade/conteudo.tsx) | Texto publico oficial sobre privacidade |
| [.github/instructions/product.instructions.md](../../.github/instructions/product.instructions.md) | Princípios e restrições do projeto |
| [Umami Documentation](https://umami.is/docs) | Referência técnica |
| [LGPD - Lei Geral de Proteção de Dados](https://www.gov.br/cidadania/pt-br/acesso-a-informacao/lgpd) | Conformidade Brasil |
| [Fase 8.12: Telemetria com Umami](../fases-desenvolvimento/Fase%208.12%20-%20Telemetria%20com%20Umami.md) | Plano de implementação |

---

## 12. Historicamente

| Data | Status | Mudança |
|---|---|---|
| 2026-03-28 | Revisado | Mudança de opt-in para ativada por padrão (Opção B: "Transparência Pragmática") |
| 2026-03-28 | Aprovado | Criação inicial de ADR-002 |

---

**Aprovado por:** _Janio Melo (Desenvolvimento)_  
**Próxima revisão:** 2026-06-30 (pós Fase 8.12)
