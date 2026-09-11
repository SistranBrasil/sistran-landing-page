# Como implementar a seção sticky storytelling

Referência de comportamento: https://terminal-industries.com/

Atualizado em 2026-09-09.

## Objetivo

Criar uma seção narrativa controlada pelo scroll com:

- conteúdo textual na coluna esquerda;
- painel de imagem ou vídeo na coluna direita;
- painel de mídia fixo durante a passagem pelas etapas;
- frase ativa revelada progressivamente;
- contador de etapas;
- troca de mídia sincronizada com o texto;
- recorte lateral técnico entre texto e imagem;
- versão mobile sem sticky prolongado.

A lógica pode ser inspirada na referência, mas os textos, imagens, vídeos, métricas, cores, nomes e identidade visual devem ser próprios do projeto.

---

# 1. Como a seção funciona

A seção possui várias etapas. Cada etapa associa um texto a uma imagem ou vídeo.

Durante a rolagem no desktop:

1. a seção entra na viewport;
2. a imagem permanece fixa na coluna direita;
3. os textos continuam avançando verticalmente na coluna esquerda;
4. quando um texto cruza o centro da viewport, ele se torna a etapa ativa;
5. o contador muda, por exemplo, de `01` para `02`;
6. a frase ativa muda de cinza para a cor final, caractere por caractere;
7. a mídia correspondente entra por crossfade;
8. ao chegar à última etapa, a seção volta ao fluxo normal da página.

```text
Scroll da página
→ etapa cruza o centro da viewport
→ atualiza activeIndex
→ anima contador
→ revela a frase
→ troca imagem ou vídeo
→ continua até a próxima etapa
```

O scroll do usuário não deve ser bloqueado, acelerado ou substituído por uma rolagem automática.

---

# 2. Estrutura visual

## Desktop

- Layout em duas colunas.
- Coluna de texto: aproximadamente 44%–48%.
- Coluna de mídia: aproximadamente 52%–56%.
- Painel de mídia quase na altura inteira da viewport.
- Grande espaço em branco no lado textual.
- Texto principal alinhado à esquerda.
- Mídia encostada ou próxima da lateral direita.
- Linha divisória formada pelo próprio recorte da mídia.

## Proporções recomendadas

| Elemento | Valor |
| --- | --- |
| Altura da mídia | `calc(100svh - 70px)` |
| Topo sticky da mídia | `35px` |
| Altura mínima por etapa | `70vh`–`85vh` |
| Largura máxima da frase | `14ch`–`18ch` |
| Espaço entre etapas | `clamp(12rem, 22vw, 21.5rem)` |
| Tamanho da frase | `clamp(2.25rem, 3.1vw, 3.85rem)` |
| Line-height da frase | `1.15`–`1.22` |
| Número da etapa | `11px`–`13px` |

---

# 3. Estrutura de componentes

Para React/Next.js:

```text
components/
  sections/
    StickyMediaStory.tsx
    StickyMediaStory.module.css
  motion/
    ProgressiveText.tsx
    useReducedMotion.ts
data/
  sticky-story.ts
```

Responsabilidades:

- `StickyMediaStory`: layout, índice ativo, observadores e sincronização;
- `ProgressiveText`: divisão visual e revelação segura da frase;
- `useReducedMotion`: comportamento alternativo acessível;
- `sticky-story.ts`: conteúdo e mídia separados da animação.

Preservar a stack atual do projeto. Em Vue/Nuxt, usar componente client e composables equivalentes.

---

# 4. Modelo de dados

```ts
export type StoryStep = {
  id: string;
  eyebrow?: string;
  title: string;
  description?: string;
  media: {
    type: "image" | "video";
    src: string;
    poster?: string;
    alt: string;
  };
};
```

Exemplo genérico:

```ts
export const storySteps: StoryStep[] = [
  {
    id: "diagnostico",
    eyebrow: "Diagnóstico",
    title: "Transforme dados dispersos em decisões claras.",
    media: {
      type: "image",
      src: "/images/diagnostico.webp",
      alt: "Painel abstrato representando análise de dados",
    },
  },
  {
    id: "automacao",
    eyebrow: "Automação",
    title: "Conecte processos e reduza atividades manuais.",
    media: {
      type: "video",
      src: "/videos/automacao.mp4",
      poster: "/images/automacao-poster.webp",
      alt: "Fluxo automatizado conectando operações",
    },
  },
];
```

Não escrever o conteúdo diretamente dentro da lógica de scroll e não depender de classes como `.step-1`, `.step-2` ou `.step-3`.

