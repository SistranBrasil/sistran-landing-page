'use client';

/**
 * SIS-280 — O CORPO DA `/solucoes/luminna-ai`, na MESMA ARQUITETURA DE SEÇÕES da
 * `/solucoes/match-ai` (`MatchAiPagina`) e com IDENTIDADE PRÓPRIA.
 *
 * É A SÉTIMA E ÚLTIMA: com esta, `CORPOS_PROPRIOS` no `[slug]/page.tsx` passa a ter
 * SETE entradas e o caminho genérico (`page.blocks.map(...)` no template) fica SEM
 * NENHUMA slug de acelerador. O ramo NÃO foi removido — a razão está escrita lá, no
 * bloco que ele mesmo mantém: `AcceleratorPage` é um tipo público, e o dia em que uma
 * solução nova entrar no dado sem cápsula própria é o dia em que ele volta a servir.
 * Apagá-lo trocaria uma página genérica por uma tela de erro.
 *
 * A SLUG MUDOU DE GRAFIA NA MESMA ISSUE: a rota era `/solucoes/lumina-ai` (um n) e é
 * `/solucoes/luminna-ai`. O `id` é a slug — é ele que `accelerators.ts`,
 * `acceleratorPages.ts`, o sitemap e todo `/solucoes/${a.id}` montam —, então a troca
 * é de dado e não deste arquivo; o que este arquivo faz é ser registrado pela chave
 * nova. O endereço velho responde 308 por `next.config.mjs`.
 *
 * ── TODA A ESCRITA VEM DO SITE ────────────────────────────────────────────────
 * Nada de copy das irmãs e nenhum claim novo. As fontes são as já publicadas:
 *   1. `src/data/acceleratorPages.ts` → o `lead`, os TRÊS blocos `kind: 'list'`
 *      («Desafios no desenvolvimento de software», 4 itens; «Benefícios», 7;
 *      «Integração Versátil», `intro` + 4) e o bloco final de DOIS parágrafos.
 *   2. `src/data/accelerators.ts` → a `description` do cartão da vitrine, usada UMA
 *      vez, como apoio do primeiro título.
 *
 * A DIFERENÇA DE DADO EM RELAÇÃO ÀS IRMÃS, e ela muda o trabalho: esta é a slug com
 * MAIS conteúdo estruturado das sete — três listas, e duas delas com `term` + `text`.
 * O Guru tinha cinco parágrafos soltos, o Smart Miner só parágrafos, o QA uma lista.
 * Aqui não há nada a inferir do texto: cada lista já vem com a sua faixa pronta, e é
 * por isso que esta página não tem função de triagem (`ehFala()` do Guru) — inventar
 * uma seria acrescentar mecanismo para um dado que não precisa dele.
 * Os blocos são achados por `heading`, e não por índice: índice é dependência
 * invisível, e um bloco novo no dado reordenaria as faixas em silêncio.
 *
 * ── OS TÍTULOS DE FAIXA QUE O DADO NÃO TEM ────────────────────────────────────
 * Três blocos têm `heading` e o último não tem nenhum; a arquitetura do Match AI tem
 * um título por faixa, logo DUAS faixas precisavam de título (a de campanha e a de
 * fecho) e nenhum podia ser inventado. Os dois são FRAGMENTOS VERBATIM do texto que a
 * própria faixa publica, com só a inicial elevada:
 *   - «Todo o Ciclo de Vida de Desenvolvimento de Software» está no `lead`, que a
 *     faixa 2 publica INTEIRO logo abaixo;
 *   - «Uma revolução no desenvolvimento de software» está no primeiro dos dois
 *     parágrafos que a faixa 6 publica.
 * É a régua de «derivar rótulo, não inventar claim» das quatro irmãs.
 *
 * ── `pageSections` / ÂNCORAS: AQUI TEM INDICADOR ──────────────────────────────
 * `SECOES_DE_ACELERADOR` monta as paradas percorrendo os blocos COM `heading` e
 * devolve `VAZIO` quando sobram menos de três. Esta slug tem TRÊS `heading` →
 * «Início» + três paradas = 4 → a rota TEM indicador lateral. Logo:
 *   - os `id` das três faixas de dado saem de `idDoBloco(heading)`, o mesmo dono que
 *     `pageSections.ts` usa — `desafios-no-desenvolvimento-de-software`, `beneficios`
 *     e `integracao-versatil`;
 *   - `id="topo"` no hero é OBRIGATÓRIO, porque é a âncora de «Início» e ela vinha do
 *     `PageHero`, que esta slug deixa de montar;
 *   - os dois títulos DERIVADOS acima não são `heading` de bloco, então não entram na
 *     lista de paradas — e é o certo: parada tem de existir no dado;
 *   - a slug SAIU de `TOM_MEDIO_DE_ACELERADOR` e entrou em `TOM_CLARO_DE_ACELERADOR`
 *     com DUAS das três paradas. «Benefícios» é a faixa ESCURA aqui e fica sem chave,
 *     que é o contrato daquele par de mapas (escuro = ausência). A linha removida
 *     ficou comentada lá com o motivo, e ela trocou de grafia junto.
 *
 * ── SIS-220 (2ª volta) · A CONTA DE «TRÊS BLOCOS» ACIMA CADUCOU: SÃO QUATRO ────
 * Entrou o bloco «Luminna AI» (eyebrow «Ecossistema», 8 produtos com `highlights` de
 * métrica), entre «Benefícios» e «Integração Versátil». Tudo que os dois parágrafos
 * acima dizem continua valendo, com os números corrigidos: QUATRO `heading` →
 * «Início» + quatro paradas = 5, e a âncora nova é `luminna-ai` (é `idDoBloco` da
 * marca, e por isso é homônima da chave da slug em `pageSections.ts` — a ressalva
 * está escrita lá). A faixa é clara, logo a slug está no mapa CLARO com TRÊS das
 * quatro paradas; «Benefícios» segue a única escura e sem chave.
 * Os números de faixa das referências acima («faixa 2», «faixa 6») NÃO mudaram: a
 * seção nova é a «4-B» exatamente para não invalidá-los.
 *
 * ── IDENTIDADE PRÓPRIA (variar 1–2 componentes vs as irmãs) ───────────────────
 * O assunto desta solução é ESTEIRA DE DESENVOLVIMENTO — SDLC, DevOps, ferramentas
 * integradas —, e as três peças que divergem desenham isso:
 *   1. O GRAFISMO DE CANTO é `AnelDoCiclo`: órbitas concêntricas que GIRAM, com um
 *      ponto orbitando e marcas de borda — o ciclo de vida que não tem fim. Lá é
 *      circuito (Match AI), esteira de documentos (Smart Miner), malha de casos (QA),
 *      ondas de voz (Guru) e pacotes marchando no fio (Connect API). A mecânica é a
 *      da casa: traço normalizado com `pathLength="1"`, máscara por elemento em vez
 *      de `<defs>`/`id`, porque o componente é montado várias vezes na mesma página.
 *   2. O CARD da grade tem TRILHO DE ETAPA NO PÉ, uma barra que se preenche na base
 *      do cartão — não a tira vertical (QA), a faixa 16/9 no topo (Smart Miner), a
 *      miniatura na lateral (Match AI) nem o medalhão redondo (Guru). É o indicador
 *      de progresso de esteira, que é o vocabulário desta solução.
 *   3. O FIO da faixa escura é VERTICAL, com um pulso que DESCE — todas as irmãs têm
 *      fio horizontal entre passos lado a lado. Aqui os sete benefícios empilham numa
 *      coluna e o que viaja é o commit descendo o pipeline.
 * NÃO ENTRA CARIMBO: não existe cápsula `carimbo-…-luminna-…` em `public/` — as que
 * existem são de `match-ai`, `smart-miner`, `fast` e `connect-api`, e usar qualquer
 * uma publicaria o nome de OUTRO produto no topo desta rota.
 *
 * ── SIS-220 · A PREMISSA DO PARÁGRAFO ACIMA CADUCOU (e ele fica como histórico) ─
 * «NÃO ENTRA CARIMBO» era verdade porque as artes não existiam. Chegaram DUAS, e
 * nenhuma delas nomeia produto — elas nomeiam SEÇÃO, que é justamente o que faltava:
 *   public/carimbo-desafios-ticket-outline-0757c7.png    807 × 288 (medido no arquivo)
 *   public/carimbo-beneficios-ticket-outline-0757c7.png  807 × 288
 * Então o motivo original («publicaria o nome de outro produto») não se aplica a
 * estas duas, e elas entram nas faixas 3 e 4 por `CarimboBatida`. O que NÃO mudou:
 * segue não havendo cápsula de ABERTURA para esta slug, e o hero segue sem carimbo.
 *
 * ⚠️ AS DUAS ARTES SÃO CONTORNO `#0757c7` (a cor está no nome do arquivo), e a de
 * «Benefícios» vai para a ÚNICA faixa navy da página. Contorno azul-médio sobre
 * `#001A3D` é quase invisível, e o aceite pede carimbo LEGÍVEL — então na faixa
 * escura a tinta é reacendida no CSS (`.luminna-carimbo--escuro`), não trocada de
 * arte: não existe variante branca com a palavra «Benefícios», e a única branca em
 * `public/` diz «COMO Agimos», que é outra seção de outra rota.
 *
 * ── SIS-220 (2ª volta) · E ESSA RESSALVA TAMBÉM CADUCOU: A ARTE BRANCA CHEGOU ───
 * O parágrafo acima fica como histórico de por que o filtro existiu. A premissa era
 * «não existe variante branca com a palavra Benefícios» — passou a existir:
 * `carimbo-beneficios-ticket-outline-ffffff.png`, #FFFFFF em 100% dos pixels
 * opacos (conferido no pixel, não no nome do arquivo). Com contraste nativo sobre
 * `#001A3D`, `.luminna-carimbo--escuro` perdeu a razão de ser e SAIU do JSX e do
 * CSS. Não era inofensivo deixar: o `opacity: 0.92` do hack rebaixaria a arte
 * branca de graça, e um `filter` no nó da cápsula cria contexto de empilhamento,
 * que é referência que a animação da batida não deve ganhar sem motivo.
 * O `alt` das duas é VAZIO de propósito, e é o caso que o próprio `CarimboBatida`
 * documenta («vazio só se houver um equivalente textual ao lado»): a arte traz
 * escrita a MESMA palavra do `h2` que está do lado, e `alt` preenchido faria o leitor
 * de tela anunciar «Desafios… Desafios».
 *
 * ── SIS-220 · O VÍDEO «SOBRE O LUMINNA AI» É O DA HOME, O MESMO COMPONENTE ─────
 * `<ImpactSequence />` entra nesta rota SEM CÓPIA e SEM PARÂMETRO NOVO: a seção que
 * a home monta em `app/page.tsx:429` já é sobre este produto — o `h2` dela é
 * literalmente «Sobre o Luminna AI», o texto e o `kicker` vêm de
 * `src/data/legacy.ts` (`impactSequence`) e o vídeo é o `impacto-assembly-scroll.mp4`
 * (SIS-226). Duplicar o bloco com dado próprio era o caminho de as duas leituras
 * divergirem na primeira troca de vídeo.
 * ⚠️ ELE FICA FORA DE QUALQUER `RevealScope`, como na home: a seção é `sticky` e
 * `RevealScope` viraria ancestral com `transform`, que é o que troca a referência do
 * `sticky` da janela para a caixa (a nota está no próprio `ImpactSequence`). É por
 * isso que este é o único bloco desta página montado nu, sem envelope de reveal.
 * ⚠️ A SUPERFÍCIE DELE NÃO É O PLANO DA ROTA: `.sequence` é `.lp-section--cream`,
 * opaca, e é o que o aceite chama de «creme preservado». O plano contínuo passa por
 * baixo sem regra nenhuma.
 *
 * ── SIS-220 · `docs/fonte2.md`: CONFERIDO ITEM A ITEM, NADA A MUDAR ───────────
 * O item 3 da issue pede a manuscrita «em 1–2 pontos» e diz «completar/alinhar ao
 * doc». Conferido linha por linha contra `docs/fonte2.md`, o hero já cumpre o
 * documento INTEIRO: texto HTML e não pixel, Kalam com Caveat/`cursive` de reserva,
 * peso 400, as QUATRO linhas exatas, `#123B5D`, `line-height: 0.95`,
 * `clamp(30px, 3vw, 50px)`, `rotate: -4deg`, traço `#16BFE8` de ~45px inclinado e
 * desenhado da esquerda para a direita, pouso na área clara e reposicionamento no
 * telefone (ver o bloco `.luminna-frase` no `globals.css`). Não sobrou item.
 * O SEGUNDO PONTO NÃO FOI ABERTO, e é decisão e não esquecimento: o documento
 * especifica UMA frase, e qualquer segundo ponto sairia de um dos dois lugares
 * proibidos — escrever frase nova (o «não reescrever a copy» do próprio pedido) ou
 * jogar um parágrafo já publicado no `clamp(30px, 3vw, 50px)` da manuscrita, que é
 * corpo de 30–50px para três linhas de texto corrido. «1–2» está cumprido em 1.
 *
 * ── SIS-220 · ITEM 2: O PLANO DA ROTA NÃO NASCE AQUI ─────────────────────────
 * `classeDoMain="luminna-canvas"` e `<AtmosferaQuadrados classe="luminna-atmosfera" />`
 * são montados no `PageShell` de `solucoes/[slug]/page.tsx`, porque é lá que o
 * `<main>` desta rota existe — este arquivo é o CONTEÚDO dele. As faixas claras
 * deixam de pintar por `.luminna-canvas .section-light` no `globals.css`; as navy
 * (`bg-[#001A3D]`) e o hero sangrado seguem opacos e cobrem o plano sem regra.
 *
 * ── A CAPA: POR QUE ELA NÃO VEM DE `capasSolucoes.ts` ─────────────────────────
 * `CAPAS_DE_ABERTURA` tem SEIS entradas e a ausência desta é DELIBERADA — item 4 da
 * SIS-286, e está escrito no docblock daquele arquivo. Acrescentar entrada aqui
 * traria um `className: 'hero-backdrop--luminna-ai'` que é gancho de CSS sem regra
 * nenhuma do outro lado, e o único leitor do `className` do mapa é o template
 * genérico, que esta slug deixa de usar. Então a arte do hero é declarada LOCALMENTE,
 * a partir de `VITRINE.capaCard` — a mesma derivada WebP que o cartão da vitrine já
 * serve, o que importa porque com `images: { unoptimized: true }` (SIS-154) o
 * `next/image` entrega o arquivo como ele está no disco.
 *
 * ── A COR ────────────────────────────────────────────────────────────────────
 * `#57B7EE` é o `tone` que `accelerators.ts` declara para o Luminna AI (azul claro;
 * o do Guru e do Match são cianos, o do Smart Miner é menta). Ela vale SÓ nas faixas
 * escuras — sobre folha clara ela é textura a 12%, mas como TINTA reprova no piso de
 * contraste (o número que reprovou o ciano do Match AI, 1,03:1, foi medido na SIS-292
 * e a régua é a mesma). Nas faixas claras a tinta de grafismo é o azul institucional
 * `#0079CB`, como nas cinco irmãs.
 *
 * ── O LETREIRO É IMAGEM ───────────────────────────────────────────────────────
 * O `h1` carrega `images/solucoes/luminnadoisnn.png` (2172×724), a arte canônica
 * que `accelerators.ts` também serve nos cartões, achada pelo `id` e não digitada.
 * A imagem traz a grafia LUMINNA com dois n e a tagline; o `alt` é `page.name` —
 * «Luminna AI», também com dois n — e NÃO vazio: `h1` cujo conteúdo inteiro é
 * imagem com `alt=""` é cabeçalho sem nome acessível.
 *
 * ── MOVIMENTO ────────────────────────────────────────────────────────────────
 * `RevealScope` + `data-reveal` + `./reveal-calibre`, que é o mecanismo do Match AI (e
 * não o `variants` de `@/lib/motion` do `FastPagina`): a issue manda espelhar o
 * motion/reveal do Match AI, e a razão de não somar os dois está no docblock dele
 * (dois donos do mesmo `transform`). `esperarRota` SÓ no escopo do hero, pelo contrato
 * da SIS-269. O movimento em laço é todo CSS, no bloco `SIS-280 · luminna` do fim do
 * `globals.css`, com os DOIS canais de movimento reduzido.
 */

