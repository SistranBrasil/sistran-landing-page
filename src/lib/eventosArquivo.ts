import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { ICONS } from '@/lib/icons';
import { EVENT_KINDS } from '@/data/events';

/**
 * SIS-216 — leitura e gravação de `src/data/events.json` em disco, para o admin.
 *
 * Por que o admin NÃO usa o `EVENTS` importado de `@/data/events`: aquele array
 * é o JSON congelado no instante do build. Depois do primeiro salvamento, a
 * página do admin mostraria o texto ANTIGO enquanto o arquivo em disco já tinha
 * o novo — quem editasse duas vezes seguidas sobrescreveria a própria edição.
 * O admin lê do disco a cada requisição; a página pública continua lendo do
 * import estático, que é o que a mantém rápida e inalterada.
 *
 * Este módulo é só de servidor (`node:fs`). Nenhum componente de cliente pode
 * importá-lo — o erro do bundler nesse caso é intencionalmente barulhento.
 */

const RAIZ = process.cwd();
export const CAMINHO_CATALOGO = path.join(RAIZ, 'src', 'data', 'events.json');
const PASTA_ARTE = path.join(RAIZ, 'public', 'images', 'EVENTOS');

/** O que existe no JSON, antes de qualquer garantia de tipo. */
export type EventoBruto = {
  id: string;
  title: string;
  kind: string;
  icon: string;
  description: string;
  featured?: boolean;
  youtube?: boolean;
  image?: string;
  thumb?: string;
};

export function lerCatalogo(): EventoBruto[] {
  return JSON.parse(readFileSync(CAMINHO_CATALOGO, 'utf8')) as EventoBruto[];
}

/**
 * As artes disponíveis, lidas da pasta — e não uma lista escrita à mão aqui.
 *
 * É o que permite ao formulário oferecer um `<select>` em vez de um campo de
 * texto livre: o caminho escolhido existe por construção. Digitar caminho à mão
 * quebraria em produção e não no editor, porque Windows ignora a caixa das
 * letras e o build em Linux (e o CloudFront) não — a mesma armadilha já
 * registrada na nota da SIS-104 em `src/data/events.ts`.
 *
 * Não há upload de binário nesta versão, por dois motivos concretos: o projeto
 * não tem `sharp` como dependência de runtime, então não haveria como gerar a
 * miniatura de 240px que o `thumb` exige; e o sistema de arquivos do host pode
 * ser somente-leitura (ver `gravarCatalogo`). Trocar a foto de um evento hoje é:
 * colocar os dois arquivos nas pastas e escolhê-los aqui.
 */
export function artesDisponiveis(): { imagens: string[]; miniaturas: string[] } {
  const lista = (pasta: string, prefixoUrl: string) =>
    readdirSync(pasta, { withFileTypes: true })
      .filter((e) => e.isFile() && /\.(webp|jpg|jpeg|png)$/i.test(e.name))
      .map((e) => `${prefixoUrl}/${e.name}`)
      .sort((a, b) => a.localeCompare(b, 'pt-BR'));

  return {
    imagens: lista(PASTA_ARTE, '/images/EVENTOS'),
    miniaturas: lista(path.join(PASTA_ARTE, 'thumb'), '/images/EVENTOS/thumb'),
  };
}

/**
 * Confere o que veio do formulário ANTES de encostar no arquivo.
 *
 * O `conferido()` de `src/data/events.ts` já lança em `kind`/`icon` inválidos,
 * mas ele lança no BUILD — ou seja, depois de o arquivo já estar gravado
 * quebrado. A validação precisa vir antes da escrita, senão o preço de um campo
 * errado é o site fora do ar até alguém editar o JSON à mão.
 *
 * Devolve a lista de problemas em português, para ser mostrada no formulário.
 * Vazia significa "pode gravar".
 */
export function problemas(evento: EventoBruto): string[] {
  const erros: string[] = [];
  if (!evento.title.trim()) erros.push('O título não pode ficar vazio.');
  if (!evento.description.trim()) erros.push('A descrição não pode ficar vazia.');
  if (!(EVENT_KINDS as readonly string[]).includes(evento.kind)) {
    erros.push(`Categoria inválida: "${evento.kind}".`);
  }
  if (!Object.prototype.hasOwnProperty.call(ICONS, evento.icon)) {
    erros.push(`Ícone inválido: "${evento.icon}".`);
  }
  const { imagens, miniaturas } = artesDisponiveis();
  if (evento.image && !imagens.includes(evento.image)) {
    erros.push(`Arte não encontrada em public/images/EVENTOS: "${evento.image}".`);
  }
  if (evento.thumb && !miniaturas.includes(evento.thumb)) {
    erros.push(`Miniatura não encontrada em public/images/EVENTOS/thumb: "${evento.thumb}".`);
  }
  return erros;
}

