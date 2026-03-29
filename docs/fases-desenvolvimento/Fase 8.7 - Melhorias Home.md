## Home com duas CTAs fortes

Hoje a home tem:

- hero da pausa
- card verde grande de registro

Está bom, mas ainda existe uma disputa leve de protagonismo.

Não acho que impeça lançamento.  
Só vale observar depois.

## Empty states ainda podem melhorar

A terceira imagem, com:

- “Sem registros”
- “Nenhum registro ainda. Adicione seu primeiro momento.”

está funcional, mas ainda dá para lapidar o vazio para ficar mais caloroso e menos “tela sem dados”.

Também não bloqueia lançamento.

---

## Prompt para solução

Quero ajustar a home do projeto Compasso com mudanças pequenas, conservadoras e coerentes com a identidade atual do produto.

## Contexto do produto

O Compasso é um web app local-first para acompanhamento pessoal de ritmo, pausas e equilíbrio. O produto tem foco em:

- privacidade por padrão;
- uso recorrente;
- clareza;
- redução de danos;
- linguagem brasileira;
- interface sofisticada, mas mais utilitária do que editorial.

A home atual já está boa e não deve ser redesenhada do zero. O objetivo é refinar **copy, hierarquia e honestidade de estados**, sem perder a linguagem visual atual.

## Objetivos desta tarefa

Quero implementar dois ajustes principais na home:

1. melhorar a copy do CTA verde de registro;
2. tratar a área de economia de forma honesta quando ela ainda não estiver configurada.

## Problema 1 — copy do CTA verde

Hoje o card verde usa uma formulação que pode sugerir um registro emocional amplo, como se o app estivesse perguntando “como você está”, mas o fluxo real do produto registra um **momento** com:

- forma de uso;
- intenção;
- intensidade;
- observação opcional.

Quero tornar essa chamada mais precisa.

### O que fazer

No card verde de CTA, testar esta estrutura:

- linha superior pequena: **Novo registro**
- chamada principal: **Registrar momento**

Evitar formulações como:
- “Registre como você está agora”
- qualquer frase que sugira diário emocional genérico
- qualquer frase que entre em conflito com o fluxo real do produto

Se necessário, ajustar também o nome da prop, label ou constante correspondente.

## Problema 2 — economia exibida como R$ 0,00 sem configuração

Hoje a home mostra valores de economia mesmo quando a funcionalidade ainda não está realmente configurada, o que pode transmitir falsa precisão.

Quero que a home trate economia de forma honesta.

### Regra de produto

Se a pessoa usuária **ainda não configurou estimativa de economia**, a home **não deve exibir valor monetário como se fosse um cálculo real consolidado**.

Em vez disso, deve mostrar um estado de “não configurado”.

### O que fazer

Identificar o card atual de economia e implementar um estado alternativo quando não houver configuração válida.

#### Estado configurado
Se a estimativa estiver configurada:
- manter exibição resumida de economia;
- manter estilo compatível com os outros cards;
- deixar claro que se trata de estimativa, se isso já existir no texto.

#### Estado não configurado
Se não houver configuração:
- não mostrar R$ 0,00 como se fosse métrica confiável;
- mostrar algo como:

**Economia não configurada**  
**Adicione um valor diário de uso para acompanhar estimativas.**

Pode haver um link ou ação secundária leve como:
- **Configurar estimativa**
ou
- **Ativar estimativas**

Se já existir rota, modal, sheet ou função para isso, reutilizar.
Se ainda não existir, apenas deixar o estado visual preparado com um CTA neutro.

## Problema 3

No CTA de pausa, não exibir "0 registros hoje"  mesmo quando houverem registros. isso fica apenas no outros cards. 

## Restrições importantes

- não redesenhar a home;
- não alterar a estrutura geral da tela;
- não mexer no hero de pausa;
- não mexer nas outras páginas;
- não transformar a home em dashboard financeiro;
- manter consistência com dark mode e light mode;
- preservar a identidade atual do Compasso.

