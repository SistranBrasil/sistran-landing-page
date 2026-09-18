/**
 * SIS-284 — «/sistran-university · "Desde 2022, já formamos" igual a university.png».
 *
 * `node scripts/medir-numeros-university-sis284.mjs [antes|depois]`  (`next dev` em :3000)
 *
 * O que cada critério da issue exige para virar número, e por que a sonda é assim:
 *
 *  • «Composição a 1440 bate visualmente com a referência» — parte é olho (as
 *    capturas), mas os fatos que a referência mostra e o "antes" NÃO tinha são
 *    mensuráveis, e são estes: a seção é FOLHA CLARA (cor de fundo computada) com a
 *    GRADE (o `background-image` do `::before` de `.section-light`); há TRÊS cartões
 *    e não dois; o do meio é mais LARGO e mais ALTO que os vizinhos e tem borda
 *    ciano; existem DOIS segmentos de fio com nó. Cada um desses é um jeito de a
 *    composição estar errada passando por certa numa captura pequena.
 *  • O CENTRO VERTICAL DOS TRÊS CARTÕES é medido à parte porque o fio se pendura em
 *    `top: 50%` dos cartões 2 e 3: se o destaque crescer assimétrico, os dois
 *    segmentos deixam de ser colineares e a ligação lê como dois riscos soltos. A
 *    prova é a diferença entre os centros, em px.
 *  • «Manchete + lead + três cards + rótulo como na referência» — o TEXTO de cada
 *    peça, na íntegra, mais a contagem de LINHAS da manchete: a referência parte em
 *    duas, e a quebra aqui é feita por `max-width` em `ch` (não por `<br />`), então
 *    ela pode virar uma ou três linhas sem ninguém tocar em nada.
 *  • «Mobile legível» — a 390: uma coluna só, os três cartões na ordem, o fio
 *    SUMIDO (é a saída que a issue admite), o destaque sem a margem negativa, e
 *    nada vazando na horizontal. O corpo dos textos de apoio também, porque «cabe»
 *    e «se lê» não são a mesma coisa.
 *  • OS DOIS CANAIS DE MOVIMENTO REDUZIDO, e o que se lê neles é ESTADO FINAL: os
 *    cartões visíveis (`opacity: 1`, sem `transform`) e — o ponto sensível — os
 *    contadores mostrando 60 e 17, não 0. Contador animado que morre em zero é a
 *    forma clássica de uma regra de acessibilidade esconder conteúdo, e o `CountUp`
 *    já nasce protegido; a sonda confirma que segue protegido aqui.
 *  • O VALOR NO HTML DO SERVIDOR é medido sem JavaScript (contexto com
 *    `javaScriptEnabled: false`): a página tem de degradar, e é onde se vê que o
 *    número final está no HTML e que os cartões não ficam presos em `opacity: 0`
 *    esperando um `data-in` que nunca chega.
 */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import { mkdir, writeFile } from 'node:fs/promises';

const BASE = 'http://localhost:3000';
const ROTA = '/sistran-university';
const MOMENTO = process.argv[2] === 'depois' ? 'depois' : 'antes';
const LARGURAS = [1440, 1024, 390];

await mkdir('docs/capturas', { recursive: true });
await mkdir('docs/medidas', { recursive: true });

const nav = await chromium.launch();
const res = { issue: 'SIS-284', momento: MOMENTO, rota: ROTA, erros: [], porLargura: {} };

