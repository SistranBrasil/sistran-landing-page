# SIS-40 — Soluções de Negócios: limpar o cartão — tirar o selo "Ativo" e o número pequeno acima do título

- **Data da exportação:** 2026-09-15T20:51:00.000Z
- **Modo:** somente leitura (`get_issue` + `list_comments`); nada foi alterado no Linear
- **Origem Linear:** https://linear.app/sistran-labs/issue/SIS-40/solucoes-de-negocios-limpar-o-cartao-tirar-o-selo-ativo-e-o-numero
- **get_issue:** includeRelations=true, includeCustomerNeeds=true, includeReleases=true
- **list_comments:** limit=250, orderBy=createdAt

## Metadados

```json
{
  "id": "SIS-40",
  "uuid": "70fb273c-3b03-42e5-815b-8ef5844d6a48",
  "title": "Soluções de Negócios: limpar o cartão — tirar o selo \"Ativo\" e o número pequeno acima do título",
  "priority": {
    "value": 0,
    "name": "No priority"
  },
  "url": "https://linear.app/sistran-labs/issue/SIS-40/solucoes-de-negocios-limpar-o-cartao-tirar-o-selo-ativo-e-o-numero",
  "gitBranchName": "meduardamcp/sis-40-solucoes-de-negocios-limpar-o-cartao-tirar-o-selo-ativo-e-o",
  "createdAt": "2026-08-26T19:08:24.328Z",
  "updatedAt": "2026-09-15T20:33:38.621Z",
  "archivedAt": null,
  "completedAt": null,
  "startedAt": "2026-09-15T20:33:38.602Z",
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
      "startedAt": "2026-08-26T19:08:24.328Z",
      "endedAt": "2026-08-26T19:09:59.151Z"
    },
    {
      "state": {
        "id": "95119256-352d-4f0c-b5ae-695c7d838974",
        "name": "Done",
        "type": "completed"
      },
      "startedAt": "2026-08-26T19:09:59.151Z",
      "endedAt": "2026-09-15T20:33:38.616Z"
    },
    {
      "state": {
        "id": "dbb9dfbe-2cc4-423a-862f-94ca7705f813",
        "name": "Entregue",
        "type": "started"
      },
      "startedAt": "2026-09-15T20:33:38.616Z",
      "endedAt": null
    }
  ]
}
```

## Descrição original

O cartão descritivo carrega duas informações redundantes:

* o selo **"ATIVO"** no pé — o cartão só é exibido na cena ativa, então dizê-lo não informa nada;
* o número pequeno (`03`) **acima do título** — o número grande à direita (`solution-info-marca`) e o `03 / 04` da navegação já dizem a etapa, e esse eyebrow só empurrava o título para baixo.

## O que fazer

Remover os dois `<span>` (`solution-info-indice` e `solution-info-estado`) de `src/components/Solutions.tsx` e as regras correspondentes de `src/app/globals.css` — não deixar CSS morto. A barrinha em degradê (`solution-info-linha`) fica, como remate inferior do cartão.

Sem o número pequeno o título passa a encostar no ícone: compensar a margem (`margin-top` 0.45rem → 0.95rem).

A cascata de entrada do cartão (ícone → número → título → texto → estado) perde dois degraus: reaproximar os atrasos para não sobrar buraco de tempo, terminando no remate.

## Restrições

Só esta seção. Nenhum texto de conteúdo muda — os dois elementos removidos eram rótulos de estado, não copy.

## Validação

Lint, verificação de tipos, e conferir no navegador que os quatro cartões continuam alinhados e que a cascata de entrada não tem pausa.

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

### Comentário 1 — `5933b231-9a06-4054-a416-dcfd7daac54d`

- **createdAt:** 2026-08-26T19:10:15.061Z
- **updatedAt:** 2026-08-26T19:10:15.028Z
- **parentId:** null
- **resolvedAt:** null
- **quotedText:** null
- **author:** Maria Eduarda M Camargo (`d540a312-a721-479d-9da4-3b86ed7868ba`)
- **onBehalfOf:** null
- **attachments:** []



#### Corpo integral

Movida de Backlog para **Done** no commit `e90729d`.

**O que foi feito**
- `src/components/Solutions.tsx`: fora `<span className="solution-info-indice">` (o número pequeno acima do título) e `<span className="solution-info-estado">Ativo</span>`.
- `src/app/globals.css`: as duas regras de tipografia saíram junto — nada de CSS morto. No lugar delas ficou um comentário dizendo o que foi removido, por quê e como religar (dois `<span>` no componente e dois blocos como os vizinhos).
- `margin-top` do título 0.45rem → **0.95rem**: a margem antiga era medida a partir do número pequeno; sem ele o título encostava no ícone.
- Cascata de entrada do cartão: perdeu dois degraus (número e selo), então os atrasos foram reaproximados — ícone 160ms, título 225ms, texto 290ms, remate 350ms. Antes o último degrau era em 380ms com dois vãos no meio.
- A barrinha em degradê (`solution-info-linha`) ficou, agora como remate inferior do cartão, e entrou na cascata no lugar do selo.

**Por que os dois elementos eram redundantes**: o cartão só é renderizado na cena ativa, então o selo "ATIVO" não informava estado nenhum; e a etapa já é dita duas vezes — pelo número grande à direita e pelo "03 / 04" da navegação lateral. Nenhum texto de conteúdo mudou: os dois eram rótulos de estado, não copy.

**Validação**: `tsc --noEmit` limpo (filtrando o `sistran-river-park-3d` vendorizado) e `eslint` limpo; home em 200. Confirmado por grep que `solution-info-indice` e `solution-info-estado` não aparecem mais em nenhum seletor nem no markup — só na nota explicativa.

**Pendente de olho humano**: alinhamento dos quatro cartões e a cascata sem pausa, no navegador.


## Falhas / lacunas

- Nenhuma falha de download ou paginação neste arquivo.
