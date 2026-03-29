Para o Compasso, eu recomendo este desenho:

## Decisão principal

O Compasso continua:

- **local-first**
- **sem conta obrigatória**
- **sem autenticação remota no MVP**

Mas passa a ter, de forma opcional ou fortemente recomendada:

- **bloqueio local por senha**
- **dados locais criptografados em repouso**
- **arquivo de backup/exportação criptografado por padrão**

Em outras palavras:  
**não login de serviço; sim cofre local do app**.

Isso combina muito mais com a proposta do produto.

---

## O que eu recomendo implementar

### 1. Bloqueio local do app

Não chame de “login”.  
Chame de:

- **Proteção do aplicativo**
- **Bloqueio por senha**
- **Proteger meus dados neste dispositivo**

A lógica é:

- no primeiro uso, a pessoa pode escolher proteger o app com uma senha;
- se ativar, os dados passam a ser criptografados;
- ao abrir o app depois, ela desbloqueia localmente.

Isso deixa claro que:

- não é conta;
- não é cadastro;
- não é autenticação com servidor;
- é proteção local.

### 2. Criptografia dos dados em repouso

Eu recomendo **criptografar os dados antes de salvar no IndexedDB/local storage persistente**.

Modelo ideal:

- gerar uma **chave aleatória de dados** para criptografar o conteúdo;
- proteger essa chave com uma **senha do usuário derivada por KDF forte**;
- guardar no armazenamento local apenas:
    - dados criptografados,
    - salt,
    - parâmetros do KDF,
    - metadados não sensíveis mínimos.

Resumo técnico recomendado:

- **AES-256-GCM** para criptografia dos dados
- **Argon2id** para derivação da senha, se for viável no seu stack web
- fallback aceitável: **PBKDF2** com parâmetros fortes, se você ainda não quiser trazer Argon2 agora

Se você está disposto a implementar direito, eu iria de **Argon2id + AES-GCM**.

### 3. Arquivo exportado criptografado por padrão

Aqui eu seria firme:

- **backup/exportação deve sair criptografado por padrão**
- exportação em texto puro só deveria existir, se existir, como opção avançada e muito explícita

Modelo recomendado:

- exportar um arquivo versionado
- com envelope de metadados
- payload criptografado
- protegido por senha escolhida no momento da exportação
- ou reutilizando a senha do cofre local, se fizer sentido na UX

Minha recomendação prática:

- se o app já estiver protegido por senha, ofereça usar a mesma senha para exportar
- se não estiver, exija uma senha específica para gerar o arquivo

### 4. Chave só em memória durante a sessão

A chave descriptografada não deve ficar persistida.  
Ela deve:

- existir só em memória
- ser descartada ao fechar aba, recarregar ou após bloqueio por inatividade

E eu colocaria:

- **auto-bloqueio por inatividade**
- e opção de “manter desbloqueado só nesta sessão”

---

## O que eu não recomendo no MVP

### Não recomendo

- conta com e-mail e senha
- autenticação remota
- sync em nuvem antes de fechar a segurança local
- PIN curto como única proteção séria
- exportação aberta como padrão
- chamar isso de “login”

### Também não recomendo prometer

- anonimato absoluto
- segurança absoluta
- proteção contra dispositivo comprometido

A criptografia local ajuda muito, mas não vence:

- malware no dispositivo
- navegador comprometido
- sessão aberta/desbloqueada
- senha fraca escolhida pelo usuário

Então a comunicação precisa ser honesta.

---

## Minha recomendação de UX

### Em Configurações

Criaria uma área:  
**Proteção e dados**

Com itens como:

- Proteger aplicativo com senha
- Alterar senha
- Bloquear agora
- Tempo para bloqueio automático
- Exportar backup criptografado
- Importar backup
- Apagar dados locais

### No onboarding

Eu incluiria uma etapa opcional:  
**Quer proteger seus dados neste dispositivo?**

