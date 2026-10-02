import { head, put } from '@vercel/blob';
import { gravarArte, gravarCatalogo } from '@/lib/eventosArquivo';
import type { EventoBruto } from '@/lib/eventosArquivo';
import catalogoDoPacote from '@/data/events.json';

/**
 * O CATÁLOGO DE EVENTOS FORA DO REPOSITÓRIO — Vercel Blob.
 *
 * ⚠️ POR QUE ISTO EXISTE, e o que ele substitui. Até aqui o admin gravava
 * `src/data/events.json` em disco, e `eventosArquivo.ts` registra em três lugares que
 * isso «só funciona onde o checkout está em disco e é gravável». Em produção na Vercel
 * não está: o sistema de arquivos da função é somente-leitura, e mesmo gravável o
 * arquivo morreria com a instância. Era o motivo de o admin de eventos abrir, mostrar o
 * formulário e falhar no salvar — e de evento novo não existir como operação.
 *
 * O pedido de 01/10 é «quando salvar já vai adicionar ao site». Isso descarta o caminho
 * de commitar o JSON pela API do GitHub, que seria mais fiel ao desenho atual (a
 * publicação É o commit, com histórico) mas custa o tempo de um redeploy. Blob publica
 * na hora.
 *
 * ⚠️ DUAS FONTES, UMA SÓ VALENDO POR VEZ, e a ordem importa:
 *
 *   1. Blob, quando `BLOB_READ_WRITE_TOKEN` existe E já há catálogo gravado lá.
 *   2. `src/data/events.json` do pacote, em qualquer outro caso.
 *
 * O item 2 NÃO é código morto de transição. Ele é o que faz a loja vazia mostrar os 15
 * eventos de hoje em vez de página em branco, o que mantém a máquina de quem clonou o
 * repositório sem token funcionando igual a antes, e o que dá um chão para o primeiro
 * salvamento — que grava o catálogo INTEIRO, não um delta. Apagar o JSON do repositório
 * depois da primeira publicação pareceria limpeza e seria perder o fundo do poço.
 *
 * ⚠️ O QUE SE PERDE, e fica dito porque não é pequeno: o texto dos eventos criados aqui
 * DEIXA DE PASSAR PELO `copy-lock`. `src/data/events.ts` documenta que o extrator do
 * `npm run test:copy` passou a ler `.json` sob `src/data/` «para que a escrita do admin
 * continue dentro da Regra Zero». Catálogo no Blob está fora do alcance de qualquer
 * portão do repositório — não há commit para revisar. Era o preço do «na hora», e a
 * contrapartida é que `problemas()` continua sendo a última porta antes da gravação.
 */

/**
 * O caminho do catálogo dentro da loja. Fixo, sem sufixo aleatório: é um documento que
 * se SOBRESCREVE, não uma coleção de versões — `put` com `allowOverwrite` abaixo.
 */
const CAMINHO_CATALOGO = 'eventos/catalogo.json';

/** Pasta das artes publicadas pelo formulário. */
const PASTA_ARTE = 'eventos/arte';

const TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

/**
 * A loja está disponível? Sem token o módulo inteiro cai para o disco, e é assim que a
 * máquina de desenvolvimento continua se comportando como antes desta mudança.
 */
export function naNuvem(): boolean {
  return Boolean(TOKEN);
}

/**
 * ⚠️ A LEITURA É EM DOIS PASSOS DE PROPÓSITO — `head` e depois `fetch`.
 *
 * O cache do Blob NÃO PODE ser desligado: o SDK declara que `cacheControlMaxAge` «cannot
 * be set to a value lower than 1 minute» (`node_modules/@vercel/blob/dist/index.d.ts`).
 * Buscar a URL pública direto devolveria, por até um minuto, o catálogo ANTERIOR — e um
 * minuto de conteúdo velho é exatamente o que o pedido «já vai adicionar ao site» proíbe.
 *
 * `head` fala com a API da loja, não com o CDN, então o `uploadedAt` que volta é sempre o
 * de agora. Pendurar esse carimbo na busca muda a URL a cada publicação, e URL nova não
 * tem cache para servir. O `no-store` ao lado é contra a camada de cache do próprio Next,
 * que é outra e também guardaria a resposta.
 */
