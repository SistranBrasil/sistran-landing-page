/**
 * O INVENTÁRIO DOS LUGARES QUE TÊM CARIMBO NO SITE.
 *
 * Este arquivo é a resposta à primeira metade do pedido: «ter um controle de
 * todos os lugares que possuem carimbos do site». Ele é a lista fechada dos
 * pontos onde um carimbo é renderizado, e é o que o `/admin/carimbo` mostra.
 *
 * ⚠️ POR QUE O INVENTÁRIO É CÓDIGO E NÃO DADO. Um «lugar» não é informação que o
 * operador cria: é uma posição no layout, que só existe porque existe um nó no
 * JSX daquela seção. Cadastrar lugar pelo admin produziria entrada que nenhuma
 * página lê — e, pior, deixaria de acusar o contrário: lugar que saiu do código e
 * ficou órfão na lista. Aqui, se a seção morre, a entrada vai embora no mesmo
 * commit. O que é DADO é só a ATRIBUIÇÃO (qual carimbo vai em qual lugar), e ela
 * vive no catálogo (`src/lib/carimbosLoja.ts`).
 *
 * ⚠️ `padrao` É A ARTE QUE JÁ ESTÁ NO AR, e não um exemplo. Ela é o estado de
 * hoje e continua valendo enquanto ninguém atribuir outra pelo admin — é o que
 * garante que ligar esta máquina não muda um pixel do site. É também o «voltar ao
 * original» da tela: desatribuir cai de volta aqui.
 *
 * As medidas de `padrao` foram LIDAS das chamadas de `<CarimboBatida>` de cada
 * arquivo, uma por uma, e não estimadas: elas alimentam o `aspect-ratio` que o
 * componente escreve inline, e um número errado achata a arte.
 *
 * ⚠️ MATCH AI TEM UMA SÓ ENTRADA, e não duas. O arquivo tem duas ocorrências de
 * `<CarimboBatida` com `.matchai-carimbo`, mas a da linha 572 está DENTRO de um
 * comentário (o registro da 5ª volta do pedido). A viva é a de 627.
 */

/** A `className` e o `gatilho` continuam no JSX — são desenho, não conteúdo. */
export type LugarCarimbo = {
  /** Chave estável. Entra no catálogo como atribuição; nunca renomear sem migrar. */
  id: string;
  /** Como o lugar se chama na tela do admin. */
  rotulo: string;
  /**
   * As rotas onde este carimbo aparece. É uma LISTA porque há peça em componente
   * compartilhado: o palco de serviços está na home E em `/quem-somos`. São estas
   * as rotas que a ação de salvar revalida — errar aqui é trocar o carimbo e a
   * página continuar servindo o anterior do pré-render.
   */
  rotas: string[];
  /** Uma linha dizendo onde na página a peça fica, para o operador se situar. */
  onde: string;
  /** O arquivo onde o nó vive, para quem for procurar no código. */
  arquivo: string;
  /**
   * A arte em vigor hoje, e o destino de «voltar ao original».
   *
   * `cor` NÃO serve ao site — ele pinta o arquivo como ele é. Ela existe para a
   * PRÉVIA do admin saber escolher o fundo: arte branca sobre o xadrez de
   * transparência é invisível. Os valores foram medidos por amostragem de pixel
   * nas 18 artes, e confirmaram o hex que já estava no nome de cada arquivo.
   */
  padrao: { src: string; alt: string; largura: number; altura: number; cor: string };
};

