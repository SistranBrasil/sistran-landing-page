import type { Metadata } from 'next';
import { GeradorCarimbo } from './GeradorCarimbo';

/**
 * Gerador do carimbo "Realizado pela Sistran" em PNG sem fundo.
 *
 * Mora em `/admin` porque é ferramenta interna e porque o `matcher` do
 * `src/proxy.ts` já cobre `/admin/:path*` — a senha vale para esta rota sem uma
 * linha nova de configuração. Não grava nada no disco: o arquivo é montado no
 * navegador de quem clica, então não há Server Action aqui e nada a autorizar do
 * lado do servidor.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
  title: 'Admin · carimbo',
};

export default function AdminCarimboPage() {
  return (
    <>
      <h1 className="text-3xl font-medium tracking-tight text-[#0f172a]">Carimbo</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#667085]">
        Escreva o texto, escolha cor e formato e baixe o PNG com fundo
        transparente. O desenho é vetorial até a hora de exportar: subir a
        densidade não perde nitidez.
      </p>

      <p className="mt-6 max-w-2xl rounded-xl border border-black/[0.07] bg-white px-4 py-3 text-sm leading-relaxed text-[#475467]">
        Para aplicar o carimbo <em>dentro</em> de uma página, prefira o componente
        CSS em{' '}
        <code className="font-mono text-[#0f172a]">componente-carimbo-sistran/</code> — lá o
        texto continua selecionável e há o acabamento <strong>glass</strong>, que
        depende de ter fundo atrás para desfocar e por isso não existe aqui.
      </p>

      <GeradorCarimbo />
    </>
  );
}
