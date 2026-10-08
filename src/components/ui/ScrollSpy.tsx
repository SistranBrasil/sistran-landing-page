'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { tomDoFundoEmPontos, type TomDoFundo } from '@/lib/tomDoFundo';
import {
  navIdiomaForPath,
  sectionsForPath,
  type PageSection,
} from '@/data/pageSections';
import { prefersReducedMotion } from '@/lib/motion';
import { criarConsultaDeMedia } from '@/lib/mediaStore';

/* SIS-182 — o limiar da coluna, lido por `useSyncExternalStore`.
   ⚠️ Esta string é citada por `globals.css:498` e por `latam/page.tsx:93` como "o
   `matchMedia` de `ScrollSpy.tsx:37`" — a linha andou, a string é a mesma. Ela e a
   `@media` correspondente mudam juntas. A razão dos 1280 está no comentário do
   efeito que ela substituiu, logo abaixo. */
const useColunaVisivel = criarConsultaDeMedia('(min-width: 1280px)');

/**
 * Navegador lateral de seções: coluna de traços na borda esquerda, o da seção
 * ativa aceso e com o rótulo visível.
 *
 * SIS-100 — o componente deixou de ter lista de seções própria. Ele lê o
 * `pathname` e busca o mapa em `src/data/pageSections.ts`, o que faz dele um só
 * mount por página SEM prop nenhuma: `PageShell` o monta para as treze rotas de
 * página interna e a home o monta direto (ela não usa o shell). Rota sem entrada
 * no mapa — página curta, legal ou dinâmica — não renderiza nada.
 */
