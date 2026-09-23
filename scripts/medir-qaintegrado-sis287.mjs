/**
 * SIS-287 — `/solucoes/qa-integrado` medida na rota viva.
 *
 * Adaptada de `medir-smartminer-sis279.mjs` (a issue é irmã dela), com os portões
 * ajustados ao que MUDA nesta rota:
 *
 *  1. MESMA ARQUITETURA DE SEÇÕES do Match AI: as faixas de primeiro nível com
 *     id/âncora e tom, lidas pelo MESMO código nas duas rotas no mesmo passe —
 *     arquitetura igual é contagem e sequência iguais, não parecença.
 *  2. IDENTIDADE PRÓPRIA: nenhum nó `matchai-*` nem `smartminer-*` aqui, e nenhum
 *     `qaintegrado-*` nas duas irmãs (vazamento nos TRÊS sentidos, porque agora há
 *     três irmãs e a issue manda variar contra Match AI *e* Smart Miner).
 *  3. A ESCRITA VEM DO DADO: os cinco cards da grade conferidos caractere a
 *     caractere contra os `items` de `acceleratorPages.ts`, e o texto do fecho
 *     idem. É o portão que prova «só copy do site» em vez de afirmá-lo.
 *  4. CONTRASTE por pixel COMPOSTO (foto + véu + malha + SVG empilhados) nos
 *     `h1`/`h2` e nas duas pílulas ciano. É o número que decide se `#7CCBF3` podia
 *     entrar onde entrou.
 *  5. MOVIMENTO: `stroke-dashoffset` do visto e `background-position` do fio
 *     MUDANDO entre dois quadros do mesmo nó, mais o `rotate` do anel — presença de
 *     `animation-name` não prova movimento.
 *  6. ÂNCORAS: o `id` da faixa de serviços contra `idDoBloco(heading)`, e a
 *     confirmação de que `pageSections` devolve VAZIO para esta slug (nenhuma
 *     parada, logo nenhum indicador a desalinhar).
 *  7. A MARCA NA CAPA: quantas vezes o nome do produto aparece na dobra. É o
 *     defeito declarado no docblock do componente (a placa desenhada no miolo da
 *     arte), e declarar sem medir não vale.
 *  8. OS DOIS CANAIS de movimento reduzido, com os vistos obrigados a ficar
 *     DESENHADOS e a linha do trilho obrigada a ficar visível — portão de conteúdo,
 *     não de movimento.
 *
 * Uso: node scripts/medir-qaintegrado-sis287.mjs   (com o `next dev` em :3000)
 */

import { writeFile } from 'node:fs/promises';

const PLAYWRIGHT =
  'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
const { chromium } = await import(PLAYWRIGHT);
const URL_BASE = 'http://localhost:3000';
const ROTA = '/solucoes/qa-integrado';

/* A ESCRITA ESPERADA, copiada do dado — o portão 3 compara com o que está na tela.
   Se o dado mudar, este arquivo tem de mudar junto: é de propósito, porque um
   portão que lê a mesma variável que o componente não prova nada. */
const ITENS_DO_DADO = [
  'Planejamento e design (cases) de testes desde a concepção do projeto',
  'Testes de funcionalidade, desempenho e segurança',
  'Melhoria contínua dos processos de QA integrado à gestão de ambiente técnico',
  'Automação de testes para garantir eficiência e velocidade',
  'Feedback contínuo e colaboração direta com desenvolvedores',
];
const FECHO_DO_DADO =
  'Com o QA Integrado da Sistran, qualidade e agilidade caminham juntas, garantindo entregas mais rápidas e seguras.';
const TITULO_DA_LISTA = 'Nossos serviços de QA Integrado incluem';
/* `idDoBloco` = NFD + tira diacríticos + minúsculas + não-alfanumérico → `-`. */
const ANCORA_ESPERADA = 'nossos-servicos-de-qa-integrado-incluem';

