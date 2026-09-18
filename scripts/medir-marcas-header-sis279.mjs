/**
 * SIS-279 — «na University o header mostra Sistran University | Sistran».
 *
 * `node scripts/medir-marcas-header-sis279.mjs`   (servidor em :3781, ou `BASE=`)
 *
 * O que esta sonda mede, e por que assim:
 *
 *  • «Duas marcas, nesta ordem» — não basta contar `<img>`: o que prova a ordem
 *    é a posição horizontal de cada uma dentro da pílula, e o que prova o
 *    DESTINO é o `href` do link ancestral de cada imagem. Um `<a>` aninhado no
 *    outro passaria despercebido na contagem, então conta-se também quantos
 *    links a pílula tem e se algum tem outro dentro.
 *  • «Legíveis e sem corte» — a medida que interessa é a da TINTA, não a da
 *    caixa: os dois arquivos têm área transparente em volta (o corporativo tem
 *    66% da altura vazia). Cada marca é fotografada isolada e o recorte é
 *    reanalisado pixel a pixel; a tinta tem de ENCOSTAR nas quatro bordas do
 *    elemento (prova de que o recorte está calibrado) sem sobrar nada fora, e a
 *    caixa inteira tem de caber na pílula com folga dos dois lados.
 *  • «Respiro equilibrado» — a folga à esquerda e à direita do divisor, medida
 *    entre as caixas de tinta. Como o elemento É a tinta, a distância medida é a
 *    distância que se vê.
 *  • «Não colide com nav/CTA/toggle» — interseção de retângulos, não inspeção
 *    visual, mais o `scrollWidth` do documento para vazamento horizontal.
 *  • «Foco de teclado» — três Tabs a partir do topo, registrando o nome
 *    acessível de cada parada: a ordem tem de ser University, Sistran, e só
 *    então o resto do header.
 *  • Rota de controle (`/contato` e `/`) — uma imagem e um link na pílula, e o
 *    `data-morph-target` continua único, que é o contrato do efeito da home.
 */
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const BASE = process.env.BASE ?? 'http://localhost:3781';
const LARGURAS = [
  { w: 390, h: 844 },
  { w: 1440, h: 900 },
];
const ROTAS = [
  { rota: '/sistran-university', marca: 'university' },
  { rota: '/contato', marca: 'controle-contato' },
  { rota: '/', marca: 'controle-home' },
];

await mkdir('docs/capturas/sis279', { recursive: true });
await mkdir('docs/medidas', { recursive: true });

/* Caixa dos pixels pintados dentro de uma imagem PNG em base64. Roda numa aba
   em branco: é só canvas, não depende da página medida. */
const CAIXA_DE_TINTA = async (aba, b64) =>
  aba.evaluate(async (b64) => {
    const img = new Image();
    img.src = `data:image/png;base64,${b64}`;
    await img.decode();
    const c = document.createElement('canvas');
    c.width = img.naturalWidth;
    c.height = img.naturalHeight;
    const ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const d = ctx.getImageData(0, 0, c.width, c.height).data;
    /* «Tinta» aqui é o que DIFERE do fundo da pílula, e não «pixel branco»: o
       emblema da University é azul e roxo, e um corte por luminância o daria
       por inexistente — foi o que aconteceu na primeira rodada, que mediu só a
       palavra branca e relatou 18px de sobra à esquerda que na verdade eram o
       emblema. O fundo vem dos quatro cantos do recorte (a marca nunca ocupa
       os quatro), e 28 de distância euclidiana passa longe da variação do
       degradê da pílula, que não chega a 10 dentro de uma caixa desse tamanho. */
    const px = (x, y) => {
      const i = (y * c.width + x) * 4;
      return [d[i], d[i + 1], d[i + 2]];
    };
    const cantos = [
      px(0, 0),
      px(c.width - 1, 0),
      px(0, c.height - 1),
      px(c.width - 1, c.height - 1),
    ];
    const fundo = [0, 1, 2].map((k) => cantos.map((p) => p[k]).sort((a, b) => a - b)[1]);
    let x0 = c.width, y0 = c.height, x1 = -1, y1 = -1;
    for (let y = 0; y < c.height; y++) {
      for (let x = 0; x < c.width; x++) {
        const i = (y * c.width + x) * 4;
        const dist = Math.hypot(d[i] - fundo[0], d[i + 1] - fundo[1], d[i + 2] - fundo[2]);
        if (d[i + 3] > 12 && dist > 28) {
          if (x < x0) x0 = x;
          if (x > x1) x1 = x;
          if (y < y0) y0 = y;
          if (y > y1) y1 = y;
        }
      }
    }
    return x1 < 0
      ? null
      : { x0, y0, x1, y1, w: x1 - x0 + 1, h: y1 - y0 + 1, fundo, caixa: { w: c.width, h: c.height } };
  }, b64);

