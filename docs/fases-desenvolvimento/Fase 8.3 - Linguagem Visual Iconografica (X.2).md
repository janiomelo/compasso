# Fase 8.3 - Linguagem Visual Iconografica (X.2)

## Objetivo

Executar a decisao do X.2 no fluxo principal: padronizar iconografia funcional em Lucide e remover mistura de emojis nas etapas de registro.

## Decisao aplicada

- biblioteca padrao de icones: Lucide;
- logo tratado como excecao de marca;
- metodo, intencao e opcao "Outro" alinhados a uma mesma familia iconografica.

## Implementacao tecnica

Arquivos alterados:

- `src/paginas/Registro/componentes/EtapasRegistro.tsx`
- `src/paginas/Registro/pagina-registro.module.scss`
- `src/utilitarios/constantes.ts`

Mudancas principais:

- remocao de emojis das constantes de metodos e intencoes;
- criacao de mapeamentos de icones Lucide por id em `EtapasRegistro`;
- renderizacao de SVG Lucide nas etapas de Metodo e Intencao;
- ajustes de estilo para suportar icones vetoriais.

## Criterios de aceite

- etapas de Metodo e Intencao nao exibem emojis;
- opcao "Outro" segue a mesma familia de icones;
- fluxo de registro continua funcional;
- build compila sem erro.

## Validacao executada

- `npm run test -- --run __testes__/ui/wizard-registro.teste.tsx`
- `npm run build`

## Entregavel complementar

- inventario de mistura visual residual em `docs/INVENTARIO-MISTURA-VISUAL.md`.
