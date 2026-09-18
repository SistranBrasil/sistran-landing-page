import type { CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
/* `CalendarDays`, `Layers` e `Users` saíram do import junto com os três ícones de
   traço que eles desenhavam nos cartões de `#university-numeros` — a arte agora é
   a entregue em `public/images/university/icones`. A linha anterior era:
     import { ArrowRight, ArrowUpRight, CalendarDays, Layers, Users } from 'lucide-react';
   `ArrowRight` SAIU TAMBÉM, na 4ª volta: a seta dos cartões de turma foi retirada
   a pedido (ver a nota no `<li>`) e era o último `ArrowRight` VIVO da rota — o de
   `#university-numeros` já tinha saído antes e só existe dentro de um comentário
   JSX, que não é uso. Import não usado é erro de lint, não sobra inofensiva. Era:
     import { ArrowRight, ArrowUpRight } from 'lucide-react';
   `ArrowUpRight` fica: é a pílula do ESG. */
import { ArrowUpRight } from 'lucide-react';
import PageShell from '@/components/PageShell';
import PageHero from '@/components/PageHero';
import HeroImageBackdrop from '@/components/ui/HeroImageBackdrop';
import ContactCTA from '@/components/ContactCTA';
import RevealScope from '@/components/motion/RevealScope';
import { CountUp } from '@/components/primitives/CountUp';
/* SIS-289 — o calibre do reveal DESTA ROTA, num import só (o arquivo reexporta o
   par canônico de `src/lib/reveal-calibre.ts`). Ler o docblock de lá antes de
   mudar qualquer número daqui. */
import { LIMIAR_REVEAL, MARGEM_REVEAL } from './reveal-calibre';
/* SIS-283 — AS SEIS LINHAS DE IMPORT ACIMA NÃO SÃO DESTA ISSUE: a árvore de
   trabalho já chegava com `#university-numeros` reescrito (RevealScope, CountUp,
   ícones, `CSSProperties`) e SEM os imports, isto é, com a rota não compilando —
   13 erros TS2304 medidos antes de qualquer alteração minha. Sem isto a rota nem
   renderiza, e a issue pede captura do fecho a 1440. Foram declarados os símbolos
   que o corpo já usava, nada mais: nenhuma linha de `#university-numeros` foi
   tocada, e a mudança da SIS-283 é uma só, no `<ContactCTA>` do fim do arquivo. */

export const metadata = {
  title: 'Sistran University · Sistran',
};

/* SIS-116 — A PÁGINA DEIXA DE SER SÓ A ABERTURA, e nenhuma palavra foi escrita
   para isso. A fonte (`.claude/conteudo-site/03-sistran-university.md`) publica
   dois parágrafos e uma galeria, e é a página mais curta do site. O que estava
   feito era o texto inteiro — os dois parágrafos, dez linhas de corpo — enfiado
   dentro da `description` da abertura, onde cabe uma frase.

   O que mudou é DISTRIBUIÇÃO, não conteúdo. As quatro frases do primeiro
   parágrafo e a do segundo continuam aqui, na íntegra, e cada uma foi para um
   lugar:
   • a abertura fica com a última frase do 1º parágrafo ("Somos um verdadeiro
     banco de talentos..."), que é a única que se sustenta sozinha como apoio do
     título — é afirmação de posição, não descrição de programa;
   • as três primeiras frases descem para duas seções;
   • o 2º parágrafo virou indicadores, porque é onde estão os três dados.
   Nada foi repetido em dois lugares: a frase que subiu para a abertura NÃO
   aparece de novo nas seções (foi o defeito medido na SIS-120).

   OS TÍTULOS DAS SEÇÕES SAEM DO TEXTO QUE EXISTE, como o ponto de atenção da
   issue exige — são trechos contíguos e literais dos parágrafos, com só a
   primeira letra em maiúscula:
   • "Formar especialistas em tecnologia de ponta" — de "...dedicado a FORMAR
     ESPECIALISTAS EM TECNOLOGIA DE PONTA e desenvolvimento de sistemas."
   • "Em parceria com o Unidep" — abre a 2ª frase, literal.
   • "Desde 2022, já formamos" — abre o 2º parágrafo, literal.
   Nenhum deles é headline nova; se um dia a fonte mudar, o título muda com ela.

   A FRASE AGRAMATICAL NÃO FOI CORRIGIDA. "O Sistran University, programa de
   capacitação intensiva da Sistran, dedicado a formar..." não tem verbo
   principal, a própria fonte marca isso, e agora ela abre uma seção em vez de
   ficar escondida no meio de dez linhas — quer dizer que fica MAIS visível.
   Ainda assim é texto publicado: reescrevê-la é decisão de quem responde pelo
   conteúdo, não minha. Registrado na issue como ponto parado.

   O QUE DESTA DISTRIBUIÇÃO JÁ NÃO VALE, e quem lê este bloco precisa saber antes
   de "restaurar" algo com base nele: a SIS-281 tirou o par «Autossuficiência em
   capacitação de recursos» da capa, e três pedidos seguidos no chat acabaram
   deixando a seção «O PROGRAMA» com o par como TÍTULO (`h2`), a frase agramatical
   como transcrição logo abaixo dele, e SEM as duas escritas que a distribuição
   acima colocava ali — o título «Formar especialistas em tecnologia de ponta» e a
   frase «Somos um verdadeiro banco de talentos…» foram RETIRADAS da rota, a
   pedido, e estão comentadas no lugar de onde saíram, com o motivo.
   Então: das quatro frases do 1º parágrafo, uma saiu; e a regra «nada foi repetido
   em dois lugares» continua verdadeira, porque foi justamente a repetição que o
   último pedido removeu. O 2º parágrafo e os indicadores não foram tocados.

   Fonte: .claude/conteudo-site/03-sistran-university.md */

/* SIS-116 · item 3 — os três dados do 2º parágrafo como INDICADOR. O `valor` e o
   `texto` de cada um são a mesma frase da fonte partida em dois pedaços
   contíguos: "já formamos MAIS DE 60 | ESPECIALISTAS COM MENTALIDADE INOVADORA,
   QUE APRENDEM NA PRÁTICA e acumulam experiência em MAIS DE 17 | PROJETOS REAIS
   PARA O MERCADO DE SEGUROS". Só o conectivo ("e acumulam experiência em") ficou
   de fora, e ele não carrega informação nenhuma.
   O ano NÃO virou cartão, e é decisão, não esquecimento: "2022" é data, não
   quantidade, e um cartão com o número grande "2022" e o rótulo "Desde" embaixo
   lê pior que a frase. Ele fica no `<h2>` da seção — "Desde 2022, já formamos" —,
   que é o lugar de maior destaque tipográfico da seção inteira, então o dado
   continua legível como indicador. */
/* SIS-284 — A CONST SAIU DE CENA, e o parágrafo acima explica por quê ela existia:
   ela alimentava DOIS cartões de vidro sobre navy. A referência da issue pede TRÊS
   cartões brancos com anatomia diferente entre si (o do meio tem faixa inferior e
   seta), então um `map` sobre dados uniformes deixaria de descrever o que está na
   tela — os três cartões passaram a ser escritos por extenso na seção.
   As duas linhas eram exatamente estas:
     const NUMEROS = [
       { valor: 'mais de 60', texto: 'especialistas com mentalidade inovadora, que aprendem na prática' },
       { valor: 'mais de 17', texto: 'projetos reais para o mercado de seguros' },
     ] as const;
   O ANO PASSOU A SER CARTÃO, contra o que o parágrafo acima decidiu na SIS-116 — e
   é a referência que manda: `public/imagensexemplo/university.png` mostra «DESDE /
   2022» como primeiro dos três. O argumento da SIS-116 (data não é quantidade)
   segue valendo em UM ponto e ele foi respeitado: 2022 NÃO recebe o contador
   animado que 60 e 17 recebem. */

/* SIS-116 · item 4 — AS FOTOS SÃO AS DO GERANDO TALENTOS, reaproveitadas. É o
   mesmo programa: a página de ESG o publica como "Projeto Gerando
   Talentos/Sistran University", e a observação da fonte é exatamente que as duas
   páginas contam a mesma iniciativa sem se referenciarem. Pedir asset próprio
   seria pedir foto nova das mesmas turmas.
   Os arquivos já são `.webp` convertidos na SIS-109 (41/67/56 KB nos 750×422
   nativos, originais guardados em `docs/fontes/esg/`, fora de `public/`), então
   ESTA GALERIA não acrescenta um byte ao que o site já baixa — e não há conversão
   a fazer. (A frase valia para a rota inteira até a SIS-248, que trouxe a capa da
   abertura: hoje a rota baixa os 133 KB de `university-hero.webp`, e só eles.)
   O `alt` foi REESCRITO para esta página, e não copiado de `/esg`: lá a foto
   prova um projeto social, aqui ela mostra quem o programa de capacitação
   formou. O mesmo `alt` em duas rotas descreveria o contexto errado numa delas —
   é o ponto de atenção da issue. */
/* SIS-285 — AS FOTOS SÃO AS MESMAS (a issue proíbe trocá-las) e os `alt` também:
   eles descrevem quem a foto mostra, e isso não mudou. O que mudou é a LEGENDA
   VISÍVEL, que a referência escreve como rótulo + subtítulo em vez de uma linha
   só. A chave antiga era `legenda: '1ª turma'`; hoje são duas:

     legenda: '1ª turma'   →   titulo: '1ª TURMA' + subtitulo: 'Formação prática'

   `titulo`/`subtitulo` e não `rotulo`/`apoio`, e isto NÃO é gosto: quem extrai a
   escrita desta rota para o `copy-lock` é `scripts/copy-lock.mjs`, e em `src/app`
   ele só lê nós de texto do JSX e a lista DECLARADA de `PROPS_DE_TEXTO` — onde
   `titulo` e `subtitulo` estão e `rotulo`/`apoio` não. Como estas seis frases são
   renderizadas por expressão (`{t.titulo}`), e não como texto literal no JSX,
   nomear a chave fora da lista tiraria as legendas do lock sem quebrar nada
   visível: escrita na tela e invisível para o portão da Regra Zero. `legenda`
   também está na lista, e é por isso que a chave antiga era rastreada.
   `destaque` marcava o cartão do meio da referência. Na 3ª volta o destaque virou
   ESTADO DE HOVER, disponível para os três, e a classe que esta chave liga deixou
   de pintar qualquer coisa (as regras estão comentadas no CSS, junto do motivo). A
   chave fica porque é o interruptor pronto se um dia voltar a existir um cartão
   marcado em repouso; apagá-la agora obrigaria a reescrever o `map` também. */
const TURMAS = [
  {
    src: '/images/esg/1-turma-Gerando-Talentos.webp',
    alt: 'Formandos da 1ª turma do Sistran University reunidos na formatura',
    titulo: '1ª TURMA',
    subtitulo: 'Formação prática',
    destaque: false,
  },
  {
    src: '/images/esg/2-turma-Gerando-Talentos.webp',
    alt: 'Formandos da 2ª turma do Sistran University reunidos na formatura',
    titulo: '2ª TURMA',
    subtitulo: 'Tecnologia • Seguros • Experiência real',
    destaque: true,
  },
  {
    src: '/images/esg/3-turma-Gerando-Talentos.webp',
    alt: 'Formandos da 3ª turma do Sistran University reunidos na formatura',
    titulo: '3ª TURMA',
    subtitulo: 'Novas trajetórias',
    destaque: false,
  },
] as const;

export default function Page() {
  return (
    <PageShell>
      {/* SIS-248 — a abertura ganha CAPA, e só a moldura mudou: `title`,
          `highlight` e a descrição são os mesmos caracteres de antes (a escrita
          está travada em `copy-lock.json`, e a issue pede a capa, não texto novo).
          `alt=""`: a arte é decorativa. O que ela desenha — capelo, engrenagem,
          livro aberto, escada e certificado — é ilustração do que o `h1` e o
          parágrafo logo abaixo já dizem em palavras; descrevê-la faria o leitor de
          tela ouvir a mesma ideia duas vezes, uma delas em forma de inventário de
          ícones. Mesmo critério da capa do Labs (SIS-227).
          A fonte é o PNG de 1,9 MB (`universitycapa.png`, que fica no repositório
          como original); o que a rota serve é a derivada WebP de 133 KB. Não é
          zelo: `images.unoptimized` está ligado no `next.config`, então o
          `next/image` entrega o arquivo EXATAMENTE como está em `public/` — servir
          o PNG aqui colocaria 1,9 MB no caminho do LCP.
          O recorte e o véu ficam escopados em `.hero-backdrop--university`, porque
          a composição empilha tudo à direita do quadro e o texto vive à
          esquerda. */}
      <HeroImageBackdrop
        src="/images/university/university-hero.webp"
        alt=""
        className="hero-backdrop--university"
      >
        {/* SIS-281 — a CAPA passa a dizer o NOME DA PÁGINA, em negrito. A chamada
            anterior era exatamente esta:

              <PageHero
                title="Autossuficiência em"
                highlight="capacitação de recursos"
                description={
                  <p>
                    Somos um verdadeiro banco de talentos de primeira linha, prontos para atender às
                    demandas específicas da sua seguradora com as mais avançadas tecnologias.
                  </p>
                }
              />

            Nada daquele texto foi reescrito: os três pedaços MUDARAM DE LUGAR
            para `#university-abertura`, logo abaixo — o `title` e o `highlight`
            viraram o `h2` (mesmo par de palavras, mesmo realce ciano) e a
            descrição virou o lead da seção. A escrita está travada em
            `copy-lock.json`, cuja comparação é POR VALOR com multiplicidade
            (`scripts/copy-lock.mjs`), e por isso mover não mexe no travamento: o
            único delta legítimo desta issue é «Sistran University» passando de
            1× para 2× (a outra ocorrência é o `<strong>` do parágrafo do
            Programa), e é o nome da página, que já era o `metadata.title`.

            `tituloForte`: prop opt-in escrita nesta issue no `PageHero` — ver o
            docblock dela lá. É a mesma exceção de peso que a SIS-282 abriu para
            os `h2` desta rota, e vale só aqui: as outras treze rotas continuam
            com a manchete em 400. */}
        <PageHero title="Sistran University" tituloForte />
      </HeroImageBackdrop>

      {/* A SEÇÃO PRÓPRIA DA SIS-281 SAIU DE CENA, a pedido: a mesma escrita passou a
          viver DENTRO de «O PROGRAMA», logo abaixo. O bloco que estava aqui era
          exatamente este:

            <section
              id="university-abertura"
              aria-labelledby="university-abertura-titulo"
              className="section-py university-abertura"
            >
              <div className="container-lp university-abertura-escrita">
                <h2
                  id="university-abertura-titulo"
                  className="font-display text-section tracking-tight text-white"
                >
                  Autossuficiência em{' '}
                  <span className="text-[#A5F0FF]">capacitação de recursos</span>
                </h2>
                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/85">
                  Somos um verdadeiro banco de talentos de primeira linha, prontos para atender às
                  demandas específicas da sua seguradora com as mais avançadas tecnologias.
                </p>
              </div>
            </section>

          O MOTIVO de sair: a SIS-281 mandou o bloco «virar seção logo abaixo do
          hero», e o pedido posterior é mais específico — a escrita tem de ficar
          JUNTO da do Programa, num capítulo só. Duas seções seguidas dizendo a
          mesma coisa em dois registros (uma escura anunciando o banco de talentos,
          outra clara anunciando a formação de especialistas) é o que o pedido
          desfaz. Nada da escrita mudou de caractere ao mudar de lugar pela segunda
          vez; o que mudou foi a hierarquia — ver o `h3` no bloco do Programa.

          O QUE ISSO ARRASTA, e está escrito lá: `.university-abertura` e
          `.university-abertura-escrita > h2` ficam comentadas no `globals.css`
          (com a costura navy de 7rem, que perdeu função: não há mais seção escura
          encostando na capa — quem encosta é a folha clara do Programa, e ela
          segura a própria emenda pela sangria da SIS-93). E `.university-unidep`
          MANTÉM o `background: var(--fundo-marca)` desta rodada, com a
          justificativa reescrita: sem a seção extra a paridade volta ao que era,
          então a regra não é mais necessária POR PARIDADE — ela fica porque
          superfície declarada não depende de quantas seções existem antes. */}

      {/* SIS-280 — a seção do programa deixa de ser FUNDO ESCURO com texto por
          cima e passa à composição de `public/imagensexemplo/exemploprograma.png`:
          folha clara com grade, escrita à esquerda, arte à direita num quadro
          inclinado de borda ciano.

          O QUE ISSO DESFAZ, e por quê. A SIS-249 tinha posto a arte em `fill`
          `inset: 0` sobre a seção inteira, com véu e pluma comprando contraste
          para texto BRANCO sobre uma arte que é clara de ponta a ponta. Era a
          resposta certa para "a arte é o fundo"; deixa de ser a pergunta. Com a
          arte virando FIGURA num quadro próprio, o texto sai de cima dela e o
          contraste passa a vir da superfície clara da casa (`.section-light`), que
          já traz a grade de 96px e os overrides de tinta navy. Nenhum véu, nenhuma
          pluma, nenhuma dissolução: as três camadas foram removidas do
          `globals.css` junto com a passagem navy que a SIS-248 escrevia em
          `.hero-backdrop--university + section` — sobre folha clara ela seria a
          faixa escura que a issue proíbe.

          `alt=""` FICA, e pelo mesmo motivo da SIS-249: a arte desenha os quatro
          painéis do programa (Qualidade/QA, Desenvolvimento, Dados & IA, Cloud &
          Automação) em volta de três pessoas trabalhando — é o que o `h2` e o
          parágrafo dizem em palavras. Virar figura não a tornou informativa;
          descrevê-la faria o leitor de tela ouvir "QA, desenvolvimento, dados,
          cloud" duas vezes. Sem `<figure>`/`<figcaption>` pela mesma razão: não há
          legenda a escrever para uma ilustração do texto ao lado. E o quadro não é
          interativo — nada de `tabIndex`, `role` ou `onClick`: o hover é enfeite,
          e um alvo que ganha foco sem ter destino é pior que nenhum.

          O QUE A ROTA SERVE CONTINUA SENDO A DERIVADA WEBP de 114 kB
          (`scripts/otimizar-programa-university-sis249.mjs`); o PNG de 1,9 MB
          (`1-Sistran-university.png`) fica no repositório como fonte para regerar.
          Com `images.unoptimized` ligado no `next.config`, o `next/image` entrega
          o arquivo exatamente como está em `public/` — o PNG aqui seriam 1,9 MB na
          rota.

          Sem `preload`/`fetchPriority`: a seção nasce abaixo da dobra (a capa
          ocupa a primeira tela inteira), então o `lazy` padrão é o certo — e
          `priority` está deprecado no Next 16 em favor de `preload`
          (`node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md`). */}
      <section
        id="university-programa"
        aria-labelledby="university-programa-titulo"
        className="section-py section-light university-programa"
      >
        {/* Os acentos geométricos da referência (dois quadrados pálidos e duas
            manchas de pontilhado). Nó próprio porque os DOIS pseudo-elementos da
            seção já pertencem a `.section-light` — a grade e o pontilhado dela —,
            e escrevê-los aqui apagaria a grade. */}
        <span aria-hidden className="university-programa-acentos" />
        {/* SIS-289 — O ESCOPO DO REVEAL É A GRADE, e o `RevealScope` OCUPA O LUGAR
            da `<div className="container-lp university-programa-grade">` que estava
            aqui: mesmo `className`, nenhum nó novo. É o molde de `/contato` (o
            escopo é o container que já existia), e importa que seja a grade e não
            a seção — o observador precisa medir a caixa da COLUNA, que é o que
            entra na tela, e não a seção inteira com o seu recuo vertical.

            Sem `esperarRota`: esta é a segunda seção da rota e nasce abaixo da
            dobra — ver o contrato em `./reveal-calibre.ts`. */}
        <RevealScope
          className="container-lp university-programa-grade"
          limiar={LIMIAR_REVEAL}
          margem={MARGEM_REVEAL}
        >
          <div className="university-programa-escrita">
            {/* O rótulo técnico da referência: traço ciano + palavra em caps.
                `.eyebrow--traco` é o modificador que a SIS-261 escreveu para
                exatamente este desenho, e ele já tem variante de fundo claro
                (traço em degradê a partir de `#0079cb`, palavra em `#024e86`) —
                rótulo novo aqui seria um segundo dialeto para a mesma coisa. */}
            {/* O rótulo em UMA LINHA, e continua assim de propósito: o extrator do
                `copy-lock` lê o nó de texto JSX, e quebrar a linha aqui mudaria o
                nó por indentação — artefato de tokenização entrando como delta de
                escrita, que é o que a Regra Zero manda não fazer.
                `fade` e não `fade-up`: o rótulo é o traço ciano do `::before` mais
                a palavra, e subir o par de 24px lê como a régua se descolando. */}
            <span className="eyebrow eyebrow--traco" data-reveal="fade">O PROGRAMA</span>
            {/* SIS-282 — `font-bold` ENTROU. A linha antiga era exatamente esta:

                  className="mt-5 font-display text-section text-ink"

                Peso REAL, não sintetizado, e isto precisa ser dito porque o
                projeto normalizou o display para 400 (SIS-155: 73 pontos de JSX
                perderam `font-bold`/`font-black`) e declara `font-synthesis: none`
                em `html`. Nesse regime, pedir um peso sem corte carregado não
                engrossaria nada — o CSS mentiria e o texto continuaria fino. Aqui
                o corte existe: `layout.tsx` carrega a Geist Sans em 400/500/600/700,
                e o `<strong>` do parágrafo desta mesma seção já renderiza 700, o que
                a sonda usa como testemunha.
                Por que abrir exceção à assinatura de 400: o pedido é explícito e é
                de DOIS títulos de UMA rota, o mesmo caso do `h1` de `/contato`, que
                a SIS-155 registra como a única das quatorze aberturas com peso. A
                utilitária basta aqui (nada nesta rota fixa `font-weight` nestes
                `h2`, então não há regra sem camada para vencer — a de `/contato`
                mora no CSS por especificidade, não por política). */}
            {/* A ESCRITA QUE ERA DA CAPA (e, por uma rodada, de `#university-abertura`)
                chega aqui a pedido, e é ELA QUE TITULA a seção: «Autossuficiência em
                capacitação de recursos» é o `h2`, e a frase do «O Sistran
                University…» passou a ser a TRANSCRIÇÃO logo abaixo dele — foi o que
                o pedido pediu, nestas palavras. Na volta anterior desta mesma
                conversa a ordem era a inversa (o título era «Formar especialistas
                em tecnologia de ponta» e a Autossuficiência entrava como `h3`
                depois do parágrafo); o pedido seguinte trocou os dois de nível.

                Nenhum caractere mudou em nenhuma das quatro escritas desta coluna —
                mudaram o LUGAR e o NÍVEL. A comparação do `copy-lock` é por valor
                com multiplicidade (`scripts/copy-lock.mjs`), então trocar `h2` por
                `h3` não é evento de escrita.

                O `id` do título FICA sendo `university-programa-titulo`, e não é
                detalhe: ele é o `aria-labelledby` da `<section>` e o alvo de
                `#university-programa` no `ScrollSpy` (`src/data/pageSections.ts`).
                O nome da seção continua sendo o seu PRIMEIRO título — só que agora o
                primeiro título é este.

                O par de realce não muda de dialeto: `.university-programa-realce`
                é o acento desta folha clara, e é o que o `h2` já usava. O `#A5F0FF`
                que estas palavras tinham na capa NÃO vem com elas — foi escolhido
                para fundo escuro e sobre claro dá ~1,4:1. */}
            <h2
              id="university-programa-titulo"
              className="mt-5 font-display font-bold text-section text-ink"
              data-reveal="fade-up"
              style={{ '--reveal-i': 1 } as CSSProperties}
            >
              Autossuficiência em{' '}
              <span className="university-programa-realce">capacitação de recursos</span>
            </h2>
            {/* A TRANSCRIÇÃO, com «Sistran University» em destaque — o `<strong>`
                já estava aqui desde a SIS-280 e é peso REAL (700 da Geist Sans
                carregada no `layout.tsx`); a sonda usa justamente ele como
                testemunha de que `font-synthesis: none` não está engolindo o pedido.
                Sem `max-w-*`: a medida de leitura tem UM dono, e é
                `.university-programa-escrita` no `globals.css` — a coluna da
                grade no desktop, 42rem na pilha. Dois limites para a mesma linha
                é o que faz um deles virar mentira na primeira mudança de grade. */}
            <p
              className="mt-6 text-lg leading-relaxed"
              data-reveal="fade-up"
              style={{ '--reveal-i': 2 } as CSSProperties}
            >
              O <strong className="font-bold">Sistran University</strong>, programa de
              capacitação intensiva da Sistran, dedicado a formar especialistas em tecnologia de
              ponta e desenvolvimento de sistemas.
            </p>
            {/* O SEGUNDO TEMPO DO CAPÍTULO SAIU, a pedido. Era exatamente este:

                  <h3 className="mt-10 font-display font-bold text-2xl text-ink">
                    Formar especialistas em{' '}
                    <span className="university-programa-realce">tecnologia de ponta</span>
                  </h3>
                  <p className="mt-4 text-lg leading-relaxed">
                    Somos um verdadeiro banco de talentos de primeira linha, prontos para atender às
                    demandas específicas da sua seguradora com as mais avançadas tecnologias.
                  </p>

                Aqui NÃO é mudança de lugar como nas duas voltas anteriores: são
                duas escritas RETIRADAS da rota. Foi pedido no chat, e a Regra Zero
                pede que isso esteja escrito — `copy-lock.json` foi regenerado com o
                delta declarado, e o `h3` era, até a volta anterior, o `h2` que
                titulava esta seção (o `id` `university-programa-titulo` já estava no
                título de cima, então nada de acessibilidade ou de `ScrollSpy` fica
                pendurado neste nó).

                O par de palavras «Formar especialistas em tecnologia de ponta»
                continua DITO na rota, e não por acaso: é o fim da transcrição logo
                acima («…dedicado a formar especialistas em tecnologia de ponta e
                desenvolvimento de sistemas»). Era justamente a repetição que o
                pedido tira de cena. E a arte à direita não fica órfã de texto: ela
                ilustra os quatro painéis do programa que a transcrição resume.

                Se voltar, volta como `h3` — um `h2` a mais daria dois nomes à
                seção. */}
          </div>
          {/* Palco e quadro são dois nós porque são dois papéis: o palco guarda a
              `perspective` (ela tem de vir do PAI, senão cada transform abre a
              sua) e o quadro guarda a inclinação, a borda e o recorte. A arte
              cresce e desliza DENTRO do quadro no hover, e é o recorte do quadro
              que transforma isso em parallax em vez de em imagem escapando. */}
          {/* SIS-289 — A MARCA VAI NO PALCO E É `fade`, e as duas escolhas são a
              regra 3 da issue («`fade` onde `transform` no wrapper atrapalhe»)
              aplicada a este bloco.

              POR QUE NO PALCO, e não no quadro: o quadro é quem carrega a
              INCLINAÇÃO (`transform: rotateY(...) rotate(...)`) e a transita no
              hover em 0,55s. Marcá-lo daria dois donos ao mesmo `transform` — a
              colisão do SIS-42 e o «não misture os dois no mesmo elemento» do §6
              de `docs/scroll.md` —, e o pior é que a briga não seria visível: o
              `transform: none` do estado final do preset ENDIREITARIA o quadro
              para sempre, apagando o tilt que é o desenho da seção.

              POR QUE `fade`: o palco é quem guarda a `perspective` e o
              `transform-style: preserve-3d`, e a `perspective` do PAI é o que faz
              o giro do filho ler como 3D. Um `translate3d` de entrada no palco
              muda a origem dessa perspectiva enquanto a placa de sombra
              (`::before`, já girada) fica no lugar — a arte entraria desalinhada
              da própria sombra. Só opacidade não toca em nada disso.
              O palco não declara `transition` nenhuma (as do hover moram no quadro
              e nos pseudos), então o preset é quem escreve a dele — sem shorthand
              concorrente para apagá-la, que é o cuidado que os cartões do Unidep
              exigiram no `globals.css`. */}
          <div
            className="university-programa-palco"
            data-reveal="fade"
            style={{ '--reveal-i': 3 } as CSSProperties}
          >
            <div className="university-programa-quadro">
              <Image
                src="/images/university/university-programa.webp"
                alt=""
                /* Medidas nativas do arquivo (o WebP e o PNG de origem têm as
                   mesmas), para o navegador reservar a caixa antes do download —
                   sem `fill` não há mais caixa da seção a herdar, e sem elas o
                   texto ao lado salta quando a arte chega. */
                width={1672}
                height={941}
                /* A caixa medida: a 1440 a coluna da direita fecha em 568px; abaixo
                   de 1024 o quadro ocupa o container inteiro, cujo recuo lateral
                   muda em 640px (`px-5` → `sm:px-6`). (Hoje `sizes` não escolhe
                   arquivo nenhum — ver `docs/images-unoptimized.md`.) */
                sizes="(min-width: 64rem) 568px, (min-width: 40rem) calc(100vw - 3rem), calc(100vw - 2.5rem)"
                className="university-programa-arte"
              />
            </div>
          </div>
        </RevealScope>
      </section>

      {/* SIS-285 — A SEÇÃO DO UNIDEP PASSA À COMPOSIÇÃO DE
          `public/imagensexemplo/parceriauniversy.png`: campo navy com grade e
          traços de circuito, manchete de duas linhas (a primeira em ciano), lead
          curto, três cartões de turma com foto e a pílula do ESG no canto inferior
          esquerdo (a seta que a referência põe em cada cartão saiu na 4ª volta, a
          pedido). O cartão do meio nasceu em destaque, como na referência;
          na 3ª volta o destaque passou a ser o estado de hover de qualquer um dos
          três, a pedido — o desvio está registrado no comentário da issue.

          POR QUE ESTA SEÇÃO CONTINUA NAVY quando as duas vizinhas viraram folha
          clara (SIS-280 acima, SIS-284 abaixo): porque a referência é navy, e
          porque é isso que devolve a alternância da rota. Sem ela a página teria
          três superfícies claras encostadas — a grade de `.section-light` nasce e
          morre por máscara em cada seção, então o visitante veria a malha piscar
          três vezes numa chapa só. Aqui o escuro é o miolo entre duas claras, e é
          também o que faz os cartões de foto valerem: as três fotos são claras.

          O FUNDO SÃO DUAS CAMADAS, e nenhuma é nova: `.grade-tecnica` é a malha
          ciano da casa para seção ESCURA (a mesma de `/solucoes` e `/quem-somos`,
          com a máscara de entrada e saída que evita corte reto contra o azul), e o
          `<svg>` de circuito é o que a referência tem ALÉM da grade — quadrados e
          cotovelos de trilha. Escrever a malha de novo aqui, em pseudo-elemento,
          seria um segundo dialeto para a mesma coisa.
          O SVG é UM nó, e não os pseudos de `.university-*-acentos` das seções
          vizinhas, porque aqui os acentos não são só quadrados: são trilhas com
          cotovelo arredondado, e dois pseudo-elementos não desenham quatro
          caminhos. `preserveAspectRatio="xMidYMid slice"` mantém os quadrados
          QUADRADOS e recorta as sobras — é como a arte se comporta ao alargar a
          janela, e o contrário (`none`) esticaria cada quadrado num retângulo.
          `overflow-x-clip` e NÃO `overflow-hidden`: `hidden` cria contêiner de
          rolagem e a máscara `background-attachment: fixed` da grade deixaria de
          se ancorar na janela — mesma razão escrita em `/solucoes`.

          A MANCHETE QUEBRA PELA ESTRUTURA, não por `<br />` nem por coluna em
          `ch`: a referência põe «Em parceria com o Unidep,» em ciano na primeira
          linha e «treinamos nossos próprios talentos.» em branco na segunda — a
          quebra e a cor são a MESMA divisão. O realce é `display: block`, então a
          linha é consequência do que a frase já diz, e continua certa em qualquer
          corpo ou idioma. (Foi o caminho oposto ao da SIS-284 ali embaixo porque
          lá a quebra caía no MEIO de um trecho de uma cor só.)

          A ESCRITA MUDOU DE PROPÓSITO e a issue autoriza («reestruturar copy para
          a da referência; atualizar `copy-lock.json`»). O que mudou e o que não:
          • O TÍTULO deixa de ser «Em parceria com o Unidep» e passa a ser a frase
            inteira da referência, «Em parceria com o Unidep, treinamos nossos
            próprios talentos.» — que são as PRIMEIRAS PALAVRAS do parágrafo antigo,
            promovidas a manchete. Nenhuma palavra nova.
          • O LEAD é o RESTO do mesmo parágrafo, com dois cortes: «alinhados com as
            últimas tendências…» virou «Alinhados…» (maiúscula, porque agora abre
            frase) e «Com isso, contamos com um time de profissionais nativos
            digitais» virou «formamos profissionais nativos digitais» — é a redação
            da referência, e o fato (o time é formado por ela) não muda.
          • «(Centro Universitário de Pato Branco)» SAIU. É o único fato que a
            referência não carrega, e está registrado no comentário da issue: quem
            responde pelo conteúdo perde a expansão da sigla nesta rota. `/esg`
            continua a ter o programa por extenso.
          • AS SEIS LINHAS DAS TURMAS («1ª/2ª/3ª TURMA» + os três subtítulos) são
            escrita NOVA, tirada da referência e não do documento de conteúdo —
            também registrado na issue.

          A SIS-285 fechou SEM `RevealScope` aqui e escreveu o motivo: a issue dela
          não pedia entrada e o calibre da rota não existia. A SIS-289 é a issue de
          reveal desta rota — ela criou `./reveal-calibre.ts` e a seção passou a ter
          escopo, logo abaixo. O que segue valendo daquela nota é o resto do
          parágrafo: a galeria continua ESTÁTICA e não virou carrossel: as três fotos estão no
          DOM ao mesmo tempo, sempre, então nada se perde com movimento reduzido e
          não há controle de navegação a alcançar por teclado. A ordem é
          cronológica, como no projeto. */}
      <section
        id="university-unidep"
        aria-labelledby="university-unidep-titulo"
        className="section-py university-unidep relative overflow-x-clip"
      >
        {/* SIS-76 — a malha da casa para seção escura. Ver a nota em
            `.grade-tecnica` no `globals.css`. */}
        <div aria-hidden className="grade-tecnica" />
        {/* Os quadrados e as trilhas da referência. `aria-hidden` e sem `<title>`:
            é grafismo de atmosfera, não diagrama — não há informação a descrever.
            O `viewBox` É A ALTURA MEDIDA DA SEÇÃO (1440×857 a 1440 de largura,
            `docs/medidas/sis285-depois.json`) e não a moldura 16/9 da PNG: com
            `slice`, um `viewBox` mais baixo que a caixa faz a arte ser ampliada
            pela altura e recortada nos lados — na 1ª volta isso empurrava os
            quadrados das pontas (x = −14 e x = 1368) inteiramente para fora e
            levava o nó de cima para debaixo do cabeçalho fixo. Com o `viewBox` na
            proporção da caixa, a 1440 o mapeamento é 1:1.

            Nenhum grafismo nasce nos primeiros 120px: essa faixa é a que o
            cabeçalho fixo cobre quando a seção encosta no topo da janela. */}
        <svg
          aria-hidden
          className="university-unidep-circuito"
          viewBox="0 0 1440 857"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* As trilhas: cotovelo arredondado, degradê que morre nas pontas para a
              linha não terminar em corte seco. */}
          <defs>
            <linearGradient id="unidep-trilha" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0ed8f6" stopOpacity="0" />
              <stop offset="45%" stopColor="#0ed8f6" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0ed8f6" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M 1196 152 H 1300 Q 1320 152 1320 172 V 372"
            fill="none"
            stroke="url(#unidep-trilha)"
            strokeWidth="1.5"
          />
          <path
            d="M 940 792 H 1112 Q 1132 792 1132 772 V 676"
            fill="none"
            stroke="url(#unidep-trilha)"
            strokeWidth="1.5"
          />
          <path
            d="M 116 420 H 20"
            fill="none"
            stroke="url(#unidep-trilha)"
            strokeWidth="1.5"
          />
          {/* Os quadrados. Dois ACESOS (ciano da marca com halo, como na
              referência) e quatro pálidos: o aceso é evento, o pálido é textura.
              Os acesos ficam dentro de x 900–1200 porque essa é a faixa que
              sobrevive ao recorte lateral do `slice` também a 1024 de largura
              (ali a arte cresce ~4,7% e perde ~240px de cada lado). */}
          <rect
            x="1164"
            y="140"
            width="24"
            height="24"
            rx="5"
            fill="#0ed8f6"
            style={{ filter: 'drop-shadow(0 0 10px rgba(14, 216, 246, 0.75))' }}
          />
          <rect
            x="928"
            y="780"
            width="24"
            height="24"
            rx="5"
            fill="#0ed8f6"
            style={{ filter: 'drop-shadow(0 0 10px rgba(14, 216, 246, 0.75))' }}
          />
          <rect x="1338" y="248" width="34" height="34" rx="7" fill="#A5F0FF" fillOpacity="0.13" />
          <rect x="36" y="406" width="30" height="30" rx="6" fill="#A5F0FF" fillOpacity="0.12" />
          <rect x="24" y="600" width="44" height="44" rx="8" fill="#A5F0FF" fillOpacity="0.1" />
          <rect x="1356" y="672" width="30" height="30" rx="6" fill="#A5F0FF" fillOpacity="0.12" />
        </svg>

        {/* `relative` e nada mais: o empilhamento está resolvido no CSS
            (`.university-unidep-circuito` tem `z-index: 0`, este invólucro tem 1),
            porque `z-index` negativo aqui dependia de qual ancestral é contexto de
            empilhamento — e nesta rota o grafismo simplesmente não aparecia. */}
        {/* SIS-289 — o escopo é o miolo, e o `RevealScope` ocupa o lugar da
            `<div className="container-lp relative">` que estava aqui (mesmo
            `className`, nenhum nó novo). Fica FORA dele o que é fundo: a
            `.grade-tecnica` e o `<svg>` do circuito são atmosfera `aria-hidden`, e
            o §6 de `docs/scroll.md` é explícito quanto a não animar camada de fundo
            junto do conteúdo — a malha tem `background-attachment: fixed`, então
            qualquer opacidade de entrada nela leria como a seção piscando. */}
        <RevealScope
          className="container-lp relative"
          limiar={LIMIAR_REVEAL}
          margem={MARGEM_REVEAL}
        >
          {/* SIS-282 pôs `font-bold` no `h2` desta seção e o peso FICA — é o mesmo
              corte real (700) que a referência mostra. O que saiu foi
              `text-section` (a utility computa 65,6px nesta rota, corpo de
              abertura), trocada pelo `clamp` do `globals.css`: deixar as duas
              escreveria dois corpos no mesmo título, e a utility perderia por
              viver em `@layer utilities`. A linha anterior era:
                className="font-display font-bold text-section text-white" */}
          <h2
            id="university-unidep-titulo"
            className="university-unidep-manchete font-display font-bold"
            data-reveal="fade-up"
          >
            {/* AS DUAS LINHAS SÃO DOIS BLOCOS, e a segunda também é `<span>` de
                propósito: entre dois irmãos de bloco, o espaço que os separa no JSX
                não gera caixa nenhuma (não há box anônima para espaço puro), então
                ele desaparece do desenho — mas continua existindo para o nome
                acessível do `h2`. Com a segunda linha solta como nó de texto, ou
                o espaço sumia do nome («Unidep,treinamos») ou aparecia recuando a
                linha de baixo. */}
            <span className="university-unidep-realce">Em parceria com o Unidep,</span>{' '}
            <span className="university-unidep-linha">treinamos nossos próprios talentos.</span>
          </h2>
          {/* Sem `max-w-*` na utility: a medida de leitura tem UM dono, e é o
              `max-width` em `ch` de `.university-unidep-lead` — mesmo critério da
              escrita do programa, vinte linhas acima. */}
          <p
            className="university-unidep-lead mt-5 text-lg leading-relaxed"
            data-reveal="fade-up"
            style={{ '--reveal-i': 1 } as CSSProperties}
          >
            Alinhados com as últimas tendências e exigências do setor tecnológico, formamos
            profissionais nativos digitais, altamente qualificados e com excelente custo-benefício
            para o mercado.
          </p>

          {/* `<ul>` porque são três turmas irmãs, e a lista é o que informa a
              contagem a quem usa leitor de tela. Os três cartões são o MESMO markup,
              e todo o desenho do destaque (painel claro, anel externo, fio no topo,
              subtítulo em cápsula) mora no CSS — desde a 3ª volta como
              estado de `:hover, :focus-within`, e não mais como classe fixa no cartão
              do meio. Duplicar o `<li>` faria a próxima mudança de cartão ter dois
              lugares para acertar. */}
          {/* SIS-289 — A CASCATA DOS TRÊS CARTÕES. O índice entra no `style` de cada
              `<li>` (`--reveal-i`, 2 → 4, continuando a contagem do título e do
              lead), que é como o resto do site escalona irmãos: a cadência é o token
              `--motion-stagger-reveal` (80ms), o índice é inline. Por isso o `.map`
              passou a receber o segundo argumento — antes era só `(t)`.

              `fade` E NÃO `fade-up`, e aqui é a régua do §6 de `docs/scroll.md`, não
              preferência: o cartão JÁ TEM movimento vertical próprio e permanente —
              `university-unidep-flutuar`, 8px de sobe-e-desce em laço infinito
              (SIS-285, 3ª volta, a pedido). Somar uma subida de entrada a uma
              flutuação que nunca para é duas fontes de deslocamento vertical no
              mesmo nó: durante os 500ms da entrada as duas se somam, e o cartão
              parece corrigir a própria posição. A opacidade não disputa com nada.
              (Tecnicamente não haveria colisão de propriedade — o laço usa
              `translate` e o hover usa `scale`, ambos separados de `transform` —, e é
              justamente por isso que a razão tem de estar escrita: quem ler o CSS não
              vai encontrar o impedimento, ele é de leitura.)

              O `globals.css` PRECISOU DE UMA LINHA para isto funcionar, e está
              documentada lá: `.university-unidep-cartao` declara `transition`
              SHORTHAND (scale, cores, sombra), o que zera as duas linhas que o
              preset `[data-reveal]` escreve — mesma especificidade (0,1,0) e mais
              abaixo no arquivo. Sem o canal de `opacity` naquele shorthand o cartão
              apareceria de estalo, com o reveal «ligado» e nenhuma animação. */}
          <ul className="university-unidep-fileira mt-12">
            {TURMAS.map((t, i) => (
              <li
                key={t.src}
                className={
                  t.destaque
                    ? 'university-unidep-cartao university-unidep-cartao--destaque'
                    : 'university-unidep-cartao'
                }
                data-reveal="fade"
                style={{ '--reveal-i': 2 + i } as CSSProperties}
              >
                <Image
                  src={t.src}
                  alt={t.alt}
                  /* Medidas nativas do arquivo convertido, para o navegador
                     reservar a caixa antes do download — sem isso o rótulo abaixo
                     salta quando a imagem chega. */
                  width={750}
                  height={422}
                  /* A caixa medida a 1440: a coluna do cartão fecha em ~355px e a
                     foto tem o recuo de 12px do cartão dos dois lados. Abaixo de
                     1024 os cartões empilham e a foto ocupa o container, cujo recuo
                     lateral muda em 640px (`px-5` → `sm:px-6`). (Hoje `sizes` não
                     escolhe arquivo nenhum — ver `docs/images-unoptimized.md`.) */
                  sizes="(min-width: 64rem) 332px, (min-width: 40rem) calc(100vw - 4.5rem), calc(100vw - 4rem)"
                  className="university-unidep-foto"
                />
                <div className="university-unidep-faixa">
                  <div className="university-unidep-escrita">
                    <p className="university-unidep-rotulo">{t.titulo}</p>
                    <p className="university-unidep-apoio">{t.subtitulo}</p>
                  </div>
                  {/* 4ª VOLTA — A SETA SAIU DOS TRÊS CARTÕES, a pedido. Ela era
                      decoração (`<span aria-hidden>`, sem destino: a única navegação
                      da seção é a pílula do ESG abaixo), então tirá-la não remove
                      nada de navegável nem de anunciado por leitor de tela. A 3ª
                      volta já a escondia no hover; agora não existe estado em que ela
                      apareça, e o nó deixa de fazer sentido. Era:
                        <span aria-hidden className="university-unidep-seta">
                          <ArrowRight strokeWidth={2.2} />
                        </span>
                      `ArrowRight` SAIU DO IMPORT junto: esta era a última seta viva
                      da rota (a de `#university-numeros` já é só comentário). */}
                </div>
              </li>
            ))}
          </ul>

          {/* O elo que a própria fonte aponta como ausente: as duas páginas
              contam a mesma iniciativa e nenhuma cita a outra. É LINK, não
              escrita nova — o nome do destino é o nome que `/esg` já dá ao
              projeto. O que mudou é a FORMA: era texto ciano sublinhado, e a
              referência o desenha como pílula de contorno com seta.
              Classe própria e não `.btn-ghost` nem `.pill-accent`, e a razão é
              medida: `.btn-ghost` é vidro PREENCHIDO (degradê azul + `backdrop-filter`)
              a 24px de recuo, o oposto do contorno vazio da referência; `.pill-accent`
              é chip de categoria de 26px de altura, ou seja metade do alvo de toque
              de 44px que esta rota já usa nas pílulas de âncora — e chip não tem
              estado de hover nem de foco, que um link precisa ter. */}
          <Link
            href="/esg#esg-social"
            className="university-unidep-pilula mt-12"
            /* `fade` e não `fade-up` pelo mesmo motivo do quadro do Programa: a
               pílula transita `transform` no hover (ela sobe 2px), e o estado final
               do preset é `transform: none` — dois donos da mesma propriedade num
               nó que é LINK, isto é, o único da seção que responde a ponteiro e a
               teclado. Só opacidade não disputa. O canal de `opacity` no shorthand
               desta classe entrou no `globals.css` junto com o dos cartões, e pela
               mesma razão de cascata. */
            data-reveal="fade"
            style={{ '--reveal-i': 5 } as CSSProperties}
          >
            Projeto Gerando Talentos, em ESG
            <ArrowUpRight aria-hidden strokeWidth={2.2} />
          </Link>
        </RevealScope>
      </section>

      {/* SIS-284 — A SEÇÃO DOS NÚMEROS PASSA À COMPOSIÇÃO DE
          `public/imagensexemplo/university.png`: folha clara com grade, manchete
          de duas linhas com as duas pontas em azul, lead cinza, três cartões
          brancos ligados por fio ciano com nós, e assinatura no canto inferior
          direito.

          O QUE ISSO DESFAZ. Era fundo navy herdado, `h2` branco com só «Desde
          2022, já formamos» e DOIS `glass-card` (`mais de 60` / `mais de 17`)
          alimentados pela const `NUMEROS`. A const saiu de cena e está comentada
          logo acima, com a razão. O terceiro cartão — o de 2022 — é NOVO, e é o
          que faz a frase da fonte virar três marcos em vez de dois números
          soltos.

          A ESCRITA MUDOU DE PROPÓSITO, e a issue autoriza («atualizar
          `copy-lock.json`… redação muda de propósito»). O que mudou e o que não:
          • os TRÊS FATOS da fonte estão intactos — 2022, mais de 60
            especialistas, mais de 17 projetos reais para o mercado de seguros;
          • manchete e lead são a MESMA frase do 2º parágrafo repartida noutro
            lugar («Desde 2022, já formamos mais de 60 especialistas» + «Com
            mentalidade inovadora, aprendem na prática e acumulam experiência em
            mais de 17 projetos reais para o mercado de seguros.») — a fonte diz
            «já formamos mais de 60 especialistas COM mentalidade inovadora, QUE
            aprendem…»; o corte trocou o conectivo por ponto e nada mais;
          • as TRÊS LINHAS DE APOIO DOS CARTÕES são escrita NOVA, tirada da
            referência e não do documento de conteúdo («O início de uma jornada
            contínua», «Aprendizado prático, mentoria e experiência real.»,
            «Experiência aplicada ao mercado de seguros»). Registrado na issue:
            quem responde pelo conteúdo herda três frases que a fonte não tem.

          POR QUE `2022` NÃO CONTA E `60`/`17` CONTAM. Os dois números são
          quantidade e ganham o `CountUp` da casa — é o efeito «números animados»
          da skill de efeitos, e o primitivo já nasce seguro (valor final no HTML
          do servidor, valor final sob movimento reduzido, contagem só depois do
          `load` E do portão da rota). `2022` é DATA: um odômetro correndo de 0 a
          2022 leria como contador de nada, e é o mesmo argumento que a SIS-116 já
          escreveu neste arquivo para não transformar o ano em cartão de número.
          Ele fica escrito, estático.

          A ENTRADA É A DA CASA, não GSAP ad hoc: `RevealScope` escreve `data-in`
          num envelope e os presets `[data-reveal]` do `globals.css` fazem o
          resto — a seção continua SERVER COMPONENT, e o movimento reduzido já é
          coberto pelos dois canais no bloco de política. (A SIS-284 ligava
          `esperarRota` aqui alegando a cortina do `RouteLoadGate`; a SIS-289
          desligou, e o motivo medido está no comentário do próprio
          `RevealScope`, logo abaixo — a seção não está na dobra.) O fio usa o preset
          `line-up`, que DESENHA da esquerda em vez de subir — numa régua de 1px
          um deslocamento vertical é maior que a própria linha. */}
      <section
        id="university-numeros"
        aria-labelledby="university-numeros-titulo"
        className="section-py section-light university-numeros"
      >
        {/* Os quadrados azulados translúcidos da referência. Nó próprio pelo
            mesmo motivo do `.university-programa-acentos`: os DOIS
            pseudo-elementos da seção já pertencem a `.section-light` (a grade e o
            pontilhado), e escrevê-los aqui apagaria a grade. */}
        <span aria-hidden className="university-numeros-acentos" />
        {/* SIS-289 — O ESCOPO GANHOU O CALIBRE DA ROTA E PERDEU `esperarRota`. A
            linha era exatamente esta:

              <RevealScope className="container-lp" esperarRota>

            O CALIBRE: sem `limiar`/`margem` este escopo rodava no PADRÃO do
            componente (`limiar: 0.2`), enquanto as duas seções acima passaram a
            rodar em 0.15 — a mesma página em duas cadências, que é o defeito que
            `src/lib/reveal-calibre.ts` existe para impedir. A margem já batia com o
            canônico por coincidência (é também o padrão do `RevealScope`); escrever
            as duas explícitas serve para o dia em que o padrão mudar sem esta rota
            ser relida.

            `esperarRota` SAIU, e é a correção que a issue autoriza («corrigir só se
            estiver na dobra / cortina»): esta é a QUARTA seção da página e nasce a
            mais de uma tela abaixo da dobra. O que a SIS-284 escreveu aqui —
            «sem isso a cascata rodaria atrás do véu e ninguém a veria» — só vale
            para bloco que a cortina cobre; aqui a espera não protegia nada e fazia
            o observador nascer no instante em que a cortina subia, somando-se aos
            outros. É a soma desses nascimentos simultâneos que a SIS-269 mediu como
            «acendeu tudo depois do load», e o critério desta issue é o oposto.

            O `CountUp` dos cartões NÃO É AFETADO: ele tem portão próprio (`load` +
            `RouteLoadGate`), escrito no docblock dele, e não depende deste `prop`. */}
        <RevealScope className="container-lp" limiar={LIMIAR_REVEAL} margem={MARGEM_REVEAL}>
          {/* A manchete tem as DUAS PONTAS em azul e o miolo em navy, como a
              referência mostra — «Desde» e «especialistas». Não é um degradê:
              um gradiente azul→navy é monotônico e não voltaria ao azul na
              última palavra. Ver a ressalva no comentário da issue.
              A quebra depois de «formamos» é a da referência e está no
              `globals.css` (`max-width` da manchete), não num `<br />`: quebra
              escrita à mão vira quebra errada na primeira mudança de corpo. */}
          <h2
            id="university-numeros-titulo"
            /* Sem `text-section`, e é medição e não faxina: aquela utility computa
               65,6px nesta rota, e a 65,6px a quebra da referência não acontece —
               a derivação está no `globals.css`, ao lado do `clamp`. Deixá-la aqui
               junto com o `clamp` que a vence (utility vive em `@layer utilities` e
               perde para regra fora de camada) escreveria dois corpos no mesmo
               título, e o próximo a ler não saberia qual vale.
               A className anterior era:
                 className="university-numeros-manchete font-display font-bold text-section" */
            className="university-numeros-manchete font-display font-bold"
            data-reveal="fade-up"
          >
            <span className="university-numeros-realce">Desde</span> 2022, já formamos mais de 60{' '}
            <span className="university-numeros-realce">especialistas</span>
          </h2>
          <p
            className="university-numeros-lead mt-5 text-lg leading-relaxed"
            data-reveal="fade-up"
            style={{ '--reveal-i': 1 } as CSSProperties}
          >
            Com mentalidade inovadora, aprendem na prática e acumulam experiência em mais de 17
            projetos reais para o mercado de seguros.
          </p>

          {/* `<ul>` e não `<div>`: são três marcos irmãos, e a lista é o que
              informa a contagem a quem usa leitor de tela. O fio NÃO é item da
              lista — ele vive nos `::before`/`::after` dos cartões 2 e 3, senão
              a lista passaria a ter cinco itens, dois deles decoração. */}
          {/* `mt-16` (64px) e não `mt-12` (48px): o cartão de destaque SOBE 28px
              acima da fileira pela metade de cima da margem negativa, então o vão
              visível é `64 − 28 = 36px`. Com `mt-12` sobravam 20px — sem colisão,
              mas com o rótulo do destaque quase encostando no lead. A conta gêmea,
              do lado de baixo, está no `globals.css` (`…-assinatura`). */}
          <ul className="university-numeros-fileira mt-16">
            {/* ── 1. DESDE 2022 ─────────────────────────────────────────── */}
            <li
              className="university-numeros-cartao"
              data-reveal="fade-up"
              style={{ '--reveal-i': 2 } as CSSProperties}
            >
              {/* O ANEL QUE CORRE. Nó próprio e não um pseudo do cartão: os dois
                  pseudos dos cartões 2 e 3 já são do fio e do nó da ligação, e
                  escrever aqui apagaria a ligação justamente nos cartões que a têm.
                  É o mesmo motivo do `.university-numeros-acentos` acima.
                  `aria-hidden` porque é grafismo, e vem ANTES do conteúdo para
                  pintar por baixo dele sem precisar de `z-index`. */}
              <span aria-hidden className="university-numeros-halo" />
              <p className="university-numeros-rotulo">Desde</p>
              <div className="university-numeros-linha">
                <p className="university-numeros-valor">2022</p>
                {/* A arte entregue no lugar do ícone de traço do lucide. `width`/
                    `height` são os do arquivo (128) e não os de exibição: é o que
                    reserva a proporção para o navegador e evita salto de layout — o
                    tamanho visível é do CSS. `alt=""` porque o ícone repete o
                    número ao lado; o `aria-hidden` do invólucro já o tira da árvore,
                    e um `alt` descritivo aqui faria o leitor de tela anunciar
                    «calendário» depois de «2022».
                    O `-128.webp` é derivado por `scripts/gerar-icones-numeros-university.mjs`:
                    o PNG entregue tem 1254px e 288 kB para aparecer com 26px, e
                    `images.unoptimized` (SIS-154) manda o arquivo cru. */}
                <span aria-hidden className="university-numeros-icone">
                  <Image
                    src="/images/university/icones/calendario-128.webp"
                    alt=""
                    width={128}
                    height={128}
                  />
                </span>
              </div>
              {/* A LINHA DO MEIO nos três cartões, a pedido dela. Era só o `<p>`
                  solto:
                    <p className="university-numeros-apoio">O início de uma jornada contínua</p>
                  A faixa é o mesmo invólucro do cartão do meio, reaproveitado em vez
                  de uma borda nova no `<p>`: ela traz `margin-top: auto`, que é o que
                  ancora o traço na MESMA altura nos três (os apoios têm 1 e 2 linhas
                  de texto; sem o `auto` cada traço pousaria num lugar diferente). */}
              <div className="university-numeros-faixa">
                <p className="university-numeros-apoio">O início de uma jornada contínua</p>
              </div>
            </li>

            {/* ── 2. ESPECIALISTAS FORMADOS — o cartão de destaque ───────── */}
            <li
              className="university-numeros-cartao university-numeros-cartao--destaque"
              data-reveal="fade-up"
              style={{ '--reveal-i': 3 } as CSSProperties}
            >
              <span aria-hidden className="university-numeros-halo" />
              <p className="university-numeros-rotulo">Especialistas formados</p>
              <div className="university-numeros-linha">
                {/* `srText` com o sufixo: sem ele o leitor de tela anunciaria
                    «60» e o «+» ficaria de fora, trocando "mais de 60" por
                    "60 exatos". O número que corre é `aria-hidden` dentro do
                    primitivo. */}
                <p className="university-numeros-valor">
                  <CountUp value="60" srText="mais de 60 especialistas formados" />+
                </p>
                <span aria-hidden className="university-numeros-icone university-numeros-icone--nu">
                  <Image
                    src="/images/university/icones/especialista-128.webp"
                    alt=""
                    width={128}
                    height={128}
                  />
                </span>
              </div>
              {/* A SETA SAIU A PEDIDO DELA. Era, dentro desta mesma faixa:
                    <span aria-hidden className="university-numeros-seta">
                      <ArrowRight strokeWidth={2.2} />
                    </span>
                  e vinha com a nota de que era decoração — `<span aria-hidden>` e
                  não `<a>` — porque na referência ela fechava a composição sem
                  apontar para lugar nenhum.
                  Era decoração e não perdeu nada de conteúdo nem de navegação ao
                  sair — já era `aria-hidden` e sem destino. A `.university-numeros-faixa`
                  FICA, porque agora ela é a linha do meio dos TRÊS cartões, e não
                  mais o par apoio+seta de um só. */}
              <div className="university-numeros-faixa">
                <p className="university-numeros-apoio">
                  Aprendizado prático, mentoria e experiência real.
                </p>
              </div>
            </li>

            {/* ── 3. PROJETOS REAIS ─────────────────────────────────────── */}
            <li
              className="university-numeros-cartao"
              data-reveal="fade-up"
              style={{ '--reveal-i': 4 } as CSSProperties}
            >
              <span aria-hidden className="university-numeros-halo" />
              <p className="university-numeros-rotulo">Projetos reais</p>
              <div className="university-numeros-linha">
                <p className="university-numeros-valor">
                  <CountUp value="17" srText="mais de 17 projetos reais" />+
                </p>
                <span aria-hidden className="university-numeros-icone">
                  <Image
                    src="/images/university/icones/projeto-128.webp"
                    alt=""
                    width={128}
                    height={128}
                  />
                </span>
              </div>
              {/* Mesma faixa do cartão 1 — ver a nota lá. Era:
                    <p className="university-numeros-apoio">Experiência aplicada ao mercado de seguros</p> */}
              <div className="university-numeros-faixa">
                <p className="university-numeros-apoio">Experiência aplicada ao mercado de seguros</p>
              </div>
            </li>
          </ul>

          {/* A assinatura do canto inferior direito. `aria-hidden` na linha
              (é régua) e o rótulo fica como texto: é o nome do programa, e a
              referência o usa como remate da composição. */}
          <p className="university-numeros-assinatura" data-reveal="fade-up" style={{ '--reveal-i': 5 } as CSSProperties}>
            <span aria-hidden className="university-numeros-regua" data-reveal="line-up" />
            Sistran University
          </p>
        </RevealScope>
      </section>

      {/* SIS-283 — O FECHO PASSA A SER O DE `/esg`, e o que muda são DUAS PROPS.
          Não há markup novo aqui: `ContactCTA` já bifurca para
          `ContactCTAReferencia` (vidro + fio ciano + blob/selo + botão com
          círculo) quando `layoutReferencia` está ligada, e `contatoNoModal` é a
          mesma porta que `/esg` usa para o botão abrir o `ContactModal` em vez de
          navegar para `/#contato`. Duplicar a árvore da referência nesta rota é o
          que a issue proíbe justamente porque ela é mantida em um lugar só.

          A ESCRITA NÃO É PASSADA POR PROP, de propósito: título e parágrafo são
          os PADRÃO do componente («Fale com a Gente!» / «Quer conversar com um de
          nossos especialistas?…»), os mesmos que o `copy-lock` guarda, e o rótulo
          «Fale com a SISTRAN» é literal do arquivo da referência. Escrever aqui o
          mesmo texto seria criar uma segunda fonte da verdade para a mesma frase.

          `className` NÃO É NECESSÁRIO para a emenda com `#university-numeros`
          acima: `.cta-ref` traz o próprio campo claro e o `box-shadow` de 54px que
          espalha a cor de base para fora — é a mesma costura da SIS-93, escrita na
          seção da referência exatamente porque ali a seção de cima também é
          escura. Emenda por classe na rota só faria sentido se este bloco herdasse
          o navy, e ele não herda: pinta o dele.

          `haloClaro` e `reativo` FICAM DESLIGADOS (nunca estiveram ligados nesta
          rota), pelo mesmo motivo registrado no mount de `/esg`: os dois decoram a
          SUPERFÍCIE NAVY que a referência substitui — halo azul-claro atrás de um
          cartão que já está num campo azul-claro não tem contra o que acender.
          `revelar` ENTROU NA SIS-289, e é o item «CTA (`revelar={{ limiar, margem }}`
          como em `/esg`)» da issue. A SIS-283 o deixou de fora com a razão certa
          para o dia dela — não havia `reveal-calibre.ts` nesta rota, e inventar um
          par de números aqui seria fazer sem medição o trabalho da issue de reveal.
          O arquivo existe agora, e o par é o canônico reexportado, então a prop é
          preenchida a partir DELE e não de números escritos neste ponto.
          O que a prop liga está no `ContactCTAReferencia`: o `RevealScope` ocupa o
          lugar da `.cta-ref-palco` (mesmo `className`, nenhum nó novo) e os três
          nós marcados lá dentro usam `fade`, não `fade-up` — o cartão de vidro e o
          fio ciano têm `transform` próprio, e é a regra 3 desta issue. Não há nada
          a marcar aqui, do lado da rota: a marcação vive no componente, que é
          mantido em um lugar só. */}
      <ContactCTA
        layoutReferencia
        contatoNoModal
        revelar={{ limiar: LIMIAR_REVEAL, margem: MARGEM_REVEAL }}
      />
    </PageShell>
  );
}