const LEVANTAR = () => {
  const r = (el) => {
    if (!el) return null;
    const b = el.getBoundingClientRect();
    const n = (v) => Math.round(v * 10) / 10;
    return { x: n(b.x), y: n(b.y), w: n(b.width), h: n(b.height), topo: n(b.top), base: n(b.bottom), dir: n(b.right) };
  };
  const cruza = (a, b) =>
    !!a && !!b && a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;

  const header = document.querySelector('header');
  const nav = header.querySelector('nav[aria-label="Navegação principal"]');
  const toggle = header.querySelector('button[aria-label="Abrir menu"], button[aria-label="Fechar menu"]');
  const cta = Array.from(header.querySelectorAll('button')).find((b) =>
    /Fale com a gente/.test(b.textContent || ''),
  );
  const drawer = header.querySelector('[class*="top-[calc(100%"]');

  /* Links de marca = os links do header que NÃO estão dentro da nav nem do
     drawer. É o conjunto que a issue chama de «dentro da pílula». */
  const linksDeMarca = Array.from(header.querySelectorAll('a')).filter(
    (a) => !a.closest('nav') && !(drawer && drawer.contains(a)),
  );
  const imagensDeMarca = Array.from(header.querySelectorAll('img')).filter(
    (i) => !i.closest('nav') && !(drawer && drawer.contains(i)),
  );

  const divisor = Array.from(header.querySelectorAll('span[aria-hidden]')).find(
    (s) => s.getBoundingClientRect().width > 0 && s.getBoundingClientRect().width <= 2 && s.getBoundingClientRect().height > 8,
  );

  return {
    header: r(header),
    alturaPilula: r(header)?.h ?? null,
    quantosLinksDeMarca: linksDeMarca.length,
    linkAninhado: linksDeMarca.some((a) => a.querySelector('a')),
    links: linksDeMarca.map((a) => ({
      href: a.getAttribute('href'),
      rotulo: a.getAttribute('aria-label'),
      caixa: r(a),
    })),
    quantasImagensDeMarca: imagensDeMarca.length,
    imagens: imagensDeMarca.map((i) => ({
      src: i.getAttribute('src'),
      currentSrc: i.currentSrc,
      alt: i.getAttribute('alt'),
      natural: { w: i.naturalWidth, h: i.naturalHeight },
      /* O que o layout mede é o INVÓLUCRO recortado, não o `<img>` (que é maior
         e fica escondido pelo `overflow`). */
      caixaImg: r(i),
      caixaVisivel: r(i.closest('span[class*="overflow-hidden"]') ?? i),
      hrefDoLink: i.closest('a')?.getAttribute('href') ?? null,
      morphTarget: i.hasAttribute('data-morph-target'),
    })),
    morphTargetsNaPagina: document.querySelectorAll('[data-morph-target]').length,
    divisor: divisor
      ? {
          caixa: r(divisor),
          cor: getComputedStyle(divisor).backgroundColor,
          ariaHidden: divisor.getAttribute('aria-hidden'),
        }
      : null,
    nav: nav ? { caixa: r(nav), visivel: getComputedStyle(nav).display !== 'none' } : null,
    cta: cta ? { caixa: r(cta), visivel: getComputedStyle(cta).display !== 'none' } : null,
    toggle: toggle ? { caixa: r(toggle), visivel: getComputedStyle(toggle).display !== 'none' } : null,
    colisoes: (() => {
      const marcas = linksDeMarca.map(r);
      const alvos = { nav: nav && getComputedStyle(nav).display !== 'none' ? r(nav) : null,
                      cta: cta && getComputedStyle(cta).display !== 'none' ? r(cta) : null,
                      toggle: toggle && getComputedStyle(toggle).display !== 'none' ? r(toggle) : null };
      const saida = {};
      for (const [nome, alvo] of Object.entries(alvos)) {
        saida[nome] = alvo ? marcas.some((m) => cruza(m, alvo)) : 'oculto';
      }
      return saida;
    })(),
    vazamentoHorizontal: {
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      vaza: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    },
  };
};

