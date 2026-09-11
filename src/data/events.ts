import { ICONS, type IconName } from '@/lib/icons';
import catalogo from './events.json';

export type EventKind =
  | 'proprio' // idealizado ou realizado pela Sistran
  | 'global' // eventos globais / internacionais
  | 'nacional' // eventos brasileiros
  | 'parceiro'; // eventos de parceiros de plataforma

/* Titulo e descricao verbatim de /eventos-inovacao/ (15 eventos, na ordem do
   site). O site nao informa data nem local de nenhum evento — por isso nao ha
   campo `location` nem `date` aqui.
   Fonte: .claude/conteudo-site/06-eventos-inovacao.md */
export type SistranEvent = {
  id: string;
  title: string;
  kind: EventKind;
  description: string;
  icon: IconName;
  featured?: boolean;
  image?: string;
  /**
   * SIS-106 — miniatura de 240px para o navegador lateral, em
   * `public/images/EVENTOS/thumb/`.
   *
   * É um ARQUIVO PRÓPRIO, e não a arte grande servida pequena: `next.config` está
   * com `images: { unoptimized: true }`, então o `next/image` entrega o arquivo do
   * disco como ele está — reaproveitar `image` na lista faria as quinze artes de
   * ~180 KB baixarem de uma vez, ~2,7 MB para quinze quadradinhos. Em 240px o
   * conjunto inteiro dá 124 KB.
   *
   * Campo explícito em vez de derivado do `image` por troca de string: o caminho
   * fica verificável por leitura e por script, e não depende de a convenção de
   * nome continuar valendo. Gerado com `sharp` (240px, WebP q74).
   */
  thumb?: string;
  /**
   * SIS-205 — o evento TEM GRAVAÇÃO publicada no canal da Sistran, e por isso é
   * o único caso em que o botão `ASSISTA NO YOUTUBE` aparece no cartão.
   *
   * Até aqui o botão era renderizado nos quinze (SIS-166), apontando todos para
   * o canal. É decisão de VISIBILIDADE, não de URL: os treze restantes não têm
   * gravação, então o botão prometia um vídeo que não existe.
   *
   * A flag mora no data, e não uma lista de ids no componente, porque o botão é
   * renderizado em DOIS lugares (palco sticky e lista estreita) — com ids no
   * JSX, a próxima gravação publicada exigiria lembrar dos dois.
   *
   * Por que `boolean` e não `true | string` com a URL do vídeo: a URL por evento
   * ainda não existe (ex-SIS-131, cancelada; `DECISOES-PENDENTES.md`) e inventar
   * link está fora de escopo. Quando existir, este campo pode se alargar para
   * `true | string` sem tocar em quem já o consome — mas note que sob `src/data/`
   * o `copy-lock` conta TODO literal de string como cópia publicada, então a URL
   * vai entrar no lock quando chegar. Hoje o destino dos dois continua sendo o
   * canal, por `YOUTUBE_URL` de `src/data/contact.ts`.
   *
   * NÃO reaproveitei `featured`, que hoje está `true` exatamente nesses dois:
   * a coincidência é de fato, não de significado — `featured` é "destaque
   * editorial" e ficaria errado no dia em que um evento sem gravação for
   * destacado. (`featured` não é lido por nenhum componente hoje.)
   */
  youtube?: boolean;
};

export const EVENT_KIND_META: Record<EventKind, { label: string; tone: string }> = {
  proprio: { label: 'Realizado pela Sistran', tone: '#0ed8f6' },
  global: { label: 'Evento global', tone: '#A78BFA' },
  nacional: { label: 'Evento nacional', tone: '#57B7EE' },
  parceiro: { label: 'Evento de parceiro', tone: '#C4A0FB' },
};

