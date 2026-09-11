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
       na largura toda do conteúdo faz o olho procurar o que mais teria para ler. */
    <div className="mx-auto mt-10 max-w-sm rounded-2xl border border-black/[0.07] bg-white p-7 shadow-[0_8px_32px_rgba(16,24,40,0.06)]">
      <h1 className="text-2xl font-medium tracking-tight text-[#0f172a]">Entrar</h1>
      <p className="mt-3 text-sm leading-relaxed text-[#667085]">
        Acesso restrito à atualização dos eventos. A senha é a mesma para todo o time.
      </p>
      <FormularioEntrar />
    </div>
  );
}
