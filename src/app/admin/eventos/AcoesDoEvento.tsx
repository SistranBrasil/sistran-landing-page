'use client';

import { useRouter } from 'next/navigation';
import { useRef, useState, useTransition } from 'react';
import { excluirEvento, moverEvento, type EstadoLista } from './acoes';

/**
 * EXCLUIR E REORDENAR, na própria lista — 01/10.
 *
 * ⚠️ POR QUE FICA FORA DO `<Link>` DO CARTÃO, e não dentro dele: botão dentro de âncora é
 * HTML inválido, e o efeito prático não é teórico — o clique no botão navegaria para a
 * edição junto com a ação, ou seja, excluir levaria o operador para a página de um evento
 * que acabou de deixar de existir. A barra de ações é irmã do cartão, não filha.
 *
 * ⚠️ É COMPONENTE DE CLIENTE pela CONFIRMAÇÃO, que é o único lugar onde ela pode morar
 * (ver a nota de `excluirEvento`): no servidor seria teatro, porque quem monta um POST
 * direto não passa por diálogo nenhum. Aqui ela protege o caso real — o clique errado numa
 * grade de quinze cartões parecidos.
 *
 * `useTransition` em vez de `useActionState` porque estas duas ações recebem ARGUMENTOS
 * (id e direção), e não um `FormData`: `moverEvento(id, 'cima')` é uma assinatura fechada
 * de propósito, para que um POST direto não consiga mandar um deslocamento numérico que
 * saia do array.
 */
