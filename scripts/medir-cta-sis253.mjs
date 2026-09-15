/**
 * SIS-253 (2ª volta) — portões medidos do «Fale com a Gente!» de `/esg`.
 *
 * `node scripts/medir-cta-sis253.mjs`
 *
 * Mede, nas DUAS vias de movimento reduzido (`reducedMotion` do contexto = via do
 * `@media`; a via do `html[data-motion]` é conferida à parte porque depende do
 * atributo que o app escreve):
 *
 *  · contraste p5 tinta × p95 fundo do título, do parágrafo, do rótulo do botão e
 *    do disco ciano — o mesmo método das outras issues de contraste do time, para
 *    que os números sejam comparáveis;
 *  · o POUSO do ponto do fio no centro do círculo (`dx`/`dy` em px). É este número
 *    que prova que baixar a opacidade do vidro e mexer no botão não desalinhou a
 *    geometria de `FIO_CAMINHO`;
 *  · o `transform` computado do botão e do brilho no hover, que é como se prova
 *    que o avanço de 6px e o giro de 180° existem em movimento normal e NÃO
 *    existem em movimento reduzido.
 *
 * ⚠️ O disco ciano dá ~2,4:1 DE PROPÓSITO, e não é regressão a corrigir: a seta é
 * branca como na referência e o motivo está escrito na regra
 * `.cta-ref-botao-circulo` do `globals.css`.
 */

import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import sharp from 'sharp';
import { mkdir, rm, writeFile } from 'node:fs/promises';
const T='docs/medidas/.tmp253'; await mkdir(T,{recursive:true});
const canal=(v)=>{const s=v/255;return s<=0.03928?s/12.92:((s+0.055)/1.055)**2.4;};
const lum=(r,g,b)=>0.2126*canal(r)+0.7152*canal(g)+0.0722*canal(b);
const raz=(a,b)=>(Math.max(a,b)+0.05)/(Math.min(a,b)+0.05);
async function medir(f){const {data,info}=await sharp(f).raw().toBuffer({resolveWithObject:true});const n=info.channels;const a=[];
 for(let i=0;i<data.length;i+=n)a.push({l:lum(data[i],data[i+1],data[i+2]),c:`rgb(${data[i]},${data[i+1]},${data[i+2]})`});
 a.sort((x,y)=>x.l-y.l);const p=(q)=>a[Math.round(q*(a.length-1))];
 return {razao:Number(raz(p(0.05).l,p(0.95).l).toFixed(2)),tinta:p(0.05).c,fundo:p(0.95).c};}
