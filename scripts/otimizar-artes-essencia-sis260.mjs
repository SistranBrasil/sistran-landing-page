/**
 * SIS-260 — derivadas WebP das três artes de «Nossa Essência».
 *
 * POR QUE CONVERTER, e não apontar o `next/image` para os PNGs entregues
 * `images: { unoptimized: true }` no `next.config.mjs` (SIS-154, apuração em
 * `docs/images-unoptimized.md`) faz o `next/image` servir o arquivo EXATAMENTE
 * como ele está em `public/`: sem `srcset`, sem recorte, sem recompressão. As
 * três artes entregues têm 1254x1254 e somam 2,87 MB — e a seção mostra as TRÊS
 * na mesma tela (a ativa visível, as outras duas pré-carregadas atrás do
 * crossfade). Sem derivada, abrir `/quem-somos` baixaria isso.
 *
 * A LARGURA É MEDIDA, NÃO ESCOLHIDA
 * `docs/missao,valores.md` prescreve a caixa do visual: `width: min(100%, 520px)`.
 * `LARGURA = 1040` é 2x esses 520px — cobre DPR 2 inteiro, que é o teto prático
 * (o `renderer` da casa já capa em 2 por outro motivo, ver
 * `skills/performance-gpu.md`). Não há hover com zoom aqui, então não há a folga
 * extra que a SIS-216 precisou dar às capas do card.
 *
 * ALFA PRESERVADO — é o ponto inteiro destas artes
 * O doc diz, com todas as letras: «Os arquivos possuem fundo transparente. Não
 * adicione caixas, fundos brancos ou molduras ao redor deles.» Os três PNGs são
 * colortype 6 (RGBA), conferido pelo IHDR. WebP guarda alfa sem pedir nada, mas
 * um `.flatten()` ou um `background` no `resize` mataria a transparência em
 * silêncio — e o defeito só apareceria como um quadrado escuro sobre o painel
 * navy, que é quase a cor do fundo da arte. Por isso o script AFERE o alfa da
 * derivada (`hasAlpha`) em vez de confiar.
 *
 * `quality: 78` + `smartSubsample`: o mesmo par de
 * `otimizar-capas-card-sis216.mjs` e de `otimizar-capas-solucoes-sis286.mjs`.
 * São renders de linha fina sobre fundo escuro; abaixo disso a franja luminosa
 * dos anéis começa a ganhar degrau.
 *
 * Os PNGs seguem em `public/` como arte de origem — não são servidos.
 *
 * Uso: node scripts/otimizar-artes-essencia-sis260.mjs
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');

/* 2x os 520px que `docs/missao,valores.md` prescreve para a caixa do visual.
 *
 * O ARRANJO NOVO (mock `public/valores.png`) DIMINUIU A CAIXA para 400px, e 440px
 * acima de 1440 — a arte deixou de dividir um painel com o texto e passou a morar
 * no campo à direita. 1040 continua cobrindo DPR 2 dessa caixa com folga (2x440 =
 * 880), então as derivadas em disco seguem servindo e este número NÃO foi baixado:
 * regerar em 880 encolheria duas das três artes e deixaria `largura`/`altura` de
 * `src/data/essencia.ts` (1040) valendo só para a terceira — ver abaixo por que a
 * terceira não pode ser regerada. */
const LARGURA = 1040;

/* ATENÇÃO — `valores` SAIU DESTA LISTA, E NÃO PODE VOLTAR COMO ESTÁ. Era:
 *
 *     const ARTES = ['missao', 'valores', 'pilares'];
 *
 * O laço abaixo lê `public/${nome}.png`. `public/valores.png` FOI SOBRESCRITO: o
 * arquivo que está lá hoje é a MOCK DE PÁGINA INTEIRA do arranjo novo (campo claro,
 * trilho à esquerda, título gigante, assinatura no canto) — 1203549 bytes,
 * 23/09 18:09 —, e não o diagrama circular de linha ciano que era a arte do estado
 * Valores. As derivadas em `public/images/nossa-essencia/` são de 23/09 16:16, ou
 * seja ANTERIORES à troca: `valores.webp` em disco ainda é a arte certa.
 *
 * Rodar este script com `valores` na lista assaria a mock da página dentro do lugar
 * da arte — a seção passaria a exibir uma miniatura de si mesma. Por isso ele
 * regera só as duas cujo PNG de origem continua sendo arte (`public/missao.png` e
 * `public/pilares.png`, ambos 23/09 15:56).
 *
 * PARA DESTRAVAR: repor o PNG da arte de Valores em outro nome (por exemplo
 * `public/arte-valores.png`, que não colide com mock nenhuma) e mapear nome →
 * arquivo aqui, em vez de derivar o caminho do nome. Enquanto isso não acontecer,
 * `valores.webp` é um arquivo que o script não sabe reproduzir. */
const ARTES = ['missao', 'pilares'];

const kB = (n) => `${(n / 1024).toFixed(0)} kB`;

async function main() {
  const destino = resolve(RAIZ, 'public/images/nossa-essencia');
  await mkdir(destino, { recursive: true });

  let somaAntes = 0;
  let somaDepois = 0;

  for (const nome of ARTES) {
    const origem = resolve(RAIZ, `public/${nome}.png`);
    const png = await readFile(origem);
    const meta = await sharp(png).metadata();

    if (!meta.hasAlpha) {
      throw new Error(
        `${nome}.png não tem canal alfa — a arte precisa ser transparente (ver o cabeçalho deste script).`,
      );
    }

    const webp = await sharp(png)
      /* `withoutEnlargement`: se um dia a arte chegar menor que 1040, servir
         esticado é pior que servir pequeno. */
      .resize({ width: LARGURA, withoutEnlargement: true })
      .webp({ quality: 78, smartSubsample: true })
      .toBuffer();

    const metaDepois = await sharp(webp).metadata();
    if (!metaDepois.hasAlpha) {
      throw new Error(`derivada de ${nome} perdeu o alfa — ver o cabeçalho deste script.`);
    }

    await writeFile(resolve(destino, `${nome}.webp`), webp);

    somaAntes += png.length;
    somaDepois += webp.length;
    console.log(
      `${nome.padEnd(8)} ${meta.width}x${meta.height} ${kB(png.length).padStart(8)}` +
        `  ->  ${metaDepois.width}x${metaDepois.height} ${kB(webp.length).padStart(8)}  alfa ok`,
    );
  }

  console.log(
    `\ntotal ${kB(somaAntes)} -> ${kB(somaDepois)} ` +
      `(-${(100 - (somaDepois / somaAntes) * 100).toFixed(0)}%)`,
  );
}

main().catch((erro) => {
  console.error(erro);
  process.exitCode = 1;
});
