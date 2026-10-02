'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { VARIAVEL_SENHA } from '@/lib/adminGate';
import { COOKIE_SESSAO, tokenConfere } from '@/lib/adminSessao';
import { problemas, type EventoBruto } from '@/lib/eventosArquivo';
import {
  lerCatalogoPublicado,
  naNuvem,
  publicarArte,
  publicarCatalogo,
} from '@/lib/eventosLoja';

/**
 * SIS-216 — a única escrita do catálogo de eventos.
 *
 * `'use server'` no topo do arquivo marca tudo o que ele exporta como Server
 * Function; a chamada do formulário vira um POST para a URL da própria página
 * (`node_modules/next/dist/docs/01-app/01-getting-started/07-mutating-data.md`).
 * O mesmo doc avisa que essas funções são alcançáveis por POST direto, fora da
 * interface — daí a conferência de senha ABAIXO, e não apenas no proxy.
 *
 * ⚠️ O DESTINO DA ESCRITA MUDOU — 01/10. Até aqui tudo caía em `src/data/events.json` e
 * em `public/images/EVENTOS/`, e as mensagens de erro deste arquivo explicavam ao
 * operador que gravar «só funciona onde o checkout está em disco e é gravável». Era
 * verdade e era o limite: em produção o admin abria e não salvava, e criar evento não
 * existia. Agora quem decide o destino é `eventosLoja.ts` — Vercel Blob quando há token,
 * disco quando não há. As funções aqui não sabem qual dos dois é, de propósito.
 *
 * ⚠️ E SÃO CINCO ESCRITAS AGORA, não duas: editar, CRIAR, EXCLUIR, REORDENAR e publicar
 * arte. Cada uma repete `impedimento()` pelo motivo do primeiro parágrafo — são cinco
 * portas POST abertas, não uma.
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
 * Existe como função porque são CINCO escritas, e uma conferência copiada é uma
 * conferência que um dia sai de sincronia com as outras — o lado que ficar para trás é o
 * que vira o buraco.
 */
async function impedimento(): Promise<string | null> {
  const esperada = process.env[VARIAVEL_SENHA];
  if (!esperada) return `${VARIAVEL_SENHA} não está definida no host.`;
  if (!tokenConfere((await cookies()).get(COOKIE_SESSAO)?.value, esperada)) {
    return 'Sessão expirada. Entre novamente para salvar.';
  }
  return null;
}

/**
 * A frase que o operador lê quando a gravação falha.
 *
 * ⚠️ ELA MUDA CONFORME O DESTINO, e é por isso que não é um literal solto em cada
 * `return`. Com Blob, falha é rede ou token — mandar o operador «rodar em ambiente de
 * desenvolvimento», como o texto antigo fazia, seria conselho errado que o faria procurar
 * o problema no lugar que não é. Sem Blob (disco), o conselho antigo continua sendo o
 * certo.
 */
function recadoDeFalha(detalhe: string): string {
  return naNuvem()
    ? 'Não foi possível publicar o catálogo na loja de eventos (Vercel Blob). A escolha não ' +
        `foi salva — tente de novo. Detalhe do sistema: ${detalhe}`
    : 'Não foi possível gravar src/data/events.json. Sem BLOB_READ_WRITE_TOKEN o admin grava ' +
        'no próprio repositório, o que só funciona onde o checkout está em disco e é gravável. ' +
        `Detalhe do sistema: ${detalhe}`;
}

/**
 * Revalida as três rotas que mostram catálogo.
 *
 * ⚠️ `/eventos-inovacao` É O PONTO DO PEDIDO «quando salvar já vai adicionar ao site». A
 * nota que estava aqui dizia o contrário — que em produção a edição «chega ao visitante
 * no próximo deploy», porque `EventsSpotlight` importava `EVENTS` estaticamente. Essa
 * linha deixou de existir: a rota lê o catálogo no servidor e passa por prop. Fica
 * registrado para quem comparar com o histórico do arquivo e achar que a mudança foi
 * esquecida.
 */
