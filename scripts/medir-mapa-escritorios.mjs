/* «o mapa ta ficando muito pequeno … muito distante nos dois» — a sonda que dá o
   NÚMERO desse "pequeno", por parada e por janela, antes e depois do ajuste.

   O QUE ELA MEDE, e por que estes alvos:
     · `.bm-pais` — a silhueta do BRASIL, que é o sujeito. Não `.bm-mapa`: aquela é
       a célula da grade e não se move quando a câmera transforma (a nota de
       `--os-desliza` no `globals.css` já registra esse erro). É a largura desta
       caixa, em px de tela, que responde «quão pequeno».
     · a caixa de CONTEÚDO do `<svg>` — o recorte de verdade. O `padding` do
       `.bm-mapa` encolhe o viewport, e foi medir contra a borda errada que deixou
       o norte do Brasil cortado na SIS-191. Sobra em cima/baixo/esq/dir: se
       qualquer uma for negativa, aproximar cortou o país.
     · a coluna de leitura (`.os-coluna`) e o cartão pousado (`.os-painel` visível)
       — as duas soleiras que o zoom não pode invadir. Aproximar o mapa por cima do
       texto é o defeito oposto do que se está corrigindo.

   AS PARADAS são lidas do próprio percurso, não de um px escolhido: o curso do
   sticky é `trilha.offsetHeight - inner.offsetHeight` (a mesma expressão do `end`
   do gatilho em `OfficesScene.tsx`), e cada fração vem de `PARADAS` abaixo.

   `ESCALA_PR` / `ESCALA_SP` / `RECUO` / `DESLIZA` injetam override de CSS para
   varrer candidatos sem editar a folha — é assim que os valores escolhidos ficam
   medidos em vez de chutados.

     node scripts/medir-mapa-escritorios.mjs
     ESCALA_PR=1.2 ESCALA_SP=1.2 RECUO=0.2 DESLIZA=-30 node scripts/medir-mapa-escritorios.mjs
*/
import { writeFileSync, mkdirSync } from 'node:fs';
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/361ceb562f3b3235/node_modules/playwright/index.mjs';

const EXE =
  process.env.LOCALAPPDATA +
  '/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe';
const ROTA = process.env.ROTA ?? 'http://localhost:3000/quem-somos';
/* Só telas no `modo scroll` (>=1280 de largura e >=760 de altura): é lá que a
   câmera existe. As estreitas caem no modo lista, onde o mapa não tem zoom. */
const JANELAS = [
  { w: 1280, h: 800 },
  { w: 1280, h: 1000 },
  { w: 1366, h: 900 },
  { w: 1440, h: 900 },
  { w: 1800, h: 1000 },
];
/* Centro de cada pouso, em fração do curso — os mesmos `POUSO` do componente. */
/* 24/09 — tres paradas. As fracoes sao as de `POUSO` depois da entrada do Rio:
   1/12, 7/12 e 11/12 do curso (antes eram 0.125 e 0.875, com o curso de 200svh). */
const PARADAS = (process.env.PARADAS ?? '0.0833,0.5833,0.9167')
  .split(',')
  .map(Number);

const OVR = [];
if (process.env.ESCALA_PR)
  OVR.push(
    `.os-palco[data-modo='scroll'][data-ativa='pr']{--os-foco-escala:${process.env.ESCALA_PR}!important}`,
  );
if (process.env.ESCALA_SP)
  OVR.push(
    `.os-palco[data-modo='scroll'][data-ativa='sp']{--os-foco-escala:${process.env.ESCALA_SP}!important}`,
  );
if (process.env.FOCOX_PR)
  OVR.push(
    `.os-palco[data-modo='scroll'][data-ativa='pr']{--os-foco-x:${process.env.FOCOX_PR}%!important}`,
  );
if (process.env.FOCOX_SP)
  OVR.push(
    `.os-palco[data-modo='scroll'][data-ativa='sp']{--os-foco-x:${process.env.FOCOX_SP}%!important}`,
  );
if (process.env.FOCOY_PR)
  OVR.push(
    `.os-palco[data-modo='scroll'][data-ativa='pr']{--os-foco-y:${process.env.FOCOY_PR}%!important}`,
  );
if (process.env.FOCOY_SP)
  OVR.push(
    `.os-palco[data-modo='scroll'][data-ativa='sp']{--os-foco-y:${process.env.FOCOY_SP}%!important}`,
  );
