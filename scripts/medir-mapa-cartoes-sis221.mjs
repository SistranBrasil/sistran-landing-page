/* SIS-221 — «mapa e cards do MESMO TAMANHO em PB, SP e RJ».
 *
 * POR QUE UMA SONDA NOVA, e não a `medir-mapa-escritorios.mjs` que já existe: aquela
 * responde «quão pequeno está o mapa» numa parada — largura do país, sobra contra o
 * recorte, folga contra coluna e cartão. Ela NÃO responde a pergunta desta issue, que
 * é de COMPARAÇÃO ENTRE as três paradas, e para duas caixas ao mesmo tempo:
 *
 *   1. o mapa tem a mesma caixa/escala visual em PB, SP e RJ?
 *   2. o cartão tem as mesmas dimensões (largura, altura, área de foto) nas 3 abas?
 *
 * A (2) é invisível para a sonda antiga: ela filtra o cartão VISÍVEL e lê só a aresta
 * esquerda dele. Aqui os três `.os-painel` são medidos SEMPRE, visíveis ou não — eles
 * dividem a mesma célula de grade de propósito (a razão está no `globals.css`), então
 * todos têm caixa em todo instante e é justamente a divergência entre elas que a issue
 * chama de «card mudando de tamanho».
 *
 * TRÊS DECISÕES DE MÉTODO:
 *
 *   · O alvo do mapa é `.bm-pais`, a silhueta do Brasil, e não `.bm-mapa`. `.bm-mapa`
 *     é a célula da grade e NÃO se move quando a câmera transforma — medir nela daria
 *     «mesma caixa nas três» de graça, e falso. Isto já custou uma leitura errada
 *     antes (a nota de `--os-desliza` no `globals.css` registra).
 *   · «Mesma escala visual» é medida como DISPERSÃO entre as três paradas:
 *     `max/min` da largura do país. 1.000 = idêntico. É o número que o aceite pede,
 *     e um número só, em vez de três que o leitor tem de comparar de cabeça.
 *   · As soleiras que qualquer equalização pode quebrar continuam medidas, porque o
 *     custo de igualar é justamente invadi-las: folga contra a coluna de leitura,
 *     folga contra o cartão pousado, e as quatro sobras contra a borda de recorte de
 *     CONTEÚDO do `<svg>` (não a de borda — `padding` num `<svg>` encolhe o viewport,
 *     e medir a caixa errada foi o defeito da SIS-191).
 *
 * Os overrides de ambiente varrem candidatos sem editar a folha — é assim que o valor
 * escolhido fica medido em vez de chutado:
 *
 *   node scripts/medir-mapa-cartoes-sis221.mjs
 *   ESCALA_PR=1 ESCALA_SP=1 RECUO=0 DESLIZA=0 LENTE=0 node scripts/medir-mapa-cartoes-sis221.mjs
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/361ceb562f3b3235/node_modules/playwright/index.mjs';

const EXE =
  process.env.LOCALAPPDATA +
  '/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe';
const ROTA = process.env.ROTA ?? 'http://localhost:3000/quem-somos';

/* Só telas no modo scroll (>=1280 de largura e >=760 de altura): é lá que a câmera
   existe. 1440x900 é a janela do aceite; as outras quatro são as que já denunciaram
   impasse antes — as duas alturas de 1280 travam em soleiras OPOSTAS (a baixa pelo
   cartão, a alta pela aresta esquerda do recorte), e é esse par que impede escolher
   um deslocamento que sirva às duas. */
const JANELAS = (process.env.JANELAS ?? '1280x800,1280x1000,1366x900,1440x900,1800x1000')
  .split(',')
  .map((s) => {
    const [w, h] = s.split('x').map(Number);
    return { w, h };
  });

/* Centro de cada pouso, em fração do curso — os mesmos `POUSO` do componente:
   1/12, 7/12 e 11/12. */
const PARADAS = (process.env.PARADAS ?? '0.0833,0.5833,0.9167').split(',').map(Number);

const OVR = [];
const alvo = (cidade, variavel, valor) =>
  OVR.push(
    `.os-palco[data-modo='scroll'][data-ativa='${cidade}']{--os-${variavel}:${valor}!important}`,
  );
if (process.env.ESCALA_PR) alvo('pr', 'foco-escala', process.env.ESCALA_PR);
if (process.env.ESCALA_SP) alvo('sp', 'foco-escala', process.env.ESCALA_SP);
if (process.env.ESCALA_RJ) alvo('rj', 'foco-escala', process.env.ESCALA_RJ);
if (process.env.FOCOX) {
  for (const c of ['pr', 'sp', 'rj']) alvo(c, 'foco-x', `${process.env.FOCOX}%`);
}
if (process.env.FOCOY) {
  for (const c of ['pr', 'sp', 'rj']) alvo(c, 'foco-y', `${process.env.FOCOY}%`);
}
/* Os três eixos esfregados. Declarados juntos porque vivem na MESMA `transform` e
   duas declarações de `transform` no mesmo elemento não somam — a última ganha. */
