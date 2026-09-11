/**
 * Mapa dos escritorios do Brasil que a secao mostra: Pato Branco (PR) e Sao
 * Paulo (SP). O Rio de Janeiro saiu da cena por ora — continua no rodape e na
 * pagina de contato, que sao as suas outras aparicoes no site.
 *
 * Portado de `mapa-conexoes-latam-final.html`, que troca o Brasil isolado pela
 * America do Sul inteira ao fundo. Veio só o mapa: a pagina original tinha
 * barra de marca, titulo proprio, rodape e um cartao de status — nada disso
 * entra, porque a pagina ja tem cabecalho, rodape e titulo, e aquele texto nao é
 * escrita do site.
 *
 * Sem `use client`: é SVG estatico com animacao em CSS, entao nao custa
 * JavaScript nenhum. As classes e os ids levam prefixo `bm-` porque os originais
 * (`.card`, `.map`, `.label`, `.ring`, `.core`) colidiriam com o CSS global.
 *
 * As coordenadas e os nomes das cidades sao os do arquivo entregue.
 */

/* Silhueta da America do Sul inteira, atras do Brasil: serve de contexto
   geografico. Entra em tres camadas (aura difusa, contorno preenchido e as
   divisas internas), todas discretas para nao competir com o pais em destaque. */
const SOUTH_AMERICA_PATH =
  'M148.55 882.268L153.293 891.819L159.514 907.481L175.671 920.235L193.08 925.572L187.486 936.417L175.671 937.487L169.36 929.842L165.243 938.632L154.591 945.423L148.46 944.715L141.12 942.93L132.08 936.38L119.056 933.215L103.393 921.177L90.727 909.767L73.586 886.404L83.835 890.733L101.289 904.668L117.803 912.238L124.203 902.572L128.231 888.322L139.688 879.845ZM275.428 558.489L274.577 566.321L290.376 579.297L288.675 589.859L296.417 596.56L295.791 604.14L283.842 624.23L265.403 632.747L240.475 636.069L226.825 634.475L229.465 644.022L226.914 656.127L229.197 664.364L221.723 670.15L209.012 672.44L197.063 666.419L192.23 670.736L193.975 687.243L202.389 692.3L209.191 687.017L212.861 695.751L201.449 700.992L191.469 711.583L189.634 728.987L186.68 738.352L174.955 738.412L165.198 747.445L161.618 760.846L173.836 774.123L185.74 777.804L181.444 794.401L166.764 804.958L158.709 827.281L147.341 834.951L142.284 844.081L146.267 864.723L154.547 876.428L149.31 875.395L138.256 875.257L132.259 880.26L121.07 887.659L119.056 907.124L113.775 907.624L99.767 900.801L85.536 886.334L70.051 874.638L66.157 861.872L69.693 850.218L63.427 837.159L61.816 804.512L67.142 786.583L80.255 772.396L61.368 767.11L73.228 751.239L77.435 722.048L91.264 728.161L97.753 692.699L89.429 688.236L85.536 709.381L77.704 706.981L81.597 682.86L85.849 652.389L91.533 641.356L87.952 625.81L86.968 608.094L92.204 607.592L99.812 582.678L108.405 558.489L113.686 536.343L110.822 514.462L114.536 502.568L113.015 484.923L120.31 467.701L122.547 440.784L126.53 412.372L130.424 382.281L129.529 360.547L126.933 342.026L114.447 334.501L113.373 329.16L88.713 316.122L66.426 301.994L56.848 294.045L51.701 283.451L53.76 279.77L43.198 263.042L30.935 239.652L19.21 214.55L14.108 208.832L10.214 199.598L.547 191.418L-8.314 186.358L-4.286 180.773L-10.283 168.878L-6.434 160.141L3.456 152.276L10.08 142.963L7.395 137.529L2.651 143.321L-4.778 137.866L-2.272 134.35L-4.376 123.068L-.034 121.195L2.293 113.451L6.992 105.434L6.097 100.363L12.944 97.712L21.448 92.745L19.792 88.893L24.401 87.967L23.864 81.735L26.773 77.228L32.949 76.385L38.186 68.568L42.93 62.033L38.365 59.059L40.692 51.82L37.917 40.412L40.558 37.135L38.588 26.551L33.576 19.873L35.187 13.783L39.17 14.696L41.497 10.958L38.633 3.56L40.155 1.729L46.555 2.113L55.908-6.664L61.01-8.008L61.145-12.169L63.427-22.859L70.543-28.729L78.375-28.965L79.36-31.603L89.116-30.552L98.872-36.95L103.751-39.788L109.748-45.923L114.134-45.148L117.401-41.789L114.984-37.509L114.626-34.523L107.331-33.041L111.404-27.293L111.269-20.676L105.764-13.322L110.464-3.339L115.834-4.149L118.609-13.258L114.76-17.703L114.134-27.271L129.618-32.44L127.918-38.412L132.259-42.413L136.734-33.492L145.461-33.299L153.517-26.221L154.01-22.045L165.153-21.917L178.445-23.223L185.561-17.575L195.094-15.993L202.031-19.948L202.21-23.137L217.605-23.886L232.508-24.079L221.946-20.333L226.198-14.369L236.134-13.429L245.532-7.219L247.546 2.857L253.99 2.581L258.869 5.538L267.059 10.151L274.712 18.325L275.07 24.771L279.769 25.067L286.437 31.189L291.315 35.527L306.219 38.044L307.561 35.781L317.631 34.871L330.968 38.234L324.523 48.97L325.508 57.497L330.386 64.9L328.193 70.254L327.119 75.943L323.941 81.166L329.357 83.735L333.205 80.366L335.98 80.892L337.681 84.388L343.633 83.503L348.422 78.786L352.226 69.601L359.566 58.215L363.817 57.624L366.905 64.521L373.842 86.283L380.511 88.325L380.824 96.912L371.515 107.16L375.364 110.905L397.338 112.841L397.786 125.32L407.229 117.155L422.848 121.616L443.525 129.213L449.566 136.497L447.552 143.384L462.008 139.551L486.175 146.144L504.748 145.659L523.142 155.965L539.03 169.934L548.607 173.524L559.214 174.031L563.734 177.962L567.941 193.875L570 201.465L565.077 222.234L558.722 230.443L541.223 248.025L533.302 262.374L524.082 273.435L520.994 273.673L517.503 283.083L518.398 307.169L514.952 327.133L513.61 335.739L509.671 340.896L507.478 358.469L494.858 375.761L492.754 389.549L482.685 395.365L479.775 403.46L466.26 403.414L446.702 408.609L437.975 414.647L424.056 418.63L409.422 429.497L398.905 443.145L397.07 453.491L399.128 461.183L396.846 475.368L394.026 482.283L385.299 490.098L371.515 515.394L360.595 526.929L352.136 533.803L346.453 547.859L338.263 556.361L332.847 565.811L318.839 574.203L309.665 571.178L302.907 572.792L291.45 566.321L282.991 566.806Z';

