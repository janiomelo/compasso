# Decisoes em Aberto

Data de criacao: 22/03/2026
Objetivo: registrar decisoes pendentes com dono, prazo e impacto para evitar bloqueios de roadmap.

## Convencoes

- Status permitido: `aberta`, `em andamento`, `decidida`, `descartada`.
- Toda decisao deve ter uma data alvo.
- Quando decidir, registrar racional e impacto tecnico/produto.

## Matriz de decisoes

| ID | Tema | Pergunta | Status | Responsavel | Data alvo | Impacto |
|---|---|---|---|---|---|---|
| D-01 | Sincronizacao | Havera sincronizacao opcional futura ou manter local-first puro? | aberta | a definir | 2026-04-05 | arquitetura de dados, privacidade, suporte multiplos dispositivos |
| D-02 | Economia | Economia sera comunicada como reserva, meta pessoal, cultura ou experiencias? | aberta | a definir | 2026-04-02 | linguagem da UI, metricas, percepcao de valor |
| D-03 | Tom de marca | Tom principal sera acolhedor, premium ou neutro? | aberta | a definir | 2026-04-02 | microcopy, identidade visual, onboarding |
| D-04 | Dominio principal | Qual dominio oficial de lancamento? | aberta | a definir | 2026-04-10 | branding, SEO, divulgacao |
| D-05 | Subtitulo de marca | Usar apenas Compasso ou Compasso + subtitulo na comunicacao inicial? | aberta | a definir | 2026-04-10 | clareza de proposta, posicionamento |
| D-06 | Telemetria | Implementar telemetria na Fase 8 ou postergar para fase seguinte? | **decidida** | Janio Melo | 2026-03-28 | observabilidade, privacidade, manutencao |

## Decisões Fechadas

### D-06: Telemetria com ativacao padrao

- **Status:** decidida
- **Data da decisão:** 28 de março de 2026
- **Decisor:** Janio Melo (Desenvolvimento)
- **Contexto:** Sem telemetria, nao sabemos adocao real de features. Compasso continua privacy-first com transparencia clara e desativacao facil.
- **Opções consideradas:**
  - ❌ Sem telemetria (impede observabilidade)
  - ❌ Opt-out (viola LGPD/GDPR e privacidade por padrão)
  - ❌ Google Analytics / Mixpanel (venda de dados, reputacional risk)
  - ✅ **Umami com ativacao padrao (escolhida)**
- **Escolha final:** Implementar telemetria com Umami (cloud free, ate 100k eventos/mes), ativada por padrao para novos usuarios, com opcao clara de desativar e pagina "Saiba mais".
- **Racional:** Umami e open-source, privacy-respeitosa, LGPD/GDPR compliant. O modelo escolhido garante observabilidade sem bloquear controle do usuario.
- **Impactos técnicos:**
  - +5 KB gzipped (bundle)
  - Nova estrutura `src/utilitarios/telemetria/`
  - Novos hooks e tipos
  - ~10 novos testes
- **Impactos de produto:**
  - Onboarding +1 etapa informativa com opcao de desativar
  - Config +1 toggle (privacidade)
  - Melhor observabilidade de adoção
- **Ações derivadas:**
  - [x] Criar ADR-002 (referência: `docs/agents/decisions/adr-002-telemetria-opt-in.md`)
  - [ ] Criar documentação Fase 8.12 (referência: `docs/fases-desenvolvimento/Fase 8.12 - Telemetria com Umami.md`)
  - [ ] Criar conta Umami e gerar Website ID
  - [ ] Atualizar pagina publica de privacidade no app (`src/paginas/Privacidade/conteudo.tsx`)
  - [ ] Criar pagina publica "Saiba mais" de telemetria
  - [ ] Implementar conforme roadmap Fase 8.12

---

## Template de fechamento de decisao

### [ID] Titulo curto

- Status: decidida
- Data da decisao:
- Decisor(es):
- Contexto:
- Opcoes consideradas:
- Escolha final:
- Racional:
- Impactos tecnicos:
- Impactos de produto:
- Acoes derivadas (com donos e datas):

## Historico

- 28/03/2026: D-06 (Telemetria) fechada com aprovacao de Umami com ativacao padrao, desativacao facil e pagina "Saiba mais". Criada ADR-002 e planejamento Fase 8.12.
- 22/03/2026: documento criado para consolidar pendencias de decisao apos fechamento da Fase 7.
