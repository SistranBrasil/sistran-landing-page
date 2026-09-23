/**
 * SIS-268 — sonda do fecho «Fale com a Gente!» de `/quem-somos`.
 *
 * A troca da issue são DUAS PROPS (`layoutReferencia contatoNoModal`), mas o que
 * precisa de medida não é a troca: é a FRONTEIRA acima dela. Esta rota é a única das
 * que montam a referência que tem VAZAMENTO na junta — os dois cartões de «Conheça
 * também» descem 5rem para dentro do bloco de baixo (SIS-77), e o bloco de baixo
 * deixou de ser navy. Então a sonda lê, em 390/768/1440:
 *
 *   1. QUE DESENHO ESTÁ MONTADO: `.cta-ref` presente e nenhum `h2` «Fale com a
 *      Gente!» fora dele (o cartão navy antigo). É a leitura do critério «fecho
 *      visual da referência», e as peças dele — vidro, fio, blob/selo, botão — são
 *      conferidas uma a uma pela classe.
 *   2. A ESCRITA, caractere por caractere, contra os PADRÃO do componente: a issue
 *      proíbe passar título/descrição, então o que aparece na tela tem de ser o que
 *      o `copy-lock` guarda.
 *   3. O BOTÃO é `<button>` sem `href`, e clicar abre o `<dialog>`; `Escape` fecha e
 *      a URL não muda (link que abre modal seria link mentiroso).
 *   4. O VAZAMENTO, em pixels: quanto os cartões de cima descem sobre a `.cta-ref` e
 *      se essa saliência toca alguma peça do CTA. Colisão aqui é o risco real da
 *      troca — o cartão navy era uma caixa só no meio da seção, e a referência tem
 *      arte absoluta encostada na borda direita.
 *   5. A JUNTA em cor: o `fill` do `NotchDivider` contra o fundo pintado de cada
 *      lado. O comentário da rota chamava esta fronteira de claro→escuro; com a
 *      referência ela é claro→claro, e o número é o que decide se o chanfro ainda
 *      tem o que separar.
 *   6. OVERFLOW horizontal do documento, nas três larguras.
 *
 * Uso: node scripts/medir-cta-quem-somos-sis268.mjs [--antes]
 */

import { mkdirSync, writeFileSync } from 'node:fs';

const PLAYWRIGHT =
  'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/361ceb562f3b3235/node_modules/playwright/index.mjs';
const SHELL =
  process.env.LOCALAPPDATA +
  '/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe';

const BASE = process.env.BASE_URL ?? 'http://localhost:3000';
const ROTA = `${BASE}/quem-somos`;
const LARGURAS = [390, 768, 1440];
const ANTES = process.argv.includes('--antes');
const MARCA = ANTES ? 'antes' : 'depois';
const SAIDA = `docs/medidas/sis268-quem-somos-${MARCA}.json`;
const CAPTURAS = 'docs/capturas';

/* Os PADRÃO de `ContactCTA` (`src/components/ContactCTA.tsx`), copiados daqui só
   para comparar — a fonte da verdade continua sendo o componente. */
const TITULO = 'Fale com a Gente!';
const PARAGRAFO =
  'Quer conversar com um de nossos especialistas? Então fale com a gente. Temos uma equipe qualificada para atender as suas necessidades.';
const BOTAO = 'Fale com a SISTRAN';

mkdirSync(CAPTURAS, { recursive: true });
mkdirSync('docs/medidas', { recursive: true });

const { chromium } = await import(PLAYWRIGHT);
const navegador = await chromium.launch({ executablePath: SHELL });

async function abrir(largura) {
  const ctx = await navegador.newContext({
    viewport: { width: largura, height: 900 },
    deviceScaleFactor: 1,
  });
  await ctx.addInitScript(() => {
    localStorage.setItem('sistran-motion-preference', 'full');
    localStorage.setItem('sistran-motion-preference-seen', '1');
    sessionStorage.setItem('sistran:intro-visto', 'true');
  });
  const p = await ctx.newPage();
  await p.goto(ROTA, { waitUntil: 'networkidle' });
  await p.waitForSelector('[data-route-liberado="true"]', { timeout: 30000 }).catch(() => {});
  await p.addStyleTag({ content: 'nextjs-portal{display:none!important}' });
  return { ctx, p };
}

