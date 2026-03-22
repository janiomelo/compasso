# Diretrizes de Temas e Cores Base

Data: 22/03/2026  
Status: Oficial (Fase 8.1)

## 1. Objetivo

Estabelecer uma base visual estável para o Compasso, garantindo legibilidade, personalidade e consistência entre dark mode e light mode.

## 2. Decisões oficiais

- O produto possui dois temas oficiais: `escuro` e `claro`.
- O comportamento inicial segue a preferência do sistema operacional/navegador.
- O usuário pode escolher explicitamente: `Automático`, `Claro` ou `Escuro`.
- O acento principal da marca é verde sálvia/menta.
- Glow é recurso de destaque, não linguagem padrão de todos os elementos.

## 3. Tokens semânticos obrigatórios

Toda implementação de UI deve priorizar tokens semânticos em vez de cores fixas.

### Tokens base

- `--cor-bg-primaria`
- `--cor-bg-secundaria`
- `--cor-bg-terciaria`
- `--cor-texto-primaria`
- `--cor-texto-secundaria`
- `--cor-texto-terciaria`
- `--cor-acento-principal`
- `--cor-acento-secundaria`

### Tokens de superfície

- `--superficie-elevada`
- `--superficie-cartao`
- `--superficie-cartao-forte`
- `--superficie-suave`
- `--superficie-sutil`

### Tokens de apoio visual

- `--borda-suave`
- `--borda-sutil`
- `--trilho`

## 4. Regras de contraste e legibilidade

- Textos principais devem usar `--cor-texto-primaria`.
- Textos de suporte devem usar `--cor-texto-secundaria` ou `--cor-texto-terciaria`.
- Cabeçalho, marca e navegação precisam ser revisados nos dois temas.
- Não usar texto branco fixo em superfícies claras.
- Antes de merge, validar visualmente telas principais em claro e escuro.

## 5. Regra de glow e destaque

### Limite por tela

- Ideal: 1 elemento principal com glow por tela.
- Exceção: até 2 elementos, com hierarquia clara entre principal e secundário.

### Pode usar glow

- CTA principal.
- Hero principal.
- Estado especial de destaque realmente necessário.

### Evitar glow

- Navegação padrão.
- Cards secundários.
- Listas e itens repetitivos.
- Inputs comuns e controles de apoio.

## 6. Regra de orientação visual

Adotar a direção: `60% utilitário / 40% editorial elegante`.

Em caso de dúvida entre soluções:

1. vence a mais funcional;
2. vence a mais clara;
3. vence a mais repetível;
4. vence a mais manutenível.

## 7. Checklist mínimo de PR visual

- [ ] Tema claro revisado.
- [ ] Tema escuro revisado.
- [ ] Marca/header legíveis nos dois temas.
- [ ] Glow dentro do limite por tela.
- [ ] Sem cores fixas contradizendo tokens semânticos.

## 8. Referências no projeto

- Implementação base dos tokens: `src/estilos/globals.scss`
- Shell visual do app: `src/App.scss`
- Decisões de fase: `docs/fases-desenvolvimento/Fase 8.1 - Tema e Linguagem Visual (X.1 e X.2).md`
- Pontos de decisão: `docs/PONTO-EM-ABERTO.md`
