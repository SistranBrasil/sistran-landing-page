---
name: video-background
description: Implementar vídeo autoplay como background de hero/seção com lazy load, fade-in progressivo e fallback de imagem para landing pages performáticas
---

## Conceito
Vídeo autoplay como fundo, carregado de forma assíncrona após a página estar pronta, com fade-in quando disponível.

## HTML inicial (apenas placeholder image)
```html
<div class="midiaBackground">
  <img src="bg-hero.webp" alt="" />
  <!-- vídeo injetado via JS -->
</div>
```

## CSS
```css
.midiaBackground {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  overflow: hidden;
  z-index: 0;
}
.midiaBackground img,
.midiaBackground video {
  width: 100%; height: 100%;
  object-fit: cover;
  position: absolute; inset: 0;
  transition: opacity 0.6s;
}
```

## JS — Lazy load com fade-in
```javascript
window.addEventListener("load", () => {
  const container = document.querySelector(".hero .midiaBackground");
  const video = document.createElement("video");

  video.src = "assets/img/video-hero.mp4";
  video.autoplay = true;
  video.muted = true;          // obrigatório para autoplay em mobile
  video.playsInline = true;    // previne fullscreen em iOS
  video.loop = true;
  video.style.opacity = 0;

  video.addEventListener("canplaythrough", () => {
    video.style.opacity = 1;   // mostra só quando vídeo está pronto
  });

  container.appendChild(video);
});
```

## Inline HTML (alternativa sem JS)
```html
<video autoplay muted loop playsinline preload="metadata">
  <source src="video.webm" type="video/webm">
  <source src="video.mp4" type="video/mp4">
</video>
```

Atributos essenciais:
- `muted` — obrigatório para autoplay (política dos browsers)
- `playsinline` — iOS não faz fullscreen forçado
- `loop` — repete infinitamente
- `preload="metadata"` — só baixa metadados inicialmente
- `preload="none"` — só baixa quando usuário interage

## Poster (imagem inicial)
```html
<video poster="bg-hero.webp" autoplay muted loop playsinline>
  <source src="video.mp4" type="video/mp4">
</video>
```

## Controle via JS
```javascript
video.play();
video.pause();
video.currentTime = 5;         // seek
video.playbackRate = 0.5;      // meia velocidade
```

## Pausar em mobile/low battery
```javascript
if (window.matchMedia("(max-width: 768px)").matches) {
  video.remove();  // mobile: não carrega vídeo
}

// ou detectar prefers-reduced-motion
if (window.matchMedia("(prefers-reduced-motion)").matches) {
  video.pause();
}
```

## Formatos
- **WebM (VP9)**: menor, mais eficiente (~40% menor que MP4)
- **MP4 (H.264)**: compatibilidade universal
- **MP4 (H.265/HEVC)**: melhor que H.264 mas suporte limitado

Comprimir com FFmpeg:
```bash
# WebM VP9
ffmpeg -i input.mp4 -c:v libvpx-vp9 -crf 35 -b:v 0 -an output.webm

# MP4 H.264 otimizado
ffmpeg -i input.mp4 -c:v libx264 -crf 28 -preset slow -an -movflags +faststart output.mp4
```

`-an` remove audio (vídeo de background não precisa).
`-movflags +faststart` move metadados para o início → começa a tocar antes de baixar tudo.

## Pitfalls
- Autoplay **nunca** funciona com áudio. Sempre `muted`.
- Em Safari iOS, `playsinline` é obrigatório.
- Vídeos grandes atrasam `window.load` — use `DOMContentLoaded` se quiser menos bloqueio.
- `canplaythrough` pode nunca disparar em conexões lentas — colocar timeout fallback.
- Battery Saver em iOS/Android pausa autoplay — verificar `video.paused` periodicamente.
