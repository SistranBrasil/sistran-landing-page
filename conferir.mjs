import { chromium } from 'playwright';
const B='https://sistran-landing-page.vercel.app';
const ROTAS = ['/quem-somos','/solucoes','/parceiros-e-implementacoes','/sistran-labs',
 '/solucoes/match-ai','/solucoes/smart-miner','/solucoes/qa-integrado','/solucoes/connect-api',
 '/solucoes/fast','/solucoes/guru-de-seguros','/solucoes/luminna-ai','/solucoes/sds'];
const EH_NOVO = /^(sistran|tecnologia|servicos|nossa|parceiros|realizado|guru|desafios|luminna)-\d*-?\d{14}/;
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:1440,height:1000} });
for (const volta of [1,2]) {
  let novos=0, antigos=0;
  for (const rota of ROTAS) {
    await p.goto(B+rota, {waitUntil:'domcontentloaded'});
    await p.waitForTimeout(900);
    const srcs = await p.locator('.carimbo-batida img').evaluateAll(ns => ns.map(n => n.getAttribute('src')));
    for (const s of srcs) {
      const arq = decodeURIComponent(s).split('/').pop().split('?')[0];
      if (/-\d{14}\.png$/.test(arq)) novos++; else antigos++;
    }
  }
  console.log(`volta ${volta}: novos ${novos} | antigos ${antigos}`);
  if (volta === 1) await new Promise(r => setTimeout(r, 15000));
}
await b.close();
