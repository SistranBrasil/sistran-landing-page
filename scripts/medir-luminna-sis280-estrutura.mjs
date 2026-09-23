/**
 * SIS-280 — `/solucoes/luminna-ai` medida na rota viva (slug com dois n + estrutura
 * Match AI).
 *
 * Adaptada de `medir-guru-sis280.mjs` (issue irmã). ARQUIVO NOVO e não reescrita do
 * `scripts/medir-luminna-sis280.mjs` que já existe: aquele é a sonda da issue da
 * GRAFIA, aponta para `/solucoes/lumina-ai` (um n) e os seletores dele são do template
 * genérico. Sobrescrevê-lo apagaria a medição que fechou aquela issue; ele fica no
 * lugar e passa a medir a rota REDIRECIONADA — o que está declarado no comentário da
 * issue em vez de corrigido em silêncio.
 *
 * Os portões, na ordem dos critérios da issue:
 *
 *  1. AS DUAS ROTAS: `/solucoes/luminna-ai` responde 200 e `/solucoes/lumina-ai`
 *     responde 308 com `location` para a nova. Medido pela resposta HTTP e pela URL
 *     final do navegador — «redireciona» é um número de status, não uma impressão.
 *  2. MESMA ARQUITETURA DE SEÇÕES do Match AI: faixas de primeiro nível com id/âncora
 *     e tom, lidas pelo MESMO código nas duas rotas no mesmo passe.
 *  3. IDENTIDADE PRÓPRIA: nenhum nó `matchai-*`/`smartminer-*`/`qaintegrado-*`/
 *     `gurudeseguros-*`/`connectapi-*` aqui, e nenhum `luminna-*` nas seis irmãs
 *     (vazamento nos dois sentidos), mais a contagem das três peças próprias (anel do
 *     ciclo, trilho de etapa no pé do cartão, fio vertical com pulso).
 *  4. A ESCRITA VEM DO DADO: `lead`, os quatro desafios, os sete benefícios, o `intro`
 *     e as quatro categorias de integração e os dois parágrafos de fecho, conferidos
 *     caractere a caractere contra `acceleratorPages.ts` (transcritos aqui de
 *     propósito: portão que lê a mesma variável do componente não prova nada).
 *  5. UI SÓ «LUMINNA»: zero ocorrências de `Lumina` sem o segundo n no texto visível.
 *     A RESSALVA medida é o letreiro: a grafia de um n está desenhada nos pixels do
 *     PNG, fora de escopo, e o que o portão pode exigir é `alt` legível.
 *  6. ÂNCORAS E INDICADOR: três `heading` no dado ⇒ quatro paradas ⇒ o indicador
 *     lateral EXISTE. Os ids têm de bater com `idDoBloco(heading)` e os títulos
 *     derivados não podem colidir com eles.
 *  7. OS TONS: `desafios-…` e `integracao-versatil` migraram para
 *     `TOM_CLARO_DE_ACELERADOR` e `beneficios` saiu de `TOM_MEDIO_DE_ACELERADOR` (ficou
 *     escura). Medido pelo fundo REAL de cada faixa ancorada.
 *  8. CONTRASTE por pixel COMPOSTO (foto + véu + grade + SVG empilhados) nos
 *     `h1`/`h2`, no subtítulo do hero e na pílula `#57B7EE` do hero.
 *  9. MOVIMENTO: `rotate` das órbitas e do arco, `scale` do trilho e
 *     `stroke-dashoffset` do pulso MUDANDO entre dois quadros do MESMO nó — presença de
 *     `animation-name` não prova movimento.
 * 10. OS DOIS CANAIS de movimento reduzido, com o trilho obrigado a ficar CHEIO e o
 *     pulso a ficar com traço CONTÍNUO — portão de conteúdo, não de movimento.
 *
 * Uso: node scripts/medir-luminna-sis280-estrutura.mjs   (com o `next dev` em :3000)
 */

import { writeFile } from 'node:fs/promises';

const PLAYWRIGHT =
  'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
