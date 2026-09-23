/**
 * SIS-279 — sonda do scrub bidirecional de `/eventos-inovacao`.
 *
 * Herda a estrutura da sonda da SIS-216 e ACRESCENTA, desde o começo, o portão
 * que faltava lá: PERCEPÇÃO. Na SIS-216 eu declarei aprovado com «o valor
 * percorreu o curso declarado» e a tela não mostrava nada — o portão media a
 * coisa errada. Aqui o item 3 é «quanto o valor anda por 100px de roda, medido só
 * na janela em que o trecho está na tela», e ele vem antes dos outros.
 *
 * As duas versões da rota se excluem por `display: none`, então cada largura mede
 * o SEU escopo: 1440 → `.eventos-cena-scrub` (cena com palco `sticky`);
 * 390 → `.eventos-faixa-scrub` (lista estreita).
 *
 *   1. DESCENDO — `--scrub-p` e o `background-position` COMPUTADO da malha. A
 *      propriedade sozinha provaria só que o GSAP corre; é o computado que prova
 *      que a tela mudou.
 *   2. SUBINDO — os MESMOS pontos na volta. O portão da issue é «ao rolar pra cima
 *      o trecho reage»: o computado é função da POSIÇÃO, então tem de repor o
 *      valor, e `data-scrub-dir` tem de acusar `cima`. Um reveal de uma vez
 *      passaria no item 1 e falharia aqui.
 *   3. PERCEPÇÃO — px de deriva por 100px de rolagem, contados só nas amostras em
 *      que a caixa do trecho está na janela. Alvo ~6px/100px.
 *   4. O REVEAL DA SIS-272 NÃO QUEBROU — todo `[data-reveal]` aceso e opaco, e os
 *      dois portões daquela issue mantidos: nenhum nó marcado dentro de `#topo`
 *      nem de `#social`. O risco real aqui é de EMPILHAMENTO, não de reveal: a
 *      malha nova é um irmão novo dentro das duas seções.
 *   5. SPOTLIGHT INTACTO — a troca de destaque pela rolagem continua acontecendo
 *      (é o conteúdo da rota) e o palco continua `sticky`.
 *   6. MOVIMENTO REDUZIDO NOS DOIS CANAIS — sem deriva (`background-position` na
 *      base) e ESTADO FINAL VISÍVEL. A segunda metade é a que importa: fallback
 *      errado deixaria a malha presa fora de lugar para sempre.
 *   7. TRANSBORDO a 1440 e 390 — a malha é `absolute inset-0` nova em duas seções.
 *
 * Uso: node scripts/medir-scrub-eventos-sis279.mjs
 */

import { writeFileSync } from 'node:fs';

const PLAYWRIGHT =
  'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/361ceb562f3b3235/node_modules/playwright/index.mjs';
const SHELL =
  process.env.LOCALAPPDATA +
  '/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe';

const ROTA = 'http://localhost:3000/eventos-inovacao';
const SAIDA = 'docs/medidas/sis279-scrub.json';

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
     aberto) e a sonda morre em timeout. O sinal desta base é `data-route-liberado`. */
  await p.goto(ROTA, { waitUntil: 'domcontentloaded' });
  await p.waitForSelector('[data-route-liberado="true"]', { timeout: 30000 });
  await p.addStyleTag({ content: 'nextjs-portal{display:none!important}' });
  await p.waitForTimeout(600);
  return { ctx, p };
}

/* O segundo número de `background-position: 0px -280px, ...` — o eixo da deriva.
   `parseFloat` engole a vírgula que separa as camadas. */
const eixoY = (v) => {
  if (!v || v === 'none') return 0;
  const partes = v.trim().split(/\s+/).map(parseFloat);
  return partes.length > 1 && Number.isFinite(partes[1]) ? partes[1] : 0;
};

/* Uma leitura = o relógio do escopo da largura atual + o computado da malha.
   O escopo é escolhido por presença de caixa, não por largura escrita na sonda:
   é o `display: none` do CSS que decide qual das duas versões está viva. */
