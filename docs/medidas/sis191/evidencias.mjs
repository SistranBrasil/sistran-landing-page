/* SIS-191 — evidencias visuais e de hidratacao da secao de Escritorios.

   DUAS COISAS QUE A SONDA NUMERICA (`auditar-escritorios.mjs`) NAO FAZ:

   1. CAPTURA O ESTADO BASELINE SEM REVERTER O CODIGO. O working tree tem outras
      frentes abertas (SIS-155/176/177/181), entao `git checkout` do arquivo nao
      é opcao. O baseline é reconstruido EM RUNTIME: `.section-py` valia
      `py-20 md:py-28 lg:py-32`, ou seja 8rem de padding-block a partir de
      1024px, e é exatamente isso que o `<style>` injetado devolve. Os 8rem = 128px
      batem com a diferenca medida de emenda (254,2 -> 126 em 1280; 289,6 -> 161,6
      em 1366; 287,1 -> 159,1 em 1440), o que confirma que o override reproduz o
      baseline e nao uma aproximacao dele.

   2. ENQUADRA A EMENDA. As capturas de pouso mostram o quadro util com o painel
      preso — nele a emenda esta ACIMA da janela e nao aparece. O quadro `emenda`
      posiciona o topo da `<section>` a 200px do alto da janela, e aí a faixa clara
      vazia entre a secao anterior e o primeiro conteudo é o que se ve.

   O bloco de hidratacao mede a troca `lista -> scroll`: quanto a caixa se mexe, se
   isso cai dentro da janela e o que o navegador registra como `layout-shift`. */
import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs";

const raiz = path.resolve("docs/medidas/sis191");
const ALVO = "http://localhost:3000/quem-somos";
const SECAO = 'section[aria-labelledby="escritorios"]';
/* O valor que `.section-py` entregava nestas larguras (lg:py-32). */
const PADDING_BASELINE = ".offices-section{padding-block:8rem !important}";

const arredondar = (valor) =>
  typeof valor === "number" ? Math.round(valor * 10) / 10 : valor;

const navegador = await chromium.launch();

async function abrir(viewport, estado, reducedMotion = "no-preference") {
  const contexto = await navegador.newContext({ viewport, reducedMotion });
  await contexto.addInitScript(() => {
    localStorage.setItem("sistran-motion-preference", "system");
    localStorage.setItem("sistran-motion-preference-seen", "1");
  });
  const pagina = await contexto.newPage();
  await pagina.goto(ALVO, { waitUntil: "domcontentloaded" });
  if (estado === "baseline") await pagina.addStyleTag({ content: PADDING_BASELINE });
  await pagina.waitForSelector(".os-palco");
  await pagina.waitForTimeout(1200);
  return { contexto, pagina };
}

/* Rolagem pelo Lenis, que governa esta pagina: `window.scrollTo` sozinho é
   desfeito pelo laco dele no quadro seguinte. */
async function rolarPara(pagina, alvo) {
  await pagina.evaluate((topo) => {
    document.documentElement.style.scrollBehavior = "auto";
    const lenis = window.__lenis;
    if (lenis) lenis.scrollTo(topo, { immediate: true });
    else window.scrollTo(0, topo);
  }, alvo);
  await pagina
    .waitForFunction((topo) => Math.abs(window.scrollY - topo) < 6, alvo, {
      timeout: 8000,
    })
    .catch(() => {});
  await pagina.waitForTimeout(1600);
}

const posicaoDaSecao = (pagina, recuo) =>
  pagina.evaluate(
    ({ seletor, folga }) => {
      const secao = document.querySelector(seletor);
      if (!secao) return 0;
      return secao.getBoundingClientRect().top + window.scrollY - folga;
    },
    { seletor: SECAO, folga: recuo },
  );

const fracaoDoPercurso = (pagina, fracao) =>
  pagina.evaluate((f) => {
    const trilha = document.querySelector(".os-trilha");
    const inner = document.querySelector(".os-inner");
    if (!trilha || !inner) return 0;
    const curso = Math.max(1, trilha.offsetHeight - inner.offsetHeight);
    return trilha.getBoundingClientRect().top + window.scrollY + curso * f;
  }, fracao);

