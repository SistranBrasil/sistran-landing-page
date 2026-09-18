# SIS-43 — Soluções de Negócios: retirar o botão "Veja mais" do rodapé da seção

- **Data da exportação:** 2026-09-15T20:51:00.000Z
- **Modo:** somente leitura (`get_issue` + `list_comments`); nada foi alterado no Linear
- **Origem Linear:** https://linear.app/sistran-labs/issue/SIS-43/solucoes-de-negocios-retirar-o-botao-veja-mais-do-rodape-da-secao
- **get_issue:** includeRelations=true, includeCustomerNeeds=true, includeReleases=true
- **list_comments:** limit=250, orderBy=createdAt

## Metadados

```json
{
  "id": "SIS-43",
  "uuid": "93f03294-6b99-4b4e-84de-b7f2aa13b333",
  "title": "Soluções de Negócios: retirar o botão \"Veja mais\" do rodapé da seção",
  "priority": {
    "value": 0,
    "name": "No priority"
  },
  "url": "https://linear.app/sistran-labs/issue/SIS-43/solucoes-de-negocios-retirar-o-botao-veja-mais-do-rodape-da-secao",
  "gitBranchName": "meduardamcp/sis-43-solucoes-de-negocios-retirar-o-botao-veja-mais-do-rodape-da",
  "createdAt": "2026-08-26T19:35:48.599Z",
  "updatedAt": "2026-09-15T20:33:38.730Z",
  "archivedAt": null,
  "completedAt": null,
  "startedAt": "2026-09-15T20:33:38.700Z",
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
      "startedAt": "2026-08-26T19:35:48.599Z",
      "endedAt": "2026-08-26T19:46:25.002Z"
    },
    {
      "state": {
        "id": "95119256-352d-4f0c-b5ae-695c7d838974",
        "name": "Done",
        "type": "completed"
      },
      "startedAt": "2026-08-26T19:46:25.002Z",
      "endedAt": "2026-09-15T20:33:38.720Z"
    },
    {
      "state": {
        "id": "dbb9dfbe-2cc4-423a-862f-94ca7705f813",
        "name": "Entregue",
        "type": "started"
      },
      "startedAt": "2026-09-15T20:33:38.720Z",
      "endedAt": null
    }
  ]
}
```

## Descrição original

O botão **"Veja mais"** no rodapé da seção sai a pedido.

## O que fazer

Remover o `.solutions-rodape` (o `<Link href="/solucoes#servicos-diferenciais" className="btn-primary">`) de `src/components/Solutions.tsx` e as regras de `.solutions-rodape` de `src/app/globals.css` — inclusive a variação dentro do `@media (min-width: 1024px)`.

Comentar em vez de apagar apenas se o bloco for reaproveitável; caso contrário remover e deixar nota de como religar, no padrão já usado na seção.

## Atenção

O `import Link from 'next/link'` fica órfão se nada mais na seção usar `Link` — conferir e remover junto, senão o lint quebra por import não utilizado.

A página `/solucoes#servicos-diferenciais` continua existindo e acessível pelo menu; nenhuma rota é perdida com a saída do botão.

## Validação

Lint (especialmente import não utilizado), verificação de tipos, e conferir que o fim da seção emenda na próxima sem sobra de espaço vazio.

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

### Comentário 1 — `80372602-b7f1-47d5-b19c-4920ad69cf25`

- **createdAt:** 2026-08-26T19:46:27.997Z
- **updatedAt:** 2026-08-26T19:46:27.975Z
- **parentId:** null
- **resolvedAt:** null
- **quotedText:** null
- **author:** Maria Eduarda M Camargo (`d540a312-a721-479d-9da4-3b86ed7868ba`)
- **onBehalfOf:** null
- **attachments:** []



#### Corpo integral

Feito no commit `d1cfded`.

Saíram os três pedaços que só existiam por causa do botão:

1. `.solutions-rodape` com o `<Link href="/solucoes#servicos-diferenciais">` no fim do JSX de `Solutions.tsx`;
2. o bloco de CSS que o alinhava (`globals.css`, ~7031) — sem o botão sobrava uma caixa vazia reservando altura no fim do palco;
3. a menção a `.solutions-rodape` na media query de 400px, que agora vale só para `.solutions-caixa`.

O import `import Link from 'next/link'` saiu junto: era o único consumo dele no arquivo e um import sem uso quebra o lint. A rota continua alcançável pelo menu — nenhum conteúdo ficou inacessível.

Deixei um comentário no lugar de cada bloco removido explicando como religar, então não sobrou CSS morto nem pista perdida. `tsc --noEmit` e `eslint src/components/Solutions.tsx` limpos; um `grep` por `solutions-rodape` só encontra os comentários.



## Falhas / lacunas

- Nenhuma falha de download ou paginação neste arquivo.
