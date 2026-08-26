'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
/* `Link` saiu com o botão "Veja mais" do rodapé da seção: era o único consumo
   dele aqui, e um import sem uso quebra o lint. */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
/* Os seis ícones decorativos do percurso (`Boxes`, `Check`, `Code2`,
   `ShieldCheck`, `UserPlus`, `Workflow`) saíram com a lista `ICONES_NO`: os nós
   agora são quatro, um por solução, e cada um usa o ícone da própria solução via
   `getIcon(s.icon)`. */
import { SOLUTIONS } from '@/data/solutions';
import { getIcon } from '@/lib/icons';
import { useReducedMotion } from '@/lib/motion';

/**
 * Teatro de soluções: um palco só, preso ao scroll, onde as quatro soluções se
 * revelam uma a uma — foto dominante, linha de processo por cima dela e cartão
 * descritivo em vidro sobre o terço inferior da imagem.
 *
 * Duas leis da receita `.claude/skills/scroll-orchestrated-lp`:
 *
 * 1. O scroll é o relógio. Existe UM `ScrollTrigger` na seção; dele saem o
 *    progresso (`--sol-p`, publicado por `ref`, sem re-render) e o índice ativo
 *    (`setState`, e só quando o índice realmente muda). Todo o resto — varredura,
 *    parallax, cartão — é CSS consumindo esses dois valores.
 * 2. Nenhum conteúdo depende do movimento para existir. A mesma árvore de DOM
 *    serve o palco dirigido e o fluxo natural; o que muda é o atributo
 *    `data-dirigindo` na seção. Sem ele (mobile ou movimento reduzido) as quatro
 *    cenas simplesmente empilham na vertical, legíveis e sem pin.
 *
 * A linha de processo é UM caminho SVG só, com as coordenadas MEDIDAS do item
 * ativo e da janela da foto (`geo`). Antes eram quatro ilustrações diferentes e
 * um conector posicionado por número mágico — `(indice - 1.5) * 63px` —, que
 * errava a altura assim que o título do item 01 quebrava em três linhas. Medir é
 * o que mantém a emenda certa em qualquer largura, zoom ou fonte.
 */

/* A lista `ICONES_NO` de seis ícones decorativos saiu: os nós passaram a ser
   quatro, um por solução, e cada um carrega o ícone da solução que representa
   (`getIcon(s.icon)`, o mesmo do cartão). Antes eram seis nós para quatro etapas,
   então dois nunca correspondiam a nada e o nó aceso não era o da etapa. */

/** Geometria medida, em px relativos ao `.solutions-layout`. */
type Geo = {
  /** largura/altura da caixa de referência (o `viewBox` é 1:1 com ela) */
  w: number;
  h: number;
  /** saída da linha: borda direita e centro vertical do item ativo */
  sx: number;
  sy: number;
  /** janela da foto */
  px: number;
  py: number;
  pw: number;
  ph: number;
};

const MESMA_GEO = (a: Geo | null, b: Geo): boolean =>
  a !== null &&
  Math.abs(a.w - b.w) < 0.5 &&
  Math.abs(a.h - b.h) < 0.5 &&
  Math.abs(a.sx - b.sx) < 0.5 &&
  Math.abs(a.sy - b.sy) < 0.5 &&
  Math.abs(a.px - b.px) < 0.5 &&
  Math.abs(a.py - b.py) < 0.5 &&
  Math.abs(a.pw - b.pw) < 0.5 &&
  Math.abs(a.ph - b.ph) < 0.5;

