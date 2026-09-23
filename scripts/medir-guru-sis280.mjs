/**
 * SIS-280 — `/solucoes/guru-de-seguros` medida na rota viva.
 *
 * Adaptada de `medir-qaintegrado-sis287.mjs` (issue irmã), com os portões ajustados
 * ao que MUDA nesta rota:
 *
 *  1. MESMA ARQUITETURA DE SEÇÕES do Match AI: as faixas de primeiro nível com
 *     id/âncora e tom, lidas pelo MESMO código nas duas rotas no mesmo passe —
 *     arquitetura igual é contagem e sequência iguais, não parecença.
 *  2. IDENTIDADE PRÓPRIA: nenhum nó `matchai-*`, `smartminer-*` nem `qaintegrado-*`
 *     aqui, e nenhum `gurudeseguros-*` nas TRÊS irmãs (vazamento nos dois sentidos,
 *     com três irmãs do lado de lá).
 *  3. A ESCRITA VEM DO DADO: os parágrafos dos cards e das duas citações conferidos
 *     caractere a caractere contra `acceleratorPages.ts`, e o `lead` idem. É o portão
 *     que prova «só copy do site» em vez de afirmá-lo. Aqui ele é mais apertado que
 *     na irmã porque a DIVISÃO entre grade e faixa escura é derivada (`ehFala`): o
 *     portão confere que a união dos dois lados é exatamente o bloco do dado, sem
 *     parágrafo perdido nem repetido.
 *  4. CONTRASTE por pixel COMPOSTO (foto + véu + grade + SVG empilhados) nos
 *     `h1`/`h2`, no subtítulo do hero e na pílula ciano `#0ED8F6`, que é a cor de
 *     `tone` do dado e a decisão de cor desta rota.
 *  5. MOVIMENTO: `stroke-dashoffset` dos arcos e da onda do fio, `scale` das barras
 *     e do halo MUDANDO entre dois quadros do MESMO nó — presença de `animation-name`
 *     não prova movimento.
 *  6. ÂNCORAS E INDICADOR — e aqui está a diferença prática em relação à SIS-287: a
 *     slug tem DOIS `heading`, logo três paradas, logo o indicador lateral EXISTE.
 *     O portão tem de ENCONTRAR as paradas (e não confirmar ausência), com os dois
 *     `id` batendo com `idDoBloco(heading)`, e confirmar que os títulos DERIVADOS não
 *     colidiram com eles.
 *  7. A MIGRAÇÃO DE TOM: `guru-de-seguros` saiu de `TOM_MEDIO_DE_ACELERADOR` para
 *     `TOM_CLARO_DE_ACELERADOR`. O que a torna verificável na rota é o fundo REAL das
 *     duas faixas ancoradas — se alguma não for `.section-light`, a migração está
 *     errada. Medido, não afirmado.
 *  8. A MARCA NA CAPA: o letreiro é IMAGEM nesta rota (existe arte de letra clara),
 *     então o portão é o da SIS-279 e não o da SIS-287 — o `h1` tem de ter `img` com
 *     `alt` não vazio, e a contagem de cápsulas tem de ser ZERO (não há arte de
 *     carimbo para esta slug, e o docblock declara a omissão).
 *  9. OS DOIS CANAIS de movimento reduzido, com os arcos e a onda do fio obrigados a
 *     ficar DESENHADOS e a onda obrigada a ficar com traço contínuo — portão de
 *     conteúdo, não de movimento.
 *
 * Uso: node scripts/medir-guru-sis280.mjs   (com o `next dev` em :3000)
 */

import { writeFile } from 'node:fs/promises';

const PLAYWRIGHT =
  'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
const { chromium } = await import(PLAYWRIGHT);
const URL_BASE = 'http://localhost:3000';
const ROTA = '/solucoes/guru-de-seguros';

