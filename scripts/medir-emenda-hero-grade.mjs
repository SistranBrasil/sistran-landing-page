/**
 * SIS-187 — mede por RASTER a emenda entre o claro do hero (`.hero-sheet`,
 * `#f4f8fc`) e a seção seguinte, que é a grade de marcas (`.marcas-grade`,
 * `#f5faff`).
 *
 * Por que raster e não `getComputedStyle`: a saída escolhida (saída 2 da issue) é
 * um DEGRADÊ na borda de cima da grade. `getComputedStyle` devolveria a string do
 * gradiente, não a cor que o olho vê em cada linha de pixel — e o número que a
 * issue pede é justamente "RGB acima e abaixo da aresta". Só o pixel pintado
 * responde.
 *
 * ── O que é medido ─────────────────────────────────────────────────────────
 * Uma COLUNA de 1px no meio da tela, atravessando a aresta. Coluna, e não área:
 * a emenda é de largura cheia e horizontalmente constante, então uma coluna
 * amostra a transição inteira sem diluir nada numa média. Para cada linha em
 * volta da aresta sai o RGB, e daí o `degrau` — a maior distância de canal entre
 * dois pixels VIZINHOS. É esse degrau que o olho lê como aresta: `#f4f8fc` contra
 * `#f5faff` num salto seco de 1px lê como risco; o mesmo delta espalhado por
 * dezenas de linhas não lê como nada.
 *
 * ── Onde a aresta é encontrada ─────────────────────────────────────────────
 * `.marcas-grade` é o irmão seguinte do `#top` e sobe por cima do hero
 * (`#top + *`). A borda de cima dela é a aresta. A sonda rola até essa borda cair
 * no meio da janela: no topo da página ela está fora da tela, e no fim do percurso
 * do `#top` ela já encostou na folha (antes da SIS-198 o `drop` de 20svh a
 * empurrava para lá; hoje quem faz isso é só a `margin-bottom: -100svh` da folha).
 *
 * ── A COLUNA NÃO PODE SER NO MEIO DA TELA ─────────────────────────────────
 * Primeira rodada desta sonda mediu em `x = largura / 2` e leu navy dos DOIS lados
 * da aresta, com um pico de 52 em `dy=-1`. Não era defeito: a coluna atravessava o
 * CARD do hero — o vídeo e o `brand-line` da borda de baixo dele — e não a emenda.
 *
 * A emenda é de largura cheia, então basta sair de baixo do card: `x = 8`.
 *
 * SIS-198 reescreveu o MOTIVO desta escolha, mantendo a coluna. Antes o card era o
 * resultado do encolhimento (`scale` 0.54 no fim do percurso do `#top`, centrado,
 * ocupando ~332–1108 a 1440), e a coluna 8 escapava dele porque o card era ESTREITO.
 * Agora não há encolhimento: o card nasce e fica no tamanho da referência, largura
 * cheia menos a margem — `100vw - 2 × clamp(20px, 4.85vw, 96px)`, isto é ~70–1370 a
 * 1440. A coluna 8 continua fora dele, mas por outra razão: por estar dentro da
 * MARGEM do card, não por o card ter se recolhido ao centro. A margem é o piso do
 * `clamp` (20px) no pior caso, então 8 nunca é alcançada.
 *
 * A 390 nada disso se aplica: as regras de card são `@media (min-width: 1024px)` e
 * ali a cena é de sangria. Nas duas larguras, portanto, x=8 segue sendo o pior caso
 * da emenda — os dois lados são claros (folha acima, grade abaixo) e o degrau
 * aparece sozinho, sem vídeo por perto para disfarçar.
 *
 * Rodar com o site no ar (`npx next start -p 3999` ou `next dev`):
 *   node scripts/medir-emenda-hero-grade.mjs
 */
import { chromium } from "file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs";
import sharp from "sharp";

const BASE = process.env.BASE_URL ?? "http://localhost:3999";
/* As duas larguras que a issue nomeia. 1440 é o regime dividido da SIS-178 e 390
   é o regime de sangria — a folha clara existe nos dois, mas o que está ACIMA da
   aresta muda de composição, então o degrau tem de ser medido nos dois. */
const LARGURAS = [1440, 390];
/* Quantas linhas de pixel colher de cada lado da aresta. 24 cobre com folga o
   degradê da saída 2 (a dissolução mede `clamp(56px, 7svh, 96px)`), então a
   varredura vê o começo e o fim da rampa, não só o miolo dela. */
const RAIO = 24;

const navegador = await chromium.launch();
const saida = [];