/* 24/09 — os tres parafusos da aproximacao do Rio, varridos pelo mesmo caminho
   dos outros: override injetado, nunca edicao da folha antes de medir. */
if (process.env.LENTE || process.env.ARRASTA || process.env.SOBE) {
  const l = process.env.LENTE ?? '1.2';
  const a = process.env.ARRASTA ?? '5.6';
  const s = process.env.SOBE ?? '-20.7';
  OVR.push(
    `.os-palco[data-modo='scroll'] .bm-camera{--os-lente:calc(1 + ${l} * var(--os-aproxima,0))!important;--os-arrasta:calc(var(--os-aproxima,0) * ${a}%)!important;--os-sobe:calc(var(--os-aproxima,0) * ${s}%)!important}`,
  );
}
if (process.env.RECUO || process.env.DESLIZA) {
  const r = process.env.RECUO ?? '0.64';
  const d = process.env.DESLIZA ?? '-52';
  OVR.push(
    `.os-palco[data-modo='scroll'] .bm-camera{--os-recuo:calc(1 - ${r} * var(--os-transito,0))!important;--os-desliza:calc(var(--os-transito,0) * ${d}%)!important}`,
  );
}

const nav = await chromium.launch({ executablePath: EXE });
const saida = { rota: ROTA, quando: new Date().toISOString(), override: OVR, janelas: [] };

