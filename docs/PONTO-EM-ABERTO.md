## X. Pontos que Ainda Precisam de Decisão ou Clareza

Esta seção resume apenas o que, a partir do texto-base, ainda não está suficientemente fechado ou ainda depende de decisão explícita. O objetivo é registrar os pontos em aberto sem misturar com recomendações já consolidadas.

### X.1. Direção visual que precisa ser oficialmente congelada

Embora a análise já aponte uma direção forte, ainda falta transformar essa percepção em decisão formal de sistema:

- o produto não terá dark mode como direção principal exclusiva;
    
- o comportamento inicial deve respeitar a preferência do navegador ou do sistema operacional;
    
- dark mode e light mode serão tratados como temas oficiais do produto e ambos precisam ser igualmente bem resolvidos;
    
- deve existir botão de alternância manual de tema;
    
- o sistema deve permitir escolha explícita do tema padrão pelo usuário.
    

**Verde sálvia/menta como acento principal**

- verde sálvia/menta será o acento principal da identidade-base do produto;
    
- o sistema visual, porém, deve ser preparado para suportar temas;
    
- isso significa que o verde será a referência inicial, sem impedir futuras variações controladas.X.2. Escopo exato do estilo visual
    

### Regra de uso de glow

- glow é um recurso de destaque;
    
- não deve ser usado como estilo padrão de todos os componentes;
    
- deve aparecer apenas em elementos de maior prioridade visual.
    

### Limite por tela

- idealmente, **1 elemento principal com glow por tela**;
    
- excepcionalmente, **2 elementos**, desde que um deles seja claramente secundário;
    
- evitar glow simultâneo em múltiplos cards e controles.
    

### Onde pode usar

- CTA principal
    
- card hero principal
    
- estado especial de foco ou destaque muito controlado
    

### Onde evitar

- navegação padrão
    
- cards secundários
    
- listas
    
- inputs comuns
    
- tags
    
- múltiplos elementos concorrentes
    

### X.2. Escopo exato do estilo visual

Ainda falta decidir, de forma explícita, qual será a dominância final da linguagem visual:

- se o produto será assumido formalmente como **mais utilitário do que editorial**;
    
- se a proporção sugerida de **60% utilitário / 40% editorial elegante** será adotada como regra;
    
- até que ponto a interface pode manter clima sofisticado sem perder objetividade funcional.
    

O Compasso pode e deve ser sofisticado, mas a função dele não é encantar primeiro; é **ser útil, claro e recorrente**.

Então a ordem de prioridade fica:

1. entender rápido;
    
2. usar sem esforço;
    
3. manter coerência;
    
4. só depois encantar visualmente.
    

Em termos práticos:

- a interface não deve parecer revista, manifesto ou landing page expandida;
    
- deve parecer **produto real de uso recorrente**;
    
- a beleza entra como refinamento da utilidade.
    

**60% utilitário / 40% editorial elegante**

Quando houver dúvida entre duas soluções:

- a mais funcional vence;
    
- a mais clara vence;
    
- a mais repetível vence;
    
- a mais manutenível vence.
    

E o “40% editorial elegante” continua vivo em:

- ritmo dos espaços;
    
- tipografia;
    
- escolha de cor;
    
- acabamento dos cards;
    
- tom da interface;
    
- hero blocks bem controlados.
    

Mas ele não deve dominar:

- navegação;
    
- formulários;
    
- densidade de informação;
    
- leitura das ações;
    
- arquitetura de tela.
    

Então eu diria:

- **sim, adote essa proporção como regra de orientação**;
    
- **não trate como conta exata**.
    

### X.3. Home versus Pausa

O texto indica que a home está forte, mas ainda existe uma dúvida estrutural importante:

- quanto da experiência de pausa deve aparecer na home;
    
- quanto deve ficar reservado para a tela de pausa;
    
- qual é a fronteira exata entre **resumo e ação** na home e **imersão e controle** na tela de pausa.
    

