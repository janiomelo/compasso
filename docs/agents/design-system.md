# Sistema de design — Compasso

**Última atualização:** março de 2026

---

## Princípios visuais

- **Mobile-first:** tudo funciona em 375px antes de pensar em breakpoints maiores.
- **Sem ruído:** hierarquia clara, densidade adequada, sem elementos decorativos sem função.
- **Neutro, não ansioso:** o visual não pressiona, não celebra nem pune.
- **Leitura antes de ação:** páginas informativas usam fluxo linear, não grades artificiais.

---

## Tokens de design

Definidos em `src/estilos/variaveis.scss`. Principais:

### Espaçamento

| Token | Referência |
|---|---|
| `$espaco-xs` | espaçamento mínimo (ex.: gaps internos) |
| `$espaco-sm` | espaçamento pequeno |
| `$espaco-md` | espaçamento médio (padrão entre seções) |
| `$espaco-lg` | espaçamento grande (entre blocos) |
| `$espaco-xl` | espaçamento extra (margens de página) |

### Tipografia

- Fonte do sistema (`system-ui`, `-apple-system`, fallbacks).
- Escala definida em `variaveis.scss` via variáveis `$fonte-*`.
- Hierarquia: `h1` (título de página) → `h2` (seção) → `h3` (subseção) → `p` (corpo).

### Cores e temas

CSS custom properties em `src/estilos/globals.scss`:

| Variável | Uso |
|---|---|
| `--cor-fundo` | Fundo da página |
| `--cor-superficie` | Cards e painéis |
| `--cor-texto` | Texto principal |
| `--cor-texto-sutil` | Texto secundário e rótulos |
| `--cor-primaria` | Ações principais e destaques |
| `--cor-perigo` | Ações destrutivas |
| `--borda-sutil` | Divisores e bordas de card |
| `--sombra-card` | Sombra de cards elevados |

Aplicados via atributo `data-tema` no `<html>`. Decisões relacionadas devem ser registradas em `docs/agents/decisions/` somente quando houver necessidade real.

---

## Padrões de layout

### Página de leitura (institucional)

Fluxo vertical com largura máxima de leitura:

```scss
.blocoLeitura {
  display: flex;
  flex-direction: column;
  gap: $espaco-md;
  width: min(100%, 56rem);
}

.secaoTexto {
  border-top: 1px solid var(--borda-sutil);
  padding-top: $espaco-md;
}
```

### Página operacional

Grade responsiva centrada nos dados:

```scss
.gradeEstado {
  display: grid;
  grid-template-columns: 1fr;
  gap: $espaco-sm;

  @media (min-width: 640px) {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### Hub de navegação

Links empilhados verticalmente com ícone + texto + descrição curta.

---

## Componentes principais

### Botao

Variantes: primário, secundário, perigo.
- Sempre com `type` explícito (`button`, `submit`).
- Label: verbo no infinitivo.

### Modal

Para confirmações de ações destrutivas (limpar dados, restaurar backup).
- Sempre com mensagem que explica a consequência.
- Botão de cancelar sempre presente.

### Cartao

Container de conteúdo agrupado. Variantes com e sem destaque.

### Chip / Distintivo

Para rótulos de estado e contadores.

### AvisoOffline

Banner global de conectividade. Exibido automaticamente quando offline.

---

## Ícones

Biblioteca: `lucide-react`. 

**Atenção:** a versão instalada pode não incluir ícones adicionados recentemente. Ícones confirmados como ausentes e seus substitutos:

| Desejado | Disponível |
|---|---|
| `BookOpenText` | `BookOpen` |
| `LockKeyhole` | `Lock` |
| `UserRound` | `UserCircle2` |

Antes de usar um ícone novo, verificar se existe na versão instalada via `node_modules/lucide-react`.

---

## Microcopy

- Títulos de seção: descritivos, não genéricos.
- Botões: verbo no infinitivo (`Exportar`, `Restaurar`, `Confirmar`).
- Mensagens de confirmação: explicar consequência, não só o nome da ação.
- Sem backticks ou notação de código no texto visível ao usuário.
- Sem texto placeholder genérico ("Clique aqui", "Saiba mais", "OK").

---

## Navegação e retorno

- Toda página filha tem link de retorno no topo com `ChevronLeft`.
- Texto padrão: `Voltar para [nome do hub]`.
- Implementado via `Link` do react-router-dom (não `<a href>`).

---

## Decisões de UI e informação

Quando houver mudança relevante de direção (ex.: hierarquia de informação entre telas institucionais e operacionais), registrar ADR específico em `docs/agents/decisions/`.
