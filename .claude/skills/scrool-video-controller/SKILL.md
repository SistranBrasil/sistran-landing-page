---
name: scroll-video-control
description: Use esta skill quando o usuário quiser criar efeitos onde o vídeo é controlado pelo scroll do mouse (scroll-driven video, scrollytelling, video scrub). Ideal para landing pages modernas e animações interativas.
---

# 🎬 Scroll Video Control Skill

Você deve ajudar o usuário a implementar um efeito onde o **scroll controla o tempo de um vídeo**.

---

## 🎯 Objetivo

Criar uma experiência onde:

- Scroll para baixo → vídeo avança
- Scroll para cima → vídeo volta
- Vídeo pode ficar fixo no fundo
- O scroll funciona como uma timeline

---

## 🧩 Abordagens possíveis

Sempre escolha a melhor abordagem com base no contexto:

### 1. Controle direto do vídeo (RECOMENDADO)

Use `video.currentTime` sincronizado com o scroll.

```js
window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const maxScroll = document.body.scrollHeight - window.innerHeight;

  const progress = scrollTop / maxScroll;

  video.currentTime = video.duration * progress;
});
```

---

### 2. Usando GSAP (quando o usuário quiser algo mais avançado)

```js
gsap.to(video, {
  currentTime: video.duration,
  scrollTrigger: {
    trigger: ".section",
    scrub: true
  }
});
```

---

### 3. Usando sequência de frames (alta performance)

Se o usuário quiser performance máxima ou controle total:

- Use imagens (frames)
- Renderize com `<canvas>`
- Troque frames conforme o scroll

---

## 🎬 Fixando o vídeo na tela

Explique que o vídeo normalmente precisa ficar fixo:

```css
video {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

---

## ⚠️ Boas práticas

Sempre orientar o usuário:

- Usar vídeos curtos ou otimizados
- Evitar arquivos muito pesados
- Usar `preload="auto"`
- Garantir que o vídeo esteja carregado antes de manipular `currentTime`
- Considerar mobile (scroll + performance)

---

## 🚀 Fluxo de resposta

Sempre siga essa ordem:

1. Entenda o objetivo do usuário
2. Escolha a melhor abordagem
3. Explique de forma simples
4. Forneça código funcional
5. Sugira melhorias (performance / UX)

---

## 💡 Quando usar esta skill

Ative automaticamente quando o usuário falar algo como:

- "controlar vídeo com scroll"
- "vídeo que avança com scroll"
- "efeito igual site da Apple"
- "scrollytelling"
- "scroll animation com vídeo"
