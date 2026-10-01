/**
 * CelentSpotlight — SIS-177. A faixa Celent entre «Premiações» e «ISG» de
 * `/quem-somos`, agora no arranjo de `docs/celen.md` + `public/exemplocele.png`.
 *
 * ── A TERCEIRA PASSADA DESFAZ AS DUAS PRIMEIRAS ────────────────────────────
 *
 * As duas entregas anteriores montaram a arte como FUNDO da seção e o texto por
 * cima. É exatamente o defeito que `docs/celen.md` abre descrevendo («A imagem
 * está sendo usada como fundo da seção e o conteúdo textual foi colocado por cima
 * dela»), com as cinco consequências listadas lá: conflito entre texto e troféu,
 * baixo contraste, excesso de informação no mesmo espaço, dificuldade de separar
 * página de imagem, e perda de destaque da manchete E da premiação. O documento
 * fecha em restrição por nome: «Não utilizar a imagem como fundo de toda a seção».
 *
 * O que entra no lugar é composição editorial de DUAS COLUNAS: texto à esquerda
 * (38–42%), arte à direita (58–62%) dentro de moldura própria, `gap` de 48–72px,
 * e ZERO texto da página sobre a imagem. A arte é elemento, via `next/image`,
 * nunca `background-image`.
 *
 * ── NENHUMA PALAVRA NOVA, MENOS UMA ────────────────────────────────────────
 *
 * Os textos vêm dos mesmos lugares de sempre:
 *   • manchete → `REC_GAL_TOP5`      (`src/data/reconhecimentos.ts`)
 *   • bloco premiação → `logo-Celent.png` + `REC_CELENT.logoAlt`
 *   • destaque → `REC_CELENT.linha1`
 *   • complemento → `REC_CELENT.linha2`
 *   • arte → `REC_CELENT.capaAlt`
 * A ÚNICA escrita nova é o eyebrow «RECONHECIMENTO INTERNACIONAL», que o item 1
 * da coluna esquerda pede literalmente e que nenhuma fonte travada tinha. Ela foi
 * para `src/data/reconhecimentos.ts` (`REC_CELENT_EYEBROW`) e não digitada aqui.
 *
 * ⚠️ DIVERGÊNCIA DECLARADA, NÃO CORRIGIDA: `docs/celen.md` escreve o item 5 com
 * ponto final («…no quesito tecnologia.») e `REC_CELENT.linha2` não tem ponto. A
 * issue lista «alterar textos» no que está FORA, e o documento repete «Não
 * alterar os textos fornecidos» — mexer no dado por um caractere seria reescrever
 * conteúdo travado. O dado fica; a divergência de 1 caractere é declarada.
 *
 * ⚠️ O BLOCO «CELENT / Technology Standout 2023» É A IMAGEM DA MARCA, e não
 * tipografia HTML. `public/logo-Celent.png` já traz o wordmark E a linha
 * «Technology Standout 2023» desenhados abaixo dele — é o que `exemplocele.png`
 * mostra naquela posição. Escrever as mesmas palavras em HTML ao lado do arquivo
 * duplicaria a marca, que é outra restrição por nome do documento («Não duplicar a
 * logo Celent fora do bloco previsto»). O fio vertical ciano pedido no item 3 do
 * estilo é `border-inline-start` do bloco, no CSS.
 *
 * ── O ARQUIVO DA ARTE: `cele.png`, LITERAL ─────────────────────────────────
 *
 *   • `public/cele.png` → a arte da coluna direita. 1672×941: troféu, placa
 *     «Technology Standout 2023», quadrante XCelent e o balão «Único player…».
 *   • `public/exemplocele.png` → REFERÊNCIA DE LAYOUT, e nada mais. Não aparece em
 *     `src` nenhum deste componente.
 *   • `public/logo-Celent.png` → a marca do bloco de premiação.
 *
 * ⚠️ O BALÃO «Único player…» ENCOSTA NA BORDA DIREITA DA ARTE. É por isso que a
 * moldura leva `aspect-ratio: 1672 / 941` no CSS: com a caixa na proporção exata
 * do arquivo, `cover` não tem o que recortar, e os elementos principais (troféu,
 * placa, balão) ficam inteiros — que é o item 3 da conferência do documento. Sem
 * essa proporção a escolha seria `contain` com barras, ou `cover` cortando o
 * balão.
 *
 * ⚠️ A ENTREGA ANTERIOR USAVA `images/quem-somos/celent-capa.webp` aqui, e a
 * substituição continua DESFEITA porque a issue nomeia `cele.png` no corpo e no
 * aceite. O registro do custo fica, porque é real e medido: o webp é a MESMA
 * composição 1672×941, derivada deste mesmo PNG por
 * `scripts/otimizar-capa-celent-sis238.mjs`, e pesa 81.054 B contra 1.495.225 B —
 * 18×. Com `images.unoptimized` ligado (SIS-154) o que chega ao navegador é o
 * arquivo do disco inteiro. Se o peso incomodar, a volta é UMA linha: `CAPA` de
 * novo em `/images/quem-somos/celent-capa.webp` (dimensões idênticas).
 *
 * ── FUNDO, MARCADOR, MOVIMENTO ─────────────────────────────────────────────
 *
 * O fundo é o IDIOMA CLARO DA CASA, não um fundo novo: `section-light` +
 * `grade-tecnica` (o grid quase imperceptível, sexto consumidor) + dois radiais
 * muito suaves + arcos grandes desenhados por `border`+`border-radius`. É o mesmo
 * conjunto de `isg-provider-lens.css`, a seção imediatamente abaixo desta na rota,
 * e é o que o documento pede item por item («Azul-gelo / Gradiente radial muito
 * suave / Linhas técnicas finas / Arcos grandes com baixa opacidade / Grid quase
 * imperceptível»). Nada de navy aqui: «Não utilizar fundo azul-escuro nesta
 * seção».
 *
 * O marcador vertical «PREMIAÇÕES» NÃO é remontado: ele já existe como parada
 * `{ id: 'premiacoes' }` em `src/data/pageSections.ts:142`, desenhado pelo padrão
 * lateral da rota. O documento manda preservá-lo e «Não duplicar o marcador dentro
 * do conteúdo principal» — então este arquivo não toca nele, e `pageSections.ts`
 * não ganha entrada nova.
 *
 * O componente virou `'use client'` porque passou a ter entrada: texto por
 * opacidade + deslocamento horizontal da esquerda, arte descoberta da direita para
 * a esquerda, com atraso entre as duas. Os dois usam o `ScrollReveal` da casa («ou
 * o componente de reveal já existente»), que respeita `prefers-reduced-motion` e
 * roda `once` — sem travar rolagem.
 *
 * ⚠️ A REVELAÇÃO DA ARTE NÃO USA `clip-path`, POR IMPASSE MEDIDO: o recorte inicial
 * que esconderia o nó é o mesmo que derruba o rácio de interseção abaixo do
 * `amount: 0.2` do reveal, e então o `whileInView` nunca dispara — a imagem ficaria
 * invisível para sempre. A medida está no ⚠️ ao lado do nó, no corpo, e em
 * `ScrollReveal.tsx`. Quem faz o papel da máscara é o `overflow: hidden` da moldura.
 * Isso também resolve, de graça, a razão medida na SIS-262: `clip-path` recorta a
 * sombra projetada inclusive no estado final `inset(0% 0% 0% 0%)`, e a moldura é
 * justamente quem tem borda ciano e sombra azul suave.
 */