const nav = await chromium.launch();
const abaCanvas = await (await nav.newContext()).newPage();
await abaCanvas.goto('about:blank');

const res = { issue: 'SIS-279', base: BASE, erros: [], medidas: {} };

for (const { w, h } of LARGURAS) {
  for (const { rota, marca } of ROTAS) {
    const ctx = await nav.newContext({ viewport: { width: w, height: h } });
    /* Sem o convite de movimento e sem a abertura da home por cima do header:
       as duas cobririam a pílula na primeira visita. */
    await ctx.addInitScript(() => {
      localStorage.setItem('sistran-motion-preference-seen', '1');
      sessionStorage.setItem('sistran:intro-visto', '1');
    });
    const p = await ctx.newPage();
    p.on('console', (m) => {
      if (m.type() === 'error') res.erros.push(`${w} ${rota}: ${m.text()}`);
    });
    p.on('response', (rp) => {
      if (/logo|corp-logo/.test(rp.url()) && !rp.ok()) res.erros.push(`asset ${rp.status()} ${rp.url()}`);
    });
    await p.goto(`${BASE}${rota}`, { waitUntil: 'domcontentloaded', timeout: 180000 });
    await p.waitForSelector('header a img', { timeout: 180000 });
    /* O véu do `RouteLoadGate` cobre a pílula enquanto a rota não libera, e uma
       foto tirada debaixo dele mede o véu: numa rodada, `/contato` devolveu
       «nenhuma tinta» e o Tab parado no `body` só por isso. */
    await p
      .waitForSelector('[data-route-content][data-route-liberado="true"]', { timeout: 60000 })
      .catch(() => null);
    await p.waitForTimeout(2500);
    await p.addStyleTag({
      content: 'nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button]{display:none!important}',
    });

    const m = await p.evaluate(LEVANTAR);
    /* Sobra entre o vizinho mais à direita (botão ou toggle) e a borda interna
       da pílula. Negativo = alguma coisa saiu dela — foi assim que apareceu, na
       primeira rodada desta issue, o botão «Fale com a gente» empurrado 116px
       para fora a 1440. `scrollWidth` não denuncia: o cabeçalho é `fixed`. */
    m.sobraAteBordaDaPilula =
      Math.round(
        (m.header.dir -
          12 -
          Math.max(
            m.cta?.visivel ? m.cta.caixa.dir : 0,
            m.toggle?.visivel ? m.toggle.caixa.dir : 0,
            m.nav?.visivel ? m.nav.caixa.dir : 0,
          )) *
          10,
      ) / 10;

    /* Tinta de cada marca, fotografada isolada. */
    const alvos = await p.$$('header a span[class*="overflow-hidden"], header a img');
    m.tinta = [];
    for (const alvo of alvos) {
      const dentro = await alvo.evaluate((el) => !!el.closest('a') && !el.closest('nav'));
      if (!dentro) continue;
      const b64 = (await alvo.screenshot()).toString('base64');
      const t = await CAIXA_DE_TINTA(abaCanvas, b64);
      const cx = await alvo.evaluate((el) => {
        const b = el.getBoundingClientRect();
        return { w: Math.round(b.width * 10) / 10, h: Math.round(b.height * 10) / 10, x: Math.round(b.x * 10) / 10 };
      });
      m.tinta.push({
        href: await alvo.evaluate((el) => el.closest('a')?.getAttribute('href') ?? null),
        caixaElemento: cx,
        tintaNoRecorte: t,
        /* Quanto de cada borda ficou sem tinta: 0 nos quatro lados = recorte
           exato. Valor alto = caixa reservando espaço morto. */
        sobraNasBordas: t
          ? {
              esq: t.x0,
              topo: t.y0,
              dir: t.caixa.w - 1 - t.x1,
              base: t.caixa.h - 1 - t.y1,
            }
          : null,
      });
    }

    /* Folga vertical da marca mais alta dentro da pílula. */
    if (m.divisor && m.links.length === 2) {
      const [a, b] = m.links.map((l) => l.caixa);
      const d = m.divisor.caixa;
      m.respiro = {
        entreUniversityEDivisor: Math.round((d.x - a.dir) * 10) / 10,
        entreDivisorESistran: Math.round((b.x - d.dir) * 10) / 10,
        alturaDivisor: d.h,
        razaoDivisorSobreMarcaMaior: Math.round((d.h / Math.max(a.h, b.h)) * 100) / 100,
        folgaVerticalAcima: Math.round((Math.min(a.topo, b.topo) - m.header.topo) * 10) / 10,
        folgaVerticalAbaixo: Math.round((m.header.base - Math.max(a.base, b.base)) * 10) / 10,
      };
    }

    /* Teclado: as primeiras paradas depois do topo do documento. */
    await p.evaluate(() => document.body.focus());
    m.foco = [];
    for (let i = 0; i < 3; i++) {
      await p.keyboard.press('Tab');
      m.foco.push(
        await p.evaluate(() => {
          const a = document.activeElement;
          if (!a) return null;
          const b = a.getBoundingClientRect();
          return {
            tag: a.tagName,
            href: a.getAttribute('href'),
            rotulo: a.getAttribute('aria-label') || (a.textContent || '').trim().slice(0, 40),
            visivelNaTela: b.width > 0 && b.height > 0 && b.top >= 0,
            anelDeFoco: getComputedStyle(a).outlineStyle,
          };
        }),
      );
    }

    await p.screenshot({ path: `docs/capturas/sis279/${marca}-${w}.png`, clip: { x: 0, y: 0, width: w, height: 140 } });
    if (marca === 'university') {
      await p.screenshot({ path: `docs/capturas/sis279/${marca}-${w}-pagina.png` });
    }
    res.medidas[`${w}-${marca}`] = m;
    await ctx.close();
  }
}

