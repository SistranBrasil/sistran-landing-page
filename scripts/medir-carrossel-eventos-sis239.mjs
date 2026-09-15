/**
 * SIS-239 — a sonda da lista estreita de `/eventos-inovacao` (`.eventos-lista`).
 *
 * A issue troca a pilha vertical dos quinze eventos por um CARROSSEL horizontal
 * com laço automático abaixo de 1024px. Cinco coisas dessa troca não se conferem
 * por leitura de código nem por uma foto, e são exatamente as que esta sonda mede:
 *
 *   1. GEOMETRIA em 390 e 768 — largura do cartão, quanto do próximo aparece
 *      (a "espiada") e se a faixa é mesmo um contêiner de rolagem horizontal.
 *   2. LAÇO AUTOMÁTICO — `scrollLeft` andando sozinho, sem gesto nenhum, e
 *      VOLTANDO ao início depois do décimo quinto (é o "loop nos 15 para o lado").
 *   3. AS DUAS VIAS DE MOVIMENTO REDUZIDO — `prefers-reduced-motion` do sistema
 *      (emulado pelo Playwright) e o interruptor da página (`localStorage` ->
 *      `html[data-motion="reduce"]`). As duas têm de PARAR o autoplay, e a
 *      segunda é a que passa despercebida: o CSS tem espelho, o JS lê `matchMedia`
 *      embrulhado pelo `layout.tsx`. Medir as duas é o que separa "espelhado" de
 *      "parece espelhado".
 *   4. AS PAUSAS POR INTERAÇÃO — ponteiro/toque apoiado, foco dentro da faixa e
 *      rolagem manual. Cada uma medida sozinha, porque cada uma é um estado
 *      diferente no componente e um pode existir sem o outro.
 *   5. O CONTEÚDO INTEIRO e o DESKTOP INTACTO — quinze cartões com chip, título,
 *      descrição e arte, DOIS botões de YouTube, e `.eventos-lista` fora de cena
 *      a partir de 1024px, com o palco no lugar.
 *
 * Uso (o dev server precisa estar de pé):
 *   node scripts/medir-carrossel-eventos-sis239.mjs --rotulo antes
 *   node scripts/medir-carrossel-eventos-sis239.mjs --rotulo depois
 *
 * O rótulo só nomeia as capturas: as asserções são as mesmas nas duas corridas,
 * e é por isso que a corrida "antes" REPROVA de propósito — ela é a prova de que
 * a sonda enxerga a diferença, em vez de aprovar os dois estados do código.
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const URL_BASE = process.env.URL_BASE ?? 'http://localhost:3000';
const ROTA = '/eventos-inovacao';
const DESTINO = 'docs/medidas/carrossel-eventos-sis239';
const posRotulo = process.argv.indexOf('--rotulo');
const rotulo = posRotulo > -1 ? (process.argv[posRotulo + 1] ?? 'agora') : 'agora';

/* Folga sobre o intervalo do autoplay (6.000ms no componente): o tempo de espera
   de cada medida de avanço é `INTERVALO + MARGEM`, para o passo caber junto com a
   rolagem suave que ele dispara. */
const INTERVALO = 6000;
const MARGEM = 2500;
/* Espera para a pausa por gesto se soltar (`RETOMADA_MS` é 7.000ms lá). */
const RETOMADA = 9000;

await mkdir(DESTINO, { recursive: true });

const navegador = await chromium.launch();
const falhas = [];
const anote = (ok, texto) => {
  if (!ok) falhas.push(texto);
  console.log(`  ${ok ? 'ok' : 'XX'} ${texto}`);
};

/**
 * Abre a rota com o banner de movimento já visto (senão ele tranca a rolagem e
 * toda medida sai do topo da página) e com a preferência de movimento gravada
 * ANTES do primeiro paint — que é o único instante em que o script inline do
 * `layout.tsx` a lê para escrever `html[data-motion]`.
 */
