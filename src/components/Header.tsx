'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ChevronDown, Menu, X } from 'lucide-react';
import clsx from 'clsx';
import type Lenis from 'lenis';
import { NAV_ITEMS } from '@/data/nav';
import type { NavItem } from '@/data/types';
import { ehLinkExterno, matchActive, ramoAtivo } from '@/lib/navAtivo';
import ContactModal from './ContactModal';

const ACCENT = '#0ed8f6';
const PILL_BG = 'linear-gradient(135deg, rgba(14, 88, 147,0.78), rgba(15, 91, 152,0.72))';
const PILL_BG_STRONG = 'linear-gradient(135deg, rgba(14, 88, 147,0.94), rgba(15, 91, 152,0.90))';
const PILL_BORDER = '1px solid rgba(255,255,255,0.14)';
const PILL_SHADOW = '0 24px 60px rgba(13, 86, 143,0.35), inset 0 1px 0 rgba(255,255,255,0.06)';

/* ── SIS-266 · `matchActive` e `ramoAtivo` MUDARAM DE CASA ──────────────────
   As duas foram para `@/lib/navAtivo` (import acima) porque o rodapé passou a
   precisar da mesma regra na coluna "Navegação", e a issue manda extrair em vez
   de copiar. NADA da lógica mudou — o header segue idêntico na tela e continua
   sendo o único a passar `activeHash` de verdade.
   O corpo fica comentado porque é aqui que quem procura "por que o item acende"
   vai olhar primeiro; a explicação longa de cada regra está no módulo novo.

function matchActive(href: string, pathname: string, activeHash: string) {
  if (href.startsWith('/#')) {
    return pathname === '/' && activeHash === href.slice(1);
  }
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(href + '/');
}

// SIS-80/81/82 — um item com submenu acende também quando a rota atual é de um
// FILHO. Sem isto, estar em `/sistran-labs` não marcaria nada no header: a rota
// não aparece na lista de primeiro nível, e o menu inteiro ficaria apagado numa
// página que ele acabou de servir.
function ramoAtivo(item: NavItem, pathname: string, activeHash: string) {
  if (matchActive(item.href, pathname, activeHash)) return true;
  return (item.children ?? []).some((f) => matchActive(f.href, pathname, activeHash));
}
*/

/* O link de primeiro nível do menu desktop. Extraído porque agora ele é
   renderizado de dois lugares — solto e dentro do invólucro do submenu — e
   duplicar a marcação era duplicar o sublinhado ciano e o cálculo de cor. */
function LinkNav({
  item,
  isActive,
  current,
  compacto,
}: {
  item: NavItem;
  isActive: boolean;
  current: boolean;
  /* SIS-279 — 6px a menos de respiro lateral por item, e só onde a pílula
     carrega DUAS marcas. Ver a nota do bloco duplo mais abaixo: a 1440 o
     cabeçalho já fechava com 1px de sobra, então os 56px que estes sete itens
     devolvem são o que impede o botão «Fale com a gente» de sair da pílula.
     Nada mais muda — mesmo corpo de letra, mesma altura de alvo de clique. */
  compacto: boolean;
}) {
  return (
    <Link
      href={item.href}
      aria-current={current ? 'page' : undefined}
      /* A classe inteira nos dois ramos, em vez de `clsx(base, px-1.5|px-2.5)`:
         o extrator do copy-lock captura o literal escolhido por ternário, e
         `px-1.5` solto passa por escrita do site (chegou a entrar no lock na
         primeira volta desta issue). A classe completa ele descarta pela forma.
         A única diferença entre as duas linhas é o `px`. */
      className={
        compacto
          ? 'relative whitespace-nowrap px-1.5 py-2.5 text-[0.75rem] font-semibold transition-colors duration-200'
          : 'relative whitespace-nowrap px-2.5 py-2.5 text-[0.75rem] font-semibold transition-colors duration-200'
      }
      style={{ color: isActive ? '#fff' : 'rgba(255,255,255,0.68)' }}
    >
      {item.label}
      <span
        className="absolute bottom-[3px] left-1/2 h-[2px] w-3.5 -translate-x-1/2 rounded-full transition-transform duration-200"
        style={{
          background: ACCENT,
          transform: `translateX(-50%) scaleX(${isActive ? 1 : 0})`,
        }}
      />
    </Link>
  );
}