const nav=await chromium.launch();
const res={};
for (const modo of ['normal','reduce']) {
  const ctx=await nav.newContext({viewport:{width:1440,height:900},deviceScaleFactor:2,
    reducedMotion: modo==='reduce'?'reduce':'no-preference'});
  await ctx.addInitScript(()=>localStorage.setItem('sistran-motion-preference-seen','1'));
  const p=await ctx.newPage();
  const erros=[]; p.on('console',(m)=>{if(m.type()==='error'||m.type()==='warning')erros.push(m.text());});
  await p.goto('http://localhost:3000/esg',{waitUntil:'networkidle'});
  await p.waitForSelector('[data-route-content][data-route-liberado="true"]',{timeout:30000});
  await p.waitForSelector('[data-route-loading]',{state:'detached',timeout:30000});
  const sec=p.locator('.cta-ref');
  await sec.evaluate((n)=>n.scrollIntoView({block:'center',behavior:'instant'}));
  await p.waitForTimeout(2500);
  const alvos={titulo:'.cta-ref-titulo',texto:'.cta-ref-texto',rotulo:'.cta-ref-botao',circulo:'.cta-ref-botao-circulo'};
  res[modo]={erros};
  for(const [k,s] of Object.entries(alvos)){
    const b=await p.locator(s).boundingBox();
    const f=`${T}/${modo}-${k}.png`; await p.screenshot({path:f,clip:b});
    res[modo][k]=await medir(f);
  }
  /* ⚠️ O RÓTULO É MEDIDO DUAS VEZES, e é a segunda que vale como contraste de TEXTO.
     `rotulo` acima recorta a PÍLULA INTEIRA — 237×56px, dos quais o texto ocupa
     ~12% da área e o disco ciano outros ~14%. Num recorte assim o percentil 5 não
     cai necessariamente na tinta: ele cai onde estiverem os 5% mais escuros do
     conjunto, e basta a proporção entre pílula branca, glifos e disco mudar para o
     número andar sem que cor nenhuma tenha mudado. Foi o que aconteceu entre as
     duas rodadas desta issue (5,75 → 3,49 com `color: #0a1f44` e `background: #fff`
     intactos): a medida estava descrevendo a MOLDURA, não a letra.
     `rotuloGlifos` recorta só a caixa do nó de texto, via `Range`, que é o recorte
     que a régua de contraste de texto do WCAG descreve. */
  {
    const cx=await p.evaluate(()=>{
      const b=document.querySelector('.cta-ref-botao');
      const no=[...b.childNodes].find((n)=>n.nodeType===3 && n.textContent.trim());
      if(!no) return null;
      const r=document.createRange(); r.selectNodeContents(no);
      const q=r.getBoundingClientRect();
      return {x:q.x,y:q.y,width:q.width,height:q.height};
    });
    if(cx){
      const f=`${T}/${modo}-rotulo-glifos.png`; await p.screenshot({path:f,clip:cx});
      res[modo].rotuloGlifos=await medir(f);
      res[modo].rotuloGlifos.caixa=`${Math.round(cx.width)}x${Math.round(cx.height)}`;
    }
  }
  /* ── o pouso ────────────────────────────────────────────────────────────────
     5ª VOLTA — O PONTO DEIXOU DE SERVIR DE RÉGUA DO POUSO, e medir por ele aqui
     daria número errado em silêncio: o percurso passou a ser um LAÇO infinito, então
     em movimento normal o ponto está quase sempre no meio do fio quando a sonda
     fotografa. `dx`/`dy` acusariam uma dessincronia de geometria que não existe.
     O pouso é uma propriedade do CAMINHO, não do enfeite que corre nele: o que tem
     de cair no centro do círculo é o ÚLTIMO VÉRTICE do `<path>`, e é ele que
     `getPointAtLength(getTotalLength())` devolve, em coordenadas do SVG,
     convertidas para a tela pela matriz do próprio elemento. Vale nas duas vias de
     movimento — inclusive com o laço desligado, onde o ponto está justamente ali. */
  res[modo].pouso=await p.evaluate(()=>{
    const ca=document.querySelector('.cta-ref-fio-traco');const ci=document.querySelector('.cta-ref-botao-circulo');
    if(!ca||!ci)return null;
    const q=ca.getPointAtLength(ca.getTotalLength());
    const m=ca.getScreenCTM(); const t=new DOMPoint(q.x,q.y).matrixTransform(m);
    const c=ci.getBoundingClientRect();
    return {dx:Math.round(t.x-(c.x+c.width/2)),dy:Math.round(t.y-(c.y+c.height/2))};});
  /* 5ª volta — «deixe passando uma bolinha dinamicamente nessa linha». O que prova
     o laço não é a existência da timeline: é o ponto estar em lugares DIFERENTES em
     amostras separadas, e voltar a passar (isto é, andar para a esquerda em algum
     par de amostras, o que só acontece se ele reiniciou). Em movimento reduzido as
     mesmas amostras têm de ser todas IGUAIS e no fim do fio. */
  res[modo].laco=await p.evaluate(()=>new Promise((ok)=>{
    const pt=document.querySelector('.cta-ref-fio-ponto');
    const am=[];
    const t=setInterval(()=>{
      const b=pt.getBoundingClientRect();
      am.push({x:Math.round(b.x),op:Number(getComputedStyle(pt).opacity)});
      if(am.length===12){clearInterval(t);
        const xs=am.map((a)=>a.x);
        ok({amostras:am,posicoesDistintas:new Set(xs).size,
            reiniciou:xs.some((v,i)=>i>0&&v<xs[i-1]-20),
            parado:new Set(xs).size===1});}
    },300);
  }));
  /* ── o checklist do §12 de `docs/orientacoes-componente-fale-com-a-gente.md`
     Cada item que é NÚMERO é medido aqui; os que são juízo visual («não parece um
     círculo perfeito», «não formam um X muito evidente») ficam para a captura, e o
     que se mede deles é o parâmetro que os produz (razão dos eixos, abertura entre
     as duas rotações). */
  res[modo].doc = await p.evaluate(() => {
    const r = (s) => document.querySelector(s)?.getBoundingClientRect() ?? null;
    const arte = r('.cta-ref-arte');
    const cartao = r('.cta-ref-cartao');
    const forma = document.querySelector('.cta-ref-blob path')?.getBoundingClientRect() ?? null;
    const selo = r('.cta-ref-selo');
    const orbA = r('.cta-ref-orbita-a');
    const balA = r('.cta-ref-balao-a');
    const balB = r('.cta-ref-balao-b');
    const secao = r('.cta-ref');
    const grau = (s) => {
      const m = new DOMMatrixReadOnly(getComputedStyle(document.querySelector(s)).transform);
      return Math.round(Math.atan2(m.b, m.a) * (180 / Math.PI));
    };
    const pct = (a, b) => (a && b ? Number(((a.width / b.width) * 100).toFixed(1)) : null);
    return {
      /* 5ª volta — O PAINEL TEM DE ESTAR OPACO («nao fique trasparente»). Aqui não
         serve a prova por diferença de quadros que o cartão da Carreira usou: atrás
         deste painel não há vídeo, só as faixas ESTÁTICAS de `.cta-ref-ondas`, e
         duas fotos de um fundo parado são iguais esteja o painel opaco ou não. O que
         decide é o alfa da camada de baixo do `background` mais a ausência de
         `backdrop-filter` — os dois canais pelos quais o fundo apareceria. */
      painel: (() => {
        const c = getComputedStyle(document.querySelector('.cta-ref-cartao'));
        return {
          backgroundImage: c.backgroundImage,
          backgroundColor: c.backgroundColor,
          backdropFilter: c.backdropFilter,
          /* SÓ A ÚLTIMA CAMADA DECIDE, e contar alfas em todas seria contar errado:
             as duas de cima SÃO translúcidas de propósito (é o banho ciano, o mesmo
             do hover dos cartões). Quem deixa o fundo passar é a camada de baixo —
             se ela for opaca e cobrir a caixa inteira, o painel é opaco por mais
             translúcido que esteja o que vem em cima. */
          ultimaCamadaOpaca: (() => {
            const s = c.backgroundImage;
            /* A última camada começa no último `…gradient(` da lista — recortar por
               vírgulas de topo é frágil, porque cada gradiente tem as suas. */
            const i = s.lastIndexOf('gradient(');
            return i >= 0 && !/rgba\([^)]*,\s*0?\.\d+\s*\)/.test(s.slice(i));
          })(),
        };
      })(),
      /* 5ª volta — «coloque essa linha mais para baixo»: a altura do trecho
         HORIZONTAL do fio, contada do topo do painel. É o número que o pedido move,
         e ele não é declarado em lugar nenhum — sai de `FIO_ALTURA` × largura do
         invólucro contra os 56% da altura do painel. Medido no traço real e não na
         caixa do SVG (que tem `overflow: visible` e é maior). */
      fioTopo: (() => {
        const t = document.querySelector('.cta-ref-fio-traco');
        const p = document.querySelector('.cta-ref-cartao');
        if (!t || !p) return null;
        const a = t.getBoundingClientRect(); const b = p.getBoundingClientRect();
        return {
          doTopoDoPainel: Math.round(a.top - b.top),
          alturaDoPainel: Math.round(b.height),
          tituloDoTopo: Math.round(document.querySelector('.cta-ref-titulo').getBoundingClientRect().top - b.top),
        };
      })(),
      /* O nó vazado tem de ficar DENTRO do vidro — foi o que a conta antiga
         (medida na janela) deixava escapar quando a margem crescia. */
      noDentroDoPainel: (() => {
        const n = document.querySelector('.cta-ref-fio-no');
        const p = document.querySelector('.cta-ref-cartao');
        if (!n || !p) return null;
        const a = n.getBoundingClientRect(); const b = p.getBoundingClientRect();
        return { folgaEsquerda: Math.round(a.left - b.left), dentro: a.left >= b.left };
      })(),
      /* item 1 — mais larga do que alta */
      formaLarguraAltura: forma ? Number((forma.width / forma.height).toFixed(3)) : null,
      /* item 4/§8 — sobreposição do painel com a forma azul, 80–150px no desktop */
      sobreposicaoPainelForma: cartao && arte ? Math.round(cartao.right - arte.left) : null,
      /* item 5 — o botão cobre o encontro dos dois blocos */
      botaoSobreEncontro: (() => {
        const b = r('.cta-ref-botao');
        return b && cartao && arte
          ? { botaoEsq: Math.round(b.left), botaoDir: Math.round(b.right), cartaoDir: Math.round(cartao.right), arteEsq: Math.round(arte.left) }
          : null;
      })(),
      /* §8 — proporções */
      seloPctArte: pct(selo, arte),
      /* ⚠️ A ÓRBITA NÃO PODE SER MEDIDA POR `getBoundingClientRect`: ela é rotacionada,
         e o rect é a caixa ALINHADA AOS EIXOS que envolve a elipse girada — sempre
         maior que a elipse. Com −8° de rotação a primeira leitura deu 98,8% da arte
         para uma elipse declarada em 94%, o que levaria a "corrigir" para dentro da
         faixa do §8 um valor que já estava dentro dela. `offsetWidth` é a caixa de
         layout, antes do `transform`. */
      orbitaPctArte: (() => {
        const o = document.querySelector('.cta-ref-orbita-a');
        const a = document.querySelector('.cta-ref-arte');
        return o && a ? Number(((o.offsetWidth / a.offsetWidth) * 100).toFixed(1)) : null;
      })(),
      orbitaBboxPctArte: pct(orbA, arte),
      balaoAPctArte: pct(balA, arte),
      balaoBPctArte: pct(balB, arte),
      /* item 7 — abertura entre as duas órbitas (o "X") */
      orbitaGraus: { a: grau('.cta-ref-orbita-a'), b: grau('.cta-ref-orbita-b'), abertura: Math.abs(grau('.cta-ref-orbita-a') - grau('.cta-ref-orbita-b')) },
      /* item 8 — nada cortado pela seção */
      balaoDentroDaSecao: secao && balA && balB
        ? balA.left >= secao.left - 1 && balA.right <= secao.right + 1 && balB.left >= secao.left - 1 && balB.right <= secao.right + 1
        : null,
      /* item 10 — sem rolagem horizontal */
      scrollWidth: document.documentElement.scrollWidth,
      /* item 11 — os loops do §10 respondem à preferência */
      animacoes: {
        selo: getComputedStyle(document.querySelector('.cta-ref-selo')).animationName,
        orbita: getComputedStyle(document.querySelector('.cta-ref-orbita-a')).animationName,
      },
      /* item 12 — o símbolo tem transparência real (canto do PNG servido) */
      seloSrc: document.querySelector('.cta-ref-selo img')?.getAttribute('src') ?? null,
      /* §4 — a ordem das camadas */
      camadas: Object.fromEntries(
        ['.cta-ref-ondas', '.cta-ref-blob', '.cta-ref-orbita-a', '.cta-ref-selo', '.cta-ref-balao-a', '.cta-ref-cartao', '.cta-ref-botao', '.cta-ref-arte']
          .map((s) => [s, getComputedStyle(document.querySelector(s)).zIndex]),
      ),
    };
  });
  if(modo==='normal'){
    await p.locator('.cta-ref-botao').hover(); await p.waitForTimeout(700);
    const cx=await sec.boundingBox();
    await p.screenshot({path:'docs/capturas/sis253-esg-cta-1440-hover.png',clip:cx});
    res.hover=await p.evaluate(()=>{const b=document.querySelector('.cta-ref-botao');
      const g=document.querySelector('.cta-ref-botao-circulo');
      return {botao:getComputedStyle(b).transform, brilho:getComputedStyle(g,'::before').transform};});
  } else {
    const cx=await sec.boundingBox();
    await p.screenshot({path:'docs/capturas/sis253-esg-cta-1440-reduce.png',clip:cx});
    await p.locator('.cta-ref-botao').hover(); await p.waitForTimeout(700);
    res.reduceHover=await p.evaluate(()=>({botao:getComputedStyle(document.querySelector('.cta-ref-botao')).transform}));
  }
  await ctx.close();
}
/* ── a SEGUNDA via de movimento reduzido, e o mobile do §9 ────────────────────
   `reducedMotion` do Playwright só exercita o `@media`. A via que o botão de
   preferência do site usa é o atributo em `<html>`, e é ela que a SIS-183 registra
   como a esquecida — então ela é medida escrevendo o atributo, não emulando. */
{
  const ctx = await nav.newContext({viewport:{width:1440,height:900},deviceScaleFactor:2});
  await ctx.addInitScript(()=>localStorage.setItem('sistran-motion-preference-seen','1'));
  const p = await ctx.newPage();
  await p.goto('http://localhost:3000/esg',{waitUntil:'networkidle'});
  await p.waitForSelector('[data-route-content][data-route-liberado="true"]',{timeout:30000});
  await p.waitForSelector('[data-route-loading]',{state:'detached',timeout:30000});
  await p.evaluate(()=>document.documentElement.setAttribute('data-motion','reduce'));
  await p.locator('.cta-ref').evaluate((n)=>n.scrollIntoView({block:'center',behavior:'instant'}));
  await p.waitForTimeout(1200);
  res.dataMotionReduce = await p.evaluate(()=>({
    selo: getComputedStyle(document.querySelector('.cta-ref-selo')).animationName,
    orbita: getComputedStyle(document.querySelector('.cta-ref-orbita-a')).animationName,
    seloTransform: getComputedStyle(document.querySelector('.cta-ref-selo')).transform,
  }));
  /* §9 — em tela pequena o visual volta ao FLUXO do documento, e o que prova isso é
     o `position` computado da arte mais a ausência de rolagem horizontal. */
  await p.setViewportSize({width:390,height:844});
  await p.waitForTimeout(800);
  await p.evaluate(()=>document.documentElement.removeAttribute('data-motion'));
  await p.locator('.cta-ref').evaluate((n)=>n.scrollIntoView({block:'center',behavior:'instant'}));
  await p.waitForTimeout(1200);
  res.mobile390 = await p.evaluate(()=>{
    const arte=document.querySelector('.cta-ref-arte');
    const s=document.querySelector('.cta-ref');
    const bal=[...document.querySelectorAll('.cta-ref-balao')].map((n)=>n.getBoundingClientRect());
    const cs=s.getBoundingClientRect();
    return {
      artePosition: getComputedStyle(arte).position,
      scrollWidth: document.documentElement.scrollWidth,
      baloesDentro: bal.every((b)=>b.left>=cs.left-1 && b.right<=cs.right+1),
      arte: (()=>{const b=arte.getBoundingClientRect();return `${Math.round(b.width)}x${Math.round(b.height)}`;})(),
    };
  });
  await p.screenshot({path:'docs/capturas/sis253-esg-cta-390.png',clip:await p.locator('.cta-ref').boundingBox()});
  await ctx.close();
}
await writeFile('docs/medidas/cta-referencia-sis253-depois.json', JSON.stringify(res,null,1)+'\n');
console.log(JSON.stringify(res,null,1));
await rm(T,{recursive:true,force:true}); await nav.close();