/* Rolar até o fim é o que garante que TODO reveal por scroll já disparou — sem isso
   as caixas dos cartões de «Conheça também» sairiam do estado escondido. */
async function assentar(p) {
  await p.evaluate(async () => {
    const passo = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += passo) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 90));
    }
    window.scrollTo(0, document.body.scrollHeight);
  });
  await p.waitForTimeout(1500);
}

const ler = () => {
  const ref = document.querySelector('.cta-ref');
  /* O fecho é o ÚLTIMO bloco da página, seja qual for o desenho: com a referência é
     a `.cta-ref`; sem ela, a `<section>` dentro de `.recebe-vazamento`. */
  const receptor = document.querySelector('.recebe-vazamento');
  const fecho = ref ?? receptor?.querySelector('section') ?? null;
  const titulos = [...document.querySelectorAll('h2')].filter(
    (h) => h.textContent.trim() === 'Fale com a Gente!',
  );
  const caixa = (el) => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const y = window.scrollY;
    return {
      topo: Math.round(r.top + y),
      base: Math.round(r.bottom + y),
      esq: Math.round(r.left),
      dir: Math.round(r.right),
      alt: Math.round(r.height),
      larg: Math.round(r.width),
    };
  };

  const fonte = document.querySelector('.vaza-fonte');
  const cartoes = document.querySelector('.vaza-cartoes');
  const cartoesFilhos = cartoes ? [...cartoes.children].map(caixa) : [];
  const botao = fecho?.querySelector('a, button') ?? null;

  /* A junta: o que o fecho tem IMEDIATAMENTE acima dele. Antes da SIS-268 era um
     `NotchDivider`; depois é a própria seção «Conheça também». Ler o irmão anterior,
     e não «o último notch do documento», é o que faz a sonda dizer a verdade nos dois
     estados em vez de procurar um nó que pode não existir mais. */
  const anterior = fecho?.previousElementSibling ?? null;
  const notch = anterior?.classList?.contains('notch-divider') ? anterior : null;

  /* Fundo PINTADO de cada lado da junta, lido por `elementFromPoint` para pegar
     quem de fato paga o pixel (e não a `<section>` transparente de cima dele). */
  const corDe = (x, yDoc) => {
    const yTela = yDoc - window.scrollY;
    if (yTela < 0 || yTela > window.innerHeight) return { foraDaJanela: true };
    let el = document.elementFromPoint(x, yTela);
    while (el) {
      const bg = getComputedStyle(el).backgroundColor;
      const img = getComputedStyle(el).backgroundImage;
      if ((bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') || img !== 'none') {
        return {
          seletor:
            el.tagName.toLowerCase() +
            '.' +
            (el.className?.baseVal ?? el.className ?? '')
              .toString()
              .trim()
              .split(/\s+/)
              .slice(0, 3)
              .join('.'),
          bg,
          temImagem: img !== 'none',
        };
      }
      el = el.parentElement;
    }
    return null;
  };

  const caixaNotch = caixa(notch);
  const caixaFecho = caixa(fecho);
  /* A fatia crítica: da base dos cartões que vazam até o topo do fecho. É AQUI que a
     faixa de navy exposto aparecia com o `<div className="recebe-vazamento">`. */
  const baseCartoes = caixa(cartoes)?.base ?? null;

  return {
    desenho: {
      temCtaRef: Boolean(ref),
      blocosFaleComAGente: titulos.length,
      cartaoNavyForaDaRef: titulos.filter((h) => !h.closest('.cta-ref')).length,
      pecas: {
        vidro: Boolean(document.querySelector('.cta-ref-cartao')),
        fio: Boolean(document.querySelector('.cta-ref-fio-traco')),
        no: Boolean(document.querySelector('.cta-ref-fio-no')),
        blob: Boolean(document.querySelector('.cta-ref-blob')),
        selo: Boolean(document.querySelector('.cta-ref-selo img')),
        botaoCirculo: Boolean(document.querySelector('.cta-ref-botao-circulo')),
        ondas: Boolean(document.querySelector('.cta-ref-ondas')),
        rotuloMobile: (() => {
          const r = document.querySelector('.cta-ref-rotulo');
          return r ? getComputedStyle(r).display !== 'none' : false;
        })(),
      },
      /* `revelar` foi OMITIDA nesta rota: sem ela nenhum nó do bloco ganha
         `data-reveal` nem `data-in`. */
      nosComDataReveal: ref ? ref.querySelectorAll('[data-reveal]').length : null,
    },
    escrita: {
      titulo: fecho?.querySelector('h2')?.textContent ?? null,
      paragrafo: fecho?.querySelector('p')?.textContent ?? null,
      botao: botao ? botao.textContent.trim() : null,
    },
    botao: botao
      ? { tag: botao.tagName.toLowerCase(), href: botao.getAttribute('href'), tipo: botao.getAttribute('type') }
      : null,
    dialogosNoDocumento: document.querySelectorAll('dialog').length,
    vazamento: {
      fonteClasses: fonte?.className ?? null,
      fontePaddingBottom: fonte ? getComputedStyle(fonte).paddingBottom : null,
      fonteZIndex: fonte ? getComputedStyle(fonte).zIndex : null,
      cartoesMarginBottom: cartoes ? getComputedStyle(cartoes).marginBottom : null,
      receptorTag: receptor?.tagName.toLowerCase() ?? null,
      receptorPaddingTop: receptor ? getComputedStyle(receptor).paddingTop : null,
      caixaCartoes: caixa(cartoes),
      caixaCartaoEsq: cartoesFilhos[0] ?? null,
      caixaCartaoDir: cartoesFilhos[1] ?? null,
    },
    junta: {
      irmaoAcimaDoFecho: anterior
        ? anterior.tagName.toLowerCase() +
          '.' +
          (anterior.className?.baseVal ?? anterior.className ?? '').toString().trim().split(/\s+/).join('.')
        : null,
      temNotch: Boolean(notch),
      notchFill: notch?.querySelector('path')?.getAttribute('fill') ?? null,
      caixaNotch,
      /* Três sondas na borda ESQUERDA (x=8): é onde o chanfro recuava e onde os
         cartões, que param no container, nunca cobrem — o pior caso da faixa. */
      corAcimaDoFecho: caixaFecho ? corDe(8, caixaFecho.topo - 6) : null,
      corNoTopoDoFecho: caixaFecho ? corDe(8, caixaFecho.topo + 6) : null,
      corEntreCartoesEFecho:
        caixaFecho && baseCartoes != null && caixaFecho.topo - baseCartoes > 4
          ? corDe(8, (baseCartoes + caixaFecho.topo) / 2)
          : { semFaixa: true, px: caixaFecho && baseCartoes != null ? caixaFecho.topo - baseCartoes : null },
    },
    fecho: {
      tag: fecho?.tagName.toLowerCase() ?? null,
      classe: fecho?.className ?? null,
      caixa: caixaFecho,
      fundo: fecho ? getComputedStyle(fecho).backgroundImage.slice(0, 120) : null,
      sombra: fecho ? getComputedStyle(fecho).boxShadow : null,
    },
    pecasDoFecho: {
      vidro: caixa(document.querySelector('.cta-ref-cartao')),
      rotulo: caixa(document.querySelector('.cta-ref-rotulo')),
      titulo: caixa(document.querySelector('.cta-ref-titulo, .cta-ref h2')),
      botao: caixa(document.querySelector('.cta-ref-botao')),
      arte: caixa(document.querySelector('.cta-ref-arte')),
    },
    overflow: {
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      vazaNaHorizontal: document.documentElement.scrollWidth > window.innerWidth,
    },
  };
};