---

# 5. HTML semântico esperado

```tsx
<section className={styles.story} aria-labelledby="story-title">
  <div className={styles.layout}>
    <div className={styles.copyColumn}>
      <header className={styles.stickyHeader}>
        <h2 id="story-title">Título da narrativa</h2>
      </header>

      <ol className={styles.steps}>
        {steps.map((step, index) => (
          <li
            key={step.id}
            className={styles.step}
            data-step-index={index}
          >
            <span className={styles.stepNumber} aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>

            <ProgressiveText
              text={step.title}
              active={activeIndex === index}
            />
          </li>
        ))}
      </ol>
    </div>

    <div className={styles.mediaColumn}>
      <div className={styles.stickyMedia}>
        {steps.map((step, index) => (
          <StoryMedia
            key={step.id}
            media={step.media}
            active={activeIndex === index}
          />
        ))}
      </div>
    </div>
  </div>
</section>
```

Usar `<ol>` porque as etapas possuem ordem. O título completo de cada etapa deve continuar disponível para tecnologias assistivas.

---

# 6. CSS estrutural

```css
.story {
  --story-ink: #052424;
  --story-muted: #dddddd;
  --story-signal: #abff02;
  --story-paper: #ffffff;
  position: relative;
  background: var(--story-paper);
}

.layout {
  display: grid;
  grid-template-columns: minmax(0, 0.48fr) minmax(0, 0.52fr);
  min-height: 100%;
}

.copyColumn {
  position: relative;
  padding-inline: clamp(2rem, 5.4vw, 6.5rem);
}

.stickyHeader {
  position: sticky;
  top: 34vh;
  z-index: 2;
  width: max-content;
  max-width: 100%;
}

.steps {
  display: flex;
  flex-direction: column;
  gap: clamp(12rem, 22vw, 21.5rem);
  margin: 15rem 0;
  padding: 0;
  list-style: none;
}

.step {
  position: relative;
  min-height: 70vh;
  display: flex;
  align-items: center;
}

.stepNumber {
  position: absolute;
  left: -2.5rem;
  top: 50%;
  transform: translateY(-50%);
  color: #b8bdbc;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  font-variant-numeric: tabular-nums;
}

.mediaColumn {
  position: relative;
}

.stickyMedia {
  position: sticky;
  top: 2.1875rem;
  height: calc(100svh - 4.375rem);
  overflow: hidden;
  background: #e7e8e8;
}
```

O título da seção pode ficar sticky separadamente, desde que não cubra a frase ativa. Ajustar `top` e margens com base no header real do projeto.

---

# 7. Recorte técnico lateral

O painel de mídia apresenta uma lateral esquerda recortada. O objetivo é criar uma transição industrial entre o fundo branco e a imagem.

## Versão com clip-path

```css
.stickyMedia {
  clip-path: polygon(
    0 0,
    100% 0,
    100% 100%,
    0 100%,
    0 61%,
    3.2% 54%,
    3.2% 19%,
    0 12%
  );
}
```

Esse polígono cria:

- borda alinhada no topo;
- pequeno avanço diagonal;
- trecho vertical recuado;
- segundo avanço diagonal;
- borda alinhada novamente na parte inferior.

## Fallback

```css
@supports not (clip-path: polygon(0 0)) {
  .stickyMedia {
    clip-path: none;
    border-radius: 0.75rem 0 0 0.75rem;
  }
}
```

Se for necessária fidelidade vetorial ou posição dinâmica do recorte, usar máscara SVG parametrizada. Não usar a imagem original do site de referência.

---

# 8. Como identificar a etapa ativa

A etapa deve ser ativada quando sua região central atravessar o centro da viewport.

## Opção recomendada: IntersectionObserver

```ts
useEffect(() => {
  const nodes = Array.from(
    sectionRef.current?.querySelectorAll<HTMLElement>("[data-step-index]") ?? [],
  );

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort(
          (a, b) =>
            Math.abs(a.boundingClientRect.top - window.innerHeight / 2) -
            Math.abs(b.boundingClientRect.top - window.innerHeight / 2),
        );

      const index = visible[0]?.target.getAttribute("data-step-index");
      if (index !== undefined && index !== null) {
        setActiveIndex(Number(index));
      }
    },
    {
      rootMargin: "-45% 0px -45% 0px",
      threshold: 0,
    },
  );

  nodes.forEach((node) => observer.observe(node));
  return () => observer.disconnect();
}, []);
```

