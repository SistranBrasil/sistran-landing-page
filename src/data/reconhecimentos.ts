/**
 * Premiacoes, Certificacoes e Reconhecimentos — dados do "Teatro de
 * Reconhecimentos".
 *
 * Os quatro numeros e rotulos sao os mesmos de `PREMIACOES` em `aSistran.ts`,
 * que continua sendo a fonte da escrita: aqui eles ganham o indice, o asset
 * oficial e a medida de apresentacao de cada peca. Nada foi inventado — nao ha
 * data, categoria nem descricao que nao esteja no material de origem.
 *
 * Os quatro PNG sao os originais do projeto, todos RGBA com fundo ja
 * transparente (conferido byte a byte: alpha 0 nos cantos), entao nenhuma copia
 * derivada foi necessaria.
 *
 * Sobre `placa`: tres dos quatro assets sao selos de tinta escura — o da ABNT
 * tem 100% dos pixels opacos abaixo de 110 de luminancia, o da Reactions 61%.
 * Sobre azul-marinho eles simplesmente desaparecem. Por isso cada selo declara
 * a propria placa de apoio, como no preview, onde Reactions e ABNT aparecem
 * sobre branco e o Cobertura Performance sobre uma placa escura com fio dourado.
 * O trofeu das Gaivotas é claro (luminancia 183) e dispensa placa: fica direto
 * sobre o palco, apoiado no pedestal.
 *
 * Sobre `alturaPalco`: a arte do palco é dimensionada pela ALTURA, nao pela
 * largura. Cada peca tem proporcao propria (o selo da Reactions é 200x382, o do
 * Cobertura Performance é 211x200), e so a altura deixa as quatro com presenca
 * visual equivalente no palco. A largura sai da proporcao nativa, com teto de
 * seguranca no CSS. Antes isto era um teto de LARGURA (`larguraMax`, 250–300px)
 * combinado com porcentagens da celula da grade — foi essa cadeia que deixou o
 * trofeu pequeno, porque a porcentagem resolvia contra a coluna estreita e o
 * teto em px cortava o resto, sem nenhum minimo.
 */

export type ReconhecimentoPlaca = 'nenhuma' | 'clara' | 'escura';

export type Reconhecimento = {
  index: string;
  count: number;
  title: string;
  image: string;
  alt: string;
  /** Dimensoes nativas do PNG, para o `next/image` reservar a caixa. */
  largura: number;
  altura: number;
  /** Altura da arte no palco, em px. É ela que dita o tamanho — ver cabecalho. */
  alturaPalco: number;
  /** Altura da arte na miniatura lateral, em px. */
  alturaMini: number;
  placa: ReconhecimentoPlaca;
};

export const RECONHECIMENTOS: Reconhecimento[] = [
  {
    index: '01',
    count: 12,
    title: 'Gaivotas de Ouro',
    image: '/images/PremioGaivotaMelhorado.png',
    alt: 'Troféu Gaivotas de Ouro',
    largura: 200,
    altura: 252,
    alturaPalco: 340,
    alturaMini: 74,
    placa: 'nenhuma',
  },
  {
    index: '02',
    count: 3,
    title: 'Prêmios Cobertura Performance',
    image: '/images/PremioPerformance.png',
    alt: 'Selo do Prêmio Cobertura Performance',
    largura: 211,
    altura: 200,
    alturaPalco: 300,
    alturaMini: 66,
    placa: 'escura',
  },
  {
    index: '03',
    count: 5,
    title: 'Reconhecimentos internacionais',
    image: '/images/PremioLATAM.png',
    alt: 'Selo Reactions Latin America Awards',
    largura: 200,
    altura: 382,
    alturaPalco: 380,
    alturaMini: 80,
    placa: 'clara',
  },
  {
    index: '04',
    count: 3,
    title: 'Certificações Qualidade e Métricas',
    image: '/images/selo-abnt.png',
    alt: 'Selo de certificação ABNT',
    largura: 223,
    altura: 242,
    alturaPalco: 320,
    alturaMini: 70,
    placa: 'clara',
  },
];

export const REC_EYEBROW = 'Reconhecimento que comprova nossa trajetória';
export const REC_TITULO = {
  linha1: 'Premiações, Certificações',
  linha2: 'e Reconhecimentos',
} as const;
export const REC_NAV_TITULO = 'Nossa trajetória';
export const REC_SELO_ATIVO = 'Destaque ativo';

