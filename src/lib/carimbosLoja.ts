import { cache } from 'react';
import { head, put } from '@vercel/blob';
import {
  conferirCatalogo,
  gravarArteNoDisco,
  gravarCatalogoNoDisco,
  lerCatalogoDoDisco,
  type Resultado,
  type ResultadoArte,
} from '@/lib/carimbosArquivo';
import { CATALOGO_VAZIO, FORMATO_ID, type CatalogoCarimbos } from '@/lib/carimbosTipos';
import catalogoDoPacote from '@/data/carimbos.json';

/**
 * O CATÁLOGO DE CARIMBOS FORA DO REPOSITÓRIO — Vercel Blob, com o disco como
 * caminho de desenvolvimento. É o mesmo desenho de `eventosLoja.ts`, e isso é
 * intencional: é a camada de persistência que este projeto já opera e já
 * depurou (propagação eventual, piso de cache de um minuto, fallback no JSON do
 * pacote). Inventar uma segunda forma de guardar conteúdo editável seria dobrar
 * a superfície de erro para ganhar nada.
 *
 * ⚠️ UMA DIFERENÇA DE PROPÓSITO em relação a eventos: aqui há DUAS leituras, e
 * misturá-las quebra uma das duas pontas.
 *
 *   · `lerCatalogoFresco()` — sem cache. É para o ADMIN, onde ler o anterior
 *     depois de salvar é defeito visível («salvei e não mudou»).
 *   · `lerCatalogoDoSite()` — cacheável. É para as páginas PÚBLICAS, que são
 *     pré-renderizadas e devem continuar sendo: uma leitura `no-store` no layout
 *     raiz arrastaria TODA rota do site para renderização dinâmica, e aí cada
 *     visita pagaria uma ida à rede para descobrir um carimbo que muda uma vez
 *     por mês. A frescura do site vem do `revalidatePath` das ações, não de ler
 *     sempre.
 */

const CAMINHO_CATALOGO = 'carimbos/catalogo.json';
const PASTA_ARTE = 'carimbos/arte';
const TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

/** A etiqueta de cache do catálogo, para as ações invalidarem de uma vez. */
export const ETIQUETA_CARIMBOS = 'carimbos';

export function naNuvem(): boolean {
  return Boolean(TOKEN);
}

/**
 * O chão de toda leitura.
 *
 * Em disco, `lerCatalogoDoDisco()` mostra a edição anterior (é o que o admin de
 * desenvolvimento precisa). Sem disco gravável, o import empacotado do JSON —
 * e não a leitura de `process.cwd()`, que pode dar `ENOENT` justamente em
 * produção, onde `src/` não tem promessa de existir no sistema de arquivos da
 * função serverless.
 */
function chao(): CatalogoCarimbos {
  if (TOKEN) return conferirCatalogo(catalogoDoPacote);
  return lerCatalogoDoDisco();
}

type ModoDeCache = 'fresco' | 'site';

/**
 * ⚠️ O QUE ACABOU DE SER PUBLICADO, guardado em memória — 13/10, depois de
 * MEDIR uma perda de escritas na loja real: 36 operações seguidas reportaram
 * sucesso e o catálogo terminou com 8 das 18 aplicações e 7 das 18 artes novas.
 *
 * O DEFEITO é de propagação, e é o mesmo que `eventosLoja.ts` documenta — eu
 * simplesmente não copiei a guarda quando escrevi este módulo, e esta nota
 * existe para que ninguém a remova por parecer sobra. Toda escrita aqui é
 * LER-MODIFICAR-GRAVAR o documento INTEIRO. Se a leitura devolve um corpo
 * levemente atrasado (os metadados e o corpo da loja são consistentes
 * EVENTUALMENTE), a gravação seguinte sobrescreve o documento sem a alteração
 * anterior. Uma operação por minuto nunca vê isso; dez cliques em sequência
 * perdem as do meio, em silêncio, com a tela dizendo «salvo».
 *
 * A memória é AUTORIDADE SÓ ENQUANTO É MAIS NOVA que o que a loja declara, e por
 * no máximo um minuto — os dois limites importam, pelas razões escritas em
 * `eventosLoja`: «mais nova» deixa a escrita de outra instância vencer assim que
 * propagar, e o minuto é a largura da janela de corrida (o piso de cache que o
 * SDK impõe).
 *
 * ⚠️ E O QUE ISTO NÃO RESOLVE: na Vercel, dois POSTs seguidos podem cair em
 * INSTÂNCIAS diferentes, e a instância nova não tem memória nenhuma. É por isso
 * que a guarda de verdade está na ação, que confere a gravação lendo de volta
 * (ver `publicarEConferir` em `src/app/admin/carimbo/acoes.ts`). Esta memória
 * cobre o caso comum — a mesma instância atendendo uma rajada de cliques.
 */
