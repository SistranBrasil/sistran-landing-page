/**
 * SIS-277 — «/parceiros · tag da abertura vira carimbo-parcerias.png».
 *
 * `node scripts/medir-carimbo-parcerias-sis277.mjs [antes|depois]`  (`next dev` em :3000)
 *
 * O que cada critério da issue exige para virar número, e por que a sonda é
 * assim:
 *
 *  • «A tag textual some e o carimbo aparece» — são DOIS fatos, e um sem o outro
 *    passa por engano. Procura-se o TEXTO «Parceiros e Implementações» dentro da
 *    abertura fora do `h1` (a tag saiu de cena de verdade, e não só perdeu a
 *    classe `.eyebrow`) e mede-se a caixa da arte com `naturalWidth > 0` — um 404
 *    deixaria a abertura sem tag nenhuma, o que satisfaria metade do critério.
 *  • «Não dominar o h1» — a comparação é com a caixa e o corpo do título medidos
 *    no MESMO quadro, mais a altura da tag textual do "antes" como piso de
 *    referência. Sem o "antes" não existe a palavra "maior".
 *  • «Efeito de carimbo ao entrar» — não se mede por «existe uma animação»; a
 *    prova é a arte mudando de estado ENTRE quadros. Amostra-se `scale` e
 *    `opacity` computados numa rajada logo depois de o portão da rota liberar, e
 *    o portão importa: o `RouteLoadGate` cobre esta rota, então uma batida
 *    disparada na MONTAGEM aconteceria atrás do véu e ninguém a veria (é o
 *    defeito nomeado na SIS-243). Registra-se `liberadoEm` e o primeiro quadro
 *    amostrado para que a ordem fique escrita.
 *  • «Reduce OK, sem ficar invisível» — nos dois canais da casa (a media query e
 *    `data-motion="reduce"`, este último gravado em `localStorage` sob
 *    `sistran-motion-preference`, porque atributo posto à mão é reescrito pelo
 *    app). O que se lê é o ESTADO FINAL: `opacity: 1` e a caixa com a mesma
 *    altura do canal normal.
 *  • «h1 acessível intacto» — texto do `h1`, contagem de `h1` na página e o `alt`
 *    da arte. Dois `h1` ou um `alt` vazio aqui trocariam o nome da página por
 *    decoração.
 */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import { mkdir, writeFile } from 'node:fs/promises';

const BASE = 'http://localhost:3000';
const ROTA = '/parceiros-e-implementacoes';
const MOMENTO = process.argv[2] === 'depois' ? 'depois' : 'antes';
const LARGURAS = [1440, 1024];

await mkdir('docs/capturas', { recursive: true });
await mkdir('docs/medidas', { recursive: true });

const nav = await chromium.launch();
const res = { issue: 'SIS-277', momento: MOMENTO, rota: ROTA, erros: [], porLargura: {} };

const caixa = (n) => {
  if (!n) return null;
  const b = n.getBoundingClientRect();
  return {
    topo: Math.round(b.top + window.scrollY),
    esq: Math.round(b.left),
    w: Math.round(b.width * 10) / 10,
    h: Math.round(b.height * 10) / 10,
  };
};

const sonda = (p) =>
  p.evaluate(
    ({ fonteCaixa }) => {
      const cx = new Function(`return (${fonteCaixa})`)();
      const abertura = document.querySelector('#topo');
      if (!abertura) return null;
      const h1 = abertura.querySelector('h1');
      const tagTexto = abertura.querySelector('.eyebrow');
      const arte = abertura.querySelector('.carimbo-batida');
      const img = arte?.querySelector('img') ?? null;

      /* O texto da abertura FORA do h1 e da descrição: é aqui que a tag antiga
         apareceria mesmo sem a classe `.eyebrow`. */
      const textoForaDoH1 = Array.from(abertura.querySelectorAll('span, p'))
        .map((n) => (n.textContent || '').trim())
        .filter((t) => /Parceiros e Implementa/i.test(t));

      const eh1 = h1 ? getComputedStyle(h1) : null;
      return {
        tagTextual: tagTexto
          ? { texto: tagTexto.textContent.trim(), caixa: cx(tagTexto), fontSize: getComputedStyle(tagTexto).fontSize }
          : null,
        textoDaTagForaDoH1: textoForaDoH1,
        h1: h1
          ? {
              texto: h1.textContent.trim(),
              caixa: cx(h1),
              fontSize: eh1.fontSize,
              quantosH1NaPagina: document.querySelectorAll('h1').length,
            }
          : null,
        carimbo: arte
          ? {
              caixa: cx(arte),
              opacidade: getComputedStyle(arte).opacity,
              rotateComputado: getComputedStyle(arte).rotate,
              transform: getComputedStyle(arte).transform,
              img: img
                ? {
                    src: img.getAttribute('src'),
                    alt: img.getAttribute('alt'),
                    larguraNatural: img.naturalWidth,
                    alturaNatural: img.naturalHeight,
                    caixa: cx(img),
                  }
                : null,
            }
          : null,
        /* A guarda de vazamento horizontal: a arte é tombada, e tombo aumenta o
           retângulo envolvente. */
        rolagemHorizontal: {
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
          vaza: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        },
        motion: document.documentElement.dataset.motion ?? null,
        portaoLiberado: document.querySelector('[data-route-content]')?.dataset.routeLiberado ?? null,
      };
    },
    { fonteCaixa: caixa.toString() },
  );