### X.4. Intensidade no fluxo de registro

Este é um dos pontos mais claramente em aberto no texto:

- manter escala de **1 a 10**;
    
- simplificar para **leve, média e alta**;
    
- decidir se o controle contínuo ficará fora do MVP e entrará apenas depois.
    

Também falta clareza sobre o quanto essa etapa precisa ser técnica ou rápida.

### X.5. Linguagem visual dos elementos gráficos

Ainda precisa ser decidido:

- se o produto usará **ícones padronizados** como linguagem principal;
    
- se haverá uso de **emojis**;
    
- se haverá mistura entre os dois;
    
- em caso de mistura, em quais contextos isso será permitido sem comprometer a sofisticação da interface.
    

### X.6. Textos e nomenclaturas ainda não fechados

Algumas expressões ainda aparecem como candidatas, e não como decisão final:

- “Abrir pausa” versus “Ver pausa” versus “Acompanhar pausa”;
    
- “Como foi?” versus “Qual foi o método?”;
    
- “Concluir pausa” versus “Encerrar agora” ou “Finalizar pausa”;
    
- “Estável” versus “Ritmo estável”.
    

Falta, portanto, um fechamento oficial do vocabulário central da interface.

### X.7. Sistema visual ainda não formalizado

A análise aponta a necessidade de fechar sistema, mas isso ainda não está resolvido. Faltam decisões objetivas sobre:

- design tokens;
    
- regras de borda e raio;
    
- escala de espaçamento;
    
- tamanhos tipográficos;
    
- largura máxima de conteúdo;
    
- grid oficial;
    
- intensidade de sombras e glows;
    
- padrões visuais por tipo de componente.
    

### X.8. Sistema de componentes ainda não fechado

A lista de componentes já foi identificada, mas ainda não foi transformada em biblioteca oficial. Falta decidir:

- quais componentes entram no núcleo do sistema agora;
    
- quais podem esperar;
    
- quais estados cada componente precisa cobrir;
    
- o que será considerado componente oficial e reutilizável desde já.
    

### X.9. Light mode

O texto deixa claro que esse ponto está aberto:

- o light mode ainda não foi resolvido com a mesma maturidade do dark mode;
    
- ainda falta decidir como será sua personalidade própria;
    
- ainda falta garantir que ele não seja apenas adaptação tardia da versão escura.
    

### X.10. Regras de copy

Há direções boas, mas ainda não háu um conjunto oficialmente fechado de regras de linguagem. Ainda precisa ser decidido:

- quais verbos e estruturas o produto vai usar com consistência;
    
- quais termos ficam proibidos;
    
- qual é o grau de tecnicidade aceitável;
    
- qual é o padrão de subtítulo, rótulo e microcopy para a interface.
    

### X.11. Estrutura definitiva do MVP

O texto já sugere um caminho, mas ainda faltam decisões práticas sobre o que entra e o que não entra agora:

- intensidade em 3 níveis ou 10 níveis;
    
- economia como card ou como seção mais forte;
    
- observação livre no MVP ou não;
    
- grau de detalhe da tela de pausa;
    
- quantidade de informação que o ritmo recente deve mostrar na primeira versão.
    

### X.12. Limites de originalidade que ainda exigem cuidado

A análise conclui que não há sinal evidente de plágio direto, mas ainda faltam definições preventivas sobre:

- origem oficial dos ícones e assets;
    
- revisão de licenças do que vier de terceiros;
    
- revisão futura do símbolo da marca;
    
- cuidado com microcopy para evitar proximidade excessiva com concorrentes.
    

### X.13. Decisão operacional mais importante

O ponto mais importante que ainda precisa ser assumido de forma explícita é este:

- se o projeto vai realmente sair do modo de exploração de telas isoladas;
    
- e entrar no modo de **sistema, consistência e manutenção**.
    

Sem essa decisão, mesmo uma direção visual boa corre risco de dispersão.