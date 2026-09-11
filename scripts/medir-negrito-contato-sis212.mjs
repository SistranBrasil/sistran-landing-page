/**
 * SIS-212 — o negrito da manchete de /contato cabe na coluna?
 *
 * POR QUE ESTA SONDA EXISTE. Engrossar tipo grande não é decisão de gosto: é
 * decisão de largura. O comentário da grade de /contato em `globals.css` registra
 * que o teto de 5rem do `clamp` existe porque a 85px a linha "formulário e fale"
 * mediria ~520px e transbordaria a coluna de 499px. Negrito alarga o desenho pelo
 * MESMO caminho, então o risco de uma quarta linha (ou de estouro horizontal) é
 * real e tem de ser medido, não estimado.
 *
 * O que se mede, com o negrito real da folha e com ele desligado por injeção
 * (`font-weight: 400`), para a comparação sair do mesmo carregamento:
 *   - número de linhas do h1, por agrupamento dos rects de cada Range de palavra
 *     (contar por altura da caixa erra quando `line-height` é 1.02);
 *   - largura da linha mais larga contra a largura da coluna;
 *   - `documentElement.scrollWidth` contra a janela — estouro horizontal da rota;
 *   - o peso computado, para provar que 700 chegou e é corte carregado.
 */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';

const URL_BASE = process.env.URL_BASE ?? 'http://localhost:3999';
const SEL = '.hero-backdrop--contato .pagehero-entrada h1';

const medir = (sel) => {
  const h1 = document.querySelector(sel);
  const coluna = h1.parentElement;
  /* Linhas por Range de PALAVRA: cada palavra devolve seu próprio rect, e
     palavras na mesma linha compartilham o `top` (tolerância de 4px cobre o
     `span` do highlight, que tem a mesma fonte mas rect próprio). Agrupar por
     `top` dá a contagem de linhas e, somando por grupo, a largura de cada uma. */
  const linhas = new Map();
  const anda = document.createTreeWalker(h1, NodeFilter.SHOW_TEXT);
  for (let no = anda.nextNode(); no; no = anda.nextNode()) {
    const texto = no.textContent;
    const re = /\S+/g;
    for (let m = re.exec(texto); m; m = re.exec(texto)) {
      const r = document.createRange();
      r.setStart(no, m.index);
      r.setEnd(no, m.index + m[0].length);
      const caixa = r.getBoundingClientRect();
      if (!caixa.width) continue;
      const chave = [...linhas.keys()].find((k) => Math.abs(k - caixa.top) < 4) ?? caixa.top;
      const atual = linhas.get(chave) ?? { esq: Infinity, dir: -Infinity, palavras: [] };
      atual.esq = Math.min(atual.esq, caixa.left);
      atual.dir = Math.max(atual.dir, caixa.right);
      atual.palavras.push(m[0]);
      linhas.set(chave, atual);
    }
  }
  const ordenadas = [...linhas.entries()].sort((a, b) => a[0] - b[0]);
  return {
    peso: getComputedStyle(h1).fontWeight,
    fonte: getComputedStyle(h1).fontSize,
    coluna: Math.round(coluna.getBoundingClientRect().width),
    largura: Math.round(h1.getBoundingClientRect().width),
    altura: Math.round(h1.getBoundingClientRect().height),
    linhas: ordenadas.map(([, v]) => ({
      w: Math.round(v.dir - v.esq),
      texto: v.palavras.join(' '),
    })),
    scrollWidth: document.documentElement.scrollWidth,
    janela: window.innerWidth,
  };
};

const navegador = await chromium.launch();
for (const w of [390, 1024, 1280, 1440, 1920]) {
  const contexto = await navegador.newContext({
    viewport: { width: w, height: 900 },
    deviceScaleFactor: 1,
    reducedMotion: 'no-preference',
  });
  await contexto.addInitScript(() => {
    localStorage.setItem('sistran-motion-preference-seen', '1');
  });
  const pagina = await contexto.newPage();
  await pagina.goto(`${URL_BASE}/contato`, { waitUntil: 'domcontentloaded', timeout: 180_000 });
  await pagina.waitForSelector(SEL, { timeout: 180_000 });
  /* A primeira medição cai ANTES das fontes: com a fallback no lugar as larguras
     são outras e a contagem de linhas pode mentir. */
  await pagina.evaluate(() => document.fonts.ready);
  await pagina.waitForTimeout(600);

  const depois = await pagina.evaluate(medir, SEL);
  /* O "antes" é o MESMO carregamento com o peso desligado — comparar contra outra
     execução misturaria variação de layout com o efeito do negrito. */
  await pagina.addStyleTag({ content: `${SEL} { font-weight: 400 !important; }` });
  await pagina.evaluate(() => document.fonts.ready);
  await pagina.waitForTimeout(300);
  const antes = await pagina.evaluate(medir, SEL);

  const linha = (m) =>
    `${m.linhas.length} linhas · mais larga ${Math.max(...m.linhas.map((l) => l.w))}px de ${m.coluna}px de coluna · h1 ${m.altura}px · scrollWidth ${m.scrollWidth}/${m.janela}`;
  console.log(`\n${w}px — fonte ${depois.fonte}`);
  console.log(`  400 (antes): ${linha(antes)}`);
  console.log(`  ${depois.peso} (agora): ${linha(depois)}`);
  for (const l of depois.linhas) console.log(`      "${l.texto}" ${l.w}px`);
  const veredito =
    depois.linhas.length > antes.linhas.length
      ? 'REPROVA — o negrito acrescentou linha'
      : depois.scrollWidth > depois.janela
        ? 'REPROVA — estouro horizontal'
        : Math.max(...depois.linhas.map((l) => l.w)) > depois.coluna
          ? 'ATENÇÃO — linha mais larga que a coluna'
          : 'OK';
  console.log(`  ${veredito}`);
  await contexto.close();
}
await navegador.close();
