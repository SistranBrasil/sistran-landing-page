/**
 * SIS-165 (29/09) — mede o fluxo de anéis de `/quem-somos` nas três larguras do
 * aceite (390 / 768 / 1440) e confere, no DOM renderizado, as escritas que a issue
 * manda tirar e manter.
 *
 * Por que sonda e não leitura de código: quatro dos seis itens de aceite são
 * afirmações sobre a PÁGINA («zero "Modelos de atuação" visível», «3 em linha»,
 * «sem overflow», «reduced-motion ok»), e nenhuma delas se responde pelo JSX —
 * `container-lp`, `section-py` e os `clamp()` do CSS só têm valor depois de
 * resolvidos pelo navegador.
 *
 * Duas decisões de método:
 *   1. «3 em linha» é medido pelo `top` dos três nós, não pelo CSS: colunas de
 *      grade com conteúdo de alturas diferentes continuam na mesma linha, e é isso
 *      que a afirmação quer dizer.
 *   2. A busca por «Modelos de atuação» / «Outsourcing» roda em `innerText` da
 *      seção E da página inteira. `textContent` traria texto de nó escondido e
 *      `innerText` é o que a pessoa lê — mas o par interessa: se a expressão existir
 *      só no `textContent`, é sinal de sobra invisível no DOM, e não de aceite.
 *
 * Uso: node scripts/medir-modelos-fluxo-sis165.mjs
 */

import { writeFileSync } from 'node:fs';

const PLAYWRIGHT =
  'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/361ceb562f3b3235/node_modules/playwright/index.mjs';
const SHELL =
  process.env.LOCALAPPDATA +
  '/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe';

const BASE = 'http://localhost:3000';
const SAIDA = 'docs/medidas/modelos-fluxo-sis165.json';

const { chromium } = await import(PLAYWRIGHT);
const navegador = await chromium.launch({ executablePath: SHELL });

async function abrir({ largura, reduce = false }) {
  const ctx = await navegador.newContext({
    viewport: { width: largura, height: 960 },
    ...(reduce ? { reducedMotion: 'reduce' } : {}),
  });
  await ctx.addInitScript((pref) => {
    if (pref) {
      localStorage.setItem('sistran-motion-preference', pref);
      localStorage.setItem('sistran-motion-preference-seen', '1');
    }
    sessionStorage.setItem('sistran:intro-visto', 'true');
  }, reduce ? null : 'full');
  const p = await ctx.newPage();
  /* `domcontentloaded`: sob `next dev` o `networkidle` nunca chega (canal HMR). */
  await p.goto(`${BASE}/quem-somos`, { waitUntil: 'domcontentloaded' });
  await p.waitForSelector('.mfx-secao', { timeout: 90000 });
  await p.addStyleTag({ content: 'nextjs-portal{display:none!important}' });
  await p.waitForTimeout(1200);
  return { ctx, p };
}

