# Prompts Veo 3 — Vídeo de fundo do Hero (Sistran)

## Direção visual (resumo)

1. Atmosfera **navy profundo (#04122A)** com acentos de ciano/azul elétrico e um toque discreto de violeta — o vídeo é uma extensão do fundo atual do site (orbs radiais + grid sutil), não uma cena nova.
2. Movimento **lento, contínuo e hipnótico** que comunica dados, precisão e solidez — nada figurativo, nada humano; tom executivo e técnico, não "startup flashy".
3. **Lado esquerdo e centro quase pretos e sem detalhe** (zona da headline branca + CTA); toda a luz e o movimento concentrados no terço direito ou nas bordas.

## Restrições comuns (valem para os 3)

- 16:9 · 5–8 s · pensado para loop (movimento cíclico, último frame ≈ primeiro)
- Sem texto, logos, rostos, marcas · **sem áudio** (pedido explicitamente no prompt)
- Centro/esquerda escuros e de baixo contraste → headline branca passa em AA
- Movimento lento, sem cortes, sem flashes, sem zoom brusco

---

## Conceito 1 — "Fluxo de Dados" (filamentos de luz em navy)

**Por que combina:** traduz literalmente o negócio — fluxo de informação de seguros (apólices, sinistros, APIs) passando por sistemas — com a mesma linguagem de luz ciano/azul dos glass cards do site. É abstrato, sóbrio e envelhece bem.

```text
Abstract slow-motion data visualization: thin luminous filaments of light,
like fiber-optic strands and fine particle streams, flowing steadily from
the lower right corner toward the upper right area of the frame, gently
curving, occasionally pulsing softly as faint nodes light up along the
strands. The strands drift in a constant, cyclical motion designed to loop
seamlessly — the flow pattern at the final frame matches the first frame.
Camera: completely static, locked-off shot, no camera movement at all.
Lens: 50mm equivalent, shallow depth of field — nearest filaments softly
out of focus, mid-distance strands crisp. Lighting: no visible light
source; the filaments themselves are the only light, glowing cyan
(#0ed8f6) and electric blue (#0079CB) with one or two faint violet
(#7c3aed) accents, against a very dark navy background (#04122A). The left
60% of the frame stays almost pure dark navy with only the faintest ambient
glow — all detail and brightness concentrated in the right third. Palette:
deep navy, cyan, electric blue, hint of violet; cool grade, crushed blacks,
no highlights above 60% brightness. Texture: clean digital render, very
subtle fine grain, no banding. Mood: precise, calm, engineered, premium
corporate technology. 16:9, 8 seconds, completely silent, no audio, no
music, no sound effects.
```

**Negative prompt:**

```text
text, letters, numbers, logos, watermarks, people, faces, hands, UI
screens, charts, lens flare, camera movement, zoom, cuts, flicker,
strobing, bright white areas, warm colors, orange, red, green, daylight,
audio, music, sound
```

- **Color grading sugerido:** curva S suave com pretos esmagados a `#04122A` (não preto puro, para casar com o `body`), realce só nos ciano/azul; saturação global −10%, ganho de azul nas sombras.
- **Zona segura do texto:** 60% esquerdo do frame, do topo à base — luminância média abaixo de ~15%.

---

## Conceito 2 — "Blue Hour Corporativo" (arquitetura de vidro desfocada)

**Por que combina:** solidez e permanência ("desde 1988") — fachadas de vidro corporativas na hora azul evocam o mundo das seguradoras e sedes empresariais, mas o desfoque profundo transforma tudo em textura abstrata premium, sem prédio identificável.

```text
Extreme defocused abstract shot of a modern corporate glass facade at blue
hour: soft bokeh circles and vertical blurred bands of window light,
completely unrecognizable as any specific building, reading as an abstract
field of cool light. The bokeh lights drift very slowly and uniformly to
the left as if the camera glides at a constant speed on a rail, motion so
slow and even that the pattern loops seamlessly — final frame matching the
first. Camera: extremely slow constant lateral dolly, no acceleration, no
shake. Lens: 85mm, wide open aperture f/1.4, everything far beyond focus —
pure bokeh texture, zero sharp detail. Lighting: dusk blue hour, deep
twilight sky tones; window lights rendered as cool cyan and pale blue
bokeh, one or two faint violet reflections. The left and center of frame
dominated by dark navy twilight sky with almost no lights; the bokeh
concentration sits in the right quarter and upper right edge. Palette:
deep navy (#04122A), desaturated steel blue, cyan (#0ed8f6) highlights
kept dim, subtle violet accent; cool cinematic grade, lifted shadows
slightly blue, no pure white. Texture: gentle 35mm film grain, soft
halation on the bokeh. Mood: established, serene, premium, institutional
confidence at dusk. 16:9, 8 seconds, completely silent, no audio, no
music, no ambient sound.
```

**Negative prompt:**

```text
recognizable buildings, skyline landmarks, text, signage, logos, people,
silhouettes, cars, streets, sharp focus, fast motion, camera shake, zoom,
cuts, flicker, warm orange lights, sunset colors, red, green, daylight,
overexposed highlights, audio, music, sound
```

- **Color grading sugerido:** teal-and-navy (sem o orange): sombras para `#04122A`, meios-tons dessaturados aço, highlights limitados a ~55% e puxados para ciano; leve halation nos bokehs.
- **Zona segura do texto:** metade esquerda + centro vertical — céu crepuscular escuro e uniforme, sem bokeh.

---

## Conceito 3 — "Malha Topográfica" (grid 3D respirando)

**Por que combina:** o site já tem um grid de linhas sutis no fundo (`body::after`) — este conceito anima essa mesma ideia: uma malha de precisão que ondula lentamente, como modelagem de risco/dados atuariais. Continuidade perfeita entre vídeo e restante da página no scroll.

```text
Abstract 3D wireframe terrain: a fine luminous grid mesh, like a
topographic surface of data, seen from a low three-quarter angle,
occupying the bottom third and right side of the frame and receding into
darkness toward the horizon. The mesh undulates in slow, smooth sine
waves, like a calm digital ocean breathing — the wave motion is perfectly
cyclical so the final frame matches the first for a seamless loop. Faint
points of light travel slowly along a few grid lines. Camera: static,
locked-off, no movement. Lens: 35mm equivalent, deep focus on the mesh,
atmospheric falloff fading the far grid into the dark background. Lighting:
self-illuminated grid lines in dim electric blue (#0079CB) with sparse
cyan (#0ed8f6) node highlights and a barely visible violet (#7c3aed) glow
at the far horizon; no other light sources. Upper left two-thirds of the
frame is pure deep navy darkness (#04122A) with a very subtle vertical
gradient. Palette: deep navy, electric blue, cyan, trace of violet; cool
grade, high black density, grid line brightness kept low and even.
Texture: clean vector-like render with a whisper of digital grain, no
banding in the dark areas. Mood: analytical, controlled, quietly powerful,
enterprise-grade technology. 16:9, 8 seconds, completely silent, no
audio, no music, no sound effects.
```

**Negative prompt:**

```text
text, numbers, labels, logos, people, realistic landscape, mountains with
texture, water, sky with clouds, bright flashes, strobing, fast waves,
camera movement, zoom, rotation, cuts, warm colors, orange, red, green,
white background, overexposure, audio, music, sound
```

- **Color grading sugerido:** monocromático azul com dois acentos: linhas do grid a ~35% de luminância, nós ciano a ~55% máx.; dithering leve nas áreas escuras para evitar banding no encode do vídeo.
- **Zona segura do texto:** dois terços superiores-esquerdos — navy quase sólido; a malha só ocupa a base e a direita.

---

## Conceito 3B — Variação "Abertura" (ignição + loop)

**Quando usar:** o vídeo é o primeiro contato com a página. Esta variação tem um
arco de entrada — a malha "acende" nos primeiros ~2 segundos e depois entra no
ciclo de ondas. O site segura a headline até o momento da ignição (ver
coreografia abaixo).

**Como funciona no player:** o vídeo toca 1x inteiro (ignição + ondas). Para o
loop contínuo depois da abertura, há duas opções:
- **Opção simples:** deixar o vídeo em `loop` — a ignição se repete a cada 8s,
  mas como é sutil (luz subindo, não um flash), funciona como uma "respiração".
- **Opção ideal:** gerar também o Conceito 3 original (loop puro) e trocar de
  vídeo via JS no evento `ended` do primeiro. Crossfade de 0.3s entre os dois.

```text
Abstract 3D wireframe terrain awakening: the frame opens on near-total deep
navy darkness (#04122A) with only the faintest hint of a dormant grid mesh
in the bottom right. Over the first 2 seconds, thin luminous grid lines
gradually ignite across the mesh — light spreading smoothly outward from
the lower right corner like current flowing through circuits, never
flashing, a slow continuous brightening. Once lit, the fine topographic
grid mesh, seen from a low three-quarter angle, occupies the bottom third
and right side of the frame and undulates in slow, smooth sine waves like
a calm digital ocean breathing, with faint points of light traveling
slowly along a few grid lines. The wave motion in the final seconds is
perfectly cyclical, and the final frame matches the fully-lit state at the
2-second mark, so the video can loop back seamlessly after the intro.
Camera: static, locked-off, no movement. Lens: 35mm equivalent, deep focus
on the mesh, atmospheric falloff fading the far grid into the dark
background. Lighting: self-illuminated grid lines in dim electric blue
(#0079CB) with sparse cyan (#0ed8f6) node highlights and a barely visible
violet (#7c3aed) glow at the far horizon; no other light sources. Upper
left two-thirds of the frame stays pure deep navy darkness (#04122A)
throughout, including during the ignition. Palette: deep navy, electric
blue, cyan, trace of violet; cool grade, high black density, grid line
brightness kept low and even after ignition. Texture: clean vector-like
render with a whisper of digital grain, no banding in the dark areas.
Mood: analytical, controlled, quietly powerful, a system coming online —
enterprise-grade technology. 16:9, 8 seconds, completely silent, no audio,
no music, no sound effects.
```

**Negative prompt:**

```text
text, numbers, labels, logos, people, realistic landscape, mountains with
texture, water, sky with clouds, bright flashes, strobing, sudden light
burst, fast waves, camera movement, zoom, rotation, cuts, warm colors,
orange, red, green, white background, overexposure, audio, music, sound
```

- **Color grading / zona segura:** iguais ao Conceito 3 — a ignição não pode
  ultrapassar ~55% de luminância nem invadir os dois terços superiores-esquerdos.

---

## Conceito 4 — "A Máquina Sistran" (narrativa scroll-driven)

**O que é:** não é mais um loop de fundo — é um **filme controlado pelo scroll**.
Conforme o usuário rola, a história avança: alguém digitando → o código vira
fluxo de dados → uma IA se forma → os sistemas/inovações da Sistran surgem →
tudo se assenta na malha calma (que conecta com o resto do site). O scroll é a
timeline (scrollytelling, estilo Apple).

**Por que combina:** conta a história real da empresa — pessoas construindo
(delivery, squads) → integração e dados (APIs, migrações) → IA pragmática →
solidez de 35+ anos. Cada capítulo do vídeo casa com um capítulo do scrub que
o `HeroCinematic` já tem (0–15% chip, 15–40% título, 40–65% pilares, 65–100%
CTAs/ticker).

**Como o Veo entra:** o Veo gera clipes de 8s. A narrativa é feita de **4 cenas
de 8s** geradas separadamente e encadeadas. Cada prompt abaixo descreve onde a
cena termina para casar com o início da seguinte (match cut) — o crossfade
entre cenas fica no scroll (0.3–0.5 de progresso sobreposto).

### Cena 1 — "As mãos que constroem" (0–25% do scroll)

Capítulo do site: badge "Especialistas em seguros desde 1988".

```text
Cinematic macro shot in a dark room: close-up of hands typing steadily on a
backlit mechanical keyboard, seen from a low side angle, face never visible,
only hands and forearms in soft shadow. The out-of-focus monitor in the
background glows deep blue and cyan with abstract unreadable code — pure
bokeh, no legible characters. Blue key backlighting reflects softly on the
fingers. The typing rhythm is calm and confident, unhurried. Camera: very
slow push-in toward the keyboard, constant speed, no shake. Lens: 100mm
macro, extremely shallow depth of field, keyboard keys crisp, everything
else dissolved in blue bokeh. Lighting: only screen glow and key backlight,
deep navy ambient darkness (#04122A), cyan (#0ed8f6) rim light on the
hands. In the final second, the camera drifts up slightly toward the
glowing screen bokeh, which fills the frame with soft defocused blue light
— ending on an abstract field of blue glow. Palette: deep navy, electric
blue (#0079CB), cyan; cool grade, crushed blacks, no whites above 60%.
Texture: subtle film grain, gentle halation on the screen glow. Mood:
focused craftsmanship, quiet expertise, late-night engineering.
Completely silent, no audio, no music. Avoid: visible face, readable text,
letters, numbers, logos, brand marks, fast motion, camera shake, cuts,
warm colors, orange, red, daylight, sound.
```

### Cena 2 — "O código vira fluxo" (25–50% do scroll)

Capítulo do site: headline "Especialistas em tecnologia para seguradoras".
Começa onde a cena 1 terminou (campo de luz azul desfocada).

```text
Abstract transformation sequence starting from a soft field of defocused
blue light: the blur gradually resolves into thousands of fine luminous
data particles and thin streams of light, flowing upward and forward
through dark 3D space like information leaving a screen and becoming a
living network. The streams curve gracefully, splitting and merging,
suggesting APIs and systems exchanging data — elegant, organic curves,
never angular circuit traces. Camera: slow continuous forward glide
through the particle streams, constant speed. Lens: 50mm, shallow depth,
near particles softly blurred, mid-distance streams crisp. Lighting: the
particles are the only light — cyan (#0ed8f6) and electric blue (#0079CB)
with rare faint violet (#7c3aed) pulses, against deep navy darkness
(#04122A). The left third of the frame stays mostly dark. In the final
second the streams begin converging toward a single bright point ahead of
the camera. Palette: deep navy, cyan, electric blue, trace violet; cool
grade, dense blacks. Texture: clean render, whisper of grain, soft glow
halation. Mood: momentum, intelligence in motion, systems connecting.
Completely silent, no audio, no music. Avoid: text, numbers, logos,
circuit boards, PCB traces, angular zigzag lines, people, faces, flashes,
strobing, fast cuts, camera shake, warm colors, orange, red, green, sound.
```

### Cena 3 — "A inteligência se forma" (50–75% do scroll)

Capítulo do site: pilares/soluções (PillarsCarousel). Começa na convergência
de partículas da cena 2.

```text
Abstract AI formation: converging streams of cyan and blue light particles
weave themselves into a luminous three-dimensional lattice — a slowly
rotating spherical neural structure floating in dark space, right of
center frame. Fine filaments connect softly pulsing nodes; the structure
breathes, expanding and contracting very slightly, alive but calm.
Around it, faint orbiting rings of smaller particles suggest orchestrated
systems in motion. Camera: slow orbital drift around the structure,
constant speed, subtle. Lens: 65mm, medium depth of field, structure
crisp, background dissolved. Lighting: self-illuminated structure in cyan
(#0ed8f6) and electric blue (#0079CB) with a soft violet (#7c3aed) inner
core glow; deep navy void (#04122A) everywhere else, left third of frame
nearly empty darkness. In the final second the structure gently dims and
begins dissolving downward into fine falling particles. Palette: deep
navy, cyan, electric blue, violet core; cool grade, high black density,
brightness capped around 60%. Texture: clean volumetric render, subtle
grain, soft bloom. Mood: emergent intelligence, precision, quiet power —
pragmatic AI, not science fiction spectacle. Completely silent, no audio,
no music. Avoid: text, numbers, logos, human faces, robot faces,
humanoid figures, brains with realistic anatomy, lens flare, flashes,
strobing, fast rotation, cuts, warm colors, orange, red, green, sound.
```

### Cena 4 — "A base sólida" (75–100% do scroll)

Capítulo do site: CTAs + trust ticker + peek "Quem somos". Começa nas
partículas caindo da cena 3 e termina na malha calma — **o frame final é o
Conceito 3**, então o fundo pode continuar em loop depois que a narrativa acaba.

```text
Abstract resolution sequence: fine luminous particles drift slowly
downward through deep navy darkness (#04122A) and settle into a sparse,
calm wireframe mesh of smooth curved lines — a serene topographic surface
of data occupying the bottom third and right side of the frame, receding
to a dark horizon. Once formed, the mesh undulates in slow rounded sine
waves like calm breathing, with a few soft cyan points of light traveling
along the lines. The wave motion at the end is perfectly cyclical so the
final frame can loop seamlessly. Camera: static, locked-off, no movement.
Lens: 35mm, deep focus, atmospheric falloff into darkness. Lighting: dim
electric blue (#0079CB) mesh lines, sparse cyan (#0ed8f6) nodes, barely
visible violet (#7c3aed) horizon glow; upper left two-thirds of frame pure
empty navy darkness. Palette: deep navy, dim blue, cyan; cool grade,
dense blacks, low even brightness. Texture: clean render, subtle grain,
no banding. Mood: stability, permanence, quiet confidence — a system at
rest, running flawlessly. Completely silent, no audio, no music. Avoid:
circuit boards, angular lines, dense mesh, text, numbers, logos, people,
water, clouds, flashes, camera movement, zoom, cuts, warm colors, orange,
red, green, bright left side, overexposure, sound.
```

### Integração no site (scroll controla o vídeo)

Duas rotas — recomendo a **A** pela robustez:

**Rota A — 4 vídeos, crossfade por capítulo (recomendada).** Cada cena é um
`<video>` em loop, empilhados em `position: absolute`. O scrub do
`HeroCinematic` anima só a `opacity` de cada camada nos limites 25/50/75%.
Robusto (loop nativo, sem seek), leve, e o timing dos textos já existente não
muda — cada capítulo de texto ganha "seu" vídeo.

```tsx
// dentro da timeline scrub existente (progresso 0–1 do wrapper)
tl.to(videoCena1, { opacity: 0, duration: 0.06 }, 0.22)
  .fromTo(videoCena2, { opacity: 0 }, { opacity: 1, duration: 0.06 }, 0.22)
  .to(videoCena2, { opacity: 0, duration: 0.06 }, 0.47)
  .fromTo(videoCena3, { opacity: 0 }, { opacity: 1, duration: 0.06 }, 0.47)
  .to(videoCena3, { opacity: 0, duration: 0.06 }, 0.72)
  .fromTo(videoCena4, { opacity: 0 }, { opacity: 1, duration: 0.06 }, 0.72);
```

**Rota B — 1 vídeo concatenado, scrub por `currentTime`.** Concatenar as 4
cenas em um MP4 de 32s e amarrar `video.currentTime` ao progresso:

```tsx
gsap.to(video, {
  currentTime: video.duration,
  ease: 'none',
  scrollTrigger: { trigger: wrapper, start: 'top top', end: 'bottom bottom', scrub: 0.6 },
});
```

Exige encode com keyframe em todo frame para seek suave (arquivo ~3× maior):

```bash
# concatenar e preparar para scrub
ffmpeg -f concat -safe 0 -i cenas.txt -c:v libx264 -crf 26 -g 1 \
  -pix_fmt yuv420p -an -movflags +faststart hero-scrub.mp4
```

Em iOS o seek de vídeo por scroll pode engasgar — se escolher a rota B,
sirva a rota A (ou só posters com fade) em mobile.

**Regras que continuam valendo:** zona esquerda escura em todas as cenas (os
textos do hero ficam por cima), nada de texto/logo/rosto dentro do vídeo,
tudo silencioso. A logo e as palavras "IA", produtos etc. quem escreve é o
site (SplitText/typewriter em HTML por cima do vídeo — nítido e sob controle),
nunca o Veo.

---

## Coreografia de entrada do site (primeiro contato)

A "apresentação" quem faz é o site, não o vídeo sozinho. A logo e os textos
entram como camadas HTML por cima — nítidos, responsivos e acessíveis (nunca
assados dentro do vídeo, onde o Veo os deformaria).

**Timeline (tempos a partir do fim do preloader):**

| Tempo | Camada | O quê |
|-------|--------|-------|
| 0.0s | Preloader | Sai com fade (0.4s). Vídeo já carregado atrás (`preload="auto"`), 1º frame quase preto — transição invisível |
| 0.0s | Vídeo | `video.play()` — a malha começa a acender (ignição de ~2s do 3B) |
| 0.8s | Logo | Surge no header: fade + `y: 12→0` (ou stroke drawing se tiver a versão SVG em path) |
| 1.6s | Badge | "Especialistas em seguros desde 1988" — fade + blur-out |
| 2.0s | Headline | Ignição do vídeo completa → SplitText da headline, palavras subindo (`y: 100%`, stagger 0.05, mask lines) |
| 2.8s | Parágrafo + CTAs | Fade + `y: 20→0`, stagger 0.12; CTA primário por último (é o destino do olhar) |
| 3.4s | Trust ticker | Fade-in simples — a página está "pronta" |

**Esqueleto GSAP (integrar ao `HeroCinematic.tsx`, antes do scrub de scroll):**

```tsx
const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

tl.to('#preloader', { opacity: 0, duration: 0.4, onStart: () => videoRef.current?.play() })
  .from('.header-logo', { opacity: 0, y: 12, duration: 0.6 }, 0.8)
  .from('.hero-badge', { opacity: 0, filter: 'blur(8px)', duration: 0.6 }, 1.6)
  .from(splitHeadline.words, { yPercent: 100, duration: 0.7, stagger: 0.05 }, 2.0)
  .from(['.hero-paragraph', '.hero-cta-secondary', '.hero-cta-primary'],
        { opacity: 0, y: 20, duration: 0.6, stagger: 0.12 }, 2.8)
  .from('.trust-ticker', { opacity: 0, duration: 0.8 }, 3.4);
```

**Cuidados:**

- `prefers-reduced-motion`: pular a timeline (tudo visível de imediato) e usar
  um poster estático no lugar do vídeo — o `HeroCinematic` já tem esse branch.
- Vídeo com `muted playsinline loop preload="auto"` + `poster` do 1º frame
  (quase preto navy) para não haver flash branco no carregamento.
- Mobile: considerar servir só o poster ou uma versão leve do vídeo
  (< 1.5 MB, CRF ~32) — a ignição + headline já dão a sensação de abertura.
- A timeline de entrada roda **uma vez**; o scrub de scroll existente do
  `HeroCinematic` assume depois (não animar as mesmas propriedades nos dois).

---

## Recomendação

**Para fundo em loop simples:** Conceito 3 (Malha Topográfica) — continuidade literal com o design system (grid do `body::after`), maior zona segura para a headline e o loop mais confiável de fechar sem emenda.

**Para experiência narrativa no scroll:** Conceito 4 (A Máquina Sistran) — 4 cenas que contam a história da empresa (construir → integrar → IA → solidez), casadas com os capítulos do scrub que o `HeroCinematic` já tem. A cena 4 termina exatamente no Conceito 3, então os dois se combinam: narrativa na entrada, loop calmo permanente depois. Gere as cenas na ordem e valide o match cut entre cada par antes de gerar a próxima.
