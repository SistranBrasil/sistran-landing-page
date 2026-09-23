/**
 * SIS-268 — sonda da `/solucoes/connect-api` depois de montar `ConnectApiPagina`. Os
 * portões são os CRITÉRIOS ESCRITOS na issue, um por linha:
 *
 *   1. A ARQUITETURA DO MATCH AI MONTADA NESTA SLUG — as sete faixas na ordem, cada
 *      uma com o seu `aria-labelledby` apontando para um `h2` que EXISTE (rótulo
 *      pendurado em id inexistente é seção sem nome acessível), e os seis escopos de
 *      reveal presentes com `esperarRota` SÓ no do hero (contrato da SIS-269).
 *   2. A CÁPSULA DA SIS-279 CONTINUA MONTADA nesta rota — é o ponto de atenção da
 *      issue: ela entrava pelo `eyebrowArte` do caminho genérico, de onde esta slug
 *      acabou de sair. Confere arte por nome de arquivo, `carregou`, `alt=""`, a
 *      posição antes do `h1` e a altura de caixa contra as das irmãs.
 *   3. AS SEÇÕES NO ESPÍRITO DAS TRÊS REFERÊNCIAS — três cartões de jornada, quatro
 *      passos de trilho (as irmãs têm três: é a variação de componente do item 3 da
 *      issue) e o hub com as três linhas de vida, as três capacidades e os SEIS raios.
 *   4. O REVEAL ENTRA — todo nó `data-reveal` chega a `opacity: 1` depois de rolar, e
 *      a cascata tem índice em todos os que declaram um.
 *   5. MOVIMENTO REDUZIDO NOS DOIS CANAIS — texto visível e as peças em repouso
 *      LEGÍVEL: nenhuma animação correndo, fio contínuo (`stroke-dasharray: none`),
 *      nó em `scale: 1`, cartão em `scale: 1`. Congelar uma peça em `opacity: 0` ou o
 *      fio num tracejado seria a regressão que este portão pega.
 *   6. CONTRASTE DE TODA TINTA NOVA — a varredura mede cada nó de texto visível
 *      contra o primeiro fundo opaco acima dele. Para o hero e para a faixa escura,
 *      onde o fundo é FOTO sob véu, o fundo opaco do DOM não é o pixel real: os dois
 *      são calculados à parte, compondo o véu declarado sobre a cor média medida da
 *      capa (`rgb(34, 61, 92)`, 1672×941).
 *   7. TRANSBORDO a 1440 e a 390.
 *   8. AS OUTRAS SLUGS INTACTAS — as seis irmãs abrem, cada uma com a SUA cápsula (ou
 *      sem nenhuma, no caso do `lumina-ai`), o `lumina-ai` CONTINUA com a tag textual
 *      «Tecnologia Disruptiva» do caminho genérico, e nenhuma classe `connectapi-*`
 *      vaza para fora desta rota.
 *   9. SEM INDICADOR LATERAL nesta slug — `SECOES_DE_ACELERADOR` corta quem tem menos
 *      de três paradas, e esta tem um `heading` só. O `qa-integrado` entra como par do
 *      mesmo caso e o `guru-de-seguros` como controle de que o indicador não morreu.
 *
 * Uso: node scripts/medir-connect-api-sis268.mjs
 */

import { readFileSync, writeFileSync } from 'node:fs';

const PLAYWRIGHT =
  'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/361ceb562f3b3235/node_modules/playwright/index.mjs';
const SHELL =
  process.env.LOCALAPPDATA +
  '/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe';

const BASE = 'http://localhost:3000';
const ROTA = '/solucoes/connect-api';
const SAIDA = 'docs/medidas/sis268-connect-api.json';

const { chromium } = await import(PLAYWRIGHT);
const navegador = await chromium.launch({ executablePath: SHELL });

