/**
 * SIS-289 — O CALIBRE DO REVEAL DE `/sistran-university`.
 *
 * Um arquivo por rota é o padrão que `/contato` (SIS-263 + SIS-269), `/esg`
 * (SIS-271) e `/solucoes` (SIS-273) já seguem: a `page.tsx` importa daqui, e o
 * fecho (`ContactCTA` → `ContactCTAReferencia`) recebe os mesmos valores por
 * prop. O motivo de não repetir os números nos pontos de uso está escrito nos
 * gêmeos: calibre duplicado é a classe de defeito em que a primeira correção
 * deixa metade da página numa cadência e a outra metade noutra, e ninguém
 * percebe olhando um arquivo só.
 *
 * ── O PAR É REEXPORTADO, NÃO REESCRITO ────────────────────────────────────
 *
 * `MARGEM_REVEAL` (`0px 0px -12% 0px`) e `LIMIAR_REVEAL` (`0.15`) vêm de
 * `src/lib/reveal-calibre.ts`, o canônico pós-SIS-269, e a razão de cada número
 * está no docblock de lá — em resumo: a margem é NEGATIVA porque positivo
 * estende a raiz abaixo da dobra e é assim que se produz o defeito que a SIS-269
 * nomeia (o bloco termina a animação fora da tela e, quando a pessoa chega, já
 * está parado), e 0.15 é o limiar com que os escopos medidos em `/contato`
 * acendiam com o topo entre 72% e 84% da viewport.
 *
 * Reexportar é deliberado, e é o que `/contato` faz desde a SIS-275. `/esg` e
 * `/eventos-inovacao` ainda declaram o par localmente porque nasceram antes
 * dela; copiar aquele formato aqui seria criar a quinta cópia dos mesmos dois
 * valores no dia em que já existe um lugar para eles.
 *
 * ── O QUE NÃO ESTÁ AQUI, E POR QUÊ ────────────────────────────────────────
 *
 * DURAÇÃO E CURVA não são afinadas. `/contato` tem `AFINACAO_REVEAL` (820ms,
 * expo-out) porque a 2ª volta da SIS-263 pediu «mais fluido» POR ESCRITO; a
 * SIS-289 pede o efeito «igual ao de /contato» em MECANISMO e em CADÊNCIA POR
 * SCROLL, e é isso que o par acima entrega. Os 500ms de `--motion-reveal-base` e
 * os 80ms de `--motion-stagger-reveal` são os tokens do projeto, e inventar uma
 * terceira cadência sem pedido é o que faz a próxima issue ter três lugares para
 * corrigir. Se a afinação for pedida, ela entra aqui como `AFINACAO_REVEAL` e
 * vai no `style` dos `RevealScope` — o gancho (`--reveal-dur`/`--reveal-ease`)
 * já existe na regra `[data-reveal]` do `globals.css`.
 *
 * NÃO HÁ SEGUNDO LIMIAR para escopo alto, como o `LIMIAR_REVEAL_BLOCO` de
 * `/esg`. Lá ele existe porque três escopos passavam de 550px de altura e 15%
 * deles acendia a fileira de baixo já fora da tela. Aqui os três escopos são
 * medidos e nenhum tem duas fileiras: a coluna de escrita do Programa (238px a
 * 1440), o miolo do Unidep e o dos Números. Acrescentar o número «por
 * simetria», sem medida que o justifique, seria escolher o momento de ignição de
 * três seções por analogia com outra página.
 *
 * `esperarRota` NÃO É USADO EM NENHUM ESCOPO desta rota, e isto CORRIGE o que
 * estava em `#university-numeros`. O contrato que a SIS-269 fixou é «espera =
 * estou na dobra e a cortina do `RouteLoadGate` me esconderia». A dobra desta
 * rota é a CAPA (`HeroImageBackdrop` + `PageHero`), que não recebe reveal nenhum
 * por ser o LCP (§3 de `docs/scroll.md`); a seção dos números é a QUARTA da
 * página e nasce a mais de uma tela abaixo. Com `esperarRota` ela ganhava um
 * observador no instante em que a cortina subia, sem ter nada para proteger — e
 * é exatamente a soma desses observadores simultâneos que a SIS-269 mediu como
 * «acendeu tudo depois do load».
 */
export { MARGEM_REVEAL, LIMIAR_REVEAL } from '@/lib/reveal-calibre';
