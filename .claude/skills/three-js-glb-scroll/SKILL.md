---
name: three-js-glb-scroll
description: Implementar objetos 3D GLB/GLTF com Three.js animados via scroll usando GSAP. Use quando precisar carregar modelos 3D, configurar cena Three.js, renderizador, câmera e sincronizar animações 3D com scroll da página.
---

## Conceito
Carregar modelo 3D (`.glb`/`.gltf`) com Three.js e animá-lo sincronizado com scroll via GSAP.

## Setup HTML
```html
<section class="div3d">
  <h2>Design Único</h2>
</section>

<script type="importmap">
{
  "imports": {
    "three": "https://cdn.jsdelivr.net/npm/three@latest/build/three.module.js",
    "three/addons/": "https://cdn.jsdelivr.net/npm/three@latest/examples/jsm/"
  }
}
</script>
<script type="module" src="script.js"></script>
```

## Setup Three.js básico
```javascript
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// 1. Cena
const cena = new THREE.Scene();

// 2. Câmera
const camera = new THREE.PerspectiveCamera(
  40,                                     // FOV
  window.innerWidth / window.innerHeight, // aspect
  0.1, 1000                               // near, far
);
camera.position.z = 4;

// 3. Renderizador
const renderizador = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,                            // fundo transparente
});
renderizador.setSize(window.innerWidth, window.innerHeight);
renderizador.setPixelRatio(window.devicePixelRatio);

// Rendering fisicamente correto
renderizador.outputColorSpace = THREE.SRGBColorSpace;
renderizador.toneMapping = THREE.ACESFilmicToneMapping;
renderizador.toneMappingExposure = 1.2;

document.querySelector(".div3d").appendChild(renderizador.domElement);
```

## CSS do container
```css
.div3d {
  position: relative;
  height: 100vh;
}
.div3d canvas {
  position: absolute;
  inset: 0;
  width: 100% !important;
  height: 100% !important;
}
```

## Carregar GLB
```javascript
let objeto;
const loader = new GLTFLoader();

loader.load("assets/diamond.glb", (gltf) => {
  objeto = gltf.scene;
  objeto.position.set(-5, 2, -12);  // posição inicial
  cena.add(objeto);

  // Animação scroll-linked
  const tl3d = gsap.timeline({
    scrollTrigger: {
      trigger: ".animations",
      scrub: true,
      pin: true,
      end: "+=2000",
    },
  });

  tl3d.to(objeto.position, { x: 0, y: 0, duration: 1 });
  tl3d.to(objeto.rotation, { x: 1.5 * Math.PI, duration: 1 }, "<");
  tl3d.to(objeto.position, { z: 3.2, duration: 0.2 }, "-=.1");
});
```

## Loop de render (RAF)
```javascript
function animar() {
  if (objeto) objeto.rotation.y += 0.005;  // giro contínuo
  requestAnimationFrame(animar);
  renderizador.render(cena, camera);
}
animar();
```

## Resize handler
```javascript
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderizador.setSize(window.innerWidth, window.innerHeight);
});
```

## Otimizações
- Use `.glb` comprimido (draco/meshopt) em vez de `.gltf` bruto.
- `setPixelRatio(Math.min(window.devicePixelRatio, 2))` — cap em 2 para retina.
- Remova `antialias: true` em mobile se quiser mais FPS (use postprocessing FXAA depois).
- `renderer.shadowMap.enabled = false` se não precisar sombras.

## Rotação e posição: graus vs radianos
Three.js usa **radianos**. Convert:
```javascript
const rad = (deg) => deg * Math.PI / 180;
objeto.rotation.y = rad(45);
// ou direto:
objeto.rotation.y = 0.5 * Math.PI; // 90°
```

## Pitfalls
- GLB carrega assíncrono → sempre checar `if (objeto)` antes de animar.
- Se usar ScrollSmoother com pin, o canvas precisa estar fora do `#smooth-content` OU ter `will-change` bem gerenciado — testar.
- CORS: GLB hospedado em CDN precisa de header `Access-Control-Allow-Origin`.
