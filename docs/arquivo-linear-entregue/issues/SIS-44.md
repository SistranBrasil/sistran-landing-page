# SIS-44 — Soluções de Negócios: o convite ao scroll não está visível

- **Data da exportação:** 2026-09-15T20:51:00.000Z
- **Modo:** somente leitura (`get_issue` + `list_comments`); nada foi alterado no Linear
- **Origem Linear:** https://linear.app/sistran-labs/issue/SIS-44/solucoes-de-negocios-o-convite-ao-scroll-nao-esta-visivel
- **get_issue:** includeRelations=true, includeCustomerNeeds=true, includeReleases=true
- **list_comments:** limit=250, orderBy=createdAt

## Metadados

```json
{
  "id": "SIS-44",
  "uuid": "246f0a68-5e85-4355-80f0-d7835fa5e9b3",
  "title": "Soluções de Negócios: o convite ao scroll não está visível",
  "priority": {
    "value": 0,
    "name": "No priority"
  },
  "url": "https://linear.app/sistran-labs/issue/SIS-44/solucoes-de-negocios-o-convite-ao-scroll-nao-esta-visivel",
  "gitBranchName": "meduardamcp/sis-44-solucoes-de-negocios-o-convite-ao-scroll-nao-esta-visivel",
  "createdAt": "2026-08-26T19:36:05.164Z",
  "updatedAt": "2026-09-15T20:33:40.562Z",
  "archivedAt": null,
  "completedAt": null,
  "startedAt": "2026-09-15T20:33:40.463Z",
  "canceledAt": null,
  "dueDate": null,
  "slaStartedAt": null,
  "slaMediumRiskAt": null,
  "slaHighRiskAt": null,
  "slaBreachesAt": null,
  "status": "Entregue",
  "statusType": "started",
  "labels": [],
  "createdBy": "Maria Eduarda M Camargo",
  "createdById": "d540a312-a721-479d-9da4-3b86ed7868ba",
  "assignee": "Maria Eduarda M Camargo",
  "assigneeId": "d540a312-a721-479d-9da4-3b86ed7868ba",
  "project": "Sistran-Landing-Page",
  "projectId": "4c40ea35-ea44-4a62-9b55-02448016c890",
  "team": "Sistran Labs",
  "teamId": "b98f204c-dea3-41e6-99c3-c0347bfb0454",
  "attachments": [],
  "documents": [],
  "stateHistory": [
    {
      "state": {
        "id": "bc5681b9-61b8-47a5-b698-88ac72996d2e",
        "name": "Backlog",
        "type": "backlog"
      },
      "startedAt": "2026-08-26T19:36:05.164Z",
      "endedAt": "2026-08-26T19:52:45.073Z"
    },
    {
      "state": {
        "id": "95119256-352d-4f0c-b5ae-695c7d838974",
        "name": "Done",
        "type": "completed"
      },
      "startedAt": "2026-08-26T19:52:45.073Z",
      "endedAt": "2026-09-15T20:33:40.503Z"
    },
    {
      "state": {
        "id": "dbb9dfbe-2cc4-423a-862f-94ca7705f813",
        "name": "Entregue",
        "type": "started"
      },
      "startedAt": "2026-09-15T20:33:40.503Z",
      "endedAt": null
    }
  ]
}
```

## Descrição original

O convite ao scroll entregue em <issue id="89cb67ec-7a12-4da9-b322-a3e3cfd38786" href="https://linear.app/sistran-labs/issue/SIS-41/solucoes-de-negocios-linha-de-processo-mais-baixa-e-um-convite-ao">SIS-41</issue> não aparece na tela.

## Causas prováveis (a confirmar)

