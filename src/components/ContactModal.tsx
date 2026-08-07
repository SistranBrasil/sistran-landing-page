'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X, Check } from 'lucide-react';

type Props = { open: boolean; onClose: () => void };

export default function ContactModal({ open, onClose }: Props) {
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) setSent(false);
  }, [open]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="contato-modal-titulo"
        >
          <div
            className="absolute inset-0 bg-[#001A3D]/80 backdrop-blur-md"
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="glass-card modal-scroll relative z-10 w-full max-w-lg overflow-y-auto p-8 max-h-[90vh]"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white hover:bg-white/10"
              aria-label="Fechar"
            >
              <X className="h-4 w-4" strokeWidth={1.8} />
            </button>

            {!sent ? (
              <>
                <h3 id="contato-modal-titulo" className="font-display text-2xl font-bold text-white">
                  Deixe uma mensagem
                </h3>
                <p className="mt-2 text-sm text-ink-muted">
                  Nossa equipe entrará em contato para conversar sobre seu desafio.
                </p>

                <form className="mt-6 space-y-4" onSubmit={onSubmit}>
                  <Field id="nome" label="Nome Completo" type="text" autoComplete="name" required />
                  <Field id="email" label="E-mail" type="email" autoComplete="email" required />
                  <Field id="telefone" label="Telefone" type="tel" autoComplete="tel" required />
                  <div>
                    <label htmlFor="mensagem" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-ink-muted">
                      Mensagem
                    </label>
                    <textarea
                      id="mensagem"
                      name="mensagem"
                      rows={4}
                      required
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/50 focus:border-[#0ed8f6]/60"
                    />
                  </div>
                  <button type="submit" className="btn-primary w-full">
                    Enviar
                  </button>
                </form>
              </>
            ) : (
              <div className="flex flex-col items-center py-6 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#34d399]/20 text-[#34d399]">
                  <Check className="h-7 w-7" strokeWidth={2} />
                </div>
                <h3 className="mt-4 font-display text-xl font-bold text-white">
                  Mensagem recebida
                </h3>
                <p className="mt-2 max-w-sm text-sm text-ink-muted">
                  Este formulário é uma demonstração. Nenhuma integração externa foi executada.
                </p>
                <button type="button" onClick={onClose} className="btn-ghost mt-6">
                  Fechar
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Field({
  id,
  label,
  type,
  autoComplete,
  required,
}: {
  id: string;
  label: string;
  type: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-xs font-semibold uppercase tracking-wider text-ink-muted">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        required={required}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/50 focus:border-[#0ed8f6]/60"
      />
    </div>
  );
}
