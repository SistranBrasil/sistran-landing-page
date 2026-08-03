# Guia de melhoria do efeito de scroll e intro do portfólio

Este documento reúne sugestões para deixar o efeito atual da seção de portfólio mais bonito, fluido e com aparência mais premium/executiva.

O código atual já tem uma boa base: intro controlada por scroll, título revelado palavra por palavra, encolhimento do título e entrada do carrossel com perspectiva 3D. A melhoria principal está em suavizar a progressão do scroll, reduzir movimentos agressivos e criar uma transição mais elegante entre o hero e o carrossel.

---

## 1. Objetivo visual

A ideia é transformar a seção em uma experiência mais refinada, com sensação de movimento contínuo e menos brusco.

### Antes

- Scroll muito preso ao evento nativo.
- Título sobe e encolhe de forma um pouco agressiva.
- Entrada do carrossel com rotação 3D forte.
- Background bastante saturado.
- Muitos efeitos simultâneos, deixando a experiência pesada.

### Depois

- Scroll com sensação de inércia.
- Título encolhe e vira quase um header da seção.
- Carrossel entra com fade, blur e profundidade sutil.
- Background com efeito de aurora/glow mais sofisticado.
- Timeline mais limpa e fácil de ajustar.

---

## 2. Suavizar o scroll com `requestAnimationFrame`

Atualmente, o progresso do intro é atualizado diretamente no evento de scroll. Isso pode deixar a animação mais seca ou nervosa em algumas máquinas.

A sugestão é usar `requestAnimationFrame` com interpolação entre o valor atual e o valor desejado.

```tsx
const progressTarget = useRef(0);
const progressCurrent = useRef(0);
const rafRef = useRef<number | null>(null);

useEffect(() => {
  const section = sectionRef.current;
  if (!section) return;

  const animate = () => {
    progressCurrent.current +=
      (progressTarget.current - progressCurrent.current) * 0.12;

    const value = progressCurrent.current;
    setIntroProgress(value);

    if (value > 0.64) {
      setCarouselReady(true);
    }

    if (Math.abs(progressTarget.current - progressCurrent.current) > 0.001) {
      rafRef.current = requestAnimationFrame(animate);
    } else {
      rafRef.current = null;
    }
  };

  const onScroll = () => {
    const rect = section.getBoundingClientRect();
    const totalScrolled = Math.max(0, -rect.top);

    // Quanto maior esse valor, mais longa e cinematográfica fica a intro.
    const phase = window.innerHeight * 2.4;

    progressTarget.current = clamp(totalScrolled / phase);

    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(animate);
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  return () => {
    window.removeEventListener('scroll', onScroll);

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
  };
}, []);
```

### Resultado esperado

A animação passa a seguir o scroll com uma pequena suavização, criando uma sensação mais fluida e premium.

---

## 3. Criar helpers para fases da timeline

O código atual usa várias expressões como:

```tsx
clamp((introProgress - 0.52) / 0.26)
```

Funciona, mas dificulta a manutenção e o ajuste fino da timeline.

A sugestão é criar dois helpers: `smoothStep` e `phase`.

```tsx
const smoothStep = (t: number) => {
  const x = clamp(t);
  return x * x * (3 - 2 * x);
};

const phase = (from: number, to: number) => {
  return smoothStep((introProgress - from) / (to - from));
};
```

Com isso, as fases ficam mais legíveis:

```tsx
const introIn = phase(0.02, 0.18);
const wordsIn = phase(0.08, 0.42);
const subtitleIn = phase(0.36, 0.50);
const subtitleOut = phase(0.50, 0.62);
const shrink = phase(0.50, 0.78);
const carouselIn = phase(0.62, 0.92);
```

---

## 4. Melhorar o encolhimento do título

Hoje o título encolhe bastante e sobe muito. Isso pode dar a sensação de que ele está fugindo da tela.

A sugestão é fazer o título se reorganizar como uma marca/header da seção.

```tsx
const shrink = phase(0.50, 0.78);

const titleScale = lerp(1, 0.42, shrink);
const titleY = lerp(0, -170, shrink);
const titleBlur = lerp(0, 0.4, shrink);
```

Aplicação no estilo:

```tsx
style={{
  transform: `translate3d(0, ${titleY}px, 0) scale(${titleScale})`,
  filter: `blur(${titleBlur}px)`,
  transformOrigin: 'center center',
  opacity: 1,
  willChange: 'transform, opacity, filter',
}}
```

### Resultado esperado

O título deixa de parecer um elemento que desaparece e passa a parecer um componente fixo e intencional da seção.

---

## 5. Melhorar a entrada do carrossel

A entrada atual usa perspectiva e `rotateX` com intensidade alta. Para um visual mais moderno, a entrada pode ser mais sutil.

```tsx
const carouselPhase = phase(0.62, 0.92);
const carouselOp = phase(0.60, 0.78);
const carouselY = lerp(96, 0, carouselPhase);
const carouselTilt = lerp(5, 0, carouselPhase);
const carouselScale = lerp(0.96, 1, carouselPhase);
const carouselBlur = lerp(10, 0, carouselPhase);
```

