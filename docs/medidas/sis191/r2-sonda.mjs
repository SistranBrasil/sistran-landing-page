/* SIS-191, segunda volta — SONDA DO QUADRO REAL.

   A primeira volta mediu a EMENDA (padding do wrapper) e concluiu que o mapa nao
   estava cortado. A usuaria recusou a entrega olhando a tela, e a captura dela
   mostra duas coisas que a sonda anterior nao perguntava:

   1. `ESCRITÓRIOS` DUAS VEZES, sobrepostas. O rotulo do item ativo do ScrollSpy
      (`nav` fixo na margem esquerda) pinta em cima do `.os-olho` e do titulo da
      coluna de leitura. Bounding box do rotulo x bounding box de cada no da
      coluna é o que prova.

   2. ALGO CORTADO. `paisCortadoSvg` da sonda anterior olhava so a silhueta do
      pais contra o `<svg>`; ela pode ter folga positiva e a composicao ainda
      estar errada, porque quem recorta a cena é o `overflow: clip` do PALCO, e o
      que ele corta é o CARTAO (que cresce com o conteudo) e os ROTULOS do mapa
      (que vivem fora da silhueta). Aqui se mede a caixa de cada um contra a caixa
      de conteudo de quem recorta, e nao a silhueta contra o SVG.

   Modo de uso: `node docs/medidas/sis191/r2-sonda.mjs antes|depois`. */
import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs";

const estado = process.argv[2] ?? "antes";
const raiz = path.resolve("docs/medidas/sis191");
const pasta = path.join(raiz, "capturas", `r2-${estado}`);
await fs.mkdir(pasta, { recursive: true });

const ALVO = "http://localhost:3000/quem-somos";
const SECAO = 'section[aria-labelledby="escritorios"]';

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

async function abrir(viewport, reducedMotion = "no-preference") {
  const contexto = await navegador.newContext({ viewport, reducedMotion });
  await contexto.addInitScript(() => {
    localStorage.setItem("sistran-motion-preference", "system");
    localStorage.setItem("sistran-motion-preference-seen", "1");
  });
  const pagina = await contexto.newPage();
  await pagina.goto(ALVO, { waitUntil: "domcontentloaded" });
  /* O overlay de dev do Next fica sobre a margem esquerda e sujaria a captura e
     a amostragem de pixel; ele nao existe em producao. */
  await pagina.addStyleTag({
    content:
      "nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button]{display:none!important}",
  });
  await pagina.waitForSelector(".os-palco");
  await pagina.waitForTimeout(1200);
  return { contexto, pagina };
}

/* O Lenis governa esta pagina: `window.scrollTo` sozinho é desfeito no quadro
   seguinte pelo laco dele. */
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

const topoDaSecao = (pagina, folga) =>
  pagina.evaluate(
    ({ sel, recuo }) => {
      const secao = document.querySelector(sel);
      if (!secao) return 0;
      return secao.getBoundingClientRect().top + window.scrollY - recuo;
    },
    { sel: SECAO, recuo: folga },
  );

