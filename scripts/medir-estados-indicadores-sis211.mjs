/**
 * ⚠️ SONDA PARADA DESDE 11/09 — o percurso saiu do DOM de `/contato` (mount
 * comentado em `MetricsBand.tsx`), então `--mb-t`, `--mb-alc` progressivo e o
 * espaçador não têm mais o que medir. Fica inteira como par do código comentado.
 * A régua da forma atual é `docs/medidas/faixa-numeros-compacta/auditar.mjs`.
 *
 * SIS-211 — os estados da faixa de indicadores, e as capturas das duas emendas.
 *
 * O que a issue cobra e esta sonda responde, um por um:
 *   1. o acendimento da trilha CHEGA ao fim — `--mb-alc` do 7º cartão vale 1 no
 *      último quadro em que o palco está preso;
 *   2. `--mb-t` chega a 1 no quadro em que o palco solta, agora com PASSO_SVH = 18
 *      (a conferência anterior foi feita com 30 e está registrada em
 *      `PercursoIndicadores.tsx`);
 *   3. movimento reduzido pelos DOIS caminhos — a preferência do sistema e o botão
 *      da interface (`html[data-motion="reduce"]`) — deixa os sete indicadores
 *      legíveis, sem espaçador sobrevivente;
 *   4. sem JavaScript, idem;
 *   5. as duas emendas, em foto, para o revisor ver que não há listra.
 *
 * O botão é simulado escrevendo o atributo E mantendo `data-percurso` no lugar: é o
 * pior caso do espelho (o atributo sobrevivendo a um quadro), que é justamente o que
 * o espelho existe para cobrir. Confiar em `removeAttribute` do componente mediria o
 * componente, não o CSS.
 */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import { mkdir } from 'node:fs/promises';

const URL_BASE = process.env.URL_BASE ?? 'http://localhost:3999';
const DESTINO = 'docs/capturas';
await mkdir(DESTINO, { recursive: true });

const SEM_CROMO = `nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button]{display:none!important}
  header{display:none!important}`;

