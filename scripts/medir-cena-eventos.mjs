/**
 * SIS-166 — confere a cena única de destaque de `/eventos-inovacao`.
 *
 * Três coisas, e nenhuma delas é "parece certo":
 *
 * 1. PARTITURA. Os quinze eventos são todos alcançados, e o DÉCIMO QUINTO chega
 *    com o palco ainda preso no topo (`|top| <= 4px`). A asserção é sobre o
 *    MÓDULO do topo, não sobre `<= 0`: topo negativo é exactamente o sintoma do
 *    defeito que a SIS-156 mediu — o palco já subiu para fora de quadro e o
 *    `15 / 15` nunca é visto. Varredura grossa seguida de segunda passada fina de
 *    2px, senão o resíduo medido é indistinguível de um defeito do mesmo tamanho.
 * 2. GEOMETRIA. As duas colunas não encostam na borda e não colidem com a pílula
 *    do `ScrollSpy` COM O RÓTULO ABERTO (é o estado de hover que colidia com o
 *    cartão do mosaico — medir a pílula fechada aprovaria o defeito). O cartão
 *    central e as colunas cabem no palco sem estourar.
 * 3. CONTRASTE, pelo método de `docs/medidas/COMO-MEDIR-CONTRASTE.md`: tinta
 *    apagada com `color: transparent` + `webkitTextFillColor` (nunca
 *    `visibility: hidden`, que muda o layout), recorte do próprio elemento, PIOR
 *    pixel e não a média, cabeçalho fixo e avisos do `next dev` escondidos.
 *
 * Ferramenta de bancada, não entra no bundle:
 *   node scripts/medir-cena-eventos.mjs
 */
import { chromium } from "file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const ROTA = `${BASE}/eventos-inovacao`;
/* SIS-167 acrescentou 1024, 1280 e 1670: as vagas deixaram de ser uma coluna só e
   viraram quinze posições em porcentagem da faixa, então a largura em que a pior
   delas chega mais perto do `ScrollSpy` não é mais óbvia por inspeção. 1024 é o
   primeiro pixel em que a cena existe (abaixo dele entra `.eventos-lista`) e é lá
   que a faixa é mais estreita em px absolutos. */
const JANELAS = [
  { largura: 1670, altura: 940 },
  { largura: 1440, altura: 900 },
  { largura: 1366, altura: 768 },
  { largura: 1280, altura: 800 },
  { largura: 1024, altura: 768 },
];
const TOTAL = 15;
const PASSOS = 80;

const lin = (c) => {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};
const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const razao = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};

/* Pior pixel do recorte: o piso é o pixel mais desfavorável, não a média. */
function piorPixel(png, tinta) {
  /* PNG cru do Playwright — decodifica com o próprio Chromium seria mais caro que
     ler os bytes já expandidos, então a leitura é feita na página (ver `amostrar`)
     e aqui só chega a lista de cores. */
  let pior = { razao: Infinity, cor: null };
  for (const cor of png) {
    const r = razao(tinta, cor);
    if (r < pior.razao) pior = { razao: r, cor };
  }
  return pior;
}

/**
 * Amostra as cores do retângulo de um elemento desenhando a região num canvas a
 * partir de `html2canvas`? Não: o que se faz aqui é ler os pixels da CAPTURA do
 * Playwright, que é a única fonte que enxerga o que o compositor realmente pintou
 * (degradê, sombra, halo do fio). A decodificação do PNG é feita na própria página
 * com `createImageBitmap`, para não trazer dependência de decodificador.
 */
