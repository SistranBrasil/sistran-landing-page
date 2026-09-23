import { notFound } from 'next/navigation';
import PageShell from '@/components/PageShell';
import PageHero from '@/components/PageHero';
import ContactCTA from '@/components/ContactCTA';
import HeroImageBackdrop from '@/components/ui/HeroImageBackdrop';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import {
  ACCELERATOR_PAGES,
  chaveDoBloco,
  getAcceleratorPage,
  idDoBloco,
  type AccelBlock,
  type AcceleratorPage,
} from '@/data/acceleratorPages';
import { CAPAS_DE_ABERTURA } from '@/data/capasSolucoes';
/* SIS-268 — `CarimboBatida` SAIU DESTE ARQUIVO, e o import fica comentado em vez de
   apagado (regra da casa): ele existia só para o `eyebrowArte` da abertura genérica, e
   o único mapa que o alimentava (`CARIMBOS_DE_ABERTURA`, logo abaixo) tinha UMA entrada
   — o `connect-api` —, que agora tem corpo próprio e monta a cápsula lá dentro. Com o
   mapa vazio o import viraria símbolo não usado, ou seja, um erro NOVO de eslint sobre a
   linha de base desta issue. Quando a cápsula do `lumina-ai` chegar, descomentar as duas
   coisas é o caminho — é para isso que elas ficam aqui, legíveis.
   import CarimboBatida from '@/components/CarimboBatida'; */
/* SIS-280 — a expectativa do parágrafo acima NÃO se cumpriu, e é justo registrar em vez
   de deixar a frase apontando para um futuro que não vem: a última slug (hoje
   `luminna-ai`, dois n) também saiu do caminho genérico, e ela NÃO leva cápsula — não
   existe arte `carimbo-…-luminna-…` em `public/`, e usar a de outro produto publicaria o
   nome errado no topo da rota. Logo o `eyebrowArte` genérico não tem mais NENHUM leitor
   possível entre os aceleradores. O import e o mapa seguem comentados pela mesma razão de
   antes — voltam a servir no dia em que uma solução nova entrar no dado sem cápsula
   própria —, e não por haver mount previsto. */
import MatchAiPagina from '@/components/solucoes/MatchAiPagina';
import FastPagina from '@/components/solucoes/FastPagina';
import SmartMinerPagina from '@/components/solucoes/SmartMinerPagina';
import QaIntegradoPagina from '@/components/solucoes/QaIntegradoPagina';
import GuruDeSegurosPagina from '@/components/solucoes/GuruDeSegurosPagina';
import ConnectApiPagina from '@/components/solucoes/ConnectApiPagina';
import LuminnaAiPagina from '@/components/solucoes/LuminnaAiPagina';

