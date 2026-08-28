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
export const REC_TITULO = { linha1: 'Premiações, Certificações', linha2: 'e Reconhecimentos' } as const;
export const REC_NAV_TITULO = 'Nossa trajetória';
export const REC_SELO_ATIVO = 'Destaque ativo';
