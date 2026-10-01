/**
 * SIS-235 — gera as QUATRO artes de carimbo de `kind` dos eventos.
 *
 * `node scripts/gerar-carimbos-kind-sis235.mjs`
 *
 *   saída: public/images/EVENTOS/carimbos/carimbo-evento-{proprio,global,nacional,parceiro}.webp
 *
 * ── POR QUE ESTE SCRIPT EXISTE (leia antes de julgar a arte) ──
 *
 * A issue previa artes entregues por design numa pasta —
 * `public/images/EVENTOS/carimbos/` — e travava o despacho até elas chegarem. A
 * pasta foi conferida duas vezes e estava VAZIA nas duas, e a tabela de
 * mapeamento da issue seguia com «(aguardando)» nas quatro linhas. Com o pedido
 * reafirmado, a arte passou a ser DERIVADA aqui em vez de esperada.
 *
 * ⚠️ ISTO NÃO É ARTE APROVADA POR DESIGN. É um substituto coerente com a
 * família, gerado para destravar. Quando as artes reais chegarem, elas mandam:
 * basta sobrescrever os quatro arquivos com os mesmos nomes e proporção
 * (520x399) e nada no TSX/CSS precisa mudar. É por isso que o nome do arquivo
 * sai de `kind` por regra e não de um mapa escrito à mão.
 *
 * ── A FAMÍLIA NÃO FOI INVENTADA, FOI MEDIDA ──
 *
 * O único carimbo de evento que existia é `public/images/carimbo-realizado-sistran.webp`
 * (520x399, alfa real, gerado pela SIS-235 a partir do `carimbo.png` entregue).
 * Amostrando os pixels OPACOS dele:
 *
 *     tinta do corpo ..... #0051bc / #014fbb / #004eb7  (moda, ~4,3 mil px no topo)
 *     acento ciano ....... #03cdfd / #01cbfb / #00cdff  (poucas centenas de px)
 *     alfa ............... 74.691 opaco · 119.639 transparente · 13.150 no meio
 *
 * Duas conclusões viraram regra deste script:
 *
 * 1. A TINTA É UMA SÓ para os quatro. `#004fb4` — o mesmo número que
 *    `carimbo-realizado-sistran.css` já documenta como a tinta que «assenta
 *    sobre branco» na placa `rgba(255,255,255,0.96)` do cartão. Tentar pintar o
 *    corpo com o `tone` de cada kind daria carimbo lilás (`global` é `#A78BFA`)
 *    sobre branco: contraste de texto pequeno insuficiente, e a tag é a primeira
 *    coisa lida no cartão.
 *
 * 2. O ACENTO É O `tone` DO KIND. O ciano medido na arte entregue (`#00cdfd`) é,
 *    dentro do arredondamento de compressão, `EVENT_KIND_META.proprio.tone`
 *    (`#0ed8f6`). Ou seja: a arte aprovada JÁ seguia a regra "corpo azul, acento
 *    igual ao tone do kind" — este script só estende ao resto da tabela, em vez
 *    de escolher quatro cores novas. É a diferença entre derivar e inventar.
 *
 * ── POR QUE CHROMIUM E NÃO `sharp` DIRETO NO SVG ──
 *
 * O desenho é SVG com TEXTO, e texto em SVG dentro do `sharp` passa pelo
 * librsvg, cuja resolução de fonte depende de fontconfig — no Windows isso não
 * é confiável e a falha é silenciosa (cai numa fonte qualquer, ou não desenha).
 * O Chromium do cache do Playwright resolve `@font-face` por caminho `file://`,
 * então a fonte usada é EXATAMENTE a apontada aqui, ou o script quebra.
 *
 * FONTE: `BigShoulders-Bold.ttf`, condensada e pesada, sob OFL. Não uso a
 * `impact.ttf` do Windows, que é a cara óbvia de carimbo, porque ela não é
 * redistribuível e a saída entra no repositório.
 *
 * O navegador vem do cache (`~/AppData/Local/ms-playwright`) e o pacote vem do
 * cache do `npx` — nada entra no `package.json`. A versão do pacote não casa com
 * a do navegador, então o `executablePath` é obrigatório: sem ele o launch
 * procura um build que não existe.
 *
 * ── O DESGASTE É MULTIPLICATIVO NO ALFA ──
 *
 * Carimbo sem falha de tinta lê como adesivo. O desgaste aqui é ruído
 * determinístico (semente fixa, para o arquivo ser reproduzível) multiplicado no
 * canal ALFA, nunca pintado por cima em branco: pintar por cima deixaria pontos
 * brancos visíveis quando a placa do cartão não for branca, e a placa é
 * translúcida (`rgba(255,255,255,0.96)`).
 */
