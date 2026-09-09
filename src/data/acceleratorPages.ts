/* Conteudo das 7 paginas de produto/acelerador que o site publica com texto
   real: /service/match-ai/, /lumina-ai/, /service/fast/, /qa-integrado,
   /service/connect-api/, /service/smart-miner/, /service/guru-de-seguros/.
   Nada aqui foi escrito por nós — cada paragrafo e cada item de lista é a
   escrita do site. As correcoes feitas estao anotadas item a item.

   O que NAO foi recriado, e por que:
   - /service/lumina-ai/ e /service/qa-integrado/ servem, no site, o conteudo do
     Fast (duplicatas erradas). Uma unica rota por produto substitui as duas.
   - As 4 paginas de "Serviços" (/service/apis-projetos.../, servicos-e-processos,
     tipos-de-servico, staff-augmentation) estao publicadas com Lorem Ipsum em
     ingles — nao ha escrita a reproduzir.
   - Blocos que no site sao apenas logos sem alt (ferramentas de integracao do
     Lumina AI) entram como titulo de categoria, sem os itens: nao existe texto.

   Fonte: .claude/conteudo-site/servicos/*.md */

/* SIS-120 — `navLabel` é a ABREVIAÇÃO do título para a coluna do navegador
   lateral, e existe só nos blocos cujo título não cabe lá. A regra é a que
   `src/data/pageSections.ts` já declara ("Rótulo é ABREVIAÇÃO, não título"): o
   rótulo fica com `whitespace-nowrap` sobre o conteúdo da página, então
   "Desafios no desenvolvimento de software" em caixa alta atravessaria a coluna
   e entraria no texto a 1366. Não é escrita nova — cada `navLabel` é um recorte
   do título que está ao lado dele. Ausente, o rótulo é o próprio título. */
export type AccelBlock =
  | { kind: 'paragraphs'; heading?: string; navLabel?: string; paragraphs: readonly string[] }
  | {
      kind: 'list';
      heading?: string;
      navLabel?: string;
      intro?: string;
      ordered?: boolean;
      items: readonly { term?: string; text: string }[];
    };

export type AcceleratorPage = {
  /* Mesmo id de ACCELERATORS: é o slug da rota /solucoes/[slug]. */
  id: string;
  name: string;
  /* Frase de abertura do site. Vira o subtitulo do hero. */
  lead: string;
  blocks: readonly AccelBlock[];
};

