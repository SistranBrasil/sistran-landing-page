/**
 * SIS-263 — «reveal on scroll em toda a página» em `/contato`.
 *
 * `node scripts/medir-reveal-contato-sis263.mjs`
 *
 * O portão não pode ser "existe `data-reveal` no JSX": um nó marcado dentro de um
 * escopo que nunca intersecta, ou marcado com `fade-up` num nó cujo `transform`
 * pertence a um `@keyframes`, fica no código parecendo funcionar. O que se mede:
 *
 *  1. INVENTÁRIO DOS NÓS MARCADOS, com o escopo (`[data-in]`) de cada um. Um nó
 *     marcado SEM ancestral `[data-in]` nunca esconde (a folha só esconde sob
 *     `[data-in='false']`) — não é bug de aparência, é marcação morta, e é isto que
 *     esta lista pega.
 *  2. A VARREDURA DA ROLAGEM. Desce a página em degraus de meia janela e, em cada
 *     degrau, lê `data-in` de cada escopo e a `opacity` computada de cada nó
 *     marcado. Os dois números que valem: nenhum nó marcado terminando a varredura
 *     em `opacity < 1` (item 6 do §8 — "rolando rápido até o rodapé, nada fica
 *     preso invisível") e todo escopo tendo virado `true`.
 *  3. STICKY/FIXED SOB NÓ MARCADO (item 4 da issue). Enumera todo elemento com
 *     `position: sticky|fixed` na rota e diz se ele tem ancestral `[data-reveal]` —
 *     porque durante a entrada esse ancestral tem `transform`, o que cria bloco de
 *     contenção e quebra `fixed`. A lista tem de sair vazia.
 *  4. AS DUAS VIAS DE MOVIMENTO REDUZIDO. `reducedMotion` do contexto exercita o
 *     `@media`; o atributo `html[data-motion="reduce"]` é a via do próprio diálogo
 *     de preferência do site, e é a que a SIS-183 registra como a esquecida. Nas
 *     duas, todo nó marcado tem de ler `opacity: 1` e `transform: none`.
 *  5. SEM JAVASCRIPT. Sem JS ninguém escreve `data-in`, então a folha não casa e o
 *     conteúdo aparece pronto — é a propriedade do `useRevealTrigger`, e aqui ela é
 *     conferida e não suposta: contexto com `javaScriptEnabled: false`, medindo a
 *     `opacity` no HTML servido.
 *  6. O PORTÃO DA MALHA, de novo (SIS-128/«quadradinhos»): o `fade-up` do painel põe
 *     `transform` no `.contact-dialog-inner`, e é a `position: relative` dele que
 *     mantém a `.grade-tecnica` (`z-index: 0`) por baixo do conteúdo. Se o reveal
 *     tivesse trocado o `position`, a malha atravessaria o cartão.
 *  7. A ABERTURA (2ª volta): com a cortina do `RouteLoadGate` de pé nenhum nó
 *     marcado pode estar visível, e depois da liberação os nós da primeira dobra
 *     têm de surgir SEM rolagem. Os dois lados importam: sem o primeiro a entrada
 *     roda no escuro e a página chega parada; sem o segundo fica conteúdo visível
 *     na tela preso em `opacity: 0` esperando a primeira rolagem — que era o
 *     defeito da 1ª volta, medido em y=742..1000 com janela de 900.
 *     Ver o comentário longo no bloco: o que se mede não é "nó visível sob a
 *     cortina" (isso é legítimo duas vezes), e sim escopo ACENDENDO sob a cortina e
 *     o esconder vazando para depois dela.
 */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import { mkdir, writeFile } from 'node:fs/promises';

await mkdir('docs/capturas', { recursive: true });
await mkdir('docs/medidas', { recursive: true });

const URL = 'http://localhost:3000/contato';
const nav = await chromium.launch();
const res = {};

/* Identificador legível de um nó, para o relatório: tag + classe/atributo que a
   pessoa vai procurar no JSX. `outerHTML` não serve — o painel tem 40 kB. */
const IDENT = `(n) => {
  const cls = (n.className && typeof n.className === 'string' ? '.' + n.className.trim().split(/\\s+/).slice(0, 2).join('.') : '');
  return n.tagName.toLowerCase() + cls + (n.id ? '#' + n.id : '');
}`;

