# THIRD PARTY NOTICES

Este arquivo registra bibliotecas de terceiros relevantes usadas no projeto Compasso e seus respectivos modelos de licenca.

As informacoes abaixo sao um ponto de partida para distribuicao e devem ser revisadas quando as dependencias forem atualizadas.

Escopo de exibicao na UI:

- A tela de "Licencas e creditos" no app deve mostrar apenas um resumo contextual (runtime/UI).
- Este arquivo permanece como inventario mais amplo para distribuicao e compliance.

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
- Terser (`terser`) - BSD-2-Clause
- Vitest (`vitest`) - MIT
- Vitest UI (`@vitest/ui`) - MIT
- Vitest Coverage V8 (`@vitest/coverage-v8`) - MIT
- Testing Library (`@testing-library/react`, `@testing-library/jest-dom`) - MIT
- jsdom (`jsdom`) - MIT
- fake-indexeddb (`fake-indexeddb`) - Apache-2.0
- Type definitions Pako (`@types/pako`) - MIT

## Observacoes

- A lista acima resume os pacotes principais e nao substitui auditoria completa de toda a arvore de dependencias transitivas.
- Os arquivos de licenca originais das dependencias ficam em `node_modules/*/LICENSE*`.
- Antes de release/distribuicao, executar revisao final de notices conforme `package-lock.json` vigente.
