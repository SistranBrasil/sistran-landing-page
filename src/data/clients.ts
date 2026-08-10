// Seguradoras/parceiros mencionados na trajetória da Sistran.
// Seção "Seguradoras e parceiros que atendemos".
//
// `logo`: opcional. Onde ha arquivo em /public/images o card vira placa branca
// com a marca; sem arquivo cai no chip textual (nome + ponto ciano). Assim a
// lista aceita logos uma a uma sem que a seção quebre por falta de asset.
//
// As seguradoras (Bradesco, Mapfre, Zurich, ...) ainda nao tem arquivo no
// projeto — basta dropar o PNG em /public/images/clientes/ e apontar aqui.
export type Client = {
  name: string;
  logo?: string;
};

export const CLIENTS: readonly Client[] = [
  // --- Parceiros com logo disponivel no projeto ---
  { name: 'Samplemed', logo: '/images/samplemed-logo-vertical-rgb.png' },
  { name: 'Virtusa', logo: '/images/Logo-Virtusa-1200x416-1.png' },
  { name: 'ITG', logo: '/images/itg-logo.png' },
  { name: 'Microsoft Azure', logo: '/images/Microsoft-Azure.png' },
  { name: 'Pega', logo: '/images/PNG-LogoPega-Site.png' },
  { name: 'AWS', logo: '/images/AWS.png' },
  { name: 'ST-IT', logo: '/images/st-it-sombra-branca.png' },
  { name: 'Addactis', logo: '/images/Addactis-logo.png' },
  { name: 'Sys4B', logo: '/images/Sys4b.png' },
  { name: 'FRISS', logo: '/images/Friss.png' },
  { name: 'Sensedia', logo: '/images/Sensedia-logo-website-UPDATED2.png' },
  { name: 'SAP', logo: '/images/SAP.png' },
  { name: 'Picsel', logo: '/images/Picsel-logo.png' },
  { name: 'Earnix', logo: '/images/Earnix_logo.png' },
  { name: 'Dacadoo', logo: '/images/Dacadoo-Logo_1.png' },

  // --- Seguradoras: comentadas ate termos o arquivo de logo. ---
  // Para reativar: coloque o PNG em /public/images/clientes/ e descomente a
  // linha com o caminho, ex.:
  //   { name: 'Bradesco Seguros', logo: '/images/clientes/bradesco-seguros.png' },
  // Sem `logo` o card volta a renderizar como chip textual.
  //
  // { name: 'Bradesco Seguros' },
  // { name: 'Mapfre' },
  // { name: 'Zurich Brasil' },
  // { name: 'AIG' },
  // { name: 'Sompo' },
  // { name: 'Marítima' },
  // { name: 'Allianz' },
  // { name: 'Generali' },
  // { name: 'Santander' },
  // { name: 'Swiss Re' },
  // { name: 'Seguros Unimed' },
  // { name: 'Assurant' },
  // { name: 'Notre Dame' },
  // { name: 'Royal & Sun Alliance' },
  // { name: 'QBE Brasil' },
  // { name: 'IRB' },
  // { name: 'Aliança do Brasil' },
  // { name: 'Brasil Seguradora' },
  // { name: 'Winterthur' },
  // { name: 'MBM' },
  // { name: 'Combined' },
  // { name: 'BTG / Too Seguros' },
  // { name: 'BCN' },
  // { name: 'ENS' },
] as const;
