/**
 * SIS-156 — confere o percurso pinado de "Sistran em números" com a grade
 * estática de marcas como rodapé, em vez da faixa rolante.
 *
 * O que se mede e por quê: a caixa do percurso mede `340vh` MAIS a altura do
 * rodapé, e as sete etapas se reescalam sobre o progresso normalizado dessa
 * caixa (`ETAPAS_INICIO = 0.16` e `ETAPAS_FIM`, em `Metrics.tsx`). Trocar
 * uma faixa de uma fileira por uma grade de três (ou CINCO, abaixo de 1024px)
 * muda o denominador — e o modo de quebrar é silencioso: a cena continua
 * bonita, mas a sétima etapa passa a ser alcançada fora de quadro, depois de o
 * palco já ter desencostado do topo.
 *
 * Daí as três asserções, e nenhuma delas é "parece certo":
 *   1. as sete etapas são TODAS alcançadas dentro da seção (etapa vai de 0 a 6);
 *   2. quando a SÉTIMA etapa chega, o palco ainda está preso no topo
 *      (`|top| <= 4px`, o grão da segunda passada), isto é, o `07 / 07` é visto.
 *      Escrito assim depois de a primeira versão APROVAR o defeito: ela pedia
 *      `top <= 1`, e `-527` satisfaz `<= 1`. Só que topo negativo é exatamente o
 *      sintoma — o palco já subiu para fora de quadro. A asserção tem de ser sobre
 *      o módulo, senão passa justamente no caso que existe para pegar;
 *   3. a grade só entra em quadro DEPOIS de o percurso terminar — o topo dela
 *      nunca sobe acima da base do palco enquanto `p < ETAPAS_FIM`.
 *
 * 1024 é a fronteira da geometria (5 × 3 acima, 3 × 5 abaixo), então mede-se
 * 900 também: é lá que a grade é mais alta, e portanto onde o denominador é
 * maior.
 *
 * Ferramenta de bancada, não entra no bundle:
 *   node scripts/medir-percurso-marcas.mjs
 */
import { chromium } from "file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const JANELAS = [
  { largura: 1440, altura: 900 },
  { largura: 1366, altura: 768 },
  /* Abaixo de 1024: a grade está em cinco fileiras, a arrumação mais alta. */
  { largura: 900, altura: 800 },
];
/* Teto de `ETAPAS_FIM`: o valor agora é medido no componente e é sempre <= a este,
   então usá-lo como limite da janela de invasão é o caso mais amplo. */
const ETAPAS_FIM_TETO = 0.94;
const TOTAL = 7;
const PASSOS = 60;

const navegador = await chromium.launch();
const saida = {};