Texto curto:

- seus dados podem ficar criptografados localmente;
- você poderá desbloquear o app com sua senha;
- sem essa senha, não será possível ler os registros salvos.

Botões:

- **Criar proteção agora**
- **Pular por enquanto**

Isso é transparente e não assusta.

---

## Minha recomendação técnica final

Se você quer uma conclusão objetiva, é esta:

### Para a v1 do Compasso

Implemente:

- **cofre local opcional com senha**
- **criptografia em repouso dos dados locais**
- **backup/exportação criptografado por padrão**
- **auto-bloqueio**
- **chave só em memória durante a sessão**

### Algoritmos e desenho

Use:

- **Argon2id** para derivar chave da senha
- **AES-GCM** para criptografar dados
- **DEK/KEK model**:
    - uma chave de dados aleatória para criptografar o conteúdo
    - protegida por uma chave derivada da senha

### Nome do recurso

Evite “login”.  
Use:

- **Proteção local**
- **Bloqueio do aplicativo**
- **Senha de proteção**
- **Cofre local**

---

## O que fica para depois

Depois, se o projeto crescer:

- passkeys/WebAuthn para desbloqueio local
- sincronização em nuvem opcional
- criptografia ponta a ponta entre dispositivos
- recuperação guiada de backup
- múltiplos perfis ou múltiplos cofres

Mas não começaria por aí.

---

## Minha resposta mais direta possível

**Sim: vale implementar criptografia local agora.**  
**Não: eu não criaria login tradicional agora.**  
**Sim: o backup deve ser criptografado por padrão.**  
**Sim: os dados em repouso devem ser criptografados se você quer sustentar a promessa de privacidade com seriedade.**

---

# Plano de Implementação (Fase 8.5)

## Objetivo

Implementar bloqueio local por senha, criptografia de dados em repouso, backup criptografado e auto-bloqueio no Compasso, mantendo a privacidade local absoluta e a UX transparente (sem termos assustadores como "login").

## Arquitetura Geral

A solução segue um modelo **DEK/KEK** (Data Encryption Key / Key Encryption Key):
- Uma chave aleatória (`DEK`) criptografa os dados
- A senha do usuário deriva uma chave (`KEK`) que protege a `DEK`
- Salt e parâmetros do KDF ficam no IndexedDB; `DEK` descriptografada fica em memória na sessão

Estrutura de pasta planejada:
```
src/utilitarios/
  ├── seguranca/
  │   ├── kdf.ts                    # Derivação de chave (Argon2id/PBKDF2)
  │   ├── criptografia.ts           # Cifra AES-256-GCM
  │   ├── gerenciadorChaves.ts      # Gerencia DEK/KEK em memória
  │   └── tipos.ts                  # Tipos de criptografia
  └── armazenamento/
      ├── bd.ts                     # (modificado com tabelas de proteção)
      ├── criptografiaDados.ts      # (novo) operações I/O com cifra
      └── ... (existentes)
src/ganchos/
  └── useProtecao.ts               # (novo) hook de bloqueio e desbloqueio
src/loja/
  └── redutor.ts                   # (modificado com ações de proteção)
src/tipos/
  └── index.ts                     # (modificado com tipos de proteção)
```

## Fases de Implementação (6 etapas)

### **Fase 1: Fundação — Tipos e Primitivos Criptográficos**

**Objetivo**: Criar a base de tipos e funções criptográficas.

**Tarefas**:
1. Adicionar tipos de proteção em `src/tipos/index.ts`: `EstadoProteção`, `ConfiguracaoProteção`, `ChaveSessionProteção`
2. Criar `src/utilitarios/seguranca/tipos.ts` com interfaces de criptografia
3. Implementar `src/utilitarios/seguranca/kdf.ts`: função de derivação com PBKDF2-SHA256 (RECOMENDADO: Argon2id em versão futura)
4. Implementar `src/utilitarios/seguranca/criptografia.ts`: cifrar/descirar com AES-256-GCM nativo (SubtleCrypto)
5. Testes unitários: KDF e cifra isolados

