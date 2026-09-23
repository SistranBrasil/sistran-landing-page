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