if (
  process.env.RECUO !== undefined ||
  process.env.DESLIZA !== undefined ||
  process.env.LENTE !== undefined ||
  process.env.ARRASTA !== undefined ||
  process.env.SOBE !== undefined
) {
  const r = process.env.RECUO ?? '0.64';
  const d = process.env.DESLIZA ?? '-52';
  const l = process.env.LENTE ?? '1.2';
  const a = process.env.ARRASTA ?? '-26';
  const s = process.env.SOBE ?? '-20.7';
  OVR.push(
    `.os-palco[data-modo='scroll'] .bm-camera{` +
      `--os-recuo:calc(1 - ${r} * var(--os-transito,0))!important;` +
      `--os-desliza:calc(var(--os-transito,0) * ${d}%)!important;` +
      `--os-lente:calc(1 + ${l} * var(--os-aproxima,0))!important;` +
      `--os-arrasta:calc(var(--os-aproxima,0) * ${a}%)!important;` +
      `--os-sobe:calc(var(--os-aproxima,0) * ${s}%)!important}`,
  );
}

/* ── OS DOIS PARAFUSOS QUE ABREM A FAIXA LIVRE ─────────────────────────────────
   Medido na calibração: igualar a câmera e neutralizar `--os-desliza` deixa o país
   parado no centro da faixa do mapa (cx 894,3 a 1280x800) e o cartão pousado a
   x=784 passa por cima dele — `folgaCartao` −215,7. A faixa útil entre a aresta de
   recorte (547,2) e o cartão é uma CONSTANTE de 236,8px, e é ela que limita a
   escala constante: é por isso que a entrega anterior desistiu de igualar.

   O terceiro parafuso, que ninguém tinha mexido, é a LARGURA DO CARTÃO. Ele hoje
   preenche a faixa de leitura inteira (27rem = 432px) porque é item de grade
   esticado; as mocks desenham o cartão MAIS ESTREITO que o título (≈29% da janela
   contra os 34% daqui). Estreitar o cartão sem mais nada não abre nada: `--os-viagem`
   é medida contra a aresta direita do INVÓLUCRO parado (`.os-baixo`), então o cartão
   pousaria no mesmo x=784 e sobraria vão morto à direita dele. Abre quando as duas
   coisas andam juntas — teto de largura MAIS o acréscimo de viagem que o recoloca
   rente à borda interna. `CARTAO_MAX` e `VIAGEM_EXTRA` medem esse par antes de a
   folha ser editada.

   `VIAGEM_EXTRA` entra sobrescrevendo a `transform` inteira de `.os-cidades`, e com
   `!important`, porque `--os-viagem` é escrita INLINE pelo componente e uma regra de
   folha sem `!important` perde da inline. */
if (process.env.CARTAO_MAX) {
  OVR.push(`.os-palco[data-modo='scroll'] .os-painel{max-width:${process.env.CARTAO_MAX}!important}`);
}
if (process.env.VIAGEM_EXTRA) {
  OVR.push(
    `.os-palco[data-modo='scroll'] .os-cidades{transform:translate3d(` +
      `calc((var(--os-viagem,0px) + ${process.env.VIAGEM_EXTRA}) * var(--os-transito,0)),0,0)!important}`,
  );
}
/* `align-self: stretch` nas três fichas: elas dividem a MESMA célula de grade, então
   a célula já tem a altura da mais alta — esticar iguala as três sem inventar
   conteúdo. Fica atrás de parafuso para a altura igualada ser medida, não suposta. */
if (process.env.ESTICA) {
  OVR.push(`.os-palco[data-modo='scroll'] .os-painel{align-self:stretch!important}`);
}

const nav = await chromium.launch({ executablePath: EXE });
const saida = {
  issue: 'SIS-221',
  nota: 'gerado por scripts/medir-mapa-cartoes-sis221.mjs',
  rota: ROTA,
  quando: new Date().toISOString(),
  override: OVR,
  janelas: [],
};