const LER = () => {
  const secao = document.querySelector('.mfx-secao');
  const cx = (n) => getComputedStyle(n);
  const cxx = (n) => {
    const r = n.getBoundingClientRect();
    return {
      x: Math.round(r.left),
      y: Math.round(r.top + window.scrollY),
      w: Math.round(r.width),
      h: Math.round(r.height),
    };
  };
  const nos = Array.from(secao.querySelectorAll('.mfx-no'));
  const setas = Array.from(secao.querySelectorAll('.mfx-seta'));
  const aneis = Array.from(secao.querySelectorAll('.mfx-aneis'));
  const orbe = secao.querySelector('.mfx-orbe-eixo');
  const texto = secao.innerText;
  return {
    /* Transbordo horizontal: uma composição em fileira é o lugar clássico de
       estourar, e o portão é do DOCUMENTO — um filho que vaza já empurra aqui. */
    transbordoDocumento: document.documentElement.scrollWidth - window.innerWidth,
    transbordoDaSecao: Math.round(secao.scrollWidth - secao.clientWidth),
    manchete: secao.querySelector('h2')?.innerText.replace(/\s+/g, ' ').trim() ?? null,
    manchetePresente: /Temos uma abordagem completa de projetos para o mercado Segurador/.test(
      secao.innerText.replace(/\s+/g, ' '),
    ),
    /* Os dois que TÊM de valer zero. */
    eyebrowVisivel: /Modelos de atuação/i.test(texto),
    eyebrowNoDom: /Modelos de atuação/i.test(document.body.textContent),
    outsourcingVisivel: /Outsourcing/i.test(texto),
    outsourcingNoDom: /Outsourcing/i.test(document.body.textContent),
    fraseOutsourcingNoDom: /Operação contínua com eficiência/i.test(document.body.textContent),
    /* Os três nós, na ordem do DOM. */
    nos: nos.map((n) => ({
      titulo: n.querySelector('.mfx-no-titulo')?.textContent ?? null,
      texto: n.querySelector('.mfx-no-texto')?.textContent ?? null,
      caixa: cxx(n),
      /* O anel é quadrado? (diâmetro igual nos dois eixos, como o viewBox pede.) */
      anel: cxx(n.querySelector('.mfx-aneis')),
      iconeVisivel: (() => {
        const i = n.querySelector('.mfx-icone-svg');
        const r = i.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && cx(i).visibility !== 'hidden';
      })(),
    })),
    /* «3 em linha» = os três nós compartilham a linha (mesmo `top`, ±2px). */
    mesmaLinha:
      nos.length === 3 &&
      Math.max(...nos.map((n) => n.getBoundingClientRect().top)) -
        Math.min(...nos.map((n) => n.getBoundingClientRect().top)) <=
        2,
    /* Duas setas para três nós — nunca uma sobrando depois do último. */
    setas: setas.map((s) => ({ caixa: cxx(s), posicao: cx(s).position })),
    /* A seta encosta nos anéis sem invadi-los? Folga de cada lado, em px. */
    folgaDasSetas: setas.map((s) => {
      const r = s.getBoundingClientRect();
      const i = nos.indexOf(s.closest('.mfx-no'));
      const anterior = aneis[i - 1]?.getBoundingClientRect();
      const atual = aneis[i]?.getBoundingClientRect();
      if (!anterior || !atual) return null;
      return {
        entreAnel: [i - 1, i],
        folgaEsquerda: Math.round(r.left - anterior.right),
        folgaDireita: Math.round(atual.left - r.right),
      };
    }),
    orbe: orbe
      ? {
          animacao: cx(orbe).animationName,
          correndo: orbe.getAnimations().some((a) => a.playState === 'running'),
          /* Visível é o que importa sob movimento reduzido: parar não pode
             esconder. */
          opacidadeDoPonto: Number(cx(secao.querySelector('.mfx-orbe')).opacity),
        }
      : null,
    motion: document.documentElement.getAttribute('data-motion'),
  };
};

const resultado = {
  issue: 'SIS-165',
  nota: 'gerado por scripts/medir-modelos-fluxo-sis165.mjs',
};

for (const largura of [390, 768, 1440]) {
  const { ctx, p } = await abrir({ largura });
  resultado[largura] = await p.evaluate(LER);
  await p.evaluate(() => document.querySelector('.mfx-secao').scrollIntoView());
  await p.waitForTimeout(400);
  await p.screenshot({ path: `docs/capturas/sis165-fluxo-${largura}.png` });
  await ctx.close();
}

for (const [rotulo, opcoes] of [
  ['reducePorSistema', { largura: 1440, reduce: true }],
  ['reducePorAtributo', { largura: 1440 }],
]) {
  if (rotulo === 'reducePorAtributo') {
    const { ctx, p } = await abrir({ largura: 1440 });
    await p.evaluate(() => document.documentElement.setAttribute('data-motion', 'reduce'));
    await p.waitForTimeout(400);
    resultado[rotulo] = await p.evaluate(LER);
    await ctx.close();
  } else {
    const { ctx, p } = await abrir(opcoes);
    resultado[rotulo] = await p.evaluate(LER);
    await ctx.close();
  }
}

await navegador.close();
writeFileSync(SAIDA, `${JSON.stringify(resultado, null, 2)}\n`);
console.log(SAIDA);
for (const k of [390, 768, 1440, 'reducePorSistema', 'reducePorAtributo']) {
  const r = resultado[k];
  console.log(
    `\n── ${k} ──\n  transbordo doc=${r.transbordoDocumento} secao=${r.transbordoDaSecao}` +
      `\n  manchete=${r.manchetePresente} | eyebrow vis=${r.eyebrowVisivel} dom=${r.eyebrowNoDom}` +
      ` | outsourcing vis=${r.outsourcingVisivel} dom=${r.outsourcingNoDom} frase=${r.fraseOutsourcingNoDom}` +
      `\n  nos=${r.nos.length} mesmaLinha=${r.mesmaLinha} aneis=${r.nos.map((n) => `${n.anel.w}x${n.anel.h}`).join(' ')}` +
      `\n  titulos=${r.nos.map((n) => n.titulo).join(' / ')}` +
      `\n  setas=${r.setas.length} folgas=${JSON.stringify(r.folgaDasSetas)}` +
      `\n  orbe=${JSON.stringify(r.orbe)} motion=${r.motion}`,
  );
}
