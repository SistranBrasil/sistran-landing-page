/**
 * Régua do PERCURSO DA FAIXA DE INDICADORES de `/contato` depois do pedido
 * "quando vai rolando quero que vá para o lado fixo, não que vá para baixo" +
 * "está sobrando muito espaço na parte dos números".
 *
 * O que se mede, e por que cada número existe:
 *
 * 1. `palcoAltura` contra `janela` — o palco tem de COBRIR a janela enquanto está
 *    preso. Era 40svh (360px a 900px de janela), e era isso que deixava ~540px do
 *    espaçador vazio à vista embaixo dos cartões.
 * 2. `cartaoAltura` — a outra metade do palco cheio. Palco de tela inteira com
 *    cartão de ~150px é a fileira fininha no oceano de azul que motivou os 40svh;
 *    o cartão alto é o que torna o palco cheio legítimo.
 * 3. `vazioAcima`/`vazioAbaixo` — o respiro que sobra dentro do palco, acima e
 *    abaixo da fileira. É o número que responde "sobrou espaço?", e ele é sobre o
 *    PALCO, não sobre a página: fora do palco não pode aparecer seção vazia.
 * 4. `deslocamentoNoQuadroDeSoltura` contra `deslocamentoMaximo` — a trilha tem de
 *    chegar ao fim no último quadro em que o palco ainda está preso. Se parar antes,
 *    sobra rolagem morta (o defeito que a SIS-156 mediu e a SIS-159 documentou); é a
 *    conferência de `ESCALA`, que mudou junto com a altura do palco.
 *    ⚠️ MEDIDO NO `transform` DA TRILHA, e não em `--mb-t`: propriedade customizada
 *    não registrada volta de `getComputedStyle` como o texto do `clamp()`, não como
 *    número — uma primeira versão desta sonda leu `--mb-t` e registrou 0 em todos os
 *    quadros de uma cena que estava se movendo.
 * 5. `cartoesAlcancados` — a UNIÃO dos cartões que apareceram inteiros na janela ao
 *    longo da varredura, e não quantos cabem de uma vez (a 1440 cabem três, por
 *    largura de cartão; o que importa é nenhum ficar inalcançável).
 *
 * A varredura é de 24px para o passo de amostragem não virar a folga do resultado:
 * com passo grosso, um quadro de sobra vale dezenas de pixels de trilha (a nota de
 * `ESCALA` em `PercursoIndicadores.tsx` registra exatamente esse artefato).
 */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import { mkdir, writeFile } from 'node:fs/promises';

const URL_BASE = process.env.URL_BASE ?? 'http://localhost:3999';
const LARGURAS = (process.env.LARGURAS ?? '1440').split(',').map(Number);
const SAIDA = new URL('.', import.meta.url).pathname.replace(/^\//, '');

await mkdir(SAIDA, { recursive: true });

const navegador = await chromium.launch();
const resultado = {};

for (const w of LARGURAS) {
  const contexto = await navegador.newContext({
    viewport: { width: w, height: 900 },
    deviceScaleFactor: 1,
    reducedMotion: 'no-preference',
  });
  /* O diálogo de preferência de movimento cobriria a cena na captura. */
  await contexto.addInitScript(() => {
    localStorage.setItem('sistran-motion-preference-seen', '1');
  });
  const pagina = await contexto.newPage();
  await pagina.goto(`${URL_BASE}/contato`, { waitUntil: 'domcontentloaded', timeout: 180_000 });
  await pagina.waitForSelector('.mb-palco', { timeout: 180_000 });
  await pagina.evaluate(() => document.fonts.ready);
  await pagina.waitForTimeout(1500);

  const varredura = await pagina.evaluate(async () => {
    const palco = document.querySelector('.mb-palco');
    const percurso = palco.closest('.mb-percurso');
    const fileira = document.querySelector('.contato-indicadores-grade');
    const cartoes = [...document.querySelectorAll('.contato-indicador')];
    const espaco = document.querySelector('.mb-espaco');
    const PASSO = 24;
    const esperar = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

    /* Deslocamento real da trilha, lido da matriz — ver a nota 4 do cabeçalho. */
    const deslocamento = () => {
      const m = new DOMMatrixReadOnly(getComputedStyle(fileira).transform);
      return Math.round(Math.abs(m.m41));
    };

    let presoDe = null;
    let presoAte = null;
    let ultimoDeslocamento = null;
    let deslocamentoMaximo = 0;
    const alcancados = new Set();
    let quadroDoMeio = null;

    for (let y = 0; y <= document.documentElement.scrollHeight; y += PASSO) {
      window.scrollTo(0, y);
      await esperar();
      const rp = palco.getBoundingClientRect();
      const grudado = Math.abs(rp.top) <= 2;
      if (grudado) {
        presoDe ??= y;
        presoAte = y;
        const d = deslocamento();
        ultimoDeslocamento = d;
        if (d > deslocamentoMaximo) deslocamentoMaximo = d;
        cartoes.forEach((c, i) => {
          const r = c.getBoundingClientRect();
          if (r.left >= -1 && r.right <= window.innerWidth + 1) alcancados.add(i);
        });
      }
    }

    /* Captura no meio do percurso: metade do caminho da trilha, não metade da
       rolagem — é o quadro em que se vê a fileira correndo de verdade. */
    if (presoDe !== null) {
      for (let y = presoDe; y <= presoAte; y += PASSO) {
        window.scrollTo(0, y);
        await esperar();
        if (deslocamento() >= deslocamentoMaximo / 2) {
          quadroDoMeio = y;
          break;
        }
      }
    }

    window.scrollTo(0, quadroDoMeio ?? presoDe ?? 0);
    await esperar();

    const rp = palco.getBoundingClientRect();
    const rf = fileira.getBoundingClientRect();
    const rc = cartoes[0].getBoundingClientRect();
    return {
      janela: window.innerHeight,
      percursoLigado: percurso.dataset.percurso ?? '(desligado)',
      palcoAltura: Math.round(rp.height),
      cartaoAltura: Math.round(rc.height),
      vazioAcima: Math.round(rf.top - rp.top),
      vazioAbaixo: Math.round(rp.bottom - rf.bottom),
      secaoAltura: Math.round(document.querySelector('.contato-indicadores').getBoundingClientRect().height),
      espacoAltura: Math.round(espaco.getBoundingClientRect().height),
      presoDe,
      presoAte,
      trechoPreso: presoAte - presoDe,
      deslocamentoMaximo,
      deslocamentoNoQuadroDeSoltura: ultimoDeslocamento,
      cartoesAlcancados: alcancados.size,
      totalCartoes: cartoes.length,
      quadroDaCaptura: quadroDoMeio,
      docAltura: document.documentElement.scrollHeight,
    };
  });

  await pagina.screenshot({ path: `${SAIDA}/percurso-meio-${w}x900.png` });

  /* Segunda captura no primeiro quadro preso: é onde o vazio de antes aparecia. */
  await pagina.evaluate((y) => window.scrollTo(0, y), varredura.presoDe);
  await pagina.waitForTimeout(400);
  await pagina.screenshot({ path: `${SAIDA}/percurso-inicio-${w}x900.png` });

  resultado[`${w}x900`] = varredura;
  await contexto.close();
}

await navegador.close();
await writeFile(`${SAIDA}/resultado.json`, `${JSON.stringify(resultado, null, 2)}\n`);
console.log(JSON.stringify(resultado, null, 2));
