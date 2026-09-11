# Especificação da seção com carrossel expansível

Referência de comportamento: https://terminal-industries.com/

Atualizado em 2026-09-09.

## Objetivo

Criar uma seção horizontal com abas, setas de navegação e cards que mudam de tamanho conforme o item selecionado. O card ativo deve se expandir para revelar descrição e CTA; os cards inativos permanecem estreitos, mostrando apenas categoria e título.

A implementação deve reproduzir a lógica de interação e a qualidade de movimento da referência, usando textos, imagens, cores, logos, links e identidade visual próprios do projeto.

---

# 1. Anatomia da seção

A seção é formada por cinco áreas:

1. **Introdução centralizada**: eyebrow opcional, título e parágrafo.
2. **Abas de categorias**: uma aba para cada card.
3. **Setas anterior/próximo**: deslocam horizontalmente o carrossel.
4. **Trilho horizontal**: contém todos os cards e permite scroll nativo.
5. **Cards expansíveis**: o item selecionado aumenta de largura e revela conteúdo detalhado.

```text
Seção
├── Introdução
│   ├── Eyebrow opcional
│   ├── Título
│   └── Parágrafo
├── Barra de controles
│   ├── Abas
│   └── Setas
└── Trilho horizontal
    ├── Card ativo expandido
    ├── Card inativo
    ├── Card inativo
    └── Card inativo
```

## Hierarquia visual

- Fundo predominantemente claro.
- Introdução centralizada e com largura controlada.
- Grande respiro entre a introdução e os controles.
- Abas alinhadas à esquerda.
- Setas alinhadas à direita.
- Cards altos e quase verticais quando fechados.
- Card ativo largo, criando contraste evidente com os demais.
- Parte do próximo card deve permanecer visível para comunicar continuidade horizontal.

---

# 2. Modelo de conteúdo

```ts
export type ExpandableCarouselItem = {
  id: string;
  tabLabel: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  backgroundColor: string;
  foregroundColor?: string;
  href?: string;
  ctaLabel?: string;
};
```

Exemplo estrutural com conteúdo genérico:

```ts
const items: ExpandableCarouselItem[] = [
  {
    id: "etapa-a",
    tabLabel: "ETAPA A",
    eyebrow: "ETAPA A",
    title: "Título principal da primeira solução",
    description: "Descrição objetiva do benefício apresentado neste card.",
    image: "/images/solucao-a.webp",
    imageAlt: "Descrição da imagem relacionada à solução A",
    backgroundColor: "var(--carousel-card-a)",
    href: "/solucoes/etapa-a",
    ctaLabel: "Ver solução",
  },
];
```

Não vincular o conteúdo a seletores como `.card-1`, `.card-2` ou a textos escritos diretamente na lógica da animação.

---

# 3. Medidas e composição

## Desktop — a partir de 1024 px

| Propriedade | Valor de referência |
| --- | --- |
| Largura do card fechado | `580px` |
| Largura do card ativo | `min(890px, 75vw - 2 × margem)` |
| Altura aproximada | `725px` |
| Proporção do card fechado | `0.8` ou `350 / 438` |
| Espaço entre cards | `20px` |
| Raio | `20px` |
| Distância controles → cards | `48px` |
| Altura das abas | `58px` |
| Tamanho das setas | `58px × 58px` |

A largura ativa observada equivale aproximadamente a:

```css
width: min(
  calc(var(--card-width) * 1.5 + var(--card-gap)),
  calc(75vw - 2 * var(--page-spacing))
);
```

O card aumenta horizontalmente, mas mantém uma altura derivada da largura fechada. Isso produz o formato panorâmico do item ativo.

## Tablet — de 768 px a 1023 px

- Card fechado: `350px`.
- Card ativo: aproximadamente `535px`, limitado pela viewport.
- Gap: `12px` a `16px`.
- Abas podem quebrar em mais de uma linha quando houver espaço.
- O trilho continua horizontal e tocável.

## Mobile — abaixo de 768 px

- Card: `calc(100svw - 2 * var(--page-spacing))`.
- Gap: `8px`.
- Um card principal por viewport.
- Abas em uma linha horizontal rolável.
- Setas aparecem abaixo do carrossel.
- Não deixar texto essencial depender de hover.
- Manter `scroll-snap` nativo.

---

# 4. Estado fechado do card