async function abrir(rota, { largura = 1440, motion = 'full', reduceSistema } = {}) {
  const ctx = await navegador.newContext({
    viewport: { width: largura, height: 900 },
    ...(reduceSistema ? { reducedMotion: 'reduce' } : {}),
  });
  /* MEDIDO na SIS-279: gravar a preferência `full` VENCE a media query do sistema, que
     é a precedência do seletor de movimento do site (escolha explícita ganha do SO).
     Então o canal do SISTEMA só se mede SEM gravar preferência nenhuma. */
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
  /* `domcontentloaded`: sob `next dev` o `networkidle` nunca chega (canal de HMR
     aberto) e a sonda morre em timeout. */
  await p.goto(`${BASE}${rota}`, { waitUntil: 'domcontentloaded' });
  await p.waitForSelector('[data-route-liberado="true"]', { timeout: 120000 });
  await p.addStyleTag({ content: 'nextjs-portal{display:none!important}' });
  await p.waitForTimeout(1500);
  return { ctx, p };
}

/* Rola a página inteira em passos e volta ao topo: é o que faz TODO escopo de reveal
   entrar em quadro pelo menos uma vez. Sem isso, medir `opacity` embaixo da dobra
   mediria o estado inicial e não o de entrada. */
async function percorrer(p) {
  const altura = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < altura; y += 500) {
    await p.evaluate((v) => window.scrollTo(0, v), y);
    await p.waitForTimeout(220);
  }
  await p.waitForTimeout(1200);
}

