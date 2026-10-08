'use client';

import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
/* Era `import { hasSeenMotionPrompt } from '@/lib/motionPreference';`, usado só
   pelo portão de sequência mais abaixo neste arquivo. Saiu junto com ele: o
   banner de movimento não abre mais na primeira visita (ver `layout.tsx`), então
   não há mais dois banners disputando a faixa de baixo da tela. */
import {
  aplicarConsentimento,
  CONSENTIMENTO_MINIMO,
  CONSENTIMENTO_PADRAO,
  CONSENTIMENTO_TOTAL,
  cookieConsentCopy as copy,
  gravarConsentimento,
  lerConsentimento,
  type CookieCategoryId,
  type CookieConsentState,
} from '@/lib/cookieConsent';

/**
 * SIS-226 — Consentimento de cookies: lançador flutuante + painel.
 *
 * Duas peças num componente só, porque são um mecanismo só: o lançador é o
 * caminho de VOLTA ao painel, e uma escolha de privacidade sem caminho de volta é
 * decisão única e irreversível. É o mesmo princípio do
 * `MotionPreferenceTrigger`, que existe no rodapé pela mesma razão — com uma
 * diferença deliberada: aquele é um link de rodapé e este é `fixed`, porque
 * consentimento tem de ser alcançável de qualquer ponto da página, sem rolar até
 * o fim.
 *
 * ── Import estático, não `dynamic` ───────────────────────────────────────────
 * Pelo mesmo motivo do `MotionPreferenceIntro`: este componente é montado no
 * layout raiz e abre sozinho na primeira visita. Adiar por uma requisição
 * significaria a página inteira aparecendo antes de existir o pedido de
 * consentimento.
 *
 * ── SIS-226 — DUAS SUPERFÍCIES, DOIS ESTADOS ─────────────────────────────────
 * A 1ª volta tinha UM estado (`aberto`) e um só destino: na primeira visita o
 * painel completo abria sozinho. A 2ª separou faixa e painel. A 3ª troca a faixa
 * para fundo claro e tira do lançador o menu de hover:
 *
 *   `mostrarBanner`  card branco da primeira visita. Três botões: Personalizar ·
 *                    Rejeitar tudo · Aceitar tudo. Só aparece quando NÃO há
 *                    escolha gravada, e sai na primeira escolha.
 *   `mostrarPainel`  o painel navy. Abre por pedido explícito: «Personalizar» na
 *                    faixa, ou — depois de gravado — o clique no lançador.
 *                    Hover e foco de teclado no lançador só revelam a pílula;
 *                    não abrem o painel, e sair com o ponteiro não o fecha.
 *
 * ⚠️ OS DOIS NÃO SE MISTURAM NUM ESTADO SÓ (um `modo: 'banner' | 'painel' |
 * null` seria o atalho tentador) porque eles têm ciclos de vida diferentes: a
 * faixa é irreversível — some na escolha e não volta —, e o painel abre e fecha
 * quantas vezes quiserem, para sempre. Num enum único, «abrir o painel a partir
 * da faixa» viraria uma transição que apaga a faixa, e o caminho de voltar da
 * personalização para a faixa (que NÃO existe: personalizar já é a decisão em
 * andamento) ficaria sintaticamente possível. Dois booleanos deixam visível o
 * intervalo em que o painel está aberto e ainda não há escolha gravada — e é
 * nesse intervalo que o lançador continua fora da árvore.
 */
