/**
 * Medição proporcional de TODAS as rotas.
 *
 * A refatoração proporcional (`docs/PROMPT-SISTRAN-PROPORCAO-VISUAL-V2.md`) tem
 * partitura escrita só para a home. Para as outras quinze rotas não há alvo
 * numérico, então o critério aqui é outro: em vez de comparar com um número
 * pedido, este script MEDE e expõe as três coisas que o documento trata como
 * defeito onde quer que apareçam —
 *
 *  1. título que não domina a entrada (`fracaoLargura` baixa, `px` pequeno);
 *  2. superfície única saturada (mesma cor de fundo em todas as seções);
 *  3. vazamento horizontal em 390px (o `scrollWidth > innerWidth` que produziu
 *     o `solucoes:midia` de 700px na home).
 *
 * Medir antes de editar é o que evitou, no bug do quadro `01 / 07`, "corrigir"
 * pela aparência: lá o número (x≈7px contra aresta em 90px) é que nomeou a
 * causa. Mesmo procedimento aqui.
 *
 * Uso: node scripts/medir-rotas.mjs [--tag antes]
 */
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3000';
const TAG = (() => {
  const i = process.argv.indexOf('--tag');
  return i > -1 ? process.argv[i + 1] : 'antes';
})();

const ROTAS = [
  '/',
  '/quem-somos',
  '/solucoes',
  // Uma das sete páginas de acelerador (`ACCELERATOR_PAGES`), como amostra da
  // rota dinâmica: as sete compartilham o mesmo componente, então medir uma mede
  // as sete. `core-de-seguros` era um palpite e devolvia 404.
  '/solucoes/match-ai',
  '/transformacao-legado',
  '/parceiros-e-implementacoes',
  '/sistran-labs',
  '/sistran-university',
  '/esg',
  '/eventos-inovacao',
  '/blog',
  '/contato',
  '/trabalhe-conosco',
  '/politica-de-privacidade',
  '/relatorio-de-transparencia-salarial',
];

const VIEWPORTS = [
  { nome: '1440x900', width: 1440, height: 900 },
  { nome: '390x844', width: 390, height: 844 },
];

const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

/** Roda no navegador. Devolve só números — nada de nós do DOM. */
function coletar() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const num = (v) => Math.round(parseFloat(v) * 10) / 10;

  const h1 = document.querySelector('h1');
  const heroSec = h1?.closest('section');
  const cs = h1 ? getComputedStyle(h1) : null;

  /* Superfícies: a cor de fundo efetiva de cada seção de primeiro nível. O
     documento pede "progressão de superfície", e a forma de ver que ela não
     existe é contar quantas cores DISTINTAS a página usa. `transparent` é
     ignorado porque nesse caso a seção herda a cor de quem está atrás. */
  /* Conta cor E gradiente. Ler só `backgroundColor` mediu `sup=0` numa página
     que já tinha painéis pintados: as superfícies do projeto (`--fundo-marca`,
     `--fundo-solucoes`, `.section-light`) são gradientes, e para elas
     `backgroundColor` fica `transparent`. Uma métrica cega ao gradiente
     reportaria "nenhuma superfície" para sempre, inclusive depois da correção. */
  const superficies = [];
  for (const s of document.querySelectorAll('main > section, main > div > section')) {
    const e = getComputedStyle(s);
    const cor = e.backgroundColor !== 'rgba(0, 0, 0, 0)' ? e.backgroundColor : '';
    const img = e.backgroundImage !== 'none' ? e.backgroundImage.slice(0, 70) : '';
    const chave = (cor + '|' + img).trim();
    if (chave !== '|' && !superficies.includes(chave)) superficies.push(chave);
  }

  /* Vazamento horizontal: o elemento mais largo que a janela. Reporta o pior
     caso com seletor legível, porque `scrollWidth` do documento só diz QUE
     vaza, não quem vaza. */
  let pior = null;
  for (const el of document.querySelectorAll('main *')) {
    const r = el.getBoundingClientRect();
    if (r.width <= vw + 1) continue;
    if (!pior || r.width > pior.largura) {
      const cls = typeof el.className === 'string' ? el.className.slice(0, 60) : '';
      pior = { alvo: el.tagName.toLowerCase() + (cls ? '.' + cls.trim().split(/\s+/)[0] : ''), largura: num(r.width) };
    }
  }

  return {
    vw,
    alturaPagina: document.body.scrollHeight,
    alturaEmVh: Math.round((document.body.scrollHeight / vh) * 100) / 100,
    documentoVaza: document.documentElement.scrollWidth > vw + 1,
    piorVazamento: pior,
    superficies,
    titulo: h1
      ? {
          texto: h1.textContent.trim().slice(0, 48),
          px: num(cs.fontSize),
          altura: num(h1.getBoundingClientRect().height),
          largura: num(h1.getBoundingClientRect().width),
          fracaoLargura: Math.round((h1.getBoundingClientRect().width / vw) * 1000) / 1000,
          /* Quanto da janela a entrada ocupa. O documento trata "entrada que não
             ocupa a tela" como defeito de proporção. */
          fracaoAlturaHero: heroSec
            ? Math.round((heroSec.getBoundingClientRect().height / vh) * 1000) / 1000
            : null,
        }
      : null,
    secoes: document.querySelectorAll('main > section, main > div > section').length,
  };
}

