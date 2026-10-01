'use client';

import { usePathname } from 'next/navigation';

/**
 * SIS-278 — Barra global de progresso da rolagem, colada no topo da janela.
 *
 * ── POR QUE ESTE ARQUIVO VOLTOU A EXISTIR ──
 * A 1ª volta da SIS-278 entregou este nó e o CSS. O CSS continuou em
 * `globals.css` (o bloco `.barra-progresso`, com o comentário apontando para
 * ESTE caminho), mas o componente saiu do disco e a montagem saiu do
 * `RootLayout` — então a barra desapareceu do site sem deixar erro nenhum:
 * regra de estilo sem nó que a use não quebra build, não quebra lint e não
 * aparece em teste. É o modo mais silencioso de uma peça morrer, e é por isso
 * que a nota fica aqui.
 *
 * ── ZERO JAVASCRIPT POR QUADRO ──
 * Este componente não escuta rolagem, não mede nada e não tem estado. Ele só
 * desenha três caixas; o movimento todo vem de `--scroll-p`, que o
 * `SmoothScroll` publica no `<html>` uma vez por quadro — a MESMA variável que
 * o `.spine-viva` e o `ScrollSpine` consomem. Abrir aqui um segundo observador
 * de rolagem seria um segundo relógio, com o direito de discordar do primeiro.
 *
 * É `'use client'` por UM motivo só, e não pelo desenho: `usePathname`, para
 * ficar fora de `/admin`. Sem essa linha o arquivo inteiro poderia ser de
 * servidor — e é essa pobreza que faz a barra funcionar sem JavaScript: o HTML
 * já vem com as três caixas, `var(--scroll-p, 0)` resolve em 0, e a barra
 * aparece vazia em vez de não aparecer.
 *
 * ── `aria-hidden`, E NÃO `role="progressbar"` ──
 * A tentação é anunciar o progresso. Mas `progressbar` exige `aria-valuenow`
 * atualizado, e atualizar um atributo ARIA 60 vezes por segundo entope o leitor
 * de tela com fala que ninguém pediu — além de exigir exatamente o estado por
 * quadro que o parágrafo acima evita. Quem usa leitor de tela sabe onde está
 * pela estrutura do documento; esta barra é informação VISUAL de quanto falta.
 * Então ela se declara decorativa, e fica honesta.
 */
export default function ScrollProgressBar() {
  const rota = usePathname();

  /* Fora de `/admin`, pelo mesmo critério (e pela mesma linha) do
     `CookieConsent` e do diálogo de movimento: o painel administrativo não é o
     site público, e indicador de leitura de página não faz sentido lá. */
  if (rota?.startsWith('/admin')) return null;

  return (
    <div className="barra-progresso" aria-hidden>
      {/* A trilha é o trecho AINDA NÃO percorrido (item 5 do alvo). Ela é o
          elemento de baixo e fica inteira: o preenchimento cresce POR CIMA
          dela, então não há conta de "quanto resta" em lugar nenhum. */}
      <span className="barra-progresso-trilha" />
      <span className="barra-progresso-preenchida" />
      {/* A ponta circular vem num nó próprio, e não como `::after` do
          preenchimento: filho de um elemento com `scaleX(0.07)` seria um
          círculo esmagado em fatia vertical. Ver o CSS — ela se move por
          `translateX`, que não distorce. */}
      <span className="barra-progresso-ponta" />
    </div>
  );
}
