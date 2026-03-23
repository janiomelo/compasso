# Como eu reescreveria a árvore

## Árvore atual

1. método
2. intenção
3. intensidade

## Árvore que eu recomendo

### Versão enxuta do MVP

1. **Forma de uso**
2. **Intenção**
3. **Intensidade**

### Forma de uso

- Vaporizado
- Fumado
- Comestível
- Outro

Isso já resolve bem.

---

# Review da tela 1

Hoje o texto está:

**Como foi?**  
“Escolha o método que mais combina com este momento.”

Eu mudaria.

## Melhor pergunta

- **Como você usou?**  
    ou
- **Qual foi a forma de uso?**

Minha preferência:  
**Qual foi a forma de uso?**

Porque:

- é precisa;
- organiza melhor as opções;
- prepara a árvore de forma consistente.

## Subtexto

Em vez de:  
“Escolha o método que mais combina com este momento.”

Eu usaria:

- **Selecione a forma principal deste registro.**

ou

- **Escolha a forma de uso que melhor descreve este momento.**

Minha preferência:  
**Escolha a forma de uso que melhor descreve este momento.**

---

# Ícones dessa tela

Com a nova árvore, os ícones também melhoram.

## Sugestão

- **Vaporizado** → ícone de vapor/ondas
- **Fumado** → algo mais neutro de fumaça/traço de ar
- **Comestível** → algo simples e genérico, não comida específica demais
- **Outro** → mais opções / círculo com reticências / shapes

## O que eu evitaria

- frasco para “extração”, porque puxa para laboratório/química;
- flor como ícone principal, se a opção não for “flor”;
- ponto de interrogação para “Outro”, porque parece erro ou dúvida.

Para “Outro”, eu usaria:

- **ellipsis**
- **more-horizontal**
- ou um ícone de categoria neutra

---

# Review da tela 2 — Intenção

Essa está bem melhor.

As opções me parecem boas:

- Paz
- Foco
- Social
- Descanso
- Criatividade
- Outro

Elas são amplas o suficiente?  
**Sim, para o MVP, sim.**

Elas são úteis?  
**Sim, desde que você aceite que são categorias de leitura, não de precisão clínica.**

## Um pequeno ajuste de texto

Pergunta atual:  
**Qual era sua intenção?**

Boa.

Subtexto:  
**Selecione a intenção dominante antes do momento.**

Também está bom.

Eu só revisaria se “intenção” é a melhor palavra para todos os casos.  
Mas acho que funciona.

Talvez, no futuro, você teste:

- **O que você buscava naquele momento?**

Mas hoje eu manteria “intenção”.

## Ícones da intenção

Agora que você trouxe tudo para uma linguagem mais consistente, está bom.  
Eu só revisaria “Outro” para não parecer tão “buraco genérico”.

---

# Review da tela 3 — Intensidade

Agora ela ficou bem mais coerente.

## O que está bom

- Leve / Média / Alta
- subtítulos curtos
- cards grandes
- baixo atrito

## Um ajuste que eu faria

Hoje está:  
**Como foi a intensidade?**

Eu talvez simplificasse para:

- **Qual foi a intensidade?**

Porque a tela já é direta e o resto do fluxo está mais objetivo.

Subtexto está bom:  
**Escolha entre Leve, Média ou Alta para registrar rápido.**

## Tela 4 — Observação opcional

### Objetivo
Adicionar um campo de texto aberto, não obrigatório, para complemento livre do registro.

### Comportamento
- o campo deve começar **fechado por padrão**;
- exibir uma ação discreta como:
  - **Adicionar observação**
  - ou **Adicionar nota**
- ao clicar, o campo se expande e já entra em modo de digitação;
- o preenchimento continua sendo **opcional**;
- a pessoa pode seguir sem escrever nada.

### Título sugerido
**Quer adicionar uma observação?**

### Subtítulo sugerido
**Opcional. Use este espaço se quiser registrar algum detalhe deste momento.**

### Placeholder sugerido
- **Escreva algo, se quiser**
- ou **Adicione uma observação opcional**

