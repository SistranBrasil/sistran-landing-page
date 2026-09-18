# SIS-42 — Soluções de Negócios: tirar os "pulinhos" na troca de cena durante o scroll

- Arquivo Linear (lote F), somente leitura
- Data de exportação: 2026-09-15T20:51:00.000Z
- URL: https://linear.app/sistran-labs/issue/SIS-42/solucoes-de-negocios-tirar-os-pulinhos-na-troca-de-cena-durante-o

## Metadados

- id: SIS-42
- uuid: 1e2ac48f-ca18-4038-a3cf-79289f4fb39b
- title: Soluções de Negócios: tirar os "pulinhos" na troca de cena durante o scroll
- priority.value: 0
- priority.name: No priority
- gitBranchName: meduardamcp/sis-42-solucoes-de-negocios-tirar-os-pulinhos-na-troca-de-cena
- createdAt: 2026-08-26T19:35:35.546Z
- updatedAt: 2026-09-15T20:33:32.400Z
- archivedAt: null
- completedAt: null
- startedAt: 2026-09-15T20:33:32.380Z
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
- assignee: Maria Eduarda M Camargo
- assigneeId: d540a312-a721-479d-9da4-3b86ed7868ba
- project: Sistran-Landing-Page
- projectId: 4c40ea35-ea44-4a62-9b55-02448016c890
- team: Sistran Labs
- teamId: b98f204c-dea3-41e6-99c3-c0347bfb0454

## Descrição

Rolando o palco, alguns efeitos dão pequenos saltos — a cena/cartão "pula" em vez de trocar limpo.

## Causa provável (a confirmar antes de mexer)

Três suspeitos, todos verificáveis:

1. `key={ativo}` **no fio de processo** (`solutions-fio`): a cada troca de etapa o bloco é remontado e as animações de desenho/cascata recomeçam. Remontagem no meio de um scroll é um salto visível por construção.
2. `transition` **de layout brigando com o scroll**: a `.solution-viewport` anima `opacity`, `transform` e `filter` em 680ms; o cartão anima `transform`/`opacity`. Se a troca de índice acontece em rajada (scroll rápido), duas cenas ficam em transição ao mesmo tempo.
3. **Medição durante a troca**: `medir()` depende de `ativo` e roda no `ResizeObserver`. Se a caixa muda de tamanho na própria transição, um `setGeo` no meio do movimento reposiciona a linha num quadro só — que é exatamente a aparência de "pulinho".

## O que fazer

Investigar primeiro (Performance do DevTools, procurar long tasks e mudanças de layout na troca de índice), identificar qual dos três é o real, e só então corrigir. Registrar no comentário de fechamento o que era de fato — não trocar tudo às cegas.

Direções aceitáveis, se confirmadas: publicar o índice como custom property em vez de `setState` onde o CSS já resolve; deixar de remontar o fio por `key` e animar por atributo de estado; garantir que só a cena ativa tenha `transition` ativa.

## Restrições

O scroll continua sendo o relógio: um `ScrollTrigger` na seção, nada de segundo trigger nem de `setInterval`. Nenhuma dependência nova.

## Validação

Rolar devagar e rápido, pra cima e pra baixo, nas quatro etapas, sem salto perceptível. Conferir que continua havendo exatamente um item ativo.

## Relações

- blocks: []
- blockedBy: []
- relatedTo:
  - SIS-130 — /contato — “Venha Fazer Parte do #timeSISTRAN!”: escrita ampliada, palco com marca d’água atrás e “Venha ser Sistran” como cartão dinâmico
  - SIS-95 — Diagrama “Onde seguros, negócio e tecnologia convergem”: núcleo mais 3D, logo maior e fios dinâmicos
  - SIS-74 — Sistran em números: auditoria do pedido visual — o que já existe e os dois ajustes que faltam
  - SIS-57 — Contato: micro-interações nos componentes internos do painel (hover e foco)
  - SIS-56 — Contato: dar movimento contínuo ao painel inteiro (não só entrada)
  - SIS-53 — Sistran em números: a lente central parece travada — revisar os efeitos do palco
  - SIS-47 — Soluções de Negócios: melhorar o remate final da linha de processo
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