/* SIS-220 (5ª volta) — `useState` saiu com o único estado do arquivo (o do modal de
   contato, que perdeu o gatilho junto com o CTA do hero).
   import { useState } from 'react'; */
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  BrainCircuit,
  Coins,
  ExternalLink,
  FileText,
  Gauge,
  GitBranch,
  ListChecks,
  Rocket,
  ScanSearch,
  ShieldCheck,
  Smile,
  Sparkles,
  Target,
  TrendingUp,
  Wrench,
} from 'lucide-react';
import CarimboBatida from '@/components/CarimboBatida';
import EcossistemaLuminna from './EcossistemaLuminna';
/* SIS-220 (5ª volta) — DUAS montagens seguem fora da rota e os imports vão com elas,
   senão o lint aponta símbolo não usado: o modal de contato (sem gatilho) e a
   ImpactSequence (copy de `legacy.ts` que duplica o fecho e o título dos Desafios). A
   razão de cada uma está escrita no lugar onde ela estava.
   O ECOSSISTEMA SAIU DESTA LISTA em 02/10: ele voltou à rota a pedido, e o import
   acima é o dele. A razão da volta está em `acceleratorPages.ts`, em cima do bloco
   `paragraphs` «Tecnologia aplicada em todo o ciclo».
   import ContactModal from '@/components/ContactModal';
   import { ImpactSequence } from '@/components/legacy/ImpactSequence'; */
import HeroVideoBackdrop from '@/components/ui/HeroVideoBackdrop';
import RevealScope from '@/components/motion/RevealScope';
import { ACCELERATORS } from '@/data/accelerators';
import { ACCELERATOR_PAGES, idDoBloco, type AcceleratorPage } from '@/data/acceleratorPages';
import { LIMIAR_REVEAL, MARGEM_REVEAL } from './reveal-calibre';

/* O cartão da vitrine desta solução: a `description` (apoio do primeiro título), a
   `capaCard` (a arte do hero e dos placeholders) e o LOGO do letreiro. Achado por `id`
   e não digitado — duas cópias do mesmo caminho divergiriam na primeira troca de arte.
   A razão de a capa sair daqui e não de `capasSolucoes.ts` está no docblock. */
const VITRINE = ACCELERATORS.find((a) => a.id === 'luminna-ai');

/* ── O PREVIEW DO «DESCUBRA LUMINNA» ──────────────────────────────────────────
   Destino e host em constantes, e o host DERIVADO da URL em vez de digitado: o
   endereço aparece em três lugares da peça (a barra do navegador, a legenda visível e
   o nome acessível do link), e três literais iguais divergem na primeira troca.
   `new URL(...).host` resolve isso em tempo de módulo, sem custo por render.
   O molde é o do preview da rota irmã do SDS (`SdsPagina.tsx`, «Demonstração
   oficial»): moldura com barra de navegador, o cartão INTEIRO como âncora e legenda
   em `sr-only`. A diferença é a mídia — lá é um screenshot parado, aqui é o laço de
   `/videos/luminnaloop.mp4`. */
const DESCUBRA_URL = 'https://descubra.luminna.sistran.com.br/';
const DESCUBRA_HOST = new URL(DESCUBRA_URL).host;
const DESCUBRA_VIDEO = '/videos/luminnaloop.mp4';
/* Pôster gerado do QUADRO 0 do próprio arquivo (ffmpeg, `select=eq(n\,0)`), como o de
   `jornada.mp4`: é ele que cobre o intervalo até o primeiro quadro chegar e é ele que
   fica para quem pede menos movimento, quando o laço é pausado em `currentTime = 0`.
   Qualquer outro quadro apareceria como um salto no instante da pausa. */
const DESCUBRA_POSTER = '/videos/luminnaloop-poster.webp';
/* A proporção é a do ARQUIVO (1280×720, medido com ffprobe), então `object-cover` não
   tem o que recortar e a caixa não pula quando o vídeo chega. */
const DESCUBRA_PROPORCAO = '16 / 9';

/* ── OS ÍCONES DOS CARDS DE «DESAFIOS» ─────────────────────────────────────────
   Na ordem dos itens do dado, e cada um é leitura literal do `term` que acompanha:
   curva ascendente (Demanda Crescente), chave inglesa (Débitos Técnicos), escudo
   (Segurança e Conformidade), folha de texto (Documentação Eficiente). São só ícones:
   nenhum texto de card nasce aqui. */
const ICONES_DESAFIOS = [TrendingUp, Wrench, ShieldCheck, FileText];

/* ── OS ÍCONES DOS SETE BENEFÍCIOS ─────────────────────────────────────────────
   Mesma regra, na ordem do dado: selo de aprovação (Qualidade e Confiabilidade),
   medidor (Produtividade), moedas (Retrabalho e Custos), rosto (Satisfação do
   Cliente), alvo (Previsões e Estimativas), foguete (Time to Market), escudo
   (Robustez de Sistemas). */
const ICONES_BENEFICIOS = [BadgeCheck, Gauge, Coins, Smile, Target, Rocket, ShieldCheck];

/* ── OS ÍCONES DAS QUATRO CATEGORIAS DE INTEGRAÇÃO ─────────────────────────────
   Ramificação (Repositórios de código), lupa de varredura (Ferramentas de Análise de
   Código), circuito (Serviços de IA), lista de checagem (Ferramentas de Gestão de
   Projetos). */
const ICONES_INTEGRACAO = [GitBranch, ScanSearch, BrainCircuit, ListChecks];

/* ── OS ÍCONES DO ECOSSISTEMA MUDARAM DE CASA (SIS-220, 3ª volta) ─────────────
   A tabela vive em `EcossistemaLuminna.tsx`, junto da faixa que a usa, e passou a
   ser mapa POR `id` em vez de array por índice — por índice, incluir um produto no
   meio da lista trocaria o glifo de todos os seguintes em silêncio. Os oito glifos
   são os mesmos. O que estava aqui:

   | const ICONES_ECOSSISTEMA = [
   |   BookOpen,
   |   Ruler,
   |   CodeXml,
   |   Bug,
   |   FileText,
   |   FlaskConical,
   |   ClipboardCheck,
   |   Terminal,
   | ];
*/

/* ── AS MARCAS DE CADA CATEGORIA DE INTEGRAÇÃO (SIS-280 item 3) ────────────────
   A mock `public/images/integracao.png` mostra, em cada um dos quatro cartões, uma
   fileira de PÍLULAS BRANCAS com o logotipo de cada ferramenta. A issue amarra a
   origem: «logos SÓ de `public/images/solucoes/luminna/`». Então esta tabela é o
   inventário daquela pasta, distribuído pelas quatro categorias do dado — nenhum
   caminho vem de fora dela e nenhuma arte foi criada.
   AS DUAS LACUNAS DECLARADAS, e elas são da própria issue: a mock exibe GITHUB (no
   cartão de repositórios) e OPENAI (no de serviços de IA), e a pasta NÃO tem esses
   dois arquivos. A issue manda reportar, não inventar — então as duas pílulas
   simplesmente não existem aqui, e a falta está medida no comentário da issue. Não
   foi usado desenho parecido no lugar: pílula com o logo errado publica marca de
   terceiro que não é aquela.
   OS DOIS EXTRAS QUE FICAM DE FORA: `java` e `python` estão na pasta e a issue diz
   «não forçar». Eles são LINGUAGEM, não ferramenta integrada, e nenhuma das quatro
   categorias do dado é sobre linguagem — entrariam como enfeite numa fileira que a
   mock usa para dizer «com o quê o Luminna conversa».

   ── SIS-220 (2ª volta, item 3) · JAVA E PYTHON ENTRAM, POR DECISÃO DA ISSUE ─────
   O parágrafo acima fica como histórico: a leitura («linguagem ≠ ferramenta») não
   mudou, a DECISÃO mudou — «hoje omite de propósito … agora entram». Registrar isso
   importa para a próxima volta não desfazer por achar que foi descuido.

   EM QUAL CARTÃO, e a escolha é declarada porque a issue pede que seja: os quatro
   são «Repositórios de código», «Ferramentas de Análise de Código», «Serviços de IA»
   e «Ferramentas de Gestão de Projetos». A issue prefere «o cartão de
   repositórios/stack se o dado tiver» — não existe cartão de stack, então vão para
   REPOSITÓRIOS DE CÓDIGO: é a única das quatro categorias cujo assunto é o código em
   si, e não uma ferramenta que age sobre ele. «Análise de Código» seria defensável
   (SonarQube e Fortify analisam Java e Python), mas ali a fileira lista o ANALISADOR,
   e pôr a linguagem ao lado dele troca o sujeito da frase. A ambiguidade está
   reportada no comentário da issue, como ela manda.

   `largura` das duas calculada da proporção intrínseca MEDIDA, na mesma régua de
   20px do resto da tabela:
       java   1677 × 2048 → 20 × 1677/2048 = 16,4 → 16
       python 2048 × 1556 → 20 × 2048/1556 = 26,3 → 26
   Java é a única arte RETRATO da tabela (mais alta que larga), e é por isso que ela
   sai tão estreita: a régua é a ALTURA, e a altura dela é o lado maior.

   `largura` é a largura da pílula para ALTURA FIXA de 20px, calculada da proporção
   INTRÍNSECA de cada PNG (todos 2048px de lado maior). Com `images: { unoptimized:
   true }` (SIS-154) o par `width`/`height` não corta arquivo nenhum: ele reserva a
   caixa e impede que a marca chegue distorcida.
   `rotulo` é o `alt`, e não vazio: a pílula É a informação («integra com o Jira»), e
   logo de terceiro sem nome é conteúdo que não existe para leitor de tela. */
const MARCAS_DE_INTEGRACAO: { rotulo: string; arquivo: string; largura: number }[][] = [
  [
    { rotulo: 'Microsoft Azure', arquivo: 'azure-logo-hd-transparente.png', largura: 62 },
    { rotulo: 'Bitbucket', arquivo: 'bitbucket-logo-hd-transparente.png', largura: 52 },
    /* SIS-220 (2ª volta, item 3) — as duas linguagens, aqui e não nos outros três
       cartões. O porquê está no docblock acima. */
    { rotulo: 'Java', arquivo: 'java-logo-hd-transparente.png', largura: 16 },
    { rotulo: 'Python', arquivo: 'python-logo-hd-transparente.png', largura: 26 },
  ],
  [
    { rotulo: 'OpenText Fortify', arquivo: 'fortify-logo-hd-transparente.png', largura: 51 },
    { rotulo: 'SonarQube', arquivo: 'sonarqube-logo-hd-transparente.png', largura: 71 },
  ],
  [
    { rotulo: 'AWS', arquivo: 'aws-logo-hd-transparente.png', largura: 31 },
    { rotulo: 'GitHub Copilot', arquivo: 'github-copilot-logo-hd-transparente.png', largura: 19 },
    { rotulo: 'Microsoft Copilot', arquivo: 'microsoft-copilot-logo-hd-transparente.png', largura: 21 },
  ],
  [
    { rotulo: 'Azure DevOps', arquivo: 'azure-devops-logo-hd-transparente.png', largura: 24 },
    { rotulo: 'Jira', arquivo: 'jira-logo-hd-transparente.png', largura: 53 },
  ],
];

/* ── SIS-220 · item 4 — A ALTURA DAS LOGOS DAS PÍLULAS ─────────────────────────
   Era 20px de logo dentro de uma cápsula de 32px (`h-8` / `h-5`), e o pedido é
   «aumentar bastante, de forma clara»: passa a 36px de logo em cápsula de 56px, ou
   seja 1,8× a marca e 1,75× a cápsula. Não é um número escolhido no olho: 36px é o
   ponto em que a marca mais ESTREITA desta tabela (o Copilot do GitHub, 19px de
   largura para 20px de altura) alcança ~34px de largura — abaixo disso ela continua
   do tamanho de um ícone ao lado de palavras como «SonarQube», que é o desequilíbrio
   que a mock não tem.
   A CONSTANTE EXISTE PARA A TABELA ABAIXO NÃO PRECISAR SER REESCRITA: as `largura`
   continuam declaradas para a altura de REFERÊNCIA de 20px (foi assim que saíram da
   proporção intrínseca de cada PNG, todos com 2048px de lado maior), e a largura
   publicada é derivada. Reescrever as nove à mão seria nove chances de achatar uma
   marca de terceiro, que é o defeito que `width`/`height` existem para evitar com
   `images: { unoptimized: true }` (SIS-154). */
const ALTURA_LOGO_PILULA = 36;
const ALTURA_LOGO_REFERENCIA = 20;
const larguraDaPilula = (larguraEm20: number) =>
  Math.round((larguraEm20 * ALTURA_LOGO_PILULA) / ALTURA_LOGO_REFERENCIA);

/* ── SIS-220 · item 5 — AS DUAS CÁPSULAS DE SEÇÃO ──────────────────────────────
   Dimensões MEDIDAS nos arquivos, e não estimadas: é desse par que `CarimboBatida`
   monta o `--carimbo-batida-ar`, e é esse `aspect-ratio` que impede a cápsula de
   achatar.

   SIS-220 (2ª volta, itens 1 e 2) — AS DUAS ARTES FORAM TROCADAS, e as duas mudaram
   de razão de aspecto, então o par de dimensões tinha de mudar junto:

     Desafios   807 × 288 (2,80:1) → 993 × 300 (3,31:1)
     Benefícios 807 × 288 (2,80:1) → 771 × 288 (2,68:1)

   Medido com `sharp` nos arquivos instalados, não copiado da issue (os números
   coincidem com os dela). As duas têm canal alfa real, e a tinta foi conferida no
   pixel: a de Desafios é #0757C7 chapado em 97% dos pixels opacos (7,87,199, o
   resto é antialiasing da borda) e a de Benefícios é #FFFFFF em 100% deles.

   OS ARQUIVOS SAÍRAM DA RAIZ DE `public/` para
   `public/images/solucoes/luminna/carimbo/`, que é onde a issue os endereça — e é
   melhor lugar: as artes desta rota passam a morar junto das logos dela.

   ⚠️ E ELES NÃO ESTAVAM NO DISCO. Os dois caminhos antigos
   (`/carimbo-desafios-…`, `/carimbo-beneficios-…`) apontavam para arquivos ausentes
   da árvore de trabalho — a volta anterior os deixou apenas no índice do git e a
   árvore foi revertida depois. Ou seja: as duas seções serviam 404 até esta volta.
   As artes novas vieram dos anexos da própria issue e estão versionadas. */
