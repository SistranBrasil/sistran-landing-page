/**
 * Gera a sequência de quadros do hero da home a partir do master em 2160×2160.
 *
 *   node scripts/gerar-quadros-hero.mjs                 # todos os tiers
 *   node scripts/gerar-quadros-hero.mjs --tier mobile   # um tier só
 *   node scripts/gerar-quadros-hero.mjs --jobs 6 --crf 30 --keep-temp
 *   node scripts/gerar-quadros-hero.mjs --tier desktop --desde 329   # só o final (ajustes em FIM)
 *
 * Saída: `public/hero/sistran/<versão>/<tier>/frame-NNNN.avif` + `poster.webp`, e o
 * manifesto `src/components/hero/hero-frames.manifest.json`, que é o que o front lê
 * (`heroFrameConfig.ts`). O número de quadros NUNCA é escrito à mão no TSX: vem daqui.
 *
 * Decisões (detalhes e medições em docs/superpowers/specs/2026-10-07-hero-frame-sequence-design.md):
 *
 *  • MASTER: `docs/fontes/videos/videohero.mp4` — byte a byte o
 *    `dreamina-2026-09-08-7965-Create a 15-second premium cinematic 3D.mp4` (H.264 2160², 361
 *    quadros, 15,07 s, ~52 Mbps, 4 keyframes). É a geração que o site sempre usou (o
 *    `hero-scroll-v2.mp4` saía dele a CRF 35). O upscale Topaz que também está em
 *    `D:\Downloads\frames\Gerar` é OUTRA geração (um remix com narrativa diferente): não serve.
 *  • TIMESTAMPS: o container diz 60 fps mas há 361 quadros em 15 s, com PTS alternando 33/50 ms
 *    (24 fps dentro de uma grade de 1/60). Por isso `setpts=N/24/TB`: cada quadro é renumerado
 *    para a grade exata de 24 fps, e os `fade`/`enable` por número de quadro ficam exatos.
 *  • COR: o master não marca matriz; é tratado como BT.709 (é o que o navegador assume para um
 *    `<video>` HD). A ida YUV→RGB e a volta RGB→YUV usam BT.709 explicitamente e o AVIF sai
 *    marcado (`setparams`) — sem isso o Chrome/Safari interpretariam com outra matriz e as cores
 *    da sequência não bateriam com as do vídeo antigo.
 *  • CADÊNCIA: desktop usa TODOS os quadros (24 fps). 16 ou 20 fps a partir de 24 dão passos
 *    irregulares (1-2-1-2 / 1-1-1-1-2), que em pan lento leem como judder. Mobile usa 1 a cada 2
 *    (12 fps, uniforme).
 *  • FORMATO: AVIF por quadro, `-f avif` UM ARQUIVO POR PROCESSO. O muxer `image2` do ffmpeg
 *    escreve arquivos que o ffprobe lê mas o Chrome NÃO decodifica (`createImageBitmap` falha com
 *    "The source image could not be decoded") — medido em 07/10/2026. Daí o PNG intermediário
 *    e o pool de processos.
 *  • `cpu-used 6`: `cpu-used 4` encodou 2,4× mais devagar para −0,4% de bytes.
 *  • SEM denoise/sharpen: `hqdn3d` leve não mudou o tamanho em 1% (o custo é detalhe real, não
 *    ruído), e sharpening em cima de geração por IA só inventa textura.
 *
 * O FINAL DO VÍDEO É CORRIGIDO AQUI, de forma determinística e igual para todos os tiers: o
 * wordmark que o gerador desenhou ("SISTRAN / Beyond Technology" numa fonte fina genérica, sem o
 * emblema) não é a marca. A pedido (08/10/2026), os últimos quadros fazem uma TRANSIÇÃO para a
 * imagem oficial — logo navy sobre branco — em vez de mostrar o wordmark errado. Ver `FIM`.
 */
