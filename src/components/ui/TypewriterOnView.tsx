'use client';

import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '@/lib/motion';

type Props = {
  /** Texto exato do titulo. Este componente nunca reescreve nada. */
  texto: string;
  /** Elemento observado pelo IntersectionObserver (a secao, nao o titulo). */
  gatilhoRef: React.RefObject<HTMLElement | null>;
  /** Chamado uma vez, quando o ultimo grafema aparece. */
  onFim?: () => void;
};

const LIMIAR = 0.3;
const ATRASO_MS = 180;
const VELOCIDADE_MS = 50;
const VELOCIDADE_MOBILE_MS = 35; // < 700px: o titulo quebra em mais linhas
const LARGURA_MOBILE = 700;

/** Grafemas, nao code units: "ã" e emoji contam como um caractere so. */
function grafemas(texto: string): string[] {
  const Segmentador = (
    Intl as typeof Intl & { Segmenter?: typeof Intl.Segmenter }
  ).Segmenter;
  if (typeof Segmentador === 'function') {
    try {
      const seg = new Segmentador('pt-BR', { granularity: 'grapheme' });
      return Array.from(seg.segment(texto), (s) => s.segment);
    } catch {
      // Navegador com Segmenter parcial: cai no fallback abaixo.
    }
  }
  return Array.from(texto);
}

/**
 * TypewriterOnView — digitacao progressiva de um titulo curto, uma vez por
 * carregamento da pagina.
 *
 * Tres camadas no mesmo espaco, e é isso que evita layout shift:
 *
 * 1. `sr-only` com o texto COMPLETO — é o que o leitor de tela le, desde o
 *    primeiro render. Nao é `display: none`, entao continua na arvore
 *    acessivel. Nenhum caractere é anunciado individualmente e nao existe
 *    `aria-live`.
 * 2. espelho `aria-hidden` com o texto completo em `visibility: hidden` — reserva
 *    exatamente a altura e a largura finais, com a quebra de linha real.
 * 3. camada visual `aria-hidden`, sobreposta ao espelho, com um `<span>` por
 *    grafema. A digitacao acende opacidade, nao insere no
 *    fluxo — o paragrafo e o botao nunca se movem.
 *
 * Sem JavaScript o estado inicial ja é o texto completo visivel. O efeito
 * ARMA a animacao (esconde os grafemas) apenas se o movimento estiver
 * liberado; em movimento reduzido nada acontece e o CSS ainda garante os
 * grafemas visiveis, caso a preferencia mude no meio da sessao.
 */
