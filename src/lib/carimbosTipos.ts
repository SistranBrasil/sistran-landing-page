/**
 * OS TIPOS DO CATÁLOGO DE CARIMBOS — o que o admin cria e o que o site lê.
 *
 * Separado da loja (`carimbosLoja.ts`) e do inventário (`src/data/carimboLugares.ts`)
 * porque este módulo é o único dos três que pode ser importado dos DOIS lados:
 * do servidor (ações, resolução) e do cliente (provedor, componente). Loja importa
 * `@vercel/blob` e `node:fs`, que não atravessam para o navegador.
 */

/**
 * A RECEITA — é ela que torna um carimbo editável depois de criado.
 *
 * ⚠️ POR QUE GUARDAR A RECEITA SE O QUE O SITE USA É O PNG. Porque sem ela o
 * carimbo seria um arquivo opaco: mudar «2026» para «2027» obrigaria a redesenhar
 * do zero, de memória, acertando cor, formato e corpo de fonte por tentativa. Com
 * a receita, abrir para editar repõe todos os controles como estavam. O PNG é o
 * produto; a receita é a fonte.
 *
 * Os campos são, de propósito, os MESMOS nomes de `Opcoes` em
 * `src/app/admin/carimbo/desenhar.ts` — a tela monta `Opcoes` espalhando este
 * objeto. Dois de `Opcoes` ficam fora: `familia` (lida do `body` na hora de
 * desenhar, para o carimbo seguir a tipografia do site mesmo se o `next/font`
 * trocar o nome no próximo build) e `arte` (imagem decodificada em memória).
 *
 * `formato` e `acabamento` são `string` e não os tipos `Formato`/`Acabamento`.
 * É deliberado: estes tipos vivem em `src/app/admin/**`, e `src/lib` não deve
 * depender de módulo de rota — o site público importaria, por transitividade, o
 * motor de desenho de 763 linhas que ele nunca usa. A validação do valor é feita
 * na ação de salvar, contra as listas de lá.
 */
export type ReceitaCarimbo = {
  prefixo: string;
  marca: string;
  serial: string;
  cor: string;
  formato: string;
  acabamento: string;
  rotacao: number;
  textura: boolean;
  base: number;
};

/** Um carimbo criado no admin. `arquivo` é o PNG publicado (Blob ou `public/`). */
export type CarimboBruto = {
  /** Gerado a partir do nome; é a chave usada nas atribuições e nos eventos. */
  id: string;
  /** Como o carimbo se chama na lista. Livre, do operador. */
  nome: string;
  receita: ReceitaCarimbo;
  /** URL do PNG. Absoluta quando vem do Blob, começando com `/` quando do disco. */
  arquivo: string;
  /**
   * As medidas REAIS do bitmap exportado, medidas no canvas no instante do
   * salvamento. Elas viram o `aspect-ratio` que `CarimboBatida` escreve inline —
   * é o número que impede a arte de achatar, e é por isso que não podem ser
   * recalculadas no servidor (lá não há canvas nem a fonte do site).
   */
  largura: number;
  altura: number;
  /** ISO. Só para ordenar a lista do mais novo para o mais velho. */
  criadoEm: string;
};

/**
 * O documento inteiro do catálogo.
 *
 * `aplicacoes` mapeia id de LUGAR (de `LUGARES_CARIMBO`) para id de CARIMBO.
 * Lugar ausente do mapa = lugar usando a arte `padrao` do inventário, que é o
 * estado de hoje do site. Guardar só as exceções, e não uma entrada por lugar,
 * é o que faz «voltar ao original» ser uma remoção de chave em vez de um valor
 * sentinela que alguém teria de lembrar de interpretar.
 */
export type CatalogoCarimbos = {
  carimbos: CarimboBruto[];
  aplicacoes: Record<string, string>;
  /**
   * CATEGORIA DE EVENTO → id de carimbo. A chave é um `EventKind`
   * (`proprio | global | nacional | parceiro`).
   *
   * ⚠️ POR QUE ISTO NÃO É UM «LUGAR» de `LUGARES_CARIMBO`: lugar é uma posição
   * fixa no layout, e o carimbo de evento não é — ele aparece uma vez por
   * EVENTO, em dois componentes diferentes, e o que decide qual arte usar é um
   * campo do registro. Cadastrar «carimbo de evento» como lugar daria um
   * controle que vale para todos os quinze eventos sem dizer isso em lugar
   * nenhum.
   *
   * A ORDEM DE PRECEDÊNCIA, que é o que faz isto conviver com o campo `carimbo`
   * de cada evento (ver `EventoBruto`):
   *   1. o `carimbo` do próprio evento, se tiver — a exceção de um evento só;
   *   2. o carimbo desta tabela para o `kind` dele — a regra da categoria;
   *   3. a arte original do kind em `public/images/EVENTOS/carimbos/` — o padrão.
   * Ausente aqui = cai no 3, que é o site como está hoje.
   */
  kinds: Record<string, string>;
};

/** O catálogo vazio — e o que vale quando a loja ainda não tem nada. */
export const CATALOGO_VAZIO: CatalogoCarimbos = { carimbos: [], aplicacoes: {}, kinds: {} };

/**
 * A arte resolvida de um ponto do site: o que o componente precisa para pintar.
 * Não tem `alt` de propósito — ver `CarimboDoLugar`.
 */
export type ArteCarimbo = { src: string; largura: number; altura: number };

/**
 * O que o provedor entrega ao cliente. São DOIS mapas porque há dois modos de
 * endereçar um carimbo:
 *   · por LUGAR, para os pontos fixos do site (`aplicacoes` já resolvido);
 *   · por ID, para o carimbo escolhido dentro de um evento, que não é um lugar
 *     do inventário e sim um campo do registro.
 */
export type CarimbosEmUso = {
  porLugar: Record<string, ArteCarimbo>;
  porId: Record<string, ArteCarimbo>;
  /** Categoria de evento → arte já resolvida. */
  porKind: Record<string, ArteCarimbo>;
};

export const SEM_CARIMBOS: CarimbosEmUso = { porLugar: {}, porId: {}, porKind: {} };

/**
 * Normaliza um nome em id: minúsculas, sem acento, só letras, números e hífen.
 * A mesma regra do id de evento (`/^[a-z0-9][a-z0-9-]*$/`), para que o valor
 * atravesse URL, nome de arquivo e chave de JSON sem escape.
 */
export function idDoNome(nome: string): string {
  return nome
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

/** O formato de id aceito na gravação. Repetido do evento por simetria. */
export const FORMATO_ID = /^[a-z0-9][a-z0-9-]*$/;
