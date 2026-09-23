/**
 * SIS-280 — OS DOIS GRAFISMOS TÉCNICOS DO CORPO DAS SLUGS DE `/solucoes`.
 *
 * Nasceram dentro de `MatchAiPagina.tsx` na 3ª volta da SIS-292 e SOBEM PARA
 * AQUI porque a SIS-280 manda alinhar `/solucoes/fast` à mesma arquitetura — e a
 * arquitetura inclui estes dois. A alternativa era copiar ~40 linhas de markup
 * SVG para o segundo corpo de slug, que é a classe de defeito em que a primeira
 * correção do caminho conserta metade das rotas.
 *
 * É o mesmo movimento, e pela mesma razão, que `./reveal-calibre.ts` já registra:
 * «o arquivo é da PASTA e não do arquivo».
 *
 * O CSS NÃO MUDOU DE LUGAR nem de nome: as classes `.matchai-acentos`,
 * `.matchai-grade` e `.matchai-circuito*` continuam no bloco SIS-292 do
 * `globals.css`, com todas as justificativas (as duas referências mandadas, por
 * que a trilha é dinâmica aqui e estática na University, os dois canais de
 * movimento reduzido). Nenhum seletor é escopado por rota — são classes simples
 * —, então a segunda slug as usa sem uma linha de CSS nova. O prefixo `matchai-`
 * fica como ele está: renomear para `solucoes-` tocaria ~60 regras de um arquivo
 * de 28 mil linhas para não mudar um pixel, e essa troca não é desta issue.
 *
 * A razão de cada escolha de desenho (viewBox fixo em vez do `slice` do Unidep,
 * `pathLength="1"`, ausência de `<defs>`/`id`) está nos comentários de cada
 * função, vindos inteiros da SIS-292.
 */

/* `aria-hidden` porque é grafismo puro: sem ele o leitor de tela anuncia um nó
   vazio antes do conteúdo da seção. */
export function AcentosClaros() {
  return <span aria-hidden className="matchai-acentos" />;
}

/* O CIRCUITO. `viewBox` FIXO e `preserveAspectRatio` no padrão (`meet`), ao
   contrário do Unidep, que usa `slice` com o `viewBox` na ALTURA MEDIDA da seção.
   A razão de divergir: com `slice` a arte depende da altura da caixa, e aqui são
   várias caixas de alturas diferentes que ainda vão mudar de altura ao mudar
   copy — seria um número medido a recalibrar por seção, e a nota do Unidep conta
   que na 1ª volta dele esse acoplamento jogou os grafismos das pontas fora da
   tela. Como CANTO de tamanho próprio (o CSS dá a largura e `aspect-ratio: 1`),
   o quadrado continua quadrado em qualquer largura e nada depende de medição.
 *
 * SEM `<defs>`, SEM `id`, SEM `<linearGradient>`: o circuito do Unidep é UM por
 * rota, e este é montado quatro vezes na mesma página — quatro `id="…"` iguais no
 * documento é `id` duplicado, e o `url(#…)` de cada instância passaria a apontar
 * para a primeira. As pontas somem por `mask-image` no CSS, que é por elemento e
 * não por documento. */
export function CircuitoCanto({ className }: { className: string }) {
  return (
    <svg aria-hidden className={`matchai-circuito ${className}`} viewBox="0 0 320 320">
      {/* O caminho é o da 2ª referência: sai do quadrado aceso, corre na
          horizontal, faz o cotovelo arredondado e desce. `pathLength="1"`
          normaliza o comprimento, e é isso que deixa o `stroke-dasharray` do
          traço em movimento ser escrito em FRAÇÃO no CSS — sem ele, cada
          caminho exigiria o seu próprio comprimento em px. */}
      <path className="matchai-circuito-linha" pathLength="1" d="M 46 40 H 214 Q 240 40 240 66 V 300" />
      <path className="matchai-circuito-linha" pathLength="1" d="M 320 148 H 118 Q 92 148 92 174 V 320" />
      {/* O MESMO `d` das duas linhas, por cima: é o traço que corre. Dois nós e
          não um, porque um `stroke` não pode ter dois `dasharray` ao mesmo tempo
          — e repetir o `d` numa variável não daria para fazer, já que este é
          markup e não haveria onde guardá-la sem inventar um terceiro conceito. */}
      <path className="matchai-circuito-pulso" pathLength="1" d="M 46 40 H 214 Q 240 40 240 66 V 300" />
      <path
        className="matchai-circuito-pulso matchai-circuito-pulso--2"
        pathLength="1"
        d="M 320 148 H 118 Q 92 148 92 174 V 320"
      />
      {/* O quadradinho ACESO (um por instância, como na referência: o aceso é
          evento, o pálido é textura) e dois pálidos. O halo e a pulsação moram no
          CSS — `filter` inline, como o Unidep faz, não daria onde desligar o
          brilho no movimento reduzido. */}
      <rect className="matchai-circuito-aceso" x="26" y="20" width="40" height="40" rx="9" />
      <rect className="matchai-circuito-palido" x="222" y="130" width="44" height="44" rx="10" />
      <rect className="matchai-circuito-palido" x="60" y="238" width="30" height="30" rx="7" />
    </svg>
  );
}