/* ── As ferramentas de cor, iguais às das irmãs ────────────────────────────────── */
const lum = ([r, g, b]) => {
  const f = (v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const razao = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return Math.round(((x + 0.05) / (y + 0.05)) * 100) / 100;
};
/* Véu translúcido SOBRE a arte: é esta composição que dá o pixel real do hero e da
   faixa escura, e não o fundo opaco do DOM (que ali é o chapado por baixo da foto). */
const compor = (veu, alfa, fundo) => veu.map((c, i) => Math.round(c * alfa + fundo[i] * (1 - alfa)));

const resultado = { nota: 'gerado por scripts/medir-connect-api-sis268.mjs' };

/* ── 1b. O CONTRATO DA SIS-269, LIDO NA FONTE ───────────────────────────────────
   `esperarRota` é prop e não atributo: o `RevealScope` não a espelha no DOM, então o
   portão «um só, e no escopo do hero» é uma leitura do arquivo. Medir no navegador o que
   não chega ao navegador seria portão que passa por não achar nada. */
{
  const fonte = readFileSync('src/components/solucoes/ConnectApiPagina.tsx', 'utf8');
  const escopos = [...fonte.matchAll(/<RevealScope[\s\S]*?>/g)].map((m) => m[0]);
  resultado.esperarRota = {
    escopos: escopos.length,
    comEsperarRota: escopos.filter((s) => /\besperarRota\b/.test(s)).length,
    /* E qual é: o do hero, pelo `data-reveal-nome` do mesmo mount. */
    nomesComEsperarRota: escopos
      .filter((s) => /\besperarRota\b/.test(s))
      .map((s) => s.match(/data-reveal-nome="([^"]+)"/)?.[1] ?? null),
    /* Nenhum `transform:` solto nas classes desta página: o `data-reveal` é dono dele, e
       um segundo dono zera a entrada (a colisão que as irmãs registram). */
    transformDireto: (fonte.match(/transform:/g) ?? []).length,
  };
}

/* ══ 1 a 4, 6 e a estrutura: uma passada a 1440 ═════════════════════════════════ */
{
  const { ctx, p } = await abrir(ROTA);
  await percorrer(p);

  resultado.estrutura = await p.evaluate(() => {
    const visivel = (el) => el.offsetParent !== null || getComputedStyle(el).position === 'fixed';
    const secoes = [...document.querySelectorAll('main section, main nav[aria-labelledby]')].map(
      (s) => {
        const rotulo = s.getAttribute('aria-labelledby');
        const alvo = rotulo ? document.getElementById(rotulo) : null;
        return {
          tag: s.tagName.toLowerCase(),
          id: s.id || null,
          classes: s.className,
          rotulo,
          /* Rótulo pendurado em id inexistente é seção SEM nome acessível: este par é
             o portão, e não a presença do atributo. */
          rotuloResolve: Boolean(alvo),
          textoDoRotulo: alvo?.textContent?.trim() ?? null,
          /* `overflow-clip` e nunca `hidden`: `hidden` cria contêiner de rolagem e
             desancora o `background-attachment: fixed` da malha de 96px (SIS-76). */
          overflow: getComputedStyle(s).overflow,
        };
      },
    );
    return {
      secoes,
      temTopo: Boolean(document.getElementById('topo')),
      /* Os escopos montados, pelo nome. O `esperarRota` NÃO aparece no DOM (o
         `RevealScope` só emite `data-reveal-nome`), então o portão do contrato da
         SIS-269 — um só, e no hero — é medido na FONTE, fora do navegador. */
      escopos: [...document.querySelectorAll('[data-reveal-nome]')].map((e) =>
        e.getAttribute('data-reveal-nome'),
      ),
      h1: (() => {
        const h = document.querySelector('h1');
        const img = h?.querySelector('img');
        return {
          existe: Boolean(h),
          /* `h1` cujo conteúdo inteiro é imagem precisa de `alt` NÃO vazio, senão é
             cabeçalho sem nome acessível. */
          altDoLetreiro: img?.getAttribute('alt') ?? null,
          letreiroCarregou: img ? img.naturalWidth > 0 : null,
          caixaDoLetreiro: img
            ? [
                Math.round(img.getBoundingClientRect().width * 10) / 10,
                Math.round(img.getBoundingClientRect().height * 10) / 10,
              ]
            : null,
        };
      })(),
      /* As três referências da issue, contadas na página montada. */
      refs: {
        cartoesDeJornada: document.querySelectorAll('.connectapi-cartao').length,
        passosDoTrilho: document.querySelectorAll('.connectapi-selo').length,
        fiosComPacote: document.querySelectorAll('.connectapi-fio-pacote').length,
        raiosDoHub: document.querySelectorAll('.connectapi-raio').length,
        nucleo: document.querySelectorAll('.connectapi-nucleo').length,
        malhasDeCanto: document.querySelectorAll('.connectapi-malha').length,
        acentos: document.querySelectorAll('.connectapi-acentos').length,
        gradeTecnica: document.querySelectorAll('.connectapi-grade').length,
      },
      /* Os textos que a página realmente publica, para o relatório poder dizer o que é
         copy do site e o que é copy da mock com a página na mão. */
      titulos: [...document.querySelectorAll('main h2, main h3')]
        .filter(visivel)
        .map((h) => h.textContent.trim()),
      /* «Conheça também»: a pílula da rota atual como `<span aria-current>`, e as seis
         irmãs com `alt` NÃO vazio (sem ele seriam seis links indistinguíveis). */
      conheca: {
        atual: document.querySelector('[aria-current="page"]')?.textContent?.trim() ?? null,
        cartoesDeIrma: document.querySelectorAll('nav[aria-labelledby="conheca-tambem"] ul a').length,
        logosSemAlt: [...document.querySelectorAll('nav[aria-labelledby="conheca-tambem"] a img')]
          .filter((i) => !i.getAttribute('alt'))
          .length,
      },
      /* A cápsula da SIS-279, que tinha de sobreviver à mudança de caminho. */
      capsula: (() => {
        const no = document.querySelector('.carimbo-batida');
        if (!no) return { existe: false };
        const img = no.querySelector('img');
        const r = no.getBoundingClientRect();
        const ri = img.getBoundingClientRect();
        const h1 = document.querySelector('h1');
        return {
          existe: true,
          classes: no.className,
          src: img.currentSrc ? new URL(img.currentSrc).pathname : img.getAttribute('src'),
          carregou: img.naturalWidth > 0,
          naturais: [img.naturalWidth, img.naturalHeight],
          caixa: [Math.round(r.width * 10) / 10, Math.round(r.height * 10) / 10],
          razaoArquivo: Number((img.naturalWidth / img.naturalHeight).toFixed(3)),
          razaoNaTela: Number((ri.width / ri.height).toFixed(3)),
          altVazio: img.getAttribute('alt') === '',
          antesDoH1: h1
            ? no.compareDocumentPosition(h1) === Node.DOCUMENT_POSITION_FOLLOWING
            : null,
          opacidade: Number(getComputedStyle(no).opacity),
        };
      })(),
    };
  });

  /* ── 4. O REVEAL ENTRA ──────────────────────────────────────────────────────── */
  resultado.reveal = await p.evaluate(() => {
    const nos = [...document.querySelectorAll('[data-reveal]')];
    return {
      total: nos.length,
      invisiveis: nos
        .filter((e) => Number(getComputedStyle(e).opacity) < 0.99)
        .map((e) => ({
          reveal: e.getAttribute('data-reveal'),
          tag: e.tagName.toLowerCase(),
          texto: (e.textContent ?? '').trim().slice(0, 44),
          opacidade: Number(getComputedStyle(e).opacity),
        })),
      /* A cascata mora em `--reveal-i`; sem índice, o atraso é 0 e o grupo entra de
         uma vez. Aqui só se conta quantos declaram, e quantos declaram vazio. */
      comIndice: nos.filter((e) => e.style.getPropertyValue('--reveal-i') !== '').length,
    };
  });

  /* ── 6. CONTRASTE: varredura de toda tinta visível ──────────────────────────── */
  resultado.contraste = await p.evaluate(() => {
    const lum = (c) => {
      const [r, g, b] = c.match(/[\d.]+/g).slice(0, 3).map(Number);
      const f = (v) => {
        const s = v / 255;
        return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
      };
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    };
    const razao = (a, b) => {
      const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
      return Math.round(((x + 0.05) / (y + 0.05)) * 100) / 100;
    };
    const fundoReal = (el) => {
      let n = el;
      while (n && n !== document.documentElement) {
        const c = getComputedStyle(n).backgroundColor;
        if (c && c !== 'rgba(0, 0, 0, 0)' && !/,\s*0\)$/.test(c)) return c;
        n = n.parentElement;
      }
      return getComputedStyle(document.body).backgroundColor;
    };
    const temTextoProprio = (el) =>
      [...el.childNodes].some((n) => n.nodeType === 3 && n.nodeValue.trim().length > 1);

    const itens = [...document.querySelectorAll('main *')]
      .filter((el) => el.offsetParent !== null && temTextoProprio(el))
      .map((el) => {
        const cs = getComputedStyle(el);
        const fundo = fundoReal(el);
        return {
          tag: el.tagName.toLowerCase(),
          classes: el.className?.toString?.().slice(0, 70) ?? '',
          texto: el.textContent.trim().slice(0, 40),
          px: Math.round(parseFloat(cs.fontSize) * 10) / 10,
          peso: cs.fontWeight,
          tinta: cs.color,
          fundo,
          razao: razao(cs.color, fundo),
        };
      });
    /* O piso é 4,5:1; 3:1 vale para texto grande (18,66px em negrito ou 24px). Quem
       ficar abaixo do SEU piso entra na lista de reprovados. */
    const piso = (i) =>
      i.px >= 24 || (i.px >= 18.66 && Number(i.peso) >= 700) ? 3 : 4.5;
    return {
      medidos: itens.length,
      pior: itens.slice().sort((a, b) => a.razao - b.razao)[0] ?? null,
      reprovados: itens.filter((i) => i.razao < piso(i)),
    };
  });

  /* ── 6b. O FUNDO REAL, LIDO NO PIXEL ────────────────────────────────────────
     MEDIDO nesta volta: a varredura de `resultado.contraste` acima reprova oito nós
     das faixas claras contra `rgb(18, 115, 188)`, que é o azul do `body` — e isso é
     ARTEFATO DA MEDIÇÃO, não defeito da página. `.section-light` pinta com
     `background: var(--fundo-claro-secao)`, que é um GRADIENTE: o `backgroundColor`
     computado da seção é transparente, então subir até o primeiro fundo opaco atravessa
     a seção e chega ao `body`. Nenhum desses textos assenta no azul do `body`.
     O portão que vale, então, é o PIXEL: colhem-se as caixas aqui e o valor é lido na
     captura de página inteira logo abaixo, num ponto da margem esquerda de cada nó —
     área de fundo, dentro da mesma seção, já com malha, pontilhado e manchas compostos.
     `resultado.contraste` fica no arquivo ao lado justamente para a diferença entre os
     dois não voltar depois como suspeita. */
  resultado.caixasDeTexto = await p.evaluate(() => {
    const temTextoProprio = (el) =>
      [...el.childNodes].some((n) => n.nodeType === 3 && n.nodeValue.trim().length > 1);
    return [...document.querySelectorAll('main *')]
      .filter((el) => el.offsetParent !== null && temTextoProprio(el))
      .map((el) => {
        const cs = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        return {
          tag: el.tagName.toLowerCase(),
          classes: el.className?.toString?.().slice(0, 70) ?? '',
          texto: el.textContent.trim().slice(0, 40),
          px: Math.round(parseFloat(cs.fontSize) * 10) / 10,
          peso: Number(cs.fontWeight),
          tinta: cs.color,
          /* MEDIDO nesta volta: para PÍLULA DE FUNDO CHEIO, colher o pixel fora da
             caixa mede a folha da seção e não o fundo em que a tinta assenta — as duas
             pílulas desta página (o CTA lilás do hero e o «Ver todas» azul) apareciam
             reprovadas em 1,03:1 e 1,08:1 por isso. Quem tem fundo próprio OPACO é
             medido contra ele, que é o pixel de verdade. */
          fundoProprio: (() => {
            const c = cs.backgroundColor;
            return c && c !== 'rgba(0, 0, 0, 0)' && !/,\s*0\)$/.test(c) ? c : null;
          })(),
          /* Coordenadas de DOCUMENTO: é nelas que a captura de página inteira indexa. */
          x: Math.round(r.left + window.scrollX),
          y: Math.round(r.top + window.scrollY),
          w: Math.round(r.width),
          h: Math.round(r.height),
        };
      });
  });

  await p.evaluate(() => window.scrollTo(0, 0));
  await p.waitForTimeout(500);
  await p.screenshot({ path: 'docs/capturas/sis268-1440-topo.png' });
  await p.screenshot({ path: 'docs/capturas/sis268-1440-inteira.png', fullPage: true });
  await ctx.close();
}

