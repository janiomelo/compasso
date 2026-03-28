# ADR-001 — Resumo de decisões que exigem esclarecimento técnico

**Status:** Ativo  
**Data:** março de 2026  
**Escopo:** questões do repositório e da implementação

---

## Objetivo

Registrar, em um único lugar, decisões já adotadas no projeto que podem gerar dúvida de implementação e que precisam de orientação explícita para manutenção consistente.

---

## Decisões atuais e pontos de esclarecimento

### 1. Dados locais como padrão de persistência

**Decisão em vigor:** dados de domínio ficam no dispositivo (`IndexedDB` via Dexie), sem backend obrigatório no MVP.

**Esclarecer quando necessário:**
- Quando usar `IndexedDB` vs. `localStorage`.
- Quais dados podem ser descartáveis e quais devem ser persistidos.
- Política de retenção de backups (manual e automático) ao crescer volume de dados.

**Diretriz prática atual:**
- Dados de domínio: `IndexedDB`.
- Metadados de UI/evento simples (timestamp de ação): `localStorage`.

### 2. Sem rede para fluxo crítico

**Decisão em vigor:** funcionalidades centrais não dependem de internet.

**Esclarecer quando necessário:**
- Limite entre melhoria opcional online e dependência indevida de rede.
- Como comunicar indisponibilidade sem bloquear uso local.

**Diretriz prática atual:**
- Se a tela falha sem conexão, ela não está aderente ao MVP atual.

### 3. Português first no domínio e na interface

**Decisão em vigor:** linguagem de produto e domínio em português, preservando termos técnicos consolidados.

**Esclarecer quando necessário:**
- Critério para aceitar termo em inglês no código.
- Casos de nomenclatura mista em APIs de bibliotecas externas.

**Diretriz prática atual:**
- Nome de regra de negócio, rótulo de UI e documentação: português.
- Nome de API externa e termos técnicos consolidados: inglês.

### 4. Gate de qualidade obrigatório

**Decisão em vigor:** mudança funcional só é válida com gate completo (`type-check`, `lint`, `build`, `coverage`).

**Esclarecer quando necessário:**
- Exceções para mudanças exclusivamente textuais.
- Critério mínimo para aceitar cobertura em funcionalidades informativas.

**Diretriz prática atual:**
- Na dúvida, executar o gate completo.

### 5. Fronteira entre página institucional e operacional

**Decisão em vigor:**
- Páginas institucionais: leitura e contexto.
- Páginas operacionais: estado verificável e ações de dados.

**Esclarecer quando necessário:**
- O que caracteriza "informação técnica demais" para página institucional.
- Quando um indicador operacional realmente ajuda o usuário final.

**Diretriz prática atual:**
- Não misturar configuração de aparência com operação de dados e segurança.

---

## Decisões que podem virar ADR próprio (somente com evidência real)

- Estratégia de tema (claro/escuro/automático) se houver mudança arquitetural relevante.
- Critérios de densidade de informação e hierarquia visual entre telas de leitura e operação.
- Exceções de privacidade (qualquer envio externo de dados).
- Introdução de novas dependências com impacto de licença ou segurança.

---

## Regra de manutenção

Novos ADRs só devem ser criados quando houver:
- decisão real já tomada,
- impacto técnico claro no repositório,
- necessidade de rastreabilidade para manutenção futura.

Rascunhos vazios não devem ser mantidos em `docs/decisions/`.