## Manter na home

Quero manter:

- título principal da página;
- bloco principal de pausa;
- três cards de resumo;
- card verde de registro;
- lista de registros recentes.

## Critérios de aceitação

A solução final deve cumprir:

- a home continua visualmente coerente com o estado atual do produto;
- o CTA verde passa a comunicar corretamente o fluxo real de registro;
- a economia deixa de parecer uma métrica falsa quando não estiver configurada;
- o estado “não configurado” fica claro, útil e discreto;
- nenhuma mudança deve deixar a interface mais genérica ou mais pesada.

## Entrega esperada

Quero que você:

1. localize o componente da home;
2. ajuste a copy do CTA verde;
3. implemente o estado honesto da economia;
4. preserve o layout atual;
5. me mostre o código final com as mudanças.

---

## Plano de implementação

### Diagnóstico

| Problema | Causa raiz | Arquivo |
|---|---|---|
| CTA com copy genérico | "Registre como você está agora" não reflete o fluxo real | `CTARegistro.tsx` |
| Economia falsa com R$ 0,00 | Nenhuma pausa concluída, mas o card exibe valor como se fosse real | `CartoesMetricas.tsx` |
| Hero exibe "0 registros hoje" | Contagem de registros do dia aparece no bloco de pausa sem informação útil | `HeroPrincipal.tsx` |

### Mudanças planejadas

#### 1 — CTA verde — `CTARegistro.tsx`

- Eyebrow: `"Registrar momento"` → `"Novo registro"`
- Título: `"Registre como você está agora"` → `"Registrar momento"`

Sem nova prop, sem refactor estrutural.

#### 2 — Hero sem pausa ativa — `HeroPrincipal.tsx`

Remover a linha `{registrosHoje.length} registros hoje` do bloco sem pausa ativa.
Manter apenas `{formatarMoeda(totalAcumulado)} já acumulados` — ou suprimir quando `totalAcumulado === 0`.
A contagem do dia já é coberta pelos cards `CartaoUltimoRegistro` e `CartaoSeteDias`.

#### 3 — Cartão de economia — `useEconomia.ts` + `CartoesMetricas.tsx`

Adicionar `possuiHistoricoEconomia` ao retorno de `useEconomia`:

```ts
possuiHistoricoEconomia: historicoPausa.some(p => p.status === 'concluida')
```

No `CartaoEconomia`, usar essa flag para alternar estado:

- **Com histórico:** mantém `formatarMoeda(totalAcumulado)` + tendência atual.
- **Sem histórico:** exibe estado honesto:
  - título: `"Economia não iniciada"`
  - subtítulo: `"Conclua uma pausa para acompanhar estimativas."`
  - link discreto: `"Iniciar pausa →"` apontando para `/pausa`

#### 4 — Testes — `home-principal.teste.tsx`

Casos a adicionar/atualizar:

- CTA exibe `"Novo registro"` como eyebrow e `"Registrar momento"` como título
- Cartão de economia exibe `"Economia não iniciada"` quando sem pausas concluídas
- Hero sem pausa ativa não exibe texto de contagem de registros do dia

### Escopo de arquivos

| Arquivo | Mudança |
|---|---|
| `src/paginas/Principal/componentes/CTARegistro.tsx` | Copy — 2 strings |
| `src/paginas/Principal/componentes/HeroPrincipal.tsx` | Remover contagem de registros do estado sem pausa |
| `src/ganchos/useEconomia.ts` | Adicionar `possuiHistoricoEconomia` ao retorno |
| `src/paginas/Principal/componentes/CartoesMetricas.tsx` | Estado condicional no `CartaoEconomia` |
| `__testes__/ui/home-principal.teste.tsx` | Atualizar + adicionar casos |

Nenhuma alteração em: hero de pausa ativa, estrutura geral da home, outras páginas, SCSS existente.