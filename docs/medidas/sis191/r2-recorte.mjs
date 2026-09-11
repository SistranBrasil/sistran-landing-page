/* SIS-191, segunda volta — LUPA. Amplia um retangulo de uma captura para
   comparar a olho o que a medida por bounding box nao alcanca (borda reta de
   recorte, tinta sobreposta). Uso:
   `node docs/medidas/sis191/r2-recorte.mjs entrada.png saida.png x y w h [escala]`
   As coordenadas sao em pixels da IMAGEM. */
import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs";

const [entrada, saida, x, y, w, h, escala = "3"] = process.argv.slice(2);
const bytes = await fs.readFile(path.resolve(entrada));
const navegador = await chromium.launch();
const pagina = await navegador.newPage();
const dados = await pagina.evaluate(
  async ({ b64, cx, cy, cw, ch, k }) => {
    const img = new Image();
    img.src = `data:image/png;base64,${b64}`;
    await img.decode();
    const c = document.createElement("canvas");
    c.width = Math.round(cw * k);
    c.height = Math.round(ch * k);
    const ctx = c.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img, cx, cy, cw, ch, 0, 0, c.width, c.height);
    return c.toDataURL("image/png").split(",")[1];
  },
  {
    b64: bytes.toString("base64"),
    cx: Number(x),
    cy: Number(y),
    cw: Number(w),
    ch: Number(h),
    k: Number(escala),
  },
);
await fs.writeFile(path.resolve(saida), Buffer.from(dados, "base64"));
console.log(`${saida} <- ${entrada} [${x},${y} ${w}x${h}] x${escala}`);
await navegador.close();