/* ── 6c. O CONTRASTE CONTRA O PIXEL DA CAPTURA ──────────────────────────────────
   Para cada nó de texto, um ponto de fundo à ESQUERDA da caixa (6px antes da borda, na
   altura do meio) e outro ACIMA dela. Dois pontos porque um só pode cair em cima de um
   grafismo — o menor contraste dos dois é o que se reporta, que é o lado seguro. */
{
  const sharp = (await import('sharp')).default;
  const img = sharp('docs/capturas/sis268-1440-inteira.png');
  const { width, height } = await img.metadata();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const pixel = (x, y) => {
    const cx = Math.max(0, Math.min(width - 1, x));
    const cy = Math.max(0, Math.min(height - 1, y));
    const i = (cy * info.width + cx) * info.channels;
    return [data[i], data[i + 1], data[i + 2]];
  };
  const tintaRgb = (c) => c.match(/[\d.]+/g).slice(0, 3).map(Number);

  const itens = resultado.caixasDeTexto.map((t) => {
    const esquerda = pixel(t.x - 6, t.y + Math.round(t.h / 2));
    const acima = pixel(t.x + Math.round(t.w / 2), t.y - 6);
    const tinta = tintaRgb(t.tinta);
    /* Tinta translúcida (`text-white/88`, `text-white/80`) tem de ser COMPOSTA sobre o
       fundo antes de medir: o número da cor cheia seria melhor do que o que se lê. */
    const alfa = Number(t.tinta.match(/[\d.]+/g)?.[3] ?? 1);
    const contra = (fundo) => razao(alfa < 1 ? compor(tinta, alfa, fundo) : tinta, fundo);
    const proprio = t.fundoProprio ? tintaRgb(t.fundoProprio) : null;
    return {
      ...t,
      fundoEsquerda: esquerda,
      fundoAcima: acima,
      /* Pílula de fundo cheio: contra o fundo DELA. Texto sobre a folha: o menor dos
         dois pontos colhidos, que é o lado seguro (um deles pode cair num grafismo). */
      razao: proprio ? contra(proprio) : Math.min(contra(esquerda), contra(acima)),
      /* O piso é 4,5:1; 3:1 vale para texto grande (24px, ou 18,66px em negrito). */
      piso: t.px >= 24 || (t.px >= 18.66 && t.peso >= 700) ? 3 : 4.5,
    };
  });
  resultado.contrastePixel = {
    capturaLida: 'docs/capturas/sis268-1440-inteira.png',
    medidos: itens.length,
    pior: itens.slice().sort((a, b) => a.razao - b.razao)[0] ?? null,
    reprovados: itens.filter((i) => i.razao < i.piso),
  };
}

