'use client';

import { useActionState, useId, useState } from 'react';
import { Check } from 'lucide-react';
import { enviarFormulario } from '@/app/actions/contato';
import { ESTADO_INICIAL } from '@/app/actions/contato-estado';

export type DemoField =
  | { kind: 'name-pair'; id: string; label: string; required?: boolean }
  | { kind: 'input'; id: string; label: string; type: string; autoComplete?: string; required?: boolean }
  | { kind: 'textarea'; id: string; label: string; required?: boolean }
  | {
      kind: 'file';
      id: string;
      label: string;
      hint: string;
      required?: boolean;
      /* SIS-117 — formato e tamanho passam a ser DECLARADOS no campo. Antes o
         campo era um `type="file"` cru: obrigatório, sem `accept` e sem limite,
         com um texto de apoio que só dizia "clique ou arraste". O erro aparecia
         depois do envio, ou não aparecia.
         Ambos são opcionais e têm padrão (ver `ACEITE_PADRAO` / `LIMITE_PADRAO`)
         para que nenhum campo de arquivo volte a existir sem regra por
         esquecimento — o padrão é a regra, não a ausência dela. */
      accept?: string;
      maxBytes?: number;
    };

/* Documento, não imagem e não arquivo executável. `.doc` entra porque currículo
   antigo ainda circula nesse formato; `.pages`/`.odt` ficam de fora porque quem
   receber não necessariamente abre. */
const ACEITE_PADRAO = '.pdf,.doc,.docx';
const LIMITE_PADRAO = 5 * 1024 * 1024;

/**
 * Formulario dos formularios WPForms do site, com os mesmos rotulos e as mesmas
 * obrigatoriedades. Como o ContactModal, é uma demonstracao: nao ha integracao
 * externa, o envio so troca o estado local.
 *
 * O campo "Layout" que aparece nos formularios do site (rotulo vazado do editor
 * do Elementor) nao foi reproduzido — é defeito, nao conteudo.
 *
 * SIS-117 — HOJE ESTE COMPONENTE NÃO ESTÁ MONTADO EM NENHUMA ROTA. Ele existia
 * só em `/trabalhe-conosco`, e lá o formulário de currículo saiu de cena porque
 * `enviarFormulario` não tem destino: o candidato via "Mensagem recebida" sem ter
 * se candidatado. O motivo completo, e o que precisa ser decidido para o
 * formulário voltar, estão no comentário de `src/app/trabalhe-conosco/page.tsx`.
 *
 * O componente fica, e ganhou nesta issue a regra que faltava ao campo de
 * arquivo (`accept`, limite de tamanho e validação antes do envio, em
 * `CampoArquivo`) — para que a volta seja descomentar um bloco, e não reabrir o
 * mesmo defeito.
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
        <h3 className="mt-4 font-display text-xl text-white">Mensagem recebida</h3>
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
          return <CampoArquivo key={f.id} campo={f} />;
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

/**
 * SIS-117 — campo de arquivo com regra declarada e validação ANTES do envio.
 *
 * Três camadas, e cada uma existe por um motivo diferente:
 *
 * 1. `accept` — filtra o seletor do sistema. É conveniência, não garantia: o
 *    usuário troca o filtro para "todos os arquivos" em um clique.
 * 2. `setCustomValidity` — é o que de fato BARRA o envio. Ele entra na validação
 *    nativa do formulário, então o `<form>` não submete e o navegador aponta o
 *    campo; não há `onSubmit` interceptando (a submissão é a server action, e um
 *    `preventDefault` aqui reintroduziria o problema de POST/GET que a action
 *    resolve).
 * 3. `role="alert"` com a mensagem em texto — porque a bolha nativa do navegador
 *    NÃO é anunciada de forma confiável por leitor de tela, e a issue pede erro
 *    anunciado, não só colorido. A mensagem também fica em `aria-describedby`,
 *    para quem chegar ao campo depois do erro ouvi-la junto com o rótulo.
 *
 * Nada disso substitui validação no servidor — só que hoje não há destino para
 * validar contra (ver o comentário em `trabalhe-conosco/page.tsx`). Quando
 * houver, o mesmo limite tem de ser conferido lá: isto aqui é do usuário para
 * fora, não é controle de segurança.
 */
function CampoArquivo({ campo }: { campo: Extract<DemoField, { kind: 'file' }> }) {
  const aceite = campo.accept ?? ACEITE_PADRAO;
  const limite = campo.maxBytes ?? LIMITE_PADRAO;
  const [erro, setErro] = useState('');
  const idErro = useId();

  const limiteMb = Math.round(limite / (1024 * 1024));
  const extensoes = aceite
    .split(',')
    .map((e) => e.trim().replace(/^\./, '').toUpperCase())
    .join(', ');

  return (
    <div>
      <label htmlFor={campo.id} className={labelClass}>
        {campo.label}
        {campo.required && <Required />}
      </label>
      <input
        id={campo.id}
        name={campo.id}
        type="file"
        accept={aceite}
        required={campo.required}
        aria-describedby={erro ? `${campo.id}-hint ${idErro}` : `${campo.id}-hint`}
        aria-invalid={erro ? true : undefined}
        onChange={(ev) => {
          const alvo = ev.currentTarget;
          const arquivo = alvo.files?.[0];
          if (!arquivo) {
            alvo.setCustomValidity('');
            setErro('');
            return;
          }
          /* Extensão e não `arquivo.type`: o MIME vem do sistema operacional e
             falta com frequência em `.doc`/`.docx` (chega vazio ou como
             `application/octet-stream`). A extensão é o que o usuário vê e o que
             o `accept` acabou de anunciar. */
          const ok = aceite
            .split(',')
            .some((e) => arquivo.name.toLowerCase().endsWith(e.trim().toLowerCase()));
          const mensagem = !ok
            ? `Formato não aceito. Envie um arquivo ${extensoes}.`
            : arquivo.size > limite
              ? `Arquivo de ${(arquivo.size / (1024 * 1024)).toFixed(1)} MB. O limite é ${limiteMb} MB.`
              : '';
          alvo.setCustomValidity(mensagem);
          setErro(mensagem);
        }}
        className={`${controlClass} mt-1 file:mr-3 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white`}
      />
      <p id={`${campo.id}-hint`} className="mt-2 text-xs text-ink-faint">
        {campo.hint} {extensoes} até {limiteMb} MB.
      </p>
      {erro && (
        <p id={idErro} role="alert" className="mt-2 text-xs font-semibold text-[#ffb4b4]">
          {erro}
        </p>
      )}
    </div>
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
