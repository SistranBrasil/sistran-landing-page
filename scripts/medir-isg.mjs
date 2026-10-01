/**
 * SIS-87 — «ISG Provider Lens» de `/quem-somos`. Portões medidos dos critérios de
 * aceite da issue e de `docs/isg.md`. Escrito no molde de `medir-diferenciais.mjs`
 * (mesma receita de navegador, mesmas funções de contraste e de diff).
 *
 * O que ele mede, e por que cada portão existe:
 *
 * · `contratos` — `aria-labelledby="isg"` tem de continuar RESOLVENDO num nome, e
 *   agora isso é delicado: o `#isg` deixou de ser texto e passou a ser um `<h2>`
 *   cujo conteúdo é o logo. `textContent` dele é VAZIO, de propósito; quem carrega
 *   o nome é o `alt` da imagem. Então o portão lê o nome acessível pela regra do
 *   AccName (texto, ou o `alt` da imagem dentro) e reprova se der vazio — seção
 *   sem nome é defeito silencioso, não dá erro em lugar nenhum.
 * · `naoSaoTresCards` — o critério de aceite literal («não 3 cards glass»): nenhum
 *   `.glass-card`/`.notch-card` dentro da seção, e a contagem de `blockquote` tem
 *   de ser UM (o comentário do analista), não três.
 * · `assets` — as duas imagens têm de ter CARREGADO de verdade. `naturalWidth` é o
 *   único jeito de distinguir «src apontando para o arquivo certo» de «arquivo
 *   chegou»: caminho errado em `/public` no Next dá 404 silencioso e caixa vazia.
 *   Confere também as dimensões naturais contra as medidas com `sharp`.
 * · `logoNaCaixa` — o recorte da tinta. O arquivo é 91,5% transparente e o recorte
 *   é feito por janela + deslocamento; se a conta estiver errada, o logo aparece
 *   cortado ou minúsculo dentro da caixa. O portão compara a caixa desenhada com a
 *   proporção 2461/377 e confere que a imagem transborda a janela (é isso que o
 *   recorte é) em vez de flutuar dentro dela.
 * · `selo` — tem de estar SOBRE a fotografia, dentro do painel, nos recuos que o
 *   documento fixa (24px no desktop, 12px no mobile). Contido geometricamente, não
 *   só «declarado absolute».
 * · `escritaPreservada` — os três textos de `ISG`, o do selo e as três partes do
 *   crédito, palavra por palavra. Lista literal de propósito: derivada do DOM,
 *   aprovaria qualquer coisa.
 * · `contraste` — cada texto da seção, com média E pior pixel. O sobretítulo entra
 *   obrigatoriamente: ele é de 12–14px e o documento pedia ciano puro, que reprova.
 * · `transbordo` — no `documentElement`, o «nenhuma rolagem horizontal» do doc.
 * · `ordemMobile` — a ordem que o documento fixa abaixo de 768px, lida pela posição
 *   VERTICAL real de cada bloco na tela, não pela ordem no DOM (a reordenação é de
 *   layout; ler o DOM aprovaria sem provar nada).
 * · `emendas` — os dois chanfros que cercam a seção. O fundo trocou de
 *   `.section-light-blue` para o `#f7fbff` do documento, e as duas cores dos
 *   `NotchDivider` vieram daquele degradê: sem retoque, cada junta viraria um
 *   degrau. Lido em PIXEL, sete colunas, 3px de cada lado.
 * · `movimentoReduzido` — os dois canais da casa, com o portão simétrico: nada
 *   animado E todos os blocos VISÍVEIS (reveal que morre em `opacity: 0` é
 *   conteúdo apagado).
 * · `mockVsRender` — a issue manda a seção «ler como `isg.png`». Não se compara
 *   pixel a pixel (a mock é outra tipografia e outro recorte de foto); compara-se a
 *   GEOMETRIA: proporção foto/conteúdo e lado da foto. É o que «ler como» significa
 *   aqui, e é falsificável.
 *
 * Uso: URL_BASE=http://localhost:3000 node scripts/medir-isg.mjs
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
  { nome: '768', width: 768, height: 1000 },
  { nome: '390', width: 390, height: 844 },
];

/* Literal: é a escrita publicada, e o portão é ela continuar no DOM. */
const TEXTOS = [
  'expertise é inquestionável, possuindo mais de 40 implementações',
  /* Aspas RETAS, sem `replace`: o dado em `aSistran.ts` usa `"` reto. O `.replace`
     que estava aqui trocava as duas pela MESMA aspa de abertura (`\u201ctime to
     market\u201c`), e era s\u00f3 o literal da sonda que estava errado \u2014 a frase na tela
     sempre esteve certa. */
  'Possui aceleradores para melhorar o "time to market" dos clientes',
  'A parceria única da Sistran com Pegasystems permite que ela oriente',
  'ISG Provider Lens Product Challenger',
  "Sistran's unique partnership with Pegasystems",
  '(*) ISG — Consultores Globais em Gestão de Outsourcing',
  'isg-one.com/index/isg-index',
  'Reprint autorizado por ISG Provider Lens ©, Brasil',
  'Reconhecimento internacional',
  'Conhecimento e experiência',
  'Portfólio robusto',
  'Comentário do Analista',
];

