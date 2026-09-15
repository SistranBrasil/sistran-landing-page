/**
 * SIS-274 · Deriva `public/images/loading/logo-sistran-portao.webp` a partir de
 * `public/logosistranaltadefinicao.png`, para o centro do `RouteLoadGate`.
 *
 * A PREMISSA DA ISSUE NÃO SE CONFIRMOU — e é a MESMA premissa que já não se
 * confirmou na SIS-265. A issue avisa «o PNG HD tem fundo preto: no azul
 * `#1273bc` não pode aparecer caixa preta — usar mask/`mix-blend`/asset com
 * alfa». Medido: o arquivo tem alfa DE VERDADE (`hasAlpha: true`, 80,6% dos
 * pixels em `alpha=0`, cantos e centro em `[0,0,0,0]`, ZERO pixel opaco escuro),
 * e o símbolo é BRANCO (luminância média dos opacos = 252,9/255). O `0,0,0` que
 * aparece em visualizador que ignora alfa está apenas GUARDADO SOB os pixels
 * transparentes. Portanto: nenhum `mask`, nenhum `mix-blend-mode`, nenhum
 * threshold. Todos os três estragariam a antisserrilha do anel — que é branco
 * com alfa parcial — em troca de resolver um problema que não existe. O
 * raciocínio completo e as contas estão em
 * `scripts/gerar-logo-cta-esg-sis265.mjs`; aqui não se repete, se reusa.
 *
 * ENTÃO POR QUE DERIVAR, se o alfa já está certo? Por PESO, e o motivo é
 * específico deste componente:
 *
 *  • `images: { unoptimized: true }` no `next.config.mjs` (SIS-154) desliga a
 *    derivação do Next — o `src` do JSX vai CRU pela rede. Apontar para a fonte
 *    seria servir 324.169 bytes de arte 1254×1254.
 *  • E aqui isso é pior que em qualquer outro lugar do site: este é o overlay que
 *    cobre a tela EM TODA troca de rota, e ele vem no HTML do servidor. Um asset
 *    de 324 KB no caminho crítico do primeiro paint transformaria o portão de
 *    carregamento em mais uma coisa a carregar — a tela ficaria azul e vazia até
 *    a logo chegar. A escrita «SISTRAN» que ele substitui não custava nenhum
 *    byte de rede além da fonte.
 *
 * POR QUE 320: o CSS dá à logo `clamp(4.5rem, 16vw, 8rem)`, ou seja no máximo
 * 128px de lado. 320 cobre 128px em DPR 2 (256px) com folga, e nada além disso é
 * pixel pago sem ninguém para ver.
 *
 * A FONTE NÃO É ALTERADA, e `public/images/esg/logo-sistran-cta.webp` (640, da
 * SIS-265) NÃO é reusado: ele é o dobro do lado necessário aqui, e mora num
 * caminho de rota (`images/esg/`) — o portão é global. Duas derivadas pequenas de
 * uma fonte comum custam menos que uma rota importar o asset da outra.
 *
 * Rodar: `node scripts/gerar-logo-portao-sis274.mjs`
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { statSync } from 'node:fs';
import sharp from 'sharp';

const ENTRADA = 'public/logosistranaltadefinicao.png';
const SAIDA = 'public/images/loading/logo-sistran-portao.webp';

/* Teto da logo no CSS: 8rem = 128px, × DPR 2 = 256px. */
const LADO = 320;

/* O azul novo do overlay. Entra aqui porque a pergunta «aparece caixa preta?» só
   tem resposta CONTRA um fundo: é o achatamento sobre este azul que prova que a
   arte não suja o overlay. */
const FUNDO = { r: 0x12, g: 0x73, b: 0xbc };

/** Alfa, luminância e caixa do conteúdo visível — mesma sonda da SIS-265. */
const medir = async (arquivo) => {
  const meta = await sharp(arquivo).metadata();
  const { data, info } = await sharp(arquivo).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h, channels: c } = info;
  const total = w * h;
  const px = (x, y) => {
    const o = (y * w + x) * c;
    return [data[o], data[o + 1], data[o + 2], data[o + 3]];
  };

  let transparentes = 0;
  let opacos = 0;
  let opacosEscuros = 0;
  let opacosLumSoma = 0;
  let borda = 0;
  let bordaLumSoma = 0;
  let bordaEscura = 0;
  let bordaEscuraAlfaMax = 0;
  let minX = w;
  let minY = h;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      const o = (y * w + x) * c;
      const a = data[o + 3];
      const lum = (data[o] + data[o + 1] + data[o + 2]) / 3;
      if (a === 0) {
        transparentes += 1;
      } else if (a === 255) {
        opacos += 1;
        opacosLumSoma += lum;
        if (lum < 20) opacosEscuros += 1;
      } else {
        borda += 1;
        bordaLumSoma += lum;
        if (lum < 60) {
          bordaEscura += 1;
          if (a > bordaEscuraAlfaMax) bordaEscuraAlfaMax = a;
        }
      }
      if (a > 8) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  const pct = (n) => Number(((100 * n) / total).toFixed(3));
  return {
    arquivo,
    bytes: statSync(arquivo).size,
    formato: meta.format,
    lado: `${w}×${h}`,
    temAlfa: Boolean(meta.hasAlpha),
    cantosECentro: {
      supEsq: px(0, 0),
      supDir: px(w - 1, 0),
      infEsq: px(0, h - 1),
      infDir: px(w - 1, h - 1),
      centro: px(w >> 1, h >> 1),
    },
    alfa: { pctTransparente: pct(transparentes), pctOpaco: pct(opacos) },
    /* `pctOpacoEscuro: 0` é a prova de que não há caixa preta a recortar. */
    tinta: {
      pctOpacoEscuro: pct(opacosEscuros),
      lumMediaDosOpacos: opacos ? Number((opacosLumSoma / opacos).toFixed(1)) : null,
    },
    antisserrilha: {
      pixels: borda,
      lumMedia: borda ? Number((bordaLumSoma / borda).toFixed(1)) : null,
      pixelsEscuros: bordaEscura,
      alfaMaximoDosEscuros: bordaEscuraAlfaMax,
    },
    conteudoVisivel: { caixa: { minX, minY, maxX, maxY }, largura: maxX - minX + 1, altura: maxY - minY + 1 },
  };
};

