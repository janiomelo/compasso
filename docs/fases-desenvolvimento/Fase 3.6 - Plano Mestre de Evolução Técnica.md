# Plano Mestre de Evolução Técnica - Compasso
Data: 21/03/2026
Status: Aprovado para execução incremental

## 1. Objetivo
Consolidar diagnóstico técnico, reduzir anti-padrões sem refatoração total e estabelecer guardrails para crescimento sustentável do app.

## 2. Contexto Atual
- Stack: React 18, TypeScript 5, Vite 4, React Router v6, Sass Modules, Dexie/IndexedDB, Vitest + RTL.
- O projeto está funcional com `dev` e `build` estáveis.
- Houve redesign recente com correções de conformidade visual já aplicadas.
- Foco atual: impedir crescimento de dívida técnica ao evoluir novas features.

## 3. Diagnóstico Consolidado (Causa-Raiz)
### P0 - Crítico
1. Contratos com typos estruturais propagados no domínio.
- Exemplos: `duracaoPlanjada`, `historioPausa`.
- Impacto: semântica inconsistente, maior risco de regressão e refactor futuro caro.

2. Estado global com campos e ações sem uso real.
- Exemplos: `paginaAtual`, `barraAberta`, `LISTAR_REGISTROS`, `ALTERNAR_TEMA`, `MOSTRAR_AVISO`, `ESCONDER_AVISO`.
- Impacto: complexidade acidental e ruído arquitetural.

### P1 - Alto
1. Repetição de lógica de apresentação.
- Funções e mapas de rótulo/intensidade/tendência duplicados em páginas.
- Impacto: divergência visual/comportamental silenciosa.

2. Componentes de página com responsabilidades excessivas.
- Especialmente `PaginaRegistro` e `PaginaPrincipal`.
- Impacto: baixa testabilidade e manutenção cara.

3. Primitives visuais repetidas em SCSS modules.
- Padrões de topo, títulos, botões, superfícies e blocos aparecem duplicados.
- Impacto: drift visual e retrabalho em ajustes de design.

### P2 - Médio
1. Cobertura de testes desalinhada com complexidade da UI.
- Há testes de fluxo de hooks/contexto, mas pouca cobertura de UI comportamental.
- Impacto: regressões de experiência passam sem alerta.

2. APIs expostas sem uso atual.
- Exemplo: `backup` em `useRegistro` sem consumo de interface.
- Impacto: superfície de API inflada.

## 4. Princípios de Execução
1. Não fazer refatoração ampla de uma vez.
2. Entregas pequenas, independentes e reversíveis.
3. Priorizar alto impacto com baixo risco.
4. Todo ajuste com validação objetiva por build/testes.
5. Manter padrão “portugues first” em interfaces públicas e documentação.

## 5. Plano de Execução Incremental
## Pacote A - Normalização de Contratos (P0)
- Criar nomes corretos canônicos (`duracaoPlanejada`, `historicoPausa`).
- Adicionar camada de compatibilidade temporária para leitura de dados legados.
- Migrar usos internos gradualmente.
- Critério de saída:
  - Nenhum novo uso dos nomes legados.
  - Persistência segue funcionando com dados existentes.

## Pacote B - Saneamento do Store (P0/P1)
- Remover ou reativar de forma explícita campos/ações mortos.
- Se remover, limpar tipos, reducer e referências.
- Critério de saída:
  - Nenhum campo/ação sem uso no estado global.

## Pacote C - Camada Compartilhada de Apresentação (P1)
- Extrair helpers de rotulagem para utilitário central.
- Criar primitives SCSS reutilizáveis para cabeçalho de página, botões e superfícies.
- Critério de saída:
  - Queda visível de duplicação nas páginas sem mudança de identidade visual.

## Pacote D - Fatiamento de Componentes (P1)
- Separar `PaginaRegistro` por etapa e fluxo.
- Separar blocos de `PaginaPrincipal` em subcomponentes.
- Critério de saída:
  - Componentes menores, focados e testáveis isoladamente.

## Pacote E - Ampliação de Testes de UI (P2)
- Cobrir comportamento do wizard de registro.
- Cobrir estados da página principal (com e sem pausa ativa).
- Cobrir renderização crítica de ritmo.
- Critério de saída:
  - Matriz mínima de regressão comportamental ativa.

## 6. Guardrails Permanentes
1. Contratos de domínio:
- Nome canônico em português, sem abreviação ambígua.
- Proibir criação de novos aliases legados após pacote A.

2. Estado global:
- Qualquer novo campo exige “uso atual” e teste correspondente.
- Campo sem uso por 1 ciclo de release deve ser removido ou formalmente justificado.

3. UI e estilos:
- Nova primitive visual reaproveitável nasce na camada compartilhada.
- Páginas não devem redefinir padrões base já existentes.

4. Componentização:
- Página não deve concentrar fluxo + mapeamento + submissão + renderização complexa sem extração.
- Limite prático de responsabilidade por componente com revisão em PR.

5. Testes:
- Toda alteração de fluxo de UI deve incluir teste comportamental.
- Toda alteração de contrato deve incluir teste de compatibilidade/migração.

## 7. Métricas de Sucesso
1. Redução de duplicação em estilos e helpers de apresentação.
2. Redução de campos/ações mortos no estado global.
3. Aumento de cobertura de testes de comportamento de UI crítica.
4. Menor tempo para alterar telas sem regressões.
5. Consistência de nomenclatura de domínio em todo o código.

## 8. Riscos e Mitigações
1. Risco: quebrar compatibilidade de dados locais ao renomear contratos.
- Mitigação: camada de compatibilidade e testes de hidratação/migração.

2. Risco: refactor de componentes gerar regressão visual.
- Mitigação: entregas pequenas por página com validação manual e testes.

3. Risco: mudanças amplas de estilo alterarem identidade visual.
- Mitigação: extrair primitives preservando tokens já acordados.

## 9. Ordem Recomendada de PRs
1. PR1: Pacote A (contratos + compatibilidade).
2. PR2: Pacote B (store enxuto).
3. PR3: Pacote C (helpers + primitives SCSS).
4. PR4: Pacote D (fatiamento registro e principal).
5. PR5: Pacote E (testes UI).

## 10. Definição de Pronto (DoD)
1. Build sem erros.
2. Testes existentes e novos passando.
3. Sem introdução de novo estado morto.
4. Sem nova duplicação de primitive visual.
5. Sem novos typos em contratos de domínio.