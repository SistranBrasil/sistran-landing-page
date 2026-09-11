/**
 * SIS-201 (reparo) — capturas 1440 antes/depois das placas.
 *
 * O "antes" aqui NÃO é uma captura antiga recuperada: é a MESMA página com
 * `.partner-terminal__placa { display: none }` injetado, o que reproduz
 * exatamente o DOM anterior ao reparo (o card não tinha nenhum outro elemento de
 * marca — só o `<h3>` com o nome). Digo isso explicitamente porque um "antes"
 * cuja procedência não está declarada não vale como prova.
 *
 * Dois cards, escolhidos por motivo:
 *  - ITG: é o card do print do pedido, e é placa de tinta escura (chip branco);
 *  - ST IT: é uma das quatro logos de tinta clara, ou seja, a placa invertida
 *    em navy — é o caso que um chip branco teria apagado (2,31:1).
 */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import { mkdir } from 'node:fs/promises';

const URL_BASE = process.env.URL_BASE ?? 'http://localhost:3999';
const DESTINO = 'docs/capturas/sis201-placas';
const CARDS = ['ITG', 'ST IT'];

await mkdir(DESTINO, { recursive: true });

const navegador = await chromium.launch();
const contexto = await navegador.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
  reducedMotion: 'no-preference',
});
/* O aviso de preferências de movimento aparece na primeira visita e flutua sobre
   o meio da página, cobrindo justamente o bloco de texto do card. Marcar a chave
   de "já visto" ANTES do primeiro script da página é o mesmo estado de quem já
   respondeu o aviso — não desliga nada nem altera a preferência em si. */
await contexto.addInitScript(() => {
  localStorage.setItem('sistran-motion-preference-seen', '1');
});

const pagina = await contexto.newPage();

await pagina.goto(`${URL_BASE}/parceiros-e-implementacoes`, {
  waitUntil: 'domcontentloaded',
  timeout: 120_000,
});
await pagina.waitForSelector('.partner-terminal__placa img', { timeout: 120_000 });

/* Captura POR ELEMENTO, não por `clip` de coordenadas.
   A primeira versão media o `getBoundingClientRect` e depois recortava a
   captura nessas coordenadas — e saía o herói da página, não o card: a rolagem
   é suave, então a caixa era lida no meio do movimento e já não valia quando o
   disparo acontecia. `locator.screenshot()` rola, espera a caixa estabilizar e
   recorta no próprio elemento, o que elimina a defasagem e ainda evita capturar
   o painel de preferências de movimento que flutua sobre a página. */
const localizar = (titulo) =>
  pagina.locator('.partner-terminal__card').filter({ has: pagina.locator(`h3:text-is("${titulo}")`) });

const irPara = async (titulo) => {
  await pagina.evaluate((t) => {
    const card = Array.from(document.querySelectorAll('.partner-terminal__card')).find(
      (c) => c.querySelector('h3')?.textContent?.trim() === t,
    );
    card?.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' });
  }, titulo);
  await pagina.waitForTimeout(400);
  /* Corrida com timeout: logo `lazy` que o navegador não buscou não faz o
     `decode()` rejeitar — ele nunca assenta. Ver medir-placas-render-sis201. */
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

const arquivo = (titulo, fase) =>
  `${DESTINO}/${titulo.toLowerCase().replace(/\s+/g, '-')}-${fase}-1440.png`;

/* DEPOIS primeiro, com o CSS real da página. */
for (const titulo of CARDS) {
  await irPara(titulo);
  await localizar(titulo).screenshot({ path: arquivo(titulo, 'depois') });
  console.log(`depois: ${arquivo(titulo, 'depois')}`);
}

/* HOVER: o eco da logo atrás, com a sombra ciano. Mesmos dois cards, para dar
   par direto com o idle acima. `hover()` do locator move o mouse de verdade;
   a espera cobre a transição de 340ms. */
for (const titulo of CARDS) {
  await irPara(titulo);
  await localizar(titulo).hover();
  await pagina.waitForTimeout(600);
  await localizar(titulo).screenshot({ path: arquivo(titulo, 'hover') });
  console.log(`hover:  ${arquivo(titulo, 'hover')}`);
}
/* Tira o mouse dos cards antes de seguir, senão o próximo disparo pega um card
   ainda com o eco aceso. */
await pagina.mouse.move(0, 0);
await pagina.waitForTimeout(600);

/* ANTES: esconde só a placa; nada mais do card muda. */
await pagina.addStyleTag({
  content:
    '.partner-terminal__placa, .partner-terminal__eco { display: none !important; }',
});
await pagina.waitForTimeout(300);
for (const titulo of CARDS) {
  await irPara(titulo);
  await localizar(titulo).screenshot({ path: arquivo(titulo, 'antes') });
  console.log(`antes:  ${arquivo(titulo, 'antes')}`);
}

await navegador.close();
