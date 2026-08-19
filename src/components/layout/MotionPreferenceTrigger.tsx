'use client';

import { useState } from 'react';
import { motionPreferenceCopy } from '@/lib/motionPreference';
import { MotionPreferenceDialog } from './MotionPreferenceDialog';

/**
 * Reabre o banner em modo `settings`. Vai no rodapé: a escolha da primeira
 * visita precisa ter um caminho de volta permanente, senão vira decisão única
 * e irreversível.
 */
export function MotionPreferenceTrigger({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" className={className} onClick={() => setOpen(true)}>
        {motionPreferenceCopy.footerTrigger}
      </button>
      {open ? <MotionPreferenceDialog mode="settings" onClose={() => setOpen(false)} /> : null}
    </>
  );
}