for (const { largura, altura } of JANELAS) {
  const pagina = await navegador.newPage({
    viewport: { width: largura, height: altura },
  });
  /* `domcontentloaded`, e não `networkidle`: a home tem vídeos de fundo em loop,
     então a rede nunca fica ociosa e o `networkidle` estoura os 30s. A espera
     que importa aqui é a do layout assentar, e ela é explícita logo abaixo. */
  await pagina.goto(BASE, { waitUntil: "domcontentloaded" });
  await pagina.addStyleTag({
    content:
      "nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button]{display:none!important}",
  });
  /* 2500ms, e não 1500: a 1440x900 a sonda chegou a ler a seção com 2137px de
     altura — a altura da LISTA. Não era defeito, era a medição acontecendo antes de
     a hidratação ligar o `dirigindo`, e o resultado é um falso "modo lista" numa
     largura que tem percurso. */
  await new Promise((res) => setTimeout(res, 2500));

  const caixa = await pagina.evaluate(() => {
    const s = document.querySelector("#resultados");
    const y = window.scrollY + s.getBoundingClientRect().top;
    return { topo: y, altura: s.getBoundingClientRect().height };
  });

  const quadros = [];
  for (let i = 0; i <= PASSOS; i += 1) {
    const y = caixa.topo + (i / PASSOS) * caixa.altura;
    await pagina.evaluate((alvo) => window.scrollTo(0, alvo), y);
    await new Promise((res) => setTimeout(res, 90));
    quadros.push(
      await pagina.evaluate(() => {
        const palco = document.querySelector(".impact-sticky");
        const grade = document.querySelector(".marcas-grade");
        const est = getComputedStyle(palco);
        const cp = palco.getBoundingClientRect();
        const cg = grade.getBoundingClientRect();
        return {
          y: Math.round(window.scrollY),
          p: Number(est.getPropertyValue("--impact-p")),
          etapa: Number(est.getPropertyValue("--impact-etapa")),
          palcoTopo: Math.round(cp.top),
          palcoBase: Math.round(cp.bottom),
          gradeTopo: Math.round(cg.top),
        };
      }),
    );
  }

  const comP = quadros.filter((q) => Number.isFinite(q.p) && q.p > 0);
  /* Abaixo de 1024px `dirigindo` é `false` e a seção é a LISTA completa: não há
     `--impact-p`, não há sticky e não há etapas. Isso não é reprovação, é ausência
     de partitura — e dizer qual dos dois é vale mais que três `false` seguidos.
     É também a resposta à dúvida que motivou medir esta largura: na arrumação de
     cinco fileiras, mais alta, não existe percurso pinado para o rodapé
     desregular. */
  if (!comP.length) {
    saida[`${largura}x${altura}`] = {
      "#secaoAltura": Math.round(caixa.altura),
      "#modo":
        "lista — sem percurso pinado (`dirigindo` exige min-width: 1024px)",
    };
    await pagina.close();
    continue;
  }
  const etapas = comP.map((q) => q.etapa);
  /* A sétima etapa, não o fim do progresso: é ela que precisa estar em quadro. */
  const grosso = comP.filter((q) => q.etapa >= TOTAL - 1 - 0.01);
  /* A varredura de 60 passos anda ~62px por passo numa seção de 3750px, então o
     primeiro quadro em que se VÊ a sétima etapa pode estar até um passo depois do
     instante em que ela chega — e a asserção seria sobre o grão da sonda, não sobre
     a cena. Daí a segunda passada: entre o quadro anterior e esse, de 2 em 2px,
     para achar o primeiro y real. Sem isto o resíduo medido (-27px) é indistinguível
     de um defeito de 27px. */
  const naSetima = [];
  if (grosso.length) {
    const alvoFim = grosso[0].y;
    const anterior = comP[comP.indexOf(grosso[0]) - 1];
    const alvoIni = anterior ? anterior.y : alvoFim;
    for (let y = alvoIni; y <= alvoFim; y += 2) {
      await pagina.evaluate((a) => window.scrollTo(0, a), y);
      await new Promise((res) => setTimeout(res, 50));
      const q = await pagina.evaluate(() => {
        const palco = document.querySelector(".impact-sticky");
        const est = getComputedStyle(palco);
        const cp = palco.getBoundingClientRect();
        return {
          y: Math.round(window.scrollY),
          p: Number(est.getPropertyValue("--impact-p")),
          etapa: Number(est.getPropertyValue("--impact-etapa")),
          palcoTopo: Math.round(cp.top),
        };
      });
      if (q.etapa >= TOTAL - 1 - 0.01) {
        naSetima.push(q);
        break;
      }
    }
    if (!naSetima.length) naSetima.push(grosso[0]);
  }
  const antesDoFim = comP.filter((q) => q.p < ETAPAS_FIM_TETO);
  /* Invasão: a grade subindo acima da base do palco antes de o percurso acabar. */
  const invasao = antesDoFim.filter((q) => q.gradeTopo < q.palcoBase - 1);

  saida[`${largura}x${altura}`] = {
    "#secaoAltura": Math.round(caixa.altura),
    "#etapaMin": Math.min(...etapas).toFixed(3),
    "#etapaMax": Math.max(...etapas).toFixed(3),
    "1-seteEtapasAlcancadas":
      Math.min(...etapas) <= 0.01 && Math.max(...etapas) >= TOTAL - 1 - 0.01,
    "2-setimaEtapaEmQuadro":
      naSetima.length > 0 && Math.abs(naSetima[0].palcoTopo) <= 4,
    "3-gradeNaoInvadeOPercurso": invasao.length === 0,
    "#primeiroQuadroNaSetima": naSetima[0] ?? null,
    "#invasoes": invasao.slice(0, 3),
  };
  await pagina.close();
}

await navegador.close();
console.log(JSON.stringify(saida, null, 2));