Aplicação no container do carrossel:

```tsx
style={viewMode === 'grid' ? {} : {
  opacity: carouselOp,
  transform: `
    perspective(1200px)
    translate3d(0, ${carouselY}px, 0)
    rotateX(${carouselTilt}deg)
    scale(${carouselScale})
  `,
  filter: `blur(${carouselBlur}px)`,
  transformOrigin: 'center bottom',
  willChange: 'transform, opacity, filter',
}}
```

### Resultado esperado

O carrossel entra com sensação de profundidade, mas sem parecer artificial ou pesado.

---

## 6. Melhorar o background

O fundo atual é bonito, mas pode ficar mais sofisticado usando camadas de glow e um gradiente linear mais profundo.

Substitua o background principal por algo nesta linha:

```tsx
background: `
  radial-gradient(circle at 20% 10%, rgba(120,201,248,0.28), transparent 32%),
  radial-gradient(circle at 80% 12%, rgba(0,121,203,0.26), transparent 34%),
  radial-gradient(circle at 50% 90%, rgba(120,201,248,0.12), transparent 42%),
  linear-gradient(180deg, #052C8F 0%, #031B63 48%, #010A26 100%)
`
```

### Resultado esperado

O visual continua azul e tecnológico, mas fica mais elegante, menos chapado e mais compatível com uma landing page executiva.

---

## 7. Timeline recomendada

Uma timeline mais fluida pode seguir esta lógica:

```tsx
// 0.00 - 0.12: fundo e eyebrow aparecem
// 0.08 - 0.40: palavras entram com stagger
// 0.30 - 0.50: subtítulo e stats aparecem
// 0.48 - 0.64: subtítulo e stats somem
// 0.52 - 0.78: título encolhe para header
// 0.62 - 0.92: carrossel entra com blur, fade e profundidade
// 0.78 - 1.00: seção estabiliza
```

O ponto mais importante é fazer o carrossel começar a aparecer antes do título terminar de encolher. Essa sobreposição deixa a experiência mais contínua.

---

## 8. Adicionar um header glass quando o título encolher

Para deixar a transição mais bonita, o título pode encaixar em uma cápsula com efeito glass quando chegar ao topo.

```tsx
const headerGlassOp = phase(0.68, 0.86);
```

Componente sugerido:

```tsx
<div
  style={{
    position: 'absolute',
    top: '7vh',
    left: '50%',
    width: 'min(760px, 88vw)',
    height: 88,
    transform: `translateX(-50%) scale(${lerp(0.92, 1, headerGlassOp)})`,
    opacity: headerGlassOp,
    borderRadius: 999,
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    backdropFilter: 'blur(18px)',
    boxShadow: '0 24px 80px rgba(0,0,0,0.22)',
    pointerEvents: 'none',
  }}
/>
```

### Resultado esperado

Quando o título encolher, ele ganha uma base visual mais premium e parece fazer parte da interface, não apenas da animação.

---

## 9. Ajustes de copy

O título atual é:

```txt
Entregas que geram impacto real
```

É uma boa frase, mas para uma comunicação mais executiva, uma alternativa mais forte seria:

```txt
Entregas que geram valor real
```

Outra opção:

```txt
Soluções que aceleram impacto real
```

Sugestão principal:

```txt
Entregas que geram valor real
```

Subtítulo sugerido:

```txt
Um resumo visual das principais iniciativas da Sistran Labs, conectando tecnologia, eficiência operacional e evolução dos produtos.
```

---

## 10. Corrigir caracteres quebrados

No código atual existem textos com caracteres quebrados, por exemplo:

```txt
Se????o
T??tulo
Subt??tulo
t??cnica
```

Corrija para:

```txt
Seção
Título
Subtítulo
técnica
```

Isso não muda o efeito visual, mas melhora manutenção, leitura do código e qualidade geral do projeto.

---

## 11. Checklist de implementação

- [ ] Substituir o `useEffect` de scroll por versão com `requestAnimationFrame`.
- [ ] Criar helpers `smoothStep` e `phase`.
- [ ] Reduzir a intensidade do shrink do título.
- [ ] Reduzir `rotateX` do carrossel de aproximadamente `10deg` para `5deg`.
- [ ] Adicionar `filter: blur()` na entrada do carrossel.
- [ ] Atualizar background com camadas de glow mais sutis.
- [ ] Criar cápsula glass opcional para o título no topo.
- [ ] Revisar copy do título e subtítulo.
- [ ] Corrigir caracteres quebrados no código.
- [ ] Testar no desktop e mobile.

---

## 12. Resumo da melhoria

A principal mudança não é adicionar mais efeitos, mas sim refinar os efeitos existentes.

O efeito ideal deve parecer:

- mais fluido;
- mais leve;
- mais premium;
- menos brusco;
- mais executivo;
- mais adequado para uma landing page institucional.

A combinação mais importante é:

```txt
requestAnimationFrame + smoothStep + blur sutil + menor rotação + background mais refinado
```

Essa combinação deve dar a sensação de uma seção moderna, tecnológica e com acabamento mais profissional.
