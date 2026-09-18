# SIS-37 — Soluções de Negócios: aproximar a composição da referência (palco, linha de processo e cartão)

- **Data da exportação:** 2026-09-15T20:51:00.000Z
- **Modo:** somente leitura (`get_issue` + `list_comments`); nada foi alterado no Linear
- **Origem Linear:** https://linear.app/sistran-labs/issue/SIS-37/solucoes-de-negocios-aproximar-a-composicao-da-referencia-palco-linha
- **get_issue:** includeRelations=true, includeCustomerNeeds=true, includeReleases=true
- **list_comments:** limit=250, orderBy=createdAt

## Metadados

```json
{
  "id": "SIS-37",
  "uuid": "7194b9b5-363f-4792-91fc-6e8a6eab0e4d",
  "title": "Soluções de Negócios: aproximar a composição da referência (palco, linha de processo e cartão)",
  "priority": {
    "value": 0,
    "name": "No priority"
  },
  "url": "https://linear.app/sistran-labs/issue/SIS-37/solucoes-de-negocios-aproximar-a-composicao-da-referencia-palco-linha",
  "gitBranchName": "meduardamcp/sis-37-solucoes-de-negocios-aproximar-a-composicao-da-referencia",
  "createdAt": "2026-08-26T17:42:05.816Z",
  "updatedAt": "2026-09-15T20:33:41.071Z",
  "archivedAt": null,
  "completedAt": null,
  "startedAt": "2026-09-15T20:33:41.053Z",
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
      "startedAt": "2026-08-26T17:42:05.816Z",
      "endedAt": "2026-08-26T17:45:46.292Z"
    },
    {
      "state": {
        "id": "95119256-352d-4f0c-b5ae-695c7d838974",
        "name": "Done",
        "type": "completed"
      },
      "startedAt": "2026-08-26T17:45:46.292Z",
      "endedAt": "2026-09-15T20:33:41.065Z"
    },
    {
      "state": {
        "id": "dbb9dfbe-2cc4-423a-862f-94ca7705f813",
        "name": "Entregue",
        "type": "started"
      },
      "startedAt": "2026-09-15T20:33:41.065Z",
      "endedAt": null
    }
  ]
}
```

## Descrição original

Aproximar a seção da imagem de referência, sem trocar de conceito e sem mexer em texto ou em outras seções.

**Defeitos corrigidos**

* Palco pequeno demais e composição espalhada: caixa passa a `min(92vw, 1640px)`, colunas assimétricas 29/71 (34/66 no tablet), gap 48–72px.
* Título quebrando em duas linhas: `white-space: nowrap` a partir de 1280px, com a quebra preservada abaixo disso para não transbordar.
* Cartão descritivo grande demais, cobrindo metade da imagem: agora `width: 78%; left: -6%; bottom: -24px; min-height: 210px` — só o terço inferior da foto.
* Conector que não atravessava certo: era um SVG separado posicionado por número mágico (`(indice - 1.5) * 63px`), que errava a altura assim que o título do item 01 quebrava em três linhas. Substituído por **um** caminho SVG só, com as coordenadas medidas do item ativo e da janela da foto (`ResizeObserver`), `preserveAspectRatio="none"` + `vector-effect="non-scaling-stroke"`.
* Ícones de processo fora da foto: seis nós de 52px sobre a imagem, distribuídos e alinhados à linha, um único aceso por vez. São spans HTML posicionados em % — `<circle>` viraria elipse sob escala não uniforme.
* Hierarquia e profundidade: molduras recuadas 22px/42px só com borda, véu navy nas bordas, sombra ampla, `z-index` numa faixa só.

**Fundo e decoração**: dois focos radiais + degradê `115deg #0875c5 → #075aab → #032d67`, grade técnica de 64px em opacidade 0.05, curva técnica no canto inferior esquerdo e coordenadas em opacidade mínima. As emendas <issue id="a4709f0b-4901-4ec6-9170-e6368d7d6479" href="https://linear.app/sistran-labs/issue/SIS-32/emendas-entre-secoes-nenhuma-troca-de-fundo-com-corte-seco">SIS-32</issue> (branco do mosaico entrando, `#004d8a` saindo para o MetricsStrip) foram preservadas no topo da pilha de camadas.

