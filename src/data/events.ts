import type { IconName } from '@/lib/icons';

export type EventKind =
  | 'proprio' // idealizado ou realizado pela Sistran
  | 'global' // eventos globais / internacionais
  | 'nacional' // eventos brasileiros
  | 'parceiro'; // eventos de parceiros de plataforma

/* Titulo e descricao verbatim de /eventos-inovacao/ (15 eventos, na ordem do
   site). O site nao informa data nem local de nenhum evento — por isso nao ha
   campo `location` nem `date` aqui.
   Fonte: .claude/conteudo-site/06-eventos-inovacao.md */
export type SistranEvent = {
  id: string;
  title: string;
  kind: EventKind;
  description: string;
  icon: IconName;
  featured?: boolean;
  image?: string;
  /**
   * SIS-106 — miniatura de 240px para o navegador lateral, em
   * `public/images/EVENTOS/thumb/`.
   *
   * É um ARQUIVO PRÓPRIO, e não a arte grande servida pequena: `next.config` está
   * com `images: { unoptimized: true }`, então o `next/image` entrega o arquivo do
   * disco como ele está — reaproveitar `image` na lista faria as quinze artes de
   * ~180 KB baixarem de uma vez, ~2,7 MB para quinze quadradinhos. Em 240px o
   * conjunto inteiro dá 124 KB.
   *
   * Campo explícito em vez de derivado do `image` por troca de string: o caminho
   * fica verificável por leitura e por script, e não depende de a convenção de
   * nome continuar valendo. Gerado com `sharp` (240px, WebP q74).
   */
  thumb?: string;
};

export const EVENT_KIND_META: Record<EventKind, { label: string; tone: string }> = {
  proprio: { label: 'Realizado pela Sistran', tone: '#0ed8f6' },
  global: { label: 'Evento global', tone: '#A78BFA' },
  nacional: { label: 'Evento nacional', tone: '#57B7EE' },
  parceiro: { label: 'Evento de parceiro', tone: '#C4A0FB' },
};

/**
 * SIS-104 — arte dos eventos: alta qualidade, em WebP, na pasta que já existia.
 *
 * As 13 artes que ganharam versão nova chegaram em PNG de ~2 MB (1672×941) numa
 * pasta separada, `public/images/Eventosaltaqualidade/`. Nada disso entrou no
 * repositório como estava, por três motivos:
 *
 * 1. FORMATO. São fotos e composições com fundo, não gráficos com transparência
 *    — PNG é o formato errado. Convertidas para WebP q82 mantendo a resolução
 *    maior: 28 MB viraram 2,3 MB, ~110–220 KB por arte, ainda quase o dobro da
 *    resolução das antigas (900×506). O peso de repositório e o tempo de build
 *    importam mesmo com o `next/image` otimizando o que é servido.
 *
 * 2. PASTA. Os arquivos foram para dentro de `public/images/EVENTOS/` e a pasta
 *    nova foi removida — duas pastas com a mesma arte deixariam 28 MB órfãos.
 *
 * 3. CAIXA DOS NOMES. A pasta nova usava outra caixa e outros nomes
 *    (`Ev4-pega`, `Ev6-Weninar-suitability`, `cqcs`, `agile`, `aws`…). Manter os
 *    nomes ATUAIS é o que garante que o caminho já está validado em produção:
 *    Windows não diferencia maiúsculas, mas o build em Linux e o CloudFront sim,
 *    e um caminho com caixa errada só quebra depois do deploy. Só a extensão
 *    mudou, de `.jpg` para `.webp`.
 *
 * PROPORÇÃO conferida antes da troca: 1,777 nas novas contra 1,779 nas antigas.
 * O `EventsGrid` usa `fill` + `object-cover`, então diferença de proporção
 * recortaria a arte — com 0,002 de diferença não há recorte novo.
 *
 * ⚠️ DUAS ARTES CONTINUAM EM BAIXA: `summit-julho-26.jpg` (Web Summit AI) e
 * `SPIW-julho-2026.jpg`. Elas não têm versão nova — os arquivos entregues na
 * pasta de alta qualidade eram os MESMOS JPG de 77 KB e 900×506 já usados aqui.
 * Ficaram em `.jpg` de propósito: a extensão diferente é o marcador de que essas
 * duas ainda esperam a arte boa. Ao receber as versões novas, converter para
 * WebP do mesmo jeito e trocar a extensão nas duas linhas.
 *
 * O caso do Web Summit é o mais visível: é o primeiro card da grade e o único
 * com `priority`, então a diferença de nitidez aparece ao lado dos demais.
 */
