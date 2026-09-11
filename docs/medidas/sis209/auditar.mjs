/* SIS-209 — prova geométrica e de composição dos dois cartões de SOCIAL.
   Uso: com um único `npm run dev -- -p 3999`, rode
   `node docs/medidas/sis209/auditar.mjs`. */
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs";

const baseUrl = process.env.BASE_URL ?? "http://localhost:3999/esg";
const pasta = new URL("./", import.meta.url);
const seletorSecao = 'section[aria-labelledby="esg-social"]';
const seletorWrapper = `${seletorSecao} .esg-social-flutua`;
const arredondar = (valor) => Number(valor.toFixed(3));

await mkdir(pasta, { recursive: true });
const navegador = await chromium.launch();

async function abrir(viewport, reducedMotion = "no-preference") {
  const contexto = await navegador.newContext({ viewport, reducedMotion });
  await contexto.addInitScript(() => {
    sessionStorage.setItem("sistran:intro-visto", "1");
    localStorage.setItem("sistran-motion-preference", "system");
    localStorage.setItem("sistran-motion-preference-seen", "1");
  });
  const pagina = await contexto.newPage();
  await pagina.goto(baseUrl, { waitUntil: "domcontentloaded", timeout: 120_000 });
  await pagina.addStyleTag({
    content:
      "nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button]{display:none!important}",
  });
  await pagina.locator(seletorWrapper).first().waitFor({ state: "visible" });
  return { contexto, pagina };
}

const lerTransformacoes = (pagina) =>
  pagina.locator(seletorWrapper).evaluateAll((elementos) =>
    elementos.map((elemento) => getComputedStyle(elemento).transform),
  );

async function medirDesktop(width, capturar = false) {
  const { contexto, pagina } = await abrir({ width, height: 900 });
  const wrappers = pagina.locator(seletorWrapper);
  const artigos = wrappers.locator("article");
  /* O alvo anima continuamente, então a actionability do Playwright nunca o
     considera "estável". Rolagem e hover usam caixas instantâneas de propósito. */
  await wrappers.first().evaluate((elemento) => {
    window.__lenis?.stop();
    elemento.scrollIntoView({ block: "center", behavior: "instant" });
  });
  await pagina.waitForTimeout(300);

  const caixas = await artigos.evaluateAll((elementos) =>
    elementos.map((elemento) => {
      const caixa = elemento.getBoundingClientRect();
      return { width: caixa.width, height: caixa.height };
    }),
  );
  const instanteA = await lerTransformacoes(pagina);
  await pagina.waitForTimeout(700);
  const instanteB = await lerTransformacoes(pagina);

  if (capturar) {
    await wrappers.first().evaluate((elemento) => {
      const topo = elemento.getBoundingClientRect().top + scrollY - 150;
      window.__lenis?.stop();
      window.scrollTo({ top: topo, behavior: "instant" });
    });
    await pagina.waitForTimeout(300);
    await pagina.screenshot({
      path: fileURLToPath(new URL("social-1440x900.png", pasta)),
    });
  }

  await wrappers.first().evaluate((elemento) => {
    window.__lenis?.stop();
    elemento.scrollIntoView({ block: "center", behavior: "instant" });
  });
  await pagina.waitForTimeout(300);
  const centro = await artigos.first().evaluate((elemento) => {
    const caixa = elemento.getBoundingClientRect();
    return { x: caixa.left + caixa.width / 2, y: caixa.top + caixa.height / 2 };
  });
  await pagina.mouse.move(centro.x, centro.y);
  await pagina.waitForTimeout(500);
  const hover = {
    artigo: await artigos.first().evaluate((elemento) => getComputedStyle(elemento).transform),
    wrapperPausado: await wrappers
      .first()
      .evaluate((elemento) => getComputedStyle(elemento).animationPlayState),
  };

  const alturas = caixas.map((caixa) => arredondar(caixa.height));
  const larguras = caixas.map((caixa) => arredondar(caixa.width));
  await contexto.close();
  return {
    viewport: { width, height: 900 },
    alturas,
    deltaAltura: arredondar(Math.abs(alturas[0] - alturas[1])),
    toleranciaAltura: 0.5,
    alturasIguais: Math.abs(alturas[0] - alturas[1]) <= 0.5,
    larguras,
    deltaLargura: arredondar(Math.abs(larguras[0] - larguras[1])),
    movimento: { intervaloMs: 700, instanteA, instanteB },
    hover,
  };
}

async function medirLargura(width) {
  const { contexto, pagina } = await abrir({ width, height: width === 390 ? 844 : 900 });
  const largura = await pagina.evaluate(() => ({
    innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  await contexto.close();
  return { ...largura, semRolagemLateral: largura.scrollWidth <= largura.innerWidth };
}

async function medirReducao(canal) {
  const { contexto, pagina } = await abrir(
    { width: 1440, height: 900 },
    canal === "sistema" ? "reduce" : "no-preference",
  );
  if (canal === "atributo") {
    await pagina.evaluate(() => {
      document.documentElement.dataset.motion = "reduce";
    });
  }
  await pagina.waitForTimeout(100);
  const estado = await pagina.locator(seletorWrapper).evaluateAll((elementos) =>
    elementos.map((elemento) => ({
      transform: getComputedStyle(elemento).transform,
      animationName: getComputedStyle(elemento).animationName,
      plumaOpacity: getComputedStyle(elemento, "::before").opacity,
    })),
  );
  await contexto.close();
  return estado;
}

const resultado = {
  desktop: {
    "1366x900": await medirDesktop(1366),
    "1440x900": await medirDesktop(1440, true),
  },
  larguraDocumento: {
    "390x844": await medirLargura(390),
    "768x900": await medirLargura(768),
  },
  reducao: {
    sistema: await medirReducao("sistema"),
    atributo: await medirReducao("atributo"),
  },
};

await writeFile(new URL("resultado.json", pasta), JSON.stringify(resultado, null, 2));
console.log(JSON.stringify(resultado, null, 2));
await navegador.close();
