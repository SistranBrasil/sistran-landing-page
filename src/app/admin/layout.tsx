import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
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
  title: 'Admin',
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
      {/**
       * ⚠️ A BARRA FICOU AZUL E GANHOU A LOGO — 01/10, a pedido.
       *
       * O que estava aqui era `bg-white/85` com um ponto de acento, e a nota dizia: «Ponto
       * de acento em vez de logotipo: o admin não é o site, e um logotipo aqui convidaria a
       * tratar esta casca como página pública.» A premissa de leitura envelheceu — a casca
       * já se distingue do site por não ter o menu institucional, que é a proibição real da
       * issue («zero link público»), e isso não mudou.
       *
       * ⚠️ O FUNDO AZUL É EXIGÊNCIA DO ARQUIVO, não enfeite: a logo é o símbolo BRANCO com
       * canal alfa — está medido na nota de `ContactCTAReferencia.tsx`, 80,6% dos pixels em
       * alpha=0 e nenhum pixel opaco escuro. Sobre a barra branca anterior ela
       * simplesmente não apareceria.
       *
       * ⚠️ `#0b3a5c`, E NÃO O `#1273bc` DO `body`, e a escolha é por MEDIÇÃO de contraste:
       * sobre `#1273bc` o branco dá 5,0:1 — passa, mas só no branco puro, e os links desta
       * barra são brancos ESMAECIDOS. Em `white/70` sobre `#1273bc` a razão cai para ~3,6:1
       * e reprova em texto de 11 px. Sobre `#0b3a5c` o branco puro dá 11,8:1 e o `white/70`
       * dá 6,6:1, os dois acima dos 4,5:1 de AA. O token já existe no projeto.
       *
       * ⚠️ SÓ A BARRA, e o conteúdo abaixo continua claro — ver a nota do topo deste
       * arquivo, que segue valendo inteira: o que o admin mostra são as FOTOS do site, e
       * azul saturado atrás delas mente sobre as cores da arte que se está escolhendo.
       * Deixar a página toda azul estragaria exatamente o julgamento de imagem que o resto
       * do trabalho de hoje existiu para melhorar. Se o azul tiver de descer para o
       * conteúdo, é decisão de desenho a tomar olhando uma arte de evento em cima dele.
       */}
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0b3a5c]/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-3 px-5 sm:px-8">
          {/* `aria-hidden` + `alt=""`: o nome da marca já está escrito no texto ao lado, e
              descrever a logo o leria duas vezes.

              O arquivo vem de `/images/loading/`, e o caminho é HISTÓRICO — ele foi gerado
              para o portão de carregamento (`scripts/gerar-logo-portao-sis274.mjs`), mas é
              o mesmo símbolo branco e é a derivada mais leve que existe no projeto: 320 px
              e 11 KB, contra 640 px e 27 KB da versão do CTA. Em 26 px ele é reduzido ~12×,
              então sobra resolução para qualquer DPR. Não inventei um asset novo para não
              deixar duas cópias da mesma arte envelhecendo em paralelo. */}
          <Image
            src="/images/loading/logo-sistran-portao.webp"
            alt=""
            aria-hidden
            width={320}
            height={320}
            priority
            className="h-[26px] w-[26px]"
          />
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white">
            Sistran · admin
          </span>
          {/* Links ENTRE ferramentas internas, não para o site: a proibição de
              "zero link público" é sobre não devolver ninguém à navegação
              institucional, e um admin com duas ferramentas sem como trocar
              entre elas obriga a digitar a URL de cabeça. */}
          {autenticado && (
            <nav className="flex items-center gap-1">
              <Link
                href="/admin/eventos"
                className="rounded-full px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-white/70 no-underline transition-colors hover:bg-white/10 hover:text-white"
              >
                Eventos
              </Link>
              <Link
                href="/admin/carimbo"
                className="rounded-full px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-white/70 no-underline transition-colors hover:bg-white/10 hover:text-white"
              >
                Carimbo
              </Link>
            </nav>
          )}
          {autenticado && (
            <form action={sair} className="ml-auto">
              <button
                type="submit"
                /* Os hovers trocaram `bg-black/[0.04]` por `bg-white/10`: realce escuro
                   sobre fundo escuro é realce invisível. */
                className="rounded-full px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-white/70 transition-colors hover:bg-white/10 hover:text-white"
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
