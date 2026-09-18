# SIS-93 — Soluções / “Tecnologia Disruptiva”: aplicar o mesmo fundo azul claro da seção Consultoria

- Arquivo Linear (lote F), somente leitura
- Data de exportação: 2026-09-15T20:51:00.000Z
- URL: https://linear.app/sistran-labs/issue/SIS-93/solucoes-tecnologia-disruptiva-aplicar-o-mesmo-fundo-azul-claro-da

## Metadados

- id: SIS-93
- uuid: 74b03f56-51f9-4455-b28d-027e51dc8287
- title: Soluções / “Tecnologia Disruptiva”: aplicar o mesmo fundo azul claro da seção Consultoria
- priority.value: 0
- priority.name: No priority
- gitBranchName: meduardamcp/sis-93-solucoes-tecnologia-disruptiva-aplicar-o-mesmo-fundo-azul
- createdAt: 2026-09-01T18:57:39.894Z
- updatedAt: 2026-09-15T20:33:30.799Z
- archivedAt: null
- completedAt: null
- startedAt: 2026-09-01T21:36:54.074Z
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

## O que fazer

Na seção de **Soluções — "Tecnologia Disruptiva"**, trocar o fundo atual pelo **mesmo fundo azul claro usado na seção Consultoria**, para as duas ficarem consistentes.

## Referência

A seção **Consultoria** usa um fundo azul claro com gradiente suave (quase branco no centro, azul mais saturado nas bordas laterais/superior) sobre a textura de grid discreta. É esse tratamento que deve ser replicado.

## Como fazer

* Extrair o fundo da Consultoria para um token/classe compartilhada (variável CSS ou componente de background), em vez de duplicar os valores de gradiente.
* Aplicar em "Tecnologia Disruptiva", mantendo a textura de grid e a mesma direção/intensidade do gradiente.
* Reavaliar o contraste dos elementos da seção sobre o novo fundo: títulos, textos de apoio, ícones, numeração e cards precisam continuar legíveis (checar AA).
* Conferir a emenda com as seções acima e abaixo — a troca de fundo não deve criar uma linha dura.

## Critérios de aceite

- [ ] "Tecnologia Disruptiva" com o mesmo fundo da Consultoria (mesmo gradiente e textura)
- [ ] Fundo definido em um único lugar e reutilizado pelas duas seções
- [ ] Contraste de textos, ícones e cards verificado sobre o novo fundo
- [ ] Emendas com as seções vizinhas sem linha dura
- [ ] Verificado em desktop largo, notebook e mobile

## Relações

- blocks: []
- blockedBy: []
- relatedTo:
  - SIS-260 — /contato · números: grade de quadradinhos discretos igual à home
  - SIS-236 — /parceiros-e-implementacoes · tirar tarja azul clara da capa / emenda
  - SIS-211 — /contato — números: fundo azul claro, cards tipo Implementações, seção mais baixa
  - SIS-97 — “Escritórios BRASIL”: unificar o fundo do mapa com o fundo claro do título
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

1. Backlog (type=backlog, id=bc5681b9-61b8-47a5-b698-88ac72996d2e) startedAt=2026-09-01T18:57:39.894Z endedAt=2026-09-01T21:36:54.091Z
2. In Progress (type=started, id=5f40aa5d-3589-452e-8bff-8f2539a4fd24) startedAt=2026-09-01T21:36:54.091Z endedAt=2026-09-01T21:42:58.169Z
3. Done (type=completed, id=95119256-352d-4f0c-b5ae-695c7d838974) startedAt=2026-09-01T21:42:58.169Z endedAt=2026-09-15T20:33:30.792Z
4. Entregue (type=started, id=dbb9dfbe-2cc4-423a-862f-94ca7705f813) startedAt=2026-09-15T20:33:30.792Z endedAt=null

## Comentários (ordem createdAt; list_comments limit=250; hasNextPage=false)

### Comentário 1 — 2026-09-01T21:42:54.279Z

- id: a970626c-5bf7-419e-b469-9d3f24dc7301
- createdAt: 2026-09-01T21:42:54.279Z
- updatedAt: 2026-09-01T21:42:54.259Z
- parentId: null
- resolvedAt: null
- quotedText: null
- author.id: d540a312-a721-479d-9da4-3b86ed7868ba
- author.name: Maria Eduarda M Camargo
- onBehalfOf: null
- attachments: []

