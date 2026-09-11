/* Sonda de uma pergunta só: qual é a PALAVRA mais larga dos sete rótulos, no
   corpo que a SIS-165 fixou (piso de 16px), e quanto de largura útil a célula da
   home oferece hoje. A diferença entre os dois números é o que decide se o
   conserto da quebra no meio da palavra é vão menor ou outra coisa. */
import { chromium } from 'playwright';

const navegador = await chromium.launch();
const ctx = await navegador.newContext({ viewport: { width: 1440, height: 900 } });
await ctx.addInitScript(() => localStorage.setItem('sistran-motion-preference-seen', '1'));
const page = await ctx.newPage();
await page.goto(`${process.env.BASE ?? 'http://localhost:3000'}/`, { waitUntil: 'networkidle' });
await page.locator('.impact-track').scrollIntoViewIfNeeded();
await page.waitForTimeout(1000);

console.log(
  JSON.stringify(
    await page.evaluate(() => {
      const rotulos = [...document.querySelectorAll('.impact-rotulo')];
      const regua = document.createElement('span');
      const estilo = getComputedStyle(rotulos[0]);
      Object.assign(regua.style, {
        position: 'absolute',
        visibility: 'hidden',
        whiteSpace: 'pre',
        font: estilo.font,
        fontWeight: estilo.fontWeight,
        letterSpacing: estilo.letterSpacing,
      });
      document.body.append(regua);
      const palavras = rotulos
        .flatMap((r) => r.textContent.split(/\s+/))
        .map((p) => {
          regua.textContent = p;
          return { palavra: p, largura: Math.ceil(regua.getBoundingClientRect().width) };
        })
        .sort((a, b) => b.largura - a.largura);
      regua.remove();

      const item = document.querySelector('.impact-item');
      const cs = getComputedStyle(item);
      return {
        corpoRotulo: estilo.fontSize,
        quebraNoMeio: estilo.overflowWrap,
        larguraCelula: Math.round(item.getBoundingClientRect().width),
        recuoEsquerdo: cs.paddingLeft,
        larguraUtil:
          Math.round(item.getBoundingClientRect().width) - parseFloat(cs.paddingLeft),
        maisLargas: palavras.slice(0, 5),
      };
    }),
    null,
    2,
  ),
);

await navegador.close();
