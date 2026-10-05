'use client';

/**
 * SIS-220 (3ª volta) — A FAIXA «ECOSSISTEMA» DA `/solucoes/luminna-ai`, REDESENHADA.
 *
 * O QUE ESTA VOLTA DESFAZ, dito por inteiro porque foi reprovado com essas palavras
 * («Não passa o pedido novo»): a 2ª volta publicou os oito produtos numa GRADE RÍGIDA
 * de quatro colunas de cartões brancos iguais, com título de seção «Luminna AI» e as
 * métricas sempre visíveis no pé. O desenho pedido agora está em
 * `docs/luminnaecosistema.md` e desenhado em `public/imagensexemplo/ecossitema.png`
 * (o arquivo tem o nome com erro de digitação; o caminho é esse e não foi renomeado —
 * renomear arte referida por issue quebra o rastro).
 * O JSX da 2ª volta fica comentado ao pé deste arquivo, não apagado, pela regra da
 * casa: quem comparar as duas voltas precisa ver o que saiu.
 *
 * ── 4ª VOLTA (pedido direto, sobre a tela da 3ª) ──────────────────────────────
 * Quatro correções pedidas em cima do que a 3ª volta publicou, e que SUCEDEM o que
 * `docs/luminnaecosistema.md` descreve nos pontos em que as duas coisas divergem —
 * o pedido é posterior ao documento:
 *   1. O FUNDO PERDEU A GRADE. «retire os quadrados de trás que foi colocado
 *      agora»: os `::before`/`::after` da seção saíram (ver o CSS). As curvas finas
 *      ficaram — são linha, não quadrado.
 *   2. ABRE COM O MOUSE, não com o clique. O cartão abre ao passar o ponteiro; o
 *      clique continua funcionando, e é o que sustenta teclado e toque (ver a nota
 *      em «O PAINEL DE RESULTADOS»).
 *   3. OS FILTROS E O CONTADOR SAÍRAM. Eram a linha inteira de controles («essa
 *      parte também», nas duas capturas). Com eles foi o estado de filtro, e os oito
 *      cartões passaram a estar sempre na tela.
 *   4. OS DOIS CARTÕES SEM MÉTRICA PERDERAM O BOTÃO. Não há mais «Conheça a solução
 *      →»: TEST AI e PROMPT AI terminam na descrição.
 * A dica do cabeçalho foi reescrita junto com (2) — dizer «selecione um card» sobre
 * uma faixa que abre por ponteiro seria instrução errada na tela.
 *
 * ── POR QUE COMPONENTE PRÓPRIO, E NÃO MAIS UM TRECHO DE `LuminnaAiPagina` ──────
 * A faixa deixou de ser marcação e passou a ter ESTADO: qual cartão está aberto.
 * `LuminnaAiPagina` já tem 1.600 linhas e um estado só (o modal de contato); enfiar
 * esse hook no meio dela faria toda a página re-renderizar a cada cartão que abre —
 * incluindo o hero, a sequência de impacto e o hub de integração. E com abertura por
 * PONTEIRO isso deixou de ser detalhe: passar o mouse pela grade dispara oito
 * re-renders seguidos. Isolado aqui, quem re-renderiza é a faixa.
 * O componente é `'use client'` como a página inteira já é, então isto não
 * acrescenta um grama de JavaScript ao bundle da rota.
 *
 * ── DE ONDE VEM CADA COISA ────────────────────────────────────────────────────
 * TÍTULO, SOBRANCELHA e DESCRIÇÃO vêm por prop, do bloco do dado
 * (`acceleratorPages.ts`) — é o que mantém a seção como parada do indicador
 * lateral e a âncora no mesmo lugar em que `pageSections.ts` a procura.
 * OS OITO CARTÕES vêm de `src/data/luminnaEcossistema.ts`, tipados, e são
 * renderizados por `map`: o critério de aceite da issue é literal («Dados em
 * estrutura tipada + `map` (não 8 JSX manuais)»).
 * OS ÍCONES ficam AQUI e não no dado: `lucide-react` é dependência de UI, e
 * nenhum arquivo de `src/data` importa componente React no projeto.
 *
 * ── A COMPOSIÇÃO BENTO ────────────────────────────────────────────────────────
 * Quatro colunas no desktop (Story+Doc · Estimate+Test · Code+Case · Fix+Prompt),
 * e a coluna QUE CONTÉM O CARTÃO ABERTO sobe ~64px. O documento descreve o
 * destaque falando só da terceira coluna, «quando o Luminna Code AI estiver
 * selecionado» — implementar literalmente «a terceira» deixaria o desenho errado
 * em todos os outros sete casos, com o cartão alto crescendo para baixo enquanto
 * uma coluna vizinha, vazia por cima, continua subida. Então a regra é a
 * GENERALIZAÇÃO da frase: sobe a coluna do cartão aberto. Com CODE AI aberto — o
 * estado inicial, que é o da mock — as duas leituras dão exatamente a mesma tela.
 * A subida é `transform` numa coluna, e o `fade-up` do reveal é `transform` em cada
 * CARTÃO: são nós diferentes, então não há dois donos do mesmo `transform` (o
 * defeito que o docblock da página registra).
 *
 * ── O FILTRO NÃO EXISTE MAIS (4ª volta) ───────────────────────────────────────
 * Ele existiu na 3ª volta, por pedido do documento, e foi retirado por pedido
 * direto. O que aquela passada resolveu e virou pó junto: remover do DOM em vez de
 * esconder com `opacity` (porque cartão invisível continua sendo parada de tabulação)
 * e derivar o painel aberto do conjunto visível em vez de sincronizar por efeito.
 * FICA REGISTRADO porque o documento ainda pede filtros: se eles voltarem, voltam
 * com essas duas decisões, não com `opacity` e `useEffect`.
 * O `map` por coluna e a guarda de coluna vazia sobreviveram — hoje nenhuma coluna
 * esvazia, mas a guarda é o que impede um vão do tamanho de uma coluna no dia em que
 * um produto sair do dado. O campo `categoria` também sobreviveu: ele ainda é a
 * ficha impressa em cada cartão, e era o filtro que o consumia como critério.
 *
 * ── O PAINEL DE RESULTADOS ────────────────────────────────────────────────────
 * Abre DENTRO do cartão, um por vez, sem modal e sem navegação.
 * O GATILHO É O PONTEIRO (4ª volta): `onMouseEnter` no cartão. O CLIQUE NO BOTÃO
 * CONTINUA, e não é redundância — é o único caminho para teclado e para toque, onde
 * `mouseenter` só chega depois do primeiro toque e ficaria colado. Por isso também
 * há `onFocus` no cartão: tabular até ele abre o painel, como o ponteiro faz.
 * Não existe fechar por `mouseleave`: sair do cartão fecharia o painel embaixo do
 * cursor que desceu para ler os números, e a grade piscaria a cada travessia. O
 * painel troca de cartão, nunca esvazia sozinho — o mesmo «um aberto por vez».
 * Os números contam de zero quando o painel abre — e contam porque o painel MONTA: o
 * efeito de contagem vive no nó do número, que só existe enquanto aberto. Não há
 * `useInView` aqui, ao contrário de `primitives/CountUp`: o gatilho é a abertura, não
 * a entrada em quadro, e aquele primitivo só aceita número puro (`'84'`), enquanto
 * estes valores carregam sinal e unidade (`+84%`, `−57%`).
 * MOVIMENTO REDUZIDO: os dois canais da casa são lidos dentro do efeito (a
 * preferência do sistema e `<html data-motion="reduce">`, o interruptor do site),
 * e no reduzido o número aparece PRONTO — nunca em zero, que é o defeito de
 * «desligar a animação» sem estado final.
 *
 * ── OS DOIS CARTÕES SEM MÉTRICA ───────────────────────────────────────────────
 * TEST AI e PROMPT AI não têm número na fonte, e a fonte manda não inventar. Na 3ª
 * volta eles mostravam «Conheça a solução →», abrindo o modal de contato da página;
 * na 4ª o botão foi retirado por pedido direto, e eles TERMINAM NA DESCRIÇÃO.
 * Consequência que vale dizer em voz alta: são os dois únicos cartões sem nada
 * clicável, então o `mouseenter` deles não abre painel nenhum — não há painel. É o
 * comportamento correto (não há número a mostrar), e não um botão que sumiu por
 * engano. Com o botão foi embora a prop `aoConhecer`, e a página deixou de passá-la.
 * A mock desenha «Ver resultados +» nesses dois cartões; é a mock que está em
 * conflito com o texto do documento, e o texto é que proíbe número inventado.
 */

