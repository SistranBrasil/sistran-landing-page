/**
 * SIS-100 — mapa de seções por rota, fonte única do navegador lateral
 * (`ui/ScrollSpy`).
 *
 * O componente não conhece rota nenhuma: ele recebe a lista daqui pelo
 * `pathname`. Quem quiser incluir uma seção no navegador acrescenta uma linha
 * neste arquivo — não há segunda lista para desincronizar.
 *
 * ── Como o `id` é usado ──────────────────────────────────────────────────────
 * O `id` é ao mesmo tempo o alvo do link (`href="#id"`) e o que o
 * `IntersectionObserver` observa. Boa parte das rotas guarda esses ids no `<h2>`
 * da seção (é o `aria-labelledby` que já existia), e não na `<section>` — o
 * ScrollSpy resolve isso subindo para a `<section>` mais próxima antes de
 * observar (ver a nota lá). Então NÃO é preciso mover id nenhum de lugar, e
 * nenhuma âncora publicada muda de destino.
 *
 * ── Critérios do que entra ───────────────────────────────────────────────────
 * • Rota com menos de 3 seções não aparece aqui: com duas bolinhas o indicador
 *   não orienta, só ocupa a borda. Ficam de fora `/blog` (hero + publicações),
 *   `/politica-de-privacidade`,
 *   `/relatorio-de-transparencia-salarial` e as rotas dinâmicas
 *   (`/blog/[slug]`, `/solucoes/[slug]`), que nem chegam a ter chave aqui.
 * • O `ContactCTA` ("Fale com a Gente!") NUNCA entra, em nenhuma rota: ele
 *   repete no fim de quase toda página e é rodapé de conversão, não seção de
 *   conteúdo. Listá-lo faria o último item do navegador ser o mesmo em nove
 *   telas diferentes.
 * • Seções comentadas na home (`Differentials`, `MetricsStrip`, `ScrollSpine`,
 *   `SolutionsToMetrics`) não entram — um item apontando para âncora inexistente
 *   nunca acende e o clique não leva a lugar nenhum, que foi o defeito que tirou
 *   `quem-somos` e `diferenciais` da lista antiga do componente.
 * • Rótulo é ABREVIAÇÃO, não título: a coluna é estreita e "Transformação de
 *   Legado" ou "Principais Soluções" estouram a largura. O rótulo curto vive
 *   aqui; o título completo continua no `<h2>` da seção.
 * • `/latam` é a única rota com rótulos em espanhol, porque a página inteira
 *   está em espanhol.
 * • `tom?: 'claro' | 'medio'` NÃO pinta nada. É sinal só do indicador lateral
 *   (`ScrollSpy`): o nav é `fixed` e a cascata do CSS não o alcança, então ele
 *   precisa saber se a seção ativa é clara para trocar rótulo/traço/foco para o
 *   par adequado. O valor descreve o fundo na **margem esquerda** (onde a
 *   coluna vive: `fixed left-3`), não o meio nem a direita da seção — um hero
 *   claro à esquerda com vídeo à direita continua `claro`. `medio` é o azul
 *   intermediário em que nem o branco nem o navy padrão fecham 4,5:1; ele usa
 *   a combinação medida própria, sem placa atrás do texto. Ausente = escuro,
 *   que é a maioria. Superfícies que já são `.section-light` não precisam de
 *   `claro`: o ScrollSpy mantém `closest('.section-light')` como reserva. Um
 *   `tom` explícito sempre ganha da reserva (SIS-181).
 */
import { ACCELERATOR_PAGES, idDoBloco } from '@/data/acceleratorPages';

export type PageSection = {
  /** Alvo do link e âncora observada. Ver a nota sobre `<h2>` acima. */
  id: string;
  /** Rótulo curto exibido na coluna. */
  label: string;
  /** Tom do FUNDO da seção na margem esquerda, onde o indicador vive.
   *  `medio` = azul intermediário que exige o terceiro par medido; ausente =
   *  escuro. Só do contraste do ScrollSpy, sem placa nem pintura na página. */
  tom?: 'claro' | 'medio';
};

