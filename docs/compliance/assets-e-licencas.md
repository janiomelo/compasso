# Origem de assets e licencas

## Objetivo

Consolidar de forma rastreavel a origem de icones e assets do produto, o estado de licencas de terceiros e as pendencias de originalidade a fechar antes de distribuicao.

## Levantamento atual (22/03/2026)

- icones funcionais: padrao definido em `lucide-react`, com uso consistente nas telas principais;
- simbolo da marca: provisório em SVG, integrado no cabecalho (`src/App.tsx`) e preservado como base original;
- assets do app/PWA: `public/manifest.webmanifest` e `public/sw.js` ja apontam para assets proprios em `public/brand/`;
- recursos externos: nao ha uso de CDN ou imagens remotas no `src/` ou `public/`;
- licencas de terceiros: dependencias presentes em `node_modules` e artefato formal criado em `THIRD_PARTY_NOTICES.md`;
- microcopy: sem evidencia automatica de proximidade com concorrentes, dependendo de revisao editorial manual.

## Origem dos icones

- biblioteca oficial: `lucide-react` (ver `package.json`);
- uso esperado: navegacao, acoes, estados e componentes funcionais da interface;
- excecao atual: simbolo de marca no cabecalho (`src/App.tsx`), tratado como elemento de identidade e nao iconografia funcional.

## Origem do simbolo da marca

- arquivo base/original preservado: `public/brand/compasso-simbolo-provisorio-base.svg`;
- uso atual na navbar: geometria equivalente renderizada em SVG inline em `src/App.tsx`;
- variacoes de uso criadas: `public/brand/compasso-favicon.svg`, `public/brand/compasso-app-icon.svg`, `public/brand/compasso-navbar.svg`;
- direcao: manter o simbolo como provisório ate fechamento da identidade definitiva.

## Assets do app/PWA

- `public/manifest.webmanifest`: icones apontam para `/brand/compasso-app-icon.svg`;
- `public/sw.js`: recursos iniciais incluem os novos assets de marca em `/brand/`;
- `index.html`: favicon aponta para `/brand/compasso-favicon.svg`.

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

- definir simbolo definitivo da marca;
- manter e atualizar `THIRD_PARTY_NOTICES.md` conforme dependencias evoluem;
- revisar microcopy como parte do checklist editorial de originalidade.