### Regras
- não exigir preenchimento;
- não transformar essa etapa em bloqueio;
- manter visualmente mais leve que as etapas anteriores;
- permitir seguir mesmo com o campo vazio.

### Ação principal
- **Continuar**

### Ação secundária
- **Pular**
  - ou apenas permitir continuar sem preencher

---

## Tela 5 — Conclusão do registro

### Objetivo
Encerrar o fluxo com confirmação clara, sem peso excessivo, e orientar o próximo passo.

### Título sugerido
**Momento registrado**

### Subtítulo sugerido
**Seu registro foi salvo com sucesso.**

### Conteúdo sugerido
Exibir um resumo curto do que foi registrado:
- forma de uso
- intenção
- intensidade
- observação, se existir

### Estrutura sugerida
- bloco de confirmação visual;
- resumo curto do registro;
- ação principal para voltar ao produto;
- ação secundária opcional para registrar outro momento.

### Ações
- **Ir para o início**
- **Registrar outro momento** (opcional)

### Regras
- não transformar a conclusão em tela analítica;
- não incluir interpretação, conselho ou julgamento;
- usar tom calmo e direto;
- reforçar sensação de registro concluído e salvo.

---

## Estrutura atualizada do check-in

1. **Forma de uso**
2. **Intenção**
3. **Intensidade**
4. **Observação opcional**
5. **Conclusão do registro**

---

# Projeto de implementação

## Objetivo
Implementar um novo fluxo de registro orientado por etapas configuráveis, com linguagem mais clara, estrutura de perguntas flexível e sem exigência de compatibilidade retroativa com o fluxo atual.

## Decisão base
- Não manter compatibilidade com o modelo anterior.
- Tratar a árvore de perguntas como configurável, para permitir no futuro:
  - criar perguntas novas;
  - remover perguntas;
  - trocar opções de uma pergunta;
  - reordenar etapas.

## Escopo
- Novo fluxo de check-in com 5 etapas:
  1. Forma de uso
  2. Intenção
  3. Intensidade
  4. Observação opcional
  5. Conclusão do registro
- Novo texto de interface, conforme diretriz da Fase 8.6.
- Nova modelagem interna para perguntas e opções.
- Atualização de componentes, hook de fluxo, testes de UI e integração.

## Fora de escopo
- Migração de dados legados de check-ins já salvos.
- Dashboard analítico novo na etapa final.
- Personalização de perguntas por usuário nesta fase.

## Regra de testes (obrigatória)
- Desde a primeira alteração de código, já deve existir teste automatizado cobrindo o comportamento alterado.
- Nenhuma etapa de implementação avança sem teste correspondente.
- Para cada etapa funcional, executar no mínimo:
  - `npm run type-check`
  - `npm run lint`
  - teste direcionado da funcionalidade alterada em `npm run test -- --run <arquivo(s)>`
- Ao fechar a fase, executar:
  - `npm run test -- --run`
  - `npm run build`

## Arquitetura alvo

### 1. Fluxo orientado por configuração
Substituir o acoplamento atual por etapas fixas em `switch` por um motor de etapas configurado por metadados.

Estratégia:
- Definir um catálogo de perguntas em `src/paginas/Registro/config/perguntasRegistro.ts`.
- Cada pergunta define:
  - `id`
  - `tipo` (`escolha-unica`, `texto-opcional`, `confirmacao`)
  - `titulo`
  - `descricao`
  - `opcoes` (quando aplicável)
  - `obrigatoria`
- O wizard renderiza a etapa com base no tipo e no estado atual.

### 2. Modelo de dados de check-in
Evoluir `EntradaRegistro` para refletir linguagem de produto e flexibilidade.

Diretriz:
- Renomear o campo principal de `metodo` para `formaUso` no fluxo novo.
- Manter `intencao`, `intensidade` e `notas`.
- Tratar observação como opcional real, sem bloquear continuidade.

Observação:
- Como não haverá compatibilidade retroativa, o domínio novo pode remover termos antigos (`flor`, `extracao`) sem camada de adaptação.

