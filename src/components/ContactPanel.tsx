'use client';

import { useActionState } from 'react';
import {
  Check,
  ArrowRight,
  AlertCircle,
  MapPin,
  Phone,
  User,
  Mail,
  MessageSquare,
} from 'lucide-react';
import { enviarContato } from '@/app/actions/contato';
import { ESTADO_INICIAL } from '@/app/actions/contato-estado';
import { CONTACT_PHONE, HQ_ADDRESS } from '@/data/contact';

/**
 * Painel de contato: a foto da sede recortada em arco, o telefone e o
 * formulario. É só o conteudo — quem o mostra decide a moldura.
 *
 * Existem dois lugares que o mostram, e por isso ele saiu de dentro do modal:
 * o `<dialog>` de "Fale com a gente" (`ContactModal`), aberto pelo header, e a
 * secao de contato da home (`Contact`), onde o mesmo painel surge com a
 * rolagem. Antes essa marcacao vivia dentro do modal, entao a secao só podia
 * repetir o codigo ou abrir o modal — e abrir modal sozinho, sem clique,
 * prenderia o foco e travaria a rolagem de quem estava apenas passando.
 *
 * `onClose` é opcional exatamente por isso: inline nao existe o que fechar.
 */

/* Foto da sede em Sao Paulo. Preenche o painel esquerdo inteiro; a divisao com o
   formulario é uma curva feita em `clip-path`. Ver `.contact-dialog-foto`. */
const FOTO_SEDE = '/images/predio.png';

/* Mensagem de erro por campo. Ficam aqui e nao na action porque sao texto de
   interface, e a action devolve so quais campos falharam (`invalidos`) — o
   contrato com o backend nao muda. */
const ERROS: Record<string, string> = {
  nome: 'Informe o seu nome completo.',
  email: 'Informe um e-mail válido, como nome@empresa.com.br.',
  telefone: 'Informe um telefone com DDD.',
  mensagem: 'Escreva a sua mensagem.',
};

/* `tel:` nao aceita espaco nem parentese: mesmo numero de `CONTACT_PHONE`, só
   reduzido aos digitos. Deriva do dado, para os dois nunca divergirem. */
const TELEFONE_LINK = `tel:${CONTACT_PHONE.replace(/[^\d+]/g, '')}`;

export type PainelContatoProps = {
  /** Existe quando o painel esta num modal; inline fica de fora. */
  onClose?: () => void;
  eyebrow: string;
  title: string;
  description: string;
  /** Id do titulo, referido pelo `aria-labelledby` de quem mostra o painel. */
  tituloId: string;
};

