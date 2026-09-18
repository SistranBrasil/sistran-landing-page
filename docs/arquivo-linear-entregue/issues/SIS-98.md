# SIS-98 — Seção “Nossa essência”: só dá para ler parte da Missão — o scroll já abre o próximo item

- **Data da exportação:** 2026-09-15T20:51:00.000Z
- **Modo:** somente leitura (`get_issue` + `list_comments`); nada foi alterado no Linear
- **Origem Linear:** https://linear.app/sistran-labs/issue/SIS-98/secao-nossa-essencia-so-da-para-ler-parte-da-missao-o-scroll-ja-abre-o
- **get_issue:** includeRelations=true, includeCustomerNeeds=true, includeReleases=true
- **list_comments:** limit=250, orderBy=createdAt

## Metadados

```json
{
  "id": "SIS-98",
  "uuid": "45d56958-490d-4251-a94e-e422f25d7919",
  "title": "Seção “Nossa essência”: só dá para ler parte da Missão — o scroll já abre o próximo item",
  "priority": {
    "value": 0,
    "name": "No priority"
  },
  "url": "https://linear.app/sistran-labs/issue/SIS-98/secao-nossa-essencia-so-da-para-ler-parte-da-missao-o-scroll-ja-abre-o",
  "gitBranchName": "meduardamcp/sis-98-secao-nossa-essencia-so-da-para-ler-parte-da-missao-o-scroll",
  "createdAt": "2026-09-01T20:05:20.311Z",
  "updatedAt": "2026-09-15T20:33:35.254Z",
  "archivedAt": null,
  "completedAt": null,
  "startedAt": "2026-09-01T20:29:37.993Z",
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
      "startedAt": "2026-09-01T20:05:20.311Z",
      "endedAt": "2026-09-01T20:29:38.013Z"
    },
    {
      "state": {
        "id": "5f40aa5d-3589-452e-8bff-8f2539a4fd24",
        "name": "In Progress",
        "type": "started"
      },
      "startedAt": "2026-09-01T20:29:38.013Z",
      "endedAt": "2026-09-01T20:42:40.547Z"
    },
    {
      "state": {
        "id": "95119256-352d-4f0c-b5ae-695c7d838974",
        "name": "Done",
        "type": "completed"
      },
      "startedAt": "2026-09-01T20:42:40.547Z",
      "endedAt": "2026-09-15T20:33:35.247Z"
    },
    {
      "state": {
        "id": "dbb9dfbe-2cc4-423a-862f-94ca7705f813",
        "name": "Entregue",
        "type": "started"
      },
      "startedAt": "2026-09-15T20:33:35.247Z",
      "endedAt": null
    }
  ]
}
```

## Descrição original

## Problema

Na seção **Nossa essência — "O que sustenta nossa forma de atuar"**, o item **Missão** não pode ser lido por inteiro:

* o conteúdo aparece cortado (o texto "Oferecer soluções de negócios escaláveis, de baixo TCO\*, baseadas em tecnologia para companhias de Seguros…" é interrompido no rodapé da viewport);
* ao rolar para continuar lendo, **o próximo item já abre** — o scroll é capturado pela troca de item em vez de rolar o conteúdo do item aberto.

Ou seja: o gesto de "ler mais" está sendo interpretado como "avançar".

## Comportamento desejado

O usuário lê o item aberto do começo ao fim e só depois avança.

* O painel aberto precisa caber na viewport (ou rolar por conta própria) antes de qualquer troca de item.
* A troca para o próximo item só dispara depois que o conteúdo atual terminou.
* Alternativa mais simples e robusta, se o efeito de troca por scroll não for essencial: transformar em **acordeão por clique** — sem sequestro de scroll.

## Possíveis causas

* Altura fixa (`100vh`/`100dvh`) no painel enquanto o conteúdo é maior que ela → sobra texto sem rolagem.
* Scroll hijack / pin do ScrollTrigger com `end` curto demais: o trecho de scroll reservado ao item é menor que o conteúdo.
* Falta de `overflow-y: auto` no painel aberto.

## Observação separada

O título **"Missão" aparece duplicado**: uma vez como cabeçalho do acordeão (com a linha e a seta) e outra como título grande dentro do painel. Definir qual permanece.

