# Especificação de efeitos de scroll inspirados na Terminal Industries

Atualizado em 2026-09-09.

## Objetivo

Reproduzir no projeto atual a mesma linguagem de movimento observada nas duas seções de referência:

1. grade de marcas em que as logos surgem em sequência durante a rolagem;
2. seção narrativa em que a mídia permanece fixa e textos, números e imagens mudam conforme o usuário avança;
3. revelações consistentes para títulos, parágrafos, cards e demais elementos da página.

O resultado deve usar conteúdo, imagens, logotipos, cores e identidade do projeto. Não copiar textos, marcas ou arquivos de mídia da Terminal Industries.

## O que foi observado no site de referência

| Área | Comportamento |
| --- | --- |
| Título da grade de marcas | Título amplo e centralizado, separado da grade por bastante espaço em branco |
| Logos | Entrada `fade-up`: opacidade de 0 para 1 e deslocamento vertical de 24 px para 0 |
| Cascata das logos | Cada logo começa aproximadamente 100 ms depois da anterior |
| Grade | Dez colunas no desktop e duas no mobile, com células quadradas e linhas técnicas de 1 px |
| Retorno da rolagem | A animação pode ser revertida quando o usuário volta acima da seção |
| Seção narrativa | Texto à esquerda e mídia à direita; a mídia fica sticky no desktop |
| Texto principal | Revelação progressiva por caracteres, mudando de cinza claro para uma cor de sinal e depois para a cor final |
| Troca de mídia | Imagens empilhadas no mesmo espaço e transição por opacidade em aproximadamente 500 ms |
| Etapas | O item ativo é calculado pela passagem da seção pelo centro da viewport |
| Mobile | A narrativa deixa de ser um sticky longo e vira uma sequência horizontal com `scroll-snap` |

## Princípios obrigatórios

- Todo o conteúdo precisa existir no HTML antes da animação.
- A animação complementa a leitura; não pode ser necessária para entender a página.
- Usar transformações e opacidade sempre que possível para evitar reflow.
- Não aplicar divisão por caractere em parágrafos longos.
- Usar apenas uma animação dominante por seção.
- Não animar todas as logos simultaneamente.
- Não iniciar animações de elementos que ainda estejam fora da viewport.
- Em `prefers-reduced-motion: reduce`, mostrar tudo imediatamente e remover sticky longo, scrub, parallax e smooth scroll.

## Tokens de movimento

```css
:root {
  --motion-ease-out: cubic-bezier(.19, 1, .22, 1);
  --motion-fast: 300ms;
  --motion-base: 500ms;
  --motion-slow: 1000ms;
  --motion-logo: 2400ms;
  --motion-stagger-logo: 100ms;
  --motion-stagger-word: 55ms;
  --motion-stagger-char: 14ms;
  --motion-distance-sm: 24px;
  --motion-distance-md: 48px;
  --motion-signal: #abff02;
  --motion-ink: #052424;
  --motion-muted: #dddddd;
}
```

Substituir `--motion-signal`, `--motion-ink` e `--motion-muted` pelas cores da marca do projeto.

---

# Efeito 1 — grade de logos surgindo em cascata

## Estrutura visual

- Título centralizado acima da grade.
- Grade com células quadradas.
- Desktop: 10 logos por linha quando houver espaço suficiente.
- Tablet: 5 logos por linha.
- Mobile: 2 logos por linha.
- Linhas horizontais e verticais de 1 px com baixo contraste.
- Pequenas cruzes técnicas podem aparecer nas interseções da grade.
- Logos centralizadas, monocromáticas quando isso fizer parte da identidade do projeto.
- Não deformar as logos; usar `object-fit: contain`.

## Estado inicial

Cada logo começa com:

```css
opacity: 0;
transform: translate3d(0, 24px, 0);
will-change: transform, opacity;
```

## Estado final

```css
opacity: 1;
transform: translate3d(0, 0, 0);
```

## Gatilho e sequência

