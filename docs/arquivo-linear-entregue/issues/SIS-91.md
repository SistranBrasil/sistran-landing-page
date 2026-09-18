# SIS-91 — Faixa de logos de parceiros: reduzir a altura (está muito grossa)

- Arquivo Linear (lote F), somente leitura
- Data de exportação: 2026-09-15T20:51:00.000Z
- URL: https://linear.app/sistran-labs/issue/SIS-91/faixa-de-logos-de-parceiros-reduzir-a-altura-esta-muito-grossa

## Metadados

- id: SIS-91
- uuid: 57ad9ee3-96ed-4553-9591-e20bde1c7abd
- title: Faixa de logos de parceiros: reduzir a altura (está muito grossa)
- priority.value: 0
- priority.name: No priority
- gitBranchName: meduardamcp/sis-91-faixa-de-logos-de-parceiros-reduzir-a-altura-esta-muito
- createdAt: 2026-09-01T12:53:00.737Z
- updatedAt: 2026-09-15T20:33:29.365Z
- archivedAt: null
- completedAt: null
- startedAt: 2026-09-01T21:05:12.103Z
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

A faixa clara com os logos de parceiros (Picsel, earnix, dacadoo, samplemed, virtusa, ITG, Microsoft Azure, PEGA, aws, ST IT, addactis, …) está **muito grossa** — a altura do bloco é bem maior que o necessário para os logos, criando um vazio claro que corta a página.

## O que fazer

* Reduzir a altura da faixa, apertando o padding vertical em torno dos logos.
* Padronizar a altura dos logos (o Picsel aparece com fundo/caixa cinza, diferente dos demais — remover o fundo e normalizar).
* Reavaliar o espaçamento antes/depois da faixa, para ela não somar com o padding das seções vizinhas.
* Conferir a transição de cor entre a seção azul acima e a faixa clara — hoje há uma emenda dura visível.
* O eyebrow "RESULTADOS" está aparecendo colado/cortado no rodapé da faixa — reposicionar.

## Critérios de aceite

- [ ] Faixa com altura proporcional aos logos, sem vazio excessivo
- [ ] Logos com altura visual padronizada e sem caixa de fundo
- [ ] Espaçamento consistente com as demais seções
- [ ] Emenda entre a seção azul e a faixa clara resolvida
- [ ] Eyebrow "RESULTADOS" reposicionado
- [ ] Verificado em desktop largo e mobile

## Relações

- blocks: []
- blockedBy: []
- relatedTo:
  - SIS-75 — Fluidez entre seções: auditoria dos cortes duros e do que já existe para resolvê-los
  - SIS-267 — Arte · logo Picsel em alta qualidade (PNG + transparente)
  - SIS-102 — Faixa de logos: adicionar ponto azul separador entre as logos
  - SIS-101 — Faixa de logos: remover a linha azul e os cantos soltos, e integrá-la ao rodapé da seção “Escala que transforma o mercado de seguros.”
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

1. Backlog (type=backlog, id=bc5681b9-61b8-47a5-b698-88ac72996d2e) startedAt=2026-09-01T12:53:00.737Z endedAt=2026-09-01T21:05:12.138Z
2. In Progress (type=started, id=5f40aa5d-3589-452e-8bff-8f2539a4fd24) startedAt=2026-09-01T21:05:12.138Z endedAt=2026-09-01T21:14:59.340Z
3. Done (type=completed, id=95119256-352d-4f0c-b5ae-695c7d838974) startedAt=2026-09-01T21:14:59.340Z endedAt=2026-09-15T20:33:29.357Z
4. Entregue (type=started, id=dbb9dfbe-2cc4-423a-862f-94ca7705f813) startedAt=2026-09-15T20:33:29.357Z endedAt=null

## Comentários (ordem createdAt; list_comments limit=250; hasNextPage=false)

### Comentário 1 — 2026-09-01T21:14:55.087Z

- id: 0ef5b045-51c6-44cd-8bd4-612de4698fa2
- createdAt: 2026-09-01T21:14:55.087Z
- updatedAt: 2026-09-01T21:14:55.063Z
- parentId: null
- resolvedAt: null
- quotedText: null
- author.id: d540a312-a721-479d-9da4-3b86ed7868ba
- author.name: Maria Eduarda M Camargo
- onBehalfOf: null
- attachments: []

#### Corpo (texto integral)

Implementado. Medições antes → depois, em produção (`next build` + `next start`), Chromium:

**1440×900**
- `.lp-signals` altura: **255px → 122px**
- padding vertical: **100.8px → 40.32px** por lado (`padding-block: clamp(1.5rem, 2.8vw, 2.75rem)`)
- altura do logo: **52px → 40.3px** (`clamp(2.25rem, 2.8vw, 3.5rem)`, com `max-width: 11rem`)

**390×844**
- altura: **162px → 85px**
- padding: **56px → 24px** por lado
- logo: **48px → 36px**

O que mudou, por critério de aceite:

- **Vazio excessivo** — era 100.8px de padding para logos de 52px. A faixa agora é proporcional ao conteúdo; não sobra mais a tira branca de ~110px abaixo dos logos.
- **Caixa cinza do Picsel** — o `Picsel-logo.png` não tinha canal alfa: era paleta indexada com um retângulo chapado de `rgb(72,108,85)` em volta da marca, e o plano interno do símbolo era a MESMA cor, então a caixa não era removível por CSS (nem `mix-blend-mode` resolveria sobre off-white). Gerado `Picsel-logo-transparente.png` a partir do próprio arquivo — a cor chapada virou alfa e a folga foi aparada. Derivado do asset existente, nada redesenhado; o original segue em `/public/images` como fonte. `src/data/clients.ts` aponta para o novo.
- **Emenda com a seção azul** — havia dois problemas somados: um fio duplicado (`border-block` desenhava hairline em cima e embaixo; virou `border-bottom`, a borda de cima já é feita pelo `.lp-signals-base`) e o chanfro pintado de `--deep`. SIS-75 pintava o chanfro de `--deep` porque a fronteira era escuro↔escuro; deixou de ser verdade quando a faixa virou off-white — o azul-médio passou a ser uma terceira cor entre o navy e o claro. Agora `<NotchDivider cor="#f5faff" invertido />`: a regra do componente não mudou (a cor é a de quem avança), mudou quem avança — é o bloco claro subindo por baixo do navy.
- **Eyebrow "RESULTADOS"** — verificado: não é eyebrow da faixa. É o chip do `ScrollSpy`, `position: fixed`, que só aparece a partir de 1440px. Ele renderiza sobre a seção escura seguinte (y≈421), não sobre a faixa clara, e continua legível. Nada a reposicionar.
- **Desktop largo e mobile** — screenshots conferidos nos dois; emenda e altura corretas em ambos.

Verificação: `tsc --noEmit` limpo, `npm run lint` no baseline (25 warnings / 0 errors), `npm run build` ok.

Arquivos: `src/components/legacy/legacy.css`, `src/app/page.tsx`, `src/data/clients.ts`, `public/images/Picsel-logo-transparente.png`.

## Lacunas

- assignee/project ausentes na resposta get_issue.
- Anexos, documents, releases e customer needs vazios.
- list_comments: 1 comentário; hasNextPage=false.
- Nenhum arquivo/imagem de Linear para baixar (o PNG Picsel citado no comentário está no repositório do site, não como anexo Linear).
- Linear não foi alterado.
