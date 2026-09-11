/**
 * SIS-215 — critério (5): "contraste do texto na cena (título/lead sobre os trechos
 * claros) segue AA", depois de a superfície de `/eventos-inovacao` passar a ser
 * CLARA de ponta a ponta (antes as duas pontas eram navy).
 *
 * Método: o da casa, `docs/medidas/COMO-MEDIR-CONTRASTE.md` §7 — a letra isolada
 * pela diferença A−B entre duas abas, uma com a tinta e outra com a tinta apagada.
 * Sai o par `razao` (corpo do glifo, cobertura ≥ 0,85 — é quem decide) e
 * `rasterPior` (pior pixel, com a franja de antialiasing dentro). Piso 3:1 para
 * texto grande (≥24px, ou ≥18,66px com peso ≥700) e 4,5:1 no resto.
 *
 * ── POR QUE MEDIR EM TRÊS PONTOS DO PERCURSO, E NÃO UM ─────────────────────────
 * O que esta issue mexeu foi o FUNDO, e o fundo desta cena varia ao longo dela: o
 * degradê vai de `#eaf2fb` no topo a `#cfe7f7` na base, passando por `#f6fafd` no
 * miolo. O palco é `sticky` e mede uma tela, então o MESMO texto é lido sobre as
 * três cores conforme se rola. Medir só no miolo (o mais claro, e portanto o mais
 * fácil) provaria o caso melhor e esconderia o pior — que é o fecho `#cfe7f7`.
 *
 * ── A ARMADILHA JÁ MEDIDA NESTA ISSUE ──────────────────────────────────────────
 * Quem diz qual dos quinze eventos está no cartão é um `IntersectionObserver` (ver
 * o cabeçalho de `EventsSpotlight.tsx`), e ele não observa quadros que não
 * aconteceram: num `scrollTo` instantâneo até o fim do percurso o contador fica em
 * `01 / 15`. Aqui isso importa duas vezes — o texto medido seria o do evento errado
 * e, pior, as duas abas poderiam parar em eventos DIFERENTES, e aí a diferença A−B
 * pegaria dois textos distintos em vez de uma letra. Daí a rolagem em degraus e a
 * conferência de que as duas abas marcam o mesmo contador.
 *
 * Ferramenta de bancada; nada disso entra no bundle.
 *   node scripts/medir-contraste-cena-eventos-sis215.mjs
 *   LARGURAS=390 node scripts/medir-contraste-cena-eventos-sis215.mjs
 */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import sharp from 'sharp';

const BASE = process.env.BASE_URL ?? 'http://localhost:3000';
const LARGURAS = process.env.LARGURAS ? process.env.LARGURAS.split(',').map(Number) : [1440, 390];
const ALTURA = 900;
/* Borda, início, miolo e fim do percurso: as cores do degradê. A fração 0 existe
   por causa do mobile — o cabeçalho da `.eventos-lista` fica nos primeiros pixels do
   bloco, e a 0,02 de um bloco de 6.578px ele já saiu da tela. */
const FRACOES = [0, 0.02, 0.5, 0.97];
const CORPO = 0.85;
const MIUDO = 16;
const DELTA_ARTEFATO = 1.0;