const saida = { issue: 'SIS-268', rota: '/quem-somos', marca: MARCA, larguras: {}, capturas: [] };

const FECHO = '.cta-ref, .recebe-vazamento > section, .recebe-vazamento';

for (const largura of LARGURAS) {
  const { ctx, p } = await abrir(largura);
  await assentar(p);
  /* A junta tem de estar EM QUADRO para `elementFromPoint` responder: rolar até o
     fim da página deixaria a fronteira acima do topo da janela e toda leitura de cor
     sairia nula (foi o que a 1ª passada desta sonda devolveu). */
  await p.evaluate((sel) => {
    const f = document.querySelector(sel);
    if (f) window.scrollTo(0, f.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.4);
  }, FECHO);
  await p.waitForTimeout(700);
  const l = await p.evaluate(ler);

  /* A colisão, calculada aqui e não no navegador: a saliência dos cartões contra
     cada peça do fecho, em pixels. Positivo = sobreposição vertical. */
  const base = l.vazamento.caixaCartoes?.base ?? null;
  const topoFecho = l.fecho.caixa?.topo ?? null;
  l.saliencia = {
    descePraDentroDoFechoPx: base != null && topoFecho != null ? base - topoFecho : null,
    colisoes: Object.fromEntries(
      Object.entries(l.pecasDoFecho).map(([nome, c]) => [
        nome,
        c && base != null
          ? { sobrepoePx: Math.max(0, base - c.topo), folgaPx: c.topo - base }
          : null,
      ]),
    ),
  };

  l.escritaIgualAoPadrao = {
    titulo: l.escrita.titulo === TITULO,
    paragrafo: l.escrita.paragrafo === PARAGRAFO,
    botao: l.escrita.botao === BOTAO,
  };

  saida.larguras[largura] = l;

  /* O fecho, e só ele: `.cta-ref` quando a referência está montada, a `<section>` de
     dentro do receptor quando não está. `.or().first()` pegaria o `<div>` receptor
     (vem antes no DOM) e a captura levaria junto a faixa de cima — foi o que
     mascarou a leitura na 1ª passada. */
  const alvo = (await p.locator('.cta-ref').count())
    ? p.locator('.cta-ref')
    : p.locator('.recebe-vazamento');
  const arq = `${CAPTURAS}/sis268-quem-somos-${MARCA}-${largura}.png`;
  await alvo.first().screenshot({ path: arq }).catch(() => {});
  saida.capturas.push(arq);

  /* A junta, recortada em volta do TOPO DO FECHO — é onde a faixa apareceria, com ou
     sem chanfro no meio. */
  if (l.fecho.caixa) {
    const y = Math.max(0, l.fecho.caixa.topo - 320);
    const arqJunta = `${CAPTURAS}/sis268-quem-somos-${MARCA}-junta-${largura}.png`;
    await p.screenshot({
      path: arqJunta,
      clip: { x: 0, y, width: largura, height: 640 },
      fullPage: true,
    });
    saida.capturas.push(arqJunta);
  }

  await ctx.close();
}

