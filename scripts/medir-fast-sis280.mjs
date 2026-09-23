/**
 * SIS-280 — sonda de `/solucoes/fast` depois do alinhamento à arquitetura do
 * Match AI.
 *
 * Os portões são os CRITÉRIOS ESCRITOS na issue, um por bloco, e dois deles são
 * COMPARATIVOS: «Fast na mesma arquitetura de seções que Match AI» não se mede
 * olhando só o Fast, então a sonda abre as DUAS rotas e compara o inventário de
 * mecanismo (escopos de reveal, grafismos, classes de laço/hover). Identidade
 * própria é o que NÃO pode bater: capa, escrita e a arte da Integração.
 *
 *   1. ARQUITETURA — inventário de mecanismo nas duas rotas, lado a lado.
 *   2. A ARTE DA INTEGRAÇÃO — o `<img>` existe, CARREGOU (`naturalWidth`, que é o
 *      que separa «a tag está lá» de «o arquivo chegou»), é o `.webp` derivado do
 *      PNG e é decorativa (`alt=""` + `aria-hidden`).
 *   3. DIAGRAMA ANTIGO FORA — nenhum dos rótulos dele alcançável no documento.
 *   4. REVEAL — todo `[data-reveal]` visível dentro de escopo aceso, e o portão que
 *      a troca do `motion/react` devolve: o conteúdo nasce VISÍVEL no HTML do
 *      SERVIDOR (medido com JS desligado, que é o único jeito de provar).
 *   5. CONTAGEM — as três métricas fecham nos valores do dado (95%, 0%, 450).
 *   6. CONTRASTE — a pílula `#0060A8` e os textos sobre o navy da Integração.
 *   7. TRANSBORDO a 1440 e 390.
 *   8. MOVIMENTO REDUZIDO NOS DOIS CANAIS — estado final visível e contagem no
 *      valor final (o modo reduzido não pode deixar «0%» preso na tela).
 *
 * Uso: node scripts/medir-fast-sis280.mjs
 */

import { writeFileSync } from 'node:fs';

const PLAYWRIGHT =
  'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/361ceb562f3b3235/node_modules/playwright/index.mjs';
const SHELL =
  process.env.LOCALAPPDATA +
  '/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe';

const BASE = 'http://localhost:3000';
const SAIDA = 'docs/medidas/sis280-fast.json';

const { chromium } = await import(PLAYWRIGHT);
const navegador = await chromium.launch({ executablePath: SHELL });

async function abrir(rota, { largura = 1440, motion = 'full', reduceSistema, js = true } = {}) {
  const ctx = await navegador.newContext({
    viewport: { width: largura, height: 900 },
    javaScriptEnabled: js,
    ...(reduceSistema ? { reducedMotion: 'reduce' } : {}),
  });
  if (js) {
    await ctx.addInitScript((pref) => {
      localStorage.setItem('sistran-motion-preference', pref);
      localStorage.setItem('sistran-motion-preference-seen', '1');
      sessionStorage.setItem('sistran:intro-visto', 'true');
    }, motion);
  }
  const p = await ctx.newPage();
  /* `domcontentloaded`: sob `next dev` o `networkidle` nunca chega (canal de HMR
     aberto) e a sonda morre em timeout. */
  await p.goto(`${BASE}${rota}`, { waitUntil: 'domcontentloaded' });
  if (js) {
    await p.waitForSelector('[data-route-liberado="true"]', { timeout: 60000 });
    await p.addStyleTag({ content: 'nextjs-portal{display:none!important}' });
  }
  await p.waitForTimeout(700);
  return { ctx, p };
}

/* Rola a página inteira para acender todos os escopos e disparar as contagens. */
const varrer = async (p) => {
  await p.evaluate(async () => {
    const passo = window.innerHeight * 0.7;
    for (let y = 0; y < document.body.scrollHeight; y += passo) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 160));
    }
    window.scrollTo(0, document.body.scrollHeight);
  });
  await p.waitForTimeout(1600);
};