const luminancia = (css) => {
  const [r, g, b] = css.match(/\d+/g).slice(0, 3).map(Number);
  const c = [r, g, b].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const contraste = (a, b) => {
  const [l1, l2] = [luminancia(a), luminancia(b)];
  return Number(((Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)).toFixed(3));
};

const navegador = await chromium.launch();

/* Recorte 1x1 decodificado no browser: o pixel COMPOSTO é o único número honesto
   quando há foto, véu, malha e SVG empilhados. */
async function pixel(page, x, y) {
  const buf = await page.screenshot({ animations: 'disabled', clip: { x, y, width: 1, height: 1 } });
  return page.evaluate(async (b64) => {
    const img = new Image();
    img.src = `data:image/png;base64,${b64}`;
    await img.decode();
    const c = document.createElement('canvas');
    c.width = 1;
    c.height = 1;
    const ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    return `rgb(${r}, ${g}, ${b})`;
  }, buf.toString('base64'));
}

async function abrir({ largura, reduce, preferencia, rota = ROTA }) {
  const ctx = await navegador.newContext({
    viewport: { width: largura, height: 900 },
    deviceScaleFactor: 1,
    ...(reduce ? { reducedMotion: 'reduce' } : {}),
  });
  await ctx.addInitScript(
    (pref) => {
      localStorage.setItem('sistran-motion-preference-seen', '1');
      if (pref) localStorage.setItem('sistran-motion-preference', pref);
    },
    preferencia ?? null,
  );
  const page = await ctx.newPage();
  const erros = [];
  page.on('console', (m) => m.type() === 'error' && erros.push(m.text()));
  page.on('pageerror', (e) => erros.push(String(e)));
  await page.goto(`${URL_BASE}${rota}`, { waitUntil: 'load', timeout: 90000 });
  /* Hidratação: sem esta espera mede-se o HTML do servidor, sem observador
     montado. */
  await page.waitForTimeout(2500);
  return { ctx, page, erros };
}

const rampa = async (page) => {
  const altura = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < altura; y += 300) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(70);
  }
  await page.waitForTimeout(2200);
};

/* A leitura de arquitetura é GENÉRICA de propósito: ela roda nas três rotas, então
   não pode perguntar por classe de nenhuma. Os grafismos entram por sufixo. */
const arquitetura = (page) =>
  page.evaluate(() => {
    const faixas = [...document.querySelectorAll('main > section, main > nav[aria-labelledby]')];
    return faixas.map((s) => ({
      id: s.id || s.getAttribute('aria-labelledby') || s.tagName,
      tag: s.tagName,
      clara: s.classList.contains('section-light'),
      overflow: getComputedStyle(s).overflow,
      titulo: s.querySelector('h1, h2')?.textContent.trim().slice(0, 44) ?? null,
      cards: s.querySelectorAll('ol > li').length,
      grafismos: {
        acentos: s.querySelector(':scope > [class$="-acentos"]') ? 1 : 0,
        arte: s.querySelector(':scope > svg[class*="-malha"], :scope > svg[class*="-esteira"]')
          ? 1
          : 0,
        malha: s.querySelector(':scope > .grade-tecnica') ? 1 : 0,
      },
    }));
  });

const resultado = {
  esperado: { ITENS_DO_DADO, FECHO_DO_DADO, TITULO_DA_LISTA, ANCORA_ESPERADA },
};

