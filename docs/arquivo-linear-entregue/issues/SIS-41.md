# SIS-41 — Soluções de Negócios: linha de processo mais baixa e um convite ao scroll no palco

- **Data da exportação:** 2026-09-15T20:51:00.000Z
- **Modo:** somente leitura (`get_issue` + `list_comments`); nada foi alterado no Linear
- **Origem Linear:** https://linear.app/sistran-labs/issue/SIS-41/solucoes-de-negocios-linha-de-processo-mais-baixa-e-um-convite-ao
- **get_issue:** includeRelations=true, includeCustomerNeeds=true, includeReleases=true
- **list_comments:** limit=250, orderBy=createdAt

## Metadados

```json
{
  "id": "SIS-41",
  "uuid": "89cb67ec-7a12-4da9-b322-a3e3cfd38786",
  "title": "Soluções de Negócios: linha de processo mais baixa e um convite ao scroll no palco",
  "priority": {
    "value": 0,
    "name": "No priority"
  },
  "url": "https://linear.app/sistran-labs/issue/SIS-41/solucoes-de-negocios-linha-de-processo-mais-baixa-e-um-convite-ao",
  "gitBranchName": "meduardamcp/sis-41-solucoes-de-negocios-linha-de-processo-mais-baixa-e-um",
  "createdAt": "2026-08-26T19:08:38.683Z",
  "updatedAt": "2026-09-15T20:33:39.075Z",
  "archivedAt": null,
  "completedAt": null,
  "startedAt": "2026-09-15T20:33:39.041Z",
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
      "startedAt": "2026-08-26T19:08:38.683Z",
      "endedAt": "2026-08-26T19:10:21.318Z"
    },
    {
      "state": {
        "id": "95119256-352d-4f0c-b5ae-695c7d838974",
        "name": "Done",
        "type": "completed"
      },
      "startedAt": "2026-08-26T19:10:21.318Z",
      "endedAt": "2026-09-15T20:33:39.065Z"
    },
    {
      "state": {
        "id": "dbb9dfbe-2cc4-423a-862f-94ca7705f813",
        "name": "Entregue",
        "type": "started"
      },
      "startedAt": "2026-09-15T20:33:39.065Z",
      "endedAt": null
    }
  ]
}
```

## Descrição original

Duas coisas no palco preso ao scroll:

## 1. A linha de processo desce um pouco

Hoje ela corre a 44% da altura da foto, alta demais no enquadramento. Passar para **56%** — fração da altura medida, nunca px, para acompanhar a janela em qualquer largura. Mais baixo que isso e ela encosta no cartão descritivo, que ocupa o terço inferior.

## 2. Convite ao scroll

O palco fica preso enquanto as quatro soluções passam e, sem uma pista, a página parece travada. Adicionar uma marca discreta ("Role para percorrer as 04 soluções" com um ponto descendo numa calha fina) que se apaga sozinha quando o percurso começa.

Como: a opacidade sai de `--sol-p`, o progresso que o `ScrollTrigger` já escreve em `.solutions-sticky` — `opacity: clamp(0, calc(1 - var(--sol-p) * 8), 1)`. Sem estado novo, sem listener extra, sem re-render. O ponto anima só `transform` e `opacity`.

Renderizado só no palco dirigido (`dirigindo`), então não há regra para desligar em mobile. Decorativo e `aria-hidden`: quem não vê continua com a navegação lateral e as setas do teclado.

## Restrições

Nenhuma dependência nova. Não alterar textos das soluções, nem o modal de contato.

## Validação

Lint, verificação de tipos, e conferir no navegador que a linha não encosta no cartão em nenhuma das quatro etapas e que o convite desaparece ao começar a rolar.

## Relações / Anexos / Releases / Customer needs

### Relações

```json
{
  "blocks": [],
  "blockedBy": [],
  "relatedTo": [
    {
      "id": "SIS-44",
      "title": "Soluções de Negócios: o convite ao scroll não está visível"
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

### Comentário 1 — `f869c634-cd88-4ad1-b6a8-c54a011c744d`

- **createdAt:** 2026-08-26T19:10:36.127Z
- **updatedAt:** 2026-08-26T19:10:36.104Z
- **parentId:** null
- **resolvedAt:** null
- **quotedText:** null
- **author:** Maria Eduarda M Camargo (`d540a312-a721-479d-9da4-3b86ed7868ba`)
- **onBehalfOf:** null
- **attachments:** []



#### Corpo integral

Movida de Backlog para **Done** no commit `1e6ed65`.

**1. Linha de processo mais baixa**: `linhaY` passou de `geo.ph * 0.44` para `geo.ph * 0.56` em `Solutions.tsx`. Continua fração da altura **medida**, nunca px — acompanha a janela em qualquer largura, zoom ou fonte. O teto é o cartão descritivo, que ocupa o terço inferior: abaixo de ~0.6 a linha começaria a passar por trás dele.

**2. Convite ao scroll**: novo `<p className="solutions-convite">` no fim da `.solutions-caixa` — "Role para percorrer as 04 soluções" com um ponto descendo numa calha fina.
- Opacidade por `clamp(0, calc(1 - var(--sol-p) * 8), 1)`: `--sol-p` é o progresso que o `ScrollTrigger` já escreve em `.solutions-sticky`, então o convite se apaga sozinho nos primeiros ~12% do percurso. **Nenhum estado novo, nenhum listener novo, nenhum re-render** — só CSS lendo um valor que já existia.
- O ponto anima apenas `transform` e `opacity` (`translate3d`), portanto roda no compositor.
- Renderizado só quando `dirigindo` é verdadeiro, então não existe regra para desligá-lo em mobile. Ainda assim há um bloco `prefers-reduced-motion` que para o ponto no meio da calha: se um dia o convite passar a ser renderizado fora do palco dirigido, ele não fica invisível nem em movimento.
- `aria-hidden` e `pointer-events: none`: é pista, não controle. O caminho real continua sendo a navegação lateral (clique) e as setas do teclado.

**Validação**: `tsc --noEmit` limpo (filtrando o `sistran-river-park-3d` vendorizado) e `eslint` limpo; home em 200. O convite não aparece no HTML servido — correto: `dirigindo` depende de `matchMedia`, que só resolve no cliente, e é justamente assim que se evita divergência de hidratação.

**Pendente de olho humano**: que a linha não encoste no cartão em nenhuma das quatro etapas e que o convite desapareça ao começar a rolar.


## Falhas / lacunas

- Nenhuma falha de download ou paginação neste arquivo.