let recemPublicado: { catalogo: CatalogoCarimbos; em: number } | null = null;

/**
 * A LARGURA DA JANELA DE CORRIDA, MEDIDA — não herdada do piso de cache do SDK.
 *
 * 13/10: depois de uma escrita, a loja continuou servindo o CORPO ANTERIOR por
 * ~90 s, com URL nova a cada tentativa (`?v=<agora>-<aleatório>`) e
 * `cache: 'no-store'`. Ou seja: não era cache de CDN nem do Next — era a
 * propagação da própria loja. O marcador `uploadedAt` já era o da escrita nova
 * enquanto o corpo ainda era o velho, o que também derruba a ideia de usar o
 * `uploadedAt` como prova de frescura.
 *
 * 120 s, e não os 60 s que o módulo de eventos assume: o número de lá veio do
 * piso de `cacheControlMaxAge`, que é outra coisa. Com 60 s, a memória expirava
 * no meio da janela e a leitura voltava a trazer um corpo velho como base de
 * escrita — que é exatamente como as alterações se perdem.
 */
const JANELA_PROPAGACAO = 120_000;

function memoriaValida(uploadedAt?: Date): CatalogoCarimbos | null {
  if (!recemPublicado) return null;
  if (Date.now() - recemPublicado.em >= JANELA_PROPAGACAO) return null;
  /* Sem `uploadedAt` a memória vence por definição: é a única notícia que temos
     de que algo foi escrito. */
  if (uploadedAt && uploadedAt.getTime() >= recemPublicado.em) return null;
  return recemPublicado.catalogo;
}

/** Esquece a memória — usado pela conferência, que precisa ver a LOJA. */
export function esquecerPublicacao(): void {
  recemPublicado = null;
}

async function lerDaNuvem(modo: ModoDeCache): Promise<CatalogoCarimbos | null> {
  if (!TOKEN) return null;
  try {
    const info = await head(CAMINHO_CATALOGO, { token: TOKEN });

    /* A memória vem ANTES da busca: se este processo acabou de publicar e a loja
       ainda não propagou, o que ele escreveu é a melhor notícia que existe. */
    const emMemoria = memoriaValida(info.uploadedAt);
    if (emMemoria) return emMemoria;

    /**
     * ⚠️ A CHAVE DE CACHE ÚNICA, no modo fresco, é a correção que `eventosLoja`
     * já pagou para aprender: pendurar o `uploadedAt` na URL depende de o
     * carimbo JÁ TER AVANÇADO, e os metadados da loja são consistentes
     * EVENTUALMENTE. Lido no mesmo instante do `put`, o `uploadedAt` pode ainda
     * ser o anterior — e aí a URL é byte a byte a mesma, já está no CDN, e o que
     * volta é o catálogo velho. Chave que nunca existiu no CDN não tem resposta
     * guardada para devolver.
     *
     * ⚠️ NO MODO `site`, A CHAVE É O `uploadedAt` — e esta linha mudou em 13/10,
     * por causa de «está demorando para atualizar os carimbos».
     *
     * Ela era `info.url` puro, com `revalidate: 3600`, e a frescura dependia só
     * de a invalidação por etiqueta/caminho alcançar a instância que serve a
     * página. Quando alcança, funciona. Quando NÃO alcança — admin rodando numa
     * instância e site servido por outra, ou admin local com o site publicado —
     * nada expira aquele corpo, e a página segue servindo o catálogo anterior por
     * ATÉ UMA HORA. É o «demorando» na forma mais literal possível.
     *
     * Com o `uploadedAt` na chave, catálogo publicado = URL diferente = nenhuma
     * resposta guardada para devolver, em qualquer instância e sem depender de
     * invalidação nenhuma. A etiqueta FICA, porque ela é o que atualiza na hora
     * quando a ação roda no mesmo lugar; o `uploadedAt` é o piso que garante que,
     * no pior caso, o atraso é o de uma renderização e não de uma hora.
     *
     * O `revalidate` pode continuar longo justamente porque a chave carrega a
     * versão: segurar por uma hora o corpo de uma URL que só existe para AQUELA
     * publicação é o comportamento desejado, não um risco.
     */
    const url =
      modo === 'fresco'
        ? `${info.url}?v=${Date.now()}-${Math.random()}`
        : `${info.url}?v=${info.uploadedAt.getTime()}`;
    const resposta = await fetch(
      url,
      modo === 'fresco'
        ? { cache: 'no-store' }
        : { next: { tags: [ETIQUETA_CARIMBOS], revalidate: 3600 } },
    );
    if (!resposta.ok) return null;
    return conferirCatalogo(await resposta.json());
  } catch {
    /* `head` lança `BlobNotFoundError` com a loja ainda vazia, que é o estado
       NORMAL antes da primeira publicação. Rede fora cai aqui também, e nos dois
       casos a resposta certa é a mesma: usar o chão. */
    return null;
  }
}

