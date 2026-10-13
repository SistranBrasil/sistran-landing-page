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
  /* A chave do último DESENHO (índice + mistura), que é o que dedupe de verdade desde a
     interpolação de sub-quadro. `ultimo` continua sendo só o ÍNDICE, porque é ele que o hook
     publica em `data-quadro` para a sonda. */
  private ultimoDesenho = '';

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
    this.ultimoDesenho = '';
    return true;
  }

  /**
   * Desenha `fonte` e, se `proxima`/`mistura` vierem, COMPÕE o quadro seguinte por cima com
   * `globalAlpha = mistura` — interpolação de sub-quadro.
   *
   * ⚠️ POR QUE ISSO EXISTE (13/10/2026). O playhead é fracionário desde o seguidor amortecido,
   * mas o desenho arredondava: a 8,9px de rolagem por quadro (361 quadros em ~3200px de curso),
   * uma rolagem lenta de 1–2px por quadro de animação repetia o MESMO quadro por 4 a 8 rAF, e o
   * que se via era degrau — a cena andava aos saltinhos mesmo com o playhead perfeitamente
   * suave. Nenhum ajuste de constante de tempo resolve isso: o limite era a quantização, não o
   * amortecimento.
   * Compondo A e B com o peso da parte fracionária, cada rAF pinta uma imagem DIFERENTE mesmo
   * quando o índice inteiro não mudou. É a mesma técnica de um `<video>`, que nunca mostra um
   * quadro «puro» quando o tempo cai entre dois.
   *
   * Custo: um segundo `drawImage`. Medido ~0,4 ms no tier desktop (1152², draw 1:1), contra os
   * ~3,3 ms que o primeiro já custa quando há reescala — ou seja, a composição é a parte barata.
   *
   * `alpha: false` no contexto NÃO atrapalha: sem alfa no destino, `globalAlpha` continua
   * valendo para a FONTE, e o resultado é `A × (1 − mistura) + B × mistura`.
   */
  desenhar(fonte: FonteDeQuadro, indice: number, proxima?: FonteDeQuadro, mistura = 0): void {
    /* A chave do «já desenhei isto» passa a incluir a mistura, senão a composição seria
       descartada por repetir o índice inteiro. Quantizada em 1/32 porque abaixo disso a
       diferença não chega a um nível de 8 bits — redesenhar ali seria custo sem imagem nova. */
    const misturaUtil = proxima && mistura > 0.02 ? Math.round(mistura * 32) / 32 : 0;
    const chave = misturaUtil > 0 ? `${indice}+${misturaUtil}` : String(indice);
    if (chave === this.ultimoDesenho) return;
    this.ultimoDesenho = chave;
    this.pintar(fonte, indice);
    if (misturaUtil > 0 && proxima) {
      const { ctx } = this;
      ctx.globalAlpha = misturaUtil;
      this.pintar(proxima, indice);
      ctx.globalAlpha = 1;
    }
  }

  private pintar(fonte: FonteDeQuadro, indice: number): void {
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
    this.ultimoDesenho = '';
  }
}
