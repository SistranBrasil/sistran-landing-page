/**
 * SIS-217 — prova geométrica e de reação da placa de logo nos cards de `/solucoes`.
 *
 * A caixa quadrada de 52px do glifo virou uma placa que acompanha a proporção da
 * logo, e as sete vão de 1,8:1 a 6,7:1. O risco é de largura: a placa divide a
 * primeira linha do card com o ordinal ("01", "02"…), e uma logo muito
 * horizontal encostaria nele ou estouraria o card. Isso não se vê olhando — é
 * caixa contra caixa.
 *
 * CRITÉRIOS
 *  1. a placa fica INTEIRA dentro do card;
 *  2. a placa não encosta no ordinal (folga > 0);
 *  3. a imagem carregou de fato (`naturalWidth > 0`) e não está deformada — a
 *     proporção renderizada bate com a do arquivo, tolerância de 2%;
 *  4. no hover a logo REAGE: o eco acende (opacity > 0) e a logo ganha escala;
 *  5. com movimento reduzido a logo fica ESTÁTICA no hover e o eco não existe.
 *
 * Roda contra `next start` (nunca `next dev`: lá o CSS chega por injeção e a
 * primeira medida sai antes dele). `URL_BASE` sobrescreve o padrão.
 */
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const URL_BASE = process.env.URL_BASE ?? 'http://localhost:3217';