const lin = (c) => {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};
const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const razao = (a, b) => {
  const [x, y] = [lum(a), lum(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};
const compor = (fg, a, bg) => fg.map((c, i) => Math.round(c * a + bg[i] * (1 - a)));

const ALVOS_DESKTOP = {
  sobretitulo: '.eventos-destaque-sobretitulo',
  titulo: '.eventos-destaque-titulo',
  'contador-numero': '.eventos-destaque-contador-numero',
  'contador-total': '.eventos-destaque-contador-total',
  'contador-rotulo': '.eventos-destaque-contador-rotulo',
  /* O lead do evento mora no cartão BRANCO, não na superfície — entra na medição
     porque é ele o "lead" que o critério nomeia, e porque o cartão é translúcido em
     parte, então o fundo dele acompanha a superfície de baixo. */
  'cartao-texto': '.eventos-destaque-cartao-texto',
};
const ALVOS_MOBILE = {
  sobretitulo: '.eventos-lista-cabecalho .eventos-destaque-sobretitulo',
  titulo: '.eventos-lista-cabecalho .eventos-destaque-titulo',
  'item-texto': '.eventos-lista-item .eventos-destaque-cartao-texto',
};

const LEVANTAR = (alvos) => {
  const corDe = (bruto) => bruto.match(/-?[\d.]+/g).map(Number);
  const fora = {};
  for (const [id, seletor] of Object.entries(alvos)) {
    /* O PRIMEIRO VISÍVEL, e não o primeiro do DOM: no mobile os quinze itens da lista
       usam a mesma classe, e `querySelector` devolveria sempre o item 1 — que está
       fora da tela em qualquer ponto do percurso menos o começo, e aí o alvo saía
       como "ausente" em vez de medido. */
    const e = [...document.querySelectorAll(seletor)].find((n) => {
      const r = n.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < window.innerHeight;
    });
    if (!e) {
      fora[id] = null;
      continue;
    }
    const c = getComputedStyle(e);
    const n = corDe(c.webkitTextFillColor || c.color);
    let alfa = n.length > 3 ? n[3] : 1;
    for (let p = e; p; p = p.parentElement) {
      const o = Number(getComputedStyle(p).opacity);
      if (!Number.isNaN(o)) alfa *= o;
    }
    const r = document.createRange();
    r.selectNodeContents(e);
    const caixas = [...r.getClientRects()]
      .filter((b) => b.width > 0 && b.height > 0 && b.bottom > 0 && b.top < window.innerHeight)
      .map((b) => ({
        x: Math.floor(b.left),
        y: Math.floor(b.top),
        w: Math.ceil(b.width) + 1,
        h: Math.ceil(b.height) + 1,
      }));
    fora[id] = caixas.length
      ? {
          tinta: n.slice(0, 3),
          alfa: Math.round(alfa * 1000) / 1000,
          px: Math.round(parseFloat(c.fontSize) * 100) / 100,
          peso: c.fontWeight,
          caixas,
        }
      : null;
  }
  return fora;
};

/* Apaga a tinta da CENA inteira (palco e lista), e não só do alvo: um glifo vizinho
   que sobrevivesse entraria no recorte como se fosse fundo escuro. */
const APAGAR = () => {
  const raizes = document.querySelectorAll('.eventos-destaque, .eventos-lista');
  let teimosos = 0;
  for (const raiz of raizes) {
    for (const f of [raiz, ...raiz.querySelectorAll('*')]) {
      const a = getComputedStyle(f);
      if (a.webkitBackgroundClip === 'text' || a.backgroundClip === 'text')
        f.style.setProperty('background-image', 'none', 'important');
      f.style.setProperty('color', 'transparent', 'important');
      f.style.setProperty('-webkit-text-fill-color', 'transparent', 'important');
      f.style.setProperty('fill', 'transparent', 'important');
    }
    teimosos += [...raiz.querySelectorAll('*')].filter((f) => {
      const a = getComputedStyle(f);
      return (a.webkitTextFillColor || a.color).replace(/\s/g, '') !== 'rgba(0,0,0,0)';
    }).length;
  }
  return teimosos;
};

const estabilizar = async (pagina, tentativas = 12) => {
  const { width } = pagina.viewportSize();
  const recorte = { x: 0, y: 0, width: Math.min(900, width), height: ALTURA };
  let anterior = null;
  for (let i = 0; i < tentativas; i += 1) {
    const agora = await pagina.screenshot({ clip: recorte });
    if (anterior && anterior.equals(agora)) return true;
    anterior = agora;
    await new Promise((res) => setTimeout(res, 350));
  }
  return false;
};

const preparar = async (navegador, largura, apagar) => {
  const pagina = await navegador.newPage({ viewport: { width: largura, height: ALTURA } });
  await pagina.addInitScript(() => {
    localStorage.setItem('sistran-motion-preference-seen', '1');
  });
  await pagina.goto(`${BASE}/eventos-inovacao`, {
    waitUntil: 'domcontentloaded',
    timeout: 180_000,
  });
  const alvo = largura >= 1024 ? '.eventos-destaque' : '.eventos-lista';
  await pagina.waitForSelector(alvo, { timeout: 180_000 });
  await pagina.addStyleTag({
    content:
      'header.fixed,nav.fixed{display:none!important}' +
      'nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button],[class*=motion-banner],[class*=motion-dialog]{display:none!important}' +
      /* ⚠️ SEM ISTO A MEDIÇÃO NÃO ACONTECE, e o sintoma engana: as três posições de
         1440 voltavam como "cena não assentou" mesmo com as duas abas paradas no
         MESMO pixel e no mesmo evento. A causa é a flutuação perpétua das miniaturas
         (`animation: eventos-flutua`, `events-spotlight.css:621`): nenhum par de
         capturas consecutivas é igual, porque as fotos das bordas nunca param.
         `animation: none` faz cada elemento assentar no quadro de 0% do
         `@keyframes` — o MESMO nas duas abas, o que é justamente o que a diferença
         A−B exige. Isso não afrouxa nada do que se mede aqui: o alvo é tinta de
         texto contra a superfície do degradê, e o degradê é `background`, não
         animação. */
      '.eventos-destaque *,.eventos-lista *{animation:none!important}',
  });
  await pagina.waitForTimeout(1200);
  const caixa = await pagina.evaluate((sel) => {
    const e = document.querySelector(sel);
    const r = e.getBoundingClientRect();
    return { topo: Math.round(r.top + window.scrollY), altura: Math.round(r.height) };
  }, alvo);
  const teimosos = apagar ? await pagina.evaluate(APAGAR) : 0;
  return { pagina, caixa, teimosos };
};

/* Em DEGRAUS, pelo motivo do cabeçalho. Sempre partindo do topo do percurso, para
   que as duas abas percorram a mesma trilha e o observador veja a mesma sequência. */
const irPara = async (pagina, caixa, fracao) => {
  const destino = Math.max(
    0,
    Math.round(caixa.topo + fracao * Math.max(0, caixa.altura - ALTURA)),
  );
  await pagina.evaluate(([t]) => {
    window.scrollTo({ top: t, behavior: 'auto' });
    window.__lenis?.scrollTo(t, { immediate: true, force: true });
  }, [Math.max(0, caixa.topo - ALTURA)]);
  await pagina.waitForTimeout(220);
  const partida = await pagina.evaluate(() => Math.round(window.scrollY));
  const degraus = 12;
  for (let d = 1; d <= degraus; d += 1) {
    const t = Math.round(partida + ((destino - partida) * d) / degraus);
    await pagina.evaluate(([v]) => {
      window.scrollTo({ top: v, behavior: 'auto' });
      window.__lenis?.scrollTo(v, { immediate: true, force: true });
    }, [t]);
    await pagina.waitForTimeout(170);
  }
  await pagina.waitForTimeout(600);
  return {
    pedido: destino,
    real: await pagina.evaluate(() => Math.round(window.scrollY)),
    contador: await pagina
      .locator('.eventos-destaque-contador-numero, .eventos-lista-cabecalho')
      .first()
      .textContent()
      .catch(() => null),
  };
};

const navegador = await chromium.launch();
const saida = {};

for (const largura of LARGURAS) {
  const ALVOS = largura >= 1024 ? ALVOS_DESKTOP : ALVOS_MOBILE;
  const comTinta = await preparar(navegador, largura, false);
  const semTinta = await preparar(navegador, largura, true);
  saida[largura] = {
    '#alvo': largura >= 1024 ? '.eventos-destaque' : '.eventos-lista',
    '#caixa': comTinta.caixa,
    '#tintaTeimosa': semTinta.teimosos,
  };

  for (const f of FRACOES) {
    const rotulo = `f${f}`;
    const posicoes = [];
    for (const p of [comTinta, semTinta]) posicoes.push(await irPara(p.pagina, p.caixa, f));
    const assentadas = [];
    for (const p of [comTinta, semTinta]) assentadas.push(await estabilizar(p.pagina));

    const desalinhadas =
      Math.abs(posicoes[0].real - posicoes[1].real) > 1 ||
      posicoes[0].contador !== posicoes[1].contador;
    if (assentadas.some((ok) => !ok) || desalinhadas) {
      saida[largura][rotulo] = {
        '#pulada': desalinhadas
          ? 'abas em pontos ou eventos diferentes — A−B misturaria dois textos'
          : 'cena não assentou',
        '#posicoes': posicoes,
      };
      continue;
    }

    const medidos = await comTinta.pagina.evaluate(LEVANTAR, ALVOS);
    const [a, b] = await Promise.all([
      comTinta.pagina.screenshot(),
      semTinta.pagina.screenshot(),
    ]);
    const [A, B] = await Promise.all(
      [a, b].map((buf) => sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true })),
    );

    const bloco = { '#posicao': posicoes[0] };
    for (const [id, m] of Object.entries(medidos)) {
      if (!m) {
        bloco[id] = null;
        continue;
      }
      let piorTudo = null;
      let piorCorpo = null;
      let pixels = 0;
      let pixelsCorpo = 0;
      for (const { x, y, w, h } of m.caixas) {
        const x1 = Math.min(x + w, A.info.width);
        const y1 = Math.min(y + h, A.info.height);
        for (let py = Math.max(0, y); py < y1; py += 1) {
          for (let px = Math.max(0, x); px < x1; px += 1) {
            const k = (py * A.info.width + px) * A.info.channels;
            const comA = [A.data[k], A.data[k + 1], A.data[k + 2]];
            const bg = [B.data[k], B.data[k + 1], B.data[k + 2]];
            const mudou =
              Math.abs(comA[0] - bg[0]) + Math.abs(comA[1] - bg[1]) + Math.abs(comA[2] - bg[2]);
            if (mudou < 12) continue;
            const cheio =
              Math.abs(m.tinta[0] - bg[0]) +
              Math.abs(m.tinta[1] - bg[1]) +
              Math.abs(m.tinta[2] - bg[2]);
            const cobertura = cheio > 0 ? Math.min(1, mudou / cheio) : 1;
            const r = razao(compor(m.tinta, m.alfa, bg), bg);
            const cand = {
              razao: Math.round(r * 100) / 100,
              fundo: bg,
              cobertura: Math.round(cobertura * 100) / 100,
              em: { x: px, y: py, rolagem: posicoes[0].real },
            };
            pixels += 1;
            if (piorTudo === null || r < piorTudo.razao) piorTudo = cand;
            if (cobertura >= CORPO) {
              pixelsCorpo += 1;
              if (piorCorpo === null || r < piorCorpo.razao) piorCorpo = cand;
            }
          }
        }
      }
      const grande = m.px >= 24 || (m.px >= 18.66 && Number(m.peso) >= 700);
      const piso = grande ? 3 : 4.5;
      const miudo = m.px < MIUDO;
      if (piorCorpo === null) {
        bloco[id] = {
          ...m,
          caixas: m.caixas.length,
          piso,
          razao: null,
          rasterPior: piorTudo?.razao ?? null,
          motivo: piorTudo
            ? 'nenhum pixel de corpo — só franja de antialiasing no recorte'
            : 'máscara vazia — alvo fora da janela ou tinta não apagada',
          miudo,
          veredito: piorTudo && miudo ? 'artefato-aa' : 'indeterminado',
          passa: false,
        };
        continue;
      }
      const rasterPior = piorTudo?.razao ?? null;
      const delta =
        rasterPior === null ? null : Math.round((piorCorpo.razao - rasterPior) * 100) / 100;
      const passa = piorCorpo.razao >= piso;
      const rasterCondenaria =
        passa && rasterPior !== null && rasterPior < piso && delta > DELTA_ARTEFATO;
      bloco[id] = {
        ...m,
        caixas: m.caixas.length,
        piso,
        razao: piorCorpo.razao,
        rasterPior,
        delta,
        miudo,
        veredito: !passa
          ? 'reprovado'
          : rasterCondenaria
            ? miudo
              ? 'artefato-aa'
              : 'raster-condenaria'
            : 'aprovado',
        piorCorpo,
        pixels,
        pixelsCorpo,
        passa,
      };
    }
    saida[largura][rotulo] = bloco;
  }

  await comTinta.pagina.close();
  await semTinta.pagina.close();
}

await navegador.close();
console.log(JSON.stringify(saida, null, 2));
