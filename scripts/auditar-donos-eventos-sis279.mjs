/**
 * SIS-279 — auditoria de DONOS e de PERCURSO em `/eventos-inovacao`.
 *
 * Duas perguntas, e nenhuma delas se responde lendo CSS (3.300 linhas entre
 * `events-spotlight.css` e `globals.css`, com regras dentro de media queries):
 *
 *   1. QUEM JÁ TEM DONO. `docs/scroll.md` §6 proíbe somar scrub a um nó que já
 *      tenha reveal CSS, timeline GSAP ou variante de `motion/react`. Aqui isso é
 *      lido do estilo COMPUTADO — `transform`, `translate`, `animation-name`,
 *      `transition-property` — mais a marcação (`data-reveal`, `data-in`).
 *   2. QUE PERCURSO O NÓ TEM. É a pergunta que a SIS-216 me ensinou a fazer ANTES
 *      de escrever CSS: num palco `position: sticky` de ~8.100px, um scrub
 *      amarrado ao curso da cena anda devagar demais para se ver, por mais bem
 *      calibrada que seja a amplitude. Então cada candidato sai com a altura da
 *      caixa, se ele (ou um ancestral) é `sticky`/`fixed`, e o curso que um
 *      ScrollTrigger `top bottom`→`bottom top` teria nele (altura + janela).
 *
 * A saída é a lista de nós SEM dono, ordenada por curso — os candidatos.
 */

import { writeFileSync } from 'node:fs';

const PLAYWRIGHT =
  'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/361ceb562f3b3235/node_modules/playwright/index.mjs';
const SHELL =
  process.env.LOCALAPPDATA +
  '/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe';

const { chromium } = await import(PLAYWRIGHT);
const navegador = await chromium.launch({ executablePath: SHELL });

const saida = {};
for (const largura of [1440, 390]) {
  const ctx = await navegador.newContext({ viewport: { width: largura, height: 900 } });
  await ctx.addInitScript(() => {
    localStorage.setItem('sistran-motion-preference', 'full');
    localStorage.setItem('sistran-motion-preference-seen', '1');
    sessionStorage.setItem('sistran:intro-visto', 'true');
  });
  const p = await ctx.newPage();
  await p.goto('http://localhost:3000/eventos-inovacao', { waitUntil: 'domcontentloaded' });
  await p.waitForSelector('[data-route-liberado="true"]', { timeout: 30000 });
  await p.addStyleTag({ content: 'nextjs-portal{display:none!important}' });
  /* Rola a rota inteira uma vez: o reveal precisa ter acendido para que
     `data-in` e as transições apareçam no estilo computado — auditar sem isso
     declararia «sem dono» um nó que só ainda não foi tocado. */
  await p.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += innerHeight * 0.8) {
      scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 90));
    }
    scrollTo(0, 0);
  });
  await p.waitForTimeout(1000);

  saida[largura] = await p.evaluate(() => {
    const interessa = (el) => {
      const c = typeof el.className === 'string' ? el.className : '';
      return (
        /event|palco|social|destaque|vaga|lista|cena|spotlight/i.test(c) ||
        ['SECTION', 'ASIDE', 'HEADER', 'UL'].includes(el.tagName)
      );
    };
    const nos = [...document.querySelectorAll('*')].filter(interessa);
    const linhas = nos.map((el) => {
      const s = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      /* `sticky`/`fixed` em QUALQUER ancestral: é o ancestral que decide se o nó
         acompanha a rolagem ou fica preso na tela. */
      let presoEm = null;
      for (let a = el; a && a !== document.body; a = a.parentElement) {
        const ps = getComputedStyle(a).position;
        if (ps === 'sticky' || ps === 'fixed') {
          presoEm =
            (typeof a.className === 'string' ? a.className.split(/\s+/)[0] : a.tagName) +
            ':' +
            ps;
          break;
        }
      }
      const donos = [];
      if (s.transform !== 'none') donos.push('transform');
      if (s.translate !== 'none') donos.push('translate');
      if (s.animationName !== 'none') donos.push('animation:' + s.animationName);
      if (s.transitionProperty !== 'all' && s.transitionProperty !== 'none')
        donos.push('transition:' + s.transitionProperty);
      if (el.hasAttribute('data-reveal')) donos.push('data-reveal');
      if (el.hasAttribute('data-in')) donos.push('data-in');
      if (el.hasAttribute('data-scrub-nome')) donos.push('scrub-ja-existe');
      return {
        sel:
          el.tagName.toLowerCase() +
          (typeof el.className === 'string' && el.className
            ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.')
            : ''),
        altura: Math.round(r.height),
        presoEm,
        donos,
        /* Curso de um ScrollTrigger `top bottom` → `bottom top`. */
        curso: Math.round(r.height + innerHeight),
      };
    });
    return {
      alturaDocumento: document.body.scrollHeight,
      semDono: linhas
        .filter((l) => l.donos.length === 0 && l.altura > 40 && !l.presoEm)
        .sort((a, b) => a.curso - b.curso)
        .slice(0, 22),
      semDonoMasPreso: linhas
        .filter((l) => l.donos.length === 0 && l.altura > 40 && l.presoEm)
        .slice(0, 12),
    };
  });
  await ctx.close();
}

await navegador.close();
writeFileSync('docs/medidas/sis279-donos.json', JSON.stringify(saida, null, 2));
for (const [w, d] of Object.entries(saida)) {
  console.log('\n===== ' + w + '  (documento ' + d.alturaDocumento + 'px)');
  console.log('-- SEM DONO e com percurso proprio:');
  for (const l of d.semDono) console.log('   curso', l.curso, '| alt', l.altura, '|', l.sel);
  console.log('-- SEM DONO mas PRESO (sticky/fixed):');
  for (const l of d.semDonoMasPreso) console.log('   ', l.presoEm, '|', l.sel);
}