/* ══ 6b. O PIXEL REAL do hero e da faixa escura ═════════════════════════════════
   O fundo opaco do DOM nessas duas faixas é o chapado POR BAIXO da foto; o pixel que
   o olho lê é o véu declarado composto sobre a arte. A cor média da capa
   (`rgb(34, 61, 92)`) foi medida com sharp em 1672×941 antes de montar. */
{
  const CAPA = [34, 61, 92];
  const NAVY = [0, 26, 61];
  const heroLg = compor(NAVY, 0.94, CAPA); /* o passo de 30% do véu horizontal */
  const heroSm = compor(NAVY, 0.88, CAPA); /* o passo mais aberto do véu vertical */
  const faixaEscura = compor(NAVY, 0.99, CAPA); /* o véu quase fechado do trilho */
  resultado.pixelReal = {
    capaMedidaComSharp: CAPA,
    hero: {
      veuHorizontal94: heroLg,
      veuVertical88: heroSm,
      leadBrancoA85: razao([255, 255, 255], heroLg),
      leadBrancoA85NoVeuAberto: razao([255, 255, 255], heroSm),
      /* A PÍLULA do hero: tinta navy escura sobre o `tone` lilás do produto. Não é
         `.btn-primary` porque o degradê da casa com tinta branca reprova na ponta
         clara (medido na SIS-292). */
      pilulaTintaSobreTone: razao([27, 16, 54], [196, 160, 251]),
    },
    faixaEscura: {
      composto: faixaEscura,
      tituloBranco: razao([255, 255, 255], faixaEscura),
      /* O corpo dos passos é `text-white/80` sobre o navy: o número que importa é o do
         branco JÁ composto com a transparência. */
      corpoBrancoA80: razao(compor([255, 255, 255], 0.8, faixaEscura), faixaEscura),
      selo: razao([228, 212, 254], faixaEscura),
    },
    /* A pílula «Ver todas as soluções»: `#0060A8` e não `#0079CB` pelo número da
       SIS-292 (branco sobre o primário fica em ~4,2:1, abaixo do piso). */
    pilulaVerTodas: {
      brancoSobre0060A8: razao([255, 255, 255], [0, 96, 168]),
      brancoSobre0079CB: razao([255, 255, 255], [0, 121, 203]),
    },
  };
}

