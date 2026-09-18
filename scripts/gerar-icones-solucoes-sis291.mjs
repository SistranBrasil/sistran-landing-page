/**
 * SIS-291 (2ª volta) — deriva os ícones PNG entregues para a seção «Já
 * desenvolvemos…» de `/sistran-labs`.
 *
 * `node scripts/gerar-icones-solucoes-sis291.mjs`
 *
 * SÃO DOIS PROBLEMAS DIFERENTES, e por isso duas rotinas neste mesmo arquivo.
 *
 * ── 1. Os quatro ícones (churn, fast, smart, email) ───────────────────────────
 *
 * Chegam 1254×1254 RGBA, com o fundo já transparente (alfa mínimo 0 nos quatro,
 * medido) — mas com a TINTA ocupando frações bem diferentes da tela:
 *   churn 556×555 · fast 746×744 · smart 578×697 · email 640×446
 * Colocados como estão dentro da mesma plaqueta redonda, o `fast` apareceria ~34%
 * maior que o `churn` e o `email` sairia achatado. Então cada um é RECORTADO na
 * própria caixa de tinta (limiar de alfa 24, o mesmo da medição) e recolocado
 * centrado numa tela quadrada, com a tinta ocupando `OCUPACAO` do lado. Depois
 * disso os quatro têm o mesmo tamanho óptico, e é a plaqueta do CSS que manda no
 * tamanho final.
 *
 * `email.png` é o único mais largo que alto (640×446): o `fit: 'contain'` respeita
 * a proporção, então ele ocupa a largura e sobra alfa acima e abaixo — é o
 * comportamento certo para um envelope, e não esticar.
 *
 * LADO 128: a plaqueta mede `clamp(2.75rem, 4vw, 3.25rem)` (44–52px) e o ícone
 * dentro dela fica em ~28px; 128 cobre DPR 2 com folga. O peso é o motivo de
 * existir a conversão: os quatro PNGs somam 916 KiB (é o item 4 da issue), e o
 * WebP a 128px derruba isso para poucos KiB sem tocar em pixel visível.
 *
 * ── 2. O letreiro `guru1.png` ─────────────────────────────────────────────────
 *
 * Chega 1024×512 RGB SEM alfa e com FUNDO PRETO (58,4% da tela é preto puro,
 * medido; os quatro cantos são 0,0,0). Sobre a cápsula clara do card ele entraria
 * como um retângulo preto, então o preto vira transparência.
 *
 * A chave é ADITIVA e não por limiar: `alfa = max(R,G,B)` e a cor é
 * desmultiplicada (`cor = pixel / alfa`). É a conversão correta para arte
 * renderizada sobre preto — preto puro vira alfa 0, o corpo da letra mantém a cor
 * cheia, e a franja de antialiasing sai com alfa proporcional em vez de recorte
 * duro. Um limiar simples («preto abaixo de X vira transparente») deixaria halo
 * escuro em toda a borda das letras.
 *
 * O QUE A CHAVE CUSTA, e está resolvido no CSS, não aqui: junto com o fundo vai a
 * SOMBRA que o render tinha embaixo das letras — e é ela que dava contorno ao
 * «de seguros», que neste asset é BRANCO. Sobre a cápsula clara, branco sem sombra
 * não existe. A separação volta como `drop-shadow` na regra `.labs-guru-letreiro`
 * do `globals.css`, que é filtro e SEGUE O CANAL ALFA (a mesma escolha já escrita
 * em `.labs-guru-arte`). Recolorir as letras brancas foi considerado e recusado:
 * os realces especulares das letras azuis também são quase brancos (o
 * histograma de espalhamento cromático dos pixels claros é bimodal, 17,9% abaixo
 * de 10 e 66,3% acima de 120, mas a faixa do meio é justamente a rampa desses
 * realces), então qualquer troca por cor pintaria o biselado do «guru».
 *
 * LARGURA 800: o letreiro ocupa a largura do corpo do card (~300px medidos a
 * 1440), e 800 cobre DPR 2 com folga.
 *
 * Os PNGs de origem FICAM NO REPO como matriz, como nas outras voltas.
 *
 * Ferramenta de bancada; nada disto entra no bundle.
 */
