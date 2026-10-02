/**
 * SIS-275 — O CALIBRE CANÔNICO DO REVEAL POR SCROLL (pós-SIS-269), num lugar só.
 *
 * Os números nasceram medidos em `/contato` (`docs/medidas/sis269-antes.json` /
 * `-depois.json`) e valem para qualquer rota que use as primitivas da casa
 * (`RevealScope` / `useRevealTrigger` + presets `[data-reveal]`): a medida é
 * sobre a geometria da dobra, não sobre o conteúdo de uma página.
 *
 * `MARGEM_REVEAL: '0px 0px -12% 0px'` — NEGATIVO. Positivo estende a raiz
 * ABAIXO da dobra e é assim que se produz o defeito que a SIS-269 nomeia: o
 * bloco termina a animação fora da tela e, quando a pessoa chega, já está
 * parado. O §4.1 de `docs/scroll.md` chama o negativo de «discreto, dispara
 * depois de entrar».
 *
 * `LIMIAR_REVEAL: 0.15` — e não os 0.2 do padrão do `RevealScope` nem os 0.08
 * da 2ª volta da SIS-263. Com 0.15 os escopos medidos em `/contato` acendiam
 * com o topo entre 72% e 84% da viewport: faixa estreita o bastante para ler
 * como uma cadência só, e toda ela DENTRO da tela.
 *
 * ── 02/10 · SIS-307 · A IGNIÇÃO FOI ANTECIPADA, E O LIMIAR É O MOTIVO
 * Pedido por escrito: «quando vai escrolando as coisas demora e nao aparece,
 * preciso que os efeitos sejam tão rápidos conforme o scroll». Medido com sonda
 * de navegador no `next dev`, viewport 1440×900, antes desta mudança: entre o
 * bloco ENTRAR na tela e ACENDER passavam mediana 54px de rolagem e p90 306px —
 * e o p90 é o que a pessoa sente, porque são justamente os blocos altos.
 *
 * A culpa é do LIMIAR, não da margem. `0.15` cobra 15% da ALTURA DO PRÓPRIO
 * ELEMENTO dentro da raiz: num bloco de 900px são 135px de rolagem a mais que
 * num bloco de 100px, então quanto maior a seção, mais tarde ela acende — o
 * oposto do que o §4.2 do doc quer. `0.04` desacopla a ignição do tamanho
 * (36px num bloco de 900px) sem virar `0`, que acenderia com um fio de pixel na
 * borda e perderia a leitura de «o bloco entrou».
 *
 * A margem continua NEGATIVA — a proibição da SIS-269 segue em pé, positivo é
 * o que faz a animação terminar fora da tela. Só encurtou de `-12%` para `-3%`
 * (de 108px para 27px numa dobra de 900px): com o limiar já desacoplado do
 * tamanho, 12% da dobra era atraso puro, sem o ganho de «discreto» que o §4.1
 * atribui ao negativo — esse ganho sobrevive em 3%.
 *
 * O par é consumido TAMBÉM como padrão do `useRevealTrigger`, que antes repetia
 * `0.2`/`-12%` por conta dele. Um número, um lugar.
 *
 * Rotas que afinam duração/curva (`AFINACAO_REVEAL`) ou limiar de bloco alto
 * (`LIMIAR_REVEAL_BLOCO`, `MARGEM_REVEAL_TRILHO`, …) continuam com o que é
 * específico delas no `reveal-calibre.ts` da pasta — só o par canônico mora
 * aqui, para a primeira correção não deixar metade do site numa cadência e a
 * outra metade noutra.
 */
export const MARGEM_REVEAL = '0px 0px -3% 0px';
export const LIMIAR_REVEAL = 0.04;