## Pontos de atenção

* Notebooks de 1366×768 e telas menores são onde o corte fica mais grave — testar nessas alturas, não só em monitor grande.
* Repetir a verificação nos demais itens da seção (Visão, Valores etc.), não só na Missão.
* Com `prefers-reduced-motion`, todo o conteúdo dos itens deve continuar alcançável.
* Navegação por teclado: seta/Tab deve abrir e percorrer os itens sem depender de scroll.

## Critérios de aceite

- [ ] É possível ler a Missão inteira sem que o próximo item abra
- [ ] Painel aberto cabe na viewport ou rola internamente
- [ ] Troca de item só ocorre após o fim do conteúdo atual
- [ ] Título "Missão" não aparece duplicado
- [ ] Verificado em 1920×1080, 1366×768 e mobile
- [ ] Conteúdo alcançável com `prefers-reduced-motion: reduce`
- [ ] Itens operáveis por teclado

## Relações / Anexos / Releases / Customer needs

### Relações

```json
{
  "blocks": [],
  "blockedBy": [],
  "relatedTo": [
    {
      "id": "SIS-79",
      "title": "Nossa essência: Missão, Valores e Pilares abrindo conforme a rolagem passa"
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

### Comentário 1 — `262d7aae-fc49-4964-893a-fe7acad34692`

- **createdAt:** 2026-09-01T20:42:35.755Z
- **updatedAt:** 2026-09-01T20:42:35.726Z
- **parentId:** null
- **resolvedAt:** null
- **quotedText:** null
- **author:** Maria Eduarda M Camargo (`d540a312-a721-479d-9da4-3b86ed7868ba`)
- **onBehalfOf:** null
- **attachments:** []



#### Corpo integral

Resolvido em `src/components/EssenceAccordion.tsx` e `src/components/essence-accordion.css`.

**Causa raiz:** `ativa` tinha dois donos. Além do clique, um ScrollTrigger derivava a faixa aberta da posição de rolagem (entregue no SIS-79). Como a seção mede mais de uma tela, o painel aberto fica abaixo da dobra — e o gesto de "continuar lendo a Missão" era o MESMO gesto que trocava para Valores. Não é ajuste de `end` nem de folga: qualquer trecho de rolagem gasto lendo é trecho que avança a faixa. O avanço por rolagem saiu; o dono de `ativa` volta a ser só o clique/teclado.

**Duas causas secundárias corrigidas junto:**
- `min-height: 430px` fixo + até 172px de padding passava de 600px de painel. Num 1366×768, com as três faixas (~350px) e o cabeçalho fixo, a Missão terminava cortada no rodapé. Agora `min(430px, 43vh)`, mais um bloco `@media (min-width: 768px) and (max-height: 860px)` que encolhe só o respiro — nenhuma media query de LARGURA pega um notebook de 768px de altura.
- O `h3` dentro do painel repetia o título da faixa em corpo grande na mesma tela (e para o leitor de tela, que já recebe o painel via `aria-labelledby`). Removido.

**Abrir uma faixa agora traz a faixa para a tela** em qualquer largura, via `__lenis.scrollTo` (o Lenis ignora `window.scrollTo` feito por fora — medido, a página não saía do lugar e os Pilares paravam em `top: -295`). A medição espera a transição de altura do CSS fechar a faixa anterior; num `requestAnimationFrame` o botão estava ~490px mais abaixo e a rolagem passava exatamente essa distância. Se a faixa já está em posição de leitura, nada rola.

**Medido em build de produção, 1366×768:**
- Missão: texto 230→324, nota termina em 415 (janela 768).
- Pilares após clique: painel 254→743, último pilar em 675.
- Faixa não troca sozinha em 10 passos de roda — em 1920×1080, 1366×768, 390×844 e 1366×768 com movimento reduzido.
- 0 `h3` nos painéis, ArrowDown abre Valores, os três conteúdos alcançáveis, 0 erro de console.
- `tsc --noEmit` limpo; lint 25 avisos / 0 erros (baseline).


## Falhas / lacunas

- Nenhuma falha de download ou paginação neste arquivo.