async function abrir({ largura, altura, preferencia, sistemaReduz }) {
  const contexto = await navegador.newContext({
    viewport: { width: largura, height: altura },
    deviceScaleFactor: 1,
    reducedMotion: sistemaReduz ? 'reduce' : 'no-preference',
    hasTouch: largura < 1024,
  });
  await contexto.addInitScript(
    ([pref]) => {
      localStorage.setItem('sistran-motion-preference-seen', '1');
      localStorage.setItem('sistran-motion-preference', pref);
    },
    [preferencia],
  );
  const pagina = await contexto.newPage();
  await pagina.goto(`${URL_BASE}${ROTA}`, {
    waitUntil: 'domcontentloaded',
    timeout: 180_000,
  });
  await pagina.waitForSelector('.eventos-lista-itens', { timeout: 180_000 });
  await pagina.waitForTimeout(1200);
  return { contexto, pagina };
}

/** Leva a faixa para dentro da janela: autoplay só corre com a seção em quadro. */
async function trazerParaQuadro(pagina) {
  await pagina.evaluate(() => {
    const faixa = document.querySelector('.eventos-lista-itens');
    const caixa = faixa.getBoundingClientRect();
    window.scrollTo({
      top: window.scrollY + caixa.top - innerHeight * 0.15,
      behavior: 'instant',
    });
  });
  await pagina.waitForTimeout(900);
}

/* `scrollLeft` é o estado observável do carrossel: quem manda nele é o
   componente (autoplay) ou o dedo (gesto). Tudo aqui se apoia nele. */
const leitura = () => {
  const faixa = document.querySelector('.eventos-lista-itens');
  return {
    esquerda: Math.round(faixa.scrollLeft),
    largura: Math.round(faixa.clientWidth),
    percurso: Math.round(faixa.scrollWidth),
  };
};

async function geometria(pagina) {
  return pagina.evaluate(() => {
    const faixa = document.querySelector('.eventos-lista-itens');
    const estilo = getComputedStyle(faixa);
    const itens = [...faixa.querySelectorAll('.eventos-lista-item')];
    const caixas = itens.map((i) => i.getBoundingClientRect());
    const faixaCaixa = faixa.getBoundingClientRect();
    return {
      overflowX: estilo.overflowX,
      direcao: estilo.flexDirection,
      snap: estilo.scrollSnapType,
      itens: itens.length,
      percurso: Math.round(faixa.scrollWidth),
      visivel: Math.round(faixa.clientWidth),
      cartao: Math.round(caixas[0].width),
      /* A ESPIADA: quanto do segundo cartão sobra dentro da janela da faixa. */
      espiada: Math.round(Math.max(0, faixaCaixa.right - caixas[1].left)),
      alturaFaixa: Math.round(faixaCaixa.height),
      /* Conteúdo, item por item: o critério é "nada foi cortado para caber". */
      comChip: itens.filter((i) => i.querySelector('.eventos-destaque-chip')).length,
      comTitulo: itens.filter((i) => i.querySelector('h3')?.textContent?.trim()).length,
      comTexto: itens.filter(
        (i) =>
          (i.querySelector('.eventos-destaque-cartao-texto')?.textContent ?? '').length > 100,
      ).length,
      comArte: itens.filter((i) => i.querySelector('.eventos-destaque-arte img')).length,
      botoes: itens.filter((i) => i.querySelector('a.eventos-destaque-botao')).length,
      /* Descrição cortada por `line-clamp`/`overflow`: zero é o critério. */
      textosCortados: itens.filter((i) => {
        const p = i.querySelector('.eventos-destaque-cartao-texto');
        return p ? p.scrollHeight - p.clientHeight > 1 : false;
      }).length,
      motionAtributo: document.documentElement.getAttribute('data-motion'),
    };
  });
}

/** Mede se o carrossel anda SOZINHO no tempo de um passo. */
async function avancaSozinho(pagina, espera = INTERVALO + MARGEM) {
  const antes = await pagina.evaluate(leitura);
  await pagina.waitForTimeout(espera);
  const depois = await pagina.evaluate(leitura);
  return {
    antes: antes.esquerda,
    depois: depois.esquerda,
    andou: depois.esquerda !== antes.esquerda,
  };
}

