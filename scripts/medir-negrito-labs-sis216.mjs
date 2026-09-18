/* SIS-216 — mede o NEGRITO dos oito pontos que a issue lista em `/sistran-labs`.

   O que precisa ser provado, e por que a leitura é esta:

   • `font-weight` COMPUTADO por ponto. É o número que o navegador resolveu, não
     a classe escrita: `font-bold` numa cascata onde alguém fixou peso depois
     seria classe presente e tela fina.
   • O peso RENDERIZADO, e não só o pedido. `html` declara
     `font-synthesis: none`, então um 700 pedido sobre família sem corte 700 não
     engrossaria nada e o computado continuaria dizendo 700 — mentira que só
     aparece na tela. `document.fonts.check('700 1rem <família>')` responde se o
     corte existe de verdade; a família sai do próprio elemento.
   • A CAIXA ALTA continua onde estava. O item 1 mexeu em dois nós (o `<strong>`
     por fora, o `<span class="uppercase">` por dentro): se o aninhamento tivesse
     saído errado, o texto perderia as maiúsculas em silêncio. `textTransform`
     lido nos dois nós é o que separa as duas responsabilidades.
   • O TEXTO, caractere por caractere. A issue pede «só peso», e o portão
     `copy-lock --check` normaliza espaço — ele não veria uma palavra que mudou
     de lugar dentro da frase. O `textContent` de cada parágrafo, comparado com a
     escrita esperada, é o que fecha isso pelo lado da tela.
   • CONTRASTE do trecho em negrito sobre a folha clara. Peso maior não muda cor,
     mas muda a régua da WCAG (18,66px em 700 já é «texto grande»), e a intro é a
     seção onde a SIS-294 mediu 14,55:1 — o número é reconferido para que a
     afirmação não seja herdada.
   • Nenhuma manchete ganhou LINHA a mais. Peso maior é largura maior: um `h2`
     que passe de duas para três linhas empurraria a seção inteira. */
import sharp from 'sharp';
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/361ceb562f3b3235/node_modules/playwright/index.mjs';

const EXEC =
  process.env.LOCALAPPDATA +
  '/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe';
const URL = 'http://localhost:3000/sistran-labs';

const navegador = await chromium.launch({ executablePath: EXEC });

async function abrir({ largura = 1440, altura = 900 } = {}) {
  const ctx = await navegador.newContext({
    viewport: { width: largura, height: altura },
    deviceScaleFactor: 1,
  });
  await ctx.addInitScript(() => {
    localStorage.setItem('sistran-motion-preference', 'full');
    localStorage.setItem('sistran-motion-preference-seen', '1');
    sessionStorage.setItem('sistran:intro-visto', 'true');
  });
  const p = await ctx.newPage();
  await p.goto(URL, { waitUntil: 'networkidle' });
  await p.waitForSelector('[data-route-liberado="true"]', { timeout: 20000 }).catch(() => {});
  await p.addStyleTag({ content: 'nextjs-portal{display:none!important}' });
  return { ctx, p };
}

const saida = { rota: '/sistran-labs', issue: 'SIS-216' };

const { ctx, p } = await abrir();

/* Rola a página inteira: os `h2` e os cartões estão abaixo da dobra e alguns nós
   só existem depois do reveal do escopo deles. Medir sem isso devolveria peso de
   elemento ainda em transição de `opacity` — o peso não muda, mas a caixa sim, e
   a contagem de linhas é uma das leituras. */
await p.evaluate(async () => {
  for (let y = 0; y < document.documentElement.scrollHeight; y += 500) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 120));
  }
  window.scrollTo(0, 0);
});
await p.waitForTimeout(1200);