for (const { w, h } of JANELAS) {
  const ctx = await nav.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await ctx.addInitScript(() => {
    localStorage.setItem('sistran-motion-preference', 'full');
    localStorage.setItem('sistran-motion-preference-seen', '1');
    sessionStorage.setItem('sistran:intro-visto', 'true');
  });
  const pag = await ctx.newPage();
  const erros = [];
  pag.on('console', (m) => {
    if (m.type() === 'error') erros.push(m.text().slice(0, 180));
  });
  pag.on('pageerror', (e) => erros.push(`pageerror: ${String(e).slice(0, 180)}`));
  await pag.goto(ROTA, { waitUntil: 'domcontentloaded' });
  await pag.waitForSelector('[data-route-liberado="true"]', { timeout: 30000 });
  await pag.addStyleTag({
    content: `nextjs-portal,[data-nextjs-toast],[href="#conteudo"]{display:none!important}${OVR.join('')}`,
  });

  /* Rolar até a cena com a roda (o Lenis não obedece `scrollTo` seco) e só então
     ler o curso: a trilha só tem altura depois de a cena entrar no modo scroll. */
  const paradas = [];
  for (const f of PARADAS) {
    const alvo = await pag.evaluate(() => {
      const t = document.querySelector('.os-trilha');
      const i = t?.querySelector('.os-inner');
      if (!t || !i) return null;
      const b = t.getBoundingClientRect();
      return {
        topo: Math.round(b.top + scrollY),
        curso: Math.max(1, t.offsetHeight - i.offsetHeight),
      };
    });
    if (!alvo) {
      paradas.push({ f, erro: 'sem .os-trilha (modo lista?)' });
      continue;
    }
    const y = alvo.topo + Math.round(alvo.curso * f);
    await pag.evaluate((yy) => window.scrollTo({ top: yy, behavior: 'instant' }), y);
    /* A câmera tem transição de 1,1s e o cartão anda por transform: esperar o
       quadro PARADO, senão a medida é de um estado a caminho. */
    await pag.waitForTimeout(1800);

    const m = await pag.evaluate(() => {
      const palco = document.querySelector('.os-palco');
      const svg = document.querySelector('.bm-mapa');
      const pais = document.querySelector('.bm-pais');
      const coluna = palco?.querySelector('.os-coluna');
      /* O cartão é `.os-painel`; o visível é o que não está `inert`/`aria-hidden`
         (a cena esconde os outros por atributo, não por display). */
      const cartoes = [...(palco?.querySelectorAll('.os-painel') ?? [])].filter(
        (el) => !el.hasAttribute('aria-hidden') && el.getBoundingClientRect().width > 0,
      );
      if (!svg || !pais) return null;
      const cs = getComputedStyle(svg);
      const bs = svg.getBoundingClientRect();
      /* Caixa de CONTEÚDO do svg: a borda de recorte de verdade. */
      const rec = {
        esq: bs.left + parseFloat(cs.paddingLeft || '0'),
        dir: bs.right - parseFloat(cs.paddingRight || '0'),
        topo: bs.top + parseFloat(cs.paddingTop || '0'),
        base: bs.bottom - parseFloat(cs.paddingBottom || '0'),
      };
      const bp = pais.getBoundingClientRect();
      const bc = coluna?.getBoundingClientRect();
      /* 24/09 — na parada do Rio o portao NAO é o pais inteiro (aproximar é o
         pedido, e aproximar recorta o continente): é o PINO e o ROTULO do Rio
         dentro do recorte e livres das duas soleiras. */
      const alvoRj = document.querySelector('.bm-mapa g[data-cidade="rj"] .bm-nucleo');
      const rotRj = document.querySelector('.bm-rotulo[data-cidade="rj"]');
      const cartao = cartoes.length ? cartoes[cartoes.length - 1].getBoundingClientRect() : null;
      const r = (n) => Math.round(n * 10) / 10;
      const caixa = (el) => {
        if (!el) return null;
        const b = el.getBoundingClientRect();
        return {
          esq: r(b.left),
          dir: r(b.right),
          topo: r(b.top),
          base: r(b.bottom),
          dentro:
            b.left >= rec.esq && b.right <= rec.dir && b.top >= rec.topo && b.bottom <= rec.base,
          folgaColuna: bc ? r(b.left - bc.right) : null,
          folgaCartao: cartoes.length
            ? r(cartoes[cartoes.length - 1].getBoundingClientRect().left - b.right)
            : null,
        };
      };
      return {
        ativa: palco?.dataset.ativa ?? null,
        transito: getComputedStyle(palco).getPropertyValue('--os-transito').trim(),
        aproxima: getComputedStyle(palco).getPropertyValue('--os-aproxima').trim(),
        rjPino: caixa(alvoRj),
        rjRotulo: caixa(rotRj),
        pais: { esq: r(bp.left), dir: r(bp.right), topo: r(bp.top), base: r(bp.bottom), larg: r(bp.width), alt: r(bp.height) },
        recorte: { esq: r(rec.esq), dir: r(rec.dir), topo: r(rec.topo), base: r(rec.base) },
        sobra: {
          esq: r(bp.left - rec.esq),
          dir: r(rec.dir - bp.right),
          topo: r(bp.top - rec.topo),
          base: r(rec.base - bp.bottom),
        },
        colunaDir: bc ? r(bc.right) : null,
        folgaColuna: bc ? r(bp.left - bc.right) : null,
        cartaoEsq: cartao ? r(cartao.left) : null,
        folgaCartao: cartao ? r(cartao.left - bp.right) : null,
      };
    });
    paradas.push({ f, ...(m ?? { erro: 'sem mapa' }) });
  }

  saida.janelas.push({ largura: w, altura: h, paradas, erros });
  console.log(`\n=== ${w}x${h} ===`);
  for (const p of paradas) {
    if (p.erro) {
      console.log(`  f=${p.f}  ${p.erro}`);
      continue;
    }
    console.log(
      `  f=${p.f} ativa=${p.ativa} transito=${p.transito} | BRASIL ${p.pais.larg}x${p.pais.alt}px` +
        `  sobra recorte e/d/t/b ${p.sobra.esq}/${p.sobra.dir}/${p.sobra.topo}/${p.sobra.base}` +
        `  folga coluna ${p.folgaColuna} cartao ${p.folgaCartao}`,
    );
    if (p.ativa === 'rj' && p.rjPino) {
      console.log(
        `        RIO aprox=${p.aproxima} pino dentro=${p.rjPino.dentro} coluna ${p.rjPino.folgaColuna} cartao ${p.rjPino.folgaCartao}` +
          ` | rotulo dentro=${p.rjRotulo?.dentro} coluna ${p.rjRotulo?.folgaColuna} cartao ${p.rjRotulo?.folgaCartao}`,
      );
    }
  }
  if (erros.length) console.log(`  erros de console: ${erros.length} — ${erros[0]}`);
  await ctx.close();
}

await nav.close();
mkdirSync('docs/medidas', { recursive: true });
const nome = process.env.SAIDA ?? 'docs/medidas/mapa-escritorios.json';
writeFileSync(nome, `${JSON.stringify(saida, null, 2)}\n`);
console.log(`\n→ ${nome}`);