async function amostrar(pagina, elemento, tinta, blocoParaApagar, recuo = 0) {
  await blocoParaApagar.evaluate((e) => {
    e.style.color = "transparent";
    e.style.webkitTextFillColor = "transparent";
  });
  /* SIS-167 — `recuo` existe por causa de UM falso negativo, e vale registrar qual:
     a placa do rótulo tem `border-radius: 0.4rem`, e os quatro cantos arredondados
     são pixels TRANSPARENTES dentro do retângulo do elemento. Ao espalhar as vagas
     (item 1), as extremas passaram a cair sobre o navy das travessias, e o "pior
     pixel" do recorte virou um canto: 1,00:1 em quatro das cinco larguras, com a
     tinta a 15:1 do lado dela. Reprovar por causa de um canto onde nunca há letra é
     medir a coisa errada — e ACEITAR o 1,00:1 seria pior, porque esconderia um
     contraste ruim de verdade se aparecesse.
     O recuo é o raio da borda, então o que se mede é a área onde o texto pode
     existir. Continua sendo pior pixel, e não média, dentro dessa área. */
  const png = recuo
    ? await (async () => {
        /* `elementHandle.screenshot()` rola o elemento para dentro do viewport
           sozinho; `page.screenshot({ clip })` NÃO, e recorta contra o viewport.
           Sem esta linha o recorte de uma vaga acima da dobra caía num pedaço
           qualquer da página — foi assim que 1366 devolveu 1,01:1 com pixel navy
           enquanto as outras larguras devolviam 11,60:1. Falha que se disfarça de
           defeito de contraste. */
        await elemento.scrollIntoViewIfNeeded();
        const b = await elemento.boundingBox();
        return pagina.screenshot({
          clip: {
            x: b.x + recuo,
            y: b.y + recuo,
            width: Math.max(1, b.width - recuo * 2),
            height: Math.max(1, b.height - recuo * 2),
          },
        });
      })()
    : await elemento.screenshot();
  await blocoParaApagar.evaluate((e) => {
    e.style.color = "";
    e.style.webkitTextFillColor = "";
  });
  const cores = await pagina.evaluate(async (b64) => {
    const bin = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
    const bmp = await createImageBitmap(new Blob([bin], { type: "image/png" }));
    const cv = new OffscreenCanvas(bmp.width, bmp.height);
    const ctx = cv.getContext("2d");
    ctx.drawImage(bmp, 0, 0);
    const d = ctx.getImageData(0, 0, bmp.width, bmp.height).data;
    const out = [];
    for (let i = 0; i < d.length; i += 4) out.push([d[i], d[i + 1], d[i + 2]]);
    return out;
  }, png.toString("base64"));
  return piorPixel(cores, tinta);
}

const navegador = await chromium.launch();
const saida = {};

