/**
 * SIS-220 (3ª volta) — OS OITO PRODUTOS DO ECOSSISTEMA LUMINNA, EM DADO TIPADO.
 *
 * POR QUE ESTE ARQUIVO EXISTE, e não um bloco `kind: 'list'` em
 * `acceleratorPages.ts` como na 2ª volta: o desenho pedido por
 * `docs/luminnaecosistema.md` precisa de quatro coisas que o tipo `AccelBlock`
 * não tem lugar para dizer —
 *   1. CATEGORIA por produto (é ela que os filtros «Planejamento / Engenharia /
 *      Qualidade / Conhecimento» ligam e desligam);
 *   2. MÉTRICA PARTIDA em número e rótulo (`+84%` em ciano grande, «velocidade na
 *      revisão de código» embaixo, em corpo pequeno). Em `highlights` a métrica é
 *      uma frase inteira, e partir a frase no componente por regex seria inventar
 *      gramática em tempo de render;
 *   3. COLUNA da composição bento (Story+Doc · Estimate+Test · Code+Case ·
 *      Fix+Prompt), que é ordenação visual e não ordem de leitura do dado;
 *   4. `id` ESTÁVEL, porque o estado do painel aberto nasce em `'code-ai'` e o
 *      `aria-controls` do botão é montado dele. Chave derivada do nome quebraria
 *      no dia em que o nome mudar de caixa.
 * Alargar `AccelBlock` com esses quatro campos os empurraria para as outras seis
 * páginas de acelerador, que não têm nenhum deles. O bloco do dado continua
 * existindo — ele é que carrega TÍTULO, SOBRANCELHA e DESCRIÇÃO da faixa, e é o
 * que faz a seção ser parada do indicador lateral; ver a nota lá.
 *
 * A ESCRITA É A DO `docs/luminnaecosistema.md` § «Conteúdo dos cards», e essa é a
 * fonte que a issue manda usar — ela SUCEDE o paste da 2ª volta, que está
 * preservado como histórico em `acceleratorPages.ts`. O que mudou de lá para cá,
 * item por item, para ninguém ler como deriva:
 *   STORY/DOC/TEST/FIX/PROMPT — descrição reescrita pelo documento (ex.: DOC era
 *     «Geração automática de documentação clara e concisa» e agora é
 *     «Documentação clara, estruturada e rastreável.»);
 *   CODE — a lista de tecnologias («Spring Boot, Angular, Java 21+, BSAD5») SAIU
 *     do cartão por decisão do documento; a descrição é «Automação de revisão de
 *     código e migração de tecnologias.»;
 *   CASE — ganhou «cenários» («Criação de cenários e testes funcionais
 *     detalhados.»);
 *   FIX — «vulnerabilidade» virou plural, como o documento escreve.
 * As frases agora terminam em ponto, porque o documento as escreve assim.
 *
 * ⚠️ A PARTIÇÃO DAS MÉTRICAS EM `valor` + `rotulo` É MECÂNICA, NÃO AUTORAL, e só
 * o CODE AI vem partido no documento («+84%» / «velocidade na revisão de código»,
 * «−57%» / «tempo para correção de bugs»). Nos outros cinco o corte cai onde o
 * número acaba, e NENHUMA palavra foi acrescentada, removida ou trocada de ordem:
 * «+60% de aumento na velocidade de criação de histórias» vira `valor: '+60%'` +
 * `rotulo: 'de aumento na velocidade de criação de histórias'`. Remontar valor e
 * rótulo com um espaço devolve a frase do documento, byte por byte — é o teste
 * que qualquer volta futura pode repetir.
 *
 * ⚠️ DUAS AUSÊNCIAS DE MÉTRICA, e as duas são da fonte: LUMINNA TEST AI e LUMINNA
 * PROMPT AI têm `metricas: []`, com o documento dizendo em palavras «não inventar
 * métrica caso ela não exista nos dados atuais». Elas é que recebem, no cartão, a
 * ação «Conheça a solução →» em vez de «Ver resultados +».
 *
 * ⚠️ A DIVERGÊNCIA HERDADA CONTINUA DE PÉ: «+55% mais rapidez na criação de
 * TESTES UNITÁRIOS» está sob o CASE AI, que é o de testes FUNCIONAIS — quem gera
 * teste unitário é o TEST AI, que é justamente o que ficou sem métrica. O
 * documento manda «preservar esse texto enquanto não houver conteúdo oficial
 * corrigido no projeto», em palavras, então o número fica onde a fonte o pôs. Se a
 * fonte confirmar a troca, o conserto é mover este único objeto de `case-ai` para
 * `test-ai`, e nada mais.
 */

/** As quatro categorias, e são exatamente os quatro filtros (sem o «Todos», que
    não é categoria de produto e sim ausência de filtro). */
export type CategoriaEcossistema = 'Planejamento' | 'Engenharia' | 'Qualidade' | 'Conhecimento';

export type MetricaEcossistema = {
  /** O número como se lê, com sinal e unidade: `+84%`, `−57%`. O sinal de menos é
      o MENOS TIPOGRÁFICO (U+2212), como o documento escreve — o hífen do teclado
      fica visivelmente mais curto ao lado de um número em corpo grande. */
  valor: string;
  /** O resto da frase da fonte, sem o número. */
  rotulo: string;
};

