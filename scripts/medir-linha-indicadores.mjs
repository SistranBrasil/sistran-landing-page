/**
 * ⚠️ SONDA PARADA DESDE 11/09 — o pedido que ela media foi REVERTIDO: a faixa não
 * é mais uma linha que corre para o lado, e sim uma grade com os sete visíveis de
 * uma vez (`MetricsBand.tsx`, mount do percurso comentado). Ela lê `.mb-percurso`
 * e espera `scrollWidth > clientWidth` na fileira — hoje as duas coisas são falsas
 * por construção. Fica inteira como par do código comentado; a régua da forma
 * atual é `docs/medidas/faixa-numeros-compacta/auditar.mjs`.
 *
 * "Uma linha fixa que vai para o lado, não passando para baixo" — a sonda do pedido.
 *
 * A pergunta é uma só e vale para TODOS os estados: quantas FILEIRAS a faixa de
 * indicadores de `/contato` tem? A régua é a coordenada `y` dos sete cartões — cada
 * `y` distinto (arredondado, para não contar diferença de subpixel) é uma fileira.
 * Antes do ajuste a leitura era 3 fileiras a 1024/1440/1920, 4 a 768 e 7 a 390.
 *
 * E, porque "não quebrar" não pode custar "não alcançar": em cada estado a sonda
 * também confere que a fileira é ROLÁVEL (`scrollWidth > clientWidth`) e que rolar
 * até o fim traz o sétimo cartão inteiro para dentro da janela. Fileira única que não
 * corre esconderia quatro indicadores — é o defeito da SIS-159 com outra roupa.
 *
 * ⚠️ `boundingBox()` e `getAttribute()`, nunca `page.evaluate`, nos estados sem
 * JavaScript: `evaluate` roda no mundo principal da página e PENDURA com JS
 * desligado (25 minutos de sonda travada, registrado em
 * `medir-estados-indicadores-sis211.mjs`).
 */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';

const URL_BASE = process.env.URL_BASE ?? 'http://localhost:3999';
const GRADE = '.contato-indicadores-grade';

const abrir = async (navegador, { largura, altura = 900, rm = 'no-preference', js = true }) => {
  const contexto = await navegador.newContext({
    viewport: { width: largura, height: altura },
    deviceScaleFactor: 1,
    reducedMotion: rm,
    javaScriptEnabled: js,
  });
  if (js) {
    await contexto.addInitScript(() => {
      localStorage.setItem('sistran-motion-preference-seen', '1');
    });
  }
  const pagina = await contexto.newPage();
  await pagina.goto(`${URL_BASE}/contato`, { waitUntil: 'domcontentloaded', timeout: 180_000 });
  await pagina.waitForSelector('.contato-indicador', { timeout: 180_000 });
  if (js) await pagina.evaluate(() => document.fonts.ready);
  await pagina.waitForTimeout(1200);
  return { contexto, pagina };
};

/* Fileiras + quantos cartões estão inteiros na janela, os dois por `boundingBox()`
   para servir igualmente ao estado sem JavaScript. */
const ler = async (pagina, largura) => {
  const caixas = [];
  for (const c of await pagina.locator('.contato-indicador').all()) {
    const b = await c.boundingBox();
    if (b) caixas.push(b);
  }
  const fileiras = new Set(caixas.map((b) => Math.round(b.y)));
  const inteiros = caixas.filter((b) => b.x >= -1 && b.x + b.width <= largura + 1).length;
  return { fileiras: fileiras.size, inteiros, cartao: caixas[0] ? +caixas[0].width.toFixed(1) : 0 };
};

/* O SÉTIMO CARTÃO, e não a CONTAGEM de visíveis: numa fileira de 280px em janela de
   350px "1 de 7 inteiro" é o normal no começo E no fim, então contar não distingue
   "chega ao último" de "travou no primeiro". A régua é a caixa do 7º depois de rolar.
   O gesto é `mouse.wheel` com deslocamento HORIZONTAL sobre a fileira, de propósito:
   é o que o visitante faz, funciona SEM JavaScript (o `scrollLeft` por `evaluate`
   não) e passa pelo `scroll-snap`, em vez de contornar tudo isso. */