**Movimento**: continua um único `ScrollTrigger` do GSAP (nenhuma biblioteca nova), sticky de 100svh sobre trilha de 400vh, índice de `floor(progress * 4)` — sempre um inteiro só. Desenho da linha por `stroke-dashoffset` com `pathLength=1`, uma vez por etapa; cascata dos nós a 85ms; cartão entra 22px de baixo e sai 10px para cima; cascata interna do cartão a 55ms. A única animação contínua é o pulso de 2.8s do nó aceso.

**Acessibilidade**: itens laterais são `<button>` de verdade com `aria-current="step"`, setas do teclado navegam, mobile vira trilho horizontal rolável (os quatro conteúdos continuam alcançáveis), movimento reduzido cai em fluxo natural com fade curto e nada preso em `opacity: 0`.

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

### Comentário 1 — `a216b076-538e-4495-bf1b-dc4f09ff8665`

- **createdAt:** 2026-08-26T17:46:03.854Z
- **updatedAt:** 2026-08-26T17:46:03.818Z
- **parentId:** null
- **resolvedAt:** null
- **quotedText:** null
- **author:** Maria Eduarda M Camargo (`d540a312-a721-479d-9da4-3b86ed7868ba`)
- **onBehalfOf:** null
- **attachments:** []



#### Corpo integral

Backlog → Done no commit `9398cae`.

**Arquivos**: `src/components/Solutions.tsx` (reescrito) e `src/app/globals.css` (bloco da seção, 704 linhas → 873).

**O que foi feito**
- Composição: caixa `min(92vw, 1640px)`, colunas 29/71 (34/66 no tablet), gap `clamp(32px, 4vw, 72px)`, título com `white-space: nowrap` a partir de 1280px, cartão em 78% cobrindo só o terço inferior da foto, molduras recuadas 22px/42px só com borda.
- Linha de processo: as quatro ilustrações por índice (`CenaOverlay`) e o `.solution-conector` posicionado por `(indice - 1.5) * 63px` saíram. Agora é **um** caminho SVG com as coordenadas medidas por `ResizeObserver` (guarda de 0.5px no `setState`, senão os floats do `getBoundingClientRect` fazem render infinito) e seis nós. Nós são spans HTML em %: sob `preserveAspectRatio="none"` um `<circle>` viraria elipse.
- `key={ativo}` no invólucro do fio: o desenho e a cascata rodam uma vez por etapa em vez de reiniciarem sem parar; mudança de geometria não remonta, porque a chave não muda.
- Fundo, movimento e acessibilidade conforme a descrição. Nenhuma dependência nova — segue no GSAP/ScrollTrigger que a seção já usava, com um `ScrollTrigger` só e sticky sobre trilha de 400vh.

**Verificação**
- `tsc --noEmit` limpo e `eslint` limpo. Um aviso apareceu no caminho e foi corrigido: `react-hooks/set-state-in-effect` no `setGeo(null)` do ramo `!dirigindo` — o reset saiu (a renderização já exige `dirigindo && geo`), com comentário explicando.
- `grep` confirma zero referências restantes a `solution-overlay`, `solution-conector`, `CenaOverlay` e `solution-pulso`.
- Home responde 200 e o HTML servido traz a composição nova.

**Limitações reais**
1. A validação até aqui é estática — HTML servido, CSS, lint, typecheck e HTTP 200 nas imagens. As quatro etapas de scroll, o scroll rápido nos dois sentidos, os cliques do menu, os três tamanhos de tela e o `prefers-reduced-motion` precisam de conferência no navegador.
2. A linha de processo só é desenhada no palco dirigido (`dirigindo && geo`). No mobile e em movimento reduzido ela está **ausente**, não "restrita ao interior da foto" como o pedido descrevia. É decoração `aria-hidden`, então nenhum conteúdo se perde — mas é diferença em relação ao especificado, e cabe uma issue própria se quiser a versão mobile da linha.


## Falhas / lacunas

- Nenhuma falha de download ou paginação neste arquivo.