export default function CookieConsent() {
  const rota = usePathname();
  const idTitulo = useId();

  /* `pronto` é montagem E leitura do storage no mesmo sinal, de propósito: eram
     dois efeitos (um só para `setMontado(true)`, como em
     `MotionPreferenceDialog`) e não havia estado em que um valesse sem o outro —
     sem storage lido, o painel não sabe se abre. Um efeito só também deixa um
     aviso de `react-hooks/set-state-in-effect` em vez de dois. */
  const [pronto, setPronto] = useState(false);
  /* Ver o docblock: dois estados, e não um enum de modo. */
  const [mostrarBanner, setMostrarBanner] = useState(false);
  const [mostrarPainel, setMostrarPainel] = useState(false);
  /* `null` = ainda não lido do storage (primeiro render, inclusive no servidor).
     Distinto de "não há escolha", que é o `decidiu === false` abaixo. */
  const [estado, setEstado] = useState<CookieConsentState>(CONSENTIMENTO_PADRAO);
  const [decidiu, setDecidiu] = useState(false);

  const raizRef = useRef<HTMLDivElement>(null);
  const lancadorRef = useRef<HTMLButtonElement>(null);

  /* SIS-216 — nada de CMP em `/admin`, pela mesma razão que o diálogo de
     movimento também não vai: é ferramenta interna atrás de senha, o painel é
     `fixed` e cairia sobre a prévia e o botão de publicar imagem, e uma escolha
     gravada ali valeria depois para o site público sem que a pergunta tivesse a
     ver com o que estava na tela.
     Calculado fora do efeito porque também decide se o LANÇADOR renderiza. */
  const noAdmin = Boolean(rota?.startsWith('/admin'));

  useEffect(() => {
    if (noAdmin) return;
    setPronto(true);
    const gravado = lerConsentimento();
    if (gravado) {
      setEstado(gravado);
      setDecidiu(true);
      /* ⚠️ APLICAR TAMBÉM NA MONTAGEM — 01/10, com a entrada do Google Analytics.
         `gravarConsentimento` chama `aplicarConsentimento` no momento do clique, e
         isso cobria a visita em que a escolha é feita. A visita SEGUINTE não passa
         por ali: a escolha já está no storage e só era LIDA. Sem esta linha, quem
         aceitou análise ontem voltaria hoje sem ser medido — o consentimento valeria
         uma vez só, o que não é o que quem clicou «Aceitar tudo» espera.
         Vale nos dois sentidos: para quem recusou, aplicar o estado gravado é o que
         mantém a tag silenciada. */
      aplicarConsentimento(gravado);
      return;
    }
    /* ⚠️ HISTÓRICO — a sequência descrita neste parágrafo NÃO VIGORA MAIS; o
       portão que ela justificava está comentado logo abaixo. Fica registrada
       porque é a razão de ele existir, e volta a valer se o prompt de movimento
       voltar a abrir sozinho.
       SEQUÊNCIA COM O BANNER DE MOVIMENTO, e era o que resolvia o item 5 da
       issue sem tocar uma linha daquele componente.
       `.motion-banner` é `fixed; bottom: 1rem` com `width: min(100% - 2rem,
       500px)`: a 390px ele ocupa a faixa inteira de baixo, exatamente onde este
       painel e este lançador vivem. Na primeira visita os dois querem a mesma
       região da tela ao mesmo tempo.
       Então este painel ESPERA a escolha de movimento. `hasSeenMotionPrompt()`
       vira `true` no clique de confirmação daquele banner — e como aquele
       caminho recarrega a página quando a política muda, esta leitura acontece
       de novo numa página nova e a faixa abre na visita seguinte. Quem escolhe
       "Continuar" sem trocar a política não recarrega; a faixa abre na
       navegação seguinte. Em nenhum dos dois os dois banners dividem a tela.

       ⚠️ NA 2ª VOLTA O QUE ABRE AQUI É A FAIXA, NÃO O PAINEL. A linha era
       `setAberto(true)` — o painel completo de cara — e é exatamente o que o
       pedido derrubou. A sequência com o banner de movimento continua idêntica:
       o que ela protege é a FAIXA DE BAIXO da tela, e a faixa de cookies mora
       nela tanto quanto o painel morava. */
    /* ⚠️ O PORTÃO ACIMA CADUCOU, e era `if (!hasSeenMotionPrompt()) return;`.
       Ele existia só para desempatar a faixa de baixo da tela a 390px, onde o
       `.motion-banner` e esta faixa se sobrepunham na primeira visita. Com o
       prompt de movimento fora do ar (comentado em `layout.tsx`), o portão
       passaria a ser uma espera por um clique que nunca acontece: em visitante
       novo `hasSeenMotionPrompt()` nunca viraria `true` e a faixa de cookies
       NUNCA abriria — ou seja, deixar o portão de pé derrubaria o consentimento
       junto. Se o prompt de movimento voltar a abrir sozinho, esta linha volta
       com ele; o texto acima explica por quê. */
    setMostrarBanner(true);
  }, [noAdmin]);

  const fechar = useCallback(() => {
    setMostrarPainel(false);
    /* Devolve o foco ao lançador: sem isso o Tab seguinte reinicia do topo do
       documento. Mesmo cuidado que o `MotionPreferenceDialog` tem com o gatilho
       que o abriu. */
    requestAnimationFrame(() => lancadorRef.current?.focus({ preventScroll: true }));
  }, []);

  /* Esc fecha — mas SÓ depois de haver escolha. Antes dela, Esc seria uma saída
     que não grava nada e deixa o visitante sem consentimento registrado e sem o
     pedido na tela; os três botões são as saídas, e todos gravam. Depois da
     primeira escolha o painel é uma tela de ajuste comum e fecha como qualquer
     outra. */
  useEffect(() => {
    if (!mostrarPainel || !decidiu) return;
    const aoTeclar = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') fechar();
    };
    window.addEventListener('keydown', aoTeclar);
    return () => window.removeEventListener('keydown', aoTeclar);
  }, [mostrarPainel, decidiu, fechar]);

  /* Primeiro foco dentro do painel. No título e não no primeiro botão: os botões
     são «Rejeitar tudo» / «Aceitar tudo», e pôr o foco em um deles convida a
     decidir com um Enter antes de ler o que está sendo consentido.
     Toda abertura é um pedido (Personalizar, ou o clique no lançador). Hover e
     foco no disco não passam por aqui. */
  useEffect(() => {
    if (!mostrarPainel) return;
    const alvo = raizRef.current?.querySelector<HTMLElement>('.cookie-painel-titulo');
    alvo?.focus({ preventScroll: true });
  }, [mostrarPainel]);

  const alternar = (id: CookieCategoryId) => {
    /* `necessary` não chega aqui (renderiza rótulo, não interruptor), mas a
       guarda fica: é a mesma normalização de `lerConsentimento`/`gravar`, e
       assim nenhum caminho de código consegue desligá-lo. */
    if (id === 'necessary') return;
    setEstado((atual) => ({ ...atual, [id]: !atual[id] }));
  };

  /* A ÚNICA SAÍDA QUE GRAVA, e as duas superfícies passam por aqui: os três
     botões do painel e os dois de decisão da faixa. É o que o item 4 da issue
     pede ao dizer que faixa e painel gravam pelo MESMO `gravarConsentimento` —
     duplicar a gravação na faixa abriria a porta para as duas normalizarem
     diferente (o `necessary: true` é forçado lá dentro) e para uma delas esquecer
     a versão do registro. */
  const concluir = (proximo: CookieConsentState) => {
    gravarConsentimento(proximo);
    setEstado(proximo);
    setDecidiu(true);
    setMostrarBanner(false);
    setMostrarPainel(false);
    requestAnimationFrame(() => lancadorRef.current?.focus({ preventScroll: true }));
  };

  /* «Personalizar»: troca a faixa pelo painel. A faixa sai AGORA, antes de
     qualquer escolha, e é o único lugar em que ela sai sem gravar — porque quem
     clicou aqui está no meio de decidir, e devolver a faixa depois seria pedir a
     mesma coisa duas vezes. Daqui só se sai pelos três botões do painel: Esc
     continua barrado enquanto `decidiu` for `false`. */
  const personalizar = () => {
    setMostrarBanner(false);
    setMostrarPainel(true);
  };

  /* Clique/toque no lançador, e Enter/Espaço, que o botão já entrega como click.
     Hover e foco não passam por aqui: a pílula é CSS (`:hover` / `:focus-visible`)
     e não abre o painel. Sair com o ponteiro também não fecha — isso era o par
     do menu de hover, e um painel aberto por clique tem de permanecer. */
  const aoClicarLancador = () => {
    if (mostrarPainel) {
      /* ⚠️ ANTES DE DECIDIR, NÃO FECHA. A mesma guarda do Esc. O lançador nem
         monta enquanto `decidiu` é falso — «Personalizar» abre o painel e a
         saída continua sendo os três botões, que gravam. A guarda fica para
         esse clique não voltar a ser uma saída sem gravação. */
      if (!decidiu) return;
      fechar();
      return;
    }
    setMostrarPainel(true);
  };

  /* Não renderiza no servidor: o painel depende de `localStorage` para saber se
     abre, e `lerConsentimento` só existe no cliente. Devolver a mesma árvore nos
     dois lados e depois mudá-la seria divergência de hidratação — o mesmo motivo
     pelo qual `MotionPreferenceDialog` também espera `montado`. */
  if (!pronto || noAdmin) return null;

  return createPortal(
    <>
      {/* ── O ENVELOPE DO LANÇADOR + PAINEL ───────────────────────────────────
          Fixed no canto, coluna invertida: na tela o painel fica acima do disco
          e na ordem de Tab o botão vem primeiro. O lançador só monta com
          `decidiu` — durante a faixa e durante «Personalizar» (painel aberto,
          escolha ainda não gravada) ele não está na árvore, então também não
          entra no Tab. Hover não abre nem fecha o painel. */}
      {decidiu || mostrarPainel ? (
      <div ref={raizRef} className="cookie-raiz">
      {/* ── Lançador ──────────────────────────────────────────────────────────
          Desenho medido na captura de referência da issue (`docs/capturas/`):
          disco azul de 45px, pílula com o mesmo centro vertical do disco, e um
          anel fino deslocado atrás, para cima e para a direita. A pílula fica
          fora do fluxo até `:hover` / `:focus-visible` (ver o CSS): em repouso
          o alvo é o disco. O texto dela continua no botão o tempo todo, e é o
          nome acessível.
          O `aria-expanded` é o que diz ao leitor de tela que este botão comanda
          o painel. */}
      {decidiu ? (
      <button
        ref={lancadorRef}
        type="button"
        className="cookie-lancador"
        aria-expanded={mostrarPainel}
        aria-controls={`${idTitulo}-painel`}
        onClick={aoClicarLancador}
      >
        <span className="cookie-lancador-disco" aria-hidden>
          {/* SVG à mão em vez de dois ícones do `lucide` empilhados: a arte da
              captura é UM sinal (biscoito com o sinal de conferido dentro), e
              sobrepor dois ícones prontos daria dois desenhos disputando o
              mesmo círculo. `stroke` e não `fill` no biscoito, para a espessura
              acompanhar o tamanho do disco. */}
          <svg viewBox="0 0 24 24" className="cookie-lancador-icone" focusable="false">
            <path
              d="M12 2.6a9.4 9.4 0 1 0 9.4 9.4 3.4 3.4 0 0 1-4.6-3.2 3.4 3.4 0 0 1-3.5-3.4 3.4 3.4 0 0 1-1.3-2.8Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinejoin="round"
            />
            <circle cx="8.4" cy="9.2" r="1.05" fill="currentColor" />
            <circle cx="15.4" cy="15.6" r="1.05" fill="currentColor" />
            <path
              d="m7.9 13.4 2.5 2.6 5-5.4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className="cookie-lancador-pilula">{copy.launcher}</span>
      </button>
      ) : null}

      {/* ── Painel ────────────────────────────────────────────────────────────
          `role="dialog"` sem `aria-modal`: não há véu, a página segue rolável e
          clicável por trás, como o banner de movimento. Marcar `aria-modal`
          mentiria para o leitor de tela sobre o que está alcançável. */}
      {mostrarPainel ? (
        <div
          className="cookie-painel"
          id={`${idTitulo}-painel`}
          role="dialog"
          aria-labelledby={idTitulo}
        >
          <div className="cookie-painel-corpo">
            {/* `tabIndex={-1}` para receber o primeiro foco (ver o efeito
                acima). Não entra na ordem de Tab — é alvo de foco programático,
                não controle. */}
            <h2 id={idTitulo} className="cookie-painel-titulo" tabIndex={-1}>
              {copy.title}
            </h2>

            {copy.paragrafos.map((paragrafo) => (
              <p key={paragrafo.slice(0, 32)} className="cookie-painel-texto">
                {paragrafo}
              </p>
            ))}

            <ul className="cookie-categorias">
              {copy.categorias.map((categoria) => {
                const ehNecessaria = categoria.id === 'necessary';
                const ligada = ehNecessaria ? true : estado[categoria.id];
                return (
                  <li key={categoria.id} className="cookie-categoria">
                    <div className="cookie-categoria-topo">
                      <span className="cookie-categoria-nome">{categoria.label}</span>
                      {ehNecessaria ? (
                        <span className="cookie-categoria-fixa">{categoria.sempreAtivo}</span>
                      ) : (
                        /* `role="switch"` e não `checkbox`: é um liga/desliga que
                           vale no mesmo instante no estado do painel, não um
                           item de lista a ser submetido depois.
                           O nome acessível vem do `aria-label` e não do nome da
                           categoria ao lado: lido sozinho, «Análise» não diz que
                           o controle liga e desliga algo. */
                        <button
                          type="button"
                          role="switch"
                          aria-checked={ligada}
                          aria-label={`${categoria.label} — ativar ou desativar`}
                          className="cookie-interruptor"
                          onClick={() => alternar(categoria.id)}
                        >
                          <span className="cookie-interruptor-pino" aria-hidden />
                        </button>
                      )}
                    </div>
                    <p className="cookie-categoria-texto">{categoria.texto}</p>
                    {categoria.inventario ? (
                      <p className="cookie-categoria-inventario">{categoria.inventario}</p>
                    ) : null}
                  </li>
                );
              })}
            </ul>

            <div className="cookie-acoes">
              <button
                type="button"
                className="cookie-botao cookie-botao-secundario"
                onClick={() => concluir(CONSENTIMENTO_MINIMO)}
              >
                {copy.acoes.rejeitar}
              </button>
              <button
                type="button"
                className="cookie-botao cookie-botao-secundario"
                onClick={() => concluir(estado)}
              >
                {copy.acoes.salvar}
              </button>
              <button
                type="button"
                className="cookie-botao cookie-botao-primario"
                onClick={() => concluir(CONSENTIMENTO_TOTAL)}
              >
                {copy.acoes.aceitar}
              </button>
            </div>
          </div>
        </div>
      ) : null}
      </div>
      ) : null}

      {/* ── A FAIXA DA PRIMEIRA VISITA ────────────────────────────────────────
          Fora do envelope: é o card da primeira visita, centrado embaixo, e não
          o painel do canto. «Personalizar» esconde esta faixa e abre o painel
          sem gravar; o lançador continua desmontado até Aceitar, Rejeitar ou
          Salvar.

          `role="dialog"` e `aria-labelledby` no título, como o painel: é um
          pedido que espera resposta. Sem `aria-modal`, porque a página segue
          rolável atrás — a faixa é curta e não veda nada. */}
      {mostrarBanner ? (
        <div
          className="cookie-faixa"
          role="dialog"
          aria-labelledby={`${idTitulo}-faixa-titulo`}
        >
          <div className="cookie-faixa-corpo">
            <div className="cookie-faixa-texto">
              {/* `<h2>`: irmão do `<h2>` do painel na hierarquia, e nunca
                  simultâneo a ele. */}
              <h2 id={`${idTitulo}-faixa-titulo`} className="cookie-faixa-titulo">
                {copy.banner.titulo}
              </h2>
              <p className="cookie-faixa-paragrafo">{copy.banner.texto}</p>
            </div>

            {/* A ORDEM É A DA ISSUE: Personalizar · Rejeitar tudo · Aceitar
                tudo. «Personalizar» primeiro e não por último porque é o caminho
                de LER antes de decidir, e ele tem de vir antes das duas decisões
                — é a mesma razão pela qual o primeiro foco do painel é o título
                e não um botão. Os três com a mesma área de toque: recusar não
                pode ser mais difícil que aceitar (ver a nota do
                `.cookie-botao-primario` no CSS). */}
            <div className="cookie-faixa-acoes">
              <button
                type="button"
                className="cookie-botao cookie-botao-secundario"
                onClick={personalizar}
              >
                {copy.banner.personalizar}
              </button>
              <button
                type="button"
                className="cookie-botao cookie-botao-secundario"
                onClick={() => concluir(CONSENTIMENTO_MINIMO)}
              >
                {copy.banner.rejeitar}
              </button>
              <button
                type="button"
                className="cookie-botao cookie-botao-primario"
                onClick={() => concluir(CONSENTIMENTO_TOTAL)}
              >
                {copy.banner.aceitar}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>,
    document.body,
  );
}
