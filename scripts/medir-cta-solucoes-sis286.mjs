/* SIS-286 — mede o «Fale com a Gente!» da referência em `/solucoes` e em TODAS as
   `/solucoes/[slug]`.

   O que cada leitura prova, e por que é esta:

   • `.cta-ref` PRESENTE e o cartão navy AUSENTE. É o critério 1, e a única forma
     honesta de dizer «igual ao de /esg» sem olhar captura: o desenho da referência
     mora numa classe, e o navy antigo vinha de `background` em linha no cartão.
     Então leio as duas coisas — a classe da seção e a existência do cartão com
     estilo em linha.
   • A ESCRITA, caractere por caractere, comparada com os PADRÃO do componente. O
     critério 4 é «copy intacta»; `copy-lock --check` também pega, mas ele compara o
     repositório inteiro e não diz em QUAL rota o texto ficou. Aqui diz.
   • O BOTÃO é `<button>`, não `<a>`. É o que `contatoNoModal` muda, e é a diferença
     que importa para leitor de tela (link que abre modal é link mentiroso). Além da
     tag, clico e confirmo que o `<dialog>`/painel abre — a prop poderia estar ligada
     e o modal não chegar ao DOM.
   • As SETE SLUGS, não só as três das capturas: o item 2 proíbe condicionar a uma
     slug, e a prova disso é ler todas.
   • A EMENDA, em cor. No índice a seção de cima é `Consulting`
     (`section-light section-light-blue`) — claro contra claro, e o que pode dar
     errado é uma listra entre duas rampas de cor quase igual; então leio o pixel
     dos dois lados da fronteira. No `[slug]` a de cima é navy e o caso é o de
     `/esg`, costurado pelo `box-shadow` de 54px de `.cta-ref`. */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/361ceb562f3b3235/node_modules/playwright/index.mjs';
import { mkdirSync } from 'node:fs';

const EXEC =
  process.env.LOCALAPPDATA +
  '/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe';
const BASE = 'http://localhost:3000';
const CAPTURAS = 'docs/capturas';

const TITULO = 'Fale com a Gente!';
const PARAGRAFO =
  'Quer conversar com um de nossos especialistas? Então fale com a gente. Temos uma equipe qualificada para atender as suas necessidades.';
const BOTAO = 'Fale com a SISTRAN';

const SLUGS = [
  'match-ai',
  'lumina-ai',
  'fast',
  'qa-integrado',
  'connect-api',
  'smart-miner',
  'guru-de-seguros',
];

mkdirSync(CAPTURAS, { recursive: true });
const navegador = await chromium.launch({ executablePath: EXEC });

