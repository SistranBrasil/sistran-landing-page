/**
 * Missão, Valores e Pilares — o conteudo da seção "Nossa essência".
 *
 * FONTE ÚNICA: nenhum destes textos aparece escrito no JSX. Antes eles moravam
 * soltos dentro de `/quem-somos`, em tres cards; com o accordion o mesmo texto
 * precisa existir em dois lugares (a faixa e o painel), e duplicar string é
 * como uma delas acaba divergindo da outra.
 *
 * Os seis pilares vem de `PILARES` (`aSistran.ts`), onde ja estavam. Reimportar
 * em vez de recopiar: sao textos aprovados, e o `copy-lock` do projeto compara
 * exatamente essas frases.
 */

import { PILARES } from './aSistran';
import type { IconName } from '@/lib/icons';

/**
 * Arte que acompanha o estado, no painel navy de `NossaEssenciaSection`.
 *
 * SIS-260 — `arte` PASSOU A SER O CAMINHO INTEIRO do arquivo, e não mais a base
 * de um par de larguras. A linha anterior e a nota que a explicava:
 *
 *     arte: string;
 *
 *     // `arte` é a BASE do arquivo em `public/images/essencia/`, sem largura nem
 *     // extensao: `missao` resolve para `missao-560.webp` e `missao-1120.webp`,
 *     // gerados com alfa preservado a partir de
 *     // `public/missao,valores,pilar/missao.png`.
 *
 * O par de larguras existia para o `EssenceHologram`, que escolhia entre elas
 * conforme a faixa estivesse aberta ou fechada. No arranjo desta issue há UMA
 * caixa só — `min(100%, 520px)`, prescrita por `docs/missao,valores.md` —, então
 * um arquivo por estado basta, e o caminho explícito é mais fácil de conferir
 * contra `public/` do que uma convenção de sufixo.
 *
 * As artes também são OUTRAS: `public/images/nossa-essencia/*.webp`, derivadas
 * dos PNGs que a issue entregou (`public/missao.png` e irmãos) por
 * `scripts/otimizar-artes-essencia-sis260.mjs`. As antigas seguem em
 * `public/images/essencia/` — são renders 3D de outra direção de arte, e é
 * justamente a troca delas que a issue pede.
 *
 * `largura`/`altura` sao as do ARQUIVO. Deixaram de variar porque as três artes
 * novas são 1254x1254 na origem e 1040x1040 na derivada — mas seguem sendo campo
 * por item, e não constante do componente, porque é a próxima arte fora de
 * esquadro que faria a página pular se o valor fosse chumbado num lugar só.
 */
