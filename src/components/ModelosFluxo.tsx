/**
 * Modelos — FLUXO HORIZONTAL DE ANÉIS (SIS-165, escopo 29/09).
 *
 * ── O que esta seção substitui, e por que o arquivo é novo ───────────────────
 * O pedido desta passada é o mock 1: «série horizontal de anéis, não cards
 * soltos / não bilhete» — anéis azuis com orb no gap, ícone no centro, setas
 * tracejadas entre os nós. O que estava na rota era a ÓRBITA da SIS-99/SIS-165
 * (28/09): um palco elíptico de 1120×600 com quatro estações em quadrante, hub
 * manuscrito, rodízio de destaque e painel `role="status"`. Nada daquilo sobrevive
 * à troca de composição — a geometria toda é de quadrante, e um fluxo em linha não
 * tem quadrante.
 *
 * `CircularEngagementModel.tsx` e `circular-engagement-model.css` NÃO foram
 * apagados nem esvaziados: continuam no repositório, íntegros e legíveis, e
 * saíram apenas da rota (o `import` e o `<CircularEngagementModel />` em
 * `src/app/quem-somos/page.tsx` estão comentados no lugar, com o motivo).
 * Comentar 532 linhas de TSX e 961 de CSS dentro do próprio arquivo apagaria, na
 * prática, o que o repositório quer preservar: a órbita é a referência do mock 2,
 * que a issue mantém como contexto. Religar é descomentar duas linhas da página.
 *
 * ── Três nós, e a copy é a do arquivo ───────────────────────────────────────
 * `MODELOS_ATUACAO` passou a listar três (Consultoria, Projetos, Alocação de
 * Especialistas). Outsourcing e a frase «Operação contínua com eficiência,
 * qualidade e escala.» saíram por pedido, comentados em `modelosAtuacao.ts`. Aqui
 * não há texto escrito à mão: rótulo e descrição vêm dos dados, palavra por
 * palavra, e o `<h2>` é a manchete que a issue manda MANTER.
 *
 * ── Sem estado, sem JS ──────────────────────────────────────────────────────
 * Componente de servidor de propósito. A órbita precisava de cliente porque tinha
 * rodízio, prévia de hover e painel anunciado; aqui as três descrições estão
 * TODAS visíveis ao mesmo tempo, então não há nada a revelar, nada a ciclar e
 * nada que possa ficar preso em `opacity: 0` se um efeito não correr — o critério
 * de `reduced-motion-conteudo` se resolve pela composição, e não por exceção de
 * media query. O único movimento é o orb girando no anel, decorativo, e o CSS o
 * para sob movimento reduzido deixando-o parado e visível.
 *
 * ── Ícones ──────────────────────────────────────────────────────────────────
 * Os três de `ui/ModelosIcones.tsx`, que já foram desenhados um por modelo
 * (compasso sobre arco, quadro com marcos, grupo de pessoas) na mesma gramática
 * de viewBox 24 e traço 1,5. Não entra ícone genérico de mock: o critério 6 pede
 * coerência de significado, e ela já existia.
 *
 * ═════════════════════════════════════════════════════════════════════════════
 * ⚠️ SIS-98 (29/09) — TRÊS BLOCOS ACIMA VIRARAM HISTÓRIA. O que mudou, e só:
 *
 * 1. «Três nós» → QUATRO. Outsourcing foi religado em `modelosAtuacao.ts` por
 *    pedido literal da issue. O argumento do bloco (a copy vem dos dados, não da
 *    mão) continua valendo e ficou mais verdadeiro: nenhum texto novo foi escrito.
 *
 * 2. «as três descrições estão TODAS visíveis» → NENHUMA está. A issue pede
 *    «rótulos only — retirar as descriptions do painel/UI», então o `<p
 *    className="mfx-no-texto">` saiu daqui (a regra de CSS ficou, comentada, em
 *    `modelos-fluxo.css`). A CONCLUSÃO do bloco não muda por isso — continua não
 *    havendo nada a revelar nem a ciclar, e agora por um motivo mais simples ainda.
 *    Componente de servidor: `TituloAceso` é o único nó de cliente, e é ele mesmo
 *    que carrega o `'use client'`.
 *
 * 3. «Os três de `ui/ModelosIcones.tsx`» → as QUATRO ARTES PNG. A issue nomeia os
 *    arquivos e o lugar: «PNGs já em `public/` (nomes com espaço — renomear para
 *    paths estáveis tipo `public/images/modelos/*`)». `ModelosIcones.tsx` fica
 *    íntegro no repositório: `CircularEngagementModel` (fora da rota) ainda o usa.
 *
 * ── O que a medição desmentiu no enunciado ───────────────────────────────────
 * A issue manda «tratar alfa/`mix-blend` ou trim para não pintar quadrado preto no
 * claro». MEDIDO nos quatro arquivos de origem (`sharp`, canal alfa cru): os PNGs
 * JÁ SÃO transparentes — canto em rgba(0,0,0,0), 4,8% a 6,1% dos pixels opacos, e
 * dos opacos 0,0–0,1% são quase-pretos (luminância < 40). Não existe quadrado preto
 * para tratar, então NÃO entra `mix-blend-mode`: sobre este campo claro o
 * `multiply`/`screen` só teria como alterar a tinta azul da arte sem ganho nenhum.
 *
 * O trim, esse sim, era necessário — por outra razão que a medição mostrou. A caixa
 * de conteúdo real de cada arte ocupava uma fatia diferente do quadro de 1254²:
 * 968×724, 952×849, 862×781 e 848×468 (Outsourcing, achatado). Centradas sem aparar,
 * as quatro leriam em tamanhos ópticos visivelmente diferentes dentro de anéis do
 * MESMO diâmetro, e a mais baixa pareceria menor que as outras. Os arquivos servidos
 * são aparados no alfa e recentrados em 320×320 (27–40 kB cada) — com
 * `images: { unoptimized: true }` (SIS-154) o arquivo do disco vai ao ar como está,
 * então o peso e a moldura do disco SÃO os da tela.
 * ═════════════════════════════════════════════════════════════════════════════
 */

