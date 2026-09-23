/**
 * SIS-268 — A SOMBRA DOS CARDS DE ACELERADOR em `/solucoes`.
 *
 * O portão desta issue é de COR, e cor de sombra não se confere lendo a regra: o que a
 * pessoa vê é o pixel COMPOSTO — três camadas de `box-shadow` translúcidas somadas
 * sobre o fundo da faixa. Então a sonda mede o pixel logo abaixo da borda do card, em
 * repouso e no hover, e converte para matiz/saturação/luminosidade: «azul mais claro»
 * é L maior com H ainda em azul, e «sem navy/chumbo» é saturação que não desaba.
 *
 * Roda duas vezes, antes e depois da troca:
 *   node scripts/medir-sombra-accel-sis268.mjs antes
 *   node scripts/medir-sombra-accel-sis268.mjs depois
 * e grava `docs/medidas/sis268-sombra-<rótulo>.json`.
 *
 * Receita de navegador da casa (Playwright do cache do npx, :3000, preferência de
 * movimento semeada, canal `reduce` em contexto novo).
 */
import { writeFileSync, mkdirSync } from 'node:fs';

const rotulo = process.argv[2] ?? 'antes';

const { chromium } = await import(
  'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs'
);

const ROTA = 'http://localhost:3000/solucoes';

/* Distâncias de amostragem abaixo da borda do card, em px. A primeira pega o contato
   (a camada de 1–3px), as outras duas o corpo dos dois desfoques grandes. */
const DISTANCIAS = [3, 12, 26];

const semear = (ctx, valor) =>
  ctx.addInitScript((v) => {
    localStorage.setItem('sistran-motion-preference-seen', '1');
    localStorage.setItem('sistran-motion-preference', v);
  }, valor);

/* Pixel composto: recorte 1×1 da tela, decodificado na própria página. É o único jeito
   de ler a soma das camadas translúcidas com o fundo. */
async function pixel(page, x, y) {
  const buf = await page.screenshot({ clip: { x, y, width: 1, height: 1 } });
  return page.evaluate(async (dados) => {
    const img = new Image();
    img.src = `data:image/png;base64,${dados}`;
    await img.decode();
    const c = document.createElement('canvas');
    c.width = 1;
    c.height = 1;
    const ctx2 = c.getContext('2d');
    ctx2.drawImage(img, 0, 0);
    const [r, g, b] = ctx2.getImageData(0, 0, 1, 1).data;
    return [r, g, b];
  }, buf.toString('base64'));
}

/* HSL só para LER o resultado: matiz diz se continua azul, luminosidade diz se
   clareou, saturação diz se não virou chumbo. */
function hsl([r, g, b]) {
  const [R, G, B] = [r / 255, g / 255, b / 255];
  const max = Math.max(R, G, B);
  const min = Math.min(R, G, B);
  const l = (max + min) / 2;
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === R) h = ((G - B) / d) % 6;
    else if (max === G) h = (B - R) / d + 2;
    else h = (R - G) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

/* O ponto de amostra tem de estar PROVADAMENTE no fundo da faixa, e não em cima de
   outro card: na primeira passada a amostra de 26px abaixo do card lia 15,34,54 — era o
   card de baixo, porque o vão da grade é menor que 26px. Então cada amostra volta com o
   `elementFromPoint`, e quem cair sobre `.accel-card` (ou dentro de um) é descartado
   como inválido em vez de entrar na conta como «sombra escura». */
/* O INTERIOR DO CARD — portão de «os cards continuam legíveis».
   A PRIMEIRA VERSÃO DESTE PORTÃO FOI DESCARTADA, e o motivo fica escrito porque ele é o
   tipo de armadilha que volta: eu amostrava o pixel composto num ponto da coluna de
   texto, com os glifos escondidos. O número oscilou de 15,36:1 para 2,78:1 entre duas
   rodadas SEM que nada do interior mudasse — o ponto cai sobre a FOTO da capa, cuja área
   visível depende do `object-fit: cover`, do zoom de hover e de a arte já ter chegado.
   Era ruído de carregamento medindo o que devia ser uma constante.
   O que de fato prova o portão é que nenhuma regra INTERNA mudou: o véu, a cor do texto,
   a borda e o botão são lidos computados e comparados entre as duas rodadas. A
   legibilidade sobre a capa em si continua sendo a medição da SIS-216 (13,81 / 13,01 /
   9,96:1), que esta issue não toca porque não toca o véu. */
