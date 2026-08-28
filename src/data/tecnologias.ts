/**
 * Tecnologias da vitrine de /quem-somos.
 *
 * FONTE ÚNICA: nome, caminho da imagem, texto alternativo e trilho de cada
 * tecnologia moram aqui. O componente não importa imagem nenhuma e não conhece
 * nome nenhum — ele percorre estas listas.
 *
 * ── De onde vêm os arquivos ─────────────────────────────────────────────────
 * Todas as logos são arquivos LOCAIS e OFICIAIS, em `public/images/logotecnologia/`:
 *
 * - onze já estavam soltas na pasta (angular, java, mongodb, nodejs, python,
 *   react, redis, rest-api, spring-boot, dotnet, zendesk);
 * - `pega`, `qa` e `aws` são cópias dos arquivos que já existiam no projeto
 *   (`images/PNG-LogoPega-Site.png`, `images/logos/QA-2-logo.png`, `images/AWS.png`);
 * - `rpa`, `ai-ml-ds` e `salesforce` NÃO existiam soltas: são recortes da folha
 *   oficial da seção antiga (`public/images/Tecnologia.png`), no tamanho nativo
 *   dela. Recorte, não redesenho — a arte é a mesma, pixel a pixel. Por isso
 *   estas três têm resolução baixa (~150px de largura) e recebem `larguraMax`
 *   menor: ampliá-las mais que isso só mostraria a interpolação.
 *
 * ── Por que `larguraMax` ────────────────────────────────────────────────────
 * As logos têm proporções muito diferentes (REST:API é 3:1, .NET é quadrada).
 * Um `max-width` único deixaria as largas gigantes e as quadradas minúsculas.
 * O valor é uma fração da caixa do card — nunca um recorte, nunca uma
 * deformação: o `object-fit: contain` continua mandando.
 */

export type Tecnologia = {
  id: string;
  name: string;
  image: string;
  alt: string;
  /** Fração da largura do card que a logo pode ocupar. */
  larguraMax?: string;
};

const pasta = '/images/logotecnologia';

/** Trilho de cima: mais distante, movimento lento da direita para a esquerda. */
export const TECNOLOGIAS_TRILHO_SUPERIOR: Tecnologia[] = [
  { id: 'mongodb', name: 'MongoDB', image: `${pasta}/mongodb.png`, alt: 'MongoDB' },
  { id: 'redis', name: 'Redis', image: `${pasta}/redis.png`, alt: 'Redis', larguraMax: '58%' },
  { id: 'python', name: 'Python', image: `${pasta}/python.png`, alt: 'Python' },
  { id: 'react', name: 'React', image: `${pasta}/react.png`, alt: 'React' },
];

/** Carrossel central: uma tecnologia ativa, as vizinhas em perspectiva. */
export const TECNOLOGIAS_PALCO: Tecnologia[] = [
  { id: 'zendesk', name: 'Zendesk', image: `${pasta}/zendesk.png`, alt: 'Zendesk', larguraMax: '62%' },
  { id: 'qa', name: 'QA', image: `${pasta}/qa.png`, alt: 'Quality Assurance' },
  { id: 'rpa', name: 'RPA', image: `${pasta}/rpa.png`, alt: 'Robotic Process Automation', larguraMax: '48%' },
  { id: 'pega', name: 'PEGA', image: `${pasta}/pega.png`, alt: 'PEGA', larguraMax: '56%' },
  {
    id: 'ai-ml-ds',
    name: 'AI/ML/DS',
    image: `${pasta}/ai-ml-ds.png`,
    alt: 'Inteligência Artificial, Machine Learning e Data Science',
    larguraMax: '64%',
  },
  { id: 'aws', name: 'AWS', image: `${pasta}/aws.png`, alt: 'Amazon Web Services', larguraMax: '60%' },
  { id: 'salesforce', name: 'Salesforce', image: `${pasta}/salesforce.png`, alt: 'Salesforce', larguraMax: '62%' },
];

/** Trilho de baixo: desenvolvimento, movimento no sentido oposto ao de cima. */
export const TECNOLOGIAS_TRILHO_INFERIOR: Tecnologia[] = [
  { id: 'angular', name: 'Angular', image: `${pasta}/angular.png`, alt: 'Angular' },
  { id: 'java', name: 'Java', image: `${pasta}/java.png`, alt: 'Java', larguraMax: '66%' },
  { id: 'rest-api', name: 'REST:API', image: `${pasta}/rest-api.png`, alt: 'REST API' },
  { id: 'spring-boot', name: 'Spring Boot', image: `${pasta}/spring-boot.png`, alt: 'Spring Boot' },
  { id: 'nodejs', name: 'Node.js', image: `${pasta}/nodejs.png`, alt: 'Node.js', larguraMax: '66%' },
  { id: 'dotnet', name: '.NET', image: `${pasta}/dotnet.png`, alt: '.NET', larguraMax: '52%' },
];

/** As dezessete, na ordem em que aparecem — usada no modo lista/movimento reduzido. */
export const TECNOLOGIAS: Tecnologia[] = [
  ...TECNOLOGIAS_PALCO,
  ...TECNOLOGIAS_TRILHO_SUPERIOR,
  ...TECNOLOGIAS_TRILHO_INFERIOR,
];

/** PEGA abre a vitrine. Índice, e não `find` no componente: um lugar só decide. */
export const TECNOLOGIA_INICIAL = TECNOLOGIAS_PALCO.findIndex((t) => t.id === 'pega');
