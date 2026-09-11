/**
 * SIS-192 — mede o contraste real do bloco fixo da coluna do hero da home
 * (`src/components/ui/HeroPitch.tsx`) nos DOIS regimes da SIS-178:
 *   • 1440 e 1024 → regime A: tinta escura na coluna branca (`.hero-sheet`)
 *   • 390         → regime C: tinta clara sobre o vídeo em sangria + vinheta
 *
 * Parte de `docs/medidas/COMO-MEDIR-CONTRASTE.md` e da sonda de /quem-somos
 * (`medir-contraste-escritorios.mjs`), e MUDA O RECORTE. O método antigo mede o
 * retângulo do texto e chama de fundo tudo que estiver lá dentro; este alvo
 * mostrou que isso não se sustenta quando o texto tem várias linhas sobre um
 * fundo movimentado. As três reprovações falsas da primeira rodada, todas com a
 * mesma causa — "o retângulo é maior que a letra":
 *
 *   1. União dos rects de linha: o vão do entrelinhamento e a sobra à direita de
 *      cada linha não têm letra nenhuma, e ali se lê o vídeo puro. Título 1,10:1,
 *      apoio 1,35:1 — pixels claros colhidos no vão.
 *   2. Rect por linha, ainda insuficiente: a caixa de linha é mais alta que os
 *      glifos, e a do realce (`inline-block`) invade a linha seguinte. Em 1440 o
 *      realce reprovou em 1,02:1 lendo como "fundo" um `o` do próprio título.
 *   3. `background-clip: text` exige `-webkit-text-fill-color: transparent`, e ler
 *      o alfa daí dá 0 — todo alvo em degrade saía com `razao: 1,00`.
 *
 * ── O RECORTE DESTA SONDA: A LETRA, POR DIFERENÇA ──────────────────────────
 * Dois separadores da MESMA página e do MESMO quadro: uma aba com a tinta e outra
 * com a tinta apagada. O pixel que MUDOU entre as duas é o pixel que a letra
 * cobre — não o retângulo dela, a letra. O fundo verdadeiro é o valor lido na aba
 * apagada, exatamente naqueles pixels.
 *
 * Isso resolve os três vícios de uma vez: vão e sobra não mudam, então saem;
 * glifo que não pertence ao alvo não muda no recorte do alvo, então sai; e o
 * degrade some ao apagar, então é diferença como qualquer outra tinta.
 *
 * E dá a COBERTURA de cada pixel: `|A − B| / |tinta − B|`. Isso separa o corpo da
 * letra da franja de antialiasing, e é o que o relatório precisa em rótulo de
 * 15px — o pior pixel de uma franja subestima o que se lê, e o pior pixel do
 * corpo é o número honesto. Os dois vão no resultado (`piorTudo`, `piorCorpo`);
 * quem decide é `piorCorpo`, e `piorTudo` fica à vista para não esconder o caso
 * em que a franja é ruim demais.
 *
 * ── O QUADRO SE TROCA ROLANDO, NÃO PROCURANDO ──────────────────────────────
 * No regime C o fundo é vídeo, e comparar duas abas exige que as duas mostrem o
 * MESMO quadro. Pausar o vídeo e declarar `currentTime` NÃO funciona aqui — ele é
 * dirigido pela rolagem e o valor procurado é reescrito no quadro seguinte. As
 * amostras são, então, posições de rolagem (`ROLAGENS`); a nota longa está lá.
 * Amostragem, e não prova: nove posições não cobrem o vídeo inteiro. É por isso
 * que o regime C não pode depender do quadro que calhou de aparecer — o que
 * garante o piso é a tarja do bloco.
 *
 * ── SIS-186: O PAR, O Δ E O VEREDITO ──────────────────────────────────────
 * Esta sonda é a que emite o par exigido por `docs/medidas/COMO-MEDIR-CONTRASTE.md`
 * §7. Cada alvo sai com `razao` (perna calculada: corpo da letra), `rasterPior`
 * (perna raster: pior pixel do recorte com a franja dentro), `delta` entre as duas,
 * `miudo` e `veredito`. Δ grande é assinatura de franja, não de contraste ruim, e
 * por isso o raster sozinho não condena.
 *
 * Nada aqui entra no bundle: é ferramenta de bancada.
 *   node scripts/medir-contraste-hero-pitch.mjs
 *   LARGURAS=390 node scripts/medir-contraste-hero-pitch.mjs   # rodada curta
 */
