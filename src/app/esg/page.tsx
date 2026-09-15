import type { CSSProperties } from 'react';
import Image from 'next/image';
import PageShell from '@/components/PageShell';
import PageHero from '@/components/PageHero';
import HeroImageBackdrop from '@/components/ui/HeroImageBackdrop';
import TituloAceso from '@/components/ui/TituloAceso';
import FogueteScroll from '@/components/ui/FogueteScroll';
import GaleriaTurmas from '@/components/ui/GaleriaTurmas';
import ContactCTA from '@/components/ContactCTA';
import RevealScope from '@/components/motion/RevealScope';
import { LIMIAR_REVEAL, LIMIAR_REVEAL_BLOCO, MARGEM_REVEAL } from './reveal-calibre';

export const metadata = {
  title: 'ESG · Sistran',
};

/* "continuo" (item 4) recebeu o acento que falta no site: contínuo.

   SIS-139 — cada prática passou a ter imagem, e o par imagem↔prática foi
   CONFERIDO olhando as seis, não deduzido do número do arquivo. A conferência
   importa porque a numeração NÃO seguia a ordem deste array: a ordem certa era
   `esg-1, esg-4, esg-2, esg-5, esg-3, esg-6`. Um `.map()` por índice teria
   legendado errado quatro das seis — a foto da torneira e da lâmpada cairia no
   card da borra de café, e o `alt` passaria a descrever algo que não está na
   imagem.

   Por isso o nome do arquivo convertido diz a PRÁTICA, e não o índice: um
   `esg-4.webp` no card de água e energia é uma armadilha para quem vier depois,
   que não tem como saber se o 4 está certo sem reabrir as seis. O nome que
   descreve o conteúdo dispensa a conferência na próxima vez.

   Conversão (mesma regra da SIS-109, já aplicada nesta pasta): PNG é o formato
   errado para fotografia. Os seis somavam 1.528 KB para caixas que na grade de
   três colunas não passam de ~350px; em WebP q82, nos mesmos 595×595 nativos
   (sem redimensionar), somam 139 KB — 91% menos. Os PNG originais saíram de
   `public/` (que é publicado inteiro) para `docs/fontes/esg/`. */
const ENVIRONMENT = [
  {
    text: 'Instalação de postos de coleta seletiva',
    src: '/images/esg/env-coleta-seletiva.webp',
    /* `alt` diz o que se VÊ; o texto do card diz a prática. Repetir o rótulo
       visível faria o leitor de tela ouvir a mesma frase duas vezes. */
    alt: 'Lixeiras de coleta seletiva coloridas alinhadas em um corredor',
  },
  {
    text: 'Uso consciente da água e da energia elétrica',
    src: '/images/esg/env-agua-energia.webp',
    alt: 'Lâmpada, torneira e globo terrestre compondo o uso consciente de água e energia',
  },
  {
    text: 'Reciclagem de 100% da borra de café como fertilizante para plantas',
    src: '/images/esg/env-borra-cafe.webp',
    alt: 'Borra de café sendo aproveitada como adubo em um vaso de planta',
  },
  {
    text: 'Doação para uso contínuo e/ou Descarte correto do lixo eletrônico',
    src: '/images/esg/env-lixo-eletronico.webp',
    alt: 'Recipiente de descarte recebendo equipamentos eletrônicos fora de uso',
  },
  {
    text: 'Redução do consumo de descartáveis/plásticos (vs alumínio e vidro)',
    src: '/images/esg/env-descartaveis.webp',
    alt: 'Copo plástico descartado ao lado de uma caneca Sistran reutilizável',
  },
  {
    text: 'Diminuição do uso de papéis e adoção de documentação eletrônica',
    src: '/images/esg/env-papeis.webp',
    alt: 'Documentos em papel dando lugar a arquivos em um notebook',
  },
] as const;

/* SIS-141 — cada prática de governança passou a ter imagem, e o par imagem↔item
   foi CONFERIDO abrindo as seis, não deduzido do número do arquivo. A ordem dos
   arquivos NÃO era a ordem deste array: a correspondência real é
   `1, 4, 2, 3, 5, 6`. Um `.map()` por índice teria posto o aperto de mão em
   "Formalidade" e a mesa de planilhas em "Isenção/Autonomia".

   REVENDO O BLOQUEIO ANTERIOR (estava registrado no JSX da seção): a leitura de
   que três das seis fotos eram genéricas demais para atribuir não se sustenta
   depois de olhar as imagens contra os itens. Duas delas retratam PESSOAS — os
   colaboradores em primeiro plano e o grupo reunido em círculo — e os dois itens
   sem par eram justamente os dois que falam de pessoas: o código de ética
   "cumprido pelos colaboradores" e o comitê interno, que é um colegiado. O par
   não foi inventado para fechar a conta; ele é o que sobra quando os outros
   quatro são inequívocos (conselho em mesa de reunião, aperto de mão entre
   partes, documentação contábil, megafone de canal de comunicação).

   Por isso o nome do arquivo diz a PRÁTICA e não o índice, mesma regra da
   SIS-139: `gov-formalidade.webp` no card de contabilidade dispensa reabrir as
   seis para saber se está certo, e um `governance-2.webp` não.

   Conversão já aplicada nesta pasta (regra da SIS-109): os seis PNG somavam
   2.107 KB para caixas que na grade de três colunas não passam de ~350px; em
   WebP, nos mesmos 595×595 nativos, somam 176 KB — 92% menos. Os PNG originais
   estão em `docs/fontes/governance/`, fora de `public/`, que é publicado inteiro. */
const GOVERNANCE = [
  {
    term: 'Transparência',
    detail: 'sócios somente atuam através de um conselho estruturado',
    src: '/images/governance/gov-transparencia.webp',
    /* `alt` diz o que se VÊ; o `dt` ao lado diz a prática. Repetir o rótulo
       visível faria o leitor de tela ouvir a mesma frase duas vezes. */
    alt: 'Seis pessoas de terno reunidas ao redor de uma mesa de conselho, em sala envidraçada',
  },
  {
    term: 'Isenção/Autonomia',
    detail: 'Administração Legal independente do CEO',
    src: '/images/governance/gov-isencao-autonomia.webp',
    alt: 'Aperto de mão entre dois executivos sobre a mesa, com um terceiro acompanhando',
  },
  {
    term: 'Formalidade',
    detail: 'Contabilidade externa por empresa registrada na CVM',
    src: '/images/governance/gov-formalidade.webp',
    alt: 'Mesa vista de cima coberta de planilhas, gráficos impressos, tablets e um notebook',
  },
  {
    term: 'Código de Ética e Normas de Conduta',
    detail: 'cumpridos pelos colaboradores',
    /* SIS-141 — ESTAS DUAS FOTOS FORAM TROCADAS ENTRE SI depois da conferência.
       A primeira distribuição dava a "mãos em círculo com o polegar erguido" ao
       Comitê Interno, que é o item de MONITORAMENTO E CONTROLE: celebração de
       equipe é o oposto de supervisão. E dava ao Código de Ética a colaboradora
       em primeiro plano com a equipe enfileirada atrás, que lê como norma
       valendo para todos — exatamente o que o Comitê precisava.
       A justificativa que eu tinha escrito para deixar como estava ("são só duas
       fotos de pessoas, e são os dois itens que falam de pessoas") estava
       errada, e os meus próprios `alt` mostram: QUATRO têm pessoas, contando
       `gov-transparencia` e `gov-isencao-autonomia`. A restrição era mais larga
       do que eu calculei, então havia folga para a troca.
       Trocados os ARQUIVOS no disco, e não os caminhos aqui: assim o nome do
       arquivo continua nomeando o ITEM, que é a convenção desta pasta. Só os
       `alt` mudaram de lugar, porque `alt` descreve o que se vê. */
    src: '/images/governance/gov-codigo-etica.webp',
    alt: 'Mãos de cinco pessoas reunidas em círculo, vistas de baixo, com o polegar erguido',
  },
  {
    term: 'Comitê Interno',
    detail: 'para monitoramento e controle dos serviços executados',
    src: '/images/governance/gov-comite-interno.webp',
    alt: 'Colaboradora em primeiro plano com a equipe enfileirada atrás, no escritório',
  },
  {
    term: 'Canal de Denúncia',
    detail: 'idôneo para detecção de irregularidades e/ou condutas inapropriadas',
    src: '/images/governance/gov-canal-denuncia.webp',
    /* A ilustração é um DESENHO de megafone sobre a mão, não a fotografia de um
       canal em operação. Isso importa por causa do ponto 2 da issue: o texto
       deste item já é escrita do site e já afirma que o canal existe (o `TODO`
       da seção é sobre PUBLICAR o contato dele, não sobre a afirmação). Uma
       imagem literal — uma tela de formulário, um telefone de ouvidoria —
       passaria a mostrar um canal que ninguém consegue acessar. Um pictograma
       ilustra a ideia sem prometer a interface. */
    alt: 'Ilustração de um megafone e envelopes flutuando sobre a palma de uma mão',
  },
] as const;