for (const { largura, altura } of JANELAS) {
  const pagina = await navegador.newPage({
    viewport: { width: largura, height: altura },
  });
  await pagina.goto(ROTA, { waitUntil: "domcontentloaded" });
  await pagina.addStyleTag({
    content:
      "nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button]{display:none!important}",
  });
  /* A hidratação é o que liga o observador e monta o cartão; medir antes dela dá
     um falso "cena vazia". Mesma razão da espera de 2500ms da SIS-156. */
  await new Promise((res) => setTimeout(res, 2500));

  const caixa = await pagina.evaluate(() => {
    const s = document.querySelector("#eventos");
    const r = s.getBoundingClientRect();
    return { topo: window.scrollY + r.top, altura: r.height };
  });

  /* ── 1. PARTITURA ───────────────────────────────────────────────────────── */
  const leitura = () =>
    pagina.evaluate(() => {
      const palco = document.querySelector(".eventos-destaque-palco");
      const n = document.querySelector(".eventos-destaque-contador-numero");
      return {
        y: Math.round(window.scrollY),
        atual: Number(n.textContent.trim().slice(0, 2)),
        palcoTopo: Math.round(palco.getBoundingClientRect().top),
      };
    });

  const quadros = [];
  for (let i = 0; i <= PASSOS; i += 1) {
    const y = caixa.topo + (i / PASSOS) * caixa.altura;
    await pagina.evaluate((a) => window.scrollTo(0, a), y);
    await new Promise((res) => setTimeout(res, 70));
    quadros.push(await leitura());
  }
  const vistos = [...new Set(quadros.map((q) => q.atual))].sort(
    (a, b) => a - b,
  );
  const grosso = quadros.filter((q) => q.atual === TOTAL);
  const naUltima = [];
  if (grosso.length) {
    const fim = grosso[0].y;
    const ini = quadros[quadros.indexOf(grosso[0]) - 1]?.y ?? fim;
    for (let y = ini; y <= fim; y += 2) {
      await pagina.evaluate((a) => window.scrollTo(0, a), y);
      await new Promise((res) => setTimeout(res, 40));
      const q = await leitura();
      if (q.atual === TOTAL) {
        naUltima.push(q);
        break;
      }
    }
    if (!naUltima.length) naUltima.push(grosso[0]);
  }

  /* ── 2. GEOMETRIA (com a pílula do ScrollSpy ABERTA) ─────────────────────── */
  await pagina.evaluate(
    (a) => window.scrollTo(0, a),
    caixa.topo + caixa.altura * 0.4,
  );
  await new Promise((res) => setTimeout(res, 400));
  /* ⚠️ A FLUTUAÇÃO É CONGELADA AQUI, ANTES DE MEDIR — e a versão anterior desta
     sonda, que a congelava só na hora do contraste, media errado.
     Toda asserção de geometria abaixo lê o retângulo e SOMA a excursão da
     flutuação para obter o pior quadro. Isso só é válido se o retângulo lido for o
     de REPOUSO. Com a animação rodando, o que se lê é um quadro qualquer do ciclo,
     e somar a excursão inteira nos dois sentidos conta o mesmo deslocamento duas
     vezes: caixas infladas em ~±20px de nada. Nas asserções de folga contra a borda
     o erro era conservador e passava despercebido; na de sobreposição (20) ele
     inventava treze pares em todas as larguras.
     `animation: none` devolve o elemento ao repouso (não há `animation-fill-mode`
     em jogo). É o único ponto do arquivo em que a cena é medida parada, e é de
     propósito: o pior quadro é CALCULADO a partir do repouso, não sorteado. */
  await pagina.addStyleTag({
    content: ".eventos-vaga--botao{animation:none!important}",
  });
  await new Promise((res) => setTimeout(res, 300));
  const pilula = pagina
    .locator("nav[aria-label] a, nav[aria-label] button")
    .first();
  if (await pilula.count()) await pilula.hover().catch(() => undefined);
  await new Promise((res) => setTimeout(res, 350));
  const geo = await pagina.evaluate(() => {
    const r = (s) => {
      const el = document.querySelector(s);
      if (!el) return null;
      const c = el.getBoundingClientRect();
      return {
        left: Math.round(c.left),
        right: Math.round(c.right),
        top: Math.round(c.top),
        bottom: Math.round(c.bottom),
      };
    };
    /* O `ScrollSpy` pelo `aria-label` dele, e não por heurística de posição: a
       primeira versão desta sonda pegava "algum `nav` à esquerda e alto" e em
       1366 casou com o cabeçalho, dando `right: 1301` — a asserção reprovava por
       medir a caixa errada. */
    const n = document.querySelector('nav[aria-label="Seções desta página"]');
    const c = n?.getBoundingClientRect();
    const spy = c
      ? { right: Math.round(c.right), left: Math.round(c.left) }
      : null;
    /* ── SIS-167 ────────────────────────────────────────────────────────────
       Medir a caixa da FAIXA deixou de responder à pergunta. As vagas agora são
       `position: absolute` com `left`/`top` em porcentagem, e por cima disso
       flutuam: a folga verdadeira contra o `ScrollSpy` é

         (borda esquerda da vaga em repouso) - (excursão da flutuação p/ esquerda)
                                            - (projeção da rotação)

       e não a borda da faixa. `--evt-float-x` empurra `x * -0.7` na parada de 62%
       (é ali que o cartão vai mais para a esquerda), e a rotação de `--evt-float-rot`
       alarga a meia-extensão horizontal em `(altura/2) * sen(theta)`. Os valores
       saem do `getComputedStyle` de CADA vaga, e não escritos à mão aqui: repetir
       9px e 2deg nesta sonda seria criar o segundo lugar onde o número envelhece —
       exactamente o defeito que o comentário da folga no CSS nomeia. */
    const raiz = document.querySelector(".eventos-destaque");
    const secao = raiz.getBoundingClientRect();
    const vagas = [...document.querySelectorAll(".eventos-vaga")].map((el) => {
      const c = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      const px = (v) => parseFloat(v) || 0;
      const fx = Math.abs(px(s.getPropertyValue("--evt-float-x")));
      const rot = Math.abs(px(s.getPropertyValue("--evt-float-rot")));
      /* A vaga em destaque não flutua (não tem `.eventos-vaga--botao`), então a
         excursão dela é zero — e é isso que se lê aqui, não uma exceção escrita. */
      const flutua = el.classList.contains("eventos-vaga--botao");
      const excursaoX = flutua ? fx * 0.7 : 0;
      const projRot = flutua
        ? (c.height / 2) * Math.sin((rot * Math.PI) / 180)
        : 0;
      const folga = excursaoX + projRot;
      /* `+ fx` na direita: na parada de 30% o deslocamento é positivo. */
      const excDir = flutua ? fx + projRot : 0;
      const rotulo = el.querySelector(".eventos-vaga-rotulo");
      return {
        faixa: el.closest(".eventos-destaque-coluna--esq") ? "esq" : "dir",
        destaque: el.classList.contains("eventos-vaga--destaque"),
        esqPior: Math.round(c.left - folga),
        dirPior: Math.round(c.right + excDir),
        /* Na vertical o pior quadro soma DUAS coisas, e a segunda foi esquecida na
           primeira versão: a deriva de `--evt-float-y` (hoje 0 — ver a nota dela no
           CSS) e a PROJEÇÃO DA ROTAÇÃO, que numa caixa larga é `(largura/2) × sen
           theta` e não é desprezível quando a folga entre vagas é de poucos pixels. */
        topoPior: Math.round(
          c.top -
            Math.abs(px(s.getPropertyValue("--evt-float-y"))) -
            (flutua ? (c.width / 2) * Math.sin((rot * Math.PI) / 180) : 0),
        ),
        baixoPior: Math.round(
          c.bottom +
            Math.abs(px(s.getPropertyValue("--evt-float-y"))) * 0.78 +
            (flutua ? (c.width / 2) * Math.sin((rot * Math.PI) / 180) : 0),
        ),
        excursao: Number(folga.toFixed(1)),
        /* SIS-167 (item 10) — ESTA ASSERÇÃO ESTAVA ERRADA e reprovava o certo.
           A versão anterior comparava `scrollHeight > clientHeight`, e isso é
           VERDADE para qualquer texto clampado com `overflow: hidden` — é o que
           clampar significa. Ela não distinguia "cortado corretamente em duas
           linhas" de "cortado no meio da terceira", que é o defeito real.
           O que se mede agora são as duas escapadas que dão para ver:
           • na horizontal, `scrollWidth > clientWidth` (palavra mais larga que a
             placa, que o clamp por linhas não vê);
           • na vertical, se a altura ÚTIL (sem `padding`) é múltiplo inteiro da
             `line-height`. Se não é, o recorte cai dentro de uma linha e sobra
             meia altura de glifo — o sintoma da captura. Tolerância de 1px, para
             o arredondamento sub-pixel da `line-height` fracionária. */
        /* Os números crus da placa ficam na saída: quando o item 15 reprova, é
           preciso saber QUAL placa e por quanto, senão a única saída é adivinhar. */
        rotuloMedida: rotulo
          ? (() => {
              const r = getComputedStyle(rotulo);
              return {
                lh: Number(parseFloat(r.lineHeight).toFixed(2)),
                util: Number(
                  (
                    rotulo.clientHeight -
                    parseFloat(r.paddingTop) -
                    parseFloat(r.paddingBottom)
                  ).toFixed(2),
                ),
                /* Linha mais larga do texto / largura da caixa — o mesmo par que a
                   asserção 15 usa. Antes era `scrollWidth`/`clientWidth`, que nesta
                   placa over-reporta em até 3px (ver a nota da asserção). */
                largura: (() => {
                  const f = document.createRange();
                  f.selectNodeContents(rotulo);
                  const linhas = [...f.getClientRects()].map((l) => l.width);
                  const maior = linhas.length ? Math.max(...linhas) : 0;
                  return `${maior.toFixed(1)}/${rotulo.getBoundingClientRect().width.toFixed(1)}`;
                })(),
                clamp: r.webkitLineClamp,
              };
            })()
          : null,
        rotuloTransborda: (() => {
          if (!rotulo) return false;
          /* NA HORIZONTAL, mede-se a TINTA, não o `scrollWidth` — e esta troca custou
             duas rodadas de diagnóstico errado. `scrollWidth` é inteiro e, nesta
             placa, over-reporta: com a caixa em 57,91px em 1366 ele devolveu 61 no
             título mais longo do catálogo, e a asserção reprovava. As caixas de linha
             do próprio texto (`Range.getClientRects()`) mostraram a linha mais larga
             em 57,6px — dentro da caixa, nenhuma letra fora. Ou seja: o
             `overflow-wrap: anywhere` está quebrando como deveria e o que sobrava era
             artefato da medida, não defeito da página.
             Uma linha de texto ultrapassando a caixa é o que o item 10 descreve, e é
             o que se mede aqui. Meio pixel de tolerância porque as posições são
             fracionárias. */
          const caixa = rotulo.getBoundingClientRect();
          const faixaTexto = document.createRange();
          faixaTexto.selectNodeContents(rotulo);
          for (const linha of faixaTexto.getClientRects()) {
            if (
              linha.left < caixa.left - 0.5 ||
              linha.right > caixa.right + 0.5
            )
              return true;
          }
          const r = getComputedStyle(rotulo);
          const lh = parseFloat(r.lineHeight);
          if (!lh) return false;
          const util =
            rotulo.clientHeight -
            parseFloat(r.paddingTop) -
            parseFloat(r.paddingBottom);
          const resto = util % lh;
          return Math.min(resto, lh - resto) > 1;
        })(),
      };
    });
    return {
      esq: r(".eventos-destaque-coluna--esq"),
      dir: r(".eventos-destaque-coluna--dir"),
      cartao: r(".eventos-destaque-cartao"),
      arte: r(".eventos-destaque-cartao .eventos-destaque-arte"),
      palco: r(".eventos-destaque-palco"),
      contador: r(".eventos-destaque-contador"),
      spy: spy ?? null,
      janela: { w: window.innerWidth, h: window.innerHeight },
      secao: { left: Math.round(secao.left), right: Math.round(secao.right) },
      vagas,
      nVagas: vagas.length,
      /* Pior de todas, já com a flutuação somada. */
      piorEsq: Math.min(...vagas.map((v) => v.esqPior)),
      piorDir: Math.max(...vagas.map((v) => v.dirPior)),
      transbordos: vagas.filter((v) => v.rotuloTransborda).length,
      /* SIS-167 — VAGA NÃO PODE COBRIR VAGA, e esta asserção existe porque a
         primeira versão da issue deixava isso acontecer em 1366 e NENHUMA das
         asserções olhava para lá. O defeito apareceu de lado, no contraste do
         rótulo (1,01:1, pixel navy), e diagnosticar um sintoma a três saltos de
         distância da causa é caro. Mede-se par a par, dentro de cada faixa, com a
         excursão da flutuação já somada nas duas pontas — duas vagas separadas em
         repouso e sobrepostas no pior quadro da animação é sobreposição. */
      sobreposicoes: (() => {
        let n = 0;
        for (const f of ["esq", "dir"]) {
          const c = vagas.filter((v) => v.faixa === f);
          for (let i = 0; i < c.length; i += 1)
            for (let j = i + 1; j < c.length; j += 1)
              if (
                c[i].topoPior < c[j].baixoPior &&
                c[j].topoPior < c[i].baixoPior &&
                c[i].esqPior < c[j].dirPior &&
                c[j].esqPior < c[i].dirPior
              )
                n += 1;
        }
        return n;
      })(),
    };
  });

  /* ── 2b. A FAIXA NÃO SE REORGANIZA QUANDO O DESTAQUE TROCA ────────────────────
     A vaga em destaque é um `<div>` e as outras catorze são `<button>`. Enquanto as
     vagas eram `position: absolute`, ter alturas diferentes não custava nada. Em
     fluxo custa: um destaque mais baixo que o botão que ele substitui reposiciona
     TODAS as vagas abaixo dele, e como o destaque anda quinze vezes na rolagem, a
     constelação inteira saltaria quinze vezes. `--evt-vaga-h` existe para impedir
     isso, e sem esta asserção a garantia seria só uma frase no comentário.
     Mede-se o topo das vagas em dois pontos de rolagem com destaques DIFERENTES; a
     posição de cada uma tem de ser a mesma (tolerância de 2px para a rolagem em si,
     que é descontada do topo da própria faixa). */
  const arranjo = async (fracao) => {
    await pagina.evaluate(
      (a) => window.scrollTo(0, a),
      caixa.topo + caixa.altura * fracao,
    );
    await new Promise((res) => setTimeout(res, 500));
    return pagina.evaluate(() => {
      const faixa = document
        .querySelector(".eventos-destaque-coluna--esq")
        .getBoundingClientRect();
      return {
        destaque: [...document.querySelectorAll(".eventos-vaga")].findIndex((v) =>
          v.classList.contains("eventos-vaga--destaque"),
        ),
        topos: [
          ...document.querySelectorAll(
            ".eventos-destaque-coluna--esq .eventos-vaga",
          ),
        ].map((v) => Math.round(v.getBoundingClientRect().top - faixa.top)),
      };
    });
  };
  const arrA = await arranjo(0.12);
  const arrB = await arranjo(0.62);
  const desloc = arrA.topos.map((t, i) => Math.abs(t - (arrB.topos[i] ?? 1e6)));

  /* ── 3. CONTRASTE ───────────────────────────────────────────────────────── */
  await pagina.addStyleTag({ content: "header.fixed{display:none!important}" });
  /* A flutuação já está congelada desde o bloco de geometria (ver a nota lá). Além
     do motivo de correção que está escrito lá, o congelamento é OBRIGATÓRIO para o
     que vem agora: `locator.screenshot` espera o elemento estabilizar antes de
     capturar, e `animation-iteration-count: infinite` não estabiliza nunca — a
     sonda estourava com "element is not stable" depois de 30s, falha que parece
     problema de rede. Não muda cor nenhuma: a flutuação é `translate3d` + `rotate`. */
  await new Promise((res) => setTimeout(res, 500));
  const cartao = pagina.locator(".eventos-destaque-cartao");
  /* Escopo no cartão: a lista de mobile usa as MESMAS classes de escrita (é o
     mesmo conteúdo em outra arrumação), então sem o escopo o seletor resolve para
     dezesseis elementos. */
  const titulo = pagina.locator(
    ".eventos-destaque-cartao .eventos-destaque-cartao-titulo",
  );
  const texto = pagina.locator(
    ".eventos-destaque-cartao .eventos-destaque-cartao-texto",
  );
  const rotulo = pagina
    .locator(".eventos-destaque-coluna--esq .eventos-vaga-rotulo")
    .first();
  const colEsq = pagina.locator(".eventos-destaque-coluna--esq");

  const mTitulo = await amostrar(pagina, titulo, [4, 32, 62], cartao);
  const mTexto = await amostrar(pagina, texto, [18, 58, 99], cartao);
  /* 7px = o `border-radius: 0.4rem` da placa arredondado para cima. */
  const mRotulo = await amostrar(pagina, rotulo, [18, 58, 99], colEsq, 7);

  saida[`${largura}x${altura}`] = {
    "#secaoAltura": Math.round(caixa.altura),
    "#eventosVistos": vistos.length,
    "1-quinzeAlcancados":
      vistos.length === TOTAL && vistos[0] === 1 && vistos[14] === TOTAL,
    "2-decimoQuintoEmQuadro":
      naUltima.length > 0 && Math.abs(naUltima[0].palcoTopo) <= 4,
    "#primeiroQuadroNoQuinze": naUltima[0] ?? null,
    /* SIS-167 — as asserções 3, 4 e 6 passaram a medir a PIOR VAGA com a
       flutuação somada, e não a caixa da faixa: a faixa é só o contêiner, os
       cartões vivem em porcentagem dentro dela e se movem. Medir a faixa aprovaria
       um cartão colidindo. */
    "3-piorVagaLongeDaBorda": geo.piorEsq >= 40,
    "4-piorVagaNaoColideComScrollSpy":
      geo.spy === null || geo.piorEsq > geo.spy.right,
    "#folgaContraScrollSpy": geo.spy
      ? `${geo.piorEsq - geo.spy.right}px (pior vaga em ${geo.piorEsq}, com a flutuação somada; ScrollSpy right=${geo.spy.right})`
      : "sem ScrollSpy nesta rota",
    "5-cartaoCabeNoPalco":
      geo.cartao.top >= geo.palco.top - 1 &&
      geo.cartao.bottom <= geo.palco.bottom + 1,
    "6-piorVagaDireitaLongeDaBorda": geo.janela.w - geo.piorDir >= 40,
    /* Item 4 da issue: `overflow: clip` na seção. Nenhuma vaga, com a flutuação
       no pior quadro, pode passar das bordas laterais da seção — e a placa do
       rótulo é a que era cortada no mosaico. */
    "14-nadaCortadoPeloOverflowClip":
      geo.piorEsq >= geo.secao.left && geo.piorDir <= geo.secao.right,
    /* Item 10 da issue: nenhuma das quinze placas transborda a própria caixa. */
    "15-rotulosNaoTransbordam": geo.transbordos === 0,
    "#transbordos": `${geo.transbordos} de ${geo.nVagas} placas`,
    /* Item 1 da issue: o espalhamento não pode sobrepor duas vagas da mesma faixa. */
    "20-nenhumaVagaCobreOutra": geo.sobreposicoes === 0,
    "#sobreposicoes": `${geo.sobreposicoes} pares (pior quadro da flutuação incluído)`,
    /* Item 6 da issue: a vaga em destaque ocupa a mesma vaga que o botão ocuparia. */
    "21-faixaNaoSeReorganizaNaTroca":
      arrA.destaque !== arrB.destaque && Math.max(...desloc) <= 2,
    "#deslocamentoNaTroca": `destaques ${arrA.destaque} e ${arrB.destaque}; maior deslocamento de topo ${Math.max(...desloc)}px`,
    /* Item 11: a arte cresceu e o contador continua em quadro. */
    "16-contadorEmQuadro":
      geo.contador.bottom <= geo.palco.bottom + 1 &&
      geo.contador.bottom <= geo.janela.h,
    "#arteLargura": geo.arte ? geo.arte.right - geo.arte.left : null,
    "#geo": geo,
    "7-tituloAcima3": mTitulo.razao >= 3,
    "#tituloRazao": `${mTitulo.razao.toFixed(2)}:1 (pior pixel rgb(${mTitulo.cor}), tinta #04203e, recorte do .eventos-destaque-cartao-titulo com a tinta do cartão inteiro apagada)`,
    "8-descricaoAcima45": mTexto.razao >= 4.5,
    "#descricaoRazao": `${mTexto.razao.toFixed(2)}:1 (pior pixel rgb(${mTexto.cor}), tinta #123a63, recorte do .eventos-destaque-cartao-texto)`,
    "9-rotuloDaColunaAcima45": mRotulo.razao >= 4.5,
    "#rotuloRazao": `${mRotulo.razao.toFixed(2)}:1 (pior pixel rgb(${mRotulo.cor}), tinta #123a63, recorte da 1ª placa da coluna esquerda com 7px de recuo, para os cantos arredondados não entrarem na conta)`,
  };
  await pagina.close();
}