export const ACCELERATOR_PAGES: readonly AcceleratorPage[] = [
  {
    id: 'match-ai',
    name: 'Match AI',
    lead: 'Permite à seguradora capacitar o corretor para oferecer propostas personalizadas com discurso adaptado.',
    blocks: [
      {
        kind: 'paragraphs',
        paragraphs: [
          'Uso da IA para gerar acurácia em ofertas inteligentes maximizando a PERSONALIZAÇÃO da proposta (suitability) e empoderando o corretor/agente na venda individualizada.',
        ],
      },
      {
        kind: 'list',
        heading: 'O que o Match AI faz?',
        navLabel: 'O que faz',
        ordered: true,
        items: [
          { text: 'Gera ofertas hiperpersonalizadas' },
          {
            text: 'Define personas e o melhor match com produtos e coberturas disponíveis com base no canal de venda',
          },
          {
            text: 'Aumenta as vendas na carteira corrente com a geração de novas ofertas para segurados da base',
          },
          /* Site escreve "Valida Ofertas já vigentes e testes de novas coberturas
             a serem lançadas" — maiuscula no meio corrigida. */
          { text: 'Valida ofertas já vigentes e testes de novas coberturas a serem lançadas' },
        ],
      },
      {
        kind: 'paragraphs',
        heading: 'Posicionamento',
        paragraphs: [
          /* Os dois primeiros paragrafos nao tem ponto final no site; DS/AI
             ganhou a expansao das siglas, que o site nao dá. */
          'O Match AI não necessariamente substitui sistemas ou iniciativas da Seguradora, sua inteligência/APIs complementa ações de DS/AI (Data Science / Artificial Intelligence).',
          'A Sistran possui o reconhecimento da ISG Provider Lens comprovando a capacidade de levar empresas para a desafiadora transformação digital.',
          'Match AI é uma solução desenvolvida pelo Sistran Labs, o laboratório de inovações da Sistran, onde as ideias se transformam em soluções assertivas que impulsionam o crescimento das Seguradoras.',
        ],
      },
    ],
  },

  {
    id: 'lumina-ai',
    name: 'Lumina AI',
    /* Nome unificado como "Lumina AI": o site alterna Lumina AI / LuminaAI /
       LuminaA I na mesma pagina. */
    lead: 'Uma solução integrada de IA generativa que orquestra todo o Ciclo de Vida de Desenvolvimento de Software (SDLC), agilizando processos e integrando ferramentas líderes de mercado.',
    blocks: [
      {
        kind: 'list',
        heading: 'Desafios no desenvolvimento de software',
        navLabel: 'Desafios',
        items: [
          {
            term: 'Demanda Crescente',
            text: 'Como atender à necessidade de código de alta qualidade de forma ágil e produtiva?',
          },
          /* Site escreve "Débitos Técnica" no titulo do card. */
          {
            term: 'Débitos Técnicos',
            text: 'Como evitar a acumulação de débitos técnicos e resolver os existentes?',
          },
          {
            term: 'Segurança e Conformidade',
            text: 'Como garantir baixa vulnerabilidade e respostas rápidas?',
          },
          { term: 'Documentação Eficiente', text: 'Como manter registros claros e acessíveis?' },
        ],
      },
      {
        kind: 'list',
        heading: 'Benefícios',
        items: [
          {
            term: 'Melhoria na Qualidade e Confiabilidade',
            text: 'Produtos mais robustos e confiáveis',
          },
          { term: 'Aumento da Produtividade', text: 'Equipes mais eficientes e projetos mais rápidos' },
          { term: 'Redução de Retrabalho e Custos', text: 'Menos correções e otimização de recursos' },
          { term: 'Satisfação do Cliente', text: 'Experiência aprimorada para o usuário final' },
          { term: 'Precisão em Previsões e Estimativas', text: 'Planejamento mais assertivo' },
          { term: 'Redução do Time to Market', text: 'Lançamentos mais rápidos e competitivos' },
          { term: 'Aumento da Robustez de Sistemas', text: 'Soluções mais estáveis e seguras' },
        ],
      },
      {
        kind: 'list',
        heading: 'Integração Versátil',
        intro: 'O Lumina AI foi desenvolvido para ser facilmente integrável, oferecendo compatibilidade com uma ampla variedade de soluções de software de terceiros.',
        /* No site cada categoria lista logos sem alt; sem texto, ficam so os
           titulos das categorias. */
        items: [
          { text: 'Repositórios de código' },
          { text: 'Ferramentas de Análise de Código' },
          { text: 'Serviços de IA' },
          { text: 'Ferramentas de Gestão de Projetos' },
        ],
      },
      {
        kind: 'paragraphs',
        paragraphs: [
          'O Lumina AI representa uma revolução no desenvolvimento de software, proporcionando eficiência, qualidade e rapidez.',
          'Com sua integração versátil e ferramentas avançadas, é a solução ideal para empresas que buscam se destacar no mercado competitivo atual.',
        ],
      },
    ],
  },

  {
    id: 'fast',
    name: 'Fast',
    lead: 'Automatiza sinistros, reduz erros, melhora a eficiência e garante conformidade.',
    blocks: [
      {
        kind: 'paragraphs',
        heading: 'O que é o Fast?',
        paragraphs: [
          'O Fast é uma solução inovadora da Sistran Labs que automatiza e acelera processos de sinistros, reduzindo erros humanos, melhorando a eficiência e garantindo conformidade com as regulamentações. Ele é parte de um projeto maior, com potencial de aplicação em diversas verticais de negócio.',
        ],
      },
      {
        kind: 'list',
        heading: 'O que o Fast oferece?',
        navLabel: 'O que oferece',
        ordered: true,
        items: [
          { term: 'Automatização e Aceleração', text: 'Processos até 95% mais rápidos.' },
          /* Site titula "Zero erros de validação" e descreve "redução
             significativa" — mantida a descricao, que é a afirmacao sustentavel. */
          { term: 'Redução de erros de validação', text: 'Redução significativa de erros humanos.' },
          { term: 'Trilha de Auditoria Completa', text: 'Total rastreabilidade das ações realizadas.' },
          { term: 'Redução de custos', text: 'Menos dependência de pessoal, com maior eficiência.' },
        ],
      },
      {
        kind: 'list',
        heading: 'Integração sem Fronteiras',
        navLabel: 'Integração',
        items: [
          { text: 'O Fast se integra com os sistemas existentes da seguradora.' },
          { text: 'Fácil implementação, pronta para funcionar com ERPs, sistemas de OCR, e outros.' },
        ],
      },
      {
        kind: 'list',
        heading: 'Benefícios',
        items: [
          { term: 'Redução de tempo', text: 'Processamento em milissegundos.' },
          { term: 'Diminuição de falhas', text: 'De 20% no processo manual para 0% com o Fast.' },
          { term: 'Economia de horas', text: '450 horas economizadas para cada 1.000 processos.' },
        ],
      },
      {
        kind: 'list',
        heading: 'Monitore e Aprimore seus Processos',
        navLabel: 'Monitoramento',
        items: [
          {
            text: 'Dashboard intuitivo para visualização de sinistros aprovados, rejeitados, e em análise.',
          },
          {
            text: 'Relatórios detalhados sobre motivos de rejeição, tempo de resposta, e performance.',
          },
        ],
      },
    ],
  },

  {
    id: 'qa-integrado',
    name: 'QA Integrado',
    lead: 'QA Integrado – Qualidade desde o Primeiro Código',
    blocks: [
      {
        kind: 'paragraphs',
        paragraphs: [
          'Na Sistran, acreditamos que qualidade não é uma etapa final, mas um compromisso contínuo ao longo de todo o ciclo de desenvolvimento. Nosso QA Integrado garante que testes e validações sejam incorporados desde o início do projeto, reduzindo falhas, acelerando entregas e garantindo um software mais robusto e seguro.',
          'Com uma abordagem colaborativa, nossos especialistas em QA trabalham lado a lado com desenvolvedores, analistas de negócios e outros stakeholders, promovendo um desenvolvimento mais eficiente e prevenindo problemas antes que se tornem grandes desafios.',
        ],
      },
      {
        kind: 'list',
        heading: 'Nossos serviços de QA Integrado incluem',
        navLabel: 'Serviços',
        ordered: true,
        items: [
          /* "design(cases)" espacado; crase de "à gestão" no item 3. */
          { text: 'Planejamento e design (cases) de testes desde a concepção do projeto' },
          { text: 'Testes de funcionalidade, desempenho e segurança' },
          {
            text: 'Melhoria contínua dos processos de QA integrado à gestão de ambiente técnico',
          },
          { text: 'Automação de testes para garantir eficiência e velocidade' },
          { text: 'Feedback contínuo e colaboração direta com desenvolvedores' },
        ],
      },
      {
        kind: 'paragraphs',
        /* No site esta frase aparece ACIMA da lista que ela fecha; movida para
           depois. */
        paragraphs: [
          'Com o QA Integrado da Sistran, qualidade e agilidade caminham juntas, garantindo entregas mais rápidas e seguras.',
        ],
      },
    ],
  },

  {
    id: 'connect-api',
    name: 'Connect API',
    lead: 'Connect API: Plataforma para distribuição de Seguros',
    blocks: [
      {
        kind: 'paragraphs',
        paragraphs: [
          'Connect API é um ecossistema totalmente orientado a serviços que integra as mais variadas funcionalidades dos processos de seguros trazendo a inovação da Jornada de Distribuição de Seguros de Vida (Individual, Empresarial e Vida em Grupo) com ferramentas de Venda Consultiva e autosserviços aos estipulantes.',
          /* Site: "Os clientes-usuário se mantém no centro de suas jornadas,
             pronto para…" — concordancia acertada no plural. */
          'Os clientes-usuário se mantêm no centro de suas jornadas, prontos para ter sua solicitação atendida em qualquer lugar e em qualquer dispositivo, com ampla gama de alternativas e benefícios.',
          'Pode ser usado em sua totalidade ou apenas APIs específicas com rápida publicação e integrações simples e flexíveis.',
        ],
      },
      {
        kind: 'list',
        heading: 'Principais diferenciais',
        navLabel: 'Diferenciais',
        ordered: true,
        items: [
          {
            term: 'Arquitetura de publicação em API',
            text: 'acelera integração com sistemas internos e construção de novas features',
          },
          {
            term: 'Amplamente configurável e flexível',
            text: 'a área de negócios tem autonomia para gerar novos negócios',
          },
          {
            term: 'Complementa as funcionalidades',
            text: 'já disponibilizadas pelas Seguradoras',
          },
        ],
      },
    ],
  },

  {
    id: 'smart-miner',
    name: 'Smart Miner',
    lead: 'É uma ferramenta baseada em APIs desenvolvida com recursos da AWS (Amazon Web Services) apoiada no uso de IA (Inteligência Artificial) e ML (Machine Learning).',
    blocks: [
      {
        kind: 'paragraphs',
        heading: 'O que é o Smart Miner?',
        navLabel: 'O que é',
        paragraphs: [
          /* "scaners" -> scanners; virgula sobrando depois de "corrige". */
          'O Smart Miner coleta imagens obtidas por celulares e/ou scanners em diversos formatos de arquivos (JPG, JPEG, PNG e PDF), faz ajustes em cada imagem (corrige inclinação, posição, separação de imagens), tipifica o documento — cartorários (nascimento, casamento, óbito), RG, CNH, comprovantes de endereço, notas fiscais, declaração de herdeiros, entre outros — e após estas validações realiza a extração das informações necessárias, por exemplo, para a abertura de um Sinistro.',
        ],
      },
      {
        kind: 'paragraphs',
        heading: 'Onde usar o Smart Miner?',
        navLabel: 'Onde usar',
        paragraphs: [
          'Ele pode ser inserido em todo e qualquer processo que receba documentos (padronizados ou não). Agrega valor e agiliza processos nas esteiras de abertura/comunicado de Sinistros, bem como na validação dos processos de subscrição para Emissão de apólices e certificados.',
          /* Site diz "Fast Claims"; o produto é publicado como "Fast".
             "Console de Pré Análise" é citado pelo site como solucao Sistran mas
             nao existe em nenhuma outra pagina — mantido porque é escrita do
             site, sem link porque nao ha destino. */
          'Especialmente no processo de comunicado de sinistros, pode estar integrado ao Console de Pré Análise (solução da Sistran) para conclusão de toda rotina de validação dos documentos, antes da regulação efetiva do sinistro; e também ao Fast, robô que executa regulação de sinistros e sugere ações a partir de regras pré-definidas pelo próprio usuário, em linguagem natural: pagamento, recusa, análise humana ou perícia e ainda indicação de indícios de fraude.',
        ],
      },
      {
        kind: 'paragraphs',
        heading: 'Como usar o Smart Miner?',
        navLabel: 'Como usar',
        paragraphs: [
          'A API é um componente que deverá estar interligado aos canais de entrada de documentos (portais, apps, agências) e, a cada novo upload, a API será chamada para executar a tipificação e leitura de informações.',
          'Trabalhando em conjunto com o Console de Pré Análise, podem ser criados e administrados vários kits de documentos (por ramo, por natureza, por cobertura) e avisos de documentos faltantes, datas de recebimentos, solicitação de novos documentos, etc.',
        ],
      },
    ],
  },

  {
    id: 'guru-de-seguros',
    name: 'Guru de Seguros',
    lead: 'É uma assistente conversacional acessada através da Alexa, uma solução voltada ao Mercado Segurador baseada na tecnologia Alexa (Amazon/AWS), habilitando relacionamento por voz que permite oferecer aos Corretores e Seguradoras vastas aplicações em soluções de negócio, interagindo através da linguagem natural e recebendo informações úteis ao seguro, de forma mais dinâmica a qualquer hora, em qualquer lugar.',
    blocks: [
      {
        kind: 'paragraphs',
        heading: 'Como funciona?',
        paragraphs: [
          'Inicialmente implantamos uma base, em parceria com a ENS (Escola de Negócios e Seguros) e a CNseg (Confederação Nacional das Seguradoras), que disponibiliza conteúdo educativo através de perguntas e respostas, para alunos e associados, assim como à sociedade de forma geral, expandindo a educação e cultura do seguro. Além de conjuntos de perguntas e respostas, também oferecemos notícias sobre Seguros e quiz de Seguros.',
          'Estamos trabalhando em aplicações transacionais, integrando legados e permitindo soluções como Cotação de Seguros, Contratação de Seguro, apoio a Avisos de Sinistro.',
          /* As frases do site terminam em reticencias e nao fecham; aqui elas
             foram concluidas com o proprio conteudo da frase, sem acrescentar
             informacao nova. */
          'Logo, você poderá perguntar: “Alexa, qual o status do meu sinistro?” E ela responderá, informando eventuais documentos e ações pendentes e a previsão de conclusão.',
          'Ou ainda: “Alexa, qual a diferença básica do Seguro de Vida resgatável?” E ela informará as diferenças, para que o corretor possa explicar ao cliente. Também será possível perguntar questões relevantes sobre a apólice do seu cliente e questionamentos sobre cálculos, emissões e comissionamento, através de acessos aos sistemas legados das seguradoras.',
          'Alexa trará aos corretores e seguradoras a imagem de modernidade, agregando agilidade e flexibilidade às comunicações e relacionamento.',
        ],
      },
      {
        kind: 'paragraphs',
        heading: 'De onde pode ser acessada?',
        navLabel: 'Acesso',
        paragraphs: [
          /* "IOS" -> iOS. O site apresenta os dados de dispositivos no presente
             sem nenhuma data; o paragrafo seguinte registra isso. */
          'Em qualquer lugar: além dos Echo Dots da Amazon, ou outros dispositivos, que em conjunto já atendem mais de 1 milhão de contas no Brasil, a Amazon disponibiliza Alexa de forma independente do sistema operacional (Windows, Android, iOS). Por exemplo, televisões LG e Samsung já vêm com Alexa instalada, assim como laptops e também veículos no Brasil (BMW, Mini e o mais recente lançamento, Jeep Commander); também é possível acionar a Alexa em qualquer celular.',
        ],
      },
    ],
  },
];

