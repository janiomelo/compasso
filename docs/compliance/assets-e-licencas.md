# Origem de assets e licencas

## Objetivo

Consolidar de forma rastreavel a origem de icones e assets do produto, o estado de licencas de terceiros e as pendencias de originalidade a fechar antes de distribuicao.

## Levantamento atual (22/03/2026)

- icones funcionais: padrao definido em `lucide-react`, com uso consistente nas telas principais;
- simbolo da marca: provisório, ainda representado por emoji em `src/App.tsx`;
- assets do app/PWA: `public/manifest.webmanifest` e `public/sw.js` ainda referenciam `vite.svg`, herdado do template inicial;
- recursos externos: nao ha uso de CDN ou imagens remotas no `src/` ou `public/`;
- licencas de terceiros: dependencias presentes em `node_modules`, mas o projeto ainda nao possui artefato proprio consolidado de notices;
- microcopy: sem evidencia automatica de proximidade com concorrentes, dependendo de revisao editorial manual.

## Origem dos icones

- biblioteca oficial: `lucide-react` (ver `package.json`);
- uso esperado: navegacao, acoes, estados e componentes funcionais da interface;
- excecao atual: simbolo de marca no cabecalho (`src/App.tsx`), tratado como elemento de identidade e nao iconografia funcional.

## Origem do simbolo da marca

- estado atual: emoji de bussola em `src/App.tsx`;
- natureza: marcador temporario de identidade;
- direcao: substituir por simbolo proprio (SVG do produto) quando a identidade final for fechada.

## Assets do app/PWA

- `public/manifest.webmanifest`: icones ainda apontando para `/vite.svg`;
- `public/sw.js`: recursos iniciais incluem `/vite.svg`;
- acao recomendada: substituir por assets oficiais do Compasso antes de release.

## Bibliotecas e vendors relevantes

- `lucide-react`: iconografia funcional da interface;
- `react`, `react-dom`, `react-router-dom`: base de runtime da aplicacao;
- `dexie`: persistencia local;
- `pako`: compactacao para operacoes de exportacao/importacao.

## Licencas e notices

- licencas de dependencias sao distribuidas em `node_modules/*/LICENSE*`;
- o repositório passa a manter artefato formal em `THIRD_PARTY_NOTICES.md`;
- quando houver distribuicao publica, revisar e atualizar notices conforme lockfile vigente.

## Pendencias abertas

- substituir `vite.svg` por asset proprio do produto antes de release;
- definir simbolo definitivo da marca;
- manter e atualizar `THIRD_PARTY_NOTICES.md` conforme dependencias evoluem;
- revisar microcopy como parte do checklist editorial de originalidade.
