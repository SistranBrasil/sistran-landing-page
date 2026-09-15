/**
 * SIS-235 — gera a arte do carimbo «Realizado pela Sistran» a partir do PNG
 * entregue, e a razão de existir um script para isto é que O PNG NÃO TEM
 * TRANSPARÊNCIA.
 *
 * A issue descreve `public/images/carimbo.png` como "transparente, oval,
 * distressed". Ele é oval e distressed; transparente ele NÃO é. Medido:
 *
 *     1374x1145 · png · 3 canais · hasAlpha=false
 *
 * O xadrez cinza que se vê ao abrir o arquivo não é o quadriculado que o
 * visualizador desenha atrás de um alfa — é o quadriculado do Photoshop
 * ACHATADO DENTRO DA IMAGEM, em pixels de verdade: dois cinzas neutros
 * alternados, ~204 no quadrado claro e ~132 no escuro. `sharp().trim()` não
 * recorta nada justamente por isso (offset 0,0 nos quatro lados: para ele a
 * imagem é tinta de borda a borda).
 *
 * Consequência prática, e é ela que faz a diferença entre a issue cumprida e a
 * issue estragada: servir este arquivo como `<img>` sobre a foto do evento não
 * põe um carimbo no cartão, põe um RETÂNGULO XADREZ. Nenhuma quantidade de
 * `mix-blend-mode` conserta isso — `multiply` escureceria a foto inteira no
 * retângulo e comeria o branco do S da marca.
 *
 * ── O CAMINHO QUE FOI TENTADO E REPROVADO: INUNDAÇÃO DESDE A BORDA ──
 *
 * Fica escrito porque é a ideia óbvia e porque ela FALHA de um jeito que passa
 * por sucesso no console. A primeira versão marcava os pixels neutros e inundava
 * (BFS de 4 vizinhos) a partir dos neutros da BORDA da imagem, apostando que o
 * miolo do oval também seria alcançado "pelas falhas do anel distressed".
 *
 * O anel externo do oval é PRATICAMENTE CONTÍNUO. A inundação limpou o lado de
 * fora e parou no anel: todo o xadrez de DENTRO do oval — que é a maior parte da
 * área do desenho — ficou opaco. Compositado sobre fundo escuro, o resultado era
 * o carimbo com um miolo quadriculado e vazamentos escuros. Os números que
 * denunciaram, antes de eu olhar a imagem: `recortado: 1374x784` (o `trim` não
 * cortou NADA na horizontal, porque a moldura não era uniforme) e rampa de alfa
 * em 69,7% (contra 27,8% de transparente) — alfa parcial na maioria dos pixels
 * não é orla de antialiasing, é mistura errada.
 *
 * ── O CAMINHO QUE VALE: CHAVE DE CROMA, SEM CONECTIVIDADE ──
 *
 * A inundação era complexidade desnecessária. O arquivo é de DUAS FAMÍLIAS de cor
 * e elas se separam pixel a pixel, sem precisar saber quem é vizinho de quem:
 *
 *   • fundo — cinza NEUTRO: croma (max−min) de 0 a ~6, luminância 132 ou 204;
 *   • tinta — azul FORTEMENTE SATURADO: [0,79,186], [1,81,193], croma ~190;
 *     mais os acentos ciano, também saturados;
 *   • o S da marca — BRANCO [250,251,252]: neutro, mas com luminância 250.
 *
 * Então o alfa sai do croma, e o S é resgatado pelo BRILHO, não pela vizinhança:
 * o xadrez claro não passa de ~208, o S está em 250, e os 235 do limiar caem no
 * meio dessa folga de 42. Nenhum pixel do xadrez alcança 235; nenhum pixel do S
 * fica abaixo dele.
 *
 * O miolo do oval fica transparente de graça, porque a regra não pergunta se ele
 * está cercado — pergunta só se ele é cinza. Que é o que o alfa de verdade faria.
 *
 * ── A ORLA ──
 *
 * O alfa é RAMPA e não degrau, e isto não é enfeite: a borda entre tinta e xadrez
 * é uma mistura das duas (o arquivo já passou por compressão com perda — 131.206
 * cores distintas num desenho de duas cores), e um alfa binário deixaria escada
 * visível na letra. A rampa mapeia croma 8..38 para alfa 0..255, então o pixel
 * meio-azul sai meio-opaco, que é exatamente o que ele é.
 *
 * Sob o alfa 0 o RGB é reescrito para o AZUL DA TINTA (`TINTA_RGB`, medido no
 * disco, não escolhido). Dois motivos, os dois medidos: `trim` compara PIXEL e não
 * alfa — com cinzas alternados de 204 e 132 na área invisível ele lê "cores
 * diferentes" e não recorta (foi o `recortado: 1374x1145` da primeira execução); e
 * o redimensionamento faz média entre vizinhos, então cinza invisível ainda
 * empurra a cor do pixel visível e devolveria orla acinzentada. Preto resolveria o
 * `trim` e criaria halo escuro; azul faz a média acontecer entre azul e azul.
 *
 * ── PESO ──
 *
 * O PNG são 2,4 MB, e a issue pede WebP com alfa em tamanho de uso. O recorte pelo
 * alfa (agora `trim` tem o que ler) tira a moldura vazia ANTES do
 * redimensionamento, então os 520px vão todos para o desenho.
 *
 * O PNG de origem FICA no repositório. Ele é a fonte da conversão e apagá-lo
 * deixaria este script sem entrada; quem não deve entrar no caminho crítico é o
 * PNG, e isso se resolve no componente (que aponta para o WebP), não apagando o
 * original.
 *
 * ── POR QUE O ALFA É LIDO DE VOLTA NO FIM ──
 *
 * Porque a primeira execução gravou um arquivo errado e ANUNCIOU sucesso: "96,2%
 * menor", tamanho de uso correto, e `alfa=false`. Causa: `.removeAlpha()
 * .joinChannel(alfa)` sobre entrada `raw` devolve 3 canais e `hasAlpha=false` — o
 * sharp aceita o canal pela API e o descarta na gravação (traço com alfa de teste
 * uniforme 128: `pos joinChannel+png: {c:3,a:false}`, então não era "alfa opaco
 * otimizado fora"). Por isso o RGBA é montado à mão, intercalado, e por isso o
 * portão no fim RELÊ o arquivo em disco em vez de confiar na cadeia.
 *
 * Rodar: node scripts/gerar-carimbo-webp.mjs
 */
