import Image from 'next/image';
import Link from 'next/link';
import { Linkedin, Youtube } from 'lucide-react';
/* SIS-266 — `NAV_ITEMS` saiu daqui porque a lista mudou de dono: quem itera agora
   é `layout/RodapeNav` (ver o bloco comentado na coluna "Navegação"). O import
   fica comentado em vez de apagado, como o resto do repositório faz — ativo, o
   lint quebra por import não utilizado.
   import { NAV_ITEMS } from '@/data/nav'; */
import { LINKEDIN_URL, YOUTUBE_URL, UNITS } from '@/data/contact';
import { MotionPreferenceTrigger } from '@/components/layout/MotionPreferenceTrigger';
import RodapeNav from '@/components/layout/RodapeNav';

/* O rodape do site tem: logo, os 3 escritorios (Sao Paulo com endereco e
   telefone; Pato Branco e Rio de Janeiro apenas com o nome), o menu, "Conheça
   nossas redes: Linkedin · Youtube", a barra legal (Privacidade · Relatório de
   Transparência Salarial) e o copyright, hoje de 2026 (SIS-290; era 2025, e a
   troca é do ano corrente, não uma correção de conteúdo). A frase institucional que
   existia aqui ("Tecnologia, serviços e consultoria... Beyond Technology") e a
   linha "Especialistas em tecnologia para seguros desde 1988" sairam: nao estao
   escritas no rodape do site.
   Fonte: .claude/conteudo-site/00-home.md (secao 9) */
