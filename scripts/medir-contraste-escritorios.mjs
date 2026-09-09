/**
 * SIS-161 — mede o contraste real do texto da cena "Escritórios BRASIL" em
 * /quem-somos, em quatro larguras.
 *
 * Segue `docs/medidas/COMO-MEDIR-CONTRASTE.md`: tinta do bloco apagada com
 * `color`/`fill: transparent` (nunca `visibility`), alfa composto contra o fundo
 * lido, PIOR pixel do recorte, `header.fixed` e avisos do `next dev` escondidos,
 * ~3,5s de espera e o mínimo entre seis quadros.
 *
 * TRÊS COISAS QUE ESTE ALVO EXIGIU E O MÉTODO NÃO PREVIA — as três apareceram
 * como REPROVAÇÃO FALSA na primeira rodada, e todas têm a mesma causa: a caixa do
 * elemento é maior que a tinta.
 *
 *  1. O recorte é o retângulo dos GLIFOS (via `Range`), não o do elemento. A caixa
 *     de um comprimido `border-radius: 999px` inclui os cantos, que ficam FORA da
 *     pílula: ali aparece o fundo claro da seção. A aba ativa (tinta branca) mediu
 *     1,14:1 contra `231,241,250` — o fundo da seção, não o do chip. O mesmo vício
 *     pôs o pino navy do mapa dentro da caixa do rótulo de Pato Branco (1,01:1
 *     contra `6,47,97`) e o traço navy de `.os-olho::before` dentro da caixa do
 *     olho. Apagar tinta não resolve nenhum dos três: o intruso é FUNDO, não texto.
 *  2. Nos rótulos do mapa a tinta vem de `fill`, não de `color`.
 *  3. `opacity` de `<g>` ancestral multiplica a tinta — Pato Branco recua para 0,4
 *     no trecho de São Paulo. O alfa efetivo é o produto das opacidades até a raiz.
 *
 * A tinta é apagada UMA vez, para toda a cena, e todos os alvos saem dos MESMOS
 * seis quadros de viewport. Além de ser mais rápido, elimina o ciclo
 * apagar/restaurar por alvo — na primeira rodada uma restauração falhada fez a
 * aba inativa ser lida com `alfa: 0`, isto é, medindo a transparência que a
 * própria sonda havia escrito.
 *
 * Nada aqui entra no bundle: é ferramenta de bancada.
 *   node scripts/medir-contraste-escritorios.mjs
 */
import { chromium } from "file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs";
import sharp from "sharp";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const LARGURAS = [1024, 1366, 1440, 1728];
/* 1200, e não 900, por medida: a captura do Playwright é do VIEWPORT, e a camera
   do mapa avanca sobre a cidade do trecho — em 1728 com Sao Paulo escolhido a
   coordenada de Pato Branco caiu em y=924 e o recorte saiu VAZIO, relatado como
   reprovacao quando o que faltava era pixel, nao contraste.
   Rolar a pagina para encaixar o alvo foi tentado e é ERRADO: a cena é dirigida
   por rolagem, e o `scrollBy` remexeu o `data-ativa` — as duas etiquetas de Sao
   Paulo passaram a ser lidas com `alfa: 0` e o olho desabou para 1,00:1, oito
   reprovacoes falsas de uma vez. Em cena scroll-driven o quadro se ajusta pela
   JANELA, nunca movendo a cena depois de ela ter assentado.
   Aumentar a janela é seguro aqui porque a cena PARA de crescer: o mapa é
   `max-height: min(72svh, 40rem)`, ou seja 640px a partir de ~890px de altura.
   Em 1000 o cartao e as etiquetas ainda caíam fora em 1366+; em 1200 a cena
   inteira cabe e as quatro larguras leem os onze alvos nas duas passagens. */
const ALTURA = 1200;
const QUADROS = 6;

