/**
 * SIS-272 (reparo 29/09) — confere, na página renderizada, que os Números da home
 * voltaram a ser o `Metrics` de SETE e que `/quem-somos` continua com a faixa de três.
 *
 * Por que sonda: dos quatro itens de aceite, três são afirmações sobre o DOM final
 * («layout Metrics e não a faixa», «Sobre nós intacto», «`#resultados`/ScrollSpy OK,
 * 390–1440 sem overflow») e um é sobre a escrita na tela («sete valores/rótulos
 * exatamente como a tabela»). Nenhum deles se responde pelo JSX: `id` duplicado,
 * `ScrollSpy` sem alvo e transbordo só existem depois de o navegador resolver a rota.
 *
 * Duas decisões de método:
 *   1. Os sete pares são lidos do DOM e comparados com a TABELA DA ISSUE escrita à
 *      mão aqui embaixo — não com `metrics.ts`. Comparar o dado consigo mesmo passaria
 *      mesmo se o dado estivesse errado.
 *   2. `#resultados` é contado com `querySelectorAll`, e não localizado com
 *      `querySelector`: o defeito que este reparo tinha de evitar é DUPLICAR o id
 *      (o `Metrics` traz o dele), e um `querySelector` acharia o primeiro e calaria.
 *
 * Uso: node scripts/medir-numeros-home-sis272.mjs
 */

import { writeFileSync } from 'node:fs';

const PLAYWRIGHT =
  'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/361ceb562f3b3235/node_modules/playwright/index.mjs';
const SHELL =
  process.env.LOCALAPPDATA +
  '/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe';

const BASE = 'http://localhost:3000';
const SAIDA = 'docs/medidas/numeros-home-sis272.json';

/* A tabela da issue, transcrita à mão. É o lado independente da comparação. */
const TABELA = [
  ['850+', 'Membros do Grupo Sistran'],
  ['23+', 'Prêmios e Reconhecimentos'],
  ['130+', 'Clientes'],
  ['650+', 'Mil horas de Capacidade Produtiva no Brasil'],
  ['230+', 'Implementação de ERPs'],
  ['35+', 'Total de Seguradoras'],
  ['25+', 'Implantações de Sinistro'],
];

const { chromium } = await import(PLAYWRIGHT);
const navegador = await chromium.launch({ executablePath: SHELL });

async function abrir(rota, largura, seletor, { reduzido = false } = {}) {
  const ctx = await navegador.newContext({
    viewport: { width: largura, height: 900 },
    /* `reducedMotion` entra pelo CONTEXTO porque é o que `matchMedia` lê, e é
       `matchMedia` que o hook `useReducedMotion` observa. */
    ...(reduzido ? { reducedMotion: 'reduce' } : {}),
  });
  await ctx.addInitScript(() => sessionStorage.setItem('sistran:intro-visto', 'true'));
  const p = await ctx.newPage();
  await p.goto(`${BASE}${rota}`, { waitUntil: 'domcontentloaded' });
  await p.waitForSelector(seletor, { timeout: 90000 });
  await p.addStyleTag({ content: 'nextjs-portal{display:none!important}' });
  /* Rolar a rota inteira: o palco da Metrics é `sticky` com percurso próprio e as
     células só assumem o valor final depois de o contador rodar. */
  await p.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 700) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 70));
    }
  });
  await p.waitForTimeout(400);
  /* ⚠️ E DEPOIS VOLTAR PARA A FAIXA, senão a leitura do número dá «0+».
     O contador de `FaixaIndicadores` é ligado por `IntersectionObserver` e o ramo
     `if (!active)` reescreve o nó com o valor INICIAL quando a faixa sai da
     viewport. Medindo no fim da rolagem, a faixa está a ~3390px acima e o contador
     já voltou ao zero — o que a sonda leria não é o que a pessoa vê. Não é defeito
     do componente: com a faixa na tela ele conta, e é esse o estado a medir.
     `block: 'center'` e não `scrollIntoView()` seco: o default encosta o topo da
     faixa na borda, e o limiar do observador é 0.25. */
  await p.evaluate((s) => {
    document.querySelector(s)?.scrollIntoView({ block: 'center' });
  }, seletor);
  /* ⚠️ JANELA DE REPOUSO, e não «esperar a contagem». Com o loop dos sete há dois
     prazos: o último contador só chega ao fim em `140×6 + 1800 = 2640ms` (a onda é
     defasada), e o primeiro RECOMEÇA em `1800 + 3600 = 5400ms`. Medir antes de 2640
     leria um dígito no meio do caminho; medir depois de 5400, também. 3200ms cai com
     folga nos dois lados. Se a pausa ou a defasagem mudarem em
     `FaixaIndicadores.tsx`, esta conta muda com elas. */
  await p.waitForTimeout(3200);
  return { ctx, p };
}