/* SIS-279 — AS SLUGS COM CORPO PRÓPRIO, num mapa só. A razão de ele existir (e o
   par de `if` que ele substitui) está no comentário do ramo, junto das razões de
   cada corpo. O tipo é o contrato que todas cumprem: recebem `page` e nada mais,
   e é ele que impede um componente com outra assinatura entrar aqui em silêncio.
   Slug fora do mapa = caminho genérico.

   SIS-287 — A QUARTA ENTRADA (`qa-integrado`). Contagem atualizada porque ela é
   critério: quatro slugs com corpo próprio, TRÊS ainda no caminho genérico
   (`lumina-ai`, `guru-de-seguros`, `connect-api`), e nenhuma linha do ramo genérico
   foi tocada para somar esta — é o que faz «outras slugs intactas» ser verificável
   por leitura, e não só por captura.

   SIS-280 — A QUINTA ENTRADA (`guru-de-seguros`), e a contagem acima caducou: hoje
   são CINCO slugs com corpo próprio e DUAS no caminho genérico (`lumina-ai`,
   `connect-api`). Outra vez sem tocar uma linha do ramo genérico.

   SIS-268 — A SEXTA ENTRADA (`connect-api`), e as duas contagens acima caducaram:
   hoje são SEIS slugs com corpo próprio e UMA só no caminho genérico (`lumina-ai`),
   que continua com a abertura do `PageHero` e a tag textual «Tecnologia Disruptiva»
   sem uma linha tocada. A CONSEQUÊNCIA desta entrada está no bloco comentado logo
   abaixo: a cápsula da SIS-279 entrava por `CARIMBOS_DE_ABERTURA`/`eyebrowArte`
   DESTE arquivo, e sair do caminho genérico a desmontaria — ela foi para dentro de
   `ConnectApiPagina`, com a mesma arte, as mesmas dimensões intrínsecas e a mesma
   classe `connectapi-carimbo`, e é lá que o mount está explicado.

   SIS-280 — A SÉTIMA ENTRADA (`luminna-ai`), e TODAS as contagens acima caducaram: hoje
   são SETE slugs com corpo próprio e NENHUMA no caminho genérico. A chave tem dois n
   porque a slug passou a ter — a mesma issue renomeou `/solucoes/lumina-ai` para
   `/solucoes/luminna-ai` no dado, com 308 do endereço velho em `next.config.mjs` —, e
   registrar aqui a grafia antiga faria a rota cair no caminho genérico em silêncio, sem
   erro nenhum: é exatamente o modo de falha que este mapa tem por desenho («slug fora do
   mapa = caminho genérico»).
   O RAMO GENÉRICO CONTINUA, sem uma linha tocada, e não é esquecimento: `AcceleratorPage`
   é tipo público e `getAcceleratorPage` serve qualquer slug do dado, então o dia em que
   uma solução nova entrar em `acceleratorPages.ts` sem cápsula própria é o dia em que ele
   volta a renderizar. Apagá-lo trocaria uma página genérica correta por `notFound()`. Ele
   está, daqui para frente, sem nenhum leitor ATUAL — e é isso que este parágrafo registra,
   para que ninguém leia as contagens acima e conclua que ainda há slug passando por lá. */
const CORPOS_PROPRIOS: Readonly<
  Record<string, (props: { page: AcceleratorPage }) => React.ReactElement>
> = {
  'match-ai': MatchAiPagina,
  fast: FastPagina,
  'smart-miner': SmartMinerPagina,
  'qa-integrado': QaIntegradoPagina,
  'guru-de-seguros': GuruDeSegurosPagina,
  'connect-api': ConnectApiPagina,
  'luminna-ai': LuminnaAiPagina,
};

/* ── SIS-279 — AS CÁPSULAS DAS SLUGS QUE AINDA PASSAM PELO CAMINHO GENÉRICO ────
   A issue manda o carimbo do Connect API «na abertura, sem redesenhar a página» — o
   layout do Match AI para esta slug está FORA DE ESCOPO. Então a cápsula entra pelo
   `eyebrowArte` que o `PageHero` já expõe desde a SIS-277 (é como
   `/parceiros-e-implementacoes` monta a dele), e nada mais nesta rota muda.

   UM MAPA, e não um `if` sobre `page.id` dentro do JSX da abertura: a `abertura` é
   montada UMA VEZ e usada nos dois caminhos do template (com capa e sem), e ela é a
   MESMA das duas slugs que sobraram (`lumina-ai`, `connect-api`). Slug fora do mapa
   recebe `undefined`, e `PageHero` então mantém a tag textual «Tecnologia
   Disruptiva» intacta — é o que faz «a outra slug genérica não mudou» ser
   verificável por leitura, e não só por captura. Quando a cápsula do `lumina-ai`
   chegar, é uma linha aqui.

   A arte foi MEDIDA antes de montar (`scripts/medir-carimbos-sis279.mjs` →
   `docs/medidas/sis279-carimbos.json`), nos três portões de `CarimboBatida`:
   tombo de repouso **−3,02°** (topo da tinta de y=42 em x=149 para y=14 em x=679 —
   a mesma família das outras quatro, então o repouso em `rotation: 0` que o
   componente assume vale e nenhum `tomboRepouso` novo é preciso); tinta média
   `rgb(255, 255, 255)` nos 27.922 pixels opacos sobre canto transparente (cápsula
   branca só se lê em faixa escura, e a abertura do `PageHero` é navy); e a grafia
   lida em captura sobre `#001A3D`: «SISTRAN | Connect API».

   828×291 são as dimensões INTRÍNSECAS (razão 2,845:1), que montam
   `--carimbo-batida-ar` dentro do componente para a cápsula não achatar; a largura
   de uso sai de `.connectapi-carimbo` no `globals.css`. O arquivo mora em
   `public/images/solucoes/` com as quatro irmãs, e não na raiz onde a issue o
   nomeia, pela razão registrada no Smart Miner: a mesma família de cápsula em duas
   pastas foi o que produziu o defeito da 5ª volta do Match AI. */