const LER = () => {
  const alvo =
    document.querySelector('.eventos-cena-scrub')?.offsetParent !== null
      ? '.eventos-cena-scrub'
      : '.eventos-faixa-scrub';
  const esc = document.querySelector(alvo);
  if (!esc) return { y: Math.round(scrollY), escopo: null };
  const malha = esc.querySelector('.eventos-malha-deriva');
  const num = (v) => (v === '' || v == null ? null : Number(v));
  const cx = esc.parentElement.getBoundingClientRect();
  return {
    y: Math.round(scrollY),
    escopo: esc.dataset.scrubNome,
    p: num(getComputedStyle(esc).getPropertyValue('--scrub-p').trim()),
    ativo: esc.dataset.scrub === '1',
    dir: esc.dataset.scrubDir ?? null,
    bg: getComputedStyle(malha).backgroundPosition,
    opacidade: Number(getComputedStyle(malha).opacity),
    /* Fração da seção que está na janela: é o que define «o usuário está olhando
       para isto». Com o palco `sticky` a seção é maior que a tela, então o
       denominador é limitado pela janela. */
    visivel:
      Math.max(0, Math.min(cx.bottom, innerHeight) - Math.max(cx.top, 0)) /
      Math.min(cx.height, innerHeight),
  };
};

const resultado = { nota: 'gerado por scripts/medir-scrub-eventos-sis279.mjs' };

