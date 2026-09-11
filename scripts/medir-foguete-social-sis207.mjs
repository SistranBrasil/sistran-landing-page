/**
 * SIS-207 — sonda do TRAJETO do foguete na seção SOCIAL da `/esg`.
 *
 * A pergunta da issue não é "o foguete existe?" — é "ele está em quadro do começo
 * ao fim da seção?". Então a medição varre a travessia inteira da seção pela
 * janela, de passo em passo, e em cada passo pergunta três coisas:
 *
 *   1. PRESENÇA — a caixa da silhueta intersecta a janela? E que fração da altura
 *      dela está dentro? Um passo sem interseção é um trecho da seção em que o
 *      visitante não vê foguete nenhum: é o "sumir no meio" do pedido.
 *   2. CONFINAMENTO — a caixa está dentro dos limites verticais da seção? Foguete
 *      que sobe para dentro do ENVIRONMENT ou desce para a GOVERNANCE seria arte
 *      vazando de uma seção para outra.
 *   3. PROGRESSO — a posição muda entre passos? Parado com movimento permitido
 *      significa que o `useScroll` não está acompanhando (`offset` errado ou alvo
 *      de altura zero).
 *
 * Mede ainda a silhueta em si (é branca? é translúcida? está atrás do texto?), o
 * contraste do lead navy no PIOR ponto do trajeto — pelo método do
 * `docs/medidas/COMO-MEDIR-CONTRASTE.md`, apagando a tinta e olhando o pior pixel
 * do fundo — e a passagem `reduce`, onde o foguete tem de estar PARADO e EM QUADRO.
 *
 * `--modo=antes|depois` só muda o nome das capturas.
 */
import fs from "node:fs"
import { chromium } from "file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs"

const BASE = process.env.BASE_URL ?? "http://localhost:3997"
const ROTA = "/esg"
const SAIDA = "docs/capturas"
const modo = (process.argv.find((a) => a.startsWith("--modo=")) ?? "--modo=antes").split("=")[1]

fs.mkdirSync(SAIDA, { recursive: true })

/* A silhueta é o único `svg` dentro da camada decorativa da seção. */
const ALVO = 'section[aria-labelledby="esg-social"] [aria-hidden="true"] svg'
const SECAO = 'section[aria-labelledby="esg-social"]'

async function abrir(browser, largura, altura, reduce) {
  const contexto = await browser.newContext({
    viewport: { width: largura, height: altura },
    deviceScaleFactor: 1,
    reducedMotion: "no-preference",
  })
  if (reduce) {
    /* O espelho manual: o botão da interface grava no `localStorage` e o script
       inline do `layout.tsx` põe o atributo antes do primeiro paint. Escrever o
       atributo aqui não serviria — ele o removeria. (Mesmo caminho da SIS-183.) */
    await contexto.addInitScript(() => {
      try {
        localStorage.setItem("sistran-motion-preference", "reduce")
      } catch (e) {}
    })
  }
  const pagina = await contexto.newPage()
  await pagina.goto(`${BASE}${ROTA}`, { waitUntil: "networkidle", timeout: 120000 })
  const continuar = pagina.getByRole("button", { name: /continuar/i }).first()
  if (await continuar.count().catch(() => 0)) {
    await continuar.click({ timeout: 3000 }).catch(() => undefined)
  }
  await pagina.waitForTimeout(1400)
  /* GUARDA DE FOLHA DE ESTILO. `next start` servindo um `.next` recém-reconstruído
     entrega por um tempo o manifesto antigo: os `chunks/*.css` voltam 404/500, a
     página renderiza com as imagens no tamanho intrínseco e TODA medida de geometria
     fica sem sentido (aconteceu: a seção media 7667px em vez de 1622px e o parágrafo
     aparecia a 6344px do topo). Sem esta guarda o erro passa por medição. */
  const semEstilo = await pagina.evaluate(() => !getComputedStyle(document.body).fontFamily.includes("Geist"))
  if (semEstilo) {
    throw new Error("a pagina carregou sem a folha de estilo (manifesto obsoleto do next start) — reinicie o servidor")
  }
  /* CONGELAR AS ANIMAÇÕES DE CSS antes de qualquer diferença de raster, e isto foi
     aprendido errando: a primeira medição acusava dezenas de milhares de pixels
     "de silhueta" em passos onde a caixa dela estava inteira fora da janela. Não era
     a silhueta — era a pluma do `.esg-apoio` (ciclo de 7s que anima `scale`) andando
     entre os dois quadros. Com as animações paradas, o que sobra na diferença é só
     a camada que se apagou. O `transform` do foguete não depende disto: vem de
     `style` inline escrito pelo Motion a partir da posição do scroll, que está
     fixa. */
  await pagina.addStyleTag({
    content: `*, *::before, *::after { animation-play-state: paused !important; transition: none !important; }`,
  })
  await pagina.waitForTimeout(200)
  return { contexto, pagina }
}

