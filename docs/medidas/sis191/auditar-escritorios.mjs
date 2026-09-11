import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs";

const estado = process.argv[2] ?? "atual";
const raiz = path.resolve("docs/medidas/sis191");
const pastaCapturas = path.join(raiz, "capturas", estado);
await fs.mkdir(pastaCapturas, { recursive: true });

const navegador = await chromium.launch();
const resultados = { estado, scroll: [], lista: [] };

const arredondar = (valor) => Math.round(valor * 10) / 10;

async function abrir(viewport, reducedMotion = "no-preference") {
  const contexto = await navegador.newContext({ viewport, reducedMotion });
  await contexto.addInitScript(() => {
    localStorage.setItem("sistran-motion-preference", "system");
    localStorage.setItem("sistran-motion-preference-seen", "1");
  });
  const pagina = await contexto.newPage();
  await pagina.goto("http://localhost:3000/quem-somos", {
    waitUntil: "domcontentloaded",
  });
  await pagina.waitForSelector(".os-palco");
  await pagina.waitForTimeout(800);
  return { contexto, pagina };
}

async function pousar(pagina, fracao) {
  const topo = await pagina.evaluate((f) => {
    const trilha = document.querySelector(".os-trilha");
    const inner = document.querySelector(".os-inner");
    if (!trilha || !inner) return 0;
    const curso = Math.max(1, trilha.offsetHeight - inner.offsetHeight);
    const topo = trilha.getBoundingClientRect().top + window.scrollY + curso * f;
    document.documentElement.style.scrollBehavior = "auto";
    const lenis = window.__lenis;
    if (lenis) lenis.scrollTo(topo, { immediate: true });
    else window.scrollTo(0, topo);
    return topo;
  }, fracao);
  await pagina.waitForFunction(
    (alvo) => Math.abs(window.scrollY - alvo) < 5,
    topo,
    { timeout: 5000 },
  );
  await pagina.waitForTimeout(1500);
}

async function medirScroll(pagina, largura, altura, cidade) {
  return pagina.evaluate(
    ({ larguraAtual, alturaAtual, cidadeAtual }) => {
      const rect = (seletor) => document.querySelector(seletor)?.getBoundingClientRect();
      const svg = rect(".bm-mapa");
      const pais = rect(".bm-pais");
      const coluna = rect(".os-mapa");
      const cartao = rect(`.os-painel[data-cidade="${cidadeAtual}"]`);
      const header = rect("header");
      const titulo = rect("#escritorios");
      const abas = rect(".os-abas");
      const olho = rect(".os-olho");
      const secao = rect('section[aria-labelledby="escritorios"]');
      const folgas = (alvo, limite) => ({
        topo: alvo && limite ? alvo.top - limite.top : null,
        direita: alvo && limite ? limite.right - alvo.right : null,
        base: alvo && limite ? limite.bottom - alvo.bottom : null,
        esquerda: alvo && limite ? alvo.left - limite.left : null,
      });
      const paisSvg = folgas(pais, svg);
      const paisColuna = folgas(pais, coluna);
      return {
        largura: larguraAtual,
        altura: alturaAtual,
        cidade: cidadeAtual,
        modo: document.querySelector(".os-palco")?.dataset.modo,
        ativa: document.querySelector(".os-palco")?.dataset.ativa,
        paisVsSvg: paisSvg,
        paisVsColuna: paisColuna,
        paisCortadoSvg: Object.values(paisSvg).some((valor) => valor < 0),
        paisCortadoColuna: Object.values(paisColuna).some((valor) => valor < 0),
        faixaLivreCartao:
          pais && cartao ? Math.max(0, cartao.left - pais.right) : null,
        emendaAtePrimeiroQuadro:
          olho && secao ? olho.top - secao.top : null,
        header: header && { topo: header.top, base: header.bottom },
        titulo: titulo && { topo: titulo.top, base: titulo.bottom },
        abas: abas && { topo: abas.top, base: abas.bottom },
        headerCobreTitulo: Boolean(header && titulo && header.bottom > titulo.top),
        headerCobreAbas: Boolean(header && abas && header.bottom > abas.top),
      };
    },
    { larguraAtual: largura, alturaAtual: altura, cidadeAtual: cidade },
  );
}