/* O INVENTÁRIO DE MECANISMO. É o que as duas rotas têm de ter igual. */
const INVENTARIO = () => {
  const n = (s) => document.querySelectorAll(s).length;
  return {
    escoposReveal: n('[data-reveal-nome]'),
    nomesDeEscopo: [...document.querySelectorAll('[data-reveal-nome]')].map(
      (el) => el.dataset.revealNome,
    ),
    nosReveal: n('[data-reveal]'),
    presets: [...new Set([...document.querySelectorAll('[data-reveal]')].map((el) => el.dataset.reveal))].sort(),
    grade: n('.grade-tecnica'),
    acentos: n('.matchai-acentos'),
    circuitos: n('.matchai-circuito'),
    cartoes: n('.matchai-cartao'),
    halos: n('.matchai-halo'),
    fichas: n('.matchai-ficha'),
    colunas: n('.matchai-coluna'),
    midias: n('.matchai-midia'),
    /* `overflow-hidden` numa `.section-light` desancora a malha `fixed` do
       pseudo-elemento dela (SIS-76). Portão: zero. */
    sectionLightComOverflowHidden: [...document.querySelectorAll('.section-light')].filter(
      (el) => getComputedStyle(el).overflow === 'hidden',
    ).length,
    /* `.grade-tecnica` com `z-index` negativo DENTRO de seção com fundo chapado
       próprio desce para trás do próprio fundo — a armadilha registrada no Match
       AI. Portão: zero. */
    gradeAtrasDoFundo: [...document.querySelectorAll('.grade-tecnica')].filter((g) => {
      const secao = g.closest('section');
      if (!secao) return false;
      const fundo = getComputedStyle(secao).backgroundColor;
      const chapado = fundo !== 'rgba(0, 0, 0, 0)' && fundo !== 'transparent';
      return chapado && Number(getComputedStyle(g).zIndex) < 0;
    }).length,
    secoes: n('section'),
    titulosDeSecao: [...document.querySelectorAll('h1, h2')].map((el) => ({
      texto: el.textContent.trim().slice(0, 48),
      negrito: getComputedStyle(el).fontWeight,
    })),
  };
};

const resultado = { nota: 'gerado por scripts/medir-fast-sis280.mjs' };

/* ── 1. ARQUITETURA: as duas rotas lado a lado ───────────────────────────── */
for (const [chave, rota] of [
  ['fast', '/solucoes/fast'],
  ['matchai', '/solucoes/match-ai'],
]) {
  const { ctx, p } = await abrir(rota);
  await varrer(p);
  resultado[chave] = { inventario: await p.evaluate(INVENTARIO) };
  if (chave === 'fast') {
    /* ── 2. A ARTE DA INTEGRAÇÃO ──────────────────────────────────────────── */
    resultado.fast.arteIntegracao = await p.evaluate(() => {
      const img = [...document.querySelectorAll('img')].find((i) =>
        i.currentSrc.includes('integracaosemfronteira'),
      );
      if (!img) return { existe: false };
      const r = img.getBoundingClientRect();
      const secao = img.closest('section');
      return {
        existe: true,
        src: new URL(img.currentSrc).pathname,
        /* `naturalWidth > 0` é o que separa «a tag está lá» de «o arquivo
           chegou»: caminho errado deixa a tag no DOM e o natural em 0. */
        carregou: img.naturalWidth > 0,
        naturais: [img.naturalWidth, img.naturalHeight],
        renderizada: [Math.round(r.width), Math.round(r.height)],
        decorativa: img.alt === '' && img.getAttribute('aria-hidden') === 'true',
        /* Tem de estar DENTRO da seção «Integração sem Fronteiras», e o texto do
           dado tem de continuar impresso ACIMA dela. */
        naSecaoDaIntegracao: /Integra/i.test(secao?.querySelector('h2')?.textContent ?? ''),
        paragrafosAcima: [...(secao?.querySelectorAll('p') ?? [])].length,
        fundoDaSecao: getComputedStyle(secao).backgroundColor,
      };
    });

    /* ── 3. DIAGRAMA ANTIGO FORA ──────────────────────────────────────────── */
    resultado.fast.diagramaAntigo = await p.evaluate(() => {
      const rotulos = ['Sistemas da seguradora', 'Sistemas de OCR', 'ERPs e outros'];
      const corpo = document.body.innerText;
      return {
        rotulosAlcancaveis: rotulos.filter((r) => corpo.includes(r)),
        /* Nenhum dos rótulos pode voltar por um nó escondido tampouco. */
        rotulosNoHTML: rotulos.filter((r) => document.body.innerHTML.includes(r)),
      };
    });

    /* ── 5. CONTAGEM ──────────────────────────────────────────────────────── */
    resultado.fast.contagem = await p.evaluate(() =>
      [...document.querySelectorAll('[data-contagem]')].map((el) => ({
        estado: el.dataset.contagem,
        valor: el.textContent,
      })),
    );

    /* ── 6. CONTRASTE ─────────────────────────────────────────────────────── */
    resultado.fast.contraste = await p.evaluate(() => {
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
      const medir = (el, nome) =>
        el
          ? {
              nome,
              texto: el.textContent.trim().slice(0, 36),
              cor: getComputedStyle(el).color,
              fundo: fundoReal(el),
              razao: razao(getComputedStyle(el).color, fundoReal(el)),
            }
          : { nome, ausente: true };
      const pilula = [...document.querySelectorAll('a')].find((a) =>
        a.textContent.includes('Conheça o dashboard'),
      );
      const integracao = [...document.querySelectorAll('h2')].find((h) =>
        /Integra/i.test(h.textContent),
      );
      return [
        medir(pilula, 'pilula-dashboard'),
        medir(integracao, 'titulo-integracao'),
        medir(integracao?.parentElement.querySelector('p'), 'texto-integracao'),
        medir(
          [...document.querySelectorAll('a')].find((a) => a.textContent.includes('Saiba mais')),
          'link-saiba-mais',
        ),
      ];
    });
  }
  await ctx.close();
}