**Dependências**: Nenhuma (usar Web Crypto API nativa do navegador)

**Risco**: Compatibilidade com navegadores antigos (mitigar com fallback ou verificação de feature)

---

### **Fase 2: Estado e Persistência de Proteção**

**Objetivo**: Estender banco de dados e estado da aplicação.

**Tarefas**:
1. Estender schema Dexie em `src/utilitarios/armazenamento/bd.ts`:
   - Tabela `protecao`: armazena `salt`, `params_kdf`, metadados (sem a `DEK` descriptografada)
   - Versionar banco de dados (v3 ou próxima versão)
2. Estender `src/tipos/index.ts`:
   - `Configuracoes` adiciona: `protecaoAtiva: boolean`, `timeoutBloqueio: number`
   - `EstadoApp` adiciona: `protecao?: EstadoProteção`
3. Modificar `src/loja/redutor.ts` com ações: `ATIVAR_PROTECAO`, `DESATIVAR_PROTECAO`, `BLOQUEAR_APP`, `DESBLOQUEAR_APP`
4. Testes de integração: persistência de metadados de proteção

**Dependências**: Fase 1

**Risco**: Migração de dados para usuários já com banco — exigir confirmação ou fazer migração automática com bom teste

---

### **Fase 3: Gerenciador de Sessão e Chaves em Memória**

**Objetivo**: Gerenciar DEK em memória de forma segura.

**Tarefas**:
1. Implementar `src/utilitarios/seguranca/gerenciadorChaves.ts`:
   - Guardar `DEK` descriptografada em memória (privado, não-persistido)
   - Método `guardarDEK(dek)` → armazena temporariamente
   - Método `obterDEK()` → retorna ou lança erro se bloqueado
   - Método `limparDEK()` → apaga da memória
   - Auto-limpeza com timer configurável
2. Criar `src/ganchos/useProtecao.ts`:
   - `desbloquear(senha: string)` → deriva KEK, descriptografa DEK, chama gerenciador
   - `bloquear()` → limpa DEK, atualiza estado para bloqueado
   - `trocarSenha(senhaAtual, senhaNova)` → re-deriva nova KEK, re-cifra
3. Testes: bloqueio/desbloqueio, timeout automático, limpeza de memória

**Dependências**: Fase 1, Fase 2

**Risco**: Vazamento de chave em memória (mitigar com segredos "zeroáveis" se viável)

---

### **Fase 4: Criptografia de Dados em Repouso**

**Objetivo**: Cifrar dados ao salvar no IndexedDB.

**Tarefas**:
1. Modificar `src/utilitarios/armazenamento/bd.ts`:
   - Ao salvar registro/pausa/config: se `protecaoAtiva`, cifrar antes de inserir no IndexedDB
   - Campo novo: `criptografado: boolean` em cada tabela
2. Criar `src/utilitarios/armazenamento/criptografiaDados.ts`:
   - `cifrarRegistro(registro)` → retorna `RegistroCriptografado`
   - `descritar(registroCriptografado, dek)` → retorna `Registro`
   - Mesmo para pausas e configurações
3. Modificar `consultasBD`:
   - `obterRegistros()` → se proteção ativa, descrifra cada um ao retornar
   - `salvarRegistro()` → cifra antes de salvar
4. Testes de integração: cifra/decifra em ciclo completo

**Dependências**: Fase 1, Fase 2, Fase 3

**Risco**: Performance com grandes volumes (muitos registros) — benchmarking necessário

---

### **Fase 5: Backup/Exportação Criptografado**

**Objetivo**: Exportar dados criptografados por padrão.

**Tarefas**:
1. Modificar `src/servicos/servicoDados.ts`:
   - `exportarDados()` → if `protecaoAtiva`, cifrar payload antes de gzippar
   - Nova opção de porta: `opcoes.senhaBkp?: string` (ou reutilizar senha do app)
