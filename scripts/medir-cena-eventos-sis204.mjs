/**
 * SIS-204 — sonda dos TRÊS ajustes da cena `EventsSpotlight`, e só deles.
 *
 * Ela não substitui `scripts/medir-cena-eventos.mjs` (a guarda da SIS-167, que
 * afere sobreposição de vagas e reorganização da faixa na troca): mede o que esta
 * issue pede e o que esta issue pode QUEBRAR.
 *
 *   1. TÍTULO ÚNICO — quantos «Eventos & Inovação» dominantes estão em quadro em
 *      cada passo da rolagem da passagem `hero -> cena`. O critério é literal:
 *      elemento com o texto, dentro da janela, com `opacity` efetiva > 0,05.
 *      Dois em quadro no mesmo passo = defeito.
 *   2. SOMBRA — `box-shadow` computado do cartão, da arte da miniatura e da placa
 *      do rótulo. A conferência de "azul claro e não navy" é de leitura humana,
 *      então a sonda só imprime o valor para o comentário da issue.
 *   3. RÓTULO INTEIRO — para cada uma das quinze vagas: `scrollHeight` contra
 *      `clientHeight` (texto cortado?) e `scrollWidth` contra `clientWidth`. Mais
 *      a soma das alturas das vagas contra a altura da faixa, que é o que estoura
 *      quando o rótulo cresce, e a checagem de que o palco ainda cabe em `100svh`.
 *
 * Captura em 1440 nos dois momentos (passagem e palco) — é o que o item (v) dos
 * critérios pede. `--modo=antes|depois` só muda o nome do arquivo.
 */
import fs from "node:fs"
import { chromium } from "file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs"

/* `BASE_URL` no ambiente, como em `medir-cena-eventos.mjs`: mais de um servidor de
   desenvolvimento pode estar de pé nesta máquina, e fixar a porta no script obriga a
   editá-lo para medir. */
const BASE = process.env.BASE_URL ?? "http://localhost:3999"
const ROTA = "/eventos-inovacao"
const SAIDA = "docs/capturas"
const modo = (process.argv.find((a) => a.startsWith("--modo=")) ?? "--modo=antes").split("=")[1]

fs.mkdirSync(SAIDA, { recursive: true })

const TITULO = "Eventos & Inovação"

async function abrir(browser, largura, altura) {
  const contexto = await browser.newContext({
    viewport: { width: largura, height: altura },
    deviceScaleFactor: 1,
    reducedMotion: "no-preference",
  })
  const pagina = await contexto.newPage()
  await pagina.goto(`${BASE}${ROTA}`, { waitUntil: "networkidle", timeout: 120000 })
  const continuar = pagina.getByRole("button", { name: /continuar/i }).first()
  if (await continuar.count().catch(() => 0)) {
    await continuar.click({ timeout: 3000 }).catch(() => undefined)
  }
  await pagina.waitForTimeout(1200)
  return { contexto, pagina }
}

/** Quantos títulos dominantes visíveis, e onde. */
const contarTitulos = (pagina, texto) =>
  pagina.evaluate((texto) => {
    const nos = [...document.querySelectorAll("h1, h2")].filter(
      (n) => n.textContent.replace(/\s+/g, " ").trim() === texto,
    )
    const visiveis = []
    for (const n of nos) {
      const r = n.getBoundingClientRect()
      if (r.bottom <= 0 || r.top >= innerHeight || r.width === 0) continue
      /* `opacity` efetiva: a do nó e a dos ancestrais, porque a cessão do título
         é feita por opacidade num wrapper. */
      let op = 1
      for (let e = n; e && e !== document.documentElement; e = e.parentElement) {
        op *= Number(getComputedStyle(e).opacity)
      }
      if (op > 0.05) visiveis.push(`${n.tagName}@${Math.round(r.top)} op=${op.toFixed(2)}`)
    }
    return visiveis
  }, texto)