export type ItemEssencia = {
  id: 'missao' | 'valores' | 'pilares';
  titulo: string;
  /** Paragrafo unico, ou lista — é o que decide como o painel se monta. */
  conteudo: string | readonly string[];
  /**
   * A linha de apoio sob o título gigante, em azul-cinza, no arranjo de
   * `public/valores.png`.
   *
   * SÓ VALORES TEM, e isso é uma decisão, não um esquecimento. A mock entrega
   * essa frase escrita para UM estado — «Princípios que orientam nossas decisões
   * e sustentam relações duradouras.» — e não entrega as de Missão e Pilares.
   * Escrever as outras duas seria redação nova num texto institucional que passa
   * por aprovação (foi por isso que as colunas de palavras do canto da mock do
   * SIS-260 não entraram), então aqui o campo é opcional:
   *
   *   Missão   — a linha de apoio é o PRÓPRIO `conteudo`, que já é uma frase
   *              única e é exatamente o que a mock põe nessa posição.
   *   Valores  — `subtitulo`, porque o `conteudo` dele (os cinco valores
   *              enumerados) já aparece na fileira de pontos abaixo; usá-lo
   *              também aqui diria os cinco valores duas vezes na mesma tela.
   *   Pilares  — sem linha de apoio: o `conteudo` são seis frases, que ocupam o
   *              lugar da fileira de pontos.
   *
   * Se a linha de Missão e a de Pilares forem redigidas, elas entram aqui e o
   * componente passa a usá-las sem mudança nenhuma.
   */
  subtitulo?: string;
  /** Ressalva em itálico, só a Missão tem. */
  nota?: string;
  /**
   * SIS-260 — as etiquetas do estado, prescritas por `docs/missao,valores.md`.
   * As da Missão são três palavras novas («Escalabilidade», «Tecnologia», «Visão
   * de futuro»); as de Valores são os CINCO valores do próprio `conteudo`, porque
   * o doc manda apresentá-los «também como tags» — a repetição é o pedido, não um
   * descuido. Pilares não tem: o doc não dá etiquetas para ele, e são seis frases
   * longas, que viradas em etiqueta deixariam de ser legíveis.
   */
  tags?: readonly string[];
  /**
   * SIS-260 — o glifo do selo no alto do painel, o quadradinho arredondado que a
   * mock mostra à esquerda do título. Só o da Missão está desenhado na mock (a
   * bússola); ver a nota do registro em `src/lib/icons.ts`.
   */
  selo: IconName;
  /** Caminho do arquivo servido, a partir de `public/`. */
  arte: string;
  /* SIS-260 — `arteAlt` SAIU. Era:

         // Descricao da arte para quem nao a ve. Vai para o `aria-label` do palco.
         arteAlt: string;

     Dois motivos, e o segundo bastaria sozinho.

     1. `docs/missao,valores.md` prescreve `alt=""` e `aria-hidden="true"` para as
        três artes, «porque são elementos decorativos» — e são: cada painel diz em
        texto tudo o que a arte ilustra, então descrevê-la faria o leitor de tela
        ouvir o mesmo conteúdo duas vezes, uma delas em prosa de catálogo.
     2. As três descrições descreviam as artes ANTIGAS — «plataforma de vidro azul
        luminosa», «troféu de cristal», «oito colunas hexagonais». São renders 3D
        que esta issue retira de cena. Mantê-las apontando para as artes novas
        (diagramas de linha fina) seria texto alternativo que mente.

     Se um dia a arte passar a carregar informação que o texto não tem, o campo
     volta — e aí com descrição escrita para a arte que estiver publicada. */
  /** Dimensoes intrinsecas do arquivo, em pixels. */
  largura: number;
  altura: number;
};

export const ESSENCIA: readonly ItemEssencia[] = [
  {
    id: 'missao',
    titulo: 'Missão',
    conteudo:
      'Oferecer soluções de negócios escaláveis, de baixo TCO*, baseadas em tecnologia para companhias de Seguros, considerando suas necessidades atuais e futuras.',
    nota: '*Total Cost of Ownership, uma estimativa financeira de custos diretos e indiretos de investimentos.',
    tags: ['Escalabilidade', 'Tecnologia', 'Visão de futuro'],
    selo: 'Compass',
    arte: '/images/nossa-essencia/missao.webp',
    largura: 1040,
    altura: 1040,
  },
  {
    id: 'valores',
    titulo: 'Valores',
    conteudo: 'Conhecimento em Seguros, Flexibilidade, Tecnologia, Solidez e permanência.',
    /* Transcrita de `public/valores.png`, palavra por palavra. Ver `subtitulo`. */
    subtitulo: 'Princípios que orientam nossas decisões e sustentam relações duradouras.',
    /* Os mesmos cinco valores do `conteudo` acima, por ordem do doc. A grafia é a
       da frase aprovada, só com a inicial maiúscula em «Permanência» — em
       etiqueta isolada ela não é mais o fim de uma enumeração. */
    tags: [
      'Conhecimento em Seguros',
      'Flexibilidade',
      'Tecnologia',
      'Solidez',
      'Permanência',
    ],
    selo: 'Gem',
    arte: '/images/nossa-essencia/valores.webp',
    largura: 1040,
    altura: 1040,
  },
  {
    id: 'pilares',
    titulo: 'Pilares',
    conteudo: PILARES,
    selo: 'Columns3',
    arte: '/images/nossa-essencia/pilares.webp',
    largura: 1040,
    altura: 1040,
  },
];

/** A Missão abre a seção. */
export const ESSENCIA_INICIAL = ESSENCIA[0].id;
