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

Status: fechado.

**Decisão**

Este ponto passa a ser tratado como decisão de sistema.

- a biblioteca padrão de ícones do produto será a **Lucide**;
- o logo será tratado como exceção deliberada, por pertencer à identidade da marca e não à iconografia funcional da interface;
- o fluxo principal do produto não deve misturar livremente Lucide, emojis e outras famílias de ícones.

Com isso:

- navegação, ações, estados, cards e configurações devem usar linguagem iconográfica consistente;
- telas como método, intenção e opção “Outro” precisam seguir a mesma lógica visual do restante do sistema;
- a interface ganha unidade, previsibilidade e manutenção mais simples.

Implementação aplicada no app:

- `src/paginas/Registro/componentes/EtapasRegistro.tsx`
- `src/paginas/Registro/pagina-registro.module.scss`
- `src/utilitarios/constantes.ts`

Próximo passo após o fechamento:

- inventário dos pontos residuais de mistura visual em `docs/INVENTARIO-MISTURA-VISUAL.md`.

### X.3. Vocabulário central da interface

O produto já tem um tom forte, mas ainda falta fechar o vocabulário principal com precisão.

Os pontos que ainda pedem decisão objetiva são:

- “Como foi?” versus “Qual foi o método?”;
- “Concluir pausa” versus “Encerrar pausa” ou “Finalizar pausa”;
- “Estável” versus “Ritmo estável”;
- nomes e verbos que aparecem nas telas principais e precisam soar consistentes entre si.

A pendência aqui não é de estilo geral, mas de padronização final de microcopy.

**Decisão**

Este ponto passa a ser tratado como regra editorial do produto.

A linguagem do Compasso deve seguir os princípios abaixo:

- preferir clareza à poesia quando a interface estiver orientando ação;
- usar termos específicos para o conteúdo real de cada tela;
- evitar ambiguidade em títulos, rótulos e botões;
- usar verbos neutros, funcionais e coerentes com o tom do produto;
- dar contexto suficiente a estados e métricas que apareçam isolados;
- evitar linguagem excessivamente conceitual quando a função exigir objetividade.

Com base nisso, o vocabulário da interface deve tender a escolhas como:

- “Qual foi o método?” em vez de “Como foi?”, quando a tela tratar do método;
- “Encerrar pausa” para ação manual de término;
- “Pausa concluída” para estado final natural da pausa;
- “Ritmo estável” em vez de “Estável”, quando houver risco de falta de contexto.

A pendência deixa de ser apenas escolher palavras isoladas e passa a ser manter uma regra editorial consistente em toda a interface.


### X.4. Paridade real entre dark mode e light mode

O light mode deixou de ser hipótese e já está suficientemente maduro para entrar no sistema. Portanto, o ponto em aberto não é mais “criar um tema claro”, e sim garantir paridade real entre os dois temas.

Ainda falta validar e fechar:

- se os dois temas têm o mesmo nível de hierarquia visual;
- se o contraste está igualmente bom nos dois modos;
- se o acento principal funciona com a mesma qualidade;
- se glow, bordas, superfícies e estados mantêm comportamento previsível.

Ou seja: a pendência aqui é de refinamento e regra, não mais de direção.

### X.5. Escopo real do MVP nas telas de Ritmo e Pausa

Status: fechado.

**Decisão aplicada**

#### Pausa

A tela de pausa está coerente com o MVP. Ajustes aplicados:

- microcopy do subtítulo simplificada;
- botão de término manual renomeado para "Encerrar pausa" (alinhado com X.3).

#### Ritmo

Tela reduzida ao núcleo do MVP. Blocos removidos:

- "O que as pausas rendem" (economia detalhada em múltiplos itens);
- "O que o período revela" (interpretação narrativa);
- "Dica desta semana";
- "Resumo dos últimos 30 dias".

Blocos mantidos:

- cards de métricas (frequência, média, tendência, valor percebido);
- leitura visual da semana;
- formas mais usadas;
- últimos registros.

Implementação de referência:

- `src/paginas/Ritmo/PaginaRitmo.tsx`
- `src/paginas/Pausa/PaginaPausa.tsx`
- `__testes__/ui/pausa.teste.tsx`
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

Este ponto passa a ter trilha operacional e documentação dedicada:

- documento principal: `docs/compliance/assets-e-licencas.md`;
- artefato formal para distribuição: `THIRD_PARTY_NOTICES.md`.

Com isso, o item deixa de ser apenas observação e passa a ser checklist verificável de origem de assets, licenças e pendências de originalidade.

Este ponto não bloqueia o produto visualmente agora, mas precisa permanecer na lista de fechamento.

### X.10. Decisão operacional de consolidação

O ponto mais importante que continua em aberto não é visual, e sim de processo.

Ainda precisa ser assumido explicitamente que o projeto vai:

- sair do modo de exploração de telas isoladas;
- e entrar de vez no modo de sistema, consistência e manutenção.

Sem essa virada, mesmo com uma base muito boa, o projeto corre risco de voltar à dispersão.