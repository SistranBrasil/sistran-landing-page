import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { CATALOGO_VAZIO, FORMATO_ID, type CatalogoCarimbos } from '@/lib/carimbosTipos';

/**
 * O CAMINHO DE DISCO do catálogo de carimbos — o gêmeo de `eventosArquivo.ts`.
 *
 * ⚠️ SÓ SERVIDOR, e só onde o checkout está em disco e é gravável: em produção na
 * Vercel o sistema de arquivos da função é somente-leitura. Quem decide entre
 * disco e nuvem é `carimbosLoja.ts`, pela presença do `BLOB_READ_WRITE_TOKEN` —
 * exatamente como já acontece com eventos. Este módulo é o caminho da máquina de
 * desenvolvimento, e é o que faz o admin ser usável sem as variáveis de produção.
 */

const CAMINHO_CATALOGO = path.join(process.cwd(), 'src', 'data', 'carimbos.json');

/**
 * A pasta das artes geradas, DENTRO de `public/` para serem servidas como
 * estáticas. Subpasta própria (`gerados`) e não a raiz de `public/carimbo/`:
 * ali já vive arte versionada no repositório (`carimbo-parcerias.png`), e
 * misturar o que o Git controla com o que o admin grava é como se perde a
 * distinção entre asset de projeto e conteúdo de operação.
 */
const PASTA_ARTE = path.join(process.cwd(), 'public', 'carimbo', 'gerados');
const URL_ARTE = '/carimbo/gerados';

/**
 * ⚠️ ARESTA DO CAMINHO DE DISCO, MEDIDA EM 13/10: arquivo gravado aqui DEPOIS de
 * o servidor subir responde 404 até ele ser reiniciado — o `next start` monta o
 * mapa de `public/` no boot e não observa a pasta depois. Conferido com `curl`
 * num carimbo recém-criado: o arquivo estava no disco e a URL dava 404; depois de
 * reiniciar, 200.
 *
 * Isto NÃO afeta o caminho de produção, que é o único que importa para o
 * visitante: com `BLOB_READ_WRITE_TOKEN` a arte vai para o Blob e a URL é
 * absoluta, servida pelo CDN no mesmo instante. A aresta vive só no modo de
 * desenvolvimento sem token — e é por isso que o aviso da tela de carimbos diz
 * para reiniciar o servidor.
 */

export function lerCatalogoDoDisco(): CatalogoCarimbos {
  try {
    const bruto = JSON.parse(readFileSync(CAMINHO_CATALOGO, 'utf8')) as unknown;
    return conferirCatalogo(bruto);
  } catch {
    /* Arquivo ausente ou ilegível é estado NORMAL antes da primeira gravação —
       não é erro a propagar, e derrubar a rota pública por causa dele seria
       desproporcional. O catálogo vazio significa «todo lugar na arte padrão»,
       que é o site como está hoje. */
    return CATALOGO_VAZIO;
  }
}

/**
 * Aceita só o que tem a forma do catálogo. É a porta de entrada de um JSON que
 * pode ter sido editado à mão — e um `aplicacoes` que não for objeto quebraria
 * o `in` do resolvedor em toda página do site.
 */
export function conferirCatalogo(bruto: unknown): CatalogoCarimbos {
  if (!bruto || typeof bruto !== 'object') return CATALOGO_VAZIO;
  const obj = bruto as Partial<CatalogoCarimbos>;
  const carimbos = Array.isArray(obj.carimbos) ? obj.carimbos : [];
  const aplicacoes =
    obj.aplicacoes && typeof obj.aplicacoes === 'object' && !Array.isArray(obj.aplicacoes)
      ? (obj.aplicacoes as Record<string, string>)
      : {};
  return { carimbos, aplicacoes };
}

export type Resultado = { ok: true } | { ok: false; detalhe: string };

export function gravarCatalogoNoDisco(catalogo: CatalogoCarimbos): Resultado {
  try {
    writeFileSync(CAMINHO_CATALOGO, `${JSON.stringify(catalogo, null, 2)}\n`);
    return { ok: true };
  } catch (causa) {
    return { ok: false, detalhe: causa instanceof Error ? causa.message : String(causa) };
  }
}

export type ResultadoArte = { ok: true; arquivo: string } | { ok: false; detalhe: string };

/**
 * Grava o PNG do carimbo em `public/`.
 *
 * O NOME é montado aqui, do id mais um carimbo de tempo, e nunca recebido do
 * navegador: nome de cliente é entrada hostil (`../../` escapa da pasta) e
 * costuma trazer acento e espaço, que quebram depois do deploy e não no editor.
 * O carimbo de tempo também resolve cache — arquivo novo, URL nova —, o que
 * importa aqui mais que em evento: o carimbo pode ser reeditado várias vezes
 * seguidas enquanto alguém acerta o texto.
 */
export function gravarArteNoDisco(id: string, png: Uint8Array): ResultadoArte {
  if (!FORMATO_ID.test(id)) return { ok: false, detalhe: `id fora do formato: "${id}"` };

  const agora = new Date();
  const selo = [
    agora.getFullYear(),
    String(agora.getMonth() + 1).padStart(2, '0'),
    String(agora.getDate()).padStart(2, '0'),
    String(agora.getHours()).padStart(2, '0'),
    String(agora.getMinutes()).padStart(2, '0'),
    String(agora.getSeconds()).padStart(2, '0'),
  ].join('');
  const nome = `${id}-${selo}.png`;

  try {
    /* A pasta pode não existir no primeiro salvamento — ela não está versionada
       (não há arquivo dentro para o Git carregar). `recursive` também cobre o
       caso de `public/carimbo/` inteiro faltar. */
    mkdirSync(PASTA_ARTE, { recursive: true });
    writeFileSync(path.join(PASTA_ARTE, nome), png);
    return { ok: true, arquivo: `${URL_ARTE}/${nome}` };
  } catch (causa) {
    return { ok: false, detalhe: causa instanceof Error ? causa.message : String(causa) };
  }
}