/**
 * SIS-104 — arte dos eventos: alta qualidade, em WebP, na pasta que já existia.
 *
 * As 13 artes que ganharam versão nova chegaram em PNG de ~2 MB (1672×941) numa
 * pasta separada, `public/images/Eventosaltaqualidade/`. Nada disso entrou no
 * repositório como estava, por três motivos:
 *
 * 1. FORMATO. São fotos e composições com fundo, não gráficos com transparência
 *    — PNG é o formato errado. Convertidas para WebP q82 mantendo a resolução
 *    maior: 28 MB viraram 2,3 MB, ~110–220 KB por arte, ainda quase o dobro da
 *    resolução das antigas (900×506). O peso de repositório e o tempo de build
 *    importam mesmo com o `next/image` otimizando o que é servido.
 *
 * 2. PASTA. Os arquivos foram para dentro de `public/images/EVENTOS/` e a pasta
 *    nova foi removida — duas pastas com a mesma arte deixariam 28 MB órfãos.
 *
 * 3. CAIXA DOS NOMES. A pasta nova usava outra caixa e outros nomes
 *    (`Ev4-pega`, `Ev6-Weninar-suitability`, `cqcs`, `agile`, `aws`…). Manter os
 *    nomes ATUAIS é o que garante que o caminho já está validado em produção:
 *    Windows não diferencia maiúsculas, mas o build em Linux e o CloudFront sim,
 *    e um caminho com caixa errada só quebra depois do deploy. Só a extensão
 *    mudou, de `.jpg` para `.webp`.
 *
 * PROPORÇÃO conferida antes da troca: 1,777 nas novas contra 1,779 nas antigas.
 * O `EventsGrid` usa `fill` + `object-cover`, então diferença de proporção
 * recortaria a arte — com 0,002 de diferença não há recorte novo.
 *
 * ⚠️ DUAS ARTES CONTINUAM EM BAIXA: `summit-julho-26.jpg` (Web Summit AI) e
 * `SPIW-julho-2026.jpg`. Elas não têm versão nova — os arquivos entregues na
 * pasta de alta qualidade eram os MESMOS JPG de 77 KB e 900×506 já usados aqui.
 * Ficaram em `.jpg` de propósito: a extensão diferente é o marcador de que essas
 * duas ainda esperam a arte boa. Ao receber as versões novas, converter para
 * WebP do mesmo jeito e trocar a extensão nas duas linhas.
 *
 * O caso do Web Summit é o mais visível: é o primeiro card da grade e o único
 * com `priority`, então a diferença de nitidez aparece ao lado dos demais.
 */
/**
 * SIS-216 — o CATÁLOGO saiu daqui e virou `src/data/events.json`.
 *
 * O motivo é o admin: `/admin/eventos` grava o catálogo de volta em disco, e
 * gravar dentro de um `.ts` significaria reescrever CÓDIGO a cada edição de
 * texto — reindentando, reescapando aspas e podendo quebrar o build por um
 * caractere. JSON é o formato que uma máquina reescreve sem risco.
 *
 * O que NÃO mudou: este módulo continua sendo a porta de entrada única
 * (`EventsSpotlight` importa `EVENTS` daqui, como antes), o tipo continua
 * declarado aqui e a nota da SIS-104 acima segue valendo para as imagens.
 *
 * O array literal não ficou comentado logo abaixo, e esta é uma exceção
 * DELIBERADA à regra do projeto de comentar o que sai de cena: nada foi
 * removido, foi MOVIDO verbatim. Cópia comentada aqui seria uma segunda versão
 * dos quinze textos, nascida desatualizada no primeiro salvamento do admin —
 * ou seja, o oposto do que a regra protege. A pista de como religar é uma linha
 * (o `import` no topo), não um bloco.
 *
 * Conferido por MEDIÇÃO, e não por leitura: os 43 textos que o `copy-lock`
 * tinha travados a partir do array (os 4 rótulos de `EVENT_KIND_META` ficaram
 * aqui) reaparecem no JSON, mesmo conjunto e mesma contagem. O portão
 * `npm run test:copy` só continua passando por causa disso — e o extrator
 * passou a ler `.json` sob `src/data/` para que a escrita do admin continue
 * dentro da Regra Zero, em vez de escapar dela por trocar de extensão.
 */
export const EVENT_KINDS = ['proprio', 'global', 'nacional', 'parceiro'] as const;

/**
 * O JSON entra no TypeScript como `string` largo: `kind` e `icon` perdem a
 * união fechada que o tipo declara. Conferir, em vez de só afirmar com `as`,
 * porque este arquivo agora é ESCRITO POR MÁQUINA: um `kind` inválido gravado à
 * mão renderizaria `undefined` no rótulo da categoria, e um `icon` inválido
 * derrubaria o `getIcon` no meio da cena. Falhar aqui, com o id do evento no
 * texto do erro, é o sinal legível — e ele chega no build, não no visitante.
 */
function conferido(bruto: (typeof catalogo)[number]): SistranEvent {
  if (!(EVENT_KINDS as readonly string[]).includes(bruto.kind)) {
    throw new Error(`events.json: evento "${bruto.id}" tem kind inválido: "${bruto.kind}"`);
  }
  if (!Object.prototype.hasOwnProperty.call(ICONS, bruto.icon)) {
    throw new Error(`events.json: evento "${bruto.id}" tem icon inválido: "${bruto.icon}"`);
  }
  return { ...bruto, kind: bruto.kind as EventKind, icon: bruto.icon as IconName };
}

export const EVENTS: readonly SistranEvent[] = catalogo.map(conferido);