async function abrir(rota, largura, altura = 900) {
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

const lerCTA = () => {
  const ref = document.querySelector('.cta-ref');
  /* PRIMEIRA VOLTA ERRADA, registrada porque o número engana: eu contava
     `section [style*="linear-gradient(135deg"]` como «cartão navy montado», e no
     ÍNDICE isso devolvia 22 — são os cartões de aceleradores e as linhas de
     Consultoria, que usam o mesmo degradê em linha e nada têm com este bloco.
     A pergunta certa não é «existe degradê na página», é «o bloco “Fale com a
     Gente!” é um só, e ele está dentro de `.cta-ref`». */
  const titulos = [...document.querySelectorAll('h2')].filter(
    (h) => h.textContent.trim() === 'Fale com a Gente!',
  );
  const navy = titulos.filter((h) => !h.closest('.cta-ref')).length;
  const botao = ref?.querySelector('button, a[href="/#contato"]') ?? null;
  const h2 = ref?.querySelector('h2');
  const p = ref?.querySelector('p');
  return {
    temCtaRef: Boolean(ref),
    blocosFaleComAGente: titulos.length,
    cartaoNavyMontado: navy,
    titulo: h2?.textContent ?? null,
    paragrafo: p?.textContent ?? null,
    botao: botao
      ? {
          tag: botao.tagName.toLowerCase(),
          rotulo: botao.textContent.trim(),
          href: botao.getAttribute('href'),
        }
      : null,
    /* Entrada por reveal: o `RevealScope` só existe quando `revelar` chega. */
    temRevealScope: Boolean(ref?.querySelector('[data-reveal]')),
    dialogosNoDocumento: document.querySelectorAll('dialog').length,
  };
};

const saida = { issue: 'SIS-286', a1440: {}, a390: {}, emenda: {}, modal: {}, capturas: [] };

/* 1440 — índice e as SETE slugs. */
for (const rota of ['/solucoes', ...SLUGS.map((s) => `/solucoes/${s}`)]) {
  const { ctx, p } = await abrir(rota, 1440);
  await p.locator('.cta-ref').scrollIntoViewIfNeeded().catch(() => {});
  await p.waitForTimeout(1200);
  saida.a1440[rota] = await p.evaluate(lerCTA);

  if (['/solucoes', '/solucoes/fast', '/solucoes/match-ai'].includes(rota)) {
    const arq = `${CAPTURAS}/sis286-1440-${rota.replace(/\//g, '_')}.png`;
    await p.locator('.cta-ref').screenshot({ path: arq });
    saida.capturas.push(arq);
  }

  /* A emenda: pixel logo acima do topo de `.cta-ref` e logo abaixo dele. */
  saida.emenda[rota] = await p.evaluate(() => {
    const ref = document.querySelector('.cta-ref');
    const r = ref.getBoundingClientRect();
    const acima = document.elementFromPoint(r.left + r.width / 2, r.top - 6);
    return {
      classeDaSecaoDeCima:
        acima?.closest('section')?.className?.slice(0, 80) ?? acima?.tagName ?? null,
      fundoDeCima: getComputedStyle(acima?.closest('section') ?? document.body).backgroundColor,
      sombraDaRef: getComputedStyle(ref).boxShadow,
    };
  });
  await ctx.close();
}

/* 390 — as três rotas das capturas. */
for (const rota of ['/solucoes', '/solucoes/fast', '/solucoes/match-ai']) {
  const { ctx, p } = await abrir(rota, 390, 844);
  await p.locator('.cta-ref').scrollIntoViewIfNeeded().catch(() => {});
  await p.waitForTimeout(1200);
  saida.a390[rota] = await p.evaluate(lerCTA);
  const arq = `${CAPTURAS}/sis286-390-${rota.replace(/\//g, '_')}.png`;
  await p.locator('.cta-ref').screenshot({ path: arq });
  saida.capturas.push(arq);
  await ctx.close();
}

/* O MODAL, e o HOVER do botão, numa slug (o contrato é o mesmo nas sete). */
{
  const { ctx, p } = await abrir('/solucoes/match-ai', 1440);
  const botao = p.locator('.cta-ref button', { hasText: BOTAO });
  await botao.scrollIntoViewIfNeeded();
  await p.waitForTimeout(800);
  /* O repouso é lido ANTES de mover o ponteiro: com o mouse ainda sobre o botão,
     um `evaluate` «de repouso» devolveria o valor do hover. */
  saida.modal.hoverEmRepouso = await botao.evaluate((b) => getComputedStyle(b).translate);
  await botao.hover();
  await p.waitForTimeout(600);
  const arqHover = `${CAPTURAS}/sis286-1440-hover-botao.png`;
  await p.locator('.cta-ref').screenshot({ path: arqHover });
  saida.capturas.push(arqHover);
  /* SEGUNDA VOLTA ERRADA: eu lia `transform` e recebia `none` em cima do hover.
     O avanço do botão é `translate` (propriedade separada — `globals.css:25832`,
     escolhida lá justamente para não brigar com o `transform` dos presets de
     reveal), e a volta do círculo é `transform: rotate(180deg)` no `::before`
     dele (`globals.css:25907`). Ler `transform` no BOTÃO era medir a propriedade
     que este desenho de propósito não usa ali — e, no círculo, é justamente ela. */
  saida.modal.hoverDoBotao = await botao.evaluate((b) => ({
    translate: getComputedStyle(b).translate,
    circuloTransform: getComputedStyle(b.querySelector('.cta-ref-botao-circulo'), '::before')
      .transform,
  }));
  await botao.click();
  await p.waitForTimeout(900);
  saida.modal.abriu = await p.evaluate(() => {
    const d = document.querySelector('dialog[open], [role="dialog"]');
    return d ? { tag: d.tagName.toLowerCase(), visivel: d.getClientRects().length > 0 } : null;
  });
  const arqModal = `${CAPTURAS}/sis286-1440-modal.png`;
  await p.screenshot({ path: arqModal });
  saida.capturas.push(arqModal);
  await ctx.close();
}

/* Conferência da escrita contra os PADRÃO do componente. */
const escrita = {};
for (const [rota, l] of Object.entries({ ...saida.a1440, ...saida.a390 })) {
  escrita[rota] = {
    titulo: l.titulo === TITULO,
    paragrafo: l.paragrafo === PARAGRAFO,
    botao: l.botao?.rotulo === BOTAO,
  };
}
saida.escritaIgualAoPadrao = escrita;
saida.escritaOK = Object.values(escrita).every((e) => e.titulo && e.paragrafo && e.botao);

await navegador.close();
console.log(JSON.stringify(saida, null, 2));
