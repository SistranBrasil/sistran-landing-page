/**
 * SIS-292 · item 11 (4ª volta) — A CAPA NOVA SANGRADA, medida na rota viva.
 *
 * O pedido é «faça a capa assim [mock] com `possivelcapanovamatch.png`», e a
 * mock tem duas metades: hero escuro sangrado com pílula ciana, e faixa clara
 * com a frase de campanha, a lead longa e as duas fichas. Os portões:
 *
 *  1. A ARTE PINTA. `src` escrito não é arte carregada: `naturalWidth > 0` só é
 *     verdade depois de o browser decodificar o bitmap, então caminho errado
 *     aparece aqui como 0. Mais: a caixa da imagem tem de cobrir a faixa inteira
 *     (banner, não coluna) e carregar `data-route-critical-media` — a marca que o
 *     `RouteLoadGate` espera, migrada da foto que desceu.
 *  2. A FOTO QUE DESCEU PERDEU as duas marcas. Portão explícito: nenhum
 *     `[data-route-critical-media]` fora do `#topo`.
 *  3. CONTRASTE POR PIXEL COMPOSTO sob o `h1`, sob a lead curta e na pílula do
 *     CTA, a 390/768/1440. É o único número honesto com foto + dois véus
 *     empilhados, e é por ele que as opacidades dos véus deixam de ser palpite.
 *     Pixel do FUNDO amostrado ao lado da tinta, dentro da mesma linha, com o
 *     ponto limitado à viewport (o recorte 1x1 estoura fora dela).
 *  4. A FAIXA CLARA NOVA existe, é nomeada (`aria-labelledby`), tem `overflow:
 *     clip` e traz os dois grafismos do item 10 — «em tudo nessa página» passa a
 *     incluí-la, senão esta volta abre buraco no critério que a 3ª fechou.
 *  5. O REALCE PERSONALIZAÇÃO sobre fundo claro: tinta contra o fundo do próprio
 *     `<mark>`, ≥ 4,5:1.
 *  6. Os DOIS canais de movimento reduzido e 0 erro de console.
 *
 * Uso: node scripts/medir-capa-nova-sis292.mjs   (com o `next dev` em :3000)
 */

import { writeFile } from 'node:fs/promises';

const PLAYWRIGHT =
  'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
const { chromium } = await import(PLAYWRIGHT);
const URL_BASE = 'http://localhost:3000';
const ROTA = '/solucoes/match-ai';

const luminancia = (css) => {
  const [r, g, b] = css.match(/\d+/g).slice(0, 3).map(Number);
  const c = [r, g, b].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const contraste = (a, b) => {
  const [l1, l2] = [luminancia(a), luminancia(b)];
  return Number(((Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)).toFixed(2));
};

const navegador = await chromium.launch();

async function pixel(page, x, y) {
  const buf = await page.screenshot({ animations: 'disabled', clip: { x, y, width: 1, height: 1 } });
  return page.evaluate(async (b64) => {
    const img = new Image();
    img.src = `data:image/png;base64,${b64}`;
    await img.decode();
    const c = document.createElement('canvas');
    c.width = 1;
    c.height = 1;
    const ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    return `rgb(${r}, ${g}, ${b})`;
  }, buf.toString('base64'));
}

async function abrir({ largura, reduce, preferencia, rota }) {
  const ctx = await navegador.newContext({
    viewport: { width: largura, height: 900 },
    deviceScaleFactor: 1,
    ...(reduce ? { reducedMotion: 'reduce' } : {}),
  });
  await ctx.addInitScript(
    (pref) => {
      localStorage.setItem('sistran-motion-preference-seen', '1');
      if (pref) localStorage.setItem('sistran-motion-preference', pref);
    },
    preferencia ?? null,
  );
  const page = await ctx.newPage();
  const erros = [];
  page.on('console', (m) => m.type() === 'error' && erros.push(m.text()));
  page.on('pageerror', (e) => erros.push(String(e)));
  await page.goto(`${URL_BASE}${rota ?? ROTA}`, { waitUntil: 'load', timeout: 90000 });
  /* Hidratação: sem esta espera mede-se o HTML do servidor, sem observador
     montado. */
  await page.waitForTimeout(2500);
  return { ctx, page, erros };
}

const rampa = async (page) => {
  const altura = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < altura; y += 300) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(70);
  }
  await page.waitForTimeout(2200);
};

