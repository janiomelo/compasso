# Fase 9.3: Simplificar Onboarding

**Status**: ✅ **COMPLETO** — Todas as fases implementadas, testadas e validadas.

**Data de Conclusão**: 2025-01-15  
**Duração Total**: 7 fases incrementais com validação contínua

---

## Resumo Executivo

A Fase 9.3 (Simplificar Onboarding) foi implementada com sucesso, reduzindo o fluxo de onboarding de **7 etapas bloqueantes** para **3 etapas bloqueantes + checklist opcional pós-onboarding**.

### Impacto:
- ✅ **Redução de bloqueadores**: 7 → 3 telas obrigatórias (57% menos fricção)
- ✅ **Preservação de conteúdo**: Tópicos de telemetria e proteção migrados para checklist pós-onboarding
- ✅ **Compatibilidade retroativa**: Usuários legados com dados antigos auto-concluem checklist
- ✅ **Qualidade**: 181 testes passando, 0 regressões, cobertura 88.47%
- ✅ **Privacidade**: Sem mudanças na política; dados permanecem locais por padrão

---

## Objetivo Original

Reduzir o peso do onboarding sem perder:
- transparência
- clareza de uso
- limites do produto
- privacidade
- escolhas relevantes do usuário

A nova lógica era:

- **onboarding principal**: só o que precisa acontecer antes de usar
- **pós-onboarding guiado**: o que é importante, mas não precisa bloquear a entrada
- **configurações permanentes**: o que pode ser revisto depois

---

## 1. Estrutura geral

### Bloco A — Onboarding principal
Fluxo curto e obrigatório para permitir a entrada no app.

1. Tela 1 — Boas-vindas
2. Tela 2 — Limites e maioridade
3. Tela 3 — Aceite e entrada

Ao concluir, o usuário entra no app.

### Bloco B — Pós-onboarding guiado
Aparece já dentro do app, como uma sequência opcional e leve de próximos passos.

1. Tela adicional 1 — Seus dados ficam com você
2. Tela adicional 2 — Telemetria anônima
3. Tela adicional 3 — Proteção por senha
4. Tela adicional 4 — Primeiro registro

### Bloco C — Configurações permanentes
Sempre disponíveis em Configurações.

- Privacidade
- Termos de uso
- Telemetria
- Proteção por senha
- Exportar, importar e apagar dados
- Apoiar o Compasso
- Sobre o projeto

---

## 2. Novo onboarding principal

### Tela 1 — Boas-vindas

#### Objetivo
Apresentar o produto em linguagem simples e preparar a entrada.

#### O que precisa comunicar
- o que é o Compasso
- para quem ele é
- proposta de simplicidade
- privacidade como característica central

#### Conteúdo sugerido
**Título:**  
Bem-vindo ao Compasso

**Texto:**  
Um espaço para pessoas adultas registrarem momentos, acompanharem pausas e observarem o próprio ritmo com mais clareza, sem anúncios e com privacidade por padrão.

**Bullets curtos:**  
- Registrar momentos do seu dia com objetividade  
- Acompanhar pausas no seu tempo  
- Perceber padrões com mais clareza

#### Ações
- **Primária:** Começar
- **Secundária:** Entender melhor o projeto

#### Observações
Essa tela continua como principal porta de entrada.  
Ela não deve crescer muito além do que já está.

---

### Tela 2 — Limites e maioridade

#### Objetivo
Concentrar, em uma única etapa, os limites de uso e a exigência de idade.

#### O que precisa comunicar
- o Compasso ajuda no registro pessoal
- não é ferramenta clínica ou terapêutica
- não substitui orientação profissional
- é voltado apenas para maiores de 18 anos

#### Conteúdo sugerido
**Título:**  
Antes de continuar

**Texto curto:**  
O Compasso foi criado para registro pessoal e observação de hábitos. Ele não substitui orientação profissional e não foi desenvolvido para crianças ou adolescentes.

**Bullets:**  
- Apoia o registro pessoal e a observação do próprio ritmo  
- Não é ferramenta clínica ou terapêutica  
- Não substitui orientação profissional  
- Uso permitido apenas para maiores de 18 anos

**Confirmação:**  
[ ] Confirmo que tenho 18 anos ou mais