2. Modificar `importarDados()`:
   - Detectar se arquivo é criptografado (magic number ou estrutura)
   - Solicitar senha se necessário
   - Descritar, validar schema, importar
3. Atualizar interface `src/ganchos/useArmazenamento.ts`:
   - Novo parâmetro em `exportarDados`: `opcoes.criptografado: boolean`
   - Novo parâmetro em `importarDados`: `opcoes.senha?: string`
4. Testes: exportar criptografado, importar com/sem senha

**Dependências**: Fase 1, Fase 2, Fase 4

**Risco**: UX confusa se exportação ficar criptografada por padrão — comunicação clara necessária

---

### **Fase 6: UI — Onboarding + Configurações**

**Objetivo**: Implementar interface para proteção.

**Tarefas**:
1. Etapa nova no onboarding (etapa 3 de 4 ou 5):
   - Título: "Proteger seus dados?"
   - Texto: "Seus dados podem ficar criptografados. Você desbloqueia com sua senha."
   - Botões: "Criar proteção" → form de senha / "Pular por enquanto" → próxima etapa
   - Componente: `EtapaProtecao.tsx` em `src/paginas/Onboarding/` (ou onde está o onboarding)

2. Seção nova em `src/paginas/Config/PaginaConfig.tsx`:
   - Subsection "Proteção e dados"
   - Itens:
     - [ ] Proteger aplicativo (toggle + senha se desativar)
     - [ ] Alterar senha
     - [ ] Bloquear agora (botão)
     - [ ] Timeout de bloqueio (dropdown: 5min, 15min, 30min, 1h, "manter desbloqueado")
     - [ ] Opção "manter desbloqueado só nesta sessão" (info)
     - [ ] Exportar backup criptografado (checkbox; padrão = sim)
     - [ ] Importar backup
     - [ ] Apagar dados locais

3. Modal de desbloqueio:
   - Solicitar senha
   - Status de inatividade ("Seu app foi bloqueado por inatividade")
   - Mostrar timeout restante

4. Modificar `src/App.tsx`:
   - Se `protecaoAtiva && !desbloqueado`, redirecionar para tela de bloqueio (overlay)
   - Bloquear após inatividade (listener de eventos)

5. Testes UI: fluxo de proteção, bloqueio, desbloqueio, timeout

**Dependências**: Fase 3, Fase 4, Fase 5

---

## Sequência Linearizada (11 passos)

1. ✅ Adicionar tipos de proteção em `src/tipos/index.ts`
2. ✅ Implementar `src/utilitarios/seguranca/kdf.ts` com derivação de chave (PBKDF2-SHA256 com 100k iterações mínimo)
3. ✅ Implementar `src/utilitarios/seguranca/criptografia.ts` com AES-256-GCM via SubtleCrypto nativa
4. ✅ Estender schema Dexie com tabela `protecao` em `src/utilitarios/armazenamento/bd.ts`
5. ✅ Implementar `src/utilitarios/seguranca/gerenciadorChaves.ts` para guardar DEK em memória
6. ✅ Criar hook `src/ganchos/useProtecao.ts` com `desbloquear()`, `bloquear()`, `trocarSenha()`
7. ✅ Modificar serviços de persistência para cifrar/descritar dados (Fase 4)
8. ✅ Atualizar `exportarDados()` e `importarDados()` para suportar criptografia (Fase 5)
9. ✅ Implementar UI: etapa no onboarding + seção em Configurações (Fase 6)
10. ✅ Integrar bloqueio automático em `src/App.tsx`
11. ✅ Testes: unitários de criptografia, integração de ciclo completo, testes de UI

---

## Status: 🚀 INICIANDO IMPLEMENTAÇÃO

Começando pela **Fase 1** (Fundação — Tipos e Primitivos Criptográficos).