for (const width of LARGURAS) {
  const ctx = await nav.newContext({ viewport: { width, height: 900 } });
  await ctx.addInitScript(() => localStorage.setItem('sistran-motion-preference-seen', '1'));
  const p = await ctx.newPage();
  p.on('console', (m) => { if (m.type() === 'error') res.erros.push(`${width}: ${m.text()}`); });
  p.on('response', (r) => {
    if (r.url().includes('carimbo-parcerias') && !r.ok()) res.erros.push(`asset ${r.status()} em ${r.url()}`);
  });

  /* A RAJADA. Instalada ANTES de a página carregar: assim que a arte existe,
     amostra-se `scale`/`opacity` a cada quadro por ~1,2s. É o único jeito de
     provar movimento sem confiar em "existe um tween" — e de provar que ele
     acontece DEPOIS de o véu do portão sair. */
  await p.addInitScript(() => {
    window.__sis277 = { amostras: [], liberadoEm: null, inicio: performance.now() };
    const marcarLiberado = () => {
      const no = document.querySelector('[data-route-content]');
      if (no?.dataset.routeLiberado === 'true' && window.__sis277.liberadoEm === null) {
        window.__sis277.liberadoEm = Math.round(performance.now() - window.__sis277.inicio);
      }
    };
    const quadro = () => {
      marcarLiberado();
      const a = document.querySelector('.carimbo-batida');
      /* 600 quadros, e não 90: a primeira medição a 1440 gastou as 90 amostras em
         5023 ms e o portão da rota só liberou em 5319 ms — a rajada terminava
         ANTES da batida e a leitura saía "nada se moveu". O teto agora cobre ~10 s
         de compilação de rota em dev, que é onde o portão demora. */
      if (a && window.__sis277.amostras.length < 600) {
        const e = getComputedStyle(a);
        const m = new DOMMatrixReadOnly(e.transform === 'none' ? '' : e.transform);
        window.__sis277.amostras.push({
          t: Math.round(performance.now() - window.__sis277.inicio),
          escala: Math.round(Math.hypot(m.a, m.b) * 1000) / 1000,
          giro: Math.round(Math.atan2(m.b, m.a) * (180 / Math.PI) * 10) / 10,
          opacidade: Math.round(Number(e.opacity) * 100) / 100,
          liberado: document.querySelector('[data-route-content]')?.dataset.routeLiberado ?? null,
        });
      }
      requestAnimationFrame(quadro);
    };
    requestAnimationFrame(quadro);
  });

  await p.goto(`${BASE}${ROTA}`, { waitUntil: 'networkidle' });
  await p.waitForSelector('[data-route-content][data-route-liberado="true"]', { timeout: 60000 }).catch(() => null);
  await p.waitForTimeout(2000);
  res.porLargura[width] = await sonda(p);
  res.porLargura[width].batida = await p.evaluate(() => {
    const s = window.__sis277;
    if (!s) return null;
    const a = s.amostras;
    return {
      liberadoEm: s.liberadoEm,
      quantasAmostras: a.length,
      primeira: a[0] ?? null,
      ultima: a.at(-1) ?? null,
      escalaMax: a.length ? Math.max(...a.map((x) => x.escala)) : null,
      escalaMin: a.length ? Math.min(...a.map((x) => x.escala)) : null,
      opacidadeMin: a.length ? Math.min(...a.map((x) => x.opacidade)) : null,
      giroMax: a.length ? Math.max(...a.map((x) => Math.abs(x.giro))) : null,
      /* Quantas amostras divergem da última: zero = nada se moveu. */
      quadrosEmMovimento: a.filter((x) => Math.abs(x.escala - (a.at(-1)?.escala ?? 1)) > 0.01).length,
      /* As amostras EM VOLTA da batida, não as do começo: o que interessa é a
         vizinhança dos quadros em que a escala difere do repouso. */
      amostrasDaBatida: (() => {
        const i = a.findIndex((x) => Math.abs(x.escala - 1) > 0.01);
        return i < 0 ? [] : a.slice(Math.max(0, i - 2), i + 10);
      })(),
    };
  });
  await p.screenshot({ path: `docs/capturas/sis277-abertura-${width}-${MOMENTO}.png` });
  await ctx.close();
}

/* ── Movimento reduzido, os dois canais ─────────────────────────────────────── */
res.reduce = {};
for (const canal of ['mediaQuery', 'atributo']) {
  const ctx = await nav.newContext({
    viewport: { width: 1440, height: 900 },
    ...(canal === 'mediaQuery' ? { reducedMotion: 'reduce' } : {}),
  });
  await ctx.addInitScript(() => localStorage.setItem('sistran-motion-preference-seen', '1'));
  if (canal === 'atributo') {
    /* Atributo posto à mão em `addInitScript` NÃO sobrevive — o app reescreve
       `data-motion` a partir da preferência gravada. A preferência é o canal. */
    await ctx.addInitScript(() => localStorage.setItem('sistran-motion-preference', 'reduce'));
  }
  const p = await ctx.newPage();
  await p.goto(`${BASE}${ROTA}`, { waitUntil: 'networkidle' });
  await p.waitForSelector('[data-route-content][data-route-liberado="true"]', { timeout: 60000 }).catch(() => null);
  await p.waitForTimeout(1200);
  res.reduce[canal] = await sonda(p);
  if (canal === 'atributo') await p.screenshot({ path: `docs/capturas/sis277-abertura-1440-reduce-${MOMENTO}.png` });
  await ctx.close();
}

await nav.close();
await writeFile(`docs/medidas/sis277-${MOMENTO}.json`, `${JSON.stringify(res, null, 1)}\n`);
console.log(JSON.stringify(res, null, 1));
