'use client';

/**
 * Metrics — "Sistran em números" como scrollytelling horizontal.
 *
 * A rolagem é vertical, como no resto do site; o que anda na horizontal é a
 * trilha, empurrada por `transform` para deixar o indicador da vez no centro da
 * tela. Nunca há barra de rolagem horizontal.
 *
 * ── SIS-73: agora há clique, e continua não sendo carrossel ──────────────────
 * Até aqui esta nota dizia "não há clique: não é carrossel". A segunda metade
 * segue verdadeira; a primeira mudou, e a distinção é o ponto todo.
 *
 * Os sete indicadores só eram alcançáveis rolando a trilha inteira (520vh na
 * época; 340vh depois da orquestração visual) — quem queria o quarto número
 * rolava várias telas, e por teclado a cena era inalcançável. A faixa de atalhos
 * no pé do palco resolve os dois, e depois da Prioridade 2 ela é um dos DOIS
 * canais de progresso que restaram, junto com o `03 / 07` em texto: o trilho de
 * pontos e a régua do pé do palco saíram (notas nos respectivos lugares).
 *
 * O que a mantém fora da categoria "carrossel" é o que o clique NÃO faz: ele não
 * escolhe o indicador. O índice ativo continua saindo de um lugar só — o
 * progresso do único ScrollTrigger da seção. O botão apenas leva a ROLAGEM até a
 * altura em que aquele indicador é o da vez, e o gatilho reage a isso exatamente
 * como reagiria à roda do mouse. Um `setAtivo(i)` no `onClick` seria sobrescrito
 * no quadro seguinte pelo `onUpdate`; por isso não existe estado novo aqui, e
 * depois de clicar a rolagem segue do ponto onde parou, sem salto.
 *
 * Desenho da seção, de cima para baixo: uma faixa clara com o sobretítulo, o
 * título e o marcador `03 / 07`; abaixo dela o palco escuro, separado por uma
 * curva larga (não um corte reto); dentro do palco, uma única curva que passa
 * pelos sete indicadores, e o indicador ativo é a própria lente — anéis
 * incompletos, número monumental e um componente contextual.
 *
 * ── Como o progresso é calculado ────────────────────────────────────────────
 * Um ScrollTrigger só, `scrub: 1`, do topo ao fim da seção alta (padrão da casa:
 * seção alta + interior `sticky`, nunca `pin: true`, que remonta o nó e
 * desalinha com o Lenis). Do progresso saem variáveis CSS escritas no nó do
 * palco — nunca estado React, que a 60 Hz re-renderizaria a seção inteira. O
 * único estado é o índice ativo, que muda sete vezes no percurso todo.
 *
 * ── Estado final é o default ────────────────────────────────────────────────
 * Sem JavaScript, abaixo de 1024px ou com movimento reduzido a seção é a lista
 * completa dos sete indicadores, com os valores finais no HTML. O CSS do
 * scrollytelling vive todo atrás de `[data-dirigindo]`, atributo que só o
 * JavaScript escreve: não existe estado em que a seção fique presa sem quem a
 * dirija.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { animate } from 'motion/react';
import { METRICS } from '@/data/metrics';
import { prefersReducedMotion } from '@/lib/motion';
import ImpactVisual from '@/components/ui/impact/ImpactVisuais';
import {
  DESVIOS_TRILHO,
  coord,
  criarOnda,
  criarPlano,
  pontoNaOnda,
  vaoEntreEtapas,
} from '@/components/ui/impact/geometria';

const TOTAL = METRICS.length;

/* ── Partitura ──────────────────────────────────────────────────────────────
   Fracoes do percurso da secao. Numeros com nome, nunca soltos no meio do
   codigo. */
/** Entrada: a curva escura sobe, a grade aparece, o primeiro trecho se desenha. */
const ENTRADA_FIM = 0.14;
/** Trecho em que os sete indicadores se sucedem. Sobra folga no fim para o
    estado de conclusao (path todo aceso, `07 / 07`) antes de liberar a rolagem. */
const ETAPAS_INICIO = 0.16;
const ETAPAS_FIM = 0.94;
/** O pulso aparece no meio da passagem entre dois indicadores e some ao chegar. */
const PULSO_SUBIDA = 0.2;
/** Trecho final em que a onda perde amplitude e vira a linha-base horizontal que
    entrega a narrativa aos parceiros (orquestração visual, Prioridade 1). Começa
    em `ETAPAS_FIM`: o sétimo indicador já é o da vez, `07 / 07` está na tela, e o
    que resta do percurso é a passagem — não sobra tempo morto entre as duas
    coisas, que era o "reset visual" a evitar. */
const ATERRAR_INICIO = ETAPAS_FIM;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const doisDigitos = (n: number) => String(n).padStart(2, '0');

