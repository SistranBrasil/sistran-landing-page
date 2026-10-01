import Image from 'next/image';
import type { CSSProperties } from 'react';
import {
  TRAJECTORY_CATEGORY_META,
  type MilestoneCardData,
  type TrajectoryCompetenciaAcumulada,
} from '@/data/trajectory';

export type EstadoDoItem = 'ativo' | 'vizinho' | 'distante';

/**
 * SIS-202 — o card de cliente/projeto (§5 do doc).
 *
 * ⚠️ SEM NUMERAÇÃO. O critério 7 é explícito, e o `id` dos dados (`marco-12`) NÃO
 * aparece em lugar nenhum da tela — ele é chave de React e âncora, não rótulo. A
 * trilha antiga desta rota mostrava «ETAPA 12 / 24» e é justamente o que sai.
 *
 * ⚠️ E A NUMERAÇÃO SEGUE FORA depois do pedido de 30/09, que aponta a captura da
 * versão publicada («os cards continuar com esse layout») — e naquela captura a
 * linha «ETAPA 03 / 24» aparece. O que o pedido descreve é o DESENHO do card
 * (placa de marca no canto, geração, título, pílula de categoria, apoio), e é isso
 * que este arquivo passou a montar. Reintroduzir o contador contrariaria um
 * critério ESCRITO da especificação, então fica de fora e fica registrado aqui:
 * é uma linha só de voltar, se a área decidir que o critério 7 caducou.
 *
 * ── A PLACA DE MARCA (pedido de 30/09) ──
 *
 * O glifo genérico de prédio que ocupava este canto SAIU. Ele existia porque o §5
 * proíbe logo OBRIGATÓRIO — e continua proibindo: a placa mostra a arte quando a
 * marca tem arquivo no acervo e cai no monograma quando não tem, que é exatamente
 * "não obrigatório". Nada é inventado; `logo` e `monogram` vêm derivados do nome
 * que o dado já escreve (ver `src/lib/logoDeMarca.ts`).
 *
 * ── O QUE O ESTADO ATIVO REVELA ──
 *
 * O pedido é «mostre mais informações». Os dados NÃO têm campo a mais: `timeline.ts`
 * guarda empresa, detalhe, geração e categoria, e é tudo o que o card já exibe.
 * Então "mais informação" aqui é informação REAL que estava cortada, não conteúdo
 * novo: em repouso o texto de apoio é limitado a duas linhas (`line-clamp`), e no
 * card ativo ele abre inteiro, junto com a placa e o título maiores. Inventar um
 * campo para preencher o card grande seria quebrar o critério 13.
 *
 * O estado (ativo / vizinho / distante) chega como `data-estado` e TODO o desenho
 * dele está no CSS. Opacidade e escala em atributo em vez de estilo inline porque
 * são três estados nomeados, não um valor contínuo: assim a transição de entrada do
 * §5 (fade + ~20px + leve escala, 450–700ms) é uma `transition` declarada uma vez,
 * e o modo estático do mobile e do movimento reduzido a neutraliza com uma regra
 * só, sem o JavaScript ter de saber em que modo está.
 *
 * ── E DESDE 01/10 (NOITE) O ATIVO REVELA TAMBÉM AS COMPETÊNCIAS ACUMULADAS ──
 *
 * «quero que os icones seja colocados sendo respectiva a quantidade de qual icone tem
 * antes na linha do tempo dentro dos cards e aparecem quando fica em destaque e uma breve
 * explicação do que é o icone.»
 *
 * ⚠️ ISTO NÃO CONTRARIA O PARÁGRAFO ACIMA («os dados não têm campo a mais»). O título e a
 * descrição das quatro competências existem em `TRAJECTORY_CAPABILITIES` desde a primeira
 * versão — o que estava faltando no card era a ASSOCIAÇÃO entre o ponto da linha e o texto.
 * Nada é inventado aqui: a lista chega pronta de `competenciasAcumuladas`, que a deriva dos
 * mesmos selos pendurados no traço. Continua valendo que não se preenche card com conteúdo
 * novo (critério 13).
 *
 * ⚠️ QUEM CONTA É O ÍNDICE, NÃO O ESTADO. `competencias` é a lista da parada, calculada no
 * ponto de montagem (onde o índice existe) e passada pronta; este componente só desenha, e
 * é o CSS que decide que ela só aparece em `data-estado='ativo'`. Fazer a conta aqui a
 * partir do `estado` seria impossível — «ativo» não diz QUAL parada é.
 */
