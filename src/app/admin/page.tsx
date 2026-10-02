import { redirect } from 'next/navigation';

/**
 * `/admin` — a porta sem número, que até 02/10 respondia 404.
 *
 * ⚠️ O 404 ERA CORRETO E NÃO ERA UM BUG DO NEXT: o segmento `/admin` tinha `layout.tsx`
 * mas nenhum `page.tsx`, e layout sem página não é rota navegável. Quem digitava o
 * endereço de cabeça — que é como se chega a um admin cujo endereço não é divulgado em
 * nenhum link (ver a nota do `layout.tsx`: «zero link público») — batia na porta errada e
 * não tinha como saber que o certo era `/admin/eventos`.
 *
 * O redirecionamento é a resposta mínima: em vez de inventar um painel-índice com dois
 * atalhos, manda para onde o trabalho acontece. O header já oferece Eventos e Carimbo lado
 * a lado, então um índice seria uma tela a mais para atravessar todo dia.
 *
 * ⚠️ `redirect()` E NÃO `permanentRedirect()`: permanente é cacheado pelo navegador
 * indefinidamente e fica caro de desfazer. Se um dia `/admin` ganhar painel próprio, quem
 * já tiver visitado continuaria sendo jogado para a lista por um cache que ninguém
 * controla.
 *
 * O PASSE NÃO É CONFERIDO AQUI, e não é esquecimento: `src/proxy.ts` tem matcher
 * `/admin/:path*`, que cobre também o `/admin` nu — o log da requisição que motivou este
 * arquivo mostra o proxy rodando antes do 404. Quem chega sem cookie já foi mandado para
 * `/admin/entrar` e nunca executa esta linha.
 */
export default function AdminPage() {
  redirect('/admin/eventos');
}