/* SIS-268 — O MAPA FICA COMENTADO, e não apagado. A sua única entrada era o
   `connect-api`, que esta issue tira do caminho genérico: a cápsula foi para dentro de
   `ConnectApiPagina`, com a MESMA arte, as MESMAS dimensões intrínsecas medidas na
   SIS-279 e a MESMA classe `connectapi-carimbo` — sem esse mount a SIS-279 regrediria
   nesta rota, que é o ponto de atenção desta issue.
   Vazio, o mapa devolveria `undefined` para a única slug que sobrou no caminho genérico
   (`lumina-ai`), ou seja, faria exatamente o que a ausência dele faz — e mantê-lo
   declarado sem leitor seria símbolo não usado, erro novo de eslint. As medidas e as
   razões acima ficam por serem o que o próximo mount (a cápsula do `lumina-ai`) vai
   precisar reler.

const CARIMBOS_DE_ABERTURA: Readonly<
  Record<string, { src: string; largura: number; altura: number; classe: string }>
> = {
  'connect-api': {
    src: '/images/solucoes/carimbo-connect-api-ticket-outline-ffffff.png',
    largura: 828,
    altura: 291,
    classe: 'connectapi-carimbo',
  },
};
*/

/* Uma pagina por acelerador com conteudo real no site. No site essas paginas
   vivem em /service/<slug>/ (e duas delas na raiz); aqui ficam sob /solucoes,
   que é de onde os cards saem. O bloco "Fale com a Gente!" — que no site so
   existe na pagina do QA Integrado — fecha todas, via ContactCTA.
   Fonte: .claude/conteudo-site/servicos/*.md */

/* SIS-292 — O MAPA DE CAPAS MUDOU DE CASA: ele agora é
   `src/data/capasSolucoes.ts`, importado acima. O motivo (dois leitores: este
   template e a página do Match AI) está escrito lá, junto com as notas da SIS-286
   que vieram inteiras. Nada do conteúdo mudou. */

