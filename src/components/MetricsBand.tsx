/**
 * SIS-134 — faixa chapada com os sete indicadores institucionais, em /contato,
 * antes do painel de contato.
 *
 * Não é a seção "Sistran em números" da home. Aquela é um palco com percurso de
 * scroll pinado, contador por indicador e um gráfico (`visual`) para cada um.
 * Aqui é prova antes do formulário: sete pares número/descrição numa faixa, sem
 * palco e sem gráfico. Copiar `Metrics.tsx` para cá traria um SEGUNDO percurso
 * pinado numa página que já tem mapa, marquee e palco reativo.
 *
 * ── SIS-144 REVERTE O PARÁGRAFO ACIMA, E VALE DIZER EXATAMENTE O QUANTO ──────
 * A faixa GANHOU percurso: em telas de 1024px ou mais, o palco prende na janela e
 * os sete cartões correm para o lado (`ui/PercursoIndicadores.tsx` +
 * `metrics-band-track.css`). A decisão de não ter percurso, escrita acima, deixa
 * de valer — fica no lugar porque o argumento dela é o que delimita o que foi
 * feito, não porque continue de pé.
 *
 * O que a objeção acertava e o que a nova cena faz com isso: um segundo percurso
 * PINADO nesta rota seria de fato um problema, e é por isso que este NÃO é pinado.
 * `Metrics.tsx` usa ScrollTrigger com `pin`; aqui é `position: sticky` e um
 * progresso escrito direto no DOM, sem ScrollTrigger nenhum — então não há dois
 * `pin` para reparentar nós nem dois conjuntos de offset para desalinhar quando a
 * página remede. E as duas cenas seguem em ROTAS diferentes; o que esta rota ganha
 * é um movimento a mais, não um `pin` a mais.
 *
 * O que continua igual, e é o que separa esta faixa da home: não há gráfico, não
 * há `visual`, não há `caption`. O percurso mudou a GEOMETRIA da faixa; não a
 * transformou no palco da home nem trouxe um conteúdo que ela não tinha.
 *
 * ── 11/09 DESFAZ A GEOMETRIA DA SIS-144, E O PRIMEIRO PARÁGRAFO VOLTA A VALER ─
 * Nem percurso preso nem fileira que corre para o lado: os sete voltam a ser uma
 * grade e aparecem DE UMA VEZ, nos mesmos degraus de coluna da fileira da home
 * (1 → 2 → 4 → 7). O pedido é da autora do escopo, depois de ver as duas formas
 * na tela — a faixa tinha de ficar do tamanho da seção de números da home, e
 * "do tamanho" aqui quer dizer uma tela, não duas.
 * O que a SIS-144 escreveu acima continua correto como HISTÓRIA e é o roteiro de
 * religar: o mount comentado está no JSX, o CSS de repouso em `globals.css`
 * (`.contato-indicadores-grade`), e `ui/PercursoIndicadores.tsx` e
 * `ui/metrics-band-track.css` seguem inteiros, sem nenhum consumidor.
 *
 * A fonte é `METRICS` (`src/data/metrics.ts`) — a mesma da home. Nenhum número e
 * nenhum rótulo redigitado: com dois literais, a primeira correção de valor
 * deixaria as duas telas divergentes, e essa é justamente a classe de defeito que
 * o próprio `metrics.ts` registra no cabeçalho (o `clientes: 150` que o código
 * tinha desviado de `130`). O campo `visual` existe no dado e NÃO é lido aqui; a
 * `caption` também não — ela é a frase de apoio do palco da home. A SIS-143 pôs
 * cada indicador num cartão, então a razão antiga ("aqui cada item é uma linha,
 * não um cartão") caducou; o motivo que fica valendo é outro e é mais forte: a
 * `caption` é escrita NOVA, fora da fonte travada (está marcado no cabeçalho de
 * `metrics.ts`), e este cartão é número + rótulo ao lado, sem terceira linha onde
 * ela caiba sem lombar o desenho.
 *
 * SIS-143 — AGORA COM CONTADOR, e isto REVERTE a decisão que estava escrita aqui.
 * O que ela dizia, palavra por palavra do que era: não havia contagem porque
 * `CountUp` renderizava `0` no servidor e só chegava ao valor final depois da
 * hidratação (o número final vivia no `.sr-only`), então com JavaScript desligado
 * a faixa mostraria sete zeros — e o critério declarado era que os sete números
 * estivessem legíveis no HTML servido.
 * Das duas saídas que a issue oferece — (a) aceitar os sete zeros e registrar o
 * custo, ou (b) fazer o `CountUp` sair do servidor já com o valor final — foi
 * tomada a (b), e o critério antigo continua CUMPRIDO: os sete números estão no
 * HTML servido, com o valor certo. O preço é que `CountUp.tsx` mudou, e ele serve
 * outras quatro telas; o que muda em cada estado e nas quatro está escrito lá, no
 * próprio primitivo, que é onde quem mexer vai olhar.
 * O que a (a) teria custado, para a comparação ficar registrada: sete zeros sem
 * JavaScript numa faixa cuja função é ser PROVA antes do formulário — o único
 * conteúdo da seção são os números.
 *
 * O COMPONENTE CONTINUA SERVER COMPONENT. O ponto de atenção 2 supunha que a
 * faixa deixaria de ser: não deixa. `CountUp` é `'use client'` e é montado daqui
 * como filho, o que é permitido — o que passa a viajar é o JavaScript DELE (mais
 * o Motion, que a rota já carrega em `PalcoReativo` e no mapa), não uma fronteira
 * de cliente em volta da faixa. O `<section>`, o `<ul>`, os rótulos e o `+`
 * continuam saindo prontos do servidor.
 * Segue valendo depois da SIS-144, e por escolha de arquitetura:
 * `PercursoIndicadores` é `'use client'`, mas recebe a faixa como `children` — o
 * `<ul>`, os sete cartões, os rótulos e o `+` continuam renderizados no servidor e
 * atravessam a fronteira já prontos. O que virou cliente é o palco em volta (um
 * `ref`, duas leituras de preferência e o relógio de rolagem). Nenhum texto novo
 * passou a viajar como JavaScript por causa do percurso.
 *
 * A CONTAGEM RECONTA A CADA PASSAGEM, e é de propósito. `CountUp` usa `useInView`
 * sem `once` e zera ao sair (`CountUp.tsx`), então quem rolar de volta vê a
 * contagem outra vez. Não virou `once` porque esta faixa fica no ALTO da rota:
 * ela entra em cena uma vez ao abrir e sair dela é rolar para o formulário — o
 * caminho de volta é raro, e quando acontece a segunda contagem é o mesmo gesto
 * que a home já faz em "Sistran em números". Um `once` aqui e um `sem once` lá
 * seriam dois comportamentos para o mesmo primitivo, sem ninguém tendo pedido.
 *
 * ── SIS-211 · A FAIXA FICOU CLARA E O CARTÃO GANHOU ETAPA ───────────────────
 * Três mudanças pedidas de uma vez, e as duas primeiras aparecem aqui:
 *
 * 1. `section-light section-light-blue` no `<section>`. As classes são as da casa,
 *    não cor nova: a variante azul-claro existe em `globals.css` e é a mesma
 *    família de `--fundo-claro-secao` que a issue nomeia. Reusar a CLASSE, e não
 *    copiar o degradê para o bloco da rota, traz de graça (a) os overrides de tinta
 *    para navy, que é exatamente o que um fundo claro exige, e (b) a sombra
 *    espalhada da SIS-93 — a emenda já resolvida para um bloco claro encostando em
 *    seção escura, que é o problema novo do pé do hero. O que ela NÃO resolve é a
 *    tinta dos cartões (branco medido contra navy); isso foi refeito em
 *    `globals.css`, no bloco da faixa.
 *
 * 2. O cartão passou a ter DUAS FILEIRAS: a de cima é a etapa (nó da trilha +
 *    contador + fio), a de baixo é o par número/rótulo que já existia. É o
 *    vocabulário do `RoadmapTrail` das Implementações — nó, trecho percorrido e
 *    contador "01 / 07" —, não o componente: montar `RoadmapTrail` aqui traria as
 *    paradas da Luminna, que são conteúdo de outra rota (a issue proíbe por
 *    escrito). Só a MECÂNICA veio.
 *
 *    O CONTADOR NÃO É COPY NOVA, e o cuidado é deliberado: ele é montado como uma
 *    única expressão (`template literal` com os dois números), sem nenhum nó de
 *    texto literal no JSX — nem o ` / ` do meio. `scripts/copy-lock.mjs` conta nó de
 *    texto de JSX e prop de texto declarada; escrever `01 / 07` partido em volta de
 *    `{i + 1}` publicaria a barra como texto novo do site. Os dois números saem de
 *    `METRICS` (índice e contagem), que é o que a issue exige: "copy só de
 *    `METRICS`". A palavra "Etapa" do original das Implementações FICOU DE FORA por
 *    isso mesmo — ela seria escrita nova, e o lock é a régua.
 *
 *    `aria-hidden` na fileira inteira: ela é ordinal e decorativa. O leitor de tela
 *    já recebe "850+, Membros do Grupo Sistran" como par, e anunciar "01 de 07"
 *    antes de cada um acrescentaria sete leituras que não são o dado.
 *
 * 3. A terceira mudança (seção mais baixa) não passa por aqui: é o passo do
 *    percurso, em `ui/PercursoIndicadores.tsx`.
 *
 * Marcação: `<ul>` com número e descrição no MESMO item, na ordem em que se leem.
 * O leitor de tela anuncia "850+, Membros do Grupo Sistran" como um par. Não é
 * `<dl>` porque o par que o `<dl>` modela seria `<dt>` descrição / `<dd>` valor —
 * e o valor é o que aparece EM CIMA. Com `<dl>` eu teria de inverter a ordem do
 * DOM em relação à visual, ou inverter a semântica; a lista simples não obriga a
 * escolher. O número também não é `aria-label` de nada: os dois são texto.
 */
