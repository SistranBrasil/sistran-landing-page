import Image from 'next/image';
import FormularioEntrar from './FormularioEntrar';

/**
 * SIS-216 — a única página do `/admin` que abre sem passe.
 *
 * `force-dynamic` porque ela é a porta: prerenderizada, viraria HTML servido de
 * cache, e o `no-store` que o proxy põe na resposta perderia sentido.
 */
export const dynamic = 'force-dynamic';

export default function EntrarPage() {
  return (
    /* Cartão estreito e centrado: a tela tem um campo só, e um formulário sozinho
       na largura toda do conteúdo faz o olho procurar o que mais teria para ler.

       ⚠️ `overflow-hidden` entrou junto com a faixa azul: sem ele o retângulo azul vaza
       por cima do `rounded-2xl` e os dois cantos de cima saem quadrados. */
    <div className="mx-auto mt-10 max-w-sm overflow-hidden rounded-2xl border border-black/[0.07] bg-white shadow-[0_8px_32px_rgba(16,24,40,0.06)]">
      {/**
       * A FAIXA AZUL DA LOGO — 01/10, a pedido, e aqui ela é generosa de propósito.
       *
       * O mesmo motivo do header (a logo é branca com alfa, ver a nota de `layout.tsx`),
       * mas sem a ressalva que limita o azul lá: esta tela não mostra foto nenhuma, então
       * não há arte cuja cor um fundo saturado possa falsear. É a única página do admin em
       * que o azul pode ocupar área de verdade, e é onde ele vale mais — é a primeira tela
       * que alguém do time vê.
       *
       * Em 56 px a derivada de 320 px ainda é uma redução de ~5,7×, de sobra para DPR 3.
       */}
      <div className="flex items-center justify-center bg-[#0b3a5c] px-7 py-8">
        {/* Só o símbolo, SEM repetir «Sistran · admin»: o header desta mesma tela já
            escreve isso dois dedos acima, e a barra do login não tem nav nem Sair para
            afastar as duas marcas. Marca duas vezes na mesma dobra lê como erro de
            montagem, não como reforço. */}
        <Image
          src="/images/loading/logo-sistran-portao.webp"
          alt=""
          aria-hidden
          width={320}
          height={320}
          priority
          className="h-14 w-14"
        />
      </div>

      <div className="p-7">
        <h1 className="text-2xl font-medium tracking-tight text-[#0f172a]">Entrar</h1>
        <p className="mt-3 text-sm leading-relaxed text-[#667085]">
          Acesso restrito à atualização dos eventos. A senha é a mesma para todo o time.
        </p>
        <FormularioEntrar />
      </div>
    </div>
  );
}
