# SIS-49 — Soluções de Negócios: retirar a legenda numerada de baixo dos nós da linha

- **Data da exportação:** 2026-09-15T20:51:00.000Z
- **Modo:** somente leitura (`get_issue` + `list_comments`); nada foi alterado no Linear
- **Origem Linear:** https://linear.app/sistran-labs/issue/SIS-49/solucoes-de-negocios-retirar-a-legenda-numerada-de-baixo-dos-nos-da
- **get_issue:** includeRelations=true, includeCustomerNeeds=true, includeReleases=true
- **list_comments:** limit=250, orderBy=createdAt

## Metadados

```json
{
  "id": "SIS-49",
  "uuid": "e1cc925d-ffc2-47c4-8fe9-9767880b9015",
  "title": "Soluções de Negócios: retirar a legenda numerada de baixo dos nós da linha",
  "priority": {
    "value": 0,
    "name": "No priority"
  },
  "url": "https://linear.app/sistran-labs/issue/SIS-49/solucoes-de-negocios-retirar-a-legenda-numerada-de-baixo-dos-nos-da",
  "gitBranchName": "meduardamcp/sis-49-solucoes-de-negocios-retirar-a-legenda-numerada-de-baixo-dos",
  "createdAt": "2026-08-26T20:05:09.342Z",
  "updatedAt": "2026-09-15T20:33:35.538Z",
  "archivedAt": null,
  "completedAt": null,
  "startedAt": "2026-09-15T20:33:35.433Z",
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
      "startedAt": "2026-08-26T20:05:09.342Z",
      "endedAt": "2026-08-26T20:06:46.198Z"
    },
    {
      "state": {
        "id": "95119256-352d-4f0c-b5ae-695c7d838974",
        "name": "Done",
        "type": "completed"
      },
      "startedAt": "2026-08-26T20:06:46.198Z",
      "endedAt": "2026-09-15T20:33:35.454Z"
    },
    {
      "state": {
        "id": "dbb9dfbe-2cc4-423a-862f-94ca7705f813",
        "name": "Entregue",
        "type": "started"
      },
      "startedAt": "2026-09-15T20:33:35.454Z",
      "endedAt": null
    }
  ]
}
```

## Descrição original

Os `01`–`04` que ficaram como legenda sob cada nó da linha de processo saem.

## O que fazer

Remover o `<span className="solutions-fio-no-num">` em `src/components/Solutions.tsx` e o bloco `.solutions-fio-no-num` (mais a variante `[data-estado="ativo"]`) do `globals.css`, deixando comentário de religação no lugar de cada um — os nós ficam só com o ícone da solução.

## Por que

Vieram de <issue id="0a07d65a-69c0-4f23-bb94-7fdb9b0e499a" href="https://linear.app/sistran-labs/issue/SIS-46/solucoes-de-negocios-tirar-os-numeros-da-navegacao-lateral-e-leva-los">SIS-46</issue>, que tirou os números da navegação lateral e os levou para os nós. Sob a foto eles ficaram penduradas fora do círculo, pequenas e sobre imagem — mais ruído do que marcação. O que marca a etapa na linha já é o próprio nó: círculo aceso, borda clara, halo ciano e o anel que pulsa.

## Restrições

Nada de informação se perde: a linha é `aria-hidden`, e a etapa continua a ser dita pelo contador `01 / 04` de `.solutions-progresso` e pelo `aria-current="step"` do item ativo da navegação. Não reintroduzir os números na navegação — eles saíram de lá em <issue id="0a07d65a-69c0-4f23-bb94-7fdb9b0e499a" href="https://linear.app/sistran-labs/issue/SIS-46/solucoes-de-negocios-tirar-os-numeros-da-navegacao-lateral-e-leva-los">SIS-46</issue> de propósito.

## Validação

Lint, verificação de tipos, e conferir que o anel de pulso do nó ativo não fica com espaço sobrando embaixo.

## Relações / Anexos / Releases / Customer needs

### Relações

```json
{
  "blocks": [],
  "blockedBy": [],
  "relatedTo": [
    {
      "id": "SIS-46",
      "title": "Soluções de Negócios: tirar os números da navegação lateral e levá-los para os nós da linha"
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

### Comentário 1 — `249d21ea-f4fe-4efd-b9e7-7f2ffcccef0a`

- **createdAt:** 2026-08-26T20:06:59.604Z
- **updatedAt:** 2026-08-26T20:06:59.565Z
- **parentId:** null
- **resolvedAt:** null
- **quotedText:** null
- **author:** Maria Eduarda M Camargo (`d540a312-a721-479d-9da4-3b86ed7868ba`)
- **onBehalfOf:** null
- **attachments:** []



#### Corpo integral

Done — commit `96e0e67`.

Saíram o `<span className="solutions-fio-no-num">` em `Solutions.tsx` e o bloco `.solutions-fio-no-num` (com a variante `[data-estado="ativo"]`) no `globals.css`. Nos dois lugares ficou comentário de religação; o do CSS guarda os valores exactos (posicionamento, tamanho, os dois tons), então voltar atrás é colar de novo, sem redescobrir nada.

Os nós ficaram só com o ícone da solução. A marcação da etapa na linha não dependia do número: é o círculo aceso, a borda `rgba(165,240,255,0.85)`, o halo ciano e o anel `::after` que pulsa. Nenhum deles foi tocado.

O anel de pulso não deixou espaço sobrando embaixo, como a validação pedia: ele é um `::after` posicionado por `inset: -10px` no próprio nó, e o número era um irmão absoluto fora dele — sair não mexeu na geometria do nó nem do anel.

Acessibilidade intacta pelo mesmo motivo de SIS-46: a linha é `aria-hidden`, e a etapa continua dita pelo contador `01 / 04` de `.solutions-progresso` e pelo `aria-current="step"`. Os números **não** voltaram para a navegação lateral.

Verificado: `tsc --noEmit` limpo, `eslint src/components/Solutions.tsx` limpo, nenhuma ocorrência de `solutions-fio-no-num` fora dos dois comentários, servidor em 200.


## Falhas / lacunas

- Nenhuma falha de download ou paginação neste arquivo.