/* SIS-279 — a caixa do arquivo NÃO é a marca.

   Medido pixel a pixel (alfa > 12) nos dois arquivos que o header usa:

     `sistran-corp-logo.png`            560×374, tinta 506×127 em (19,103)
     `university/logo-university-header.webp`  291×96, tinta = o arquivo inteiro

   No corporativo a tinta ocupa 34% da altura do arquivo e fica ACIMA do centro
   dele. Dimensionar pela caixa, que é o que `object-contain` faz, tem duas
   consequências que só aparecem quando as duas marcas dividem a pílula: elas
   saem com tamanhos visíveis diferentes, e a corporativa fica ~5% mais alta que
   a outra na vertical. Pior: para a tinta corporativa chegar aos ~27px que
   equilibram a da University, a caixa teria de passar de 80px — não cabe nos
   72px da pílula no mobile.

   Por isso, NAS ROTAS COM MARCA PRÓPRIA, ela entra recortada na própria tinta.
   O invólucro tem o tamanho do que se vê — é ele que o flex mede, então o
   respiro até a nav sai do que se enxerga, e não do vazio do arquivo — e a
   imagem é posicionada dentro dele em PORCENTAGEM da tinta: proporção, não
   pixel, então a mesma conta vale nos dois tamanhos e sobrevive a qualquer troca
   de altura.

   SIS-287 (2ª volta) — o parágrafo acima fala de «as duas marcas dividindo a
   pílula» porque foi esse o caso que descobriu o problema; o par acabou, mas o
   recorte FICA, e por um motivo que independe dele: sem recortar, a altura que se
   escreve não é a altura do que se vê, e a marca da página apareceria menor do
   que a medida pedida, com o vazio do arquivo empurrando a nav.

   Nas outras rotas nada disto entra em cena: aquele caminho continua sendo o
   `<Image>` solto de antes, com `data-morph-target` e `onLogoClick`. */
const TINTA = {
  /* Arte trocada a pedido, fora do escopo do SIS-287 (que listou «trocar o
     arquivo da arte» como não-escopo) e por decisão dela: a nova é
     `public/images/university/logo-university.png`, 2033×773, com alfa de
     verdade e cor de verdade (`satMax 255`). A derivada vem de
     `scripts/gerar-marca-university-header.mjs`, que RECORTA na tinta medida
     (alfa > 12: x 42, y 96, 1942×641) e reduz para 96px de altura → 291×96.

     Duas consequências de o recorte já vir aplicado no arquivo:
       • `caixa` passa a ser o arquivo inteiro. `MarcaRecortada` continua sendo o
         caminho — ela é que garante que a altura escrita seja a altura do que se
         vê — só que agora com deslocamento zero.
       • a razão da tinta é 3,03, contra 3,05 da arte anterior. É por isso que
         `MARCA_DA_ROTA.university.altura` NÃO muda: a 42px a marca pinta ~127px,
         bem dentro dos ~201px que sobram na fila a 1440.

     O arquivo derivado, aliás, não existia mais na árvore de trabalho (aparecia
     apagado no `git status`) enquanto o `src` aqui continuava apontando para ele
     — este script também repõe isso. O PNG fonte fica no repo para regerar. */
  university: {
    src: '/images/university/logo-university-header.webp',
    alt: 'Sistran University',
    natural: { w: 291, h: 96 },
    caixa: { x: 0, y: 0, w: 291, h: 96 },
  },
  /* SIS-287 (2ª volta) — a tinta CORPORATIVA sai desta tabela porque perdeu o
     único chamador: ela existia para desenhar a segunda marca do par, e o par
     acabou. As demais rotas nunca passaram por aqui — lá a corporativa é o
     `<Image>` solto com `object-contain` no ramo `else`, intacto.

     Fica comentada, e não apagada, porque a medição da caixa é trabalho de
     medir arquivo (a tinta ocupa 34% da altura, deslocada para cima) e quem
     precisar dela de volta não deve refazer a conta:
       corporativa: {
         src: '/images/sistran-corp-logo.png',
         alt: 'Sistran',
         natural: { w: 560, h: 374 },
         caixa: { x: 19, y: 103, w: 506, h: 127 },
       }, */
  /* SIS-287 — a marca Labs. A `caixa` é o arquivo INTEIRO, ao contrário das duas
     de cima, porque o derivado já sai cortado na tinta: a arte entregue
     (`logosemfundo.png`, 1024x576) tem o fundo preto CHAPADO — nome mentiroso,
     `hasAlpha: false` — e quem recorta o alfa é
     `scripts/gerar-marca-labs-header-sis287.mjs`, onde está a medição toda.

     O número que manda no layout é a RAZÃO: a tinta desta marca é 961x219,
     razão 4,39, contra 3,05 da University. Ela é 44% mais larga para a mesma
     altura, e é por isso que as alturas abaixo não são as da University. */
  labs: {
    src: '/images/sistran-labs/logo-labs-header.webp',
    alt: 'Sistran Labs',
    natural: { w: 421, h: 96 },
    caixa: { x: 0, y: 0, w: 421, h: 96 },
  },
} as const;

function MarcaRecortada({
  marca,
  className,
}: {
  marca: (typeof TINTA)[keyof typeof TINTA];
  /* Só a ALTURA da tinta por breakpoint; a largura sai do `aspect-ratio`. */
  className: string;
}) {
  const { natural, caixa } = marca;
  return (
    <span
      className={clsx('logo-glow relative block flex-none overflow-hidden', className)}
      style={{ aspectRatio: `${caixa.w} / ${caixa.h}` }}
    >
      <Image
        src={marca.src}
        alt={marca.alt}
        width={natural.w}
        height={natural.h}
        priority
        className="absolute max-w-none"
        style={{
          width: `${(natural.w / caixa.w) * 100}%`,
          height: `${(natural.h / caixa.h) * 100}%`,
          left: `${(-caixa.x / caixa.w) * 100}%`,
          top: `${(-caixa.y / caixa.h) * 100}%`,
        }}
      />
    </span>
  );
}

