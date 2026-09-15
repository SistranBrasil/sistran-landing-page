/**
 * O carimbo "Realizado pela Sistran", redesenhado em canvas 2D.
 *
 * ── Por que canvas, e não o componente CSS que já existe ─────────────────────
 * `componente-carimbo-sistran/StampSistran.module.css` desenha o mesmo carimbo
 * com `border`, `color-mix`, pseudo-elementos e `backdrop-filter`. Aquilo é o
 * certo para USAR na página. Mas o pedido aqui é EXPORTAR um PNG sem fundo, e
 * nenhum navegador transforma um nó de DOM em imagem sem biblioteca externa
 * (`html-to-image` e afins). Redesenhar em canvas paga o preço de manter duas
 * descrições do mesmo desenho, e em troca não adiciona dependência ao projeto e
 * dá transparência real: o canvas nasce vazio, então tudo que não for pintado
 * sai com alpha 0.
 *
 * Se o desenho CSS mudar, este arquivo tem de mudar junto — é o custo assumido.
 *
 * ── O acabamento "glass" não existe aqui, de propósito ───────────────────────
 * `glass` é `backdrop-filter: blur()`: ele desfoca O QUE ESTÁ ATRÁS. Num PNG sem
 * fundo não há nada atrás, então o efeito não tem como existir — exportá-lo
 * entregaria um retângulo levemente tingido e chamaria isso de vidro. Quem quer
 * vidro aplica o componente CSS na página, onde há fundo para desfocar.
 *
 * Todas as medidas são múltiplos de `base` (o `font-size` do carimbo), como no
 * CSS original em `em` — é o que mantém os oito formatos proporcionais em
 * qualquer tamanho de exportação.
 */

export const FORMATOS = [
  'capsule',
  'seal',
  'split',
  'ticket',
  'signature',
  'orbit',
  'monogram',
  'certificate',
] as const;

export type Formato = (typeof FORMATOS)[number];
export type Acabamento = 'outline' | 'solid';

export const ROTULO_FORMATO: Record<Formato, string> = {
  capsule: 'Cápsula',
  seal: 'Selo',
  split: 'Dividido',
  ticket: 'Recorte',
  signature: 'Assinatura',
  orbit: 'Órbita',
  monogram: 'Monograma',
  certificate: 'Certificado',
};

export type Opcoes = {
  prefixo: string;
  marca: string;
  serial: string;
  cor: string;
  formato: Formato;
  acabamento: Acabamento;
  /** Graus. Negativo inclina para a esquerda, como o `-3deg` do componente. */
  rotacao: number;
  textura: boolean;
  /** `font-size` do carimbo em px: é a unidade de tudo. */
  base: number;
  familia: string;
};

/** Formatos que empilham logo e texto no centro, em vez de alinhar em linha. */
const EMPILHADOS: ReadonlySet<Formato> = new Set(['seal', 'monogram']);
/** Formatos onde o CSS revela o `.serial`. */
const COM_SERIAL: ReadonlySet<Formato> = new Set(['seal', 'monogram', 'certificate']);

type Fatia = { texto: string; tamanho: number; peso: number; tracking: number; largura: number };

function fonte(peso: number, tamanho: number, familia: string) {
  return `${peso} ${tamanho}px ${familia}`;
}

/**
 * `ctx.letterSpacing` existe no Chrome, mas não em todo navegador que a pessoa
 * pode ter aberto — e o carimbo depende de tracking (`.17em` na linha pequena,
 * `-.035em` na marca). Somar o espaço caractere a caractere funciona em qualquer
 * lugar E devolve a largura exata, que é o que dimensiona a arte.
 *
 * Diferença deliberada do CSS: o espaço NÃO é somado depois do último caractere.
 * O `letter-spacing` do CSS soma, e isso desloca o texto para a esquerda quando
 * ele é centralizado — visível no selo, onde tudo é centrado.
 */
function larguraTracking(ctx: CanvasRenderingContext2D, texto: string, tracking: number) {
  const chars = Array.from(texto);
  if (chars.length === 0) return 0;
  let largura = 0;
  for (const ch of chars) largura += ctx.measureText(ch).width + tracking;
  return largura - tracking;
}

function escreverTracking(
  ctx: CanvasRenderingContext2D,
  texto: string,
  x: number,
  y: number,
  tracking: number,
) {
  let cursor = x;
  for (const ch of Array.from(texto)) {
    ctx.fillText(ch, cursor, y);
    cursor += ctx.measureText(ch).width + tracking;
  }
}

