import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs";

const fase = process.argv[2] ?? "depois";
const url = process.env.BASE_URL ?? "http://localhost:3999/";
const pasta = new URL("./", import.meta.url);
const esconderDev =
  "nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button],header.fixed,nav:has(.scrollspy-rotulo){display:none!important}";
const limparPainel = `
  .impact-lista,.impact-lista *{color:transparent!important;-webkit-text-fill-color:transparent!important;text-shadow:none!important}
  .impact-valor{background-image:none!important;filter:none!important}
  .impact-icone,.impact-grade,.impact-curvas,.impact-trilho,.impact-haste{visibility:hidden!important}
  .impact-item{border-color:transparent!important}
`;

await mkdir(pasta, { recursive: true });
const navegador = await chromium.launch();

const lin = (c) => {
  c /= 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};
const luminancia = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const contraste = (a, b) => {
  const [maior, menor] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
  return (maior + 0.05) / (menor + 0.05);
};
const compor = (fg, alfa, bg) =>
  fg.map((canal, i) => Math.round(canal * alfa + bg[i] * (1 - alfa)));

async function abrir(viewport, reducedMotion = "no-preference") {
  const pagina = await navegador.newPage({ viewport });
  pagina.setDefaultTimeout(120_000);
  await pagina.emulateMedia({ reducedMotion });
  /* A intro morfológica cobre a viewport com azul enquanto roda. A sonda mede a
     seção assentada, então marca a intro como já vista antes do primeiro paint. */
  await pagina.addInitScript(() => {
    sessionStorage.setItem("sistran:intro-visto", "1");
    localStorage.setItem("sistran-motion-preference", "system");
    localStorage.setItem("sistran-motion-preference-seen", "1");
  });
  /* O dev server mantém conexões de HMR abertas; `networkidle` pode nunca fechar.
     O estado visual é assentado pela espera explícita depois do scroll. */
  await pagina.goto(url, { waitUntil: "domcontentloaded", timeout: 120_000 });
  await pagina.addStyleTag({ content: esconderDev });
  await pagina.locator("#resultados").waitFor({ state: "attached" });
  await pagina.evaluate(() => {
    document.querySelector("#resultados")?.scrollIntoView({ block: "center" });
  });
  await pagina.waitForTimeout(2200);
  /* Hero/Lenis assentam depois do DOMContentLoaded e podem restaurar a rolagem.
     Reaplica no fim para a captura, sobretudo mobile, ficar na faixa auditada. */
  await pagina.locator("#resultados").scrollIntoViewIfNeeded();
  await pagina.waitForTimeout(3500);
  return pagina;
}

async function pixels(pagina, buffer) {
  return pagina.evaluate(async (base64) => {
    const imagem = new Image();
    imagem.src = `data:image/png;base64,${base64}`;
    await imagem.decode();
    const canvas = document.createElement("canvas");
    canvas.width = imagem.width;
    canvas.height = imagem.height;
    const contexto = canvas.getContext("2d");
    contexto.drawImage(imagem, 0, 0);
    return {
      width: canvas.width,
      height: canvas.height,
      data: [...contexto.getImageData(0, 0, canvas.width, canvas.height).data],
    };
  }, buffer.toString("base64"));
}

async function medirContraste(pagina, seletor, nome, tinta, piso) {
  const alvo = pagina.locator(seletor).first();
  const retangulo = await alvo.evaluate((elemento) => {
    const r = elemento.getBoundingClientRect();
    return {
      x: Number(r.x.toFixed(2)),
      y: Number(r.y.toFixed(2)),
      width: Number(r.width.toFixed(2)),
      height: Number(r.height.toFixed(2)),
      tamanho: getComputedStyle(elemento).fontSize,
    };
  });
  const fundo = await pixels(pagina, await alvo.screenshot());
  return [
    ["aceso", 1],
    ["apagado", 0.56],
  ].map(([estado, alfa]) => {
    let pior = { razao: Infinity, fundo: null, tintaEfetiva: null };
    for (let i = 0; i < fundo.data.length; i += 4) {
      const bg = fundo.data.slice(i, i + 3);
      const fg = alfa < 1 ? compor(tinta, alfa, bg) : tinta;
      const razao = contraste(fg, bg);
      if (razao < pior.razao) pior = { razao, fundo: bg, tintaEfetiva: fg };
    }
    return {
      nome: `${nome} — ${estado}`,
      seletor,
      piso,
      tamanho: retangulo.tamanho,
      tintaBase: tinta,
      alfaEfetivo: alfa,
      piorFundo: pior.fundo,
      tintaEfetivaNoPiorFundo: pior.tintaEfetiva,
      contrasteCalculado: Number(pior.razao.toFixed(2)),
      passa: pior.razao >= piso,
      proveniencia:
        "retângulo do próprio alvo; toda tinta da lista, ícones, divisórias, curvas, malha e trilho ocultos; .impact-valor sem background-image e filter",
      retangulo: {
        x: retangulo.x,
        y: retangulo.y,
        width: retangulo.width,
        height: retangulo.height,
      },
    };
  });
}

