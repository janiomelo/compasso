# THIRD PARTY NOTICES

Este arquivo registra bibliotecas de terceiros relevantes usadas no projeto Compasso e seus respectivos modelos de licenca.

As informacoes abaixo sao um ponto de partida para distribuicao e devem ser revisadas quando as dependencias forem atualizadas.

## Runtime e UI

- React (`react`) - MIT
- React DOM (`react-dom`) - MIT
- React Router DOM (`react-router-dom`) - MIT
- Lucide React (`lucide-react`) - ISC
- Dexie (`dexie`) - Apache-2.0
- Pako (`pako`) - MIT
- clsx (`clsx`) - MIT

## Toolchain e testes (relevantes para distribuicao de codigo)

- Vite (`vite`) - MIT
- TypeScript (`typescript`) - Apache-2.0
- Sass (`sass`) - MIT
- ESLint (`eslint`) - MIT
- Vitest (`vitest`) - MIT
- Testing Library (`@testing-library/react`, `@testing-library/jest-dom`) - MIT

## Observacoes

- A lista acima resume os pacotes principais e nao substitui auditoria completa de toda a arvore de dependencias transitivas.
- Os arquivos de licenca originais das dependencias ficam em `node_modules/*/LICENSE*`.
- Antes de release/distribuicao, executar revisao final de notices conforme `package-lock.json` vigente.