/* Medidas dos arquivos, lidas com `sharp` antes de escrever o componente. */
const ARQUIVOS = {
  foto: { src: '/isgprovider.png', largura: 1122, altura: 1402 },
  logo: { src: '/isg-provider-lens-HD-transparente.png', largura: 2560, altura: 868 },
};

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

/* Contraste pela receita da casa, com média E pior pixel do bloco. As coordenadas
   chegam ARREDONDADAS de quem chama: `x`/`y` indexam o buffer cru, e coordenada
   fracionária devolve pixel `undefined` e razão `null` (achado da passada
   anterior, em `medir-diferenciais.mjs`). */
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

/* A EMENDA de um chanfro: pixel 3px acima e 3px abaixo da fronteira, sete colunas.
   Computado não serve de prova — a cor do chanfro é atributo do SVG e a do fundo é
   degradê resolvido contra a caixa de cada seção. */
const emendaEm = async (p, seletorDeCima, seletorDeBaixo, nome) => {
  const dados = await p.evaluate(
    ([cima, baixo]) => {
      const a = document.querySelector(cima);
      const b = document.querySelector(baixo);
      if (!a || !b) return { achouCima: !!a, achouBaixo: !!b };
      window.scrollTo(0, b.getBoundingClientRect().top + window.scrollY - window.innerHeight / 2);
      return {
        achouCima: true,
        achouBaixo: true,
        mesmoPai: a.parentElement === b.parentElement,
        /* «Vizinhas» aqui é «separadas SÓ por um `NotchDivider`»: é essa a
           topologia real da página, e a leitura anterior (`nextElementSibling ===
           b`) devolvia `false` sempre — não porque houvesse algo indevido entre
           as duas, mas porque o chanfro está entre elas por projeto. */
        vizinhas:
          a.nextElementSibling === b ||
          (a.nextElementSibling?.nextElementSibling === b &&
            a.nextElementSibling?.classList.contains('notch-divider')),
        /* O chanfro é UM `<path fill>` dentro de um SVG transparente: onde o
           recorte abre, o pixel acima da fronteira é da camada de trás, não do
           `fill`. Registrar o `fill` declarado permite ler as colunas com essa
           ressalva em vez de tomar toda diferença por costura aberta. */
        fillDoChanfro:
          a.nextElementSibling?.classList.contains('notch-divider') ||
          b.previousElementSibling?.classList.contains('notch-divider')
            ? (a.nextElementSibling?.querySelector('path') ??
                b.previousElementSibling?.querySelector('path'))?.getAttribute('fill')
            : null,
      };
    },
    [seletorDeCima, seletorDeBaixo],
  );
  if (!dados.achouBaixo) return dados;
  await p.waitForTimeout(700);
  const png = `${PASTA}/isg-emenda-${nome}.png`;
  await p.screenshot({ path: png });
  const y = await p.evaluate(
    (sel) => Math.round(document.querySelector(sel).getBoundingClientRect().top),
    seletorDeBaixo,
  );
  const { data, info } = await sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
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
  return {
    ...dados,
    fronteiraYpx: y,
    colunas: pares,
    maiorDeltaRGB: Math.max(...pares.map((c) => c.deltaRGB)),
  };
};

