/**
 * SIS-42 — «Perfil & posicionamento» de `/quem-somos`, agora UMA ARTE dentro de
 * uma casca, no espírito do «Fale com a Gente!» da home.
 *
 * ── POR QUE ESTE ARQUIVO EXISTE, E NÃO UMA PODA DO `PositioningEcosystem` ──
 *
 * O ecossistema navegável (`PositioningEcosystem.tsx`, 404 linhas, mais
 * `positioning-ecosystem.css`, 1050) continua INTEIRO no repositório e o mount
 * dele fica comentado na rota, com o motivo. Ele não foi podado por dentro por
 * duas razões: o que a issue pede não é uma versão menor dele — é outra peça, sem
 * estado, sem trilhos, sem SVG de conexão e sem o `sticky` de progresso —, e a
 * revisão de 22/09 pode ser revertida sem redescobrir nada se o arquivo dele
 * estiver de pé. Cancelar escopo não é apagar trabalho medido.
 *
 * ── A ESCRITA NÃO SAIU DO DOM ──
 *
 * A arte `public/posicionamentoperfil.png` traz o texto DESENHADO: título,
 * subtítulo, os dois pilares, o trilho de Soluções e as duas listas. Se ela
 * entrasse sozinha, quinze frases publicadas virariam pixel — invisíveis para
 * leitor de tela, para busca e para o `copy-lock.json`, que trava
 * `src/data/posicionamento.ts` linha por linha.
 *
 * Por isso a transcrição `sr-only` abaixo é montada a partir do MESMO módulo de
 * dados que o ecossistema usava. Nada foi reescrito e nada foi traduzido de
 * novo: são as mesmas constantes, na ordem em que a arte as dispõe. O `h2` que
 * resolve o `aria-labelledby` da seção é o mesmo `ECO_TITULO`, e o `id`
 * `posicionamento-titulo` continua existindo, um nível mais para dentro.
 *
 * O `alt` da imagem descreve a FORMA do diagrama (é o que a transcrição não
 * diz) e remete à transcrição, em vez de repetir as mesmas quinze frases duas
 * vezes seguidas para quem ouve a página.
 *
 * ── A LEGIBILIDADE EM TELA ESTREITA ──
 *
 * A arte é 1672×941 e o corpo de texto dela mede ~20px nessa largura. A 390 de
 * janela, encaixada na casca, esse corpo cairia para ~4px: presente e ilegível.
 * Daí a janela de rolagem horizontal abaixo de 62rem, com piso de largura na
 * arte — o diagrama continua inteiro e legível, quem rola alcança o resto, e o
 * DOCUMENTO não transborda (o portão de «sem overflow horizontal» é medido no
 * `documentElement`, e a rolagem vive dentro da casca).
 *
 * A janela é focalizável de propósito: região rolável sem foco é inalcançável
 * por teclado. `role="group"` + `aria-label` para ela ser anunciada com nome.
 */

import Image from 'next/image';
import {
  ECO_EYEBROW,
  ECO_MODULOS,
  ECO_NUCLEO,
  ECO_PILAR_CONHECIMENTO,
  ECO_PILAR_VALOR,
  ECO_SOLUCOES,
  ECO_SOLUCOES_TITULO,
  ECO_TITULO,
} from '@/data/posicionamento';
import './perfil-posicionamento.css';

/* A arte, medida no arquivo (`sharp`): 1672×941, razão 1,777. Os dois números
   vão no `<Image>` para o navegador reservar a caixa antes do byte chegar — sem
   eles a casca colapsaria e voltaria a abrir, que é CLS de graça. */
const ARTE = { largura: 1672, altura: 941 } as const;

