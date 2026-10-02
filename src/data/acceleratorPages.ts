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
  | {
      kind: 'paragraphs';
      heading?: string;
      navLabel?: string;
      inPageNav?: boolean;
      paragraphs: readonly string[];
    }
  | {
      kind: 'list';
      heading?: string;
      navLabel?: string;
      inPageNav?: boolean;
      intro?: string;
      ordered?: boolean;
      items: readonly { term?: string; text: string; highlights?: readonly string[] }[];
    };

export type AcceleratorPage = {
  /* Mesmo id de ACCELERATORS: é o slug da rota /solucoes/[slug]. */
  id: string;
  name: string;
  /* Frase de abertura do site. Vira o subtitulo do hero. */
  lead: string;
  metadataDescription?: string;
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
      /* SIS-292 — OS QUATRO ITENS VIRARAM `term` + `text`, e o corte NÃO é
         invenção: `public/imagensexemplo/exemplodoquezer.png` desenha cada card
         com título curto em cima e uma linha de apoio embaixo, e o corte dela cai
         exatamente onde a frase do site se dobra. O caso mais claro é o item 2 —
         o site escreve "Define personas e o melhor match com produtos e coberturas
         disponíveis com base no canal de venda"; a mock põe "Define personas e o
         melhor match com produtos" no título e "Com base no canal de venda e
         coberturas disponíveis." no apoio. Mesma informação, mesma ordem de
         ideias, sem uma palavra nova.
         Os itens 1 e 4 é que ganham escrita da mock no apoio, porque o site não
         tem segunda linha para eles ("Com base no perfil, necessidades e contexto
         de cada segurado." e "Simulando cenários e identificando oportunidades no
         portfólio."). É o que a issue autoriza: copy da mock ONDE ela completa o
         que já está nos dados.
         Os quatro `text` de antes, na íntegra, porque é a escrita literal do site
         e ninguém deve ter de reabrir a mock para reconstituí-la:

             { text: 'Gera ofertas hiperpersonalizadas' },
             { text: 'Define personas e o melhor match com produtos e coberturas disponíveis com base no canal de venda' },
             { text: 'Aumenta as vendas na carteira corrente com a geração de novas ofertas para segurados da base' },
             { text: 'Valida ofertas já vigentes e testes de novas coberturas a serem lançadas' },
      */
      {
        kind: 'list',
        heading: 'O que o Match AI faz?',
        navLabel: 'O que faz',
        ordered: true,
        items: [
          {
            term: 'Gera ofertas hiperpersonalizadas',
            text: 'Com base no perfil, necessidades e contexto de cada segurado.',
          },
          {
            term: 'Define personas e o melhor match com produtos',
            text: 'Com base no canal de venda e coberturas disponíveis.',
          },
          {
            term: 'Aumenta as vendas na carteira corrente',
            text: 'Com a geração de novas ofertas para segurados da base.',
          },
          /* Site escreve "Valida Ofertas já vigentes e testes de novas coberturas
             a serem lançadas" — maiuscula no meio corrigida. */
          {
            term: 'Valida ofertas já vigentes e testa novas coberturas',
            text: 'Simulando cenários e identificando oportunidades no portfólio.',
          },
        ],
      },
      /* SIS-292 — SEÇÃO NOVA, e ela é da mock de ponta a ponta: título, subtítulo
         e os três passos ("Dados do segurado", "Persona e contexto", "Oferta
         personalizada"). Entra COMO BLOCO e não como constante dentro do
         componente por uma razão mecânica, não de gosto: `src/data/pageSections.ts`
         deriva as paradas do indicador lateral dos blocos COM título, então uma
         seção que existisse só no JSX viraria uma faixa da página que a navegação
         lateral não conhece — o defeito que aquele arquivo já registra.
         `navLabel` existe porque o título inteiro não cabe na coluna do indicador
         (a régua está no cabeçalho de `pageSections.ts`). */
      {
        kind: 'list',
        heading: 'Da base à oferta mais relevante',
        navLabel: 'Da base à oferta',
        intro: 'Inteligência que transforma dados em oportunidades reais de negócio.',
        items: [
          { term: 'Dados do segurado', text: 'Informações, histórico e comportamento.' },
          { term: 'Persona e contexto', text: 'Análise de perfil e necessidades.' },
          { term: 'Oferta personalizada', text: 'Proposta ideal no momento certo.' },
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
      /* SIS-292 — AS TRÊS COLUNAS DO "Posicionamento", SEM TÍTULO PRÓPRIO.
         Bloco separado porque o tipo `AccelBlock` é uma união — um bloco é
         parágrafos OU lista, e a mock tem as duas coisas debaixo do mesmo título.
         Sem `heading` ele não vira parada do indicador lateral nem ganha `id`, que
         é o comportamento certo: visualmente isto está DENTRO de "Posicionamento",
         e uma segunda parada com o mesmo nome seria uma âncora duplicada.
         Cada coluna é a condensação de um dos três parágrafos acima, como a mock
         faz — não há claim novo: ecossistema/APIs, ISG Provider Lens e Sistran
         Labs, na mesma ordem. */
      {
        kind: 'list',
        items: [
          {
            term: 'Complementa o ecossistema',
            text: 'Integra inteligência e APIs às iniciativas existentes.',
          },
          {
            term: 'Reconhecimento ISG',
            text: 'A Sistran possui reconhecimento da ISG Provider Lens em transformação digital.',
          },
          {
            term: 'Inovação Sistran Labs',
            text: 'Ideias transformadas em soluções assertivas para o crescimento das seguradoras.',
          },
        ],
      },
    ],
  },

  {
    /* SIS-280 — dois n no `id` também aqui, pelo mesmo motivo do gêmeo em
       `accelerators.ts`: é o `id` que o `[slug]/page.tsx` casa com o parâmetro da
       rota, e os dois arquivos têm de concordar ou a rota deixa de resolver.
       Linha anterior: id: 'lumina-ai', */
    id: 'luminna-ai',
    name: 'Luminna AI',
    /* Nome unificado como "Luminna AI" (dois n): o site alterna Lumina AI /
       LuminaAI / LuminaA I na mesma pagina, e a grafia correta da marca — a que
       home, legado e "Metodo Luminna" ja usam — e Luminna.
       Linha anterior: name: 'Lumina AI', */
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
          /* SIS-220 (5ª volta) — «Débitos Técnica», COM A CONCORDÂNCIA QUEBRADA, porque
             é o que o paste escreve e o pedido é publicar o paste verbatim.
             A nota anterior («Site escreve "Débitos Técnica" no titulo do card») já
             dizia isso desde a SIS-280 e o dado a contrariava: alguém tinha corrigido
             a gramática e deixado a nota apontando para o texto certo. Quem é dono da
             escrita é a área, não a gramática — se um dia a fonte corrigir, o conserto
             é uma linha aqui.
             Linha anterior: term: 'Débitos Técnicos', */
          {
            term: 'Débitos Técnica',
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
      /* ⚠️ LEIA ISTO ANTES DAS DUAS NOTAS ABAIXO: elas contam por que a faixa
         Ecossistema foi construída (2ª volta) e depois reduzida a cabeçalho (3ª volta),
         e são HISTÓRICO DE DECISÃO — não descrição do que a página publica hoje. É
         nelas que está registrado onde foram parar os oito produtos e por que a métrica
         de +55% está sob o CASE e não sob o TEST, que é o que ainda vale.

         O QUE CADUCOU: a linha que estava aqui dizia «a faixa saiu da rota» e «nada
         abaixo deste ponto está montado em /luminna-ai». As duas valeram entre a 5ª
         volta da SIS-220 e 02/10, e hoje são falsas — o bloco `paragraphs` logo abaixo
         está ATIVO e a faixa voltou. O que segue comentado é só o bloco `list` da 2ª
         volta, no pé, que é a escrita anterior ao documento. A razão da volta está na
         nota em cima daquele bloco. */
      /* SIS-220 (2ª volta, item 4) — O ECOSSISTEMA DE PRODUTOS, QUE NÃO EXISTIA.
         O bloco é NOVO no dado: até aqui a slug tinha três `heading` (Desafios,
         Benefícios, Integração Versátil) e nenhuma lista dos oito produtos, embora
         eles sejam o que a solução vende. A escrita é a da issue, verbatim — nome,
         descrição e métricas —, e nada além dela foi acrescentado.

         `heading: 'Luminna AI'` e `navLabel: 'Ecossistema'`: o pedido é sobrancelha
         «Ecossistema» + título «Luminna AI». O `navLabel` já é, por contrato deste
         arquivo, o recorte curto do título para a coluna lateral — e aqui ele serve
         duas vezes sem repetir escrita, porque o corpo da slug desenha a
         sobrancelha A PARTIR dele. Rótulo «Luminna AI» na coluna também seria pior:
         repetiria o nome da página como se fosse uma parada.
         Grafia com DOIS n, sempre: o paste da issue escreve «Lumina» e essa é a
         grafia errada que a SIS-280 já corrigiu em `id` e `name` acima.

         POSIÇÃO: antes de «Integração Versátil», como a issue prefere — primeiro
         quais são os produtos, depois com o que eles conversam. A ordem daqui é a
         ordem das paradas do indicador lateral, então mexer nela mexe nas duas
         coisas de uma vez.

         `highlights` PARA AS MÉTRICAS, e não um `text` com os números colados: o
         precedente é o SDS («Três pilares», ~L505), onde `highlights` é justamente
         a lista de itens curtos sob o parágrafo do cartão. Quem tem duas métricas
         (ESTIMATE, CODE) fica com dois itens em vez de uma frase com «·».

         ⚠️ DIVERGÊNCIA DECLARADA, e ela é do paste, não nossa: a métrica «+55% mais
         rapidez na criação de TESTES UNITÁRIOS» aparece sob o LUMINNA CASE AI, que
         é o de testes FUNCIONAIS; quem gera teste unitário é o LUMINNA TEST AI. A
         issue registra o desencontro («métrica no paste fica sob CASE — ver nota») e
         manda não inventar métrica. Então o número fica onde o paste o pôs e o TEST
         fica SEM métrica — mover seria reescrever dado de negócio por dedução. Se a
         fonte confirmar a troca, o conserto é passar este `highlights` de um item
         para o outro, e nada mais.
         O LUMINNA PROMPT AI também não tem métrica no paste, e por isso não tem
         `highlights` — a ausência é do dado, não esquecimento.
         «Backend Button», que aparece no paste, é artefato de export do Figma e não
         entra: não é produto nem CTA. */
      /* ── SIS-220 (3ª VOLTA) · O BLOCO PERDE OS ITENS E FICA COM O CABEÇALHO ────
         O que aconteceu, em uma frase: os oito produtos saíram daqui para
         `src/data/luminnaEcossistema.ts`, tipados, e este bloco ficou sendo só o
         CABEÇALHO da faixa — título, sobrancelha e a linha de apoio.
         POR QUE ELE NÃO FOI APAGADO: é a existência de um bloco COM `heading` que
         faz a faixa ser parada do indicador lateral (`pageSections.ts` deriva as
         paradas dos blocos com título) e é `idDoBloco(heading)` que dá a âncora.
         Sem ele, a seção continuaria na tela e desapareceria da navegação — o
         defeito que aquele arquivo já registra em palavras.
         POR QUE OS ITENS SAÍRAM: o desenho de `docs/luminnaecosistema.md` precisa de
         CATEGORIA por produto, MÉTRICA partida em número e rótulo, COLUNA da
         composição bento e `id` estável para o painel aberto. Nada disso cabe em
         `{ term, text, highlights }`, e alargar `AccelBlock` empurraria os quatro
         campos para as outras seis páginas de acelerador, que não têm nenhum deles.
         A justificativa inteira está no docblock do arquivo novo.
         MUDOU DE `kind`, de `list` para `paragraphs`: sem itens, uma lista vazia
         seria uma lista mentindo sobre ser lista.

         O TÍTULO MUDOU, e é pedido literal da issue: era «Luminna AI» e agora é
         «Tecnologia aplicada em todo o ciclo», com a sobrancelha «ECOSSISTEMA» —
         em palavras da issue, «Não utilizar `Luminna AI` como título da seção». Os
         NOMES DOS PRODUTOS continuam com «Luminna», que é o nome das soluções.
         ⚠️ ISSO MOVE A ÂNCORA: `idDoBloco('Luminna AI')` dava `luminna-ai` e
         `idDoBloco('Tecnologia aplicada em todo o ciclo')` dá
         `tecnologia-aplicada-em-todo-o-ciclo`. A chave correspondente em
         `pageSections.ts` foi trocada no mesmo passo — as duas juntas ou o rótulo do
         indicador vai com a tinta errada sobre faixa clara.
         ⚠️ E MOVE O `copy-lock`: o título, a descrição e os oito textos de cartão
         mudam de nó (e as descrições mudam de escrita, porque a fonte agora é o
         documento). O portão do lock NÃO foi rodado nesta passada.

         A DESCRIÇÃO é a do documento, verbatim. Ela não existia — a 2ª volta não
         tinha `intro` porque o paste não trazia nenhuma.

         A LISTA DE OITO ITENS QUE ESTAVA AQUI, na íntegra, porque era a escrita do
         paste da 2ª volta e é o histórico contra o qual se compara o documento
         (as divergências item a item estão anotadas no arquivo novo):

         | items: [
         |   { term: 'LUMINNA STORY AI',
         |     text: 'Criação ágil de histórias e priorização de tarefas',
         |     highlights: ['+60% de aumento na velocidade de criação de histórias'] },
         |   { term: 'LUMINNA ESTIMATE AI',
         |     text: 'Estimativas precisas de esforço, complexidade e tamanho funcional',
         |     highlights: ['+60% mais detalhes na criação de tarefas',
         |                  '+95% mais rapidez na estimativa de esforços'] },
         |   { term: 'LUMINNA CODE AI',
         |     text: 'Automação de Revisão de Código e Migração de Tecnologias (Spring Boot, Angular, Java 21+, BSAD5)',
         |     highlights: ['+84% de aumento na velocidade de revisão de código',
         |                  '−57% menos tempo para correção de bugs'] },
         |   { term: 'LUMINNA FIX AI',
         |     text: 'Correção automática de bugs e vulnerabilidades',
         |     highlights: ['+84% mais rapidez na identificação de vulnerabilidade'] },
         |   { term: 'LUMINNA DOC AI',
         |     text: 'Geração automática de documentação clara e concisa',
         |     highlights: ['+85% de ganho de tempo e qualidade na geração de documentação'] },
         |   { term: 'LUMINNA TEST AI',
         |     text: 'Geração de testes unitários abrangentes' },
         |   { term: 'LUMINNA CASE AI',
         |     text: 'Criação de testes funcionais detalhados',
         |     highlights: ['+55% mais rapidez na criação de testes unitários'] },
         |   { term: 'LUMINNA PROMPT AI',
         |     text: 'Direcionamento das respostas da IA de forma mais precisa, garantindo maior aderência às necessidades do negócio.' },
         | ],                                                                      */
      /* ── O ECOSSISTEMA VOLTA À ROTA (02/10, pedido direto) ────────────────────────
         A 5ª volta da SIS-220 tinha comentado este bloco por um motivo só, e ele era de
         procedência de escrita, não de desenho: a frase «Soluções especializadas que
         apoiam planejamento, desenvolvimento, qualidade e conhecimento.» não estava no
         paste daquela volta, e o pedido era publicar SÓ o paste. Nada foi reprovado — a
         faixa saiu por falta de texto autorizado.

         ⚠️ O QUE MUDOU A PREMISSA: a usuária colou a escrita dos oito produtos no chat
         de 02/10 (nomes, descrições e as métricas +60%/+95%/+84%/−57%/+85%/+55%) e
         mandou «pode voltar com o Ecossistema». A escrita passou a ter procedência, e o
         motivo da retirada deixou de existir. Não é reversão de decisão de layout.

         ⚠️ A ESCRITA PUBLICADA É A DO `docs/luminnaecosistema.md`, que é o que
         `luminnaEcossistema.ts` já carrega — e não a do paste de 02/10, que repete o
         paste da 2ª volta. O documento SUCEDE aquele paste e as divergências estão
         anotadas uma a uma no docblock daquele arquivo (CODE perdeu a lista de
         tecnologias, DOC/CASE/PROMPT foram reescritas). Trocar para o paste agora
         desfaria a 3ª volta inteira; se for isso que se quer, é pedido novo e o lugar é
         `luminnaEcossistema.ts`, não aqui.

         ⚠️ TRÊS COISAS ANDAM JUNTAS, e separar qualquer uma quebra algo em silêncio:
         este bloco, a chave `tecnologia-aplicada-em-todo-o-ciclo` em `pageSections.ts`
         (sem ela o rótulo do indicador vai com tinta clara sobre faixa clara) e a
         montagem em `LuminnaAiPagina.tsx`. As três foram religadas na mesma passada.

         ⚠️ O `copy-lock` NÃO FOI RODADO nesta passada, como também não foi na 3ª volta
         que mudou esta escrita de nó. Fica dito para não passar por conferido. */
      {
        kind: 'paragraphs',
        heading: 'Tecnologia aplicada em todo o ciclo',
        navLabel: 'Ecossistema',
        paragraphs: [
          'Soluções especializadas que apoiam planejamento, desenvolvimento, qualidade e conhecimento.',
        ],
      },
      /* O BLOCO ANTIGO, DESATIVADO E NÃO APAGADO (regra da casa). Ativo, ele
         duplicaria a faixa: `LuminnaAiPagina` acha o bloco por `heading` e os dois
         títulos são diferentes, então os dois montariam.
      {
        kind: 'list',
        heading: 'Luminna AI',
        navLabel: 'Ecossistema',
        items: [
          {
            term: 'LUMINNA STORY AI',
            text: 'Criação ágil de histórias e priorização de tarefas',
            highlights: ['+60% de aumento na velocidade de criação de histórias'],
          },
          {
            term: 'LUMINNA ESTIMATE AI',
            text: 'Estimativas precisas de esforço, complexidade e tamanho funcional',
            highlights: [
              '+60% mais detalhes na criação de tarefas',
              '+95% mais rapidez na estimativa de esforços',
            ],
          },
          {
            term: 'LUMINNA CODE AI',
            text: 'Automação de Revisão de Código e Migração de Tecnologias (Spring Boot, Angular, Java 21+, BSAD5)',
            highlights: [
              '+84% de aumento na velocidade de revisão de código',
              '−57% menos tempo para correção de bugs',
            ],
          },
          {
            term: 'LUMINNA FIX AI',
            text: 'Correção automática de bugs e vulnerabilidades',
            highlights: ['+84% mais rapidez na identificação de vulnerabilidade'],
          },
          {
            term: 'LUMINNA DOC AI',
            text: 'Geração automática de documentação clara e concisa',
            highlights: ['+85% de ganho de tempo e qualidade na geração de documentação'],
          },
          {
            term: 'LUMINNA TEST AI',
            text: 'Geração de testes unitários abrangentes',
          },
          {
            term: 'LUMINNA CASE AI',
            text: 'Criação de testes funcionais detalhados',
            highlights: ['+55% mais rapidez na criação de testes unitários'],
          },
          {
            term: 'LUMINNA PROMPT AI',
            text: 'Direcionamento das respostas da IA de forma mais precisa, garantindo maior aderência às necessidades do negócio.',
          },
        ],
      },
      */
      {
        kind: 'list',
        heading: 'Integração Versátil',
        intro: 'O Luminna AI foi desenvolvido para ser facilmente integrável, oferecendo compatibilidade com uma ampla variedade de soluções de software de terceiros.',
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
        /* SIS-220 — UM parágrafo, porque o paste escreve UM. A quebra em dois era
           editorial nossa, e ela custava: partida no ponto, a segunda metade («Com sua
           integração versátil…») virava uma segunda afirmação de revolução solta no fim
           da página. Junta, é uma frase com sujeito e consequência.
           Antes:
             'O Luminna AI representa uma revolução no desenvolvimento de software, proporcionando eficiência, qualidade e rapidez.',
             'Com sua integração versátil e ferramentas avançadas, é a solução ideal para empresas que buscam se destacar no mercado competitivo atual.', */
        paragraphs: [
          'O Luminna AI representa uma revolução no desenvolvimento de software, proporcionando eficiência, qualidade e rapidez. Com sua integração versátil e ferramentas avançadas, é a solução ideal para empresas que buscam se destacar no mercado competitivo atual.',
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
  {
    id: 'sds',
    name: 'SDS — Sistema Digital de Sinistros',
    lead:
      'O SDS conecta segurados, documentos, equipes e agentes especializados em uma jornada contínua, rastreável e configurável. A solução estrutura o comunicado, apoia a análise documental, identifica indícios relevantes e prepara a regulação, mantendo as decisões críticas sob responsabilidade humana.',
    metadataDescription:
      'Conheça o SDS, plataforma da Sistran que conecta comunicado, documentos, apoio antifraude e regulação em uma jornada rastreável, com inteligência artificial e decisão humana.',
    blocks: [
      {
        kind: 'paragraphs',
        heading: 'Uma plataforma para toda a jornada de sinistros',
        navLabel: 'O que é',
        paragraphs: [
          'O Sistema Digital de Sinistros é uma solução da Sistran que combina regras de negócio, inteligência artificial e participação humana para organizar e conduzir o sinistro desde o primeiro relato até o parecer da regulação.',
          'A plataforma transforma documentos e informações não estruturadas em um caso compreendido, preservando o contexto, a origem das evidências e o histórico de cada análise.',
        ],
      },
      {
        kind: 'list',
        heading: 'Do comunicado à regulação em oito etapas',
        navLabel: 'Como funciona',
        ordered: true,
        items: [
          { term: 'Comunicado', text: 'Coleta o relato inicial e identifica a natureza do sinistro.' },
          { term: 'Documentos', text: 'Orienta o envio e classifica os documentos necessários.' },
          {
            term: 'Extração inteligente',
            text: 'Transforma documentos e conteúdos não estruturados em dados utilizáveis.',
          },
          {
            term: 'Validação',
            text: 'Cruza informações cadastrais, contratuais e relacionadas à ocorrência.',
          },
          {
            term: 'Apoio antifraude',
            text: 'Identifica anomalias e organiza indícios para revisão especializada.',
          },
          {
            term: 'Consolidação',
            text: 'Reúne dados, documentos, pendências, histórico e alertas.',
          },
          {
            term: 'Protocolo',
            text: 'Formaliza o caso e preserva a rastreabilidade das informações.',
          },
          {
            term: 'Regulação',
            text: 'Agentes especializados apoiam a análise e a elaboração do parecer, mantendo a decisão com o regulador.',
          },
        ],
      },
      {
        kind: 'list',
        heading: 'Três pilares',
        navLabel: 'Pilares',
        items: [
          {
            term: 'Comunicado inteligente',
            text: 'Conduz o segurado em uma coleta contextual e assistida, antecipando pendências e reduzindo o preenchimento manual e o retrabalho.',
            highlights: [
              'Contexto da ocorrência preservado',
              'Documentos classificados',
              'Pendências identificadas antecipadamente',
              'Acompanhamento claro da jornada',
            ],
          },
          {
            term: 'Regulação agêntica',
            text: 'Agentes especializados de inteligência artificial analisam contrato, cobertura, consistência, evidências e riscos para preparar um parecer estruturado e fundamentado.',
            highlights: [
              'Cobertura e vigência verificadas',
              'Evidências relacionadas ao caso',
              'Exceções sinalizadas',
              'Histórico auditável',
              'Decisão humana preservada',
            ],
          },
          {
            term: 'Apoio antifraude',
            text: 'Analisa documentos em diferentes camadas e apresenta sinais priorizados para apoiar a investigação especializada, sem classificar automaticamente uma ocorrência como fraude.',
            highlights: [
              'Metadados e estrutura dos arquivos',
              'Indícios de manipulação',
              'Inconsistências visuais e tipográficas',
              'Mapa de calor das regiões suspeitas',
              'Critérios e evidências registrados',
            ],
          },
        ],
      },
      {
        kind: 'list',
        heading: 'Um agente especializado para cada momento da jornada',
        navLabel: 'Agentes',
        intro:
          'Os agentes do SDS possuem responsabilidades definidas e trabalham de forma coordenada. Eles classificam documentos, extraem informações, verificam consistência, identificam lacunas e organizam evidências para que a equipe concentre sua capacidade técnica nos casos que realmente exigem análise e julgamento.',
        items: [
          { term: 'Agente Orquestrador', text: '' },
          { term: 'Extração de documentos', text: '' },
          { term: 'Revisão documental', text: '' },
          { term: 'Validação de informações', text: '' },
          { term: 'Elegibilidade', text: '' },
          { term: 'Análise contratual', text: '' },
          { term: 'Apoio antifraude', text: '' },
          { term: 'Especialistas da regulação', text: '' },
        ],
      },
      {
        kind: 'list',
        heading: 'A inteligência artificial apoia. A decisão permanece humana.',
        navLabel: 'Governança',
        intro:
          'O SDS não substitui o julgamento técnico do regulador. A plataforma organiza informações, executa verificações e apresenta recomendações fundamentadas, permitindo que profissionais avaliem exceções, consultem evidências e assumam a responsabilidade pelas decisões.',
        items: [
          { text: 'Evidências vinculadas às conclusões' },
          { text: 'Origem dos dados preservada' },
          { text: 'Critérios aplicados registrados' },
          { text: 'Histórico completo das análises' },
          { text: 'Revisão humana nos pontos críticos' },
        ],
      },
      {
        kind: 'list',
        heading: 'Impacto em toda a operação de sinistros',
        navLabel: 'Benefícios',
        items: [
          { term: 'Menos esforço operacional', text: 'Reduz atividades manuais e repetitivas ao longo da jornada.' },
          { term: 'Mais velocidade', text: 'Acelera o comunicado e antecipa o início da regulação.' },
          { term: 'Maior qualidade dos dados', text: 'Extrai, valida e organiza informações com consistência.' },
          { term: 'Menos retrabalho', text: 'Identifica documentos ausentes e divergências antecipadamente.' },
          { term: 'Mais segurança', text: 'Mantém evidências, critérios e decisões em uma trilha rastreável.' },
          { term: 'Melhor experiência do segurado', text: 'Oferece orientação clara e acompanhamento durante o processo.' },
          { term: 'Escalabilidade operacional', text: 'Permite processar mais casos sem crescimento proporcional da equipe.' },
          { term: 'Regulação mais consistente', text: 'Padroniza verificações e prepara pareceres fundamentados para revisão.' },
        ],
      },
      {
        kind: 'paragraphs',
        heading: 'Integração com o ecossistema da seguradora',
        navLabel: 'Integração',
        paragraphs: [
          'O SDS pode se conectar aos sistemas já utilizados pela seguradora, incluindo plataformas de apólices, gestão de sinistros, documentos, pagamentos, comunicação e sistemas corporativos.',
          'A arquitetura configurável permite adaptar regras, documentos e etapas de acordo com o produto, a cobertura e o modelo operacional de cada organização.',
        ],
      },
      {
        kind: 'paragraphs',
        heading: 'Sinistros mais inteligentes começam com uma jornada melhor estruturada',
        inPageNav: false,
        paragraphs: [
          'Conheça como o SDS pode conectar pessoas, documentos, inteligência e decisões em uma operação mais ágil, segura e rastreável.',
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