console.log(`\n### SIS-239 · carrossel da lista estreita · rótulo "${rotulo}"`);

/* ── 390: geometria, conteúdo e laço automático ──────────────────────────── */
{
  console.log('\n=== 390x844 · movimento completo');
  const { contexto, pagina } = await abrir({
    largura: 390,
    altura: 844,
    preferencia: 'full',
    sistemaReduz: false,
  });
  await trazerParaQuadro(pagina);

  const g = await geometria(pagina);
  console.log(
    `  faixa: overflow-x ${g.overflowX} · flex ${g.direcao} · snap ${g.snap} · percurso ${g.percurso}px em janela de ${g.visivel}px`,
  );
  console.log(
    `  cartão ${g.cartao}px · espiada do próximo ${g.espiada}px · altura da faixa ${g.alturaFaixa}px`,
  );
  anote(g.itens === 15, `quinze cartões na faixa (${g.itens})`);
  anote(
    g.overflowX === 'auto' || g.overflowX === 'scroll',
    `faixa rola na horizontal (overflow-x: ${g.overflowX})`,
  );
  anote(g.direcao === 'row', `faixa em linha, não em coluna (flex-direction: ${g.direcao})`);
  anote(g.percurso > g.visivel + 200, `percurso horizontal existe (${g.percurso}px > ${g.visivel}px)`);
  anote(
    g.cartao >= g.visivel * 0.7 && g.cartao <= g.visivel,
    `um cartão por vez: ${g.cartao}px contra janela de ${g.visivel}px`,
  );
  anote(g.espiada > 8, `espiada do próximo cartão visível (${g.espiada}px)`);
  anote(g.comChip === 15, `chip nos quinze (${g.comChip})`);
  anote(g.comTitulo === 15, `título nos quinze (${g.comTitulo})`);
  anote(g.comTexto === 15, `descrição longa nos quinze (${g.comTexto})`);
  anote(g.comArte === 15, `arte nos quinze (${g.comArte})`);
  anote(g.botoes === 2, `botão do YouTube só nos dois com gravação (${g.botoes})`);
  anote(g.textosCortados === 0, `nenhuma descrição cortada (${g.textosCortados})`);

  const passo = await avancaSozinho(pagina);
  anote(passo.andou, `autoplay anda sozinho (${passo.antes}px -> ${passo.depois}px)`);

  /* A VOLTA do laço: leva a faixa ao último cartão à mão, espera a pausa do
     gesto se soltar, e então o próximo passo tem de voltar para perto de zero. */
  await pagina.evaluate(() => {
    const faixa = document.querySelector('.eventos-lista-itens');
    faixa.scrollTo({ left: faixa.scrollWidth, behavior: 'instant' });
  });
  await pagina.waitForTimeout(RETOMADA);
  const volta = await avancaSozinho(pagina);
  anote(
    volta.depois < volta.antes / 2,
    `laço volta ao início depois do último (${volta.antes}px -> ${volta.depois}px)`,
  );

  /* ── Pausa por ponteiro/toque apoiado ──────────────────────────────────── */
  await pagina.evaluate(() => {
    document.querySelector('.eventos-lista-itens').scrollTo({ left: 0, behavior: 'instant' });
  });
  await pagina.waitForTimeout(RETOMADA);
  const caixa = await pagina.locator('.eventos-lista-itens').boundingBox();
  await pagina.mouse.move(caixa.x + caixa.width / 2, caixa.y + 60);
  await pagina.mouse.down();
  const comDedo = await avancaSozinho(pagina);
  anote(!comDedo.andou, `pausa com o ponteiro apoiado (${comDedo.antes}px -> ${comDedo.depois}px)`);
  await pagina.mouse.up();

  /* ── Pausa por foco dentro da faixa ────────────────────────────────────── */
  await pagina.mouse.move(5, 5);
  await pagina.waitForTimeout(RETOMADA);
  await pagina.evaluate(() => document.querySelector('.eventos-lista-itens').focus());
  const comFoco = await avancaSozinho(pagina);
  anote(!comFoco.andou, `pausa com foco na faixa (${comFoco.antes}px -> ${comFoco.depois}px)`);
  await pagina.evaluate(() => document.activeElement?.blur());

  /* ── Rolagem manual funciona, e segura o autoplay por um tempo ──────────── */
  await pagina.waitForTimeout(RETOMADA);
  /* O cartão de destino é escolhido a partir de ONDE A FAIXA ESTÁ: o autoplay
     andou durante as medidas acima, e mirar um índice fixo pode cair no cartão em
     que ela já está — o gesto viraria um no-op e a asserção reprovaria sem
     defeito nenhum. */
  const manual = await pagina.evaluate(() => {
    const faixa = document.querySelector('.eventos-lista-itens');
    const cartoes = [...faixa.querySelectorAll('.eventos-lista-item')];
    const base = cartoes[0];
    const posicoes = cartoes.map((c) => c.offsetLeft - base.offsetLeft);
    const antes = Math.round(faixa.scrollLeft);
    const atual = posicoes.reduce(
      (melhor, p, i) =>
        Math.abs(p - antes) < Math.abs(posicoes[melhor] - antes) ? i : melhor,
      0,
    );
    const destino = (atual + 4) % cartoes.length;
    faixa.scrollTo({ left: posicoes[destino], behavior: 'instant' });
    return { antes, depois: Math.round(faixa.scrollLeft), atual, destino };
  });
  anote(
    manual.depois !== manual.antes,
    `rolagem manual move a faixa: cartão ${manual.atual + 1} -> ${manual.destino + 1} (${manual.antes}px -> ${manual.depois}px)`,
  );
  /* O par que fecha a pausa por gesto: 6,5s é MAIS que o intervalo do autoplay
     (6s), então não andar aí prova que o gesto o segurou de verdade e não que a
     medida chegou cedo; e ele tem de VOLTAR sozinho depois, senão um swipe
     mataria o laço para sempre. */
  const seguro = await avancaSozinho(pagina, 6500);
  anote(!seguro.andou, `autoplay espera depois do gesto (${seguro.antes}px -> ${seguro.depois}px)`);
  const retomou = await avancaSozinho(pagina, INTERVALO + MARGEM);
  anote(retomou.andou, `autoplay retoma depois da espera (${retomou.antes}px -> ${retomou.depois}px)`);

  await pagina.locator('.eventos-lista').screenshot({
    path: `${DESTINO}/${rotulo}-390-lista.png`,
  });
  await pagina.screenshot({ path: `${DESTINO}/${rotulo}-390-quadro.png` });
  await contexto.close();
}