/* ── 4. REVEAL, e o portão que a saída do `motion/react` devolve ──────────── */
{
  const { ctx, p } = await abrir('/solucoes/fast');
  await varrer(p);
  resultado.fast.reveal = await p.evaluate(() => {
    const nos = [...document.querySelectorAll('[data-reveal]')].map((el) => ({
      preset: el.dataset.reveal,
      escopo: el.closest('[data-reveal-nome]')?.dataset.revealNome ?? null,
      aceso: el.closest('[data-in="true"]') !== null,
      opacity: Number(getComputedStyle(el).opacity),
      naArvore: el.offsetParent !== null,
    }));
    const vivos = nos.filter((n) => n.naArvore);
    return {
      total: nos.length,
      vivos: vivos.length,
      todosEmEscopo: nos.every((n) => n.escopo),
      acenderamTodos: vivos.every((n) => n.aceso),
      nenhumInvisivel: vivos.every((n) => n.opacity > 0.99),
      piorOpacidade: vivos.length ? Math.min(...vivos.map((n) => n.opacity)) : null,
    };
  });
  /* O PORTÃO DA TROCA DE MECANISMO: ninguém pode escrever `transform`/`opacity`
     INLINE. Era isso que o `motion` fazia, e é a colisão que atropelava os presets
     da cascata — o inline vencia e o hover de escala dos cards morria. `--reveal-i`
     é `style` legítimo (custom property), então só os dois nomes contam.
     Mede-se FORA do `evaluate` acima porque é leitura de `el.style`, e não de
     estilo computado: são coisas diferentes e misturá-las na mesma varredura
     convidava a ler o computado por engano. */
  resultado.fast.reveal.inlineTransform = await p.evaluate(
    () =>
      [...document.querySelectorAll('[data-reveal]')].filter(
        (el) => el.style.transform !== '' || el.style.opacity !== '',
      ).length,
  );
  await ctx.close();
}
{
  /* SEM JAVASCRIPT — o HTML do servidor. É o único jeito de provar que o corpo
     nasce visível, e o ganho que a troca do `motion/react` trouxe. */
  const { ctx, p } = await abrir('/solucoes/fast', { js: false });
  resultado.fast.semJs = await p.evaluate(() => {
    const titulos = [...document.querySelectorAll('h1, h2')].map((el) => el.textContent.trim());
    const arte = [...document.querySelectorAll('img')].some((i) =>
      i.getAttribute('src')?.includes('integracaosemfronteira'),
    );
    return {
      titulos,
      arteNoHtml: arte,
      /* Sem JS o `RevealScope` não acende — o contrato é que o CSS só esconde
         enquanto o escopo diz `data-in="false"`, e sem JS o atributo não existe. */
      nenhumInvisivel: [...document.querySelectorAll('[data-reveal]')].every(
        (el) => Number(getComputedStyle(el).opacity) > 0.99,
      ),
      /* Os números das métricas já vêm escritos do servidor. */
      metricas: [...document.querySelectorAll('[data-contagem]')].map((el) => el.textContent),
      metricasSemJs: [...document.querySelectorAll('.font-mono')].map((el) =>
        el.textContent.trim(),
      ),
    };
  });
  await ctx.close();
}

