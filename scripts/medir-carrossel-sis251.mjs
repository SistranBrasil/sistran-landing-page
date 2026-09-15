/**
 * SIS-251 — sonda de aceite do carrossel intuitivo de `/eventos-inovacao`.
 *
 * O diagnóstico (`diagnostico-carrossel-sis251.mjs`) já respondeu POR QUE o
 * mecanismo da SIS-239 não se lia. Esta sonda mede se o que entrou resolve, e
 * mede cada linha do aceite da issue, uma por bloco:
 *
 *   1. em 390 há affordance em quadro: as duas setas, as marcas e a dica
 *   2. o SWIPE funciona e a dica desaparece depois dele
 *   3. o AUTOPLAY é perceptível: o relógio da marca ativa preenche ao longo do
 *      intervalo, e o passo continua avançando um cartão
 *   4. as setas navegam nos dois sentidos, inclusive dando a volta
 *   5. o laço congela sob interação (`data-andando="nao"`) e retoma depois
 *   6. movimento reduzido pelas DUAS vias: nada anima e nada fica inalcançável
 *   7. desktop >= 1024 intacto: a faixa não é montada, a cena é que aparece
 *
 * Uso: URL_BASE=http://localhost:3000 node scripts/medir-carrossel-sis251.mjs
 */
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const URL_BASE = process.env.URL_BASE ?? 'http://localhost:3000';
const CAPTURAS = 'docs/capturas';
const MEDIDAS = 'docs/medidas';
await mkdir(CAPTURAS, { recursive: true });
await mkdir(MEDIDAS, { recursive: true });

/* O intervalo é o do componente (`AUTOPLAY_MS`). A margem existe porque a
   rolagem suave do navegador termina depois do disparo do laço. */
const INTERVALO = 6000;
const MARGEM = 2500;
const RETOMADA = 9000;

const navegador = await chromium.launch();
const relatorio = {};

/**
 * Abre a rota já com a preferência de movimento semeada ANTES do primeiro
 * pintar: sem isto o diálogo de preferências cobre a seção e o `matchMedia`
 * embrulhado pelo `layout.tsx` responde pelo padrão, não pelo que a sonda quer.
 */
async function abrir({ largura, altura = 844, toque = true, motion = 'full', reduceSO = false }) {
  const contexto = await navegador.newContext({
    viewport: { width: largura, height: altura },
    deviceScaleFactor: 1,
    hasTouch: toque,
    reducedMotion: reduceSO ? 'reduce' : 'no-preference',
  });
  await contexto.addInitScript(
    ([m]) => {
      localStorage.setItem('sistran-motion-preference-seen', '1');
      localStorage.setItem('sistran-motion-preference', m);
    },
    [motion],
  );
  const pagina = await contexto.newPage();
  await pagina.goto(`${URL_BASE}/eventos-inovacao`, {
    waitUntil: 'domcontentloaded',
    timeout: 180_000,
  });
  await pagina.addStyleTag({
    content: `nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button]{display:none!important}`,
  });
  await pagina.waitForTimeout(2000);
  return { contexto, pagina };
}

/* O autoplay só corre com a seção EM QUADRO (é o `emQuadro` do componente).
   Alinhar o topo da barra de controles é também o enquadramento em que se julga
   a affordance: é o que a pessoa vê ao chegar rolando. */
async function trazerParaQuadro(pagina, seletor = '.eventos-lista-itens') {
  await pagina.waitForSelector(seletor, { timeout: 180_000 });
  await pagina.evaluate((s) => {
    const el = document.querySelector(s);
    window.scrollTo({
      top: window.scrollY + el.getBoundingClientRect().top - 8,
      behavior: 'instant',
    });
  }, seletor);
  await pagina.waitForTimeout(1200);
}

const emQuadro = (r) => !!r && r.top < r.janela && r.bottom > 0;

