/* Classifica cada faixa de `/quem-somos` em três destinos, MEDINDO em vez de supor
   — é o passo que decide o que entra no pedido «todo fundo que não é azul escuro
   segue o padrão do /solucoes»:

     A) CLARA COM SUPERFÍCIE PRÓPRIA → vira transparente e recebe o plano da rota;
     B) ESCURA COM SUPERFÍCIE PRÓPRIA OPACA → não muda (já traz o próprio palco);
     C) ESCURA SEM SUPERFÍCIE PRÓPRIA → a mais perigosa: hoje ela é escura porque
        deixa passar o azul do `body` (`#1273bc`), e um plano claro no `<main>`
        acenderia o fundo DEBAIXO de texto branco. Toda faixa deste grupo precisa
        trazer o próprio palco escuro, como `.solucoes-palco-servicos` faz na
        outra rota.

   O critério de tom do TEXTO é a luminância mediana das cores de texto da faixa
   (> 170 = texto claro, logo fundo escuro obrigatório). O critério de superfície
   própria é `background-color` com alfa >= 0.98.

     node scripts/classificar-faixas-quem-somos.mjs
*/
import { writeFileSync, mkdirSync } from 'node:fs';
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/361ceb562f3b3235/node_modules/playwright/index.mjs';

const EXE =
  process.env.LOCALAPPDATA +
  '/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe';
const ROTA = process.env.ROTA ?? 'http://localhost:3000/quem-somos';

const nav = await chromium.launch({ executablePath: EXE });
const ctx = await nav.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
await ctx.addInitScript(() => {
  localStorage.setItem('sistran-motion-preference', 'full');
  localStorage.setItem('sistran-motion-preference-seen', '1');
  sessionStorage.setItem('sistran:intro-visto', 'true');
});
const pag = await ctx.newPage();
await pag.goto(ROTA, { waitUntil: 'domcontentloaded' });
await pag.waitForSelector('[data-route-liberado="true"]', { timeout: 30000 });
for (let i = 0; i < 14; i++) {
  await pag.mouse.wheel(0, 900);
  await pag.waitForTimeout(220);
}
await pag.waitForTimeout(1000);

const faixas = await pag.evaluate(() => {
  const lum = (s) => {
    const m = s.match(/[\d.]+/g);
    if (!m) return null;
    return 0.2126 * +m[0] + 0.7152 * +m[1] + 0.0722 * +m[2];
  };
  const alfa = (s) => {
    const m = s.match(/[\d.]+/g);
    if (!m) return 0;
    return m[3] === undefined ? 1 : +m[3];
  };
  const mediana = (v) => (v.length ? v.slice().sort((a, b) => a - b)[Math.floor(v.length / 2)] : null);

  return [...document.querySelector('main').children].map((el) => {
    const cs = getComputedStyle(el);
    /* Texto de verdade: elemento com filho de texto não vazio. */
    const cores = [...el.querySelectorAll('h1,h2,h3,h4,p,li,span,a,blockquote')]
      .filter((t) => (t.textContent ?? '').trim().length > 2 && t.offsetParent !== null)
      .map((t) => lum(getComputedStyle(t).color))
      .filter((v) => v !== null);
    const textoLum = mediana(cores);

    /* Superfície própria opaca: a própria caixa, ou o primeiro descendente que
       cobre a faixa inteira com cor de alfa >= 0.98. */
    const b = el.getBoundingClientRect();
    const opacaPropria = alfa(cs.backgroundColor) >= 0.98;
    const cobertura = [...el.querySelectorAll('*')].find((d) => {
      const dcs = getComputedStyle(d);
      if (alfa(dcs.backgroundColor) < 0.98) return false;
      const db = d.getBoundingClientRect();
      return db.width >= b.width * 0.98 && db.height >= b.height * 0.9;
    });

    const temSuperficie = opacaPropria || Boolean(cobertura);
    const textoClaro = textoLum !== null && textoLum > 170;
    const destino = textoClaro
      ? temSuperficie
        ? 'B_ESCURA_COM_PALCO'
        : 'C_ESCURA_SEM_PALCO'
      : 'A_CLARA_RECEBE_PLANO';

    return {
      classe: (el.className?.toString?.() ?? '').slice(0, 90),
      aria: el.getAttribute('aria-labelledby') ?? el.querySelector('section')?.getAttribute('aria-labelledby') ?? null,
      altura: Math.round(b.height),
      corPropria: cs.backgroundColor,
      temSuperficieOpaca: temSuperficie,
      coberturaPor: cobertura ? (cobertura.className?.toString?.() ?? '').slice(0, 60) : null,
      textoLumMediana: textoLum === null ? null : +textoLum.toFixed(1),
      amostrasDeTexto: cores.length,
      destino,
    };
  });
});

await nav.close();
mkdirSync('docs/medidas', { recursive: true });
writeFileSync(
  'docs/medidas/faixas-quem-somos.json',
  `${JSON.stringify({ rota: ROTA, quando: new Date().toISOString(), faixas }, null, 2)}\n`,
);
for (const f of faixas) {
  console.log(
    `${f.destino.padEnd(22)} h=${String(f.altura).padStart(5)} textoLum=${String(f.textoLumMediana).padStart(6)} ` +
      `(${f.amostrasDeTexto}) superf=${f.temSuperficieOpaca ? 'sim' : 'NÃO'} ${f.aria ?? ''} .${f.classe.slice(0, 50)}`,
  );
}