/* Medida usada no servidor e ate a primeira medicao do cliente. Nao é chute
   cosmetico: o modo dirigido so existe a partir de 1024px e com JavaScript, e o
   HTML do servidor é sempre o modo lista — em que a geometria da curva nao
   aparece. Ter valores fixos aqui garante que servidor e cliente rendam
   exatamente o mesmo `d`, sem aviso de hidratacao. */
const MEDIDA_PADRAO = { larguraTela: 1440, alturaPalco: 620 };

/** Fracao da altura do palco onde fica a linha-base da curva e o centro da lente. */
const LINHA_BASE = 0.55;

/**
 * Contador do indicador.
 *
 * O `CountUp` do projeto nao serve aqui, e a razao é concreta: ele dispara por
 * `useInView`, e nesta secao a trilha é mais larga que a tela — os sete numeros
 * estao TODOS dentro da viewport ao mesmo tempo, entao todos contariam juntos no
 * primeiro quadro. O gatilho certo aqui é "virou o indicador ativo".
 *
 * O numero final é filho REAL do span: é isso que o servidor renderiza, e é o
 * que fica na tela sem JavaScript ou com movimento reduzido. A contagem so
 * acontece quando o indicador fica ativo, e uma unica vez — voltar e reavancar a
 * rolagem nao reinicia o numero.
 *
 * A contagem escreve `textContent` por ref em vez de passar um MotionValue como
 * filho de `motion.span`. Nao é preferencia de estilo: com o MotionValue como
 * filho, o texto do servidor e o do cliente se somavam na hidratacao e o span
 * ficava com o numero DUAS vezes ("850850"); como ele tem largura reservada e
 * `line-height: 0.95`, o excedente quebrava linha e as duas linhas se
 * sobrepunham. Por ref nao ha texto vindo de dois lugares.
 */
function ImpactNumero({ valor, ativo }: { valor: number; ativo: boolean }) {
  const alvo = useRef<HTMLSpanElement>(null);
  const jaContou = useRef(false);

  useEffect(() => {
    if (!ativo || jaContou.current) return;
    jaContou.current = true;
    if (prefersReducedMotion()) return;
    const no = alvo.current;
    if (!no) return;
    /* SIS-72: era `duration: 1.1` com `ease: [0.22, 1, 0.36, 1]`. Aquela curva
       desacelera forte, mas é MONOTONA — o numero nunca passa do alvo. O pedido
       ("contagem rapida e desaceleracao elastica") é mola, e mola precisa
       ultrapassar para voltar.

       `damping: 30` no `stiffness: 120` sugerido fica praticamente critico: nao
       sobra elasticidade visivel, seria a curva de antes com outro nome. Em 22 a
       mola passa do alvo em ~3-4% e volta — em 850 isso é um pico por volta de
       880, dois ou tres quadros, exatamente o "elastico" pedido.

       `restDelta: 0.5` fecha em meio digito: com `Math.round` no `onUpdate`,
       perseguir 0.01 seria gastar quadros num movimento que a tela nao mostra
       mais. */
    const controle = animate(0, valor, {
      type: 'spring',
      stiffness: 120,
      damping: 22,
      restDelta: 0.5,
      onUpdate: (v) => {
        no.textContent = String(Math.round(v));
      },
      /* Fecha exatamente no valor. Com mola isso passou a ser obrigatorio, nao
         zelo: `restDelta: 0.5` interrompe a meio digito do alvo, e o ultimo
         quadro pode ser o retorno do overshoot. Sem esta linha o indicador
         poderia descansar em 851. */
      onComplete: () => {
        no.textContent = String(valor);
      },
    });
    /* Se a secao desmontar no meio da contagem, o que fica é o valor certo. */
    return () => {
      controle.stop();
      no.textContent = String(valor);
    };
  }, [ativo, valor]);

  return (
    <span
      ref={alvo}
      className="impact-numero"
      /* Largura reservada pelo numero final: contando 0 -> 850 o texto passa de
         um para tres digitos, e sem a reserva o `+` ao lado escorregaria.

         SIS-72: a reserva agora conta o PICO da mola, nao o valor final. Nos
         sete valores de hoje (850/23/130/650/230/35/25) da no mesmo — nenhum
         esta na fronteira de digito. Mas um `99+` viraria `103` por dois
         quadros, ganharia um digito e empurraria o `+`; com a margem embutida o
         proximo numero que entrar na lista nao reabre esse bug. */
      style={{ minWidth: `${String(Math.ceil(valor * 1.08)).length}ch` }}
    >
      {valor}
    </span>
  );
}