/**
 * SIS-230 — o destaque Celent na abertura da seção.
 *
 * As duas frases NÃO são escrita nova: são a segunda nota de
 * `PREMIACOES_NOTAS` (`src/data/aSistran.ts`), que estava montada como um
 * parágrafo corrido depois do teatro. Ela SAIU de lá e veio para cá — a issue
 * pede o texto ao lado do troféu, e deixá-lo nos dois lugares duplicaria a
 * frase na mesma seção. A fonte é `.claude/conteudo-site/01-a-sistran.md` §11,
 * com os espaços duplos do original ("Celent  com o  Technology", "mais alta
 * categoria") normalizados, como já vinha sendo feito na nota.
 *
 * Os `alt` são descrição, não legenda: a arte já traz dentro dela o quadrante,
 * os nomes e o texto "Único player com conhecimento local e clientes no
 * Brasil", e a issue proíbe inventar legenda além do que a imagem mostra.
 *
 * SIS-238 — o troféu e a arte LATAM deixaram de ser dois assets montados por
 * cima de um fundo navy: a cena inteira passou a ser UMA capa clara
 * (`cele.png` -> `celent-capa.webp`), e o HTML só acrescenta a coluna
 * tipográfica. Por isso `capaAlt` é novo e `trofeuAlt`/`latamAlt` saíram de
 * cena — ficam comentados porque `trofeu.webp` e `celentlatam.webp` continuam
 * no repo, e voltar atrás é trocar o markup, não reescrever descrição.
 *
 * `logoAlt` mudou de 'Celent' para o texto completo: o arquivo
 * `logo-Celent.png` não é só a marca, ele traz a linha «Technology Standout
 * 2023» desenhada abaixo do wordmark. Com `alt="Celent"` essa linha — que na
 * referência é o segundo nível da coluna — não existiria para leitor de tela.
 */
/**
 * SIS-177 — o eyebrow da composição editorial.
 *
 * É ESCRITA NOVA, e a única desta issue: `docs/celen.md` item 1 da coluna
 * esquerda pede, literalmente, «RECONHECIMENTO INTERNACIONAL» acima da manchete,
 * e nenhuma fonte travada tem essa linha (`REC_EYEBROW`, o eyebrow da galeria
 * acima, é «Reconhecimento que comprova nossa trajetória» — outro texto, outro
 * bloco). Fica aqui, em `src/data/`, e não digitado no componente, porque é onde
 * o extrator de copy-lock espera conteúdo; entra no relatório como UMA entrada
 * nova, declarada na issue.
 *
 * Em caixa alta no DADO, e não via `text-transform`: a caixa é a forma do texto
 * pedido pelo documento, e o leitor de tela recebe o que está escrito.
 */
export const REC_CELENT_EYEBROW = 'RECONHECIMENTO INTERNACIONAL';

export const REC_CELENT = {
  linha1: 'A Sistran foi reconhecida pela Celent com o Technology Standout 2023.',
  linha2: 'A mais alta categoria no quesito tecnologia',
  logoAlt: 'Celent — Technology Standout 2023',
  capaAlt:
    'Troféu Technology Standout 2023 da Celent ao lado do quadrante XCelent Awards 2023 PAS LIFE da Celent LATAM, com a Sistran entre os Technology Standouts',
  // SIS-238: fora de cena. Eram os `alt` de `/trofeu.webp` e `/celentlatam.webp`.
  // trofeuAlt: 'Troféu Technology Standout 2023 da Celent',
  // latamAlt:
  //   'Quadrante XCelent Awards 2023 PAS LIFE da Celent LATAM, com a Sistran entre os Technology Standouts',
} as const;

/* ═════════════════════════════════════════════════════════════════════════════
   SIS-238 (24/09) — A GALERIA EDITORIAL EXPANSÍVEL
   ═════════════════════════════════════════════════════════════════════════════

   `docs/trofeus.md` pede uma seção «100% diferente da estrutura anterior», com
   quatro painéis verticais encostados formando UMA composição, e proíbe nome por
   nome tudo que o teatro era: menu lateral, numeração, o «12» monumental, as
   linhas de ligação, o cartão central arredondado, os cartões empilhados, a
   coluna de miniaturas, as setas e a paginação. Reaproveitar `Reconhecimento`
   não era possível: aquele tipo é feito dessas peças — `index` ('01'…'04') e
   `count` (12/3/5/3) existem para a numeração e para o número gigante, e
   `alturaMini` para a coluna de miniaturas. Um tipo novo, então, com só o que a
   galeria usa.

   O tipo da issue é `{ id, title, image, imageAlt }`. Acrescentei `largura` e
   `altura` porque a mesma issue exige que «imagens devem possuir dimensões
   definidas» e o `next/image` desta rota precisa delas para reservar a caixa
   (`images.unoptimized` — ver `docs/images-unoptimized.md`), e `tintaEscura`
   porque sem ele a composição da própria mock não fecha (nota abaixo).

   Os TEXTOS são os da issue, letra por letra. Três dos quatro coincidem com o
   `title` do teatro; o quarto NÃO: era 'Certificações Qualidade e Métricas' e a
   issue escreve 'Certificações de qualidade e métricas'. Vale a issue, que é a
   especificação de conteúdo desta entrega — o texto antigo continua acima, em
   `RECONHECIMENTOS[3]`, se alguém precisar comparar.

   Os `imageAlt` são os `alt` que o teatro já usava, com fonte: eles nomeiam o
   prêmio real desenhado no arquivo ('Reactions Latin America Awards', 'ABNT'),
   e o rótulo de categoria da issue é mais genérico. Trocar o `alt` pelo rótulo
   apagaria informação para leitor de tela — e a issue proíbe inventar prêmio,
   não proíbe descrever o que o arquivo mostra.

   `tintaEscura` — MEDIDO, não estimado, com `sharp` sobre os pixels opacos
   (alpha > 200) de cada PNG:

     | asset                       | L média | pixels com L < 0,18 |
     | PremioGaivotaMelhorado.png  |  0,504  |   6%  (72% acima de 0,5) |
     | PremioPerformance.png       |  0,245  |  52%                     |
     | PremioLATAM.png             |  0,233  |  58%                     |
     | selo-abnt.png               |  0,128  | 100%                     |

   É o mesmo fato que fez o teatro inventar `placa`, e ele volta nesta galeria
   com outra consequência: aqui o painel ATIVO é azul-marinho, e a animação
   prescrita leva cada painel, um por vez, de claro a marinho. Na mock isso não
   aparece porque o painel ativo desenhado é justamente o único asset claro — o
   troféu. Quando a etapa 4 chegar, um selo com 100% da tinta escura estaria
   sobre marinho e sumiria. A saída não inventa peça nova: a própria issue manda
   pôr a arte «sobre uma base elíptica discreta» com brilho ciano controlado no
   painel ativo. Para o troféu essa base é o brilho tênue da mock; para os três
   selos de tinta escura ela é opaca o bastante para servir de papel. Sobre
   `rgb(232,248,255)` o pior dos quatro (ABNT, L 0,128) dá 5,6:1 — acima do piso
   AA. Não é caixa, não é cartão e não tem canto arredondado: é uma elipse, que
   é o que o documento pede.
   ═════════════════════════════════════════════════════════════════════════════ */