const { chromium } = await import(PLAYWRIGHT);
const URL_BASE = 'http://localhost:3000';
const ROTA = '/solucoes/luminna-ai';
const ROTA_VELHA = '/solucoes/lumina-ai';

const LEAD =
  'Uma solução integrada de IA generativa que orquestra todo o Ciclo de Vida de Desenvolvimento de Software (SDLC), agilizando processos e integrando ferramentas líderes de mercado.';
const DESAFIOS = [
  ['Demanda Crescente', 'Como atender à necessidade de código de alta qualidade de forma ágil e produtiva?'],
  ['Débitos Técnicos', 'Como evitar a acumulação de débitos técnicos e resolver os existentes?'],
  ['Segurança e Conformidade', 'Como garantir baixa vulnerabilidade e respostas rápidas?'],
  ['Documentação Eficiente', 'Como manter registros claros e acessíveis?'],
];
const BENEFICIOS = [
  ['Melhoria na Qualidade e Confiabilidade', 'Produtos mais robustos e confiáveis'],
  ['Aumento da Produtividade', 'Equipes mais eficientes e projetos mais rápidos'],
  ['Redução de Retrabalho e Custos', 'Menos correções e otimização de recursos'],
  ['Satisfação do Cliente', 'Experiência aprimorada para o usuário final'],
  ['Precisão em Previsões e Estimativas', 'Planejamento mais assertivo'],
  ['Redução do Time to Market', 'Lançamentos mais rápidos e competitivos'],
  ['Aumento da Robustez de Sistemas', 'Soluções mais estáveis e seguras'],
];
const INTRO_INTEGRACAO =
  'O Luminna AI foi desenvolvido para ser facilmente integrável, oferecendo compatibilidade com uma ampla variedade de soluções de software de terceiros.';
const INTEGRACAO = [
  'Repositórios de código',
  'Ferramentas de Análise de Código',
  'Serviços de IA',
  'Ferramentas de Gestão de Projetos',
];
const FECHO = [
  'O Luminna AI representa uma revolução no desenvolvimento de software, proporcionando eficiência, qualidade e rapidez.',
  'Com sua integração versátil e ferramentas avançadas, é a solução ideal para empresas que buscam se destacar no mercado competitivo atual.',
];
/* `idDoBloco` = NFD + tira diacríticos + minúsculas + não-alfanumérico → `-`, pontas
   aparadas. Os TRÊS `heading` do dado dão estes três ids; com o `topo`, quatro paradas. */
const ANCORAS_ESPERADAS = [
  'desafios-no-desenvolvimento-de-software',
  'beneficios',
  'integracao-versatil',
];
/* Os dois títulos DERIVADOS (fragmento verbatim do texto da própria faixa), que NÃO
   podem colidir com os de cima. */
const TITULOS_DERIVADOS = [
  'Todo o Ciclo de Vida de Desenvolvimento de Software',
  'Uma revolução no desenvolvimento de software',
];

/* O contador da grafia: `Lumina` NÃO seguido de `n` é a escrita errada. */
const contar = (texto) => ({
  erradas: (texto.match(/Lumina(?!n)/g) || []).length,
  certas: (texto.match(/Luminna/g) || []).length,
});

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
  const resposta = await page.goto(`${URL_BASE}${rota}`, { waitUntil: 'load', timeout: 90000 });
  /* Hidratação: sem esta espera mede-se o HTML do servidor, sem observador montado. */
  await page.waitForTimeout(2500);
  return { ctx, page, erros, resposta };
}

const rampa = async (page) => {
  const altura = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < altura; y += 300) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(70);
  }
  await page.waitForTimeout(2200);
};

/* A leitura de arquitetura é GENÉRICA de propósito: ela roda nas sete rotas, então não
   pode perguntar por classe de nenhuma. Os grafismos entram por sufixo. */
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
        arte: s.querySelector(':scope > svg[class*="-ciclo"], :scope > svg[class*="-malha"]') ? 1 : 0,
        malha: s.querySelector(':scope > .grade-tecnica') ? 1 : 0,
      },
    }));
  });

