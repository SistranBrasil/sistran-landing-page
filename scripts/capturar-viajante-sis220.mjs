/**
 * SIS-220 — o viajante da trilha nas DUAS rotas, para a captura lado a lado que a
 * issue pede. Uma foto por rota, na mesma largura, com o palco da trilha centrado,
 * e os números que provam a paridade: existência do <img>, o `src` resolvido e a
 * caixa do círculo e da arte dentro dele.
 *
 * Uso: MARCA=depois URL_BASE=http://localhost:3000 node scripts/capturar-viajante-sis220.mjs
 */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import { mkdir } from 'node:fs/promises';

const URL_BASE = process.env.URL_BASE ?? 'http://localhost:3000';
const MARCA = process.env.MARCA ?? 'depois';
const PASTA = 'docs/capturas';
await mkdir(PASTA, { recursive: true });

const ROTAS = [
  ['legado', '/transformacao-legado', 'roadmap'],
  ['parceiros', '/parceiros-e-implementacoes', 'linha-do-tempo'],
];

const navegador = await chromium.launch();
for (const largura of [1440, 390]) {
  for (const [nome, rota, ancora] of ROTAS) {
    const contexto = await navegador.newContext({
      viewport: { width: largura, height: 900 },
      deviceScaleFactor: 1,
    });
    const pagina = await contexto.newPage();
    await pagina.goto(`${URL_BASE}${rota}`, { waitUntil: 'domcontentloaded', timeout: 180_000 });
    await pagina.waitForSelector(`#${ancora}`, { timeout: 180_000 });
    await pagina.addStyleTag({
      content: `nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button]{display:none!important}`,
    });
    const continuar = pagina.getByRole('button', { name: 'Continuar' });
    if (await continuar.count()) {
      await continuar.first().click();
      await pagina.waitForTimeout(600);
    }
    /* O viajante só anda com o scroll: a foto tem de ser tirada com o palco
       dentro da janela, senão o marcador está na primeira parada e nada se vê. */
    /* `scrollIntoView` sozinho não serve: a rota tem rolagem suave e um efeito
       que devolve a página ao topo no primeiro frame, e a foto saía do herói.
       Rolar em passos, com espera, e conferir a posição no fim. */
    for (let i = 0; i < 6; i += 1) {
      await pagina.evaluate((a) => {
        const palco =
          document.querySelector(`#${a} .roadmap-stage`) ?? document.querySelector(`#${a}`);
        const r = palco.getBoundingClientRect();
        window.scrollTo(0, r.top + window.scrollY - window.innerHeight * 0.22);
      }, ancora);
      await pagina.waitForTimeout(700);
    }
    await pagina.waitForTimeout(1200);

    /* O diálogo "Preferências de movimento" pode abrir depois da primeira
       tentativa de fechá-lo e cobrir justamente o palco — fechar de novo aqui. */
    if (await continuar.count()) {
      await continuar.first().click();
      await pagina.waitForTimeout(800);
    }

    const medida = await pagina.evaluate(() => {
      const marca = document.querySelector('.roadmap-traveler');
      if (!marca) return { existe: false };
      const est = getComputedStyle(marca);
      const img = marca.querySelector('img');
      const cm = marca.getBoundingClientRect();
      const ci = img?.getBoundingClientRect();
      return {
        existe: true,
        /* A largura é impressa junto porque uma rodada leu `display: grid` em
           390px: era a janela, não o CSS — sem este número não há como saber. */
        janela: window.innerWidth,
        mq: matchMedia('(max-width: 63.99rem)').matches,
        display: est.display,
        borda: est.borderTopColor,
        sombra: est.filter,
        circulo: `${Math.round(cm.width)}x${Math.round(cm.height)}`,
        img: img ? { src: new URL(img.currentSrc || img.src).pathname, natural: `${img.naturalWidth}x${img.naturalHeight}`, caixa: `${Math.round(ci.width)}x${Math.round(ci.height)}` } : null,
      };
    });
    console.log(largura, nome, JSON.stringify(medida));
    const estouro = await pagina.evaluate(() => ({
      s: document.documentElement.scrollWidth,
      c: document.documentElement.clientWidth,
    }));
    console.log(`  ${largura} ${nome} scrollWidth=${estouro.s} clientWidth=${estouro.c}`);
    await pagina.screenshot({ path: `${PASTA}/sis220-${MARCA}-${nome}-${largura}.png` });
    await contexto.close();
  }
}
await navegador.close();
