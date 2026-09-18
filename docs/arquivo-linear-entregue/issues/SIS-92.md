# SIS-92 — Seção “Desafios no desenvolvimento de software”: textos sobrepostos entre etapas

- Arquivo Linear (lote F), somente leitura
- Data de exportação: 2026-09-15T20:51:00.000Z
- URL: https://linear.app/sistran-labs/issue/SIS-92/secao-desafios-no-desenvolvimento-de-software-textos-sobrepostos-entre

## Metadados

- id: SIS-92
- uuid: 33ae88cb-b955-4d9b-9c51-1673ef340602
- title: Seção “Desafios no desenvolvimento de software”: textos sobrepostos entre etapas
- priority.value: 0
- priority.name: No priority
- gitBranchName: meduardamcp/sis-92-secao-desafios-no-desenvolvimento-de-software-textos
- createdAt: 2026-09-01T12:53:17.723Z
- updatedAt: 2026-09-15T20:33:34.636Z
- archivedAt: null
- completedAt: null
- startedAt: 2026-09-15T20:33:34.474Z
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

Na seção **"Desafios no desenvolvimento de software"**, os textos das etapas ficam **sobrepostos um sobre o outro**. Na etapa "Validar e evoluir", o parágrafo aparece embaralhado com o texto da etapa anterior — dois blocos renderizados no mesmo espaço, resultado ilegível:

> "Aprender com a operação e com os resultados, para que cada ciclo devolva evidência ao próximo — e a plataforma evolua com o negócio." **sobreposto a** "...dar."

## Causa provável

O texto que sai não chega a `opacity: 0` antes de o próximo entrar (crossfade com sobreposição de opacidade), ou os blocos estão empilhados em `position: absolute` sem controle de `visibility`/z-index por etapa.

## O que fazer

* Garantir que a etapa que sai termine em `opacity: 0` (e `visibility: hidden` / `pointer-events: none`) antes de a próxima ficar legível.
* Se for crossfade intencional, encurtar a sobreposição para não haver dois textos legíveis simultaneamente.
* Conferir se o problema aparece em todas as etapas ou apenas na última ("Validar e evoluir") — pode ser a etapa final não limpando o estado da anterior.
* Verificar a linha divisória acima do título, que também aparece atravessando o texto.
* Revisar a altura reservada para o bloco de texto: etapas com parágrafos de tamanhos diferentes podem estar colidindo.

## Critérios de aceite

- [ ] Apenas um texto de etapa legível por vez, em todas as etapas
- [ ] Nenhum resíduo de texto da etapa anterior
- [ ] Linha divisória não atravessa o texto
- [ ] Testado percorrendo a seção para frente e para trás (scroll reverso)
- [ ] Com reduced-motion, o conteúdo de todas as etapas continua alcançável e legível

## Relações

- blocks: []
- blockedBy: []
- relatedTo:
  - SIS-99 — “Desafios no desenvolvimento de software”: remover as três etapas e manter só o bloco sobre o Luminna AI
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

1. Backlog (type=backlog, id=bc5681b9-61b8-47a5-b698-88ac72996d2e) startedAt=2026-09-01T12:53:17.723Z endedAt=2026-09-01T21:05:03.841Z
2. Done (type=completed, id=95119256-352d-4f0c-b5ae-695c7d838974) startedAt=2026-09-01T21:05:03.841Z endedAt=2026-09-15T20:33:34.591Z
3. Entregue (type=started, id=dbb9dfbe-2cc4-423a-862f-94ca7705f813) startedAt=2026-09-15T20:33:34.591Z endedAt=null

## Comentários (ordem createdAt; list_comments limit=250; hasNextPage=false)

### Comentário 1 — 2026-09-01T21:04:59.502Z

- id: 19605b2e-f475-4a85-aea0-2fa04f7e3fe6
- createdAt: 2026-09-01T21:04:59.502Z
- updatedAt: 2026-09-01T21:04:59.478Z
- parentId: null
- resolvedAt: null
- quotedText: null
- author.id: d540a312-a721-479d-9da4-3b86ed7868ba
- author.name: Maria Eduarda M Camargo
- onBehalfOf: null
- attachments: []

#### Corpo (texto integral)

Corrigido em `src/components/legacy/ImpactSequence.tsx`.

Causa exata (a hipótese do card estava certa, era crossfade): cada capítulo entrava em `[at - 0.07, at]` e saía em `[at + 0.24 - 0.07, at + 0.24]`. A janela de saída de um é **idêntica** à janela de entrada do próximo — e no modo dirigido os três dividem a mesma célula da grade (`grid-area: cap`, em `legacy.css`). Nesses 0.07 do percurso havia dois parágrafos meio opacos desenhados um sobre o outro: exatamente o texto de "Validar e evoluir" embaralhado com o anterior, e o fio de `border-top` do que saía cruzando o texto do que entrava (a "linha divisória atravessando o texto" era isso, não um separador solto).

Não era só a última etapa — acontecia nas duas transições. A última chamava mais atenção porque é o parágrafo mais longo.

O que mudou:

- A troca passou a ser **encadeada**: a saída termina onde a entrada do próximo começa (`fimSaida = at + CAP_PASSO - CAP_BORDA`). O tempo em que cada capítulo fica parado e legível não muda; muda só o instante em que ele começa a sair. `opacity` e `clipPath` usam as mesmas janelas — antes o `clipPath` repetia as contas à mão, agora as duas leem `inicioSaida`/`fimSaida`.
- `0.24` virou `CAP_PASSO`, porque a correção subtrai bordas dele em três lugares.
- Capítulo fora de cena agora recebe `visibility: hidden` (`useVisibilityGate`, o mesmo utilitário que a cópia da seção já usava). `opacity: 0` continuava selecionável e encontrável no Ctrl+F: arrastar o cursor pela cópia selecionava os três parágrafos empilhados. Só no modo dirigido.
- Em fluxo (sem JS, abaixo de 1024px, movimento reduzido) nada mudou: os três continuam em colunas, piso de opacidade 0.28, todos alcançáveis. Nenhum caminho novo de código para manter.

Validado no build de produção, `/` a 1600×900, percorrendo a seção inteira para baixo e para cima (260 amostras em cada sentido): **0 quadros com dois capítulos legíveis ao mesmo tempo**, nos dois sentidos, e cada um dos três chega a `opacity: 1` na sua vez. Com movimento reduzido e a 900px de largura a seção cai em modo fluxo, os três legíveis. 0 erros de console. `tsc --noEmit` limpo, `lint` 0 erros.

## Lacunas

- assignee/project ausentes na resposta get_issue.
- Anexos, documents, releases e customer needs vazios.
- list_comments: 1 comentário; hasNextPage=false.
- Nenhum arquivo/imagem de Linear para baixar.
- Linear não foi alterado.
