/* A junta que ficou onde vivia o `NotchDivider cor="#f7fbfe" invertido`, entre o
   bloco de números (`Metrics`) e `RecognitionGallery` — a faixa em cunha da
   captura do chat, retirada a pedido.

   O que se mede, e por quê: junta reta só é defeito se houver (a) VÃO — faixa da
   cor da rota entre as duas seções, que apareceria como um platô de navy da rota
   onde nenhuma das duas pinta; ou (b) resto do separador ainda montado. O degrau
   de cor AQUI é esperado e desejado: navy de `Metrics` contra papel `#f7fbfe` da
   galeria é justamente o corte de alto contraste que a marca faz sem peça
   intermediária. Então o critério NÃO é ΔE pequeno — é `svg.notch-divider` = 0
   ENTRE AS DUAS SEÇÕES (na rota inteira ainda vivem os dois chanfros claro↔claro
   do `EssenceAccordion`, que não são assunto desta medição: contar a rota toda
   reprovava um resultado correto), `gap` = 0 entre o fim de `Metrics` e o topo de
   `.rgal-secao`, e degrau em UMA linha: nenhum pixel de meio-tom entre o navy
   escuro (luminância < 90) e o papel claro (luminância > 200). Meio-tom
   empilhado seria sobra do chanfro ou vão pintado por um terceiro fundo.

   NÃO se mede `overflowX` como portão aqui. Medido: a rota já tem 118px de
   estouro a 768 e 104px a 390, e os culpados rastreados são `perfil-casca-brilho`
   e as cápsulas de `tec-faixa__fita` (marquee de tecnologias) — nada na
   vizinhança da junta. Fica registrado no JSON como informação, para o número não
   ser confundido com efeito desta mudança.

   Armadilhas herdadas da sonda irmã (`medir-junta-sem-chanfro.mjs`): `sharp`
   resolve só da raiz do repositório; `page.evaluate` aceita UM argumento; o
   `clip` de `page.screenshot` é da JANELA, não do documento.

     node scripts/medir-junta-metrics-reconhecimentos.mjs
*/
import { writeFileSync, mkdirSync } from 'node:fs';
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/361ceb562f3b3235/node_modules/playwright/index.mjs';

const EXE =
  process.env.LOCALAPPDATA +
  '/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe';
const ROTA = 'http://localhost:3000/quem-somos';
const LARGURAS = [1440, 768, 390];
const SEL = '.rgal-secao';

