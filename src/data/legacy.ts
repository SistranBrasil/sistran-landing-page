/**
 * Conteúdo das três seções portadas da apresentação "Transformação de Legado
 * via Luminna AI" (projeto `apresentação/site`): Método (quatro movimentos),
 * Arquitetura (mosaico) e Roadmap (trilha de paradas com modal).
 *
 * É cópia fiel da fonte — `content/site.ts` daquele projeto, que por sua vez se
 * apoia em `entregas-aceite-dbs-als-aws-sds.md` e nos docs de cada frente.
 * Nenhum número, tecnologia ou estágio pode ser inventado aqui: quem muda o
 * texto muda a fonte primeiro. Respeitar o tempo verbal do estágio —
 * `entregue` (passado), `evolucao` (presente contínuo), `planejado`/
 * `negociacao` (futuro, nunca descrito como feito).
 */

export type Scene = {
  id: string
  step: string
  title: string
  text: string
}

export type MosaicTile = {
  id: string
  label: string
  layer: "slow" | "fast"
  /** Vídeo de fundo do tile, em loop. Sem ele o tile é só o degradê e o rótulo.
   *  Não confundir com o vídeo do tile de ligação (`CARRIER_VIDEO` em
   *  StackScenes), que é dirigido pelo scroll em vez de rodar solto. */
  video?: string
  /** Imagem de fundo do tile. Mesma vaga do `video` — um tile usa um ou outro,
   *  nunca os dois. */
  image?: string
  /** Endereço público da frente, onde ela tem um. O tile deixa de ser decoração e
   *  vira link: ganha seta, foco e nome acessível. Só três tiles têm; os demais
   *  seguem fora da árvore de acessibilidade, como estavam. */
  href?: string
}


export type Metric = {
  /** Como está escrito no conteúdo ("10", "1"…). O contador só anima o número. */
  value: string
  /** Unidade ao lado do número. Pode ter duas palavras ("destinos tecnológicos"). */
  unit: string
  label: string
  /** Escopo que torna o número verdadeiro. Sem ela o valor grande fica sem
   *  contexto — e o texto de abertura promete justamente o contrário. */
  note: string
}

/** Estágio da parada. O rótulo visível sai de `stageLabel`. */
export type RoadmapStage = "entregue" | "negociacao" | "evolucao" | "planejado"

/** Conteúdo do modal de uma parada: o que o card resume em duas linhas. */
export type RoadmapDetail = {
  /** Contexto da frente em uma frase. Abre o modal. */
  summary: string
  /** O que foi realizado. Itens curtos e verificáveis, um por linha. */
  done: string[]
  /** Tecnologias da frente, exibidas como chips. */
  stack: string[]
  /** Números da frente, em cartões de duas colunas abaixo dos chips. Opcional:
   *  só entram onde há valor apurado — parada sem número não ganha faixa vazia,
   *  e nenhum destes valores é estimativa. */
  figures?: { value: string; label: string }[]
  /** Por que importa — no tempo verbal do estágio, sem prometer o que é plano. */
  value: string
  /** Endereço público, só onde a frente tem um. O rótulo é opcional: sem ele o
   *  botão do modal usa `ROADMAP_LINK_LABEL`. */
  link?: { href: string; label?: string }
}

export type RoadmapStop = {
  id: string
  /** Cliente, case ou "Método Luminna" nas paradas de processo. */
  client: string
  /** Usado quando não existe arquivo de logo para a frente. */
  monogram: string
  /** Caminho em /public/imagens. Marca da frente ou peça que a identifica; nem
   *  toda parada tem uma — sem arquivo, o cartão cai no monograma. */
  logo?: string
  title: string
  stage: RoadmapStage
  /** Rótulo alternativo para a etiqueta de estágio do card e do modal, quando o
   *  texto aprovado da frente não é o de `stageLabel`. Só o rótulo VISÍVEL muda:
   *  `stage` continua sendo o estágio real, e é ele que manda na arte e na régua
   *  de tempo verbal do texto. Onde este campo aparece, a etiqueta também deixa
   *  de vir acompanhada do cliente — o rótulo entra sozinho. */
  stageTag?: string
  text: string
  /** Próximo passo documentado, quando houver. */
  next?: string
  /** Obrigatório: toda parada abre modal, nenhuma pode abrir vazia. */
  detail: RoadmapDetail
}