export const PAGE_SECTIONS: Readonly<Record<string, readonly PageSection[]>> = {
  '/': [
    /* SIS-181 — hero-sheet `#f4f8fc` na margem esquerda (vídeo à direita). Não
       é `.section-light`; sem `tom` o rótulo saía branco e sumia. */
    { id: 'top', label: 'Início', tom: 'claro' },
    { id: 'solucoes', label: 'Soluções' },
    { id: 'resultados', label: 'Números' },
    { id: 'contato', label: 'Contato' },
    { id: 'social', label: 'Social' },
  ],
  '/quem-somos': [
    { id: 'topo', label: 'Início' },
    { id: 'escritorios', label: 'Escritórios' },
    { id: 'diferenciais-6', label: 'Diferenciais' },
    { id: 'como-agimos', label: 'Como Agimos' },
    { id: 'premiacoes', label: 'Premiações' },
    { id: 'isg', label: 'ISG' },
    { id: 'por-que-sistran', label: 'Por que Sistran' },
    /* SIS-181 — a seção clara vaza sobre o azul intermediário do CTA na margem;
       o pior raster foi rgb(26 127 197), então o tom explícito ganha do
       `.section-light` durante a sobreposição. */
    { id: 'mais-quem-somos', label: 'Conheça também', tom: 'medio' },
  ],
  /* Pedido em chat: «deve ser verificado os Início / Tecnologia / Serviços /
     Consultoria … que deve ter os nomes da seção e a cor contrária da seção para
     que seja possível visualizar». Medi as quatro paradas na margem esquerda
     (pixel COMPOSTO, porque nesta rota o fundo é o plano da `<main>` e
     `backgroundColor` devolve `transparent` — SIS-204), a 1440px:

       topo                   fundo rgb(12 36 60)    branco   → 15,75:1  ok
       tecnologia-disruptiva  fundo rgb(231 242 251)  navy     → 14,31:1  ok
       servicos-diferenciais  fundo rgb(21 53 77)     branco   → 12,74:1  ok
       consultoria            fundo rgb(244 250 255)  BRANCO   →  1,05:1  ILEGÍVEL

     A falha era só a última, e a causa é o atalho: sem `tom`, o ScrollSpy cai em
     `closest('.section-light')`, e a seção de Consultoria não tem essa classe —
       a cor dela (`#eff8fe`) vem de `consultoria.css`. Então ela era lida
     como escura e o rótulo saía branco sobre quase-branco.

     `tecnologia-disruptiva` ganha o tom EXPLÍCITO mesmo já estando legível: ela
     acerta por acaso, via o mesmo `closest` que a SIS-204 esvaziou (a classe
     `.section-light` continua no nó, mas não pinta mais nada nesta rota) — e
     tom explícito sempre vence o atalho (SIS-181). Confiar no fallback aqui é
     deixar a legibilidade dependendo de uma classe que já não significa cor.

     `topo` e `servicos-diferenciais` seguem SEM chave, que é o valor certo: as
     duas são escuras de verdade na margem e o branco padrão é o contraste alto
     medido acima. */
  '/solucoes': [
    { id: 'topo', label: 'Início' },
    { id: 'tecnologia-disruptiva', label: 'Tecnologia', tom: 'claro' },
    { id: 'servicos-diferenciais', label: 'Serviços' },
    { id: 'consultoria', label: 'Consultoria', tom: 'claro' },
  ],
  '/parceiros-e-implementacoes': [
    { id: 'topo', label: 'Início' },
    { id: 'parceiros', label: 'Parceiros' },
    /* SIS-181 — a seção "volta ao escuro", mas o azul visível na margem mede
       rgb(21 125 196): branco e navy padrão ficam abaixo de 4,5:1. */
    { id: 'implementacoes', label: 'Implementações', tom: 'medio' },
    /* SIS-202 — era `tom: 'medio'` porque a trilha antiga ficava DENTRO da seção
       escura. A seção agora é a mesma `.lp-section--cream` de
       `/transformacao-legado`, ou seja `--cream` (#e2effa) na margem esquerda e
       sem `.section-light` — a mesma leitura que a SIS-181 tinha registrado para
       o `#roadmap` daquela rota, então o tom passa a ser o mesmo: 'claro'.
       (SIS-279 apagou a rota `/transformacao-legado`; a MEDIÇÃO continua valendo
       porque é da classe `.lp-section--cream`, que este arquivo ainda usa — só o
       apontador «logo abaixo» é que morreu com a chave.)
       O `label` fica: 'Linha do tempo' continua sendo o nome desta seção — na
       correção da issue (opção 2) só o LAYOUT vem do legado, e o cabeçalho é o
       desta rota, com este mesmo rótulo como título. A âncora `#linha-do-tempo`
       também fica — é a que esta rota
       já publicava, e é ela que o `id` do componente recebe. */
    { id: 'linha-do-tempo', label: 'Linha do tempo', tom: 'claro' },
  ],
  '/latam': [
    { id: 'topo', label: 'Inicio' },
    { id: 'latam-numeros', label: 'Números' },
    { id: 'latam-soluciones', label: 'Soluciones' },
    { id: 'latam-experiencia', label: 'Experiencia' },
    { id: 'latam-aseguradoras', label: 'Aseguradoras' },
    { id: 'latam-noticias', label: 'Noticias' },
    { id: 'latam-contacto', label: 'Contacto' },
    { id: 'latam-rrhh', label: 'RRHH' },
  ],
  '/contato': [
    { id: 'topo', label: 'Início' },
    { id: 'contato-titulo', label: 'Contato' },
    { id: 'onde-estamos', label: 'Onde Estamos' },
    { id: 'time-sistran', label: '#timeSISTRAN' },
  ],
  '/esg': [
    { id: 'topo', label: 'Início' },
    /* SIS-181 — azul intermediário medido na margem esquerda: rgb(21 125 196). */
    { id: 'esg-environment', label: 'Environment', tom: 'medio' },
    { id: 'esg-social', label: 'Social' },
    /* SIS-181 — azul intermediário medido na margem esquerda: rgb(22 129 201). */
    { id: 'esg-governance', label: 'Governance', tom: 'medio' },
  ],
  '/sistran-labs': [
    { id: 'topo', label: 'Início' },
    /* SIS-122 — âncora nova. Os três parágrafos que estavam dentro do
       `description` da abertura passaram a ser uma seção própria em
       `src/app/sistran-labs/page.tsx`, e sem esta linha ela seria a única seção
       com conteúdo da rota fora do navegador lateral. O título dela é `sr-only`
       (o rótulo visível da parada é este aqui), pelo motivo escrito na página. */
    { id: 'labs-o-que-e', label: 'O Labs' },
    /* SIS-294 — A PARADA «Ambiente» SAI, e sai porque a seção que ela nomeava
       deixou de existir: as três fotos passaram a viver dentro da intro, uma por
       parágrafo, e o `id="labs-ambiente"` foi com a casca (o registro completo
       está no lugar em que a seção estava, em `src/app/sistran-labs/page.tsx`).
       Parada apontando para `id` ausente não é enfeite inofensivo: o ScrollSpy
       resolve cada item por `getElementById`, então ela ficaria eternamente
       inativa e o clique não rolaria para lugar nenhum.
       Não há parada nova em troca — as fotos agora SÃO a seção `labs-o-que-e`
       logo acima, e um segundo rótulo para o mesmo trecho de página daria duas
       paradas acendendo juntas.
       A linha anterior, para o registro:
         { id: 'labs-ambiente', label: 'Ambiente' },
       e o comentário dela dizia que a âncora nascia «na posição em que a seção
       nasceu na página (entre a intro e as soluções)», com o rótulo servindo de
       único nome visível de uma seção de título `sr-only`. */
    /* SIS-181 — azul intermediário medido na margem esquerda: rgb(21 125 196). */
    { id: 'labs-solucoes', label: 'Soluções', tom: 'medio' },
    { id: 'labs-principais', label: 'Principais' },
  ],
  /* SIS-116 · item 2 — a rota ENTRA, e a exclusão que a nomeava no cabeçalho
     deste arquivo saiu junto: ela estava certa enquanto a página era só a
     abertura (duas "seções", `PageHero` e `ContactCTA`), e a página passou a ter
     três seções de conteúdo com `id` e nome acessível.
     Os ids são os das `<section>`; o `aria-labelledby` de cada uma aponta para o
     `<h2>`, que tem id próprio (`...-titulo`) — daí o ScrollSpy não precisar
     subir para a `<section>` nesta rota, como faz nas outras.
     Rótulos abreviados: os títulos completos ("Formar especialistas em
     tecnologia de ponta") estouram a largura da coluna. */
  '/sistran-university': [
    { id: 'topo', label: 'Início' },
    { id: 'university-programa', label: 'O Programa' },
    /* SIS-181 — azul intermediário medido na margem esquerda: rgb(21 125 196). */
    { id: 'university-unidep', label: 'Unidep', tom: 'medio' },
    { id: 'university-numeros', label: 'Números' },
  ],
  /* SIS-279 (slot reaproveitado 18/09) — a chave `/transformacao-legado` saiu
     porque a ROTA foi apagada, e a issue proíbe deixar rastro comentado no lugar
     dela. Com a chave presente e a página fora do ar, o ScrollSpy anunciaria
     seções de uma rota que devolve 404. O que morreu aqui foi a lista de itens
     («Início», «Arquitetura», «Roadmap») e a nota da SIS-119 que a justificava —
     a íntegra está no histórico do git, que é o lugar dela agora.

     Os DOIS ids de conteúdo continuam existindo: `#sinais` em
     `legacy/StackScenes.tsx` e `#roadmap` em `legacy/RoadmapTrail.tsx`. Eles
     seguem sendo montados em `/parceiros-e-implementacoes` e na home — o que
     acabou foi a rota que os listava aqui, não os componentes.

     Nota que ainda vale para quem religar algo do legado: a seção «Método»
     (`#sistema`) segue inteira dentro de um comentário em `StackScenes`, retirada
     a pedido, e não chega ao DOM. Listá-la em qualquer rota daria um item que
     nunca acende. */
  '/eventos-inovacao': [
    { id: 'topo', label: 'Início' },
    { id: 'eventos', label: 'Eventos' },
    { id: 'social', label: 'Social' },
  ],
  '/trabalhe-conosco': [
    { id: 'topo', label: 'Início' },
    /* SIS-137 — "Currículo" saiu do navegador, e o `id` NÃO saiu da página.
       O cartão do `#curriculo` subiu para dentro da abertura, ao lado da escrita.
       Com isso "Início" (`#topo`, o `PageHero`) e "Currículo" passariam a rolar
       para o mesmo lugar: em 1440×900 os dois ficam na primeira tela, com poucas
       dezenas de pixels entre as âncoras. Dois itens de menu que levam ao mesmo
       ponto são pior que um — o ScrollSpy pisca entre eles na rolagem e o segundo
       clique não faz nada visível.
       A âncora continua existindo em `trabalhe-conosco/page.tsx` (com
       `scroll-mt-32`), então link externo para `#curriculo` segue chegando ao
       conteúdo certo. Se o formulário voltar (ver SIS-117) e a seção descer para
       fora da abertura, este item volta descomentando a linha abaixo.

       SIS-223 — a CONDIÇÃO ESCRITA ACIMA ACONTECEU, e por isso o item está
       descomentado. O formulário voltou (`CurriculoCard`) e a seção nasceu FORA da
       abertura, depois do bloco de vídeo: `#curriculo` agora é o `id` dela, não
       mais o do cartão do LinkedIn (que passou a `#como-chegar`). O motivo de o
       item ter saído — duas âncoras na mesma primeira tela — deixou de existir: são
       duas seções irmãs, separadas por uma abertura de altura de viewport. */
    { id: 'curriculo', label: 'Currículo' },
    { id: 'social', label: 'Social' },
  ],
};

