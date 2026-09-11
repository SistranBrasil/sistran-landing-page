/**
 * SIS-219 — capturas idle + hover, antes/depois, das placas ampliadas.
 *
 * PROCEDÊNCIA DO "ANTES", declarada porque um antes sem procedência não prova
 * nada: não é captura antiga recuperada, e não é a placa escondida (esse era o
 * antes da SIS-201, quando a placa não existia). Aqui o antes é a MESMA página
 * com os valores ANTERIORES da placa e do eco reinjetados por `addStyleTag` —
 * os oito números que esta issue mudou, copiados do estado do arquivo antes da
 * edição. Tudo o mais do card (imagem, overlay, copy, altura) é idêntico nas
 * duas fases, então a única diferença entre os pares é a escala da placa, que é
 * exatamente o que a issue pede para mostrar.
 *
 * Dois parceiros, pelos mesmos motivos da SIS-201:
 *  - ITG: placa de tinta escura (chip branco), o card do print do pedido;
 *  - ST IT: uma das quatro logos de tinta clara, ou seja, a placa invertida em
 *    navy — a variante que um chip branco apagaria (2,31:1).
 *
 * Uso (com o site no ar):
 *   URL_BASE=http://localhost:3000 node scripts/capturar-placas-sis219.mjs
 */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import { mkdir } from 'node:fs/promises';

const URL_BASE = process.env.URL_BASE ?? 'http://localhost:3000';
const LARGURAS = process.env.LARGURAS ? process.env.LARGURAS.split(',').map(Number) : [1440, 390];
const DESTINO = 'docs/capturas/sis219-placas';
const CARDS = ['ITG', 'ST IT'];

/* Os valores de ANTES, um a um. `!important` porque disputam com as regras do
   arquivo na mesma especificidade. O bloco de 639px repete o que o arquivo tinha
   lá, senão a captura a 390 mediria o desktop antigo. */
const CSS_ANTES = `
.partner-terminal__placa {
  min-width: 7.5rem !important;
  min-height: 4.25rem !important;
  padding: 0.75rem 1.25rem !important;
  border-radius: 0.875rem !important;
  box-shadow: 0 0.75rem 2rem -1rem rgba(3, 25, 48, 0.55) !important;
}
.partner-terminal__placa-img { max-width: 13rem !important; max-height: 3.25rem !important; }
.partner-terminal__eco { width: min(20rem, 45%) !important; }
.partner-terminal__eco-img { max-height: 6rem !important; }
.partner-terminal__card:hover .partner-terminal__eco,
.partner-terminal__card:focus-within .partner-terminal__eco { transform: scale(1.45) !important; }
@media (max-width: 639px) {
  .partner-terminal__placa {
    min-width: 6rem !important;
    min-height: 3.5rem !important;
    padding: 0.5rem 0.875rem !important;
  }
  .partner-terminal__placa-img { max-width: 8.5rem !important; max-height: 2.25rem !important; }
  .partner-terminal__eco { width: min(11rem, 48%) !important; }
  .partner-terminal__eco-img { max-height: 3.5rem !important; }
}`;

await mkdir(DESTINO, { recursive: true });
const navegador = await chromium.launch();

for (const w of LARGURAS) {
  const contexto = await navegador.newContext({
    viewport: { width: w, height: 900 },
    deviceScaleFactor: 1,
    reducedMotion: 'no-preference',
  });
  /* O aviso de preferência de movimento flutua sobre o meio da página e cobre o
     bloco de texto do card na primeira visita. */
  await contexto.addInitScript(() => {
    localStorage.setItem('sistran-motion-preference-seen', '1');
  });
  const pagina = await contexto.newPage();
  await pagina.goto(`${URL_BASE}/parceiros-e-implementacoes`, {
    waitUntil: 'domcontentloaded',
    timeout: 180_000,
  });
  await pagina.waitForSelector('.partner-terminal__placa img', { timeout: 180_000 });

  const localizar = (titulo) =>
    pagina
      .locator('.partner-terminal__card')
      .filter({ has: pagina.locator(`h3:text-is("${titulo}")`) });

  /* Captura POR ELEMENTO, não por `clip` de coordenadas: a rolagem é suave, e a
     caixa lida no meio do movimento já não vale no disparo. */
  const irPara = async (titulo) => {
    await pagina.evaluate((t) => {
      const card = Array.from(document.querySelectorAll('.partner-terminal__card')).find(
        (c) => c.querySelector('h3')?.textContent?.trim() === t,
      );
      card?.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' });
    }, titulo);
    await pagina.waitForTimeout(400);
    /* Corrida com timeout: logo `lazy` que o navegador não buscou não faz o
       `decode()` rejeitar — ele nunca assenta. */
    await pagina.evaluate(async (t) => {
      const comLimite = (p, ms) =>
        Promise.race([p, new Promise((r) => setTimeout(r, ms))]).catch(() => null);
      const card = Array.from(document.querySelectorAll('.partner-terminal__card')).find(
        (c) => c.querySelector('h3')?.textContent?.trim() === t,
      );
      const imgs = Array.from(card?.querySelectorAll('img') ?? []);
      await Promise.all(imgs.map((i) => (i.complete ? null : comLimite(i.decode(), 4000))));
    }, titulo);
    await pagina.waitForTimeout(600);
  };

  const arquivo = (titulo, fase, estado) =>
    `${DESTINO}/${titulo.toLowerCase().replace(/\s+/g, '-')}-${fase}-${estado}-${w}.png`;

  const rodada = async (fase) => {
    for (const titulo of CARDS) {
      await irPara(titulo);
      /* Idle: o mouse é tirado antes, senão o card sai com o eco do disparo
         anterior ainda aceso. */
      await pagina.mouse.move(0, 0);
      await pagina.waitForTimeout(500);
      await localizar(titulo).screenshot({ path: arquivo(titulo, fase, 'idle') });

      /* `hover()` move o mouse de verdade; a espera cobre a transição de 340ms
         do transform mais os 260ms da opacidade. */
      await localizar(titulo).hover();
      await pagina.waitForTimeout(900);
      await localizar(titulo).screenshot({ path: arquivo(titulo, fase, 'hover') });

      const m = await pagina.evaluate((t) => {
        const arred = (n) => Math.round(n * 10) / 10;
        const card = Array.from(document.querySelectorAll('.partner-terminal__card')).find(
          (c) => c.querySelector('h3')?.textContent?.trim() === t,
        );
        const img = card.querySelector('.partner-terminal__placa-img').getBoundingClientRect();
        const placa = card.querySelector('.partner-terminal__placa').getBoundingClientRect();
        return `placa ${arred(placa.width)}×${arred(placa.height)} · logo ${arred(img.width)}×${arred(img.height)}`;
      }, titulo);
      console.log(`${w} · ${fase} · ${titulo}: ${m}`);
    }
    await pagina.mouse.move(0, 0);
    await pagina.waitForTimeout(600);
  };

  /* DEPOIS primeiro, com o CSS real da página; o ANTES é o estado injetado. */
  await rodada('depois');
  await pagina.addStyleTag({ content: CSS_ANTES });
  await pagina.waitForTimeout(400);
  await rodada('antes');

  await contexto.close();
}
await navegador.close();
