/**
 * SIS-147 — mede a altura da abertura em vídeo de `/eventos-inovacao`.
 *
 * O pedido é "diminuir", e o que impede que isso vire chute é ter os dois lados
 * da conta medidos, com o CABEÇALHO NA TELA (ponto de atenção 3 da issue: o piso
 * de baixo não é estética, é o título nascer perto demais da barra fixa):
 *
 * 1. FOLGA DO TÍTULO contra o rodapé do cabeçalho fixo. Piso de 24px — abaixo
 *    disso o `h1` lê como colado na barra. Medido com o `header.fixed` VISÍVEL,
 *    porque é ele o vizinho de cima.
 * 2. ONDE A CENA COMEÇA. `#eventos` mais cedo é o objetivo da issue; o número que
 *    importa é quanto da cena já está em quadro sem rolar.
 * 3. AS OUTRAS TREZE ROTAS NÃO MUDAM. O ajuste tem de ser escopado em
 *    `.hero-backdrop--eventos`, então `/solucoes`, `/quem-somos` e `/contato` são
 *    medidas como controle: a altura da entrada delas tem de ser a MESMA antes e
 *    depois. Sem esta asserção, mexer no valor base passa despercebido — é o que
 *    o ponto de atenção 1 da issue nomeia (quatorze páginas de uma vez).
 * 4. O TELÃO DE LED continua no enquadramento. Caixa mais baixa e igualmente larga
 *    corta mais em cima e embaixo (`object-fit: cover` com `object-position:
 *    50% 62%`), e é o telão que motivou o véu mais fechado desta rota. Medido como
 *    geometria, não a olho: quanto do quadro do vídeo sobra visível na vertical.
 *
 * Ferramenta de bancada, não entra no bundle:
 *   node scripts/medir-abertura-eventos.mjs
 */
import { chromium } from "file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const JANELAS = [
  { largura: 1920, altura: 1080 },
  { largura: 1366, altura: 768 },
  { largura: 390, altura: 844 },
];
/* As três rotas de controle: mesma `.pagehero-entrada`, e nenhuma delas pode
   mudar de altura. `/solucoes` e `/quem-somos` também têm abertura em vídeo;
   `/contato` tem foto — as três passam pelo mesmo valor base. */
const CONTROLE = ["/solucoes", "/quem-somos", "/contato"];
const FOLGA_MIN = 24;

const navegador = await chromium.launch();
const saida = {};

async function medirEntrada(pagina, rota) {
  await pagina.goto(`${BASE}${rota}`, { waitUntil: "domcontentloaded" });
  await pagina.addStyleTag({
    content:
      "nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button]{display:none!important}",
  });
  await new Promise((res) => setTimeout(res, 2000));
  return pagina.evaluate(() => {
    const entrada = document.querySelector(".pagehero-entrada");
    return entrada ? Math.round(entrada.getBoundingClientRect().height) : null;
  });
}

