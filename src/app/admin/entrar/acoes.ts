'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { senhaConfere, VARIAVEL_SENHA } from '@/lib/adminGate';
import { COOKIE_SESSAO, criarToken } from '@/lib/adminSessao';

/**
 * SIS-216 — entrar e sair do admin.
 *
 * A senha é comparada AQUI, no servidor, e nunca viaja para o navegador: o
 * formulário manda o que foi digitado, este arquivo confere e devolve sim ou não.
 * É o que permite ter tela de login sem colocar o segredo no pacote do cliente.
 */

export type EstadoEntrada = { estado: 'inicial' } | { estado: 'erro'; mensagem: string };

/**
 * Atraso fixo em toda recusa.
 *
 * O que ele encarece: uma senha compartilhada, sem cadastro e sem bloqueio por
 * tentativas, atacada em laço por um `fetch`. Meio segundo não incomoda quem
 * errou a senha uma vez e derruba a taxa de tentativas de milhares por minuto
 * para ~120. Não é rate limiting de verdade (isso exigiria estado compartilhado,
 * que esta versão não tem) — é o piso barato que faz a diferença entre "força
 * bruta viável numa tarde" e "não vale a pena".
 *
 * Fixo, e não proporcional ao trabalho feito: um atraso variável voltaria a
 * vazar por tempo o que o `timingSafeEqual` fecha.
 */
function atrasar(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 500));
}

export async function entrar(
  _anterior: EstadoEntrada,
  formulario: FormData,
): Promise<EstadoEntrada> {
  const esperada = process.env[VARIAVEL_SENHA];
  if (!esperada) {
    return {
      estado: 'erro',
      mensagem: `Admin indisponível: a variável de ambiente ${VARIAVEL_SENHA} não está definida no host.`,
    };
  }

  const digitada = formulario.get('senha');
  if (typeof digitada !== 'string' || !senhaConfere(digitada, esperada)) {
    await atrasar();
    return { estado: 'erro', mensagem: 'Senha incorreta.' };
  }

  const { valor, expiraEm } = criarToken(esperada);
  (await cookies()).set(COOKIE_SESSAO, valor, {
    /* `httpOnly`: nenhum JavaScript da página lê este cookie. Sem isso, um único
       script de terceiro injetado na página levaria o passe embora. */
    httpOnly: true,
    /* Em produção o cookie só viaja por HTTPS. Em desenvolvimento, `localhost` é
       http e um cookie `secure` simplesmente não seria guardado — o login pareceria
       falhar sem erro nenhum. */
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    /* Escopo `/admin`: o navegador não manda este cookie nas requisições do site
       público, que assim continua sem receber nada de sessão. */
    path: '/admin',
    expires: new Date(expiraEm),
  });

  /* `redirect` interrompe a action, então não há retorno depois dele. Ir para a
     lista logo após entrar evita a tela de login ficar no histórico como página
     "válida" para onde voltar. */
  redirect('/admin/eventos');
}

export async function sair(): Promise<void> {
  /* Apagar o cookie é o suficiente porque não há sessão guardada no servidor para
     invalidar — o passe É o cookie assinado. Quem precisa expulsar todo mundo de
     uma vez troca a senha no host: isso invalida as assinaturas já emitidas. */
  /* Com `path`, e não só o nome: apagar cookie é na verdade sobrescrever com prazo
     vencido, e o navegador só reconhece como o mesmo cookie se o escopo coincidir
     com o da criação. Sem isto, "Sair" deixaria o passe intacto em `/admin`. */
  (await cookies()).delete({ name: COOKIE_SESSAO, path: '/admin' });
  redirect('/admin/entrar');
}