import { spawn } from 'node:child_process';
import { mkdir, readdir, readFile, rename, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

const MASTER = 'docs/fontes/videos/videohero.mp4';
const LOGO_OFICIAL = 'docs/fontes/hero/sistran-logo-oficial-4k-16x9.png';
const VERSAO = 'v1';
const SAIDA = `public/hero/sistran/${VERSAO}`;
const MANIFESTO = 'src/components/hero/hero-frames.manifest.json';
/* Relativo ao cwd DE PROPÓSITO: `removelogo=filename=` recebe o caminho dentro do filtergraph,
   e um `D:` ali precisaria de escape. */
const TEMP = '.tmp-hero-frames';

/* Fonte esperada. O script confere antes de gerar: um master diferente (outra duração, outro
   tamanho) invalida a geometria de `FIM`. */
const FONTE = { quadros: 361, fps: 24, largura: 2160, altura: 2160 };

const TIERS = {
  /* Caixa do vídeo a 1920×1080 @1× mede ~1006×988 CSS px; 1152 cobre até ~1440p @1× sem upscale. */
  desktop: { largura: 1152, altura: 1152, passo: 1 },
  /* HiDPI e monitores grandes: MacBook 1440×900 @2× pede ~1508×1636 device px. */
  'desktop-hd': { largura: 1440, altura: 1440, passo: 1 },
  /* Abaixo de 1024 px o `cover` mostra só o centro do quadro: recorte 3:4 central do master
     (1620×2160) → 1080×1440. Bytes que nunca apareceriam não são enviados. */
  mobile: {
    largura: 1080,
    altura: 1440,
    passo: 2,
    recorte: { w: 1620, h: 2160, x: 270, y: 0 },
    /* O logo oficial MENOR e centrado só neste tier. Num telefone de 390×844 o `cover` mostra a
       coluna central de ~950 px (do quadro de 2160); um logo largo sairia cortado dos dois
       lados — como o wordmark errado já saía no vídeo antigo. Com 840 px centrado cabe
       com ~55 px de folga por lado e, num tablet 3:4 (coluna inteira de 1620 px), fica em 52% da
       largura: ainda é o end card.
       VERTICAL: no terço inferior (centro em y 1728 = 80% do quadro), e não no centro. Abaixo de
       1024px a manchete da home é um painel escuro CENTRADO na cena (`.hero-captions` com
       `place-items: center`), que num 390×844 cobre ~22–63% da altura: um logo no centro do quadro
       ficava atrás dele (medido em 08/10). A 80% ele fica abaixo do painel em telefone e em tablet,
       e a pastilha "role para explorar" já saiu de cena (some em 0,78 do percurso). */
    logo: { x: 660, y: 1635, largura: 840 },
  },
};

/* ── O FINAL ─────────────────────────────────────────────────────────────────
   Linha do tempo medida no master (quadros a 24 fps, renumerados):
     ≤330   torre "RIVER PARK" virando wireframe de luz; sem texto
     331    o wordmark fino ERRADO começa a surgir sobre a torre de luz
     336–343 explosão de luz (torre dissolvendo em raios/partículas), wordmark legível
     348–360 degradê azul com brilho de horizonte; wordmark parado até o fim
   Três peças, todas só com pixels reais ou luz, e nenhuma antes do quadro 331:
     1. LIMPEZA: máscara dos glifos do wordmark (AND dos quadros 348 e 360 binarizados em 190,
        só na faixa vertical do texto, y 900–1220, dilatada 6 px — bbox 510,900 → 1461×320).
        Dentro dela o quadro recebe o fundo interpolado (`removelogo`) suavizado só na horizontal
        (`avgblur sizeX=61 sizeY=1`). Sozinha deixa blocos visíveis sobre o wireframe; aqui ela
        só tira o grosso do texto para o que vem por cima não ter o que vazar.
     2. BLOOM: elipse branca suave (centro 1085,1050; raios 900×340; borda em potência 2,2) que
        entra em 329–331 e fica. Na explosão o texto fino é branco sobre quase branco: o bloom o
        apaga e lê como o núcleo da própria luz.
     3. END CARD: a imagem oficial — logo NAVY (cores originais, alfa preservado) centrado sobre
        BRANCO puro — entra por crossfade em 336–347 e segura até o 360. É a "transição para
        esta imagem" pedida: a explosão de luz clareia até o branco do card e o logo emerge.
        Posição e largura do logo em `FIM.logo` (desktop) e `TIERS.mobile.logo`.
   Quem monta o hero sabe disso: a vinheta navy do `HeroCinematic` cai a zero entre 0,90 e 0,96
   do percurso para não escurecer os cantos do card branco. */
const FIM = {
  inicioLimpeza: 331,
  quadrosDaMascara: [348, 360],
  faixaMascara: { y: 900, h: 320 },
  limiarMascara: 190,
  dilatacoes: 6,
  bloom: { cx: 1085, cy: 1050, rx: 900, ry: 340, expoente: 2.2, entrada: { s: 329, n: 3 } },
  card: { fundo: 'white', entrada: { s: 336, n: 12 } },
  /* Em ≥1024px a `.hero-media` dissolve a borda ESQUERDA do quadro no branco da página
     (`mask-image`: transparente em 0%, 35% em 26%, opaco só a partir de 62% da caixa). Um logo
     centrado no quadro ficava com o emblema semitransparente (medido em 1440×900). E a borda
     DIREITA visível do quadro não é 100%: com a caixa mais alta que larga (1440×900 → 750×817) o
     `cover` corta ~4% de cada lado, então o que se vê vai de 62% a ~96% do quadro. O logo do end
     card vive nessa faixa: 660 px de largura (30,5%), de x 1350 a 2010 (62,5%→93%), centro
     vertical 1080 — na caixa de 1440×900 sobra ~23 px até o traço ciano; em 1920×1080, ~70 px.
     Primeira tentativa (760 px em 1310→2070) encostava no traço. O mobile não tem máscara nem
     esse corte e usa o centro do quadro (ver TIERS). */
  logo: { x: 1350, y: 1007, largura: 660 },
};

const args = lerArgs(process.argv.slice(2));
const TIER_PEDIDO = args.tier ?? 'all';
const JOBS = Number(args.jobs ?? 4);
const CRF = Number(args.crf ?? 30);
const CPU_USED = Number(args['cpu-used'] ?? 6);
const KEEP_TEMP = Boolean(args['keep-temp']);
/* Primeiro quadro do master a regenerar. Sem ele, o tier inteiro. Com ele, só os quadros a partir
   daí são extraídos e encodados — os arquivos anteriores ficam, e o manifesto não muda. */
const DESDE = args.desde != null ? Number(args.desde) : 0;

function lerArgs(lista) {
  const out = {};
  for (let i = 0; i < lista.length; i++) {
    const a = lista[i];
    if (!a.startsWith('--')) continue;
    const chave = a.slice(2);
    const prox = lista[i + 1];
    if (prox && !prox.startsWith('--')) {
      out[chave] = prox;
      i++;
    } else out[chave] = true;
  }
  return out;
}

function run(cmd, argv, { quiet = true } = {}) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, argv, { stdio: ['ignore', 'pipe', 'pipe'] });
    let out = '';
    let err = '';
    p.stdout.on('data', (d) => (out += d));
    p.stderr.on('data', (d) => (err += d));
    p.on('error', reject);
    p.on('close', (code) => {
      if (code === 0) resolve(out);
      else reject(new Error(`${cmd} ${argv.join(' ')}\n${quiet ? err.slice(-2000) : err}`));
    });
  });
}