export const stageLabel: Record<RoadmapStage, string> = {
  entregue: "Concluído",
  negociacao: "Em negociação",
  evolucao: "Em evolução",
  planejado: "Planejado",
}

export const scenesIntro = {
  kicker: "Método | quatro movimentos",
  title: "A transformação começa quando o legado se torna explicável.",
  text: "Quatro movimentos organizam a transformação: entender o sistema atual, decidir o destino, construir com contexto e validar para evoluir. A tecnologia muda; o método permanece.",
}

export const scenes: Scene[] = [
  {
    id: "entender",
    step: "01",
    title: "Tornar o legado explicável",
    text: "Código, dados, documentos, APIs e especialistas formam um perímetro controlado de análise. O resultado é um AS IS navegável com arquitetura, regras, integrações, riscos e débitos técnicos, sem depender de acesso à produção.",
  },
  {
    id: "decidir",
    step: "02",
    title: "Escolher com evidências",
    text: "O diagnóstico técnico encontra usuários, objetivos, histórias e critérios de aceite. Com esse contexto, comparamos caminhos e definimos a arquitetura alvo com dados, nuvem, segurança, observabilidade, testes e entrega contínua.",
  },
  {
    id: "transformar",
    step: "03",
    title: "Construir com contexto",
    text: "Pessoas conduzem as decisões e agentes especializados ampliam a execução nas IDEs. Histórias, backend, frontend, documentação e testes são produzidos sobre o contexto já reconstruído.",
  },
  {
    id: "validar",
    step: "04",
    title: "Validar para evoluir",
    text: "Build, testes, segurança, revisão e deploy fazem parte da transformação desde o início. O resultado combina software modernizado, observabilidade, documentação viva, base de conhecimento e rastreabilidade.",
  },
]

/**
 * Indicadores de "Resultados", logo abaixo do Método.
 *
 * ⚠️ Os valores sao 10 / 1 / 2 / 6. Copiados da TELA da apresentacao eles
 * aparecem como 100 / 10 / 20 / 60, porque lá o numero é um contador animado e a
 * captura traz o digito em curso junto com o final. A fonte é o arquivo
 * (`content/site.ts`, `metrics`), nao a tela.
 */
export const metricsIntro = {
  kicker: "Resultados | evidências dos casos",
  title: "Resultados que conectam velocidade, qualidade e contexto.",
  text: "Os indicadores abaixo vêm de entregas reais e devem ser lidos com seu contexto: escopo da prova, arquitetura construída, automação de qualidade e estágio de implantação.",
}

export const metrics: Metric[] = [
  {
    value: "10",
    unit: "dias",
    label: "Prova tecnológica do Gateway de Pagamentos",
    note: "Prova tecnológica que levou o Gateway de Pagamentos de Java 7 e Struts em ambiente local para .NET 10, React, Azure SQL e Azure, com identidade visual do cliente, entrega contínua e Playwright validando os PRs.",
  },
  {
    value: "1",
    unit: "semana",
    label: "Prova tecnológica do Aceite Digital",
    note: "Prova tecnológica que reinterpretou o SAD em Java e Spring, orientado ao padrão AWS, e adicionou um Portal Administrativo inexistente no legado.",
  },
  {
    value: "2",
    unit: "destinos tecnológicos",
    label: "Um método",
    note: "O Gateway de Pagamentos seguiu para .NET, React e Azure; o Aceite Digital, para Java, Spring e AWS. A consistência está no método de decisão, não na preferência por uma linguagem.",
  },
  {
    value: "6",
    unit: "etapas",
    label: "Do legado à evolução",
    note: "Entender, decidir, transformar, validar, entregar e evoluir. Nenhuma delas começa na primeira linha de código.",
  },
]

/* A lista `marquee` (seis sinais do método, cada um com a logo da frente
   correspondente) morava aqui. Saiu a pedido junto com o `type Signal`: a faixa
   passou a exibir as marcas de parceiros, e a fonte delas é `src/data/clients.ts`
   — a mesma de `/parceiros-e-implementacoes`, para as duas páginas não
   divergirem. Ver `legacy/SignalMarquee`. Os arquivos `-trim` seguem em
   `public/imagens/`, usados pelo mosaico e pelo roadmap. */

