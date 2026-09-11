/**
 * SIS-226 — contraste das TRÊS LEGENDAS que voltaram a ciclar no hero da home
 * (`src/components/ui/HeroCaptions.tsx`), nos dois regimes de cor da SIS-178:
 *   • 1440 e 1024 → regime A: tinta escura na coluna branca (`.hero-sheet`)
 *   • 390         → regime C: tinta clara sobre o vídeo em sangria
 *
 * Irmã de `medir-contraste-hero-pitch.mjs` e com o MESMO método — a letra por
 * diferença entre duas abas, uma com tinta e outra com a tinta apagada; o par
 * `razao` (corpo da letra, quem decide) e `rasterPior` (pior pixel com franja de
 * antialiasing dentro), como manda `docs/medidas/COMO-MEDIR-CONTRASTE.md` §7. A
 * nota longa sobre por que o retângulo do texto NÃO serve de recorte está lá, no
 * cabeçalho daquele arquivo, e vale igual aqui.
 *
 * ── O QUE MUDA EM RELAÇÃO À SONDA DO PITCH ─────────────────────────────────
 * O pitch podia ser medido em `scrollY: 0`. Uma legenda NÃO: ela só existe dentro
 * da própria janela de rolagem (0.10, 0.32 e 0.51 do percurso são os centros —
 * `JANELAS` em `ui/HeroCaptions.tsx`), e fora dela está em `opacity: 0`. Então:
 *
 *  1. Cada legenda é medida NO CENTRO DA JANELA DELA, e a posição é conferida pela
 *     opacidade do bloco (`>= 0.98`); abaixo disso a legenda está entrando ou
 *     saindo, o alfa da tinta caiu e o piso não se aplica àquele quadro.
 *  2. A rolagem passa pelo Lenis e a Fase A é encerrada com um gesto de roda —
 *     as duas armadilhas medidas em `scripts/medir-sequencia-hero-sis226.mjs`
 *     (ver a nota lá): sem encerrar a Fase A, ela reescreve a posição por baixo;
 *     sem o Lenis, o quadro seguinte volta para onde ele achava que estava.
 *  3. As DUAS abas têm de parar no MESMO ponto, senão a diferença A−B mistura dois
 *     quadros do vídeo. Daí a espera e o `estabilizar` (dois quadros iguais).
 *
 * Nada aqui entra no bundle: é ferramenta de bancada.
 *   node scripts/medir-contraste-legendas-sis226.mjs
 *   LARGURAS=390 node scripts/medir-contraste-legendas-sis226.mjs
 */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import sharp from 'sharp';

const BASE = process.env.BASE_URL ?? 'http://localhost:3000';
const LARGURAS = process.env.LARGURAS
  ? process.env.LARGURAS.split(',').map(Number)
  : [1440, 1024, 390];
const ALTURA = 900;
/* Patamar de TODAS as linhas de cada legenda — e este número NÃO é o centro da
   janela, que foi a primeira versão e media errado. As janelas são
   `[[0.01,0.08,0.15,0.2],[0.24,0.31,0.36,0.41],[0.44,0.5,0.54,0.58]]` e cada linha
   entra com `atraso` próprio (`ui/HeroCaptions.tsx`): o apoio tem `atraso: 0.02`, o
   maior dos três, então a rampa dele é `[entraDe+0.02, entraAte+0.02]` e ele só
   assenta DEPOIS do fim da janela de entrada. MEDIDO: no centro 0.32 o apoio da
   legenda 2 estava em alfa 0,762 (0,88 da tinta × 0,857 da própria rampa) e o da 3
   em 0,726 — abaixo do corte de corpo (0,85), então a sonda devolvia
   `indeterminado` por não achar UM pixel de corpo. Não era falta de contraste: era
   ponto de medição errado, num quadro em que a letra ainda estava entrando.
   O patamar de cada legenda é `[entraAte + 0.02, saiDe]`, e o que está aqui é o
   meio dele. */
const CENTROS = [0.125, 0.345, 0.53];
const CORPO = 0.85;
const MIUDO = 16;
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
const compor = (fg, a, bg) => fg.map((c, i) => Math.round(c * a + bg[i] * (1 - a)));

/* Os alvos de UMA legenda. O sobretítulo só existe na segunda (slide 2 é o único
   com `eyebrow`), e alvo ausente sai como `null` em vez de virar reprovação. */
const alvosDe = (i) => {
  const raiz = `.hero-captions:not(.hero-pitch) .hero-caption:nth-child(${i + 1})`;
  return {
    sobretitulo: `${raiz} .hero-caption-eyebrow`,
    titulo: `${raiz} .hero-caption-title`,
    /* A segunda linha do título tem tinta PRÓPRIA nos dois regimes (`#a8e0ff` sobre
       o vídeo, `#0f5590` sobre a coluna branca) — é alvo separado, não decoração. */
    'titulo-linha-2': `${raiz} .hero-caption-title span`,
    apoio: `${raiz} .hero-caption-lead`,
  };
};

