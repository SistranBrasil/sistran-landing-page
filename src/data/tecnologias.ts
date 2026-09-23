/**
 * Tecnologias da vitrine de /quem-somos.
 *
 * FONTE ÚNICA: nome, caminho da imagem, texto alternativo, categoria e grupo de
 * cada tecnologia moram aqui. Os componentes não importam imagem nenhuma e não
 * conhecem nome nenhum — eles percorrem estas listas. É o item 10 de
 * `docs/tecnologia.md` («manter os dados separados da apresentação: nome, logo,
 * categoria, texto alternativo, grupo, cor opcional»).
 *
 * ── SIS-280: AS TRÊS LISTAS SÃO AS DO DOC, e as antigas não eram ─────────────
 *
 * O doc e o mock (`public/imagensexemplo/tecnologia.png`) nomeiam exatamente:
 *
 *   faixa superior  React · MongoDB · Redis · Python · Angular · Java
 *   destaque        Pega · AWS · Salesforce   (só três, com categoria)
 *   faixa inferior  REST API · Spring Boot · Node.js · .NET · Inteligência Artificial
 *
 * O que existia aqui antes tinha OUTRO conteúdo, e por isso está registrado
 * abaixo em vez de apagado: o palco levava SETE itens (zendesk, qa, rpa, pega,
 * ai-ml-ds, aws, salesforce), a faixa de cima não tinha Angular nem Java (eles
 * viviam na de baixo), e o destaque inicial era PEGA. As linhas eram:
 *
 *   export const TECNOLOGIAS_TRILHO_SUPERIOR: Tecnologia[] = [
 *     { id: 'mongodb', name: 'MongoDB', image: `${pasta}/mongodb.png`, alt: 'MongoDB' },
 *     { id: 'redis', name: 'Redis', image: `${pasta}/redis.png`, alt: 'Redis', larguraMax: '58%' },
 *     { id: 'python', name: 'Python', image: `${pasta}/python.png`, alt: 'Python' },
 *     { id: 'react', name: 'React', image: `${pasta}/react.png`, alt: 'React' },
 *   ];
 *   export const TECNOLOGIAS_PALCO: Tecnologia[] = [
 *     { id: 'zendesk', ... larguraMax: '62%' },
 *     { id: 'qa', name: 'QA', image: `${pasta}/qa.png`, alt: 'Quality Assurance' },
 *     { id: 'rpa', ... larguraMax: '48%' },
 *     { id: 'pega', ... larguraMax: '56%' },
 *     { id: 'ai-ml-ds', ... larguraMax: '64%' },
 *     { id: 'aws', ... larguraMax: '60%' },
 *     { id: 'salesforce', ... larguraMax: '62%' },
 *   ];
 *   export const TECNOLOGIAS_TRILHO_INFERIOR: Tecnologia[] = [
 *     angular, java(66%), rest-api, spring-boot, nodejs(66%), dotnet(52%)
 *   ];
 *   export const TECNOLOGIA_INICIAL = TECNOLOGIAS_PALCO.findIndex((t) => t.id === 'pega');
 *
 * `zendesk`, `qa` e `rpa` SAEM da vitrine porque nenhuma das duas fontes da issue
 * as cita — e o critério de aceite é «a composição precisa permanecer muito
 * próxima da imagem de referência». Os arquivos continuam em
 * `public/images/logotecnologia/`; religar é acrescentar a entrada de volta.
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
 *   dela. Recorte, não redesenho — a arte é a mesma, pixel a pixel.
 *
 * ── SIS-280: RESOLUÇÃO MEDIDA, arquivo por arquivo ──────────────────────────
 *
 * O doc exige «nitidez em telas Retina», e isso é uma medida, não uma intenção:
 * uma logo exibida acima da largura intrínseca do arquivo mostra interpolação.
 * Medido com `readUInt32BE(16/20)` no cabeçalho de cada PNG:
 *
 *   angular 2172x724   java 1536x1024   mongodb 2172x724   nodejs 1536x1024
 *   python 2062x763    react 2048x768   redis 1347x1167    rest-api 2160x720
 *   spring-boot 1938x811   dotnet 1274x1234   aws 600x358
 *   ai-ml-ds 154x105   salesforce 149x103   pega 132x99
 *
 * As três últimas são os recortes de ~150px, e as três aparecem na composição
 * nova — duas delas no PAINEL CENTRAL, que o doc dimensiona em 390x245. Por isso:
 *
 * · `pega` passa a apontar para `pega-oficial.png`, que é a cópia de
 *   `public/logos-parceiros/pega-logo.png` — 2172x724, a MESMA arte oficial do
 *   Pega que a rota de parceiros já usava, em resolução de trabalho. O recorte de
 *   132x99 ficaria visivelmente interpolado aos ~250px do painel. O arquivo antigo
 *   (`pega.png`) permanece na pasta, sem consumidor;
 * · `salesforce` NÃO tem equivalente em alta no projeto (a folha
 *   `images/Tecnologia.png` inteira tem 1172x402, e a nuvem dentro dela é esse
 *   mesmo tamanho). Então o limite dela é ABSOLUTO — `larguraMax: '150px'` —, e o
 *   painel a exibe menor que a AWS de propósito: nítida e menor é melhor que
 *   grande e borrada, e o doc proíbe redesenhar ou gerar a logo;
 * · `ai-ml-ds` vive numa cápsula de faixa, onde a caixa é de 190x78 e a exibição
 *   fica em ~76px de largura — abaixo dos 154px do arquivo, ou seja nítida.
 *
 * ── Por que `larguraMax` ────────────────────────────────────────────────────
 * As logos têm proporções muito diferentes (REST:API é 3:1, .NET é quadrada).
 * Um `max-width` único deixaria as largas gigantes e as quadradas minúsculas.
 * O valor alimenta `--tech-logo-max`, que a folha usa como `max-width` — então
 * aceita FRAÇÃO da caixa (o caso comum) ou MEDIDA ABSOLUTA (o caso `salesforce`,
 * acima, onde o teto é a resolução do arquivo e não a proporção da caixa). Nunca
 * é recorte e nunca é deformação: o `object-fit: contain` continua mandando.
 */

