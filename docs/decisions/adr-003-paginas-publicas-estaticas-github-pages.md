# ADR-003 — Páginas públicas estáticas para sitemap e SEO no GitHub Pages

**Status:** Aprovado  
**Data:** 29 de março de 2026  
**Escopo:** Publicação, SEO, sitemap, páginas públicas institucionais  
**Associado a:** [D-07: Estratégia de publicação das páginas públicas](../DECISOES-EM-ABERTO.md)

---

## 1. Problema

O Compasso já publica URLs públicas no sitemap, mas hoje essas rotas são resolvidas principalmente no cliente, via React Router.

No contexto de GitHub Pages, isso cria um problema crítico de lançamento:

- a URL pública pode depender de fallback de SPA para abrir;
- acessos diretos podem cair em `404.html` antes de o app recuperar a rota;
- o status HTTP pode permanecer `404` em cenários de deep link;
- crawlers e previews sociais podem receber HTML genérico ou insuficiente para indexação adequada.

Como a prioridade imediata é garantir SEO e preview corretos para as páginas do sitemap, a estratégia atual não é suficiente.

---

## 2. Contexto

### 2.1 Estado atual do produto

- O app principal continua sendo uma SPA com rotas privadas protegidas por onboarding.
- Já existem páginas públicas institucionais para privacidade, funcionamento, projeto, termos, apoio e telemetria.
- O sitemap público já expõe essas URLs como páginas indexáveis.
- O deploy é feito em GitHub Pages.

### 2.2 Restrição da plataforma

GitHub Pages não oferece, como comportamento padrão, rewrite com resposta `200` para rotas arbitrárias de uma SPA, no modelo equivalente ao `_redirects` de Netlify.

Na prática:

- `404.html` pode recuperar navegação no navegador, mas não resolve corretamente status HTTP para SEO;
- depender apenas do cliente para compor `<title>`, `description` e previews sociais é frágil;
- URLs do sitemap precisam existir como artefatos reais no build para responder como páginas públicas de fato.

### 2.3 Princípios que precisam ser preservados

- privacidade por padrão;
- offline-first para o app principal;
- linguagem brasileira e institucional coerente;
- separação clara entre páginas públicas de leitura e fluxos operacionais protegidos.

---

## 3. Decisão

Fica aprovada a adoção de **páginas públicas estáticas por rota** para todas as URLs públicas do sitemap, mantendo o restante do produto como SPA.

### 3.1 O que passa a valer

As seguintes rotas públicas devem ser publicadas como arquivos HTML reais no build:

- `/privacidade`
- `/como-funciona`
- `/projeto`
- `/termos`
- `/apoie`
- `/telemetria`

Cada rota deve ter:

- HTML específico da página;
- `title` próprio;
- `meta description` própria;
- `canonical` própria;
- metadados mínimos de preview social;
- presença consistente no sitemap.

### 3.2 O que permanece SPA

As rotas operacionais e protegidas do produto continuam sendo entregues como SPA, incluindo:

- página inicial do app;
- registro;
- pausa;
- ritmo;
- configurações;
- fluxos protegidos por onboarding.

### 3.3 Papel do `404.html`

`404.html` deixa de ser parte da estratégia principal de publicação das páginas públicas.

Seu papel passa a ser secundário:

- fallback residual para rotas inexistentes;
- recuperação limitada de navegação quando aplicável;
- compatibilidade de plataforma, mas não solução de indexação.

### 3.4 Fonte canônica

As páginas públicas passam a depender de um **manifesto canônico de publicação**, contendo ao menos:

- rota;
- título;
- descrição;
- `canonical`;
- prioridade e frequência do sitemap;
- referência de conteúdo;
- imagem de preview.

Esse manifesto será a base para:

- geração das páginas estáticas;
- geração ou validação do sitemap;
- consistência de metadados entre produto e publicação.

---

## 4. Alternativas consideradas

### Alternativa A — Manter fallback SPA reforçado

**Rejeitada.**

Vantagens:

- menor escopo de implementação;
- mantém arquitetura atual quase intacta.

Problemas:

- inadequada para GitHub Pages como estratégia principal;
- não garante resposta correta para SEO e preview;
- mantém dependência excessiva do runtime do cliente.

### Alternativa B — Páginas públicas estáticas por rota

**Escolhida.**

Vantagens:

- compatível com GitHub Pages;
- garante HTML específico por URL pública;
- melhora indexação e compartilhamento;
- mantém o app principal desacoplado da área institucional.

Trade-off:

- exige pipeline de geração estática;
- exige manifesto canônico para evitar divergência.

### Alternativa C — Prerender híbrido ou SSR

**Não escolhida neste momento.**

Motivos:

- maior complexidade operacional agora;
- custo técnico superior ao necessário para o requisito imediato;
- SSR introduziria uma dependência estrutural que não é necessária para o escopo atual.

---

## 5. Consequências

### 5.1 Consequências positivas

- URLs públicas do sitemap passam a existir como páginas reais;
- melhoria de SEO técnico e preview social;
- redução da dependência de fallback específico de hospedagem;
- base mais agnóstica de plataforma para futuras mudanças de hosting.

### 5.2 Consequências e custos

- necessidade de criar e manter um manifesto canônico das páginas públicas;
- necessidade de integrar geração estática ao build;
- necessidade de manter sitemap e publicação sincronizados;
- necessidade de separar explicitamente conteúdo público institucional do app SPA.

### 5.3 Restrições de governança

- não documentar implementação detalhada fora do código quando isso já estiver claro na base;
- registrar somente a decisão arquitetural e suas consequências nesta ADR;
- evitar duplicação de documentação operacional desnecessária.

---

## 6. Critério de pronto da decisão

Esta decisão estará adequadamente materializada quando:

- toda URL pública do sitemap tiver artefato HTML próprio no build;
- páginas públicas deixarem de depender de `404.html` para abertura direta;
- o manifesto canônico existir como base única de publicação;
- sitemap e páginas públicas puderem ser mantidos de forma consistente a partir da mesma fonte.