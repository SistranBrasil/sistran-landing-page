/**
 * SIS-216 — sonda do scrub bidirecional de `/contato`.
 *
 * O critério da issue é «ao rolar pra cima o trecho reage (scruba ou reverte), e
 * não fica "já revelado e morto"». Isso não se lê no código: um `ScrollTrigger`
 * com `scrub` escrito certo e um consumidor de CSS que ignora a propriedade dão o
 * mesmo diff e telas diferentes. Então cada item é medido na tela:
 *
 *   1. DESCENDO — `--scrub-p` e o valor COMPUTADO do que ele move (a `translate`
 *      da grade de indicadores e a `opacity` da malha da cena) em vários pontos
 *      de rolagem. Medir a custom property sozinha provaria só que o GSAP corre;
 *      é o valor computado que prova que a tela mudou.
 *   2. SUBINDO — os MESMOS pontos, na volta. O portão é `reverte`: o valor
 *      computado em cada ponto tem de voltar para perto do que era na descida
 *      (é função da posição, não do tempo), e `data-scrub-dir` tem de acusar
 *      `cima`. Um reveal de uma vez falharia aqui e passaria no item 1.
 *   3. AMPLITUDE — o par (mínimo, máximo) de cada trecho ao longo do percurso.
 *      Sem ele, «reage» poderia ser um movimento de 0,3px que ninguém vê.
 *   4. O REVEAL JÁ ENTREGUE NÃO QUEBROU — todo `[data-reveal]` da rota com
 *      `data-in` e `opacity` final, depois de percorrer a página. É o item 4 do
 *      "o que fazer" e o risco real da mudança: a grade de indicadores ganhou um
 *      ANCESTRAL novo, e os sete cartões revelam por dentro dela.
 *   5. MOVIMENTO REDUZIDO NOS DOIS CANAIS — `prefers-reduced-motion` do sistema
 *      e `html[data-motion='reduce']`. Em cada um: sem scrub (`translate: none`,
 *      opacidade cheia) e ESTADO FINAL VISÍVEL. A segunda metade é a que importa:
 *      um consumidor com fallback errado deixaria a malha presa em opacidade
 *      baixa para sempre.
 *   6. TRANSBORDO horizontal a 1440 e 390 — o envelope novo da malha é
 *      `absolute inset-0` dentro de uma seção `overflow-hidden`, e o da faixa é
 *      um bloco a mais dentro do `container-lp`.
 *
 * Uso: node scripts/medir-scrub-contato-sis216.mjs
 */

import { writeFileSync } from 'node:fs';

const PLAYWRIGHT =
  'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/361ceb562f3b3235/node_modules/playwright/index.mjs';
const SHELL =
  process.env.LOCALAPPDATA +
  '/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe';

const ROTA = 'http://localhost:3000/contato';
const SAIDA = 'docs/medidas/sis216-scrub.json';

const { chromium } = await import(PLAYWRIGHT);
const navegador = await chromium.launch({ executablePath: SHELL });

async function abrir({ largura = 1440, motion = 'full', reduceSistema } = {}) {
  const ctx = await navegador.newContext({
    viewport: { width: largura, height: 900 },
    ...(reduceSistema ? { reducedMotion: 'reduce' } : {}),
  });
  await ctx.addInitScript(
    (pref) => {
      localStorage.setItem('sistran-motion-preference', pref);
      localStorage.setItem('sistran-motion-preference-seen', '1');
      sessionStorage.setItem('sistran:intro-visto', 'true');
    },
    motion,
  );
  const p = await ctx.newPage();
  /* `domcontentloaded`: sob `next dev` o `networkidle` nunca chega (canal de HMR
     aberto) e a sonda morre em timeout — armadilha já registrada nas sondas da
     SIS-290/292. O sinal de prontidão desta base é `data-route-liberado`. */
  await p.goto(ROTA, { waitUntil: 'domcontentloaded' });
  await p.waitForSelector('[data-route-liberado="true"]', { timeout: 30000 });
  await p.addStyleTag({ content: 'nextjs-portal{display:none!important}' });
  await p.waitForTimeout(500);
  return { ctx, p };
}

