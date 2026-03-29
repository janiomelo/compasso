## Fase 9.6 — Preparação para lançamento público

Status: em andamento
Data: 29/03/2026

---

## 1. Objetivo

Garantir que o Compasso esteja pronto para ser descoberto e compartilhado publicamente — com boa apresentação em redes sociais, URL canônica correta e primeiras impressões consistentes com o produto.

Esta fase não adiciona funcionalidade nova. Ela valida e ajusta o que já existe sob a lente de quem vai chegar pela primeira vez.

---

## 2. Escopo

### 2.1 Compartilhamento social da home

Quando alguém cola `https://compasso.digital` em WhatsApp, Twitter, LinkedIn ou Telegram, o scraper de cada plataforma lê as meta tags Open Graph e monta um cartão de preview.

**Problemas encontrados e corrigidos em `index.html`:**

| Item | Antes | Depois |
|---|---|---|
| `og:image` | Caminho relativo `/brand/...` | URL absoluta `https://compasso.digital/brand/...` |
| `twitter:image` | Caminho relativo `/brand/...` | URL absoluta `https://compasso.digital/brand/...` |
| `og:url` | Ausente | `https://compasso.digital` |
| `og:image:alt` | Ausente | Texto descritivo da imagem |
| `twitter:image:alt` | Ausente | Texto descritivo da imagem |
| `og:image:width/height` | Ausentes | `1280` × `640` |

> Caminhos relativos em `og:image` fazem scrapers renderizarem o cartão sem imagem, pois cada plataforma resolve a URL a partir de seu próprio servidor, não do domínio da página.

**Estado atual da imagem OG:**
- Arquivo: `public/brand/compasso-social-preview.png`
- Dimensões: 1280 × 640 px (acima do mínimo recomendado de 1200 × 630)
- Conteúdo: nome do produto, tagline, atributos principais, fundo escuro com ícone

**Páginas estáticas (telemetria, como-funciona, apoie, privacidade, termos, projeto):** já estavam corretas com URLs absolutas. O `index.html` estava desalinhado.

---

### 2.2 Validação manual (pré-lançamento)

Ferramentas para verificar depois do próximo deploy:

| Ferramenta | URL | O que valida |
|---|---|---|
| Facebook OG Debugger | https://developers.facebook.com/tools/debug/ | Leitura das tags OG, cache e preview do cartão |
| Twitter Card Validator | https://cards-dev.twitter.com/validator | Renderização do cartão no X/Twitter |
| LinkedIn Post Inspector | https://www.linkedin.com/post-inspector/ | Preview no LinkedIn |
| Open Graph check | https://www.opengraph.xyz | Leitura independente de todas as tags |

Pontos a conferir em cada ferramenta:
- [ ] Título aparece completo: "Compasso — Ritmo, Pausas e Equilíbrio"
- [ ] Descrição legível e sem corte relevante
- [ ] Imagem carrega (não aparece ícone de imagem quebrada)
- [ ] URL exibida é `https://compasso.digital` (sem redirect loop)

---

### 2.3 Itens adicionais de lançamento (a avaliar)

Outros pontos que devem ser verificados antes do lançamento público efetivo:

1. **Experiência de primeiro acesso:** o onboarding guia bem quem chega sem contexto? O copy da home é suficientemente claro para alguém que nunca ouviu falar do produto?

2. **PWA install prompt:** o prompt de instalação aparece no momento certo e com texto adequado (nome, ícone, descrição no manifest)? O ícone em 192px e 512px tem boa qualidade?

3. **Checklist de release:** o arquivo `docs/checklists/release-checklist.md` está atualizado e cobre os pontos acima?

---

## 3. Critérios de conclusão

- [x] `index.html` com URLs absolutas e todas as meta tags OG presentes
- [ ] Validação manual pós-deploy nas ferramentas acima (mínimo: OG Debugger + OpenGraph.xyz)
- [ ] Itens 2.3 avaliados e com decisão registrada (fazer agora ou adiar para pós-lançamento)

---

## 4. Fora do escopo desta fase

- Criação de imagem OG específica para subpáginas (telemetria, privacidade etc.) — já têm imagem genérica satisfatória
- Tradução ou versão em inglês das meta tags
- Schema.org / structured data — analisar em fase futura se relevante para SEO