import { chromium } from "file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs";
import sharp from "sharp";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
/* 1440 e 1024 são as duas pontas do regime A (1024 é o limiar da `@media`, onde a
   coluna é a mais estreita e o corpo do título o menor da rampa); 390 é o regime
   C. 768 não entra porque não é um terceiro regime: cai na mesma regra base que
   390, com a coluna mais larga — texto MAIOR sobre fundo idêntico, o mais fácil
   dos dois. */
/* Sobrescrevível para rodada curta (`LARGURAS=390 node scripts/…`): a passagem
   completa abre duas abas por largura e leva ~10min. O padrão continua sendo as
   três — rodada curta serve para reconferir uma perna, não para relatar. */
const LARGURAS = process.env.LARGURAS
  ? process.env.LARGURAS.split(",").map(Number)
  : [1440, 1024, 390];
const ALTURA = 900;
/* ⚠️ AS AMOSTRAS SÃO POSIÇÕES DE ROLAGEM, NÃO INSTANTES DO VÍDEO. A primeira
   versão pausava o vídeo e o levava a `currentTime` declarado; as oito amostras
   voltaram todas como `0`, e não por falha de `seeked`: o vídeo do hero é DIRIGIDO
   PELA ROLAGEM (`VideoScrubber`, `progress`), então quem manda em `currentTime` é
   `scrollYProgress` — a cada quadro ele reescreve o valor procurado de volta para
   o que a rolagem diz. Em `scrollY: 0` o quadro é sempre o mesmo, e medir só ali
   seria medir um oitavo do problema: o bloco fica em `opacity: 1` até 0.52, e
   nesse trecho o vídeo percorre metade de si mesmo por baixo dele.
   Então rolar aqui não é remexer numa cena assentada — é o único jeito de trocar
   o quadro. Cada posição é um ponto de repouso próprio: a página é solta, espera,
   e SÓ ENTÃO é lida. Posições em que a manchete já esteja saindo são descartadas
   pelo teste de opacidade (`>= 0.98`), porque ali o alfa da tinta cai e o piso
   deixa de valer. */
const ROLAGENS = [0, 150, 300, 450, 600, 750, 900, 1050, 1200];
/* Cobertura mínima para o pixel contar como CORPO da letra, e não franja. */
const CORPO = 0.85;
/* SIS-186 — "miúdo": abaixo deste corpo o pior pixel SOZINHO não é veredito.
   16px é o corte pedido pela issue (11px reprovou falso, título passou) e é o
   degrau da própria tabela de pisos — abaixo dele nenhum peso salva do 4,5:1.
   ⚠️ MAS A MEDIÇÃO NÃO CONFIRMOU O TAMANHO COMO CAUSA, e isso está no relatório
   da issue. O que separa os dois números é o FUNDO VARIÁVEL, não o corpo: em 1024
   (coluna branca chapada) `piorTudo` e `piorCorpo` deram IGUAIS nos sete alvos,
   de 14,72px a 32px — Δ = 0 inclusive no texto miúdo. Em 390 (vídeo por baixo) Δ
   apareceu em TODOS os tamanhos, inclusive no título de 30,4px (11,32 contra
   6,63). Então `miudo` é gatilho de RELATÓRIO, prescrito pela issue; quem
   discrimina é a cobertura do pixel. */
const MIUDO = 16;
/* Δ acima do qual a diferença entre os dois números deixa de ser arredondamento e
   passa a ser artefato. Metade de um passo de piso (4,5 → 3,0) é 0,75; 1,0 é a
   folga acima disso. Abaixo de 1,0 os dois números contam a mesma história. */
const DELTA_ARTEFATO = 1.0;

