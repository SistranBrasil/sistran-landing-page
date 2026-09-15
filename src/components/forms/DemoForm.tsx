'use client';

import { useActionState, useId, useRef, useState } from 'react';
import { Check, UploadCloud, FileText, AlertCircle } from 'lucide-react';
import { enviarFormulario } from '@/app/actions/contato';
import { ESTADO_INICIAL } from '@/app/actions/contato-estado';
import './demo-form.css';

/* SIS-223 — `DemoInput` ganhou nome próprio porque agora aparece em dois
   lugares: solto na lista de campos (`kind: 'input'`) e dentro de uma DUPLA
   (`kind: 'row'`). Sem o alias, o tipo da dupla teria de repetir a lista de
   propriedades, e as duas cópias divergiriam na primeira propriedade nova. */
export type DemoInput = {
  kind: 'input';
  id: string;
  label: string;
  type: string;
  autoComplete?: string;
  required?: boolean;
  /* SIS-223 — placeholder DECLARÁVEL. O conteúdo-site especifica
     `(11) 96123-4567` para o telefone, e é o mesmo texto que `/contato` já
     mostra (`ContactPanel.tsx`, campo `telefone`); sem esta propriedade o campo
     de telefone daqui seria o único dos dois sem exemplo de formato. */
  placeholder?: string;
};

export type DemoField =
  | { kind: 'name-pair'; id: string; label: string; required?: boolean }
  | DemoInput
  | { kind: 'checkbox'; id: string; label: React.ReactNode; required?: boolean }
  /* SIS-223 — dupla numa linha só, para PARIDADE com `/contato`: lá e-mail e
     telefone dividem a linha (`.contact-dialog-dupla`) justamente para o
     formulário não ser uma coluna longa de caixas iguais. A dupla é do FORM, e
     não do campo, porque quem decide o arranjo é quem monta a lista. */
  | { kind: 'row'; id: string; fields: readonly DemoInput[] }
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
 * SIS-117 tirou este componente de cena: ele existia só em `/trabalhe-conosco`, e
 * lá o formulário de currículo saiu porque `enviarFormulario` não tem destino — o
 * candidato via "Mensagem recebida" sem ter se candidatado. O componente ficou no
 * repositório e ganhou naquela issue a regra que faltava ao campo de arquivo
 * (`accept`, limite de tamanho e validação antes do envio, em `CampoArquivo`).
 *
 * SIS-223 — ELE VOLTOU A SER MONTADO, em `/trabalhe-conosco`, e o bloqueio de
 * produto da SIS-117 NÃO foi resolvido: o destino do currículo (caixa de RH,
 * storage, ATS, base legal, prazo de guarda) continua aberto. O que mudou é o que
 * a página DIZ. A SIS-223 pede o formulário de volta com o fluxo de `/contato`, e
 * `/contato` é declaradamente demonstração; então este formulário só pode existir
 * dizendo a mesma coisa, no mesmo lugar onde a coleta acontece. É para isso que
 * existe `successNote`/`privacyNote` — não são enfeite, são a condição para o
 * campo de arquivo poder voltar sem enganar quem preenche.
 *
 * O caminho é UM só (é o que a SIS-223 exige): este componente, evoluído — dupla
 * numa linha e `dropzone` no campo de arquivo — e não uma variante do
 * `ContactPanel` com um campo a mais. `ContactPanel` traz consigo a foto da sede
 * em máscara curva, a rede de linhas animadas e o bloco de telefone; nada disso é
 * candidatura, e forkar aquele CSS para apagar três quartos dele é o fork que a
 * issue proíbe.
 */