/**
 * ⚠️ O QUE ACABOU DE SER PUBLICADO, guardado em memória — 02/10, porque excluir «não
 * sumia na hora, precisava recarregar a tela».
 *
 * O DEFEITO que isto corrige, e ele é de propagação, não de interface: o `head` acima é
 * descrito como devolvendo «sempre o de agora», e é quase verdade — os metadados da loja
 * são consistentes EVENTUALMENTE. Lido no mesmo instante do `put`, o `uploadedAt` que volta
 * pode ainda ser o ANTERIOR; com o carimbo anterior a URL montada é a mesma de antes, essa
 * URL já está no cache do CDN, e o que chega é o catálogo velho. A ação excluiu de verdade
 * e revalidou de verdade — o que a tela leu foi um corpo cacheado. Recarregar segundos
 * depois funciona porque aí o carimbo já avançou, que é exatamente o sintoma relatado.
 *
 * A memória é AUTORIDADE SÓ ENQUANTO É MAIS NOVA que o que a loja declara, e por no
 * máximo um minuto. Os dois limites importam:
 *
 *  - «mais nova» faz a escrita de OUTRA instância vencer assim que propagar, em vez de
 *    esta função servir para sempre o que este processo escreveu.
 *  - o minuto é a janela em que a corrida existe — é o piso de cache que o SDK impõe
 *    (`cacheControlMaxAge` «cannot be set to a value lower than 1 minute»). Passado ele, a
 *    loja volta a ser a única fonte, e nada aqui pode mascarar uma gravação perdida.
 *
 * Isto NÃO é um cache de leitura: nada é guardado ao LER, só ao ESCREVER com sucesso. Uma
 * instância que não publicou nada nunca consulta esta variável.
 */
let recemPublicado: { lista: EventoBruto[]; em: number } | null = null;

/** O piso de cache do Blob, que é a largura exata da janela de corrida. */
const JANELA_PROPAGACAO = 60_000;

/** A publicação deste processo ainda é a mais recente que se conhece? */
function memoriaValida(uploadedAt?: Date): EventoBruto[] | null {
  if (!recemPublicado) return null;
  if (Date.now() - recemPublicado.em >= JANELA_PROPAGACAO) return null;
  /* Sem `uploadedAt` (loja respondeu «não existe») a memória vence por definição: ela é a
     única notícia que temos de que algo foi escrito. */
  if (uploadedAt && uploadedAt.getTime() >= recemPublicado.em) return null;
  return recemPublicado.lista;
}

