# SIS-38 — Home: o tile "Arquitetura modular e escalável" atravessa o scroll até virar a foto do card 01 de Soluções

- **Data da exportação:** 2026-09-15T20:51:00.000Z
- **Modo:** somente leitura (`get_issue` + `list_comments`); nada foi alterado no Linear
- **Origem Linear:** https://linear.app/sistran-labs/issue/SIS-38/home-o-tile-arquitetura-modular-e-escalavel-atravessa-o-scroll-ate
- **get_issue:** includeRelations=true, includeCustomerNeeds=true, includeReleases=true
- **list_comments:** limit=250, orderBy=createdAt

## Metadados

```json
{
  "id": "SIS-38",
  "uuid": "9297cc9e-c820-4288-b32d-f572006ac402",
  "title": "Home: o tile \"Arquitetura modular e escalável\" atravessa o scroll até virar a foto do card 01 de Soluções",
  "priority": {
    "value": 0,
    "name": "No priority"
  },
  "url": "https://linear.app/sistran-labs/issue/SIS-38/home-o-tile-arquitetura-modular-e-escalavel-atravessa-o-scroll-ate",
  "gitBranchName": "meduardamcp/sis-38-home-o-tile-arquitetura-modular-e-escalavel-atravessa-o",
  "createdAt": "2026-08-26T18:31:01.000Z",
  "updatedAt": "2026-09-15T20:33:39.253Z",
  "archivedAt": null,
  "completedAt": null,
  "startedAt": "2026-09-15T20:33:39.225Z",
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
      "startedAt": "2026-08-26T18:31:01.000Z",
      "endedAt": "2026-08-26T18:34:57.649Z"
    },
    {
      "state": {
        "id": "95119256-352d-4f0c-b5ae-695c7d838974",
        "name": "Done",
        "type": "completed"
      },
      "startedAt": "2026-08-26T18:34:57.649Z",
      "endedAt": "2026-09-15T20:33:39.245Z"
    },
    {
      "state": {
        "id": "dbb9dfbe-2cc4-423a-862f-94ca7705f813",
        "name": "Entregue",
        "type": "started"
      },
      "startedAt": "2026-09-15T20:33:39.245Z",
      "endedAt": null
    }
  ]
}
```

## Descrição original

O tile "Arquitetura modular e escalável" e a foto do card 01 de "Soluções de Negócios" já são a mesma imagem (`/images/home/escritoriosp.jpg`, <issue id="78dd9e73-c49c-4ce0-8b65-1731b055e3c1" href="https://linear.app/sistran-labs/issue/SIS-36/solucoes-de-negocios-plugar-as-quatro-fotos-e-emendar-com-o-mosaico">SIS-36</issue>), mas a passagem entre as duas seções é um corte: o tile fica parado no mosaico e a foto aparece no palco.

## O que fazer

Fazer o tile descer com o scroll e pousar exatamente sobre a janela da foto do card 01, num percurso contínuo.

## Como

Novo componente decorativo `src/components/ui/MosaicHandoff.tsx`, montado em `src/app/page.tsx` **depois** de `<Solutions />` e irmão direto das duas seções.

* Um elemento `position: fixed`, deslocado por `transform`, com largura e altura em px — a proporção muda no caminho (o tile é retrato, a janela é 16/9), e só variando a caixa o `object-fit: cover` reenquadra corretamente. `scale` esmagaria a foto.
* Origem e destino são **medidos**, marcados por `data-carrier-origem` (face do tile em `StackScenes`) e `data-carrier-alvo` (janela do card 01 em `Solutions`). Nenhuma coordenada estimada.
* O relógio é a própria seção de destino: enquanto `#solucoes` não encosta no topo da janela a foto desce com a página; quando encosta, trava. Logo o topo final da foto é `retânguloAtual.top − secao.top`, e o progresso é o quanto falta de `secao.top` para zero.
* A troca no fim é invisível porque a imagem é a mesma: basta apagar o viajante para a foto real assumir. Nenhuma opacidade da seção precisa ser mexida.
* Um `requestAnimationFrame` por rajada de scroll, sem `setInterval`, sem medição por pixel, sem re-render — o estado vive no estilo do viajante.

## Restrições

* Nada de biblioteca nova.
* Só a partir de 1024px e com movimento permitido: abaixo disso, ou com `prefers-reduced-motion`, o tile fica no mosaico e a foto no palco, como hoje.
* Decorativo e `aria-hidden`: nenhum conteúdo depende do efeito.
* Não alterar textos, nem as outras seções, nem o modal de contato.

## Validação

Lint, verificação de tipos, e conferir no navegador que o tile sai do mosaico, desce e pousa alinhado à foto, sem salto na emenda e sem passar por baixo do fundo de Soluções.

## Relações / Anexos / Releases / Customer needs

### Relações