O card inativo apresenta:

- cor de fundo própria;
- eyebrow ou categoria em fonte monoespaçada;
- título grande;
- imagem preparada como camada de hover;
- recorte técnico lateral opcional;
- área inteira clicável.

## Composição

- Conteúdo alinhado no topo esquerdo.
- Padding no desktop: aproximadamente `80px 82px 28px 60px`.
- Eyebrow em caixa alta, 11–13 px, peso 600 e tracking amplo.
- Título em 44–46 px no desktop, peso 400 e line-height próximo de 1.1.
- Largura máxima do título: aproximadamente `426px`.

## Hover com revelação da imagem

Em dispositivos com mouse e hover real:

```css
.collapsed-card__media {
  position: absolute;
  inset: 0;
  opacity: 0;
  transform: scale(1.2);
  transition:
    opacity 900ms var(--carousel-ease),
    transform 1200ms var(--carousel-ease);
}

.collapsed-card:hover .collapsed-card__media {
  opacity: 1;
  transform: scale(1);
}
```

Adicionar uma camada escura radial ou uniforme entre a imagem e o texto para preservar contraste. Quando a imagem entrar, o texto pode mudar para branco.

Não aplicar esse hover em dispositivos touch.

---

# 5. Estado expandido

Ao selecionar o card:

1. o card aumenta sua largura;
2. o carrossel centraliza o item ativo;
3. a imagem ocupa todo o fundo;
4. entra um overlay escuro;
5. eyebrow, título, descrição e CTA surgem em cascata;
6. a aba correspondente muda para o estado ativo.

## Fundo do card ativo

Na referência, o fundo do card expandido usa imagem ampliada e fortemente suavizada:

```css
.expanded-card__image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(30px);
  transform: scale(1.1);
}

.expanded-card__overlay {
  position: absolute;
  inset: 0;
  background: rgb(0 0 0 / 30%);
}
```

O `scale(1.1)` evita bordas vazias geradas pelo blur.

## Conteúdo ativo

- Eyebrow no topo.
- Título imediatamente abaixo.
- Descrição abaixo do título.
- CTA alinhado ao canto inferior direito.
- Conteúdo sempre acima do overlay.
- Descrição pode possuir scroll vertical interno somente quando realmente necessário.
- Nunca cortar o CTA por causa da descrição.

## Entrada do conteúdo interno

Cada bloco começa em:

```css
opacity: 0;
transform: translateY(30px);
```

Após a expansão:

- atraso inicial: `150ms`;
- duração: `900ms`;
- stagger: `120ms`;
- easing: `expo.out` ou `cubic-bezier(.19, 1, .22, 1)`;
- ordem: eyebrow → título → descrição → CTA.

```ts
gsap.fromTo(
  activeCard.querySelectorAll("[data-card-content]"),
  { opacity: 0, y: 30 },
  {
    opacity: 1,
    y: 0,
    duration: 0.9,
    stagger: 0.12,
    ease: "expo.out",
    delay: 0.15,
  },
);
```

---

# 6. Transição de tamanho

## Animação principal

```css
.expandable-card {
  flex: 0 0 auto;
  width: var(--card-width);
  transition:
    width 600ms cubic-bezier(.19, 1, .22, 1),
    height 600ms cubic-bezier(.19, 1, .22, 1);
}
```

Não animar `flex-grow` junto com `width`, pois isso pode provocar cálculos conflitantes no trilho.

## Troca entre cards

Quando já houver um card expandido e outro for escolhido:

1. bloquear temporariamente novas transições;
2. fechar o card atual;
3. aguardar `transitionend` da propriedade `width`;
4. usar timeout de segurança entre `350ms` e `650ms`;
5. abrir o novo card;
6. recalcular a largura total do trilho;
7. centralizar o novo card;
8. liberar a interação.

Essa sequência evita que dois cards cresçam simultaneamente e façam o carrossel saltar.

Se o usuário clicar no card que já está ativo, permitir recolhê-lo.

---

# 7. Abas

## Aparência

- Altura: `58px`.
- Borda: 1 px.
- Raio: `8px`.
- Padding horizontal: `18px`.
- Fonte monoespaçada.
- Tamanho: `13px`.
- Peso: 600.
- Tracking: aproximadamente `0.14em` a `0.18em`.
- Texto em caixa alta.
- Transição de cor e fundo: `300ms`.

