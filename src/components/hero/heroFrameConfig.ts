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
   do Lenis, a precisão vem daqui. Um número volta a fazer sentido só se o Lenis sair.

   Desativado em 08/10/2026: o ScrollTrigger deixou de ter tween (ele só publica o destino, e quem
   anda até lá é o seguidor abaixo), e `scrub` do ScrollTrigger só governa animação. A conclusão
   acima continua valendo e está embutida no seguidor — nada de segundo filtro por tempo fixo. */
// export const SCRUB: true | number = true;

/* SEGUIDOR AMORTECIDO do playhead (ver `useHeroFrameSequence`). O ScrollTrigger entrega a posição
   de rolagem sem filtro; o que o olho vê não é mais essa posição crua.

   Por que: o curso do hero (~340svh) cobre os 361 quadros do tier desktop, ou seja ~6,6px de
   rolagem por quadro. Um dente de roda (~100px) pede ~15 quadros DE UMA VEZ, e um gesto de
   trackpad pede muito mais. Mesmo com a janela de decode mirando à frente, nenhuma cadência de
   decode entrega isso, e o `maisProximoDecodificado` passava a desenhar um quadro distante:
   avanço aos tropeços, com a sensação de peso que o `scrub` numérico também dava (e por outro
   motivo). Em vez de atrasar TUDO por um tempo fixo, o playhead persegue o destino com constante
   de tempo curta e um teto de quadros por segundo:
     • parado ou em rolagem lenta, `diferença × k` é menor que o teto → segue 1:1, sem atraso
       perceptível (é o ganho que a retirada do `scrub: 0.3` trouxe, e ele fica);
     • num arranque, o teto corta o salto e a cena continua andando depois do gesto até alcançar
       a posição — cadência constante em vez de congelar-e-saltar, e o decode tem como acompanhar.

   `SUAVIZACAO_MS` é a constante de tempo (e^-dt/τ, independente da taxa de quadros da tela). O
   dimensionamento NÃO é por gosto: numa rolagem contínua o atraso em regime é `velocidade × τ`, e
   a roda sintética da sonda (`scripts/medir-hero-quadros.mjs`, critério 8) anda a ~112 quadros/s
   de conteúdo com teto de 20 quadros de atraso em p90. τ = 60 ms dá ~7 quadros — longe do teto e
   longe dos 11 quadros que faziam o `scrub: 0.3` parecer pesado. 110 ms (a primeira tentativa)
   daria ~12: suavizaria igual e devolveria o peso. Não subir sem rodar a sonda.

   `VELOCIDADE_MAX_QUADROS_S` é o teto, e existe só para o DEGRAU — âncora que salta meio hero,
   `invalidateOnRefresh`, flick de trackpad: nesses casos `diferença × k` sozinho pediria uma
   centena de quadros num tique. 240 (10× os 24 fps do master) nunca é alcançado por rolagem
   humana contínua, então não acumula atraso; um teto perto da velocidade real da roda (foi o erro
   de 72) transformaria o seguidor numa correia sempre atrasada, com o atraso crescendo enquanto o
   gesto durasse.

   `EPSILON_QUADRO` encerra o loop quando a sobra é menor que um décimo de quadro: sem ele o
   decaimento exponencial nunca chega ao destino e o rAF roda para sempre. */
export const SUAVIZACAO_MS = 60;
export const VELOCIDADE_MAX_QUADROS_S = 240;
export const EPSILON_QUADRO = 0.1;
/* Acima deste intervalo entre dois quadros de animação o seguidor é desligado e o playhead salta
   para a posição da rolagem — ver `tique` em `useHeroFrameSequence`. 120 ms = ~8 fps: abaixo
   disso o movimento já não é contínuo para o olho, e amortecer só acumularia atraso. */
export const SALTO_MS = 120;

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