/* O que o quadro tem de provar, medido no proprio quadro. */
const medir = (pagina) =>
  pagina.evaluate(() => {
    const caixa = (sel, raiz = document) => {
      const el = raiz.querySelector(sel);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { top: r.top, right: r.right, bottom: r.bottom, left: r.left };
    };

    /* Caixa de CONTEUDO de quem recorta: a borda do `overflow: clip` desconta o
       padding, e é por dentro dele que o cartao tem de caber. */
    const conteudo = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const e = getComputedStyle(el);
      const p = (nome) => parseFloat(e.getPropertyValue(nome)) || 0;
      return {
        top: r.top + p("padding-top"),
        right: r.right - p("padding-right"),
        bottom: r.bottom - p("padding-bottom"),
        left: r.left + p("padding-left"),
      };
    };

    const folgas = (alvo, limite) =>
      alvo && limite
        ? {
            topo: alvo.top - limite.top,
            direita: limite.right - alvo.right,
            base: limite.bottom - alvo.bottom,
            esquerda: alvo.left - limite.left,
          }
        : null;
    const cortado = (f) => (f ? Object.values(f).some((v) => v < -0.5) : null);

    const palco = document.querySelector(".os-palco");
    const svg = caixa(".bm-mapa");
    const colunaMapa = caixa(".os-mapa");
    const palcoConteudo = conteudo(".os-palco");
    const ativa = palco?.dataset.ativa ?? null;
    const cartao = ativa ? caixa(`.os-painel[data-cidade="${ativa}"]`) : null;

    /* UNIAO das caixas de tudo que o SVG desenha dentro da camera: silhueta,
       divisas, rota, pinos, halos e ROTULOS. `.bm-pais` sozinho mente — os
       rotulos e os halos moram fora da silhueta e sao eles que encostam. */
    const desenhos = [
      ...document.querySelectorAll(
        ".bm-camera .bm-pais, .bm-camera .bm-latam-contorno, .bm-camera .bm-rotulo, .bm-camera .bm-halo, .bm-camera .bm-chamadas path",
      ),
    ].map((el) => el.getBoundingClientRect());
    const uniao = desenhos.length
      ? {
          top: Math.min(...desenhos.map((d) => d.top)),
          right: Math.max(...desenhos.map((d) => d.right)),
          bottom: Math.max(...desenhos.map((d) => d.bottom)),
          left: Math.min(...desenhos.map((d) => d.left)),
        }
      : null;

    /* O rotulo do item ATIVO do ScrollSpy, que é o que a captura da usuaria
       mostra pintado sobre o titulo. `opacity` entra na conta: abaixo de 1440 a
       regra da SIS-170 o apaga em repouso, e apagado ele nao sobrepoe nada. */
    const linkAtivo = document.querySelector('nav a[aria-current="true"]');
    const rotulo = linkAtivo?.querySelector(".scrollspy-rotulo");
    const rotuloVisivel = rotulo
      ? Number(getComputedStyle(rotulo).opacity) > 0.05
      : false;
    const rotuloCaixa = rotulo ? rotulo.getBoundingClientRect() : null;
    /* Tinta, e nao caixa: `whitespace-nowrap` + `letter-spacing` deixam a caixa
       com um rastro do tracking no fim, e o que sobrepoe é a letra. */
    const tinta = rotulo
      ? (() => {
          const faixa = document.createRange();
          faixa.selectNodeContents(rotulo);
          const r = faixa.getBoundingClientRect();
          faixa.detach?.();
          return { top: r.top, right: r.right, bottom: r.bottom, left: r.left };
        })()
      : null;

    const colisao = (alvo) => {
      if (!tinta || !alvo || !rotuloVisivel) return null;
      const h = Math.min(tinta.right, alvo.right) - Math.max(tinta.left, alvo.left);
      const v = Math.min(tinta.bottom, alvo.bottom) - Math.max(tinta.top, alvo.top);
      return {
        horizontal: h,
        vertical: v,
        sobrepoe: h > 0.5 && v > 0.5,
      };
    };

    const olho = caixa(".os-olho");
    const titulo = caixa("#escritorios");
    const abas = caixa(".os-abas");
    const coluna = caixa(".os-coluna");

    return {
      modo: palco?.dataset.modo ?? null,
      ativa,
      revelado: palco?.dataset.revelado ?? null,
      janela: { largura: window.innerWidth, altura: window.innerHeight },
      /* ── o que a coluna da esquerda ocupa, e onde o palco a recorta ─────── */
      colunaEsquerda: coluna?.left ?? null,
      cartaoVsPalco: folgas(cartao, palcoConteudo),
      cartaoCortado: cortado(folgas(cartao, palcoConteudo)),
      colunaVsPalco: folgas(coluna, palcoConteudo),
      colunaCortada: cortado(folgas(coluna, palcoConteudo)),
      /* ── o mapa: desenho inteiro contra o viewport do SVG e a coluna dele ── */
      desenhoVsSvg: folgas(uniao, svg),
      desenhoCortadoSvg: cortado(folgas(uniao, svg)),
      desenhoVsColuna: folgas(uniao, colunaMapa),
      desenhoCortadoColuna: cortado(folgas(uniao, colunaMapa)),
      paisVsSvg: folgas(caixa(".bm-pais"), svg),
      /* ── o rotulo do ScrollSpy contra a coluna de leitura ───────────────── */
      scrollSpy: {
        ativo: linkAtivo?.getAttribute("href") ?? null,
        visivel: rotuloVisivel,
        opacidade: rotulo ? getComputedStyle(rotulo).opacity : null,
        texto: rotulo?.textContent?.trim() ?? null,
        caixaDireita: rotuloCaixa?.right ?? null,
        tintaDireita: tinta?.right ?? null,
        sobreOlho: colisao(olho),
        sobreTitulo: colisao(titulo),
        sobreAbas: colisao(abas),
        sobreCartao: colisao(cartao),
        sobreColuna: colisao(coluna),
      },
      /* ── o cabecalho flutuante contra o primeiro texto da cena ─────────── */
      header: caixa("header"),
      headerSobreOlho: (() => {
        const h = caixa("header");
        return h && olho ? h.bottom - olho.top : null;
      })(),
      emenda: (() => {
        const secao = caixa('section[aria-labelledby="escritorios"]');
        return olho && secao ? olho.top - secao.top : null;
      })(),
    };
  });