/* `alt` VAZIO nas duas — a razão está no docblock: a arte escreve a mesma palavra do
   `h2` que fica ao lado.
   `gatilho: 'viewport'` nas duas, e não `'rota'`: as duas faixas nascem MUITO abaixo
   da dobra (a 3ª e a 4ª seções de uma página de seis), e bater na montagem seria
   bater com a peça fora de quadro — quem rolasse até lá encontraria o carimbo já
   assentado. É a distinção que o próprio componente documenta. */
const CARIMBO_DESAFIOS = {
  src: '/images/solucoes/luminna/carimbo/carimbo-desenvolvimento-ticket-outline-0757c7.png',
  largura: 993,
  altura: 300,
};
const CARIMBO_BENEFICIOS = {
  src: '/images/solucoes/luminna/carimbo/carimbo-beneficios-ticket-outline-ffffff.png',
  largura: 771,
  altura: 288,
};
/* ── SIS-220 (onda visual) · O CARIMBO DA CAPA ─────────────────────────────────
   «SISTRAN / Luminna AI», ticket de contorno BRANCO, acima do letreiro.
   780 × 288 lido no IHDR do arquivo (2,71:1) — medido, não copiado da issue, porque
   `CarimboBatida` monta `--carimbo-batida-ar` a partir deste par e um par errado
   ACHATA a cápsula em silêncio em vez de dar erro.
   A TINTA NÃO É RECOLORIDA, e isso é medido: #FFFFFF em 100% dos pixels opacos, com
   canal alfa real. Sobre o hero escuro o contraste é nativo — a issue manda «não
   inventar versão azul» e não há `filter` nenhum aqui (ver, no `globals.css`, por que
   o hack de recolorir dos Benefícios foi retirado quando a arte branca apareceu).
   ⚠️ O CAMINHO É A RAIZ DE `images/`, e não `images/solucoes/luminna/carimbo/`, onde
   moram os outros dois desta rota. É onde a issue endereça o arquivo e é onde ele
   está no disco; não movi para não trocar o caminho que a issue cita. Se a arte for
   arrumada de lugar um dia, o par a mexer é este `src` e o arquivo.
   `gatilho: 'rota'` — e aqui é o contrário dos outros dois: esta peça está NA DOBRA,
   então bater na montagem é exatamente o que se quer. `'viewport'` a deixaria
   esperando um cruzamento que já aconteceu. */
const CARIMBO_CAPA = {
  src: '/images/carimbo-luminna-ai-ticket-outline-ffffff.png',
  largura: 780,
  altura: 288,
};

/* ── SIS-220 · item 4 — A MARCA DO HUB ─────────────────────────────────────────
   A arte BRANCA do produto, que é uma das duas que a issue nomeia («`luminnadoisnn.png`
   / arte branca»). Entre as duas, esta: o hub é um disco `#001A3D` e este arquivo é
   vetor de tinta branca com o ponto em `#71d0f6`, então ele não precisa de véu nem
   perde definição quando o disco cresce. O `luminnadoisnn.png` traz a TAGLINE junto
   da marca — dentro de um disco, a tagline chegaria a ~8px de altura, ilegível, e é
   ela que o hero já publica em tamanho de letreiro.
   As dimensões são as do `viewBox` do próprio arquivo (2882,24 × 823,85, arredondadas
   para cima): com `unoptimized` elas só reservam a caixa. */
const LOGO_DO_HUB = {
  src: '/luminna-logo-branca.svg',
  largura: 2883,
  altura: 824,
};

/* A POSIÇÃO DE CADA CARTÃO NO ARRANJO DA MOCK, de `lg` para cima: dois à esquerda,
   dois à direita, o hub na coluna do meio. Abaixo de `lg` não há nada a posicionar —
   a grade colapsa numa coluna e a ordem do DOM (hub, depois os quatro cartões na
   ordem do dado) é a ordem de leitura.
   É tabela e não `nth-child` no CSS porque quem sabe a ordem é o dado: um quinto item
   entraria sem posição declarada em vez de cair em cima do hub. */
const POSICOES_DE_INTEGRACAO = [
  'lg:col-start-1 lg:row-start-1',
  'lg:col-start-3 lg:row-start-1',
  'lg:col-start-1 lg:row-start-2',
  'lg:col-start-3 lg:row-start-2',
];

/* ── AS LIGAÇÕES CURVAS DO HUB ATÉ OS CARTÕES (o desenho central da mock) ──────
   HTML/CSS e não a imagem da mock: a issue proíbe «`<img>` único da mock» — o que se
   reproduz é o LAYOUT, e num `<img>` nada disso é texto, nada responde a largura e
   nada respeita movimento reduzido.
   `preserveAspectRatio="none"` com `viewBox` de 0–100 nos dois eixos: as coordenadas
   passam a ser PORCENTAGEM da caixa da grade, então a curva encosta no hub e no canto
   interno de cada cartão em qualquer largura, sem recalibrar número por breakpoint. A
   distorção horizontal é desejada — a curva tem de acompanhar a caixa, que é larga.
   POR ISSO os PONTOS das pontas NÃO são `<circle>` daqui: círculo neste `viewBox`
   sairia elipse. Eles são nós posicionados em porcentagem pelo CSS (`.luminna-elo`),
   com as MESMAS coordenadas declaradas abaixo — uma fonte só para os dois.
   O pulso que percorre cada curva é `stroke-dashoffset` com `pathLength="1"`, a
   mecânica de traço da casa; ele para nos dois canais de movimento reduzido. */
const ELOS_DO_HUB = [
  { curva: 'M50 50 C 44 42 40 33 33 27', x: 33, y: 27 },
  { curva: 'M50 50 C 56 42 60 33 67 27', x: 67, y: 27 },
  { curva: 'M50 50 C 44 58 40 67 33 73', x: 33, y: 73 },
  { curva: 'M50 50 C 56 58 60 67 67 73', x: 67, y: 73 },
];

function LigacoesDoHub() {
  return (
    <>
      <svg
        aria-hidden
        className="luminna-elos pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {ELOS_DO_HUB.map((elo) => (
          <g key={elo.curva}>
            <path className="luminna-elo-base" d={elo.curva} />
            <path className="luminna-elo-pulso" pathLength="1" d={elo.curva} />
          </g>
        ))}
      </svg>
      {ELOS_DO_HUB.map((elo) => (
        <span
          key={`${elo.x}-${elo.y}`}
          aria-hidden
          className="luminna-elo-ponta"
          style={{ left: `${elo.x}%`, top: `${elo.y}%` }}
        />
      ))}
    </>
  );
}

/* Os dois títulos de faixa que o dado não tem, como constantes e não literais no JSX:
   cada um é usado DUAS vezes (o `aria-labelledby` da seção e o `id` do `h2`), e duas
   cópias de string a virar âncora é o jeito de as duas divergirem. A procedência de
   cada um está no docblock — os dois são fragmento verbatim do texto da própria
   faixa. */
const TITULO_SDLC = 'Todo o Ciclo de Vida de Desenvolvimento de Software';
const TITULO_REVOLUCAO = 'Uma revolução no desenvolvimento de software';

/* ── SIS-220 (onda visual, item 5) · «LUMINNA AI» REALÇADO NO CARTÃO DO FECHO ──
   O mesmo tratamento de PERSONALIZAÇÃO no Match AI (`MatchAiPagina.tsx:795`): tarja
   `#0060A8` com texto branco. A grafia fica «Luminna AI» como está no dado — o Match
   AI usa caixa alta porque o TERMO DELE é caixa alta, não porque a tarja exija.

   Por que uma função e não o texto partido à mão no JSX: a copy é dado
   (`acceleratorPages.ts`) e tem de continuar sendo. Escrever `O `, `<mark>`, ` representa…`
   no componente faria o parágrafo existir em dois lugares, e o `copy-lock` passaria a
   ver dois fragmentos onde há uma frase. Aqui o dado entra inteiro e a partição é
   derivada dele.

   `split` com separador capturado devolve os pedaços intercalados com os casamentos,
   então os índices PARES são texto e os ÍMPARES são o termo. É por isso que a `key`
   pode ser o índice: a lista é derivada de uma string imutável na renderização, não
   uma coleção reordenável.

   ⚠️ CASA A GRAFIA EXATA, com dois `n`. Se alguém «corrigir» o dado para «Lumina»
   (é como o paste escreve, e a 5ª volta normalizou justamente isso), o realce
   simplesmente não acende — o texto continua certo, sem tarja. Falha silenciosa e
   inofensiva, de propósito: melhor um parágrafo sem destaque que um `<mark>` em volta
   de meia palavra. */
const TERMO_REALCADO = 'Luminna AI';

function realcarLuminna(texto: string) {
  /* Regex com GRUPO para o separador vir junto; `g` para pegar todas as ocorrências.
     O termo não tem metacaractere nenhum, então não precisa de escape. */
  return texto.split(new RegExp(`(${TERMO_REALCADO})`, 'g')).map((pedaco, i) =>
    i % 2 === 1 ? (
      <mark
        key={i}
        className="rounded bg-[#0060A8] px-1.5 py-0.5 font-semibold !text-white"
      >
        {pedaco}
      </mark>
    ) : (
      pedaco
    ),
  );
}

/* O índice da cascata vive em `--reveal-i`; o atraso sai de
   `calc(var(--motion-stagger-reveal) * var(--reveal-i))`. Mesmo helper das irmãs, pela
   mesma razão: não repetir o cast de custom property em vinte pontos. */
const cascata = (i: number) => ({ '--reveal-i': i }) as React.CSSProperties;

/* As manchas de ponto fino e o quadrado pálido das faixas claras — a textura da casa
   (`/sistran-university`, `/sistran-labs`, `.matchai-acentos`, `.smartminer-acentos`,
   `.qaintegrado-acentos`, `.gurudeseguros-acentos`). Nó e não pseudo-elemento porque
   `.section-light` já gastou os dois (`::before` malha de 96px, `::after` pontilhado).
   `aria-hidden` porque é grafismo: sem ele o leitor de tela anuncia um nó vazio antes
   do conteúdo. */
function AcentosClaros() {
  return <span aria-hidden className="luminna-acentos" />;
}

/* ── O GRAFISMO DE CANTO: O ANEL DO CICLO (a variação de componente nº 1) ──────
   Geometria nova, mecânica da casa: três órbitas concêntricas que GIRAM em velocidades
   e sentidos diferentes, uma delas tracejada, com um ponto percorrendo a do meio e
   marcas curtas na borda externa. É o Ciclo de Vida que o `lead` nomeia — um laço que
   não termina —, e nenhuma irmã tem rotação como peça principal.

   `pathLength="1"` nos arcos normaliza o comprimento, o que deixa caminhos de raios
   diferentes compartilharem UM keyframe de desenho.

   `viewBox` FIXO com `preserveAspectRatio` padrão: são várias caixas de alturas
   diferentes que ainda vão mudar ao mudar copy, e amarrar a arte à altura da seção
   seria um número a recalibrar por faixa.

   SEM `<defs>`/`id`: este componente é montado QUATRO vezes na mesma página, e `id`
   repetido faz todo `url(#…)` apontar para o primeiro. As pontas morrem por
   `mask-image` no CSS, que é por elemento e não por documento.

   O CENTRO é (240, 80) — o canto alto direito do quadro, de onde a máscara faz a arte
   nascer, como nas irmãs. */
function AnelDoCiclo({ className }: { className: string }) {
  return (
    <svg aria-hidden className={`luminna-ciclo ${className}`} viewBox="0 0 320 320">
      {/* AS TRÊS ÓRBITAS. Círculos completos (e não arcos) porque o que se lê aqui é a
          volta inteira; o recorte de quadrante fica com a máscara do CSS, que é quem
          sabe onde a faixa termina. A do meio é a tracejada — o sentido de giro dela é
          invertido no CSS, e é o contraste entre os dois sentidos que faz o desenho
          parecer engrenagem de esteira em vez de um alvo parado. */}
      {[64, 104, 144].map((raio, i) => (
        <circle
          key={raio}
          className={`luminna-orbita luminna-orbita--${i + 1}`}
          pathLength="1"
          cx="240"
          cy="80"
          r={raio}
        />
      ))}
      {/* O PONTO QUE ORBITA. Ele não recebe `transform` próprio: quem gira é um grupo
          centrado no mesmo ponto das órbitas, e o ponto mora deslocado dentro dele —
          é a única forma de o movimento ser translação circular de verdade sem
          calcular seno e cosseno em keyframe. */}
      <g className="luminna-orbita-giro">
        <circle className="luminna-ponto" cx="240" cy="-24" r="7" />
      </g>
      {/* AS MARCAS DE BORDA: oito riscos curtos na órbita externa, as estações do
          ciclo. Ângulos declarados (e não aleatórios) porque o desenho tem de ser o
          mesmo em todo mount; o que se move é a opacidade em fase no CSS. */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angulo, i) => (
        <line
          key={angulo}
          className={`luminna-marca luminna-marca--${(i % 4) + 1}`}
          x1="240"
          y1="-80"
          x2="240"
          y2="-64"
          transform={`rotate(${angulo} 240 80)`}
        />
      ))}
    </svg>
  );
}

/* ── O FIO VERTICAL DA FAIXA ESCURA (a variação de componente nº 3) ────────────
   Todas as irmãs ligam passos lado a lado com fio HORIZONTAL. Aqui os sete benefícios
   empilham numa coluna e o fio é VERTICAL, com um pulso que desce — o commit
   percorrendo a esteira.
   `preserveAspectRatio="none"`: a distorção é desejada, porque o fio tem de ocupar
   exatamente a altura da coluna, qualquer que seja ela. A linha é um segmento reto e o
   pulso é um tracejado curto em marcha (`pathLength="1"`, então a fração vale para
   qualquer altura, sem recalibrar nada). */
function FioVertical() {
  return (
    <svg
      aria-hidden
      className="luminna-fio pointer-events-none absolute left-[1.4rem] top-2 bottom-2 hidden w-1 sm:block"
      viewBox="0 0 4 100"
      preserveAspectRatio="none"
    >
      <line className="luminna-fio-base" x1="2" y1="0" x2="2" y2="100" />
      <line className="luminna-fio-pulso" pathLength="1" x1="2" y1="0" x2="2" y2="100" />
    </svg>
  );
}