function revalidarTudo(id?: string): void {
  revalidatePath('/admin/eventos');
  if (id) revalidatePath(`/admin/eventos/${id}`);
  revalidatePath('/eventos-inovacao');
}

/**
 * Monta o evento a partir do formulário, preservando o que não é editável.
 *
 * Campos opcionais voltam a ser AUSENTES quando vazios, em vez de string vazia: o tipo
 * declara `image?: string`, e `image: ""` passaria o `if (image)` dos componentes como
 * falso mas sujaria o JSON com um literal sem significado.
 */
function doFormulario(formulario: FormData, base: EventoBruto): EventoBruto {
  const evento: EventoBruto = {
    ...base,
    title: texto(formulario, 'title').trim(),
    description: texto(formulario, 'description').trim(),
    kind: texto(formulario, 'kind'),
    icon: texto(formulario, 'icon'),
  };
  const image = texto(formulario, 'image').trim();
  const thumb = texto(formulario, 'thumb').trim();
  if (image) evento.image = image;
  else delete evento.image;
  if (thumb) evento.thumb = thumb;
  else delete evento.thumb;
  if (marcado(formulario, 'featured')) evento.featured = true;
  else delete evento.featured;
  if (marcado(formulario, 'youtube')) evento.youtube = true;
  else delete evento.youtube;
  return evento;
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
  const catalogo = await lerCatalogoPublicado();
  const indice = catalogo.findIndex((e) => e.id === id);
  if (indice < 0) {
    return { estado: 'erro', erros: [`Evento não encontrado no catálogo: "${id}".`] };
  }

  /**
   * O `id` NÃO é editável, e isso é deliberado: ele é a chave da posição no
   * catálogo e apareceria em qualquer link ou âncora futura. Trocar id é
   * operação de código, não de atualização anual de conteúdo. Na CRIAÇÃO ele é
   * escolhido uma vez — ver `criarEvento`.
   */
  const atualizado = doFormulario(formulario, catalogo[indice]);

  const erros = problemas(atualizado);
  if (erros.length > 0) return { estado: 'erro', erros };

  catalogo[indice] = atualizado;
  const gravacao = await publicarCatalogo(catalogo);
  if (!gravacao.ok) return { estado: 'erro', erros: [recadoDeFalha(gravacao.detalhe)] };

  revalidarTudo(id);
  return { estado: 'ok', id };
}

/**
 * CRIAR EVENTO — 01/10, o pedido que não existia como operação.
 *
 * ⚠️ O `id` É ESCOLHIDO AQUI E NUNCA MAIS, e é o único campo que a criação tem a mais
 * que a edição. Ele é a chave do evento no catálogo e o segmento da URL do admin; por
 * isso o formato é fechado (minúsculas, dígitos e hífen) e a unicidade é conferida contra
 * o catálogo. Aceitar acento, espaço ou maiúscula daria id que funciona no editor e
 * quebra depois do deploy — a mesma armadilha de caixa de letra já registrada na nota da
 * SIS-104 em `src/data/events.ts`.
 *
 * O evento nasce NO FIM da lista, que é a ordem em que o site mostra. Quem quiser outra
 * posição usa `moverEvento` — nascer no meio exigiria um campo de posição no formulário
 * para resolver um problema que dois cliques já resolvem.
 *
 * ⚠️ ELE PODE NASCER COM ARTE — 02/10, a pedido («quando cria o evento eu quero conseguir
 * adicionar novas imagens subir»). A nota anterior dizia o contrário e explicava por quê:
 * «ele nasce SEM ARTE […] a arte é publicada por `enviarArte`, que precisa de um evento já
 * existente para apontar». O impedimento era de ORDEM, não de regra — e a ordem se
 * inverte aqui sem custo: os binários chegam na MESMA submissão, e esta função já tem o
 * `id` validado em mão quando vai gravar, que é tudo de que `publicarArte` precisa.
 *
 * ⚠️ A ORDEM DE DENTRO É QUE SEGURA O ÓRFÃO, e é deliberada: id, unicidade e
 * `problemas()` são conferidos ANTES de qualquer byte ir para a loja. Publicar a arte
 * primeiro e descobrir o id repetido depois deixaria dois webp pagos e sem dono na loja a
 * cada erro de digitação — e, pela nota de `excluirEvento`, ninguém volta para limpar isso.
 *
 * A arte continua OPCIONAL: criar só com texto e mandar a foto depois segue valendo, e a
 * lista do admin marca «sem arte completa» para o evento não ficar esquecido assim.
 */