/* Divisas entre os paises vizinhos: linhas soltas, sem preenchimento. */
const SOUTH_AMERICA_BORDERS =
  'M40.16 -0.30L38.65 1.62L41.53 9.34L39.19 13.24L35.18 12.30L33.59 18.68M115.01 -41.04L107.03 -38.84L103.87 -32.28L99.06 -28.52L95.45 -23.64L93.93 -14.29L90.48 -6.61L96.90 -5.74L98.49 0.29L101.24 3.18L102.22 8.46L100.74 13.32L101.18 16.05L104.24 17.15L107.20 21.72L123.18 20.46L130.40 22.13L139.15 33.42L144.18 32.02L153.13 32.72L160.22 31.22L164.61 33.48L162.37 40.54L159.60 44.95L158.63 54.35L161.13 63.07L164.66 66.97L165.09 69.90L158.79 76.43L163.30 79.32L166.60 83.91L170.39 96.99L170.39 96.99M64.77 115.42L66.51 125.38L62.64 133.91L49.08 147.65L34.13 152.82L26.52 164.23L24.16 173.08L17.14 178.48L11.92 171.85L6.90 170.44L1.76 171.48L1.42 166.67L4.97 163.55L3.50 158.09M169.36 833.50L161.87 833.15L148.55 833.14L148.54 803.85M148.54 799.42L137.80 797.37L107.76 795.62L102.61 787.97L102.85 778.15L94.57 778.99L90.19 774.24L89.11 760.33L98.64 754.56L102.59 746.24L101.14 739.60L107.73 728.41L112.27 711.04L110.94 703.34L116.36 700.85L115.03 695.91L109.27 693.28L113.37 687.78L107.75 682.81L104.85 667.68L109.85 665.01L107.75 649.02L110.67 635.58L113.99 623.88L121.44 619.12L117.66 606.32L117.62 594.27L127.03 585.70L126.74 574.74L133.84 561.94L133.87 549.88L130.64 547.48L124.91 524.84L132.57 511.34L131.40 498.64L135.84 486.72L143.98 474.42L152.75 466.26L149.03 461.11L151.63 456.89L151.23 435.03L164.77 428.56L169.04 414.94L167.53 411.65M275.43 558.21L276.39 549.73L279.09 546.81L278.96 533.75L282.29 520.27L285.39 509.77M322.68 451.05L320.65 462.62L309.38 472.67L299.55 474.78L285.59 472.77L273.05 469.20L285.29 449.27L283.50 443.48L270.70 438.35L255.51 428.66L245.35 426.67L222.50 405.26M258.88 3.68L249.03 11.39L247.94 16.17L252.20 21.04L249.11 23.49L241.46 25.60L241.71 31.66L238.34 35.27L246.74 45.20M136.66 344.02L133.32 350.75L126.93 354.10M291.33 35.08L289.35 46.88L281.80 50.30L282.47 53.40L280.18 60.16L285.69 69.69M330.98 37.92L324.51 49.20L325.49 58.17L330.37 65.95L328.20 71.59M285.69 69.69L289.67 69.71L291.30 77.11L298.89 88.51M328.20 71.59L327.11 77.59L323.93 83.11M132.89 169.81L126.67 162.83L122.95 162.52L130.97 149.18L121.45 143.03L113.99 144.16L109.50 141.89L102.65 145.36L93.40 143.72L86.07 129.96L80.32 126.58L76.35 120.39L68.08 114.18L64.77 115.42L64.77 115.42M64.77 115.42L59.45 112.32L53.35 107.97L49.81 110.06L39.27 108.24L36.24 102.60L33.92 102.81L21.49 95.32M167.53 411.65L167.53 411.65L158.56 413.45L153.69 395.37L147.01 380.65L150.93 367.96L144.41 362.41L142.75 352.94L136.66 344.02M278.67 378.08L278.45 374.04L266.87 367.33L255.33 367.14L233.67 370.96L227.71 382.50L227.39 389.56L222.50 405.26M136.66 344.02L144.50 329.86L139.15 318.84L142.00 314.43L139.77 309.57L144.63 303.01L144.88 291.85L145.49 282.63L148.16 278.19L137.41 257.08M222.50 405.26L222.50 405.26L220.49 402.46L206.31 401.91L201.46 412.47L194.16 402.99L177.89 399.80L167.53 411.65';

