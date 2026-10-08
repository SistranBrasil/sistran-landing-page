import type { IconName } from '@/lib/icons';

/* Nomes e textos verbatim de /solucoes-servicos-e-consultoria/ (secao "Soluções
   — Tecnologia Disruptiva"). No site atual o nome do produto existe APENAS
   dentro da imagem do logo, sem alt: invisivel para busca e leitor de tela.
   Aqui o nome é texto. Nao ha subtitulo/tagline escrito no site — o card tem
   nome + descricao e nada mais, então o tipo tambem nao tem.
   Fonte: .claude/conteudo-site/04-solucoes-servicos-e-consultoria.md */
export type Accelerator = {
  id: string;
  name: string;
  description: string;
  /* SIS-217 — a placa do produto, servida de `public/images/logos/`. O card de
     `/solucoes` mostra a logo; o glifo `icon` continua em uso pela vitrine de
     `/sistran-labs`, que é cartão claro e não recebeu placa. */
  logo: string;
  /* Dimensão INTRÍNSECA do PNG, em pixels — não a caixa em que ele aparece.
     Serve ao `next/image`, que a usa para reservar o espaço antes do arquivo
     chegar. Não é redundante com um par fixo para todos: as sete logos vão de
     1,8:1 (Connect API) a 6,7:1 (Match AI), e um par único faria a caixa
     encolher ou esticar no momento em que a imagem carrega. Medidas pelo
     cabeçalho IHDR em `scripts/medir-logos-aceleradores-sis217.mjs`. */
  logoWidth: number;
  logoHeight: number;
  /* SIS-216 — a capa do card em `/solucoes`, servida de
     `public/images/solucoes/capa-card/`. É a arte de FUNDO do card (foto +
     painéis de UI desenhados na própria imagem), não um ícone: os overlays que a
     proposta mostra — «Auto / Residencial / Vida», «Sinistro #45871», os checks
     de Build/Testes — fazem parte do arquivo e não são recriados em HTML.

     Aponta para a derivada `.webp` e não para o `.png` entregue: com
     `images: { unoptimized: true }` os sete PNGs originais somariam 12,0 MB na
     mesma seção da mesma rota. Ver o cabeçalho de
     `scripts/otimizar-capas-card-sis216.mjs`, que também explica por que a do
     destaque é maior que as outras seis. */
  capaCard: string;
  /* Dimensão INTRÍNSECA da derivada WebP, para o `next/image` reservar a caixa.
     Não é a caixa em que ela aparece — a capa é `fill` + `object-fit: cover`. */
  capaCardWidth: number;
  capaCardHeight: number;
  icon: IconName;
  tone: string;
};

/* SIS-42 — conteúdo exclusivo do card SDS em `/solucoes`.
   Ele NÃO entra em `ACCELERATORS`: essa lista também alimenta `/sistran-labs` e
   as vitrines «Conheça também» das sete páginas atuais. Inserir o SDS nela
   publicaria links extras fora do escopo. O catálogo abaixo o reúne aos sete sem
   alterar nenhum acelerador existente.

   23/09 — O SDS DEIXOU DE SER UM TIPO PRÓPRIO e passou a ser um `Accelerator`
   como os outros sete. Pedido da dona do conteúdo: «retire essa escrita JORNADA
   INTELIGENTE DE SINISTROS / SDS — Sistema Digital de Sinistros e deixe só a logo
   com sombra clara atrás seguindo o padrão dos outros e coloque a imagem atrás
   sds.png». Ou seja: o card passou a ter capa fotográfica e a placa da logo do
   padrão — e era justamente a AUSÊNCIA de `capaCard` que justificava o tipo
   separado («sem inventar capa para o SDS», na nota de `SOLUTIONS_CATALOG`).
   Com a arte entregue, a exceção perdeu o motivo.

   O tipo e o dado anteriores, na íntegra:

     export type SdsAccelerator = {
       id: 'sds';
       name: string;
       eyebrow: string;
       description: string;
       logo: string;
       logoWidth: number;
       logoHeight: number;
       tone: string;
     };

     export const SDS_ACCELERATOR: Readonly<SdsAccelerator> = {
       id: 'sds',
       name: 'SDS — Sistema Digital de Sinistros',
       eyebrow: 'JORNADA INTELIGENTE DE SINISTROS',
       description: '…',
       logo: '/sds3d2.png',
       logoWidth: 1707,
       logoHeight: 921,
       tone: '#2F91F7',
     };

   O `eyebrow` morreu com o tipo: ele existia SÓ para o card, e o texto que ele
   carregava é exatamente o que a usuária mandou tirar da tela. Não virou `sr-only`
   porque não é nome nem função — é uma tagline de arte, e o nome do produto
   continua publicado no `<h3>` do card. O `name` segue idêntico: o que saiu foi a
   tinta, não o dado (ver a nota do `<h3>` em `Accelerators.tsx`). */
