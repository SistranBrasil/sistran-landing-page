'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
/* 23/09 — A LISTA IMPORTADA É SÓ `SOLUTIONS_CATALOG`. A linha era:

     import { ACCELERATORS, SOLUTIONS_CATALOG, type Accelerator, type SdsAccelerator,
       type SolutionCatalogItem } from '@/data/accelerators';

   · `ACCELERATORS` só aparecia dentro de comentários desde que a SIS-280 tirou o
     selo «N aceleradores» — a nota de lá dizia que ele «continua importado porque
     ORDEM_VISUAL é montado a partir dele», e isso já não era verdade: `ORDEM_VISUAL`
     lê o catálogo. Ficava como import morto.
   · `SdsAccelerator` e `SolutionCatalogItem` saíram com a união (ver o dado): o SDS
     agora é um `Accelerator` e o componente tem um só tipo de card. */
import { SOLUTIONS_CATALOG, type Accelerator } from '@/data/accelerators';
/* SIS-280 — o carimbo que substitui a tag «Tecnologia Disruptiva» é o COMPONENTE
   GENÉRICO da casa (SIS-277), o mesmo de `/parceiros-e-implementacoes` e
   `/sistran-labs`: batida por `fromTo`, reduce nascendo no estado final, razão de
   aspecto vinda das dimensões do arquivo. Nada de GSAP ad hoc aqui. */
import CarimboBatida from '@/components/CarimboBatida';
import { vGrid, vCard, vHeader, vTitle, vSubtitle, VP, useReducedMotion } from '@/lib/motion';
/* SIS-216 — `useTilt` SAIU DAQUI, e não por gosto: ele escreve o `transform` do
   card em `style` inline, a cada quadro de `mousemove`. O hover que esta issue
   pede é `translateY(-6px)`, e um transform inline vence qualquer regra de folha
   por origem — os −6px simplesmente não apareceriam, ou apareceriam só no
   intervalo em que o ponteiro está parado. Tirar o tilt é o item 4 da issue («a
   reduzir/retirar tilt 3D se conflitar com −6px»), com a razão registrada.
   A linha era:

       import { useTilt } from '@/lib/useTilt';

   `useTilt` continua em uso por outros cartões do site; nada foi apagado de lá. */
import './accelerators.css';

/** Quem abre a grade, em primeira posição visual. */
/* SIS-280 — dois n, acompanhando o `id` em `ACCELERATORS`. Não é cosmética: este
   valor é comparado com `a.id`, e a grafia velha faria `ORDEM_VISUAL` não achar
   nada — o card sairia do topo da grade sem erro.

   23/09 — ELE JÁ NÃO É O CARD DE LARGURA TOTAL, e isso é consequência direta do
   pedido: «coloque o card SDS ao lado direito do da luminna». Só existe um vizinho
   à direita se a Luminna deixar de ocupar a linha inteira, então a faixa de
   destaque da SIS-216 caiu — as duas passam a dividir a primeira linha das duas
   colunas, com a mesma caixa dos outros seis. O que a Luminna conserva é a
   PRIMEIRA POSIÇÃO. Ver `.accel-item--destaque` em `accelerators.css`, onde o
   `grid-column: 1 / -1` está comentado com o mesmo motivo. */
const ID_DESTAQUE = 'luminna-ai';

/* A ORDEM DE EXIBIÇÃO É DERIVADA, NÃO UMA SEGUNDA LISTA: o destaque vem primeiro
   e os outros seis seguem na ordem de `ACCELERATORS`. O resultado casa exatamente
   com a proposta (Lumina, Match, Fast, QA, Connect, Smart Miner, Guru) — o que é
   sorte de arranjo, não coincidência a manter: se a ordem da proposta e a do dado
   divergirem um dia, o certo é discutir o dado, não fixar aqui uma cópia que
   passa a divergir em silêncio.
   `ACCELERATORS` NÃO foi reordenado de propósito: a vitrine de `/sistran-labs`
   consome a mesma lista, e mexer nela mudaria uma rota fora do escopo desta
   issue. */
