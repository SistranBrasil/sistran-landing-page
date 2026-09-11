/**
 * SIS-226 — sonda da sequência de quatro escritas do hero da home.
 *
 * Mede TRÊS coisas, e cada uma existe por um critério de aceite da issue:
 *
 *  1. REVELAÇÃO DE ENTRADA. Sem rolar nada, lê a opacidade das três linhas da
 *     primeira legenda em quadros sucessivos depois do `load`. O critério é que
 *     ela seja PROGRESSIVA: o primeiro quadro tem de estar abaixo de 1 e o
 *     último em 1. Um bloco que "aparece completo sem transição" mediria 1 no
 *     primeiro quadro — é exatamente esse caso que a issue proíbe. Capturas em
 *     três instantes para prova visual.
 *
 *  2. ALTERNÂNCIA PELA ROLAGEM. Em cada centro de janela (0.10, 0.32, 0.51) e no
 *     patamar do passo 4 (0.70, 0.85, 0.99), lê a opacidade dos QUATRO blocos.
 *     Dois critérios: em cada posição exatamente UM bloco está legível (> 0.9) e
 *     os outros três apagados (< 0.1) — duas escritas sobrepostas na mesma célula
 *     do grid é o caso ilegível —, e o passo 4 continua em 1 até o fim.
 *
 *  3. UM `h1` SÓ. Conta os `h1` da home e imprime o texto.
 *
 * A rolagem é por posição ABSOLUTA e instantânea (`scrollTo` com `behavior:
 * 'auto'`), e o gesto de rolagem encerra a Fase A (SIS-189) — então a leitura é
 * do relógio de rolagem, sem o vídeo escrevendo posição por baixo.
 *
 * Uso (com o site no ar):
 *   URL_BASE=http://localhost:3000 node scripts/medir-sequencia-hero-sis226.mjs
 */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import { mkdir } from 'node:fs/promises';

const URL_BASE = process.env.URL_BASE ?? 'http://localhost:3000';
const LARGURAS = process.env.LARGURAS ? process.env.LARGURAS.split(',').map(Number) : [1440, 390];
const DESTINO = 'docs/capturas/sis226-hero';
/* Os três centros de janela (que são também os `BEATS` do vídeo) e três pontos do
   patamar do passo 4, incluindo o fim do percurso. */
const POSICOES = [0, 0.1, 0.32, 0.51, 0.62, 0.7, 0.85, 0.99];
/* Posições que caem no meio de uma rampa: o valor intermediário ali é esperado. */
const EM_TRANSICAO = [0.62];

await mkdir(DESTINO, { recursive: true });
const navegador = await chromium.launch();

