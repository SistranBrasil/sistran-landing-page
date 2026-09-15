/**
 * SIS-243 — prova, no navegador, que o vídeo do hero da home só existe DEPOIS
 * que o `RouteLoadGate` sai da tela.
 *
 * São duas afirmações independentes, e cada uma pode falhar sozinha:
 *
 *   1. NADA DE PLAY antes da liberação — enquanto houver `[data-route-loading]`
 *      no DOM, `currentTime` tem de ser 0 e `paused` tem de ser `true`.
 *   2. NADA DE REDE antes da liberação — o pedido de `hero-scroll-v2.mp4` não
 *      pode partir antes do instante em que o overlay sai. O que se vê na
 *      abertura é o pôster, e só.
 *
 * Um relógio só: o `performance.now()` da própria página (0 = início da
 * navegação). Os instantes de rede vêm do `PerformanceResourceTiming` dela, e
 * não do processo de teste — comparar "quando o overlay saiu" com "quando o MP4
 * foi pedido" em relógios diferentes erra por dezenas de ms, que é a mesma ordem
 * de grandeza da resposta.
 *
 * A amostragem roda DENTRO da página, num `setInterval` de 40ms instalado por
 * `addInitScript`: `page.evaluate` a cada 40ms não sobreviveria à navegação
 * suave e custaria mais do que mede.
 *
 * Sete cenas, uma por caminho que a issue nomeia:
 *
 *   1. carga dura, primeira visita   com a abertura opcional (`data-intro`)
 *   2. carga dura, segunda visita    sem a abertura — o portão puro, e a Fase B
 *   3. navegação suave               /quem-somos -> logo -> /
 *   4. reduce do sistema             sem autoplay, mas o vídeo carrega
 *   5. reduce do botão da interface  idem, pela outra chave
 *   6. aberta no meio (#contato)     sem entrada e sem puxão para o topo
 *   7. portão no timeout             mídia crítica que nunca resolve: o vídeo
 *                                    tem de ser liberado mesmo assim
 *
 * Com o site no ar (`npm run build && npm run start -- -p 3999`):
 *   node scripts/medir-portao-hero-sis243.mjs
 */
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const BASE = process.env.BASE_URL ?? 'http://localhost:3999';
const SAIDA = 'docs/medidas/portao-hero-sis243';
const MP4 = 'hero-scroll-v2.mp4';
const POSTER = 'hero-scroll-v2-poster.webp';

/* Instalada antes de qualquer script da página. O array cresce ~25 amostras por
   segundo e é lido uma vez, no fim da cena. */
const SONDA = () => {
  const estado = { amostras: [], marcos: {} };
  window.__sis243 = estado;
  const ler = () => {
    /* `addInitScript` roda antes de existir `<html>`: sem esta saída a primeira
       leitura estoura e o `setInterval` abaixo nunca chega a ser registrado. */
    if (!document.documentElement) return;
    const v = document.querySelector('.hero-video');
    const conteudo = document.querySelector('[data-route-content]');
    estado.amostras.push({
      ms: Math.round(performance.now()),
      overlay: Boolean(document.querySelector('[data-route-loading]')),
      intro: document.documentElement.hasAttribute('data-intro'),
      liberado: conteudo ? conteudo.getAttribute('data-route-liberado') : null,
      src: v ? v.getAttribute('src') : 'sem-video',
      adiado: v ? v.hasAttribute('data-video-adiado') : null,
      ct: v ? Number(v.currentTime.toFixed(2)) : null,
      pausado: v ? v.paused : null,
      y: Math.round(window.scrollY),
    });
  };
  setInterval(ler, 40);
  ler();
};

/* Cena 7: o pedido do PÔSTER fica pendurado para sempre. É o jeito honesto de
   levar o portão ao teto de 10s: o pôster é a mídia crítica que ele espera do
   hero (`waitForVideo` carrega a imagem do `poster`), e pendurar é diferente de
   falhar — falha ele já trata (`error` resolve na hora).
   Injetar um nó novo marcado como crítico não serve: o React 19 remove da área
   hidratada qualquer filho que não esteja na árvore dele, e o nó sumia antes de
   o portão varrer o DOM (medido: a cena liberava em 1,9s). */