const LEVANTAR = (alvos) => {
  const corDe = (bruto) => bruto.match(/-?[\d.]+/g).map(Number);
  const fora = {};
  for (const [id, seletor] of Object.entries(alvos)) {
    const e = document.querySelector(seletor);
    if (!e) {
      fora[id] = null;
      continue;
    }
    const c = getComputedStyle(e);
    const n = corDe(c.webkitTextFillColor || c.color);
    let alfa = n.length > 3 ? n[3] : 1;
    for (let p = e; p; p = p.parentElement) {
      const o = Number(getComputedStyle(p).opacity);
      if (!Number.isNaN(o)) alfa *= o;
    }
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
          tintas: [n.slice(0, 3)],
          sombra: c.textShadow === 'none' ? undefined : c.textShadow,
          alfa: Math.round(alfa * 1000) / 1000,
          px: Math.round(parseFloat(c.fontSize) * 100) / 100,
          peso: c.fontWeight,
          caixas,
        }
      : null;
  }
  return fora;
};

/* Apaga a tinta de TODA a coluna de legendas, e não só da legenda medida: as
   quatro escritas dividem a mesma célula do grid, e um glifo de outra que
   sobrevivesse à apagadela entraria no recorte como "fundo" escuro (o vício nº 2
   do cabeçalho da sonda do pitch). O `text-shadow` FICA — no regime C é ele o
   fundo imediato da letra clara. */
const APAGAR = () => {
  const raizes = document.querySelectorAll('.hero-captions');
  let teimosos = 0;
  for (const raiz of raizes) {
    for (const f of [raiz, ...raiz.querySelectorAll('*')]) {
      const a = getComputedStyle(f);
      if (a.webkitBackgroundClip === 'text' || a.backgroundClip === 'text')
        f.style.setProperty('background-image', 'none', 'important');
      f.style.setProperty('color', 'transparent', 'important');
      f.style.setProperty('-webkit-text-fill-color', 'transparent', 'important');
      f.style.setProperty('fill', 'transparent', 'important');
    }
    teimosos += [...raiz.querySelectorAll('*')].filter((f) => {
      const a = getComputedStyle(f);
      return (a.webkitTextFillColor || a.color).replace(/\s/g, '') !== 'rgba(0,0,0,0)';
    }).length;
  }
  return teimosos;
};

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
  const pagina = await navegador.newPage({ viewport: { width: largura, height: ALTURA } });
  await pagina.addInitScript(() => {
    localStorage.setItem('sistran-motion-preference-seen', '1');
  });
  await pagina.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 180_000 });
  await pagina.waitForSelector('.hero-captions .hero-caption', { timeout: 180_000 });
  await pagina.addStyleTag({
    content:
      'header.fixed,nav.fixed{display:none!important}' +
      'nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button],[class*=motion-banner],[class*=motion-dialog]{display:none!important}',
  });
  /* Encerra a Fase A (SIS-189) antes de qualquer medição: enquanto ela dura, a
     fração do vídeo vira `scrollTo` e arrasta a página de volta. */
  await pagina.evaluate(() => {
    window.dispatchEvent(new WheelEvent('wheel', { deltaY: 1, bubbles: true }));
  });
  await new Promise((res) => setTimeout(res, 800));
  if (apagar) {
    const teimosos = await pagina.evaluate(APAGAR);
    return { pagina, teimosos };
  }
  return { pagina, teimosos: 0 };
};

const irPara = async (pagina, fracao) => {
  const y = await pagina.evaluate(([p]) => {
    const secao = document.querySelector('#top');
    const alcance = secao.getBoundingClientRect().height - window.innerHeight;
    const destino = Math.round(p * alcance);
    window.scrollTo({ top: destino, behavior: 'auto' });
    window.__lenis?.scrollTo(destino, { immediate: true, force: true });
    return destino;
  }, [fracao]);
  await new Promise((res) => setTimeout(res, 900));
  return y;
};

