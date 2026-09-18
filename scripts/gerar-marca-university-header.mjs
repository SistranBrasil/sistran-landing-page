/* Deriva `public/images/university/logo-university-header.webp` a partir da arte
   nova `public/images/university/logo-university.png`.

   Duas coisas se resolvem aqui de uma vez:

   • A TROCA da arte, pedida no chat (o SIS-287 tinha posto «trocar o arquivo da
     arte» fora de escopo; a decisão de fazer é dela).
   • O ARQUIVO DERIVADO NÃO EXISTIA MAIS. `git status` mostrava
     `logo-university-header.webp` como apagado na árvore de trabalho, embora o
     `Header.tsx` continue apontando para ele — a sonda lê o atributo `src`, que
     diz o caminho e não diz que o arquivo está lá. Sem esta derivação a marca da
     University seria um 404 em produção.

   POR QUE NÃO A RECEITA DA LABS. `gerar-marca-labs-header-sis287.mjs` reconstrói
   o alfa a partir da luminância, e guarda essa escolha com um `throw` se a arte
   tiver cor (`saturacaoMaxima > 12`): a conta só é exata em arte monocromática
   sobre fundo chapado. Esta arte medida dá `satMax 255` (azul/violeta de
   verdade) e `hasAlpha: true` com os quatro cantos em `[0,0,0,0]` — o alfa já é
   o certo, e reescrevê-lo pela luminância apagaria a cor. Então a derivação aqui
   é só recortar na tinta e reduzir.

   A CAIXA DA TINTA, medida no próprio arquivo (alfa > 12): x 42, y 96, 1942×641
   no original de 2033×773 — razão 3,03, praticamente a mesma 3,05 da arte antiga,
   e é por isso que a altura escrita no `Header.tsx` (`h-[34px] md:h-[42px]`) não
   precisa mudar. A varredura de limiar 12/40/100/200 devolve a mesma caixa
   (~1941×641), ou seja não há franja larga de halo puxando a medida.

   O recorte é o que faz `MarcaRecortada` medir tinta e não margem vazia; a
   `caixa` que vai para o `TINTA.university` passa a ser o arquivo INTEIRO,
   porque o recorte já foi aplicado aqui. */
import sharp from 'sharp';

const ORIGEM = 'public/images/university/logo-university.png';
const DESTINO = 'public/images/university/logo-university-header.webp';
const ALTURA_DA_TINTA = 96; /* mesma escala da marca da Labs; a maior altura pedida é 42px */
const LIMIAR = 12;

const img = sharp(ORIGEM);
const meta = await img.metadata();
if (!meta.hasAlpha) throw new Error('arte sem alfa: o recorte por alfa não vale aqui');

const { data, info } = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
let x0 = info.width,
  y0 = info.height,
  x1 = -1,
  y1 = -1;
for (let y = 0; y < info.height; y += 1) {
  for (let x = 0; x < info.width; x += 1) {
    if (data[(y * info.width + x) * info.channels + 3] > LIMIAR) {
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
    }
  }
}
const caixa = { left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 };

const saida = await sharp(ORIGEM)
  .extract(caixa)
  .resize({ height: ALTURA_DA_TINTA, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .webp({ lossless: true, effort: 6 })
  .toFile(DESTINO);

console.log(
  JSON.stringify(
    {
      origem: { w: info.width, h: info.height, hasAlpha: meta.hasAlpha },
      caixaDaTinta: caixa,
      razao: Math.round((caixa.width / caixa.height) * 100) / 100,
      derivada: { w: saida.width, h: saida.height, bytes: saida.size },
    },
    null,
    2,
  ),
);
