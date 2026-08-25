'use client';

import { useEffect, useRef } from 'react';

/**
 * OptionalMorphIntro — abertura opcional da home (Fase 5 do relatorio de UX, p19).
 *
 * O que e: uma cena escura com um bloco modular claro que troca de geometria
 * conforme o carregamento avanca e, no fim, se transforma na marca do cabecalho
 * (o elemento marcado com `data-morph-target`). Depois disso o overlay se
 * remove por completo.
 *
 * Regras que moldaram esta implementacao:
 *
 * - **Nao inventa escrita.** O bloco mostra a marca que ja existe no site e um
 *   percentual numerico. Nenhuma frase nova entra na pagina.
 * - **A home fica pronta por baixo desde o primeiro paint.** O overlay e
 *   decorativo (`aria-hidden`), nao recebe foco e nao substitui conteudo. Se o
 *   JavaScript falhar, ele nunca aparece: o no comeca com `hidden` e so o
 *   efeito remove o atributo.
 * - **Uma vez por sessao.** Segunda visita na mesma aba nao paga o pedagio.
 * - **Progresso honesto, nao cronometro.** Os sinais reais (DOM, `load`,
 *   fontes) somam 88; os ultimos 12 pontos so saem quando tudo resolve ou
 *   quando o teto de tempo vence. `minimumMs` garante que a sequencia seja
 *   percebida em cache quente; `maximumMs` garante que ela nunca segure a
 *   pagina.
 * - **Saida em cortina dividida.** A abertura nao dissolve: depois da morfagem,
 *   a cena escura se abre em duas metades que saem pelo topo e pela base. O
 *   gesto e o da abertura da apresentacao de legado (`IndustrialIntro`), e a
 *   ordem importa — primeiro a marca chega ao lugar dela no cabecalho, ainda
 *   sob a cortina; so depois a cortina abre e entrega a pagina.
 * - **Uma fonte para a duracao da saida.** Ela vive em `--mmi-saida`, no CSS.
 *   Aqui ela e LIDA, nunca redeclarada: numero duplicado entre JS e CSS e a
 *   forma classica de a limpeza acontecer antes ou depois da animacao.
 * - **Reduced motion:** sem geometria, sem movimento ambiental e sem cortina —
 *   so a marca e uma dissolucao de 400ms (o relatorio pede <= 500ms). Resolvido
 *   por CSS (`html[data-motion='reduce']` + media query), como no resto do
 *   projeto; o componente nao ramifica a arvore por preferencia. Como a propria
 *   `--mmi-saida` encurta lá, a rede de seguranca daqui acompanha sozinha.
 */

const CHAVE_SESSAO = 'sistran:intro-visto';
const MINIMO_MS = 1400; // faixa pedida: 1.200-1.600
const MAXIMO_MS = 4000; // teto pedido: 3.500-4.500
const MORPH_MS = 900;
/* Usada apenas se `--mmi-saida` nao puder ser lida (folha ainda nao aplicada).
   O valor de verdade esta no CSS. */
const SAIDA_MS_PADRAO = 820;

/** Le `--mmi-saida` do proprio no e devolve em milissegundos. */
function lerDuracaoSaida(no: HTMLElement): number {
  const bruto = getComputedStyle(no).getPropertyValue('--mmi-saida').trim();
  if (bruto.endsWith('ms')) return parseFloat(bruto) || SAIDA_MS_PADRAO;
  if (bruto.endsWith('s')) return (parseFloat(bruto) || 0) * 1000 || SAIDA_MS_PADRAO;
  return SAIDA_MS_PADRAO;
}

/** Pesos dos sinais de prontidao. Somam 88; os 12 restantes sao a liberacao. */
const PESOS = { inicio: 8, dom: 18, load: 22, fontes: 20, midia: 20 };

