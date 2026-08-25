'use client';

import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '@/lib/motion';

/* Paleta pedida para o grafismo — nunca entra em texto, so em traco decorativo. */
const CIANO = '#0ed8f6';
const LINHA = 'rgba(14, 216, 246, 0.12)';
const NO = 'rgba(14, 216, 246, 0.30)';
const TECNICO = 'rgba(255, 255, 255, 0.10)';

const DPR_MAX = 2;
const RAIO_INICIAL = 8;
const RAIO_MAXIMO = 118; // faixa pedida: 110-128
const DISTANCIA_PONTOS = 12;
const VIDA_MS = 520;
const PONTOS_MAX = 140; // faixa pedida: 120-160

type Ponto = { x: number; y: number; nascimento: number };

/** LCG minusculo: geometria estavel entre renders, sem depender de Math.random. */
function gerador(semente: number) {
  let s = semente;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

/** Rotas de dados: trilhas horizontais com desvios e nos nas juncoes. */
function rotas(largura: number, altura: number) {
  const rnd = gerador(20260819);
  const linhas: Array<Array<[number, number]>> = [];
  const nos: Array<[number, number]> = [];
  const trilhas = 7;

  for (let t = 0; t < trilhas; t += 1) {
    const y = ((t + 0.5) / trilhas) * altura;
    const pontos: Array<[number, number]> = [[-20, y]];
    let x = rnd() * 90;
    let atualY = y;
    while (x < largura + 20) {
      x += 70 + rnd() * 150;
      // Desvio na diagonal: linguagem de roteamento, nao curva organica.
      if (rnd() > 0.55) {
        const salto = (rnd() > 0.5 ? 1 : -1) * (altura / trilhas) * 0.6;
        const proximaY = Math.min(altura - 6, Math.max(6, atualY + salto));
        pontos.push([x - 26, atualY], [x, proximaY]);
        nos.push([x, proximaY]);
        atualY = proximaY;
      } else {
        pontos.push([x, atualY]);
        if (rnd() > 0.6) nos.push([x, atualY]);
      }
    }
    pontos.push([largura + 20, atualY]);
    linhas.push(pontos);
  }
  return { linhas, nos };
}

/**
 * TechnicalCursorReveal — grafismo tecnico original no fundo do CTA.
 *
 * Duas camadas, ambas `aria-hidden` e sem captura de ponteiro:
 *
 * - **SVG estatico**, sempre presente: rotas de dados e nos de rede em contraste
 *   baixo. É o unico grafismo em toque, em movimento reduzido e sem JavaScript.
 * - **Canvas 2D opcional**, so em ponteiro fino com hover: a mesma linguagem
 *   grafica, mais acesa, revelada apenas onde o cursor passou. A revelacao usa
 *   uma mascara opaca da qual os pontos do rastro sao ESCAVADOS com
 *   `destination-out` — o canvas fica transparente fora dos furos, entao nao
 *   existe veu retangular sobre o degrade da secao.
 *
 * Orcamento: `devicePixelRatio` limitado a 2, `requestAnimationFrame` so
 * enquanto ha ponto vivo, e nada roda com a secao fora da viewport.
 */
export default function TechnicalCursorReveal({ className }: { className?: string }) {
  const raizRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const raiz = raizRef.current;
    const canvas = canvasRef.current;
    if (!raiz || !canvas) return;
    if (prefersReducedMotion()) return;
    // Sem hover / ponteiro grosso (toque): fica somente o SVG estatico.
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const ctx = canvas.getContext('2d');
    const mascara = document.createElement('canvas');
    const mctx = mascara.getContext('2d');
    if (!ctx || !mctx) return;

    let largura = 0;
    let altura = 0;
    let dpr = 1;
    let geometria = rotas(1, 1);
    let pontos: Ponto[] = [];
    let raf = 0;
    let visivel = false;
    let ultimo: { x: number; y: number } | null = null;

    const medir = () => {
      const r = raiz.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      dpr = Math.min(window.devicePixelRatio || 1, DPR_MAX);
      largura = r.width;
      altura = r.height;
      for (const c of [canvas, mascara]) {
        c.width = Math.round(largura * dpr);
        c.height = Math.round(altura * dpr);
      }
      canvas.style.width = `${largura}px`;
      canvas.style.height = `${altura}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      mctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      geometria = rotas(largura, altura);
    };

    const desenharGrafismo = () => {
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(14, 216, 246, 0.55)';
      for (const linha of geometria.linhas) {
        ctx.beginPath();
        linha.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
        ctx.stroke();
      }
      ctx.fillStyle = CIANO;
      for (const [x, y] of geometria.nos) {
        ctx.beginPath();
        ctx.arc(x, y, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const quadro = () => {
      const agora = performance.now();
      pontos = pontos.filter((p) => agora - p.nascimento < VIDA_MS);

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (!pontos.length || !visivel) {
        raf = 0;
        return;
      }

      desenharGrafismo();

      /* Mascara: opaca por inteiro, com furos macios onde o cursor passou. */
      mctx.setTransform(1, 0, 0, 1, 0, 0);
      mctx.clearRect(0, 0, mascara.width, mascara.height);
      mctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      mctx.globalCompositeOperation = 'source-over';
      mctx.fillStyle = '#000';
      mctx.fillRect(0, 0, largura, altura);
      mctx.globalCompositeOperation = 'destination-out';
      for (const p of pontos) {
        const vida = (agora - p.nascimento) / VIDA_MS;
        // Cresce e desaparece: o furo abre rapido e fecha por opacidade.
        const raio = RAIO_INICIAL + (RAIO_MAXIMO - RAIO_INICIAL) * vida;
        const forca = (1 - vida) * 0.9;
        const grad = mctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, raio);
        grad.addColorStop(0, `rgba(0,0,0,${forca})`);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        mctx.fillStyle = grad;
        mctx.beginPath();
        mctx.arc(p.x, p.y, raio, 0, Math.PI * 2);
        mctx.fill();
      }
      mctx.globalCompositeOperation = 'source-over';

      // Apaga o grafismo por baixo da mascara; sobra o que esta nos furos.
      ctx.globalCompositeOperation = 'destination-out';
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.drawImage(mascara, 0, 0);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = 'source-over';

      raf = requestAnimationFrame(quadro);
    };

    const ligar = () => {
      if (!raf && visivel && pontos.length) raf = requestAnimationFrame(quadro);
    };

    const onMover = (evento: PointerEvent) => {
      if (!visivel || evento.pointerType !== 'mouse') return;
      const r = raiz.getBoundingClientRect();
      const x = evento.clientX - r.left;
      const y = evento.clientY - r.top;
      if (x < 0 || y < 0 || x > r.width || y > r.height) return;
      if (ultimo) {
        const d = Math.hypot(x - ultimo.x, y - ultimo.y);
        if (d < DISTANCIA_PONTOS) return;
      }
      ultimo = { x, y };
      pontos.push({ x, y, nascimento: performance.now() });
      if (pontos.length > PONTOS_MAX) pontos = pontos.slice(-PONTOS_MAX);
      ligar();
    };

    const observer = new IntersectionObserver(
      (entradas) => {
        visivel = entradas.some((e) => e.isIntersecting);
        if (!visivel) {
          // Fora da viewport nada roda, e o canvas nao guarda quadro velho.
          if (raf) cancelAnimationFrame(raf);
          raf = 0;
          pontos = [];
          ultimo = null;
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
      },
      { threshold: 0 },
    );
    observer.observe(raiz);

    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(raiz);
    window.addEventListener('pointermove', onMover, { passive: true });

    return () => {
      observer.disconnect();
      ro.disconnect();
      window.removeEventListener('pointermove', onMover);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={raizRef} aria-hidden className={className}>
      {/* Camada permanente: é o grafismo em toque, em movimento reduzido e sem
          JavaScript. Geometria original, so traco e no — nada de asset externo. */}
      <svg
        className="tcr-svg"
        viewBox="0 0 1200 420"
        preserveAspectRatio="none"
        focusable="false"
      >
        <g fill="none" stroke={LINHA} strokeWidth="1">
          <path d="M-10 74 H 250 l 26 -30 H 520 l 26 34 H 900 l 30 -26 H 1210" />
          <path d="M-10 158 H 180 l 30 30 H 610 l 24 -26 H 1210" />
          <path d="M-10 244 H 340 l 28 -28 H 700 l 26 30 H 1210" />
          <path d="M-10 330 H 150 l 26 -24 H 480 l 30 28 H 860 l 24 -30 H 1210" />
        </g>
        <g stroke={TECNICO} strokeWidth="1">
          <path d="M276 44 V 306" />
          <path d="M634 162 V 336" />
          <path d="M930 48 V 274" />
        </g>
        <g fill={NO}>
          <circle cx="276" cy="44" r="3" />
          <circle cx="546" cy="78" r="3" />
          <circle cx="634" cy="162" r="3" />
          <circle cx="726" cy="274" r="3" />
          <circle cx="930" cy="48" r="3" />
          <circle cx="368" cy="216" r="3" />
          <circle cx="210" cy="188" r="3" />
        </g>
      </svg>
      <canvas ref={canvasRef} className="tcr-canvas" />
    </div>
  );
}
