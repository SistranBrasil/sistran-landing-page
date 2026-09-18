# SIS-87 — Menu “Quem somos”: dropdown desaparece ao tentar clicar nos itens

- Arquivo Linear (lote F), somente leitura
- Data de exportação: 2026-09-15T20:51:00.000Z
- URL: https://linear.app/sistran-labs/issue/SIS-87/menu-quem-somos-dropdown-desaparece-ao-tentar-clicar-nos-itens

## Metadados

- id: SIS-87
- uuid: 663bcc1e-7c7c-4c99-92f6-65d3de75eda2
- title: Menu “Quem somos”: dropdown desaparece ao tentar clicar nos itens
- priority.value: 0
- priority.name: No priority
- gitBranchName: meduardamcp/sis-87-menu-quem-somos-dropdown-desaparece-ao-tentar-clicar-nos
- createdAt: 2026-09-01T12:51:14.274Z
- updatedAt: 2026-09-15T20:33:35.107Z
- archivedAt: null
- completedAt: null
- startedAt: 2026-09-01T20:42:52.252Z
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

Ao abrir o dropdown **Quem somos** e mover o mouse para clicar em um dos itens (A Sistran, Sistran Labs, Sistran University, Sistran Latam), o menu **fecha antes do clique**, tornando os links inacessíveis.

## Causa provável

Espaço morto entre o botão "Quem somos" e o painel do dropdown: o `mouseleave` do trigger dispara enquanto o cursor atravessa o gap, fechando o menu antes de entrar no painel.

## O que fazer

* Tratar trigger + painel como uma única área de hover (wrapper comum, ou ponte invisível cobrindo o gap com `padding-top` no painel em vez de `margin-top`).
* Adicionar pequeno delay de fechamento (~150–200ms) para tolerar o trajeto do mouse.
* Fechar em: clique fora, `Esc`, e navegação para outro item do menu.
* Suporte a teclado: abrir/fechar por `Enter`/`Espaço`, navegar com setas, `Tab` percorrendo os itens sem fechar.
* Em touch, abrir por clique (não hover) e fechar no segundo toque.

## Critérios de aceite

- [ ] É possível clicar em qualquer um dos 4 itens sem o menu fechar no caminho
- [ ] Menu fecha com clique fora e com `Esc`
- [ ] Navegável por teclado, com foco visível
- [ ] Funciona em touch (mobile/tablet)
- [ ] Sem tremulação/flicker ao entrar e sair do painel

## Relações

- blocks: []
- blockedBy: []
- relatedTo: []
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

1. Backlog (type=backlog, id=bc5681b9-61b8-47a5-b698-88ac72996d2e) startedAt=2026-09-01T12:51:14.274Z endedAt=2026-09-01T20:42:52.271Z
2. In Progress (type=started, id=5f40aa5d-3589-452e-8bff-8f2539a4fd24) startedAt=2026-09-01T20:42:52.271Z endedAt=2026-09-01T20:47:17.611Z
3. Done (type=completed, id=95119256-352d-4f0c-b5ae-695c7d838974) startedAt=2026-09-01T20:47:17.611Z endedAt=2026-09-15T20:33:35.088Z
4. Entregue (type=started, id=dbb9dfbe-2cc4-423a-862f-94ca7705f813) startedAt=2026-09-15T20:33:35.088Z endedAt=null

## Comentários (ordem createdAt; list_comments limit=250; hasNextPage=false)

### Comentário 1 — 2026-09-01T20:47:13.159Z

- id: 4925e521-4b49-49a2-b572-4d560434f557
- createdAt: 2026-09-01T20:47:13.159Z
- updatedAt: 2026-09-01T20:47:13.122Z
- parentId: null
- resolvedAt: null
- quotedText: null
- author.id: d540a312-a721-479d-9da4-3b86ed7868ba
- author.name: Maria Eduarda M Camargo
- onBehalfOf: null
- attachments: []

#### Corpo (texto integral)

Resolvido em `src/components/Header.tsx`.

**Causa:** o painel ficava em `top: calc(100% + 10px)`. Os 10px de vão não pertencem nem ao invólucro nem à lista, então o cursor "saía" do invólucro no trajeto até o primeiro item, o `mouseleave` disparava e o `hidden` arrancava os links antes do clique.

**O que mudou:**
- O afastamento passou a ser `padding-top: 10px` de um invólucro posicionado em `top-full`, com o painel estilizado dentro. Padding é área do elemento — o percurso do gatilho até o primeiro item nunca sai da região de hover.
- Fechamento com atraso de 180ms (`fecharSubmenuComAtraso`), cancelado ao reentrar: cobre o trajeto em diagonal, em que o cursor raspa a borda do painel.
- Clique/toque fora fecha, via `pointerdown` no documento. `pointerdown` e não `click`: no touch o menu abre por clique no botão, e um `click` no documento chegaria junto com o que abriu, fechando na hora.
- Teclado: `ArrowDown` abre e leva o foco ao primeiro item, `ArrowDown`/`ArrowUp` percorrem em ciclo, `Escape` fecha e devolve o foco ao botão. `Tab` continua percorrendo os itens sem fechar (o `onBlur` só age quando o foco sai do invólucro).

**Medido em build de produção, 1600×900:**
- Os 4 itens ficam visíveis durante todo o trajeto do mouse e o clique navega: A Sistran → `/quem-somos`, Sistran Labs → `/sistran-labs`, Sistran University → `/sistran-university`, Sistran Latam → `/latam`.
- Clique fora fecha ✓ · `Esc` fecha ✓ · `ArrowDown` foca "A Sistran", o seguinte foca "Sistran Labs" ✓ · `Tab` não fecha ✓
- Touch (`hasTouch`): primeiro toque abre, segundo fecha ✓
- 0 erro de console. `tsc --noEmit` limpo; lint 25 avisos / 0 erros (baseline); build de produção passa.

## Lacunas

- assignee/project não vieram em get_issue (campos ausentes, não nulos explícitos).
- Anexos, documents, releases e customer needs vazios na API.
- list_comments: 1 comentário; hasNextPage=false (sem página seguinte omitida).
- Nenhum arquivo/imagem de Linear para baixar nesta issue.
- Linear não foi alterado.
