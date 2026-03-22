# Compasso

Compasso e um web app mobile-first de autoconsciencia e equilibrio de habitos, com foco em privacidade local, reducao de danos e linguagem brasileira acessivel.

## Base do projeto

Este README permanece como documento-base e ponto de entrada do repositorio.
Ele resume a proposta do produto, os principios de construcao e como navegar no restante da documentacao.

### Proposta

- Ajudar a pessoa usuaria a registrar contexto de uso com rapidez.
- Mostrar padroes de ritmo e pausas sem tom moralista.
- Tornar ganhos de bem-estar e economia visiveis.
- Incentivar autonomia e consistencia no dia a dia.

### Limites do produto

- Nao e ferramenta clinica.
- Nao substitui orientacao medica.
- Nao e plataforma de compra/venda nem de intermediacao.

### Principios de construcao

- Privacidade por padrao (dados locais).
- Offline-first no MVP.
- Experiencia simples, amigavel e sem julgamento.
- Evolucao incremental com testes e gate de qualidade.

## Mapa de documentacao

- Fundamentos completos do produto (conteudo original integral): `docs/FUNDAMENTOS-PRODUTO.md`
- Arquitetura tecnica e fases de execucao: `docs/PROJETO WEB APP.md`
- Guia tecnico de desenvolvimento (setup, comandos, cobertura): `docs/GUIA-DESENVOLVIMENTO.md`

## Inicio rapido (desenvolvimento)

```bash
npm install
npm run dev
```

## Gate de qualidade

```bash
npm run type-check && npm run lint && npm run build && npm run coverage
```
