/**
 * PORTÕES da SIS-280 — a vitrine de Tecnologias de `/quem-somos` contra
 * `docs/tecnologia.md` e o mock `public/imagensexemplo/tecnologia.png`.
 *
 * Um portão por critério de aceite, todos medidos no DOM computado / em pixel
 * composto — nunca «está implementado»:
 *
 *   1. o título textual «Tecnologias» NÃO EXISTE na seção (nenhum heading, e a
 *      palavra não aparece em texto visível);
 *   2. o carimbo oficial ESTÁ EM USO: o `src` é o arquivo da issue e a largura
 *      computada bate com 370 / 300 / 245 por faixa;
 *   3. o FUNDO É CLARO: luminância do pixel composto em seis pontos da seção, e
 *      o portão é `> 0,8` em todos (navy dá ~0,02);
 *   4. as duas faixas se movem em SENTIDOS OPOSTOS: dois quadros de `transform`
 *      por faixa, e o portão é o SINAL do delta de translateX — de cima negativo,
 *      de baixo positivo;
 *   5. o LOOP NÃO SALTA: `-50%` da fita tem de ser exatamente a largura de um
 *      grupo. Medido, não deduzido: `fita.scrollWidth / 2` contra
 *      `grupo.getBoundingClientRect().width`, e o grupo tem de ser MAIS LARGO que
 *      a janela (senão a emenda passa no meio da tela);
 *   6. as três trocam SOZINHAS na ordem Pega → AWS → Salesforce: amostro
 *      `data-pos` do painel ativo ao longo de ~13s (três trocas de 4s);
 *   7. ZERO CONTROLES: contagem de `button`, de `svg` e de nós com `role` de
 *      navegação dentro da seção — o portão é zero;
 *   8. SEM ROLAGEM HORIZONTAL: `documentElement.scrollWidth` contra `clientWidth`;
 *   9. ~850px de altura no desktop;
 *  10. LOGOS NÍTIDAS: para cada imagem, largura EXIBIDA × DPR contra a largura
 *      intrínseca do arquivo (`naturalWidth`). Exibir acima do intrínseco é
 *      interpolação — o portão é `exibida × 2 ≤ natural` (Retina), e o que não
 *      passa é reportado com o número;
 *  11. PAUSA NO HOVER: `pointerenter` na área central, espera de 6s (mais de um
 *      ciclo de 4s) e o portão é `data-pos` INALTERADO;
 *  12. os DOIS CANAIS de movimento reduzido: faixa sem animação E rolável, cópia
 *      `aria-hidden` fora de cena, e as tecnologias ainda VISÍVEIS.
 *
 * Receita de navegador da casa (Playwright do cache do `npx`, :3000, preferência
 * de movimento semeada, canal `reduce` em CONTEXTO NOVO, rampa de rolagem para o
 * que nasce abaixo da dobra).
 *
 *   node scripts/medir-tecnologias-sis280.mjs
 */
import { writeFileSync, mkdirSync } from 'node:fs';

const { chromium } = await import(
  'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs'
);

const ROTA = 'http://localhost:3000/quem-somos';
const SELETOR = '.tec-secao';

const semear = (ctx, valor) =>
  ctx.addInitScript((v) => {
    localStorage.setItem('sistran-motion-preference-seen', '1');
    localStorage.setItem('sistran-motion-preference', v);
  }, valor);

async function rampa(page, alvoY) {
  for (let s = 0; s < alvoY; s += 300) {
    await page.evaluate((v) => window.scrollTo(0, v), s);
    await page.waitForTimeout(60);
  }
  await page.evaluate((v) => window.scrollTo(0, v), alvoY);
  await page.waitForTimeout(1400);
}

/** Leva a seção ao meio da tela — as faixas e o painel têm de estar visíveis. */
async function irAteASecao(page) {
  const y = await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return Math.max(0, r.top + window.scrollY + r.height / 2 - window.innerHeight / 2);
  }, SELETOR);
  if (y === null) return false;
  await rampa(page, y);
  return true;
}

/* Pixel COMPOSTO: recorte 1×1 decodificado na própria página. `backgroundColor`
   não serve — o degradê da seção convive com três planos decorativos por cima, e
   o que interessa é a cor que a pessoa vê. */