/**
 * Seções da rota, ou lista vazia. Vazio é o caso normal — rota curta, página
 * legal ou rota dinâmica — e o ScrollSpy simplesmente não renderiza.
 *
 * O `pathname` chega do Next com ou sem barra final dependendo da navegação;
 * normalizar aqui evita que a mesma rota tenha duas chaves.
 */
/* SIS-120 — as sete rotas de `/solucoes/[slug]` entram, e entram DERIVADAS.
   O critério do cabeçalho ("rotas dinâmicas nem chegam a ter chave aqui")
   continua valendo como está escrito: uma CHAVE por slug seria uma segunda lista
   de seções, escrita à mão, ao lado da que já existe em `acceleratorPages.ts` —
   e no dia em que um bloco fosse acrescentado lá, a bolinha apontaria para uma
   âncora que a página não tem (o defeito que este arquivo já registra). Aqui a
   lista sai do próprio conteúdo: cada bloco COM título é uma parada, com o id
   vindo de `idDoBloco`, a mesma função que a página usa para escrever o `id`.
   O outro critério do cabeçalho — menos de 3 seções não aparece — é aplicado
   abaixo, e ele exclui `qa-integrado` e `connect-api`, que têm um título só.
   Calculado UMA vez na carga do módulo, e não por chamada: o retorno vai para a
   lista de dependências de um `useEffect` no ScrollSpy, então precisa ser o mesmo
   array a cada render — é a mesma razão da constante `VAZIO` logo abaixo. */