export default function PerfilPosicionamentoArte() {
  return (
    <section
      id="posicionamento"
      aria-labelledby="posicionamento-titulo"
      /* `isolate` NÃO é decoração: a `.grade-tecnica` da casa nasce em
         `z-index: -1`, e numa seção que é só `relative` (z-index e isolation
         `auto`) a subárvore negativa sobe até o contexto do ancestral e pinta
         ABAIXO do fundo opaco de lá — foi assim que a malha de `/contato` ficou
         meses sem chegar à tela (o achado está inteiro no `globals.css`, no bloco
         de `.fundo-contato-cena`). Lá o conserto foi `z-index: 0` na malha porque
         havia uma segunda camada que ninguém queria acender junto; aqui não há:
         `isolate` acende as duas camadas desta seção e é o mesmo caminho que a
         seção do ENVIRONMENT de `/esg` já usa. */
      className="perfil-secao section-py relative isolate overflow-hidden"
    >
      {/* OS QUADRADOS. Regra global da casa, sem override de desenho: mesmo
          módulo, mesma tinta de 14% e a mesma máscara de entrada/saída que faz a
          malha nascer e morrer sem corte seco contra as seções vizinhas. */}
      <div aria-hidden className="grade-tecnica" />

      {/* OS RISCOS. «Alguns riscos discretos» é o pedido, e o número é o que o
          mantém discreto: SEIS fios de 1px, nenhum atravessando a casca de
          frente — dois longos nas margens de cima e de baixo, duas diagonais
          curtas nos cantos que a casca não ocupa, e o par vertical que
          acompanha a coluna de leitura.
          `vector-effect: non-scaling-stroke` pela razão de sempre: o `slice`
          escala a arte para cobrir a seção e um fio de 1px engrossaria com ela.
          Mesma linguagem de `ui/AtmosferaQuadrados.tsx` (SIS-204). */}
      <div aria-hidden className="perfil-riscos">
        <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" focusable="false">
          <g stroke="rgba(120, 214, 245, 0.16)" strokeWidth="1" fill="none">
            <path d="M-40 96H1480" vectorEffect="non-scaling-stroke" />
            <path d="M-40 806H1480" vectorEffect="non-scaling-stroke" />
            <path d="M96 -40V940" vectorEffect="non-scaling-stroke" />
            <path d="M1344 -40V940" vectorEffect="non-scaling-stroke" />
            <path d="M-60 250L180 10" vectorEffect="non-scaling-stroke" />
            <path d="M1260 890L1500 650" vectorEffect="non-scaling-stroke" />
          </g>
        </svg>
      </div>

      <div className="container-lp relative">
        {/* A TRANSCRIÇÃO. Mesmo módulo de dados de sempre; a ordem é a da arte,
            de cima para baixo. O `h2` fica aqui porque é ele que dá nome à
            seção — o `aria-labelledby` acima aponta para este `id`. */}
        <div className="sr-only">
          <p>{ECO_EYEBROW}</p>
          <h2 id="posicionamento-titulo">{`${ECO_TITULO.inicio} ${ECO_TITULO.destaque}`}</h2>
          <p>{ECO_PILAR_VALOR.texto}</p>

          <h3>{ECO_SOLUCOES_TITULO}</h3>
          <ul>
            {ECO_SOLUCOES.map((s) => (
              <li key={s.titulo}>{`${s.titulo}: ${s.texto}`}</li>
            ))}
          </ul>

          <h3>{ECO_PILAR_VALOR.linhas.join(' ')}</h3>
          <p>{ECO_PILAR_VALOR.texto}</p>

          <h3>{ECO_PILAR_CONHECIMENTO.linhas.join(' ')}</h3>
          <p>{ECO_PILAR_CONHECIMENTO.texto}</p>

          <p>{ECO_NUCLEO.frase}</p>

          {ECO_MODULOS.map((m) => (
            <div key={m.indice}>
              <h3>{`${m.indice} — ${m.titulo}`}</h3>
              <ul>
                {m.itens.map((i) => (
                  <li key={i.texto}>{i.texto}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* A CASCA. A linguagem é a do cartão do «Fale com a Gente!»
            (`ContactCTA.tsx`): `rounded-3xl`, borda `white/12`, o mesmo degradê
            diagonal medido na SIS-157 e a mesma sombra projetada. Copiei os
            valores em vez de importar o componente porque ele é um CTA com
            título, parágrafo e botão em oito telas — o que se pediu aqui é a
            SUPERFÍCIE dele, não o bloco.
            O `padding` é menor que o `p-10 md:p-14` de lá de propósito: ali a
            casca embrulha texto, aqui embrulha uma arte que já traz margem
            desenhada por dentro, e repetir os 56px faria moldura dupla. */}
        <div className="perfil-casca">
          <div aria-hidden className="perfil-casca-brilho" />

          <div
            className="perfil-janela"
            role="group"
            aria-label="Diagrama Perfil & posicionamento — rolagem horizontal"
            tabIndex={0}
          >
            <Image
              src="/posicionamentoperfil.png"
              alt="Diagrama institucional: três círculos sobrepostos — Seguros, Negócio e Tecnologia — com o símbolo da Sistran no centro, o trilho de Soluções acima e duas listas de capacidades abaixo. O conteúdo escrito do diagrama está transcrito nesta mesma seção para leitores de tela."
              width={ARTE.largura}
              height={ARTE.altura}
              /* A arte ocupa a casca inteira em telas largas e o piso de 760px
                 na janela de rolagem abaixo de 62rem — os dois valores que o CSS
                 declara, repetidos aqui para o navegador não baixar um arquivo
                 maior do que vai pintar. */
              sizes="(max-width: 62rem) 760px, min(1200px, 92vw)"
              className="perfil-arte"
            />
          </div>

          {/* A DICA. Sem ela a captura a 390 mostrava a manchete cortada na
              borda direita e NADA anunciando a rolagem: rolagem que não se
              anuncia parece defeito de layout, e o visitante não procura o que
              não sabe que existe. Só pinta abaixo de 62rem, onde a janela de
              fato rola — acima, a arte cabe inteira e a frase seria mentira. */}
          <p className="perfil-dica">Arraste para ver o diagrama completo.</p>
        </div>
      </div>
    </section>
  );
}
