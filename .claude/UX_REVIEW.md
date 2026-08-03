# UX Review — Sistran Labs Landing Page
**Revisado em:** 03/07/2026  
**Tipo:** Single-page, interna/executiva, protegida por senha  
**Stack:** Next.js 14, TypeScript, Tailwind, Framer Motion

---

## Sumário executivo

O site tem uma base visual sólida e animações bem elaboradas. Os principais problemas estão concentrados em três áreas: **navegação quebrada** (links no Header/Footer apontam para seções inexistentes), **acessibilidade do carrossel** (nenhum suporte a screen reader, conflito de teclado) e **fricção na seção Portfolio** (o usuário é forçado a rolar por uma animação longa antes de conseguir interagir com o conteúdo).

---

## 🔴 Crítico — corrigir antes de qualquer apresentação

### 1. Links de navegação apontam para seções que não existem

**Onde:** Header (nav desktop e mobile) + Footer  
**Problema:** As seções `#impacto` (ImpactMetrics) e `#diferenciais` (Differentials) estão comentadas no `page.tsx` mas continuam referenciadas na navegação. Clicar em "Impacto" ou "Diferenciais" faz a página "pular" para o lugar errado sem nenhum feedback.

**Como corrigir:**
- **Opção A (rápida):** Remover os links do Header e Footer enquanto as seções estão comentadas.
- **Opção B (ideal):** Descomentar e renderizar as seções, ou substituí-las por conteúdo temporário com um banner "Em breve".

```tsx
// page.tsx — remover ou descomentar
// import ImpactMetrics from '@/components/ImpactMetrics'
// import Differentials from '@/components/Differentials'
```

---

### 2. Conflito de teclado: carrossel + modal de galeria

**Onde:** `Portfolio.tsx` — handlers `ArrowLeft`/`ArrowRight`  
**Problema:** O handler de teclado do carrossel é registrado no `window` e verifica `if (modal) return` — mas `modal` é o state do projeto selecionado, não do sub-modal de galeria (`learnMore`). Quando o usuário abre "Saiba mais" e navega as imagens com seta, o carrossel de fundo também avança ao mesmo tempo.

**Como corrigir:**

```tsx
// Portfolio.tsx — ajustar a condição do handler
const onKey = (e: KeyboardEvent) => {
  if (modal) return;      // já existente
  if (learnMore) return;  // ADICIONAR — bloqueia quando galeria está aberta
  // ...
};
```

---

### 3. Carrossel invisível sem `prefers-reduced-motion`

**Onde:** `Portfolio.tsx` — `setCarouselReady` só dispara quando `introProgress > 0.65`  
**Problema:** Usuários com `prefers-reduced-motion` ativo pulam toda a animação de intro, mas o carrossel só aparece após a progressão atingir 65% via scroll. Se o usuário não scrollar o suficiente (ou se a animação for ignorada), o carrossel permanece oculto sem nenhum indicativo.

**Como corrigir:**

```tsx
useEffect(() => {
  // Se reduced motion, ativa carrossel imediatamente
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    setCarouselReady(true);
    return;
  }
  // ... lógica de scroll normal
}, []);
```

---

## 🟠 Importante — impacta usabilidade

### 4. Comportamento duplo do clique no carrossel não é comunicado

**Onde:** `Portfolio.tsx` — cards do carrossel  
**Problema:** Clicar em um card **inativo** avança o carrossel. Clicar no card **ativo** abre o modal de detalhes. Esse comportamento não tem nenhuma dica visual — o usuário descobre por tentativa e erro.

**Como corrigir:**
- Adicionar um badge/pill visível no card ativo: `"Clique para ver detalhes"` ou um ícone de expand.
- No hover do card ativo, mostrar overlay com ícone de abertura.

```tsx
// Exemplo: overlay no card ativo
{isActive && (
  <div className="absolute inset-0 flex items-end justify-center pb-6 opacity-0 group-hover:opacity-100 transition-opacity">
    <span className="bg-white/10 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full">
      Ver detalhes →
    </span>
  </div>
)}
```

---

### 5. Botão de alternar visualização (carrossel ↔ grid) aparece tarde

