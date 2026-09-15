'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Linkedin } from 'lucide-react';
import { useReducedMotion } from '@/lib/motion';
import { LINKEDIN_URL } from '@/data/contact';
import DemoForm, { type DemoField } from './forms/DemoForm';
import './curriculo-card.css';

/**
 * SIS-223 · o card de currículo de `/trabalhe-conosco`, e a entrada dele na
 * rolagem.
 *
 * ── Os campos ─────────────────────────────────────────────────────────────────
 * São os do conteúdo-site (`.claude/conteudo-site/08-trabalhe-conosco.md`), com
 * duas decisões registradas:
 *
 * • «Nome Completo» é UM campo, não o `name-pair` Nome+Sobrenome do WPForms
 *   legado. É o que a issue pede explicitamente ("preferir paridade com
 *   Contato: um campo"), e `/contato` tem um campo só com esse mesmo rótulo.
 * • O campo «Layout» do site legado NÃO existe aqui. É rótulo vazado do editor
 *   WPForms — o próprio conteúdo-site o marca com ⚠️. Reproduzi-lo seria copiar
 *   um defeito como se fosse conteúdo.
 *
 * O telefone continua `required`, como no formulário legado. A SIS-117 havia
 * anotado que exigir telefone reduz candidatura e que nada no site justifica a
 * diferença em relação a `/contato` (onde é opcional) — a observação continua
 * válida e continua sendo decisão de RH, não desta issue: aqui o rótulo e a
 * obrigatoriedade seguem o conteúdo-site, que é o que está travado no copy-lock.
 *
 * ── ANTES DE AFROUXAR OS TEXTOS ABAIXO, LEIA A SIS-246 ────────────────────────
 * O `successNote` e o `privacyNote` desta seção dizem que o envio é demonstração
 * porque `enviarFormulario` não tem destino (ver `src/app/actions/contato.ts`).
 * Isso NÃO é conservadorismo de redação: é a condição para o campo de arquivo
 * poder existir nesta página. A SIS-246 está no backlog com o ponto aberto —
 * destino do currículo, quem recebe, base legal, prazo de guarda. Enquanto ela
 * não fechar, trocar estas frases por algo que insinue que o currículo chegou a
 * alguém transforma a página em promessa falsa num commit.
 *
 * ── Por que a entrada é GSAP e não `data-reveal` ──────────────────────────────
 * `useRevealTrigger` (IntersectionObserver + CSS) resolve "acendeu/apagou" por
 * seção, e `SectionReveal` resolve fade-up com blur em cascata. O gesto pedido
 * aqui é uma CORTINA: o card se desenha de cima para baixo por `clip-path`, com
 * uma linha ciano correndo à frente do recorte, e os campos entrando atrás dela
 * em cascata. São três alvos com tempos encaixados num relógio só — que é
 * exatamente o que uma timeline é, e o que uma marca booleana em CSS não
 * consegue coordenar sem virar quatro `transition-delay` escritos à mão.
 *
 * Sem `pin`: a casa não usa (remonta o nó no DOM e desalinha com o scroll suave
 * do Lenis), e a issue diz que não precisa.
 *
 * ── O que acontece sem JavaScript, ou com movimento reduzido ──────────────────
 * O card aparece pronto. O estado escondido é escrito pela TIMELINE, nunca pelo
 * CSS nem pelo render — então o HTML do servidor já sai legível, e a árvore é a
 * mesma no servidor e no primeiro render do cliente (`rm` não decide quais nós
 * existem, apenas se a timeline é criada).
 */

/* O texto do campo de arquivo é o do site legado, palavra por palavra. É ele que
   promete a ÁREA que aceita arrastar — ver `CampoArquivo` em `DemoForm.tsx`. */
const CAMPOS: readonly DemoField[] = [
  {
    kind: 'row',
    id: 'contato',
    fields: [
      {
        kind: 'input',
        id: 'nome',
        label: 'Nome completo',
        type: 'text',
        autoComplete: 'name',
        placeholder: 'Seu nome completo',
        required: true,
      },
      { kind: 'input', id: 'email', label: 'E-mail', type: 'email', autoComplete: 'email', required: true },
      {
        kind: 'input',
        id: 'telefone',
        label: 'Telefone',
        type: 'tel',
        autoComplete: 'tel',
        placeholder: '(11) 96123-4567',
        required: true,
      },
    ],
  },
  {
    kind: 'file',
    id: 'curriculo',
    label: 'Envio de arquivo',
    hint: 'Arraste seu arquivo ou selecione um arquivo.',
    required: true,
  },
];

