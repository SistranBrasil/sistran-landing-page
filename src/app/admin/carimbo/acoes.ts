'use server';

import { cookies } from 'next/headers';
import { revalidatePath, updateTag } from 'next/cache';
import { COOKIE_SESSAO, tokenConfere } from '@/lib/adminSessao';
import { VARIAVEL_SENHA } from '@/lib/adminGate';
import { lugarPorId, rotasDoLugar } from '@/data/carimboLugares';
import {
  ETIQUETA_CARIMBOS,
  lerCatalogoFresco,
  naNuvem,
  publicarArteCarimbo,
  publicarCatalogo,
} from '@/lib/carimbosLoja';
import {
  FORMATO_ID,
  idDoNome,
  type CarimboBruto,
  type CatalogoCarimbos,
  type ReceitaCarimbo,
} from '@/lib/carimbosTipos';
import { ACABAMENTOS_VALIDOS, FORMATOS_VALIDOS } from '@/app/admin/carimbo/vocabulario';

/**
 * AS ESCRITAS DO CATÁLOGO DE CARIMBOS.
 *
 * Mesma arquitetura de `src/app/admin/eventos/acoes.ts`, e pelas mesmas razões
 * registradas lá: `impedimento()` no começo de CADA ação (server action é
 * alcançável por POST direto, fora da UI), estado em união discriminada por
 * `estado`, e `revalidatePath` no fim.
 *
 * ⚠️ O QUE É DIFERENTE AQUI: a revalidação não é de uma rota fixa. Trocar o
 * carimbo de um lugar afeta exatamente as rotas daquele lugar — e há lugar que
 * aparece em mais de uma. Quem sabe quais são é o inventário (`rotasDoLugar`), e
 * é por isso que ele guarda `rotas`. Esquecer uma rota aqui é o defeito mais
 * provável desta tela: o operador salva, a tela confirma, e a página continua
 * servindo o pré-render com o carimbo anterior.
 */

export type EstadoCarimbo =
  | { estado: 'inicial' }
  | { estado: 'ok'; recado: string; id?: string }
  | { estado: 'erro'; problemas: string[] };

async function impedimento(): Promise<string | null> {
  const esperada = process.env[VARIAVEL_SENHA];
  if (!esperada) return `${VARIAVEL_SENHA} não está definida no host.`;
  if (!tokenConfere((await cookies()).get(COOKIE_SESSAO)?.value, esperada)) {
    return 'Sessão expirada. Entre novamente para salvar.';
  }
  return null;
}

function recadoDeFalha(detalhe: string): string {
  return naNuvem()
    ? 'Não foi possível publicar o catálogo de carimbos na loja (Vercel Blob). Nada foi ' +
        `salvo — tente de novo. Detalhe do sistema: ${detalhe}`
    : 'Não foi possível gravar src/data/carimbos.json. Sem BLOB_READ_WRITE_TOKEN o admin ' +
        'grava no próprio repositório, o que só funciona onde o checkout está em disco e é ' +
        `gravável. Detalhe do sistema: ${detalhe}`;
}

/**
 * Revalida o admin e as rotas públicas afetadas.
 *
 * `revalidateTag` ao lado do `revalidatePath` não é redundância: o `path` derruba
 * o HTML pré-renderizado daquelas rotas, e a `tag` derruba a RESPOSTA CACHEADA da
 * busca do catálogo (ver `lerCatalogoDoSite`). Sem a etiqueta, a rota seria
 * reconstruída lendo de novo a mesma cópia guardada e nada mudaria.
 */
function revalidar(rotas: string[]): void {
  /**
   * ⚠️ `updateTag` E NÃO `revalidateTag`, e a escolha é do Next 16.
   * `node_modules/next/dist/docs/.../revalidateTag.md` marca a forma de um
   * argumento como DEPRECIADA, e a de dois (`profile: 'max'`) tem semântica
   * *stale-while-revalidate*: o visitante seguinte receberia o carimbo ANTIGO
   * enquanto o novo é buscado atrás. `updateTag` é o caminho de
   * «read-your-own-writes» que a própria doc indica para Server Action — expira
   * na hora e a próxima requisição espera o dado fresco. Para quem acabou de
   * trocar um carimbo e vai conferir na aba ao lado, é a diferença entre «mudou»
   * e «não mudou».
   */
  updateTag(ETIQUETA_CARIMBOS);
  revalidatePath('/admin/carimbo');
  for (const rota of new Set(rotas)) revalidatePath(rota);
}

/* ARQUIVADO: `todasAsRotasComCarimbo()`, que devolvia
     [...new Set(LUGARES_CARIMBO.flatMap((l) => l.rotas)), '/eventos-inovacao']
   Era o alvo da revalidação da edição e saiu de cena por custo (ver a nota em
   `salvarCarimbo`). Fica registrado porque é a função que volta no dia em que
   existir uma operação de fato global — trocar a tinta de todos os carimbos de
   uma vez, por exemplo. */