export const SDS_ACCELERATOR: Readonly<Accelerator> = {
  id: 'sds',
  name: 'SDS — Sistema Digital de Sinistros',
  description:
    'Conecta o comunicado, a análise documental, o apoio antifraude e a regulação em uma jornada rastreável, conduzida por agentes especializados e com a decisão humana preservada.',
  logo: '/sds3d2.png',
  logoWidth: 1707,
  logoHeight: 921,
  /* A DERIVADA WebP, e não `/images/solucoes/sds.png` que foi entregue: com
     `images: { unoptimized: true }` o PNG iria ao navegador como está — 1578 kB
     numa caixa de 548px. A derivada tem 1100x449 e 26 kB, gerada com os MESMOS
     parâmetros das outras sete (`scripts/otimizar-capas-card-sis216.mjs`:
     largura 1100 = 2,01x a coluna, `quality: 78`, `smartSubsample`). A arte
     nativa é 1962x801 (2,45:1), praticamente a proporção da caixa do card
     (~2,5:1), então o `cover` quase não descarta nada. */
  capaCard: '/images/solucoes/capa-card/sds.webp',
  capaCardWidth: 1100,
  capaCardHeight: 449,
  /* `icon` e `tone` são exigidos por `Accelerator` e não têm leitor nesta rota:
     o glifo serve à vitrine de `/sistran-labs` (que não recebe o SDS) e o `tone`
     saiu de uso no card na SIS-216. Ficam com os valores do produto — o azul é
     o mesmo `#2F91F7` que o dado antigo declarava. */
  icon: 'ShieldCheck',
  tone: '#2F91F7',
};