/* ── 1, 2 e 3, por largura ───────────────────────────────────────────────── */
for (const largura of [1440, 390]) {
  const { ctx, p } = await abrir({ largura });
  const bloco = {};
  const altura = await p.evaluate(() => document.body.scrollHeight);

  /* (a) PERCEPÇÃO — passo fino de 100px e SEM esperar a inércia: aqui não se
     comparam pontos, levanta-se a curva. O `scrub` atrasa o valor, não muda o
     percurso. */
  const curva = [];
  for (let y = 0; y <= altura - 900; y += 100) {
    await p.evaluate((alvo) => window.scrollTo(0, alvo), y);
    await p.waitForTimeout(260);
    curva.push(await p.evaluate(LER));
  }
  const visiveis = curva.filter((a) => a.escopo && a.visivel > 0.5);
  const passos = [];
  for (let i = 1; i < curva.length; i++) {
    if (curva[i].visivel > 0.5 && curva[i - 1].escopo) {
      passos.push(Math.abs(eixoY(curva[i].bg) - eixoY(curva[i - 1].bg)));
    }
  }
  const emCurso = curva.filter((a) => a.p > 0.001 && a.p < 0.999);
  bloco.percepcao = {
    escopo: visiveis[0]?.escopo ?? null,
    percursoY: emCurso.length ? [emCurso[0].y, emCurso.at(-1).y] : null,
    visivelY: visiveis.length ? [visiveis[0].y, visiveis.at(-1).y] : null,
    amostrasVisiveis: visiveis.length,
    amostrasVisiveisComPercurso: curva.filter(
      (a) => a.visivel > 0.5 && a.p > 0.001 && a.p < 0.999,
    ).length,
    /* O NÚMERO DO PORTÃO. Alvo ~6px por 100px de roda. */
    derivaPxPor100pxVisivel: passos.length
      ? Math.round((passos.reduce((a, b) => a + b, 0) / passos.length) * 100) / 100
      : null,
    derivaMin: Math.min(...curva.map((a) => eixoY(a.bg))),
    derivaMax: Math.max(...curva.map((a) => eixoY(a.bg))),
  };
  bloco.percepcao.cursoMedido =
    Math.round((bloco.percepcao.derivaMax - bloco.percepcao.derivaMin) * 10) / 10;

  /* (b) REVERSIBILIDADE — 12 paradas na descida e as mesmas na subida, agora COM
     a espera da inércia (900ms para `scrub: 0.6`): o portão compara PONTOS, e
     lido antes disso o valor é o do caminho. */
  const pontos = Array.from({ length: 12 }, (_, i) => Math.round((altura - 900) * (i / 11)));
  const parar = async (y) => {
    await p.evaluate((alvo) => window.scrollTo(0, alvo), y);
    await p.waitForTimeout(900);
    return p.evaluate(LER);
  };
  const descida = [];
  for (const y of pontos) descida.push(await parar(y));
  const subida = [];
  for (const y of [...pontos].reverse()) subida.push(await parar(y));
  const porY = new Map(subida.map((l) => [l.y, l]));
  bloco.reversibilidade = descida
    .map((d) => {
      const s = porY.get(d.y);
      if (!s) return null;
      const dv = eixoY(d.bg);
      const sv = eixoY(s.bg);
      /* Tolerância de 1px: o mesmo `scrollTo` pode assentar um pixel diferente e a
         inércia do scrub não fecha em zero absoluto. */
      return { y: d.y, descendo: dv, subindo: sv, volta: Math.abs(dv - sv) <= 1, dirSubindo: s.dir };
    })
    .filter(Boolean);
  bloco.acusouCima = subida.some((l) => l.dir === 'cima');
  bloco.falhasDeVolta = bloco.reversibilidade.filter((r) => !r.volta).length;

  /* ── 4 e 5: o reveal da SIS-272 e o spotlight ──────────────────────────── */
  await p.evaluate(async () => {
    const passo = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += passo) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 140));
    }
  });
  await p.waitForTimeout(1200);
  bloco.reveal = await p.evaluate(() => {
    const nos = [...document.querySelectorAll('[data-reveal]')].map((el) => ({
      preset: el.dataset.reveal,
      acendeu: el.closest('[data-in]') !== null || el.hasAttribute('data-in'),
      opacity: Number(getComputedStyle(el).opacity),
      /* As duas versões da rota se excluem por `display: none`, e nó de versão
         escondida reporta opacidade 0 sem que isso seja falha nenhuma. Contar os
         dois como "invisível" faria a sonda acusar regressão em toda largura. */
      naArvore: el.offsetParent !== null,
    }));
    const vivos = nos.filter((n) => n.naArvore);
    return {
      total: nos.length,
      totalNaVersaoVisivel: vivos.length,
      acenderamTodos: vivos.every((n) => n.acendeu),
      nenhumInvisivel: vivos.every((n) => n.opacity > 0.99),
      piorOpacidade: vivos.length ? Math.min(...vivos.map((n) => n.opacity)) : null,
      /* O contador acende POR GESTO dentro do palco `sticky`; uma leitura parada
         pode pegá-lo entre dois gestos. Quem julga isso é
         `scripts/medir-reveal-eventos-sis272.mjs`, que é a sonda de origem. */
      escondidosPorVersao: nos.length - vivos.length,
      /* Os dois portões da SIS-272, mantidos: aquela issue deixou `#topo` e
         `#social` FORA do reveal de propósito (hero é LCP, `Social` tem mecanismo
         próprio). A malha nova não introduz nó marcado em nenhum dos dois. */
      semRevealNoTopo: document.querySelectorAll('#topo [data-reveal]').length === 0,
      semRevealNoSocial: document.querySelectorAll('#social [data-reveal]').length === 0,
    };
  });
  bloco.spotlight = await p.evaluate(() => {
    const palco = document.querySelector('.eventos-destaque-palco');
    const cartao = document.querySelector('.eventos-destaque-cartao h3');
    return {
      palcoSticky: palco ? getComputedStyle(palco).position === 'sticky' : null,
      /* A malha entra com `z-index: 0`; palco é 2 e o fio 3. Se a ordem virasse, a
         malha cobriria a cena — este é o risco real da mudança.
         O `z-index` é do ESCOPO, não da malha (a malha empilha dentro dele): ler
         no filho devolvia `auto` e a sonda anotava `null`. */
      zEscopo: getComputedStyle(
        document.querySelector('.eventos-cena-scrub, .eventos-faixa-scrub'),
      ).zIndex,
      zPalco: palco ? getComputedStyle(palco).zIndex : null,
      destaqueAtual: cartao?.textContent?.slice(0, 40) ?? null,
    };
  });
  /* A troca de destaque pela rolagem é o conteúdo da rota: mede-se que ela
     CONTINUA acontecendo, comparando o cartão em dois pontos da cena. */
  bloco.spotlight.trocaComARolagem = await p.evaluate(async () => {
    const ler = () =>
      document.querySelector('.eventos-destaque-cartao h3, .eventos-lista-item h3')
        ?.textContent ?? null;
    window.scrollTo(0, Math.round(document.body.scrollHeight * 0.25));
    await new Promise((r) => setTimeout(r, 900));
    const a = ler();
    window.scrollTo(0, Math.round(document.body.scrollHeight * 0.7));
    await new Promise((r) => setTimeout(r, 900));
    return { primeiro: a, segundo: ler(), mudou: a !== ler() };
  });

  /* ── Capturas: os dois extremos do percurso ────────────────────────────────
     Capturar o MESMO `scrollY` nos dois sentidos dá imagens IDÊNTICAS — e isso
     não é falha, é o efeito estar certo (o valor é função da posição). A prova de
     que sobe e desce é a tabela `reversibilidade`. O que a imagem mostra são os
     dois extremos que o gesto percorre. */
  bloco.capturas = [];
  const capturar = async (arquivo, alvoY) => {
    await p.evaluate((y) => window.scrollTo(0, y), alvoY);
    await p.waitForTimeout(1200);
    const leitura = await p.evaluate(LER);
    await p.screenshot({ path: `docs/capturas/${arquivo}` });
    bloco.capturas.push({ arquivo, ...leitura });
  };
  const faixaAlvo = bloco.percepcao.visivelY ?? [0, altura - 900];
  await capturar(`sis279-${largura}-descendo.png`, faixaAlvo[0] + 200);
  await capturar(`sis279-${largura}-subindo.png`, Math.max(0, faixaAlvo[1] - 200));

  /* Transbordo COM e SEM os escopos. O número absoluto não diz nada sozinho: a
     390 esta rota já transborda 1.315px por decorações `absolute` antigas e pelo
     `LI.eventos-lista-item`, e sem o par a sonda me faria atribuir isso à malha
     nova. O portão é a DIFERENÇA ser zero. */
  bloco.transbordo = await p.evaluate(() => {
    const com = document.documentElement.scrollWidth - window.innerWidth;
    const escopos = [...document.querySelectorAll('[data-scrub-nome]')];
    escopos.forEach((e) => (e.style.display = 'none'));
    const sem = document.documentElement.scrollWidth - window.innerWidth;
    escopos.forEach((e) => (e.style.display = ''));
    return {
      transbordoComAMalha: com,
      transbordoSemAMalha: sem,
      malhaAcrescentou: com - sem,
      alturaDocumento: document.body.scrollHeight,
      escoposVivos: [...document.querySelectorAll('[data-scrub-nome]')]
        .filter((el) => el.offsetParent !== null)
        .map((el) => el.dataset.scrubNome),
    };
  });

  resultado[largura] = bloco;
  await ctx.close();
}

