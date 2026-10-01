/**
 * Diferenciais de `/quem-somos` — portões medidos do pedido de 23/09.
 *
 * Não há issue no Linear para esta peça: a abertura falhou com «You've exceeded the
 * free issue limit for this workspace». Os números vão para o relatório no chat e
 * ficam gravados em `docs/medidas/diferenciais-seis.json`.
 *
 * O que ele mede, e por que cada portão existe:
 *
 * · `contratos` — `aria-labelledby` tem de continuar RESOLVENDO num nó de texto, o
 *   `id="diferenciais-6"` tem de existir uma única vez na rota, e a lista tem de
 *   continuar `ul`/`li`. A seção mudou de arquivo; a semântica não pode ter mudado
 *   com ela. Apontar para `id` inexistente deixa a seção sem nome e não dá erro.
 * · `cartoes` — o pedido, item por item: SEIS cartões, SEIS ícones, `border-radius`
 *   maior que zero, `box-shadow` presente e — o que é fácil esquecer — NENHUM
 *   `clip-path` (o chanfro recorta depois do raio e devolve o canto reto, então
 *   raio declarado com chanfro vivo é raio que não aparece). Ícone `aria-hidden`.
 * · `emenda` — o item «o fundo que a parte tecnologia exatamente igual para para ser
 *   continuação». Computado NÃO serve de prova, e copiar a declaração de Tecnologias
 *   seria justamente o erro: o degradê dela é `180deg` e termina em `#e5f4ff`; uma
 *   cópia literal recomeçaria em `#f8fcff` colada nela. Então se lê PIXEL, 3px acima
 *   e 3px abaixo da fronteira, em sete colunas. Acima de ~12 de ΔRGB o olho vê a
 *   costura. Mede também se as duas seções são IRMÃS de fato — continuidade não
 *   existe com algo no meio.
 * · `gradePinta` — a grade de 1px a 7% é sutil de propósito, e sutil é indistinguível
 *   de morta no computado. Fotografa, esconde a camada, fotografa de novo e conta
 *   pixel diferente. Zero = camada morta.
 * · `contraste` — a frase e o título sobre o cartão claro novo, pela receita da casa:
 *   cor pelo computado, fundo pelo PIXEL da captura, média de um bloco de 5px E o
 *   pior pixel (média esconde reprovação em texto pequeno).
 * · `transbordo` — no `documentElement`, onde «sem overflow horizontal» vale.
 * · `escritaPreservada` — as seis frases publicadas continuam no DOM, palavra por
 *   palavra. A lista é literal de propósito: derivada do DOM, aprovaria tudo.
 * · `movimentoReduzido` — os dois canais (media query e `html[data-motion]`), com o
 *   portão simétrico da casa: nada animado E os seis cartões VISÍVEIS. Reveal que
 *   morre em `opacity: 0` é conteúdo apagado.
 *
 * Uso: URL_BASE=http://localhost:3000 node scripts/medir-diferenciais.mjs
 */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/361ceb562f3b3235/node_modules/playwright/index.mjs';
import { mkdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const URL_BASE = process.env.URL_BASE ?? 'http://localhost:3000';
const ROTA = `${URL_BASE}/quem-somos`;
const PASTA = 'docs/capturas';
const MEDIDAS = 'docs/medidas';
await mkdir(PASTA, { recursive: true });
await mkdir(MEDIDAS, { recursive: true });

const LARGURAS = [
  { nome: '1440', width: 1440, height: 960 },
  { nome: '768', width: 768, height: 900 },
  { nome: '390', width: 390, height: 844 },
];

const FRASES = [
  'Especialização em Seguradoras',
  'Atendimento de nível global, custo local',
  'Estrutura sólida e perene: mais de 45 anos de vida',
  'Clientes Sistran processam 1/3 dos prêmios de Seguro de Vida no Brasil',
  'Conhecimento de regulações da Susep',
  'Metodologias e frameworks mundiais',
];

const lum = ([r, g, b]) => {
  const f = [r, g, b].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * f[0] + 0.7152 * f[1] + 0.0722 * f[2];
};
const razao = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return Math.round(((x + 0.05) / (y + 0.05)) * 100) / 100;
};

