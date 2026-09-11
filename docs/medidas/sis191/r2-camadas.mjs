/* SIS-191, segunda volta — CAMADA POR CAMADA.

   A lupa mostrou o corte: a America do Sul decorativa é cortada por uma ARESTA
   RETA no rodape do mapa, dentro do quadro visivel. Quem corta é o
   `overflow: hidden` da `.bm-mapa` (o viewport do proprio SVG), e o desenho que
   ele corta vai muito alem do `viewBox` — a nota do CSS diz "de y -45 a 945" num
   viewBox de 640 de altura.

   Antes de escolher o remedio é preciso saber DE QUEM é a folga: se a faixa de
   baixo do mapa tem so decoracao, ela pode ser esmaecida; se tem o pais, um pino
   ou um ROTULO, esmaecer apagaria informacao e baixaria contraste de texto.
   Este script mede a distancia de cada camada ate a borda de recorte, que é a
   caixa de CONTEUDO do `<svg>` (o `padding` do SVG encolhe o viewport).

   Uso: `node docs/medidas/sis191/r2-camadas.mjs antes|depois`. */
import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs";

const estado = process.argv[2] ?? "antes";
const raiz = path.resolve("docs/medidas/sis191");
const ALVO = "http://localhost:3000/quem-somos";

const n1 = (v) => (typeof v === "number" ? Math.round(v * 10) / 10 : v);
const normalizar = (v) => {
  if (Array.isArray(v)) return v.map(normalizar);
  if (v && typeof v === "object")
    return Object.fromEntries(
      Object.entries(v).map(([k, i]) => [k, normalizar(i)]),
    );
  return n1(v);
};

const navegador = await chromium.launch();

async function abrir(viewport) {
  const contexto = await navegador.newContext({ viewport });
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
  await pagina.waitForTimeout(1200);
  return { contexto, pagina };
}

async function rolar(pagina, alvo) {
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
  await pagina.waitForTimeout(1800);
}

const fracao = (pagina, f) =>
  pagina.evaluate((valor) => {
    const trilha = document.querySelector(".os-trilha");
    const inner = document.querySelector(".os-inner");
    if (!trilha || !inner) return 0;
    const curso = Math.max(1, trilha.offsetHeight - inner.offsetHeight);
    return trilha.getBoundingClientRect().top + window.scrollY + curso * valor;
  }, f);

const medir = (pagina) =>
  pagina.evaluate(() => {
    const svg = document.querySelector(".bm-mapa");
    if (!svg) return null;
    const r = svg.getBoundingClientRect();
    const e = getComputedStyle(svg);
    const p = (nome) => parseFloat(e.getPropertyValue(nome)) || 0;
    /* A BORDA DE RECORTE: para um `<svg>` o `padding` encolhe o viewport, entao
       quem corta é a caixa de conteudo — nao a caixa de borda. */
    const recorte = {
      top: r.top + p("padding-top"),
      right: r.right - p("padding-right"),
      bottom: r.bottom - p("padding-bottom"),
      left: r.left + p("padding-left"),
      altura: r.height - p("padding-top") - p("padding-bottom"),
      largura: r.width - p("padding-left") - p("padding-right"),
    };

    const folga = (caixa) => ({
      topo: caixa.top - recorte.top,
      direita: recorte.right - caixa.right,
      base: recorte.bottom - caixa.bottom,
      esquerda: caixa.left - recorte.left,
      /* Fracao da altura do recorte em que a borda de baixo da camada cai: é o
         numero que decide onde uma esmaecida pode comecar sem tocar a camada. */
      baseEmFracao: (caixa.bottom - recorte.top) / recorte.altura,
    });

    const grupo = (rotulo, seletor) => {
      const nos = [...document.querySelectorAll(seletor)];
      if (!nos.length) return { rotulo, presente: false };
      const cx = nos.map((n) => n.getBoundingClientRect());
      const uniao = {
        top: Math.min(...cx.map((c) => c.top)),
        right: Math.max(...cx.map((c) => c.right)),
        bottom: Math.max(...cx.map((c) => c.bottom)),
        left: Math.min(...cx.map((c) => c.left)),
      };
      return { rotulo, presente: true, nos: nos.length, ...folga(uniao) };
    };

    const palco = document.querySelector(".os-palco");
    const colunaMapa = document.querySelector(".os-mapa").getBoundingClientRect();

    return {
      modo: palco?.dataset.modo ?? null,
      ativa: palco?.dataset.ativa ?? null,
      recorte: {
        largura: recorte.largura,
        altura: recorte.altura,
        padding: [p("padding-top"), p("padding-left")],
      },
      /* Quanto da faixa do mapa sobra sem uso: se a coluna é bem mais larga que o
         SVG, reservar corredor para o ScrollSpy nao custa mapa nenhum. */
      colunaDoMapa: {
        largura: colunaMapa.width,
        altura: colunaMapa.height,
        folgaHorizontalDoSvg: colunaMapa.width - r.width,
      },
      camadas: [
        grupo("pais", ".bm-camera .bm-pais"),
        grupo("divisas-br", ".bm-camera .bm-divisas-br"),
        grupo("rota", ".bm-camera .bm-rota-base, .bm-camera .bm-rota-desenho"),
        grupo("pinos", ".bm-camera g[data-cidade] > circle, .bm-camera .bm-nucleo, .bm-camera .bm-anel, .bm-camera .bm-gota"),
        grupo("halos", ".bm-camera .bm-halo"),
        grupo("rotulos", ".bm-camera .bm-rotulo"),
        grupo("chamadas", ".bm-camera .bm-chamadas path"),
        grupo("latam-aura", ".bm-camera .bm-latam-aura"),
        grupo("latam-contorno", ".bm-camera .bm-latam-contorno"),
        grupo("latam-divisas", ".bm-camera .bm-latam-divisas"),
      ],
    };
  });

const relatorio = { estado, leituras: [] };

for (const [largura, altura] of [
  [1280, 760],
  [1366, 768],
  [1440, 900],
  [1512, 860],
  [1920, 1080],
]) {
  const { contexto, pagina } = await abrir({ width: largura, height: altura });
  for (const [nome, f] of [
    ["pouso-pr", 0.125],
    ["pouso-sp", 0.875],
  ]) {
    await rolar(pagina, await fracao(pagina, f));
    relatorio.leituras.push({
      quadro: nome,
      largura,
      altura,
      ...(await medir(pagina)),
    });
  }
  await contexto.close();
}

const saida = normalizar(relatorio);
await fs.writeFile(
  path.join(raiz, `r2-camadas-${estado}.json`),
  `${JSON.stringify(saida, null, 2)}\n`,
);
for (const l of saida.leituras) {
  console.log(
    `\n== ${l.quadro} ${l.largura}x${l.altura} recorte ${l.recorte.largura}x${l.recorte.altura} | folga horizontal da coluna: ${l.colunaDoMapa.folgaHorizontalDoSvg}`,
  );
  for (const c of l.camadas) {
    if (!c.presente) continue;
    console.log(
      `   ${c.rotulo.padEnd(16)} topo ${String(c.topo).padStart(8)} base ${String(c.base).padStart(8)} esq ${String(c.esquerda).padStart(8)} dir ${String(c.direita).padStart(8)}  baseEmFracao ${c.baseEmFracao}`,
    );
  }
}
await navegador.close();