/* ── 6: movimento reduzido nos dois canais ───────────────────────────────── */
const lerReduce = async (p) => {
  /* No meio da cena: é lá que, COM movimento, a deriva está longe do repouso —
     ler no topo daria «parado» de graça. */
  await p.evaluate(() => window.scrollTo(0, Math.round(document.body.scrollHeight * 0.5)));
  await p.waitForTimeout(1000);
  return p.evaluate(() => {
    const esc = document.querySelector('.eventos-cena-scrub');
    const malha = esc.querySelector('.eventos-malha-deriva');
    const bg = getComputedStyle(malha).backgroundPosition;
    const reveals = [...document.querySelectorAll('[data-reveal]')].map((el) =>
      Number(getComputedStyle(el).opacity),
    );
    return {
      atributoMotion: document.documentElement.getAttribute('data-motion'),
      bg,
      /* Repouso = a posição de BASE do padrão. Sem a regra da guarda vale
         `0% 0%`/`0px 0px`, não um deslocamento congelado. */
      semDeriva: /^(0%\s+0%|0px\s+0px)/.test(bg),
      malhaVisivel: Number(getComputedStyle(malha).opacity) >= 0.99,
      /* A propriedade CONTINUA publicada (o gatilho vive); o que não existe é
         consumidor. É isso que faz o canal do atributo funcionar sem este
         componente ler atributo nenhum em JS. */
      publicou: getComputedStyle(esc).getPropertyValue('--scrub-p').trim() !== '',
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

await navegador.close();
writeFileSync(SAIDA, JSON.stringify(resultado, null, 2));
const resumo = (l) => ({
  escopo: resultado[l].percepcao.escopo,
  derivaPxPor100px: resultado[l].percepcao.derivaPxPor100pxVisivel,
  cursoMedido: resultado[l].percepcao.cursoMedido,
  falhasDeVolta: resultado[l].falhasDeVolta,
  acusouCima: resultado[l].acusouCima,
  reveal: resultado[l].reveal,
  spotlight: resultado[l].spotlight,
  transbordo: resultado[l].transbordo,
});
console.log(SAIDA);
console.log(
  JSON.stringify(
    {
      1440: resumo(1440),
      390: resumo(390),
      reduceSistema: resultado.reduceSistema,
      reduceAtributo: resultado.reduceAtributo,
    },
    null,
    2,
  ),
);