function medirFatia(
  ctx: CanvasRenderingContext2D,
  texto: string,
  tamanho: number,
  peso: number,
  tracking: number,
  familia: string,
): Fatia {
  ctx.font = fonte(peso, tamanho, familia);
  return { texto, tamanho, peso, tracking, largura: larguraTracking(ctx, texto, tracking) };
}

/** Retângulo com raio por canto, no sentido dos ponteiros a partir do topo-esquerdo. */
function caminhoRetangulo(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  raios: [number, number, number, number],
) {
  const limite = Math.min(w, h) / 2;
  const [a, b, c, d] = raios.map((r) => Math.min(r, limite)) as [number, number, number, number];
  ctx.beginPath();
  ctx.moveTo(x + a, y);
  ctx.lineTo(x + w - b, y);
  ctx.arcTo(x + w, y, x + w, y + b, b);
  ctx.lineTo(x + w, y + h - c);
  ctx.arcTo(x + w, y + h, x + w - c, y + h, c);
  ctx.lineTo(x + d, y + h);
  ctx.arcTo(x, y + h, x, y + h - d, d);
  ctx.lineTo(x, y + a);
  ctx.arcTo(x, y, x + a, y, a);
  ctx.closePath();
}

/**
 * O contorno do carimbo, deslocado para dentro por `recuo`.
 *
 * O recuo é o que permite reaproveitar o mesmo formato para a borda externa, o
 * tracejado interno (`:before`) e o brilho de 35% (`box-shadow: inset`) sem
 * descrever a geometria três vezes — e sem `ctx.scale`, que estreitaria a linha
 * junto com a forma.
 */
function caminhoFormato(
  ctx: CanvasRenderingContext2D,
  formato: Formato,
  w: number,
  h: number,
  F: number,
  recuo = 0,
) {
  const x = recuo;
  const y = recuo;
  const lw = w - recuo * 2;
  const lh = h - recuo * 2;

  switch (formato) {
    case 'seal':
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, Math.min(lw, lh) / 2, 0, Math.PI * 2);
      ctx.closePath();
      return;

    case 'orbit':
      // O `:before` do CSS é o anel: elipse com `scaleX(1.05)` e `rotate(-5deg)`.
      ctx.beginPath();
      ctx.ellipse(w / 2, h / 2, (lw / 2) * 1.02, lh / 2, (-5 * Math.PI) / 180, 0, Math.PI * 2);
      ctx.closePath();
      return;

    case 'capsule':
      caminhoRetangulo(ctx, x, y, lw, lh, [lh / 2, lh / 2, lh / 2, lh / 2]);
      return;

    case 'split':
      caminhoRetangulo(ctx, x, y, lw, lh, [0.7 * F, 0.7 * F, 0.7 * F, 0.7 * F]);
      return;

    case 'monogram':
      caminhoRetangulo(ctx, x, y, lw, lh, [1.1 * F, 0.25 * F, 1.1 * F, 0.25 * F]);
      return;

    case 'certificate':
      caminhoRetangulo(ctx, x, y, lw, lh, [0, 0, 0, 0]);
      return;

    case 'ticket': {
      // `clip-path: polygon(0 0, 100% 0, 100% 74%, 94% 100%, 0 100%)` sobre um
      // retângulo de cantos alternados. O canto cortado é o do carimbo rasgado;
      // ele é o traço que dá nome ao formato, então vem antes do arredondamento.
      const r = 0.3 * F;
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + lw - 1.1 * F, y);
      ctx.arcTo(x + lw, y, x + lw, y + 1.1 * F, 1.1 * F);
      ctx.lineTo(x + lw, y + lh * 0.74);
      ctx.lineTo(x + lw * 0.94, y + lh);
      ctx.lineTo(x + 1.1 * F, y + lh);
      ctx.arcTo(x, y + lh, x, y + lh - 1.1 * F, 1.1 * F);
      ctx.lineTo(x, y + r);
      ctx.arcTo(x, y, x + r, y, r);
      ctx.closePath();
      return;
    }

    case 'signature':
      // Só a linha de baixo — `border-width: 0 0 .12em`. Sem área fechada, então
      // sem preenchimento possível: é o único formato que ignora "sólido".
      ctx.beginPath();
      ctx.moveTo(x, lh);
      ctx.lineTo(x + lw, lh);
      return;
  }
}