for (const largura of LARGURAS) {
  const contexto = await navegador.newContext({
    viewport: { width: largura, height: 900 },
    /* `deviceScaleFactor: 1` é obrigatório: com 2 o pixel do screenshot deixa de
       corresponder à coordenada CSS de `getBoundingClientRect`, e a aresta sai
       meio pixel deslocada — exatamente o erro que faria um degrau real passar
       por antialiasing. */
    deviceScaleFactor: 1,
  });
  const pagina = await contexto.newPage();
  /* `networkidle` não serve nesta home: o vídeo do hero mantém requisição
     aberta e a espera estoura em 30s. */
  await pagina.goto(BASE, { waitUntil: "domcontentloaded" });
  await pagina.waitForTimeout(2500);

  /* SIS-198 — o diálogo de preferências de movimento abre na primeira visita com
     um véu navy de tela cheia. Uma rodada desta sonda leu `3,45,103` em TODAS as
     49 linhas, nas duas larguras: era o véu, não a emenda. "Continuar" mantém a
     preferência do dispositivo, que é o modo em que a emenda deve ser medida. */
  const continuar = pagina.getByRole("button", { name: /continuar/i });
  if (await continuar.count()) {
    await continuar.first().click();
    await pagina.waitForTimeout(500);
  }

  /* Rola até a borda de cima da grade cair no meio da janela. Feito em duas
     passadas porque a primeira muda o layout: o `#top` é um percurso de 320svh
     com cena `sticky`, e a posição da grade em coordenadas de documento não
     depende da rolagem — mas a própria `sticky` muda o que está PINTADO em volta
     dela, então a segunda leitura confirma o alvo. */
  const alvoY = async () =>
    pagina.evaluate(() => {
      const el = document.querySelector(".marcas-grade");
      if (!el) return null;
      return el.getBoundingClientRect().top + window.scrollY - window.innerHeight / 2;
    });

  const y1 = await alvoY();
  if (y1 == null) throw new Error("`.marcas-grade` não encontrada — a home mudou de vizinha?");
  await pagina.evaluate((v) => window.scrollTo(0, v), y1);
  await pagina.waitForTimeout(600);
  const y2 = await alvoY();
  await pagina.evaluate((v) => window.scrollTo(0, v), y2);
  /* Espera longa de propósito: a cena do hero é dirigida por rolagem e o vídeo
     busca quadro (`primitives/ScrollVideo`). Fotografar antes de o seek terminar
     colhe o quadro anterior — que não muda a aresta, mas muda o que está acima
     dela em 390, onde o fundo é o próprio vídeo. */
  await pagina.waitForTimeout(1500);

  const aresta = await pagina.evaluate(
    () => document.querySelector(".marcas-grade").getBoundingClientRect().top,
  );
  const linhaAresta = Math.round(aresta);
  const x = 8; // fora do card do hero — ver o cabeçalho.

  const topo = Math.max(0, linhaAresta - RAIO);
  const altura = Math.min(900 - topo, RAIO * 2 + 1);

  /* A janela INTEIRA, e o recorte é feito depois, no buffer.
     Primeira rodada usou `screenshot({ clip })` e leu navy nos 49 pixels: o `clip`
     do Playwright é em coordenadas de DOCUMENTO, não de janela, e com
     `scrollY: 1890` um `y` de 426 cai lá em cima no hero. Recortar no buffer não
     tem essa ambiguidade — o screenshot de janela é, por definição, a janela. */
  const png = await pagina.screenshot();
  const { data, info } = await sharp(png).raw().toBuffer({ resolveWithObject: true });
  const canais = info.channels;

  const linhas = [];
  for (let i = 0; i < altura; i += 1) {
    const b = ((topo + i) * info.width + x) * canais;
    linhas.push({
      dy: topo + i - linhaAresta,
      rgb: [data[b], data[b + 1], data[b + 2]],
    });
  }

  /* O número que decide: o maior salto de canal entre pixels VIZINHOS. Uma
     aresta seca de `#f4f8fc` para `#f5faff` dá 3; um degradê bem espalhado dá 1,
     que é o menor salto representável em 8 bits — ou seja, o mínimo possível sem
     unificar as duas cores. */
  let degrau = 0;
  let degrauEm = null;
  for (let i = 1; i < linhas.length; i += 1) {
    const d = Math.max(
      ...[0, 1, 2].map((c) => Math.abs(linhas[i].rgb[c] - linhas[i - 1].rgb[c])),
    );
    if (d > degrau) {
      degrau = d;
      degrauEm = linhas[i].dy;
    }
  }

  saida.push({
    largura,
    acima: linhas.find((l) => l.dy === -RAIO)?.rgb ?? linhas[0].rgb,
    naAresta: linhas.find((l) => l.dy === 0)?.rgb,
    abaixo: linhas[linhas.length - 1].rgb,
    degrau,
    degrauEm,
    coluna: linhas.map((l) => `${l.dy}:${l.rgb.join(",")}`).join(" "),
  });
  await contexto.close();
}

await navegador.close();

for (const r of saida) {
  console.log(`\n── ${r.largura}px · aresta de \`.marcas-grade\` ──`);
  console.log(`  acima (-${RAIO}px):`, r.acima.join(", "));
  console.log("  na aresta (0px)  :", r.naAresta?.join(", "));
  console.log(`  abaixo (+${RAIO}px):`, r.abaixo.join(", "));
  console.log(`  maior degrau entre vizinhos: ${r.degrau} (em dy=${r.degrauEm})`);
  console.log("  coluna:", r.coluna);
}
