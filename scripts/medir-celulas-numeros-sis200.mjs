/**
 * SIS-200 — mede as sete células de "Sistran em números": largura e altura de cada
 * uma, em 1440 e 1280.
 *
 * ── Por que a sonda existe, se a grade já é `1fr` × 7 ──────────────────────
 * Porque `1fr` × 7 garante TRILHAS iguais, e não CAIXAS iguais. Foi exatamente o
 * que a primeira medição mostrou: as sete trilhas fechavam nos mesmos 148,4px em
 * 1440, e ainda assim as células não eram iguais — a primeira tinha 148,4px de
 * caixa de conteúdo contra 128,4px das outras seis, porque o bloco de 1280 zerava
 * o `padding-left` só nela. A diferença é 1.25rem = 20px, o próprio padding. Um
 * critério lido no CSS teria aprovado a seção quebrada; por isso o critério de
 * aceite da issue é o número medido.
 *
 * Daí as DUAS colunas do relatório: `trilha` (o retângulo do `<li>`, que é o que
 * `getBoundingClientRect` devolve) e `conteudo` (a caixa por dentro do padding e
 * da borda, que é o espaço em que número e rótulo realmente cabem). É a segunda
 * que estava desigual, e é ela que o olho lê.
 *
 * ── Por que a ALTURA também é medida ───────────────────────────────────────
 * A issue pede "mesma altura de caixa", e a altura era desigual por um motivo
 * diferente do da largura: `.impact-lista` estava em `align-items: start`, então
 * cada `<li>` encolhia até o seu conteúdo. Com rótulos de uma linha ("Clientes") e
 * de duas ("Mil horas de Capacidade Produtiva no Brasil") na mesma fileira, as
 * caixas ficavam com alturas diferentes — e como o fio divisório de cada célula é
 * o seu próprio `border-left`, os sete fios ficavam com comprimentos diferentes.
 * O sintoma visível não era "caixa baixa": era a régua de fios desalinhada.
 *
 * ── Por que rolar até a seção antes de medir ───────────────────────────────
 * O estado do ícone e do aceso vive sob `.impact-lista[data-observando]`, escrito
 * no DOM quando o observador entra em cena. Medir com a rolagem em zero leria a
 * fileira antes disso. A geometria da caixa não depende do aceso, mas o ícone
 * ocupa espaço, e o ícone só é o que o olho vê depois que a seção entra — medir
 * fora do estado real é o erro que a nota de memória chama de "alvo montado".
 *
 * ── O limiar ───────────────────────────────────────────────────────────────
 * A issue aceita "iguais até a primeira decimal (ou diferença ≤ 1px por
 * antialiasing)". `getBoundingClientRect` devolve float, e 1440 dividido por sete
 * não é inteiro: a sub-pixel é aritmética, não defeito. O relatório imprime o
 * espalhamento (máx − mín) e aprova em ≤ 1px.
 *
 * Rodar com o site no ar (`npx next dev -p 3999`):
 *   node scripts/medir-celulas-numeros-sis200.mjs
 */
import { chromium } from "file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs";

const URL = "http://localhost:3999/";
const LARGURAS = [1440, 1280];

const navegador = await chromium.launch();

for (const largura of LARGURAS) {
  const pagina = await navegador.newPage({
    viewport: { width: largura, height: 900 },
  });
  await pagina.goto(URL, { waitUntil: "networkidle" });

  /* Traz a fileira para dentro da janela e deixa o observador escrever
     `data-observando`/`data-aceso` antes de medir. */
  await pagina.evaluate(() => {
    document.querySelector(".impact-lista")?.scrollIntoView({ block: "center" });
  });
  await pagina.waitForTimeout(1500);

  const dados = await pagina.evaluate(() => {
    const lista = document.querySelector(".impact-lista");
    if (!lista) return null;
    const itens = [...lista.querySelectorAll(".impact-item")];
    return {
      observando: lista.hasAttribute("data-observando"),
      colunas: getComputedStyle(lista).gridTemplateColumns,
      celulas: itens.map((li) => {
        const r = li.getBoundingClientRect();
        const s = getComputedStyle(li);
        const horizontal =
          parseFloat(s.paddingLeft) +
          parseFloat(s.paddingRight) +
          parseFloat(s.borderLeftWidth) +
          parseFloat(s.borderRightWidth);
        return {
          rotulo: li.querySelector(".impact-rotulo")?.textContent ?? "",
          trilha: r.width,
          conteudo: r.width - horizontal,
          altura: r.height,
          icone: !!li.querySelector(".impact-icone svg"),
        };
      }),
    };
  });

  console.log(`\n═══ ${largura}px ═══`);
  if (!dados) {
    console.log("  .impact-lista nao encontrada — a fileira nao esta na rota.");
    continue;
  }
  console.log(`  data-observando: ${dados.observando ? "sim" : "NAO"}`);
  console.log(`  grid-template-columns: ${dados.colunas}`);
  console.log(
    `  ${"trilha".padStart(9)} ${"conteudo".padStart(9)} ${"altura".padStart(8)}  icone  rotulo`,
  );
  for (const c of dados.celulas) {
    console.log(
      `  ${c.trilha.toFixed(2).padStart(9)} ${c.conteudo.toFixed(2).padStart(9)} ${c.altura
        .toFixed(2)
        .padStart(8)}  ${c.icone ? " sim " : " NAO "}  ${c.rotulo}`,
    );
  }
  const espalha = (chave) => {
    const v = dados.celulas.map((c) => c[chave]);
    return Math.max(...v) - Math.min(...v);
  };
  for (const chave of ["trilha", "conteudo", "altura"]) {
    const d = espalha(chave);
    console.log(
      `  ${chave}: espalhamento ${d.toFixed(2)}px — ${d <= 1 ? "OK" : "REPROVA"}`,
    );
  }
  const semIcone = dados.celulas.filter((c) => !c.icone).length;
  console.log(`  celulas sem icone: ${semIcone} — ${semIcone === 0 ? "OK" : "REPROVA"}`);
  await pagina.close();
}

await navegador.close();