/* ══ 5. MOVIMENTO REDUZIDO NOS DOIS CANAIS ══════════════════════════════════════ */
const lerReduce = (p) =>
  p.evaluate(() => {
    const cs = (sel) => {
      const el = document.querySelector(sel);
      return el ? getComputedStyle(el) : null;
    };
    const correndo = (sel) =>
      [...document.querySelectorAll(sel)].reduce(
        (n, el) => n + el.getAnimations({ subtree: true }).filter((a) => a.playState === 'running').length,
        0,
      );
    const pecas =
      '.connectapi-curva, .connectapi-no, .connectapi-cartao, .connectapi-hexagono, .connectapi-fio-pacote, .connectapi-raio, .connectapi-nucleo';
    return {
      atributoMotion: document.documentElement.getAttribute('data-motion'),
      /* O PORTÃO QUE IMPORTA: nada preso invisível. */
      revealInvisiveis: [...document.querySelectorAll('[data-reveal]')].filter(
        (e) => Number(getComputedStyle(e).opacity) < 0.99,
      ).length,
      animacoesCorrendo: correndo(pecas),
      /* E EM REPOUSO LEGÍVEL, peça por peça. */
      repouso: {
        curvaDashoffset: cs('.connectapi-curva')?.strokeDashoffset ?? null,
        noScale: cs('.connectapi-no')?.scale ?? null,
        cartaoScale: cs('.connectapi-cartao')?.scale ?? null,
        /* O fio CONTÍNUO é o estado legível: tracejado congelado deixaria o trilho
           com o fio picado para sempre. */
        pacoteDasharray: cs('.connectapi-fio-pacote')?.strokeDasharray ?? null,
        raioDasharray: cs('.connectapi-raio')?.strokeDasharray ?? null,
        /* A LINHA do fio nunca teve animação: ela é o que liga os passos. */
        linhaExiste: Boolean(document.querySelector('.connectapi-fio-linha')),
        nucleoSombra: cs('.connectapi-nucleo')?.boxShadow ?? null,
      },
      capsula: (() => {
        const no = document.querySelector('.carimbo-batida');
        return no
          ? {
              opacidade: Number(getComputedStyle(no).opacity),
              styleInline: no.getAttribute('style'),
              transformComputado: getComputedStyle(no).transform,
              animacoesCorrendo: no
                .getAnimations({ subtree: true })
                .filter((a) => a.playState === 'running').length,
            }
          : null;
      })(),
    };
  });
{
  const sistema = await abrir(ROTA, { reduceSistema: true });
  await percorrer(sistema.p);
  const porSistema = await lerReduce(sistema.p);
  await sistema.p.screenshot({ path: 'docs/capturas/sis268-reduce-sistema.png', fullPage: true });
  await sistema.ctx.close();

  const atributo = await abrir(ROTA, { motion: 'reduce' });
  await percorrer(atributo.p);
  const porAtributo = await lerReduce(atributo.p);
  await atributo.ctx.close();

  resultado.reduce = { porSistema, porAtributo };
}