/* O que cada quadro precisa provar, medido no proprio quadro capturado. */
const medirQuadro = (pagina) =>
  pagina.evaluate((seletor) => {
    const caixa = (sel) => document.querySelector(sel)?.getBoundingClientRect();
    const svg = caixa(".bm-mapa");
    const pais = caixa(".bm-pais");
    const olho = caixa(".os-olho");
    const secao = caixa(seletor);
    const header = caixa("header");
    const titulo = caixa("#escritorios");
    const abas = caixa(".os-abas");
    return {
      modo: document.querySelector(".os-palco")?.dataset.modo,
      ativa: document.querySelector(".os-palco")?.dataset.ativa ?? null,
      paddingSecao: getComputedStyle(document.querySelector(seletor)).paddingTop,
      emenda: olho && secao ? olho.top - secao.top : null,
      folgaTopoPais: pais && svg ? pais.top - svg.top : null,
      folgaEsquerdaPais: pais && svg ? pais.left - svg.left : null,
      paisVisivelNaJanela: pais
        ? pais.top >= 0 && pais.bottom <= window.innerHeight
        : null,
      headerBase: header?.bottom ?? null,
      tituloTopo: titulo?.top ?? null,
      abasTopo: abas?.top ?? null,
    };
  }, SECAO);

const relatorio = { capturas: [], hidratacao: [] };
/* `node evidencias.mjs hidratacao` mede só o bloco de hidratacao: as capturas
   levam ~90s e nao mudam quando o que se investiga é o primeiro quadro. */
const somenteHidratacao = process.argv[2] === "hidratacao";

for (const estado of somenteHidratacao ? [] : ["baseline", "depois"]) {
  const pasta = path.join(raiz, "capturas", estado);
  await fs.mkdir(pasta, { recursive: true });

  for (const [largura, altura] of [
    [1280, 760],
    [1366, 900],
    [1440, 900],
  ]) {
    const { contexto, pagina } = await abrir({ width: largura, height: altura }, estado);

    /* Quadro da EMENDA: o topo da secao a 200px do alto da janela. */
    await rolarPara(pagina, await posicaoDaSecao(pagina, 200));
    const medidaEmenda = await medirQuadro(pagina);
    const arquivoEmenda = path.join(pasta, `emenda-${largura}x${altura}.png`);
    await pagina.screenshot({ path: arquivoEmenda });
    relatorio.capturas.push({
      estado,
      quadro: "emenda",
      largura,
      altura,
      arquivo: arquivoEmenda,
      ...medidaEmenda,
    });

    /* Pouso de Pato Branco: o pais inteiro tem de caber no SVG. */
    await rolarPara(pagina, await fracaoDoPercurso(pagina, 0.125));
    const medidaPr = await medirQuadro(pagina);
    const arquivoPr = path.join(pasta, `scroll-${largura}x${altura}-pr.png`);
    await pagina.screenshot({ path: arquivoPr });
    relatorio.capturas.push({
      estado,
      quadro: "pouso-pr",
      largura,
      altura,
      arquivo: arquivoPr,
      ...medidaPr,
    });

    /* Sao Paulo em UMA largura representativa, para o par antes/depois. */
    if (largura === 1440) {
      await rolarPara(pagina, await fracaoDoPercurso(pagina, 0.875));
      const medidaSp = await medirQuadro(pagina);
      const arquivoSp = path.join(pasta, `scroll-${largura}x${altura}-sp.png`);
      await pagina.screenshot({ path: arquivoSp });
      relatorio.capturas.push({
        estado,
        quadro: "pouso-sp",
        largura,
        altura,
        arquivo: arquivoSp,
        ...medidaSp,
      });
    }

    await contexto.close();
  }

  /* Modo lista: abaixo de 1280 a cena é a lista completa, e é ela que tem de
     conservar o respiro vertical do `.section-py` antigo. */
  const { contexto, pagina } = await abrir({ width: 1279, height: 900 }, estado);
  await rolarPara(pagina, await posicaoDaSecao(pagina, 200));
  const medidaLista = await medirQuadro(pagina);
  const arquivoLista = path.join(pasta, "lista-1279x900.png");
  await pagina.screenshot({ path: arquivoLista });
  relatorio.capturas.push({
    estado,
    quadro: "lista",
    largura: 1279,
    altura: 900,
    arquivo: arquivoLista,
    ...medidaLista,
  });
  await contexto.close();
}

/* ── HIDRATACAO ────────────────────────────────────────────────────────────
   A cena nasce `dirigindo = false` (o `matchMedia` só é avaliado no efeito), e
   `:has(.os-trilha[data-modo="scroll"])` só casa depois disso. A pergunta é se os
   128px de padding que saem nesse instante produzem salto VISIVEL.
   Tres medidas respondem: o estado sem JavaScript (que é o mesmo do primeiro
   quadro), o estado hidratado, e o que o navegador registra como `layout-shift`
   com a pagina aberta no topo. */