/* Uma constante, e não um `[]` literal no `??`: o retorno vai direto para a lista
   de dependências de um `useEffect` no ScrollSpy, e um array novo a cada render
   faria o efeito religar a cada render nas rotas sem mapa.
   Declarado ANTES de `SECOES_DE_ACELERADOR` porque aquele mapa é montado na carga
   do módulo e usa esta constante como valor: `const` não é içado com valor, e
   deixá-lo embaixo derrubava o módulo inteiro num `ReferenceError`. */
const VAZIO: readonly PageSection[] = [];

/* SIS-181 — as paradas continuam DERIVADAS de `ACCELERATOR_PAGES`; este mapa
   acrescenta somente o tom medido na margem esquerda. Não duplica id nem
   rótulo. As demais paradas derivadas são escuras e seguem sem chave.
   Fundos raster a 1440:
   match/o-que-faz: rgb(21 127 197);
   lumina/beneficios, fast/o-que-oferece e smart-miner/onde-usar:
   rgb(21 125 196);
   fast/beneficios: rgb(22 129 201);
   guru/de-onde-pode-ser-acessada: rgb(22 127 199). */
const TOM_MEDIO_DE_ACELERADOR: Readonly<Record<string, ReadonlySet<string>>> = {
  'match-ai': new Set(['o-que-o-match-ai-faz']),
  /* SIS-280 — o `lumina-ai` SAIU DESTE MAPA, pelo mesmo motivo que o `fast`
     (SIS-286), o `smart-miner` (SIS-279) e o `guru-de-seguros` (SIS-280) saíram,
     e com uma mudança a mais: a chave também trocou de grafia. A linha era:

       'lumina-ai': new Set(['beneficios']),

     Duas coisas aconteceram de uma vez. A slug passou a ser `luminna-ai` (dois n),
     então a chave velha não casaria com `p.id` nenhum e o tom seria ignorado em
     silêncio. E «Benefícios» deixou de ser o azul médio do raster genérico
     (rgb(21 125 196), medido na SIS-181 e ainda citado no comentário acima): no
     corpo próprio da slug (`components/solucoes/LuminnaAiPagina.tsx`) essa faixa é
     ESCURA, e escuro é a AUSÊNCIA de chave neste par de mapas. As duas paradas
     claras da slug estão no mapa de baixo. */
  /* SIS-286 — o `fast` SAIU DESTE MAPA e foi para o de baixo. A linha era:

       fast: new Set(['o-que-o-fast-oferece', 'beneficios']),

     e o motivo de sair é que o fundo daquelas duas paradas MUDOU: elas eram o
     azul médio da rota (o raster rgb(21 125 196) / rgb(22 129 201) que a SIS-181
     mediu) e hoje são `.section-light` no corpo próprio da slug
     (`components/solucoes/FastPagina.tsx`). Manter `medio` deixaria o rótulo do
     indicador na tinta de fundo médio sobre faixa clara. Remedido — os números
     estão no comentário da issue. */
  /* SIS-279 — o `smart-miner` SAIU DESTE MAPA e foi para o de baixo, pelo mesmo
     motivo que o `fast` saiu na SIS-286. A linha era:

       'smart-miner': new Set(['onde-usar-o-smart-miner']),

     Aquela parada era o azul médio da rota (o raster rgb(21 125 196) que a SIS-181
     mediu e que o comentário acima ainda cita) e hoje é `.section-light` no corpo
     próprio da slug (`components/solucoes/SmartMinerPagina.tsx`) — e ela não está
     só: «O que é o Smart Miner?» virou clara também, então a slug entra no mapa de
     baixo com DUAS paradas. Manter `medio` deixaria o rótulo do indicador na tinta
     de fundo médio sobre faixa clara. Remedido — os números estão no comentário da
     issue. */
  /* SIS-280 — o `guru-de-seguros` SAIU DESTE MAPA e foi para o de baixo, pelo mesmo
     motivo que o `fast` (SIS-286) e o `smart-miner` (SIS-279) saíram. A linha era:

       'guru-de-seguros': new Set(['de-onde-pode-ser-acessada']),

     Aquela parada era o azul médio da rota (o raster rgb(22 127 199) que a SIS-181
     mediu e que o comentário acima ainda cita) e hoje é `.section-light` no corpo
     próprio da slug (`components/solucoes/GuruDeSegurosPagina.tsx`) — e ela não está
     só: «Como funciona?» é clara também, então a slug entra no mapa de baixo com as
     DUAS paradas que tem. Manter `medio` deixaria o rótulo do indicador na tinta de
     fundo médio sobre faixa clara. Remedido — os números estão no comentário da
     issue. */
};