1. Backlog (type=backlog, id=bc5681b9-61b8-47a5-b698-88ac72996d2e) startedAt=2026-08-26T19:35:35.546Z endedAt=2026-08-26T19:51:02.482Z
2. Done (type=completed, id=95119256-352d-4f0c-b5ae-695c7d838974) startedAt=2026-08-26T19:51:02.482Z endedAt=2026-09-15T20:33:32.393Z
3. Entregue (type=started, id=dbb9dfbe-2cc4-423a-862f-94ca7705f813) startedAt=2026-09-15T20:33:32.393Z endedAt=null

## Comentários (ordem createdAt; list_comments limit=250; hasNextPage=false)

### Comentário 1 — 2026-08-26T19:51:16.201Z

- id: 5886c568-a917-43ea-9b48-432d421f06e1
- createdAt: 2026-08-26T19:51:16.201Z
- updatedAt: 2026-08-26T19:51:16.179Z
- parentId: null
- resolvedAt: null
- quotedText: null
- author.id: d540a312-a721-479d-9da4-3b86ed7868ba
- author.name: Maria Eduarda M Camargo
- onBehalfOf: null
- attachments: []

#### Corpo (texto integral)

Feito no commit `8aa143d`. Investiguei antes de corrigir, como a task pedia — e **os três suspeitos eram reais**, somados. Nenhum deles era a transição de 680ms da `.solution-viewport`, que ficou como estava.

**1. O parallax era um dente de serra — esta é a causa principal.** `--sol-passo-p` era `(p * total) % 1`, ou seja caía de 1 para 0 na fronteira de cada etapa. O parallax da foto consumia isso com amplitude de 14px, então a cada quarto do percurso a imagem levava um tranco de 14px — e a `transition: transform 850ms` transformava o tranco num balanço, que é exatamente o "pulinho" que aparece no vídeo.

Agora a fase é por cena: `var(--sol-p) * var(--sol-total) - var(--sol-i)`. Para a cena da vez isso percorre 0..1 igual a antes, mas nunca retorna — fora da janela dela o valor passa de 1 ou fica abaixo de 0, e a cena já não está visível. A transição saiu: o relógio é o scroll, o valor é reescrito a cada quadro, e transição sobre valor por quadro só adiciona borracha (era metade do balanço).

**2. `key={ativo}` estava no container do fio**, então remontava também os seis nós a cada etapa. Eles voltavam do zero com a cascata de entrada, que tem até 785ms de atraso no último nó. A chave passou para o `<path className="solutions-fio-vivo">`, o único elemento que precisa mesmo redesenhar por etapa. Os nós agora persistem e trocam de estado por `transition`.

**3. O pulso do nó ativo reiniciava a animação de entrada.** A regra do estado ativo redeclarava a shorthand `animation` com dois itens, e redeclarar a shorthand reinicia a `solutions-no-entra` da regra base, com os seus 360ms+ de atraso: o nó que acabava de acender sumia e reentrava. O pulso foi para o anel `::after`, onde não encosta na entrada do nó. As keyframes perderam o `translate(-50%, -50%)`, que servia ao nó (centrado por translação) e não ao anel (posicionado por `inset`).

**Bônus na mesma linha de raciocínio:** o parallax de 4px do `.solution-info` saiu. Além do mesmo dente de serra, ele disputava a **mesma** `transform` dos deslocamentos de estado (-10px ao sair, 22px ao entrar), que têm transição de 460ms — valor reescrito por quadro brigando com transição na mesma propriedade. Os 4px não faziam falta; a profundidade quem dá é a foto.

`--sol-passo-p` ficou sem consumidor e deixou de ser publicada; `--sol-total` entrou no lugar (escrita uma vez, para o CSS não repetir o `4` na mão). `tsc` e `eslint` limpos, servidor em 200.

Falta a conferência no navegador: descer devagar pelas quatro etapas procurando tranco na fronteira, subir e descer rápido, e confirmar que a cascata dos nós roda uma vez só (ao entrar na seção) em vez de uma vez por etapa.

## Lacunas

- Anexos, documents, releases e customer needs vazios.
- list_comments: 1 comentário; hasNextPage=false.
- Nenhum arquivo/imagem de Linear para baixar.
- Linear não foi alterado.