/* SIS-109 — o Gerando Talentos saiu do array `SOCIAL` e virou este objeto
   próprio. Ele deixou de ser "um dos três": é o projeto idealizado pela Sistran,
   tem logo, tem três turmas fotografadas, e os outros dois são apoios a
   fundações de terceiros. Mantê-lo no array obrigaria os campos novos (`logo`,
   `turmas`) a serem opcionais em todos, com um `.map()` que desenha duas formas
   diferentes conforme o item — a uniformidade seria só aparente.

   Os dois parágrafos são os mesmos de antes, caractere por caractere (a issue é
   de forma, não de escrita), inclusive o "de" acrescentado a "tem o objetivo
   preparar" do original. */
const GERANDO_TALENTOS = {
  name: 'Projeto Gerando Talentos',
  paragraphs: [
    'Idealizado pela Sistran, o Projeto Gerando Talentos/Sistran University tem o objetivo de preparar e capacitar profissionais para a carreira de TI. Apoiada pela Unidep (Centro Universitário de Pato Branco), a Sistran oferece bolsas a estudantes de curso superior na área de tecnologia, proporcionando intensa capacitação e vivência na área com índices de certificações técnicas acima de 90%.',
    'O intuito é capacitação teórica e prática dessas tecnologias para que jovens entrantes na TI e profissionais em transição de carreira, possam ingressar no promissor universo da tecnologia.',
  ],
  /* SIS-109 — todos os arquivos aqui são `.webp` convertidos dos originais, que
     ficaram guardados em `docs/fontes/esg/` (fora de `public/`, que é publicado
     inteiro). O que chegava antes: logo PNG de 5739×5029 e 815 KB, e as turmas 2
     e 3 em PNG de ~565 KB cada — PNG é o formato errado para fotografia. Medido
     depois da conversão: logo 33 KB (640×561, alfa preservado, é uma placa com
     fundo próprio) e as turmas 41/67/56 KB nos 750×422 nativos. 2,3 MB → 197 KB,
     sem redimensionar foto nenhuma.

     A grafia é a exata dos arquivos, com as maiúsculas: no Windows um caminho
     com caixa errada funciona, no build Linux e no CloudFront não. */
  logo: '/images/esg/logo-Gerando-Talentos.webp',
  turmas: [
    {
      src: '/images/esg/1-turma-Gerando-Talentos.webp',
      /* `alt` descritivo, e não `alt=""`: são fotos das turmas formadas, o
         conteúdo que prova o projeto. A legenda visível (`<figcaption>`) diz a
         mesma coisa em texto — daí o `alt` nomear a foto, não repetir o rótulo. */
      alt: 'Alunos da 1ª turma do Projeto Gerando Talentos reunidos na formatura',
      legenda: '1ª turma',
    },
    {
      src: '/images/esg/2-turma-Gerando-Talentos.webp',
      alt: 'Alunos da 2ª turma do Projeto Gerando Talentos reunidos na formatura',
      legenda: '2ª turma',
    },
    {
      src: '/images/esg/3-turma-Gerando-Talentos.webp',
      alt: 'Alunos da 3ª turma do Projeto Gerando Talentos reunidos na formatura',
      legenda: '3ª turma',
    },
  ],
} as const;

/* Os dois projetos apoiados, com os links como o site os publica. O titulo da
   secao SOCIAL no site escreve "Funcación Aguas" e o corpo do card escreve
   "Fundación Aguas": aqui vale a grafia correta nos dois lugares.

   SIS-110 — cada um passou a ter foto. São os arquivos que já estavam na pasta,
   em JPG de 1247×832 e peso razoável (223 KB e 175 KB): não precisaram de
   conversão, ao contrário dos assets da SIS-109. */
const SOCIAL = [
  {
    name: 'Fundación Huerta Niño',
    paragraphs: [
      'Apoiado pelo Grupo Sistran, um sócio idealizou o Projeto Social Fundación Huerta Niño que trabalha para combater a desnutrição infantil, melhorar a qualidade da alimentação e promover hábitos saudáveis em crianças, através da construção e implementação de hortas agroecológicas em escolas rurais e urbanas carentes.',
    ],
    image: {
      src: '/images/esg/Huerta-Nino.jpg',
      alt: 'Crianças e voluntários em uma horta agroecológica construída pela Fundación Huerta Niño',
    },
    link: { label: 'Saiba mais sobre a Fundación Huerta Niño', href: 'https://www.mihuerta.org.ar/' },
  },
  {
    name: 'Fundación Aguas',
    paragraphs: [
      'Iniciativa surgida no ano de 2015, o projeto solidário Fundación Aguas tem também o apoio do Grupo Sistran. O objetivo desse projeto é proporcionar que comunidades carentes tenham acesso à água potável, trabalhando em conjunto com elas e capacitando-as através de educação e ferramentas que lhes permitam sustentar o processo ensinado.',
    ],
    image: {
      src: '/images/esg/Aguas.jpg',
      alt: 'Comunidade atendida pelo projeto Fundación Aguas com acesso a água potável',
    },
    link: { label: 'Conheça melhor o projeto Fundación Aguas', href: 'https://fundacionaguas.org/' },
  },
] as const;

/* Toda a escrita vem de /esg/. As galerias de imagens do site nao foram
   recriadas (nao tem texto).
   Fonte: .claude/conteudo-site/07-esg.md */
/* ─────────────────────────────────────────────────────────────────────────────
   SIS-271 — REVEAL ON SCROLL EM `/esg`, pelo padrão da SIS-263 e com o calibre
   por scroll da SIS-269.

   O MECANISMO É O QUE A ISSUE PRESCREVE, e nenhum outro: `motion/RevealScope`
   escrevendo `data-in` + os presets `[data-reveal]` do `globals.css`
   (`docs/scroll.md` §6). Framer Motion não entra nesta marcação — a página já
   paga três instâncias de `motion/react` (`TituloAceso`) mais o `FogueteScroll`,
   e somar um quarto mecanismo é exatamente o que o §6 chama de dois mecanismos
   sobre o mesmo conteúdo. Movimento reduzido e a rota sem JS continuam resolvidos
   em CSS, nas duas chaves (`@media (prefers-reduced-motion: reduce)` e
   `html[data-motion='reduce']`), sem uma linha nova: o preset já é o que apaga o
   estado inicial ali.

   SÃO SEIS ESCOPOS, E NÃO UM POR SEÇÃO — é a lição medida da SIS-269. Um escopo
   por seção acende o bloco inteiro no primeiro nó que cruza a raiz, e em SOCIAL
   (que tem título, o bloco do Gerando Talentos e os dois cartões apoiados, ~2600px
   de altura) isso significaria animar quase tudo fora da tela. Cada escopo é uma
   caixa que cabe na dobra:

     1. `#esg-introducao` — a grade de duas colunas.
     2. ENVIRONMENT · o parágrafo de abertura.
     3. ENVIRONMENT · a grade dos seis cartões.
     4. SOCIAL · o bloco do Gerando Talentos.
     5. SOCIAL · os dois cartões apoiados.
     6. GOVERNANCE · abertura e grade, um escopo cada (7).

   O QUE NÃO RECEBE REVEAL, e por quê — as três exclusões são a metade do
   trabalho desta issue:

   · A CAPA. A issue pede: «LCP: sem reveal longo no título». O `PageHero` dentro
     do `HeroImageBackdrop` fica intocado — pôr o `h1` em `opacity: 0` até um
     observador disparar é atrasar o próprio LCP, e a capa está na dobra, onde não
     há scroll nenhum para acompanhar.
   · OS TRÊS `TituloAceso`. Eles JÁ têm reveal por scroll próprio (acendem palavra
     por palavra, `motion/react`, medindo rolagem). Marcá-los seria o «não misture
     os dois no mesmo elemento» do §6, e os três títulos são justamente a cadência
     que a página já tinha antes desta issue.
   · A `GaleriaTurmas` e o `FogueteScroll`. A galeria é componente de cliente com
     estado próprio (o clique que amplia) e não expõe nó para marcar; o foguete é
     decoração `aria-hidden` em `-z-10` cuja âncora é `position: sticky` e cujo
     curso é medido por `useScroll` sobre o próprio wrapper. É por ele que os
     escopos de SOCIAL moram DENTRO do `.container-lp` e nunca em volta da seção:
     um `[data-reveal]` acima dele poria `transform` na linhagem do sticky e da
     caixa que o `useScroll` mede — o que a issue proíbe em uma linha («não
     envolver sticky/`fixed` com `transform` se houver»). Aqui há.

   E POR QUE OS CARTÕES ESG SÃO `fade`, NUNCA `fade-up`: é cascata, e é o critério
   «sem regressão nos cards ESG». O `<li>` de ENVIRONMENT/GOVERNANCE e os wrappers
   de SOCIAL carregam uma ANIMAÇÃO de `transform` (`.esg-cartao-flutua`,
   `.esg-social-flutua`), e declaração de animação vence declaração normal na
   cascata: o `translate3d` do preset `fade-up` seria silenciosamente ignorado — e
   o `transform: none` de `[data-in='true'] [data-reveal]` também, o que é o que
   salva a flutuação. Escrever `fade-up` ali daria um reveal que só faz opacidade
   fingindo fazer deslocamento. `fade` diz a verdade. O hover (`-12px` em
   `.esg-superficie:hover`, SIS-237) vive no filho e nunca é tocado: o `data-reveal`
   fica no WRAPPER, jamais na superfície — no filho, o `transform: none` de
   `[data-in='true']` tem a MESMA especificidade (0,2,0) do hover e vem MUITO
   depois no arquivo, e o levantamento morreria sem erro nenhum.

   O `--reveal-i` é o índice da cascata; o passo é o token
   `--motion-stagger-reveal` (80ms), sem override. Ver `./reveal-calibre.ts` para
   os dois números do calibre e para a razão de `esperarRota` não aparecer aqui.
   ────────────────────────────────────────────────────────────────────────── */
