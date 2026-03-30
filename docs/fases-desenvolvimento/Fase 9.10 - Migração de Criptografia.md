### X.15. Migração de criptografia — regra de consistência do banco

Este ponto define a regra central que governa toda mudança de estado da proteção por senha.

---

#### Regra de produto

> Toda mudança de estado da proteção deve migrar os dados para o formato esperado do novo estado.

| Transição | O que acontece com os dados |
|---|---|
| Desligou proteção | Todos os registros e pausas cifrados são descriptografados para texto plano |
| Ligou proteção | Todos os registros e pausas em texto plano são cifrados com a nova DEK |
| Trocou senha | Dados permanecem como estão; só o envelope da DEK é re-cifrado com a nova chave |

Sem essa regra, o banco fica híbrido: parte dos dados cifrada, parte em texto plano. O comportamento decorrente é imprevisível — registros antigos ficam invisíveis ou inacessíveis após mudança de estado.

---

#### Detalhamento por operação

##### 1. Ativar proteção

Passos em ordem:

1. Validar senha (mínimo 8 caracteres);
2. Derivar KEK da senha via PBKDF2-SHA256 (600k iterações, salt aleatório);
3. Gerar DEK aleatória (AES-256-GCM, 256 bits);
4. Cifrar DEK com KEK;
5. Salvar metadados de proteção no banco (`tabela: protecao`);
6. **Percorrer todos os registros e pausas em texto plano e cifrá-los com a DEK**;
7. Guardar DEK em memória com timeout de sessão;
8. Atualizar estado da aplicação.

O passo 6 garante que o banco fique totalmente cifrado desde o momento de ativação.

##### 2. Desativar proteção

Passos em ordem:

1. Verificar que a DEK está disponível em memória (usuário deve estar desbloqueado);
2. **Percorrer todos os registros e pausas cifrados e descriptografá-los**;
3. Limpar DEK da memória;
4. Apagar metadados de proteção do banco;
5. Atualizar estado da aplicação.

O passo 2 é obrigatório: sem ele, os registros cifrados perdem a chave e ficam inacessíveis para sempre.

**Implicação de UX:** o botão de desativar proteção só deve estar disponível quando o app estiver desbloqueado. Caso contrário, o fluxo deve exigir a senha antes de prosseguir.

##### 3. Trocar senha

Passos em ordem:

1. Desbloquear com a senha atual (valida a senha e carrega a DEK em memória);
2. Exportar a DEK da memória;
3. Derivar nova KEK com nova senha (novo salt aleatório);
4. Cifrar a mesma DEK com a nova KEK;
5. Salvar novos metadados de proteção.

Os dados em si **não são re-cifrados** — a DEK não muda, apenas o envelope que a protege. Isso é correto e seguro: os dados continuam acessíveis com a mesma chave de dados, e a proteção da chave em si é renovada com a nova senha.

---

#### Estrutura de chaves (referência)

```
SENHA (digitada pelo usuário)
  ↓ PBKDF2-SHA256 × 600k iterações, salt 32B
KEK (Key Encryption Key — nunca armazenada)
  ↓ AES-256-GCM
DEK cifrada (armazenada em tabela protecao)

DEK (Data Encryption Key — em memória com timeout)
  ↓ AES-256-GCM
Registros e pausas cifrados (armazenados com envelope _payload)
```

---

#### O que está fora do escopo do MVP

- Re-cifragem com nova DEK ao trocar senha (não é necessário, a DEK não muda);
- Argon2id como alternativa ao PBKDF2 (preparado no código, não ativado);
- Criptografia de configurações (são preferências, não dados do usuário);
- Criptografia de backups locais no IndexedDB (exportação de arquivo já suporta senha).

---

## Implementação

### Etapa 1 — Funções de migração em bd.ts (concluída)

- `migrarParaCifrado(dek)`: lê todos os registros/pausas em texto plano e os cifra com a DEK;
- `migrarParaTextoPlano(dek)`: lê todos os registros/pausas cifrados e os descriptografa;
- ambas operam fora de transação (limitação de Web Crypto + IndexedDB) e salvam o resultado em bulk.

### Etapa 2 — Integração no hook useProtecao (concluída)

- `ativarProtecao`: chama `migrarParaCifrado` após salvar metadados;
- `desativarProtecao`: obtém DEK da sessão, chama `migrarParaTextoPlano` antes de limpar metadados;
- `trocarSenha`: sem alteração — já estava correto (só re-cifra envelope da DEK).

### Etapa 3 — Testes atualizados (concluída)

- `ativarProtecao` verifica chamada a `migrarParaCifrado`;
- `desativarProtecao` verifica chamada a `migrarParaTextoPlano` com a DEK correta;
- novo teste: `desativarProtecao` lança erro quando DEK não está disponível.
