import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { VARIAVEL_SENHA } from '@/lib/adminGate';
import { COOKIE_SESSAO, tokenConfere } from '@/lib/adminSessao';

/**
 * SIS-216 — porteiro do `/admin`, por cookie assinado (opção **B** da issue).
 *
 * Começou na opção A (HTTP Basic, diálogo nativo do navegador) e passou para B a
 * pedido: "crie uma tela de login simples". O código de A está preservado
 * comentado abaixo, porque a issue trata as duas como caminhos legítimos e voltar
 * é trocar qual bloco está ativo.
 *
 * NÃO é sessão de usuário, e a distinção é o pedido literal da issue: não há id
 * de pessoa, não há papel, não há tabela de contas, não há "me". Há UMA senha
 * compartilhada, guardada no host, e um cookie assinado que diz "alguém que sabia
 * a senha passou por aqui" com prazo. O desenho do cookie está em
 * `src/lib/adminSessao.ts`.
 *
 * ── Arquivo `proxy.ts`, e não `middleware.ts` ────────────────────────────────
 * Este projeto está no Next 16.3, onde `middleware` foi RENOMEADO para `proxy`:
 * mesmo comportamento, outro nome de arquivo e de export
 * (`node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md`).
 * Escrever `middleware.ts` aqui não daria erro — daria coisa pior: um arquivo
 * depreciado que ainda funciona hoje. Só existe UM proxy por projeto, então este
 * arquivo é o lugar de qualquer porteiro futuro, e não um arquivo do admin.
 *
 * O runtime é Node.js por padrão a partir do 16 (o mesmo doc, seção "Runtime"),
 * e é o que permite `node:crypto` abaixo. Em Edge não haveria `timingSafeEqual`.
 */

/**
 * A senha NUNCA vai para o pacote do cliente, e isso não é disciplina — é
 * mecânica: `process.env.X` só chega ao navegador se o nome começar com
 * `NEXT_PUBLIC_`. Este nome não começa, e este arquivo não é um componente:
 * roda antes da requisição chegar à aplicação.
 *
 * A conferência em si mora em `src/lib/adminGate.ts`, porque é feita duas vezes:
 * aqui e dentro da Server Action que grava o catálogo. O motivo está escrito lá.
 */

/**
 * Opção A, desativada a pedido — mantida porque a issue lista A e B como caminhos
 * válidos, e porque este é o bloco que se reativa se a tela de login incomodar.
 * Voltar para A é: descomentar isto, chamar `pedirSenha()` no lugar do
 * `NextResponse.redirect` abaixo, e refazer a conferência com `basicConfere`.
 *
 * function pedirSenha(): NextResponse {
 *   return new NextResponse('Acesso restrito.', {
 *     status: 401,
 *     headers: {
 *       // É o `WWW-Authenticate` que faz o navegador abrir o diálogo nativo — sem
 *       // ele o 401 seria só uma página de erro, e não haveria como entrar.
 *       'WWW-Authenticate': 'Basic realm="Sistran · admin de eventos", charset="UTF-8"',
 *       'Cache-Control': 'no-store',
 *     },
 *   });
 * }
 */

/** A porta. Precisa abrir sem passe, senão não há como conseguir um. */
const ROTA_LOGIN = '/admin/entrar';

export function proxy(request: NextRequest): NextResponse {
  const esperada = process.env[VARIAVEL_SENHA];

  /**
   * FALHA FECHADA. Sem a variável no host, o admin não abre — responde 503, e
   * não "entra sem senha". É a diferença entre uma configuração esquecida que
   * aparece na primeira tentativa de uso e uma que publica o editor do site
   * aberto na internet sem ninguém perceber.
   */
  if (!esperada) {
    return new NextResponse(
      `Admin indisponível: a variável de ambiente ${VARIAVEL_SENHA} não está definida no host.`,
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    );
  }

  const naLogin = request.nextUrl.pathname === ROTA_LOGIN;
  const temPasse = tokenConfere(request.cookies.get(COOKIE_SESSAO)?.value, esperada);

  /**
   * Sem passe e fora da porta: manda para a porta, em vez de responder 401.
   *
   * O 403/401 seco seria uma parede: a pessoa certa, com a senha na mão, ficaria
   * sem lugar onde digitá-la. Como o endereço do admin não é divulgado, um erro
   * cru também não teria como ensinar o caminho.
   */
  if (!temPasse && !naLogin) {
    return NextResponse.redirect(new URL(ROTA_LOGIN, request.nextUrl));
  }

  /**
   * Com passe, na porta: manda para a lista. Evita a tela de login aparecer para
   * quem já entrou — o botão "voltar" do navegador é o caminho mais comum até
   * aqui, e um formulário de senha pedindo senha de novo parece defeito.
   */
  if (temPasse && naLogin) {
    return NextResponse.redirect(new URL('/admin/eventos', request.nextUrl));
  }

  /* `no-store` também no caminho de sucesso: página de admin não pode ficar em
     cache compartilhado de CDN, senão o conteúdo autenticado poderia ser servido a
     quem não passou pelo porteiro. Vale igualmente para a tela de login. */
  const resposta = NextResponse.next();
  resposta.headers.set('Cache-Control', 'no-store');
  /* Cinto e suspensório do "zero link público": além do `robots.ts` e do
     `metadata.robots` do layout, o cabeçalho fecha a porta para o rastreador que
     ignora o arquivo. */
  resposta.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return resposta;
}

export const config = {
  /**
   * Só `/admin`. A rota pública não passa por aqui — e isso é parte do critério
   * "página pública inalterada": um matcher largo (`/:path*`) colocaria um
   * porteiro no caminho de `/eventos-inovacao` para não fazer nada com ele.
   *
   * As Server Actions do admin fazem POST para a URL da PRÓPRIA página
   * (`/admin/eventos/<id>`), então este matcher também as cobre: não existe rota
   * de API fora de `/admin` capaz de gravar o catálogo.
   */
  matcher: '/admin/:path*',
};
