## Fase 8.11 — Sitemap e páginas públicas de conteúdo

### Objetivo

Melhorar descoberta orgânica e clareza institucional com:

- rotas públicas diretas (`/privacidade`, `/como-funciona`, `/projeto`);
- `sitemap.xml` com URLs indexáveis;
- conteúdo textual com manutenção simples;
- uma única fonte da verdade para textos públicos.

### Contexto atual

- O app principal está protegido por onboarding e rotas privadas em `App.tsx`.
- Páginas institucionais existem, mas sob `/config/*` e com conteúdo distribuído em componentes TSX.
- Documentos públicos de transparência estão em `docs/transparencia/`.

### Decisão de arquitetura (fonte única da verdade)

Adotar conteúdo em Markdown como fonte única para páginas públicas.

Proposta:

1. Criar `src/conteudo-publico/` com arquivos Markdown canônicos.
2. Renderizar esses arquivos nas páginas públicas com um renderizador textual simples.
3. Eliminar duplicação de texto hardcoded em componentes TSX.

Observação de governança:

- Se a equipe optar por remover `docs/transparencia/`, alinhar antes com o princípio de documentação pública do repositório.
- Caso necessário, registrar decisão em ADR por impacto em estratégia de documentação pública.

### Escopo funcional

#### Rotas públicas novas

- `/privacidade`
- `/como-funciona`
- `/projeto`

Opcional de compatibilidade:

- manter `/sobre` redirecionando para `/projeto`.

#### Rota inicial

- Manter `/` com comportamento atual do app.
- Melhoria de copy da primeira experiência já coberta na fase anterior.

#### Sitemap

Criar `public/sitemap.xml` com URLs públicas:

- `/`
- `/privacidade`
- `/como-funciona`
- `/projeto`

Complemento recomendado:

- criar/atualizar `public/robots.txt` apontando para o sitemap.

### Estrutura técnica proposta

#### Conteúdo

Nova pasta:

- `src/conteudo-publico/privacidade.md`
- `src/conteudo-publico/como-funciona.md`
- `src/conteudo-publico/projeto.md`

Mapeamento inicial sugerido a partir dos materiais atuais:

- `docs/transparencia/POLITICA-DE-PRIVACIDADE.md` → `privacidade.md`
- `docs/transparencia/DADOS-LOCAIS-E-SEGURANCA.md` + resumo do produto → `como-funciona.md`
- `docs/transparencia/SOBRE-E-TRANSPARENCIA.md` → `projeto.md`

#### Renderização textual simples

Criar componente reutilizável minimalista, por exemplo:

- `src/componentes/comum/PaginaTextoPublico.tsx`
- `src/componentes/comum/pagina-texto-publico.module.scss`

Diretrizes do componente:

- foco em leitura (`h1`, `h2`, `p`, `ul`, `li`);
- sem blocos decorativos extras;
- sem cards e sem densidade visual desnecessária;
- mobile-first e acessível.

#### Roteamento

Em `App.tsx`:

- declarar páginas públicas fora do gate de onboarding;
- manter páginas privadas com proteção atual;
- criar redirecionamentos para preservar links existentes de `/config/*` quando fizer sentido.

### Plano de execução por entregas

#### Entrega 1 — Base de conteúdo canônico

1. Definir os 3 arquivos Markdown canônicos em `src/conteudo-publico/`.
2. Migrar conteúdo essencial dos documentos atuais.
3. Revisar texto para português claro, sem tom clínico e sem jargão.

Critérios de aceite:

- 3 arquivos criados com conteúdo completo e legível.
- Sem duplicação do mesmo texto em TSX.

#### Entrega 2 — Páginas públicas minimalistas

1. Criar componente de renderização textual.
2. Criar páginas públicas e ligar às novas rotas.
3. Garantir navegação básica (voltar para home/app quando aplicável).

Critérios de aceite:

- `/privacidade`, `/como-funciona` e `/projeto` renderizam conteúdo textual.
- Layout limpo e consistente em 375px e desktop.

#### Entrega 3 — Sitemap e indexação

1. Criar `public/sitemap.xml`.
2. Atualizar `public/robots.txt` com referência ao sitemap.
3. Revisar links internos que apontavam para GitHub e trocar para rotas públicas quando apropriado.

Critérios de aceite:

- Sitemap acessível e com rotas corretas.
- Robôs conseguem descobrir URLs públicas.

#### Entrega 4 — Limpeza e fonte única

1. Remover conteúdo duplicado dos componentes antigos.
2. Definir destino final de `docs/transparencia/`:
	- opção A: manter docs como espelho gerado;
	- opção B: remover docs e manter apenas conteúdo canônico em `src/conteudo-publico/`.
3. Atualizar links residuais e documentação de manutenção.

Critérios de aceite:

- Uma única fonte de verdade definida e aplicada.
- Nenhum link quebrado para conteúdo institucional.

### Arquivos impactados (previsão)

- `src/App.tsx`
- `src/paginas/index.ts`
- `src/componentes/comum/PaginaTextoPublico.tsx` (novo)
- `src/componentes/comum/pagina-texto-publico.module.scss` (novo)
- `src/paginas/Privacidade/PaginaPrivacidade.tsx` (novo)
- `src/paginas/ComoFunciona/PaginaComoFunciona.tsx` (novo)
- `src/paginas/Projeto/PaginaProjeto.tsx` (novo)
- `src/conteudo-publico/*.md` (novos)
- `public/sitemap.xml` (novo)
- `public/robots.txt` (criar/atualizar)

### Testes e validação

Testes a adicionar/atualizar:

- renderização das rotas públicas;
- redirecionamentos de compatibilidade (`/sobre` → `/projeto`, se adotado);
- links principais de navegação institucional;
- ausência de bloqueio por onboarding nas rotas públicas.

Gate final:

- `npm run type-check`
- `npm run lint`
- `npm run build`
- `npm run coverage`

### Riscos e mitigação

| Risco | Mitigação |
|---|---|
| Quebra de links antigos de `/config/*` | Adicionar redirecionamentos temporários e revisar links internos |
| Regressão na proteção do app principal | Manter gate atual apenas para rotas operacionais |
| Divergência entre docs e páginas | Definir e documentar fonte única antes da migração final |
| Conteúdo excessivo nas páginas públicas | Priorizar versão resumida com leitura direta e sem excesso visual |

### Definição de pronto

A fase estará pronta quando:

- existir sitemap funcional;
- as três rotas públicas estiverem publicadas e indexáveis;
- o conteúdo institucional estiver centralizado em uma única fonte;
- não houver regressões no fluxo principal do app.