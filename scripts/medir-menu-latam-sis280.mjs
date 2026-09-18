/* SIS-280 — mede o item «Sistran Latam» do submenu «Quem somos».

   O que precisa ser provado, e por que a leitura é esta:

   • O DESTINO que o navegador resolveu, e não o `href` escrito. `el.href` (a
     propriedade, não o atributo) devolve a URL absoluta depois de resolvida
     contra a base do documento — é ela que diz se o clique sai do site ou se o
     Next transformou o endereço em rota interna `localhost:3000/latam/`.
   • A TAG. `<Link>` também renderiza `<a>`, então `tagName` sozinho não separa os
     dois ramos; o que separa é o par (destino externo, `target`/`rel` presentes).
   • `target` e `rel` LIDOS DO DOM. `rel="noopener noreferrer"` é o único ponto da
     issue com consequência de segurança — sem `noopener`, a aba de destino recebe
     `window.opener` e pode reescrever esta.
   • Os OUTROS TRÊS filhos, item por item. A issue manda não tocá-los, e «não
     toquei» só vale como número: destino interno, sem `target`, sem `rel`.
   • `aria-current` NA ROTA `/latam` do app. É o caso que a issue nomeia: a rota
     interna continua existindo, e o item do menu não pode se anunciar como «a
     página em que você está» quando ela está aberta. Medido COM a página `/latam`
     carregada, que é a única situação em que o erro apareceria.
   • O DRAWER a 390, separado. São dois trechos de JSX distintos no `Header.tsx`;
     medir só o desktop deixaria metade do critério sem linha.
   • O CLIQUE de verdade, nos dois tamanhos: `context.waitForEvent('page')` pega a
     aba nova. É o que fecha «abre em nova aba» como comportamento e não como
     atributo — e a URL da aba é lida para provar que o destino é o site LATAM.
   • O submenu FECHA depois do clique. A aba nova rouba o foco sem mudar
     `pathname`, e o efeito que fecha o drawer depende de `pathname` — sem o
     `onClick` o menu ficaria aberto por baixo. Estado lido depois do clique. */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/361ceb562f3b3235/node_modules/playwright/index.mjs';

const EXEC =
  process.env.LOCALAPPDATA +
  '/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe';
const BASE = 'http://localhost:3000';

const navegador = await chromium.launch({ executablePath: EXEC });

async function abrir({ largura = 1440, altura = 900, rota = '/' } = {}) {
  const ctx = await navegador.newContext({
    viewport: { width: largura, height: altura },
    deviceScaleFactor: 1,
  });
  await ctx.addInitScript(() => {
    localStorage.setItem('sistran-motion-preference', 'full');
    localStorage.setItem('sistran-motion-preference-seen', '1');
    sessionStorage.setItem('sistran:intro-visto', 'true');
  });
  /* O SITE EXTERNO É DUBLADO, e isto corrige a 1ª volta desta sonda: sem rede
     até `www.sistran.com` a aba nova ficava em `about:blank` e `aba.url()`
     devolvia string vazia — leitura do medidor, não da página. Com a rota
     interceptada, a navegação parte de verdade e a URL fica registrada, sem que a
     medição passe a depender do servidor da Sistran estar de pé. O que a issue
     pede provar é o destino que o clique dispara. */
  await ctx.route('https://www.sistran.com/**', (rota) =>
    rota.fulfill({ status: 200, contentType: 'text/html', body: '<title>dublê LATAM</title>' }),
  );
  const p = await ctx.newPage();
  await p.goto(BASE + rota, { waitUntil: 'networkidle' });
  await p.waitForSelector('[data-route-liberado="true"]', { timeout: 20000 }).catch(() => {});
  await p.addStyleTag({ content: 'nextjs-portal{display:none!important}' });
  return { ctx, p };
}

/* A leitura de um `<a>`, do jeito que o navegador o entende. `getAttribute` para
   `target`/`rel` (queremos o que está escrito, incluindo a AUSÊNCIA nos itens
   internos) e a propriedade `.href` para o destino (queremos o resolvido). */
const lerLinks = (seletor) =>
  [...document.querySelectorAll(seletor)].map((a) => ({
    rotulo: a.textContent.trim(),
    tag: a.tagName.toLowerCase(),
    hrefEscrito: a.getAttribute('href'),
    destinoResolvido: a.href,
    externo: !a.href.startsWith(window.location.origin),
    target: a.getAttribute('target'),
    rel: a.getAttribute('rel'),
    ariaCurrent: a.getAttribute('aria-current'),
  }));

const saida = { issue: 'SIS-280', destinoPedido: 'https://www.sistran.com/latam/' };