/* Abaixo de 1024px: a cena não existe e a LISTA tem de existir, com os quinze. */
const mob = await navegador.newPage({ viewport: { width: 390, height: 844 } });
await mob.goto(ROTA, { waitUntil: "domcontentloaded" });
await new Promise((res) => setTimeout(res, 2000));
saida["390x844"] = await mob.evaluate(() => {
  const cena = document.querySelector(".eventos-destaque");
  const lista = document.querySelector(".eventos-lista");
  return {
    "10-cenaEscondida": getComputedStyle(cena).display === "none",
    "11-listaVisivel": getComputedStyle(lista).display !== "none",
    "12-quinzeItens":
      lista.querySelectorAll(".eventos-lista-item").length === 15,
    /* SIS-205 — ERAM QUINZE, SÃO DOIS, e não é perda: o botão de vídeo passou a
       depender da flag `youtube` do evento, que hoje só `web-summit-ai` e
       `suitability-ai` têm. Contar quinze aqui reprovava a lista por um botão que
       não deve existir. (Reaplicado na SIS-204 — eu apaguei este ajuste ao devolver
       o arquivo ao HEAD para conferir um recorte de contraste.) */
    "13-doisBotoes":
      lista.querySelectorAll("a.eventos-destaque-botao").length === 2,
  };
});
await mob.close();

