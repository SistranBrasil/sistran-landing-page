'use client';

/**
 * HeroPitch — SIS-192. O bloco de escrita da coluna esquerda do hero.
 *
 * Substitui o `HeroCaptions` NA HOME: no lugar das três legendas de
 * `HERO_SLIDES` se sucedendo em janelas de rolagem, UM bloco só, que não troca
 * de conteúdo — título, apoio e os quatro pilares.
 *
 * ── NENHUMA PALAVRA NOVA (Regra Zero) ──────────────────────────────────────
 * Tudo aqui é escrita que já estava travada no `copy-lock.json`, só MUDOU DE
 * ENDEREÇO: saiu do mosaico da home e veio para o hero.
 *   • título e apoio  → `mosaicIntroHome` (`src/data/legacy.ts`)
 *   • quatro rótulos  → `DIFFERENTIALS[].title` (`src/data/differentials.ts`)
 * A `description` de cada `DIFFERENTIALS` fica de fora, e é a mesma razão que o
 * mosaico já registrava: as caixas do site são só rótulo, e uma das descrições
 * ainda diz "mais de 150 clientes" quando o número certo é 130 — erro que não é
 * desta issue e que não vale trazer para a tela de abertura.
 *
 * ── POR QUE ELE REUSA AS CLASSES `.hero-caption*` ──────────────────────────
 * Não é economia de CSS: é o único jeito de não refazer duas coisas que já
 * foram medidas. A SIS-178 deixou o hero com DOIS regimes de cor (texto escuro
 * na coluna branca a partir de 1024px; texto claro sobre o vídeo em sangria
 * abaixo disso), e esse par vive inteiro nas regras de `.hero-caption`,
 * `.hero-caption-title`, `.hero-caption-lead` e companhia. Um bloco com classes
 * próprias nasceria com UMA paleta e ficaria ilegível num dos dois lados — que é
 * exatamente o defeito que o cabeçalho de `HeroCinematic` manda não reabrir.
 * O que é novo aqui — o realce do título e a lista de pilares — ganha classes
 * `.hero-pitch-*`, e cada uma tem os dois regimes escritos em `globals.css`.
 *
 * ── O RELÓGIO ──────────────────────────────────────────────────────────────
 * SIS-226 — O BLOCO PASSOU A ENTRAR, E ELE É AGORA O QUARTO PASSO, NÃO O ÚNICO.
 *
 * Era: "NÃO cicla e NÃO entra — no primeiro quadro da página ele já está legível,
 * porque é a manchete da home". Essa premissa caducou nesta issue: as três
 * legendas de `HERO_SLIDES` voltaram a ciclar sobre o vídeo (SIS-226, item 1) e
 * este bloco é o FECHO da sequência. Se ele continuasse em `opacity: 1` desde o
 * primeiro quadro, as quatro escritas ficariam empilhadas na mesma célula do grid
 * durante todo o trecho de 0 a 0.52 — duas colunas de texto sobrepostas, que é o
 * caso ILEGÍVEL que a nota de movimento reduzido no `globals.css:1533` descreve.
 *
 * ENTRADA `0.575 → 0.65`. Começa onde a terceira legenda ACABA de sair (a janela
 * dela é `[0.44, 0.50, 0.54, 0.58]`, em `ui/HeroCaptions.tsx`): 0.575 dá o mesmo
 * respiro de vídeo puro que existe entre as outras três, sem que duas escritas
 * dividam a tela em nenhum ponto do percurso.
 *
 * E NÃO HÁ MAIS SAÍDA — o bloco fica em 1 até o fim do percurso, que é o que o
 * item 3 da issue pede ("manter até a saída da cena"). Era `[0, 0.52, 0.66] →
 * [1, 1, 0]`, e a razão da saída era o `scale` que fechava a cena em card a
 * partir de 0.62: texto dentro de nó que escala encolhe junto e fica borrado.
 * Esse `scale` NÃO EXISTE MAIS — a SIS-198 o removeu e a geometria do quadro é
 * CSS estático (ver o cabeçalho de `HeroCinematic`). Sem escala não há nada de
 * que fugir, e a cena sai de tela por ser `sticky` até `end end`: o bloco
 * desaparece junto com ela, sem precisar de rampa.
 *
 * `pin: true` continua proibido; aqui não há gatilho novo nenhum, é o MESMO
 * `scrollYProgress` que o hero já calcula.
 */

import { motion, useTransform, type MotionValue } from 'motion/react';
import { mosaicIntroHome } from '@/data/legacy';
import { DIFFERENTIALS } from '@/data/differentials';
import { getIcon } from '@/lib/icons';
import { useReducedMotion, useScrollOpacity } from '@/lib/motion';

