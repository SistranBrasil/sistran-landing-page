/* SIS-201 — «cards mesmo tamanho + sem eco hover + filtros abaixo + carimbo perto».
 *
 * POR QUE UMA SONDA NOVA, e não a `medir-eco-hover-sis201.mjs` que já existe: aquela
 * responde a pergunta OPOSTA. Ela nasceu para provar que o eco cabia sem invadir a
 * copy — o critério dela é «o eco existe e não encosta no texto». Esta issue manda
 * RETIRAR o eco, então o aceite daqui é «o eco não existe em estado nenhum», que a
 * sonda antiga não sabe dizer. Ela também localizava os cards por
 * `.partner-terminal__card h3`, seletor que a SIS-219 deixou sem alvo ao remover o
 * `<h3>`.
 *
 * Os quatro itens do aceite, cada um com o número que o reprova:
 *
 *   1. CAIXA IGUAL — dispersão `max/min` da altura dos cards, medida DENTRO de cada
 *      filtro E entre filtros. Os dois são necessários e é o segundo que pega o
 *      defeito real: a trilha é flex com `align-items: stretch`, então dentro de um
 *      filtro os cards já saem iguais de graça (todos herdam a altura do mais alto
 *      da linha). O que muda a caixa é TROCAR de filtro — o subconjunto tem outro
 *      card mais alto, e a fila inteira redimensiona. Medir só o estado «todos»
 *      devolveria 1,000 e daria a issue por cumprida sem ela estar.
 *   2. ECO — contagem de nós `.partner-terminal__eco`/`__eco-img` no DOM, mais a
 *      opacidade computada COM O PONTEIRO EM CIMA de um card. Contar nó é o portão
 *      forte (a issue diz «remover»); a opacidade no hover é a rede para o caso de o
 *      nó sair e sobrar uma regra acendendo outra coisa no lugar.
 *   3. ORDEM — `filtros.top` contra `trilha.bottom`. «Abaixo dos cards» é isso e é
 *      geometria, não ordem no código: um `order` de flex ou um `row` de grade
 *      poderia mover no DOM sem mover na tela, e o contrário também.
 *   4. CARIMBO — vão vertical entre `#parceiros-titulo.bottom` e o topo do primeiro
 *      card. É o número que a captura «muito afastado» está reclamando.
 *
 * DUAS DECISÕES DE MÉTODO:
 *
 *   · A altura é lida de `getBoundingClientRect()`, não de `offsetHeight`: no
 *     desktop a trilha inteira anda por `transform`, e o que a issue compara é o que
 *     o olho vê. Transform de translação não altera altura, então as duas
 *     coincidem aqui — mas se algum dia entrar `scale` a caixa visual é a certa.
 *   · O hover é feito com `mouse.move` sobre o centro do card, não com
 *     `dispatchEvent`: `:hover` é estado do navegador e não acende por evento
 *     sintético. Sem isso o item 2 passaria sempre.
 *
 *   node scripts/medir-cards-parceiros-sis201.mjs
 *   SAIDA=docs/medidas/cards-parceiros-sis201-depois.json node scripts/medir-cards-parceiros-sis201.mjs
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/361ceb562f3b3235/node_modules/playwright/index.mjs';

const EXE =
  process.env.LOCALAPPDATA +
  '/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe';
const ROTA = process.env.ROTA ?? 'http://localhost:3000/parceiros-e-implementacoes';

/* As três larguras que o aceite nomeia. 1024 entra porque é o limiar do pin
   (`min-width: 1024px`): é a largura onde o card fica mais estreito COM a trilha já
   transformada, e onde qualquer teto de largura de placa estoura primeiro. */
const JANELAS = (process.env.JANELAS ?? '390x844,768x900,1024x800,1440x900')
  .split(',')
  .map((s) => {
    const [w, h] = s.split('x').map(Number);
    return { w, h };
  });

const OVR = [];
/* Varredura sem editar a folha: é assim que a altura escolhida no item 1 e o vão do
   item 4 ficam medidos em vez de chutados. */
if (process.env.CARD_ALTURA) {
  OVR.push(`.partner-terminal__card{height:${process.env.CARD_ALTURA}!important}`);
}
if (process.env.SEM_ECO) {
  OVR.push(`.partner-terminal__eco{display:none!important}`);
}
if (process.env.PAD_TOPO) {
  OVR.push(`.partner-terminal{padding-block-start:${process.env.PAD_TOPO}!important}`);
}