/* Sem estas três chaves o Chromium estrangula `setInterval` a ~1 Hz nas abas que
   ele considera de fundo — e headless considera quase todas. Medido: a mesma
   cena caía de ~25 amostras por segundo para 1,3. */
const navegador = await chromium.launch({
  args: [
    '--disable-background-timer-throttling',
    '--disable-backgrounding-occluded-windows',
    '--disable-renderer-backgrounding',
  ],
});
await mkdir(SAIDA, { recursive: true });

/* O portão liberado é `[data-route-liberado="true"]`, e NUNCA "o overlay não
   está no DOM": antes de o HTML ser analisado o overlay também não está lá, e
   esperar por ausência devolve na hora — foi o que fez a cena do timeout passar
   em 107ms na primeira rodada. */
const esperarLiberacao = (pagina, timeout = 25_000) =>
  pagina.waitForSelector('[data-route-content][data-route-liberado="true"]', { timeout });

async function abrirContexto({ reduzido = false, atributo = false, semIntro = false, pendurarPoster = false } = {}) {
  const contexto = await navegador.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: reduzido ? 'reduce' : 'no-preference',
  });
  await contexto.addInitScript(SONDA);
  if (atributo) {
    await contexto.addInitScript(() => {
      localStorage.setItem('sistran-motion-preference', 'reduce');
    });
  }
  if (semIntro) {
    /* A abertura opcional é uma vez por sessão. Marcá-la como vista isola o
       portão da rota, que é o assunto desta issue. */
    await contexto.addInitScript(() => {
      sessionStorage.setItem('sistran:intro-visto', '1');
    });
  }
  const pagina = await contexto.newPage();
  if (pendurarPoster) await pagina.route(`**/${POSTER}`, () => {});

  const rede = [];
  pagina.on('request', (r) => rede.push({ url: r.url(), epoca: Date.now() }));
  return { contexto, pagina, rede };
}

/**
 * Traz os pedidos de rede para o relógio das amostras.
 *
 * A origem é medida DENTRO da página (`Date.now() - performance.now()`) e não
 * por `performance.timeOrigin`: o segundo vem de um relógio monotônico com
 * alinhamento próprio e dava até 84ms de desvio contra o `Date.now()` do
 * processo de teste — mais do que a resposta que se procura aqui.
 *
 * E os pedidos vêm do evento do Playwright, não do `PerformanceResourceTiming`
 * da página: fetch de elemento de mídia só vira entrada de recurso quando
 * termina (e às vezes nem isso), então o MP4 aparecia `null` em quatro das sete
 * cenas mesmo tendo sido pedido e tocado.
 */
async function consolidar(pagina, rede) {
  const { amostras, marcos, origem } = await pagina.evaluate(() => ({
    amostras: window.__sis243.amostras,
    marcos: window.__sis243.marcos,
    origem: Date.now() - performance.now(),
  }));
  const quando = (parte) => {
    const achado = rede.find((r) => r.url.includes(parte));
    return achado ? Math.round(achado.epoca - origem) : null;
  };
  return { amostras, marcos, mp4Ms: quando(MP4), posterMs: quando(POSTER) };
}