const sonda = (p) =>
  p.evaluate(() => {
    const caixa = (n) => {
      if (!n) return null;
      const b = n.getBoundingClientRect();
      return {
        topo: Math.round((b.top + window.scrollY) * 10) / 10,
        esq: Math.round(b.left * 10) / 10,
        w: Math.round(b.width * 10) / 10,
        h: Math.round(b.height * 10) / 10,
        centroY: Math.round((b.top + window.scrollY + b.height / 2) * 10) / 10,
      };
    };

    /* Linhas visuais de um nó de texto. `getClientRects()` de um Range devolve um
       retângulo por FRAGMENTO e não por linha — a manchete é «span + texto + span»,
       o que daria cinco "linhas" para duas. Agrupar por `top` arredondado resolve, e
       a deduplicação vem de graça. (Mesma sonda da SIS-282.) */
    const linhas = (no) => {
      if (!no) return [];
      const r = document.createRange();
      r.selectNodeContents(no);
      const porTopo = new Map();
      for (const c of r.getClientRects()) {
        if (c.width <= 1) continue;
        const k = Math.round(c.top);
        const g = porTopo.get(k) ?? { esq: Infinity, dir: -Infinity };
        g.esq = Math.min(g.esq, c.left);
        g.dir = Math.max(g.dir, c.right);
        porTopo.set(k, g);
      }
      return Array.from(porTopo.entries())
        .sort((a, b) => a[0] - b[0])
        .map(([topo, g]) => ({ topo, w: Math.round((g.dir - g.esq) * 10) / 10 }));
    };

    const secao = document.querySelector('#university-numeros');
    if (!secao) return { ausente: true };
    const es = getComputedStyle(secao);
    const grade = getComputedStyle(secao, '::before');

    const cartoes = Array.from(secao.querySelectorAll('.university-numeros-cartao'));
    const manchete = secao.querySelector('#university-numeros-titulo');
    const lead = secao.querySelector('.university-numeros-lead');
    const assinatura = secao.querySelector('.university-numeros-assinatura');
    const lm = linhas(manchete);

    return {
      /* A FOLHA. O "antes" era navy herdado: aqui a prova de que a seção passou a
         ter superfície própria e clara, com a grade técnica por cima. */
      folha: {
        temClasseSectionLight: secao.classList.contains('section-light'),
        corDeFundo: es.backgroundColor,
        gradeNoPseudo: grade.backgroundImage === 'none' ? null : grade.backgroundImage.slice(0, 90),
        gradeZ: grade.zIndex,
        /* Os acentos translúcidos: nó próprio, e ele existe (ou não) por largura. */
        acentos: (() => {
          const a = secao.querySelector('.university-numeros-acentos');
          if (!a) return null;
          const ea = getComputedStyle(a);
          return {
            display: ea.display,
            quadradoA: getComputedStyle(a, '::before').backgroundImage.slice(0, 60),
            quadradoB: getComputedStyle(a, '::after').backgroundImage.slice(0, 60),
          };
        })(),
      },

      manchete: manchete
        ? {
            texto: manchete.textContent.trim(),
            caixa: caixa(manchete),
            fontSize: getComputedStyle(manchete).fontSize,
            pesoComputado: getComputedStyle(manchete).fontWeight,
            cor: getComputedStyle(manchete).color,
            quantasLinhas: lm.length,
            linhasDeTinta: lm,
            /* As DUAS PONTAS em azul — o miolo herda o navy da folha. Um `!important`
               perdido aqui deixaria as três em navy e a manchete chapada. */
            realces: Array.from(manchete.querySelectorAll('.university-numeros-realce')).map((s) => ({
              texto: s.textContent.trim(),
              cor: getComputedStyle(s).color,
            })),
          }
        : null,

      lead: lead
        ? {
            texto: lead.textContent.trim(),
            caixa: caixa(lead),
            fontSize: getComputedStyle(lead).fontSize,
            cor: getComputedStyle(lead).color,
            quantasLinhas: linhas(lead).length,
          }
        : null,

      fileira: (() => {
        const f = secao.querySelector('.university-numeros-fileira');
        if (!f) return null;
        const ef = getComputedStyle(f);
        /* O FIO mudou de dono: era pseudo dos cartões 2 e 3, agora é pseudo da própria
           fileira — porque o cartão passou a escalar sob o ponteiro e levaria o fio
           junto. Lido aqui, e no lugar certo. `content` e não só `display`, pela
           armadilha anotada abaixo. */
        const fio = (pseudo) => {
          const e = getComputedStyle(f, pseudo);
          return {
            content: e.content,
            display: e.display,
            esq: e.left,
            w: e.width,
            camadas: e.backgroundImage.slice(0, 60),
            tamanhos: e.backgroundSize,
          };
        };
        return {
          colunas: ef.gridTemplateColumns,
          quantasColunas: ef.gridTemplateColumns.split(' ').filter(Boolean).length,
          vao: ef.columnGap,
          fio1: fio('::before'),
          fio2: fio('::after'),
        };
      })(),

      quantosCartoes: cartoes.length,
      cartoes: cartoes.map((c) => {
        const ec = getComputedStyle(c);
        const fio = getComputedStyle(c, '::before');
        const no = getComputedStyle(c, '::after');
        const icone = c.querySelector('.university-numeros-icone');
        return {
          destaque: c.classList.contains('university-numeros-cartao--destaque'),
          rotulo: c.querySelector('.university-numeros-rotulo')?.textContent.trim() ?? null,
          valor: c.querySelector('.university-numeros-valor')?.textContent.trim() ?? null,
          apoio: c.querySelector('.university-numeros-apoio')?.textContent.trim() ?? null,
          caixa: caixa(c),
          corDeFundo: ec.backgroundColor,
          corDaBorda: ec.borderTopColor,
          margemBloco: `${ec.marginTop} / ${ec.marginBottom}`,
          /* O texto do cartão herda o navy da folha porque ele é BRANCO sobre claro
             — é o que a referência quer, e `.on-dark` aqui o apagaria. */
          corDoValor: (() => {
            const v = c.querySelector('.university-numeros-valor');
            return v ? getComputedStyle(v).color : null;
          })(),
          corDoRotulo: (() => {
            const r = c.querySelector('.university-numeros-rotulo');
            return r ? getComputedStyle(r).color : null;
          })(),
          corDoApoio: (() => {
            const a = c.querySelector('.university-numeros-apoio');
            return a ? getComputedStyle(a).color : null;
          })(),
          numeroTabular: (() => {
            const v = c.querySelector('.university-numeros-valor');
            return v ? getComputedStyle(v).fontVariantNumeric : null;
          })(),
          /* O ícone virou RASTER derivado (`scripts/gerar-icones-numeros-university.mjs`)
             e não mais um `<svg>` da lucide, então a leitura antiga (`caixaSvg`)
             devolveria `null` para sempre e passaria por "medido".
             `naturalWidth` é o que denuncia 404 ou caminho errado: a caixa vem do CSS
             e continuaria certa mesmo com a imagem quebrada. 128 é o lado do arquivo. */
          icone: icone
            ? (() => {
                const img = icone.querySelector('img');
                return {
                  nu: icone.classList.contains('university-numeros-icone--nu'),
                  caixaQuadrado: caixa(icone),
                  caixaImg: caixa(img),
                  src: img ? img.getAttribute('src') : null,
                  naturalW: img ? img.naturalWidth : null,
                  carregou: !!img && img.naturalWidth > 0,
                  objectFit: img ? getComputedStyle(img).objectFit : null,
                  display: img ? getComputedStyle(img).display : null,
                };
              })()
            : null,
          /* O ANEL. Em repouso `opacity: 0` e SEM animação — é o estado que prova que
             o cometa não está repintando a página inteira à toa. `content` e não só
             `display`, pela mesma armadilha anotada no fio. */
          halo: (() => {
            const h = c.querySelector('.university-numeros-halo');
            if (!h) return null;
            const eh = getComputedStyle(h);
            const anel = getComputedStyle(h, '::before');
            return {
              opacidade: eh.opacity,
              pointerEvents: eh.pointerEvents,
              caixa: caixa(h),
              anelContent: anel.content,
              anelAnimacao: anel.animationName,
              anelEstado: anel.animationPlayState,
              anelPadding: anel.paddingTop,
              anelMascaraComposta: anel.maskComposite || anel.webkitMaskComposite || null,
              anelFundo: anel.backgroundImage.slice(0, 80),
              anelBorda: anel.borderTopWidth,
            };
          })(),
          /* O FIO e o NÓ: `display: none` na pilha é o resultado esperado a 390. */
          /* `content` e não só `display`: `getComputedStyle(el, '::before')` devolve
             um objeto mesmo para pseudo que NÃO existe, e ali `display` computa
             `block` por herança da cascata — foi o que aconteceu na primeira leitura
             do cartão 1, que não tem fio e mesmo assim dizia `display: block`. Quem
             decide se o pseudo é pintado é `content` (`none` = não existe). */
          /* Os pseudos do CARTÃO não desenham mais nada — o fio mudou para a fileira.
             Lidos ainda assim: `content: none` nos dois é a prova de que o desenho
             antigo saiu de cena e não ficou pintando duas vezes. */
          fio: { content: fio.content, display: fio.display, w: fio.width, fundo: fio.backgroundImage.slice(0, 70) },
          no: { content: no.content, display: no.display, w: no.width, borda: no.borderTopColor },
          /* CRESCIMENTO e FLUTUAÇÃO em propriedades SEPARADAS, e é por isso que as
             duas são lidas separadas: `scale` só existe sob o ponteiro, `translate` é
             o vaivém. Se um dia alguém reescrever qualquer uma das duas como
             `transform`, uma apagaria a outra — e o sintoma seria o cartão apontado
             não crescer. `transform` é lido junto justamente para denunciar isso. */
          escala: ec.scale,
          deslocamento: ec.translate,
          transform: ec.transform,
          animacao: ec.animationName,
          animacaoEstado: ec.animationPlayState,
          animacaoAtraso: ec.animationDelay,
          zIndex: ec.zIndex,
          /* A LINHA DO MEIO passou a existir nos TRÊS (antes era só o cartão do
             meio, onde a faixa embrulhava o par apoio+seta).
             `temFaixa` sozinho não prova a linha: a faixa é um `<div>` e existiria
             mesmo com `border-top: 0`. Daí a largura e a cor COMPUTADAS da borda.
             E `deslocamentoDoTraco` é a distância do traço ao TOPO DO CARTÃO — é o
             número que prova o alinhamento entre os três, que é o que ela pediu ao
             mostrar os três lado a lado. Medido sobre a caixa PINTADA de cada um;
             como os cartões flutuam em fases diferentes, tirar a diferença dentro
             do MESMO cartão cancela o deslocamento da animação. */
          temFaixa: !!c.querySelector('.university-numeros-faixa'),
          traco: (() => {
            const f = c.querySelector('.university-numeros-faixa');
            if (!f) return null;
            const e = getComputedStyle(f);
            const bf = f.getBoundingClientRect();
            const bc = c.getBoundingClientRect();
            return {
              borda: `${e.borderTopWidth} ${e.borderTopStyle} ${e.borderTopColor}`,
              larguraDoTraco: Math.round(bf.width * 10) / 10,
              deslocamentoDoTraco: Math.round((bf.top - bc.top) * 10) / 10,
              recuoAteOTexto: e.paddingTop,
            };
          })(),
          /* A SETA SAIU. `querySelector` da classe não basta como prova: se o
             `<span>` continuasse no TSX sem o CSS, ele viraria uma seta crua e
             `temSeta` seguiria `false` só porque a classe mudou. Conta-se também
             quantos SVG existem dentro do cartão — o único grafismo vetorial que
             restava era ela (os ícones são `<img>`). */
          temSeta: !!c.querySelector('.university-numeros-seta'),
          quantosSvg: c.querySelectorAll('svg').length,
        };
      }),

      /* O fio se pendura em `top: 50%` dos cartões 2 e 3. Se os centros divergirem,
         os dois segmentos deixam de ser colineares. */
      centrosDosCartoes: cartoes.map((c) => caixa(c).centroY),
      maiorDesvioDeCentro: (() => {
        const cs = cartoes.map((c) => caixa(c).centroY);
        return cs.length ? Math.round((Math.max(...cs) - Math.min(...cs)) * 10) / 10 : null;
      })(),

      assinatura: assinatura
        ? {
            texto: assinatura.textContent.trim(),
            caixa: caixa(assinatura),
            cor: getComputedStyle(assinatura).color,
            letterSpacing: getComputedStyle(assinatura).letterSpacing,
            /* A régua entra por `line-up` (scaleX) — no estado final tem de estar
               em `none`, senão ela ficou presa em zero de largura. */
            regua: (() => {
              const r = assinatura.querySelector('.university-numeros-regua');
              if (!r) return null;
              const er = getComputedStyle(r);
              return { w: caixa(r)?.w ?? null, transform: er.transform, origem: er.transformOrigin, opacidade: er.opacity };
            })(),
          }
        : null,

      /* A ENTRADA. `data-in` é escrito pelo `RevealScope`; o que interessa é o
         ESTADO FINAL de cada nó revelado — nada preso em `opacity: 0`. */
      reveal: {
        dataIn: secao.querySelector('[data-reveal-nome], [data-in]')?.getAttribute('data-in') ?? null,
        nosRevelados: Array.from(secao.querySelectorAll('[data-reveal]')).map((n) => ({
          preset: n.getAttribute('data-reveal'),
          i: getComputedStyle(n).getPropertyValue('--reveal-i').trim() || null,
          opacidade: getComputedStyle(n).opacity,
          transform: getComputedStyle(n).transform,
        })),
      },

      /* Os contadores: `.sr-only` guarda o valor final e o irmão `aria-hidden` é o
         que corre. Zero no aria-hidden depois de assentar = contador morto. */
      contadores: Array.from(secao.querySelectorAll('.university-numeros-valor')).map((v) => ({
        textoTotal: v.textContent.trim(),
        srOnly: v.querySelector('.sr-only')?.textContent.trim() ?? null,
        animado: v.querySelector('[aria-hidden]')?.textContent.trim() ?? null,
      })),

      motion: document.documentElement.dataset.motion ?? null,
      rolagemHorizontal: {
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        vaza: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      },
    };
  });