export default function HeroPitch({ progress }: { progress: MotionValue<number> }) {
  const rm = useReducedMotion();

  /* Entra depois da terceira legenda e FICA. Ver a nota do cabeçalho para os dois
     números e para o motivo de a saída ter deixado de existir.

     `useScrollOpacity` e NÃO `useTransform(progress, [a, b], [0, 1])`, e isto foi
     MEDIDO nesta issue: na forma de array o `motion` acelera a opacidade em
     `Animation` nativa com `ViewTimeline`, que mede a visibilidade DO PRÓPRIO nó
     no scrollport em vez de ler o relógio que recebe. Numa cena `sticky` os dois
     divergem, e o efeito era o oposto do contrato — o bloco chegava a 1 em 0.65 e
     DECAÍA linearmente até 0.028 no fim do percurso (medido em 1440 e 390 por
     `scripts/medir-sequencia-hero-sis226.mjs`: 0.857 em 0.70, 0.571 em 0.80,
     0.429 em 0.85), com o `style` inline marcando `opacity: 0` — a animação
     nativa vence o inline, e é por isso que o sintoma parece inexplicável. O
     mesmo caso está documentado em `useScrollOpacity` (`src/lib/motion.ts`), que
     nasceu do defeito irmão na pastilha `.hero-cue`. */
  const opacity = useScrollOpacity(progress, [0.575, 0.65], [0, 1]);
  /* A mesma subida discreta das legendas, na medida do título (`sobe: 38` lá).
     36px em ~7,5% do percurso: o bloco assenta, não desliza.
     Este continua na forma de array de propósito: a aceleração nativa citada
     acima atinge a OPACIDADE, e o `transform` foi conferido na mesma medição —
     `translateY(36px)` em 0.60, `14.3px` em 0.62, `none` de 0.65 em diante. */
  const y = useTransform(progress, [0.575, 0.65], [36, 0]);

  return (
    <div className="hero-captions hero-pitch">
      {/* Repouso ESCRITO, nunca `undefined` — a nota longa está em
          `ui/HeroCaptions.tsx` e vale igual aqui: `useReducedMotion` nasce
          `false`, então o primeiro render já gravou uma opacidade no `style`
          inline, e `undefined` só faz o `motion` PARAR de cuidar da propriedade
          sem limpar o que escreveu. Com movimento reduzido a cena também não
          escala (ver `HeroCinematic`), então 1 fixo é o valor correto — não há
          card fechando para fugir. E com movimento reduzido as quatro escritas
          ficam EMPILHADAS EM FLUXO (`.hero-captions { display: block }`, os dois
          interruptores em `globals.css:1548` e `:3137`), então este bloco não
          precisa esperar rolagem nenhuma para ser lido: ele é o último da pilha.
          SIS-226 — o `y` também tem de vir escrito, pelo mesmo motivo do
          `opacity`: no primeiro render o `motion` grava `translateY(36px)`. */}
      <motion.div
        className="hero-caption"
        style={rm ? { opacity: 1, y: 0 } : { opacity, y }}
      >
        {/* ESTE é o `h1` da home, e é o único. O `<h1 className="sr-only">` que
            vivia em `HeroCinematic` saiu junto com a montagem deste bloco: com
            os dois, a página teria dois cabeçalhos de nível 1 dizendo coisas
            diferentes. A nota que registra a troca está lá, no lugar dele. */}
        <h1 className="hero-caption-title">
          {mosaicIntroHome.tituloAntes}
          {/* Classe própria e NÃO `.mosaic-realce`: aquela vive em
              `legacy/legacy.css`, que só é carregado por quem importa o
              `StackScenes` — e o mosaico acabou de sair da home. Reusá-la aqui
              deixaria o realce sem regra nenhuma na única rota que o mostra.
              O desenho é o mesmo; os dois regimes estão em `globals.css`. */}
          <span className="hero-pitch-realce">{mosaicIntroHome.tituloRealce}</span>
          {mosaicIntroHome.tituloDepois}
        </h1>
        <p className="hero-caption-lead">{mosaicIntroHome.text}</p>

        {/* Os quatro pilares. `<ul>` e não uma sequência de `<span>`: são quatro
            itens equivalentes, e o leitor de tela anuncia a contagem.
            Ícones `aria-hidden`: o rótulo ao lado já é o nome, e ícone com nome
            acessível próprio faria cada item ser lido duas vezes. A cor de cada
            um vem de `DIFFERENTIALS[].color`, como no mosaico — é decoração, e
            por isso não está sujeita ao piso de contraste de texto; quem carrega
            a informação é o rótulo, que tem tinta própria nos dois regimes. */}
        <ul className="hero-pitch-pilares">
          {DIFFERENTIALS.map((pilar) => {
            const Icone = getIcon(pilar.icon);
            return (
              <li key={pilar.id} className="hero-pitch-pilar">
                <span className="hero-pitch-pilar-marca" aria-hidden="true" style={{ color: pilar.color }}>
                  <Icone />
                </span>
                <span className="hero-pitch-pilar-nome">{pilar.title}</span>
              </li>
            );
          })}
        </ul>
      </motion.div>
    </div>
  );
}
