/**
 * SIS-252 — sonda dos DOZE cartões de ENVIRONMENT e GOVERNANCE em `/esg`.
 *
 * A issue inverte o sentido da SIS-237. Lá a superfície DESCEU para navy fundo
 * (`rgba(9,70,121)`) porque era o único jeito de o `text-white/85` passar de 4,5:1;
 * aqui ela sobe para azul bem clarinho, o que joga o branco fora do piso por
 * construção — e é por isso que o item 3 troca a tinta por navy. Nada disso é
 * julgável no CSS: os números da SIS-237 (1,46:1 de superfície contra faixa, ΔRGB
 * 43,9, legenda 6,40:1 no pior dos doze, hover ΔRGB 24,1/25,5 e 5,56:1) são o piso
 * que o esquema claro tem de bater, e todos eles foram lidos no raster.
 *
 * O QUE ELA MEDE, e por que cada coisa:
 *
 *   1. SUPERFÍCIE vs FAIXA — a cor composta do cartão contra a cor composta da
 *      `.esg-faixa-azul` na mesma altura. É o item 1 ("cards azul bem clarinho no
 *      repouso"): se a superfície não se separar da faixa, o cartão desaparece.
 *      Dois pontos por cartão, e não um: o `.glass-card::after` é um brilho ciano
 *      desfocado ancorado em `top: -40%; left: -20%`, que ACENDE no hover. O ponto
 *      de cima cai dentro dele e o de baixo não, então medir só um lugar atribuiria
 *      ao banho de hover o que é o halo — ou o contrário.
 *   2. TROCA DE COR NO HOVER — distância RGB euclidiana entre repouso e hover nos
 *      mesmos dois pontos. É o item 2 ("óbvia à vista, não só sombra"), e a régua é
 *      comparativa: a SIS-237 REPROVOU ΔRGB 10,7 e aceitou 24,1.
 *   3. CONTRASTE DO TEXTO, repouso e hover — método de
 *      `docs/medidas/COMO-MEDIR-CONTRASTE.md`, máscara de miolo de letra com as
 *      quatro fotos (tinta transparente = fundo puro; branca e preta = máscara;
 *      tinta real = a cor que o compositor entrega). Sem a quarta foto não há
 *      número honesto: as tintas desta página passam por alfa, e ler
 *      `getComputedStyle().color` já produziu razão impossível nesta base.
 *      Dois vereditos por texto — miolo (tinta cheia) e franja (pior pixel) —
 *      porque o pior pixel de tipo de 16px é quase sempre antialiasing. O limiar
 *      que separa os dois é RELATIVO à foto, e o porquê está junto do código.
 *   4. MOVIMENTO — `transform` computado no hover, que é como se confirma que o
 *      hover REALMENTE pegou. Sonda que injeta estilo e tira foto sem checar isso
 *      mede o repouso duas vezes e chama uma delas de hover.
 *
 * POR QUE NENHUMA FOTO É DE ELEMENTO, e sim recorte de janela: ver o comentário de
 * `recorte()`. Em resumo — `element.screenshot()` rola para enquadrar, e rolar
 * desfaz o hover que a foto deveria registrar.
 *
 * A JANELA É 1440, a que a issue nomeia — mas com 2200px de altura, e isto é
 * escolha de método, não descuido: `element.screenshot()` de nó fora do recorte
 * devolve quadro vazio (zero pixel de letra, nenhum veredito), e a grade de três
 * colunas × duas linhas não cabe em 900px. As CAPTURAS de aceite saem em 1440x900,
 * em passada própria no fim (`--capturas`).
 *
 * `--modo=antes|depois` só muda o nome dos arquivos.
 */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import { mkdir, readFile, unlink, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const URL_BASE = process.env.URL_BASE ?? 'http://localhost:3000';
const SAIDA = 'docs/medidas/esg-cartoes-sis252';
const CAPTURAS = 'docs/capturas';
const modo = (process.argv.find((a) => a.startsWith('--modo=')) ?? '--modo=antes').split('=')[1];
await mkdir(SAIDA, { recursive: true });
await mkdir(CAPTURAS, { recursive: true });

const luminancia = ({ r, g, b }) => {
  const c = [r, g, b]
    .map((v) => v / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const razao = (a, b) => {
  const [x, y] = [luminancia(a) + 0.05, luminancia(b) + 0.05].sort((p, q) => q - p);
  return x / y;
};
const dRGB = (a, b) => Math.hypot(a.r - b.r, a.g - b.g, a.b - b.b);
const rgb = (p) => (p ? `rgb(${p.r},${p.g},${p.b})` : '—');
const n1 = (v) => (v == null ? null : Math.round(v * 10) / 10);
const n2 = (v) => (v == null ? null : Math.round(v * 100) / 100);

/* As duas grades. O seletor do cartão é o MESMO nos dois lados — é isso que o
   critério "mesmo vocabulário visual nas duas grades" quer dizer, e é o que esta
   sonda confirma lendo os doze pelo mesmo caminho. As seções não têm `id`; o
   `aria-labelledby` é o que já existe e não precisa de marcação nova. */
const GRADES = [
  {
    nome: 'ENVIRONMENT',
    secao: 'section[aria-labelledby="esg-environment"]',
    textos: [['legenda', 'p']],
  },
  {
    nome: 'GOVERNANCE',
    secao: 'section[aria-labelledby="esg-governance"]',
    textos: [
      ['termo', 'dt span'],
      ['detalhe', 'dd'],
    ],
  },
];

const ler = async (p) =>
  sharp(await readFile(p)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

/** Pixel em (x,y) de um buffer raw. */
const px = ({ data, info }, x, y) => {
  const i = (y * info.width + x) * info.channels;
  return { r: data[i], g: data[i + 1], b: data[i + 2] };
};

/** Mediana por canal de um quadrado — a faixa tem a `.grade-tecnica` por cima
    (linha de 1px a cada 64px), e um pixel único pode cair exatamente nela. */
const medianaPatch = (buf, x0, y0, lado = 14) => {
  const r = [];
  const g = [];
  const b = [];
  for (let y = y0; y < Math.min(y0 + lado, buf.info.height); y += 1) {
    for (let x = x0; x < Math.min(x0 + lado, buf.info.width); x += 1) {
      const p = px(buf, x, y);
      r.push(p.r);
      g.push(p.g);
      b.push(p.b);
    }
  }
  const m = (a) => a.sort((u, v) => u - v)[Math.floor(a.length / 2)];
  return { r: m(r), g: m(g), b: m(b) };
};

const navegador = await chromium.launch();
const contexto = await navegador.newContext({
  viewport: { width: 1440, height: 2200 },
  deviceScaleFactor: 1,
  reducedMotion: 'no-preference',
});
/* Dispensa o diálogo «Preferências de movimento» antes do primeiro quadro. Ele
   monta depois do `networkidle` e prende a rolagem — sondas anteriores desta base
   saíram com o painel escuro cobrindo o alvo. */
await contexto.addInitScript(() => {
  localStorage.setItem('sistran-motion-preference-seen', '1');
});
const pagina = await contexto.newPage();
await pagina.goto(`${URL_BASE}/esg`, { waitUntil: 'domcontentloaded', timeout: 180_000 });
await pagina.waitForSelector('.esg-superficie', { timeout: 180_000 });
await pagina.evaluate(() => document.fonts.ready);
await pagina.addStyleTag({
  content: `nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button]{display:none!important}
    header{display:none!important}`,
});
/* PARA A FLUTUAÇÃO (SIS-237) durante a medição, e não é para "limpar" o quadro: o
   cartão percorre ±7px em `transform`, e as quatro fotos de um mesmo texto sairiam
   de posições diferentes — a máscara de letra deixaria de casar pixel a pixel e o
   veredito viria de coordenadas que não são as mesmas. A cor não depende disto; o
   método depende. */
await pagina.addStyleTag({
  content: `.esg-cartao-flutua{animation-play-state:paused!important}`,
});
await pagina.waitForTimeout(800);

/** Foto por RECORTE DE JANELA, e nunca `locator.screenshot()`.
    Medido: a passada `antes` reprovou seis textos com «sem pixel cheio» — zero
    pixel de miolo — e o motivo não era contraste. `element.screenshot()` chama
    `scrollIntoViewIfNeeded`; com o cartão em hover ele já subiu 12px e cresceu 2%,
    a rolagem se ajusta, o ponteiro deixa de estar sobre o cartão, o hover cai e o
    cartão volta ao lugar. As quatro fotos do mesmo texto saíam de posições
    diferentes, a máscara de letra não casava pixel a pixel e o número de pixels
    caía de 1022 para 456. `page.screenshot({ clip })` não rola nada, e o `clip` é
    em coordenadas de janela — as mesmas de `getBoundingClientRect`. */
const recorte = async (caixa, saida) => {
  await pagina.screenshot({ path: saida, clip: caixa });
};

const pintar = async (sel, cor) => {
  await pagina.evaluate(
    ([s, c]) => {
      document.querySelector('#sis252-tinta')?.remove();
      if (!c) return;
      const st = document.createElement('style');
      st.id = 'sis252-tinta';
      st.textContent = `${s}, ${s} * { color: ${c} !important; -webkit-text-fill-color: ${c} !important; }`;
      document.head.append(st);
    },
    [sel, cor],
  );
  await pagina.waitForTimeout(120);
};

/** Esconde TODA a tinta do cartão (não só a do texto medido) — a armadilha 1 do
    documento de método: ocultar apenas o elemento medido deixa o irmão desenhado
    dentro do mesmo retângulo, e a sonda devolve a cor do vizinho como se fosse o
    fundo. */
const apagarTinta = async (selCartao, ligar) => {
  await pagina.evaluate(
    ([s, on]) => {
      document.querySelector('#sis252-apagar')?.remove();
      if (!on) return;
      const st = document.createElement('style');
      st.id = 'sis252-apagar';
      st.textContent = `${s} p, ${s} dd, ${s} dt, ${s} span { color: transparent !important; -webkit-text-fill-color: transparent !important; }`;
      document.head.append(st);
    },
    [selCartao, ligar],
  );
  await pagina.waitForTimeout(120);
};

const relatorio = { modo, quando: new Date().toISOString(), janela: '1440x2200', grades: [] };

for (const { nome, secao, textos } of GRADES) {
  const cartoes = pagina.locator(`${secao} .esg-superficie`);
  const total = await cartoes.count();
  const grade = { nome, cartoes: total, itens: [] };

  /* Traz a grade para o recorte ANTES de qualquer foto, e sem `scrollIntoView`: a
     rota usa Lenis, que intercepta o método (apuração da SIS-151). */
  await pagina.evaluate((s) => {
    const el = document.querySelector(s);
    const c = el.getBoundingClientRect();
    window.scrollTo({ top: Math.max(0, window.scrollY + c.top - 40), behavior: 'instant' });
  }, secao);
  await pagina.waitForTimeout(700);

  for (let i = 0; i < total; i += 1) {
    const cartao = cartoes.nth(i);
    const item = { i, estados: {} };

    for (const estado of ['repouso', 'hover']) {
      /* O hover é o ponteiro de verdade. Não há como forçar `:hover` por classe, e
         a issue pede a cor DESTE estado nos doze. A confirmação vem do `transform`
         computado logo abaixo. */
      if (estado === 'hover') {
        await cartao.hover({ timeout: 15_000 });
        await pagina.waitForTimeout(600);
      } else {
        await pagina.mouse.move(4, 4);
        await pagina.waitForTimeout(600);
      }

      /* As caixas saem UMA VEZ por estado, antes de qualquer foto, e todas as fotos
         do estado usam esse mesmo recorte. Ver "POR QUE NENHUMA FOTO É DE
         ELEMENTO", no topo do arquivo. */
      const info = await cartao.evaluate((el) => {
        const cs = getComputedStyle(el);
        const c = el.getBoundingClientRect();
        const sec = el.closest('section').getBoundingClientRect();
        const cx = (r) => ({
          x: Math.round(r.x),
          y: Math.round(r.y),
          width: Math.round(r.width),
          height: Math.round(r.height),
        });
        const textos = {};
        for (const [rot, sel] of [
          ['legenda', 'p'],
          ['termo', 'dt span'],
          ['detalhe', 'dd'],
        ]) {
          const n = el.querySelector(sel);
          if (n) textos[rot] = cx(n.getBoundingClientRect());
        }
        return {
          transform: cs.transform,
          w: Math.round(c.width),
          h: Math.round(c.height),
          caixa: cx(c),
          /* A faixa na MESMA ALTURA do centro do cartão, à esquerda do
             `container-lp` — 24px da borda da seção, fora de qualquer cartão. */
          faixaCaixa: { x: Math.round(sec.x) + 24, y: Math.round(c.y + c.height / 2), width: 14, height: 14 },
          textosCaixa: textos,
        };
      });

      /* ── 1 e 2: superfície ── as duas fotos saem com a tinta do cartão apagada,
         para o pixel lido ser fundo e não letra. */
      await apagarTinta(`${secao} .esg-superficie`, true);
      const fCartao = `${CAPTURAS}/tmp-sis252-${nome}-${i}-${estado}-cartao.png`;
      await recorte(info.caixa, fCartao);
      const bufCartao = await ler(fCartao);
      /* Dois pontos na COLUNA CENTRAL, dentro do `p-7` (28px): acima do disco e
         abaixo do texto. Centro em X para escapar do arredondamento das quinas. */
      const alto = medianaPatch(bufCartao, Math.round(info.w / 2) - 7, 6, 12);
      const baixo = medianaPatch(bufCartao, Math.round(info.w / 2) - 7, info.h - 18, 12);
      await unlink(fCartao);

      /* A faixa, na mesma altura, à esquerda do `container-lp`. */
      const fSecao = `${CAPTURAS}/tmp-sis252-${nome}-${i}-${estado}-faixa.png`;
      await recorte(info.faixaCaixa, fSecao);
      const bufSecao = await ler(fSecao);
      const faixa = medianaPatch(bufSecao, 0, 0, 14);
      await unlink(fSecao);
      await apagarTinta(`${secao} .esg-superficie`, false);

      /* ── 3: contraste dos textos ── */
      const medidos = [];
      for (const [rotulo, subSel] of textos) {
        const caixa = info.textosCaixa[rotulo];
        if (!caixa) continue;
        const base = `${CAPTURAS}/tmp-sis252-${nome}-${i}-${estado}-${rotulo}`;
        const foto = async (cor, nomeArq) => {
          await pintar(`${secao} .esg-superficie ${subSel}`, cor);
          await recorte(caixa, `${base}-${nomeArq}.png`);
        };
        await foto('transparent', 'fundo');
        await foto('#fff', 'branco');
        await foto('#000', 'preto');
        await pintar(`${secao} .esg-superficie ${subSel}`, null);
        await recorte(caixa, `${base}-tinta.png`);

        const fundo = await ler(`${base}-fundo.png`);
        const branco = await ler(`${base}-branco.png`);
        const preto = await ler(`${base}-preto.png`);
        const real = await ler(`${base}-tinta.png`);
        const { width, height, channels } = fundo.info;
        /* ⚠️ O LIMIAR DA MÁSCARA É RELATIVO, e a passada `antes` é quem obrigou a
           isso. Com limiar fixo (250 para o miolo, como nas sondas de faixa clara),
           o hover devolvia «sem pixel cheio» — ZERO pixel de tinta cheia — em seis
           dos doze cartões, e a leitura óbvia («o hover reprova») estava errada. A
           causa é o `scale(1.02)` do próprio hover: o cartão passa a ser composto
           numa camada reamostrada, então TODO pixel de letra vira cobertura
           parcial e nenhum chega a divergir 250. Não é contraste, é raster.
           O limiar sai então da própria foto: `difMax` é o pixel mais cheio que
           existe naquele recorte, o miolo é 92% dele e a franja metade. Assim o
           mesmo código serve o texto nítido do repouso e o texto reamostrado do
           hover, sem inventar aprovação para nenhum dos dois. */
        let difMax = 0;
        for (let k = 0; k < width * height * channels; k += channels) {
          const d = Math.min(
            branco.data[k] - preto.data[k],
            branco.data[k + 1] - preto.data[k + 1],
            branco.data[k + 2] - preto.data[k + 2],
          );
          if (d > difMax) difMax = d;
        }
        const limiarMiolo = Math.max(200, Math.round(difMax * 0.92));
        const limiarFranja = Math.max(60, Math.round(difMax * 0.5));
        let pior = { razao: Infinity };
        let miolo = { razao: Infinity };
        let nFranja = 0;
        let nMiolo = 0;
        for (let y = 0; y < height; y += 1) {
          for (let x = 0; x < width; x += 1) {
            const k = (y * width + x) * channels;
            const dif = Math.min(
              branco.data[k] - preto.data[k],
              branco.data[k + 1] - preto.data[k + 1],
              branco.data[k + 2] - preto.data[k + 2],
            );
            if (dif < limiarFranja) continue;
            nFranja += 1;
            const bg = { r: fundo.data[k], g: fundo.data[k + 1], b: fundo.data[k + 2] };
            const tinta = { r: real.data[k], g: real.data[k + 1], b: real.data[k + 2] };
            const r = razao(tinta, bg);
            if (r < pior.razao) pior = { razao: r, bg, tinta, x, y };
            if (dif >= limiarMiolo) {
              nMiolo += 1;
              if (r < miolo.razao) miolo = { razao: r, bg, tinta };
            }
          }
        }
        for (const s of ['fundo', 'branco', 'preto', 'tinta']) await unlink(`${base}-${s}.png`);
        medidos.push({
          rotulo,
          difMax,
          limiarMiolo,
          limiarFranja,
          miolo: miolo.razao === Infinity ? null : n2(miolo.razao),
          mioloTinta: rgb(miolo.tinta),
          mioloFundo: rgb(miolo.bg),
          franja: pior.razao === Infinity ? null : n2(pior.razao),
          pixels: { miolo: nMiolo, franja: nFranja },
          passa: miolo.razao !== Infinity && miolo.razao >= 4.5,
        });
      }

      /* ⚠️ O HOVER É RECONFERIDO DEPOIS DAS FOTOS, não só antes. Ele se perde por
         motivos que não aparecem no código (o cartão sobe 12px e cresce 2%, então o
         ponteiro parado pode acabar fora dele), e uma foto tirada com o hover já
         desfeito entra na conta como se fosse hover. */
      const transformFinal = await cartao.evaluate((el) => getComputedStyle(el).transform);
      if (transformFinal !== info.transform) {
        throw new Error(
          `${nome} #${i} ${estado}: o estado mudou DURANTE as fotos (${info.transform} → ${transformFinal}) — os números sairiam de dois estados diferentes.`,
        );
      }

      item.estados[estado] = {
        transform: info.transform,
        cartao: `${info.w}x${info.h}`,
        alto,
        baixo,
        faixa,
        razaoAltoFaixa: n2(razao(alto, faixa)),
        razaoBaixoFaixa: n2(razao(baixo, faixa)),
        dAltoFaixa: n1(dRGB(alto, faixa)),
        dBaixoFaixa: n1(dRGB(baixo, faixa)),
        textos: medidos,
      };
    }
    const r = item.estados.repouso;
    const h = item.estados.hover;
    item.trocaHover = {
      dAlto: n1(dRGB(r.alto, h.alto)),
      dBaixo: n1(dRGB(r.baixo, h.baixo)),
      hoverPegou: h.transform !== r.transform,
    };
    grade.itens.push(item);

    console.log(
      `\n${nome} #${i}  repouso alto=${rgb(r.alto)} baixo=${rgb(r.baixo)} · faixa=${rgb(r.faixa)}` +
        `\n   superfície vs faixa: ${r.razaoAltoFaixa}:1 (ΔRGB ${r.dAltoFaixa}) topo · ${r.razaoBaixoFaixa}:1 (ΔRGB ${r.dBaixoFaixa}) base` +
        `\n   hover alto=${rgb(h.alto)} baixo=${rgb(h.baixo)} · troca ΔRGB ${item.trocaHover.dAlto} topo / ${item.trocaHover.dBaixo} base` +
        `\n   hover pegou: ${item.trocaHover.hoverPegou ? `sim (${h.transform})` : '⛔ NÃO — número de hover é repouso'}`,
    );
    for (const estado of ['repouso', 'hover']) {
      for (const t of item.estados[estado].textos) {
        console.log(
          `   ${estado} ${t.rotulo}: miolo ${t.miolo ?? 'sem pixel cheio'}:1 (tinta ${t.mioloTinta} sobre ${t.mioloFundo}) · franja ${t.franja}:1 · ${t.pixels.miolo}/${t.pixels.franja} px (difMax ${t.difMax}) · ${t.passa ? 'OK' : 'REPROVA'}`,
        );
      }
    }
  }
  relatorio.grades.push(grade);
}

await pagina.mouse.move(4, 4);
await contexto.close();

/* ── CAPTURAS DE ACEITE, na janela que a issue nomeia ── */
const ctx2 = await navegador.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
  reducedMotion: 'no-preference',
});
await ctx2.addInitScript(() => {
  localStorage.setItem('sistran-motion-preference-seen', '1');
});
const p2 = await ctx2.newPage();
await p2.goto(`${URL_BASE}/esg`, { waitUntil: 'domcontentloaded', timeout: 180_000 });
await p2.waitForSelector('.esg-superficie', { timeout: 180_000 });
await p2.evaluate(() => document.fonts.ready);
await p2.addStyleTag({
  content: `nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button]{display:none!important}`,
});
await p2.addStyleTag({ content: `.esg-cartao-flutua{animation-play-state:paused!important}` });
for (const { nome, secao } of GRADES) {
  await p2.evaluate((s) => {
    const c = document.querySelector(s).getBoundingClientRect();
    window.scrollTo({ top: Math.max(0, window.scrollY + c.top - 20), behavior: 'instant' });
  }, secao);
  await p2.waitForTimeout(900);
  const chave = nome.toLowerCase();
  await p2.screenshot({ path: `${CAPTURAS}/sis252-${chave}-1440-repouso-${modo}.png` });
  /* O hover da captura é no 1º cartão: é o que mostra repouso e hover LADO A LADO
     no mesmo quadro, que é o que torna a "troca óbvia à vista" conferível por olho
     e não só pelo ΔRGB. */
  await p2.locator(`${secao} .esg-superficie`).first().hover({ timeout: 15_000 });
  await p2.waitForTimeout(700);
  await p2.screenshot({ path: `${CAPTURAS}/sis252-${chave}-1440-hover-${modo}.png` });
  await p2.mouse.move(4, 4);
}
await ctx2.close();
await navegador.close();

await writeFile(`${SAIDA}/${modo}.json`, JSON.stringify(relatorio, null, 2));
console.log(`\n→ ${SAIDA}/${modo}.json`);