export const ACCELERATORS: readonly Accelerator[] = [
  {
    id: 'match-ai',
    name: 'Match AI',
    description:
      'Permite a seguradora empoderar o corretor/agente nas jornadas de ofertas personalizadas, gerando propostas inteligentes e individualização do discurso explicativo.',
    /* `MatchAIlogo.png`, e não o `matchlogo.png` que mora na mesma pasta: são
       duas artes da MESMA marca, e o de-para da SIS-217 escolhe esta. Não é
       questão de contraste — medidas contra o navy do card, as duas passam
       (7,64:1 esta, 6,37:1 a outra); é a arte aprovada. */
    logo: '/images/logos/MatchAIlogo.png',
    logoWidth: 2338,
    logoHeight: 350,
    capaCard: '/images/solucoes/capa-card/match-ai-realista-componentes-v3.webp',
    capaCardWidth: 1100,
    capaCardHeight: 619,
    icon: 'Users',
    tone: '#0ed8f6',
  },
  {
    /* SIS-280 — O `id` PASSOU A TER DOIS N, e com ele a URL: o `id` é a slug
       (`/solucoes/${a.id}` é o que Accelerators, «Conheça também», o sitemap e o
       template montam), então a grafia da marca e a da rota são o MESMO dado.
       A linha anterior era:

         id: 'lumina-ai',

       e a nota que estava aqui dizia que a slug seguia com um n «por decisão da
       issue (renomear a rota está fora de escopo)» — aquela era a issue da GRAFIA
       na UI, e esta issue REVOGA a restrição por escrito. Quem chega pelo link
       velho não cai em 404: `next.config.mjs` redireciona
       `/solucoes/lumina-ai` → `/solucoes/luminna-ai` em 308. */
    id: 'luminna-ai',
    /* Linha anterior: name: 'Lumina AI', */
    name: 'Luminna AI',
    description:
      'Solução integrada com uso de IA generativa que orquestra toda a esteira do DEVOPs, gerando maior produtividade em toda cadeia, especialmente na codificação, integrada às ferramentas líderes de mercado.',
    logo: '/images/solucoes/luminnadoisnn.png',
    logoWidth: 2172,
    logoHeight: 724,
    capaCard: '/images/solucoes/capa-card/luminna-ai-realista-componentes-v3.webp',
    capaCardWidth: 1672,
    capaCardHeight: 941,
    icon: 'Code2',
    tone: '#57B7EE',
  },
  {
    id: 'fast',
    name: 'Fast',
    description:
      'Automatiza e acelera processos de sinistros, reduzindo erros humanos, melhorando a eficiência e garantindo conformidade com as regulamentações.',
    logo: '/images/logos/Fastlogo.png',
    logoWidth: 2000,
    logoHeight: 688,
    capaCard: '/images/solucoes/capa-card/fast-realista-componentes-v3.webp',
    capaCardWidth: 1100,
    capaCardHeight: 619,
    icon: 'ShieldCheck',
    tone: '#A78BFA',
  },
  {
    id: 'qa-integrado',
    name: 'QA Integrado',
    description: 'Altos padrões de qualidade, mantendo constância na melhoria, evolução e inovação.',
    logo: '/images/logos/QA-2-logo.png',
    logoWidth: 1567,
    logoHeight: 396,
    capaCard: '/images/solucoes/capa-card/qa-integrado-realista-componentes-v3.webp',
    capaCardWidth: 1100,
    capaCardHeight: 619,
    icon: 'Workflow',
    tone: '#7CCBF3',
  },
  {
    id: 'connect-api',
    name: 'Connect API',
    description:
      'Jornada de Distribuição de Vida Individual, Empresarial e Grupo; Venda Consultiva; Auto-gestão do faturamento pelo estipulante.',
    logo: '/images/logos/logoConnectAPI.png',
    logoWidth: 635,
    logoHeight: 350,
    capaCard: '/images/solucoes/capa-card/connect-api-realista-componentes-v3.webp',
    capaCardWidth: 1100,
    capaCardHeight: 619,
    icon: 'HeartHandshake',
    tone: '#C4A0FB',
  },
  {
    id: 'smart-miner',
    name: 'Smart Miner',
    description:
      'Solução poderosa para identificar documentos em arquivos com múltiplas imagens, tipificação e extração de dados para Onboarding (Aceitação da Proposta) e Abertura de Sinistros.',
    logo: '/images/logos/Logo-Smart-Miner-1.png',
    logoWidth: 2996,
    logoHeight: 816,
    capaCard: '/images/solucoes/capa-card/smart-miner-realista-componentes-v3.webp',
    capaCardWidth: 1100,
    capaCardHeight: 619,
    icon: 'Layers',
    tone: '#6EE7B7',
  },
  {
    id: 'guru-de-seguros',
    name: 'Guru de Seguros',
    /* Site escreve "Quizes" e "FAC"; corrigido para quizzes e FAQ — erro de
       digitacao nao é conteudo a replicar. */
    description:
      'Assistente conversacional via Alexa (com LLM) para educação de corretores e segurados (quizzes, FAQ), turbinado com aplicações transacionais.',
    logo: '/images/logos/Guru-de-Seguros-letra-clara-2.png',
    logoWidth: 1405,
    logoHeight: 717,
    capaCard: '/images/solucoes/capa-card/guru-de-seguros-realista-componentes-v3.webp',
    capaCardWidth: 1100,
    capaCardHeight: 619,
    icon: 'Cpu',
    tone: '#0ed8f6',
  },
];

/* SIS-93 — catálogo canônico de soluções publicado em `/solucoes`.
   `ACCELERATORS` continua sendo a coleção consumida pelas vitrines antigas e por
   `/sistran-labs`; o catálogo é ela MAIS o SDS, e é o que `/solucoes` monta.

   23/09 — deixou de ser união. Era:

     export type SolutionCatalogItem = Accelerator | SdsAccelerator;

   com o literal `id: 'sds'` servindo de discriminante. Com o SDS já sendo um
   `Accelerator` (ver a nota acima), a união tinha os dois lados iguais e o
   discriminante não separava mais nada. O apelido fica em pé porque é o nome com
   que a lista de `/solucoes` é lida — é o catálogo que pode voltar a ter um item
   de outra forma, e aí o alias é o ponto onde a união renasce. */
export type SolutionCatalogItem = Accelerator;

export const SOLUTIONS_CATALOG: readonly SolutionCatalogItem[] = [
  SDS_ACCELERATOR,
  ...ACCELERATORS,
];
