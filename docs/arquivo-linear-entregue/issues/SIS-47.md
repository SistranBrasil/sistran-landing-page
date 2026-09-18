# SIS-47 — Soluções de Negócios: melhorar o remate final da linha de processo

- **Data da exportação:** 2026-09-15T20:51:00.000Z
- **Modo:** somente leitura (`get_issue` + `list_comments`); nada foi alterado no Linear
- **Origem Linear:** https://linear.app/sistran-labs/issue/SIS-47/solucoes-de-negocios-melhorar-o-remate-final-da-linha-de-processo
- **get_issue:** includeRelations=true, includeCustomerNeeds=true, includeReleases=true
- **list_comments:** limit=250, orderBy=createdAt

## Metadados

```json
{
  "id": "SIS-47",
  "uuid": "24c3b658-3479-4e92-809d-f80c7ffefa7f",
  "title": "Soluções de Negócios: melhorar o remate final da linha de processo",
  "priority": {
    "value": 0,
    "name": "No priority"
  },
  "url": "https://linear.app/sistran-labs/issue/SIS-47/solucoes-de-negocios-melhorar-o-remate-final-da-linha-de-processo",
  "gitBranchName": "meduardamcp/sis-47-solucoes-de-negocios-melhorar-o-remate-final-da-linha-de",
  "createdAt": "2026-08-26T19:36:56.307Z",
  "updatedAt": "2026-09-15T20:33:35.972Z",
  "archivedAt": null,
  "completedAt": null,
  "startedAt": "2026-09-15T20:33:35.934Z",
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
      "startedAt": "2026-08-26T19:36:56.307Z",
      "endedAt": "2026-08-26T20:01:44.533Z"
    },
    {
      "state": {
        "id": "95119256-352d-4f0c-b5ae-695c7d838974",
        "name": "Done",
        "type": "completed"
      },
      "startedAt": "2026-08-26T20:01:44.533Z",
      "endedAt": "2026-09-15T20:33:35.959Z"
    },
    {
      "state": {
        "id": "dbb9dfbe-2cc4-423a-862f-94ca7705f813",
        "name": "Entregue",
        "type": "started"
      },
      "startedAt": "2026-09-15T20:33:35.959Z",
      "endedAt": null
    }
  ]
}
```

## Descrição original

O fim da linha está feio: ela corre até um pouco depois do último nó e **corta reto**, no meio da foto, sem remate. O último nó (o `check`) fica solto, com o traço saindo dos dois lados dele.

## O que fazer

Dar um fecho à linha. Direções possíveis — escolher uma e justificar no comentário de fechamento:

* a linha **termina no último nó**, sem sobra à direita, e o nó final ganha um tratamento de chegada (anel mais forte, halo, preenchimento);
* ou o traço se **dissolve** à direita, com máscara/degradê, em vez de cortar em aresta;
* ou faz uma **curva de saída** simétrica à curva de entrada que já existe do lado esquerdo, saindo do quadro.

## Contexto técnico

O caminho é montado em `src/components/Solutions.tsx` (`caminho`), e hoje termina em `nos[5] + geo.pw * 0.05` — sobra deliberada à direita do último nó, que é justamente o que produz o corte. O desenho progressivo vive no CSS via `stroke-dashoffset` com `pathLength={1}`, então mexer no fim do `d` não quebra a animação.

## Depende de

<issue><issue id="c95d5fe7-97dd-4ece-a6e3-937be291093a" href="https://linear.app/sistran-labs/issue/SIS-45/solucoes-de-negocios-a-linha-de-processo-passa-a-ter-4-nos-um-por-card">SIS-45</issue></issue> — com quatro nós a posição do último muda, e o remate tem de ser calculado sobre a nova distribuição.

## Restrições

Decoração `aria-hidden`. Coordenadas medidas, nunca px fixos. Paleta da marca: azuis e ciano, sem violeta.

## Validação

Nas quatro etapas, em desktop largo e estreito: o fim da linha não deve parecer cortado, nem invadir o cartão descritivo, nem passar por cima do rosto de ninguém na foto.