async function pixel(page, x, y) {
  const buf = await page.screenshot({ clip: { x, y, width: 1, height: 1 } });
  return page.evaluate(async (dados) => {
    const img = new Image();
    img.src = `data:image/png;base64,${dados}`;
    await img.decode();
    const c = document.createElement('canvas');
    c.width = 1;
    c.height = 1;
    const ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    return [r, g, b];
  }, buf.toString('base64'));
}

const canal = (v) => {
  const s = v / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};
const lum = ([r, g, b]) => Number((0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b)).toFixed(4));

/** translateX de uma matriz computada. `none` conta como 0. */
const lerX = (page, seletor) =>
  page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const m = new DOMMatrixReadOnly(getComputedStyle(el).transform);
    return Number(m.m41.toFixed(2));
  }, seletor);

/* ITENS 1, 2, 3, 7, 8, 9, 10 — leitura estática com a seção enquadrada. */
const lerEstrutura = (page) =>
  page.evaluate((sel) => {
    const s = document.querySelector(sel);
    if (!s) return null;
    const r = s.getBoundingClientRect();
    const e = getComputedStyle(s);
    const carimbo = s.querySelector('.carimbo-batida img');
    const cb = carimbo?.getBoundingClientRect() ?? null;
    /* «Texto visível» = o que sai em `innerText` (respeita `display: none` e
       `visibility`). A palavra do título proibido é procurada AQUI, e não no
       `textContent`, que devolveria também o que está escondido — mas nenhum dos
       dois pode ter a palavra como título. */
    const visivel = s.innerText ?? '';
    const imagens = [...s.querySelectorAll('img')].map((img) => {
      const b = img.getBoundingClientRect();
      return {
        alt: img.getAttribute('alt'),
        temAlt: !!img.getAttribute('alt')?.trim(),
        arquivo: (img.currentSrc || img.src).split('/').pop()?.split('?')[0] ?? null,
        exibida: Math.round(b.width),
        intrinseca: img.naturalWidth,
        /* Nitidez Retina: a exibição em CSS px vezes 2 tem de caber na largura do
           arquivo. `folga` negativa é interpolação visível em tela Retina. */
        folgaRetina: img.naturalWidth - Math.round(b.width) * 2,
      };
    });
    return {
      altura: Math.round(r.height),
      alturaMinimaComputada: e.minHeight,
      fundoDeclarado: e.backgroundImage.slice(0, 120),
      /* PORTÃO 1 */
      headings: [...s.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((n) => n.textContent.trim()),
      textoVisivel: visivel.replace(/\s+/g, ' ').trim(),
      palavraTecnologiasEmTextoVisivel: /Tecnologias/i.test(visivel),
      rotuloDaSecao: s.getAttribute('aria-label'),
      /* PORTÃO 2 */
      carimbo: cb
        ? {
            arquivo: (carimbo.currentSrc || carimbo.src).split('/').pop()?.split('?')[0],
            largura: Math.round(cb.width),
            altura: Math.round(cb.height),
            proporcao: Number((cb.width / cb.height).toFixed(3)),
            esquerda: Math.round(cb.left),
            /* «Alinhar ao mesmo container horizontal das tecnologias»: a margem
               esquerda do carimbo contra a do miolo. */
            esquerdaDoMiolo: Math.round(
              s.querySelector('.tec-miolo')?.getBoundingClientRect().left ?? 0,
            ),
          }
        : null,
      /* PORTÃO 13 — «a linha de cima das logos passando ao lado direito do
         carimbo». Duas medidas, porque «ao lado» são as duas coisas juntas:
         · começaDepoisDoCarimbo: a esquerda da faixa é maior que a direita do
           carimbo, isto é, a faixa nasce depois que a arte termina, sem sobrepor;
         · cruzaNaAlturaDoCarimbo: as duas caixas se cruzam na vertical — sem isto
           a faixa estaria «ao lado» só na ordem do DOM, mas numa outra linha.
         Abaixo de 768px o esperado se INVERTE (a linha empilha), e é por isso que
         as duas leituras são registradas por largura em vez de um booleano só. */
      linhaDeCima: (() => {
        const fx = s.querySelector('.tec-topo > .tec-faixa')?.getBoundingClientRect();
        if (!fx || !cb) return null;
        return {
          faixaEsquerda: Math.round(fx.left),
          carimboDireita: Math.round(cb.right),
          começaDepoisDoCarimbo: fx.left >= cb.right,
          cruzaNaAlturaDoCarimbo: fx.top < cb.bottom && fx.bottom > cb.top,
          centroDaFaixa: Math.round(fx.top + fx.height / 2),
          centroDoCarimbo: Math.round(cb.top + cb.height / 2),
        };
      })(),
      /* PORTÃO 7 — a ausência é o critério. */
      controles: {
        botoes: s.querySelectorAll('button').length,
        svgs: s.querySelectorAll('svg').length,
        inputs: s.querySelectorAll('input').length,
        comRoleDeBotao: s.querySelectorAll('[role="button"]').length,
        barrasDeProgresso: s.querySelectorAll('[role="progressbar"], progress').length,
      },
      /* PORTÃO 8 */
      transbordoDoDocumento:
        document.documentElement.scrollWidth - document.documentElement.clientWidth,
      /* PORTÃO 10 */
      imagens,
      logosInterpoladas: imagens.filter((i) => i.folgaRetina < 0).map((i) => i.arquivo),
      semAlt: imagens.filter((i) => !i.temAlt).map((i) => i.arquivo),
      /* PORTÃO 5 — a conta da emenda. */
      faixas: [...s.querySelectorAll('.tec-faixa')].map((f) => {
        const fita = f.querySelector('.tec-faixa__fita');
        const grupo = f.querySelector('.tec-faixa__grupo');
        const ge = grupo ? getComputedStyle(grupo) : null;
        return {
          sentido: f.getAttribute('data-sentido'),
          rotulo: f.getAttribute('aria-label'),
          larguraDaFita: Math.round(fita?.getBoundingClientRect().width ?? 0),
          metadeDaFita: Math.round((fita?.getBoundingClientRect().width ?? 0) / 2),
          larguraDoGrupo: Math.round(grupo?.getBoundingClientRect().width ?? 0),
          /* O portão: metade da fita MENOS um grupo. Zero = emenda exata. */
          erroDaEmenda: Math.round(
            (fita?.getBoundingClientRect().width ?? 0) / 2 -
              (grupo?.getBoundingClientRect().width ?? 0),
          ),
          vao: ge?.gap,
          paddingDireitoDoGrupo: ge?.paddingRight,
          /* O grupo tem de ser mais largo que a janela. */
          grupoMaisLargoQueAJanela:
            (grupo?.getBoundingClientRect().width ?? 0) > window.innerWidth,
          capsulas: f.querySelectorAll('.tec-capsula').length,
          clonesEscondidos: f.querySelectorAll('.tec-faixa__grupo[aria-hidden="true"]').length,
          animacao: getComputedStyle(fita).animationName,
          duracao: getComputedStyle(fita).animationDuration,
          estado: getComputedStyle(fita).animationPlayState,
          mascara: getComputedStyle(f).maskImage.slice(0, 80),
          alturaDaCapsula: Math.round(
            f.querySelector('.tec-capsula')?.getBoundingClientRect().height ?? 0,
          ),
          raioDaCapsula: getComputedStyle(f.querySelector('.tec-capsula')).borderRadius,
        };
      }),
      /* Estado de abertura do destaque (item 4 do doc: AWS no centro). */
      destaque: [...s.querySelectorAll('.tec-destaque__item')].map((n) => {
        const b = n.getBoundingClientRect();
        return {
          categoria: n.querySelector('.tec-destaque__categoria')?.textContent.trim(),
          pos: n.getAttribute('data-pos'),
          largura: Math.round(b.width),
          altura: Math.round(b.height),
          raio: getComputedStyle(n).borderRadius,
          borda: getComputedStyle(n).borderTopWidth + ' ' + getComputedStyle(n).borderTopColor,
          opacidade: getComputedStyle(n).opacity,
          duracaoDaTransicao: getComputedStyle(n).transitionDuration,
          easing: getComputedStyle(n).transitionTimingFunction.slice(0, 40),
        };
      }),
    };
  }, SELETOR);

/** O painel ativo agora — o nome vem da categoria, que é o texto do doc. */
const ativoAgora = (page) =>
  page.evaluate(
    () =>
      document
        .querySelector('.tec-destaque__item[data-pos="0"] .tec-destaque__categoria')
        ?.textContent.trim() ?? null,
  );

const browser = await chromium.launch();
const saida = { rota: ROTA, quando: new Date().toISOString(), larguras: {}, reduce: {} };

for (const largura of [1440, 1024, 390]) {
  const ctx = await browser.newContext({
    viewport: { width: largura, height: 900 },
    deviceScaleFactor: 1,
  });
  await semear(ctx, 'full');
  const page = await ctx.newPage();
  const erros = [];
  const faltando = [];
  page.on('console', (m) => m.type() === 'error' && erros.push(m.text()));
  page.on('response', (r) => {
    if (r.status() >= 400) faltando.push(`${r.status()} ${r.url()}`);
  });
  await page.goto(ROTA, { waitUntil: 'load', timeout: 90000 });
  await page.waitForTimeout(2500);

  const achou = await irAteASecao(page);
  mkdirSync('docs/capturas', { recursive: true });
  await page.screenshot({ path: `docs/capturas/tecnologias-${largura}.png` });

  const estrutura = achou ? await lerEstrutura(page) : null;

  /* PORTÃO 3 — o fundo é claro. Seis pontos ao longo da seção, evitando as
     cápsulas brancas (que passariam de graça) e o painel: colho nas ruas entre as
     faixas e nas bordas laterais. */
  const pontos = [];
  if (estrutura) {
    /* A primeira rodada mediu luminância 0,11 em y=72 nas três larguras e quase
       acusou o fundo de escuro. Não era a seção: é o HEADER FIXO navy, que fica
       POR CIMA dela e ocupa a faixa central do topo (x 432–1008 a 1440; as bordas
       58 e 1382 já vinham claras, 0,92). Portanto a banda de amostragem começa
       abaixo da altura real do header, medida aqui — sem isso o portão reprova o
       fundo certo pela cor de outro componente. */
    const caixa = await page.evaluate((sel) => {
      const r = document.querySelector(sel).getBoundingClientRect();
      const cab = document.querySelector('header');
      const piso = cab && getComputedStyle(cab).position === 'fixed'
        ? Math.ceil(cab.getBoundingClientRect().bottom) + 8
        : 0;
      const top = Math.max(0, r.top, piso);
      return { top, h: Math.min(r.bottom, window.innerHeight) - top };
    }, SELETOR);
    for (const fx of [0.04, 0.3, 0.5, 0.7, 0.96]) {
      for (const fy of [0.08, 0.92]) {
        const x = Math.min(Math.round(largura * fx), largura - 1);
        const y = Math.round(caixa.top + caixa.h * fy);
        /* ... e não é só o header: depois que o carimbo passou a dividir a linha
           de cima com a primeira faixa, ele ocupa a banda y≈139–264, e o ponto
           (307, 173) a 1024px caiu DENTRO da arte — rgb(88,142,216), o azul
           #0757c7 do próprio carimbo com antialiasing. Medido por
           `elementFromPoint`: `alt="Carimbo Sistran Tecnologias"`. Reprovar o
           fundo pela tinta do carimbo é o mesmo erro do header, então o ponto que
           cai sobre CONTEÚDO é anotado e não entra na conta — o portão mede
           fundo, e esses pixels não são fundo. */
        const sobre = await page.evaluate(([px, py]) => {
          const el = document.elementFromPoint(px, py);
          /* SÓ o carimbo. Excluir também as faixas e o destaque zerou a amostra a
             390px (dez pontos de dez caíam sobre eles) e o portão passava a vazio,
             o que é pior que o falso negativo: as cápsulas e o painel são brancos
             e azul-gelo e sempre foram amostra legítima do claro exigido. A arte do
             carimbo é a única tinta escura da seção. */
          return el && el.closest('.tec-carimbo')
            ? el.getAttribute('alt') || el.className.toString() || el.tagName
            : null;
        }, [x, y]);
        const p = await pixel(page, x, y);
        pontos.push({ x, y, rgb: p, luminancia: lum(p), sobreConteudo: sobre });
      }
    }
  }

  /* PORTÃO 4 — sentidos opostos. Dois quadros com 900ms entre eles: a 31s por
     ciclo de ~2660px, 900ms movem ~77px, bem acima do ruído de arredondamento. */
  const antes = {
    superior: await lerX(page, '.tec-faixa[data-sentido="esquerda"] .tec-faixa__fita'),
    inferior: await lerX(page, '.tec-faixa[data-sentido="direita"] .tec-faixa__fita'),
  };
  await page.waitForTimeout(900);
  const depois = {
    superior: await lerX(page, '.tec-faixa[data-sentido="esquerda"] .tec-faixa__fita'),
    inferior: await lerX(page, '.tec-faixa[data-sentido="direita"] .tec-faixa__fita'),
  };

  saida.larguras[largura] = {
    estrutura,
    fundo: {
      pontos,
      pontosDeFundo: pontos.filter((p) => !p.sobreConteudo).length,
      luminanciaMinima: pontos.filter((p) => !p.sobreConteudo).length
        ? Math.min(...pontos.filter((p) => !p.sobreConteudo).map((p) => p.luminancia))
        : null,
      /* O navy que a issue rejeita (#06325c) tem luminância ~0,027; o degradê do
         doc (#F8FCFF→#E5F4FF) fica acima de 0,90 no plano liso e cai até ~0,78 sob
         a sombra azul das cápsulas. Daí o corte em 0,70: separa por uma ordem de
         grandeza (25×) o claro exigido do escuro proibido, sem reprovar a própria
         sombra que o doc pede. O primeiro corte, em 0,80, reprovou 0,7851 em 390 —
         um azul-gelo, não uma área escura. */
      todosClaros: pontos.filter((p) => !p.sobreConteudo).every((p) => p.luminancia > 0.7),
    },
    movimento: {
      antes,
      depois,
      deltaSuperior: Number((depois.superior - antes.superior).toFixed(2)),
      deltaInferior: Number((depois.inferior - antes.inferior).toFixed(2)),
      sentidosOpostos:
        depois.superior - antes.superior < -1 && depois.inferior - antes.inferior > 1,
    },
    respostas400: faltando,
    errosDeConsole: erros,
  };
  await ctx.close();
}

/* PORTÕES 6 E 11 — troca automática e pausa no hover, a 1440. */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await semear(ctx, 'full');
  const page = await ctx.newPage();
  await page.goto(ROTA, { waitUntil: 'load', timeout: 90000 });
  await page.waitForTimeout(2500);
  await irAteASecao(page);

  /* A JANELA DE AMOSTRAGEM FICA DENTRO DO CURSO: 14 leituras de 1s cobrem mais de
     três trocas de 4s. Amostrar depois do curso é o risco registrado na SIS-279. */
  const sequencia = [];
  for (let i = 0; i < 14; i += 1) {
    sequencia.push(await ativoAgora(page));
    await page.waitForTimeout(1000);
  }
  /* A ordem sem as repetições: tem de ser o ciclo Pega → AWS → Salesforce. */
  const ordem = sequencia.filter((v, i) => i === 0 || v !== sequencia[i - 1]);

  /* PAUSA NO HOVER: ponteiro sobre a área central e 6s de espera — mais de um
     ciclo. O portão é o ativo INALTERADO. */
  /* O ponteiro entra PRIMEIRO e a linha de base é lida DEPOIS de um respiro de
     700ms. Motivo medido: na segunda rodada o painel avançou um passo no instante
     do hover e o portão reprovou — mas a troca era de um `setTimeout` que já
     estava VENCIDO quando o mouse chegou (a sequência mostra o ativo há 3s no
     mesmo item). Isso não é falha de pausa, é corrida de amostragem: quem entra
     no fim de um ciclo sempre vê uma troca a caminho. Com a base lida após o
     respiro, os 6s seguintes — mais de um ciclo de 4s — medem só o que a pausa
     controla. */
  await page.hover('.tec-destaque');
  await page.waitForTimeout(700);
  const antesDoHover = await ativoAgora(page);
  await page.waitForTimeout(6000);
  const durante = await ativoAgora(page);
  await page.mouse.move(10, 10);
  await page.waitForTimeout(5000);
  const depoisDeSair = await ativoAgora(page);

  saida.trocaAutomatica = {
    sequencia,
    ordemObservada: ordem,
    trocas: ordem.length - 1,
    hover: { antes: antesDoHover, durante, pausou: antesDoHover === durante },
    /* E retomou: depois de sair, o ativo mudou de novo. */
    retomou: depoisDeSair !== durante,
    depoisDeSair,
  };
  await ctx.close();
}