const desktop = await abrir({ width: 1440, height: 900 });
await desktop.screenshot({
  path: fileURLToPath(new URL(`${fase}-1440x900.png`, pasta)),
});
if (process.env.SOMENTE_CAPTURAS === "1") {
  await desktop.close();
  const mobileCaptura = await abrir({ width: 390, height: 844 });
  await mobileCaptura.screenshot({
    path: fileURLToPath(new URL(`${fase}-390x844.png`, pasta)),
  });
  await mobileCaptura.close();
  await navegador.close();
  console.log("Capturas desktop e mobile regravadas.");
  process.exit(0);
}

const desktopDados = await desktop.evaluate(() => {
  const lista = document.querySelector(".impact-lista");
  const itens = [...document.querySelectorAll(".impact-item")];
  const pontos = [...document.querySelectorAll(".impact-trilho-ponto")];
  const painel = document.querySelector(".impact-track");
  const secao = document.querySelector("#resultados");
  if (!lista || !painel || !secao || itens.length !== 7 || pontos.length !== 7) return null;
  const centroX = (elemento) => {
    const r = elemento.getBoundingClientRect();
    return r.left + r.width / 2;
  };
  const r = painel.getBoundingClientRect();
  return {
    alinhamentos: itens.map((item, i) => ({
      celula: Number(centroX(item).toFixed(2)),
      ponto: Number(centroX(pontos[i]).toFixed(2)),
      delta: Number(Math.abs(centroX(item) - centroX(pontos[i])).toFixed(2)),
    })),
    hover: {
      acesa: {
        antes: getComputedStyle(itens[0]).transform,
        durante: null,
        opacidade: getComputedStyle(itens[0]).opacity,
      },
      apagadaForcada: { antes: null, durante: null, opacidade: null },
    },
    painel: {
      left: Number(r.left.toFixed(2)),
      right: Number(r.right.toFixed(2)),
      width: Number(r.width.toFixed(2)),
      borderRadius: getComputedStyle(painel).borderRadius,
      background: getComputedStyle(painel).background,
    },
    nevoaSuperior: getComputedStyle(secao, "::before").backgroundImage,
    nevoaSuperiorOpacidade: getComputedStyle(secao, "::before").opacity,
    larguraDocumento: document.documentElement.scrollWidth,
    larguraViewport: innerWidth,
  };
});

await desktop.locator(".impact-item").first().hover();
await desktop.waitForTimeout(550);
if (desktopDados) {
  desktopDados.hover.acesa.durante = await desktop
    .locator(".impact-item")
    .first()
    .evaluate((item) => getComputedStyle(item).transform);
  await desktop.mouse.move(0, 0);
  const ultima = desktop.locator(".impact-item").last();
  await ultima.evaluate((item) => {
    item.closest(".impact-lista")?.setAttribute("data-observando", "1");
    item.setAttribute("data-aceso", "nao");
  });
  await desktop.waitForTimeout(950);
  desktopDados.hover.apagadaForcada.antes = await ultima.evaluate(
    (item) => getComputedStyle(item).transform,
  );
  await ultima.hover();
  await desktop.waitForTimeout(550);
  desktopDados.hover.apagadaForcada.durante = await ultima.evaluate(
    (item) => getComputedStyle(item).transform,
  );
  desktopDados.hover.apagadaForcada.opacidade = await ultima.evaluate(
    (item) => getComputedStyle(item).opacity,
  );
  await desktop.mouse.move(0, 0);
  await desktop.waitForTimeout(550);
}

/* Isola a superfície e compara o mesmo recorte com a imagem visível e escondida:
   diferença zero denunciaria navy chapado; diferença real prova a arte por trás. */