/**
 * Grava o catálogo inteiro, preservando a ORDEM — que é a ordem do site.
 *
 * Formatação fixada em 2 espaços com quebra de linha no fim, igual à do arquivo
 * escrito à mão: o diff de um salvamento tem de mostrar só o texto que mudou. Um
 * `JSON.stringify` sem indentação transformaria cada edição numa única linha
 * gigante e tornaria a revisão do commit impossível — e nesta versão o commit É
 * o mecanismo de publicação.
 *
 * A escrita PODE FALHAR, e falha por um motivo previsível: em host serverless
 * (Vercel, Lambda) o sistema de arquivos da aplicação é somente-leitura, e em
 * export estático em S3 não há servidor nenhum. Por isso a falha é DEVOLVIDA, e
 * não lançada como tela de erro do Next — quem estiver editando precisa entender
 * que o problema é o host, não o que digitou.
 *
 * O que volta aqui é só o `detalhe` técnico do sistema operacional; a frase em
 * português que a pessoa lê é montada na camada do admin
 * (`src/app/admin/eventos/acoes.ts`). A divisão não é estética: texto de
 * interface fora de `src/app/admin/**` entra no `copy-lock` como se fosse escrita
 * publicada do site, e um recado de ferramenta interna não é isso.
 */
export function gravarCatalogo(lista: EventoBruto[]): { ok: true } | { ok: false; detalhe: string } {
  try {
    writeFileSync(CAMINHO_CATALOGO, `${JSON.stringify(lista, null, 2)}\n`, 'utf8');
    return { ok: true };
  } catch (causa) {
    return { ok: false, detalhe: causa instanceof Error ? causa.message : String(causa) };
  }
}

/**
 * Grava a arte e a miniatura de um evento em `public/images/EVENTOS/`.
 *
 * Recebe BYTES já no formato e no tamanho finais. Quem redimensiona é o
 * navegador, com `canvas` — e isso é decisão, não preguiça: o `sharp` existe em
 * `node_modules` (o Next o traz para otimizar imagem), mas NÃO é dependência
 * declarada deste projeto. Usar uma dependência transitiva em código de produção
 * é assinar embaixo de uma versão que ninguém prometeu manter: no dia em que o
 * Next parar de precisar dela, o upload quebra sem que uma linha daqui mude.
 * Redimensionar no cliente não tem esse risco e ainda tira o trabalho do
 * servidor.
 *
 * O NOME do arquivo é montado aqui, a partir do id do evento e de um carimbo de
 * tempo — nunca do nome que veio do navegador. Nome de arquivo enviado por
 * cliente é entrada hostil (`../../` escapa da pasta), e ainda por cima costuma
 * trazer acento e espaço, que quebram depois do deploy e não no editor.
 *
 * O carimbo também resolve cache: publicar `agile.webp` por cima do anterior
 * deixaria CloudFront e navegador servindo a foto velha. Arquivo novo, URL nova.
 */
export function gravarArte(
  id: string,
  arte: Uint8Array,
  miniatura: Uint8Array,
): { ok: true; image: string; thumb: string } | { ok: false; detalhe: string } {
  if (!/^[a-z0-9][a-z0-9-]*$/.test(id)) {
    return { ok: false, detalhe: `id fora do formato esperado: "${id}"` };
  }

  const agora = new Date();
  const carimbo = [
    agora.getFullYear(),
    String(agora.getMonth() + 1).padStart(2, '0'),
    String(agora.getDate()).padStart(2, '0'),
    String(agora.getHours()).padStart(2, '0'),
    String(agora.getMinutes()).padStart(2, '0'),
  ].join('');
  const nome = `${id}-${carimbo}.webp`;

  try {
    writeFileSync(path.join(PASTA_ARTE, nome), arte);
    writeFileSync(path.join(PASTA_ARTE, 'thumb', nome), miniatura);
    return { ok: true, image: `${'/images/EVENTOS'}/${nome}`, thumb: `/images/EVENTOS/thumb/${nome}` };
  } catch (causa) {
    return { ok: false, detalhe: causa instanceof Error ? causa.message : String(causa) };
  }
}

/** Um evento por id, ou `undefined` — usado pela página de edição. */
export function buscarEvento(id: string): EventoBruto | undefined {
  return lerCatalogo().find((e) => e.id === id);
}