const resultado = {
  esperado: {
    LEAD,
    DESAFIOS,
    BENEFICIOS,
    INTRO_INTEGRACAO,
    INTEGRACAO,
    FECHO,
    ANCORAS_ESPERADAS,
    TITULOS_DERIVADOS,
  },
};

/* ── PORTÃO 1 — AS DUAS ROTAS ─────────────────────────────────────────────────
   O `fetch` sem seguir redireção é o que mostra o STATUS e o `location`; o `goto` do
   navegador mostra onde a pessoa ACABA. Os dois, porque um 308 apontando para o lugar
   errado passaria no primeiro. */
{
  const bruta = await fetch(`${URL_BASE}${ROTA_VELHA}`, { redirect: 'manual' });
  const nova = await fetch(`${URL_BASE}${ROTA}`, { redirect: 'manual' });
  const { ctx, page, resposta } = await abrir({ largura: 1440, reduce: false, rota: ROTA_VELHA });
  resultado.rotas = {
    velha: { status: bruta.status, location: bruta.headers.get('location') },
    nova: { status: nova.status },
    noNavegador: { urlFinal: page.url(), statusFinal: resposta?.status() ?? null },
  };
  await ctx.close();
}

for (const largura of [390, 1440]) {
  const { ctx, page, erros, resposta } = await abrir({ largura, reduce: false });
  await rampa(page);

  const faixas = await arquitetura(page);

  /* IDENTIDADE — vazamento de classe nos dois sentidos e as peças próprias. */
  const identidade = await page.evaluate(() => ({
    nosDeIrmas: {
      matchai: document.querySelectorAll('[class*="matchai-"]').length,
      smartminer: document.querySelectorAll('[class*="smartminer-"]').length,
      qaintegrado: document.querySelectorAll('[class*="qaintegrado-"]').length,
      gurudeseguros: document.querySelectorAll('[class*="gurudeseguros-"]').length,
      connectapi: document.querySelectorAll('[class*="connectapi-"]').length,
    },
    nosLuminna: document.querySelectorAll('[class*="luminna-"]').length,
    /* AS TRÊS PEÇAS PRÓPRIAS. */
    aneis: document.querySelectorAll('svg.luminna-ciclo').length,
    orbitas: document.querySelectorAll('.luminna-orbita').length,
    pontos: document.querySelectorAll('.luminna-ponto').length,
    marcas: document.querySelectorAll('.luminna-marca').length,
    cartoes: document.querySelectorAll('.luminna-cartao').length,
    arcos: document.querySelectorAll('.luminna-arco').length,
    etapas: document.querySelectorAll('.luminna-etapa').length,
    discos: document.querySelectorAll('.luminna-no').length,
    fios: document.querySelectorAll('svg.luminna-fio').length,
    pulsos: document.querySelectorAll('.luminna-fio-pulso').length,
    grades: document.querySelectorAll('.grade-tecnica.luminna-grade').length,
    /* O letreiro é IMAGEM (o PNG da marca), então o portão é o da SIS-279: `img` dentro
       do `h1` e `alt` NÃO vazio — `h1` cujo conteúdo inteiro é imagem com `alt=""` é
       cabeçalho sem nome acessível. A RESSALVA da grafia está no `src`: o arquivo
       chama-se `Lumina-AI-…` e desenha um n só; renomear/redesenhar é fora de escopo, e
       o que sustenta a leitura é o `alt`. */
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
    carimbos: document.querySelectorAll('.carimbo-batida').length,
    capaDoHero:
      document.querySelector('#topo [data-route-critical-media]')?.getAttribute('src') ?? null,
    artesDeMidia: [...document.querySelectorAll('.luminna-midia img')].map((i) =>
      i.getAttribute('src'),
    ),
  }));

  /* A ESCRITA — comparação literal com o dado. */
  const escrita = await page.evaluate(() => ({
    titulos: [...document.querySelectorAll('main h1, main h2, main h3')].map((h) =>
      h.textContent.trim(),
    ),
    idsDosTitulos: [...document.querySelectorAll('main h2[id]')].map((h) => ({
      id: h.id,
      texto: h.textContent.trim(),
    })),
    subtituloDoHero: document.querySelector('#topo p')?.textContent.trim() ?? null,
    paragrafos: [...document.querySelectorAll('main p')].map((p) => p.textContent.trim()),
    cartoes: [...document.querySelectorAll('.luminna-cartao')].map((l) => ({
      titulo: l.querySelector('h3')?.textContent.trim() ?? null,
      texto: l.querySelector('p')?.textContent.trim() ?? null,
    })),
    etapas: [...document.querySelectorAll('.luminna-etapa')].map((l) => ({
      titulo: l.querySelector('h3')?.textContent.trim() ?? null,
      texto: l.querySelector('p')?.textContent.trim() ?? null,
    })),
    textoVisivel: document.querySelector('main').innerText,
  }));
  const par = (a) => a.map((x) => ({ titulo: x[0], texto: x[1] }));
  escrita.leadNaTela = escrita.paragrafos.includes(LEAD);
  escrita.subtituloEhPrefixoDoLead = Boolean(
    escrita.subtituloDoHero && LEAD.startsWith(escrita.subtituloDoHero),
  );
  escrita.desafiosBatem =
    JSON.stringify(escrita.cartoes.slice(0, 4)) === JSON.stringify(par(DESAFIOS));
  escrita.beneficiosBatem = JSON.stringify(escrita.etapas) === JSON.stringify(par(BENEFICIOS));
  escrita.introNaTela = escrita.paragrafos.includes(INTRO_INTEGRACAO);
  escrita.integracaoBate =
    JSON.stringify(escrita.cartoes.slice(4).map((c) => c.texto)) === JSON.stringify(INTEGRACAO);
  escrita.fechoNaTela = FECHO.every((p) => escrita.paragrafos.includes(p));
  escrita.ancorasBatem = ANCORAS_ESPERADAS.every((a) =>
    escrita.idsDosTitulos.some((t) => t.id === a),
  );
  escrita.derivadosNaoColidem = escrita.idsDosTitulos
    .filter((t) => TITULOS_DERIVADOS.includes(t.texto))
    .every((t) => !ANCORAS_ESPERADAS.includes(t.id));
  escrita.idsDuplicados = await page.evaluate(() => {
    const ids = [...document.querySelectorAll('main [id]')].map((n) => n.id);
    return ids.filter((id, i) => ids.indexOf(id) !== i);
  });
  /* PORTÃO 5 — a grafia no texto visível da página inteira (cabeçalho e rodapé
     incluídos, porque a promessa é «na UI só Luminna»). */
  escrita.grafiaNoMain = contar(escrita.textoVisivel);
  escrita.grafiaNaPagina = contar(await page.evaluate(() => document.body.innerText));

  /* PORTÃO 7 — OS TONS, medidos pelo fundo REAL de cada faixa ancorada. As duas
     claras têm de ser `.section-light`; `beneficios` tem de ser ESCURA (saiu do raster
     azul médio) e com o navy declarado. */
  const tomDasParadas = await page.evaluate((ancoras) =>
    ancoras.map((id) => {
      const h = document.getElementById(id);
      const s = h?.closest('section');
      return {
        id,
        existe: Boolean(h),
        clara: Boolean(s?.classList.contains('section-light')),
        corDeFundo: s ? getComputedStyle(s).backgroundColor : null,
      };
    }),
  ANCORAS_ESPERADAS);

  /* MOVIMENTO — dois quadros do MESMO nó, com o nó levado ao centro da tela antes de
     medir: laço de elemento fora de quadro corre, mas o valor lido seria de algo que
     ninguém vê. */
  const movimento = await page.evaluate(async () => {
    const dois = async (el, prop, pseudo) => {
      el.closest('section, nav')?.scrollIntoView({ block: 'center' });
      await new Promise((r) => setTimeout(r, 350));
      const cs = getComputedStyle(el, pseudo ?? null);
      const a = cs[prop];
      await new Promise((r) => setTimeout(r, 420));
      return {
        animacao: cs.animationName,
        quadroA: a,
        quadroB: getComputedStyle(el, pseudo ?? null)[prop],
        /* O anel e os acentos são `display: none` abaixo de `64rem`, e o fio abaixo de
           `sm`, por decisão de desenho. Animação em nó não renderizado não corre: sem
           este campo o «0 de N» medido a 390px pareceria laço morto em vez de peça
           ausente de propósito. */
        display: cs.display,
        visivel: Boolean(el.getClientRects().length),
      };
    };
    /* JANELA LONGA, e o motivo é do desenho: o trilho do cartão fica CHEIO de 55% a
       100% do ciclo de 4.8s — 2,16s de platô. Uma amostra de 420ms que caia dentro do
       platô lê dois valores iguais e reportaria «não moveu» para um laço que corre. Os
       2,6s aqui são maiores que o platô, então nenhum nó pode ficar parado nos dois
       quadros só por causa da fase. */
    const doisLongo = async (el, prop, pseudo) => {
      el.closest('section, nav')?.scrollIntoView({ block: 'center' });
      await new Promise((r) => setTimeout(r, 350));
      const a = getComputedStyle(el, pseudo ?? null)[prop];
      await new Promise((r) => setTimeout(r, 2600));
      return { quadroA: a, quadroB: getComputedStyle(el, pseudo ?? null)[prop] };
    };
    const ler = async (sel, prop, pseudo) => {
      const out = [];
      for (const el of document.querySelectorAll(sel)) {
        const d = await dois(el, prop, pseudo);
        out.push({ ...d, moveu: d.quadroA !== d.quadroB });
      }
      const visiveis = out.filter((x) => x.visivel);
      return {
        nos: out.length,
        visiveis: visiveis.length,
        moveramDosVisiveis: visiveis.filter((x) => x.moveu).length,
        amostra: out.slice(0, 2),
      };
    };
    return {
      orbita: await ler('.luminna-orbita', 'rotate'),
      pontoEmOrbita: await ler('.luminna-orbita-giro', 'rotate'),
      marca: await ler('.luminna-marca', 'opacity'),
      arcoDoSelo: await ler('.luminna-arco', 'rotate'),
      trilhoDoCartao: await ler('.luminna-cartao', 'scale', '::after'),
      pulsoDoFio: await ler('.luminna-fio-pulso', 'strokeDashoffset'),
      haloDoDisco: await ler('.luminna-no', 'boxShadow'),
      trilhoDoCartaoJanelaLonga: await (async () => {
        const out = [];
        for (const el of document.querySelectorAll('.luminna-cartao')) {
          const d = await doisLongo(el, 'scale', '::after');
          out.push({ ...d, moveu: d.quadroA !== d.quadroB });
        }
        return { nos: out.length, moveram: out.filter((x) => x.moveu).length, amostra: out.slice(0, 2) };
      })(),
    };
  });

  /* CONTRASTE — tinta do título contra o pixel composto ao lado dele, mais a pílula
     `#57B7EE` do hero (fundo próprio, tinta escura). */
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

  /* O SUBTÍTULO do hero é o ponto mais apertado da dobra: texto menor que o letreiro,
     sobre capa + véu. */
  let subtituloContraste = null;
  {
    const t = await page.evaluate(() => {
      window.scrollTo(0, 0);
      const p = document.querySelector('#topo p');
      if (!p) return null;
      const r = p.getBoundingClientRect();
      /* CLAMP nos dois eixos: a 390px o parágrafo ocupa a largura toda e `right + 20`
         cai FORA da janela — aí o ponto honesto é o vão à ESQUERDA, mesmo fundo. */
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
      subtituloContraste = {
        tinta: t.tinta,
        fundoComposto: fundo,
        contraste: contraste(t.tinta, fundo),
      };
    }
  }

  await page.screenshot({
    path: `docs/capturas/sis280-luminna-estrutura-${largura}.png`,
    fullPage: true,
    animations: 'disabled',
  });

  resultado[`w${largura}`] = {
    status: resposta?.status() ?? null,
    faixas,
    identidade,
    escrita,
    tomDasParadas,
    movimento,
    contrastes,
    subtituloContraste,
    erros,
  };
  await ctx.close();
}

/* A ARQUITETURA DAS IRMÃS, medida no mesmo passe: «mesma estrutura» só é portão se os
   dois lados forem lidos pelo mesmo código. E o vazamento é conferido nas SEIS. */
for (const irma of ['match-ai', 'fast', 'smart-miner', 'qa-integrado', 'guru-de-seguros', 'connect-api']) {
  const { ctx, page } = await abrir({ largura: 1440, reduce: false, rota: `/solucoes/${irma}` });
  await rampa(page);
  resultado[`irma-${irma}`] = {
    faixas: await arquitetura(page),
    vazamentoDaqui: await page.evaluate(
      () => document.querySelectorAll('[class*="luminna-"]').length,
    ),
    grafia: contar(await page.evaluate(() => document.body.innerText)),
  };
  await ctx.close();
}

/* O INDICADOR LATERAL — três `heading` ⇒ quatro paradas, com «Início», «Desafios»
   (o `navLabel` do dado), «Benefícios» e «Integração Versátil». O Match AI é o
   controle, lido pelo mesmo código. */
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

/* A VITRINE `/solucoes`: o cartão de destaque depende de `ID_DESTAQUE === a.id`, e com
   a grafia velha ele desapareceria em silêncio. O portão conta os links e confere que o
   destino desta solução é a slug nova. */
{
  const { ctx, page, erros } = await abrir({ largura: 1440, reduce: false, rota: '/solucoes' });
  resultado.vitrine = {
    destinos: await page.evaluate(() =>
      [...document.querySelectorAll('a[href^="/solucoes/"]')].map((a) => a.getAttribute('href')),
    ),
    grafia: contar(await page.evaluate(() => document.body.innerText)),
    erros,
  };
  await ctx.close();
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
    const ler = (sel, pseudo) =>
      [...document.querySelectorAll(sel)].map((e) => {
        const cs = getComputedStyle(e, pseudo ?? null);
        return {
          animacao: cs.animationName,
          opacidade: cs.opacity,
          traco: cs.strokeDashoffset,
          tracejado: cs.strokeDasharray,
          escala: cs.scale,
          giro: cs.rotate,
          sombra: cs.boxShadow,
          display: cs.display,
        };
      });
    return {
      orbita: ler('.luminna-orbita'),
      giro: ler('.luminna-orbita-giro'),
      marca: ler('.luminna-marca'),
      arco: ler('.luminna-arco'),
      cartao: ler('.luminna-cartao'),
      trilho: ler('.luminna-cartao', '::after'),
      pulso: ler('.luminna-fio-pulso'),
      disco: ler('.luminna-no'),
    };
  });
  resultado[`reduce-${canal}`] = {
    atributoNoHtml: atributo,
    animacoesVivas: Object.fromEntries(
      Object.entries(d).map(([k, v]) => [k, v.filter((x) => x.animacao !== 'none').length]),
    ),
    /* PORTÃO DE CONTEÚDO: o trilho para CHEIO (não em 12%, que leria como progresso
       falso) e o pulso para com traço CONTÍNUO (não tracejado congelado no meio). */
    trilhosCheios: d.trilho.every((t) => t.escala === 'none' || t.escala.startsWith('1')),
    totalDeTrilhos: d.trilho.length,
    pulsosContinuos: d.pulso.every((p) => p.tracejado === 'none' || p.tracejado === ''),
    /* `parseFloat` e NÃO `Number`: `strokeDashoffset` computado vem com unidade
       (`"0px"`), e `Number('0px')` é `NaN` — foi o falso negativo de uma irmã. */
    pulsosNoZero: d.pulso.filter((p) => parseFloat(p.traco) === 0).length,
    marcasAcesas: d.marca.filter((m) => Number(m.opacidade) === 1).length,
    totalDeMarcas: d.marca.length,
    discosSemHalo: d.disco.every((x) => x.sombra === 'none'),
    amostraDoTrilho: d.trilho.slice(0, 2),
    erros,
  };
  await ctx.close();
}

await navegador.close();
await writeFile(
  'docs/medidas/sis280-luminna-estrutura.json',
  `${JSON.stringify(resultado, null, 2)}\n`,
);
console.log(JSON.stringify(resultado, null, 2));