/** Leitura do estado visível da barra de controles, num instante. */
function leitura() {
  const faixa = document.querySelector('.eventos-lista-itens');
  const barra = document.querySelector('.eventos-lista-controles');
  const bussola = document.querySelector('.eventos-lista-bussola');
  const dica = document.querySelector('.eventos-lista-dica');
  const setas = [...document.querySelectorAll('.eventos-lista-seta')];
  const ativa = document.querySelector('.eventos-lista-bussola-marca[data-estado="ativo"]');
  const caixa = (el) => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return {
      top: Math.round(r.top),
      bottom: Math.round(r.bottom),
      largura: Math.round(r.width),
      altura: Math.round(r.height),
      janela: innerHeight,
    };
  };
  return {
    faixaExiste: !!faixa,
    scrollLeft: faixa ? Math.round(faixa.scrollLeft) : null,
    /* Nome acessível de cada seta: é o que um leitor de tela anuncia. */
    setas: setas.map((b) => ({
      lado: b.dataset.lado,
      rotulo: b.textContent.trim(),
      caixa: caixa(b),
    })),
    marcas: bussola ? bussola.children.length : 0,
    andando: bussola?.dataset.andando ?? null,
    barra: caixa(barra),
    dicaTexto: dica?.textContent.trim() ?? null,
    dicaCaixa: caixa(dica),
    /* O relógio: largura do preenchimento e a animação que o move. */
    relogio: ativa
      ? {
          pista: Math.round(ativa.getBoundingClientRect().width),
          preenchido: Math.round(
            parseFloat(getComputedStyle(ativa, '::after').width) || 0,
          ),
          animacao: getComputedStyle(ativa, '::after').animationName,
          duracao: getComputedStyle(ativa, '::after').animationDuration,
          estado: getComputedStyle(ativa, '::after').animationPlayState,
        }
      : null,
    dicaAnimacao: dica ? getComputedStyle(dica).animationName : null,
  };
}