/* A ESCRITA ESPERADA, copiada do dado — o portão 3 compara com o que está na tela.
   Se o dado mudar, este arquivo tem de mudar junto: é de propósito, porque um portão
   que lê a mesma variável que o componente não prova nada.

   Na primeira execução deste portão os cinco parágrafos foram transcritos de memória
   e DOIS acusaram divergência (o 1º e o 4º). A divergência era da transcrição, não da
   tela: os textos abaixo estão agora copiados do arquivo de dados caractere a caractere,
   inclusive as aspas curvas e o travessão. Vale registrar porque é exatamente o que o
   portão existe para pegar — só que do lado errado da comparação. */
const PARAGRAFOS_DO_DADO = [
  'Inicialmente implantamos uma base, em parceria com a ENS (Escola de Negócios e Seguros) e a CNseg (Confederação Nacional das Seguradoras), que disponibiliza conteúdo educativo através de perguntas e respostas, para alunos e associados, assim como à sociedade de forma geral, expandindo a educação e cultura do seguro. Além de conjuntos de perguntas e respostas, também oferecemos notícias sobre Seguros e quiz de Seguros.',
  'Estamos trabalhando em aplicações transacionais, integrando legados e permitindo soluções como Cotação de Seguros, Contratação de Seguro, apoio a Avisos de Sinistro.',
  'Logo, você poderá perguntar: “Alexa, qual o status do meu sinistro?” E ela responderá, informando eventuais documentos e ações pendentes e a previsão de conclusão.',
  'Ou ainda: “Alexa, qual a diferença básica do Seguro de Vida resgatável?” E ela informará as diferenças, para que o corretor possa explicar ao cliente. Também será possível perguntar questões relevantes sobre a apólice do seu cliente e questionamentos sobre cálculos, emissões e comissionamento, através de acessos aos sistemas legados das seguradoras.',
  'Alexa trará aos corretores e seguradoras a imagem de modernidade, agregando agilidade e flexibilidade às comunicações e relacionamento.',
];
/* `idDoBloco` = NFD + tira diacríticos + minúsculas + não-alfanumérico → `-`, com as
   pontas aparadas. Os DOIS `heading` do dado dão estes dois ids, que são as duas
   paradas do indicador. */
const ANCORAS_ESPERADAS = ['como-funciona', 'de-onde-pode-ser-acessada'];
/* Os títulos DERIVADOS (fragmentos verbatim), que NÃO podem colidir com os de cima. */
const TITULOS_DERIVADOS = ['Relacionamento por voz', 'Logo, você poderá perguntar'];
const ehFala = (t) => t.includes('“');

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
   quando há foto, véu, grade e SVG empilhados. */
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
  /* Hidratação: sem esta espera mede-se o HTML do servidor, sem observador montado. */
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

/* A leitura de arquitetura é GENÉRICA de propósito: ela roda nas quatro rotas, então
   não pode perguntar por classe de nenhuma. Os grafismos entram por sufixo. */
const arquitetura = (page) =>
  page.evaluate(() => {
    const faixas = [...document.querySelectorAll('main > section, main > nav[aria-labelledby]')];
    return faixas.map((s) => ({
      id: s.id || s.getAttribute('aria-labelledby') || s.tagName,
      tag: s.tagName,
      clara: s.classList.contains('section-light'),
      overflow: getComputedStyle(s).overflow,
      corDeFundo: getComputedStyle(s).backgroundColor,
      titulo: s.querySelector('h1, h2')?.textContent.trim().slice(0, 44) ?? null,
      cards: s.querySelectorAll('ol > li, ul > li').length,
      grafismos: {
        acentos: s.querySelector(':scope > [class$="-acentos"]') ? 1 : 0,
        arte: s.querySelector(
          ':scope > svg[class*="-malha"], :scope > svg[class*="-esteira"], :scope > svg[class*="-ondas"]',
        )
          ? 1
          : 0,
        malha: s.querySelector(':scope > .grade-tecnica') ? 1 : 0,
      },
    }));
  });

const resultado = {
  esperado: { PARAGRAFOS_DO_DADO, ANCORAS_ESPERADAS, TITULOS_DERIVADOS },
};

