/**
 * SOBE OS VÍDEOS DE TUTORIAL DO ADMIN PARA O VERCEL BLOB.
 *
 * Por que eles não moram em `public/`: os três somam 34 MB, e `public/` é o repositório —
 * 34 MB de binário entram no histórico do git PARA SEMPRE (tirar depois exige reescrever
 * o histórico, que quebra o clone de todo mundo). Vídeo é o caso em que isso mais dói,
 * porque regravar não substitui: cada versão nova soma. A loja que o catálogo de eventos
 * já usa (`src/lib/eventosLoja.ts`) resolve sem código novo em produção — o `<video>`
 * aponta para uma URL `https://` comum.
 *
 * ── Como rodar ───────────────────────────────────────────────────────────────────────
 *   node scripts/subir-tutoriais-blob.mjs
 *
 * Precisa de `BLOB_READ_WRITE_TOKEN` (está em `.env.local`, e este script o lê de lá —
 * não exige `vercel env pull` nem exportar nada à mão).
 *
 * Ele IMPRIME as URLs ao terminar. Elas são determinísticas (ver `addRandomSuffix`
 * abaixo), então o que vai para `src/app/admin/tutoriais/page.tsx` é o que sai aqui.
 *
 * ── Para acrescentar um vídeo novo ───────────────────────────────────────────────────
 *   1. gere a capa:  ffmpeg -ss <segundo> -i <video>.mp4 -frames:v 1 -vf scale=1280:-1 \
 *                           -q:v 4 capa-<nome>.jpg
 *      (escolha um instante que mostre o ASSUNTO, não a cartela de abertura nem um fundo
 *      escuro — a capa é o que se vê antes do play, por causa do `preload="metadata"`)
 *   2. ponha os dois arquivos em qualquer pasta e acrescente o par em `ARQUIVOS`;
 *   3. rode este script e cole as URLs na página.
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { put } from '@vercel/blob';

/**
 * O token vem do `.env.local` porque este script roda fora do Next, que é quem
 * normalmente carrega esse arquivo. Leitura ingênua de propósito: é um `.env` de
 * desenvolvimento com uma chave por linha, e trazer um parser para isso seria peso sem
 * ganho.
 */
async function lerToken() {
  const texto = await readFile(new URL('../.env.local', import.meta.url), 'utf8');
  const linha = texto.match(/^\s*BLOB_READ_WRITE_TOKEN\s*=\s*(.+)$/m);
  if (!linha) throw new Error('BLOB_READ_WRITE_TOKEN não encontrado em .env.local');
  return linha[1].trim().replace(/^["']|["']$/g, '');
}

/**
 * ⚠️ A PASTA DE ORIGEM É ARGUMENTO, e o padrão é `public/videos/admin` só porque é onde
 * os arquivos estavam quando este script nasceu. Depois de subir, eles SAEM de `public/`
 * — então para rodar de novo é preciso dizer onde estão:
 *   node scripts/subir-tutoriais-blob.mjs C:/caminho/dos/videos
 */
const ORIGEM = process.argv[2] ?? 'public/videos/admin';

const ARQUIVOS = [
  'tutorial-eventos-sistran-explicado.mp4',
  'tutorial-editar-evento-sistran.mp4',
  'tutorial-carimbos-eventos-sistran.mp4',
  'capa-cadastrar-evento.jpg',
  'capa-editar-evento.jpg',
  'capa-carimbos.jpg',
];

const TIPOS = { '.mp4': 'video/mp4', '.jpg': 'image/jpeg' };

const token = await lerToken();

for (const nome of ARQUIVOS) {
  const corpo = await readFile(path.join(ORIGEM, nome));
  const { url } = await put(`admin/tutoriais/${nome}`, corpo, {
    token,
    access: 'public',
    contentType: TIPOS[path.extname(nome)],
    /**
     * ⚠️ `addRandomSuffix: false` É O QUE FAZ A URL SER PREVISÍVEL, e é o motivo de poder
     * colar as URLs na página em vez de consultar a loja a cada requisição. Com sufixo
     * aleatório (o padrão), cada upload geraria um endereço novo e a página precisaria
     * de um `list()` em tempo de execução — mais código e uma chamada de rede para
     * servir conteúdo que não muda.
     */
    addRandomSuffix: false,
    /* Sem isto, subir de novo com o mesmo caminho é erro — e regravar um tutorial é
       exatamente o que vai acontecer. */
    allowOverwrite: true,
    /**
     * Um dia. O SDK não aceita menos de um minuto, e o outro extremo (um ano) economiza
     * banda mas faz um vídeo REGRAVADO continuar sendo servido velho por muito tempo,
     * já que o nome do arquivo não muda. Um dia é o meio: quem assiste duas vezes na
     * mesma tarde não baixa 34 MB de novo, e uma correção chega em 24 h.
     *
     * Se a correção for urgente, o jeito de furar o cache é o de sempre: nome novo.
     */
    cacheControlMaxAge: 60 * 60 * 24,
  });
  console.log(`${nome}\n  → ${url}\n`);
}