async function abrir(ctx) {
  const p = await ctx.newPage();
  const erros = [];
  p.on('console', (m) => { if (m.type() === 'error') erros.push(m.text()); });
  await p.goto(URL, { waitUntil: 'networkidle' });
  await p.waitForSelector('[data-route-content][data-route-liberado="true"]', { timeout: 40000 });
  await p.waitForSelector('[data-route-loading]', { state: 'detached', timeout: 40000 });
  await p.waitForTimeout(1200);
  return { p, erros };
}

/* ── 7 (2ª volta): A ABERTURA. «que as coisas comecem a surgir após o
      carregamento» é uma medida de ORDEM, não de aparência: com a cortina de pé
      nenhum nó marcado pode estar visível (senão a entrada rodou no escuro e a
      pessoa recebe a página já parada), e depois da liberação todo escopo da
      primeira dobra tem de acender sem rolagem nenhuma.
      A amostragem começa em `waitUntil: 'commit'` porque o defeito vive ANTES do
      `networkidle` que as outras aferições esperam — medir depois é medir a página
      já pronta e não ver nada. */
{
  const ctx = await nav.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addInitScript(() => localStorage.setItem('sistran-motion-preference-seen', '1'));
  const p = await ctx.newPage();
  await p.goto(URL, { waitUntil: 'commit' });

  const amostras = [];
  for (let k = 0; k < 120; k++) {
    amostras.push(await p.evaluate(() => ({
      t: Math.round(performance.now()),
      cortina: Boolean(document.querySelector('[data-route-loading]')),
      liberado: document.querySelector('[data-route-content]')?.getAttribute('data-route-liberado') ?? null,
      escopos: [...document.querySelectorAll('[data-in]')].map((n) => n.dataset.in).join(','),
      /* Só os nós da primeira dobra: é deles que o pedido fala. */
      naDobra: [...document.querySelectorAll('[data-reveal]')]
        .filter((n) => n.getBoundingClientRect().top < window.innerHeight)
        .map((n) => Number(getComputedStyle(n).opacity).toFixed(2)),
    })).catch(() => null));
    await p.waitForTimeout(100);
  }
  const validas = amostras.filter(Boolean);
  /* ⚠️ O QUE ESTA MEDIDA APRENDEU NA PRÓPRIA MEDIÇÃO, e a versão anterior errava.
     A primeira redação contava "nó marcado com `opacity > 0.5` e cortina de pé" e
     acusou 11, depois 7. Nenhuma delas era defeito. Duas coisas legítimas caem
     nessa conta:
       (a) ANTES da hidratação ninguém escreveu `data-in`, então a folha não casa e
           todo nó marcado lê `opacity: 1`. É a propriedade do item 5 (sem JS o
           conteúdo aparece pronto) e é o comportamento correto.
       (b) NO instante da hidratação o `useRevealTrigger` escreve `data-in="false"`,
           e os nós então percorrem a transição de 820ms DE 1 PARA 0 — eles se
           ESCONDEM, em cascata. Foi isso que as 7 amostras mostraram
           (1.00 → 0.27 → 0.14 → 0.04 → 0.01 → 0.00 nos índices baixos).
     O (b) não é bug: é exatamente o que a cortina do `RouteLoadGate` existe para
     cobrir. O que seria bug é o oposto de cada um: o escopo ACENDER com a cortina
     ainda de pé (a entrada rodando no escuro — `acendeuSobCortina`), ou o
     esconder ainda estar em curso quando a cortina levanta, e aí a pessoa vê o
     conteúdo desaparecer antes de aparecer (`escondeuComCortinaJaFora`).
     São esses dois que passaram a ser medidos. */
  const comCortina = validas.filter((a) => a.cortina && a.escopos !== '');
  const tLiberou = validas.find((a) => a.liberado === 'true')?.t ?? null;
  const tAcendeu = validas.find((a) => a.liberado === 'true' && a.escopos.startsWith('true'))?.t ?? null;

  res.abertura = {
    scrollY: await p.evaluate(() => window.scrollY),
    tLiberou,
    tAcendeu,
    /* O número do pedido: quanto depois da cortina a primeira dobra surge.
       ⚠️ LER JUNTO COM `maiorVaoEntreAmostras`: a sonda amostra a cada ~110ms via
       `evaluate`, e logo depois da cortina o main thread fica ocupado montando o
       resto da rota. Na primeira leitura de 14/09 este campo deu 1062ms com um vão
       de 855ms entre duas amostras — ou seja, quase tudo era a sonda cega, não
       espera. Repetida, deu 215ms e 224ms. O campo mede o que a sonda VIU; não há
       atraso programado nenhum entre a cortina sair e o escopo acender. */
    msDepoisDaCortina: tLiberou !== null && tAcendeu !== null ? tAcendeu - tLiberou : null,
    maiorVaoEntreAmostras: validas
      .slice(1)
      .reduce((mx, a, k) => Math.max(mx, a.t - validas[k].t), 0),
    /* Tem de ser 0: escopo em `true` com a cortina de pé é entrada rodando no
       escuro — a pessoa recebe a página já parada no estado final. */
    acendeuSobCortina: comCortina.filter((a) => a.escopos.includes('true')).length,
    /* Tem de ser 0: amostra JÁ sem cortina em que algum nó da dobra ainda está no
       meio do caminho DESCENDO (entre 0.02 e 0.98) antes de o escopo acender. É o
       flash de "conteúdo somindo" que a cortina tem de engolir. */
    escondeuComCortinaJaFora: validas.filter(
      (a) => !a.cortina && a.escopos !== '' && !a.escopos.includes('true')
        && a.naDobra.some((o) => Number(o) > 0.02 && Number(o) < 0.98),
    ).length,
    /* A cascata do esconder, para quem for reduzir a cortina saber de quanto tempo
       ela precisa. */
    amostrasDoEsconder: comCortina
      .filter((a) => a.naDobra.some((o) => Number(o) > 0.02))
      .map((a) => `${a.t}ms esc=[${a.escopos}] dobra=[${a.naDobra.join(' ')}]`),
    /* Tem de ser 0: nó da dobra ainda invisível no fim da amostragem, SEM rolagem
       nenhuma, é o defeito da 1ª volta (bloco preso na dobra até a pessoa rolar). */
    presosNaDobra: (validas[validas.length - 1]?.naDobra ?? []).filter((o) => Number(o) < 0.99).length,
    amostrasNaVirada: validas
      .filter((a) => tLiberou !== null && a.t >= tLiberou - 400 && a.t <= tLiberou + 2000)
      .map((a) => `${a.t}ms cortina=${a.cortina} lib=${a.liberado} esc=[${a.escopos}] dobra=[${a.naDobra.join(' ')}]`),
  };
  await p.screenshot({ path: 'docs/capturas/sis263-contato-1440-abertura.png', clip: { x: 0, y: 0, width: 1440, height: 900 } });
  await ctx.close();
}