export const EVENTS: readonly SistranEvent[] = [
  {
    id: 'web-summit-ai',
    title: 'Web Summit AI · Ofertas Personalizadas de Seguros',
    kind: 'proprio',
    icon: 'Cpu',
    featured: true,
    /* SIS-104 — sem versão de alta qualidade ainda (ver a nota acima do array). */
    image: '/images/EVENTOS/summit-julho-26.jpg',
    thumb: '/images/EVENTOS/thumb/summit-julho-26.webp',
    description:
      'Realizado pela Sistran e com a presença de grandes líderes do mercado de seguros, o evento teve como foco mostrar o potencial da inteligência artificial na geração das ofertas de seguros assessorando os agentes e corretores. Vale a pena ver esse evento que está disponível no canal do YouTube da Sistran.',
  },
  {
    id: 'itc-vegas',
    title: 'ITC Vegas',
    kind: 'global',
    icon: 'Sparkles',
    image: '/images/EVENTOS/itc-vegas-julho-26.webp',
    thumb: '/images/EVENTOS/thumb/itc-vegas-julho-26.webp',
    description:
      'A Sistran todos os anos se une aos grandes nomes da tecnologia para esse que é o maior congresso focado em inovação e Insurtechs do mercado securitário global.',
  },
  {
    id: 'cqcs-inovacao',
    title: 'CQCS Inovação',
    kind: 'global',
    icon: 'Zap',
    image: '/images/EVENTOS/cqcs-julho-2026.webp',
    thumb: '/images/EVENTOS/thumb/cqcs-julho-2026.webp',
    description:
      'A Sistran consolidou sua participação efetiva como palestrante e expositora nas edições do CQCS Inovação que é o maior evento Latino Americano de Inovação em Seguros e um dos principais do mundo. Ocasião propícia para estreitar laços com clientes, parceiros, e claro, projetar novas oportunidades de negócios e crescimento.',
  },
  {
    id: 'pega-world',
    title: 'Pega World',
    kind: 'parceiro',
    icon: 'Boxes',
    image: '/images/EVENTOS/Ev4-Pega-World.webp',
    thumb: '/images/EVENTOS/thumb/Ev4-Pega-World.webp',
    description:
      'Confirmando nosso compromisso com a plataforma tecnológica Pegasystems, a Sistran considera fundamental participar dos encontros Pega World em Las Vegas. Uma verdadeira experiência imersiva no futuro da TI.',
  },
  {
    id: 'insurtech-brasil',
    title: 'Insurtech Brasil',
    kind: 'nacional',
    icon: 'Layers',
    image: '/images/EVENTOS/insurtech-julho-26.webp',
    thumb: '/images/EVENTOS/thumb/insurtech-julho-26.webp',
    description:
      'Importante evento de tecnologia e inovação para o mercado segurador, anualmente, o Insurtech Brasil conta com a presença da equipe Sistran em suas edições para compartilhar e adquirir conhecimentos.',
  },
  {
    id: 'suitability-ai',
    title: 'Suitability e AI em Seguros · Ruptura ou inovação?',
    kind: 'proprio',
    icon: 'ShieldCheck',
    featured: true,
    image: '/images/EVENTOS/Ev6-Weninar-Suitability.webp',
    thumb: '/images/EVENTOS/thumb/Ev6-Weninar-Suitability.webp',
    description:
      'Idealizado pela Sistran, esse evento virtual abordou o desafio de como atender demandas de consumidores cada vez mais exigentes: atualizados, acostumados com autosserviços e informações instantâneas, eles esperam um nível mais sofisticado de serviços digitais, que já experimentam em outros setores. Essa "facilidade" traz para o segurado uma expectativa de maior aderência das ofertas às suas necessidades. Foram 3 dias de webinar que estão disponíveis no canal do YouTube da Sistran.',
  },
  {
    id: 'open-summit',
    title: 'Open Summit',
    kind: 'proprio',
    icon: 'Workflow',
    image: '/images/EVENTOS/Ev7-Open-Summit.webp',
    thumb: '/images/EVENTOS/thumb/Ev7-Open-Summit.webp',
    description:
      'O evento virtual Open Summit contou com uma semana de conteúdo com grandes palestrantes e especialistas em Open Banking, Payments, Moedas Digitais, Fintechs, Insurtechs e Open Innovation e a Sistran participou da curadoria do Open Insurance, dia especialmente voltado a Seguros, assessorando na seleção dos palestrantes, tema para os debates, assim como a divulgação do evento.',
  },
  {
    id: 'fenacor',
    title: 'Congresso Brasileiro dos Corretores de Seguros · FENACOR',
    kind: 'nacional',
    icon: 'Users',
    image: '/images/EVENTOS/Ev8-Congresso-Brasileiro.webp',
    thumb: '/images/EVENTOS/thumb/Ev8-Congresso-Brasileiro.webp',
    description:
      'O Congresso Brasileiro dos Corretores de Seguros, organizado pela FENACOR (Federação Nacional dos Corretores de Seguros), é o maior evento do setor de seguros no Brasil. Ele reúne corretores de seguros, seguradoras, empresas de tecnologia e outros profissionais do mercado para discutir as últimas tendências, desafios e oportunidades do setor.',
  },
  {
    id: 'conec',
    title: 'CONEC',
    kind: 'nacional',
    icon: 'HeartHandshake',
    image: '/images/EVENTOS/conec-julho-26.webp',
    thumb: '/images/EVENTOS/thumb/conec-julho-26.webp',
    description:
      'O Conec é um evento de grande relevância para o setor de seguros, organizado pelo Sincor (Sindicato dos Corretores de Seguros). Reúne milhares de profissionais da área para discutir as últimas tendências, compartilhar conhecimentos e fortalecer as relações entre os participantes.',
  },
  {
    id: 'agile-trends',
    title: 'Agile Trends',
    kind: 'nacional',
    icon: 'Zap',
    image: '/images/EVENTOS/Agile2025.webp',
    thumb: '/images/EVENTOS/thumb/Agile2025.webp',
    description:
      'O Agile Trends reúne os principais players do mercado para trazer tendências da metodologia ágil e práticas modernas de gestão. Equipe técnica da Sistran sempre presente.',
  },
  {
    id: 'apix',
    title: 'APIX',
    kind: 'parceiro',
    icon: 'Code2',
    image: '/images/EVENTOS/apix-julho-26.webp',
    thumb: '/images/EVENTOS/thumb/apix-julho-26.webp',
    description:
      'O APIX é um evento que promove discussões técnicas estratégicas sobre as principais tendências em APIs e tecnologias correlatas. Realizado pela Sensedia, nosso parceiro de Plataforma de Gerenciamento de APIs, a Sistran faz questão de estar presente ao longo das edições para firmar essa união, com foco em projetos futuros compartilhando expertise, comprometimento e colaboração.',
  },
  {
    id: 'febraban-tech',
    title: 'Febraban Tech',
    kind: 'nacional',
    icon: 'Building2',
    image: '/images/EVENTOS/FebrabanTech2025.webp',
    thumb: '/images/EVENTOS/thumb/FebrabanTech2025.webp',
    description:
      'A Sistran prioriza sua participação no Febraban Tech que é o maior evento de tecnologia e inovação do setor financeiro brasileiro.',
  },
  {
    id: 'conseguro',
    title: 'Conseguro',
    kind: 'nacional',
    icon: 'Briefcase',
    image: '/images/EVENTOS/Conseguro2025.webp',
    thumb: '/images/EVENTOS/thumb/Conseguro2025.webp',
    description:
      'O Conseguro é um dos principais eventos do setor de seguros no Brasil. Realizado pela CNseg, trata-se de um congresso nacional que reúne profissionais, empresas, executivos e especialistas da indústria de seguros, previdência e capitalização.',
  },
  {
    id: 'spiw',
    title: 'São Paulo Innovation Week · SPIW',
    kind: 'nacional',
    icon: 'Sparkles',
    /* SIS-104 — sem versão de alta qualidade ainda (ver a nota acima do array). */
    image: '/images/EVENTOS/SPIW-julho-2026.jpg',
    thumb: '/images/EVENTOS/thumb/SPIW-julho-2026.webp',
    description:
      'Sistran esteve presente na primeira edição da São Paulo Innovation Week (SPIW) que consolidou a capital paulista no circuito global de tecnologia e negócios ao atrair mais de 80 mil pessoas. O festival contou com 33 palcos temáticos e 1.900 palestrantes nacionais e internacionais que debateram os impactos da inteligência artificial, sustentabilidade, saúde e inovação social.',
  },
  {
    id: 'aws-summit-sp',
    title: 'AWS Summit São Paulo',
    kind: 'global',
    icon: 'Cog',
    image: '/images/EVENTOS/aws-summit-julho-26.webp',
    thumb: '/images/EVENTOS/thumb/aws-summit-julho-26.webp',
    description:
      'A Sistran esteve presente no AWS Summit São Paulo para explorar as inovações mais recentes em computação, armazenamento e inteligência artificial generativa.',
  },
];
