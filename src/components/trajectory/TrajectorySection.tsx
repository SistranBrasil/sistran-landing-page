import './trajectory.css';
import CarimboBatida from '@/components/CarimboBatida';
import { anoAtual } from '@/data/trajectory';
import { TrajectoryOverview } from './TrajectoryOverview';
import { TrajectoryScrollytelling } from './TrajectoryScrollytelling';

/**
 * SIS-202 — «Nossa trajetória» em `/parceiros-e-implementacoes`: preview compacta
 * seguida do fluxo detalhado controlado pela rolagem. Especificação completa em
 * `docs/implantacoes.md`.
 *
 * ⚠️ O DOC ABRE DIZENDO `/quem-somos`. NÃO É LÁ. A issue fecha o alvo em
 * `/parceiros-e-implementacoes` — é esta rota que tinha a linha do tempo, é dela que
 * vêm os dados (`src/data/timeline.ts`) e é aqui que a seção `#linha-do-tempo` já
 * existia. `/quem-somos` não é tocada.
 *
 * ⚠️ UMA `<section>` NO NÍVEL DE CIMA, E É REQUISITO DE LAYOUT, NÃO ESTILO.
 * O navy de `#implementacoes` não está escrito nela: vem da alternância
 * `main > section:nth-of-type(even)` do `globals.css`, que conta IRMÃOS do tipo
 * `section`. Esta rota já perdeu esse painel uma vez por causa de um nó a mais (ver
 * o aviso em `parceiros-e-implementacoes/page.tsx`). `RoadmapTrail`, que esta seção
 * substitui, também devolvia exatamente uma `<section>`: a contagem fica
 * `#parceiros` (1), `#implementacoes` (2, navy), `#linha-do-tempo` (3, creme).
 * Quem for dividir isto em duas seções irmãs inverte a paridade da página inteira.
 *
 * O ANO CORRENTE é lido AQUI, uma vez, e desce por prop: é o selo do fim da
 * miniatura e o marcador do fim da linha, e os dois têm de dizer o mesmo número.
 * Componente de servidor, então é o ano do build/da requisição — e não há
 * divergência de hidratação, porque o cliente recebe o valor pronto em vez de
 * chamar `new Date()` por conta própria.
 *
 * ── SIS-205 · O CABEÇALHO TEXTUAL SAIU, O CARIMBO ENTROU ─────────────────────
 *
 * A tag «Implementações» e o título «Linha do tempo» foram retirados (o JSX de
 * então está preservado abaixo, no comentário do mount). No lugar entra a arte
 * `public/carimbo-trajetoria-ticket-outline-0757c7.png` pelo `CarimboBatida`, que
 * é o mesmo padrão da capa desta rota e das outras seis peças da casa.
 *
 * ⚠️ O `<h2>` NÃO PODIA SIMPLESMENTE DESAPARECER, e é por isso que existe um
 * `sr-only` no lugar dele. Esta `<section>` declara `aria-labelledby`, e o nó que
 * ele aponta era justamente o título removido: sem o substituto, a referência
 * ficaria pendurada num id inexistente — que é pior que seção sem nome, porque o
 * leitor de tela anuncia uma região vazia. O `<h2>` também é o que segura a
 * hierarquia: o `<h3>` «De 1988 ao presente» da preview precisa de um nível 2
 * acima dele. A issue prevê exatamente esta saída («um `h2` sr-only "Nossa
 * trajetória"»).
 *
 * E é o que torna o `alt` do carimbo VAZIO a resposta certa, não um descuido: com
 * o `sr-only` ao lado dizendo a mesma frase, um `alt` preenchido faria a região
 * ser anunciada duas vezes. É o caso que o próprio `CarimboBatida` documenta na
 * prop («Vazio só se houver um equivalente textual ao lado»).
 *
 * `gatilho="viewport"` e não o padrão `'rota'`: esta seção é a TERCEIRA da página,
 * milhares de pixels abaixo da dobra. Com o gatilho de rota a batida aconteceria
 * com a peça fora de quadro e quem rolasse até aqui encontraria o carimbo já
 * assentado — o defeito que o docblock do componente nomeia. É a mesma escolha que
 * o carimbo de `#parceiros` já faz nesta rota.
 *
 * DIMENSÕES MEDIDAS NO ARQUIVO, não estimadas: 741x285 (cabeçalho IHDR do PNG). É
 * desse par que `CarimboBatida` monta o `--carimbo-batida-ar`, e é por isso que
 * errar aqui achata a cápsula em vez de dar erro.
 */
export function TrajectorySection({ id }: { id?: string }) {
  const anoFinal = anoAtual();

  return (
    <section id={id} className="trajetoria" aria-labelledby="trajetoria-titulo">
      <div className="trajetoria-quadro">
        <div className="trajetoria-cabecalho">
          {/* SIS-205 — O CABEÇALHO TEXTUAL SAIU DAQUI. O JSX de então, na íntegra,
              para quem precisar do caminho de volta:

              <span className="trajetoria-eyebrow">Implementações</span>
              <h2 id="trajetoria-titulo" className="trajetoria-cabecalho-titulo">
                Linha do tempo
              </h2>

              (A nota que acompanhava a tag — «não usar a `.eyebrow` global aqui,
              ela é `#7dd3fc` para painéis escuros e esta seção é creme» — segue
              valendo para quem devolver texto a este cabeçalho. A classe
              `.trajetoria-eyebrow` FICA na folha, agora sem consumidor — ver a
              nota em `TrajectoryOverview.tsx`, que retirou o outro uso.)

              O rótulo «Implementações» era, além disso, o mesmo texto da tag da
              seção navy imediatamente acima — duas tags idênticas em seções
              vizinhas. Essa seção não é tocada por esta issue e continua com a
              dela. */}
          <h2 id="trajetoria-titulo" className="sr-only">
            Nossa trajetória
          </h2>
          <CarimboBatida
            src="/carimbo-trajetoria-ticket-outline-0757c7.png"
            /* Vazio porque o `<h2>` acima diz a mesma frase — ver o docblock. */
            alt=""
            larguraIntrinseca={741}
            alturaIntrinseca={285}
            className="trajetoria-carimbo"
            gatilho="viewport"
          />
        </div>

        <TrajectoryOverview anoFinal={anoFinal} />
      </div>

      <TrajectoryScrollytelling anoFinal={anoFinal} />
    </section>
  );
}