Essa faixa estreita no centro reduz trocas prematuras.

## Alternativa com GSAP ScrollTrigger

```ts
steps.forEach((step, index) => {
  ScrollTrigger.create({
    trigger: step,
    start: "top 50%",
    end: "bottom 50%",
    onEnter: () => setActiveIndex(index),
    onEnterBack: () => setActiveIndex(index),
  });
});
```

Usar GSAP somente se já estiver presente no projeto ou se o scrub progressivo justificar a dependência.

---

# 9. Revelação progressiva da frase

Na referência, a frase não surge por digitação. Todos os caracteres já ocupam espaço, mas sua cor muda conforme o usuário percorre a etapa.

## Estados

- caractere ainda não percorrido: cinza claro;
- caractere em transição: cor de sinal;
- caractere concluído: cor principal escura;
- duração da passagem de cor: aproximadamente `500ms`;
- intervalo visual progressivo: aproximadamente `14ms` por caractere.

## Estrutura acessível

```tsx
function ProgressiveText({ text, progress }: { text: string; progress: number }) {
  const characters = Array.from(text);
  const visibleCount = progress * characters.length;

  return (
    <p className={styles.progressiveText} aria-label={text}>
      <span aria-hidden="true">
        {characters.map((character, index) => (
          <span
            key={`${character}-${index}`}
            className={styles.character}
            data-active={visibleCount > index}
          >
            {character === " " ? "\u00A0" : character}
          </span>
        ))}
      </span>
    </p>
  );
}
```

## CSS

```css
.progressiveText {
  max-width: 16ch;
  margin: 0;
  color: var(--story-ink);
  font-size: clamp(2.25rem, 3.1vw, 3.85rem);
  font-weight: 400;
  line-height: 1.18;
  letter-spacing: -0.02em;
  text-wrap: balance;
}

.character {
  color: var(--story-muted);
  transition: color 400ms ease;
}

.character[data-active="true"] {
  color: var(--story-ink);
  animation: story-character-color 500ms ease both;
}

@keyframes story-character-color {
  0% { color: var(--story-muted); }
  30% { color: var(--story-signal); }
  100% { color: var(--story-ink); }
}
```

## Como calcular o progresso local

Para cada etapa:

```ts
const rect = step.getBoundingClientRect();
const viewportCenter = window.innerHeight * 0.5;
const travel = rect.height + window.innerHeight * 0.2;
const raw = (viewportCenter - rect.top) / travel;
const progress = Math.min(1, Math.max(0, raw));
```

Atualizar o progresso dentro de `requestAnimationFrame`, nunca diretamente em todos os eventos de scroll.

Com GSAP:

```ts
ScrollTrigger.create({
  trigger: step,
  start: "top 65%",
  end: "bottom 40%",
  scrub: true,
  onUpdate(self) {
    updateCharacterProgress(index, self.progress);
  },
});
```

Não aplicar esse efeito a parágrafos longos. Restrinja-o a uma frase curta ou título de cada etapa.

---

# 10. Troca de imagens e vídeos

Todas as mídias permanecem empilhadas dentro do painel sticky. Somente a etapa ativa fica visível.