**Onde:** `Portfolio.tsx` — o toggle só fica visível quando `carouselOp > 0.3`  
**Problema:** O usuário que prefere ver a lista de projetos precisa primeiro rolar por toda a animação de intro para encontrar a opção de mudar para grid. O toggle deveria estar acessível desde o início da seção.

**Como corrigir:**
- Mover o toggle para dentro da barra de filtros (já visível desde o início).
- Ou exibir o toggle fixo junto com os filtros, independente de `carouselOp`.

---

### 6. Timeline do Roadmap quebra em mobile

**Onde:** `Roadmap.tsx`  
**Problema:** O layout usa `grid-template-columns: 1fr 80px 1fr` com cards alternando entre coluna esquerda e direita. Em mobile, os cards da coluna "escondida" usam `visibility: hidden` mas o grid ainda reserva o espaço, gerando lacunas enormes entre os itens da timeline.

**Como corrigir:**

```css
/* Adicionar breakpoint mobile no Roadmap */
@media (max-width: 768px) {
  .roadmap-grid {
    grid-template-columns: 40px 1fr; /* eixo + card */
  }
  .roadmap-card-left,
  .roadmap-card-right {
    grid-column: 2; /* todos na mesma coluna */
    visibility: visible;
  }
}
```

---

### 7. Contraste insuficiente: `.btn-ghost` no hover em fundo escuro

**Onde:** `globals.css` — `.btn-ghost:hover { color: #002D5C }`  
**Problema:** O hover do botão fantasma muda o texto para `#002D5C` (azul-marinho muito escuro). No Hero (fundo azul escuro com transparência), o texto fica praticamente invisível. Falha WCAG AA.

**Como corrigir:**

```css
/* globals.css */
.btn-ghost:hover {
  color: #ffffff;            /* era #002D5C — invisível em fundo escuro */
  background: rgba(255,255,255,0.15);
}

/* Se quiser diferenciar por contexto de seção */
.section-light .btn-ghost:hover {
  color: #002D5C;
}
```

---

### 8. Modal de galeria sem focus trap

**Onde:** `DeliveryLearnMoreModal.tsx`  
**Problema:** O foco inicial é jogado para o botão de fechar, mas não há armadilha de foco — o Tab pode escapar para o conteúdo de fundo. Isso é um problema de acessibilidade e pode confundir usuários de teclado.

**Como corrigir:**
- Usar a biblioteca `focus-trap-react` (já muito comum em projetos Next.js).
- Ou implementar manualmente: capturar `Tab` e `Shift+Tab` dentro do modal para manter o ciclo interno.

```bash
npm install focus-trap-react
```

```tsx
import FocusTrap from 'focus-trap-react';
// Envolver o conteúdo do modal com <FocusTrap active={isOpen}>
```

---

## 🟡 Melhorias — qualidade e polish

### 9. Carrossel sem acessibilidade para screen readers

**Onde:** `Portfolio.tsx`  
**Problema:** O container tem `aria-label` mas falta `role="region"`, os cards não comunicam posição atual ("3 de 18"), e não há `aria-live` para anunciar mudanças ao avançar slides.

**Melhorias mínimas:**

```tsx
<div
  role="region"
  aria-label="Carrossel de entregas"
  aria-roledescription="carrossel"
>
  {/* card ativo */}
  <div aria-label={`${project.title}, ${activeIdx + 1} de ${filtered.length}`}>
  
  {/* live region para anunciar mudanças */}
  <div aria-live="polite" aria-atomic="true" className="sr-only">
    {filtered[activeIdx]?.title}
  </div>
```

---

### 10. Indicador de scroll desaparece cedo demais

**Onde:** `Portfolio.tsx` — "Role para explorar" some quando `introProgress > 0.10`  
**Problema:** 10% de progresso é atingido praticamente nos primeiros pixels de scroll da seção. Em displays grandes ou quando a seção já está parcialmente no viewport, o indicador pode desaparecer antes de o usuário sequer ler o aviso.

**Sugestão:** Aumentar o threshold para `0.20` ou `0.25`.

```tsx
// Portfolio.tsx
style={{ opacity: introProgress > 0.25 ? 0 : 1 - introProgress / 0.25 }}
```