for (const largura of [390, 1440]) {
  const { ctx, page, erros } = await abrir({ largura, reduce: false });
  await rampa(page);

  const faixas = await arquitetura(page);

  /* IDENTIDADE — vazamento de classe nos dois sentidos e as peças próprias. */
  const identidade = await page.evaluate(() => ({
    nosMatchai: document.querySelectorAll('[class*="matchai-"]').length,
    nosSmartminer: document.querySelectorAll('[class*="smartminer-"]').length,
    nosQaintegrado: document.querySelectorAll('[class*="qaintegrado-"]').length,
    nosGuru: document.querySelectorAll('[class*="gurudeseguros-"]').length,
    /* O letreiro é IMAGEM nesta rota (existe arte de letra clara), então o portão é o
       da SIS-279: `img` dentro do `h1` e `alt` NÃO vazio — `h1` cujo conteúdo inteiro
       é imagem com `alt=""` é cabeçalho sem nome acessível. */
    letreiro: (() => {
      const h1 = document.querySelector('#topo h1');
      const img = h1?.querySelector('img');
      return {
        temImagem: Boolean(img),
        alt: img?.getAttribute('alt') ?? null,
        src: img?.getAttribute('src') ?? null,
        largura: img ? Math.round(img.getBoundingClientRect().width) : null,
        textoSolto: h1 ? h1.textContent.trim() : null,
      };
    })(),
    /* Não existe arte de cápsula desta slug: o portão registra a AUSÊNCIA, como a
       primeira volta da SIS-279 fez, para a omissão ficar medida e não implícita. */
    carimbos: document.querySelectorAll('.carimbo-batida').length,
    capaDoHero:
      document.querySelector('#topo [data-route-critical-media]')?.getAttribute('src') ?? null,
    arcos: document.querySelectorAll('.gurudeseguros-arco').length,
    barras: document.querySelectorAll('.gurudeseguros-barra').length,
    selos: document.querySelectorAll('.gurudeseguros-selo').length,
    halos: document.querySelectorAll('.gurudeseguros-halo').length,
    placas: document.querySelectorAll('.gurudeseguros-placa').length,
    ondasDeFio: document.querySelectorAll('.gurudeseguros-onda-fio').length,
    citacoes: document.querySelectorAll('blockquote.gurudeseguros-citacao').length,
    /* Os placeholders declarados: toda imagem de card tem de apontar para a capa do
       cartão da vitrine (item 3: «imagem = capa Guru até haver artes»). */
    artesDosCards: [...document.querySelectorAll('.gurudeseguros-cartao img')].map((i) =>
      i.getAttribute('src'),
    ),
  }));

  /* A ESCRITA — comparação literal com o dado, incluindo a prova de que a divisão
     derivada é uma PARTIÇÃO do bloco: união igual ao dado, sem sobra nem repetição. */
  const escrita = await page.evaluate(() => ({
    lead:
      [...document.querySelectorAll('main p')]
        .map((p) => p.textContent.trim())
        .find((t) => t.startsWith('É uma assistente conversacional')) ?? null,
    subtituloDoHero: document.querySelector('#topo p')?.textContent.trim() ?? null,
    cards: [...document.querySelectorAll('.gurudeseguros-cartao p')].map((p) =>
      p.textContent.trim(),
    ),
    citacoes: [...document.querySelectorAll('blockquote.gurudeseguros-citacao p')].map((p) =>
      p.textContent.trim(),
    ),
    titulos: [...document.querySelectorAll('main h1, main h2, main h3')].map((h) =>
      h.textContent.trim(),
    ),
    idsDosTitulos: [...document.querySelectorAll('main h2[id]')].map((h) => ({
      id: h.id,
      texto: h.textContent.trim(),
    })),
    passos: [...document.querySelectorAll('main ol li h3')].map((h) => h.textContent.trim()),
    /* As pastilhas de dispositivo: cada uma tem de ser substring do parágrafo de
       acesso, que é o que o filtro do componente promete. */
    pastilhas: [...document.querySelectorAll('main ul[aria-hidden] li')].map((l) =>
      l.textContent.trim(),
    ),
    paragrafoDeAcesso:
      [...document.querySelectorAll('main p')]
        .map((p) => p.textContent.trim())
        .find((t) => t.includes('Echo Dots')) ?? null,
  }));
  escrita.particaoBate =
    JSON.stringify([...escrita.cards, ...escrita.citacoes].sort()) ===
    JSON.stringify([...PARAGRAFOS_DO_DADO].sort());
  escrita.cardsSaoOsNaoFalados =
    JSON.stringify(escrita.cards) === JSON.stringify(PARAGRAFOS_DO_DADO.filter((p) => !ehFala(p)));
  escrita.citacoesSaoAsFaladas =
    JSON.stringify(escrita.citacoes) === JSON.stringify(PARAGRAFOS_DO_DADO.filter(ehFala));
  escrita.subtituloEhPrefixoDoLead = Boolean(
    escrita.lead && escrita.subtituloDoHero && escrita.lead.startsWith(escrita.subtituloDoHero),
  );
  escrita.pastilhasNoTexto = escrita.paragrafoDeAcesso
    ? escrita.pastilhas.every((p) => escrita.paragrafoDeAcesso.includes(p))
    : null;
  escrita.ancorasBatem =
    JSON.stringify(escrita.idsDosTitulos.map((t) => t.id).filter((id) => id !== 'conheca-tambem')) !==
    '[]'
      ? ANCORAS_ESPERADAS.every((a) => escrita.idsDosTitulos.some((t) => t.id === a))
      : false;
  /* Os títulos DERIVADOS não podem ter gerado id igual aos do dado: id repetido faria
     o indicador levar para a faixa errada. */
  escrita.derivadosNaoColidem = escrita.idsDosTitulos
    .filter((t) => TITULOS_DERIVADOS.includes(t.texto))
    .every((t) => !ANCORAS_ESPERADAS.includes(t.id));
  escrita.idsDuplicados = await page.evaluate(() => {
    const ids = [...document.querySelectorAll('main [id]')].map((n) => n.id);
    return ids.filter((id, i) => ids.indexOf(id) !== i);
  });

  /* PORTÃO 7 — A MIGRAÇÃO DE TOM, medida pelo fundo REAL das duas faixas ancoradas.
     `claro` só é o valor certo se a faixa for `.section-light`; se alguma fosse o
     raster azul ou escura, a migração estaria errada. */
  const tomDasParadas = await page.evaluate((ancoras) => {
    return ancoras.map((id) => {
      const h = document.getElementById(id);
      const s = h?.closest('section');
      return {
        id,
        existe: Boolean(h),
        clara: Boolean(s?.classList.contains('section-light')),
        corDeFundo: s ? getComputedStyle(s).backgroundColor : null,
      };
    });
  }, ANCORAS_ESPERADAS);

  /* MOVIMENTO — dois quadros do MESMO nó, com o nó levado ao centro da tela antes de
     medir: laço de elemento fora de quadro corre, mas o valor lido seria de algo que
     ninguém vê. */
  const movimento = await page.evaluate(async () => {
    const dois = async (el, prop, pseudo) => {
      el.closest('section, nav')?.scrollIntoView({ block: 'center' });
      await new Promise((r) => setTimeout(r, 350));
      /* `pseudo` não é refinamento: o equalizador das citações É o `::after`, e
         `getComputedStyle(el)` sem o segundo argumento devolve o estilo do
         `blockquote`, que não tem laço nenhum. Sem isto o portão media o nó errado
         e acusava `0/2` para uma animação que corre. */
      const cs = getComputedStyle(el, pseudo ?? null);
      const a = cs[prop];
      await new Promise((r) => setTimeout(r, 420));
      return {
        animacao: cs.animationName,
        quadroA: a,
        quadroB: getComputedStyle(el, pseudo ?? null)[prop],
        /* `display` do nó e visibilidade: as ondas de voz são `display: none` abaixo
           de `lg` e o fio abaixo de `sm`, por decisão de desenho. Animação em nó não
           renderizado não corre, então sem este campo o «0 de N» medido a 390px
           pareceria laço morto em vez de peça ausente. */
        display: cs.display,
        visivel: Boolean(el.getClientRects().length),
      };
    };
    const ler = async (sel, prop, pseudo) => {
      const out = [];
      for (const el of document.querySelectorAll(sel)) {
        const d = await dois(el, prop, pseudo);
        out.push({ ...d, moveu: d.quadroA !== d.quadroB });
      }
      /* A conta que vale é sobre os nós VISÍVEIS: a 390px as ondas e o fio não são
         renderizados de propósito, e «0 de 16» ali é ausência de peça, não laço morto.
         Somar os dois casos num único número é o jeito de um portão mentir. */
      const visiveis = out.filter((x) => x.visivel);
      return {
        nos: out,
        visiveis: visiveis.length,
        moveramDosVisiveis: visiveis.filter((x) => x.moveu).length,
      };
    };
    return {
      arco: await ler('.gurudeseguros-arco', 'strokeDashoffset'),
      barra: await ler('.gurudeseguros-barra', 'scale'),
      halo: await ler('.gurudeseguros-halo', 'scale'),
      ondaDoFio: await ler('.gurudeseguros-onda-linha', 'strokeDashoffset'),
      fala: await ler('.gurudeseguros-citacao', 'backgroundPositionX', '::after'),
    };
  });

  /* CONTRASTE — tinta do título contra o pixel composto ao lado dele, mais a pílula
     ciano (fundo próprio `#0ED8F6`, tinta navy). */
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
    contrastes.push({
      alvo: t.alvo,
      tinta: t.tinta,
      fundoComposto: fundo,
      contraste: contraste(t.tinta, fundo),
    });
  }

  /* O SUBTÍTULO do hero é tinta branca a 85% sobre a capa + véu — o ponto mais
     apertado da dobra, porque o texto é menor que o letreiro e mora sobre foto. */
  let subtituloContraste = null;
  {
    const t = await page.evaluate(() => {
      window.scrollTo(0, 0);
      const p = document.querySelector('#topo p');
      if (!p) return null;
      const r = p.getBoundingClientRect();
      /* CLAMP nos DOIS eixos. A 390px o parágrafo ocupa a largura toda, então
         `right + 20` cai FORA da janela e o recorte 1x1 estoura — com a borda direita
         inalcançável, o ponto honesto é o vão à ESQUERDA do texto, que é fundo da
         mesma faixa. */
      const x = Math.round(r.right + 20);
      return {
        tinta: getComputedStyle(p).color,
        x: x <= window.innerWidth - 3 ? x : Math.max(2, Math.round(r.left - 8)),
        y: Math.max(2, Math.min(window.innerHeight - 3, Math.round(r.top + r.height / 2))),
      };
    });
    if (t) {
      await page.waitForTimeout(250);
      const fundo = await pixel(page, t.x, t.y);
      subtituloContraste = { tinta: t.tinta, fundoComposto: fundo, contraste: contraste(t.tinta, fundo) };
    }
  }

  /* RESÍDUO DO LETREIRO DA CAPA — o portão que troca a minha leitura da captura por um
     número. A capa desta rota também traz letreiro desenhado, e a faixa escura das
     falas passa por cima dela com o véu de 0,995 herdado da SIS-287 (onde ele subiu
     duas vezes, cada uma contra uma captura). O critério é o DESVIO de luminância numa
     janela da faixa SEM texto: se o contorno sobrevivesse, os pixels claros dele
     apareceriam como amplitude larga. O que sobra de variação legítima é a grade
     técnica, que é linha de 1px em rgba baixo. */
  let residuoDoLetreiro = null;
  {
    /* O scroll vai num passe SEPARADO da medição: `scrollIntoView` no mesmo `evaluate`
       devolve retângulos da posição ANTIGA, e foi assim que a janela caiu fora da
       imagem na primeira execução deste portão na irmã. */
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
      const rp = faixa.querySelector('h2')?.getBoundingClientRect();
      const rq = faixa.querySelector('blockquote')?.getBoundingClientRect();
      /* DUAS candidatas, testadas em ordem. A primeira é o vão à direita do título; se
         ela cair sobre as ondas de voz (que moram justamente no canto superior direito),
         a segunda é o vão à DIREITA da primeira citação, que é fundo da mesma faixa e
         fica longe do grafismo. Uma candidata única deixaria o portão sem amostra numa
         das larguras — e portão sem amostra não é portão. */
      const candidatas = [];
      if (rp && rp.right + 24 < window.innerWidth - 12)
        candidatas.push({ onde: 'direita-do-titulo', x: rp.right + 24, y: rp.top });
      if (rq && rq.right + 20 < window.innerWidth - 12)
        candidatas.push({ onde: 'direita-da-citacao', x: rq.right + 20, y: rq.top + 8 });
      /* TERCEIRA candidata: a tira de fundo entre a base da trilha e a base da faixa.
         Ela existe porque as duas primeiras caíram sobre grafismo próprio nas duas
         larguras — as ondas ocupam 22rem do canto direito e a citação encosta nelas.
         Aqui embaixo não há ondas (a variante `--baixo` não é usada nesta faixa) nem
         selo, e é fundo da MESMA faixa, que é o que o portão precisa amostrar. */
      const rt = faixa.querySelector('ol')?.getBoundingClientRect();
      if (rt && rt.bottom + 8 < Math.min(r.bottom, window.innerHeight) - 12)
        candidatas.push({ onde: 'abaixo-da-trilha', x: Math.max(r.left + 24, 2), y: rt.bottom + 8 });
      if (!candidatas.length) return { semVao: true };
      const medir = (c) => {
      /* CLAMP nos dois eixos, e só depois o tamanho: recorte tem de caber inteiro na
         janela, senão o Playwright estoura. */
      let x = Math.max(0, Math.min(Math.round(c.x), window.innerWidth - 10));
      let y = Math.max(0, Math.min(Math.round(c.y), window.innerHeight - 10));
      const largura = Math.max(8, Math.min(240, window.innerWidth - x - 2));
      const altura = Math.max(8, Math.min(70, Math.min(r.bottom, window.innerHeight) - y - 2));
      /* CONTAMINAÇÃO declarada: se qualquer ponto da grade cair sobre nó com texto, o
         portão devolve `contaminada` em vez de uma amplitude que pareceria defeito de
         véu (foi o que aconteceu a 390px na irmã). */
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
      /* GRAFISMO PRÓPRIO contamina também, e a detecção dele NÃO pode passar por
         `elementsFromPoint`: as ondas de voz têm `pointer-events: none`, então o ponto
         atravessa e a varredura devolve só a `<section>`. Foi assim que a janela de
         1440px em x=1302 passou por «limpa» duas voltas seguidas, quando na verdade
         cai em cheio na caixa de 22rem do canto superior direito — e a amplitude de 35
         que ela media era a tinta ciano dos arcos, peça desta página.
         Portanto a checagem é GEOMÉTRICA: interseção de retângulos. `.grade-tecnica`
         fica DE FORA da lista de propósito — a variação de 1px dela é justamente o
         resíduo legítimo contra o qual o limiar foi pensado. */
      const rect = { left: x, top: y, right: x + largura, bottom: y + altura };
      const cruza = (o) =>
        o.width > 0 &&
        o.height > 0 &&
        o.left < rect.right &&
        o.right > rect.left &&
        o.top < rect.bottom &&
        o.bottom > rect.top;
      const grafismoProprio = [
        ...faixa.querySelectorAll(
          'svg[class*="gurudeseguros-ondas"], .gurudeseguros-selo, .gurudeseguros-halo, .gurudeseguros-placa, .gurudeseguros-citacao',
        ),
      ].some((n) => cruza(n.getBoundingClientRect()));
      return {
        onde: c.onde,
        x,
        y,
        largura,
        altura,
        faixa: faixa.getAttribute('aria-labelledby'),
        contaminada,
        grafismoProprio,
      };
      };
      const medidas = candidatas.map(medir);
      const limpa = medidas.find((m) => !m.contaminada && !m.grafismoProprio);
      return limpa ?? { ...medidas[0], descartadas: medidas };
    });
    if (janela?.semVao) {
      /* 390px: nem o título nem a citação deixam vão à direita, porque ambos ocupam a
         largura toda. Registrar a ausência de amostra é obrigatório — um campo `null`
         seria lido depois como «portão passou». */
      residuoDoLetreiro = {
        motivo:
          'nenhuma candidata nesta largura: titulo e citacao ocupam a largura toda, nao ha vao de fundo para amostrar',
      };
    } else if (janela && janela.largura >= 8 && janela.altura >= 8) {
      await page.waitForTimeout(250);
      const amostrar = async () => {
        const buf = await page.screenshot({
          animations: 'disabled',
          clip: { x: janela.x, y: janela.y, width: janela.largura, height: janela.altura },
        });
        return page.evaluate(
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
      };
      const stats = await amostrar();
      /* ATRIBUIÇÃO da amplitude. O número cru não distingue «contorno do letreiro
         sobreviveu ao véu» de «a grade técnica tem linhas claras», e são coisas
         opostas: a segunda é a peça funcionando. Então a mesma janela é amostrada
         outras duas vezes, apagando uma camada por vez — é a diferença entre as três
         leituras que responde de quem é a variação. Medido, não interpretado.
         (As camadas voltam no fim; a página não é reaproveitada depois deste bloco,
          mas restaurar mantém a captura de tela seguinte fiel.) */
      await page.evaluate(() =>
        document.querySelectorAll('.grade-tecnica').forEach((n) => {
          n.dataset.ocultoPorPortao = '1';
          n.style.display = 'none';
        }),
      );
      await page.waitForTimeout(250);
      const semGrade = await amostrar();
      await page.evaluate(() =>
        document.querySelectorAll('main > section img').forEach((n) => {
          n.dataset.ocultoPorPortao = '1';
          n.style.display = 'none';
        }),
      );
      await page.waitForTimeout(250);
      const semGradeNemCapa = await amostrar();
      await page.evaluate(() =>
        document.querySelectorAll('[data-oculto-por-portao]').forEach((n) => {
          n.style.display = '';
          delete n.dataset.ocultoPorPortao;
        }),
      );
      await page.waitForTimeout(250);
      residuoDoLetreiro = janela.grafismoProprio
        ? {
            janela,
            motivo:
              'todas as candidatas caem sobre grafismo desta pagina (ondas/selo/halo): tinta ciano propria nao e residuo de letreiro, amostra descartada',
          }
        : janela.contaminada
          ? { janela, motivo: 'janela com tinta de conteudo dentro: amostra descartada' }
          : {
              janela,
              ...stats,
              atribuicao: {
                semGrade,
                semGradeNemCapa,
                /* O que a capa deixa passar por baixo do véu: é ESTE o número do
                   critério, não a amplitude crua. */
                amplitudeDaCapa: Number((semGrade.amplitude - semGradeNemCapa.amplitude).toFixed(2)),
                amplitudeDaGrade: Number((stats.amplitude - semGrade.amplitude).toFixed(2)),
              },
            };
    }
  }

  await page.screenshot({
    path: `docs/capturas/sis280-guru-${largura}.png`,
    fullPage: true,
    animations: 'disabled',
  });

  resultado[`w${largura}`] = {
    faixas,
    identidade,
    escrita,
    tomDasParadas,
    movimento,
    contrastes,
    subtituloContraste,
    residuoDoLetreiro,
    erros,
  };
  await ctx.close();
}

