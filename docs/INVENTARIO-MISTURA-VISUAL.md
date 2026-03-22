# Inventario de Mistura Visual

## Escopo

Levantamento dos pontos que ainda usam linguagem visual fora da iconografia Lucide padrao, apos o fechamento do item X.2.

## Pontos encontrados

1. Marca no cabecalho usa emoji
- Arquivo: `src/App.tsx`
- Referencia: `src/App.tsx:86`
- Estado: excecao deliberada de marca (conforme decisao do X.2).
- Acao sugerida: manter como excecao documentada ou substituir por simbolo proprio em SVG quando a marca final for fechada.

2. Tendencia em texto usa glifos Unicode
- Arquivo: `src/utilitarios/apresentacao/rotulos.ts`
- Referencias: `src/utilitarios/apresentacao/rotulos.ts:20`, `src/utilitarios/apresentacao/rotulos.ts:21`, `src/utilitarios/apresentacao/rotulos.ts:22`
- Estado: usa `↑`, `↓`, `→` como parte do rotulo textual.
- Acao sugerida: decidir se permanece como recurso de microcopy ou se migra para icones Lucide nas superficies de exibicao.

3. Mensagem de sucesso usa simbolo textual
- Arquivo: `src/paginas/Registro/PaginaRegistro.tsx`
- Referencia: `src/paginas/Registro/PaginaRegistro.tsx:64`
- Estado: usa `✓` no texto de feedback.
- Acao sugerida: opcionalmente substituir por `Check` da Lucide para padrao total de estados visuais.

## Superficies ja alinhadas com Lucide

- navegacao principal e acoes globais (`src/App.tsx`)
- registro (metodo, intencao e opcao "Outro") (`src/paginas/Registro/componentes/EtapasRegistro.tsx`)
- home (`src/paginas/Principal/componentes/*`)
- pausa (`src/paginas/Pausa/PaginaPausa.tsx`)
- ritmo (`src/paginas/Ritmo/PaginaRitmo.tsx`)
- configuracoes (`src/paginas/Config/PaginaConfig.tsx`)

## Prioridade recomendada

- P1: decidir regra para glifos de tendencia (`↑`, `↓`, `→`);
- P2: decidir se feedback textual com `✓` entra na regra de iconografia;
- P3: consolidar excecao de marca em guideline final (emoji temporario vs simbolo SVG da marca).
