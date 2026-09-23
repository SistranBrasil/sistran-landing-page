/**
 * SIS-268 — mede a seção **Serviços** (`#servicos-diferenciais`) de `/solucoes`.
 *
 * A issue manda reconstruir a seção «exatamente como a mock» seguindo
 * `docs/servicos.md` à risca, e os critérios dela são todos verificáveis por
 * número — então nenhum deles se responde de cabeça:
 *
 *   1. A GEOMETRIA DA SEÇÃO: ela tem de ocupar a largura da JANELA (o doc pede
 *      full-bleed) e o miolo tem de dividir 42%/58% no desktop. As duas coisas são
 *      razão entre caixas medidas, não opinião sobre o CSS.
 *   2. O VÍDEO DE FUNDO com a configuração obrigatória do doc (`autoPlay`,
 *      `muted`, `loop`, `playsInline`, `preload="metadata"`, `object-fit: cover`,
 *      `inset: 0`) e SEM interface de player (`controls` ausente). Lido do DOM,
 *      atributo por atributo, porque «sem barra de progresso» é o `controls` e
 *      nada mais.
 *   3. OS QUATRO CARDS: as fotos (1–4.png), o raio, a altura igual entre eles, a
 *      fração de altura da imagem (~42%), o selo do ícone, e a AUSÊNCIA de
 *      ordinal/seta/botão — a issue proíbe os quatro nominalmente, e ausência se
 *      prova contando nós, não lendo o arquivo.
 *   4. TIPOGRAFIA E CONTRASTE: o doc dá faixas (título `clamp(3rem,5vw,5rem)`,
 *      lead 17–20px, card 18–24px/15–18px) e o critério pede contraste adequado.
 *      O contraste sai do PIXEL da captura, porque o fundo aqui é vídeo + véu:
 *      nenhuma leitura do DOM sabe que cor o quadro do vídeo pôs atrás da letra.
 *   5. AS OUTRAS SEÇÕES INTACTAS: topo e altura de cada irmã do `<main>`, para o
 *      «não mexer nas outras seções» ter linha.
 *   6. TRANSBORDO em 390 e 1024 (o doc pede tablet e mobile sem overflow).
 *
 * Uso: node scripts/medir-servicos-sis268.mjs [depois]
 */

import { writeFileSync, readFileSync } from 'node:fs';

const PLAYWRIGHT =
  'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/361ceb562f3b3235/node_modules/playwright/index.mjs';
const SHELL =
  process.env.LOCALAPPDATA +
  '/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe';

const BASE = 'http://localhost:3000';
const ROTA = '/solucoes';
const SUFIXO = process.argv[2] === 'depois' ? 'depois' : 'antes';
const SAIDA = `docs/medidas/sis268-servicos-${SUFIXO}.json`;

const { chromium } = await import(PLAYWRIGHT);
const navegador = await chromium.launch({ executablePath: SHELL });

async function abrir({ largura = 1440, altura = 900, motion = 'full', reduceSistema } = {}) {
  const ctx = await navegador.newContext({
    viewport: { width: largura, height: altura },
    ...(reduceSistema ? { reducedMotion: 'reduce' } : {}),
  });
  /* Gravar `full` VENCE a media query do sistema — o canal do SISTEMA só se mede
     sem gravar preferência nenhuma. */
  await ctx.addInitScript(
    (pref) => {
      if (pref) {
        localStorage.setItem('sistran-motion-preference', pref);
        localStorage.setItem('sistran-motion-preference-seen', '1');
      }
      sessionStorage.setItem('sistran:intro-visto', 'true');
    },
    reduceSistema ? null : motion,
  );
  const p = await ctx.newPage();
  /* `domcontentloaded`: sob `next dev` o `networkidle` nunca chega (canal de HMR). */
  await p.goto(`${BASE}${ROTA}`, { waitUntil: 'domcontentloaded' });
  await p.waitForSelector('[data-route-liberado="true"]', { timeout: 90000 });
  await p.addStyleTag({ content: 'nextjs-portal{display:none!important}' });
  await p.waitForTimeout(1800);
  return { ctx, p };
}