/* Cada fronteira como um path proprio. `split` com lookahead preserva o `M` que
   abre cada subcaminho; o `filter` descarta o pedaco vazio antes do primeiro. */
const DIVISAS = SOUTH_AMERICA_BORDERS.split(/(?=M)/).filter((d) => d.length > 1);

const BRAZIL_PATH =
  'M338.263 556.361L334.817 547.934L340.277 540.912L333.116 530.895L323.36 522.802L310.56 513.481L305.95 513.923L293.464 502.763L285.408 504.296L301.967 484.803L316.02 471.101L324.344 465.375L334.817 457.663L335.085 446.563L328.864 438.591L322.688 441.252L325.105 433.305L326.806 425.188L326.806 417.685L322.33 415.222L317.676 417.432L313.066 416.833L311.589 411.591L310.426 399.214L308.098 395.183L299.729 391.546L294.627 394.182L281.514 391.614L282.32 373.488L278.65 366.099L282.544 363.366L281.335 355.835L284.781 350.065L286.974 339.744L284.021 331.63L277.263 327.97L275.92 322.841L277.755 315.333L253.901 314.806L249.112 299.771L252.737 299.553L252.603 294.001L250.142 290.263L249.605 282.845L242.399 279.056L234.567 279.186L229.42 275.466L221.007 272.939L216.128 268.191L202.21 266.079L188.694 254.699L189.723 246.204L188.202 241.343L189.5 231.873L173.254 234.009L166.675 238.754L155.8 243.869L153.025 247.704L146.625 247.982L137.406 246.911L130.379 249.097L124.74 247.639L125.546 228.437L115.342 235.868L104.377 235.547L99.678 228.821L91.443 228.096L94.084 222.681L87.147 215.039L82 203.736L85.267 201.444L85.267 196.143L92.786 192.519L91.533 185.765L94.71 181.408L95.605 175.595L109.837 167.104L119.996 164.698L121.652 162.82L132.886 163.411L138.48 129.277L138.748 123.889L136.824 116.755L131.319 112.231L131.364 103.183L138.346 101.142L140.852 102.425L141.255 97.67L134.004 96.386L133.825 88.598L158.037 88.872L162.155 84.598L165.601 88.535L168.062 95.881L170.39 94.345L177.237 100.91L186.904 100.111L189.321 96.302L198.54 93.397L203.687 91.356L205.119 86.093L213.98 82.556L213.309 79.945L202.792 78.871L201.046 71.034L201.583 62.686L195.989 59.459L198.316 58.299L207.536 59.902L217.426 63.024L221.007 60.071L229.957 58.13L243.831 53.467L248.396 48.716L246.74 45.189L253.23 44.639L256.094 47.512L254.483 52.981L258.779 54.881L261.599 60.662L258.153 65.069L256.183 75.648L259.361 81.945L260.256 87.714L267.909 93.545L274.04 94.155L275.383 91.714L279.321 91.187L284.96 88.998L288.988 85.693L295.88 86.746L298.879 86.304L305.637 87.314L306.756 84.788L304.697 82.303L305.95 78.702L310.963 79.818L316.825 78.534L323.941 81.166L329.357 83.735L333.205 80.366L335.98 80.892L337.681 84.388L343.633 83.503L348.422 78.786L352.226 69.601L359.566 58.215L363.817 57.624L366.905 64.521L373.842 86.283L380.511 88.325L380.824 96.912L371.515 107.16L375.364 110.905L397.338 112.841L397.786 125.32L407.229 117.155L422.848 121.616L443.525 129.213L449.566 136.497L447.552 143.384L462.008 139.551L486.175 146.144L504.748 145.659L523.142 155.965L539.03 169.934L548.607 173.524L559.214 174.031L563.734 177.962L567.941 193.875L570 201.465L565.077 222.234L558.722 230.443L541.223 248.025L533.302 262.374L524.082 273.435L520.994 273.673L517.503 283.083L518.398 307.169L514.952 327.133L513.61 335.739L509.671 340.896L507.478 358.469L494.858 375.761L492.754 389.549L482.685 395.365L479.775 403.46L466.26 403.414L446.702 408.609L437.975 414.647L424.056 418.63L409.422 429.497L398.905 443.145L397.07 453.491L399.128 461.183L396.846 475.368L394.026 482.283L385.299 490.098L371.515 515.394L360.595 526.929L352.136 533.803L346.453 547.859Z';

