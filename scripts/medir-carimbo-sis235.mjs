/**
 * SIS-235 — sonda do CARIMBO «Realizado pela Sistran» nos cartões `proprio`.
 *
 * A issue pede duas coisas que só um número resolve: "legível" e "sem dominar o
 * título". O carimbo entra no lugar de um chip de ~22px de altura; se ele vier com
 * 80px, os ~60px de diferença saem de algum lugar DENTRO do cartão, e o cartão é
 * `max-height: 100%` com a arte em `aspect-ratio: 16/9` como único item flexível.
 * Quem paga é a ARTE. Essa é a mesma escassez vertical que a SIS-232 mediu na
 * faixa, agora dentro do cartão — e é por isso que esta sonda mede o ANTES.
 *
 * O que ela mede, e por que cada coisa:
 *
 *   1. SELO — caixa do carimbo (ou do chip, no `antes`). É o número de "legível":
 *      largura em px, e a razão contra a largura do cartão.
 *   2. TÍTULO — caixa e `font-size` do `h3`. "Sem dominar o título" é a razão
 *      altura-do-selo / altura-do-título; um selo três vezes o título domina.
 *   3. ARTE — altura da `.eventos-destaque-arte`. É a conta que o `antes` existe
 *      para permitir: se a arte encolher, o carimbo foi cobrado da foto.
 *   4. TRANSBORDO — `scrollHeight` do cartão contra `clientHeight`. Cartão que
 *      transborda é o modo de falha real: o texto some por baixo, não "fica
 *      apertado".
 *   5. CAIXA DO PALCO — o cartão contra a seção, porque `100svh` é o teto.
 *   6. ACESSIBILIDADE — o texto acessível que sobra no lugar do selo. O critério da
 *      issue é que o leitor de tela continue anunciando «Realizado pela Sistran»;
 *      trocar texto por imagem é exatamente onde esse sentido se perde em silêncio.
 *      Medido como `innerText` + `alt` + `aria-label` do selo, concatenados.
 *
 * As janelas são as duas que a issue nomeia: 390 (carrossel estreito) e 1440
 * (palco). Em 390 o alvo é `.eventos-lista-item`; em 1440 é
 * `.eventos-destaque-cartao`. São markups diferentes para o mesmo selo, e a issue
 * pede os dois cobertos.
 *
 * O evento conferido é `web-summit-ai` (Web Summit AI), que a issue nomeia. Em 1440
 * o cartão mostra UM evento por vez, então a sonda navega até ele em vez de supor
 * que ele é o primeiro.
 *
 * `--modo=antes|depois` só muda o nome dos arquivos.
 */
import fs from "node:fs";
import { chromium } from "file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const ROTA = "/eventos-inovacao";
const SAIDA = "docs/medidas/carimbo-sis235";
const CAPTURAS = "docs/capturas";
const modo = (process.argv.find((a) => a.startsWith("--modo=")) ?? "--modo=antes").split("=")[1];

fs.mkdirSync(SAIDA, { recursive: true });
fs.mkdirSync(CAPTURAS, { recursive: true });

const JANELAS = [
  { w: 390, h: 844, alvo: "lista" },
  { w: 1440, h: 900, alvo: "palco" },
];

/* O título do evento `proprio` que a issue nomeia. A sonda casa por texto porque
   o `id` não chega ao DOM do cartão. */
const TITULO_PROPRIO = /web summit/i;