const LER = (entrada) => {
  const [textos, arquivos] = entrada;
  const num = (v) => (v === null || v === undefined ? null : Math.round(v * 100) / 100);
  const secao = document.querySelector('.isg-secao');
  if (!secao) return { secaoMontada: false };

  const painel = secao.querySelector('.isg-painel');
  const foto = painel?.querySelector('img');
  const selo = secao.querySelector('.isg-selo');
  const h2 = document.getElementById('isg');
  const logo = h2?.querySelector('img');
  const caixaLogo = secao.querySelector('.isg-logo');
  const difs = [...secao.querySelectorAll('.isg-diferencial')];
  const citacao = secao.querySelector('.isg-citacao');
  const creditos = secao.querySelector('.isg-creditos');
  const texto = (secao.textContent || '').replace(/\s+/g, ' ');
  const cx = (el) => {
    const b = el.getBoundingClientRect();
    return {
      x: num(b.left),
      y: num(b.top),
      largura: num(b.width),
      altura: num(b.height),
      direita: num(b.right),
      base: num(b.bottom),
    };
  };

  /* Nome acessível do heading pela regra do AccName: texto, senão o `alt` da
     imagem de dentro. O `<h2>` aqui é o logo, então `textContent` é vazio DE
     PROPÓSITO e ler só ele daria «seção sem nome» — falso negativo. */
  const nomeDoHeading = h2
    ? ((h2.textContent || '').trim() ||
      [...h2.querySelectorAll('img')].map((i) => i.getAttribute('alt') || '').join(' ').trim())
    : null;

  return {
    secaoMontada: true,
    contratos: {
      ariaLabelledby: secao.getAttribute('aria-labelledby'),
      ancorasIsgNaRota: document.querySelectorAll('#isg').length,
      headingTag: h2 ? h2.tagName : null,
      nomeAcessivelDoHeading: nomeDoHeading,
      nomeVazio: !nomeDoHeading,
      secoesIsgNaRota: document.querySelectorAll('.isg-secao').length,
      /* As vizinhas não podem ter sido tocadas: o Teatro de Reconhecimentos e o
         «Por que SISTRAN?» continuam na rota, e o bloco velho NÃO. */
      recognitionTheaterIntacto: !!document.querySelector('#premiacoes'),
      porQueSistranIntacto: !!document.querySelector('#por-que-sistran'),
      tecnologiasIntacta: !!document.querySelector('.tec-secao'),
      diferenciaisSeisIntacta: !!document.querySelector('.dif-secao'),
    },
    naoSaoTresCards: {
      glassCardsNaSecao: secao.querySelectorAll('.glass-card').length,
      notchCardsNaSecao: secao.querySelectorAll('.notch-card').length,
      blockquotes: secao.querySelectorAll('blockquote').length,
      diferenciais: difs.length,
      tituloEmTipografiaHtml: !!secao.querySelector('.titulo-aceso'),
    },
    assets: {
      foto: foto
        ? {
            src: new URL(foto.currentSrc || foto.src, location.href).pathname,
            apontaParaOArquivo: (foto.getAttribute('src') || '').includes(arquivos.foto.src),
            naturalWidth: foto.naturalWidth,
            naturalHeight: foto.naturalHeight,
            carregou: foto.complete && foto.naturalWidth > 0,
            dimensoesConferem:
              foto.naturalWidth === arquivos.foto.largura &&
              foto.naturalHeight === arquivos.foto.altura,
            objectFit: getComputedStyle(foto).objectFit,
            alt: foto.getAttribute('alt'),
            altDescritivo: (foto.getAttribute('alt') || '').length > 20,
          }
        : null,
      logo: logo
        ? {
            src: new URL(logo.currentSrc || logo.src, location.href).pathname,
            apontaParaOArquivo: (logo.getAttribute('src') || '').includes(arquivos.logo.src),
            naturalWidth: logo.naturalWidth,
            naturalHeight: logo.naturalHeight,
            carregou: logo.complete && logo.naturalWidth > 0,
            dimensoesConferem:
              logo.naturalWidth === arquivos.logo.largura &&
              logo.naturalHeight === arquivos.logo.altura,
            alt: logo.getAttribute('alt'),
            altExato: logo.getAttribute('alt') === 'ISG Provider Lens',
            /* «não anime permanentemente o logo» (doc). */
            animacao: getComputedStyle(logo).animationName,
          }
        : null,
    },
    /* O RECORTE DO LOGO. A janela tem de ter a proporção da tinta (2461/377 ≈
       6.529) e a imagem tem de TRANSBORDAR a janela — é nisso que o recorte
       consiste. Imagem contida dentro da janela significaria que o deslocamento
       não pegou e sobraria vazio transparente em volta, o defeito que a conta
       existe para evitar. */
    logoNaCaixa: caixaLogo && logo
      ? (() => {
          const cj = caixaLogo.getBoundingClientRect();
          const ci = logo.getBoundingClientRect();
          return {
            janela: cx(caixaLogo),
            imagem: cx(logo),
            proporcaoDaJanela: num(cj.width / cj.height),
            proporcaoDaTinta: num(2461 / 377),
            overflowDaJanela: getComputedStyle(caixaLogo).overflow,
            imagemMaiorQueAJanela: ci.width > cj.width + 1,
            imagemDeslocadaParaCima: ci.top < cj.top - 1,
            transformDaImagem: getComputedStyle(logo).transform,
            larguraMaximaPx: num(cj.width),
          };
        })()
      : null,
    /* O SELO dentro do painel, nos recuos do documento. */
    selo: selo && painel
      ? (() => {
          const cs = selo.getBoundingClientRect();
          const cp = painel.getBoundingClientRect();
          return {
            caixa: cx(selo),
            painel: cx(painel),
            contidoNoPainel:
              cs.left >= cp.left - 1 &&
              cs.right <= cp.right + 1 &&
              cs.bottom <= cp.bottom + 1 &&
              cs.top >= cp.top - 1,
            recuoEsquerda: num(cs.left - cp.left),
            recuoDireita: num(cp.right - cs.right),
            recuoBase: num(cp.bottom - cs.bottom),
            position: getComputedStyle(selo).position,
            fundo: getComputedStyle(selo).backgroundImage,
            raio: getComputedStyle(selo).borderRadius,
            marcaAriaHidden: selo.querySelector('.isg-selo__marca')?.getAttribute('aria-hidden') !== null,
          };
        })()
      : null,
    composicao: {
      painel: painel ? cx(painel) : null,
      conteudo: (() => {
        const c = secao.querySelector('.isg-conteudo');
        return c ? cx(c) : null;
      })(),
      /* «A fotografia deve ocupar aproximadamente 40% e o conteúdo cerca de 60%». */
      fracaoDaFotoPct: (() => {
        const c = secao.querySelector('.isg-conteudo');
        if (!painel || !c) return null;
        const total = painel.getBoundingClientRect().width + c.getBoundingClientRect().width;
        return num((painel.getBoundingClientRect().width / total) * 100);
      })(),
      fotoAEsquerda: (() => {
        const c = secao.querySelector('.isg-conteudo');
        if (!painel || !c) return null;
        return painel.getBoundingClientRect().left < c.getBoundingClientRect().left;
      })(),
      alturaDoPainelPx: painel ? num(painel.getBoundingClientRect().height) : null,
      raioDoPainel: painel ? getComputedStyle(painel).borderRadius : null,
      bordaDoPainel: painel ? getComputedStyle(painel).border : null,
      sombraDoPainel: painel ? getComputedStyle(painel).boxShadow : null,
      /* DUAS leituras, e não uma: `backgroundImage` traz só as manchas radiais (a
         terceira camada aparece como `none` porque ali vai a COR, não imagem), e
         era por isso que o portão não conseguia provar que `#f7fbff` do documento
         tinha vencido o gradiente da casa. A prova está em `corDeFundoDaSecao`. */
      fundoDaSecao: getComputedStyle(secao).backgroundImage,
      corDeFundoDaSecao: getComputedStyle(secao).backgroundColor,
      /* O fio vertical existe só no segundo diferencial. */
      fiosVerticais: difs.map((n) => getComputedStyle(n).borderLeftWidth),
      colunasDosDiferenciais: getComputedStyle(secao.querySelector('.isg-diferenciais')).gridTemplateColumns,
      citacaoLarguraTotal: citacao && secao.querySelector('.isg-conteudo')
        ? num(
            citacao.getBoundingClientRect().width /
              secao.querySelector('.isg-conteudo').getBoundingClientRect().width,
          )
        : null,
    },
    decorativos: {
      /* Tudo que é enfeite tem de estar fora da árvore de acessibilidade. */
      /* As aspas não são mais um nó: viraram `::before` de `.isg-citacao` (razão
         de especificidade no CSS). O portão passa a ser «não existe nó de aspas
         na árvore» — que é mais forte que «existe e está `aria-hidden`» — e a cor
         aplicada, que era o que o `span` perdia, é lida logo abaixo. */
      aspasForaDaArvore: !secao.querySelector('.isg-citacao__aspas'),
      corDasAspas: (() => {
        const bq = secao.querySelector('.isg-citacao');
        return bq ? getComputedStyle(bq, '::before').color : null;
      })(),
      linhaDoEyebrowAriaHidden:
        secao.querySelector('.isg-eyebrow__linha')?.getAttribute('aria-hidden') !== null,
      tracosAriaHidden: [...secao.querySelectorAll('.isg-diferencial__traco')].every(
        (n) => n.getAttribute('aria-hidden') !== null,
      ),
      iconesAriaHidden: difs.every((n) => n.querySelector('svg')?.getAttribute('aria-hidden') !== null),
      iconesDistintos: new Set(
        difs.map((n) => n.querySelector('svg')?.getAttribute('class') || ''),
      ).size,
    },
    /* PEDIDO DE 23/09, as três partes: recuo do card, flutuação e a malha de fundo.
       `recuoDaCitacao` é lido em px computados porque o pedido era sobre espaço
       vazio, não sobre a declaração; `flutuacao` prova que a animação está no
       `<blockquote>` e NÃO na casca do `ScrollReveal` (se estivesse na casca, ela
       apagaria o `transform` inline da entrada — ver o CSS), e por isso mede as
       duas; `grade` prova que a camada da casa está montada, com o módulo e a
       âncora que a fazem ficar em fase com `.section-light::before`. */
    pedido2309: {
      recuoDaCitacao: citacao ? getComputedStyle(citacao).padding : null,
      corpoDoGlifo: citacao ? getComputedStyle(citacao, '::before').fontSize : null,
      flutuacao: citacao
        ? {
            nome: getComputedStyle(citacao).animationName,
            duracao: getComputedStyle(citacao).animationDuration,
            iteracoes: getComputedStyle(citacao).animationIterationCount,
            /* O quadro em que está NESTE instante; `none` é repouso exato. */
            transformDoBlockquote: getComputedStyle(citacao).transform,
            /* Tem de ser `none` OU a matriz da entrada — nunca a da flutuação. */
            animacaoNaCasca: getComputedStyle(citacao.parentElement).animationName,
          }
        : null,
      grade: (() => {
        const g = secao.querySelector('.grade-tecnica');
        if (!g) return { existe: false };
        const cs = getComputedStyle(g);
        const antes = getComputedStyle(secao, '::before');
        return {
          existe: true,
          ariaHidden: g.getAttribute('aria-hidden') !== null,
          zIndex: cs.zIndex,
          pointerEvents: cs.pointerEvents,
          modulo: cs.backgroundSize,
          ancora: cs.backgroundAttachment,
          linha: cs.backgroundImage,
          mascara: cs.maskImage || cs.webkitMaskImage,
          /* Em fase com a malha que `.section-light` já pinta: mesmo módulo e
             mesma âncora. Se um dia divergirem, aparece moiré (ver SIS-260). */
          moduloDaSecaoLight: antes.backgroundSize,
          ancoraDaSecaoLight: antes.backgroundAttachment,
          emFase:
            cs.backgroundSize.startsWith(antes.backgroundSize.split(',')[0]) &&
            cs.backgroundAttachment.startsWith(antes.backgroundAttachment.split(',')[0]),
        };
      })(),
    },
    link: (() => {
      const a = creditos?.querySelector('a');
      if (!a) return null;
      return {
        href: a.getAttribute('href'),
        target: a.getAttribute('target'),
        rel: a.getAttribute('rel'),
        seguro: a.getAttribute('rel')?.includes('noopener') && a.getAttribute('rel')?.includes('noreferrer'),
      };
    })(),
    escritaPreservada: textos.map((t) => ({ trecho: t.slice(0, 44), presente: texto.includes(t) })),
    transbordo: {
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      excedente: num(document.documentElement.scrollWidth - document.documentElement.clientWidth),
    },
    /* ORDEM VISUAL: `y` real de cada bloco. É o portão do item «Organizar nesta
       ordem» do documento, e ele só vale medido na tela — a reordenação é de
       layout, então a ordem no DOM aprovaria sem provar nada. */
    ordemVisual: [
      ['eyebrow', secao.querySelector('.isg-eyebrow')],
      ['logo', caixaLogo],
      ['foto', painel],
      ['diferencial-1', difs[0]],
      ['diferencial-2', difs[1]],
      ['citacao', citacao],
      ['creditos', creditos],
    ]
      .filter(([, n]) => !!n)
      .map(([nome, n]) => ({ nome, y: num(n.getBoundingClientRect().top + window.scrollY) }))
      .sort((a, b) => a.y - b.y)
      .map((o) => o.nome),
  };
};

