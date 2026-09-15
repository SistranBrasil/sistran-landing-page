'use client';

import { animate, motion, useInView, useMotionValue, useTransform } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { easeExpo, useReducedMotion } from '@/lib/motion';
import { useRouteLoadGate } from '@/components/loading/RouteLoadGate';

type Props = {
  /** Valor final, como está escrito no conteúdo ("10", "1"…). */
  value: string;
  className?: string;
  /** Duração da contagem em segundos. */
  duration?: number;
  /**
   * Texto anunciado por leitor de tela. Padrão: `value`. Passe a frase completa
   * quando houver sufixo ao lado ("40+"), senão a unidade não é lida.
   * `null` desliga o `.sr-only` daqui — use quando quem chama já tem o seu.
   */
  srText?: string | null;
};

/**
 * Contagem de 0 até o valor, disparada quando o número entra na tela.
 *
 * `useInView` sem `once` de propósito: ao sair e voltar, a contagem zera e roda
 * de novo. Sem o `count.set(0)` na saída, o número voltaria já cheio e a
 * segunda passagem não teria efeito.
 *
 * O texto animado vive num MotionValue, não em estado React: a cada frame o
 * Motion escreve direto no nó, sem re-render da lista de métricas — que é a
 * diferença em relação ao `useCountUp` com `useState` por frame.
 *
 * O valor lido por leitor de tela é o final, sempre, num `.sr-only`. A parte
 * que anima é `aria-hidden` — números correndo em região viva seriam anunciados
 * dezenas de vezes.
 *
 * SIS-143 — O SERVIDOR AGORA MANDA O VALOR FINAL, e não `0`. O MotionValue nasce
 * em `target`, e quem zera é o efeito, imediatamente antes de animar. Antes disso
 * o HTML servido trazia `0` no número visível (o valor final só existia no
 * `.sr-only`), e era essa a razão registrada em `MetricsBand.tsx` para a faixa de
 * `/contato` não ter contador: sem JavaScript, sete zeros na tela.
 * O que muda em cada estado, para ninguém ter de deduzir:
 *   sem JavaScript          -> o número final, estático. Antes: `0`.
 *   com JavaScript          -> conta 0 -> valor, igual a antes.
 *   movimento reduzido      -> o número final, estático, igual a antes.
 * O CUSTO, medido e assumido: `useEffect` roda DEPOIS da pintura, então um número
 * que já esteja em cena na hidratação pinta um quadro com o valor final antes de
 * cair para 0 e contar. É um quadro (~16ms) mostrando o valor CERTO, não um vazio.
 * Não é `useLayoutEffect` de propósito: este componente é renderizado no servidor
 * e `useLayoutEffect` avisa em SSR. Quem está fora de cena não pisca — o efeito
 * zera antes de o número entrar.
 * A LISTA DE "QUATRO TELAS A MAIS" QUE ESTAVA AQUI ESTÁ ERRADA, e fica registrada
 * para ninguém repetir a conta: ela dizia `About.tsx`, `Metrics.tsx`,
 * `ui/CompanySignature.tsx` e `legacy/MetricsStrip.tsx`, "conferido com
 * `grep -rn "CountUp" src`" — e é justamente o grep que engana, porque conta
 * MENÇÃO, não import. Medido com `grep -rn "primitives/CountUp" src`, quem importa
 * este arquivo são DOIS: `MetricsBand.tsx` (esta faixa) e `legacy/MetricsStrip.tsx`.
 * As outras três definem contador PRÓPRIO, local: `About.tsx:49` (`CountUpNumber`),
 * `ui/CompanySignature.tsx:33` (um `CountUp` homônimo) e `Metrics.tsx:182`, que
 * escreve explicitamente que o `CountUp` do projeto não serve lá.
 * E `legacy/MetricsStrip` não está montado: o mount está comentado em
 * `app/page.tsx:257`. Ou seja, o raio de alcance real deste primitivo hoje é
 * `/contato`. O que a nota dizia do MÉRITO continua valendo onde há consumidor: a
 * mudança só melhora o estado sem JavaScript, e com JavaScript ligado a contagem é
 * a de antes, byte por byte.
 *
 * SIS-256 (3ª volta) — A CONTAGEM SÓ COMEÇA COM A PÁGINA CARREGADA. A tabela de
 * estados acima ganha uma linha, e as outras três continuam valendo:
 *   página ainda carregando -> o número final, estático. Conta quando terminar.
 * O raciocínio inteiro (as duas condições, e por que `null` fora do portão não é
 * caso de erro) está no comentário do hook, dentro do componente.
 *
 * Valor não numérico ("1,5 mil") volta como texto, sem contagem.
 */
