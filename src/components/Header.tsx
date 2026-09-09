'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ChevronDown, Menu, X } from 'lucide-react';
import clsx from 'clsx';
import type Lenis from 'lenis';
import { NAV_ITEMS } from '@/data/nav';
import type { NavItem } from '@/data/types';
import ContactModal from './ContactModal';

const ACCENT = '#0ed8f6';
const PILL_BG = 'linear-gradient(135deg, rgba(14, 88, 147,0.78), rgba(15, 91, 152,0.72))';
const PILL_BG_STRONG = 'linear-gradient(135deg, rgba(14, 88, 147,0.94), rgba(15, 91, 152,0.90))';
const PILL_BORDER = '1px solid rgba(255,255,255,0.14)';
const PILL_SHADOW = '0 24px 60px rgba(13, 86, 143,0.35), inset 0 1px 0 rgba(255,255,255,0.06)';

function matchActive(href: string, pathname: string, activeHash: string) {
  if (href.startsWith('/#')) {
    return pathname === '/' && activeHash === href.slice(1);
  }
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(href + '/');
}

/* SIS-80/81/82 — um item com submenu acende também quando a rota atual é de um
   FILHO. Sem isto, estar em `/sistran-labs` não marcaria nada no header: a rota
   não aparece na lista de primeiro nível, e o menu inteiro ficaria apagado numa
   página que ele acabou de servir. */
function ramoAtivo(item: NavItem, pathname: string, activeHash: string) {
  if (matchActive(item.href, pathname, activeHash)) return true;
  return (item.children ?? []).some((f) => matchActive(f.href, pathname, activeHash));
}

/* O link de primeiro nível do menu desktop. Extraído porque agora ele é
   renderizado de dois lugares — solto e dentro do invólucro do submenu — e
   duplicar a marcação era duplicar o sublinhado ciano e o cálculo de cor. */
