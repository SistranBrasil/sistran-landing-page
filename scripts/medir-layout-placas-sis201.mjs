/**
 * SIS-201 (reparo) — prova que a placa não estourou o card.
 *
 * A placa entrou num card que já estava cheio (eyebrow + título grande + foco +
 * descrição) e numa coluna com `justify-content: flex-end`. O risco não é
 * estético: é a descrição vazar por baixo da borda com `overflow: hidden` no
 * card, ou seja, texto simplesmente desaparecer. Isso não se vê olhando o card
 * de cima da trilha — só medindo caixa contra caixa.
 *
 * CRITÉRIOS, todos geométricos:
 *  1. a placa fica INTEIRA dentro do card (nada recortado pela borda);
 *  2. a placa fica ACIMA do texto (`placa.bottom <= eyebrow.top`) — é o que
 *     prova que o `margin-bottom: auto` fez o que devia;
 *  3. o conteúdo não transborda o card em altura (`content.bottom` dentro do
 *     `card.bottom`, com 1px de tolerância para arredondamento);
 *  4. a última linha de texto do card está visível dentro do card.
 *
 * Roda em 1440 (desktop), 390 (mobile) e 390 com movimento reduzido, porque o
 * card muda de altura mínima nos três casos. `reducedMotion` explícito nos dois
 * primeiros: o padrão do Playwright é `reduce`, que não é o caso comum.
 */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';

const URL_BASE = process.env.URL_BASE ?? 'http://localhost:3999';

const CENARIOS = [
  { nome: '1440x900', viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' },
  { nome: '390x844', viewport: { width: 390, height: 844 }, reducedMotion: 'no-preference' },
  { nome: '390x844 reduce', viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' },
];

const navegador = await chromium.launch();
let falhas = 0;

for (const cenario of CENARIOS) {
  const contexto = await navegador.newContext({
    viewport: cenario.viewport,
    deviceScaleFactor: 1,
    reducedMotion: cenario.reducedMotion,
  });
  const pagina = await contexto.newPage();
  const erros = [];
  pagina.on('pageerror', (e) => erros.push(String(e).slice(0, 160)));

  const r = await pagina.goto(`${URL_BASE}/parceiros-e-implementacoes`, {
    waitUntil: 'domcontentloaded',
    timeout: 120_000,
  });
  await pagina.waitForSelector('.partner-terminal__placa', { timeout: 120_000 });
  await pagina.waitForTimeout(1200);

  const medidas = await pagina.evaluate(() =>
    Array.from(document.querySelectorAll('.partner-terminal__card')).map((card) => {
      const c = card.getBoundingClientRect();
      const placa = card.querySelector('.partner-terminal__placa')?.getBoundingClientRect() ?? null;
      const conteudo = card.querySelector('.partner-terminal__content').getBoundingClientRect();
      const eyebrow = card.querySelector('.partner-terminal__eyebrow').getBoundingClientRect();
      const ultimo =
        card.querySelector('.partner-terminal__description') ??
        card.querySelector('.partner-terminal__focus') ??
        card.querySelector('h3');
      const u = ultimo.getBoundingClientRect();
      return {
        titulo: card.querySelector('h3')?.textContent?.trim() ?? '?',
        temPlaca: Boolean(placa),
        placaDentro: placa
          ? placa.top >= c.top - 1 &&
            placa.left >= c.left - 1 &&
            placa.bottom <= c.bottom + 1 &&
            placa.right <= c.right + 1
          : null,
        placaAcimaDoTexto: placa ? placa.bottom <= eyebrow.top + 1 : null,
        folgaPlacaTexto: placa ? Math.round(eyebrow.top - placa.bottom) : null,
        conteudoDentro: conteudo.bottom <= c.bottom + 1 && conteudo.top >= c.top - 1,
        textoVisivel: u.bottom <= c.bottom + 1 && u.top >= c.top - 1,
        cardAltura: Math.round(c.height),
      };
    }),
  );

  const ruins = medidas.filter(
    (m) =>
      !m.temPlaca ||
      m.placaDentro !== true ||
      m.placaAcimaDoTexto !== true ||
      !m.conteudoDentro ||
      !m.textoVisivel,
  );
  const folgas = medidas.map((m) => m.folgaPlacaTexto).filter((v) => typeof v === 'number');

  console.log(`\n=== ${cenario.nome} — HTTP ${r?.status()} ===`);
  console.log(`cards: ${medidas.length} · com placa: ${medidas.filter((m) => m.temPlaca).length}`);
  console.log(`altura do card: ${Math.min(...medidas.map((m) => m.cardAltura))}px`);
  console.log(
    `folga entre placa e texto: min ${Math.min(...folgas)}px · max ${Math.max(...folgas)}px`,
  );
  if (erros.length) {
    console.log(`ERROS DE PÁGINA: ${erros.length}`);
    for (const e of erros) console.log(`  ${e}`);
    falhas += erros.length;
  }
  if (ruins.length) {
    console.log(`FALHA em ${ruins.length} card(s):`);
    for (const m of ruins) console.log(`  ${m.titulo}: ${JSON.stringify(m)}`);
    falhas += ruins.length;
  } else {
    console.log('OK — placa inteira dentro do card, acima do texto, sem transbordo.');
  }

  await contexto.close();
}

await navegador.close();
console.log(falhas ? `\n${falhas} FALHA(S).` : '\nTodos os cenários OK.');
process.exitCode = falhas ? 1 : 0;