/* SIS-161 — DIVISAS INTERNAS DOS ESTADOS, no mesmo `viewBox` e encaixadas na
   silhueta acima. A referencia da issue pede a malha por dentro do pais, e ela
   nao existia: o que havia por dentro eram quatro curvas decorativas de relevo,
   que este path substitui (ver o `.bm-relevo` comentado abaixo).

   PROVENIENCIA, e por que nao é um SVG de mapa colado: gerado por
   `scripts/gerar-divisas-brasil.mjs`, que le a caixa do proprio
   `BRAZIL_PATH` acima e reprojeta os limites das 27 UFs (dataset
   `geodata-br-states`, derivado do IBGE) para dentro dela — encaixe afim de
   eixos separados, caixa contra caixa. Colar outro mapa daria duas projecoes
   diferentes na mesma caixa, e o desencontro apareceria na borda, que é a parte
   que se olha.

   SÓ AS DIVISAS COMPARTILHADAS ENTRAM, nunca a costa: o gerador exige dois
   estados donos da aresta e monta cada par de UFs separadamente. Assim um
   encontro triplo termina a linha, em vez de emendar PR-SP em outro par e formar
   um quase-contorno. O motivo do recorte é medido — o encaixe acerta o eixo x
   quase exato (escala 12,45 contra 12,42 derivada dos dois pinos) mas a silhueta
   desenhada a mao é ~5% comprimida na vertical (13,11 contra 13,81), entao
   tracar o litoral do dataset poria uma SEGUNDA linha de costa alguns pixels por
   dentro do pais. Ficaram 95 polilinhas / 644 pontos, todas abertas.

   Entra RECORTADA por `clipPath#bm-recorte` (a propria silhueta), entao
   qualquer sobra do encaixe nas bordas é invisivel. Traco fino e claro, sem
   preenchimento por estado: é malha, nao mapa coropletico — com peso alto o
   Brasil vira grade. */
