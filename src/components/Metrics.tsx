'use client';

/**
 * Metrics — "Sistran em números" como scrollytelling horizontal.
 *
 * A rolagem é vertical, como no resto do site; o que anda na horizontal é a
 * trilha, empurrada por `transform` para deixar o indicador da vez no centro da
 * tela. Nunca há barra de rolagem horizontal e não há clique: não é carrossel.
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
    const controle = animate(0, valor, {
      duration: 1.1,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        no.textContent = String(Math.round(v));
      },
      /* Fecha exatamente no valor: `Math.round` do ultimo quadro poderia parar
         um digito antes. */
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
         um para tres digitos, e sem a reserva o `+` ao lado escorregaria. */
      style={{ minWidth: `${String(valor).length}ch` }}
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
    const onda = criarOnda(centroX, centroY, vao, TOTAL);
    return { vao, centroX, centroY, altura: medida.alturaPalco, ...onda };
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

    const atualizar = () => ScrollTrigger.refresh();
    window.addEventListener('resize', atualizar);
    return () => {
      window.removeEventListener('resize', atualizar);
      /* Só o gatilho DESTA seção. Nunca `ScrollTrigger.killAll()`: as outras
         seções da página têm gatilhos próprios e sobrevivem a este desmonte. */
      gatilho.kill();
      delete palco.dataset.visivel;
      for (const nome of [
        '--impact-p',
        '--impact-entrada',
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
          {/* Emenda de entrada. A seção acima (Soluções) fecha em palco escuro e
              esta faixa é clara: sem nada no meio a troca é corte reto. O degradê
              do navy na borda de cima resolve, e se dissipa conforme a seção
              entra — a opacidade sai de `--impact-entrada`, a MESMA variável que
              o único ScrollTrigger da seção já escreve. Nenhum gatilho novo.

              `z-index: -1` (o mesmo truque de `.emenda-de-escuro`): pinta por
              cima do fundo da faixa e por baixo do texto, sem precisar empilhar
              o conteúdo. */}
          <span aria-hidden className="impact-emenda" />
          <div className="container-lp impact-topo-inner">
            <div>
              <p className="impact-eyebrow">Sistran em números</p>
              {/* O ponto final em ciano é um `span` proprio: é pontuacao, nao
                  palavra, e nao deve entrar no gradiente do titulo. */}
              <h2 id="impact-titulo" className="impact-titulo">
                Escala que transforma o mercado de seguros
                <span className="impact-ponto">.</span>
              </h2>
            </div>

            {/* Marcador de etapa. O numero em texto é o que cumpre "nao indicar
                o item ativo so por cor"; os pontos sao reforco visual. */}
            <div className="impact-marcador">
              <p className="impact-marcador-num">
                <span className="impact-marcador-atual">{doisDigitos(ativo + 1)}</span>
                <span aria-hidden> / </span>
                <span className="impact-marcador-total">{doisDigitos(TOTAL)}</span>
              </p>
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
            </div>
          </div>
        </div>

        <div className="impact-palco">
          {/* Fronteira claro/escuro em curva larga e organica — nao chanfro (o
              `NotchDivider` do projeto) e nao linha reta. O preenchimento é a cor
              clara: o que sobra abaixo da curva é o palco. */}
          <svg
            aria-hidden
            className="impact-borda"
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
          >
            <path d="M0 0 H1440 V44 C 1180 96 980 22 720 52 C 470 80 250 118 0 74 Z" />
          </svg>

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
              <svg className="impact-aneis" viewBox="0 0 200 200" focusable="false">
                <path className="impact-anel impact-anel-1" d="M100 14 A 86 86 0 0 1 186 100" />
                <path className="impact-anel impact-anel-1" d="M100 186 A 86 86 0 0 1 14 100" />
                <path className="impact-anel impact-anel-2" d="M28 128 A 76 76 0 0 0 172 128" />
                <path className="impact-anel impact-anel-2" d="M172 72 A 76 76 0 0 0 28 72" />
                {/* Terceiro anel, contínuo e quase apagado: dá um terceiro plano
                    de profundidade sem competir com os dois arcos que giram. */}
                <circle className="impact-anel impact-anel-3" cx="100" cy="100" r="66" />
                {/* Arco de progresso: dois círculos sobrepostos, o de baixo como
                    calha e o de cima recortado por `stroke-dashoffset`, que o CSS
                    calcula a partir de `--impact-etapa` — a MESMA variável que o
                    único ScrollTrigger da seção já escreve. Nenhum trigger novo. */}
                <circle className="impact-arco-calha" cx="100" cy="100" r="92" />
                <circle className="impact-arco-vivo" cx="100" cy="100" r="92" />
                {/* Cabeça do arco: a bolinha que anda pela borda da lente, com a
                    rotação saindo de `--impact-etapa` — a MESMA variável do arco,
                    logo nenhum gatilho novo e nenhuma segunda medição do
                    percurso.

                    Ela existe porque a lente lia como "travada": o arco era o
                    único indicador contínuo e é traço fino, então o avanço não
                    aparecia. Uma marca que anda dá a leitura de percurso.

                    Nó PRÓPRIO, e não `transform` num elemento que já tem
                    `animation`: giro contínuo e valor por quadro na mesma
                    propriedade do mesmo elemento é a colisão que SIS-42 corrigiu
                    em Soluções — um sobrescreve o outro. E sem `transition`,
                    porque o valor é reescrito a cada quadro pelo scroll. */}
                <g className="impact-arco-cabeca">
                  <circle cx="100" cy="8" r="3.4" />
                </g>
                <g className="impact-ticks">
                  {Array.from({ length: 36 }, (_, t) => {
                    const a = (t / 36) * Math.PI * 2;
                    const r1 = 92;
                    const r2 = 92 + (t % 3 === 0 ? 7 : 3.5);
                    return (
                      <line
                        key={t}
                        /* `coord` arredonda: sem ele o cosseno do Node e o do
                           navegador diferem no ultimo digito e o React acusa
                           divergencia de hidratacao. */
                        x1={coord(100 + Math.cos(a) * r1)}
                        y1={coord(100 + Math.sin(a) * r1)}
                        x2={coord(100 + Math.cos(a) * r2)}
                        y2={coord(100 + Math.sin(a) * r2)}
                      />
                    );
                  })}
                </g>
              </svg>
              {/* Um contextual só, o do indicador da vez: a lente é unica. */}
              <span className="impact-contextual" key={METRICS[ativo]?.id}>
                <ImpactVisual nome={METRICS[ativo]?.visual} />
              </span>
              {/* Node de chegada: marca, na borda esquerda da lente, o ponto em
                  que a curva entra na mascara. */}
              <span className="impact-chegada" />
            </span>

            <div className="impact-track">
              <ol className="impact-lista" aria-label="Indicadores institucionais da Sistran">
                {METRICS.map((m, i) => (
                  <li
                    key={m.id}
                    className="impact-item"
                    data-estado={i === ativo ? 'ativo' : i < ativo ? 'feito' : 'proximo'}
                    /* Posicao vai por variavel, nao por `left`/`top` inline:
                       estilo inline venceria o CSS do modo lista, e ai a lista
                       vertical nasceria com os itens espalhados. Sao as duas
                       unicas variaveis por item — o resto do calculo é o vao
                       comum, compartilhado com a curva e com os nodes. */
                    style={
                      {
                        '--impact-i': i,
                        '--impact-desvio': `${DESVIOS_TRILHO[i] ?? 0}px`,
                      } as React.CSSProperties
                    }
                  >
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

            {/* Régua discreta no pé do palco: traços em `repeating-linear-gradient`
                e, por cima, a mesma régua em ciano recortada pelo progresso. Dá
                escala ao percurso sem acrescentar texto — a etapa em número
                continua no marcador do cabeçalho. */}
            <span aria-hidden className="impact-regua">
              <span className="impact-regua-viva" />
            </span>
          </div>

          <span aria-hidden className="impact-vinheta" />
        </div>
      </div>
    </section>
  );
}
