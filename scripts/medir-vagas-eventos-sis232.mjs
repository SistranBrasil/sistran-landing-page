/**
 * SIS-232 — sonda das VAGAS LATERAIS da cena `EventsSpotlight`: tamanho e
 * distância até o cartão em destaque.
 *
 * Ela não substitui `medir-cena-eventos.mjs` (guarda da SIS-167: sobreposição e
 * reorganização da faixa) nem `medir-cena-eventos-sis204.mjs` (título único,
 * sombra, rótulo inteiro). Mede o que ESTA issue pede — "maiores e mais perto" —
 * e o que ela pode quebrar, que é exatamente o que aquelas duas guardam:
 *
 *   1. TAMANHO — área da arte e largura da placa do rótulo, por vaga. É o número
 *      do critério "claramente maiores": comparar antes/depois em px, não a olho.
 *   2. DISTÂNCIA — borda interna da faixa contra a borda do cartão, e a vaga MAIS
 *      PRÓXIMA do cartão contra a mesma borda. As duas, porque o recuo do
 *      `nth-child` faz a vaga avançar além da faixa: é a vaga que colide, não a
 *      faixa.
 *   3. SOBREPOSIÇÃO vaga↔cartão e vaga↔vaga (asserções 20/21 da SIS-167), com a
 *      excursão lateral da flutuação SUBTRAÍDA da folga — uma folga menor que a
 *      amplitude do `@keyframes` é sobreposição que só aparece em certo instante
 *      do ciclo, e medir o quadro parado não a pega.
 *   4. EMPILHAMENTO — soma das alturas das vagas e PIOR VÃO contra a altura da
 *      faixa. É o teto vertical que reprova arte maior (a nota de
 *      `--evt-arte-fr`, no CSS, conta por quê).
 *   5. RÓTULO INTEIRO — `scrollHeight` contra `clientHeight` nas placas, porque
 *      arte maior estreita a placa e devolve linha aos títulos longos (SIS-204).
 *
 * As janelas são os piores casos históricos declarados na issue (1024 e 1366)
 * mais 1280 (onde começa o primeiro degrau), 1440 (o alvo do critério) e
 * 1600x900 / 1670x940, que é onde a guarda da SIS-167 já reprovou por vão.
 *
 * `--modo=antes|depois` só muda o nome dos arquivos.
 */
import fs from "node:fs"
import { chromium } from "file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs"

const BASE = process.env.BASE_URL ?? "http://localhost:3999"
const ROTA = "/eventos-inovacao"
const SAIDA = "docs/medidas/vagas-eventos-sis232"
const CAPTURAS = "docs/capturas"
const modo = (process.argv.find((a) => a.startsWith("--modo=")) ?? "--modo=antes").split("=")[1]

fs.mkdirSync(SAIDA, { recursive: true })
fs.mkdirSync(CAPTURAS, { recursive: true })

const JANELAS = [
  { w: 1024, h: 768 },
  { w: 1280, h: 800 },
  { w: 1366, h: 768 },
  { w: 1440, h: 900 },
  { w: 1600, h: 900 },
  { w: 1670, h: 940 },
]

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

/** Rola até a cena de destaque estar em quadro e as colunas montadas. */
async function levarAoPalco(pagina) {
  await pagina.evaluate(() => {
    const palco = document.querySelector(".eventos-destaque")
    if (palco) palco.scrollIntoView({ block: "center", behavior: "instant" })
  })
  await pagina.waitForTimeout(1500)
  /* ⚠️ GUARDA DE FOLHA APLICADA, e ela existe por um número medido errado.
     Na primeira passada desta sonda, 1600x900 e 1670x940 devolveram `--evt-vaga-w`
     VAZIA e vaga de 1584px (a largura da janela menos a barra) — a vaga sem
     `width`, isto é, a folha do componente ainda não valia naquele quadro. Isoladas,
     as duas janelas medem certo; o defeito só aparece na quinta e sexta abas da
     mesma sessão, e é transitório. Medir assim produz "vaga sobre o cartão" onde
     não há nada, e o risco real é o inverso: um `depois` verde por acidente.
     Por isso a espera é pela VARIÁVEL RESOLVIDA e não por tempo — se ela não
     chegar, a sonda estoura em vez de imprimir número inventado. */
  await pagina.waitForFunction(
    () => {
      const palco = document.querySelector(".eventos-destaque")
      if (!palco) return false
      return getComputedStyle(palco).getPropertyValue("--evt-vaga-w").trim() !== ""
    },
    null,
    { timeout: 20000 },
  )
}

