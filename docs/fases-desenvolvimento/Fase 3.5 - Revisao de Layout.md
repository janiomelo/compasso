# Fase 3.5 — Revisão de Layout Mobile-First para Desktop

**Objetivo:** repensar a experiência visual do Compasso a partir de uma linguagem mais próxima de aplicativo mobile, mantendo boa leitura e composição em telas de PC.

**Motivação:** a base funcional atual está pronta, mas o layout implementado ainda segue uma lógica mais utilitária e contínua. As referências mais recentes aprovadas apontam para uma interface com menos densidade por tela, hierarquia mais clara e fluxos mais guiados.

**Premissa principal:** manter a navegação superior e a identidade do logo, mas reorganizar a experiência para parecer um produto mobile adaptado com critério ao desktop, e não apenas um site responsivo tradicional.

---

## 1. O que permanece

- Logo e assinatura visual do Compasso
- Navegação principal no topo
- Tema escuro como base
- Tom discreto, privado e não moralista
- Estrutura de páginas centrais: Início, Registrar, Pausa, Ritmo

---

## 2. Diferenças levantadas

## 2.1. Casca da aplicação

### Estado atual

- Cabeçalho simples com links de texto
- Navegação duplicada: topo em telas maiores e barra fixa inferior no mobile
- Estrutura geral mais próxima de dashboard web tradicional
- Área principal larga e pouco orientada por blocos de foco

### Referência nova

- Navegação superior única, com aparência de barra de app
- Itens de navegação em formato de pílula, com ícone + rótulo
- Ação global secundária no canto direito, como alternância de tema ou preferências rápidas
- Conteúdo centralizado em uma coluna principal com largura controlada, lembrando um canvas mobile expandido no desktop

### Decisão para implementação futura

- Substituir a combinação topo + bottom nav por um shell único e consistente
- Usar largura máxima moderada para a coluna principal, evitando telas desktop excessivamente abertas
- Tratar o desktop como ampliação do mobile, preservando ritmo vertical e zonas de toque visíveis

---

## 2.2. Home

### Estado atual

- Home dividida em cartões utilitários independentes
- Ênfase em blocos informativos pequenos e empilhados
- CTA de registro aparece como card de ação no fim da página
- A hierarquia visual ainda está mais próxima de resumo funcional do que de uma tela inicial guiada

### Referência nova

- Card principal com estado da pausa ou convite principal para ação
- Card separado para último registro
- Card de recorte temporal curto, como “últimos 7 dias”
- CTA de registro com mais destaque visual e sensação de atalho de produto
- Menos elementos simultâneos na dobra inicial, com prioridade clara do que fazer primeiro

### Direção futura

- Reorganizar a home em uma sequência de blocos de decisão: estado atual, contexto recente, visão curta do ritmo, ação principal
- Reduzir ruído visual e priorizar uma leitura de cima para baixo
- Tratar cada card como módulo de produto, não apenas como contêiner genérico

---

## 2.3. Fluxo de registro

### Estado atual

- Um formulário único e contínuo
- Método, intenção, intensidade, humor e observação ficam na mesma tela
- Boa cobertura funcional, mas com carga cognitiva maior
- Experiência mais próxima de formulário web do que de check-in rápido

### Referência nova

- Registro dividido em etapas curtas
- Uma pergunta principal por tela
- Barra de progresso horizontal no topo
- Cartões grandes para seleção por contexto
- Navegação explícita entre etapas com “Voltar” e “Continuar”
- Última etapa dedicada apenas à observação opcional e confirmação

### Direção futura

- Transformar o registro em wizard de 4 etapas
- Etapa 1: contexto ou método percebido pelo usuário
- Etapa 2: intenção
- Etapa 3: intensidade
- Etapa 4: observação opcional e confirmação
- Manter persistência e tipos atuais, mas trocar a composição da interface
- Priorizar clique/toque rápido, leitura imediata e progressão linear

---

## 2.4. Pausa

### Estado atual

- Página funcional, orientada por controles e histórico
- Estrutura ainda mais próxima de tela técnica do que de tela de foco

### Referência nova

