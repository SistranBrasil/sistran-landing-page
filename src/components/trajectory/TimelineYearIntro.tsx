import Image from 'next/image';
import { TRAJECTORY_ANO_INICIAL, TRAJECTORY_CAPABILITIES } from '@/data/trajectory';

/**
 * SIS-202 — o estado inicial do fluxo detalhado (§3 do doc): o ano, o título e o
 * texto, antes do primeiro card.
 *
 * Fica MONTADO o tempo todo, e não só no primeiro passo. Duas razões, e a segunda é
 * a que importa: (1) é de onde a linha ciano nasce — o nó do primeiro card sai
 * daqui, e um bloco que desmonta levaria a origem da linha com ele; (2) é a única
 * peça que cumpre o critério 2 («o primeiro ano visível for 1988») sem depender de
 * JavaScript. O CSS o desbota conforme o percurso avança, em vez de o remover.
 *
 * SIS-205 — o ano é pílula navy (o vocabulário de `.trajetoria-mini-selo`), e o
 * primeiro ícone de competência pulsa ao lado, só no palco. No estático o ícone
 * não entra: a fila continua só com o ano, o título e o texto.
 *
 * ── A ORDEM MUDOU EM 01/10 ────────────────────────────────────────────────────
 * «o numero deve ficar no começo antes do primeiro card e o icone logo a baixo».
 *
 * Era `[ícone] [1988]` em linha, e o defeito da captura não é só a ordem: a caixa
 * branca do ícone ficava À DIREITA da pílula, ou seja justamente na direção em que o
 * primeiro card entra, e encostava nele. Trocar para COLUNA (ano em cima, ícone
 * abaixo) tira a caixa do caminho do card e põe o número onde o pedido o quer — na
 * abertura, antes de tudo.
 *
 * ⚠️ A ORDEM É DO DOCUMENTO, não `order` no CSS. No modo estático o ícone não entra
 * (`display: none` no bloco base), então a fila continua «1988 → título → texto» e a
 * ordem lida pelo leitor de tela é a mesma que se vê. Com `order` as duas divergiriam.
 */
const ICONE_DE_ABERTURA = TRAJECTORY_CAPABILITIES[0]?.icon;

/**
 * ── A ESCRITA ENCURTA QUANDO UM CARD CHEGA AO LADO — 08/10 ────────────────────
 * «a partir desse card, quando estiver do lado [1ª geração · Empresas PME ·
 * Commercial Union · Gente Seguradora], deve mudar a escrita de "O início da nossa
 * trajetória" para apenas "Nossa trajetória", e tire a escrita "Começamos" para
 * "Uma história construída ao lado do mercado segurador."»
 *
 * Quem decide é `TrajectoryScrollytelling` (`ativo >= 1`), não este componente: o
 * índice do card em cena é estado DE LÁ, e trazer a conta para cá exigiria repetir
 * o `Math.round(--p)` num segundo lugar.
 *
 * ⚠️ UM NÓ DE TEXTO POR FRASE, e as duas versões nunca coexistem no documento. Fazer
 * as duas conviverem com uma delas apagada por CSS poria o leitor de tela a ler o
 * título duas vezes — e `aria-hidden` na que estivesse fora dependeria de a folha e
 * o atributo concordarem em qual é qual.
 */
export function TimelineYearIntro({ resumido = false }: { resumido?: boolean }) {
  return (
    <div className="trajetoria-abertura">
      <div className="trajetoria-abertura-marca">
        <p className="trajetoria-abertura-ano">{TRAJECTORY_ANO_INICIAL}</p>
        {ICONE_DE_ABERTURA ? (
          <span className="trajetoria-abertura-pulso" aria-hidden>
            {/* Intrínsecos de 320: o desenho no palco subiu para 200px e em tela de
                DPR 2 isso pede 400px de arte. Com `images: { unoptimized: true }`
                (SIS-154) estes dois números não mudam um byte do que baixa — o arquivo
                do disco é servido cru —, então sobrar é de graça e faltar serrilha. */}
            <Image src={ICONE_DE_ABERTURA} alt="" width={320} height={320} />
          </span>
        ) : null}
      </div>
      {/* A PLACA AZUL COM A MARCA — 01/10 (noite, fim): «coloque a logo da sistran com um
          quadrado de fundo azul». `aria-hidden` porque a marca da própria casa já está no
          cabeçalho da página e no rodapé; aqui ela é assinatura visual da abertura, não
          informação nova, e anunciá-la faria o leitor de tela dizer «Sistran» uma terceira
          vez na mesma rota.

          ⚠️ A ARTE É A CLARA (`sistran-corp-logo.png`, 560×374), e é a escolha certa porque
          a placa é azul: é o mesmo arquivo que `Footer.tsx` usa sobre o marinho do rodapé.
          A variante escura desapareceria no fundo. */}
      <span className="trajetoria-abertura-marca-placa" aria-hidden>
        <Image src="/images/sistran-corp-logo.png" alt="" width={560} height={374} />
      </span>

      <h4 className="trajetoria-abertura-titulo">
        {resumido ? 'Nossa trajetória' : 'O início da nossa trajetória'}
      </h4>
      <p className="trajetoria-abertura-texto">
        {resumido
          ? 'Uma história construída ao lado do mercado segurador.'
          : 'Começamos uma história construída ao lado do mercado segurador.'}
      </p>
    </div>
  );
}