/* SIS-287 (2ª volta) — as DUAS rotas que trocam a marca da pílula, numa tabela só.

   Antes esta tabela se chamava `PAR_DE_MARCAS` e cada linha trazia também a
   altura do `divisor`, porque a rota mostrava marca da página | fio | marca da
   casa. O par saiu: agora cada rota mostra UMA marca, a sua. O que sobrou de
   variável entre as duas continua sendo dado — arquivo, destino, rótulo e altura
   por faixa —, e o nome mudou para dizer o que a tabela é hoje; deixar
   `PAR_DE_MARCAS` seria documentação mentindo no próprio identificador.

   As linhas do divisor eram estas, para quem precisar reconstituir o par:
     university → 'h-[22px] md:h-[27px] [@media(min-width:1440px)]:h-[19px]'
     labs       → 'h-[18px] md:h-[26px] [@media(min-width:1440px)]:h-[15px]'

   AS ALTURAS DE 1440 RELAXARAM, e é a única mudança de número desta volta. Elas
   existiam por aperto de largura, não por gosto: com o par, o orçamento medido a
   1440 (`scripts/medir-marcas-header-sis279.mjs`) era de ~201px — caixa de
   conteúdo de 1208px menos menu compacto (833,1px), `mr-3` (12px) e botão
   (161,3px) —, e a marca da página tinha de caber ali JUNTO com divisor, respiros
   e corporativa. Daí 30px na University e 23px na Labs, contra os 42/40px de `md`:
   a marca do desktop grande ficava MENOR que a do tablet, o que só se explicava
   pela segunda marca ao lado.

   Sem par, o mesmo orçamento de ~201px recebe uma marca só: a University a 42px
   pinta 128px de largura (razão 3,05) e a Labs a 40px pinta 176px (razão 4,39).
   As duas entram, a Labs com ~25px de sobra — medido nesta volta, não deduzido.
   Então a faixa ≥1440 deixa de ter regra própria e herda `md`, e a marca para de
   encolher justamente onde há mais espaço.

   O `compacto` do menu CONTINUA ligado nas duas rotas. Ele devolve 56px que a
   Labs ainda precisa: sem ele o menu volta a 889,1px, o orçamento cai a ~145px e
   os 176px da Labs estouram. A University caberia sem o compacto, mas manter uma
   regra só para «rota com marca própria» evita que as duas divirjam por descuido.

   Consequência declarada, que o par escondia e uma marca só torna mais visível:
   nesta arte da Labs a palavra «SISTRAN LABS» é só 63 das 219 linhas de tinta
   (29% da altura), porque o símbolo do rosto/engrenagem ocupa a caixa inteira.
   A 40px de bloco a palavra sai com ~11,5px de caixa alta — melhor que os ~6,6px
   de antes, ainda menor que a da University. É o desenho do lockup entregue, em
   que o texto é a parte pequena; crescer o texto pediria recortar as trilhas de
   circuito, isto é, mexer na silhueta da marca, e a issue põe a troca de arte
   fora de escopo. */
const MARCA_DA_ROTA = {
  university: {
    marca: TINTA.university,
    href: '/sistran-university',
    rotulo: 'Sistran University, ir para a página da Sistran University',
    altura: 'h-[34px] md:h-[42px]',
  },
  labs: {
    marca: TINTA.labs,
    href: '/sistran-labs',
    rotulo: 'Sistran Labs, ir para a página da Sistran Labs',
    altura: 'h-[28px] md:h-[40px]',
  },
} as const;