const DIVISAS_BRASIL =
  'M84.4 207L99.4 212.8L131.1 216.7L148.5 232.4L171.5 242.5M550.1 251.5L542.6 244.6L530 238.5M527.1 236.1L533.1 229.9L533.8 231.7L536.4 231.3L541.8 235.8M541.8 235.8L543.1 236.8L544.1 235.3L547.3 236.1M547.3 236.1L551.1 234.1M551.1 234.1L554.2 230.7L561.2 229.5M561.2 229.5L565.5 230.7M214.2 84.8L222.6 88.7L221.2 92.7L225.4 99.5L224.8 107.9L228.9 118.1L227.6 122.3L224.9 123.7L231.1 128.7L232.6 132.1L235.8 132.6L237.7 134.5L235.9 130.7L236.9 124L238.4 122.1L242.7 120.3L244.7 121.1L246.8 125.1L249.6 125.2L252.4 123.1L251.2 120.5L255.7 110.3L269.9 110.3M269.9 110.3L270.2 118.3L277.1 128.8L279.1 129.9L280.9 128.3L281.7 132.2L288.6 136.4L291.5 136.3L293.2 138.9L296.9 140.3L296.4 142.2L297.5 142.8L304.8 140.3L300.8 144.2L277.8 198.7L275.1 201.6L279.4 210.2M279.4 210.2L276.3 216.6L277.5 220.4L275.6 227.9L277 228.2L275.9 229.1L236.5 229.1M236.5 229.1L234.9 227.7L232.2 230.2L229.7 229.2L228.9 226.4L227.1 226.7L226.7 223.8L224.7 223.7L220.8 218.5L211.1 218.3L209.1 223L207.1 223L207.4 226.1L204.6 228.4L204.6 231.2L195.9 231.7L192.7 237.5L190.4 235.3L188.3 236L188.5 237.9L186.5 237.2L184.1 239.5L181.9 237.2L176.4 237.1L175.3 240.1L171.5 242.5M379.5 104.6L375.6 105.6L372.3 111.4L365.5 115.3L359.7 124.2L359.5 127.7L354.9 130L350.4 127.4L349.3 121.5L347.8 121.4L347.3 117.9L344.2 115.6L341.2 108.9L342 104.8L338.2 101.6L338 97.5L336.6 97.9L335.3 95.3L332.7 95.4M332.7 95.4L329.8 94.3L327 90.9L321.6 90.5L320 81.9M527.1 236.1L526.5 232.3L523.8 231.5L524.1 229.8L521.8 231.5L520.1 229L514.8 228L512.6 225.7L509.1 227.3L509.1 229.1L506.5 229.5L505.7 232.4L502 232.6L501 236.4L497.4 238.1L495.5 237.7L496.9 233.9L493.7 229.6L491.3 227.9L488.3 228M530 238.5L530.1 243.8L532.2 244.9L533.4 249.3L531.8 250.5L532.4 254L527.6 254.2L527.1 255.3L530.3 260.6M531.3 263.6L534.1 265.5L538.3 263.8M506.2 352.1L502.4 349.6M502.4 349.6L502.4 346.3L497.4 342L498.4 336.5L499.2 335.1L501.7 335.4L501.5 331.7L503.1 330.6M503.1 330.6L507 325.1L503.1 322.4M503.1 322.4L502.3 321L498.2 321L496.5 319.2L488.6 320.2L488.3 317L483.3 312.3M482.8 311.8L479.2 312.9L475.9 311.8L465.7 305.9L461.3 308L459.2 306.9M456.9 305.7L458.1 301.8L456.6 301.3M439.3 308.2L434.8 310.8M433.1 312L429.3 313.7L430.9 310.4L430 308.8M430 308.8L430.5 303M430.5 303L431.6 301.9L427.2 298.6L427 294.7L428.5 292L427.5 289.9L430 287.8L427 288.8L426.4 287.6L427.1 284.4L429.1 283.2M429.1 283.2L426.7 283.6L427 278.8L428.6 277.5L426.1 275.5L425.5 271.7L428.3 269.9L425.8 269.4L426.6 266.2L429.4 266.2L424.2 264.6L422.8 261.8L427 256.8L428.1 253.1L433.7 249.4L433.9 246.9M433.9 246.9L435.9 246.7L438.5 254.5L443.8 257.1L448 253.2L451.2 252.1L453.5 253.3L455.1 250.3L456.4 250.5L459.6 245L459.7 242.8L457.2 239.2L460.7 235.9L462.4 235.3L464.4 237.4L468 237L470.8 239.9L476.4 235.9L482.3 235L488.3 228M539.4 177.1L534.6 178.4L528.5 191L526.3 193.6L524.5 193.6L523.1 197.1M523.1 197.1L522.4 202.9L520.6 205.5L523.4 209.6L521.1 213.8M521.1 213.8L516.5 216.8L516 215.1L508.4 209.8L498.7 209.7M498.7 209.7L500.6 203L496.3 201.3L495.3 199.2L493.7 181.7L489.6 177.6L491.6 168.5L491.2 166.7L489.5 166.7L488.7 159.6M488.7 159.6L487.5 158L489.5 154.3L488.7 152.1M404.9 317L409.5 317M502.4 349.6L498.7 348.4L496.9 350L494.8 349.2L493.9 349.6L495.6 351.8L493.9 351.2L491.4 352.6L490.5 355.6L492.5 355.8L492.1 358.1L493.8 360.5L489.7 361L492.5 362.6L493.4 369.1L490.6 371.7L488 378.5L483.3 378.7L482.3 380.3M482.5 384.7L482.3 380.3M488 391.8L483.8 390.8L483.9 387.5L481.8 386.1M377 280.2L377.1 282.2L383.2 284.7M386.5 286.7L388.9 287.6L390.2 282.7L391.6 281.5L392.1 282.8M392.1 282.8L393.4 283.7L395 281.7L398.1 285L398.3 288.4L399.3 285.9L400.1 288.1L401.7 287.3M403.6 288.2L404.8 287.3L407.8 288.3L409.6 290.4L409.8 287M409.8 286.8L410.3 285.6L412.6 288L414.5 287.7L419.6 285.1M419.6 285.1L421.1 283.8L424.8 283.9L425.3 281.9L425.9 284.1L429.1 283.2M375.2 279.8L378.4 276.7M430 308.8L426.9 309.5L424.2 306.6L424.1 311.3L419 311.2L420.1 314.7L418.7 317.9L420.4 322.1L416 322.8M413.9 326.8L412.6 330.7M415 332.8L416.2 336.7M411.5 342.3L414.7 344.7L413.4 347.6L414.4 350.2M414.4 350.2L406.1 356.4L402.2 354.1L395.4 354.8L393.9 353.8L390.6 355.2L388.3 358.3L386.4 356.3L383.4 358.2L377.1 358.8L373.4 364.7M372.5 364.7L369.8 368.2L370.4 369.3L369.1 369M369.1 369L365.7 366.4M365.7 366.4L357.7 363.5M357.7 363.5L349.2 358.4L344.4 358.2L343.8 356.9L346.3 354.3L342.1 353.9L342.4 350.2M342.4 350.2L340.3 345.3M344 334.8L347.9 330.8L347.2 327.7L349.2 325.4L351.7 324.5L352.6 322.2L357.3 321.3L360.1 312.8L367.2 309.4L368.5 301.2L370.3 298.5L369.8 293.9L373.1 288.4L374.3 282.4M482.6 149.7L482.8 152.7L481 155.6L477.7 158.8L474 159.1L468 169.3L469.7 172.5L468.4 175.3L470.3 181.3L470 183.9L466.6 187.6L466.9 193.2L470 196.9L468.8 201.2L462.7 203.5L459 201.6L454.7 202.5L451.6 207.1L446.8 210.7L445.2 210.3L437.1 214.6L433.4 226.7L430.6 230.8L433.2 238.1L431.2 248.3M431.2 248.3L425.9 247.1L424.1 242.2L422.4 241.4L423.5 238.1L420.9 237.1L417.6 231.6M417.6 231.6L419.2 227.2M419.9 225.7L420.7 223.5L423.7 222.9L424.7 219.6L423.1 217.4L420.9 217.9M420.9 217.9L417.5 219.4L410.7 211.3L411.8 209.4L408.7 208.2L411.3 205.7L412.9 198.8L411.8 186.2L406.4 182.5L401.1 181.5L396.2 183.9M396.2 183.9L408.2 173.9L409.8 174.1L415.6 165.9M419.7 157.4L422.6 151.4M423.2 150.9L422.1 149.3L425.3 146.9L425.2 143.1L427.1 142L427.9 137.8L426.5 136.9L428.6 135.8L429.2 129.5M481.8 386.1L480.6 388.3L478.4 388.8L479.3 389.6L475.7 397.3L477 398.5L472.7 400.4M472.7 400.4L466.1 403.7L466.2 402.6L463.5 402.3L454.3 404.6M451.8 405.4L445.3 407.6M368.2 377.1L367.7 372.5L369.1 369M305.8 339.6L304.6 338.9L298 341M305.8 339.6L310.5 341.3M311.2 341.9L315.3 344.5M324.9 343.4L326.7 345.4L329.9 344.8L334.6 339.7L334.6 345.4L331.4 348.1L332.8 348.9M332.8 348.9L342.4 350.2M284.2 344.1L287.8 348.5L290 347.4M290 347.4L293 346.3L295.7 341.8L298 341M359.7 388.8L357.3 390.9L357.5 392.4M348.1 240.7L296.5 237.1L295.8 235L293.2 234.7L291 230.7L286.2 228.6L285.5 221.4L279.4 210.2M351.3 241L377.9 242.8M377.9 242.8L373.2 253.6L371.4 264L373 276.8L371.9 279.2L374.3 282.4M248.2 292L251.4 290.2L251.7 288.2M252.7 285.5L255.1 283L255.3 279.2L259 275.6L254.8 269L254.8 265.7L257.2 263.2L256.5 259.6L251.4 259.3L250.6 257.9L236.9 257.8L238 250.4L236.3 247M236.3 247L237.4 243.5L236.6 241.2L237.8 240L235.9 235.2L237.1 235M237.2 235L237.9 230.7L236.5 229.1M396.2 183.9L400.8 184.5L403.9 187.2L401.9 189.2L402.7 191.7L400.2 194.8L400.8 197.4L399.2 197.1L397.4 201L390.5 204.6L390.9 208.4L388.4 212.1L391.3 216.1L390.4 221.4L385.8 229.7L380.2 235.6L377.9 242.8M269.9 110.3L269.9 97.7M561.9 198.8L551.9 198.2L551.2 196.1L550.1 196.3L548.4 198.4L549.6 200.7L548.5 200.3L548.7 203.1L546.1 205.3L544.6 202L539.6 203.3L539 201.5L536.5 201.8L537.8 197L540.5 194.7L540 192.9L533.3 194.9L528.6 199.3L526.2 198.9M561.9 198.8L565.3 199.8L567.8 198.9M569.5 212.8L564.4 210.5L561.2 211.5L561 214L558.8 214.7M556.3 215.8L549.7 216.3L549.5 217.6L547.3 218.1L547.2 220.1L543.1 222.6L540.5 220.9L539.9 218L538.1 218.4L538.6 217.5M538.6 217.5L540.6 215.8L540.6 213L542.7 211.9L539.6 209.2L529.1 216.5L526.6 216.5L525.6 214.4L522.7 215.5L521.1 213.8M488.3 228L497.8 220.5L498.5 216.9L496.8 215.6L496.3 211.8L498.7 209.7M333 470L337.2 470.5L338.7 469L339.5 470.7L343.1 468.9L343.5 470.7L345.2 470L347.1 471.5L350.4 470.7L355.7 472.2L357.1 474.6L360.4 474.2L367.1 478.7L372.9 486.1L378.7 487.5L383.6 487L384.5 489.1L382.8 490M381.8 490.3L380.8 495M342 410.4L348.5 409.7L353.1 411.1L354.5 409L359.4 411.1L364.9 411L369.8 412.8L371.4 414.9L380.9 414L381.5 415.2M381.5 415.2L384.7 417.5L385.5 420.5M393 436.9L397 437.3';

