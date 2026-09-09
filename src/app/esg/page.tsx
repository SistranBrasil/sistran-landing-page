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
        <PageHero
          title="A Sistran demonstra seu forte compromisso com o ESG, integrando"
          highlight="práticas sustentáveis"
          description={<p>em suas operações e cultura corporativa.</p>}
        />
      </HeroImageBackdrop>

      {/* ENVIRONMENT */}
      <section aria-labelledby="esg-environment" className="section-py">
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
          {/* SIS-139 — os cards passaram a ter foto, cor no hover e movimento
              contínuo. O que saiu de cena:
              | <li className="glass-card-hover p-6 text-sm leading-relaxed text-white/85">
              |   {item}
              | </li>
              A grade não mudou (`md:grid-cols-2 lg:grid-cols-3`, seis itens, fecha
              exata nas duas). O `p-6` virou `p-0` no cartão com o respiro no bloco
              de texto, para a foto sangrar até a borda arredondada em vez de nascer
              dentro de uma margem de 24px — mesmo arranjo já usado nos dois cards
              de apoio da SOCIAL logo abaixo.

              QUEM SE MOVE É A FOTO, NÃO O CARTÃO (ponto 6 da issue): o texto de
              cada card é frase inteira, de 39 a 66 caracteres, e mover o cartão
              moveria o texto com ele. Mover só a camada de imagem dá o movimento
              perpétuo pedido sem pôr a leitura em cima de um alvo oscilante — e
              deixa o hover num alvo parado, porque a caixa que recebe o ponteiro
              não é a que anima.

              A CAIXA É QUADRADA, e isso foi medido, não escolhido por gosto: os
              seis arquivos têm canal alfa (`alphaMin=0` nos seis) porque a arte é
              CIRCULAR, com os cantos transparentes. Numa caixa 4/3 o `object-cover`
              cortava o círculo em cima e embaixo — a lixeira de coleta seletiva
              aparecia com o arco decepado nas duas pontas e o fundo do cartão
              vazando pelos cantos. Em 1:1 sobre arquivo 1:1 não há recorte nenhum, o
              círculo fecha, e os cantos transparentes deixam o vidro do cartão
              aparecer de propósito em vez de por acidente.

              As alturas ficam iguais apesar de o texto ser desigual: a proporção da
              foto é fixa, então o topo dos seis cartões alinha e só o bloco de texto
              varia — e como a grade estica cada LINHA, os cartões de uma mesma linha
              terminam na mesma base (medido: 365px nos seis a 1440, 326/349 por
              linha a 1024). `h-auto` livre na imagem é o que produziria seis alturas
              diferentes. */}
          <ul className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {ENVIRONMENT.map((item, i) => (
              <li
                key={item.text}
                /* `esg-pratica` carrega a cor de hover e a pausa do movimento;
                   `glass-card-hover` continua sendo o hover desta página (ponto 7
                   da issue: acrescentar cor, não trocar de sistema). */
                className="esg-pratica esg-superficie glass-card-hover overflow-hidden p-0"
                /* Compasso defasado por posição: seis fotos no mesmo tempo leem
                   como a página inteira balançando; defasadas leem como seis
                   objetos. Negativo para já nascer no meio do ciclo, em vez de
                   esperar parada até a sua vez. */
                style={{ ['--esg-fase' as string]: `-${i * 1.7}s` }}
              >
                <div className="esg-pratica-foto relative aspect-square w-full overflow-hidden">
                  {/* `sizes` casado com a caixa MEDIDA, não com a conta de cabeça.
                      Uma coluna abaixo de 768, metade entre 768 e 1024, e acima
                      disso `min(31vw, 359px)`.

                      Os 359px vêm de medição no navegador, e o caminho até eles
                      corrige DOIS erros. O valor anterior era 356px, que é o que
                      sairia de `gap-6`; a grade é `gap-4`, então a trilha mede
                      (1116 − 2×16) / 3 = 361,33px. Mas a caixa da foto não é a
                      trilha: o cartão tem 1px de borda de cada lado, e o que a
                      imagem realmente ocupa são **359,33px** — conferido a 1440 e
                      a 1920 (`getBoundingClientRect` de `.esg-pratica-foto`).
                      Ou seja, 356 errava para BAIXO, que é o lado ruim: o navegador
                      pode servir candidato menor que a caixa e a foto sai borrada.

                      É `min()` e não um px fixo porque entre 1024 e ~1244 o
                      `container-lp` ainda é fluido e a caixa é menor — medida a
                      1024 ela dá 307,33px, e 31vw ali vale 317px, que cobre sem
                      subestimar. Acima do teto do container o `min` trava nos 359.

                      RESSALVA QUE MUDA O PESO DISTO: hoje este `sizes` não faz
                      efeito nenhum. O `next.config.mjs` tem `images: { unoptimized:
                      true }` no projeto inteiro, e com isso o `next/image` não emite
                      `srcset` — conferido no DOM: `getAttribute('srcset')` vazio e
                      `sizes` sequer presente, `currentSrc` é o arquivo cru. Ou seja
                      não há candidato para o navegador escolher, e o ganho de bytes
                      desta issue veio TODO da conversão para WebP, não daqui.
                      O valor fica correto porque no dia em que `unoptimized` sair
                      ele passa a valer de imediato, e um 356 errado só apareceria
                      como foto borrada muito depois de quem o escreveu ter saído.
                      Mas ninguém deve ler este bloco como otimização ativa. */}
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={595}
                    height={595}
                    sizes="(max-width: 767px) 92vw, (max-width: 1023px) 46vw, min(31vw, 359px)"
                    className="h-full w-full object-cover"
                  />
                </div>
                {/* SIS-141 — `text-sm` (14px) → `text-base` (16px), o mesmo degrau
                    aplicado à descrição dos cartões de GOVERNANCE. Os 14px eram
                    menores que o corpo do resto da página; e como as duas seções
                    são gêmeas, a escala do cartão sobe nas duas ou em nenhuma. */}
                <p className="p-6 text-base leading-relaxed text-white/85">{item.text}</p>
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
        className="section-py section-light section-light-blue relative isolate"
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
          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
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
                 sabe quantos cartões existem. */
              <div
                key={p.name}
                className="esg-apoio"
                style={{ ['--esg-fase' as string]: `-${i * 3.5}s` }}
              >
              {/* `p-0` no cartão e o respiro no bloco de texto: é o que deixa a
                 foto sangrar até a borda arredondada em vez de nascer dentro de
                 uma margem branca de 28px. */}
              <article className="glass-card relative overflow-hidden p-0">
                <Image
                  src={p.image.src}
                  alt={p.image.alt}
                  width={1247}
                  height={832}
                  sizes="(max-width: 767px) 92vw, (max-width: 1279px) 46vw, 560px"
                  className="h-52 w-full object-cover"
                />
                {/* O `corner-accent` desceu para o bloco de texto, e não segue no
                    canto do cartão: ali ele cairia EM CIMA da foto, e dois traços
                    de 1,5px em ciano sobre fotografia não leem como acabamento —
                    leem como artefato. Aqui ele volta a ter a superfície de vidro
                    atrás, que é o que ele foi feito para marcar. O `relative` é
                    dele; sem isso ele se ancoraria no `<article>`. */}
                <div className="relative p-7">
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
      <section aria-labelledby="esg-governance" className="section-py">
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
          {/* SIS-141 — os cartões passaram a ter foto, e a grade não mudou
              (`md:grid-cols-2 lg:grid-cols-3`, seis itens, fecha exata nas duas).
              O que saiu de cena:
              | <div key={g.term} className="esg-superficie glass-card-hover p-6">
              |   <dt className="font-display text-base text-white">{g.term}</dt>
              |   <dd className="mt-2 text-sm leading-relaxed text-white/85">{g.detail}</dd>
              | </div>
              O `p-6` virou `p-0` no cartão com o respiro no bloco de texto, para a
              foto sangrar até a borda arredondada em vez de nascer dentro de uma
              margem de 24px — mesmo arranjo de ENVIRONMENT e dos cards da SOCIAL.

              A MARCAÇÃO É A MESMA (ponto 4 da issue): a `<dl>` fica, e a imagem
              entra DENTRO do `<dt>`, não solta no wrapper. Duas razões. A primeira
              é de validade: o modelo de conteúdo de um `<div>` filho de `<dl>` é
              "um ou mais `dt` seguidos de um ou mais `dd`" — uma `<figure>` ou um
              `<div>` de foto ali seria marcação inválida, mesmo que o navegador
              engula. Já o `<dt>` aceita conteúdo de fluxo, e `<img>` é conteúdo de
              fluxo. A segunda é de sentido: a foto ILUSTRA O TERMO, então ela
              pertence ao termo. A associação `dt`→`dd` dentro do mesmo grupo
              continua intacta, que é o que o critério de aceite cobra.

              QUEM SE MOVE É A FOTO, NÃO O CARTÃO — `esg-pratica` + `esg-pratica-foto`
              são as MESMAS classes de ENVIRONMENT (ponto 6 e critério "mesma classe,
              não uma cópia"): nada de CSS novo entrou por esta issue. Aqui a razão
              de não mover o cartão é ainda mais forte que lá: cada cartão tem termo
              E descrição, e mover a caixa moveria os dois blocos de leitura.

              A CAIXA É QUADRADA pelo mesmo motivo medido em ENVIRONMENT: os seis
              arquivos têm a arte CIRCULAR com os cantos transparentes. Em 1:1 sobre
              arquivo 1:1 o círculo fecha sem recorte, e os cantos deixam o vidro do
              cartão aparecer de propósito.

              O `prefers-reduced-motion: reduce` não precisou de nada novo: a regra
              que para a deriva já mira `.esg-pratica-foto img` e agora alcança doze
              cartões em vez de seis (ponto 7). O estado final é a foto parada e
              inteiramente legível, porque a animação é de `transform`, não de
              `opacity`. */}
          <dl className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {GOVERNANCE.map((g, i) => (
              /* SIS-139 — `esg-superficie` já tinha entrado aqui antes da imagem,
                 porque não tem nada a ver com foto: a `<dd>` destes cartões é
                 `text-white/85` sobre a mesma superfície de vidro que o azul claro
                 da seção atravessava, e media 3,54:1 contra o piso de 4,5:1. */
              <div
                key={g.term}
                className="esg-pratica esg-superficie glass-card-hover overflow-hidden p-0"
                /* Compasso defasado por posição, como em ENVIRONMENT — seis fotos
                   no mesmo tempo leem como a seção inteira balançando. O passo é
                   1,3s e não os 1,7s de lá DE PROPÓSITO: 1,7 × 6 = 10,2s num ciclo
                   de 9s, então as duas seções cairiam quase em fase entre si; com
                   1,3s as doze fotos da página nunca alinham. */
                style={{ ['--esg-fase' as string]: `-${i * 1.3}s` }}
              >
                {/* A foto vive no `<dt>` (ver o bloco acima), com o termo logo
                    abaixo dela. `font-normal` no wrapper para o `<dt>` não impor
                    peso à `<figure>`; o peso volta no `<span>` do termo. */}
                <dt className="font-normal">
                  <div className="esg-pratica-foto relative aspect-square w-full overflow-hidden">
                    {/* `sizes` idêntico ao de ENVIRONMENT porque a caixa é a MESMA
                        — mesma grade, mesmo `gap-4`, mesmo `container-lp`, mesma
                        borda de 1px: 359,33px medidos a 1440 e a 1920. Vale aqui a
                        mesma ressalva registrada lá: com `images: { unoptimized:
                        true }` no `next.config.mjs` o `next/image` não emite
                        `srcset`, então este `sizes` hoje não faz efeito nenhum e o
                        ganho de bytes veio TODO da conversão para WebP. O valor
                        fica correto para o dia em que `unoptimized` sair. */}
                    <Image
                      src={g.src}
                      alt={g.alt}
                      width={595}
                      height={595}
                      sizes="(max-width: 767px) 92vw, (max-width: 1023px) 46vw, min(31vw, 359px)"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  {/* SIS-141 — o termo sobe de `text-base` (16px) para `text-lg`
                      (18px) e a descrição de `text-sm` (14px) para `text-base`
                      (16px). Os 14px eram menores que o corpo do resto da página e
                      faziam estes cartões lerem como nota de pé. O degrau de 2px
                      entre termo e descrição é mantido: subir só a descrição
                      achataria a hierarquia do cartão.
                      `px-6 pt-6` no termo e `px-6 pb-6` na descrição, em vez de
                      `p-6` num wrapper: o wrapper teria de ficar entre a `<dl>` e o
                      par `dt`/`dd`, que é exatamente o que quebraria a associação. */}
                  <span className="block px-6 pt-6 font-display text-lg text-white">{g.term}</span>
                </dt>
                <dd className="mt-2 px-6 pb-6 text-base leading-relaxed text-white/85">
                  {g.detail}
                </dd>
              </div>
            ))}
          </dl>
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