/* ── 1440: submenu de desktop ─────────────────────────────────────────────── */
{
  const { ctx, p } = await abrir();
  /* O submenu abre por hover no gatilho «Quem somos»; sem abrir, a lista está
     `hidden` e `querySelectorAll` devolveria os nós mas nada seria clicável. */
  await p.getByRole('button', { name: /Quem somos/i }).first().hover();
  await p.waitForTimeout(500);
  saida.submenuDesktop = await p.evaluate(lerLinks, '[data-item-submenu]');
  saida.submenuAberto = await p.evaluate(
    () => !document.querySelector('[data-item-submenu]').closest('[hidden]'),
  );

  /* O clique, e a aba que ele abre. */
  const [aba] = await Promise.all([
    ctx.waitForEvent('page'),
    p.getByRole('link', { name: 'Sistran Latam' }).first().click(),
  ]);
  /* A aba nasce vazia e só recebe a URL quando a navegação COMETE — `aba.url()`
     lido no instante do evento devolveu string vazia, e `waitForLoadState` não
     resolveu isso porque a aba em branco já estava «carregada». Esperar pela URL
     é o que espera a coisa certa. O `catch` fica para a sonda seguir e a leitura
     mostrar o vazio, em vez de morrer sem escrever nada. */
  await aba.waitForURL(/sistran\.com/, { timeout: 8000 }).catch(() => {});
  saida.abaNovaDesktop = {
    url: aba.url(),
    /* A página de origem NÃO navegou: o `pathname` dela continua na home. */
    origemContinuaEm: new URL(p.url()).pathname,
  };
  await aba.close();
  await p.waitForTimeout(300);
  saida.submenuFechouAposClique = await p.evaluate(
    () => !!document.querySelector('[data-item-submenu]')?.closest('[hidden]'),
  );
  await ctx.close();
}

/* ── 1440 na rota /latam: o item não pode se dizer «página atual» ─────────── */
{
  const { ctx, p } = await abrir({ rota: '/latam' });
  await p.getByRole('button', { name: /Quem somos/i }).first().hover();
  await p.waitForTimeout(500);
  saida.naRotaLatam = {
    rota: new URL(p.url()).pathname,
    submenu: await p.evaluate(lerLinks, '[data-item-submenu]'),
    /* O pai «Quem somos» também é lido: com o filho externo, a rota interna
       `/latam` deixou de acender o ramo — consequência de o menu não apontar mais
       para ela, e está declarada no comentário da issue. */
    paiAceso: await p.evaluate(() => {
      /* O gatilho é o `<a>` «Quem somos» do primeiro nível, não o `<button>` da
         seta — foi o erro da 1ª volta desta sonda, que procurou por `nav button`
         e o texto «Quem somos» mora no link ao lado, não no botão (ele só tem o
         chevron e um rótulo acessível). A cor do LINK é o realce do ramo. */
      const a = [...document.querySelectorAll('header nav a')].find(
        (e) => e.textContent.trim() === 'Quem somos',
      );
      return a
        ? { cor: getComputedStyle(a).color, ariaCurrent: a.getAttribute('aria-current') }
        : null;
    }),
  };
  await ctx.close();
}

/* ── 390: drawer mobile ───────────────────────────────────────────────────── */
{
  const { ctx, p } = await abrir({ largura: 390, altura: 844 });
  await p.getByRole('button', { name: /Abrir menu/i }).click();
  await p.waitForTimeout(600);
  /* O ÚLTIMO `<nav>` do header é o do drawer — a 1ª volta desta sonda usou
     `nav ul a` solto e leu doze itens em vez de seis: o menu de desktop continua
     no DOM (escondido por classe de media query), então os dois submenus caíam na
     mesma lista e cada rótulo aparecia duas vezes. */
  saida.drawer390 = await p.evaluate(() =>
    [...[...document.querySelectorAll('header nav')].pop().querySelectorAll('ul a')].map((a) => ({
      rotulo: a.textContent.trim(),
      tag: a.tagName.toLowerCase(),
      destinoResolvido: a.href,
      externo: !a.href.startsWith(window.location.origin),
      target: a.getAttribute('target'),
      rel: a.getAttribute('rel'),
      ariaCurrent: a.getAttribute('aria-current'),
    })),
  );
  await p.screenshot({ path: 'docs/capturas/sis280-390-drawer.png' });

  /* `.last()` e não `.first()`: o item do menu de DESKTOP tem o mesmo nome
     acessível e vem antes no DOM — clicar nele mediria o ramo errado. */
  const [aba] = await Promise.all([
    ctx.waitForEvent('page'),
    p.getByRole('link', { name: 'Sistran Latam' }).last().click(),
  ]);
  await aba.waitForURL(/sistran\.com/, { timeout: 8000 }).catch(() => {});
  saida.abaNovaMobile = { url: aba.url() };
  await aba.close();
  await p.waitForTimeout(400);
  /* O drawer fecha por ALTURA MÁXIMA e opacidade, não por `hidden`: a leitura é
     do estilo do invólucro, que é o pai do último `<nav>` do header. */
  saida.drawerFechouAposClique = await p.evaluate(() => {
    const d = [...document.querySelectorAll('header nav')].pop().parentElement;
    const s = getComputedStyle(d);
    return { alturaMaxima: s.maxHeight, opacidade: s.opacity, eventos: s.pointerEvents };
  });
  await ctx.close();
}

/* ── captura do submenu de desktop, pedida pelo item 6 ────────────────────── */
{
  const { ctx, p } = await abrir();
  await p.getByRole('button', { name: /Quem somos/i }).first().hover();
  await p.waitForTimeout(600);
  await p.screenshot({ path: 'docs/capturas/sis280-1440-submenu.png', clip: { x: 0, y: 0, width: 1440, height: 320 } });
  await ctx.close();
}

await navegador.close();
console.log(JSON.stringify(saida, null, 2));