import { useEffect, useState, type CSSProperties } from 'react';
import { animate, useMotionValue, useTransform, motion } from 'motion/react';
import {
  BookOpen,
  Bug,
  ClipboardCheck,
  CodeXml,
  FileText,
  FlaskConical,
  Info,
  MousePointerClick,
  Ruler,
  Sparkles,
  Terminal,
} from 'lucide-react';
/* `ArrowRight` saiu na 4ª volta: era a seta de «Conheça a solução →», e o botão
   inteiro foi retirado. */
import RevealScope from '@/components/motion/RevealScope';
/* `FILTROS_ECOSSISTEMA` e `FILTRO_TODOS` deixaram de ser importados na 4ª volta, com
   a linha de filtros. Continuam exportados pelo dado, comentados e com o motivo — ver
   `luminnaEcossistema.ts`. */
import {
  COLUNAS_ECOSSISTEMA,
  SOLUCAO_INICIAL,
  SOLUCOES_ECOSSISTEMA,
  type MetricaEcossistema,
} from '@/data/luminnaEcossistema';
import { LIMIAR_REVEAL, MARGEM_REVEAL } from './reveal-calibre';

/* ── OS ÍCONES, POR `id` E NÃO POR ÍNDICE ──────────────────────────────────────
   Por índice, incluir um produto no meio da lista trocaria o glifo de todos os
   seguintes em silêncio — foi assim que a 2ª volta escreveu (`ICONES[i]`) e é a
   única coisa daquela passada que não sobrevive por gosto, mas por segurança.
   Cada glifo é leitura literal do produto: livro aberto (STORY, histórias), régua
   (ESTIMATE, medir esforço), marcação de código (CODE), inseto (FIX, bugs e
   vulnerabilidades), folha de texto (DOC), frasco (TEST, teste unitário),
   prancheta conferida (CASE, teste funcional) e terminal (PROMPT, o comando que se
   dá à IA). São os mesmos oito glifos da mock. */
