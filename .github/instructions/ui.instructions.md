---
applyTo: "src/paginas/**,src/componentes/**,src/estilos/**"
---

# UI e componentes — Compasso

> Para o sistema de design completo: `docs/agents/design-system.md`

---

## Princípios de interface

- **Mobile-first:** toda tela deve funcionar bem em 375px de largura antes de pensar em desktop.
- **Sem julgamento:** a interface não qualifica comportamentos. Neutro, não ansioso.
- **Leitura fácil:** hierarquia clara, sem poluição visual, sem grades forçadas que precisem de conteúdo artificial.
- **Ações explícitas:** o usuário nunca deve duvidar do que um botão ou link faz.

---

## Componentes reutilizáveis disponíveis

| Componente | Uso |
|---|---|
| `Botao` | Ações primárias, secundárias e de perigo |
| `Modal` | Confirmações e alertas destrutivos |
| `Cartao` | Container de conteúdo agrupado |
| `Chip` | Tags e rótulos de estado |
| `Distintivo` | Contador ou indicador numérico |
| `AvisoOffline` | Banner de conectividade |

Criar novo componente reutilizável somente quando a necessidade aparecer em dois contextos distintos.

---

## Padrões de layout

### Páginas de leitura (institucionais)

Usar o padrão `blocoLeitura > secaoTexto`:
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

### Páginas operacionais

Grades responsivas: coluna única em mobile, até 3 colunas em tablet/desktop conforme o conteúdo.

### Navegação de retorno

Toda página filha deve ter link `Voltar para [hub]` no topo com `ChevronLeft` do lucide-react.

---

## Estilos e variáveis

- Variáveis de espaçamento, cor e tipografia em `src/estilos/variaveis.scss`.
- CSS custom properties de tema em `src/estilos/globals.scss` (`--cor-fundo`, `--cor-texto`, `--borda-sutil`, etc.).
- Importar variáveis com: `@use '../../estilos/variaveis' as *`.
- Classes em `camelCase` dentro dos módulos SCSS.
- Sem estilos inline. Sem `!important`.

---

## Ícones (lucide-react)

Versão instalada **não** inclui todos os ícones da versão mais recente. Substitutos confirmados:

| Ícone desejado | Disponível na versão instalada |
|---|---|
| `BookOpenText` | `BookOpen` |
| `LockKeyhole` | `Lock` |
| `UserRound` | `UserCircle2` |

Antes de usar um ícone novo, verificar se existe na versão instalada.

---

## Temas (claro / escuro / automático)

- Controlado por `estado.configuracoes.tema` e `estado.configuracoes.temaAuto`.
- Aplicado via atributo `data-tema` no `<html>`.
- Classes de tema nunca entram em componentes individuais — somente via custom properties no `:root`.
- Mudanças de estratégia de tema só devem gerar ADR quando houver decisão real com impacto técnico.

---

## Microcopy

- Títulos de seção: descritivos, não genéricos. Evitar "Informações", "Dados", "Detalhes".
- Botões: verbo no infinitivo (`Exportar`, `Restaurar`, `Confirmar`). Nunca `OK` ou `Submit`.
- Mensagens de confirmação: explicar a consequência, não apenas o nome da ação.
- Placeholder de campo: contexto de exemplo real, não "Digite aqui".