export default function LuminnaAiPagina({ page }: { page: AcceleratorPage }) {
  /* O LAÇO DO PREVIEW, com a mesma lição do `HeroVideoBackdrop` e do vídeo da rota do
     SDS: o markup sai SEM `autoPlay`, porque esse atributo é GATILHO DE PARTIDA e não
     estado. Se ele fosse escrito como `autoPlay={!reduzido}`, o HTML do servidor (onde
     a preferência é sempre `false`, senão a hidratação diverge) sairia com o atributo,
     o navegador começaria a tocar, e apagá-lo depois não pararia nada — o laço seguiria
     rodando para quem pediu menos movimento. Então o `play()` é imperativo e só
     acontece depois da hidratação.
     OS DOIS CANAIS: a preferência do sistema E o botão da interface
     (`html[data-motion="reduce"]`) — é a dupla que o resto da casa lê, e um laço
     infinito é exatamente o movimento decorativo que essa escolha existe para
     desligar. Parado fica o pôster, que é o quadro 0; nenhuma informação vive no
     vídeo, então pausar não custa conteúdo.
     O `MutationObserver` e o `matchMedia` ficam escutando porque a escolha pode mudar
     no meio da sessão: sem isso, ligar «reduzir movimento» não pararia um laço já em
     curso, e desligar não religaria.
     `play()` pode ser rejeitado por política de autoplay (aba sem gesto do usuário);
     nesse caso fica o pôster, que é o fallback desejado. */
  const videoPreview = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoPreview.current;
    if (!video) return;
    const consulta = window.matchMedia('(prefers-reduced-motion: reduce)');
    const aplicar = () => {
      const reduzido = consulta.matches || document.documentElement.dataset.motion === 'reduce';
      if (reduzido) {
        video.pause();
        video.currentTime = 0;
        return;
      }
      void video.play().catch(() => undefined);
    };
    aplicar();
    consulta.addEventListener('change', aplicar);
    const vigia = new MutationObserver(aplicar);
    vigia.observe(document.documentElement, { attributes: true, attributeFilter: ['data-motion'] });
    return () => {
      consulta.removeEventListener('change', aplicar);
      vigia.disconnect();
    };
  }, []);

  /* Os blocos por `heading`, e não por índice: índice é dependência invisível, e um
     bloco novo no dado reordenaria as seções em silêncio (a nota é a do Match AI). O
     guarda de `kind` é o que deixa o TypeScript saber que `items`/`paragraphs` existem.
     O bloco de fecho é o ÚNICO sem `heading`, e é por essa ausência que ele é achado —
     não por ser o último. Se o site acrescentar parágrafos com título, este `find`
     continua achando o que não tem, que é o que a faixa 6 publica. */
  const desafios = page.blocks.find((b) => b.heading === 'Desafios no desenvolvimento de software');
  const beneficios = page.blocks.find((b) => b.heading === 'Benefícios');
  /* SIS-220 (2ª volta, item 4) — o bloco novo, achado pelo `heading` como todos os
     outros. O `heading` é a MARCA («Luminna AI»), e é isso que o torna reconhecível
     sem ambiguidade: nenhum outro bloco desta slug se chama assim. */
  /* SIS-220 (3ª volta) — o `heading` mudou de «Luminna AI» para «Tecnologia aplicada
     em todo o ciclo», por pedido literal da issue («Não utilizar `Luminna AI` como
     título da seção»), e o bloco perdeu os itens: os oito produtos agora são dado
     tipado em `luminnaEcossistema.ts`. Logo o `find` é por título novo e o `kind` é
     `paragraphs` — o que este bloco ainda carrega é o CABEÇALHO da faixa.
     A nota da 5ª volta que estava aqui dizia que o `find` «NÃO ACHA MAIS NADA, de
     propósito», porque o bloco tinha sido comentado no dado. Caducou em 02/10: o bloco
     voltou e o `find` acha de novo. A razão da volta está em `acceleratorPages.ts`, em
     cima dele. */
  const ecossistema = page.blocks.find(
    (b) => b.heading === 'Tecnologia aplicada em todo o ciclo',
  );
  const integracao = page.blocks.find((b) => b.heading === 'Integração Versátil');
  const fecho = page.blocks.find((b) => b.kind === 'paragraphs' && !b.heading);

  /* O SUBTÍTULO DO HERO é a PRIMEIRA ORAÇÃO do `lead`, cortada na primeira vírgula do
     próprio dado. O `lead` tem ~180 caracteres numa frase só: embaixo de um letreiro a
     cauda («agilizando processos e integrando ferramentas líderes de mercado») viraria
     parágrafo de abertura na dobra, e a dobra é onde a pessoa decide se continua. O
     resto NÃO se perde: a faixa 2 publica o `lead` INTEIRO. Sem vírgula, a cauda é o
     `lead` todo — nenhuma escrita desaparece num dado que mude de forma. */
  const subtitulo = page.lead.includes(',')
    ? page.lead.slice(0, page.lead.indexOf(','))
    : page.lead;

  /* SIS-220 (5ª volta) — O ESTADO SAIU COM O SEU ÚNICO GATILHO. O CTA do hero era o
     último chamador de `setContatoAberto` (o botão do Ecossistema já tinha saído na 4ª
     volta); sem ele, o estado ficaria sempre `false` e o `<ContactModal>` no pé da
     página seria um diálogo que ninguém consegue abrir. Os dois saem juntos, e com eles
     os imports de `useState` e `ContactModal`.
     Nota original, que volta a valer se o CTA voltar: «Um estado só para o modal:
     `ContactModal` cuida de `showModal()`, do portal, da pausa do scroll suave e da
     devolução do foco ao gatilho.»
     const [contatoAberto, setContatoAberto] = useState(false); */

  return (
    <>
      {/* ── 1. HERO: A ARTE SANGRADA ─────────────────────────────────────────
          O molde e os NÚMEROS são os das irmãs, e reaproveitá-los é o que garante que a
          emenda feche: `-top-28 md:-top-36` é exatamente o `pt-28 md:pt-36` que o
          `PageShell` põe no `<main id="conteudo">` (7rem e 9rem), a distância entre o
          topo da janela e o começo do conteúdo. É o que faz a arte subir ATRÁS do
          cabeçalho em vez de parar embaixo dele.
          Por isso NÃO há `overflow-clip` aqui: qualquer recorte corta exatamente o
          pedaço que sobe atrás do cabeçalho, e `overflow-x-clip` não serve de
          meio-termo (CSS Overflow 3: com um eixo em `clip`, o `visible` computa
          `clip`). O cabeçalho continua na frente — `Header.tsx` é `fixed … z-50` e a
          arte nasce em `z-index: auto`.
          `id="topo"` é a âncora de «Início» do indicador lateral (que NESTA rota monta,
          com quatro paradas — ver o docblock) e o destino do «pular para o conteúdo». */}
      <section
        id="topo"
        className="relative flex min-h-[26rem] items-center py-16 md:py-24 lg:min-h-[33rem]"
      >
        {/* A ARTE E A SOMBRA. `box-shadow` no embrulho e só para BAIXO: o embrulho é
            caixa opaca do tamanho da faixa, então o deslocamento vertical positivo
            desenha a sombra sobre a seção clara seguinte; para cima ela cairia na tira
            atrás do cabeçalho, repintando ali a faixa escura que este arranjo existe
            para eliminar. `box-shadow` e não `filter: drop-shadow` porque `filter` cria
            contexto de empilhamento e faz o `fixed` do cabeçalho se ancorar no nó
            filtrado.
            `data-route-critical-media` aqui porque o portão de rota
            (`loading/RouteLoadGate.tsx`) espera a maior imagem acima da dobra.
            A fonte é `VITRINE.capaCard` e não `CAPAS_DE_ABERTURA` — a razão está no
            docblock. `VITRINE &&` porque o `find` é tipado como possivelmente ausente:
            sem a entrada no dado a faixa monta só com o navy chapado do véu, em vez de
            derrubar a rota. */}
        {VITRINE && (
          <div
            aria-hidden
            className="absolute -top-28 right-0 bottom-0 left-0 bg-[#001A3D] shadow-[0_18px_44px_-18px_rgba(0,12,30,0.55)] md:-top-36"
          >
            <Image
              data-route-critical-media=""
              src={VITRINE.capaCard}
              alt=""
              fill
              sizes="100vw"
              priority
              className="object-cover object-[center_42%]"
            />
            {/* DOIS VÉUS, um por eixo, e não um só: a leitura do texto muda de eixo com
                a largura. Abaixo de `lg` o texto cai sobre o miolo da arte e o véu é
                vertical; de `lg` para cima o texto ocupa o terço esquerdo e o véu é
                horizontal, terminando transparente antes da metade direita para não
                apagar o assunto da foto.
                GRADIENTE EXPLÍCITO com `rgba`, e não o trio `from-/via-/to-` com barra
                de opacidade: `from-[#001A3D]/97` NÃO GERA REGRA nesta versão do
                Tailwind, e o resultado medido na SIS-279 foi faixa escura SEM VÉU
                NENHUM. Os degraus são os das irmãs, cujo pixel COMPOSTO sob o texto foi
                medido; o portão desta issue remede contra ESTA capa. */}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,26,61,0.93)_0%,rgba(0,26,61,0.88)_46%,rgba(0,26,61,0.58)_80%,rgba(0,26,61,0.38)_100%)] lg:hidden" />
            <div className="absolute inset-0 hidden lg:block lg:bg-[linear-gradient(90deg,#001A3D_0%,rgba(0,26,61,0.94)_30%,rgba(0,26,61,0.72)_46%,rgba(0,26,61,0.2)_68%,rgba(0,26,61,0)_84%)]" />
          </div>
        )}
        {/* SEM MALHA E SEM GRAFISMO NESTA FAIXA, e é decisão herdada: a 6ª volta da
            SIS-292 retirou os dois do hero do Match AI porque sobre FOTO eles viram
            grade riscada na cara das pessoas (sobre fundo chapado são a textura da
            casa). Os grafismos seguem montados nas faixas seguintes. */}
        {/* `esperarRota` SÓ AQUI, pelo contrato da SIS-269: espera quem está NA DOBRA,
            onde a cortina do `RouteLoadGate` esconderia a animação. Os escopos das
            outras seções nascem abaixo dela e não esperam.
            O teto de leitura vive no PARÁGRAFO e não no container: `.container-lp` é
            `max-width` + `mx-auto`, então um teto neste nó encolheria o container
            centrado e jogaria o bloco para o meio da tela (o defeito medido na 5ª volta
            do Match AI). */}
        <RevealScope
          className="container-lp relative z-10"
          esperarRota
          limiar={LIMIAR_REVEAL}
          margem={MARGEM_REVEAL}
          data-reveal-nome="luminna-hero"
        >
          <div>
            {/* O LETREIRO É A MARCA DESENHADA, como nas irmãs Match AI, Smart Miner e
                Guru: a arte canônica com dois n e tagline é a mesma que
                `accelerators.ts` serve nos cartões, achada pelo `id` e não digitada.
                `alt={page.name}` («Luminna AI», dois n) e não vazio: este `h1` não tem
                outro conteúdo, e cabeçalho sem nome acessível é cabeçalho que não
                existe para leitor de tela.
                `width`/`height` são as dimensões INTRÍNSECAS do dado: com
                `images: { unoptimized: true }` o que baixa é o arquivo do disco, então o
                par serve para reservar a caixa e não distorcer a marca. `priority`
                porque está na dobra e é o nome da página. */}
            {/* SIS-220 (onda visual, item 1) — O CARIMBO ACIMA DO LETREIRO.
                FORA do `<h1>`: dentro, ele entraria no nome acessível do cabeçalho e o
                `h1` passaria a se chamar «Luminna AI Luminna AI» (a arte escreve a
                mesma marca que o letreiro). `alt=""` pela mesma razão — é acento
                gráfico de uma palavra que o nó seguinte já publica em tamanho de
                letreiro.
                `data-reveal` com cascata 0 e o carimbo batendo por rota: a batida é a
                primeira coisa que acontece na dobra, e o letreiro sobe atrás dela. */}
            <p data-reveal="fade-up">
              <CarimboBatida
                src={CARIMBO_CAPA.src}
                alt=""
                larguraIntrinseca={CARIMBO_CAPA.largura}
                alturaIntrinseca={CARIMBO_CAPA.altura}
                className="luminna-carimbo luminna-carimbo--capa"
                gatilho="rota"
              />
            </p>
            <h1 data-reveal="fade-up" className="luminna-letreiro">
              {VITRINE && (
                <Image
                  src={VITRINE.logo}
                  alt={page.name}
                  width={VITRINE.logoWidth}
                  height={VITRINE.logoHeight}
                  priority
                  className="h-auto w-full"
                />
              )}
            </h1>
            <p
              data-reveal="fade-up"
              style={cascata(1)}
              className="mt-5 max-w-[46ch] text-lg leading-relaxed text-white/85 lg:max-w-[52ch]"
            >
              {subtitulo}
            </p>
            {/* AÇÃO NA PRÓPRIA PÁGINA, então `<button>` e não `<a>`: link que não vai a
                lugar nenhum é link falso para leitor de tela e para o teclado. O molde é
                o do cabeçalho (`Header.tsx`), que monta `ContactModal` SEM
                `title`/`description` de propósito — os defaults do componente são a
                escrita «Fale com a gente», e passar texto próprio faria a mesma peça
                dizer duas coisas diferentes na mesma rota.
                A PÍLULA É O AZUL DO PRODUTO (`tone` do dado, `#57B7EE`) com tinta navy
                `#04212B`: tinta escura sobre fundo claro, que é o que a família de heros
                da casa usa. NÃO é `.btn-primary` — o degradê da casa com tinta branca
                não passa no piso na ponta clara (medido na SIS-292). O número desta
                pílula está na sonda desta issue. */}
            {/* SIS-220 (5ª volta) — O CTA SAI. «Fale com um especialista» é escrita que
                não está no paste, e a issue é explícita sobre o hero: «sem
                bullets/CTAs com texto fora do paste». O molde e o número de contraste
                medido na SIS-292 ficam registrados na nota acima para quando a área
                reintroduzir um CTA com escrita aprovada.
            <p data-reveal="fade-up" style={cascata(2)}>
              <button
                type="button"
                onClick={() => setContatoAberto(true)}
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#57B7EE] px-6 py-3 text-sm font-semibold text-[#04212B] transition-colors hover:bg-[#8FD2F7]"
              >
                Fale com um especialista
                <ArrowRight className="h-4 w-4" strokeWidth={2.2} aria-hidden />
              </button>
            </p>
            */}
          </div>
          {/* ── A FRASE MANUSCRITA DO HERO (SIS-280 item 4, `docs/fonte2.md`) ──
              TEXTO HTML, não pixel: a especificação abre exigindo que a frase seja
              «editável» e que NÃO esteja embutida na arte — então ela é um `<p>` de
              verdade, indexável, selecionável e traduzível, e não uma camada do PNG.
              AS QUATRO LINHAS SÃO QUATRO NÓS, e não uma frase com `max-width` deixando
              o navegador quebrar: a especificação pede EXATAMENTE quatro linhas
              («Grandes / ideias / constroem / amanhã.»), e quebra por largura muda com
              a fonte, com o zoom e com a tradução. Cada `span` é `display: block` no
              CSS. Não entram `<br>`: a frase continua uma frase só para leitor de tela,
              que ignora a caixa de bloco e lê a sequência inteira.
              O TRAÇO CIANO é SVG e não `border-bottom`, por dois motivos: a
              especificação pede um risco LEVEMENTE INCLINADO (borda é sempre
              horizontal) e DESENHADO DA ESQUERDA PARA A DIREITA, que é
              `stroke-dashoffset` — o mecanismo da casa, com `pathLength="1"` para o
              comprimento não depender da geometria. `aria-hidden` porque é grafismo.
              POSIÇÃO: em fluxo normal abaixo do botão até `lg`, e absoluta sobre a
              metade direita — a área clara/envidraçada da arte — de `lg` para cima,
              onde o texto ocupa só o terço esquerdo. Quem decide isso é o CSS, não um
              segundo nó condicional: duas cópias da mesma frase seriam duas leituras
              para leitor de tela e dois lugares para a escrita divergir.
              A ENTRADA é `data-reveal="fade-up"` — o mecanismo de reveal da casa, que
              já respeita movimento reduzido — e a cascata a põe DEPOIS do botão. */}
          {/* SIS-220 (5ª volta) — A FRASE MANUSCRITA SAI. «Grandes ideias constroem
              amanhã.» é escrita nossa (nasceu da SIS-280, de `docs/fonte2.md`) e não
              está no paste; a regra desta volta é que o hero só publique o que a marca
              e o «Sobre» pedem. O CSS (`.luminna-frase*` em `globals.css`) e a nota de
              projeto acima ficam intactos — é uma peça pronta, não um erro, e voltar é
              descomentar estas nove linhas.
          <p data-reveal="fade-up" style={cascata(3)} className="luminna-frase">
            <span className="luminna-frase-linha">Grandes</span>
            <span className="luminna-frase-linha">ideias</span>
            <span className="luminna-frase-linha">constroem</span>
            <span className="luminna-frase-linha">amanhã.</span>
            <svg aria-hidden className="luminna-frase-traco" viewBox="0 0 45 8">
              <line className="luminna-frase-risco" pathLength="1" x1="1.5" y1="6.4" x2="43.5" y2="1.6" />
            </svg>
          </p>
          */}
        </RevealScope>
      </section>

      {/* ── 2. TODO O CICLO DE VIDA… (a «faixa de campanha/lead») ─────────────
          Texto + foto, que é o arranjo da «Campanha» do Match AI. O título é fragmento
          verbatim do `lead` (ver o docblock) e o corpo é o `lead` INTEIRO — a frase de
          onde o título saiu continua publicada, então nada se perde no corte, e é aqui
          que a escrita que o hero resumiu aparece completa.
          `.section-light` pinta título e texto de navy sozinho: é por isso que nada aqui
          leva `on-dark`.
          `overflow-clip` e não `hidden`: a malha de 96px de `.section-light::before` é
          `background-attachment: fixed` pela SIS-76, e `hidden` cria contêiner de
          rolagem, que é o que desancora o `fixed`. `clip` recorta o mesmo sem criar
          contêiner. */}
      <section
        className="section-light section-light-blue section-py relative overflow-clip"
        aria-labelledby={idDoBloco(TITULO_SDLC)}
      >
        <AcentosClaros />
        <AnelDoCiclo className="luminna-ciclo--claro" />
        <RevealScope
          className="container-lp relative z-10"
          limiar={LIMIAR_REVEAL}
          margem={MARGEM_REVEAL}
          data-reveal-nome="luminna-sdlc"
        >
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
            <div>
              <h2
                data-reveal="fade-up"
                id={idDoBloco(TITULO_SDLC)}
                className="font-display text-section font-bold text-ink"
              >
                {TITULO_SDLC}
              </h2>
              <p
                data-reveal="fade-up"
                style={cascata(1)}
                className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted"
              >
                {page.lead}
              </p>
            </div>
            {/* SIS-220 (onda visual, item 2) — A ARTE DO ANEL SDLC NO LUGAR DA FOTO.
                Entra `luminnaprimeirasessao.png` (1399 × 1124 lido no IHDR). Fica
                DECORATIVA, como a issue prefere: `alt=""` + `aria-hidden`, porque o
                título e o `lead` ao lado já dizem o que ela ilustra — e um `alt`
                honesto de um diagrama de ciclo seria um parágrafo, não uma linha.

                ⚠️ DUAS MUDANÇAS QUE NÃO SÃO ENFEITE, e são a razão de isto não ser
                uma troca de `src`:
                · `object-contain` e não `object-cover`. A anterior era FOTO, e cortar
                  foto é recorte; esta é DIAGRAMA, e `cover` comeria as bordas do anel
                  — ou seja, os rótulos das etapas do ciclo, que é tudo o que a arte
                  tem a dizer.
                · `aspect-[5/4]` e não `4/3`. 1399 × 1124 é 1,245:1, que é 5/4 quase
                  exato; num quadro 4/3 o `contain` deixaria duas faixas vazias nas
                  laterais, e a borda arredondada do quadro passaria longe da arte.
                A guarda `VITRINE &&` caiu com a foto: o `src` agora é literal e não
                depende do `find` na vitrine. */}
            <div
              data-reveal="scale-soft"
              style={cascata(2)}
              className="luminna-midia luminna-midia--diagrama relative aspect-[5/4] overflow-hidden rounded-3xl border border-[#0079CB]/[18%]"
            >
              <Image
                src="/images/solucoes/luminna/luminnaprimeirasessao.png"
                alt=""
                aria-hidden
                fill
                sizes="(min-width: 1180px) 500px, 100vw"
                loading="lazy"
                className="luminna-midia-arte object-contain"
              />
            </div>
          </div>
        </RevealScope>
      </section>

      {/* ── 2b. SOBRE O LUMINNA AI — O VÍDEO PRESO AO SCROLL (SIS-220 item 6) ─
          O MESMO componente da home, montado nu e sem prop nenhuma: a seção já é sobre
          este produto (o `h2` é «Sobre o Luminna AI»), a escrita vem de
          `src/data/legacy.ts` e o vídeo é o `impacto-assembly-scroll.mp4` da SIS-226.
          «Exatamente como na home» é literal — mesmo componente, mesmo dado, mesmo
          vídeo, mesmo caminho de movimento reduzido (`data-static` + pôster, resolvido
          dentro dele).
          AQUI, E NÃO NO FIM DA PÁGINA: a faixa 2 acima abre o ciclo de vida em texto e
          a faixa 3 abaixo é «Desafios no desenvolvimento de software» — que é
          exatamente o `kicker` com que esta seção FECHA (a ordem de leitura invertida
          pela SIS-214). Posta aqui, ela apresenta o produto depois da abertura e
          entrega o gancho na faixa seguinte; posta no fim, o gancho apontaria para o
          «Conheça também».
          SEM `RevealScope` E SEM `data-reveal` POR FORA, como em `app/page.tsx:428`: a
          seção é `sticky` de 200svh e um envelope com `transform` trocaria a referência
          do `sticky` da janela para a caixa. O reveal da legenda é interno
          (`useRevealTrigger` no próprio sticky).
          A SUPERFÍCIE É DELA: `.sequence` é `.lp-section--cream`, opaca — o plano azul
          da rota passa por baixo sem uma regra a mais, e é o «creme preservado» do
          aceite. Por isso também ela não ganha `.section-light` nem grafismo de canto:
          o quadro de vídeo cobre os primeiros 100svh de ponta a ponta. */}
      {/* SIS-220 (5ª volta) — A SEÇÃO SAI DA ROTA, e a issue deu as duas saídas:
          «alinhar ao "Sobre" do paste OU remover da rota se duplicar o lead». Duplica,
          duas vezes: o `text` de `impactSequence` («O Luminna AI representa uma
          revolução no desenvolvimento de software, proporcionando eficiência, qualidade
          e rapidez.») é palavra por palavra a primeira oração do FECHO da página, e o
          `kicker` é «Desafios no desenvolvimento de software», que é o título da faixa
          3 logo abaixo. Era ela o «segundo "revolução…" solto» que a issue nomeia.
          ALINHAR ERA A SAÍDA ERRADA aqui: a escrita mora em `src/data/legacy.ts`, e a
          HOME monta o mesmo componente com o mesmo dado (`app/page.tsx:429`). Editar o
          dado para servir esta rota reescreveria a copy da home, que está fora do
          escopo desta issue. Remover a montagem resolve só onde o problema está.
          O vídeo `impacto-assembly-scroll.mp4` (SIS-226) continua em uso pela home.
      <ImpactSequence />
      */}

      {/* ── 3. DESAFIOS NO DESENVOLVIMENTO DE SOFTWARE (a grade de cards) ─────
          Título, ordem e textos são do dado; o que este arquivo declara são os ícones.
          `<ul>` e não `<ol>`: o bloco não diz `ordered` — os quatro desafios são
          simultâneos, não uma sequência (foi o QA, com `ordered: true` no dado, que
          ganhou ordinal desenhado).
          Os quatro itens têm `term` E `text`, e os dois entram: o `term` é o `h3` do
          card e o `text` é a pergunta que o site faz. Publicar só um dos dois deixaria
          de fora escrita já publicada.
          A âncora sai de `idDoBloco(heading)` e É a primeira parada de conteúdo do
          indicador lateral (`desafios-no-desenvolvimento-de-software`); o rótulo dela
          no indicador é o `navLabel: 'Desafios'` que o dado já declara. */}
      {desafios?.kind === 'list' && desafios.heading && (
        <section
          className="section-light section-py relative overflow-clip"
          aria-labelledby={idDoBloco(desafios.heading)}
        >
          <AcentosClaros />
          <AnelDoCiclo className="luminna-ciclo--claro luminna-ciclo--baixo" />
          <RevealScope
            className="container-lp relative z-10"
            limiar={LIMIAR_REVEAL}
            margem={MARGEM_REVEAL}
            data-reveal-nome="luminna-desafios"
          >
            {/* SIS-220 item 5 — O CARIMBO AO LADO DO TÍTULO, e não sobre ele: a arte
                escreve a MESMA palavra do `h2`, então sobrepor as duas seria a palavra
                duas vezes em cima de si mesma. A linha é `flex-wrap` com o título
                mandando (`min-w-0`), de modo que no telefone a cápsula cai para baixo
                inteira em vez de comprimir o `h2` — é o que faz 390px funcionar sem um
                segundo nó condicional. */}
            <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-5">
              <h2
                data-reveal="fade-up"
                id={idDoBloco(desafios.heading)}
                className="font-display text-section min-w-0 font-bold text-ink"
              >
                {desafios.heading}
              </h2>
              <CarimboBatida
                src={CARIMBO_DESAFIOS.src}
                alt=""
                larguraIntrinseca={CARIMBO_DESAFIOS.largura}
                alturaIntrinseca={CARIMBO_DESAFIOS.altura}
                className="luminna-carimbo"
                gatilho="viewport"
              />
            </div>
            {/* O APOIO é a `description` da vitrine — a única frase desta rota que vem
                de `accelerators.ts`, usada UMA vez, e por isso não há duas aberturas
                dizendo a mesma coisa (o defeito que a SIS-120 removeu do template). */}
            {/* SIS-220 (5ª volta) — O APOIO SAI. A `description` de `accelerators.ts`
                não está no paste, e o paste abre os Desafios direto nos quatro cards.
                O dado FICA onde está e continua servindo o cartão da vitrine em
                /solucoes — o que saiu é a segunda publicação dele, aqui.
            {VITRINE && (
              <p
                data-reveal="fade-up"
                style={cascata(1)}
                className="mt-4 max-w-2xl text-lg leading-relaxed text-muted"
              >
                {VITRINE.description}
              </p>
            )}
            */}
            <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {desafios.items.map((item, i) => {
                const Icone = ICONES_DESAFIOS[i] ?? Sparkles;
                return (
                  <li
                    key={item.term ?? item.text}
                    data-reveal="fade-up"
                    style={cascata(i + 2)}
                    /* A ANATOMIA VARIADA (variação nº 2): o cartão tem TRILHO DE ETAPA
                       NO PÉ — uma barra que se preenche na base — e o ícone num disco
                       com arco girando. Não é a tira vertical (QA), a faixa 16/9 no topo
                       (Smart Miner), a miniatura 28/32 na lateral (Match AI) nem o
                       medalhão redondo (Guru). Trilho porque o vocabulário desta solução
                       é esteira: o indicador de progresso é o desenho nativo do assunto.
                       `pb-7` abre o espaço do trilho, que é `::after` do próprio cartão.
                       `luminna-cartao` é o laço de flutuação + o realce sob o ponteiro.
                       `bg-white` chapado e não translúcido: o cartão sobe e escala sobre
                       a folha, e com fundo translúcido o vizinho apareceria por baixo no
                       instante da sobreposição. */
                    className="luminna-cartao relative flex flex-col items-start overflow-hidden rounded-2xl border border-[#0079CB]/[18%] bg-white p-5 pb-7"
                  >
                    {/* SIS-220 item 1 («ícones reforçados nas faixas») — o disco era
                        `h-12 w-12` com glifo de 20px e traço 1,6; agora é `h-14 w-14`
                        com glifo de 28px e traço 1,9. O glifo cresce 40% e o disco
                        17%, então o ícone passa a ocupar metade do selo em vez de um
                        terço — é o reforço, e o disco não vira mancha. O traço sobe
                        junto porque glifo maior com o mesmo `strokeWidth` fica MAIS
                        fino em proporção, que é o contrário do pedido. */}
                    <span aria-hidden className="luminna-selo relative mb-4 block h-14 w-14">
                      {/* O ARCO é nó IRMÃO do ícone e é ele que recebe a rotação: girar
                          o nó que contém o glifo deixaria o desenho tombando junto. */}
                      <span aria-hidden className="luminna-arco absolute inset-0" />
                      <span className="absolute inset-0 flex items-center justify-center">
                        <Icone className="h-7 w-7 text-[#0079CB]" strokeWidth={1.9} />
                      </span>
                    </span>
                    <h3 className="font-display text-base leading-snug text-ink">{item.term}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.text}</p>
                  </li>
                );
              })}
            </ul>
          </RevealScope>
        </section>
      )}

      {/* ── 4. BENEFÍCIOS (a faixa escura, com o fio vertical) ────────────────
          O `bg-[#001A3D]` é DECLARADO e não herdado, e isso está medido nas irmãs: o
          `body` deste site é `#1273bc` (azul MÉDIO), e sem fundo próprio as tintas
          brancas medem ~4,1:1 e ~3,2:1 contra ele, reprovadas no piso de 4,5. Com o
          navy profundo chapado o mesmo texto passa com folga.
          A CAPA ENTRA COMO FUNDO sob um véu e o chapado NÃO sai: ele é o piso de
          contraste para o caso de a arte não carregar, e é o véu que garante que o
          número medido não dependa de qual pedaço da foto caiu atrás de qual item.
          SEM `z-index` negativo na camada da arte — foi o defeito medido no Match AI: a
          seção não cria contexto de empilhamento por `position: relative` sozinha, e um
          filho negativo desce para trás do `background` da PRÓPRIA seção, que aqui é
          chapado; a imagem pintava embaixo do fundo. A ordem de documento resolve.
          ESTA É A FAIXA QUE SAIU DE `TOM_MEDIO_DE_ACELERADOR`: a parada `beneficios`
          era o azul médio do template genérico e hoje é escura, e escuro é ausência de
          chave nos dois mapas de tom. */}
      {beneficios?.kind === 'list' && beneficios.heading && (
        <section
          className="section-py relative overflow-clip bg-[#001A3D]"
          aria-labelledby={idDoBloco(beneficios.heading)}
        >
          {VITRINE && (
            <div aria-hidden className="pointer-events-none absolute inset-0">
              <Image
                src={VITRINE.capaCard}
                alt=""
                fill
                sizes="100vw"
                loading="lazy"
                className="object-cover object-[center_42%]"
              />
              {/* VÉU QUASE FECHADO NOS TRÊS TERÇOS, e não um gradiente que abre à
                  direita: a coluna de benefícios e o fio ocupam a faixa inteira, então
                  há texto branco sobre o terço direito também. O leve degradê que sobra
                  existe só para a arte não ficar uniformemente apagada.
                  O NÚMERO É O DAS IRMÃS SIS-287/SIS-280, e herdá-lo é decisão medida e
                  não cópia: lá ele subiu duas vezes, cada uma contra uma captura, porque
                  a capa tinha placa de nome desenhada no miolo que se lia como fantasma
                  atrás do texto a 98,5%. A capa desta rota também traz letreiro
                  desenhado, então o piso de partida é o que já sobreviveu àquela prova —
                  e o portão que confirma é o desvio de pixel na janela do letreiro, na
                  sonda desta issue, não a minha leitura da captura. */}
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,26,61,0.995)_0%,rgba(0,26,61,0.995)_50%,rgba(0,26,61,0.99)_100%)]" />
            </div>
          )}
          {/* A malha e o grafismo ENTRAM DEPOIS da foto e do véu, de propósito: o véu
              apaga a arte quase por inteiro e a malha tem de ficar SOBRE ele, senão a
              grade seria a coisa mais apagada da faixa. O par 0/1 entre irmãos não é
              preferência: `.grade-tecnica` nasce em `z-index: -1`, e como esta seção tem
              fundo chapado o negativo a jogaria para trás dele — `.luminna-grade`
              reescreve para 0. */}
          <div aria-hidden className="grade-tecnica luminna-grade" />
          <AnelDoCiclo className="luminna-ciclo--escuro" />
          <RevealScope
            className="container-lp relative z-10"
            limiar={LIMIAR_REVEAL}
            margem={MARGEM_REVEAL}
            data-reveal-nome="luminna-beneficios"
          >
            {/* SIS-220 item 5 — O CARIMBO DE «BENEFÍCIOS». Mesmo arranjo do de
                Desafios, com UMA diferença declarada: `luminna-carimbo--escuro`
                reacende a tinta, porque a arte é contorno `#0757c7` e esta é a faixa
                navy. A razão de reacender em vez de trocar de arte está no docblock —
                não existe variante branca com esta palavra.

                SIS-220 (2ª volta, item 2): passou a existir. A arte é branca de
                origem e `luminna-carimbo--escuro` SAIU desta `className` — o arranjo
                agora é idêntico ao de Desafios, sem exceção nenhuma. */}
            <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-5">
              <h2
                data-reveal="fade-up"
                id={idDoBloco(beneficios.heading)}
                className="font-display text-section min-w-0 font-bold text-white"
              >
                {beneficios.heading}
              </h2>
              <CarimboBatida
                src={CARIMBO_BENEFICIOS.src}
                alt=""
                larguraIntrinseca={CARIMBO_BENEFICIOS.largura}
                alturaIntrinseca={CARIMBO_BENEFICIOS.altura}
                className="luminna-carimbo"
                gatilho="viewport"
              />
            </div>
            {/* A COLUNA DE SETE, e o fio vertical ao lado dela. Uma coluna e não grade
                de três: sete itens numa grade de três deixa uma fileira órfã de um, e é
                a coluna que dá sentido ao fio descendo. De `sm` para cima o conteúdo
                recua (`sm:pl-16`) para abrir a calha do fio; empilhado abaixo de `sm` o
                fio não monta — é o mesmo critério das irmãs (fio só onde os passos
                estão na direção que ele liga). */}
            <div className="relative mt-8">
              <FioVertical />
              <ul className="space-y-4 sm:pl-16">
                {beneficios.items.map((item, i) => {
                  const Icone = ICONES_BENEFICIOS[i] ?? Sparkles;
                  return (
                    <li
                      key={item.term ?? item.text}
                      data-reveal="fade-up"
                      style={cascata(i + 1)}
                      className="luminna-etapa relative flex items-start gap-4 rounded-2xl border border-[#57B7EE]/25 bg-[#001A3D]/70 px-5 py-4"
                    >
                      {/* O DISCO do item encosta no fio: é ele que faz a leitura «cada
                          benefício é uma estação da esteira» em vez de «lista com
                          bolinhas». Caixa chapada porque cai sobre a arte velada. */}
                      <span
                        aria-hidden
                        /* SIS-220 item 1 — o disco do nó era `h-10 w-10` com glifo de
                           20px; agora `h-12 w-12` com 24px e traço 1,9. Ele NÃO vai aos
                           56px do cartão de Desafios, e o limite é geométrico: aqui o
                           disco divide UMA LINHA com o `h3` e o parágrafo do item (dois
                           blocos de texto empilhados em `py-4`), então um disco maior
                           que a altura desse par passaria a mandar na altura da faixa —
                           sete vezes. No cartão de Desafios ele está sozinho na sua
                           linha, e por isso lá pode crescer mais. */
                        className="luminna-no flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#57B7EE]/40 bg-[#001A3D]"
                      >
                        <Icone className="h-6 w-6 text-[#B6DFF9]" strokeWidth={1.9} />
                      </span>
                      <span className="block">
                        <h3 className="font-display text-base leading-snug text-white">
                          {item.term}
                        </h3>
                        <p className="mt-1 text-sm leading-relaxed text-white/80">{item.text}</p>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </RevealScope>
        </section>
      )}

      {/* ── 4-B. ECOSSISTEMA — A MARCAÇÃO SAIU DAQUI PARA UM COMPONENTE (3ª volta) ──
          O desenho da 2ª volta (grade rígida de oito cartões brancos iguais, título
          «Luminna AI», métricas sempre à mostra no pé) foi REPROVADO em cima de uma
          tela: «Não passa o pedido novo». O que entra no lugar é
          `EcossistemaLuminna`, construído a partir de `docs/luminnaecosistema.md` e
          de `public/imagensexemplo/ecossitema.png` — composição bento, filtros que
          filtram de verdade, contador e painel de resultados que abre dentro do
          cartão ativo.
          POR QUE COMPONENTE E NÃO MAIS MARCAÇÃO AQUI: a faixa passou a ter ESTADO
          (filtro ativo e cartão aberto), e este arquivo tem 1.600 linhas e um estado
          só. No mesmo componente, cada clique numa pastilha re-renderizaria o hero,
          a sequência de impacto e o hub de integração. O JSX da 2ª volta está
          guardado, inteiro, no pé de `EcossistemaLuminna.tsx`.
          «4-B» E NÃO «5», como antes e pelo mesmo motivo: o docblock do topo cita as
          faixas por número, e renumerar de 5 a 7 deixaria aquelas referências
          apontando para a faixa errada.
          A guarda mudou de `kind` — o bloco do dado é `paragraphs` agora, e o que
          ele carrega é o cabeçalho: título (que é a âncora), `navLabel` (a
          sobrancelha) e o parágrafo de apoio.

          ⚠️ ESTÁ MONTADO DE NOVO (02/10). A 5ª volta da SIS-220 comentou esta montagem
          E o bloco de dado em `acceleratorPages.ts` — duas coisas, porque uma guarda
          que nunca abre é uma faixa que reaparece sozinha no dia em que alguém
          descomentar só o dado. As duas foram religadas na mesma passada, mais a chave
          `tecnologia-aplicada-em-todo-o-ciclo` em `pageSections.ts`, que é o que dá a
          tinta certa ao rótulo do indicador lateral sobre esta faixa clara.
          A razão da volta não é «mudamos de ideia sobre o desenho»: a retirada tinha
          sido por procedência de escrita (a frase de apoio não estava no paste daquela
          volta), e a escrita dos oito produtos chegou no chat de 02/10. Está por
          extenso em cima do bloco de dado.
          A guarda continua sendo `kind === 'paragraphs'` com `heading` — o bloco carrega
          cabeçalho, não itens; os oito produtos vivem em `luminnaEcossistema.ts`. */}
      {ecossistema?.kind === 'paragraphs' && ecossistema.heading && (
        <EcossistemaLuminna
          titulo={ecossistema.heading}
          idDaAncora={idDoBloco(ecossistema.heading)}
          sobrancelha={ecossistema.navLabel}
          descricao={ecossistema.paragraphs[0]}
          // `aoConhecer={() => setContatoAberto(true)}` estava aqui na 3ª volta: os dois
          // cartões sem métrica (TEST e PROMPT) mostravam «Conheça a solução →» e o
          // destino era o modal de contato desta página. O botão foi retirado na 4ª
          // volta por pedido direto, e a prop foi embora com ele.
          // (A nota antiga dizia que `setContatoAberto` seguia em uso «por outros pontos
          //  da página». Não seguia: o CTA do hero era o único chamador restante, e ele
          //  saiu nesta volta — o estado e o `ContactModal` saíram com ele.)
        />
      )}

      {/* ── 5. INTEGRAÇÃO VERSÁTIL — O ARRANJO DA MOCK (SIS-280 item 3) ───────
          O LAYOUT é o de `public/images/integracao.png`: um HUB redondo escuro no
          centro, QUATRO cartões ao redor (dois à esquerda, dois à direita) e curvas
          cianas ligando o hub a cada um, com ponto na ponta. Cada cartão traz o ícone
          grande num disco pálido, o nome da categoria e a fileira de pílulas brancas
          com os logotipos.
          O QUE É HTML/CSS E POR QUÊ: a issue proíbe publicar a mock como `<img>`
          único. Então nada aqui é a imagem — as curvas são SVG com `viewBox` em
          porcentagem, as pílulas são `next/image` dos PNG da pasta, e o hub é caixa
          com anel girando. É o que faz o bloco responder a largura, ser texto de
          verdade e parar nos dois canais de movimento reduzido.
          A ESCRITA NÃO VEM DA MOCK, e esta é a divergência declarada: a mock tem
          eyebrow («ECOSSISTEMA»), uma linha de apoio própria, o selo «CONECTA IDEIAS A
          RESULTADOS» no hub e uma descrição de duas linhas por cartão — NADA disso
          existe em `acceleratorPages.ts`. Copiar seria escrever claim de marketing
          novo, que é justamente o que as sete páginas não fazem. Então o título e o
          apoio são o `heading` e o `intro` do dado, o nome de cada cartão é o
          `items[].text` do dado, e o hub diz `page.name` — a marca, que é o que a mock
          escreve lá em cima do selo. A ausência está relatada no comentário da issue.
          Título e âncora vêm do dado (`integracao-versatil`), e esta é a TERCEIRA
          parada do indicador lateral. */}
      {integracao?.kind === 'list' && integracao.heading && (
        <section
          className="section-light section-py relative overflow-clip"
          aria-labelledby={idDoBloco(integracao.heading)}
        >
          <AcentosClaros />
          <AnelDoCiclo className="luminna-ciclo--claro" />
          <RevealScope
            className="container-lp relative z-10"
            limiar={LIMIAR_REVEAL}
            margem={MARGEM_REVEAL}
            data-reveal-nome="luminna-integracao"
          >
            <h2
              data-reveal="fade-up"
              id={idDoBloco(integracao.heading)}
              className="font-display text-section font-bold text-ink"
            >
              {integracao.heading}
            </h2>
            {integracao.intro && (
              <p
                data-reveal="fade-up"
                style={cascata(1)}
                className="mt-6 max-w-3xl text-lg leading-relaxed text-ink-muted"
              >
                {integracao.intro}
              </p>
            )}
            {/* A GRADE DO ARRANJO. De `lg` para cima são três colunas (cartões,
                hub, cartões) e duas linhas; abaixo disso é uma coluna só, e aí as
                curvas e as pontas desaparecem — linha ligando caixas empilhadas não
                diz nada e viraria risco atravessado no meio do texto.
                `relative` porque as curvas e as pontas são absolutas sobre ela. */}
            <div className="luminna-ecossistema relative mt-12 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-center lg:gap-x-12 lg:gap-y-10">
              <LigacoesDoHub />
              {/* O HUB. PRIMEIRO no DOM de propósito: empilhado no telefone ele é o
                  título visual do arranjo, e no `lg` a coluna do meio o põe no centro
                  sem mexer na ordem de leitura. Não é cabeçalho (`h3`) — é a marca
                  repetida em forma de selo, e o cabeçalho da faixa é o `h2` acima. */}
              {/* SIS-220 item 4 — o hub era `Sparkles` (24px) + `{page.name}` escrito
                  em `text-base`. Trocado pela ARTE REAL: a logo branca do produto,
                  `LOGO_DO_HUB`. Três consequências que precisam ficar escritas:

                  · O TEXTO SAIU, e com ele o nome legível que estava aqui. Quem passa
                    a nomear o hub é o `alt={page.name}` da imagem — mesmo conteúdo,
                    mesmo leitor de tela, um nó a menos. Por isso a imagem NÃO leva
                    `alt=""`: sem ela o arranjo hub-and-spoke ficaria com o centro
                    anônimo, e o `h2` da faixa fala de integração, não do produto.
                  · O DISCO CRESCEU de 160/176px para 208/240px, porque a logo é
                    deitada (2883 × 824 ≈ 3,5:1) e uma arte deitada dentro de um
                    círculo só cabe pela largura: num disco de 176px a margem segura
                    horizontal dá ~150px de arte, e 150px de largura = 43px de altura.
                    Em 240px a arte vai a 160px de largura sem encostar na borda.
                  · `width`/`height` continuam sendo o par intrínseco do arquivo, não
                    o tamanho pintado — quem pinta é o `w-[…]`. Com `unoptimized` a
                    arte sai do disco como está; o par só reserva a caixa na proporção
                    certa e impede o achatamento durante o carregamento.

                  ⚠️ A arte escolhida é `luminna-logo-branca.svg` e NÃO o
                  `luminnadoisnn.png` que a issue cita como exemplo: o PNG traz o
                  tagline abaixo do nome, e num disco a linha do tagline cairia em
                  ~8px — ilegível, e ilegível dentro do elemento que é o centro
                  visual da faixa. O vetor branco é só a marca, e é vetor. */}
              <div
                data-reveal="fade-up"
                style={cascata(2)}
                className="luminna-hub relative z-10 mx-auto flex h-52 w-52 flex-col items-center justify-center rounded-full bg-[#001A3D] text-center lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:h-60 lg:w-60"
              >
                <span aria-hidden className="luminna-hub-anel absolute inset-0" />
                <Image
                  src={LOGO_DO_HUB.src}
                  alt={page.name}
                  width={LOGO_DO_HUB.largura}
                  height={LOGO_DO_HUB.altura}
                  className="h-auto w-[8.5rem] lg:w-[10rem]"
                />
              </div>
              {integracao.items.map((item, i) => {
                const Icone = ICONES_INTEGRACAO[i] ?? Sparkles;
                const marcas = MARCAS_DE_INTEGRACAO[i] ?? [];
                return (
                  <div
                    key={item.text}
                    data-reveal="fade-up"
                    style={cascata(i + 3)}
                    className={`luminna-cartao relative z-10 overflow-hidden rounded-2xl border border-[#0079CB]/[18%] bg-white px-5 py-5 pb-7 ${POSICOES_DE_INTEGRACAO[i] ?? ''}`}
                  >
                    <span aria-hidden className="luminna-selo relative block h-12 w-12">
                      <span aria-hidden className="luminna-arco absolute inset-0" />
                      <span className="absolute inset-0 flex items-center justify-center">
                        {/* SIS-220 item 1 — 24px → 28px e traço 1,5 → 1,8, o mesmo
                            reforço aplicado aos outros dois selos da rota. O disco
                            fica em `h-12 w-12`: ele já é o maior arco da faixa e
                            crescer mais o aproximaria do hub, que é quem deve
                            dominar este arranjo. */}
                        <Icone className="h-7 w-7 text-[#0079CB]" strokeWidth={1.8} />
                      </span>
                    </span>
                    <p className="font-display mt-4 text-base leading-snug font-semibold text-ink">
                      {item.text}
                    </p>
                    {/* AS PÍLULAS. Lista de verdade porque são vários itens de mesma
                        natureza, e o nome de cada marca sai no `alt`. A pílula é branca
                        com borda finíssima, como na mock — o cartão já é branco, então
                        quem separa é a borda e não o fundo. */}
                    {/* SIS-220 item 4 — A ESCALA DAS PÍLULAS.

                        Estava: cápsula `h-8` (32px) com logo `h-5` (20px), ou seja
                        6px de respiro em cima e embaixo de uma arte de 20px. Uma
                        marca como o GitHub Copilot, que é quadrada, ocupava 20 × 20px
                        — do tamanho de um favicon, dentro de um cartão de 300px.

                        Agora: cápsula `h-14` (56px) com logo `h-9` (36px). 36px é o
                        número escolhido, e a razão é a marca mais ESTREITA da tabela:
                        as larguras em `MARCAS_DE_INTEGRACAO` estão medidas para 20px
                        de altura, e a menor delas fica em ~19px de largura. A 36px de
                        altura essa mesma marca chega a ~34px de largura — passa a ter
                        presença de logo em vez de presença de ícone, e é o ponto em
                        que a menor marca do conjunto deixa de parecer um detalhe.

                        ⚠️ A tabela NÃO foi reescrita. Cada `largura` continua sendo a
                        largura daquela arte A 20px, e é `larguraDaPilula()` que a
                        converte para 36px. Reescrever os números à mão em onze linhas
                        é justamente como uma delas acaba achatada: com o par
                        derivado, a proporção de toda marca nova sai certa sem ninguém
                        precisar medir de novo. */}
                    {marcas.length > 0 && (
                      <ul className="mt-5 flex flex-wrap items-center gap-2.5">
                        {marcas.map((marca) => (
                          <li
                            key={marca.arquivo}
                            className="flex h-14 items-center rounded-xl border border-[#001A3D]/10 bg-white px-3.5 shadow-[0_1px_2px_rgba(0,26,61,0.06)]"
                          >
                            <Image
                              src={`/images/solucoes/luminna/${marca.arquivo}`}
                              alt={marca.rotulo}
                              width={larguraDaPilula(marca.largura)}
                              height={ALTURA_LOGO_PILULA}
                              className="h-9 w-auto"
                            />
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </RevealScope>
        </section>
      )}

      {/* ── 5B. O PREVIEW DO «DESCUBRA LUMINNA» ──────────────────────────────
          PEDIDO: um preview clicável que leva ao site, com o vídeo em laço.

          ENTRA ENTRE A INTEGRAÇÃO E O FECHO, e nenhuma das seções de `page.blocks`
          saiu para abrir espaço — é a mesma posição que o preview da rota irmã do SDS
          ocupa, e é de propósito: a peça mostra o produto no ar logo antes do
          parágrafo de fecho, em vez de competir com o hero.
          `section-light` repetindo a faixa anterior (Integração também é clara) não
          quebra o ritmo da rota: as faixas 2 e 3 já são duas claras seguidas. A
          alternativa, faixa escura, encostaria em outra escura (o fecho) E num vídeo
          de fundo — duas mídias em movimento colados.

          ⚠️ O CARTÃO INTEIRO É A ÂNCORA, e tudo dentro dele é `<span>`: um link
          dentro de outro é marcação inválida, o navegador desmonta o aninhamento e o
          destino do clique fica imprevisível. Por isso a pílula «Abrir o site» é
          `<span>` com `group-hover`, não um segundo `<a>`.

          ⚠️ `on-dark` NA PÍLULA é obrigatório, e não é estética: dentro de
          `.section-light` os overrides da casa pintam de navy tudo que traga
          `text-white` (`[class*="text-white"] { color: #0a1f44 }` em `globals.css`),
          então uma pílula de fundo cheio ficaria com tinta navy sobre azul escuro. */}
      <section
        className="section-light section-py relative overflow-clip"
        /* PEDIDO: «retire essa parte e deixe só o vídeo» — saem o sobretítulo «No ar»,
           o `h2` e a linha de apoio (comentados abaixo). A faixa fica com a peça só.
           `aria-label` E NÃO `aria-labelledby`: o `id="descubra-luminna"` morava no
           `h2` que saiu, e referência pendurada em `id` inexistente deixa a região SEM
           NOME NENHUM — não com o nome antigo. É a mesma correção que a faixa 6 desta
           rota já tinha precisado (ver a nota lá).
           E não entra um `h2` em `sr-only` no lugar: cabeçalho oculto continua na
           árvore de cabeçalhos, e quem navega por cabeçalhos pularia para um título que
           ninguém vê — descasando a navegação por voz da visual. `aria-label` nomeia a
           região sem inventar cabeçalho. */
        aria-label="Conheça a experiência Luminna"
      >
        <AcentosClaros />
        <RevealScope
          className="container-lp relative z-10"
          limiar={LIMIAR_REVEAL}
          margem={MARGEM_REVEAL}
          data-reveal-nome="luminna-descubra"
        >
          {/* O SOBRETÍTULO, O TÍTULO E A LINHA DE APOIO — FORA DE CENA por pedido.
              Comentados e não apagados: a escrita foi aprovada e voltar é descomentar.
              ⚠️ Quem religar isto tem de devolver `aria-labelledby="descubra-luminna"`
              na seção e tirar o `aria-label`, senão a faixa passa a ter dois nomes
              acessíveis — e o `aria-label` ganha, deixando o `h2` visível fora do nome.
              A cascata voltaria a ser 1, 2 e 3 (a `figure` é a última).

          <p data-reveal="fade-up" className="eyebrow">
            No ar
          </p>
          <h2
            id="descubra-luminna"
            data-reveal="fade-up"
            style={cascata(1)}
            className="mt-3 max-w-4xl font-display text-section font-bold text-ink"
          >
            Conheça a experiência Luminna
          </h2>
          <p
            data-reveal="fade-up"
            style={cascata(2)}
            className="mt-3 max-w-2xl text-base leading-relaxed text-ink-muted"
          >
            Navegue pelo ecossistema em uma experiência completa, com os agentes, a
            jornada e os benefícios da plataforma.
          </p>
          */}

          {/* SEM `mt-10` e SEM `cascata`: o espaço de 2,5rem existia para separar a
              peça do parágrafo que saiu, e a cascata escalonava a entrada DEPOIS dos
              três nós acima. Com a `figure` sendo o primeiro (e único) filho, o
              respiro é o `section-py` da faixa e a entrada é imediata. */}
          <figure data-reveal="scale-soft" className="m-0 mx-auto max-w-4xl">
            {/* `luminna-midia`/`luminna-midia-arte` são as classes desta rota (o avanço
                de escala no hover e os dois canais de movimento reduzido já vivem
                nelas, em `globals.css`). Elas casam por CLASSE e não por seletor de
                `img`, então valem para o `<video>` do mesmo jeito. */}
            <a
              href={DESCUBRA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="luminna-midia group block overflow-hidden rounded-2xl border border-[#0079CB]/20 bg-white shadow-[0_24px_70px_-45px_rgba(0,55,100,.6)] transition-colors hover:border-[#0079CB]/55"
            >
              {/* A BARRA DO NAVEGADOR, `aria-hidden` inteira: os três pontos são
                  desenho e o endereço já está no nome acessível do link — lido duas
                  vezes viraria ruído. É ela que diz «isto é um site, e está no ar». */}
              <span
                aria-hidden
                className="flex items-center gap-2 border-b border-[#0079CB]/[12%] bg-[#F2F8FD] px-4 py-2.5"
              >
                <span className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#0079CB]/25" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#0079CB]/25" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#0079CB]/25" />
                </span>
                <span className="min-w-0 flex-1 truncate rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-ink-muted">
                  {DESCUBRA_HOST}
                </span>
              </span>
              <span className="relative block overflow-hidden" style={{ aspectRatio: DESCUBRA_PROPORCAO }}>
                {/* `loop` É ATRIBUTO DO ELEMENTO, não um `onEnded` que rebobina: o
                    navegador emenda o laço sem passar pelo JS, e por isso não há
                    engasgo no ponto de volta.
                    `muted` é condição do autoplay (nenhum navegador toca som sem gesto
                    do usuário) e `playsInline` impede o fullscreen forçado no iOS.
                    `autoPlay={false}` explícito, e o `play()` vem do efeito no topo do
                    componente — a razão está escrita lá.
                    `preload="metadata"` e não `auto`: são 2,7MB abaixo da dobra, e o
                    que o navegador precisa antes de tocar é só a duração e o primeiro
                    quadro; o pôster cobre o resto da espera.
                    `aria-hidden` porque o vídeo não acrescenta informação além do que
                    o nome do link e a legenda já dizem — é a vitrine do destino. */}
                <video
                  ref={videoPreview}
                  aria-hidden
                  src={DESCUBRA_VIDEO}
                  poster={DESCUBRA_POSTER}
                  autoPlay={false}
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  className="luminna-midia-arte h-full w-full object-cover"
                />
                {/* O SELO CENTRAL é affordance de SAÍDA, e o glifo é o de link externo
                    e NÃO um triângulo de «play»: o vídeo já está tocando em laço, e o
                    clique não toca nada — ele abre o site. Um botão de play que não
                    toca é falsa pista nos dois estados (em movimento reduzido ele
                    estaria sobre um pôster parado que o clique também não inicia).
                    `pointer-events-none` para não abrir um alvo de clique concorrente
                    dentro da âncora. */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 flex items-center justify-center"
                >
                  <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/70 bg-[#001A3D]/55 backdrop-blur-sm transition-colors group-hover:bg-[#0060A8]/85">
                    <ExternalLink className="h-6 w-6 text-white" strokeWidth={2} aria-hidden />
                  </span>
                </span>
              </span>
              <span className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                <span className="text-sm font-semibold text-ink">{DESCUBRA_HOST}</span>
                <span className="on-dark inline-flex items-center gap-2 rounded-full bg-[#0060A8] px-4 py-2 text-xs font-bold text-white transition-colors group-hover:bg-[#004D8A]">
                  Abrir o site
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                </span>
              </span>
            </a>
            {/* A LEGENDA é o nome acessível completo do link, em `sr-only`: o `<a>` tem
                como conteúdo visível o host e «Abrir o site», e é a legenda que diz
                para onde vai e que abre em outra aba (WCAG 2.4.4). */}
            <figcaption className="sr-only">
              Abrir o site Descubra Luminna em {DESCUBRA_HOST}, em uma nova aba.
            </figcaption>
          </figure>
        </RevealScope>
      </section>

      {/* ── 6. UMA REVOLUÇÃO NO DESENVOLVIMENTO DE SOFTWARE (o fecho escuro) ──
          Os DOIS parágrafos do bloco sem `heading`, publicados inteiros, sob um título
          que é fragmento verbatim do primeiro deles. Faixa escura outra vez pelo mesmo
          contrato de contraste da faixa 4 — e sem capa de fundo aqui: duas faixas
          escuras com a MESMA arte velada na mesma rota é a arte repetida a 0,5% de
          visibilidade, custo de download sem leitura nenhuma. O que esta faixa tem é a
          malha e o anel.
          Esta faixa NÃO é parada do indicador: o título é derivado, não `heading` de
          bloco — e é o certo, parada tem de existir no dado. */}
      {fecho?.kind === 'paragraphs' && (
        <section
          className="section-py relative overflow-clip bg-[#001A3D]"
          /* SIS-220 (onda visual, item 6) — NOME ACESSÍVEL SEM `h2` VISUAL.
             O título sai de cena (item 1), mas a seção não pode ficar anônima: a
             lista de regiões de um leitor de tela passaria a ter um item sem rótulo
             entre duas faixas nomeadas. `aria-label` com o título antigo, e não um
             `h2` em `sr-only`, por uma razão medível: um `h2` oculto continua na
             ÁRVORE DE CABEÇALHOS, e quem navega por cabeçalhos pularia para um
             título que ninguém vê na tela — descasando a navegação por voz da
             navegação visual. `aria-label` nomeia a região sem inventar cabeçalho.
             ⚠️ Saiu `aria-labelledby={idDoBloco(TITULO_REVOLUCAO)}`: o `id` que ele
             apontava morava no `h2` removido, e referência pendurada em `id` que não
             existe mais deixa a seção sem nome nenhum, não com o nome antigo. */
          aria-label={TITULO_REVOLUCAO}
        >
          {/* SIS-220 (onda visual, item 3) — O VÍDEO DA JORNADA, no primitivo da casa.
              `HeroVideoBackdrop` e não um `<video>` escrito aqui porque o problema
              difícil desta peça já está resolvido lá e é contraintuitivo: `autoPlay`
              é GATILHO DE PARTIDA, não estado — o snapshot de servidor de
              `useReducedMotion` é sempre `false`, então o HTML sai com o atributo, o
              laço começa, e apagar o atributo depois não para nada. Lá a pausa é
              imperativa (`pause()` + `currentTime = 0`, casando com o pôster) e a
              árvore é UM nó nos dois casos, sem divergência de hidratação. Repetir
              isso inline seria repetir a chance de errar.
              O pôster foi gerado do QUADRO 0 do próprio arquivo, e isso não é detalhe:
              o estado parado do componente é `currentTime = 0`, então qualquer outro
              quadro apareceria como um salto no instante em que o vídeo some.
              ⚠️ `jornada.mp4` tem 15,8MB para 8s de laço — pesado para fundo
              decorativo. Não reencodei porque está fora do escopo desta issue; fica
              anotado no comentário dela.
              A grade e o anel continuam, e ficam DENTRO do envelope: eles são a
              assinatura da faixa, e o véu passa por cima do vídeo, não deles. */}
          <HeroVideoBackdrop
            src="/videos/jornada.mp4"
            poster="/videos/jornada-poster.webp"
            className="hero-backdrop--luminna-fecho"
          >
            <div aria-hidden className="grade-tecnica luminna-grade" />
            <AnelDoCiclo className="luminna-ciclo--escuro luminna-ciclo--baixo" />
            <RevealScope
              className="container-lp relative z-10"
              limiar={LIMIAR_REVEAL}
              margem={MARGEM_REVEAL}
              data-reveal-nome="luminna-fecho"
            >
              {/* SIS-220 (onda visual, item 4) — O CARTÃO CENTRADO.
                  Um parágrafo só (o dado já é único desde a 5ª volta da copy), então
                  não há `.map` de dois nem cascata de índice: o cartão É o conteúdo da
                  faixa. `max-w-3xl mx-auto` centra sem grid de duas colunas — a coluna
                  de arte saiu com o slot 3D. */}
              <div
                data-reveal="scale-soft"
                /* ⚠️ CONSERTO 01/10 — O CARTÃO INVERTEU: claro, com a escrita no tom
                   contrário. Era `bg-[#001A3D]/72` + `text-white/90`, ou seja escuro
                   sobre escuro, e ele desaparecia dentro do take.
                   `#F1F7FC` a 96% e não branco puro nem 100% de opacidade: 4% deixam
                   o movimento do vídeo insinuado nas bordas (é o que justifica haver
                   vídeo atrás) sem que o take atravesse a leitura, e o cinza-azulado
                   é o claro da casa, não um branco solto.
                   A tinta é `#0B2A4A`, o navy do texto — contraste ~12:1 sobre esse
                   fundo, bem acima do AA de 4,5:1, com folga de sobra para os 4% de
                   vídeo que atravessam. Sem opacidade na tinta: `text-white/90` fazia
                   sentido sobre escuro, mas tinta clareada sobre fundo claro é
                   justamente como se perde contraste sem perceber.

                   ⚠️ CONSERTO 02/10 — O CONSERTO DE 01/10 NUNCA ENTROU EM VIGOR, e o
                   motivo é uma pegadinha do Tailwind que falha calada. Estava escrito
                   `bg-[#F1F7FC]/96` e `border-[#0079CB]/22`: o modificador de opacidade
                   sem colchetes é procurado na ESCALA do tema, e a escala padrão do
                   Tailwind 3 vai de cinco em cinco (0,5,10,…,100). `96` e `22` não estão
                   nela, então as duas classes NÃO GERAM CSS NENHUM — o cartão ficava com
                   fundo totalmente transparente e a borda caía na cinza padrão do
                   preflight. Era o cartão «apagado» da captura de 02/10: a nota acima
                   dizia «4% deixam o vídeo insinuado» e na prática eram 100%.
                   Nada apita nisso: não é erro de tipo, o lint não vê classe de Tailwind
                   e o build não valida nome de utilitário. Classe inexistente é
                   indistinguível de classe ausente.
                   `/[96%]` e `/[22%]` — com colchetes — são a forma arbitrária, que não
                   passa pela escala. Verificado rodando o Tailwind num arquivo mínimo:
                   `/96` não emite regra, `/[96%]` emite `background-color: rgb(241 247
                   252 / 96%)`. Os valores são os mesmos que a nota de 01/10 escolheu;
                   só a sintaxe estava errada.
                   ⚠️ ISTO NÃO ERA CASO ÚNICO: a varredura de 02/10 achou 102
                   modificadores fora da escala (quase todos `border-…/12` e `/18`, que
                   degradam em silêncio para a borda cinza). Em 02/10 só este cartão
                   tinha sido corrigido.
                   ✅ 05/10/2026 — a SIS-305 corrigiu os outros 94, em 24 arquivos (dos
                   102 achados pelo regex, 8 eram CITAÇÕES em comentário como as de
                   cima, e não classes). Todos foram para a forma com colchetes, a
                   mesma deste cartão. E agora há portão: `npm run test:opacidade`
                   reprova opacidade fora da escala, então esta pegadinha não volta
                   calada. */
                className="luminna-fecho-card mx-auto max-w-3xl rounded-3xl border border-[#0079CB]/[22%] bg-[#F1F7FC]/[96%] p-7 text-center backdrop-blur-sm sm:p-10"
              >
                <p className="text-lg leading-relaxed text-[#0B2A4A]">
                  {realcarLuminna(fecho.paragraphs[0])}
                </p>
              </div>
            </RevealScope>
          </HeroVideoBackdrop>
          {/* SIS-220 (onda visual, itens 1 e 2) — O TÍTULO E O SLOT 3D SAÍRAM.
              Comentados, não apagados, porque o que sai aqui é a ÚNICA ocorrência
              publicada de `TITULO_REVOLUCAO` na rota e a única leitura do slot — e a
              nota longa abaixo é o registro de por que a caixa tinha proporção fixa.

              ⚠️ `TITULO_REVOLUCAO` CONTINUA EM USO: é o `aria-label` da seção, acima.
              Quem for remover a constante por «não é mais renderizada» quebra o nome
              acessível da faixa.

            <h2
              data-reveal="fade-up"
              id={idDoBloco(TITULO_REVOLUCAO)}
              className="font-display text-section font-bold text-white"
            >
              {TITULO_REVOLUCAO}
            </h2>

              SIS-220 item 7 — O SEGUNDO SLOT 3D, e o que «lugar medido» quer dizer.

                A rota fica com DOIS slots fora da Integração, ambos declarados aqui
                no código e não improvisados na hora:
                  · faixa 2 (ciclo de vida) — `luminna-midia`, `aspect-[4/3]`,
                    `sizes="(min-width: 1180px) 500px, 100vw"`;
                  · esta faixa (fecho) — `luminna-slot3d`, `aspect-[5/4]`, coluna de
                    `minmax(0,0.85fr)` ao lado do texto, `sizes` abaixo.
                Medido = a caixa tem proporção fixa e largura anunciada ANTES de a
                arte existir. É o que permite trocar o conteúdo por um render 3D sem
                mexer no layout: a reserva já está feita, o `aspect-[…]` não deixa a
                faixa pular quando a arte chegar, e o `sizes` já diz qual largura
                pedir. Uma caixa de altura automática só descobriria isso depois.

                ⚠️ O QUE ESTÁ DENTRO HOJE NÃO É 3D. É `VITRINE.capaCard`, a capa do
                cartão da vitrine — placeholder honesto, exatamente como a issue
                autoriza («placeholders até haver arte»). Está `aria-hidden` com
                `alt=""` porque não acrescenta informação a estes dois parágrafos; no
                dia em que entrar um render de verdade, o que muda é o `src` e o `alt`
                passa a ser descrição — o resto da caixa fica.

                ⚠️ E AQUI TEM O DEFEITO MEDIDO NA FAIXA 4 (linha 886): nada de
                `z-index` negativo. Esta faixa é `bg-[#001A3D]` chapado e não abre
                contexto de empilhamento só por ser `relative`; um filho negativo
                desceria para trás do próprio fundo e a arte desapareceria. Esta fica
                no fluxo, dentro do `RevealScope` que já é `z-10`.

              ⚠️ A grade de duas colunas sai INTEIRA, e não só a coluna da direita: com
              um parágrafo único e nenhuma arte ao lado, `lg:grid-cols-[1fr_0.85fr]`
              deixaria o texto comprimido a 54% da largura com metade da faixa vazia.

            <div className="mt-6 grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]">
              <div className="max-w-3xl space-y-4">
                {fecho.paragraphs.map((p, i) => (
                  <p
                    key={p.slice(0, 40)}
                    data-reveal="fade-up"
                    style={cascata(i + 1)}
                    className="text-lg leading-relaxed text-white/85"
                  >
                    {p}
                  </p>
                ))}
              </div>
              {VITRINE && (
                <div
                  data-reveal="scale-soft"
                  style={cascata(fecho.paragraphs.length + 1)}
                  className="luminna-slot3d relative aspect-[5/4] overflow-hidden rounded-3xl border border-[#57B7EE]/25"
                >
                  <Image
                    src={VITRINE.capaCard}
                    alt=""
                    aria-hidden
                    fill
                    sizes="(min-width: 1180px) 460px, 100vw"
                    loading="lazy"
                    className="luminna-slot3d-arte object-cover"
                  />
                </div>
              )}
            </div>
          */}
        </section>
      )}

      {/* ── 7. CONHEÇA TAMBÉM ────────────────────────────────────────────────
          A mesma peça de fecho das irmãs, e de propósito: ela é a versão desta família
          de páginas do `<nav>` «Outras soluções» do template, com as pílulas (a atual
          como `<span aria-current="page">`, fora da ordem de tabulação) e os seis
          cartões de irmã. Não é copy de ninguém — são o nome e a capa de cada solução,
          vindos de `accelerators.ts`/`ACCELERATOR_PAGES`, e a única frase própria é a
          linha de apoio, que é a mesma nas cinco rotas porque descreve a FAMÍLIA e não
          o produto.
          Os `href` saem de `${p.id}`/`${a.id}`, então a slug nova propaga sozinha aqui e
          nas cinco irmãs — é exatamente por isso que a troca de grafia foi feita no dado
          e não em links escritos à mão.
          A faixa é a mais baixa da página (`py-12`), então leva os pontos e NÃO a arte
          de canto: uma peça de 320px de lado numa faixa de ~176px de miolo seria
          recortada em quase tudo e o pedaço restante encostaria nos cartões.
          O VÉU sobre cada capa não é estética: as logos de `accelerators.ts` são de
          tinta clara e sobre as capas (que têm regiões claras) desapareceriam.
          O `alt` do logo NÃO é vazio, ao contrário das outras imagens desta página: o
          logo é a única coisa que identifica o destino do link, e sem texto acessível
          seriam seis links indistinguíveis (WCAG 2.4.4). */}
      <nav
        aria-labelledby="conheca-tambem"
        className="section-light relative overflow-clip py-12 md:py-16"
      >
        <AcentosClaros />
        <RevealScope
          className="container-lp relative z-10"
          limiar={LIMIAR_REVEAL}
          margem={MARGEM_REVEAL}
          data-reveal-nome="luminna-conheca"
        >
          <h2
            id="conheca-tambem"
            data-reveal="fade-up"
            className="font-display text-xl font-bold text-ink"
          >
            Conheça também
          </h2>
          <p
            data-reveal="fade-up"
            style={cascata(1)}
            className="mt-2 max-w-xl text-sm leading-relaxed text-ink-muted"
          >
            Soluções que trabalham juntas para uma seguradora mais inteligente e conectada.
          </p>

          <ul data-reveal="fade-up" style={cascata(2)} className="mt-5 flex flex-wrap gap-2">
            {ACCELERATOR_PAGES.map((p) => {
              const atual = p.id === page.id;
              return (
                <li key={p.id}>
                  {atual ? (
                    <span
                      aria-current="page"
                      className="inline-block rounded-full border border-[#0079CB]/70 bg-[#0079CB]/[12%] px-3 py-1.5 text-xs font-semibold text-[#0a1f44]"
                    >
                      {p.name}
                    </span>
                  ) : (
                    <Link
                      href={`/solucoes/${p.id}`}
                      className="inline-block rounded-full border border-[#0079CB]/20 bg-white/70 px-3 py-1.5 text-xs font-semibold text-[#0a1f44] transition-colors hover:border-[#0079CB]/60 hover:bg-white"
                    >
                      {p.name}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>

          <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {ACCELERATORS.filter((a) => a.id !== page.id).map((a, i) => (
              <li key={a.id} data-reveal="fade-up" style={cascata(i + 3)}>
                {/* O cartão INTEIRO é o link: alvo grande e um único destino. */}
                <Link
                  href={`/solucoes/${a.id}`}
                  className="luminna-midia group relative block aspect-[16/10] overflow-hidden rounded-xl border border-[#0079CB]/[18%] transition-colors hover:border-[#0079CB]/55"
                >
                  <Image
                    src={a.capaCard}
                    alt=""
                    aria-hidden
                    fill
                    sizes="(min-width: 1180px) 176px, (min-width: 640px) 33vw, 50vw"
                    loading="lazy"
                    className="luminna-midia-arte object-cover"
                  />
                  <span aria-hidden className="absolute inset-0 bg-[#001A3D]/55" />
                  <span className="absolute inset-0 flex items-center justify-center p-3">
                    {/* `width`/`height` são as dimensões INTRÍNSECAS do dado: com
                        `images: { unoptimized: true }` o que baixa é o arquivo do disco,
                        então o par serve para reservar a caixa e não distorcer a marca. */}
                    <Image
                      src={a.logo}
                      alt={a.name}
                      width={a.logoWidth}
                      height={a.logoHeight}
                      loading="lazy"
                      className="h-auto max-h-[62%] w-auto max-w-[78%] object-contain"
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href="/solucoes"
            data-reveal="fade-up"
            style={cascata(9)}
            /* `on-dark` É OBRIGATÓRIO: pílula de fundo cheio DENTRO de `.section-light`,
               cujos overrides pintam de navy tudo que traga `text-white`
               (`[class*="text-white"] { color: #0a1f44 }`, globals.css:1115). O fundo é
               `#0060A8` e não `#0079CB` pelo número medido na SIS-292: branco 0,88 sobre
               o primário dá ~4,2:1, abaixo do piso; sobre o azul de hover da paleta
               passa com folga. */
            className="on-dark mt-6 inline-flex items-center gap-2 rounded-full bg-[#0060A8] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#004D8A]"
          >
            Ver todas as soluções e serviços
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.2} aria-hidden />
          </Link>
        </RevealScope>
      </nav>
      {/* O modal montado no FIM da árvore, como em `Header.tsx`, e sem
          `title`/`description`: os defaults são a escrita «Fale com a gente». Ele se
          portala para fora daqui, então a posição no markup não afeta o desenho — o que
          ela evita é nascer dentro de uma seção com `transform`/`filter`, que ancoraria
          o `fixed` do `<dialog>` no lugar errado.
          SIS-220 (5ª volta): SEM GATILHO NA ROTA, o modal saiu junto com o CTA do hero —
          ver a nota no lugar do `useState`, acima. O contato continua alcançável pelo
          cabeçalho, que monta o seu próprio `ContactModal` em toda a página.
      <ContactModal open={contatoAberto} onClose={() => setContatoAberto(false)} />
      */}
    </>
  );
}