const ICONES: Record<string, typeof BookOpen> = {
  'story-ai': BookOpen,
  'estimate-ai': Ruler,
  'code-ai': CodeXml,
  'fix-ai': Bug,
  'doc-ai': FileText,
  'test-ai': FlaskConical,
  'case-ai': ClipboardCheck,
  'prompt-ai': Terminal,
};

/* Duração da contagem, em segundos. O mesmo 1.4 de `primitives/CountUp`, para os
   números do site não contarem em ritmos diferentes de uma página para outra. */
const DURACAO_CONTAGEM = 1.4;

/**
 * Um número de métrica contando de zero até o valor, com sinal e unidade
 * preservados.
 *
 * O texto animado vive num MotionValue e não em estado React — a cada quadro o
 * Motion escreve direto no nó, sem re-render do painel. É a mesma escolha de
 * `primitives/CountUp`, e a razão é a mesma: são até duas métricas por painel e o
 * painel é filho de um cartão com `transition` própria.
 *
 * O valor lido por leitor de tela é SEMPRE o final, num `.sr-only`; a parte que
 * anima é `aria-hidden`. Número correndo em região viva seria anunciado dezenas de
 * vezes.
 */
function NumeroMetrica({ metrica }: { metrica: MetricaEcossistema }) {
  /* `parseFloat` depois de tirar o sinal: o menos aqui é o tipográfico (U+2212),
     que `Number()` não entende — `Number('−57')` é `NaN`. O sinal é devolvido na
     hora de escrever, então ele nunca depende da matemática. */
  const sinal = metrica.valor.startsWith('+') || metrica.valor.startsWith('−') ? metrica.valor[0] : '';
  const unidade = metrica.valor.replace(/^[+−]/, '').replace(/[\d.,]/g, '');
  const alvo = parseFloat(metrica.valor.replace(/^[+−]/, '').replace(',', '.'));
  const numerico = Number.isFinite(alvo);

  /* Nasce no valor final, como `primitives/CountUp` faz desde a SIS-143: quem zera
     é o efeito, imediatamente antes de animar. Assim o primeiro quadro mostra o
     número CERTO, e sem JavaScript (ou com movimento reduzido) o que fica na tela é
     o valor, nunca um zero. */
  const contagem = useMotionValue(numerico ? alvo : 0);
  const texto = useTransform(contagem, (atual) => `${sinal}${Math.round(atual)}${unidade}`);

  useEffect(() => {
    if (!numerico) return;
    /* Os DOIS canais de movimento reduzido, lidos como `lib/useInViewCanvas.ts` os
       lê: a preferência do sistema e a escolha explícita gravada pelo site em
       `<html data-motion>`. Lidos no efeito e não no render — no render o valor
       precisa ser o mesmo do servidor, senão a hidratação diverge. */
    const reduzido =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      document.documentElement.dataset.motion === 'reduce';
    if (reduzido) return;

    contagem.set(0);
    const controles = animate(contagem, alvo, { duration: DURACAO_CONTAGEM, ease: 'easeOut' });
    return () => controles.stop();
  }, [alvo, contagem, numerico]);

  if (!numerico) return <span className="ecossistema-metrica-valor">{metrica.valor}</span>;

  return (
    <span className="ecossistema-metrica-valor">
      <motion.span aria-hidden>{texto}</motion.span>
      <span className="sr-only">{metrica.valor}</span>
    </span>
  );
}

