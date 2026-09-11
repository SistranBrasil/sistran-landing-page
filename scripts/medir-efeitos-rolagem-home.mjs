/**
 * SIS-195 — sonda da cascata de logos e da semântica
 * `toggleActions: play none none reverse`.
 *
 * Rodar com a build de produção no ar:
 *   npx next start -p 3999
 *   node scripts/medir-efeitos-rolagem-home.mjs
 */
import { chromium } from "file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs";

const BASE = process.env.BASE_URL ?? "http://localhost:3999";
const LARGURAS = [1440, 390];
const navegador = await chromium.launch();
const resultados = [];
const falhas = [];

function conferir(condicao, mensagem) {
  if (!condicao) falhas.push(mensagem);
}

async function lerEstado(pagina) {
  return pagina.evaluate(() => {
    const logos = [...document.querySelectorAll("[data-logo]")];
    const imagens = [...document.querySelectorAll(".marcas-grade-celula img")];
    const grade = document.querySelector(".marcas-grade-malha");
    const titulo = document.querySelector(".marcas-grade-titulo");
    const primeira = logos[0];
    const ultima = logos.at(-1);
    const escopo = primeira?.closest("[data-in]");

    const lerTransicao = (el) => {
      const css = getComputedStyle(el);
      return {
        propriedade: css.transitionProperty,
        duracao: css.transitionDuration,
        delay: css.transitionDelay,
      };
    };

    const y = (el) => {
      const valor = getComputedStyle(el).transform;
      return valor === "none" ? 0 : new DOMMatrixReadOnly(valor).m42;
    };

    return {
      logos: logos.length,
      celulas: document.querySelectorAll(".marcas-grade-celula").length,
      colunas: grade
        ? getComputedStyle(grade).gridTemplateColumns.split(" ").length
        : 0,
      tituloAntes:
        Boolean(titulo && grade) &&
        Boolean(titulo.compareDocumentPosition(grade) & Node.DOCUMENT_POSITION_FOLLOWING),
      ordem: imagens.map((img) => img.alt),
      objectFitTodosContain: imagens.every(
        (img) => getComputedStyle(img).objectFit === "contain",
      ),
      imagemTransicao: imagens[0] ? lerTransicao(imagens[0]) : null,
      dataIn: escopo?.dataset.in ?? null,
      opacidadeMin: logos.length
        ? Math.min(...logos.map((logo) => Number(getComputedStyle(logo).opacity)))
        : null,
      primeira: primeira
        ? { ...lerTransicao(primeira), transformY: y(primeira) }
        : null,
      ultima: ultima
        ? { ...lerTransicao(ultima), transformY: y(ultima) }
        : null,
    };
  });
}