async function interiorDoCartao(page, indice) {
  return page.evaluate((i) => {
    const el = document.querySelectorAll('.accel-card')[i];
    if (!el) return null;
    const veu = el.querySelector('.accel-card__veu');
    const cta = el.querySelector('.accel-card__cta');
    const texto = el.querySelector('p');
    return {
      veu: veu ? getComputedStyle(veu).backgroundImage : null,
      corDoTexto: texto ? getComputedStyle(texto).color : null,
      fundoDoCard: getComputedStyle(el).backgroundColor,
      borda: getComputedStyle(el).border,
      ctaFundo: cta ? getComputedStyle(cta).backgroundColor : null,
      ctaCor: cta ? getComputedStyle(cta).color : null,
    };
  }, indice);
}

async function medirCartao(page, indice) {
  const pos = await page.evaluate((i) => {
    const el = document.querySelectorAll('.accel-card')[i];
    if (!el) return null;
    el.scrollIntoView({ block: 'center' });
    const r = el.getBoundingClientRect();
    return { x: Math.round(r.x + r.width / 2), base: Math.round(r.bottom) };
  }, indice);
  if (!pos) return null;
  await page.waitForTimeout(400);
  const atual = await page.evaluate((i) => {
    const el = document.querySelectorAll('.accel-card')[i];
    const r = el.getBoundingClientRect();
    return { x: Math.round(r.x + r.width / 2), base: Math.round(r.bottom) };
  }, indice);
  const amostras = {};
  /* LINHA DE BASE LATERAL, e não «muito abaixo do card»: 160px abaixo já caía na faixa
     seguinte (o pixel voltou navy, de `section-py` e até de um `<video>`), o que
     comparava halo com outra seção. Na MESMA altura, encostado na margem da viewport, o
     pixel está fora do alcance das camadas (o maior desfoque é 84px com −34 de
     espalhamento) e ainda é a faixa certa. Sem isto não se sabe se um pixel claro é halo
     claro ou halo nenhum — e a issue pede que o card continue separado do fundo. */
  {
    const y = atual.base + 12;
    const cor = await pixel(page, 4, y);
    const sob = await page.evaluate(
      ([px, py]) => {
        const el = document.elementFromPoint(px, py);
        return { alvo: el ? el.tagName.toLowerCase() : null, sobreCard: !!el?.closest('.accel-card') };
      },
      [4, y],
    );
    amostras.fundo = { rgb: cor, ...hsl(cor), ...sob, valido: !sob.sobreCard };
  }
  for (const d of DISTANCIAS) {
    const y = atual.base + d;
    const sob = await page.evaluate(
      ([px, py]) => {
        const el = document.elementFromPoint(px, py);
        if (!el) return { alvo: null, sobreCard: false };
        return {
          alvo: `${el.tagName.toLowerCase()}.${el.className?.toString?.().split(' ')[0] ?? ''}`,
          sobreCard: !!el.closest('.accel-card'),
        };
      },
      [atual.x, y],
    );
    const cor = await pixel(page, atual.x, y);
    amostras[`${d}px`] = { rgb: cor, ...hsl(cor), ...sob, valido: !sob.sobreCard };
  }
  return amostras;
}

const browser = await chromium.launch();
const saida = { rotulo, rota: ROTA, quando: new Date().toISOString(), larguras: {} };

