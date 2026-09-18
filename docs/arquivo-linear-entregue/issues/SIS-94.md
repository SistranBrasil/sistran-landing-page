# SIS-94 — Hero de Soluções, Serviços e Consultoria: vídeo de fundo controlado pelo scroll

- Arquivo Linear (lote F), somente leitura
- Data de exportação: 2026-09-15T20:51:00.000Z
- URL: https://linear.app/sistran-labs/issue/SIS-94/hero-de-solucoes-servicos-e-consultoria-video-de-fundo-controlado-pelo

## Metadados

- id: SIS-94
- uuid: 8dce53d0-5dea-4a1a-98d9-606750d94670
- title: Hero de Soluções, Serviços e Consultoria: vídeo de fundo controlado pelo scroll
- priority.value: 0
- priority.name: No priority
- gitBranchName: meduardamcp/sis-94-hero-de-solucoes-servicos-e-consultoria-video-de-fundo
- createdAt: 2026-09-01T19:27:08.626Z
- updatedAt: 2026-09-15T20:33:32.167Z
- archivedAt: null
- completedAt: null
- startedAt: 2026-09-01T21:43:06.205Z
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

Colocar um vídeo **atrás do hero** da página **Soluções, Serviços e Consultoria** — o bloco com o eyebrow "SOLUÇÕES, SERVIÇOS E CONSULTORIA", o título "Oferecemos SOLUÇÕES, SERVIÇOS e CONSULTORIA sob medida para modernização e otimização do desempenho da sua Seguradora.", o lema "Beyond Technology: é o nosso lema!" e a barra "NESTA PÁGINA".

O vídeo deve ser **controlado pelo scroll** (scrollytelling): o scroll avança e retrocede o `currentTime`, não autoplay em loop.

## Asset

`public/videos/Hands_typing_on_keyboard,_digita…_202609011608.mp4` (mãos digitando no teclado, ~6,3 MB)

> Existe também `..._202609011609.mp4` (~11,8 MB), variação do mesmo take. Escolher qual usar e remover o outro do repo para não carregar peso morto.
>
> Renomear o arquivo escolhido para um slug limpo (ex.: `solucoes-hero-scroll.mp4`) — o nome atual tem vírgula e o caractere `…`, que quebram URL e podem falhar em deploy/CDN.

## Como fazer

* Vídeo em `position: absolute; inset: 0; object-fit: cover`, atrás do conteúdo do hero, com o conteúdo em camada superior.
* Overlay/gradiente escuro sobre o vídeo para manter a legibilidade do título branco e do "Seguradora." em azul claro — o fundo navy atual do hero precisa continuar reconhecível.
* Scroll → `currentTime`: usar ScrollTrigger com `scrub` (padrão já usado no `hero-scroll.mp4` da home — reaproveitar a mesma implementação em vez de criar outra).
* `muted`, `playsinline`, `preload="auto"` e `poster` (gerar um frame como `.webp`) para não ter tela preta antes de carregar.
* Só manipular `currentTime` depois de o vídeo ter metadados/estar seekável; caso contrário o scroll inicial não move nada.

## Pontos de atenção

* **Peso**: 6,3 MB no hero impacta o LCP. Comprimir (H.264 CRF ~28, `-an`, `-movflags +faststart`) e avaliar versão WebM.
* **Mobile**: scroll-controlled video costuma travar em iOS/Android — definir fallback (poster estático ou autoplay em loop simples).
* **reduced-motion**: cair para o poster estático, mantendo o hero legível.
* Verificar que o vídeo não interfere no header nem na barra "NESTA PÁGINA" (z-index).

## Critérios de aceite

- [ ] Vídeo atrás do hero de Soluções, avançando/retrocedendo com o scroll
- [ ] Arquivo renomeado para slug limpo e o duplicado removido
- [ ] Vídeo comprimido, com poster e `faststart`
- [ ] Título, lema e barra "NESTA PÁGINA" legíveis sobre o vídeo
- [ ] Fallback definido em mobile e com reduced-motion
- [ ] Sem tela preta no primeiro paint

## Relações

- blocks: []
- blockedBy: []
- relatedTo:
  - SIS-138 — /esg — abertura: título quebrado à esquerda e a continuação ao lado, na mesma fonte
  - SIS-137 — /trabalhe-conosco — abertura com vídeo, formulário ao lado da escrita e a tag revista
  - SIS-126 — /contato: foto do escritório atrás da abertura “Preencha o formulário e fale com a gente!”
  - SIS-113 — /esg: imagem de fundo atrás do título da abertura, com sombra leve e título deslocado para a esquerda
  - SIS-112 — /solucoes: as sombras do vídeo de abertura estão em arestas retas — deixar a passagem sutil
  - SIS-105 — /eventos-inovacao: vídeo de fundo no hero “Eventos & Inovação”, no mesmo padrão de /solucoes
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

1. Backlog (type=backlog, id=bc5681b9-61b8-47a5-b698-88ac72996d2e) startedAt=2026-09-01T19:27:08.626Z endedAt=2026-09-01T21:43:06.221Z
2. In Progress (type=started, id=5f40aa5d-3589-452e-8bff-8f2539a4fd24) startedAt=2026-09-01T21:43:06.221Z endedAt=2026-09-01T21:52:59.807Z
3. Done (type=completed, id=95119256-352d-4f0c-b5ae-695c7d838974) startedAt=2026-09-01T21:52:59.807Z endedAt=2026-09-15T20:33:32.161Z
4. Entregue (type=started, id=dbb9dfbe-2cc4-423a-862f-94ca7705f813) startedAt=2026-09-15T20:33:32.161Z endedAt=null