async function medirNormal(largura) {
  const contexto = await navegador.newContext({
    viewport: { width: largura, height: 900 },
    reducedMotion: "no-preference",
  });
  const pagina = await contexto.newPage();
  await pagina.goto(BASE, { waitUntil: "domcontentloaded" });
  await pagina.waitForTimeout(1200);
  await pagina.evaluate(() => window.scrollTo(0, 0));
  await pagina.waitForFunction(
    () => document.querySelector("[data-logo]")?.closest("[data-in]")?.dataset.in === "false",
  );
  /* A hidratação parte do HTML visível e arma o estado inicial sem JS; aguarda
     essa convergência antes de medir os 24/16px, para não colher a transição de
     preparação pela metade. */
  await pagina.waitForTimeout(4100);

  const inicial = await lerEstado(pagina);

  await pagina.evaluate(() => {
    window.__sis195Timeline = [];
    const logos = [...document.querySelectorAll("[data-logo]")];
    [logos[0], logos.at(-1)].forEach((logo, posicao) => {
      for (const tipo of ["transitionstart", "transitionend"]) {
        logo.addEventListener(tipo, (evento) => {
          if (evento.propertyName !== "transform") return;
          window.__sis195Timeline.push({
            logo: posicao === 0 ? "primeira" : "ultima",
            tipo,
            tempo: performance.now(),
            duracaoDecorrida: evento.elapsedTime * 1000,
          });
        });
      }
    });
  });

  await pagina.evaluate(() =>
    document.querySelector(".marcas-grade-campo")?.scrollIntoView({ block: "center" }),
  );
  await pagina.waitForFunction(
    () => document.querySelector("[data-logo]")?.closest("[data-in]")?.dataset.in === "true",
  );
  await pagina.waitForTimeout(4100);

  const finalEntrada = await lerEstado(pagina);
  const timelineEntrada = await pagina.evaluate(() => window.__sis195Timeline);
  await pagina.locator(".marcas-grade-celula").first().hover();
  await pagina.waitForTimeout(450);
  const hover = await pagina.evaluate(() => {
    const celula = document.querySelector(".marcas-grade-celula");
    const imagem = celula?.querySelector("img");
    const cssCelula = celula ? getComputedStyle(celula) : null;
    const cssImagem = imagem ? getComputedStyle(imagem) : null;
    return {
      filtro: cssImagem?.filter ?? null,
      opacidade: cssImagem ? Number(cssImagem.opacity) : null,
      fundo: cssCelula?.backgroundColor ?? null,
      sombra: cssCelula?.boxShadow ?? null,
    };
  });
  await pagina.mouse.move(0, 0);
  const eventosAntesRodape = timelineEntrada.length;

  await pagina.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await pagina.waitForTimeout(500);
  const rodape = await lerEstado(pagina);

  /* Oscilar no trecho abaixo da seção não pode rearmar nem repetir a cascata. */
  await pagina.evaluate(() => window.scrollBy(0, -180));
  await pagina.waitForTimeout(180);
  await pagina.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await pagina.waitForTimeout(500);
  const rodapeAposOscilacao = await lerEstado(pagina);
  const eventosAposOscilacao = await pagina.evaluate(
    () => window.__sis195Timeline.length,
  );

  /* Só voltar acima do gatilho deve escrever `data-in=false` e iniciar reverse.
     A subida é amostrada em passos porque um salto programático do rodapé ao
     topo pode pular a seção inteira entre dois frames; isso não representa uma
     rolagem e não produz cruzamento observável para IntersectionObserver. */
  await pagina.evaluate(async () => {
    for (let y = window.scrollY; y > 0; y -= 400) {
      window.scrollTo(0, y);
      await new Promise((resolver) => window.setTimeout(resolver, 20));
    }
    window.scrollTo(0, 0);
  });
  await pagina.waitForFunction(
    () => document.querySelector("[data-logo]")?.closest("[data-in]")?.dataset.in === "false",
  );
  const acimaDuranteReverse = await lerEstado(pagina);
  await pagina.waitForTimeout(4100);
  const acimaFinal = await lerEstado(pagina);

  /* Também cobre navegação "voltar ao topo", que pode saltar a seção inteira
     entre dois frames e não gera cruzamento intermediário no observador. */
  await pagina.evaluate(() =>
    document.querySelector(".marcas-grade-campo")?.scrollIntoView({ block: "center" }),
  );
  await pagina.waitForFunction(
    () => document.querySelector("[data-logo]")?.closest("[data-in]")?.dataset.in === "true",
  );
  await pagina.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await pagina.waitForTimeout(100);
  await pagina.evaluate(() => window.scrollTo(0, 0));
  await pagina.waitForTimeout(100);
  const saltoAcima = await lerEstado(pagina);

  const evento = (logo, tipo) =>
    timelineEntrada.find((item) => item.logo === logo && item.tipo === tipo);
  const inicioPrimeira = evento("primeira", "transitionstart");
  const inicioUltima = evento("ultima", "transitionstart");
  const fimPrimeira = evento("primeira", "transitionend");
  const fimUltima = evento("ultima", "transitionend");

  const temporal = {
    inicioPrimeiraMs: inicioPrimeira?.tempo ?? null,
    inicioUltimaMs: inicioUltima?.tempo ?? null,
    diferencaInicioMs:
      inicioPrimeira && inicioUltima
        ? Math.round(inicioUltima.tempo - inicioPrimeira.tempo)
        : null,
    duracaoPrimeiraMs: fimPrimeira?.duracaoDecorrida ?? null,
    duracaoUltimaMs: fimUltima?.duracaoDecorrida ?? null,
    diferencaFimMs:
      fimPrimeira && fimUltima
        ? Math.round(fimUltima.tempo - fimPrimeira.tempo)
        : null,
  };

  resultados.push({
    largura,
    inicial,
    temporal,
    finalEntrada,
    hover,
    rodape,
    rodapeAposOscilacao,
    eventosAntesRodape,
    eventosAposOscilacao,
    acimaDuranteReverse,
    acimaFinal,
    saltoAcima,
  });

  const deslocamentoEsperado = largura <= 640 ? 16 : 24;
  const duracaoEsperada = largura <= 640 ? "1.1s" : "2.4s";
  const delayFinalEsperado = largura <= 640 ? "0.84s" : "1.4s";
  conferir(inicial.logos === 15 && inicial.celulas === 15, `${largura}: não há 15 logos`);
  conferir(inicial.colunas === (largura <= 640 ? 3 : 5), `${largura}: geometria da grade mudou`);
  conferir(inicial.tituloAntes, `${largura}: título não precede a grade`);
  conferir(inicial.objectFitTodosContain, `${largura}: object-fit deixou de ser contain`);
  conferir(
    inicial.primeira.propriedade.split(", ").includes("transform"),
    `${largura}: transform ausente da transição computada`,
  );
  conferir(inicial.primeira.duracao.includes(duracaoEsperada), `${largura}: duração incorreta`);
  conferir(inicial.ultima.delay.includes(delayFinalEsperado), `${largura}: delay final incorreto`);
  conferir(
    Math.abs(inicial.primeira.transformY - deslocamentoEsperado) < 0.2,
    `${largura}: deslocamento inicial incorreto`,
  );
  conferir(
    finalEntrada.primeira.transformY === 0 && finalEntrada.ultima.transformY === 0,
    `${largura}: transform não chegou a zero`,
  );
  conferir(
    hover.filtro === "grayscale(0)" &&
      hover.opacidade === 1 &&
      hover.fundo !== "rgba(0, 0, 0, 0)" &&
      hover.sombra !== "none",
    `${largura}: hover azul/grayscale foi perdido`,
  );
  conferir(
    temporal.diferencaFimMs !== null &&
      temporal.diferencaFimMs >= (largura <= 640 ? 760 : 1300),
    `${largura}: primeira e última terminaram juntas`,
  );
  conferir(
    rodape.dataIn === "true" && rodape.opacidadeMin === 1,
    `${largura}: logos desapareceram no rodapé`,
  );
  conferir(
    rodapeAposOscilacao.dataIn === "true" &&
      eventosAposOscilacao === eventosAntesRodape,
    `${largura}: oscilação abaixo causou replay/flicker`,
  );
  conferir(acimaDuranteReverse.dataIn === "false", `${largura}: não reverteu acima`);
  conferir(saltoAcima.dataIn === "false", `${largura}: salto ao topo não reverteu`);
  conferir(
    Math.abs(acimaFinal.primeira.transformY - deslocamentoEsperado) < 0.2,
    `${largura}: reverse não voltou ao deslocamento inicial`,
  );

  await contexto.close();
}

