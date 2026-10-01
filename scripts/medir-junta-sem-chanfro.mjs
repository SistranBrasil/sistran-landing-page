/* A junta que ficou onde viviam «Entrega com Alta Performance e Comprometimento» e
   o `NotchDivider cor="#e4edf7"` que a seguia, ambos retirados a pedido.
   O que se mede: a cor do último pixel do bloco de cima e a do primeiro da seção de
   baixo, e o SALTO entre as duas. Junta reta só é problema se houver degrau de cor
   visível — a régua da casa é o ΔE por pixel na emenda, não a impressão.
   Armadilhas herdadas: `sharp` resolve só da raiz do repositório; `page.evaluate`
   aceita UM argumento; o `clip` de `page.screenshot` é da JANELA, não do documento.

     node scripts/medir-junta-sem-chanfro.mjs
*/
import { writeFileSync, mkdirSync } from 'node:fs';
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/361ceb562f3b3235/node_modules/playwright/index.mjs';

const EXE =
  process.env.LOCALAPPDATA +
  '/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe';
const ROTA = 'http://localhost:3000/quem-somos';
const LARGURAS = [1440, 768, 390];
const saida = { rota: ROTA, quando: new Date().toISOString(), larguras: {} };
const nav = await chromium.launch({ executablePath: EXE });
mkdirSync('docs/capturas', { recursive: true });

for (const largura of LARGURAS) {
  const ctx = await nav.newContext({ viewport: { width: largura, height: 900 }, deviceScaleFactor: 1 });
  await ctx.addInitScript(() => {
    localStorage.setItem('sistran-motion-preference', 'full');
    localStorage.setItem('sistran-motion-preference-seen', '1');
    sessionStorage.setItem('sistran:intro-visto', 'true');
  });
  const pag = await ctx.newPage();
  await pag.goto(ROTA, { waitUntil: 'domcontentloaded' });
  await pag.waitForSelector('[data-route-liberado="true"]', { timeout: 30000 });
  await pag.addStyleTag({
    content:
      'nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button],header,[href="#conteudo"]{display:none!important}',
  });

  /* A seção de baixo é a que herdou a junta: `NossaEssenciaSection` (`.ne-secao`),
     que agora encosta direto no `.section-light` fechado em `page.tsx:425`.
     O seletor é conferido e NÃO tem plano B silencioso — a primeira versão desta
     sonda caía num `main > div:last-of-type` e media outra emenda, dando 240 de
     salto para uma junta que não é esta.
     Rolar três vezes: o layout acima ainda se acomoda depois da primeira. */
  const SEL = '.ne-secao';
  if (!(await pag.evaluate((sel) => !!document.querySelector(sel), SEL))) {
    throw new Error(`alvo ${SEL} não existe na rota — medir outra coisa não serve`);
  }
  /* `scrollIntoView` põe o topo no 0 da janela, e aí a emenda fica no limite do
     quadro, sem os 12px de cima. Rolar e depois recuar meia janela. */
  for (let i = 0; i < 3; i++) {
    await pag.$eval(SEL, (el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
    await pag.waitForTimeout(700);
  }
  await pag.evaluate(() => {
    const el = document.querySelector('.ne-secao');
    window.scrollBy(0, el.getBoundingClientRect().top - 300);
  });
  await pag.waitForTimeout(1000);

  const geo = await pag.evaluate((sel) => {
    const el = document.querySelector(sel);
    const b = el.getBoundingClientRect();
    return {
      seletor: sel,
      topo: Math.round(b.top),
      /* Há ainda algum `svg.notch-divider` sobrando nesta vizinhança? */
      chanfrosNaRota: document.querySelectorAll('svg.notch-divider').length,
      /* E a seção retirada, sumiu mesmo? */
      secaoRetirada: !!document.querySelector('#diferenciais, #entrega-performance'),
      diferenciaisSeisFica: !!document.querySelector('#diferenciais-6'),
    };
  }, SEL);

  const png = await pag.screenshot();
  const sharp = (await import('sharp')).default;
  const { data, info } = await sharp(png).raw().toBuffer({ resolveWithObject: true });
  const px = (x, y) => {
    const i = (y * info.width + x) * info.channels;
    return [data[i], data[i + 1], data[i + 2]];
  };
  /* Perfil vertical da emenda, 12px acima e 12px abaixo, em três colunas: a borda
     esquerda (onde o chanfro vazava a cunha azul), o meio e a borda direita. */
  const colunas = { esquerda: 4, meio: Math.round(info.width / 2), direita: info.width - 5 };
  const perfil = {};
  let saltoMax = 0;
  for (const [nome, x] of Object.entries(colunas)) {
    const tira = [];
    for (let dy = -12; dy <= 12; dy++) {
      const y = geo.topo + dy;
      if (y < 0 || y >= info.height) continue;
      tira.push({ dy, cor: px(x, y).join(',') });
    }
    /* O salto: maior diferença por canal entre dois pixels vizinhos da tira. */
    let salto = 0;
    for (let i = 1; i < tira.length; i++) {
      const a = tira[i - 1].cor.split(',').map(Number);
      const b = tira[i].cor.split(',').map(Number);
      salto = Math.max(salto, ...a.map((v, k) => Math.abs(v - b[k])));
    }
    if (salto > saltoMax) saltoMax = salto;
    perfil[nome] = { salto, tira };
  }
  saida.larguras[largura] = { ...geo, saltoMaximoNaEmenda: saltoMax, perfil };
  await pag.screenshot({
    path: `docs/capturas/junta-sem-chanfro-${largura}.png`,
    clip: { x: 0, y: Math.max(0, geo.topo - 120), width: info.width, height: 240 },
  });
  await ctx.close();
}

await nav.close();
mkdirSync('docs/medidas', { recursive: true });
writeFileSync('docs/medidas/junta-sem-chanfro.json', JSON.stringify(saida, null, 2));
console.log('gravado docs/medidas/junta-sem-chanfro.json');