/* PORTÃO 12 — OS DOIS CANAIS DE MOVIMENTO REDUZIDO. O ponto sensível não é
   «parou», é «continua alcançável»: faixa sem animação, rolável, cópia fora de
   cena, e as catorze logos com caixa maior que zero. */
for (const nome of ['sistema', 'chave']) {
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    ...(nome === 'sistema' ? { reducedMotion: 'reduce' } : {}),
  });
  await semear(ctx, nome === 'sistema' ? 'reduce' : 'full');
  const page = await ctx.newPage();
  await page.goto(ROTA, { waitUntil: 'load', timeout: 90000 });
  if (nome === 'chave')
    await page.evaluate(() => document.documentElement.setAttribute('data-motion', 'reduce'));
  await page.waitForTimeout(1200);
  await irAteASecao(page);
  await page.screenshot({ path: `docs/capturas/tecnologias-reduce-${nome}.png` });

  saida.reduce[nome] = await page.evaluate((sel) => {
    const s = document.querySelector(sel);
    if (!s) return null;
    const faixas = [...s.querySelectorAll('.tec-faixa')].map((f) => {
      const fita = f.querySelector('.tec-faixa__fita');
      const ef = getComputedStyle(fita);
      const visiveis = [...f.querySelectorAll('.tec-capsula')].filter(
        (c) => c.getBoundingClientRect().width > 0,
      );
      return {
        animacao: ef.animationName,
        transform: ef.transform,
        overflowX: getComputedStyle(f).overflowX,
        /* ROLÁVEL: é isto que devolve o acesso ao que a fita parada esconde. */
        rolavel: f.scrollWidth > f.clientWidth + 1,
        cloneFora:
          getComputedStyle(f.querySelector('.tec-faixa__grupo[aria-hidden="true"]')).display ===
          'none',
        capsulasComCaixa: visiveis.length,
        mascara: getComputedStyle(f).maskImage,
      };
    });
    const itens = [...s.querySelectorAll('.tec-destaque__item')].map((n) => ({
      pos: n.getAttribute('data-pos'),
      transform: getComputedStyle(n).transform,
      opacidade: getComputedStyle(n).opacity,
      transicao: getComputedStyle(n).transitionProperty,
      duracao: getComputedStyle(n).transitionDuration,
      visivel: n.getBoundingClientRect().width > 0,
    }));
    return {
      faixas,
      destaque: itens,
      ativoVisivel: itens.some((i) => i.pos === '0' && i.opacidade === '1'),
      /* O crossfade do doc: o ativo fica visível e o DESLOCAMENTO LATERAL morre.
         A primeira versão deste portão procurava `matrix(1,0,0,1,-\d{3,}` e
         reprovava sempre — casava com o `translate(-50%, -50%)` que CENTRALIZA os
         três painéis, que não é deslocamento de carrossel nenhum. O teste certo é
         comparativo: os três têm de compartilhar EXATAMENTE a mesma matriz — é
         isso que significa «ninguém saiu para o lado». */
      semDeslocamentoLateral: new Set(itens.map((i) => i.transform)).size === 1,
      todasAsLogosComCaixa:
        [...s.querySelectorAll('img')].filter((i) => i.getBoundingClientRect().width > 0).length,
      totalDeLogos: s.querySelectorAll('img').length,
    };
  }, SELETOR);
  await ctx.close();
}

await browser.close();
mkdirSync('docs/medidas', { recursive: true });
writeFileSync('docs/medidas/sis280-tecnologias.json', JSON.stringify(saida, null, 2));
console.log(JSON.stringify(saida, null, 2));
