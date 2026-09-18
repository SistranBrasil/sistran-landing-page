/**
 * SIS-188 — deriva a arte do carimbo de «Principais Soluções Sistran Labs».
 *
 * `node scripts/gerar-carimbo-labs-sis188.mjs`
 *
 *   entrada: public/images/sistran-labs/carimbo-sistran-labs.png   (996x348, 112 kB, RGBA)
 *   saída:   public/images/sistran-labs/carimbo-sistran-labs.webp
 *
 * ── POR QUE DERIVAR, quando a issue diz «WebP derivado se preciso» ──
 *
 * Medido antes de decidir, e o alfa é REAL (extremos 0 e 255 — nada do xadrez do
 * Photoshop achatado em pixel que a SIS-235 teve de reconstruir por chave de
 * croma). Então não há nada a consertar; o motivo é PESO E TAMANHO DE USO, o
 * mesmo da SIS-277:
 *
 *   - a arte é exibida com no máximo 312 px de largura em CSS
 *     (`--carimbo-batida-w` de `.labs-principais-carimbo`, teto do `clamp`);
 *   - `images: { unoptimized: true }` (SIS-154) desliga a recompressão do
 *     `next/image`, então o que baixa é o arquivo do disco, tal e qual.
 *
 * Mandar 996 px de largura é 3,2x mais pixel do que qualquer tela usa.
 *
 * LARGURA DE SAÍDA 640: o dobro dos 312 px de exibição, cobrindo DPR 2 com folga.
 * É o mesmo número da SIS-277 por coincidência de escala, não por herança — os
 * dois cálculos partem do teto do `clamp` de cada peça.
 *
 * ── A ALTURA NÃO É ESCOLHIDA, E ISSO IMPORTA ──
 *
 * O `sharp` calcula a altura pela razão da entrada, e o script LÊ de volta as
 * dimensões gravadas para imprimi-las. É esse par lido que vai para as props
 * `larguraIntrinseca`/`alturaIntrinseca` do `CarimboBatida` — que é de onde o
 * componente monta o `--carimbo-batida-ar`. Assim a razão de aspecto tem UMA
 * fonte (o arquivo) e não pode divergir e achatar o desenho, que é o defeito que
 * o docblock de `carimbo-batida.css` promete evitar.
 *
 * ── `nearLossless`, e o número por quê ──
 *
 * A arte é VETOR RASTERIZADO: contorno azul chapado (#0757c7), tracejado interno
 * e fios de 1px sobre transparência. Nesse tipo de imagem a quantização com perda
 * gasta bits exatamente nas arestas que definem o desenho, e o custo real está no
 * canal alfa de linha fina — que o preditor sem perda comprime muito melhor. A
 * apuração comparativa está no cabeçalho de
 * `scripts/gerar-carimbo-parcerias-sis277.mjs` (mesma família de arte, mesma
 * conclusão); aqui os dois modos são medidos e impressos, para o número desta
 * peça ser o desta peça.
 *
 * O PNG FICA onde está, como fonte para regerar — mesma política da SIS-277.
 */
import sharp from 'sharp';
import { stat } from 'node:fs/promises';

const ENTRADA = 'public/images/sistran-labs/carimbo-sistran-labs.png';
const SAIDA = 'public/images/sistran-labs/carimbo-sistran-labs.webp';
const LARGURA = 640;

const origem = sharp(ENTRADA);
const meta = await origem.metadata();

if (!meta.hasAlpha) {
  /* Não é o caso hoje, e é por isso que a guarda existe: reentregue sem alfa, a
     arte desenharia um retângulo sólido sobre o fundo da seção — o modo de falha
     que a SIS-235 documentou. Melhor falhar aqui que em produção. */
  throw new Error('a arte de entrada não tem canal alfa — ver o cabeçalho da SIS-235 antes de seguir');
}

/* Comparação medida na hora, para o número não ser herdado de outra peça. */
const comum = { width: LARGURA, withoutEnlargement: true };
const [semPerda, quaseSemPerda, comPerda] = await Promise.all([
  sharp(ENTRADA).resize(comum).webp({ lossless: true, effort: 6 }).toBuffer(),
  sharp(ENTRADA).resize(comum).webp({ nearLossless: true, quality: 80, effort: 6 }).toBuffer(),
  sharp(ENTRADA).resize(comum).webp({ quality: 92, alphaQuality: 100, effort: 6 }).toBuffer(),
]);

await sharp(ENTRADA)
  .resize(comum)
  .webp({ nearLossless: true, quality: 80, effort: 6 })
  .toFile(SAIDA);

const [antes, depois] = await Promise.all([stat(ENTRADA), stat(SAIDA)]);
const saida = await sharp(SAIDA).metadata();

console.log(
  JSON.stringify(
    {
      entrada: {
        arquivo: ENTRADA,
        w: meta.width,
        h: meta.height,
        alfa: meta.hasAlpha,
        kB: Math.round(antes.size / 1024),
      },
      candidatos: {
        lossless: `${Math.round(semPerda.length / 1024)} kB`,
        nearLossless80: `${Math.round(quaseSemPerda.length / 1024)} kB  ← escolhido`,
        quality92: `${Math.round(comPerda.length / 1024)} kB`,
      },
      saida: {
        arquivo: SAIDA,
        w: saida.width,
        h: saida.height,
        alfa: saida.hasAlpha,
        bytes: depois.size,
        kB: Math.round(depois.size / 1024),
      },
      reducao: `${Math.round((1 - depois.size / antes.size) * 100)}%`,
      /* Este é o par que vai para as props do componente. */
      propsDoComponente: { larguraIntrinseca: saida.width, alturaIntrinseca: saida.height },
      razaoDeAspecto: {
        entrada: +(meta.width / meta.height).toFixed(4),
        saida: +(saida.width / saida.height).toFixed(4),
      },
    },
    null,
    1,
  ),
);