/**
 * PIXEIS QUE CHEGAM AO OLHO. A caixa da silhueta estar em quadro não prova que ela
 * se vê: a camada é `-z-10`, então foto opaca por cima a apaga. Então a medida é
 * por diferença — um quadro com a camada e um sem ela, contando os pixels que
 * mudaram. Zero mudou = invisível naquele passo, com caixa em quadro ou sem.
 */
async function pixeisDaSilhueta(pagina) {
  const com = (await pagina.screenshot()).toString("base64")
  await pagina.evaluate(() => {
    const n = document.querySelector("[data-foguete]")
    if (n) n.style.display = "none"
  })
  await pagina.waitForTimeout(120)
  const sem = (await pagina.screenshot()).toString("base64")
  await pagina.evaluate(() => {
    const n = document.querySelector("[data-foguete]")
    if (n) n.style.display = ""
  })
  await pagina.waitForTimeout(120)
  return pagina.evaluate(
    async ({ com, sem }) => {
      const carregar = async (b64) => {
        const img = new Image()
        img.src = `data:image/png;base64,${b64}`
        await img.decode()
        const c = document.createElement("canvas")
        c.width = img.width
        c.height = img.height
        c.getContext("2d").drawImage(img, 0, 0)
        return c.getContext("2d").getImageData(0, 0, c.width, c.height).data
      }
      const [a, b] = await Promise.all([carregar(com), carregar(sem)])
      /* CONFINAMENTO SE AFERE NO RASTER, não na caixa. Com `sticky top-0` o foguete
         está fora dos limites da seção em parte da travessia por construção — o que
         importa é se ele PINTA lá fora, e quem responde isso é o recorte da camada.
         Então cada pixel alterado é classificado por estar dentro ou fora da faixa
         vertical que a seção ocupa na janela. */
      const s = document.querySelector('section[aria-labelledby="esg-social"]').getBoundingClientRect()
      const topo = Math.max(0, s.top)
      const base = Math.min(innerHeight, s.bottom)
      const larg = Math.round(innerWidth * devicePixelRatio) || innerWidth
      let n = 0
      let fora = 0
      /* Limiar de 2 por canal: abaixo disso é ruído de compressão do próprio
         raster, não silhueta. */
      for (let i = 0; i < a.length; i += 4) {
        if (Math.abs(a[i] - b[i]) > 2 || Math.abs(a[i + 1] - b[i + 1]) > 2 || Math.abs(a[i + 2] - b[i + 2]) > 2) {
          n += 1
          const linha = Math.floor(i / 4 / larg)
          if (linha < topo || linha > base) fora += 1
        }
      }
      return { total: n, fora }
    },
    { com, sem },
  )
}