/* ── 390 · affordance, swipe, relógio, setas, pausa ───────────────────────── */
{
  const { contexto, pagina } = await abrir({ largura: 390 });
  await trazerParaQuadro(pagina);

  const inicial = await pagina.evaluate(leitura);
  relatorio['390-affordance'] = {
    setasEmQuadro: inicial.setas.map((s) => ({
      lado: s.lado,
      rotulo: s.rotulo,
      alvoDeToquePx: `${s.caixa.largura}x${s.caixa.altura}`,
      emQuadro: emQuadro(s.caixa),
    })),
    marcas: inicial.marcas,
    barraEmQuadro: emQuadro(inicial.barra),
    dica: inicial.dicaTexto,
    dicaEmQuadro: emQuadro(inicial.dicaCaixa),
  };

  /* O relógio ao longo de um intervalo: três leituras, e o que interessa é a
     largura do preenchimento CRESCENDO. É a prova de que o passo é anunciado
     antes de acontecer, que é a resposta ao "autoplay perceptível". */
  const relogio = [];
  for (const espera of [0, 2000, 2000]) {
    if (espera) await pagina.waitForTimeout(espera);
    const r = await pagina.evaluate(leitura);
    relogio.push({ pista: r.relogio?.pista, preenchido: r.relogio?.preenchido });
  }
  relatorio['390-relogio'] = {
    animacao: inicial.relogio?.animacao,
    duracao: inicial.relogio?.duracao,
    andando: inicial.andando,
    preenchimentoAoLongoDoIntervalo: relogio,
  };

  /* Passo do laço: continua avançando um cartão inteiro. */
  const antesDoPasso = (await pagina.evaluate(leitura)).scrollLeft;
  await pagina.waitForTimeout(INTERVALO + MARGEM);
  const depoisDoPasso = (await pagina.evaluate(leitura)).scrollLeft;
  relatorio['390-passo-autoplay'] = { antesDoPasso, depoisDoPasso };

  /* SWIPE de verdade, e ele precisa ser um GESTO DE TOQUE do navegador, não uma
     arrastada de mouse: a faixa rola por `overflow-x: auto`, e arrastar com o
     botão do mouse dentro de um contêiner rolável não rola nada (não é o que o
     navegador faz com um mouse). A primeira versão desta sonda mediu
     `andou: false` por isso — e o defeito era da sonda, não da faixa.
     `Input.dispatchTouchEvent` do CDP — touchStart/touchMove/touchEnd —, que é o
     que rola de verdade. `Input.synthesizeScrollGesture` com
     `gestureSourceType: 'touch'` foi tentado antes e NÃO moveu a faixa (mediu
     0px de deslocamento em três rodadas); fica registrado para ninguém repetir a
     tentativa. */
  /* Volta ao primeiro cartão: é de lá que o swipe tem de ser medido, porque é o
     único ponto em que a dica está na tela e portanto o único em que "a dica
     sumiu depois do gesto" quer dizer algo.
     A CAIXA É MEDIDA DEPOIS DO RELOAD, e a espera é longa. Medi-la antes deu
     zero deslocamento numa rodada: o toque caía numa coordenada da página
     anterior. */
  await pagina.reload({ waitUntil: 'domcontentloaded' });
  await trazerParaQuadro(pagina);
  await pagina.waitForTimeout(2500);
  const caixaFaixa = await pagina.locator('.eventos-lista-itens').boundingBox();
  const y = Math.round(caixaFaixa.y + 200);
  const antesDoSwipe = (await pagina.evaluate(leitura)).scrollLeft;
  const dicaAntesDoSwipe = (await pagina.evaluate(leitura)).dicaTexto;
  const cdp = await pagina.context().newCDPSession(pagina);
  await cdp.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [{ x: 330, y }],
  });
  for (const x of [300, 260, 210, 160, 110, 70]) {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y }] });
    await pagina.waitForTimeout(30);
  }
  /* Leitura COM O DEDO AINDA APOIADO e leitura depois do repouso: a primeira
     mostra o arrasto acompanhando o dedo, a segunda o scroll-snap fechando no
     cartão. Sem as duas não se distingue "não rolou" de "rolou e voltou". */
  const durante = (await pagina.evaluate(leitura)).scrollLeft;
  const andandoComDedoApoiado = (await pagina.evaluate(leitura)).andando;
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await pagina.waitForTimeout(1600);
  const aposSwipe = await pagina.evaluate(leitura);
  relatorio['390-swipe'] = {
    antesDoSwipe,
    durante,
    depois: aposSwipe.scrollLeft,
    andou: aposSwipe.scrollLeft !== antesDoSwipe,
    /* O laço tem de estar SEGURO com o dedo apoiado e logo depois do gesto. */
    andandoComDedoApoiado,
    andando: aposSwipe.andando,
    dicaAntesDoSwipe,
    dicaSumiu: aposSwipe.dicaTexto === null,
    relogioEstado: aposSwipe.relogio?.estado,
  };

  /* Retomada: passado `RETOMADA_MS`, o laço volta a andar sozinho.
     O PONTEIRO SAI DA FAIXA ANTES DE MEDIR. `sobre` (hover) é um dos oito
     disjuntos de `autoplayPausado`, então deixar o cursor onde o gesto terminou
     media a pausa por hover e não a retomada — foi o que a primeira rodada
     desta sonda registrou como falsa falha. */
  await pagina.mouse.move(5, 5);
  await pagina.waitForTimeout(RETOMADA);
  const aposRetomada = await pagina.evaluate(leitura);
  relatorio['390-retomada'] = { andando: aposRetomada.andando };

  /* As setas, nos dois sentidos, e a volta ao laço na ponta. */
  await pagina.evaluate(() => {
    document.querySelector('.eventos-lista-itens').scrollTo({ left: 0, behavior: 'instant' });
  });
  await pagina.waitForTimeout(800);
  await pagina.locator('.eventos-lista-seta[data-lado="depois"]').click();
  await pagina.waitForTimeout(1500);
  const aposProximo = (await pagina.evaluate(leitura)).scrollLeft;
  await pagina.locator('.eventos-lista-seta[data-lado="antes"]').click();
  await pagina.waitForTimeout(1500);
  const aposAnterior = (await pagina.evaluate(leitura)).scrollLeft;
  /* No primeiro cartão, «anterior» dá a volta para o décimo quinto — é por isso
     que nenhuma das setas nasce desabilitada. */
  await pagina.locator('.eventos-lista-seta[data-lado="antes"]').click();
  await pagina.waitForTimeout(1800);
  const aposVolta = (await pagina.evaluate(leitura)).scrollLeft;
  relatorio['390-setas'] = { aposProximo, aposAnterior, aposVoltaDoLaco: aposVolta };

  /* A foto do «depois» sai com a faixa no primeiro cartão e a dica presente:
     é o instante que o aceite descreve ("uma pessoa nova entende que desliza"). */
  await pagina.reload({ waitUntil: 'domcontentloaded' });
  await pagina.addStyleTag({
    content: `nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button]{display:none!important}`,
  });
  await trazerParaQuadro(pagina);
  await pagina.waitForTimeout(1500);
  await pagina.screenshot({ path: `${CAPTURAS}/sis251-depois-390-topo.png` });
  /* E uma segunda, enquadrando a BARRA: em 390 o cartão é mais alto que a
     janela, e é a barra que carrega a affordance nova. */
  await trazerParaQuadro(pagina, '.eventos-lista-controles');
  await pagina.waitForTimeout(600);
  await pagina.evaluate(() => window.scrollBy(0, -260));
  await pagina.waitForTimeout(600);
  await pagina.screenshot({ path: `${CAPTURAS}/sis251-depois-390-controles.png` });

  await contexto.close();
}