/* ── 390 · as duas vias de movimento reduzido ────────────────────────────── */
for (const via of [
  { nome: 'sistema (prefers-reduced-motion)', preferencia: 'system', sistemaReduz: true },
  { nome: 'interruptor da página (data-motion)', preferencia: 'reduce', sistemaReduz: false },
]) {
  console.log(`\n=== 390x844 · movimento reduzido pelo ${via.nome}`);
  const { contexto, pagina } = await abrir({
    largura: 390,
    altura: 844,
    preferencia: via.preferencia,
    sistemaReduz: via.sistemaReduz,
  });
  await trazerParaQuadro(pagina);
  const g = await geometria(pagina);
  anote(g.motionAtributo === 'reduce', `html[data-motion="reduce"] escrito (${g.motionAtributo})`);
  anote(g.itens === 15, `os quinze continuam na faixa (${g.itens})`);
  anote(
    g.percurso > g.visivel + 200,
    `faixa segue rolável à mão, o conteúdo não fica fora de alcance (${g.percurso}px)`,
  );
  const parado = await avancaSozinho(pagina);
  anote(!parado.andou, `autoplay parado (${parado.antes}px -> ${parado.depois}px)`);
  await pagina.locator('.eventos-lista').screenshot({
    path: `${DESTINO}/${rotulo}-390-reduce-${via.preferencia}.png`,
  });
  await contexto.close();
}