export const mosaicIntro = {
  kicker: "Arquitetura | destino adequado ao contexto",
  title: "O método é consistente. A arquitetura se adapta ao contexto.",
  text: "Cada organização exige um destino diferente. A Luminna preserva o método e adapta arquitetura, dados, nuvem, segurança e engenharia às restrições e aos objetivos de cada cliente.",
}

/* SIS-68 — abertura do mosaico NA HOME.
   É campo próprio, e não uma troca no `mosaicIntro` acima, porque aquele objeto
   serve outros dois lugares onde a escrita antiga é a certa:

   · `/transformacao-legado` monta a MESMA `StackScenes`, e ali
     "Arquitetura | destino adequado ao contexto" é o cabeçalho correto da seção;
   · `/solucoes` usa `mosaicIntro.text` como parágrafo do card "Transformação de
     Legado" — texto com função descritiva, que explica o que é a página. Trocar
     o campo poria "Empresas que aderem a tecnologia..." num card que precisa
     descrever legado.

   Título e linha NÃO são escrita nova: são os da seção `Differentials`, hoje
   comentada em `src/app/page.tsx`. Vêm de
   `.claude/conteudo-site/00-home.md` (seção 3), verbatim.

   Sem `kicker`: a tag foi removida a pedido. O rótulo acessível da seção continua
   existindo — é o próprio `<h2 id="sinais-title">`, apontado por
   `aria-labelledby`.

   O título vem em três pedaços, e não como uma frase que o componente fatia:
   "Entrega com " + "Alta Performance" (em gradiente) + " e Comprometimento".
   Fatiar por `split()` faria a marcação depender de a substring bater exatamente,
   e uma vírgula a mais na revisão de texto derrubaria o realce sem erro nenhum. */
export const mosaicIntroHome = {
  tituloAntes: "Entrega com ",
  /** Sai em gradiente, como na `Differentials`. */
  tituloRealce: "Alta Performance",
  tituloDepois: " e Comprometimento",
  text: "Empresas que aderem a tecnologia em seus processos estão sempre a frente no mercado!",
}

/* SIS-70 — os quatro vídeos do mosaico apontam para reencodes `tile-*`.
   Um `<video>` não passa pelo otimizador do Next (só `<Image>` passa), então o
   arquivo chega no tamanho em que está no disco. O tile é
   `clamp(6rem, 11vw, 11rem)` com `aspect-ratio: 3/4` — no máximo 176×235 CSS px,
   ~352×470 em DPR 2 — e as fontes eram 1080×1920. Com `autoPlay`, entrar na tela
   baixava o arquivo inteiro: 40,5 MB para quatro cartões de 176px.

   Os reencodes são 360×640 (mesma proporção 9:16 da fonte, folga sobre os 352
   necessários em DPR 2), CRF 30, sem áudio, `+faststart`: 1,5 MB no total, −97%.

     ffmpeg -i azure.mp4 -an -vf "scale=360:640:flags=lanczos" -c:v libx264 \
       -profile:v main -preset slow -crf 30 -pix_fmt yuv420p -movflags +faststart tile-azure.mp4

   GOP normal aqui, de propósito — e essa é a diferença em relação aos três
   vídeos dirigidos por scroll (`hero-scroll`, `impacto-assembly-scroll`,
   `process-scroll`), que são all-intra (`-g 1`) porque cada quadro é destino de
   seek. Estes tocam em loop solto, nunca recebem `currentTime`, então não há
   motivo para pagar keyframe em todo quadro.

   Os originais em resolução cheia ficam no disco, intocados: são a fonte de
   qualquer reencode futuro, e apagá-los deixaria só a versão de 360px. */
