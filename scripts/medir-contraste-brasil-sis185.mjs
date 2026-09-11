/**
 * SIS-185 item 2 — mede o fundo real por trás de `BRASIL` nas DUAS pontas do
 * percurso e devolve o contraste que cada saída de token daria.
 *
 * ── Por que uma sonda nova, e não `medir-contraste-escritorios.mjs` ────────
 * Aquela é a sonda dos onze alvos da cena e continua sendo a certa para conferir
 * a cena inteira. Ela não serve AQUI por duas razões, as duas medidas:
 *
 *  1. Ela não roda mais como está: o `locator.click` em `.os-abas` estoura em 30s.
 *     A causa foi medida e NÃO é a largura de 1024 — é que o Playwright abre a
 *     página com `reducedMotion: 'reduce'` por padrão, e `.os-abas` só é montada
 *     quando `dirigindo = cenaCabe && !rm` é verdadeiro (`OfficesScene.tsx:423`).
 *     A nota inteira está junto ao `newPage` abaixo. Consertar aquela sonda é
 *     trabalho de outra issue; esta não precisa das quatro larguras.
 *  2. Ela responde "o texto passa?" com a tinta que ESTÁ pintada. A pergunta do
 *     item 2 é diferente: "qual das quatro cores candidatas passa, e com quanta
 *     folga?". Isso é um fundo medido × quatro tintas hipotéticas, e nenhuma sonda
 *     de estado atual responde.
 *
 * ── Método ─────────────────────────────────────────────────────────────────
 * O de `docs/medidas/COMO-MEDIR-CONTRASTE.md`, com as três correções que a sonda
 * da cena descobriu e que valem igual aqui:
 *
 *  - O recorte é o retângulo dos GLIFOS, obtido por `Range`, não a caixa do
 *    elemento: a caixa do `<span>` do gradiente inclui folga onde aparece a folha
 *    clara da seção, e o pior pixel iria buscar justamente ali.
 *  - A tinta é apagada ANTES da captura, e com o cuidado do gradiente: em
 *    `background-clip: text` a tinta é a IMAGEM, então `color: transparent` não
 *    apaga nada — apenas revela o degradê dentro do recorte, que a sonda leria
 *    como se fosse fundo (foi assim que `BRASIL` já mediu 1,01:1 contra si mesmo).
 *    Aqui vai `background-image: none` junto.
 *  - Pior pixel, não média: o fundo da coluna não é chapado, tem a folha clara e o
 *    halo do palco. Em fundo variável a média aprova o que o olho reprova.
 *
 * Como a tinta é apagada antes de fotografar, todo pixel do recorte é fundo — não
 * há franja de antialiasing no quadro, e por isso esta sonda NÃO precisa do par
 * raster/cálculo do §7 do método (a mesma dispensa, pela mesma razão, está escrita
 * em `medir-contraste-escritorios.mjs`).
 *
 * ── O piso ─────────────────────────────────────────────────────────────────
 * `BRASIL` é título de seção em `font-display`, muito acima de 24px, logo é TEXTO
 * GRANDE: o piso da WCAG AA é **3:1**, que é o mesmo número que a issue pede.
 * O piso é medido a partir do `font-size` real, não presumido.
 *
 * ── Qual pedaço da palavra importa ─────────────────────────────────────────
 * O degradê é `120deg` com a última parada em 100%, então a cor questionada
 * (`#7c3aed`) pinta o FIM da palavra — o "IL" de BRASIL, não o "BRA". Por isso o
 * recorte é dividido em três terços e cada terço é medido contra a parada que o
 * cobre. Medir a palavra inteira contra a última parada seria pessimismo falso, e
 * medir contra a primeira seria otimismo falso.
 *
 * Rodar com o site no ar:
 *   node scripts/medir-contraste-brasil-sis185.mjs
 */
import { chromium } from "file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs";
import sharp from "sharp";

const BASE = process.env.BASE_URL ?? "http://localhost:3999";
/* 1440 é a largura que a issue nomeia; 1200 de altura pela mesma razão da sonda da
   cena — a câmera avança sobre a cidade do trecho e numa janela de 900 o alvo cai
   fora do quadro, o que se relata como reprovação quando o que falta é pixel. */
const LARGURA = 1440;
const ALTURA = 1200;

/* As paradas de hoje e as candidatas do item 2. A pergunta é sobre a ÚLTIMA
   parada; as outras duas ficam para o relatório mostrar que o começo da palavra
   nunca foi o problema. */
const ATUAL = { inicio: "#0079cb", meio: "#1885ce", fim: "#7c3aed" };
const CANDIDATAS = {
  "#7c3aed (violeta, como está)": "#7c3aed",
  "#0ed8f6 (ciano da marca)": "#0ed8f6",
  "#1479ec (azul claro da marca)": "#1479ec",
  "#0079CB (azul da marca, = 1ª parada)": "#0079cb",
};