import fs from "node:fs";
import sharp from "sharp";

const ENTRADA = "public/images/carimbo.png";
const SAIDA = "public/images/carimbo-realizado-sistran.webp";

/* 520px de largura no destino. A arte aparece com ~150px no cartão do palco e
   ~120px no carrossel estreito (as duas medidas estão no CSS do componente); 520
   dá margem para tela 2x sem carregar os 1374px, que só servem à conversão. */
const LARGURA_DESTINO = 520;

/* Rampa do croma. Abaixo de 8 é o cinza do xadrez (croma medido 0..6; a folga de 2
   absorve a perda da compressão). Acima de 38 é tinta cheia. Entre os dois está a
   orla de antialiasing, e é ela que a rampa existe para resolver. */
const CROMA_MIN = 8;
const CROMA_MAX = 38;

/* Resgate do S branco pelo brilho. O xadrez claro não passa de ~208 e o S está em
   250: 235 cai no meio da folga. É o limiar que substitui a inundação. */
const BRILHO_BRANCO = 235;

/* Medido no disco azul do carimbo. Ver "A ORLA", acima. */
const TINTA_RGB = [0, 76, 180];

const { data, info } = await sharp(ENTRADA).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: w, height: h, channels: ch } = info;
const total = w * h;

const rgba = Buffer.alloc(total * 4);
let transparentes = 0;
let opacos = 0;
let branco = 0;

for (let i = 0; i < total; i++) {
  const o = i * ch;
  const d = i * 4;
  const r = data[o];
  const g = data[o + 1];
  const b = data[o + 2];
  const max = Math.max(r, g, b);
  const croma = max - Math.min(r, g, b);

  let a;
  if (max >= BRILHO_BRANCO) {
    a = 255; /* S da marca */
    branco++;
  } else if (croma <= CROMA_MIN) {
    a = 0;
  } else if (croma >= CROMA_MAX) {
    a = 255;
  } else {
    a = Math.round((255 * (croma - CROMA_MIN)) / (CROMA_MAX - CROMA_MIN));
  }

  if (a === 0) {
    transparentes++;
    rgba[d] = TINTA_RGB[0];
    rgba[d + 1] = TINTA_RGB[1];
    rgba[d + 2] = TINTA_RGB[2];
  } else {
    if (a === 255) opacos++;
    rgba[d] = r;
    rgba[d + 1] = g;
    rgba[d + 2] = b;
  }
  rgba[d + 3] = a;
}