const ORDEM_VISUAL = [
  ...SOLUTIONS_CATALOG.filter((a) => a.id === ID_DESTAQUE),
  ...SOLUTIONS_CATALOG.filter((a) => a.id === 'sds'),
  ...SOLUTIONS_CATALOG.filter((a) => a.id !== ID_DESTAQUE && a.id !== 'sds'),
];

/* 23/09 — O CARD ESPECIALIZADO DO SDS SAIU DE CENA, inteiro. Pedido da dona do
   conteúdo: «retire essa escrita JORNADA INTELIGENTE DE SINISTROS / SDS — Sistema
   Digital de Sinistros e deixe só a logo com sombra clara atrás seguindo o padrão
   dos outros e coloque a imagem atrás sds.png». Tirando o eyebrow e o título
   visíveis, e pondo capa fotográfica e a logo com halo, o que resta É o card
   padrão — manter um segundo componente para chegar ao mesmo desenho garantiria
   que os dois divergissem no primeiro ajuste feito num só deles. O SDS passa pelo
   `AccelCard` como os outros sete, e o `<h3>` em `sr-only` de lá é o que conserva
   o nome do produto para leitor de tela e para o `copy-lock`.

   O que morreu com o componente, e por quê cada peça:
   · `isSdsAccelerator` — o discriminante da união, que já não separa nada;
   · a JORNADA de cinco documentos («Comunicado → Documentos → Análise → Apoio
     antifraude → Regulação»), os dois orbes, o selo «Decisão humana preservada» e
     o pulso `sds-documento-pulso`. Era ilustração inventada aqui para um card sem
     arte; a arte chegou. Nada disso era conteúdo publicado: o bloco inteiro estava
     `aria-hidden`, e as cinco etapas continuam escritas de verdade na página do
     produto (`src/components/solucoes/SdsPagina.tsx`), que é a fonte delas;
   · o CTA dizia «Conheça o SDS» e agora diz «Conheça a solução» + nome em
     `sr-only`, que é a copy travada no `copy-lock.json` para os sete vizinhos —
     sete links iguais e um diferente na mesma grade lia como card de outro lote.

   O markup e as regras não ficam transcritos aqui: eram ~50 linhas de JSX e ~250
   de CSS (`.sds-card*` em `accelerators.css`), e é o mesmo tratamento que
   `TechnologyShowcase` recebeu — o que preserva a intenção é esta nota, não a
   cópia morta. O que a nota tem de dizer, e diz, é o que existia e por que não
   existe mais. */

