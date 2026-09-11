import { createHmac, timingSafeEqual } from 'node:crypto';

/**
 * SIS-216 — o porteiro por cookie assinado (opção **B** da issue), pedido depois
 * de a opção A estar de pé: "crie uma tela de login simples".
 *
 * O que muda em relação ao HTTP Basic: quem digita a senha é um formulário do
 * site, e não o diálogo cinza do navegador. O que NÃO muda — e é o pedido literal
 * da issue, "sem montar sessão de usuário completa" — é que continua não havendo
 * conta: sem id de pessoa, sem papel, sem "me", sem tabela de usuários. Este
 * cookie afirma UMA coisa só: "alguém que sabia a senha passou por aqui, e isso
 * vale até tal instante".
 *
 * ── Por que assinado, e não um cookie qualquer ───────────────────────────────
 * Um `admin=ok` seria pior que não ter porteiro, porque pareceria ter um: o
 * cookie é dado do cliente, e qualquer pessoa o digita no DevTools em cinco
 * segundos. O que impede isso é o HMAC — o valor só é aceito se vier acompanhado
 * de uma assinatura que exige a senha para ser produzida.
 *
 * ── A chave do HMAC é a própria senha ───────────────────────────────────────
 * Deliberado, e tem uma consequência boa: trocar `EVENTOS_ADMIN_PASSWORD`
 * invalida na hora todos os cookies já emitidos. É a única forma de "expulsar
 * todo mundo" num desenho sem sessões guardadas no servidor — e é justamente o
 * que se quer fazer quando uma senha compartilhada vaza. O preço é não haver
 * segredo separado para rotacionar sem trocar a senha; num porteiro de ferramenta
 * interna, o troco é favorável.
 *
 * ── O prazo vai DENTRO da assinatura ────────────────────────────────────────
 * `<expiraEm>.<hmac(expiraEm)>`. Confiar no atributo `Max-Age` do cookie para
 * expirar seria confiar no cliente: o navegador é que apaga cookie vencido, e um
 * cliente hostil simplesmente não apaga. Com o instante assinado, um cookie
 * remendado para durar mais deixa de conferir.
 */

export const COOKIE_SESSAO = 'admin_eventos';

/** Oito horas — um dia de trabalho, o prazo que a própria issue sugere na opção B. */
export const DURACAO_HORAS = 8;

function assinar(expiraEm: number, senha: string): string {
  return createHmac('sha256', senha).update(String(expiraEm)).digest('base64url');
}

export function criarToken(senha: string, agora = Date.now()): { valor: string; expiraEm: number } {
  const expiraEm = agora + DURACAO_HORAS * 60 * 60 * 1000;
  return { valor: `${expiraEm}.${assinar(expiraEm, senha)}`, expiraEm };
}

/**
 * O cookie recebido é válido para a senha em vigor e ainda está no prazo?
 *
 * A comparação da assinatura é em tempo constante pelo mesmo motivo da senha
 * (ver `adminGate.ts`): com `===`, o tempo de resposta permitiria descobrir a
 * assinatura correta caractere a caractere, e uma assinatura correta é um passe
 * de oito horas.
 */
export function tokenConfere(
  valor: string | undefined,
  senha: string,
  agora = Date.now(),
): boolean {
  if (!valor) return false;
  const separador = valor.indexOf('.');
  if (separador < 1) return false;

  const expiraEm = Number(valor.slice(0, separador));
  if (!Number.isSafeInteger(expiraEm) || expiraEm <= agora) return false;

  const recebida = Buffer.from(valor.slice(separador + 1), 'utf8');
  const esperada = Buffer.from(assinar(expiraEm, senha), 'utf8');
  if (recebida.length !== esperada.length) return false;
  return timingSafeEqual(recebida, esperada);
}
