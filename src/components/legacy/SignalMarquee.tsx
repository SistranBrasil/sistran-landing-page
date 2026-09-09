'use client';

/**
 * Faixa de parceiros que passa em loop, fechando a seção "Sistran em números".
 *
 * SIS-101 — ela era uma seção independente entre os números e o resto da página,
 * e era daí que vinham os três defeitos apontados: a linha ciano por cima das
 * logos, o chanfro do `NotchDivider` que a antecedia (uma diagonal que terminava
 * no vazio, porque não havia dois blocos para chanfrar) e o degrau na emenda.
 * Agora ela é montada DENTRO de `Metrics.tsx`, depois do percurso do palco, como
 * rodapé da mesma seção — ver a nota lá. Nada aqui depende disso: o componente
 * continua autônomo e `/parceiros-e-implementacoes` o monta sozinho.
 *
 * Antes esta faixa passava os seis sinais do método em serifa grande
 * ("Diagnóstico do legado", "Conhecimento navegável", ...). Saíram a pedido: o
 * texto repetia o que os quatro movimentos do Método já dizem logo acima, e o
 * lugar depois das evidências pede prova de terceiros. Agora passam as marcas de
 * `/parceiros-e-implementacoes` — a MESMA lista (`CLIENTS`), para as duas páginas
 * nunca divergirem.
 *
 * A mecânica de rolagem vem de `globals.css` (`.marquee-viewport` /
 * `.marquee-track` / `.marquee-copy` e a keyframe `marquee-scroll`), a mesma do
 * `ClientWall`. Não há animação nova — só o desenho dos itens, em `legacy.css`.
 *
 * Herdar essa mecânica resolve de graça o ponto de acessibilidade: com movimento
 * reduzido o `globals.css` troca o mecanismo em vez de congelar a faixa (a
 * viewport vira lista rolável e a cópia duplicada sai de cena). Parar o loop sem
 * plano B deixaria as marcas fora da tela INALCANÇÁVEIS — não há setas nem
 * scroll próprio.
 *
 * A cópia visual é `aria-hidden`, então o leitor de tela lê a lista uma vez só.
 *
 * SIS-156 — DUAS TELAS, NÃO TRÊS. A home trocou esta faixa por uma grade estática
 * (`src/components/BrandGrid.tsx`), no formato de `terminal-industries.com`.
 * Sobraram `/contato:133` e `/parceiros-e-implementacoes:105`, que continuam
 * rolantes — divergência deliberada, e a issue trocou só a home.
 * Nada aqui mudou por causa disso, e é bom que se saiba por quê: as duas telas
 * restantes usam o componente inteiro, com o mesmo desenho e a mesma mecânica.
 * Quem for unificar as três depois tem dois caminhos e eles não são equivalentes —
 * a grade precisa de um TÍTULO aprovado por tela (é metade do efeito da
 * referência, e o da home está no `copy-lock.json`), enquanto a faixa não precisa
 * de uma palavra. Trocar as outras duas é, antes de tudo, uma decisão de texto.
 */

import './legacy.css';
import { useEffect, useRef, useState } from 'react';
import { CLIENTS } from '@/data/clients';
import { prefersReducedMotion } from '@/lib/motion';

/* Só as marcas COM arquivo de logo. A faixa é puramente visual: um chip textual
   no meio de placas gráficas (o fallback do `ClientWall`) quebraria o ritmo do
   loop. Hoje as seguradoras sem asset estão comentadas em `clients.ts`, mas o
   filtro garante que descomentar uma lá não desenhe um item torto aqui. */
const PARCEIROS = CLIENTS.filter((c) => c.logo);