function AccelCard({ a, destaque }: { a: Accelerator; destaque: boolean }) {
  return (
    /* A camada externa é a do `motion` (entrada por variants: ela controla o
       `transform` do reveal). O hover vive na camada de DENTRO, em CSS — as duas
       não podem disputar a mesma propriedade no mesmo nó. */
    <motion.div
      variants={vCard}
      className={['accel-item', destaque ? 'accel-item--destaque' : ''].filter(Boolean).join(' ')}
    >
    <article
      /* SIS-93 — `on-dark` é obrigatório aqui, não decorativo: a seção passou a
         ser `.section-light`, e os overrides dessa classe pintam h3/p/span de
         navy. Sem `on-dark` o texto do card ficaria navy sobre o navy do próprio
         card, ou seja, invisível. A classe devolve os valores claros (ver a nota
         em `.section-light .on-dark` no globals.css). */
      /* SIS-217 — `accel-card` é o gancho de `accelerators.css`: a reação da
         logo no hover e no foco de teclado é escrita lá, e não em utilitárias
         `group-hover:`, porque ela precisa ser desligada pelos dois canais de
         movimento reduzido (ver o cabeçalho daquele arquivo). SIS-216 estendeu
         isso ao card inteiro — capa, véu, borda e botão —, e a classe `group`
         saiu junto com as três camadas decorativas que a usavam (o filete de
         borda mascarado, o brilho que seguia o ponteiro e o orbe do canto): a
         capa fotográfica ocupa o lugar visual das três, e nenhuma utilitária
         `group-hover:` sobrou para ancorar. */
      /* `data-accel` = identidade do produto (não posição): exceções de escala
         da logo em CSS (SDS, Guru) não podem ser `nth-child` — reordenar a
         lista moveria o tamanho em silêncio. */
      className="accel-card on-dark"
      data-accel={a.id}
    >
      {/* A CAPA, e ela é DECORAÇÃO: `alt=""` + `aria-hidden`. A informação do
          card está toda em texto ao lado (nome no `<h3>`, descrição no `<p>`), e
          os rótulos desenhados dentro da arte — «Auto / Residencial / Vida»,
          «Sinistro #45871», os checks de Build/Testes/Qualidade/Deploy — são
          ilustração de produto, não conteúdo a publicar. Descrevê-los no `alt`
          criaria texto que ninguém revisou e que não existe na fonte do site.

          `fill` e não `width`/`height`: a caixa do card tem proporção de 4,5:1
          (destaque) e ~2,5:1 (os seis), e a arte é 16:9 — quem decide o
          enquadramento é o `object-fit: cover` da folha, não o layout.

          `sizes` casado com as duas caixas reais do arranjo (1116px no destaque,
          548px na coluna). RESSALVA DE SEMPRE (`docs/images-unoptimized.md`): com
          `images: { unoptimized: true }` o `next/image` não emite `srcset`, então
          hoje isto não produz efeito — fica correto para quando `unoptimized`
          sair. O que de fato economiza banda é a derivada WebP em tamanho de uso
          (`scripts/otimizar-capas-card-sis216.mjs`): 12,0 MB → 356 kB nos sete.

          `loading="lazy"`: a seção começa a ~1.900px do topo do documento nesta
          rota, muito abaixo da dobra. */}
      <Image
        src={a.capaCard}
        alt=""
        aria-hidden
        fill
        /* 23/09 — UMA CAIXA SÓ, porque a faixa de largura total acabou: as oito
           capas vivem na coluna de 548px. Era
           `destaque ? '(min-width: 1180px) 1116px, 100vw' : …`. A derivada da
           Luminna continua sendo a de 1672px (era a do destaque) — sobra
           resolução para a caixa nova, e regerá-la é outro assunto. */
        sizes="(min-width: 640px) 548px, 100vw"
        loading="lazy"
        className="accel-card__foto"
      />
      {/* O DEGRADÊ DE LEITURA, separado da foto: ele precisa continuar parado
          enquanto a foto faz o zoom do hover. Se fosse `background` do mesmo nó,
          o `scale` levaria o degradê junto e a coluna de texto perderia o apoio
          justamente no estado em que o card está em destaque. */}
      <span aria-hidden className="accel-card__veu" />

      <div className="accel-card__corpo">
        {/* SIS-217 — a placa do produto no lugar do glifo Lucide.

            `alt=""` + `aria-hidden` nas duas imagens: o `<h3>` logo abaixo
            publica o nome do acelerador em texto, e alt preenchido faria o
            leitor de tela ler a marca duas vezes seguidas (WCAG H67). Isso NÃO
            mudou quando o título saiu da tela (11/09): `sr-only` esconde do
            olho e mantém no leitor, então continuam sendo duas leituras se o
            `alt` for preenchido. O eco é
            decoração pura pelo mesmo motivo, mais uma vez.

            A caixa não é 1:1: as sete logos são horizontais e vão de 1,8:1 a
            6,7:1 — a geometria está em `.accel-logo`, no CSS ao lado.

            Tinta MEDIDA por `scripts/medir-logos-aceleradores-sis217.mjs`
            contra o navy chapado do card de então: a pior das sete (Guru de
            Seguros) dava 4,08:1 e a melhor (Lumina AI) 10,43:1, todas acima dos
            3:1 que a WCAG 1.4.11 pede de gráfico essencial. SIS-216 trocou o
            fundo por foto + véu, então aquele número não vale por herança e foi
            REMEDIDO no composto (`scripts/medir-cards-solucoes-sis216.mjs`, com
            o resultado no comentário da issue). Continua sem o chip branco que a
            SIS-201 precisou dar a quatro parceiros. */}
        {/* SIS-216 — A PLACA PERDEU O ACABAMENTO e ficou só caixa de geometria: a
            proposta põe a logo DIRETO sobre a foto escurecida, sem cápsula. O
            `style` inline era:

                background: `linear-gradient(135deg, ${a.tone}33, ${a.tone}10)`,
                border: `1px solid ${a.tone}66`,
                boxShadow: `0 8px 24px -12px ${a.tone}99`,

            …o que fazia sentido sobre o navy chapado do card antigo, onde a
            cápsula era o que separava a logo do fundo. Sobre a capa esse papel é
            do véu (`.accel-card__veu`), que é contínuo e cobre a coluna inteira —
            duas camadas de separação empilhadas leem como moldura solta.

            Com isto o `tone` deixa de ser lido por este componente — o eco da
            logo acendia com o ciano e o azul FIXOS da marca, não com a cor do
            item (e desde 21/09 nem eco existe: ver o bloco logo abaixo). A
            conclusão não muda, só ficou mais forte. O campo fica no dado
            porque `/sistran-labs` o consome; apagá-lo dali seria mexer numa rota
            fora do escopo. O que saiu daqui foi acabamento, não informação. */}
        <div className="accel-logo">
          {/* `sizes` casado com o TETO da caixa, que a SIS-216 mudou: a placa
              deixou de ter largura máxima própria e passou a ser limitada pela
              coluna de texto — 48% dos 1116px do destaque (536px) e 60% dos 548px
              da coluna dos seis (329px). Era `256px`, de quando o teto era
              `min(18rem, 76%)` menos 1rem de padding de cada lado. O número
              acompanha `.accel-logo` e não vive sozinho.

              RESSALVA DE SEMPRE (SIS-139 / `docs/images-unoptimized.md`): com
              `images: { unoptimized: true }` no `next.config.mjs` o `next/image`
              não emite `srcset`, então este `sizes` hoje não produz efeito
              nenhum. Ele fica correto para o dia em que `unoptimized` sair, e
              ninguém deve lê-lo como otimização ativa. */}
          {/* SIS-216 — O ECO SAIU DO DOM, por pedido literal da issue: a segunda
              cópia da logo acendia no hover e o que se quer é a MESMA logo vindo
              para frente, sem duplicata. O hover agora escala e sobe
              `.accel-logo__img` (números e derivação no CSS, ao lado da regra).

              Foi removido o NÓ, e não só a regra de CSS: como é o mesmo `src` da
              logo da frente, deixá-lo escondido manteria um `<Image>` que o
              navegador baixa e decodifica duas vezes para nada — e uma regra de
              ocultação é o que o próximo a passar por aqui apaga «porque não faz
              nada», trazendo a duplicata de volta. Nada de acessibilidade se
              perde: era `aria-hidden` sobre arte que já é `alt=""`.
              O markup, na íntegra, para o caso de o efeito voltar em outro lugar:

              <span className="accel-logo__eco" aria-hidden>
                <Image
                  src={a.logo}
                  alt=""
                  width={a.logoWidth}
                  height={a.logoHeight}
                  sizes="(min-width: 1180px) 536px, 329px"
                  className="accel-logo__eco-img"
                />
              </span>
          */}
          <Image
            src={a.logo}
            alt=""
            aria-hidden
            width={a.logoWidth}
            height={a.logoHeight}
            sizes="(min-width: 1180px) 536px, 329px"
            className="accel-logo__img"
          />
        </div>
      {/* SIS-216 — O ORDINAL «01…07» SAIU, por pedido explícito da issue
          («remoção completa das numerações»), e com ele foi o
          `justify-between` da linha: a placa da logo era a única outra coisa
          nesta faixa. O nó era este, na íntegra:

              <span
                aria-hidden
                className="font-mono font-semibold text-3xl leading-none"
                style={{
                  color: 'rgba(255,255,255,0.30)',
                  fontVariantNumeric: 'tabular-nums',
                  fontFeatureSettings: '"tnum" 1',
                }}
              >
                {String(index + 1).padStart(2, '0')}
              </span>

          …com as duas notas da SIS-155 que o acompanhavam (ordinal é metadado,
          logo `font-mono`; e `font-semibold` explícito porque é o único corte da
          Geist Mono carregado). As duas continuam valendo para qualquer ordinal
          que volte a existir em outro lugar — por isso ficam escritas aqui e não
          se perdem com o nó. A prop `index` do componente saiu junto: ela servia
          só a este número.

          O 76% de `max-width` da placa em `accelerators.css` era «o que o ordinal
          permite»; sem ordinal aquele teto mudou, e a nota de lá foi reescrita. */}

      {/* 11/09 — O TÍTULO SAIU DA TELA, NÃO DO DOCUMENTO. A usuária pediu o card
          só com a logo; o `<h3>` fica em `sr-only`, e é isso que separa esconder
          de apagar:
          · o esqueleto de cabeçalhos não perde um nível — a seção é `<h2>
            Soluções` e cada card segue sendo um `<h3>` na navegação por títulos,
            que é como se percorre uma lista de sete produtos sem ler tudo;
          · a logo continua decorativa (`alt=""` + `aria-hidden`), então o nome é
            anunciado UMA vez, pelo título, e não duas (WCAG H67);
          · `scripts/copy-lock.mjs` conta nós de texto do JSX — o nome continua
            escrito aqui, então a régua de copy não se mexe. Apagar a linha
            obrigaria a destravar o lock por uma mudança que é só visual.
          ALTERNATIVA DESCARTADA: remover o `<h3>` e passar `alt={a.name}`. Devolve
          o nome ao leitor de tela, mas custa o cabeçalho, e card sem título vira
          bloco anônimo no sumário do documento. */}
      <h3 className="sr-only">{a.name}</h3>
      {/* SIS-216 — O FILETE SAIU. Ele era um substituto gráfico para a tagline
          que o site não escreve, e existia num card que era só placa + texto. A
          proposta desta issue não o tem, e sobre a foto ele lê como risco solto.
          O nó era:

              <span
                aria-hidden
                className="relative mt-6 block h-px w-10 rounded-full"
                style={{ background: a.tone, transform: 'translateZ(18px)' }}
              />

          `translateZ` — dele e dos dois nós seguintes — foi embora pelo mesmo
          motivo do tilt: sem `perspective` no pai, profundidade em Z não tem para
          onde projetar. */}
      <p className="accel-card__texto">{a.description}</p>
      {/* SIS-216 — O RÓTULO PASSOU A SER «Conheça a solução», alinhado à proposta.
          Era `Conheça o {a.name}`, escolhido quando o card não tinha CTA na
          origem. A frase não é invenção desta issue: ela já é copy do site, no
          card de `/sistran-labs` (`copy-lock.json` → `src/app/sistran-labs/page.tsx:10`).
          O lock foi regravado de propósito, não contornado — ver o comentário da
          issue.

          O NOME DO PRODUTO CONTINUA NO LINK, em `sr-only`: sete links com o mesmo
          texto visível são sete destinos indistinguíveis para quem navega pela
          lista de links (WCAG 2.4.4). `aria-label` resolveria, mas substituiria o
          rótulo inteiro e desacoplaria o que se lê do que se ouve. */}
      <Link href={`/solucoes/${a.id}`} className="accel-card__cta">
        Conheça a solução<span className="sr-only"> {a.name}</span>
        <span aria-hidden>&rarr;</span>
      </Link>
      </div>
    </article>
    </motion.div>
  );
}

