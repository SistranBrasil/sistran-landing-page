'use client';

/**
 * SIS-268 — A SEÇÃO **SERVIÇOS** DE `/solucoes`, refeita como a mock
 * `public/imagensexemplo/imagemserviços.png` e seguindo `docs/servicos.md`.
 *
 * ── O QUE SAIU DE CENA ──
 * `ServicesJourneyStage` (a pilha `sticky` com o vídeo preso ao lado e os cards
 * numerados 01–04). O arquivo continua no repositório, e o mount continua escrito
 * — comentado, com o motivo — em `src/app/solucoes/page.tsx`: a issue troca o
 * LAYOUT desta seção, não apaga o componente, que é a peça portada da apresentação
 * de Transformação de Legado. O que a mock pede é incompatível com ele em três
 * pontos de uma vez: o vídeo é FUNDO da seção inteira (não uma figura numa
 * coluna), os cards são quatro ao mesmo tempo numa grade 2×2 (não uma pilha
 * percorrida por rolagem) e os ordinais são PROIBIDOS nominalmente pela issue.
 *
 * ── POR QUE O VÍDEO É O `jornada.mp4` ──
 * A issue manda usar «um vídeo JÁ EXISTENTE do site (ex.: o da jornada) — não
 * inventar arquivo», e este é o arquivo que a própria seção já carregava (era a
 * figura da pilha). Ou seja: nenhum asset novo entra, e o take que a pessoa via
 * aqui continua sendo o mesmo. Configuração obrigatória do doc, item por item:
 * `autoPlay`, `muted`, `loop`, `playsInline`, `preload="metadata"`,
 * `object-fit: cover`, `position: absolute` + `inset: 0`, e SEM `controls` —
 * «sem interface de player» é o `controls` ausente e mais nada, porque barra de
 * progresso, volume, menu e botão de tela cheia são todos ele.
 *
 * `autoPlay` NÃO BASTA para o movimento reduzido, e a razão é a mesma que o
 * `HeroVideoBackdrop` já documenta: ele é gatilho de partida, não estado. O
 * snapshot do servidor de `useReducedMotion` é `false` (tem de ser, senão a
 * hidratação diverge), então o HTML sai com o atributo e o navegador já começa a
 * tocar; apagar o atributo depois não para nada. Daí o `pause()` imperativo, com
 * `currentTime = 0`, e a base navy da folha como quadro parado — um laço infinito
 * é movimento decorativo e nenhuma informação vive nele.
 *
 * ── O CARIMBO ──
 * `CarimboBatida`, sem parâmetro novo: medi a arte antes de reusar, e
 * `carimbo-diferenciais-ticket-outline-ffffff.png` (978×348) já vem tombada
 * **−3,01°** no próprio arquivo (topo da tinta em x=147 → y=51, em x=831 → y=15).
 * É o mesmo ângulo das duas artes para as quais o componente foi escrito (−3,05° e
 * −3,03°), então o repouso continua sendo giro zero e os −3deg que o doc pede já
 * estão NO PNG — não há tombo para declarar em CSS nem para divergir do tween.
 *
 * `gatilho="viewport"` é obrigatório aqui: medido, esta seção começa a ~2.490px do
 * topo do documento a 1440px. Com o gatilho de rota o carimbo bateria fora de
 * quadro e quem rolasse até aqui encontraria a peça já assentada — o defeito que a
 * SIS-188 nomeou.
 *
 * ── A LARGURA DO MIOLO DEPARTE DO `.container-lp`, E ISSO É DECLARADO ──
 * O doc pede contêiner entre `1440px` e `1520px`; o `.container-lp` da casa satura
 * em 1180px. Esta é a ÚNICA faixa full-bleed da rota (as irmãs continuam nos
 * 1180), e a grade 42/58 da mock com quatro cards de foto não cabe em 1116px
 * úteis sem os cards virarem selo e legenda. Então o miolo tem `max-width` própria
 * (`--svc-miolo`, 1480px) declarada em `servicos-palco.css`, e ela não vaza para
 * ninguém: nenhuma outra seção usa a classe.
 *
 * ── O QUE CONTINUA COM MOVIMENTO ──
 * SIS-273 tinha três escopos de reveal nesta rota e o escopo 2 vivia na cabeça da
 * pilha que saiu (`.svc-journey-head`). Ele não se perde: a coluna de texto recebe
 * `data-reveal-nome="servicos-abertura"` e a grade recebe
 * `data-reveal-nome="servicos-cards"`, com o calibre de ROTA
 * (`LIMIAR_REVEAL`/`MARGEM_REVEAL`) — o par `*_TRILHO` existia só porque o escopo
 * era o trilho `sticky`, e essa justificativa caduca junto com ele. O escopo 3 (o
 * CTA) segue intacto na página.
 */

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { Database, ShieldCheck } from 'lucide-react';
import CarimboBatida from '@/components/CarimboBatida';
import RevealScope from '@/components/motion/RevealScope';
import { useReducedMotion } from '@/lib/motion';
import { SERVICOS_DIFERENCIAIS } from '@/data/servicosDiferenciais';
import { LIMIAR_REVEAL, MARGEM_REVEAL } from '@/app/solucoes/reveal-calibre';
import './servicos-palco.css';

