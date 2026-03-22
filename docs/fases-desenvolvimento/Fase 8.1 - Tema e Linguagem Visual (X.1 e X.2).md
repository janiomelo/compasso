# Fase 8.1 - Tema e Linguagem Visual (X.1 e X.2)

Data: 22/03/2026  
Status: Planejado  
Escopo: fechar decisões e implementar base técnica para tema (claro/escuro) e regra de destaque visual.

## 1. Objetivo

Resolver os pontos X.1 e X.2 do documento `docs/PONTO-EM-ABERTO.md` com uma abordagem prática:

- oficializar a direção visual de temas;
- garantir paridade real entre dark mode e light mode;
- limitar uso de glow para preservar clareza funcional;
- consolidar a regra de orientação 60% utilitário / 40% editorial elegante.

## 2. Decisões de produto que esta fase formaliza

- Dark mode e light mode são temas oficiais e equivalentes.
- O comportamento inicial respeita preferência do sistema.
- A interface deve permitir seleção explícita de tema padrão.
- Verde sálvia/menta é o acento principal da identidade-base.
- Glow é recurso de destaque, não estilo padrão.
- Prioridade de interface: utilidade, clareza e consistência antes de ornamentação.

## 3. Plano macro por etapas

### Etapa 1 - Congelamento de regras (X.1 e X.2)

**Entregáveis:**

- seção normativa consolidada para tema e destaque visual;
- regra operacional de glow por tela (1 principal, excepcionalmente 2);
- definição clara de onde glow pode e não pode ser usado.

**Resultado esperado:** direção oficial, sem ambiguidade para implementação.

### Etapa 2 - Fundação técnica de temas

**Entregáveis:**

- tokens semânticos de cor por tema (`escuro` e `claro`);
- estrutura de tema consistente em nível global e páginas principais;
- modo automático/sistema preservado como comportamento inicial.

**Resultado esperado:** light e dark deixam de ser ajustes pontuais e passam a ser sistema.

### Etapa 3 - Controle explícito de tema

**Entregáveis:**

- seleção de tema com três estados: `Automático`, `Claro`, `Escuro`;
- persistência da escolha do usuário;
- retorno ao modo automático sem fricção.

**Resultado esperado:** aderência completa ao requisito de escolha explícita do tema padrão.

### Etapa 4 - Aplicação da regra de destaque visual

**Entregáveis:**

- normalização de glow/sombra em componentes de alto destaque;
- redução de destaque em navegação, cards secundários, listas e inputs;
- revisão inicial das telas `Início` e `Pausa` com foco em hierarquia visual.

**Resultado esperado:** UI mais legível, menos concorrência de atenção e maior coerência.

### Etapa 5 - Validação e guardrails

**Entregáveis:**

- checklist curto para PR de interface (tema duplo + glow controlado);
- validação manual em mobile e desktop;
- atualização de documentação de implementação.

**Resultado esperado:** redução de regressão visual nas próximas fases.

## 4. Critérios de pronto da fase

- temas claro e escuro funcionando com qualidade equivalente nas telas principais;
- comportamento inicial respeitando sistema e opção manual persistida;
- glow aplicado apenas em elementos de prioridade visual alta;
- home e pausa alinhadas com a diretriz 60/40 (utilitário/editorial);
- regras registradas para manutenção futura.

## 5. Ordem recomendada de execução

1. Etapa 1 - Congelamento de regras  
2. Etapa 2 - Fundação técnica de temas  
3. Etapa 3 - Controle explícito de tema  
4. Etapa 4 - Regra de destaque visual nas telas principais  
5. Etapa 5 - Validação e guardrails