/* ── 390 · movimento reduzido pelas duas vias ─────────────────────────────── */
/* A via do SISTEMA é semeada com a preferência `'system'`, não com `'full'`.
   Parece detalhe e não é: `resolveReducedMotion` (em `src/lib/motionPreference.ts`)
   dá precedência à escolha EXPLÍCITA, então `'full'` + SO em reduce é um estado
   contraditório em que o JS mantém o laço andando e o CSS `@media` desliga o
   relógio. A primeira rodada desta sonda semeou justamente isso e mediu
   `autoplayParado: false` na via do sistema — leitura correta de um cenário que
   não é o que a issue pede para verificar. `'system'` é o default do site e é a
   via que o item "reduce OK" do aceite nomeia. */
for (const via of ['sistema', 'interruptor']) {
  const { contexto, pagina } = await abrir({
    largura: 390,
    reduceSO: via === 'sistema',
    motion: via === 'interruptor' ? 'reduce' : 'system',
  });
  await trazerParaQuadro(pagina);
  const antes = await pagina.evaluate(leitura);
  await pagina.waitForTimeout(INTERVALO + MARGEM);
  const depois = await pagina.evaluate(leitura);

  /* As setas continuam alcançando os quinze — é o que a régua de
     `reduced-motion-conteudo` exige quando o movimento automático morre. */
  await pagina.locator('.eventos-lista-seta[data-lado="depois"]').click();
  await pagina.waitForTimeout(1000);
  const aposSeta = await pagina.evaluate(leitura);

  relatorio[`390-reduce-${via}`] = {
    relogioAnimacao: antes.relogio?.animacao,
    relogioPreenchido: antes.relogio?.preenchido,
    relogioPista: antes.relogio?.pista,
    dicaAnimacao: antes.dicaAnimacao,
    autoplayParado: antes.scrollLeft === depois.scrollLeft,
    setaNavega: aposSeta.scrollLeft !== depois.scrollLeft,
    marcaAtivaVisivel: !!antes.relogio,
  };
  if (via === 'sistema') {
    await pagina.screenshot({ path: `${CAPTURAS}/sis251-depois-390-reduce.png` });
  }
  await contexto.close();
}

/* ── desktop intacto ──────────────────────────────────────────────────────── */
for (const largura of [1024, 1440]) {
  const { contexto, pagina } = await abrir({ largura, altura: 900, toque: false });
  await pagina.waitForSelector('.eventos-destaque', { timeout: 180_000 });
  relatorio[`desktop-${largura}`] = await pagina.evaluate(() => {
    const faixa = document.querySelector('.eventos-lista-itens');
    const cena = document.querySelector('.eventos-destaque');
    const barra = document.querySelector('.eventos-lista-controles');
    return {
      cenaVisivel: !!cena && getComputedStyle(cena).display !== 'none',
      /* A faixa e a barra nova ficam FORA de cena por CSS (`display: none` em
         `.eventos-lista` a partir de 1024). Se qualquer uma medisse altura aqui,
         a issue teria vazado para o desktop. */
      faixaAltura: faixa ? Math.round(faixa.getBoundingClientRect().height) : 0,
      barraAltura: barra ? Math.round(barra.getBoundingClientRect().height) : 0,
    };
  });
  if (largura === 1440) {
    await pagina.evaluate(() => {
      const c = document.querySelector('.eventos-destaque');
      window.scrollTo({ top: window.scrollY + c.getBoundingClientRect().top + 200, behavior: 'instant' });
    });
    await pagina.waitForTimeout(2000);
    await pagina.screenshot({ path: `${CAPTURAS}/sis251-depois-1440-cena.png` });
  }
  await contexto.close();
}

await navegador.close();
const saida = `${MEDIDAS}/carrossel-sis251.json`;
await writeFile(saida, JSON.stringify(relatorio, null, 2));
console.log(JSON.stringify(relatorio, null, 2));
console.log(`\nmedidas em ${saida}`);
