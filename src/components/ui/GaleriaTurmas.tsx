'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';

type Turma = {
  src: string;
  alt: string;
  legenda: string;
};

/**
 * SIS-140 itens 4 e 7 — a galeria das três turmas do Gerando Talentos: movimento
 * contínuo nas fotos e clique que amplia.
 *
 * A MARCAÇÃO VEIO DO `page.tsx` (era o `<ul>` das turmas, estático e sem
 * interação). Ela virou componente de cliente por um motivo só: o clique que
 * amplia precisa de estado. O que era servidor e podia continuar servidor —
 * a seção, o título, os textos — ficou lá.
 *
 * POR QUE `<dialog>` NATIVO, e não uma `<div>` com `onClick` (ponto de atenção 4).
 * O critério de aceite pede seis coisas: abrir por `Enter`/`Espaço`, fechar por
 * `Esc`, fechar por clique fora, foco preso enquanto aberto, foco devolvido ao
 * card de origem, e rótulo dizendo o que abre. `showModal()` entrega de graça as
 * três do meio — `Esc`, o aprisionamento do foco e a inertização do resto da
 * página — que são exatamente as difíceis de acertar à mão. As outras três são as
 * poucas linhas abaixo. Uma `<div onClick>` não teria nenhuma das seis. O elemento
 * já é usado no projeto (o modal de contato do cabeçalho e o
 * `RoadmapStopDialog`), então não é padrão novo aqui.
 *
 * O que NÃO se delegou ao nativo, e por quê:
 *
 * - **Foco devolvido ao card.** `<dialog>` costuma devolver o foco ao elemento que
 *   estava ativo, mas isso depende de o gatilho continuar focável e no documento —
 *   e aqui a abertura pode vir de três botões diferentes. Guardar o nó do gatilho
 *   e focá-lo no fecho é explícito e não depende do comportamento do navegador.
 * - **Clique fora.** O `::backdrop` não é um elemento e não recebe clique próprio:
 *   um clique no fundo tem o `<dialog>` como alvo. Então o teste é "o alvo é o
 *   próprio dialog?", e o conteúdo real vai num filho — sem esse filho, todo
 *   clique dentro do modal fecharia o modal.
 *
 * `prefers-reduced-motion` (ponto de atenção 8): a deriva das fotos é CSS e para
 * no `@media` do `globals.css`; o clique que amplia continua funcionando, porque é
 * conteúdo e não movimento.
 */
/* `readonly` porque os dados chegam de um objeto `as const` em `src/data`. O
   alternativo seria um `as Turma[]` na chamada, isto é, mentir sobre o tipo para
   caber num parâmetro que este componente nunca precisou mutar. */
export default function GaleriaTurmas({ turmas }: { turmas: readonly Turma[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const gatilhoRef = useRef<HTMLButtonElement | null>(null);
  const [aberta, setAberta] = useState<Turma | null>(null);

  const abrir = useCallback((turma: Turma, gatilho: HTMLButtonElement) => {
    gatilhoRef.current = gatilho;
    setAberta(turma);
  }, []);

  /* `showModal()` só depois de o `<dialog>` ter o conteúdo, daí o efeito em vez de
     chamar dentro do `onClick`: no clique o estado ainda não foi aplicado ao DOM. */
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (aberta && !dialog.open) dialog.showModal();
    if (!aberta && dialog.open) dialog.close();
  }, [aberta]);

  /* Um `close` só: serve ao `Esc` (que o navegador dispara sozinho, sem passar
     pelo nosso `onClick`) e ao botão de fechar. É aqui que o foco volta. */
  const aoFechar = useCallback(() => {
    setAberta(null);
    gatilhoRef.current?.focus();
  }, []);

  return (
    <>
      <ul className="grid grid-cols-2 items-stretch gap-4">
        {turmas.map((f, i) => (
          <li
            key={f.src}
            /* A pluma azul e a fase das animações — as duas leem o mesmo
               `--esg-fase`. Ver o comentário no `globals.css`. */
            className={`esg-apoio${i === 0 ? ' col-span-2' : ''}`}
            style={{ ['--esg-fase' as string]: `-${((i * 11) / 3).toFixed(2)}s` }}
          >
            <figure className="glass-card relative flex h-full flex-col overflow-hidden p-0">
              {/* O `<button>` embrulha a foto: é ele o alvo do clique e do foco.
                  O rótulo NÃO é "ampliar imagem" — diz de qual turma é a foto que
                  abre, senão os três botões da galeria ficam com o mesmo nome no
                  leitor de tela e a pessoa não sabe qual está ativando. */}
              <button
                type="button"
                onClick={(e) => abrir(f, e.currentTarget)}
                aria-label={`Ampliar a foto da ${f.legenda}`}
                className="group block w-full cursor-zoom-in overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1273BC]"
              >
                <Image
                  src={f.src}
                  alt={f.alt}
                  width={750}
                  height={422}
                  sizes={
                    i === 0
                      ? '(max-width: 1023px) 92vw, 560px'
                      : '(max-width: 1023px) 45vw, 272px'
                  }
                  className="esg-turma-foto aspect-[16/9] h-auto w-full object-cover"
                />
              </button>
              <figcaption className="mt-auto px-4 py-3 text-xs font-bold uppercase tracking-[0.16em] text-[#1273BC]">
                {f.legenda}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>

      {/* `aria-modal` e `aria-label` no próprio dialog: com `showModal` o resto da
          página já fica inerte, mas o rótulo é o que diz ao leitor de tela o que
          abriu. `onCancel` é o `Esc`; `onClose` cobre qualquer outro fecho. */}
      <dialog
        ref={dialogRef}
        aria-modal="true"
        aria-label={aberta ? `Foto ampliada da ${aberta.legenda}` : undefined}
        onClose={aoFechar}
        onCancel={(e) => {
          e.preventDefault();
          aoFechar();
        }}
        /* O clique fora: o alvo de um clique no `::backdrop` é o próprio dialog.
           Por isso o conteúdo vive num `<div>` filho — sem ele, o clique na
           própria foto também fecharia. */
        onClick={(e) => {
          if (e.target === dialogRef.current) aoFechar();
        }}
        className="esg-turma-modal"
      >
        {aberta ? (
          <div className="esg-turma-modal-corpo">
            <Image
              src={aberta.src}
              alt={aberta.alt}
              width={750}
              height={422}
              className="h-auto w-full rounded-xl"
            />
            <figcaption className="mt-3 text-sm font-bold uppercase tracking-[0.16em] text-[#1273BC]">
              {aberta.legenda}
            </figcaption>
            {/* Botão de fechar de verdade, e não só o `Esc`: `Esc` não é
                descobrível, e em toque não existe. `autoFocus` para o foco cair
                num controle conhecido ao abrir, em vez de no primeiro nó do
                modal. */}
            <button
              type="button"
              autoFocus
              onClick={aoFechar}
              className="mt-4 rounded-full bg-[#1273BC] px-5 py-2 text-sm font-semibold text-white"
            >
              Fechar
            </button>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
