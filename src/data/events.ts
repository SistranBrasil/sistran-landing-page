import type { IconName } from '@/lib/icons';

export type EventKind =
  | 'proprio' // idealizado ou realizado pela Sistran
  | 'global' // eventos globais / internacionais
  | 'nacional' // eventos brasileiros
  | 'parceiro'; // eventos de parceiros de plataforma

export type SistranEvent = {
  id: string;
  title: string;
  kind: EventKind;
  location?: string;
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
      'Realizado pela Sistran e com a presença de grandes líderes do mercado de seguros, o evento teve como foco mostrar o potencial da inteligência artificial na geração de ofertas de seguros, assessorando agentes e corretores. Disponível no canal do YouTube da Sistran.',
  },
  {
    id: 'itc-vegas',
    title: 'ITC Vegas',
    kind: 'global',
    location: 'Las Vegas, EUA',
    icon: 'Sparkles',
    image: '/images/EVENTOS/itc-vegas-julho-26.jpg',
    description:
      'A Sistran todos os anos se une aos grandes nomes da tecnologia para o maior congresso focado em inovação e Insurtechs do mercado securitário global.',
  },
  {
    id: 'cqcs-inovacao',
    title: 'CQCS Inovação',
    kind: 'global',
    location: 'América Latina',
    icon: 'Zap',
    image: '/images/EVENTOS/cqcs-julho-2026.jpg',
    description:
      'A Sistran consolidou sua participação efetiva como palestrante e expositora nas edições do CQCS Inovação, o maior evento latino-americano de inovação em seguros e um dos principais do mundo.',
  },
  {
    id: 'pega-world',
    title: 'Pega World',
    kind: 'parceiro',
    location: 'Las Vegas, EUA',
    icon: 'Boxes',
    image: '/images/EVENTOS/Ev4-Pega-World.jpg',
    description:
      'Confirmando o compromisso com a plataforma tecnológica Pegasystems, a Sistran considera fundamental participar dos encontros Pega World em Las Vegas. Uma verdadeira experiência imersiva no futuro da TI.',
  },
  {
    id: 'insurtech-brasil',
    title: 'Insurtech Brasil',
    kind: 'nacional',
    location: 'Brasil',
    icon: 'Layers',
    image: '/images/EVENTOS/insurtech-julho-26.jpg',
    description:
      'Importante evento de tecnologia e inovação para o mercado segurador. Anualmente, o Insurtech Brasil conta com a presença da equipe Sistran em suas edições para compartilhar e adquirir conhecimentos.',
  },
  {
    id: 'suitability-ai',
    title: 'Suitability e IA em Seguros · Ruptura ou inovação?',
    kind: 'proprio',
    icon: 'ShieldCheck',
    featured: true,
    image: '/images/EVENTOS/Ev6-Weninar-Suitability.jpg',
    description:
      'Idealizado pela Sistran, esse evento virtual abordou o desafio de atender demandas de consumidores cada vez mais exigentes. Foram 3 dias de webinar disponíveis no canal do YouTube da Sistran.',
  },
  {
    id: 'open-summit',
    title: 'Open Summit',
    kind: 'proprio',
    icon: 'Workflow',
    image: '/images/EVENTOS/Ev7-Open-Summit.jpg',
    description:
      'Semana de conteúdo com palestrantes e especialistas em Open Banking, Payments, Moedas Digitais, Fintechs, Insurtechs e Open Innovation. A Sistran participou da curadoria do Open Insurance, dia especialmente voltado a Seguros.',
  },
  {
    id: 'fenacor',
    title: 'Congresso Brasileiro dos Corretores de Seguros · FENACOR',
    kind: 'nacional',
    location: 'Brasil',
    icon: 'Users',
    image: '/images/EVENTOS/Ev8-Congresso-Brasileiro.jpg',
    description:
      'Maior evento do setor de seguros no Brasil, organizado pela FENACOR. Reúne corretores, seguradoras, empresas de tecnologia e profissionais do mercado para discutir tendências, desafios e oportunidades.',
  },
  {
    id: 'conec',
    title: 'CONEC',
    kind: 'nacional',
    location: 'Brasil',
    icon: 'HeartHandshake',
    image: '/images/EVENTOS/conec-julho-26.jpg',
    description:
      'Evento de grande relevância para o setor de seguros, organizado pelo Sincor. Reúne milhares de profissionais para discutir tendências, compartilhar conhecimentos e fortalecer relações entre os participantes.',
  },
  {
    id: 'agile-trends',
    title: 'Agile Trends',
    kind: 'nacional',
    location: 'Brasil',
    icon: 'Zap',
    image: '/images/EVENTOS/Agile2025.jpg',
    description:
      'Reúne os principais players do mercado para trazer tendências da metodologia ágil e práticas modernas de gestão. Equipe técnica da Sistran sempre presente.',
  },
  {
    id: 'apix',
    title: 'APIX',
    kind: 'parceiro',
    icon: 'Code2',
    image: '/images/EVENTOS/apix-julho-26.jpg',
    description:
      'Promove discussões técnicas estratégicas sobre as principais tendências em APIs e tecnologias correlatas. Realizado pela Sensedia, parceira de Plataforma de Gerenciamento de APIs, a Sistran faz questão de estar presente em todas as edições.',
  },
  {
    id: 'febraban-tech',
    title: 'Febraban Tech',
    kind: 'nacional',
    location: 'Brasil',
    icon: 'Building2',
    image: '/images/EVENTOS/FebrabanTech2025.jpg',
    description:
      'A Sistran prioriza sua participação no Febraban Tech, o maior evento de tecnologia e inovação do setor financeiro brasileiro.',
  },
  {
    id: 'conseguro',
    title: 'Conseguro',
    kind: 'nacional',
    location: 'Brasil',
    icon: 'Briefcase',
    image: '/images/EVENTOS/Conseguro2025.jpg',
    description:
      'Um dos principais eventos do setor de seguros no Brasil, realizado pela CNseg. Congresso nacional que reúne profissionais, empresas, executivos e especialistas da indústria de seguros, previdência e capitalização.',
  },
  {
    id: 'spiw',
    title: 'São Paulo Innovation Week · SPIW',
    kind: 'nacional',
    location: 'São Paulo, SP',
    icon: 'Sparkles',
    image: '/images/EVENTOS/SPIW-julho-2026.jpg',
    description:
      'A Sistran esteve presente na primeira edição da SPIW, que consolidou a capital paulista no circuito global de tecnologia e negócios, atraindo mais de 80 mil pessoas, com 33 palcos temáticos e 1.900 palestrantes nacionais e internacionais.',
  },
  {
    id: 'aws-summit-sp',
    title: 'AWS Summit São Paulo',
    kind: 'global',
    location: 'São Paulo, SP',
    icon: 'Cog',
    image: '/images/EVENTOS/aws-summit-julho-26.jpg',
    description:
      'A Sistran esteve presente no AWS Summit São Paulo para explorar as inovações mais recentes em computação, armazenamento e inteligência artificial generativa.',
  },
];
