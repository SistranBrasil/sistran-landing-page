'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * A EXPLICAÇÃO ESCRITA DE UM TUTORIAL, EM MODAL — pedida em 14/10, junto com a retirada
 * do recado que mandava o leitor para `docs/ADMIN.md`. O raciocínio do pedido é bom: o
 * documento está no repositório, e quem usa o admin não abre o repositório. A explicação
 * tem de estar onde o vídeo está.
 *
 * Por que MODAL e não o texto aberto no cartão: são 13 passos no vídeo mais longo, e três
 * listas dessas empilhadas empurrariam o terceiro vídeo para baixo de duas telas de texto
 * — a aba deixaria de ser «os vídeos» e passaria a ser um manual com vídeos no meio. O
 * modal deixa a escolha com quem chega: assistir, ou ler.
 *
 * ── `<dialog>` NATIVO, e não um `div` com `position: fixed` ──────────────────────────
 * `showModal()` entrega de graça, e correto, o que uma implementação à mão erra uma a
 * uma: foco presa dentro do modal, Esc fechando, o resto da página inerte para leitor de
 * tela (`aria-modal` implícito), `::backdrop` como camada própria, e o foco voltando ao
 * botão que abriu. Nenhuma dependência nova.
 *
 * ⚠️ O `<dialog>` FICA SEMPRE NO DOM, aberto por `ref`, e não renderizado
 * condicionalmente. Montar só ao abrir perderia a animação de entrada do próprio
 * elemento e, pior, faria o conteúdo nascer depois do `showModal()` em alguns
 * navegadores — o modal abre vazio por um quadro.
 *
 * ⚠️ A ROLAGEM DO FUNDO É TRAVADA À MÃO. `showModal()` torna o fundo inerte para CLIQUE
 * e para TAB, mas não impede a roda do mouse de rolar a página atrás do modal — com a
 * lista de passos mais longa que a tela, rolar dentro do modal e ver o fundo andar junto
 * é desorientador. Daí o `overflow: hidden` no `<html>` enquanto está aberto, desfeito na
 * limpeza do efeito (inclusive se o componente desmontar aberto, que é o caso que deixa
 * a página travada para sempre quando esquecido).
 */
export type Explicacao = {
  titulo: string;
  duracao: string;
  /** O que o vídeo mostra, na ordem em que mostra. Transcrito das legendas do próprio vídeo. */
  passos: readonly string[];
  /** O aviso que o vídeo deixa no fim, quando deixa. */
  atencao?: string;
};

export function ExplicacaoModal({ explicacao }: { explicacao: Explicacao }) {
  const dialogo = useRef<HTMLDialogElement>(null);
  const [aberto, setAberto] = useState(false);

  const abrir = useCallback(() => {
    dialogo.current?.showModal();
    setAberto(true);
  }, []);

  const fechar = useCallback(() => {
    dialogo.current?.close();
  }, []);

  useEffect(() => {
    if (!aberto) return;
    const anterior = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = anterior;
    };
  }, [aberto]);

  return (
    <>
      <button
        type="button"
        onClick={abrir}
        className="rounded-full border border-[#0079cb]/40 bg-[#0079cb]/[0.07] px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-[#0079cb] transition-colors hover:bg-[#0079cb]/15"
      >
        passo a passo escrito
      </button>

      <dialog
        ref={dialogo}
        /* `onClose` cobre TODOS os caminhos de fechamento — botão, Esc e o `close()` do
           clique no fundo. Sincronizar o estado só no `fechar()` deixaria a trava de
           rolagem ligada quando a pessoa fecha com Esc, que é o atalho mais usado. */
        onClose={() => setAberto(false)}
        /* O clique no FUNDO fecha. O `<dialog>` ocupa a tela inteira, então o alvo do
           clique só é o próprio `<dialog>` quando o ponto está fora do painel branco —
           o conteúdo é um filho, e cliques nele têm o filho como alvo. É o teste mais
           barato que existe para «clicou fora», sem medir coordenadas. */
        onClick={(evento) => {
          if (evento.target === dialogo.current) fechar();
        }}
        /**
         * `overflow-hidden` CORRIGE UM DEFEITO MEDIDO: o painel é `rounded-2xl` e a caixa
         * rolável lá dentro tem cantos retos — sem o recorte no pai, ela pinta sobre os
         * dois cantos de baixo e o arredondamento desaparece justamente onde a lista é
         * cortada (capturado antes da correção).
         *
         * `m-auto` é redundante HOJE e fica como garantia explícita: a centralização vem
         * do `margin: auto` que o navegador dá ao `dialog:modal`, e o preflight do
         * Tailwind não o zera — conferido na lista de `margin: 0` dele, que é
         * `blockquote, dl, dd, h1–h6, hr, figure, p, pre` e não inclui `dialog`. Dito de
         * outro jeito: não há bug aqui, e esta classe existe para o dia em que a lista
         * mudar, não para consertar algo.
         */
        className="m-auto max-h-[85vh] w-[min(92vw,640px)] overflow-hidden rounded-2xl border border-black/[0.07] bg-white p-0 text-[#0f172a] shadow-[0_24px_64px_rgba(16,24,40,0.24)] backdrop:bg-[#0f172a]/55 backdrop:backdrop-blur-sm"
        aria-labelledby="titulo-explicacao"
      >
        {/* O cabeçalho é `sticky` porque a lista rola: sem isso, quem desce até o passo 11
            perde o título e o botão de fechar, e o único caminho de volta passa a ser o
            Esc — que não está escrito em lugar nenhum da tela. */}
        <div className="sticky top-0 flex items-start justify-between gap-4 border-b border-black/[0.07] bg-white/95 px-6 py-4 backdrop-blur-sm">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#98a2b3]">
              passo a passo · {explicacao.duracao} de vídeo
            </p>
            <h3
              id="titulo-explicacao"
              className="mt-1 text-[19px] font-medium leading-snug tracking-tight"
            >
              {explicacao.titulo}
            </h3>
          </div>
          <button
            type="button"
            onClick={fechar}
            aria-label="Fechar"
            /* 36px de lado: o mínimo confortável para toque, e o `leading-none` evita que
               o glifo do × desça do centro óptico. */
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[18px] leading-none text-[#667085] transition-colors hover:bg-black/[0.05] hover:text-[#0f172a]"
          >
            ×
          </button>
        </div>

        <div className="max-h-[calc(85vh-88px)] overflow-y-auto px-6 py-5">
          {/* `<ol>` e não `<ul>`: a ordem É a informação — são passos, e o leitor de tela
              anuncia «item 3 de 13», que é exatamente o que ajuda aqui. */}
          <ol className="flex flex-col gap-3">
            {explicacao.passos.map((passo, indice) => (
              <li key={passo} className="flex gap-3">
                <span
                  aria-hidden
                  className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#0079cb]/10 font-mono text-[11px] text-[#0079cb]"
                >
                  {indice + 1}
                </span>
                <span className="text-sm leading-relaxed text-[#344054]">{passo}</span>
              </li>
            ))}
          </ol>

          {explicacao.atencao && (
            <p className="mt-5 rounded-xl border border-amber-300/70 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em]">atenção</span>
              <br />
              {explicacao.atencao}
            </p>
          )}
        </div>
      </dialog>
    </>
  );
}