const medir = (pagina) =>
  pagina.evaluate(() => {
    const num = (v) => Math.round(v * 10) / 10
    const caixa = (n) => {
      const r = n.getBoundingClientRect()
      return { x: num(r.x), y: num(r.y), w: num(r.width), h: num(r.height), r: num(r.right), b: num(r.bottom) }
    }

    const palco = document.querySelector(".eventos-destaque")
    if (!palco) return { erro: "sem .eventos-destaque em quadro" }

    const estilo = getComputedStyle(palco)
    const vars = Object.fromEntries(
      ["--evt-vaga-w", "--evt-faixa-w", "--evt-arte-fr", "--evt-rotulo-fs", "--evt-float-x"].map((k) => [
        k,
        estilo.getPropertyValue(k).trim(),
      ]),
    )
    /* A amplitude lateral do `@keyframes` sai da própria variável, para a sonda
       não guardar uma segunda cópia de um número que o CSS pode mudar. */
    const floatX = parseFloat(vars["--evt-float-x"]) || 0

    /* O cartão central: é a caixa que nenhuma vaga pode tocar. */
    const cartao = document.querySelector(".eventos-destaque-cartao")
    const cartaoCaixa = cartao ? caixa(cartao) : null

    const colunas = [...document.querySelectorAll(".eventos-destaque-coluna")].map((col) => {
      const lado = col.classList.contains("eventos-destaque-coluna--esq") ? "esq" : "dir"
      const cc = caixa(col)
      const vagas = [...col.querySelectorAll(".eventos-vaga")].map((v) => {
        const arte = v.querySelector(".eventos-vaga-arte, .eventos-vaga-icone")
        const rotulo = v.querySelector(".eventos-vaga-rotulo")
        const ac = arte ? caixa(arte) : null
        const rc = rotulo ? caixa(rotulo) : null
        return {
          titulo: (rotulo?.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 40),
          destaque: v.classList.contains("eventos-vaga--destaque"),
          caixa: caixa(v),
          arte: ac,
          arteArea: ac ? Math.round(ac.w * ac.h) : null,
          rotuloW: rc ? rc.w : null,
          /* Rótulo cortado: o critério da SIS-204, repetido aqui porque arte
             maior estreita a placa. +1 de tolerância para arredondamento. */
          rotuloCortado: rotulo ? rotulo.scrollHeight > rotulo.clientHeight + 1 : null,
          rotuloLinhas: rotulo
            ? Math.round(rotulo.scrollHeight / (parseFloat(getComputedStyle(rotulo).lineHeight) || 1))
            : null,
        }
      })

      /* Borda VIRADA PARA O CARTÃO, da faixa e da vaga mais avançada. */
      const bordaInternaFaixa = lado === "esq" ? cc.r : cc.x
      const avancoVaga =
        lado === "esq"
          ? Math.max(...vagas.map((v) => v.caixa.r))
          : Math.min(...vagas.map((v) => v.caixa.x))

      /* Folga até o cartão, já descontada a excursão lateral da flutuação. */
      const folgaFaixa = cartaoCaixa
        ? lado === "esq"
          ? cartaoCaixa.x - bordaInternaFaixa
          : bordaInternaFaixa - cartaoCaixa.r
        : null
      const folgaVaga = cartaoCaixa
        ? lado === "esq"
          ? cartaoCaixa.x - avancoVaga
          : avancoVaga - cartaoCaixa.r
        : null

      /* Empilhamento: soma e PIOR VÃO. O vão é o que reprova, não a soma. */
      const ordenadas = [...vagas].sort((a, b) => a.caixa.y - b.caixa.y)
      const vaos = ordenadas.slice(1).map((v, i) => num(v.caixa.y - ordenadas[i].caixa.b))
      const soma = num(vagas.reduce((s, v) => s + v.caixa.h, 0))

      /* Sobreposição vaga↔vaga: par cujo vão é menor que a projeção da
         inclinação (~1,7px por ponta, a conta está em `--evt-float-y`). */
      const paresApertados = vaos.filter((g) => g < 3.4).length

      return {
        lado,
        caixa: cc,
        vagas,
        bordaInternaFaixa,
        avancoVaga,
        folgaFaixa: folgaFaixa === null ? null : num(folgaFaixa),
        folgaVagaBruta: folgaVaga === null ? null : num(folgaVaga),
        folgaVagaComFlutuacao: folgaVaga === null ? null : num(folgaVaga - floatX),
        soma,
        alturaFaixa: cc.h,
        piorVao: vaos.length ? Math.min(...vaos) : null,
        paresApertados,
        vagasCobrindoCartao: folgaVaga !== null && folgaVaga - floatX < 0,
        rotulosCortados: vagas.filter((v) => v.rotuloCortado).length,
        arteAreaMedia: Math.round(
          vagas.filter((v) => v.arteArea).reduce((s, v) => s + v.arteArea, 0) /
            Math.max(1, vagas.filter((v) => v.arteArea).length),
        ),
        vagaLargura: num(vagas[0]?.caixa.w ?? 0),
      }
    })

    return { vars, floatX, cartao: cartaoCaixa, colunas }
  })

