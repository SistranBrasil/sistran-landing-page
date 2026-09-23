/**
 * SIS-280 — PERFIL DE TINTA da arte `carimbo-disruptiva-ticket-outline-0757c7.png`.
 *
 * O tamanho de um carimbo nesta casa é MEDIDO e não escolhido, e quem decide é a
 * legibilidade da LINHA MENOR (regra fixada na SIS-277 e reaplicada na SIS-188). Esta
 * sonda abre o PNG num canvas e mede, em janelas estreitas para não somar o tombo da
 * arte à altura da letra, a fração da altura do arquivo ocupada por «TECNOLOGIA» e por
 * «Disruptiva». Dessas frações sai a largura de exibição que põe a linha de cima nos
 * ~10px que a casa usa como alvo.
 *
 *   node scripts/medir-arte-carimbo-sis280.mjs
 */
import { writeFileSync, mkdirSync } from 'node:fs';

const { chromium } = await import(
  'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs'
);

const ARTE = 'http://localhost:3000/images/carimbo-disruptiva-ticket-outline-0757c7.png';

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('http://localhost:3000/solucoes', { waitUntil: 'load', timeout: 90000 });

const medida = await page.evaluate(async (url) => {
  const img = new Image();
  img.src = url;
  await img.decode();
  const c = document.createElement('canvas');
  c.width = img.naturalWidth;
  c.height = img.naturalHeight;
  const ctx = c.getContext('2d');
  ctx.drawImage(img, 0, 0);
  const { data } = ctx.getImageData(0, 0, c.width, c.height);

  /* Janela ESTREITA: uma janela larga somaria a inclinação da cápsula à altura da
     letra e devolveria uma caixa maior que o glifo. Duas janelas, uma em cima da
     palavra «TECNOLOGIA» e outra em cima de «Disruptiva», ambas na metade direita
     onde vive o texto. */
  function linhasComTinta(x0, x1, y0, y1) {
    const linhas = [];
    for (let y = y0; y < y1; y += 1) {
      let tinta = 0;
      for (let x = x0; x < x1; x += 1) {
        const i = (y * c.width + x) * 4;
        const a = data[i + 3];
        /* Tinta forte só: a cápsula tem tracejado claro e linhas guia de 10% de
           opacidade que contariam como letra. */
        if (a > 140 && data[i] < 120 && data[i + 2] > 120) tinta += 1;
      }
      if (tinta > 2) linhas.push(y);
    }
    return linhas;
  }

  const meio = Math.round(c.height * 0.45);
  const janela = { x0: Math.round(c.width * 0.52), x1: Math.round(c.width * 0.62) };
  const alta = linhasComTinta(janela.x0, janela.x1, Math.round(c.height * 0.15), meio);
  const baixa = linhasComTinta(janela.x0, janela.x1, meio, Math.round(c.height * 0.85));
  const faixa = (l) => (l.length ? { de: l[0], a: l[l.length - 1], altura: l[l.length - 1] - l[0] + 1 } : null);
  return {
    arquivo: { largura: c.width, altura: c.height },
    janela,
    linhaMenor: faixa(alta),
    linhaMaior: faixa(baixa),
  };
}, ARTE);

const { largura, altura } = medida.arte ?? medida.arquivo;
const fracao = medida.linhaMenor ? medida.linhaMenor.altura / altura : null;
const razao = largura / altura;
medida.fracaoDaLinhaMenor = fracao;
medida.razao = razao;
/* Escada de legibilidade: para cada largura de exibição, a altura sai da razão e a
   letra da fração medida. */
medida.escada = [160, 176, 192, 208, 224, 240].map((w) => ({
  larguraPx: w,
  alturaPx: Number((w / razao).toFixed(1)),
  letraMenorPx: fracao ? Number(((w / razao) * fracao).toFixed(2)) : null,
}));

await browser.close();
mkdirSync('docs/medidas', { recursive: true });
writeFileSync('docs/medidas/sis280-arte-carimbo.json', JSON.stringify(medida, null, 2));
console.log(JSON.stringify(medida, null, 2));