/* ── 1, 2, 3, 6: movimento normal a 1440 ─────────────────────────────────── */
{
  const ctx = await nav.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  await ctx.addInitScript(() => localStorage.setItem('sistran-motion-preference-seen', '1'));
  const { p, erros } = await abrir(ctx);
  res.normal1440 = { erros };

  res.normal1440.inventario = await p.evaluate((identFonte) => {
    const ident = eval(identFonte);
    return [...document.querySelectorAll('[data-reveal]')].map((n) => {
      const escopo = n.closest('[data-in]');
      return {
        no: ident(n),
        preset: n.getAttribute('data-reveal'),
        i: getComputedStyle(n).getPropertyValue('--reveal-i').trim() || '0',
        escopo: escopo ? ident(escopo) : null,
        /* Sem escopo a folha nunca esconde: marcação morta. */
        temEscopo: Boolean(escopo),
        /* Um `@keyframes` no próprio nó marcado é o caso em que `fade-up` não sobe:
           animação vence transição. Se aparecer aqui com preset que mexe em
           `transform`, o preset está errado. */
        animationName: getComputedStyle(n).animationName,
      };
    });
  }, IDENT);

  res.normal1440.escopos = await p.evaluate((identFonte) => {
    const ident = eval(identFonte);
    return [...document.querySelectorAll('[data-in]')].map((n) => ({ no: ident(n), estado: n.dataset.in }));
  }, IDENT);

  res.normal1440.stickyFixed = await p.evaluate((identFonte) => {
    const ident = eval(identFonte);
    const raiz = document.querySelector('[data-route-content]') ?? document.body;
    return [...raiz.querySelectorAll('*')]
      .filter((n) => ['sticky', 'fixed'].includes(getComputedStyle(n).position))
      .map((n) => ({ no: ident(n), position: getComputedStyle(n).position, dentroDeMarcado: Boolean(n.parentElement?.closest('[data-reveal]')) }));
  }, IDENT);

  /* 2 — a varredura. Meia janela por degrau, com folga para a transição.
     ⚠️ A FOLGA É REFÉM DO CALIBRE (2ª volta): a transição foi para 820ms e a
     cascata dos sete indicadores soma 6 × 95ms de atraso — 820 + 570 = 1390ms no
     pior caso (o sétimo cartão; o atraso do índice 0 é zero).
     Com os 700ms de antes, esta sonda leria como "preso invisível" um nó que só
     estava no meio da entrada, e o falso positivo mandaria o próximo mexer no
     lugar errado. Valores anteriores: 700ms por degrau, e nenhum assentamento
     no fim da varredura. */
  const passos = [];
  const alturaDoc = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y <= alturaDoc; y += 450) {
    await p.evaluate((v) => window.scrollTo({ top: v, behavior: 'instant' }), y);
    await p.waitForTimeout(1000);
    passos.push(await p.evaluate((identFonte) => {
      const ident = eval(identFonte);
      return {
        y: Math.round(window.scrollY),
        escopos: [...document.querySelectorAll('[data-in]')].map((n) => n.dataset.in).join(','),
        invisiveis: [...document.querySelectorAll('[data-reveal]')]
          .filter((n) => Number(getComputedStyle(n).opacity) < 0.99)
          .map((n) => ident(n)),
      };
    }, IDENT));
  }
  res.normal1440.varredura = passos;
  /* O assentamento final, separado do último degrau: é ele que dá ao item 6 do §8
     ("rolando rápido até o rodapé, nada fica preso invisível") uma leitura sobre
     página PARADA, e não sobre transição em curso. */
  await p.waitForTimeout(1800);
  res.normal1440.presosNoFim = await p.evaluate((identFonte) => {
    const ident = eval(identFonte);
    return [...document.querySelectorAll('[data-reveal]')]
      .filter((n) => Number(getComputedStyle(n).opacity) < 0.99)
      .map((n) => ident(n));
  }, IDENT);

  /* 6 — o portão da malha continua de pé com o `fade-up` no cartão. */
  res.normal1440.portaoDaMalha = await p.evaluate(() => {
    const c = document.querySelector('.contact-dialog-inner');
    return { position: getComputedStyle(c).position, preset: c.getAttribute('data-reveal') };
  });
  res.normal1440.scrollWidth = await p.evaluate(() => document.documentElement.scrollWidth);

  /* Capturas rolando: uma por bloco, na entrada dele. */
  const marcos = [
    ['indicadores', '.contato-indicadores'],
    ['logos', '.contato-faixa-parceiros'],
    ['painel', '.fundo-contato-cena'],
    ['mapa', '.mapa-cartao'],
    ['palco', '.palco-copy'],
  ];
  for (const [nome, sel] of marcos) {
    await p.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await p.waitForTimeout(300);
    await p.locator(sel).first().evaluate((n) => n.scrollIntoView({ block: 'center', behavior: 'instant' }));
    await p.waitForTimeout(1800);
    await p.screenshot({ path: `docs/capturas/sis263-contato-1440-${nome}.png`, clip: { x: 0, y: 0, width: 1440, height: 900 } });
  }
  await ctx.close();
}