import sharp from 'sharp';
import { mkdir, writeFile, rm, stat } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

/* ── caminhos de máquina ── */
const RAIZ = process.cwd();
const SAIDA_DIR = 'public/images/EVENTOS/carimbos';
const FONTE = path.join(
  RAIZ,
  '.claude/skillsantro/canvas-design/canvas-fonts/BigShoulders-Bold.ttf',
);
const NAVEGADOR =
  process.env.LOCALAPPDATA +
  '\\ms-playwright\\chromium_headless_shell-1243\\chrome-headless-shell-win64\\chrome-headless-shell.exe';
const PACOTE_PLAYWRIGHT =
  process.env.LOCALAPPDATA +
  '\\npm-cache\\_npx\\361ceb562f3b3235\\node_modules\\playwright\\index.mjs';

/* Mesma caixa da arte entregue. NÃO mude sem muder `--carimbo-ar` no CSS: a
   folha declara `520 / 399` e é ela que impede o oval de achatar. */
const W = 520;
const H = 399;
/* Rasteriza em 2x e reduz: as curvas do oval e o texto pequeno da linha de baixo
   perdem definição se rasterizados no tamanho final. */
const ESCALA = 2;

/* A tinta do corpo, medida na arte entregue. Ver "A FAMÍLIA NÃO FOI INVENTADA". */
const TINTA = '#004fb4';

/**
 * A tabela. `tone` é cópia literal de `EVENT_KIND_META` em `src/data/events.ts`
 * — não é importável daqui porque o data é TS com dependências de runtime do
 * Next. Se um tone mudar lá, muda aqui e REGERA; a divergência é silenciosa.
 *
 * `titulo` é a palavra grande e `rodape` a linha pequena de baixo. Elas são
 * DESENHO, não conteúdo: o rótulo lido por leitor de tela continua saindo de
 * `EVENT_KIND_META[kind].label` no `alt` do componente, que é o texto travado
 * pelo portão de cópia da Regra Zero. É por isso que «EVENTO GLOBAL» pode
 * aparecer aqui quebrado em duas linhas sem quebrar `npm run test:copy`.
 */
const KINDS = [
  { kind: 'proprio', tone: '#0ed8f6', topo: 'EVENTO', titulo: 'REALIZADO', rodape: 'PELA SISTRAN' },
  { kind: 'global', tone: '#A78BFA', topo: 'EVENTO', titulo: 'GLOBAL', rodape: 'SISTRAN PRESENTE' },
  { kind: 'nacional', tone: '#57B7EE', topo: 'EVENTO', titulo: 'NACIONAL', rodape: 'SISTRAN PRESENTE' },
  { kind: 'parceiro', tone: '#C4A0FB', topo: 'EVENTO', titulo: 'PARCEIRO', rodape: 'SISTRAN PRESENTE' },
];

/* ── o desenho ──
   Oval duplo: anel externo grosso e anel interno fino tracejado, com o tracejado
   no `tone`. Palavra grande no miolo, achatada horizontalmente para caber sem
   diminuir o corpo (carimbo tem a palavra ocupando a largura toda). */
