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

/**
 * Arte 3D que acompanha a faixa, no palco giratorio (`EssenceHologram`).
 *
 * `arte` é a BASE do arquivo em `public/images/essencia/`, sem largura nem
 * extensao: `missao` resolve para `missao-560.webp` e `missao-1120.webp`, gerados
 * com alfa preservado a partir de `public/missao,valores,pilar/missao.png`.
 *
 * `largura`/`altura` sao as do ARQUIVO, e por isso variam: a Missao é 3:2 e as
 * outras duas sao quadradas. Elas existem para reservar a altura certa antes da
 * imagem chegar — um valor unico faria a pagina pular em duas das tres faixas.
 */
export type ItemEssencia = {
  id: 'missao' | 'valores' | 'pilares';
  titulo: string;
  /** Paragrafo unico, ou lista — é o que decide como o painel se monta. */
  conteudo: string | readonly string[];
  /** Ressalva em itálico, só a Missão tem. */
  nota?: string;
  arte: string;
  /** Descricao da arte para quem nao a ve. Vai para o `aria-label` do palco. */
  arteAlt: string;
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
    arte: 'missao',
    arteAlt:
      'Ilustração tridimensional de uma plataforma de vidro azul luminosa: um núcleo central de cubos ligado por trilhas de luz a oito módulos ao redor, entre eles nuvem, pessoas, dados e um escudo.',
    largura: 1536,
    altura: 1024,
  },
  {
    id: 'valores',
    titulo: 'Valores',
    conteudo: 'Conhecimento em Seguros, Flexibilidade, Tecnologia, Solidez e permanência.',
    arte: 'valores',
    arteAlt:
      'Ilustração tridimensional de um troféu de cristal azul luminoso sobre uma base circular, envolto por fitas de luz em órbita e acompanhado de um grupo de cubos de vidro.',
    largura: 1254,
    altura: 1254,
  },
  {
    id: 'pilares',
    titulo: 'Pilares',
    conteudo: PILARES,
    arte: 'pilares',
    arteAlt:
      'Ilustração tridimensional de oito colunas hexagonais de vidro azul luminoso dispostas em círculo sobre uma base octogonal, com um cristal maior ao centro.',
    largura: 1254,
    altura: 1254,
  },
];

/** A Missão abre a seção. */
export const ESSENCIA_INICIAL = ESSENCIA[0].id;
