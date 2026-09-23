/* SIS-280 — diagnóstico: QUEM pinta cada nó da seção. A sonda de portões achou
   `#0a1f44` em nós que declaram outra cor; antes de mexer no CSS eu preciso do
   seletor vencedor e não de um palpite de especificidade. */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/361ceb562f3b3235/node_modules/playwright/index.mjs';

const navegador = await chromium.launch({
  executablePath: `${process.env.LOCALAPPDATA}/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe`,
});
const contexto = await navegador.newContext({ viewport: { width: 1440, height: 960 } });
await contexto.addInitScript(() => {
  localStorage.setItem('sistran-motion-preference', 'full');
  localStorage.setItem('sistran-motion-preference-seen', '1');
  sessionStorage.setItem('sistran:intro-visto', 'true');
});
const p = await contexto.newPage();
await p.goto('http://localhost:3000/quem-somos', { waitUntil: 'domcontentloaded', timeout: 180_000 });
await p.waitForSelector('#quem-somos', { timeout: 180_000 });

const saida = await p.evaluate(() => {
  const alvos = [
    '.sobre-titulo',
    '.sobre-lead',
    '.sobre-paragrafo',
    '.sobre-citacao p',
    '.sobre-assinatura',
    '.sobre-acento-palavra',
    '.sobre-metrica-rotulo',
    '.sobre-metrica-detalhe',
  ];
  const quemPinta = (el) => {
    const achados = [];
    for (const folha of document.styleSheets) {
      let regras;
      try {
        regras = folha.cssRules;
      } catch {
        continue;
      }
      const varrer = (lista) => {
        for (const r of lista) {
          if (r.cssRules) {
            varrer(r.cssRules);
            continue;
          }
          if (!r.selectorText || !r.style || !r.style.color) continue;
          try {
            if (el.matches(r.selectorText)) {
              achados.push({ seletor: r.selectorText.slice(0, 120), cor: r.style.color });
            }
          } catch {
            /* seletor que o matches não aceita */
          }
        }
      };
      varrer(regras);
    }
    return achados;
  };
  const r = {};
  for (const sel of alvos) {
    const el = document.querySelector(sel);
    if (!el) {
      r[sel] = null;
      continue;
    }
    r[sel] = {
      computado: getComputedStyle(el).color,
      fontSize: getComputedStyle(el).fontSize,
      candidatos: quemPinta(el),
    };
  }
  r.ancestraisSectionLight = (() => {
    let n = document.querySelector('#quem-somos');
    const lista = [];
    while (n) {
      if (n.classList && n.classList.contains('section-light')) lista.push(n.tagName + '.' + n.className);
      n = n.parentElement;
    }
    return lista;
  })();
  return r;
});
console.log(JSON.stringify(saida, null, 2));
await navegador.close();