/* A ARQUITETURA DAS IRMÃS, medida no mesmo passe: «mesma estrutura» só é portão se os
   dois lados forem lidos pelo mesmo código. E o vazamento é conferido nas três, porque
   a issue manda variar contra as três. */
for (const irma of ['match-ai', 'smart-miner', 'qa-integrado']) {
  const { ctx, page } = await abrir({ largura: 1440, reduce: false, rota: `/solucoes/${irma}` });
  await rampa(page);
  resultado[`irma-${irma}`] = {
    faixas: await arquitetura(page),
    vazamentoDaqui: await page.evaluate(
      () => document.querySelectorAll('[class*="gurudeseguros-"]').length,
    ),
  };
  await ctx.close();
}

/* Uma slug genérica intacta (critério: «outras slugs genéricas intactas»). */
{
  const { ctx, page, erros } = await abrir({
    largura: 1440,
    reduce: false,
    rota: '/solucoes/lumina-ai',
  });
  resultado.genericaIntacta = {
    faixas: await arquitetura(page),
    temTopo: await page.evaluate(() => Boolean(document.querySelector('#topo'))),
    corposProprios: await page.evaluate(
      () =>
        document.querySelectorAll(
          '[class*="gurudeseguros-"], [class*="qaintegrado-"], [class*="smartminer-"], [class*="matchai-"]',
        ).length,
    ),
    erros,
  };
  await ctx.close();
}