export type SolucaoEcossistema = {
  id: string;
  /** Nome do produto em caixa alta, como a fonte escreve os oito. */
  nome: string;
  categoria: CategoriaEcossistema;
  descricao: string;
  /** 1 a 4: a coluna da composição bento. Ver o docblock. */
  coluna: 1 | 2 | 3 | 4;
  metricas: readonly MetricaEcossistema[];
};

/* ⚠️ OS FILTROS FORAM RETIRADOS DA TELA NA 4ª VOLTA (pedido direto: a linha de
   pastilhas e o contador «N de 8 soluções» saíram). As duas constantes ficam
   comentadas, e não apagadas, porque `docs/luminnaecosistema.md` AINDA as pede — se
   os filtros voltarem, voltam com esta lista e nesta ordem, que é a do documento.
   O campo `categoria` de cada solução NÃO saiu: ele continua sendo a ficha impressa
   em cada cartão. Era o filtro que o lia como critério, não o cartão.

   | /** O rótulo do filtro que não filtra nada. *|
   | export const FILTRO_TODOS = 'Todos';
   |
   | /** Os filtros na ordem em que o documento os lista. *|
   | export const FILTROS_ECOSSISTEMA = [
   |   FILTRO_TODOS, 'Planejamento', 'Engenharia', 'Qualidade', 'Conhecimento',
   | ] as const;
*/

/** O cartão que nasce aberto, por pedido do documento («Utilizar LUMINNA CODE AI
    como card inicialmente selecionado»). É `id`, não índice. */
export const SOLUCAO_INICIAL = 'code-ai';

/* A ordem daqui é a ordem de LEITURA (a mesma do paste: Story, Estimate, Code,
   Fix, Doc, Test, Case, Prompt), e quem monta a composição é o campo `coluna`.
   Manter as duas coisas separadas é o que permite mexer no desenho sem reordenar
   dado — e o que faz o filtro poder esvaziar uma coluna sem embaralhar as outras. */
export const SOLUCOES_ECOSSISTEMA: readonly SolucaoEcossistema[] = [
  {
    id: 'story-ai',
    nome: 'LUMINNA STORY AI',
    categoria: 'Conhecimento',
    descricao: 'Criação ágil de histórias e priorização de tarefas.',
    coluna: 1,
    metricas: [{ valor: '+60%', rotulo: 'de aumento na velocidade de criação de histórias' }],
  },
  {
    id: 'estimate-ai',
    nome: 'LUMINNA ESTIMATE AI',
    categoria: 'Planejamento',
    descricao: 'Estimativas de esforço, complexidade e tamanho funcional.',
    coluna: 2,
    metricas: [
      { valor: '+60%', rotulo: 'mais detalhes na criação de tarefas' },
      { valor: '+95%', rotulo: 'mais rapidez na estimativa de esforços' },
    ],
  },
  {
    id: 'code-ai',
    nome: 'LUMINNA CODE AI',
    categoria: 'Engenharia',
    descricao: 'Automação de revisão de código e migração de tecnologias.',
    coluna: 3,
    /* Os dois únicos rótulos que o documento já entrega partidos — e por isso são
       mais curtos que os outros cinco: «velocidade na revisão de código» e não «de
       aumento na velocidade de revisão de código». Não é encurtamento nosso. */
    metricas: [
      { valor: '+84%', rotulo: 'velocidade na revisão de código' },
      { valor: '−57%', rotulo: 'tempo para correção de bugs' },
    ],
  },
  {
    id: 'fix-ai',
    nome: 'LUMINNA FIX AI',
    categoria: 'Engenharia',
    descricao: 'Correção automática de bugs e vulnerabilidades.',
    coluna: 4,
    metricas: [{ valor: '+84%', rotulo: 'mais rapidez na identificação de vulnerabilidades' }],
  },
  {
    id: 'doc-ai',
    nome: 'LUMINNA DOC AI',
    categoria: 'Conhecimento',
    descricao: 'Documentação clara, estruturada e rastreável.',
    coluna: 1,
    metricas: [
      { valor: '+85%', rotulo: 'de ganho de tempo e qualidade na geração de documentação' },
    ],
  },
  {
    id: 'test-ai',
    nome: 'LUMINNA TEST AI',
    categoria: 'Qualidade',
    descricao: 'Geração de testes unitários abrangentes.',
    coluna: 2,
    metricas: [],
  },
  {
    id: 'case-ai',
    nome: 'LUMINNA CASE AI',
    categoria: 'Qualidade',
    descricao: 'Criação de cenários e testes funcionais detalhados.',
    coluna: 3,
    metricas: [{ valor: '+55%', rotulo: 'mais rapidez na criação de testes unitários' }],
  },
  {
    id: 'prompt-ai',
    nome: 'LUMINNA PROMPT AI',
    categoria: 'Conhecimento',
    descricao: 'Interações mais precisas e aderentes ao negócio.',
    coluna: 4,
    metricas: [],
  },
];

/** As quatro colunas da composição bento, na ordem do desenho. Derivado do campo
    `coluna` para não existir uma segunda lista dos oito ids — duas listas
    divergiriam na primeira inclusão. */
export const COLUNAS_ECOSSISTEMA = [1, 2, 3, 4] as const;