/* ── A seção: caixa, colunas, vídeo, carimbo, indicadores, cards ─────────────── */
const LER_SECAO = () => {
  const caixa = (no) => {
    if (!no) return null;
    const r = no.getBoundingClientRect();
    return {
      x: Math.round(r.left),
      y: Math.round(r.top + window.scrollY),
      largura: Math.round(r.width * 10) / 10,
      altura: Math.round(r.height * 10) / 10,
    };
  };
  const tipo = (no) => {
    if (!no) return null;
    const cs = getComputedStyle(no);
    return {
      fonte: cs.fontSize,
      peso: cs.fontWeight,
      entrelinha: cs.lineHeight,
      cor: cs.color,
      larguraMaxima: cs.maxWidth,
      texto: (no.textContent ?? '').trim().slice(0, 90),
    };
  };

  const sec = document.getElementById('servicos-diferenciais');
  if (!sec) return { existe: false };

  const video = sec.querySelector('video');
  const csVideo = video ? getComputedStyle(video) : null;
  const carimbo = sec.querySelector('img[src*="carimbo"]');

  /* Os cards: qualquer nó que carregue uma das quatro fotos define um card, e o
     card é o ANCESTRAL com raio — assim a conta não depende do nome da classe que
     eu ainda vou escrever. */
  const fotos = Array.from(sec.querySelectorAll('img')).filter((i) =>
    /\/(images\/solucoes\/[1-4]\.png|images\/home\/|servicos-)/.test(i.getAttribute('src') ?? ''),
  );

  /* O nó de card: o candidato natural é o `<article>`/`<li>` mais próximo. */
  const cartaoDe = (img) => img.closest('article, li, .svc-card') ?? img.parentElement;

  const cards = [];
  const vistos = new Set();
  for (const img of fotos) {
    const c = cartaoDe(img);
    if (!c || vistos.has(c)) continue;
    vistos.add(c);
    const cs = getComputedStyle(c);
    const selo = c.querySelector('svg')?.closest('span, div');
    const h = c.querySelector('h3, h4');
    const p = c.querySelector('p');
    cards.push({
      classes: c.className?.toString?.().slice(0, 90) ?? null,
      caixa: caixa(c),
      corDeFundo: cs.backgroundColor,
      raio: cs.borderRadius,
      borda: `${cs.borderTopWidth} ${cs.borderTopColor}`,
      sombra: cs.boxShadow.slice(0, 120),
      recorte: cs.overflow,
      foto: {
        src: img.getAttribute('src'),
        alt: img.getAttribute('alt'),
        encaixe: getComputedStyle(img).objectFit,
        posicao: getComputedStyle(img).objectPosition,
        caixa: caixa(img),
      },
      /* A fração pedida pelo doc: imagem ~42% da altura do card. */
      fracaoDaFoto:
        caixa(c) && caixa(img) ? Math.round((caixa(img).altura / caixa(c).altura) * 1000) / 10 : null,
      selo: selo
        ? {
            caixa: caixa(selo),
            corDeFundo: getComputedStyle(selo).backgroundColor,
            borda: getComputedStyle(selo).borderTopColor,
            traco: getComputedStyle(selo.querySelector('svg')).strokeWidth || null,
            corDoIcone: getComputedStyle(selo.querySelector('svg')).color,
          }
        : null,
      titulo: tipo(h),
      descricao: tipo(p),
      /* O QUE A ISSUE PROÍBE, contado: ordinal, seta, botão, link. */
      proibidos: {
        ordinais: (c.textContent ?? '').match(/\b0[1-4]\b/g)?.length ?? 0,
        links: c.querySelectorAll('a').length,
        botoes: c.querySelectorAll('button').length,
        /* Recorte inferior/superior de texto: `scrollHeight` maior que a caixa é
           texto cortado, que o doc proíbe nominalmente. */
        textoCortadoPx: Math.max(0, c.scrollHeight - Math.round(c.getBoundingClientRect().height)),
      },
    });
  }

  /* As duas colunas: o filho de grade que contém o carimbo e o que contém as
     fotos. Medidas pela caixa, e a razão sai delas. */
  const colunaDoCarimbo = carimbo
    ? carimbo.closest('div, section')?.parentElement ?? null
    : null;
  const grade = cards.length ? cards[0] : null;

  const numeros = Array.from(sec.querySelectorAll('span, p, strong, dt, dd'))
    .map((n) => (n.textContent ?? '').trim())
    .filter((t) => t === '30+' || t === '100%' || t === 'implementações' || t === 'Seguros');

  return {
    existe: true,
    caixa: caixa(sec),
    janela: { largura: window.innerWidth, altura: window.innerHeight },
    /* Full-bleed: a seção tem de ter a largura da janela. */
    sangraNaJanela: Math.abs(Math.round(sec.getBoundingClientRect().width) - window.innerWidth) <= 1,
    classesDaSecao: sec.className,
    posicao: getComputedStyle(sec).position,
    recorte: getComputedStyle(sec).overflow,
    isolamento: getComputedStyle(sec).isolation,
    gradeTecnica: Boolean(sec.querySelector('.grade-tecnica')),
    video: video
      ? {
          src: video.getAttribute('src') ?? video.querySelector('source')?.getAttribute('src'),
          autoPlay: video.autoplay,
          muted: video.muted,
          loop: video.loop,
          playsInline: video.playsInline,
          controls: video.controls,
          preload: video.getAttribute('preload'),
          encaixe: csVideo.objectFit,
          posicaoCss: csVideo.position,
          inset: [csVideo.top, csVideo.right, csVideo.bottom, csVideo.left].join(' '),
          caixa: caixa(video),
          /* Cobre a seção inteira? Razão de área entre vídeo e seção. */
          cobreASecao:
            Math.round(video.getBoundingClientRect().width) >=
              Math.round(sec.getBoundingClientRect().width) - 1 &&
            Math.round(video.getBoundingClientRect().height) >=
              Math.round(sec.getBoundingClientRect().height) - 1,
          pronto: video.readyState,
          tocando: !video.paused,
        }
      : null,
    /* Interface de player: nenhum destes pode existir. */
    playerUi: {
      comControls: sec.querySelectorAll('video[controls]').length,
      quantosVideos: sec.querySelectorAll('video').length,
    },
    carimbo: carimbo
      ? {
          src: carimbo.getAttribute('src'),
          alt: carimbo.getAttribute('alt'),
          caixa: caixa(carimbo),
          transformDoInvolucro: getComputedStyle(carimbo.parentElement).transform,
        }
      : null,
    /* A tag textual que o carimbo tem de substituir. */
    tagTextual: (() => {
      const t = sec.querySelector('.tag-section');
      return t ? (t.textContent ?? '').trim() : null;
    })(),
    titulo: tipo(sec.querySelector('h2')),
    leads: Array.from(sec.querySelectorAll('p'))
      .filter((p) => (p.textContent ?? '').length > 80)
      .slice(0, 3)
      .map(tipo),
    indicadores: numeros,
    /* As DUAS COLUNAS por nome próprio, que é o que responde ao 42%/58% do doc — a
       heurística de «o pai do pai do carimbo», abaixo, devolveu o miolo inteiro
       (1328px a 1440) na primeira leitura e não serve de portão. */
    colunas: (() => {
      const e = sec.querySelector('.svc-palco-abertura');
      const d = sec.querySelector('.svc-palco-cards');
      const miolo = sec.querySelector('.svc-palco-miolo');
      if (!e || !d || !miolo) return null;
      const larguraMiolo = miolo.getBoundingClientRect().width;
      const pct = (no) => Math.round((no.getBoundingClientRect().width / larguraMiolo) * 1000) / 10;
      return {
        miolo: Math.round(larguraMiolo * 10) / 10,
        esquerda: caixa(e),
        direita: caixa(d),
        fracaoEsquerda: pct(e),
        fracaoDireita: pct(d),
        /* A RAZÃO é o portão do doc, não a fração do miolo: com `42fr 58fr` o vão sai
           da trilha antes do rateio, então as duas frações do miolo somam menos de
           100 de propósito e é a proporção ENTRE as colunas que tem de dar 42:58. */
        razaoEsquerda: (() => {
          const le = e.getBoundingClientRect().width;
          const ld = d.getBoundingClientRect().width;
          return Math.round((le / (le + ld)) * 1000) / 10;
        })(),
        /* Quanto sobra entre o fim da coluna direita e o fim do miolo. Negativo = a
           grade estoura o miolo, que foi o defeito do `42% 58%`: o card da direita
           saía pela borda e o `overflow-x-clip` da seção comia a diferença. */
        sobraADireitaPx:
          Math.round(
            (miolo.getBoundingClientRect().right - d.getBoundingClientRect().right) * 10,
          ) / 10,
        /* Lado a lado ou empilhadas: a comparação é pela ESQUERDA, não pelo topo —
           no desktop a grade centra as duas verticalmente (`align-items: center`), e
           topos diferentes ali não significam coluna única. */
        empilhadas: Math.abs(e.getBoundingClientRect().left - d.getBoundingClientRect().left) < 4,
      };
    })(),
    /* O CORREDOR DO `ScrollSpy`. A seção sangra na janela, e o indicador de seção é
       `fixed` NA JANELA — então a tinta dele e o conteúdo desta seção disputam a
       mesma coluna de pixels. O número é a folga entre a borda direita da tinta do
       indicador (traço + rótulo do item ativo, este último pintado só de 1440 para
       cima) e a borda esquerda do miolo. Negativo = sobreposição, que é o defeito
       que a captura de 1440 mostrou: rótulo «SERVIÇOS» por cima do `h2`.
       ⚠️ `nav.getBoundingClientRect()` NÃO serve aqui: o rótulo é `absolute` fora da
       borda do nav na faixa recolhida (lição da SIS-170), então a tinta se mede nos
       FILHOS, um por um, e só nos que estão realmente pintados. */
    corredorDoIndicador: (() => {
      /* O nav do `ScrollSpy` por assinatura própria (`fixed left-3`), e não «o nav
         com âncora mais próximo»: a primeira volta desta medição pegou OUTRO nav da
         rota abaixo de 1280 — onde o ScrollSpy nem monta (o `matchMedia` dele está
         em 1280) — e fabricou folgas negativas de centenas de pixels. */
      const nav = document.querySelector('nav.fixed.left-3');
      const miolo = sec.querySelector('.svc-palco-miolo');
      if (!nav || !miolo) return { navMontado: Boolean(nav), folgaPx: null };
      let direita = 0;
      let rotulo = null;
      for (const no of nav.querySelectorAll('a, a > *')) {
        const cs = getComputedStyle(no);
        if (Number(cs.opacity) < 0.05 || cs.visibility === 'hidden') continue;
        const r = no.getBoundingClientRect();
        if (r.width < 1) continue;
        if (r.right > direita) {
          direita = r.right;
          rotulo = (no.textContent ?? '').trim().slice(0, 30) || no.className?.toString?.().slice(0, 30);
        }
      }
      const esquerda = miolo.getBoundingClientRect().left;
      return {
        navMontado: true,
        ativo: (nav.querySelector('[aria-current="true"]')?.textContent ?? '').trim().slice(0, 30) || null,
        tintaAteX: Math.round(direita * 10) / 10,
        pecaMaisADireita: rotulo,
        mioloComecaEmX: Math.round(esquerda * 10) / 10,
        folgaPx: Math.round((esquerda - direita) * 10) / 10,
      };
    })(),
    colunaEsquerda: caixa(colunaDoCarimbo),
    colunaDireitaPrimeiroCard: grade?.caixa ?? null,
    cards,
    /* Alturas iguais entre os quatro: a maior menos a menor. */
    desvioDeAlturaPx: cards.length
      ? Math.round(
          (Math.max(...cards.map((c) => c.caixa.altura)) -
            Math.min(...cards.map((c) => c.caixa.altura))) *
            10,
        ) / 10
      : null,
    cta: (() => {
      const b = sec.querySelector('.btn-primary');
      return b ? { texto: (b.textContent ?? '').trim(), caixa: caixa(b) } : null;
    })(),
  };
};