export async function criarEvento(
  _anterior: EstadoSalvamento,
  formulario: FormData,
): Promise<EstadoSalvamento> {
  const barrado = await impedimento();
  if (barrado) return { estado: 'erro', erros: [barrado] };

  const id = texto(formulario, 'id').trim().toLowerCase();
  const erros: string[] = [];
  if (!id) erros.push('O identificador não pode ficar vazio.');
  else if (!/^[a-z0-9][a-z0-9-]*$/.test(id)) {
    erros.push(
      'O identificador aceita só letras minúsculas sem acento, números e hífen, e precisa ' +
        `começar por letra ou número. Recebido: "${id}".`,
    );
  }

  const catalogo = await lerCatalogoPublicado();
  if (id && catalogo.some((e) => e.id === id)) {
    erros.push(`Já existe um evento com o identificador "${id}".`);
  }

  const novo = doFormulario(formulario, {
    id,
    title: '',
    kind: '',
    icon: '',
    description: '',
  });
  erros.push(...problemas(novo));
  if (erros.length > 0) return { estado: 'erro', erros };

  /* ── A arte, se ela veio ──────────────────────────────────────────────────────
     Depois de TODA a validação, pelo motivo de ordem registrado no docblock: a partir
     daqui o id já é válido e único, então os bytes gravados têm dono garantido.

     O que a arte enviada decide vence o que os `<select>` diziam: na criação eles vêm
     vazios, mas se alguém reaproveitar uma arte antiga na lista E escolher um arquivo
     novo, o arquivo novo é o gesto mais recente e mais explícito dos dois. */
  const recebida = await arteDoFormulario(formulario);
  if (recebida.tipo === 'erro') return { estado: 'erro', erros: [recebida.mensagem] };
  if (recebida.tipo === 'ok') {
    const arteGravada = await publicarArte(id, recebida.arte, recebida.miniatura);
    if (!arteGravada.ok) return { estado: 'erro', erros: [recadoDeArte(arteGravada.detalhe)] };
    novo.image = arteGravada.image;
    novo.thumb = arteGravada.thumb;
  }

  const gravacao = await publicarCatalogo([...catalogo, novo]);
  if (!gravacao.ok) return { estado: 'erro', erros: [recadoDeFalha(gravacao.detalhe)] };

  revalidarTudo(id);
  return { estado: 'ok', id };
}

export type EstadoLista =
  | { estado: 'inicial' }
  | { estado: 'ok' }
  | { estado: 'erro'; mensagem: string };

/**
 * EXCLUIR EVENTO.
 *
 * ⚠️ A CONFIRMAÇÃO NÃO ESTÁ AQUI, está no botão (`AcoesDoEvento`), e é assim de
 * propósito: esta função é alcançável por POST direto, então uma confirmação checada no
 * servidor seria teatro — quem monta o POST não passa pelo diálogo. O que o servidor pode
 * exigir de verdade é o passe, e exige.
 *
 * ⚠️ A ARTE DO EVENTO EXCLUÍDO FICA NA LOJA. Mesma razão registrada em `publicarArte`:
 * apagar exigiria provar que nenhum outro evento aponta para o mesmo arquivo, e errar
 * isso deixa OUTRO evento sem imagem em produção. Lixo em loja de 15 eventos é mais
 * barato que isso.
 */