'use client';

import Image from 'next/image';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { REC_CELENT, REC_CELENT_EYEBROW, REC_GAL_TOP5 } from '@/data/reconhecimentos';
import './celent-spotlight.css';

/* A arte nomeada pela issue. As medidas são as do arquivo, lidas com `sharp`, não
   estimadas — é delas que sai a proporção que governa a moldura no CSS, e é ela que
   impede `cover` de recortar o troféu e o balão.

   ⚠️ CORRIGIDO, E ERA DEFEITO DE VERDADE: aqui estava declarado 1672×941
   (proporção 1,777), que é a medida da capa ANTERIOR desta seção
   (`celent-capa.webp`, da SIS-238). O arquivo `public/cele.png` que esta issue
   nomeia tem 1315×867 — proporção 1,517. Medido com `sharp` sobre o arquivo do
   disco, e conferido: 100% dos pixels opacos, sem margem transparente para aparar.

   A consequência do número errado não era cosmética: a moldura recebia
   `aspect-ratio` de 1,777 e a `<img>` tem `object-fit: cover`, então a arte de
   1,517 era escalada pela LARGURA e perdia ~15% da ALTURA — recorte no topo e na
   base da cena, exatamente o que o item 3 da conferência de `docs/celen.md` proíbe.
   Com a proporção certa, `cover` não tem o que comer e a moldura fica ~17% mais
   alta na mesma largura. É de onde vem a maior parte do ganho de tamanho. */