export const mosaicTiles: MosaicTile[] = [
  // A ordem manda no layout: cada tile é posicionado por `:nth-child` no CSS.
  // Trocar o conteúdo de uma vaga muda o que aparece ali, não onde ela fica.
  { id: "azure", label: "Arquitetura Azure com Azure SQL", layer: "slow", video: "/videos/tile-azure.mp4" },
  {
    id: "sds",
    label: "SDS | sinistro, regulação e antifraude",
    layer: "fast",
    video: "/videos/tile-sdsapres.mp4",
    href: "https://sds-landing-page-six.vercel.app/",
  },
  { id: "assessment", label: "Diagnóstico do sistema legado", layer: "slow", image: "/imagens/tiles/assement.webp" },
  { id: "aws", label: "Arquitetura orientada ao padrão AWS", layer: "fast", image: "/imagens/tiles/aws.webp" },
  {
    id: "as-is-to-be",
    label: "Do AS IS à arquitetura alvo",
    layer: "slow",
    video: "/videos/tile-aistobe.mp4",
  },
  {
    id: "cicd",
    label: "Aceite Digital | modernização e nova capacidade",
    layer: "fast",
    video: "/videos/tile-sad.mp4",
    href: "https://sad-landingpage.vercel.app/",
  },
  {
    id: "tecnologias",
    label: "Tecnologias definidas pelo contexto",
    layer: "slow",
    image: "/imagens/tiles/tecnologias.webp",
  },
  {
    id: "dbs",
    /* Era "DBS". Passou a Gateway de Pagamentos porque é a mesma frente sob dois
       nomes, e a peça inteira usa o nome externo — só a LP de destino, que ainda
       se chama DBS, guarda o interno. O `id` e a arte seguem como estavam: o `id`
       é chave de posição no mosaico (os `:nth-child` do CSS dependem dela) e a
       imagem é a tela do próprio sistema. */
    label: "Gateway de Pagamentos | modernização com testes e infraestrutura",
    layer: "fast",
    image: "/imagens/tiles/dbsapre.webp",
    href: "https://landingpage-dbs.vercel.app/login",
  },
  // 9ª posição: é este tile que atravessa para a seção seguinte (ver StackScenes).
  /* A foto é a MESMA do card 01 de "Soluções de Negócios" (`escritoriosp.jpg`,
     em `src/data/solutions.ts`), e isso é intencional: este tile é o último do
     mosaico antes da seção Soluções, então repetir a imagem faz a passagem de
     "Arquitetura | destino adequado ao contexto" para "01 APIs, Projetos,
     Desenvolvimento, Sustentação e Migrações" ler como continuação, e não como
     corte. Trocar uma sem trocar a outra quebra a emenda. */
  {
    id: "microservicos",
    label: "Arquitetura modular e escalável",
    layer: "slow",
    image: "/images/home/escritoriosp.jpg",
  },
  { id: "ela", label: "ELA | análise visual de documentos", layer: "fast", image: "/imagens/tiles/ela.webp" },
]

/* Sequência de montagem presa ao scroll. A montagem é ilustração do método, não
   medição de resultado: o texto não promete número que a sequência não sustenta.

   `impacto-assembly-scroll.mp4` é o reencode all-intra do arquivo original —
   todo quadro é keyframe, senão cada seek do scroll obriga o decodificador a
   recomeçar do keyframe anterior e a imagem trava em degraus:

     ffmpeg -i impacto-assembly.mp4 -an \
       -vf "trim=start_frame=1,setpts=PTS-STARTPTS" \
       -c:v libx264 -preset slow \
       -crf 28 -g 1 -keyint_min 1 -sc_threshold 0 -pix_fmt yuv420p \
       -movflags +faststart impacto-assembly-scroll.mp4

   O pôster é o quadro de 8,6s (montagem concluída), não o primeiro: o primeiro
   é quase vazio, e é ele que aparece com movimento reduzido, quando não há seek.
*/
export const impactSequence = {
  kicker: "Desafios no desenvolvimento de software",
  /* Sem `\n` aqui: `.sequence-copy .lp-display` tem `white-space: pre-line` e
     respeitaria a quebra, mas o título tem quatro palavras e cabe numa linha
     só — uma quebra explícita o partiria ao meio. Sem ponto final. */
  title: "Sobre o Luminna AI",
  text: "O Luminna AI representa uma revolução no desenvolvimento de software, proporcionando eficiência, qualidade e rapidez.",
  src: "/videos/impacto-assembly-scroll.mp4",
  poster: "/videos/impacto-assembly-poster.jpg",
  /**
   * Três capítulos (orquestração visual, Prioridade 4).
   *
   * Antes a seção pedia 320svh — três telas e um terço de rolagem — para UMA
   * legenda: era o pior trecho da página na razão entre curso cobrado e conteúdo
   * entregue. A trilha caiu para 216svh E o conteúdo triplicou; as duas metades
   * do problema, não só a primeira.
   *
   * `at` é a fração do percurso da seção em que o capítulo é o da vez. Os três
   * cabem antes de `SHRINK[0]` (0.72, em `ImpactSequence.tsx`), porque a partir
   * dali a cena recua para card pequeno e a legenda sai — um quarto capítulo, ou
   * um terceiro atrasado, escreveria sobre o recuo. Espaçamento igual: a
   * montagem do vídeo não tem batidas marcadas o suficiente para justificar
   * frações irregulares, e inventá-las seria fingir uma sincronia que o arquivo
   * não sustenta.
   *
   * O `title`/`text` de cima seguem existindo e NÃO são redundantes: são o
   * cabeçalho da seção (o `<h2>` que `aria-labelledby` aponta). Os capítulos são
   * `<h3>`.
   */
  chapters: [
    {
      id: "compreender",
      at: 0.08,
      title: "Compreender",
      text: "Transformar contexto complexo — sistemas, regras de negócio e histórico de operação — em uma visão acionável do que precisa mudar.",
    },
    {
      id: "transformar",
      at: 0.32,
      title: "Transformar",
      text: "Converter esse conhecimento em fluxos, decisões e código: a modernização deixa de ser diagnóstico e passa a ser entrega em produção.",
    },
    {
      id: "validar",
      at: 0.56,
      title: "Validar e evoluir",
      text: "Aprender com a operação e com os resultados, para que cada ciclo devolva evidência ao próximo — e a plataforma evolua com o negócio.",
    },
  ],
}

