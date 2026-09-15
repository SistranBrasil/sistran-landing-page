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
 * Rotas que afinam duração/curva (`AFINACAO_REVEAL`) ou limiar de bloco alto
 * (`LIMIAR_REVEAL_BLOCO`, `MARGEM_REVEAL_TRILHO`, …) continuam com o que é
 * específico delas no `reveal-calibre.ts` da pasta — só o par canônico mora
 * aqui, para a primeira correção não deixar metade do site numa cadência e a
 * outra metade noutra.
 */
export const MARGEM_REVEAL = '0px 0px -12% 0px';
export const LIMIAR_REVEAL = 0.15;