export default function OptionalMorphIntro() {
  /* Servidor e cliente rendem a MESMA arvore: o no sempre existe, sempre com
     `hidden`. Quem decide exibir e o efeito, ja no cliente, onde
     sessionStorage existe — sem estado, sem render extra, sem divergencia de
     hidratacao. */
  const raizRef = useRef<HTMLDivElement>(null);
  const cartaoRef = useRef<HTMLDivElement>(null);
  const leituraRef = useRef<HTMLOutputElement>(null);

  useEffect(() => {
    const raiz = raizRef.current;
    const cartao = cartaoRef.current;
    const leitura = leituraRef.current;
    if (!raiz || !cartao || !leitura) return;

    let jaVisto = false;
    try {
      jaVisto = sessionStorage.getItem(CHAVE_SESSAO) === '1';
    } catch {
      // Modo privado/terceiros bloqueando storage: trata como primeira visita.
    }
    if (jaVisto) return;

    const html = document.documentElement;
    /* Guarda o valor INLINE anterior e devolve exatamente ele. Escrever ''
       apagaria um overflow que outra parte do site tivesse definido. */
    const overflowAnterior = html.style.overflow;

    let raf = 0;
    const timers: number[] = [];
    /* Ouvintes registrados no meio do caminho (o `transitionend` da cortina):
       desmontar antes do fim nao pode deixar nada preso ao no. */
    const limpezas: Array<() => void> = [];
    let alvo = 0; // progresso "real" acumulado
    let mostrado = 0; // progresso suavizado, o que aparece
    let liberado = false;
    let encerrando = false;
    let concluido = false;
    const inicio = performance.now();

    raiz.removeAttribute('hidden');
    html.style.overflow = 'hidden';
    html.setAttribute('data-intro', '');

    const somar = (pontos: number) => {
      alvo = Math.min(88, alvo + pontos);
    };

    const passo = () => {
      mostrado += (alvo - mostrado) * 0.12;
      const inteiro = Math.min(100, Math.round(mostrado));
      leitura.textContent = `${inteiro}%`;
      // Quatro geometrias, uma por quarto do progresso.
      cartao.dataset.etapa = String(Math.min(3, Math.floor(inteiro / 25)));
      if (liberado && inteiro >= 100) {
        morfar();
        return;
      }
      raf = requestAnimationFrame(passo);
    };

    const tentarLiberar = () => {
      if (liberado) return;
      if (alvo < 88) return;
      const restante = MINIMO_MS - (performance.now() - inicio);
      if (restante > 0) {
        timers.push(window.setTimeout(tentarLiberar, restante));
        return;
      }
      liberado = true;
      alvo = 100;
    };

    const registrar = (pontos: number) => {
      somar(pontos);
      tentarLiberar();
    };

    // ── Sinais ──────────────────────────────────────────────────────────────
    registrar(PESOS.inicio);
    if (document.readyState !== 'loading') registrar(PESOS.dom);
    else document.addEventListener('DOMContentLoaded', () => registrar(PESOS.dom), { once: true });

    if (document.readyState === 'complete') registrar(PESOS.load);
    else window.addEventListener('load', () => registrar(PESOS.load), { once: true });

    // `catch`: fonte indisponivel nao pode travar a abertura.
    if (document.fonts) document.fonts.ready.then(() => registrar(PESOS.fontes)).catch(() => registrar(PESOS.fontes));
    else registrar(PESOS.fontes);

    /* Unica midia critica: a marca do cabecalho, que tambem e o alvo da
       morfagem. Imagem ja completa resolve na hora; erro tambem resolve — falha
       de midia nao bloqueia a pagina. */
    const midia = document.querySelector<HTMLImageElement>('[data-morph-target] img, img[data-morph-target]');
    if (!midia || midia.complete) registrar(PESOS.midia);
    else {
      midia.addEventListener('load', () => registrar(PESOS.midia), { once: true });
      midia.addEventListener('error', () => registrar(PESOS.midia), { once: true });
    }

    // Teto absoluto: vence qualquer sinal pendente.
    timers.push(
      window.setTimeout(() => {
        liberado = true;
        alvo = 100;
      }, MAXIMO_MS),
    );

    // ── Morfagem e limpeza ──────────────────────────────────────────────────
    function morfar() {
      if (encerrando) return;
      encerrando = true;

      const destino = document.querySelector<HTMLElement>('[data-morph-target]');
      const r = destino?.getBoundingClientRect();
      if (r && r.width > 0) {
        // Subpixel preservado de proposito: arredondar aqui desalinha a marca.
        raiz!.style.setProperty('--mmi-left', `${r.left}px`);
        raiz!.style.setProperty('--mmi-top', `${r.top}px`);
        raiz!.style.setProperty('--mmi-width', `${r.width}px`);
        raiz!.style.setProperty('--mmi-height', `${r.height}px`);
        raiz!.dataset.estado = 'morphing';
      } else {
        // Sem alvo medivel, dissolve. Nunca fica preso na tela.
        raiz!.dataset.estado = 'saindo';
      }

      const fim = () => {
        raiz!.dataset.estado = 'saindo';

        /* A cortina termina quando o painel de cima acaba de sair — e nao quando
           um cronometro paralelo acha que ela acabou. O timer existe como rede:
           `transitionend` nao dispara se a transicao for cortada (aba oculta,
           movimento reduzido, no reciclado). */
        const painel = raiz!.querySelector<HTMLElement>('.mmi-painel--topo');
        const saidaMs = lerDuracaoSaida(raiz!);

        const aoTerminar = (evento: TransitionEvent) => {
          if (evento.target !== painel) return;
          if (evento.propertyName !== 'transform' && evento.propertyName !== 'opacity') return;
          painel?.removeEventListener('transitionend', aoTerminar);
          finalizar();
        };
        painel?.addEventListener('transitionend', aoTerminar);
        limpezas.push(() => painel?.removeEventListener('transitionend', aoTerminar));

        timers.push(window.setTimeout(finalizar, saidaMs + 160));
      };
      // Timer de seguranca: `transitionend` nao dispara se a transicao for
      // cortada (aba oculta, reduced motion, elemento reciclado).
      timers.push(window.setTimeout(fim, MORPH_MS + 80));
    }

    function finalizar() {
      /* Chamada por `transitionend` E pelo timer de seguranca: quem chegar
         primeiro encerra, o segundo nao faz nada. */
      if (concluido) return;
      concluido = true;
      limpezas.forEach((f) => f());
      try {
        sessionStorage.setItem(CHAVE_SESSAO, '1');
      } catch {
        // Sem storage a abertura volta na proxima navegacao; nao e erro fatal.
      }
      html.style.overflow = overflowAnterior;
      html.removeAttribute('data-intro');
      raiz!.setAttribute('hidden', '');
      raiz!.style.willChange = '';
    }

    raf = requestAnimationFrame(passo);

    return () => {
      cancelAnimationFrame(raf);
      timers.forEach((t) => window.clearTimeout(t));
      limpezas.forEach((f) => f());
      // Desmontar no meio (navegacao SPA) nao pode deixar a pagina sem scroll.
      html.style.overflow = overflowAnterior;
      html.removeAttribute('data-intro');
    };
  }, []);

  return (
    <div ref={raizRef} className="mmi-root" data-estado="loading" aria-hidden hidden>
      {/* A cena e a cortina: duas metades identicas que se afastam no fim. Sao
          irmas do cartao e vem ANTES dele no DOM, para ficarem por baixo. */}
      <div className="mmi-cena">
        <div className="mmi-painel mmi-painel--topo" />
        <div className="mmi-painel mmi-painel--base" />
      </div>
      {/* Costura: a linha onde a cortina vai abrir. Puramente decorativa. */}
      <span className="mmi-costura" />
      <div ref={cartaoRef} className="mmi-cartao" data-etapa="0">
        {/* eslint-disable-next-line @next/next/no-img-element -- fora do fluxo
            de layout e medido por getBoundingClientRect; o wrapper do next/image
            introduziria um no extra entre o cartao e a marca. */}
        <img className="mmi-marca" src="/images/sistran-corp-logo.png" alt="" width={280} height={96} />
        <output ref={leituraRef} className="mmi-leitura">
          0%
        </output>
        <span className="mmi-peca" />
        <span className="mmi-peca" />
      </div>
    </div>
  );
}
