# SIS-48 — Soluções de Negócios: a pílula do cabeçalho fica escondida atrás do header fixo

- **Data da exportação:** 2026-09-15T20:51:00.000Z
- **Modo:** somente leitura (`get_issue` + `list_comments`); nada foi alterado no Linear
- **Origem Linear:** https://linear.app/sistran-labs/issue/SIS-48/solucoes-de-negocios-a-pilula-do-cabecalho-fica-escondida-atras-do
- **get_issue:** includeRelations=true, includeCustomerNeeds=true, includeReleases=true
- **list_comments:** limit=250, orderBy=createdAt

## Metadados

```json
{
  "id": "SIS-48",
  "uuid": "d586cba6-71b5-4078-a50f-89dfe2467c63",
  "title": "Soluções de Negócios: a pílula do cabeçalho fica escondida atrás do header fixo",
  "priority": {
    "value": 0,
    "name": "No priority"
  },
  "url": "https://linear.app/sistran-labs/issue/SIS-48/solucoes-de-negocios-a-pilula-do-cabecalho-fica-escondida-atras-do",
  "gitBranchName": "meduardamcp/sis-48-solucoes-de-negocios-a-pilula-do-cabecalho-fica-escondida",
  "createdAt": "2026-08-26T19:41:54.237Z",
  "updatedAt": "2026-09-15T20:33:36.634Z",
  "archivedAt": null,
  "completedAt": null,
  "startedAt": "2026-09-15T20:33:36.604Z",
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
      "startedAt": "2026-08-26T19:41:54.237Z",
      "endedAt": "2026-08-26T19:42:30.431Z"
    },
    {
      "state": {
        "id": "95119256-352d-4f0c-b5ae-695c7d838974",
        "name": "Done",
        "type": "completed"
      },
      "startedAt": "2026-08-26T19:42:30.431Z",
      "endedAt": "2026-09-15T20:33:36.620Z"
    },
    {
      "state": {
        "id": "dbb9dfbe-2cc4-423a-862f-94ca7705f813",
        "name": "Entregue",
        "type": "started"
      },
      "startedAt": "2026-09-15T20:33:36.620Z",
      "endedAt": null
    }
  ]
}
```

## Descrição original

## O que acontece

No palco dirigido (>= 1024px) a pílula "Veja como a Sistran pode ajudar sua Seguradora nos mais variados desafios de negócios." nasce colada no topo da tela e o header fixo passa por cima dela. Lê-se só o começo do texto — "VEJA COMO A SISTRAN P..." — o resto fica atrás da barra do menu.

## Por que

`.solutions-scroll[data-dirigindo] .solutions-sticky` (globals.css, \~7140) é:

```css
position: sticky;
top: 0;
height: 100svh;
display: flex;
flex-direction: column;
justify-content: center;
```

O `top: 0` é correto — é o que faz o palco travar na tela inteira. Mas a caixa centralizada usa 100svh **inteiros**, incluindo a faixa que o header fixo ocupa. Como o cabeçalho da seção é o primeiro item da coluna, é justamente ele que cai na zona coberta.

## Correção

Reservar a altura do header no próprio sticky:

```css
padding-top: var(--header-h);
```

`--header-h` já existe (`globals.css:908`, `88px`) e o `Header` a reescreve em tempo real quando compacta (`Header.tsx:55`, `68px`), então o espaço acompanha a barra em vez de ser um número mágico. Com `box-sizing: border-box` (preflight do Tailwind) o `height: 100svh` não cresce: a área de conteúdo passa a ser `100svh - --header-h` e o `justify-content: center` centraliza **abaixo** do header.

Não usar `top: var(--header-h)` no sticky: isso deslocaria o palco todo e abriria uma faixa de fundo do documento acima dele durante a travagem.

## Verificar

* A pílula inteira legível ao entrar na seção, com o header em estado normal e em estado compacto.
* O palco continua ocupando a tela inteira, sem faixa nem salto no instante em que o sticky engata.
* As quatro etapas continuam centradas e nenhuma cena estoura para fora do palco.
* Abaixo de 1024px nada muda (o palco dirigido não existe lá).

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

### Comentário 1 — `fe0d74cc-45b5-48e4-ac2f-2c689641bdce`

- **createdAt:** 2026-08-26T19:42:44.025Z
- **updatedAt:** 2026-08-26T19:42:43.974Z
- **parentId:** null
- **resolvedAt:** null
- **quotedText:** null
- **author:** Maria Eduarda M Camargo (`d540a312-a721-479d-9da4-3b86ed7868ba`)
- **onBehalfOf:** null
- **attachments:** []



#### Corpo integral

Feito no commit `05b8c7b` — um único arquivo, `src/app/globals.css`.

**O que mudou:** `padding-top: var(--header-h)` em `.solutions-scroll[data-dirigindo] .solutions-sticky`.

**Por que resolve:** o palco centralizava dentro de 100svh inteiros, e a cápsula do cabeçalho, primeiro item da coluna, caía justo na faixa que o header fixo ocupa. Com o padding, a área útil passa a ser `100svh - --header-h` e o `justify-content: center` centraliza abaixo da barra. Como `box-sizing` é `border-box` (preflight do Tailwind), a altura do palco não cresceu — logo a trilha de 400vh e o `margin-top: -100svh` que a compensa continuam válidos, sem recálculo.

**Por que padding e não `top`:** `top: var(--header-h)` deslocaria o sticky inteiro e abriria uma faixa do fundo do documento acima do palco durante a travagem.

**Por que a variável e não um número:** o `Header` reescreve `--header-h` ao compactar (88px → 68px, `Header.tsx:55`), então o espaço reservado acompanha a barra em vez de ficar sobrando 20px depois da compactação.

Nada mudou abaixo de 1024px — a regra vive dentro do `@media (min-width: 1024px)` do palco dirigido. Servidor responde 200. Falta a conferência no navegador: cápsula inteira legível com o header nos dois estados, e nenhum salto no instante em que o sticky engata.



## Falhas / lacunas

- Nenhuma falha de download ou paginação neste arquivo.
