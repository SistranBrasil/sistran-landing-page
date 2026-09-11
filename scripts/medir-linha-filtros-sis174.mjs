/**
 * SIS-174 — mede se a barra de filtros do navegador de eventos continua em UMA
 * linha depois de o rótulo do botão subir de 11px para 12px.
 *
 * ── Por que medir, e não olhar ─────────────────────────────────────────────
 * A regra que cresceu (`.evento-navegador .evento-filtros > button`) mora dentro de
 * `@media (min-width: 1024px)`, e a nota dela conta que o `padding` já foi apertado
 * uma vez porque os seis filtros quebravam em duas linhas a 1366 — quer dizer que
 * esta barra JÁ esteve no limite. Um glifo 1px maior em seis botões é largura nova
 * distribuída em seis lugares; "parece caber" na captura de uma largura não
 * responde por 1024, que é justamente onde a media query começa e a caixa é a mais
 * estreita das que a regra atinge.
 *
 * ── O critério é geométrico, não visual ───────────────────────────────────
 * Uma linha significa: todos os botões com o MESMO `offsetTop`. É o teste que não
 * depende de eu conseguir contar linhas num PNG — se um botão desceu, o `top` dele
 * muda, e o espalhamento deixa de ser zero. Vai também a soma das larguras contra a
 * largura do contêiner, para dizer QUANTA folga restou: aprovar sem folga é aprovar
 * uma barra que a próxima palavra de filtro quebra.
 *
 * ── Sem `reducedMotion` padrão ────────────────────────────────────────────
 * O padrão do Playwright é `reducedMotion: 'reduce'`, e a rota tem bloco
 * `@media (min-width: 1024px) and (prefers-reduced-motion: reduce)` logo abaixo da
 * regra medida. Medir no padrão seria medir o ramo que o visitante comum não vê.
 *
 * Rodar com o site no ar (`npx next dev -p 3999`):
 *   node scripts/medir-linha-filtros-sis174.mjs
 */
import { chromium } from "file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs";

const BASE = process.env.BASE_URL ?? "http://localhost:3999";
const LARGURAS = [1024, 1440];

const navegador = await chromium.launch();
for (const largura of LARGURAS) {
  const pagina = await navegador.newPage({
    viewport: { width: largura, height: 900 },
    reducedMotion: "no-preference",
  });
  await pagina.goto(`${BASE}/eventos-inovacao`, { waitUntil: "networkidle" });
  await pagina
    .locator(".evento-navegador .evento-filtros > button")
    .first()
    .waitFor({ state: "visible", timeout: 20000 })
    .catch(() => {});
  await pagina.waitForTimeout(1500);

  const d = await pagina.evaluate(() => {
    const barra = document.querySelector(".evento-navegador .evento-filtros");
    if (!barra) return null;
    const bs = [...barra.querySelectorAll(":scope > button")];
    const cx = getComputedStyle(barra);
    const tops = bs.map((b) => Math.round(b.getBoundingClientRect().top));
    return {
      n: bs.length,
      fonte: bs[0] ? getComputedStyle(bs[0]).fontSize : null,
      linhas: [...new Set(tops)].length,
      tops,
      larguraBarra: barra.clientWidth,
      /* O `gap` conta: seis botões numa linha carregam cinco vãos, e ignorá-los
         inflaria a folga relatada. */
      somaBotoes:
        bs.reduce((s, b) => s + b.getBoundingClientRect().width, 0) +
        (bs.length - 1) * parseFloat(cx.columnGap || cx.gap || "0"),
      rotulos: bs.map((b) => b.textContent?.trim()),
    };
  });

  console.log(`\n═══ ${largura}px ═══`);
  if (!d) {
    console.log("  .evento-navegador .evento-filtros nao encontrada na rota.");
    continue;
  }
  console.log(`  botoes: ${d.n} — ${d.rotulos.join(" | ")}`);
  console.log(`  font-size medido: ${d.fonte}`);
  console.log(`  linhas distintas (offsetTop): ${d.linhas} — ${d.linhas === 1 ? "OK" : "REPROVA"}`);
  console.log(`  tops: ${d.tops.join(", ")}`);
  const folga = d.larguraBarra - d.somaBotoes;
  console.log(
    `  largura da barra ${d.larguraBarra.toFixed(2)} · botoes+gaps ${d.somaBotoes.toFixed(2)} · folga ${folga.toFixed(2)}px`,
  );
  await pagina.close();
}
await navegador.close();
