'use client';

import { useActionState } from 'react';
import { Check } from 'lucide-react';
import { enviarFormulario, ESTADO_INICIAL } from '@/app/actions/contato';

export type DemoField =
  | { kind: 'name-pair'; id: string; label: string; required?: boolean }
  | { kind: 'input'; id: string; label: string; type: string; autoComplete?: string; required?: boolean }
  | { kind: 'textarea'; id: string; label: string; required?: boolean }
  | { kind: 'file'; id: string; label: string; hint: string; required?: boolean };

/**
 * Formulario dos formularios WPForms do site, com os mesmos rotulos e as mesmas
 * obrigatoriedades. Como o ContactModal, é uma demonstracao: nao ha integracao
 * externa, o envio so troca o estado local.
 *
 * O campo "Layout" que aparece nos formularios do site (rotulo vazado do editor
 * do Elementor) nao foi reproduzido — é defeito, nao conteudo.
 */
export default function DemoForm({
  fields,
  submitLabel = 'Enviar',
}: {
  fields: readonly DemoField[];
  submitLabel?: string;
}) {
  /* Server action = POST. Antes era `onSubmit` sem `method`/`action`: sem JS o
     navegador enviava GET e publicava nome, e-mail, telefone, mensagem e todo o
     resto na barra de endereços (relatorio de UX, p12, P0). */
  const [estado, enviar, pendente] = useActionState(enviarFormulario, ESTADO_INICIAL);
  const sent = estado.status === 'sucesso';

  if (sent) {
    return (
      <div className="glass-card flex flex-col items-center p-8 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#34d399]/20 text-[#34d399]">
          <Check className="h-7 w-7" strokeWidth={2} />
        </div>
        <h3 className="mt-4 font-display text-xl font-bold text-white">Mensagem recebida</h3>
        <p className="mt-2 max-w-sm text-sm text-ink-muted">
          Este formulário é uma demonstração. Nenhuma integração externa foi executada.
        </p>
      </div>
    );
  }

  return (
    <form className="glass-card space-y-5 p-7 md:p-8" action={enviar}>
      {fields.map((f) => {
        if (f.kind === 'name-pair') {
          return (
            <fieldset key={f.id} className="space-y-3">
              <legend className={labelClass}>
                {f.label}
                {f.required && <Required />}
              </legend>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Input id={`${f.id}-nome`} label="Nome" type="text" autoComplete="given-name" required={f.required} />
                <Input
                  id={`${f.id}-sobrenome`}
                  label="Sobrenome"
                  type="text"
                  autoComplete="family-name"
                  required={f.required}
                />
              </div>
            </fieldset>
          );
        }

        if (f.kind === 'textarea') {
          return (
            <div key={f.id}>
              <label htmlFor={f.id} className={labelClass}>
                {f.label}
                {f.required && <Required />}
              </label>
              <textarea
                id={f.id}
                name={f.id}
                rows={5}
                required={f.required}
                className={`${controlClass} mt-1`}
              />
            </div>
          );
        }

        if (f.kind === 'file') {
          return (
            <div key={f.id}>
              <label htmlFor={f.id} className={labelClass}>
                {f.label}
                {f.required && <Required />}
              </label>
              <input
                id={f.id}
                name={f.id}
                type="file"
                required={f.required}
                aria-describedby={`${f.id}-hint`}
                className={`${controlClass} mt-1 file:mr-3 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white`}
              />
              <p id={`${f.id}-hint`} className="mt-2 text-xs text-ink-faint">
                {f.hint}
              </p>
            </div>
          );
        }

        return (
          <Input
            key={f.id}
            id={f.id}
            label={f.label}
            type={f.type}
            autoComplete={f.autoComplete}
            required={f.required}
            standalone
          />
        );
      })}

      {/* Estado tecnico do envio (enviando/erro), nao copy do site. Criada junto
          com o formulario para que `aria-live` de fato anuncie a mudanca. */}
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
        {submitLabel}
      </button>
    </form>
  );
}

const labelClass = 'mb-1 block text-xs font-semibold uppercase tracking-wider text-ink-muted';
const controlClass =
  'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/50 focus:border-[#0ed8f6]/60';

function Required() {
  return (
    <span aria-hidden className="ml-1 text-[#A5F0FF]">
      *
    </span>
  );
}

function Input({
  id,
  label,
  type,
  autoComplete,
  required,
  standalone,
}: {
  id: string;
  label: string;
  type: string;
  autoComplete?: string;
  required?: boolean;
  standalone?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
        {standalone && required && <Required />}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        required={required}
        className={controlClass}
      />
    </div>
  );
}