export default function CurriculoCard() {
  const secaoRef = useRef<HTMLDivElement>(null);
  const rm = useReducedMotion();

  useEffect(() => {
    /* A preferência é a PORTA do efeito, e não um desvio dentro dele: com
       movimento reduzido a timeline não existe, ninguém esconde nada e o card
       fica no estado final. Trocar a escolha na própria página recria o efeito,
       porque `rm` é dependência. */
    if (rm) return;
    const raiz = secaoRef.current;
    if (!raiz) return;

    gsap.registerPlugin(ScrollTrigger);

    const card = raiz.querySelector<HTMLElement>('.cv-card');
    if (!card) return;
    /* Os filhos diretos do `<form>` mais o cabeçalho: cada bloco entra atrás da
       cortina. Consultado no DOM em vez de marcado com `data-*` no `DemoForm` de
       propósito — o formulário serve outras rotas e não deve carregar o gancho
       de animação de uma delas. */
    const linhas = raiz.querySelectorAll<HTMLElement>('.cv-escrita > *, .cv-card form > *');

    let revelado = false;
    const mostrarJa = () => {
      if (revelado) return;
      revelado = true;
      gsap.set([card, ...linhas], { clearProps: 'all' });
    };

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: raiz,
          start: 'top 82%',
          toggleActions: 'play none none reverse',
          onEnter: () => {
            revelado = true;
          },
        },
      });

      /* A cortina. `clip-path: inset()` nas duas pontas (mesma função, mesmo
         número de valores) — interpolar `inset` com `circle` não anima, e o
         `round` tem de aparecer nos dois lados senão o card perde o raio no meio
         do caminho. */
      tl.from(card, {
        clipPath: 'inset(0% 0% 100% 0% round 1.25rem)',
        y: 42,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        /* `clearProps` no fim: o `clip-path` inline sobrando recortaria a bolha
           de validação nativa e o menu do seletor de arquivos. */
        clearProps: 'clipPath,opacity,transform',
      });

      /* A linha ciano corre à frente do recorte. Quem viaja é uma camada da
         ALTURA DO CARD, com a linha desenhada na borda de baixo dela: assim
         `yPercent: -100 → 0` leva a linha do topo à base do card, e a distância
         acompanha a altura sem nenhuma medição em JS. */
      tl.fromTo(
        raiz.querySelectorAll<HTMLElement>('.cv-varredura'),
        { yPercent: -100, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.9, ease: 'power3.out' },
        0,
      );
      tl.to(raiz.querySelectorAll<HTMLElement>('.cv-varredura'), {
        opacity: 0,
        duration: 0.3,
        ease: 'power1.in',
      });

      /* Os campos entram atrás da cortina, não junto com ela: `0.28` é o ponto em
         que o recorte já passou do cabeçalho. */
      tl.from(
        linhas,
        {
          y: 18,
          opacity: 0,
          duration: 0.55,
          ease: 'power2.out',
          stagger: 0.07,
          clearProps: 'opacity,transform',
        },
        0.28,
      );

      /* Alguém já está preenchendo: a cena termina AGORA. Foco num campo faz o
         navegador rolar para trazê-lo à vista, e rolagem move o gatilho — sem
         esta trava, tabular para o formulário durante a entrada mexeria o card
         debaixo do cursor. É a mesma trava por `focusin` da seção de contato da
         home (`Contact.tsx`), e pelo mesmo motivo.
         `focusin` e não `focus`: eventos de foco não borbulham, `focusin` sim,
         então um ouvinte cobre todos os campos, presentes e futuros. */
      const travar = () => {
        tl.progress(1);
        tl.scrollTrigger?.kill();
      };
      raiz.addEventListener('focusin', travar);
      return () => raiz.removeEventListener('focusin', travar);
    }, raiz);

    /* Rede de segurança, igual à do `SectionReveal`: a timeline deixa o card em
       `opacity: 0`. Se o gatilho não medir a posição certa (reflow de fonte,
       ancestral com `overflow`, erro de JS), o card ficaria invisível para
       sempre — e aqui o invisível seria o formulário inteiro. */
    const io = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (!e.isIntersecting) continue;
          window.setTimeout(() => {
            if (!revelado) mostrarJa();
          }, 600);
        }
      },
      { threshold: 0.01 },
    );
    io.observe(raiz);

    return () => {
      io.disconnect();
      ctx.revert();
    };
  }, [rm]);

  return (
    <section
      id="curriculo"
      aria-labelledby="curriculo-titulo"
      className="cv-secao scroll-mt-32"
      ref={secaoRef}
    >
      {/* O brilho fica FORA do card: dentro dele o `clip-path` da cortina o
          recortaria junto, e o halo é o que dá profundidade à chegada. */}
      <div aria-hidden className="cv-brilho" />
      <div className="cv-trilha">
        <div className="cv-card">
          <span aria-hidden className="cv-varredura-caixa">
            <span className="cv-varredura" />
          </span>
          <div className="cv-escrita">
          <h2 id="curriculo-titulo" className="cv-titulo font-bold">
            Trabalhe conosco
          </h2>
        </div>

          <DemoForm
            fields={CAMPOS}
            className="cv-form space-y-4"
            /* A frase do sucesso não pode dizer que o currículo chegou ao RH,
               porque `enviarFormulario` não tem destino (ver o cabeçalho de
               `src/app/actions/contato.ts`). Diz o que de fato aconteceu e para
               onde ir enquanto o destino real não existir. */
            successNote={
              <>
                Este formulário é uma demonstração: nenhuma integração externa foi executada e o
                seu arquivo não foi encaminhado ao RH. Para se candidatar de verdade hoje, use o
                nosso LinkedIn.
              </>
            }
          />
          <div className="cv-divisor" aria-hidden>
            <span />
            <small>ou</small>
            <span />
          </div>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="cv-linkedin"
          >
            <Linkedin aria-hidden />
            Ver oportunidades no LinkedIn
            <ArrowRight aria-hidden />
          </a>
        </div>
      </div>
    </section>
  );
}
