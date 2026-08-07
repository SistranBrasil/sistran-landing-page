# Componentes dinâmicos — padrões reais do Sistran Labs

Padrões extraídos do código real (`Hero.tsx`, `DeliveryCard.tsx`, `Portfolio.tsx`, `ImpactMetrics.tsx`, `Roadmap.tsx`). Copie estes snippets para replicar os efeitos assinatura da LP.

---

## 1. Card com 3D tilt + orb que segue o cursor (`MetricCard`)

Card que responde ao mouse com `perspective/rotateX/rotateY`, orb de luz seguindo o cursor e "linha de acento" no topo/rodapé. Estado local via `useState` para `isHovered` e `mouse: {x,y}` (0–1).

```tsx
const [isHovered, setIsHovered] = useState(false);
const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });

<div
  onMouseEnter={() => setIsHovered(true)}
  onMouseLeave={() => { setIsHovered(false); setMouse({ x: 0.5, y: 0.5 }); }}
  onMouseMove={(e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setMouse({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height });
  }}
  style={{
    transform: isHovered
      ? `translateY(-6px) scale(1.03) perspective(600px)
         rotateX(${(mouse.y - 0.5) * -8}deg)
         rotateY(${(mouse.x - 0.5) * 10}deg)`
      : 'translateY(0) scale(1)',
    transition: isHovered ? 'border-color .2s, box-shadow .25s' : 'all .5s cubic-bezier(.22,1,.36,1)',
    border: isHovered ? `1.5px solid ${accent}99` : `1.5px solid ${accent}60`,
    boxShadow: isHovered
      ? `0 20px 56px ${glow}, 0 0 0 1px ${accent}30, inset 0 1px 0 rgba(255,255,255,.18)`
      : `0 6px 32px rgba(0,0,0,.5), 0 0 28px ${glow.replace('0.35','0.18')}`,
  }}
>
  {/* Orb de luz que segue o cursor */}
  <div style={{
    position: 'absolute', width: 140, height: 140, borderRadius: '50%',
    background: `radial-gradient(circle, ${glow} 0%, transparent 70%)`,
    top: `calc(${mouse.y * 100}% - 70px)`,
    left: `calc(${mouse.x * 100}% - 70px)`,
    opacity: isHovered ? 0.7 : 0.15,
    transition: 'opacity .3s', pointerEvents: 'none',
  }} />

  {/* Linha de acento no topo */}
  <div style={{
    position: 'absolute', top: 0, left: '10%', right: '10%', height: 2,
    background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
    opacity: isHovered ? 1 : 0.35, transition: 'opacity .35s',
  }} />
</div>
```

Cada card recebe seu par `accent` + `glow` (rgba com 0.35 base). Ex.: `{ accent: '#38bdf8', glow: 'rgba(56,189,248,0.35)' }`.

---

## 2. Count-up numérico ao entrar na viewport

Hook local `useCountUp(target, active)` com `easeOutCubic` (`1 - (1-t)³`), reiniciando toda vez que o card entra na tela. Combinar com `IntersectionObserver` no wrapper para setar `inView`.

```tsx
function useCountUp(target: number | null, active: boolean, duration = 2600) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (target == null) return;
    if (!active) { setValue(0); return; }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);
  return target == null ? null : value;
}

// Uso:
const count = useCountUp(180, inView);
<span style={{ fontVariantNumeric: 'tabular-nums' }}>{count}{suffix}</span>
```

`fontVariantNumeric: 'tabular-nums'` evita "pulo" de largura entre dígitos.

Para valores não-numéricos (∞), passar `countTo: null` e exibir `suffix` direto.

---

## 3. IntersectionObserver → `inView` para grupo de cards

```tsx
const containerRef = useRef<HTMLDivElement>(null);
const [inView, setInView] = useState(false);

useEffect(() => {
  const el = containerRef.current;
  if (!el) return;
  const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.3 });
  io.observe(el);
  return () => io.disconnect();
}, []);

<div ref={containerRef}>
  {METRICS.map((m, i) => <MetricCard key={m.label} {...m} index={i} inView={inView} />)}
</div>
```

Cada card usa `animation: inView ? 'metric-card-enter .55s cubic-bezier(.22,1,.36,1) ${i*80}ms both' : 'none'` para cascata.

---

## 4. Card "deck" com gradiente por categoria (DeliveryCard)

Card que abre modal ao clicar; visual estilo carta com gradiente 145deg específico da categoria, overlay escuro em baixo para legibilidade, brilho ambiente no canto e ícone central.

