'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Check } from 'lucide-react';
import { pauseSmoothScroll, resumeSmoothScroll, syncSmoothScroll } from '@/lib/smoothScroll';
import { enviarContato, ESTADO_INICIAL } from '@/app/actions/contato';

type Props = {
  open: boolean;
  onClose: () => void;
  /* Copy opcional: o mesmo modal atende o botao "Fale com a gente" do header e
     o CTA da secao de contato, que chegam com intencoes diferentes. */
  title?: string;
  description?: string;
};

/**
 * `<dialog>` nativo com `showModal()`: foco preso, Esc, `aria-modal` e inércia
 * do resto da página vêm do navegador, sem uma linha de JS.
 *
 * O que o nativo NÃO faz é travar o scroll do documento — e num site com Lenis
 * isso tem três armadilhas, tratadas no efeito abaixo. Ver
 * `.claude/skills/scroll-orchestrated-lp/references/dialogs-and-scroll-lock.md`.
 */
export default function ContactModal({
  open,
  onClose,
  title = 'Deixe uma mensagem',
  description = 'Nossa equipe entrará em contato para conversar sobre seu desafio.',
}: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  /* Uma "sessao" por abertura. O estado do envio vive em `CorpoModal`, que é
     remontado por esta chave: sem ela, reabrir o modal mostraria a tela de
     sucesso do envio anterior (`useActionState` nao tem reset). */
  const [sessao, setSessao] = useState(0);
  useEffect(() => {
    if (open) setSessao((n) => n + 1);
  }, [open]);

  /* Escrita em ref durante o render é proibida (o lint apontava exatamente
     isso): num render descartado pelo React o valor vazaria para a arvore que
     ficou. Em efeito, só depois que o render vira DOM. */
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  /* Quem abriu o modal. `showModal()` rouba o foco, então a leitura tem de
     acontecer antes — e a devolução, ao fechar. Sem isso o foco voltava para o
     BODY e o Tab seguinte reiniciava a pagina do topo (p12/p17, P0). */
  const gatilhoRef = useRef<HTMLElement | null>(null);

  /* O portal só existe no cliente. A guarda evita árvore diferente entre
     servidor e hidratação — e obriga `montado` a entrar nas dependências do
     efeito de abertura, porque no primeiro passe o ref ainda é null. */
  const [montado, setMontado] = useState(false);
  useEffect(() => setMontado(true), []);

  useEffect(() => {
    if (!montado || !open) return;
    const dialog = dialogRef.current;
    if (!dialog) return;

    /* ANTES de abrir. `showModal()` move o foco e o navegador rola a página para
       trazê-lo à vista: ler depois fotografaria a posição já quebrada. */
    const top = window.scrollY;

    /* No remonte do StrictMode a limpeza chama `dialog.close()`; o evento
       `close` é assíncrono e chega DEPOIS do `showModal()` do segundo efeito.
       Sem a guarda, esse eco avisaria o pai e o modal recém-aberto sumiria. */
    const avisar = () => {
      if (!dialog.open) onCloseRef.current();
    };
    dialog.addEventListener('close', avisar);

    if (!dialog.open) {
      /* Antes do `showModal()`: neste instante o foco ainda está no botao que
         abriu o modal ("Fale com a gente" no header, "Deixe uma mensagem" na
         secao de contato). */
      const ativo = document.activeElement;
      if (ativo instanceof HTMLElement && !dialog.contains(ativo)) {
        gatilhoRef.current = ativo;
      }

      dialog.showModal();
      dialog
        .querySelector<HTMLElement>('.contact-dialog-close')
        ?.focus({ preventScroll: true });
      // Rede de segurança: volta antes do primeiro paint, então não se vê o salto.
      if (window.scrollY !== top) window.scrollTo({ top, behavior: 'instant' });
    }

    /* Trava por cancelamento de gesto — nunca `overflow: hidden`, que torna a
       viewport não rolável e grampeia o offset em zero. Só o que nasce FORA do
       miolo é barrado; dentro dele a rolagem nativa segue funcionando. */
    const dentroDoDialogo = (alvo: EventTarget | null) =>
      alvo instanceof Node && dialog.contains(alvo);

    const travarRolagem = (event: Event) => {
      if (event.cancelable && !dentroDoDialogo(event.target)) event.preventDefault();
    };

    // `passive: false` é obrigatório: sem isso o preventDefault é ignorado.
    const opcoes = { passive: false } as const;
    window.addEventListener('wheel', travarRolagem, opcoes);
    window.addEventListener('touchmove', travarRolagem, opcoes);
    pauseSmoothScroll();

    return () => {
      dialog.removeEventListener('close', avisar);
      window.removeEventListener('wheel', travarRolagem);
      window.removeEventListener('touchmove', travarRolagem);

      /* Ordem importa: devolver a rolagem ao documento, depois a posição, e só
         então religar o Lenis já na altura certa. Invertida, o Lenis anima de
         volta para o valor velho. */
      window.scrollTo({ top, behavior: 'instant' });
      resumeSmoothScroll();
      syncSmoothScroll(top);

      if (dialog.open) dialog.close();

      /* Devolve o foco a quem abriu — depois do `close()`, senão o navegador
         ainda considera o dialogo modal e recusa o foco fora dele.
         `isConnected`: se o gatilho saiu do DOM (menu fechou), nao há para onde
         voltar e o navegador cuida do resto. */
      const gatilho = gatilhoRef.current;
      gatilhoRef.current = null;
      if (gatilho?.isConnected) gatilho.focus({ preventScroll: true });
    };
  }, [montado, open]);

  if (!montado || !open) return null;

  return createPortal(
    <dialog
      ref={dialogRef}
      className="contact-dialog"
      aria-labelledby="contato-modal-titulo"
      /* O alvo só é o próprio <dialog> quando o ponteiro cai fora do conteúdo,
         que é um elemento filho. O ::backdrop não recebe eventos. */
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
    >
      {/* O scroll é do miolo, não do <dialog>. `data-lenis-prevent` para o
          Lenis não sequestrar a roda aqui dentro. */}
      <div className="contact-dialog-inner glass-card" data-lenis-prevent>
        <button
          type="button"
          onClick={onClose}
          /* h-11/w-11 = 44px: alvo minimo de toque (WCAG 2.5.8). Era 36px. */
          className="contact-dialog-close absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white hover:bg-white/10"
          aria-label="Fechar"
        >
          <X className="h-4 w-4" strokeWidth={1.8} />
        </button>

        <CorpoModal key={sessao} onClose={onClose} title={title} description={description} />
      </div>
    </dialog>,
    document.body,
  );
}

