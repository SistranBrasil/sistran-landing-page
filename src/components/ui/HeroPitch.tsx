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

import Image from 'next/image';
import { motion, useTransform, type MotionValue } from 'motion/react';
import { mosaicIntroHome } from '@/data/legacy';
import { DIFFERENTIALS } from '@/data/differentials';
// SIS-245 — `getIcon` saiu daqui junto com os quatro Lucide dos pilares do hero.
// O registro (`src/lib/icons.ts`) continua inteiro e em uso pelas outras rotas, e
// `DIFFERENTIALS[].icon` também: o mapa de arte abaixo é LOCAL ao pitch, como a
// issue pede, exatamente para que «Por que SISTRAN?»/Diferenciais sigam com ícone.
// import { getIcon } from '@/lib/icons';
import { useReducedMotion, useScrollOpacity } from '@/lib/motion';

/**
 * SIS-245 — mapa de arte LOCAL, chaveado pelo `id` do pilar.
 *
 * Local e não um campo novo em `DIFFERENTIALS`: os mesmos quatro objetos alimentam os
 * boxes de `/quem-somos` e os Diferenciais, que continuam em Lucide — um campo lá
 * viraria arte 3D em rotas que a issue põe explicitamente fora de escopo. Chaveado por
 * `id` e não por índice porque índice não avisa quando a ordem da fonte muda.
 *
 * A ORDEM É A DA TABELA DA ISSUE, ao pé da letra: 1→Conhecimento em Seguros,
 * 2→Flexibilidade, 3→Tecnologia, 4→Solidez e permanência.
 *
 * ⚠️ RESSALVA DE LEITURA, registrada e NÃO corrigida por conta própria: `3home.png`
 * desenha pilares/colunas sobre um símbolo de infinito, e `4home.png` desenha uma
 * placa de circuito com um cristal ao centro. Lidos pelo assunto, o terceiro
 * conversa com «Solidez e permanência» e o quarto com «Tecnologia» — ou seja, o par
 * 3/4 parece invertido em relação à tabela. A tabela manda («nessa ordem»), e o
 * aceite nomeia essa ordem, então é ela que está implementada; trocar por leitura
 * própria seria decidir no lugar de quem escreveu a issue. Se a inversão for erro de
 * digitação, a correção é trocar os dois caminhos abaixo e nada mais.
 *
 * Os quatro arquivos são 1254×1254 com alfa e os quatro cantos medidos em
 * `rgba(0,0,0,0)` — não há fundo preto, e por isso NÃO entrou `mask` nem
 * `mix-blend-mode` (a issue os condicionava justamente a isso). A tinta ocupa ~78% da
 * caixa, com ~11% de margem transparente em cada lado: é por isso que a caixa
 * renderizada no CSS é maior do que a marca que se vê.
 */
const ARTE_PILAR: Readonly<Record<string, string>> = {
  'conhecimento-seguros': '/1home.png',
  flexibilidade: '/2home.png',
  tecnologia: '/3home.png',
  'solidez-permanencia': '/4home.png',
};

/** Lado do arquivo, para o `<Image>` reservar caixa quadrada e não haver salto. */
const ARTE_LADO = 1254;

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
            Marcas `aria-hidden`: o rótulo ao lado já é o nome, e marca com nome
            acessível próprio faria cada item ser lido duas vezes. Por isso o `alt`
            vazio no `<Image>` — é o par obrigatório do `aria-hidden` no invólucro.

            SIS-245 — as quatro marcas são os PNGs de `public/`, não mais os Lucide.
            Duas coisas saíram junto do `<Icone />`:
              · o `style={{ color: pilar.color }}` — ele existia para o glifo Lucide
                pintar em `currentColor`; num `<img>` a propriedade `color` é inerte, e
                deixá-la seria sugerir um efeito que não acontece. `DIFFERENTIALS[].color`
                continua no dado, servindo às outras rotas;
              · `loading="eager"`/`priority` NÃO entraram, e é decisão medida: os quatro
                arquivos somam ~4 MB e `images.unoptimized` está ligado (SIS-154), então
                o que chega ao navegador é o arquivo cheio. Preload de 4 MB no quadro do
                LCP trocaria um pilar de 40px por um hero lento. Ficam no `lazy` padrão —
                estão no viewport, carregam já, mas em prioridade baixa. Vale registrar
                para quem for otimizar depois: 1254px de lado para uma marca de ~40px é
                31× a resolução necessária, e reduzir os arquivos é ganho barato. */}
        <ul className="hero-pitch-pilares">
          {DIFFERENTIALS.map((pilar) => (
            <li key={pilar.id} className="hero-pitch-pilar">
              <span className="hero-pitch-pilar-marca" aria-hidden="true">
                <Image
                  src={ARTE_PILAR[pilar.id]}
                  alt=""
                  width={ARTE_LADO}
                  height={ARTE_LADO}
                  /* Traduz o `clamp(2rem, 2.8vw, 2.75rem)` do CSS no seu teto: a marca
                     nunca passa de 44px. Inerte enquanto `images.unoptimized` estiver
                     ligado, e por isso mesmo tem de ficar verdadeiro. */
                  sizes="44px"
                />
              </span>
              <span className="hero-pitch-pilar-nome">{pilar.title}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