const lin = (c) => {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};
const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const razao = (a, b) => {
  const [x, y] = [lum(a), lum(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};
/* fg × α + fundo × (1 − α). */
const compor = (fg, a, bg) =>
  fg.map((c, i) => Math.round(c * a + bg[i] * (1 - a)));

const ALVOS = {
  "titulo-chapado": ".hero-pitch .hero-caption-title",
  "titulo-realce": ".hero-pitch-realce",
  apoio: ".hero-pitch .hero-caption-lead",
  "pilar-1": ".hero-pitch-pilar:nth-child(1) .hero-pitch-pilar-nome",
  "pilar-2": ".hero-pitch-pilar:nth-child(2) .hero-pitch-pilar-nome",
  "pilar-3": ".hero-pitch-pilar:nth-child(3) .hero-pitch-pilar-nome",
  "pilar-4": ".hero-pitch-pilar:nth-child(4) .hero-pitch-pilar-nome",
};

/** No navegador: tinta efetiva, alfa acumulado, corpo e rects de linha. */
const LEVANTAR = (_raiz, alvos) => {
  const corDe = (bruto) => bruto.match(/-?[\d.]+/g).map(Number);
  const fora = {};
  for (const [id, seletor] of Object.entries(alvos)) {
    const e = document.querySelector(seletor);
    if (!e) {
      fora[id] = null;
      continue;
    }
    const c = getComputedStyle(e);
    const clipText =
      c.webkitBackgroundClip === "text" || c.backgroundClip === "text";
    const n = corDe(c.webkitTextFillColor || c.color);
    /* Ver o vício nº 3 no cabeçalho: com degrade o alfa NÃO sai do
       `-webkit-text-fill-color`, que é `transparent` por exigência do efeito. */
    let alfa = clipText ? 1 : n.length > 3 ? n[3] : 1;
    for (let p = e; p; p = p.parentElement) {
      const o = Number(getComputedStyle(p).opacity);
      if (!Number.isNaN(o)) alfa *= o;
    }
    /* Cada parada do degrade é uma tinta candidata; vale a PIOR. No realce a mais
       fraca é a DO MEIO (`#1885ce`), não uma das pontas. */
    const paradas = clipText
      ? [...c.backgroundImage.matchAll(/rgba?\(([^)]+)\)/g)].map((m) =>
          m[1]
            .split(",")
            .slice(0, 3)
            .map((v) => Number(v.trim())),
        )
      : [];
    const r = document.createRange();
    r.selectNodeContents(e);
    const caixas = [...r.getClientRects()]
      .filter((b) => b.width > 0 && b.height > 0)
      .map((b) => ({
        x: Math.floor(b.left),
        y: Math.floor(b.top),
        w: Math.ceil(b.width) + 1,
        h: Math.ceil(b.height) + 1,
      }));
    fora[id] = caixas.length
      ? {
          tinta: n.slice(0, 3),
          tintas: paradas.length ? paradas : [n.slice(0, 3)],
          degrade: clipText ? c.backgroundImage : undefined,
          sombra: c.textShadow === "none" ? undefined : c.textShadow,
          alfa: Math.round(alfa * 1000) / 1000,
          px: Math.round(parseFloat(c.fontSize) * 100) / 100,
          peso: c.fontWeight,
          caixas,
        }
      : null;
  }
  return fora;
};

/** No navegador: apaga a tinta de tudo dentro da raiz. */
const APAGAR = (raiz) => {
  for (const f of [raiz, ...raiz.querySelectorAll("*")]) {
    const a = getComputedStyle(f);
    /* Com `background-clip: text` a tinta É o degrade: apagar `color` não apaga
       nada, só revela o degrade. Ele sai junto. */
    if (a.webkitBackgroundClip === "text" || a.backgroundClip === "text")
      f.style.setProperty("background-image", "none", "important");
    f.style.setProperty("color", "transparent", "important");
    f.style.setProperty("-webkit-text-fill-color", "transparent", "important");
    f.style.setProperty("fill", "transparent", "important");
    /* O `text-shadow` FICA, e é isso que se quer: ele é pintado a partir da
       geometria do glifo, com cor própria, e no regime C é ele o fundo imediato
       da letra branca. Apagá-lo faria a sonda medir um fundo que ninguém vê. */
  }
  /* Confirma que ninguém sobreviveu: um único glifo que resista à apagadela
     reaparece no relatório como "fundo" escuro — foi assim que em 1440 o realce
     reprovou lendo um `o` do próprio título. */
  const teimosos = [...raiz.querySelectorAll("*")].filter((f) => {
    const a = getComputedStyle(f);
    return (
      (a.webkitTextFillColor || a.color).replace(/\s/g, "") !==
      "rgba(0,0,0,0)"
    );
  }).length;
  return teimosos;
};

/**
 * Espera o fundo PARAR de mudar antes de ler.
 *
 * ⚠️ ISTO NÃO É FOLGA DE CONFORTO, É CORREÇÃO DE UM FALSO NEGATIVO OBSERVADO. Com
 * as duas abas abertas ao mesmo tempo (e três larguras em sequência), a primeira
 * largura medida chegou a ser lida ANTES de a camada do vídeo assentar: a base
 * navy da cena ainda cobria a largura inteira, a máscara que abre a coluna clara
 * ainda não tinha efeito, e a aba apagada devolveu `[3, 45, 99]` como "fundo" da
 * coluna branca. Sete alvos reprovaram em 1,18–2,11 num arranjo que passa em
 * 16,01 quando assentado. Tempo fixo não resolve — o que resolve é olhar.
 *
 * O critério é o único que serve para os dois regimes: dois quadros consecutivos
 * IGUAIS na faixa lida. Em regime A isso é o assentamento da cena; em regime C é
 * o vídeo parado na posição de rolagem (ele é dirigido pela rolagem, então em
 * repouso o quadro é fixo — ver a nota de `ROLAGENS`). Devolve `false` se não
 * assentou, e aí a posição é descartada em vez de virar número.
 */
const estabilizar = async (pagina, tentativas = 14) => {
  const { width } = pagina.viewportSize();
  const recorte = { x: 0, y: 0, width: Math.min(900, width), height: ALTURA };
  let anterior = null;
  for (let i = 0; i < tentativas; i += 1) {
    const agora = await pagina.screenshot({ clip: recorte });
    if (anterior && anterior.equals(agora)) return true;
    anterior = agora;
    await new Promise((res) => setTimeout(res, 400));
  }
  return false;
};

const preparar = async (navegador, largura, apagar) => {
  const pagina = await navegador.newPage({
    viewport: { width: largura, height: ALTURA },
  });
  /* `domcontentloaded`, e NÃO `networkidle`: a home nunca fica com a rede ociosa
     — o vídeo do hero é servido em fatias enquanto toca, e `networkidle` estourou
     os 30s nas três larguras. */
  await pagina.goto(BASE, { waitUntil: "domcontentloaded" });
  /* O cabeçalho fixo passa POR CIMA do topo da cena e entraria no recorte do
     título como fundo alheio. Os avisos do `next dev` saem pelo mesmo motivo. */
  await pagina.addStyleTag({
    content:
      /* `nav.fixed` é a trilha do ScrollSpy, à esquerda. Ela sai pelo MESMO motivo
         do cabeçalho — é moldura fixa, não a cena —, e sai porque a primeira
         rodada reprovou o realce em 1440 lendo como "fundo" o `o` final do rótulo
         "Início": a trilha ocupa x=12..104 e a coluna do hero começa em x=86, e o
         que a sonda apanhou foi essa sobreposição de ~6px.
         ⚠️ A sobreposição é REAL e ANTERIOR a esta issue (as legendas antigas
         nasciam no mesmo x=86, é o recuo de `.hero-captions`), e está relatada no
         comentário da SIS-192 para virar issue própria. Aqui ela é escondida
         porque é outro assunto: rótulo de 11px de uma barra fixa, não a manchete. */
      "header.fixed,nav.fixed{display:none!important}" +
      "nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button],[class*=motion-banner],[class*=motion-dialog]{display:none!important}",
  });
  /* NENHUMA ROLAGEM. O bloco não tem entrada: em `scrollY: 0` ele já está em
     `opacity: 1` — é a decisão da issue (manchete acima da dobra). Rolar seria
     medir a SAÍDA dele, cujo destino é `opacity: 0`. */
  await new Promise((res) => setTimeout(res, 3000));
  const medidos = await pagina
    .locator(".hero-pitch")
    .first()
    .evaluate(LEVANTAR, ALVOS);
  let teimosos = 0;
  if (apagar)
    teimosos = await pagina.locator(".hero-pitch").first().evaluate(APAGAR);
  return { pagina, medidos, teimosos };
};

const navegador = await chromium.launch();
const saida = {};

for (const largura of LARGURAS) {
  const comTinta = await preparar(navegador, largura, false);
  const semTinta = await preparar(navegador, largura, true);
  const medidos = comTinta.medidos;

  const acumulado = {};
  for (const id of Object.keys(ALVOS)) acumulado[id] = null;
  const lidas = [];
  const puladas = [];

  for (const y of ROLAGENS) {
    /* As duas abas na MESMA posição: sem isto a diferença A−B mistura dois quadros
       do vídeo e a máscara vira ruído. `lenis` faz rolagem suavizada, então não
       basta pedir — tem de esperar assentar, e é o que os 1200ms fazem. */
    for (const { pagina } of [comTinta, semTinta]) {
      await pagina.evaluate((alvo) => window.scrollTo(0, alvo), y);
      await new Promise((res) => setTimeout(res, 1200));
    }
    const assentadas = [];
    for (const { pagina } of [comTinta, semTinta])
      assentadas.push(await estabilizar(pagina));
    if (assentadas.some((ok) => !ok)) {
      puladas.push({ y, motivo: "cena não assentou — quadro ainda mudando" });
      continue;
    }
    const estado = await comTinta.pagina.evaluate(() => ({
      y: Math.round(window.scrollY),
      opacidade: Number(
        getComputedStyle(document.querySelector(".hero-pitch .hero-caption"))
          .opacity,
      ),
    }));
    /* Abaixo de 0.98 a manchete já está saindo: o alfa da tinta caiu e o piso não
       se aplica mais àquele quadro. Descartar é o certo — o que a issue pede é o
       contraste do bloco LEGÍVEL, e a saída é uma dissolução deliberada. */
    if (estado.opacidade < 0.98) {
      puladas.push({ ...estado, motivo: "manchete já saindo" });
      continue;
    }
    /* Os retângulos são REMEDIDOS a cada posição: a cena se move com a rolagem, e
       usar a geometria de `scrollY: 0` para ler um quadro de `scrollY: 900`
       mediria o vídeo ao lado das letras. A geometria não depende da tinta, então
       vale para as duas abas. */
    const geometria = await comTinta.pagina
      .locator(".hero-pitch")
      .first()
      .evaluate(LEVANTAR, ALVOS);
    for (const [id, g] of Object.entries(geometria))
      if (g && medidos[id]) medidos[id].caixas = g.caixas;
    lidas.push(estado);

    const [a, b] = await Promise.all([
      comTinta.pagina.screenshot(),
      semTinta.pagina.screenshot(),
    ]);
    const [A, B] = await Promise.all(
      [a, b].map((buf) =>
        sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true }),
      ),
    );

    for (const [id, m] of Object.entries(medidos)) {
      if (!m) continue;
      for (const { x, y, w, h } of m.caixas) {
        const x1 = Math.min(x + w, A.info.width);
        const y1 = Math.min(y + h, A.info.height);
        for (let py = Math.max(0, y); py < y1; py += 1) {
          for (let px = Math.max(0, x); px < x1; px += 1) {
            const i = (py * A.info.width + px) * A.info.channels;
            const comA = [A.data[i], A.data[i + 1], A.data[i + 2]];
            const bg = [B.data[i], B.data[i + 1], B.data[i + 2]];
            const mudou =
              Math.abs(comA[0] - bg[0]) +
              Math.abs(comA[1] - bg[1]) +
              Math.abs(comA[2] - bg[2]);
            if (mudou < 12) continue; // não é letra: vão, sobra ou fundo parado
            for (const tinta of m.tintas) {
              /* Cobertura: quanto do pixel a letra ocupa. `|A − B|` sobre a
                 distância entre a tinta cheia e o fundo. */
              const cheio =
                Math.abs(tinta[0] - bg[0]) +
                Math.abs(tinta[1] - bg[1]) +
                Math.abs(tinta[2] - bg[2]);
              const cobertura = cheio > 0 ? Math.min(1, mudou / cheio) : 1;
              const r = razao(compor(tinta, m.alfa, bg), bg);
              const reg = acumulado[id] ?? {
                piorTudo: null,
                piorCorpo: null,
                pixels: 0,
                pixelsCorpo: 0,
              };
              reg.pixels += 1;
              /* SIS-186 — CAMINHO MEDIDO E DESCARTADO, registrado para não ser
                 tentado de novo: a "perna raster" com a cor que o compositor
                 pintou, `razao(comA, bg)`. Parece o número honesto e é degenerado.
                 A máscara inclui pixels de cobertura 0,02–0,04, que são fundo com
                 um sopro de tinta; ali a razão contra o próprio fundo tende a 1, e
                 o pior de todos saturou em **1,00** nos sete alvos em 390 e em
                 **1,04** nos sete em 1024 — o mesmo valor para texto de 14,72px e
                 para título de 32px, isto é, sem poder de discriminação nenhum.
                 A perna raster do par é `piorTudo` (abaixo): pior pixel do recorte
                 COM a franja dentro, que é o veredito clássico. */
              const cand = {
                razao: Math.round(r * 100) / 100,
                fundo: bg,
                tintaPior: tinta,
                cobertura: Math.round(cobertura * 100) / 100,
                em: { x: px, y: py, rolagem: estado.y },
              };
              if (reg.piorTudo === null || r < reg.piorTudo.razao)
                reg.piorTudo = cand;
              if (cobertura >= CORPO) {
                reg.pixelsCorpo += 1;
                if (reg.piorCorpo === null || r < reg.piorCorpo.razao)
                  reg.piorCorpo = cand;
              }
              acumulado[id] = reg;
            }
          }
        }
      }
    }
  }

  saida[largura] = {
    "#regime":
      largura >= 1024
        ? "A — tinta escura na coluna branca"
        : "C — tinta clara sobre o vídeo",
    "#rolagens": lidas,
    "#roladasPuladas": puladas,
    /* > 0 invalida a passagem: ver a nota em `APAGAR`. */
    "#tintaTeimosa": semTinta.teimosos,
  };
  for (const [id, m] of Object.entries(medidos)) {
    if (!m) {
      saida[largura][id] = null;
      continue;
    }
    const reg = acumulado[id];
    const grande = m.px >= 24 || (m.px >= 18.66 && Number(m.peso) >= 700);
    const piso = grande ? 3 : 4.5;
    /* Máscara vazia não é reprovação de contraste, é alvo fora do quadro ou tinta
       que não mudou: dizer qual dos dois vale mais do que um `undefined`. */
    const miudo = m.px < MIUDO;
    if (!reg || reg.piorCorpo === null) {
      /* SIS-186 — "nenhum pixel de corpo" em texto miúdo é o artefato em pessoa, e
         não um veredito: significa que o glifo é fino demais para cobrir um pixel
         inteiro, exatamente o caso que o método manda NÃO condenar pelo raster.
         Então aqui sai `artefato-aa` com o número da franja à vista, para quem lê o
         relatório resolver pelo cálculo sobre as cores declaradas. Em texto grande
         a mesma situação continua sendo falha da sonda (máscara vazia). */
      saida[largura][id] = {
        ...m,
        piso,
        razao: null,
        rasterPior: reg?.piorTudo?.razao ?? null,
        motivo: reg
          ? "nenhum pixel de corpo — só franja de antialiasing no recorte"
          : "máscara vazia — alvo fora da janela ou tinta não apagada",
        miudo,
        veredito: reg && miudo ? "artefato-aa" : "indeterminado",
        passa: false,
      };
      continue;
    }
    /* O PAR, e o Δ entre as duas pernas. `razao` (calculada, corpo da letra) é
       quem decide; `rasterPior` fica ao lado. Δ grande em texto miúdo é assinatura
       de franja de antialiasing — não de contraste ruim. */
    const rasterPior = reg.piorTudo?.razao ?? null;
    const delta =
      rasterPior === null
        ? null
        : Math.round((reg.piorCorpo.razao - rasterPior) * 100) / 100;
    const passa = reg.piorCorpo.razao >= piso;
    /* O raster sozinho condenaria: é ele que a issue proíbe usar como veredito. */
    const rasterCondenaria =
      passa &&
      rasterPior !== null &&
      rasterPior < piso &&
      delta > DELTA_ARTEFATO;
    saida[largura][id] = {
      ...m,
      piso,
      razao: reg.piorCorpo.razao,
      rasterPior,
      delta,
      miudo,
      /* Quatro valores, e a ordem importa. `artefato-aa` NÃO é reprovação
         suavizada — é o caso em que o cálculo passa, só o raster condena, e o
         texto é miúdo o bastante para que o raster esteja medindo franja.
         `raster-condenaria` é o MESMO desencontro em texto grande: não é o
         artefato que a issue nomeia, mas esconder isso apagaria justamente a
         medição que mostrou que o tamanho não é a causa. Se o cálculo reprova,
         reprova, e nenhum tamanho salva. */
      veredito: !passa
        ? "reprovado"
        : rasterCondenaria
          ? miudo
            ? "artefato-aa"
            : "raster-condenaria"
          : "aprovado",
      piorCorpo: reg.piorCorpo,
      piorTudo: reg.piorTudo,
      pixels: reg.pixels,
      pixelsCorpo: reg.pixelsCorpo,
      passa,
    };
  }
  await comTinta.pagina.close();
  await semTinta.pagina.close();
}

await navegador.close();
console.log(JSON.stringify(saida, null, 2));