async function lerDaNuvem(): Promise<EventoBruto[] | null> {
  if (!TOKEN) return null;
  try {
    const info = await head(CAMINHO_CATALOGO, { token: TOKEN });
    const emMemoria = memoriaValida(info.uploadedAt);
    if (emMemoria) return emMemoria;

    /**
     * ⚠️ A CHAVE DE CACHE É ÚNICA POR LEITURA, e não o `uploadedAt` — 02/10, porque um
     * evento recém-criado dava 404 na página dele em produção.
     *
     * A linha era `?v=${info.uploadedAt.getTime()}`, e o raciocínio dela está no docblock
     * acima: carimbo novo a cada publicação, URL nova, cache sem nada para servir. O furo é
     * que ele depende de o carimbo JÁ TER AVANÇADO, e os metadados da loja são consistentes
     * eventualmente — lido junto da escrita, o `uploadedAt` pode ainda ser o anterior. Com o
     * carimbo anterior a URL é byte a byte a mesma de antes, essa URL está no CDN, e o que
     * volta é o catálogo velho. O evento foi gravado e a leitura não o vê.
     *
     * `recemPublicado` foi a primeira tentativa de tapar isso e NÃO ALCANÇA PRODUÇÃO: é
     * memória de processo, e na Vercel o POST que escreve e o GET seguinte caem em instâncias
     * diferentes com frequência. A instância que responde a navegação nunca publicou nada,
     * então a memória dela está vazia. Em desenvolvimento há um processo só e por isso
     * funcionava na minha máquina — é a forma clássica de um defeito só aparecer no ar.
     *
     * Valor único por requisição mata a classe inteira do problema: chave que nunca existiu
     * no CDN não tem resposta guardada para devolver, então a leitura sempre vai à origem. O
     * preço é não aproveitar o cache do Blob neste documento — e é um preço pequeno e
     * conhecido: é um JSON de 15 linhas de evento, e a frescura dele é o requisito («quando
     * salvar já vai adicionar ao site»). Cache de um minuto num documento que o operador
     * acabou de mudar é exatamente o que não se quer.
     */
    const resposta = await fetch(`${info.url}?v=${Date.now()}-${Math.random()}`, {
      cache: 'no-store',
    });
    if (!resposta.ok) return null;
    const lido = (await resposta.json()) as unknown;
    /* Lista vazia é resposta legítima («apagaram todos»), mas qualquer coisa que não seja
       lista é loja corrompida — e aí o certo é cair para o JSON do pacote em vez de
       derrubar a rota pública com um `.map` de `undefined`. */
    return Array.isArray(lido) ? (lido as EventoBruto[]) : null;
  } catch {
    /* `head` lança `BlobNotFoundError` quando a loja ainda está vazia, que é o estado
       NORMAL antes da primeira publicação — não é erro a propagar. Rede fora também cai
       aqui, e nos dois casos a resposta certa é a mesma: usar o catálogo do pacote.
       Exceção: se este processo acabou de publicar, o que ele escreveu é melhor notícia
       que o JSON do pacote — é o caso da PRIMEIRA publicação, em que o `head` pode ainda
       não enxergar o documento que acabou de nascer. */
    return memoriaValida();
  }
}

/**
 * O catálogo que vale. Use esta função em TODO LUGAR que hoje importa `EVENTS` ou chama
 * `lerCatalogo` — inclusive na rota pública, que é o que torna a publicação visível.
 */
export async function lerCatalogoPublicado(): Promise<EventoBruto[]> {
  /**
   * ⚠️ O CHÃO É O JSON IMPORTADO, NÃO `lerCatalogo()` DO DISCO — e a diferença decide se a
   * rota pública fica no ar. `lerCatalogo` faz `readFileSync(process.cwd() + '/src/data')`,
   * e `src/` não tem promessa nenhuma de existir no sistema de arquivos da função
   * serverless: a chamada pode voltar `ENOENT` justamente em produção, que é onde este
   * fallback mais importa. O import é empacotado pelo bundler e está sempre presente.
   *
   * `lerCatalogo` continua valendo para o ADMIN rodando em disco, onde ler o arquivo é o
   * que mostra a edição anterior em vez do catálogo do build.
   */
  return (await lerDaNuvem()) ?? (catalogoDoPacote as EventoBruto[]);
}

export type Resultado = { ok: true } | { ok: false; detalhe: string };

/**
 * Publica o catálogo inteiro.
 *
 * `allowOverwrite` é obrigatório aqui: sem ele o `put` num caminho que já existe falha, e
 * o caminho é fixo por desenho (ver `CAMINHO_CATALOGO`). O `cacheControlMaxAge` no mínimo
 * permitido reduz o que o CDN segura — a frescura de verdade vem do carimbo em
 * `lerDaNuvem`, não daqui.
 *
 * ⚠️ SEM TOKEN, CAI PARA O DISCO em vez de recusar. É o que mantém o admin usável na
 * máquina de quem não puxou as variáveis, e lá gravar o arquivo funciona.
 */
