/**
 * `/sistran-university` — deriva os três ícones dos cartões de `#university-numeros`.
 *
 * `node scripts/gerar-icones-numeros-university.mjs`
 *
 *   entrada: public/images/university/icones/{calendario,especialista,projeto}.png
 *   saída:   public/images/university/icones/{…}-128.webp
 *
 * ── POR QUE EXISTE ESTE SCRIPT ──
 *
 * A arte entregue foi medida antes de decidir qualquer coisa:
 *
 *     calendario.png    1254x1254 · RGBA · alfa real (canto 0,0,0,0) · 288 kB
 *     especialista.png  1254x1254 · RGBA · alfa real                 · 487 kB
 *     projeto.png       1254x1254 · RGBA · alfa real                 · 547 kB
 *
 * O alfa é REAL — nada a reconstruir, ao contrário do caso da SIS-235. O motivo da
 * derivada é PESO E TAMANHO DE USO, e aqui ele é grosseiro: os ícones aparecem com
 * 26 a 44 px em CSS, e servir 1254 px é mandar ~30x mais pixel em cada eixo do que
 * qualquer tela usa. Somados, os três PNG pesam 1,3 MB numa seção que tem três
 * ícones decorativos — mais que a página inteira. Com `images: { unoptimized: true }`
 * (SIS-154) o `next/image` NÃO recomprime nada, então quem não derivar aqui manda o
 * arquivo cru para o visitante.
 *
 * ── 1. `trim()`: a normalização que o olho pede ──
 *
 * As três artes têm margem transparente DIFERENTE dentro da mesma tela de 1254:
 *
 *     calendario   tinta 749x756  (razão 0,99)
 *     especialista tinta 1062x654 (razão 1,62)
 *     projeto      tinta 814x828  (razão 0,98)
 *
 * Exibidas como estão, os três num quadro de mesmo tamanho apareceriam em escalas
 * visíveis diferentes — o calendário 12% menor que o de projetos sem nenhuma razão
 * de desenho. `trim()` corta a margem transparente (funciona porque o canto é
 * `alpha: 0`) e a tela quadrada é recriada no `resize({ fit: 'contain' })`: assim a
 * TINTA fica centrada e com a mesma folga nos três, e o CSS trata os três com uma
 * caixa só. A razão 1,62 do de especialistas sobrevive — é o desenho dele, e na
 * referência ele também é o mais largo.
 *
 * ── 2. 128 px de lado, e por quê ──
 *
 * O maior uso é o ícone nu do cartão de destaque, `2.75rem` = 44 px. 128 px cobre
 * DPR 2 com folga e DPR 3 exato (132 px — 3% de diferença, abaixo do que o
 * reamostrador do navegador denuncia numa peça de gradiente liso). Acima disso não
 * há ganho e cada byte é decoração.
 *
 * ── 3. WebP COM PERDA, ao contrário da SIS-277 ──
 *
 * Aquele script escolheu `nearLossless` e escreveu a razão: arte VETORIAL, linha
 * fina chapada, onde a quantização DCT gasta bits justamente nas arestas. Estes
 * ícones são o oposto — gradiente liso de azul, sem tracejado nem fio de 1px —, e
 * a medição inverte o resultado (160 px de lado, `effort: 6`):
 *
 *                        calendario  especialista  projeto
 *     quality 82 .......... 7,4 kB       5,7 kB     7,7 kB
 *     quality 90 .......... 8,4 kB       6,7 kB     9,4 kB   ← escolhido
 *     nearLossless 80 .... 10,2 kB      10,4 kB    19,5 kB
 *     lossless ........... 12,6 kB      12,9 kB    22,4 kB
 *
 * `quality: 90` e não os 82 mais baratos: a diferença é ~1,5 kB por arquivo e o que
 * ela compra é margem contra BANDEAMENTO — os três desenhos são um degradê contínuo
 * numa área pequena, que é exatamente onde a quantização deixa degrau visível. Com
 * `alphaQuality: 100` porque a silhueta é o desenho: alfa com perda numa borda
 * arredondada de 128 px vira serrilha.
 *
 * Os PNG FICAM onde estão, como fonte para regerar — mesma política da SIS-277 e de
 * `scripts/otimizar-capa-parceiros-sis225.mjs`.
 */
import sharp from 'sharp';
import { stat } from 'node:fs/promises';

const PASTA = 'public/images/university/icones';
const ARTES = ['calendario', 'especialista', 'projeto'];
const LADO = 128;

const relatorio = [];

for (const nome of ARTES) {
  const entrada = `${PASTA}/${nome}.png`;
  const saida = `${PASTA}/${nome}-${LADO}.webp`;

  const meta = await sharp(entrada).metadata();
  if (!meta.hasAlpha) {
    /* A guarda existe pelo modo de falha da SIS-235: arte reentregue sem alfa
       desenharia um retângulo branco sólido dentro do quadrado azul do cartão.
       Melhor falhar aqui do que descobrir na captura. */
    throw new Error(`${entrada} não tem canal alfa — ver o cabeçalho da SIS-235 antes de seguir`);
  }

  /* `trim()` numa passada própria e não encadeado com o `resize`: encadeados, o
     sharp aplica o `resize` sobre a tela ORIGINAL de 1254 e a normalização de
     folga (o ponto 1 do cabeçalho) não acontece. */
  const cortado = await sharp(entrada).trim().toBuffer({ resolveWithObject: true });

  await sharp(cortado.data)
    .resize({
      width: LADO,
      height: LADO,
      fit: 'contain',
      /* Fundo TRANSPARENTE na tela quadrada: o padrão do sharp é preto opaco, o
         que devolveria um quadrado preto atrás de cada ícone. */
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .webp({ quality: 90, alphaQuality: 100, effort: 6 })
    .toFile(saida);

  const [antes, depois] = await Promise.all([stat(entrada), stat(saida)]);
  relatorio.push({
    arte: nome,
    entrada: { w: meta.width, h: meta.height, kB: Math.round(antes.size / 1024) },
    tinta: `${cortado.info.width}x${cortado.info.height}`,
    razaoDaTinta: Math.round((cortado.info.width / cortado.info.height) * 100) / 100,
    saida: { arquivo: saida, lado: LADO, kB: Math.round((depois.size / 1024) * 10) / 10 },
    reducao: `${Math.round((1 - depois.size / antes.size) * 100)}%`,
  });
}

console.log(JSON.stringify(relatorio, null, 1));