/* O INDICADOR LATERAL — e aqui o portão é o INVERSO do da SIS-287: esta slug tem dois
   `heading`, logo três paradas, logo o indicador EXISTE e os rótulos têm de ser
   «Início», «Como funciona?» e «Acesso» (o `navLabel` do dado). A comparação com uma
   slug que também tem paradas é o controle. */
{
  const ler = (page) =>
    page.evaluate(() => {
      const nos = [
        ...document.querySelectorAll('[class*="scrollspy"], [data-scrollspy], nav[aria-label*="Seç"]'),
      ];
      return {
        nos: nos.length,
        rotulos: nos.length
          ? [...nos[0].querySelectorAll('a, button')].map((a) => a.textContent.trim()).filter(Boolean)
          : [],
        destinos: nos.length
          ? [...nos[0].querySelectorAll('a[href^="#"]')].map((a) => a.getAttribute('href'))
          : [],
      };
    });
  const aqui = await abrir({ largura: 1440, reduce: false });
  const indicadorAqui = await ler(aqui.page);
  await aqui.ctx.close();
  const controle = await abrir({ largura: 1440, reduce: false, rota: '/solucoes/match-ai' });
  const indicadorNoControle = await ler(controle.page);
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
          tracejado: cs.strokeDasharray,
          escala: cs.scale,
          display: cs.display,
          contorno: cs.stroke,
        };
      });
    return {
      arco: ler('.gurudeseguros-arco'),
      barra: ler('.gurudeseguros-barra'),
      halo: ler('.gurudeseguros-halo'),
      onda: ler('.gurudeseguros-onda-linha'),
      cartao: ler('.gurudeseguros-cartao'),
      placa: ler('.gurudeseguros-placa'),
    };
  });
  resultado[`reduce-${canal}`] = {
    atributoNoHtml: atributo,
    animacoesVivas: ['arco', 'barra', 'halo', 'onda', 'cartao'].reduce((acc, k) => {
      acc[k] = d[k].filter((x) => x.animacao !== 'none').length;
      return acc;
    }, {}),
    /* PORTÃO DE CONTEÚDO: arco e onda têm de parar DESENHADOS (deslocamento 0), não
       apagados. `parseFloat` e NÃO `Number`: `strokeDashoffset` computado vem com
       unidade (`"0px"`), e `Number('0px')` é `NaN` — foi o falso negativo da irmã. */
    arcosDesenhados: d.arco.filter((a) => parseFloat(a.traco) === 0).length,
    totalDeArcos: d.arco.length,
    ondasDesenhadas: d.onda.filter((o) => parseFloat(o.traco) === 0).length,
    /* A onda do fio fica CONTÍNUA: sem tracejado ela é a linha que liga os passos. */
    ondasContinuas: d.onda.every((o) => o.tracejado === 'none' || o.tracejado === ''),
    barrasCheias: d.barra.every((b) => b.escala === 'none' || b.escala.startsWith('1')),
    /* O halo em repouso é invisível DE PROPÓSITO (o repouso dele é `opacity: 0`); quem
       marca o passo é a placa em losango e o ícone, que continuam lá. */
    halosEmRepouso: d.halo.every((h) => Number(h.opacidade) === 0),
    placas: d.placa.length,
    onda: d.onda,
    erros,
  };
  await ctx.close();
}

await navegador.close();
await writeFile('docs/medidas/sis280-guru-de-seguros.json', `${JSON.stringify(resultado, null, 2)}\n`);
console.log(JSON.stringify(resultado, null, 2));
