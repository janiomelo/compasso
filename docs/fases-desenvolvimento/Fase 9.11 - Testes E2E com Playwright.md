# Fase 9.11 - Testes E2E com Playwright

> Status: Em andamento
> Responsável: Equipe de desenvolvimento
> Contexto: aproximar validação automatizada do comportamento real em navegador, com foco em reprodução de erro de produção.

---

## 1. Objetivo

Implantar uma suíte inicial de testes end-to-end com Playwright, executada no Chromium, priorizando o cenário mais crítico de jornada real do usuário e executando contra build de produção local.

Meta principal desta fase:
- aumentar fidelidade dos testes em relação ao uso real no navegador;
- reduzir diferença entre ambiente de teste e ambiente de produção;
- facilitar reprodução e diagnóstico de falhas que não aparecem em testes de integração com DOM simulado.

---

## 2. Escopo da fase

Incluído nesta fase:
- configuração inicial do Playwright no repositório;
- execução em Chromium;
- execução contra aplicação servida em modo de produção local;
- implementação do primeiro fluxo e2e priorizado;
- coleta de artefatos de falha (trace, screenshot e vídeo quando aplicável).

Fora de escopo nesta fase:
- cobertura completa de todas as páginas;
- matriz multi-browser completa;
- execução em dispositivos móveis reais;
- testes de carga/performance.

---

## 3. Primeiro teste da fase (E2E-01)

Nome sugerido:
- Fluxo protegido com onboarding, senha e persistência após retorno ao app.

Sequência validada:
1. Concluir onboarding.
2. Registrar um primeiro momento.
3. Cadastrar senha de proteção.
4. Registrar um segundo momento.
5. Simular saída e retorno ao app.
6. Desbloquear com a senha.
7. Ver os dois momentos após desbloqueio.

Resultado esperado:
- a proteção exige senha no retorno ao app;
- o desbloqueio com senha correta libera acesso;
- os dois momentos ficam acessíveis após desbloqueio;
- não ocorre regressão visual/funcional no fluxo principal.

---

## 4. Estratégia de execução (mais próxima do real)

Diretriz desta fase:
- rodar e2e contra build de produção local, não contra servidor de desenvolvimento.

Motivo:
- aproximar comportamento de roteamento, assets e inicialização ao que acontece em produção;
- aumentar chance de reproduzir erros intermitentes ou específicos de build final.

---

## 5. Critérios de aceite

A fase 9.11 será considerada concluída quando:
- Playwright estiver configurado e executando no Chromium;
- o teste E2E-01 existir e cobrir toda a jornada descrita;
- o fluxo e2e rodar localmente com comando único;
- falhas gerarem artefatos de depuração reutilizáveis;
- documentação da fase permanecer atualizada com o estado real da implementação.

---

## 6. Riscos e mitigação

Risco: instabilidade por esperas frágeis de interface.
Mitigação: priorizar seletores semânticos e esperas por estado observável.

Risco: divergência entre ambiente local e produção.
Mitigação: executar o e2e sobre build de produção local como padrão da fase.

Risco: manutenção alta de testes de fluxo longo.
Mitigação: extrair helpers de jornada e manter passos explícitos e legíveis.

---

## 7. Entregáveis

- Arquivos de configuração do Playwright.
- Primeiro teste e2e do fluxo E2E-01.
- Scripts de execução e2e no projeto.
- Artefatos de falha habilitados para diagnóstico.
- Este documento como referência da fase.

---

## 8. Próximos testes após E2E-01

Backlog sugerido para sequência:
1. senha incorreta e mensagens de erro no desbloqueio;
2. bloqueio automático por inatividade;
3. importação/exportação com proteção ativa;
4. fluxo de pausa com retorno de sessão;
5. smoke de rotas públicas e páginas institucionais.

---

## 9. Atualização de execução

Implementação já realizada nesta fase:
- Playwright instalado no projeto;
- configuração criada para execução em Chromium contra build de produção local;
- scripts npm adicionados para execução e2e;
- teste E2E-01 implementado.

Resultado da primeira execução do E2E-01:
- o fluxo chega ao desbloqueio com senha corretamente;
- após desbloquear e retornar para a home, o bloco de "Registros recentes" não aparece;
- comportamento observado no navegador real é compatível com erro percebido em produção.

Comando de reprodução usado:
- npm run test:e2e -- __testes__/e2e/protecao-registro.fluxo.e2e.spec.ts
