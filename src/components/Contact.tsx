'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '@/lib/motion';
import PainelContato from './ContactPanel';

/**
 * Secao de contato da home. Antes ela era sobretitulo, titulo, paragrafo, dois
 * botoes e uma grade de unidades — e o formulario só existia atras de um clique
 * em "Deixe uma mensagem". Agora a secao é o proprio painel de "Fale com a
 * gente", que surge com a rolagem: a foto da sede, o telefone e o formulario
 * chegam sem intermediario.
 *
 * O painel é o MESMO componente do modal (`ContactPanel`), mostrado inline — e
 * nao o `<dialog>` aberto por conta propria. Abrir um modal sem clique prenderia
 * o foco e travaria a rolagem de quem estava apenas passando pela secao; o modal
 * continua existindo e continua sendo aberto pelo "Fale com a gente" do header.
 *
 * A secao é alta com o interior `sticky` — o mesmo padrao da cena dos
 * escritorios e do explorador 3D, e nao `pin: true`: pin remonta o no no DOM e
 * desalinha com o scroll suave do Lenis.
 *
 * O que muda por quadro viaja em variavel CSS escrita num ref, nao em estado:
 * nada aqui re-renderiza a 60 Hz.
 *
 * Nada disso é requisito para o contato funcionar. Sem JavaScript, abaixo de
 * 1024px ou com preferencia por menos movimento as variaveis nao existem, o CSS
 * usa 1 em todas e o painel aparece pronto, no fluxo normal da pagina.
 */

const clamp01 = (valor: number) => Math.min(1, Math.max(0, valor));

/* Partitura da rolagem. O painel chega de baixo e de longe durante o primeiro
   terco; o resto do percurso ele fica parado e legivel, tempo para ler o
   telefone e comecar a preencher. */
const SURGIR_FIM = 0.34;

export default function Contact() {
  const [dirigindo, setDirigindo] = useState(false);
  const trilhaRef = useRef<HTMLElement>(null);
  const palcoRef = useRef<HTMLDivElement>(null);

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
    const palco = palcoRef.current;
    if (!trilha || !palco) return;

    gsap.registerPlugin(ScrollTrigger);
    const gatilho = ScrollTrigger.create({
      trigger: trilha,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
      onUpdate: (self) => {
        palco.style.setProperty('--ct-surgir', String(clamp01(self.progress / SURGIR_FIM)));
        palco.style.setProperty('--ct-p', String(self.progress));
      },
    });

    const atualizar = () => ScrollTrigger.refresh();
    window.addEventListener('resize', atualizar);
    return () => {
      window.removeEventListener('resize', atualizar);
      gatilho.kill();
      for (const nome of ['--ct-surgir', '--ct-p']) palco.style.removeProperty(nome);
    };
  }, [dirigindo]);

  const modo = dirigindo ? 'scroll' : 'lista';

  return (
    <section
      id="contato"
      className="ct-trilha"
      data-modo={modo}
      aria-labelledby="contato-titulo"
      ref={trilhaRef}
    >
      <div className="ct-inner">
        <div className="ct-palco" data-modo={modo} ref={palcoRef}>
          {/* Veu que escurece o fundo conforme o painel chega: é o mesmo gesto
              do `::backdrop` do modal, mas sem tirar a pagina do caminho. */}
          <div aria-hidden className="ct-veu" />
          <div className="ct-painel contact-inline">
            <div className="contact-dialog-inner">
              <PainelContato
                eyebrow="SAIBA MAIS SOBRE O QUE PODEMOS OFERECER"
                title="Entre em contato conosco"
                description="Contacte-nos para saber que tipo de soluções podemos implementar para o seu negócio!"
                tituloId="contato-titulo"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
