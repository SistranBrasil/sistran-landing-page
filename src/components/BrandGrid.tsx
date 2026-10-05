/**
 * SIS-156 — grade estática de marcas, no formato de `terminal-industries.com`:
 * um título editorial acima e, abaixo, as logos em células de uma malha de
 * linhas finas. Nada se move.
 *
 * Substitui o `SignalMarquee` NA HOME apenas. `/contato` e
 * `/parceiros-e-implementacoes` continuam com a faixa rolante — divergência
 * deliberada, anotada nos dois lugares e no cabeçalho do `SignalMarquee`.
 *
 * SIS-179 — MUDOU DE LUGAR: era rodapé de "Sistran em números" e passou a abrir a
 * página, logo depois do hero (mount em `src/app/page.tsx`; a nota de herança
 * ficou em `Metrics.tsx`, onde ela morava). E mudou de desenho: a malha deixou de
 * ser caixa fechada e passou a campo aberto com cruzes nos cruzamentos, e o título
 * passou a centrado e maior — as duas coisas em `brand-grid.css`.
 *
 * Três coisas que a grade parada resolve de graça, e por isso são o argumento da
 * troca, não efeito colateral:
 *
 *  1. Não há movimento infinito, então não há pausa a implementar nem
 *     `prefers-reduced-motion` a tratar. Na faixa, parar o loop deixaria as
 *     marcas fora da tela INALCANÇÁVEIS, e por isso o `globals.css` troca o
 *     mecanismo (a viewport vira lista rolável). Aqui as quinze marcas estão
 *     todas na tela desde o primeiro quadro: com a preferência ligada nada muda,
 *     porque nada se move.
 *  2. UMA cópia, não duas. A faixa duplica a lista para fechar o loop e a segunda
 *     cópia é `aria-hidden`; sem duplicata não há risco de leitura dobrada e o
 *     `alt` de cada logo é lido uma vez só.
 *  3. `loading="lazy"` passa a valer de verdade. Na faixa, `lazy` numa cópia
 *     visível não adia nada. Aqui toda célula está fora da dobra.
 *     (O `fetchPriority="low"` que esta linha citava saiu em 02/10 pela SIS-241;
 *     a razão está no bloco mais abaixo e no comentário junto ao `<img>`.)
 *
 *     SIS-179 — A RAZÃO DE "FORA DA DOBRA" MUDOU, OS ATRIBUTOS NÃO.
 *     Estava escrito "a grade FECHA A PÁGINA, então toda célula está fora da
 *     dobra". Depois da SIS-179 a grade abre a página, e essa frase virou mentira
 *     — mas a conclusão continua verdadeira por outro caminho, e é o caminho que
 *     precisa estar escrito, senão a próxima pessoa lê a premissa velha, conclui
 *     que a grade está na dobra e tira os dois atributos:
 *     a seção acima é o `#top`, que tem 200svh (mobile) a 320svh (desktop) de
 *     percurso de rolagem (`globals.css`). A primeira célula da grade só entra na
 *     viewport depois de duas a três telas de rolagem — está MAIS longe da dobra
 *     agora do que estava no rodapé, não menos.
 *     E o `fetchPriority="low"` fica pelo motivo original intacto e agora mais
 *     forte: o LCP da home é o vídeo do hero, 10,43 MiB, e quinze logos disputando
 *     banda com ele é exatamente o que `low` existe para evitar.
 *     Nenhum dos três atributos (`loading`, `decoding`, `fetchPriority`) muda.
 *
 *     ⚠️ 02/10 · SIS-241 — ESTE PARÁGRAFO CADUCOU, e o que o derruba é o
 *     parágrafo ACIMA dele. Se a primeira célula só entra na viewport depois de
 *     duas a três telas de rolagem, então `loading="lazy"` já garante que ela
 *     não é buscada durante o primeiro paint: quando a requisição sai, o hero
 *     terminou há muito. A disputa com os 10,43 MiB do vídeo, que era a razão
 *     inteira do `low`, não acontece — `lazy` sozinho já a impede.
 *     O que o `low` fazia de fato era outra coisa, e ruim: punha as quinze atrás
 *     das OUTRAS imagens que carregam no mesmo instante que elas, inclusive
 *     fotos de 2 MB (medido em 02/10: 31 imagens na home, 20,6 MB, todas
 *     começando ~752ms). Resultado relatado por escrito, com captura: a parede
 *     acesa com UMA logo de quinze, as outras catorze em células vazias.
 *     Somar `lazy` + `low` é adiar duas vezes. Ficou só o `lazy`.
 *     Hoje são DOIS atributos (`loading`, `decoding`) e eles não mudam.
 *
 *     SIS-240 — OS 10,43 MiB FORAM RECONFERIDOS, E CONTINUAM SENDO ESSE NÚMERO.
 *     A issue pedia atualizar este bloco se ele citasse peso ou hero vencidos.
 *     `public/videos/hero-scroll-v2.mp4` = 10.936.383 bytes = 10,43 MiB, exatamente
 *     o que está escrito acima, e o arquivo do hero continua sendo esse
 *     (`HeroCinematic.tsx`, `HERO_VIDEO`). Então nada a corrigir aqui — o registro
 *     fica para que a próxima pessoa não gaste a rodada duvidando do mesmo número.
 *     Quem MUDA esse peso é a SIS-241 (recompressão do bruto), não esta issue; se ele
 *     cair, é lá que a frase acima passa a estar velha.
 *
 * SIS-195 — AS LOGOS PASSARAM A ENTRAR EM CASCATA, E O ITEM 1 ACIMA CONTINUA
 * VALENDO. O que mudou é a ENTRADA (uma vez, ao chegar em cena, revertida ao
 * voltar acima); o que o item 1 nega é movimento INFINITO, que continua não
 * existindo aqui. Com movimento reduzido — nas duas chaves — as quinze marcas
 * seguem na tela desde o primeiro quadro, porque o estado escondido é anulado
 * em CSS (bloco "SIS-193 · fundação" do `globals.css`), não por JavaScript.
 * A geometria da SIS-179 não foi tocada: 5×3 / 3×5 / 2 colunas, malha, cruzes e
 * hover azul intactos. O doc de referência pede "10 colunas no desktop"; aqui
 * são 15 marcas em 5×3 e mudar isso seria refazer a conta de meia célula do
 * `brand-grid.css` para caber um número de logos que não temos.
 *
 * O que NÃO foi feito, e por quê: o doc sugere as linhas da malha entrando com
 * `scaleX/scaleY` antes das logos. Aqui as linhas não são nós — são gradientes
 * no `background-image` do próprio campo (`.marcas-grade-campo`). Não há o que
 * escalar, e animar a opacidade do campo levaria as logos junto, que é o
 * oposto do efeito. O "a interface está sendo montada" fica pela cascata.
 *
 * Componente de servidor: não há estado, medição nem observador. A faixa
 * precisava de `'use client'` para medir a largura da cópia e decidir quantas
 * repetições cabiam na viewport; uma grade de `grid-template-columns` não mede
 * nada — o próprio layout resolve.
 */