const LER_HOME = () => {
  const doc = document.documentElement;
  const limpar = (s) => (s ?? '').replace(/\s+/g, ' ').trim();
  const celulas = Array.from(document.querySelectorAll('.sobre-metricas--sete .sobre-metrica'));

  /* ⚠️ O valor tem DUAS cópias no DOM da faixa: o contador (`aria-hidden`, com o
     dígito que está na tela) e um `.sr-only` com o valor real desde o primeiro
     quadro. Ler só o `textContent` da célula juntaria os dois — «850+850+». O que
     interessa ao aceite é o VISÍVEL, então o valor sai do contador; o `sr-only` é
     registrado ao lado para confirmar que a leitura de tela recebe o mesmo. */
  /* ⚠️ MEDIR A PALAVRA MAIS LARGA DO RÓTULO, e não só a caixa do `<p>`.
     A passada anterior mediu apenas o NÚMERO caber na coluna e deu tudo verde — e a
     tela mostrava «RECONHECIMENTOS» cruzando a régua para dentro da célula vizinha.
     O `<p>` tem a largura da coluna por ser bloco, então `getBoundingClientRect()`
     dele NUNCA denuncia o transbordo; o que transborda é o glifo, porque a palavra é
     indivisível e mais larga que o conteúdo disponível. `scrollWidth` do `<p>` pega
     isso, e a régua de `Range` por palavra diz QUAL palavra é a culpada — que é a
     informação de que a correção precisa para escolher entre encolher e quebrar. */
  const larguraDaMaiorPalavra = (p) => {
    if (!p) return null;
    const alvo = p.firstChild;
    if (!alvo || alvo.nodeType !== 3) return null;
    const texto = alvo.textContent;
    let maior = 0;
    let qual = '';
    const r = document.createRange();
    for (const m of texto.matchAll(/\S+/g)) {
      r.setStart(alvo, m.index);
      r.setEnd(alvo, m.index + m[0].length);
      const w = r.getBoundingClientRect().width;
      if (w > maior) {
        maior = w;
        qual = m[0];
      }
    }
    return { palavra: qual, w: Math.round(maior) };
  };

  const pares = celulas.map((c) => {
    const num = c.querySelector('.sobre-metrica-topo span[aria-hidden]');
    const caixaNum = num?.getBoundingClientRect();
    const caixaCel = c.getBoundingClientRect();
    const rot = c.querySelector('.sobre-metrica-rotulo');
    const maior = larguraDaMaiorPalavra(rot);
    /* O espaço REAL para o texto: a coluna menos os recuos da célula. */
    const est = rot ? getComputedStyle(rot) : null;
    const estCel = getComputedStyle(c);
    const vaoTexto = rot
      ? Math.round(
          rot.getBoundingClientRect().width -
            parseFloat(est.paddingLeft) -
            parseFloat(est.paddingRight),
        )
      : null;
    return {
      /* O veredito que faltava: a maior palavra cabe no vão do texto? */
      rotuloCabe: !!maior && !!vaoTexto && maior.w <= vaoTexto + 0.5,
      rotuloTransbordo: rot ? Math.round(rot.scrollWidth - rot.clientWidth) : null,
      maiorPalavra: maior,
      vaoTexto,
      recuoCelula: `${estCel.paddingLeft}/${estCel.paddingRight}`,
      rotuloTam: est?.fontSize ?? null,
      rotuloTracking: est?.letterSpacing ?? null,
      rotuloQuebra: est?.overflowWrap ?? null,
      valor: limpar(num?.textContent),
      srOnly: limpar(c.querySelector('.sr-only')?.textContent) || null,
      rotulo: limpar(c.querySelector('.sobre-metrica-rotulo')?.textContent),
      /* Item «não inventar legendas novas»: a faixa de sete não pode ter frase. */
      detalhe: limpar(c.querySelector('.sobre-metrica-detalhe')?.textContent) || null,
      /* O risco geométrico dos sete: o número e o ícone têm de caber na coluna. */
      cabe: !!caixaNum && caixaNum.right <= caixaCel.right + 0.5,
      sobraNaColuna: caixaNum ? Math.round(caixaCel.right - caixaNum.right) : null,
      colunaW: Math.round(caixaCel.width),
      numTam: num ? getComputedStyle(num).fontSize : null,
      /* Quantas fileiras: células com o mesmo `y` estão na mesma fileira. */
      y: Math.round(caixaCel.top),
    };
  });

  return {
    janela: doc.clientWidth,
    transbordo: doc.scrollWidth - doc.clientWidth,
    /* O layout pedido: a faixa, com o modificador de escala dos sete. */
    faixaMontada: document.querySelectorAll('.sobre-metricas').length,
    seteMontada: document.querySelectorAll('.sobre-metricas--sete').length,
    avulsaNaHome: document.querySelectorAll('.sobre-metricas--avulsa').length,
    /* A aresta em degrau NÃO pode estar aqui: não há foto acima para acompanhar. */
    arestaNaHome: document.querySelectorAll('.sobre-metricas-aresta').length,
    /* O layout que saiu: o scrollytelling de cartão, ícone em caixa e trilho. */
    metricsMontada: !!document.querySelector('.impact-scroll'),
    fileiras: [...new Set(celulas.map((c) => Math.round(c.getBoundingClientRect().top)))].length,
    /* A régua de 1px é o que separa as células no lugar da moldura. */
    reguas: celulas.filter((c) => getComputedStyle(c).borderLeftWidth !== '0px').length,
    /* O defeito a não reabrir: `id` duplicado. Tem de ser exatamente 1. */
    idResultados: document.querySelectorAll('#resultados').length,
    nomeAcessivel:
      document.querySelector('#resultados')?.getAttribute('aria-label') ??
      document.querySelector('#resultados')?.getAttribute('aria-labelledby') ??
      null,
    /* O contrato do ScrollSpy: cada parada declarada em `pageSections.ts` para a
       home tem de achar um nó com aquele `id`. A lista é transcrita à mão (linhas
       65/84/85/104/122) em vez de lida das âncoras renderizadas — o defeito a pegar
       é uma parada SEM alvo, e uma parada sem alvo pode muito bem não ter âncora
       nenhuma na tela, o que faria a leitura pelo DOM devolver silêncio. */
    spy: ['top', 'solucoes', 'resultados', 'contato', 'social'].map((id) => ({
      id,
      alvos: document.querySelectorAll(`#${id}`).length,
    })),
    celulas: celulas.length,
    pares,
    /* A faixa 1988/150+/18 não pode estar escrita na home. */
    faixa1988NoTexto: /\b1988\b/.test(document.body.innerText),
  };
};