export async function excluirEvento(id: string): Promise<EstadoLista> {
  const barrado = await impedimento();
  if (barrado) return { estado: 'erro', mensagem: barrado };

  const catalogo = await lerCatalogoPublicado();
  const restante = catalogo.filter((e) => e.id !== id);
  if (restante.length === catalogo.length) {
    return { estado: 'erro', mensagem: `Evento não encontrado: "${id}".` };
  }

  const gravacao = await publicarCatalogo(restante);
  if (!gravacao.ok) return { estado: 'erro', mensagem: recadoDeFalha(gravacao.detalhe) };

  revalidarTudo();
  return { estado: 'ok' };
}

/**
 * REORDENAR — move um evento uma casa para cima ou para baixo.
 *
 * ⚠️ UMA CASA POR VEZ, e não arrastar-e-soltar. A ordem do catálogo é a ordem da cena em
 * `EventsSpotlight`, que são 15 cartões: trocar vizinhos resolve o caso real («este
 * evento devia vir antes daquele») com um clique, funciona por teclado sem nenhum
 * trabalho extra de acessibilidade, e não exige mandar a lista inteira do cliente para o
 * servidor — o que abriria a porta para um POST reescrever a ordem com uma lista
 * inventada.
 *
 * `direcao` é fechada em dois valores. Receber um deslocamento numérico livre deixaria o
 * índice sair do array por POST direto.
 */