for (const [largura, altura] of [
  [1280, 760],
  [1366, 900],
  [1440, 900],
]) {
  const { contexto, pagina } = await abrir({ width: largura, height: altura });
  await pousar(pagina, 0);
  const emenda = await pagina.evaluate(() => {
    const olho = document.querySelector(".os-olho")?.getBoundingClientRect();
    const secao = document
      .querySelector('section[aria-labelledby="escritorios"]')
      ?.getBoundingClientRect();
    return olho && secao ? olho.top - secao.top : null;
  });
  await pousar(pagina, 0.125);
  await pagina.waitForTimeout(2500);
  const pr = await medirScroll(pagina, largura, altura, "pr");
  pr.emendaAtePrimeiroQuadro = emenda;
  resultados.scroll.push(pr);
  if (largura === 1440) {
    await pagina.screenshot({
      path: path.join(pastaCapturas, "scroll-1440x900-pr.png"),
      fullPage: false,
    });
  }

  await pousar(pagina, 0.875);
  const sp = await medirScroll(pagina, largura, altura, "sp");
  resultados.scroll.push(sp);
  if (largura === 1440) {
    await pagina.screenshot({
      path: path.join(pastaCapturas, "scroll-1440x900-sp.png"),
      fullPage: false,
    });
  }
  await contexto.close();
}

for (const cenario of [
  { nome: "largura-1279", width: 1279, height: 900, reducedMotion: "no-preference" },
  { nome: "altura-759", width: 1440, height: 759, reducedMotion: "no-preference" },
  { nome: "movimento-reduzido", width: 1440, height: 900, reducedMotion: "reduce" },
]) {
  const { contexto, pagina } = await abrir(
    { width: cenario.width, height: cenario.height },
    cenario.reducedMotion,
  );
  await pagina.locator('section[aria-labelledby="escritorios"]').evaluate((elemento) => {
    const topo = elemento.getBoundingClientRect().top + window.scrollY;
    const lenis = window.__lenis;
    if (lenis) lenis.scrollTo(topo, { immediate: true });
    else window.scrollTo({ top: topo, behavior: "instant" });
  });
  await pagina.waitForTimeout(700);
  const medida = await pagina.evaluate((nome) => {
    const visivel = (elemento) => {
      const estilo = getComputedStyle(elemento);
      const caixa = elemento.getBoundingClientRect();
      return estilo.display !== "none" && estilo.visibility !== "hidden" && caixa.height > 0;
    };
    const svg = document.querySelector(".bm-mapa")?.getBoundingClientRect();
    const pais = document.querySelector(".bm-pais")?.getBoundingClientRect();
    const paineis = [...document.querySelectorAll(".os-painel")];
    return {
      cenario: nome,
      modo: document.querySelector(".os-palco")?.dataset.modo,
      cidades: paineis.map((painel) => ({
        id: painel.dataset.cidade,
        visivel: visivel(painel),
        ariaHidden: painel.getAttribute("aria-hidden"),
        inert: painel.hasAttribute("inert"),
        titulo: painel.querySelector("h3")?.textContent?.trim(),
      })),
      paisVsSvg:
        svg && pais
          ? {
              topo: pais.top - svg.top,
              direita: svg.right - pais.right,
              base: svg.bottom - pais.bottom,
              esquerda: pais.left - svg.left,
            }
          : null,
    };
  }, cenario.nome);
  resultados.lista.push(medida);
  if (cenario.nome === "largura-1279") {
    await pagina.screenshot({
      path: path.join(pastaCapturas, "lista-1279x900.png"),
      fullPage: false,
    });
  }
  await contexto.close();
}

const normalizar = (valor) => {
  if (Array.isArray(valor)) return valor.map(normalizar);
  if (valor && typeof valor === "object") {
    return Object.fromEntries(Object.entries(valor).map(([chave, item]) => [chave, normalizar(item)]));
  }
  return typeof valor === "number" ? arredondar(valor) : valor;
};

const saida = normalizar(resultados);
await fs.writeFile(
  path.join(raiz, `medidas-${estado}.json`),
  `${JSON.stringify(saida, null, 2)}\n`,
);
console.log(JSON.stringify(saida, null, 2));
await navegador.close();