/* ── 4: as duas vias de movimento reduzido ───────────────────────────────── */
const conferirEstatico = async (p) => p.evaluate(() => {
  const nos = [...document.querySelectorAll('[data-reveal]')];
  const ruins = nos.filter((n) => {
    const c = getComputedStyle(n);
    return Number(c.opacity) < 0.99 || (c.transform !== 'none' && !/matrix\(1, 0, 0, 1, 0, 0\)/.test(c.transform));
  }).map((n) => ({ no: n.tagName.toLowerCase(), opacity: getComputedStyle(n).opacity, transform: getComputedStyle(n).transform }));
  return { marcados: nos.length, ruins };
});

{
  const ctx = await nav.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  await ctx.addInitScript(() => localStorage.setItem('sistran-motion-preference-seen', '1'));
  const { p } = await abrir(ctx);
  res.reduceMedia = await conferirEstatico(p);
  await ctx.close();
}
{
  const ctx = await nav.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addInitScript(() => localStorage.setItem('sistran-motion-preference-seen', '1'));
  const { p } = await abrir(ctx);
  await p.evaluate(() => document.documentElement.setAttribute('data-motion', 'reduce'));
  /* ⚠️ A ESPERA AQUI É MEDIDA, NÃO CHUTE. A via do atributo é aplicada DEPOIS da
     primeira pintura (o diálogo de preferência escreve em `<html>` com a página já
     na tela), e o espelho de `globals.css` força `opacity: 1 !important` SEM tocar
     em `transition-duration` — então o nó ainda percorre a transição inteira mais
     o `transition-delay` de `--motion-stagger-reveal` × `--reveal-i`.
     ⚠️ Os números deste parágrafo eram os do calibre da 1ª volta (500ms + 7 × 80ms,
     480ms de último atraso, 980ms no pior caso) e caducaram na 2ª volta: com o
     calibre de escopo de `app/contato/reveal-calibre.ts` o pior caso é
     820 + 6 × 95 = 1390ms. A conclusão não mudou — 1800ms continua cobrindo —, mas
     quem for reduzir esta espera tem de comparar com 1390, não com 980.
     Com 600ms de espera esta sonda
     acusou 5 dos 7 `<li>` e 2 `<p>` em `opacity: 0` — leitura de transição em
     curso, não regra faltando; exatamente os índices altos, que é a assinatura do
     atraso. Valor anterior: 600. Se alguém encurtar isto, o falso positivo volta e
     custa uma mudança de CSS que ninguém precisa. */
  await p.waitForTimeout(1800);
  res.reduceAtributo = await conferirEstatico(p);
  await ctx.close();
}

