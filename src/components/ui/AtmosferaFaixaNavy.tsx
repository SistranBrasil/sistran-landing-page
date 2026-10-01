/**
 * AtmosferaFaixaNavy — a camada de quadrados e linhas que vive ATRÁS dos números
 * da faixa 1988 / 150+ / 18.
 *
 * ── POR QUE ELA VIROU COMPONENTE ─────────────────────────────────────────────
 * Ela nasceu inline em `FaixaIndicadores.tsx`, dona de um consumidor só. Passou a
 * ter DOIS quando «Por que SISTRAN?» pediu, em chat, «o mesmo fundo que tem
 * nessa 1988 / 150+ / 18». Trinta e cinco linhas de SVG com seis retângulos e
 * quatro traços em coordenadas medidas não se copiam: a segunda cópia deixa de
 * acompanhar a primeira no dia em que alguém mexer numa calha. É a mesma decisão
 * que a SIS-272 tomou para a faixa inteira — reusar a peça, não repintar.
 *
 * Note que a decisão OPOSTA continua valendo um nível acima, e não é contradição:
 * esta camada não foi fundida com `ui/AtmosferaQuadrados.tsx` (SIS-204), porque
 * aquela é `position: fixed` na janela inteira em `z-index: -1` — não existe como
 * camada dentro de um bloco — e a tinta dela é branco translúcido calibrado para
 * fundo CLARO, que sobre este navy desaparece ou vira névoa. Aqui a tinta é ciano
 * da marca em alfa baixo. Duas peças porque são dois palcos; uma peça por palco.
 *
 * ── O QUE AS MEDIDAS DECIDEM ─────────────────────────────────────────────────
 * O raio 28 e o `vector-effect: non-scaling-stroke` vêm da atmosfera da casa de
 * propósito: é a forma que o site usa, e o fio de 1px não pode engrossar quando o
 * `slice` escala a arte para cobrir a faixa.
 *
 * «NÃO ATRAPALHAR A ESCRITA» decide o resto: `aria-hidden`, sem ponteiro,
 * `z-index: 0` enquanto o conteúdo sobe para `z-index: 1`, e as peças postas nos
 * VÃOS medidos (as duas calhas entre as três colunas, em x=490 e x=950 na grade
 * de 216px de recuo, e as margens) em vez de atrás dos glifos.
 *
 * ⚠️ O `viewBox` é `0 0 1440 332`, a caixa da FAIXA de indicadores. Com
 * `xMidYMid slice` a arte cobre qualquer proporção sem distorcer, então numa caixa
 * MAIS ALTA que 1440×332 — e «Por que SISTRAN?» é muito mais alta — o que se vê é
 * a fatia central horizontal ampliada: as linhas de y=74/268 saem de quadro e
 * sobram as verticais e parte dos quadrados. Isso é atmosfera, não composição, e
 * é aceitável por isso; o que NÃO seria aceitável é o `meet`, que deixaria a
 * camada morrer antes das bordas da seção.
 *
 * O CSS é `.sobre-atmosfera*` em `src/components/sobre-nos.css` — inclusive os dois
 * canais de movimento reduzido (`prefers-reduced-motion` e o espelho
 * `html[data-motion='reduce']`), que desligam as duas derivas. Os nomes NÃO foram
 * renomeados para `atm-*` pela mesma razão que a SIS-272 não renomeou
 * `.sobre-metricas`: o custo de varrer os call sites não compra nada.
 */

export default function AtmosferaFaixaNavy() {
  return (
    <div aria-hidden className="sobre-atmosfera">
      <svg viewBox="0 0 1440 332" preserveAspectRatio="xMidYMid slice" focusable="false">
        {/* As linhas longas: duas horizontais e as duas verticais que caem nas
            calhas entre as colunas. */}
        <g
          stroke="rgba(120, 214, 245, 0.16)"
          strokeWidth="1"
          fill="none"
          vectorEffect="non-scaling-stroke"
        >
          <path d="M-40 74H1480" vectorEffect="non-scaling-stroke" />
          <path d="M-40 268H1480" vectorEffect="non-scaling-stroke" />
          <path d="M490 -40V372" vectorEffect="non-scaling-stroke" />
          <path d="M950 -40V372" vectorEffect="non-scaling-stroke" />
        </g>

        {/* Os quadrados. Dois grupos com derivas independentes e lentas, para o
            movimento não ler como um bloco só escorregando. */}
        <g
          className="sobre-atmosfera-deriva-a"
          fill="rgba(120, 214, 245, 0.05)"
          stroke="rgba(120, 214, 245, 0.13)"
          strokeWidth="1"
        >
          <rect x="56" y="34" width="150" height="150" rx="28" vectorEffect="non-scaling-stroke" />
          <rect x="1216" y="150" width="190" height="190" rx="28" vectorEffect="non-scaling-stroke" />
          <rect x="560" y="212" width="118" height="118" rx="28" vectorEffect="non-scaling-stroke" />
        </g>
        <g
          className="sobre-atmosfera-deriva-b"
          fill="rgba(120, 214, 245, 0.035)"
          stroke="rgba(120, 214, 245, 0.10)"
          strokeWidth="1"
        >
          <rect x="1020" y="-30" width="164" height="164" rx="28" vectorEffect="non-scaling-stroke" />
          <rect x="300" y="238" width="132" height="132" rx="28" vectorEffect="non-scaling-stroke" />
          <rect x="792" y="12" width="96" height="96" rx="28" vectorEffect="non-scaling-stroke" />
        </g>
      </svg>
    </div>
  );
}