const LER_QUEM_SOMOS = () => {
  const doc = document.documentElement;
  const faixa = document.querySelector('.sobre-metricas');
  return {
    janela: doc.clientWidth,
    transbordo: doc.scrollWidth - doc.clientWidth,
    faixaMontada: !!faixa,
    /* «Intacto» = com a aresta e os pontos, que é o que a rota sempre teve, e SEM o
       modificador de encaixe da home. */
    arestaPresente: !!document.querySelector('.sobre-metricas-aresta'),
    pontos: document.querySelectorAll('.sobre-metricas-ponto').length,
    avulsa: document.querySelectorAll('.sobre-metricas--avulsa').length,
    colunas: document.querySelectorAll('.sobre-metricas-grade > .sobre-metrica').length,
    numeros: Array.from(document.querySelectorAll('.sobre-metrica-topo')).map((n) =>
      n.textContent.replace(/\s+/g, ' ').trim(),
    ),
    rotulos: Array.from(document.querySelectorAll('.sobre-metrica-rotulo')).map((n) =>
      n.textContent.replace(/\s+/g, ' ').trim(),
    ),
  };
};

/**
 * O loop dos números, medido como COMPORTAMENTO e não como código.
 *
 * Amostra o texto dos sete a cada 120ms por 7,2s (duas voltas do ciclo de 5,4s) e
 * responde três coisas que a leitura de um instante não responde:
 *   · `mudou` — o dígito se move mesmo (senão o pedido não foi atendido);
 *   · `voltouAoFinal` — a última amostra é o valor final (o repouso é o dado, não
 *     um número qualquer no meio da rampa);
 *   · `fracaoParado` — quanto do tempo o número fica legível. Se isso for baixo, o
 *     efeito engoliu a informação, e é o risco real deste pedido.
 */