const alcancaSetimo = async (pagina, largura) => {
  const alvo = pagina.locator('.contato-indicador').nth(6);
  const linha = pagina.locator(GRADE);
  await linha.hover();
  for (let i = 0; i < 40; i += 1) {
    await pagina.mouse.wheel(400, 0);
    await pagina.waitForTimeout(60);
    const b = await alvo.boundingBox();
    if (b && b.x >= -1 && b.x + b.width <= largura + 1) {
      return `7º alcançado (x ${Math.round(b.x)}, largura ${Math.round(b.width)}) em ${(i + 1) * 400}px de gesto`;
    }
  }
  return '7º NÃO alcançado em 16000px de gesto lateral';
};

const navegador = await chromium.launch();

for (const largura of [390, 768, 1024, 1440, 1920]) {
  /* Repouso abaixo de 1024 e percurso acima — o mesmo contexto lê os dois, porque a
     condição de largura é do CSS, não da sonda. */
  const { contexto, pagina } = await abrir(navegador, { largura });
  const percurso = (await pagina.locator('.mb-percurso').getAttribute('data-percurso')) ?? 'ausente';
  const rolagem = await pagina.evaluate((sel) => {
    const g = document.querySelector(sel);
    return { sw: Math.round(g.scrollWidth), cw: Math.round(g.clientWidth), x: Math.round(g.scrollLeft) };
  }, GRADE);
  const antes = await ler(pagina, largura);
  /* Com o percurso ligado quem move a linha é a rolagem VERTICAL (o `transform`), e
     o alcance dos sete já está medido pelas sondas da SIS-211 — aqui só interessa o
     gesto lateral dos estados de repouso. */
  const alcance =
    percurso === 'ligado' ? '(percurso: alcance pela rolagem vertical)' : await alcancaSetimo(pagina, largura);
  console.log(
    `${largura}: percurso ${percurso} · ${antes.fileiras} fileira(s) · cartão ${antes.cartao}px · rolável ${rolagem.sw}/${rolagem.cw}px · inteiros ${antes.inteiros}/7 · ${alcance}`,
  );
  await contexto.close();
}

/* Os dois desligamentos, a 1440 — onde antes a leitura virava grade de 3 fileiras. */
{
  const { contexto, pagina } = await abrir(navegador, { largura: 1440, rm: 'reduce' });
  const e = await ler(pagina, 1440);
  const r = await pagina.evaluate((sel) => {
    const g = document.querySelector(sel);
    return `${Math.round(g.scrollWidth)}/${Math.round(g.clientWidth)}px · display ${getComputedStyle(g).display} · foco tabindex ${g.getAttribute('tabindex')}`;
  }, GRADE);
  console.log(`reduce do sistema (1440): ${e.fileiras} fileira(s) · cartão ${e.cartao}px · ${r} · inteiros ${e.inteiros}/7 · ${await alcancaSetimo(pagina, 1440)}`);
  await contexto.close();
}
{
  const { contexto, pagina } = await abrir(navegador, { largura: 1440 });
  await pagina.evaluate(() => {
    document.documentElement.dataset.motion = 'reduce';
    /* Pior caso do espelho: o atributo do percurso SOBREVIVE ao botão. */
    document.querySelector('.mb-percurso').setAttribute('data-percurso', 'ligado');
  });
  await pagina.waitForTimeout(500);
  const e = await ler(pagina, 1440);
  const r = await pagina.evaluate((sel) => {
    const g = document.querySelector(sel);
    return `${Math.round(g.scrollWidth)}/${Math.round(g.clientWidth)}px · display ${getComputedStyle(g).display} · transform ${getComputedStyle(g).transform} · espaçador ${Math.round(document.querySelector('.mb-espaco').getBoundingClientRect().height)}px`;
  }, GRADE);
  console.log(`botão em reduce (1440, atributo mantido): ${e.fileiras} fileira(s) · cartão ${e.cartao}px · ${r} · inteiros ${e.inteiros}/7 · ${await alcancaSetimo(pagina, 1440)}`);
  await contexto.close();
}
{
  const { contexto, pagina } = await abrir(navegador, { largura: 1440, js: false });
  const e = await ler(pagina, 1440);
  const foco = await pagina.locator(GRADE).getAttribute('tabindex');
  console.log(`sem JavaScript (1440): ${e.fileiras} fileira(s) · cartão ${e.cartao}px · tabindex ${foco} · inteiros ${e.inteiros}/7 · ${await alcancaSetimo(pagina, 1440)}`);
  await contexto.close();
}

await navegador.close();