async function medirEstadoFinalSemMovimento(largura, regime) {
  const contexto = await navegador.newContext({
    viewport: { width: largura, height: 900 },
    reducedMotion: regime === "sistema" ? "reduce" : "no-preference",
  });
  if (regime === "atributo") {
    await contexto.addInitScript(() => {
      localStorage.setItem("sistran-motion-preference", "reduce");
    });
  }
  const pagina = await contexto.newPage();
  await pagina.goto(BASE, { waitUntil: "domcontentloaded" });
  const estado = await lerEstado(pagina);
  conferir(
    estado.logos === 15 &&
      estado.opacidadeMin === 1 &&
      estado.primeira.transformY === 0,
    `${largura}/${regime}: estado reduzido não nasceu final`,
  );
  resultados.push({ largura, regime, primeiroPaint: estado });
  await contexto.close();
}

async function medirSemJavaScript(largura) {
  const contexto = await navegador.newContext({
    viewport: { width: largura, height: 900 },
    javaScriptEnabled: false,
  });
  const pagina = await contexto.newPage();
  await pagina.goto(BASE, { waitUntil: "domcontentloaded" });
  /* Sem JS, o CSS continua chegando pelo link da build; espera esse recurso
     antes de ler geometria e `object-fit`, não apenas a árvore HTML. */
  await pagina.waitForLoadState("load");
  const estado = await lerEstado(pagina);
  conferir(
    estado.logos === 15 &&
      estado.dataIn === null &&
      estado.opacidadeMin === 1 &&
      estado.primeira.transformY === 0,
    `${largura}/sem-js: SSR não ficou visível`,
  );
  resultados.push({ largura, regime: "sem-js", primeiroPaint: estado });
  await contexto.close();
}

for (const largura of LARGURAS) {
  await medirNormal(largura);
  await medirEstadoFinalSemMovimento(largura, "sistema");
  await medirEstadoFinalSemMovimento(largura, "atributo");
  await medirSemJavaScript(largura);
}

await navegador.close();
console.log(JSON.stringify(resultados, null, 2));

if (falhas.length) {
  console.error("\nSIS-195 REPROVADA PELA SONDA:");
  falhas.forEach((falha) => console.error(`- ${falha}`));
  process.exitCode = 1;
} else {
  console.log("\nSIS-195: sonda aprovada em 1440px e 390px.");
}
