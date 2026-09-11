/**
 * SIS-234 — o foguete de SOCIAL em `/esg`: capturas com ele em quadro e o
 * contraste do texto da seção no PIOR ponto do trajeto.
 *
 * Como o contraste é medido, e por que não é o truque de "ler o fundo ao lado do
 * texto": o foguete passa POR TRÁS das letras, então o que interessa é a tinta do
 * fundo debaixo de cada parágrafo, não a de perto dele.
 *
 * São DUAS fotos por passo: uma normal e uma com o texto da seção em
 * `visibility: hidden` (o layout não muda, a caixa continua lá). A diferença
 * entre elas é a máscara dos GLIFOS — exatamente onde há letra. O fundo de cada
 * letra é lido na foto sem texto, nessas posições, e a razão sai contra a `color`
 * declarada do elemento.
 *
 * Por que a máscara é necessária, e não bastava o pixel mais escuro da caixa do
 * elemento: a caixa de um `<h2>`/`<h3>` é a coluna inteira e engloba arte que não
 * está atrás de letra nenhuma — a placa navy do selo, a borda escura dos cartões.
 * Medindo assim, `/esg` "reprovava" em 1,01:1 ANTES de qualquer mudança, o que é
 * absurdo: aquele pixel preto-azulado não tem letra em cima. A máscara de glifos
 * mede o que o olho de fato encontra.
 *
 * Só o pixel de MENOR luminância de cada texto entra na conta (o pior caso), e o
 * pior de todos os passos é o número que a issue pede.
 *
 * Uso: MARCA=antes URL_BASE=http://localhost:3000 node scripts/medir-foguete-social-sis234.mjs
 */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import { mkdir } from 'node:fs/promises';
import sharp from 'sharp';

const URL_BASE = process.env.URL_BASE ?? 'http://localhost:3000';
const MARCA = process.env.MARCA ?? 'antes';
const PASTA = 'docs/capturas';
await mkdir(PASTA, { recursive: true });
const PASSOS = Number(process.env.PASSOS ?? 9);