export default function DemoForm({
  fields,
  submitLabel = 'Enviar',
  successNote,
  privacyNote,
  className = 'glass-card space-y-5 p-7 md:p-8',
}: {
  fields: readonly DemoField[];
  submitLabel?: string;
  /**
   * Texto do card de sucesso. O padrão é o mesmo de `/contato`; quem monta pode
   * trocar quando o formulário coleta algo que exige ser mais específico (o
   * currículo de `/trabalhe-conosco` é o caso: "Mensagem recebida" não pode
   * insinuar que o arquivo chegou ao RH).
   */
  successNote?: React.ReactNode;
  /** Aviso no pé do formulário, no ponto onde a coleta acontece. */
  privacyNote?: React.ReactNode;
  /** Moldura. O padrão é o card de vidro; quem anima a entrada troca a classe. */
  className?: string;
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
          {successNote ??
            'Este formulário é uma demonstração. Nenhuma integração externa foi executada.'}
        </p>
      </div>
    );
  }

  return (
    <form className={className} action={enviar}>
      {fields.map((f) => {
        /* SIS-223 — a dupla é só arranjo: os campos de dentro são os MESMOS
           `Input` da lista solta, com a mesma marcação e a mesma validação
           nativa. Uma grade de duas colunas que vira uma em tela estreita, como
           a `.contact-dialog-dupla` de `/contato`. */
        if (f.kind === 'row') {
          return (
            <div
              key={f.id}
              className={`grid grid-cols-1 gap-3 ${f.fields.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}
            >
              {f.fields.map((campo) => (
                <Input
                  key={campo.id}
                  id={campo.id}
                  label={campo.label}
                  type={campo.type}
                  autoComplete={campo.autoComplete}
                  placeholder={campo.placeholder}
                  required={campo.required}
                  standalone
                />
              ))}
            </div>
          );
        }

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

        if (f.kind === 'checkbox') {
          return (
            <label key={f.id} className="df-checkbox">
              <input id={f.id} name={f.id} type="checkbox" required={f.required} />
              <span>{f.label}</span>
            </label>
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
            placeholder={f.placeholder}
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

      {/* SIS-223 — o aviso fica DEPOIS do botão e dentro do formulário, no ponto
          onde a coleta acontece. Antes do botão ele seria lido como instrução de
          preenchimento; fora do card, como texto de página. */}
      {privacyNote ? (
        <p className="text-xs leading-relaxed text-ink-faint">{privacyNote}</p>
      ) : null}
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
 *
 * ── SIS-223: o campo passou a ser ÁREA, e não uma caixa de `type="file"` crua ──
 *
 * O texto do conteúdo-site é «Clique ou arraste um arquivo para esta área para
 * fazer upload.» — ele PROMETE uma área que aceita arrastar, e o `type="file"`
 * padrão não tem área nenhuma: aceita soltar apenas em cima do botão minúsculo
 * "Escolher arquivo". A promessa é do texto legado, não desta issue; o que a
 * issue faz é cumpri-la.
 *
 * O `<input type="file">` CONTINUA sendo o controle, e continua no DOM — só que
 * agora ele cobre a área inteira em `opacity: 0` (`.df-drop-input`). Três
 * consequências, todas de propósito:
 *
 * 1. Clicar em qualquer ponto da área abre o seletor, sem `ref.click()`.
 * 2. Ele recebe foco e aparece no Tab como qualquer campo, e a área desenha o
 *    anel por `:focus-within` — o que um `display: none` teria destruído.
 * 3. A bolha de validação nativa continua ancorada aqui. Um input escondido de
 *    verdade faria o Chrome recusar o foco ("An invalid form control … is not
 *    focusable") e o formulário travaria sem dizer por quê.
 *
 * Arrastar e soltar é tratado à mão porque soltar em cima de um input `opacity:
 * 0` não preenche `files` em todos os navegadores. O arquivo entra por
 * `DataTransfer`, que é a única forma de escrever em `input.files` de modo
 * suportado — daí o `evento.dataTransfer.files` ser copiado em vez de guardado
 * em estado: o que submete é o input, não o React.
 */
function CampoArquivo({ campo }: { campo: Extract<DemoField, { kind: 'file' }> }) {
  const aceite = campo.accept ?? ACEITE_PADRAO;
  const limite = campo.maxBytes ?? LIMITE_PADRAO;
  const [erro, setErro] = useState('');
  const [nome, setNome] = useState('');
  const [arrastando, setArrastando] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const idErro = useId();

  const limiteMb = Math.round(limite / (1024 * 1024));
  const extensoes = aceite
    .split(',')
    .map((e) => e.trim().replace(/^\./, '').toUpperCase())
    .join(', ');

  /* Uma função para os dois caminhos de entrada (seletor e arrastar): a regra do
     campo não pode depender de COMO o arquivo chegou. */
  const conferir = (alvo: HTMLInputElement) => {
    const arquivo = alvo.files?.[0];
    if (!arquivo) {
      alvo.setCustomValidity('');
      setErro('');
      setNome('');
      return;
    }
    /* Extensão e não `arquivo.type`: o MIME vem do sistema operacional e falta
       com frequência em `.doc`/`.docx` (chega vazio ou como
       `application/octet-stream`). A extensão é o que o usuário vê e o que o
       `accept` acabou de anunciar. */
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
    setNome(arquivo.name);
  };

  return (
    <div>
      <label htmlFor={campo.id} className={labelClass}>
        {campo.label}
        {campo.required && <Required />}
      </label>

      <div
        className="df-drop"
        data-arrastando={arrastando ? 'true' : undefined}
        data-invalido={erro ? 'true' : undefined}
        data-preenchido={nome && !erro ? 'true' : undefined}
        /* `onDragOver` com `preventDefault` é obrigatório: sem ele o navegador
           mantém o comportamento padrão (abrir o arquivo na aba) e o `drop`
           nunca chega. */
        onDragOver={(ev) => {
          ev.preventDefault();
          setArrastando(true);
        }}
        onDragEnter={() => setArrastando(true)}
        /* `relatedTarget` fora da área: sem essa checagem, passar por cima de um
           filho (o ícone, o texto) dispara `dragleave` do pai e a área
           "desacende" no meio do arrasto. */
        onDragLeave={(ev) => {
          if (ev.currentTarget.contains(ev.relatedTarget as Node | null)) return;
          setArrastando(false);
        }}
        onDrop={(ev) => {
          ev.preventDefault();
          setArrastando(false);
          const entrada = inputRef.current;
          const arquivo = ev.dataTransfer.files?.[0];
          if (!entrada || !arquivo) return;
          /* Um só arquivo: o campo é `Envio de arquivo` no singular e o input
             não é `multiple`. Soltar três currículos e ver o primeiro aceito em
             silêncio é pior que não aceitar — o `DataTransfer` novo garante que
             o que está no input é exatamente o que a área mostra. */
          const pacote = new DataTransfer();
          pacote.items.add(arquivo);
          entrada.files = pacote.files;
          conferir(entrada);
        }}
      >
        <input
          ref={inputRef}
          id={campo.id}
          name={campo.id}
          type="file"
          accept={aceite}
          required={campo.required}
          aria-describedby={erro ? `${campo.id}-hint ${idErro}` : `${campo.id}-hint`}
          aria-invalid={erro ? true : undefined}
          onChange={(ev) => conferir(ev.currentTarget)}
          className="df-drop-input"
        />
        <span className="df-drop-icone" aria-hidden>
          {nome && !erro ? (
            <FileText className="h-5 w-5" strokeWidth={1.8} />
          ) : (
            <UploadCloud className="h-5 w-5" strokeWidth={1.8} />
          )}
        </span>
        {/* `aria-hidden` no texto da área: ele repete o `hint`, que já é o
            `aria-describedby` do input. Sem isso o leitor de tela leria a mesma
            frase duas vezes ao chegar no campo. */}
        <span className="df-drop-texto" aria-hidden>
          <span className="df-drop-titulo">{nome || campo.hint}</span>
          <span className="df-drop-regra">
            {extensoes} até {limiteMb} MB.
          </span>
        </span>
      </div>

      {/* O `hint` continua existindo como texto do campo (é ele que o input
          descreve), agora visualmente contido: a frase inteira está na área. */}
      <p id={`${campo.id}-hint`} className="sr-only">
        {campo.hint} {extensoes} até {limiteMb} MB.
      </p>
      {erro && (
        <p id={idErro} role="alert" className="mt-2 text-xs font-semibold text-[#ffb4b4]">
          <AlertCircle className="mr-1 inline h-3.5 w-3.5 align-[-2px]" strokeWidth={2} aria-hidden />
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
  placeholder,
  required,
  standalone,
}: {
  id: string;
  label: string;
  type: string;
  autoComplete?: string;
  placeholder?: string;
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
        placeholder={placeholder}
        required={required}
        className={controlClass}
      />
    </div>
  );
}
