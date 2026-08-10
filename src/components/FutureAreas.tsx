import { FUTURE_AREAS } from '@/data/futureAreas';

/**
 * Âncoras das áreas futuras.
 *
 * O card visível "Em breve / Novas áreas em construção" foi removido, mas os
 * âncoras seguem necessários: NAV_LINKS aponta para `/#esg` e
 * `/#trabalhe-conosco` (src/data/nav.ts) e o ScrollSpy observa esses ids.
 * Sem eles, os links da navbar não levariam a lugar nenhum.
 */
export default function FutureAreas() {
  return (
    <>
      {FUTURE_AREAS.map((a) => (
        <span key={`anchor-${a.id}`} id={a.id} className="block h-0" aria-hidden />
      ))}
    </>
  );
}