/* ── SIS-167: MOVIMENTO REDUZIDO ───────────────────────────────────────────────
   A régua de `~/.claude/skills/reduced-motion-conteudo`: a flutuação é decoração e
   morre, MAS tem de morrer terminando VISÍVEL e sem tirar nada do alcance. Três
   coisas se medem, e a terceira é a que costuma ser esquecida:
   • `animationName` das catorze é `none`;
   • a caixa de cada vaga é a MESMA de repouso (nada preso deslocado) e nenhuma
     está com `opacity: 0` ou `visibility: hidden`;
   • os quatorze `<button>` continuam existindo e focáveis — é isso que garante que
     os quinze eventos são alcançáveis sem rolar, e não uma exceção de `@media`. */
const rm = await navegador.newPage({
  viewport: { width: 1440, height: 900 },
  reducedMotion: "reduce",
});
await rm.goto(ROTA, { waitUntil: "domcontentloaded" });
await new Promise((res) => setTimeout(res, 2500));
saida["1440x900 reduced-motion"] = await rm.evaluate(() => {
  const vagas = [...document.querySelectorAll(".eventos-vaga")];
  const botoes = [...document.querySelectorAll("button.eventos-vaga--botao")];
  const anim = botoes.map((b) => getComputedStyle(b).animationName);
  const invisiveis = vagas.filter((v) => {
    const s = getComputedStyle(v);
    return (
      Number(s.opacity) < 0.99 ||
      s.visibility === "hidden" ||
      v.getBoundingClientRect().width < 1
    );
  }).length;
  /* `matrix(1, 0, 0, 1, 0, 0)` e `none` são os dois jeitos de o compositor dizer
     "identidade". Qualquer outra coisa é transform preso. */
  const presos = botoes.filter((b) => {
    const t = getComputedStyle(b).transform;
    return t !== "none" && t !== "matrix(1, 0, 0, 1, 0, 0)";
  }).length;
  return {
    "17-flutuacaoDesligada": anim.every((a) => a === "none"),
    "#animationNames": [...new Set(anim)],
    "18-nadaPresoInvisivel": invisiveis === 0 && presos === 0,
    "19-catorzeBotoesAlcancaveis": botoes.length === 14,
    "#nVagas": vagas.length,
  };
});
await rm.close();

await navegador.close();
console.log(JSON.stringify(saida, null, 2));