function LinkNav({
  item,
  isActive,
  current,
}: {
  item: NavItem;
  isActive: boolean;
  current: boolean;
}) {
  return (
    <Link
      href={item.href}
      aria-current={current ? 'page' : undefined}
      className="relative whitespace-nowrap px-2.5 py-2.5 text-[0.75rem] font-semibold transition-colors duration-200"
      style={{ color: isActive ? '#fff' : 'rgba(255,255,255,0.68)' }}
    >
      {item.label}
      <span
        className="absolute bottom-[3px] left-1/2 h-[2px] w-3.5 -translate-x-1/2 rounded-full transition-transform duration-200"
        style={{
          background: ACCENT,
          transform: `translateX(-50%) scaleX(${isActive ? 1 : 0})`,
        }}
      />
    </Link>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeHash, setActiveHash] = useState('');
  const [contactOpen, setContactOpen] = useState(false);
  /* `href` do item cujo submenu está aberto, ou `null`. Guardar a chave em vez
     de um booleano por item deixa a exclusão mútua implícita: abrir um fecha o
     outro, sem lista de estados para sincronizar. */
  const [submenu, setSubmenu] = useState<string | null>(null);
  /* Invólucro do submenu ABERTO (só ele monta o ref) — é o que decide se um
     clique veio de dentro ou de fora. */
  const submenuRef = useRef<HTMLDivElement | null>(null);
  const fecharTimer = useRef<number | null>(null);
  /* Aberto pelo teclado: o foco vai para o primeiro item quando ele existir. */
  const focarPrimeiro = useRef(false);

  const abrirSubmenu = useCallback((href: string) => {
    if (fecharTimer.current) {
      window.clearTimeout(fecharTimer.current);
      fecharTimer.current = null;
    }
    setSubmenu(href);
  }, []);

  /* SIS-87 — fechar com atraso. Mesmo com a ponte de `padding` cobrindo o vão,
     o trajeto do mouse até o item sai do invólucro em diagonal (o painel é mais
     estreito que o percurso, e o cursor passa raspando a borda): fechar no
     `mouseleave` imediato arrancava a lista debaixo do clique. 180ms tolera o
     trajeto sem manter o menu aberto quando a intenção foi sair. */
  const fecharSubmenuComAtraso = useCallback((href: string) => {
    if (fecharTimer.current) window.clearTimeout(fecharTimer.current);
    fecharTimer.current = window.setTimeout(() => {
      fecharTimer.current = null;
      setSubmenu((v) => (v === href ? null : v));
    }, 180);
  }, []);

  useEffect(
    () => () => {
      if (fecharTimer.current) window.clearTimeout(fecharTimer.current);
    },
    [],
  );

  /* SIS-65 — sobrou UMA leitura do scroll. `scrolled` (40px) só intensifica o
     fundo e acende o fio de baixo: mudança barata, que não reposiciona nada.

     O estado `compacto` (80px) saiu junto com a compactação. Ele reduzia a
     altura da pílula de 88px para 68px, e era ISSO que obrigava a logo a
     encolher — 5,5rem são exatamente os 88px da pílula expandida, então dentro
     de 68px a logo grande não caberia. Pedido é logo sempre no tamanho maior,
     e das duas saídas possíveis esta é a que entrega literalmente o tamanho da
     captura: a pílula deixa de encolher. O preço é 20px de viewport
     permanentes, que era a razão original de compactar (relatório de UX, p13 —
     cabeçalho de 88px come a primeira dobra). Fica registrado: quem quiser a
     dobra de volta tem de escolher a outra saída, uma logo que caiba em 68px.

     Sem `compacto` a altura é constante, então `--header-h` também é — e ela já
     está declarada como `88px` em `:root` no `globals.css`. O efeito que a
     reescrevia por quadro de estado saiu: escrever no `documentElement` um valor
     que nunca muda é só uma chance de os dois lugares divergirem. Quem depende
     dela (`scroll-margin-top` das âncoras, o sticky do `Differentials`) passa a
     ler a folha de estilo direto. */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isHome = pathname === '/';
  // hidden apenas no topo absoluto da home
  const hidden = isHome && !scrolled;

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => setSubmenu(null), [pathname]);

  /* Escape fecha o submenu. Efeito próprio, e não uma linha dentro do Escape do
     drawer: aquele só roda quando `open` é true, e o submenu do desktop existe
     justamente com o drawer fechado. */
  useEffect(() => {
    if (!submenu) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSubmenu(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [submenu]);

  /* Clique/toque fora fecha. `pointerdown` e não `click`: no touch o menu abre
     por clique no botão (não há hover), e um `click` no documento chegaria junto
     com o próprio clique que abriu, fechando na hora. */
  useEffect(() => {
    if (!submenu) return;
    const onDown = (e: PointerEvent) => {
      if (!submenuRef.current?.contains(e.target as Node)) setSubmenu(null);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [submenu]);

  /* Aberto por ArrowDown, o foco vai para o primeiro item — mas só depois de a
     lista sair do `hidden`, senão não há o que focar. */
  useEffect(() => {
    if (!submenu || !focarPrimeiro.current) return;
    focarPrimeiro.current = false;
    submenuRef.current?.querySelector<HTMLAnchorElement>('[data-item-submenu]')?.focus();
  }, [submenu]);

  // Na home, o <Link href="/"> navega para a rota atual e o Next não faz nada —
  // a página não sobe. Aqui interceptamos para rolar até o topo do hero.
  // Fora da home, deixamos o Link seguir a navegação normal.
  const onLogoClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (pathname !== '/') return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
      event.preventDefault();
      setOpen(false);
      const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
      if (lenis) lenis.scrollTo(0, { duration: 1.1 });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [pathname],
  );

  // Escape fecha o menu overlay
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  /* Com o menu aberto, o resto da pagina sai de circulacao. So esconder
     visualmente nao basta: o Tab continuava passando pelos links atras do
     drawer e o leitor de tela lia a pagina inteira por baixo do menu
     (relatorio de UX, p13). `inert` resolve os dois de uma vez. */
  useEffect(() => {
    if (!open) return;
    const fora = Array.from(document.querySelectorAll<HTMLElement>('#conteudo, footer')).filter(
      (el) => !el.contains(document.activeElement),
    );
    fora.forEach((el) => el.setAttribute('inert', ''));
    return () => fora.forEach((el) => el.removeAttribute('inert'));
  }, [open]);

  // Body no-scroll enquanto menu aberto
  useEffect(() => {
    const root = document.documentElement;
    if (open) root.classList.add('no-scroll');
    else root.classList.remove('no-scroll');
    return () => root.classList.remove('no-scroll');
  }, [open]);

  // Observa seções âncora só na home
  useEffect(() => {
    if (pathname !== '/') {
      setActiveHash('');
      return;
    }
    const ids = NAV_ITEMS.filter((n) => n.href.startsWith('/#')).map((n) => n.href.slice(2));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveHash(`#${entry.target.id}`);
        });
      },
      { rootMargin: '-38% 0px -52% 0px', threshold: 0.01 },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [pathname]);

  const openContact = useCallback(() => {
    setOpen(false);
    setContactOpen(true);
  }, []);

  return (
    <>
      <header
        className="fixed inset-x-0 top-4 z-50 mx-auto flex h-[72px] w-[min(1240px,calc(100%-32px))] items-center justify-between rounded-[20px] px-3 pl-5 text-white md:h-[88px]"
        style={{
          border: PILL_BORDER,
          background: scrolled ? PILL_BG_STRONG : PILL_BG,
          boxShadow: PILL_SHADOW,
          backdropFilter: 'blur(28px) saturate(1.4)',
          WebkitBackdropFilter: 'blur(28px) saturate(1.4)',
          /* SIS-65 — `height` e `top` saíram da lista: com altura e posição fixas
           elas eram transições sobre valores que nunca mudam. Sobra o que de
           fato reage a `scrolled`. */
          transition:
            'background var(--dur-base, 300ms) ease, box-shadow var(--dur-base, 300ms) ease',
        }}
      >
        {/* borda inferior gradient sutil */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-6 bottom-0 h-px"
          style={{
            /* A segunda parada era `rgba(124,58,237,0.35)`, violeta. A paleta da
             marca é branco + azuis e não admite roxo
             (`.claude/skills/sistran-marca`): agora o fio vai do ciano ao azul
             da marca, que é a mesma leitura de degradê dentro da família de cor
             certa. Vale para todas as páginas — o header é único. */
            background:
              'linear-gradient(90deg, transparent, rgba(14,216,246,0.55), rgba(0,121,203,0.35), transparent)',
            opacity: scrolled ? 1 : 0.5,
            transition: 'opacity 300ms ease',
          }}
        />
        {/* LOGO */}
        <Link
          href="/"
          onClick={onLogoClick}
          aria-label="Sistran, ir para a página inicial"
          className="inline-flex flex-shrink-0 items-center gap-4"
        >
          {/* `data-morph-target`: destino da abertura opcional da home
            (OptionalMorphIntro). O atributo e so uma marca de medicao — o logo
            continua correto e visivel sem o efeito. */}
          {/* SIS-65 — uma altura só, a maior, sem depender de estado de scroll:
            4,5rem no estreito e 5,5rem a partir de `md`. O
            `transition-[height]` saiu com ela — altura fixa não transiciona.

            `width`/`height` corrigidos de 280x96 para 560x374, as dimensões
            REAIS do arquivo. Não é detalhe: com a razão errada (2,92 em vez de
            1,50) o `w-auto` reservava uma caixa de 256px de largura para uma
            marca que o `object-contain` pintava com 132px, e os ~124px
            restantes eram espaço morto entre a logo e a nav. Corrigir a razão
            não muda o tamanho aparente da marca — ela já era pintada a 132x88
            — só devolve o espaço e faz a caixa reservada bater com o que se vê,
            que é o que importa para CLS.

            Nitidez em tela 2x deixa de ser risco pelo mesmo motivo: 88px de
            exibição pedem 176px de fonte, e o arquivo tem 374px de altura. A
            preocupação da task partia dos 96px declarados, que não eram os do
            arquivo.

            O mesmo par errado está no `Footer.tsx` (360x124) com o mesmo
            arquivo; fora do escopo desta task, mas é a mesma correção. */}
          <Image
            data-morph-target=""
            src="/images/sistran-corp-logo.png"
            alt="Sistran"
            width={560}
            height={374}
            priority
            className="logo-glow h-[4.5rem] w-auto object-contain md:h-[5.5rem]"
          />
        </Link>

        {/* NAV desktop */}
        <nav
          aria-label="Navegação principal"
          className="ml-auto mr-3 hidden items-center gap-0.5 [@media(min-width:1440px)]:flex"
        >
          {NAV_ITEMS.filter((n) => n.href !== '/#contato').map((item) => {
            const isActive = ramoAtivo(item, pathname, activeHash);
            /* `isActive` acende o item (inclui o ramo); `current` é o
             `aria-current`, e esse tem de ser literal — em `/sistran-labs` o
             link para `/quem-somos` está aceso, mas não é a página atual. */
            const link = (
              <LinkNav
                item={item}
                isActive={isActive}
                current={matchActive(item.href, pathname, activeHash)}
              />
            );
            if (!item.children) return <span key={item.href}>{link}</span>;

            const idSub = `submenu-${item.href.replace(/\W+/g, '-')}`;
            const aberto = submenu === item.href;
            return (
              /* O ponteiro abre e fecha por `mouseenter`/`mouseleave` no INVÓLUCRO,
               não em cada item: o submenu fica dentro dele, então atravessar o
               vão entre o pai e a lista não conta como sair. O teclado usa o
               botão e o `blur` — `onBlur` só fecha quando o foco vai para fora
               do invólucro (`relatedTarget`), senão tabular do pai para o
               primeiro filho fecharia a lista que se acabou de abrir. */
              <div
                key={item.href}
                ref={aberto ? submenuRef : undefined}
                className="relative"
                onMouseEnter={() => abrirSubmenu(item.href)}
                onMouseLeave={() => fecharSubmenuComAtraso(item.href)}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setSubmenu(null);
                }}
                /* Teclado: ArrowDown abre e desce, ArrowUp sobe, Escape devolve o
                 foco ao botão. Tab continua percorrendo os itens sem fechar —
                 é o `onBlur` acima, que só age quando o foco sai do invólucro. */
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    if (!aberto) return;
                    setSubmenu(null);
                    e.currentTarget.querySelector('button')?.focus();
                    return;
                  }
                  if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
                  e.preventDefault();
                  if (!aberto) {
                    focarPrimeiro.current = true;
                    abrirSubmenu(item.href);
                    return;
                  }
                  const itens = Array.from(
                    e.currentTarget.querySelectorAll<HTMLAnchorElement>('[data-item-submenu]'),
                  );
                  if (!itens.length) return;
                  const atual = itens.indexOf(document.activeElement as HTMLAnchorElement);
                  const passo = e.key === 'ArrowDown' ? 1 : -1;
                  const alvo =
                    atual < 0
                      ? passo === 1
                        ? 0
                        : itens.length - 1
                      : (atual + passo + itens.length) % itens.length;
                  itens[alvo].focus();
                }}
              >
                <span className="inline-flex items-center">
                  {link}
                  {/* Botão separado do link, e não um pai que só abre a lista:
                    `/quem-somos` é uma página de verdade e continua a um clique
                    de distância. O rótulo do botão diz o que ele faz, porque
                    visualmente ele é só uma seta. */}
                  <button
                    type="button"
                    aria-expanded={aberto}
                    aria-controls={idSub}
                    aria-label={`${aberto ? 'Fechar' : 'Abrir'} submenu de ${item.label}`}
                    onClick={() => (aberto ? setSubmenu(null) : abrirSubmenu(item.href))}
                    className="-ml-1.5 inline-flex h-6 w-5 items-center justify-center rounded-md transition-colors hover:bg-white/10"
                  >
                    <ChevronDown
                      className="h-3.5 w-3.5 transition-transform duration-200"
                      strokeWidth={2.2}
                      style={{
                        color: isActive ? '#fff' : 'rgba(255,255,255,0.68)',
                        transform: aberto ? 'rotate(180deg)' : 'none',
                      }}
                      aria-hidden
                    />
                  </button>
                </span>

                {/* `hidden` de verdade, não `opacity: 0`: uma lista invisível mas
                  presente continuaria recebendo Tab e sendo lida por leitor de
                  tela. A transição de entrada perde-se, e é um preço aceitável
                  num menu de quatro linhas. */}
                {/* SIS-87 — o afastamento de 10px é `padding-top` deste invólucro,
                  e não `top: calc(100% + 10px)` no painel. Com o vão, o cursor
                  saía do invólucro no caminho até a lista, o `mouseleave`
                  disparava e o `hidden` arrancava os links antes do clique. O
                  padding é área do elemento: agora o percurso do gatilho até o
                  primeiro item nunca sai da região de hover. */}
                <div hidden={!aberto} className="absolute left-0 top-full z-10 pt-[10px]">
                  <ul
                    id={idSub}
                    className="min-w-[13rem] overflow-hidden rounded-[14px] border border-white/12 p-1.5"
                    style={{
                      background: PILL_BG_STRONG,
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      boxShadow: PILL_SHADOW,
                    }}
                  >
                    {item.children.map((filho) => {
                      const filhoAtivo = matchActive(filho.href, pathname, activeHash);
                      return (
                        <li key={filho.label}>
                          <Link
                            href={filho.href}
                            data-item-submenu=""
                            aria-current={filhoAtivo ? 'page' : undefined}
                            onClick={() => setSubmenu(null)}
                            className={clsx(
                              'block whitespace-nowrap rounded-[10px] px-3 py-2 text-[0.78rem] font-semibold transition-colors',
                              filhoAtivo
                                ? 'bg-white/12 text-white'
                                : 'text-white/70 hover:bg-white/8 hover:text-white',
                            )}
                          >
                            {filho.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            );
          })}
        </nav>

        {/* CTA — abre o modal de contato em vez de navegar para /#contato.
          <button>, nao <Link>: nao ha mudanca de rota. A secao #contato segue
          existindo na home e acessivel pelo menu. */}
        <button
          type="button"
          onClick={openContact}
          aria-haspopup="dialog"
          aria-expanded={contactOpen}
          className="hidden h-11 flex-shrink-0 items-center gap-3 rounded-[13px] bg-white px-4 text-[0.78rem] font-bold md:inline-flex"
          style={{ color: '#0b2550', boxShadow: '0 8px 24px rgba(0,0,0,0.16)' }}
        >
          Fale com a gente
          <ArrowUpRight className="h-3.5 w-3.5" style={{ color: '#087fc4' }} strokeWidth={2.4} />
        </button>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={open}
          className="ml-2 inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-white/12 bg-white/5 [@media(min-width:1440px)]:hidden"
        >
          {open ? (
            <X className="h-5 w-5" strokeWidth={1.8} />
          ) : (
            <Menu className="h-5 w-5" strokeWidth={1.8} />
          )}
        </button>

        {/* Mobile drawer */}
        <div
          className={clsx(
            'absolute inset-x-0 top-[calc(100%+8px)] overflow-hidden rounded-[20px] border border-white/12 text-white transition-[max-height,opacity] duration-300 [@media(min-width:1440px)]:hidden',
            open ? 'max-h-[80vh] opacity-100' : 'pointer-events-none max-h-0 opacity-0',
          )}
          style={{
            background: PILL_BG_STRONG,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: PILL_SHADOW,
          }}
        >
          <nav className="flex flex-col gap-0.5 p-3">
            {NAV_ITEMS.map((item) => {
              const isActive = matchActive(item.href, pathname, activeHash);
              return (
                /* No drawer o submenu fica sempre aberto, recuado sob o pai. Um
                 acordeão aqui só esconderia quatro linhas atrás de um toque
                 extra: o drawer já é uma lista rolável, e este é o lugar onde
                 estar visível vale mais que estar arrumado. */
                <div key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={clsx(
                      'block rounded-xl px-4 py-3 text-sm font-semibold transition-colors',
                      isActive
                        ? 'bg-white/10 text-white'
                        : 'text-white/70 hover:bg-white/5 hover:text-white',
                    )}
                  >
                    {item.label}
                  </Link>
                  {item.children ? (
                    <ul className="ml-4 mt-0.5 space-y-0.5 border-l border-white/12 pl-2">
                      {item.children.map((filho) => {
                        const filhoAtivo = matchActive(filho.href, pathname, activeHash);
                        return (
                          <li key={filho.label}>
                            <Link
                              href={filho.href}
                              aria-current={filhoAtivo ? 'page' : undefined}
                              className={clsx(
                                'block rounded-lg px-4 py-2.5 text-[0.8rem] font-semibold transition-colors',
                                filhoAtivo
                                  ? 'bg-white/10 text-white'
                                  : 'text-white/60 hover:bg-white/5 hover:text-white',
                              )}
                            >
                              {filho.label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}
                </div>
              );
            })}
            <button
              type="button"
              onClick={openContact}
              aria-haspopup="dialog"
              aria-expanded={contactOpen}
              className="mt-2 inline-flex items-center justify-between rounded-xl bg-white px-4 py-3 text-sm font-bold"
              style={{ color: '#0b2550' }}
            >
              Fale com a gente
              <ArrowUpRight className="h-4 w-4" style={{ color: '#087fc4' }} strokeWidth={2.4} />
            </button>
          </nav>
        </div>
      </header>

      {/* Escurece o conteudo por tras do drawer: o menu antes flutuava sobre a
        pagina com contraste insuficiente entre texto e fundo em rolagem
        (relatorio de UX, p13). Decorativo — o Escape e o proprio botao ja
        fecham o menu pelo teclado. */}
      <div
        aria-hidden
        onClick={() => setOpen(false)}
        className={clsx(
          'fixed inset-0 z-40 bg-[#031326]/70 backdrop-blur-[2px] transition-opacity duration-300 [@media(min-width:1440px)]:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />

      {/* Fora do <header>: o header tem backdrop-filter, que cria um containing
        block e faria o `position: fixed` do modal se ancorar nele em vez de na
        viewport. */}
      {/* Sem `title`/`description` de proposito: o botao "Fale com a gente" abre o
        convite completo — sobretitulo, "Entre em contato conosco", telefone e
        formulario —, que é a escrita padrao do modal. */}
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}