const lum = (r, g, b) => {
  const c = [r, g, b].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const razao = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

const navegador = await chromium.launch();
for (const largura of [390, 1024, 1440]) {
  const contexto = await navegador.newContext({
    viewport: { width: largura, height: 900 },
    deviceScaleFactor: 1,
  });
  const pagina = await contexto.newPage();
  await pagina.goto(`${URL_BASE}/esg`, { waitUntil: 'domcontentloaded', timeout: 180_000 });
  await pagina.waitForSelector('[data-foguete="social"]', { timeout: 180_000 });
  await pagina.addStyleTag({
    content: `nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button]{display:none!important}
      header{display:none!important}
      /* O diálogo "Preferências de movimento" REAPARECE depois de fechado e é
         uma placa escura no meio da coluna de texto — foi ele, e não o foguete,
         que a primeira medida acusou como fundo de 1,01:1 sob o parágrafo
         "Idealizado pela Sistran…" (pixel rgb(62 92 117) com
         '.motion-banner' no topo do 'elementsFromPoint'). Fechar por clique não
         basta porque ele volta; aqui ele sai do quadro pelo CSS. */
      .motion-banner{display:none!important}
      /* Congelar as animações de CSS antes de fotografar. Sem isto a máscara de
         glifos é lixo: o selo e os dois cartões apoiados flutuam ('.esg-selo',
         '.esg-social-flutua', ciclos de 5s a 11s), então entre as duas fotos a
         arte se desloca alguns pixels e a DIFERENÇA entre elas passa a marcar
         bordas de foto e de placa navy — não letras. Era isto que fazia a medida
         acusar 1,01:1 antes de qualquer mudança. Pausar animação não muda tinta
         nenhuma, e o foguete não depende disto: ele é escrito por MotionValue a
         partir do scroll, que aqui está parado. */
      /* 'animation:none', e não 'animation-play-state:paused': pausar congela no
         quadro em que a folha entrou, que muda a cada rodada — o selo e os dois
         cartões apoiados param em posições diferentes e o "pior pixel" oscila
         ~0,15 de razão sem que nada no código tenha mudado. Com 'none' cada peça
         fica na posição base, e duas rodadas são comparáveis. */
      *,*::before,*::after{animation:none!important;transition:none!important}
      /* SEM_FOGUETE=1 dá a referência "sem foguete nenhum" na MESMA rodada e no
         mesmo código. É 'visibility', e não 'display', porque a caixa do <svg>
         tem de continuar existindo: é dela que sai o recorte do "pior sob o
         foguete", e sem geometria não há com o que comparar. */
      ${process.env.SEM_FOGUETE ? '[data-foguete="social"] svg{visibility:hidden!important}' : ''}
      /* ANTES_BRANCO=1 devolve à silhueta o branco chapado que ela tinha antes da
         SIS-234, só para a FOTO de comparação: o código já mudou, e o servidor de
         desenvolvimento lê a árvore de trabalho, então não há como fotografar o
         estado antigo sem desfazer a mudança. Isto pinta por cima, não reverte —
         serve para a foto "antes", nunca para número. */
      ${
        process.env.ANTES_BRANCO
          ? '[data-foguete="social"] svg :is(path,ellipse){fill:#ffffff!important;fill-opacity:.78!important;stroke:none!important}'
          : ''
      }`,
  });
  const continuar = pagina.getByRole('button', { name: 'Continuar' });
  if (await continuar.count()) {
    await continuar.first().click();
    await pagina.waitForTimeout(600);
  }
  await pagina.waitForTimeout(1500);

  const caixa = await pagina.evaluate(() => {
    const s = document.querySelector('[data-foguete="social"]').parentElement;
    const r = s.getBoundingClientRect();
    return { topo: r.top + window.scrollY, altura: r.height };
  });

  let pior = null;
  /* DOIS piores, e não um. O pior global mede a seção inteira e inclui fundos que
     não têm nada a ver com esta issue (a placa translúcida do `glass-card`, a
     emenda do gradiente). O pior SOB O FOGUETE só olha glifos que caem dentro da
     caixa do `<svg>` — é esse que responde à pergunta da issue, "o foguete
     colorido derruba o texto?". Sem separar os dois, uma reprovação herdada da
     página seria lida como estrago meu. */
  let piorFoguete = null;
  let emQuadro = 0;
  for (let i = 0; i < PASSOS; i += 1) {
    const p = i / (PASSOS - 1);
    const y = caixa.topo - 900 + p * (caixa.altura + 900);
    await pagina.evaluate((alvo) => window.scrollTo(0, Math.max(0, alvo)), y);
    await pagina.waitForTimeout(700);

    /* O foguete está em quadro? A silhueta é o `<svg>` dentro da camada. */
    const svg = await pagina.evaluate(() => {
      const el = document.querySelector('[data-foguete="social"] svg');
      const r = el.getBoundingClientRect();
      return {
        top: Math.round(r.top),
        bottom: Math.round(r.bottom),
        left: Math.round(r.left),
        right: Math.round(r.right),
        h: Math.round(r.height),
      };
    });
    const visivel = svg.bottom > 0 && svg.top < 900;
    if (visivel) emQuadro += 1;

    /* Foto 1: como o visitante vê (serve de referência para achar os glifos). */
    const fotoComTexto = await pagina.screenshot();

    /* Foto 2: texto invisível, layout intacto. */
    await pagina.addStyleTag({
      content: `.medindo-fundo :is(h2,h3,p,li,span,a,strong){visibility:hidden!important}`,
    });
    await pagina.evaluate(() => {
      document
        .querySelector('[data-foguete="social"]')
        .parentElement.classList.add('medindo-fundo');
    });
    await pagina.waitForTimeout(250);
    const foto = await pagina.screenshot();
    await pagina.evaluate(() => {
      document
        .querySelector('[data-foguete="social"]')
        .parentElement.classList.remove('medindo-fundo');
    });

    const { data, info } = await sharp(foto)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const comTexto = (
      await sharp(fotoComTexto).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
    ).data;
    const alvos = await pagina.evaluate(() => {
      const secao = document.querySelector('[data-foguete="social"]').parentElement;
      return [...secao.querySelectorAll('h2,h3,p')]
        .filter((el) => el.textContent.trim().length > 8)
        .map((el) => {
          const r = el.getBoundingClientRect();
          return {
            tag: el.tagName,
            texto: el.textContent.trim().slice(0, 34),
            cor: getComputedStyle(el).color,
            x: Math.round(r.left),
            y: Math.round(r.top),
            w: Math.round(r.width),
            h: Math.round(r.height),
          };
        })
        .filter((a) => a.h > 0 && a.y + a.h > 0 && a.y < 900);
    });

    for (const a of alvos) {
      const [tr, tg, tb] = a.cor.match(/[\d.]+/g).map(Number);
      const lt = lum(tr, tg, tb);
      let piorL = 1;
      let piorPx = null;
      let piorLFog = 1;
      let piorPxFog = null;
      const x0 = Math.max(0, a.x);
      const x1 = Math.min(info.width - 1, a.x + a.w);
      const y0 = Math.max(0, a.y);
      const y1 = Math.min(info.height - 1, a.y + a.h);
      for (let yy = y0; yy < y1; yy += 1) {
        for (let xx = x0; xx < x1; xx += 1) {
          const idx = (yy * info.width + xx) * info.channels;
          /* Máscara de glifo: o pixel só conta se a letra o mudou de verdade. O
             limiar de 40 por canal descarta o antialiasing de franja, que mistura
             tinta e fundo e faria a medida acusar um fundo que não existe. */
          const dif =
            Math.abs(comTexto[idx] - data[idx]) +
            Math.abs(comTexto[idx + 1] - data[idx + 1]) +
            Math.abs(comTexto[idx + 2] - data[idx + 2]);
          if (dif < 40) continue;
          const L = lum(data[idx], data[idx + 1], data[idx + 2]);
          if (L < piorL) {
            piorL = L;
            piorPx = [data[idx], data[idx + 1], data[idx + 2]];
          }
          const dentroDoFoguete =
            xx >= svg.left && xx <= svg.right && yy >= svg.top && yy <= svg.bottom;
          if (dentroDoFoguete && L < piorLFog) {
            piorLFog = L;
            piorPxFog = [data[idx], data[idx + 1], data[idx + 2]];
          }
        }
      }
      const rz = razao(lt, piorL);
      if (!pior || rz < pior.rz) pior = { ...a, rz, piorPx, passo: i, p: p.toFixed(2) };
      if (piorPxFog) {
        const rzf = razao(lt, piorLFog);
        if (!piorFoguete || rzf < piorFoguete.rz) {
          piorFoguete = { ...a, rz: rzf, piorPx: piorPxFog, passo: i };
        }
      }
    }

    /* Fotos só nos passos com o foguete bem em quadro, para a issue. */
    if (visivel && (i === Math.floor(PASSOS / 2) || i === Math.floor(PASSOS / 2) + 2)) {
      await pagina.screenshot({ path: `${PASTA}/sis234-${MARCA}-${largura}-p${i}.png` });
    }
  }
  console.log(
    `${largura}: foguete em quadro em ${emQuadro}/${PASSOS} passos | pior contraste ${pior.rz.toFixed(2)}:1 ` +
      `(${pior.tag} "${pior.texto}", cor ${pior.cor}, pior pixel rgb(${pior.piorPx.join(' ')}), passo ${pior.passo})`,
  );
  console.log(
    piorFoguete
      ? `   sob o foguete: ${piorFoguete.rz.toFixed(2)}:1 (${piorFoguete.tag} "${piorFoguete.texto}", ` +
          `pior pixel rgb(${piorFoguete.piorPx.join(' ')}), passo ${piorFoguete.passo})`
      : '   sob o foguete: nenhum glifo cai dentro da caixa do foguete',
  );
  await contexto.close();
}
await navegador.close();
