import Image from 'next/image';
import type { CSSProperties } from 'react';
import { TRAJECTORY_ANO_INICIAL, TRAJECTORY_CAPABILITIES } from '@/data/trajectory';
import { ORIGEM } from './trajectoryGeometry';

const ICONE_DE_ABERTURA = TRAJECTORY_CAPABILITIES[0]?.icon;

/**
 * A PLACA DO ÍCONE sobre a origem do traço.
 *
 * ── O 1988 VOLTOU PARA A LINHA EM 01/10, À NOITE ──────────────────────────────
 * «aqui eu quero deixar o numero 1988 como estava antes [...] mas quero sem o numero e
 * colocar o icone antes do card Castelo Costa · Coplaven · Zurich Brasil.»
 *
 * As duas metades do pedido parecem se contradizer e não se contradizem: são DUAS peças
 * diferentes na mesma caixa. O NÚMERO volta a ser o ponto de partida do traço — «como
 * estava antes» é literal, as regras arquivadas em `trajectory.css` voltaram a valer,
 * com o nó ciano a cavalo na borda direita da pílula caindo sobre o `M` do `d`. O ÍCONE é
 * que fica «sem o numero»: ele desce para a sua própria placa, ABAIXO da pílula, onde
 * encontra o topo do primeiro card — o «Castelo Costa · Coplaven · Zurich Brasil», que é
 * o nó 0 da trilha. Daí a volta ao empilhamento em COLUNA que valia antes da tarde.
 *
 * ⚠️ E CONTINUA HAVENDO UM 1988 SÓ EM CENA. Como o ano voltou para cá, a regra do CSS que
 * mostrava a pílula do canto no palco foi desfeita: no palco o canto fica só com título e
 * parágrafo; no modo estático é o inverso. Nunca os dois. O critério 2 da SIS-202 («o
 * primeiro ano visível for 1988») segue cumprido nos dois modos.
 *
 * ⚠️ A PLACA FICA EM 120px, e não volta aos 180 que tinha quando estava em coluna pela
 * última vez. Era o 180 que apertava a folga até o card (5px de sobra, medidos na época):
 * com 120 o grupo inteiro termina ~60px acima do topo do card. O pedido da tarde que
 * encolheu a placa resolvia um problema real; só a direção do empilhamento voltou.
 *
 * ── O HISTÓRICO, QUE AINDA EXPLICA A GEOMETRIA ────────────────────────────────
 * Esta peça nasceu de «mas isso deve estar ligada a linha».
 *
 * ── POR QUE É UM COMPONENTE NOVO E NÃO UM AJUSTE NO `TimelineYearIntro` ───────
 * Porque os dois moram em caixas que se movem de maneira diferente, e isso não é
 * contornável com CSS. `TimelineYearIntro` fica no CANTO do palco — posição fixa na
 * viewport, que é o que permite o título e o parágrafo terem largura de leitura. A
 * origem do traço é um ponto da TRILHA, e a trilha desliza para cima a cada quadro
 * (`translate3d(0, -(--p + 1) × --passo, 0)`). Um elemento só não pode ser as duas
 * coisas: fixado no canto, ele se descolaria do traço no primeiro pixel de rolagem —
 * que é exatamente o defeito da captura.
 *
 * Então a divisão é por natureza, não por conveniência: o que é PONTO DA LINHA (o ícone)
 * mora aqui, dentro da trilha; o que é TEXTO DE LEITURA (ano, título e parágrafo) continua
 * no canto.
 *
 * ── E O ÍCONE DO CANTO SAI DE CENA NO PALCO ───────────────────────────────────
 * ⚠️ Não há glifo duplicado na tela. No palco o CSS esconde
 * `.trajetoria-abertura-pulso` (o do canto) e mostra este; no modo estático é o
 * contrário — este componente não aparece, porque lá não existe traço em SVG onde
 * pendurar a origem.
 *
 * ── O `aria-hidden` SAIU DO CONJUNTO E FICOU SÓ NA PLACA ──────────────────────
 * Enquanto aqui só havia o glifo, marcar a caixa inteira como decoração era correto. Com
 * a pílula de volta não é mais: no palco o ano do canto está em `display: none`, que o
 * tira também do leitor de tela — se esta caixa fosse `aria-hidden`, o 1988 simplesmente
 * não existiria para quem usa leitor, e o critério 2 da SIS-202 passaria a valer só para
 * quem vê. Então o número é texto de verdade, e o `aria-hidden` desceu para a placa do
 * ícone, que é o que de fato só repete em desenho o que a pílula já diz.
 *
 * ── A PLACA CAI NO PRIMEIRO PONTO DO CAMINHO ──────────────────────────────────
 * A placa é posicionada por `--origem-x`/`--origem-y`, as MESMAS duas coordenadas que
 * `caminhoDaTrilha` escreve no `M` do `d`. Não é um valor parecido: é a mesma constante
 * `ORIGEM`, importada. É isso que garante que a placa fique sobre o ponto de partida do
 * traço em qualquer `PASSO` — e o traço CONTINUA nascendo ali, independente do que esta
 * peça mostre: quem escreve o `M` é `caminhoDaTrilha`, não este componente.
 *
 * Em VARIÁVEL e não em `top`/`left` inline, como todo o resto da trilha — o bloco base
 * desarma o palco com `inset: auto !important`, e estilo inline venceria a folha. Ver a
 * nota longa em `TrajectoryScrollytelling`.
 */
export function TimelineOrigin() {
  return (
    <div
      className="trajetoria-origem"
      style={
        {
          '--origem-x': `${ORIGEM.x}px`,
          '--origem-y': `${ORIGEM.y}px`,
        } as CSSProperties
      }
    >
      {/* O ponto de partida do traço. O nó ciano que cai sobre o `M` do `d` é o
          `::after` desta pílula — ver `trajectory.css`. */}
      <p className="trajetoria-origem-ano">{TRAJECTORY_ANO_INICIAL}</p>
      {ICONE_DE_ABERTURA ? (
        <span className="trajetoria-origem-pulso" aria-hidden>
          {/* Intrínsecos de 360 para um desenho de 120px: é 3× e não 2×, de propósito. Com
              `images: { unoptimized: true }` (SIS-154) estes dois números não mudam um byte
              do que baixa — o arquivo do disco é servido cru —, então sobrar é de graça e
              faltar serrilha em DPR 2. Baixar para 240 junto com a placa não economizaria
              nada e tiraria margem. */}
          <Image src={ICONE_DE_ABERTURA} alt="" width={360} height={360} />
        </span>
      ) : null}
    </div>
  );
}
