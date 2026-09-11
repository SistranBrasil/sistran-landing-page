/**
 * SIS-183 — sonda do ESPELHO, não da preferência do sistema.
 *
 * Mede cada cena classe B/C do inventário em duas passagens sobre a MESMA
 * página, com o sistema sempre em `no-preference`:
 *   1. `full`   — `html` sem `data-motion`, movimento permitido;
 *   2. `reduce` — `html[data-motion="reduce"]`, exatamente o que o botão da
 *      interface grava (`localStorage` + atributo, antes do primeiro paint).
 *
 * O critério é "as duas passagens não podem entregar páginas diferentes do que o
 * `@media` do sistema entrega": por isso a terceira passagem, com
 * `reducedMotion: 'reduce'` no contexto do navegador, serve de gabarito. Se
 * `reduce` (botão) e `sistema` divergirem, falta espelho.
 */
import { chromium } from "file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs"

const BASE = "http://localhost:3999"

/** Cenas: rota + o que medir. `prop` é lido de `getComputedStyle`. */
const CENAS = [
  { rota: "/", alvos: [".degrau-2", ".degrau-3", ".marquee-track", ".marquee-viewport"] },
  /* As lajes moram em `/contato`, e não na home: medi-las na home dava "ausente"
     nas duas passagens, isto é, um `ok` que não provava nada. */
  { rota: "/contato", alvos: [".fundo-contato-laje--longe", ".fundo-contato-laje--perto"] },
  /* `.esg-cartao-flutua` entrou pela SIS-208: é a flutuação dos cartões das seções
     escuras, e ela nasceu com espelho `html[data-motion='reduce']` — sem estar
     nesta lista, o espelho seria o único de /esg que a sonda não confere. */
  { rota: "/esg", alvos: [".esg-selo", ".esg-turma-foto", ".esg-pratica-foto img", ".esg-apoio", ".esg-cartao-flutua"] },
  { rota: "/eventos-inovacao", alvos: [".eventos-mosaico-flutua", ".eventos-mosaico-face", ".evento-navegador"] },
  { rota: "/transformacao-legado", alvos: [".lp-partner img", ".pagehero-partida", ".pagehero-fio"] },
  { rota: "/parceiros-e-implementacoes", alvos: [".parceiros-trilha", ".parceiros-lista", ".trail-stop", ".trail-traveler"] },
]

const PROPS = ["position", "display", "transform", "opacity", "height", "width", "animationName", "visibility", "filter"]

async function medir(browser, rota, alvos, modo) {
  const contexto = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    /* `sistema` é a única passagem que liga a preferência de verdade. */
    reducedMotion: modo === "sistema" ? "reduce" : "no-preference",
  })
  if (modo === "reduce") {
    /* Gravar o ATRIBUTO aqui não serve: o script inline de `layout.tsx` roda
       depois e o REMOVE quando a preferência guardada não é `reduce` (ver a linha
       do `removeAttribute`). O que o botão faz é escrever no `localStorage`, e é
       isso que a sonda imita — assim o próprio script do site grava o atributo,
       exatamente como no navegador do visitante. */
    await contexto.addInitScript(() => {
      try {
        localStorage.setItem("sistran-motion-preference", "reduce")
      } catch (e) {}
    })
  }
  const pagina = await contexto.newPage()
  await pagina.goto(`${BASE}${rota}`, { waitUntil: "networkidle", timeout: 90000 })
  /* Diálogo de movimento, quando aparece: some pelo "Continuar". */
  const continuar = pagina.getByRole("button", { name: /continuar/i }).first()
  if (await continuar.count().catch(() => 0)) {
    await continuar.click({ timeout: 3000 }).catch(() => undefined)
  }
  await pagina.waitForTimeout(1800)

  const lido = await pagina.evaluate(
    ({ alvos, props }) => {
      const saida = {}
      for (const seletor of alvos) {
        const el = document.querySelector(seletor)
        if (!el) {
          saida[seletor] = "ausente"
          continue
        }
        const cs = getComputedStyle(el)
        saida[seletor] = props.map((p) => `${p}=${cs[p]}`).join(" ")
      }
      return saida
    },
    { alvos, props: PROPS },
  )
  await contexto.close()
  return lido
}

const browser = await chromium.launch()
let divergencias = 0

for (const { rota, alvos } of CENAS) {
  const full = await medir(browser, rota, alvos, "full")
  const botao = await medir(browser, rota, alvos, "reduce")
  const sistema = await medir(browser, rota, alvos, "sistema")

  console.log(`\n### ${rota}`)
  for (const seletor of alvos) {
    const iguais = botao[seletor] === sistema[seletor]
    if (!iguais) divergencias += 1
    console.log(`${iguais ? "  ok " : "  XX "}${seletor}`)
    if (!iguais) {
      console.log(`      botao   : ${botao[seletor]}`)
      console.log(`      sistema : ${sistema[seletor]}`)
    } else if (full[seletor] !== botao[seletor]) {
      console.log(`      (mudou com reduce, como esperado)`)
    }
  }
}

await browser.close()
console.log(`\ndivergencias botao-vs-sistema: ${divergencias}`)