const LER_MOVIMENTO = async (finais) => {
  const nos = Array.from(
    document.querySelectorAll('.sobre-metricas--sete .sobre-metrica-topo span[aria-hidden]'),
  );
  const trilhas = nos.map(() => []);
  for (let t = 0; t < 60; t++) {
    nos.forEach((n, i) => trilhas[i].push(n.textContent.trim()));
    await new Promise((r) => setTimeout(r, 120));
  }
  return trilhas.map((tr, i) => {
    const distintos = new Set(tr);
    const noFinal = tr.filter((v) => v === finais[i]).length;
    return {
      esperadoFinal: finais[i],
      mudou: distintos.size > 1,
      valoresVistos: distintos.size,
      voltouAoFinal: tr[tr.length - 1] === finais[i],
      fracaoParado: Math.round((noFinal / tr.length) * 100),
      /* Um valor abaixo do inicial ou acima do alvo seria contagem quebrada. */
      foraDaFaixa: tr.some((v) => {
        const n = parseInt(v, 10);
        return Number.isNaN(n) || n < 0 || n > parseInt(finais[i], 10);
      }),
    };
  });
};

const resultado = { issue: 'SIS-272', nota: 'gerado por scripts/medir-numeros-home-sis272.mjs' };

/* 1280 entra na lista: é a largura em que a coluna de sete era mais estreita (4
   colunas ainda, 7 acima de 1440) e onde a quebra de «RECONHECIMENTOS» apareceu na
   tela da usuária. 1920 entra porque o recuo simétrico novo é `clamp` em `vw` e
   precisa ser medido no topo do intervalo, não só no piso. */
for (const largura of [390, 768, 1280, 1440, 1920]) {
  {
    const { ctx, p } = await abrir('/', largura, '.sobre-metricas--sete');
    resultado[`home-${largura}`] = await p.evaluate(LER_HOME);
    if (largura === 1440) {
      resultado.movimento = await p.evaluate(
        LER_MOVIMENTO,
        TABELA.map(([v]) => v),
      );
    }
    await ctx.close();
  }
  {
    const { ctx, p } = await abrir('/quem-somos', largura, '.sobre-metricas');
    resultado[`quem-somos-${largura}`] = await p.evaluate(LER_QUEM_SOMOS);
    await ctx.close();
  }
}

/* ── MOVIMENTO REDUZIDO ───────────────────────────────────────────────────────
   O defeito a pegar é o da régua da casa: matar o efeito e deixar o CONTEÚDO
   escondido. Com `reduce` o loop não roda — e o que tem de estar no nó é o valor
   FINAL, não o inicial. Um `0+` parado aqui seria a informação da seção apagada
   por uma regra de acessibilidade, que é o pior desfecho possível.

   ⚠️ ESTE BLOCO MEDE PELO MESMO `abrir()` DAS OUTRAS LARGURAS, e a primeira versão
   não: ela montava o contexto à mão e ia direto ao `scrollIntoView`. Resultado medido:
   `0+` nos sete — e `0+` TAMBÉM com `no-preference`, o que provou ser defeito da
   sonda, não do componente. Sem o aquecimento de rolagem da rota inteira o
   `scrollIntoView` não sai do lugar (a faixa continuava em `top=6622`), o
   `IntersectionObserver` nunca liga e o ramo `if (!active)` deixa o nó no valor
   INICIAL. Medir o caminho de acessibilidade por um atalho que o caminho normal não
   usa compara duas coisas diferentes. */
{
  const { ctx, p } = await abrir('/', 1440, '.sobre-metricas--sete', { reduzido: true });
  const mqCasa = await p.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  const antes = await p.evaluate(() =>
    Array.from(
      document.querySelectorAll('.sobre-metricas--sete .sobre-metrica-topo span[aria-hidden]'),
    ).map((n) => n.textContent.trim()),
  );
  /* Esperar mais um ciclo inteiro: se o loop estivesse rodando, mudaria. */
  await p.waitForTimeout(6000);
  const depois = await p.evaluate(() =>
    Array.from(
      document.querySelectorAll('.sobre-metricas--sete .sobre-metrica-topo span[aria-hidden]'),
    ).map((n) => n.textContent.trim()),
  );
  resultado.movimentoReduzido = {
    /* Registrado para o JSON não deixar dúvida de que a preferência chegou ao
       navegador: um `false` aqui invalida o resto do bloco. */
    preferenciaAtiva: mqCasa,
    valores: antes,
    parado: JSON.stringify(antes) === JSON.stringify(depois),
    mostraOFinal: JSON.stringify(antes) === JSON.stringify(TABELA.map(([v]) => v)),
  };
  await ctx.close();
}