/* SIS-286 — TOM CLARO por slug, irmão do mapa acima e pelo mesmo contrato: não
   duplica id nem rótulo, só acrescenta o tom medido na margem esquerda. Existe
   porque o `fast` passou a ter faixas `.section-light` de verdade — as três
   paradas abaixo —, e `claro` é o valor que o indicador já tem para isso (é o que
   `/quem-somos` usa na parada «top»). As paradas escuras seguem sem chave. */
const TOM_CLARO_DE_ACELERADOR: Readonly<Record<string, ReadonlySet<string>>> = {
  fast: new Set([
    'o-que-o-fast-oferece',
    'beneficios',
    'monitore-e-aprimore-seus-processos',
  ]),
  /* SIS-279 — as DUAS primeiras paradas do `smart-miner`. «Como usar o Smart
     Miner?» é a faixa ESCURA do corpo próprio e por isso fica sem chave, que é o
     contrato deste par de mapas (escuro = ausência). */
  'smart-miner': new Set(['o-que-e-o-smart-miner', 'onde-usar-o-smart-miner']),
  /* SIS-280 — as DUAS paradas do `guru-de-seguros`, que são TODAS as que a slug tem
     (o dado só traz dois `heading`). As duas faixas que elas ancoram são
     `.section-light` no corpo próprio; a faixa escura da rota é a das falas da Alexa,
     cujo título é DERIVADO e não `heading` de bloco — logo ela não é parada, e não há
     o que ficar sem chave aqui. */
  'guru-de-seguros': new Set(['como-funciona', 'de-onde-pode-ser-acessada']),
  /* SIS-280 — as paradas CLARAS do `luminna-ai`. A slug tem três `heading` (logo
     quatro paradas com o «topo», e o indicador monta), mas só estas duas ancoram
     faixa `.section-light` no corpo próprio; «Benefícios» é a faixa escura e por
     isso não aparece em mapa nenhum. A chave tem dois n porque a slug tem — ver o
     bloco SIS-280 no mapa de cima. */
  'luminna-ai': new Set(['desafios-no-desenvolvimento-de-software', 'integracao-versatil']),
};