/* ── As irmãs da seção, para o portão «outras seções intactas» ────────────────── */
const LER_IRMAS = () => {
  const main = document.getElementById('conteudo');
  return {
    alturaDoDocumento: document.documentElement.scrollHeight,
    transbordoPx: document.documentElement.scrollWidth - window.innerWidth,
    faixas: Array.from(main?.children ?? []).map((no) => {
      const r = no.getBoundingClientRect();
      return {
        tag: no.tagName.toLowerCase(),
        id: no.id || null,
        classes: no.className?.toString?.().slice(0, 70) ?? null,
        topo: Math.round(r.top + window.scrollY),
        altura: Math.round(r.height),
      };
    }),
  };
};

const resultado = { nota: `gerado por scripts/medir-servicos-sis268.mjs (${SUFIXO})` };

/* 1440 = desktop da mock, 1024 = tablet do doc, 390 = mobile do doc. */
for (const largura of [1440, 1024, 390]) {
  const { ctx, p } = await abrir({ largura });
  const bloco = await p.evaluate(LER_SECAO);
  bloco.pagina = await p.evaluate(LER_IRMAS);

  /* ⚠️ NADA DE `fullPage` — a rota tem camadas ancoradas na JANELA
     (`solucoes-canvas`, `.grade-tecnica`, o plano da SIS-204) e o Chromium não as
     pinta ao longo de uma captura de página inteira: elas saem só na primeira
     dobra. Apurado na SIS-204, onde isso fabricou uma regressão inteira. Então a
     seção é ROLADA para a janela e capturada NA janela, que é o que a pessoa vê. */
  if (bloco.existe) {
    const alvo = Math.round(bloco.caixa.y + Math.min(bloco.caixa.altura, 900) * 0.5);
    await p.evaluate((y) => window.scrollTo(0, Math.max(0, y - window.innerHeight / 2)), alvo);
    await p.waitForTimeout(700);
    bloco.rolagem = await p.evaluate(() => Math.round(window.scrollY));
    bloco.captura = `docs/capturas/sis268-servicos-${largura}-${SUFIXO}.png`;
    await p.screenshot({ path: bloco.captura });
    /* Segunda captura, no topo da seção: a mock mostra carimbo e primeiro card na
       mesma dobra, e é essa dobra que se compara com a arte. */
    await p.evaluate((y) => window.scrollTo(0, Math.max(0, y - 80)), bloco.caixa.y);
    await p.waitForTimeout(700);
    bloco.rolagemTopo = await p.evaluate(() => Math.round(window.scrollY));
    bloco.capturaTopo = `docs/capturas/sis268-servicos-topo-${largura}-${SUFIXO}.png`;
    await p.screenshot({ path: bloco.capturaTopo });

    /* O corredor RELIDO com a seção em quadro: no topo do documento o item ativo é
       «Início», o rótulo mais curto da rota — a tinta a medir é a de «SERVIÇOS», o
       item que fica ativo justamente aqui. Mesma armadilha que a SIS-170 registrou
       ao medir no topo da página. */
    bloco.corredorDoIndicadorNaSecao = (await p.evaluate(LER_SECAO)).corredorDoIndicador;

    /* As tintas a medir: na captura DO TOPO, com o retângulo de TELA. */
    bloco.tintas = await p.evaluate(() => {
      const sec = document.getElementById('servicos-diferenciais');
      const alvos = [
        ['titulo', sec.querySelector('h2')],
        [
          'lead',
          Array.from(sec.querySelectorAll('p')).find((p) => (p.textContent ?? '').length > 80),
        ],
        ['indicador', Array.from(sec.querySelectorAll('*')).find((n) => n.textContent?.trim() === '30+')],
        ['card-titulo', sec.querySelector('article h3, article h4, .svc-card h3')],
        ['card-descricao', sec.querySelector('article p, .svc-card p')],
      ];
      const saida = {};
      for (const [nome, no] of alvos) {
        if (!no || no.offsetParent === null) {
          saida[nome] = null;
          continue;
        }
        const r = no.getBoundingClientRect();
        saida[nome] = {
          cor: getComputedStyle(no).color,
          fonte: getComputedStyle(no).fontSize,
          retanguloNaTela: [
            Math.round(r.left),
            Math.round(r.top),
            Math.round(r.width),
            Math.round(r.height),
          ],
        };
      }
      return saida;
    });
  }
  resultado[largura] = bloco;
  await ctx.close();
}