const abrir = async (navegador, { largura = 1440, rm = 'no-preference', js = true } = {}) => {
  const contexto = await navegador.newContext({
    viewport: { width: largura, height: 900 },
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
  /* ⚠️ `addStyleTag` TAMBÉM roda no mundo principal da página: com JS desligado ele
     pendura igual ao `evaluate` (foi a segunda causa da sonda travada). Não faz falta
     nesse estado — o cromo do `next dev` é injetado por JavaScript, então sem JS ele
     nem existe para esconder. */
  if (js) await pagina.addStyleTag({ content: SEM_CROMO });
  return { contexto, pagina };
};

/* Quantos dos sete cartões estão INTEIROS dentro da largura da janela — a régua de
   "alcançável" que a SIS-159 fixou para a trilha de parceiros.
   ⚠️ MEDIDO POR `boundingBox()`, não por `evaluate`: um dos estados desta sonda é
   "sem JavaScript", e `page.evaluate` não roda em contexto com JS desligado — a
   primeira versão desta sonda ficou 25 minutos pendurada exatamente aí. O protocolo
   do navegador mede a caixa de fora, e serve aos quatro estados igualmente. */
const inteiros = async (pagina, largura) => {
  const caixas = await pagina.locator('.contato-indicador').all();
  let n = 0;
  for (const c of caixas) {
    const b = await c.boundingBox();
    if (b && b.x >= -1 && b.x + b.width <= largura + 1 && b.width > 0 && b.height > 0) n += 1;
  }
  return n;
};
const alturaDe = async (pagina, sel) => {
  const b = await pagina.locator(sel).first().boundingBox();
  return b ? Math.round(b.height) : 0;
};

const navegador = await chromium.launch();

/* ── 1 e 2 · o fim do percurso ───────────────────────────────────────────── */
{
  const { contexto, pagina } = await abrir(navegador);
  const fim = await pagina.evaluate(async () => {
    const perc = document.querySelector('.mb-percurso');
    const palco = document.querySelector('.mb-palco');
    const setimo = document.querySelectorAll('.contato-indicador')[6];
    /* ⚠️ NÃO SE LÊ `getPropertyValue('--mb-t')` AQUI. Propriedade personalizada não
       registrada é herdada como TOKEN, não como número: o valor computado devolve o
       texto `clamp(0, calc(var(--mb-p) * 1.9259), 1)` e `parseFloat` disso é NaN — foi
       o que a primeira rodada desta sonda imprimiu.
       Então a medição usa uma RÉGUA: um nó de 0×0 dentro do elemento cujo valor se
       quer, com `width: calc(var(--x) * 1000px)`. O compositor resolve a conta e
       `getComputedStyle().width` volta em px — o número dividido por 1000 é o valor.
       `--mb-p` é escrito pelo componente já como número cru, então esse pode ser lido
       direto. */
    const regua = (pai, nome) => {
      const r = document.createElement('i');
      r.style.cssText = `position:absolute;height:0;visibility:hidden;width:calc(var(${nome}) * 1000px)`;
      pai.append(r);
      const px = Number.parseFloat(getComputedStyle(r).width);
      r.remove();
      return px / 1000;
    };
    const comprimento = (pai, nome) => {
      const r = document.createElement('i');
      r.style.cssText = `position:absolute;height:0;visibility:hidden;width:var(${nome})`;
      pai.append(r);
      const px = Number.parseFloat(getComputedStyle(r).width);
      r.remove();
      return px;
    };
    const num = (el, nome) => Number.parseFloat(getComputedStyle(el).getPropertyValue(nome));
    let ultimoPreso = null;
    /* A VARREDURA É LOCAL, e isso não é economia: percorrer o documento inteiro de
       8 em 8px sob `next dev` não terminou em 15 minutos (a página remonta a cada
       quadro de rolagem). O trecho preso já foi medido pela régua
       (`medir-banda-indicadores-sis211.mjs`: de 680 a 1640 a 1440×900), então a
       janela de varredura é derivada daqui mesmo — do topo da seção até o fim do
       espaçador mais uma tela — em vez de redigitada.
       Passo de 8px: o comentário do `ESCALA` avisa que passo grande faz a sobra
       parecer erro de cena quando é só amostragem. */
    const secao = document.querySelector('.contato-indicadores').getBoundingClientRect();
    const inicio = Math.max(0, secao.top + window.scrollY - 16);
    const fim = inicio + secao.height + window.innerHeight;
    /* Duas passadas: 8px para achar a soltura, depois 1px nos 40px anteriores a ela.
       O comentário do `ESCALA` avisa que passo grande faz a sobra parecer erro de cena
       quando é só amostragem — com 8px de rolagem a trilha anda ~10px, e o `--mb-alc`
       do último cartão se move 0,04 entre um quadro e o outro. O refino de 1px é o que
       permite afirmar "chega a 1" em vez de "chegou perto". */
    const varrer = async (de, ate, passo) => {
      for (let y = de; y <= ate; y += passo) {
        window.scrollTo(0, y);
        await new Promise((ok) => requestAnimationFrame(() => requestAnimationFrame(ok)));
        if (Math.abs(palco.getBoundingClientRect().top) <= 2) {
          ultimoPreso = {
            y,
            t: regua(perc, '--mb-t'),
            p: num(perc, '--mb-p'),
            alc7: regua(setimo, '--mb-alc'),
            /* `--mb-dist` já é comprimento: entra na régua como largura direta, sem o
               fator de 1000 (px × px não é conta válida em CSS). */
            dist: comprimento(perc, '--mb-dist'),
            trilha: getComputedStyle(document.querySelector('.contato-indicadores-grade'))
              .transform,
          };
        }
      }
    };
    await varrer(inicio, fim, 8);
    const grosso = ultimoPreso.y;
    await varrer(grosso - 40, grosso + 40, 1);
    window.scrollTo(0, 0);
    return ultimoPreso;
  });
  console.log(
    `fim do percurso (último quadro preso, y=${fim.y}): --mb-p ${fim.p.toFixed(4)} · --mb-t ${fim.t.toFixed(4)} · --mb-alc do 7º ${fim.alc7.toFixed(4)} · trilha ${fim.trilha} de ${fim.dist.toFixed(1)}px`,
  );
  await contexto.close();
}

/* ── 3a · preferência do sistema ─────────────────────────────────────────── */
{
  const { contexto, pagina } = await abrir(navegador, { rm: 'reduce' });
  const e = await pagina.evaluate(() => ({
    percurso: document.querySelector('.mb-percurso')?.dataset.percurso ?? '(ausente)',
    espaco: document.querySelector('.mb-espaco').getBoundingClientRect().height,
    secao: Math.round(document.querySelector('.contato-indicadores').getBoundingClientRect().height),
  }));
  console.log(
    `reduce do sistema: data-percurso ${e.percurso} · espaçador ${e.espaco}px · seção ${e.secao}px · ${await inteiros(pagina, 1440)}/7 cartões inteiros na janela`,
  );
  await contexto.close();
}

/* ── 3b · o botão da interface, no pior caso ─────────────────────────────── */
{
  const { contexto, pagina } = await abrir(navegador);
  await pagina.evaluate(() => {
    document.documentElement.dataset.motion = 'reduce';
    /* O atributo do percurso é REPOSTO de propósito: é o quadro em que ele
       sobrevive ao botão, que é o que o espelho do CSS tem de cobrir. */
    document.querySelector('.mb-percurso').setAttribute('data-percurso', 'ligado');
  });
  await pagina.waitForTimeout(400);
  const e = await pagina.evaluate(() => {
    const setimo = document.querySelectorAll('.contato-indicador')[6];
    return {
      espaco: document.querySelector('.mb-espaco').getBoundingClientRect().height,
      grade: getComputedStyle(document.querySelector('.contato-indicadores-grade')).display,
      transformada: getComputedStyle(document.querySelector('.contato-indicadores-grade')).transform,
      alc7: getComputedStyle(setimo).getPropertyValue('--mb-alc').trim(),
      larguraGrade: Math.round(
        document.querySelector('.contato-indicadores-grade').getBoundingClientRect().width,
      ),
    };
  });
  console.log(
    `botão em reduce (atributo mantido): espaçador ${e.espaco}px · grade ${e.grade} ${e.larguraGrade}px · transform ${e.transformada} · --mb-alc do 7º "${e.alc7}" · ${await inteiros(pagina, 1440)}/7 cartões inteiros na janela`,
  );
  await contexto.close();
}

/* ── 4 · sem JavaScript ──────────────────────────────────────────────────── */
{
  const { contexto, pagina } = await abrir(navegador, { js: false });
  const percurso =
    (await pagina.locator('.mb-percurso').getAttribute('data-percurso')) ?? '(ausente)';
  const numeros = await pagina.locator('.contato-indicador-valor').allInnerTexts();
  console.log(
    `sem JavaScript: data-percurso ${percurso} · espaçador ${await alturaDe(pagina, '.mb-espaco')}px · seção ${await alturaDe(pagina, '.contato-indicadores')}px · ${await inteiros(pagina, 1440)}/7 cartões inteiros na janela`,
  );
  console.log(`  números servidos: ${numeros.map((t) => t.replace(/\s+/g, '')).join(' | ')}`);
  await contexto.close();
}

/* ── 5 · as duas emendas em foto ─────────────────────────────────────────── */
{
  const { contexto, pagina } = await abrir(navegador);
  for (const [nome, borda] of [
    ['abertura-banda', 'topo'],
    ['banda-logos', 'base'],
  ]) {
    await pagina.evaluate((qual) => {
      const cx = document.querySelector('.contato-indicadores').getBoundingClientRect();
      const absoluto = (qual === 'topo' ? cx.top : cx.bottom) + window.scrollY;
      window.scrollTo(0, Math.max(0, absoluto - window.innerHeight / 2));
    }, borda);
    await pagina.waitForTimeout(800);
    await pagina.screenshot({ path: `${DESTINO}/sis211-emenda-${nome}-1440.png` });
    console.log(`captura: sis211-emenda-${nome}-1440.png`);
  }
  await contexto.close();
}

await navegador.close();