/* Um ponto de leitura = o relógio dos dois escopos + o valor COMPUTADO que cada
   um move. `translate`/`opacity` computados são o que a tela mostra; `--scrub-p`
   é só a origem. */
const LER = () => {
  const faixa = document.querySelector('.contato-indicadores-scrub');
  const grade = document.querySelector('.contato-indicadores-grade');
  const malhaScope = document.querySelector('.contato-cena-scrub');
  const malha = document.querySelector('.contato-cena-scrub .grade-tecnica');
  const num = (v) => (v === '' || v == null ? null : Number(v));
  return {
    y: Math.round(window.scrollY),
    faixa: faixa
      ? {
          p: num(getComputedStyle(faixa).getPropertyValue('--scrub-p').trim()),
          ativo: faixa.dataset.scrub === '1',
          dir: faixa.dataset.scrubDir ?? null,
          translate: getComputedStyle(grade).translate,
        }
      : null,
    malha: malhaScope
      ? {
          p: num(getComputedStyle(malhaScope).getPropertyValue('--scrub-p').trim()),
          ativo: malhaScope.dataset.scrub === '1',
          dir: malhaScope.dataset.scrubDir ?? null,
          opacity: Number(getComputedStyle(malha).opacity),
          /* Canal PRINCIPAL da malha desde a recalibração: ela desliza. A
             opacidade acima virou acento secundário — ela sozinha era invisível
             (0,03 por 100px de roda) e foi o que fez esta issue voltar. */
          bg: getComputedStyle(malha).backgroundPosition,
        }
      : null,
  };
};

/* O segundo número de `translate: 0px -7.8px` — o eixo que a faixa usa. */
const eixoY = (t) => {
  if (!t || t === 'none') return 0;
  const partes = t.trim().split(/\s+/).map(parseFloat);
  return partes.length > 1 ? partes[1] : 0;
};

const resultado = { nota: 'gerado por scripts/medir-scrub-contato-sis216.mjs' };

