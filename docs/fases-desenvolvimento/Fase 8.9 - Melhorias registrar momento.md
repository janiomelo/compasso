# Compasso — Ajustes no fluxo de Registrar momento

## Objetivo

Deixar o fluxo de registrar momento mais rápido, com menos cliques e menos sensação de wizard longo.

## Mudanças definidas

### 1. Autoavanço nas etapas principais
As etapas abaixo passam a avançar automaticamente após a escolha:

- Forma de uso
- Intenção
- Intensidade

O botão **Voltar** continua sempre disponível.

---

### 2. Forma de uso
Manter as opções atuais:

- Vaporizado
- Fumado
- Comestível
- Outro

Ao tocar em uma opção:
- selecionar;
- avançar automaticamente.

---

### 3. Intenção
Manter as opções atuais:

- Paz
- Foco
- Social
- Relaxar
- Criatividade
- Outro

Mudar o layout para ficar mais compacto.

Direção:
- reduzir altura total da tela;
- evitar lista vertical longa;
- preferir grid ou blocos menores em desktop.

Ao tocar em uma opção:
- selecionar;
- avançar automaticamente.

Mudar o subtexto para algo mais explicativo, como "Escolha a intenção principal deste registro, não o estado em que você estava antes."

---

### 4. Intensidade
Manter as opções atuais:

- Leve
- Média
- Alta

Ao tocar em uma opção:
- selecionar;
- avançar automaticamente.

---

### 5. Observação opcional
A observação continua existindo, mas com menos peso no fluxo.

Regras:
- continua opcional;
- começa fechada por padrão;
- ação visível: **Adicionar observação**;
- ao clicar, o campo expande e recebe foco;
- deve ser possível continuar sem escrever nada.

---

### 6. Conclusão
A tela final continua existindo, mas precisa parecer encerramento real.

Mudar para:
- confirmação curta;
- resumo curto do registro;
- ações finais claras:
  - **Ir para o início**
  - **Registrar outro momento**

A tela final não deve parecer mais uma etapa do wizard.

---

## Plano de implementação

### Passo 1 — Adicionar sinalizador de autoavanço no hook

**Arquivo:** `src/paginas/Registro/useFluxoRegistro.ts`

Novo estado:
```typescript
const [deveAvancarAutomaticamente, setDeveAvancarAutomaticamente] = useState(false)
```

Efeito adicional: quando `deveAvancarAutomaticamente` fica true, disparar `avancar()` e resetar o flag.

Objetivos:
- Etapa 0 (forma de uso): após escolher, setar flag = true
- Etapa 1 (intenção): após escolher, setar flag = true
- Etapa 2 (intensidade): após escolher, setar flag = true
- Etapa 3 (observação): não dispara autoavanço; continua com botão "Próximo"

---

### Passo 2 — Modificar renderização das 3 etapas com autoavanço

**Arquivo:** `src/paginas/Registro/componentes/RegistroEtapaRenderer.tsx`

Para cada etapa (forma de uso, intenção, intensidade):
- ao clicar em uma opção, chamar `atualizar(campo, valor)` como hoje;
- imediatamente após, chamar uma nova função `setDeveAvancarAutomaticamente(true)`;
- manter botão **Voltar** sempre visível e funcional.

Critério de aceitação:
- Clicar em "Vaporizado" → forma de uso fica selecionada → tela avança automaticamente em ~500ms
- Idem para intenção e intensidade
- Botão "Voltar" sempre funciona

---

### Passo 3 — Compactar visualmente a etapa de Intenção

**Arquivo:** `src/paginas/Registro/componentes/RegistroEtapa*.tsx` (etapa 1)

Mudanças:
1. Subtexto: mudar para "Escolha a intenção principal deste registro, não o estado em que você estava antes."
2. Layout: trocar lista vertical por **grid 2 colunas em mobile, 3 colunas em desktop**.
3. Cada botão de intenção: reduzir altura, fonte ligeiramente menor, mas mantendo touchability (min 44px).

Critério:
- Em mobile (375px): 2 colunas, altura total < 300px de conteúdo (sem header/footer)
- Em desktop: 3 colunas
- Todos os 6 itens visíveis sem scroll

