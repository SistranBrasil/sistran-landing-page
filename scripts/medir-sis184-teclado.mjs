/* SIS-184 — travessia por TECLA TAB na seção SOCIAL de /esg: cada anel de foco
   precisa cair inteiro dentro da janela, e a página não pode ganhar rolagem
   lateral durante a travessia. */
import { chromium } from 'playwright';

const BASE = process.env.BASE_URL || 'http://localhost:3999';
const navegador = await chromium.launch({ channel: 'msedge' });

for (const vp of [
  { nome: '390x844', width: 390, height: 844 },
  { nome: '768x1024', width: 768, height: 1024 },
]) {
  const contexto = await navegador.newContext({ viewport: { width: vp.width, height: vp.height } });
  await contexto.addInitScript(() => {
    sessionStorage.setItem('sistran:intro-visto', '1');
    localStorage.setItem('sistran-motion-preference-seen', '1');
    localStorage.setItem('sistran-motion-preference', 'full');
  });
  const pagina = await contexto.newPage();
  await pagina.goto(`${BASE}/esg`, { waitUntil: 'networkidle', timeout: 120000 });

  const paradas = [];
  let excessoMax = 0;
  for (let i = 0; i < 60; i += 1) {
    await pagina.keyboard.press('Tab');
    await pagina.waitForTimeout(70);
    const parada = await pagina.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const social = document.querySelector('#esg-social')?.closest('section');
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      const anel = parseFloat(s.outlineWidth || '0') + parseFloat(s.outlineOffset || '0');
      return {
        naSocial: !!social?.contains(el),
        rotulo: (el.getAttribute('aria-label') || el.textContent || el.tagName).trim().slice(0, 40),
        left: +(r.left - anel).toFixed(1),
        right: +(r.right + anel).toFixed(1),
        visivelNaJanela: r.top < window.innerHeight && r.bottom > 0,
        dentro: r.left - anel >= -0.5 && r.right + anel <= window.innerWidth + 0.5,
        excessoDoc: document.documentElement.scrollWidth - window.innerWidth,
      };
    });
    if (!parada) continue;
    excessoMax = Math.max(excessoMax, parada.excessoDoc);
    if (parada.naSocial) paradas.push(parada);
    else if (paradas.length) break; // saiu da seção: travessia completa
  }

  console.log(
    JSON.stringify(
      {
        viewport: vp.nome,
        paradasNaSocial: paradas.length,
        todasDentro: paradas.every((p) => p.dentro),
        excessoMaxDuranteTravessia: excessoMax,
        paradas,
      },
      null,
      2,
    ),
  );
  await contexto.close();
}

await navegador.close();
