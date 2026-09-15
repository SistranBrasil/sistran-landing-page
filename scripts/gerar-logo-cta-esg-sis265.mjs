/**
 * SIS-265 · Deriva `public/images/esg/logo-sistran-cta.webp` a partir de
 * `public/logosistranaltadefinicao.png`, para o selo do «Fale com a Gente!» da
 * `/esg` (`ContactCTAReferencia`).
 *
 * A PREMISSA DA ISSUE NÃO SE CONFIRMOU, E ISSO MUDA O QUE O SCRIPT FAZ. A issue
 * afirma que a arte HD tem «fundo PRETO chapado, não alfa» e manda derrubar esse
 * preto por threshold de canal. Medido com `sharp`, o arquivo entregue tem alfa
 * DE VERDADE: `channels: 4`, `hasAlpha: true`, 80,61% dos pixels em `alpha=0`, e
 * os quatro cantos MAIS o centro geométrico todos em `[0,0,0,0]`. Pixels opacos
 * escuros (luminância < 20 com `alpha=255`): ZERO — 0,00% da imagem. O símbolo é
 * branco: 0,28% da imagem é opaco e claro, o que casa com a silhueta fina do
 * anel + swoosh.
 *
 * O QUE ENGANA. Sob os pixels transparentes o RGB guardado é `0,0,0`. Visualizador
 * que ignora o canal alfa — ou um `Read` de imagem que achata sobre preto —
 * mostra exatamente a «caixa preta» que a issue descreve. Ela não existe no
 * arquivo. Por isso NÃO há threshold aqui: derrubar «preto» por canal, num
 * arquivo cujo preto está apenas sob alfa zero, só destruiria a antisserrilha do
 * anel (ela é branco com alfa parcial) e devolveria uma silhueta serrilhada.
 *
 * ENTÃO POR QUE DERIVAR? Por dois motivos, nenhum deles o fundo:
 *
 * 1. PESO. `images.unoptimized = true` no `next.config.mjs` (SIS-154) desliga a
 *    derivação de formato do Next: o `src` do JSX vai cru pela rede. O PNG fonte
 *    é 324.169 bytes de arte 1254×1254 para um selo que renderiza a ~203px. O
 *    WebP derivado é 27.794 bytes — 91,4% menos.
 * 2. RESOLUÇÃO. 640×640 não é número redondo por gosto: `--cta-ref-arte-w` chega
 *    a `clamp(520px, 37vw, 760px)` e o selo é `width: 38%` dela, logo 288,8px no
 *    teto; 640 cobre isso em DPR 2 (577,6px) com folga e sem carregar os 1254.
 *
 * A FRANJA ESCURA QUE O RGB PRETO PODERIA CAUSAR — E POR QUE NÃO CAUSA. Reduzir
 * 1254→640 mistura cada pixel com os vizinhos; se a mistura fosse feita no RGB
 * direto, o `0,0,0` de baixo do alfa sujaria a borda branca e o selo ganharia um
 * contorno cinza sobre o blob azul. O `resize` do `sharp` premultiplica o alfa
 * por padrão, então o preto entra com peso zero. Medido na saída: luminância
 * média dos pixels de borda (alfa parcial) = 251,1/255, e os 249 pixels de borda
 * escuros que restam têm alfa MÁXIMO de 2/255 — 0,8% de opacidade, invisível.
 *
 * A FONTE NÃO É ALTERADA: `public/logosistranaltadefinicao.png` fica como veio, e
 * `public/images/sistran-logo.png` NÃO é tocado — ele continua servindo favicon,
 * `CompanySignature`, a máscara do `positioning-ecosystem.css` e o
 * `data/posicionamento.ts`. Este arquivo novo é só do selo da `/esg`.
 *
 * Rodar: `node scripts/gerar-logo-cta-esg-sis265.mjs`
 */
import { writeFile } from 'node:fs/promises';
import { statSync } from 'node:fs';
import sharp from 'sharp';

const ENTRADA = 'public/logosistranaltadefinicao.png';
const SAIDA = 'public/images/esg/logo-sistran-cta.webp';

/* Teto do selo: 760px de arte × 38% = 288,8px, × DPR 2 = 577,6px. */
const LADO = 640;