const SECOES_DE_ACELERADOR: Readonly<Record<string, readonly PageSection[]>> = Object.fromEntries(
  ACCELERATOR_PAGES.map((p) => {
    const paradas: PageSection[] = [
      { id: 'topo', label: 'Início' },
      ...p.blocks
        .filter((b) => b.heading)
        .map((b): PageSection => {
          const id = idDoBloco(b.heading!);
          return {
            id,
            label: b.navLabel ?? b.heading!,
            /* Médio primeiro e claro depois é indiferente aqui porque nenhum id
               está nos dois mapas; a ordem só importaria se estivesse, e aí o
               erro seria o mapa, não a leitura. */
            ...(TOM_MEDIO_DE_ACELERADOR[p.id]?.has(id) ? { tom: 'medio' as const } : {}),
            ...(TOM_CLARO_DE_ACELERADOR[p.id]?.has(id) ? { tom: 'claro' as const } : {}),
          };
        }),
    ];
    return [p.id, paradas.length >= 3 ? paradas : VAZIO];
  }),
);

/* SIS-170 — AO ACRESCENTAR OU RENOMEAR RÓTULO AQUI: o limiar de 1439,98px que
   recolhe o rótulo do indicador lateral foi REMEDIDO na Geist contra o rótulo
   mais largo deste arquivo (`/quem-somos`, "Conheça também"). Tinta 131,53px
   antes (Inter) → 127,08px depois (Geist); borda/caixa 169,53px → 165,08px;
   limiar mínimo calculado 1430,16px. O breakpoint 1439,98px foi preservado
   com folga. Rótulo novo mais comprido empurra esse limiar, e a conta não é
   derivável em CSS porque depende do texto. A medição e o motivo estão no
   bloco SIS-170 de `src/app/globals.css`. O aviso fica aqui, e não só lá,
   porque é aqui que se mexe. */
