/* SIS-279 — mede o menu depois de apagar `/transformacao-legado`.

   O que cada leitura prova, e por que é esta:

   • NENHUM `href` vivo para a rota morta, no header E no rodapé, lido do DOM. O
     grep no `src/` acha o que está escrito; só o DOM diz o que foi PARA a página
     (um item pode nascer de dados, como nasceu este, e o grep não o vê montado).
   • «Soluções, Serviços e Consultoria» continua LINK para `/solucoes` e NÃO tem
     mais gatilho de submenu. Tirar o filho e deixar o chevron seria pior que
     antes: uma seta que promete lista e abre um item só, repetindo o pai. Conta
     os botões de submenu por rótulo, em vez de olhar a captura.
   • O submenu de «Quem somos» SEGUE existindo com os seus cinco filhos — é o
     controle de que o que saiu foi o ramo de Soluções e não o mecanismo de
     submenu inteiro.
   • O REALCE de `/solucoes/[slug]`: a rota dinâmica acendia por ser filha
     declarada? Não — acende por PREFIXO em `matchActive`. Sem o submenu isso
     passa a ser o único caminho, então é medido na rota real
     `/solucoes/match-ai`.
   • A ROTA MORTA devolve 404 e o `<h1>`/título da página de erro aparece, em vez
     de um layout meio montado. */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/361ceb562f3b3235/node_modules/playwright/index.mjs';

const EXEC =
  process.env.LOCALAPPDATA +
  '/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe';
const BASE = 'http://localhost:3000';

const navegador = await chromium.launch({ executablePath: EXEC });

async function abrir(rota, largura = 1440, altura = 900) {
  const ctx = await navegador.newContext({
    viewport: { width: largura, height: altura },
    deviceScaleFactor: 1,
  });
  await ctx.addInitScript(() => {
    localStorage.setItem('sistran-motion-preference', 'full');
    localStorage.setItem('sistran-motion-preference-seen', '1');
    sessionStorage.setItem('sistran:intro-visto', 'true');
  });
  const p = await ctx.newPage();
  const resp = await p.goto(BASE + rota, { waitUntil: 'networkidle' });
  await p.waitForSelector('[data-route-liberado="true"]', { timeout: 20000 }).catch(() => {});
  await p.addStyleTag({ content: 'nextjs-portal{display:none!important}' });
  return { ctx, p, status: resp?.status() ?? null };
}

const lerMenu = () => {
  const header = document.querySelector('header');
  const rodape = document.querySelector('footer');
  const hrefs = (raiz) =>
    [...(raiz?.querySelectorAll('a[href]') ?? [])].map((a) => a.getAttribute('href'));
  const solucoes = [...header.querySelectorAll('nav a')].find(
    (a) => a.textContent.trim() === 'Soluções, Serviços e Consultoria',
  );
  /* Gatilho de submenu = `<button>` cujo nome acessível cita o rótulo do pai. */
  const gatilhos = [...header.querySelectorAll('nav button')].map(
    (b) => b.getAttribute('aria-label') || b.textContent.trim(),
  );
  return {
    hrefsMortosNoHeader: hrefs(header).filter((h) => h.includes('transformacao-legado')),
    hrefsMortosNoRodape: hrefs(rodape).filter((h) => h.includes('transformacao-legado')),
    solucoes: solucoes
      ? {
          tag: solucoes.tagName.toLowerCase(),
          href: solucoes.getAttribute('href'),
          corRealce: getComputedStyle(solucoes).color,
          ariaCurrent: solucoes.getAttribute('aria-current'),
        }
      : null,
    gatilhosDeSubmenu: gatilhos,
    /* Duas voltas erradas antes desta, e as duas mediam o INSTRUMENTO: `nav > ul
       > li` deu 0 (a lista não é filha direta do `<nav>`) e depois `nav li`
       devolveu só itens de submenu repetidos — no header deste site os `<li>`
       existem apenas DENTRO dos submenus; o primeiro nível são `<a>` soltos na
       fila de flex. Então a leitura certa é: âncoras do `<nav>` que não estão
       marcadas como item de submenu.

       A lista sai DUAS VEZES de propósito, e não é defeito: o menu de desktop e o
       do drawer coexistem no DOM (um escondido por media query), e os itens do
       submenu do drawer não levam `data-item-submenu`. O que a leitura tem de
       mostrar é que «Transformação de Legado» não aparece em NENHUMA das duas
       cópias — filtrar uma delas esconderia metade do critério. */
    rotulosDePrimeiroNivel: [...header.querySelectorAll('nav a')]
      .filter((a) => !a.hasAttribute('data-item-submenu'))
      .map((a) => a.textContent.trim()),
  };
};

const saida = { issue: 'SIS-279', leituras: {} };

for (const rota of ['/', '/solucoes', '/solucoes/match-ai']) {
  const { ctx, p, status } = await abrir(rota);
  saida.leituras[rota] = { status, ...(await p.evaluate(lerMenu)) };
  await ctx.close();
}

/* «Quem somos» continua abrindo: controle de que o mecanismo de submenu ficou. */
{
  const { ctx, p } = await abrir('/');
  await p.getByRole('button', { name: /Quem somos/i }).first().hover();
  await p.waitForTimeout(500);
  saida.submenuQuemSomos = await p.evaluate(() =>
    [...document.querySelectorAll('[data-item-submenu]')].map((a) => a.textContent.trim()),
  );
  await ctx.close();
}

/* A rota morta. */
{
  const { ctx, p, status } = await abrir('/transformacao-legado');
  saida.rotaMorta = {
    status,
    titulo: await p.title(),
    textoVisivel: (await p.locator('body').innerText()).slice(0, 120).replace(/\s+/g, ' '),
  };
  await ctx.close();
}

await navegador.close();
console.log(JSON.stringify(saida, null, 2));