for (const [largura, altura] of [
  [1440, 900],
  [1280, 760],
]) {
  const semJs = await navegador.newContext({
    viewport: { width: largura, height: altura },
    javaScriptEnabled: false,
  });
  const paginaSemJs = await semJs.newPage();
  /* `load`, e nao `domcontentloaded`: medido, a primeira versao desta sonda leu
     1440 com a folha ainda nao aplicada — padding 0px, secao de 11.382px e
     documento de 56.680px, ou seja o HTML cru. A espera pela folha de verdade é o
     `padding-inline` da `.os-trilha`, que só existe no CSS do projeto. */
  await paginaSemJs.goto(ALVO, { waitUntil: "load" });
  await paginaSemJs.waitForFunction(() => {
    const trilha = document.querySelector(".os-trilha");
    return trilha && getComputedStyle(trilha).paddingInlineStart !== "0px";
  });
  const antes = await paginaSemJs.evaluate((seletor) => {
    const secao = document.querySelector(seletor);
    const estilo = getComputedStyle(secao);
    const caixa = secao.getBoundingClientRect();
    return {
      modo: document.querySelector(".os-palco")?.dataset.modo,
      padding: estilo.paddingTop,
      alturaSecao: caixa.height,
      topoSecaoNoDocumento: caixa.top + window.scrollY,
      alturaDocumento: document.documentElement.scrollHeight,
    };
  }, SECAO);
  await semJs.close();

  const comJs = await navegador.newContext({
    viewport: { width: largura, height: altura },
  });
  await comJs.addInitScript(() => {
    localStorage.setItem("sistran-motion-preference", "system");
    localStorage.setItem("sistran-motion-preference-seen", "1");
    window.__deslocamentos = [];
    new PerformanceObserver((lista) => {
      for (const entrada of lista.getEntries()) {
        window.__deslocamentos.push({
          valor: entrada.value,
          entradaRecente: entrada.hadRecentInput,
          fontes: entrada.sources.map((fonte) => ({
            no: fonte.node?.nodeName ?? null,
            classe:
              typeof fonte.node?.className === "string"
                ? fonte.node.className
                : null,
          })),
        });
      }
    }).observe({ type: "layout-shift", buffered: true });
  });
  const paginaComJs = await comJs.newPage();
  await paginaComJs.goto(ALVO, { waitUntil: "domcontentloaded" });
  await paginaComJs.waitForSelector('.os-trilha[data-modo="scroll"]');
  await paginaComJs.waitForTimeout(2500);
  const depois = await paginaComJs.evaluate((seletor) => {
    const secao = document.querySelector(seletor);
    const estilo = getComputedStyle(secao);
    const caixa = secao.getBoundingClientRect();
    const deslocamentos = window.__deslocamentos ?? [];
    return {
      modo: document.querySelector(".os-palco")?.dataset.modo,
      padding: estilo.paddingTop,
      alturaSecao: caixa.height,
      topoSecaoNoDocumento: caixa.top + window.scrollY,
      alturaDocumento: document.documentElement.scrollHeight,
      janela: window.innerHeight,
      rolagem: window.scrollY,
      cls: deslocamentos
        .filter((item) => !item.entradaRecente)
        .reduce((soma, item) => soma + item.valor, 0),
      deslocamentos,
    };
  }, SECAO);
  await comJs.close();

  relatorio.hidratacao.push({
    largura,
    altura,
    semJavaScript: antes,
    hidratado: depois,
    /* O padding que sai na hidratacao contra o que a caixa toda muda no mesmo
       instante: é a proporcao que diz se os 128px sao o assunto ou o troco. */
    paddingQueSai: 128,
    variacaoDaSecao: depois.alturaSecao - antes.alturaSecao,
    /* Distancia entre a borda de baixo da janela (no topo da pagina, que é onde
       a hidratacao acontece) e o topo da secao. Positivo = fora da janela. */
    distanciaDaJanela: antes.topoSecaoNoDocumento - depois.janela,
  });
}

const normalizar = (valor) => {
  if (Array.isArray(valor)) return valor.map(normalizar);
  if (valor && typeof valor === "object") {
    return Object.fromEntries(
      Object.entries(valor).map(([chave, item]) => [chave, normalizar(item)]),
    );
  }
  return arredondar(valor);
};

const saida = normalizar(relatorio);
const arquivoSaida = somenteHidratacao ? "hidratacao.json" : "evidencias.json";
await fs.writeFile(
  path.join(raiz, arquivoSaida),
  `${JSON.stringify(saida, null, 2)}\n`,
);
console.log(JSON.stringify(saida, null, 2));
await navegador.close();