/* ── 1, 2 e 3: descida, subida e amplitude ───────────────────────────────── */
{
  const { ctx, p } = await abrir({});
  const altura = await p.evaluate(() => document.body.scrollHeight);
  /* Os pontos cobrem a página inteira em 12 paradas: os dois trechos vivem em
     alturas diferentes e uma amostra curta pode cair fora de um deles. */
  const pontos = Array.from({ length: 12 }, (_, i) => Math.round((altura - 900) * (i / 11)));

  const parar = async (y) => {
    await p.evaluate((alvo) => window.scrollTo(0, alvo), y);
    /* 900ms porque o `scrub` tem 0,6s de inércia: lido antes disso o valor é o
       do caminho, não o do ponto — e o portão de reversibilidade compara PONTOS. */
    await p.waitForTimeout(900);
    return p.evaluate(LER);
  };

  const descida = [];
  for (const y of pontos) descida.push(await parar(y));
  const subida = [];
  for (const y of [...pontos].reverse()) subida.push(await parar(y));

  resultado.descida = descida;
  resultado.subida = subida;

  /* O portão. Para cada ponto, o valor computado na subida contra o da descida.
     Tolerância de 1px / 0,03 de opacidade: o mesmo `scrollTo` pode assentar um
     pixel diferente e a inércia do scrub não fecha em zero absoluto. */
  const porY = new Map(subida.map((l) => [l.y, l]));
  resultado.reversibilidade = descida
    .map((d) => {
      const s = porY.get(d.y);
      if (!s) return null;
      const dFaixa = eixoY(d.faixa?.translate);
      const sFaixa = eixoY(s.faixa?.translate);
      return {
        y: d.y,
        faixaDescendo: dFaixa,
        faixaSubindo: sFaixa,
        faixaVolta: Math.abs(dFaixa - sFaixa) <= 1,
        malhaDescendo: d.malha?.opacity ?? null,
        malhaSubindo: s.malha?.opacity ?? null,
        malhaVolta:
          d.malha && s.malha ? Math.abs(d.malha.opacity - s.malha.opacity) <= 0.03 : null,
        malhaBgDescendo: eixoY(d.malha?.bg),
        malhaBgSubindo: eixoY(s.malha?.bg),
        malhaBgVolta:
          d.malha && s.malha ? Math.abs(eixoY(d.malha.bg) - eixoY(s.malha.bg)) <= 1 : null,
        dirSubindo: { faixa: s.faixa?.dir ?? null, malha: s.malha?.dir ?? null },
      };
    })
    .filter(Boolean);

  const faixaYs = descida.concat(subida).map((l) => eixoY(l.faixa?.translate));
  const malhaOp = descida
    .concat(subida)
    .map((l) => l.malha?.opacity)
    .filter((v) => typeof v === 'number');
  resultado.amplitude = {
    faixaTranslateY: { min: Math.min(...faixaYs), max: Math.max(...faixaYs) },
    faixaCurso: Math.round((Math.max(...faixaYs) - Math.min(...faixaYs)) * 10) / 10,
    malhaOpacidade: { min: Math.min(...malhaOp), max: Math.max(...malhaOp) },
    /* `acusouCima` é o portão explícito contra «já revelado e morto»: sem ele,
       uma leitura idêntica na volta poderia ser um valor congelado. */
    acusouCima: subida.some((l) => l.faixa?.dir === 'cima' || l.malha?.dir === 'cima'),
  };

  /* ── 4: o reveal já entregue ──────────────────────────────────────────── */
  await p.evaluate(async () => {
    const passo = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += passo) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 140));
    }
  });
  await p.waitForTimeout(1200);
  resultado.reveal = await p.evaluate(() => {
    const nos = [...document.querySelectorAll('[data-reveal]')].map((el) => ({
      preset: el.dataset.reveal,
      dentro: el.closest('.contato-indicadores-scrub') ? 'faixa-indicadores' : null,
      acendeu: el.closest('[data-in]') !== null || el.hasAttribute('data-in'),
      opacity: Number(getComputedStyle(el).opacity),
    }));
    return {
      total: nos.length,
      acenderamTodos: nos.every((n) => n.acendeu),
      nenhumInvisivel: nos.every((n) => n.opacity > 0.99),
      naFaixa: nos.filter((n) => n.dentro).length,
      escopos: document.querySelectorAll('[data-reveal-nome], [data-in]').length,
      piorOpacidade: Math.min(...nos.map((n) => n.opacity)),
    };
  });

  /* ── Capturas ─────────────────────────────────────────────────────────────
     A issue pede «capturas descendo e subindo». Capturar o MESMO `scrollY` nos
     dois sentidos dá duas imagens IDÊNTICAS — e isso não é falha da captura, é o
     efeito estar correto: o valor é função da posição, então a volta repõe o
     quadro. A prova de que sobe e desce é a tabela `reversibilidade` acima.
     O que a imagem pode mostrar, e mostra, é o trecho em dois pontos DIFERENTES
     do seu percurso — os extremos que o gesto percorre nos dois sentidos. Cada
     captura sai com a leitura do instante no nome do arquivo do JSON. */
  resultado.capturas = [];
  const capturar = async (arquivo, alvoY) => {
    await p.evaluate((y) => window.scrollTo(0, y), alvoY);
    await p.waitForTimeout(1200);
    const leitura = await p.evaluate(LER);
    await p.screenshot({ path: `docs/capturas/${arquivo}` });
    resultado.capturas.push({ arquivo, ...leitura });
  };

  /* Os dois extremos do percurso de cada trecho, calculados da caixa real: a
     faixa e a cena vivem em alturas diferentes e escrever `scrollY` à mão aqui
     amarraria a sonda ao comprimento de hoje da rota. */
  const caixas = await p.evaluate(() => {
    const cx = (sel) => {
      const el = document.querySelector(sel);
      const r = el.getBoundingClientRect();
      return { topo: Math.round(r.y + window.scrollY), alt: Math.round(r.height) };
    };
    return { faixa: cx('.contato-indicadores'), cena: cx('.fundo-contato-cena') };
  });
  /* 675 = 75% da janela da sonda (900px): a faixa entrando pelo quarto inferior,
     que é onde o progresso do trecho ainda está perto de zero. */
  await capturar('sis216-faixa-entrando.png', Math.max(0, caixas.faixa.topo - 675));
  await capturar('sis216-faixa-saindo.png', caixas.faixa.topo + caixas.faixa.alt - 120);
  await capturar(
    'sis216-malha-meio.png',
    Math.round(caixas.cena.topo + caixas.cena.alt / 2 - 450),
  );
  await capturar('sis216-malha-saindo.png', caixas.cena.topo + caixas.cena.alt - 200);

  await ctx.close();
}

