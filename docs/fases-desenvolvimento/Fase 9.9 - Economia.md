### X.14. Economia e estimativas

Este ponto passa a ser tratado como decisão fechada de produto para o MVP.

A economia continuará existindo no Compasso, mas com papel **secundário, opcional e explicitamente estimado**. Ela não deve competir com o núcleo do produto nem ser apresentada como verdade objetiva ou cálculo financeiro preciso.

#### Papel da economia no MVP

- a economia será tratada como **camada opcional de clareza**, e não como eixo principal do produto;
- o objetivo é ajudar quem deseja acompanhar estimativas de gasto evitado, sem transformar o Compasso em painel financeiro ou ferramenta moralizante;
- a economia não deve ser obrigatória para usar o app.

#### Fonte do valor utilizado

A fonte padrão da estimativa será:

- **valor diário de uso**, informado manualmente pela própria pessoa usuária.

Esse valor não será inferido automaticamente nem exigido durante o check-in principal.

#### Onde coletar esse valor

O valor diário de uso deve ser configurado fora do fluxo principal de registro, em contexto mais adequado, como:

- **Configurações → Economia e estimativas**;
- ou em um CTA contextual quando a pessoa tentar usar a área de economia pela primeira vez.

O check-in principal não deve incluir campo de valor.

#### O que acontece quando o valor não foi configurado

Se a pessoa nunca informou valor diário de uso:

- o produto **não deve fingir precisão exibindo múltiplos blocos com R$ 0,00**;
- a interface deve mostrar estado de **não configurado**, com convite claro para ativar estimativas.

Exemplos de estado adequado:

- **Economia não configurada**
- **Adicione um valor diário de uso para acompanhar estimativas**
- botão: **Configurar estimativa**

#### Onde a economia aparece no MVP

A economia pode aparecer de forma resumida em:

- **home**, como card curto ou estado configurado/não configurado;
- **pausa**, como estimativa da pausa em andamento ou concluída;
- **ritmo**, apenas de forma resumida e sem painel financeiro detalhado.

#### O que fica fora do MVP

Não entram na primeira versão:

- projeções complexas de 30 dias;
- taxa diária detalhada;
- múltiplos blocos financeiros concorrentes;
- comparações moralizantes;
- equivalências artificiais de gasto;
- narrativa de “dinheiro perdido” ou “ganho real” como fato objetivo.

#### Regra de comunicação

A economia deve sempre ser comunicada como:

- **estimativa**
- **valor médio**
- **baseado no seu uso e nas informações configuradas**

Evitar linguagem que sugira exatidão absoluta ou julgamento.

#### Direção final

No MVP, a economia será:

- opcional;
- configurada manualmente;
- simples;
- secundária;
- claramente estimada.

Com isso, o Compasso preserva o foco em ritmo, pausas e autoconsciência, sem perder a possibilidade de oferecer uma camada útil de leitura financeira para quem desejar ativá-la.

---

## Implementação por etapas (execução segura)

### Etapa 1 — Configuração explícita de estimativa (concluída)

- inclusão de bloco Economia e estimativas em Configurações;
- campos: valor diário de uso e moeda (BRL/USD);
- persistência local via configurações do dispositivo;
- validação de entrada (não negativo, numérico);
- estado explícito quando não configurada.

### Etapa 2 — Aplicar estimativa no fluxo de pausa (concluída)

- ao iniciar pausa sem valor informado manualmente, usar valor médio configurado;
- manter economia zerada quando a pessoa não configurar estimativa;
- preservar comportamento sem impacto no fluxo principal.

### Etapa 3 — Comunicação consistente na Home e Pausa (concluída)

- valores exibidos com a moeda configurada;
- manter linguagem de estimativa, sem discurso de precisão absoluta;
- manter visual secundário para economia, sem competir com ritmo/pausa.

### Etapa 4 — Próximos incrementos (backlog)

- CTA contextual de configuração quando economia estiver desativada;
- revisão de microcopy em Ritmo para reforçar caráter estimado;
- refinamento de testes de cenário com troca de moeda em mais páginas.