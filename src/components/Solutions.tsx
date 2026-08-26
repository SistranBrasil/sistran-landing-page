'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SOLUTIONS } from '@/data/solutions';
import { getIcon } from '@/lib/icons';
import { useReducedMotion } from '@/lib/motion';

/**
 * Teatro de soluções: um palco só, preso ao scroll, onde as quatro soluções se
 * revelam uma a uma — janela de imagem, desenho técnico por cima dela e painel
 * de informação em vidro.
 *
 * Duas leis da receita `.claude/skills/scroll-orchestrated-lp`:
 *
 * 1. O scroll é o relógio. Existe UM `ScrollTrigger` na seção; dele saem o
 *    progresso (`--sol-p`, publicado por `ref`, sem re-render) e o índice ativo
 *    (`setState`, e só quando o índice realmente muda). Todo o resto — varredura,
 *    parallax, conector, painel — é CSS consumindo esses dois valores.
 * 2. Nenhum conteúdo depende do movimento para existir. A mesma árvore de DOM
 *    serve o palco dirigido e o fluxo natural; o que muda é o atributo
 *    `data-dirigindo` na seção. Sem ele (mobile ou movimento reduzido) as quatro
 *    cenas simplesmente empilham na vertical, legíveis e sem pin.
 *
 * As janelas de imagem ficam EM BRANCO de propósito: as fotos entram na SIS-20.
 */

/** Ilustração técnica sobre a janela. Uma variante por solução, escolhida pelo
 *  índice — linhas de 1 a 1.5px, nós circulares e brilho só no nó ativo. É
 *  decorativa: `aria-hidden`, o significado está no painel de texto. */
function CenaOverlay({ indice }: { indice: number }) {
  const comum = {
    className: 'solution-overlay',
    viewBox: '0 0 800 440',
    preserveAspectRatio: 'xMidYMid meet',
    'aria-hidden': true as const,
  };

  // 01 — esteira de entrega: seis nós numa linha que sobe em degraus.
  if (indice === 0) {
    const nos = [
      [120, 300],
      [240, 262],
      [360, 286],
      [480, 214],
      [600, 238],
      [700, 166],
    ] as const;
    return (
      <svg {...comum}>
        <polyline
          className="solution-overlay-linha"
          points={nos.map(([x, y]) => `${x},${y}`).join(' ')}
        />
        {nos.map(([x, y], i) => (
          <circle
            key={i}
            className="solution-overlay-no"
            cx={x}
            cy={y}
            r={i === nos.length - 1 ? 7 : 5}
            data-vivo={i === nos.length - 1 ? '1' : undefined}
            style={{ '--ov-i': i } as React.CSSProperties}
          />
        ))}
      </svg>
    );
  }

  // 02 — processo de negócio: seis etapas ligadas por uma linha em arco.
  if (indice === 1) {
    const nos = [
      [110, 240],
      [228, 190],
      [346, 226],
      [464, 176],
      [582, 212],
      [694, 158],
    ] as const;
    return (
      <svg {...comum}>
        <path
          className="solution-overlay-linha"
          d={`M110 240 Q 169 176 228 190 T 346 226 Q 405 160 464 176 T 582 212 Q 640 150 694 158`}
        />
        {nos.map(([x, y], i) => (
          <g key={i} style={{ '--ov-i': i } as React.CSSProperties}>
            <circle
              className="solution-overlay-no"
              cx={x}
              cy={y}
              r={5}
              data-vivo={i === 3 ? '1' : undefined}
            />
            <line className="solution-overlay-guia" x1={x} y1={y + 10} x2={x} y2={y + 34} />
          </g>
        ))}
      </svg>
    );
  }

  // 03 — módulos de serviço: quatro blocos pendurados numa linha mestra.
  if (indice === 2) {
    const mods = [140, 320, 500, 660] as const;
    return (
      <svg {...comum}>
        <line className="solution-overlay-linha" x1={100} y1={150} x2={700} y2={150} />
        {mods.map((x, i) => (
          <g key={i} style={{ '--ov-i': i } as React.CSSProperties}>
            <line className="solution-overlay-guia" x1={x} y1={150} x2={x} y2={212} />
            <rect
              className="solution-overlay-modulo"
              x={x - 46}
              y={212}
              width={92}
              height={64}
              rx={10}
              data-vivo={i === 1 ? '1' : undefined}
            />
            <circle
              className="solution-overlay-no"
              cx={x}
              cy={150}
              r={5}
              data-vivo={i === 1 ? '1' : undefined}
            />
          </g>
        ))}
      </svg>
    );
  }

  // 04 — rede de pessoas: constelação pequena em volta de um nó central.
  const centro = [400, 220] as const;
  const orbita = [
    [268, 148],
    [546, 152],
    [230, 286],
    [566, 292],
    [400, 340],
  ] as const;
  return (
    <svg {...comum}>
      {orbita.map(([x, y], i) => (
        <line
          key={`l${i}`}
          className="solution-overlay-guia"
          x1={centro[0]}
          y1={centro[1]}
          x2={x}
          y2={y}
        />
      ))}
      <circle className="solution-overlay-no" cx={centro[0]} cy={centro[1]} r={9} data-vivo="1" />
      {orbita.map(([x, y], i) => (
        <circle
          key={`c${i}`}
          className="solution-overlay-no"
          cx={x}
          cy={y}
          r={5}
          style={{ '--ov-i': i + 1 } as React.CSSProperties}
        />
      ))}
    </svg>
  );
}

