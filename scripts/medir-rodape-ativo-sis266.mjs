/**
 * SIS-266 — «footer · item ativo na coluna Navegação conforme a página».
 *
 * `node scripts/medir-rodape-ativo-sis266.mjs`
 *
 * O portão não pode ser "existe `data-ativo` no JSX". Três coisas independentes
 * podem estar erradas com a marcação parecendo certa, e são elas que se medem:
 *
 *  1. EXATAMENTE UM item acende em cada rota da lista, e é o item certo. Um
 *     `startsWith` sem a barra de segmento acenderia dois; comparar `/` por
 *     prefixo acenderia todos.
 *  2. `aria-current="page"` está no ativo E SÓ nele. E na rota FILHA
 *     (`/transformacao-legado`) o pai acende sem `aria-current` — ele não aponta
 *     para a página em que a pessoa está.
 *  3. O CONTRASTE do ativo e do inativo contra o fundo real do rodapé. Real quer
 *     dizer composto: o rodapé é `#1273BC` com 85% de alfa sobre o que estiver
 *     atrás, então ler `background-color` do próprio `<footer>` daria o número
 *     errado. Aqui as camadas são compostas do `<html>` para baixo.
 *
 * As rotas de fora da lista também são medidas: `/` e `/blog` têm de acender ZERO
 * itens da coluna Navegação — é o que a issue pede por escrito.
 */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import { mkdir, writeFile } from 'node:fs/promises';

await mkdir('docs/capturas', { recursive: true });
await mkdir('docs/medidas', { recursive: true });

const BASE = 'http://localhost:3000';
/* Os sete de `NAV_ITEMS`, mais as três de controle: a filha declarada (que acende
   o pai), a home e o blog (que não podem acender nada). */
const ROTAS = [
  ['/quem-somos', 'Quem somos'],
  ['/solucoes', 'Soluções, Serviços e Consultoria'],
  ['/parceiros-e-implementacoes', 'Parceiros e Implementações'],
  ['/eventos-inovacao', 'Eventos & Inovação'],
  ['/esg', 'ESG'],
  ['/trabalhe-conosco', 'Trabalhe conosco'],
  ['/contato', 'Contato'],
  ['/transformacao-legado', 'Soluções, Serviços e Consultoria'],
  ['/sistran-labs', 'Quem somos'],
  ['/', null],
  ['/blog', null],
];
/* Capturas a 1440 em duas rotas da lista (o critério pede ≥2). */
const CAPTURAR = new Set(['/esg', '/contato']);

/* Composição de fundo e contraste, no próprio navegador: é a única forma de saber
   a cor que a pessoa vê atrás de um link que está sobre uma camada translúcida. */
const CONTRASTE = `(a) => {
  const num = (s) => (s.match(/[\\d.]+/g) ?? []).map(Number);
  const sobre = (frente, fundo) => {
    const [r, g, b, al = 1] = frente;
    return [0, 1, 2].map((k) => al * [r, g, b][k] + (1 - al) * fundo[k]);
  };
  let fundo = [255, 255, 255];
  const pilha = [];
  for (let n = a; n; n = n.parentElement) pilha.unshift(n);
  for (const n of [document.documentElement, ...pilha]) {
    const c = num(getComputedStyle(n).backgroundColor);
    if (c.length >= 3 && (c[3] ?? 1) > 0) fundo = sobre(c, fundo);
  }
  const tinta = sobre(num(getComputedStyle(a).color), fundo);
  const lum = (c) => {
    const [r, g, b] = c.map((v) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const l1 = lum(tinta), l2 = lum(fundo);
  return {
    cor: getComputedStyle(a).color,
    peso: getComputedStyle(a).fontWeight,
    fundoComposto: 'rgb(' + fundo.map((v) => Math.round(v)).join(', ') + ')',
    razao: Number(((Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)).toFixed(2)),
    /* O sublinhado ciano do ativo: 'matrix(1, ...)' = aceso, 'matrix(0, ...)' = apagado. */
    sublinhado: getComputedStyle(a, '::after').transform,
    seta: getComputedStyle(a, '::before').opacity,
  };
}`;