await mkdir('public/images/loading', { recursive: true });
await mkdir('docs/medidas', { recursive: true });

const antes = await medir(ENTRADA);

/* Sem `flatten`, sem `threshold`, sem `removeAlpha`. O `resize` do `sharp`
   premultiplica o alfa, então o `0,0,0` de baixo dos transparentes entra na
   reamostragem com peso ZERO e não cria franja escura na borda do anel. */
await sharp(ENTRADA)
  .resize(LADO, LADO, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .webp({ quality: 92, alphaQuality: 100, effort: 6 })
  .toFile(SAIDA);

const depois = await medir(SAIDA);

/* A PROVA DE QUE NÃO HÁ CAIXA PRETA NO AZUL: achata a derivada sobre `#1273bc` e
   mede as quatro bordas do quadro. Se existisse caixa, moldura ou franja, é aqui
   que ela apareceria — os pixels de canto TÊM de voltar exatamente o azul. */
const achatado = await sharp(SAIDA).flatten({ background: FUNDO }).raw().toBuffer({ resolveWithObject: true });
const { data: ad, info: ai } = achatado;
const amostra = (x, y) => {
  const o = (y * ai.width + x) * ai.channels;
  return [ad[o], ad[o + 1], ad[o + 2]];
};
const iguaisAoFundo = (p) => p[0] === FUNDO.r && p[1] === FUNDO.g && p[2] === FUNDO.b;
const cantos = {
  supEsq: amostra(0, 0),
  supDir: amostra(ai.width - 1, 0),
  infEsq: amostra(0, ai.height - 1),
  infDir: amostra(ai.width - 1, ai.height - 1),
};
/* Perímetro inteiro, não só os quatro cantos: uma moldura de 1px passaria pelos
   cantos se ela fosse arredondada. */
let perimetroForaDoFundo = 0;
for (let x = 0; x < ai.width; x += 1) {
  if (!iguaisAoFundo(amostra(x, 0))) perimetroForaDoFundo += 1;
  if (!iguaisAoFundo(amostra(x, ai.height - 1))) perimetroForaDoFundo += 1;
}
for (let y = 0; y < ai.height; y += 1) {
  if (!iguaisAoFundo(amostra(0, y))) perimetroForaDoFundo += 1;
  if (!iguaisAoFundo(amostra(ai.width - 1, y))) perimetroForaDoFundo += 1;
}

/** Contraste WCAG entre duas cores sRGB. */
const relLum = ([r, g, b]) => {
  const canal = (v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
};
const contraste = (a, b) => {
  const [hi, lo] = [relLum(a), relLum(b)].sort((x, y) => y - x);
  return Number(((hi + 0.05) / (lo + 0.05)).toFixed(2));
};

const azul = [FUNDO.r, FUNDO.g, FUNDO.b];
const medida = {
  issue: 'SIS-274',
  premissaDaIssue: {
    afirmado: 'o PNG HD tem fundo preto; usar mask/mix-blend/recorte para não mostrar caixa preta no azul',
    medido:
      'alfa real (hasAlpha: true, 80,6% em alpha=0, cantos e centro em [0,0,0,0], zero pixel opaco escuro); símbolo BRANCO (lum. média dos opacos 252,9/255). O preto está apenas sob alfa zero.',
    consequencia: 'Nenhum mask, mix-blend-mode ou threshold. Só reamostragem premultiplicada + WebP.',
  },
  motivoDaDerivada: {
    peso: 'images.unoptimized=true serviria o PNG cru de 324.169 bytes no overlay que cobre TODA troca de rota',
    resolucao: `logo chega a 128px (clamp 8rem) => ${LADO} cobre DPR 2`,
  },
  fonte: antes,
  saida: depois,
  reducaoDePeso: `${(100 * (1 - depois.bytes / antes.bytes)).toFixed(1)}%`,
  semCaixaPretaNoAzul: {
    fundoTestado: '#1273bc',
    cantos,
    cantosTodosIguaisAoFundo: Object.values(cantos).every(iguaisAoFundo),
    perimetroForaDoFundo,
  },
  contrasteNoAzulNovo: {
    /* Por que estes três números: a logo é gráfico (mínimo 3:1 em WCAG 1.4.11), e
       o `.signal` do portão era `#2ac4ff` — que no navy antigo passava folgado e
       neste azul NÃO passa. É esta linha que obriga a recalibrar o sinal. */
    brancoSobreAzul: contraste([255, 255, 255], azul),
    cianoAntigo2ac4ffSobreAzul: contraste([0x2a, 0xc4, 0xff], azul),
    cianoClaro0ed8f6SobreAzul: contraste([0x0e, 0xd8, 0xf6], azul),
  },
};

await writeFile('docs/medidas/logo-portao-sis274.json', `${JSON.stringify(medida, null, 2)}\n`);
console.log(JSON.stringify(medida, null, 2));
