/**
 * SIS-214 — "Sobre o Luminna AI" antes de "Desafios no desenvolvimento de software",
 * na home, depois de Números.
 *
 * O que a sonda prova, e por que cada coisa é medida e não olhada:
 *
 *  1. A ORDEM DE LEITURA, lida do DOM em ordem de documento (`.sequence-copy` >
 *     filhos), com o `y` de cada um na tela. Ordem de DOM sozinha não basta: o
 *     `.sequence-copy` é grade, e uma regra de `grid-area` poderia reordenar
 *     visualmente sem tocar no HTML. Por isso saem os dois — ordem do DOM E ordem
 *     por `y`. Elas têm de coincidir.
 *  2. O TEXTO VERBATIM dos três, comparado com `src/data/legacy.ts` pelo próprio
 *     script (`ESPERADO` abaixo), inclusive a grafia `Luminna AI` com espaço.
 *  3. A EMENDA Números -> sequência: três pixels de cada lado da fronteira, na
 *     margem esquerda. Esta issue não mexe em fundo nenhum, então o número serve
 *     para provar que NÃO nasceu listra — é a checagem de não-regressão pedida no
 *     alvo 3 (a faixa branca de Números é a issue irmã SIS-213, fora de escopo).
 *  4. MOVIMENTO REDUZIDO: a mesma leitura com `prefers-reduced-motion: reduce`,
 *     onde o percurso de scroll sai pelo CSS (`.sequence[data-static]`) e o pôster
 *     assume. O que se confere é que os três textos continuam no HTML, visíveis e
 *     na mesma ordem — a régua de `~/.claude/skills/reduced-motion-conteudo`.
 *
 * Capturas: 1440 em três pontos do percurso da `.sequence` (alvo 4 dos critérios),
 * mais uma em movimento reduzido.
 *
 *   node scripts/medir-sequencia-luminna-sis214.mjs
 *   MARCA=depois node scripts/medir-sequencia-luminna-sis214.mjs
 */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import { mkdir } from 'node:fs/promises';
import sharp from 'sharp';

const BASE = process.env.BASE_URL ?? 'http://localhost:3000';
const MARCA = process.env.MARCA ?? 'antes';
const LARGURAS = process.env.LARGURAS ? process.env.LARGURAS.split(',').map(Number) : [1440, 390];
const ALTURA = 900;
const DESTINO = 'docs/capturas/sis214-luminna';
/* Três pontos DENTRO da janela em que a legenda existe. Não passa de 0,55 por
   medição, e não por estimativa: a 0,66 a leitura de 1440 voltou com
   `#todosVisiveis: false` — o `useVisibilityGate` já havia escondido a cópia
   (`visibility: hidden`), porque o `copyFade` do `SHRINK` (0,72) chega antes do
   esperado quando a mola do `useSpring` ainda está atrás do scroll bruto. Medir lá
   provaria "texto ausente" num ponto em que ele está ausente de propósito. */
const FRACOES = [0.04, 0.3, 0.55];

/* Copiado de `src/data/legacy.ts` (`impactSequence`) — se a cópia da página divergir
   daqui, é a página que está errada, e o campo `verbatim` fica `false`. */
const ESPERADO = {
  kicker: 'Desafios no desenvolvimento de software',
  title: 'Sobre o Luminna AI',
  text: 'O Luminna AI representa uma revolução no desenvolvimento de software, proporcionando eficiência, qualidade e rapidez.',
};

const hex = ([r, g, b]) =>
  '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');

const LER = () =>
  [...document.querySelectorAll('.sequence-copy > *')].map((e, i) => {
    const r = e.getBoundingClientRect();
    const c = getComputedStyle(e);
    return {
      dom: i,
      tag: e.tagName.toLowerCase(),
      classe: e.className,
      texto: (e.textContent ?? '').trim(),
      y: Math.round(r.top),
      /* Visível de verdade: `opacity: 0` e `visibility: hidden` também escondem, e
         é justamente por opacidade que esta legenda sai no fim do percurso. */
      visivel:
        r.width > 0 &&
        r.height > 0 &&
        Number(c.opacity) > 0.01 &&
        c.visibility !== 'hidden',
      opacidade: Math.round(Number(c.opacity) * 1000) / 1000,
    };
  });

await mkdir(DESTINO, { recursive: true });
const navegador = await chromium.launch();
const saida = {};