const resultado = {};

for (const largura of [390, 768, 1440]) {
  const { ctx, page, erros } = await abrir({ largura, reduce: false });

  /* ITENS 1, 2 e 4 — inventário estrutural, lido com a página no topo. */
  const estrutura = await page.evaluate(() => {
    const hero = document.getElementById('topo');
    const rh = hero.getBoundingClientRect();
    const banner = hero.querySelector('[data-route-critical-media]');
    const rb = banner?.getBoundingClientRect();
    const csHero = getComputedStyle(hero);

    const marcadosForaDoHero = [...document.querySelectorAll('[data-route-critical-media]')].filter(
      (e) => !e.closest('#topo'),
    ).length;

    const faixas = [...document.querySelectorAll('main section, main nav[aria-labelledby]')].map(
      (s) => {
        const cs = getComputedStyle(s);
        const grade = s.querySelector(':scope > .grade-tecnica');
        return {
          id: s.id || s.getAttribute('aria-labelledby') || s.tagName,
          clara: s.classList.contains('section-light'),
          overflow: cs.overflow,
          malhaAncora: grade ? getComputedStyle(grade).backgroundAttachment : null,
          temAcentos: !!s.querySelector(':scope > .matchai-acentos'),
          temCircuito: !!s.querySelector(':scope > .matchai-circuito'),
        };
      },
    );

    const campanha = document.querySelector('[aria-labelledby="matchai-campanha"]');
    const h2 = document.getElementById('matchai-campanha');

    return {
      hero: {
        alturaDaFaixa: Math.round(rh.height),
        overflow: csHero.overflow,
        banner: rb
          ? {
              src: new URL(banner.currentSrc || banner.src, location.href).pathname,
              naturalWidth: banner.naturalWidth,
              naturalHeight: banner.naturalHeight,
              fetchPriority: banner.getAttribute('fetchpriority'),
              largura: Math.round(rb.width),
              altura: Math.round(rb.height),
              cobreAFaixa:
                Math.abs(rb.width - rh.width) <= 1 && Math.abs(rb.height - rh.height) <= 1,
              recorte: getComputedStyle(banner).objectFit,
              alt: banner.getAttribute('alt'),
            }
          : null,
        /* 5ª VOLTA — O `h1` É A LOGO. Três portões num só lugar, porque os três
           falham juntos se a troca de arte der errado:
           · a arte PINTA (`naturalWidth > 0` só é verdade depois de decodificar,
             então caminho errado aparece como 0);
           · o `h1` tem NOME ACESSÍVEL (o `alt` da imagem, que é `page.name`) — um
             `h1` cujo conteúdo inteiro é imagem com `alt=""` é cabeçalho sem nome,
             e é o modo de falha exato desta volta;
           · a arte não ACHATOU: a razão renderizada contra a intrínseca do arquivo
             (720/309 = 2,330). Divergência aqui é o `--carimbo-batida-ar` errado.
           `innerText` não serve de portão: numa manchete de imagem ele é ''. */
        h1: (() => {
          const h = document.querySelector('#topo h1');
          if (!h) return null;
          const img = h.querySelector('img');
          const r = img?.getBoundingClientRect();
          return {
            texto: h.innerText.trim(),
            logo: img
              ? {
                  src: new URL(img.currentSrc || img.src, location.href).pathname,
                  alt: img.getAttribute('alt'),
                  naturalWidth: img.naturalWidth,
                  naturalHeight: img.naturalHeight,
                  largura: Math.round(r.width),
                  altura: Math.round(r.height),
                  razaoRenderizada: Number((r.width / r.height).toFixed(3)),
                  /* 7ª VOLTA: a arte do `h1` deixou de ser a cápsula (720x309) e
                     passou a ser o letreiro `MatchAIlogo.png` (2338x350, medido no
                     IHDR). A razão de referência muda com ela — deixar 720/309 aqui
                     faria o portão de achatamento reprovar a arte certa. */
                  razaoDoArquivo: Number((2338 / 350).toFixed(3)),
                  opacidade: getComputedStyle(img).opacity,
                }
              : null,
            /* «Igual à capa de /esg» é, na captura do pedido, o bloco ENCOSTADO na
               borda esquerda do container em vez de flutuando no meio. O número é a
               distância entre a borda esquerda da manchete e a do container: com o
               teto de medida no lugar errado ela era metade da tela. */
            recuoContraOContainer: (() => {
              const cont = h.closest('.container-lp');
              if (!cont) return null;
              const cs = getComputedStyle(cont);
              const rc = cont.getBoundingClientRect();
              return {
                bordaDoContainer: Math.round(rc.left + parseFloat(cs.paddingLeft)),
                bordaDaManchete: Math.round(h.getBoundingClientRect().left),
                larguraDoContainer: Math.round(rc.width),
                /* O container volta a valer o `max-width` da casa (era ele que
                   `max-w-[46ch]` encolhia). O portão de «encostado» é a diferença
                   entre as duas bordas ser ~0. */
                encostado:
                  Math.abs(h.getBoundingClientRect().left - (rc.left + parseFloat(cs.paddingLeft))) <=
                  1,
              };
            })(),
          };
        })(),
        /* 7ª VOLTA — «DIMINUA O CARIMBO E EMBAIXO DELE COLOQUE A LOGO». A cápsula
           saiu do `h1` e voltou a ser etiqueta ACIMA dele, então ganha portão
           próprio, e ele é de três perguntas que falham juntas:
           · DIMINUIU — a largura contra os 240/240/320px que ela media como
             manchete na 5ª/6ª volta (`menorQueComoManchete`);
           · ESTÁ EM CIMA — a base da cápsula acima do topo do `h1` (`acimaDaMarca`),
             que é o «embaixo dele» do pedido lido pela geometria e não pela ordem no
             markup;
           · NÃO DUPLICA O NOME — `alt=""` na cápsula, porque o nome acessível agora
             é o do letreiro dentro do `h1`. Duas artes nomeadas fazem o leitor de
             tela dizer «Match AI» duas vezes. */
        carimbo: (() => {
          const env = hero.querySelector('.carimbo-batida');
          const img = env?.querySelector('img');
          const h = hero.querySelector('h1');
          if (!env || !img || !h) return null;
          const r = env.getBoundingClientRect();
          const rh = h.getBoundingClientRect();
          return {
            src: new URL(img.currentSrc || img.src, location.href).pathname,
            alt: img.getAttribute('alt'),
            pintou: img.naturalWidth > 0,
            largura: Math.round(r.width),
            altura: Math.round(r.height),
            razaoRenderizada: Number((r.width / r.height).toFixed(3)),
            razaoDoArquivo: Number((720 / 309).toFixed(3)),
            larguraComoManchete: window.innerWidth >= 1024 ? 320 : 240,
            menorQueComoManchete: r.width < (window.innerWidth >= 1024 ? 320 : 240),
            dentroDoH1: !!env.closest('h1'),
            acimaDaMarca: Math.round(r.bottom) <= Math.round(rh.top),
            vaoAteAMarca: Math.round(rh.top - r.bottom),
          };
        })(),
        lead: document.querySelector('#topo h1 + p')?.innerText.trim() ?? null,
        /* 6ª VOLTA — O CTA DEIXOU DE SER LINK. O seletor era `a[href="/contato"]`,
           e mantê-lo faria o portão passar por ausência: `null` não reprova nada.
           Agora o portão é positivo em três frentes: é `<button>` (link falso é
           defeito de teclado e de leitor de tela), não sobrou nenhum `<a>` para
           `/contato` no hero, e a pílula conserva o par de cores já medido. */
        cta: (() => {
          const b = hero.querySelector('button');
          if (!b) return null;
          const cs = getComputedStyle(b);
          return {
            tag: b.tagName,
            type: b.getAttribute('type'),
            texto: b.innerText.trim(),
            fundo: cs.backgroundColor,
            tinta: cs.color,
            linksParaContatoNoHero: hero.querySelectorAll('a[href="/contato"]').length,
          };
        })(),
        /* 6ª VOLTA — «A IMAGEM DEVE ESTAR ATRÁS DO NAVBAR TAMBÉM» e «TIRAR ESSA
           FAIXA AZUL». Os dois pedidos são o mesmo número: o topo da caixa da arte
           contra o topo da janela. `bordaDaArte <= 0` com `bordaDaSecao > 0` é a
           definição de «a arte sobe além da seção»; `subiuAlemDaSecao` é a diferença
           em px, que tem de bater com o `pt` do `PageShell` (112 abaixo de 768px,
           144 daí para cima) — sobrar 1px é a linha dura de volta.
           A SOMBRA («coloque a sombra levemente») é lida no mesmo nó, e com o
           deslocamento vertical POSITIVO: sombra para cima cairia justamente na
           tira atrás do cabeçalho.
           «RETIRE ESSES QUADRADOS DA CAPA» é contagem: zero nó de malha e zero de
           circuito DENTRO do `#topo`. O total da página não serve de portão aqui —
           eles continuam montados nas outras faixas de propósito. */
        arte: (() => {
          const cx = hero.querySelector(':scope > [aria-hidden]');
          if (!cx) return null;
          const rc = cx.getBoundingClientRect();
          const cs = getComputedStyle(cx);
          const pt = window.innerWidth >= 768 ? 144 : 112;
          return {
            bordaDaArte: Math.round(rc.top),
            bordaDaSecao: Math.round(rh.top),
            subiuAlemDaSecao: Math.round(rh.top - rc.top),
            ptDoPageShell: pt,
            cobreAtrasDoNavbar: rc.top <= 0 && Math.abs(rh.top - rc.top - pt) <= 1,
            sombra: cs.boxShadow,
            sombraSoParaBaixo: /rgba?\([^)]*\)\s+0px\s+([1-9]\d*)px/.test(cs.boxShadow),
            /* `filter` no embrulho ancoraria o `fixed` do cabeçalho nele — é por
               isso que a sombra é `box-shadow`, e este é o portão de que ficou
               assim. */
            filtro: cs.filter,
          };
        })(),
        grafismosNoHero: {
          malha: hero.querySelectorAll('.grade-tecnica').length,
          circuito: hero.querySelectorAll('.matchai-circuito').length,
        },
        grafismosNasOutrasFaixas: {
          malha: [...document.querySelectorAll('main .grade-tecnica')].filter(
            (e) => !e.closest('#topo'),
          ).length,
          circuito: [...document.querySelectorAll('main .matchai-circuito')].filter(
            (e) => !e.closest('#topo'),
          ).length,
        },
        /* O fundo da rota, para o portão da faixa azul lá embaixo: é ELE que
           aparecia atrás do cabeçalho. */
        fundoDaRota: {
          main: getComputedStyle(document.getElementById('conteudo')).backgroundColor,
          body: getComputedStyle(document.body).backgroundColor,
        },
        /* O ponto do pixel que prova a arte atrás do cabeçalho: coluna da DIREITA,
           onde a foto vive (à esquerda a própria arte é navy chapado e o pixel não
           saberia distinguir arte de fundo da rota), a 10px do topo — dentro da tira
           do `pt`, e fora da pílula do cabeçalho, que é centrada e mais estreita que
           a janela. */
        pontoAtrasDoNavbar: { x: window.innerWidth - 6, y: 10 },
      },
      marcadosForaDoHero,
      faixas,
      faixaDaCampanha: campanha
        ? {
            clara: campanha.classList.contains('section-light'),
            overflow: getComputedStyle(campanha).overflow,
            tituloNomeado: h2?.textContent.trim() ?? null,
            pesoDoTitulo: h2 ? getComputedStyle(h2).fontWeight : null,
            fichas: campanha.querySelectorAll('.matchai-ficha').length,
            fotoMarcada: !!campanha.querySelector('[data-route-critical-media]'),
          }
        : null,
    };
  });

  /* ITEM 3 — os três contrastes do hero, por pixel COMPOSTO. O ponto do fundo é
     calculado dentro do `evaluate` e limitado à viewport, porque o recorte 1x1
     estoura fora dela («Clipped area is outside the resulting image»). */
  const alvos = await page.evaluate(() => {
    const out = [];
    const marcar = (el, rotulo, dentro, seletor) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      out.push({
        rotulo,
        seletor,
        dentro: !!dentro,
        tinta: cs.color,
        /* Na pílula o fundo é o da própria caixa, então o ponto é DENTRO; no
           texto sobre a arte o fundo é o que passa ao lado da tinta. */
        ponto: dentro
          ? { x: Math.round(r.left + 6), y: Math.round(r.top + r.height / 2) }
          : {
              x: Math.max(2, Math.min(window.innerWidth - 3, Math.round(r.right + 16))),
              y: Math.round(r.top + r.height / 2),
            },
      });
    };
    /* 5ª VOLTA: a manchete é ARTE BRANCA, não texto — `getComputedStyle().color`
       dela não diz nada. A tinta declarada passa a ser `#ffffff`, que é a cor do
       traço no PNG (`…-outline-ffffff`), e o fundo é o pixel composto ao lado. É o
       mesmo piso: o letreiro do produto tem de se ler sobre a foto. */
    /* 7ª VOLTA: a arte do `h1` é o LETREIRO, e a tinta dele não é um tom só — a
       palavra tem degradê de branco para cinza claro. Então são DUAS linhas, que é a
       regra da casa para tinta que varia (rótulo pequeno pede os dois números): o
       NÚCLEO branco e o OMBRO cinza. Os dois tons foram lidos do próprio arquivo,
       composto sobre `#001A3D`, com a franja de antialiasing excluída (o pior pixel
       cru dava 1,33:1, que é franja e não traço — o defeito que a nota «raster
       subestima texto pequeno» registra): percentil 5 dos pixels de tinta =
       `rgb(189, 191, 193)`, mediana = `rgb(254, 254, 254)`. */
    (() => {
      const h = document.querySelector('#topo h1 img');
      if (!h) return;
      const r = h.getBoundingClientRect();
      const ponto = {
        x: Math.max(2, Math.min(window.innerWidth - 3, Math.round(r.right + 16))),
        y: Math.round(r.top + r.height / 2),
      };
      out.push(
        { rotulo: 'letreiro Match AI · nucleo branco', tinta: 'rgb(254, 254, 254)', ponto },
        { rotulo: 'letreiro Match AI · ombro cinza (p05)', tinta: 'rgb(189, 191, 193)', ponto },
      );
    })();
    /* A CÁPSULA também continua medida, no seu novo tamanho de etiqueta: ela é traço
       `#ffffff` chapado (`…-outline-ffffff`) e virou peça pequena — é justamente
       onde contraste costuma escapar. */
    (() => {
      const c = document.querySelector('#topo .carimbo-batida img');
      if (!c) return;
      const r = c.getBoundingClientRect();
      out.push({
        rotulo: 'carimbo (etiqueta, traço #ffffff)',
        tinta: 'rgb(255, 255, 255)',
        ponto: {
          x: Math.max(2, Math.min(window.innerWidth - 3, Math.round(r.right + 16))),
          y: Math.round(r.top + r.height / 2),
        },
      });
    })();
    marcar(document.querySelector('#topo h1 + p'), 'lead curta', false, '#topo h1 + p');
    /* 6ª VOLTA: a pílula virou `<button>` (abre o modal em vez de navegar). O
       seletor velho (`a[href="/contato"]`) devolveria `null` e o contraste sairia
       silenciosamente da lista. */
    marcar(document.querySelector('#topo button'), 'pilula do CTA', true, '#topo button');
    return out;
  });
  const contrastesDoHero = [];
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(600);
  for (const a of alvos) {
    /* O PONTO É RELIDO NO INSTANTE DA AMOSTRA, e isso é correção de um defeito
       desta sonda, não zelo: os alvos são medidos com o `data-reveal` ainda
       correndo (`fade-up` escreve `translateY` na cascata), e entre a medição e o
       recorte 1x1 a caixa AINDA SE MOVE. Foi assim que a pílula, cujo fundo é
       chapado e cujo contraste é determinístico (9,67:1), saiu em 1,04 a 1440 e
       4,26 a 390 na primeira passagem desta volta enquanto batia 9,67 a 768 — o
       pixel caía na foto, ao lado da pílula, e não nela. O alvo relido é o da
       geometria pousada. */
    const ponto = a.seletor
      ? await page.evaluate(
          ({ sel, dentro }) => {
            const el = document.querySelector(sel);
            if (!el) return null;
            const r = el.getBoundingClientRect();
            return dentro
              ? { x: Math.round(r.left + 6), y: Math.round(r.top + r.height / 2) }
              : {
                  x: Math.max(2, Math.min(window.innerWidth - 3, Math.round(r.right + 16))),
                  y: Math.round(r.top + r.height / 2),
                };
          },
          { sel: a.seletor, dentro: a.dentro },
        )
      : a.ponto;
    const fundo = await pixel(page, (ponto ?? a.ponto).x, (ponto ?? a.ponto).y);
    contrastesDoHero.push({
      rotulo: a.rotulo,
      ponto: ponto ?? a.ponto,
      tinta: a.tinta,
      fundoComposto: fundo,
      contraste: contraste(a.tinta, fundo),
      passa: contraste(a.tinta, fundo) >= 4.5,
    });
  }

  /* 6ª VOLTA — A FAIXA AZUL, POR PIXEL. O estrutural acima prova que a CAIXA da
     arte sobe; este prova que ela PINTA ali. O pixel a 10px do topo, na coluna da
     direita, tem de ser o da foto — se for o navy chapado do fundo da rota
     (`rgb(0, 26, 61)`), a faixa azul do pedido continua lá. O pixel de controle é o
     mesmo x logo abaixo do cabeçalho: os dois vêm da mesma imagem contínua. */
  const p = estrutura.hero.pontoAtrasDoNavbar;
  const atrasDoNavbar = await pixel(page, Math.min(largura - 3, p.x), p.y);
  const abaixoDoNavbar = await pixel(page, Math.min(largura - 3, p.x), 160);
  const faixaAzul = {
    ponto: p,
    pixelAtrasDoNavbar: atrasDoNavbar,
    pixelAbaixoDoNavbar: abaixoDoNavbar,
    fundoDaRota: estrutura.hero.fundoDaRota,
    /* O piso: o pixel atrás do cabeçalho não é o fundo chapado da rota. */
    naoEFundoChapado:
      atrasDoNavbar !== 'rgb(0, 26, 61)' &&
      atrasDoNavbar !== estrutura.hero.fundoDaRota.body &&
      atrasDoNavbar !== estrutura.hero.fundoDaRota.main,
  };

  /* 6ª VOLTA — O MODAL «FALE COM A GENTE» no CTA do hero. Quatro portões, porque
     são quatro modos de falha diferentes: o `<dialog>` abre de fato (`open` é do
     DOM, não CSS), a escrita é a default do componente (a que o pedido nomeia),
     `Escape` fecha, e o FOCO volta para o botão — sem isso o teclado é despejado no
     começo do documento. A rota não pode ter navegado: `location.pathname` continua
     na slug. */
  const modal = await (async () => {
    const antes = page.url();
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.click('#topo button');
    await page.waitForTimeout(900);
    const aberto = await page.evaluate(() => {
      const d = document.querySelector('dialog[open]');
      if (!d) return { abriu: false };
      return {
        abriu: true,
        rotulo: d.querySelector('p, span')?.innerText?.trim() ?? null,
        titulo: d.querySelector('h2, h3')?.innerText?.trim() ?? null,
        temFormulario: !!d.querySelector('form'),
        campos: d.querySelectorAll('input, textarea, select').length,
      };
    });
    await page.keyboard.press('Escape');
    await page.waitForTimeout(700);
    const depois = await page.evaluate(() => ({
      aindaAberto: !!document.querySelector('dialog[open]'),
      focoNoGatilho: document.activeElement === document.querySelector('#topo button'),
      rota: location.pathname,
    }));
    return { urlAntes: antes, ...aberto, ...depois };
  })();

  await rampa(page);

  /* ITENS 4 e 5 — a faixa clara depois de entrar em cena. */
  const faixaClara = await page.evaluate(async () => {
    const sec = document.querySelector('[aria-labelledby="matchai-campanha"]');
    const escopo = sec?.querySelector('[data-reveal-nome]');
    sec?.scrollIntoView({ block: 'center' });
    await new Promise((r) => setTimeout(r, 500));
    const marca = sec?.querySelector('mark');
    const csm = marca && getComputedStyle(marca);
    const pulso = sec?.querySelector('.matchai-circuito-pulso');
    let fluxo = null;
    if (pulso) {
      const cs = getComputedStyle(pulso);
      const a = cs.strokeDashoffset;
      await new Promise((r) => setTimeout(r, 400));
      fluxo = { animacao: cs.animationName, quadroA: a, quadroB: getComputedStyle(pulso).strokeDashoffset };
      fluxo.moveu = fluxo.quadroA !== fluxo.quadroB;
    }
    const aceso = sec?.querySelector('.matchai-circuito-aceso');
    const ra = aceso?.getBoundingClientRect();
    return {
      dataIn: escopo?.dataset.in ?? null,
      filhosComPreset: escopo?.querySelectorAll('[data-reveal]').length ?? 0,
      marca: csm
        ? { texto: marca.textContent.trim(), fundo: csm.backgroundColor, tinta: csm.color }
        : null,
      fluxo,
      quadradoAceso: ra
        ? {
            dentro: { x: Math.round(ra.left + ra.width / 2), y: Math.round(ra.top + ra.height / 2) },
            fora: {
              x: Math.max(2, Math.min(window.innerWidth - 3, Math.round(ra.left - 26))),
              y: Math.round(ra.top + ra.height / 2),
            },
            naTela: ra.top > 0 && ra.bottom < window.innerHeight,
            scroll: window.scrollY,
          }
        : null,
      /* Nada de conteúdo preso invisível depois da rampa. */
      invisiveisNaTela: [...(sec?.querySelectorAll('*') ?? [])]
        .filter((e) => {
          const r = e.getBoundingClientRect();
          return Number(getComputedStyle(e).opacity) < 0.05 && r.height > 4;
        })
        .map((e) => `${e.tagName}.${e.className?.toString?.().slice(0, 40) ?? ''}`),
    };
  });
  if (faixaClara.marca) {
    faixaClara.marca.contraste = contraste(faixaClara.marca.tinta, faixaClara.marca.fundo);
    faixaClara.marca.passa = faixaClara.marca.contraste >= 4.5;
  }
  if (faixaClara.quadradoAceso?.naTela) {
    await page.evaluate((y) => window.scrollTo(0, y), faixaClara.quadradoAceso.scroll);
    await page.waitForTimeout(250);
    const dentro = await pixel(page, faixaClara.quadradoAceso.dentro.x, faixaClara.quadradoAceso.dentro.y);
    const fora = await pixel(page, faixaClara.quadradoAceso.fora.x, faixaClara.quadradoAceso.fora.y);
    faixaClara.quadradoAceso.pixelDoQuadrado = dentro;
    faixaClara.quadradoAceso.pixelDoFundo = fora;
    faixaClara.quadradoAceso.pintou = dentro !== fora;
  }

  await page.screenshot({
    path: `docs/capturas/sis292-capa-nova-${largura}.png`,
    fullPage: true,
    animations: 'disabled',
  });

  resultado[`w${largura}`] = { estrutura, contrastesDoHero, faixaAzul, modal, faixaClara, erros };
  await ctx.close();
}