```json
{
  "blocks": [],
  "blockedBy": [],
  "relatedTo": [
    {
      "id": "SIS-36",
      "title": "Soluções de Negócios: plugar as quatro fotos e emendar com o mosaico"
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

`list_comments`: `limit` 250, `orderBy` createdAt, `hasNextPage` false. Total: 2. Ordenados aqui por `createdAt` crescente (a API devolveu o mais novo primeiro).

### Comentário 1 — `a0bd577a-b2e4-46ef-ab3b-4dbf26fd95c2`

- **createdAt:** 2026-08-26T18:35:14.877Z
- **updatedAt:** 2026-08-26T18:35:14.862Z
- **parentId:** null
- **resolvedAt:** null
- **quotedText:** null
- **author:** Maria Eduarda M Camargo (`d540a312-a721-479d-9da4-3b86ed7868ba`)
- **onBehalfOf:** null
- **attachments:** []



#### Corpo integral

Movida de Backlog para **Done** no commit `e55649f`.

**O que foi feito**
- `src/components/ui/MosaicHandoff.tsx` (novo): o viajante. `position: fixed`, deslocado por `translate3d`, com largura/altura em px — a proporção muda no caminho (tile retrato → janela 16/9) e só a mudança real de caixa deixa o `object-fit: cover` reenquadrar; `scale` esmagaria a foto.
- `src/app/page.tsx`: montado **depois** de `<Solutions />` e irmão direto das duas seções. Dois motivos mecânicos: `position: fixed` morre sob ancestral com `transform`/`filter` (a home tem vários), e a ordem na árvore é o que faz o viajante pintar por cima do fundo de Soluções sem disputa de `z-index` (fica em `z-index: 30`, abaixo do cabeçalho em `z-50`).
- Marcas de medição: `data-carrier-origem` na face do tile (`legacy/StackScenes.tsx`) e `data-carrier-alvo` na janela do card 01 (`Solutions.tsx`). Nenhuma coordenada estimada.
- `src/app/globals.css`: bloco `.mosaic-handoff` / `-img` / `-rotulo`, mais `[data-carrier-origem] { opacity: var(--carrier-fonte, 1) }` — a origem só se apaga depois que o viajante está por cima dela.
- Relógio = a própria seção de destino: a foto está dentro de um `sticky`, então o topo final é `alvo.top − max(secao.top, 0)`, e o progresso é o quanto falta de `secao.top` para zero, numa janela de 1,25 tela.
- A troca no fim é invisível porque é a mesma imagem (`escritoriosp.jpg`) nas duas pontas: no fim do percurso caixa e conteúdo coincidem, então basta apagar o viajante. O tratamento de cor viaja igual (`saturate(.88) contrast(1.04) brightness(.78)`), então nada clareia na emenda.

**Restrições respeitadas**: nenhuma dependência nova; um `requestAnimationFrame` por rajada de scroll, sem `setInterval`, sem re-render; decorativo e `aria-hidden`; desligado abaixo de 1024px e com `prefers-reduced-motion` — nesses casos o tile fica no mosaico e a foto no palco, exatamente como antes.

**Validação**: `tsc --noEmit` limpo (filtrando o `sistran-river-park-3d` vendorizado, que não compila e é anterior a este trabalho), `eslint` limpo nos quatro arquivos, home em 200 e o HTML servido com exatamente uma marca `data-carrier-origem` e uma `data-carrier-alvo`.

**Limitação honesta**: a validação é estática. A conferência no navegador (tile saindo do mosaico, descida, pouso alinhado sem salto na emenda) ainda está pendente do lado de quem revisa.

**Nota lateral**: as fotos em `public/images/home/` não estavam versionadas (ficaram de fora de `9141420`) — corrigido em `bd30d61`, sem mudança de código. Num clone limpo as duas pontas da travessia apareceriam sem imagem.

### Comentário 2 — `685dc6f2-95f0-4e01-8dc5-e65ac158761f`

- **createdAt:** 2026-08-26T18:43:20.388Z
- **updatedAt:** 2026-08-26T18:43:20.351Z
- **parentId:** null
- **resolvedAt:** null
- **quotedText:** null
- **author:** Maria Eduarda M Camargo (`d540a312-a721-479d-9da4-3b86ed7868ba`)
- **onBehalfOf:** null
- **attachments:** []



#### Corpo integral

Ajuste em `48a2c42`, sobre o mesmo SIS-38 (a issue continua em Done — é correção do efeito já entregue, não escopo novo).

**Problema apontado**: durante a descida a foto do card 01 já estava visível no palco, então via-se a **mesma imagem duas vezes**, em dois tamanhos, uma dentro da outra. A travessia pousava certo, mas o destino não esperava.

**Correção**: o efeito passou a escrever `--carrier-destino` no `<html>`, contraparte de `--carrier-fonte`. A foto de destino fica apagada durante o percurso e acende nos últimos 6%, exatamente no intervalo em que o viajante se apaga — nesse ponto as duas caixas já coincidem, então a troca é uma imagem só mudando de dono.

**Detalhe que importa**: a opacidade vai em `[data-carrier-alvo] .solution-image` e `.solution-veu`, **nunca** na `.solution-viewport`. A opacidade da janela pertence à entrada em foco da cena no palco dirigido (`ativo` / `feito` / `proximo`) e sobrescrevê-la mataria aquela transição. A caixa navy continua desenhada por baixo do viajante: se o efeito for interrompido no meio (resize, movimento reduzido, desmontagem) não sobra buraco — `desligar()` devolve as duas pontas a 1.

`tsc` e `eslint` limpos, home em 200.


## Falhas / lacunas

- Nenhuma falha de download ou paginação neste arquivo.
