/**
 * SIS-177 — confere, na página renderizada, a composição editorial da faixa Celent.
 *
 * Por que sonda: dos itens de aceite e da conferência de `docs/celen.md`, quase
 * nenhum se responde lendo o JSX. «Duas colunas 38–42% / 58–62%», «gap entre 48 e
 * 72px», «nenhum texto sobre a imagem», «os elementos importantes de `cele.png` não
 * foram cortados», «não há scroll horizontal» e «raio entre 18–22px no mobile e
 * 24–32px no desktop» são todos fatos de GEOMETRIA — existem depois de o navegador
 * resolver a rota, e não antes.
 *
 * Três decisões de método:
 *   1. «Sem texto sobre a imagem» é medido por INTERSEÇÃO de retângulos, um a um,
 *      entre cada nó de texto da seção e a caixa da moldura. Conferir que a arte não
 *      é `background-image` não bastaria: um `position: absolute` por cima daria o
 *      mesmo defeito com a imagem sendo elemento.
 *   2. «Não cortou a arte» é medido comparando a proporção da CAIXA renderizada com
 *      a do arquivo (1672/941). Com `object-fit: cover`, recorte é exatamente a
 *      diferença entre as duas proporções; igual a zero, `cover` não tem o que comer.
 *   3. O marcador «PREMIAÇÕES» é CONTADO na rota inteira. O documento manda
 *      preservá-lo e não duplicá-lo — os dois lados do mesmo número.
 *
 * Uso: node scripts/medir-celent-sis177.mjs
 */

import { writeFileSync } from 'node:fs';

const PLAYWRIGHT =
  'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/361ceb562f3b3235/node_modules/playwright/index.mjs';
const SHELL =
  process.env.LOCALAPPDATA +
  '/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe';

const BASE = 'http://localhost:3000';
const SAIDA = 'docs/medidas/celent-sis177.json';

const { chromium } = await import(PLAYWRIGHT);
const navegador = await chromium.launch({ executablePath: SHELL });

async function abrir(largura, { reduzido = false } = {}) {
  const ctx = await navegador.newContext({
    viewport: { width: largura, height: 900 },
    /* Pelo CONTEXTO porque é o que `matchMedia` lê, e é `matchMedia` que o hook
       `useReducedMotion` observa (lição medida na SIS-272). */
    ...(reduzido ? { reducedMotion: 'reduce' } : {}),
  });
  await ctx.addInitScript(() => sessionStorage.setItem('sistran:intro-visto', 'true'));
  const p = await ctx.newPage();
  await p.goto(`${BASE}/quem-somos`, { waitUntil: 'domcontentloaded' });
  await p.waitForSelector('.cel-secao', { timeout: 90000 });
  await p.addStyleTag({ content: 'nextjs-portal{display:none!important}' });
  /* Aquecimento: rolar a rota inteira em passos. Sem isso `scrollIntoView` não sai
     do lugar sob `next dev` e o `whileInView` do reveal nunca dispara — foi o que
     produziu a leitura falsa da SIS-272. */
  await p.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 700) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 70));
    }
  });
  await p.evaluate(() => {
    document.querySelector('.cel-secao')?.scrollIntoView({ block: 'center' });
  });
  /* A entrada mais longa é 0,85s + 0,14s de atraso. 1600ms cobre com folga. */
  await p.waitForTimeout(1600);
  return { ctx, p };
}