## Estado ativo

- Fundo levemente tingido com a cor principal.
- Borda transparente.
- Texto com contraste forte.
- Não depender apenas de cor: usar `aria-selected` e, se adequado à identidade, uma pequena barra ou ponto indicador.

## Comportamento

- Clicar em uma aba expande o card correspondente.
- A aba selecionada é centralizada automaticamente quando a lista de abas rola horizontalmente.
- Atualizar o estado ativo quando um card for selecionado diretamente.
- A aba e o card devem compartilhar o mesmo `activeIndex`.

Semântica recomendada:

```html
<div role="tablist" aria-label="Categorias da solução">
  <button
    role="tab"
    aria-selected="true"
    aria-controls="carousel-panel-etapa-a"
    id="carousel-tab-etapa-a"
  >
    ETAPA A
  </button>
</div>
```

---

# 8. Setas e rolagem

## Setas

- Dois botões quadrados de `58px`.
- Gap: `12px`.
- Ícone simples e centralizado.
- Botão indisponível recebe `disabled` real.
- O botão desabilitado não deve desaparecer; deve ficar visualmente atenuado.
- Hover do botão ativo pode inverter fundo e cor do ícone.

## Deslocamento

Cada clique deve mover aproximadamente 80% da largura visível do trilho:

```ts
const distance = carousel.clientWidth * 0.8;

carousel.scrollBy({
  left: direction === "next" ? distance : -distance,
  behavior: "smooth",
});
```

Atualizar os estados `canScrollPrev` e `canScrollNext` pela posição real do scroll, sem usar somente o índice ativo.

---

# 9. Scroll-snap e centralização do item ativo

```css
.expandable-carousel__track {
  display: flex;
  gap: var(--card-gap);
  width: 100%;
  max-width: 100vw;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-snap-type: x mandatory;
  scroll-padding-inline: var(--page-spacing);
  scrollbar-width: none;
  overscroll-behavior-inline: contain;
  -webkit-overflow-scrolling: touch;
}

.expandable-carousel__slide {
  flex: 0 0 auto;
  scroll-snap-align: start;
}

.expandable-carousel__track::-webkit-scrollbar {
  display: none;
}
```

Depois que o card terminar de expandir, centralizá-lo no trilho:

```ts
function centerCard(track: HTMLElement, card: HTMLElement) {
  const trackRect = track.getBoundingClientRect();
  const cardRect = card.getBoundingClientRect();

  const cardCenterInsideTrack =
    cardRect.left - trackRect.left + track.scrollLeft + cardRect.width / 2;

  const target = cardCenterInsideTrack - track.clientWidth / 2;

  track.scrollTo({
    left: Math.max(0, target),
    behavior: "smooth",
  });
}
```

Executar a centralização depois da transição de largura, não antes.

---

# 10. Recorte lateral técnico

Os cards fechados podem apresentar um recorte côncavo na lateral direita, funcionando como assinatura visual industrial.

Opções de implementação:

1. máscara SVG parametrizada;
2. `clip-path: path()` quando houver fallback;
3. pseudo-elemento com a cor do fundo da seção;
4. card retangular simples em navegadores sem suporte.

O recorte pode deslocar levemente sua posição vertical conforme o card atravessa a viewport. Limitar o movimento a uma faixa curta e suavizá-lo; ele não deve parecer um elemento solto.

Regras:

- usar o recorte somente nos cards fechados;
- esconder ou neutralizar o recorte no card ativo;
- manter a área clicável retangular;
- não aplicar o formato diretamente à imagem sem fallback;
- garantir que título e eyebrow nunca invadam o recorte.

---

# 11. Revelação da seção durante o scroll

Quando a seção entrar na viewport:

1. eyebrow aparece com `opacity`;
2. título sobe de uma máscara por linhas;
3. parágrafo entra com `opacity + translateY(20px)`;
4. abas e setas entram juntas;
5. cards entram com pequeno stagger horizontal ou vertical.

Valores recomendados:

| Elemento | Estado inicial | Duração | Atraso |
| --- | --- | --- | --- |
| Eyebrow | `opacity: 0` | 500 ms | 0 ms |
| Título | `translateY(1em)` | 900 ms | 80 ms por linha |
| Parágrafo | `opacity: 0; y: 20px` | 700 ms | 120 ms |
| Controles | `opacity: 0; y: 16px` | 700 ms | 180 ms |
| Cards | `opacity: 0; x: 32px` | 900 ms | 70 ms por card |