export default function AcoesDoEvento({
  id,
  titulo,
  primeiro,
  ultimo,
}: {
  id: string;
  /** No texto da confirmação, porque «excluir este evento?» não diz qual. */
  titulo: string;
  primeiro: boolean;
  ultimo: boolean;
}) {
  const [pendente, comecar] = useTransition();
  const [erro, setErro] = useState<string | null>(null);
  const dialogo = useRef<HTMLDialogElement>(null);
  const router = useRouter();

  const rodar = (acao: () => Promise<EstadoLista>) => {
    setErro(null);
    comecar(async () => {
      const r = await acao();
      /* O sucesso não precisa de aviso: o cartão muda de lugar ou desaparece na frente de
         quem clicou. A falha precisa, porque sem ela o operador conclui que a ordem foi
         salva. */
      if (r.estado === 'erro') {
        setErro(r.mensagem);
        return;
      }

      /**
       * ⚠️ `router.refresh()` APESAR DE A AÇÃO JÁ CHAMAR `revalidatePath` — 02/10, porque
       * o cartão excluído «continuava depois que exclui, precisa recarregar».
       *
       * O comentário que estava acima dizia «a lista já é revalidada pela própria ação», e
       * a frase descrevia o servidor corretamente e o navegador não. `revalidatePath`
       * invalida o cache do servidor; o que repinta ESTA tela é o roteador aplicar uma
       * resposta nova. Numa Server Function chamada IMPERATIVAMENTE — `excluirEvento(id)`
       * dentro de `startTransition`, que é o desenho aqui porque estas ações recebem
       * argumentos e não `FormData` — esse repinte não vem junto como vem numa submissão de
       * `<form action>`. O catálogo ficava certo e a tela ficava velha, que é exatamente o
       * sintoma de «precisa recarregar».
       *
       * Antes disto eu tinha atribuído o sintoma à corrida de propagação do Blob e corrigi
       * aquilo em `eventosLoja.ts`. Aquela corrida é real e a correção continua necessária —
       * ela é o que garante que o refresh daqui LEIA o catálogo novo e não o cacheado. Mas
       * ela não era a causa deste sintoma. Fica registrado para ninguém desfazer um dos dois
       * achando que são a mesma coisa.
       *
       * Vale para reordenar também, e não só para excluir: a seta movia o evento no
       * catálogo sem trocar os cartões de lugar na tela.
       */
      router.refresh();
    });
  };

  const botao =
    'grid h-7 w-7 place-items-center rounded-md border border-black/10 bg-white font-mono text-xs text-[#475467] transition-colors hover:border-[#0079cb]/40 hover:text-[#0079cb] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-black/10 disabled:hover:text-[#475467]';

  return (
    <div className="mt-2 flex flex-wrap items-center gap-2">
      <button
        type="button"
        className={botao}
        /* Nas pontas o botão fica desabilitado, e não escondido: esconder mudaria a
           largura da barra de um cartão para o outro e faria o botão de excluir dançar
           de posição entre vizinhos. */
        disabled={pendente || primeiro}
        aria-label={`Mover "${titulo}" para cima`}
        onClick={() => rodar(() => moverEvento(id, 'cima'))}
      >
        ↑
      </button>
      <button
        type="button"
        className={botao}
        disabled={pendente || ultimo}
        aria-label={`Mover "${titulo}" para baixo`}
        onClick={() => rodar(() => moverEvento(id, 'baixo'))}
      >
        ↓
      </button>

      <button
        type="button"
        disabled={pendente}
        className="ml-auto rounded-md px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[#98a2b3] transition-colors hover:bg-red-50 hover:text-red-700 disabled:opacity-40"
        onClick={() => dialogo.current?.showModal()}
      >
        {pendente ? 'excluindo…' : 'excluir'}
      </button>

      {/**
       * ⚠️ ERA `window.confirm`, e a nota que estava aqui defendia a escolha dizendo que um
       * modal próprio «exigiria foco preso e fechamento por Esc para não ser pior em
       * acessibilidade». A objeção era real e deixou de valer pelo COMO: `<dialog>` com
       * `showModal()` entrega as três coisas de graça — foco preso dentro do diálogo, Esc
       * fechando, e o resto da página marcado como inerte pelo navegador. Modal caseiro com
       * `div` + `z-index` é que teria o problema descrito.
       *
       * O que o modal ganha sobre o `confirm`: mostra a arte e o título do evento que vai
       * sumir. Numa grade de quinze cartões parecidos, ler o nome numa caixa cinza do
       * sistema operacional é exatamente o momento em que se clica em OK sem ler.
       */}
      <dialog
        ref={dialogo}
        /* `backdrop:` é o pseudo-elemento do próprio `<dialog>`; sem ele o fundo fica
           transparente e o modal parece um cartão solto no meio da lista. */
        className="m-auto w-[min(26rem,calc(100vw-2rem))] rounded-2xl border border-black/[0.07] bg-white p-6 text-left shadow-[0_24px_64px_rgba(16,24,40,0.24)] backdrop:bg-[#0f172a]/40 backdrop:backdrop-blur-sm"
      >
        <h2 className="text-lg font-medium leading-snug text-[#0f172a]">Excluir este evento?</h2>
        <p className="mt-3 text-sm leading-relaxed text-[#475467]">
          <span className="font-medium text-[#0f172a]">{titulo}</span> sai de{' '}
          <span className="font-mono text-[#0079cb]">/eventos-inovacao</span> imediatamente.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-[#475467]">
          {/* Dito porque é verdade e porque muda a decisão: a arte ficar na loja significa
              que recriar o evento e reaproveitar a imagem é possível — ver a nota de
              `excluirEvento`. Sem isso o operador supõe que perdeu o arquivo também. */}
          Não tem desfazer. A imagem continua guardada na loja, então um evento recriado pode
          reaproveitá-la.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
          <button
            type="button"
            /* O cancelar vem PRIMEIRO na ordem de foco por ser a saída segura: ao abrir, o
               navegador foca o primeiro elemento focável, e um Enter apressado aqui fecha o
               diálogo em vez de excluir o evento. */
            onClick={() => dialogo.current?.close()}
            className="rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[#667085] transition-colors hover:bg-black/[0.04] hover:text-[#0f172a]"
          >
            cancelar
          </button>
          <button
            type="button"
            onClick={() => {
              /* Fecha ANTES de disparar: a ação revalida a lista e este cartão deixa de ser
                 renderizado, levando o `<dialog>` com ele — um modal desmontado no meio de
                 `showModal()` deixa a página inerte, sem nada para fechar. */
              dialogo.current?.close();
              rodar(() => excluirEvento(id));
            }}
            className="rounded-full bg-[#b42318] px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-white transition-opacity hover:opacity-90"
          >
            excluir
          </button>
        </div>
      </dialog>

      {erro && (
        <p role="alert" className="w-full text-xs leading-relaxed text-red-700">
          {erro}
        </p>
      )}
    </div>
  );
}