for (const largura of [1440, 390]) {
  const ctx = await browser.newContext({
    viewport: { width: largura, height: 900 },
    deviceScaleFactor: 1,
  });
  await semear(ctx, 'full');
  const page = await ctx.newPage();
  const erros = [];
  page.on('console', (m) => m.type() === 'error' && erros.push(m.text()));
  await page.goto(ROTA, { waitUntil: 'load', timeout: 90000 });
  await page.waitForTimeout(2500);

  /* O FLUTUAR DOS CARDS É CONGELADO PARA MEDIR, e isto é método, não conserto: entre a
     leitura do `getBoundingClientRect` e o recorte de 1×1 o card sobe ou desce alguns
     pixels, e a amostra de «12px abaixo da borda» virava 8px ou 17px — na primeira
     passada a mesma distância deu L 88 numa rodada e L 85 na outra, ou seja o ruído era
     do tamanho do efeito que eu preciso ler. `animation-play-state: paused` para o card
     ficar num quadro qualquer mas ESTÁVEL; a animação em si é medida no bloco de
     movimento reduzido, que não usa esta pausa. */
  await page.addStyleTag({
    content: '.accel-item { animation-play-state: paused !important; }',
  });
  await page.waitForTimeout(200);

  /* O «ANTES» É REPOSTO POR FOLHA INJETADA, em vez de eu reverter o arquivo e rodar duas
     vezes: assim os dois estados passam pelo MESMO caminho de medição (mesma pausa do
     float, mesmo ponto de amostra, mesma sessão), e a comparação não carrega diferença de
     método. As quatro/três camadas abaixo são as da SIS-216, copiadas verbatim do bloco
     que o comentário do CSS preserva. */
  if (rotulo === 'antes') {
    await page.addStyleTag({
      content: `
        .accel-card {
          box-shadow:
            0 1px 3px rgb(var(--accel-azul) / 12%),
            0 14px 30px -16px rgb(var(--accel-azul) / 22%),
            0 32px 62px -30px rgb(var(--accel-azul) / 26%) !important;
        }
        .accel-card:hover, .accel-card:focus-within {
          box-shadow:
            0 0 0 1px rgb(var(--accel-azul) / 30%),
            0 2px 6px rgb(var(--accel-azul) / 14%),
            0 22px 46px -18px rgb(var(--accel-azul) / 34%),
            0 44px 84px -34px rgb(var(--accel-azul) / 34%) !important;
        }
      `,
    });
    await page.waitForTimeout(200);
  }

  /* REGRAS DECLARADAS, para o relatório mostrar o valor e não só a cor medida. */
  const regras = await page.evaluate(() => {
    const el = document.querySelector('.accel-card');
    const e = getComputedStyle(el);
    return {
      repouso: e.boxShadow,
      azul: e.getPropertyValue('--accel-azul').trim(),
      sombra: e.getPropertyValue('--accel-azul-sombra').trim() || '(não existe)',
      borda: e.borderColor,
    };
  });

  /* O ÚLTIMO CARD da grade, e não o segundo: abaixo dele só há o respiro da faixa, então
     as três distâncias caem todas no fundo. Debaixo de qualquer card do meio, o vão da
     grade é menor que a maior distância e a amostra pegaria o card seguinte. */
  const indice = await page.evaluate(() => document.querySelectorAll('.accel-card').length - 1);
  const repouso = await medirCartao(page, indice);
  const interior = await interiorDoCartao(page, indice);

  /* HOVER de verdade (`page.hover` no nó), e não classe forçada: o estado tem alfas
     próprios e um seletor `:hover` que só o ponteiro acende. Os cards flutuam, então o
     alvo é buscado por `evaluate` e o ponteiro vai à coordenada — `locator.hover()`
     estoura tempo num nó em movimento. */
  const alvo = await page.evaluate((i) => {
    const r = document.querySelectorAll('.accel-card')[i].getBoundingClientRect();
    return { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) };
  }, indice);
  await page.mouse.move(alvo.x, alvo.y);
  await page.waitForTimeout(900);
  const hoverRegras = await page.evaluate(
    (i) => getComputedStyle(document.querySelectorAll('.accel-card')[i]).boxShadow,
    indice,
  );
  const hover = await medirCartao(page, indice);
  await page.mouse.move(0, 0);

  mkdirSync('docs/capturas', { recursive: true });
  await page.screenshot({ path: `docs/capturas/sis268-sombra-${rotulo}-${largura}.png`, fullPage: false });

  saida.larguras[largura] = { regras, hoverRegras, repouso, hover, interior, errosDeConsole: erros };
  await ctx.close();
}

/* Movimento reduzido: a régua desta seção é «o movimento para, o realce fica» — então
   a sombra do hover tem de CONTINUAR existindo nos dois canais. */
saida.reduce = {};
for (const canal of ['sistema', 'chave']) {
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    ...(canal === 'sistema' ? { reducedMotion: 'reduce' } : {}),
  });
  await semear(ctx, canal === 'sistema' ? 'reduce' : 'full');
  const page = await ctx.newPage();
  await page.goto(ROTA, { waitUntil: 'load', timeout: 90000 });
  if (canal === 'chave')
    await page.evaluate(() => document.documentElement.setAttribute('data-motion', 'reduce'));
  await page.waitForTimeout(1500);
  const alvo = await page.evaluate(() => {
    const el = document.querySelectorAll('.accel-card')[2];
    el.scrollIntoView({ block: 'center' });
    const r = el.getBoundingClientRect();
    return { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) };
  });
  await page.waitForTimeout(400);
  await page.mouse.move(alvo.x, alvo.y);
  await page.waitForTimeout(700);
  saida.reduce[canal] = await page.evaluate(() => {
    const el = document.querySelectorAll('.accel-card')[2];
    const e = getComputedStyle(el);
    return { sombra: e.boxShadow, transform: e.transform, erguida: e.getPropertyValue('--accel-erguida').trim() };
  });
  await ctx.close();
}

await browser.close();
mkdirSync('docs/medidas', { recursive: true });
writeFileSync(`docs/medidas/sis268-sombra-${rotulo}.json`, JSON.stringify(saida, null, 2));
console.log(JSON.stringify(saida, null, 2));
