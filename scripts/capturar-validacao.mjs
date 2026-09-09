/**
 * Capturas de validação da refatoração proporcional
 * (`docs/PROMPT-SISTRAN-PROPORCAO-VISUAL-V2.md`, seção "Validação obrigatória").
 *
 * Os quinze pontos pedidos não são alturas fixas de página: são MOMENTOS de
 * percursos de rolagem cujas alturas mudam a cada ajuste de CSS. Então cada ponto
 * é declarado como "uma fração do percurso deste elemento", e o script resolve a
 * posição em pixels no navegador, já com a página montada — é a única forma de a
 * captura 08 continuar caindo em `01 / 07` depois de alguém mexer na altura da
 * trilha.
 *
 * Uso: node scripts/capturar-validacao.mjs [--tag depois]
 * Requer o servidor de desenvolvimento em BASE_URL (padrão http://localhost:3000).
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3000';
const TAG = (() => {
  const i = process.argv.indexOf('--tag');
  return i > -1 ? process.argv[i + 1] : 'depois';
})();

const VIEWPORTS = [
  { nome: '1440x900', width: 1440, height: 900 },
  { nome: '390x844', width: 390, height: 844 },
];

/**
 * `alvo` é o elemento cujo percurso de rolagem interessa; `f` é a fração desse
 * percurso. Percurso = do momento em que o topo do elemento encosta no topo da
 * janela até o momento em que a base dele encosta na base — a mesma convenção dos
 * `ScrollTrigger` da página (`start: 'top top'`, `end: 'bottom bottom'`), para as
 * frações aqui casarem com as frações que o componente publica.
 *
 * Elementos mais baixos que a janela não têm percurso: aí a fração é ignorada e a
 * captura sai com o elemento centrado.
 */
const PONTOS = [
  { n: '01', nome: 'hero-beat-1', alvo: '#top', f: 0.06 },
  { n: '02', nome: 'hero-beat-3', alvo: '#top', f: 0.72 },
  { n: '03', nome: 'mosaico-meio', alvo: '.mosaic', f: 0.5 },
  { n: '04', nome: 'mosaico-handoff', alvo: '.mosaic', f: 0.94 },
  { n: '05', nome: 'solucao-01', alvo: '.solutions-scroll', f: 0.1 },
  { n: '06', nome: 'solucao-04', alvo: '.solutions-scroll', f: 0.8 },
  { n: '07', nome: 'handoff-solucoes-numeros', alvo: '.solutions-scroll', f: 0.94 },
  { n: '08', nome: 'numero-01-07', alvo: '#resultados', f: 0.18 },
  { n: '09', nome: 'numero-04-07', alvo: '#resultados', f: 0.55 },
  { n: '10', nome: 'numero-07-07', alvo: '#resultados', f: 0.92 },
  { n: '11', nome: 'parceiros-entrada', alvo: '.lp-signals', f: 0 },
  { n: '12', nome: 'luminna-compreender', alvo: '#impacto', f: 0.1 },
  { n: '13', nome: 'luminna-transformar', alvo: '#impacto', f: 0.34 },
  { n: '14', nome: 'luminna-validar', alvo: '#impacto', f: 0.58 },
  { n: '15', nome: 'contato', alvo: '#contato', f: 0.35 },
];

const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Resolve a posição e rola até ela. Em duas etapas, e não numa: a página usa
 * Lenis, e um `scrollTo` instantâneo deixa o scroll suavizado a caminho enquanto o
 * screenshot já saiu. Rolar, esperar o gesto assentar e só então medir de novo é o
 * que faz a captura corresponder ao ponto pedido.
 */
async function irPara(page, { alvo, f }) {
  const y = await page.evaluate(
    ([sel, frac]) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const box = el.getBoundingClientRect();
      const topo = box.top + window.scrollY;
      const percurso = Math.max(0, el.offsetHeight - window.innerHeight);
      return percurso === 0
        ? topo - (window.innerHeight - el.offsetHeight) / 2
        : topo + percurso * frac;
    },
    [alvo, f],
  );
  if (y === null) return false;
  // `__lenis` quando existe: rolar por fora dele deixa a instância a par da nova
  // posição, senão ela puxa a página de volta no quadro seguinte.
  await page.evaluate((destino) => {
    const l = window.__lenis;
    if (l?.scrollTo) l.scrollTo(destino, { immediate: true });
    else window.scrollTo(0, destino);
  }, y);
  /* A Metrics roda com `scrub: 1` — o GSAP leva ~1s para alcançar a posição real —
     e a trilha tem por cima uma transição de `transform`. 900ms capturavam o meio
     do gesto; 1800ms cobrem os dois relógios com folga.
     (Não foi este o motivo de a captura 09 sair vazia: era o `left` do item ativo
     sem o termo `i * vão`, corrigido no `globals.css`. O tempo maior fica porque a
     razão dele é independente e continua válida.) */
  await dormir(1800);
  return true;
}

const dir = `docs/capturas/${TAG}`;
await mkdir(dir, { recursive: true });

const navegador = await chromium.launch();
const erros = [];
const feitas = [];

for (const vp of VIEWPORTS) {
  const ctx = await navegador.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
    // O vídeo do hero e o da Luminna são conduzidos por `currentTime`: sem
    // política de autoplay permissiva o primeiro quadro nunca decodifica e as
    // capturas 01, 02 e 12–14 saem no fundo da seção.
    reducedMotion: 'no-preference',
  });
  /* Duas dispensas, e nenhuma delas muda o que a página faz depois: são as duas
     caixas que aparecem na PRIMEIRA visita e cobririam metade de cada captura.
     - `sistran:intro-visto`: o overlay de abertura.
     - `sistran-motion-preference-seen` + a preferência "active": o diálogo de
       preferências de movimento. "active" é o que este relatório precisa medir —
       é o modo dirigido, o único em que os percursos existem. O default do
       projeto é `'system'`, que numa máquina com a preferência do SO ligada
       devolveria o layout estático e nenhuma das quinze capturas. */
  await ctx.addInitScript(() => {
    sessionStorage.setItem('sistran:intro-visto', '1');
    localStorage.setItem('sistran-motion-preference-seen', '1');
    localStorage.setItem('sistran-motion-preference', 'full');
  });
  const page = await ctx.newPage();
  page.on('console', (m) => {
    if (m.type() === 'error') erros.push(`[${vp.nome}] ${m.text()}`);
  });
  page.on('pageerror', (e) => erros.push(`[${vp.nome}] ${e.message}`));

  await page.goto(BASE_URL, { waitUntil: 'load' });
  // Varredura completa antes de capturar: as seções montam os seus percursos ao
  // entrar em cena, e medir uma trilha que ainda não existe devolve altura zero.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 90));
    }
    window.scrollTo(0, 0);
  });
  await dormir(1200);

  for (const ponto of PONTOS) {
    const ok = await irPara(page, ponto);
    if (!ok) {
      erros.push(`[${vp.nome}] alvo ausente: ${ponto.alvo} (ponto ${ponto.n})`);
      continue;
    }
    const caminho = `${dir}/${vp.nome}-${ponto.n}-${ponto.nome}.png`;
    await page.screenshot({ path: caminho });
    feitas.push(caminho);
  }

  await ctx.close();
}

await navegador.close();

console.log(`capturas: ${feitas.length}`);
for (const c of feitas) console.log('  ' + c);
console.log(`erros de console: ${erros.length}`);
for (const e of erros.slice(0, 20)) console.log('  ' + e);
