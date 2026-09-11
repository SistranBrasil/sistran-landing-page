/**
 * SIS-202 — fotografa a MESMA seção nas duas rotas, para o lado a lado que a
 * issue pede: `/transformacao-legado` (referência) e
 * `/parceiros-e-implementacoes` (a que passou a montá-la).
 *
 * As paradas são ancoradas no elemento (`.roadmap`), não em altura fixa: as duas
 * rotas têm capítulos de alturas diferentes acima da seção, então qualquer px
 * escolhido a mão fotografaria coisas distintas e o "lado a lado" não provaria
 * nada. Para cada rota: o cabeçalho da seção, o palco no meio (onde há card
 * aceso) e o fim do palco.
 *
 * Também fotografa mobile (390) e `prefers-reduced-motion: reduce`, que são
 * critérios de aceite.
 *
 * Rodar com o site no ar (`npx next dev -p 3999`):
 *   node scripts/capturar-etapas-sis202.mjs
 */
import { chromium } from "file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs";
import { mkdir } from "node:fs/promises";

const BASE = process.env.BASE_URL ?? "http://localhost:3999";
const SAIDA = "docs/capturas/sis202";

const ROTAS = [
  ["legado", "/transformacao-legado"],
  ["parceiros", "/parceiros-e-implementacoes"],
];

await mkdir(SAIDA, { recursive: true });

const navegador = await chromium.launch();

/** Rola até `y` e espera o palco assentar (a rota pinta por scroll). */
async function foto(pagina, arquivo, y) {
  await pagina.evaluate((v) => window.scrollTo(0, v), y);
  await pagina.waitForTimeout(1400);
  await pagina.screenshot({ path: arquivo });
  console.log(`  ${arquivo}  (scrollY ${Math.round(y)})`);
}

async function abrir(contexto, rota) {
  const pagina = await contexto.newPage();
  await pagina.goto(BASE + rota, { waitUntil: "domcontentloaded" });
  await pagina.waitForTimeout(3000);
  const continuar = pagina.getByRole("button", { name: /continuar/i });
  if (await continuar.count()) {
    await continuar.first().click();
    /* 1800ms: o véu navy do diálogo de preferências sai por fade — com menos ele
       aparecia no topo da primeira foto (nota herdada da SIS-199). */
    await pagina.waitForTimeout(1800);
  }
  return pagina;
}

/** Geometria da seção: topo, meio do palco e fim do palco, em scrollY. */
async function paradas(pagina) {
  return pagina.evaluate(() => {
    const secao = document.querySelector(".roadmap");
    const palco = document.querySelector(".roadmap-stage");
    if (!secao || !palco) return null;
    const topoSecao = secao.getBoundingClientRect().top + window.scrollY;
    const r = palco.getBoundingClientRect();
    const topoPalco = r.top + window.scrollY;
    return {
      cabecalho: Math.max(topoSecao - 40, 0),
      meio: topoPalco + r.height / 2 - window.innerHeight / 2,
      fim: topoPalco + r.height - window.innerHeight + 80,
      altura: Math.round(r.height),
    };
  });
}

for (const [largura, altura, sufixo, reduce] of [
  [1440, 900, "", false],
  [390, 844, "-mobile", false],
  [1440, 900, "-reduce", true],
]) {
  const contexto = await navegador.newContext({
    viewport: { width: largura, height: altura },
    deviceScaleFactor: 1,
    reducedMotion: reduce ? "reduce" : "no-preference",
  });

  for (const [nome, rota] of ROTAS) {
    const pagina = await abrir(contexto, rota);
    const p = await paradas(pagina);
    if (!p) {
      console.log(`  (pulada) ${nome}${sufixo} — \`.roadmap\` não existe em ${rota}`);
      await pagina.close();
      continue;
    }
    console.log(`${rota}${sufixo} — palco ${p.altura}px`);
    await foto(pagina, `${SAIDA}/${largura}${sufixo}-${nome}-1-cabecalho.png`, p.cabecalho);
    await foto(pagina, `${SAIDA}/${largura}${sufixo}-${nome}-2-meio.png`, p.meio);
    await foto(pagina, `${SAIDA}/${largura}${sufixo}-${nome}-3-fim.png`, p.fim);
    await pagina.close();
  }

  await contexto.close();
}

await navegador.close();