/* ── 768: a mesma faixa, janela do meio ──────────────────────────────────── */
{
  console.log('\n=== 768x1024 · movimento completo');
  const { contexto, pagina } = await abrir({
    largura: 768,
    altura: 1024,
    preferencia: 'full',
    sistemaReduz: false,
  });
  await trazerParaQuadro(pagina);
  const g = await geometria(pagina);
  console.log(
    `  cartão ${g.cartao}px · espiada ${g.espiada}px · percurso ${g.percurso}px em janela de ${g.visivel}px`,
  );
  anote(g.itens === 15, `quinze cartões na faixa (${g.itens})`);
  anote(g.direcao === 'row', `faixa em linha (flex-direction: ${g.direcao})`);
  anote(g.botoes === 2, `dois botões do YouTube (${g.botoes})`);
  const passo = await avancaSozinho(pagina);
  anote(passo.andou, `autoplay anda sozinho (${passo.antes}px -> ${passo.depois}px)`);
  await pagina.locator('.eventos-lista').screenshot({
    path: `${DESTINO}/${rotulo}-768-lista.png`,
  });
  await contexto.close();
}

/* ── 1024 e 1440: o desktop não pode ter mudado ──────────────────────────── */
for (const [largura, altura] of [
  [1024, 800],
  [1440, 900],
]) {
  console.log(`\n=== ${largura}x${altura} · desktop`);
  const contexto = await navegador.newContext({
    viewport: { width: largura, height: altura },
    deviceScaleFactor: 1,
    reducedMotion: 'no-preference',
  });
  await contexto.addInitScript(() => {
    localStorage.setItem('sistran-motion-preference-seen', '1');
    localStorage.setItem('sistran-motion-preference', 'full');
  });
  const pagina = await contexto.newPage();
  await pagina.goto(`${URL_BASE}${ROTA}`, {
    waitUntil: 'domcontentloaded',
    timeout: 180_000,
  });
  await pagina.waitForSelector('.eventos-destaque-cartao', { timeout: 180_000 });
  await pagina.waitForTimeout(1200);
  const d = await pagina.evaluate(() => {
    const lista = document.querySelector('.eventos-lista');
    const palco = document.querySelector('.eventos-destaque');
    return {
      listaDisplay: getComputedStyle(lista).display,
      palcoDisplay: getComputedStyle(palco).display,
      vagas: palco.querySelectorAll('.eventos-vaga').length,
      colunas: palco.querySelectorAll('.eventos-destaque-coluna').length,
      contador: palco.querySelector('.eventos-destaque-contador-numero')?.textContent?.trim(),
      /* Rolagem horizontal no DOCUMENTO é o efeito colateral clássico de uma
         faixa que sangra: mede-se aqui porque é onde ele apareceria. */
      rolagemLateral: document.documentElement.scrollWidth > window.innerWidth + 1,
    };
  });
  console.log(`  palco ${d.palcoDisplay} · lista ${d.listaDisplay} · contador "${d.contador}"`);
  anote(d.listaDisplay === 'none', `lista estreita fora de cena (${d.listaDisplay})`);
  anote(d.palcoDisplay === 'block', `palco no lugar (${d.palcoDisplay})`);
  anote(d.vagas === 15, `quinze vagas nas colunas (${d.vagas})`);
  anote(d.colunas === 2, `duas colunas (${d.colunas})`);
  anote(!d.rolagemLateral, `sem rolagem lateral no documento (${d.rolagemLateral})`);
  await contexto.close();
}

await navegador.close();
console.log(
  falhas.length === 0
    ? '\nTODAS AS ASSERÇÕES OK'
    : `\n${falhas.length} ASSERÇÃO(ÕES) EM FALHA:\n  - ${falhas.join('\n  - ')}`,
);
process.exit(falhas.length === 0 ? 0 : 1);