export function MilestoneCard({
  data,
  estado,
  competencias,
}: {
  data: MilestoneCardData;
  estado: EstadoDoItem;
  competencias?: readonly TrajectoryCompetenciaAcumulada[];
}) {
  const meta = TRAJECTORY_CATEGORY_META[data.category];
  const geracao = data.tags?.[0];

  return (
    <article
      className="trajetoria-card"
      data-estado={estado}
      data-categoria={data.category}
      style={{ '--chip-cor': meta.color } as CSSProperties}
    >
      <header className="trajetoria-card-topo">
        {/* A placa: arte da marca, ou as iniciais quando o acervo não tem arte.
            `aria-hidden` nas duas pontas porque o nome da empresa está escrito
            logo abaixo, no título — a placa é repetição visual, não informação
            nova, e anunciá-la faria o leitor de tela ler a marca duas vezes. */}
        <span
          className="trajetoria-card-placa"
          data-tipo={data.logo ? 'marca' : 'monograma'}
          aria-hidden
        >
          {data.logo ? (
            <Image
              src={data.logo}
              alt=""
              /* Medidas INTRÍNSECAS generosas: com `images: { unoptimized: true }`
                 (SIS-154) o que baixa é o arquivo do disco, e estas duas só
                 reservam a caixa. O tamanho de desenho é do CSS, que muda entre
                 repouso e ativo — declarar aqui o tamanho de repouso deixaria a
                 arte serrilhada quando o card crescesse. */
              width={240}
              height={80}
              loading="lazy"
              decoding="async"
            />
          ) : (
            <b>{data.monogram}</b>
          )}
        </span>

        <div className="trajetoria-card-selo">
          {/* A geração é a única marca de tempo que os dados trazem (ver
              `src/data/trajectory.ts`). Sobe para o topo, ao lado da placa, que é
              onde a captura da versão publicada a mostra. */}
          {geracao ? <p className="trajetoria-card-geracao">{geracao}</p> : null}
        </div>

        <span className="trajetoria-chip">
          {meta.label}
        </span>
      </header>

      <h4 className="trajetoria-card-titulo">{data.title}</h4>
      {data.description ? (
        <p className="trajetoria-card-texto">{data.description}</p>
      ) : null}

      {/* As competências já somadas até esta parada. Em repouso o CSS a tira do fluxo
          com `display: none`, e é de propósito que seja `display` e não opacidade: as
          mesmas três ou quatro frases existem em TODOS os 24 cards, e com `opacity: 0`
          elas continuariam no documento 24 vezes para o leitor de tela. Em `none` só a
          lista do card aceso é anunciada — uma vez, no momento em que é a resposta à
          pergunta «o que esses desenhos na linha significam».

          O custo de usar `display` é não haver transição de entrada (não se interpola
          `none`); o card em volta já tem a sua, e o bloco entra com ela. */}
      {competencias && competencias.length > 0 ? (
        <ul className="trajetoria-card-competencias">
          {competencias.map((competencia) => (
            <li key={competencia.src} className="trajetoria-card-competencia">
              {/* `alt` vazio porque o título vem escrito ao lado, em texto — a arte é
                  a mesma repetição visual da placa de marca, logo acima. */}
              <span className="trajetoria-card-competencia-icone" aria-hidden>
                <Image
                  src={competencia.src}
                  alt=""
                  /* Intrínsecos generosos só reservam a caixa; o desenho é do CSS.
                     Com `images: { unoptimized: true }` (SIS-154) não muda um byte. */
                  width={160}
                  height={160}
                  loading="lazy"
                  decoding="async"
                />
              </span>
              <span className="trajetoria-card-competencia-texto">
                <b>{competencia.titulo}</b>
                {competencia.explicacao ? <span>{competencia.explicacao}</span> : null}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