```tsx
const CATEGORY_GRADIENT = {
  ia:            'linear-gradient(145deg,#020b24 0%,#0c2a6e 40%,#06b6d4 100%)',
  cloud:         'linear-gradient(145deg,#020b24 0%,#0f2f7a 40%,#3b82f6 100%)',
  security:      'linear-gradient(145deg,#160900 0%,#6b0000 40%,#ef4444 100%)',
  data:          'linear-gradient(145deg,#080420 0%,#2e1065 40%,#6366f1 100%)',
  qa:            'linear-gradient(145deg,#180010 0%,#6b0033 40%,#ec4899 100%)',
};
const CATEGORY_COLOR = { ia:'#06b6d4', cloud:'#3b82f6', security:'#ef4444', data:'#6366f1', qa:'#ec4899' };

<button
  className="group relative flex flex-col overflow-hidden rounded-2xl transition-all
             duration-300 hover:-translate-y-2 hover:shadow-[0_24px_64px_rgba(0,0,0,0.6)]"
  style={{ background: CATEGORY_GRADIENT[category] }}
>
  {/* Overlay inferior para texto */}
  <div className="pointer-events-none absolute inset-0"
       style={{ background: 'linear-gradient(to top, rgba(0,0,0,.88) 45%, rgba(0,0,0,.15) 100%)' }} />
  {/* Brilho ambiente */}
  <div className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full"
       style={{ background: 'radial-gradient(circle, rgba(255,255,255,.10) 0%, transparent 70%)' }} />
  {/* Ícone central com scale on hover */}
  <div className="flex h-16 w-16 items-center justify-center rounded-2xl
                  transition-transform duration-300 group-hover:scale-110"
       style={{ background: `${accent}20`, border: `1px solid ${accent}40`, boxShadow: `0 0 32px ${accent}30` }}>
    <Icon style={{ color: accent }} />
  </div>
  {/* Tag da categoria */}
  <span className="rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest"
        style={{ background: `${accent}25`, color: accent, border: `1px solid ${accent}50` }}>
    {label}
  </span>
</button>
```

Padrão de opacidade em hex string: `20` = 12.5%, `25` = 15%, `40` = 25%, `50` = 31%, `60` = 38% — usado para background/border/glow do accent.

---

## 5. Modal com backdrop-blur + escape key + scroll lock

```tsx
const [open, setOpen] = useState(false);

useEffect(() => {
  if (!open) return;
  const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
  document.addEventListener('keydown', onKey);
  return () => document.removeEventListener('keydown', onKey);
}, [open]);

{open && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
       style={{ background: 'rgba(0,0,0,.82)', backdropFilter: 'blur(12px)' }}
       onClick={() => setOpen(false)}>
    <div className="glass-card relative max-h-[92vh] w-full max-w-5xl overflow-y-auto"
         onClick={(e) => e.stopPropagation()}>
      <button onClick={() => setOpen(false)} aria-label="Fechar"
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center
                         rounded-full border border-border text-ink-faint hover:text-ink">×</button>
      {/* conteúdo */}
    </div>
  </div>
)}
```

- Backdrop com `onClick` fecha; conteúdo com `stopPropagation()` não.
- `Escape` fecha via listener global registrado só enquanto aberto.
- Usar `glass-card` no conteúdo mantém identidade visual.

---

## 6. Filtro por tabs / categoria (Portfolio)

```tsx
const [activeCat, setActiveCat] = useState<Category | 'all'>('all');
const filtered = useMemo(
  () => activeCat === 'all' ? DELIVERIES : DELIVERIES.filter(d => d.category === activeCat),
  [activeCat]
);

<div className="flex flex-wrap gap-2">
  {(['all', ...CATEGORIES] as const).map(c => (
    <button
      key={c}
      onClick={() => setActiveCat(c)}
      className={clsx(
        'rounded-full px-4 py-2 text-sm font-semibold transition-all',
        activeCat === c
          ? 'bg-gradient-to-r from-[#2A9BE0] to-[#57B7EE] text-white shadow-glow'
          : 'border border-white/[.10] bg-white/[.04] text-ink-muted hover:bg-white/[.08]'
      )}
    >
      {CATEGORY_LABEL[c] ?? 'Todos'}
    </button>
  ))}
</div>

<motion.div layout className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
  <AnimatePresence mode="popLayout">
    {filtered.map((d, i) => (
      <motion.div key={d.id} layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: (i % 6) * 0.05, ease: [.22,1,.36,1] }}>
        <DeliveryCard delivery={d} />
      </motion.div>
    ))}
  </AnimatePresence>
</motion.div>
```