import Image from 'next/image';
import TituloAceso from '@/components/ui/TituloAceso';
import { MODELOS_ATUACAO, type IconeModelo } from '@/data/modelosAtuacao';
import './modelos-fluxo.css';

/* As artes da issue, aparadas e recentradas a partir dos quatro `ChatGPT Image Sep
   29, 2026, 02_51_5X PM-X.png` que estavam soltos em `public/`. O `Record` é keyed
   por `modelo.icone` — a mesma chave que `ICONES_MODELOS` usava — para a troca ser
   de UMA linha no nó e para o TypeScript exigir as quatro artes se um modelo novo
   entrar nos dados.

   ⚠️ O MAPA MORA AQUI, e não em `src/data/modelosAtuacao.ts`: o cabeçalho daquele
   arquivo diz que os dados ficam sem referência a desenho de propósito («todo o resto
   de `src/data` é `.ts` puro»), e caminho de asset é desenho. É onde
   `ICONES_MODELOS` já morava, pela mesma razão.

   A leitura de cada arte, na ordem em que a issue as lista: bússola sobre a rota que
   sobe → Consultoria (direção); três quadros com marcos e um check → Projetos
   (execução por etapas); pessoa ligada a competências → Alocação de Especialistas;
   pessoa entregando a operação a um time sob escudo → Outsourcing. */
const ARTES_MODELOS: Record<IconeModelo, string> = {
  consultoria: '/images/modelos/consultoria.png',
  projetos: '/images/modelos/projetos.png',
  especialistas: '/images/modelos/especialistas.png',
  outsourcing: '/images/modelos/outsourcing.png',
};

/* A manchete que a issue manda MANTER, partida no ponto que ela mesma nomeia: a
   palavra «Segurador» vai para `destaque` porque é a única fatia que `TituloAceso`
   trata em separado, e é justamente a que a issue quer no tratamento de
   `docs/fonte2.md`. Somadas, as duas dão a frase original palavra por palavra — é o
   que o `aria-label` do heading entrega ao leitor de tela, numa peça só. */
const MFX_TITULO = 'Temos uma abordagem completa de projetos para o mercado';
const MFX_TITULO_DESTAQUE = 'Segurador';

/* Id fixo, e não `useId()`: `useId` exige componente de cliente, e a seção é
   montada uma única vez por rota (`/quem-somos`). */
const TITULO_ID = 'modelos-fluxo-titulo';