const rgb = (hex) => [
  parseInt(hex.slice(1, 3), 16),
  parseInt(hex.slice(3, 5), 16),
  parseInt(hex.slice(5, 7), 16),
];
const canal = (v) => {
  const s = v / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};
const lum = ([r, g, b]) =>
  0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
const razao = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

const navegador = await chromium.launch();
const relatorio = {};

for (const passagem of ["pr", "sp"]) {
  const pagina = await navegador.newPage({
    viewport: { width: LARGURA, height: ALTURA },
    /* MEDIDO, e é a causa que faltava: o padrão do Playwright é
       `reducedMotion: 'reduce'`. Com ele, `matchMedia('(prefers-reduced-motion:
       reduce)')` responde `true`, `dirigindo = cenaCabe && !rm` cai para falso
       (`OfficesScene.tsx:423`) e `.os-abas` não é montada — a 1440x1200, onde
       `(min-width: 1280px) and (min-height: 760px)` casa. Foi isso, e não a largura
       de 1024, que estourou o `locator.click` de
       `medir-contraste-escritorios.mjs`: aquela sonda abre a página sem declarar
       `reducedMotion`, então mede o site na versão SEM movimento e procura um
       controle que só existe na COM. Consertar aquela sonda é trabalho de outra
       issue; fica registrado aqui porque o diagnóstico é o mesmo. */
    reducedMotion: "no-preference",
  });
  await pagina.goto(`${BASE}/quem-somos`, { waitUntil: "networkidle" });
  await pagina.addStyleTag({
    content:
      "header.fixed{display:none!important}" +
      "nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button],[class*=motion-banner],[class*=motion-dialog]{display:none!important}",
  });

  /* O estado a medir se DECLARA. Herdar o trecho em que a rolagem calhou de parar
     é medição sem estado definido — a nota longa está na sonda da cena. */
  /* ESPERA a aba existir antes de contar. Sem isto a contagem correu antes da
     hidratação, deu zero, e as duas passagens saíram medindo o MESMO estado
     (`temAbas: false` com `data-ativa: pr` nas duas) — que é o defeito que a sonda
     da cena descreve como "medição sem estado definido", só que silencioso: o
     relatório vinha completo e plausível, com as duas pontas idênticas porque nunca
     houve duas pontas. O `temAbas` continua no relatório por isso. */
  const abas = pagina.locator(".os-abas button");
  await abas.first().waitFor({ state: "visible", timeout: 20000 }).catch(() => {});
  const temAbas = (await abas.count()) > 0;
  if (temAbas) {
    await (passagem === "pr" ? abas.first() : abas.last()).click();
    await new Promise((r) => setTimeout(r, 1200)); // cortinas dos rótulos: 0,62s
  }
  /* NÃO se rola até o alvo aqui, e a razão foi medida three vezes:
       - `page.screenshot({ clip })` sem `fullPage` recorta em coordenada de JANELA.
         A sonda da cena encaixa `.os-palco` a 24px do topo, e o título fica ACIMA do
         palco na coluna: o recorte sai do quadro por cima e o Playwright responde
         "clipped area is either empty or outside the resulting image".
       - `scrollIntoView` no título deixou `scrollY` em 0.
       - `window.scrollBy` pela posição lida do alvo TAMBÉM deixou `scrollY` em 0
         (`[pr] recorte {"y":3699} scrollY 0`). Com o modo dirigido no ar a rolagem
         da janela é conduzida por script, e o valor imposto de fora é descartado no
         quadro seguinte.
     A saída é não disputar a rolagem: `fullPage: true` faz o recorte ser lido em
     coordenada de DOCUMENTO, que é exatamente o que `getBoundingClientRect` já
     devolve enquanto `scrollY` é 0. O alvo entra no quadro sem mover a cena — e não
     mover a cena é a própria recomendação da sonda dos onze alvos, que registra ter
     lido reprovações falsas justamente por um `scrollBy` cego no meio da partitura.
     A ponta do percurso continua declarada pelo clique na aba, e o `data-ativa` lido
     abaixo vai no relatório para que qualquer arrasto de estado apareça. */
  await new Promise((r) => setTimeout(r, 3500)); // entrada de 3,2s assentando

  const alvo = await pagina.evaluate(() => {
    const e = document.querySelector("#escritorios .text-gradient-brand");
    if (!e) return null;
    /* Retângulo dos GLIFOS, não do elemento. */
    const faixa = document.createRange();
    faixa.selectNodeContents(e);
    const cx = [...faixa.getClientRects()];
    if (!cx.length) return null;
    const x0 = Math.min(...cx.map((r) => r.left));
    const y0 = Math.min(...cx.map((r) => r.top));
    const x1 = Math.max(...cx.map((r) => r.right));
    const y1 = Math.max(...cx.map((r) => r.bottom));
    const c = getComputedStyle(e);
    const palco = document.querySelector(".os-palco");
    return {
      texto: e.textContent,
      px: parseFloat(c.fontSize),
      peso: c.fontWeight,
      degrade: c.backgroundImage,
      ativa: palco?.getAttribute("data-ativa") ?? null,
      scrollY: window.scrollY,
      /* Coordenada de DOCUMENTO, porque o recorte vai com `fullPage: true`:
         `getClientRects` devolve coordenada de janela, então soma-se a rolagem. Com
         `scrollY` em 0 dá no mesmo, mas o clique na aba move o foco e pode rolar —
         e aí o recorte sem a soma miraria outro trecho da página, sem erro nenhum. */
      caixa: {
        x: Math.round(x0 + window.scrollX),
        y: Math.round(y0 + window.scrollY),
        width: Math.max(1, Math.round(x1 - x0)),
        height: Math.max(1, Math.round(y1 - y0)),
      },
    };
  });

  if (!alvo) {
    relatorio[passagem] = { erro: "#escritorios .text-gradient-brand ausente" };
    await pagina.close();
    continue;
  }

  /* Apaga a tinta de toda a cena — inclusive a IMAGEM de quem tem
     `background-clip: text`, senão o degradê é lido como fundo. */
  await pagina.evaluate(() => {
    const raiz = document.querySelector(".os-palco") ?? document.body;
    for (const f of [raiz, ...raiz.querySelectorAll("*")]) {
      const a = getComputedStyle(f);
      if (a.webkitBackgroundClip === "text" || a.backgroundClip === "text") {
        f.style.setProperty("background-image", "none", "important");
      }
      f.style.setProperty("color", "transparent", "important");
      f.style.setProperty("-webkit-text-fill-color", "transparent", "important");
      f.style.setProperty("fill", "transparent", "important");
    }
  });
  await new Promise((r) => setTimeout(r, 400));

  /* Vai em `stderr` de propósito: o relatório em `stdout` continua sendo JSON puro
     (dá para redirecionar para um arquivo), e o recorte fica visível para o próximo
     que mexer aqui — os três erros desta sonda foram todos de recorte fora do
     quadro, e sem esta linha eles aparecem como "clipped area is empty" sem número. */
  console.error(
    `[${passagem}] recorte`,
    JSON.stringify(alvo.caixa),
    "scrollY",
    alvo.scrollY,
  );
  const buf = await pagina.screenshot({ clip: alvo.caixa, fullPage: true });
  const { data, info } = await sharp(buf)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  /* Três terços: o degradê de 120deg tem a última parada em 100%, então cada terço
     da palavra é coberto por uma parada diferente. */
  const tercos = [
    { nome: "1o terco (BRA)", parada: ATUAL.inicio },
    { nome: "2o terco (SI)", parada: ATUAL.meio },
    { nome: "3o terco (IL)", parada: null }, // é o que está em jogo
  ];
  const piores = tercos.map(() => null);
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const i = (y * info.width + x) * info.channels;
      const px = [data[i], data[i + 1], data[i + 2]];
      const t = Math.min(2, Math.floor((x / info.width) * 3));
      /* PIOR = fundo mais CLARO do terço, porque a tinta é escura sobre folha
         clara: é o pixel que mais aproxima a luminância da tinta. */
      if (!piores[t] || lum(px) > lum(piores[t])) piores[t] = px;
    }
  }

  const grande = alvo.px >= 24 || (alvo.px >= 18.66 && Number(alvo.peso) >= 700);
  const piso = grande ? 3 : 4.5;

  relatorio[passagem] = {
    ativa: alvo.ativa,
    temAbas,
    texto: alvo.texto,
    px: alvo.px,
    peso: alvo.peso,
    grande,
    piso,
    degradeLido: alvo.degrade,
    caixa: alvo.caixa,
    tercos: tercos.map((t, i) => ({
      terco: t.nome,
      fundoPior: piores[i],
      ...(t.parada
        ? {
            parada: t.parada,
            razao: Math.round(razao(rgb(t.parada), piores[i]) * 100) / 100,
            passa: razao(rgb(t.parada), piores[i]) >= piso,
          }
        : {
            candidatas: Object.fromEntries(
              Object.entries(CANDIDATAS).map(([nome, hex]) => {
                const r = razao(rgb(hex), piores[i]);
                return [
                  nome,
                  {
                    razao: Math.round(r * 100) / 100,
                    passa: r >= piso,
                  },
                ];
              }),
            ),
          }),
    })),
  };
  await pagina.close();
}

await navegador.close();
console.log(JSON.stringify(relatorio, null, 2));