/** O símbolo da marca, no mesmo `viewBox 0 0 100 100` do SVG do componente. */
function desenharSimbolo(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  lado: number,
  cor: string,
) {
  const k = lado / 100;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(k, k);
  ctx.strokeStyle = cor;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.lineWidth = 6.5;
  ctx.beginPath();
  ctx.arc(50, 50, 42, 0, Math.PI * 2);
  ctx.stroke();

  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(51, 38);
  ctx.lineTo(76, 38);
  ctx.lineTo(88, 48);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(12, 52);
  ctx.lineTo(27, 64);
  ctx.lineTo(50, 64);
  ctx.stroke();

  ctx.restore();
}

export type Montado = {
  /** Medidas do carimbo NÃO rotacionado, em px. */
  largura: number;
  altura: number;
  /** Medidas da caixa que cabe o carimbo já inclinado — é o tamanho do PNG. */
  larguraCaixa: number;
  alturaCaixa: number;
  pintar: (ctx: CanvasRenderingContext2D) => void;
};

/**
 * Mede o carimbo e devolve a função que o pinta. Medir e pintar no mesmo lugar é
 * o que garante que a caixa exportada encoste no desenho: a largura sai do texto
 * que a pessoa digitou, não de um valor fixo que sobra ou corta.
 *
 * O `ctx` recebido aqui é usado só para medir texto (precisa da fonte carregada);
 * quem pinta é o `ctx` passado depois para `pintar`.
 */
