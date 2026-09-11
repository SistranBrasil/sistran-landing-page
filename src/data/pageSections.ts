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
  '/solucoes': [
    { id: 'topo', label: 'Início' },
    { id: 'tecnologia-disruptiva', label: 'Tecnologia' },
    { id: 'servicos-diferenciais', label: 'Serviços' },
    { id: 'consultoria', label: 'Consultoria' },
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
       sem `.section-light` — exatamente a leitura registrada logo abaixo para
       `#roadmap`, então o tom passa a ser o mesmo: 'claro'.
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
  /* SIS-119 · itens 1 e 3 — a rota ENTRA, e a exclusão que estava escrita no
     cabeçalho deste arquivo ("ficam de fora /transformacao-legado, arquitetura +
     roadmap") saiu junto, porque a contagem que a justificava deixou de valer: a
     página tinha duas seções e passou a ter quatro, com a abertura que a SIS-119
     acrescentou. Com o critério dos 3 satisfeito, o motivo da exclusão
     desapareceu — e esta é a página em que orientar mais rende, porque as duas
     seções longas prendem o texto com `position: sticky` e a rolagem passa muito
     tempo sem trocar de assunto.
     Os dois ids de conteúdo NÃO são novos: `#sinais` já existia em
     `legacy/StackScenes.tsx` e `#roadmap` em `legacy/RoadmapTrail.tsx`, cada um
     carregando o `aria-labelledby` da sua seção. Nenhuma âncora publicada muda de
     destino.
     `#sistema` ("Método") está FORA de propósito, e vale registrar porque parece
     um esquecimento: aquela seção existe no código de `StackScenes` mas está
     inteira dentro de um comentário, retirada a pedido — ela não chega ao DOM
     (conferido em execução). Listá-la daria exatamente o defeito que o cabeçalho
     deste arquivo descreve: um item que nunca acende e cujo clique não vai a
     lugar nenhum. Quando o bloco for religado, esta é a linha a acrescentar:
     | { id: 'sistema', label: 'Método' }, */
  '/transformacao-legado': [
    { id: 'topo', label: 'Início' },
    /* SIS-181 — `.mosaic` é `--paper` (#ffffff) na margem esquerda, sem
       `.section-light`. */
    { id: 'sinais', label: 'Arquitetura', tom: 'claro' },
    /* SIS-181 — `.lp-section--cream` é `--cream` (#e2effa) na margem esquerda,
       sem `.section-light`. */
    { id: 'roadmap', label: 'Roadmap', tom: 'claro' },
  ],
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
       | { id: 'curriculo', label: 'Currículo' }, */
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
  'lumina-ai': new Set(['beneficios']),
  fast: new Set(['o-que-o-fast-oferece', 'beneficios']),
  'smart-miner': new Set(['onde-usar-o-smart-miner']),
  'guru-de-seguros': new Set(['de-onde-pode-ser-acessada']),
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
            ...(TOM_MEDIO_DE_ACELERADOR[p.id]?.has(id) ? { tom: 'medio' } : {}),
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

