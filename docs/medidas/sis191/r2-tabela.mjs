/* SIS-191, segunda volta — LEITOR DAS SONDAS.

   `r2-sonda.mjs` grava tudo o que mediu; esta tabela é só a vista curta para
   comparar antes e depois lado a lado sem abrir os JSON.

   `node docs/medidas/sis191/r2-tabela.mjs antes depois` */
import fs from "node:fs/promises";
import path from "node:path";

const raiz = path.resolve("docs/medidas/sis191");
const n1 = (v) =>
  typeof v === "number" ? String(Math.round(v * 10) / 10) : String(v);

for (const estado of process.argv.slice(2)) {
  const bruto = JSON.parse(
    await fs.readFile(path.join(raiz, `r2-${estado}.json`), "utf8"),
  );
  console.log(`\n=== ${estado} ===`);
  console.log(
    [
      "quadro".padEnd(9),
      "larg".padEnd(5),
      "ativa".padEnd(6),
      "colEsq".padStart(6),
      "spyTinta".padStart(8),
      "spy>col".padStart(8),
      "paisTopo".padStart(8),
      "paisBase".padStart(8),
      "paisEsq".padStart(7),
      "paisDir".padStart(7),
      "emenda".padStart(6),
    ].join(" "),
  );
  for (const q of bruto.quadros) {
    const s = q.scrollSpy ?? {};
    const p = q.paisVsSvg ?? {};
    const sobre = s.sobreColuna ? (s.sobreColuna.sobrepoe ? "SIM" : "nao") : "-";
    console.log(
      [
        String(q.quadro).padEnd(9),
        String(q.largura).padEnd(5),
        String(q.ativa).padEnd(6),
        n1(q.colunaEsquerda).padStart(6),
        n1(s.visivel ? s.tintaDireita : 0).padStart(8),
        sobre.padStart(8),
        n1(p.topo).padStart(8),
        n1(p.base).padStart(8),
        n1(p.esquerda).padStart(7),
        n1(p.direita).padStart(7),
        n1(q.emenda).padStart(6),
      ].join(" "),
    );
  }
}