const CENARIOS = [
  { nome: '1440x900', viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' },
  { nome: '1280x800', viewport: { width: 1280, height: 800 }, reducedMotion: 'no-preference' },
  { nome: '390x844', viewport: { width: 390, height: 844 }, reducedMotion: 'no-preference' },
  { nome: '1440x900 reduce', viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' },
  /* O SEGUNDO canal de movimento reduzido: a escolha feita no diálogo da própria
     página, que o script inline do `layout.tsx` grava como `data-motion` no
     `<html>`. Ele não é alcançado por `reducedMotion: 'reduce'` do Playwright —
     é outro seletor, e por isso outra regra no CSS. Sem este cenário, metade da
     política ficaria sem prova. */
  {
    nome: '1440x900 data-motion',
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'no-preference',
    canalAtributo: true,
  },
];

const DESTINO = 'docs/medidas/sis217';

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

  await pagina.goto(`${URL_BASE}/solucoes`, { waitUntil: 'domcontentloaded', timeout: 120_000 });
  if (cenario.canalAtributo) {
    await pagina.evaluate(() => {
      document.documentElement.dataset.motion = 'reduce';
    });
  }
  await pagina.waitForSelector('.accel-card .accel-logo__img', { timeout: 120_000 });
  await pagina.waitForFunction(
    () =>
      Array.from(document.querySelectorAll('.accel-logo__img')).every(
        (img) => img.complete && img.naturalWidth > 0,
      ),
    null,
    { timeout: 120_000 },
  );

  const medidas = await pagina.evaluate(() =>
    Array.from(document.querySelectorAll('.accel-card')).map((card) => {
      const c = card.getBoundingClientRect();
      const placa = card.querySelector('.accel-logo').getBoundingClientRect();
      const img = card.querySelector('.accel-logo__img');
      const i = img.getBoundingClientRect();
      const ordinal = card.querySelector('.font-mono').getBoundingClientRect();
      const eco = card.querySelector('.accel-logo__eco');
      return {
        nome: card.querySelector('h3').textContent.trim(),
        dentro:
          placa.top >= c.top - 1 &&
          placa.left >= c.left - 1 &&
          placa.bottom <= c.bottom + 1 &&
          placa.right <= c.right + 1,
        folgaOrdinal: Math.round(ordinal.left - placa.right),
        placa: `${Math.round(placa.width)}x${Math.round(placa.height)}`,
        logo: `${Math.round(i.width)}x${Math.round(i.height)}`,
        carregou: img.naturalWidth > 0,
        desvioProporcao:
          Math.abs(i.width / i.height - img.naturalWidth / img.naturalHeight) /
          (img.naturalWidth / img.naturalHeight),
        ecoVisivel: eco ? getComputedStyle(eco).display !== 'none' : false,
      };
    }),
  );

  console.log(`\n== ${cenario.nome}`);
  console.log(
    'acelerador'.padEnd(19) +
      'placa'.padEnd(11) +
      'logo'.padEnd(11) +
      'folga'.padEnd(8) +
      'proporção'.padEnd(11) +
      'veredito',
  );
  for (const m of medidas) {
    const ok = m.dentro && m.carregou && m.folgaOrdinal > 0 && m.desvioProporcao < 0.02;
    if (!ok) falhas += 1;
    console.log(
      m.nome.padEnd(19) +
        m.placa.padEnd(11) +
        m.logo.padEnd(11) +
        `${m.folgaOrdinal}px`.padEnd(8) +
        `${(m.desvioProporcao * 100).toFixed(2)}%`.padEnd(11) +
        (ok ? 'OK' : 'FALHA'),
    );
  }

  /* Reação no hover, medida no primeiro card. */
  const alvo = pagina.locator('.accel-card').first();
  const estado = async () =>
    alvo.evaluate((card) => {
      const img = card.querySelector('.accel-logo__img');
      const eco = card.querySelector('.accel-logo__eco');
      const ecoEstilo = getComputedStyle(eco);
      return {
        imgTransform: getComputedStyle(img).transform,
        placaTransform: getComputedStyle(card.querySelector('.accel-logo')).transform,
        ecoOpacidade: Number(ecoEstilo.opacity),
        ecoDisplay: ecoEstilo.display,
      };
    });

  const repouso = await estado();
  if (cenario.nome === '1440x900') {
    await mkdir(DESTINO, { recursive: true });
    await alvo.screenshot({ path: `${DESTINO}/card-repouso-1440x900.png` });
  }
  await alvo.hover();
  await pagina.waitForTimeout(700);
  const comHover = await estado();
  if (cenario.nome === '1440x900') {
    await alvo.screenshot({ path: `${DESTINO}/card-hover-1440x900.png` });
    await pagina
      .locator('#tecnologia-disruptiva')
      .screenshot({ path: `${DESTINO}/grade-1440x900.png` });
  }

  const reduzido = cenario.reducedMotion === 'reduce' || cenario.canalAtributo === true;
  /* O eco só conta como aceso se ele EXISTIR na renderização: com `display:
     none` a regra de opacidade do hover continua computada, mas não há caixa
     nenhuma na tela — ler só a opacidade daria falso positivo em movimento
     reduzido, que é justamente o caso que este script precisa reprovar. */
  const ecoAceso = (e) => e.ecoDisplay !== 'none' && e.ecoOpacidade > 0;
  const reagiu =
    comHover.imgTransform !== repouso.imgTransform ||
    comHover.placaTransform !== repouso.placaTransform ||
    (ecoAceso(comHover) && comHover.ecoOpacidade > repouso.ecoOpacidade);

  if (reduzido) {
    const estatico = !reagiu && comHover.ecoDisplay === 'none';
    if (!estatico) falhas += 1;
    console.log(
      `movimento reduzido: eco ${comHover.ecoDisplay}, logo ${comHover.imgTransform}, ` +
        `placa ${comHover.placaTransform} — ${estatico ? 'ESTÁTICO (OK)' : 'FALHA: reagiu'}`,
    );
  } else {
    if (!reagiu) falhas += 1;
    console.log(
      `hover: eco ${repouso.ecoOpacidade} -> ${comHover.ecoOpacidade}, ` +
        `logo ${comHover.imgTransform}, placa ${comHover.placaTransform} — ` +
        (reagiu ? 'REAGIU (OK)' : 'FALHA: sem reação'),
    );
  }

  if (erros.length) {
    falhas += 1;
    console.log(`erros de página: ${erros.join(' | ')}`);
  }

  await contexto.close();
}

await navegador.close();
console.log(falhas ? `\n${falhas} falha(s).` : '\nTudo dentro do critério.');
process.exit(falhas ? 1 : 0);