export function montarCarimbo(ctx: CanvasRenderingContext2D, o: Opcoes): Montado {
  const F = o.base;
  const { familia, formato } = o;
  const empilhado = EMPILHADOS.has(formato);
  const mostraSerial = COM_SERIAL.has(formato) && o.serial.trim() !== '';
  const solido = o.acabamento === 'solid' && formato !== 'signature';

  const corTinta = solido ? '#ffffff' : o.cor;
  const larguraBorda = 0.11 * F;
  const ladoSimbolo = 2.45 * F;

  const pequeno = medirFatia(ctx, o.prefixo.toUpperCase(), 0.6 * F, 750, 0.17 * 0.6 * F, familia);
  const marca = medirFatia(ctx, o.marca, 1.18 * F, 900, -0.035 * 1.18 * F, familia);
  const serial = medirFatia(
    ctx,
    o.serial.toUpperCase(),
    0.44 * F,
    800,
    0.22 * 0.44 * F,
    familia,
  );

  const gapCopy = 0.14 * F;
  const larguraCopy = Math.max(pequeno.largura, marca.largura);
  const alturaCopy = pequeno.tamanho + gapCopy + marca.tamanho;

  // O recheio de cada formato, copiado do CSS: é ele que muda a silhueta tanto
  // quanto o raio da borda.
  const recheio: Record<Formato, [number, number]> = {
    capsule: [0.72 * F, 1.15 * F],
    seal: [0.9 * F, 1.1 * F],
    split: [0.72 * F, 1.0 * F],
    ticket: [0.72 * F, 1.3 * F],
    signature: [0.5 * F, 0.25 * F],
    orbit: [1.08 * F, 1.4 * F],
    monogram: [0.95 * F, 1.1 * F],
    certificate: [0.9 * F, 1.35 * F],
  };
  const [padY, padX] = recheio[formato];

  let largura: number;
  let altura: number;

  if (empilhado) {
    const alturaEmpilhada =
      ladoSimbolo +
      0.45 * F +
      alturaCopy +
      (mostraSerial ? 0.4 * F + serial.tamanho : 0);
    const conteudo = Math.max(larguraCopy, ladoSimbolo, serial.largura);
    largura = conteudo + padX * 2;
    altura = alturaEmpilhada + padY * 2;

    if (formato === 'seal') {
      // `aspect-ratio: 1` com `min-width: 9.4em`: o selo é redondo, então o lado
      // é o maior entre largura, altura e o mínimo.
      const lado = Math.max(largura, altura, 9.4 * F);
      largura = lado;
      altura = lado;
    } else {
      largura = Math.max(largura, 8.4 * F); // `min-width` do monograma
    }
  } else {
    const blocoLogo = ladoSimbolo + 0.7 * F; // símbolo + `padding-right` até o divisor
    largura =
      padX * 2 +
      blocoLogo +
      0.75 * F +
      larguraCopy +
      (mostraSerial ? 0.9 * F + serial.largura : 0);
    altura = padY * 2 + Math.max(ladoSimbolo, alturaCopy);

    if (formato === 'orbit') {
      // A elipse só toca o conteúdo nos eixos; nas diagonais ela corta. Inflar
      // pelos √2 dos semieixos é o que impede o texto de furar o anel.
      largura *= 1.14;
      altura *= 1.2;
    }
  }

  const rad = (o.rotacao * Math.PI) / 180;
  const cos = Math.abs(Math.cos(rad));
  const sen = Math.abs(Math.sin(rad));
  // A borda é centrada no caminho: metade dela fica FORA do retângulo medido, e
  // sem essa folga o PNG corta o traço nas quatro laterais.
  const folga = larguraBorda;
  const larguraCaixa = Math.ceil((largura + folga * 2) * cos + (altura + folga * 2) * sen);
  const alturaCaixa = Math.ceil((largura + folga * 2) * sen + (altura + folga * 2) * cos);

  const pintar = (c: CanvasRenderingContext2D) => {
    c.save();
    c.translate(larguraCaixa / 2, alturaCaixa / 2);
    c.rotate(rad);
    c.translate(-largura / 2, -altura / 2);

    c.lineJoin = 'round';
    c.lineCap = 'butt';

    // 1. corpo
    if (solido) {
      caminhoFormato(c, formato, largura, altura, F);
      c.fillStyle = o.cor;
      c.fill();
    }

    // 2. borda externa
    caminhoFormato(c, formato, formato === 'signature' ? largura : largura, altura, F, larguraBorda / 2);
    c.strokeStyle = o.cor;
    c.lineWidth = formato === 'signature' ? 0.12 * F : larguraBorda;
    if (formato !== 'orbit') c.stroke();
    else {
      c.lineWidth = 0.08 * F;
      c.stroke();
    }

    // 3. tracejado interno (`:before`) — o que faz o objeto ler como carimbo de
    //    borracha, e não como um botão arredondado.
    if (formato !== 'signature' && formato !== 'orbit' && formato !== 'certificate') {
      c.save();
      c.globalAlpha = 0.5;
      c.setLineDash([0.32 * F, 0.26 * F]);
      c.lineWidth = Math.max(1, 0.035 * F);
      c.strokeStyle = corTinta;
      caminhoFormato(c, formato, largura, altura, F, 0.18 * F);
      c.stroke();
      c.restore();
    }

    // 3b. o certificado troca o tracejado por um fio contínuo interno (`outline`
    //     com `outline-offset` negativo) — é o que o faz parecer diploma.
    if (formato === 'certificate') {
      c.save();
      c.globalAlpha = 0.45;
      c.lineWidth = Math.max(1, 0.055 * F);
      c.strokeStyle = corTinta;
      caminhoFormato(c, formato, largura, altura, F, 0.38 * F);
      c.stroke();
      c.restore();
    }

    // 4. textura diagonal. No CSS ela é `mix-blend-mode: multiply`, que sobre o
    //    preenchimento sólido (tinta branca) não muda nada — daí ela só existir
    //    no contorno, como no original.
    if (o.textura && !solido && formato !== 'signature') {
      c.save();
      caminhoFormato(c, formato, largura, altura, F);
      c.clip();
      c.globalAlpha = 0.14;
      c.strokeStyle = o.cor;
      c.lineWidth = 0.04 * F;
      const passo = 1.3 * F;
      const diagonal = largura + altura;
      c.translate(largura / 2, altura / 2);
      c.rotate((101 * Math.PI) / 180);
      for (let x = -diagonal; x < diagonal; x += passo) {
        c.beginPath();
        c.moveTo(x, -diagonal);
        c.lineTo(x, diagonal);
        c.stroke();
      }
      c.restore();
    }

    // 5. conteúdo
    c.fillStyle = corTinta;
    c.textBaseline = 'middle';
    c.textAlign = 'left';

    if (empilhado) {
      const cx = largura / 2;
      const alturaConteudo =
        ladoSimbolo + 0.45 * F + alturaCopy + (mostraSerial ? 0.4 * F + serial.tamanho : 0);
      let y = (altura - alturaConteudo) / 2;

      desenharSimbolo(c, cx - ladoSimbolo / 2, y, ladoSimbolo, corTinta);
      y += ladoSimbolo + 0.45 * F;

      // O divisor do monograma é horizontal (`border-bottom` no `.logo`).
      if (formato === 'monogram') {
        c.save();
        c.globalAlpha = 0.85;
        c.strokeStyle = corTinta;
        c.lineWidth = 0.065 * F;
        c.beginPath();
        c.moveTo(cx - larguraCopy / 2, y - 0.22 * F);
        c.lineTo(cx + larguraCopy / 2, y - 0.22 * F);
        c.stroke();
        c.restore();
      }

      c.font = fonte(pequeno.peso, pequeno.tamanho, familia);
      escreverTracking(
        c,
        pequeno.texto,
        cx - pequeno.largura / 2,
        y + pequeno.tamanho / 2,
        pequeno.tracking,
      );
      y += pequeno.tamanho + gapCopy;

      c.font = fonte(marca.peso, marca.tamanho, familia);
      escreverTracking(c, marca.texto, cx - marca.largura / 2, y + marca.tamanho / 2, marca.tracking);
      y += marca.tamanho;

      if (mostraSerial) {
        y += 0.4 * F;
        c.font = fonte(serial.peso, serial.tamanho, familia);
        escreverTracking(
          c,
          serial.texto,
          cx - serial.largura / 2,
          y + serial.tamanho / 2,
          serial.tracking,
        );
      }
    } else {
      const cy = altura / 2;
      const inicio = formato === 'orbit' ? (largura - (ladoSimbolo + 0.7 * F + 0.75 * F + larguraCopy)) / 2 : padX;

      desenharSimbolo(c, inicio, cy - ladoSimbolo / 2, ladoSimbolo, corTinta);

      // Divisor vertical. `split` e `certificate` levam o traço de ponta a ponta
      // (no CSS, via margem negativa); os outros o mantêm da altura do símbolo.
      const xDivisor = inicio + ladoSimbolo + 0.7 * F;
      const meia = ['split', 'certificate'].includes(formato) ? altura / 2 - padY * 0.35 : ladoSimbolo / 2;
      c.save();
      c.strokeStyle = corTinta;
      c.lineWidth = formato === 'split' ? 0.12 * F : 0.065 * F;
      if (formato === 'orbit') c.setLineDash([0.28 * F, 0.22 * F]);
      c.beginPath();
      c.moveTo(xDivisor, cy - meia);
      c.lineTo(xDivisor, cy + meia);
      c.stroke();
      c.restore();

      const xTexto = xDivisor + 0.75 * F;
      let y = cy - alturaCopy / 2;

      c.font = fonte(pequeno.peso, pequeno.tamanho, familia);
      escreverTracking(c, pequeno.texto, xTexto, y + pequeno.tamanho / 2, pequeno.tracking);
      y += pequeno.tamanho + gapCopy;

      c.font = fonte(marca.peso, marca.tamanho, familia);
      escreverTracking(c, marca.texto, xTexto, y + marca.tamanho / 2, marca.tracking);

      if (mostraSerial) {
        c.font = fonte(serial.peso, serial.tamanho, familia);
        escreverTracking(
          c,
          serial.texto,
          xTexto + larguraCopy + 0.9 * F,
          cy,
          serial.tracking,
        );
      }
    }

    c.restore();
  };

  return { largura, altura, larguraCaixa, alturaCaixa, pintar };
}

/**
 * Pinta num canvas já dimensionado. `escala` é o multiplicador de exportação
 * (2 = duas vezes a densidade), aplicado ANTES do desenho para que o traço
 * também engorde — exportar em 3× e depois ampliar não é a mesma coisa.
 */
export function renderizar(canvas: HTMLCanvasElement, o: Opcoes, escala: number): Montado {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas 2d indisponível');

  const montado = montarCarimbo(ctx, o);
  canvas.width = Math.ceil(montado.larguraCaixa * escala);
  canvas.height = Math.ceil(montado.alturaCaixa * escala);
  // `width`/`height` já limpam o bitmap; o `clearRect` é a garantia de que o
  // fundo é transparente mesmo se alguém reusar o canvas sem redimensionar.
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.setTransform(escala, 0, 0, escala, 0, 0);
  montado.pintar(ctx);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  return montado;
}
