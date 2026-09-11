'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { hasSeenMotionPrompt } from '@/lib/motionPreference';
/* SIS-70 — import estático DE PROPÓSITO, ao contrário do
   `MotionPreferenceTrigger`, que carrega o mesmo diálogo por `dynamic`.
   Lá o gatilho é um clique no rodapé; aqui ele abre sozinho na primeira visita,
   e é ele que decide se o site vai animar. Adiar por uma requisição significa
   que as animações começam antes de o visitante escolher — exatamente o que este
   prompt existe para evitar. O peso é o mesmo módulo que o rodapé já vai buscar;
   o custo de mantê-lo no pacote inicial é pago uma vez. */
import { MotionPreferenceDialog } from './MotionPreferenceDialog';

/**
 * Prompt de primeira visita para a preferência de movimento. Mora no layout,
 * não numa seção: é uma decisão de nível de página, separada da entrada de
 * configurações que vive no rodapé.
 */
export function MotionPreferenceIntro() {
  const [open, setOpen] = useState(false);
  const rota = usePathname();

  useEffect(() => {
    /* SIS-216 — não em `/admin`. O diálogo é `fixed` e modal, e no admin ele cai
       exatamente sobre a prévia e o botão de publicar imagem (visto em captura de
       navegador). Não há animação nenhuma no admin para o visitante consentir, e
       um "não" gravado ali valeria depois para o site inteiro sem que a pergunta
       tivesse a ver com o que estava na tela. */
    if (rota?.startsWith('/admin')) return;
    if (!hasSeenMotionPrompt()) setOpen(true);
  }, [rota]);

  if (!open) return null;

  return <MotionPreferenceDialog mode="intro" onClose={() => setOpen(false)} />;
}
