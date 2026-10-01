import Image from 'next/image';
import type { CSSProperties } from 'react';
import AtmosferaFaixaNavy from '@/components/ui/AtmosferaFaixaNavy';
import ScrollReveal from '@/components/ui/ScrollReveal';
import TituloAceso from '@/components/ui/TituloAceso';
import { POR_QUE_SISTRAN } from '@/data/aSistran';
/* `sobre-nos.css` entra por causa de `.palco-faixa-navy` e `.sobre-atmosfera*` —
   as duas peças de fundo reusadas da faixa 1988 / 150+ / 18. A rota já carrega esta
   folha por `FaixaIndicadores`, mas depender do import de outro componente deixaria
   esta seção sem fundo no dia em que aquele saísse da página. Import de CSS é
   deduplicado pelo bundler: o custo é zero. */
import './sobre-nos.css';
import './por-que-sistran.css';

/**
 * «Por que SISTRAN?» de `/quem-somos` — SIS-199.
 *
 * A seção saiu de dentro de `quem-somos/page.tsx`, onde era JSX solto, pelo mesmo
 * motivo que levou os Diferenciais e «Como Agimos» para componentes próprios: ela
 * passou a ter arte, movimento e uma composição de duas colunas, e isso não cabe em
 * vinte linhas inline no meio de uma página de 900. O `<section>` continua no MESMO
 * lugar do `main` — mas isso já NÃO importa para a cor: a nota original daqui dizia
 * que «o navy desta seção vem da alternância de paridade
 * (`main > section:nth-of-type(even)`, `globals.css:17225`), que conta irmãos — mover
 * a seção de posição a repintaria de claro», e foi exatamente esse defeito que
 * apareceu, sem ninguém mover esta seção: bastou a SIS-177 montar uma seção nova
 * ACIMA dela. Hoje a seção tem palco próprio e opaco (ver o bloco de fundo no JSX),
 * então a paridade não decide mais a cor. O `id="por-que-sistran"` continua no `h2`,
 * então o ScrollSpy de `src/data/pageSections.ts:91` e as sondas de `scripts/medir-isg.mjs`
 * continuam achando a âncora.
 *
 * Os cinco itens da issue, e o que cada um virou:
 *
 * 1. «SISTRAN em negrito» → `negritoDestaque` no `TituloAceso`. O componente já tinha
 *    `negritoTexto` (SIS-262), que engrossa os spans de `texto` — mas aqui a palavra
 *    pedida é a do `destaque`, e ela é o que fica fino ao lado de «Por que». O novo
 *    parâmetro é aditivo e default `false`: nenhum dos outros call sites muda.
 * 2. «cards mais alinhados aos outros do site (ex.: família Dif/ESG): arredondados,
 *    com sombra atrás, flutuando» → o card é a versão ESCURA de `.dif-cartao`, com a
 *    mesma gramática (raio 20px, sombra de duas camadas, flutuação por `--i`). As três
 *    classes antigas (`notch-card`, `barra-sinal`, `corner-accent`) saíram, e a
 *    medida de cada saída está em `por-que-sistran.css` — a primeira delas é a causa
 *    mecânica de o card de hoje não ter nem raio nem sombra.
 * 3. «no hover o card muda de cor e as letras também» → o card inverte para o claro e
 *    título e corpo vão aos dois navys da casa. `glass-card-hover`, que era o hover
 *    daqui, troca só superfície e nunca cor de letra; por isso foi redesenhado.
 * 4. «`porquesistran.png` como âncora visual DINÂMICA (float / brilho / parallax, com
 *    `prefers-reduced-motion` respeitado)» → o medalhão flutua em 6,2s com um halo
 *    ciano que respira atrás, ambos desligados nos dois canais de movimento reduzido.
 *    Float + brilho e não parallax: parallax pediria `useScroll` e um nó extra, e a
 *    casa já usa float/respiro em oito seções — é o idioma existente que a issue pede
 *    («ou equivalente já usado no site»).
 * 5. «composição bonita: título + medalhão + grade na mesma seção navy» → o cabeçalho
 *    é uma grade de duas colunas (título | medalhão) de 64rem em diante, e a grade dos
 *    dez blocos segue embaixo, em duas colunas como antes. ISG e «Conheça também» não
 *    foram tocadas.
 *
 * NENHUMA PALAVRA MUDOU: os dez blocos continuam vindo de `POR_QUE_SISTRAN`
 * (`src/data/aSistran.ts:162`), título e texto no mesmo par de tags de antes.
 */

/* Medidas do arquivo, para o `<Image>` reservar a caixa e não haver salto de layout
   enquanto ele baixa — não estimadas: 1254×1254, com alfa. O assunto é um disco que
   toca as quatro bordas, então os cantos são transparentes; é por isso que a elevação
   do medalhão é `drop-shadow` (segue o alfa) e não `box-shadow` (desenharia a sombra
   de um quadrado atrás de um círculo). A conta está no CSS. */
const MEDALHAO = { largura: 1254, altura: 1254 };