/* ── 7. TRANSBORDO + CAPTURAS ────────────────────────────────────────────── */
resultado.transbordo = {};
for (const largura of [1440, 390]) {
  const { ctx, p } = await abrir('/solucoes/fast', { largura });
  await varrer(p);
  resultado.transbordo[largura] = await p.evaluate(() => ({
    px: document.documentElement.scrollWidth - window.innerWidth,
    culpados: [...document.querySelectorAll('body *')]
      .filter((el) => el.getBoundingClientRect().right > window.innerWidth + 1)
      .slice(0, 6)
      .map((el) => `${el.tagName}.${el.className?.toString().slice(0, 40)}`),
  }));
  if (largura === 1440) {
    await p.evaluate(() => window.scrollTo(0, 0));
    await p.waitForTimeout(500);
    await p.screenshot({ path: 'docs/capturas/sis280-1440-hero.png' });
    /* A seção da arte, enquadrada nela: é o destaque da issue. */
    const y = await p.evaluate(() => {
      const img = [...document.querySelectorAll('img')].find((i) =>
        i.currentSrc.includes('integracaosemfronteira'),
      );
      return img ? Math.max(0, img.closest('section').offsetTop - 40) : 0;
    });
    await p.evaluate((alvo) => window.scrollTo(0, alvo), y);
    await p.waitForTimeout(800);
    await p.screenshot({ path: 'docs/capturas/sis280-1440-integracao.png' });
    await p.screenshot({ path: 'docs/capturas/sis280-1440-inteira.png', fullPage: true });
  }
  await ctx.close();
}
{
  const { ctx, p } = await abrir('/solucoes/fast', { largura: 390 });
  await varrer(p);
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.waitForTimeout(500);
  await p.screenshot({ path: 'docs/capturas/sis280-390-inteira.png', fullPage: true });
  await ctx.close();
}

/* ── 8. MOVIMENTO REDUZIDO NOS DOIS CANAIS ───────────────────────────────── */
const lerReduce = async (p) => {
  await varrer(p);
  return p.evaluate(() => ({
    atributoMotion: document.documentElement.getAttribute('data-motion'),
    /* O portão que importa: ESTADO FINAL VISÍVEL. Um fallback errado deixaria o
       corpo em `opacity: 0` para sempre. */
    piorRevealOpacidade: Math.min(
      ...[...document.querySelectorAll('[data-reveal]')]
        .filter((el) => el.offsetParent !== null)
        .map((el) => Number(getComputedStyle(el).opacity)),
    ),
    /* E a contagem tem de mostrar o VALOR FINAL, não a origem — «0%» preso na
       tela seria informação errada, não movimento a menos. */
    metricas: [...document.querySelectorAll('[data-contagem]')].map((el) => ({
      estado: el.dataset.contagem,
      valor: el.textContent,
    })),
    /* Os laços de CSS param nos dois canais — a receita mora no `globals.css`. */
    animacoesVivas: [...document.querySelectorAll('.matchai-cartao, .matchai-ficha, .matchai-coluna, .matchai-circuito')]
      .filter((el) => el.getAnimations({ subtree: true }).some((a) => a.playState === 'running'))
      .length,
  }));
};
{
  const { ctx, p } = await abrir('/solucoes/fast', { reduceSistema: true });
  resultado.reduceSistema = await lerReduce(p);
  await ctx.close();
}
{
  const { ctx, p } = await abrir('/solucoes/fast', { motion: 'reduce' });
  resultado.reduceAtributo = await lerReduce(p);
  await ctx.close();
}

await navegador.close();
writeFileSync(SAIDA, JSON.stringify(resultado, null, 2));
console.log(SAIDA);
console.log(
  JSON.stringify(
    {
      inventarioFast: resultado.fast.inventario,
      inventarioMatchAi: resultado.matchai.inventario,
      arteIntegracao: resultado.fast.arteIntegracao,
      diagramaAntigo: resultado.fast.diagramaAntigo,
      reveal: resultado.fast.reveal,
      semJs: resultado.fast.semJs,
      contagem: resultado.fast.contagem,
      contraste: resultado.fast.contraste,
      transbordo: resultado.transbordo,
      reduceSistema: resultado.reduceSistema,
      reduceAtributo: resultado.reduceAtributo,
    },
    null,
    2,
  ),
);