const LER = () => {
  const palco = document.querySelector('.os-palco');
  const svg = document.querySelector('.bm-mapa');
  const pais = document.querySelector('.bm-pais');
  const coluna = palco?.querySelector('.os-coluna');
  if (!svg || !pais) return null;
  const r = (n) => Math.round(n * 10) / 10;
  const cs = getComputedStyle(svg);
  const bs = svg.getBoundingClientRect();
  /* Caixa de CONTEÚDO do `<svg>`: a borda de recorte de verdade. */
  const rec = {
    esq: bs.left + parseFloat(cs.paddingLeft || '0'),
    dir: bs.right - parseFloat(cs.paddingRight || '0'),
    topo: bs.top + parseFloat(cs.paddingTop || '0'),
    base: bs.bottom - parseFloat(cs.paddingBottom || '0'),
  };
  const bp = pais.getBoundingClientRect();
  const bc = coluna?.getBoundingClientRect();

  /* OS TRÊS CARTÕES, sempre — não só o visível. Eles dividem a mesma célula de
     grade, então todos têm caixa em qualquer instante, e é a divergência entre elas
     que a issue chama de «card mudando de tamanho». `visivel` vem do atributo
     (`aria-hidden`), não da caixa: a cena esconde por opacidade de propósito, para a
     altura da célula não saltar na troca. */
  const cartoes = [...(palco?.querySelectorAll('.os-painel') ?? [])].map((el) => {
    const b = el.getBoundingClientRect();
    const fotos = el.querySelector('.os-fotos');
    const bf = fotos?.getBoundingClientRect();
    return {
      cidade: el.dataset.cidade ?? null,
      visivel: !el.hasAttribute('aria-hidden'),
      larg: r(b.width),
      alt: r(b.height),
      esq: r(b.left),
      topo: r(b.top),
      /* Área de foto: o aceite nomeia «área de foto» junto de largura e altura. */
      fotosLarg: bf ? r(bf.width) : null,
      fotosAlt: bf ? r(bf.height) : null,
    };
  });

  const cartaoVis = cartoes.find((c) => c.visivel) ?? null;

  return {
    ativa: palco?.dataset.ativa ?? null,
    transito: getComputedStyle(palco).getPropertyValue('--os-transito').trim(),
    aproxima: getComputedStyle(palco).getPropertyValue('--os-aproxima').trim(),
    /* A escala resolvida da câmera, lida da matriz — é o número que multiplica o
       desenho, e ler a matriz evita refazer a conta dos quatro fatores à mão. */
    cameraMatriz: getComputedStyle(document.querySelector('.bm-camera')).transform,
    pais: {
      larg: r(bp.width),
      alt: r(bp.height),
      esq: r(bp.left),
      dir: r(bp.right),
      topo: r(bp.top),
      base: r(bp.bottom),
      /* Centro: «mesma POSIÇÃO» é isto, e não a aresta — a aresta se move quando só
         a escala muda, o centro não. */
      cx: r(bp.left + bp.width / 2),
      cy: r(bp.top + bp.height / 2),
    },
    recorte: { esq: r(rec.esq), dir: r(rec.dir), topo: r(rec.topo), base: r(rec.base) },
    /* Negativo em qualquer uma = aproximar cortou o país. */
    sobra: {
      esq: r(bp.left - rec.esq),
      dir: r(rec.dir - bp.right),
      topo: r(bp.top - rec.topo),
      base: r(rec.base - bp.bottom),
    },
    /* As duas soleiras que a equalização pode quebrar. */
    folgaColuna: bc ? r(bp.left - bc.right) : null,
    folgaCartao: cartaoVis ? r(cartaoVis.esq - bp.right) : null,
    transbordo: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    cartoes,
  };
};

