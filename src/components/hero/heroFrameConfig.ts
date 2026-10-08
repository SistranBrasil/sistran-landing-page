/**
 * heroFrameConfig — tudo o que o hero precisa saber sobre a sequência de quadros, em um lugar.
 *
 * Os números de quadros, dimensões e pasta de cada tier NÃO são escritos aqui: vêm de
 * `hero-frames.manifest.json`, que `scripts/gerar-quadros-hero.mjs` escreve ao gerar os arquivos.
 * Trocar o master, a cadência ou a resolução é rodar o script — o TSX acompanha sozinho.
 *
 * Tiers e como são escolhidos (a mesma regra vale para o `<picture>` do pôster, em media queries,
 * e para `escolherTier`, em JS — os dois têm de concordar para o quadro 1 do pôster ser o mesmo
 * arquivo do quadro 1 da sequência e vir do cache):
 *   mobile       <1024px (o ponto de quebra do hero dividido, ver `HeroCinematic`)
 *   desktop-hd   ≥1024px com DPR ≥ 1,5 OU viewport ≥ 2200px (a caixa do vídeo passa de 1152px)
 *   desktop      ≥1024px, o resto
 */
import manifesto from './hero-frames.manifest.json';

export type TierId = 'desktop' | 'desktop-hd' | 'mobile';

export type Tier = {
  id: TierId;
  pasta: string;
  quadros: number;
  largura: number;
  altura: number;
  poster: string;
};

type TierDoManifesto = {
  pasta: string;
  quadros: number;
  largura: number;
  altura: number;
  poster: string;
};

type Manifesto = {
  base: string;
  tiers: Partial<Record<TierId, TierDoManifesto>>;
};

const m = manifesto as unknown as Manifesto;

export const BASE_DOS_QUADROS = m.base;

export const PONTO_DE_QUEBRA_DESKTOP = '(min-width: 1024px)';
export const CONSULTA_HD = '(min-resolution: 1.5dppx)';
export const LARGURA_MINIMA_HD = 2200;

/* `scrub` do ScrollTrigger. 0,3 s foi o ponto de partida pedido, e foi retirado em 08/10/2026 por
   medição: a página inteira já rola pelo Lenis (lerp 0,1, ~0,5 s para assentar), então o 0,3 s do
   scrub era um SEGUNDO filtro em cima do primeiro — com a roda a 1 dente/80 ms o quadro desenhado
   ficava até 11 quadros atrás da posição já suavizada do scroll, e o hero parecia "pesado". Com
   `true` o playhead segue exatamente a posição que o Lenis entrega a cada quadro: a suavidade vem
   do Lenis, a precisão vem daqui. Um número volta a fazer sentido só se o Lenis sair. */
export const SCRUB: true | number = true;

/* Fila de rede (ver `frameLoader`). A pré-busca anda bem à frente da janela de decode: blob é
   barato (~90–120 KB) e a rede chega antes do decode precisar. */
export const CONCORRENCIA_DOWNLOAD = 6;
export const JANELA_INICIAL = 24;
export const PREFETCH = { atras: 8, frente: 36 } as const;

/* Janela de bitmaps decodificados (ver `decodeWindow`), dimensionada por ORÇAMENTO DE MEMÓRIA e
   não por um número fixo de quadros.

   Medido em 08/10/2026 com a janela anterior (10 à frente, 3 decodes em paralelo): numa rolagem
   contínua a 1 dente de roda por 80 ms o conteúdo anda ~112 quadros/s, os bitmaps da janela eram
   todos descartados antes de os seguintes chegarem e a cena ficava congelada por vários ticks e
   saltava — atraso de decode p90 de 147 quadros. Decode de um 1152² leva ~19 ms; com 6 em paralelo
   o pool rende ~300 quadros/s, e uma janela de 20–30 quadros à frente dá o tempo de latência
   necessário. A memória de um bitmap é `largura × altura × 4`; o orçamento mantém o pior tier
   (1440²) em ~160 MB e o celular em ~90 MB. */
const ORCAMENTO_DECODE_BYTES = { desktop: 160 * 1024 * 1024, mobile: 90 * 1024 * 1024 } as const;
const PARALELO_DECODE = { desktop: 4, mobile: 3 } as const;

export type JanelaDeDecode = { atras: number; frente: number; paralelo: number };

export function janelaDeDecode(t: Tier, desktop: boolean): JanelaDeDecode {
  const bytesPorBitmap = t.largura * t.altura * 4;
  const perfil = desktop ? 'desktop' : 'mobile';
  const quadros = Math.min(32, Math.max(12, Math.floor(ORCAMENTO_DECODE_BYTES[perfil] / bytesPorBitmap)));
  /* Um quinto para trás (volta curta sem redecodificar), o resto para a frente, no sentido da
     rolagem — `DecodeWindow` troca os lados quando a direção inverte. */
  const atras = Math.max(3, Math.round(quadros * 0.2));
  return { atras, frente: quadros - atras - 1, paralelo: PARALELO_DECODE[perfil] };
}

export function tier(id: TierId): Tier | null {
  const t = m.tiers[id];
  return t ? { id, ...t } : null;
}

export function tiersDisponiveis(): Tier[] {
  return (['desktop', 'desktop-hd', 'mobile'] as TierId[]).map(tier).filter((t): t is Tier => t !== null);
}

/**
 * Escolhe o tier para este ambiente. Degrada com graça enquanto um tier não foi gerado:
 * `desktop-hd` cai para `desktop`, e qualquer um cai para o que existir.
 */
export function escolherTier(ambiente: { desktop: boolean; hd: boolean }): Tier | null {
  const ordem: TierId[] = ambiente.desktop
    ? ambiente.hd
      ? ['desktop-hd', 'desktop', 'mobile']
      : ['desktop', 'desktop-hd', 'mobile']
    : ['mobile', 'desktop', 'desktop-hd'];
  for (const id of ordem) {
    const t = tier(id);
    if (t) return t;
  }
  return null;
}

/** Lado do cliente: a regra "HD" em JS, espelho das media queries do `<picture>`. */
export function ehHd(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(CONSULTA_HD).matches || window.innerWidth >= LARGURA_MINIMA_HD;
}

export function urlDoQuadro(t: Tier, indice: number): string {
  return `${BASE_DOS_QUADROS}/${t.pasta}/frame-${String(indice + 1).padStart(4, '0')}.avif`;
}

export function urlDoPoster(t: Tier): string {
  return `${BASE_DOS_QUADROS}/${t.pasta}/${t.poster}`;
}
