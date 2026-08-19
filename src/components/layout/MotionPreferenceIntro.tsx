'use client';

import { useEffect, useState } from 'react';
import { hasSeenMotionPrompt } from '@/lib/motionPreference';
import { MotionPreferenceDialog } from './MotionPreferenceDialog';

/**
 * Prompt de primeira visita para a preferência de movimento. Mora no layout,
 * não numa seção: é uma decisão de nível de página, separada da entrada de
 * configurações que vive no rodapé.
 */
export function MotionPreferenceIntro() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!hasSeenMotionPrompt()) setOpen(true);
  }, []);

  if (!open) return null;

  return <MotionPreferenceDialog mode="intro" onClose={() => setOpen(false)} />;
}