/* Larguras intermediárias, só na University: entre 768 e 1439 o botão «Fale com
   a gente» e o toggle do menu aparecem JUNTOS, e é a faixa onde o par está no
   tamanho cheio. É outra combinação de vizinhos que o par pode esbarrar, e
   nenhuma das duas larguras pedidas pela issue a cobre. */
for (const w of [768, 1024, 1280, 1439]) {
  const ctx = await nav.newContext({ viewport: { width: w, height: 900 } });
  await ctx.addInitScript(() => {
    localStorage.setItem('sistran-motion-preference-seen', '1');
    sessionStorage.setItem('sistran:intro-visto', '1');
  });
  const p = await ctx.newPage();
  await p.goto(`${BASE}/sistran-university`, { waitUntil: 'domcontentloaded', timeout: 180000 });
  await p.waitForSelector('header a img');
  await p.waitForTimeout(1500);
  await p.addStyleTag({
    content: 'nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button]{display:none!important}',
  });
  const m = await p.evaluate(LEVANTAR);
  res.medidas[`${w}-university`] = {
    alturaPilula: m.alturaPilula,
    quantosLinksDeMarca: m.quantosLinksDeMarca,
    links: m.links.map((l) => ({ href: l.href, caixa: l.caixa })),
    divisor: m.divisor?.caixa ?? null,
    nav: m.nav,
    cta: m.cta,
    toggle: m.toggle,
    colisoes: m.colisoes,
    vazamentoHorizontal: m.vazamentoHorizontal,
    /* Sobra entre o fim do último vizinho à direita e a borda interna da
       pílula: negativo = algo saiu da pílula. */
    sobraAteBordaDaPilula:
      Math.round(
        (m.header.dir - 12 - Math.max(m.cta?.visivel ? m.cta.caixa.dir : 0, m.toggle?.visivel ? m.toggle.caixa.dir : 0)) * 10,
      ) / 10,
    tinta: [],
    foco: [],
  };
  if (w === 768) await p.screenshot({ path: 'docs/capturas/sis279/university-768.png', clip: { x: 0, y: 0, width: w, height: 140 } });
  await ctx.close();
}

await nav.close();
await writeFile('docs/medidas/sis279-header-marcas.json', `${JSON.stringify(res, null, 1)}\n`);
console.log(JSON.stringify(res, null, 1));