const LER = (frases) => {
  const num = (v) => (v === null || v === undefined ? null : Math.round(v * 100) / 100);
  const secao = document.querySelector('.dif-secao');
  if (!secao) return { secaoMontada: false };
  const rotulado = secao.getAttribute('aria-labelledby');
  const noDoNome = rotulado ? document.getElementById(rotulado) : null;
  const lista = secao.querySelector('ul');
  const itens = [...secao.querySelectorAll('li')];
  const grade = secao.querySelector('.dif-grade');
  const csS = getComputedStyle(secao);
  const texto = (secao.textContent || '').replace(/\s+/g, ' ');

  return {
    secaoMontada: true,
    contratos: {
      ariaLabelledby: rotulado,
      nomeResolvido: noDoNome ? (noDoNome.textContent || '').trim() : null,
      ancorasDuplicadas: document.querySelectorAll('#diferenciais-6').length,
      tagDaLista: lista ? lista.tagName : null,
      itensSaoLi: itens.length > 0 && itens.every((n) => n.tagName === 'LI'),
      /* A seção antiga não pode ter ficado montada junto: duas listas de
         Diferenciais na mesma rota seriam conteúdo duplicado. */
      secoesDifNaRota: document.querySelectorAll('.dif-secao').length,
      /* `#diferenciais` é OUTRA seção («Entrega com Alta Performance»), e tem de
         continuar existindo — o portão é ela não ter sido confundida com esta. */
      outraSecaoDiferenciaisIntacta: !!document.querySelector('#diferenciais'),
    },
    empilhamento: {
      isolation: csS.isolation,
      position: csS.position,
      overflow: csS.overflow,
      fundoDaSecao: csS.backgroundImage,
      gradeZIndex: grade ? getComputedStyle(grade).zIndex : null,
      gradeAriaHidden: grade ? grade.getAttribute('aria-hidden') !== null : null,
      gradeRecebePonteiro: grade ? getComputedStyle(grade).pointerEvents !== 'none' : null,
    },
    cartoes: {
      quantos: itens.length,
      comIcone: itens.filter((n) => !!n.querySelector('svg')).length,
      iconesAriaHidden: itens.filter(
        (n) => n.querySelector('svg')?.getAttribute('aria-hidden') !== null,
      ).length,
      iconesDistintos: new Set(
        itens.map((n) => n.querySelector('svg')?.innerHTML.slice(0, 120) ?? ''),
      ).size,
      /* 23/09 — o cartão desceu para um nó dentro do `<li>` (a flutuação em CSS
         não pode dividir elemento com o `transform` inline do motion), então o
         computado que interessa é o do `.dif-cartao`, não o do item da lista. */
      detalhe: [...secao.querySelectorAll('.dif-cartao')].map((n) => {
        const cs = getComputedStyle(n);
        const selo = n.querySelector('.dif-selo');
        const b = n.getBoundingClientRect();
        return {
          raioPx: num(Number.parseFloat(cs.borderTopLeftRadius)),
          temSombra: cs.boxShadow !== 'none' && cs.boxShadow.trim() !== '',
          boxShadow: cs.boxShadow,
          /* O chanfro não pode ter sobrado: ele anula o raio. */
          clipPath: cs.clipPath,
          chanfroVivo: cs.clipPath !== 'none',
          seloRedondoPx: selo ? num(Number.parseFloat(getComputedStyle(selo).borderTopLeftRadius)) : null,
          seloCaixa: selo
            ? { w: num(selo.getBoundingClientRect().width), h: num(selo.getBoundingClientRect().height) }
            : null,
          /* Selo à ESQUERDA da frase, como o mock. */
          seloAntesDaFrase: selo
            ? selo.getBoundingClientRect().left < (n.querySelector('.dif-frase')?.getBoundingClientRect().left ?? 0)
            : null,
          caixa: { w: num(b.width), h: num(b.height) },
        };
      }),
    },
    escritaPreservada: (() => {
      const faltando = frases.filter((f) => !texto.includes(f));
      return { esperadas: frases.length, encontradas: frases.length - faltando.length, faltando };
    })(),
    /* Antes o portão era `nosAnimados: 0` — a seção não tinha animação em CSS. A
       partir do pedido de 23/09 ela TEM duas (flutuar e pulsar), então o portão
       passou a ser QUAIS são e com que atraso: nome inesperado aqui é regressão. */
    movimento: {
      nosAnimados: [...secao.querySelectorAll('*')].filter(
        (n) => getComputedStyle(n).animationName !== 'none',
      ).length,
      nomes: [
        ...new Set(
          [...secao.querySelectorAll('*')]
            .map((n) => getComputedStyle(n).animationName)
            .filter((v) => v !== 'none'),
        ),
      ],
      flutuar: [...secao.querySelectorAll('.dif-flutua')].map((n) => {
        const cs = getComputedStyle(n);
        return { nome: cs.animationName, dur: cs.animationDuration, atraso: cs.animationDelay };
      }),
      pulsar: [...secao.querySelectorAll('.dif-selo > svg')].map((n) => {
        const cs = getComputedStyle(n);
        return { nome: cs.animationName, dur: cs.animationDuration, atraso: cs.animationDelay };
      }),
    },
    transbordoDocumentoPx: num(
      document.documentElement.scrollWidth - document.documentElement.clientWidth,
    ),
  };
};

