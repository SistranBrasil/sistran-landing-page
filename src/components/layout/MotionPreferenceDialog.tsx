'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  markMotionPromptSeen,
  motionPreferenceCopy as motionPreference,
  readMotionPreference,
  writeMotionPreference,
  type MotionPreference,
} from '@/lib/motionPreference';

type Props = {
  /** `intro`: primeira visita, sem Esc, só fecha escolhendo algo.
   *  `settings`: reaberto pelo rodapé, fecha como qualquer banner comum. */
  mode: 'intro' | 'settings';
  onClose: () => void;
};

/** Duração do slide, em ms — casa com `--dur-fast` de `globals.css`. */
const EXIT_MS = 260;

/**
 * Preferência de movimento num banner que sobe do rodapé da tela, como um
 * aviso de cookies: não modal, sem véu sobre o fundo, e a página continua
 * rolável e clicável por trás dele.
 *
 * O aviso de sensibilidade a movimento (`note`) e o título renderizam sempre,
 * fora de qualquer bloco condicional — têm que estar visíveis no estado padrão
 * do banner, antes de qualquer clique.
 */
export function MotionPreferenceDialog({ mode, onClose }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  /* Escrita em ref durante o render é proibida (era o erro de lint): num render
     descartado pelo React o valor vazaria para a arvore que ficou. */
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  /* Quem abriu o painel de preferencias, para devolver o foco ao fechar. O
     banner nao é modal, mas o foco entra nele de qualquer forma (efeito abaixo)
     e sem devolucao o Tab seguinte reiniciava do topo. */
  const gatilhoRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const ativo = document.activeElement;
    if (ativo instanceof HTMLElement) gatilhoRef.current = ativo;
    return () => {
      const gatilho = gatilhoRef.current;
      gatilhoRef.current = null;
      if (gatilho?.isConnected) gatilho.focus({ preventScroll: true });
    };
  }, []);

  const [montado, setMontado] = useState(false);
  useEffect(() => setMontado(true), []);

  // Sobe um quadro depois de montar: nasce fora da tela (`data-open` ausente)
  // e só depois ganha o atributo que dispara a transição de entrada.
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!montado) return;
    const frame = requestAnimationFrame(() => setOpen(true));
    return () => cancelAnimationFrame(frame);
  }, [montado]);

  const [selected, setSelected] = useState<MotionPreference>('full');
  useEffect(() => setSelected(readMotionPreference()), []);

  const [expanded, setExpanded] = useState(mode === 'settings');

  useEffect(() => {
    if (!montado) return;
    const primeiro = rootRef.current?.querySelector<HTMLElement>(
      mode === 'intro' ? '.motion-dialog-accept' : '.motion-dialog-close',
    );
    primeiro?.focus({ preventScroll: true });
  }, [montado, mode]);

  /** Desce o banner antes de desmontar — sem isso o fechamento seria um corte
   *  seco, sem a mesma cortesia visual da entrada. Sob movimento reduzido a
   *  transição já dura quase nada (reset global), então também não espera. */
  const dismiss = (after: () => void) => {
    setOpen(false);
    const reduced = document.documentElement.getAttribute('data-motion') === 'reduce';
    window.setTimeout(after, reduced ? 0 : EXIT_MS);
  };

  const finish = (next: MotionPreference) => {
    writeMotionPreference(next);
    if (mode === 'intro') markMotionPromptSeen();
    if (next === selected) {
      dismiss(onCloseRef.current);
      return;
    }
    // GSAP/ScrollTrigger e Lenis já mediram a página com a política antiga:
    // recarregar é o único jeito honesto de aplicar a nova.
    window.location.reload();
  };

  if (!montado) return null;

  return createPortal(
    <div
      ref={rootRef}
      className="motion-banner"
      role="dialog"
      aria-labelledby="motion-dialog-title"
      data-open={open}
    >
      <div className="motion-dialog-inner">
        <h2 id="motion-dialog-title" className="motion-dialog-title">
          {motionPreference.title}
        </h2>

        <p className="motion-dialog-note">{motionPreference.note}</p>

        {mode === 'intro' ? (
          <div className="motion-dialog-actions">
            <button
              type="button"
              className="motion-more-trigger"
              aria-expanded={expanded}
              aria-controls="motion-dialog-panel"
              onClick={() => setExpanded((value) => !value)}
            >
              {expanded ? motionPreference.fewerOptions : motionPreference.moreOptions}
            </button>
            <button
              type="button"
              className="motion-dialog-accept"
              onClick={() => finish('full')}
            >
              {motionPreference.accept}
            </button>
          </div>
        ) : null}

        <div className="motion-dialog-panel" id="motion-dialog-panel" data-open={expanded}>
          <div>
            <div className="motion-choices" role="radiogroup" aria-label={motionPreference.title}>
              {motionPreference.options.map((option) => (
                <label
                  key={option.id}
                  className="motion-choice"
                  data-checked={selected === option.id}
                >
                  <span className="motion-choice-head">
                    <input
                      type="radio"
                      name="motion-preference"
                      value={option.id}
                      checked={selected === option.id}
                      onChange={() => finish(option.id)}
                    />
                    <span className="motion-choice-label">{option.label}</span>
                  </span>
                  <span className="motion-choice-hint">{option.hint}</span>
                </label>
              ))}
            </div>

            <p className="motion-dialog-alternative-note">{motionPreference.alternativeNote}</p>

            {mode === 'settings' ? (
              <div className="motion-dialog-actions">
                <button
                  type="button"
                  className="motion-dialog-close"
                  onClick={() => dismiss(onCloseRef.current)}
                >
                  {motionPreference.close}
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
