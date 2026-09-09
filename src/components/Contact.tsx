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

/**
 * Orquestração visual, Prioridade 5 — DEPOIS DE CHEGAR, O PAINEL NÃO SE MEXE.
 *
 * `--ct-p` era o progresso cru da seção inteira, e o CSS o usa em `translate3d` e
 * `rotate` (ver `.ct-painel` em `globals.css`). Consequência: o painel continuava
 * derivando e girando durante todo o percurso — inclusive DEPOIS de o formulário
 * estar disponível. E como o navegador rola a página para trazer um campo em foco
 * à vista, clicar ou tabular para um campo mexia a rolagem, a rolagem mexia
 * `--ct-p`, e `--ct-p` mexia o painel: o campo escapava por baixo do cursor.
 *
 * Agora `--ct-p` satura em `SURGIR_FIM`. O trecho de chegada continua idêntico;
 * o que acaba é o movimento residual do resto do curso. A rolagem conduzida
 * termina exatamente onde o formulário fica utilizável, que é a exigência.
 */
const clamparChegada = (p: number) => (p > SURGIR_FIM ? SURGIR_FIM : p);

/**
 * SIS-103 — onde o percurso COMEÇA a ser medido.
 *
 * Era `start: 'top top'`: a chegada do painel só começava quando o topo da seção
 * encostava no topo da janela, ou seja, com a seção já ocupando a tela inteira.
 * Como o painel nasce em `opacity: 0` e 12vh abaixo, o que se via nesse momento
 * era uma TELA CLARA VAZIA — a faixa longa e sem conteúdo descrita na issue. Não
 * era espaçamento sobrando: era o começo do percurso caindo depois da emenda.
 *
 * Agora o relógio abre com o topo da seção a 60% da altura da janela, ou seja,
 * enquanto a seção ainda está SUBINDO. Nesse trecho o `.ct-inner` não colou (o
 * `sticky` só vale a partir do topo da trilha), então o painel acompanha o topo
 * da seção e entra por baixo, enquanto a montagem do Luminna — já encolhida em
 * card — sai por cima. É a sobreposição que a issue pede, o painel visível antes
 * de o Luminna sair de cena, e ela não custa nada: é o fluxo normal dos dois
 * blocos, sem `pin`, sem margem negativa e sem um segundo gatilho.
 *
 * A conta, com a trilha em 110svh: o curso vai de "topo a 60% da janela" até
 * "base da trilha na base da janela", ou seja ~70% de tela. A chegada
 * (`SURGIR_FIM`, 34% do curso) consome ~24% e termina com o topo da seção a ~36%
 * da janela — o painel está inteiro e com cerca de dois terços dele na tela.
 *
 * O valor é em porcentagem da JANELA, e não em pixels, de propósito: a decisão de
 * dirigir a seção já depende da altura (`RESERVA_CABECALHO`), e uma âncora em px
 * mudaria de significado entre um 1366×768 e um 1920×1080.
 */
const INICIO = 'top 60%';

/**
 * SIS-88 — quanto de tela o modo dirigido NÃO pode usar: o cabeçalho fixo (88px
 * de pílula, 16px de folga do topo) mais um respiro. O mesmo valor está no
 * `padding` do `.ct-inner` em `globals.css`; aqui ele decide se a seção pode ser
 * dirigida pela rolagem, lá ele reserva o espaço.
 */
const RESERVA_CABECALHO = 88 + 48;

