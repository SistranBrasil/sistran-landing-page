/**
 * SIS-199 — fotografa as quatro paradas que a issue pede (topo, Soluções,
 * Números, rodapé) para o antes/depois do comentário.
 *
 * Escolha das paradas: por SEÇÃO e não por altura fixa. Uma parada em px vira
 * mentira na próxima issue que mudar a altura de qualquer capítulo; ancorada no
 * elemento, a foto continua sendo do que ela diz ser. Cada parada rola até o topo
 * da seção encostar no topo da janela menos a altura do header.
 *
 * `--saida=<pasta>` para separar antes e depois. Padrão: `docs/capturas/sis199`.
 *
 * Rodar com o site no ar (`npx next dev -p 3999`):
 *   node scripts/capturar-canvas-home-sis199.mjs --saida=docs/capturas/sis199/depois
 */
import { chromium } from "file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs";
import { mkdir } from "node:fs/promises";

const BASE = process.env.BASE_URL ?? "http://localhost:3999";
const argSaida = process.argv.find((a) => a.startsWith("--saida="));
const SAIDA = argSaida ? argSaida.slice("--saida=".length) : "docs/capturas/sis199";
const LARGURA = Number(process.env.LARGURA ?? 1440);

const PARADAS = [
  ["1-topo", null],
  ["2-marcas", ".marcas-grade"],
  ["3-solucoes", ".story-solucoes"],
  ["4-numeros", ".impact-percurso"],
  ["5-contato", ".emenda-luminna"],
  ["6-rodape", "footer"],
];

await mkdir(SAIDA, { recursive: true });

const navegador = await chromium.launch();
const contexto = await navegador.newContext({
  viewport: { width: LARGURA, height: 900 },
  deviceScaleFactor: 1,
});
const pagina = await contexto.newPage();
await pagina.goto(BASE, { waitUntil: "domcontentloaded" });
await pagina.waitForTimeout(3000);

const continuar = pagina.getByRole("button", { name: /continuar/i });
if (await continuar.count()) {
  await continuar.first().click();
  /* 1800ms porque o véu navy do diálogo sai por fade: com 600 ele aparecia no topo
     da primeira foto. Mesma nota em `medir-canvas-home-sis199.mjs`. */
  await pagina.waitForTimeout(1800);
}

for (const [nome, sel] of PARADAS) {
  const y = sel
    ? await pagina.evaluate((s) => {
        const el = document.querySelector(s);
        if (!el) return null;
        return el.getBoundingClientRect().top + window.scrollY;
      }, sel)
    : 0;
  if (y == null) {
    console.log(`  (pulada) ${nome} — \`${sel}\` não existe nesta rota`);
    continue;
  }
  await pagina.evaluate((v) => window.scrollTo(0, v), y);
  /* Espera longa: as cenas dirigidas buscam quadro de vídeo e recalculam sticky. */
  await pagina.waitForTimeout(1400);
  const arquivo = `${SAIDA}/${LARGURA}-${nome}.png`;
  await pagina.screenshot({ path: arquivo });
  console.log(`  ${arquivo}  (scrollY ${Math.round(y)})`);
}

await contexto.close();
await navegador.close();