import { stat } from 'node:fs/promises';
import sharp from 'sharp';

const PASTA = 'public/images/sistran-labs/icones';
const ICONES = ['churn', 'fast', 'smart', 'email'];
const LADO = 128;
const OCUPACAO = 0.88; // fração do lado que a tinta ocupa depois do recorte
const LIMIAR_ALFA = 24;

/** Caixa da tinta: primeira e última linha/coluna com alfa acima do limiar. */
async function caixaDeTinta(origem) {
  const { data, info } = await sharp(origem)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  let x0 = Infinity;
  let y0 = Infinity;
  let x1 = -1;
  let y1 = -1;
  for (let y = 0; y < info.height; y += 1) {
    for (let x = 0; x < info.width; x += 1) {
      if (data[(y * info.width + x) * 4 + 3] <= LIMIAR_ALFA) continue;
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
    }
  }
  return { left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 };
}

const saida = [];

for (const nome of ICONES) {
  const origem = `${PASTA}/${nome}.png`;
  const destino = `${PASTA}/${nome}.webp`;
  const caixa = await caixaDeTinta(origem);
  const dentro = Math.round(LADO * OCUPACAO);

  const recortado = await sharp(origem)
    .extract(caixa)
    .resize({
      width: dentro,
      height: dentro,
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .toBuffer();

  const webp = await sharp({
    create: {
      width: LADO,
      height: LADO,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: recortado, gravity: 'center' }])
    .webp({ quality: 92, effort: 6, alphaQuality: 100 })
    .toBuffer();
  await sharp(webp).toFile(destino);

  saida.push({
    arquivo: `${nome}.webp`,
    caixaDeTinta: `${caixa.width}x${caixa.height} em (${caixa.left},${caixa.top})`,
    destino: `${LADO}x${LADO}`,
    bytesOrigem: (await stat(origem)).size,
    bytes: webp.length,
  });
}

/* ── O letreiro ────────────────────────────────────────────────────────────── */
{
  const origem = `${PASTA}/guru1.png`;
  const destino = `${PASTA}/guru1.webp`;
  const { data, info } = await sharp(origem).raw().toBuffer({ resolveWithObject: true });
  const ch = info.channels;
  const rgba = Buffer.alloc(info.width * info.height * 4);
  let opacos = 0;
  for (let p = 0; p < info.width * info.height; p += 1) {
    const i = p * ch;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = Math.max(r, g, b); // chave aditiva: preto = 0
    const j = p * 4;
    if (a === 0) {
      rgba[j] = 0;
      rgba[j + 1] = 0;
      rgba[j + 2] = 0;
      rgba[j + 3] = 0;
      continue;
    }
    /* desmultiplica: devolve a cor cheia da letra, e não a cor já escurecida
       pela mistura com o preto do fundo. */
    const k = 255 / a;
    rgba[j] = Math.min(255, Math.round(r * k));
    rgba[j + 1] = Math.min(255, Math.round(g * k));
    rgba[j + 2] = Math.min(255, Math.round(b * k));
    rgba[j + 3] = a;
    if (a > 250) opacos += 1;
  }

  const chaveado = sharp(rgba, {
    raw: { width: info.width, height: info.height, channels: 4 },
  });
  const caixa = await caixaDeTinta(await chaveado.clone().png().toBuffer());
  const webp = await chaveado
    .clone()
    .extract(caixa)
    .resize({ width: 800, withoutEnlargement: true })
    .webp({ quality: 90, effort: 6, alphaQuality: 100 })
    .toBuffer();
  await sharp(webp).toFile(destino);
  const meta = await sharp(webp).metadata();

  saida.push({
    arquivo: 'guru1.webp',
    caixaDeTinta: `${caixa.width}x${caixa.height} em (${caixa.left},${caixa.top})`,
    destino: `${meta.width}x${meta.height}`,
    pixelsOpacos: `${Math.round((opacos / (info.width * info.height)) * 1000) / 10}%`,
    bytesOrigem: (await stat(origem)).size,
    bytes: webp.length,
  });
}

console.log(JSON.stringify(saida, null, 1));