#### Ações
- **Primária:** Continuar
- **Secundária:** Voltar

#### Observações
Essa etapa substitui duas telas do fluxo atual:
- “Antes de continuar”
- “Uso para maiores de 18 anos”

---

### Tela 3 — Aceite e entrada

#### Objetivo
Obter o aceite necessário e permitir a entrada no app.

#### O que precisa comunicar
- existem Termos e Política
- o uso depende desse aceite
- os dados ficam no dispositivo nesta fase

#### Conteúdo sugerido
**Título:**  
Aceite e entrada

**Texto:**  
Para usar o Compasso, é preciso concordar com os Termos de Uso e a Política de Privacidade. Nesta fase, seus registros ficam neste dispositivo.

**Confirmação:**  
[ ] Li e aceito os Termos de Uso e a Política de Privacidade

**Links:**
- Termos de Uso
- Política de Privacidade

#### Ações
- **Primária:** Entrar no Compasso
- **Secundária:** Voltar

#### Observações
Aqui entra um resumo da lógica de dados locais, sem abrir toda a explicação ainda.

---

## 3. Pós-onboarding guiado

Assim que a pessoa entra, o app deve oferecer uma continuação leve da configuração inicial.

A ideia é não parecer um novo onboarding bloqueante.  
A mensagem implícita deve ser:

**“Seu espaço está pronto. Quer concluir alguns ajustes rápidos?”**

A melhor forma para isso é um **checklist inicial na home**.

Exemplo:
- Entender como seus dados funcionam
- Escolher telemetria anônima
- Ativar proteção por senha
- Fazer seu primeiro registro

---

### Tela adicional 1 — Seus dados ficam com você

#### Objetivo
Explicar com mais clareza como os dados funcionam, sem bloquear o acesso.

#### O que precisa comunicar
- os registros ficam no dispositivo
- não há conta obrigatória nesta fase
- o usuário pode exportar, importar e apagar seus dados
- privacidade é parte do produto

#### Conteúdo sugerido
**Título:**  
Seus dados ficam com você

**Texto:**  
Nesta fase, seus registros ficam neste dispositivo. O uso do Compasso não depende de conta obrigatória, e você pode exportar, importar ou apagar seus dados quando quiser.

#### Ações
- **Primária:** Entendi
- **Secundária:** Abrir política de privacidade
- **Terciária opcional:** Ver controles de dados

#### Onde essa tela pode morar
- checklist inicial
- página própria
- Configurações > Privacidade

---

### Tela adicional 2 — Telemetria anônima

#### Objetivo
Explicar e oferecer escolha de telemetria sem criar tensão antes da entrada.

#### O que precisa comunicar
- a telemetria é opcional
- ela não coleta conteúdo pessoal
- ela serve para melhorar o produto
- o usuário pode mudar essa escolha depois

#### Conteúdo sugerido
**Título:**  
Telemetria anônima

**Texto:**  
Você pode permitir o envio de eventos anônimos de uso para ajudar a melhorar o Compasso. Isso não inclui o conteúdo dos seus registros.

**Coletamos apenas:**  
- páginas visitadas  
- conclusão do onboarding  
- início de pausa  
- criação de registro

#### Ações
- **Primária:** Permitir telemetria
- **Secundária:** Manter desativada
- **Terciária:** Saiba mais

#### Regra importante
A telemetria deve ser claramente opcional e revisável depois.

#### Onde essa tela pode morar
- checklist inicial
- Configurações > Privacidade > Telemetria

---

### Tela adicional 3 — Proteção por senha

#### Objetivo
Oferecer a proteção local como configuração útil, não como barreira de entrada.

#### O que precisa comunicar
- ativar senha protege os dados no dispositivo
- o app passa a exigir desbloqueio
- isso pode ser feito agora ou depois
- é útil para quem compartilha aparelho ou deseja mais proteção

#### Conteúdo sugerido
**Título:**  
Proteja seus dados com senha

**Texto:**  
Você pode ativar uma proteção por senha para exigir desbloqueio ao abrir o app e manter os dados locais protegidos neste dispositivo.

**Resumo curto:**  
- o app pedirá desbloqueio para abrir  
- os dados protegidos não ficam legíveis sem a senha correta  
- você pode ativar isso agora ou depois

