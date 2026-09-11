/**
 * SIS-201 — prova o eco da logo no hover.
 *
 * O critério do pedido tem uma parte que é opinião ("a logo destaca") e uma que
 * é fato verificável ("o eco atrás não tapa a copy"). Esta sonda mede a parte
 * verificável, e é ela que fixa o teto de escala do eco no CSS.
 *
 * Para cada card, com o mouse sobre ele:
 *  1. o eco existe e está VISÍVEL (opacidade > 0.1 — senão o hover não pegou);
 *  2. o eco é MAIOR que a placa (é o "escala maior" do pedido, medido: comparo a
 *     altura renderizada da imagem do eco com a da imagem da placa);
 *  3. o eco NÃO INTERSECTA eyebrow, título nem descrição — retângulo contra
 *     retângulo. É o critério que impede o eco de comer a copy;
 *  4. o `filter` do eco carrega `drop-shadow` na família ciano/azul.
 *
 * O retângulo do eco vem de `getBoundingClientRect`, que JÁ inclui o
 * `transform: scale` — é a caixa visual ampliada, não a caixa de layout. Medir a
 * caixa de layout aqui daria aprovação falsa.
 *
 * E mede o outro lado: com `prefers-reduced-motion: reduce`, o eco tem de estar
 * fora da renderização (`display: none`), porque nesse modo o card fica no
 * estado idle.
 */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';

const URL_BASE = process.env.URL_BASE ?? 'http://localhost:3999';

