/**
 * SIS-261 · Deriva `public/images/esg/esg2.webp` COM ALFA a partir de
 * `public/images/esg/esg2.png`.
 *
 * POR QUE ESTE SCRIPT EXISTE. A issue afirma que `esg2.png` tem «fundo
 * transparente». O arquivo entregue NÃO tem: medido com `sharp`, ele vem com
 * `channels: 3`, `hasAlpha: false`. O que está no lugar do fundo é o XADREZ DE
 * TRANSPARÊNCIA do editor, achatado como pixels OPACOS — dois cinzas alternando
 * num tabuleiro de ~9,2px (tons ≈198 e ≈139, razão 1,42). Trocar o `src` para
 * `esg2.png` sem mais nada colocaria um tabuleiro cinza de xadrez na seção, que
 * é exatamente o oposto do critério de aceite («sem placa branca atrás da PNG»).
 *
 * A FONTE NÃO É ALTERADA. `esg2.png` fica como ela entregou; o derivado é um
 * arquivo novo, `esg2.webp`. É o mesmo arranjo que a SIS-257 já usou para
 * `esg1.png` → `esg1.webp` (a página comenta a razão: `images.unoptimized=true`
 * impede o Next de derivar formato, então o WebP é servido direto). WebP porque
 * o item 1 pede «WebP com alfa se possível» — e é possível.
 *
 * COMO O ALFA É DERIVADO — cinco passos, cada um posto por um defeito MEDIDO na
 * volta anterior, não por precaução. Quem mexer aqui deve olhar
 * `docs/medidas/esg2-alfa.json` antes: os números citados abaixo saem dele.
 *
 * 1. ASSINATURA DE XADREZ, não tom absoluto. A primeira tentativa aceitou
 *    «cinza perto de 198 ou de 139» e pegou só 27,2% da imagem: os dois tons
 *    DERIVAM onde a sombra dos cartões cai sobre o tabuleiro (o canto inferior
 *    esquerdo, por exemplo, mede 176 em vez de 199). Sombra multiplica os dois
 *    tons pelo MESMO fator, então o que se conserva é a RAZÃO entre eles, não o
 *    valor. O teste virou: pixel dessaturado que tenha, num raio de 6px, outro
 *    pixel dessaturado na razão 1,30–1,56. Subiu para 44,7%.
 *
 * 2. COMPONENTES: A BORDA MAIS OS BOLSÕES GRANDES. O teste da razão sozinho
 *    aceitaria cinza de foto — o vidro do prédio, o concreto. A primeira versão
 *    só admitia o que estava LIGADO à borda por vizinhança-4, e isso deixou dois
 *    bolsões de xadrez opacos: a sombra DESFOCADA do cartão central forma um anel
 *    fechado de pixels não-neutros que isola o xadrez de dentro (medido: o pixel
 *    (1114, 456) é 198,198,198, xadrez legítimo, e ficava opaco).
 *    O critério passou a ser: componente que toca a borda, MAIS todo componente
 *    de xadrez com área ≥ 1500px. Isso não é arbitrário, é medido — a imagem tem
 *    415 componentes de xadrez e apenas TRÊS chegam a 1500px: o campo da borda
 *    (702.671px) e exatamente os dois bolsões (46.566px em 860,207–1195,848 e
 *    35.994px em 355,100–786,449). Nenhum interior de foto forma componente
 *    desse tamanho, então o limiar separa bolsão de ruído sem ambiguidade.
 *
 * 3. SEGUNDA PASSADA, RELAXADA, SÓ PARA A SOMBRA DESFOCADA. Restou uma faixa de
 *    xadrez abraçando o cartão central e o da turbina: ali a sombra é DESFOCADA,
 *    o desfoque mistura os dois tons e a razão local desaba abaixo de 1,30 — o
 *    passo 1 não podia mesmo alcançar. A segunda passada continua o mesmo
 *    preenchimento exigindo apenas «dessaturado e claridade média», e só a
 *    partir de pixels JÁ transparentes: ela não tem como iniciar dentro de uma
 *    foto. A faixa de sombra vira transparente inteira em vez de virar um borrão
 *    cinza sobre o fundo claro da seção — que é o que se quer aqui.
 *
 * 4. DOIS LIMIARES DE SATURAÇÃO, não um. Sobrava uma lasca de xadrez de ~20px de
 *    largura entre a pasta azul-clara e o cartão da turbina, e o motivo é que ali
 *    o xadrez está sombreado E COM TINTA AZULADA: o tom escuro mede 117/131/140,
 *    saturação 23, acima do limiar de 12 que valia. Subir o limiar para 26 fez a
 *    lasca entrar — e, na mesma volta, abriu um buraco branco na MESA da foto da
 *    sala de reunião, porque a passada relaxada do passo 3 passou a aceitar o
 *    cinza-azulado dela. Por isso os limiares se separaram: 26 para reconhecer o
 *    PADRÃO (passos 1 e 2), 12 para a passada relaxada (passo 3). Há ainda a prova
 *    de saturação mediana dos componentes internos, comentada onde ela está.
 *
 * 5. DILATAÇÃO DE 1px. A borda de cada cartão é antisserrilhada CONTRA o cinza
 *    do xadrez: sem isso sobra uma franja cinza de um pixel contornando toda a
 *    arte, visível sobre fundo claro. Come 1px de arte e mata a franja.
 *
 * O QUE ESTE SCRIPT NÃO É: um substituto para ela exportar `esg2` com canal alfa
 * de verdade. É uma reconstrução do alfa a partir do xadrez achatado, e por isso
 * mora num script versionado com os números à vista — se ela reexportar a arte
 * com transparência real, o caminho certo é apagar isto e derivar o WebP direto.
 *
 * Rodar: `node scripts/gerar-esg2-alfa.mjs`
 */
import { writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const ENTRADA = 'public/images/esg/esg2.png';
const SAIDA = 'public/images/esg/esg2.webp';

/* Razão entre os dois tons do tabuleiro, medida na borda: 198/139 = 1,424. A
   janela 1,30–1,56 absorve o ruído de ±3 por canal do arquivo. */
const RAZAO_MIN = 1.3;
const RAZAO_MAX = 1.56;
const RAIO = 6; // pouco mais de meio módulo (9,2px): garante achar o tom vizinho
const L_MIN = 80;
const L_MAX = 230; // 230 exclui os tiles brancos dos ícones (L ≈ 250)
/* DOIS limiares de saturação, e a diferença entre eles é medida — ver o passo 4
   do cabeçalho. O reconhecimento do PADRÃO tolera a tinta azulada que a sombra
   deixa no tabuleiro (sat 23); a passada relaxada NÃO pode tolerar, senão come
   cinza de foto. */
const SAT_XADREZ = 26;
const SAT_RELAXADO = 12;

const { data, info } = await sharp(ENTRADA).raw().toBuffer({ resolveWithObject: true });
const { width: w, height: h, channels: c } = info;
const total = w * h;

const L = new Uint8Array(total);
const sat = new Uint8Array(total);
for (let p = 0; p < total; p += 1) {
  const i = p * c;
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  L[p] = Math.round((r + g + b) / 3);
  sat[p] = Math.max(r, g, b) - Math.min(r, g, b);
}

const claridadeDeFundo = (p) => L[p] >= L_MIN && L[p] <= L_MAX;
const candidatoXadrez = (p) => sat[p] <= SAT_XADREZ && claridadeDeFundo(p);
const neutro = (p) => sat[p] <= SAT_RELAXADO && claridadeDeFundo(p);

// Passo 1 — assinatura de xadrez
const xadrez = new Uint8Array(total);
for (let y = 0; y < h; y += 1) {
  for (let x = 0; x < w; x += 1) {
    const p = y * w + x;
    if (!candidatoXadrez(p)) continue;
    let achou = false;
    for (let dy = -RAIO; dy <= RAIO && !achou; dy += 1) {
      const ny = y + dy;
      if (ny < 0 || ny >= h) continue;
      for (let dx = -RAIO; dx <= RAIO; dx += 1) {
        const nx = x + dx;
        if (nx < 0 || nx >= w) continue;
        const q = ny * w + nx;
        if (sat[q] > SAT_XADREZ) continue;
        const a = L[p];
        const b = L[q];
        const razao = a > b ? a / b : b / a;
        if (razao >= RAZAO_MIN && razao <= RAZAO_MAX) {
          achou = true;
          break;
        }
      }
    }
    if (achou) xadrez[p] = 1;
  }
}

/* Passo 2 — componentes de xadrez: o que toca a borda, mais os bolsões grandes.
   A área mínima está justificada no cabeçalho (415 componentes, 3 ≥ 1500px). */
const AREA_MINIMA = 1500;
const vago = new Uint8Array(total);
const componente = new Int32Array(total).fill(-1);
const membros = [];
const tocaBorda = [];
for (let p0 = 0; p0 < total; p0 += 1) {
  if (!xadrez[p0] || componente[p0] >= 0) continue;
  const id = membros.length;
  const pilha = [p0];
  componente[p0] = id;
  let borda = false;
  for (let qi = 0; qi < pilha.length; qi += 1) {
    const p = pilha[qi];
    const x = p % w;
    const y = (p - x) / w;
    if (x === 0 || y === 0 || x === w - 1 || y === h - 1) borda = true;
    for (const [nx, ny] of [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1],
    ]) {
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
      const q = ny * w + nx;
      if (xadrez[q] && componente[q] < 0) {
        componente[q] = id;
        pilha.push(q);
      }
    }
  }
  membros.push(pilha);
  tocaBorda.push(borda);
}
/* Saturação mediana máxima para um componente INTERNO ser aceito. O componente
   que toca a borda é o campo do editor e entra sem esta prova; um componente
   fechado precisa dela, e por um defeito medido: com `SAT_XADREZ` em 26, a MESA
   da foto da sala de reunião (branco-acinzentado, com sombra por cima, portanto
   com par de tons na razão 1,42) formou um componente de 2.068px e foi aceita só
   pela área — abriu um buraco branco no meio daquele cartão, visto na captura de
   comparação. O xadrez do editor é neutro por construção (198,198,198, sat 0);
   a mesa é azulada. 8 separa os dois com folga. */