/* APONTAR o ponteiro para um seletor, por coordenada e não por `page.hover()`.
   `page.hover()` FALHOU aqui com `Timeout 30000ms exceeded`, e o motivo é legítimo: ele
   espera o elemento ficar ESTÁVEL (mesma caixa em dois quadros seguidos) antes de mover
   o mouse, e os cartões agora flutuam para sempre — nunca ficam estáveis. `mouse.move()`
   para o centro da caixa não faz essa checagem e produz um `:hover` de verdade (evento
   sintético de `mouseover` não acende `:hover` no CSS, então despachar evento não serve).
   O centro é lido no instante do movimento, e 8px de deriva não tiram o ponto de dentro
   de um cartão de 355x225. */
const apontar = async (p, sel) => {
  const b = await p.locator(sel).boundingBox();
  if (!b) throw new Error(`sem caixa para ${sel}`);
  await p.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
};

const abrir = async (ctx) => {
  const p = await ctx.newPage();
  p.on('console', (m) => { if (m.type() === 'error') res.erros.push(m.text()); });
  await p.goto(`${BASE}${ROTA}`, { waitUntil: 'networkidle' });
  await p
    .waitForSelector('[data-route-content][data-route-liberado="true"]', { timeout: 60000 })
    .catch(() => null);
  /* As fontes são `display: swap`: medir avanço horizontal antes de a Geist chegar
     mediria a fonte de queda, e a contagem de linhas da manchete viraria ruído. */
  await p.evaluate(() => document.fonts.ready);
  /* A seção nasce abaixo da dobra e a rota tem reveal-on-scroll: sem rolar até ela,
     a captura sai vazia e o estado final nunca é alcançado. */
  await p.evaluate(() => document.querySelector('#university-numeros')?.scrollIntoView({ block: 'center' }));
  await p.waitForTimeout(2200);
  return p;
};