/**
 * ⚠️ AS DUAS LEITURAS SÃO MEMOIZADAS POR REQUISIÇÃO com o `cache()` do React.
 *
 * Medido em 13/10 contra a loja real: `head` custa 160–355 ms e o corpo sem
 * cache 250–380 ms. Ou seja, cada leitura é meio segundo de rede — e havia
 * requisições fazendo DUAS: a tela de edição de evento lê o catálogo de
 * carimbos para o `<select>` enquanto o layout raiz lê o mesmo documento para o
 * provedor. `cache()` colapsa chamadas idênticas dentro da mesma requisição, o
 * que é exatamente o caso.
 *
 * Isto NÃO é cache entre requisições (não guarda nada de uma visita para a
 * outra) — quem faz isso é o `fetch` etiquetado, lá dentro.
 */
/** Para o admin: sempre o que está gravado agora. */
export const lerCatalogoFresco = cache(async function lerCatalogoFresco(): Promise<CatalogoCarimbos> {
  return (await lerDaNuvem('fresco')) ?? chao();
});

/** Para o site público: cacheável, invalidado pelas ações. */
export const lerCatalogoDoSite = cache(async function lerCatalogoDoSite(): Promise<CatalogoCarimbos> {
  return (await lerDaNuvem('site')) ?? chao();
});

export async function publicarCatalogo(catalogo: CatalogoCarimbos): Promise<Resultado> {
  if (!TOKEN) return gravarCatalogoNoDisco(catalogo);
  try {
    await put(CAMINHO_CATALOGO, `${JSON.stringify(catalogo, null, 2)}\n`, {
      access: 'public',
      token: TOKEN,
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: 'application/json',
      cacheControlMaxAge: 60,
    });
    /* Cópia, e não a referência: os chamadores montam o objeto a partir do que
       leram, e guardar a referência deixaria a memória mudar depois de
       publicada. */
    recemPublicado = {
      catalogo: {
        carimbos: [...catalogo.carimbos],
        aplicacoes: { ...catalogo.aplicacoes },
        kinds: { ...catalogo.kinds },
      },
      em: Date.now(),
    };
    return { ok: true };
  } catch (causa) {
    return { ok: false, detalhe: causa instanceof Error ? causa.message : String(causa) };
  }
}

/**
 * Publica o PNG do carimbo.
 *
 * ⚠️ A ARTE ANTIGA NÃO É APAGADA ao reeditar um carimbo, pela mesma razão
 * registrada em `publicarArte` de eventos: apagar exigiria saber que nenhuma
 * página pré-renderizada ainda aponta para o arquivo anterior, e errar isso
 * deixa buraco de imagem em produção. Carimbo pesa alguns KB; quando o espaço
 * virar problema, a limpeza é aqui.
 */
export async function publicarArteCarimbo(id: string, png: Uint8Array): Promise<ResultadoArte> {
  if (!FORMATO_ID.test(id)) return { ok: false, detalhe: `id fora do formato: "${id}"` };
  if (!TOKEN) return gravarArteNoDisco(id, png);

  const agora = new Date();
  const selo = [
    agora.getFullYear(),
    String(agora.getMonth() + 1).padStart(2, '0'),
    String(agora.getDate()).padStart(2, '0'),
    String(agora.getHours()).padStart(2, '0'),
    String(agora.getMinutes()).padStart(2, '0'),
    String(agora.getSeconds()).padStart(2, '0'),
  ].join('');

  try {
    const salvo = await put(
      `${PASTA_ARTE}/${id}-${selo}.png`,
      /* `Buffer.from` sem copiar: o `put` aceita `Buffer`, `Blob`, `File` ou
         stream — não `Uint8Array` cru —, e esta sobrecarga só envolve o mesmo
         `ArrayBuffer` em outra visão. */
      Buffer.from(png.buffer, png.byteOffset, png.byteLength),
      {
        access: 'public',
        token: TOKEN,
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: 'image/png',
      },
    );
    return { ok: true, arquivo: salvo.url };
  } catch (causa) {
    return { ok: false, detalhe: causa instanceof Error ? causa.message : String(causa) };
  }
}

export { CATALOGO_VAZIO };
