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
 * Marcação: `<ul>` com número e descrição no MESMO item, na ordem em que se leem.
 * O leitor de tela anuncia "850+, Membros do Grupo Sistran" como um par. Não é
 * `<dl>` porque o par que o `<dl>` modela seria `<dt>` descrição / `<dd>` valor —
 * e o valor é o que aparece EM CIMA. Com `<dl>` eu teria de inverter a ordem do
 * DOM em relação à visual, ou inverter a semântica; a lista simples não obriga a
 * escolher. O número também não é `aria-label` de nada: os dois são texto.
 */
import { METRICS } from '@/data/metrics';
import { CountUp } from '@/components/primitives/CountUp';
import PercursoIndicadores from '@/components/ui/PercursoIndicadores';

export default function MetricsBand() {
  return (
    /* `aria-label` e não um `<h2>` visível: a faixa não abre capítulo — ela
       comprova o que a manchete acabou de dizer. Um título aqui competiria com
       "Preencha o formulário e fale com a gente!" logo acima e com "Entre em
       contato conosco" logo abaixo, que são os dois títulos que a página tem. */
    <section aria-label="A Sistran em números" className="contato-indicadores">
      {/* SIS-144 — o percurso embrulha o `container-lp`, e não o contrário: o
          palco precisa medir a JANELA (é ele que prende com 100svh e recorta os
          cartões que passam), enquanto o `container-lp` continua sendo o recuo do
          conteúdo. Invertido, o palco herdaria os 1116px do contêiner e a trilha
          seria recortada no meio da tela, com faixa de fundo sobrando dos dois
          lados.
          O `<section>` fica FORA por outro motivo: é ele que carrega o
          `aria-label` e o fundo de repouso, e nenhum dos dois muda de dono
          quando o percurso liga ou desliga. */}
      <PercursoIndicadores>
        <div className="container-lp">
          <ul className="contato-indicadores-grade">
            {METRICS.map((m) => (
              <li key={m.id} className="contato-indicador">
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
              </li>
            ))}
          </ul>
        </div>
      </PercursoIndicadores>
    </section>
  );
}
