/* As duas juntas que ficaram onde viviam os dois últimos `NotchDivider` da rota
   `/quem-somos`, retirados a pedido em chat:

     A) `.ne-secao`  (Nossa Essência: Missão / Valores / Pilares)
          → era `<NotchDivider cor="#ffffff" invertido />` →
        `.cem-secao`  (Modelos de atuação)
     B) `.cem-secao`
          → era `<NotchDivider cor="#ffffff" />` →
        `.agimos-secao` (Como Agimos)

   O QUE SE MEDE, e por que é diferente da junta navy↔claro medida em
   `medir-junta-metrics-reconhecimentos.mjs`: aqui as duas peças eram BRANCAS sobre
   fundo branco — não imprimiam tom nenhum, só reservavam altura (48px cada). Logo
   o risco não é degrau de cor, é ESPAÇO: sem o separador, as seções podem ficar
   apertadas ou, no pior caso, o conteúdo de uma encostar no da outra. Então:

     1. vão entre as seções = 0 (encostam, sem faixa de rota aparecendo);
     2. `svg.notch-divider` = 0 dentro das duas seções da junta — e ZERO na rota
        inteira, que é o estado declarado no mapa de fronteiras do `page.tsx`;
     3. FOLGA REAL DE RESPIRO > 0: distância entre o último elemento de conteúdo
        da seção de cima e o primeiro da de baixo. É este número que diz se a
        página ficou apertada, e não a simples ausência de vão. O padding próprio
        das seções (`section-py`) é quem paga o respiro agora;
     4. a emenda muda de tom em UMA linha, e o tom esperado depende da junta —
        MEDIDO, não suposto. A primeira versão desta sonda exigia tira clara nas
        duas e reprovou a segunda: `ComoAgimos` abre ESCURA (azul, ~13 das 25
        linhas abaixo da emenda), então ali a fronteira é claro↔escuro de verdade,
        como a etiqueta da SIS-75 dizia. Cada junta declara `tomAbaixo`, e o teste
        é o número de linhas de MEIO-TOM (luminância entre 90 e 200), que denuncia
        faixa intermediária — sobra de chanfro ou fundo de rota vazando — em vez de
        punir o degrau, que é o desenho pretendido;
     5. sem erro de console.

   `overflowX` NÃO é portão aqui, pelo mesmo motivo registrado na sonda irmã: a
   rota já estoura 118px a 768 e 104px a 390 por causa de `perfil-casca-brilho` e
   do marquee `tec-faixa__fita`, ambos longe destas juntas. Vai ao JSON como
   informação.

   Armadilhas herdadas: `sharp` resolve só da raiz do repositório; `page.evaluate`
   aceita UM argumento; o `clip` de `page.screenshot` é da JANELA, não do documento.

     node scripts/medir-junta-essencia-modelos-agimos.mjs
*/
import { writeFileSync, mkdirSync } from 'node:fs';
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/361ceb562f3b3235/node_modules/playwright/index.mjs';

const EXE =
  process.env.LOCALAPPDATA +
  '/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe';
const ROTA = 'http://localhost:3000/quem-somos';
const LARGURAS = [1440, 768, 390];
const JUNTAS = [
  { nome: 'essencia-modelos', acima: '.ne-secao', abaixo: '.cem-secao', tomAbaixo: 'claro' },
  { nome: 'modelos-agimos', acima: '.cem-secao', abaixo: '.agimos-secao', tomAbaixo: 'escuro' },
];

const saida = { rota: ROTA, quando: new Date().toISOString(), larguras: {} };
const nav = await chromium.launch({ executablePath: EXE });
mkdirSync('docs/capturas', { recursive: true });
let reprovas = 0;

const lum = ([r, g, b]) => 0.2126 * r + 0.7152 * g + 0.0722 * b;