/* 5ª VOLTA · «FAÇA IGUAL A CAPA DE /esg» — a comparação MEDIDA, e não de olho.
   O pedido nomeia uma rota existente como referência, então o portão é o par de
   números dela na mesma janela: onde a manchete começa e quanto a faixa mede de
   altura. Sem esta passagem, «igual» seria opinião minha. */
const referenciaEsg = {};
for (const largura of [390, 768, 1440]) {
  const { ctx, page } = await abrir({ largura, reduce: false, rota: '/esg' });
  referenciaEsg[`w${largura}`] = await page.evaluate(() => {
    const sec = document.getElementById('topo');
    const h = sec?.querySelector('h1');
    return {
      alturaDaFaixa: sec ? Math.round(sec.getBoundingClientRect().height) : null,
      bordaDaManchete: h ? Math.round(h.getBoundingClientRect().left) : null,
    };
  });
  await ctx.close();
}
for (const largura of [390, 768, 1440]) {
  const meu = resultado[`w${largura}`]?.estrutura?.hero;
  const dela = referenciaEsg[`w${largura}`];
  if (!meu || !dela) continue;
  referenciaEsg[`w${largura}`].confronto = {
    alturaMatchAi: meu.alturaDaFaixa,
    alturaEsg: dela.alturaDaFaixa,
    bordaMatchAi: meu.h1?.recuoContraOContainer?.bordaDaManchete ?? null,
    bordaEsg: dela.bordaDaManchete,
  };
}
resultado.referenciaEsg = referenciaEsg;