/* O MODAL, a 1440: abre no clique, fecha no `Escape`, e a URL não muda. */
{
  const { ctx, p } = await abrir(1440);
  await assentar(p);
  const urlAntes = p.url();
  const botao = p.locator('.cta-ref button, .recebe-vazamento a, .recebe-vazamento button').first();
  await botao.scrollIntoViewIfNeeded();
  await p.waitForTimeout(600);
  await botao.click();
  await p.waitForTimeout(900);
  saida.modal = {
    urlAntes,
    urlDepoisDoClique: p.url(),
    navegou: p.url() !== urlAntes,
    aberto: await p.evaluate(() => {
      const d = document.querySelector('dialog[open], [role="dialog"]');
      return d ? { tag: d.tagName.toLowerCase(), visivel: d.getClientRects().length > 0 } : null;
    }),
  };
  const arqModal = `${CAPTURAS}/sis268-quem-somos-${MARCA}-modal.png`;
  await p.screenshot({ path: arqModal });
  saida.capturas.push(arqModal);
  await p.keyboard.press('Escape');
  await p.waitForTimeout(700);
  saida.modal.fechouComEsc = await p.evaluate(
    () => document.querySelector('dialog[open], [role="dialog"]') === null,
  );
  await ctx.close();
}

await navegador.close();
writeFileSync(SAIDA, JSON.stringify(saida, null, 2), 'utf8');
console.log(JSON.stringify(saida, null, 2));