/* ── 5: movimento reduzido nos dois canais ───────────────────────────────── */
const lerReduce = async (p) => {
  /* Rola até o meio dos dois trechos: é lá que, COM movimento, os valores estão
     longe do repouso — ler no topo da rota daria «parado» de graça. */
  await p.evaluate(() => window.scrollTo(0, Math.round(document.body.scrollHeight * 0.45)));
  await p.waitForTimeout(1000);
  return p.evaluate(() => {
    const grade = document.querySelector('.contato-indicadores-grade');
    const malha = document.querySelector('.contato-cena-scrub .grade-tecnica');
    const reveals = [...document.querySelectorAll('[data-reveal]')].map((el) =>
      Number(getComputedStyle(el).opacity),
    );
    return {
      atributoMotion: document.documentElement.getAttribute('data-motion'),
      gradeTranslate: getComputedStyle(grade).translate,
      gradeSemScrub: getComputedStyle(grade).translate === 'none',
      malhaOpacidade: Number(getComputedStyle(malha).opacity),
      malhaVisivel: Number(getComputedStyle(malha).opacity) >= 0.99,
      /* O canal do deslize também tem de estar no repouso: sem a regra, vale a
         posição de base do padrão (`0% 0%`), não um deslocamento congelado. */
      malhaBg: getComputedStyle(malha).backgroundPosition,
      malhaSemDeslize: /^(0%\s+0%|0px\s+0px)/.test(getComputedStyle(malha).backgroundPosition),
      /* A propriedade CONTINUA sendo publicada (o gatilho vive); o que não
         existe é consumidor. É isto que faz o canal do atributo funcionar sem
         este componente ter de ler o atributo em JS. */
      publicou:
        getComputedStyle(document.querySelector('.contato-cena-scrub'))
          .getPropertyValue('--scrub-p')
          .trim() !== '',
      piorRevealOpacidade: reveals.length ? Math.min(...reveals) : null,
    };
  });
};

{
  const { ctx, p } = await abrir({ reduceSistema: true });
  resultado.reduceSistema = await lerReduce(p);
  await ctx.close();
}
{
  const { ctx, p } = await abrir({ motion: 'reduce' });
  resultado.reduceAtributo = await lerReduce(p);
  await ctx.close();
}

/* ── 6: transbordo nas duas larguras ─────────────────────────────────────── */
resultado.transbordo = {};
for (const largura of [1440, 390]) {
  const { ctx, p } = await abrir({ largura });
  resultado.transbordo[largura] = await p.evaluate(() => ({
    transbordo: document.documentElement.scrollWidth - window.innerWidth,
    alturaDocumento: document.body.scrollHeight,
    escoposScrub: [...document.querySelectorAll('[data-scrub-nome]')].map(
      (el) => el.dataset.scrubNome,
    ),
  }));
  await ctx.close();
}

await navegador.close();
writeFileSync(SAIDA, JSON.stringify(resultado, null, 2));
console.log(SAIDA);
console.log(JSON.stringify(resultado, null, 2));
