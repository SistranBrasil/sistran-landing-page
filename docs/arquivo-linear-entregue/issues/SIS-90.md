# SIS-90 — Seção “Alta Performance e Comprometimento”: mover imagem para a esquerda do texto, reduzir o texto e transicionar

- Arquivo Linear (lote F), somente leitura
- Data de exportação: 2026-09-15T20:51:00.000Z
- URL: https://linear.app/sistran-labs/issue/SIS-90/secao-alta-performance-e-comprometimento-mover-imagem-para-a-esquerda

## Metadados

- id: SIS-90
- uuid: 2f422022-7c12-442e-8a4f-31b9cfdfea9b
- title: Seção “Alta Performance e Comprometimento”: mover imagem para a esquerda do texto, reduzir o texto e transicionar
- priority.value: 0
- priority.name: No priority
- gitBranchName: meduardamcp/sis-90-secao-alta-performance-e-comprometimento-mover-imagem-para-a
- createdAt: 2026-09-01T12:52:41.251Z
- updatedAt: 2026-09-15T20:33:34.071Z
- archivedAt: null
- completedAt: null
- startedAt: 2026-09-01T21:25:19.555Z
- canceledAt: null
- dueDate: null
- slaStartedAt: null
- slaMediumRiskAt: null
- slaHighRiskAt: null
- slaBreachesAt: null
- status: Entregue
- statusType: started
- labels: []
- createdBy: Maria Eduarda M Camargo
- createdById: d540a312-a721-479d-9da4-3b86ed7868ba
- assignee: (ausente na resposta get_issue)
- assigneeId: (ausente na resposta get_issue)
- project: (ausente na resposta get_issue)
- projectId: (ausente na resposta get_issue)
- team: Sistran Labs
- teamId: b98f204c-dea3-41e6-99c3-c0347bfb0454

## Descrição

## Problema

Na seção **"...Alta Performance e Comprometimento"**, a foto do time está **centralizada e sobreposta ao texto** — cobre o parágrafo de apoio e encosta no título, além de brigar com os cards flutuantes ao redor.

## O que fazer

* Reposicionar a imagem para a **esquerda**, ao lado do texto (layout em duas colunas: imagem à esquerda, título + descrição à direita).
* Reduzir o tamanho do texto/título para equilibrar com a imagem e evitar que o título ocupe a largura toda.
* Fazer a imagem **transicionar** (entrada suave + troca de imagens ao longo do scroll, em vez de uma foto estática cobrindo o conteúdo).
* Garantir que a imagem não sobreponha mais o parágrafo de apoio nem o título.
* Reposicionar os cards flutuantes (ex.: "Arquitetura orientada a padrões AWS", "Gateway de Pagamentos") para não colidirem com a imagem nem com o texto.

## Pontos de atenção

* Definir o comportamento em mobile: imagem acima do texto, empilhada.
* A transição precisa de estado final visível com `prefers-reduced-motion` (imagem visível, sem movimento).
* Se houver várias imagens em sequência, precarregar a próxima para não piscar na troca.

## Critérios de aceite

- [ ] Imagem à esquerda, texto à direita, sem sobreposição
- [ ] Título e descrição em escala reduzida e legíveis
- [ ] Imagem com transição suave de entrada/troca
- [ ] Cards flutuantes sem colisão
- [ ] Empilhamento correto em mobile
- [ ] Estado final visível com reduced-motion

## Relações

- blocks: []
- blockedBy: []
- relatedTo:
  - SIS-68 — Arquitetura: virar "Entrega com Alta Performance" e trazer os quatro pilares
- duplicateOf: null

## Anexos (issue)

[]

## Documents

[]

## Releases

[]

## Customer needs

[]

## Histórico de status

1. Backlog (type=backlog, id=bc5681b9-61b8-47a5-b698-88ac72996d2e) startedAt=2026-09-01T12:52:41.251Z endedAt=2026-09-01T21:25:19.575Z
2. In Progress (type=started, id=5f40aa5d-3589-452e-8bff-8f2539a4fd24) startedAt=2026-09-01T21:25:19.575Z endedAt=2026-09-01T21:36:47.094Z
3. Done (type=completed, id=95119256-352d-4f0c-b5ae-695c7d838974) startedAt=2026-09-01T21:36:47.094Z endedAt=2026-09-15T20:33:34.042Z
4. Entregue (type=started, id=dbb9dfbe-2cc4-423a-862f-94ca7705f813) startedAt=2026-09-15T20:33:34.042Z endedAt=null