for (const largura of LARGURAS) {
  const bloco = {};
  for (const reduzido of [false, true]) {
    const contexto = await navegador.newContext({
      viewport: { width: largura, height: ALTURA },
      reducedMotion: reduzido ? 'reduce' : 'no-preference',
    });
    const pagina = await contexto.newPage();
    await pagina.addInitScript(() => {
      localStorage.setItem('sistran-motion-preference-seen', '1');
    });
    await pagina.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 180_000 });
    await pagina.waitForSelector('.sequence-copy', { timeout: 180_000 });
    await pagina.addStyleTag({
      content:
        'nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button],[class*=motion-banner],[class*=motion-dialog]{display:none!important}',
    });
    /* Encerra a Fase A do hero (SIS-189): enquanto ela dura, a fração do vídeo vira
       `scrollTo` e arrasta a página de volta — armadilha já medida na SIS-226. */
    await pagina.evaluate(() => {
      window.dispatchEvent(new WheelEvent('wheel', { deltaY: 1, bubbles: true }));
    });
    await pagina.waitForTimeout(900);

    /* ⚠️ MEDIR A CAIXA DEPOIS QUE O LAYOUT ASSENTA, e de novo a cada ponto. A leitura
       feita logo após o `wheel` voltava com `data-dirigindo: null` e um `topo` ~375px
       ABAIXO do real (7347 contra 6972 medidos depois): a home ainda estava crescendo
       (vídeos e imagens acima desta seção). Com o topo velho, a fração 0,55 caía em
       progresso ~0,79 — passado o `SHRINK` (0,72) — e a legenda vinha como
       `visibility: hidden` de verdade. Era medição errada, não defeito de página. */
    const lerCaixa = () => {
      const s = document.querySelector('.sequence');
      const m = document.querySelector('#resultados');
      const r = s.getBoundingClientRect();
      return {
        topo: Math.round(r.top + window.scrollY),
        altura: Math.round(r.height),
        numerosBase: m ? Math.round(m.getBoundingClientRect().bottom + window.scrollY) : null,
        estatico: s.getAttribute('data-static'),
        dirigindo: s.getAttribute('data-dirigindo'),
      };
    };
    await pagina.waitForTimeout(1500);
    const caixa = await pagina.evaluate(lerCaixa);
    const chave = reduzido ? 'reduzido' : 'normal';
    bloco[chave] = { '#caixa': caixa };

    const pontos = reduzido ? [0.04] : FRACOES;
    for (const f of pontos) {
      const agora = await pagina.evaluate(lerCaixa);
      const destino = Math.max(
        0,
        Math.round(agora.topo + f * Math.max(0, agora.altura - ALTURA)),
      );
      /* Em degraus: a `.sequence` é dirigida por `useScroll` + `useSpring`, e a mola
         só converge se houver quadros no caminho — um salto instantâneo deixa o
         `currentTime` do vídeo (e a opacidade da legenda) atrás do destino. */
      const partida = await pagina.evaluate(() => Math.round(window.scrollY));
      for (let d = 1; d <= 10; d += 1) {
        const t = Math.round(partida + ((destino - partida) * d) / 10);
        await pagina.evaluate(([v]) => {
          window.scrollTo({ top: v, behavior: 'auto' });
          window.__lenis?.scrollTo(v, { immediate: true, force: true });
        }, [t]);
        await pagina.waitForTimeout(170);
      }
      await pagina.waitForTimeout(900);

      const itens = await pagina.evaluate(LER);
      const porY = [...itens].sort((a, b) => a.y - b.y).map((i) => i.dom);
      const achar = (frag) => itens.find((i) => i.texto.includes(frag));
      const luminna = achar('Sobre o Luminna AI');
      const desafios = achar('Desafios no desenvolvimento');
      const paragrafo = achar('representa uma revolução');
      bloco[chave][`f${f}`] = {
        rolagem: await pagina.evaluate(() => Math.round(window.scrollY)),
        itens,
        '#ordemPorY': porY,
        '#ordemDoDomBateComOY': JSON.stringify(porY) === JSON.stringify(itens.map((i) => i.dom)),
        '#luminnaAntesDeDesafios':
          luminna && desafios ? luminna.dom < desafios.dom && luminna.y < desafios.y : null,
        '#verbatim': {
          title: luminna?.texto === ESPERADO.title,
          text: paragrafo?.texto === ESPERADO.text,
          kicker: desafios?.texto === ESPERADO.kicker,
        },
        '#todosVisiveis': [luminna, desafios, paragrafo].every((i) => i?.visivel),
      };
      await pagina.screenshot({
        path: `${DESTINO}/${MARCA}-${largura}-${reduzido ? 'reduzido' : `f${f}`}.png`,
      });
    }

    /* Emenda Números -> sequência, na margem esquerda. Caixa relida pelo mesmo motivo
       do aviso acima: a fronteira só está onde o layout assentado diz que está. */
    const caixaEmenda = await pagina.evaluate(lerCaixa);
    bloco[chave]['#caixaEmenda'] = caixaEmenda;
    if (caixaEmenda.numerosBase) {
      const meio = Math.max(0, caixaEmenda.numerosBase - Math.round(ALTURA / 2));
      await pagina.evaluate(([t]) => {
        window.scrollTo({ top: t, behavior: 'auto' });
        window.__lenis?.scrollTo(t, { immediate: true, force: true });
      }, [meio]);
      await pagina.waitForTimeout(700);
      /* A fronteira LIDA AGORA, com a página já nesta posição: `getBoundingClientRect`
         na hora dispensa a aritmética com o `scrollY` e não carrega topo velho. */
      const naTela = await pagina.evaluate(() =>
        Math.round(document.querySelector('#resultados').getBoundingClientRect().bottom),
      );
      if (naTela > 3 && naTela < ALTURA - 3) {
        const tiro = await pagina.screenshot({
          clip: { x: Math.round(largura * 0.03), y: naTela - 3, width: 2, height: 6 },
        });
        const { data, info } = await sharp(tiro).raw().toBuffer({ resolveWithObject: true });
        const cores = [];
        for (let i = 0; i < 6; i += 1) {
          const k = i * info.width * info.channels;
          cores.push([data[k], data[k + 1], data[k + 2]]);
        }
        bloco[chave]['#emendaNumerosSequencia'] = {
          acima: cores.slice(0, 3).map(hex),
          abaixo: cores.slice(3).map(hex),
          degrauRGB: Math.max(...[0, 1, 2].map((c) => Math.abs(cores[2][c] - cores[3][c]))),
        };
      }
    }

    await contexto.close();
  }
  saida[largura] = bloco;
}

await navegador.close();
console.log(JSON.stringify(saida, null, 2));