export default function Solutions() {
  const rm = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState(false);
  const [ativo, setAtivo] = useState(0);
  const [geo, setGeo] = useState<Geo | null>(null);
  const secaoRef = useRef<HTMLElement>(null);
  const palcoRef = useRef<HTMLDivElement>(null);
  const layoutRef = useRef<HTMLDivElement>(null);
  const passoRefs = useRef<Array<HTMLDivElement | null>>([]);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const janelaRefs = useRef<Array<HTMLDivElement | null>>([]);

  const total = SOLUTIONS.length;
  /* Palco dirigido só onde há espaço e o movimento é bem-vindo. Fora daí a mesma
     árvore vira fluxo natural — nada de conteúdo depende do pin. */
  const dirigindo = isDesktop && !rm;

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const atualizar = () => setIsDesktop(mq.matches);
    atualizar();
    mq.addEventListener('change', atualizar);
    return () => mq.removeEventListener('change', atualizar);
  }, []);

  useEffect(() => {
    if (!dirigindo) return;
    const secao = secaoRef.current;
    const palco = palcoRef.current;
    if (!secao || !palco) return;

    gsap.registerPlugin(ScrollTrigger);

    // Divisor do parallax contínuo (ver o `onUpdate`). Escrito uma vez.
    palco.style.setProperty('--sol-total', String(total));

    /* UM trigger. O progresso vai para o DOM por `ref` (uma escrita de custom
       property por quadro, sem re-render); o índice vai para o estado, e só
       quando muda de fato. `0.999999` impede que o último quadro (progress === 1)
       calcule um índice fora do array. */
    const trigger = ScrollTrigger.create({
      trigger: secao,
      start: 'top top',
      end: 'bottom bottom',
      onToggle: (self) => {
        palco.dataset.visivel = self.isActive ? '1' : '0';
      },
      onUpdate: (self) => {
        const p = self.progress;
        palco.style.setProperty('--sol-p', p.toFixed(4));
        /* `--sol-passo-p` (progresso DENTRO da etapa, `(p * total) % 1`) saiu
           daqui: era a origem dos "pulinhos". Sendo dente de serra, ela voltava
           de 1 para 0 na fronteira de cada etapa, e o parallax que a consumia
           levava um tranco de 14px a cada quarto do percurso — amaciado pela
           transição de 850ms, o que transformava o salto num balanço.

           O parallax agora deriva de `--sol-p` (monotônica) e de `--sol-i` de
           cada cena, o que dá a mesma amplitude por etapa sem nenhum retorno.
           `--sol-total` é o divisor dessa conta, publicado aqui para o CSS não
           precisar repetir o 4 na mão. */
        const seguro = Math.min(p, 0.999999);
        const idx = Math.min(total - 1, Math.max(0, Math.floor(seguro * total)));
        setAtivo((prev) => (prev === idx ? prev : idx));
      },
    });

    /* Fontes com `display: swap` refluem o texto depois da medição: sem o
       refresh os limites do pin ficam em posições velhas e a troca de cena
       acontece fora da etapa correspondente. */
    ScrollTrigger.refresh();
    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener('resize', onResize);
    document.fonts?.ready.then(() => ScrollTrigger.refresh()).catch(() => {});

    return () => {
      window.removeEventListener('resize', onResize);
      trigger.kill();
    };
  }, [dirigindo, total]);

  /* Medição da linha de processo. Nada aqui é constante escolhida a olho: a
     saída sai do retângulo real do item ativo e a chegada do retângulo real da
     janela da foto. A guarda de 0.5px evita re-render infinito, porque
     `getBoundingClientRect` devolve float. */
  const medir = useCallback(() => {
    const layout = layoutRef.current;
    const item = itemRefs.current[ativo];
    const janela = janelaRefs.current[ativo];
    if (!layout || !item || !janela) return;
    const L = layout.getBoundingClientRect();
    const B = item.getBoundingClientRect();
    const J = janela.getBoundingClientRect();
    if (L.width === 0 || J.width === 0) return;
    const proxima: Geo = {
      w: L.width,
      h: L.height,
      sx: B.right - L.left,
      sy: B.top - L.top + B.height / 2,
      px: J.left - L.left,
      py: J.top - L.top,
      pw: J.width,
      ph: J.height,
    };
    setGeo((prev) => (MESMA_GEO(prev, proxima) ? prev : proxima));
  }, [ativo]);

  useEffect(() => {
    /* Fora do palco dirigido não medimos — e também não zeramos `geo`: a
       renderização já exige `dirigindo && geo`, e um `setGeo(null)` aqui seria
       setState sincrono dentro de efeito (renderização em cascata). Ao voltar
       para desktop o observer remede antes de a linha aparecer. */
    if (!dirigindo) return;
    const layout = layoutRef.current;
    if (!layout) return;
    medir();
    // ResizeObserver em vez de listener de scroll/resize solto: a medição só
    // acontece quando a caixa realmente muda de tamanho.
    const ro = new ResizeObserver(medir);
    ro.observe(layout);
    document.fonts?.ready.then(medir).catch(() => {});
    return () => ro.disconnect();
  }, [dirigindo, medir]);

  /* Clique na navegação não cria estado paralelo ao scroll: ele rola até a
     fatia da trilha correspondente e o próprio trigger recalcula o índice. */
  const irPara = useCallback(
    (i: number) => {
      const passo = passoRefs.current[i];
      if (passo && dirigindo) {
        passo.scrollIntoView({ behavior: rm ? 'auto' : 'smooth', block: 'start' });
        return;
      }
      setAtivo(i);
    },
    [dirigindo, rm],
  );

  const onKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        irPara(Math.min(total - 1, ativo + 1));
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        irPara(Math.max(0, ativo - 1));
      }
    },
    [ativo, irPara, total],
  );

  /* Percurso e nós derivados da medição. Um caminho só: sai do item ativo, corre
     pela calha entre as colunas, faz a curva de entrada na foto e segue reto por
     cima dela ligando os nós. `pathLength={1}` deixa o desenho progressivo
     em unidades de 1, então o `stroke-dashoffset` do CSS não precisa saber o
     comprimento real.

     UM nó por solução, e não os seis de antes: seis nós para quatro etapas
     obrigavam a acender o `ativo + 1` e deixavam dois nós sem etapa nenhuma para
     representar. Com `total`, o nó aceso é o da etapa, sem correção de índice.

     Distribuição em fração da largura MEDIDA da foto, de 0.14 a 0.86: as margens
     de 14% em cada ponta impedem que o primeiro e o último encostem na borda da
     janela. O passo é derivado de `total`, não escrito na mão, para a linha
     continuar distribuída se um dia entrar ou sair uma solução. */
  const PRIMEIRO_NO = 0.14;
  const ULTIMO_NO = 0.86;
  const nos = geo
    ? Array.from({ length: total }, (_, i) => {
        const fracao =
          total > 1
            ? PRIMEIRO_NO + (i * (ULTIMO_NO - PRIMEIRO_NO)) / (total - 1)
            : (PRIMEIRO_NO + ULTIMO_NO) / 2;
        return geo.px + geo.pw * fracao;
      })
    : [];
  /* Altura da linha dentro da foto: 0.56, e não os 0.44 de antes — a pedido, um
     pouco mais para baixo. Mais que isso e ela encosta no cartão descritivo, que
     ocupa o terço inferior. Fração da altura medida, nunca px: acompanha a
     janela em qualquer largura. */
  const linhaY = geo ? geo.py + geo.ph * 0.56 : 0;
  const entrada = geo ? geo.px + geo.pw * 0.045 : 0;
  const dobra = geo ? geo.px - 20 : 0;
  const caminho = geo
    ? `M ${geo.sx.toFixed(1)} ${geo.sy.toFixed(1)} H ${dobra.toFixed(1)}` +
      ` C ${(dobra + 30).toFixed(1)} ${geo.sy.toFixed(1)},` +
      ` ${(entrada - 22).toFixed(1)} ${linhaY.toFixed(1)},` +
      ` ${entrada.toFixed(1)} ${linhaY.toFixed(1)}` +
      ` H ${(nos[nos.length - 1] ?? entrada).toFixed(1)}`
    : '';
  /* Remate do fim do percurso.
     O caminho acima agora TERMINA no último nó, e não 5% de largura depois dele:
     aquele toco de traço reto morrendo no vazio, com a ponta arredondada do
     `stroke-linecap`, era o "final feio". Um percurso que acaba em nada parece
     corte, não conclusão.

     No lugar dele, um trecho próprio: sobe suavemente do último nó até a beira
     da janela e dissolve num degradê (`#solutions-fio-fim`), porque quem se
     dissipa não precisa de ponta. Path separado, e não mais um segmento do
     `caminho`, por dois motivos — o degradê pintaria o fio inteiro se estivesse
     no mesmo traço, e o traço aceso (`stroke-dashoffset`) mediria o remate como
     se fosse etapa. */
  const remate = geo
    ? `M ${(nos[nos.length - 1] ?? entrada).toFixed(1)} ${linhaY.toFixed(1)}` +
      ` C ${(geo.px + geo.pw * 0.915).toFixed(1)} ${linhaY.toFixed(1)},` +
      ` ${(geo.px + geo.pw * 0.945).toFixed(1)} ${(linhaY - geo.ph * 0.075).toFixed(1)},` +
      ` ${(geo.px + geo.pw * 0.995).toFixed(1)} ${(linhaY - geo.ph * 0.11).toFixed(1)}`
    : '';
  /* `noAtivo = ativo + 1` saiu: era a correção que os seis nós exigiam para a
     cabeça do percurso não acender no nó errado. Com um nó por solução, o nó da
     etapa é o próprio `ativo`. */

  return (
    <section
      /* `solucoes`, e não mais `servicos`: o `ScrollSpy` sempre listou
         `solucoes` e o hero sempre linkou para `#solucoes`, mas nenhum
         elemento da página carregava esse `id` — o indicador nunca acendia e
         o botão "Veja como a Sistran pode ajudar" não levava a lugar nenhum.
         Ninguém apontava para `#servicos` (o `#servicos-diferenciais` de
         `/solucoes` é outro id), então renomear conserta os dois de uma vez. */
      id="solucoes"
      ref={secaoRef}
      aria-labelledby="solucoes-titulo"
      className="solutions-scroll"
      data-dirigindo={dirigindo ? '' : undefined}
    >
      {/* Atmosfera do palco: degradê da marca, grade técnica quase invisível,
          brilho ciano discreto, duas linhas finas, uma curva técnica no canto e
          coordenadas em opacidade mínima. Nada disso passa por cima de texto —
          fica atrás de tudo e não capta ponteiro. */}
      <div aria-hidden className="solutions-fundo">
        <span className="solutions-grade" />
        <span className="solutions-brilho" />
        <svg
          className="solutions-linhas"
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
          aria-hidden
        >
          <line x1="0" y1="640" x2="1440" y2="300" />
          <line x1="0" y1="220" x2="1440" y2="700" />
        </svg>
        {/* Curva técnica do canto inferior esquerdo: preserva a razão de aspecto
            para não virar um arco esticado. */}
        <svg className="solutions-curva" viewBox="0 0 260 200" aria-hidden>
          <path d="M-10 190 C 70 190, 150 150, 200 60" />
          <path d="M-10 160 C 60 160, 130 126, 172 44" />
        </svg>
        <span className="solutions-coord">41°23′S · 2°11′E / -23.55 · -46.63</span>
      </div>

      <div ref={palcoRef} className="solutions-sticky">
        <div className="solutions-caixa">
          <div className="solutions-cabecalho">
            {/* Sobretítulo e título verbatim do bloco "Soluções de Negócios" da
                home. Fonte: .claude/conteudo-site/00-home.md (seção 5). */}
            <span className="solutions-eyebrow">
              <span aria-hidden className="solutions-eyebrow-ponto" />
              Veja como a Sistran pode ajudar sua Seguradora nos mais variados desafios de
              negócios.
            </span>
            <h2 id="solucoes-titulo" className="solutions-titulo">
              Soluções de Negócios
            </h2>
          </div>

          <div ref={layoutRef} className="solutions-layout">
            <nav className="solutions-nav" aria-label="Soluções de negócios">
              <p className="solutions-nav-rotulo">
                <span aria-hidden className="solutions-nav-rotulo-linha" />
                Diferenciais
              </p>
              <ol className="solutions-nav-lista" onKeyDown={onKey}>
                {SOLUTIONS.map((s, i) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      ref={(el) => {
                        itemRefs.current[i] = el;
                      }}
                      onClick={() => irPara(i)}
                      aria-current={i === ativo ? 'step' : undefined}
                      data-estado={i === ativo ? 'ativo' : 'inativo'}
                      className="solutions-nav-item"
                    >
                      {/* O `01`–`04` saiu daqui em SIS-46: a numeração migrou
                          para os nós da linha de processo, onde marca a etapa
                          junto do ícone da solução. Aqui ela só repetia, em
                          quatro cópias, o que o contador `01 / 04` logo abaixo
                          já diz uma vez — e roubava largura do título.
                          Nada de informação se perdeu: o contador e o
                          `aria-current="step"` do botão continuam sendo o canal
                          real (a linha é `aria-hidden`). */}
                      <span className="solutions-nav-titulo">{s.title}</span>
                      {/* O estado ativo não é só cor: tem barra à esquerda,
                          placa de vidro e a seta fixa. */}
                      <span aria-hidden className="solutions-nav-seta">
                        →
                      </span>
                    </button>
                  </li>
                ))}
              </ol>

              <div className="solutions-progresso">
                <span aria-hidden className="solutions-progresso-calha">
                  <span
                    className="solutions-progresso-viva"
                    style={
                      { '--sol-frac': (ativo + 1) / total } as React.CSSProperties
                    }
                  />
                </span>
                <p className="solutions-progresso-texto">
                  {String(ativo + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                </p>
              </div>
            </nav>

            <div className="solution-teatro">
              {/* Molduras vazias recuadas: dão profundidade ao palco sem
                  competir com a janela da vez. */}
              <span aria-hidden className="solution-frame solution-frame-1" />
              <span aria-hidden className="solution-frame solution-frame-2" />

              {SOLUTIONS.map((s, i) => {
                const Icon = getIcon(s.icon);
                const num = String(i + 1).padStart(2, '0');
                const estado = i === ativo ? 'ativo' : i < ativo ? 'feito' : 'proximo';
                return (
                  <article
                    key={s.id}
                    className="solution-cena"
                    data-estado={estado}
                    /* Sentido alternado da varredura e índice para o parallax. */
                    data-sentido={i % 2 === 0 ? 'direita' : 'esquerda'}
                    style={{ '--sol-i': i } as React.CSSProperties}
                  >
                    <div
                      className="solution-viewport"
                      /* Ponta de chegada da travessia do tile do mosaico
                         (`ui/MosaicHandoff`). Só o card 01: é dele a foto que o
                         tile "Arquitetura modular e escalável" carrega. Marca de
                         medição apenas — a foto é correta e visível sem o
                         efeito. */
                      data-carrier-alvo={i === 0 ? '' : undefined}
                      ref={(el) => {
                        janelaRefs.current[i] = el;
                      }}
                    >
                      {/* A janela ficou VAZIA por muito tempo porque aqui havia
                          um `<div className="solution-image">` — placeholder com
                          degradê navy, nunca um elemento de imagem. Agora é
                          `next/image` com `fill`, e o pai tem `position:
                          relative; overflow: hidden` (ver `.solution-viewport`),
                          que é o que o `fill` exige para enquadrar. */}
                      {s.image ? (
                        <Image
                          className="solution-image"
                          src={s.image}
                          alt={s.imageAlt ?? ''}
                          fill
                          sizes="(max-width: 1023px) 92vw, 68vw"
                          priority={i === 0}
                        />
                      ) : null}
                      {/* Véu navy só nas bordas: dá contraste ao traço e ao
                          cartão sem apagar as pessoas no centro. */}
                      <span aria-hidden className="solution-veu" />
                    </div>

                    <div className="solution-info">
                      <span aria-hidden className="solution-info-marca">
                        {num}
                      </span>
                      <span className="solution-info-icone">
                        <Icon strokeWidth={1.6} aria-hidden />
                      </span>
                      {/* O "03" pequeno acima do título saiu a pedido: o número
                          grande à direita (`solution-info-marca`) e o "03 / 04"
                          da navegação já dizem em que etapa se está, e o
                          eyebrow empurrava o título para baixo sem informar
                          nada de novo. O selo "Ativo" saiu junto, pelo mesmo
                          motivo: o cartão só é exibido na cena ativa, então
                          dizê-lo era redundante. A barrinha ficou como remate
                          inferior do cartão. */}
                      <h3 className="solution-info-titulo">{s.title}</h3>
                      <p className="solution-info-texto">{s.description}</p>
                      <span aria-hidden className="solution-info-linha" />
                    </div>
                  </article>
                );
              })}

              {/* Régua lateral: quatro nós, sem texto (o "02 / 04" já está na
                  navegação). Puramente indicativa. */}
              <span aria-hidden className="solutions-lateral">
                {SOLUTIONS.map((s, i) => (
                  <span
                    key={s.id}
                    className="solutions-lateral-no"
                    data-estado={i === ativo ? 'ativo' : i < ativo ? 'feito' : 'proximo'}
                  />
                ))}
              </span>
            </div>

            {/* Linha de processo: UM svg, medido, por cima da coluna toda — sai
                do item ativo, atravessa a calha e corre por cima da foto. Fica
                depois das cenas na árvore para pintar acima delas sem `z-index`
                disputado, e `pointer-events: none` no CSS o mantém fora do
                caminho do clique.

                Só no palco dirigido: em fluxo natural (mobile e movimento
                reduzido) as cenas empilham e a linha não teria dois pontos fixos
                para ligar. É decoração `aria-hidden` — nada de conteúdo sai com
                ela. */}
            {dirigindo && geo ? (
              /* O `key={ativo}` vivia AQUI, no container, e era um dos
                 "pulinhos": remontar o fio inteiro a cada etapa destruía também
                 os nós, que voltavam do zero com a cascata de entrada (até
                 785ms de atraso no último). Em scroll normal isso já piscava; em
                 scroll rápido, quatro vezes seguidas.

                 Agora a chave está só no traço aceso, que é o único elemento que
                 precisa mesmo redesenhar por etapa. Os nós persistem e trocam de
                 estado por transição. */
              <div aria-hidden className="solutions-fio">
                <svg
                  className="solutions-fio-svg"
                  viewBox={`0 0 ${geo.w.toFixed(0)} ${geo.h.toFixed(0)}`}
                  preserveAspectRatio="none"
                >
                  <defs>
                    {/* Degradê do remate: ciano na emenda com o último nó,
                        transparente na beira da janela. `userSpaceOnUse` com as
                        coordenadas do viewBox — em `objectBoundingBox` o
                        `preserveAspectRatio="none"` do svg esticaria o degradê
                        junto da caixa. */}
                    <linearGradient
                      id="solutions-fio-fim"
                      gradientUnits="userSpaceOnUse"
                      x1={nos[nos.length - 1] ?? entrada}
                      y1={linhaY}
                      x2={geo.px + geo.pw * 0.995}
                      y2={linhaY - geo.ph * 0.11}
                    >
                      <stop offset="0" stopColor="#0ed8f6" stopOpacity="0.55" />
                      <stop offset="0.55" stopColor="#66caf4" stopOpacity="0.22" />
                      <stop offset="1" stopColor="#66caf4" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path className="solutions-fio-calha" d={caminho} pathLength={1} />
                  {/* Trecho aceso: o desenho progressivo vive no CSS
                      (`stroke-dashoffset` com `pathLength=1`). */}
                  <path
                    key={ativo}
                    className="solutions-fio-vivo"
                    d={caminho}
                    pathLength={1}
                  />
                  {/* Remate: só acende de facto na última etapa (`data-fim`), em
                      que o percurso chegou ao fim e a dissipação faz sentido.
                      Nas anteriores fica esmaecido, como continuação prometida. */}
                  <path
                    className="solutions-fio-remate"
                    d={remate}
                    data-fim={ativo === total - 1 ? '' : undefined}
                  />
                </svg>
                {nos.map((x, i) => {
                  /* O ícone é o da própria solução, o mesmo que o cartão mostra:
                     o nó passou a representar uma etapa, então decorá-lo com um
                     ícone alheio confundiria em vez de orientar. */
                  const IconeNo = getIcon(SOLUTIONS[i].icon);
                  return (
                    <span
                      key={SOLUTIONS[i].id}
                      className="solutions-fio-no"
                      data-estado={i === ativo ? 'ativo' : i < ativo ? 'feito' : 'proximo'}
                      /* Nós em HTML, e não `<circle>`: o svg da linha usa
                         `preserveAspectRatio="none"` para casar com a caixa
                         medida, e sob escala não uniforme um círculo viraria
                         elipse. Posição em % da mesma caixa, então acompanham o
                         svg em qualquer largura. */
                      style={
                        {
                          left: `${((x / geo.w) * 100).toFixed(3)}%`,
                          top: `${((linhaY / geo.h) * 100).toFixed(3)}%`,
                          '--no-i': i,
                        } as React.CSSProperties
                      }
                    >
                      {/* A legenda `01`–`04` sob o nó (`solutions-fio-no-num`,
                          herdada de SIS-46) saiu a pedido em SIS-49: fora do
                          círculo, pequena e sobre a foto, virou ruído. Quem
                          marca a etapa aqui é o próprio nó — círculo aceso,
                          borda clara, halo ciano e o anel que pulsa. Religar é
                          devolver o span aqui e o bloco no `globals.css`. */}
                      <IconeNo strokeWidth={1.5} aria-hidden />
                    </span>
                  );
                })}
              </div>
            ) : null}
          </div>

          {/* Convite ao scroll: o palco fica preso e, sem uma pista, dá a
              impressão de página travada. Aparece só no palco dirigido e se
              apaga sozinho quando o percurso começa — a opacidade sai de
              `--sol-p`, o mesmo progresso que o trigger já escreve, então não há
              estado novo nem listener extra. Decorativo e `aria-hidden`: quem
              não vê continua com a navegação lateral e as setas do teclado. */}
        </div>

        {/* Convite ao scroll: o palco fica preso e, sem uma pista, dá a impressão
            de página travada. Aparece só no palco dirigido e se apaga sozinho
            quando o percurso começa — a opacidade sai de `--sol-p`, o mesmo
            progresso que o trigger já escreve, então não há estado novo nem
            listener extra. Decorativo e `aria-hidden`: quem não vê continua com a
            navegação lateral e as setas do teclado.

            Ele vivia DENTRO da `.solutions-caixa`, como último item da coluna, e
            era por isso que não aparecia: a caixa é mais alta que a tela (a foto
            sozinha vai a 620px) e o sticky é `overflow: clip`, então o convite
            caía justamente na parte recortada. Aqui, irmão da caixa e ancorado no
            rodapé do próprio sticky, ele está sempre dentro da área visível. */}
        {dirigindo ? (
          <p aria-hidden className="solutions-convite">
            <span className="solutions-convite-texto">
              Role para percorrer as {String(total).padStart(2, '0')} soluções
            </span>
            <span className="solutions-convite-calha">
              <span className="solutions-convite-ponto" />
            </span>
          </p>
        ) : null}
      </div>

      {/* Trilha do pin: fica FORA do bloco fixado e é ela que dá altura à seção.
          Quatro fatias IGUAIS — o índice vem de floor(progress * 4), logo cada
          solução precisa ocupar exatamente um quarto do percurso. */}
      <div aria-hidden className="solutions-trilha">
        {SOLUTIONS.map((s, i) => (
          <div
            key={s.id}
            ref={(el) => {
              passoRefs.current[i] = el;
            }}
            className="solutions-passo"
          />
        ))}
      </div>
      {/* O botão "Veja mais" (link para `/solucoes#servicos-diferenciais`) saiu
          a pedido: ele pendurava um CTA solto embaixo de um palco que já termina
          na própria trilha, e a rota continua alcançável pelo menu. Para religar,
          basta um `.solutions-rodape` com um `<Link>` aqui — o bloco de CSS saiu
          junto, então não sobrou estilo morto. */}
    </section>
  );
}