/** Geometria do foguete e da seção no instante atual. */
const ler = (pagina, alvo, secao) =>
  pagina.evaluate(
    ({ alvo, secao }) => {
      const s = document.querySelector(secao)
      const f = document.querySelector(alvo)
      if (!s) return { erro: "secao ausente" }
      const rs = s.getBoundingClientRect()
      if (!f) return { erro: "foguete ausente", secao: { top: rs.top, bottom: rs.bottom } }
      const rf = f.getBoundingClientRect()
      const visivelAlt = Math.max(0, Math.min(rf.bottom, innerHeight) - Math.max(rf.top, 0))
      const cs = getComputedStyle(f)
      /* A tinta mora nos `path`, não no `svg`: pega o corpo (o `g` mais opaco). */
      const corpo = f.querySelector("g:last-of-type path")
      const csCorpo = corpo ? getComputedStyle(corpo) : null
      return {
        foguete: {
          top: Math.round(rf.top),
          bottom: Math.round(rf.bottom),
          left: Math.round(rf.left),
          right: Math.round(rf.right),
          h: Math.round(rf.height),
          visivelAlt: Math.round(visivelAlt),
          fracao: rf.height ? Number((visivelAlt / rf.height).toFixed(2)) : 0,
          emQuadro: visivelAlt > 1,
        },
        secao: { top: Math.round(rs.top), bottom: Math.round(rs.bottom), h: Math.round(rs.height) },
        dentroDaSecao: rf.top >= rs.top - 1 && rf.bottom <= rs.bottom + 1,
        estilo: {
          opacidade: cs.opacity,
          fill: csCorpo ? csCorpo.fill : "?",
          fillOpacity: csCorpo ? csCorpo.fillOpacity : "?",
          /* O transform mora no `motion.div` que embrulha o `svg`, não no `svg`. */
          transform: f.parentElement ? getComputedStyle(f.parentElement).transform : cs.transform,
        },
      }
    },
    { alvo, secao },
  )

/* --- contraste, método do COMO-MEDIR-CONTRASTE.md ------------------------- */
const lum = ([r, g, b]) => {
  const f = (c) => {
    const v = c / 255
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
}
const razao = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p)
  return (x + 0.05) / (y + 0.05)
}

/** Apaga a tinta do parágrafo, recorta a caixa dele e devolve o PIOR pixel. */
async function piorFundo(pagina, seletor) {
  const caixa = await pagina.evaluate((sel) => {
    const el = document.querySelector(sel)
    if (!el) return null
    const r = el.getBoundingClientRect()
    if (r.bottom <= 0 || r.top >= innerHeight) return null
    el.dataset.sondaTinta = "1"
    el.style.color = "transparent"
    el.style.webkitTextFillColor = "transparent"
    /* Sem o cabeçalho fixo e sem os avisos do next dev por cima do recorte. */
    const cabecalho = document.querySelector("header")
    const alturaCabecalho = cabecalho ? Math.ceil(cabecalho.getBoundingClientRect().height) : 0
    for (const s of ["header.fixed", "nextjs-portal"]) {
      for (const n of document.querySelectorAll(s)) n.style.display = "none"
    }
    /* O RECORTE COMEÇA ABAIXO DA FAIXA DO CABEÇALHO, e isto é conserto de método,
       não conveniência. Esconder o `header` é necessário (senão ele entra no recorte
       e é a tinta DELE que vira "pior pixel"), mas esconder sem excluir a faixa expõe
       linhas que, na leitura real, estão atrás de uma barra opaca de 88px — ninguém
       lê aquele trecho. Foi o que aconteceu aqui: a sonda acusava 4,06:1 num pixel
       rgb(179,199,216) na LINHA 0 de um parágrafo de 153px, e as oito primeiras
       linhas mostravam um degradê subindo (179 → 203) — a cauda desfocada da sombra
       do elemento de cima, atrás do cabeçalho. Medido com e sem a camada do foguete o
       valor era o MESMO (4,06:1), o que já provava que a silhueta não era a causa:
       camada branca só clareia. */
    const y = Math.max(alturaCabecalho, Math.round(r.top))
    return {
      x: Math.max(0, Math.round(r.left)),
      y,
      width: Math.round(Math.min(r.width, innerWidth - r.left)),
      height: Math.round(Math.min(r.bottom, innerHeight) - y),
    }
  }, seletor)
  if (!caixa || caixa.width < 2 || caixa.height < 2) return null
  await pagina.waitForTimeout(120)
  const png = await pagina.screenshot({ clip: caixa })
  /* Sem dependência de decodificador em Node: o PNG volta para dentro da página
     como data URL e o próprio navegador o decodifica num `canvas`. */
  const b64 = png.toString("base64")
  const pior = await pagina.evaluate(async (b64) => {
    const img = new Image()
    img.src = `data:image/png;base64,${b64}`
    await img.decode()
    const c = document.createElement("canvas")
    c.width = img.width
    c.height = img.height
    const ctx = c.getContext("2d")
    ctx.drawImage(img, 0, 0)
    const d = ctx.getImageData(0, 0, c.width, c.height).data
    /* "Pior" = o pixel de fundo mais parecido com a tinta navy, isto é o mais
       ESCURO: numa seção clara com texto escuro, é ele que derruba a razão. */
    let pior = [255, 255, 255]
    let piorL = 2
    const rel = (c) => {
      const v = c / 255
      return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
    }
    for (let i = 0; i < d.length; i += 4) {
      const L = 0.2126 * rel(d[i]) + 0.7152 * rel(d[i + 1]) + 0.0722 * rel(d[i + 2])
      if (L < piorL) {
        piorL = L
        pior = [d[i], d[i + 1], d[i + 2]]
      }
    }
    return pior
  }, b64)
  await pagina.evaluate((sel) => {
    const el = document.querySelector(sel)
    if (el) {
      el.style.color = ""
      el.style.webkitTextFillColor = ""
    }
    for (const s of ["header.fixed", "nextjs-portal"]) {
      for (const n of document.querySelectorAll(s)) n.style.display = ""
    }
  }, seletor)
  return pior
}