export default function PainelContato({
  onClose,
  eyebrow,
  title,
  description,
  tituloId,
}: PainelContatoProps) {
  return (
    /* Duas colunas em tela larga, uma em tela estreita: a foto vira uma faixa
       no topo em vez de desaparecer. */
    <div className="contact-dialog-grid">
      <figure className="contact-dialog-foto" style={VARIAVEIS_RECORTE}>
        {/* O recorte curvo é uma mascara SVG aplicada a ESTA caixa, entao a
            fotografia e todos os overlays de dentro (gradiente e linhas)
            terminam na curva. O contorno ciano e o cartao de endereco ficam
            fora dela: se estivessem dentro, a mascara comeria metade do fio. */}
        <div className="contact-dialog-foto-recorte">
          {/* Tag simples: o projeto roda com `images: { unoptimized: true }`,
              entao o componente do framework nao geraria variante alguma. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={FOTO_SEDE}
            alt="Edifício da sede da Sistran em São Paulo, visto da base"
            width={933}
            height={1244}
            loading="lazy"
            decoding="async"
          />
          <RedeDecorativa />
        </div>
        <Contorno />
        <figcaption className="contact-dialog-endereco">
          <MapPin className="h-4 w-4" strokeWidth={1.8} aria-hidden />
          <span>
            <span className="contact-dialog-endereco-titulo">SEDE · SÃO PAULO</span>
            <span className="contact-dialog-endereco-texto">{HQ_ADDRESS}</span>
          </span>
        </figcaption>
      </figure>

      <div className="contact-dialog-corpo">
        <CorpoContato
          onClose={onClose}
          eyebrow={eyebrow}
          title={title}
          description={description}
          tituloId={tituloId}
        />
      </div>
    </div>
  );
}

/* --- o recorte curvo do painel da foto -----------------------------------
   A silhueta é um arco vertical: estreita no topo, mais larga por volta do meio
   e recuando de novo na base. Cada lado tem duas descricoes da MESMA curva —
   a silhueta fechada, que vira mascara, e só o traco curvo, que vira o fio
   ciano. Ficam juntas aqui para nunca sairem de sincronia.

   `preserveAspectRatio="none"` em ambas: a curva tem de esticar com o modal, e a
   mascara e o traco esticam exatamente igual porque compartilham o `viewBox`. */
const RECORTE_LATERAL = {
  viewBox: '0 0 420 840',
  silhueta: 'M0 0 H326 C 384 118, 413 268, 415 420 C 413 572, 384 722, 326 840 H0 Z',
  traco: 'M326 0 C 384 118, 413 268, 415 420 C 413 572, 384 722, 326 840',
};

/* Em tela estreita a foto é uma faixa no topo: o arco deixa de ser lateral e
   passa para a base, como uma barriga para baixo. */
const RECORTE_BASE = {
  viewBox: '0 0 840 420',
  silhueta: 'M0 0 H840 V286 C 640 366, 470 392, 420 392 C 370 392, 200 366, 0 286 Z',
  traco: 'M0 286 C 200 366, 370 392, 420 392 C 470 392, 640 366, 840 286',
};

/* A mascara vai em `mask-image`, que só aceita uma imagem — daí o SVG embutido
   em data URI. É gerado a partir da mesma constante do traco, e nao escrito de
   novo em CSS. */
const mascara = ({ viewBox, silhueta }: { viewBox: string; silhueta: string }) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" preserveAspectRatio="none"><path d="${silhueta}" fill="#000"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
};

/* As duas mascaras entram como variaveis CSS; qual delas vale é decisao das
   media queries em `globals.css`, que é onde o resto da responsividade mora. */
const VARIAVEIS_RECORTE = {
  '--cd-mask-lateral': mascara(RECORTE_LATERAL),
  '--cd-mask-base': mascara(RECORTE_BASE),
} as React.CSSProperties;

/* O fio luminoso do contorno. Fica FORA da caixa mascarada, senao a propria
   mascara cortaria metade da espessura. `non-scaling-stroke` mantem 1.5px mesmo
   com o SVG esticado em proporcao livre — sem isso o traco engrossaria na
   horizontal. */
function Contorno() {
  return (
    <>
      <svg
        className="contact-dialog-contorno contact-dialog-contorno-lateral"
        viewBox={RECORTE_LATERAL.viewBox}
        preserveAspectRatio="none"
        aria-hidden
        focusable="false"
      >
        <path d={RECORTE_LATERAL.traco} vectorEffect="non-scaling-stroke" />
      </svg>
      <svg
        className="contact-dialog-contorno contact-dialog-contorno-base"
        viewBox={RECORTE_BASE.viewBox}
        preserveAspectRatio="none"
        aria-hidden
        focusable="false"
      >
        <path d={RECORTE_BASE.traco} vectorEffect="non-scaling-stroke" />
      </svg>
    </>
  );
}

/* ── Rede arquitetonica sobre a foto ────────────────────────────────────────
   Tres trajetorias, nao um emaranhado: uma ascendente que sobe da lateral
   esquerda para o topo do edificio, uma diagonal suave pela fachada central e
   uma inferior que acompanha a base e termina antes do cartao de endereco.
   Existe um unico cruzamento — ascendente x diagonal, por volta de (45, 76),
   no meio escuro da fachada.

   `preserveAspectRatio` NAO é `none` aqui (ao contrario do recorte): com o
   SVG esticado os pontos luminosos virariam ovais. Com `slice` a escala é
   uniforme, os circulos ficam circulares e a sobra é cortada — as pontas das
   curvas ja desaparecem no gradiente, entao o corte nao aparece. */
const REDE = {
  viewBox: '0 0 120 160',
  linhas: [
    {
      classe: 'cd-linha cd-linha-1',
      d: 'M-8 132 C 22 120, 44 96, 58 62 S 76 24, 94 2',
      grad: 'cd-rede-fio-1',
    },
    {
      classe: 'cd-linha cd-linha-2',
      d: 'M-6 54 C 18 62, 38 72, 60 80 S 88 88, 108 88',
      grad: 'cd-rede-fio-2',
    },
    {
      classe: 'cd-linha cd-linha-3',
      d: 'M126 118 C 108 130, 88 136, 70 133 S 52 126, 44 120',
      grad: 'cd-rede-fio-3',
    },
  ],
};

/* Halo como circulo proprio, e nao `drop-shadow`: dentro do SVG o desfoque do
   filtro escala junto com o viewBox, entao o "halo de 8px" mudaria de tamanho
   conforme a altura do painel. Assim ele fica previsivel. */
function Ponto({
  classe,
  r,
  em,
  trilho,
}: {
  classe: string;
  r: number;
  /** Ponto parado: posicao fixa na curva. */
  em?: [number, number];
  /** Ponto que pulsa: percorre esta curva via `offset-path`. */
  trilho?: string;
}) {
  return (
    <g
      className={classe}
      transform={em ? `translate(${em[0]} ${em[1]})` : undefined}
      /* `offsetPath` nao existe como prop tipada de SVG: vai no style, que é
         onde a animacao de `offset-distance` do CSS o le. */
      style={trilho ? ({ offsetPath: `path("${trilho}")` } as React.CSSProperties) : undefined}
    >
      <circle className="cd-ponto-halo" r={r * 3.4} />
      <circle className="cd-ponto-nucleo" r={r} />
    </g>
  );
}

function RedeDecorativa() {
  return (
    <svg
      className="contact-dialog-rede"
      viewBox={REDE.viewBox}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      focusable="false"
    >
      <defs>
        {/* Cada fio tem seu gradiente de opacidade: nenhuma trajetoria fica
            visivel de ponta a ponta, todas nascem e morrem no vazio. */}
        <linearGradient id="cd-rede-fio-1" gradientUnits="userSpaceOnUse" x1="-8" y1="132" x2="94" y2="2">
          <stop offset="0" stopColor="currentColor" stopOpacity="0" />
          <stop offset="0.22" stopColor="currentColor" stopOpacity="1" />
          <stop offset="0.7" stopColor="currentColor" stopOpacity="0.9" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="cd-rede-fio-2" gradientUnits="userSpaceOnUse" x1="-6" y1="54" x2="108" y2="88">
          <stop offset="0" stopColor="currentColor" stopOpacity="0" />
          <stop offset="0.3" stopColor="currentColor" stopOpacity="1" />
          <stop offset="0.62" stopColor="currentColor" stopOpacity="0.8" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="cd-rede-fio-3" gradientUnits="userSpaceOnUse" x1="126" y1="118" x2="44" y2="120">
          <stop offset="0" stopColor="currentColor" stopOpacity="0" />
          <stop offset="0.34" stopColor="currentColor" stopOpacity="1" />
          <stop offset="0.78" stopColor="currentColor" stopOpacity="0.45" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>

        {/* Mascara de protecao. Pinta branco (rede visivel) e depois escurece
            de novo onde a rede nao pode competir: base do painel, area do
            cartao de endereco, reflexo do sol e as bordas. */}
        <linearGradient id="cd-rede-base" gradientUnits="userSpaceOnUse" x1="0" y1="112" x2="0" y2="160">
          <stop offset="0" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="1" />
        </linearGradient>
        <radialGradient id="cd-rede-cartao" gradientUnits="userSpaceOnUse" cx="34" cy="146" r="56">
          <stop offset="0" stopColor="#000" stopOpacity="0.95" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="cd-rede-sol" gradientUnits="userSpaceOnUse" cx="96" cy="26" r="36">
          <stop offset="0" stopColor="#000" stopOpacity="0.6" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="cd-rede-borda-e" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="16" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="1" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="cd-rede-borda-d" gradientUnits="userSpaceOnUse" x1="104" y1="0" x2="120" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="1" />
        </linearGradient>
        <mask id="cd-rede-mascara" maskUnits="userSpaceOnUse" x="0" y="0" width="120" height="160">
          <rect x="0" y="0" width="120" height="160" fill="#fff" />
          <rect x="0" y="112" width="120" height="48" fill="url(#cd-rede-base)" />
          <rect x="0" y="90" width="120" height="70" fill="url(#cd-rede-cartao)" />
          <rect x="60" y="0" width="60" height="62" fill="url(#cd-rede-sol)" />
          <rect x="0" y="0" width="16" height="160" fill="url(#cd-rede-borda-e)" />
          <rect x="104" y="0" width="16" height="160" fill="url(#cd-rede-borda-d)" />
        </mask>
      </defs>

      <g mask="url(#cd-rede-mascara)">
        {REDE.linhas.map((l) => (
          <path
            key={l.grad}
            className={l.classe}
            d={l.d}
            stroke={`url(#${l.grad})`}
            vectorEffect="non-scaling-stroke"
          />
        ))}
        {/* Cinco pontos, so dois se movendo: o principal na ascendente e um
            intermediario na diagonal. Os outros tres ficam parados. */}
        <Ponto classe="cd-ponto cd-ponto-principal" r={0.46} trilho={REDE.linhas[0].d} />
        <Ponto classe="cd-ponto cd-ponto-medio" r={0.36} trilho={REDE.linhas[1].d} />
        <Ponto classe="cd-ponto cd-ponto-medio" r={0.34} em={[58, 62]} />
        <Ponto classe="cd-ponto cd-ponto-fraco" r={0.3} em={[66, 88]} />
        <Ponto classe="cd-ponto cd-ponto-fraco" r={0.28} em={[70, 133]} />
      </g>
    </svg>
  );
}

/**
 * Miolo do painel. Separado porque o modal o remonta por uma chave de sessao:
 * remontar aqui zera o estado do envio sem tocar no `<dialog>`, que precisa
 * continuar aberto.
 */
function CorpoContato({
  onClose,
  eyebrow,
  title,
  description,
  tituloId,
}: {
  onClose?: () => void;
  eyebrow: string;
  title: string;
  description: string;
  tituloId: string;
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
        {/* Inline nao ha o que fechar: o botao só existe quando o painel esta
            dentro do modal. */}
        {onClose ? (
          <button type="button" onClick={onClose} className="btn-ghost mt-6">
            Fechar
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <>
      <p className="contact-dialog-eyebrow">{eyebrow}</p>
      <h3 id={tituloId} className="contact-dialog-titulo">
        {title}
      </h3>
      <p className="contact-dialog-desc">{description}</p>

      {/* O telefone vem antes do formulario de proposito: quem já quer falar
          agora nao precisa passar pelos campos. */}
      <div className="contact-dialog-fone">
        <span className="contact-dialog-fone-linha">
          <span className="contact-dialog-fone-icone" aria-hidden>
            <Phone className="h-4 w-4" strokeWidth={1.9} />
          </span>
          <span>
            <span className="contact-dialog-fone-rotulo">Nosso telefone é</span>
            <a href={TELEFONE_LINK}>{CONTACT_PHONE}</a>
          </span>
        </span>
        <p className="contact-dialog-fone-nota">
          Ou se preferir, deixe uma mensagem abaixo que te retornaremos em breve.
        </p>
      </div>

      <form className="contact-dialog-form" action={enviar}>
        <Field
          id="nome"
          label="Nome Completo"
          type="text"
          autoComplete="name"
          icone={<User className="h-4 w-4" strokeWidth={1.8} />}
          required
          invalid={invalido('nome')}
          disabled={pendente}
        />
        {/* E-mail e telefone dividem a linha: o formulario deixa de ser uma
            coluna longa de caixas iguais. */}
        <div className="contact-dialog-dupla">
          <Field
            id="email"
            label="E-mail"
            type="email"
            autoComplete="email"
            icone={<Mail className="h-4 w-4" strokeWidth={1.8} />}
            required
            invalid={invalido('email')}
            disabled={pendente}
          />
          <Field
            id="telefone"
            label="Telefone"
            type="tel"
            autoComplete="tel"
            placeholder="(11) 96123-4567"
            icone={<Phone className="h-4 w-4" strokeWidth={1.8} />}
            required
            invalid={invalido('telefone')}
            disabled={pendente}
          />
        </div>
        <div className="contact-dialog-campo">
          <label htmlFor="mensagem">
            Mensagem <span aria-hidden>*</span>
          </label>
          <span className="contact-dialog-caixa">
            <MessageSquare className="h-4 w-4" strokeWidth={1.8} aria-hidden />
            <textarea
              id="mensagem"
              name="mensagem"
              rows={4}
              /* Espaco em branco: da ao CSS o `:placeholder-shown` que distingue
                 campo vazio de campo preenchido, sem escrever texto na caixa. */
              placeholder=" "
              required
              disabled={pendente}
              aria-invalid={invalido('mensagem') || undefined}
              aria-describedby={invalido('mensagem') ? 'erro-mensagem' : undefined}
            />
          </span>
          {invalido('mensagem') ? (
            <p className="contact-dialog-erro" id="erro-mensagem">
              <AlertCircle className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
              {ERROS.mensagem}
            </p>
          ) : null}
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
              : 'text-sm text-ink-faint'
          }
        >
          {pendente ? 'Enviando…' : estado.mensagem}
        </p>

        <button type="submit" className="contact-dialog-enviar" disabled={pendente}>
          {pendente ? 'Enviando…' : 'Enviar'}
          <span className="contact-dialog-enviar-seta" aria-hidden>
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.4} />
          </span>
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
  placeholder,
  icone,
  required,
  invalid,
  disabled,
}: {
  id: string;
  label: string;
  type: string;
  autoComplete?: string;
  placeholder?: string;
  icone: React.ReactNode;
  required?: boolean;
  invalid?: boolean;
  disabled?: boolean;
}) {
  const idErro = `erro-${id}`;
  return (
    <div className="contact-dialog-campo">
      <label htmlFor={id}>
        {label} {required ? <span aria-hidden>*</span> : null}
      </label>
      <span className="contact-dialog-caixa">
        {icone}
        <input
          id={id}
          name={id}
          type={type}
          autoComplete={autoComplete}
          /* Sem placeholder proprio entra um espaco: é o que permite ao CSS
             separar campo vazio de campo preenchido. */
          placeholder={placeholder ?? ' '}
          required={required}
          disabled={disabled}
          aria-invalid={invalid || undefined}
          aria-describedby={invalid ? idErro : undefined}
        />
      </span>
      {invalid ? (
        <p className="contact-dialog-erro" id={idErro}>
          <AlertCircle className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
          {ERROS[id]}
        </p>
      ) : null}
    </div>
  );
}