export function CountUp({ value, className, duration = 1.4, srText }: Props) {
  const target = Number(value);
  const ref = useRef<HTMLSpanElement>(null);
  // `amount: 0.6` para a contagem começar com o número claramente em cena, não
  // ao encostar a primeira linha de pixels na borda.
  const inView = useInView(ref, { amount: 0.6 });
  const reduced = useReducedMotion();
  /* Nasce no valor final para o HTML do servidor já trazer o número (ver a nota
     acima). `NaN` não chega aqui: o caminho não numérico devolve texto antes de
     usar o MotionValue. */
  const count = useMotionValue(Number.isNaN(target) ? 0 : target);
  const text = useTransform(count, (current) => Math.round(current).toString());

  /* ── SIS-256 (3ª volta) · A CONTAGEM ESPERA A PÁGINA TERMINAR DE CARREGAR ───
     Pedido literal da autora do escopo: «os numeros so devem fazer a contagem
     quando terminar de carregar a pagina». Ela reprovou um comportamento real: em
     `/contato` os sete indicadores ficam no ALTO da rota, então eles já estão em
     quadro enquanto imagens, fontes e o mapa ainda chegam — a contagem corria por
     baixo do véu do `RouteLoadGate` e terminava antes de a página aparecer. Quem
     abria a rota via o número parado no valor final e nunca a contagem.

     SÃO DUAS CONDIÇÕES, e nenhuma das duas basta sozinha:
       1. `window.load` — o fim do carregamento no sentido do navegador.
       2. o portão da rota liberado, quando existe um. `/contato` é coberto pelo
          `RouteLoadGate`, e ele solta o véu por conta própria (mapa pronto, ou
          tempo esgotado); esse instante pode ser DEPOIS do `load`, e é ele que a
          pessoa percebe como "a página carregou".
     `useRouteLoadGate()` devolve `null` fora do portão, e aí a condição 2 não se
     aplica — é o que faz este hook ser seguro fora de `/contato` sem depender de
     nada novo. O OUTRO CONSUMIDOR é um só, `legacy/MetricsStrip.tsx` (medido com
     `grep -rn "primitives/CountUp" src`; a lista de quatro telas que este arquivo
     afirmava está corrigida no docblock acima), e ele nem está montado hoje — o
     mount está comentado em `app/page.tsx:257`. Se voltar, o efeito prático é quase
     nenhum: aquele contador fica no meio da home, e o `load` acontece muito antes de
     ele entrar em quadro.

     O ESTADO NASCE `false` NO SERVIDOR E NO PRIMEIRO RENDER, de propósito: é a
     regra de hidratação da casa. A árvore não muda com ele — o que muda é só o
     momento de animar —, então não há divergência de marcação; e o número servido
     continua sendo o VALOR FINAL, que é o que fica na tela enquanto se espera.
     Nada de zeros durante o carregamento. */
  const portao = useRouteLoadGate();
  const [paginaCarregada, setPaginaCarregada] = useState(false);

  useEffect(() => {
    /* `requestAnimationFrame` e não `setPaginaCarregada(true)` direto: escrito
       direto, isto é `setState` SÍNCRONO dentro de efeito, e o `react-hooks` do
       projeto avisa («Calling setState synchronously within an effect can trigger
       cascading renders») — o portão de lint desta casa é 0 erro e a contagem de
       avisos que já existia, então um aviso novo é regressão, mesmo sendo o mesmo
       padrão de dez outros arquivos do repositório. Um quadro de atraso não custa
       nada aqui: o que está na tela nesse quadro é o número no VALOR FINAL, e a
       contagem só existe depois. O `cancel` no desmonte evita escrever estado em
       componente que já saiu. */
    if (document.readyState === 'complete') {
      const quadro = requestAnimationFrame(() => setPaginaCarregada(true));
      return () => cancelAnimationFrame(quadro);
    }
    const aoCarregar = () => setPaginaCarregada(true);
    window.addEventListener('load', aoCarregar);
    return () => window.removeEventListener('load', aoCarregar);
  }, []);

  const pronto = paginaCarregada && (portao === null || portao.liberado);

  useEffect(() => {
    if (Number.isNaN(target)) return;

    /* A contagem é a informação em si, mas sob movimento reduzido o número
       aparece pronto — o conteúdo continua acessível sem movimento. */
    if (reduced) {
      count.set(target);
      return;
    }

    /* ANTES do teste de `inView`, e a ordem é o que impede o defeito: fosse depois,
       um número já em quadro cairia para `0` e ficaria zerado esperando o
       carregamento — sete zeros sob o véu, que é o estado que `MetricsBand.tsx`
       registra como inaceitável para esta faixa. Saindo aqui, o MotionValue fica no
       valor final (é onde ele nasce) até haver com o que contar. */
    if (!pronto) return;

    if (!inView) {
      count.set(0);
      return;
    }

    /* O `0` explícito é o que faz a contagem existir: como o valor nasce em
       `target`, animar "de onde está até target" não animaria nada. */
    const controls = animate(count, [0, target], { duration, ease: easeExpo });
    return () => controls.stop();
  }, [count, duration, inView, pronto, reduced, target]);

  if (Number.isNaN(target)) {
    return <span className={className}>{value}</span>;
  }

  return (
    <span ref={ref} className={className}>
      {srText === null ? null : <span className="sr-only">{srText ?? value}</span>}
      {/* Largura reservada pelo número final: contando 0 → 10 o texto passa de
          um para dois dígitos, e sem a reserva a unidade ao lado escorregaria
          durante a contagem. */}
      <motion.span
        aria-hidden="true"
        style={{ display: 'inline-block', minWidth: `${value.length}ch` }}
      >
        {text}
      </motion.span>
    </span>
  );
}