---

### Passo 4 — Observação começa fechada, com ação "Adicionar observação"

**Arquivo:** `src/paginas/Registro/componentes/RegistroEtapa*.tsx` (etapa 3 — Observação) e `useFluxoRegistro.ts`

Mudanças:
1. Inicializar `observacaoAberta = false` (não `true`)
2. A etapa começa renderizando apenas:
   - Descrição breve: "Observação (opcional)" ou semelhante
   - Botão/link: "Adicionar observação"
   - Botão "Próximo" (para pular, se quiser)
3. Ao clicar "Adicionar observação":
   - textarea expande;
   - recebe `autoFocus`;
   - botão vira "Fechar" ou "Remover"
4. Campo vazio é permitido, não valida obrigatoriedade

Critério:
- Tela de observação começa compacta (~80px de altura)
- Ao expandir, textarea visível com cursor
- Usuário pode pular direto clicando "Próximo"

---

### Passo 5 — Reformular tela de Conclusão

**Arquivo:** `src/paginas/Registro/componentes/RegistroEtapa*.tsx` (etapa 4 — Conclusão) / `PaginaRegistro.tsx`

Redesenho:
1. Remover "etapa 5 de 5" — não mais parecer wizard
2. Novo layout:
   - Eyebrow em verde/acento: "Registro criado"
   - Título principal: "Seu momento foi registrado"
   - Resumo compacto do que foi registrado (ex: "Vaporizado · Paz · Intensidade Média")
   - Espaço em branco agradável
3. Dois botões CTA ao final:
   - "Ir para o início" (link para `/`) — estilo primário
   - "Registrar outro momento" (chama `registrarOutro()`) — estilo secundário
4. Nenhuma referência a "wizard" ou "próximo"

Critério:
- Sensação de conclusão real, não intermediária
- Usuário entende que o registro foi salvo
- Dois caminhos claros: voltar home ou registrar mais um

---

### Passo 6 — Atualizar/expandir cobertura de testes

**Arquivo:** `__testes__/ui/wizard-registro.teste.tsx`

Novos testes:
1. Selecionar forma de uso → avança automaticamente
2. Selecionar intenção → avança automaticamente
3. Selecionar intensidade → avança automaticamente
4. Observação começa fechada → abrir com "Adicionar observação"
5. Observação vazia é permitida → clicar "Próximo" sem escrever
6. Voltar sempre funciona em qualquer etapa

Manter testes existentes que ainda fazem sentido.

---

## Sequência de esforço (do mais fácil ao mais complexo)

1. ✅ Passo 1: Adicionar flag de autoavanço (lógica + efeito)
2. ✅ Passo 2: Integrar autoavanço na renderização (3 etapas)
3. ✅ Passo 4: Inverter observação (começa fechada)
4. ✅ Passo 3: Refazer grid de intenção (visual)
5. ✅ Passo 5: Redesenhar conclusão
6. ✅ Passo 6: Expandir cobertura de testes

---

## Resultado esperado

O fluxo deve:
- parecer **mais rápido** — 3 cliques de seleção + opcional observação + conclusão (vs. 5 telas de navegar);
- **exigir menos botões** — autoavanço reduz "Próximo" para 1-2 casos (observação, conclusão);
- **continuar claro** — cada etapa ainda é visualmente distinta, não é ambígua;
- **permitir voltar sempre** — botão Voltar nunca Some, em qualquer etapa;
- **terminar com sensação real** — conclusão não parece mais uma etapa, parece célula de "pronto".

---

## Critérios de aceitação globais

- [ ] Em mobile, fluxo de forma de uso → intenção → intensidade →conclusão = ~3 pontos de toque (em vez de 5)
- [ ] Observação começa oculta; expansão não pesa
- [ ] Grid de intenção = 2 cols mobile, 3 cols desktop, sem scroll
- [ ] Conclusão tem estilo distinto (não parece wizard)
- [ ] `npm run type-check && npm run lint && npm run build && npm run coverage` — gate completo verde
- [ ] 170+ testes passando (manter cobertura existente + novos)