const CENARIOS = [
  { nome: '1440x900', viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference', ecoEsperado: true },
  { nome: '390x844', viewport: { width: 390, height: 844 }, reducedMotion: 'no-preference', ecoEsperado: true },
  { nome: '1440x900 reduce', viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce', ecoEsperado: false },
];

const navegador = await chromium.launch();
let falhas = 0;

for (const cenario of CENARIOS) {
  const contexto = await navegador.newContext({
    viewport: cenario.viewport,
    deviceScaleFactor: 1,
    reducedMotion: cenario.reducedMotion,
  });
  await contexto.addInitScript(() => {
    localStorage.setItem('sistran-motion-preference-seen', '1');
  });
  const pagina = await contexto.newPage();
  await pagina.goto(`${URL_BASE}/parceiros-e-implementacoes`, {
    waitUntil: 'domcontentloaded',
    timeout: 120_000,
  });
  await pagina.waitForSelector('.partner-terminal__card', { timeout: 120_000 });
  await pagina.waitForTimeout(1000);

  const titulos = await pagina.$$eval('.partner-terminal__card h3', (hs) =>
    hs.map((h) => h.textContent.trim()),
  );

  const problemas = [];
  const alturas = [];

  for (const titulo of titulos) {
    const card = pagina
      .locator('.partner-terminal__card')
      .filter({ has: pagina.locator(`h3:text-is("${titulo}")`) });
    await card.scrollIntoViewIfNeeded();
    /* Espera a ROLAGEM assentar antes de pousar o mouse. Sem esta pausa, o
       primeiro card do percurso falhava de forma intermitente com opacidade 0:
       a rolagem suave continuava depois do `hover()`, o card escorregava de
       baixo do ponteiro e o `:hover` se perdia. Era defeito da sonda, não do
       CSS — o eco acendia nos outros quinze porque cada `hover()` seguinte
       reposiciona o ponteiro. */
    await pagina.waitForTimeout(400);
    await card.hover();
    /* Espera a transição de 340ms terminar; medir no meio dela subestima a
       caixa do eco e aprovaria uma escala que na verdade invade a copy. */
    await pagina.waitForTimeout(550);

    const lerHover = () => card.evaluate((el) => {
      const eco = el.querySelector('.partner-terminal__eco');
      if (!eco) return { semEco: true };
      const estilo = getComputedStyle(eco);
      const r = eco.getBoundingClientRect();
      const elImgEco = eco.querySelector('img');
      const imgEco = elImgEco?.getBoundingClientRect();
      /* O `drop-shadow` mora na IMAGEM, não no invólucro. Ler o `filter` do
         invólucro devolvia `none` nos dezesseis cards e reprovava um CSS
         correto — a sonda estava olhando o elemento errado. */
      const filtroImg = elImgEco ? getComputedStyle(elImgEco).filter : 'none';
      const imgPlaca = el
        .querySelector('.partner-terminal__placa img')
        ?.getBoundingClientRect();
      const alvos = ['.partner-terminal__eyebrow', 'h3', '.partner-terminal__description']
        .map((s) => ({ sel: s, box: el.querySelector(s)?.getBoundingClientRect() }))
        .filter((a) => a.box);
      const cruza = alvos
        .filter(
          (a) =>
            r.left < a.box.right &&
            r.right > a.box.left &&
            r.top < a.box.bottom &&
            r.bottom > a.box.top,
        )
        .map((a) => a.sel);
      return {
        display: estilo.display,
        opacidade: Number(estilo.opacity),
        filtro: filtroImg,
        ecoBox: { top: Math.round(r.top), bottom: Math.round(r.bottom), h: Math.round(r.height) },
        alturaEco: imgEco ? Math.round(imgEco.height) : null,
        alturaPlaca: imgPlaca ? Math.round(imgPlaca.height) : null,
        primeiroTextoTop: Math.round(Math.min(...alvos.map((a) => a.box.top))),
        cruza,
      };
    });

    let m = await lerHover();
    /* Uma única segunda tentativa, e só quando o ponteiro claramente não pegou
       (eco existe, não está desligado por reduce, e está em opacidade 0). Não é
       para maquiar reprovação: se o CSS não acendesse o eco, a repetição daria o
       mesmo 0 e a falha continuaria valendo. Qualquer outro critério — escala,
       sombra, sobreposição com a copy — NÃO é repetido. */
    if (cenario.ecoEsperado && !m.semEco && m.display !== 'none' && m.opacidade === 0) {
      await pagina.mouse.move(0, 0);
      await pagina.waitForTimeout(200);
      await card.hover();
      await pagina.waitForTimeout(650);
      m = await lerHover();
    }

    if (!cenario.ecoEsperado) {
      if (!m.semEco && m.display !== 'none') {
        problemas.push(`${titulo}: eco renderizado em movimento reduzido (display: ${m.display})`);
      }
      continue;
    }

    if (m.semEco) {
      problemas.push(`${titulo}: sem elemento de eco no card`);
      continue;
    }
    if (m.display === 'none') {
      problemas.push(`${titulo}: eco com display: none fora de movimento reduzido`);
      continue;
    }
    if (!(m.opacidade > 0.1)) {
      problemas.push(`${titulo}: eco invisível no hover (opacidade ${m.opacidade})`);
    }
    if (m.alturaEco !== null && m.alturaPlaca !== null && m.alturaEco <= m.alturaPlaca) {
      problemas.push(
        `${titulo}: eco não é maior que a placa (${m.alturaEco}px contra ${m.alturaPlaca}px)`,
      );
    }
    if (!/drop-shadow/.test(m.filtro)) {
      problemas.push(`${titulo}: eco sem drop-shadow (filter: ${m.filtro})`);
    }
    if (m.cruza.length) {
      problemas.push(
        `${titulo}: eco cobre ${m.cruza.join(', ')} ` +
          `(eco vai até ${m.ecoBox.bottom}px, texto começa em ${m.primeiroTextoTop}px)`,
      );
    }
    alturas.push({
      titulo,
      eco: m.alturaEco,
      placa: m.alturaPlaca,
      fim: m.ecoBox.bottom,
      texto: m.primeiroTextoTop,
      opacidade: m.opacidade,
    });
  }

  console.log(`\n=== ${cenario.nome} · eco ${cenario.ecoEsperado ? 'esperado' : 'desligado'} ===`);
  if (cenario.ecoEsperado && alturas.length) {
    const folgas = alturas.map((a) => a.texto - a.fim);
    console.log(
      `${alturas.length} cards · eco ${Math.min(...alturas.map((a) => a.eco))}–` +
        `${Math.max(...alturas.map((a) => a.eco))}px contra placa ` +
        `${Math.min(...alturas.map((a) => a.placa))}–${Math.max(...alturas.map((a) => a.placa))}px`,
    );
    console.log(
      `folga entre o fim do eco e a primeira linha de texto: min ${Math.min(...folgas)}px · ` +
        `max ${Math.max(...folgas)}px · opacidade ${alturas[0].opacidade}`,
    );
  }
  if (problemas.length) {
    console.log(`FALHA (${problemas.length}):`);
    for (const p of problemas) console.log(`  - ${p}`);
    falhas += problemas.length;
  } else {
    console.log('OK.');
  }

  await contexto.close();
}

await navegador.close();
console.log(falhas ? `\n${falhas} FALHA(S).` : '\nTodos os cenários OK.');
process.exitCode = falhas ? 1 : 0;