export const LUGARES_CARIMBO: readonly LugarCarimbo[] = [
  {
    id: 'quem-somos-sobre-nos',
    rotulo: 'Quem somos · Sobre nós',
    rotas: ['/quem-somos'],
    onde: 'Ao lado da foto da equipe, na seção «Sobre nós».',
    arquivo: 'src/components/About.tsx',
    padrao: {
      src: '/carimbo-sobre-nos-capsule-outline-0757c7.png',
      alt: 'Carimbo Sistran — Sobre nós',
      largura: 873,
      altura: 327,
      cor: '#0757C7',
    },
  },
  {
    id: 'solucoes-aceleradores',
    rotulo: 'Soluções · Tecnologia disruptiva',
    rotas: ['/solucoes'],
    onde: 'Na cabeça da seção de aceleradores.',
    arquivo: 'src/components/Accelerators.tsx',
    padrao: {
      src: '/images/carimbo-disruptiva-ticket-outline-0757c7.png',
      alt: '',
      largura: 723,
      altura: 273,
      cor: '#0757C7',
    },
  },
  {
    id: 'servicos-palco',
    rotulo: 'Soluções · palco dos diferenciais',
    /* DUAS ROTAS: o mesmo componente é montado na home e em `/quem-somos`.
       Trocar este carimbo muda as duas telas ao mesmo tempo, e é por isso que o
       rótulo não começa com o nome de uma rota só. */
    rotas: ['/solucoes'],
    onde: 'Sobre o palco dos diferenciais, na página de soluções.',
    arquivo: 'src/components/ui/ServicosPalco.tsx',
    padrao: {
      src: '/images/carimbo-diferenciais-ticket-outline-ffffff.png',
      alt: 'Diferenciais',
      largura: 978,
      altura: 348,
      cor: '#FFFFFF',
    },
  },
  {
    id: 'solucoes-consultoria',
    rotulo: 'Soluções · Consultoria',
    rotas: ['/solucoes'],
    onde: 'Na seção de consultoria.',
    arquivo: 'src/components/Consulting.tsx',
    padrao: {
      src: '/images/carimbo-consultoria-ticket-outline-0757c7.png',
      alt: 'Carimbo Sistran — Consultoria',
      largura: 963,
      altura: 348,
      cor: '#0757C7',
    },
  },
  {
    /* ⚠️ O ÚNICO LUGAR QUE NÃO USA `CarimboBatida`. A arte daqui É O TÍTULO da
       seção: ela vive dentro do `<h2 id="como-agimos">` e carrega o nome no
       `alt`. Por isso ela renderiza por `ArteDoLugar` (casca fina, sem batida e
       sem tombo) em vez de `CarimboDoLugar` — ver os docblocks dos dois.
       Ele ficou FORA do inventário na primeira volta, e ficou dito na entrega que
       estava fora. Entrou a pedido («na seção como agimos o carimbo não foi
       atualizado, e acho que não foi mapeada»). */
    id: 'quem-somos-como-agimos',
    rotulo: 'Quem somos · Como Agimos',
    rotas: ['/quem-somos'],
    onde: 'É o próprio título da seção «Como Agimos».',
    arquivo: 'src/components/como-agimos/ComoAgimos.tsx',
    padrao: {
      src: '/carimbo-agimos-ticket-outline-ffffff.png',
      /* O `alt` é o NOME DA SEÇÃO, não a descrição de um selo — é o que a `<h2>`
         anuncia ao leitor de tela. */
      alt: 'Como Agimos',
      largura: 801,
      altura: 339,
      cor: '#FFFFFF',
    },
  },
  {
    id: 'quem-somos-tecnologias',
    rotulo: 'Quem somos · Tecnologias',
    rotas: ['/quem-somos'],
    onde: 'Na cabeça da seção de tecnologias.',
    arquivo: 'src/components/tecnologias/TechnologiesSection.tsx',
    padrao: {
      src: '/carimbo-tecnologias-ticket-outline-0757c7.png',
      alt: 'Carimbo Sistran Tecnologias',
      largura: 978,
      altura: 330,
      cor: '#0757C7',
    },
  },
  {
    id: 'parceiros-trajetoria',
    rotulo: 'Parceiros · Trajetória',
    rotas: ['/parceiros-e-implementacoes'],
    onde: 'Acima da linha do tempo.',
    arquivo: 'src/components/trajectory/TrajectorySection.tsx',
    padrao: {
      src: '/carimbo-trajetoria-ticket-outline-0757c7.png',
      alt: '',
      largura: 741,
      altura: 285,
      cor: '#0757C7',
    },
  },
  {
    /* ── DOIS LUGARES QUE NÃO ENTRARAM: `parceiros-hero` e `parceiros-faixa` ──
       Eles constavam do levantamento inicial porque uma busca por `<CarimboBatida`
       os encontra em `src/app/parceiros-e-implementacoes/page.tsx` (linhas 121 e
       372). Os dois nós estão DENTRO DE COMENTÁRIO — são o registro de uma
       montagem anterior («a prop era exatamente esta», «o JSX de então, na
       íntegra»), não código vivo. Conferido com varredura que ignora faixas de
       comentário: a rota de parceiros tem UM carimbo vivo, o da cabeça dos cards,
       que é o `parceiros-cards` abaixo.

       Cadastrá-los daria dois lugares no admin que nenhuma página lê — um
       controle que gira e não acende nada, que é o defeito que o docblock do topo
       deste arquivo diz que o inventário em código existe para evitar. Se algum
       dia o nó for descomentado, a entrada volta no mesmo commit. */
    id: 'parceiros-cards',
    rotulo: 'Parceiros · cabeça dos cards',
    rotas: ['/parceiros-e-implementacoes'],
    onde: 'Na cabeça da trilha de cards de parceiro.',
    arquivo: 'src/components/PartnerTerminalCards.tsx',
    padrao: {
      src: '/images/parceiros/carimbo-parcerias-0757c7.webp',
      alt: 'Parceiros',
      largura: 640,
      altura: 200,
      cor: '#0757C7',
    },
  },
  {
    id: 'labs-principais',
    rotulo: 'Sistran Labs · entregas',
    rotas: ['/sistran-labs'],
    onde: 'Na seção das entregas principais.',
    arquivo: 'src/app/sistran-labs/page.tsx',
    padrao: {
      src: '/images/sistran-labs/carimbo-sistran-labs.webp',
      alt: 'Realizado pela Sistran Labs',
      largura: 640,
      altura: 224,
      cor: '#0757C7',
    },
  },
  {
    id: 'solucao-match-ai',
    rotulo: 'Solução · Match AI',
    rotas: ['/solucoes/match-ai'],
    onde: 'Etiqueta acima da manchete, no topo da página.',
    arquivo: 'src/components/solucoes/MatchAiPagina.tsx',
    padrao: {
      src: '/images/solucoes/carimbo-match-ai-ticket-outline-ffffff.png',
      alt: '',
      largura: 720,
      altura: 309,
      cor: '#FFFFFF',
    },
  },
  {
    id: 'solucao-smart-miner',
    rotulo: 'Solução · Smart Miner',
    rotas: ['/solucoes/smart-miner'],
    onde: 'Etiqueta acima da manchete, no topo da página.',
    arquivo: 'src/components/solucoes/SmartMinerPagina.tsx',
    padrao: {
      src: '/images/solucoes/carimbo-smart-miner-ticket-outline-ffffff.png',
      alt: '',
      largura: 825,
      altura: 291,
      cor: '#FFFFFF',
    },
  },
  {
    id: 'solucao-qa-integrado',
    rotulo: 'Solução · QA Integrado',
    rotas: ['/solucoes/qa-integrado'],
    onde: 'Etiqueta acima da manchete, no topo da página.',
    arquivo: 'src/components/solucoes/QaIntegradoPagina.tsx',
    padrao: {
      src: '/images/solucoes/carimbo-qa-integrado-ticket-outline-ffffff.png',
      alt: '',
      largura: 855,
      altura: 291,
      cor: '#FFFFFF',
    },
  },
  {
    id: 'solucao-connect-api',
    rotulo: 'Solução · Connect API',
    rotas: ['/solucoes/connect-api'],
    onde: 'Etiqueta acima da manchete, no topo da página.',
    arquivo: 'src/components/solucoes/ConnectApiPagina.tsx',
    padrao: {
      src: '/images/solucoes/carimbo-connect-api-ticket-outline-ffffff.png',
      alt: '',
      largura: 828,
      altura: 291,
      cor: '#FFFFFF',
    },
  },
  {
    id: 'solucao-fast',
    rotulo: 'Solução · Fast',
    rotas: ['/solucoes/fast'],
    onde: 'Etiqueta acima da manchete, no topo da página.',
    arquivo: 'src/components/solucoes/FastPagina.tsx',
    padrao: {
      src: '/images/solucoes/carimbo-fast-ticket-outline-ffffff.png',
      alt: '',
      largura: 612,
      altura: 279,
      cor: '#FFFFFF',
    },
  },
  {
    id: 'solucao-guru-de-seguros',
    rotulo: 'Solução · Guru de Seguros',
    rotas: ['/solucoes/guru-de-seguros'],
    onde: 'Etiqueta acima da manchete, no topo da página.',
    arquivo: 'src/components/solucoes/GuruDeSegurosPagina.tsx',
    padrao: {
      src: '/images/solucoes/carimbo-guru-de-seguros-ticket-outline-ffffff.png',
      alt: '',
      largura: 897,
      altura: 342,
      cor: '#FFFFFF',
    },
  },
  {
    id: 'luminna-capa',
    rotulo: 'Luminna AI · topo',
    rotas: ['/solucoes/luminna-ai'],
    onde: 'Etiqueta do topo da página.',
    arquivo: 'src/components/solucoes/LuminnaAiPagina.tsx',
    padrao: {
      src: '/images/carimbo-luminna-ai-ticket-outline-ffffff.png',
      alt: '',
      largura: 780,
      altura: 288,
      cor: '#FFFFFF',
    },
  },
  {
    id: 'luminna-desafios',
    rotulo: 'Luminna AI · desafios',
    rotas: ['/solucoes/luminna-ai'],
    onde: 'Na seção de desafios de desenvolvimento.',
    arquivo: 'src/components/solucoes/LuminnaAiPagina.tsx',
    padrao: {
      src: '/images/solucoes/luminna/carimbo/carimbo-desenvolvimento-ticket-outline-0757c7.png',
      alt: '',
      largura: 993,
      altura: 300,
      cor: '#0757C7',
    },
  },
  {
    id: 'luminna-beneficios',
    rotulo: 'Luminna AI · benefícios',
    rotas: ['/solucoes/luminna-ai'],
    onde: 'Na seção de benefícios.',
    arquivo: 'src/components/solucoes/LuminnaAiPagina.tsx',
    padrao: {
      src: '/images/solucoes/luminna/carimbo/carimbo-beneficios-ticket-outline-ffffff.png',
      alt: '',
      largura: 771,
      altura: 288,
      cor: '#FFFFFF',
    },
  },
  {
    /* ⚠️ O ÚNICO LUGAR QUE NÃO SUBSTITUIU UMA ARTE — substituiu uma TAG DE TEXTO.
       Aqui havia a sobrancelha `.ecossistema-sobrancelha`: uma pílula com um ponto
       e a palavra «Ecossistema», vinda do `navLabel` do bloco. A pedido, ela deu
       lugar a um carimbo no layout novo.
       Como não existia arte anterior, o `padrao` aponta para a arte GERADA e
       versionada em `public/carimbo/gerados/`. Isso mantém a regra da casa de pé:
       o site pinta a partir do repositório e o catálogo só TROCA. Sem isso, a
       seção dependeria da loja para ter rótulo. */
    id: 'luminna-ecossistema',
    rotulo: 'Luminna AI · Ecossistema',
    rotas: ['/solucoes/luminna-ai'],
    onde: 'No lugar da tag «Ecossistema», acima do título da seção.',
    arquivo: 'src/components/solucoes/EcossistemaLuminna.tsx',
    padrao: {
      src: '/carimbo/gerados/luminna-ecossistema-20261013142351.png',
      /* Vazio: o `h2` logo abaixo é o nome do bloco, e o navegador lateral
         publica «Ecossistema» como texto de verdade — era por isso que a tag
         antiga já era `aria-hidden`. Nomear a arte faria o leitor de tela dizer
         «Ecossistema» duas vezes. */
      alt: '',
      largura: 987,
      altura: 315,
      cor: '#0757C7',
    },
  },
  {
    id: 'sds-capa',
    rotulo: 'Solução · SDS',
    rotas: ['/solucoes/sds'],
    onde: 'Etiqueta do topo da página.',
    arquivo: 'src/components/solucoes/SdsPagina.tsx',
    padrao: {
      src: '/carimbo-sds-ticket-outline-ffffff.png',
      alt: '',
      largura: 735,
      altura: 336,
      cor: '#FFFFFF',
    },
  },
];

/** Busca por id, para a tela do admin e para as ações. */
export function lugarPorId(id: string): LugarCarimbo | undefined {
  return LUGARES_CARIMBO.find((l) => l.id === id);
}

/**
 * Todas as rotas afetadas por uma atribuição, sem repetição.
 *
 * ⚠️ `/eventos-inovacao` NÃO está em nenhum `rotas` daqui de propósito: o carimbo
 * de evento não é um «lugar», é um campo de cada evento (ver `carimbo` em
 * `EventoBruto`). Quem revalida aquela rota são as ações de evento, que já o
 * fazem.
 */
export function rotasDoLugar(id: string): string[] {
  return [...new Set(lugarPorId(id)?.rotas ?? [])];
}
