# SIS-39 — Soluções de Negócios: diminuir o cartão descritivo sobre a foto

- **Data da exportação:** 2026-09-15T20:51:00.000Z
- **Modo:** somente leitura (`get_issue` + `list_comments`); nada foi alterado no Linear
- **Origem Linear:** https://linear.app/sistran-labs/issue/SIS-39/solucoes-de-negocios-diminuir-o-cartao-descritivo-sobre-a-foto
- **get_issue:** includeRelations=true, includeCustomerNeeds=true, includeReleases=true
- **list_comments:** limit=250, orderBy=createdAt

## Metadados

```json
{
  "id": "SIS-39",
  "uuid": "a9e233ec-1add-4fef-ac37-a30850d74a4a",
  "title": "Soluções de Negócios: diminuir o cartão descritivo sobre a foto",
  "priority": {
    "value": 0,
    "name": "No priority"
  },
  "url": "https://linear.app/sistran-labs/issue/SIS-39/solucoes-de-negocios-diminuir-o-cartao-descritivo-sobre-a-foto",
  "gitBranchName": "meduardamcp/sis-39-solucoes-de-negocios-diminuir-o-cartao-descritivo-sobre-a",
  "createdAt": "2026-08-26T18:31:15.604Z",
  "updatedAt": "2026-09-15T20:33:39.864Z",
  "archivedAt": null,
  "completedAt": null,
  "startedAt": "2026-09-15T20:33:39.826Z",
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
      "startedAt": "2026-08-26T18:31:15.604Z",
      "endedAt": "2026-08-26T18:35:19.709Z"
    },
    {
      "state": {
        "id": "95119256-352d-4f0c-b5ae-695c7d838974",
        "name": "Done",
        "type": "completed"
      },
      "startedAt": "2026-08-26T18:35:19.709Z",
      "endedAt": "2026-09-15T20:33:39.857Z"
    },
    {
      "state": {
        "id": "dbb9dfbe-2cc4-423a-862f-94ca7705f813",
        "name": "Entregue",
        "type": "started"
      },
      "startedAt": "2026-09-15T20:33:39.857Z",
      "endedAt": null
    }
  ]
}
```

## Descrição original

O cartão de vidro sobre a foto ficou grande demais: 78% da largura da janela, 210px de altura mínima e até 40px de padding. Ele come mais da imagem do que precisa e joga o número decorativo para perto do título.

## O que fazer

Reduzir o cartão mantendo a legibilidade:

* desktop: largura 78% → 62%, altura mínima 210px → 176px, padding até 32px, `left` -6% → -4%, `bottom` -24px → -20px;
* tablet (1024–1279px): 88% → 76%, 190px → 168px, padding 22px — mais largo que no desktop de propósito, porque a coluna do palco é menor ali e em 62% o título do card 01 quebraria em quatro linhas;
* proporções internas acompanham: ícone 44px → 38px, título `clamp(1.05rem, 1.24vw, 1.34rem)`, texto 0.92rem, número decorativo `clamp(2.8rem, 5vw, 5.4rem)`.

O título continua com largura máxima reservada para o número decorativo nunca encostar nele (`min(40ch, 72%)`).

## Restrições

Só CSS, só esta seção. Nenhum texto muda.

## Validação

Lint, verificação de tipos, e conferir no navegador que os quatro títulos cabem sem estourar o cartão e que número e texto não se sobrepõem.

## Relações / Anexos / Releases / Customer needs

### Relações

```json
{
  "blocks": [],
  "blockedBy": [],
  "relatedTo": [],
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

### Comentário 1 — `a9cc4999-c1aa-4e36-8491-dde2faf6730c`

- **createdAt:** 2026-08-26T18:35:33.387Z
- **updatedAt:** 2026-08-26T18:35:32.473Z
- **parentId:** null
- **resolvedAt:** null
- **quotedText:** null
- **author:** Maria Eduarda M Camargo (`d540a312-a721-479d-9da4-3b86ed7868ba`)
- **onBehalfOf:** null
- **attachments:** []



#### Corpo integral

Movida de Backlog para **Done** no commit `de793bb`. Só CSS, em `src/app/globals.css`.

**Desktop** (`.solutions-scroll[data-dirigindo] .solution-info`): largura 78% → **62%**, altura mínima 210px → **176px**, padding `clamp(32px, 2.4vw, 40px)` → **`clamp(24px, 1.9vw, 32px)`**, `left` -6% → **-4%**, `bottom` -24px → **-20px**.

**Tablet** (1024–1279px): 88% → **76%**, 190px → **168px**, padding 26px → **22px**. Deliberadamente mais largo que no desktop: a coluna do palco é mais estreita ali e em 62% o título do card 01 quebraria em quatro linhas — está registrado em comentário no CSS, junto com os valores antigos, para ninguém "corrigir" a diferença depois.

**Internos, para o cartão menor não ficar apertado**: ícone 44 → 38px (svg 22 → 19px), título `clamp(1.15rem, 1.5vw, 1.6rem)` → `clamp(1.05rem, 1.24vw, 1.34rem)` com `line-height` 1.24, texto 0.98 → 0.92rem (`line-height` 1.55), número decorativo `clamp(3.4rem, 7vw, 7.4rem)` → `clamp(2.8rem, 5vw, 5.4rem)`.

O título continua com largura máxima reservada (`min(40ch, 72%)`, texto `min(50ch, 76%)`) para o número decorativo nunca encostar nele — num retângulo mais estreito o número ocupa a mesma fatia, então a margem foi reapertada em proporção.

**Validação**: `tsc --noEmit` limpo (filtrando o `sistran-river-park-3d` vendorizado) e `eslint` limpo; home em 200. Nenhum texto mudou, nenhuma outra seção foi tocada.

**Limitação honesta**: a conferência visual dos quatro títulos dentro do cartão menor (e da não-sobreposição com o número) ainda é pelo navegador — o mais longo é o do card 01, que é o caso a olhar primeiro, em desktop e em tablet.


## Falhas / lacunas

- Nenhuma falha de download ou paginação neste arquivo.