- Iniciar quando aproximadamente 20% da seção alcançar 50% da altura da viewport.
- Duração por item: `2.4s`.
- Easing: `expo.out` ou `cubic-bezier(.19, 1, .22, 1)`.
- Stagger: `0.10s` entre logos.
- Ordem: da esquerda para a direita e depois para a linha seguinte.
- Ao voltar acima do gatilho, permitir que a sequência seja revertida.
- Não repetir a animação ao oscilar dentro da própria seção.

## Implementação recomendada com GSAP

```ts
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const context = gsap.context(() => {
  gsap.fromTo(
    ".logo-wall [data-logo]",
    { opacity: 0, y: 24 },
    {
      opacity: 1,
      y: 0,
      duration: 2.4,
      ease: "expo.out",
      stagger: 0.1,
      scrollTrigger: {
        trigger: ".logo-wall",
        start: "20% 50%",
        toggleActions: "play none none reverse",
      },
    },
  );
});

return () => context.revert();
```

Em React/Next.js, executar somente no cliente, dentro de `useLayoutEffect`, e sempre destruir o contexto no cleanup.

## Animação das linhas da grade

As linhas podem surgir antes das logos para dar a sensação de que a interface está sendo montada:

1. linhas horizontais: `scaleX(0)` para `scaleX(1)`;
2. linhas verticais: `scaleY(0)` para `scaleY(1)`;
3. duração: `800ms`;
4. easing: `var(--motion-ease-out)`;
5. logos começam entre `150ms` e `250ms` depois das linhas;
6. cruzes técnicas entram com `opacity: 0` para `0.45`.

As linhas são decorativas e devem usar `aria-hidden="true"`.

## Hover das logos

No desktop, aplicar apenas um microefeito:

```css
.logo-cell:hover .logo-image {
  opacity: 1;
  transform: scale(1.035);
}

.logo-image {
  transition:
    transform 500ms var(--motion-ease-out),
    opacity 300ms ease;
}
```

Pode existir um brilho radial muito discreto na borda da célula. Não usar giro, tilt 3D ou movimento magnético em cada logo.

---

# Efeito 2 — revelação do título por linhas e palavras

Usar este efeito em títulos de seção e frases curtas, inclusive no título acima das logos.

## Estrutura

Cada linha precisa ficar dentro de uma máscara com `overflow: hidden`. As palavras continuam legíveis no DOM e recebem apenas elementos visuais auxiliares.

```html
<h2 class="reveal-title" aria-label="Título completo da seção">
  <span class="reveal-line" aria-hidden="true">
    <span class="reveal-line__inner">Título completo da seção</span>
  </span>
</h2>
```

## Animação

- Estado inicial: `opacity: 0` e `translateY(1.05em)`.
- Estado final: `opacity: 1` e `translateY(0)`.
- Duração: `900ms` a `1100ms`.
- Stagger entre linhas: `80ms`.
- Stagger entre palavras, quando usado: `45ms` a `60ms`.
- Gatilho: `top 82%` da viewport.
- Executar uma vez para títulos comuns.
- Não animar letra por letra em títulos grandes; usar palavras ou linhas.

```css
.reveal-line {
  display: block;
  overflow: clip;
}

.reveal-line__inner {
  display: block;
  opacity: 0;
  transform: translateY(1.05em);
}
```

---

# Efeito 3 — narrativa sticky com texto e imagem controlados pelo scroll

Este é o efeito da segunda captura: o usuário percorre as etapas, enquanto o texto da esquerda é ativado e a imagem da direita muda sem abandonar a viewport.

## Layout no desktop

- Seção em duas colunas.
- Texto: aproximadamente 38% a 42% da largura.
- Mídia: aproximadamente 58% a 62% da largura.
- Mídia com `position: sticky`.
- Altura da mídia: `calc(100svh - 70px)`.
- Topo sticky: aproximadamente `35px`.
- Cada etapa textual deve reservar entre `70vh` e `85vh`.
- A seção inteira precisa ter altura suficiente para todas as etapas.
- A imagem pode usar um `clip-path` industrial discreto, sempre com fallback retangular.

