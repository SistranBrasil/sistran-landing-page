'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { VARIAVEL_SENHA } from '@/lib/adminGate';
import { COOKIE_SESSAO, tokenConfere } from '@/lib/adminSessao';
import {
  gravarArte,
  gravarCatalogo,
  lerCatalogo,
  problemas,
  type EventoBruto,
} from '@/lib/eventosArquivo';

/**
 * SIS-216 — a única escrita do catálogo de eventos.
 *
 * `'use server'` no topo do arquivo marca tudo o que ele exporta como Server
 * Function; a chamada do formulário vira um POST para a URL da própria página
 * (`node_modules/next/dist/docs/01-app/01-getting-started/07-mutating-data.md`).
 * O mesmo doc avisa que essas funções são alcançáveis por POST direto, fora da
 * interface — daí a conferência de senha ABAIXO, e não apenas no proxy.
 */

export type EstadoSalvamento =
  | { estado: 'inicial' }
  | { estado: 'ok'; id: string }
  | { estado: 'erro'; erros: string[] };

/** `on` é o que o navegador manda num checkbox marcado; ausente quando desmarcado. */
function marcado(formulario: FormData, campo: string): boolean {
  return formulario.get(campo) === 'on';
}

function texto(formulario: FormData, campo: string): string {
  const bruto = formulario.get(campo);
  return typeof bruto === 'string' ? bruto : '';
}

/**
 * O porteiro repetido dentro de cada escrita. Devolve a frase do impedimento, ou
 * `null` quando pode seguir.
 *
 * Existe como função porque agora são DUAS escritas (o JSON e os binários da
 * arte), e uma conferência copiada é uma conferência que um dia sai de sincronia
 * com a outra — o lado que ficar para trás é o que vira o buraco.
 */
async function impedimento(): Promise<string | null> {
  const esperada = process.env[VARIAVEL_SENHA];
  if (!esperada) return `${VARIAVEL_SENHA} não está definida no host.`;
  if (!tokenConfere((await cookies()).get(COOKIE_SESSAO)?.value, esperada)) {
    return 'Sessão expirada. Entre novamente para salvar.';
  }
  return null;
}

export async function salvarEvento(
  _anterior: EstadoSalvamento,
  formulario: FormData,
): Promise<EstadoSalvamento> {
  /* Falha fechada, igual ao proxy: sem passe válido, nada é gravado. O passe é o
     mesmo cookie assinado que o proxy confere — a conferência é repetida aqui, e
     não herdada, pelo motivo escrito no topo do arquivo. */
  const barrado = await impedimento();
  if (barrado) return { estado: 'erro', erros: [barrado] };

  const id = texto(formulario, 'id');
  const catalogo = lerCatalogo();
  const indice = catalogo.findIndex((e) => e.id === id);
  if (indice < 0) {
    return { estado: 'erro', erros: [`Evento não encontrado no catálogo: "${id}".`] };
  }

  /**
   * O `id` NÃO é editável, e isso é deliberado: ele é a chave da posição no
   * catálogo e apareceria em qualquer link ou âncora futura. Trocar id é
   * operação de código, não de atualização anual de conteúdo.
   *
   * Campos opcionais voltam a ser AUSENTES quando vazios, em vez de string
   * vazia: o tipo declara `image?: string`, e `image: ""` passaria o `if (image)`
   * dos componentes como falso mas sujaria o JSON e o `copy-lock` com um literal
   * sem significado.
   */
  const atualizado: EventoBruto = {
    ...catalogo[indice],
    title: texto(formulario, 'title').trim(),
    description: texto(formulario, 'description').trim(),
    kind: texto(formulario, 'kind'),
    icon: texto(formulario, 'icon'),
  };
  const image = texto(formulario, 'image').trim();
  const thumb = texto(formulario, 'thumb').trim();
  if (image) atualizado.image = image;
  else delete atualizado.image;
  if (thumb) atualizado.thumb = thumb;
  else delete atualizado.thumb;
  if (marcado(formulario, 'featured')) atualizado.featured = true;
  else delete atualizado.featured;
  if (marcado(formulario, 'youtube')) atualizado.youtube = true;
  else delete atualizado.youtube;

  const erros = problemas(atualizado);
  if (erros.length > 0) return { estado: 'erro', erros };

  catalogo[indice] = atualizado;
  const gravacao = gravarCatalogo(catalogo);
  if (!gravacao.ok) {
    return {
      estado: 'erro',
      erros: [
        'Não foi possível gravar src/data/events.json. Nesta versão o admin grava no próprio ' +
          'repositório, o que só funciona onde o checkout está em disco e é gravável (ambiente ' +
          `de desenvolvimento ou servidor com o repositório). Detalhe do sistema: ${gravacao.detalhe}`,
      ],
    };
  }

  /**
   * Revalidar as duas rotas: a lista do admin (que lê do disco) e a página
   * pública. Em desenvolvimento isso já mostra o texto novo em
   * `/eventos-inovacao`. Em produção, NÃO: `EventsSpotlight` é componente de
   * cliente e importa `EVENTS` estaticamente, então o texto publicado é o do
   * build — a edição chega ao visitante no próximo deploy, o que nesta versão v0
   * é o comportamento combinado (o commit do JSON é o mecanismo de publicação).
   */
  revalidatePath('/admin/eventos');
  revalidatePath('/eventos-inovacao');
  return { estado: 'ok', id };
}