## Relações / Anexos / Releases / Customer needs

### Relações

```json
{
  "blocks": [],
  "blockedBy": [],
  "relatedTo": [
    {
      "id": "SIS-42",
      "title": "Soluções de Negócios: tirar os \"pulinhos\" na troca de cena durante o scroll"
    },
    {
      "id": "SIS-48",
      "title": "Soluções de Negócios: a pílula do cabeçalho fica escondida atrás do header fixo"
    },
    {
      "id": "SIS-45",
      "title": "Soluções de Negócios: a linha de processo passa a ter 4 nós, um por card, e acende o da etapa"
    },
    {
      "id": "SIS-51",
      "title": "Transição: componente que interliga Soluções de Negócios a Sistran em números"
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

### Comentário 1 — `392ed8d5-c6bc-401b-b097-bbf3847ac6c9`

- **createdAt:** 2026-08-26T20:02:05.004Z
- **updatedAt:** 2026-08-26T20:02:04.953Z
- **parentId:** null
- **resolvedAt:** null
- **quotedText:** null
- **author:** Maria Eduarda M Camargo (`d540a312-a721-479d-9da4-3b86ed7868ba`)
- **onBehalfOf:** null
- **attachments:** []



#### Corpo integral

Done — commit `995ad2c`.

**Direção escolhida: a segunda (dissolver), combinada com a primeira.** O caminho principal passou a terminar exactamente em `nos[nos.length - 1]` — sem a sobra de 5% que produzia o corte —, e o cap redondo do `stroke-linecap` fica escondido debaixo do círculo do nó, que tem 52px. Logo o último nó passa a ser chegada, não um ponto com traço saindo dos dois lados.

A curva de saída simétrica (terceira opção) foi descartada de propósito: a curva de entrada existe porque a linha precisa vir de fora do quadro, do item da navegação, até a altura da foto. Espelhá-la à direita sugeriria que o percurso continua para algum lugar, e não continua — depois da quarta solução não há quinta.

**O remate.** Um path próprio, `.solutions-fio-remate`, sai do último nó, sobe suavemente (`-7.5%` e depois `-11%` da altura medida da foto) e vai até 99.5% da largura, pintado com `url(#solutions-fio-fim)` — degradê `#0ed8f6` a 0.55 de alfa na emenda, `#66caf4` a 0.22 no meio, alfa zero na ponta. O degradê é `gradientUnits="userSpaceOnUse"` com as coordenadas do próprio viewBox: em `objectBoundingBox` o `preserveAspectRatio="none"` do svg o esticaria junto da caixa. Sem `stroke-linecap: round` neste traço, ao contrário dos outros dois — a ponta chega a alfa zero, e uma ponta redonda invisível não serve de nada.

Path separado, e não mais um segmento do `d` do caminho, por dois motivos mecânicos: no mesmo traço o degradê pintaria o fio inteiro, e o desenho progressivo (`stroke-dashoffset` com `pathLength={1}`) mediria o remate como se fosse etapa, atrasando a chegada ao último nó.

O remate fica em `opacity: 0.4` e acende em cheio só quando `ativo === total - 1`, via `data-fim` (transição de 520ms, mesma curva da seção). Nas três primeiras etapas é continuação prometida; na quarta, dissipação.

**Restrições.** Tudo em fração de `geo.pw`/`geo.ph` medidos — nenhum px fixo. Só ciano e azul da marca. Continua dentro do `.solutions-fio`, que é `aria-hidden` e `pointer-events: none`. A subida de 11% afasta o remate do cartão descritivo, que ocupa o terço inferior.

Verificado: `tsc --noEmit` limpo, `eslint` limpo, servidor em 200.

Com isto fecham as seis tasks da seção (SIS-42 a SIS-47) mais a SIS-48. Falta só a passagem no navegador — as quatro etapas em desktop largo e estreito, para confirmar que o remate não invade o cartão nem cai sobre o rosto de ninguém na foto — que reporto aqui se algo aparecer.


## Falhas / lacunas

- Nenhuma falha de download ou paginação neste arquivo.
