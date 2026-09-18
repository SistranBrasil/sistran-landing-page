# SIS-88 — Seção de contato na home: layout quebrado (título cortado pelo header, bloco estourando a seção)

- Arquivo Linear (lote F), somente leitura
- Data de exportação: 2026-09-15T20:51:00.000Z
- URL: https://linear.app/sistran-labs/issue/SIS-88/secao-de-contato-na-home-layout-quebrado-titulo-cortado-pelo-header

## Metadados

- id: SIS-88
- uuid: 96157983-e672-4293-aa23-147bef5b2460
- title: Seção de contato na home: layout quebrado (título cortado pelo header, bloco estourando a seção)
- priority.value: 0
- priority.name: No priority
- gitBranchName: meduardamcp/sis-88-secao-de-contato-na-home-layout-quebrado-titulo-cortado-pelo
- createdAt: 2026-09-01T12:51:31.672Z
- updatedAt: 2026-09-15T20:33:34.240Z
- archivedAt: null
- completedAt: null
- startedAt: 2026-09-01T20:47:19.110Z
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

Na seção de contato dentro da home, o bloco "Entre em contato conosco" está **quebrado**:

* O título "Entre em contato conosco" fica **por trás do header** — só "contato conosco" aparece, "Entre em" é encoberto pela barra de navegação.
* O eyebrow "SAIBA MAIS SOBRE O QUE PODEMOS OFERECER" fica cortado no topo, atrás do header.
* O bloco estoura a área da seção: o card sai da moldura, com faixas claras sobrando à esquerda e à direita.
* O card "SEDE · SÃO PAULO" fica cortado na base da seção.
* O marcador lateral de progresso ("CONTATO") aparece sobreposto ao conteúdo.

## O que fazer

* Reservar o espaço do header no topo da seção (`scroll-margin-top` / padding equivalente à altura do header) para o título não passar por baixo dele.
* Conter o bloco dentro do container da seção, respeitando o mesmo grid/largura máxima das outras seções.
* Ajustar a altura da seção para o card de endereço caber inteiro.
* Revisar o z-index entre header, marcador lateral de progresso e o bloco de contato.
* Conferir se o componente foi reaproveitado do modal sem ajustar as medidas para uso embutido em página (o modal tem viewport próprio, a seção não).

## Relacionado

* <issue id="40074c35-55b5-42c7-9947-bc3b3223d57f" href="https://linear.app/sistran-labs/issue/SIS-83/contato-substituir-o-bloco-de-formulario-atual-pelo-layout-entre-em">SIS-83</issue> (layout novo de contato)

## Critérios de aceite

- [ ] Título e eyebrow totalmente visíveis, sem passar sob o header
- [ ] Bloco contido na seção, alinhado ao grid do restante da página
- [ ] Card "SEDE · SÃO PAULO" visível por completo
- [ ] Sem sobreposição do marcador lateral
- [ ] Verificado em desktop largo, notebook e mobile

## Relações

- blocks: []
- blockedBy: []
- relatedTo:
  - SIS-83 — /contato: substituir o bloco de formulário atual pelo layout “Entre em contato conosco”
  - SIS-103 — Transição “Sobre o Luminna AI” → Contato: eliminar a quebra e encadear o card do Luminna com a entrada do card de contato
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

1. Backlog (type=backlog, id=bc5681b9-61b8-47a5-b698-88ac72996d2e) startedAt=2026-09-01T12:51:31.672Z endedAt=2026-09-01T20:47:19.175Z
2. In Progress (type=started, id=5f40aa5d-3589-452e-8bff-8f2539a4fd24) startedAt=2026-09-01T20:47:19.175Z endedAt=2026-09-01T20:56:56.445Z
3. Done (type=completed, id=95119256-352d-4f0c-b5ae-695c7d838974) startedAt=2026-09-01T20:56:56.445Z endedAt=2026-09-15T20:33:34.230Z
4. Entregue (type=started, id=dbb9dfbe-2cc4-423a-862f-94ca7705f813) startedAt=2026-09-15T20:33:34.230Z endedAt=null

## Comentários (ordem createdAt; list_comments limit=250; hasNextPage=false)

### Comentário 1 — 2026-09-01T20:56:51.881Z

- id: 139ad85a-2a31-4ae7-86a5-44a9ec6538f2
- createdAt: 2026-09-01T20:56:51.881Z
- updatedAt: 2026-09-01T20:56:51.749Z
- parentId: null
- resolvedAt: null
- quotedText: null
- author.id: d540a312-a721-479d-9da4-3b86ed7868ba
- author.name: Maria Eduarda M Camargo
- onBehalfOf: null
- attachments: []

#### Corpo (texto integral)

Corrigido. Causa medida, não estética.

A seção rodava em "modo dirigido": o interior é uma caixa `sticky` de `height: 100svh` com `overflow: clip`. Dois erros somados:

1. A caixa media a tela INTEIRA, mas o topo dela fica atrás da pílula fixa do cabeçalho (borda inferior a 104px). Daí o sobretítulo e "Entre em" escondidos.
2. O painel é maior que a tela útil. Medido: **1000px** em 1920×1080, **877px** em 1440×900, **866px** em 1366×768. Com `overflow: clip`, o que não cabia era cortado — em cima o título, embaixo o card "SEDE · SÃO PAULO". É isso que dava a impressão de o bloco "estourar" a seção enquanto as faixas de luz continuavam nas laterais.

O que foi feito:

- `globals.css` — o modo dirigido agora reserva o cabeçalho dentro da caixa `sticky` (`padding-top: calc(var(--header-h,88px) + 1.5rem)` + `padding-bottom: 1.5rem`), e `.ct-trilha` ganhou `scroll-margin-top` porque `#contato` é destino de âncora do menu e do ScrollSpy.
- `Contact.tsx` — o modo dirigido passou a exigir que o painel CAIBA: mede `painelRef.offsetHeight` (imune ao `scale()` da animação, ao contrário de `getBoundingClientRect`) e só dirige se `altura + 136 <= innerHeight`. Não cabendo, a seção fica no modo lista, que já existia e já servia celular e movimento reduzido — painel inteiro, no fluxo da página, nada recortado. `ResizeObserver` + `resize` reavaliam.

**Consequência a registrar:** com o painel em 866–1000px, o modo dirigido só se ativa acima de ~1136px de altura de janela, ou seja, praticamente nunca nos notebooks e monitores usuais. A chegada cinematográfica do painel deixa de aparecer nesses tamanhos. Preferi isso a manter conteúdo cortado; se a chegada for requisito, o caminho é encurtar o painel (o card de telefone e o de endereço são os dois blocos que mais somam altura), não reativar o recorte.

Validado no build de produção, com medições em 1920×1080, 1440×900, 1366×768 e 390×844, com e sem movimento reduzido: sobretítulo, "Entre em contato conosco" e o card "SEDE · SÃO PAULO" completos em todos; nenhuma sobreposição com o ScrollSpy (o trilho só existe a partir de 1440px, a 12–20px da esquerda, e a borda do painel fica em 100px a 1440 e 340px a 1920). `tsc --noEmit` limpo, `lint` 0 erros, `build` ok.

## Lacunas

- assignee/project ausentes na resposta get_issue.
- Anexos, documents, releases e customer needs vazios.
- list_comments: 1 comentário; hasNextPage=false.
- Nenhum arquivo/imagem de Linear para baixar.
- Linear não foi alterado.
