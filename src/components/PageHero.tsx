'use client';

import { useRef } from 'react';
import { motion } from 'motion/react';
import clsx from 'clsx';
import { vHeader, vTitle, vSubtitle, vEyebrow, VP, useReducedMotion } from '@/lib/motion';
import { useProgressoDeSecao } from '@/lib/scrollProgress';

type Props = {
  eyebrow?: string;
  /**
   * SIS-277 — ARTE no lugar da tag textual.
   *
   * Quando vem preenchida, ela ENTRA NO LUGAR do `eyebrow`: as duas juntas
   * diriam a mesma coisa duas vezes na mesma linha. Por isso `eyebrow` continua
   * sendo aceito e ignorado nesse caso — a rota que troca a tag por arte não
   * precisa apagar a palavra da chamada para depois não saber mais qual era o
   * texto (o `alt` da arte é quem o carrega agora).
   *
   * Prop opcional, e não troca do tipo de `eyebrow` para `ReactNode`: são
   * quatorze rotas usando este componente com uma string, e alargar o tipo
   * abriria a porta para cada uma inventar uma marcação diferente na mesma
   * posição.
   *
   * O nó da arte NÃO recebe `variants`. Ela traz a própria entrada (a batida do
   * `CarimboBatida`, escrita por quadro pelo GSAP), e valor por quadro
   * disputando `transform` com uma segunda fonte é a colisão do SIS-42 — a
   * mesma razão pela qual a partida cinematográfica vive no wrapper externo e
   * não no `motion.div`. Um dono por nó.
   */
  eyebrowArte?: React.ReactNode;
  title: string;
  highlight?: string;
  description?: React.ReactNode;
  /**
   * SIS-281 — a manchete em PESO REAL, quando a rota pede.
   *
   * Opt-in, pelo mesmo motivo do `cinematografico` e do `eyebrowArte`: são
   * quatorze rotas montando este componente, e engrossar o `h1` aqui dentro sem
   * porta seria uma mudança de quatorze páginas escondida numa de uma — e uma
   * mudança contra a assinatura do projeto, que normalizou o display para 400
   * (SIS-155: 73 pontos de JSX perderam `font-bold`/`font-black`).
   *
   * O peso é REAL, não sintetizado, e isso precisa ser dito porque `html`
   * declara `font-synthesis: none`: pedir um peso sem corte carregado não
   * engrossaria nada. O corte existe — `layout.tsx` carrega a Geist Sans em
   * 400/500/600/700 —, e é a mesma exceção que a SIS-282 abriu para os `h2`
   * desta mesma rota, a pedido e por escrito.
   *
   * Utilitária do Tailwind, e não regra no `globals.css`: nada fixa
   * `font-weight` nestes `h1` fora do reset, então não há especificidade a
   * vencer (o `h1` de `/contato` mora no CSS por esse motivo, não por política).
   */
  tituloForte?: boolean;
  /**
   * Partida cinematográfica: a entrada recua enquanto sai de cena e acende um fio
   * ciano na borda inferior, que a seção seguinte recebe como trilho.
   *
   * Opt-in, e não padrão, pelo mesmo motivo do `motionShowcase` do `ContactCTA`:
   * são quatorze rotas usando este componente, e ligar o efeito em todas seria
   * uma mudança de catorze páginas escondida dentro de uma de uma. O elo de
   * transição também só existe onde a próxima seção sabe RECEBER o fio — ligar
   * onde ninguém recebe deixaria um traço decorativo solto, que é exatamente o
   * que a passagem entre capítulos não deve ser.
   */
  cinematografico?: boolean;
};

/**
 * Escala do título a partir do COMPRIMENTO dele.
 *
 * As quatorze rotas vão de "A Sistran" (9 caracteres) a uma sentença de 118 em
 * `/solucoes`, e `blog/[slug]` passa `post.title`, de tamanho arbitrário. Com um
 * tamanho único a captura de `/solucoes` mostrou a frase em sete linhas,
 * transbordando a janela: um nome curto pede manchete, uma sentença longa pede
 * outra coisa, e tratar as duas igual quebra uma das duas necessariamente.
 *
 * Os cortes saem dos títulos reais, não de números redondos: até 28 caracteres
 * são nomes ("A Sistran", "Eventos & Inovação", "Parceiros e Implementações");
 * até 64 são frases curtas ("Preencha o formulário e fale com a gente!"); acima
 * disso são sentenças inteiras (`/esg`, `/solucoes`, o relatório salarial).
 *
 * Vale notar que o degrau longo (52px a 1440) é MENOR que os 65.6px de antes, e
 * isso não contradiz o objetivo: proporção é a razão entre o título e a tela que
 * ele ocupa, não a contagem de pixels da fonte. A 65.6px numa caixa de 768px
 * aquela sentença dava sete linhas; a 52px na largura do container dá três.
 */
function escalaDoTitulo(comprimento: number) {
  if (comprimento <= 28) return { fonte: 'text-pagehero', medida: 'max-w-[22ch]' };
  if (comprimento <= 64) return { fonte: 'text-pagehero-medio', medida: 'max-w-[30ch]' };
  return { fonte: 'text-pagehero-longo', medida: 'max-w-[46ch]' };
}