/* Contraste pela receita da casa, com média E pior pixel do bloco. */
const contrasteDe = async (png, alvo) => {
  const { data, info } = await sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const m = alvo.cor.match(/[\d.]+/g).slice(0, 3).map(Number);
  const alfa = Number((alvo.cor.match(/[\d.]+/g) ?? [])[3] ?? 1);
  let s = [0, 0, 0];
  let n = 0;
  let pior = null;
  for (let dx = -2; dx <= 2; dx += 1) {
    for (let dy = -2; dy <= 2; dy += 1) {
      const px = alvo.x - 9 + dx;
      const py = alvo.y + dy;
      if (px < 0 || py < 0 || px >= info.width || py >= info.height) continue;
      const i = (py * info.width + px) * info.channels;
      const px3 = [data[i], data[i + 1], data[i + 2]];
      s = [s[0] + px3[0], s[1] + px3[1], s[2] + px3[2]];
      n += 1;
      if (pior === null || Math.abs(lum(px3) - lum(m)) < Math.abs(lum(pior) - lum(m))) pior = px3;
    }
  }
  if (!n) return { foraDeQuadro: true };
  const media = s.map((v) => Math.round(v / n));
  const compor = (fundo) => m.map((c, i) => Math.round(alfa * c + (1 - alfa) * fundo[i]));
  return {
    ...alvo,
    alfaDoTexto: alfa,
    fundoAmostrado: `rgb(${media.join(' ')})`,
    razao: razao(compor(media), media),
    fundoPiorPixel: `rgb(${pior.join(' ')})`,
    razaoPiorPixel: razao(compor(pior), pior),
  };
};

const diferenca = async (a, b) => {
  const [pa, pb] = await Promise.all([
    sharp(a).ensureAlpha().raw().toBuffer({ resolveWithObject: true }),
    sharp(b).ensureAlpha().raw().toBuffer({ resolveWithObject: true }),
  ]);
  if (pa.data.length !== pb.data.length) return { comparavel: false };
  let n = 0;
  let maior = 0;
  for (let i = 0; i < pa.data.length; i += pa.info.channels) {
    const d =
      Math.abs(pa.data[i] - pb.data[i]) +
      Math.abs(pa.data[i + 1] - pb.data[i + 1]) +
      Math.abs(pa.data[i + 2] - pb.data[i + 2]);
    if (d > 2) n += 1;
    if (d > maior) maior = d;
  }
  return {
    comparavel: true,
    pixeisDiferentes: n,
    fracaoDoQuadroPct: Math.round((n / (pa.info.width * pa.info.height)) * 10000) / 100,
    maiorDeltaRGB: maior,
  };
};

/**
 * O TÍTULO POR ROLAGEM. Pedido de 23/09 (2ª passada): «'Diferenciais' deve ter o
 * mesmo efeito quando vai escrolando que o título Entrega com Alta Performance» e
 * «a linha embaixo do título deve ser dinâmica e ir aparecendo com o scroll».
 *
 * Presença de componente não prova efeito: os dois títulos já usam o MESMO
 * `TituloAceso`, então ler «tem o componente» aprovaria sem medir nada. O portão é
 * VALOR POR ROLAGEM, pela régua da casa: percorre a janela em passos, lê em cada um
 * a opacidade dos spans animados e o `scaleX` real do risco, e reprova se a
 * amplitude for nula — efeito que acontece todo fora de quadro é efeito que passa
 * sem ser visto. Os dois títulos são medidos com a MESMA rotina, no mesmo passo, e
 * é a comparação entre eles que responde «o mesmo efeito».
 */