/* ── 5: sem JavaScript ───────────────────────────────────────────────────── */
{
  const ctx = await nav.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
  const p = await ctx.newPage();
  await p.goto(URL, { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(800);
  res.semJs = await p.evaluate(() => {
    const nos = [...document.querySelectorAll('[data-reveal]')];
    return {
      marcados: nos.length,
      escoposComDataIn: document.querySelectorAll('[data-in]').length,
      invisiveis: nos.filter((n) => Number(getComputedStyle(n).opacity) < 0.99).length,
      /* item 4 do §8: o texto está no DOM, então Ctrl+F o encontra. */
      textoDoPalco: document.body.innerText.includes('#timeSISTRAN'),
    };
  });
  await p.screenshot({ path: 'docs/capturas/sis263-contato-1440-sem-js.png', fullPage: false });
  await ctx.close();
}

/* ── 390, só a varredura: o mesmo item 6 do §8 em tela estreita ──────────── */
{
  const ctx = await nav.newContext({ viewport: { width: 390, height: 844 } });
  await ctx.addInitScript(() => localStorage.setItem('sistran-motion-preference-seen', '1'));
  const { p, erros } = await abrir(ctx);
  const alturaDoc = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y <= alturaDoc; y += 400) {
    await p.evaluate((v) => window.scrollTo({ top: v, behavior: 'instant' }), y);
    await p.waitForTimeout(900);
  }
  await p.waitForTimeout(1800);
  res.w390 = {
    erros,
    scrollWidth: await p.evaluate(() => document.documentElement.scrollWidth),
    presosNoFim: await p.evaluate(() => [...document.querySelectorAll('[data-reveal]')]
      .filter((n) => Number(getComputedStyle(n).opacity) < 0.99).length),
  };
  await ctx.close();
}

await writeFile('docs/medidas/reveal-contato-sis263.json', `${JSON.stringify(res, null, 1)}\n`);
console.log(JSON.stringify(res, null, 1));
await nav.close();