export type EstadoArte =
  | { estado: 'inicial' }
  | { estado: 'ok'; image: string; thumb: string }
  | { estado: 'erro'; mensagem: string };

/** 2 MB por arquivo: as artes já publicadas têm 60–180 kB depois do webp. */
const LIMITE_BYTES = 2 * 1024 * 1024;

/**
 * `RIFF....WEBP` — os 12 primeiros bytes de todo arquivo webp.
 *
 * Conferir o CONTEÚDO, e não o `type` que o navegador declarou: `File.type` é
 * texto que veio do cliente, e um POST direto na Server Function (o mesmo caminho
 * que motiva a conferência de senha aqui) pode dizer `image/webp` sobre qualquer
 * coisa. Como estes bytes vão para `public/`, onde são servidos de volta, aceitar
 * conteúdo arbitrário seria transformar o admin em hospedagem aberta.
 */
function ehWebp(bytes: Uint8Array): boolean {
  const cabecalho = Buffer.from(bytes.subarray(0, 12)).toString('latin1');
  return cabecalho.startsWith('RIFF') && cabecalho.slice(8, 12) === 'WEBP';
}

/**
 * Publica a arte de um evento: grava os dois arquivos e já aponta o catálogo
 * para eles.
 *
 * O upload conclui SOZINHO, sem depender de a pessoa clicar em "Salvar" depois.
 * A alternativa — gravar os arquivos e deixar o JSON para o botão — deixaria
 * binário órfão em `public/` cada vez que alguém trocasse a foto e fechasse a
 * aba, e ninguém volta para limpar isso.
 *
 * Quem redimensiona é o navegador (ver `gravarArte`): o que chega aqui já é webp
 * na medida final. Este lado confere tamanho e assinatura do arquivo e nada mais
 * — não há como reprocessar imagem no servidor sem `sharp` declarado.
 */
export async function enviarArte(
  _anterior: EstadoArte,
  formulario: FormData,
): Promise<EstadoArte> {
  const barrado = await impedimento();
  if (barrado) return { estado: 'erro', mensagem: barrado };

  const id = texto(formulario, 'id');
  const catalogo = lerCatalogo();
  const indice = catalogo.findIndex((e) => e.id === id);
  if (indice < 0) return { estado: 'erro', mensagem: `Evento não encontrado: "${id}".` };

  const arquivos = ['arte', 'miniatura'].map((campo) => formulario.get(campo));
  if (!arquivos.every((a): a is File => a instanceof File && a.size > 0)) {
    return { estado: 'erro', mensagem: 'Escolha uma imagem antes de enviar.' };
  }
  const [arte, miniatura] = await Promise.all(
    (arquivos as File[]).map(async (a) => new Uint8Array(await a.arrayBuffer())),
  );
  for (const bytes of [arte, miniatura]) {
    if (bytes.byteLength > LIMITE_BYTES) {
      return { estado: 'erro', mensagem: 'Imagem acima de 2 MB depois da conversão.' };
    }
    if (!ehWebp(bytes)) {
      return { estado: 'erro', mensagem: 'O arquivo enviado não é um webp válido.' };
    }
  }

  const gravacao = gravarArte(id, arte, miniatura);
  if (!gravacao.ok) {
    return {
      estado: 'erro',
      mensagem:
        'Não foi possível gravar em public/images/EVENTOS. Nesta versão o admin escreve no ' +
        'próprio repositório, o que só funciona onde o checkout está em disco e é gravável. ' +
        `Detalhe do sistema: ${gravacao.detalhe}`,
    };
  }

  catalogo[indice] = { ...catalogo[indice], image: gravacao.image, thumb: gravacao.thumb };
  const catalogoGravado = gravarCatalogo(catalogo);
  if (!catalogoGravado.ok) {
    return {
      estado: 'erro',
      mensagem:
        'As imagens foram gravadas, mas src/data/events.json não pôde ser atualizado — escolha ' +
        `os arquivos novos nas listas e salve. Detalhe do sistema: ${catalogoGravado.detalhe}`,
    };
  }

  revalidatePath('/admin/eventos');
  revalidatePath(`/admin/eventos/${id}`);
  revalidatePath('/eventos-inovacao');
  return { estado: 'ok', image: gravacao.image, thumb: gravacao.thumb };
}