type Props = {
  /** Título da faixa — o `heading` do bloco, que também é a âncora. */
  titulo: string;
  /** `id` da âncora, montado com `idDoBloco` por quem chama (o mesmo cálculo que
      `pageSections.ts` faz), para não haver dois lugares derivando id de texto. */
  idDaAncora: string;
  /** A sobrancelha — o `navLabel` do bloco («Ecossistema»). */
  sobrancelha?: string;
  /** A linha de apoio — o parágrafo do bloco. */
  descricao?: string;
  /* `aoConhecer` existiu na 3ª volta: abria o modal de contato da página pelos dois
     cartões sem métrica. Saiu com o botão «Conheça a solução →» na 4ª. */
};

export default function EcossistemaLuminna({ titulo, idDaAncora, sobrancelha, descricao }: Props) {
  const [solucaoAberta, setSolucaoAberta] = useState<string | null>(SOLUCAO_INICIAL);

  /* Os oito, sempre. `visiveis` desapareceu com o filtro (4ª volta) — e com ele o
     `abertaVisivel`, que existia só para fechar o painel de um cartão que o filtro
     tirava da tela. Hoje nenhum cartão sai da tela, então o estado JÁ É a verdade. */
  const colunaDestacada =
    SOLUCOES_ECOSSISTEMA.find((s) => s.id === solucaoAberta)?.coluna ?? null;

  return (
    <section
      className="ecossistema-secao section-py relative"
      aria-labelledby={idDaAncora}
      /* `data-secao-clara` não existe: a faixa continua CLARA para o indicador
         lateral (a chave está em `pageSections.ts`), mas não usa `.section-light` —
         o fundo azul-gelo com grade e curvas é próprio, e herdar o fundo da classe
         genérica repintaria por cima dele. */
    >
      {/* O FUNDO: grade técnica, curvas finas e cruzes. Tudo CSS e SVG, como o
          documento pede («construído preferencialmente com CSS e pseudo-elementos»)
          — a grade e as cruzes são `background-image` do `::before`/`::after` da
          seção, e só as CURVAS estão aqui, porque gradiente não desenha arco.
          `aria-hidden` + `pointer-events-none`: é decoração sobre uma área cheia de
          botões. */}
      <svg
        aria-hidden
        className="ecossistema-curvas pointer-events-none"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
        focusable="false"
      >
        <path d="M-40 250 C 320 120, 700 60, 1480 -40" />
        <path d="M-40 330 C 360 200, 760 140, 1480 30" />
        <path d="M-60 900 C 280 700, 420 460, 380 120" />
        <path d="M1480 880 C 1180 700, 1080 480, 1120 180" />
      </svg>

      <RevealScope
        className="container-lp relative z-10"
        limiar={LIMIAR_REVEAL}
        margem={MARGEM_REVEAL}
        data-reveal-nome="luminna-ecossistema"
      >
        <div className="ecossistema-cabecalho">
          <div className="ecossistema-cabecalho-texto">
            {sobrancelha && (
              /* `aria-hidden` porque, lida em sequência, a sobrancelha viraria
                 «Ecossistema Tecnologia aplicada em todo o ciclo» no leitor de tela,
                 que não é o nome do cabeçalho — e a palavra não se perde para
                 ninguém, porque é exatamente o rótulo que o navegador lateral
                 publica como texto de verdade. */
              <p aria-hidden data-reveal="fade-up" className="ecossistema-sobrancelha">
                <span className="ecossistema-sobrancelha-ponto" />
                {sobrancelha}
              </p>
            )}
            <h2
              data-reveal="fade-up"
              style={{ '--reveal-i': 1 } as CSSProperties}
              id={idDaAncora}
              className="font-display text-section ecossistema-titulo font-bold"
            >
              {titulo}
            </h2>
            {descricao && (
              <p
                data-reveal="fade-up"
                style={{ '--reveal-i': 2 } as CSSProperties}
                className="ecossistema-apoio"
              >
                {descricao}
              </p>
            )}
          </div>

          {/* A orientação discreta da mock. O TEXTO MUDOU NA 4ª VOLTA junto com o
              gatilho: o documento e a mock escrevem «Selecione um card para
              visualizar os resultados», que descrevia o clique. Com a abertura por
              ponteiro, aquela frase mandaria o visitante fazer a coisa menos direta —
              e instrução errada na tela é pior que divergir da fonte, que aqui já foi
              superada por pedido direto. «Passe o mouse» e não «aponte»: é a palavra
              que o pedido usou.
              `aria-hidden` no ícone e não no texto: a frase é instrução de uso, e
              quem navega por teclado precisa dela tanto quanto quem vê — para esse
              caminho o botão «Ver resultados» continua sendo a porta. */}
          <p
            data-reveal="fade-up"
            style={{ '--reveal-i': 2 } as CSSProperties}
            className="ecossistema-dica"
          >
            <MousePointerClick aria-hidden className="ecossistema-dica-icone" strokeWidth={1.8} />
            Passe o mouse em um card para visualizar os resultados.
          </p>
        </div>

        {/* ── A LINHA DE CONTROLES SAIU (4ª volta) ──────────────────────────────
            Eram as pastilhas «Todos / Planejamento / Engenharia / Qualidade /
            Conhecimento» e o contador «N de 8 soluções» com a barra, retirados por
            pedido direto («essa parte também», sobre as duas capturas). Guardado como
            marcação porque o documento AINDA os pede, e a próxima volta que os quiser
            de volta não precisa reinventar a a11y:

            | <div data-reveal="fade-up" style={cascata(3)} className="ecossistema-controles">
            |   {/* `role="group"` com nome: são cinco botões que fazem uma coisa só, e
            |       sem o grupo o leitor de tela anuncia «Planejamento, botão» sem dizer
            |       do quê. `aria-pressed` e não `aria-current`: é alternância, não
            |       posição na navegação. *}
            |   <div className="ecossistema-filtros" role="group" aria-label="Filtrar soluções por área">
            |     {FILTROS_ECOSSISTEMA.map((filtro) => (
            |       <button key={filtro} type="button"
            |               onClick={() => setCategoriaAtiva(filtro)}
            |               aria-pressed={categoriaAtiva === filtro}
            |               data-ativo={categoriaAtiva === filtro}
            |               className="ecossistema-filtro">{filtro}</button>
            |     ))}
            |   </div>
            |   {/* `aria-live="polite"`: quem filtra por teclado não vê a grade mudar,
            |       e esta é a única confirmação de que o clique fez algo. A barra é
            |       decoração da mesma informação, logo `aria-hidden`. *}
            |   <p className="ecossistema-contador" aria-live="polite">
            |     <span aria-hidden className="ecossistema-contador-barra">
            |       <span className="ecossistema-contador-preenchimento"
            |             style={{ width: `${(visiveis.length / SOLUCOES_ECOSSISTEMA.length) * 100}%` }} />
            |     </span>
            |     {visiveis.length} de {SOLUCOES_ECOSSISTEMA.length} soluções
            |   </p>
            | </div>

            O CSS das seis classes (`-controles`, `-filtros`, `-filtro`, `-contador`,
            `-contador-barra`, `-contador-preenchimento`) também ficou comentado, no
            fim de `globals.css`. */}

        <div className="ecossistema-grade">
          {COLUNAS_ECOSSISTEMA.map((coluna) => {
            const daColuna = SOLUCOES_ECOSSISTEMA.filter((s) => s.coluna === coluna);
            /* Coluna vazia não entra: numa grade de quatro trilhos de `1fr`, um
               `<div>` sem filho deixa um vão do tamanho de uma coluna. */
            if (daColuna.length === 0) return null;

            return (
              <div
                key={coluna}
                className="ecossistema-coluna"
                data-destaque={colunaDestacada === coluna}
              >
                {daColuna.map((solucao, i) => {
                  const Icone = ICONES[solucao.id] ?? Sparkles;
                  const aberta = solucaoAberta === solucao.id;
                  const temMetrica = solucao.metricas.length > 0;
                  const idDoPainel = `resultados-${solucao.id}`;

                  /* Só cartão COM métrica reage ao ponteiro: sem métrica não há painel
                     para abrir, e marcar os outros dois como interativos faria o
                     visitante passar por eles esperando algo. Fechar o que está aberto
                     também não serve — a faixa ficaria plana ao atravessar TEST ou
                     PROMPT no caminho para outro cartão. */
                  const abrir = temMetrica ? () => setSolucaoAberta(solucao.id) : undefined;

                  return (
                    <article
                      key={solucao.id}
                      data-reveal="fade-up"
                      style={{ '--reveal-i': 4 + coluna + i } as CSSProperties}
                      data-ativo={aberta}
                      className="ecossistema-cartao"
                      /* O gatilho da 4ª volta. `onMouseEnter` e não `onPointerEnter`:
                         em toque o `pointerenter` chega junto com o toque e abriria o
                         cartão sem intenção; `mouseenter` sintético, em toque, só
                         dispara depois — e ali quem manda é o clique no botão.
                         `onFocus` (que borbulha, ao contrário de `focus` nativo) cobre
                         o teclado: tabular até o botão abre o painel, como o ponteiro.
                         Sem `mouseleave`: ver o docblock. */
                      onMouseEnter={abrir}
                      onFocus={abrir}
                    >
                      <span aria-hidden className="ecossistema-cartao-curva" />

                      <div className="ecossistema-cartao-topo">
                        <span aria-hidden className="ecossistema-cartao-disco">
                          <Icone className="ecossistema-cartao-icone" strokeWidth={1.7} />
                        </span>
                        <span className="ecossistema-chip">{solucao.categoria}</span>
                      </div>

                      <h3 className="font-display ecossistema-cartao-nome">{solucao.nome}</h3>
                      <p className="ecossistema-cartao-texto">{solucao.descricao}</p>

                      {/* Só quem tem métrica tem botão. Os dois sem métrica terminam
                          na descrição desde a 4ª volta — o «Conheça a solução →» que
                          ficava aqui saiu por pedido direto; ver o docblock. */}
                      {temMetrica && (
                        <button
                          type="button"
                          onClick={() => setSolucaoAberta(aberta ? null : solucao.id)}
                          aria-expanded={aberta}
                          aria-controls={idDoPainel}
                          className="ecossistema-acao"
                        >
                          {aberta ? 'Ocultar resultados' : 'Ver resultados'}
                          {/* O sinal é `aria-hidden` porque o estado já está em
                              `aria-expanded` e no próprio rótulo, que muda. Lido,
                              ele viraria «Ver resultados mais». */}
                          <span aria-hidden className="ecossistema-acao-sinal">
                            {aberta ? '−' : '+'}
                          </span>
                        </button>
                      )}

                      {/* O painel só MONTA quando abre, e é isso que dispara a
                          contagem dos números (ver `NumeroMetrica`). `hidden` com o
                          nó sempre presente contaria uma vez, na carga, atrás do
                          cartão fechado. */}
                      {aberta && (
                        <div id={idDoPainel} role="region" aria-label="Resultados observados" className="ecossistema-painel">
                          <p className="ecossistema-painel-titulo">Resultados observados</p>
                          <div className="ecossistema-painel-metricas">
                            {solucao.metricas.map((metrica) => (
                              <div key={metrica.valor + metrica.rotulo} className="ecossistema-metrica">
                                <NumeroMetrica metrica={metrica} />
                                <span className="ecossistema-metrica-rotulo">{metrica.rotulo}</span>
                              </div>
                            ))}
                          </div>
                          <p className="ecossistema-painel-nota">
                            <Info aria-hidden className="ecossistema-painel-nota-icone" strokeWidth={1.8} />
                            Indicadores apresentados conforme resultados registrados.
                          </p>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            );
          })}
        </div>
      </RevealScope>
    </section>
  );
}

/* ── O QUE ESTAVA AQUI ATÉ A 2ª VOLTA (grade rígida de oito cartões iguais) ─────
   Guardado inteiro porque foi reprovado em cima de uma tela, e a próxima volta tem
   de poder ver o que era. Vivia dentro de `LuminnaAiPagina.tsx`, com os ícones em
   `ICONES_ECOSSISTEMA[i]` e as métricas em `item.highlights`:

   | <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
   |   {ecossistema.items.map((item, i) => {
   |     const Icone = ICONES_ECOSSISTEMA[i] ?? Sparkles;
   |     return (
   |       <li key={item.term ?? item.text}
   |           data-reveal="fade-up" style={cascata(i + 2)}
   |           className="luminna-cartao relative flex h-full flex-col items-start overflow-hidden rounded-2xl border border-[#0079CB]/[18%] bg-white p-5">
   |         <span aria-hidden className="luminna-selo relative mb-4 block h-14 w-14">
   |           <span aria-hidden className="luminna-arco absolute inset-0" />
   |           <span className="absolute inset-0 flex items-center justify-center">
   |             <Icone className="h-7 w-7 text-[#0079CB]" strokeWidth={1.9} />
   |           </span>
   |         </span>
   |         <h3 className="font-display text-sm leading-snug font-bold tracking-wide text-ink">{item.term}</h3>
   |         <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.text}</p>
   |         {item.highlights && item.highlights.length > 0 && (
   |           <ul className="mt-auto flex w-full flex-col gap-2 pt-5">
   |             {item.highlights.map((metrica) => (
   |               <li key={metrica} className="rounded-xl bg-[#0079CB]/10 px-3 py-2 text-xs leading-snug font-semibold text-[#0060A8]">
   |                 {metrica}
   |               </li>
   |             ))}
   |           </ul>
   |         )}
   |       </li>
   |     );
   |   })}
   | </ul>

   O que dele sobrevive por mérito, e não por inércia: o ícone como leitura literal
   do produto (os oito glifos são os mesmos) e a métrica como item curto separado da
   descrição. O que morreu: os oito cartões iguais, o branco puro, a métrica sempre
   à mostra e o título «Luminna AI» na seção. */
