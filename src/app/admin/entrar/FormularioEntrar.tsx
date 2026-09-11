'use client';

import { useActionState } from 'react';
import { entrar, type EstadoEntrada } from './acoes';

/**
 * SIS-216 — a tela de login (opção **B**).
 *
 * Componente de cliente por um motivo só: mostrar "Senha incorreta." sem recarregar
 * a página e sem passar o erro pela URL. Um `?erro=1` funcionaria, mas ficaria no
 * histórico e no compartilhamento de link.
 *
 * O campo de senha NÃO é controlado, ao contrário do formulário de evento: aqui o
 * reset que o React 19 faz ao fim da action é desejado — senha recusada deve sair
 * da tela, não continuar escrita nela.
 */
export default function FormularioEntrar() {
  const [estado, acao, pendente] = useActionState<EstadoEntrada, FormData>(entrar, {
    estado: 'inicial',
  });

  return (
    <form action={acao} className="mt-7 space-y-5">
      <div>
        <label
          className="block font-mono text-[11px] uppercase tracking-[0.16em] text-[#667085]"
          htmlFor="senha"
        >
          Senha
        </label>
        <input
          id="senha"
          name="senha"
          type="password"
          /* `autoFocus` porque esta página tem um campo só e nada mais a ler; e
             `current-password` para o gerenciador de senhas do navegador oferecer
             a senha salva em vez de tratar isto como cadastro. */
          autoFocus
          autoComplete="current-password"
          required
          className="mt-2 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-[#0f172a] outline-none transition-colors focus:border-[#0079cb] focus:ring-4 focus:ring-[#0079cb]/10"
        />
      </div>

      {estado.estado === 'erro' && (
        <p
          /* `role="alert"` para o leitor de tela anunciar a recusa: sem isso, quem
             não vê a tela submete o formulário e não recebe resposta nenhuma. */
          role="alert"
          className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {estado.mensagem}
        </p>
      )}

      <button
        type="submit"
        disabled={pendente}
        className="w-full rounded-full bg-[#0079cb] px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-white transition-opacity disabled:opacity-40"
      >
        {pendente ? 'Entrando…' : 'Entrar'}
      </button>
    </form>
  );
}
