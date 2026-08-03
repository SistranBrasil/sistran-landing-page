export type TimelineCategory = 'grandes' | 'pme' | 'solucoes';

export type TimelineEvent = {
  id: number;
  company: string;
  detail: string;
  category: TimelineCategory;
  generation: string;
  accent?: boolean;
};

export const TIMELINE_EVENTS: readonly TimelineEvent[] = [
  { id: 1, company: 'Castelo Costa · Coplaven · Zurich Brasil', detail: 'Auto, resseguros e vida', category: 'solucoes', generation: '1ª geração' },
  { id: 2, company: 'Commercial Union · Gente Seguradora', detail: 'Auto, resseguros e vida', category: 'pme', generation: '1ª geração' },
  { id: 3, company: 'Total Life · Santander · SBF · Swiss Re', detail: 'Auto e resseguros', category: 'pme', generation: '1ª geração' },
  { id: 4, company: 'BCN · Bradesco · Real Seguros', detail: 'Resseguros e vida', category: 'pme', generation: '2ª geração' },
  { id: 5, company: 'AGF Allianz · GNP', detail: 'Auto e resseguros', category: 'pme', generation: '2ª geração' },
  { id: 6, company: 'QBE Brasil (BMC) · United', detail: 'Auto, resseguros e vida', category: 'pme', generation: '2ª geração' },
  { id: 7, company: 'Aliança do Brasil · Brasil Seguradora · Winterthur', detail: 'Resseguros e vida', category: 'pme', generation: '2ª geração' },
  { id: 8, company: 'Cia Excelsior · Áurea Seguradora', detail: 'Life, P&C e Auto', category: 'pme', generation: '2ª geração' },
  { id: 9, company: 'Notre Dame · Royal & Sun Alliance', detail: 'Life e P&C', category: 'solucoes', generation: '2ª geração' },
  { id: 10, company: 'ECC Embraer · Mapfre', detail: 'Resseguros e vida', category: 'solucoes', generation: '3ª geração' },
  { id: 11, company: 'Combined · Generali', detail: 'Auto, resseguros e vida', category: 'pme', generation: '2ª geração' },
  { id: 12, company: 'Bradesco Vida e Previdência · Conapp · Cia Mutual', detail: 'Life, Auto, resseguros e vida', category: 'grandes', generation: '3ª geração' },
  { id: 13, company: 'Marítima · Sompo · Orbital · MBM', detail: 'Vida, resseguros e proteção', category: 'grandes', generation: '3ª geração' },
  { id: 14, company: 'AIG', detail: 'Resseguros', category: 'grandes', generation: '3ª geração' },
  { id: 15, company: 'Bradesco Seguros · BTG/Too Seguros', detail: 'Plataformas de vida', category: 'solucoes', generation: '4ª geração', accent: true },
  { id: 16, company: 'ENS', detail: 'Escola de Negócios e Seguros', category: 'solucoes', generation: 'Ecossistema' },
  { id: 17, company: 'Mapfre', detail: 'Evolução contínua de soluções', category: 'grandes', generation: 'Nova geração' },
  { id: 18, company: 'Seguros Unimed · Núclea', detail: 'Integração e escala', category: 'solucoes', generation: 'Nova geração' },
  { id: 19, company: 'EY', detail: 'Governança e transformação', category: 'grandes', generation: 'Parceria' },
  { id: 20, company: 'Pega', detail: 'Aceleração de processos', category: 'grandes', generation: 'Plataforma' },
  { id: 21, company: 'G8Seg', detail: 'Operação de seguros', category: 'grandes', generation: 'Implantação' },
  { id: 22, company: 'IRB (Seg)', detail: 'Resseguros em escala', category: 'grandes', generation: 'Implantação' },
  { id: 23, company: 'Redion', detail: 'Tecnologia para seguros', category: 'grandes', generation: 'Implantação' },
  { id: 24, company: 'Assurant', detail: 'Experiência conectada', category: 'grandes', generation: 'Implantação' },
] as const;

export const TIMELINE_CATEGORY_META: Record<TimelineCategory, { label: string; color: string }> = {
  grandes: { label: 'Empresas grandes', color: '#9fc5ff' },
  pme: { label: 'Empresas PME', color: '#ff8a3d' },
  solucoes: { label: 'Soluções', color: '#7ad450' },
};