## Estrutura de dados

```ts
type StoryStep = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
};
```

Renderizar todas as etapas a partir de um array. Não vincular o conteúdo a classes como `.item-1`, `.item-2` ou índices espalhados pelo código.

## Detecção da etapa ativa

- Usar o centro da viewport como zona de ativação.
- Uma etapa se torna ativa quando cruza aproximadamente 50% da tela.
- Atualizar `activeIndex` apenas quando o índice realmente mudar.
- Evitar `setState` a cada pixel de scroll.
- Pode ser implementado com `IntersectionObserver` ou `ScrollTrigger`.

Configuração equivalente:

```ts
ScrollTrigger.create({
  trigger: storyList,
  start: "top 50%",
  end: "bottom 50%",
  scrub: true,
  onUpdate(self) {
    // Converter self.progress no índice da etapa ativa.
  },
});
```

## Entrada do bloco de texto

Quando a seção começar a entrar:

- título/contador inicia aproximadamente `160px` acima de sua posição;
- progride para `translateY(0)` conforme o topo da seção vai do final da viewport até 15% da viewport;
- a movimentação deve ser vinculada ao scroll, sem bounce.

## Texto progressivo por caracteres

Aplicar somente à frase principal de cada etapa.

### Estado visual

- caracteres ainda não percorridos: cinza claro;
- caractere em transição: cor de sinal da marca;
- caracteres concluídos: cor escura principal;
- atraso progressivo visual: `14ms` por caractere;
- transição de cor: aproximadamente `500ms`.

### Regra de progresso

```ts
const localProgress = clamp(sectionProgress - stepIndex, 0, 1);
const visibleCharacterCount = localProgress * characters.length;

characters.forEach((character, index) => {
  character.dataset.active = String(visibleCharacterCount > index);
});
```

### CSS conceitual

```css
.progressive-char {
  color: var(--motion-muted);
  transition: color 400ms ease;
}

.progressive-char[data-active="true"] {
  color: var(--motion-ink);
  animation: signal-to-ink 500ms ease both;
}

@keyframes signal-to-ink {
  0% { color: var(--motion-muted); }
  30% { color: var(--motion-signal); }
  100% { color: var(--motion-ink); }
}
```

O texto integral deve permanecer disponível para leitores de tela. Se os caracteres forem recriados em spans, usar `aria-hidden="true"` na versão dividida e manter uma versão acessível ou `aria-label` no elemento pai.

## Sublinhado progressivo

Para palavras destacadas, usar duas camadas:

1. camada de sinal, atrás;
2. camada escura, à frente;
3. ambas começam em `scaleX(0)`;
4. a camada de sinal avança primeiro;
5. a camada escura acompanha e substitui visualmente a primeira;
6. origem da transformação à esquerda.

Não usar `<u>` apenas por decoração quando o termo não tiver importância semântica. Um `span` com classe de destaque pode ser mais adequado.

## Troca das imagens

As mídias ficam empilhadas no mesmo container:

```css
.story-media {
  position: relative;
  overflow: hidden;
}

.story-media__item {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 500ms var(--motion-ease-out);
}

.story-media__item[data-active="true"] {
  opacity: 1;
}
```

Regras:

- primeira imagem precisa estar visível antes de o JavaScript iniciar;
- imagens seguintes usam lazy loading;
- a nova imagem entra por crossfade em `500ms`;
- pode aplicar `scale(1.015)` para `scale(1)` durante a entrada, mas sem zoom contínuo;
- pausar vídeos quando a etapa deixar de ser ativa;
- não reproduzir dois vídeos ao mesmo tempo;
- manter `alt` descritivo quando a imagem transmite informação.

## Contador de etapas

- Exibir `01`, `02`, `03` e assim por diante.
- Usar fonte monoespaçada e números tabulares.
- O número pode trocar com deslocamento vertical de 8 px e opacidade.
- Duração: `400ms`.
- Não alterar o valor acessível durante a animação intermediária.