export function SignalMarquee() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  /* Quantas vezes a lista se repete DENTRO de uma cópia. Mesma razão do
     `ClientWall`: em tela larga uma cópia pode ser mais estreita que a viewport
     — as duas cópias da trilha não cobrem a tela e sobra um vazio até o loop
     reiniciar. Medimos e repetimos até a cópia encher a viewport. */
  const [repeats, setRepeats] = useState(1);
  const regiaoRef = useRef<HTMLDivElement>(null);

  /**
   * Chegada da faixa: a linha-base se desenha e as marcas sobem dela uma vez, na
   * entrada. Um `IntersectionObserver` só, desconectado depois do primeiro
   * disparo — não é um efeito que reaja à rolagem, é uma chegada.
   *
   * `data-chegou` em vez de estado React porque o CSS é o único interessado, e
   * porque um re-render aqui remontaria a trilha do marquee no meio do loop.
   *
   * O atributo vale `"0"` (estado de entrada) e depois some. Escrito ASSIM, e não
   * ao contrário: o CSS tem o estado final como default e é o JavaScript que pede
   * o estado de entrada. Sem JS, com movimento reduzido ou se o observador nunca
   * disparar, a faixa está inteira na tela — nunca presa em `opacity: 0`.
   *
   * Por que a subida é do GRUPO e não de cada marca, em cascata: os itens da
   * faixa existem em duas cópias e se repetem `repeats` vezes dentro de cada uma,
   * e a trilha já está em translação contínua. Um `animation-delay` por item
   * escalonaria também as duplicatas — a mesma marca subiria duas vezes, em
   * momentos diferentes, enquanto atravessa a tela. A sequência que a
   * especificação pede é o que a própria translação do loop já produz: as marcas
   * entram uma depois da outra pela borda.
   */
  useEffect(() => {
    const regiao = regiaoRef.current;
    if (!regiao) return;

    if (prefersReducedMotion()) return;

    /* Pede o estado de entrada. Num quadro seguinte, para o navegador ter o
       estado final registrado antes — sem isso a transição não teria de onde
       partir e a faixa apareceria de uma vez. */
    regiao.dataset.chegou = '0';

    const io = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (!entrada.isIntersecting) continue;
          delete regiao.dataset.chegou;
          io.disconnect();
        }
      },
      /* 25% da faixa: a linha-base tem de começar a se desenhar quando ela ainda
         está entrando, para o traço parecer vindo da seção de cima. */
      { threshold: 0.25 },
    );
    io.observe(regiao);
    return () => {
      io.disconnect();
      /* Se a seção desmontar antes de a faixa chegar, o que fica é o estado
         final — não o de entrada congelado. */
      delete regiao.dataset.chegou;
    };
  }, []);

  useEffect(() => {
    const vp = viewportRef.current;
    const group = groupRef.current;
    if (!vp || !group) return;

    const measure = () => {
      const groupW = group.getBoundingClientRect().width / repeats;
      const vpW = vp.getBoundingClientRect().width;
      if (groupW < 1 || vpW < 1) return;
      const needed = Math.max(1, Math.ceil(vpW / groupW));
      setRepeats((prev) => (prev === needed ? prev : needed));
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(vp);
    /* A 1ª medição acontece antes das logos chegarem: a largura ainda vai
       mudar, e com ela o número de repetições. */
    document.fonts?.ready.then(measure).catch(() => undefined);
    const logos = Array.from(group.querySelectorAll('img'));
    logos.forEach((img) => img.addEventListener('load', measure));

    return () => {
      ro.disconnect();
      logos.forEach((img) => img.removeEventListener('load', measure));
    };
  }, [repeats]);

  /* A logo é o conteúdo do item — não há mais texto ao lado nomeando a marca —,
     então o `alt` carrega o nome. Na cópia `aria-hidden` ele é ignorado, e é
     assim que o leitor de tela ouve a lista uma vez só.

     `<img>` simples: são arquivos estáticos de proporção variada, exibidos em
     altura fixa, e o otimizador não tem o que fazer aqui.

     SIS-102 — o ponto azul separador NÃO é um nó aqui, é o `::after` de cada
     `.lp-partner` (em `legacy.css`), e isso é decisão de projeto, não atalho:

     1. `::after` absoluto não entra na largura medida da cópia. A largura é o que
        alimenta o `translate3d(-50%)` do loop, então um separador em `<span>`
        obrigaria a remedir tudo e qualquer erro de meio vão viraria salto na
        volta. Assim a medição de cima continua valendo sem tocar em nada.
     2. Um ponto POR ITEM, e não entre pares, é o que resolve a emenda: o ponto do
        último item de uma cópia cai no vão que antecede a primeira marca da cópia
        seguinte. Não existe "último" numa faixa infinita — só existe o vão, e
        todo vão tem o seu ponto.
     3. Pseudo-elemento sem texto (`content: ''`, cor e raio) não tem o que ser
        anunciado, o que cumpre o `aria-hidden` pedido sem marcar nada.

     A única posição em que o ponto sobra de verdade é o fim da lista com
     movimento reduzido, onde a faixa vira lista rolável e a cópia duplicada sai
     de cena — e aí o CSS o esconde por `:last-child`. */
  const copia = (
    <>
      {Array.from({ length: repeats }, (_, r) =>
        PARCEIROS.map((parceiro) => (
          <span className="lp-partner" key={`${parceiro.name}-${r}`}>
            {/* SIS-136 — `fetchPriority="low"` entrou porque `loading="lazy"` NÃO
                é "não baixa": é "baixa quando chega perto da janela", e o limiar do
                Chrome no desktop é da ordem de mil pixels. Enquanto a faixa fechava
                a página isso não custava nada. Em /contato ela subiu para y=1017 a
                1440×900 — logo abaixo da dobra e DENTRO do limiar —, então as 18
                requisições de logo passaram a sair na primeira rajada, junto com a
                foto do hero que é `priority`. `low` não impede a requisição; ele
                manda o navegador servi-la DEPOIS do que é crítico, que é
                exatamente o que a issue pede ("as logos não disputam o primeiro
                paint"). Vale para as três telas que montam esta faixa: logo
                decorativa em altura fixa nunca deve concorrer com o hero de
                ninguém. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={parceiro.logo}
              alt={parceiro.name}
              loading="lazy"
              decoding="async"
              fetchPriority="low"
            />
          </span>
        )),
      )}
    </>
  );

  return (
    /* `aria-label` na região: sem ele a faixa é uma sequência de imagens sem
       contexto — quem ouve não sabe do que é essa lista de nomes. */
    <div
      ref={regiaoRef}
      className="lp-signals"
      role="region"
      aria-label="Parceiros e tecnologias"
    >
      {/* SIS-101 — a linha-base ciano saiu daqui.

          Ela era um `<span className="lp-signals-base" />` a `top: -1px`: um
          traço de 2px atravessando a faixa de ponta a ponta, que se desenhava da
          esquerda para a direita na chegada. A justificativa era de continuidade
          — a curva de "Sistran em números" assenta numa reta horizontal no fim
          daquele percurso, e este seria o prolongamento dela.

          O problema é que o prolongamento passava POR CIMA da área das logos (o
          `z-index: 1` punha o traço acima do fundo e abaixo das marcas, mas as
          marcas têm altura variável e nenhuma encosta na borda de cima), então o
          que se lia era um risco luminoso cortando a faixa. E a continuidade que
          ele buscava agora existe de graça: com SIS-101 a faixa é o rodapé da
          própria seção dos números, então a curva aterrissa e a faixa vem logo
          abaixo, sem precisar de um segundo traço para costurar duas seções que
          já não são duas.

          O que NÃO saiu é a chegada: `data-chegou` continua sendo escrito e
          continua fazendo as marcas subirem na entrada (ver `.lp-signals
          .marquee-viewport` em `legacy.css`). Elas sobem de onde a curva
          terminou, e não de um traço desenhado para isso. */}
      <div ref={viewportRef} className="marquee-viewport">
        <div className="marquee-track marquee-left">
          <div ref={groupRef} className="marquee-copy lp-signals-copy">
            {copia}
          </div>
          <div className="marquee-copy lp-signals-copy" aria-hidden="true">
            {copia}
          </div>
        </div>
      </div>
    </div>
  );
}
