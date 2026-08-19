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
};

export const EVENT_KIND_META: Record<EventKind, { label: string; tone: string }> = {
  proprio: { label: 'Realizado pela Sistran', tone: '#0ed8f6' },
  global: { label: 'Evento global', tone: '#A78BFA' },
  nacional: { label: 'Evento nacional', tone: '#57B7EE' },
  parceiro: { label: 'Evento de parceiro', tone: '#C4A0FB' },
};

export const EVENTS: readonly SistranEvent[] = [
  {
    id: 'web-summit-ai',
    title: 'Web Summit AI · Ofertas Personalizadas de Seguros',
    kind: 'proprio',
    icon: 'Cpu',
    featured: true,
    image: '/images/EVENTOS/summit-julho-26.jpg',
    description:
      'Realizado pela Sistran e com a presença de grandes líderes do mercado de seguros, o evento teve como foco mostrar o potencial da inteligência artificial na geração das ofertas de seguros assessorando os agentes e corretores. Vale a pena ver esse evento que está disponível no canal do YouTube da Sistran.',
  },
  {
    id: 'itc-vegas',
    title: 'ITC Vegas',
    kind: 'global',
    icon: 'Sparkles',
    image: '/images/EVENTOS/itc-vegas-julho-26.jpg',
    description:
      'A Sistran todos os anos se une aos grandes nomes da tecnologia para esse que é o maior congresso focado em inovação e Insurtechs do mercado securitário global.',
  },
  {
    id: 'cqcs-inovacao',
    title: 'CQCS Inovação',
    kind: 'global',
    icon: 'Zap',
    image: '/images/EVENTOS/cqcs-julho-2026.jpg',
    description:
      'A Sistran consolidou sua participação efetiva como palestrante e expositora nas edições do CQCS Inovação que é o maior evento Latino Americano de Inovação em Seguros e um dos principais do mundo. Ocasião propícia para estreitar laços com clientes, parceiros, e claro, projetar novas oportunidades de negócios e crescimento.',
  },
  {
    id: 'pega-world',
    title: 'Pega World',
    kind: 'parceiro',
    icon: 'Boxes',
    image: '/images/EVENTOS/Ev4-Pega-World.jpg',
    description:
      'Confirmando nosso compromisso com a plataforma tecnológica Pegasystems, a Sistran considera fundamental participar dos encontros Pega World em Las Vegas. Uma verdadeira experiência imersiva no futuro da TI.',
  },
  {
    id: 'insurtech-brasil',
    title: 'Insurtech Brasil',
    kind: 'nacional',
    icon: 'Layers',
    image: '/images/EVENTOS/insurtech-julho-26.jpg',
    description:
      'Importante evento de tecnologia e inovação para o mercado segurador, anualmente, o Insurtech Brasil conta com a presença da equipe Sistran em suas edições para compartilhar e adquirir conhecimentos.',
  },
  {
    id: 'suitability-ai',
    title: 'Suitability e AI em Seguros · Ruptura ou inovação?',
    kind: 'proprio',
    icon: 'ShieldCheck',
    featured: true,
    image: '/images/EVENTOS/Ev6-Weninar-Suitability.jpg',
    description:
      'Idealizado pela Sistran, esse evento virtual abordou o desafio de como atender demandas de consumidores cada vez mais exigentes: atualizados, acostumados com autosserviços e informações instantâneas, eles esperam um nível mais sofisticado de serviços digitais, que já experimentam em outros setores. Essa "facilidade" traz para o segurado uma expectativa de maior aderência das ofertas às suas necessidades. Foram 3 dias de webinar que estão disponíveis no canal do YouTube da Sistran.',
  },
  {
    id: 'open-summit',
    title: 'Open Summit',
    kind: 'proprio',
    icon: 'Workflow',
    image: '/images/EVENTOS/Ev7-Open-Summit.jpg',
    description:
      'O evento virtual Open Summit contou com uma semana de conteúdo com grandes palestrantes e especialistas em Open Banking, Payments, Moedas Digitais, Fintechs, Insurtechs e Open Innovation e a Sistran participou da curadoria do Open Insurance, dia especialmente voltado a Seguros, assessorando na seleção dos palestrantes, tema para os debates, assim como a divulgação do evento.',
  },
  {
    id: 'fenacor',
    title: 'Congresso Brasileiro dos Corretores de Seguros · FENACOR',
    kind: 'nacional',
    icon: 'Users',
    image: '/images/EVENTOS/Ev8-Congresso-Brasileiro.jpg',
    description:
      'O Congresso Brasileiro dos Corretores de Seguros, organizado pela FENACOR (Federação Nacional dos Corretores de Seguros), é o maior evento do setor de seguros no Brasil. Ele reúne corretores de seguros, seguradoras, empresas de tecnologia e outros profissionais do mercado para discutir as últimas tendências, desafios e oportunidades do setor.',
  },
  {
    id: 'conec',
    title: 'CONEC',
    kind: 'nacional',
    icon: 'HeartHandshake',
    image: '/images/EVENTOS/conec-julho-26.jpg',
    description:
      'O Conec é um evento de grande relevância para o setor de seguros, organizado pelo Sincor (Sindicato dos Corretores de Seguros). Reúne milhares de profissionais da área para discutir as últimas tendências, compartilhar conhecimentos e fortalecer as relações entre os participantes.',
  },
  {
    id: 'agile-trends',
    title: 'Agile Trends',
    kind: 'nacional',
    icon: 'Zap',
    image: '/images/EVENTOS/Agile2025.jpg',
    description:
      'O Agile Trends reúne os principais players do mercado para trazer tendências da metodologia ágil e práticas modernas de gestão. Equipe técnica da Sistran sempre presente.',
  },
  {
    id: 'apix',
    title: 'APIX',
    kind: 'parceiro',
    icon: 'Code2',
    image: '/images/EVENTOS/apix-julho-26.jpg',
    description:
      'O APIX é um evento que promove discussões técnicas estratégicas sobre as principais tendências em APIs e tecnologias correlatas. Realizado pela Sensedia, nosso parceiro de Plataforma de Gerenciamento de APIs, a Sistran faz questão de estar presente ao longo das edições para firmar essa união, com foco em projetos futuros compartilhando expertise, comprometimento e colaboração.',
  },
  {
    id: 'febraban-tech',
    title: 'Febraban Tech',
    kind: 'nacional',
    icon: 'Building2',
    image: '/images/EVENTOS/FebrabanTech2025.jpg',
    description:
      'A Sistran prioriza sua participação no Febraban Tech que é o maior evento de tecnologia e inovação do setor financeiro brasileiro.',
  },
  {
    id: 'conseguro',
    title: 'Conseguro',
    kind: 'nacional',
    icon: 'Briefcase',
    image: '/images/EVENTOS/Conseguro2025.jpg',
    description:
      'O Conseguro é um dos principais eventos do setor de seguros no Brasil. Realizado pela CNseg, trata-se de um congresso nacional que reúne profissionais, empresas, executivos e especialistas da indústria de seguros, previdência e capitalização.',
  },
  {
    id: 'spiw',
    title: 'São Paulo Innovation Week · SPIW',
    kind: 'nacional',
    icon: 'Sparkles',
    image: '/images/EVENTOS/SPIW-julho-2026.jpg',
    description:
      'Sistran esteve presente na primeira edição da São Paulo Innovation Week (SPIW) que consolidou a capital paulista no circuito global de tecnologia e negócios ao atrair mais de 80 mil pessoas. O festival contou com 33 palcos temáticos e 1.900 palestrantes nacionais e internacionais que debateram os impactos da inteligência artificial, sustentabilidade, saúde e inovação social.',
  },
  {
    id: 'aws-summit-sp',
    title: 'AWS Summit São Paulo',
    kind: 'global',
    icon: 'Cog',
    image: '/images/EVENTOS/aws-summit-julho-26.jpg',
    description:
      'A Sistran esteve presente no AWS Summit São Paulo para explorar as inovações mais recentes em computação, armazenamento e inteligência artificial generativa.',
  },
];