/* ══ 7. TRANSBORDO ══════════════════════════════════════════════════════════════ */
resultado.transbordo = {};
for (const largura of [1440, 390]) {
  const { ctx, p } = await abrir(ROTA, { largura });
  await percorrer(p);
  resultado.transbordo[largura] = await p.evaluate(() => ({
    px: document.documentElement.scrollWidth - window.innerWidth,
    /* Quem vaza, se vazar: sem o culpado o número não diz o que corrigir. */
    culpados: [...document.querySelectorAll('main *')]
      .filter((el) => el.offsetParent !== null && el.getBoundingClientRect().right > window.innerWidth + 1)
      .slice(0, 6)
      .map((el) => ({
        tag: el.tagName.toLowerCase(),
        classes: el.className?.toString?.().slice(0, 60) ?? '',
        vaza: Math.round(el.getBoundingClientRect().right - window.innerWidth),
      })),
  }));
  if (largura === 390) {
    await p.evaluate(() => window.scrollTo(0, 0));
    await p.waitForTimeout(400);
    await p.screenshot({ path: 'docs/capturas/sis268-390-inteira.png', fullPage: true });
  }
  await ctx.close();
}

/* ══ 8. AS OUTRAS SLUGS INTACTAS ════════════════════════════════════════════════ */
resultado.irmas = {};
for (const slug of [
  'match-ai',
  'fast',
  'smart-miner',
  'qa-integrado',
  'guru-de-seguros',
  'lumina-ai',
]) {
  const { ctx, p } = await abrir(`/solucoes/${slug}`);
  resultado.irmas[slug] = await p.evaluate(() => {
    const no = document.querySelector('.carimbo-batida');
    const img = no?.querySelector('img');
    return {
      h1: document.querySelector('h1') ? true : false,
      capsulas: document.querySelectorAll('.carimbo-batida').length,
      capsulaSrc: img ? new URL(img.currentSrc || img.src).pathname : null,
      capsulaCarregou: img ? img.naturalWidth > 0 : null,
      /* A tag textual do caminho genérico: ela TEM de continuar no `lumina-ai` e não
         pode reaparecer em quem tem cápsula. Nós de texto fora de `<script>`/`<style>`,
         porque o `innerHTML` carrega a carga RSC (`self.__next_f.push`) e acusaria a
         string serializada mesmo onde ela não se lê (medido na SIS-279). */
      tagTextual: (() => {
        const it = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        for (let n = it.nextNode(); n; n = it.nextNode()) {
          const pai = n.parentElement?.tagName;
          if (pai === 'SCRIPT' || pai === 'STYLE') continue;
          if (/tecnologia disruptiva/i.test(n.nodeValue ?? '')) return true;
        }
        return false;
      })(),
      /* NENHUMA classe desta issue vaza para as irmãs. */
      classesConnectApi: document.querySelectorAll('[class*="connectapi-"]').length,
      transbordo: document.documentElement.scrollWidth - window.innerWidth,
    };
  });
  await ctx.close();
}

