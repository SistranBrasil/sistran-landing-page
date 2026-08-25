/**
 * Tipo e estado inicial dos formulários de contato, fora do módulo da action.
 *
 * Não é organização: um módulo `'use server'` só pode exportar funções async. A
 * constante morava lá e chegava ao cliente como `undefined` — o `useActionState`
 * começava sem `invalidos` e o primeiro render estourava em
 * `estado.invalidos.includes`. Aqui é um módulo comum, então o valor atravessa
 * de verdade.
 */

export type EstadoContato = {
  status: 'idle' | 'sucesso' | 'erro';
  /** Mensagem técnica de status, anunciada por `aria-live`. */
  mensagem: string;
  /** Campos que falharam, para marcar `aria-invalid` no cliente. */
  invalidos: string[];
};

export const ESTADO_INICIAL: EstadoContato = {
  status: 'idle',
  mensagem: '',
  invalidos: [],
};