```css
.mediaItem {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition:
    opacity 500ms cubic-bezier(.19, 1, .22, 1),
    visibility 0s linear 500ms;
}

.mediaItem[data-active="true"] {
  opacity: 1;
  visibility: visible;
  transition-delay: 0s;
}

.mediaItem img,
.mediaItem video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

Regras:

- crossfade de aproximadamente `500ms`;
- primeira mídia visível já no HTML, mesmo antes da hidratação;
- imagens posteriores com lazy loading;
- vídeos com `muted`, `playsInline`, `preload="metadata"` e poster;
- tocar somente o vídeo ativo;
- pausar e reiniciar vídeos que deixam de ser ativos;
- não reproduzir duas mídias animadas simultaneamente;
- manter `alt` ou descrição textual adjacente quando a mídia for informativa.

## Controle de vídeo

```ts
useEffect(() => {
  videoRefs.current.forEach((video, index) => {
    if (!video) return;

    if (index === activeIndex && !reducedMotion) {
      video.play().catch(() => undefined);
    } else {
      video.pause();
      video.currentTime = 0;
    }
  });
}, [activeIndex, reducedMotion]);
```

---

# 11. Contador de etapas

O contador deve ficar próximo da frase, sem competir com o título.

- Formato: `01`, `02`, `03`.
- Fonte: monoespaçada.
- Peso: 600.
- Números tabulares.
- Cor inativa: cinza claro.
- Cor ativa: cinza médio ou cor de destaque discreta.
- Troca com `opacity` e `translateY(8px)`.
- Duração: `400ms`–`500ms`.

O valor acessível deve ser atualizado de forma direta. Não expor todos os valores intermediários de uma animação tipo odômetro.

---

# 12. Entrada inicial da seção

Antes da narrativa começar:

- o título menor pode subir de `translateY(-10rem)` para `0` conforme a seção entra;
- a progressão acompanha o scroll entre `top bottom` e `top 15%`;
- não usar bounce;
- a mídia entra com opacity de 0 para 1 e escala de `1.02` para `1`;
- duração visual da mídia: `700ms`–`900ms`.

Não confundir essa entrada inicial com a troca entre etapas. A entrada ocorre uma vez; a troca de mídia continua durante a seção.

---

# 13. Comportamento mobile

Abaixo de `1024px`, remover o sticky prolongado.

## Estrutura recomendada

- mídia exibida acima dos textos;
- altura máxima da mídia: aproximadamente `60svh`;
- etapas em carrossel horizontal;
- cada texto ocupa aproximadamente 85% da largura disponível;
- `scroll-snap-type: x mandatory`;
- contador em uma linha acima das etapas;
- botões anterior/próximo opcionais;
- a imagem ativa acompanha o card mais visível.

```css
@media (max-width: 1023px) {
  .layout {
    display: flex;
    flex-direction: column-reverse;
  }

  .stickyMedia {
    position: relative;
    top: auto;
    height: min(60svh, 34rem);
    clip-path: none;
    border-radius: 0.75rem;
  }

  .steps {
    flex-direction: row;
    gap: 0;
    margin: 0;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;
  }

  .step {
    flex: 0 0 85%;
    min-height: auto;
    padding-right: 1.875rem;
    scroll-snap-align: start;
  }
}
```

No mobile, ativar a etapa pelo item com maior `intersectionRatio`, não pela posição do mouse ou por hover.

---

# 14. Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  .character,
  .mediaItem,
  .stickyHeader {
    animation: none !important;
    transition: none !important;
    transform: none !important;
  }

  .character {
    color: var(--story-ink) !important;
  }
}
```

Quando `prefers-reduced-motion: reduce` estiver ativo:

- não dividir o texto em caracteres;
- não usar scrub;
- não executar smooth scroll;
- não tocar vídeos automaticamente;
- apresentar cada texto junto da própria imagem no fluxo normal;
- manter todo o conteúdo disponível.

---

# 15. Fallback sem JavaScript

Sem JavaScript:

- remover o sticky longo;
- apresentar cada etapa como um bloco comum;
- mostrar texto seguido da mídia correspondente;
- deixar todas as frases com a cor final;
- não sobrepor todas as imagens no mesmo espaço.

Uma classe como `.js-enabled` pode ser adicionada ao `<html>` somente depois da inicialização. O estilo estático deve ser o padrão seguro.

---

# 16. Performance

- Animar somente `opacity`, `transform` e cor.
- Usar `requestAnimationFrame` para progresso de scroll.
- Atualizar estado React apenas quando `activeIndex` mudar.
- Para caracteres, preferir variável CSS ou atualização imperativa localizada em vez de renderizar React a cada pixel.
- Pausar vídeos inativos.
- Priorizar somente a primeira imagem.
- Definir dimensões de todas as mídias para evitar CLS.
- Usar WebP/AVIF e vídeos comprimidos próprios.
- Desconectar `IntersectionObserver`, listeners e ScrollTriggers no cleanup.
- Executar `ScrollTrigger.refresh()` após fontes e mídias essenciais estabilizarem.
- Evitar Lenis se o projeto não usa smooth scroll ou se ele interferir em âncoras, teclado e restauração de posição.
- Metas: LCP abaixo de 2,5 s, INP abaixo de 200 ms e CLS abaixo de 0,1.

---

# 17. Erros que devem ser evitados

- Fixar a seção inteira e impedir o usuário de sair dela.
- Trocar a imagem antes de o texto correspondente chegar ao centro.
- Dividir parágrafos completos caractere por caractere.
- Alterar o layout a cada evento de scroll.
- Carregar todos os vídeos imediatamente.
- Manter vídeos anteriores tocando atrás da imagem ativa.
- Usar `position: fixed` para a mídia em vez de `sticky`.
- Aplicar o recorte sem fallback.
- Esconder o texto original de leitores de tela.
- Manter a versão sticky no mobile.
- Copiar textos, imagens ou arquivos do site de referência.

