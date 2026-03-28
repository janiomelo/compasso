# Origem de assets e licenças

## Objetivo

Consolidar de forma rastreável a origem de ícones e assets do produto, o estado de licenças de terceiros e as pendências de originalidade a fechar antes de distribuição.

## Levantamento atual (28/03/2026)

- ícones funcionais: padrão definido em `lucide-react`, com uso consistente nas telas principais;
- símbolo da marca: provisório em SVG, integrado no cabeçalho (`src/App.tsx`) e preservado como base original;
- assets do app/PWA: `public/manifest.webmanifest` e `public/sw.js` já apontam para assets próprios em `public/brand/`;
- recursos externos: não há uso de CDN ou imagens remotas para assets de interface no `src/` ou `public/`; existe carregamento opcional de script externo de telemetria (Umami) quando configurado e consentido;
- licenças de terceiros: dependências presentes em `node_modules` e artefato formal criado em `THIRD_PARTY_NOTICES.md`;
- microcopy: sem evidência automática de proximidade com concorrentes, dependendo de revisão editorial manual.

## Origem dos ícones

- biblioteca oficial: `lucide-react` (ver `package.json`);
- uso esperado: navegação, ações, estados e componentes funcionais da interface;
- exceção atual: símbolo de marca no cabeçalho (`src/App.tsx`), tratado como elemento de identidade e não iconografia funcional.

## Origem do símbolo da marca

- arquivo base/original preservado: `public/brand/compasso-simbolo-provisorio-base.svg`;
- uso atual na navbar: arquivo externo `public/brand/compasso-navbar.svg`, referenciado em `src/App.tsx`;
- variações de uso criadas: `public/brand/compasso-favicon.svg`, `public/brand/compasso-app-icon.svg`, `public/brand/compasso-navbar.svg`, `public/brand/compasso-social-preview.svg` e `public/brand/compasso-social-preview.png`;
- direção: manter o símbolo como provisório até fechamento da identidade definitiva.

Responsável pela marca provisória nesta fase: Janio Melo (janiomelo.dev).

Contato: contato@compasso.digital

Site: https://compasso.digital

Repositório: https://github.com/janiomelo/compasso

## Assets do app/PWA

- `public/manifest.webmanifest`: ícones apontam para `/brand/compasso-app-icon.svg`;
- `public/sw.js`: recursos iniciais incluem os novos assets de marca em `/brand/`;
- `index.html`: favicon aponta para `/brand/compasso-favicon.svg`.

## Bibliotecas e vendors relevantes

- `lucide-react`: iconografia funcional da interface;
- `react`, `react-dom`, `react-router-dom`: base de runtime da aplicacao;
- `dexie`: persistência local;
- `pako`: compactação para operações de exportação/importação.

## Licenças e notices

- licenças de dependências são distribuídas em `node_modules/*/LICENSE*`;
- o repositório passa a manter artefato formal em `THIRD_PARTY_NOTICES.md`;
- quando houver distribuição pública, revisar e atualizar notices conforme lockfile vigente.
- telemetria Umami: script carregado de origem externa apenas com consentimento, conforme implementação em `src/utilitarios/telemetria/umami.ts`.

## Pendências abertas

- definir símbolo definitivo da marca;
- manter e atualizar `THIRD_PARTY_NOTICES.md` conforme dependencias evoluem;
- revisar microcopy como parte do checklist editorial de originalidade.
