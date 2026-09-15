/**
 * SIS-260 — a malha de quadradinhos atrás dos sete cartões de `/contato`.
 *
 * Os três itens da issue são afirmações sobre PIXEL, e nenhum deles se confere de
 * olho — a malha pedida é discreta de propósito (linha em 8% de alfa vezes 32% de
 * opacidade, ~2,5% de tinta), então uma captura "parece" idêntica com e sem ela. A
 * sonda mede por DIFERENÇA: fotografa a faixa com a malha e outra vez com o
 * `::before` desligado, e trabalha sobre o mapa dos pixels que mudaram.
 *
 * O que cada item vira aqui:
 *   1. «malha grade-fina (mesmos tokens/receita da home)» — dois números:
 *      · a receita computada do `::before` tem de ser os DOIS
 *        `repeating-linear-gradient` e não os `linear-gradient` da malha técnica;
 *      · o PERÍODO medido em pixels, contado como distância entre as colunas que
 *        mudaram no mapa de diferença. O alvo é `--grade-fina-modulo` (64px) lido da
 *        própria página, não um 64 digitado aqui. Isto é o que pega o defeito sutil
 *        de um `background-size` herdado recortando o padrão.
 *   2. «fique ATRÁS dos cartões, sem atrapalhar leitura» — também por diferença:
 *      dentro do retângulo de cada um dos sete cartões o número de pixels alterados
 *      tem de ser ZERO (superfície opaca `#1273bc`), e fora deles maior que zero.
 *      Um `z-index` computado não prova isto; o pixel prova. E o contraste das três
 *      tintas é remedido pelo método da casa
 *      (`docs/medidas/COMO-MEDIR-CONTRASTE.md`), porque "não atrapalhar a leitura"
 *      é um piso, não uma impressão.
 *   3. «não haver DUAS grades sobrepostas» — conta-se quantas camadas de grade a
 *      faixa pinta: a receita do `::before` (uma), a do `::after` (que é o
 *      pontilhado da SIS-93, e tem de continuar sendo pontilhado) e qualquer
 *      descendente com `repeating-linear-gradient`/`background-size` de módulo.
 *      O alvo é UMA.
 *
 * Rodar com o dev de pé:  node scripts/medir-grade-sis260.mjs
 */
import { chromium } from 'playwright';
import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'node:fs';

const BASE = process.env.BASE ?? 'http://localhost:3000';
const VIEWPORTS = [
  { w: 1440, h: 900 },
  { w: 390, h: 844 },
];
const SEM_MALHA = '.contato-indicadores.section-light::before{display:none!important}';
const LIMPEZA = `nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button]{display:none!important}
  header.fixed{display:none!important}`;