export default function Solutions() {
  const rm = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState(false);
  const [ativo, setAtivo] = useState(0);
  const secaoRef = useRef<HTMLElement>(null);
  const palcoRef = useRef<HTMLDivElement>(null);
  const trilhaRef = useRef<HTMLDivElement>(null);
  const passoRefs = useRef<Array<HTMLDivElement | null>>([]);

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
        // Progresso dentro da etapa da vez: alimenta o parallax e a varredura.
        palco.style.setProperty('--sol-passo-p', ((p * total) % 1).toFixed(4));
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
          brilho ciano discreto e duas linhas finas. Nada disso passa por cima de
          texto — fica atrás de tudo e não capta ponteiro. */}
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
      </div>

      <div ref={palcoRef} className="solutions-sticky">
        <div className="solutions-caixa">
          <div className="solutions-cabecalho">
            {/* Sobretítulo e título verbatim do bloco "Soluções de Negócios" da
                home. Fonte: .claude/conteudo-site/00-home.md (seção 5). */}
            <span className="solutions-eyebrow">
              Veja como a Sistran pode ajudar sua Seguradora nos mais variados desafios de
              negócios.
            </span>
            <h2 id="solucoes-titulo" className="solutions-titulo">
              Soluções de Negócios
            </h2>
          </div>

          <div className="solutions-layout">
            <nav className="solutions-nav" aria-label="Soluções de negócios">
              <ol className="solutions-nav-lista" onKeyDown={onKey}>
                {SOLUTIONS.map((s, i) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => irPara(i)}
                      aria-current={i === ativo ? 'step' : undefined}
                      data-estado={i === ativo ? 'ativo' : 'inativo'}
                      className="solutions-nav-item"
                    >
                      <span className="solutions-nav-num">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="solutions-nav-titulo">{s.title}</span>
                      {/* O estado ativo não é só cor: tem barra à esquerda,
                          placa de vidro, número aceso e a seta fixa. */}
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

              {/* Conector: sai da borda direita do item ativo e entra no primeiro
                  nó da janela. Calha estática + linha viva ciano; o pulso só
                  acende durante a troca de cena. */}
              <svg
                aria-hidden
                className="solution-conector"
                viewBox="0 0 120 40"
                preserveAspectRatio="none"
                style={{ '--sol-ativo': ativo } as React.CSSProperties}
              >
                <path className="solution-conector-calha" d="M0 20 H 92" />
                <path className="solution-conector-vivo" d="M0 20 H 92" />
                <circle className="solution-conector-pulso" cx="0" cy="20" r="3" />
                <circle className="solution-conector-alvo" cx="104" cy="20" r="4" />
              </svg>

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
                    <div className="solution-viewport">
                      {/* Janela EM BRANCO: o lugar da foto de cada solução, que
                          entra na SIS-20. O nó já existe com o enquadramento
                          final (`object-fit: cover`), então a foto só precisa
                          ser plugada aqui. */}
                      <div className="solution-image" role="presentation" />
                      <CenaOverlay indice={i} />
                    </div>

                    <div className="solution-info">
                      <span aria-hidden className="solution-info-marca">
                        {num}
                      </span>
                      <span className="solution-info-icone">
                        <Icon strokeWidth={1.6} aria-hidden />
                      </span>
                      <span className="solution-info-indice">{num}</span>
                      <h3 className="solution-info-titulo">{s.title}</h3>
                      <p className="solution-info-texto">{s.description}</p>
                      <span aria-hidden className="solution-info-linha" />
                      <span className="solution-info-estado">Ativo</span>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

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
      </div>

      {/* Trilha do pin: fica FORA do bloco fixado e é ela que dá altura à seção.
          Quatro fatias IGUAIS — o índice vem de floor(progress * 4), logo cada
          solução precisa ocupar exatamente um quarto do percurso. */}
      <div ref={trilhaRef} aria-hidden className="solutions-trilha">
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

      <div className="solutions-rodape">
        <Link href="/solucoes#servicos-diferenciais" className="btn-primary inline-flex">
          Veja mais
        </Link>
      </div>
    </section>
  );
}