### 3. Componentização
Substituir componentes de etapa hardcoded por renderizadores por tipo:
- `EtapaEscolhaUnica`
- `EtapaTextoOpcional`
- `EtapaConclusao`

Objetivo:
- trocar perguntas e opções sem reescrever o fluxo.

## Estrutura de arquivos proposta

```text
src/paginas/Registro/
  PaginaRegistro.tsx
  useFluxoRegistro.ts
  config/
    perguntasRegistro.ts
  componentes/
    EtapaEscolhaUnica.tsx
    EtapaTextoOpcional.tsx
    EtapaConclusao.tsx
    RegistroEtapaRenderer.tsx
```

## Plano de execução

### Etapa A - Modelo e configuração
- Criar tipos de pergunta em `src/paginas/Registro/config/perguntasRegistro.ts`.
- Definir catálogo inicial de 5 etapas.
- Definir opções de "Forma de uso": Vaporizado, Fumado, Comestível, Outro.
- Criar testes automatizados já nesta etapa para garantir:
  - renderização na ordem correta;
  - estrutura mínima da configuração.

Entregável:
- Fluxo descrito integralmente por configuração.

### Etapa B - Novo motor de fluxo
- Reescrever `useFluxoRegistro.ts` para operar por índice baseado no catálogo.
- Adicionar validação por etapa obrigatória.
- Permitir avanço em etapa opcional sem preenchimento.
- Criar/atualizar testes do hook nesta etapa.

Entregável:
- Hook desacoplado de etapas fixas.

### Etapa C - Renderização por tipo
- Criar renderizadores por tipo de etapa.
- Remover `switch` rígido de `PaginaRegistro.tsx`.
- Ajustar títulos, subtítulos e CTAs conforme documento da Fase 8.6.
- Atualizar testes de UI do wizard no mesmo ciclo de alteração.

Entregável:
- UI funcional com novo conteúdo e fluxo de 5 etapas.

### Etapa D - Conclusão do registro
- Inserir etapa final de confirmação com resumo curto:
  - forma de uso
  - intenção
  - intensidade
  - observação, se existir
- Ações:
  - Ir para o início
  - Registrar outro momento
- Criar testes de UI da etapa de conclusão.

Entregável:
- Conclusão clara e sem análise/julgamento.

### Etapa E - Testes e qualidade final
- Atualizar `__testes__/ui/wizard-registro.teste.tsx` para o novo fluxo.
- Atualizar testes de integração que dependem de rótulos/ordem de etapa.
- Garantir passagem em:
  - `npm run type-check`
  - `npm run lint`
  - `npm run test -- --run`
  - `npm run build`

Entregável:
- Fluxo novo validado e estável.

## Critérios de aceite
- O fluxo exibe exatamente 5 etapas na ordem definida.
- É possível alterar ordem e opções via arquivo de configuração, sem editar lógica principal do wizard.
- A etapa de observação é opcional de verdade.
- A etapa final confirma salvamento e mostra resumo curto sem interpretação.
- Nenhuma dependência do modelo antigo permanece no fluxo novo.
- Toda alteração de código entrou acompanhada de teste automatizado no mesmo ciclo.

## Riscos e mitigação
- Risco: acoplamento residual com `metodo` no restante da aplicação.
  - Mitigação: busca global por `metodo` em páginas e serviços de registro antes de fechar PR.
- Risco: quebra de testes por textos antigos.
  - Mitigação: atualizar testes por comportamento observável e novo copy oficial.
- Risco: ícones inconsistentes para "Outro".
  - Mitigação: padronizar ícone neutro (`ellipsis`/`more-horizontal`) no catálogo de opções.

## Sequência sugerida de PRs
1. PR 1: Tipos + configuração de perguntas + testes iniciais.
2. PR 2: Hook novo + testes do fluxo.
3. PR 3: Componentes de etapa + `PaginaRegistro` reescrita + testes de UI.
4. PR 4: Etapa de conclusão + testes finais + limpeza de referências antigas.

## Resultado esperado
Um check-in mais claro para usuário final e uma base técnica sustentável para evoluir perguntas sem retrabalho estrutural.