const efeitoDoTitulo = async (p, id) =>
  p.evaluate(async (idAlvo) => {
    const h = document.getElementById(idAlvo);
    if (!h) return { presente: false };
    const bloco = h.closest('.titulo-aceso');
    const risco = bloco?.querySelector('.titulo-risco');
    const spans = [...h.querySelectorAll('span > span')];
    const escalaDoRisco = () => {
      if (!risco) return null;
      const m = new DOMMatrixReadOnly(getComputedStyle(risco).transform);
      return Math.round(m.a * 1000) / 1000;
    };
    const dormir = (ms) => new Promise((r) => setTimeout(r, ms));
    const amostras = [];
    /* Começa com o título ABAIXO da janela e sobe: é o sentido em que o leitor
       encontra a seção, e o `useScroll` do componente é ancorado nesse sentido. */
    const alvo = () => h.getBoundingClientRect().top + window.scrollY;
    for (let passo = 0; passo <= 8; passo += 1) {
      window.scrollTo(0, alvo() - window.innerHeight * (1 - passo * 0.115));
      await dormir(320);
      const ops = spans.map((s) => Math.round(Number(getComputedStyle(s).opacity) * 1000) / 1000);
      amostras.push({
        passo,
        topoDoTituloPx: Math.round(h.getBoundingClientRect().top),
        menorOpacidade: ops.length ? Math.min(...ops) : null,
        maiorOpacidade: ops.length ? Math.max(...ops) : null,
        escalaDoRisco: escalaDoRisco(),
      });
    }
    const escalas = amostras.map((a) => a.escalaDoRisco).filter((v) => v !== null);
    const menores = amostras.map((a) => a.menorOpacidade).filter((v) => v !== null);
    return {
      presente: true,
      spansAnimados: spans.length,
      pesoDaFonte: getComputedStyle(h.querySelector('span') ?? h).fontWeight,
      /* Amplitude: sem isto, um risco que já nasce inteiro passaria como
         «dinâmico» só por existir. */
      amplitudeDoRisco: escalas.length
        ? Math.round((Math.max(...escalas) - Math.min(...escalas)) * 1000) / 1000
        : null,
      escalaMinima: escalas.length ? Math.min(...escalas) : null,
      escalaMaxima: escalas.length ? Math.max(...escalas) : null,
      amplitudeDaOpacidade: menores.length
        ? Math.round((Math.max(...menores) - Math.min(...menores)) * 1000) / 1000
        : null,
      amostras,
    };
  }, id);

const navegador = await chromium.launch({
  executablePath: `${process.env.LOCALAPPDATA}/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe`,
});

const relatorio = { peca: 'Diferenciais /quem-somos', url: ROTA, quando: new Date().toISOString() };