export default function Page() {
  return (
    <PageShell>
      {/* SIS-247 — `esgcapa.png` (1672×941) é a fonte da nova arte, mas não é
          servido: com `images.unoptimized=true`, o navegador receberia os ~2,2 MB
          sem derivação do Next. O LCP usa `esgcapa.webp`, gerado da fonte em q82,
          nas dimensões nativas.

          O `alt` é vazio de propósito: ambiente, esfera ESG+S e pessoas compõem
          o fundo da abertura; o `h1` já comunica ESG. O wrapper também é
          `aria-hidden`, portanto a arte decorativa não duplica a manchete. */}
      <HeroImageBackdrop
        src="/images/esg/esgcapa.webp"
        alt=""
        /* Em desktop a proporção já preserva a composição inteira. No recorte
           estreito, 74% mantém a esfera e reparte as bordas entre o ambiente à
           esquerda e a dimensão social à direita; 50% perderia quase toda a
           espiral de pessoas. */
        foco="74% 50%"
        className="hero-backdrop--esg"
      >
        {/* SIS-257 — o corte preserva o degrau médio do PageHero: `title` +
            `highlight` formam a manchete exata e somam mais de 28 e menos de 65
            caracteres. A frase institucional saiu inteira da capa, por isso não há
            `description` nem parágrafo vazio. */}
        <PageHero
          title="ESG -"
          highlight="Environment, Social & Governance"
        />
      </HeroImageBackdrop>

      {/* SIS-257 — o WebP é servido diretamente porque `images.unoptimized=true`
          impede o Next de derivar formatos. A fonte PNG permanece no repositório,
          mas não aparece no `src`.

          SIS-261 — DUAS COISAS MUDARAM AQUI, e a nota da SIS-257 sobre o fundo
          ficou obsoleta por causa da segunda:

          1. A ARTE É `esg2`, não `esg1`. E o `src` aponta para `esg2.webp`, um
             DERIVADO gerado por `scripts/gerar-esg2-alfa.mjs` — não para o
             `esg2.png` que a issue nomeia. O motivo é medido e está inteiro no
             cabeçalho daquele script: `esg2.png` NÃO tem canal alfa
             (`channels: 3`, `hasAlpha: false`); o que está no lugar do fundo é o
             xadrez de transparência do editor achatado como pixels OPACOS. Servir
             o PNG cru poria um tabuleiro cinza atrás da composição, que é o
             oposto do critério de aceite. O derivado tem alfa de verdade
             (`channels: 4`, 54,1% da área vaga) e 124 KB contra 2,1 MB.
             `esg1.png`/`esg1.webp` continuam no repositório e SEM consumidor —
             ficam como fonte histórica da SIS-257, não são apagados.

          2. A SEÇÃO GANHOU SUPERFÍCIE CLARA. Era `section-py` puro, e a nota da
             SIS-257 registrava como mérito que «sem fundo próprio, a seção
             continua no azul do body e a dissolvência inicial de ENVIRONMENT
             encontra a mesma cor, sem tarja». Essa premissa CADUCOU: a SIS-261
             pede fundo claro com grade discreta, e uma PNG sem fundo sobre o azul
             do body leria como recorte solto. A emenda com ENVIRONMENT volta a
             ser resolvida pelo mesmo mecanismo que a SIS-93 escreveu para isto —
             o `box-shadow` de sangria de `.section-light-blue`, que espalha a cor
             clara ~54px para fora e desfaz o corte reto.
             A superfície é `section-light section-light-blue` de propósito: é a
             MESMA que SOCIAL já usa nesta página (linha 499). Um branco puro seria
             uma terceira família de fundo em /esg. */}
      <section id="esg-introducao" className="esg-intro section-py section-light section-light-blue">
        {/* SIS-271 — escopo 1. O `RevealScope` ocupa o LUGAR da `<div>` que estava
            aqui, com o mesmo `className`: nenhum nó novo entra na árvore, então a
            grade de duas colunas é a mesma que a SIS-261 mediu.

            RESSALVA PARA QUEM FOR MEDIR ESTA SEÇÃO DE NOVO:
            `scripts/medir-intro-esg-sis261.mjs` mira `[data-esg-intro-eyebrow]` e
            `[data-esg-intro-copy]`, e os dois passaram a nascer em `opacity: 0`. O
            script já rola até o alvo, mas espera 400ms fixos, e o reveal leva 500ms
            (`--motion-reveal-base`) mais o atraso do `--reveal-i`: ele pode
            fotografar o meio da dissolvência e devolver contraste falso. A correção
            é esperar o estado DISCRETO — `[data-in="true"]` no ancestral do alvo — e
            não um tempo. Não é feita aqui: mexer no script é fora do escopo desta
            issue, e a nota existe para o número medido não ser lido como defeito. */}
        <RevealScope
          className="container-lp grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-12"
          limiar={LIMIAR_REVEAL}
          margem={MARGEM_REVEAL}
        >
          {/* Mobile empilha texto → imagem sem nenhuma regra de ordem: é a ordem
              do DOM, e a grade só vira duas colunas em `lg`. */}
          <div>
            {/* `eyebrow--traco` é MODIFICADOR do `.eyebrow` que já existe, não um
                rótulo novo: herda a tipografia (caps, `tracking-[0.22em]`) e o
                override de cor para fundo claro, e só troca o ponto pulsante pelo
                traço que a issue pede. A regra está no globals.css. */}
            {/* O `<span>` existe para poder MEDIR. O `.eyebrow` é `inline-flex` e o
                traço é o seu `::before`, então a caixa do `<p>` engloba o traço; a
                sonda de contraste, que varre o pior pixel de fundo dentro da caixa
                do alvo, elegia o próprio ciano do traço como "fundo do texto" e
                devolvia 1,89:1 — artefato, não defeito: o traço fica AO LADO da
                palavra, com `gap`, nunca atrás dela. Com o `<span>`, a caixa medida
                é a da palavra. Ver `scripts/medir-intro-esg-sis261.mjs`.

                A CLASSE `eyebrow-texto` NÃO É DECORATIVA, é o que impede o span de
                perder a cor. A faixa clara tem uma regra genérica
                `.section-light span:not([class*="badge"]):not([class*="pill"]):not([class*="eyebrow"]):not([class*="tag-section"])`
                que pinta span de navy; um span SEM classe casa com ela e a palavra
                saiu em `#0a1f44` em vez do `#024e86` do eyebrow — medido na sonda,
                que reportava a cor do alvo divergindo da cor do `.eyebrow`. O
                mecanismo de escape é o que a própria regra oferece: um nome que
                contenha «eyebrow». */}
            {/* `fade` e não `fade-up` no rótulo: o `.eyebrow` é `inline-flex` com o
                traço no `::before`, e 24px de deslocamento num rótulo de uma palavra
                lê como salto, não como entrada. É a mesma escolha da tag de seção de
                `/contato`. */}
            <p className="eyebrow eyebrow--traco" data-reveal="fade" style={{ '--reveal-i': 0 } as CSSProperties}>
              <span className="eyebrow-texto" data-esg-intro-eyebrow>
                ESG
              </span>
            </p>
            <p
              data-esg-intro-copy
              data-reveal="fade-up"
              style={{ '--reveal-i': 1 } as CSSProperties}
              className="mt-5 max-w-[24ch] font-display text-3xl leading-tight text-ink md:text-4xl lg:text-5xl"
            >
              A Sistran demonstra seu forte compromisso com o ESG, integrando práticas sustentáveis
              em suas operações e cultura corporativa.
            </p>
          </div>
          <Image
            src="/images/esg/esg2.webp"
            /* Descreve a COMPOSIÇÃO, que é o item 3 — o parágrafo ao lado já diz o
               que a Sistran faz, e repeti-lo aqui faria o leitor de tela ouvir a
               mesma frase duas vezes. */
            alt="Mosaico de cartões ligados por linhas: no centro, mãos segurando um globo com a sigla ESG; ao redor, folhagem, prédio envidraçado, turbina eólica e uma reunião de trabalho"
            width={1613}
            height={975}
            sizes="(max-width: 1023px) calc(100vw - 40px), (max-width: 1279px) 46vw, 558px"
            className="h-auto w-full"
            data-reveal="fade-up"
            style={{ '--reveal-i': 2 } as CSSProperties}
          />
        </RevealScope>
      </section>

      {/* ENVIRONMENT */}
      {/* SIS-208 — a seção ganha superfície própria. `esg-faixa-azul` é o azul
          médio (mais fundo que o `#1273bc` do body, por contraste — a conta está
          na regra, no globals.css) e a malha continua sendo a `.grade-tecnica` do
          projeto, aplicada como em `/solucoes` e `/quem-somos`: nenhuma grade nova
          foi escrita para esta página.

          `relative` dá a caixa da malha; `isolate` é o que a mantém visível — ela
          é `z-index: -1` e, sem contexto de empilhamento próprio, cairia atrás do
          fundo da seção. Mesmo arranjo de SOCIAL.

          `overflow-x-clip` é o conserto preventivo da rolagem lateral que a
          SIS-184 já teve de fazer em SOCIAL: a pluma de cada cartão é uma camada
          de `inset: -18px`, e nas duas pontas da grade ela projeta além do
          `container-lp` e empurraria o `scrollWidth` do documento. `clip` e não
          `hidden` porque `hidden` criaria um scrollport e quebraria `sticky` de
          dentro; e só no eixo X, para a pluma seguir respirando acima e abaixo. */}
      <section
        aria-labelledby="esg-environment"
        className="esg-faixa-azul section-py relative isolate overflow-x-clip"
      >
        <div aria-hidden className="grade-tecnica" />
        <div className="container-lp">
          {/* SIS-139 item 4 — o destaque do título é o `TituloAceso`, que já
              existe e já é o título de seção do projeto (seis instâncias em
              `/quem-somos`, uma em `Differentials`): acende palavra por palavra na
              rolagem, desenha o risco de sinal embaixo, trata `destaque` como
              parte separada — exatamente a segunda metade que este `h2` já tinha em
              `text-gradient-brand` — e resolve movimento reduzido sem trocar a
              árvore renderizada. Criar componente novo seria uma segunda gramática
              de título para a mesma finalidade.

              A DECISÃO do item 10, registrada: o destaque vale para os TRÊS
              títulos desta página, não só para este. ENVIRONMENT, SOCIAL e
              GOVERNANCE tinham o mesmo `h2`; acender um só deixaria os outros dois
              parecendo esquecidos. São três instâncias `'use client'` medindo
              rolagem, portanto três observadores — é o custo anotado no ponto 8 da
              SIS-141, e ele é o mesmo que `/quem-somos` já paga seis vezes na
              mesma página. */}
          <TituloAceso
            id="esg-environment"
            texto="ENVIRONMENT:"
            destaque="Sustentabilidade Ambiental"
            negritoTexto
            className="font-display text-section text-white"
          />
          {/* SIS-141 item 9 — `text-lg` → `text-xl` aqui TAMBÉM. A issue é de
              GOVERNANCE, mas as duas seções escuras são gêmeas e tinham o mesmo
              parágrafo de abertura na mesma escala; subir só a de lá deixaria a
              página remendada. O raciocínio completo está no par desta linha, na
              seção GOVERNANCE. */}
          {/* SIS-271 — escopo 2. Um escopo só para o parágrafo de abertura, e não um
              em volta da seção: o `TituloAceso` logo acima tem acendimento próprio e
              fica fora, e a grade dos seis cartões (~600px mais abaixo) é o escopo 3.
              O `RevealScope` é um `<div>` sem classe, então ele não muda o layout — o
              `mt-5` do `<p>` continua colapsando contra o topo dele, como colapsava
              contra o `.container-lp`. */}
          <RevealScope limiar={LIMIAR_REVEAL} margem={MARGEM_REVEAL}>
          <p className="mt-5 max-w-3xl text-xl leading-relaxed text-white/85" data-reveal="fade-up">
            A Sistran tem um compromisso com a sustentabilidade ambiental e adota práticas para
            minimizar o impacto negativo no meio ambiente. Realizamos ações internas e campanhas de
            conscientização para que nossos colaboradores desenvolvam o hábito de um comportamento
            consciente.
          </p>
          </RevealScope>
          {/* SIS-139 pôs foto, cor no hover e movimento contínuo nestes cartões.
              SIS-208 mudou a FORMA deles, e as duas decisões que ela desfez estão
              registradas aqui porque desfazer decisão medida sem dizer por quê é o
              que faz a próxima pessoa reabri-la.

              1. A FOTO NÃO SANGRA MAIS até a borda arredondada — ela virou um DISCO
                 dentro do cartão (`.esg-cartao-retrato`), com o respiro de volta no
                 cartão (`p-7`, em vez do `p-0` + `p-6` no parágrafo). O recorte
                 redondo não custa arte nenhuma, e é exatamente a medição da SIS-139
                 que garante isso: os seis arquivos têm a ilustração CIRCULAR com os
                 cantos transparentes (`alphaMin=0` nos seis). O que a máscara
                 descarta são esses cantos vazios.
              2. QUEM SE MOVE AGORA É O CARTÃO, não a foto. A SIS-139 escolheu o
                 contrário para não pôr a leitura em cima de um alvo oscilante, e o
                 argumento continua de pé no tamanho em que ela o escreveu — a
                 deriva da foto ia a `scale(1.06)`. O percurso daqui é de 7px (era 6px
                 antes da SIS-237), meio caractere em corpo 16, e o cartão inteiro anda
                 junto — o que dobrou na SIS-237 foi a VELOCIDADE, não o percurso: a
                 legenda não
                 se desloca EM RELAÇÃO à foto, que é o que atrapalhava. E a foto
                 deixou de derivar por conta própria, então a página trocou uma
                 camada animada por cartão, não somou uma segunda.
                 (A regra `.esg-pratica-foto img` fica no globals.css, intacta —
                 mas desde a SIS-210, que levou este mesmo padrão a GOVERNANCE, ela
                 não tem mais usuário nenhum no JSX.)

              A GRADE NÃO MUDOU: `md:grid-cols-2 lg:grid-cols-3`, seis itens, fecha
              exata nas duas — e a escrita dos seis também não, nem uma vírgula.

              As alturas seguem iguais por linha, e pelo mesmo mecanismo de antes: o
              disco tem proporção fixa, a grade estica cada LINHA e o `h-full` do
              cartão ocupa a altura que a linha reservou. Só o bloco de texto
              varia. */}
          {/* SIS-271 — escopo 3. O escopo embala a `<ul>` inteira porque a cascata é
              DELA: são seis cartões que entram em fileira, e um observador por cartão
              seria seis observadores para desenhar o mesmo stagger que uma custom
              property resolve. `--reveal-i` = índice, passo de 80ms (o token): a
              fileira fecha em 400ms, dentro da faixa de 70–120ms do §4.3.
              O escopo é um `<div>` sem classe entre o `.container-lp` e a `<ul>`; o
              `mt-10` fica na `<ul>` e colapsa contra o topo dele como antes.
              O limiar é o `LIMIAR_REVEAL_BLOCO`, e não o da rota: embalar uma grade
              alta num escopo só é o que cobra o preço de a fileira DE BAIXO nascer
              fora da tela — medido em 89px na 1ª volta. A conta está no
              `reveal-calibre.ts`. */}
          <RevealScope limiar={LIMIAR_REVEAL_BLOCO} margem={MARGEM_REVEAL}>
          <ul className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {ENVIRONMENT.map((item, i) => (
              /* O `<li>` deixou de ser o cartão e passou a ser o WRAPPER, e a razão
                 é de cascata, não de gosto: a pluma é um pseudo-elemento de `inset`
                 negativo (o `.glass-card` tem `overflow: hidden` e a recortaria em
                 nada) e a flutuação é uma animação de `transform` (que venceria o
                 `translateY` do hover no mesmo nó, e o levantamento desapareceria sem
                 erro nenhum). As duas notas completas estão no bloco SIS-208 do
                 globals.css; o levantamento em si passou a ser o -12px de
                 `.esg-superficie:hover` na SIS-237.

                 `--esg-fase-cartao` é a terceira fase da página e tem nome próprio
                 pela razão que a SIS-209 registrou: `--esg-fase` casa com o ciclo de
                 7s da pluma de SOCIAL e `--esg-fase-onda` com os 5s da flutuação de
                 lá. O valor é negativo para cada cartão nascer no meio do ciclo em
                 vez de esperar parado a sua vez.

                 SIS-237 — O PASSO CAIU DE 0,9s PARA 0,6s, e não é ajuste de gosto: a
                 travessia da animação passou de 6s para 3s, então o ciclo completo
                 (ida e volta, `alternate`) continua em 6s e os 0,9s de antes viraram
                 uma fatia diferente dele. Os seis seguem em pontos distintos do
                 ciclo (0 a 3,0s de 6s) e nenhum alinha com outro.
                 O passo tem TETO, e ele é geométrico: em `lg:grid-cols-3` o vizinho
                 de cima de cada cartão é o de índice i−3, e a diferença de fase
                 entre os dois é 3 × passo. Quanto maior o passo, mais perto da
                 oposição os dois ficam e mais o vão de 16px (`gap-4`) se fecha —
                 com passo de 0,9s no ciclo novo os dois se sobreporiam. Com 0,6s a
                 folga medida entre vizinhos não desce de ~4,7px
                 (`docs/medidas/sis237/resultado-depois.json`).

                 O passo é escrito em MILISSEGUNDOS INTEIROS porque `i * 0.6` em
                 ponto flutuante põe `-1.7999999999999998s` no atributo `style` do
                 HTML servido (conferido no `next dev`). O CSS aceita, mas o valor
                 vaza na página; `i * 600` com unidade `ms` é o mesmo tempo exato. */
              /* SIS-271 — `fade`, e é o WRAPPER que recebe a marca. Os dois motivos
                 estão no cabeçalho do arquivo e são de cascata: aqui a flutuação é uma
                 ANIMAÇÃO de `transform`, que vence declaração normal — `fade-up` daria
                 um deslocamento que o navegador descarta, e é a mesma vitória que faz
                 o `transform: none` de `[data-in='true']` não conseguir parar a
                 flutuação. No filho (`.esg-superficie`) esse `transform: none` teria a
                 especificidade do hover e a última palavra no arquivo, e o -12px do
                 levantamento da SIS-237 morreria calado. */
              <li
                key={item.text}
                className="esg-cartao-pluma esg-cartao-flutua"
                data-reveal="fade"
                style={{ ['--esg-fase-cartao' as string]: `-${i * 600}ms`, ['--reveal-i' as string]: i }}
              >
                {/* `esg-superficie` é a superfície corrigida da SIS-139 (é ela que
                    carrega também a cor do hover, compartilhada com GOVERNANCE) e
                    `glass-card-hover` continua sendo o hover desta página — nenhum
                    dos dois sistemas foi trocado. `h-full` para o cartão preencher a
                    altura que a linha da grade reservou. */}
                <div className="esg-superficie glass-card-hover flex h-full flex-col items-center gap-6 p-7 text-center">
                  <div className="esg-cartao-retrato">
                    {/* `sizes` casado com o TETO da nova caixa: o disco é
                        `clamp(9rem, 44%, 11rem)`, então 176px é o maior que ele
                        chega a medir e o valor nunca subestima a caixa (subestimar é
                        o lado ruim — o navegador serviria candidato menor e a
                        ilustração sairia borrada). Os 359px de antes eram a medida
                        da foto sangrada, que não existe mais.

                        A RESSALVA DA SIS-139 SEGUE VALENDO E É O QUE PESA AQUI: com
                        `images: { unoptimized: true }` no `next.config.mjs` o
                        `next/image` não emite `srcset`, então este `sizes` hoje não
                        produz efeito nenhum. Ele fica correto para o dia em que
                        `unoptimized` sair — e ninguém deve ler esta linha como
                        otimização ativa. */}
                    <Image
                      src={item.src}
                      alt={item.alt}
                      width={595}
                      height={595}
                      sizes="176px"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  {/* A legenda: mesma escala da SIS-141 (`text-base`, 16px, o degrau
                      que igualou estes cartões ao corpo da página). O respiro saiu do
                      parágrafo e foi para o cartão, porque agora o cartão tem padding;
                      centralizada porque é legenda de um disco centralizado, não
                      parágrafo corrido.

                      SIS-252 — a tinta era `text-white/85` e virou `esg-tinta-suave`
                      (`#3d5a80`), porque a superfície do cartão ficou azul bem
                      clarinho. Não é `text-ink-muted`, que é o que a issue escreve:
                      esse token resolve para `#e2effa` fora de `.section-light` e
                      esta seção é `esg-faixa-azul` — a apuração inteira está na
                      classe, em `globals.css`. */}
                  <p className="esg-tinta-suave text-base leading-relaxed">{item.text}</p>
                </div>
              </li>
            ))}
          </ul>
          </RevealScope>
        </div>
      </section>

      {/* SOCIAL */}
      <section
        aria-labelledby="esg-social"
        /* SIS-140 item 3 — `relative isolate` entram pelo foguete. O `relative` dá
           a caixa em que ele se posiciona; o `isolate` é o que faz o `-z-10` dele
           parar no lugar certo: um filho de `z-index` negativo pinta ACIMA do fundo
           do próprio pai e ABAIXO de todo o conteúdo em fluxo, mas sem contexto de
           empilhamento próprio ele afundaria atrás do fundo da seção e sumiria.
           Mesmo arranjo do `.esg-apoio`. */
        /* SIS-184 — o `overflow-x-clip` é o conserto da rolagem lateral da página.
           A causa medida: `.esg-apoio::before` (a pluma da SIS-114) é uma camada de
           `inset: -24px` que ainda ANIMA `scale` até 1,02, e todos os wrappers desta
           seção a carregam — as três turmas e os dois cartões apoiados. Os cartões
           terminam rentes à borda do `.container-lp` (a 390: x=373; a 768: x=747),
           então a pluma projeta ~24px além e empurrava o `scrollWidth` do documento
           para 398 (390) e 771 (768). Nada de conteúdo saía da janela — só a
           decoração, e mesmo assim a página inteira ganhava barra lateral.
           O clip mora AQUI, na seção, e não no `.esg-apoio`: o wrapper é justamente
           o nó que não recorta (é por isso que ele existe — o `<article>` tem
           `overflow: hidden` e comeria a pluma), então recortá-lo mataria a arte nos
           quatro lados. Na seção, a caixa tem a largura da janela: o que se perde é
           só o pedaço da pluma que já estava fora da tela.
           `clip`, e não `hidden`: `hidden` criaria um scrollport e quebraria
           `position: sticky` de dentro (mesma razão escrita no `body`, globals.css).
           E só no eixo X: `overflow-y` segue `visible`, então a pluma continua
           respirando 24px acima e abaixo dos cartões. Nada global em html/body/main —
           o defeito é desta seção. */
        className="section-py section-light section-light-blue relative isolate overflow-x-clip"
      >
        <FogueteScroll />
        <div className="container-lp">
          {/* SIS-139 item 10 — sem `destaque`: este título nunca teve segunda
              metade em `text-gradient-brand`. SIS-262 separa o prefixo em `texto`
              (negrito) e a lista em `resto` (mesmo acendimento, sem gradiente).
              O `titulo-risco` tem variante clara própria (`.section-light
              .titulo-risco`), então o risco continua legível sobre o fundo
              azul-claro desta seção. */}
          <TituloAceso
            id="esg-social"
            texto="SOCIAL:"
            resto="Projeto Gerando Talentos / Fundación Huerta Niño / Fundación Aguas"
            negritoTexto
            className="font-display text-section text-ink"
          />
          {/* --- Bloco de destaque: Projeto Gerando Talentos ------------------
              SIS-109 — apresentação própria, em duas colunas: escrita e logo à
              esquerda, as três turmas à direita.

              O bloco fica CLARO, como o resto da seção. As referências da issue
              têm fundo preto, mas adotá-las ao pé da letra abriria duas fronteiras
              claro/escuro novas no meio de uma única seção — e pela linguagem da
              SIS-75 cada uma delas pediria chanfro, isto é, dois `NotchDivider`
              dentro de SOCIAL para um bloco só. O contraste escuro que as
              referências buscam já vem de graça: a logo é uma PLACA de fundo navy
              com moldura laranja (medido no arquivo), então ela é o próprio
              elemento escuro do bloco, sem inverter o fundo da seção.

              É uma galeria estática, e não carrossel: as três fotos existem ao
              mesmo tempo no DOM, sempre. Isso resolve de saída os dois riscos que
              a issue levanta — nada depende de autoplay (portanto nada se perde
              com `prefers-reduced-motion: reduce`) e não há controle de navegação
              para alcançar por teclado, porque não há o que navegar. */}
          {/* SIS-271 — escopo 4. O `RevealScope` toma o lugar da `<div>` da grade, com
              o mesmo `className`. Ele mora AQUI DENTRO, e não em volta da `<section>`,
              por causa do `FogueteScroll`: a peça é `sticky` dentro de um wrapper
              `-z-10` e o curso dela é medido por `useScroll` sobre esse wrapper —
              qualquer `[data-reveal]` acima dele poria `transform` na linhagem, que é
              o que a issue proíbe. Dentro do `.container-lp` o foguete fica de fora,
              como irmão anterior.
              A `GaleriaTurmas` (a coluna da direita) não é marcada: é componente de
              cliente com estado próprio e não expõe nó para receber `data-reveal`. Ela
              entra junto com a coluna de texto porque o escopo é a grade inteira — só
              não tem passo próprio na cascata.
              Limiar de escopo alto pela mesma razão do escopo 3 — aqui é a COLUNA DE
              TEXTO que é alta, e é dela o único resíduo que esta issue entrega
              declarado (165px no último parágrafo). Ver `reveal-calibre.ts`. */}
          <RevealScope
            className="mt-10 grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-12"
            limiar={LIMIAR_REVEAL_BLOCO}
            margem={MARGEM_REVEAL}
          >
            <div>
              {/* A logo é conteúdo — nomeia o projeto e mostra a parceria com a
                  Unidep, que o texto cita. Daí o `alt` descritivo, e não `alt=""`.
                  `width`/`height` nas medidas reais do arquivo convertido, para o
                  navegador reservar a caixa antes do download (sem isso o texto
                  abaixo salta quando a imagem chega). */}
              {/* SIS-140 itens 2 e 6 — duas coisas num wrapper só.
                  `esg-apoio` traz a MESMA pluma azul dos cartões (ponto de atenção
                  1 pede estendê-la ao bloco do Gerando Talentos, não escrever uma
                  segunda), e ela precisa deste wrapper de qualquer forma: o `-24px`
                  de `inset` dela não sobreviveria dentro de um nó que recorta.
                  `esg-selo` é a flutuação do item 2. Ficam em elementos separados
                  (wrapper x imagem) de propósito: a pluma tem animação de `scale`
                  própria, e empilhar as duas no mesmo nó faria uma multiplicar a
                  outra. `w-fit` para a pluma abraçar o selo, e não a coluna toda. */}
              {/* SIS-271 — `fade` no wrapper da pluma, pela regra do cabeçalho: a
                  `.esg-apoio` não anima `transform` ela mesma (a deriva do hover mora
                  no `> :first-child`, e a pluma no `::before`), mas o alvo do hover é
                  justamente esse primeiro filho — pôr o `data-reveal` nele daria ao
                  `transform: none` de `[data-in='true']` a última palavra sobre o
                  `scale` do hover. No wrapper não há nada para atropelar. */}
              <div
                className="esg-apoio w-fit"
                data-reveal="fade"
                style={{ ['--esg-fase' as string]: '-1.75s', ['--reveal-i' as string]: 0 }}
              >
                <Image
                  src={GERANDO_TALENTOS.logo}
                  alt="Selo do Projeto Gerando Talentos, uma realização Sistran em parceria com a Unidep"
                  width={640}
                  height={561}
                  sizes="(max-width: 1023px) 60vw, 240px"
                  className="esg-selo h-auto w-[200px] rounded-2xl md:w-[240px]"
                />
              </div>
              <h3
                className="mt-7 font-display text-3xl leading-tight text-ink md:text-4xl"
                data-reveal="fade-up"
                style={{ '--reveal-i': 1 } as CSSProperties}
              >
                {GERANDO_TALENTOS.name}
              </h3>
              {/* A cascata continua da onde o `<h3>` parou: 2, 3, … Índice do parágrafo
                  + 2, e não índice + 1, para o primeiro deles não empatar com o título. */}
              {GERANDO_TALENTOS.paragraphs.map((t, i) => (
                <p
                  key={t.slice(0, 24)}
                  className="mt-5 max-w-xl text-base leading-relaxed text-ink-muted"
                  data-reveal="fade-up"
                  style={{ '--reveal-i': i + 2 } as CSSProperties}
                >
                  {t}
                </p>
              ))}
            </div>

            {/* As turmas em ordem: a 1ª grande, as outras duas lado a lado
                embaixo. É a leitura cronológica que o próprio projeto tem, e dá
                ao bloco a "imagem grande ocupando o outro lado" que a issue pede
                sem que as três fotos disputem o mesmo peso. */}
            {/* SIS-140 item 6 / ponto de atenção 2 — "todos os cards do mesmo
                tamanho" NÃO foi aplicado aqui, e é decisão registrada, não
                esquecimento. A 1ª turma ocupa as duas colunas porque as três fotos
                são uma sequência no tempo: a 1ª turma veio antes, e o tamanho é o
                que diz isso sem legenda. Igualar as três devolveria um mosaico de
                três fotos equivalentes, que é justamente a leitura que este arranjo
                foi feito para evitar — e o próprio ponto de atenção 2 avisa que
                igualar desfaz uma decisão deliberada.
                O que a issue quer de fato — que nenhum cartão pareça um recorte
                acidental de outro — vem cumprido pelas 2ª e 3ª terem a MESMA caixa
                entre si (mesma coluna, mesmo `aspect-[16/9]`, `h-full`), que é onde
                a desigualdade seria acidental em vez de significar algo. */}
            {/* A MARCAÇÃO DESTA GALERIA SAIU DAQUI e virou
                `src/components/ui/GaleriaTurmas.tsx`. Não foi deletada nem
                reescrita: é o mesmo `<ul>`/`<figure>`/`<figcaption>` que estava
                aqui, com o `<button>` do item 4 em volta da foto e a classe de
                deriva do item 7 na imagem. Mudou de arquivo porque o clique que
                amplia precisa de estado, e estado precisa de componente de
                cliente — o resto desta seção (título, textos, os dois cartões
                apoiados) continua no servidor, que é o motivo de a mudança ser um
                componente e não um `'use client'` na página inteira.
                Os dois comentários acima seguem valendo e por isso ficaram: a
                decisão do `col-span-2` e a do `--esg-fase` moram lá dentro. */}
            <GaleriaTurmas turmas={GERANDO_TALENTOS.turmas} />
          </RevealScope>

          {/* --- Os dois projetos apoiados ------------------------------------
              SIS-110 — dois cards, e por isso `md:grid-cols-2` e não
              `lg:grid-cols-3`: com o Gerando Talentos fora do grid, três colunas
              deixariam um buraco de um terço da largura. Os dois têm a MESMA
              forma (foto no topo cobrindo a largura, texto e link abaixo), porque
              são pares: dois apoios a fundações externas. */}
          {/* SIS-271 — escopo 5. Escopo próprio, e não o mesmo do Gerando Talentos: os
              dois blocos somam ~1800px e um escopo só acenderia estes dois cartões
              enquanto ainda estão fora da tela. Mesmo arranjo — o `RevealScope` no
              lugar da `<div>`, `className` idêntico. */}
          <RevealScope
            className="mt-14 grid grid-cols-1 items-stretch gap-6 md:grid-cols-2"
            limiar={LIMIAR_REVEAL}
            margem={MARGEM_REVEAL}
          >
            {SOCIAL.map((p, i) => (
              /* SIS-114 — o wrapper existe SÓ para carregar a sombra que respira
                 (`.esg-apoio::before`, no globals.css). Ela não pode morar no
                 `<article>`: o `overflow: hidden` dele — que é o que faz a foto
                 sangrar até a borda arredondada — recortaria uma camada de `inset`
                 negativo em nada. Mesmo arranjo da pluma do `.evento-cartao`. */
              /* SIS-140 item 6 — a fase saiu do `:nth-child(2)` do CSS e passou a
                 vir do índice, porque a mesma camada agora serve também as três
                 turmas, onde "o segundo" não quer dizer a mesma coisa. `-3.5s` é
                 metade do ciclo de 7s: o mesmo valor de antes, escrito onde se
                 sabe quantos cartões existem.

                 SIS-209 — `esg-social-flutua` é exclusiva destes dois wrappers:
                 animar `.esg-apoio` atingiria também o selo e as três turmas. A
                 flutuação fica no wrapper, nunca no `<article>`, porque a escala
                 da SIS-140 transforma o filho direto e uma animação no mesmo nó
                 venceria o hover na cascata. `h-full`, junto do card e do corpo
                 flexíveis, faz os dois pares ocuparem toda a linha do grid sem
                 alterar os 208px já reservados para cada foto.

                 DUAS FASES, e não uma repetida: `--esg-fase` é metade do ciclo de
                 7s da pluma e serve TAMBÉM as três turmas (ciclo de 11s), então
                 reescrevê-la para a flutuação estragaria a defasagem dos outros
                 cinco wrappers. A flutuação tem ciclo de 5s e por isso ganha
                 `--esg-fase-onda`, metade DELE — é o que mantém os dois cartões em
                 oposição em vez de a 0,7 do ciclo. */
              /* SIS-271 — `fade` no wrapper: `.esg-social-flutua` é animação de
                 `transform` neste mesmo nó, então valem as duas metades da regra do
                 cabeçalho — `fade-up` seria descartado, e é essa mesma vitória da
                 animação que impede o `transform: none` de `[data-in='true']` de
                 congelar a flutuação. O `scale` do hover mora no `> :first-child`
                 (o `<article>`) e não é tocado. */
              <div
                key={p.name}
                className="esg-apoio esg-social-flutua h-full"
                data-reveal="fade"
                style={{
                  ['--esg-fase' as string]: `-${i * 3.5}s`,
                  ['--esg-fase-onda' as string]: `-${i * 2.5}s`,
                  ['--reveal-i' as string]: i,
                }}
              >
              {/* `p-0` no cartão e o respiro no bloco de texto: é o que deixa a
                 foto sangrar até a borda arredondada em vez de nascer dentro de
                 uma margem branca de 28px. */}
              <article className="glass-card relative flex h-full flex-col overflow-hidden p-0">
                <Image
                  src={p.image.src}
                  alt={p.image.alt}
                  width={1247}
                  height={832}
                  sizes="(max-width: 767px) 92vw, (max-width: 1279px) 46vw, 560px"
                  className="h-52 w-full shrink-0 object-cover"
                />
                {/* O `corner-accent` desceu para o bloco de texto, e não segue no
                    canto do cartão: ali ele cairia EM CIMA da foto, e dois traços
                    de 1,5px em ciano sobre fotografia não leem como acabamento —
                    leem como artefato. Aqui ele volta a ter a superfície de vidro
                    atrás, que é o que ele foi feito para marcar. O `relative` é
                    dele; sem isso ele se ancoraria no `<article>`. */}
                <div className="relative flex-1 p-7">
                  <span aria-hidden className="corner-accent" />
                  {/* SIS-140 item 5 — a fonte maior nos dois cartões apoiados.
                      `text-sm` (14px) era menor que o corpo do resto da página e
                      fazia estes dois cartões lerem como nota de pé, não como
                      conteúdo. Vai a `text-base` (16px), que é o mesmo corpo dos
                      parágrafos do Gerando Talentos logo acima — o alvo é ficar
                      igual ao resto, não maior que ele.
                      A entrelinha sobe JUNTO, como a issue pede: `leading-relaxed`
                      é 1,625 e é razão, não valor fixo, então os 22,75px de antes
                      viram 26px sozinhos. Não é acidente que já estivesse certo —
                      é o motivo de usar razão em vez de `leading-[22px]`, e vale
                      dizer, porque a próxima pessoa a mexer aqui vai querer somar
                      uma classe de entrelinha e não precisa.
                      O `<h3>` acompanha (`text-xl` → `text-2xl`): mantido o degrau
                      entre título e corpo, senão subir só o corpo os aproxima e a
                      hierarquia do cartão achata. */}
                  <h3 className="font-display text-2xl leading-tight text-ink">{p.name}</h3>
                  {p.paragraphs.map((t) => (
                    <p key={t.slice(0, 24)} className="mt-4 text-base leading-relaxed text-ink-muted">
                      {t}
                    </p>
                  ))}
                  <a
                    href={p.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-block text-base font-semibold text-[#1273BC] underline underline-offset-4"
                  >
                    {/* No site o texto do link é a URL crua; aqui o rotulo é descritivo. */}
                    {p.link.label}
                  </a>
                </div>
              </article>
              </div>
            ))}
          </RevealScope>
        </div>
      </section>

      {/* GOVERNANCE */}
      {/* SIS-210 — a seção recebe a MESMA faixa da SIS-208, pelas mesmas três
          razões escritas no par de ENVIRONMENT: `esg-faixa-azul` é a superfície
          azul média que faz o lead de 20px em `text-white/85` passar do piso de
          4,5:1 (sobre o azul do body ele dava 4,09); `relative isolate` são o que
          põem a `.grade-tecnica` (que é `z-index: -1`) acima do fundo da seção em
          vez de atrás dele; e `overflow-x-clip` é o conserto preventivo da rolagem
          lateral, porque a pluma de cada cartão é uma camada de `inset: -18px` que
          nas pontas da grade projeta além do `container-lp`. `clip` e não `hidden`
          para não criar scrollport, e só no eixo X para a pluma seguir respirando
          acima e abaixo. Nada disso é escrita nova: são as mesmas classes. */}
      <section
        aria-labelledby="esg-governance"
        className="esg-faixa-azul section-py relative isolate overflow-x-clip"
      >
        <div aria-hidden className="grade-tecnica" />
        <div className="container-lp">
          {/* SIS-139 item 10 / SIS-141 item 8 — terceira e última instância do
              destaque na página. As duas seções escuras são gêmeas e recebem o
              mesmo tratamento, que é o que evita a página parecer remendada.

              O `text-section` do `h2` NÃO subiu, e é decisão registrada: ele é
              utilitário de escala do projeto inteiro (dez rotas o usam), então
              mexer nele para aumentar a escrita de UMA seção mudaria o título de
              todas as outras. "Aumentar as escritas" se resolve no corpo — que é
              onde a leitura estava apertada — e o degrau entre título e corpo
              continua o mesmo das outras seções. */}
          <TituloAceso
            id="esg-governance"
            texto="GOVERNANCE:"
            destaque="Ética e Transparência"
            negritoTexto
            className="font-display text-section text-white"
          />
          {/* SIS-141 item 9 — o parágrafo de abertura sobe de `text-lg` (18px) para
              `text-xl` (20px), e sobe TAMBÉM no de ENVIRONMENT: as duas seções são
              gêmeas e divergir sem motivo é o que faz a página parecer remendada.
              `leading-relaxed` é razão (1,625) e não valor fixo, então a entrelinha
              acompanha sozinha — 29,25px em vez de 32,5px se fosse `leading-[29px]`.
              O `max-w-3xl` fica: a medida de linha já estava boa a 18px e a 20px ela
              encurta de ~90 para ~81 caracteres, que é o meio da faixa confortável. */}
          {/* SIS-271 — escopo 6. Gêmeo do escopo 2 de ENVIRONMENT, pela mesma razão que
              esta seção é gêmea daquela: divergir sem motivo é o que faz a página
              parecer remendada. */}
          <RevealScope limiar={LIMIAR_REVEAL} margem={MARGEM_REVEAL}>
          <p className="mt-5 max-w-3xl text-xl leading-relaxed text-white/85" data-reveal="fade-up">
            A Sistran faz questão de seguir práticas éticas na gestão empresarial em busca de uma
            governança pautada em compliance.
          </p>
          </RevealScope>
          {/* TODO: o item "Canal de Denúncia" nao tem canal nenhum no site — sem
              link, e-mail ou telefone. Assim que o canal oficial existir, ele
              precisa ser publicado aqui. (Segue aberto: a SIS-141 acrescentou a
              ilustração do item, não o canal.) */}
          {/* SIS-210 — os seis cartões passam a usar o desenho da SIS-208, e a troca
              é de CLASSES QUE JÁ EXISTEM, não de CSS novo: `esg-cartao-pluma` +
              `esg-cartao-flutua` no wrapper, `esg-superficie glass-card-hover` no
              cartão, `esg-cartao-retrato` no disco. O bloco da SIS-208 no globals.css
              foi escrito sem "environment" em nenhum nome exatamente para esta hora.

              O QUE SAIU DE CENA (o desenho da SIS-141):
              | <div className="esg-pratica esg-superficie glass-card-hover overflow-hidden p-0">
              |   <dt><div className="esg-pratica-foto aspect-square">…</div>…</dt>
              A foto quadrada sangrada até a borda vira disco dentro do cartão, e a
              deriva de `--esg-fase` DENTRO da foto vira a flutuação do cartão
              inteiro. `.esg-pratica` e `.esg-pratica-foto img` continuam no
              globals.css e a partir daqui não têm mais nenhum usuário; removê-las é
              decisão própria, não desta issue — a nota de lá foi corrigida para não
              seguir afirmando que GOVERNANCE as usa.

              POR QUE WRAPPER E CARTÃO SÃO DOIS NÓS: é o contrato da SIS-208 e a razão
              é de cascata. `.glass-card` tem `overflow: hidden` e recortaria em nada
              a pluma, que é um `::before` de `inset: -18px`; `.glass-card-hover:hover`
              transforma o cartão, e uma animação no MESMO nó apagaria o levantamento
              do hover sem erro nenhum; e os dois pseudo-elementos do `.glass-card` já
              estão ocupados pela borda em gradiente e pelo brilho do hover.

              E POR QUE A `<dl>` VIROU SEIS, uma por cartão, dentro de uma `<ul>`: o
              modelo de conteúdo não deixa outra saída VÁLIDA. Um `<div>` filho de
              `<dl>` só pode conter `dt` seguido de `dd` — wrapper intermediário
              nenhum —, e `dt`/`dd` só valem como filhos de `<dl>` ou desse `<div>`.
              Como o desenho exige dois nós por cartão, um deles teria de ser um
              `<div>` dentro do outro, e aí `dt`/`dd` cairiam num `<div>` comum:
              marcação inválida, que é justamente o que o critério proíbe. Com uma
              `<dl>` por cartão a associação termo↔definição fica mais estreita, não
              mais frouxa (um par por lista, sem ordem para desambiguar), e a `<ul>`
              devolve o que a `<dl>` única dava e sozinhas se perderia: o CONJUNTO de
              seis. É, de quebra, a mesma marcação de ENVIRONMENT.

              A grade não mudou (`md:grid-cols-2 lg:grid-cols-3`, seis itens, fecha
              exata nas duas) e a escrita dos seis não mudou nem uma vírgula. */}
          {/* SIS-271 — escopo 7, gêmeo do escopo 3. Mesma cascata de índice, mesmo
              passo de 80ms, mesmo `fade` no wrapper pelo mesmo motivo de cascata: estes
              seis `<li>` também carregam `.esg-cartao-flutua`. Limiar de escopo alto
              como na ENVIRONMENT: aqui a grade tem 646px e a fileira de baixo nascia
              125px fora da tela. */}
          <RevealScope limiar={LIMIAR_REVEAL_BLOCO} margem={MARGEM_REVEAL}>
          <ul className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {GOVERNANCE.map((g, i) => (
              <li
                key={g.term}
                className="esg-cartao-pluma esg-cartao-flutua"
                /* Fase própria por posição, como em ENVIRONMENT. O passo é 0,45s e não
                   os 0,6s de lá pela razão que a SIS-141 já tinha registrado para a
                   deriva: passo igual sobre período igual poria o cartão de mesma
                   posição das duas seções no mesmo quadro. Com 0,45s os seis nascem em
                   pontos distintos do ciclo de 6s (0 a 2,25s) e nunca alinham — nem
                   entre si, nem com os de lá. O valor é negativo para cada cartão
                   nascer no meio do ciclo em vez de esperar parado a sua vez.

                   SIS-237 — era 1,1s enquanto a travessia durava 6s. Com a travessia
                   em 3s o ciclo completo segue em 6s, e o passo foi reescrito nas duas
                   seções pelo mesmo teto geométrico: em `lg:grid-cols-3` a diferença
                   de fase com o vizinho de cima é 3 × passo, e passo grande demais põe
                   os dois em oposição e fecha o vão de 16px da grade. Escrito em
                   milissegundos inteiros pela mesma razão de ENVIRONMENT: o produto em
                   ponto flutuante vaza dízima no atributo `style` do HTML servido. */
                /* SIS-271 — `fade` no wrapper; a nota completa está no `<li>` de
                   ENVIRONMENT e no cabeçalho do arquivo. */
                data-reveal="fade"
                style={{ ['--esg-fase-cartao' as string]: `-${i * 450}ms`, ['--reveal-i' as string]: i }}
              >
                {/* `esg-superficie` é a superfície corrigida da SIS-139 — é ela que
                    tira a `<dd>` em `text-white/85` dos 3,54:1 medidos lá — e
                    `glass-card-hover` continua sendo o hover desta página. `h-full`
                    para o cartão ocupar a altura que a linha da grade reservou. O
                    `gap-2` é o degrau curto entre termo e descrição, que era o `mt-2`
                    de antes; o respiro maior mora dentro do `<dt>`. */}
                <dl className="esg-superficie glass-card-hover flex h-full flex-col items-center gap-2 p-7 text-center">
                  {/* `w-full` no `<dt>` não é enfeite: o disco mede
                      `clamp(9rem, 44%, 11rem)` e a porcentagem resolve contra o pai —
                      num item de coluna flex com `items-center` o `<dt>` encolheria ao
                      conteúdo e os 44% ficariam circulares. `gap-6` é o mesmo respiro
                      entre disco e legenda de ENVIRONMENT. `font-normal` fica pela
                      razão de sempre: o peso do termo vem do `<span>`. */}
                  <dt className="flex w-full flex-col items-center gap-6 font-normal">
                    <div className="esg-cartao-retrato">
                      {/* `sizes` casado com o TETO da nova caixa: o disco é
                          `clamp(9rem, 44%, 11rem)`, então 176px é o maior que ele
                          chega a medir. Os 359px de antes eram a medida da foto
                          sangrada, que não existe mais. Segue valendo a ressalva das
                          duas seções: com `images: { unoptimized: true }` no
                          `next.config.mjs` o `next/image` não emite `srcset`, então
                          este `sizes` hoje não produz efeito nenhum — ele fica correto
                          para o dia em que `unoptimized` sair. */}
                      <Image
                        src={g.src}
                        alt={g.alt}
                        width={595}
                        height={595}
                        sizes="176px"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    {/* SIS-141 — termo em `text-lg` (18px) e descrição em `text-base`
                        (16px), com o degrau de 2px entre os dois: as duas escalas
                        ficam onde estavam. O que saiu foram os `px-6 pt-6`/`px-6 pb-6`,
                        que existiam para dar respiro num cartão de `p-0`; agora o
                        respiro é o `p-7` do cartão, como em ENVIRONMENT. */}
                    {/* SIS-252 — `text-white` → `esg-tinta` (`#0a1f44`), a tinta cheia
                        do cartão claro; o `<dd>` fica na tinta suave, mantendo a
                        hierarquia de peso que existia entre branco e branco a 85%. */}
                    <span className="esg-tinta font-display text-lg">{g.term}</span>
                  </dt>
                  <dd className="esg-tinta-suave text-base leading-relaxed">{g.detail}</dd>
                </dl>
              </li>
            ))}
          </ul>
          </RevealScope>
        </div>
      </section>

      {/* SIS-142 — as três mudanças pedidas para o fecho de `/esg` entram como
          props opt-in, do mesmo jeito que `motionShowcase` e `className` já
          entravam: quem decide é a rota, porque o bloco é o mesmo em dez telas.
          `haloClaro`: azul claro ATRÁS do cartão (e não como superfície dele).
          `reativo`: grafismo técnico seguindo o ponteiro + o realce ao passar o
          mouse, com o mesmo realce em `:focus-visible`.
          `contatoNoModal`: "Fale com a SISTRAN" vira `<button>` e abre o
          `ContactModal` já existente, em vez de sair da página para `/#contato`. */}
      {/* SIS-253 — `layoutReferencia` troca o cartão navy pelo desenho de
          `public/imagensexemplo/falecomagente.png` (fundo azul claro, vidro com
          texto escuro, fio ciano com nó, blob com o selo, botão branco com o
          círculo ciano). Só esta rota recebe a prop.

          `haloClaro` e `reativo` SAEM DE CENA aqui, e ficam comentados com o
          motivo em vez de apagados: os dois decoram a superfície que a SIS-253
          substitui. `haloClaro` acende azul claro ATRÁS do cartão navy — sobre o
          fundo azul claro da referência ele não tem o que fazer; `reativo` levanta
          aquele cartão no hover e pinta o grafismo técnico DENTRO dele, e a
          referência não tem nem um nem outro (o hover que ela pede é o do botão).
          O que a SIS-142 entregou e CONTINUA de pé nesta rota é o item 4, o
          `contatoNoModal`. Se a revisão preferir manter os dois, é só reativar as
          props — o caminho antigo do componente está intacto. */}
      {/* SIS-271 — o oitavo e último escopo é o «Fale com a Gente!», e ele entra por
          PROP porque este bloco é o mesmo em dez telas: `revelar` nasce indefinida e,
          sem ela, `ContactCTA`/`ContactCTAReferencia` continuam byte por byte para as
          outras nove — o mesmo contrato opt-in de `layoutReferencia`, `haloClaro` e
          `reativo`. O calibre vai daqui para lá em vez de ser reescrito no componente:
          dois literais numa peça compartilhada é a duplicação que `./reveal-calibre.ts`
          existe para evitar.
          O que é marcado LÁ DENTRO é o cartão e a arte, com `fade` nos dois — nunca
          `fade-up`. O motivo é o `ScrollTrigger` do fio: o gatilho dele é o próprio
          cartão (`start: 'top 90%'`), e um `translate3d` no nó de gatilho desloca a
          posição que o GSAP mede no `refresh`. `fade` não toca `transform`. */}
      <ContactCTA
        layoutReferencia
        contatoNoModal
        revelar={{ limiar: LIMIAR_REVEAL, margem: MARGEM_REVEAL }}
        /* haloClaro reativo */
      />
    </PageShell>
  );
}