export default function PageHero({
  eyebrow,
  eyebrowArte,
  title,
  highlight,
  description,
  tituloForte = false,
  cinematografico = false,
}: Props) {
  const rm = useReducedMotion();
  const secaoRef = useRef<HTMLElement>(null);
  /* `--hp` só existe enquanto o efeito está ligado E a preferência permite. Com
     movimento reduzido a variável nunca é escrita e o CSS cai no repouso do
     `var()`: título inteiro, fio em largura cheia. */
  useProgressoDeSecao(secaoRef, '--hp', cinematografico && !rm, 'saida');
  /* `highlight` conta: ele é renderizado na MESMA linha do título, então o que
     define quantas linhas o bloco ocupa é a soma dos dois. Medir só `title`
     classificaria `/blog` ("Os melhores conteúdos." = 22) como nome curto,
     quando o texto real na tela tem 62 caracteres. */
  const escala = escalaDoTitulo(title.length + (highlight ? highlight.length + 1 : 0));
  return (
    /* `pagehero-entrada` normaliza a ALTURA da entrada; as medidas mostraram a
       mesma seção ocupando de 31% (`/eventos-inovacao`) a 104% (`/sistran-labs`)
       da janela a 1440, só porque a descrição de cada rota tem tamanho
       diferente. Com `min-height` e o conteúdo ancorado embaixo, a linha de base
       do título cai no mesmo lugar nas quatorze rotas — e continua crescendo
       quando o texto é longo, o que é o comportamento correto. */
    <section
      ref={secaoRef}
      /* SIS-100 — âncora fixa da abertura, para o item "Início" do navegador
         lateral (`ui/ScrollSpy`, mapa em `src/data/pageSections.ts`). É id
         literal e não prop porque cada rota monta exatamente UM `PageHero`:
         prop opcional aqui só criaria a chance de duas rotas escreverem nomes
         diferentes para a mesma coisa. A home não passa por aqui — ela tem o
         `HeroCinematic`, cuja âncora é `#top`. */
      id="topo"
      className={clsx(
        'pagehero-entrada relative flex flex-col justify-end overflow-hidden py-16 md:py-24',
        cinematografico && 'pagehero-cinema',
      )}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/4 h-[480px] w-[480px] rounded-full bg-[#57B7EE]/25 blur-[130px]" />
        <div className="absolute -bottom-24 right-0 h-[400px] w-[400px] rounded-full bg-[#0ed8f6]/15 blur-[130px]" />
      </div>
      {/* A partida vai no wrapper EXTERNO, nunca no `motion.div` de baixo: aquele
          nó é escrito por quadro pela biblioteca de animação (variants de
          entrada), e valor por quadro disputando `transform` com uma segunda
          fonte é a colisão do SIS-42. Duas camadas, dois donos. */}
      <div className={clsx('container-lp', cinematografico && 'pagehero-partida')}>
        <motion.div
          variants={vHeader}
          initial={rm ? false : 'hidden'}
          animate="visible"
          viewport={VP}
          /* Era `max-w-3xl` (768px) no bloco INTEIRO, o que travava o título em
             53% da largura a 1440. O limite de medida é do texto corrido, não do
             título: uma linha de 1116px é ilegível como parágrafo e é justamente
             o que se quer como manchete. Então o limite desce para a descrição
             (`max-w-2xl`, abaixo) e o título passa a ocupar o container. */
          className="w-full"
        >
          {/* SIS-277 — arte OU tag textual, nunca as duas: ver `eyebrowArte` no
              tipo das props. O `<span>` de fora existe para dar a linha própria
              que o `.eyebrow` (bloco) dava, sem herdar caps, tracking nem o ponto
              do `::before` daquela classe. */}
          {eyebrowArte ? (
            <span className="block">{eyebrowArte}</span>
          ) : (
            eyebrow && (
              <motion.span variants={vEyebrow} className="eyebrow !text-[#A5F0FF]">
                {eyebrow}
              </motion.span>
            )
          )}
          <motion.h1
            variants={vTitle}
            /* Era o template string `mt-4 font-display tracking-tight text-white
               ${escala.fonte} ${escala.medida}`. Passou a `clsx` só porque
               entrou uma classe CONDICIONAL (`tituloForte`): concatenar
               `${forte ? 'font-bold' : ''}` deixaria um espaço duplo no
               atributo, e o componente já importa `clsx` para a `<section>`. */
            className={clsx(
              'mt-4 font-display tracking-tight text-white',
              escala.fonte,
              escala.medida,
              tituloForte && 'font-bold',
            )}
          >
            {title}
            {highlight && <span className="text-[#A5F0FF]"> {highlight}</span>}
          </motion.h1>
          {description && (
            <motion.div
              variants={vSubtitle}
              className="mt-5 max-w-2xl space-y-4 text-lg leading-relaxed text-white/85"
            >
              {description}
            </motion.div>
          )}
        </motion.div>
      </div>
      {/* Fio ciano: SAÍDA visual desta seção e ENTRADA da seguinte. Puramente
          decorativo — o progresso legível de verdade é o contador "NN / NN" e os
          pontos do carrossel, que continuam no DOM. */}
      {cinematografico && <span aria-hidden className="pagehero-fio" />}
    </section>
  );
}
