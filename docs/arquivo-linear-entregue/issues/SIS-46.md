# SIS-46 — Soluções de Negócios: tirar os números da navegação lateral e levá-los para os nós da linha

- **Data da exportação:** 2026-09-15T20:51:00.000Z
- **Modo:** somente leitura (`get_issue` + `list_comments`); nada foi alterado no Linear
- **Origem Linear:** https://linear.app/sistran-labs/issue/SIS-46/solucoes-de-negocios-tirar-os-numeros-da-navegacao-lateral-e-leva-los
- **get_issue:** includeRelations=true, includeCustomerNeeds=true, includeReleases=true
- **list_comments:** limit=250, orderBy=createdAt

## Metadados

```json
{
  "id": "SIS-46",
  "uuid": "0a07d65a-69c0-4f23-bb94-7fdb9b0e499a",
  "title": "Soluções de Negócios: tirar os números da navegação lateral e levá-los para os nós da linha",
  "priority": {
    "value": 0,
    "name": "No priority"
  },
  "url": "https://linear.app/sistran-labs/issue/SIS-46/solucoes-de-negocios-tirar-os-numeros-da-navegacao-lateral-e-leva-los",
  "gitBranchName": "meduardamcp/sis-46-solucoes-de-negocios-tirar-os-numeros-da-navegacao-lateral-e",
  "createdAt": "2026-08-26T19:36:38.349Z",
  "updatedAt": "2026-09-15T20:33:38.861Z",
  "archivedAt": null,
  "completedAt": null,
  "startedAt": "2026-09-15T20:33:38.845Z",
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
      "startedAt": "2026-08-26T19:36:38.349Z",
      "endedAt": "2026-08-26T19:59:53.340Z"
    },
    {
      "state": {
        "id": "95119256-352d-4f0c-b5ae-695c7d838974",
        "name": "Done",
        "type": "completed"
      },
      "startedAt": "2026-08-26T19:59:53.340Z",
      "endedAt": "2026-09-15T20:33:38.855Z"
    },
    {
      "state": {
        "id": "dbb9dfbe-2cc4-423a-862f-94ca7705f813",
        "name": "Entregue",
        "type": "started"
      },
      "startedAt": "2026-09-15T20:33:38.855Z",
      "endedAt": null
    }
  ]
}
```

## Descrição original

Os números `01`–`04` saem da lista lateral e passam a marcar os nós da linha de processo.

## O que fazer

**Na navegação** (`src/components/Solutions.tsx`): remover o `<span className="solutions-nav-num">` de cada item e a regra correspondente no CSS. A lista fica só com o título e a seta do item ativo; a barra à esquerda e a placa de vidro continuam marcando qual é a etapa. O contador `03 / 04` do rodapé da navegação **fica** — é ele que passa a carregar a contagem.

**Nos nós**: cada nó da linha ganha o número da sua solução, no mesmo espírito visual do nó atual (círculo, anel aceso quando ativo). Onde o número mora dentro do nó — dentro do círculo em vez do ícone, ou como legenda logo acima — é decisão da implementação; o requisito é que, olhando a linha, se saiba em que etapa se está.

## Depende de

<issue><issue id="c95d5fe7-97dd-4ece-a6e3-937be291093a" href="https://linear.app/sistran-labs/issue/SIS-45/solucoes-de-negocios-a-linha-de-processo-passa-a-ter-4-nos-um-por-card">SIS-45</issue></issue> — só faz sentido numerar os nós depois que eles forem quatro, um por card. Implementar na ordem.

## Restrições

Acessibilidade: a linha é `aria-hidden` (decoração). Levar os números para lá **não pode** ser a única forma de saber a etapa — o `03 / 04` da navegação e o `aria-current="step"` no item ativo continuam sendo a informação real para leitor de tela.

## Validação

Lint, verificação de tipos, e conferir que nenhum título da lista desalinha sem o número à esquerda.

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
      "id": "SIS-45",
      "title": "Soluções de Negócios: a linha de processo passa a ter 4 nós, um por card, e acende o da etapa"
    },
    {
      "id": "SIS-49",
      "title": "Soluções de Negócios: retirar a legenda numerada de baixo dos nós da linha"
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

### Comentário 1 — `2b51a4f5-464c-4da6-9afe-92a7173d397b`

- **createdAt:** 2026-08-26T20:00:12.228Z
- **updatedAt:** 2026-08-26T20:00:11.921Z
- **parentId:** null
- **resolvedAt:** null
- **quotedText:** null
- **author:** Maria Eduarda M Camargo (`d540a312-a721-479d-9da4-3b86ed7868ba`)
- **onBehalfOf:** null
- **attachments:** []



#### Corpo integral

Done — commit `8310c19`.

**Navegação.** O `<span className="solutions-nav-num">` saiu de cada item e o bloco `.solutions-nav-num` (mais a variante `[data-estado="ativo"]`) saiu do `globals.css`, substituído por um comentário que diz para onde a tipografia foi e como religar. O item ficou com título + seta; a barra ciano à esquerda, a placa de vidro e o `min-height: 72px` continuam marcando a etapa. Nenhum ajuste de layout foi necessário — o número era o primeiro filho de um flex com `gap: 1rem` e o título tem `flex: 1`, então tirá-lo só devolveu largura ao título.

**Nós.** Cada nó ganhou `.solutions-fio-no-num` com a numeração, na mesma tipografia que a navegação tinha (fonte de display, 700, `tabular-nums`, `rgba(165,240,255,0.62)` → `#0ed8f6` quando aceso, agora com um halo de 12px). Fica como legenda 7px abaixo do círculo, e não dentro dele: os 52px do nó já são do ícone da solução, e empilhar ícone e número ali deixaria os dois ilegíveis. A transição usa os mesmos 380ms `cubic-bezier(0.22, 1, 0.36, 1)` das outras trocas de estado do nó, então o número acende junto da borda e do brilho, sem animação própria.

Posicionamento: `left: 50%` + `translateX(-50%)` no filho. Seguro apesar de o nó ter o seu próprio `translate(-50%, -50%)` — aquele é do pai, e o filho absoluto tem sistema de coordenadas próprio. Fica fora do anel de pulso (`inset: -10px`), então o pulso não o arrasta.

**Acessibilidade, como a restrição pedia.** A linha continua `aria-hidden`: a numeração dos nós é decorativa. O canal real é o mesmo de antes — o contador `01 / 04` em `.solutions-progresso` e o `aria-current="step"` no botão ativo. Nada foi tocado nos dois.

Verificado: `tsc --noEmit` limpo, `eslint src/components/Solutions.tsx` limpo, nenhuma ocorrência órfã de `solutions-nav-num` fora do comentário, servidor em 200.

Falta a conferência no navegador (títulos alinhados sem o número; a legenda dos quatro nós legível sobre a foto), que faço junto da validação da seção inteira ao fim de SIS-47.


## Falhas / lacunas

- Nenhuma falha de download ou paginação neste arquivo.
