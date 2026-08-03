---
name: hdri-lighting
description: Implementar iluminação HDRI (PMREM) em cenas Three.js para renderização PBR realista com reflexos corretos. Use quando precisar iluminação ambiente baseada em imagem, configurar environment maps, tone mapping e materiais físicos.
---

## Conceito
HDRI (High Dynamic Range Image) é uma textura panorâmica 360° usada como **ambiente de iluminação** em renderização PBR (physically-based rendering). Produz iluminação realista e reflexos corretos em materiais metálicos/glass.

## Setup
```javascript
import * as THREE from "three";

const textureLoader = new THREE.TextureLoader();

textureLoader.load("assets/hdri.webp", (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;

  // PMREM = Prefiltered Mipmapped Radiance Environment Map
  const pmrem = new THREE.PMREMGenerator(renderizador);
  const envMap = pmrem.fromEquirectangular(texture).texture;

  cena.environment = envMap;   // aplica a TODOS materiais PBR
  // cena.background = envMap; // opcional: mostra HDRI como fundo

  texture.dispose();
  pmrem.dispose();
});
```

## Para HDR de verdade (.hdr / .exr)
```javascript
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import { EXRLoader } from "three/addons/loaders/EXRLoader.js";

new RGBELoader().load("env.hdr", (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  cena.environment = texture;
});
```

## Configuração do renderer (essencial)
```javascript
renderizador.outputColorSpace = THREE.SRGBColorSpace;
renderizador.toneMapping = THREE.ACESFilmicToneMapping;
renderizador.toneMappingExposure = 1.2;   // ajusta exposição
```

Sem essas linhas, cores ficam apagadas/saturadas demais.

## Intensidade do env
```javascript
// Three.js r155+
cena.environmentIntensity = 1.5;

// Ou por material:
material.envMapIntensity = 2;
```

## Onde conseguir HDRIs gratuitos
- [polyhaven.com/hdris](https://polyhaven.com/hdris) (CC0)
- [hdrihaven.com](https://hdrihaven.com) → redireciona para polyhaven

## Tamanho/Performance
- 1K (1024x512) → boa iluminação, leve (~200kb)
- 2K → bom para reflexos em closeups
- 4K+ → só se for background visível, pesado

## Converter HDRI para webp/jpg otimizado
HDRIs originais são grandes (.hdr 10-50MB). Para web:
1. Usar [HDRI-to-CubeMap](https://matheowis.github.io/HDRI-to-CubeMap/) ou Blender
2. Exportar como JPG/WebP equirectangular em 1K
3. Habilitar `EquirectangularReflectionMapping`

## Pitfalls
- `PMREMGenerator` é custoso → fazer apenas uma vez no carregamento.
- `texture.dispose()` e `pmrem.dispose()` depois de usar (libera memória).
- HDRI como `cena.background` dá pano de fundo giratório — combine com `cena.backgroundBlurriness` (r155+) para desfocar.
- Materiais precisam ser `MeshStandardMaterial` ou `MeshPhysicalMaterial` para usar `environment`.