export default function Contact() {
  const [dirigindo, setDirigindo] = useState(false);
  const trilhaRef = useRef<HTMLElement>(null);
  const painelRef = useRef<HTMLDivElement>(null);
  /* Ref, e não estado: virar `true` não deve re-renderizar a seção — e muito
     menos o formulário, que a essa altura tem texto digitado dentro. */
  const travadoRef = useRef(false);

  /**
   * SIS-88 — a rolagem só dirige a seção se o painel COUBER na tela abaixo do
   * cabeçalho. A condição antiga era só `min-width: 1024px`, e a largura não diz
   * nada sobre a altura: medido, o painel mede 866px num 1366×768 e 877px num
   * 1440×900, contra 632px e 764px de tela útil. O palco tem `overflow: clip`,
   * então o que não cabia era CORTADO — o sobretítulo e "Entre em" ficavam atrás
   * da pílula do header e o card "SEDE · SÃO PAULO" era cortado na base.
   *
   * Não cabendo, a seção fica no modo lista: painel inteiro, no fluxo normal da
   * página, sem nada recortado. É o mesmo caminho que já servia o celular e o
   * movimento reduzido — não há código novo para manter.
   *
   * `offsetHeight` e não `getBoundingClientRect`: no modo dirigido o painel está
   * sob `scale()`, e o retângulo já vem multiplicado. O layout não muda entre os
   * dois modos (mesma largura de container), então a medida é estável e a
   * decisão não oscila.
   */
  useEffect(() => {
    const avaliar = () => {
      const painel = painelRef.current;
      if (!painel || !window.matchMedia('(min-width: 1024px)').matches) {
        setDirigindo(false);
        return;
      }
      if (prefersReducedMotion()) {
        setDirigindo(false);
        return;
      }
      setDirigindo(painel.offsetHeight + RESERVA_CABECALHO <= window.innerHeight);
    };
    avaliar();

    const observador = new ResizeObserver(avaliar);
    if (painelRef.current) observador.observe(painelRef.current);
    window.addEventListener('resize', avaliar);
    return () => {
      observador.disconnect();
      window.removeEventListener('resize', avaliar);
    };
  }, []);

  useEffect(() => {
    if (!dirigindo) return;
    const trilha = trilhaRef.current;
    if (!trilha) return;

    gsap.registerPlugin(ScrollTrigger);
    const gatilho = ScrollTrigger.create({
      trigger: trilha,
      start: INICIO,
      end: 'bottom bottom',
      scrub: 1,
      onUpdate: (self) => {
        /* SIS-103 — as duas variáveis passaram a ser escritas na TRILHA, e não no
           palco. Nada muda para quem as consome: o palco é descendente da
           trilha, e propriedade customizada herda — o véu, o painel, a foto e o
           corpo continuam lendo os mesmos nomes pelos mesmos seletores.

           O que a mudança habilita é a linha-sinal ciano: ela é pseudo-elemento
           da TRILHA (precisa nascer acima da borda da seção, no território da
           montagem do Luminna, e o palco fica dentro do `.ct-inner`, que tem
           `overflow: clip` e a recortaria). Um pseudo só lê variável do próprio
           elemento ou herdada — do palco, que é filho, ele nunca leria.

           Continua sendo UM `setProperty` por quadro por variável, no mesmo
           `onUpdate`: nenhuma escrita nova entrou. */
        /* Trava definitiva: alguém está usando o formulário. Nenhum quadro mais,
           nem se a rolagem andar — validação que expande uma mensagem de erro,
           teclado virtual, `scrollIntoView` do navegador ao tabular para o botão
           de envio, tudo isso move a rolagem, e nada disso pode mover o painel.
           A trava não se desfaz ao sair do campo: quem já interagiu não deve ver
           o painel voltar a andar depois. */
        if (travadoRef.current) return;
        trilha.style.setProperty('--ct-surgir', String(clamp01(self.progress / SURGIR_FIM)));
        trilha.style.setProperty('--ct-p', String(clamparChegada(self.progress)));
      },
    });

    /* `focusin`, e não `focus`: eventos de foco não borbulham, `focusin` sim —
       um ouvinte na seção cobre todos os campos, o `select`, o checkbox de
       consentimento e o botão de envio, presentes ou futuros. */
    const travar = () => {
      if (travadoRef.current) return;
      travadoRef.current = true;
      trilha.style.setProperty('--ct-surgir', '1');
      trilha.style.setProperty('--ct-p', String(SURGIR_FIM));
    };
    trilha.addEventListener('focusin', travar);

    const atualizar = () => ScrollTrigger.refresh();
    window.addEventListener('resize', atualizar);
    return () => {
      trilha.removeEventListener('focusin', travar);
      window.removeEventListener('resize', atualizar);
      gatilho.kill();
      for (const nome of ['--ct-surgir', '--ct-p']) trilha.style.removeProperty(nome);
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
        {/* SIS-103 — o `ref` daqui saiu: as variáveis de progresso passaram a ser
            escritas na trilha (ver a nota no `onUpdate`). O nó continua, porque é
            ele que carrega o `data-modo` que liga o véu e o modo dirigido do
            painel. */}
        <div className="ct-palco" data-modo={modo}>
          {/* Veu que escurece o fundo conforme o painel chega: é o mesmo gesto
              do `::backdrop` do modal, mas sem tirar a pagina do caminho. */}
          <div aria-hidden className="ct-veu" />
          <div className="ct-painel contact-inline" ref={painelRef}>
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