const luminancia = ({ r, g, b }) => {
  const c = [r, g, b]
    .map((v) => v / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const razao = (a, b) => {
  const [x, y] = [luminancia(a) + 0.05, luminancia(b) + 0.05].sort((p, q) => q - p);
  return x / y;
};
const compor = (tinta, fundo) => ({
  r: tinta.r * tinta.a + fundo.r * (1 - tinta.a),
  g: tinta.g * tinta.a + fundo.g * (1 - tinta.a),
  b: tinta.b * tinta.a + fundo.b * (1 - tinta.a),
});
const lerTinta = (css) => {
  const n = css.match(/[\d.]+/g).map(Number);
  return { r: n[0], g: n[1], b: n[2], a: n[3] ?? 1 };
};

/* Mesmas duas armadilhas medidas na sonda da SIS-256, e pelas mesmas razões: o véu
   do `RouteLoadGate` volta a cada carga (recorte navy em vez da faixa) e o Lenis
   continua deslizando depois de um `scrollIntoViewIfNeeded` (retângulo lido num
   quadro, foto tirada de outro). Ver `scripts/medir-indicadores-sis256.mjs`. */
async function liberarRota(page) {
  await page.waitForSelector('.contato-indicador', { timeout: 180_000 });
  await page.waitForSelector('[data-route-liberado="true"]', { timeout: 180_000 });
  await page.waitForSelector('[data-route-loading]', { state: 'detached', timeout: 180_000 });
}
async function assentar(page, seletor) {
  await page.locator(seletor).scrollIntoViewIfNeeded();
  let anterior = null;
  for (let tentativa = 0; tentativa < 40; tentativa += 1) {
    const topo = await page.evaluate(async (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      await new Promise((ok) => requestAnimationFrame(() => requestAnimationFrame(ok)));
      return Math.round(el.getBoundingClientRect().top);
    }, seletor);
    if (topo !== null && topo === anterior) return true;
    anterior = topo;
    await page.waitForTimeout(120);
  }
  return false;
}

const cru = async (buf) => {
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, info };
};

const navegador = await chromium.launch();
const relatorio = { issue: 'SIS-260', base: BASE, quando: new Date().toISOString(), viewports: {} };

for (const { w, h } of VIEWPORTS) {
  const ctx = await navegador.newContext({ viewport: { width: w, height: h } });
  await ctx.addInitScript(() => {
    localStorage.setItem('sistran-motion-preference-seen', '1');
    localStorage.setItem('sistran-motion-preference', 'system');
  });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/contato`, { waitUntil: 'domcontentloaded', timeout: 180_000 });
  await liberarRota(page);
  await page.addStyleTag({ content: LIMPEZA });
  await page.evaluate(() => document.fonts.ready);
  /* Movimento reduzido: a onda desloca o cartão em ±7px, e as DUAS fotos têm de sair
     do mesmo quadro geométrico — senão a diferença acusa o cartão inteiro como
     "mudou" e o item 2 reprova por motivo falso. */
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await assentar(page, '.contato-indicadores');
  await page.waitForTimeout(900);

  const receita = await page.evaluate(() => {
    const secao = document.querySelector('.contato-indicadores');
    const antes = getComputedStyle(secao, '::before');
    const depois = getComputedStyle(secao, '::after');
    const raiz = getComputedStyle(document.documentElement);
    const conta = (s) => (s.match(/repeating-linear-gradient/g) ?? []).length;
    /* Uma "camada de grade" é um fundo que repete linha em período — pontilhado
       (`radial-gradient`) não conta, e é por isso que o `::after` da SIS-93 pode
       continuar onde está sem virar segunda grade. */
    const eGrade = (s) =>
      /repeating-linear-gradient/.test(s) ||
      (/linear-gradient/.test(s) && !/radial-gradient/.test(s) && /1px/.test(s));
    const descendentes = [...secao.querySelectorAll('*')].filter((el) => {
      const bi = getComputedStyle(el).backgroundImage;
      return bi !== 'none' && eGrade(bi);
    }).length;
    return {
      moduloDeclarado: raiz.getPropertyValue('--grade-fina-modulo').trim(),
      linhaDeclarada: raiz.getPropertyValue('--grade-fina-linha').trim(),
      opacidadeDeclarada: raiz.getPropertyValue('--grade-fina-opacidade').trim(),
      moduloTecnico: raiz.getPropertyValue('--grade-modulo').trim(),
      antes: {
        backgroundImage: antes.backgroundImage,
        backgroundSize: antes.backgroundSize,
        backgroundAttachment: antes.backgroundAttachment,
        opacity: antes.opacity,
        zIndex: antes.zIndex,
        position: antes.position,
        maskImage: antes.maskImage,
        pointerEvents: antes.pointerEvents,
        repeticoes: conta(antes.backgroundImage),
        usaMalhaTecnica: /121,\s*203/.test(antes.backgroundImage),
      },
      depois: {
        backgroundImage: depois.backgroundImage,
        eGrade: depois.backgroundImage !== 'none' && eGrade(depois.backgroundImage),
      },
      isolation: getComputedStyle(secao).isolation,
      /* Item 3: quantas camadas de grade a faixa pinta, somando pseudos e filhos. */
      camadasDeGrade:
        (antes.backgroundImage !== 'none' && eGrade(antes.backgroundImage) ? 1 : 0) +
        (depois.backgroundImage !== 'none' && eGrade(depois.backgroundImage) ? 1 : 0) +
        descendentes,
      descendentesComGrade: descendentes,
    };
  });

  const caixas = await page.evaluate(() => {
    const secao = document.querySelector('.contato-indicadores').getBoundingClientRect();
    const cartoes = [...document.querySelectorAll('.contato-indicador')].map((c) => {
      const r = c.getBoundingClientRect();
      return { x: r.x, y: r.y, w: r.width, h: r.height };
    });
    return { secao: { x: secao.x, y: secao.y, w: secao.width, h: secao.height }, cartoes };
  });
  const clipSecao = {
    x: Math.max(0, Math.floor(caixas.secao.x)),
    y: Math.max(0, Math.floor(caixas.secao.y)),
    width: Math.min(Math.ceil(caixas.secao.w), w),
    height: Math.min(Math.ceil(caixas.secao.h), h - Math.max(0, Math.floor(caixas.secao.y))),
  };

  /* ── SÃO TRÊS FOTOS, E NÃO DUAS, POR CAUSA DE UM FALSO POSITIVO MEDIDO ────────
     Com o par (com malha, sem malha) a primeira rodada acusou 460 pixels alterados
     DENTRO do cartão 4 a 390, com delta de 237 por canal — o que faria o item 2
     reprovar. Investigado pixel a pixel: na região x116–147, y382–402 a primeira foto
     tinha superfície azul lisa e a segunda tinha GLIFO branco. Não é malha em cima do
     cartão: é conteúdo que apareceu ENTRE as duas fotos (dígito da contagem chegando).
     Um delta de 237 num efeito cuja tinta é 2,5% já denuncia isso sozinho.
     A correção é comparar contra as DUAS pontas: fotografa-se com malha, sem malha e
     com malha outra vez, e só conta como malha o pixel que difere de `sem` nas duas
     fotos COM e que é idêntico entre as duas fotos com. Qualquer coisa que tenha
     mudado no tempo cai fora dos três testes ao mesmo tempo. */
  const fotoComMalha = await page.screenshot({ clip: clipSecao });
  const desligar = await page.addStyleTag({ content: SEM_MALHA });
  await page.waitForTimeout(400);
  const fotoSemMalha = await page.screenshot({ clip: clipSecao });
  await desligar.evaluate((el) => el.remove());
  await page.waitForTimeout(400);
  const fotoComMalha2 = await page.screenshot({ clip: clipSecao });

  mkdirSync('docs/capturas', { recursive: true });
  writeFileSync(`docs/capturas/sis260-${w}-com-malha.png`, fotoComMalha);
  writeFileSync(`docs/capturas/sis260-${w}-sem-malha.png`, fotoSemMalha);

  const { data: dCom, info } = await cru(fotoComMalha);
  const { data: dSem } = await cru(fotoSemMalha);
  const { data: dCom2 } = await cru(fotoComMalha2);
  /* Limiar 1 e não 8: a malha pedida é DISCRETA (≈2,5% de tinta), então a diferença
     esperada é de poucos níveis por canal — filtrar mais alto apagaria justamente o
     que se quer provar. Quem faz o papel do filtro de ruído aqui é a terceira foto. */
  const mudou = new Uint8Array(info.width * info.height);
  let totalMudou = 0;
  let maiorDelta = 0;
  let descartadosPorInstabilidade = 0;
  const delta = (a, b, i) =>
    Math.max(Math.abs(a[i] - b[i]), Math.abs(a[i + 1] - b[i + 1]), Math.abs(a[i + 2] - b[i + 2]));
  for (let p = 0; p < info.width * info.height; p += 1) {
    const i = p * info.channels;
    const d1 = delta(dCom, dSem, i);
    const d2 = delta(dCom2, dSem, i);
    if (delta(dCom, dCom2, i) >= 1) {
      if (d1 >= 1 || d2 >= 1) descartadosPorInstabilidade += 1;
      continue;
    }
    if (d1 >= 1 && d2 >= 1) {
      mudou[p] = 1;
      totalMudou += 1;
      if (d1 > maiorDelta) maiorDelta = d1;
    }
  }

  /* ── Item 2 · a malha está ATRÁS: nenhum pixel dentro de cartão mudou ──────── */
  /* ⚠️ O RETÂNGULO DO CARTÃO NÃO É A SUPERFÍCIE DO CARTÃO, e a diferença apareceu
     medida: com 2px de recuo em cada borda sobravam de 2 a 19 pixels alterados por
     cartão. Não é malha em cima da superfície — é `border-radius: 1rem`. O canto
     arredondado deixa, DENTRO do retângulo, quatro triângulos que não são cartão: ali
     o que se vê é a faixa, e é correto a malha aparecer. Por isso os cantos saem da
     conta, e o raio vem do estilo computado, não de um 16 digitado aqui.
     O recuo de 2px continua, por outro motivo já escrito: a borda é semitransparente
     (`rgb(200 232 255 / 34%)`) e a malha pode aparecer por ela de raspão sem estar na
     frente da superfície. O que o item 2 exige é a superfície limpa — que é onde
     vivem o número e o rótulo. */
  const raio = await page.evaluate(() =>
    Number.parseFloat(
      getComputedStyle(document.querySelector('.contato-indicador')).borderTopLeftRadius,
    ),
  );
  const dentroDeCartao = caixas.cartoes.map((c, indice) => {
    const x0 = Math.max(0, Math.round(c.x - clipSecao.x) + 2);
    const y0 = Math.max(0, Math.round(c.y - clipSecao.y) + 2);
    const x1 = Math.min(info.width, Math.round(c.x - clipSecao.x + c.w) - 2);
    const y1 = Math.min(info.height, Math.round(c.y - clipSecao.y + c.h) - 2);
    let n = 0;
    let area = 0;
    let nosCantos = 0;
    for (let y = y0; y < y1; y += 1) {
      for (let x = x0; x < x1; x += 1) {
        /* Distância até o centro do arco do canto mais próximo: além do raio, o pixel
           está fora da superfície arredondada. */
        const cxArco = x < x0 + raio ? x0 + raio : x > x1 - 1 - raio ? x1 - 1 - raio : x;
        const cyArco = y < y0 + raio ? y0 + raio : y > y1 - 1 - raio ? y1 - 1 - raio : y;
        const foraDoArco = Math.hypot(x - cxArco, y - cyArco) > raio;
        const alterado = mudou[y * info.width + x] === 1;
        if (foraDoArco) {
          if (alterado) nosCantos += 1;
          continue;
        }
        area += 1;
        if (alterado) n += 1;
      }
    }
    return { cartao: indice + 1, area, pixeisAlterados: n, alteradosNosCantosArredondados: nosCantos };
  });

  /* ── Item 1 · o PERÍODO medido, nos DOIS eixos ────────────────────────────────
     A malha é de quadradinhos, então ela tem dois períodos, e os dois têm de bater
     com `--grade-fina-modulo`. Medir só as colunas provaria metade do desenho.

     ⚠️ A AMOSTRA NÃO PODE SER "O RESPIRO DO TOPO", e isto custou uma rodada: a
     primeira versão varria só as linhas acima do primeiro cartão, e a 390 achou UMA
     linha de malha — não por falta de malha, mas porque no mobile os sete cartões são
     uma coluna de largura inteira e o respiro do topo é onde a vinheta é mais fraca.
     Agora a busca é pela melhor linha e pela melhor coluna de TODA a seção,
     desprezando o que cai dentro de cartão (que é opaco e onde, por construção, não
     há malha a medir). Onde há mais linhas visíveis é onde o período se mede melhor,
     e quem escolhe isso é a medição, não eu. */
  const foraDeCartao = new Uint8Array(info.width * info.height).fill(1);
  for (const c of caixas.cartoes) {
    const x0 = Math.max(0, Math.round(c.x - clipSecao.x));
    const y0 = Math.max(0, Math.round(c.y - clipSecao.y));
    const x1 = Math.min(info.width, Math.round(c.x - clipSecao.x + c.w));
    const y1 = Math.min(info.height, Math.round(c.y - clipSecao.y + c.h));
    for (let y = y0; y < y1; y += 1) {
      for (let x = x0; x < x1; x += 1) foraDeCartao[y * info.width + x] = 0;
    }
  }
  /* ⚠️ NÃO SE MEDE O PERÍODO NUMA LINHA SÓ, e a tentativa anterior mostrou por quê:
     escolher "a linha com mais colunas alteradas" cai justamente sobre uma LINHA
     HORIZONTAL da malha, onde a fileira inteira mudou — as colunas ficam todas
     contíguas, viram um grupo só e o período sai indefinido nas duas viewports.
     A leitura certa é por HISTOGRAMA: soma-se, por coluna, quantos pixels de malha
     ela tem em toda a seção (e por linha, idem). As colunas que são fio vertical da
     malha viram picos; o resto fica no chão. Os picos são os fios, e a distância
     entre picos é o período. */
  const somaColuna = new Array(info.width).fill(0);
  const somaLinha = new Array(info.height).fill(0);
  for (let y = 0; y < info.height; y += 1) {
    for (let x = 0; x < info.width; x += 1) {
      const p = y * info.width + x;
      if (mudou[p] && foraDeCartao[p]) {
        somaColuna[x] += 1;
        somaLinha[y] += 1;
      }
    }
  }
  const moduloEsperado = Number.parseFloat(receita.moduloDeclarado);
  /* O VEREDITO NÃO É A MEDIANA DOS PASSOS, e isto também foi medido: no eixo
     vertical a 1440 os fios visíveis são três (29, 285, 349), porque os cartões
     cobrem o miolo e a vinheta apaga as pontas — os passos são 256 e 64, e a mediana
     daria 256. Não é malha errada: 256 é 4×64. Fio ocultado por cartão opaco é
     esperado por construção (é o item 2!), então o que se exige de cada passo é ser
     MÚLTIPLO INTEIRO do módulo. Um período errado (96 da malha técnica, ou um
     `background-size` recortando em 96) não passa nesse teste. */
  const periodo = (soma) => {
    const maximo = Math.max(...soma);
    if (maximo === 0) return { fios: 0, passos: [], multiplos: [], confere: false };
    const posicoes = [];
    soma.forEach((v, i) => {
      if (v >= maximo * 0.5) posicoes.push(i);
    });
    /* Posições contíguas são o MESMO fio: ele tem 1px, mas cai em subpixel e pinta
       duas colunas vizinhas. Sem agrupar, o passo sairia 1. */
    const grupos = [];
    for (const v of posicoes) {
      const ultimo = grupos[grupos.length - 1];
      if (ultimo && v - ultimo[ultimo.length - 1] <= 2) ultimo.push(v);
      else grupos.push([v]);
    }
    const centros = grupos.map((g) => g.reduce((a, b) => a + b, 0) / g.length);
    const passos = centros.slice(1).map((c, i) => Number((c - centros[i]).toFixed(1)));
    const multiplos = passos.map((p) => Number((p / moduloEsperado).toFixed(2)));
    return {
      fios: centros.length,
      centros,
      passos,
      multiplos,
      confere:
        passos.length > 0 &&
        multiplos.every((m) => m >= 0.97 && Math.abs(m - Math.round(m)) <= 0.05),
    };
  };
  const horizontal = periodo(somaColuna);
  const vertical = periodo(somaLinha);

  /* ── Contraste das três tintas sobre o cartão, remedido ────────────────────── */
  const alvos = [
    { nome: 'número (piso 3,0 · texto grande)', sel: '.contato-indicador-valor span:not(.sr-only)', piso: 3, arquivo: 'numero' },
    { nome: 'rótulo (piso 4,5 · texto pequeno)', sel: '.contato-indicador-rotulo', piso: 4.5, arquivo: 'rotulo' },
    { nome: '+ (piso 3,0 · texto grande)', sel: '.contato-indicador-mais', piso: 3, arquivo: 'mais' },
  ];
  const contraste = [];
  for (const alvo of alvos) {
    await assentar(page, '.contato-indicadores');
    const dados = await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { cor: getComputedStyle(el).color, caixa: { x: r.x, y: r.y, w: r.width, h: r.height } };
    }, alvo.sel);
    if (!dados) {
      contraste.push({ alvo: alvo.nome, erro: 'alvo não encontrado' });
      continue;
    }
    const clip = {
      x: Math.max(0, Math.floor(dados.caixa.x)),
      y: Math.max(0, Math.floor(dados.caixa.y)),
      width: Math.max(1, Math.min(Math.ceil(dados.caixa.w), w - Math.floor(dados.caixa.x))),
      height: Math.max(1, Math.min(Math.ceil(dados.caixa.h), h - Math.floor(dados.caixa.y))),
    };
    const fotoTinta = await page.screenshot({ clip });
    /* Estilo em linha com `important`: a regra da faixa é (0,5,1) e também
       `!important`, então folha injetada perde a disputa (medido na SIS-256). */
    await page.evaluate(() => {
      document.querySelectorAll('.contato-indicador, .contato-indicador *').forEach((el) => {
        el.style.setProperty('color', 'transparent', 'important');
        el.style.setProperty('-webkit-text-fill-color', 'transparent', 'important');
      });
    });
    await page.waitForTimeout(250);
    const fotoFundo = await page.screenshot({ clip });
    writeFileSync(`docs/capturas/sis260-${w}-fundo-${alvo.arquivo}.png`, fotoFundo);

    const tinta = lerTinta(dados.cor);
    const { data: dFundo, info: iF } = await cru(fotoFundo);
    const { data: dTinta } = await cru(fotoTinta);
    let piorCalculada = Infinity;
    let piorRaster = Infinity;
    let pixelFundo = null;
    let pixeisDeGlifo = 0;
    for (let i = 0; i < dFundo.length; i += iF.channels) {
      const fundo = { r: dFundo[i], g: dFundo[i + 1], b: dFundo[i + 2] };
      const c = razao(compor(tinta, fundo), fundo);
      if (c < piorCalculada) {
        piorCalculada = c;
        pixelFundo = fundo;
      }
      const tintaPx = { r: dTinta[i], g: dTinta[i + 1], b: dTinta[i + 2] };
      if (
        Math.abs(tintaPx.r - fundo.r) > 8 ||
        Math.abs(tintaPx.g - fundo.g) > 8 ||
        Math.abs(tintaPx.b - fundo.b) > 8
      ) {
        pixeisDeGlifo += 1;
        const r = razao(tintaPx, fundo);
        if (r < piorRaster) piorRaster = r;
      }
    }
    if (!Number.isFinite(piorRaster)) piorRaster = 0;
    contraste.push({
      alvo: alvo.nome,
      piso: alvo.piso,
      tintaDeclarada: dados.cor,
      piorPixelDeFundo: `rgb(${pixelFundo.r},${pixelFundo.g},${pixelFundo.b})`,
      pixeisDeGlifo,
      raster: Number(piorRaster.toFixed(2)),
      calculada: Number(piorCalculada.toFixed(2)),
      passa: piorCalculada >= alvo.piso,
    });
    await page.reload({ waitUntil: 'domcontentloaded' });
    await liberarRota(page);
    await page.addStyleTag({ content: LIMPEZA });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await assentar(page, '.contato-indicadores');
    await page.waitForTimeout(700);
  }

  relatorio.viewports[`${w}x${h}`] = {
    receita,
    malha: {
      pixeisAlterados: totalMudou,
      maiorDeltaPorCanal: maiorDelta,
      descartadosPorInstabilidade,
      malhaAparece: totalMudou > 0,
      moduloEsperado,
      fiosVerticais: horizontal,
      fiosHorizontais: vertical,
      periodoConfere: horizontal.confere && vertical.confere,
    },
    atrasDosCartoes: {
      raioDoCartao: raio,
      porCartao: dentroDeCartao,
      totalDentroDeCartoes: dentroDeCartao.reduce((a, c) => a + c.pixeisAlterados, 0),
      limpoSobreOsCartoes: dentroDeCartao.every((c) => c.pixeisAlterados === 0),
    },
    contraste,
  };
  await ctx.close();
}

await navegador.close();
mkdirSync('docs/medidas', { recursive: true });
writeFileSync('docs/medidas/grade-sis260.json', JSON.stringify(relatorio, null, 2));
console.log(JSON.stringify(relatorio, null, 2));