for (const alvo of LARGURAS) {
  const contexto = await navegador.newContext({
    viewport: { width: alvo.width, height: alvo.height },
    deviceScaleFactor: 1,
  });
  await contexto.addInitScript(() => {
    localStorage.setItem('sistran-motion-preference', 'full');
    localStorage.setItem('sistran-motion-preference-seen', '1');
    sessionStorage.setItem('sistran:intro-visto', 'true');
  });
  const p = await contexto.newPage();
  await p.goto(ROTA, { waitUntil: 'domcontentloaded', timeout: 240_000 });
  await p.waitForSelector('[data-route-liberado="true"]', { timeout: 240_000 }).catch(() => {});
  await p.addStyleTag({
    content:
      'nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button]{display:none!important}',
  });
  await p.waitForSelector('.dif-secao', { timeout: 240_000 });

  /* Centra a seção: os cartões só terminam a entrada por rolagem depois de
     estarem em quadro, e medir raio/sombra de um cartão a meio caminho da
     cortina daria número de transição, não de estado. */
  await p.evaluate(() => {
    const s = document.querySelector('.dif-secao');
    const b = s.getBoundingClientRect();
    window.scrollTo(0, b.top + window.scrollY - Math.max(0, (window.innerHeight - b.height) / 2));
  });
  await p.waitForTimeout(1200);
  /* Segunda rolagem: o layout acima desta seção ainda muda depois da primeira
     (cena dos escritórios, imagens), e uma rolagem só deixa a seção fora de
     quadro. Ver a nota no laço de movimento reduzido. */
  await p.evaluate(() => {
    const s = document.querySelector('.dif-secao');
    const b = s.getBoundingClientRect();
    window.scrollTo(0, b.top + window.scrollY - Math.max(0, (window.innerHeight - b.height) / 2));
  });
  await p.waitForTimeout(1200);
  await p.evaluate(() => document.fonts?.ready);

  const bloco = await p.evaluate(LER, FRASES);

  const base = `${PASTA}/dif-${alvo.nome}.png`;
  await p.screenshot({ path: base });

  /* CONTRASTE: a frase do primeiro cartão em quadro, e o título da seção. */
  const alvos = await p.evaluate(() => {
    const emQuadro = (el) => {
      const b = el.getBoundingClientRect();
      return b.width > 0 && b.top > 0 && b.bottom < window.innerHeight;
    };
    const saida = {};
    const frase = [...document.querySelectorAll('.dif-frase')].find(emQuadro);
    const titulo = document.querySelector('#diferenciais-6');
    for (const [chave, el] of [['frase', frase], ['titulo', titulo && emQuadro(titulo) ? titulo : null]]) {
      if (!el) {
        saida[chave] = null;
        continue;
      }
      const b = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      saida[chave] = {
        texto: (el.textContent || '').trim().slice(0, 60),
        cor: cs.color,
        fontSizePx: cs.fontSize,
        fontWeight: cs.fontWeight,
        x: Math.round(b.left),
        y: Math.round(b.top + Math.min(b.height / 2, 10)),
      };
    }
    return saida;
  });
  bloco.contraste = {
    frase: alvos.frase ? await contrasteDe(base, alvos.frase) : null,
    titulo: alvos.titulo ? await contrasteDe(base, alvos.titulo) : null,
  };

  /* A EMENDA COM TECNOLOGIAS. Captura própria, com a fronteira no meio vertical. */
  const juntaPng = `${PASTA}/dif-emenda-${alvo.nome}.png`;
  const junta = await p.evaluate(() => {
    const tec = document.querySelector('.tec-secao');
    const secao = document.querySelector('.dif-secao');
    if (!tec || !secao) return { tecNaRota: !!tec, secaoNaRota: !!secao };
    let irma = tec.parentElement === secao.parentElement ? tec.nextElementSibling : null;
    const entre = [];
    while (irma && irma !== secao) {
      entre.push(`${irma.tagName.toLowerCase()}.${irma.className || '(sem classe)'}`);
      irma = irma.nextElementSibling;
    }
    window.scrollTo(
      0,
      secao.getBoundingClientRect().top + window.scrollY - window.innerHeight / 2,
    );
    return {
      mesmoPai: tec.parentElement === secao.parentElement,
      elementosEntre: irma === secao ? entre : ['(não são irmãs na mesma lista)'],
      degradeDeTecnologias: getComputedStyle(tec).backgroundImage,
      degradeDaSecao: getComputedStyle(secao).backgroundImage,
      /* A prova do achado: o último tom de Tecnologias tem de ser o PRIMEIRO daqui. */
      declaracoesIdenticas:
        getComputedStyle(tec).backgroundImage === getComputedStyle(secao).backgroundImage,
    };
  });
  if (junta.mesmoPai !== undefined) {
    await p.waitForTimeout(600);
    await p.screenshot({ path: juntaPng });
    const y = await p.evaluate(() =>
      Math.round(document.querySelector('.dif-secao').getBoundingClientRect().top),
    );
    const { data, info } = await sharp(juntaPng)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const em = (px, py) => {
      const i = (py * info.width + px) * info.channels;
      return [data[i], data[i + 1], data[i + 2]];
    };
    const colunas = [0.06, 0.2, 0.35, 0.5, 0.65, 0.8, 0.94].map((f) =>
      Math.min(info.width - 1, Math.round(info.width * f)),
    );
    const pares = colunas.map((x) => {
      const acima = em(x, Math.max(0, y - 3));
      const abaixo = em(x, Math.min(info.height - 1, y + 3));
      return {
        x,
        acima: `rgb(${acima.join(' ')})`,
        abaixo: `rgb(${abaixo.join(' ')})`,
        deltaRGB:
          Math.abs(acima[0] - abaixo[0]) +
          Math.abs(acima[1] - abaixo[1]) +
          Math.abs(acima[2] - abaixo[2]),
      };
    });
    junta.fronteiraYpx = y;
    junta.colunas = pares;
    junta.maiorDeltaRGB = Math.max(...pares.map((c) => c.deltaRGB));

    /* SEGUNDA LEITURA, SEM AS CAMADAS DECORATIVAS. Serve para ATRIBUIR o que
       sobrar: se o Δ cai a zero aqui, a emenda de tinta está fechada e o que o
       olho veria é grade/brilho, não degradê desalinhado. Sem esta leitura eu não
       sei se um Δ residual é meu erro ou desenho de Tecnologias. */
    await p.addStyleTag({
      content:
        '.dif-grade,.tec-fundo__grade,.tec-fundo__brilho{display:none!important}',
    });
    await p.waitForTimeout(400);
    const nuPng = `${PASTA}/dif-emenda-nua-${alvo.nome}.png`;
    await p.screenshot({ path: nuPng });
    const nu = await sharp(nuPng).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const emNu = (px, py) => {
      const i = (py * nu.info.width + px) * nu.info.channels;
      return [nu.data[i], nu.data[i + 1], nu.data[i + 2]];
    };
    const paresNus = colunas.map((x) => {
      const acima = emNu(x, Math.max(0, y - 3));
      const abaixo = emNu(x, Math.min(nu.info.height - 1, y + 3));
      return {
        x,
        acima: `rgb(${acima.join(' ')})`,
        abaixo: `rgb(${abaixo.join(' ')})`,
        deltaRGB:
          Math.abs(acima[0] - abaixo[0]) +
          Math.abs(acima[1] - abaixo[1]) +
          Math.abs(acima[2] - abaixo[2]),
      };
    });
    junta.semDecoracao = {
      colunas: paresNus,
      maiorDeltaRGB: Math.max(...paresNus.map((c) => c.deltaRGB)),
    };
    /* A página é recarregada abaixo para o diff de camadas, então o style tag
       injetado aqui não contamina nada — mas a recarga tem de ser explícita. */
    await p.reload({ waitUntil: 'domcontentloaded', timeout: 240_000 });
    await p.waitForSelector('.dif-secao', { timeout: 240_000 });
    await p.addStyleTag({
      content:
        'nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button]{display:none!important}',
    });
  }
  bloco.emenda = junta;

  /* DE VOLTA AO ENQUADRAMENTO DE `base` antes do diff: a medição da emenda rolou
     a página, e comparar dois enquadramentos daria «pinta» para qualquer coisa. */
  for (let t = 0; t < 3; t += 1) {
    await p.evaluate(() => {
      const s = document.querySelector('.dif-secao');
      const b = s.getBoundingClientRect();
      window.scrollTo(0, b.top + window.scrollY - Math.max(0, (window.innerHeight - b.height) / 2));
    });
    await p.waitForTimeout(900);
  }
  /* A flutuação tem de ser CONGELADA para este par de capturas. O portão da grade é
     um diff pixel a pixel entre «com» e «sem» a camada; com os cartões subindo e
     descendo, a segunda captura pega todos eles em outra posição e o diff acusa a
     página inteira. Na primeira passada isto leu 9,22% / 13,1% / 22,28% contra os
     3,02% / 2,15% / 1,56% de ontem — inflação que não é grade nenhuma. A pausa é
     removida em seguida, senão ela falsearia justamente o portão de amplitude e o
     de pausa-em-hover, que vêm depois. */
  const pausa = await p.addStyleTag({
    content: '.dif-flutua,.dif-selo>svg{animation-play-state:paused!important}',
  });
  await p.waitForTimeout(300);
  const reenquadrado = `${PASTA}/dif-reenq-${alvo.nome}.png`;
  await p.screenshot({ path: reenquadrado });

  const semGrade = `${PASTA}/dif-sem-grade-${alvo.nome}.png`;
  const escondeGrade = await p.addStyleTag({ content: '.dif-grade{display:none!important}' });
  await p.waitForTimeout(400);
  await p.screenshot({ path: semGrade });
  bloco.gradePinta = await diferenca(reenquadrado, semGrade);
  await escondeGrade.evaluate((n) => n.remove());
  await pausa.evaluate((n) => n.remove());

  /* Os dois títulos, mesma rotina e mesmo passo — só a 1440, porque o portão é de
     efeito e não de layout, e repeti-lo em três larguras só triplicaria a rolagem. */
  if (alvo.nome === '1440') {
    bloco.tituloPorRolagem = {
      diferenciais: await efeitoDoTitulo(p, 'diferenciais-6'),
      referencia: await efeitoDoTitulo(p, 'entrega-performance'),
    };
  }

  /* ── FLUTUAÇÃO E PULSO: amplitude REAL, não presença da regra ────────────────
     `animationName` diferente de `none` só prova que a declaração chegou. O portão
     é deslocamento medido: amostro a matriz de transformação do cartão e do ícone
     ao longo de um ciclo inteiro e guardo o maior e o menor valor. Amplitude 0 com
     a regra presente é exatamente o defeito que o `transform` inline do motion
     causaria se a animação estivesse no nó errado. */
  bloco.amplitudeDoMovimento = await p.evaluate(async () => {
    const espera = (ms) => new Promise((r) => setTimeout(r, ms));
    const ty = (n) => new DOMMatrixReadOnly(getComputedStyle(n).transform).f;
    const esc = (n) => new DOMMatrixReadOnly(getComputedStyle(n).transform).a;
    const cartoes = [...document.querySelectorAll('.dif-flutua')];
    const icones = [...document.querySelectorAll('.dif-selo > svg')];
    const amostrasC = cartoes.map(() => []);
    const amostrasI = icones.map(() => []);
    for (let i = 0; i < 30; i += 1) {
      cartoes.forEach((n, k) => amostrasC[k].push(ty(n)));
      icones.forEach((n, k) => amostrasI[k].push(esc(n)));
      await espera(200); // 30 × 200ms = 6s > o ciclo de 5,4s do cartão
    }
    const faixa = (a) => Math.round((Math.max(...a) - Math.min(...a)) * 100) / 100;
    return {
      cartoesPx: amostrasC.map(faixa),
      iconesEscala: amostrasI.map(faixa),
      /* A entrada tem de ter sobrevivido: o `<li>` é quem guarda o `transform` do
         motion, e ele precisa estar em repouso (0) depois da revelação. */
      entradaEmRepouso: [...document.querySelectorAll('.dif-celula')].every(
        (n) => Math.abs(ty(n)) < 0.5,
      ),
    };
  });

  /* ── HOVER: cor medida no computado, com o ponteiro realmente sobre o cartão ── */
  const primeiro = p.locator('.dif-cartao').first();
  const antes = await primeiro.evaluate((n) => ({
    fundo: getComputedStyle(n).backgroundImage,
    frase: getComputedStyle(n.querySelector('.dif-frase')).color,
    icone: getComputedStyle(n.querySelector('.dif-selo > svg')).color,
    selo: getComputedStyle(n.querySelector('.dif-selo')).backgroundColor,
  }));
  /* `force: true` porque o cartão está em movimento de propósito e o Playwright
     exige elemento ESTÁVEL antes de mover o ponteiro — sem isto a sonda estoura por
     timeout, e o timeout é, ele mesmo, prova de que a flutuação existe. */
  await primeiro.hover({ force: true });
  await p.waitForTimeout(600);
  const depois = await primeiro.evaluate((n) => ({
    fundo: getComputedStyle(n).backgroundImage,
    frase: getComputedStyle(n.querySelector('.dif-frase')).color,
    icone: getComputedStyle(n.querySelector('.dif-selo > svg')).color,
    selo: getComputedStyle(n.querySelector('.dif-selo')).backgroundColor,
    /* Pausa em hover (WCAG 2.2.2) e, aqui, também para o alvo não fugir do cursor. */
    flutuacaoPausada: getComputedStyle(n).animationPlayState,
  }));
  const hoverPng = `${PASTA}/dif-hover-${alvo.nome}.png`;
  await p.screenshot({ path: hoverPng });
  /* Branco sobre o navy do hover, pela mesma receita das outras frases: média do
     bloco de 5px à esquerda do glifo E pior pixel. */
  const alvoHover = await primeiro.evaluate((n) => {
    const f = n.querySelector('.dif-frase');
    const b = f.getBoundingClientRect();
    /* Arredondado: `contrasteDe` usa x/y como índice do buffer, e coordenada
       fracionária vira índice fracionário — o pixel sai `undefined` e a razão sai
       `null` com o fundo lido como `rgb(NaN NaN NaN)`. Foi o que aconteceu na
       primeira passada. */
    return {
      cor: getComputedStyle(f).color,
      x: Math.round(b.left),
      y: Math.round(b.top) + 8,
      nome: 'frase-hover',
    };
  });
  bloco.hover = {
    antes,
    depois,
    inverteu: antes.frase !== depois.frase && antes.fundo !== depois.fundo,
    contraste: await contrasteDe(hoverPng, alvoHover),
  };
  await p.mouse.move(0, 0);

  relatorio[alvo.nome] = bloco;
  await contexto.close();
}