import { METRICS } from '@/data/metrics';
import { CountUp } from '@/components/primitives/CountUp';
/* O PERCURSO SAIU (pedido de 11/09), e o import fica comentado em vez de apagado:
   ativo, o lint quebra por import não utilizado; apagado, ninguém saberia que esta
   faixa já teve palco preso. O motivo da saída está no bloco do JSX, onde o mount
   também ficou comentado. `ui/PercursoIndicadores.tsx` e
   `ui/metrics-band-track.css` continuam no repositório, inteiros.
   import PercursoIndicadores from '@/components/ui/PercursoIndicadores'; */

export default function MetricsBand() {
  return (
    /* `aria-label` e não um `<h2>` visível: a faixa não abre capítulo — ela
       comprova o que a manchete acabou de dizer. Um título aqui competiria com
       "Preencha o formulário e fale com a gente!" logo acima e com "Entre em
       contato conosco" logo abaixo, que são os dois títulos que a página tem. */
    <section
      aria-label="A Sistran em números"
      className="contato-indicadores section-light section-light-blue"
    >
      {/* ── O PALCO PRESO SAIU DAQUI (pedido de 11/09) ──────────────────────
          A faixa volta a ser o que a home é nesta mesma parte: os sete
          indicadores visíveis DE UMA VEZ, numa grade compacta, sem percurso
          lateral e sem espaçador comprando duas telas de rolagem. A decisão é da
          autora do escopo, e foi tomada depois de ver as duas formas na tela.

          O que a SIS-144 escrevia aqui, e que fica registrado porque é o que se
          religa: o percurso embrulhava o `container-lp`, e não o contrário,
          porque o palco precisava medir a JANELA (ele prendia com 100svh e
          recortava os cartões que passavam) enquanto o `container-lp` continuava
          sendo o recuo do conteúdo. Invertido, o palco herdaria os 1116px do
          contêiner e a trilha seria recortada no meio da tela.
          O `<section>` já ficava fora por outro motivo, que não mudou: é ele que
          carrega o `aria-label` e o fundo, e nenhum dos dois muda de dono.

          RELIGAR é devolver o mount abaixo e o import no topo — nem
          `ui/PercursoIndicadores.tsx` nem `ui/metrics-band-track.css` foram
          tocados, e o CSS de repouso desta faixa (`globals.css`) é o único lugar
          que precisaria voltar à fileira de largura fixa.
      <PercursoIndicadores> */}
        <div className="container-lp">
          {/* O `tabIndex={0}` SAIU JUNTO, e é consequência da grade, não descuido:
              ele existia porque a fileira era um contêiner de rolagem horizontal
              (`overflow-x: auto`), e no Chrome região rolável não entra na
              navegação por teclado sozinha — sem ele, quem usa teclado alcançava
              três dos sete cartões (o defeito que a SIS-159 mediu na trilha de
              parceiros). Com os sete numa grade não há nada para rolar, e um ponto
              de tabulação numa lista sem foco interno é uma parada que não leva a
              lugar nenhum. Valor anterior: `tabIndex={0}`.
              A identificação nunca dependeu dele: a lista tem nome pelo
              `aria-label` do `<section>` e cada item é anunciado como par
              número/rótulo. */}
          <ul className="contato-indicadores-grade">
            {METRICS.map((m, i) => (
              /* `--ind-fase` é o ATRASO da onda deste cartão (a animação está em
                 `globals.css`, `contato-indicador-onda`). Negativo de propósito:
                 atraso positivo faria os sete ficarem parados esperando a vez, e o
                 negativo entra com a animação já em curso — a fileira nasce ondulando
                 em vez de acordar em cascata.
                 O passo mora AQUI, e não no CSS, porque só a marcação conhece o
                 índice; e é o mesmo recurso dos cartões do ESG (`--esg-fase-onda`
                 em `app/esg/page.tsx`), que é o precedente da casa. */
              <li
                key={m.id}
                className="contato-indicador"
                style={{ ['--ind-fase' as string]: `-${(i * 0.7).toFixed(1)}s` }}
              >
                {/* A fileira da etapa. O `nó` e o `fio` são vazios de propósito —
                    são grafismo, e o CSS os acende conforme o percurso avança
                    (`--mb-alc` em `metrics-band-track.css`). Fora do percurso
                    nascem acesos, para que a grade não pareça uma trilha parada. */}
                <p className="contato-indicador-etapa lp-numeric" aria-hidden="true">
                  <span className="contato-indicador-no" />
                  {`${String(i + 1).padStart(2, '0')} / ${String(METRICS.length).padStart(2, '0')}`}
                  <span className="contato-indicador-fio" />
                </p>
                {/* Corpo: o par número/rótulo que a SIS-143 desenhou, agora dentro
                    de um embrulho para poder ser a segunda fileira do cartão. */}
                <div className="contato-indicador-corpo">
                  <p className="contato-indicador-valor">
                    {/* `srText` com o sufixo dentro, senão o leitor de tela anuncia
                      "850" e a unidade ao lado se perde: o `+` é um `<span>`
                      irmão, e leitor de tela não junta o número animado com ele. */}
                    <CountUp value={String(m.value)} srText={`${m.value}${m.suffix ?? ''}`} />
                    {/* O sufixo separado só para receber o ciano — nunca com espaço
                      antes. O dado guarda `value: 850` e `suffix: '+'`, e a home
                      renderiza junto: "850+". Escrever "850 +" aqui faria as duas
                      telas publicarem o mesmo dado de dois jeitos.
                      `aria-hidden` a partir da SIS-143: o `+` agora é anunciado pelo
                      `.sr-only` do `CountUp`, e sem isto o leitor diria "850+ mais". */}
                    <span className="contato-indicador-mais" aria-hidden="true">
                      {m.suffix}
                    </span>
                  </p>
                  <p className="contato-indicador-rotulo">{m.label}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      {/* </PercursoIndicadores> */}
    </section>
  );
}