const lin = (c) => {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};
const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const razao = (a, b) => {
  const [x, y] = [lum(a), lum(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};
/* fg × α + fundo × (1 − α). */
const compor = (fg, a, bg) =>
  fg.map((c, i) => Math.round(c * a + bg[i] * (1 - a)));

/** No navegador: tinta efetiva, alfa acumulado, tamanho e retângulo dos glifos. */
const LEVANTAR = (raiz, alvos) => {
  const corDe = (bruto) => bruto.match(/-?[\d.]+/g).map(Number);
  const medir = (e) => {
    const c = getComputedStyle(e);
    const svg = e.ownerSVGElement != null;
    const n = corDe(svg ? c.fill : c.color);
    let alfa =
      (n.length > 3 ? n[3] : 1) * (svg ? Number(c.fillOpacity || 1) : 1);
    for (let p = e; p; p = p.parentElement) {
      const o = Number(getComputedStyle(p).opacity);
      if (!Number.isNaN(o)) alfa *= o;
    }
    /* Retângulo dos glifos: união dos `client rects` de um `Range` sobre o
       conteúdo. É o que separa a tinta da moldura em volta dela. */
    const r = document.createRange();
    r.selectNodeContents(e);
    const caixas = [...r.getClientRects()].filter(
      (b) => b.width > 0 && b.height > 0,
    );
    if (!caixas.length) return null;
    const x0 = Math.min(...caixas.map((b) => b.left));
    const y0 = Math.min(...caixas.map((b) => b.top));
    const x1 = Math.max(...caixas.map((b) => b.right));
    const y1 = Math.max(...caixas.map((b) => b.bottom));
    /* Com `background-clip: text` a tinta é o degrade inteiro. Cada parada é uma
       tinta candidata, e o resultado do alvo é a PIOR delas — a mesma regra do
       pior pixel, aplicada ao outro lado da conta. */
    const clipText =
      c.webkitBackgroundClip === "text" || c.backgroundClip === "text";
    const paradas = clipText
      ? [...c.backgroundImage.matchAll(/rgba?\(([^)]+)\)/g)].map((m) =>
          m[1]
            .split(",")
            .slice(0, 3)
            .map((v) => Number(v.trim())),
        )
      : [];
    return {
      tinta: n.slice(0, 3),
      tintas: paradas.length ? paradas : [n.slice(0, 3)],
      degrade: clipText ? c.backgroundImage : undefined,
      alfa: Math.round(alfa * 1000) / 1000,
      px: Math.round(parseFloat(c.fontSize) * 100) / 100,
      peso: c.fontWeight,
      caixa: {
        x: Math.round(x0),
        y: Math.round(y0),
        w: Math.max(1, Math.round(x1 - x0)),
        h: Math.max(1, Math.round(y1 - y0)),
      },
    };
  };

  const fora = {};
  for (const [id, seletor] of Object.entries(alvos)) {
    const e = document.querySelector(seletor);
    fora[id] = e ? medir(e) : null;
  }
  /* Apagada UMA vez, depois de todo mundo medido. */
  for (const f of [raiz, ...raiz.querySelectorAll("*")]) {
    const antes = getComputedStyle(f);
    /* `background-clip: text` faz a tinta ser um GRADIENTE, e nao `color`: apagar
       `color` nao apaga nada, apenas revela o gradiente dentro do retangulo
       medido. `BRASIL` mediu 1,01:1 contra `6,32,70` — o proprio degrade, lido
       como se fosse o fundo. Aqui o gradiente sai junto com a tinta; a razao
       desse pedaco é calculada à parte, pela parada mais clara do degrade. */
    if (
      antes.webkitBackgroundClip === "text" ||
      antes.backgroundClip === "text"
    ) {
      f.style.setProperty("background-image", "none", "important");
    }
    f.style.setProperty("color", "transparent", "important");
    f.style.setProperty("-webkit-text-fill-color", "transparent", "important");
    f.style.setProperty("fill", "transparent", "important");
  }
  return fora;
};

const navegador = await chromium.launch();
const saida = {};

/* Duas passagens por largura, e a segunda não é zelo: com São Paulo escolhido, o
   grupo de Pato Branco recua para 0,4 de opacidade — `.bm-rotulo` tem
   `data-cidade` e é apanhada pela mesma regra dos pinos. Tinta navy a 40% sobre
   folha clara é exatamente o caso em que o alfa composto reprova e a cor
   declarada aprovaria. */
/* As DUAS passagens clicam. A primeira nao clicava — herdava o trecho em que a
   rolagem tivesse parado — e isso nao é economia, é medicao sem estado definido:
   ao trocar a altura da janela de 900 para 1000 a cena assentou noutro trecho e a
   passagem inteira saiu com recorte vazio nas quatro larguras. O estado a medir
   se declara; nao se herda de onde o `scrollIntoViewIfNeeded` calhou de parar. */
const PASSAGENS = [
  { nome: "pr-escolhida", clicar: ".os-abas button:first-of-type" },
  { nome: "sp-escolhida", clicar: ".os-abas button:last-of-type" },
];

for (const largura of LARGURAS) {
  for (const passagem of PASSAGENS) {
    const pagina = await navegador.newPage({
      viewport: { width: largura, height: ALTURA },
    });
    await pagina.goto(`${BASE}/quem-somos`, { waitUntil: "networkidle" });
    await pagina.addStyleTag({
      content:
        "header.fixed{display:none!important}" +
        "nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button],[class*=motion-banner],[class*=motion-dialog]{display:none!important}",
    });
    /* ORDEM MEDIDA, e cada passo esta aqui porque a alternativa foi tentada e
       falhou. Quem posiciona a cena é o CLIQUE: o navegador rola para dar foco ao
       botao, e ele para onde quer — em 1366 o palco (958px de altura) ficava com o
       topo em y=955 numa janela de 1200, com o cartao e as etiquetas do mapa
       inteiramente fora do quadro; a passagem de Pato Branco lia o olho em y=1016
       e a etiqueta em y=1541 contra y=498 e y=1046 na de Sao Paulo, 518px de
       diferenca entre as duas. `scrollIntoView` antes do clique nao resolve —
       medido, deixou `scrollY` em 0, e o clique refez a rolagem de qualquer jeito.
       Entao: clica primeiro, encaixa o palco a 24px do topo DEPOIS, e só ai deixa
       assentar. Encaixar depois é seguro porque este é um ponto de repouso da
       partitura — conferido, `data-ativa` continua `pr`/`sp` e os onze alvos caem
       entre y=85 e y=669. O que nao se pode fazer é um `scrollBy` cego no meio da
       partitura: foi assim que as etiquetas de Sao Paulo passaram a ser lidas com
       `alfa: 0` e o olho desabou para 1,00:1. */
    await pagina.locator(passagem.clicar).click();
    await new Promise((res) => setTimeout(res, 1200)); // as cortinas dos rotulos levam 0,62s
    await pagina.evaluate(() => {
      const e = document.querySelector(".os-palco");
      window.scrollBy(0, e.getBoundingClientRect().top - 24);
    });
    await new Promise((res) => setTimeout(res, 3500)); // deixar a entrada de 3,2s assentar

    const ativa = await pagina
      .locator(".os-palco")
      .first()
      .getAttribute("data-ativa");
    const alvos = {
      "aba-ativa": '.os-abas button[aria-selected="true"]',
      "aba-inativa": '.os-abas button[aria-selected="false"]',
      olho: ".os-olho",
      /* O titulo vai em DOIS alvos: `Escritorios` em tinta chapada e `BRASIL` em
       degrade recortado no texto. Medir o `h2` inteiro punha um dentro do
       retangulo do outro — o vicio do item 1 do metodo. */
      "titulo-texto": "#escritorios > span:not(.text-gradient-brand)",
      "titulo-destaque": "#escritorios .text-gradient-brand",
      "cartao-nome": `.os-painel[data-cidade="${ativa}"] .os-cidade-nome`,
      "cartao-texto": `.os-painel[data-cidade="${ativa}"] .os-cidade-texto`,
      "rotulo-pr-nome": '.bm-rotulo[data-cidade="pr"] text:not(.bm-coord)',
      "rotulo-pr-coord": '.bm-rotulo[data-cidade="pr"] .bm-coord',
      "rotulo-sp-nome": '.bm-rotulo[data-cidade="sp"] text:not(.bm-coord)',
      "rotulo-sp-coord": '.bm-rotulo[data-cidade="sp"] .bm-coord',
    };
    const medidos = await pagina
      .locator(".os-trilha")
      .first()
      .evaluate(LEVANTAR, alvos);

    const quadros = [];
    let instavel = false;
    for (let q = 0; q < QUADROS; q += 1) {
      const buf = await pagina.screenshot();
      if (quadros.length && !quadros[quadros.length - 1].equals(buf))
        instavel = true;
      quadros.push(buf);
      await new Promise((res) => setTimeout(res, 150));
    }
    const cruas = [];
    for (const buf of quadros)
      cruas.push(
        await sharp(buf)
          .ensureAlpha()
          .raw()
          .toBuffer({ resolveWithObject: true }),
      );

    const chave = `${largura} ${passagem.nome}`;
    saida[chave] = { "#ativa": ativa, "#quadrosIguais": !instavel };
    for (const [id, m] of Object.entries(medidos)) {
      if (!m) {
        saida[chave][id] = null;
        continue;
      }
      const { x, y, w, h } = m.caixa;
      let pior = null;
      for (const { data, info } of cruas) {
        const x1 = Math.min(x + w, info.width);
        const y1 = Math.min(y + h, info.height);
        for (let py = Math.max(0, y); py < y1; py += 1) {
          for (let px = Math.max(0, x); px < x1; px += 1) {
            const i = (py * info.width + px) * info.channels;
            const bg = [data[i], data[i + 1], data[i + 2]];
            for (const t of m.tintas) {
              const r = razao(compor(t, m.alfa, bg), bg);
              if (pior === null || r < pior.razao) {
                pior = {
                  razao: Math.round(r * 100) / 100,
                  fundo: bg,
                  tintaPior: t,
                };
              }
            }
          }
        }
      }
      const grande = m.px >= 24 || (m.px >= 18.66 && Number(m.peso) >= 700);
      const piso = grande ? 3 : 4.5;
      saida[chave][id] = {
        ...m,
        piso,
        /* Recorte vazio nao é reprovacao de contraste, é alvo fora do quadro:
           dizer qual dos dois é vale mais do que um `undefined` no relatorio. */
        ...(pior ?? {
          razao: null,
          motivo: "recorte vazio — alvo fora da janela",
        }),
        passa: pior !== null && pior.razao >= piso,
      };
    }
    await pagina.close();
  }
}

await navegador.close();
console.log(JSON.stringify(saida, null, 2));
