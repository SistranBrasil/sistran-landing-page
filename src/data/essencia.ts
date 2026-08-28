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

/** Qual visual em SVG acompanha a faixa. O desenho vive no componente. */
export type VisualEssencia = 'bussola' | 'orbita' | 'estrutura';

export type ItemEssencia = {
  id: 'missao' | 'valores' | 'pilares';
  titulo: string;
  /** Paragrafo unico, ou lista — é o que decide como o painel se monta. */
  conteudo: string | readonly string[];
  /** Ressalva em itálico, só a Missão tem. */
  nota?: string;
  visual: VisualEssencia;
};

export const ESSENCIA: readonly ItemEssencia[] = [
  {
    id: 'missao',
    titulo: 'Missão',
    conteudo:
      'Oferecer soluções de negócios escaláveis, de baixo TCO*, baseadas em tecnologia para companhias de Seguros, considerando suas necessidades atuais e futuras.',
    nota: '*Total Cost of Ownership, uma estimativa financeira de custos diretos e indiretos de investimentos.',
    visual: 'bussola',
  },
  {
    id: 'valores',
    titulo: 'Valores',
    conteudo: 'Conhecimento em Seguros, Flexibilidade, Tecnologia, Solidez e permanência.',
    visual: 'orbita',
  },
  {
    id: 'pilares',
    titulo: 'Pilares',
    conteudo: PILARES,
    visual: 'estrutura',
  },
];

/** A Missão abre a seção. */
export const ESSENCIA_INICIAL = ESSENCIA[0].id;
