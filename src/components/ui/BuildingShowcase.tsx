'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '@/lib/motion';
import type { BuildingModel, ExplorerApi } from './BuildingExplorer';

/**
 * Moldura do explorador 3D: seletor de modelo, cartao de local, rotulo vertical
 * e o numero de anos de mercado que ja existe no site.
 *
 * Do material entregue veio só o explorador. O hero que o acompanhava trazia
 * cabecalho, rodape, CTAs e metricas proprias — nada disso entra aqui, porque a
 * pagina ja tem cabecalho, rodape, CTA e seus proprios numeros, e aquelas
 * metricas nao estao confirmadas pelo dono do conteudo.
 *
 * O `three` (~600 kB) só é baixado quando a secao chega perto da viewport: o
 * `dynamic` corta o pacote da rota e o IntersectionObserver decide o momento.
 *
 * A secao é alta com o interior `sticky`, o mesmo arranjo da secao de
 * diferenciais, em vez de `pin: true`: pin remonta o no no DOM e desalinha com
 * o scroll suave do Lenis.
 * A rolagem dentro dela dirige duas fases — primeiro o edificio se monta modulo
 * por modulo, depois a camera da a volta.
 */

const BuildingExplorer = dynamic(
  () => import('./BuildingExplorer').then((m) => m.BuildingExplorer),
  { ssr: false },
);

export default function BuildingShowcase() {
  const [modelo, setModelo] = useState<BuildingModel>('tower');
  const [visivel, setVisivel] = useState(false);
  const [dirigindo, setDirigindo] = useState(false);
  const trilhaRef = useRef<HTMLDivElement>(null);
  const palcoRef = useRef<HTMLDivElement>(null);
  const explorerRef = useRef<ExplorerApi | null>(null);
  /* O progresso vive num ref, e nao em estado: trocar de modelo no meio da
     secao precisa recompor o predio no ponto onde a rolagem esta, e ninguem
     precisa de re-render por quadro de scroll. */
  const progressoRef = useRef(0);

  useEffect(() => {
    const palco = palcoRef.current;
    if (!palco || visivel) return;
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return;
        observador.disconnect();
        setVisivel(true);
      },
      { rootMargin: '300px' },
    );
    observador.observe(palco);
    return () => observador.disconnect();
  }, [visivel]);

  /* A rolagem só dirige a cena em telas largas e com movimento permitido. Em
     telas estreitas a secao alta com sticky competiria com a barra de endereco
     do navegador, e com preferencia por menos movimento nao ha coreografia
     alguma: nos dois casos o predio aparece completo e os botoes seguem sendo o
     caminho para girar. */
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const avaliar = () => setDirigindo(mq.matches && !prefersReducedMotion());
    avaliar();
    mq.addEventListener('change', avaliar);
    return () => mq.removeEventListener('change', avaliar);
  }, []);

  useEffect(() => {
    if (!dirigindo) return;
    const trilha = trilhaRef.current;
    if (!trilha) return;

    gsap.registerPlugin(ScrollTrigger);
    const gatilho = ScrollTrigger.create({
      trigger: trilha,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
      onUpdate: (self) => {
        progressoRef.current = self.progress;
        explorerRef.current?.setProgress(self.progress);
      },
    });

    const atualizar = () => ScrollTrigger.refresh();
    window.addEventListener('resize', atualizar);
    return () => {
      window.removeEventListener('resize', atualizar);
      gatilho.kill();
    };
  }, [dirigindo]);

  const torre = modelo === 'tower';

  return (
    <div className={dirigindo ? 'building-scroll' : undefined} ref={trilhaRef}>
      <div className="building-scroll-inner">
        <div className="building-stage" ref={palcoRef}>
          <div className="model-switch" aria-label="Selecionar modelo tridimensional">
            <button
              type="button"
              className={torre ? 'active' : ''}
              aria-pressed={torre}
              onClick={() => setModelo('tower')}
            >
              <span>01</span>
              Torre River Park
            </button>
            <button
              type="button"
              className={torre ? '' : 'active'}
              aria-pressed={!torre}
              onClick={() => setModelo('campus')}
            >
              <span>02</span>
              Complexo Modular
            </button>
          </div>

          {/* O espaco da cena é reservado pelo CSS, entao a chegada do 3D nao
              empurra nada da pagina. */}
          {visivel ? (
            <BuildingExplorer
              model={modelo}
              apiRef={dirigindo ? explorerRef : undefined}
              progressRef={progressoRef}
            />
          ) : (
            <div className="three-explorer-shell" />
          )}

          <div className="location-card">
            <span className="location-pulse" aria-hidden="true" />
            <div>
              <small>{torre ? 'Torre 360°' : 'Composição 360°'}</small>
              <strong>
                {torre ? 'River Park · Cidade Monções' : 'Complexo modular · Estudo conceitual'}
              </strong>
            </div>
            <span className="location-code">BR · 23°33′S</span>
          </div>

          <div className="vertical-label" aria-hidden="true">
            {torre ? 'SISTRAN · RIVER PARK' : 'SISTRAN · MODULAR CAMPUS'}
          </div>

          <aside className="building-stat">
            <span className="stat-value">35+</span>
            <span className="stat-label">Anos de mercado</span>
          </aside>
        </div>
      </div>
    </div>
  );
}