for (const { largura, altura } of JANELAS) {
  const pagina = await navegador.newPage({
    viewport: { width: largura, height: altura },
  });
  await pagina.goto(`${BASE}/eventos-inovacao`, {
    waitUntil: "domcontentloaded",
  });
  await pagina.addStyleTag({
    content:
      "nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button]{display:none!important}",
  });
  /* Mesma espera das outras sondas: antes da hidratação o layout medido é outro. */
  await new Promise((res) => setTimeout(res, 2500));

  const m = await pagina.evaluate(() => {
    const q = (s) => document.querySelector(s);
    const cx = (el) => {
      if (!el) return null;
      const c = el.getBoundingClientRect();
      return {
        top: Math.round(c.top),
        bottom: Math.round(c.bottom),
        h: Math.round(c.height),
      };
    };
    /* O cabeçalho fixo é o vizinho de cima do título — é contra o rodapé DELE que
       a folga se mede, e não contra o topo da janela. */
    const cabecalho = document.querySelector("header");
    const entrada = q(".pagehero-entrada");
    const h1 = entrada?.querySelector("h1");
    /* Abaixo de 1024px `#eventos` é `display: none` e quem entrega o conteúdo é
       `.eventos-lista` (SIS-166). Medir só `#eventos` daria topo 0 e "cena fora de
       quadro" numa largura em que a cena simplesmente não é o arranjo usado —
       falso defeito. */
    const cena = q("#eventos")?.getBoundingClientRect().height
      ? q("#eventos")
      : q(".eventos-lista");
    const midia = q(".hero-backdrop-midia");
    const video = q(".hero-backdrop-video");

    /* Quanto do quadro do vídeo sobra visível: `object-fit: cover` escala pelo
       lado que falta, então o corte vertical é a razão entre a proporção da caixa
       e a do arquivo. `videoWidth/Height` só existe depois de os metadados
       chegarem — se não chegaram, devolve null em vez de um número inventado. */
    let quadroVisivel = null;
    let janelaDoQuadro = null;
    if (video && video.videoWidth && video.videoHeight) {
      const cm = midia.getBoundingClientRect();
      const rCaixa = cm.width / cm.height;
      const rArq = video.videoWidth / video.videoHeight;
      const f = rCaixa > rArq ? rArq / rCaixa : 1; /* fração vertical visível */
      quadroVisivel = Math.round(f * 100);
      /* QUAL FAIXA do arquivo sobra, e não só quanto. `object-position: 50% 62%`
         ancora o recorte em 62% da altura da fonte, então a janela visível é
         `[0.62 × (1 − f), 0.62 × (1 − f) + f]`. O telão de LED está no CENTRO do
         quadro (0,5) — é essa a conta que diz se ele continua enquadrado, em vez
         de olhar a captura e achar que sim. */
      const ini = 0.62 * (1 - f);
      janelaDoQuadro = [
        Math.round(ini * 1000) / 1000,
        Math.round((ini + f) * 1000) / 1000,
      ];
    }

    return {
      janela: { w: window.innerWidth, h: window.innerHeight },
      cabecalho: cx(cabecalho),
      entrada: cx(entrada),
      h1: cx(h1),
      cena: cx(cena),
      midia: cx(midia),
      quadroVisivelPct: quadroVisivel,
      janelaDoQuadro,
      /* Quanto da cena de eventos já está em quadro sem rolar nada. */
      cenaEmQuadro: cena
        ? Math.max(
            0,
            Math.round(
              Math.min(
                window.innerHeight,
                cena.getBoundingClientRect().bottom,
              ) - Math.max(0, cena.getBoundingClientRect().top),
            ),
          )
        : 0,
    };
  });

  const folga = m.h1 && m.cabecalho ? m.h1.top - m.cabecalho.bottom : null;

  saida[`${largura}x${altura}`] = {
    "#entradaAltura": m.entrada?.h ?? null,
    "#entradaPctDaJanela": m.entrada
      ? `${Math.round((m.entrada.h / m.janela.h) * 100)}%`
      : null,
    "#tituloTopo": m.h1?.top ?? null,
    "#cabecalhoBase": m.cabecalho?.bottom ?? null,
    "#folgaTituloCabecalho": folga,
    "1-tituloNaoEncostaNoCabecalho": folga !== null && folga >= FOLGA_MIN,
    "2-tituloInteiroEmQuadro":
      !!m.h1 && m.h1.top >= 0 && m.h1.bottom <= m.janela.h,
    "#cenaTopo": m.cena?.top ?? null,
    "#cenaEmQuadroPx": m.cenaEmQuadro,
    "#quadroDoVideoVisivelPct": m.quadroVisivelPct,
    "#janelaDoQuadro": m.janelaDoQuadro,
    "3-telaoDeLedNoEnquadramento":
      m.janelaDoQuadro === null ||
      (m.janelaDoQuadro[0] < 0.5 && m.janelaDoQuadro[1] > 0.5),
    "#midiaAltura": m.midia?.h ?? null,
  };
  await pagina.close();
}

/* ── CONTROLE: as outras rotas internas não podem mudar de altura ──────────── */
const ctrl = await navegador.newPage({
  viewport: { width: 1366, height: 768 },
});
saida["controle-1366x768"] = {};
for (const rota of CONTROLE) {
  saida["controle-1366x768"][rota] = await medirEntrada(ctrl, rota);
}
await ctrl.close();

await navegador.close();
console.log(JSON.stringify(saida, null, 2));