for (const { w, h } of JANELAS) {
  const ctx = await nav.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await ctx.addInitScript(() => {
    localStorage.setItem('sistran-motion-preference', 'full');
    localStorage.setItem('sistran-motion-preference-seen', '1');
    sessionStorage.setItem('sistran:intro-visto', 'true');
  });
  const pag = await ctx.newPage();
  const erros = [];
  pag.on('console', (m) => {
    if (m.type() === 'error') erros.push(m.text().slice(0, 180));
  });
  pag.on('pageerror', (e) => erros.push(`pageerror: ${String(e).slice(0, 180)}`));
  await pag.goto(ROTA, { waitUntil: 'domcontentloaded' });
  await pag.waitForSelector('[data-route-liberado="true"]', { timeout: 30000 });
  await pag.addStyleTag({
    content: `nextjs-portal,[data-nextjs-toast],[href="#conteudo"]{display:none!important}${OVR.join('')}`,
  });

  const paradas = [];
  for (const f of PARADAS) {
    const ancora = await pag.evaluate(() => {
      const t = document.querySelector('.os-trilha');
      const i = t?.querySelector('.os-inner');
      if (!t || !i) return null;
      return {
        topo: Math.round(t.getBoundingClientRect().top + scrollY),
        curso: Math.max(1, t.offsetHeight - i.offsetHeight),
      };
    });
    if (!ancora) {
      paradas.push({ f, erro: 'sem .os-trilha (modo lista?)' });
      continue;
    }
    await pag.evaluate(
      (yy) => window.scrollTo({ top: yy, behavior: 'instant' }),
      ancora.topo + Math.round(ancora.curso * f),
    );
    /* A câmera tem transição de 1,1s e o cartão anda por transform: esperar o quadro
       PARADO, senão a medida é de um estado a caminho. */
    await pag.waitForTimeout(1800);
    paradas.push({ f, ...((await pag.evaluate(LER)) ?? { erro: 'sem mapa' }) });
  }

  /* ── A DISPERSÃO, que é o aceite ────────────────────────────────────────────
     `max/min` entre as três paradas. 1.000 = idêntico nas três. Para o cartão, a
     conta é feita sobre o cartão VISÍVEL de cada parada — é ele que o olho compara
     ao trocar de aba. */
  const boas = paradas.filter((p) => !p.erro);
  const disp = (vals) => {
    const v = vals.filter((n) => typeof n === 'number' && n > 0);
    if (v.length < 2) return null;
    return Math.round((Math.max(...v) / Math.min(...v)) * 1000) / 1000;
  };
  const visiveis = boas.map((p) => p.cartoes.find((c) => c.visivel)).filter(Boolean);
  const dispersao = {
    mapaLarg: disp(boas.map((p) => p.pais.larg)),
    mapaAlt: disp(boas.map((p) => p.pais.alt)),
    /* Amplitude do centro, em px: «mesma posição» é o centro parado. */
    mapaCentroX: boas.length
      ? Math.round(
          (Math.max(...boas.map((p) => p.pais.cx)) - Math.min(...boas.map((p) => p.pais.cx))) * 10,
        ) / 10
      : null,
    mapaCentroY: boas.length
      ? Math.round(
          (Math.max(...boas.map((p) => p.pais.cy)) - Math.min(...boas.map((p) => p.pais.cy))) * 10,
        ) / 10
      : null,
    cartaoLarg: disp(visiveis.map((c) => c.larg)),
    cartaoAlt: disp(visiveis.map((c) => c.alt)),
    cartaoFotosLarg: disp(visiveis.map((c) => c.fotosLarg)),
    cartaoFotosAlt: disp(visiveis.map((c) => c.fotosAlt)),
  };
  /* A pior das soleiras: é o número que reprova um candidato da varredura. */
  const piores = {
    folgaColuna: Math.min(...boas.map((p) => p.folgaColuna ?? Infinity)),
    folgaCartao: Math.min(...boas.map((p) => p.folgaCartao ?? Infinity)),
    sobraEsq: Math.min(...boas.map((p) => p.sobra.esq)),
    sobraDir: Math.min(...boas.map((p) => p.sobra.dir)),
    sobraTopo: Math.min(...boas.map((p) => p.sobra.topo)),
    sobraBase: Math.min(...boas.map((p) => p.sobra.base)),
    transbordo: Math.max(...boas.map((p) => p.transbordo)),
  };

  saida.janelas.push({ largura: w, altura: h, dispersao, piores, paradas, erros });
  console.log(`\n=== ${w}x${h} ===`);
  for (const p of paradas) {
    if (p.erro) {
      console.log(`  f=${p.f}  ${p.erro}`);
      continue;
    }
    const cv = p.cartoes.find((c) => c.visivel);
    console.log(
      `  f=${p.f} ativa=${p.ativa} tr=${p.transito} ap=${p.aproxima}` +
        ` | BRASIL ${p.pais.larg}x${p.pais.alt} centro ${p.pais.cx},${p.pais.cy}` +
        ` | sobra e/d/t/b ${p.sobra.esq}/${p.sobra.dir}/${p.sobra.topo}/${p.sobra.base}` +
        ` | folga coluna ${p.folgaColuna} cartao ${p.folgaCartao}` +
        `\n        CARTAO ${cv?.cidade} ${cv?.larg}x${cv?.alt} fotos ${cv?.fotosLarg}x${cv?.fotosAlt}` +
        ` | todos ${p.cartoes.map((c) => `${c.cidade}:${c.larg}x${c.alt}`).join(' ')}`,
    );
  }
  console.log(`  DISPERSAO ${JSON.stringify(dispersao)}`);
  console.log(`  PIORES    ${JSON.stringify(piores)}`);
  if (erros.length) console.log(`  erros de console: ${erros.length} — ${erros[0]}`);
  await ctx.close();
}

await nav.close();
mkdirSync('docs/medidas', { recursive: true });
const nome = process.env.SAIDA ?? 'docs/medidas/mapa-cartoes-sis221.json';
writeFileSync(nome, `${JSON.stringify(saida, null, 2)}\n`);
console.log(`\n→ ${nome}`);