async function abrir(browser, largura, altura) {
  const contexto = await browser.newContext({
    viewport: { width: largura, height: altura },
    deviceScaleFactor: 1,
    reducedMotion: "no-preference",
  });
  const pagina = await contexto.newPage();
  await pagina.goto(`${BASE}${ROTA}`, { waitUntil: "networkidle", timeout: 120000 });

  /* ⚠️ O DIÁLOGO «Preferências de movimento» TEM DE SER FECHADO, e a primeira versão
     desta sonda não o fechava. Ela fazia `count()` logo depois do `networkidle` e
     seguia se não achasse nada — mas o diálogo monta DEPOIS disso. Resultado: as
     capturas saíram com o painel escuro cobrindo o meio do cartão, e o palco nem
     estava fixado, porque o diálogo prende a rolagem.
     Agora a espera é pelo botão EXISTIR, e depois pelo diálogo SUMIR. Se ele não
     aparecer em 8s, seguimos — pode ter sido dispensado por estado anterior. */
  const continuar = pagina.getByRole("button", { name: /continuar/i }).first();
  await continuar.waitFor({ state: "visible", timeout: 8000 }).catch(() => undefined);
  if (await continuar.isVisible().catch(() => false)) {
    await continuar.click({ timeout: 5000 }).catch(() => undefined);
    await continuar.waitFor({ state: "hidden", timeout: 8000 }).catch(() => undefined);
  }
  await pagina.waitForTimeout(1200);
  return { contexto, pagina };
}

/** Rola até a cena e espera a folha do componente valer (guarda herdada da SIS-232:
    medir antes disso devolve caixa sem `width` e número inventado). */
async function levarAoPalco(pagina) {
  await pagina.evaluate(() => {
    const palco = document.querySelector(".eventos-destaque") ?? document.querySelector(".eventos-lista");
    if (palco) palco.scrollIntoView({ block: "center", behavior: "instant" });
  });
  await pagina.waitForTimeout(1500);
}

/**
 * Em 1440 o palco mostra UM evento por vez, e quem escolhe é a sentinela
 * `[data-evento-i]` que estiver cruzando a linha do meio da janela — o observador de
 * `EventsSpotlight.tsx` usa `rootMargin: "-50% 0px -50% 0px"`.
 *
 * Então a sonda centra a sentinela do índice pedido, repetindo a conta do `irPara`
 * do componente (centro da sentinela no centro da janela) em vez de empurrar a roda.
 * A primeira versão empurrava `wheel` em passos de 260px esperando "cair" no evento
 * certo, e ela FALHOU de um jeito silencioso: `web-summit-ai` é o índice 0, o
 * `scrollIntoView` da seção já tinha passado dele, e a sonda mediu «AWS Summit São
 * Paulo» — um evento `global` — como se fosse o `proprio`. Um chip roxo de "Evento
 * global" contado como linha-base do carimbo.
 *
 * `window.scrollTo` e não `scrollIntoView`: a rota usa Lenis, que intercepta o
 * segundo (apuração na SIS-151, citada no componente).
 */
async function irParaEvento(pagina, i) {
  await pagina.evaluate((indice) => {
    const alvo = document.querySelector(`[data-evento-i="${indice}"]`);
    if (!alvo) return;
    const caixa = alvo.getBoundingClientRect();
    const y = window.scrollY + caixa.top + caixa.height / 2 - window.innerHeight / 2;
    window.scrollTo({ top: Math.max(0, Math.round(y)), behavior: "instant" });
  }, i);
  await pagina.waitForTimeout(900);
  /* Confirma que o cartão montado é o esperado. Sem isto a sonda volta a poder
     medir o evento errado sem avisar. */
  return pagina.evaluate((re) => {
    const t = document.querySelector(".eventos-destaque-cartao .eventos-destaque-cartao-titulo");
    return !!t && new RegExp(re, "i").test(t.textContent ?? "");
  }, TITULO_PROPRIO.source);
}

/* Índice de `web-summit-ai` em `src/data/events.json` — conferido, não suposto. */
const I_PROPRIO = 0;