await desktop.addStyleTag({ content: limparPainel });
const painel = desktop.locator(".impact-track");
const painelComArte = await pixels(desktop, await painel.screenshot());
const esconderImagem = await desktop.addStyleTag({
  content: ".impact-fundo{visibility:hidden!important}",
});
const painelSemArte = await pixels(desktop, await painel.screenshot());
await esconderImagem.evaluate((e) => e.remove());
let alterados = 0;
let somaDelta = 0;
let maiorDelta = 0;
const cores = new Set();
for (let i = 0; i < painelComArte.data.length; i += 4) {
  const atual = painelComArte.data.slice(i, i + 3);
  const semArte = painelSemArte.data.slice(i, i + 3);
  const delta = atual.reduce((soma, canal, k) => soma + Math.abs(canal - semArte[k]), 0);
  if (delta > 3) alterados++;
  somaDelta += delta / 3;
  maiorDelta = Math.max(maiorDelta, ...atual.map((canal, k) => Math.abs(canal - semArte[k])));
  cores.add(atual.join(","));
}
if (desktopDados) {
  desktopDados.arteDentroDoPainel = {
    metodo:
      "mesmo recorte de .impact-track, grafismos internos ocultos, comparado com .impact-fundo visível e visibility:hidden",
    pixels: painelComArte.width * painelComArte.height,
    pixelsAlterados: alterados,
    percentualAlterado: Number(
      ((alterados / (painelComArte.width * painelComArte.height)) * 100).toFixed(2),
    ),
    deltaRgbMedio: Number(
      (somaDelta / (painelComArte.width * painelComArte.height)).toFixed(2),
    ),
    maiorDeltaPorCanal: maiorDelta,
    coresDistintasComArte: cores.size,
  };
}

const contrastes = [];
for (let i = 1; i <= 7; i++) {
  contrastes.push(
    ...(await medirContraste(
      desktop,
      `.impact-item:nth-child(${i}) .impact-rotulo`,
      `rótulo ${i} (16px)`,
      [248, 250, 252],
      4.5,
    )),
    ...(await medirContraste(
      desktop,
      `.impact-item:nth-child(${i}) .impact-valor`,
      `número ${i} (ponta escura do degradê)`,
      [127, 230, 255],
      3,
    )),
  );
}

async function medirReduceNaPagina(canal) {
  await desktop.emulateMedia({
    reducedMotion: canal === "sistema" ? "reduce" : "no-preference",
  });
  await desktop.evaluate((usarAtributo) => {
    if (usarAtributo) document.documentElement.dataset.motion = "reduce";
    else delete document.documentElement.dataset.motion;
  }, canal === "atributo");
  const item = desktop.locator(".impact-item").last();
  await item.evaluate((elemento) => {
    elemento.closest(".impact-lista")?.setAttribute("data-observando", "1");
    elemento.setAttribute("data-aceso", "nao");
  });
  await item.hover();
  await desktop.waitForTimeout(100);
  return item.evaluate((elemento) => getComputedStyle(elemento).transform);
}

const reducedMotion = {
  sistema: await medirReduceNaPagina("sistema"),
  atributo: await medirReduceNaPagina("atributo"),
};
await desktop.evaluate(() => {
  delete document.documentElement.dataset.motion;
});
await desktop.emulateMedia({ reducedMotion: "no-preference", forcedColors: "active" });
const forcedColors = await desktop.evaluate(() => ({
  imagemDisplay: getComputedStyle(document.querySelector(".impact-fundo")).display,
  painelBackground: getComputedStyle(document.querySelector(".impact-track")).backgroundColor,
}));
await desktop.close();

const mobile = await abrir({ width: 390, height: 844 });
await mobile.screenshot({
  path: fileURLToPath(new URL(`${fase}-390x844.png`, pasta)),
});
const mobileDados = await mobile.evaluate(() => {
  const painelMobile = document.querySelector(".impact-track");
  const lista = document.querySelector(".impact-lista");
  const trilho = document.querySelector(".impact-trilho");
  return {
    colunas: lista ? getComputedStyle(lista).gridTemplateColumns : null,
    pontos: document.querySelectorAll(".impact-trilho-ponto").length,
    trilhoDisplay: trilho ? getComputedStyle(trilho).display : null,
    larguraPainel: painelMobile?.getBoundingClientRect().width ?? null,
    larguraDocumento: document.documentElement.scrollWidth,
    larguraViewport: innerWidth,
  };
});
await mobile.close();

const resultado = {
  fase,
  desktop: desktopDados,
  mobile: mobileDados,
  reducedMotion,
  forcedColors,
};
const relatorioContraste = {
  fase,
  viewport: "1440x900",
  metodo: "docs/medidas/COMO-MEDIR-CONTRASTE.md",
  resultados: contrastes,
  todosPassam: contrastes.every((item) => item.passa),
};
await writeFile(new URL(`${fase}.json`, pasta), JSON.stringify(resultado, null, 2));
await writeFile(new URL("contraste.json", pasta), JSON.stringify(relatorioContraste, null, 2));
console.log(JSON.stringify({ ...resultado, contraste: relatorioContraste }, null, 2));
await navegador.close();
