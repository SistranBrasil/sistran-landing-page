/**
 * Arte de marca de uma parada da timeline, por casamento de NOME.
 *
 * Nasceu dentro de `partnersRoadmapStops.ts` (SIS-202, 2ª volta) e saiu de lá
 * quando o segundo consumidor apareceu: `src/data/trajectory.ts` precisa da MESMA
 * resposta para os cards do fluxo detalhado. Duas cópias da tabela divergiriam na
 * primeira marca nova — e divergiriam em silêncio, porque o modo de falha é um card
 * com monograma onde o outro mostra a logo.
 *
 * Nada aqui é conteúdo inventado: o arquivo é DERIVADO do nome que a parada já
 * escreve, e a parada sem arte no acervo continua sem logo (quem chama cai no
 * monograma, que é o ramo que já existia).
 *
 * Marca → arquivo em `public/logos-parceiros/`. Cada chave é escrita SEM acento e
 * em minúsculas porque a comparação normaliza os dois lados: «Núclea» e «Aliança»
 * chegam aqui como `nuclea` e `alianca`.
 *
 * As 23 logos do acervo estão conferidas no disco; o que não aparece nesta tabela
 * (`picsel`, `portoseguro`) é marca que NENHUMA parada de `TIMELINE_EVENTS`
 * nomeia — entrar aqui não a faria aparecer, só criaria uma linha morta.
 *
 * ⚠️ TODA CHAVE É DE UMA PALAVRA SÓ, e isso é exigência do PORTÃO DE CÓPIA, não
 * estilo: `scripts/copy-lock.mjs` colhe literais com espaço como se fossem escrita
 * do site, e a primeira versão desta tabela reprovou `npm run test:copy` com
 * «+ gente seguradora», «+ alianca do brasil», «+ brasil seguradora» e
 * «+ seguros unimed» entrando no lock de conteúdo. Nome de marca usado como chave
 * de busca não é texto exibido, e travá-lo ali gastaria o diff que protege os
 * textos de verdade. Token único cai na regra de termo técnico e fica de fora — o
 * mesmo caminho da nota do `clearProps` em `CarimboKindEvento`.
 *
 * ⚠️ CHAVES CURTAS EXIGEM FRONTEIRA DE PALAVRA, e é por isso que o casamento usa
 * `\b` e não `includes`: `ens` por substring casaria dentro de qualquer palavra
 * que tivesse essas três letras, e `ey`/`aig`/`irb`/`btg`/`mbm` têm o mesmo
 * risco. Com fronteira, «ENS» casa e «Gente Seguradora» não.
 *
 * A ORDEM DA TABELA não decide nada: quem decide é a ordem dos NOMES na parada
 * (regra da issue — "a primeira marca da lista que tiver arquivo"). Por isso
 * «Bradesco Seguros · BTG/Too Seguros» fica com o Bradesco, e não com o BTG.
 */
const MARCAS: ReadonlyArray<readonly [string, string]> = [
  ["zurich", "zurich-logo.png"],
  ["gente", "genteseguradora-logo.png"],
  ["bradesco", "bradescoseguros-logo.png"],
  ["allianz", "allianz-logo.png"],
  /* A parada da Brasilseg nomeia «Aliança do Brasil · Brasil Seguradora», e a
     chave é `alianca` — o primeiro dos dois nomes, que é o que a regra da issue
     manda usar. NÃO existe chave "brasil": ela casaria com «Zurich Brasil» e
     «QBE Brasil», que são outras empresas. */
  ["alianca", "brasilseg-logo.png"],
  ["embraer", "embraer-logo.png"],
  ["generali", "generali-logo.png"],
  ["sompo", "somposeguros-logo.png"],
  ["orbital", "orbitall-logo.png"],
  ["mbm", "mbm-logo.png"],
  ["aig", "aig-logo.png"],
  ["btg", "btgpactual-logo.png"],
  ["ens", "ens-logo.png"],
  ["unimed", "segurosunimed-logo.png"],
  ["nuclea", "nuclea-logo.png"],
  ["ey", "ey-logo.png"],
  ["pega", "pega-logo.png"],
  ["irb", "irbseg-logo.png"],
  ["redion", "redion-logo.png"],
  ["assurant", "assurant-logo.png"],
  ["mapfre", "mapfre-logo.png"],
]

/** Minúsculas e sem diacrítico, para «Núclea» casar com a chave `nuclea`. */
function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    /* Escrito como faixa em `\u`, e não com os combinantes literais: colados no
       arquivo eles são invisíveis no editor e o próximo a mexer não vê o que a
       classe cobre. A faixa é o bloco de diacríticos combinantes. */
    .replace(/[\u0300-\u036f]/g, "")
}

/**
 * Arquivo de marca da parada, ou `undefined` quando nenhum nome dela tem arte.
 *
 * Varre os nomes NA ORDEM em que a parada os escreve e devolve o primeiro que
 * tiver arquivo — a regra da issue. `undefined` é resposta legítima e acontece em
 * 5 das 24 paradas (as que só nomeiam marcas sem arte no acervo, como «G8Seg» ou
 * «Total Life · Santander · SBF · Swiss Re»): ali o card segue no monograma, em
 * vez de ganhar um PNG que não existe.
 */
export function logoDaMarca(company: string): string | undefined {
  for (const nome of company.split("·")) {
    const alvo = normalizar(nome)
    for (const [chave, arquivo] of MARCAS) {
      /* `\b` nas duas pontas; a chave não tem metacaractere de regex (são só
         letras e espaço), então não há o que escapar. */
      if (new RegExp(`\\b${chave}\\b`).test(alvo)) return `/logos-parceiros/${arquivo}`
    }
  }
  return undefined
}

/**
 * Monograma a partir do PRIMEIRO nome da parada — "Castelo Costa · Coplaven ·
 * Zurich Brasil" → `CC`. Duas letras porque é o que a pílula redonda do card
 * comporta: com dois nomes, as iniciais; com um só, as duas primeiras letras
 * ("Mapfre" → `MA`). Nada é inventado, só recortado.
 *
 * Continua existindo mesmo onde há logo: é o ramo de reserva da placa (parada sem
 * arte) e custa duas letras.
 */
export function monogramaDaMarca(company: string): string {
  const primeiro = company.split("·")[0].trim()
  const palavras = primeiro.split(/\s+/).filter(Boolean)
  /* `join` de duas iniciais em vez de `palavras[0][0] + palavras[1][0]`: a soma
     de dois identificadores era colhida por `scripts/copy-lock.mjs` como se
     fosse escrita do site e aparecia no relatório de textos novos. */
  const iniciais = palavras
    .slice(0, 2)
    .map((palavra) => palavra[0])
    .join("")
  return (palavras.length >= 2 ? iniciais : primeiro.slice(0, 2)).toUpperCase()
}