type Props = {
  /** Título da seção. Vem da página: a escrita é escrita da página. */
  titulo: string;
  /** Os dois parágrafos institucionais, na ordem em que aparecem. */
  paragrafos: string[];
  /** Os dois indicadores da mock: valor + legenda. */
  indicadores: { valor: string; legenda: string }[];
  /**
   * O que vem LOGO DEPOIS dos indicadores, dentro da coluna de texto.
   *
   * Existe por pedido em chat: o CTA «Quero um serviço exclusivo» vivia no
   * `container-lp` da PÁGINA, depois do palco inteiro, e caía muito abaixo dos
   * números — o palco é `min-height: 100vh` com `align-items: center`, então
   * entre o fim dos indicadores e o fim da seção havia a metade de baixo do
   * palco mais o `padding` dele. Nenhuma margem negativa resolve isso: o botão
   * tinha de entrar NO fluxo da coluna, e a coluna é deste componente.
   *
   * `ReactNode` e não um par `href`/`rotulo`: a escrita e o destino são da
   * página (é o que o comentário do `titulo` já diz), e o componente não deve
   * ganhar opinião sobre qual botão da casa entra aqui.
   *
   * Opcional: este componente tem um só mount hoje, mas um slot obrigatório
   * obrigaria o próximo a inventar conteúdo para preenchê-lo.
   */
  rodape?: React.ReactNode;
};

