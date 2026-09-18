# SIS-45 — Soluções de Negócios: a linha de processo passa a ter 4 nós, um por card, e acende o da etapa

- **Data da exportação:** 2026-09-15T20:51:00.000Z
- **Modo:** somente leitura (`get_issue` + `list_comments`); nada foi alterado no Linear
- **Origem Linear:** https://linear.app/sistran-labs/issue/SIS-45/solucoes-de-negocios-a-linha-de-processo-passa-a-ter-4-nos-um-por-card
- **get_issue:** includeRelations=true, includeCustomerNeeds=true, includeReleases=true
- **list_comments:** limit=250, orderBy=createdAt

## Metadados

```json
{
  "id": "SIS-45",
  "uuid": "c95d5fe7-97dd-4ece-a6e3-937be291093a",
  "title": "Soluções de Negócios: a linha de processo passa a ter 4 nós, um por card, e acende o da etapa",
  "priority": {
    "value": 0,
    "name": "No priority"
  },
  "url": "https://linear.app/sistran-labs/issue/SIS-45/solucoes-de-negocios-a-linha-de-processo-passa-a-ter-4-nos-um-por-card",
  "gitBranchName": "meduardamcp/sis-45-solucoes-de-negocios-a-linha-de-processo-passa-a-ter-4-nos",
  "createdAt": "2026-08-26T19:36:22.232Z",
  "updatedAt": "2026-09-15T20:33:36.900Z",
  "archivedAt": null,
  "completedAt": null,
  "startedAt": "2026-09-15T20:33:36.878Z",
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
      "startedAt": "2026-08-26T19:36:22.232Z",
      "endedAt": "2026-08-26T19:54:48.401Z"
    },
    {
      "state": {
        "id": "95119256-352d-4f0c-b5ae-695c7d838974",
        "name": "Done",
        "type": "completed"
      },
      "startedAt": "2026-08-26T19:54:48.401Z",
      "endedAt": "2026-09-15T20:33:36.892Z"
    },
    {
      "state": {
        "id": "dbb9dfbe-2cc4-423a-862f-94ca7705f813",
        "name": "Entregue",
        "type": "started"
      },
      "startedAt": "2026-09-15T20:33:36.892Z",
      "endedAt": null
    }
  ]
}
```

## Descrição original

Hoje a linha tem **seis** nós e as soluções são **quatro**. O nó aceso é `ativo + 1`, uma compensação inventada justamente porque a contagem não fecha: com seis nós e quatro etapas nenhum nó corresponde a uma solução.

## O que fazer

Reduzir para **quatro nós, um por card**, e acender exatamente o da etapa ativa (`i === ativo`), marcando os anteriores como percorridos.

Em `src/components/Solutions.tsx`:

* `ICONES_NO` passa a ter quatro ícones — os das próprias soluções, via `getIcon(s.icon)`, em vez de uma lista decorativa paralela. Assim o nó e o cartão falam do mesmo item.
* a distribuição `0.135 + i * 0.146` foi calculada para seis: recalcular para quatro, mantendo folga nas duas pontas.
* `noAtivo` deixa de existir — o estado de cada nó vira `i === ativo ? 'ativo' : i < ativo ? 'feito' : 'proximo'`, o mesmo vocabulário das cenas e da navegação.
* o fim do caminho SVG é medido a partir do último nó: ajustar junto, senão sobra linha à direita.

## Restrições

As posições continuam em % da caixa medida (`geo`), nunca px — os nós são spans HTML porque o svg usa `preserveAspectRatio="none"` e um `<circle>` viraria elipse.

## Validação

Nas quatro etapas: quatro nós, exatamente um aceso, e o aceso é o da solução do cartão. Conferir em desktop largo e estreito.

## Relações / Anexos / Releases / Customer needs

### Relações

```json
{
  "blocks": [],
  "blockedBy": [],
  "relatedTo": [
    {
      "id": "SIS-47",
      "title": "Soluções de Negócios: melhorar o remate final da linha de processo"
    },
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

### Comentário 1 — `3f170dd3-5b98-4317-872d-2275609b15f1`

- **createdAt:** 2026-08-26T19:54:54.797Z
- **updatedAt:** 2026-08-26T19:54:54.746Z
- **parentId:** null
- **resolvedAt:** null
- **quotedText:** null
- **author:** Maria Eduarda M Camargo (`d540a312-a721-479d-9da4-3b86ed7868ba`)
- **onBehalfOf:** null
- **attachments:** []



#### Corpo integral

Feito no commit `82670e4`.

**O que mudou:** a linha passou de seis nós para `total` (quatro), um por solução, e o nó aceso é o próprio `ativo`. A correção `noAtivo = ativo + 1` saiu — ela só existia porque com seis nós a cabeça do percurso caía no nó errado; com um nó por etapa não há índice a corrigir.

**Ícones:** cada nó carrega o ícone da **sua** solução, via `getIcon(s.icon)` — o mesmo que o cartão descritivo mostra. A lista `ICONES_NO` e os seis imports do lucide (`Boxes`, `Check`, `Code2`, `ShieldCheck`, `UserPlus`, `Workflow`) saíram. O raciocínio: enquanto os nós eram seis e decorativos, um ícone qualquer servia; agora que cada nó representa uma etapa nomeada, um ícone alheio confundiria em vez de orientar.

**Distribuição:** de 0.14 a 0.86 da largura medida da foto, com o passo **derivado de `total`** em vez do `0.135 + i * 0.146` escrito na mão. As margens de 14% em cada ponta impedem que o primeiro e o último encostem na borda da janela. Se um dia entrar ou sair uma solução, a linha continua distribuída sozinha.

O fim do caminho passou de `nos[5]` para `nos[nos.length - 1]`, e a chave do `map` de índice para `SOLUTIONS[i].id`.

Segue `aria-hidden`: a informação de etapa continua no `01 / 04` da navegação e no `aria-current="step"`. `tsc` e `eslint` limpos, servidor em 200.

Destrava SIS-46 e SIS-47, que dependiam desta.



## Falhas / lacunas

- Nenhuma falha de download ou paginação neste arquivo.