const LER = () => {
  const doc = document.documentElement;
  const sec = document.querySelector('.cel-secao');
  const grade = document.querySelector('.cel-grade');
  const col = document.querySelector('.cel-coluna');
  const mold = document.querySelector('.cel-moldura');
  const mascara = document.querySelector('.cel-mascara');
  const img = document.querySelector('.cel-mascara img');
  const r = (n) => (n ? n.getBoundingClientRect() : null);
  const cg = r(grade);
  const cc = r(col);
  const cm = r(mold);
  const ci = r(img);
  const est = (n) => (n ? getComputedStyle(n) : null);
  const eMold = est(mold);

  /* ── NENHUM TEXTO SOBRE A IMAGEM ──────────────────────────────────────────
     Cada nó de texto NÃO VAZIO da seção vira um retângulo pelo `Range`, e o
     retângulo é cruzado com a caixa da moldura. `Range` e não `getBoundingClientRect`
     do elemento: um `<p>` é bloco e tem a largura da coluna, então a caixa dele pode
     tocar a moldura sem que um único glifo esteja lá. O que importa é a tinta. */
  const sobreposicoes = [];
  if (cm) {
    const andarilho = document.createTreeWalker(sec, NodeFilter.SHOW_TEXT);
    let no;
    while ((no = andarilho.nextNode())) {
      const txt = no.textContent.replace(/\s+/g, ' ').trim();
      if (!txt) continue;
      /* Texto de dentro da própria moldura seria sobreposição por definição —
         e é justamente o que não pode existir, então NÃO é filtrado. */
      const rg = document.createRange();
      rg.selectNodeContents(no);
      for (const caixa of rg.getClientRects()) {
        if (caixa.width === 0 || caixa.height === 0) continue;
        const cruza =
          caixa.left < cm.right - 0.5 &&
          caixa.right > cm.left + 0.5 &&
          caixa.top < cm.bottom - 0.5 &&
          caixa.bottom > cm.top + 0.5;
        if (cruza) {
          sobreposicoes.push({ texto: txt.slice(0, 60), caixa: [caixa.left, caixa.top].map(Math.round) });
          break;
        }
      }
    }
  }

  /* ── RECORTE DA ARTE ──────────────────────────────────────────────────────
     Com `cover`, o recorte é a razão entre a proporção da caixa e a do arquivo.
     1.0 = nada cortado. */
  const propArquivo = img ? img.naturalWidth / img.naturalHeight : null;
  const propCaixa = ci && ci.height ? ci.width / ci.height : null;

  /* Contraste analítico das três tintas contra o fundo resolvido da seção. */
  const lum = (c) => {
    const [r1, g1, b1] = c.map((v) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r1 + 0.7152 * g1 + 0.0722 * b1;
  };
  const rgb = (s) => (s.match(/\d+/g) || []).slice(0, 3).map(Number);
  /* O fundo pintado da seção é gradiente sobre `#f7fbff`; a tinta de base é o que
     está por baixo dos radiais de 8–9% e o pior caso prático para texto escuro. */
  const fundo = [247, 251, 255];
  const razao = (corTexto) => {
    const a = lum(rgb(corTexto));
    const b = lum(fundo);
    const [hi, lo] = a > b ? [a, b] : [b, a];
    return Math.round(((hi + 0.05) / (lo + 0.05)) * 100) / 100;
  };
  const alvos = [
    ['.cel-eyebrow', 'eyebrow'],
    ['.cel-titulo', 'manchete'],
    ['.cel-linha1', 'destaque'],
    ['.cel-linha2', 'complemento'],
  ].map(([sel, nome]) => {
    const n = document.querySelector(sel);
    const e = est(n);
    return {
      nome,
      cor: e?.color ?? null,
      tam: e?.fontSize ?? null,
      peso: e?.fontWeight ?? null,
      contraste: e ? razao(e.color) : null,
      texto: n ? n.textContent.replace(/\s+/g, ' ').trim() : null,
    };
  });

  return {
    janela: doc.clientWidth,
    transbordo: doc.scrollWidth - doc.clientWidth,
    /* A arte é ELEMENTO, não fundo: nenhum destes nós pode ter `background-image`
       com `cele.png`, e o `<img>` tem de existir com aquele `src`. */
    imgSrc: img?.getAttribute('src') ?? null,
    imgNatural: img ? [img.naturalWidth, img.naturalHeight] : null,
    fundoDaSecao: est(sec)?.backgroundColor ?? null,
    fundoImagemNaSecao: [sec, grade, mold]
      .map((n) => est(n)?.backgroundImage ?? '')
      .some((v) => v.includes('cele.png')),
    /* Colunas, em % — com OS DOIS denominadores, porque eles respondem perguntas
       diferentes e o primeiro sozinho engana. `doVao` divide pela largura da grade,
       que INCLUI o `gap` de até 72px: as duas fatias somam ~88%, e nenhuma cabe na
       faixa pedida por um motivo que não é da coluna. `dasColunas` divide pela soma
       das duas caixas, que é o que «38–42% / 58–62%» quer dizer — duas faixas que
       somam 100%. É este par que tem de fechar em 40/60. */
    gradeW: cg ? Math.round(cg.width) : null,
    colunas:
      cg && cc && cm
        ? {
            doVao: {
              texto: Math.round((cc.width / cg.width) * 1000) / 10,
              imagem: Math.round((cm.width / cg.width) * 1000) / 10,
            },
            dasColunas: {
              texto: Math.round((cc.width / (cc.width + cm.width)) * 1000) / 10,
              imagem: Math.round((cm.width / (cc.width + cm.width)) * 1000) / 10,
            },
            larguras: [Math.round(cc.width), Math.round(cm.width)],
          }
        : null,
    /* `gap` real, medido pela distância entre as duas caixas — não pelo computado:
       numa coluna só o `column-gap` continua declarado e não significa nada. */
    vaoEntreColunas: cc && cm && cm.left > cc.right ? Math.round(cm.left - cc.right) : null,
    empilhado: !!(cc && cm && cm.top > cc.bottom - 1),
    /* Ordem do DOM = ordem do mobile. Confere os 5 passos do documento. */
    ordem: Array.from(sec.querySelectorAll('.cel-eyebrow, .cel-titulo, .cel-marca, .cel-linha1, .cel-linha2, .cel-moldura')).map(
      (n) => n.className.split(' ').find((c) => c.startsWith('cel-')),
    ),
    moldura: {
      raio: eMold?.borderRadius ?? null,
      borda: `${eMold?.borderTopWidth} ${eMold?.borderTopColor}`,
      sombra: eMold?.boxShadow ?? null,
      overflow: eMold?.overflow ?? null,
      objectFit: est(img)?.objectFit ?? null,
      caixa: cm ? [Math.round(cm.width), Math.round(cm.height)] : null,
      /* Recuo lateral da moldura no mobile (o documento pede ≥20px). */
      recuoEsq: cm ? Math.round(cm.left) : null,
      recuoDir: cm ? Math.round(doc.clientWidth - cm.right) : null,
    },
    recorte: {
      propArquivo: propArquivo ? Math.round(propArquivo * 1000) / 1000 : null,
      propCaixa: propCaixa ? Math.round(propCaixa * 1000) / 1000 : null,
      /* Zero = `cover` não recortou nada. */
      desvio: propArquivo && propCaixa ? Math.round(Math.abs(propArquivo - propCaixa) * 1000) / 1000 : null,
    },
    /* A máscara terminou aberta? Um `clip-path` preso no meio esconderia a arte. */
    mascaraFinal: est(mascara)?.clipPath ?? null,
    mascaraOpacidade: est(mascara)?.opacity ?? null,
    /* A entrada terminou? `none` (ou matriz identidade) = o deslizamento de +32px
       da direita chegou ao fim; qualquer translação residual seria arte fora da
       moldura, comida pelo `overflow: hidden`. */
    mascaraTransform: est(mascara)?.transform ?? null,
    imgCarregada: img ? img.complete && img.naturalWidth > 0 : null,
    textoSobreImagem: sobreposicoes,
    tintas: alvos,
    /* O fio ciano do bloco de premiação. */
    fioMarca: est(document.querySelector('.cel-marca'))?.borderInlineStartColor ?? null,
    /* «PREMIAÇÕES» na rota: tem de continuar existindo (marcador lateral) e não
       pode aparecer duas vezes. */
    marcadorPremiacoes: (document.body.innerText.match(/PREMIAÇÕES/gi) || []).length,
    /* O fundo claro e técnico: a malha e os arcos. */
    gradeTecnica: document.querySelectorAll('.cel-secao .grade-tecnica').length,
    secaoClara: sec.classList.contains('section-light'),
  };
};

const resultado = { issue: 'SIS-177', nota: 'gerado por scripts/medir-celent-sis177.mjs' };

for (const largura of [390, 768, 1024, 1280, 1440, 1920]) {
  const { ctx, p } = await abrir(largura);
  resultado[`w-${largura}`] = await p.evaluate(LER);
  await ctx.close();
}

/* ── MOVIMENTO REDUZIDO ───────────────────────────────────────────────────────
   A régua da casa: matar o efeito nunca pode esconder o conteúdo. Aqui o conteúdo
   é a manchete e a arte; com `reduce` as duas têm de estar visíveis e sem recorte
   pendente. */
{
  const { ctx, p } = await abrir(1440, { reduzido: true });
  resultado.movimentoReduzido = {
    preferenciaAtiva: await p.evaluate(
      () => matchMedia('(prefers-reduced-motion: reduce)').matches,
    ),
    ...(await p.evaluate(() => {
      const e = (s) => getComputedStyle(document.querySelector(s));
      const vis = (s) => {
        const c = document.querySelector(s).getBoundingClientRect();
        return c.width > 0 && c.height > 0;
      };
      return {
        colunaOpacidade: e('.cel-coluna').opacity,
        colunaTransform: e('.cel-coluna').transform,
        mascaraClip: e('.cel-mascara').clipPath,
        mascaraOpacidade: e('.cel-mascara').opacity,
        molduraTransform: e('.cel-moldura').transform,
        tudoNaTela: vis('.cel-titulo') && vis('.cel-mascara img'),
      };
    })),
  };
  await ctx.close();
}

await navegador.close();
writeFileSync(SAIDA, `${JSON.stringify(resultado, null, 2)}\n`);
console.log(SAIDA);
for (const largura of [390, 768, 1024, 1280, 1440, 1920]) {
  const m = resultado[`w-${largura}`];
  console.log(
    `\n── ${largura} ──` +
      `\n  transbordo=${m.transbordo} empilhado=${m.empilhado} colunas=${JSON.stringify(m.colunas)} vao=${m.vaoEntreColunas}` +
      `\n  moldura raio=${m.moldura.raio} borda=${m.moldura.borda} fit=${m.moldura.objectFit} caixa=${JSON.stringify(m.moldura.caixa)} recuos=${m.moldura.recuoEsq}/${m.moldura.recuoDir}` +
      `\n  recorte=${JSON.stringify(m.recorte)} mascara=${m.mascaraFinal} op=${m.mascaraOpacidade} tr=${m.mascaraTransform} carregada=${m.imgCarregada}` +
      `\n  textoSobreImagem=${m.textoSobreImagem.length} ${JSON.stringify(m.textoSobreImagem)}` +
      `\n  fundo=${m.fundoDaSecao} celeComoFundo=${m.fundoImagemNaSecao} clara=${m.secaoClara} grade=${m.gradeTecnica} fio=${m.fioMarca}` +
      `\n  img=${m.imgSrc} natural=${JSON.stringify(m.imgNatural)} premiacoes=${m.marcadorPremiacoes}` +
      `\n  ordem=${JSON.stringify(m.ordem)}` +
      `\n  tintas=${JSON.stringify(m.tintas.map((t) => `${t.nome}:${t.cor}@${t.tam}/${t.peso} ${t.contraste}:1`))}`,
  );
}
console.log(`\n── MOVIMENTO REDUZIDO ──\n  ${JSON.stringify(resultado.movimentoReduzido)}`);