const LER = () => {
  const r = (n) => Math.round(n * 10) / 10;
  const raiz = document.querySelector('.partner-terminal');
  const trilha = document.querySelector('.partner-terminal__track');
  const filtros = document.querySelector('.partner-terminal__filters');
  const setas = document.querySelector('.partner-terminal__arrows');
  const status = document.querySelector('.partner-terminal__status');
  const carimbo = document.querySelector('#parceiros-titulo');
  const cards = [...document.querySelectorAll('.partner-terminal__card')];
  if (!trilha || !cards.length) return null;

  const cx = (el) => {
    if (!el) return null;
    const b = el.getBoundingClientRect();
    return { larg: r(b.width), alt: r(b.height), topo: r(b.top), base: r(b.bottom) };
  };

  const bt = trilha.getBoundingClientRect();
  const bc = carimbo?.getBoundingClientRect();
  const primeiro = cards[0].getBoundingClientRect();

  return {
    modo: raiz?.dataset.pinned === 'true' ? 'pin' : 'nativo',
    quantos: cards.length,
    /* Cada card, para a dispersão sair de dados e não de um agregado opaco. */
    cards: cards.map((el, i) => {
      const b = el.getBoundingClientRect();
      const placa = el.querySelector('.partner-terminal__placa-img');
      const conteudo = el.querySelector('.partner-terminal__content');
      const bcon = conteudo?.getBoundingClientRect();
      return {
        i,
        marca: el.querySelector('.partner-terminal__placa-img')?.getAttribute('alt') ?? null,
        larg: r(b.width),
        alt: r(b.height),
        /* `scrollHeight > clientHeight` = o conteúdo não cabe na caixa travada.
           É a soleira que qualquer altura fixa pode romper, e é ela que separa
           «cards iguais» de «cards iguais com texto cortado». */
        estouro: Math.max(0, el.scrollHeight - el.clientHeight),
        /* ⚠️ `estouro` SOZINHO NÃO BASTA, e o motivo é a direção do corte:
           `.content` é coluna com `justify-content: flex-end`, então conteúdo que
           não cabe transborda PARA CIMA — e `scrollHeight` só conta o que passa da
           borda de BAIXO. Um card com a copy decapitada no topo devolveria
           `estouro: 0`.
           `sangraTopo` é o número que pega isso: positivo = o `.content` começa
           ACIMA do topo do card, ou seja, o `overflow: hidden` está comendo texto. */
        sangraTopo: bcon ? Math.max(0, r(b.top - bcon.top)) : null,
        conteudoAlt: bcon ? r(bcon.height) : null,
        placaAlt: placa ? r(placa.getBoundingClientRect().height) : null,
      };
    }),
    /* ITEM 2 — o eco. Contagem de nó é o portão; a issue diz «remover». */
    eco: {
      nos: document.querySelectorAll('.partner-terminal__eco').length,
      imgs: document.querySelectorAll('.partner-terminal__eco-img').length,
    },
    /* ITEM 3 — ordem NA TELA. */
    trilhaCaixa: cx(trilha),
    filtrosCaixa: cx(filtros),
    setasCaixa: cx(setas),
    statusCaixa: cx(status),
    /* Positivo = filtros abaixo da trilha, que é o pedido. */
    filtrosAbaixo: filtros ? r(filtros.getBoundingClientRect().top - bt.bottom) : null,
    /* ITEM 4 — o vão que a captura chama de «muito afastado». Medido até o topo do
       CARD, não da trilha: a trilha tem padding próprio e é justamente ele que
       parte do vão. */
    carimboCaixa: cx(carimbo),
    vaoCarimboCard: bc ? r(primeiro.top - bc.bottom) : null,
    /* ── A DECOMPOSIÇÃO DO VÃO ────────────────────────────────────────────────
       «Aproximar o carimbo» só é acionável se se souber QUEM come os pixels. São
       quatro fronteiras em série, e duas delas não são negociáveis:
         carimbo.base → .partner-terminal.top   (margem entre os dois blocos)
         .partner-terminal.top → .stage.top     (padding-block-start da raiz)
         .stage.top → .track.top                (padding-top do palco + controles)
         .track.top → card.top                  (padding-top da trilha)
       No modo pin o `padding-top` do palco é `header + 1rem`: ele existe para o
       card não ficar sob o cabeçalho fixo QUANDO GRUDADO, então cortá-lo troca um
       defeito por outro. O que é de graça é o bloco de controles — e é justamente
       ele que o item 3 manda mudar de lugar. */
    pilha: (() => {
      const palco = document.querySelector('.partner-terminal__stage');
      if (!raiz || !palco || !bc) return null;
      const braiz = raiz.getBoundingClientRect();
      const bpalco = palco.getBoundingClientRect();
      return {
        carimboAoBloco: r(braiz.top - bc.bottom),
        blocoAoPalco: r(bpalco.top - braiz.top),
        palcoATrilha: r(bt.top - bpalco.top),
        trilhaAoCard: r(primeiro.top - bt.top),
        /* Quanto o bloco de controles ocupa acima da trilha: é o resgatável. */
        controles: (() => {
          const c = document.querySelector('.partner-terminal__controls');
          if (!c) return 0;
          const b = c.getBoundingClientRect();
          return b.top < bt.top ? r(b.height) : 0;
        })(),
      };
    })(),
    transbordoDoc: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    transbordoSecao: (() => {
      const s = document.querySelector('#parceiros');
      if (!s) return null;
      const b = s.getBoundingClientRect();
      return r(Math.max(0, b.right - document.documentElement.clientWidth) + Math.max(0, -b.left));
    })(),
  };
};

