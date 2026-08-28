'use client';

import { useState } from 'react';
import { motionPreferenceCopy } from '@/lib/motionPreference';
/* SIS-70 — este gatilho parece o candidato óbvio a `dynamic` (o diálogo só
   existe atrás de clique), e não é: o `MotionPreferenceIntro` está montado no
   layout RAIZ com import estático do MESMO módulo, então ele já está no pacote
   inicial de toda rota. `dynamic` aqui não removeria nada do primeiro
   carregamento — só acrescentaria um chunk e uma requisição para buscar código
   que já chegou. Ver a justificativa do import estático em
   `MotionPreferenceIntro.tsx`. */
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
