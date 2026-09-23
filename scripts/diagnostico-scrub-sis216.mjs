/**
 * SIS-216 — diagnóstico: o percurso do scrub coincide com a janela em que o
 * trecho está VISÍVEL?
 *
 * A sonda de aceite (medir-scrub-contato-sis216.mjs) provou que o valor reage e
 * reverte. Ela NÃO provou que ele reage enquanto o trecho está na tela: um
 * percurso que termina antes do bloco aparecer passa em todos aqueles portões e
 * não se vê nada. Aqui a pergunta é só essa, para cada trecho:
 *   • em que intervalo de `scrollY` o valor está estritamente entre 0 e 1;
 *   • em que intervalo de `scrollY` a caixa do trecho está dentro da janela;
 *   • quanto o valor ANDA por 100px de rolagem dentro da janela visível.
 * O último número é o que o olho sente.
 */

import { writeFileSync } from 'node:fs';

const PLAYWRIGHT =
  'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/361ceb562f3b3235/node_modules/playwright/index.mjs';
const SHELL =
  process.env.LOCALAPPDATA +
  '/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe';

const { chromium } = await import(PLAYWRIGHT);
const navegador = await chromium.launch({ executablePath: SHELL });
const ctx = await navegador.newContext({ viewport: { width: 1440, height: 900 } });
await ctx.addInitScript(() => {
  localStorage.setItem('sistran-motion-preference', 'full');
  localStorage.setItem('sistran-motion-preference-seen', '1');
  sessionStorage.setItem('sistran:intro-visto', 'true');
});
const p = await ctx.newPage();
await p.goto('http://localhost:3000/contato', { waitUntil: 'domcontentloaded' });
await p.waitForSelector('[data-route-liberado="true"]', { timeout: 30000 });
await p.addStyleTag({ content: 'nextjs-portal{display:none!important}' });
await p.waitForTimeout(800);

/* Passo fino (100px) e SEM esperar a inércia: aqui não se compara pontos, se
   levanta a curva. `scrub` só atrasa o valor, não muda o percurso. */
const altura = await p.evaluate(() => document.body.scrollHeight);
const amostras = [];
for (let y = 0; y <= altura - 900; y += 100) {
  await p.evaluate((alvo) => window.scrollTo(0, alvo), y);
  await p.waitForTimeout(450);
  amostras.push(
    await p.evaluate(() => {
      const ler = (sel, alvoSel) => {
        const esc = document.querySelector(sel);
        if (!esc) return null;
        const alvo = document.querySelector(alvoSel);
        const cx = (esc.dataset.scrubNome === 'malha-cena-contato'
          ? esc.parentElement
          : esc
        ).getBoundingClientRect();
        return {
          p: Number(getComputedStyle(esc).getPropertyValue('--scrub-p').trim()),
          /* Fração da caixa do trecho que está dentro da janela: é isso que
             define «o usuário está olhando para ele». */
          visivel:
            Math.max(0, Math.min(cx.bottom, innerHeight) - Math.max(cx.top, 0)) /
            Math.min(cx.height, innerHeight),
          /* Para a malha o canal principal é `background-position` (a caixa é
             `background-attachment: fixed`, então `translate` não a moveria); a
             opacidade virou acento secundário e vai medida ao lado. */
          computado:
            alvoSel === '.contato-indicadores-grade'
              ? getComputedStyle(alvo).translate
              : getComputedStyle(alvo).backgroundPosition,
          opacidade: Number(getComputedStyle(alvo).opacity),
        };
      };
      return {
        y: Math.round(scrollY),
        faixa: ler('.contato-indicadores-scrub', '.contato-indicadores-grade'),
        malha: ler('.contato-cena-scrub', '.contato-cena-scrub .grade-tecnica'),
      };
    }),
  );
}

const analisar = (chave) => {
  const pts = amostras.map((a) => ({ y: a.y, ...a[chave] })).filter((x) => x.p != null);
  const emCurso = pts.filter((x) => x.p > 0.001 && x.p < 0.999);
  const naTela = pts.filter((x) => x.visivel > 0.5);
  const cruzamento = pts.filter((x) => x.visivel > 0.5 && x.p > 0.001 && x.p < 0.999);
  /* Velocidade do valor por 100px de rolagem, só nos trechos visíveis. */
  const vel = [];
  for (let i = 1; i < pts.length; i++) {
    if (pts[i].visivel > 0.5) vel.push(Math.abs(pts[i].p - pts[i - 1].p));
  }
  return {
    percursoY: emCurso.length ? [emCurso[0].y, emCurso.at(-1).y] : null,
    visivelY: naTela.length ? [naTela[0].y, naTela.at(-1).y] : null,
    amostrasVisiveisComPercurso: cruzamento.length,
    amostrasVisiveis: naTela.length,
    pQuandoVisivel: naTela.map((x) => ({ y: x.y, p: x.p, computado: x.computado })),
    deltaPPor100pxVisivel: vel.length
      ? Math.round((vel.reduce((a, b) => a + b, 0) / vel.length) * 10000) / 10000
      : null,
  };
};

const saida = { faixa: analisar('faixa'), malha: analisar('malha'), amostras };
writeFileSync('docs/medidas/sis216-diagnostico.json', JSON.stringify(saida, null, 2));
console.log(JSON.stringify({ faixa: saida.faixa, malha: saida.malha }, null, 2));
await navegador.close();
