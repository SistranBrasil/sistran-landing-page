/**
 * SIS-225 — deriva a arte do carimbo de `#parceiros` em TINTA DE FUNDO CLARO.
 *
 * `node scripts/gerar-carimbo-parcerias-claro-sis225.mjs`
 *
 *   entrada: public/carimbo/carimbo-parcerias.png              (1524x476, 189 kB, RGBA)
 *   saída:   public/images/parceiros/carimbo-parcerias-0757c7.webp
 *
 * ── POR QUE UMA SEGUNDA DERIVADA, E NÃO O ARQUIVO QUE A ISSUE NOMEIA ──
 *
 * A issue manda mover o carimbo da capa para dentro de `#parceiros` e nomeia
 * `carimbo-parcerias.webp`. Esse arquivo é CIANO — medido no próprio PNG de
 * origem, 324 variantes de uma tinta só em volta de #0ed8f6, com o antialiasing
 * inteiro carregado no canal alfa (86.759 dos 126.286 pixels visíveis são
 * exatamente `14,216,246`).
 *
 * Ciano é a tinta certa onde ele estava: a capa é `hero-backdrop--parceiros`,
 * escura, e é isso que a folha `carimbo-batida.css` diz por escrito («o contraste
 * já está resolvido pelo fundo — a abertura desta rota é a capa escura e a tinta é
 * ciano»). `#parceiros` é o contrário: `section-light section-light-blue`, papel
 * ~#e3f1fb. A MESMA arte ali dá 1,2:1 — o rótulo da seção seria invisível, e ele
 * agora é o ÚNICO rótulo visual dela (a tag textual e o `h2` saem por pedido).
 * Mover a peça sem trocar a tinta não é cumprir a issue, é apagar o cabeçalho.
 *
 * #0757C7 NÃO É COR NOVA: é exatamente a tinta que a casa já usa em carimbo sobre
 * `section-light-blue`, em quatro peças (`carimbo-disruptiva-ticket-outline-0757c7`,
 * `carimbo-consultoria-…`, `carimbo-sobre-nos-…`, `carimbo-tecnologias-…`) — e a
 * SIS-188 já mediu esse par tinta/papel em `scripts/medir-carimbo-labs-sis188.mjs`.
 * Contra #e3f1fb dá 5,69:1, acima do 4,5 de texto e bem acima do 3:1 que a 1.4.11
 * pede para elemento gráfico. O #0079CB da marca fecharia 4,00:1 — passa no piso
 * gráfico, mas fica abaixo do de texto, e esta peça É texto desenhado.
 *
 * ── A RECOLORAÇÃO É EXATA, E ISSO FOI MEDIDO ANTES ──
 *
 * Trocar RGB e PRESERVAR alfa só é lossless se a arte for de tinta única com o
 * antialiasing no alfa — se a franja estivesse no RGB, chapar a cor engrossaria as
 * arestas. O perfil acima mostra que é o primeiro caso, então cada pixel visível
 * recebe o mesmo #0757C7 e mantém o seu alfa. A guarda abaixo refaz a conta em
 * tempo de execução: se um dia a arte voltar com mais de uma tinta, o script para
 * em vez de achatar o desenho em silêncio.
 *
 * O CIANO FICA: `carimbo-parcerias.webp` continua no repositório. Ele não tem mais
 * consumidor nesta rota, mas é a peça da capa escura e é o que a issue nomeia —
 * apagá-lo faria a próxima pessoa reconstruir a mesma coisa. O PNG também fica,
 * como fonte das duas derivadas.
 *
 * Largura 640 e `nearLossless`: os mesmos números e o mesmo porquê do script da
 * SIS-277 (`scripts/gerar-carimbo-parcerias-sis277.mjs`) — vetor rasterizado, em
 * que o modo com perda sai MAIS pesado porque o custo está no alfa de linha fina.
 */
import sharp from 'sharp';
import { mkdir, stat } from 'node:fs/promises';

