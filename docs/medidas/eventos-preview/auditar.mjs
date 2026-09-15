/**
 * Miniaturas de `/eventos-inovacao` — arte maior e faixa mais perto do cartão.
 *
 * A sonda existe porque `scripts/medir-cena-eventos-sis204.mjs` mede TRÊS janelas
 * (1440x900, 1366x768, 1024x800) e os dois degraus novos têm fronteira fora
 * dessas três: o primeiro abre em 1280 de largura e o segundo em 1400x900. Mede,
 * por janela, as quatro coisas que o aumento da arte pode quebrar:
 *
 *   1. EMPILHAMENTO — soma das vagas (mais os vãos) contra a altura da faixa. É o
 *      teto vertical: estourar aqui é vaga cobrindo vaga, o defeito da SIS-167.
 *   2. FOLGA ATÉ O CARTÃO — borda interna da faixa contra a borda do cartão, com a
 *      excursão lateral da flutuação (~8px, ver `--evt-float-x`) descontada. É o
 *      teto horizontal: negativo aqui é miniatura pintando sobre o texto.
 *   3. TÍTULO INTEIRO — `scrollHeight`/`scrollWidth` das quinze placas. O critério
 *      da SIS-204 é zero cortadas, e placa mais estreita corta.
 *   4. TAMANHO DA ARTE — a medida que a pessoa pediu, para o antes/depois ter
 *      número e não só impressão.
 */
import { chromium } from "file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs";

const BASE = process.env.BASE_URL ?? "http://localhost:3999";
const ROTA = "/eventos-inovacao";
/* Excursão lateral da flutuação, em px: a parada de 30% leva `--evt-float-x` (9px
   na vaga par) e a de 62% leva -0,7 disso. Somo o pior sentido ao recuo medido em
   repouso, como a guarda da SIS-167 passou a fazer. */
const EXCURSAO = 9;

const JANELAS = [
  [1024, 800],
  [1200, 800],
  [1280, 800],
  [1366, 768],
  [1400, 900],
  [1440, 900],
  [1600, 900],
  /* A janela LARGA E BAIXA, que é o pior caso do degrau de cima e a que a guarda
     da SIS-167 reprovou: a arte cresce com a largura e a faixa que a empilha cresce
     com a altura. Fica na lista para o defeito não voltar sem ser visto. */
  [1670, 940],
  [1920, 1080],
];

const navegador = await chromium.launch();
let falhas = 0;