/* Rota Pato Branco -> Sao Paulo, desenhada duas vezes: o traco de base fica
   sempre visivel, e o de cima é o pulso que corre por ele. O trecho que seguia
   para o Rio saiu junto com a cidade. */
const ROTA = 'M347 448C372 430 394 417 422 411';

const PONTOS = [
  { cidade: 'pr', x: 347, y: 448 },
  { cidade: 'sp', x: 422, y: 411 },
];

export default function BrazilOfficesMap() {
  return (
    <div className="bm-palco">
      {/* SIS-161 (conferencia) — ESTE TEXTO ERA UM `<title>` DENTRO DO SVG, e saiu
          de la por causa de um efeito colateral do proprio elemento: o navegador
          trata `<title>` como tooltip nativa, entao passar o mouse sobre o mapa
          abria a caixinha amarela "Mapa da América do Sul com o Brasil em
          destaque" — ruido que ninguem pediu, sem controle de estilo e fora do
          desenho da referencia.
          O `<title>` NAO foi apagado por cima: ele era metade do nome acessivel do
          mapa (`aria-labelledby="bm-titulo bm-descricao"`), e deletar sem mais
          deixaria o `role="img"` com nome pela metade. O texto mudou de casa, com o
          MESMO `id`, para um `sr-only` — o `aria-labelledby` continua resolvendo,
          o leitor de tela le exatamente a mesma frase e a tooltip deixa de existir,
          porque `aria-labelledby` pode apontar para qualquer elemento do documento.
          O `<desc>` ficou dentro do SVG: `desc` nao gera tooltip. */}
      <span id="bm-titulo" className="sr-only">
        Mapa da América do Sul com o Brasil em destaque
      </span>
      <svg
        className="bm-mapa"
        viewBox="0 0 720 640"
        role="img"
        aria-labelledby="bm-titulo bm-descricao"
      >
        {/* O `<title id="bm-titulo">` vivia aqui e virou o `sr-only` logo acima do
            `<svg>`, para nao abrir tooltip nativa — ver a nota la. */}
        <desc id="bm-descricao">
          Países sul-americanos em azul discreto e o Brasil iluminado, com Pato Branco conectada a
          São Paulo.
        </desc>

        <defs>
          <path id="bm-brasil" d={BRAZIL_PATH} />
          {/* SIS-78: era `#0a1c35 / #0b2548 / #07162a` — ~8% de luminosidade, ou
              seja azul-quase-preto. Foi desenhado quando o mapa era um cartao
              sobre o palco escuro `.bm-palco`; dentro da cena dos escritorios o
              palco saiu (`globals.css`, `.os-mapa .bm-palco`) e o pais passou a
              ser uma silhueta a 8% de luz sobre uma folha a 92% — mancha preta,
              nao mapa.

              Agora é azul da marca: a faixa media de `#0079CB`/`#1479ec`, escura
              o bastante para os quatro tracos claros por cima continuarem
              legiveis (o do pais fica em ~4,9:1 contra o tom central) e clara o
              bastante para ler como azul, e nao como buraco. */}
          <linearGradient id="bm-preenchimento" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#0a4489" />
            <stop offset=".52" stopColor="#135fae" />
            <stop offset="1" stopColor="#073a76" />
          </linearGradient>
          <linearGradient id="bm-traco" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff" />
            <stop offset=".22" stopColor="#bce8ff" />
            <stop offset=".7" stopColor="#3aa9ff" />
            <stop offset="1" stopColor="#fff" />
          </linearGradient>
          <filter id="bm-brilho-pais" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="12" />
          </filter>
          <filter id="bm-brilho-rota" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="bm-desfoque-latam" x="-12%" y="-12%" width="124%" height="124%">
            <feGaussianBlur stdDeviation="2.5" />
          </filter>
          <clipPath id="bm-recorte">
            <use href="#bm-brasil" />
          </clipPath>
        </defs>

        {/* SIS-161 (conferencia) — A CAMERA PASSOU A MORAR AQUI DENTRO, e o motivo
            é geometrico, nao de organizacao. Ela vivia na `transform` de `.bm-mapa`,
            a caixa do SVG: `transform` desenha em outro lugar mas NAO encolhe a
            caixa, e a caixa continuava do tamanho original enquanto o desenho
            saia por fora dela. Em repouso `(1.06 - 0.06 * --os-entrada)` vale
            1,00, entao a escala efetiva é 1,14 em Pato Branco e 1,22 em Sao
            Paulo — ou seja o mapa nascia estourado ja PARADO, nao apenas durante
            o trecho, e o `overflow: clip` da coluna cortava o excedente: era ele
            o mapa recortado da conferencia.
            Dentro do SVG o corte deixa de existir porque quem limita o desenho é
            o viewport do proprio SVG (o `viewBox`), e o grupo se aproxima DENTRO
            dele: a caixa externa nunca cresce, nada invade a coluna de leitura e
            nada é cortado. As porcentagens continuam valendo o mesmo — o
            `transform-box` padrao é `view-box`, entao 3% segue sendo 3% de 720
            unidades, a mesma fracao de antes.
            O grupo é `aria-hidden` porque enquadramento nao é conteudo; o nome
            acessivel do mapa segue no `aria-labelledby` do `<svg>`. */}
        <g aria-hidden="true" className="bm-camera">
        {/* Continente: decoracao, entao fica fora da arvore de acessibilidade. */}
        <g aria-hidden="true">
          <path className="bm-latam-aura" d={SOUTH_AMERICA_PATH} />
          <path
            className="bm-latam-contorno"
            d={SOUTH_AMERICA_PATH}
            filter="url(#bm-desfoque-latam)"
          />
          {/* SIS-96 — as divisas eram UM path com ~20 subcaminhos, e um path só
              nao tem como entrar em cascata: `stroke-dasharray` reinicia em cada
              subcaminho, entao todos se desenhariam ao mesmo tempo. Quebrar a
              string nos `M` da um no por fronteira, cada um com seu indice — e é
              o indice que vira atraso no CSS. O `d` de cada peca é literalmente
              um pedaco da string original; nenhuma coordenada foi redesenhada. */}
          {DIVISAS.map((d, i) => (
            <path
              key={d}
              className="bm-latam-divisas"
              pathLength="1"
              d={d}
              style={{ ['--bm-i' as string]: i }}
            />
          ))}
        </g>

        <use className="bm-pais-brilho" href="#bm-brasil" />
        <use className="bm-pais" href="#bm-brasil" />
        {/* Contorno que se desenha com a rolagem. É `path` e nao `use` porque
            `pathLength` só existe em `path` — e é ele que permite medir o traco
            em fracao de 0 a 1 sem calcular comprimento em JavaScript. Sem a
            rolagem fica desenhado inteiro, entao nao esconde nada. */}
        <path className="bm-pais-contorno" pathLength="1" d={BRAZIL_PATH} />
        {/* Ponta acesa que corre a frente do traco enquanto ele se desenha: é o
            mesmo contorno com um tracejado curto levado pela mesma fracao. Sem a
            rolagem a fracao vale 1 e o CSS apaga a ponta — no estado final nao
            existe desenho em andamento para marcar. */}
        <path
          className="bm-pais-cabeca"
          pathLength="1"
          d={BRAZIL_PATH}
          filter="url(#bm-brilho-rota)"
        />

        {/* SIS-161 — a malha de estados, recortada pela propria silhueta. */}
        <g className="bm-divisas-br" clipPath="url(#bm-recorte)">
          <path d={DIVISAS_BRASIL} />
        </g>

        {/* SIS-161 — as quatro curvas de relevo saem de cena, comentadas.
            MOTIVO: elas eram o SUBSTITUTO decorativo das divisas, no tempo em
            que as divisas nao existiam ("o que existe por dentro sao quatro
            curvas decorativas de relevo" — ponto 3 da issue). Agora as divisas
            de verdade estao ali; manter as duas camadas soma quatro curvas
            atravessando o pais em cima de 65 polilinhas de fronteira e o Brasil
            vira grade, que é exatamente o que a arte de referencia evita.
            As regras `.bm-relevo` continuam no `globals.css` — e a cascata delas
            contra `--os-entrada` tambem — sem consumidor, comentadas la.
        <g className="bm-relevo" clipPath="url(#bm-recorte)">
          <path d="M32 320C190 233 300 285 389 201S616 91 718 127" />
          <path d="M24 391C175 310 298 377 416 286S604 201 728 209" />
          <path d="M42 469C189 393 314 463 437 373S606 313 718 294" />
          <path d="M108 555C249 489 373 539 498 449S633 409 724 391" />
        </g>
        */}

        <g filter="url(#bm-brilho-rota)">
          <path className="bm-rota bm-rota-base" d={ROTA} />
          <path className="bm-rota bm-rota-desenho" pathLength="1" d={ROTA} />
          {/* SIS-161 — O PULSO MORRE (ponto 9 da issue, que pedia a decisao).
              A rota da referencia é PONTILHADA, e o pulso ja era um tracejado
              curto correndo por cima: dois tracejados no mesmo traco leem como
              defeito de renderizacao, nao como fluxo — os dois padroes batem um
              contra o outro e o olho ve a rota piscando em pedacos.
              O pontilhado passou para o `.bm-rota-base` (ver `globals.css`), que
              é o traco que fica sempre visivel; quem ainda corre é so o
              `.bm-rota-desenho`, uma vez, na entrada da secao.
              A classe `.bm-rota-pulso` e o `@keyframes bm-fluxo` continuam no
              `globals.css`, comentados junto com o motivo.
          <path className="bm-rota bm-rota-pulso" pathLength="1" d={ROTA} />
          */}
        </g>

        {/* `pathLength` aqui tambem: a linha de chamada nao aparece de uma vez,
            ela corre do marcador até o rotulo quando a cidade acende. */}
        <g className="bm-chamadas">
          {/* SIS-96 — a chamada de Pato Branco descia (`L152 476`) e entregava o
              rotulo em y=476, exatamente onde mora o painel de fotos da cidade no
              modo de rolagem: a legenda nascia ATRAS do cartao e só a metade
              direita dela aparecia. Agora sobe. Foi a revelacao da legenda que
              tornou isso impossivel de ignorar — animar um texto encoberto é
              gastar movimento em algo que ninguem le. */}
          {/* SIS-161 — a chamada de Pato Branco volta a ser CURTA, ao lado do
              pino, como na referencia (ponto 8). A SIS-96 a mandou atravessar o
              mapa até o topo esquerdo porque em `y=476` o rotulo nascia ATRAS do
              cartao de fotos; a colisao nao pode voltar, e nao volta, porque a
              causa dela deixou de existir: o cartao saiu de cima do mapa e
              passou a morar na COLUNA ESQUERDA da composicao, fora do SVG. Sao
              colunas diferentes — o rotulo esta sobre o mapa, à direita, e o
              cartao à esquerda dele, nao por cima.
              A linha desce à direita, e nao sobe: subindo ela cruzaria a propria
              rota Pato Branco -> Sao Paulo, que sai deste mesmo pino para cima. */}
          {/* SIS-161 — o trecho horizontal foi de H392 para H412 depois da MEDIDA de
              contraste: com o rotulo comecando em x=396, as primeiras letras de
              "PATO BRANCO – PR" caíam sobre o preenchimento navy do proprio pais
              (a sonda leu 1,02:1, tinta #032d67 sobre fundo 23,49,84). Nao era
              artefato de caixa — era texto navy sobre navy. A chamada cresce junto
              com o rotulo para continuar entregando o texto na ponta dela. */}
          <path data-cidade="pr" pathLength="1" d="M352 453L372 469H412" />
          {/* SIS-96 — mesma colisao do lado direito: a chamada terminava em x=690,
              a beira do desenho, e o painel de Sao Paulo cobre desse ponto para a
              direita. Recuada para 596, que é onde o cartao comeca. */}
          <path data-cidade="sp" pathLength="1" d="M432 411H500L532 444H596" />
        </g>

        {PONTOS.map((p) => (
          <g key={p.cidade} data-cidade={p.cidade} transform={`translate(${p.x} ${p.y})`}>
            <circle className="bm-halo" r="21" />
            <circle className="bm-anel" r="10" />
            <circle className="bm-nucleo" r="4" />
            {/* SIS-161 — o ponto 10 pedia para confirmar se a diferenca de forma
                entre os dois pinos da referencia é intencional. DECISAO: é, e
                passa a ser regra em vez de artefato — a unidade ATIVA fica com o
                anel aceso (a triade acima, que ja existia) e a INATIVA com esta
                gota de mapa. Assim as duas se distinguem por FORMA, e nao apenas
                por opacidade: trocar a pilha troca as duas silhuetas.
                A ponta da gota é a origem do grupo, entao ela aponta exatamente
                para a coordenada da cidade — o mesmo ponto que o nucleo marca. */}
            <path
              className="bm-gota"
              d="M0 0C-7 -12 -12 -17 -12 -24A12 12 0 0 1 12 -24C12 -17 7 -12 0 0Z"
            />
          </g>
        ))}

        {/* SIS-161 — os dois rotulos trocaram o separador das coordenadas de `/`
            para `·`, que é o que a referencia mostra. Nao é redacao nova: os
            numeros sao os mesmos, e o `·` ja é o separador do site (é o mesmo de
            `events.ts` e do rotulo do 2º andar da torre). */}
        <g className="bm-rotulo" data-cidade="pr">
          {/* SIS-161 — desceu de volta para o lado do pino, junto com a chamada
              curta; o texto é o mesmo. */}
          <text x="416" y="473">
            PATO BRANCO – PR
          </text>
          <text className="bm-coord" x="416" y="491">
            26.229° S · 52.671° W
          </text>
        </g>
        <g className="bm-rotulo" data-cidade="sp">
          <text textAnchor="end" x="596" y="431">
            SÃO PAULO – SP
          </text>
          <text className="bm-coord" textAnchor="end" x="596" y="454">
            23.550° S · 46.633° W
          </text>
        </g>
        </g>
        {/* ↑ fecha `.bm-camera`. Tudo o que se enquadra fica dentro dela; nada do
            mapa mora fora, senao a peca de fora nao acompanharia a aproximacao. */}
      </svg>
    </div>
  );
}
