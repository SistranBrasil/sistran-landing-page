import Image from 'next/image';
import Link from 'next/link';
import { Linkedin, Youtube } from 'lucide-react';
import { NAV_ITEMS } from '@/data/nav';
import { LINKEDIN_URL, YOUTUBE_URL, UNITS } from '@/data/contact';
import { MotionPreferenceTrigger } from '@/components/layout/MotionPreferenceTrigger';

/* O rodape do site tem: logo, os 3 escritorios (Sao Paulo com endereco e
   telefone; Pato Branco e Rio de Janeiro apenas com o nome), o menu, "Conheça
   nossas redes: Linkedin · Youtube", a barra legal (Privacidade · Relatório de
   Transparência Salarial) e o copyright de 2025. A frase institucional que
   existia aqui ("Tecnologia, serviços e consultoria... Beyond Technology") e a
   linha "Especialistas em tecnologia para seguros desde 1988" sairam: nao estao
   escritas no rodape do site.
   Fonte: .claude/conteudo-site/00-home.md (secao 9) */
export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-[#1273BC]/85 py-14">
      <span aria-hidden className="brand-line pointer-events-none absolute inset-x-0 top-0" />

      <div className="container-lp relative grid grid-cols-1 gap-10 md:grid-cols-4">
        {/* Coluna 1: Logo + institucional */}
        <div className="md:col-span-1">
          <Image
            src="/images/sistran-corp-logo.png"
            alt="Sistran"
            width={360}
            height={124}
            className="h-20 w-auto md:h-24"
          />
          <h4 className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-[#0ed8f6]">
            Conheça nossas redes
          </h4>
          <div className="mt-3 flex gap-3">
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Linkedin da Sistran"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-colors duration-300 hover:border-[#0ed8f6]/60 hover:bg-white/10"
            >
              <Linkedin className="h-4 w-4" strokeWidth={1.8} />
            </a>
            {/* TODO: trocar YOUTUBE_URL pelo canal oficial (o site linka
                "Youtube" no rodape). */}
            <a
              href={YOUTUBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Youtube da Sistran"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-colors duration-300 hover:border-[#0ed8f6]/60 hover:bg-white/10"
            >
              <Youtube className="h-4 w-4" strokeWidth={1.8} />
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
          <ul className="space-y-4 text-sm text-ink-muted">
            {UNITS.map((u) => (
              <li key={u.id}>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white">
                  {u.city} – {u.state}
                </p>
                {/* Pato Branco e Rio de Janeiro nao tem endereco nem telefone no
                    site; ficam so com o nome, sem dado inventado. */}
                {u.address && <p className="mt-1 leading-relaxed">{u.address}</p>}
                {u.phone && (
                  <a
                    href={`tel:${u.phone.replace(/\D/g, '')}`}
                    className="mt-1 inline-block transition-colors hover:text-white"
                  >
                    {u.phone}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Coluna 4: Legais */}
        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#0ed8f6]">
            Institucional
          </h4>
          <ul className="space-y-2">
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
        <p className="text-xs text-ink-faint">2025 ©SISTRAN. Todos os direitos reservados.</p>
        {/* Caminho de volta permanente para a escolha feita na primeira visita. */}
        <MotionPreferenceTrigger className="text-xs text-ink-faint underline underline-offset-4 transition-colors hover:text-white" />
      </div>
    </footer>
  );
}
