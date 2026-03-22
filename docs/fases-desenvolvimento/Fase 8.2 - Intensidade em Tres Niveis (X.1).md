# Fase 8.2 - Intensidade em Três Niveis (X.1)

## Objetivo

Fechar o item X.1 com uma decisao de produto implementada no app: intensidade do registro em tres niveis fixos (`leve`, `media`, `alta`), sem escala numerica no fluxo principal.

## Escopo

Inclui:

- etapa de intensidade no wizard de registro;
- copy da etapa para refletir selecao por niveis;
- estado do fluxo sem dependencia de slider numerico;
- estilos da etapa com opcoes clicaveis e legenda curta;
- teste de UI do wizard atualizado.

Nao inclui:

- granularidade numerica adicional no MVP;
- mudancas em calculos de analise historica alem do mapeamento ja existente.

## Decisao de Produto

- modelo oficial do MVP: `Leve`, `Media`, `Alta`;
- sem escala 1-10 na interface de registro;
- prioridade: rapidez, clareza e recorrencia do check-in.

## Implementacao Tecnica

Arquivos alterados:

- `src/paginas/Registro/componentes/EtapasRegistro.tsx`
- `src/paginas/Registro/PaginaRegistro.tsx`
- `src/paginas/Registro/useFluxoRegistro.ts`
- `src/paginas/Registro/pagina-registro.module.scss`
- `__testes__/ui/wizard-registro.teste.tsx`
- `docs/PONTO-EM-ABERTO.md`

Principais mudancas:

- remocao do slider de intensidade e da escala de 1 a 10;
- remocao do estado `intensidadeEscala` no hook do fluxo;
- substituicao por tres opcoes diretas com legenda:
  - `Leve`: mais sutil
  - `Media`: intermediaria
  - `Alta`: mais intensa
- ajuste da etapa para copy orientada a escolha rapida.

## Criterios de Aceite

- etapa de intensidade nao possui slider;
- usuario seleciona intensidade por uma das tres opcoes;
- fluxo segue normalmente ate salvar registro;
- testes de UI do wizard passam;
- build de producao compila sem erros.

## Validacao Executada

- `npm run test -- --run __testes__/ui/wizard-registro.teste.tsx`
- `npm run build`

## Resultado

Item X.1 fechado tecnicamente e documentalmente no MVP.
