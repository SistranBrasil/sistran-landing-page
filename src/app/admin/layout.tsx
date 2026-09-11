import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { VARIAVEL_SENHA } from '@/lib/adminGate';
import { COOKIE_SESSAO, tokenConfere } from '@/lib/adminSessao';
import { sair } from './entrar/acoes';

/**
 * SIS-216 — a casca do admin.
 *
 * O que ela NÃO tem, de propósito: `PageShell`. O header do site traz o menu, e
 * o menu é a primeira coisa que a issue proíbe ("zero link público"). O admin
 * também não deve oferecer caminho de volta para a navegação institucional — é
 * uma ferramenta interna que por acaso mora no mesmo domínio.
 *
 * ── A superfície clara ───────────────────────────────────────────────────────
 * O `RootLayout` continua envolvendo tudo (é ele que tem `<html>`/`<body>`), e o
 * `body` pinta `#1273bc` — o azul do site. Uma ferramenta de edição não quer
 * isso: o que ela mostra são FOTOS e TEXTO do site, e um fundo azul saturado
 * atrás disso mente sobre as cores da imagem que a pessoa está escolhendo.
 *
 * A camada opaca abaixo resolve os dois vizinhos de uma vez: cobre o azul do
 * `body` e também o `<Background />`, que é `fixed` com `-z-10` (as manchas
 * azul/violeta desfocadas). Não precisa de route group novo nem de mexer em uma
 * linha das rotas públicas — é o mesmo raciocínio da nota antiga deste arquivo,
 * levado até o fim.
 */
export const metadata: Metadata = {
  /* Sobrescreve o `robots: { index: true }` do layout raiz. Três camadas
     independentes seguram o "não indexado": esta meta, o `disallow` em
     `robots.ts` e o cabeçalho `X-Robots-Tag` do proxy. A meta só é lida por quem
     recebe o HTML — e quem recebe o HTML já passou pela senha. */
  robots: { index: false, follow: false, nocache: true },
  title: 'Admin · eventos',
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  /**
   * A barra só mostra "Sair" para quem tem passe. Não é segurança — o porteiro é
   * o proxy — é para a tela de login não exibir um botão de sair que não tem o
   * que apagar.
   */
  const esperada = process.env[VARIAVEL_SENHA];
  const autenticado = Boolean(
    esperada && tokenConfere((await cookies()).get(COOKIE_SESSAO)?.value, esperada),
  );

  return (
    <div className="relative z-0 min-h-dvh w-full bg-[#f4f5f7] text-[#0f172a]">
      <header className="sticky top-0 z-20 border-b border-black/[0.07] bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-3 px-5 sm:px-8">
          {/* Ponto de acento em vez de logotipo: o admin não é o site, e um
              logotipo aqui convidaria a tratar esta casca como página pública. */}
          <span aria-hidden className="h-2 w-2 rounded-full bg-[#0079cb]" />
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#475467]">
            Sistran · admin de eventos
          </span>
          {autenticado && (
            <form action={sair} className="ml-auto">
              <button
                type="submit"
                className="rounded-full px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-[#667085] transition-colors hover:bg-black/[0.04] hover:text-[#0f172a]"
              >
                Sair
              </button>
            </form>
          )}
        </div>
      </header>

      <main id="conteudo" tabIndex={-1} className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8">
        {children}
      </main>
    </div>
  );
}