export default function Metrics() {
  /* -1 antes de a rolagem entrar nas etapas; no modo lista fica em 0, e o CSS
     do modo lista ignora `data-estado` de qualquer forma. */
  const [ativo, setAtivo] = useState(0);
  const [dirigindo, setDirigindo] = useState(false);
  const secaoRef = useRef<HTMLElement>(null);
  const palcoRef = useRef<HTMLDivElement>(null);
  const cenaRef = useRef<HTMLDivElement>(null);
  const ativoRef = useRef(0);
  /* SIS-73: o gatilho guardado para os atalhos alcançarem `start`/`end` — as duas
     alturas de rolagem que delimitam o percurso. É a única coisa que a faixa de
     botões precisa saber, e ela vem do MESMO gatilho que dita o índice ativo:
     nenhum segundo medidor do percurso. */
  const gatilhoRef = useRef<ScrollTrigger | null>(null);
  /* Largura da tela e altura util do palco. Sao a UNICA entrada da geometria, e
     mudam so em resize — nao em rolagem. */
  const [medida, setMedida] = useState(MEDIDA_PADRAO);

  /* Mesma decisao do `OfficesScene`: o scrollytelling é de tela larga e sem
     movimento reduzido. A avaliacao vive num efeito porque durante o render o
     valor precisa ser o do servidor. */
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const avaliar = () => setDirigindo(mq.matches && !prefersReducedMotion());
    avaliar();
    mq.addEventListener('change', avaliar);
    return () => mq.removeEventListener('change', avaliar);
  }, []);

  /* Medicao da cena. `ResizeObserver` no proprio palco em vez de `resize` na
     janela: a altura util depende do cabecalho (que é fluido) e da barra de URL
     do navegador, e nenhum dos dois avisa por `resize`. A guarda de meio pixel
     evita o laco de render que `getBoundingClientRect` (float) provocaria. */
  useEffect(() => {
    if (!dirigindo) return;
    const cena = cenaRef.current;
    if (!cena) return;

    const medir = () => {
      const larguraTela = window.innerWidth;
      const alturaPalco = cena.getBoundingClientRect().height;
      if (larguraTela < 1 || alturaPalco < 1) return;
      setMedida((anterior) =>
        Math.abs(anterior.larguraTela - larguraTela) < 0.5 &&
        Math.abs(anterior.alturaPalco - alturaPalco) < 0.5
          ? anterior
          : { larguraTela, alturaPalco },
      );
    };

    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(cena);
    return () => ro.disconnect();
  }, [dirigindo]);

  /**
   * Geometria da cena. UM vao alimenta tudo: posicao do conteudo de cada
   * indicador, posicao dos nodes, largura do SVG, deslocamento da trilha e o
   * path. É essa unificacao que faz o indicador ativo cair exatamente no centro
   * da tela e os vizinhos imediatos ficarem sempre visiveis.
   */
  const geo = useMemo(() => {
    const vao = vaoEntreEtapas(medida.larguraTela);
    const centroX = medida.larguraTela / 2;
    const centroY = medida.alturaPalco * LINHA_BASE;
    /* Margem em TRECHOS: meia tela de cada lado, arredondada para cima. É o que
       garante que a onda atravesse o quadro em QUALQUER etapa — no primeiro
       indicador ela já vem da borda esquerda, no último ela segue para fora da
       direita. Com a margem de um vão só, as duas pontas morriam a 150–250px do
       centro e metade da tela abria vazia. */
    const margem = Math.ceil(centroX / vao);
    const onda = criarOnda(centroX, centroY, vao, TOTAL, margem);
    /* Mesmo caminho com amplitude zero, para a passagem aos parceiros. Calculado
       junto porque depende das MESMAS entradas — dois `useMemo` sobre a mesma
       medida seriam duas chances de divergirem. */
    const dPlano = criarPlano(centroX, centroY, vao, TOTAL, margem);
    return { vao, centroX, centroY, altura: medida.alturaPalco, dPlano, ...onda };
  }, [medida]);

  useEffect(() => {
    if (!dirigindo) return;
    const secao = secaoRef.current;
    const palco = palcoRef.current;
    if (!secao || !palco) return;

    gsap.registerPlugin(ScrollTrigger);
    const gatilho = ScrollTrigger.create({
      trigger: secao,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
      /* Movimento interno da lente pausado fora da tela: sem isso os aneis
         girariam pela pagina toda, gastando compositor por nada. */
      onToggle: (self) => {
        palco.dataset.visivel = self.isActive ? '1' : '';
      },
      onUpdate: (self) => {
        const p = self.progress;
        palco.style.setProperty('--impact-p', String(p));
        palco.style.setProperty('--impact-entrada', String(clamp01(p / ENTRADA_FIM)));
        /* Aterragem: 0 enquanto a cena é a onda, 1 quando ela já é a linha-base.
           O CSS cruza as duas camadas de path com esta variável. */
        palco.style.setProperty(
          '--impact-aterrar',
          String(clamp01((p - ATERRAR_INICIO) / (1 - ATERRAR_INICIO))),
        );

        /* Posicao continua na sequencia, em indices: 0 = primeiro indicador,
           TOTAL-1 = ultimo. É dela que sai TUDO — deslocamento da trilha, trecho
           aceso da curva, pulso e indice ativo. Um progresso, uma fonte. */
        const etapa =
          clamp01((p - ETAPAS_INICIO) / (ETAPAS_FIM - ETAPAS_INICIO)) * (TOTAL - 1);

        /* Posicao continua em ETAPAS, nao em fracao de trilha: o CSS multiplica
           por `--impact-vao` e a trilha anda exatamente um vao por indicador.
           Em etapa inteira o ativo cai no centro da tela ao pixel. */
        palco.style.setProperty('--impact-etapa', String(etapa));

        /* O trecho aceso termina no ponto da vez, em pixels da trilha. Como esse
           ponto é sempre o centro da tela, a borda dura do corte fica dentro do
           buraco da mascara da lente — nunca aparece como risco vertical. */
        palco.style.setProperty(
          '--impact-aceso-x',
          `${coord(geo.centroX + etapa * geo.vao)}px`,
        );

        /* Pulso: só durante a passagem, seguindo a curva, sumindo ao chegar.
           Nao é laco — a opacidade zera nas duas pontas da passagem. */
        const passagem = etapa - Math.floor(etapa);
        const opacidade =
          etapa >= TOTAL - 1
            ? 0
            : passagem < 0.5
              ? clamp01((passagem - 0.05) / PULSO_SUBIDA)
              : clamp01((0.95 - passagem) / PULSO_SUBIDA);
        const ponto = pontoNaOnda(etapa, geo.centroX, geo.centroY, geo.vao);
        palco.style.setProperty('--impact-pulso-x', `${coord(ponto.x)}px`);
        palco.style.setProperty('--impact-pulso-y', `${coord(ponto.y)}px`);
        palco.style.setProperty('--impact-pulso-op', String(opacidade));

        /* Sinal de PASSAGEM: 0 com a etapa parada, 1 no meio do caminho entre
           duas. É o que faz a lente reagir ao avanco em vez de so trocar o
           conteudo por baixo — o sintoma de "tela travada" vinha de a moldura nao
           ter nenhuma resposta continua ao scroll, e nao da lente estar centrada
           (ela DEVE ficar centrada: é ela que define o centro da cena).

           Seno, e nao triangulo (`1 - |2t - 1|`): o triangulo tem quina nas duas
           pontas e a quina aparece como estalo no fim de cada passagem.

           Zera na ultima etapa, senao o estado de conclusao ficaria pulsando. */
        palco.style.setProperty(
          '--impact-passagem',
          String(etapa >= TOTAL - 1 ? 0 : Math.sin(passagem * Math.PI)),
        );

        /* Unica coisa que vira estado React: muda sete vezes na secao inteira. */
        const indice = Math.min(TOTAL - 1, Math.round(etapa));
        if (indice === ativoRef.current) return;
        ativoRef.current = indice;
        setAtivo(indice);
      },
    });

    gatilhoRef.current = gatilho;

    const atualizar = () => ScrollTrigger.refresh();
    window.addEventListener('resize', atualizar);
    return () => {
      window.removeEventListener('resize', atualizar);
      /* Só o gatilho DESTA seção. Nunca `ScrollTrigger.killAll()`: as outras
         seções da página têm gatilhos próprios e sobrevivem a este desmonte. */
      gatilho.kill();
      gatilhoRef.current = null;
      delete palco.dataset.visivel;
      for (const nome of [
        '--impact-p',
        '--impact-entrada',
        '--impact-aterrar',
        '--impact-etapa',
        '--impact-aceso-x',
        '--impact-pulso-x',
        '--impact-pulso-y',
        '--impact-pulso-op',
        '--impact-passagem',
      ]) {
        palco.style.removeProperty(nome);
      }
    };
    /* A geometria entra nas dependências porque o handler lê `geo`: em resize o
       gatilho é recriado com as medidas novas, e o `refresh` recalcula o
       percurso. Fora de resize nada aqui muda. */
  }, [dirigindo, geo]);

  /**
   * SIS-73 — atalho para o indicador `i`.
   *
   * Não mexe em `ativo`: converte o índice na FRAÇÃO de progresso em que aquele
   * indicador é o da vez — o inverso exato da conta do `onUpdate` — e leva a
   * rolagem até a altura correspondente. Quem decide o índice continua sendo o
   * ScrollTrigger.
   *
   * `start`/`end` vêm do gatilho vivo, não de `offsetTop` recalculado à mão: se o
   * percurso mudar (resize, `refresh`), o atalho acompanha sem uma segunda fonte
   * de verdade para desincronizar.
   *
   * Lenis primeiro, `window.scrollTo` como reserva — o mesmo par de
   * `Differentials.irParaPasso`. Com movimento reduzido a viagem é salto: uma
   * duração de 0,9s é movimento, e é justamente o que a preferência recusa.
   */
  const irParaIndicador = (i: number) => {
    const gatilho = gatilhoRef.current;
    if (!gatilho) return;
    const p = ETAPAS_INICIO + (i / (TOTAL - 1)) * (ETAPAS_FIM - ETAPAS_INICIO);
    const alvo = gatilho.start + p * (gatilho.end - gatilho.start);
    const rm = prefersReducedMotion();
    const lenis = (window as unknown as { __lenis?: { scrollTo: (t: number, o?: object) => void } })
      .__lenis;
    if (lenis) lenis.scrollTo(alvo, { duration: rm ? 0 : 0.9 });
    else window.scrollTo({ top: alvo, behavior: rm ? 'auto' : 'smooth' });
  };

  return (
    <section
      id="resultados"
      ref={secaoRef}
      className="impact-scroll"
      aria-labelledby="impact-titulo"
      /* O CSS do scrollytelling inteiro pende deste atributo. Sem JavaScript ele
         nunca aparece, e a secao é a lista completa. */
      data-dirigindo={dirigindo ? '1' : undefined}
    >
      <div ref={palcoRef} className="impact-sticky">
        <div className="impact-topo">
          {/* Emenda de entrada COMENTADA: era ela a faixa clara e plana no topo da
              seção, que anunciava a passagem em vez de escondê-la.

              Ela achatava a borda de cima para `#0875c5` chapado ao longo de
              200px, para casar com a saída de Soluções — necessário só enquanto o
              degradê era resolvido contra a caixa de cada seção. Agora as duas
              pintam o mesmo `--fundo-marca` ancorado na JANELA
              (`background-attachment: fixed`, ver a nota no `:root` do
              `globals.css`), e as bordas coincidem sozinhas.

              Comentada, e não removida: a regra `.impact-emenda` do `globals.css`
              está comentada junto, com a mesma nota.
          <span aria-hidden className="impact-emenda" />
          */}
          <div className="container-lp impact-topo-inner">
            {/* SIS-74 — trilha de metadados: sobretítulo, fio e marcador na MESMA
                linha, imediatamente acima do título.

                Antes o título ficava à esquerda e o marcador na ponta oposta da
                faixa, com meia tela de vazio entre os dois: o `03 / 07` lia como
                um widget avulso, sem dono, e a faixa toda ficava com a silhueta
                genérica de "título à esquerda, coisa à direita". Aqui o marcador
                é legenda do bloco — está a um fio de distância do texto que ele
                numera, e o alinhamento é o do sobretítulo, não o da borda da
                tela. O fio é curto de propósito: ele ENCOSTA os dois, não os
                separa de ponta a ponta. */}
            <div className="impact-topo-meta">
              <p className="impact-eyebrow">Sistran em números</p>
              <span aria-hidden className="impact-meta-fio" />

              {/* Marcador de etapa. O numero em texto é o que cumpre "nao indicar
                  o item ativo so por cor"; os traços sao reforco visual. */}
              <div className="impact-marcador">
                <p className="impact-marcador-num">
                  <span className="impact-marcador-atual">{doisDigitos(ativo + 1)}</span>
                  <span aria-hidden> / </span>
                  <span className="impact-marcador-total">{doisDigitos(TOTAL)}</span>
                </p>
                {/* Trilho de sete pontos COMENTADO (orquestração visual,
                    Prioridade 2).

                    A seção tinha QUATRO leituras simultâneas do mesmo progresso:
                    o `03 / 07` em texto, estes pontos ao lado dele, os nodes na
                    curva e a régua no pé do palco — mais a faixa de atalhos, que
                    também mostra qual é o ativo. Cinco maneiras de responder
                    "onde estou", nenhuma delas errada isoladamente, e juntas um
                    ruído: o olho procura qual delas é a oficial.

                    O corte fica com os dois canais que fazem algo que os outros
                    não fazem: o `03 / 07` em texto (informação exata, e o único
                    que não depende de cor nem de posição) e a faixa de atalhos
                    (o único que também NAVEGA, e o canal de teclado da cena).
                    Os nodes na curva ficam porque não são um indicador de
                    progresso avulso — são a própria linha-sinal da narrativa
                    passando pelos indicadores; apagá-los tiraria o motivo
                    visual, não uma duplicata.

                    Estes pontos eram o mais dispensável: repetiam, em cor e a um
                    centímetro de distância, exatamente o que o número ao lado já
                    dizia com precisão. Comentado, e não removido: as regras
                    `.impact-trilho*` do `globals.css` estão comentadas junto,
                    com a mesma nota. Religar é descomentar os dois.
                <div aria-hidden className="impact-trilho">
                  <span className="impact-trilho-aceso" />
                  {METRICS.map((m, i) => (
                    <span
                      key={m.id}
                      className="impact-trilho-ponto"
                      data-estado={i === ativo ? 'ativo' : i < ativo ? 'feito' : 'proximo'}
                    />
                  ))}
                </div>
                */}
              </div>
            </div>

            {/* O ponto final em ciano é um `span` proprio: é pontuacao, nao
                palavra, e nao deve entrar no gradiente do titulo. */}
            <h2 id="impact-titulo" className="impact-titulo">
              Escala que transforma o mercado de seguros
              <span className="impact-ponto">.</span>
            </h2>
          </div>
        </div>

        <div className="impact-palco">
          {/* SIS-64 — fronteira claro/escuro em curva larga, comentada.

              Ela separava a faixa clara do palco escuro, preenchida com a cor da
              faixa. Depois de SIS-61 não existem mais dois fundos: faixa e palco
              são o mesmo `--fundo-marca`, então não há fronteira para desenhar — e
              a barriga em `#e7f0f9` viraria uma mancha clara atravessando o azul.

              Era também a origem das sujeiras nos cantos que a task descreve:
              `preserveAspectRatio="none"` sobre um viewBox de 1440x120 esticava o
              path na horizontal em telas largas, a espessura aparente mudava com a
              largura e as pontas deixavam de encostar limpas nas bordas.

              Comentada, e não removida: as regras `.impact-borda` do `globals.css`
              estão comentadas junto, com a mesma nota. Religar é descomentar os
              dois — e o path teria de fechar nas duas bordas sem depender de
              `preserveAspectRatio="none"`.
          <svg
            aria-hidden
            className="impact-borda"
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
          >
            <path d="M0 0 H1440 V44 C 1180 96 980 22 720 52 C 470 80 250 118 0 74 Z" />
          </svg>
          */}

          <span aria-hidden className="impact-grade" />

          {/* A cena. Tres camadas com a MESMA referencia (pixels do palco):
              o caminho (estacionario, com a curva transladada dentro), a lente
              (estacionaria no centro) e a trilha do conteudo (transladada).
              As variaveis de geometria ficam aqui — e nao no `.impact-sticky`,
              onde o ScrollTrigger escreve as de progresso: um re-render do React
              limparia da `style` tudo o que ele nao declara. */}
          <div
            ref={cenaRef}
            className="impact-cena"
            style={
              {
                '--impact-vao': `${coord(geo.vao)}px`,
                '--impact-centro': `${coord(geo.centroX)}px`,
                '--impact-linha': `${coord(geo.centroY)}px`,
              } as React.CSSProperties
            }
          >
            {/* Boca de entrada da onda: a beira esquerda do palco, na altura da
                linha-base. É aqui que a travessia vinda de Soluções
                (`SolutionsToMetrics`) pousa, para o fio de lá e a onda de cá
                lerem como UM traço atravessando a emenda. Um ponto, medido por
                `getBoundingClientRect` — a travessia não estima nada. */}
            <span aria-hidden data-fio-chegada className="impact-chegada-fio" />

            {/* O caminho é mascarado com um buraco circular no centro: a curva
                chega na borda da lente, desaparece e reaparece do outro lado —
                nunca por cima do numero, do rotulo ou da legenda. */}
            <div aria-hidden className="impact-caminho">
              <div className="impact-trilha-curva">
                {/* Duas camadas sobre o MESMO `d`: linha-base e trecho aceso.
                    `viewBox` e `width`/`height` em pixels iguais, entao 1 unidade
                    = 1 px e o `clip-path` do aceso corta no lugar exato. */}
                <svg
                  className="impact-curva"
                  viewBox={`0 0 ${coord(geo.largura)} ${coord(geo.altura)}`}
                  width={coord(geo.largura)}
                  height={coord(geo.altura)}
                >
                  <path className="impact-curva-base" d={geo.d} />
                  {/* Linha-base da passagem aos parceiros: a MESMA curva com
                      amplitude zero. As duas se cruzam por `opacity`, dirigidas
                      por `--impact-aterrar`, no último trecho do percurso — a
                      onda assenta e o que segue para a seção seguinte é uma reta.
                      Ver `criarPlano` em `geometria.ts`. */}
                  <path className="impact-curva-plana" d={geo.dPlano} />
                </svg>
                <div className="impact-curva-recorte">
                  <svg
                    className="impact-curva"
                    viewBox={`0 0 ${coord(geo.largura)} ${coord(geo.altura)}`}
                    width={coord(geo.largura)}
                    height={coord(geo.altura)}
                  >
                    <path className="impact-curva-viva" d={geo.d} />
                  </svg>
                </div>

                {/* Nodes: saem do `<li>` e vem para a trilha da curva. É a unica
                    forma de eles ficarem SOBRE a curva enquanto o conteudo do
                    indicador fica deslocado acima ou abaixo dela. */}
                {METRICS.map((m, i) => (
                  <span
                    key={m.id}
                    className="impact-no"
                    data-estado={i === ativo ? 'ativo' : i < ativo ? 'feito' : 'proximo'}
                    /* Distancia (em etapas) até o indicador da vez, saturada em 3.
                       É ela que faz o aglomerado rarefazer conforme se afasta do
                       centro: o CSS liga os satelites por faixa de distancia. Vem
                       do render, e nao do ScrollTrigger, porque só muda quando a
                       etapa muda — nao a cada quadro. */
                    data-dist={Math.min(3, Math.abs(i - ativo))}
                    style={{ '--impact-i': i } as React.CSSProperties}
                  />
                ))}

                <span className="impact-pulso" />
              </div>
            </div>

            {/* A lente. Fica FORA da trilha transladada: é ela que define o
                centro da cena, e o que se move é a trilha por baixo. Antes ela
                pertencia ao item ativo e herdava o deslocamento — por isso nunca
                caia no centro da tela. Centro transparente: o numero, que
                continua no `<li>`, aparece por cima. */}
            <span aria-hidden className="impact-lente">
              {/* SIS-74 — a lente era um anel de radar: três anéis concêntricos
                  girando em velocidades diferentes, 36 ticks radiais, um arco de
                  progresso circular com bolinha orbitando e uma varredura cónica
                  por cima. Cada peça tinha justificação própria, e somadas
                  produziam exatamente o clichê de HUD de ficção científica — a
                  moldura chamava mais atenção que o número que ela existia para
                  emoldurar.

                  No lugar: um PAINEL. Moldura retangular de 1px com cantos em
                  esquadro (marca de corte, vocabulário de prancha técnica), e o
                  progresso numa barra reta na aresta de cima. A mesma informação
                  — em que ponto do percurso a cena está — lida num gesto que não
                  gira: barra que enche da esquerda para a direita, na mesma
                  direção em que a trilha anda.

                  Os quatro esquadros são um `<path>` só: são o mesmo traço em
                  quatro cantos, e separá-los em quatro nós seria quatro nós para
                  manter a mesma espessura. `vectorEffect` mantém 1px real em
                  qualquer largura de painel — sem ele o `viewBox` esticado
                  engrossaria o traço na horizontal. */}
              <svg
                className="impact-moldura"
                viewBox="0 0 100 62"
                preserveAspectRatio="none"
                focusable="false"
              >
                <rect
                  className="impact-moldura-caixa"
                  x="0.5"
                  y="0.5"
                  width="99"
                  height="61"
                  vectorEffect="non-scaling-stroke"
                />
                <path
                  className="impact-moldura-esquadro"
                  vectorEffect="non-scaling-stroke"
                  d="M0.5 12V0.5H12 M88 0.5H99.5V12 M99.5 50V61.5H88 M12 61.5H0.5V50"
                />
              </svg>

              {/* Barra de progresso na aresta de cima. `scaleX` a partir da
                  esquerda, dirigido por `--impact-etapa` — a MESMA variável que
                  o único ScrollTrigger da seção já escreve, nenhum gatilho novo.
                  Nó próprio para o `transform` ter um dono só (a lição de
                  SIS-42). */}
              <span className="impact-barra">
                <span className="impact-barra-viva" />
              </span>

              {/* Um contextual só, o do indicador da vez: a lente é unica. */}
              <span className="impact-contextual" key={METRICS[ativo]?.id}>
                <ImpactVisual nome={METRICS[ativo]?.visual} />
              </span>
              {/* Marca de chegada: onde a curva entra na máscara, na aresta
                  esquerda do painel. Era uma bolinha branca com dois halos
                  ciano; virou um traço vertical rente à aresta, do mesmo
                  vocabulário dos esquadros. */}
              <span className="impact-chegada" />
            </span>

            <div className="impact-track">
              <ol className="impact-lista" aria-label="Indicadores institucionais da Sistran">
                {METRICS.map((m, i) => (
                  <li
                    key={m.id}
                    className="impact-item"
                    data-estado={i === ativo ? 'ativo' : i < ativo ? 'feito' : 'proximo'}
                    /* SIS-62 — `data-dist` e `data-lado`, os dois derivados do que
                       o item já tem. `data-dist` é a distancia em etapas até o
                       ativo (0..3), o MESMO canal que os nodes usam: é ele que
                       rarefaz os vizinhos por distancia, em vez da opacidade fixa
                       que pesava igual no vizinho de ao lado e no da ponta da tela.
                       `data-lado` diz para que lado da onda o bloco foi empurrado,
                       e é o que orienta a haste. */
                    data-dist={Math.min(3, Math.abs(i - ativo))}
                    data-lado={(DESVIOS_TRILHO[i] ?? 0) < 0 ? 'acima' : 'abaixo'}
                    /* Posicao vai por variavel, nao por `left`/`top` inline:
                       estilo inline venceria o CSS do modo lista, e ai a lista
                       vertical nasceria com os itens espalhados. O resto do calculo
                       é o vao comum, compartilhado com a curva e com os nodes.

                       `--impact-haste` é o MODULO do mesmo desvio: a distancia do
                       centro do bloco até a onda. Nao é numero novo — sai de
                       `DESVIOS_TRILHO`, a mesma fonte da posicao. */
                    style={
                      {
                        '--impact-i': i,
                        '--impact-desvio': `${DESVIOS_TRILHO[i] ?? 0}px`,
                        '--impact-haste': `${Math.abs(DESVIOS_TRILHO[i] ?? 0)}px`,
                      } as React.CSSProperties
                    }
                  >
                    {/* Haste que liga este bloco ao seu node na onda. O bloco e o
                        node já nascem no mesmo x, mas o bloco é empurrado na
                        vertical para nao brigar com a lente, e nada preenchia esse
                        vao: o numero lia como solto no palco em vez de pendurado no
                        percurso. Decorativa, e por isso `aria-hidden`. */}
                    <span aria-hidden className="impact-haste" />
                    {/* Ordinal decorativo: a posicao no percurso ja vem da `<ol>`,
                        entao repeti-la em texto acessivel seria leitura dobrada. */}
                    <p aria-hidden className="impact-indice">
                      {doisDigitos(i + 1)}
                    </p>

                    {/* Nada aqui é `sr-only`: o numero e o sufixo SAO o texto
                        acessivel. A versao anterior duplicava o valor num
                        `sr-only` para poder esconder o contador do leitor de
                        tela, e era essa copia que aparecia sobreposta ao numero.
                        Com o valor real no HTML a copia perdeu a razao de
                        existir — e é por isso que o numero continua aqui, no
                        item, e nao dentro da lente: duplicar o valor la faria o
                        leitor de tela ler cada indicador duas vezes. */}
                    <p className="impact-valor">
                      <ImpactNumero valor={m.value} ativo={i === ativo} />
                      {/* Fora do contador de proposito: dentro dele o `+` seria
                          reescrito a cada quadro da contagem. */}
                      <span className="impact-mais">{m.suffix}</span>
                    </p>

                    <p className="impact-rotulo">{m.label}</p>
                    <p className="impact-caption">{m.caption}</p>
                  </li>
                ))}
              </ol>
            </div>

            {/* Régua do pé do palco COMENTADA (orquestração visual, Prioridade 2).

                Era a terceira leitura do progresso: traços em
                `repeating-linear-gradient` e, por cima, a mesma régua em ciano
                recortada pelo avanço. A justificação original — "dá escala ao
                percurso sem acrescentar texto" — perdeu o objeto: a faixa de
                atalhos ocupa a mesma aresta inferior do palco, mostra os sete
                ordinais e marca o ativo, então a escala do percurso já está
                escrita ali, com números em vez de traços, e clicável.

                Duas réguas na mesma borda também competiam: a de traços era a
                que parecia interativa e não era.

                Comentada, e não removida: as regras `.impact-regua*` do
                `globals.css` estão comentadas junto, com a mesma nota. Religar
                é descomentar os dois — e então rever a faixa de atalhos, porque
                as duas dividem a aresta.
            <span aria-hidden className="impact-regua">
              <span className="impact-regua-viva" />
            </span>
            */}
          </div>

          {/* SIS-73 — faixa de atalhos. Fica FORA do `.impact-cena`, direto no
              palco, pelo mesmo motivo da lente: `.impact-track` e
              `.impact-trilha-curva` recebem `transform` por quadro, e um alvo de
              clique que anda 1400px na horizontal é um alvo que ninguém acerta.

              Só existe no modo dirigido — `dirigindo` é `false` abaixo de 1024px
              e com movimento reduzido, e nesses casos a seção é a lista completa
              dos sete indicadores. Não há por que oferecer atalho para o que já
              está todo na tela, e transformar a lista em tabs esconderia seis dos
              sete atrás de interação.

              `<nav>` com botões, não `role="tablist"`: são sete destinos dentro da
              MESMA cena, não sete painéis alternáveis. O leitor de tela que
              ouvisse "aba" esperaria trocar de conteúdo, e o que acontece é a
              rolagem andar. */}
          {dirigindo && (
            <nav className="impact-atalhos" aria-label="Ir para um indicador">
              {METRICS.map((m, i) => (
                <button
                  key={m.id}
                  type="button"
                  className="impact-atalho"
                  /* `aria-current` é o sinal semântico do ativo, e o ordinal em
                     texto mais o peso da fonte são os sinais visuais
                     não-cromáticos — a borda ciano é reforço, nunca a única
                     informação. */
                  aria-current={i === ativo ? 'true' : undefined}
                  data-estado={i === ativo ? 'ativo' : undefined}
                  /* O rótulo visível é só o ordinal, para a faixa caber nos sete
                     sem competir com a cena. O nome do indicador vai no
                     `aria-label`, senão o botão seria lido como "zero quatro". */
                  aria-label={`${doisDigitos(i + 1)} — ${m.label}`}
                  onClick={() => irParaIndicador(i)}
                >
                  <span aria-hidden className="impact-atalho-num">
                    {doisDigitos(i + 1)}
                  </span>
                </button>
              ))}
            </nav>
          )}

          <span aria-hidden className="impact-vinheta" />
        </div>
      </div>
    </section>
  );
}
