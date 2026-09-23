/**
 * SIS-292 — O CALIBRE DO REVEAL DO CORPO DAS SLUGS DE `/solucoes`.
 *
 * Um arquivo por rota é o padrão que `/contato` (SIS-263 + SIS-269), `/esg`
 * (SIS-271), `/solucoes` (SIS-273) e `/sistran-university` (SIS-289) seguem, e
 * este nasce com a mesma forma do último: REEXPORTA o par canônico de
 * `src/lib/reveal-calibre.ts` em vez de reescrever os números.
 *
 * A razão de cada valor está no docblock do canônico — em resumo: a margem é
 * NEGATIVA (`0px 0px -12% 0px`) porque positiva estende a raiz abaixo da dobra e
 * produz o defeito que a SIS-269 nomeou (o bloco termina a animação fora da tela
 * e, quando a pessoa chega, já está parado), e `0.15` é o limiar com que os
 * escopos medidos em `/contato` acendiam com o topo entre 72% e 84% da viewport.
 *
 * Existe porque a SIS-292 pede o efeito «no espírito da University» em TODAS as
 * seções de `/solucoes/match-ai`, e o que define esse espírito não é a lista de
 * presets: é a CADÊNCIA POR SCROLL, que mora neste par. Escrever `-12%`/`0.15` à
 * mão em cada `RevealScope` do componente criaria a enésima cópia dos mesmos dois
 * valores — a classe de defeito em que a primeira correção deixa metade da página
 * numa cadência e a outra metade noutra.
 *
 * O arquivo é da PASTA e não do arquivo: quando `FastPagina.tsx` (ou a próxima
 * slug com corpo próprio) receber reveal, importa daqui. É o que evita que cada
 * corpo de slug escolha o seu momento de ignição.
 *
 * DURAÇÃO E CURVA não são afinadas aqui, pelo mesmo motivo do gêmeo da
 * University: os 500ms de `--motion-reveal-base` e os 80ms de
 * `--motion-stagger-reveal` são os tokens do projeto, e a issue não pediu «mais
 * fluido» por escrito em nenhum ponto. Se pedir, entra como `AFINACAO_REVEAL` e
 * vai no `style` dos escopos — o gancho (`--reveal-dur`/`--reveal-ease`) já
 * existe na regra `[data-reveal]` do `globals.css`.
 */
export { MARGEM_REVEAL, LIMIAR_REVEAL } from '@/lib/reveal-calibre';