export function getAcceleratorPage(id: string) {
  return ACCELERATOR_PAGES.find((p) => p.id === id);
}

/* SIS-120 — âncora de um bloco, derivada do título.
   É UMA função, usada nos dois lugares que precisam do mesmo id: a `<section>`
   em `src/app/solucoes/[slug]/page.tsx` e a lista do navegador lateral em
   `src/data/pageSections.ts`. Escrever a regra duas vezes é o defeito clássico
   de âncora que não acende — o observador procuraria um id que a página nunca
   escreveu.
   Bloco SEM título não tem id: não há o que ancorar nem o que rotular, e
   `<section>` sem nome acessível não entra como região para leitor de tela, que
   é o comportamento certo para um bloco de continuação. */
/* Único lugar que transforma título em `id`: a página escreve o `id` com ela e
   `pageSections.ts` monta o link do navegador lateral com ela, então não existe a
   possibilidade de a bolinha apontar para uma âncora que a página não tem.
   Dois títulos iguais dão o mesmo id — "Benefícios" existe em `lumina-ai` e em
   `fast` —, e isso não colide porque são PÁGINAS diferentes; dentro de uma mesma
   página os 17 títulos atuais são distintos. Título repetido na mesma página é o
   que quebraria (dois `id` iguais no documento), e é o que precisa ser conferido
   ao acrescentar bloco. */
export function idDoBloco(heading: string): string {
  return heading
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/* Chave de lista estável, em lugar do `key={i}`: título quando existe, senão o
   começo do primeiro texto do bloco — que é conteúdo travado do site e não muda
   de posição sozinho. Com índice, reordenar blocos reaproveitaria o nó errado
   silenciosamente. */
export function chaveDoBloco(block: AccelBlock): string {
  if (block.heading) return block.heading;
  return block.kind === 'paragraphs'
    ? block.paragraphs[0].slice(0, 40)
    : (block.intro ?? block.items[0]?.text ?? '').slice(0, 40);
}