import type { CSSProperties } from 'react';

import './brand-grid.css';
import { CLIENTS } from '@/data/clients';
import RevealScope from '@/components/motion/RevealScope';
import RevealText from '@/components/motion/RevealText';
import { LIMIAR_REVEAL } from '@/lib/reveal-calibre';

/* Só as marcas COM arquivo de logo, mesmo filtro do `SignalMarquee` e pela mesma
   razão: a célula é uma placa gráfica, e um chip textual no meio da malha leria
   como célula vazia. Hoje as seguradoras sem asset estão comentadas em
   `clients.ts`; o filtro garante que descomentar uma lá não abra buraco aqui.
   São 15 — e o número é o que decide a geometria abaixo. */
const MARCAS = CLIENTS.filter((c) => c.logo);

export function BrandGrid() {
  return (
    <section
      className="marcas-grade"
      aria-labelledby="marcas-grade-titulo"
      /* `aria-labelledby` no próprio título em vez de `aria-label` avulso: aqui,
         diferente da faixa, existe texto na tela dizendo o que a lista é — e o
         rótulo que se ouve deve ser o mesmo que se lê. */
    >
      <div className="container-lp">
        {/* SIS-194 — o título sobe por baixo de máscara, palavra por palavra, e
            entra ANTES das logos: ele está acima no DOM e tem gatilho próprio,
            mais cedo (05/10 · SIS-242: eram «20% do campo em cena»; hoje os dois
            leem o par canônico, e o título continua antes por estar acima no
            DOM e ser um bloco baixo, não por ter limiar menor). O texto é o
            mesmo, travado no `copy-lock`: `RevealText` recebe a frase como
            `children` de texto puro e a devolve inteira no `aria-label`. */}
        <RevealText id="marcas-grade-titulo" className="marcas-grade-titulo">
          Impulsionando as operações por trás das marcas que você conhece
        </RevealText>
        {/* SIS-179 — o CAMPO. Envelope só de apresentação: é ele que desenha as
            linhas e que tem a calha de meia célula que faz elas atravessarem além
            do bloco. Precisa ser um nó separado do `<ul>` porque a calha é
            `padding` do desenho, e `padding` no `<ul>` deslocaria as células.
            Sem papel semântico e sem `aria-hidden` (ele CONTÉM a lista): é um
            `<div>` mudo, e a árvore de acessibilidade continua sendo seção →
            título → lista de 15. */}
        {/* SIS-195 — o envelope da cascata. A combinação abaixo equivale a
            `toggleActions: play none none reverse`: sair por baixo conserva o
            final e só voltar acima do gatilho desfaz a entrada. É um `<div>`
            inerte; a calha do campo segue resolvida sobre a largura do PRÓPRIO
            campo. */}
        {/* 05/10 · SIS-242 — `limiar={0.2}` VIROU `LIMIAR_REVEAL`.
            A nota acima justificava o 0.2 como «o "20% da seção" do doc», e essa
            leitura é o próprio defeito desta issue: o limiar é fração da ALTURA
            DO CAMPO, não da viewport, e o campo são 5×3 células — o bloco mais
            alto da home. 20% dele é muito mais rolagem do que 20% de uma seção
            de texto, e a parede acendia tarde justamente por ser grande.
            O par canônico desacopla a ignição do tamanho (a razão está no
            docblock de `src/lib/reveal-calibre.ts`, nota da SIS-307); o 0.2
            tinha ficado aqui porque esta linha passa o valor À MÃO e não lê o
            canônico — mesma causa do `RevealText` e do padrão do `RevealScope`,
            os três corrigidos juntos nesta issue.
            `umaVez={false}` + `reverterSomenteAcima` NÃO mudam: a hipótese 3 da
            issue suspeitava deles, mas é essa dupla que dá o
            `play none none reverse` do doc, e reverter só acima é o que impede
            a parede de apagar com a pessoa parada nela.
              | limiar={0.2} */}
        <RevealScope
          umaVez={false}
          reverterSomenteAcima
          limiar={LIMIAR_REVEAL}
        >
          <div className="marcas-grade-campo">
          {/* `<ul>` e não `<div>`: são quinze itens equivalentes, e o leitor de tela
              anuncia a contagem — que é metade do que a seção comunica. */}
          <ul className="marcas-grade-malha">
            {MARCAS.map((marca, indice) => (
              /* `data-marca` existe para que o CSS possa abrir exceção de tamanho
                 PARA UMA MARCA, e não para uma POSIÇÃO. A alternativa era
                 `li:first-child`, que é mais curta e está errada pelo motivo que
                 importa: ela diz "a primeira célula", quando o que se quis dizer é
                 "o Samplemed" — reordenar `clients.ts` moveria a exceção em
                 silêncio para outra logo. O gancho é dado, não classe, porque não é
                 estado nem variante de estilo: é a identidade da célula.
                 O slug é o `name` em minúsculas sem espaço; hoje os 15 nomes são
                 distintos nessa forma. */
              <li
                className="marcas-grade-celula"
                data-marca={marca.name.toLowerCase().replace(/\s+/g, '-')}
                key={marca.name}
              >
                {/* `<img>` simples, como na faixa: arquivos estáticos de proporção
                    variada exibidos com altura óptica limitada — o otimizador não
                    tem o que fazer, e cada logo é uma requisição só.
                    O `alt` é o `name` da marca: a logo É o conteúdo da célula, não
                    há texto ao lado nomeando-a. */}
                {/* SIS-195 — o SPAN recebe a transformação da entrada para não
                    disputar `transition` com a própria imagem, cuja transição
                    continua reservada ao hover de grayscale/opacity.
                    `--logo-i` segue a ordem de leitura do array. */}
                <span
                  className="marcas-grade-logo-reveal"
                  data-logo=""
                  style={{ '--logo-i': indice } as CSSProperties}
                >
                {/* 02/10 · SIS-241 — `fetchPriority="low"` SAIU DAQUI.
                    Ele pedia ao navegador para buscar estas quinze por último,
                    e por último queria dizer atrás dos 20,6 MB de imagem que a
                    home entrega: as células acendiam vazias e a pessoa via a
                    parede montar com uma logo só. Medido em 02/10 na produção —
                    as quinze somam 1.019 KB (26 a 54 KB cada), que é 5% do peso
                    da home, e são o CONTEÚDO da faixa, não enfeite.
                    `loading="lazy"` FICA: ele só adia até a faixa se aproximar,
                    que é o comportamento certo para um bloco abaixo da dobra. O
                    que estava errado era pedir prioridade baixa DEPOIS de já ter
                    adiado — as duas coisas somadas punham o conteúdo atrás de
                    fotos de 2 MB que ninguém está olhando naquele instante.
                      | fetchPriority="low" */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={marca.logo}
                  alt={marca.name}
                  loading="lazy"
                  decoding="async"
                />
                </span>
              </li>
            ))}
          </ul>
        </div>
        </RevealScope>
      </div>
    </section>
  );
}
