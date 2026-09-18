/* SIS-291 — mede a grade «Já desenvolvemos…» de /sistran-labs: os quatro
   cartões presentes, geometria igual, o realce de hover e o estado reduzido. */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/361ceb562f3b3235/node_modules/playwright/index.mjs';

const EXEC =
  process.env.LOCALAPPDATA +
  '/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe';
const URL = 'http://localhost:3000/sistran-labs';

const navegador = await chromium.launch({ executablePath: EXEC });

async function abrir({ largura = 1440, altura = 900, reduce = false } = {}) {
  const ctx = await navegador.newContext({
    viewport: { width: largura, height: altura },
    deviceScaleFactor: 1,
    reducedMotion: reduce ? 'reduce' : 'no-preference',
  });
  await ctx.addInitScript(() => {
    localStorage.setItem('sistran-motion-preference', 'full');
    localStorage.setItem('sistran-motion-preference-seen', '1');
    sessionStorage.setItem('sistran:intro-visto', 'true');
  });
  const p = await ctx.newPage();
  await p.goto(URL, { waitUntil: 'networkidle' });
  await p.waitForSelector('[data-route-liberado="true"]', { timeout: 20000 }).catch(() => {});
  await p.addStyleTag({ content: 'nextjs-portal{display:none!important}' });
  return { ctx, p };
}

function medir() {
  return {
    cartoes: [...document.querySelectorAll('.labs-solucao-cartao')].map((li) => {
      const r = li.getBoundingClientRect();
      const alvo = li.firstElementChild;
      const est = getComputedStyle(li);
      const fio = getComputedStyle(li, '::before');
      const quad = getComputedStyle(li, '::after');
      return {
        nome: li.querySelector('h3')?.textContent,
        descricao: li.querySelector('p')?.textContent,
        ehLink: alvo?.tagName === 'A',
        href: alvo?.getAttribute('href') ?? null,
        temSeta: !!li.querySelector('.labs-solucao-seta'),
        l: Math.round(r.width),
        a: Math.round(r.height),
        x: Math.round(r.x),
        y: Math.round(r.y),
        borda: est.borderTopColor,
        anel: `${est.outlineColor} / ${est.outlineOffset}`,
        fundo: est.backgroundImage.slice(0, 46),
        fioOpacidade: fio.opacity,
        quadradinhoOpacidade: quad.opacity,
        quadradinho: `${quad.width} ${quad.backgroundColor}`,
        corNome: getComputedStyle(li.querySelector('h3')).color,
        corTexto: getComputedStyle(li.querySelector('p')).color,
        escala: est.scale,
      };
    }),
    vaoDaGrade: getComputedStyle(document.querySelector('.labs-solucoes-grade')).gap,
    colunas: getComputedStyle(document.querySelector('.labs-solucoes-grade')).gridTemplateColumns,
  };
}

const saida = { rota: '/sistran-labs', secao: '#labs-solucoes' };

/* 1440 em repouso */
{
  const { ctx, p } = await abrir();
  await p.locator('#labs-solucoes').scrollIntoViewIfNeeded();
  await p.waitForTimeout(900);
  saida.repouso1440 = await p.evaluate(medir);
  await p.locator('#labs-solucoes').evaluate((el) => el.closest('section').scrollIntoView());
  await p.waitForTimeout(600);
  await p.screenshot({ path: 'docs/capturas/sis291-1440-repouso.png' });

  /* hover no primeiro (é link) e no segundo (não é) */
  await p.locator('.labs-solucao-cartao').nth(0).hover();
  await p.waitForTimeout(700);
  saida.hoverPrimeiro = (await p.evaluate(medir)).cartoes[0];
  await p.screenshot({ path: 'docs/capturas/sis291-1440-hover-1.png' });

  await p.locator('.labs-solucao-cartao').nth(1).hover();
  await p.waitForTimeout(700);
  saida.hoverSegundo = (await p.evaluate(medir)).cartoes[1];
  await p.screenshot({ path: 'docs/capturas/sis291-1440-hover-2.png' });

  /* foco por teclado no cartão que é link */
  await p.locator('.labs-solucao-cartao a').first().focus();
  await p.waitForTimeout(500);
  saida.focoPrimeiro = (await p.evaluate(medir)).cartoes[0];
  await ctx.close();
}

/* mobile 1 coluna */
{
  const { ctx, p } = await abrir({ largura: 390, altura: 844 });
  await p.locator('#labs-solucoes').scrollIntoViewIfNeeded();
  await p.waitForTimeout(900);
  saida.mobile390 = await p.evaluate(medir);
  await p.screenshot({ path: 'docs/capturas/sis291-390-repouso.png' });
  await ctx.close();
}

/* reduce */
{
  const { ctx, p } = await abrir({ reduce: true });
  await p.locator('#labs-solucoes').scrollIntoViewIfNeeded();
  await p.waitForTimeout(900);
  await p.locator('.labs-solucao-cartao').nth(0).hover();
  await p.waitForTimeout(600);
  const m = await p.evaluate(medir);
  saida.reduce = {
    escalaNoHover: m.cartoes[0].escala,
    fundoNoHover: m.cartoes[0].fundo,
    corNomeNoHover: m.cartoes[0].corNome,
    transicaoDoCartao: await p.evaluate(
      () => getComputedStyle(document.querySelector('.labs-solucao-cartao')).transitionProperty,
    ),
    setaTranslate: await p.evaluate(() => {
      const s = document.querySelector('.labs-solucao-seta');
      return s ? getComputedStyle(s).translate : null;
    }),
    textosVisiveis: await p.evaluate(() =>
      [...document.querySelectorAll('.labs-solucao-nome, .labs-solucao-texto')].every(
        (n) => getComputedStyle(n).opacity === '1',
      ),
    ),
  };
  await p.screenshot({ path: 'docs/capturas/sis291-1440-reduce-hover.png' });
  await ctx.close();
}

await navegador.close();
console.log(JSON.stringify(saida, null, 2));
