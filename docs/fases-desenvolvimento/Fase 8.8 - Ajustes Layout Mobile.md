# Fase 8.8 — Ajustes de layout mobile

## Contexto

O Compasso foi desenhado como mobile-first, mas a navegação atual segue o padrão web desktop: barra de topo com marca, nav e atalho de configurações. Em mobile essa barra vira duas linhas, ocupa espaço vertical precioso e não segue o padrão de navegação de apps nativos.

Esta fase corrige o padrão de navegação e outros pontos de layout que impactam a experiência em telas pequenas.

---

## Problema 1 — Menu no topo em mobile

### Diagnóstico

O `app-header` atual contém, em mobile:

- linha 1: marca (Compasso) + ícone de configurações
- linha 2: nav com links horizontais scrolláveis

Isso consome espaço vertical na parte superior da tela. Em apps nativos e PWAs de uso recorrente, a navegação principal fica na **parte inferior**, acessível com o polegar, próxima à mão.

### Regra de produto

Em telas menores que `$ponto-corte-tablet` (768px):

- a navegação principal (`Início`, `Registrar`, `Pausa`, `Ritmo`) sai do topo e vai para uma **barra inferior fixa**;
- o header do topo mantém apenas a marca e o atalho de configurações;
- a barra inferior exibe ícone + rótulo curto para cada item;
- o item ativo deve ter destaque visual claro (cor de acento);
- a barra inferior deve ter `safe-area-inset-bottom` para funcionar corretamente em iPhones com entalhe;
- o `main` deve ter `padding-bottom` suficiente para o conteúdo não ficar escondido atrás da barra inferior.

Em telas iguais ou maiores que `$ponto-corte-tablet`:

- layout atual mantido: nav inline no header do topo.

### Implementação esperada

**`src/App.tsx`**

- Mover o `<nav className="app-nav">` para fora do header, como um `<nav>` irmão de `<main>`, com classe própria de barra inferior.
- O header reduzido exibe apenas marca + atalho de config.
- Alternativa igualmente válida: manter o mesmo elemento `<nav>` e controlar a posição inteiramente via CSS — menos mudança de JSX, mais simples.

**`src/App.scss`**

Em mobile (`max-width: $ponto-corte-tablet - 1px`):

```scss
.app-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 30;
  display: flex;
  justify-content: space-around;
  align-items: center;
  // altura + safe area
  padding-bottom: env(safe-area-inset-bottom, 0px);
  // fundo com blur
  backdrop-filter: blur(18px);
  background: rgba($cor-bg-primaria, 0.90);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.app-nav__link {
  // ícone empilhado + rótulo abaixo
  flex-direction: column;
  gap: 2px;
  font-size: $tamanho-pequeno;
  padding: 0.6rem 0;
  flex: 1;
  justify-content: center;
}

.principal {
  // garantir que o conteúdo não fique atrás da barra inferior
  padding-bottom: calc(4.5rem + env(safe-area-inset-bottom, 0px));
}
```

Em desktop (`min-width: $ponto-corte-tablet`):

- `app-nav` volta ao comportamento atual: inline no header, sem `position: fixed`.
- `principal` sem padding-bottom extra.

**`src/App.tsx`** — header mobile simplificado:

- Quando em mobile, o header pode ocultar a nav ou esta fica fora do header.
- Configurações continuam no canto direito do header.

### Critérios de aceitação

- [ ] Em mobile (375px), navegação principal aparece na parte inferior da tela.
- [ ] Em desktop (≥768px), navegação permanece no header como hoje.
- [ ] Item ativo com destaque visual em ambas as posições.
- [ ] Conteúdo não fica coberto pela barra inferior em nenhuma página.
- [ ] Funciona em iOS com `safe-area-inset-bottom`.
- [ ] Tema claro e escuro consistentes.
- [ ] Nenhum link de navegação duplicado no DOM.

---

## Problema 2 — Header redundante em mobile após a mudança

### Diagnóstico

Com a nav indo para o rodapé, o header mobile passa a ter apenas marca + ícone de config. Pode ficar muito vazio ou pode ser simplificado para ocupar menos altura.

### O que fazer

Reduzir o padding vertical do header em mobile. Manter marca e atalho de configurações. Nenhuma mudança estrutural — só espaçamento.

---

## Restrições

- não alterar o layout em desktop;
- não remover a marca do topo em nenhuma breakpoint;
- não criar componente novo só para a barra inferior — reaproveitar o `app-nav` existente via CSS;
- manter `aria-label="Navegação principal"` no elemento `<nav>`;
- o atalho de configurações permanece no header, não na barra inferior.

---

## Escopo de arquivos

| Arquivo | Mudança |
|---|---|
| `src/App.scss` | Regras de posição e layout da nav em mobile |
| `src/App.tsx` | Ajuste estrutural mínimo se necessário (mover nav para fora do header) |

---

## Plano de implementação

### Passo 1 — Mover `<nav>` para fora do `<header>` no JSX

Separar o `<nav className="app-nav">` do `<header>`, tornando-o irmão de `<header>` e `<main>`. O atalho de configurações permanece no header.

Isso evita que o CSS precise sobrescrever `position` de um elemento dentro do header, simplificando os estilos mobile.

### Passo 2 — Estilizar `app-nav` como barra inferior em mobile

Adicionar bloco `@media (max-width: $ponto-corte-tablet - 1px)` em `.app-nav` com:

- `position: fixed; bottom: 0; left: 0; right: 0`
- `flex-direction: row; justify-content: space-around`
- `padding-bottom: env(safe-area-inset-bottom, 0px)`
- fundo com `backdrop-filter` e borda superior

### Passo 3 — Ajustar links da nav em mobile

Em mobile, cada `.app-nav__link` deve empilhar ícone sobre rótulo (`flex-direction: column`), com fonte menor e altura fixa de área de toque (`min-height: 3.25rem`).

### Passo 4 — Adicionar `padding-bottom` ao `<main>` em mobile

Garantir que o último item de qualquer página não fique coberto pela barra inferior.

### Passo 5 — Ajustar tema claro para barra inferior

Replicar as variações de cor do `.app-header` para `.app-nav` no bloco `body.tema-claro`.

### Passo 6 — Testes

Validar o teste de UI existente da home:

- `home-principal.teste.tsx` usa JSDOM, sem media queries reais — os testes de comportamento não quebram.
- Validação visual deve ser feita manualmente em 375px.

Rodada do gate de qualidade:

```bash
npm run type-check && npm run lint && npm run build && npm run coverage
```