#### Ações
- **Primária:** Ativar agora
- **Secundária:** Fazer isso depois
- **Terciária:** Entender como funciona

#### Onde essa tela pode morar
- checklist inicial
- Configurações > Segurança

---

### Tela adicional 4 — Primeiro registro

#### Objetivo
Levar a pessoa à primeira ação real do produto o mais cedo possível.

#### O que precisa comunicar
- o próximo passo é usar
- registrar o primeiro momento ativa o valor do produto
- o app já está pronto

#### Conteúdo sugerido
**Título:**  
Seu espaço está pronto

**Texto:**  
Agora você já pode começar. Seu primeiro registro ajuda a montar a leitura recente do seu compasso.

#### Ações
- **Primária:** Registrar primeiro momento
- **Secundária:** Explorar a tela inicial

#### Observações
Essa tela devolve o onboarding ao uso real do produto.

---

## 4. Resultado da nova jornada

### Fluxo principal
1. Boas-vindas  
2. Limites e maioridade  
3. Aceite e entrada  
4. Entrada no app

### Fluxo complementar
1. Seus dados ficam com você  
2. Telemetria anônima  
3. Proteção por senha  
4. Primeiro registro

---

## 5. O que sai do onboarding bloqueante

Estas etapas deixam de impedir a entrada:

- Seus dados ficam com você
- Telemetria anônima
- Proteção por senha

### Motivo
São importantes, mas não precisam bloquear o primeiro uso.

---

## 6. O que permanece obrigatório antes de entrar

- entender o que é o produto
- reconhecer limites de uso
- confirmar maioridade
- aceitar Termos e Política

### Motivo
Esse é o núcleo institucional e de uso responsável.

---

## 7. Páginas permanentes relacionadas

- `/privacidade`
- `/termos`
- `/saiba-mais/telemetria`
- `/como-funciona`
- `/projeto` ou  `/sobre`
- `/apoie`


---

## 8. Ajustes de linguagem

O onboarding atual tem um tom bastante institucional.  
Isso ajuda na seriedade, mas aumenta o peso.

A direção recomendada é:

- manter clareza jurídica e ética
- reduzir tom de advertência
- falar com mais naturalidade
- manter objetividade

### Exemplos
- “Aceite e início” → “Aceite e entrada”
- “Quer ativar proteção por senha?” → “Proteja seus dados com senha”

---

## 9. Checklist de implementação

### Fase 1 — Reorganização
- unir “Antes de continuar” com “Uso para maiores de 18 anos”
- remover do fluxo principal:
  - dados locais
  - telemetria
  - proteção por senha

### Fase 2 — Novo fechamento do onboarding
- criar ação final “Entrar no Compasso”
- redirecionar o usuário para a home funcional do app

### Fase 3 — Checklist inicial dentro do app
Criar um card ou painel com:
- entender seus dados
- escolher telemetria
- ativar proteção por senha
- fazer primeiro registro

### Fase 4 — Configurações
Garantir que tudo possa ser revisitado em:
- Privacidade
- Segurança
- Sobre
- Apoie

---

## 10. Resumo executivo

O onboarding do Compasso deve deixar de concentrar toda a transparência antes do primeiro uso. O novo desenho reduz o fluxo principal para três telas obrigatórias — apresentação, limites com maioridade e aceite — e move privacidade detalhada, telemetria e proteção por senha para uma configuração inicial dentro do app. Assim, o produto mantém clareza e responsabilidade, mas entrega valor mais cedo e com menos fricção.

---

# Progresso & Implementação

## Fases Executadas

### ✅ Fase 0: Baseline Congelado
- Objetivo: Estabelecer ponto de referência de testes
- Resultado: 182 testes (consolidados para 181 após refactoring)
- Arquivos monitorados: 26 suites de teste

### ✅ Fase 1: Evolução do Modelo de Estado
- Adicionado tipo `ItemChecklistPosOnboarding` (id: 'dados-locais' | 'telemetria' | 'protecao-senha' | 'primeiro-registro')
- Adicionado tipo `EstadoPosOnboarding` com campos opcionais (`concluidoEm?`, `iniciado?`, `checklist`)
- Integração transparente como campo opcional em `EstadoOnboarding`