/**
 * Miolo do modal. Separado por causa da chave de sessao: remontar aqui zera o
 * estado do envio sem tocar no `<dialog>`, que precisa continuar aberto.
 */
function CorpoModal({
  onClose,
  title,
  description,
}: {
  onClose: () => void;
  title: string;
  description: string;
}) {
  /* `action` (nao `onSubmit`): server action = POST sempre. Antes o formulario
     nao tinha method nem action, e sem JS o navegador mandava GET com nome,
     e-mail, telefone e mensagem na URL (relatorio de UX, p12, P0). */
  const [estado, enviar, pendente] = useActionState(enviarContato, ESTADO_INICIAL);
  const invalido = (campo: string) => estado.invalidos.includes(campo);

  if (estado.status === 'sucesso') {
    return (
      <div className="flex flex-col items-center py-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#34d399]/20 text-[#34d399]">
          <Check className="h-7 w-7" strokeWidth={2} />
        </div>
        <h3 className="mt-4 font-display text-xl font-bold text-white">Mensagem recebida</h3>
        <p className="mt-2 max-w-sm text-sm text-ink-muted">
          Este formulário é uma demonstração. Nenhuma integração externa foi executada.
        </p>
        <button type="button" onClick={onClose} className="btn-ghost mt-6">
          Fechar
        </button>
      </div>
    );
  }

  return (
    <>
      <h3 id="contato-modal-titulo" className="font-display text-2xl font-bold text-white">
        {title}
      </h3>
      <p className="mt-2 text-sm text-ink-muted">{description}</p>

      <form className="mt-6 space-y-4" action={enviar}>
        <Field
          id="nome"
          label="Nome Completo"
          type="text"
          autoComplete="name"
          required
          invalid={invalido('nome')}
        />
        <Field
          id="email"
          label="E-mail"
          type="email"
          autoComplete="email"
          required
          invalid={invalido('email')}
        />
        <Field
          id="telefone"
          label="Telefone"
          type="tel"
          autoComplete="tel"
          required
          invalid={invalido('telefone')}
        />
        <div>
          <label
            htmlFor="mensagem"
            className="mb-1 block text-xs font-semibold uppercase tracking-wider text-ink-muted"
          >
            Mensagem
          </label>
          <textarea
            id="mensagem"
            name="mensagem"
            rows={4}
            required
            aria-invalid={invalido('mensagem') || undefined}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/50 focus:border-[#0ed8f6]/60"
          />
        </div>

        {/* Estado tecnico do envio, nao copy: o relatorio (p12, P0) pede
            enviando/sucesso/erro anunciados sem alterar o texto do site.
            A regiao existe desde o inicio — criada junto com a mensagem, um
            leitor de tela nao anunciaria nada. */}
        <p
          role="status"
          aria-live="polite"
          className={
            estado.status === 'erro'
              ? 'text-sm font-semibold text-[#ffb4b4]'
              : 'text-sm text-ink-muted'
          }
        >
          {pendente ? 'Enviando…' : estado.mensagem}
        </p>

        <button type="submit" className="btn-primary w-full" disabled={pendente}>
          Enviar
        </button>
      </form>
    </>
  );
}

function Field({
  id,
  label,
  type,
  autoComplete,
  required,
  invalid,
}: {
  id: string;
  label: string;
  type: string;
  autoComplete?: string;
  required?: boolean;
  invalid?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1 block text-xs font-semibold uppercase tracking-wider text-ink-muted"
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        required={required}
        aria-invalid={invalid || undefined}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/50 focus:border-[#0ed8f6]/60"
      />
    </div>
  );
}