console.log(`origem: ${w}x${h} · ${ch} canais`);
console.log(
  `chave de croma: transparente=${((100 * transparentes) / total).toFixed(1)}%` +
    ` opaco=${((100 * opacos) / total).toFixed(1)}%` +
    ` rampa=${((100 * (total - transparentes - opacos)) / total).toFixed(1)}%` +
    ` · S branco resgatado pelo brilho=${branco}px`,
);

/* Guarda de sanidade. Um carimbo de contorno é MAJORITARIAMENTE vazio: o oval é
   traço fino e letras, o miolo é buraco. Se a chave errasse o xadrez, o
   transparente cairia; se comesse a tinta, subiria para perto de 100%. A faixa é
   larga de propósito — ela pega catástrofe, não calibragem. */
const pctTransp = (100 * transparentes) / total;
if (pctTransp < 40 || pctTransp > 95) {
  throw new Error(`transparente em ${pctTransp.toFixed(1)}% — fora da faixa 40..95%. A chave de croma errou; conferir antes de gravar.`);
}
if (branco < 2000) {
  throw new Error(`só ${branco}px acima do brilho ${BRILHO_BRANCO} — o S da marca não foi encontrado.`);
}

/* `trim` agora tem o que ler — a moldura é azul uniforme com alfa 0.
   `threshold: 8` e não 0 porque a rampa deixa alfa 1..7 na orla mais fina. */
const recortado = await sharp(rgba, { raw: { width: w, height: h, channels: 4 } })
  .png()
  .trim({ threshold: 8 })
  .toBuffer({ resolveWithObject: true });
console.log(`recortado pelo alfa: ${recortado.info.width}x${recortado.info.height}`);

await sharp(recortado.data)
  .resize({ width: LARGURA_DESTINO, withoutEnlargement: true })
  /* `alphaQuality: 100`: a orla do carimbo distressed É o desenho. Perder o alfa na
     compressão devolveria a escada que a rampa acabou de tirar. */
  .webp({ quality: 82, alphaQuality: 100, effort: 6 })
  .toFile(SAIDA);

const antes = fs.statSync(ENTRADA).size;
const depois = fs.statSync(SAIDA).size;
const meta = await sharp(SAIDA).metadata();
console.log(
  `\n${SAIDA} · ${meta.width}x${meta.height} · alfa=${meta.hasAlpha} · canais=${meta.channels}\n` +
    `${(antes / 1024 / 1024).toFixed(2)} MB -> ${(depois / 1024).toFixed(1)} KB` +
    ` (${(100 - (100 * depois) / antes).toFixed(1)}% menor)`,
);

/* ── PORTÃO: O ARQUIVO GRAVADO SE VERIFICA ── (motivo em "POR QUE O ALFA É LIDO
   DE VOLTA NO FIM", acima). Os quatro cantos são a prova mais direta de que o
   carimbo recorta: se qualquer um estiver opaco, o que vai sobre a foto é
   retângulo, não carimbo. */
const saida = await sharp(SAIDA).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const sw = saida.info.width;
const sh = saida.info.height;
const sch = saida.info.channels;
const px = sw * sh;
const alfaEm = (x, y) => saida.data[(y * sw + x) * sch + 3];

const cantos = [
  ["sup-esq", alfaEm(0, 0)],
  ["sup-dir", alfaEm(sw - 1, 0)],
  ["inf-esq", alfaEm(0, sh - 1)],
  ["inf-dir", alfaEm(sw - 1, sh - 1)],
];

let sTransp = 0;
let sOpaco = 0;
for (let i = 3; i < saida.data.length; i += sch) {
  if (saida.data[i] < 8) sTransp++;
  else if (saida.data[i] > 247) sOpaco++;
}
console.log(
  `alfa lido do arquivo: transparente=${((100 * sTransp) / px).toFixed(1)}%` +
    ` opaco=${((100 * sOpaco) / px).toFixed(1)}%` +
    ` rampa=${((100 * (px - sTransp - sOpaco)) / px).toFixed(1)}%`,
);
console.log(`cantos: ${cantos.map(([n, a]) => `${n}=${a}`).join(" ")}`);

if (!meta.hasAlpha) throw new Error("o WebP gravado NÃO tem canal alfa — não usar.");
const cantoOpaco = cantos.find(([, a]) => a > 8);
if (cantoOpaco) {
  throw new Error(`canto ${cantoOpaco[0]} com alfa ${cantoOpaco[1]} — a moldura ficou opaca, seria um retângulo sobre a foto.`);
}
if (sTransp / px < 0.35) {
  throw new Error(`só ${((100 * sTransp) / px).toFixed(1)}% transparente no arquivo final — o vazio do carimbo não sobreviveu.`);
}