function analisar(nome, { amostras, marcos, mp4Ms, posterMs }) {
  /* "Portão de pé" = o conteúdo já existe no DOM E ainda não foi liberado. A
     primeira metade importa: amostras tiradas antes de o HTML ser analisado não
     dizem nada sobre o portão. */
  const comPortao = amostras.filter((a) => a.liberado === 'false');
  /* Depois do ÚLTIMO instante com o portão de pé: na navegação suave as
     primeiras amostras ainda são do ciclo da rota anterior, que já estava
     liberado — pegar a primeira `true` daria a liberação da página de onde se
     veio. */
  const ultimoDePeMs = comPortao.at(-1)?.ms ?? -1;
  const liberadoMs = amostras.find((a) => a.liberado === 'true' && a.ms > ultimoDePeMs)?.ms ?? null;

  /* Violações: cada uma é um critério de aceite que caiu. */
  const srcAntes = comPortao.filter((a) => a.src && a.src !== 'sem-video');
  const tocandoAntes = comPortao.filter((a) => a.pausado === false || (a.ct ?? 0) > 0);
  /* A comparação honesta é contra a ÚLTIMA amostra em que o portão ainda estava
     de pé, e não contra a primeira em que ele já não estava: entre as duas há
     até 40ms de grade de amostragem, e o `src` é escrito no mesmo commit da
     liberação. O que se afirma é "nenhum byte de MP4 foi pedido enquanto o
     portão era visível", que é o critério da issue. */
  const redeAntes = mp4Ms != null && mp4Ms < ultimoDePeMs;

  const ctMax = Math.max(0, ...amostras.map((a) => a.ct ?? 0));
  const yMax = Math.max(0, ...amostras.map((a) => a.y));
  const tocou = amostras.some((a) => a.pausado === false);

  return {
    cena: nome,
    amostras: amostras.length,
    portaoLiberouMs: liberadoMs,
    overlaySaiuDoDomMs: amostras.find((a) => a.ms > ultimoDePeMs && !a.overlay)?.ms ?? null,
    introAteMs: amostras.filter((a) => a.intro).at(-1)?.ms ?? null,
    posterPedidoMs: posterMs,
    mp4PedidoMs: mp4Ms,
    ultimaAmostraComPortaoMs: ultimoDePeMs === -1 ? null : ultimoDePeMs,
    mp4DepoisDoPortaoMs: mp4Ms != null && ultimoDePeMs !== -1 ? mp4Ms - ultimoDePeMs : null,
    srcApareceuMs: amostras.find((a) => a.ms > ultimoDePeMs && a.src && a.src !== 'sem-video')?.ms ?? null,
    tocou,
    ctMax,
    ctFinal: amostras.at(-1)?.ct ?? null,
    yMax,
    yFinal: amostras.at(-1)?.y ?? null,
    marcos,
    violacoes: {
      srcComPortaoDePe: srcAntes.length,
      playComPortaoDePe: tocandoAntes.length,
      mp4PedidoComPortaoDePe: redeAntes,
    },
    /* A linha do tempo vai para o JSON (não para o console): é o que permite
       reconstruir a cena sem rodar de novo. Guardada RALEADA — toda amostra em
       que algo mudou de estado, mais uma a cada cinco para dar o ritmo de
       `currentTime` e da rolagem. Inteira, são 300 KB de arquivo por rodada
       para descrever sete aberturas. */
    linhaDoTempo: amostras.filter((a, i, todas) => {
      const anterior = todas[i - 1];
      if (!anterior) return true;
      const mudou =
        a.liberado !== anterior.liberado ||
        a.overlay !== anterior.overlay ||
        a.intro !== anterior.intro ||
        a.pausado !== anterior.pausado ||
        Boolean(a.src) !== Boolean(anterior.src);
      return mudou || i % 5 === 0;
    }),
  };
}

const relatorio = [];

/* ── 1. Carga dura, primeira visita (com a abertura opcional) ───────────── */
{
  const { contexto, pagina, rede } = await abrirContexto();
  await pagina.goto(BASE, { waitUntil: 'commit' });
  await pagina.waitForTimeout(900);
  await pagina.screenshot({ path: `${SAIDA}/1-overlay.png` });
  await esperarLiberacao(pagina);
  await pagina.screenshot({ path: `${SAIDA}/2-reveal.png` });
  await pagina.waitForTimeout(3000);
  await pagina.screenshot({ path: `${SAIDA}/3-video-andando.png` });
  relatorio.push(analisar('1 · carga dura, 1a visita (com intro)', await consolidar(pagina, rede)));
  await contexto.close();
}