const medir = (pagina, alvo) =>
  pagina.evaluate(
    ({ alvo, re }) => {
      const num = (v) => Math.round(v * 10) / 10;
      const caixa = (n) => {
        if (!n) return null;
        const r = n.getBoundingClientRect();
        return { x: num(r.x), y: num(r.y), w: num(r.width), h: num(r.height) };
      };

      /* O cartão: no palco é o único; na lista é o item cujo título casa. */
      let cartao = null;
      if (alvo === "palco") {
        cartao = document.querySelector(".eventos-destaque-cartao");
      } else {
        cartao = [...document.querySelectorAll(".eventos-lista-item")].find((li) =>
          new RegExp(re, "i").test(li.querySelector(".eventos-destaque-cartao-titulo")?.textContent ?? ""),
        );
      }
      if (!cartao) return { erro: `sem cartão para alvo=${alvo}` };

      const titulo = cartao.querySelector(".eventos-destaque-cartao-titulo");
      const arte = cartao.querySelector(".eventos-destaque-arte");
      /* O selo é o chip (antes) OU o carimbo (depois). A sonda aceita os dois para
         que antes/depois saiam do MESMO código. */
      const selo =
        cartao.querySelector(".eventos-carimbo") ?? cartao.querySelector(".eventos-destaque-chip");

      const seloCaixa = caixa(selo);
      const tituloCaixa = caixa(titulo);

      /* Texto que o leitor de tela alcança no selo. `innerText` pega texto visível e
         sr-only; `alt`/`aria-label` pegam o caso da imagem. */
      const textoAcessivel = selo
        ? [
            selo.innerText ?? "",
            selo.getAttribute("aria-label") ?? "",
            [...selo.querySelectorAll("img")].map((i) => i.getAttribute("alt") ?? "").join(" "),
          ]
            .join(" ")
            .replace(/\s+/g, " ")
            .trim()
        : null;

      const secao = document.querySelector(".eventos-destaque") ?? document.querySelector(".eventos-lista");

      /* ⚠️ "Existe palco" é medido pela CAIXA, não pelo seletor. Em 390 o
         `.eventos-destaque-palco` CONTINUA NA ÁRVORE — o CSS liga o palco ou o
         carrossel com `display: none`, de propósito, para manter o escondido fora da
         árvore de acessibilidade (a decisão está no cabeçalho do componente). Então
         `querySelector` acha o elemento e ele mede 0x0. A primeira versão desta sonda
         caiu nisso e imprimiu «palco 0x0: cartão PASSA 1193,6px do palco» em 390 —
         comparação contra uma caixa de altura zero, verdadeira e sem sentido. */
      const palcoVivo = () => {
        const p = document.querySelector(".eventos-destaque-palco");
        if (!p) return null;
        const r = p.getBoundingClientRect();
        return r.width > 0 && r.height > 0 ? p : null;
      };

      return {
        titulo: (titulo?.textContent ?? "").trim().slice(0, 40),
        tipoSelo: selo ? (selo.classList.contains("eventos-carimbo") ? "carimbo" : "chip") : null,
        selo: seloCaixa,
        seloFonteImagem: selo?.querySelector("img")?.getAttribute("src") ?? null,
        titulo_: tituloCaixa,
        tituloFs: titulo ? num(parseFloat(getComputedStyle(titulo).fontSize)) : null,
        /* "Sem dominar o título": razão das ALTURAS. */
        razaoSeloTitulo: seloCaixa && tituloCaixa ? num(seloCaixa.h / tituloCaixa.h) : null,
        /* "Legível": largura do selo contra a do cartão. */
        razaoSeloCartao: seloCaixa ? num(seloCaixa.w / cartao.getBoundingClientRect().width) : null,
        arte: caixa(arte),
        cartao: caixa(cartao),
        cartaoScrollH: num(cartao.scrollHeight),
        cartaoClientH: num(cartao.clientHeight),
        transborda: cartao.scrollHeight > cartao.clientHeight + 1,
        secao: caixa(secao),
        /* ENCAIXE NO PALCO. O carimbo é mais alto que o chip que ele substitui e o
           cartão cresce por baixo, então é preciso saber se ele ainda cabe.

           ⚠️ A pergunta é contra `.eventos-destaque-palco`, e NÃO contra a janela. A
           primeira versão comparava com `window.innerHeight` e acusou "PASSA 144px da
           dobra" em 1440 e "PASSA 405px" em 390 — nas duas o número era verdadeiro e
           a pergunta era errada. O palco é `position: sticky` de uma tela dentro de
           uma trilha de 8100px, e a sonda centra a SENTINELA: onde o cartão cai na
           janela naquele instante da rolagem depende do quanto o `sticky` já engatou,
           não do tamanho do cartão. Em 390 não há palco nenhum — é carrossel, e um
           item mais baixo que a página é o normal.
           O que reprova de verdade é o cartão não caber na CAIXA QUE O CONTÉM, porque
           é ela que o `max-height: 100%` limita. */
        janela: { w: num(window.innerWidth), h: num(window.innerHeight) },
        palco: caixa(palcoVivo()),
        cabeNoPalco: (() => {
          const p = palcoVivo();
          if (!p) return null; /* 390: não há palco vivo, o alvo é o carrossel */
          const pr = p.getBoundingClientRect();
          const cr = cartao.getBoundingClientRect();
          return cr.top >= pr.top - 1 && cr.bottom <= pr.bottom + 1;
        })(),
        sobraNoPalco: (() => {
          const p = palcoVivo();
          if (!p) return null;
          return num(cartao.getBoundingClientRect().bottom - p.getBoundingClientRect().bottom);
        })(),
        textoAcessivel,
        anunciaSentido: !!textoAcessivel && /realizado pela sistran/i.test(textoAcessivel),
      };
    },
    { alvo, re: TITULO_PROPRIO.source },
  );