const nav = await chromium.launch();
const ctx = await nav.newContext({ viewport: { width: 1440, height: 900 } });
await ctx.addInitScript(() => localStorage.setItem('sistran-motion-preference-seen', '1'));
const res = { rotas: {}, erros: [] };

for (const [rota, esperado] of ROTAS) {
  const p = await ctx.newPage();
  p.on('console', (m) => { if (m.type() === 'error') res.erros.push(`${rota}: ${m.text()}`); });
  await p.goto(BASE + rota, { waitUntil: 'networkidle' });
  await p.waitForSelector('[data-route-content][data-route-liberado="true"]', { timeout: 40000 }).catch(() => null);
  await p.waitForSelector('.lp-rodape-nav a', { timeout: 20000 });

  const lido = await p.evaluate((fonte) => {
    const contraste = eval(fonte);
    const itens = [...document.querySelectorAll('.lp-rodape-nav a')]
      /* A coluna Institucional usa a MESMA classe `lp-rodape-nav`; separar pelo
         título da coluna é o que garante que se mede a coluna certa. */
      .filter((a) => a.closest('.lp-rodape-bloco')?.querySelector('.lp-rodape-titulo')?.textContent?.trim() === 'Navegação');
    const ativos = itens.filter((a) => a.dataset.ativo === 'true');
    const inativo = itens.find((a) => a.dataset.ativo !== 'true');
    return {
      itens: itens.length,
      ativos: ativos.map((a) => a.textContent.trim()),
      comAriaCurrent: itens.filter((a) => a.getAttribute('aria-current') === 'page').map((a) => a.textContent.trim()),
      /* Controle: a coluna Institucional está fora de escopo e tem de continuar
         sem estado nenhum, mesmo em `/blog`. */
      institucionalComEstado: [...document.querySelectorAll('.lp-rodape-nav a')]
        .filter((a) => a.closest('.lp-rodape-bloco')?.querySelector('.lp-rodape-titulo')?.textContent?.trim() === 'Institucional')
        .filter((a) => a.dataset.ativo === 'true' || a.getAttribute('aria-current')).length,
      medidaAtivo: ativos[0] ? contraste(ativos[0]) : null,
      medidaInativo: inativo ? contraste(inativo) : null,
    };
  }, CONTRASTE);

  lido.esperado = esperado;
  lido.confere = esperado === null
    ? lido.ativos.length === 0
    : lido.ativos.length === 1 && lido.ativos[0] === esperado;
  res.rotas[rota] = lido;

  if (CAPTURAR.has(rota)) {
    await p.locator('.lp-rodape-nav').first().evaluate((n) => n.scrollIntoView({ block: 'center', behavior: 'instant' }));
    await p.waitForTimeout(600);
    const nome = rota.replace(/\W+/g, '') || 'home';
    await p.screenshot({ path: `docs/capturas/sis266-rodape-1440-${nome}.png`, clip: { x: 0, y: 0, width: 1440, height: 900 } });
  }
  await p.close();
}

/* O header não pode ter mudado de aparência: `matchActive`/`ramoAtivo` mudaram de
   arquivo, e a issue exige que ele fique visualmente igual. Mede-se o que a
   extração poderia ter quebrado — qual item está aceso e a tinta dele. */
{
  const p = await ctx.newPage();
  await p.goto(`${BASE}/transformacao-legado`, { waitUntil: 'networkidle' });
  await p.waitForTimeout(600);
  res.headerEmFilha = await p.evaluate(() => [...document.querySelectorAll('header nav a')]
    .map((a) => ({ t: a.textContent.trim(), cor: getComputedStyle(a).color, aria: a.getAttribute('aria-current') }))
    .filter((x) => x.cor === 'rgb(255, 255, 255)' || x.aria));
  await p.close();
}

await nav.close();
await writeFile('docs/medidas/rodape-ativo-sis266.json', `${JSON.stringify(res, null, 1)}\n`);
console.log(JSON.stringify(res, null, 1));
