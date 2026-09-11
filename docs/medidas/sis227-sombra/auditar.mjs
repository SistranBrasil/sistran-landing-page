/* Régua da sombra leve da manchete de `/sistran-labs` (pedido de 11/09).

   Duas perguntas, e as duas precisam de navegador:
    · a sombra está APLICADA e é a de duas camadas? Lê-se `text-shadow` computado
      do `h1` — e no realce também, que é um `<span>` filho e recebe por herança.
      Declarar no CSS não prova que a regra venceu a cascata desta rota.
    · ela PARECE leve? Para isso a sonda entrega o PAR de recortes do mesmo
      título, um com a regra e um com ela desligada no próprio navegador
      (`text-shadow: none`), para julgamento a olho lado a lado. Escurecer demais
      é o defeito da SIS-224 (halo sujo em volta das letras); não escurecer nada
      é a regra não ter vencido a cascata.
      ⚠️ A comparação NÃO é numérica de propósito. A primeira versão media a
      luminância média dos dois PNGs com `pngjs`, que não é dependência deste
      projeto — e instalar um pacote para medir uma sombra decorativa é caro pelo
      que entrega: a média de um recorte que é 90% fundo se move menos de um
      ponto, então o número seria pequeno demais para distinguir "leve" de "não
      pegou". O que decide aqui é o `text-shadow` computado, que é exato.

   Rodar com o dev de pé:  node docs/medidas/sis227-sombra/auditar.mjs */
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = dirname(fileURLToPath(import.meta.url));
const BASE = process.env.BASE ?? 'http://localhost:3996';

const navegador = await chromium.launch();
const resultado = {};

for (const { w, h } of [
  { w: 1440, h: 900 },
  { w: 390, h: 844 },
]) {
  const ctx = await navegador.newContext({ viewport: { width: w, height: h } });
  await ctx.addInitScript(() => localStorage.setItem('sistran-motion-preference-seen', '1'));
  const page = await ctx.newPage();
  await page.goto(`${BASE}/sistran-labs`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  const titulo = page.locator('.hero-backdrop--labs .pagehero-entrada h1');
  const lido = await page.evaluate(() => {
    const h1 = document.querySelector('.hero-backdrop--labs .pagehero-entrada h1');
    const realce = h1.querySelector('span');
    return {
      h1: getComputedStyle(h1).textShadow,
      realceHerdado: getComputedStyle(realce).textShadow,
      corDoTitulo: getComputedStyle(h1).color,
      corDoRealce: getComputedStyle(realce).color,
      /* A armadilha que tornaria a sombra invisível: degradê recortado no texto. */
      recorteNoTexto: getComputedStyle(h1).webkitBackgroundClip,
    };
  });

  await titulo.screenshot({ path: join(AQUI, `titulo-com-sombra-${w}.png`) });
  await page.screenshot({ path: join(AQUI, `abertura-${w}x${h}.png`) });
  await page.addStyleTag({
    content: '.hero-backdrop--labs .pagehero-entrada h1 { text-shadow: none !important; }',
  });
  await page.waitForTimeout(200);
  await titulo.screenshot({ path: join(AQUI, `titulo-sem-sombra-${w}.png`) });

  resultado[`${w}x${h}`] = lido;
  await ctx.close();
}

await navegador.close();
writeFileSync(join(AQUI, 'resultado.json'), JSON.stringify(resultado, null, 2));
console.log(JSON.stringify(resultado, null, 2));