/* ══ 9. O INDICADOR LATERAL ═════════════════════════════════════════════════════
   `SECOES_DE_ACELERADOR` corta quem tem menos de três paradas, e esta slug tem UM
   `heading` só — logo, sem indicador, e nada precisou mudar em `pageSections.ts`. O
   `qa-integrado` é o par do mesmo caso; o `guru-de-seguros` é o controle de que o
   indicador continua montando onde havia. */
resultado.indicador = {};
for (const slug of ['connect-api', 'qa-integrado', 'guru-de-seguros']) {
  const { ctx, p } = await abrir(`/solucoes/${slug}`);
  /* O indicador é o `ScrollSpy`: um `<nav>` IRMÃO do `<main>`, `position: fixed` à
     esquerda, com um `<a href="#…">` por parada. Rota sem paradas não renderiza nó
     nenhum, e é por isso que o portão conta o `<nav>` fora do `<main>`. */
  resultado.indicador[slug] = await p.evaluate(() => {
    const navs = [...document.querySelectorAll('body > nav, #conteudo ~ nav')].filter(
      (n) => !n.closest('main') && getComputedStyle(n).position === 'fixed',
    );
    return {
      nos: navs.length,
      rotulos: navs.map((n) => n.getAttribute('aria-label')),
      paradas: navs.reduce((t, n) => t + n.querySelectorAll('a[href^="#"]').length, 0),
    };
  });
  await ctx.close();
}

await navegador.close();
writeFileSync(SAIDA, `${JSON.stringify(resultado, null, 2)}\n`);
console.log(SAIDA);
console.log(JSON.stringify(resultado, null, 2));