export default function Header() {
  const pathname = usePathname();
  const isUniversity =
    pathname === '/sistran-university' || pathname.startsWith('/sistran-university/');
  /* SIS-287 — a rota Labs e suas subrotas, na mesma forma da University acima. */
  const isLabs = pathname === '/sistran-labs' || pathname.startsWith('/sistran-labs/');
  /* SIS-287 (2ª volta) — `par` virou `marcaDaRota`: o valor deixou de descrever um
     par de logos e passou a ser «a marca desta rota, ou nenhuma». `null` continua
     querendo dizer «rota comum, logo corporativa», e é o que o `compacto` do menu
     lê mais abaixo. */
  const marcaDaRota = isUniversity
    ? MARCA_DA_ROTA.university
    : isLabs
      ? MARCA_DA_ROTA.labs
      : null;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeHash, setActiveHash] = useState('');
  const [contactOpen, setContactOpen] = useState(false);
  /* `href` do item cujo submenu está aberto, ou `null`. Guardar a chave em vez
     de um booleano por item deixa a exclusão mútua implícita: abrir um fecha o
     outro, sem lista de estados para sincronizar. */
  const [submenu, setSubmenu] = useState<string | null>(null);
  /* Invólucro do submenu ABERTO (só ele monta o ref) — é o que decide se um
     clique veio de dentro ou de fora. */
  const submenuRef = useRef<HTMLDivElement | null>(null);
  const fecharTimer = useRef<number | null>(null);
  /* Aberto pelo teclado: o foco vai para o primeiro item quando ele existir. */
  const focarPrimeiro = useRef(false);

  const abrirSubmenu = useCallback((href: string) => {
    if (fecharTimer.current) {
      window.clearTimeout(fecharTimer.current);
      fecharTimer.current = null;
    }
    setSubmenu(href);
  }, []);

  /* SIS-87 — fechar com atraso. Mesmo com a ponte de `padding` cobrindo o vão,
     o trajeto do mouse até o item sai do invólucro em diagonal (o painel é mais
     estreito que o percurso, e o cursor passa raspando a borda): fechar no
     `mouseleave` imediato arrancava a lista debaixo do clique. 180ms tolera o
     trajeto sem manter o menu aberto quando a intenção foi sair. */
  const fecharSubmenuComAtraso = useCallback((href: string) => {
    if (fecharTimer.current) window.clearTimeout(fecharTimer.current);
    fecharTimer.current = window.setTimeout(() => {
      fecharTimer.current = null;
      setSubmenu((v) => (v === href ? null : v));
    }, 180);
  }, []);

  useEffect(
    () => () => {
      if (fecharTimer.current) window.clearTimeout(fecharTimer.current);
    },
    [],
  );

  /* SIS-65 — sobrou UMA leitura do scroll. `scrolled` (40px) só intensifica o
     fundo e acende o fio de baixo: mudança barata, que não reposiciona nada.

     O estado `compacto` (80px) saiu junto com a compactação. Ele reduzia a
     altura da pílula de 88px para 68px, e era ISSO que obrigava a logo a
     encolher — 5,5rem são exatamente os 88px da pílula expandida, então dentro
     de 68px a logo grande não caberia. Pedido é logo sempre no tamanho maior,
     e das duas saídas possíveis esta é a que entrega literalmente o tamanho da
     captura: a pílula deixa de encolher. O preço é 20px de viewport
     permanentes, que era a razão original de compactar (relatório de UX, p13 —
     cabeçalho de 88px come a primeira dobra). Fica registrado: quem quiser a
     dobra de volta tem de escolher a outra saída, uma logo que caiba em 68px.

     Sem `compacto` a altura é constante, então `--header-h` também é — e ela já
     está declarada como `88px` em `:root` no `globals.css`. O efeito que a
     reescrevia por quadro de estado saiu: escrever no `documentElement` um valor
     que nunca muda é só uma chance de os dois lugares divergirem. Quem depende
     dela (`scroll-margin-top` das âncoras, o sticky do `Differentials`) passa a
     ler a folha de estilo direto. */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isHome = pathname === '/';
  // hidden apenas no topo absoluto da home
  const hidden = isHome && !scrolled;

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => setSubmenu(null), [pathname]);

  /* Escape fecha o submenu. Efeito próprio, e não uma linha dentro do Escape do
     drawer: aquele só roda quando `open` é true, e o submenu do desktop existe
     justamente com o drawer fechado. */
  useEffect(() => {
    if (!submenu) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSubmenu(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [submenu]);

  /* Clique/toque fora fecha. `pointerdown` e não `click`: no touch o menu abre
     por clique no botão (não há hover), e um `click` no documento chegaria junto
     com o próprio clique que abriu, fechando na hora. */
  useEffect(() => {
    if (!submenu) return;
    const onDown = (e: PointerEvent) => {
      if (!submenuRef.current?.contains(e.target as Node)) setSubmenu(null);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [submenu]);

  /* Aberto por ArrowDown, o foco vai para o primeiro item — mas só depois de a
     lista sair do `hidden`, senão não há o que focar. */
  useEffect(() => {
    if (!submenu || !focarPrimeiro.current) return;
    focarPrimeiro.current = false;
    submenuRef.current?.querySelector<HTMLAnchorElement>('[data-item-submenu]')?.focus();
  }, [submenu]);

  // Na home, o <Link href="/"> navega para a rota atual e o Next não faz nada —
  // a página não sobe. Aqui interceptamos para rolar até o topo do hero.
  // Fora da home, deixamos o Link seguir a navegação normal.
  const onLogoClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (pathname !== '/') return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
      event.preventDefault();
      setOpen(false);
      const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
      if (lenis) lenis.scrollTo(0, { duration: 1.1 });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [pathname],
  );

  // Escape fecha o menu overlay
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  /* Com o menu aberto, o resto da pagina sai de circulacao. So esconder
     visualmente nao basta: o Tab continuava passando pelos links atras do
     drawer e o leitor de tela lia a pagina inteira por baixo do menu
     (relatorio de UX, p13). `inert` resolve os dois de uma vez. */
  useEffect(() => {
    if (!open) return;
    const fora = Array.from(document.querySelectorAll<HTMLElement>('#conteudo, footer')).filter(
      (el) => !el.contains(document.activeElement),
    );
    fora.forEach((el) => el.setAttribute('inert', ''));
    return () => fora.forEach((el) => el.removeAttribute('inert'));
  }, [open]);

  // Body no-scroll enquanto menu aberto
  useEffect(() => {
    const root = document.documentElement;
    if (open) root.classList.add('no-scroll');
    else root.classList.remove('no-scroll');
    return () => root.classList.remove('no-scroll');
  }, [open]);

  // Observa seções âncora só na home
  useEffect(() => {
    if (pathname !== '/') {
      setActiveHash('');
      return;
    }
    const ids = NAV_ITEMS.filter((n) => n.href.startsWith('/#')).map((n) => n.href.slice(2));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveHash(`#${entry.target.id}`);
        });
      },
      { rootMargin: '-38% 0px -52% 0px', threshold: 0.01 },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [pathname]);

  const openContact = useCallback(() => {
    setOpen(false);
    setContactOpen(true);
  }, []);

  return (
    <>
      <header
        className="fixed inset-x-0 top-4 z-50 mx-auto flex h-[72px] w-[min(1240px,calc(100%-32px))] items-center justify-between rounded-[20px] px-3 pl-5 text-white md:h-[88px]"
        style={{
          border: PILL_BORDER,
          background: scrolled ? PILL_BG_STRONG : PILL_BG,
          boxShadow: PILL_SHADOW,
          backdropFilter: 'blur(28px) saturate(1.4)',
          WebkitBackdropFilter: 'blur(28px) saturate(1.4)',
          /* SIS-65 — `height` e `top` saíram da lista: com altura e posição fixas
           elas eram transições sobre valores que nunca mudam. Sobra o que de
           fato reage a `scrolled`. */
          transition:
            'background var(--dur-base, 300ms) ease, box-shadow var(--dur-base, 300ms) ease',
        }}
      >
        {/* borda inferior gradient sutil */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-6 bottom-0 h-px"
          style={{
            /* A segunda parada era `rgba(124,58,237,0.35)`, violeta. A paleta da
             marca é branco + azuis e não admite roxo
             (`.claude/skills/sistran-marca`): agora o fio vai do ciano ao azul
             da marca, que é a mesma leitura de degradê dentro da família de cor
             certa. Vale para todas as páginas — o header é único. */
            background:
              'linear-gradient(90deg, transparent, rgba(14,216,246,0.55), rgba(0,121,203,0.35), transparent)',
            opacity: scrolled ? 1 : 0.5,
            transition: 'opacity 300ms ease',
          }}
        />
        {/* LOGO — identidade do site atual, não breadcrumb. */}
        {marcaDaRota ? (
          /* SIS-287 (2ª volta) — a pílula mostra UMA marca nestas rotas: a da
            própria página. O par «marca da página | divisor | corporativa» que
            morava aqui (SIS-279 na University, 1ª volta desta issue na Labs) foi
            desfeito por pedido, e com ele saíram o `<span>` do fio e o segundo
            `<Link href="/">`. Era este o bloco removido, em resumo:
              <div className="flex … gap-2.5 md:gap-3 …:gap-2">
                <Link href={par.href} …><MarcaRecortada marca={par.marca} …/></Link>
                <span aria-hidden className="w-px … bg-white/35 …" />
                <Link href="/" aria-label="Sistran, ir para a página inicial">
                  <MarcaRecortada marca={TINTA.corporativa}
                    className="h-[24px] md:h-[30px] …:h-[20px]" />
                </Link>
              </div>
            A corporativa a 24/30/20px repetia o tamanho que ela tem nas demais
            rotas, onde continua igual — nada aqui mexe naquele caminho.

            O `<div>` de flex também saiu: com um filho só, o `inline-flex` do
            próprio `<Link>` faz o alinhamento, e o `gap` não tinha mais o que
            espaçar. `flex-shrink-0` mudou de invólucro para o link, porque é ele
            quem agora responde pela largura da marca na fila do header.

            O DESTINO é a própria rota, como a issue pede no item 3 — quem clica
            numa marca que nomeia a página em que está espera continuar nela (e o
            Next não navega para a rota atual, então o clique é inerte, que é o
            comportamento honesto). A casa continua alcançável pelo menu «Quem
            somos» e pelo rodapé.

            Sem `data-morph-target`: o alvo da abertura da home é único por
            definição, e a abertura só roda na home, que não passa por aqui.
            `onLogoClick` também fica de fora — ele resolve «clicar na logo
            estando na home não faz nada», e esta marca não leva à home. */
          <Link
            href={marcaDaRota.href}
            aria-label={marcaDaRota.rotulo}
            className="inline-flex flex-shrink-0 items-center"
          >
            <MarcaRecortada marca={marcaDaRota.marca} className={marcaDaRota.altura} />
          </Link>
        ) : (
          <Link
            href="/"
            onClick={onLogoClick}
            aria-label="Sistran, ir para a página inicial"
            className="inline-flex flex-shrink-0 items-center gap-4"
          >
            {/* `data-morph-target`: destino da abertura opcional da home
            (OptionalMorphIntro). O atributo e so uma marca de medicao — o logo
            continua correto e visivel sem o efeito. */}
            {/* SIS-65 — uma altura só, a maior, sem depender de estado de scroll:
            4,5rem no estreito e 5,5rem a partir de `md`. O
            `transition-[height]` saiu com ela — altura fixa não transiciona.

            `width`/`height` corrigidos de 280x96 para 560x374, as dimensões
            REAIS do arquivo. Não é detalhe: com a razão errada (2,92 em vez de
            1,50) o `w-auto` reservava uma caixa de 256px de largura para uma
            marca que o `object-contain` pintava com 132px, e os ~124px
            restantes eram espaço morto entre a logo e a nav. Corrigir a razão
            não muda o tamanho aparente da marca — ela já era pintada a 132x88
            — só devolve o espaço e faz a caixa reservada bater com o que se vê,
            que é o que importa para CLS.

            Nitidez em tela 2x deixa de ser risco pelo mesmo motivo: 88px de
            exibição pedem 176px de fonte, e o arquivo tem 374px de altura. A
            preocupação da task partia dos 96px declarados, que não eram os do
            arquivo.

            O mesmo par errado está no `Footer.tsx` (360x124) com o mesmo
            arquivo; fora do escopo desta task, mas é a mesma correção. */}
            {/* SIS-279 — as ramificações `isUniversity` que existiam aqui (src,
            alt, width/height, classe) saíram: esta marcação passou a ser o
            caminho de TODAS AS ROTAS MENOS a University, então a condição era
            sempre falsa. Tamanho, arquivo e atributos da marca corporativa
            seguem exatamente os de antes. */}
            <Image
              data-morph-target=""
              src="/images/sistran-corp-logo.png"
              alt="Sistran"
              width={560}
              height={374}
              priority
              className="logo-glow h-[4.5rem] w-auto object-contain md:h-[5.5rem]"
            />
          </Link>
        )}

        {/* NAV desktop */}
        <nav
          aria-label="Navegação principal"
          className="ml-auto mr-3 hidden items-center gap-0.5 [@media(min-width:1440px)]:flex"
        >
          {NAV_ITEMS.filter((n) => n.href !== '/#contato').map((item) => {
            const isActive = ramoAtivo(item, pathname, activeHash);
            /* `isActive` acende o item (inclui o ramo); `current` é o
             `aria-current`, e esse tem de ser literal — em `/sistran-labs` o
             link para `/quem-somos` está aceso, mas não é a página atual. */
            const link = (
              <LinkNav
                item={item}
                isActive={isActive}
                current={matchActive(item.href, pathname, activeHash)}
                /* SIS-287 — era `isUniversity`. Agora é «esta rota tem marca
                 própria?», porque a razão do compacto nunca foi a University: são
                 os 56px que os sete itens devolvem para a marca caber.
                 2ª volta: sem o par, a Labs sozinha a 40px ainda pinta 176px, e
                 sem o compacto o menu volta a 889,1px e sobram ~145px — continua
                 estourando. Então o compacto FICA, e por medida, não por herança. */
                compacto={Boolean(marcaDaRota)}
              />
            );
            if (!item.children) return <span key={item.href}>{link}</span>;

            const idSub = `submenu-${item.href.replace(/\W+/g, '-')}`;
            const aberto = submenu === item.href;
            return (
              /* O ponteiro abre e fecha por `mouseenter`/`mouseleave` no INVÓLUCRO,
               não em cada item: o submenu fica dentro dele, então atravessar o
               vão entre o pai e a lista não conta como sair. O teclado usa o
               botão e o `blur` — `onBlur` só fecha quando o foco vai para fora
               do invólucro (`relatedTarget`), senão tabular do pai para o
               primeiro filho fecharia a lista que se acabou de abrir. */
              <div
                key={item.href}
                ref={aberto ? submenuRef : undefined}
                className="relative"
                onMouseEnter={() => abrirSubmenu(item.href)}
                onMouseLeave={() => fecharSubmenuComAtraso(item.href)}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setSubmenu(null);
                }}
                /* Teclado: ArrowDown abre e desce, ArrowUp sobe, Escape devolve o
                 foco ao botão. Tab continua percorrendo os itens sem fechar —
                 é o `onBlur` acima, que só age quando o foco sai do invólucro. */
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    if (!aberto) return;
                    setSubmenu(null);
                    e.currentTarget.querySelector('button')?.focus();
                    return;
                  }
                  if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
                  e.preventDefault();
                  if (!aberto) {
                    focarPrimeiro.current = true;
                    abrirSubmenu(item.href);
                    return;
                  }
                  const itens = Array.from(
                    e.currentTarget.querySelectorAll<HTMLAnchorElement>('[data-item-submenu]'),
                  );
                  if (!itens.length) return;
                  const atual = itens.indexOf(document.activeElement as HTMLAnchorElement);
                  const passo = e.key === 'ArrowDown' ? 1 : -1;
                  const alvo =
                    atual < 0
                      ? passo === 1
                        ? 0
                        : itens.length - 1
                      : (atual + passo + itens.length) % itens.length;
                  itens[alvo].focus();
                }}
              >
                <span className="inline-flex items-center">
                  {link}
                  {/* Botão separado do link, e não um pai que só abre a lista:
                    `/quem-somos` é uma página de verdade e continua a um clique
                    de distância. O rótulo do botão diz o que ele faz, porque
                    visualmente ele é só uma seta. */}
                  <button
                    type="button"
                    aria-expanded={aberto}
                    aria-controls={idSub}
                    aria-label={`${aberto ? 'Fechar' : 'Abrir'} submenu de ${item.label}`}
                    onClick={() => (aberto ? setSubmenu(null) : abrirSubmenu(item.href))}
                    className="-ml-1.5 inline-flex h-6 w-5 items-center justify-center rounded-md transition-colors hover:bg-white/10"
                  >
                    <ChevronDown
                      className="h-3.5 w-3.5 transition-transform duration-200"
                      strokeWidth={2.2}
                      style={{
                        color: isActive ? '#fff' : 'rgba(255,255,255,0.68)',
                        transform: aberto ? 'rotate(180deg)' : 'none',
                      }}
                      aria-hidden
                    />
                  </button>
                </span>

                {/* `hidden` de verdade, não `opacity: 0`: uma lista invisível mas
                  presente continuaria recebendo Tab e sendo lida por leitor de
                  tela. A transição de entrada perde-se, e é um preço aceitável
                  num menu de quatro linhas. */}
                {/* SIS-87 — o afastamento de 10px é `padding-top` deste invólucro,
                  e não `top: calc(100% + 10px)` no painel. Com o vão, o cursor
                  saía do invólucro no caminho até a lista, o `mouseleave`
                  disparava e o `hidden` arrancava os links antes do clique. O
                  padding é área do elemento: agora o percurso do gatilho até o
                  primeiro item nunca sai da região de hover. */}
                <div hidden={!aberto} className="absolute left-0 top-full z-10 pt-[10px]">
                  <ul
                    id={idSub}
                    className="min-w-[13rem] overflow-hidden rounded-[14px] border border-white/12 p-1.5"
                    style={{
                      background: PILL_BG_STRONG,
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      boxShadow: PILL_SHADOW,
                    }}
                  >
                    {item.children.map((filho) => {
                      const filhoAtivo = matchActive(filho.href, pathname, activeHash);
                      /* SIS-280 — «Sistran Latam» aponta para fora do app. A
                         aparência é a MESMA nos dois casos, então a classe é
                         calculada uma vez e os dois ramos a recebem: se ela
                         estivesse escrita duas vezes, o próximo ajuste de estilo
                         acertaria um item do submenu e esqueceria o outro. */
                      const externo = ehLinkExterno(filho.href);
                      const classeDoItem = clsx(
                        'block whitespace-nowrap rounded-[10px] px-3 py-2 text-[0.78rem] font-semibold transition-colors',
                        filhoAtivo
                          ? 'bg-white/12 text-white'
                          : 'text-white/70 hover:bg-white/8 hover:text-white',
                      );
                      return (
                        <li key={filho.label}>
                          {externo ? (
                            /* `<a>` e não `<Link>`: o `next/link` serve navegação
                               do roteador — para endereço absoluto ele não tem o
                               que prefetch nem transição a fazer, e usá-lo aqui
                               só esconderia atrás de um componente de rota o que
                               é uma saída do site. `target="_blank"` porque a
                               issue pede nova aba, e `rel="noopener noreferrer"`
                               vai COM ele: sem `noopener` a página de destino
                               recebe `window.opener` e pode reescrever esta.
                               Sem `aria-current`: nenhum endereço externo é a
                               página atual (`matchActive` devolve `false` por
                               guarda explícita desde esta issue).
                               O `onClick` fecha o submenu igual ao ramo interno —
                               a aba nova rouba o foco e a lista ficaria aberta
                               por baixo quando o visitante voltasse. */
                            <a
                              href={filho.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              data-item-submenu=""
                              onClick={() => setSubmenu(null)}
                              className={classeDoItem}
                            >
                              {filho.label}
                            </a>
                          ) : (
                            <Link
                              href={filho.href}
                              data-item-submenu=""
                              aria-current={filhoAtivo ? 'page' : undefined}
                              onClick={() => setSubmenu(null)}
                              className={classeDoItem}
                            >
                              {filho.label}
                            </Link>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            );
          })}
        </nav>

        {/* CTA — abre o modal de contato em vez de navegar para /#contato.
          <button>, nao <Link>: nao ha mudanca de rota. A secao #contato segue
          existindo na home e acessivel pelo menu. */}
        <button
          type="button"
          onClick={openContact}
          aria-haspopup="dialog"
          aria-expanded={contactOpen}
          className="hidden h-11 flex-shrink-0 items-center gap-3 rounded-[13px] bg-white px-4 text-[0.78rem] font-bold md:inline-flex"
          style={{ color: '#0b2550', boxShadow: '0 8px 24px rgba(0,0,0,0.16)' }}
        >
          Fale com a gente
          <ArrowUpRight className="h-3.5 w-3.5" style={{ color: '#087fc4' }} strokeWidth={2.4} />
        </button>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={open}
          className="ml-2 inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-white/12 bg-white/5 [@media(min-width:1440px)]:hidden"
        >
          {open ? (
            <X className="h-5 w-5" strokeWidth={1.8} />
          ) : (
            <Menu className="h-5 w-5" strokeWidth={1.8} />
          )}
        </button>

        {/* Mobile drawer */}
        <div
          className={clsx(
            'absolute inset-x-0 top-[calc(100%+8px)] overflow-hidden rounded-[20px] border border-white/12 text-white transition-[max-height,opacity] duration-300 [@media(min-width:1440px)]:hidden',
            open ? 'max-h-[80vh] opacity-100' : 'pointer-events-none max-h-0 opacity-0',
          )}
          style={{
            background: PILL_BG_STRONG,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: PILL_SHADOW,
          }}
        >
          <nav className="flex flex-col gap-0.5 p-3">
            {NAV_ITEMS.map((item) => {
              const isActive = matchActive(item.href, pathname, activeHash);
              return (
                /* No drawer o submenu fica sempre aberto, recuado sob o pai. Um
                 acordeão aqui só esconderia quatro linhas atrás de um toque
                 extra: o drawer já é uma lista rolável, e este é o lugar onde
                 estar visível vale mais que estar arrumado. */
                <div key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={clsx(
                      'block rounded-xl px-4 py-3 text-sm font-semibold transition-colors',
                      isActive
                        ? 'bg-white/10 text-white'
                        : 'text-white/70 hover:bg-white/5 hover:text-white',
                    )}
                  >
                    {item.label}
                  </Link>
                  {item.children ? (
                    <ul className="ml-4 mt-0.5 space-y-0.5 border-l border-white/12 pl-2">
                      {item.children.map((filho) => {
                        const filhoAtivo = matchActive(filho.href, pathname, activeHash);
                        /* SIS-280 — mesma bifurcação do submenu de desktop, pela
                           mesma razão, e com a classe calculada uma vez só. */
                        const externo = ehLinkExterno(filho.href);
                        const classeDoItem = clsx(
                          'block rounded-lg px-4 py-2.5 text-[0.8rem] font-semibold transition-colors',
                          filhoAtivo
                            ? 'bg-white/10 text-white'
                            : 'text-white/60 hover:bg-white/5 hover:text-white',
                        );
                        return (
                          <li key={filho.label}>
                            {externo ? (
                              /* O `onClick` aqui NÃO é cópia decorativa do ramo
                                 de desktop: o drawer fecha por
                                 `useEffect(() => setOpen(false), [pathname])`, e
                                 endereço externo não muda `pathname` nenhum — sem
                                 esta linha o menu ficaria escancarado atrás da aba
                                 nova, esperando um toque no fundo para sumir. */
                              <a
                                href={filho.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => setOpen(false)}
                                className={classeDoItem}
                              >
                                {filho.label}
                              </a>
                            ) : (
                              <Link
                                href={filho.href}
                                aria-current={filhoAtivo ? 'page' : undefined}
                                className={classeDoItem}
                              >
                                {filho.label}
                              </Link>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}
                </div>
              );
            })}
            <button
              type="button"
              onClick={openContact}
              aria-haspopup="dialog"
              aria-expanded={contactOpen}
              className="mt-2 inline-flex items-center justify-between rounded-xl bg-white px-4 py-3 text-sm font-bold"
              style={{ color: '#0b2550' }}
            >
              Fale com a gente
              <ArrowUpRight className="h-4 w-4" style={{ color: '#087fc4' }} strokeWidth={2.4} />
            </button>
          </nav>
        </div>
      </header>

      {/* Escurece o conteudo por tras do drawer: o menu antes flutuava sobre a
        pagina com contraste insuficiente entre texto e fundo em rolagem
        (relatorio de UX, p13). Decorativo — o Escape e o proprio botao ja
        fecham o menu pelo teclado. */}
      <div
        aria-hidden
        onClick={() => setOpen(false)}
        className={clsx(
          'fixed inset-0 z-40 bg-[#031326]/70 backdrop-blur-[2px] transition-opacity duration-300 [@media(min-width:1440px)]:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />

      {/* Fora do <header>: o header tem backdrop-filter, que cria um containing
        block e faria o `position: fixed` do modal se ancorar nele em vez de na
        viewport. */}
      {/* Sem `title`/`description` de proposito: o botao "Fale com a gente" abre o
        convite completo — sobretitulo, "Entre em contato conosco", telefone e
        formulario —, que é a escrita padrao do modal. */}
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}
