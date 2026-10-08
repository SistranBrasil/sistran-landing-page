/**
 * FrameRenderer — desenha um quadro no `<canvas>` com `object-fit: cover`, no DPR da tela.
 *
 * O backing store é `css × dpr` (teto 3): é isso que impede o Canvas de ser ampliado pelo
 * navegador. O recorte `cover` é feito NA FONTE (`drawImage` de nove argumentos): calcula-se qual
 * retângulo do quadro cabe na caixa preservando a proporção e só ele é desenhado — nada é
 * pintado fora do canvas e não há distorção.
 *
 * `desenhar` ignora pedidos repetidos do mesmo quadro (`ultimoDesenhado`); `redimensionar`
 * zera esse registro porque mudar `canvas.width` apaga o conteúdo.
 */

export type FonteDeQuadro = ImageBitmap | HTMLImageElement;

const DPR_MAX = 3;

export class FrameRenderer {
  private readonly ctx: CanvasRenderingContext2D;
  private larguraCss = 0;
  private alturaCss = 0;
  private dpr = 1;
  private ultimo = -1;

  constructor(private readonly canvas: HTMLCanvasElement) {
    /* `alpha: false`: o quadro cobre a caixa inteira, então o compositor não precisa misturar
       nada por trás — e é por isso que o canvas nasce preto e fica invisível até o primeiro
       desenho (ver `.hero-canvas` em `globals.css`). */
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) throw new Error('Canvas 2D indisponível');
    this.ctx = ctx;
  }

  get ultimoDesenhado(): number {
    return this.ultimo;
  }

  /** Ajusta o backing store à caixa CSS. Devolve `true` se algo mudou (e o canvas foi apagado). */
  redimensionar(larguraCss: number, alturaCss: number, dpr: number): boolean {
    const d = Math.min(Math.max(dpr || 1, 1), DPR_MAX);
    const w = Math.max(1, Math.round(larguraCss * d));
    const h = Math.max(1, Math.round(alturaCss * d));
    if (w === this.canvas.width && h === this.canvas.height && d === this.dpr) return false;
    this.larguraCss = larguraCss;
    this.alturaCss = alturaCss;
    this.dpr = d;
    this.canvas.width = w;
    this.canvas.height = h;
    this.ultimo = -1;
    return true;
  }

  desenhar(fonte: FonteDeQuadro, indice: number): void {
    if (indice === this.ultimo) return;
    const sw = 'naturalWidth' in fonte ? fonte.naturalWidth : fonte.width;
    const sh = 'naturalHeight' in fonte ? fonte.naturalHeight : fonte.height;
    if (!sw || !sh) return;
    const cw = this.canvas.width;
    const ch = this.canvas.height;
    if (!cw || !ch) return;

    /* cover: escala pelo lado que precisa crescer mais; o excedente do outro lado é recortado
       da fonte, centrado. */
    const escala = Math.max(cw / sw, ch / sh);
    const recorteW = cw / escala;
    const recorteH = ch / escala;
    const sx = (sw - recorteW) / 2;
    const sy = (sh - recorteH) / 2;

    const { ctx } = this;
    ctx.imageSmoothingEnabled = true;
    /* Quando a fonte já tem o tamanho do canvas o draw é 1:1 e o filtro não muda um pixel — só
       custa (medido: 1,6 ms em 'high' contra 0,36 ms em 'low'). 'high' fica para o resample real. */
    ctx.imageSmoothingQuality = Math.abs(escala - 1) < 0.01 ? 'low' : 'high';
    ctx.drawImage(fonte, sx, sy, recorteW, recorteH, 0, 0, cw, ch);
    this.ultimo = indice;
  }

  /** Força o próximo `desenhar` a pintar mesmo que o índice repita (ex.: depois de um resize). */
  invalidar(): void {
    this.ultimo = -1;
  }
}
