/**
 * SIS-189 — confere no navegador o contrato das duas fases do hero da home.
 *
 * O que se mede não é "o vídeo tocou": é se existe UM dono do eixo de tempo em
 * cada fase. Daí as quatro cenas, uma por critério de aceite que pode falhar
 * sozinho:
 *
 *   1. entrada          topo + movimento permitido → o vídeo avança E a página
 *                       acompanha, sem ninguém rolar. Se só o vídeo andasse, o
 *                       percurso ficaria em 0 e a manchete congelaria.
 *   2. gesto            um `wheel` encerra a entrada: o vídeo para de avançar por
 *                       conta própria e a rolagem passa a mandar.
 *   3. rebobina         rolar de volta ao topo devolve o vídeo ao começo — é a
 *                       raspagem nos dois sentidos.
 *   4. reduzido / meio  movimento reduzido (as duas chaves) e página aberta já
 *                       dentro do hero NÃO disparam automático.
 *
 * `currentTime` é lido do próprio `<video>` do hero, e a posição do percurso de
 * `window.scrollY`: são as duas pontas que a Fase A tem de manter juntas.
 *
 * Rodar com o site no ar:
 *   node scripts/medir-entrada-hero.mjs
 */
import { chromium } from "file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs";

const BASE = process.env.BASE_URL ?? "http://localhost:3999";

const LER = () => {
  const v = document.querySelector(".hero-video");
  return {
    t: v ? Number(v.currentTime.toFixed(2)) : null,
    pausado: v ? v.paused : null,
    y: Math.round(window.scrollY),
  };
};

const navegador = await chromium.launch();

/**
 * `reducedMotion` é a chave do SISTEMA; `atributo` é a escolha guardada pelo
 * próprio site, que o `layout.tsx` lê antes de pintar — ela tem de estar no
 * `localStorage` ANTES de a página abrir.
 */
async function abrir({ reduzido = false, atributo = false, ancora = "" } = {}) {
  const contexto = await navegador.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: reduzido ? "reduce" : "no-preference",
  });
  if (atributo) {
    await contexto.addInitScript(() => {
      localStorage.setItem("sistran-motion-preference", "reduce");
    });
  }
  const pagina = await contexto.newPage();
  /* "Abriu já fora do topo" (ponto 5) precisa de um caminho em que a página esteja
     posicionada ANTES de a fase ser decidida — e o caminho real é a âncora na URL:
     o navegador rola sozinho no carregamento. Duas alternativas foram descartadas
     por não testarem nada:
       • `scrollTo` depois do `goto` — a fase já começou no topo, e daí em diante é
         ela quem escreve a posição a cada quadro, sobrescrevendo o scroll de fora;
       • rolar e recarregar — este Chromium não restaura a posição, e a página volta
         a abrir em y=0. */
  await pagina.goto(BASE + ancora, { waitUntil: "domcontentloaded" });
  return { contexto, pagina };
}

const relatorio = [];

/* ── 1 e 2 e 3: entrada, gesto, rebobina ─────────────────────────────────── */
{
  const { contexto, pagina } = await abrir();
  await pagina.waitForTimeout(500);
  const inicio = await pagina.evaluate(LER);
  /* 3,5s de automático: o vídeo tem 15,4s e o teto da entrada é 0.58, então a
     fase inteira dura ~8,9s — 3,5s é o suficiente para provar que ela ANDA sem
     esperar o fim dela. */
  await pagina.waitForTimeout(3500);
  const andando = await pagina.evaluate(LER);

  /* Gesto de verdade, e não `window.scrollTo`: o que encerra a Fase A é o evento
     de entrada do usuário. */
  await pagina.mouse.move(720, 450);
  await pagina.mouse.wheel(0, 120);
  await pagina.waitForTimeout(1800);
  const aposGesto = await pagina.evaluate(LER);
  await pagina.waitForTimeout(1800);
  const parado = await pagina.evaluate(LER);

  /* Rebobina: de volta ao topo, o vídeo tem de voltar ao começo. */
  await pagina.evaluate(() => window.scrollTo(0, 0));
  await pagina.waitForTimeout(2000);
  const rebobinado = await pagina.evaluate(LER);

  relatorio.push({ cena: "entrada + gesto + rebobina", inicio, andando, aposGesto, parado, rebobinado });
  await contexto.close();
}

/* ── 4: as duas chaves de movimento reduzido, e a abertura no meio do hero ── */
for (const cena of [
  { nome: "sistema reduce", opcoes: { reduzido: true } },
  { nome: 'data-motion="reduce"', opcoes: { atributo: true } },
  { nome: "aberta por âncora, fora do topo", opcoes: { ancora: "#contato" } },
]) {
  const { contexto, pagina } = await abrir(cena.opcoes);
  await pagina.waitForTimeout(500);
  const inicio = await pagina.evaluate(LER);
  await pagina.waitForTimeout(3500);
  const depois = await pagina.evaluate(LER);
  relatorio.push({ cena: cena.nome, inicio, depois });
  await contexto.close();
}

await navegador.close();

for (const r of relatorio) {
  console.log(`\n── ${r.cena} ──`);
  for (const [k, v] of Object.entries(r)) {
    if (k !== "cena") console.log(`  ${k.padEnd(11)}`, JSON.stringify(v));
  }
}