export async function moverEvento(id: string, direcao: 'cima' | 'baixo'): Promise<EstadoLista> {
  const barrado = await impedimento();
  if (barrado) return { estado: 'erro', mensagem: barrado };

  const catalogo = await lerCatalogoPublicado();
  const de = catalogo.findIndex((e) => e.id === id);
  if (de < 0) return { estado: 'erro', mensagem: `Evento não encontrado: "${id}".` };

  const para = direcao === 'cima' ? de - 1 : de + 1;
  /* Nas pontas não é erro, é nada a fazer: o botão já aparece desabilitado, e um POST
     direto com o índice fora do array sairia daqui sem tocar no catálogo. */
  if (para < 0 || para >= catalogo.length) return { estado: 'ok' };

  [catalogo[de], catalogo[para]] = [catalogo[para], catalogo[de]];
  const gravacao = await publicarCatalogo(catalogo);
  if (!gravacao.ok) return { estado: 'erro', mensagem: recadoDeFalha(gravacao.detalhe) };

  revalidarTudo();
  return { estado: 'ok' };
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
 * coisa. Como estes bytes passam a ser servidos de volta por uma URL pública, aceitar
 * conteúdo arbitrário seria transformar o admin em hospedagem aberta — e com a loja no
 * Blob a URL fica num domínio da Vercel, o que torna o abuso mais atraente, não menos.
 */
function ehWebp(bytes: Uint8Array): boolean {
  const cabecalho = Buffer.from(bytes.subarray(0, 12)).toString('latin1');
  return cabecalho.startsWith('RIFF') && cabecalho.slice(8, 12) === 'WEBP';
}

/**
 * Os dois webp que vieram do formulário, conferidos — ou a notícia de que não vieram.
 *
 * ⚠️ EXISTE PORQUE SÃO DOIS CHAMADORES AGORA (`enviarArte` e `criarEvento`), e a
 * conferência de tamanho e de assinatura é justamente a que não pode divergir entre eles:
 * o lado que ficar para trás é o que vira hospedagem aberta, pelo motivo escrito em
 * `ehWebp`. Não é extração por gosto de extrair.
 *
 * `nenhuma` é resposta legítima, e não erro: criar evento só com texto é caminho previsto.
 * Quem exige a imagem é `enviarArte`, onde ela é o objeto da submissão.
 */
type ArteRecebida =
  | { tipo: 'nenhuma' }
  | { tipo: 'erro'; mensagem: string }
  | { tipo: 'ok'; arte: Uint8Array; miniatura: Uint8Array };

async function arteDoFormulario(formulario: FormData): Promise<ArteRecebida> {
  const campos = ['arte', 'miniatura'].map((campo) => formulario.get(campo));
  const chegaram = campos.filter((a): a is File => a instanceof File && a.size > 0);
  if (chegaram.length === 0) return { tipo: 'nenhuma' };
  /* Um só dos dois é estado impossível pela interface — `aoEscolher` anexa sempre os dois
     a partir do mesmo bitmap — e por isso mesmo é recusado em voz alta em vez de
     adivinhado: deixar passar gravaria um evento com arte grande e sem miniatura, e a
     miniatura é o que a cena do site usa na faixa de baixo. */
  if (chegaram.length === 1) {
    return {
      tipo: 'erro',
      mensagem:
        'Só um dos dois arquivos de imagem chegou ao servidor. Escolha a imagem de novo — ' +
        'a arte e a miniatura têm de subir juntas.',
    };
  }

  const [arte, miniatura] = await Promise.all(
    chegaram.map(async (a) => new Uint8Array(await a.arrayBuffer())),
  );
  for (const bytes of [arte, miniatura]) {
    if (bytes.byteLength > LIMITE_BYTES) {
      return { tipo: 'erro', mensagem: 'Imagem acima de 2 MB depois da conversão.' };
    }
    if (!ehWebp(bytes)) {
      return { tipo: 'erro', mensagem: 'O arquivo enviado não é um webp válido.' };
    }
  }
  return { tipo: 'ok', arte, miniatura };
}

/** O mesmo recado de `recadoDeFalha`, para quando o que falhou foram os binários. */
function recadoDeArte(detalhe: string): string {
  return naNuvem()
    ? 'As imagens não foram publicadas na loja de eventos (Vercel Blob). Detalhe do ' +
        `sistema: ${detalhe}`
    : 'Não foi possível gravar em public/images/EVENTOS. Sem BLOB_READ_WRITE_TOKEN o admin ' +
        'escreve no próprio repositório, o que só funciona onde o checkout está em disco e é ' +
        `gravável. Detalhe do sistema: ${detalhe}`;
}

/**
 * Publica a arte de um evento: grava os dois arquivos e já aponta o catálogo
 * para eles.
 *
 * O upload conclui SOZINHO, sem depender de a pessoa clicar em "Salvar" depois.
 * A alternativa — gravar os arquivos e deixar o JSON para o botão — deixaria
 * binário órfão cada vez que alguém trocasse a foto e fechasse a aba, e ninguém
 * volta para limpar isso.
 *
 * Quem redimensiona é o navegador (ver `publicarArte`): o que chega aqui já é webp
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
  const catalogo = await lerCatalogoPublicado();
  const indice = catalogo.findIndex((e) => e.id === id);
  if (indice < 0) return { estado: 'erro', mensagem: `Evento não encontrado: "${id}".` };

  const recebida = await arteDoFormulario(formulario);
  /* Aqui a ausência É erro: esta submissão não tem outro assunto além da imagem. Em
     `criarEvento` a mesma resposta é caminho normal. */
  if (recebida.tipo === 'nenhuma') {
    return { estado: 'erro', mensagem: 'Escolha uma imagem antes de enviar.' };
  }
  if (recebida.tipo === 'erro') return { estado: 'erro', mensagem: recebida.mensagem };

  const gravacao = await publicarArte(id, recebida.arte, recebida.miniatura);
  if (!gravacao.ok) return { estado: 'erro', mensagem: recadoDeArte(gravacao.detalhe) };

  catalogo[indice] = { ...catalogo[indice], image: gravacao.image, thumb: gravacao.thumb };
  const catalogoGravado = await publicarCatalogo(catalogo);
  if (!catalogoGravado.ok) {
    return {
      estado: 'erro',
      mensagem:
        'As imagens foram publicadas, mas o catálogo não pôde ser atualizado — escolha ' +
        `os arquivos novos nas listas e salve. Detalhe do sistema: ${catalogoGravado.detalhe}`,
    };
  }

  revalidarTudo(id);
  return { estado: 'ok', image: gravacao.image, thumb: gravacao.thumb };
}
