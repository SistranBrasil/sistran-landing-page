import type { Metadata } from 'next';
import Link from 'next/link';
import { GeradorCarimbo } from './GeradorCarimbo';
import { LugaresDoSite } from './LugaresDoSite';
import { LUGARES_CARIMBO } from '@/data/carimboLugares';
import { lerCatalogoFresco, naNuvem } from '@/lib/carimbosLoja';

/**
 * CONTROLE DE CARIMBOS — duas abas.
 *
 * Era só o gerador de PNG: desenhava, baixava o arquivo, e alguém copiava à mão
 * para `public/` e trocava um literal no JSX. O pedido pede o que faltava — «um
 * controle de todos os lugares que possuem carimbos do site» e «essa aba de criar
 * carimbo que seja atrelada a esses lugares».
 *
 * ⚠️ AS ABAS SÃO URL (`?aba=`), e não estado de componente. Três razões: a página
 * é Server Component e precisa LER o catálogo (a aba «Lugares» mostra o que está
 * aplicado agora); a aba fica compartilhável e sobrevive ao recarregamento depois
 * de salvar; e o admin já é `force-dynamic`, então ler `searchParams` não custa
 * nada aqui — numa rota pública isso sozinho tiraria o pré-render.
 *
 * O gerador continua intacto na aba «Criar carimbo»: ele ganhou o botão de
 * salvar, mas o motor de desenho (`desenhar.ts`) não foi tocado.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
  title: 'Admin · carimbos',
};

export const dynamic = 'force-dynamic';

type Busca = { aba?: string; editar?: string };

export default async function AdminCarimboPage({
  searchParams,
}: {
  searchParams: Promise<Busca>;
}) {
  const { aba, editar } = await searchParams;
  /* Qualquer valor que não seja `criar` cai em «lugares»: é a aba de leitura, e é
     a que responde à primeira metade do pedido. URL adulterada não deve levar a
     uma tela de formulário. */
  const criando = aba === 'criar';

  const catalogo = await lerCatalogoFresco();

  const estilo = (ativa: boolean) =>
    `rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] no-underline transition-colors ${
      ativa
        ? 'bg-[#0f172a] text-white'
        : 'border border-black/10 bg-white text-[#475467] hover:border-[#0079cb]/50'
    }`;

  return (
    <>
      <h1 className="text-3xl font-medium tracking-tight text-[#0f172a]">Carimbos</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#667085]">
        {criando
          ? 'Escreva o texto, escolha cor e formato, e salve. O carimbo salvo fica disponível para aplicar em qualquer lugar do site e dentro de um evento.'
          : `Os ${LUGARES_CARIMBO.length} pontos do site que mostram carimbo. Troque o de cada um pelo carimbo que você criou, ou volte à arte original.`}
      </p>

      <nav aria-label="Abas de carimbo" className="mt-6 flex flex-wrap gap-2">
        <Link href="/admin/carimbo" className={estilo(!criando)}>
          Lugares do site
        </Link>
        <Link href="/admin/carimbo?aba=criar" className={estilo(criando)}>
          Criar carimbo
        </Link>
      </nav>

      {/* O MESMO AVISO DE DESTINO que a lista de eventos mostra, e pela mesma
          razão: sem o token o admin grava no repositório, e quem não souber disso
          acha que salvou «no site» quando salvou no próprio checkout. */}
      {!naNuvem() && (
        <p className="mt-5 max-w-2xl rounded-xl border border-amber-300/70 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-800">
          Sem <code className="font-mono">BLOB_READ_WRITE_TOKEN</code>: o que você salvar aqui vai
          para <code className="font-mono">src/data/carimbos.json</code> e{' '}
          <code className="font-mono">public/carimbo/gerados/</code> deste checkout — não para o
          site publicado. Nesse modo, <strong>reinicie o servidor</strong> depois de criar um
          carimbo: o Next monta o mapa de <code className="font-mono">public/</code> quando sobe, e
          até reiniciar a arte nova responde 404 (em produção, com o token, ela aparece na hora).
        </p>
      )}

      {criando ? (
        /* `editar` pode apontar para carimbo que não existe (URL velha, carimbo
           excluído em outra aba). Nesse caso o `find` devolve `undefined` e a tela
           abre em modo CRIAR, com os padrões — e não numa edição fantasma que
           salvaria um registro novo acreditando estar corrigindo o antigo. */
        <GeradorCarimbo emEdicao={catalogo.carimbos.find((c) => c.id === editar)} />
      ) : (
        <LugaresDoSite
          lugares={[...LUGARES_CARIMBO]}
          carimbos={catalogo.carimbos}
          aplicacoes={catalogo.aplicacoes}
        />
      )}
    </>
  );
}