/* SIS-121 — IDIOMA DOS RÓTULOS, por rota.
   O `ScrollSpy` é irmão do `<main>` em `PageShell.tsx` (é `fixed`, e morreria sob
   ancestral com `transform` — está escrito lá), e o `lang="es"` de `/latam` está
   DENTRO do main, em `latam/page.tsx`. Resultado: acima de 1280px, onde a nav de
   âncoras da página é `xl:hidden` e o indicador lateral é a única navegação da
   rota, os oito rótulos em espanhol e o nome acessível da `<nav>` eram lidos com
   pronúncia de português — o mesmo argumento fonético que manteve o `ContactCTA`
   em português fora desta página, agora invertido.
   Rota sem entrada aqui usa o padrão: `pt-BR` e "Seções desta página". Uma rota
   nova em outro idioma acrescenta uma linha. */
export type NavIdioma = { lang: string; rotulo: string };

const NAV_PADRAO: NavIdioma = { lang: 'pt-BR', rotulo: 'Seções desta página' };

const NAV_POR_ROTA: Readonly<Record<string, NavIdioma>> = {
  /* O rótulo é O MESMO da nav de âncoras de `latam/page.tsx:96`, de propósito: as
     duas nunca coexistem para o leitor: aquela é `xl:hidden` (sai da árvore de
     acessibilidade com `display: none`) e esta só monta de 1280px para cima.
     Medido em 1920, 1440, 1366 e 390: uma navegação visível por largura. */
  '/latam': { lang: 'es', rotulo: 'Secciones de esta página' },
};

export function navIdiomaForPath(pathname: string): NavIdioma {
  const rota = pathname !== '/' ? pathname.replace(/\/+$/, '') : '/';
  return NAV_POR_ROTA[rota] ?? NAV_PADRAO;
}

export function sectionsForPath(pathname: string): readonly PageSection[] {
  const rota = pathname !== '/' ? pathname.replace(/\/+$/, '') : '/';
  const acelerador = /^\/solucoes\/([^/]+)$/.exec(rota);
  if (acelerador) return SECOES_DE_ACELERADOR[acelerador[1]] ?? VAZIO;
  return PAGE_SECTIONS[rota] ?? VAZIO;
}