---

# 18. Critérios de aceite

## Desktop

- [ ] A seção usa duas colunas.
- [ ] O painel de mídia permanece sticky sem cobrir o header.
- [ ] Cada etapa ocupa pelo menos 70vh.
- [ ] A etapa muda ao cruzar o centro da viewport.
- [ ] O contador acompanha a etapa ativa.
- [ ] A frase é revelada progressivamente pela cor.
- [ ] A mídia muda por crossfade de aproximadamente 500 ms.
- [ ] O recorte lateral permanece estável durante o scroll.
- [ ] Ao terminar a última etapa, a página continua normalmente.

## Mobile

- [ ] O sticky prolongado foi removido.
- [ ] A mídia fica acima da sequência textual.
- [ ] Os textos usam scroll-snap horizontal ou fluxo vertical legível.
- [ ] A imagem acompanha o item mais visível.
- [ ] O gesto horizontal não bloqueia a rolagem vertical.

## Acessibilidade

- [ ] O texto completo está disponível para leitores de tela.
- [ ] A divisão por caracteres é `aria-hidden`.
- [ ] Reduced motion mostra tudo sem scrub ou autoplay.
- [ ] Vídeos possuem poster e alternativa textual.
- [ ] O conteúdo funciona sem JavaScript.

## Qualidade

- [ ] Não há salto perceptível de layout.
- [ ] Apenas a mídia ativa executa.
- [ ] Observadores e animações são destruídos no cleanup.
- [ ] Build, lint e testes passam.
- [ ] Nenhum conteúdo ou ativo da referência foi copiado.

---

# 19. Prompt pronto para Claude Code ou Codex

```text
Analise primeiro a stack, os componentes, os estilos globais, as dependências, o header fixo e os comandos de validação do projeto. Em seguida, implemente uma seção de sticky storytelling seguindo integralmente o arquivo `secao-sticky-storytelling-terminal.md`.

Objetivo:
- criar uma narrativa em duas colunas no desktop;
- manter textos e contador na coluna esquerda;
- manter a imagem ou vídeo sticky na coluna direita;
- trocar a etapa ativa quando cada bloco textual cruzar o centro da viewport;
- revelar progressivamente a frase ativa pela cor;
- trocar as mídias por crossfade;
- usar um recorte técnico na lateral esquerda da mídia;
- adaptar a experiência para mobile sem sticky prolongado.

Requisitos obrigatórios:
1. Renderize todas as etapas a partir de um array tipado.
2. Cada etapa deve possuir id, título, mídia e texto alternativo.
3. No desktop, cada etapa deve reservar entre 70vh e 85vh.
4. A mídia deve usar position: sticky, top próximo de 35px e altura próxima de calc(100svh - 70px), ajustada ao header real.
5. A etapa ativa deve ser determinada pela passagem do texto pelo centro da viewport.
6. O activeIndex deve controlar simultaneamente contador, frase e mídia.
7. Os caracteres da frase devem começar em cinza, passar brevemente pela cor de sinal e terminar na cor principal. O texto acessível integral deve ser preservado.
8. As mídias devem ficar empilhadas e trocar por opacity em aproximadamente 500 ms.
9. Somente o vídeo ativo pode tocar; pause e reinicie os demais.
10. Implemente cleanup de observers, requestAnimationFrame, listeners e ScrollTriggers.
11. Abaixo de 1024px, remova o sticky e converta as etapas em scroll-snap horizontal ou fluxo vertical equivalente.
12. Implemente prefers-reduced-motion e fallback sem JavaScript.

Use IntersectionObserver para o activeIndex. Use GSAP ScrollTrigger somente se a biblioteca já existir ou se o scrub progressivo justificar a dependência. Não atualize o estado React a cada pixel; mantenha a atualização contínua da cor de forma localizada e atualize o React apenas quando o índice mudar.

Preserve os textos, as imagens, as cores e a identidade do projeto. Não copie textos, nomes, imagens, vídeos, SVGs, CSS minificado ou arquivos da Terminal Industries. Não altere seções não relacionadas.

Ao concluir:
- execute build, lint e testes disponíveis;
- teste desktop, tablet e mobile;
- teste retorno de scroll, resize, vídeo bloqueado, JavaScript desativado e reduced motion;
- informe todos os arquivos criados ou modificados.
```