const saida = { rota: ROTA, quando: new Date().toISOString(), larguras: {} };
const nav = await chromium.launch({ executablePath: EXE });
mkdirSync('docs/capturas', { recursive: true });
let reprovas = 0;

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

  if (!(await pag.evaluate((sel) => !!document.querySelector(sel), SEL))) {
    throw new Error(`alvo ${SEL} não existe na rota — medir outra coisa não serve`);
  }
  /* Rolar três vezes: o layout acima ainda se acomoda depois da primeira. E
     recuar 300px, porque `scrollIntoView` põe a emenda no limite do quadro e as
     linhas de cima da tira ficariam fora da captura. */
  for (let i = 0; i < 3; i++) {
    await pag.$eval(SEL, (el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
    await pag.waitForTimeout(700);
  }
  await pag.evaluate((sel) => {
    const el = document.querySelector(sel);
    window.scrollBy(0, el.getBoundingClientRect().top - 300);
  }, SEL);
  await pag.waitForTimeout(1000);

  const geo = await pag.evaluate((sel) => {
    const gal = document.querySelector(sel);
    const b = gal.getBoundingClientRect();
    /* O irmão imediatamente acima da galeria é o que tem de encostar nela. */
    const anterior = gal.previousElementSibling;
    const ba = anterior?.getBoundingClientRect();
    return {
      seletor: sel,
      topoGaleria: Math.round(b.top),
      anterior: anterior
        ? {
            tag: anterior.tagName.toLowerCase(),
            classe: anterior.className?.toString?.().slice(0, 80) ?? '',
            base: Math.round(ba.bottom),
          }
        : null,
      /* Vão: distância entre o pé do irmão de cima e o topo da galeria. */
      vao: anterior ? +(b.top - ba.bottom).toFixed(1) : null,
      chanfrosNaRota: document.querySelectorAll('svg.notch-divider').length,
      /* O que importa: chanfro DENTRO da junta — no irmão de cima, no de baixo,
         ou entre eles como irmão próprio. */
      chanfrosNaJunta:
        (anterior?.querySelectorAll('svg.notch-divider').length ?? 0) +
        gal.querySelectorAll('svg.notch-divider').length +
        (anterior?.matches?.('svg.notch-divider') ? 1 : 0),
      overflowX: +(
        document.documentElement.scrollWidth - document.documentElement.clientWidth
      ).toFixed(1),
    };
  }, SEL);

  const png = await pag.screenshot();
  const sharp = (await import('sharp')).default;
  const { data, info } = await sharp(png).raw().toBuffer({ resolveWithObject: true });
  const px = (x, y) => {
    const i = (y * info.width + x) * info.channels;
    return [data[i], data[i + 1], data[i + 2]];
  };
  /* Três colunas: as duas bordas — onde o chanfro `invertido` vazava as cunhas
     navy — e o meio. */
  const colunas = { esquerda: 4, meio: Math.round(info.width / 2), direita: info.width - 5 };
  const perfil = {};
  let meioTomMax = 0;
  const lum = ([r, g, b]) => 0.2126 * r + 0.7152 * g + 0.0722 * b;
  for (const [nome, x] of Object.entries(colunas)) {
    const tira = [];
    for (let dy = -12; dy <= 12; dy++) {
      const y = geo.topoGaleria + dy;
      if (y < 0 || y >= info.height) continue;
      const cor = px(x, y);
      tira.push({ dy, cor: cor.join(','), lum: +lum(cor).toFixed(1) });
    }
    /* Linhas de MEIO-TOM: nem navy escuro nem papel claro. A galeria clara varia
       de tom por dentro (gradiente próprio), por isso o teste é por faixa de
       luminância e não por igualdade de cor — comparar cor exata reprovava um
       degrau correto. */
    const meioTom = tira.filter((l) => l.lum >= 90 && l.lum <= 200).length;
    if (meioTom > meioTomMax) meioTomMax = meioTom;
    perfil[nome] = {
      corAcima: tira[0].cor,
      corAbaixo: tira[tira.length - 1].cor,
      linhasDeMeioTom: meioTom,
      tira,
    };
  }

  const passou =
    geo.chanfrosNaJunta === 0 &&
    Math.abs(geo.vao ?? 999) <= 0.5 &&
    erros.length === 0 &&
    meioTomMax <= 1;
  if (!passou) reprovas += 1;

  saida.larguras[largura] = {
    ...geo,
    meioTomMax,
    errosConsole: erros,
    perfil,
    veredito: passou ? 'PASSOU' : 'REPROVOU',
  };
  await pag.screenshot({
    path: `docs/capturas/junta-metrics-reconhecimentos-${largura}.png`,
    clip: { x: 0, y: Math.max(0, geo.topoGaleria - 120), width: info.width, height: 240 },
  });
  console.log(
    `${String(largura).padEnd(5)} vão ${geo.vao}px · chanfros na junta ${geo.chanfrosNaJunta} (rota ${geo.chanfrosNaRota}) · ` +
      `meio-tom ${meioTomMax} · overflowX ${geo.overflowX} · ` +
      `erros ${erros.length} · ${passou ? 'PASSOU' : 'REPROVOU'}`,
  );
  await ctx.close();
}

await nav.close();
mkdirSync('docs/medidas', { recursive: true });
writeFileSync(
  'docs/medidas/junta-metrics-reconhecimentos.json',
  `${JSON.stringify(saida, null, 2)}\n`,
);
console.log(
  `\n${reprovas === 0 ? 'todas as larguras passaram' : `${reprovas} largura(s) reprovaram`}`,
);
process.exitCode = reprovas === 0 ? 0 : 1;