/* A comparação com a tabela da issue, feita aqui fora do navegador para o JSON
   guardar o veredito e não só os dados. */
const home = resultado['home-1440'];
const conferencia = TABELA.map(([valor, rotulo], i) => {
  const lido = home.pares[i];
  return {
    esperado: { valor, rotulo },
    lido: lido ?? null,
    rotuloBate: lido?.rotulo === rotulo,
    /* O valor na tela pode vir do contador; o que se confere é o dígito + sufixo. */
    valorBate: !!lido && lido.valor.replace(/\s/g, '') === valor,
  };
});
resultado.conferenciaDaTabela = conferencia;
resultado.tabelaOk =
  home.pares.length === 7 && conferencia.every((c) => c.rotuloBate && c.valorBate);

await navegador.close();
writeFileSync(SAIDA, `${JSON.stringify(resultado, null, 2)}\n`);
console.log(SAIDA);
for (const largura of [390, 768, 1280, 1440, 1920]) {
  const h = resultado[`home-${largura}`];
  const q = resultado[`quem-somos-${largura}`];
  console.log(
    `\n── ${largura} ──` +
      `\n  HOME       transbordo=${h.transbordo} faixa=${h.faixaMontada} sete=${h.seteMontada}` +
      ` avulsa=${h.avulsaNaHome} aresta=${h.arestaNaHome} metricsAntiga=${h.metricsMontada}` +
      ` celulas=${h.celulas} fileiras=${h.fileiras} reguas=${h.reguas}` +
      `\n             #resultados=${h.idResultados} nome=${JSON.stringify(h.nomeAcessivel)} 1988=${h.faixa1988NoTexto}` +
      `\n             cabe=${JSON.stringify(h.pares.map((p) => p.cabe))} sobras=${JSON.stringify(h.pares.map((p) => p.sobraNaColuna))}` +
      `\n             colunaW=${h.pares[0]?.colunaW} numTam=${h.pares[0]?.numTam} detalhes=${JSON.stringify([...new Set(h.pares.map((p) => p.detalhe))])}` +
      `\n             rotuloCabe=${JSON.stringify(h.pares.map((p) => p.rotuloCabe))} transbordoRotulo=${JSON.stringify(h.pares.map((p) => p.rotuloTransbordo))}` +
      `\n             vao=${h.pares[0]?.vaoTexto} rotuloTam=${h.pares[0]?.rotuloTam} tracking=${h.pares[0]?.rotuloTracking} quebra=${h.pares[0]?.rotuloQuebra}` +
      `\n             maiores=${JSON.stringify(h.pares.map((p) => (p.maiorPalavra ? `${p.maiorPalavra.palavra}=${p.maiorPalavra.w}` : null)))}` +
      `\n             spy=${JSON.stringify(h.spy)}` +
      `\n  QUEM-SOMOS transbordo=${q.transbordo} faixa=${q.faixaMontada} aresta=${q.arestaPresente}` +
      ` avulsa=${q.avulsa} colunas=${q.colunas} pontos=${q.pontos}` +
      `\n             numeros=${JSON.stringify(q.numeros)} rotulos=${JSON.stringify(q.rotulos)}`,
  );
}
console.log(`\ntabelaOk=${resultado.tabelaOk}`);
for (const c of conferencia) {
  console.log(
    `  ${c.valorBate && c.rotuloBate ? 'ok ' : 'NÃO'} ${c.esperado.valor} ${c.esperado.rotulo}` +
      `  ← lido ${JSON.stringify(c.lido)}`,
  );
}
console.log('\n── MOVIMENTO (1440, 7,2s de amostragem a cada 120ms) ──');
for (const m of resultado.movimento ?? []) {
  console.log(
    `  ${m.esperadoFinal}  mudou=${m.mudou} valoresVistos=${m.valoresVistos}` +
      ` voltouAoFinal=${m.voltouAoFinal} parado=${m.fracaoParado}% foraDaFaixa=${m.foraDaFaixa}`,
  );
}
console.log(
  `\n── MOVIMENTO REDUZIDO ──\n  preferenciaAtiva=${resultado.movimentoReduzido.preferenciaAtiva}` +
    ` parado=${resultado.movimentoReduzido.parado}` +
    ` mostraOFinal=${resultado.movimentoReduzido.mostraOFinal}` +
    ` valores=${JSON.stringify(resultado.movimentoReduzido.valores)}`,
);
