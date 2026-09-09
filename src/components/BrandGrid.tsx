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
 *     visível não adia nada. Aqui toda célula está fora da dobra — e o
 *     `fetchPriority="low"` da SIS-136 continua, pelo mesmo motivo de lá: logo
 *     decorativa não disputa o primeiro paint com o hero.
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
 *     forte: o LCP da home é o vídeo do hero, 15,4 MB, e quinze logos disputando
 *     banda com ele é exatamente o que `low` existe para evitar.
 *     Nenhum dos três atributos (`loading`, `decoding`, `fetchPriority`) muda.
 *
 * Componente de servidor: não há estado, medição nem observador. A faixa
 * precisava de `'use client'` para medir a largura da cópia e decidir quantas
 * repetições cabiam na viewport; uma grade de `grid-template-columns` não mede
 * nada — o próprio layout resolve.
 */

import './brand-grid.css';
import { CLIENTS } from '@/data/clients';

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
        <h2 id="marcas-grade-titulo" className="marcas-grade-titulo">
          Impulsionando as operações por trás das marcas que você conhece
        </h2>
        {/* SIS-179 — o CAMPO. Envelope só de apresentação: é ele que desenha as
            linhas e que tem a calha de meia célula que faz elas atravessarem além
            do bloco. Precisa ser um nó separado do `<ul>` porque a calha é
            `padding` do desenho, e `padding` no `<ul>` deslocaria as células.
            Sem papel semântico e sem `aria-hidden` (ele CONTÉM a lista): é um
            `<div>` mudo, e a árvore de acessibilidade continua sendo seção →
            título → lista de 15. */}
        <div className="marcas-grade-campo">
          {/* `<ul>` e não `<div>`: são quinze itens equivalentes, e o leitor de tela
              anuncia a contagem — que é metade do que a seção comunica. */}
          <ul className="marcas-grade-malha">
            {MARCAS.map((marca) => (
              <li className="marcas-grade-celula" key={marca.name}>
                {/* `<img>` simples, como na faixa: arquivos estáticos de proporção
                    variada exibidos com altura óptica limitada — o otimizador não
                    tem o que fazer, e cada logo é uma requisição só.
                    O `alt` é o `name` da marca: a logo É o conteúdo da célula, não
                    há texto ao lado nomeando-a. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={marca.logo}
                  alt={marca.name}
                  loading="lazy"
                  decoding="async"
                  fetchPriority="low"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