export default function PorQueSistran() {
  return (
    <section
      aria-labelledby="por-que-sistran"
      className="section-py pqs-secao palco-faixa-navy relative overflow-hidden"
    >
      {/* A grade técnica da casa, como antes — a seção era consumidora dela e
          continua sendo. */}
      <div aria-hidden className="grade-tecnica" />

      {/* ── O FUNDO DA FAIXA 1988 / 150+ / 18, REUSADO ─────────────────────────
          Pedido em chat: a seção «ficou apagada» e o fundo dela deve ser «o mesmo
          que tem nessa 1988 / 150+ / 18». São as DUAS metades daquela faixa, e
          nenhuma delas foi repintada aqui:
            · a pintura → `.palco-faixa-navy`, no `className` acima. É a mesma
              declaração que pinta `.sobre-metricas` (`sobre-nos.css`), agora com
              dois seletores em vez de um;
            · a camada de quadrados e linhas → `AtmosferaFaixaNavy`, que saiu de
              dentro de `FaixaIndicadores.tsx` para cá sem mudar um valor.
          O motivo de reusar em vez de copiar, nos dois casos, é o mesmo: valor
          copiado para de acompanhar o original na primeira recalibragem, e esta
          faixa já foi recalibrada uma vez (a nota do `90deg` em `sobre-nos.css`).

          POR QUE O PALCO EXISTE AGORA. O navy desta seção vinha só da alternância
          de paridade do `main`, e paridade conta IRMÃOS: a seção nova da SIS-177
          (`CelentSpotlight`) entrou acima desta e virou a paridade de todas as
          seguintes — é a causa do «apagado». Com palco opaco a cor deixa de
          depender da ordem. A conta está em `por-que-sistran.css`. */}
      <AtmosferaFaixaNavy />

      <div className="container-lp pqs-miolo">
        <div className="pqs-cabecalho">
          {/* No site o titulo termina com uma aspa dupla solta; removida. */}
          <TituloAceso
            id="por-que-sistran"
            texto="Por que"
            destaque="SISTRAN?"
            negritoDestaque
            className="font-display text-section text-white"
          />

          {/* O medalhão é DECORATIVO em texto e informativo em imagem, e por isso o
              `alt` transcreve o que está escrito na arte em vez de descrevê-la: quem
              não vê a peça recebe a marca e a assinatura, que é o conteúdo dela. Não
              é `aria-hidden` justamente por trazer palavras que não existem em
              nenhum outro lugar da seção. O halo, sim, é `aria-hidden`: é luz. */}
          <div className="pqs-medalhao">
            <span aria-hidden className="pqs-halo" />
            <Image
              src="/images/porquesistran.png"
              alt="SISTRAN — Beyond Technology"
              width={MEDALHAO.largura}
              height={MEDALHAO.altura}
              /* As três paradas traduzem o `clamp(200px, 26vw, 340px)` do CSS: o teto
                 de 340px só vale de 82rem em diante (340 ÷ 0,26 = 1307,7px), o `vw`
                 governa de 48rem até lá, e abaixo de 48rem a conta bate sempre no
                 piso. Inerte enquanto `images.unoptimized` estiver ligado (SIS-154), e
                 é por isso mesmo que tem de ficar verdadeiro: mentira aqui só aparece
                 no dia em que a otimização voltar. */
              sizes="(min-width: 82rem) 340px, (min-width: 48rem) 26vw, 200px"
            />
          </div>
        </div>

        {/* `<ul>/<li>`: os dez blocos são uma lista, e eram dez `<article>` irmãos sem
            invólucro — a lista dá a contagem ao leitor de tela sem mudar uma palavra.
            `cortina={false}` pela razão que o próprio `ScrollReveal` registra: a
            cortina é um `clip-path` no nó animado e `inset(0% 0% 0% 0%)`, o estado
            FINAL dela, continua recortando na borda da caixa — o que apaga a sombra
            projetada. Um card cujo pedido é «sombra de elevação» não pode entrar com
            cortina. */}
        <ul className="pqs-grade">
          {POR_QUE_SISTRAN.map((b, i) => (
            <ScrollReveal as="li" indice={i} key={b.title} cortina={false} className="pqs-celula">
              {/* O card desceu um nível de propósito: o `<li>` recebe `transform`
                  INLINE do motion na entrada, e animação CSS vence estilo inline —
                  um `@keyframes` de flutuação no mesmo nó apagaria o deslocamento da
                  entrada. O de fora entra, o de dentro flutua. `--i` escalona a
                  flutuação. */}
              <article className="pqs-card" style={{ '--i': i } as CSSProperties}>
                <h3 className="pqs-titulo font-display text-lg leading-snug">{b.title}</h3>
                <p className="pqs-texto text-sm leading-relaxed">{b.text}</p>
              </article>
            </ScrollReveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* O BLOCO ANTIGO, comentado e não apagado. Vivia em
   `src/app/quem-somos/page.tsx:779-808`. Fica como registro da forma que esta
   substituiu; o motivo de cada peça que saiu de cena está no docblock acima e, com as
   medidas, em `por-que-sistran.css`. Os comentários internos viraram prosa entre
   parênteses porque um fechamento de comentário aninhado encerraria este bloco antes
   da hora.

      <section aria-labelledby="por-que-sistran" className="section-py relative overflow-hidden">
        <div aria-hidden className="grade-tecnica" />
        <div className="container-lp">
          (No site o titulo termina com uma aspa dupla solta; removida.)
          <TituloAceso
            id="por-que-sistran"
            texto="Por que"
            destaque="SISTRAN?"
            className="font-display text-section text-white"
          />
          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
            {POR_QUE_SISTRAN.map((b, i) => (
              <ScrollReveal
                as="article"
                indice={i}
                key={b.title}
                className={`glass-card-hover notch-card barra-sinal relative overflow-hidden p-7 ${
                  i % 2 === 1 ? 'degrau-2' : ''
                }`}
              >
                <span aria-hidden className="corner-accent" />
                <h3 className="font-display text-lg leading-snug text-white">
                  {b.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/85">{b.text}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
*/
