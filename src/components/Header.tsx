'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import clsx from 'clsx';
import type Lenis from 'lenis';
import { NAV_ITEMS } from '@/data/nav';
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

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeHash, setActiveHash] = useState('');
  const [contactOpen, setContactOpen] = useState(false);

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
    const fora = Array.from(
      document.querySelectorAll<HTMLElement>('#conteudo, footer'),
    ).filter((el) => !el.contains(document.activeElement));
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
      <nav aria-label="Navegação principal" className="ml-auto mr-3 hidden items-center gap-0.5 [@media(min-width:1440px)]:flex">
        {NAV_ITEMS.filter((n) => n.href !== '/#contato').map((item) => {
          const isActive = matchActive(item.href, pathname, activeHash);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
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
        {open ? <X className="h-5 w-5" strokeWidth={1.8} /> : <Menu className="h-5 w-5" strokeWidth={1.8} />}
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
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={clsx(
                  'rounded-xl px-4 py-3 text-sm font-semibold transition-colors',
                  isActive ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white',
                )}
              >
                {item.label}
              </Link>
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
