# Compasso

Compasso é um web app mobile-first de autoconsciência e equilíbrio de hábitos, com foco em privacidade local, redução de danos e linguagem brasileira acessível.

## Base do projeto

Este README permanece como documento-base e ponto de entrada do repositorio.
Ele resume a proposta do produto, os princípios de construção e como navegar no restante da documentação.

### Proposta

- Ajudar a pessoa usuaria a registrar contexto de uso com rapidez.
- Mostrar padrões de ritmo e pausas sem tom moralista.
- Tornar ganhos de bem-estar e economia visíveis.
- Incentivar autonomia e consistência no dia a dia.

### Limites do produto

- Não é ferramenta clínica.
- Não substitui orientação médica.
- Não é plataforma de compra/venda nem de intermediação.

### Princípios de construção

- Privacidade por padrão (dados locais).
- Offline-first no MVP.
- Experiência simples, amigável e sem julgamento.
- Evolução incremental com testes e gate de qualidade.

## Mapa de documentação

- Fundamentos completos do produto (conteúdo original integral): `docs/FUNDAMENTOS-PRODUTO.md`
- Arquitetura técnica e fases de execução: `docs/PROJETO WEB APP.md`
- Guia técnico de desenvolvimento (setup, comandos, cobertura): `docs/GUIA-DESENVOLVIMENTO.md`
- Compliance de origem de assets e licenças de terceiros: `docs/transparencia/assets-e-licencas.md`
- Política de privacidade (resumo): `docs/transparencia/POLITICA-DE-PRIVACIDADE.md`
- Política de privacidade (completa): `docs/transparencia/POLITICA-DE-PRIVACIDADE-COMPLETA.md`
- Sobre e transparência: `docs/transparencia/SOBRE-E-TRANSPARENCIA.md`
- Termos de uso: `docs/transparencia/TERMOS-DE-USO.md`
- Dados locais e segurança: `docs/transparencia/DADOS-LOCAIS-E-SEGURANCA.md`

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
