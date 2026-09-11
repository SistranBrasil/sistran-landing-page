/**
 * SIS-198 — capturas do card do hero e da emenda com a grade de marcas.
 *
 * A issue pede duas coisas em foto: o card no TAMANHO PADRÃO (para comparar com
 * `public/referencia-hero-card-tamanho.png`) e a emenda `sticky` → grade em `t`
 * INÍCIO e FIM do percurso do `#top` — porque sem `drop`/`scale` a emenda mudou.
 *
 * Além da foto, sai a GEOMETRIA medida do card em cada quadro: é ela que prova o
 * critério "tamanho estável", que uma captura sozinha não prova (duas fotos
 * parecidas podem esconder alguns px de diferença).
 *
 * `t` é fração do percurso rolável do `#top`, o mesmo eixo do `scrollYProgress`
 * de `HeroCinematic` (`offset: ["start start", "end end"]`).
 *
 * Rodar com o site no ar (`npx next start -p 3999`):
 *   node scripts/capturar-hero-sis198.mjs
 */
import { chromium } from "file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs";
import { mkdir } from "node:fs/promises";

const BASE = process.env.BASE_URL ?? "http://localhost:3999";
const DIR = "docs/capturas";
/* 1440 é a largura que a issue nomeia para o antes/depois; 390 entra porque a
   emenda foi medida nas duas e abaixo de 1024 o hero é de sangria, não card. */
/* `LARGURAS=390` na variável de ambiente refaz só uma delas — o `next start` desta
   máquina já derrubou uma navegação por tempo esgotado no meio da rodada, e repetir
   a largura inteira é mais barato que repetir as duas. */
const LARGURAS = process.env.LARGURAS
  ? process.env.LARGURAS.split(",").map(Number)
  : [1440, 390];
/* Início, meio e fim do percurso. O meio existe para o "tamanho estável" ser
   verificado em três pontos e não só nas pontas. */
const TS = [0, 0.5, 1];

await mkdir(DIR, { recursive: true });
const navegador = await chromium.launch();

for (const largura of LARGURAS) {
  const contexto = await navegador.newContext({
    viewport: { width: largura, height: 900 },
    deviceScaleFactor: 1,
  });
  const pagina = await contexto.newPage();
  /* `networkidle` não serve: o vídeo do hero mantém requisição aberta.
     Teto de 90s e uma segunda tentativa: o `next start` desta máquina estourou os
     30s de padrão do Playwright em duas rodadas, e perder a largura inteira por
     isso custa mais que tentar de novo. */
  pagina.setDefaultNavigationTimeout(90_000);
  try {
    await pagina.goto(BASE, { waitUntil: "domcontentloaded" });
  } catch {
    await pagina.goto(BASE, { waitUntil: "domcontentloaded" });
  }
  await pagina.waitForTimeout(2500);

  /* O diálogo de preferências de movimento abre na primeira visita e cobre o
     centro da cena — numa captura de antes/depois ele esconde justamente a base do
     card. "Continuar" mantém a preferência do dispositivo, que é o modo normal. */
  const continuar = pagina.getByRole("button", { name: /continuar/i });
  if (await continuar.count()) {
    await continuar.first().click();
    await pagina.waitForTimeout(500);
  }

  for (const t of TS) {
    await pagina.evaluate((frac) => {
      const top = document.querySelector("#top");
      const percurso = top.offsetHeight - window.innerHeight;
      window.scrollTo(0, top.offsetTop + percurso * frac);
    }, t);
    /* Espera longa: a cena é dirigida por rolagem e o vídeo busca quadro
       (`primitives/ScrollVideo`). Fotografar antes do seek colhe o quadro
       anterior. */
    await pagina.waitForTimeout(1600);

    const medida = await pagina.evaluate(() => {
      const cena = document.querySelector(".hero-scene");
      const c = cena.getBoundingClientRect();
      const est = getComputedStyle(cena);
      const grade = document.querySelector(".marcas-grade")?.getBoundingClientRect();
      const arred = (n) => Math.round(n * 10) / 10;
      return {
        card: `${arred(c.width)}×${arred(c.height)}`,
        margens: `esq ${arred(c.left)} · dir ${arred(window.innerWidth - c.right)} · topo ${arred(c.top)}`,
        raio: est.borderTopLeftRadius,
        transform: est.transform,
        arestaDaGrade: grade ? arred(grade.top) : null,
      };
    });
    const nome = `${DIR}/sis198-${largura}-t${String(t).replace(".", "_")}.png`;
    await pagina.screenshot({ path: nome });
    console.log(`${nome}\n  ${JSON.stringify(medida)}`);
  }

  await contexto.close();
}

await navegador.close();