async function medir(browser, largura, altura, reduce = false) {
  const { contexto, pagina } = await abrir(browser, largura, altura, reduce)
  const rotulo = `${largura}x${altura}${reduce ? " reduce" : ""}`
  console.log(`\n=== ${rotulo} ===`)

  const base = await pagina.evaluate((sel) => {
    const s = document.querySelector(sel)
    return { topo: Math.round(s.offsetTop), h: Math.round(s.offsetHeight) }
  }, SECAO)
  console.log(`secao SOCIAL: topo ${base.topo}, altura ${base.h}px`)

  /* Varredura: do instante em que o topo da seção encosta na base da janela até o
     instante em que a base da seção sai pelo topo. É o mesmo intervalo do
     `offset: ['start end', 'end start']` que o componente usa. */
  const inicio = Math.max(0, base.topo - altura)
  const fim = base.topo + base.h
  const passo = Math.round(altura * 0.25)
  const passos = []
  for (let y = inicio; y <= fim; y += passo) {
    await pagina.evaluate((y) => scrollTo({ top: y, behavior: "instant" }), y)
    await pagina.waitForTimeout(140)
    const l = await ler(pagina, ALVO, SECAO)
    /* O diff só interessa nos passos em que a seção está em quadro — fora deles a
       ausência de silhueta é o comportamento certo, e o diff custa dois rasters. */
    const naJanela = l.secao && l.secao.bottom > 0 && l.secao.top < altura
    const diff = naJanela ? await pixeisDaSilhueta(pagina) : null
    passos.push({ y, pixeis: diff?.total ?? null, pixeisFora: diff?.fora ?? null, ...l })
  }

  /* Só os passos em que a SEÇÃO está de fato em quadro contam para "não sumir no
     meio": antes de entrar e depois de sair, o foguete fora da tela é o correto. */
  const comSecao = passos.filter((p) => p.secao && p.secao.bottom > 0 && p.secao.top < altura)
  const semFoguete = comSecao.filter((p) => !p.foguete?.emQuadro)
  const foraDaSecao = comSecao.filter((p) => (p.pixeisFora ?? 0) > 200)
  /* Movimento se afere pelo TRANSFORM, não pela posição na janela: qualquer camada
     em fluxo muda de posição quando a página rola, inclusive uma imagem estática.
     O que `reduce` proíbe é o scroll ESCREVER transform — daí o conjunto abaixo. */
  const transformes = new Set(passos.map((p) => p.estilo?.transform).filter(Boolean))
  /* "Invisível" só é defeito enquanto a seção tem faixa em quadro maior que a
     silhueta. No último passo da travessia sobram poucas dezenas de pixels de seção
     na tela (a 1440, 47px) e a silhueta tem ~600px: recortada a essa fresta ela
     desaparece, e desaparecer ali é o comportamento certo — o contrário seria arte
     pintando dentro da seção seguinte. O limiar de 200px é a fresta mínima em que
     ainda faz sentido exigir presença. */
  const invisiveis = comSecao.filter(
    (p) => (p.pixeis ?? 0) < 200 && Math.min(altura, p.secao.bottom) - Math.max(0, p.secao.top) >= 200,
  )

  for (const p of comSecao) {
    console.log(
      `  ${p.foguete?.emQuadro && (p.pixeis ?? 0) >= 200 ? "ok" : "XX"} y=${p.y} secao ${p.secao.top}..${p.secao.bottom} · foguete ${p.foguete ? `${p.foguete.top}..${p.foguete.bottom} (${p.foguete.visivelAlt}px em quadro, ${(p.foguete.fracao * 100).toFixed(0)}%)` : "AUSENTE"} · ${p.pixeis ?? "?"} px na tela${(p.pixeisFora ?? 0) > 200 ? ` · VAZA DA SECAO (${p.pixeisFora} px)` : ""}`,
    )
  }
  console.log(`passos com a secao em quadro: ${comSecao.length}`)
  console.log(`  ${semFoguete.length === 0 ? "ok" : "XX"} passos SEM a caixa em quadro: ${semFoguete.length}`)
  console.log(`  ${invisiveis.length === 0 ? "ok" : "XX"} passos com silhueta invisivel (<200px alterados): ${invisiveis.length}`)
  console.log(
    `  ${foraDaSecao.length === 0 ? "ok" : "XX"} passos com silhueta PINTANDO fora da secao: ${foraDaSecao.length}`,
  )
  console.log(
    `  ${reduce ? (transformes.size === 1 ? "ok" : "XX") : transformes.size > 1 ? "ok" : "XX"} transformes distintos: ${transformes.size} (reduce espera 1, movimento espera >1)`,
  )
  const est = passos.find((p) => p.estilo)?.estilo
  if (est) console.log(`  estilo: fill=${est.fill} fill-opacity=${est.fillOpacity} opacity=${est.opacidade}`)

  /* PIOR PONTO DO TRAJETO PARA O CONTRASTE — e "pior" não é o passo em que a
     silhueta cobre mais área: é o pior VALOR entre todos os passos em que o texto
     está em quadro. A primeira versão desta sonda escolhia o passo de maior área e
     ali o parágrafo do Gerando Talentos já havia saído da janela, então o critério
     (iii) ficava sem número. Agora ela varre a travessia inteira e guarda o mínimo,
     que é o que a issue pede: pior ponto, texto medido. */
  for (const [nome, sel, tinta] of [
    ["lead do Gerando Talentos", 'section[aria-labelledby="esg-social"] p.text-ink-muted', [61, 90, 128]],
    ["titulo h3", 'section[aria-labelledby="esg-social"] h3', [10, 31, 68]],
  ]) {
    let pior = null
    for (const p of comSecao) {
      await pagina.evaluate((y) => scrollTo({ top: y, behavior: "instant" }), p.y)
      await pagina.waitForTimeout(200)
      const fundo = await piorFundo(pagina, sel)
      if (!fundo) continue
      const r = razao(tinta, fundo)
      if (!pior || r < pior.r) pior = { r, fundo, y: p.y }
    }
    if (!pior) {
      console.log(`  XX contraste ${nome}: nunca em quadro na travessia`)
      continue
    }
    console.log(
      `  ${pior.r >= 4.5 ? "ok" : "XX"} contraste ${nome} no pior ponto (y=${pior.y}): ${pior.r.toFixed(2)}:1 · pior pixel rgb(${pior.fundo.join(",")})`,
    )
  }

  /* Capturas em 1440: começo, meio e fim da seção. */
  if (largura === 1440 && !reduce) {
    for (const [nome, y] of [
      ["inicio", base.topo - Math.round(altura * 0.1)],
      ["meio", base.topo + Math.round(base.h * 0.45)],
      ["fim", base.topo + base.h - altura],
    ]) {
      await pagina.evaluate((y) => scrollTo({ top: Math.max(0, y), behavior: "instant" }), y)
      await pagina.waitForTimeout(400)
      await pagina.screenshot({ path: `${SAIDA}/sis207-${modo}-${nome}-1440.png` })
    }
  }
  if (largura === 1440 && reduce) {
    await pagina.evaluate((y) => scrollTo({ top: y, behavior: "instant" }), base.topo + Math.round(base.h * 0.45))
    await pagina.waitForTimeout(400)
    await pagina.screenshot({ path: `${SAIDA}/sis207-${modo}-reduce-1440.png` })
  }

  await contexto.close()
}

const browser = await chromium.launch()
for (const [w, h] of [
  [1440, 900],
  [1366, 768],
  [390, 844],
]) {
  await medir(browser, w, h)
}
await medir(browser, 1440, 900, true)
await browser.close()
