/**
 * SIS-204 — A CAMADA DE ATMOSFERA DE `/solucoes`: quadrados arredondados
 * translúcidos, linhas finas e um arco azul, atrás da página inteira.
 *
 * O PRINT 3 NÃO ESTÁ NO REPOSITÓRIO. A issue pede «como no print 3 do chat» e
 * descreve o desenho em prosa — «fundo claro com retângulos arredondados
 * translúcidos, linhas finas, arco azul, malha de pontos». As únicas artes de
 * referência versionadas são `public/imagensexemplo/` (o mock de `/solucoes` e o
 * do Match AI), e nenhuma delas é o print 3. Então o que está desenhado aqui vem
 * da DESCRIÇÃO, não da imagem, e os números do desenho vêm do que a rota já tem
 * medido (o raio 28px é o `border-radius` medido nos `accel-card`; a tinta das
 * linhas é `--grade-fina-linha`; o azul do arco é o `#0079cb` dos brilhos claros
 * da casa). Isso está declarado no comentário da issue para não passar por
 * conferência de arte.
 *
 * POR QUE UM `<svg>`, E NÃO MAIS DOIS PSEUDO-ELEMENTOS: retângulo arredondado e
 * arco não se escrevem em `background-image`. Gradiente faz linha e ponto — e é
 * assim que a malha de pontos e as linhas de grade continuam em CSS
 * (`.solucoes-canvas::before`, `globals.css`) — mas canto redondo e curva pedem
 * geometria. O que sobra para o SVG é exatamente o que gradiente não faz.
 *
 * SEM `<defs>` E SEM `id`: a peça é montada uma vez por página, mas `id` em SVG é
 * global ao documento e a regra da casa (aprendida nas cápsulas) é não criar a
 * chance de dois mounts colidirem. As linhas usam `vector-effect:
 * non-scaling-stroke` porque o `preserveAspectRatio="xMidYMid slice"` escala a
 * arte para COBRIR a janela: sem isso o traço de 1px engrossaria com a escala e a
 * camada deixaria de ser sutil justamente nas telas grandes.
 *
 * `slice` (cobrir) e não `meet` (caber): a arte é ATMOSFERA e tem de sangrar nas
 * quatro bordas. A 390 a escala vertical governa (0,9) e a janela vê só a faixa
 * CENTRAL de ~433px do `viewBox` — por isso a composição é empilhada em torno de
 * x = 720 e as linhas atravessam de borda a borda: o recorte estreito continua
 * mostrando quadrados, linha e um pedaço do arco, em vez de um canto vazio.
 *
 * NÃO ANIMA NADA, de propósito: é fundo, e movimento aqui competiria com o reveal
 * das seções e com o vídeo do hero. Por isso também não há nada a desligar nos
 * dois canais de movimento reduzido — a sonda mede zero animação correndo nos
 * dois, e é esse zero que prova que a camada não precisa de ressalva.
 */
export default function AtmosferaQuadrados() {
  return (
    /* `aria-hidden` e fora de qualquer landmark de conteúdo: é pintura. O
       `pointer-events: none` está na folha, não aqui, porque ele é condição da
       camada existir (ela cobre a janela inteira e cliparia a página toda). */
    <div aria-hidden className="solucoes-atmosfera">
      <svg viewBox="0 0 1440 1000" preserveAspectRatio="xMidYMid slice" focusable="false">
        {/* LINHAS FINAS — as quatro que estruturam a composição, sangrando de
            borda a borda. Elas não são a grade (a grade é o gradiente no
            `::before` do canvas): são as poucas linhas longas que o print
            descreve, e é por isso que são contadas, e não repetidas. */}
        <g
          stroke="rgba(4, 58, 99, 0.10)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
          fill="none"
        >
          <path d="M-40 232H1480" vectorEffect="non-scaling-stroke" />
          <path d="M-40 768H1480" vectorEffect="non-scaling-stroke" />
          <path d="M432 -40V1040" vectorEffect="non-scaling-stroke" />
          <path d="M1008 -40V1040" vectorEffect="non-scaling-stroke" />
        </g>

        {/* ARCO AZUL — uma curva só, larga, atravessando a composição. Raio grande
            e corda longa: é o gesto do print, não um anel. */}
        <path
          d="M-120 880C220 520 640 300 1180 268C1360 258 1480 262 1560 272"
          fill="none"
          stroke="rgba(0, 121, 203, 0.22)"
          strokeWidth="1.5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />

        {/* QUADRADOS ARREDONDADOS TRANSLÚCIDOS — raio 28, o mesmo `border-radius`
            medido nos cards de acelerador desta rota (`accel-card`): a atmosfera
            repete a forma do conteúdo em vez de introduzir uma segunda. Branco a
            38/26% sobre o claro da rota, com fio navy a 8% — o suficiente para a
            borda existir e insuficiente para virar cartão. */}
        <g fill="rgba(255, 255, 255, 0.30)" stroke="rgba(4, 58, 99, 0.08)" strokeWidth="1">
          <rect
            x="470"
            y="96"
            width="356"
            height="238"
            rx="28"
            vectorEffect="non-scaling-stroke"
          />
          <rect
            x="614"
            y="392"
            width="470"
            height="286"
            rx="28"
            fill="rgba(255, 255, 255, 0.22)"
            vectorEffect="non-scaling-stroke"
          />
          <rect
            x="392"
            y="612"
            width="286"
            height="286"
            rx="28"
            fill="rgba(255, 255, 255, 0.18)"
            vectorEffect="non-scaling-stroke"
          />
          <rect
            x="1064"
            y="120"
            width="300"
            height="196"
            rx="28"
            fill="rgba(255, 255, 255, 0.20)"
            vectorEffect="non-scaling-stroke"
          />
          <rect
            x="104"
            y="300"
            width="238"
            height="238"
            rx="28"
            fill="rgba(255, 255, 255, 0.20)"
            vectorEffect="non-scaling-stroke"
          />
        </g>
      </svg>
    </div>
  );
}
