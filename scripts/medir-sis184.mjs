/* SIS-184 — medição de rolagem lateral em /esg. Script temporário de aferição. */
import { chromium } from 'playwright';
import fs from 'node:fs';

const BASE = process.env.BASE_URL || 'http://localhost:3999';
const ROTULO = process.env.ROTULO || 'antes';
const PASTA = `docs/capturas/sis-184`;

const VIEWPORTS = [
  { nome: '390x844', width: 390, height: 844 },
  { nome: '768x1024', width: 768, height: 1024 },
  { nome: '1024x768', width: 1024, height: 768 },
];

const navegador = await chromium.launch({ channel: 'msedge' });
fs.mkdirSync(PASTA, { recursive: true });

for (const vp of VIEWPORTS) {
  const contexto = await navegador.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 2,
  });
  await contexto.addInitScript(() => {
    sessionStorage.setItem('sistran:intro-visto', '1');
    localStorage.setItem('sistran-motion-preference-seen', '1');
    localStorage.setItem('sistran-motion-preference', 'full');
  });
  const pagina = await contexto.newPage();
  const erros = [];
  pagina.on('pageerror', (e) => erros.push(e.message));
  const resposta = await pagina.goto(`${BASE}/esg`, { waitUntil: 'networkidle', timeout: 120000 });

  // Percorre a página inteira para forçar montagem/animação de tudo antes de medir.
  await pagina.evaluate(async () => {
    const passo = window.innerHeight;
    for (let y = 0; y < document.body.scrollHeight; y += passo) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 90));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 250));
  });

  const medida = await pagina.evaluate(() => {
    const doc = document.documentElement;
    const excesso = doc.scrollWidth - window.innerWidth;

    // Quem, no DOM inteiro, tem retângulo além da borda direita da janela.
    const culpados = [];
    for (const el of document.querySelectorAll('*')) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) continue;
      if (r.right > window.innerWidth + 0.5 || r.left < -0.5) {
        culpados.push({
          seletor: `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}.${String(el.className || '')
            .toString()
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 4)
            .join('.')}`,
          left: +r.left.toFixed(1),
          right: +r.right.toFixed(1),
        });
      }
    }

    const social = document.querySelector('#esg-social')?.closest('section');
    const socialInfo = social
      ? {
          scrollWidth: social.scrollWidth,
          clientWidth: social.clientWidth,
          containerScrollWidth: social.querySelector('.container-lp')?.scrollWidth ?? null,
          overflowX: getComputedStyle(social).overflowX,
        }
      : null;

    // Conteúdo da Social: nenhum texto/cartão pode estar fora da janela.
    const conteudoFora = social
      ? [...social.querySelectorAll('h2, h3, p, article, figure, img, a, button')]
          .map((el) => ({ el, r: el.getBoundingClientRect() }))
          .filter(({ r }) => r.width > 0 && (r.right > window.innerWidth + 0.5 || r.left < -0.5))
          .map(({ el, r }) => ({
            tag: el.tagName.toLowerCase(),
            texto: (el.textContent || '').trim().slice(0, 40),
            left: +r.left.toFixed(1),
            right: +r.right.toFixed(1),
          }))
      : [];

    return { excesso, scrollWidth: doc.scrollWidth, innerWidth: window.innerWidth, culpados, socialInfo, conteudoFora };
  });

  // Foco por teclado nos focáveis da seção Social: cada anel de foco dentro da janela.
  const foco = await pagina.evaluate(async () => {
    const social = document.querySelector('#esg-social')?.closest('section');
    if (!social) return [];
    const focaveis = [...social.querySelectorAll('a[href], button, [tabindex]:not([tabindex="-1"])')];
    const saida = [];
    for (const el of focaveis) {
      el.focus({ preventScroll: false });
      el.scrollIntoView({ block: 'center' });
      await new Promise((r) => setTimeout(r, 60));
      const r = el.getBoundingClientRect();
      const estilo = getComputedStyle(el);
      const anel = parseFloat(estilo.outlineWidth || '0') + parseFloat(estilo.outlineOffset || '0');
      saida.push({
        tag: el.tagName.toLowerCase(),
        rotulo: (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 36),
        left: +(r.left - anel).toFixed(1),
        right: +(r.right + anel).toFixed(1),
        dentro: r.left - anel >= -0.5 && r.right + anel <= window.innerWidth + 0.5,
        focado: document.activeElement === el,
      });
    }
    document.activeElement?.blur?.();
    return saida;
  });

  // O `<dialog>` da galeria vive DENTRO da seção recortada: confere que o modal
  // continua em tela cheia e não é contido pelo clip do ancestral.
  await pagina.getByRole('button', { name: /Ampliar a foto da 1/ }).click();
  await pagina.waitForTimeout(400);
  const modal = await pagina.evaluate(() => {
    const d = document.querySelector('dialog.esg-turma-modal');
    if (!d) return null;
    const r = d.getBoundingClientRect();
    return {
      aberto: d.open,
      left: +r.left.toFixed(1),
      right: +r.right.toFixed(1),
      largura: +r.width.toFixed(1),
      altura: +r.height.toFixed(1),
      dentro: r.left >= -0.5 && r.right <= window.innerWidth + 0.5,
      focoNoFechar: document.activeElement?.textContent?.trim() === 'Fechar',
    };
  });
  await pagina.screenshot({ path: `${PASTA}/${ROTULO}-${vp.nome}-modal.png` });
  await pagina.keyboard.press('Escape');
  await pagina.waitForTimeout(300);

  // Captura da seção Social inteira, na proporção do viewport.
  await pagina.evaluate(() => {
    document.querySelector('#esg-social')?.closest('section')?.scrollIntoView({ block: 'start' });
  });
  await pagina.waitForTimeout(500);
  await pagina.screenshot({ path: `${PASTA}/${ROTULO}-${vp.nome}-social.png` });

  console.log(
    JSON.stringify(
      { rotulo: ROTULO, viewport: vp.nome, http: resposta?.status(), ...medida, foco, modal, erros },
      null,
      2,
    ),
  );
  await contexto.close();
}

await navegador.close();