/* MOVIMENTO REDUZIDO — os dois canais, sobre o que a 4ª volta mexeu. */
for (const canal of ['media', 'preferencia']) {
  const { ctx, page, erros } = await abrir({
    largura: 1440,
    reduce: canal === 'media',
    preferencia: canal === 'preferencia' ? 'reduce' : null,
  });
  const atributo = await page.evaluate(() => document.documentElement.dataset.motion ?? null);
  await rampa(page);
  const d = await page.evaluate(() => {
    const sec = document.querySelector('[aria-labelledby="matchai-campanha"]');
    const ler = (raiz, sel) =>
      [...(raiz?.querySelectorAll(sel) ?? [])].map((e) => {
        const cs = getComputedStyle(e);
        return { animacao: cs.animationName, opacidade: cs.opacity };
      });
    return {
      fichas: ler(sec, '.matchai-ficha'),
      traco: ler(sec, '.matchai-circuito-pulso'),
      aceso: ler(sec, '.matchai-circuito-aceso'),
      escopoDaCampanha: sec?.querySelector('[data-reveal-nome]')?.dataset.in ?? null,
      /* O hero é o que está na dobra: o banner tem de estar visível, não em
         opacidade de entrada congelada. */
      banner: (() => {
        const b = document.querySelector('#topo [data-route-critical-media]');
        return b ? { opacidade: getComputedStyle(b).opacity, pintou: b.naturalWidth > 0 } : null;
      })(),
      /* 5ª VOLTA — A MANCHETE É ARTE, e arte de manchete presa em `opacity: 0` é
         a rota sem título. O `CarimboBatida` nasce no estado final com movimento
         reduzido (é o contrato dele), e este é o portão disso: opacidade 1, giro
         zero e bitmap decodificado. O nó medido é o do componente, não o `<img>`:
         é nele que o GSAP escreve. */
      /* 7ª VOLTA: são DUAS artes na dobra e cada uma tem o seu canal. A cápsula
         mudou de lugar (saiu do `h1`), então o seletor de antes
         (`#topo h1 .carimbo-batida`) devolveria `null` e o portão passaria por
         ausência. O letreiro não é `CarimboBatida`: quem o esconde/mostra é o
         `data-reveal` do `h1`, e por isso o nó medido nele é o `h1`. */
      logo: (() => {
        const env = document.querySelector('#topo .carimbo-batida');
        const img = env?.querySelector('img');
        if (!env || !img) return null;
        const cs = getComputedStyle(env);
        return {
          opacidade: cs.opacity,
          transform: cs.transform,
          pintou: img.naturalWidth > 0,
          alt: img.getAttribute('alt'),
        };
      })(),
      marca: (() => {
        const h = document.querySelector('#topo h1');
        const img = h?.querySelector('img');
        if (!h || !img) return null;
        const cs = getComputedStyle(h);
        const ci = getComputedStyle(img);
        return {
          opacidadeDoH1: cs.opacity,
          transformDoH1: cs.transform,
          opacidadeDaArte: ci.opacity,
          pintou: img.naturalWidth > 0,
          alt: img.getAttribute('alt'),
          dataIn: h.closest('[data-reveal-nome]')?.dataset.in ?? null,
        };
      })(),
    };
  });
  resultado[`reduce-${canal}`] = {
    atributoNoHtml: atributo,
    fichasEmLaco: d.fichas.filter((f) => f.animacao !== 'none').length,
    totalDeFichas: d.fichas.length,
    tracosEmLaco: d.traco.filter((t) => t.animacao !== 'none').length,
    tracosApagados: d.traco.filter((t) => Number(t.opacidade) === 0).length,
    acesoOpaco: d.aceso.every((a) => Number(a.opacidade) === 1),
    escopoDaCampanha: d.escopoDaCampanha,
    banner: d.banner,
    logo: d.logo,
    marca: d.marca,
    erros,
  };
  await ctx.close();
}

await navegador.close();
await writeFile('docs/medidas/sis292-capa-nova.json', `${JSON.stringify(resultado, null, 2)}\n`);
console.log(JSON.stringify(resultado, null, 2));
