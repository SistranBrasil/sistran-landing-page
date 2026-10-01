'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Linkedin } from 'lucide-react';
import { useReducedMotion } from '@/lib/motion';
import { LINKEDIN_URL } from '@/data/contact';
import { enviarCurriculo } from '@/app/actions/curriculo';
import { EMAIL_CURRICULO } from '@/lib/curriculo-regras';
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
 * O telefone era `required`, como no formulário legado. A SIS-117 anotou que
 * exigir telefone reduz candidatura e que nada no site justificava a diferença em
 * relação a `/contato` (onde é opcional), e deixou a decisão para o RH. A SIS-246
 * decidiu: passou a OPCIONAL (ver a nota no campo).
 *
 * ── A SIS-246 FECHOU: O ENVIO TEM DESTINO ─────────────────────────────────────
 * Até aqui o `successNote` dizia que o envio era demonstração, e isso não era
 * conservadorismo de redação: era a condição para o campo de arquivo poder existir
 * nesta página, porque `enviarFormulario` não tinha destino e devolvia `sucesso`
 * sem ter enviado nada.
 *
 * Agora o formulário submete para `enviarCurriculo`
 * (`src/app/actions/curriculo.ts`), que envia os dados e o anexo por e-mail, confere
 * o arquivo no servidor e devolve `erro` quando o envio não sai. O cartão de
 * sucesso só aparece quando houve sucesso de verdade — é o que permitiu trocar os
 * textos sem a página virar promessa falsa.
 *
 * A regra que continua valendo: estes textos descrevem o que a action FAZ. Quem
 * mexer num dos dois lados mexe no outro no mesmo commit.
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
      /* SIS-246 — `required: true` SAIU daqui (decisão de 01/10/2026). A SIS-117
         havia anotado que exigir telefone reduz candidatura e que nada no site
         justificava a diferença em relação a `/contato`, onde o campo é opcional;
         a observação esperava decisão de RH, e a decisão veio: telefone opcional.
         O rótulo e o placeholder não mudam, e `enviarCurriculo` inclui o número no
         e-mail quando ele vem — o que o campo deixou de fazer é reprovar o envio
         quando não vem. */
      {
        kind: 'input',
        id: 'telefone',
        label: 'Telefone',
        type: 'tel',
        autoComplete: 'tel',
        placeholder: '(11) 96123-4567',
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
            /* SIS-246 — O DESTINO PASSOU A EXISTIR. `enviarCurriculo` envia os
               dados e o anexo por e-mail à equipe, confere o arquivo no servidor e
               devolve `erro` quando o envio não sai. É por isso que os dois textos
               abaixo puderam deixar de dizer «demonstração»: o cartão de sucesso só
               aparece com `status: 'sucesso'`, e o sucesso deixou de ser
               incondicional — antes ele era devolvido mesmo sem nada ter sido
               enviado, que era o defeito que esta issue abriu. */
            action={enviarCurriculo}
            successNote={
              <>
                Recebemos seu currículo e ele já está com a nossa equipe. Se o seu perfil encaixar
                em alguma oportunidade, entramos em contato pelo e-mail que você informou.
                Guardamos seus dados por até 6 meses; para pedir acesso ou exclusão, escreva para{' '}
                {EMAIL_CURRICULO}.
              </>
            }
            /* SIS-246 — O `privacyNote` NUNCA FOI PASSADO, e esta é a correção.
               O docblock no topo deste arquivo, o do `DemoForm` e o relatório da
               SIS-223 todos afirmavam que os DOIS textos declaravam a situação do
               envio; só o `successNote` estava aqui. Consequência: o único aviso
               antes do envio vivia num cartão IRMÃO (`trabalhe-conosco/page.tsx`),
               que pode nem estar na tela quando a pessoa anexa o PDF — ou seja, no
               ponto da coleta não havia aviso nenhum.
               Com base legal de legítimo interesse isso deixa de ser detalhe: é a
               contrapartida que a LGPD cobra por não pedir consentimento, e tem de
               estar visível onde a coleta acontece. O `DemoForm` já sabia
               renderizá-lo — faltava passar. */
            privacyNote={
              <>
                Seus dados e seu arquivo são enviados por e-mail à nossa equipe e usados apenas
                para avaliar sua candidatura, com base no legítimo interesse de recrutamento.
                Guardamos por até 6 meses e descartamos depois. Para acessar, corrigir ou excluir o
                que enviou, escreva para {EMAIL_CURRICULO}.
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