/** Estatísticas de alfa/luminância e caixa do conteúdo visível de um arquivo. */
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
  let opacosClaros = 0;
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
        if (lum < 20) opacosEscuros += 1;
        if (lum > 235) opacosClaros += 1;
      } else {
        /* Alfa parcial = pixel de antisserrilha. É AQUI que uma franja escura
           apareceria, e é por isso que a luminância média deste grupo é a
           medida que interessa, não a da imagem toda. */
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
  const larguraVisivel = maxX - minX + 1;
  const alturaVisivel = maxY - minY + 1;

  return {
    arquivo,
    bytes: statSync(arquivo).size,
    formato: meta.format,
    largura: w,
    altura: h,
    canais: meta.channels,
    temAlfa: Boolean(meta.hasAlpha),
    amostras: {
      cantoSuperiorEsquerdo: px(0, 0),
      cantoSuperiorDireito: px(w - 1, 0),
      cantoInferiorEsquerdo: px(0, h - 1),
      cantoInferiorDireito: px(w - 1, h - 1),
      centro: px(w >> 1, h >> 1),
    },
    alfa: { pctTransparente: pct(transparentes), pctOpaco: pct(opacos) },
    /* `pctOpacoEscuro: 0` é a prova de que não há caixa preta: nenhum pixel
       escuro é visível, nem no fundo nem em franja opaca. */
    opacos: { pctOpacoEscuro: pct(opacosEscuros), pctOpacoClaro: pct(opacosClaros) },
    antisserrilha: {
      pixels: borda,
      lumMedia: borda ? Number((bordaLumSoma / borda).toFixed(1)) : null,
      pixelsEscuros: bordaEscura,
      alfaMaximoDosEscuros: bordaEscuraAlfaMax,
    },
    conteudoVisivel: {
      caixa: { minX, minY, maxX, maxY },
      largura: larguraVisivel,
      altura: alturaVisivel,
      razao: Number((larguraVisivel / alturaVisivel).toFixed(4)),
      /* Quanto da caixa o desenho ocupa: é o que decide o tamanho APARENTE do
         selo, já que o CSS dá `width: 100%` ao `img`. */
      pctDaLargura: Number(((100 * larguraVisivel) / w).toFixed(2)),
    },
  };
};

const antes = await medir(ENTRADA);

/* `fit: contain` com fundo transparente: a fonte já é ~quadrada (razão medida
   1,0038), então isto redimensiona sem recortar nem esticar. NÃO há `flatten`,
   `threshold` nem `removeAlpha` em nenhum ponto — ver o cabeçalho. */
await sharp(ENTRADA)
  .resize(LADO, LADO, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .webp({ quality: 92, alphaQuality: 100, effort: 6 })
  .toFile(SAIDA);

const depois = await medir(SAIDA);

/* O selo ANTIGO, só para registrar o que muda de aparência. `sistran-logo.png` é
   442×457 (não quadrado) e seu desenho ocupa 78,96% da largura da caixa; a arte
   HD ocupa ~84%. Como o CSS escala pela largura da CAIXA, o símbolo cresce ~6%
   e passa a ficar centrado de verdade (no antigo o desenho estava 13,5px acima
   do centro vertical da caixa). Nenhuma regra de CSS foi mexida por isso — é a
   consequência de usar a proporção real, que é o que a issue pede. */
const anterior = await medir('public/images/sistran-logo.png');

const medida = {
  issue: 'SIS-265',
  premissaDaIssue: {
    afirmado: 'fundo PRETO chapado, não alfa; derrubar por threshold',
    medido:
      'PNG fonte tem alfa real (hasAlpha: true, 80,61% em alpha=0, cantos e centro em [0,0,0,0], zero pixel opaco escuro). O RGB 0,0,0 existe apenas SOB os pixels transparentes.',
    consequencia: 'Nenhum threshold aplicado; o alfa é preservado e só há reamostragem + WebP.',
  },
  motivoDaDerivada: {
    peso: 'images.unoptimized=true serviria o PNG cru',
    resolucao: `selo chega a 288,8px (38% de 760px) => ${LADO} cobre DPR 2`,
  },
  fonte: antes,
  saida: depois,
  seloAnterior: anterior,
  reducaoDePeso: `${(100 * (1 - depois.bytes / antes.bytes)).toFixed(1)}%`,
};

await writeFile('docs/medidas/logo-cta-esg-sis265.json', `${JSON.stringify(medida, null, 2)}\n`);
console.log(JSON.stringify(medida, null, 2));