async function medir(browser, largura, altura) {
  const { contexto, pagina } = await abrir(browser, largura, altura)
  const rotulo = `${largura}x${altura}`
  console.log(`\n=== ${rotulo} ===`)

  /* 1. Passagem hero -> cena, de 0 até o palco preso, de 10% de janela por passo. */
  const alturaHero = await pagina.evaluate(() => {
    const s = document.querySelector("#topo")
    return s ? Math.round(s.getBoundingClientRect().height) : 0
  })
  console.log(`hero: ${alturaHero}px`)
  let piorPasso = 0
  for (let y = 0; y <= alturaHero + altura; y += Math.round(altura * 0.1)) {
    await pagina.evaluate((y) => scrollTo({ top: y, behavior: "instant" }), y)
    await pagina.waitForTimeout(160)
    const vis = await contarTitulos(pagina, TITULO)
    piorPasso = Math.max(piorPasso, vis.length)
    if (vis.length > 1) console.log(`  XX y=${y} -> ${vis.length}: ${vis.join(" | ")}`)
  }
  console.log(`titulos dominantes simultaneos, maximo na passagem: ${piorPasso}`)

  /* 2 e 3 com o palco preso: rola até o meio da cena. */
  await pagina.evaluate(() => {
    const s = document.querySelector("#eventos")
    scrollTo({ top: s.offsetTop + Math.round(s.offsetHeight * 0.4), behavior: "instant" })
  })
  await pagina.waitForTimeout(700)

  const lido = await pagina.evaluate(() => {
    const cs = (sel) => {
      const el = document.querySelector(sel)
      return el ? getComputedStyle(el).boxShadow : "ausente"
    }
    const faixas = [...document.querySelectorAll(".eventos-destaque-coluna")].map((f) => {
      const rf = f.getBoundingClientRect()
      const vagas = [...f.querySelectorAll(".eventos-vaga")]
      const soma = vagas.reduce((t, v) => t + v.getBoundingClientRect().height, 0)
      const gap = Number.parseFloat(getComputedStyle(f).rowGap) || 0
      return {
        classe: f.className.split(" ").pop(),
        faixa: Math.round(rf.height),
        largura: Math.round(rf.width),
        x: Math.round(rf.left),
        direita: Math.round(rf.right),
        vagas: vagas.length,
        soma: Math.round(soma + gap * (vagas.length - 1)),
      }
    })
    const rotulos = [...document.querySelectorAll(".eventos-vaga-rotulo")].map((r) => {
      const rr = r.getBoundingClientRect()
      return {
        texto: r.textContent.trim().slice(0, 40),
        cortadoV: r.scrollHeight - r.clientHeight > 1,
        cortadoH: r.scrollWidth - r.clientWidth > 1,
        h: Math.round(rr.height),
        w: Math.round(rr.width),
        linhas: Math.round(rr.height / Number.parseFloat(getComputedStyle(r).lineHeight)),
      }
    })
    const palco = document.querySelector(".eventos-destaque-palco")
    const cartao = document.querySelector(".eventos-destaque-cartao")
    const rc = cartao.getBoundingClientRect()
    const rp = palco.getBoundingClientRect()
    return {
      sombras: {
        cartao: cs(".eventos-destaque-cartao"),
        arte: cs(".eventos-vaga-arte"),
        placa: cs(".eventos-vaga-rotulo"),
        item_mobile: cs(".eventos-lista-item"),
      },
      faixas,
      rotulos,
      palco: { h: Math.round(rp.height), transborda: rp.height > innerHeight + 1 },
      cartao: {
        x: Math.round(rc.left),
        direita: Math.round(rc.right),
        emQuadro: rc.top >= -1 && rc.bottom <= innerHeight + 1,
      },
      contadorEmQuadro: (() => {
        const c = document.querySelector(".eventos-destaque-contador")
        const r = c.getBoundingClientRect()
        return r.bottom <= innerHeight + 1
      })(),
    }
  })

  console.log("sombras:")
  for (const [k, v] of Object.entries(lido.sombras)) console.log(`  ${k}: ${v}`)
  for (const f of lido.faixas) {
    const cabe = f.soma <= f.faixa
    console.log(
      `${cabe ? "  ok " : "  XX "}${f.classe}: ${f.vagas} vagas somam ${f.soma}px em faixa de ${f.faixa}px · x ${f.x}..${f.direita} (largura ${f.largura})`,
    )
  }
  console.log(
    `folga faixa->cartao: esq ${lido.cartao.x - lido.faixas[0].direita}px · dir ${lido.faixas[1] ? lido.faixas[1].x - lido.cartao.direita : "?"}px`,
  )
  const cortados = lido.rotulos.filter((r) => r.cortadoV || r.cortadoH)
  console.log(`rotulos: ${lido.rotulos.length}, cortados: ${cortados.length}`)
  for (const r of lido.rotulos) {
    console.log(
      `  ${r.cortadoV || r.cortadoH ? "XX" : "ok"} ${r.linhas}L ${r.w}x${r.h} "${r.texto}"`,
    )
  }
  console.log(
    `palco ${lido.palco.h}px (transborda: ${lido.palco.transborda}) · cartao em quadro: ${lido.cartao.emQuadro} · contador em quadro: ${lido.contadorEmQuadro}`,
  )

  if (largura === 1440) {
    await pagina.screenshot({ path: `${SAIDA}/sis204-${modo}-palco-1440.png` })
    /* Passagem: o passo em que a base do hero está a meia janela do topo — o
       instante em que os dois títulos competiam. */
    await pagina.evaluate((h) => scrollTo({ top: Math.round(h * 0.72), behavior: "instant" }), alturaHero)
    await pagina.waitForTimeout(500)
    await pagina.screenshot({ path: `${SAIDA}/sis204-${modo}-passagem-1440.png` })
  }
  await contexto.close()
}

const browser = await chromium.launch()
for (const [w, h] of [
  [1440, 900],
  [1366, 768],
  [1024, 800],
]) {
  await medir(browser, w, h)
}
await browser.close()