#### Corpo (texto integral)

Implementado.

**Fundo em um único lugar**: nada de gradiente duplicado — "Tecnologia Disruptiva" (`src/components/Accelerators.tsx`) passou a usar exatamente a mesma classe da Consultoria, `section-light section-light-blue`, já definida uma vez só em `src/app/globals.css`. A textura de grade (`.section-light::before`, ancorada em `--grade-modulo`) e o pontilhado (`::after`) vêm de brinde. Verificado por computed style: `backgroundImage` da seção **idêntico** ao da `#consultoria`, e o do `::before` também.

**O que mais precisou mudar** (o fundo sozinho quebraria a seção)
- Os cards continuam navy — sobre azul claro é o card escuro que carrega o contraste. Mas `.section-light` pinta `h3`/`p`/`span` de navy, o que deixaria o texto do card navy sobre navy, isto é, invisível. Cada card ganhou `on-dark`, a válvula que já existe no `globals.css` exatamente para ilha escura dentro de seção clara.
- Link "Conheça o …" com a cor por `style` em vez de `text-[#A5F0FF]`: a regra `.section-light .on-dark a` usa `!important` e atropelaria a utility. O `:not([style*="color"])` daquela regra existe para esse caso.
- Sombra dos cards de navy quase opaco (`rgba(3,26,52,0.5)`) para o azul da marca em opacidade menor — sobre fundo claro a sombra antiga lia como mancha, não como profundidade.
- Cabeçalho para `text-ink` / `text-ink-muted`, e o selo "7 aceleradores" com o mesmo tratamento do selo da Consultoria (borda `#0079CB/22`, base branca, texto `#0060a8`) — borda e texto brancos sumiriam.
- Orbs de fundo movidos de `-z-10` para `z-0` com o conteúdo em `z-10`: `.section-light` traz `isolation: isolate` e um z negativo os jogaria para trás do próprio fundo. Mesmo arranjo da Consultoria. O violeta `#A78BFA` virou ciano da marca, seguindo a nota de paleta que já existe no `.section-light`.

**Contraste** (medido, fundo de referência #e3f1fb)
- Título "Soluções" 14,50:1 · lead 6,30:1 · selo 14,50:1 — todos acima de AA (4,5:1), o lead também acima de AAA para texto grande.
- Dentro do card navy (#083156): h3 branco ≈ 12,6:1, corpo em branco 88% ≈ 11:1, link `#A5F0FF` ≈ 10:1.
- Idêntico em 1440×900, 1366×768 e 390×844 (o layout dos cards já era 3/2/1 coluna e não mudou).

**Emendas**: a borda de um bloco claro sobre o navy da página era corte reto, e era assim **também na Consultoria** — não era regressão desta issue, era o comportamento do `.section-light`. Como a classe é compartilhada, resolvi para as duas de uma vez: `box-shadow: 0 0 54px 18px rgb(227 241 251 / 45%)` na variante azul-claro, que sangra a cor de base para fora e transforma o corte em gradiente. Máscara não servia (recortaria o conteúdo) e os dois pseudo-elementos de `.section-light` já estão ocupados.

**Ressalva honesta**: a emenda de cima ficou suave; a de baixo melhorou menos, porque a seção seguinte tem fundo opaco e pinta por cima do sangramento. Vale para as duas seções claras da página, igualmente.

**Efeito colateral esperado**: a alternância de `/solucoes` deixou de ser escuro→escuro→claro→escuro. Agora cada bloco claro fica cercado por escuros, o que é a leitura que a Consultoria já tinha. Os comentários da página que descreviam a alternância antiga foram atualizados.

`tsc --noEmit` limpo, `npm run build` ok, `npm run lint` no baseline (25 warnings, 0 erros).

## Lacunas

- assignee/project ausentes na resposta get_issue.
- Anexos, documents, releases e customer needs vazios.
- list_comments: 1 comentário; hasNextPage=false.
- Nenhum arquivo/imagem de Linear para baixar.
- Linear não foi alterado.