const CAPA = '/cele.png';
const CAPA_LARGURA = 1315;
const CAPA_ALTURA = 867;

export default function CelentSpotlight() {
  return (
    <section
      aria-labelledby="celent-standout"
      className="section-py section-light cel-secao cel-cantos"
    >
      <div aria-hidden className="grade-tecnica" />

      <div className="container-lp cel-grade">
        {/* ── COLUNA ESQUERDA (38–42%) ──────────────────────────────────────
            `cortina={false}` e `distancia={0}`: o documento pede aqui opacidade
            mais deslocamento HORIZONTAL da esquerda, e nada além disso. */}
        <ScrollReveal
          className="cel-coluna"
          cortina={false}
          distancia={0}
          distanciaX={-24}
          duracao={0.75}
        >
          <p className="cel-eyebrow">{REC_CELENT_EYEBROW}</p>

          <h2 id="celent-standout" className="cel-titulo">
            {REC_GAL_TOP5}
          </h2>

          {/* O bloco de premiação: fio vertical ciano (no CSS) + a marca oficial,
              que já desenha «CELENT» e «Technology Standout 2023». */}
          <p className="cel-marca">
            <Image
              src="/logo-Celent.png"
              alt={REC_CELENT.logoAlt}
              width={1833}
              height={638}
              /* Teto do `clamp` do CSS: a marca nunca passa de 232px. */
              sizes="232px"
            />
          </p>

          <p className="cel-linha1">{REC_CELENT.linha1}</p>
          <p className="cel-linha2">{REC_CELENT.linha2}</p>
        </ScrollReveal>

        {/* ── COLUNA DIREITA (58–62%) ───────────────────────────────────────
            A moldura NÃO é o nó animado (ver o ⚠️ da máscara no docblock). Ela é
            quem carrega raio, borda ciano, sombra e `overflow: hidden`; a
            revelação direita→esquerda mora no invólucro de dentro.
            `indice={2}` é o «pequeno atraso entre texto e imagem»: 2 × 0,07 =
            0,14s, com o passo da cascata da casa em vez de um delay inventado. */}
        <div className="cel-moldura">
          {/* ⚠️ A REVELAÇÃO DIREITA→ESQUERDA NÃO É `clip-path`, E A RAZÃO É MEDIDA.
              A primeira montagem pedia ao `ScrollReveal` uma cortina pela direita
              (`cortinaLado="direita"`, partindo de `inset(0 0 0 100%)`). No
              navegador isso é um impasse: o recorte inicial que esconde o nó é o
              mesmo que faz o `IntersectionObserver` do motion devolver rácio 0
              (a 100%) ou 12% (a 88%), abaixo do `amount: 0.2` do componente — o
              `whileInView` nunca dispara e a arte fica invisível PARA SEMPRE, com
              a `<img>` `lazy` nem carregando. A medida inteira está no ⚠️ de
              `ScrollReveal.tsx`, onde a prop foi retirada.
              O que entra no lugar é o terceiro caminho que `docs/celen.md`
              autoriza por escrito («máscara, `clip-path` ou o componente de reveal
              já existente»): a arte desliza de +32px da direita com opacidade 0→1,
              e quem faz o papel da máscara é o `overflow: hidden` da moldura — o
              que estiver fora dela ainda não se vê, então a imagem se descobre da
              direita para a esquerda. Sem recorte no nó observado, sem impasse. */}
          <ScrollReveal
            className="cel-mascara"
            cortina={false}
            distancia={0}
            distanciaX={32}
            duracao={0.85}
            indice={2}
          >
            <Image
              src={CAPA}
              alt={REC_CELENT.capaAlt}
              width={CAPA_LARGURA}
              height={CAPA_ALTURA}
              /* A arte ocupa ~66% do container acima de 64rem (mais a sangria à
                 direita sobre a margem vazia da janela — 824px a 1440, ou seja 57vw
                 ali) e a largura da janela abaixo disso. Era `60vw`, de quando a
                 coluna valia 62% do container: continua sendo o mesmo teto seguro,
                 porque o que a `<img>` de fato pede a 1440 é menos que isso.
                 Inerte enquanto `images.unoptimized` estiver ligado (SIS-154) e por
                 isso mesmo tem de ficar verdadeiro. */
              sizes="(min-width: 64rem) 60vw, 100vw"
            />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