export default function Accelerators() {
  const rm = useReducedMotion();
  return (
    /* SIS-93 — o fundo azul claro é a MESMA classe que a Consultoria usa
       (`section-light section-light-blue`, definida uma única vez no
       globals.css), não uma cópia dos valores de gradiente. A textura de grade e
       a vinheta de borda vêm de brinde nos pseudo-elementos de `.section-light`,
       que é o que evita linha dura na emenda com as seções escuras vizinhas. */
    <section
      id="tecnologia-disruptiva"
      className="section-light section-light-blue section-py relative overflow-hidden"
    >
      {/* z-0 e não -z-10: `.section-light` traz `isolation: isolate` e o fundo
          agora é desta própria section — um z negativo jogaria os orbs para trás
          dele. Mesmo arranjo da Consultoria. O ciano substitui o violeta
          `#A78BFA`: a paleta da marca é branco + azuis. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute left-0 top-32 h-[380px] w-[380px] rounded-full bg-[#0079CB]/[14%] blur-[130px]" />
        <div className="absolute right-0 bottom-32 h-[420px] w-[420px] rounded-full bg-[#0ed8f6]/[12%] blur-[130px]" />
      </div>

      <div className="container-lp relative z-10">
        <motion.div
          variants={vHeader}
          initial={rm ? false : 'hidden'}
          whileInView="visible"
          viewport={VP}
          className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
        >
          <div className="accel-cabeca max-w-2xl">
            {/* Sobretitulo e titulo como no site: "Tecnologia Disruptiva" /
                "Soluções". O paragrafo é verbatim.

                SIS-280 — A TAG TEXTUAL SAIU E ENTROU O CARIMBO, que é o padrão das
                outras rotas (`/parceiros-e-implementacoes`, `/sistran-labs`). A linha
                anterior, para reverter:

                    <motion.span variants={vSubtitle} className="tag-section">
                      Tecnologia Disruptiva
                    </motion.span>

                O `motion.span` do sobretítulo desapareceu junto porque o carimbo TEM a
                própria entrada em cena — a batida do `CarimboBatida` — e embrulhá-lo no
                `vSubtitle` do cabeçalho faria duas animações disputarem o mesmo
                `transform`, que é o defeito que a SIS-216 nomeou nos cards.

                A ARTE É A GENÉRICA DA SISTRAN, indicada pela dona do conteúdo:
                `public/images/carimbo-disruptiva-ticket-outline-0757c7.png` (723x273).
                NÃO é cápsula de produto — reusar a de Match AI ou Guru marcaria esta
                seção, que é a vitrine dos sete aceleradores, com o nome de um deles.

                `gatilho="viewport"` e não `"rota"`: esta seção vive muito abaixo da
                dobra de `/solucoes`, e bater na montagem significaria assentar o
                carimbo fora de quadro — quem rolasse até aqui nunca veria a batida. É a
                mesma razão medida no item 2 da SIS-188.

                `alt` vazio porque o `h2` ao lado já diz o assunto da seção e o texto do
                carimbo («Tecnologia Disruptiva») é a etiqueta que ele substitui, não
                informação nova: lido, viraria repetição para quem usa leitor de tela. */}
            {/* O CARIMBO À ESQUERDA E O `h2` AO LADO, na mesma linha — antes eles
                eram irmãos diretos de `.accel-cabeca` e a manchete caía EMBAIXO da
                arte. O invólucro é uma linha flex (`.accel-cabeca-linha`, na folha
                do componente), e não `float` nem grade: são duas peças, uma de
                largura fixa e uma que ocupa o resto.

                A largura do carimbo NÃO se mexe: `--carimbo-batida-w` continua
                declarada em `.accel-cabeca .accel-cabeca-carimbo`, e o seletor
                segue valendo porque o invólucro é DESCENDENTE de `.accel-cabeca`,
                não um novo escopo. */}
            <div className="accel-cabeca-linha">
              <CarimboBatida
                src="/images/carimbo-disruptiva-ticket-outline-0757c7.png"
                alt=""
                larguraIntrinseca={723}
                alturaIntrinseca={273}
                className="accel-cabeca-carimbo"
                gatilho="viewport"
              />
              {/* SIS-280 — `font-bold` ENTROU. A linha anterior era:
                    className="mt-3 font-display text-section text-ink"
                A manchete pedia negrito por escrito no item 3 da issue, e o peso
                resolvido era 400 (a `text-section` não traz peso). É o mesmo degrau que
                `/sistran-labs` recebeu na SIS-216 — as manchetes da casa engrossam
                  juntas, senão uma em 700 e a outra em 400 lê como descuido.

                  O `mt-3` SAIU: ele era o respiro entre a arte EMPILHADA e a
                  manchete, e agora as duas estão lado a lado — a folga passou a ser
                  o `gap` da linha flex. */}
              <motion.h2 variants={vTitle} className="font-display font-bold text-section text-ink">
                Soluções
              </motion.h2>
            </div>
            <motion.p variants={vSubtitle} className="mt-4 text-lg leading-relaxed text-ink-muted">
              Desenvolvemos aceleradores para entregar os melhores resultados,
              &ldquo;ouvimos seu desafio&rdquo;, fazendo Discovery para seu negócio, desenhando uma
              solução personalizada entregando resultados assertivos com excelência.
            </motion.p>
            <motion.p
              variants={vSubtitle}
              className="mt-3 text-lg font-semibold leading-relaxed text-ink"
            >
              Conheça nossos aceleradores:
            </motion.p>
          </div>
          {/* SIS-280 — O SELO DE CONTAGEM SAIU. Ele era, verbatim:

                {/* Mesmo selo da Consultoria: sobre azul claro, borda e texto brancos
                    sumiriam. *\/}
                <span className="inline-flex h-fit items-center gap-2 rounded-full border border-[#0079CB]/[22%] bg-white/70 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0060a8]">
                  {ACCELERATORS.length} aceleradores
                </span>

              O item 2 da issue pede «tirar N aceleradores», e o número saía de
              `ACCELERATORS.length` — ou seja lia «7 aceleradores» hoje e mudaria sozinho
              amanhã. `ACCELERATORS` continua importado: `ORDEM_VISUAL` é montado a
              partir dele logo no topo do arquivo.
              O `md:justify-between` do cabeçalho fica onde está: sem o segundo filho ele
              não faz nada, e removê-lo é mexer no arranjo que esta issue põe fora de
              escopo. */}
        </motion.div>

        <motion.div
          variants={vGrid}
          initial={rm ? false : 'hidden'}
          whileInView="visible"
          viewport={VP}
          /* SIS-216 — DUAS COLUNAS, e não três, com a Lumina AI ocupando a linha
             inteira (`.accel-item--destaque` faz o `grid-column: 1 / -1` na
             folha). Era `auto-rows-[minmax(300px,1fr)] … lg:grid-cols-3`: a altura
             mínima saiu porque o card deixou de ser uma coluna de texto alta e
             passou a ser uma faixa larga — a altura agora vem de
             `.accel-card` e é diferente no destaque e nos seis. O `1fr` das
             linhas também saiu: com o destaque ocupando uma linha própria, igualar
             as alturas de TODAS as linhas esticaria os seis à altura dele. */
          className="accel-grade grid grid-cols-1 gap-5 sm:grid-cols-2"
        >
          {ORDEM_VISUAL.map((a) => (
            <AccelCard key={a.id} a={a} destaque={a.id === ID_DESTAQUE} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
