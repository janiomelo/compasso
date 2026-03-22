No Compasso, onboarding não deve ser só:

- boas-vindas;
- tour;
- pedir aceite.

Ele precisa fazer quatro coisas ao mesmo tempo:

1. **explicar o que o produto é**
2. **explicar o que o produto não é**
3. **confirmar condições mínimas de uso**
4. **criar confiança sobre dados e privacidade**

## Minha visão geral

Eu faria um onboarding **curto, sério e verificável**, sem ficar parecendo:

- burocracia jurídica;
- mural de avisos;
- formulário moralista;
- parede de texto.

A lógica ideal é:

- poucas telas;
- uma decisão por tela;
- linguagem muito clara;
- textos curtos;
- links para ler mais.

---

# O que o onboarding precisa confirmar

## 1. Desejo de uso

Você falou “confirmar o desejo de uso”, e isso é importante.

Eu traduziria isso como:  
**confirmar que a pessoa entendeu a proposta e quer usar o produto nesse contexto.**

Não faria uma pergunta estranha tipo “você deseja usar?”.  
Faria algo mais natural:

- “O Compasso é um espaço pessoal para acompanhar ritmo, pausas e equilíbrio.”
- botão: **Quero começar**
- link secundário: **Entender melhor o projeto**

Isso já funciona como consentimento de entrada no fluxo, sem teatralizar.

---

## 2. Idade

Aqui eu seria direto e sem excesso.

Como você quer discutir isso com cuidado, eu faria uma tela curta:

### Texto

**Uso restrito a pessoas maiores de 18 anos.**

O Compasso não foi criado para crianças ou adolescentes.

### Ação

- checkbox ou confirmação:
    - **Confirmo que tenho 18 anos ou mais**

Sem pedir data de nascimento no MVP, a não ser que você tenha uma razão muito forte.

Porque:

- pedir data completa aumenta atrito;
- coleta mais dado do que o necessário;
- e não te dá verificação real mesmo.

Então, para MVP:  
**autodeclaração de maioridade**.

---

## 3. Aceite dos termos e da política

Aqui eu faria de forma clara e separada.

Não gosto de jogar tudo num checkbox só, porque fica opaco.

### Melhor modelo

Uma tela com:

- resumo curto;
- link para **Política de Privacidade**
- link para **Termos de Uso**

E uma ação como:

- **Li e aceito os Termos de Uso e a Política de Privacidade**

Se quiser mais rigor, pode usar dois checkboxes.  
Mas, para UX, um único aceite com links muito visíveis costuma bastar melhor no começo.

---

## 4. Explicação de uso

Essa parte é muito importante no Compasso.

Você precisa explicar logo no onboarding:

- que os dados ficam no dispositivo;
- que o app não é clínico;
- que ele serve para registro pessoal;
- que a pessoa pode apagar/exportar depois.

Mas eu não colocaria tudo em uma tela gigante.

---

# Minha proposta de fluxo de onboarding

Eu faria **5 telas curtas**.

## Tela 1 — Boas-vindas / proposta

### Objetivo

Apresentar o produto.

### Conteúdo

**Compasso**  
Acompanhe ritmo, pausas e equilíbrio com clareza.

Texto curto:  
Ferramenta pessoal, privada por padrão, para registrar momentos, acompanhar pausas e observar seu ritmo recente.

Ações:

- **Começar**
- **Saiba mais**

---

## Tela 2 — O que o Compasso é e não é

### Objetivo

Limitar expectativa e proteger o tom do produto.

### Conteúdo

**Antes de continuar**

O Compasso:

- ajuda no registro pessoal e na observação de hábitos;
- não é ferramenta clínica ou terapêutica;
- não substitui orientação profissional;
- não faz intermediação de compra ou venda.

Ação:

- **Entendi e quero continuar**

---

## Tela 3 — Privacidade por padrão

### Objetivo

Criar confiança.

### Conteúdo

**Seus dados ficam com você**

Na fase atual do projeto:

- seus registros ficam neste dispositivo;
- o uso não depende de conta obrigatória;
- você poderá exportar, importar ou apagar seus dados.

Ações:

- **Continuar**
- link: **Ler política de privacidade**

---

## Tela 4 — Maioridade

### Objetivo

Confirmar condição mínima de uso.

### Conteúdo

**Uso para maiores de 18 anos**

O Compasso não foi criado para crianças ou adolescentes.

Ação:

- checkbox: **Confirmo que tenho 18 anos ou mais**
- botão: **Continuar**

Botão só habilita com confirmação.

---

## Tela 5 — Aceite final

### Objetivo

Registrar aceite e concluir.

### Conteúdo

**Aceite e início**

Para usar o Compasso, você precisa concordar com:

- Termos de Uso
- Política de Privacidade

Ação:

- checkbox: **Li e aceito os Termos de Uso e a Política de Privacidade**
- botão: **Entrar no Compasso**

Links:

- **Termos de Uso**
- **Política de Privacidade**

---

# O que eu não faria

Eu evitaria:

- pedir nome, e-mail ou data de nascimento no onboarding;
- encher de slides motivacionais;
- usar linguagem de “risco”, “dependência”, “recuperação” ou “recaída”;
- esconder termos em link minúsculo;
- transformar onboarding em muro jurídico;
- colocar tutorial de interface antes de confiança e consentimento.

---

# O que pode entrar depois

Depois, talvez no primeiro uso pós-onboarding, você pode ter uma tela curtíssima opcional:

## Configuração inicial opcional

- tema: seguir sistema / claro / escuro
- intensidade do uso do app: simples / depois
- botão: **Ir para a home**

Mas eu não misturaria isso com consentimento.

---

# Minha recomendação de localização no produto

Eu faria assim:

- onboarding aparece **só no primeiro acesso**
- aceite fica salvo localmente
- em **Configurações → Privacidade e transparência**, mostrar:
    - data do aceite local
    - links para reler Termos e Política
    - opção de revisar onboarding/resumo do produto

Isso é muito bom para confiança.

---

# Minha conclusão sincera

O onboarding do Compasso deve ser menos “tour do app” e mais:  
**alinhamento de expectativa + confiança + consentimento mínimo.**

A ordem certa, para mim, é:

1. o que é
2. o que não é
3. como trata dados
4. maioridade
5. aceite