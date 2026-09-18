/**
 * SIS-277 — deriva a arte do carimbo de `/parceiros-e-implementacoes`.
 *
 * `node scripts/gerar-carimbo-parcerias-sis277.mjs`
 *
 *   entrada: public/carimbo/carimbo-parcerias.png    (1524x476, 189 kB, RGBA)
 *   saída:   public/images/parceiros/carimbo-parcerias.webp
 *
 * ── POR QUE EXISTE ESTE SCRIPT (e por que ele é MUITO mais curto que o da
 *    SIS-235) ──
 *
 * O passo 4 da issue prevê os dois ramos: derivar «se o PNG for pesado/sem alfa
 * limpo», servir o arquivo «se já estiver ok». Medido antes de decidir:
 *
 *     1524x476 · RGBA · alfa com extremos (0, 255) · 189 kB
 *
 * O alfa é REAL — ao contrário do `carimbo.png` da SIS-235, que trazia o xadrez
 * do Photoshop achatado em pixels e exigiu chave de croma para reconstruir a
 * transparência (o cabeçalho daquele script conta a apuração inteira). Aqui não
 * há nada a reconstruir: o único motivo da derivada é PESO E TAMANHO DE USO.
 *
 * O arquivo é servido como está para o visitante — `images: { unoptimized: true }`
 * no `next.config.mjs` (SIS-154) desliga a recompressão do `next/image` —, e a
 * arte é exibida com no máximo 280 px de largura em CSS. Servir 1524 px de
 * largura é mandar 5,4x mais pixel do que qualquer tela usa, e a abertura é a
 * primeira coisa acima da dobra desta rota.
 *
 * LARGURA DE SAÍDA 640: o dobro dos 280 px de exibição (`--carimbo-w` em
 * `carimbo-batida.css`, teto do `clamp`), com folga — cobre DPR 2 exato e sobra
 * para o teto crescer um pouco sem voltar aqui. Acima disso não há ganho visível
 * numa peça deste tamanho, e cada byte está acima da dobra.
 *
 * O PNG FICA onde está, como fonte para regerar — mesma política da capa em
 * `scripts/otimizar-capa-parceiros-sis225.mjs`.
 */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { stat } from 'node:fs/promises';

const ENTRADA = 'public/carimbo/carimbo-parcerias.png';
const SAIDA = 'public/images/parceiros/carimbo-parcerias.webp';
const LARGURA = 640;

await mkdir('public/images/parceiros', { recursive: true });

const origem = sharp(ENTRADA);
const meta = await origem.metadata();
if (!meta.hasAlpha) {
  /* Não é o caso hoje, e é justamente por isso que a guarda existe: se um dia a
     arte for reentregue sem alfa, o `<img>` desenharia um retângulo sólido sobre
     a capa — o modo de falha que a SIS-235 documentou. Melhor falhar aqui. */
  throw new Error('a arte de entrada não tem canal alfa — ver o cabeçalho da SIS-235 antes de seguir');
}

/* `nearLossless`, e o número por quê. A arte é VETOR RASTERIZADO — linhas finas
   chapadas de ciano, tracejado e fios de 1px sobre transparente —, e nesse tipo
   de imagem o WebP com perda gasta bits justamente nas arestas que definem o
   desenho. Comparado a 640px de largura, `effort: 6`:
 *
 *     quality 92 + alphaQuality 100 ......... 57 kB
 *     quality 92 + alphaQuality 90 .......... 55 kB
 *     lossless ............................... 46 kB
 *     quality 84 + alphaQuality 95 ........... 48 kB
 *     nearLossless (quality 80) .............. 38 kB   ← escolhido
 *
 * O modo com perda é o MAIS PESADO aqui, o que soa errado e não é: a maior parte
 * do custo está no canal alfa de linha fina, que o preditor sem perda comprime
 * bem melhor do que a quantização DCT. `nearLossless` fica 17% abaixo do lossless
 * puro sem introduzir franja visível nas arestas — é o que se pede de uma peça
 * vetorial acima da dobra. */
await origem
  .resize({ width: LARGURA, withoutEnlargement: true })
  .webp({ nearLossless: true, quality: 80, effort: 6 })
  .toFile(SAIDA);

const [antes, depois] = await Promise.all([stat(ENTRADA), stat(SAIDA)]);
const saida = await sharp(SAIDA).metadata();
console.log(
  JSON.stringify(
    {
      entrada: { arquivo: ENTRADA, w: meta.width, h: meta.height, alfa: meta.hasAlpha, kB: Math.round(antes.size / 1024) },
      saida: { arquivo: SAIDA, w: saida.width, h: saida.height, alfa: saida.hasAlpha, kB: Math.round(depois.size / 1024) },
      reducao: `${Math.round((1 - depois.size / antes.size) * 100)}%`,
      razaoDeAspecto: `${saida.width} / ${saida.height}`,
    },
    null,
    1,
  ),
);