for (const largura of LARGURAS) {
  const ctx = await nav.newContext({
    viewport: { width: largura, height: 900 },
    deviceScaleFactor: 1,
  });
  await ctx.addInitScript(() => {
    localStorage.setItem('sistran-motion-preference', 'full');
    localStorage.setItem('sistran-motion-preference-seen', '1');
    sessionStorage.setItem('sistran:intro-visto', 'true');
  });
  const pag = await ctx.newPage();
  const erros = [];
  pag.on('console', (m) => {
    if (m.type() === 'error') erros.push(m.text());
  });
  pag.on('pageerror', (e) => erros.push(String(e)));

  await pag.goto(ROTA, { waitUntil: 'domcontentloaded' });
  await pag.waitForSelector('[data-route-liberado="true"]', { timeout: 30000 });
  await pag.addStyleTag({
    content:
      'nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button],header,[href="#conteudo"]{display:none!important}',
  });

  const sharp = (await import('sharp')).default;
  const daLargura = { chanfrosNaRota: null, errosConsole: erros, juntas: {} };

  for (const junta of JUNTAS) {
    for (const sel of [junta.acima, junta.abaixo]) {
      if (!(await pag.evaluate((s) => !!document.querySelector(s), sel))) {
        throw new Error(`alvo ${sel} não existe na rota — medir outra coisa não serve`);
      }
    }
    /* Rolar três vezes: o layout acima ainda se acomoda depois da primeira. Depois
       recuar 300px, porque `scrollIntoView` põe a emenda no limite do quadro e as
       linhas de cima da tira sairiam da captura. */
    for (let i = 0; i < 3; i++) {
      await pag.$eval(junta.abaixo, (el) =>
        el.scrollIntoView({ block: 'center', behavior: 'instant' }),
      );
      await pag.waitForTimeout(700);
    }
    await pag.evaluate((sel) => {
      const el = document.querySelector(sel);
      window.scrollBy(0, el.getBoundingClientRect().top - 300);
    }, junta.abaixo);
    await pag.waitForTimeout(1000);

    const geo = await pag.evaluate((par) => {
      const acima = document.querySelector(par.acima);
      const abaixo = document.querySelector(par.abaixo);
      const ba = acima.getBoundingClientRect();
      const bb = abaixo.getBoundingClientRect();

      /* Respiro real: o pé do conteúdo visível mais baixo da seção de cima contra
         o topo do conteúdo visível mais alto da de baixo. Elementos de fundo
         (`aria-hidden`, artes decorativas) entram também — se um deles encostar no
         texto de baixo, o aperto é igualmente visível. */
      const caixas = (raiz) =>
        [...raiz.querySelectorAll('*')]
          .map((e) => e.getBoundingClientRect())
          .filter((r) => r.width > 0 && r.height > 0);
      const deCima = caixas(acima);
      const deBaixo = caixas(abaixo);
      const peConteudoAcima = deCima.length ? Math.max(...deCima.map((r) => r.bottom)) : ba.bottom;
      const topoConteudoAbaixo = deBaixo.length ? Math.min(...deBaixo.map((r) => r.top)) : bb.top;

      return {
        baseAcima: +ba.bottom.toFixed(1),
        topoAbaixo: +bb.top.toFixed(1),
        vao: +(bb.top - ba.bottom).toFixed(1),
        folgaDeRespiro: +(topoConteudoAbaixo - peConteudoAcima).toFixed(1),
        chanfrosNaJunta:
          acima.querySelectorAll('svg.notch-divider').length +
          abaixo.querySelectorAll('svg.notch-divider').length,
        chanfrosNaRota: document.querySelectorAll('svg.notch-divider').length,
        overflowX: +(
          document.documentElement.scrollWidth - document.documentElement.clientWidth
        ).toFixed(1),
      };
    }, junta);

    const png = await pag.screenshot();
    const { data, info } = await sharp(png).raw().toBuffer({ resolveWithObject: true });
    const px = (x, y) => {
      const i = (y * info.width + x) * info.channels;
      return [data[i], data[i + 1], data[i + 2]];
    };
    /* Três colunas: as duas bordas — onde o chanfro `invertido` desenhava as abas
       dos cantos — e o meio. */
    const colunas = { esquerda: 4, meio: Math.round(info.width / 2), direita: info.width - 5 };
    const perfil = {};
    let meioTomMax = 0;
    let escurasMax = 0;
    const emenda = Math.round(geo.topoAbaixo);
    for (const [nome, x] of Object.entries(colunas)) {
      const tira = [];
      for (let dy = -12; dy <= 12; dy++) {
        const y = emenda + dy;
        if (y < 0 || y >= info.height) continue;
        const cor = px(x, y);
        tira.push({ dy, cor: cor.join(','), lum: +lum(cor).toFixed(1) });
      }
      const meioTom = tira.filter((l) => l.lum > 90 && l.lum < 200).length;
      const escuras = tira.filter((l) => l.lum <= 90).length;
      if (meioTom > meioTomMax) meioTomMax = meioTom;
      if (escuras > escurasMax) escurasMax = escuras;
      perfil[nome] = { linhasDeMeioTom: meioTom, linhasEscuras: escuras, tira };
    }

    /* Junta clara↔clara: nenhuma linha pode sair do claro. Junta clara↔escura: o
       degrau é esperado, mas sem faixa de meio-tom empilhada — tolero 2 linhas,
       que é o antialiasing da borda em telas de DPR 1. */
    const tomOk = junta.tomAbaixo === 'claro' ? meioTomMax === 0 && escurasMax === 0 : meioTomMax <= 2;

    const passou =
      Math.abs(geo.vao) <= 0.5 &&
      geo.chanfrosNaJunta === 0 &&
      geo.chanfrosNaRota === 0 &&
      geo.folgaDeRespiro > 0 &&
      tomOk &&
      erros.length === 0;
    if (!passou) reprovas += 1;

    daLargura.chanfrosNaRota = geo.chanfrosNaRota;
    daLargura.juntas[junta.nome] = {
      ...junta,
      ...geo,
      linhasDeMeioTomNaEmenda: meioTomMax,
      linhasEscurasNaEmenda: escurasMax,
      perfil,
      veredito: passou ? 'PASSOU' : 'REPROVOU',
    };

    await pag.screenshot({
      path: `docs/capturas/junta-${junta.nome}-${largura}.png`,
      clip: { x: 0, y: Math.max(0, emenda - 120), width: info.width, height: 240 },
    });
    console.log(
      `${String(largura).padEnd(5)} ${junta.nome.padEnd(18)} vão ${geo.vao}px · ` +
        `respiro ${geo.folgaDeRespiro}px · chanfros junta ${geo.chanfrosNaJunta} / rota ` +
        `${geo.chanfrosNaRota} · meio-tom ${meioTomMax} · escuras ${escurasMax} ` +
        `(tom abaixo: ${junta.tomAbaixo}) · erros ${erros.length} · ` +
        `${passou ? 'PASSOU' : 'REPROVOU'}`,
    );
  }

  saida.larguras[largura] = daLargura;
  await ctx.close();
}

await nav.close();
mkdirSync('docs/medidas', { recursive: true });
writeFileSync(
  'docs/medidas/junta-essencia-modelos-agimos.json',
  `${JSON.stringify(saida, null, 2)}\n`,
);
console.log(`\n${reprovas === 0 ? 'todas as juntas passaram' : `${reprovas} caso(s) reprovaram`}`);
process.exitCode = reprovas === 0 ? 0 : 1;