for (const w of LARGURAS) {
  for (const reduzido of [false, true]) {
    const contexto = await navegador.newContext({
      viewport: { width: w, height: 900 },
      deviceScaleFactor: 1,
      reducedMotion: reduzido ? 'reduce' : 'no-preference',
    });
    await contexto.addInitScript(() => {
      localStorage.setItem('sistran-motion-preference-seen', '1');
    });
    const pagina = await contexto.newPage();
    await pagina.goto(`${URL_BASE}/`, { waitUntil: 'domcontentloaded', timeout: 180_000 });
    await pagina.waitForSelector('.hero-captions .hero-caption', { timeout: 180_000 });
    await pagina.addStyleTag({
      content: `nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button]{display:none!important}`,
    });

    const marca = `${w}${reduzido ? ' · reduce' : ''}`;

    /* ── 1. Revelação de entrada ─────────────────────────────────────────────
       Só faz sentido no percurso com movimento; em `reduce` o contrato é o
       oposto (texto legível desde o primeiro quadro), e é o que se verifica. */
    const lerLinhas = () =>
      pagina.evaluate(() => {
        const bloco = document.querySelectorAll('.hero-captions .hero-caption')[0];
        return Array.from(bloco.querySelectorAll('p')).map((p) =>
          Number(getComputedStyle(p).opacity).toFixed(3),
        );
      });

    if (reduzido) {
      /* Duas leituras, e as duas importam: `useReducedMotion` nasce `false` por
         paridade de hidratação e converge no efeito seguinte, então o PRIMEIRO
         quadro ainda pode trazer o valor de movimento. O contrato do critério é
         o texto legível — o que se confere é a leitura assentada. */
      const cru = (await lerLinhas()).join(' / ');
      await pagina.waitForTimeout(1200);
      console.log(
        `${marca} · entrada: 1º quadro ${cru} → assentado ${(await lerLinhas()).join(' / ')} (espera 1.000)`,
      );
    } else {
      const amostras = [];
      for (const ms of [0, 250, 600, 1600]) {
        if (ms) await pagina.waitForTimeout(ms - (amostras.length ? [0, 250, 600][amostras.length - 1] : 0));
        amostras.push(`${ms}ms ${(await lerLinhas()).join('/')}`);
        if (ms === 0 || ms === 600) {
          await pagina
            .locator('.hero-captions')
            .first()
            .screenshot({ path: `${DESTINO}/${w}-entrada-${ms}ms.png` });
        }
      }
      console.log(`${marca} · entrada: ${amostras.join(' · ')}`);
    }
    await pagina.waitForTimeout(1400);
    await pagina
      .locator('.hero-captions')
      .first()
      .screenshot({ path: `${DESTINO}/${w}${reduzido ? '-reduce' : ''}-entrada-final.png` });

    /* ── 2. Alternância pela rolagem ─────────────────────────────────────────
       DUAS armadilhas medidas nesta cena, e a primeira versão desta sonda caiu
       nas duas (o passo 4 lia 0.86 → 0.43 → 0.03 conforme eu rolava PARA FRENTE,
       o oposto do contrato):

       a) A Fase A (SIS-189) é escritora de posição: enquanto ela dura, a fração
          do vídeo vira `scrollTo` e ARRASTA a página de volta ao trecho dela
          (teto 0.58). Medir por cima dela mede o relógio do vídeo, não o do
          scroll. Um gesto de roda encerra a fase e não a religa — é o mesmo
          caminho de saída que o usuário usa.
       b) O Lenis guarda a própria posição animada e não acompanha um
          `window.scrollTo` feito por fora (ver `src/lib/smoothScroll.ts`): sem
          posicionar por ele, o quadro seguinte volta para onde ele achava que
          estava. `window.__lenis` é o mesmo registro que Header e ScrollSpy usam. */
    await pagina.evaluate(() => {
      window.dispatchEvent(new WheelEvent('wheel', { deltaY: 1, bubbles: true }));
    });
    await pagina.waitForTimeout(200);

    const alturaDoPercurso = await pagina.evaluate(() => {
      const secao = document.querySelector('#top');
      return secao.getBoundingClientRect().height - window.innerHeight;
    });

    for (const p of POSICOES) {
      await pagina.evaluate(([y]) => {
        window.scrollTo({ top: y, behavior: 'auto' });
        window.__lenis?.scrollTo(y, { immediate: true, force: true });
      }, [Math.round(p * alturaDoPercurso)]);
      /* Dois quadros: o `motion` escreve o `style` no rAF seguinte à rolagem. */
      await pagina.waitForTimeout(reduzido ? 120 : 260);

      /* A posição EFETIVA, e não a pedida: se algo mais estiver escrevendo no
         eixo, a diferença aparece aqui em vez de virar leitura errada silenciosa. */
      const pReal = await pagina.evaluate(([alcance]) => {
        const secao = document.querySelector('#top');
        const topo = secao.getBoundingClientRect().top + window.scrollY;
        return (window.scrollY - topo) / alcance;
      }, [alturaDoPercurso]);

      const estado = await pagina.evaluate(() => {
        const blocos = Array.from(document.querySelectorAll('.hero-captions .hero-caption'));
        return blocos.map((b) => {
          const o = Number(getComputedStyle(b).opacity);
          /* A opacidade EFETIVA do texto é a do bloco vezes a da linha: as duas
             se multiplicam, e é ela que decide se a escrita é legível. */
          const linhas = Array.from(b.querySelectorAll('p, h1')).map((n) =>
            Number(getComputedStyle(n).opacity),
          );
          const eficaz = o * Math.max(...linhas);
          return eficaz.toFixed(3);
        });
      });
      const legiveis = estado.filter((v) => Number(v) > 0.9).length;
      const apagados = estado.filter((v) => Number(v) < 0.1).length;
      console.log(
        `${marca} · t=${p.toFixed(2)} (real ${pReal.toFixed(3)}): [${estado.join(' | ')}] · legíveis ${legiveis} · apagados ${apagados}` +
          (reduzido
            ? ' (reduce: espera 4 legíveis, empilhados em fluxo)'
            : EM_TRANSICAO.includes(p)
              /* 0.62 cai DENTRO da janela de entrada do passo 4 (0.575–0.65): ali o
                 valor intermediário é o contrato, não uma falha. */
              ? ' · em transição (dentro de uma janela)'
              : ` · ${legiveis === 1 && apagados === 3 ? 'OK' : 'CONFERIR'}`),
      );

      if (!reduzido && [0.1, 0.32, 0.51, 0.7, 0.99].includes(p)) {
        await pagina.screenshot({ path: `${DESTINO}/${w}-passo-t${String(p).replace('.', '')}.png` });
      }
    }

    if (reduzido) {
      await pagina.evaluate(() => window.scrollTo({ top: 0, behavior: 'auto' }));
      await pagina.waitForTimeout(200);
      await pagina.screenshot({ path: `${DESTINO}/${w}-reduce-pilha.png`, fullPage: false });
    }

    /* ── 3. Um `h1` só ─────────────────────────────────────────────────────── */
    const titulos = await pagina.evaluate(() =>
      Array.from(document.querySelectorAll('h1')).map((h) => h.textContent.trim()),
    );
    console.log(`${marca} · h1: ${titulos.length} → ${JSON.stringify(titulos)}`);

    await contexto.close();
  }
}
await navegador.close();