---

### 11. Logo do Header com tamanho inconsistente

**Onde:** `Header.tsx`  
**Problema:** A imagem tem `width={240} height={72}` no componente Next.js Image mas é renderizada com `height: 110` via inline style. O browser baixa uma imagem de 240px de largura, mas o render é diferente — pode resultar em imagem borrada em retina e gera CLS (Cumulative Layout Shift) na carga.

**Como corrigir:**
- Usar dimensões consistentes: se vai renderizar em 110px de altura, calcular a largura proporcional e passar esses valores.
- Ou usar `fill` + container com tamanho fixo se a proporção for variável.

---

### 12. Nenhum estado de erro com timeout no login

**Onde:** `login/page.tsx`  
**Problema:** Se o endpoint `/api/auth` travar, o botão fica bloqueado em "Verificando…" indefinidamente sem nenhum feedback de erro.

**Como corrigir:**
```tsx
// Adicionar timeout de 10s na chamada de login
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 10000);

try {
  const res = await fetch('/api/auth', { signal: controller.signal, ... });
} catch (e) {
  if (e.name === 'AbortError') setError('Servidor não respondeu. Tente novamente.');
} finally {
  clearTimeout(timeout);
}
```

---

### 13. `Portfolio.tsx` com 2.957 linhas — risco de manutenção

**Onde:** `Portfolio.tsx`  
**Problema:** Toda a lógica do carrossel, grid, modal, filtros, animações de intro e os 18 renderizadores visuais de projeto estão num único arquivo. Além de dificultar manutenção, faz com que todos os 18 visuais customizados sejam carregados no bundle mesmo que o usuário não veja todos.

**Sugestão de refatoração mínima:**
- Extrair `ProjectVisual` para `components/portfolio/ProjectVisual.tsx`
- Extrair `CarouselCard` para `components/portfolio/CarouselCard.tsx`
- Extrair `GridCard` para `components/portfolio/GridCard.tsx`
- Considerar `React.lazy` + `Suspense` nos visuais menos prioritários

---

## Checklist de prioridade

| # | Problema | Prioridade | Esforço |
|---|----------|------------|---------|
| 1 | Links quebrados no nav (#impacto, #diferenciais) | 🔴 Crítico | Baixo |
| 2 | Conflito seta teclado carrossel + galeria | 🔴 Crítico | Baixo |
| 3 | Carrossel invisível com reduced-motion | 🔴 Crítico | Baixo |
| 4 | Comportamento duplo clique no carrossel | 🟠 Importante | Baixo |
| 5 | Toggle grid/carrossel aparece tarde | 🟠 Importante | Médio |
| 6 | Timeline Roadmap quebrada em mobile | 🟠 Importante | Médio |
| 7 | Contraste btn-ghost hover no Hero | 🟠 Importante | Baixo |
| 8 | Focus trap ausente no modal | 🟠 Importante | Baixo |
| 9 | Acessibilidade carrossel (aria) | 🟡 Melhoria | Médio |
| 10 | Indicador scroll some cedo | 🟡 Melhoria | Baixo |
| 11 | Logo Header com CLS | 🟡 Melhoria | Baixo |
| 12 | Timeout ausente no login | 🟡 Melhoria | Baixo |
| 13 | Portfolio.tsx monolítico | 🟡 Melhoria | Alto |

---

## O que está funcionando bem (não mexer)

- **Animação de entrada do Hero** — a combinação de scale + blur + fade ao scrollar para fora é suave e não excessiva.
- **Sistema de cores e tipografia** — a paleta azul com Sora/Inter é coesa e executiva sem parecer genérica.
- **Cards do Roadmap com 3D scroll** — o efeito rotateX por card individual é elegante e não cansa.
- **Filtros de categoria no Portfolio** — funcional, visual limpo, reset correto ao trocar filtro.
- **`prefers-reduced-motion` no CSS** — já respeitado globalmente, é um diferencial de acessibilidade.
- **Scroll lock e Escape nos modais** — implementado corretamente nos dois modais.
- **Design responsivo geral** — hero, pillars, header mobile estão bem adaptados.
