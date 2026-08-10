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
        transition: 'background 300ms ease, box-shadow 300ms ease',
      }}
    >
      {/* borda inferior gradient sutil */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-6 bottom-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(14,216,246,0.55), rgba(124,58,237,0.35), transparent)',
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
        <Image
          src="/images/sistran-corp-logo.png"
          alt="Sistran"
          width={280}
          height={96}
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
        className="ml-2 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-white/12 bg-white/5 [@media(min-width:1440px)]:hidden"
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

    {/* Fora do <header>: o header tem backdrop-filter, que cria um containing
        block e faria o `position: fixed` do modal se ancorar nele em vez de na
        viewport. */}
    <ContactModal
      open={contactOpen}
      onClose={() => setContactOpen(false)}
      title="Fale com a gente"
      description="Conte o seu desafio e um especialista da Sistran entra em contato."
    />
    </>
  );
}