for (const width of LARGURAS) {
  const ctx = await nav.newContext({ viewport: { width, height: width === 390 ? 844 : 900 } });
  await ctx.addInitScript(() => localStorage.setItem('sistran-motion-preference-seen', '1'));
  const p = await abrir(ctx);
  res.porLargura[width] = await sonda(p);
  const no = await p.$('#university-numeros');
  if (no) await no.screenshot({ path: `docs/capturas/sis284-secao-${width}-${MOMENTO}.png` });
  await p.screenshot({ path: `docs/capturas/sis284-quadro-${width}-${MOMENTO}.png` });
  await ctx.close();
}

/* ── A FLUTUAÇÃO ─────────────────────────────────────────────────────────────────
 * Estilo computado não prova movimento: `animation-name` preenchido só diz que a regra
 * existe. A prova é AMOSTRAR o `translate` de cada cartão em instantes diferentes e ver
 * o valor mudar — e ver os três em pontos DIFERENTES da onda no mesmo instante, que é o
 * efeito do atraso negativo. Também se lê o topo pintado, para confirmar que a amplitude
 * é a pedida (8px de pico) e não algo que empurra a seção.
 */
{
  const ctx = await nav.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addInitScript(() => localStorage.setItem('sistran-motion-preference-seen', '1'));
  const p = await abrir(ctx);
  res.flutuacao = { amostras: [] };
  for (let i = 0; i < 6; i += 1) {
    res.flutuacao.amostras.push(
      await p.evaluate(() =>
        Array.from(document.querySelectorAll('.university-numeros-cartao')).map((c) => ({
          translate: getComputedStyle(c).translate,
          topo: Math.round(c.getBoundingClientRect().top * 10) / 10,
        })),
      ),
    );
    await p.waitForTimeout(500);
  }
  await ctx.close();
}