Gatilho: iniciar quando o topo da seção alcançar aproximadamente 82% da viewport. Executar uma vez.

Essa animação de entrada é independente da expansão dos cards.

---

# 12. Estados e fluxo de interação

Estados mínimos:

```ts
type CarouselState = {
  activeIndex: number | null;
  pendingIndex: number | null;
  isTransitioning: boolean;
  canScrollPrev: boolean;
  canScrollNext: boolean;
};
```

Fluxo ao selecionar:

```text
Usuário seleciona item
→ existe outro item aberto?
  → sim: armazenar pendingIndex
  → fechar atual
  → aguardar transição
  → abrir pendingIndex
  → não: abrir diretamente
→ centralizar aba
→ centralizar card
→ revelar conteúdo interno
→ atualizar setas
```

Durante `isTransitioning`, armazenar o último item solicitado em `pendingIndex`. Não descartar cliques rápidos silenciosamente e não permitir animações concorrentes.

---

# 13. Arquitetura recomendada para React/Next.js

```text
components/
  sections/
    ExpandableCarouselSection.tsx
  carousel/
    ExpandableCarousel.tsx
    ExpandableCarouselCard.tsx
    CarouselTabs.tsx
    CarouselNavigation.tsx
hooks/
  useExpandableCarousel.ts
  useReducedMotion.ts
styles/
  expandable-carousel.css
data/
  expandable-carousel-items.ts
```

Responsabilidades:

- `ExpandableCarouselSection`: introdução e composição geral;
- `ExpandableCarousel`: trilho, índice ativo, rolagem e coordenação;
- `ExpandableCarouselCard`: estados fechado/expandido e conteúdo;
- `CarouselTabs`: seleção e centralização das abas;
- `CarouselNavigation`: setas e estados disabled;
- `useExpandableCarousel`: transição sequencial e cálculo de scroll;
- `useReducedMotion`: comportamento alternativo acessível.

Preservar a stack atual do projeto. Se for Vue/Nuxt, implementar os mesmos limites em componentes e composables equivalentes.

---

# 14. Acessibilidade

- Usar `<section>` com título associado por `aria-labelledby`.
- Cada slide deve ser `<li>` dentro de `<ul>`.
- Cada card deve ser `<article>`.
- Usar botão real para expandir o card; não depender somente de `<div role="button">`.
- Expor `aria-expanded` no gatilho do card.
- Relacionar aba e painel com `aria-controls` e `aria-labelledby`.
- Permitir navegação das abas com setas esquerda/direita, Home e End.
- Enter e Espaço expandem o card focado.
- Manter foco visível em abas, cards, setas e CTA.
- A descrição não pode ser acessível apenas quando o card estiver em hover.
- Informar a posição do slide, por exemplo: `Slide 2 de 4`.
- Os botões anterior/próximo precisam de nomes acessíveis em português.

## Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  .expandable-card,
  .collapsed-card__media,
  [data-card-content] {
    transition-duration: 1ms !important;
    animation: none !important;
  }

  [data-card-content] {
    opacity: 1 !important;
    transform: none !important;
  }
}
```

Com reduced motion:

- manter expansão funcional, mas praticamente instantânea;
- usar rolagem `auto` em vez de `smooth`;
- não aplicar stagger;
- não animar blur, recorte ou imagem de fundo.

---

# 15. Performance e estabilidade

- Definir `width`, `height` ou `aspect-ratio` das imagens.
- Priorizar apenas a primeira imagem visível.
- Usar lazy loading nos itens posteriores.
- Usar WebP, AVIF ou SVG de origem própria.
- Não baixar imagens da referência.
- Cancelar timelines anteriores antes de animar o novo conteúdo.
- Escutar `transitionend` e manter timeout de segurança.
- Recalcular limites das setas depois de expandir ou recolher um card.
- Usar `ResizeObserver` no trilho para reagir a mudanças de viewport.
- Não usar `setInterval` para acompanhar o scroll.
- Evitar bibliotecas de carrossel quando scroll nativo e scroll-snap forem suficientes.
- Não bloquear a rolagem vertical da página durante o gesto horizontal.
- Validar CLS, navegação touch e comportamento com zoom do navegador.

---

# 16. Critérios de aceite

## Visual

- [ ] A introdução está centralizada e separada do carrossel por respiro amplo.
- [ ] As abas ficam à esquerda e as setas à direita no desktop.
- [ ] Cards fechados mantêm formato alto e estreito.
- [ ] O card ativo cresce horizontalmente em 600 ms.
- [ ] Parte do próximo card permanece visível quando houver conteúdo à direita.
- [ ] Imagem, overlay e texto mantêm contraste suficiente.
- [ ] O recorte lateral não invade o conteúdo.

## Interação

- [ ] Aba, clique no card e teclado atualizam o mesmo índice ativo.
- [ ] Selecionar outro item fecha o atual antes de abrir o próximo.
- [ ] O card ativo é centralizado depois da expansão.
- [ ] Clicar no item ativo permite recolhê-lo.
- [ ] Setas movem aproximadamente 80% da largura visível.
- [ ] Setas ficam desabilitadas corretamente nas extremidades.
- [ ] Conteúdo interno entra na ordem eyebrow, título, descrição e CTA.
- [ ] Não há salto brusco do trilho durante a troca.

## Responsividade

- [ ] Desktop usa card-base próximo de 580 px.
- [ ] Tablet usa card-base próximo de 350 px.
- [ ] Mobile mostra um card por viewport.
- [ ] Abas podem ser roladas no mobile.
- [ ] Setas ficam abaixo do carrossel no mobile.
- [ ] O gesto horizontal não bloqueia o scroll vertical.

## Qualidade

- [ ] Todos os controles funcionam por teclado.
- [ ] Reduced motion mantém toda a funcionalidade.
- [ ] O carrossel é utilizável sem JavaScript, por scroll horizontal.
- [ ] Imagens possuem dimensões e texto alternativo.
- [ ] Build e testes passam sem erros.
- [ ] Nenhum texto, logo, imagem ou arquivo da referência foi copiado.

---

# 17. Prompt pronto para Claude Code ou Codex

```text
Analise primeiro a stack, os componentes, os estilos globais, as dependências e os comandos de validação do projeto. Depois implemente uma seção de carrossel expansível seguindo integralmente o arquivo `secao-carrossel-expansivel-terminal.md`.

Objetivo visual:
- introdução centralizada com título e parágrafo;
- abas de categorias no topo esquerdo;
- setas anterior/próximo no topo direito;
- trilho horizontal com cards altos;
- um card ativo largo e os demais estreitos;
- parte do próximo card visível para indicar continuidade;
- linguagem tecnológica e industrial adaptada à identidade atual do projeto.

Comportamento obrigatório:
1. Cada aba corresponde a um card e ambos compartilham o mesmo activeIndex.
2. O card fechado mostra eyebrow e título; em desktop, a imagem aparece com opacity e zoom suave no hover.
3. O card ativo cresce horizontalmente em 600 ms usando cubic-bezier(.19, 1, .22, 1).
4. Quando outro card for selecionado, primeiro recolha o atual, aguarde transitionend da largura e somente depois expanda o novo.
5. Depois da expansão, centralize o card e a aba selecionada por scroll suave.
6. No card ativo, revele eyebrow, título, descrição e CTA com opacity 0 → 1, y 30 → 0, duração de 900 ms, stagger de 120 ms e atraso inicial de 150 ms.
7. As setas devem mover aproximadamente 80% da largura visível e usar disabled real nas extremidades.
8. Usar scroll-snap e rolagem horizontal nativa no trilho.
9. No mobile, mostrar um card por viewport, abas roláveis e setas abaixo do trilho.
10. Implementar teclado, foco visível, aria-expanded, relacionamento entre tabs e painéis e prefers-reduced-motion.

Preserve textos, cores, imagens, links e identidade do projeto. Não copie textos, logos, imagens, nomes, CSS minificado ou arquivos da Terminal Industries. Não altere seções não relacionadas. Reutilize as bibliotecas existentes; adicione GSAP somente se o projeto já a utiliza ou se a necessidade de animação justificar a dependência.

Ao terminar:
- execute build, lint e testes disponíveis;
- verifique desktop, tablet e mobile;
- teste clique rápido entre itens, resize, teclado e reduced motion;
- reporte os arquivos criados ou modificados e qualquer decisão técnica relevante.
```