const SAT_MEDIANA_MAX = 8;
const medianaSat = (pilha) => {
  const v = Array.from(pilha, (p) => sat[p]).sort((a, b) => a - b);
  return v[Math.floor(v.length / 2)];
};

const fila = [];
const aceitos = [];
membros.forEach((pilha, id) => {
  if (!tocaBorda[id]) {
    if (pilha.length < AREA_MINIMA) return;
    if (medianaSat(pilha) > SAT_MEDIANA_MAX) return;
  }
  aceitos.push(pilha.length);
  for (const p of pilha) {
    vago[p] = 1;
    fila.push(p);
  }
});

const preencher = (aceita) => {
  let qi = 0;
  while (qi < fila.length) {
    const p = fila[qi];
    qi += 1;
    const x = p % w;
    const y = (p - x) / w;
    const vizinhos = [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1],
    ];
    for (const [nx, ny] of vizinhos) {
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
      const q = ny * w + nx;
      if (!vago[q] && aceita(q)) {
        vago[q] = 1;
        fila.push(q);
      }
    }
  }
};

const apos2 = vago.reduce((a, v) => a + v, 0);
/* Passo 3 — a fila já contém todo o vago; `preencher` reexamina os vizinhos de
   tudo com o critério relaxado, e por isso não tem como iniciar dentro de foto. */
preencher((q) => neutro(q));
const apos3 = vago.reduce((a, v) => a + v, 0);

// Passo 5 — dilatação de 1px do vago, para comer a franja antisserrilhada
const dilatado = Uint8Array.from(vago);
for (let y = 0; y < h; y += 1) {
  for (let x = 0; x < w; x += 1) {
    const p = y * w + x;
    if (vago[p]) continue;
    if (
      (x > 0 && vago[p - 1]) ||
      (x < w - 1 && vago[p + 1]) ||
      (y > 0 && vago[p - w]) ||
      (y < h - 1 && vago[p + w])
    ) {
      dilatado[p] = 1;
    }
  }
}
const apos4 = dilatado.reduce((a, v) => a + v, 0);

const rgba = Buffer.alloc(total * 4);
for (let p = 0; p < total; p += 1) {
  const i = p * c;
  const o = p * 4;
  if (dilatado[p]) {
    rgba[o] = 0;
    rgba[o + 1] = 0;
    rgba[o + 2] = 0;
    rgba[o + 3] = 0;
  } else {
    rgba[o] = data[i];
    rgba[o + 1] = data[i + 1];
    rgba[o + 2] = data[i + 2];
    rgba[o + 3] = 255;
  }
}

const meta = await sharp(rgba, { raw: { width: w, height: h, channels: 4 } })
  .webp({ quality: 86, alphaQuality: 100 })
  .toFile(SAIDA);

const pct = (n) => `${((100 * n) / total).toFixed(1)}%`;
const medida = {
  entrada: { arquivo: ENTRADA, largura: w, altura: h, canais: c, alfa: false },
  limiares: {
    RAZAO_MIN,
    RAZAO_MAX,
    RAIO,
    L_MIN,
    L_MAX,
    SAT_XADREZ,
    SAT_RELAXADO,
    AREA_MINIMA,
    SAT_MEDIANA_MAX,
  },
  xadrez: { componentes: membros.length, aceitos: aceitos.sort((a, b) => b - a) },
  vago: { passo2: pct(apos2), passo3: pct(apos3), comDilatacao: pct(apos4) },
  saida: { arquivo: SAIDA, ...meta },
};
await writeFile('docs/medidas/esg2-alfa.json', `${JSON.stringify(medida, null, 2)}\n`);
console.log(JSON.stringify(
  medida,
  null,
  2,
));