/* ── O PONTEIRO EM CADA CARTÃO ───────────────────────────────────────────────────
 * Só a 1440 e só com ponteiro fino, que é onde a regra existe. Para cada cartão
 * apontado mede-se: (a) o cartão apontado assumiu borda ciano, a sombra do destaque e
 * o anel em `opacity: 1` com o cometa rodando; (b) o cartão do meio RECUOU quando o
 * ponteiro está sobre outro (é o `:has()`, e é o que impede dois realces); (c) o
 * desvio de centro dos três continua o mesmo do repouso — a prova de que o realce não
 * mexeu em geometria e o fio da ligação segue colinear.
 */
{
  const ctx = await nav.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addInitScript(() => localStorage.setItem('sistran-motion-preference-seen', '1'));
  const p = await abrir(ctx);
  res.hover = {};
  for (const i of [0, 1, 2]) {
    await apontar(p, `.university-numeros-cartao:nth-child(${i + 1})`);
    /* Meia transição (`--motion-base` é 420ms) não conta: a leitura tem de cair
       depois de a `transition` de `box-shadow` assentar. */
    await p.waitForTimeout(700);
    const leitura = await sonda(p);
    res.hover[`cartao${i + 1}`] = {
      maiorDesvioDeCentro: leitura.maiorDesvioDeCentro,
      cartoes: leitura.cartoes.map((c) => ({
        destaque: c.destaque,
        rotulo: c.rotulo,
        corDaBorda: c.corDaBorda,
        margemBloco: c.margemBloco,
        /* `getBoundingClientRect` JÁ inclui o `transform`, então esta caixa é a
           PINTADA: sob o ponteiro ela cresce, e a do vizinho não muda — que é a prova
           de que o crescimento não relayoutou a fileira. */
        caixa: c.caixa,
        escala: c.escala,
        deslocamento: c.deslocamento,
        animacaoEstado: c.animacaoEstado,
        zIndex: c.zIndex,
        halo: c.halo,
      })),
    };
    await p.screenshot({ path: `docs/capturas/sis284-hover${i + 1}-1440-${MOMENTO}.png` });
  }
  /* Ponteiro FORA dos cartões: tudo tem de voltar ao repouso, inclusive o anel. */
  await apontar(p, '#university-numeros-titulo');
  await p.waitForTimeout(700);
  res.hover.foraDosCartoes = (await sonda(p)).cartoes.map((c) => ({
    rotulo: c.rotulo,
    corDaBorda: c.corDaBorda,
    haloOpacidade: c.halo?.opacidade ?? null,
    haloAnimacao: c.halo?.anelAnimacao ?? null,
  }));
  await ctx.close();
}