export type ReconhecimentoGaleria = {
  id: string;
  title: string;
  image: string;
  imageAlt: string;
  /** Dimensoes nativas do PNG — o `next/image` reserva a caixa com elas. */
  largura: number;
  altura: number;
  /** A tinta do asset é escura? Dita a força da base elíptica — ver cabecalho. */
  tintaEscura: boolean;
};

export const RECONHECIMENTOS_GALERIA: ReconhecimentoGaleria[] = [
  {
    id: 'gaivotas-de-ouro',
    title: 'Gaivotas de Ouro',
    image: '/images/PremioGaivotaMelhorado.png',
    imageAlt: 'Troféu Gaivotas de Ouro',
    largura: 200,
    altura: 252,
    tintaEscura: false,
  },
  {
    id: 'cobertura-performance',
    title: 'Prêmios Cobertura Performance',
    image: '/images/PremioPerformance.png',
    imageAlt: 'Selo do Prêmio Cobertura Performance',
    largura: 211,
    altura: 200,
    tintaEscura: true,
  },
  {
    id: 'reconhecimentos-internacionais',
    title: 'Reconhecimentos internacionais',
    image: '/images/PremioLATAM.png',
    imageAlt: 'Selo Reactions Latin America Awards',
    largura: 200,
    altura: 382,
    tintaEscura: true,
  },
  {
    id: 'certificacoes',
    title: 'Certificações de qualidade e métricas',
    image: '/images/selo-abnt.png',
    imageAlt: 'Selo de certificação ABNT',
    largura: 223,
    altura: 242,
    tintaEscura: true,
  },
];

/* Os textos da issue, sem uma vírgula a mais. O eyebrow fica em caixa alta no
   DADO e não por `text-transform`: é assim que a issue o escreve, e o leitor de
   tela deve ouvir o mesmo que se lê. */
export const REC_GAL_EYEBROW = 'RECONHECIMENTOS';
export const REC_GAL_TITULO = 'Reconhecimentos que marcam nossa trajetória';
export const REC_GAL_APOIO = 'Prêmios e certificações apresentados em uma galeria viva.';
/**
 * SIS-98 — a nota Top 5, agora AO LADO do apoio e em negrito.
 *
 * NÃO é escrita nova: é a primeira (e, depois desta issue, única) entrada de
 * `PREMIACOES_NOTAS` em `src/data/aSistran.ts`, letra por letra. Ela subiu do
 * rodapé da seção para o cabeçalho porque é lá que a issue a pede, e SAIU da
 * lista de origem no mesmo movimento — a issue cobra por nome que
 * «`PREMIACOES_NOTAS` não duplica a frase se ela subiu». Fonte:
 * `.claude/conteudo-site/01-a-sistran.md` §11.
 *
 * É o mesmo trajeto que a SIS-230 fez com a nota da Celent (`REC_CELENT`,
 * acima), e por isso mora aqui: `reconhecimentos.ts` é a escrita DESTA seção,
 * `aSistran.ts` é o texto institucional de onde ela veio.
 */
export const REC_GAL_TOP5 =
  'Seguradora americana Top 5 no mundo nos elege como Melhor Projeto nas Américas.';
export const REC_GAL_DICA = 'Passe o cursor ou continue rolando';
/* Decorativo, `aria-hidden` no consumidor. Duas linhas porque a issue o escreve
   em duas e o recorte pelas bordas depende disso. */
export const REC_GAL_DECORATIVO = ['NOSSA', 'TRAJETÓRIA'] as const;