/* ── 2. Carga dura, segunda visita: o portão puro, e a Fase B depois ──────── */
{
  const { contexto, pagina, rede } = await abrirContexto({ semIntro: true });
  await pagina.goto(BASE, { waitUntil: 'commit' });
  await esperarLiberacao(pagina);
  await pagina.waitForTimeout(2500);

  /* Gesto encerra a Fase A; daqui em diante quem escreve `currentTime` é a
     rolagem — é o ponto 5 da issue ("scrub da Fase B intacto").
     Tudo por RODA, nunca por `window.scrollTo`: o Lenis guarda a própria
     posição e desfaz um scroll feito por fora (está escrito no `HeroCinematic`),
     então `scrollTo` mediria o Lenis, não a raspagem. */
  const ler = () =>
    pagina.evaluate(() => {
      const v = document.querySelector('.hero-video');
      return { ct: Number(v.currentTime.toFixed(2)), pausado: v.paused, y: Math.round(window.scrollY) };
    });
  const rodar = async (passos, delta) => {
    await pagina.mouse.move(720, 450);
    for (let i = 0; i < passos; i += 1) {
      await pagina.mouse.wheel(0, delta);
      await pagina.waitForTimeout(120);
    }
    await pagina.waitForTimeout(900);
    return ler();
  };
  const aposGesto = await rodar(1, 240);
  const rolandoParaBaixo = await rodar(8, 200);
  const rebobinado = await rodar(14, -250);

  const linha = analisar('2 · carga dura, 2a visita (sem intro)', await consolidar(pagina, rede));
  linha.faseB = { aposGesto, rolandoParaBaixo, rebobinado };
  relatorio.push(linha);
  await contexto.close();
}

/* ── 3. Navegação suave: /quem-somos -> clique no logo -> / ───────────────── */
{
  const { contexto, pagina, rede } = await abrirContexto({ semIntro: true });
  await pagina.goto(`${BASE}/quem-somos`, { waitUntil: 'commit' });
  await esperarLiberacao(pagina);
  await pagina.waitForTimeout(600);
  /* A sonda continua a mesma (é o mesmo documento): o marco separa o que é
     antes e o que é depois da navegação, e as amostras da rota anterior saem
     da conta. */
  await pagina.evaluate(() => {
    window.__sis243.marcos.navMs = Math.round(performance.now());
    window.__sis243.amostras.length = 0;
  });
  await pagina.click('a[aria-label="Sistran, ir para a página inicial"]');
  await pagina.waitForSelector('.hero-video', { timeout: 20_000 });
  await esperarLiberacao(pagina);
  await pagina.screenshot({ path: `${SAIDA}/4-soft-nav-reveal.png` });
  await pagina.waitForTimeout(3000);
  relatorio.push(analisar('3 · navegacao suave /quem-somos -> /', await consolidar(pagina, rede)));
  await contexto.close();
}

/* ── 4 a 6: as duas chaves de reduce e a abertura no meio da página ───────── */
for (const cena of [
  { nome: '4 · reduce do sistema', opcoes: { reduzido: true, semIntro: true }, ancora: '' },
  { nome: '5 · reduce do botao (data-motion)', opcoes: { atributo: true, semIntro: true }, ancora: '' },
  { nome: '6 · aberta no meio (#contato)', opcoes: { semIntro: true }, ancora: '#contato' },
]) {
  const { contexto, pagina, rede } = await abrirContexto(cena.opcoes);
  await pagina.goto(BASE + cena.ancora, { waitUntil: 'commit' });
  await esperarLiberacao(pagina);
  await pagina.waitForTimeout(3500);
  relatorio.push(analisar(cena.nome, await consolidar(pagina, rede)));
  await contexto.close();
}

/* ── 7. Portão no timeout: mídia crítica que nunca resolve ────────────────── */
{
  const { contexto, pagina, rede } = await abrirContexto({ semIntro: true, pendurarPoster: true });
  await pagina.goto(BASE, { waitUntil: 'commit' });
  await esperarLiberacao(pagina);
  await pagina.waitForTimeout(2500);
  relatorio.push(analisar('7 · portao no timeout (10s)', await consolidar(pagina, rede)));
  await contexto.close();
}

await navegador.close();

for (const r of relatorio) {
  console.log(`\n── ${r.cena} ──`);
  for (const [k, v] of Object.entries(r)) {
    if (k !== 'cena' && k !== 'linhaDoTempo') console.log(`  ${k.padEnd(24)}`, JSON.stringify(v));
  }
}

await writeFile(`${SAIDA}/medicao.json`, `${JSON.stringify(relatorio, null, 2)}\n`);
console.log(`\nJSON e imagens em ${SAIDA}/`);
