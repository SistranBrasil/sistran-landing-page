/**
 * SIS-183 — inventário das `@media (prefers-reduced-motion: …)` de `src/**\/*.css`.
 *
 * Só lista e classifica; não altera arquivo nenhum. Para cada bloco, extrai as
 * regras que mexem em LAYOUT (a classe B/C da issue) e procura, no mesmo
 * arquivo, um seletor com `[data-motion="reduce"]` que mencione a mesma chave.
 * "Chave" é a última classe/id/atributo do primeiro seletor da regra — é o que o
 * espelho precisa citar para valer.
 *
 * A resposta é uma PISTA, não um veredito: o espelho pode existir com chave
 * escrita de outro jeito (ou em outro arquivo). Todo `!!` é conferido à mão.
 */
import fs from "node:fs"
import path from "node:path"

const LAYOUT = new Set(
  [
    "position", "display", "height", "min-height", "max-height",
    "width", "min-width", "max-width", "top", "bottom", "left", "right", "inset",
    "transform", "translate", "visibility", "overflow", "overflow-x", "overflow-y",
    "grid-template-columns", "grid-template-rows", "grid-auto-flow",
    "flex-direction", "flex-wrap", "order", "opacity", "clip-path",
    "content-visibility", "scroll-snap-type", "padding", "margin", "gap",
  ],
)

const semComentario = (texto) => texto.replace(/\/\*[\s\S]*?\*\//g, "")

function css(dir, saida = []) {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, item.name)
    if (item.isDirectory()) css(p, saida)
    else if (item.name.endsWith(".css")) saida.push(p)
  }
  return saida
}

const linhas = []

for (const arquivo of css("src")) {
  const cru = fs.readFileSync(arquivo, "utf8")
  const texto = semComentario(cru)
  /* Seletores de espelho do arquivo: qualquer cabeçalho de regra que cite
     `[data-motion="reduce"]`. */
  const espelhos = texto.match(/[^{}]*\[data-motion=['"]?reduce['"]?\][^{]*\{/g) ?? []
  const nome = arquivo.split(path.sep).join("/")

  const at = /@media[^{]*prefers-reduced-motion[^{]*\{/g
  let m
  while ((m = at.exec(texto))) {
    let i = m.index + m[0].length
    let nivel = 1
    while (i < texto.length && nivel > 0) {
      if (texto[i] === "{") nivel += 1
      else if (texto[i] === "}") nivel -= 1
      i += 1
    }
    const corpo = texto.slice(m.index + m[0].length, i - 1)
    const consulta = m[0].replace(/\s+/g, " ").trim()

    for (const regra of corpo.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
      const seletor = regra[1].replace(/\s+/g, " ").trim()
      const props = [...regra[2].matchAll(/([a-z-]+)\s*:/g)].map((p) => p[1])
      const layout = props.filter((p) => LAYOUT.has(p))
      if (layout.length === 0) continue

      const primeiro = seletor.split(",")[0].trim()
      const chave =
        primeiro.split(/[\s>+~]+/).filter((t) => /^[.#[]/.test(t)).pop() ?? primeiro
      const temEspelho = espelhos.some((e) => e.includes(chave))

      linhas.push({ nome, consulta, seletor, layout: layout.join(" "), chave, temEspelho })
    }
  }
}

for (const l of linhas) {
  console.log(
    `${l.temEspelho ? "OK" : "!!"} | ${l.nome} | ${l.consulta} | ${l.seletor.slice(0, 110)} | [${l.layout}] | chave=${l.chave}`,
  )
}
console.log(
  `\nregras com layout: ${linhas.length} · sem espelho aparente: ${linhas.filter((l) => !l.temEspelho).length}`,
)