/* ── Movimento reduzido, os dois canais ─────────────────────────────────────── */
res.reduce = {};
for (const canal of ['mediaQuery', 'atributo']) {
  const ctx = await nav.newContext({
    viewport: { width: 1440, height: 900 },
    ...(canal === 'mediaQuery' ? { reducedMotion: 'reduce' } : {}),
  });
  await ctx.addInitScript(() => localStorage.setItem('sistran-motion-preference-seen', '1'));
  /* Atributo posto à mão não sobrevive: o app reescreve `data-motion` a partir da
     preferência gravada. A preferência É o canal. */
  if (canal === 'atributo') {
    await ctx.addInitScript(() => localStorage.setItem('sistran-motion-preference', 'reduce'));
  }
  const p = await abrir(ctx);
  /* APONTANDO o primeiro cartão: é sob o ponteiro que o cometa existiria, então é o
     único estado em que se pode provar que ele morreu e que o anel ficou. Medir em
     repouso aqui não diria nada — em repouso não há animação nenhuma de todo modo. */
  await apontar(p, '.university-numeros-cartao:nth-child(1)').catch(() => null);
  await p.waitForTimeout(700);
  res.reduce[canal] = await sonda(p);
  if (canal === 'atributo') {
    const no = await p.$('#university-numeros');
    if (no) await no.screenshot({ path: `docs/capturas/sis284-secao-1440-reduce-${MOMENTO}.png` });
  }
  await ctx.close();
}