## Comentários (ordem createdAt; list_comments limit=250; hasNextPage=false)

### Comentário 1 — 2026-09-01T21:36:43.346Z

- id: 89f643c5-354b-4637-aa0c-1af17f34ee91
- createdAt: 2026-09-01T21:36:43.346Z
- updatedAt: 2026-09-01T21:36:43.319Z
- parentId: null
- resolvedAt: null
- quotedText: null
- author.id: d540a312-a721-479d-9da4-3b86ed7868ba
- author.name: Maria Eduarda M Camargo
- onBehalfOf: null
- attachments: []

#### Corpo (texto integral)

Implementado.

**Diagnóstico**: a foto do time não era um elemento de conteúdo — era o *tile dominante* do mosaico (`left: 50%; top: 56%; width: clamp(18rem, 32vw, 34rem)`), isto é, um cartão flutuante posicionado no meio da coluna de texto. Como `.mosaic-copy` é `sticky` e ficou mais alta depois da SIS-68 (pilares), a sobreposição passou a ser inevitável.

**O que mudou**
- `src/components/legacy/StackScenes.tsx`: nova linha `.mosaic-duo` de duas colunas (foto à esquerda, texto à direita). O `sticky` saiu do texto e foi para a linha, então as duas colunas viajam juntas com um único ponto de soltura. O tile dominante fica escondido na home.
- Palco de fotos com as três imagens já no DOM (`sistransphist.jpg`, `sistransphist1.jpg`, `escritoriosp.jpg`), trocando por `opacity` no **mesmo relógio** que já governa os grupos de leitura do mosaico (`data-grupo-ativo`) — sem segundo gatilho para desincronizar e sem lógica de prefetch: as três já estão carregadas.
- Entrada em cena via keyframe CSS atrás de um novo `data-em-cena`, escrito só por JS, só acima de 64rem e fora de reduced motion — o default servido é fluxo simples com o estado final visível.
- `src/components/legacy/legacy.css`: título e lead em escala reduzida; os nove tiles periféricos encolhidos e fixados às goteiras (`12rem` reservados de cada lado), distribuídos por lista explícita e não por paridade de `:nth-child` — os grupos de leitura não respeitam paridade e o grupo 0 (cartões 3, 5, 7) apareceria inteiro do lado esquerdo.
- `data-carrier-origem` migrou do tile para o palco, para o viajante do `MosaicHandoff` continuar partindo da foto visível — é por isso que `escritoriosp.jpg` é deliberadamente o último quadro.

`/transformacao-legado` monta o mesmo componente sem `variante`, não recebe `data-variante="home"` e permanece idêntico.

**Medições** (build de produção, Playwright)
- 1440×900: duas colunas iguais — palco `left 224 / w 474`, texto `left 742 / w 474`; colisão foto↔texto **false**; tiles invadindo a linha **0**; h2 41,76px, lead 16,56px; tile dominante invisível; `carrierOrigem: mosaic-palco`.
- Goteiras equilibradas por grupo: grupo 0 → 2 à esquerda / 1 à direita; grupo 1 → 1/2. Nenhum tile invade a linha em nenhum grupo.
- 1366×768: palco `left 192 / w 471`, texto `left 703`, h2 39,6px.
- 390×844: coluna única de 351px, `position: static`, foto acima do texto, sem colisão.
- Reduced motion: `grupo: null`, `emCena: false`, os três quadros em `opacity: 1` (o último do DOM fica visível), nenhuma animação.

`tsc --noEmit` limpo, `npm run build` ok, `npm run lint` no baseline (25 warnings, 0 erros).

**Ressalva honesta**: em mobile os tiles periféricos ainda passam por trás do bloco foto+texto. É comportamento pré-existente — eles já cruzavam o texto antes desta mudança — e não foi tocado aqui. Se incomodar, vale uma issue própria para esconder os tiles abaixo de 64rem.

## Lacunas

- assignee/project ausentes na resposta get_issue.
- Anexos, documents, releases e customer needs vazios.
- list_comments: 1 comentário; hasNextPage=false.
- Nenhum arquivo/imagem de Linear para baixar.
- Linear não foi alterado.