export default function Footer() {
  return (
    <footer className="lp-rodape relative border-t border-white/10 bg-[#1273BC]/85 py-14">
      {/* SIS-290 · item 5 — A MALHA QUE PASSA NO FUNDO.
          Duas camadas, e as duas são o pedido literal («quadradinhos e linhas
          que ficam passando»): a grade de FIOS desliza na diagonal e os
          QUADRINHOS cheios sobem por cima dela, em velocidades diferentes. Uma
          camada só não entregaria as duas coisas — grade sozinha lê como textura
          parada demais, quadrinhos sozinhos como poeira sem direção.

          Vem ANTES do `brand-line` no DOM de propósito. As três camadas são
          `absolute` sem `z-index`, então quem pinta em cima é quem vem depois: o
          fio de marca de 1px no topo tem de sobreviver à malha, e o conteúdo
          (`container-lp relative`) tem de sobreviver às duas.

          NENHUM `z-index` NEGATIVO aqui, e isso é deliberado: o `<footer>` tem
          fundo próprio (`bg-[#1273BC]/85`) e não cria contexto de empilhamento por
          `position: relative` sozinho — um filho negativo desceria para trás do
          fundo do próprio rodapé e a malha ficaria invisível. É exatamente o
          defeito que a faixa escura da SIS-292 pagou.

          `aria-hidden` + `pointer-events-none`: é decoração sem conteúdo, e ela
          cobre a área inteira do rodapé, onde há links em toda parte.
          Os seis quadrinhos são nós vazios porque cada um precisa de fase e
          velocidade próprias; gerá-los por `map` sobre um array de números
          esconderia isso atrás de um índice sem economizar linha nenhuma. */}
      <span aria-hidden className="lp-rodape-malha pointer-events-none absolute inset-0 overflow-hidden">
        <span className="lp-rodape-malha-grade" />
        <span className="lp-rodape-malha-quadros">
          <i /><i /><i /><i /><i /><i />
        </span>
      </span>

      <span aria-hidden className="brand-line pointer-events-none absolute inset-x-0 top-0" />

      <div className="container-lp relative grid grid-cols-1 gap-10 md:grid-cols-4">
        {/* Coluna 1: Logo + institucional */}
        <div className="lp-rodape-bloco md:col-span-1">
          <Image
            src="/images/sistran-corp-logo.png"
            alt="Sistran"
            /* Proporcao real do arquivo (560x374). O par 360x124 anterior nao era
               a do PNG e distorcia o placeholder gerado pelo Next. */
            width={560}
            height={374}
            /* Foi apontada como LCP pelo aviso do next/image: carrega sem lazy
               para nao atrasar a maior pintura. */
            loading="eager"
            /* SIS-290 · item 4 — A LOGO CRESCEU: era `h-20 ... md:h-24`. Os dois
               degraus subiram na mesma proporção (+20%) para a razão entre mobile e
               desktop não mudar — quem cresce é a marca, não o salto entre as duas
               larguras. `w-auto` mantém a proporção do arquivo (560×374), então
               nenhum número de largura precisou ser tocado. */
            className="lp-rodape-logo h-24 w-auto md:h-28"
          />
          <h4 className="lp-rodape-titulo mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-[#0ed8f6]">
            Conheça nossas redes
          </h4>
          <div className="mt-3 flex gap-3">
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Linkedin da Sistran"
              /* SIS-290 · itens 2 e 3 — O BOTÃO CRESCEU (era `h-11 w-11`, ícone
                 `h-4 w-4`) e o HOVER MUDOU DE NATUREZA.
                 As cores de hover NÃO estão aqui, e sim em `.lp-rodape-rede` no
                 `globals.css`: o pedido é «fundo claro + ícone escuro», e o ícone
                 escuro depende de `currentColor` mudar no mesmo gesto. Escrito em
                 utilitárias isso viraria `hover:bg-... hover:text-...` repetidos nos
                 dois botões, e o `:focus-visible` — que tem de acender igual, senão o
                 teclado não vê o estado — ficaria de fora ou repetido uma terceira
                 vez. O que sobrou de utilitária aqui é só a geometria de repouso.
                 O `transition-colors` saiu junto: a transição agora cobre também
                 `color` e `box-shadow`, e está declarada ao lado das cores. */
              className="lp-rodape-rede inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white"
            >
              <Linkedin className="h-5 w-5" strokeWidth={1.8} />
              {/* Nome da rede, que hoje só existia no `aria-label`. `aria-hidden`
                  porque o nome acessível já vem do `aria-label` — sem isso o
                  leitor de tela leria "Linkedin da Sistran Linkedin". */}
              <span aria-hidden className="lp-rodape-rede-nome">
                Linkedin
              </span>
            </a>
            {/* TODO: trocar YOUTUBE_URL pelo canal oficial (o site linka
                "Youtube" no rodape). */}
            <a
              href={YOUTUBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Youtube da Sistran"
              /* Mesma geometria e mesmo hover do botão acima — o motivo de as cores
                 morarem no CSS está escrito lá. */
              className="lp-rodape-rede inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white"
            >
              <Youtube className="h-5 w-5" strokeWidth={1.8} />
              <span aria-hidden className="lp-rodape-rede-nome">
                Youtube
              </span>
            </a>
          </div>
        </div>

        {/* Coluna 2: Navegação */}
        <div className="lp-rodape-bloco">
          <h4 className="lp-rodape-titulo mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#0ed8f6]">
            Navegação
          </h4>
          {/* ── SIS-266 · A LISTA VIROU `layout/RodapeNav` ────────────────────
              O item da página atual precisa aparecer selecionado, e para isso é
              preciso ler a rota — `usePathname` só existe em Client Component.
              Este `Footer` CONTINUA Server Component: o que virou cliente é só a
              lista de sete links; logo, escritórios, coluna Institucional e o
              copyright seguem saindo prontos do servidor. Virar o rodapé inteiro
              teria mandado tudo isso para o bundle sem necessidade nenhuma.
              A marcação é a mesma (`<ul className="lp-rodape-nav">` com um `<li>`
              e um `<Link>` por item), então nenhum seletor do bloco do rodapé em
              `globals.css` muda de alvo.
              O que estava aqui, para quem comparar:
          <ul className="lp-rodape-nav space-y-2">
            {NAV_ITEMS.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="text-sm text-ink-muted transition-colors hover:text-white">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul> */}
          <RodapeNav />
        </div>

        {/* Coluna 3: Dados */}
        <div className="lp-rodape-bloco">
          <h4 className="lp-rodape-titulo mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#0ed8f6]">
            Contato
          </h4>
          <ul className="space-y-4 text-sm text-ink-muted">
            {UNITS.map((u) => (
              <li key={u.id} className="lp-rodape-unidade">
                <p className="lp-rodape-unidade-cidade text-xs font-semibold uppercase tracking-[0.16em] text-white">
                  {u.city} – {u.state}
                </p>
                {/* Pato Branco e Rio de Janeiro nao tem endereco nem telefone no
                    site; ficam so com o nome, sem dado inventado. */}
                {u.address && (
                  <p className="lp-rodape-unidade-dado mt-1 leading-relaxed">{u.address}</p>
                )}
                {u.phone && (
                  <a
                    href={`tel:${u.phone.replace(/\D/g, '')}`}
                    className="lp-rodape-unidade-dado mt-1 inline-block transition-colors hover:text-white"
                  >
                    {u.phone}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Coluna 4: Legais */}
        <div className="lp-rodape-bloco">
          <h4 className="lp-rodape-titulo mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#0ed8f6]">
            Institucional
          </h4>
          <ul className="lp-rodape-nav space-y-2">
            {/* ── SIS-266 · O BLOG SAI DAQUI (pedido de 30/09) ───────────────────
                O `<li>` removido era, verbatim:

                | <li>
                |   <Link href="/blog" className="text-sm text-ink-muted transition-colors hover:text-white">
                |     Blog
                |   </Link>
                | </li>

                O QUE ISSO DESFAZ, dito por inteiro para não voltar como dúvida: a
                SIS-118 punha este link aqui exatamente para `/blog` deixar de ser
                indexável-e-inalcançável, e com ele fora a rota VOLTA a ser órfã na
                navegação — `sitemap.ts:28-29` continua publicando `/blog` e cada
                post. Isso é ESCOLHA da issue, não descuido: a SIS-266 manda
                remover só o link e põe «apagar /blog ou tirar do sitemap» fora de
                escopo, em palavras. Se a incoerência voltar como problema, o outro
                lado dela é o sitemap, e é issue própria.
                A justificativa original fica abaixo como HISTÓRIA — ela explica por
                que o link existiu e por que, se um dia voltar, volta nesta coluna e
                não no menu do topo (aquela lista é gerada de `NAV_ITEMS`).

                ── SIS-118 (histórico) · O BLOG ENTRA NA NAVEGAÇÃO, e entra AQUI ──
                Até agora a
                única referência a `/blog` em todo o `src/` fora da própria rota
                era o `sitemap.ts`: a seção era indexável e inalcançável navegando.
                Das duas saídas que a issue oferece — entrar na navegação ou sair
                do sitemap —, esta é a que não joga conteúdo real fora: o post
                existe, é institucional e é o tipo de página que se chega por
                busca. Tirá-lo do sitemap resolveria a incoerência apagando o lado
                certo dela.
                Rodapé e não menu: são as sete entradas do topo que carregam a
                oferta, e um blog com uma publicação de 2024 ao lado delas promete
                uma frequência que não existe. O rodapé é onde o próprio site já
                põe o que é institucional e de baixa frequência (Privacidade,
                Transparência Salarial), e é alcançável de qualquer página.
                Fica na coluna "Institucional" — e NÃO na coluna "Navegação", que é
                gerada de `NAV_ITEMS` e não deve ganhar item que o header não tem,
                sob pena de as duas listas passarem a divergir. */}
            <li>
              <Link
                href="/politica-de-privacidade"
                className="text-sm text-ink-muted transition-colors hover:text-white"
              >
                Privacidade
              </Link>
            </li>
            {/* No rodape do site o rotulo esta escrito "Relátorio"; grafia
                corrigida aqui. */}
            <li>
              <Link
                href="/relatorio-de-transparencia-salarial"
                className="text-sm text-ink-muted transition-colors hover:text-white"
              >
                Relatório de Transparência Salarial
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="container-lp mt-10 flex flex-col gap-2 border-t border-white/8 pt-6 md:flex-row md:items-center md:justify-between">
        <p className="text-xs text-ink-faint">2026 ©SISTRAN. Todos os direitos reservados.</p>
        {/* Caminho de volta permanente para a escolha feita na primeira visita. */}
        <MotionPreferenceTrigger className="text-xs text-ink-faint underline underline-offset-4 transition-colors hover:text-white" />
      </div>
    </footer>
  );
}