/* ── Sem JavaScript ─────────────────────────────────────────────────────────── */
{
  const ctx = await nav.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
  const p = await ctx.newPage();
  await p.goto(`${BASE}${ROTA}`, { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(1500);
  res.semJS = await p.evaluate(() => {
    const s = document.querySelector('#university-numeros');
    if (!s) return { ausente: true };
    return {
      /* Sem JS o `RevealScope` não escreve `data-in`, e os presets só se esconde
         quando um ancestral diz `data-in="false"` — logo a seção nasce PRONTA. */
      cartoes: Array.from(s.querySelectorAll('.university-numeros-cartao')).map((c) => ({
        opacidade: getComputedStyle(c).opacity,
        transform: getComputedStyle(c).transform,
        h: Math.round(c.getBoundingClientRect().height),
      })),
      /* O valor final tem de estar no HTML do servidor. */
      valores: Array.from(s.querySelectorAll('.university-numeros-valor')).map((v) => v.textContent.trim()),
      manchete: s.querySelector('#university-numeros-titulo')?.textContent.trim() ?? null,
    };
  }).catch((e) => ({ erro: String(e) }));
  const no = await p.$('#university-numeros');
  if (no) await no.screenshot({ path: `docs/capturas/sis284-secao-1440-semjs-${MOMENTO}.png` });
  await ctx.close();
}

await nav.close();
await writeFile(`docs/medidas/sis284-${MOMENTO}.json`, `${JSON.stringify(res, null, 1)}\n`);
console.log(JSON.stringify(res, null, 1));