const navegador = await chromium.launch({
  executablePath: `${process.env.LOCALAPPDATA}/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe`,
});

const relatorio = {
  peca: 'ISG Provider Lens /quem-somos',
  issue: 'SIS-87',
  url: ROTA,
  quando: new Date().toISOString(),
};

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
  await p.waitForSelector('.isg-secao', { timeout: 240_000 });

  /* Centra a seção TRÊS VEZES. O layout acima dela ainda muda depois da primeira
     rolagem (cena dos escritórios, Teatro de Reconhecimentos, imagens), e uma
     rolagem só deixa a seção fora de quadro — achado registrado em
     `medir-diferenciais.mjs`. Sem isto o `whileInView` não dispara e tudo é lido
     em opacidade 0. */
  const irAteASecao = async () => {
    await p.evaluate(() => {
      const s = document.querySelector('.isg-secao');
      const b = s.getBoundingClientRect();
      window.scrollTo(0, b.top + window.scrollY - Math.max(0, (window.innerHeight - b.height) / 2));
    });
    await p.waitForTimeout(1100);
  };
  for (let t = 0; t < 3; t += 1) await irAteASecao();
  await p.evaluate(() => document.fonts?.ready);
  await p.waitForTimeout(600);

  const bloco = await p.evaluate(LER, [TEXTOS, ARQUIVOS]);

  const base = `${PASTA}/isg-${alvo.nome}.png`;
  await p.screenshot({ path: base });

  /* CONTRASTE de cada texto em quadro. Todos, e não uma amostra: são seis famílias
     de tipo diferentes (sobretítulo, título de diferencial, texto, título e texto
     da citação, crédito, selo) e o sobretítulo é o menor de todos. */
  const alvos = await p.evaluate(() => {
    const emQuadro = (el) => {
      const b = el.getBoundingClientRect();
      return b.width > 0 && b.top > 0 && b.bottom < window.innerHeight;
    };
    const pares = [
      ['eyebrow', '.isg-eyebrow__rotulo'],
      ['diferencialTitulo', '.isg-diferencial__titulo'],
      ['diferencialTexto', '.isg-diferencial__texto'],
      ['citacaoTitulo', '.isg-citacao__titulo'],
      ['citacaoTexto', '.isg-citacao__texto'],
      ['creditos', '.isg-creditos > span'],
      ['seloTitulo', '.isg-selo__titulo'],
      ['seloTexto', '.isg-selo__texto'],
      ['link', '.isg-creditos a'],
    ];
    const saida = {};
    for (const [chave, sel] of pares) {
      const el = [...document.querySelectorAll(sel)].find(emQuadro);
      if (!el) {
        saida[chave] = null;
        continue;
      }
      const b = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      saida[chave] = {
        texto: (el.textContent || '').trim().slice(0, 50),
        cor: cs.color,
        fontSizePx: cs.fontSize,
        fontWeight: cs.fontWeight,
        /* Arredondado: `contrasteDe` indexa o buffer cru com estes números. */
        x: Math.round(b.left),
        y: Math.round(b.top + Math.min(b.height / 2, 9)),
      };
    }
    return saida;
  });
  bloco.contraste = {};
  for (const [chave, a] of Object.entries(alvos)) {
    bloco.contraste[chave] = a ? await contrasteDe(base, a) : null;
  }

  /* AS DUAS EMENDAS. O chanfro de cima é irmão anterior da seção; o de baixo é o
     irmão seguinte. Cada um é medido contra a seção que ele imita. */
  bloco.emendas = {
    /* As IRMÃS de verdade, e não `#premiacoes`/`#por-que-sistran`: aqueles são
       `id` de cabeçalho, em `<section>` INTERNAS, então `mesmoPai` e `vizinhas`
       liam `false` por endereço errado e o portão não dizia nada. Estas são as
       duas `<section>` que ficam de fato uma antes e uma depois do bloco. */
    acima: await emendaEm(p, '[aria-labelledby="premiacoes"]', '.isg-secao', `acima-${alvo.nome}`),
    abaixo: await emendaEm(
      p,
      '.isg-secao',
      '[aria-labelledby="por-que-sistran"]',
      `abaixo-${alvo.nome}`,
    ),
  };

  relatorio[alvo.nome] = bloco;
  await contexto.close();
}