saida.pontos = await p.evaluate(() => {
  const linhas = (el) => {
    const s = getComputedStyle(el);
    const alturaDeLinha = parseFloat(s.lineHeight) || parseFloat(s.fontSize) * 1.2;
    return Math.round(el.getBoundingClientRect().height / alturaDeLinha);
  };
  const ler = (rotulo, el, extras = {}) => {
    if (!el) return { rotulo, existe: false };
    const s = getComputedStyle(el);
    const familia = s.fontFamily;
    return {
      rotulo,
      existe: true,
      tag: el.tagName.toLowerCase(),
      texto: el.textContent.replace(/\s+/g, ' ').trim(),
      peso: s.fontWeight,
      corpo: s.fontSize,
      caixa: s.textTransform,
      familia,
      /* O corte 700 existe NESTA família? Com `font-synthesis: none`, se não
         existisse o navegador serviria o mais próximo e o negrito seria só uma
         declaração sem efeito. */
      corte700Existe: document.fonts.check(`700 1rem ${familia}`),
      linhas: linhas(el),
      ...extras,
    };
  };

  const paragrafos = [...document.querySelectorAll('.labs-intro-texto p')];
  const fortes = paragrafos.map((par) => [...par.querySelectorAll('strong')]);

  return [
    /* Capa: o par `title` + `highlight` é UM `<h1>`, então uma leitura só cobre
       «Sistran Labs: Laboratório de Inovação». O `<span>` do highlight é lido à
       parte para provar que ele herda o peso em vez de ter ficado fino. */
    ler('capa-h1', document.querySelector('#topo h1'), {
      pesoDoHighlight: (() => {
        const sp = document.querySelector('#topo h1 span');
        return sp ? getComputedStyle(sp).fontWeight : null;
      })(),
    }),
    ler('intro-1-inteligencia-100', fortes[0]?.[0], {
      /* Dois nós, dois papéis: o `<strong>` de fora pinta peso e não deve ter
         `text-transform`; o `<span>` de dentro pinta caixa alta. */
      caixaDoSpanInterno: fortes[0]?.[0]
        ? getComputedStyle(fortes[0][0].querySelector('span')).textTransform
        : null,
      terminaEm100: /100%$/.test(fortes[0]?.[0]?.textContent.trim() ?? ''),
    }),
    ler('intro-2-testar-desenvolver-homologar', fortes[1]?.[0]),
    ler('intro-3-staff-augmentation', fortes[2]?.[0]),
    ler('intro-3-innovation-that-matters', fortes[2]?.[1]),
    ler('h2-ja-desenvolvemos', document.querySelector('#labs-solucoes')),
    ler('h2-principais-solucoes', document.querySelector('#labs-principais')),
    ...[...document.querySelectorAll('.labs-solucao-nome')].map((h, i) =>
      ler(`cartao-${i + 1}-nome`, h),
    ),
    /* CONTROLES: peças que a issue NÃO nomeia. Se algum destes subir de 400, o
       negrito escapou do escopo pedido. */
    ler('controle-paragrafo-1-inteiro', paragrafos[0]),
    ler('controle-descricao-cartao', document.querySelector('.labs-solucao-texto')),
    ler('controle-guru-nome', document.querySelector('.labs-guru h3')),
  ];
});

/* Texto esperado, caractere por caractere. O `copy-lock` normaliza espaço e não
   enxergaria uma palavra reposicionada dentro da frase; esta comparação sim. */
saida.escritaIntacta = await p.evaluate(() => {
  const esperado = [
    'Formado por uma equipe de nativos digitais, o Sistran Labs é o laboratório de inovações da Sistran. Aqui, as ideias se transformam em verdadeiras soluções assertivas que impulsionam o crescimento das Seguradoras. O Sistran Labs possui foco em Inteligência de Negócios em Seguros 100% voltados ao estudo/aplicação das soluções mais eficientes para transformação digital, utilizando/criando tecnologia disruptiva (DS/AI/ML/cloud/No & Low-code).',
    'O Sistran Labs com sua expertise tecnológica, é a solução ideal para testar, desenvolver e/ou homologar as tecnologias e soluções de negócio mais adequadas com foco em automatizar processos, adicionar segurança, melhorar a experiência do usuário.',
    'Nosso time de experts, amplia a capacidade da Seguradora “Staff Augmentation”, com custos racionais, eventualmente interligando-se aos Labs de referência (da seguradora / internacional), validando e localizando soluções. Selecionamos, treinamos e capacitamos recursos para as seguradoras, recebendo colaboradores e devolvendo profissionais em outro patamar de competência. Estamos falando da excelência operacional certeira de um time especializado em Seguros. “Innovation that matters!”',
  ];
  return [...document.querySelectorAll('.labs-intro-texto p')].map((par, i) => {
    const lido = par.textContent.replace(/\s+/g, ' ').trim();
    return { indice: i + 1, igual: lido === esperado[i], lido };
  });
});

