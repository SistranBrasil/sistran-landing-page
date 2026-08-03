import Image from 'next/image';
import Link from 'next/link';
import { Linkedin } from 'lucide-react';
import { NAV_ITEMS } from '@/data/nav';
import { LINKEDIN_URL, CONTACT_PHONE, UNITS } from '@/data/contact';

export default function Footer() {
  const main = UNITS[0];
  return (
    <footer className="relative border-t border-white/10 bg-[#04122A]/85 py-14">
      <span aria-hidden className="brand-line pointer-events-none absolute inset-x-0 top-0" />

      <div className="container-lp relative grid grid-cols-1 gap-10 md:grid-cols-4">
        {/* Coluna 1: Logo + institucional */}
        <div className="md:col-span-1">
          <Image
            src="/images/sistran-corp-logo.png"
            alt="Sistran"
            width={160}
            height={48}
            className="h-10 w-auto"
          />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-ink-muted">
            Tecnologia, serviços e consultoria para o mercado de seguros. Beyond Technology.
          </p>
          <div className="mt-5">
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn da Sistran"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-colors duration-300 hover:border-[#0ed8f6]/60 hover:bg-white/10"
            >
              <Linkedin className="h-4 w-4" strokeWidth={1.8} />
            </a>
          </div>
        </div>

        {/* Coluna 2: Navegação */}
        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#0ed8f6]">
            Navegação
          </h4>
          <ul className="space-y-2">
            {NAV_ITEMS.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="text-sm text-ink-muted transition-colors hover:text-white">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Coluna 3: Dados */}
        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#0ed8f6]">
            Contato
          </h4>
          <ul className="space-y-2 text-sm text-ink-muted">
            <li>
              <a
                href={`tel:${CONTACT_PHONE.replace(/\D/g, '')}`}
                className="transition-colors hover:text-white"
              >
                {CONTACT_PHONE}
              </a>
            </li>
            <li className="leading-relaxed">{main.address}</li>
            <li>
              {main.city} · {main.state}
            </li>
          </ul>
        </div>

        {/* Coluna 4: Legais */}
        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#0ed8f6]">
            Institucional
          </h4>
          <ul className="space-y-2">
            {/* TODO: confirmar link de Privacidade */}
            <li>
              <a href="#" className="text-sm text-ink-muted transition-colors hover:text-white">
                Privacidade
              </a>
            </li>
            {/* TODO: confirmar link do Relatório de Transparência Salarial */}
            <li>
              <a href="#" className="text-sm text-ink-muted transition-colors hover:text-white">
                Relatório de Transparência Salarial
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="container-lp mt-10 flex flex-col gap-2 border-t border-white/8 pt-6 md:flex-row md:items-center md:justify-between">
        <p className="text-xs text-ink-faint">
          2026 ©SISTRAN. Todos os direitos reservados.
        </p>
        <p className="text-xs text-ink-faint">
          Sistran Brasil · Especialistas em tecnologia para seguros desde 1988.
        </p>
      </div>
    </footer>
  );
}
