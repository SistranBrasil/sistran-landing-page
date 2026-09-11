'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
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
  const onLight = tomAtivo === 'claro';
  const onMedium = tomAtivo === 'medio';

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
      { rootMargin: '-40% 0px -55% 0px', threshold: 0.01 },
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
      lang={idioma.lang}
      aria-label={idioma.rotulo}
      className="fixed left-3 top-1/2 z-30 flex -translate-y-1/2 flex-col gap-3 2xl:left-5"
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