/* ⚠️ O QUADRO DO VÍDEO TEM DE SER O MESMO NAS DUAS ABAS, e não basta esperar que
   cada uma "assente". MEDIDO nesta issue: a legenda 1 (centro 0.10, y=63 a 390px)
   voltava com razão 1,19:1 no título e 1,12:1 no apoio, `cobertura: 1` e fundo
   `[236 236 229]` — quase branco — enquanto a captura da MESMA posição mostrava o
   quadro azul de abertura. Não havia falha de contraste nenhuma: as duas abas
   estavam em tempos diferentes do vídeo, a diferença A−B pegou o vídeo inteiro em
   vez da letra, e a "letra" medida era o quadro claro de uma aba contra o quadro
   escuro da outra. `estabilizar` não detecta isso: cada aba está estável, só que em
   quadros distintos.
   O quadro é o do vídeo da aba COM tinta (é a tela real), copiado para a outra, com
   `pause()` nas duas para que nada avance entre as duas capturas. Isso não afrouxa
   nada do que se mede: a tarja do regime C existe justamente para o piso não
   depender de qual quadro está por baixo (ver `globals.css`), e o valor lido aqui é
   o do quadro que o usuário vê naquela posição. */
const sincronizarVideo = async (destino, origem) => {
  const t = await origem.evaluate(() => {
    const vs = [...document.querySelectorAll('video')];
    vs.forEach((v) => v.pause());
    return vs.map((v) => v.currentTime);
  });
  await destino.evaluate((tempos) => {
    [...document.querySelectorAll('video')].forEach((v, i) => {
      v.pause();
      if (typeof tempos[i] === 'number') v.currentTime = tempos[i];
    });
  }, t);
  await new Promise((res) => setTimeout(res, 500));
  return t;
};

const navegador = await chromium.launch();
const saida = {};

