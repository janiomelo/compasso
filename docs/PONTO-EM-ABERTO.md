## X. Pontos que Ainda Estão Realmente Pendentes

Esta versão substitui a lista anterior de pontos em aberto e considera o estágio atual do projeto, as decisões já tomadas e a coerência que o Compasso precisa manter. O objetivo aqui não é repetir dúvidas já resolvidas, mas registrar apenas o que ainda exige fechamento real.

### X.1. Intensidade no fluxo de registro

Status: fechado.

Decisão aplicada no app (MVP):

- intensidade registrada em três níveis fixos (`Leve`, `Média`, `Alta`);
- remoção da escala numérica de 1 a 10 no fluxo principal;
- etapa de registro com seleção direta por opções, mantendo check-in rápido.

Implementação de referência:

- `src/paginas/Registro/componentes/EtapasRegistro.tsx`
- `src/paginas/Registro/PaginaRegistro.tsx`
- `src/paginas/Registro/useFluxoRegistro.ts`
- `src/paginas/Registro/pagina-registro.module.scss`
- `__testes__/ui/wizard-registro.teste.tsx`

Observação:

- qualquer granularidade adicional fica para fase posterior, fora do escopo do MVP.

### X.2. Linguagem visual dos elementos gráficos

Este ponto ainda não está fechado porque a interface ainda mistura linguagens visuais diferentes.

O principal pendente é definir:

- se o produto usará ícones padronizados como linguagem principal;
- se emojis continuarão existindo em algum contexto;
- ou se tudo será unificado numa única biblioteca visual.

Hoje o que mais pede decisão é:

- as telas de intenção;
- as telas de método;
- a representação visual de “Outro”.

A necessidade aqui não é redesenhar tudo, mas decidir uma regra e aplicá-la com consistência.

### X.3. Vocabulário central da interface

O produto já tem um tom forte, mas ainda falta fechar o vocabulário principal com precisão.

Os pontos que ainda pedem decisão objetiva são:

- “Como foi?” versus “Qual foi o método?”;
- “Concluir pausa” versus “Encerrar pausa” ou “Finalizar pausa”;
- “Estável” versus “Ritmo estável”;
- nomes e verbos que aparecem nas telas principais e precisam soar consistentes entre si.

A pendência aqui não é de estilo geral, mas de padronização final de microcopy.

### X.4. Paridade real entre dark mode e light mode

O light mode deixou de ser hipótese e já está suficientemente maduro para entrar no sistema. Portanto, o ponto em aberto não é mais “criar um tema claro”, e sim garantir paridade real entre os dois temas.

Ainda falta validar e fechar:

- se os dois temas têm o mesmo nível de hierarquia visual;
- se o contraste está igualmente bom nos dois modos;
- se o acento principal funciona com a mesma qualidade;
- se glow, bordas, superfícies e estados mantêm comportamento previsível.

Ou seja: a pendência aqui é de refinamento e regra, não mais de direção.

### X.5. Escopo real do MVP nas telas de Ritmo e Pausa

Este é um ponto importante e hoje parece mais aberto do que antes.

O app já tem material para uma visão rica de ritmo, incluindo:

- métricas de frequência;
- formas mais usadas;
- últimos registros;
- resumos do período;
- dicas;
- blocos de economia.

Isso é bom, mas ainda falta decidir o que realmente entra na primeira versão utilizável.

As decisões pendentes são:

- quanto da leitura de ritmo entra no MVP;
- se blocos como “O que o período revela”, “Dica desta semana” e “Resumo dos últimos 30 dias” entram já agora ou ficam para depois;
- qual é o grau de detalhe mínimo necessário para a tela de pausa;
- quão forte a economia será no MVP: resumo simples ou área mais desenvolvida.

A questão aqui não é se essas telas estão boas, mas se o escopo delas já está calibrado para a primeira versão.

### X.6. Sistema visual formalizado

A interface já demonstra direção consistente, mas ainda falta transformar isso em sistema oficial.

As pendências reais aqui são:

- consolidar design tokens;
- fechar regras de raio, borda, glow e espaçamento;
- definir largura máxima de conteúdo;
- fechar grid e comportamento em telas maiores;
- transformar decisões visuais em referência reutilizável.

Este ponto não pede novas telas. Pede formalização.

### X.7. Sistema de componentes

O projeto já mostra padrões recorrentes, mas ainda falta declarar isso como biblioteca oficial do produto.

Ainda precisa ser fechado:

- quais componentes entram no núcleo do sistema;
- quais estados cada componente precisa cobrir;
- quais peças já podem ser tratadas como definitivas;
- o que ainda é apenas solução de tela e o que já é componente reutilizável.

A necessidade aqui é sair do “parece consistente” e entrar no “está sistematizado”.

### X.8. Regra oficial de copy e tom

O tom geral do Compasso já existe, mas ainda falta uma regra curta, objetiva e documentada para sustentar futuras decisões.

Ainda precisa ser fechado:

- quais verbos o produto usa como padrão;
- quais termos devem ser evitados;
- o nível de tecnicidade aceitável;
- o padrão de subtítulo, rótulo e microcopy.

Isso é importante para que a linguagem continue coerente conforme o projeto crescer.

### X.9. Limites de originalidade e origem dos assets

Não há sinal evidente de plágio direto na interface atual, mas continuam em aberto alguns cuidados operacionais:

- definir origem oficial dos ícones e demais assets;
- revisar licenças de qualquer recurso de terceiros;
- manter atenção à microcopy para evitar proximidade excessiva com concorrentes;
- revisar o símbolo da marca quando ele for fechado.

Este ponto não bloqueia o produto visualmente agora, mas precisa permanecer na lista de fechamento.

### X.10. Decisão operacional de consolidação

O ponto mais importante que continua em aberto não é visual, e sim de processo.

Ainda precisa ser assumido explicitamente que o projeto vai:

- sair do modo de exploração de telas isoladas;
- e entrar de vez no modo de sistema, consistência e manutenção.

Sem essa virada, mesmo com uma base muito boa, o projeto corre risco de voltar à dispersão.