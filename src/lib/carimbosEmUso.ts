import { LUGARES_CARIMBO } from '@/data/carimboLugares';
import { lerCatalogoDoSite } from '@/lib/carimbosLoja';
import { SEM_CARIMBOS, type ArteCarimbo, type CarimbosEmUso } from '@/lib/carimbosTipos';

/**
 * RESOLVE O CATÁLOGO NO QUE O SITE PRECISA PINTAR. Roda no servidor, uma vez por
 * renderização do layout raiz, e o resultado desce para o cliente pelo provedor.
 *
 * ⚠️ SÓ AS EXCEÇÕES DESCEM. O mapa não tem uma entrada por lugar: tem uma entrada
 * por lugar ATRIBUÍDO. Duas razões, e as duas importam:
 *
 *   · o payload que viaja em cada página fica proporcional ao que foi trocado, e
 *     não ao tamanho do inventário. Com zero atribuições — o estado de hoje — é
 *     um objeto vazio, ou seja: ligar esta máquina não acrescenta um byte ao HTML
 *     de nenhuma rota;
 *   · a arte original continua escrita no JSX de cada seção, como está hoje, e é
 *     o componente que cai nela quando não há exceção. Isso mantém o código
 *     legível sozinho (quem lê `About.tsx` vê qual carimbo está ali) e torna o
 *     site imune a catálogo ilegível: falha de rede na loja não apaga carimbo da
 *     página, só deixa de aplicar a troca.
 *
 * `alt` NÃO entra na resolução de propósito — ver `CarimboDoLugar`.
 */
export async function carimbosEmUso(): Promise<CarimbosEmUso> {
  const catalogo = await lerCatalogoDoSite();
  if (catalogo.carimbos.length === 0) return SEM_CARIMBOS;

  const porId: Record<string, ArteCarimbo> = {};
  for (const c of catalogo.carimbos) {
    porId[c.id] = { src: c.arquivo, largura: c.largura, altura: c.altura };
  }

  const porLugar: Record<string, ArteCarimbo> = {};
  for (const lugar of LUGARES_CARIMBO) {
    const escolhido = catalogo.aplicacoes[lugar.id];
    /* Atribuição apontando para carimbo que não existe mais (excluído sem limpar,
       ou catálogo editado à mão) é ignorada em silêncio: o lugar cai na arte
       padrão. O alternativo seria renderizar um `src` quebrado, que é pior — a
       página mostra um ícone de imagem partida no lugar da marca. */
    if (escolhido && porId[escolhido]) porLugar[lugar.id] = porId[escolhido];
  }

  /* Mesma tolerância das aplicações: categoria apontando para carimbo que não
     existe mais é ignorada, e o evento cai na arte do kind. */
  const porKind: Record<string, ArteCarimbo> = {};
  for (const [kind, carimbo] of Object.entries(catalogo.kinds)) {
    if (porId[carimbo]) porKind[kind] = porId[carimbo];
  }

  return { porLugar, porId, porKind };
}