Usar `layout` + `AnimatePresence mode="popLayout"` faz o grid se reorganizar suavemente ao filtrar.

---

## 7. Hover-glow "border-active" (glass card padrão)

Já disponível como classe `.glass-card-hover` em `globals.css`. Extensão inline quando precisa de acento por card:

```tsx
<div className="glass-card p-6 transition-all duration-300 hover:-translate-y-1"
     style={{
       transition: 'transform .3s, box-shadow .3s, border-color .3s',
     }}
     onMouseEnter={(e) => {
       e.currentTarget.style.borderColor = `${color}55`;
       e.currentTarget.style.boxShadow = `0 20px 40px -12px ${color}40`;
     }}
     onMouseLeave={(e) => {
       e.currentTarget.style.borderColor = '';
       e.currentTarget.style.boxShadow = '';
     }}>
```

---

## 8. Roadmap / Timeline com linha conectora animada

Barra horizontal (desktop) ou vertical (mobile) atrás dos steps, com gradiente que "desenha" ao entrar em view:

```tsx
<div className="relative">
  {/* Linha base */}
  <div className="absolute left-0 right-0 top-9 hidden h-px lg:block"
       style={{ background: 'linear-gradient(90deg, transparent, rgba(120,201,248,.55), transparent)' }} />

  {/* Linha "progresso" que anima */}
  <motion.div
    initial={{ scaleX: 0 }}
    whileInView={{ scaleX: 1 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 1.6, ease: [.22,1,.36,1] }}
    style={{ transformOrigin: 'left' }}
    className="absolute left-0 right-0 top-9 hidden h-px lg:block bg-gradient-to-r from-[#57B7EE] to-[#c084fc]"
  />

  <div className="grid gap-6 lg:grid-cols-7">
    {STEPS.map((s, i) => (
      <Reveal key={s.label} delay={i * 70}>
        <div className="relative flex flex-col items-center text-center">
          <div className="mb-4 flex h-[72px] w-[72px] items-center justify-center rounded-2xl"
               style={{
                 background: 'linear-gradient(135deg, rgba(0,121,203,.35), rgba(124,58,237,.30))',
                 border: '1px solid rgba(120,201,248,.35)',
                 boxShadow: '0 12px 30px -10px rgba(0,121,203,.55)',
               }}>
            <s.icon className="h-8 w-8 text-white" />
          </div>
          <h4 className="font-display text-sm font-bold text-ink">{s.label}</h4>
          {i < STEPS.length - 1 && (
            <ChevronRight className="absolute -right-3 top-8 hidden h-4 w-4 text-white/40 lg:block" />
          )}
        </div>
      </Reveal>
    ))}
  </div>
</div>
```

---

## 9. Header sticky com estado de scroll

```tsx
const [scrolled, setScrolled] = useState(false);
useEffect(() => {
  const onScroll = () => setScrolled(window.scrollY > 12);
  window.addEventListener('scroll', onScroll, { passive: true });
  return () => window.removeEventListener('scroll', onScroll);
}, []);

<header className={clsx(
  'fixed inset-x-0 top-0 z-50 transition-all duration-300',
  scrolled ? 'backdrop-blur-xl border-b border-white/[.08]' : 'border-b border-transparent'
)}
style={{ background: scrolled ? 'rgba(0,55,100,.55)' : 'transparent' }}>
```

---

## 11. Pill/eyebrow com dot pulsante ("PRÓXIMOS PASSOS")

Badge pill usado como eyebrow de seção sobre fundo claro ou escuro, com ponto pulsante à esquerda:

```tsx
<motion.div variants={vFadeUp} className="mb-5 inline-flex items-center gap-3" style={{
  background: 'rgba(3,98,200,0.08)',
  border: '1px solid rgba(3,98,200,0.20)',
  borderRadius: 100, padding: '6px 20px',
}}>
  <span style={{
    width: 7, height: 7, borderRadius: '50%', background: '#0362C8', display: 'inline-block',
    animation: 'rmap-pulse 1.6s ease-in-out infinite',
  }} />
  <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#0362C8' }}>
    Próximos Passos
  </span>
</motion.div>
```

Sobre fundo azul escuro (FinalCTA), a mesma pill usa tom translúcido branco em vez de `#0362C8`:

```tsx
<div style={{
  display: 'inline-flex', alignItems: 'center', gap: 8,
  background: 'rgba(255,255,255,0.12)',
  border: '1px solid rgba(255,255,255,0.25)',
  borderRadius: 100, padding: '6px 18px',
}}>
  <Sparkles style={{ width: 14, height: 14, color: 'rgba(255,255,255,0.80)' }} aria-hidden />
  <span style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.80)' }}>
    Sistran Labs
  </span>
</div>
```

Keyframe do dot:
```css
@keyframes rmap-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.6); opacity: 0.5; }
}
```

---

## 12. Fundo azul com grid de pontos + linhas tracejadas (HeroBackground / Roadmap / FinalCTA)

Receita completa de fundo institucional escuro, usada no Hero (`HeroBackground.tsx`), no cabeçalho do `Roadmap.tsx` e no `FinalCTA.tsx`. Camadas em `zIndex` crescente:

1. **Gradiente base radial** (navy): `radial-gradient(100% 100% at 50% 0%, #024EA0 0%, #031770 56.6%, #010E2D 100%)`.
2. **Orbs difusos** flutuantes: círculos grandes (`600–900px`) com `filter: blur(113px)` e `animation: orb-float-N 7-12s ease-in-out infinite` (translateY leve).
3. **Grid de pontos** com máscara radial (dá o efeito "dotted" que desaparece nas bordas):
   ```tsx
   <div aria-hidden style={{
     position: 'absolute', inset: 0, pointerEvents: 'none',
     backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)',
     backgroundSize: '40px 40px',
     maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
     WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
   }} />
   ```
   Versão mais simples/sem máscara (Roadmap/FinalCTA, fundo já delimitado pela seção): `backgroundSize: '32px 32px'`, opacidade `0.12`, sem `maskImage`.
4. **Faixas diagonais** com `border-dashed` + `rotate(-65.35deg) skewX(-11.34deg)` + drift lateral via keyframes (`translateX` ±14–22px).
5. **Linhas SVG tracejadas em movimento** — o efeito das curvas "avançando":
   ```tsx
   <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
     <defs>
       <linearGradient id="lg1" x1="0%" y1="0%" x2="100%" y2="0%">
         <stop offset="0%" stopColor="#003D7A" stopOpacity="0" />
         <stop offset="30%" stopColor="#57B7EE" stopOpacity="1" />
         <stop offset="70%" stopColor="#78C9F8" stopOpacity="1" />
         <stop offset="100%" stopColor="#78C9F8" stopOpacity="0" />
       </linearGradient>
     </defs>
     <path d="M -100 700 Q 300 200 720 380 T 1540 100" fill="none"
           stroke="url(#lg1)" strokeWidth="1.4" strokeDasharray="6 6"
           opacity="0.55" style={{ animation: 'dash-march 2.5s linear infinite' }} />
     {/* linhas estáticas de textura, quase invisíveis */}
     <line x1="0" y1="520" x2="1440" y2="280" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
   </svg>
   ```
   Keyframes:
   ```css
   @keyframes dash-march     { to { stroke-dashoffset: -40; } }
   @keyframes dash-march-rev { to { stroke-dashoffset: 40; } }
   ```
   Usar 2–3 gradientes `linearGradient` (ida `lg1`, volta `lg2` com stops invertidos) e alternar `dash-march`/`dash-march-rev` com durações/delays distintos (2.5–5s) para não sincronizar.

Regra: reservar essa receita completa (5 camadas) para seções "hero"/fechamento; em seções internas, usar só a camada 3 (grid de pontos) como textura leve.

---

## 13. Regras de ouro (uso destes efeitos)

- **3D tilt**: usar apenas em cards "hero" (métrica, feature destacado). Não aplicar em grids grandes (>8 cards) — pesa.
- **Count-up**: sempre com `IntersectionObserver` (não anime no mount) e `tabular-nums`.
- **Orb do cursor**: `pointer-events: none`. Nunca ficar acima do texto.
- **Modais**: `overflow-hidden` no `body` enquanto aberto (opcional) e ESC listener obrigatório.
- **Filtro**: `motion.div layout` + `AnimatePresence` — chaves estáveis (id, não índice).
- **Reduced motion**: envolver todos animation-heavy em `useReducedMotion()` e desligar transform/scale se `true`.
- **Cores por categoria**: usar sufixos hex `20/25/40/55` para variar opacidade sem novos tokens.