async function ffprobeJson(file) {
  const out = await run('ffprobe', [
    '-v', 'error', '-select_streams', 'v:0',
    '-show_entries', 'stream=width,height,nb_frames,r_frame_rate,avg_frame_rate,codec_name',
    '-of', 'json', file,
  ]);
  return JSON.parse(out).streams[0];
}

/* Bbox dos pixels acima do limiar num plano cinza (ou no alfa). Sem dependência: ffmpeg cospe
   rawvideo gray e o Node varre. */
async function bbox(file, w, h, limiar, canal) {
  const vf = canal === 'alpha' ? 'alphaextract,format=gray' : 'format=gray';
  const buf = await new Promise((resolve, reject) => {
    const p = spawn('ffmpeg', ['-v', 'error', '-i', file, '-vf', vf, '-f', 'rawvideo', '-pix_fmt', 'gray', '-']);
    const parts = [];
    p.stdout.on('data', (d) => parts.push(d));
    p.on('error', reject);
    p.on('close', (c) => (c === 0 ? resolve(Buffer.concat(parts)) : reject(new Error('bbox ffmpeg falhou'))));
  });
  let minX = w, minY = h, maxX = -1, maxY = -1;
  for (let y = 0; y < h; y++) {
    const linha = y * w;
    for (let x = 0; x < w; x++) {
      if (buf[linha + x] > limiar) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) throw new Error(`bbox vazia em ${file}`);
  return { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 };
}

/* YUV(TV, BT.709) → RGB cheio. É a mesma leitura que o `<video>` fazia no navegador. */
const PARA_RGB = 'scale=in_color_matrix=bt709:in_range=tv:flags=accurate_rnd+full_chroma_int,format=rgb24';

/* As imagens que entram no grafo EM LOOP. Com `-loop 1` o demuxer de imagem decodifica o arquivo
   de novo a cada quadro — PNG de 2160² por quadro de saída custava mais do que o próprio vídeo
   (medido: ~3 s/quadro). BMP não tem decode: a leitura é uma cópia. */
const LOOPS = [
  { png: 'glyph-mask.png', bmp: 'glyph-mask.bmp', pix: 'bgr24' },
  { png: 'bloom.png', bmp: 'bloom.bmp', pix: 'bgra' },
  { png: 'logo-navy.png', bmp: 'logo-navy.bmp', pix: 'bgra' },
];

async function preparar() {
  await mkdir(TEMP, { recursive: true });
  const p = (n) => path.join(TEMP, n);
  const existe = (n) => stat(p(n)).then(() => true, () => false);
  const prontos = await Promise.all(LOOPS.flatMap((l) => [existe(l.png), existe(l.bmp)]));
  if (prontos.every(Boolean)) {
    console.log('· preparação já existe em', TEMP);
    return;
  }

  console.log('· extraindo quadros de referência (348, 360)…');
  const sel = FIM.quadrosDaMascara.map((n) => `eq(n,${n})`).join('+');
  await run('ffmpeg', [
    '-v', 'error', '-y', '-i', MASTER,
    '-vf', `setpts=N/${FONTE.fps}/TB,select='${sel}',${PARA_RGB}`,
    '-fps_mode', 'vfr', p('ref-%02d.png'),
  ]);
  const nomes = FIM.quadrosDaMascara.map((n) => `frame${n}.png`);
  for (let i = 0; i < nomes.length; i++) {
    await rm(p(nomes[i]), { force: true });
    await rename(p(`ref-0${i + 1}.png`), p(nomes[i]));
  }

  console.log('· máscara dos glifos do wordmark errado…');
  const { y: fy, h: fh } = FIM.faixaMascara;
  const bin = `format=gray,crop=${FONTE.largura}:${fh}:0:${fy},geq=lum='if(gt(lum(X,Y),${FIM.limiarMascara}),255,0)'`;
  const dil = Array(FIM.dilatacoes).fill('dilation').join(',');
  await run('ffmpeg', [
    '-v', 'error', '-y', '-i', p(nomes[0]), '-i', p(nomes[1]),
    '-filter_complex', `[0]${bin}[a];[1]${bin}[b];[a][b]blend=all_mode=and,${dil},pad=${FONTE.largura}:${FONTE.altura}:0:${fy}:black,format=gray`,
    p('glyph-mask.png'),
  ]);
  console.log('  bbox da máscara:', await bbox(p('glyph-mask.png'), FONTE.largura, FONTE.altura, 128, 'lum'));

  console.log('· bloom…');
  const b = FIM.bloom;
  await run('ffmpeg', [
    '-v', 'error', '-y', '-f', 'lavfi', '-i', `color=c=white:s=${FONTE.largura}x${FONTE.altura}:d=1,format=rgba`,
    '-vf', `geq=r=255:g=255:b=255:a='255*(1-pow(clip(sqrt(pow((X-${b.cx})/${b.rx},2)+pow((Y-${b.cy})/${b.ry},2)),0,1),${b.expoente}))'`,
    '-frames:v', '1', p('bloom.png'),
  ]);

  console.log('· logo oficial recortado ao conteúdo (cores originais, alfa preservado)…');
  const lp = await ffprobeJson(LOGO_OFICIAL);
  const lb = await bbox(LOGO_OFICIAL, lp.width, lp.height, 40, 'alpha');
  console.log('  bbox do logo oficial:', lb);
  await run('ffmpeg', [
    '-v', 'error', '-y', '-i', LOGO_OFICIAL,
    '-vf', `crop=${lb.w}:${lb.h}:${lb.x}:${lb.y}`,
    p('logo-navy.png'),
  ]);

  for (const l of LOOPS) {
    await run('ffmpeg', ['-v', 'error', '-y', '-i', p(l.png), '-pix_fmt', l.pix, p(l.bmp)]);
  }
}

/* O filtergraph de um tier: correção do final + cadência + recorte + Lanczos. Sai RGB para o PNG
   intermediário; a volta para YUV 4:2:0 BT.709 acontece no encode de cada quadro.
   Entradas: 0 master · 1 máscara · 2 bloom · 3 logo navy (as três em loop, BMP) · 4 fundo branco
   (lavfi). */
function graphDoTier(tier) {
  const t = TIERS[tier];
  const logo = t.logo ?? FIM.logo;
  const b = FIM.bloom;
  const partes = [
    `[0:v]setpts=N/${FONTE.fps}/TB,${PARA_RGB},split=3[src][s1][s2]`,
    `[s2]scale=out_color_matrix=bt709:out_range=pc,format=yuv444p,removelogo=filename=${TEMP}/glyph-mask.png,avgblur=sizeX=61:sizeY=1,scale=in_color_matrix=bt709:in_range=pc,format=rgb24[fill]`,
    `[1:v]format=rgb24[m]`,
    `[s1][fill][m]maskedmerge[clean]`,
    `[src][clean]overlay=format=rgb:shortest=1:enable='gte(n,${FIM.inicioLimpeza})'[main1]`,
    `[2:v]format=rgba,fade=t=in:s=${b.entrada.s}:n=${b.entrada.n}:alpha=1[bloom]`,
    `[main1][bloom]overlay=format=rgb:shortest=1[main2]`,
    `[3:v]format=rgba,scale=${logo.largura}:-1:flags=lanczos[lg]`,
    `[4:v]format=rgba[fundo]`,
    `[fundo][lg]overlay=x=${logo.x}:y=${logo.y}:format=auto[card]`,
    `[card]format=rgba,fade=t=in:s=${FIM.card.entrada.s}:n=${FIM.card.entrada.n}:alpha=1[cardf]`,
    `[main2][cardf]overlay=format=rgb:shortest=1[fixed]`,
  ];
  let cauda = `[fixed]select='not(mod(n,${t.passo}))*gte(n,${Math.ceil(DESDE / t.passo) * t.passo})'`;
  if (t.recorte) cauda += `,crop=${t.recorte.w}:${t.recorte.h}:${t.recorte.x}:${t.recorte.y}`;
  cauda += `,scale=${t.largura}:${t.altura}:flags=lanczos+accurate_rnd+full_chroma_int,format=rgb24[out]`;
  partes.push(cauda);
  return partes.join(';');
}

async function extrairTier(tier) {
  const dir = path.join(TEMP, tier);
  await rm(dir, { recursive: true, force: true });
  await mkdir(dir, { recursive: true });
  console.log(`· [${tier}] extraindo PNG intermediários…`);
  const t0 = Date.now();
  const passo = TIERS[tier].passo;
  /* Primeiro quadro do master que sai neste tier a partir de DESDE (alinhado ao passo). */
  const primeiro = Math.ceil(DESDE / passo) * passo;
  const esperado = Math.ceil((FONTE.quadros - primeiro) / passo);
  /* As imagens em loop são infinitas e, mesmo com `shortest=1` nos overlays, o grafo seguia
     vivo depois do fim do master (medido: 1595 PNG saíram antes de o processo ser morto).
     Então cada loop recebe a duração do master e o output um teto de quadros. */
  const duracao = String((FONTE.quadros + 1) / FONTE.fps);
  const imagemEmLoop = (nome) => ['-loop', '1', '-framerate', String(FONTE.fps), '-t', duracao, '-i', path.join(TEMP, nome)];
  await run('ffmpeg', [
    '-v', 'error', '-y',
    '-i', MASTER,
    ...imagemEmLoop('glyph-mask.bmp'),
    ...imagemEmLoop('bloom.bmp'),
    ...imagemEmLoop('logo-navy.bmp'),
    '-f', 'lavfi', '-t', duracao, '-i', `color=c=${FIM.card.fundo}:s=${FONTE.largura}x${FONTE.altura}:r=${FONTE.fps}`,
    '-filter_complex', graphDoTier(tier),
    '-map', '[out]', '-fps_mode', 'vfr',
    '-frames:v', String(esperado),
    '-c:v', 'png', '-compression_level', '1',
    path.join(dir, 'f-%04d.png'),
  ]);
  const pngs = (await readdir(dir)).filter((n) => n.endsWith('.png')).sort();
  if (pngs.length !== esperado) throw new Error(`[${tier}] esperava ${esperado} quadros, saíram ${pngs.length}`);
  console.log(`  ${pngs.length} quadros em ${((Date.now() - t0) / 1000).toFixed(0)}s${DESDE ? ` (a partir do quadro ${primeiro} do master)` : ''}`);
  return { pngs: pngs.map((n) => path.join(dir, n)), indiceInicial: primeiro / passo };
}

async function encodarTier(tier, pngs, indiceInicial = 0) {
  const dir = path.join(SAIDA, tier);
  if (!DESDE) await rm(dir, { recursive: true, force: true });
  await mkdir(dir, { recursive: true });
  console.log(`· [${tier}] encodando ${pngs.length} AVIF (crf ${CRF}, cpu-used ${CPU_USED}, ${JOBS} jobs)…`);
  const t0 = Date.now();
  let i = 0;
  let feitos = 0;
  const worker = async () => {
    while (i < pngs.length) {
      const idx = i++;
      const src = pngs[idx];
      const dst = path.join(dir, `frame-${String(indiceInicial + idx + 1).padStart(4, '0')}.avif`);
      await run('ffmpeg', [
        '-v', 'error', '-y', '-i', src,
        '-vf', 'scale=out_color_matrix=bt709:out_range=tv:flags=accurate_rnd+full_chroma_int,format=yuv420p,setparams=color_primaries=bt709:color_trc=bt709:colorspace=bt709:range=tv',
        '-c:v', 'libaom-av1', '-still-picture', '1', '-crf', String(CRF), '-cpu-used', String(CPU_USED), '-b:v', '0',
        '-threads', '2',
        '-f', 'avif', dst,
      ]);
      feitos++;
      if (feitos % 50 === 0) console.log(`  ${feitos}/${pngs.length}`);
    }
  };
  await Promise.all(Array.from({ length: JOBS }, worker));

  /* Pôster = quadro 1 em WebP: é o `<img>` do LCP e o fallback para navegador sem AVIF. */
  if (indiceInicial === 0) await run('ffmpeg', [
    '-v', 'error', '-y', '-i', pngs[0],
    '-c:v', 'libwebp', '-quality', '85', '-compression_level', '6', '-frames:v', '1',
    path.join(dir, 'poster.webp'),
  ]);
  console.log(`  ${((Date.now() - t0) / 1000).toFixed(0)}s`);

  const arquivos = (await readdir(dir)).filter((n) => n.endsWith('.avif'));
  let bytes = 0;
  for (const n of arquivos) bytes += (await stat(path.join(dir, n))).size;
  const posterBytes = (await stat(path.join(dir, 'poster.webp'))).size;
  return { quadros: arquivos.length, bytes, posterBytes };
}

async function main() {
  const info = await ffprobeJson(MASTER);
  const nb = Number(info.nb_frames);
  const [num, den] = String(info.avg_frame_rate).split('/').map(Number);
  const fps = Math.round(num / (den || 1));
  if (nb !== FONTE.quadros || info.width !== FONTE.largura || info.height !== FONTE.altura || fps !== FONTE.fps) {
    throw new Error(`master inesperado: ${info.width}×${info.height}, ${nb} quadros, ~${fps} fps — a geometria de FIM foi medida em ${FONTE.largura}×${FONTE.altura}/${FONTE.quadros}/${FONTE.fps}`);
  }

  const tiers = TIER_PEDIDO === 'all' ? Object.keys(TIERS) : [TIER_PEDIDO];
  for (const t of tiers) if (!TIERS[t]) throw new Error(`tier desconhecido: ${t}`);

  await preparar();

  let manifesto = {};
  try {
    manifesto = JSON.parse(await readFile(MANIFESTO, 'utf8'));
  } catch {
    /* primeira geração */
  }
  manifesto.versao = VERSAO;
  manifesto.base = `/hero/sistran/${VERSAO}`;
  manifesto.fonte = { arquivo: MASTER, ...FONTE };
  manifesto.tiers ??= {};

  for (const tier of tiers) {
    const { pngs, indiceInicial } = await extrairTier(tier);
    const r = await encodarTier(tier, pngs, indiceInicial);
    const t = TIERS[tier];
    manifesto.tiers[tier] = {
      pasta: tier,
      quadros: r.quadros,
      passo: t.passo,
      largura: t.largura,
      altura: t.altura,
      formato: 'avif',
      crf: CRF,
      bytes: r.bytes,
      poster: 'poster.webp',
      posterBytes: r.posterBytes,
    };
    console.log(`  [${tier}] ${r.quadros} quadros · ${(r.bytes / 1048576).toFixed(1)} MiB · pôster ${(r.posterBytes / 1024).toFixed(0)} KB`);
    if (!KEEP_TEMP) await rm(path.join(TEMP, tier), { recursive: true, force: true });
    manifesto.geradoEm = new Date().toISOString();
    await mkdir(path.dirname(MANIFESTO), { recursive: true });
    await writeFile(MANIFESTO, JSON.stringify(manifesto, null, 2) + '\n');
  }
  console.log('· manifesto escrito em', MANIFESTO);
  /* A preparação (máscara, bloom, logo) é barata e fica em TEMP para a próxima rodada de um tier
     só não a repetir. `rm -rf .tmp-hero-frames` limpa tudo. */
}

main().catch((e) => {
  console.error(e.message ?? e);
  process.exit(1);
});
