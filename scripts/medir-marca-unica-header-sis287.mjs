/* SIS-287 (2ª volta) — mede o navbar de `/sistran-labs` e `/sistran-university`
   depois de o par de marcas virar marca única.

   O que cada leitura prova, e por que é esta:

   • QUANTAS marcas e QUANTOS links há na pílula antes da nav. O critério da issue
     é «só a logo da página»: isso se mede contando `<img>` dentro do bloco de
     marca, não olhando a captura — uma segunda marca escondida por classe
     continuaria no DOM e a captura não a mostraria.
   • O DIVISOR não existe mais. Ele era um `<span aria-hidden>` de 1px; procurar
     por `w-px` no bloco é o jeito de dizer «não sobrou fio», e não «não vejo fio».
   • O DESTINO do link da marca, resolvido. A issue pede a própria rota (item 3).
   • A ALTURA PINTADA da tinta, medida em `getBoundingClientRect` do invólucro
     recortado — é o número que a issue chama de «caber bem na pílula», e é
     também o que muda nesta volta a partir de 1440 (antes 30/23px, agora
     herdando `md`: 42/40px).
   • A LARGURA que a marca ocupa contra o ESPAÇO QUE SOBRA na fila do header. É o
     portão de verdade: a régua da 1ª volta era o orçamento de ~201px a 1440, e
     relaxar as alturas só se justifica se a marca sozinha ainda entrar. Medido
     como (largura da caixa de conteúdo) − (nav + respiro + botão), contra a
     largura da marca — números, não impressão.
   • A pílula NÃO transbordou: `scrollWidth <= clientWidth` no invólucro do
     header, nos quatro tamanhos. 360 entra porque foi a janela que estourava na
     1ª volta, e continua sendo o pior caso do mobile.
   • UMA ROTA COMUM (`/esg`) lida em cada tamanho, para provar o item 6: a logo
     corporativa segue sendo o `<Image>` solto de 4,5/5,5rem, sem recorte. «Não
     mexi nas outras rotas» só vale como medida. */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/361ceb562f3b3235/node_modules/playwright/index.mjs';

const EXEC =
  process.env.LOCALAPPDATA +
  '/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe';
const BASE = 'http://localhost:3000';

const navegador = await chromium.launch({ executablePath: EXEC });

async function abrir(rota, largura, altura) {
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
  await p.goto(BASE + rota, { waitUntil: 'networkidle' });
  await p.waitForSelector('[data-route-liberado="true"]', { timeout: 20000 }).catch(() => {});
  await p.addStyleTag({ content: 'nextjs-portal{display:none!important}' });
  return { ctx, p };
}

/* O bloco de marca é o PRIMEIRO filho de conteúdo da pílula que não é a nav nem
   o botão. Em vez de adivinhar seletor, a leitura acha o link cujo `<img>` é uma
   das artes de marca — assim serve tanto ao ramo de marca própria (link único)
   quanto ao das rotas comuns (link para `/`). */
const lerHeader = () => {
  /* O PRÓPRIO `<header>` é a fila de flex (a pílula): `flex items-center
     justify-between … px-3 pl-5`. A 1ª volta desta sonda lia
     `header.querySelector('div')` como «invólucro de conteúdo» e pegava a camada
     decorativa de dentro — daí `caixaConteudo: 100.6` e sobras negativas, número
     do medidor e não da página. A caixa útil é a largura do header menos os
     20+12px de respiro, e é nela que `scrollWidth` vale como teste de
     transbordo. */
  const header = document.querySelector('header');
  const inv = header;
  const RESPIRO = 20 + 12;
  const imgs = [...header.querySelectorAll('img')].filter((i) =>
    /logo|corp/i.test(i.getAttribute('src') || ''),
  );
  const marcas = imgs.map((i) => {
    /* O que se VÊ é o invólucro recortado (`overflow-hidden`), quando existe;
       nas rotas comuns a própria `<img>` é a caixa. */
    const alvo = i.closest('span.overflow-hidden') || i;
    const r = alvo.getBoundingClientRect();
    const link = i.closest('a');
    return {
      arquivo: (i.getAttribute('src') || '').replace(/^.*?(images|_next).*?(%2F|\/)/, '…/'),
      alt: i.getAttribute('alt'),
      recortada: Boolean(i.closest('span.overflow-hidden')),
      larguraPintada: Math.round(r.width * 10) / 10,
      alturaPintada: Math.round(r.height * 10) / 10,
      destino: link ? new URL(link.href).pathname : null,
      rotulo: link ? link.getAttribute('aria-label') : null,
    };
  });

  const nav = header.querySelector('nav[aria-label="Navegação principal"]');
  const navVisivel = nav ? getComputedStyle(nav).display !== 'none' : false;
  const botao = [...header.querySelectorAll('button, a')].find((e) =>
    /fale com a gente/i.test(e.textContent || ''),
  );
  const larguraUtil = inv.getBoundingClientRect().width - RESPIRO;
  const larguraNav = navVisivel ? nav.getBoundingClientRect().width : 0;
  const larguraBotao = botao ? botao.getBoundingClientRect().width : 0;

  return {
    marcas,
    /* Fio vertical do par: 1px de largura, `aria-hidden`. Zero é o esperado. */
    divisores: [...inv.querySelectorAll('span[aria-hidden]')].filter(
      (s) => Math.round(s.getBoundingClientRect().width) === 1,
    ).length,
    navVisivel,
    larguraNav: Math.round(larguraNav * 10) / 10,
    larguraBotao: Math.round(larguraBotao * 10) / 10,
    caixaConteudo: Math.round(larguraUtil * 10) / 10,
    /* O que sobra para a marca depois de nav, `mr-3` (12px), botão e — quando o
       menu compacto não está em cena — o botão de abrir menu (44 + 8px). */
    sobraParaMarca:
      Math.round(
        (larguraUtil -
          larguraNav -
          (navVisivel ? 12 : 0) -
          larguraBotao -
          (navVisivel ? 0 : 52)) *
          10,
      ) / 10,
    transbordou: inv.scrollWidth > inv.clientWidth,
  };
};

const saida = { issue: 'SIS-287', volta: '2ª (marca única)', leituras: {} };
const TAMANHOS = [
  [360, 800],
  [390, 844],
  [1280, 900],
  [1440, 900],
];
const ROTAS = ['/sistran-labs', '/sistran-university', '/esg'];

for (const rota of ROTAS) {
  for (const [largura, altura] of TAMANHOS) {
    const { ctx, p } = await abrir(rota, largura, altura);
    saida.leituras[`${rota} @${largura}`] = await p.evaluate(lerHeader);
    /* Capturas pedidas pelo item 7: só 390 e 1440, só nas duas rotas da issue. */
    if (rota !== '/esg' && (largura === 390 || largura === 1440)) {
      await p.screenshot({
        path: `docs/capturas/sis287-${largura}-${rota.slice(1)}.png`,
        clip: { x: 0, y: 0, width: largura, height: 140 },
      });
    }
    await ctx.close();
  }
}

await navegador.close();
console.log(JSON.stringify(saida, null, 2));
