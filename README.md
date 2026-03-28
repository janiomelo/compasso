# <img src="public/brand/compasso-navbar.svg" alt="Compasso" height="32" style="vertical-align:middle"> Compasso

**🌐 [compasso.digital](https://compasso.digital)**

Compasso é um web app mobile-first de autoconsciência e equilíbrio de hábitos, com foco em privacidade local, redução de danos e linguagem brasileira acessível.

## Status atual

**Fase 8.12** (Final do MVP) — Telemetria anônima com Umami ativada por padrão, com transparência clara e desativação fácil.

### O que já está pronto (MVP)

- ✅ Registro de momentos com intenção e intensidade
- ✅ Pausa programada com duração customizável
- ✅ Dashboard de ritmo e economia
- ✅ Proteção local por senha + bloqueio automático
- ✅ Exportação/importação criptografada de dados
- ✅ **Telemetria privada:** Umami com dados anônimos, desativação simples em Configurações

### O que não entra no MVP

- ❌ Compartilhamento de dados com outros usuários
- ❌ Comunidade ou redes sociais
- ❌ Subscrição ou modelo freemium
- ❌ Backend com conta obrigatória

### Roadmap

| Fase | Objetivo | Status |
|---|---|---|
| **8** | MVP completo (registro, pausa, ritmo, economia, proteção, telemetria) | 🟢 Finalizando |
| **9** | Consolidação e testes (QA, docs unificados, performance, checklist de release) | ⏳ Próximo |
| **10** | Lançamento público (deploy, divulgação, suporte inicial) | 📋 Planejado |

## Base do projeto

Este README permanece como documento-base e ponto de entrada do repositório.
Ele resume a proposta do produto, os princípios de construção e como navegar no restante da documentação.

### Proposta

- Ajudar a pessoa usuária a registrar contexto de uso com rapidez.
- Mostrar padrões de ritmo e pausas sem tom moralista.
- Tornar ganhos de bem-estar e economia visíveis.
- Incentivar autonomia e consistência no dia a dia.

### Limites do produto

- Não é ferramenta clínica.
- Não substitui orientação médica.
- Não é plataforma de compra/venda nem de intermediação.

### Princípios de construção

- **Privacidade por padrão:** dados ficam no dispositivo; sem backend obrigatório; sem rastreador invasivo.
- **Offline-first:** app funciona completamente desconectado; sincronização é adicional.
- **Sem julgamento:** interface não qualifica "uso bom" ou "uso ruim"; foco em autonomia.
- **Linguagem brasileira:** português com acentuação; sem anglicismos desnecessários.
- **Evolução incremental:** nenhuma feature sem gate de qualidade (type-check, lint, tests, coverage).

### O que vem depois do lançamento (Fase 10+)

Após o MVP estar em produção e estável (Fase 9 concluída), possíveis evoluções incluem:

- 📊 Análise avançada de telemetria (funis, segmentação, AB tests)
- 📈 Relatórios e insights personalizados
- 🔄 Sincronização opcional via cloud (com criptografia E2E)
- ⚙️ Customização pro-ativa de fluxos de pausa
- 🌍 Suporte a múltiplos idiomas

**Garantias:**
- ✅ Nenhuma coleta de dados acontece sem consentimento claro
- ✅ Compartilhamento com terceiros nunca será forçado
- ✅ Dados pessoais permanecerão sob controle do usuário
- ✅ Privacy-first é princípio inegociável, não feature marketável

## Mapa de documentação

### Product & Strategy

- Fundamentos completos do produto: `docs/FUNDAMENTOS-PRODUTO.md`
- Decisões arquiteturais (ADR): `docs/decisions/`
- Roadmap de fases e planejamento: `docs/fases-desenvolvimento/`
- Decisões em aberto e progresso: `docs/DECISOES-EM-ABERTO.md`

### Technical & Development

- Arquitetura técnica e visão geral: `docs/PROJETO WEB APP.md`
- Guia técnico de desenvolvimento (setup, comandos, cobertura): `docs/GUIA-DESENVOLVIMENTO.md`
- Design system e linguagem visual: `docs/agents/design-system.md`
- Product context completo: `docs/agents/product-context.md`

### Transparência & Legal

- **Compliance de assets e licenças:** `docs/transparencia/assets-e-licencas.md`

**Nota:** Política de privacidade, termos de uso e explicações de dados estão dentro da aplicação nas páginas públicas (`/privacidade`, `/termos`, `/como-funciona`) e são a fonte da verdade. Esta documentação no `/docs` é apenas de referência histórica.

## Para contribuidores

Instrução por domínio:

- `.github/instructions/product.instructions.md` — Contexto de produto e tom
- `.github/instructions/implementation.instructions.md` — Padrões de código (React, TS, arquitetura)
- `.github/instructions/ui.instructions.md` — Componentes, estilos, acessibilidade
- `.github/instructions/testing.instructions.md` — Padrões de teste (Vitest, cobertura)
- `.github/instructions/docs.instructions.md` — Documentação transparente

**Princípio:** se uma mudança afeta produto ou design, começar com ADR em `docs/decisions/`. Se toca em código, revisar a instrução relevante antes de fazer commit.

## Início rápido (desenvolvimento)

```bash
npm install
npm run dev
```

## Gate de qualidade

```bash
npm run type-check && npm run lint && npm run build && npm run coverage
```

## Norma de linguagem (Português First)

- Todo texto visível ao usuário deve usar português correto, com acentuação e cedilha quando aplicável.
- IDs técnicos (ex.: `metodo`, `intencao`, `concluida`) podem permanecer sem acento internamente, mas nunca devem ser exibidos diretamente na interface.
- Antes de cada commit com mudanças de UI, revisar títulos, labels, mensagens e placeholders para evitar regressões de escrita.