export type Tecnologia = {
  id: string;
  name: string;
  image: string;
  alt: string;
  /**
   * Categoria — SÓ as três do destaque central a têm, e o doc lista as três por
   * extenso. Opcional porque as cápsulas das faixas não levam texto nenhum
   * («nenhum texto adicional», item 3).
   */
  categoria?: string;
  /** A qual plano da composição a tecnologia pertence. */
  grupo: 'faixa-superior' | 'destaque' | 'faixa-inferior';
  /** Teto da largura da logo: fração da caixa, ou medida absoluta. */
  larguraMax?: string;
  /**
   * Cor de apoio da marca, opcional (item 10 do doc). Hoje só o destaque a usa,
   * no halo por baixo do painel — nunca sobre a logo, que não recebe filtro.
   */
  cor?: string;
};

const pasta = '/images/logotecnologia';

/** Faixa de cima: seis tecnologias, movimento da direita para a esquerda. */
export const TECNOLOGIAS_FAIXA_SUPERIOR: Tecnologia[] = [
  { id: 'react', name: 'React', image: `${pasta}/react.png`, alt: 'React', grupo: 'faixa-superior', larguraMax: '74%' },
  { id: 'mongodb', name: 'MongoDB', image: `${pasta}/mongodb.png`, alt: 'MongoDB', grupo: 'faixa-superior', larguraMax: '78%' },
  { id: 'redis', name: 'Redis', image: `${pasta}/redis.png`, alt: 'Redis', grupo: 'faixa-superior', larguraMax: '46%' },
  { id: 'python', name: 'Python', image: `${pasta}/python.png`, alt: 'Python', grupo: 'faixa-superior', larguraMax: '76%' },
  { id: 'angular', name: 'Angular', image: `${pasta}/angular.png`, alt: 'Angular', grupo: 'faixa-superior', larguraMax: '78%' },
  { id: 'java', name: 'Java', image: `${pasta}/java.png`, alt: 'Java', grupo: 'faixa-superior', larguraMax: '52%' },
];

/**
 * Destaque central: exatamente TRÊS, na ordem de troca que o doc fixa
 * (Pega → AWS → Salesforce → recomeça em Pega). A ordem do array É a sequência.
 */
export const TECNOLOGIAS_DESTAQUE: Tecnologia[] = [
  {
    id: 'pega',
    name: 'Pega',
    /* A cópia em alta de `logos-parceiros/pega-logo.png` — ver "RESOLUÇÃO MEDIDA". */
    image: `${pasta}/pega-oficial.png`,
    alt: 'Pega',
    categoria: 'Automação & Processos',
    grupo: 'destaque',
    larguraMax: '72%',
    cor: '#1d2f6f',
  },
  {
    id: 'aws',
    name: 'AWS',
    image: `${pasta}/aws.png`,
    alt: 'Amazon Web Services',
    categoria: 'Cloud & Infraestrutura',
    grupo: 'destaque',
    larguraMax: '58%',
    cor: '#ff9900',
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    image: `${pasta}/salesforce.png`,
    alt: 'Salesforce',
    categoria: 'CRM & Relacionamento',
    grupo: 'destaque',
    /* ABSOLUTO, e é a resolução do arquivo que manda — ver "RESOLUÇÃO MEDIDA". */
    larguraMax: '150px',
    cor: '#00a1e0',
  },
];

/** Faixa de baixo: cinco tecnologias, movimento da esquerda para a direita. */
export const TECNOLOGIAS_FAIXA_INFERIOR: Tecnologia[] = [
  { id: 'rest-api', name: 'REST API', image: `${pasta}/rest-api.png`, alt: 'REST API', grupo: 'faixa-inferior', larguraMax: '76%' },
  { id: 'spring-boot', name: 'Spring Boot', image: `${pasta}/spring-boot.png`, alt: 'Spring Boot', grupo: 'faixa-inferior', larguraMax: '66%' },
  { id: 'nodejs', name: 'Node.js', image: `${pasta}/nodejs.png`, alt: 'Node.js', grupo: 'faixa-inferior', larguraMax: '52%' },
  { id: 'dotnet', name: '.NET', image: `${pasta}/dotnet.png`, alt: '.NET', grupo: 'faixa-inferior', larguraMax: '44%' },
  {
    id: 'ai-ml-ds',
    name: 'Inteligência Artificial',
    image: `${pasta}/ai-ml-ds.png`,
    alt: 'Inteligência Artificial',
    grupo: 'faixa-inferior',
    larguraMax: '40%',
  },
];

/** As quatorze, na ordem em que aparecem na composição. */
export const TECNOLOGIAS: Tecnologia[] = [
  ...TECNOLOGIAS_FAIXA_SUPERIOR,
  ...TECNOLOGIAS_DESTAQUE,
  ...TECNOLOGIAS_FAIXA_INFERIOR,
];

/**
 * AWS abre o destaque — é o que o doc pede por escrito («AWS ativa no centro,
 * Pega como prévia à esquerda, Salesforce como prévia à direita») e é o que o
 * mock mostra. Índice, e não `find` no componente: um lugar só decide.
 *
 * Era `pega` na versão anterior deste arquivo, com outra lista de palco.
 */
export const TECNOLOGIA_INICIAL = TECNOLOGIAS_DESTAQUE.findIndex((t) => t.id === 'aws');