function svg({ tone, topo, titulo, rodape }) {
  const cx = W / 2;
  const cy = H / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <g fill="none" stroke="${TINTA}">
    <ellipse cx="${cx}" cy="${cy}" rx="${cx - 12}" ry="${cy - 12}" stroke-width="13"/>
    <ellipse cx="${cx}" cy="${cy}" rx="${cx - 34}" ry="${cy - 30}" stroke-width="4"
             stroke-dasharray="26 15" stroke="${tone}"/>
  </g>
  <g fill="${TINTA}" text-anchor="middle" font-family="CarimboDisplay">
    <text x="${cx}" y="${cy - 74}" font-size="30" letter-spacing="9" data-cabe="300">${topo}</text>
    <text x="${cx}" y="${cy + 30}" font-size="96" letter-spacing="1" data-cabe="382">${titulo}</text>
    <text x="${cx}" y="${cy + 84}" font-size="27" letter-spacing="5" data-cabe="330">${rodape}</text>
  </g>
  <g fill="${tone}">
    <circle cx="${cx - 150}" cy="${cy + 56}" r="5"/>
    <circle cx="${cx + 150}" cy="${cy + 56}" r="5"/>
  </g>
</svg>`;
}

/**
 * Encolhe o CORPO de cada linha até ela caber na largura útil do oval
 * (`data-cabe`), MEDINDO a caixa no navegador.
 *
 * A primeira versão calculava um fator de achatamento horizontal a partir do
 * número de letras — `6 / palavra.length + 0.28` — e estava errada de duas
 * formas. A aritmética: «NACIONAL», 8 letras, dava 1,03, isto é ALARGAVA a
 * palavra de 8 letras em vez de estreitá-la, o oposto do que a fórmula
 * pretendia, e foi visível como as letras encostando no anel. E o método:
 * achatar no eixo X distorce a letra — carimbo com letra esticada lê como erro
 * de render, não como carimbo. Corpo menor mantém o desenho da letra.
 *
 * Contar letras é estimar largura; `getComputedTextLength` é medi-la. O número
 * de letras não diz a largura porque as letras não têm a mesma largura
 * («PARCEIRO» e «NACIONAL» têm 8 cada e larguras diferentes).
 */
function ajustarCorpo() {
  /* Devolve o que foi aplicado para entrar no relatório do script: um corpo que
     encolheu muito é o sinal de que a palavra não cabe no desenho, e isso tem de
     aparecer na saída em vez de só no pixel. */
  return [...document.querySelectorAll('text[data-cabe]')].map((no) => {
    const teto = Number(no.dataset.cabe);
    const antes = Number(no.getAttribute('font-size'));
    const largura = no.getComputedTextLength();
    if (largura <= teto) return { texto: no.textContent, corpo: antes, largura: Math.round(largura) };
    /* Arredondado para baixo em 0,1: evita o caso de borda em que o novo corpo
       reproduz largura 0,x acima do teto por arredondamento do render. */
    const depois = Math.floor(((antes * teto) / largura) * 10) / 10;
    no.setAttribute('font-size', depois.toString());
    return { texto: no.textContent, corpo: depois, largura: Math.round(no.getComputedTextLength()) };
  });
}

function pagina(def) {
  const fonteUrl = pathToFileURL(FONTE).href;
  return `<!doctype html><meta charset="utf-8">
<style>
  @font-face { font-family: CarimboDisplay; src: url("${fonteUrl}") format("truetype"); font-weight: 700; }
  html, body { margin: 0; padding: 0; background: transparent; }
  svg { display: block; }
</style>
${svg(def)}`;
}

/* ── desgaste ──
   Máscara de cinza multiplicada no alfa. Semente FIXA: a arte tem de sair igual
   em duas execuções, senão cada regeração mexe no diff de um binário. */
function mascaraDesgaste(w, h) {
  let semente = 20260930;
  const rnd = () => {
    /* LCG — previsível de propósito. Ver acima. */
    semente = (semente * 1103515245 + 12345) & 0x7fffffff;
    return semente / 0x7fffffff;
  };
  const m = Buffer.alloc(w * h, 255);

  /* ⚠️ A PRIMEIRA CALIBRAGEM FOI REPROVADA NO OLHO, e o número conta a história:
     1.400 manchas de raio até 8px com queda radial suave, sobre 520x399. Isso
     não leu como tinta gasta, leu como GLITTER — pontos brancos redondos e
     desfocados sobre o anel, porque queda radial suave é exatamente o perfil de
     um bokeh. E comeu a linha pequena de baixo: «PELA SISTRAN» ficou ilegível.

     O que tinta gasta tem, e bokeh não: borda DURA (a tinta falha ou não falha,
     não desvanece) e escala FINA (poro de papel, não bolha). Daí as três
     mudanças: 1/6 das manchas, raio no máximo 2,6px, corte duro em vez de queda
     radial, e força que nunca zera o pixel de uma vez. */
  for (let i = 0; i < 230; i += 1) {
    const cxm = rnd() * w;
    const cym = rnd() * h;
    const r = 0.8 + rnd() * 1.8;
    const forca = 100 + rnd() * 90;
    const r2 = r * r;
    for (let y = Math.max(0, cym - r) | 0; y < Math.min(h, cym + r + 1); y += 1) {
      for (let x = Math.max(0, cxm - r) | 0; x < Math.min(w, cxm + r + 1); x += 1) {
        if ((x - cxm) ** 2 + (y - cym) ** 2 > r2) continue;
        const idx = y * w + x;
        m[idx] = Math.max(0, m[idx] - forca);
      }
    }
  }

  /* Grão fino por cima de tudo: é ele que faz o chapado de tinta parecer
     absorvido pelo papel. Sutil de propósito — no máximo 18% do alfa, porque
     acima disso o texto pequeno começa a perder traço. */
  for (let p = 0; p < m.length; p += 1) {
    m[p] = Math.max(0, m[p] - rnd() * 46);
  }

  /* Riscos horizontais: a borracha arrasta, e o arrasto é no eixo do papel.
     Poucos e finos; são o acidente, não a textura. */
  for (let i = 0; i < 11; i += 1) {
    const y0 = (rnd() * h) | 0;
    const x0 = (rnd() * w) | 0;
    const comp = 30 + rnd() * 150;
    for (let x = x0; x < Math.min(w, x0 + comp); x += 1) {
      m[y0 * w + x] = Math.max(0, m[y0 * w + x] - 170);
    }
  }
  return m;
}

/* ── execução ── */
const mod = await import(pathToFileURL(PACOTE_PLAYWRIGHT).href);
const { chromium } = mod;
if (!chromium) throw new Error('playwright sem export `chromium` — aponte para o index.mjs, não o index.js');

await mkdir(SAIDA_DIR, { recursive: true });

const navegador = await chromium.launch({ executablePath: NAVEGADOR });
const pag = await navegador.newPage({
  viewport: { width: W, height: H },
  deviceScaleFactor: ESCALA,
});

const relatorio = [];

for (const def of KINDS) {
  const html = path.join(RAIZ, `.carimbo-sis235-${def.kind}.html`);
  await writeFile(html, pagina(def), 'utf8');
  await pag.goto(pathToFileURL(html).href);
  /* Sem a fonte carregada o print sai com a fonte de fallback — e a falha é
     silenciosa, que é exatamente o modo de falha que motivou usar navegador. */
  await pag.evaluate(() => document.fonts.ready);
  const carregou = await pag.evaluate(() => document.fonts.check('700 92px CarimboDisplay'));
  if (!carregou) throw new Error(`fonte CarimboDisplay não carregou para ${def.kind}`);

  /* Só depois da fonte pronta: medir com a fonte de fallback daria um corpo
     ajustado para a largura errada. */
  const corpos = await pag.evaluate(ajustarCorpo);

  const bruto = await pag.screenshot({ omitBackground: true });
  await rm(html, { force: true });

  /* Reduz de 2x para o tamanho de uso e aplica o desgaste no ALFA. */
  const reduzido = await sharp(bruto).resize(W, H, { fit: 'fill' }).ensureAlpha().raw().toBuffer();
  const desgaste = mascaraDesgaste(W, H);
  for (let p = 0, i = 3; p < W * H; p += 1, i += 4) {
    reduzido[i] = (reduzido[i] * desgaste[p]) / 255;
  }

  const destino = path.join(SAIDA_DIR, `carimbo-evento-${def.kind}.webp`);
  await sharp(reduzido, { raw: { width: W, height: H, channels: 4 } })
    /* `nearLossless`: é vetor rasterizado com fio fino e tracejado — o WebP com
       perda gasta bits justamente nas arestas que definem o desenho. Mesma
       decisão, e mesmo motivo, do script da SIS-277. */
    .webp({ nearLossless: true, quality: 88, alphaQuality: 100, effort: 6 })
    .toFile(destino);

  const { size } = await stat(destino);
  const linhas = corpos.map((c) => `${c.texto} ${c.corpo}px/${c.largura}px`).join(' · ');
  relatorio.push(
    `  ${def.kind.padEnd(9)} ${path.basename(destino).padEnd(34)} ${(size / 1024).toFixed(0).padStart(3)} kB   ${linhas}`,
  );
}

await pag.close();
await navegador.close();

console.log(`gerados ${KINDS.length} carimbos em ${SAIDA_DIR} (${W}x${H}):`);
console.log(relatorio.join('\n'));