/* ── MOVIMENTO REDUZIDO: os dois canais da casa ──────────────────────────────── */
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
  await p.waitForSelector('.isg-secao', { timeout: 240_000 });
  for (let t = 0; t < 3; t += 1) {
    await p.evaluate(() => {
      const s = document.querySelector('.isg-secao');
      const b = s.getBoundingClientRect();
      window.scrollTo(0, b.top + window.scrollY - Math.max(0, (window.innerHeight - b.height) / 2));
    });
    await p.waitForTimeout(1200);
  }
  await p.waitForTimeout(1000);
  canais[canal] = await p.evaluate(() => {
    const secao = document.querySelector('.isg-secao');
    const b = secao.getBoundingClientRect();
    const blocos = [
      ...secao.querySelectorAll('.isg-painel, .isg-diferencial, .isg-citacao, .isg-creditos, .isg-logo'),
    ];
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
      /* Nomeado à parte porque é a flutuação nova (pedido de 23/09) e é a única
         animação infinita da seção: aqui tem de ler `none`, e o deslocamento
         residual abaixo prova que ela parou NO QUADRO DE REPOUSO, não torta. */
      animacaoDaCitacao: getComputedStyle(secao.querySelector('.isg-citacao')).animationName,
      blocos: blocos.length,
      /* Portão simétrico: nada animado E tudo VISÍVEL. Reveal que morre em
         opacidade 0 é conteúdo apagado, e é o defeito clássico do reset global. */
      blocosVisiveis: blocos.filter((n) => {
        const cs = getComputedStyle(n);
        return n.getBoundingClientRect().width > 0 && Number(cs.opacity) > 0.99;
      }).length,
      piorOpacidade: Math.min(...blocos.map((n) => Number(getComputedStyle(n).opacity))),
      /* Deslocamento residual do motion: tem de ter voltado ao repouso. */
      piorDeslocamentoPx: Math.max(
        ...blocos.map((n) => Math.abs(new DOMMatrixReadOnly(getComputedStyle(n).transform).f)),
      ),
      imagensCarregadas: [...secao.querySelectorAll('img')].filter((i) => i.naturalWidth > 0).length,
    };
  });
  await contexto.close();
}
relatorio.movimentoReduzido = canais;

await navegador.close();
const saida = `${MEDIDAS}/isg-provider-lens.json`;
await writeFile(saida, `${JSON.stringify(relatorio, null, 2)}\n`);
console.log(JSON.stringify(relatorio, null, 2));
console.log(`\n→ ${saida}`);
