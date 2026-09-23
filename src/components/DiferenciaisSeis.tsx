import ScrollReveal from '@/components/ui/ScrollReveal';
import TituloAceso from '@/components/ui/TituloAceso';
import { DIFERENCIAIS_6 } from '@/data/aSistran';
import { getIcon } from '@/lib/icons';
import './diferenciais-seis.css';

/**
 * Diferenciais de `/quem-somos` — os seis itens, só título, como no site.
 *
 * 23/09, a pedido, três coisas mudaram de uma vez, e por isso a seção saiu de
 * dentro de `quem-somos/page.tsx` (onde era JSX solto) para cá: ela passou a ter
 * fundo próprio, e fundo próprio com grade e emenda medida não cabe em cinco
 * linhas inline no meio de uma página de 800.
 *
 *   1. «deve ser colocado os ícones em cada cards» — cada item traz o seu, vindo
 *      do dado (`DIFERENCIAIS_6`) e resolvido pelo registro fechado
 *      `src/lib/icons.ts`. O selo redondo fica à ESQUERDA da frase, como o mock.
 *   2. «as pontas deve ser arredondas com sombra atras» — `border-radius` e
 *      `box-shadow` em `.dif-cartao`; o chanfro `.notch-card` saiu (o porquê, e
 *      por que os dois não convivem, está em `diferenciais-seis.css`).
 *   3. «o fundo que a parte tecnologia exatamente igual para para ser
 *      continuação» — o fundo está no CSS, com a nota de por que «continuação»
 *      não é «mesma declaração» num degradê vertical.
 *
 * O QUE SAIU DO CARTÃO ANTIGO, e por quê:
 *   · `glass-card` — vidro ESCURO (degradê navy, `backdrop-filter: blur(22px)`,
 *     quatro camadas de sombra). Existe para viver sobre fundo escuro; sobre o
 *     azul-gelo desta seção ele viraria um bloco marinho no meio do claro, o
 *     oposto do mock. A casa já tem o precedente de reskin claro
 *     (`.carreira-cartao .glass-card`), mas aqui o cartão é desenhado do zero
 *     porque nada do vidro escuro sobrou de útil: nem o degradê, nem o blur, nem
 *     o anel do `::before`.
 *   · `notch-card` — ver item 2.
 *   · `barra-sinal` — a barra de sinal aparece no topo do cartão em hover, com
 *     canto reto; num cartão de 20px de raio ela cruzaria a curva e vazaria pelos
 *     dois cantos. Sai porque o raio entrou, e não por desgosto: a regra continua
 *     inteira em `globals.css`, em uso onde o canto é reto.
 *
 * Acessibilidade: a lista continua `<ul>/<li>` com o mesmo `aria-labelledby` e o
 * mesmo `id` do título, e o ícone é `aria-hidden` — ele repete o que a frase já
 * diz, e anunciado viraria ruído antes de cada item. A entrada em cascata segue
 * por `ScrollReveal` (`whileInView` com `once`, estado final visível), igual ao
 * resto da página.
 */
export default function DiferenciaisSeis() {
  return (
    <section aria-labelledby="diferenciais-6" className="dif-secao section-py">
      {/* Decorativa: fora do fluxo e sem nome acessível. */}
      <div className="dif-grade" aria-hidden />

      <div className="container-lp dif-miolo">
        <TituloAceso
          id="diferenciais-6"
          texto="Diferenciais"
          className="font-display text-section text-ink"
        />
        <ul className="dif-grade-cartoes">
          {DIFERENCIAIS_6.map((d, i) => {
            const Icone = getIcon(d.icon);
            return (
              /* `key` pelo texto, e não pelo índice: a lista é a chave do dado, e
                 reordená-la não deve reaproveitar o estado de animação do vizinho.
                 (Era `key={d}` quando o item era a própria string.) */
              /* `cortina={false}`: a revelação por `clip-path` recorta também a
                 sombra projetada, e o estado final `inset(0%)` continua recortando
                 na borda da caixa. Medido: com a cortina ligada o `box-shadow`
                 deste cartão não aparecia em nenhum pixel, com o CSS intacto no
                 computado. A entrada continua — opacidade, deslocamento e escala. */
              <ScrollReveal
                as="li"
                indice={i}
                key={d.texto}
                cortina={false}
                className="dif-cartao"
              >
                <span className="dif-selo">
                  <Icone aria-hidden strokeWidth={1.75} />
                </span>
                <p className="dif-frase">{d.texto}</p>
              </ScrollReveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