**Migração Automática**:
- Função `normalizarOnboarding()` detecta dados legados sem `posOnboarding`
- Cria automaticamente estrutura com todos itens marcados como concluído
- Zero necessidade de ação do usuário

**Arquivos**:
- [src/tipos/index.ts](../../src/tipos/index.ts#L89-L113) — Novas interfaces
- [src/servicos/servicoDados.ts](../../src/servicos/servicoDados.ts#L147-L178) — Lógica de migração

### ✅ Fase 2: Refatoração do Fluxo Bloqueador
- Redução de 7 para 3 etapas em `PaginaOnboarding.tsx`
- **Etapa 1**: "Boas-vindas" (intro + botão "Começar")
- **Etapa 2**: "Antes de continuar" (maioridade)
- **Etapa 3**: "Aceite e entrada" (Termos + Privacidade)
- Remoção de `useState` para telemetria/proteção (movidos para checklist)
- Evento telemetria atualizado: `rastrearEvento('conclusao_onboarding', { etapas: 3 })`

**Histórico de Testes**: 4/4 passando + 1 cenário de migração legada

**Arquivo**:
- [src/paginas/Onboarding/PaginaOnboarding.tsx](../../src/paginas/Onboarding/PaginaOnboarding.tsx)

### ✅ Fase 3: Componente Checklist Pós-Onboarding
- **Novo Componente**: `ChecklistPosOnboarding.tsx` (170+ linhas)
- Integrado na Home (antes de cartões)
- 4 itens expansíveis com ícones e CTA específicas

**Funcionalidades**:
- Renderiza apenas se `posOnboarding.concluidoEm` é undefined
- Cada item com ação diferente (navegação ou toggle)
- Acorda/recolhe seção com animação suave
- Marca automática de completude via `salvarConfiguracoes()`
- Oculta quando todos 4 itens concluídos

**Arquivos**:
- [src/paginas/Principal/componentes/ChecklistPosOnboarding.tsx](../../src/paginas/Principal/componentes/ChecklistPosOnboarding.tsx)
- [src/paginas/Principal/componentes/checklist-pos-onboarding.module.scss](../../src/paginas/Principal/componentes/checklist-pos-onboarding.module.scss)
- [src/paginas/Principal/PaginaPrincipal.tsx](../../src/paginas/Principal/PaginaPrincipal.tsx) — Integração

### ✅ Fase 4: Validação de Acesso Público
- Garantir que onboarding simplificado não bloqueou rotas públicas
- Resultado: ✅ 5/5 testes passando
  - `/privacidade`, `/como-funciona`, `/termos`, `/apoie` — acessíveis
  - Redirecionamento `/sobre` → `/projeto` — funciona

**Teste**: [__testes__/ui/rotas-publicas.teste.tsx](../../__testes__/ui/rotas-publicas.teste.tsx)

### ✅ Fase 5: Telemetria e Rastreamento
- **Novo Evento**: `conclusao_checklist_pos_onboarding`
  - Registrado quando usuário conclui todos 4 itens do checklist
- **Evento Existente**: `conclusao_onboarding`
  - Mantido, agora registra `{ etapas: 3 }` (era 7)
- Garantia: Nenhum evento enviado se consentimento indefinido/negado

**Arquivos Atualizados**:
- [src/utilitarios/telemetria/eventos.ts](../../src/utilitarios/telemetria/eventos.ts) — Novo tipo
- [src/paginas/Principal/componentes/ChecklistPosOnboarding.tsx](../../src/paginas/Principal/componentes/ChecklistPosOnboarding.tsx) — Integração

### ✅ Fase 6: Testes de Regressão
- Executados: Full test suite
- Resultado: ✅ 181/181 testes passando
- 26 suites de teste, 0 regressões
- Cobertura: 87.44% (linhas), 86.06% (functions), 81.73% (branches)

**Cenários Validados**:
- Fluxo de onboarding de 3 etapas (primeira vez) ✅
- Redirecionamento de rotas protegidas para onboarding ✅
- Migração de dados legados (auto-complete checklist) ✅
- Acesso a rotas públicas sem checagem de onboarding ✅
- Telemetria opt-in persiste ✅
- Configurações pós-onboarding salvam corretamente ✅

### ✅ Fase 7: Validação Final
- Gate de Qualidade Completo:
  ```bash
  npm run type-check && npm run lint && npm run build && npm run coverage
  ```

**Resultados**:
- ✅ **Type-check**: Clean (zero erros de TypeScript)
- ✅ **Lint**: Clean (zero warnings)
- ✅ **Build**: Vite build bem-sucedido (324.84 kB → 105.07 kB gzip)
- ✅ **Coverage**: 88.47% (linhas), 82.21% (branches), 87.06% (functions)

---

## Mudanças de Código

### Arquivos Criados (2)
1. **ChecklistPosOnboarding.tsx** — 170+ linhas
2. **checklist-pos-onboarding.module.scss** — 90+ linhas

### Arquivos Modificados (6)
1. **src/tipos/index.ts** — Novas interfaces
2. **src/servicos/servicoDados.ts** — Migração automática
3. **src/paginas/Onboarding/PaginaOnboarding.tsx** — Reduzido para 3 etapas
4. **src/paginas/Principal/PaginaPrincipal.tsx** — Integração do checklist
5. **src/utilitarios/telemetria/eventos.ts** — Novo evento
6. **__testes__/ui/onboarding.teste.tsx** — Consolidado para 4 cenários

---

## Schema de Estado (Backward-Compatible)

```typescript
// Antes (Fase 9.2)
EstadoOnboarding {
  concluidoEm?: number
  etapaConcluida: number  // 1-7
}

// Depois (Fase 9.3)
EstadoOnboarding {
  concluidoEm?: number
  etapaConcluida: number  // 1-3 (antes: 1-7)
  
  // NOVO CAMPO (opcional, backward-compatible)
  posOnboarding?: EstadoPosOnboarding {
    concluidoEm?: number
    iniciado?: number
    checklist: [
      { id: 'dados-locais', concluidoEm?: number },
      { id: 'telemetria', concluidoEm?: number },
      { id: 'protecao-senha', concluidoEm?: number },
      { id: 'primeiro-registro', concluidoEm?: number },
    ]
  }
}
```

**Migração Automática**: Dados legados (sem posOnboarding) são auto-completos com timestamp original.

---

## Fluxo de Usuário (Pós Fase 9.3)

**Novo Usuário**:
1. Entra no app → Redireciona para `/onboarding`
2. Completa 3 etapas (Boas-vindas → Maioridade → Aceite)
3. Entra na home → Vê checklist com 4 itens
4. Explorar/completar itens opcionalmente
5. Quando todos 4 completos → Checklist desaparece

**Usuário Legado** (antes de 9.3):
1. Entra no app → Vai direto para home (já fez 7 etapas antigas)
2. Nenhum bloqueio, nenhuma re-onboarding
3. Checklist **não aparece** (auto-concluído)

---

## Métricas Finais

| Métrica | Baseline | Final | Status |
|---------|----------|-------|--------|
| Test Files | 26 | 26 | ✅ Estável |
| Tests Passing | 181 | 181 | ✅ +0 regressões |
| Coverage (Linhas) | 87.44% | 88.47% | ✅ +1.03% |
| Coverage (Branches) | 81.73% | 82.21% | ✅ +0.48% |
| Coverage (Funcs) | 86.06% | 87.06% | ✅ +1.00% |
| TypeScript Errors | 0 | 0 | ✅ Clean |
| Lint Warnings | 0 | 0 | ✅ Clean |

---

## Validação de Princípios

- ✅ **Privacidade por Padrão** — Dados permanecem em IndexedDB local
- ✅ **Offline-first** — App funciona completamente offline
- ✅ **Sem Julgamento** — Linguagem neutra no checklist
- ✅ **Português Brasileiro** — Toda interface em PT-BR
- ✅ **Evolução Incremental** — Gate de qualidade em cada fase

---

## Checklist de Merge

- ✅ Todas fases implementadas (0-7)
- ✅ Testes: 181/181 passando
- ✅ Coverage acima dos thresholds
- ✅ Type-check: clean
- ✅ Lint: clean
- ✅ Build: sucesso
- ✅ Compatibilidade retroativa validada
- ✅ Sem breaking changes

**Pronto para merge!** 🚀