---

# Efeito 4 — surgimento geral dos elementos da página

Padronizar a entrada de elementos com atributos declarativos:

```html
<div data-reveal="fade-up">...</div>
<div data-reveal="fade">...</div>
<div data-reveal="scale-soft">...</div>
```

## Presets

| Preset | Estado inicial | Duração | Uso |
| --- | --- | --- | --- |
| `fade-up` | `opacity: 0; translateY(32px)` | 800 ms | Cards, blocos de texto, logos isoladas |
| `fade` | `opacity: 0` | 600 ms | Elementos decorativos e mídia |
| `scale-soft` | `opacity: 0; scale(.96)` | 800 ms | Imagens e painéis grandes |
| `line-up` | `translateY(1.05em)` dentro de máscara | 1000 ms | Títulos |

## Gatilho geral

- Começar quando o topo do elemento chegar a 82%–88% da viewport.
- Stagger entre filhos: 60–100 ms.
- Para seções comuns, executar apenas uma vez.
- Para a grade de logos, manter a reversão observada na referência.
- Não esconder conteúdo com `display: none` antes da entrada.

## Ordem dentro de uma seção

1. eyebrow ou pequeno metadado;
2. título;
3. parágrafo;
4. CTA;
5. imagem, card ou grupo de logos.

O intervalo total entre o primeiro e o último item deve ficar normalmente abaixo de 700 ms, exceto na parede de logos.

---

# Comportamento no mobile

## Grade de logos

- Duas colunas.
- Manter células quadradas.
- Reduzir deslocamento inicial para 16 px.
- Duração: 900–1200 ms.
- Stagger: 60 ms.
- Carregar somente as logos próximas da viewport.

## Narrativa

Abaixo de `1024px`:

- remover o sticky prolongado;
- mostrar a mídia antes do texto ou acima do conjunto de etapas;
- transformar as etapas em cards horizontais com `scroll-snap-type: x mandatory`;
- largura de cada card: aproximadamente 85%;
- atualizar imagem e contador pelo card mais visível;
- permitir gesto de arrastar nativo;
- disponibilizar botões anterior/próximo com alvo mínimo de 44 × 44 px;
- não usar smooth scroll para controlar o gesto horizontal.

---

# Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }

  [data-reveal],
  [data-logo],
  .reveal-line__inner,
  .progressive-char,
  .story-media__item {
    animation: none !important;
    transition: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
}
```

No JavaScript, consultar `window.matchMedia("(prefers-reduced-motion: reduce)")`. Quando verdadeiro:

- não criar ScrollTriggers de scrub ou pin;
- não dividir textos em caracteres;
- manter a primeira mídia ou apresentar todas as mídias no fluxo normal;
- desabilitar Lenis ou qualquer smooth scroll.

---

# Arquitetura recomendada para Next.js/React

```text
components/
  motion/
    Reveal.tsx
    RevealText.tsx
    useReducedMotion.ts
  sections/
    LogoWallReveal.tsx
    ScrollFeatureStory.tsx
styles/
  motion.css
data/
  logos.ts
  featureSteps.ts