/**
 * PUBLICA SOBRE UMA BASE LIDA NA HORA — a guarda contra perda silenciosa.
 *
 * ⚠️ O DEFEITO QUE ISTO CORRIGE, medido em 13/10 na loja real: 36 operações
 * seguidas reportaram sucesso e o catálogo terminou com 8 das 18 aplicações e 7
 * das 18 artes. Toda escrita aqui é LER-MODIFICAR-GRAVAR o documento inteiro; com
 * uma leitura levemente atrasada como base, a gravação apaga a alteração
 * anterior. Quem segura isso é a memória de última publicação em
 * `carimbosLoja.ts`, e o `montar` abaixo existe para que a base seja SEMPRE a
 * leitura mais recente possível — nunca um objeto capturado antes das validações.
 *
 * ⚠️ POR QUE NÃO HÁ CONFERÊNCIA LENDO DE VOLTA, que foi a primeira versão desta
 * função: porque a leitura seguinte NÃO PROVA NADA dentro da requisição. Medido:
 * depois de gravar, a loja serviu o corpo anterior por ~90 s, com URL nova e
 * `no-store`. Uma conferência assim reprovaria gravações que deram certo — e,
 * pior, a repetição partiria de uma base velha e desfaria o que acabou de ser
 * escrito. Um mecanismo de segurança que produz o próprio defeito que deveria
 * impedir é pior que não ter mecanismo.
 *
 * O preço, que a tela diz ao operador: a troca pode levar até cerca de um minuto
 * para aparecer no site.
 */
async function publicarSobreBaseFresca(
  montar: (base: CatalogoCarimbos) => CatalogoCarimbos,
): Promise<{ ok: true } | { ok: false; detalhe: string }> {
  const base = await lerCatalogoFresco();
  return publicarCatalogo(montar(base));
}

function texto(formulario: FormData, campo: string): string {
  const bruto = formulario.get(campo);
  return typeof bruto === 'string' ? bruto.trim() : '';
}

function numero(formulario: FormData, campo: string): number {
  const n = Number(texto(formulario, campo));
  return Number.isFinite(n) ? n : 0;
}

/**
 * Valida a receita contra o vocabulário do motor de desenho.
 *
 * ⚠️ POR QUE VALIDAR O QUE A PRÓPRIA TELA ESCREVEU: porque a action aceita POST
 * de qualquer origem autenticada, e `formato` entra no catálogo que o site lê. Um
 * formato desconhecido não quebra o site (o PNG já está pronto), mas quebra a
 * REEDIÇÃO — a tela de edição receberia um valor que nenhum botão representa e
 * cairia num estado sem saída.
 */
