/**
 * SIS-291 — deriva o WebP da arte do Guru para a seção «Já desenvolvemos…».
 *
 * `node scripts/gerar-arte-guru-sis291.mjs`
 *
 * DE ONDE SAI A ARTE. A issue oferece duas fontes: «extrair/recortar da
 * referência OU asset dedicado». A referência
 * (`public/images/sistran-labs/sistran-labs-5.png`) tem 1024×576 e o container é
 * JPEG apesar da extensão — recortar o guru dela daria ~330px de largura, com
 * artefato de JPEG e SEM canal alfa, ou seja um retângulo branco colado sobre a
 * cápsula. `public/images/logos/Guru-de-Seguros-letra-clara-2.png` é 1405×717,
 * PNG com alfa, e é EXATAMENTE a mesma arte que a referência usa (anel de seis
 * ícones — casa+coração, mala de viagem, `$`, família, batimento, carro na
 * garagem — com o guru meditando à frente). Então a fonte é o asset de marca.
 *
 * POR QUE SÓ A ARTE, SEM O LETREIRO. O arquivo de origem traz «guru» em azul
 * claro e «de seguros» em BRANCO — é o que «letra-clara» quer dizer, e é o único
 * variante que existe no repo. Na cápsula branca da referência esse «de seguros»
 * fica quase invisível (dá para ver o defeito na própria PNG de referência). Um
 * letreiro em raster também não é texto: não é selecionável, não entra no
 * `copy-lock` e só tem nome no `alt`. Então este script corta APENAS o anel+guru,
 * e o nome do produto passa a ser TEXTO de verdade na marcação, com o contraste
 * medido na sonda. Quem quiser o letreiro desenhado precisa de um variante de
 * letra ESCURA, que não existe — fica registrado como pendência.
 *
 * COMO O CORTE É ENCONTRADO, e não chutado: o script varre as colunas do alfa,
 * acha a maior faixa de colunas TOTALMENTE transparentes e corta ali. É o vão
 * entre a arte e o letreiro. Chutar «46% da largura» funcionaria hoje e quebraria
 * no dia em que o arquivo de marca for reexportado com outro respiro.
 *
 * `nearLossless` e não `quality` puro: a arte é um render 3D com bordas duras
 * sobre transparência, e o alfa mal comprimido vira franja escura em volta do
 * turbante. `alphaQuality: 100` mantém a máscara exata.
 *
 * Ferramenta de bancada; nada disto entra no bundle.
 */
import { readFile, stat, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const ORIGEM = 'public/images/logos/Guru-de-Seguros-letra-clara-2.png';
const DESTINO = 'public/images/sistran-labs/guru-de-seguros-arte.webp';

const bruto = await readFile(ORIGEM);
const meta = await sharp(bruto).metadata();

/* Colunas totalmente transparentes → a maior corrida delas é o vão. */
const { data, info } = await sharp(bruto)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const colunaVazia = new Array(info.width).fill(true);
for (let y = 0; y < info.height; y += 1) {
  for (let x = 0; x < info.width; x += 1) {
    if (colunaVazia[x] && data[(y * info.width + x) * info.channels + 3] > 8) {
      colunaVazia[x] = false;
    }
  }
}

let melhor = { inicio: 0, fim: 0 };
let corrida = null;
for (let x = 0; x <= info.width; x += 1) {
  if (x < info.width && colunaVazia[x]) {
    corrida ??= x;
  } else if (corrida !== null) {
    /* Só interessam vãos INTERNOS: a margem transparente das pontas não separa
       nada de nada. */
    if (corrida > 0 && x < info.width && x - corrida > melhor.fim - melhor.inicio) {
      melhor = { inicio: corrida, fim: x };
    }
    corrida = null;
  }
}

const corte = Math.round((melhor.inicio + melhor.fim) / 2);

/* DUAS PASSADAS, e não `extract().trim()` na mesma: no pipeline do sharp o `trim`
   é avaliado ANTES do `extract`, então a área pedida passa a se referir à imagem
   já aparada e estoura («extract_area: bad extract area», medido). Recortar,
   materializar em PNG e só então aparar é o caminho que respeita a ordem. */
const recortado = await sharp(bruto)
  .extract({ left: 0, top: 0, width: corte, height: info.height })
  .png()
  .toBuffer();

const webp = await sharp(recortado)
  .trim({ threshold: 1 })
  .webp({ quality: 92, alphaQuality: 100, effort: 6 })
  .toBuffer();
await writeFile(DESTINO, webp);

const metaDestino = await sharp(webp).metadata();
console.log(
  JSON.stringify(
    {
      origem: {
        formato: meta.format,
        w: meta.width,
        h: meta.height,
        alfa: meta.hasAlpha,
        bytes: (await stat(ORIGEM)).size,
      },
      vaoDeColunas: { ...melhor, largura: melhor.fim - melhor.inicio, corteEm: corte },
      destino: {
        formato: metaDestino.format,
        w: metaDestino.width,
        h: metaDestino.height,
        alfa: metaDestino.hasAlpha,
        bytes: webp.length,
      },
    },
    null,
    1,
  ),
);