export async function publicarCatalogo(lista: EventoBruto[]): Promise<Resultado> {
  if (!TOKEN) return gravarCatalogo(lista);
  try {
    await put(CAMINHO_CATALOGO, `${JSON.stringify(lista, null, 2)}\n`, {
      access: 'public',
      token: TOKEN,
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: 'application/json',
      cacheControlMaxAge: 60,
    });
    /* Cópia rasa, e não a referência: os chamadores montam esta lista mutando o array que
       leram (`catalogo[i] = …`, a troca de vizinhos em `moverEvento`). Guardar a
       referência deixaria a memória mudar depois de publicada. */
    recemPublicado = { lista: [...lista], em: Date.now() };
    return { ok: true };
  } catch (causa) {
    return { ok: false, detalhe: causa instanceof Error ? causa.message : String(causa) };
  }
}

export type ResultadoArte =
  | { ok: true; image: string; thumb: string }
  | { ok: false; detalhe: string };

/**
 * Publica a arte e a miniatura de um evento.
 *
 * ⚠️ O NOME DO ARQUIVO É MONTADO AQUI, nunca recebido do navegador — a mesma regra que
 * `gravarArte` já documenta: nome de cliente é entrada hostil (`../../` escapa da pasta)
 * e costuma trazer acento e espaço, que quebram depois do deploy e não no editor. O
 * carimbo de tempo também resolve cache: arquivo novo, URL nova, e aí o mês de cache
 * padrão do Blob é vantagem em vez de problema.
 *
 * As URLs que voltam são absolutas, do domínio do Blob — e não `/images/EVENTOS/...`. É
 * a diferença visível desta mudança no JSON, e `next/image` as serve sem configuração
 * porque `images: { unoptimized: true }` (SIS-154) entrega o `src` como veio, sem passar
 * pelo otimizador que exigiria `remotePatterns`.
 *
 * ⚠️ A ARTE ANTIGA NÃO É APAGADA ao trocar a foto de um evento. É deliberado por ora:
 * apagar exigiria saber se nenhum outro evento aponta para o mesmo arquivo, e errar isso
 * deixa evento sem imagem em produção. Loja de 15 eventos não tem problema de espaço;
 * quando tiver, o lugar da limpeza é aqui.
 */
export async function publicarArte(
  id: string,
  arte: Uint8Array,
  miniatura: Uint8Array,
): Promise<ResultadoArte> {
  if (!/^[a-z0-9][a-z0-9-]*$/.test(id)) {
    return { ok: false, detalhe: `id fora do formato esperado: "${id}"` };
  }
  if (!TOKEN) return gravarArte(id, arte, miniatura);

  const agora = new Date();
  const carimbo = [
    agora.getFullYear(),
    String(agora.getMonth() + 1).padStart(2, '0'),
    String(agora.getDate()).padStart(2, '0'),
    String(agora.getHours()).padStart(2, '0'),
    String(agora.getMinutes()).padStart(2, '0'),
    String(agora.getSeconds()).padStart(2, '0'),
  ].join('');

  try {
    const [cheia, pequena] = await Promise.all(
      (
        [
          [`${PASTA_ARTE}/${id}-${carimbo}.webp`, arte],
          [`${PASTA_ARTE}/thumb/${id}-${carimbo}.webp`, miniatura],
        ] as const
      ).map(([caminho, bytes]) =>
        /* `Buffer.from` sem copiar: o `put` do SDK aceita `Buffer`, `Blob`, `File` ou
           stream — não `Uint8Array` cru — e esta sobrecarga só envolve o mesmo
           `ArrayBuffer` em outra visão, sem duplicar os bytes da imagem. */
        put(caminho, Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength), {
          access: 'public',
          token: TOKEN,
          addRandomSuffix: false,
          allowOverwrite: true,
          contentType: 'image/webp',
        }),
      ),
    );
    return { ok: true, image: cheia.url, thumb: pequena.url };
  } catch (causa) {
    return { ok: false, detalhe: causa instanceof Error ? causa.message : String(causa) };
  }
}
