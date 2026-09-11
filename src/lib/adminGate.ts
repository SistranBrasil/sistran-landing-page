import { timingSafeEqual } from 'node:crypto';

/**
 * SIS-216 — a conferência da senha do admin, em UM lugar, porque ela é feita em
 * DOIS: no `src/proxy.ts` (que barra a requisição antes de a página existir) e
 * dentro da Server Action que grava o catálogo.
 *
 * A segunda não é redundância decorativa. A documentação do Next 16 é explícita:
 * "Server Functions are reachable via direct POST requests, not just through your
 * application's UI. Always verify authentication and authorization inside every
 * Server Function"
 * (`node_modules/next/dist/docs/01-app/01-getting-started/07-mutating-data.md`).
 * Hoje o `matcher` do proxy cobre `/admin/:path*` e a action posta para a URL da
 * própria página do admin, então as duas defesas coincidem — mas quem mudar o
 * matcher, ou mover a página, não pode com isso abrir a gravação do catálogo do
 * site. A checagem que importa é a que fica colada na escrita.
 *
 * Só isto mora aqui: nada de resposta HTTP, que é assunto do proxy.
 */

export const VARIAVEL_SENHA = 'EVENTOS_ADMIN_PASSWORD';

/**
 * Comparação em tempo constante. O ataque que ela evita é real e barato aqui: a
 * comparação `===` de string retorna no primeiro caractere diferente, e o tempo
 * de resposta passa a vazar o tamanho do prefixo correto — uma senha de 12
 * caracteres cai para ~12 × 95 tentativas em vez de 95¹². Como é UMA senha
 * compartilhada, sem cadastro e sem rotação, ela vale mais que uma senha
 * individual, e o custo de fechar essa porta é esta função.
 *
 * `timingSafeEqual` lança se os buffers tiverem tamanhos diferentes; a guarda de
 * tamanho vem antes. O tamanho da senha não é o segredo — o conteúdo é.
 */
export function senhaConfere(recebida: string, esperada: string): boolean {
  const a = Buffer.from(recebida, 'utf8');
  const b = Buffer.from(esperada, 'utf8');
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/**
 * Opção A (HTTP Basic), desativada quando o admin ganhou tela de login — o
 * cabeçalho `Authorization: Basic <base64>` confere com a senha do host?
 *
 * Fica comentada, e não apagada, porque a issue lista A e B como caminhos válidos:
 * quem quiser voltar ao diálogo nativo precisa desta função e do bloco irmão em
 * `src/proxy.ts`. O que substituiu esta conferência é `tokenConfere` de
 * `src/lib/adminSessao.ts`; `senhaConfere` acima continua em uso — é ela que a
 * tela de login chama.
 *
 * O USUÁRIO do par `usuario:senha` era ignorado de propósito: a issue pede uma
 * senha compartilhada, não contas.
 *
 * export function basicConfere(cabecalho: string | null, esperada: string): boolean {
 *   if (!cabecalho) return false;
 *   const [esquema, credencial] = cabecalho.split(' ');
 *   if (esquema?.toLowerCase() !== 'basic' || !credencial) return false;
 *   let decodificado: string;
 *   try {
 *     decodificado = Buffer.from(credencial, 'base64').toString('utf8');
 *   } catch {
 *     return false;
 *   }
 *   return senhaConfere(decodificado.slice(decodificado.indexOf(':') + 1), esperada);
 * }
 */