const relatorio = { estado, quadros: [] };

for (const [largura, altura] of [
  [1280, 760],
  [1366, 768],
  [1440, 900],
  [1512, 860],
  [1920, 1080],
]) {
  const { contexto, pagina } = await abrir({ width: largura, height: altura });

  /* PRIMEIRO QUADRO: o topo da secao encostado no alto da janela, que é onde o
     sticky prende e o percurso comeca — o quadro que a captura da usuaria mostra. */
  await rolar(pagina, await topoDaSecao(pagina, 0));
  const primeiro = await medir(pagina);
  const arqPrimeiro = path.join(pasta, `primeiro-${largura}x${altura}.png`);
  await pagina.screenshot({ path: arqPrimeiro });
  relatorio.quadros.push({
    quadro: "primeiro",
    largura,
    altura,
    arquivo: path.basename(arqPrimeiro),
    ...primeiro,
  });

  /* POUSO DE PATO BRANCO, o centro do primeiro trecho. */
  await rolar(pagina, await fracao(pagina, 0.125));
  const pr = await medir(pagina);
  const arqPr = path.join(pasta, `pouso-pr-${largura}x${altura}.png`);
  await pagina.screenshot({ path: arqPr });
  relatorio.quadros.push({
    quadro: "pouso-pr",
    largura,
    altura,
    arquivo: path.basename(arqPr),
    ...pr,
  });

  /* POUSO DE SAO PAULO. */
  await rolar(pagina, await fracao(pagina, 0.875));
  const sp = await medir(pagina);
  const arqSp = path.join(pasta, `pouso-sp-${largura}x${altura}.png`);
  await pagina.screenshot({ path: arqSp });
  relatorio.quadros.push({
    quadro: "pouso-sp",
    largura,
    altura,
    arquivo: path.basename(arqSp),
    ...sp,
  });

  await contexto.close();
}

/* JANELA BAIXA e TELA ESTREITA: os dois caminhos que caem no modo lista, onde a
   cena tem de continuar completa e com o respiro vertical do wrapper. */
for (const caso of [
  { nome: "lista-1440x720", width: 1440, height: 720 },
  { nome: "lista-1279x900", width: 1279, height: 900 },
  {
    nome: "lista-reduced-1440x900",
    width: 1440,
    height: 900,
    reducedMotion: "reduce",
  },
]) {
  const { contexto, pagina } = await abrir(
    { width: caso.width, height: caso.height },
    caso.reducedMotion ?? "no-preference",
  );
  await rolar(pagina, await topoDaSecao(pagina, 120));
  const medida = await medir(pagina);
  const arquivo = path.join(pasta, `${caso.nome}.png`);
  await pagina.screenshot({ path: arquivo });
  const fichas = await pagina.evaluate(() =>
    [...document.querySelectorAll(".os-painel")].map((p) => {
      const e = getComputedStyle(p);
      return {
        id: p.dataset.cidade,
        opacidade: e.opacity,
        display: e.display,
        inert: p.hasAttribute("inert"),
        ariaHidden: p.getAttribute("aria-hidden"),
      };
    }),
  );
  const paddingSecao = await pagina.evaluate(
    (sel) => getComputedStyle(document.querySelector(sel)).paddingTop,
    SECAO,
  );
  relatorio.quadros.push({
    quadro: caso.nome,
    largura: caso.width,
    altura: caso.height,
    arquivo: path.basename(arquivo),
    paddingSecao,
    fichas,
    ...medida,
  });
  await contexto.close();
}

const saida = normalizar(relatorio);
await fs.writeFile(
  path.join(raiz, `r2-${estado}.json`),
  `${JSON.stringify(saida, null, 2)}\n`,
);
console.log(JSON.stringify(saida, null, 2));
await navegador.close();