for (const [largura, altura] of JANELAS) {
  const contexto = await navegador.newContext({
    viewport: { width: largura, height: altura },
    deviceScaleFactor: 1,
    reducedMotion: "no-preference",
  });
  const pagina = await contexto.newPage();
  await pagina.goto(`${BASE}${ROTA}`, { waitUntil: "networkidle", timeout: 120000 });
  /* A espera vem ANTES do clique, e não é folclore: o diálogo de preferências de
     movimento monta depois do primeiro quadro, e clicar antes dele existir deixa a
     caixa aberta — ela tranca a rolagem, então a medida saía certa (as caixas não
     dependem de rolagem) e a captura saía no topo da página, inútil. */
  await pagina.waitForTimeout(1500);
  const continuar = pagina.getByRole("button", { name: /continuar/i }).first();
  if (await continuar.count().catch(() => 0)) {
    await continuar.click({ timeout: 5000 }).catch(() => undefined);
    await pagina.waitForTimeout(500);
  }
  /* Flutuação parada: o recuo é lido em REPOUSO e a excursão é somada depois, na
     conta. Medir em movimento sorteia o quadro e o resultado muda a cada corrida. */
  await pagina.addStyleTag({
    content: ".eventos-vaga--botao{animation:none!important}",
  });
  await pagina.evaluate(() => {
    const s = document.querySelector("#eventos");
    scrollTo({ top: s.offsetTop + Math.round(s.offsetHeight * 0.4), behavior: "instant" });
  });
  await pagina.waitForTimeout(700);

  const lido = await pagina.evaluate(() => {
    const faixas = [...document.querySelectorAll(".eventos-destaque-coluna")].map((f) => {
      const rf = f.getBoundingClientRect();
      const vagas = [...f.querySelectorAll(".eventos-vaga")];
      const gap = Number.parseFloat(getComputedStyle(f).rowGap) || 0;
      const soma = vagas.reduce((t, v) => t + v.getBoundingClientRect().height, 0);
      /* O VÃO REAL entre vagas vizinhas, e não só a soma: a soma pode dizer que
         sobra folga enquanto o `padding-block` da faixa come a caixa de conteúdo
         por fora, o `space-between` fica sem sobra para distribuir e os vãos
         desabam no `gap` mínimo. Foi exatamente esse o defeito de 1670x940 —
         invisível para a soma e fatal para a guarda da SIS-167. */
      const topos = vagas.map((v) => v.getBoundingClientRect());
      let vaoMinimo = Number.POSITIVE_INFINITY;
      for (let i = 1; i < topos.length; i += 1) {
        vaoMinimo = Math.min(vaoMinimo, topos[i].top - topos[i - 1].bottom);
      }
      /* PISO DO VÃO, proporcional e não fixo: o que come o vão é a projeção
         vertical da inclinação, `(largura / 2) × sen(rot)` por vaga, com `rot` em
         2deg. Duas vizinhas projetam uma contra a outra, então o par consome
         `largura × sen(2°)` ~ `largura × 0,035`. Um piso fixo reprovaria 1024, onde
         a vaga tem ~106px e projeta 1,9px, pelo mesmo número que aprova 1670, onde
         ela tem ~207px e projeta 3,6px. */
      const larguraMaxima = Math.max(...topos.map((r) => r.width));
      return {
        lado: f.className.includes("--esq") ? "esq" : "dir",
        alturaFaixa: Math.round(rf.height),
        soma: Math.round(soma + gap * (vagas.length - 1)),
        vaoMinimo: Math.round(vaoMinimo * 10) / 10,
        vaoPiso: Math.round(larguraMaxima * Math.sin((2 * Math.PI) / 180) * 10) / 10,
        vagas: vagas.length,
        x: Math.round(rf.left),
        direita: Math.round(rf.right),
        largura: Math.round(rf.width),
      };
    });
    const cartao = document.querySelector(".eventos-destaque-cartao").getBoundingClientRect();
    const placas = [...document.querySelectorAll(".eventos-vaga-rotulo")];
    const artes = [...document.querySelectorAll(".eventos-vaga-arte")].map((a) => {
      const r = a.getBoundingClientRect();
      return { w: Math.round(r.width), h: Math.round(r.height) };
    });
    return {
      faixas,
      cartao: { x: Math.round(cartao.left), direita: Math.round(cartao.right) },
      cortadas: placas.filter((p) => p.scrollHeight - p.clientHeight > 1 || p.scrollWidth - p.clientWidth > 1).length,
      placas: placas.length,
      placaMaisEstreita: Math.min(...placas.map((p) => Math.round(p.getBoundingClientRect().width))),
      arteMenor: Math.min(...artes.map((a) => a.w)),
      arteMaior: Math.max(...artes.map((a) => a.w)),
      palcoTransborda: document.querySelector(".eventos-destaque-palco").getBoundingClientRect().height > innerHeight + 1,
    };
  });

  const esq = lido.faixas.find((f) => f.lado === "esq");
  const dir = lido.faixas.find((f) => f.lado === "dir");
  const folgaEsq = lido.cartao.x - esq.direita - EXCURSAO;
  const folgaDir = dir.x - lido.cartao.direita - EXCURSAO;
  const empilha = lido.faixas.every((f) => f.soma <= f.alturaFaixa && f.vaoMinimo >= f.vaoPiso);
  const ok = empilha && folgaEsq > 0 && folgaDir > 0 && lido.cortadas === 0 && !lido.palcoTransborda;
  if (!ok) falhas += 1;

  console.log(`\n=== ${largura}x${altura} === ${ok ? "OK" : "FALHA"}`);
  for (const f of lido.faixas) {
    const bem = f.soma <= f.alturaFaixa && f.vaoMinimo >= f.vaoPiso;
    console.log(
      `  ${bem ? "ok" : "XX"} coluna ${f.lado}: ${f.vagas} vagas somam ${f.soma}px em faixa de ${f.alturaFaixa}px · vao minimo ${f.vaoMinimo}px contra piso de ${f.vaoPiso}px · faixa ${f.largura}px em x ${f.x}..${f.direita}`,
    );
  }
  console.log(
    `  ${folgaEsq > 0 && folgaDir > 0 ? "ok" : "XX"} folga ate o cartao, excursao ja descontada: esq ${folgaEsq}px · dir ${folgaDir}px`,
  );
  console.log(
    `  ${lido.cortadas === 0 ? "ok" : "XX"} placas cortadas: ${lido.cortadas} de ${lido.placas} · mais estreita ${lido.placaMaisEstreita}px`,
  );
  console.log(`  arte: ${lido.arteMenor}px a ${lido.arteMaior}px de largura`);
  if (largura === 1440 || largura === 1920) {
    await pagina.screenshot({ path: `docs/medidas/eventos-preview/palco-${largura}x${altura}.png` });
  }
  await contexto.close();
}

await navegador.close();
console.log(`\n${falhas === 0 ? "TODAS AS JANELAS OK" : `${falhas} JANELA(S) EM FALHA`}`);
process.exit(falhas === 0 ? 0 : 1);
