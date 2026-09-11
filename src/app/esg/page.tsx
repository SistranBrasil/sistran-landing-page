import Image from 'next/image';
import PageShell from '@/components/PageShell';
import PageHero from '@/components/PageHero';
import HeroImageBackdrop from '@/components/ui/HeroImageBackdrop';
import TituloAceso from '@/components/ui/TituloAceso';
import FogueteScroll from '@/components/ui/FogueteScroll';
import GaleriaTurmas from '@/components/ui/GaleriaTurmas';
import ContactCTA from '@/components/ContactCTA';

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
export default function Page() {
  return (
    <PageShell>
      {/* SIS-113 — a abertura ganha a foto de fundo. O arquivo servido é o
          `.webp` convertido do `esg.jpg` que já estava na pasta: 1031×690 em JPEG
          de 348 KB virou 48 KB nas mesmas medidas, sem redimensionar nada (o
          original ficou em `docs/fontes/esg/`, fora de `public/`). A foto é
          pequena para uma faixa de 1920 e o navegador vai ampliá-la — o que
          passa nesta caixa é aceitável porque ela vive sob o véu, que já é o
          escurecimento pesado da SIS-94; o que não seria aceitável é os 348 KB.

          O `alt` é vazio de propósito: a foto é ilustrativa e nada nela é
          informação — o título e a descrição ao lado dizem o que a página é, e os
          três eixos que a imagem rotula (environment / social / governance) são
          exatamente os três títulos de seção logo abaixo. Descrevê-la seria ler o
          mesmo conteúdo duas vezes. O `aria-hidden` do wrapper reforça isso. */}
      <HeroImageBackdrop
        src="/images/esg/esg-hero.webp"
        alt=""
        /* O recorte é vertical (a caixa é muito mais larga que alta): 42% sobe o
           enquadramento o suficiente para os rótulos e o globo sobreviverem, em
           vez de sobrar a mesa desfocada de baixo. */
        foco="50% 42%"
        className="hero-backdrop--esg"
      >
        {/* SIS-233 — O RECORTE DA FRASE MUDOU. Era:

              title="A Sistran demonstra seu forte compromisso com o ESG, integrando"
              highlight="práticas sustentáveis"
              description={<p>em suas operações e cultura corporativa.</p>}

            Ali a `description` era a SEGUNDA METADE do `h1` (SIS-138): a frase
            atravessava os dois nós e o CSS a costurava de volta com corpo de
            manchete, `white-space: nowrap` e alinhamento pelo pé. Lia como uma
            manchete só, quebrada no meio — não como o par manchete + parágrafo de
            apoio de `/contato`, que é o padrão que esta issue manda seguir.

            O corte novo cai na fronteira de oração da própria frase institucional:
            a manchete fica com a oração principal ("A Sistran demonstra seu forte
            compromisso com o ESG") e a descrição com a oração reduzida que a
            qualifica ("Integrando práticas sustentáveis..."). O `highlight` sai de
            "práticas sustentáveis" e vai para "compromisso com o ESG" pelo mesmo
            motivo que em `/contato` ele está em "fale com a gente!": o ciano marca
            o fecho da manchete, não uma expressão no meio dela — e, como lá, a
            pontuação de fecho ("." aqui, "!" em `/contato`) fica DENTRO do ciano,
            senão sobraria um ponto branco solto depois do destaque.

            AS DUAS ÚNICAS DIFERENÇAS DE LETRA em relação a
            `.claude/conteudo-site/07-esg.md:11` são consequência obrigatória do
            corte, e não reescrita de copy (trocar o texto pelo de `/contato` está
            fora de escopo por escrito na issue): a vírgula que ligava as orações
            virou o ponto que fecha a manchete, e o "i" de "integrando" virou
            maiúsculo porque a descrição passou a ser oração própria. A sonda
            `scripts/medir-abertura-esg-sis233.mjs` desfaz essas duas e compara o
            resto caractere por caractere (`#fraseCompleta`), justamente para que
            qualquer outra edição de texto aqui apareça como falha.

            `copy-lock.json` foi regravado de propósito por causa disto. */}
        <PageHero
          title="A Sistran demonstra seu forte"
          highlight="compromisso com o ESG."
          description={<p>Integrando práticas sustentáveis em suas operações e cultura corporativa.</p>}
        />
      </HeroImageBackdrop>

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
            className="font-display text-section text-white"
          />
          {/* SIS-141 item 9 — `text-lg` → `text-xl` aqui TAMBÉM. A issue é de
              GOVERNANCE, mas as duas seções escuras são gêmeas e tinham o mesmo
              parágrafo de abertura na mesma escala; subir só a de lá deixaria a
              página remendada. O raciocínio completo está no par desta linha, na
              seção GOVERNANCE. */}
          <p className="mt-5 max-w-3xl text-xl leading-relaxed text-white/85">
            A Sistran tem um compromisso com a sustentabilidade ambiental e adota práticas para
            minimizar o impacto negativo no meio ambiente. Realizamos ações internas e campanhas de
            conscientização para que nossos colaboradores desenvolvam o hábito de um comportamento
            consciente.
          </p>
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
              <li
                key={item.text}
                className="esg-cartao-pluma esg-cartao-flutua"
                style={{ ['--esg-fase-cartao' as string]: `-${i * 600}ms` }}
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
                      que igualou estes cartões ao corpo da página) e mesma tinta
                      (`text-white/85`). O respiro saiu do parágrafo e foi para o
                      cartão, porque agora o cartão tem padding; centralizada porque
                      é legenda de um disco centralizado, não parágrafo corrido. */}
                  <p className="text-base leading-relaxed text-white/85">{item.text}</p>
                </div>
              </li>
            ))}
          </ul>
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
          {/* SIS-139 item 10 — o mesmo destaque das outras duas seções. Aqui sem
              `destaque`: este título nunca teve segunda metade em
              `text-gradient-brand`, é o nome dos três projetos, e inventar um
              recorte colorido no meio deles seria escrita nova. O `titulo-risco`
              tem variante clara própria (`.section-light .titulo-risco`), então o
              risco continua legível sobre o fundo azul-claro desta seção. */}
          <TituloAceso
            id="esg-social"
            texto="SOCIAL: Projeto Gerando Talentos / Fundación Huerta Niño / Fundación Aguas"
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
          <div className="mt-10 grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-12">
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
              <div
                className="esg-apoio w-fit"
                style={{ ['--esg-fase' as string]: '-1.75s' }}
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
              <h3 className="mt-7 font-display text-3xl leading-tight text-ink md:text-4xl">
                {GERANDO_TALENTOS.name}
              </h3>
              {GERANDO_TALENTOS.paragraphs.map((t) => (
                <p key={t.slice(0, 24)} className="mt-5 max-w-xl text-base leading-relaxed text-ink-muted">
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
          </div>

          {/* --- Os dois projetos apoiados ------------------------------------
              SIS-110 — dois cards, e por isso `md:grid-cols-2` e não
              `lg:grid-cols-3`: com o Gerando Talentos fora do grid, três colunas
              deixariam um buraco de um terço da largura. Os dois têm a MESMA
              forma (foto no topo cobrindo a largura, texto e link abaixo), porque
              são pares: dois apoios a fundações externas. */}
          <div className="mt-14 grid grid-cols-1 items-stretch gap-6 md:grid-cols-2">
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
              <div
                key={p.name}
                className="esg-apoio esg-social-flutua h-full"
                style={{
                  ['--esg-fase' as string]: `-${i * 3.5}s`,
                  ['--esg-fase-onda' as string]: `-${i * 2.5}s`,
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
          </div>
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
            className="font-display text-section text-white"
          />
          {/* SIS-141 item 9 — o parágrafo de abertura sobe de `text-lg` (18px) para
              `text-xl` (20px), e sobe TAMBÉM no de ENVIRONMENT: as duas seções são
              gêmeas e divergir sem motivo é o que faz a página parecer remendada.
              `leading-relaxed` é razão (1,625) e não valor fixo, então a entrelinha
              acompanha sozinha — 29,25px em vez de 32,5px se fosse `leading-[29px]`.
              O `max-w-3xl` fica: a medida de linha já estava boa a 18px e a 20px ela
              encurta de ~90 para ~81 caracteres, que é o meio da faixa confortável. */}
          <p className="mt-5 max-w-3xl text-xl leading-relaxed text-white/85">
            A Sistran faz questão de seguir práticas éticas na gestão empresarial em busca de uma
            governança pautada em compliance.
          </p>
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
                style={{ ['--esg-fase-cartao' as string]: `-${i * 450}ms` }}
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
                    <span className="font-display text-lg text-white">{g.term}</span>
                  </dt>
                  <dd className="text-base leading-relaxed text-white/85">{g.detail}</dd>
                </dl>
              </li>
            ))}
          </ul>
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
      <ContactCTA haloClaro reativo contatoNoModal />
    </PageShell>
  );
}