1. **Posição**: está no fim da `.solutions-caixa`, abaixo do `.solutions-layout`, que é alto (foto de até 620px + cartão). No palco preso, esse pé pode cair fora da viewport.
2. **Opacidade**: `opacity: clamp(0, calc(1 - var(--sol-p) * 8), 1)` — o convite se apaga com 12% do percurso. Se `--sol-p` já não é 0 quando a seção entra (o trigger vai de `top top` a `bottom bottom`, e o pin engata com a seção já no topo), ele nasce apagado.
3. **Contraste**: texto em `rgba(226, 245, 255, 0.62)` sobre o degradê do palco pode simplesmente não se ler.

## O que fazer

Descobrir qual é (inspecionar o valor computado de `--sol-p` e o retângulo do elemento) e corrigir para que o convite apareça quando a seção entra e se apague ao rolar. Onde ele deve ficar é decisão a tomar na correção — provavelmente ancorado ao pé da área visível do palco, não ao fim da caixa.

## Restrições

Continua sem estado novo e sem listener novo: a opacidade deve seguir vindo de `--sol-p`. Decorativo e `aria-hidden`.

## Validação

Entrar na seção rolando de cima: o convite precisa estar legível; ao rolar, precisa desaparecer. Conferir também na volta (rolando para cima) que ele reaparece sem piscar.

## Relações / Anexos / Releases / Customer needs

### Relações

```json
{
  "blocks": [],
  "blockedBy": [],
  "relatedTo": [
    {
      "id": "SIS-41",
      "title": "Soluções de Negócios: linha de processo mais baixa e um convite ao scroll no palco"
    }
  ],
  "duplicateOf": null
}
```

### Anexos da issue

Nenhum (`attachments: []`).

### Documents

Nenhum (`documents: []`).

### Releases

Nenhum (`releases: []`).

### Customer needs

Nenhum (`customerNeeds: []`).

## Comentários (ordem cronológica por `createdAt`)

`list_comments`: `limit` 250, `orderBy` createdAt, `hasNextPage` false. Total: 1. Ordenados aqui por `createdAt` crescente (a API devolveu o mais novo primeiro).

### Comentário 1 — `b0d1b0ad-4536-4d74-b637-14bfa17e6ad9`

- **createdAt:** 2026-08-26T19:52:50.858Z
- **updatedAt:** 2026-08-26T19:52:50.840Z
- **parentId:** null
- **resolvedAt:** null
- **quotedText:** null
- **author:** Maria Eduarda M Camargo (`d540a312-a721-479d-9da4-3b86ed7868ba`)
- **onBehalfOf:** null
- **attachments:** []



#### Corpo integral

Feito no commit `2bed7aa`. Era a primeira das três hipóteses da task, com a segunda somada por cima.

**Causa:** o convite era o último item da `.solutions-caixa`. A caixa é mais alta que a tela — a foto sozinha vai a 620px, mais cabeçalho e navegação — e o sticky recorta com `overflow: clip`. O convite caía justamente na parte recortada. Nunca foi a opacidade: `clamp(0, calc(1 - var(--sol-p) * 8), 1)` vale 1 em `p = 0` e estava correto.

**Correção:** ele saiu de dentro da caixa e passou a ser irmão dela, absoluto no rodapé do próprio `.solutions-sticky`, que já é elemento posicionado. Assim fica sempre dentro do recorte, independente da altura do conteúdo. Também virou coluna em vez de linha: texto em cima, calha embaixo — a pista aponta para baixo sem precisar de seta.

**Contraste (a terceira hipótese, também real):** o texto estava em `rgba(226, 245, 255, 0.62)` sobre o azul do palco e simplesmente não se lia. Subiu para alfa 0.92 e ganhou placa de vidro discreta (borda de 1px + fundo navy translúcido + blur), porque o degradê do fundo varia atrás dele ao longo do percurso e um valor fixo de cor não serve para todo o trecho.

Continua decorativo e `aria-hidden`, continua se apagando pelos primeiros ~12% do percurso via `--sol-p`, e continua renderizado só no palco dirigido — nenhum estado novo, nenhum listener novo. `tsc` e `eslint` limpos, servidor em 200.



## Falhas / lacunas

- Nenhuma falha de download ou paginação neste arquivo.