const ENTRADA = 'public/carimbo/carimbo-parcerias.png';
const SAIDA = 'public/images/parceiros/carimbo-parcerias-0757c7.webp';
const LARGURA = 640;
/** A tinta de carimbo da casa para `section-light-blue`. Ver o cabeçalho. */
const TINTA = [0x07, 0x57, 0xc7];
/** Quanto um pixel pode fugir da tinta de origem e ainda ser "a mesma tinta". */
const TOLERANCIA = 24;
/**
 * Alfa mínimo para o pixel ENTRAR na guarda de tinta única.
 *
 * Medido, não escolhido: na primeira passada 1.642 pixels (1,30% dos visíveis)
 * fugiam da tinta dominante — `0,255,255`, `0,191,255`, `0,212,212` … — e TODOS
 * eles com alfa arredondado a zero. É a franja de premultiplicação do PNG: RGB
 * lixo em pixels que não pintam nada. Contá-los reprovaria a arte por uma cor que
 * ninguém vê, e recolori-los não muda pixel nenhum na tela, porque o alfa deles
 * continua ~0. 16/255 é ~6% de opacidade: abaixo disso a tinta não existe.
 */
const ALFA_MINIMO = 16;

await mkdir('public/images/parceiros', { recursive: true });

const origem = sharp(ENTRADA).ensureAlpha();
const meta = await origem.metadata();
if (!meta.hasAlpha) {
  throw new Error('a arte de entrada não tem canal alfa — ver o cabeçalho da SIS-277 antes de seguir');
}

const { data, info } = await origem.raw().toBuffer({ resolveWithObject: true });
/* A tinta de ORIGEM é apurada aqui, e não escrita à mão: é a cor mais frequente
   entre os pixels totalmente opacos. Assim a guarda de tinta única mede a arte
   que está no disco, não a que eu me lembro de ter visto. */
const contagem = new Map();
for (let i = 0; i < info.width * info.height; i++) {
  const k = i * info.channels;
  if (data[k + 3] !== 255) continue;
  const chave = `${data[k]},${data[k + 1]},${data[k + 2]}`;
  contagem.set(chave, (contagem.get(chave) ?? 0) + 1);
}
const [dominanteChave] = [...contagem].sort((a, b) => b[1] - a[1])[0];
const dominante = dominanteChave.split(',').map(Number);

let visiveis = 0;
let pesados = 0;
let foraDaTolerancia = 0;
for (let i = 0; i < info.width * info.height; i++) {
  const k = i * info.channels;
  if (data[k + 3] === 0) continue;
  visiveis += 1;
  if (data[k + 3] >= ALFA_MINIMO) {
    pesados += 1;
    if (dominante.some((v, c) => Math.abs(data[k + c] - v) > TOLERANCIA)) foraDaTolerancia += 1;
  }
  /* O alfa NÃO é tocado — ele é o desenho. Só o RGB muda. */
  data[k] = TINTA[0];
  data[k + 1] = TINTA[1];
  data[k + 2] = TINTA[2];
}
const fracaoFora = foraDaTolerancia / pesados;
if (fracaoFora > 0.01) {
  throw new Error(
    `a arte não é de tinta única: ${(fracaoFora * 100).toFixed(2)}% dos pixels com alfa >= ${ALFA_MINIMO} fogem de ` +
      `${dominanteChave} por mais de ${TOLERANCIA}/255. Chapar a cor engrossaria as arestas — ` +
      'reveja a recoloração antes de seguir.',
  );
}

await sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels } })
  .resize({ width: LARGURA, withoutEnlargement: true })
  .webp({ nearLossless: true, quality: 80, effort: 6 })
  .toFile(SAIDA);

const [antes, depois] = await Promise.all([stat(ENTRADA), stat(SAIDA)]);
const saida = await sharp(SAIDA).metadata();
console.log(
  JSON.stringify(
    {
      entrada: { arquivo: ENTRADA, w: info.width, h: info.height, kB: Math.round(antes.size / 1024) },
      tintaDeOrigem: dominanteChave,
      tintaDeSaida: TINTA.map((v) => v.toString(16).padStart(2, '0')).join(''),
      pixelsVisiveis: visiveis,
      pixelsComAlfaRelevante: pesados,
      foraDaTolerancia,
      saida: {
        arquivo: SAIDA,
        w: saida.width,
        h: saida.height,
        alfa: saida.hasAlpha,
        kB: Math.round(depois.size / 1024),
      },
      razaoDeAspecto: `${saida.width} / ${saida.height}`,
    },
    null,
    1,
  ),
);
