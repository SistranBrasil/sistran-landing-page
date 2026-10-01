/**
 * Google Analytics 4 — injeção do `gtag.js`, atrás do consentimento.
 *
 * ⚠️ ESTE MÓDULO NÃO DECIDE NADA. Ele só sabe carregar e silenciar; quem decide é
 * `aplicarConsentimento` em `cookieConsent.ts`, lendo a categoria `analytics`. A
 * separação é a mesma que aquele arquivo já documenta: o ponto de leitura do
 * consentimento não mora dentro de uma peça de UI, e o carregador não mora dentro
 * da regra legal.
 *
 * ⚠️ POR QUE NÃO `next/script`, QUE É O CAMINHO IDIOMÁTICO EM NEXT. `<Script>`
 * precisa ser RENDERIZADO para existir, e o que libera o GA aqui é um clique na
 * faixa de cookies ou uma leitura de `localStorage` — nenhum dos dois é render. Pôr
 * `<Script>` num componente que lê o consentimento funcionaria, mas devolveria a
 * decisão ao layout, que é justamente o que o gancho em `cookieConsent.ts` manda não
 * fazer («ele entra POR AQUI e não no `layout`»).
 *
 * E o ganho de `next/script` se perde de qualquer forma: a estratégia padrão
 * (`afterInteractive`) serve para adiar o script até depois da hidratação, e aqui ele
 * já entra depois — depois da hidratação, depois do `localStorage` lido e, na
 * primeira visita, depois de um clique. Não há nada a adiar.
 *
 * ⚠️ NÃO HÁ `page_view` MANUAL AQUI, e isso é deliberado. Em navegação de rota do
 * Next não há recarga, então o `config` inicial não dispararia uma segunda visualização
 * — mas a **Medição otimizada** do GA4 (ligada por padrão no stream) registra
 * `page_view` em mudança de histórico do navegador, que é o que o `router` do Next
 * produz. Mandar um `page_view` nosso em cima disso CONTARIA CADA PÁGINA DUAS VEZES, e
 * número inflado em material que vai para cliente é pior que número ausente. Se um dia
 * a Medição otimizada for desligada no painel, é aqui que o `page_view` manual entra.
 */

/**
 * ID de medição do stream. ⚠️ `NEXT_PUBLIC_` porque o valor roda no navegador — e
 * isso significa que ele fica VISÍVEL no HTML. É assim em qualquer site com GA e não
 * é segredo; o que não pode usar esse prefixo é chave de API.
 *
 * Sem a variável, `ehAtivo` abaixo é `false` e o módulo inteiro vira inerte: o site
 * funciona, só não mede. É o default certo para quem clona o repositório sem as
 * variáveis — melhor que injetar script com `id=undefined`, que o GA recusa em
 * silêncio e que só apareceria como "nenhum dado recebido" semanas depois.
 */
const ID = process.env.NEXT_PUBLIC_GA_ID;

/** Há ID configurado? Fora do navegador também é `false` — nada a injetar no SSR. */
export function ehAtivo(): boolean {
  return Boolean(ID) && typeof window !== 'undefined';
}

/**
 * A chave de desligamento do próprio GA: `window['ga-disable-G-XXXX'] = true` faz o
 * `gtag.js` parar de enviar qualquer coisa. É mecanismo oficial, e é o que torna a
 * RETIRADA do consentimento honesta sem recarregar a página.
 *
 * ⚠️ O gancho em `cookieConsent.ts` prevê `window.location.reload()` para esse caso,
 * e a razão dele é real — «script já injetado não desaparece do documento». Esta chave
 * é melhor que a recarga porque não joga fora a posição de rolagem e o estado das
 * animações de quem só foi ajustar uma preferência, e porque o efeito é o mesmo: a
 * partir dela nada mais sai do navegador. O que a chave NÃO desfaz é o que já foi
 * enviado antes da retirada — isso nenhuma das duas desfaz.
 */
function chaveDeDesligamento(): string {
  return `ga-disable-${ID}`;
}

let injetado = false;

/**
 * Injeta o `gtag.js` e o configura. Idempotente: chamar duas vezes não duplica a tag
 * — o próprio GA avisa que mais de uma tag na mesma página é erro, e
 * `aplicarConsentimento` roda tanto na montagem (consentimento já gravado) quanto a
 * cada gravação (o visitante reabriu o painel e salvou de novo).
 */
export function carregarGoogleAnalytics(): void {
  if (!ehAtivo()) return;

  /* Religar depois de uma retirada: a chave fica no `window` e, sem apagá-la, o
     script já injetado continuaria mudo mesmo com o consentimento de volta. */
  (window as unknown as Record<string, unknown>)[chaveDeDesligamento()] = false;

  if (injetado) return;
  injetado = true;

  /* ⚠️ O BOOTSTRAP VAI COMO SCRIPT INLINE, TEXTO IGUAL AO DO PAINEL DO GA, e não
     reescrito em TypeScript. O `gtag.js` lê da fila o objeto `arguments` de cada
     chamada; uma versão em TS teria de empilhar `arguments` dentro de uma função com
     assinatura tipada, o que exige `prefer-rest-params` desligado e um `as unknown`
     para o compilador aceitar — três concessões para reproduzir, com risco de erro,
     cinco linhas que o Google entrega prontas e versiona.
     `dataLayer` e `gtag` são criados ANTES do script externo: as chamadas se acumulam
     na fila e o `gtag.js` as consome ao carregar. Invertida, a ordem perde o `config`. */
  const bootstrap = document.createElement('script');
  bootstrap.id = 'ga-bootstrap';
  bootstrap.text = [
    'window.dataLayer = window.dataLayer || [];',
    'function gtag(){dataLayer.push(arguments);}',
    'gtag("js", new Date());',
    `gtag("config", ${JSON.stringify(ID)});`,
  ].join('\n');
  document.head.appendChild(bootstrap);

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ID!)}`;
  document.head.appendChild(script);
}

/**
 * Silencia o GA. Não remove o script (não dá, e recarregar por isso custaria o
 * estado da página) — levanta a chave de desligamento, e a partir dela nada mais é
 * enviado. Chamar sem o GA nunca ter carregado é inofensivo e de propósito: assim
 * `aplicarConsentimento` pode chamar sempre, sem saber o histórico.
 */
export function silenciarGoogleAnalytics(): void {
  if (!ehAtivo()) return;
  (window as unknown as Record<string, unknown>)[chaveDeDesligamento()] = true;
}