## Comentários (ordem createdAt; list_comments limit=250; hasNextPage=false)

### Comentário 1 — 2026-09-01T21:52:54.537Z

- id: ec14d00d-c110-4a19-8058-4821b66d297f
- createdAt: 2026-09-01T21:52:54.537Z
- updatedAt: 2026-09-01T21:52:54.515Z
- parentId: null
- resolvedAt: null
- quotedText: null
- author.id: d540a312-a721-479d-9da4-3b86ed7868ba
- author.name: Maria Eduarda M Camargo
- onBehalfOf: null
- attachments: []

#### Corpo (texto integral)

Implementado.

**Asset**
- Escolhido o take citado na issue (6,6 MB) em vez da variação (11,8 MB) — ambos 1920×1080, 24 fps, 10 s.
- Reencodado *all-intra* (todo quadro é keyframe, requisito de busca quadro a quadro) a 1280 de largura, CRF 32, `-an`, `+faststart` → `public/videos/solucoes-hero-scroll.mp4`, **2,8 MB** (menor que a origem, apesar de todo quadro ser keyframe).
- Pôster WebP do primeiro quadro do próprio vídeo: `solucoes-hero-scroll-poster.webp`, **48 KB**.
- Os dois arquivos originais de nome longo foram removidos.

**Implementação**
- Novo `src/components/ui/HeroVideoBackdrop.tsx`: *envolve* a abertura em vez de virar prop do `PageHero`, porque o que precisa ficar sobre o vídeo é o hero **e** a barra "NESTA PÁGINA" — elas são irmãs na página, e um vídeo dentro do `PageHero` deixaria a barra abrindo já sobre o navy, com emenda no meio da abertura.
- O relógio é o `scrollYProgress` do próprio wrapper (`start start` → `end start`); a busca fica com o `ScrollVideo`, que já serializa seeks pelo `seeking` do elemento. Nenhum `ScrollTrigger` novo.
- O primeiro render, **no servidor e no cliente**, não tem `<video>` nenhum: tem o pôster como `<img>`. O vídeo só entra depois de montar, e só se a janela for larga e a preferência de movimento permitir. Isso resolve de uma vez a hidratação, a tela preta no primeiro paint e o fallback de mobile/reduced-motion — é o mesmo caminho, não um ramo extra a manter.
- Corte em 1024px: o mesmo que o `ProofJourney` usa. Vídeo buscado quadro a quadro engasga nos decodificadores de iOS/Android.
- CSS em `.hero-backdrop*` no `globals.css`: base navy sob o vídeo (não retângulo preto), véu em duas camadas e `z-index` explícito no conteúdo para segurar os orbs `-z-10` do `PageHero` dentro dele.

**Duas correções que só apareceram na medição**
1. O véu inicial (82/62/88% + 46% chapado) deixava o take **invisível** — a abertura lia como navy chapado e o vídeo não pagava o próprio peso. Baixou para 66/34/74% + 16%. O take já é escuro (mãos sobre teclado em luz baixa), então o contraste se sustenta com bem menos véu.
2. O vídeo parava no rodapé do header e a emenda aparecia como linha dura no meio da abertura. As camadas passaram a subir atrás do header, na distância exata do `pt` do `<main>` (`-7rem`, `-9rem` em md+).

**Medições** (build de produção)

| Cenário | Mídia servida | `currentTime` no topo | após ~1000 px de scroll |
|---|---|---|---|
| 1440×900 | `<video>` (readyState 4, 10 s) | 0 | 9,95 |
| 1366×768 | `<video>` | 0 | 9,95 |
| 390×844 | `<img>` (pôster) | — | — |
| reduced-motion 1440×900 | `<img>` (pôster) | — | — |

- Legibilidade: título `rgb(255,255,255)`, contraste médio contra o fundo real amostrado pixel a pixel na área do título — **11,0:1** no topo e **8,9:1** no meio do percurso.
- Barra "NESTA PÁGINA" visível e dentro do wrapper nos quatro cenários; `z-index` do véu = 1, conteúdo = 2, header intacto.
- Captura do primeiro paint: azul da página, **sem retângulo preto**.
- `tsc --noEmit` limpo; `lint` na linha de base (25 avisos, 0 erros); `build` ok. Sondas de teste removidas.

**Ressalva honesta:** o vídeo aparece de forma **discreta** — dá textura e movimento à abertura, mas não é uma cena em destaque. Foi decisão deliberada: com véu mais fraco o contraste do título cai abaixo do que a página usa nas outras aberturas. Se a intenção era o vídeo mais protagonista, dá para abrir mais o véu ao custo de escurecer o título com uma sombra própria — é troca de design, não bug.

## Lacunas

- assignee/project ausentes na resposta get_issue.
- Anexos, documents, releases e customer needs vazios.
- list_comments: 1 comentário; hasNextPage=false.
- Nenhum arquivo/imagem de Linear para baixar (vídeo citado está no repo, não como anexo Linear).
- Na relação SIS-105 o título da API veio com `&amp;` no HTML da descrição original da issue; no campo relatedTo o título é “Eventos & Inovação”.
- Linear não foi alterado.
