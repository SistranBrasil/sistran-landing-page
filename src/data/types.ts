import type { IconName } from '@/lib/icons';

/* `children` é o submenu. Opcional porque só "Quem somos" tem um: os outros seis
   itens do header levam direto à rota e não abrem nada. O tipo é recursivo por
   economia, não por ambição — o Header desenha UM nível de profundidade, e um
   `children` dentro de `children` seria ignorado. */
export type NavItem = { label: string; href: string; children?: readonly NavItem[] };
export type Differential = { id: string; title: string; icon: IconName; color: string; description?: string };
/** Componente contextual de cada indicador na secao "Sistran em numeros". A
 *  chave escolhe o desenho em `src/components/ui/impact/ImpactVisuais.tsx`. */
export type ImpactVisual =
  | 'people-network'
  | 'award-facets'
  | 'client-network'
  | 'capacity-pulse'
  | 'erp-layers'
  | 'insurer-network'
  | 'claims-flow';
export type Metric = {
  id: string;
  value: number;
  suffix: string;
  label: string;
  /** Uma frase de contexto, mostrada so no indicador ativo.
   *
   * SIS-165 — passou a OPCIONAL, e é consequência direta da Regra Zero, não
   * folga de tipagem: as sete `caption` são o único texto desta seção fora de
   * `.claude/conteudo-site/`, e por decisão da issue elas ficam COMENTADAS em
   * `src/data/metrics.ts` até serem aprovadas. Com o campo obrigatório, comentar
   * as sete quebraria o tipo — e a saída fácil (inventar sete frases novas) é
   * exactamente o que a Regra Zero proíbe. Opcional é o que permite a fonte
   * ficar sem elas sem que ninguém precise escrever cópia por conta própria.
   * Quando o texto voltar aprovado, descomentar as sete e voltar a `string`. */
  caption?: string;
  visual: ImpactVisual;
};
/** `color` = accent sobre fundo azul (lista lateral). `colorOnLight` = mesmo
 *  accent escurecido para uso dentro dos cards brancos, onde os tons claros
 *  perdem contraste. */
export type Solution = {
  id: string;
  title: string;
  description: string;
  icon: IconName;
  color: string;
  colorOnLight: string;
  /* Foto da solução no teatro da home. Opcional de propósito: a página
     `/solucoes` consome os mesmos dados sem palco de imagem, e um card sem foto
     continua legível — o `Solutions` só não desenha a janela. */
  image?: string;
  /** Descrição da foto. Ausente = foto decorativa (`alt=""`). */
  imageAlt?: string;
};
export type FutureArea = { id: string; title: string; icon: IconName };
export type Unit = {
  id: string;
  city: string;
  state: string;
  address?: string;
  phone?: string;
  /** Centro do mapa da unidade (SIS-84). `zoom` diz o quanto se aproxima: rua
   *  onde o endereço é público, cidade onde não é — o enquadramento é parte da
   *  informação, não estética. */
  lat: number;
  lon: number;
  zoom: number;
};