export default function TypewriterOnView({ texto, gatilhoRef, onFim }: Props) {
  const raizRef = useRef<HTMLSpanElement>(null);
  /* Quebra em palavras e espacos: a camada visual precisa quebrar linha nos
     mesmos pontos que o espelho, senao as duas deixam de coincidir. */
  const palavras = texto.split(/(\s+)/).filter(Boolean);

  /* `onFim` num ref: o efeito nao pode ter a funcao como dependencia (mudaria
     de identidade a cada render do pai e rearmaria a digitacao). */
  const fimRef = useRef(onFim);
  /* A escrita no ref vai num efeito, nao no corpo do render: mutar ref durante o
     render é proibido (e o lint acusa) porque um render descartado deixaria o
     valor sujo. */
  useEffect(() => {
    fimRef.current = onFim;
  }, [onFim]);

  useEffect(() => {
    const raiz = raizRef.current;
    const alvo = gatilhoRef.current;
    if (!raiz || !alvo) return;
    // Preferencia RESOLVIDA (sistema + controle do site): o script inline do
    // layout embrulha matchMedia, entao aqui ja vem a decisao final.
    if (prefersReducedMotion()) return;

    const letras = Array.from(raiz.querySelectorAll<HTMLElement>('[data-tw-char]'));
    if (!letras.length) return;

    /* O cursor é criado aqui, e nao no JSX: ele CAMINHA pelo DOM junto com a
       digitacao, e mover um no que o React renderizou é pedir briga com a
       reconciliacao. Criado no efeito, ele é 100% nosso — e a limpeza o
       remove. */
    const cursor = document.createElement('span');
    cursor.className = 'tw-cursor';
    cursor.setAttribute('aria-hidden', 'true');

    /* O cursor caminha junto com a digitacao, entao ele MUDA de lugar no DOM.
       Isso é seguro para a largura porque o `.tw-cursor` tem margem lateral
       negativa que anula os seus 2px: entrar ou sair do meio do texto nao
       reposiciona nenhum grafema nem altera a quebra de linha. */
    const posicionar = (i: number) => {
      const proximo = letras[i];
      if (proximo) proximo.before(cursor);
      else letras[letras.length - 1].after(cursor);
    };

    const passo =
      window.innerWidth < LARGURA_MOBILE ? VELOCIDADE_MOBILE_MS : VELOCIDADE_MS;

    // Arma: esconde os grafemas e liga o cursor.
    raiz.dataset.tw = 'armado';
    letras.forEach((l) => {
      l.dataset.twVisivel = '0';
    });
    posicionar(0);

    const timers: number[] = [];
    let indice = 0;
    let intervalo = 0;

    const encerrar = () => {
      /* 'pronto' apaga o cursor por transicao de opacidade; a remocao do no
         espera esse tempo para nao cortar o fade. */
      raiz.dataset.tw = 'pronto';
      timers.push(window.setTimeout(() => cursor.remove(), 420));
      letras.forEach((l) => {
        l.dataset.twVisivel = '1';
      });
      fimRef.current?.();
    };

    const digitar = () => {
      raiz.dataset.tw = 'digitando';
      intervalo = window.setInterval(() => {
        letras[indice].dataset.twVisivel = '1';
        indice += 1;
        posicionar(indice);
        if (indice >= letras.length) {
          window.clearInterval(intervalo);
          intervalo = 0;
          encerrar();
        }
      }, passo);
    };

    /* `once`: o observer se desliga no primeiro disparo, entao sair e voltar a
       entrar na viewport nao reinicia a digitacao. */
    const observer = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (entrada.intersectionRatio < LIMIAR) continue;
          observer.disconnect();
          timers.push(window.setTimeout(digitar, ATRASO_MS));
          return;
        }
      },
      { threshold: LIMIAR },
    );
    observer.observe(alvo);

    return () => {
      observer.disconnect();
      timers.forEach((t) => window.clearTimeout(t));
      if (intervalo) window.clearInterval(intervalo);
      /* Desmontar no meio da digitacao nao pode deixar meio titulo na tela:
         o proximo render volta ao estado completo. */
      raiz.dataset.tw = 'pronto';
      letras.forEach((l) => {
        l.dataset.twVisivel = '1';
      });
      cursor.remove();
    };
  }, [gatilhoRef, texto]);

  return (
    <span ref={raizRef} className="tw-raiz" data-tw="pronto">
      <span className="sr-only">{texto}</span>
      <span aria-hidden className="tw-espelho">
        {texto}
      </span>
      <span aria-hidden className="tw-camada">
        {palavras.map((palavra, p) =>
          /^\s+$/.test(palavra) ? (
            /* Espaco solto: é aqui, e somente aqui, que a camada pode quebrar
               linha — exatamente como o espelho. Chave por indice: a lista vem
               de um texto fixo, nunca é reordenada nem filtrada. */
            <span key={`e${p}`} data-tw-char="" data-tw-visivel="1" className="tw-char">
              {palavra}
            </span>
          ) : (
            /* `.tw-palavra` é `white-space: nowrap`: sem isso o navegador
               poderia quebrar a linha ENTRE dois grafemas da mesma palavra, e a
               camada deixaria de coincidir com o espelho. */
            <span key={`p${p}`} className="tw-palavra">
              {grafemas(palavra).map((parte, i) => (
                <span key={`${i}-${parte}`} data-tw-char="" data-tw-visivel="1" className="tw-char">
                  {parte}
                </span>
              ))}
            </span>
          ),
        )}
      </span>
    </span>
  );
}
