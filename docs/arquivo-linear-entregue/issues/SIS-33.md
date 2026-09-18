# SIS-33 — Hero: nascer do fio condutor e entregar o movimento para o mosaico

- **Data da exportação:** 2026-09-15T20:51:00.000Z
- **Modo:** somente leitura (`get_issue` + `list_comments`); nada foi alterado no Linear
- **Origem Linear:** https://linear.app/sistran-labs/issue/SIS-33/hero-nascer-do-fio-condutor-e-entregar-o-movimento-para-o-mosaico
- **get_issue:** includeRelations=true, includeCustomerNeeds=true, includeReleases=true
- **list_comments:** limit=250, orderBy=createdAt

## Metadados

```json
{
  "id": "SIS-33",
  "uuid": "e0bd4d77-1334-4cd2-a8ba-bcc5e45b6c40",
  "title": "Hero: nascer do fio condutor e entregar o movimento para o mosaico",
  "priority": {
    "value": 0,
    "name": "No priority"
  },
  "url": "https://linear.app/sistran-labs/issue/SIS-33/hero-nascer-do-fio-condutor-e-entregar-o-movimento-para-o-mosaico",
  "gitBranchName": "meduardamcp/sis-33-hero-nascer-do-fio-condutor-e-entregar-o-movimento-para-o",
  "createdAt": "2026-08-26T14:59:53.727Z",
  "updatedAt": "2026-09-15T20:33:39.713Z",
  "archivedAt": null,
  "completedAt": null,
  "startedAt": "2026-09-15T20:33:39.693Z",
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
      "startedAt": "2026-08-26T14:59:53.727Z",
      "endedAt": "2026-08-26T15:28:28.445Z"
    },
    {
      "state": {
        "id": "95119256-352d-4f0c-b5ae-695c7d838974",
        "name": "Done",
        "type": "completed"
      },
      "startedAt": "2026-08-26T15:28:28.445Z",
      "endedAt": "2026-09-15T20:33:39.707Z"
    },
    {
      "state": {
        "id": "dbb9dfbe-2cc4-423a-862f-94ca7705f813",
        "name": "Entregue",
        "type": "started"
      },
      "startedAt": "2026-09-15T20:33:39.707Z",
      "endedAt": null
    }
  ]
}
```

## Descrição original

Ponto de partida do percurso. O `HeroCinematic` (`src/components/HeroCinematic.tsx`, `id="top"`) já encolhe e vira card sobre fundo claro; falta ele ser o **início** do fio condutor (<issue id="1fb248bf-b46d-4bda-80a4-cd9b9e5fb0fc" href="https://linear.app/sistran-labs/issue/SIS-30/fio-condutor-componente-que-costura-hero-contato-desenhado-pelo-scroll">SIS-30</issue>) em vez de um bloco isolado, e falta o convite a rolar.

## O que muda

1. **O fio nasce no hero.** O primeiro nó do fio ancora no hero e a linha começa a ser desenhada já no primeiro gesto de scroll — é o que dá a leitura de "um percurso só" desde a primeira tela.
2. **Cue de rolagem.** Indicação discreta de que há percurso abaixo (seta/linha que pulsa), que desaparece ao primeiro scroll. **Irmã do bloco** `sticky`**, nunca filha** do que anima em `scale`: `position: fixed` morre sob ancestral com `transform`.
3. **Entrega para o mosaico.** O card do hero termina sobre fundo claro justamente para colar no mosaico sem corte — conferir que continua verdade depois da SIS de emendas, e que o fio atravessa essa fronteira sem sumir (`overflow: hidden` em qualquer ancestral corta a travessia; usar `clip`).

## Não mexer

* O percurso de scroll do hero em si (encolher-e-virar-card) está entregue e aprovado — esta task **acrescenta** o fio e o cue, não redesenha o hero.
* Modal de contato e o botão "Veja como a Sistran pode ajudar" (que agora aponta para `#solucoes`, existente desde a <issue id="b84525cf-6a3b-437c-891a-77c23bbfb87a" href="https://linear.app/sistran-labs/issue/SIS-28/trazer-o-teatro-de-solucoes-de-negocios-para-o-lugar-do-metodo">SIS-28</issue>).

## Movimento reduzido

O cue é decoração: sob `prefers-reduced-motion` ele fica estático ou sai. Mesma árvore de DOM no SSR e na hidratação.

## Validação

* Carregar a home e **não** rolar: título legível, cue visível, nada preso em `opacity: 0`.
* Primeiro gesto de scroll: o fio começa a desenhar e o cue sai.
* Rolar até o mosaico e voltar: a emenda hero → mosaico não pisca nem corta o fio.
* `npx tsc --noEmit` (filtrando `sistran-river-park-3d`) e `npx eslint`.

## Relações / Anexos / Releases / Customer needs

### Relações

```json
{
  "blocks": [],
  "blockedBy": [],
  "relatedTo": [
    {
      "id": "SIS-32",
      "title": "Emendas entre seções: nenhuma troca de fundo com corte seco"
    },
    {
      "id": "SIS-30",
      "title": "Fio condutor: componente que costura hero → contato, desenhado pelo scroll"
    },
    {
      "id": "SIS-28",
      "title": "Trazer o teatro de \"Soluções de Negócios\" para o lugar do Método"
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

### Comentário 1 — `3d1dab58-00af-427d-8ddd-c8c798c644b4`

- **createdAt:** 2026-08-26T15:27:38.668Z
- **updatedAt:** 2026-08-26T15:27:38.642Z
- **parentId:** null
- **resolvedAt:** null
- **quotedText:** null
- **author:** Maria Eduarda M Camargo (`d540a312-a721-479d-9da4-3b86ed7868ba`)
- **onBehalfOf:** null
- **attachments:** []



#### Corpo integral

**Sem alteração de código — verificada como já satisfeita.** Registro do que foi conferido, item por item:

- **O fio nasce no hero.** A primeira parada do `ScrollSpine` é `#top`, e a linha viva começa a ser desenhada a partir de `--scroll-p = 0` — ou seja, do primeiro pixel de scroll, dentro do hero. Entregue em SIS-30 (`c2b1d63`).
- **A dica de scroll (`.hero-cue`) já está correta.** Ela é **irmã** da cena sticky, nunca filha do nó que sofre `scale` — se estivesse dentro, herdaria a escala e a legenda deformaria junto com o card. E ela já desaparece sozinha, por `useScrollOpacity`.
- **A emenda hero → mosaico foi deixada intocada de propósito** em SIS-32: o hero encolhe em card sobre fundo claro e entrega a cor do mosaico por conta própria. Pôr camada de costura ali seria pintar por cima de uma emenda que já funciona.

Nada a implementar. Fechando para não deixar uma task aberta sugerindo trabalho pendente onde não há.


## Falhas / lacunas

- Nenhuma falha de download ou paginação neste arquivo.