for (const largura of LARGURAS) {
  const comTinta = await preparar(navegador, largura, false);
  const semTinta = await preparar(navegador, largura, true);
  saida[largura] = {
    '#regime':
      largura >= 1024 ? 'A — tinta escura na coluna branca' : 'C — tinta clara sobre o vídeo',
    '#tintaTeimosa': semTinta.teimosos,
  };

  for (let i = 0; i < CENTROS.length; i += 1) {
    const ALVOS = alvosDe(i);
    const rotulo = `legenda-${i + 1}`;
    /* ⚠️ AS DUAS ABAS TÊM DE PARAR NO MESMO PONTO **E** COM A LEGENDA NO PATAMAR,
       e uma única ida não garante nem uma coisa nem outra. MEDIDO: a legenda 1
       reprovava com fundo `[164 167 172]` — cinza médio, que é a tarja de 70% a
       cerca de um terço de alfa — porque a aba APAGADA parava alguns pixels antes
       (a 390px o percurso tem 630px, então o centro 0.10 fica em y=63 e o patamar
       da janela mede ~44px: um deslize de 20px joga o bloco para dentro da rampa
       de entrada, onde a opacidade do bloco — e portanto da tarja — ainda está
       subindo). O sintoma era enganoso: a diferença A−B pegava as duas tarjas
       diferentes como se fossem letra, com 31.180 pixels de "glifo" num título que
       tem uns poucos milhares.
       Daí este laço: cada aba insiste até a legenda medida chegar ao patamar
       (>= 0.98), e a checagem de patamar vale para as DUAS. */
    const assentar = async (pagina) => {
      let leitura = null;
      for (let tentativa = 0; tentativa < 6; tentativa += 1) {
        await irPara(pagina, CENTROS[i]);
        leitura = await pagina.evaluate((sel) => {
          const bloco = document.querySelector(sel);
          /* A opacidade das LINHAS também, e não só a do bloco: é a rampa atrasada
             do apoio que decide se o quadro está no patamar (ver `CENTROS`). */
          const linhas = [...bloco.querySelectorAll('p')].map((p) =>
            Number(getComputedStyle(p).opacity),
          );
          return {
            y: Math.round(window.scrollY),
            opacidade: Number(getComputedStyle(bloco).opacity),
            linhas: linhas.map((v) => Math.round(v * 1000) / 1000),
          };
        }, `.hero-captions:not(.hero-pitch) .hero-caption:nth-child(${i + 1})`);
        if (leitura.opacidade >= 0.98 && Math.min(...leitura.linhas) >= 0.99) break;
      }
      return leitura;
    };
    const posicoes = [];
    for (const { pagina } of [comTinta, semTinta]) posicoes.push(await assentar(pagina));
    const tempos = await sincronizarVideo(semTinta.pagina, comTinta.pagina);
    const assentadas = [];
    for (const { pagina } of [comTinta, semTinta]) assentadas.push(await estabilizar(pagina));

    const estado = await comTinta.pagina.evaluate((sel) => {
      const bloco = document.querySelector(sel);
      return {
        y: Math.round(window.scrollY),
        opacidade: Number(getComputedStyle(bloco).opacity),
      };
    }, `.hero-captions:not(.hero-pitch) .hero-caption:nth-child(${i + 1})`);

    const desalinhadas =
      posicoes.some((p) => p.opacidade < 0.98 || Math.min(...p.linhas) < 0.99) ||
      Math.abs(posicoes[0].y - posicoes[1].y) > 1;
    if (assentadas.some((ok) => !ok) || estado.opacidade < 0.98 || desalinhadas) {
      saida[largura][rotulo] = {
        '#pulada': assentadas.some((ok) => !ok)
          ? 'cena não assentou — quadro ainda mudando'
          : desalinhadas
            ? 'abas em pontos diferentes ou legenda fora do patamar'
            : 'legenda entrando ou saindo (opacidade < 0.98)',
        '#posicoes': posicoes,
        ...estado,
      };
      continue;
    }

    const medidos = await comTinta.pagina.evaluate(LEVANTAR, ALVOS);

    const [a, b] = await Promise.all([
      comTinta.pagina.screenshot(),
      semTinta.pagina.screenshot(),
    ]);
    const [A, B] = await Promise.all(
      [a, b].map((buf) => sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true })),
    );

    const bloco = {
      '#centro': CENTROS[i],
      '#rolagem': estado,
      '#opacidade': estado.opacidade,
      '#quadroDoVideo': tempos,
    };
    for (const [id, m] of Object.entries(medidos)) {
      if (!m) {
        bloco[id] = null;
        continue;
      }
      let piorTudo = null;
      let piorCorpo = null;
      let pixels = 0;
      let pixelsCorpo = 0;
      for (const { x, y, w, h } of m.caixas) {
        const x1 = Math.min(x + w, A.info.width);
        const y1 = Math.min(y + h, A.info.height);
        for (let py = Math.max(0, y); py < y1; py += 1) {
          for (let px = Math.max(0, x); px < x1; px += 1) {
            const k = (py * A.info.width + px) * A.info.channels;
            const comA = [A.data[k], A.data[k + 1], A.data[k + 2]];
            const bg = [B.data[k], B.data[k + 1], B.data[k + 2]];
            const mudou =
              Math.abs(comA[0] - bg[0]) + Math.abs(comA[1] - bg[1]) + Math.abs(comA[2] - bg[2]);
            if (mudou < 12) continue;
            for (const tinta of m.tintas) {
              const cheio =
                Math.abs(tinta[0] - bg[0]) +
                Math.abs(tinta[1] - bg[1]) +
                Math.abs(tinta[2] - bg[2]);
              const cobertura = cheio > 0 ? Math.min(1, mudou / cheio) : 1;
              const r = razao(compor(tinta, m.alfa, bg), bg);
              const cand = {
                razao: Math.round(r * 100) / 100,
                fundo: bg,
                cobertura: Math.round(cobertura * 100) / 100,
                em: { x: px, y: py, rolagem: estado.y },
              };
              pixels += 1;
              if (piorTudo === null || r < piorTudo.razao) piorTudo = cand;
              if (cobertura >= CORPO) {
                pixelsCorpo += 1;
                if (piorCorpo === null || r < piorCorpo.razao) piorCorpo = cand;
              }
            }
          }
        }
      }
      const grande = m.px >= 24 || (m.px >= 18.66 && Number(m.peso) >= 700);
      const piso = grande ? 3 : 4.5;
      const miudo = m.px < MIUDO;
      if (piorCorpo === null) {
        bloco[id] = {
          ...m,
          piso,
          razao: null,
          rasterPior: piorTudo?.razao ?? null,
          motivo: piorTudo
            ? 'nenhum pixel de corpo — só franja de antialiasing no recorte'
            : 'máscara vazia — alvo fora da janela ou tinta não apagada',
          miudo,
          veredito: piorTudo && miudo ? 'artefato-aa' : 'indeterminado',
          passa: false,
        };
        continue;
      }
      const rasterPior = piorTudo?.razao ?? null;
      const delta =
        rasterPior === null ? null : Math.round((piorCorpo.razao - rasterPior) * 100) / 100;
      const passa = piorCorpo.razao >= piso;
      const rasterCondenaria =
        passa && rasterPior !== null && rasterPior < piso && delta > DELTA_ARTEFATO;
      bloco[id] = {
        ...m,
        caixas: m.caixas.length,
        piso,
        razao: piorCorpo.razao,
        rasterPior,
        delta,
        miudo,
        veredito: !passa
          ? 'reprovado'
          : rasterCondenaria
            ? miudo
              ? 'artefato-aa'
              : 'raster-condenaria'
            : 'aprovado',
        piorCorpo,
        piorTudo,
        pixels,
        pixelsCorpo,
        passa,
      };
    }
    saida[largura][rotulo] = bloco;
  }

  await comTinta.pagina.close();
  await semTinta.pagina.close();
}

await navegador.close();
console.log(JSON.stringify(saida, null, 2));