const canais = {};
for (const canal of ['media-query', 'atributo']) {
  const contexto = await navegador.newContext({
    viewport: { width: 1440, height: 960 },
    deviceScaleFactor: 1,
    reducedMotion: canal === 'media-query' ? 'reduce' : 'no-preference',
  });
  await contexto.addInitScript(
    ([c]) => {
      localStorage.setItem('sistran-motion-preference', c === 'atributo' ? 'reduce' : 'full');
      localStorage.setItem('sistran-motion-preference-seen', '1');
      sessionStorage.setItem('sistran:intro-visto', 'true');
    },
    [canal],
  );
  const p = await contexto.newPage();
  await p.goto(ROTA, { waitUntil: 'domcontentloaded', timeout: 240_000 });
  await p.waitForSelector('.dif-secao', { timeout: 240_000 });
  /* ROLA DUAS VEZES, com espera entre as duas, e esta é a correção de um portão
     que reprovou por culpa da sonda: a página tem cena de escritórios e imagens
     acima desta seção, então a primeira rolagem acerta uma posição que o layout
     ainda vai mudar, a seção sai de quadro, o `whileInView` nunca dispara e os seis
     cartões ficam em opacidade 0. Foi exatamente o que a primeira rodada leu — e a
     leitura era da medição, não da peça. */
  const irAteASecao = async () => {
    await p.evaluate(() => {
      const s = document.querySelector('.dif-secao');
      const b = s.getBoundingClientRect();
      window.scrollTo(0, b.top + window.scrollY - Math.max(0, (window.innerHeight - b.height) / 2));
    });
  };
  /* Três tentativas, e o enquadramento final vai no relatório: portão de movimento
     que reprova tem de ser distinguível de sonda que mediu fora de quadro. */
  for (let t = 0; t < 3; t += 1) {
    await irAteASecao();
    await p.waitForTimeout(1200);
  }
  await p.waitForTimeout(1200);
  canais[canal] = await p.evaluate(() => {
    const secao = document.querySelector('.dif-secao');
    const itens = [...secao.querySelectorAll('li')];
    const b = secao.getBoundingClientRect();
    return {
      dataMotion: document.documentElement.dataset.motion ?? null,
      enquadramento: {
        topo: Math.round(b.top),
        base: Math.round(b.bottom),
        alturaDaJanela: window.innerHeight,
        emQuadro: b.bottom > 0 && b.top < window.innerHeight,
      },
      nosAnimados: [...secao.querySelectorAll('*')].filter(
        (n) => getComputedStyle(n).animationName !== 'none',
      ).length,
      cartoes: itens.length,
      cartoesVisiveis: itens.filter((n) => {
        const cs = getComputedStyle(n);
        return n.getBoundingClientRect().width > 0 && Number(cs.opacity) > 0.99;
      }).length,
      piorOpacidade: Math.min(...itens.map((n) => Number(getComputedStyle(n).opacity))),
      iconesVisiveis: itens.filter((n) => {
        const svg = n.querySelector('svg');
        return svg && svg.getBoundingClientRect().width > 0;
      }).length,
    };
  });
  await contexto.close();
}
relatorio.movimentoReduzido = canais;

await navegador.close();
const saida = `${MEDIDAS}/diferenciais-seis.json`;
await writeFile(saida, `${JSON.stringify(relatorio, null, 2)}\n`);
console.log(JSON.stringify(relatorio, null, 2));
console.log(`\n→ ${saida}`);