export default function ServicosPalco({ titulo, paragrafos, indicadores, rodape }: Props) {
  const rm = useReducedMotion();
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (rm) {
      v.pause();
      v.currentTime = 0;
      return;
    }
    /* A promessa pode ser rejeitada por política de autoplay (aba sem gesto). Nesse
       caso fica a base navy da folha, que é o fallback desejado. */
    void v.play().catch(() => undefined);
  }, [rm]);

  /* Os dois ícones lineares em ciano que o doc nomeia para os indicadores: banco de
     dados para as implementações, escudo com check para o foco em Seguros. */
  const ICONES_INDICADOR = [Database, ShieldCheck];

  return (
    <div className="svc-palco">
      <div aria-hidden className="svc-palco-midia">
        {/* Um só nó nos dois canais de movimento: a preferência muda ATRIBUTO, não
            árvore — trocar `<video>` por imagem conforme uma medida que só existe
            no cliente é divergência de hidratação garantida. */}
        <video
          ref={video}
          className="svc-palco-video"
          src="/videos/jornada.mp4"
          autoPlay={!rm}
          loop
          muted
          playsInline
          preload="metadata"
        />
      </div>
      {/* Três camadas de leitura, cada uma com um trabalho diferente: o véu navy
          chapado devolve a COR da seção (que era um palco escuro), o degradê
          reforça o fundo atrás do texto e dos cards, e a vinheta fecha as bordas.
          O doc pede as três — e o vídeo continua visível, sem competir. */}
      <div aria-hidden className="svc-palco-veu" />
      <div aria-hidden className="svc-palco-vinheta" />

      <div className="svc-palco-miolo">
        <div className="svc-palco-grade">
          <RevealScope
            className="svc-palco-abertura"
            limiar={LIMIAR_REVEAL}
            margem={MARGEM_REVEAL}
            data-reveal-nome="servicos-abertura"
          >
            {/* O carimbo SUBSTITUI a tag textual «Diferenciais»: a palavra está
                desenhada na arte, e repeti-la ao lado seria a mesma escrita duas
                vezes. Daí o `alt` ser o texto que a peça carrega. */}
            <span data-reveal="fade-up" className="svc-palco-carimbo">
              {/* A largura entra pela `className` do próprio carimbo, e não por
                  variável no invólucro: `--carimbo-batida-w` é DECLARADA em
                  `.carimbo-batida` (com o `clamp` de `/parceiros`), então uma
                  herança do pai perderia para a declaração do próprio elemento. */}
              <CarimboBatida
                className="svc-palco-carimbo-arte"
                src="/images/carimbo-diferenciais-ticket-outline-ffffff.png"
                alt="Diferenciais"
                larguraIntrinseca={978}
                alturaIntrinseca={348}
                gatilho="viewport"
              />
            </span>
            <h2 data-reveal="fade-up" className="svc-palco-titulo">
              {titulo}
            </h2>
            <div data-reveal="fade-up" className="svc-palco-lead">
              {paragrafos.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
            <dl data-reveal="fade-up" className="svc-palco-indicadores">
              {indicadores.map((ind, i) => {
                const Icone = ICONES_INDICADOR[i] ?? Database;
                return (
                  <div key={ind.valor} className="svc-palco-indicador">
                    <Icone aria-hidden className="svc-palco-indicador-icone" strokeWidth={1.75} />
                    <div>
                      <dt className="svc-palco-indicador-valor">{ind.valor}</dt>
                      <dd className="svc-palco-indicador-legenda">{ind.legenda}</dd>
                    </div>
                  </div>
                );
              })}
            </dl>
            {/* Dentro do MESMO escopo de reveal da abertura, e por isso sem
                `RevealScope` próprio: o botão entra junto com os números que ele
                acompanha. O `data-reveal` é o do nó, como nos irmãos acima —
                quem escreve o conteúdo não precisa saber disso, o slot é o
                invólucro. */}
            {rodape && (
              <div data-reveal="fade-up" className="svc-palco-rodape">
                {rodape}
              </div>
            )}
          </RevealScope>

          <RevealScope
            className="svc-palco-cards"
            limiar={LIMIAR_REVEAL}
            margem={MARGEM_REVEAL}
            data-reveal-nome="servicos-cards"
          >
            <ul className="svc-palco-lista">
              {SERVICOS_DIFERENCIAIS.map(({ id, titulo: t, descricao, foto, alt, Icone, destaque }) => (
                <li
                  key={id}
                  data-reveal="fade-up"
                  className={destaque ? 'svc-card svc-card--destaque' : 'svc-card'}
                >
                  <div className="svc-card-foto">
                    {/* `fill` exige pai com caixa própria e `position: relative`
                        (está na folha) e `sizes` declarado — sem ele o Next serve o
                        maior derivado em qualquer largura. Os valores saem da grade:
                        metade da coluna de 58% do miolo de 1480px no desktop, meia
                        janela no tablet, janela cheia no mobile.
                        `priority` NÃO entra: nesta versão do Next ele está
                        DEPRECIADO em favor de `preload` — e nenhuma destas quatro é
                        LCP de todo jeito, a seção começa a ~2.490px do topo. */}
                    <Image
                      src={foto}
                      alt={alt}
                      fill
                      sizes="(min-width: 1280px) 420px, (min-width: 768px) 46vw, 92vw"
                      className="svc-card-imagem"
                    />
                  </div>
                  {/* O selo fica na DIVISÃO entre foto e texto, e por isso é irmão
                      dos dois, nunca filho da figura: o card tem `overflow: hidden`,
                      então quem precisa cavalgar a emenda tem de estar no fluxo do
                      card. O ícone é componente SVG, não arte embutida na foto. */}
                  <span aria-hidden className="svc-card-selo">
                    <Icone className="svc-card-selo-icone" strokeWidth={1.75} />
                  </span>
                  <div className="svc-card-texto">
                    <h3 className="svc-card-titulo">{t}</h3>
                    <p className="svc-card-descricao">{descricao}</p>
                  </div>
                </li>
              ))}
            </ul>
          </RevealScope>
        </div>
      </div>
    </div>
  );
}