export const roadmapIntro = {
  kicker: "Casos e etapas | da análise à evolução",
  title: "Do método às evidências, etapa por etapa.",
  text: "A jornada detalha o método, apresenta os casos que o comprovam e distingue entregas concluídas, frentes em evolução e próximos passos. Assim, a liderança entende resultado e estágio sem ambiguidade.",
}

// Logos: Aceite Digital, Gateway, SDS e Luminna têm arquivo em /public/imagens.
// As paradas de método entram por monograma.
export const roadmapStops: RoadmapStop[] = [
  {
    id: "assessment-legado",
    client: "Método Luminna",
    monogram: "AS",
    logo: "/imagens/assementlogo-trim.png",
    title: "Diagnóstico do legado",
    stage: "entregue",
    text: "Um perímetro controlado reúne código, dados, documentos, APIs e especialistas para reconstruir o sistema sem depender de produção.",
    detail: {
      summary:
        "A transformação começa pela reconstrução do conhecimento implícito no código, reduzindo incerteza antes de qualquer decisão tecnológica.",
      done: [
        "Perímetro de análise definido sem exigir ambientes ativos.",
        "Fontes de conhecimento reunidas entre código, base de desenvolvimento, documentos, APIs, especialistas e usuários.",
        "Engenharia reversa aplicada a serviços, processos, dependências, banco e integrações.",
        "Conversas e documentos incorporados à base de conhecimento.",
      ],
      stack: ["Engenharia reversa", "Base de conhecimento", "Documentação", "Agentes Luminna"],
      value:
        "O legado deixa de ser uma caixa preta. Com o sistema explicável, decisões de prazo, risco e arquitetura passam a se apoiar em evidências.",
    },
  },
  {
    id: "as-is-to-be",
    client: "Método Luminna",
    monogram: "TO",
    logo: "/imagens/asis-trim.png",
    title: "Do AS IS à arquitetura alvo",
    stage: "entregue",
    text: "Arquitetura, regras, fluxos, riscos e débitos formam o AS IS. Caminhos são comparados e o TO BE recebe dados, nuvem, segurança, observabilidade e qualidade.",
    detail: {
      summary:
        "O AS IS se torna conhecimento navegável, as alternativas são avaliadas e somente então a arquitetura alvo ganha forma.",
      done: [
        "AS IS documentado com arquitetura, regras, integrações, dados, riscos e débitos.",
        "Visão técnica cruzada com usuários, histórias e critérios de aceite.",
        "Modernização conservadora e transformação estrutural comparadas.",
        "TO BE definido com stack, dados, nuvem, segurança, observabilidade, testes, entrega contínua e frontend quando aplicável.",
      ],
      stack: ["AS IS", "TO BE", "Arquitetura", "Nuvem"],
      value:
        "A tecnologia deixa de ser ponto de partida e passa a ser consequência de uma estratégia sustentada por contexto.",
    },
  },
  {
    id: "engenharia-agentica",
    client: "Método Luminna",
    monogram: "AG",
    logo: "/imagens/luminna-logo.svg",
    title: "Engenharia apoiada por agentes",
    stage: "evolucao",
    text: "Agentes Luminna, Claude Code e Cursor apoiam histórias, backend, frontend, documentação e testes sobre o contexto reconstruído.",
    next: "Ampliar agentes especializados e melhorar a orquestração por contexto.",
    detail: {
      summary:
        "Pessoas seguem responsáveis pelas decisões; agentes especializados ampliam capacidade e velocidade sobre conhecimento validado.",
      done: [
        "Agentes Luminna integrados ao Claude Code, Cursor e às IDEs.",
        "Histórias geradas a partir do AS IS e de conversas com usuários.",
        "Backend e frontend construídos com apoio dos agentes.",
        "Documentação e testes produzidos junto com o código.",
      ],
      stack: ["Claude Code", "Cursor", "Agentes", "Contexto"],
      value:
        "Não é IA trabalhando sozinha. É engenharia orientada por contexto, com pessoas decidindo e agentes ampliando a execução.",
    },
  },
  {
    id: "quality-gates",
    client: "Método Luminna",
    monogram: "QA",
    logo: "/imagens/quality-trim.png",
    title: "Qualidade contínua no pipeline",
    stage: "entregue",
    text: "Build, testes, segurança, revisão e deploy formam uma única esteira. O software nasce validado, não apenas reescrito.",
    detail: {
      summary:
        "A esteira valida o novo software desde o início e transforma qualidade em evidência repetível.",
      done: [
        "Commit, build, testes unitários, integração e testes de ponta a ponta conectados.",
        "Segurança verificada no pipeline.",
        "PRs validados automaticamente, com Playwright no Gateway de Pagamentos.",
        "Deploy executado pela mesma esteira que comprova a qualidade.",
      ],
      stack: ["CI/CD", "Playwright", "Testes e2e", "Segurança"],
      value:
        "Qualidade não é uma etapa final. É o mecanismo que permite evoluir por evidências e diferencia transformação de reescrita apressada.",
    },
  },
  {
    id: "case-aceite-digital",
    client: "Bradesco",
    monogram: "SAD",
    logo: "/imagens/sad-trim.png",
    title: "Aceite Digital | prova tecnológica em uma semana",
    stage: "entregue",
    text: "Prova tecnológica que levou .NET Framework e SQL Server em ambiente local para Java, Spring e arquitetura orientada ao padrão AWS, além de criar um novo Portal Administrativo.",
    detail: {
      summary:
        "Middleware que orquestra o aceite digital de propostas de seguro entre sistemas de origem, validações, notificações, canais digitais, documentos, débitos e integrações corporativas.",
      done: [
        "Sistema e fluxo reinterpretados com documentação do AS IS.",
        "Caminho de modernização definido em Java e Spring, aderente ao padrão do Bradesco.",
        "Arquitetura orientada à AWS.",
        "Portal Administrativo criado para uma necessidade não atendida pelo legado.",
        "Automação e pipeline incorporados.",
      ],
      stack: ["Java", "Spring", "AWS", "Portal Administrativo"],
      /* A ordem das duas provas foi trocada a pedido, e o texto acompanha: os
         ordinais e a referência cruzada dizem qual veio antes, e mantê-los como
         estavam faria a vitrine anunciar a "segunda evidência" antes da
         primeira. Só isso mudou nos dois textos. */
      value:
        "O segundo caso comprovou a flexibilidade do método: destino tecnológico diferente e ganho funcional adicional, sem impor uma stack única.",
      link: {
        href: "https://sad-landingpage.vercel.app/",
        label: "Conhecer o caso Aceite Digital",
      },
    },
  },
  {
    id: "case-gateway",
    client: "Caso Gateway de Pagamentos",
    monogram: "GW",
    logo: "/imagens/GatewayPag-trim.png",
    title: "Gateway de Pagamentos | prova tecnológica em 10 dias",
    stage: "entregue",
    text: "Prova tecnológica que levou Java 7 e Struts em ambiente local para .NET 10, React, Azure SQL e Azure, com identidade visual do cliente, entrega contínua e Playwright nos PRs.",
    /* Herdado da parada do DBS, removida a pedido por ser a mesma frente sob o
       nome interno: o próximo passo, os números e o botão de acesso viviam lá e
       eram o que faltava aqui. Nenhum número foi recalculado. */
    next: "Implantação da aplicação modernizada em produção.",
    detail: {
      summary:
        "Aplicação responsável por receber solicitações internas e executar transações de cartão com adquirentes e processadoras como Braspag e Cielo.",
      done: [
        "AS IS reconstruído a partir do código e do banco de desenvolvimento, sem acesso a ambientes ativos.",
        "Regras, integrações e fluxos documentados com apoio de usuários.",
        "Dois caminhos de modernização comparados.",
        "Prova construída em .NET 10, React, Azure SQL e Azure.",
        "Identidade visual, entrega contínua e Playwright incorporados aos PRs.",
      ],
      stack: [".NET 10", "React", "Azure SQL", "Playwright"],
      figures: [
        { value: "7", label: "documentos auditados" },
        { value: "197", label: "testes automatizados no pipeline" },
        { value: "16+", label: "documentos de AS IS e TO BE" },
        { value: "10d", label: "modernização técnica em 10 dias" },
      ],
      value:
        "A prova mostrou que o legado pode ser traduzido em uma base moderna e operacionalizável em 10 dias, desde que contexto, escopo e qualidade estejam explícitos.",
      link: {
        href: "https://landingpage-dbs.vercel.app/login",
        label: "Acessar a aplicação",
      },
    },
  },
  {
    id: "entrega-ampliada",
    client: "Método Luminna",
    monogram: "EV",
    logo: "/imagens/luminna-logo.svg",
    title: "Do legado à evolução contínua",
    stage: "evolucao",
    text: "A entrega combina sistema modernizado, documentação viva, base de conhecimento, testes, pipeline, rastreabilidade e contexto preservado.",
    next: "Sustentar a evolução sobre documentação, testes e contexto preservados.",
    detail: {
      summary:
        "A transformação ideal termina com uma base sustentável, não apenas com novo código fonte.",
      done: [
        "Sistema modernizado operando em nuvem com observabilidade.",
        "Documentação viva e base de conhecimento mantidas com o produto.",
        "Testes e pipeline incorporados à entrega.",
        "Rastreabilidade e contexto preservados para as equipes futuras.",
      ],
      stack: ["Documentação viva", "Base de conhecimento", "Pipeline", "Rastreabilidade"],
      value:
        "O resultado não é somente um sistema novo. É uma arquitetura que pode evoluir sem reiniciar o diagnóstico a cada mudança.",
    },
  },
  /* A parada "Case — DBS" saiu a pedido: era a mesma frente do Gateway de
     Pagamentos sob o nome interno da aplicação, e duas paradas contando a mesma
     entrega enfraqueciam as duas. O que ela tinha de exclusivo — próximo passo,
     `figures` e botão de acesso — passou para `case-gateway`. */
  /*
   * ALS: a única parada de DIAGNÓSTICO da vitrine, e o tempo verbal precisa dizer
   * isso. Nada aqui foi implementado — o que foi entregue é o assessment e a
   * estratégia. Escrever "monolito dissolvido" ou "vulnerabilidades corrigidas"
   * seria erro factual em material que vai para cliente: o monolito segue de pé e
   * os apontamentos seguem abertos. Por isso `stage: "negociacao"`, e por isso o
   * `value` fala de visibilidade e caminho, não de execução.
   *
   * Sem `figures`: o material de origem não traz número apurado, e a régua do tipo
   * é clara — parada sem número não ganha faixa vazia, e nada aqui é estimativa.
   * Os seis países são plano, não resultado, e ficam em `next`.
   *
   * `logo`: a arte é o lockup "ALS by Assurant" — a marca da aplicação já vem com
   * a do cliente embutida. Não confundir com `assementlogo.png`, que é a marca do
   * assessment e rotularia a frente errado.
   */
  {
    id: "case-als",
    client: "Assurant",
    monogram: "ALS",
    logo: "/imagens/als.png",
    title: "ALS | diagnóstico e modernização",
    stage: "negociacao",
    /* Etiqueta pedida pelo cliente da vitrine: no card e no modal a frente se
       apresenta como "Modernização". O estágio real segue `negociacao` — é o que
       sustenta o tempo verbal do texto e do `next`, onde nada aparece como
       executado. */
    stageTag: "Modernização",
    text: "Diagnóstico completo de uma aplicação monolítica, com mapeamento de custos, vulnerabilidades e estratégia de modernização em microserviços.",
    next: "Planos traçados e apresentados ao cliente; aguardando negociação para implementação, com seguimento previsto em seis países.",
    detail: {
      summary:
        "Assessment completo do ALS e estratégia de modernização de uma aplicação monolítica, cobrindo ambientes, segurança e custos.",
      done: [
        "Análise e documentação do AS IS da aplicação ALS.",
        "Avaliação dos ambientes AWS HML e PRD com identificação de pontos de melhoria.",
        "Assessment de vulnerabilidades de segurança.",
        "Avaliação e análise de custos da infraestrutura AWS com proposta de otimização.",
        "Estratégia de dissolução do monolito e do banco de dados único.",
      ],
      stack: ["AWS", "Microserviços", "Assessment", "IaC"],
      value:
        "A entrega forneceu ao cliente visibilidade completa sobre o estado atual, riscos de segurança, custos e caminhos claros de evolução. Base sólida para decisões de modernização com menor exposição a surpresas técnicas e financeiras.",
      link: {
        href: "https://landingpage-als-asis.vercel.app",
        label: "Acessar ALS · AS IS",
      },
    },
  },
  {
    id: "sds-sinistro-regulacao",
    client: "SDS",
    monogram: "SDS",
    logo: "/imagens/logo-sds.png",
    title: "SDS | automação do fluxo de sinistro",
    stage: "evolucao",
    text: "SQS integra o fluxo de forma assíncrona, enquanto o orquestrador trata pendências, elegibilidade documental e decisão final.",
    next: "Ampliar a esteira automática de análise documental no fluxo de sinistro.",
    detail: {
      summary:
        "Evolução do fluxo de sinistro com integração assíncrona, orquestração de pendências e análise documental.",
      done: [
        "Comunicado e Regulação conectados.",
        "SQS adotado para integração assíncrona.",
        "Pendências, elegibilidade de documentos e decisão final centralizadas no orquestrador.",
        "WAF, load balancer, Terraform, KMS e SSM incorporados à infraestrutura.",
        "OCR integrado aos documentos enviados pelos segurados.",
      ],
      stack: ["SQS", "OCR", "Terraform", "KMS"],
      value:
        "A elegibilidade de documentos e a decisão final deixam de depender de conferência manual em cada etapa e passam a ser coordenadas pelo orquestrador.",
      link: {
        href: "https://sds-landing-page-six.vercel.app/",
        label: "Conhecer o fluxo SDS",
      },
    },
  },
  {
    id: "sds-antifraude",
    client: "SDS",
    monogram: "SDS",
    logo: "/imagens/logo-sds.png",
    title: "SDS | análise documental e apoio antifraude",
    stage: "evolucao",
    text: "ELA, metadados, tipografia, mapas de calor e OCR com Textract analisam documentos de identificação e registro civil.",
    next: "Incorporar modelos de aprendizado de máquina e novas ferramentas periciais após validação de desempenho.",
    detail: {
      summary:
        "Ferramentas automáticas de análise pericial apoiam a validação documental no fluxo de sinistro.",
      done: [
        "ELA aplicado às imagens enviadas.",
        "Metadados e tipografia analisados.",
        "Mapas de calor gerados para regiões suspeitas.",
        "Documentos de identificação e registro civil incluídos.",
        "OCR executado com Textract.",
      ],
      stack: ["ELA", "Textract", "Heatmap", "Antifraude"],
      value:
        "Possíveis adulterações passam a ser apontadas por evidências visuais e de metadados, ampliando a capacidade de triagem e priorização.",
      link: {
        href: "https://sds-landing-page-six.vercel.app/",
        label: "Conhecer a análise documental do SDS",
      },
    },
  },
]