const nav = await chromium.launch({ executablePath: EXE });
const saida = {
  issue: 'SIS-201',
  nota: 'gerado por scripts/medir-cards-parceiros-sis201.mjs',
  rota: ROTA,
  quando: new Date().toISOString(),
  override: OVR,
  janelas: [],
};

for (const { w, h } of JANELAS) {
  const ctx = await nav.newContext({
    viewport: { width: w, height: h },
    deviceScaleFactor: 1,
    /* Na CONTEXT, porque é o que `matchMedia` lê — passar na página não muda o
       `useReducedMotion()` do componente. `full` para o pin existir: o modo
       reduzido cai no fallback nativo e não exercita a geometria que a issue cita. */
    reducedMotion: 'no-preference',
  });
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
  await pag.waitForSelector('.partner-terminal__card', { timeout: 30000 });
  /* A seção tem de estar na viewport: o carimbo bate por `gatilho="viewport"` e o
     pin só publica `--partner-travel` depois de medir. */
  await pag.evaluate(() =>
    document.querySelector('#parceiros')?.scrollIntoView({ block: 'start', behavior: 'instant' }),
  );
  await pag.waitForTimeout(1200);

  /* ── OS FILTROS, UM A UM ─────────────────────────────────────────────────
     É aqui que o item 1 se decide. Dentro de um filtro a trilha flex já iguala
     tudo; o que reprova é a altura MUDAR de um filtro para o outro. */
  const rotulos = await pag.$$eval('.partner-terminal__filter', (bs) =>
    bs.map((b) => b.textContent.trim()),
  );
  const estados = [];
  for (const rotulo of rotulos) {
    await pag.click(`.partner-terminal__filter:text-is("${rotulo}")`);
    await pag.waitForTimeout(700);
    const m = await pag.evaluate(LER);
    estados.push({ filtro: rotulo, ...(m ?? { erro: 'sem cards' }) });
  }

  /* ── O HOVER, com ponteiro de verdade ────────────────────────────────────
     `:hover` é estado do navegador: `dispatchEvent('mouseover')` NÃO o acende, e
     com evento sintético o item 2 passaria sempre. */
  await pag.click(`.partner-terminal__filter:text-is("${rotulos[0]}")`);
  await pag.waitForTimeout(500);
  const alvo = await pag.$('.partner-terminal__card');
  const caixa = await alvo?.boundingBox();
  let hover = { erro: 'sem card para hover' };
  if (caixa) {
    await pag.mouse.move(caixa.x + caixa.width / 2, caixa.y + caixa.height / 2);
    await pag.waitForTimeout(700);
    hover = await pag.evaluate(() => {
      const card = document.querySelector('.partner-terminal__card');
      const eco = card?.querySelector('.partner-terminal__eco');
      return {
        temHover: card?.matches(':hover') ?? false,
        ecoExiste: Boolean(eco),
        /* O número do aceite «zero eco no hover»: opacidade computada COM o
           ponteiro em cima. `display` entra porque `opacity` de nó não exibido
           continua reportando o valor da regra. */
        ecoOpacidade: eco ? getComputedStyle(eco).opacity : null,
        ecoDisplay: eco ? getComputedStyle(eco).display : null,
        /* A placa idle TEM de continuar — o pedido é «a placa branca permanece». */
        placaExiste: Boolean(card?.querySelector('.partner-terminal__placa')),
        placaFundo: card
          ? getComputedStyle(card.querySelector('.partner-terminal__placa') ?? card)
              .backgroundColor
          : null,
      };
    });
    await pag.mouse.move(0, 0);
  }

  /* ── AS AGREGAÇÕES QUE SÃO O ACEITE ─────────────────────────────────────── */
  const bons = estados.filter((e) => !e.erro);
  const razao = (v) => {
    const n = v.filter((x) => typeof x === 'number' && x > 0);
    if (n.length < 2) return null;
    return Math.round((Math.max(...n) / Math.min(...n)) * 1000) / 1000;
  };
  /* Dentro de cada filtro: o que a trilha flex já resolve. */
  const dentroDeCadaFiltro = bons.map((e) => ({
    filtro: e.filtro,
    quantos: e.quantos,
    dispAlt: razao(e.cards.map((c) => c.alt)),
    dispLarg: razao(e.cards.map((c) => c.larg)),
    alt: e.cards[0]?.alt ?? null,
    estouroMax: Math.max(...e.cards.map((c) => c.estouro)),
    sangraTopoMax: Math.max(...e.cards.map((c) => c.sangraTopo ?? 0)),
    /* A menor folga entre o pé do conteúdo e o pé do card, entre os 16: é o
       colchão que sobra antes de a copy começar a ser cortada. */
    folgaMin: Math.min(...e.cards.map((c) => (c.conteudoAlt ? c.alt - c.conteudoAlt : Infinity))),
  }));
  /* ENTRE filtros: o defeito de verdade. 1,000 = a caixa não muda ao filtrar. */
  const alturas = dentroDeCadaFiltro.map((d) => d.alt);
  const entreFiltros = {
    dispAlt: razao(alturas),
    alturas,
    amplitudePx:
      alturas.filter((a) => typeof a === 'number').length > 1
        ? Math.round((Math.max(...alturas) - Math.min(...alturas)) * 10) / 10
        : null,
  };

  const base = bons[0] ?? {};
  saida.janelas.push({
    largura: w,
    altura: h,
    modo: base.modo ?? null,
    dentroDeCadaFiltro,
    entreFiltros,
    hover,
    ordem: {
      filtrosAbaixo: base.filtrosAbaixo,
      filtrosTopo: base.filtrosCaixa?.topo ?? null,
      trilhaBase: base.trilhaCaixa?.base ?? null,
      statusTopo: base.statusCaixa?.topo ?? null,
    },
    carimbo: { vao: base.vaoCarimboCard, caixa: base.carimboCaixa, pilha: base.pilha },
    eco: base.eco,
    transbordoDoc: base.transbordoDoc,
    transbordoSecao: base.transbordoSecao,
    estados,
    erros,
  });

  console.log(`\n=== ${w}x${h} — modo ${base.modo} ===`);
  for (const d of dentroDeCadaFiltro) {
    console.log(
      `  ${d.filtro.padEnd(16)} n=${String(d.quantos).padStart(2)} alt=${d.alt}` +
        ` dispAlt=${d.dispAlt} dispLarg=${d.dispLarg}` +
        ` estouro=${d.estouroMax} sangraTopo=${d.sangraTopoMax} folgaMin=${d.folgaMin}`,
    );
  }
  console.log(`  ENTRE FILTROS  dispAlt=${entreFiltros.dispAlt} amplitude=${entreFiltros.amplitudePx}px`);
  console.log(`  ECO            nos=${base.eco?.nos} imgs=${base.eco?.imgs} | hover ${JSON.stringify(hover)}`);
  console.log(`  ORDEM          filtrosAbaixo=${base.filtrosAbaixo}px (positivo = abaixo da trilha)`);
  console.log(`  CARIMBO        vao=${base.vaoCarimboCard}px  pilha=${JSON.stringify(base.pilha)}`);
  console.log(`  TRANSBORDO     doc=${base.transbordoDoc} secao=${base.transbordoSecao}`);
  if (erros.length) console.log(`  erros de console: ${erros.length} — ${erros[0]}`);
  await ctx.close();
}

await nav.close();
mkdirSync('docs/medidas', { recursive: true });
const nome = process.env.SAIDA ?? 'docs/medidas/cards-parceiros-sis201.json';
writeFileSync(nome, `${JSON.stringify(saida, null, 2)}\n`);
console.log(`\n→ ${nome}`);