const browser = await chromium.launch();
const relatorio = { modo, quando: new Date().toISOString(), janelas: [] };

for (const { w, h, alvo } of JANELAS) {
  const { contexto, pagina } = await abrir(browser, w, h);
  await levarAoPalco(pagina);
  if (alvo === "palco") {
    const achou = await irParaEvento(pagina, I_PROPRIO);
    if (!achou) throw new Error(`${w}x${h}: o cartão montado não é o evento proprio — medir aqui daria número de outro evento.`);
  }
  const medida = await medir(pagina, alvo);
  relatorio.janelas.push({ largura: w, altura: h, alvo, ...medida });

  await pagina.screenshot({ path: `${CAPTURAS}/sis235-carimbo-${w}x${h}-${modo}.png` });
  await contexto.close();
}

await browser.close();
fs.writeFileSync(`${SAIDA}/${modo}.json`, JSON.stringify(relatorio, null, 2));

console.log(`\nSIS-235 · ${modo}\n`);
for (const j of relatorio.janelas) {
  if (j.erro) {
    console.log(`${j.largura}x${j.altura} (${j.alvo})  ERRO: ${j.erro}`);
    continue;
  }
  console.log(`${j.largura}x${j.altura} (${j.alvo})  «${j.titulo}»  selo=${j.tipoSelo}`);
  console.log(
    `   selo ${j.selo?.w}x${j.selo?.h}px · selo/cartão=${j.razaoSeloCartao} · selo/título=${j.razaoSeloTitulo}` +
      (j.seloFonteImagem ? `\n   arte do selo: ${j.seloFonteImagem}` : ""),
  );
  console.log(`   título fs=${j.tituloFs}px caixa=${j.titulo_?.w}x${j.titulo_?.h} · arte h=${j.arte?.h}px`);
  console.log(
    `   cartão ${j.cartao?.w}x${j.cartao?.h} scroll=${j.cartaoScrollH}/${j.cartaoClientH}` +
      (j.transborda ? "  ⛔ TRANSBORDA" : ""),
  );
  console.log(
    j.cabeNoPalco === null
      ? `   sem palco nesta largura (carrossel) — encaixe não se aplica`
      : `   palco ${j.palco?.w}x${j.palco?.h}: ${j.cabeNoPalco ? "cartão cabe" : `⛔ cartão PASSA ${j.sobraNoPalco}px do palco`}`,
  );
  console.log(
    `   texto acessível: «${j.textoAcessivel}»` + (j.anunciaSentido ? "  ✅" : "  ⛔ SENTIDO PERDIDO"),
  );
}