/* Contraste do trecho em negrito sobre a folha clara, reconferido em vez de
   herdado da SIS-294. As duas cores são declaradas (o negrito não muda cor), mas
   o peso muda a régua da WCAG, então o número precisa estar escrito aqui.

   O FUNDO SAI DO RASTER, e isto é correção de uma leitura errada desta própria
   sonda: a 1ª volta lia `--fundo-claro-secao`, que NÃO é uma cor — é uma pilha de
   três `radial-gradient` («radial-gradient(70% 60% at 20% 10%, #0079cb14, …)»), e
   a conta devolveu 1,48, número sem sentido. `background-color` computado também
   não serve (a `.section-light` pinta por `background-image` e devolve
   `rgba(0,0,0,0)` — armadilha já medida na SIS-294). Sobra amostrar o pixel. */
{
  /* A fileira precisa estar NA JANELA antes de amostrar: ver a nota do `clip`. */
  await p.evaluate(() => {
    const fs = [...document.querySelectorAll('.labs-intro-fileira')];
    fs[1].scrollIntoView({ block: 'center' });
  });
  await p.waitForTimeout(800);
  const cor = await p.evaluate(
    () => getComputedStyle(document.querySelector('.labs-intro-texto p strong')).color,
  );
  const ponto = await p.evaluate(() => {
    /* O retalho vai no VÃO ENTRE DUAS FILEIRAS, no meio da largura — e isto
       corrige a 2ª volta desta sonda, que amostrava 40px à esquerda da coluna de
       texto e leu `rgb(190, 212, 230)`: aquele ponto cai sobre o quadrado pálido
       do grafismo de fundo (`.labs-intro-acentos::after`, em `left: 4%` com até
       68px de lado a 1440), não sobre a folha. O vão é a única área da seção que
       nenhuma das camadas ocupa — nem malha, nem quadrado, nem foto, nem texto.
       A fileira precisa estar na janela: `clip` de `screenshot` é em coordenadas
       de viewport e recusa área fora dela. */
    const fs = [...document.querySelectorAll('.labs-intro-fileira')].map((e) =>
      e.getBoundingClientRect(),
    );
    const par = fs.slice(0, -1).map((r, i) => [r, fs[i + 1]]).find(
      ([a, b]) => a.bottom > 0 && b.top < window.innerHeight - 8,
    );
    const [a, b] = par;
    return {
      x: Math.round(window.innerWidth / 2),
      y: Math.round((Math.max(a.bottom, 0) + Math.min(b.top, window.innerHeight)) / 2),
    };
  });
  const retalho = await p.screenshot({ clip: { x: ponto.x, y: ponto.y, width: 8, height: 8 } });
  const { data } = await sharp(retalho).raw().toBuffer({ resolveWithObject: true });
  const folha = `rgb(${data[0]}, ${data[1]}, ${data[2]})`;
  const lum = (rgb) => {
    const [r, g, b] = rgb.match(/[\d.]+/g).slice(0, 3).map(Number);
    const c = [r, g, b].map((v) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  };
  const a = lum(cor);
  const b = lum(folha);
  saida.contraste = {
    corDoNegrito: cor,
    folhaNoRaster: folha,
    amostradoEm: ponto,
    razao: Math.round(((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)) * 100) / 100,
  };
}

saida.barraHorizontal1440 = await p.evaluate(
  () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
);
saida.errosDeConsole = [];
p.on('console', (m) => m.type() === 'error' && saida.errosDeConsole.push(m.text()));

await p.evaluate(() => document.querySelector('#topo').scrollIntoView());
await p.waitForTimeout(700);
await p.screenshot({ path: 'docs/capturas/sis216-1440-capa.png' });
await p.evaluate(() => document.querySelector('#labs-o-que-e').closest('section').scrollIntoView());
await p.waitForTimeout(700);
await p.screenshot({ path: 'docs/capturas/sis216-1440-intro.png' });
await p.evaluate(() => document.querySelector('#labs-solucoes').scrollIntoView());
await p.waitForTimeout(700);
await p.screenshot({ path: 'docs/capturas/sis216-1440-desenvolvemos.png' });
await p.evaluate(() => document.querySelector('#labs-principais').scrollIntoView());
await p.waitForTimeout(700);
await p.screenshot({ path: 'docs/capturas/sis216-1440-principais.png' });
await ctx.close();

await navegador.close();
console.log(JSON.stringify(saida, null, 2));