export default function ModelosFluxo() {
  return (
    <section className="mfx-secao section-py" aria-labelledby={TITULO_ID}>
      <div className="container-lp">
        {/* ⚠️ SIS-98 — A MANCHETE PASSOU A SER `TituloAceso`. O pedido é o efeito,
            e não a peça: «manchete com o MESMO efeito de scroll de "Reconhecimentos
            que marcam nossa trajetória"». Aquele título é desenhado por
            `TituloAceso` em `recognition-gallery/RecognitionGallery.tsx`, e chamar
            o mesmo componente com a mesma cadência (palavra por palavra, sem
            `porLetra`) é o que faz o efeito ser o mesmo em vez de parecido.

            Sem `porLetra`, como no call site de Reconhecimentos e pela razão que
            está documentada lá: a cascata por letra existe para título de UMA
            palavra, que é onde o passo por palavra não tem por onde cascatear.
            Aqui são DEZ unidades (as nove palavras de `texto` mais «Segurador») —
            o ritmo já está no texto.

            O que saiu: o `<h2>` liso com os dois `<span className="mfx-titulo-linha">`.
            Não havia como conservá-los — `TituloAceso` monta o próprio `<h2>` e
            distribui as palavras uma a uma, então a quebra de sentido que os dois
            spans forçavam agora é trabalho do `text-wrap: pretty` da folha. A
            regra `.mfx-titulo-linha` ficou comentada em `modelos-fluxo.css`.

            O eyebrow «Modelos de atuação» continua fora, por pedido da SIS-165
            (critério 3): era um rótulo em caixa-alta repetindo o nome da seção. */}
        <TituloAceso
          id={TITULO_ID}
          texto={MFX_TITULO}
          destaque={MFX_TITULO_DESTAQUE}
          className="mfx-titulo"
        />

        {/* `<ul>` e não `<ol>`: os quatro não são etapas de um processo, são formas
            de contratação — a seta tracejada entre eles é continuidade visual do
            mock, não sequência obrigatória, e por isso ela é `aria-hidden`. */}
        <ul className="mfx-fluxo">
          {MODELOS_ATUACAO.map((modelo, i) => {
            return (
              <li className="mfx-no" key={modelo.id}>
                {/* A seta mora no nó de DESTINO e não no de origem: assim ela
                    nunca sobra depois do último, em nenhuma largura, sem
                    depender de `:last-child`. No empilhamento do celular o CSS
                    a vira para baixo. */}
                {i > 0 ? <span className="mfx-seta" aria-hidden /> : null}

                <span className="mfx-aneis">
                  <svg
                    className="mfx-aneis-svg"
                    viewBox="0 0 120 120"
                    aria-hidden
                    focusable="false"
                  >
                    {/* Três anéis: o externo é o fio azul contínuo, o tracejado
                        vive no vão e o interno fecha o disco do ícone. O orb
                        corre no VÃO entre o externo (r 56) e o tracejado
                        (r 48) — daí o raio 52 do eixo dele. */}
                    <circle className="mfx-anel mfx-anel--externo" cx="60" cy="60" r="56" />
                    <circle className="mfx-anel mfx-anel--tracejado" cx="60" cy="60" r="48" />
                    <circle className="mfx-anel mfx-anel--interno" cx="60" cy="60" r="38" />
                    {/* O giro é do GRUPO, em volta do centro do viewBox: um
                        círculo a 52 do centro descreve o anel sozinho, sem seno
                        nem cosseno e sem deformar o orb (o que aconteceria se o
                        anel fosse elipse — a órbita antiga precisava de SMIL
                        justamente por isso; aqui o anel é círculo). */}
                    <g className="mfx-orbe-eixo">
                      <circle className="mfx-orbe" cx="60" cy="8" r="4.5" />
                    </g>
                  </svg>
                  {/* Arte centrada no disco, por cima do SVG dos anéis.

                      `alt=""` com `aria-hidden` no invólucro porque a arte é
                      redundante: o `<h3>` logo abaixo diz o nome do modelo, e
                      descrever o desenho faria o leitor de tela ouvir a mesma
                      informação duas vezes.

                      `width`/`height` são os do arquivo no disco (320×320, quadrado
                      por construção do trim) — servem de proporção para o `next/image`
                      reservar a caixa e não causar salto de layout; o tamanho na tela
                      é o do CSS (`.mfx-arte`), atado ao diâmetro do anel.

                      Sem `sizes`: com `images: { unoptimized: true }` não há `srcset`
                      para escolher, e declarar uma faixa que ninguém consulta seria
                      escrever um número que não é medido em lugar nenhum. */}
                  <span className="mfx-icone" aria-hidden>
                    <Image
                      className="mfx-arte"
                      src={ARTES_MODELOS[modelo.icone]}
                      alt=""
                      width={320}
                      height={320}
                    />
                  </span>
                </span>

                {/* ⚠️ SIS-98 — «rótulos only»: o `<p className="mfx-no-texto">
                    {modelo.description}</p>` que vinha aqui SAIU. A copy não foi
                    apagada — segue em `modelosAtuacao.ts`, que é o registro do texto
                    aprovado e a fonte de `CircularEngagementModel`. */}
                <h3 className="mfx-no-titulo">{modelo.label}</h3>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
