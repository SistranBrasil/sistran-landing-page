# SIS-36 — Soluções de Negócios: plugar as quatro fotos e emendar com o mosaico

- **Data da exportação:** 2026-09-15T20:51:00.000Z
- **Modo:** somente leitura (`get_issue` + `list_comments`); nada foi alterado no Linear
- **Origem Linear:** https://linear.app/sistran-labs/issue/SIS-36/solucoes-de-negocios-plugar-as-quatro-fotos-e-emendar-com-o-mosaico
- **get_issue:** includeRelations=true, includeCustomerNeeds=true, includeReleases=true
- **list_comments:** limit=250, orderBy=createdAt

## Metadados

```json
{
  "id": "SIS-36",
  "uuid": "78dd9e73-c49c-4ce0-8b65-1731b055e3c1",
  "title": "Soluções de Negócios: plugar as quatro fotos e emendar com o mosaico",
  "priority": {
    "value": 0,
    "name": "No priority"
  },
  "url": "https://linear.app/sistran-labs/issue/SIS-36/solucoes-de-negocios-plugar-as-quatro-fotos-e-emendar-com-o-mosaico",
  "gitBranchName": "meduardamcp/sis-36-solucoes-de-negocios-plugar-as-quatro-fotos-e-emendar-com-o",
  "createdAt": "2026-08-26T17:41:32.367Z",
  "updatedAt": "2026-09-15T20:33:39.490Z",
  "archivedAt": null,
  "completedAt": null,
  "startedAt": "2026-09-15T20:33:39.468Z",
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
      "startedAt": "2026-08-26T17:41:32.367Z",
      "endedAt": "2026-08-26T17:45:29.454Z"
    },
    {
      "state": {
        "id": "95119256-352d-4f0c-b5ae-695c7d838974",
        "name": "Done",
        "type": "completed"
      },
      "startedAt": "2026-08-26T17:45:29.454Z",
      "endedAt": "2026-09-15T20:33:39.482Z"
    },
    {
      "state": {
        "id": "dbb9dfbe-2cc4-423a-862f-94ca7705f813",
        "name": "Entregue",
        "type": "started"
      },
      "startedAt": "2026-09-15T20:33:39.482Z",
      "endedAt": null
    }
  ]
}
```

## Descrição original

A janela de imagem das quatro soluções na home aparecia como um retângulo navy vazio.

**Causa**: `src/components/Solutions.tsx` renderizava `<div className="solution-image" role="presentation" />` — um `div` placeholder, nunca um elemento de imagem. A regra `.solution-image` pintava um degradê navy e carregava `object-fit: cover`, que não faz nada num `div`. O docblock do componente dizia "as fotos entram na <issue id="bbe9a6fb-997b-4349-8937-d555227354ef" href="https://linear.app/sistran-labs/issue/SIS-20/solucoes-de-negocios-alimentar-a-cena-com-as-imagens-do-metodo-quatro">SIS-20</issue>", e a <issue id="bbe9a6fb-997b-4349-8937-d555227354ef" href="https://linear.app/sistran-labs/issue/SIS-20/solucoes-de-negocios-alimentar-a-cena-com-as-imagens-do-metodo-quatro">SIS-20</issue> nunca foi implementada. Não era falha de caminho nem de carregamento: não havia imagem.

**Escopo**

* `src/data/types.ts`: campos opcionais `image`/`imageAlt` no tipo `Solution`.
* `src/data/solutions.ts`: as quatro fotos de `public/images/home/` — `escritoriosp.jpg` no card 01 (APIs, Projetos, Desenvolvimento, Sustentação e Migrações), `escritoriosp1.jpg` no 02, `sistransphist2.jpg` no 03, `sistransphist3.jpg` no 04 — cada uma com `alt` descritivo.
* `src/components/Solutions.tsx`: `next/image` com `fill` dentro de `.solution-viewport` (`position: relative; overflow: hidden`), mais um véu navy só nas bordas para o traço e o cartão terem contraste sem apagar as pessoas.
* `src/data/legacy.ts`: `escritoriosp.jpg` também no tile "Arquitetura modular e escalável" do mosaico, para a passagem de "Arquitetura | destino adequado ao contexto" para o card 01 ler como continuação.

Nenhum texto visível muda; nenhuma imagem nova é gerada.

## Relações / Anexos / Releases / Customer needs

### Relações

```json
{
  "blocks": [],
  "blockedBy": [],
  "relatedTo": [
    {
      "id": "SIS-19",
      "title": "Soluções de Negócios: reconstruir como teatro de soluções guiado por scroll"
    },
    {
      "id": "SIS-38",
      "title": "Home: o tile \"Arquitetura modular e escalável\" atravessa o scroll até virar a foto do card 01 de Soluções"
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

### Comentário 1 — `2ee1be6e-7dca-48d9-82ac-112da2abdcf8`

- **createdAt:** 2026-08-26T17:45:42.365Z
- **updatedAt:** 2026-08-26T17:45:42.343Z
- **parentId:** null
- **resolvedAt:** null
- **quotedText:** null
- **author:** Maria Eduarda M Camargo (`d540a312-a721-479d-9da4-3b86ed7868ba`)
- **onBehalfOf:** null
- **attachments:** []



#### Corpo integral

Backlog → Done no commit `9141420` (dados) + `9398cae` (componente).

**O que foi feito**
- `src/data/types.ts`: `image?`/`imageAlt?` no tipo `Solution`. Opcionais de propósito — `/solucoes` consome os mesmos dados sem palco de imagem.
- `src/data/solutions.ts`: `escritoriosp.jpg` no card 01, `escritoriosp1.jpg` no 02, `sistransphist2.jpg` no 03, `sistransphist3.jpg` no 04, cada uma com `alt` descritivo.
- `src/components/Solutions.tsx`: o `<div className="solution-image" role="presentation" />` deu lugar a `next/image` com `fill` dentro de `.solution-viewport` (`position: relative; overflow: hidden`, exigência do `fill`), mais véu navy só nas bordas.
- `src/data/legacy.ts`: `escritoriosp.jpg` também no tile "Arquitetura modular e escalável". É a MESMA foto do card 01 de propósito: é o último tile antes de Soluções, então a passagem de "Arquitetura | destino adequado ao contexto" para o card 01 lê como continuação. Trocar uma sem trocar a outra quebra a emenda — o comentário no arquivo registra isso.

**Verificação**
- `tsc --noEmit` limpo (ignorando `src/app/sistran-river-park-3d/`, vendorizado e já quebrado antes) e `eslint` limpo nos quatro arquivos.
- As quatro `/images/home/*.jpg` respondem 200; o HTML servido da home traz quatro `<img class="solution-image">` com `alt` real, e `escritoriosp.jpg` aparece duas vezes (tile do mosaico + card 01).
- `next.config.mjs` tem `images: { unoptimized: true }`, então o `next/image` emite o `src` cru e `/_next/image?url=...` responde 404 por definição — não é defeito.

**Sobre a causa**: confirmada como descrita na issue. Não era caminho nem carregamento — não existia elemento de imagem. Como a <issue id="bbe9a6fb-997b-4349-8937-d555227354ef" href="https://linear.app/sistran-labs/issue/SIS-20/solucoes-de-negocios-alimentar-a-cena-com-as-imagens-do-metodo-quatro">SIS-20</issue> era exatamente esse trabalho, ela fica superada por esta.


## Falhas / lacunas

- Nenhuma falha de download ou paginação neste arquivo.