export default function ScrollSpy() {
  const pathname = usePathname();
  const sections = sectionsForPath(pathname);
  /* SIS-121 — o idioma dos rótulos vem da rota, não do componente. Ver a nota em
     `pageSections.ts`: este `<nav>` é irmão do `<main>`, então o `lang="es"` que
     `/latam` declara dentro do main não o alcança. */
  const idioma = navIdiomaForPath(pathname);

  const [active, setActive] = useState('');
  /* SIS-182 — era `useState(false)` + o efeito comentado abaixo. */
  const wide = useColunaVisivel();
  /** Tom da seção ativa na margem esquerda. O nav é `fixed` (fora da árvore da
   *  seção), então a cascata do CSS não o alcança — o contraste do rótulo/traço/
   *  foco precisa de estado próprio.
   *  SIS-181 — duas fontes, nesta ordem: (1) `tom: 'claro' | 'medio'` explícito
   *  na entrada do mapa; (2) `closest('.section-light')` como reserva apenas
   *  quando `tom` está ausente. Assim `medio` também ganha da classe de pintura,
   *  e o fallback mantém certas as claras que já usam `.section-light`. */
  const [tomAtivo, setTomAtivo] = useState<'escuro' | NonNullable<PageSection['tom']>>(
    'escuro',
  );

  /* ⚠️ O TOM PASSOU A SER MEDIDO NO PONTO, e o `tomAtivo` acima virou só a
     RESERVA (ele continua alimentado pelo mapa, para o primeiro quadro e para
     quando a medição não responde).

     O que o modelo por seção não dava conta, medido em
     `/parceiros-e-implementacoes`: `#parceiros` é UMA seção de 16.680px cujo
     fundo na margem esquerda alterna entre branco e azul-marinho quatro vezes —
     porque ali o fundo são as FOTOS dos parceiros em tela cheia, não uma cor da
     seção. Com um tom só para a seção inteira, 72 de 120 passos de rolagem
     mediram abaixo de 4,5:1, e o pior deu 1,05:1. Nenhum valor declarado
     resolveria: a pergunta «claro ou escuro?» não tem resposta única dentro
     daquela seção.

     `tomMedido` responde pelo ponto onde a coluna está, a cada quadro de
     rolagem. `'midia'` é resposta de primeira classe: sobre fotografia não
     existe tinta certa, então em vez de escolher uma o rótulo ganha um véu
     próprio (ver o CSS de `.scrollspy-rotulo[data-tom='midia']`). */
  const [tomMedido, setTomMedido] = useState<TomDoFundo | null>(null);
  const navRef = useRef<HTMLElement | null>(null);

  const tom: TomDoFundo | 'escuro' = tomMedido ?? tomAtivo;
  const onLight = tom === 'claro';
  const onMedium = tom === 'medio';
  /* `'midia'` continua sem par de cores próprio e continua caindo no ramo `else`
     (branco + ciano), mas a RAZÃO mudou em 08/10/2026: o véu que a tornava legível
     foi retirado por pedido, e agora `'midia'` só sobra quando há raster que NÃO
     foi possível amostrar (canvas contaminado, mídia sem quadro). O caso comum —
     foto, vídeo e canvas já pintados — é amostrado por `tomDoFundo` e entra como
     COR, então vira claro/médio/escuro como qualquer superfície. Branco é a aposta
     de último recurso porque as fotos em sangria desta LP são veladas em marinho.
     Quem lê `'midia'` é o `data-tom` no `<nav>` — hoje só para diagnóstico. */

  // SIS-182 — substituído por `useColunaVisivel()` no topo do arquivo. O corpo
  // fica registrado porque a RAZÃO do limiar (SIS-100) é o que se consulta ao
  // mexer na coluna, e ela não cabe numa linha ao lado da string. Comentado com
  // `//` de propósito: o texto do SIS-100 já era um bloco `/* */`, e aninhar
  // fecharia o comentário externo no meio.
  //
  // SIS-100 — 1280px, e não os 1440px de antes. A coluna vive na margem
  // esquerda, fora do `container-lp`: o que ela precisa é de margem sobrando,
  // e a 1280 já sobra (o container satura antes disso). Com o corte em 1440 o
  // recurso não existia em notebook nenhum, que é a tela da maior parte do
  // público desta LP. Abaixo de 1280 ele continua OCULTO, de propósito: em
  // tablet e celular a coluna disputaria a borda com o conteúdo, e nenhuma
  // informação se perde — os mesmos destinos estão no menu do header e nas
  // navegações internas de cada página.
  //
  // useEffect(() => {
  //   const mq = window.matchMedia('(min-width: 1280px)');
  //   const update = () => setWide(mq.matches);
  //   update();
  //   mq.addEventListener('change', update);
  //   return () => mq.removeEventListener('change', update);
  // }, []);

  useEffect(() => {
    if (!wide || sections.length === 0) return;
    /* Elemento observado -> entrada do item (`PageSection`). Muitas rotas
       guardam o id no `<h2>` da seção, porque esses ids nasceram como destino de
       `aria-labelledby`. Um `<h2>` é baixo o bastante para ATRAVESSAR a faixa de
       5% do `rootMargin` entre dois quadros de scroll rápido sem nunca ser
       marcado, e ainda por cima não serve para detectar fundo claro/escuro.
       Então o que se observa é a `<section>` mais próxima, quando existe — e o
       id do item continua sendo o alvo do link, intacto. A entrada inteira
       (não só o id) chega até aqui porque SIS-181 precisa do `tom`. */
    const alvos = new Map<Element, PageSection>();
    /* Ordem de documento das seções observadas, e o conjunto das que estão
       cruzando a faixa AGORA. Os dois existem porque "último `entry` com
       `isIntersecting` ganha" está errado, e erra de um jeito que só aparece na
       primeira leitura: o `IntersectionObserver` entrega no PRIMEIRO callback o
       estado de cada alvo no momento em que ele foi observado, e esses relatórios
       chegam misturados com os do scroll que já aconteceu depois. Medido em
       `/esg` (rolagem instantânea até a seção 2): os `entries` vinham na ordem
       hero(true), Social(true), hero(true) — o hero, que estava a dois mil pixels
       acima da faixa, era o último a falar e ficava marcado como ativo, com o
       fundo dele decidindo o contraste. Era isso que deixava o traço ciano sobre
       a seção clara.

       Dois problemas distintos, ambos com o mesmo sintoma (traço ciano / rótulo
       branco onde o fundo é claro): (A) a ORDEM dos `entries` — resolvida aqui
       pelo conjunto `cruzando` + varredura de `ordem` de baixo para cima; (B) o
       VOCABULÁRIO do detector, que só conhecia `.section-light` e lia como
       escura toda superfície clara sem essa classe — resolvido em SIS-181 pelo
       campo `tom` no mapa, com o `closest` como reserva.

       Com o conjunto, cada callback só ATUALIZA a participação de quem falou
       (entra ou sai) e a seção ativa é escolhida no fim: a mais ABAIXO na página
       entre as que cruzam a faixa, que é a que o leitor acabou de alcançar. */
    const ordem: Element[] = [];
    const cruzando = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) cruzando.add(e.target);
          else cruzando.delete(e.target);
        });
        for (let i = ordem.length - 1; i >= 0; i -= 1) {
          const el = ordem[i];
          if (!cruzando.has(el)) continue;
          /* A entrada do ITEM, não `el.id`: o que está sendo observado pode ser a
             `<section>` que embrulha o `<h2>` que carrega o id (ver abaixo), e
             nesse caso `el.id` é vazio ou é outro id. */
          const secao = alvos.get(el);
          if (!secao) return;
          setActive(secao.id);
          /* SIS-181 — o tom explícito (`claro` ou `medio`) sempre ganha; o
             `closest` só classifica como claro quando o mapa ficou ausente. */
          setTomAtivo(
            secao.tom ?? (el.closest('.section-light') ? 'claro' : 'escuro'),
          );
          return;
        }
        /* Nada cruzando a faixa (respiro entre duas seções, fim de página): a
           marcação anterior FICA. Zerar aqui faria o indicador apagar por
           completo em todo vão entre seções, o que pisca sem informar nada. */
      },
      /* Faixa estreita no meio da tela: a seção ativa é a que cruza a linha de
         leitura, não a que está apenas visível. É isso que mantém a marcação
         certa nas seções com `sticky`/ScrollTrigger (Soluções, Números,
         ImpactSequence, StackScenes): a geometria delas muda durante a rolagem,
         mas o bloco que ocupa o meio da janela continua sendo o mesmo. */
      /* ⚠️ `threshold: 0` E NÃO `0.01`, e isto é um defeito corrigido, não um
         ajuste de gosto. `threshold` é fração da área DO ALVO, não da faixa — e a
         faixa aqui tem 5% da janela (100 − 40 − 55), ou ~45px a 900px de altura.
         Para uma seção ALTA, 1% da área dela é maior que a faixa inteira, então o
         cruzamento nunca é reportado e a seção nunca acende. Medido em
         `/parceiros-e-implementacoes`: `#parceiros` tem 16.680px (1% = 167px) e
         `#linha-do-tempo` 9.448px (1% = 94px), contra 45px de faixa — as duas
         eram invisíveis para o observador. O sintoma não era só a marcação errada:
         como o TOM vem da seção ativa, ele ficava presa em `escuro` e o rótulo
         saía branco sobre a seção clara, a 1,13:1. Quanto mais alta a seção, mais
         garantido o defeito, o que é o oposto do que um limiar deveria fazer.
         Com `0`, qualquer sobreposição conta — é o que a faixa estreita já
         expressa por si. Não afrouxa nada: quem decide o ativo é a varredura de
         `ordem` de baixo para cima, não o limiar. */
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (!el) return;
      const observado = el.closest('section') ?? el;
      alvos.set(observado, s);
      /* A ordem do mapa é a ordem da página — as listas em `pageSections.ts` são
         escritas na sequência em que as seções aparecem, que é o que o próprio
         indicador desenha na coluna. Não há segunda ordenação a manter em dia. */
      ordem.push(observado);
      observer.observe(observado);
    });
    return () => observer.disconnect();
  }, [wide, sections]);

  /* A MEDIÇÃO DO FUNDO. Roda na rolagem e no resize, coalescida por
     `requestAnimationFrame`: `elementsFromPoint` + `getComputedStyle` força
     layout, e chamar isso por evento de rolagem (que o Lenis dispara a cada
     quadro) seria duas leituras por quadro. Com o `rAF` é no máximo uma, e no
     momento em que o navegador já ia recalcular de todo jeito.

     ⚠️ O PONTO MEDIDO ERA O CENTRO DA COLUNA, e isso estava errado — corrigido em
     08/10/2026 pela conferência de todas as rotas. A coluna tem ~380px de altura
     (sete paradas) e o rótulo ATIVO pode estar em qualquer uma delas: medir o
     centro vertical pintava a palavra com a resposta de um lugar onde ela não
     está. Medido: «Integração» a 3,34:1 em `/solucoes/sds` e em `/quem-somos`,
     «Monitoramento» a 3,51:1 em `/solucoes/fast` — em todos, o ponto do centro era
     claro e o pedaço sob a palavra era o azul da marca, rgb(18,117,190).
     Agora os pontos são os do RÓTULO ATIVO (começo, meio e fim da palavra, na
     altura dela) mais o traço — e a tinta tem de fechar 4,5:1 contra o pior deles,
     que é o que `tomDoFundoEmPontos` faz. Três pontos e não um varrimento: o que
     muda atrás de 130px é emenda de seção ou borda de cartão, e as pontas são onde
     isso aparece.
     `navRef` entra como `ignorar` — sem isso o primeiro elemento da pilha seria o
     próprio nav e a medição se olharia no espelho. */
  useEffect(() => {
    if (!wide || sections.length === 0) return;
    let pedido = 0;
    const medir = () => {
      pedido = 0;
      const nav = navRef.current;
      if (!nav) return;
      const r = nav.getBoundingClientRect();
      /* O rótulo ativo é o único com `opacity: 1` em repouso — é a mesma condição
         que o CSS usa, então não há segunda fonte de verdade para «qual é o ativo».
         Abaixo de 1440 o CSS o apaga: aí não há tinta na tela e vale a coluna. */
      const rotulo = Array.from(
        nav.querySelectorAll<HTMLElement>('.scrollspy-rotulo'),
      ).find((n) => getComputedStyle(n).opacity === '1');
      const pontos: { x: number; y: number; principal?: boolean }[] = [
        /* O traço, que também é tinta e também precisa contrastar. */
        { x: r.left + 12, y: r.top + r.height / 2 },
      ];
      if (rotulo) {
        const q = rotulo.getBoundingClientRect();
        if (q.width > 0 && q.height > 0) {
          const meio = q.top + q.height / 2;
          pontos.push(
            { x: q.left + 2, y: meio },
            /* `principal`: o meio da palavra é onde está a massa dos glifos, e é por
               ele que a escolha se decide quando o rótulo atravessa uma emenda e
               nenhuma tinta fecha o piso nos dois lados — ver `tomDoFundo`. */
            { x: q.left + q.width / 2, y: meio, principal: true },
            { x: q.right - 2, y: meio },
          );
        }
      } else {
        pontos.push({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
      }
      const novo = tomDoFundoEmPontos(pontos, nav);
      /* `null` (ponto fora da janela) MANTÉM o tom anterior, pelo mesmo motivo que
         o observador mantém a seção ativa no vão entre duas: trocar de cor num
         quadro sem informação é piscada, não correção. */
      if (novo) setTomMedido((antes) => (antes === novo ? antes : novo));
    };
    const agendar = () => {
      if (pedido) return;
      pedido = requestAnimationFrame(medir);
    };
    medir();
    /* ⚠️ UMA MEDIÇÃO NA MONTAGEM NÃO BASTA, e isto era o pior defeito da conferência
       de 08/10/2026 — os únicos dois `1:1` que sobraram, em `/` e em
       `/parceiros-e-implementacoes`, os dois no TOPO da página.
       O mecanismo: na montagem a animação de entrada do hero ainda tem os nós em
       `opacity: 0`, e a medição PULA nó invisível (com razão — ele não pinta). A busca
       então cai até o `body`, que é o azul da marca `rgb(18,115,188)`, e responde
       `'escuro'` → tinta BRANCA. Um instante depois a entrada termina e o hero é
       claro, mas a medição só roda em `scroll`/`resize`: quem chega e NÃO rola fica
       com rótulo branco sobre superfície clara. Medido: três pontos lendo gradiente
       `rgb(242,249,254)`/`rgb(227,241,251)` com `data-tom="escuro"` — 1:1.
       Então remede algumas vezes depois da entrada. Os instantes cobrem a duração das
       animações de entrada da casa, e `fonts.ready` entra porque a troca de fonte
       muda a CAIXA do rótulo (e a caixa é o que define os pontos amostrados).
       Barato: cada remedição é uma leitura coalescida por `rAF`, e são quatro. */
    const atrasos = [60, 260, 700, 1400, 2400, 3600].map((ms) => window.setTimeout(agendar, ms));
    document.fonts?.ready.then(agendar).catch(() => undefined);
    /* ⚠️ E NÃO SÓ INSTANTES FIXOS. A primeira tentativa desta correção remedia em
       quatro instantes até 1,4s e TROCOU o defeito de lado: a medição passou a pegar
       um quadro intermediário da entrada (superfície ainda clara), fixar `'claro'` e
       não remedir quando a arte escura do hero finalmente pintava — navy sobre
       `rgb(9,30,67)`, 1,01:1 no topo de `/quem-somos`, `/solucoes` e
       `/parceiros-e-implementacoes`. Instante fixo é palpite sobre quando a página
       para de mudar.
       `load` em FASE DE CAPTURA no documento é o evento real: `<img>` e `<video>` não
       borbulham `load`, mas na captura o documento os vê — então cada arte que chega
       dispara uma remedição, que é exatamente quando a superfície mudou. Os instantes
       ficam como rede para o que não emite evento (fim de `transition`/`animation`). */
    const aoCarregarMidia = () => agendar();
    document.addEventListener('load', aoCarregarMidia, true);
    window.addEventListener('load', aoCarregarMidia);
    window.addEventListener('scroll', agendar, { passive: true });
    window.addEventListener('resize', agendar);
    /* Fim de animação/transição de entrada: o outro momento em que a superfície muda
       sem rolagem. `true` pela mesma razão do `load` — nem tudo borbulha. */
    document.addEventListener('transitionend', aoCarregarMidia, true);
    document.addEventListener('animationend', aoCarregarMidia, true);
    return () => {
      if (pedido) cancelAnimationFrame(pedido);
      for (const t of atrasos) clearTimeout(t);
      document.removeEventListener('load', aoCarregarMidia, true);
      window.removeEventListener('load', aoCarregarMidia);
      document.removeEventListener('transitionend', aoCarregarMidia, true);
      document.removeEventListener('animationend', aoCarregarMidia, true);
      window.removeEventListener('scroll', agendar);
      window.removeEventListener('resize', agendar);
    };
  }, [wide, sections]);

  if (!wide || sections.length === 0) return null;

  /**
   * Clique: Lenis primeiro, `window.scrollTo` como reserva — o mesmo par de
   * `Metrics.irParaIndicador` e `EssenceAccordion`. Sem isso o `href` nativo
   * salta e o Lenis, que guarda a própria posição animada, briga com o salto.
   *
   * A altura do cabeçalho fixo é descontada por `--header-h` (a mesma variável
   * que o `scroll-margin-top` do CSS usa), senão o título da seção pousa por
   * baixo dele. E com movimento reduzido a viagem é SALTO: uma duração de 0,8s é
   * movimento, e é exatamente o que a preferência recusa.
   */
  const irPara = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    const headerH =
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue('--header-h'),
      ) || 88;
    const alvo = el.getBoundingClientRect().top + window.scrollY - headerH - 24;
    const rm = prefersReducedMotion();
    const lenis = (window as unknown as { __lenis?: { scrollTo: (t: number, o?: object) => void } })
      .__lenis;
    if (lenis) lenis.scrollTo(alvo, { duration: rm ? 0 : 0.8 });
    else window.scrollTo({ top: alvo, behavior: rm ? 'auto' : 'smooth' });
    /* O foco vai para a seção, e não fica no link: quem navega por teclado
       precisa continuar a leitura DE LÁ. `preventScroll` porque a rolagem já é
       do Lenis — sem ele o navegador daria um segundo salto por cima do
       primeiro. */
    el.setAttribute('tabindex', '-1');
    (el as HTMLElement).focus({ preventScroll: true });
  };

  return (
    <nav
      ref={navRef}
      lang={idioma.lang}
      aria-label={idioma.rotulo}
      /* `data-tom` no NAV, e não em cada item: o véu de `'midia'` é um só, atrás
         da coluna inteira (ver `globals.css`). Um por item viraria fileira de
         etiquetas, e o traço de cada item também precisa do véu — ciano sobre
         foto clara mede 1,5:1 tanto quanto o rótulo branco. */
      data-tom={tom}
      className="scrollspy-coluna fixed left-3 top-1/2 z-30 flex -translate-y-1/2 flex-col gap-3 2xl:left-5"
    >
      {sections.map((s) => {
        const isActive = active === s.id;
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            onClick={(e) => irPara(e, s.id)}
            aria-current={isActive ? 'true' : undefined}
            /* `focus-visible` explícito: o traço tem 6px de altura e o anel
               padrão do navegador em cima dele é invisível na prática. O alvo de
               clique tem 44px de altura (`h-11`), que é o mínimo de toque.
               SIS-181 — o anel entra no mesmo par de cores do traço: ciano no
               escuro, `#0079CB` no claro e `#02070e` no médio. O último é uma
               cor documentada na paleta histórica dos palcos escuros e foi a
               mais clara desse repertório que fechou 4,5:1 em todos os azuis
               intermediários medidos. */
            className={`group relative flex h-11 items-center rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ${
              onLight
                ? 'focus-visible:ring-[#0079CB]'
                : onMedium
                  ? 'focus-visible:ring-[#02070e]'
                : 'focus-visible:ring-[#0ed8f6]'
            }`}
          >
            <span
              aria-hidden
              className={`h-1.5 rounded-full transition-all duration-300 ${
                isActive
                  ? onLight
                    ? 'w-6 bg-[#0079CB]'
                    : onMedium
                      ? 'w-6 bg-[#02070e]'
                    : 'w-6 bg-[#0ed8f6]'
                  : onLight
                    ? 'w-1.5 bg-[#0a1f44]/30 group-hover:w-3 group-hover:bg-[#0a1f44]/60'
                    : onMedium
                      ? 'w-1.5 bg-[#02070e]/45 group-hover:w-3 group-hover:bg-[#02070e]'
                    : 'w-1.5 bg-white/25 group-hover:w-3 group-hover:bg-white/60'
              }`}
              style={
                isActive
                  ? {
                      boxShadow: onLight
                        ? '0 0 12px rgba(0,121,203,0.55)'
                        : onMedium
                          ? '0 0 12px rgba(2,7,14,0.6)'
                          : '0 0 12px #0ed8f6',
                    }
                  : undefined
              }
            />
            {/* O rótulo é o nome acessível do link — daí não ser `aria-hidden`
                nem haver `aria-label` repetindo-o. Ele fica com `opacity: 0` até
                o hover/foco, mas segue no fluxo e legível para leitor de tela.

                O `opacity-100` do item ATIVO abaixo só vale de 1440 para cima:
                na faixa recolhida o CSS o apaga em repouso e o devolve em
                hover/`:focus-visible`, porque tirar do fluxo não move a tinta do
                ativo — ela já começava em 48px. Ver o bloco SIS-170.

                SIS-170 — `scrollspy-rotulo` é o gancho da regra que o RECOLHE
                abaixo de 1440px, onde a caixa deste rótulo cobria o texto do
                hero (a conta e o motivo estão em `globals.css`, no bloco
                SIS-170). Lá ele sai do FLUXO, não de vista: continua sendo o
                nome acessível do link. O 1440 vive só no CSS; o 1280 que decide
                se este componente monta vive só no `matchMedia` acima. O limiar
                foi REMEDIDO na Geist contra o rótulo mais largo de
                `pageSections.ts` (`/quem-somos`): tinta 131,53px (Inter) →
                127,08px (Geist); borda/caixa 169,53px → 165,08px; limiar
                mínimo calculado 1430,16px. O breakpoint 1439,98px foi
                preservado com folga. Seção nova com rótulo mais comprido pede
                remedir o limiar. */}
            <span
              className={`scrollspy-rotulo ml-3 whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.16em] transition-opacity ${
                isActive
                  ? onLight
                    ? 'text-[#0a1f44] opacity-100'
                    : onMedium
                      ? 'text-[#02070e] opacity-100'
                    : 'text-white opacity-100'
                  : onLight
                    ? 'text-[#0a1f44]/70 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100'
                    : onMedium
                      ? 'text-[#02070e] opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100'
                    : 'text-white/60 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100'
              }`}
            >
              {s.label}
            </span>
          </a>
        );
      })}
    </nav>
  );
}
