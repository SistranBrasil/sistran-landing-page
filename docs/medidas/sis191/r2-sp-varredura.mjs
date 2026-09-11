/* SIS-191, segunda volta — VARREDURA DO POUSO DE SAO PAULO.

   O corredor do ScrollSpy tira 80..88px da faixa do mapa, e no pouso de Pato
   Branco isso nao alcanca o desenho (ele sobra de folga lateral). No pouso de SAO
   PAULO alcanca: la a camera desliza o desenho 34% para a esquerda
   (`--os-desliza`), justamente para o cartao que pousa a direita nao cobrir o
   mapa — e com a faixa mais estreita a borda esquerda do recorte avanca por cima
   do pais.

   Sao DUAS soleiras ao mesmo tempo, e é por isso que este script mede as duas:
     · a esquerda, o pais nao pode passar da borda do recorte;
     · a direita, o pais nao pode entrar debaixo do cartao.
   Aceitar uma sozinha é o que faz o ajuste oscilar de um defeito para o outro.

   `node docs/medidas/sis191/r2-sp-varredura.mjs [rotulo]` — o rotulo só nomeia o
   arquivo de saida, para comparar tentativas. */
import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs";

const rotulo = process.argv[2] ?? "atual";
const raiz = path.resolve("docs/medidas/sis191");
const ALVO = "http://localhost:3000/quem-somos";

const n1 = (v) => (typeof v === "number" ? Math.round(v * 10) / 10 : v);
const navegador = await chromium.launch();

const linhas = [];

for (const [largura, altura] of [
  [1280, 760],
  [1366, 768],
  [1440, 900],
  [1470, 900],
  [1512, 860],
  [1536, 864],
  [1600, 900],
  [1700, 950],
  [1920, 1080],
]) {
  const contexto = await navegador.newContext({
    viewport: { width: largura, height: altura },
  });
  await contexto.addInitScript(() => {
    localStorage.setItem("sistran-motion-preference", "system");
    localStorage.setItem("sistran-motion-preference-seen", "1");
  });
  const pagina = await contexto.newPage();
  await pagina.goto(ALVO, { waitUntil: "domcontentloaded" });
  await pagina.addStyleTag({
    content:
      "nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button]{display:none!important}",
  });
  await pagina.waitForSelector(".os-palco");
  await pagina.waitForTimeout(1000);

  const alvo = await pagina.evaluate(() => {
    const trilha = document.querySelector(".os-trilha");
    const inner = document.querySelector(".os-inner");
    if (!trilha || !inner) return 0;
    const curso = Math.max(1, trilha.offsetHeight - inner.offsetHeight);
    return trilha.getBoundingClientRect().top + window.scrollY + curso * 0.875;
  });
  /* O SALTO PRECISA SER CONFERIDO, e nao só disparado. Duas larguras da primeira
     varredura (1512 e 1700) devolveram medida de Pato Branco: o `scrollTo` saiu,
     mas o gatilho ainda nao tinha recalculado o proprio alcance e o palco ficou
     no pouso anterior. Numero de pouso errado lido como numero de pouso certo é
     pior do que sonda que falha. Daí conferir `data-ativa` e insistir. */
  let ativa = null;
  for (let tentativa = 0; tentativa < 4 && ativa !== "sp"; tentativa += 1) {
    await pagina.evaluate((topo) => {
      document.documentElement.style.scrollBehavior = "auto";
      const lenis = window.__lenis;
      if (lenis) lenis.scrollTo(topo, { immediate: true });
      else window.scrollTo(0, topo);
    }, alvo);
    await pagina
      .waitForFunction((t) => Math.abs(window.scrollY - t) < 6, alvo, {
        timeout: 8000,
      })
      .catch(() => {});
    /* 2,4s: a camera do mapa tem transicao de 1,1s e o feixe é remedido 1,2s
       depois da chegada. Medir antes disso le um quadro em curso. */
    await pagina.waitForTimeout(2400);
    ativa = await pagina.evaluate(
      () => document.querySelector(".os-palco").dataset.ativa,
    );
  }
  if (ativa !== "sp") {
    throw new Error(`${largura}: nao chegou ao pouso de SP (ativa=${ativa})`);
  }

  const medida = await pagina.evaluate(() => {
    const svg = document.querySelector(".bm-mapa");
    const e = getComputedStyle(svg);
    const p = (nome) => parseFloat(e.getPropertyValue(nome)) || 0;
    const r = svg.getBoundingClientRect();
    const recorte = {
      left: r.left + p("padding-left"),
      right: r.right - p("padding-right"),
      top: r.top + p("padding-top"),
      bottom: r.bottom - p("padding-bottom"),
    };
    const pais = document.querySelector(".bm-pais").getBoundingClientRect();
    const cartao = document
      .querySelector('.os-painel[data-cidade="sp"]')
      .getBoundingClientRect();
    const torre = document.querySelector(".os-torre").getBoundingClientRect();
    const nucleo = document
      .querySelector('g[data-cidade="sp"] .bm-nucleo')
      .getBoundingClientRect();
    const coluna = document.querySelector(".os-coluna").getBoundingClientRect();
    const palco = document.querySelector(".os-palco");
    const ep = getComputedStyle(palco);
    return {
      ativa: palco.dataset.ativa,
      pousado: palco.dataset.pousado ?? null,
      paddingEsquerdaPalco: parseFloat(ep.paddingLeft),
      paddingDireitaPalco: parseFloat(ep.paddingRight),
      /* AS DUAS SOLEIRAS */
      paisVsRecorteEsq: pais.left - recorte.left,
      paisVsCartao: cartao.left - pais.right,
      /* contexto: onde cada peca esta */
      recorteEsq: recorte.left,
      colunaDir: coluna.right,
      cartaoEsq: cartao.left,
      paisEsq: pais.left,
      paisDir: pais.right,
      /* o feixe torre -> pino continua tendo de pousar ENTRE os dois */
      torreDir: torre.right,
      pinoCentro: (nucleo.left + nucleo.right) / 2,
      pinoEntreTorreECartao:
        (nucleo.left + nucleo.right) / 2 > torre.right &&
        (nucleo.left + nucleo.right) / 2 < cartao.left,
    };
  });

  linhas.push({ largura, altura, ...medida });
  await contexto.close();
}

const saida = linhas.map((l) =>
  Object.fromEntries(Object.entries(l).map(([k, v]) => [k, n1(v)])),
);
await fs.writeFile(
  path.join(raiz, `r2-sp-${rotulo}.json`),
  `${JSON.stringify(saida, null, 2)}\n`,
);
console.log(
  "largura  padEsq  pais>recorteEsq  cartao-pais  pinoEntre  torreDir  pino  cartaoEsq",
);
for (const l of saida) {
  console.log(
    [
      String(l.largura).padEnd(8),
      String(l.paddingEsquerdaPalco).padEnd(7),
      String(l.paisVsRecorteEsq).padStart(15),
      String(l.paisVsCartao).padStart(12),
      String(l.pinoEntreTorreECartao).padStart(10),
      String(l.torreDir).padStart(9),
      String(l.pinoCentro).padStart(6),
      String(l.cartaoEsq).padStart(10),
    ].join(" "),
  );
}
await navegador.close();
