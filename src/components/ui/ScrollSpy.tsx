'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { navIdiomaForPath, sectionsForPath } from '@/data/pageSections';
import { prefersReducedMotion } from '@/lib/motion';

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
  const [wide, setWide] = useState(false);
  /** A seção ativa está sobre fundo claro? O nav é `fixed` (fora de
   *  `.section-light`), então a cascata do CSS não o alcança. */
  const [onLight, setOnLight] = useState(false);

  useEffect(() => {
    /* SIS-100 — 1280px, e não os 1440px de antes. A coluna vive na margem
       esquerda, fora do `container-lp`: o que ela precisa é de margem sobrando,
       e a 1280 já sobra (o container satura antes disso). Com o corte em 1440 o
       recurso não existia em notebook nenhum, que é a tela da maior parte do
       público desta LP. Abaixo de 1280 ele continua OCULTO, de propósito: em
       tablet e celular a coluna disputaria a borda com o conteúdo, e nenhuma
       informação se perde — os mesmos destinos estão no menu do header e nas
       navegações internas de cada página. */
    const mq = window.matchMedia('(min-width: 1280px)');
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!wide || sections.length === 0) return;
    /* Elemento observado -> id do item. Muitas rotas guardam o id no `<h2>` da
       seção, porque esses ids nasceram como destino de `aria-labelledby`. Um
       `<h2>` é baixo o bastante para ATRAVESSAR a faixa de 5% do `rootMargin`
       entre dois quadros de scroll rápido sem nunca ser marcado, e ainda por cima
       não serve para detectar fundo claro/escuro. Então o que se observa é a
       `<section>` mais próxima, quando existe — e o id do item continua sendo o
       alvo do link, intacto. */
    const alvos = new Map<Element, string>();
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
          /* O id do ITEM, não `el.id`: o que está sendo observado pode ser a
             `<section>` que embrulha o `<h2>` que carrega o id (ver abaixo), e
             nesse caso `el.id` é vazio ou é outro id. */
          const item = alvos.get(el);
          if (!item) return;
          setActive(item);
          setOnLight(!!el.closest('.section-light'));
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
      alvos.set(observado, s.id);
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
               clique tem 44px de altura (`h-11`), que é o mínimo de toque. */
            className="group relative flex h-11 items-center rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-[#0ed8f6] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
          >
            <span
              aria-hidden
              className={`h-1.5 rounded-full transition-all duration-300 ${
                isActive
                  ? onLight
                    ? 'w-6 bg-[#0079CB]'
                    : 'w-6 bg-[#0ed8f6]'
                  : onLight
                    ? 'w-1.5 bg-[#0a1f44]/30 group-hover:w-3 group-hover:bg-[#0a1f44]/60'
                    : 'w-1.5 bg-white/25 group-hover:w-3 group-hover:bg-white/60'
              }`}
              style={
                isActive
                  ? { boxShadow: onLight ? '0 0 12px rgba(0,121,203,0.55)' : '0 0 12px #0ed8f6' }
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
                se este componente monta vive só no `matchMedia` acima. E o 1440
                foi MEDIDO contra o rótulo mais largo de `pageSections.ts`
                (`/quem-somos`, 150px): seção nova com rótulo mais comprido pede
                remedir o limiar. */}
            <span
              className={`scrollspy-rotulo ml-3 whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.16em] transition-opacity ${
                isActive
                  ? onLight
                    ? 'text-[#0a1f44] opacity-100'
                    : 'text-white opacity-100'
                  : onLight
                    ? 'text-[#0a1f44]/70 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100'
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