export function generateStaticParams() {
  return ACCELERATOR_PAGES.map((p) => ({ slug: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getAcceleratorPage(slug);
  if (!page) return {};
  return {
    title: `${page.name} · Sistran`,
    description: page.lead,
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getAcceleratorPage(slug);
  if (!page) notFound();

  /* SIS-120 — `ACCELERATORS` deixou de ser lido aqui junto com o parágrafo solto
     que ele alimentava (o motivo está no comentário mais abaixo). Ficava assim:

     const accel = ACCELERATORS.find((a) => a.id === page.id);
  */

  /* SIS-286 — a ABERTURA é montada uma vez e usada nos dois caminhos (com capa e
     sem), em vez de escrita duas vezes dentro de um ternário. A escrita dela é a
     mesma nas sete páginas — `eyebrow`, `page.name`, `page.lead` — e duplicar o
     elemento para trocar só o invólucro criaria duas cópias da mesma abertura que
     depois divergiriam na primeira mexida. Os motivos de cada pedaço do `PageHero`
     estão no comentário do mount, logo abaixo. */
  const capa = CAPAS_DE_ABERTURA[page.id];
  /* SIS-268 — A LEITURA E O `eyebrowArte` SAÍRAM, comentados e não apagados junto do
     mapa que os alimentava. A única slug que sobrou neste caminho é o `lumina-ai`, que
     nunca teve cápsula: para ela o `carimbo` já era `undefined` e o `PageHero` já
     mantinha a tag textual «Tecnologia Disruptiva» — então a abertura dela sai desta
     issue com o MESMO resultado de antes, e é isso que faz «outras slugs intactas» ser
     verificável por leitura.
     SIS-280 — aquela slug também saiu deste caminho (e renomeou-se `luminna-ai`), então
     hoje nenhum acelerador chega aqui. O trecho segue comentado pela razão do topo do
     arquivo: o ramo genérico continua de pé para a próxima solução do dado sem cápsula
     própria, e essa é quem pode voltar a querer `eyebrowArte`.

  const carimbo = CARIMBOS_DE_ABERTURA[page.id];
  */
  const abertura = (
    <PageHero
      eyebrow="Tecnologia Disruptiva"
      /* SIS-279, comentado pela SIS-268 (ver acima):
      eyebrowArte={
        carimbo ? (
          <CarimboBatida
            src={carimbo.src}
            alt=""
            larguraIntrinseca={carimbo.largura}
            alturaIntrinseca={carimbo.altura}
            className={carimbo.classe}
            gatilho="rota"
          />
        ) : undefined
      }
      */
      title={page.name}
      description={<p className="text-white/85">{page.lead}</p>}
    />
  );

  /* SIS-292 — O `match-ai` TEM CORPO PRÓPRIO, e é a ÚNICA slug que tem.
     A issue pede a estrutura de seções de `exemplodoquezer.png` nesta página e
     proíbe, no item 1, redesenhar as outras seis. Um ramo sobre `page.id` é o que
     entrega as duas coisas: as seis continuam passando pelo `PageHero` + `blocks`
     + «Outras soluções» deste arquivo, letra por letra, e nenhuma linha daquele
     caminho foi tocada.
     O fecho (`ContactCTA layoutReferencia`) fica FORA do ramo porque o item 6 da
     issue manda mantê-lo como está nas slugs — é o mesmo mount para as sete.
     `MatchAiPagina` traz a própria versão de «Conheça também» (a vitrine da mock,
     que substitui o `<nav>` «Outras soluções» só nesta slug), então o `<nav>`
     genérico e a abertura com `HeroImageBackdrop` também ficam no outro ramo. */
  /* SIS-286 (corpo de hoje) — O `fast` PASSA A TER CORPO PRÓPRIO, pelo mesmíssimo
     desenho do ramo acima: a issue pede a estrutura de seções de
     `public/imagensexemplo/exemplofast.png` só nesta slug e proíbe, no item 1,
     redesenhar as outras («irmã da SIS-292 / match-ai»). Duas slugs com corpo
     próprio e cinco no caminho genérico — que continua sem uma linha tocada.
     Se uma terceira chegar, o par de `if` vira um mapa de slug → componente; com
     duas, um mapa esconderia a condição sem economizar nada.
     O fecho (`ContactCTA layoutReferencia contatoNoModal`) fica FORA do ramo pelo
     mesmo motivo: o item 7 manda mantê-lo como está nas slugs, e é o mesmo mount
     para as sete. `FastPagina` traz a própria versão de «Outras soluções» (a
     clara, da mock), então o `<nav>` genérico e a abertura com
     `HeroImageBackdrop` também ficam no outro ramo. */
  /* SIS-279 — A TERCEIRA CHEGOU, e o par de `if` virou o mapa que a nota acima
     previa («se uma terceira chegar, o par de `if` vira um mapa de slug →
     componente»). O que estava escrito era, um bloco por slug:

       if (page.id === 'match-ai') {
         return (
           <PageShell>
             <MatchAiPagina page={page} />
             <ContactCTA layoutReferencia contatoNoModal />
           </PageShell>
         );
       }

       if (page.id === 'fast') {
         return (
           <PageShell>
             <FastPagina page={page} />
             <ContactCTA layoutReferencia contatoNoModal />
           </PageShell>
         );
       }

     Com TRÊS, os dois motivos que sustentavam o par se invertem: o `PageShell` e o
     `ContactCTA` passariam a estar escritos três vezes idênticos (e o fecho é
     justamente o que as SETE slugs têm de compartilhar), e a condição que importa —
     «esta slug tem corpo próprio?» — fica dita uma vez, no mapa, em vez de
     espalhada. As razões de CADA corpo continuam nos comentários acima, que são o
     que um mapa não consegue guardar.
     `CORPOS_PROPRIOS` vive no módulo, fora do componente, para não ser recriado a
     cada render; o índice por `page.id` é o mesmo teste que os `if` faziam, e as
     DUAS slugs restantes caem no caminho genérico abaixo sem uma linha tocada
     (a contagem era «QUATRO» até a SIS-287 e «TRÊS» até a SIS-280). */
  const CorpoProprio = CORPOS_PROPRIOS[page.id];
  if (CorpoProprio) {
    return (
      <PageShell>
        <CorpoProprio page={page} />
        <ContactCTA layoutReferencia contatoNoModal />
      </PageShell>
    );
  }

  return (
    <PageShell>
      {/* SIS-120 · item 3 — ESTAS PÁGINAS ERAM TEXTUAIS por decisão, e não por
          esquecimento. O que estava escrito aqui era:

            "Não existe em `public/images` um único arquivo que corresponda a
             qualquer um dos sete slugs (conferido); pôr imagem aqui exigiria arte
             que só quem responde pelo conteúdo pode fornecer, e a própria issue
             avisa que 7 páginas × N assets sem peso e formato definidos vira a
             próxima issue de performance. O que a issue pedia era «definir imagem
             por produto OU decidir explicitamente que estas páginas são textuais»
             — é esta segunda, registrada aqui."

          SIS-286 — A PREMISSA CADUCOU PARA SEIS SLUGS, e só para elas: chegaram
          ao repositório as artes do Smart Miner (`public/capa-smart-mine.png`), do
          QA Integrado (`public/qa-integrado.png`), do Connect API
          (`public/conectapi.png`), do Guru de Seguros (`public/capa-guru.png`), do
          Match AI (`public/machai.png`) e do FAST (`public/fastcapa.png`).
          A frase «não existe um único arquivo» já não é verdade e não podia ficar
          afirmando isso — quem lesse depois desfaria as capas achando que elas
          contrariavam uma decisão. A outra (`lumina-ai`) continua
          textual, pelo motivo original, que segue valendo inteiro: não há arquivo
          para ela, e inventar arte não é trabalho de quem escreve o template.
          O `CAPAS_DE_ABERTURA` no topo é onde isso está declarado.

          SIS-280 — E ESSA SÉTIMA JÁ NÃO PASSA POR AQUI: ela virou `luminna-ai` (dois
          n) e tem corpo próprio, que monta a arte do hero a partir do `capaCard`. A
          decisão «esta página é textual» era uma decisão SOBRE O TEMPLATE, e ela
          deixou de valer para essa slug por ela ter saído do template — não por a
          decisão ter sido revista. Para quem AINDA cai neste ramo (nenhum acelerador
          hoje; a próxima solução do dado sem cápsula, amanhã) o parágrafo acima segue
          valendo palavra por palavra.
          A ressalva de peso da SIS-120 também segue valendo, e é por isso que
          nenhuma capa entra como o PNG de ~2 MB: as rotas servem derivadas WebP
          de 95 a 165 kB (`scripts/otimizar-capa-smart-miner-sis286.mjs`,
          `scripts/otimizar-capas-solucoes-sis286.mjs`,
          `scripts/otimizar-capa-match-ai-sis286.mjs` e
          `scripts/otimizar-capa-fast-sis286.mjs`). Com `images.unoptimized`
          ligado, `next/image` entrega o arquivo como ele está no disco — a conversão
          é a única coisa entre a arte e o LCP.

          SIS-120 · item 7 — a `eyebrow` FICA igual nas sete. Ela não descreve o
          produto: nomeia a família a que os sete pertencem, e é exatamente o
          título da seção de `/solucoes` (`#tecnologia-disruptiva`) de onde todos
          os cards saem. Diferenciá-la por produto inventaria sete rótulos de
          categoria que o site não tem. */}
      {/* SIS-286 — A CAPA ENVOLVE a abertura, no padrão `HeroImageBackdrop` de
          `/contato` (SIS-126), `/parceiros` (SIS-225), `/sistran-labs` (SIS-227),
          `/esg` (SIS-247) e `/sistran-university` (SIS-248). Nada da escrita muda:
          o que entra é um invólucro.

          `alt=""` NAS SEIS: as artes são DECORATIVAS. Cada uma desenha
          literalmente o que o `h1` da sua rota nomeia e o `page.lead` logo abaixo
          explica em palavras — a esteira que aprova um documento (Smart Miner), o
          anel de etapas em volta de quem programa (QA Integrado), o hub com os
          sistemas conectados em volta (Connect API), o assistente que responde por
          voz (Guru de Seguros), o prisma que casa o perfil de quem contrata com as
          apólices em volta (Match AI), a esteira de validação que despacha os
          documentos em velocidade (FAST). Descrevê-las faria o leitor de tela ouvir a mesma
          ideia duas vezes, a segunda em forma de inventário de ícones. Mesmo
          critério das capas do Labs (SIS-227) e da University (SIS-248).

          OS LETREIROS QUE AS ARTES TRAZEM — «Smart Miner», «QA Integrado»,
          «Connect API», «Guru de Seguros», «MATCH AI», «FAST» — FICAM INTEIROS, e isso é escolha
          medida, não sobra. O precedente da casa é o `/sistran-labs` (SIS-227), que
          mantém de propósito a escrita do logo enquanto o `h1` diz o mesmo nome:
          como o `alt` é vazio, o que repete é DESENHO, não texto lido duas vezes por
          leitor de tela. O que não se podia aceitar era o meio-termo — letreiro
          cortado pela metade —, e é exatamente o que um `object-position` de fábrica
          produz em pelo menos uma das larguras. Por isso cada rota tem o seu número
          medido (`.hero-backdrop--<slug>` no globals.css, com a derivação ao lado da
          regra): em tela larga o recorte é vertical e só o Y decide; a 390 ele vira
          horizontal e é o X que escolhe qual pedaço da arte sobrevive. */}
      {capa ? (
        <HeroImageBackdrop src={capa.src} alt="" className={capa.className}>
          {abertura}
        </HeroImageBackdrop>
      ) : (
        abertura
      )}

      {/* SIS-120 · itens 1 e 2 — O PARÁGRAFO SOLTO SAIU, e os dois defeitos caem
          juntos: era ele que repetia a ideia da abertura e era ele que morava
          fora de qualquer `<section>`.
          Das duas frases, a que fica é a `page.lead`, porque é a abertura do
          SITE para esta página; `accel.description` é a escrita do CARTÃO da
          vitrine — existe para ser lida em três linhas dentro de um cartão de
          `/solucoes`, ao lado de outros seis, e continua publicada lá, intacta.
          Trazê-la para dentro de um bloco seria publicar duas aberturas da mesma
          página, uma embaixo da outra, que é o que a issue mede.
          O código continua comentado no lugar, e não apagado:

          <div className="container-lp pb-4">
            {accel && (
              <p className="max-w-3xl text-lg leading-relaxed text-white/85">{accel.description}</p>
            )}
          </div>
      */}

      {page.blocks.map((block) => (
        <Block key={chaveDoBloco(block)} block={block} />
      ))}

      {/* SIS-120 · item 4 — a volta para a vitrine e o caminho para os outros
          seis. Vem ANTES do `ContactCTA` de propósito: quem chegou até aqui e
          não é o produto certo precisa do desvio antes do rodapé de conversão. */}
      <nav aria-labelledby="outras-solucoes" className="section-py">
        <div className="container-lp">
          <h2 id="outras-solucoes" className="font-display text-xl text-white">
            Outras soluções
          </h2>
          {/* Fichas com o NOME, não a vitrine repetida: o ponto de atenção da
              issue é justamente não recolar os sete cartões no pé de cada uma das
              sete páginas — seriam 49 cartões de conteúdo duplicado no site. */}
          <ul className="mt-5 flex flex-wrap gap-2.5">
            {ACCELERATOR_PAGES.map((p) => {
              const atual = p.id === page.id;
              return (
                <li key={p.id}>
                  {/* O atual NÃO é link: `aria-current` diz onde se está, e um
                      link para a página que já está aberta é um clique que não
                      leva a nada. Como `<span>`, ele também sai da ordem de
                      tabulação — sete fichas, seis paradas de teclado. */}
                  {atual ? (
                    <span
                      aria-current="page"
                      className="inline-block rounded-full border border-[#2AC4FF]/70 bg-[#2AC4FF]/14 px-4 py-2 text-sm font-semibold text-white"
                    >
                      {p.name}
                    </span>
                  ) : (
                    <Link
                      href={`/solucoes/${p.id}`}
                      className="inline-block rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-white/85 transition-colors hover:border-[#2AC4FF]/50 hover:bg-white/10"
                    >
                      {p.name}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
          <Link
            href="/solucoes"
            className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#A5F0FF] underline underline-offset-4"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2.4} aria-hidden />
            Ver todas as soluções e serviços
          </Link>
        </div>
      </nav>

      {/* SIS-286 — O FECHO PASSA A SER O DE `/esg` em TODAS as slugs, e é por isso
          que a mudança é aqui e não numa condição: este arquivo é o template de
          `ACCELERATOR_PAGES` inteira, então duas props neste mount alcançam as sete
          páginas de uma vez. O item 2 da issue proíbe explicitamente condicionar a
          uma slug — `match-ai` era o escopo do corpo antigo deste identificador, e
          o de hoje é todas. Linha anterior, para o registro: `<ContactCTA />`.

          Nada de markup novo e copy intacta, pelos mesmos motivos registrados no
          mount de `/solucoes` (índice): `ContactCTA` já bifurca para
          `ContactCTAReferencia`, e título/parágrafo/rótulo são os PADRÃO, que é o
          que o `copy-lock` guarda.

          `revelar` FICA DE FORA AQUI, e isto é a diferença em relação ao índice:
          não existe `reveal-calibre.ts` para `[slug]` — a SIS-273 declarou as
          subrotas fora de escopo e nenhuma issue de reveal as cobriu ainda.
          Inventar um par de números sem medição faria o trabalho daquela issue, e a
          rota não perde movimento que tivesse: hoje ela também não orquestra nada
          além da entrada do próprio cartão. É a mesma razão já escrita no mount de
          `/sistran-labs`.

          A emenda aqui é o caso de `/esg`: a seção de cima é o `<nav>` «Outras
          soluções» sobre o navy da rota, então a fronteira é escuro→claro e quem a
          costura é o `box-shadow` de 54px que `.cta-ref` já traz. Nada a passar por
          `className` (o ramo da referência não o encaminha). */}
      <ContactCTA layoutReferencia contatoNoModal />
    </PageShell>
  );
}

function Block({ block }: { block: AccelBlock }) {
  const heading = block.heading;
  /* SIS-120 · item 5 — o id vem de `idDoBloco`, a MESMA função que
     `pageSections.ts` usa para montar a lista do navegador lateral. Bloco sem
     título fica sem `id` e sem nome acessível, e é o comportamento certo: uma
     `<section>` sem nome não é anunciada como região, e o ponto de atenção da
     issue era exatamente não pendurar `aria-labelledby` apontando para nada.
     O id vai no `<h2>`, e não na `<section>`: é o padrão que este projeto já
     usa nas outras rotas e que o ScrollSpy resolve subindo para a `<section>`
     mais próxima (está escrito no cabeçalho de `pageSections.ts`). */
  const id = heading ? idDoBloco(heading) : undefined;

  return (
    <section className="section-py" aria-labelledby={id}>
      <div className="container-lp">
        {heading && (
          <h2 id={id} className="font-display text-section text-white">
            {heading}
          </h2>
        )}

        {block.kind === 'paragraphs' ? (
          <div className={heading ? 'mt-6 space-y-4' : 'space-y-4'}>
            {block.paragraphs.map((p) => (
              <p key={p.slice(0, 32)} className="max-w-3xl text-lg leading-relaxed text-white/85">
                {p}
              </p>
            ))}
          </div>
        ) : (
          <>
            {block.intro && (
              <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/85">{block.intro}</p>
            )}
            <ItemList block={block} />
          </>
        )}
      </div>
    </section>
  );
}

/* SIS-120 — `startIndex` saiu junto com o `index` do `Block`. Ele só servia para
   montar `key={`o-${startIndex}`}` no `<ol>`/`<ul>` logo abaixo, e `key` em
   elemento único (que não está dentro de um `map`) não é lido pelo React — era
   índice carregado por três assinaturas para nada. A `key` de cada bloco agora
   vem de `chaveDoBloco`, no lugar onde o `map` de verdade acontece. */
function ItemList({ block }: { block: Extract<AccelBlock, { kind: 'list' }> }) {
  const items = block.items.map((item, i) => (
    <li key={item.text} className="glass-card-hover relative overflow-hidden p-6">
      <span aria-hidden className="corner-accent" />
      {block.ordered && (
        <span
          aria-hidden
          /* SIS-155 — ordinal de lista é METADADO: `font-display` → `font-mono`.
             `text-sm` = 14px, acima do piso de 11px da issue. */
          /* SIS-155 — `font-semibold` NÃO é ênfase: a utilitária `font-mono` só troca a
             família, e sem peso declarado este nó pedia 400 — peso que o único corte
             carregado da Geist Mono (600) não tem. O navegador servia o 600 e o código
             dizia 400: se um dia entrar um corte 400 na Mono, oito pontos como este
             mudariam de aparência calados. Medido em 600 computado pela sonda. */
          className="font-mono font-semibold text-sm tabular-nums text-[#A5F0FF]"
          style={{ fontFeatureSettings: '"tnum" 1' }}
        >
          {String(i + 1).padStart(2, '0')}
        </span>
      )}
      {item.term ? (
        <>
          <h3 className="mt-2 font-display text-base leading-snug text-white">
            {item.term}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-white/85">{item.text}</p>
        </>
      ) : (
        <p className="mt-2 text-sm leading-relaxed text-white/90">{item.text}</p>
      )}
    </li>
  ));

  /* ol quando o site numera a lista, ul quando nao — a ordem tem significado
     apenas nas listas que o site apresenta numeradas. */
  const className = 'mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3';
  return block.ordered ? (
    <ol className={className}>{items}</ol>
  ) : (
    <ul className={className}>{items}</ul>
  );
}