- Hero card centralizado
- Mensagem curta e uma ação primária muito evidente
- Menor competição entre elementos na primeira dobra

### Direção futura

- Criar uma versão mais contemplativa da tela de pausa
- Concentrar a dobra inicial em status, benefício e CTA principal
- Mover detalhes secundários e histórico para baixo ou para seções complementares

---

## 2.5. Ritmo

### Estado atual

- Página ainda está em placeholder no produto implementado

### Referência nova

- Resumo estatístico em cards
- Faixa semanal com leitura por dia
- Lista ou barras para contextos mais frequentes
- Registros recentes com leitura visual rápida

### Direção futura

- Implementar a página já dentro da nova gramática visual
- Usar cards informativos compactos, sem parecer painel corporativo
- Fazer a leitura semanal funcionar em mobile e desktop sem trocar de conceito

---

## 3. Princípios de layout para a próxima implementação

### 3.1. Mobile-first real

- O desenho precisa nascer em coluna única
- Desktop não deve inventar uma segunda aplicação; deve apenas ampliar respiros, largura útil e distribuição de blocos

### 3.2. Uma ação principal por área

- Cada tela deve deixar evidente o próximo passo mais importante
- Ações secundárias não devem competir visualmente com o CTA principal

### 3.3. Menos densidade, mais progressão

- Evitar telas com muitos grupos de decisão simultâneos
- Preferir etapas curtas, cartões grandes e leitura sequencial

### 3.4. Shell de app, não página institucional

- Navegação, margens, barras e cabeçalho devem se comportar como produto de uso recorrente
- O usuário precisa sentir que está “dentro do app” desde a primeira dobra

### 3.5. Desktop como moldura ampliada

- Manter coluna principal centralizada
- Permitir que certos blocos usem grid no desktop, mas sem romper a lógica vertical do mobile

---

## 4. Escopo da fase nova

## 4.1. Entregáveis

- Wireframes revistos de Início, Registrar, Pausa e Ritmo
- Especificação do shell responsivo novo
- Fluxo detalhado do registro em etapas
- Regras de responsividade para mobile, tablet e desktop
- Inventário dos componentes visuais necessários para a nova versão
- Critérios de transição entre a UI atual e a UI revisada

## 4.2. Componentes a revisar

- Cabeçalho principal
- Item de navegação com estado ativo
- Card de destaque da home
- Card de resumo curto
- CTA de ação rápida
- Stepper de progresso do registro
- Card seletor de opção
- Barra de intensidade
- Hero card da pausa
- Cards de estatística do ritmo

## 4.3. Fora de escopo desta fase

- Refatoração de persistência
- Mudança do modelo de dados
- Inclusão de backend
- Ajustes de analytics fora do necessário para suportar a nova UI

---

## 5. Impacto esperado no código

- Reestruturar `App.tsx` para um shell único de navegação
- Extrair navegação e cabeçalho em componentes próprios
- Quebrar `PaginaRegistro` em etapas ou seções dirigidas por estado local
- Revisar estilos globais e tokens de layout
- Implementar `PaginaRitmo` já na linguagem visual nova
- Revisar responsividade das páginas `PaginaPrincipal` e `PaginaPausa`

---

## 6. Critérios de aceite da revisão visual

- A aplicação deve transmitir linguagem de app mobile mesmo em desktop
- A navegação deve continuar familiar, mas com aparência mais refinada e orientada por estados
- A home deve comunicar prioridade de uso em até uma dobra
- O fluxo de registro deve reduzir atrito cognitivo e parecer um check-in de poucos toques
- A pausa deve ganhar foco visual e não parecer uma tela técnica
- A página de ritmo deve nascer já coerente com a nova direção visual

---

## 7. Referência de decisão para a implementação posterior

Quando houver dúvida entre uma solução mais “web dashboard” e uma solução mais “app mobile escalado para desktop”, a referência aprovada para esta fase manda escolher a segunda.

O objetivo não é deixar o produto minimalista por estética. O objetivo é reduzir carga cognitiva, melhorar foco de ação e fazer a interface parecer mais intencional, cotidiana e rápida.