```

Responsabilidades:

- `Reveal`: entradas genéricas por viewport;
- `RevealText`: divisão segura por linhas, palavras ou caracteres;
- `LogoWallReveal`: grid, stagger e linhas técnicas;
- `ScrollFeatureStory`: etapa ativa, sticky, contador e mídia;
- `useReducedMotion`: uma única fonte de verdade para acessibilidade;
- arquivos de dados: textos, logos e mídias separados da lógica de animação.

Se o projeto for Vue/Nuxt, manter a mesma separação em componentes e composables. Não reescrever a stack existente apenas para aplicar os efeitos.

---

# Performance

- Animar `opacity` e `transform`; evitar animar `top`, `left`, `width` ou `height` continuamente.
- Não deixar `will-change` ativo em toda a página permanentemente.
- Criar ScrollTriggers depois que fontes e dimensões essenciais estiverem estáveis.
- Executar `ScrollTrigger.refresh()` depois do carregamento das mídias quando necessário.
- Definir `width` e `height` das logos e imagens para evitar CLS.
- Usar SVG, WebP ou AVIF fornecidos pelo projeto.
- Pausar observadores e vídeos fora da viewport.
- Não executar `setState` em todos os eventos de scroll.
- Alvos: LCP abaixo de 2,5 s, INP abaixo de 200 ms e CLS abaixo de 0,1.

---

# Critérios de aceite

## Grade de logos

- [ ] O título entra antes das logos.
- [ ] As logos surgem de baixo para cima, em cascata.
- [ ] A ordem segue a leitura da grade.
- [ ] Nenhuma logo é distorcida ou cortada.
- [ ] A grade possui 10/5/2 colunas conforme o breakpoint disponível.
- [ ] As linhas técnicas aparecem com baixo contraste.
- [ ] Voltar acima da seção reverte a animação sem piscar.

## Narrativa sticky

- [ ] A mídia permanece fixa no desktop enquanto as etapas avançam.
- [ ] A etapa muda quando cruza o centro da viewport.
- [ ] O texto progride de cinza para sinal e depois para a cor final.
- [ ] A imagem troca por crossfade em aproximadamente 500 ms.
- [ ] O contador acompanha a etapa ativa.
- [ ] Somente a mídia ativa executa vídeo ou animação.
- [ ] No mobile, a seção funciona sem pin e com scroll-snap.

## Acessibilidade e estabilidade

- [ ] O conteúdo é legível sem JavaScript.
- [ ] O conteúdo é legível com reduced motion.
- [ ] Leitores de tela recebem o texto completo, sem repetição por caractere.
- [ ] Não há salto significativo de layout.
- [ ] Não existe rolagem presa ao sair da seção.
- [ ] Navegação por teclado e foco continuam funcionando.

---

# Prompt de execução para Claude Code ou Codex

```text
Analise primeiro a stack, os componentes, os estilos globais e as dependências do projeto. Implemente os efeitos descritos no arquivo `efeitos-scroll-terminal-industries.md`, preservando a identidade visual, o conteúdo e os ativos atuais do projeto.

Prioridades:
1. Criar uma grade responsiva de logos com células técnicas e entrada fade-up em cascata controlada pelo scroll.
2. Aplicar revelação de títulos por linhas ou palavras, sem dividir parágrafos longos.
3. Criar uma seção narrativa em duas colunas no desktop: conteúdo à esquerda e mídia sticky à direita.
4. Alterar a etapa ativa quando cada texto cruzar o centro da viewport.
5. Revelar progressivamente a frase ativa por caracteres, passando de cinza para a cor de sinal e depois para a cor principal.
6. Trocar a mídia ativa por crossfade de aproximadamente 500 ms.
7. No mobile, remover o sticky prolongado e usar cards horizontais com scroll-snap.
8. Implementar prefers-reduced-motion, cleanup dos observadores/animações e fallback sem JavaScript.

Use GSAP com ScrollTrigger se essa biblioteca já existir ou se for compatível com a arquitetura atual. Em React/Next.js, inicialize as animações somente no cliente, use contexto por componente e destrua todos os ScrollTriggers no cleanup. Se o projeto já possuir outra solução de motion, reutilize-a quando ela atender aos mesmos requisitos sem duplicar bibliotecas.

Não copie textos, logos, imagens, nomes, CSS minificado ou arquivos da Terminal Industries. Reproduza somente a lógica de movimento com componentes e código originais. Não altere seções não relacionadas. Ao concluir, execute build e testes, verifique desktop e mobile e reporte os arquivos modificados.
```

## Referência analisada

- Site público: https://terminal-industries.com/
- Referência visual 1: grade de marcas com título centralizado.
- Referência visual 2: narrativa com texto progressivo e mídia sticky.