const browser = await chromium.launch()
const relatorio = { modo, quando: new Date().toISOString(), janelas: [] }

for (const { w, h } of JANELAS) {
  const { contexto, pagina } = await abrir(browser, w, h)
  await levarAoPalco(pagina)
  const medida = await medir(pagina)
  relatorio.janelas.push({ largura: w, altura: h, ...medida })

  if (w === 1440 || w === 1024) {
    await pagina.screenshot({ path: `${CAPTURAS}/sis232-vagas-${w}x${h}-${modo}.png` })
  }
  await contexto.close()
}

await browser.close()

const arquivo = `${SAIDA}/${modo}.json`
fs.writeFileSync(arquivo, JSON.stringify(relatorio, null, 2))

/* Resumo em uma linha por janela e lado — é o que vai para o comentário da issue. */
console.log(`\nSIS-232 · ${modo}\n`)
for (const j of relatorio.janelas) {
  if (j.erro) {
    console.log(`${j.largura}x${j.altura}  ERRO: ${j.erro}`)
    continue
  }
  console.log(
    `${j.largura}x${j.altura}  vaga-w=${j.vars["--evt-vaga-w"]} faixa-w=${j.vars["--evt-faixa-w"]} arte-fr=${j.vars["--evt-arte-fr"]}`,
  )
  for (const c of j.colunas) {
    console.log(
      `   ${c.lado}: vaga=${c.vagaLargura}px arte-area=${c.arteAreaMedia}px²` +
        ` | folga faixa→cartão=${c.folgaFaixa}px vaga→cartão=${c.folgaVagaBruta}px (com flutuação ${c.folgaVagaComFlutuacao}px)` +
        ` | soma=${c.soma}/${c.alturaFaixa} pior-vão=${c.piorVao}px pares-apertados=${c.paresApertados}` +
        ` | rótulos cortados=${c.rotulosCortados}` +
        (c.vagasCobrindoCartao ? "  ⛔ VAGA SOBRE O CARTÃO" : ""),
    )
  }
}