/* ── Movimento reduzido: o vídeo de fundo tem de PARAR nos dois canais ────────── */
const lerReduce = (p) =>
  p.evaluate(() => {
    const sec = document.getElementById('servicos-diferenciais');
    const v = sec?.querySelector('video');
    return {
      atributoMotion: document.documentElement.getAttribute('data-motion'),
      existeVideo: Boolean(v),
      pausado: v ? v.paused : null,
      tempo: v ? Math.round(v.currentTime * 100) / 100 : null,
      animacoesNaSecao: sec
        ? sec.getAnimations({ subtree: true }).filter((a) => a.playState === 'running').length
        : null,
    };
  });
{
  const s = await abrir({ reduceSistema: true });
  await s.p.evaluate(() => {
    const sec = document.getElementById('servicos-diferenciais');
    if (sec) sec.scrollIntoView();
  });
  await s.p.waitForTimeout(1500);
  resultado.reducePorSistema = await lerReduce(s.p);
  await s.ctx.close();
  const a = await abrir({ motion: 'reduce' });
  await a.p.evaluate(() => {
    const sec = document.getElementById('servicos-diferenciais');
    if (sec) sec.scrollIntoView();
  });
  await a.p.waitForTimeout(1500);
  resultado.reducePorAtributo = await lerReduce(a.p);
  await a.ctx.close();
}