const medidas = {};
const erros = [];

const navegador = await chromium.launch();

for (const vp of VIEWPORTS) {
  const ctx = await navegador.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
    reducedMotion: 'no-preference',
  });
  // Mesmas três dispensas do script de capturas: o overlay de abertura e o
  // diálogo de preferência de movimento cobririam a entrada de cada rota.
  await ctx.addInitScript(() => {
    sessionStorage.setItem('sistran:intro-visto', '1');
    localStorage.setItem('sistran-motion-preference-seen', '1');
    localStorage.setItem('sistran-motion-preference', 'full');
  });
  const page = await ctx.newPage();
  page.on('console', (m) => {
    if (m.type() === 'error') erros.push(`[${vp.nome}] ${m.text().slice(0, 160)}`);
  });
  page.on('pageerror', (e) => erros.push(`[${vp.nome}] ${e.message.slice(0, 160)}`));

  for (const rota of ROTAS) {
    const resposta = await page.goto(BASE_URL + rota, { waitUntil: 'load' });
    if (!resposta || resposta.status() >= 400) {
      erros.push(`[${vp.nome}] ${rota} -> HTTP ${resposta?.status()}`);
      continue;
    }
    await dormir(700);
    const m = await page.evaluate(coletar);
    medidas[`${vp.nome} ${rota}`] = m;
  }

  await ctx.close();
}

await navegador.close();

await mkdir('docs/medidas', { recursive: true });
const caminho = `docs/medidas/medidas-rotas-${TAG}.json`;
await writeFile(caminho, JSON.stringify(medidas, null, 2));

console.log(`escrito: ${caminho}`);
for (const [k, m] of Object.entries(medidas)) {
  const t = m.titulo;
  console.log(
    `${k.padEnd(48)} h=${String(m.alturaEmVh).padStart(6)}vh  secoes=${String(m.secoes).padStart(2)}  ` +
      `sup=${m.superficies.length}  h1=${t ? t.px + 'px f' + t.fracaoLargura : '—'}  ` +
      `hero=${t?.fracaoAlturaHero ?? '—'}  ${m.documentoVaza ? 'VAZA ' + (m.piorVazamento?.alvo ?? '') + ' ' + (m.piorVazamento?.largura ?? '') : ''}`,
  );
}
console.log(`erros de console: ${erros.length}`);
for (const e of [...new Set(erros)].slice(0, 25)) console.log('  ' + e);
