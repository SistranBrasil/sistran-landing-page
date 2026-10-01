/**
 * O aviso de saída do palco — pedido de 30/09: «quando chegar no ultimo card coloque
 * que indica um continue dai coloque um efeito de transição para esse continue».
 *
 * O problema real que ele resolve: o palco é sticky por ~24 telas de rolagem, e no
 * último card nada avisa que o trecho acabou. Quem está rolando não sabe se a página
 * travou ou se terminou, e é o momento exato em que as pessoas desistem. Este aviso é
 * a única coisa que muda entre "acabou" e "quebrou".
 *
 * ── UMA PALAVRA SÓ, DE PROPÓSITO ──────────────────────────────────────────────
 * «Continue» e mais nada. Não é economia de espaço: é o texto que a área escreveu, e
 * frase inventada aqui entraria no `copy-lock` como conteúdo novo do site sem dono —
 * que é justamente o que a Regra Zero existe para impedir. A seta abaixo diz a
 * direção; o texto diz que há mais.
 *
 * ── O EFEITO DE TRANSIÇÃO É CSS, E NÃO TEM TEMPORIZADOR ───────────────────────
 * `data-visivel` entra quando o índice ativo alcança a última parada, e o resto
 * (entrada, brilho, seta descendo) é `transition` e `animation` na folha. Nenhum
 * `setTimeout`, nenhum estado a mais: o gatilho é o MESMO `ativo` que já move os
 * cards, então o aviso não pode aparecer fora de sincronia com o card que o motiva.
 *
 * No modo estático não existe — lá a fila é uma coluna inteira visível e o fecho vem
 * logo abaixo, então não há nada a avisar. Quem esconde é o CSS, no bloco base.
 */
export function TimelineContinue({ visivel }: { visivel: boolean }) {
  return (
    <div className="trajetoria-continue" data-visivel={visivel ? 'sim' : 'nao'}>
      {/* `aria-hidden` só na seta: o texto é conteúdo — é ele que informa que há mais
          página adiante, e essa informação não está escrita em nenhum outro lugar do
          palco. A seta é a mesma frase em desenho. */}
      <span className="trajetoria-continue-texto">Continue</span>
      <span className="trajetoria-continue-seta" aria-hidden />
    </div>
  );
}