await navegador.close();

/* ── O PIXEL REAL: contraste de cada tinta contra o fundo que o vídeo deixou ──── */
{
  const sharp = (await import('sharp')).default;
  const lum = ([r, g, b]) => {
    const f = (v) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const razao = (a, b) => {
    const [m, n] = [lum(a), lum(b)].sort((p, q) => q - p);
    return Number(((m + 0.05) / (n + 0.05)).toFixed(2));
  };
  const corDoTexto = (css) => {
    const m = css?.match(/rgba?\(([^)]+)\)/);
    return m ? m[1].split(',').slice(0, 3).map((v) => Number(v.trim())) : null;
  };
  const bloco = async (arquivo, x, y, lado = 5) => {
    const meta = await sharp(readFileSync(arquivo)).metadata();
    const left = Math.max(0, Math.min(Math.round(x), (meta.width ?? 1) - lado));
    const top = Math.max(0, Math.min(Math.round(y), (meta.height ?? 1) - lado));
    const { data, info } = await sharp(readFileSync(arquivo))
      .extract({ left, top, width: lado, height: lado })
      .raw()
      .toBuffer({ resolveWithObject: true });
    let [sr, sg, sb, n] = [0, 0, 0, 0];
    for (let i = 0; i < data.length; i += info.channels) {
      sr += data[i];
      sg += data[i + 1];
      sb += data[i + 2];
      n += 1;
    }
    return [sr / n, sg / n, sb / n].map((v) => Math.round(v));
  };

  for (const largura of [1440, 1024, 390]) {
    const b = resultado[largura];
    if (!b?.existe || !b.tintas) continue;
    b.contraste = {};
    for (const [nome, t] of Object.entries(b.tintas)) {
      if (!t) {
        b.contraste[nome] = null;
        continue;
      }
      const [x, y, , h] = t.retanguloNaTela;
      /* À ESQUERDA da primeira letra, na mesma linha: é ali que a tinta assenta.
         Amostra de 5px, e por isso é MÉDIA — franja de antialiasing subestima
         texto pequeno, então este número é o do fundo, não o do glifo. */
      const fundo = await bloco(b.capturaTopo, Math.max(0, x - 9), y + h / 2 - 2);
      const tinta = corDoTexto(t.cor);
      b.contraste[nome] = {
        tinta: t.cor,
        fundo: `rgb(${fundo.join(', ')})`,
        amostraEm: [Math.max(0, x - 9), Math.round(y + h / 2 - 2)],
        arquivo: b.capturaTopo,
        contraste: tinta ? razao(tinta, fundo) : null,
      };
    }
  }
}

writeFileSync(SAIDA, `${JSON.stringify(resultado, null, 2)}\n`);
console.log(SAIDA);