for (const largura of [390, 1440]) {
  const { ctx, page, erros } = await abrir({ largura, reduce: false });
  await rampa(page);

  const faixas = await arquitetura(page);

  /* IDENTIDADE — vazamento de classe e as peças próprias. */
  const identidade = await page.evaluate(() => ({
    nosMatchai: document.querySelectorAll('[class*="matchai-"]').length,
    nosSmartminer: document.querySelectorAll('[class*="smartminer-"]').length,
    nosQaintegrado: document.querySelectorAll('[class*="qaintegrado-"]').length,
    /* A manchete é TEXTO nesta rota (item 1 da issue), ao contrário das irmãs, que
       montam o letreiro em imagem. Então o portão é o inverso do da SIS-279: o `h1`
       tem de ter texto e NÃO ter imagem dentro. */
    manchete: {
      texto: document.querySelector('#topo h1')?.textContent.trim() ?? null,
      peso: document.querySelector('#topo h1')
        ? getComputedStyle(document.querySelector('#topo h1')).fontWeight
        : null,
      temImagem: Boolean(document.querySelector('#topo h1 img')),
    },
    /* Não existe arte de cápsula do QA: o portão registra a AUSÊNCIA, como a
       primeira volta da SIS-279 fez, para a omissão ficar medida e não implícita. */
    carimbos: document.querySelectorAll('.carimbo-batida').length,
    capaDoHero:
      document.querySelector('#topo [data-route-critical-media]')?.getAttribute('src') ?? null,
    selos: document.querySelectorAll('.qaintegrado-selo').length,
    aneis: document.querySelectorAll('.qaintegrado-anel').length,
    fios: document.querySelectorAll('.qaintegrado-fio').length,
    vistos: document.querySelectorAll('.qaintegrado-visto').length,
    casos: document.querySelectorAll('.qaintegrado-caso').length,
    /* Os placeholders declarados: toda imagem de card tem de apontar para a capa do
       cartão da vitrine (item 3: «imagem = capa QA até haver artes»). */
    artesDosCards: [...document.querySelectorAll('.qaintegrado-cartao img')].map((i) =>
      i.getAttribute('src'),
    ),
  }));

  /* A ESCRITA — comparação literal com o dado. */
  const escrita = await page.evaluate(() => ({
    tituloDaLista:
      [...document.querySelectorAll('main h2')]
        .map((h) => h.textContent.trim())
        .find((t) => t.startsWith('Nossos serviços')) ?? null,
    ancoraDaLista:
      [...document.querySelectorAll('main h2')].find((h) =>
        h.textContent.trim().startsWith('Nossos serviços'),
      )?.id ?? null,
    itens: [...document.querySelectorAll('.qaintegrado-cartao p')].map((p) => p.textContent.trim()),
    ordinais: [...document.querySelectorAll('.qaintegrado-ordinal')].map((o) =>
      o.textContent.trim(),
    ),
    titulos: [...document.querySelectorAll('main h1, main h2, main h3')].map((h) =>
      h.textContent.trim(),
    ),
    /* Quantas vezes o nome do produto aparece como TEXTO na página (portão 7, a
       metade mensurável — a outra está desenhada dentro da capa). */
    ocorrenciasDoNomeEmTexto: (document.querySelector('main').innerText.match(/QA Integrado/g) ?? [])
      .length,
    ocorrenciasNaDobra: (
      (document.querySelector('#topo')?.innerText ?? '').match(/QA Integrado/g) ?? []
    ).length,
    fecho:
      [...document.querySelectorAll('main p')]
        .map((p) => p.textContent.trim())
        .find((t) => t.startsWith('Com o QA Integrado da Sistran')) ?? null,
  }));
  escrita.itensBatem =
    JSON.stringify(escrita.itens) ===
    JSON.stringify([
      'Planejamento e design (cases) de testes desde a concepção do projeto',
      'Testes de funcionalidade, desempenho e segurança',
      'Melhoria contínua dos processos de QA integrado à gestão de ambiente técnico',
      'Automação de testes para garantir eficiência e velocidade',
      'Feedback contínuo e colaboração direta com desenvolvedores',
    ]);
  escrita.fechoBate = escrita.fecho === FECHO_DO_DADO;
  escrita.ancoraBate = escrita.ancoraDaLista === ANCORA_ESPERADA;

  /* MOVIMENTO — dois quadros do MESMO nó, com o nó levado ao centro da tela antes
     de medir: laço de elemento fora de quadro corre, mas o valor lido seria de algo
     que ninguém vê. */
  const movimento = await page.evaluate(async () => {
    const dois = async (el, prop) => {
      el.closest('section, nav')?.scrollIntoView({ block: 'center' });
      await new Promise((r) => setTimeout(r, 350));
      const cs = getComputedStyle(el);
      const a = cs[prop];
      await new Promise((r) => setTimeout(r, 420));
      return {
        animacao: cs.animationName,
        quadroA: a,
        quadroB: getComputedStyle(el)[prop],
        /* `display` do nó e do ancestral que o esconde: a malha de casos é
           `display: none` abaixo de `lg` e o fio abaixo de `sm`, por decisão de
           desenho. Animação em nó não renderizado não corre, então sem este campo o
           `0 de 12` medido a 390px pareceria laço morto em vez de peça ausente. */
        display: cs.display,
        visivel: Boolean(el.getClientRects().length),
      };
    };
    const visto = [];
    for (const v of document.querySelectorAll('.qaintegrado-visto')) {
      const d = await dois(v, 'strokeDashoffset');
      visto.push({ ...d, moveu: d.quadroA !== d.quadroB, tracejado: getComputedStyle(v).strokeDasharray });
    }
    const fio = [];
    for (const f of document.querySelectorAll('.qaintegrado-fio')) {
      const d = await dois(f, 'backgroundPositionX');
      fio.push({ ...d, moveu: d.quadroA !== d.quadroB, fundoBase: getComputedStyle(f).backgroundColor });
    }
    const anel = [];
    for (const a of document.querySelectorAll('.qaintegrado-anel')) {
      const d = await dois(a, 'rotate');
      anel.push({ ...d, moveu: d.quadroA !== d.quadroB });
    }
    return { visto, fio, anel };
  });

  /* CONTRASTE — tinta do título contra o pixel composto ao lado dele, mais as duas
     pílulas ciano (fundo próprio, tinta navy). */
  const alvos = await page.evaluate(async () => {
    const out = [];
    for (const n of document.querySelectorAll('main h1, main h2, main button')) {
      n.scrollIntoView({ block: 'center' });
      await new Promise((r) => setTimeout(r, 300));
      const r = n.getBoundingClientRect();
      if (r.top < 0 || r.bottom > window.innerHeight || r.width < 4) continue;
      const cs = getComputedStyle(n);
      out.push({
        alvo: (n.textContent.trim() || n.tagName).slice(0, 34),
        tinta: cs.color,
        /* No botão o fundo é o dele mesmo; nos títulos é a faixa 24px à direita. */
        ponto:
          n.tagName === 'BUTTON'
            ? { x: Math.round(r.left + 6), y: Math.round(r.top + r.height / 2) }
            : {
                x: Math.max(2, Math.min(window.innerWidth - 3, Math.round(r.right + 24))),
                y: Math.round(r.top + r.height / 2),
              },
        scroll: window.scrollY,
      });
    }
    return out;
  });
  const contrastes = [];
  for (const t of alvos) {
    await page.evaluate((y) => window.scrollTo(0, y), t.scroll);
    await page.waitForTimeout(250);
    const fundo = await pixel(page, t.ponto.x, t.ponto.y);
    contrastes.push({ alvo: t.alvo, tinta: t.tinta, fundoComposto: fundo, contraste: contraste(t.tinta, fundo) });
  }

  /* O SUBTÍTULO do hero é tinta branca a 85% sobre a capa + véu — o ponto mais
     apertado da dobra, porque o texto é menor que a manchete e mora sobre foto. */
  let subtituloContraste = null;
  {
    const t = await page.evaluate(() => {
      window.scrollTo(0, 0);
      const p = document.querySelector('#topo p');
      if (!p) return null;
      const r = p.getBoundingClientRect();
      /* CLAMP nos DOIS eixos. A 390px o parágrafo ocupa a largura toda, então
         `right + 20` cai FORA da janela e o recorte 1x1 estoura («clipped area is
         outside the resulting image») — foi o erro da primeira execução. Com a
         borda direita inalcançável, o ponto honesto é o vão à ESQUERDA do texto,
         que é fundo da mesma faixa. */
      const x = Math.round(r.right + 20);
      return {
        tinta: getComputedStyle(p).color,
        x:
          x <= window.innerWidth - 3
            ? x
            : Math.max(2, Math.round(r.left - 8)),
        y: Math.max(2, Math.min(window.innerHeight - 3, Math.round(r.top + r.height / 2))),
      };
    });
    if (t) {
      await page.waitForTimeout(250);
      const fundo = await pixel(page, t.x, t.y);
      subtituloContraste = {
        tinta: t.tinta,
        fundoComposto: fundo,
        contraste: contraste(t.tinta, fundo),
      };
    }
  }

  /* RESÍDUO DA PLACA — o portão que troca a minha leitura da captura por um número.
     A capa tem «QA Integrado✓» desenhado no miolo (defeito declarado no docblock do
     componente) e a faixa escura do trilho passa por cima dela. Duas voltas de véu
     foram julgadas a olho e a segunda estava errada, então aqui o critério é o
     DESVIO de luminância dentro de uma janela da faixa que não contém texto: se o
     contorno da placa sobrevivesse, os pixels claros dela apareceriam como um
     intervalo largo. O que sobra de variação legítima é a grade técnica, que é
     linha de 1px em rgba baixo. */
  let residuoDaPlaca = null;
  {
    /* O scroll vai num passe SEPARADO da medição: `scrollIntoView` no mesmo
       `evaluate` devolve retângulos da posição ANTIGA, e foi assim que a janela caiu
       fora da imagem na primeira execução deste portão. */
    await page.evaluate(() => {
      const faixa = [...document.querySelectorAll('main > section')].find(
        (s) => !s.classList.contains('section-light') && s.id !== 'topo',
      );
      faixa?.scrollIntoView({ block: 'center' });
    });
    await page.waitForTimeout(400);
    const janela = await page.evaluate(() => {
      const faixa = [...document.querySelectorAll('main > section')].find(
        (s) => !s.classList.contains('section-light') && s.id !== 'topo',
      );
      if (!faixa) return null;
      const r = faixa.getBoundingClientRect();
      const rp = faixa.querySelector('p')?.getBoundingClientRect();
      /* À DIREITA do parágrafo e na altura dele: é onde a placa mora e onde não há
         tinta branca de texto para contaminar a amostra. A 390px o parágrafo ocupa a
         largura toda, então «à direita» não existe — ali a janela desce para o vão
         ABAIXO do parágrafo, que é fundo da mesma faixa e serve igual. */
      const cabeADireita = rp ? rp.right + 24 < window.innerWidth - 12 : false;
      let x = Math.round(cabeADireita ? rp.right + 24 : Math.max(r.left + 8, 2));
      let y = Math.round(cabeADireita ? rp.top : (rp ? rp.bottom + 12 : r.top + r.height * 0.3));
      /* CLAMP nos dois eixos, e só depois o tamanho: recorte tem de caber inteiro na
         janela, senão o Playwright estoura («clipped area outside the image»). */
      x = Math.max(0, Math.min(x, window.innerWidth - 10));
      y = Math.max(0, Math.min(y, window.innerHeight - 10));
      const largura = Math.max(8, Math.min(240, window.innerWidth - x - 2));
      const altura = Math.max(8, Math.min(70, Math.min(r.bottom, window.innerHeight) - y - 2));
      /* CONTAMINAÇÃO: a janela só mede o resíduo da placa se dentro dela não houver
         tinta de conteúdo. A 390px o vão abaixo do parágrafo encosta nos passos do
         trilho e a amostra pegou texto branco (luma 216 num fundo de luma 22) — o
         número existia e não media nada. Então a varredura é declarada: se qualquer
         ponto da grade cair sobre nó com texto, o portão devolve `contaminada` em vez
         de uma amplitude que pareceria defeito de véu. */
      let contaminada = false;
      for (let px = x + 4; px < x + largura && !contaminada; px += 24) {
        for (let py = y + 4; py < y + altura && !contaminada; py += 12) {
          for (const no of document.elementsFromPoint(px, py)) {
            if (no.tagName === 'MAIN' || no.tagName === 'BODY' || no.tagName === 'HTML') break;
            const proprio = [...no.childNodes].some(
              (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim().length > 0,
            );
            if (proprio) {
              contaminada = true;
              break;
            }
          }
        }
      }
      return { x, y, largura, altura, faixa: faixa.id || null, cabeADireita, contaminada };
    });
    if (janela && janela.largura >= 8 && janela.altura >= 8) {
      await page.waitForTimeout(250);
      const buf = await page.screenshot({
        animations: 'disabled',
        clip: { x: janela.x, y: janela.y, width: janela.largura, height: janela.altura },
      });
      const stats = await page.evaluate(
        async ({ b64, w, h }) => {
          const img = new Image();
          img.src = `data:image/png;base64,${b64}`;
          await img.decode();
          const c = document.createElement('canvas');
          c.width = w;
          c.height = h;
          const ctx = c.getContext('2d');
          ctx.drawImage(img, 0, 0);
          const d = ctx.getImageData(0, 0, w, h).data;
          let min = 255;
          let max = 0;
          let soma = 0;
          const total = d.length / 4;
          for (let i = 0; i < d.length; i += 4) {
            /* Luma simples basta: o que se procura é pixel CLARO sobrevivente. */
            const l = 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
            if (l < min) min = l;
            if (l > max) max = l;
            soma += l;
          }
          return {
            minLuma: Number(min.toFixed(2)),
            maxLuma: Number(max.toFixed(2)),
            mediaLuma: Number((soma / total).toFixed(2)),
            amplitude: Number((max - min).toFixed(2)),
          };
        },
        { b64: buf.toString('base64'), w: janela.largura, h: janela.altura },
      );
      /* DOIS descartes, e os dois são resultado, não falha:
         - sem vão à direita do parágrafo (390px), a janela desce sobre os passos do
           trilho, onde selo, anel e ícone são tinta CLARA legítima. Medi assim uma
           vez e deu amplitude 194 com a placa já apagada — o número acusava o
           grafismo, não o resíduo. A varredura de texto não pega isso porque anel e
           ícone não têm nó de texto, daí o descarte por largura.
         - janela com texto dentro, pelo mesmo motivo.
         O portão vale onde a pergunta existe: 1440px, onde a placa da capa cai no
         miolo da faixa e há fundo limpo à direita do parágrafo. */
      residuoDaPlaca = !janela.cabeADireita
        ? {
            janela,
            motivo:
              'sem vao livre a direita do paragrafo nesta largura: a janela cairia sobre selo/anel/icone do trilho, que sao tinta clara de grafismo e nao residuo da placa',
          }
        : janela.contaminada
          ? { janela, motivo: 'janela com tinta de conteudo dentro: amostra descartada' }
          : { janela, ...stats };
    }
  }

  await page.screenshot({
    path: `docs/capturas/sis287-qa-integrado-${largura}.png`,
    fullPage: true,
    animations: 'disabled',
  });

  resultado[`w${largura}`] = {
    faixas,
    identidade,
    escrita,
    movimento,
    contrastes,
    subtituloContraste,
    residuoDaPlaca,
    erros,
  };
  await ctx.close();
}

/* A ARQUITETURA DAS IRMÃS, medida no mesmo passe: «mesma estrutura» só é portão se
   os dois lados forem lidos pelo mesmo código. E o vazamento é conferido nas duas,
   porque a issue manda variar contra Match AI *e* Smart Miner. */
for (const irma of ['match-ai', 'smart-miner']) {
  const { ctx, page } = await abrir({ largura: 1440, reduce: false, rota: `/solucoes/${irma}` });
  await rampa(page);
  resultado[`irma-${irma}`] = {
    faixas: await arquitetura(page),
    vazamentoDaqui: await page.evaluate(
      () => document.querySelectorAll('[class*="qaintegrado-"]').length,
    ),
  };
  await ctx.close();
}

/* Uma slug genérica intacta (critério: «outras slugs genéricas intactas»). */
{
  const { ctx, page, erros } = await abrir({ largura: 1440, reduce: false, rota: '/solucoes/lumina-ai' });
  resultado.genericaIntacta = {
    faixas: await arquitetura(page),
    temTopo: await page.evaluate(() => Boolean(document.querySelector('#topo'))),
    corposProprios: await page.evaluate(
      () =>
        document.querySelectorAll(
          '[class*="qaintegrado-"], [class*="smartminer-"], [class*="matchai-"]',
        ).length,
    ),
    erros,
  };
  await ctx.close();
}

/* O INDICADOR LATERAL: a conclusão do docblock («esta slug tem um `heading` só, o
   filtro `>= 3` devolve VAZIO, logo não há ScrollSpy») é afirmação sobre a rota
   viva, então é medida. A comparação com uma slug que TEM paradas é o controle —
   sem ela, «zero nós» poderia ser o indicador quebrado no site inteiro. */
{
  const conta = (page) =>
    page.evaluate(
      () =>
        document.querySelectorAll('[class*="scrollspy"], [data-scrollspy], nav[aria-label*="Seç"]')
          .length,
    );
  const aqui = await abrir({ largura: 1440, reduce: false });
  const indicadorAqui = await conta(aqui.page);
  await aqui.ctx.close();
  const controle = await abrir({ largura: 1440, reduce: false, rota: '/solucoes/match-ai' });
  const indicadorNoControle = await conta(controle.page);
  await controle.ctx.close();
  resultado.indicador = { indicadorAqui, indicadorNoControle };
}

/* MOVIMENTO REDUZIDO — os dois canais. */
for (const canal of ['media', 'preferencia']) {
  const { ctx, page, erros } = await abrir({
    largura: 1440,
    reduce: canal === 'media',
    preferencia: canal === 'preferencia' ? 'reduce' : null,
  });
  const atributo = await page.evaluate(() => document.documentElement.dataset.motion ?? null);
  await rampa(page);
  const d = await page.evaluate(() => {
    const ler = (sel) =>
      [...document.querySelectorAll(sel)].map((e) => {
        const cs = getComputedStyle(e);
        return {
          animacao: cs.animationName,
          opacidade: cs.opacity,
          traco: cs.strokeDashoffset,
          fundo: cs.backgroundImage.slice(0, 18),
          corDeFundo: cs.backgroundColor,
          /* `display` entra porque ele explica «não moveu» sem laço morto: a malha de
             casos é `display: none` abaixo de `lg` e o fio abaixo de `sm`, por
             decisão de desenho — e animação em nó não renderizado não corre. Sem
             este campo, a leitura de 390px pareceria defeito. */
          display: cs.display,
        };
      });
    return {
      visto: ler('.qaintegrado-visto'),
      caso: ler('.qaintegrado-caso'),
      fio: ler('.qaintegrado-fio'),
      cartao: ler('.qaintegrado-cartao'),
      selo: ler('.qaintegrado-selo'),
      anel: ler('.qaintegrado-anel'),
    };
  });
  resultado[`reduce-${canal}`] = {
    atributoNoHtml: atributo,
    animacoesVivas: ['visto', 'fio', 'cartao', 'selo', 'anel'].reduce((acc, k) => {
      acc[k] = d[k].filter((x) => x.animacao !== 'none').length;
      return acc;
    }, {}),
    /* PORTÃO DE CONTEÚDO: o visto tem de parar DESENHADO (deslocamento 0), não
       apagado — o grafismo é «casos aprovados». */
    /* `parseFloat` e NÃO `Number`: `strokeDashoffset` computado vem com unidade
       (`"0px"`), e `Number('0px')` é `NaN` — a primeira execução deste portão
       acusou 0 de 12 vistos desenhados por causa disso, com o CSS certo. */
    vistosDesenhados: d.visto.filter((v) => parseFloat(v.traco) === 0).length,
    totalDeVistos: d.visto.length,
    vistosVisiveis: d.visto.every((v) => Number(v.opacidade) === 1),
    casosVisiveis: d.caso.every((c) => Number(c.opacidade) === 1),
    /* A CONTA sai, mas a LINHA do trilho fica: ela vem da cor de fundo do JSX, e é
       ela que liga um passo ao outro. */
    fioSemConta: d.fio.every((f) => f.fundo.startsWith('none')),
    fioComLinha: d.fio.every((f) => f.corDeFundo !== 'rgba(0, 0, 0, 0)'),
    fio: d.fio,
    aneisVisiveis: d.anel.every((a) => Number(a.opacidade) === 1),
    erros,
  };
  await ctx.close();
}

await navegador.close();
await writeFile('docs/medidas/sis287-qa-integrado.json', `${JSON.stringify(resultado, null, 2)}\n`);
console.log(JSON.stringify(resultado, null, 2));