function conferirReceita(r: ReceitaCarimbo): string[] {
  const problemas: string[] = [];
  if (!r.marca) problemas.push('A marca do carimbo não pode ficar vazia.');
  if (!/^#[0-9a-fA-F]{6}$/.test(r.cor)) problemas.push(`Cor fora do formato #RRGGBB: "${r.cor}".`);
  if (!FORMATOS_VALIDOS.includes(r.formato)) problemas.push(`Formato desconhecido: "${r.formato}".`);
  if (!ACABAMENTOS_VALIDOS.includes(r.acabamento)) {
    problemas.push(`Acabamento desconhecido: "${r.acabamento}".`);
  }
  if (r.base < 8 || r.base > 96) problemas.push('O corpo da fonte precisa estar entre 8 e 96.');
  if (r.rotacao < -45 || r.rotacao > 45) problemas.push('A inclinação precisa estar entre -45 e 45.');
  return problemas;
}

/**
 * SALVA UM CARIMBO — a aba «criar carimbo» do pedido.
 *
 * Recebe o PNG já desenhado pelo navegador (campo `png`) e as medidas do bitmap.
 *
 * ⚠️ O DESENHO ACONTECE NO CLIENTE, e não aqui, por três razões que juntas
 * fecham a questão: o motor (`desenhar.ts`) depende de `CanvasRenderingContext2D`,
 * que não existe no servidor; ele mede o texto com a FONTE DO SITE, que o
 * servidor não tem carregada (e medir com a fonte de fallback dimensiona a arte
 * errado — é o que o próprio gerador documenta); e o formato «site» recolore um
 * PNG de referência, que já está decodificado no navegador. É a mesma divisão de
 * trabalho que `CampoArte` usa para a arte de evento, pela razão registrada lá:
 * `sharp` não é dependência declarada deste projeto.
 *
 * O servidor continua sendo quem valida e quem nomeia o arquivo.
 */
export async function salvarCarimbo(
  _anterior: EstadoCarimbo,
  formulario: FormData,
): Promise<EstadoCarimbo> {
  const barrado = await impedimento();
  if (barrado) return { estado: 'erro', problemas: [barrado] };

  const nome = texto(formulario, 'nome');
  /* `idOriginal` só vem preenchido na EDIÇÃO: ele é a chave que já está nas
     atribuições e nos eventos. Renomear um carimbo não pode mudar o id, senão
     toda referência a ele aponta para o vazio e o site cai na arte padrão sem
     ninguém ter pedido. */
  const idOriginal = texto(formulario, 'idOriginal');
  const id = idOriginal || idDoNome(nome);

  const receita: ReceitaCarimbo = {
    prefixo: texto(formulario, 'prefixo'),
    marca: texto(formulario, 'marca'),
    serial: texto(formulario, 'serial'),
    cor: texto(formulario, 'cor'),
    formato: texto(formulario, 'formato'),
    acabamento: texto(formulario, 'acabamento'),
    rotacao: numero(formulario, 'rotacao'),
    textura: texto(formulario, 'textura') === 'on',
    base: numero(formulario, 'base'),
  };

  const largura = numero(formulario, 'largura');
  const altura = numero(formulario, 'altura');
  const png = formulario.get('png');

  const problemas = conferirReceita(receita);
  if (!nome) problemas.push('Dê um nome ao carimbo — é por ele que você vai achá-lo na lista.');
  if (!FORMATO_ID.test(id)) {
    problemas.push('O nome precisa ter ao menos uma letra ou número para virar identificador.');
  }
  if (largura < 1 || altura < 1) {
    problemas.push('As medidas do desenho não chegaram. Recarregue a página e tente de novo.');
  }
  if (!(png instanceof File) || png.size === 0) {
    problemas.push('O desenho do carimbo não chegou. Recarregue a página e tente de novo.');
  }
  if (problemas.length > 0) return { estado: 'erro', problemas };

  const catalogo = await lerCatalogoFresco();
  const indice = catalogo.carimbos.findIndex((c) => c.id === id);
  if (!idOriginal && indice >= 0) {
    return {
      estado: 'erro',
      problemas: [`Já existe um carimbo chamado "${catalogo.carimbos[indice].nome}" com este nome.`],
    };
  }

  const bytes = new Uint8Array(await (png as File).arrayBuffer());
  const arte = await publicarArteCarimbo(id, bytes);
  if (!arte.ok) return { estado: 'erro', problemas: [recadoDeFalha(arte.detalhe)] };

  const registro: CarimboBruto = {
    id,
    nome,
    receita,
    arquivo: arte.arquivo,
    largura,
    altura,
    criadoEm: indice >= 0 ? catalogo.carimbos[indice].criadoEm : new Date().toISOString(),
  };

  /* `montar` roda sobre a base lida DENTRO de `publicarSobreBaseFresca`, e não
     sobre o `catalogo` desta closure: entre a leitura que validou e a gravação há
     o upload da arte (centenas de ms de rede), e é nessa fresta que a base
     envelhece. Usar a leitura mais nova possível é o que evita regravar um
     documento sem a alteração de quem clicou antes. */
  const gravado = await publicarSobreBaseFresca((base) => {
      const carimbos = [...base.carimbos];
      const onde = carimbos.findIndex((c) => c.id === id);
      if (onde >= 0) carimbos[onde] = registro;
      else carimbos.push(registro);
      return { ...base, carimbos };
  });
  if (!gravado.ok) return { estado: 'erro', problemas: [recadoDeFalha(gravado.detalhe)] };

  /**
   * ⚠️ A REVALIDAÇÃO DA EDIÇÃO FICOU ESTREITA — 13/10, por causa de «está
   * demorando para atualizar os carimbos».
   *
   * Era `todasAsRotasComCarimbo()`: oito rotas reconstruídas a cada salvamento,
   * entre elas as mais pesadas do site, mesmo quando o carimbo editado não estava
   * aplicado em lugar nenhum — o caso de quem está acertando o texto e salva três
   * vezes seguidas. Com `head` + corpo custando ~0,5 s por leitura (medido), e
   * cada rota relendo o catálogo ao regenerar, o salvamento pagava a soma disso.
   *
   * Agora reconstrói só o que de fato mostra ESTE carimbo: as rotas dos lugares
   * onde ele está aplicado, mais `/eventos-inovacao` se algum evento o escolheu.
   * Carimbo sem uso nenhum revalida só a tela do admin.
   *
   * O raciocínio anterior continua válido no que importava — reeditar um carimbo
   * aplicado TEM de atualizar todas as telas que o usam, e não só uma. O que
   * mudou é que «todas que o usam» passou a ser calculado em vez de presumido
   * como «todas».
   */
  const rotasDoCarimbo =
    indice >= 0
      ? Object.entries(catalogo.aplicacoes)
          .filter(([, usado]) => usado === id)
          .flatMap(([lugar]) => rotasDoLugar(lugar))
      : [];
  /* O catálogo de carimbos não sabe quais eventos apontam para ele (o campo vive
     no registro do evento, no outro catálogo). Ler o de eventos aqui custaria
     mais meio segundo de rede em TODO salvamento para acertar um caso incomum;
     revalidar a rota de eventos junto é mais barato e não deixa a tela velha. */
  revalidar(
    indice >= 0 ? [...rotasDoCarimbo, '/eventos-inovacao'] : ['/admin/carimbo'],
  );

  return {
    estado: 'ok',
    id,
    recado:
      indice >= 0
        ? `Carimbo "${nome}" atualizado. Onde ele já está aplicado, a troca já valeu.`
        : `Carimbo "${nome}" criado. Aplique-o em um lugar na aba «Lugares do site».`,
  };
}

/**
 * APLICA (ou desaplica) um carimbo num lugar do site.
 *
 * `carimboId` vazio significa «voltar à arte original» — e o que acontece é a
 * REMOÇÃO da chave, não a gravação de um valor vazio. Ver `aplicacoes` em
 * `CatalogoCarimbos`: o catálogo guarda só as exceções.
 */
export async function aplicarCarimbo(lugarId: string, carimboId: string): Promise<EstadoCarimbo> {
  const barrado = await impedimento();
  if (barrado) return { estado: 'erro', problemas: [barrado] };

  const lugar = lugarPorId(lugarId);
  if (!lugar) return { estado: 'erro', problemas: [`Lugar desconhecido: "${lugarId}".`] };

  const catalogo = await lerCatalogoFresco();
  if (carimboId && !catalogo.carimbos.some((c) => c.id === carimboId)) {
    return { estado: 'erro', problemas: [`Carimbo desconhecido: "${carimboId}".`] };
  }

  const gravado = await publicarSobreBaseFresca((base) => {
      const aplicacoes: CatalogoCarimbos['aplicacoes'] = { ...base.aplicacoes };
      if (carimboId) aplicacoes[lugarId] = carimboId;
      else delete aplicacoes[lugarId];
      return { ...base, aplicacoes };
  });
  if (!gravado.ok) return { estado: 'erro', problemas: [recadoDeFalha(gravado.detalhe)] };

  revalidar(rotasDoLugar(lugarId));

  const nome = catalogo.carimbos.find((c) => c.id === carimboId)?.nome;
  return {
    estado: 'ok',
    recado: carimboId
      ? `«${lugar.rotulo}» agora usa o carimbo "${nome}".`
      : `«${lugar.rotulo}» voltou à arte original.`,
  };
}

/**
 * EXCLUI um carimbo do catálogo.
 *
 * ⚠️ RECUSA ENQUANTO ESTIVER EM USO, em vez de excluir e deixar o lugar cair na
 * arte padrão em silêncio. O resolvedor TOLERA atribuição órfã de propósito (é
 * defesa contra catálogo editado à mão), mas tolerar não é motivo para produzir:
 * um carimbo aplicado em três páginas que desaparece sem aviso é uma mudança de
 * três telas disparada por um clique que dizia «excluir carimbo».
 *
 * O arquivo PNG NÃO é apagado — ver a nota em `publicarArteCarimbo`.
 */
export async function excluirCarimbo(id: string): Promise<EstadoCarimbo> {
  const barrado = await impedimento();
  if (barrado) return { estado: 'erro', problemas: [barrado] };

  const catalogo = await lerCatalogoFresco();
  const usos = Object.entries(catalogo.aplicacoes)
    .filter(([, carimbo]) => carimbo === id)
    .map(([lugar]) => lugarPorId(lugar)?.rotulo ?? lugar);

  if (usos.length > 0) {
    return {
      estado: 'erro',
      problemas: [
        `Este carimbo está aplicado em ${usos.length === 1 ? '1 lugar' : `${usos.length} lugares`}: ` +
          `${usos.join(', ')}. Troque esses lugares antes de excluir.`,
      ],
    };
  }

  if (!catalogo.carimbos.some((c) => c.id === id)) {
    return { estado: 'erro', problemas: [`Carimbo desconhecido: "${id}".`] };
  }

  const gravado = await publicarSobreBaseFresca((base) => ({
    ...base,
    carimbos: base.carimbos.filter((c) => c.id !== id),
  }));
  if (!gravado.ok) return { estado: 'erro', problemas: [recadoDeFalha(gravado.detalhe)] };

  revalidar(['/admin/carimbo']);
  return { estado: 'ok', recado: 'Carimbo excluído.' };
}
