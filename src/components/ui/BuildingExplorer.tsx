"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Explorador arquitetonico 360°.
 *
 * Portado do componente entregue na raiz do projeto (`BuildingExplorer.tsx`),
 * com quatro adaptacoes exigidas pelas regras deste repositorio:
 *
 * 1. A preferencia de movimento vem de `prefersReducedMotion()`, que ja soma a
 *    do sistema com o controle "Preferencias de movimento" do site — o original
 *    lia `window.matchMedia` cru e ignorava o controle da pagina.
 * 2. O laco de render pausa quando a cena sai da viewport. Um RAF com WebGL
 *    rodando fora da tela custa bateria por nada.
 * 3. Sem WebGL nao ha imagem de render neste projeto, entao o fallback é um
 *    painel proprio, e nao um `<img>` para um arquivo inexistente.
 * 4. Sombra em 1024 (nao 2048) em telas estreitas.
 *
 * A torre é a geometria fiel do estudo `sistran-river-park-3d` (ver
 * `createTowerModel` abaixo), no lugar da torre genérica de blocos que estava
 * aqui antes. O complexo modular segue com a paleta azul da marca: névoa, luzes
 * e chão são desta página, porque o material de referência vinha quase preto e a
 * seção precisa ser clara e azul.
 */

export type BuildingModel = "tower" | "campus";

/** Interface imperativa do scroll: o pai empurra progresso sem re-renderizar. */
export type ExplorerApi = {
  setProgress: (progress: number) => void;
  /* Intensidade do marcador de andar, de 0 a 1. Fica separada do progresso
     porque quem decide QUANDO o escritorio acende é a cena que hospeda o
     predio — na cena dos escritorios é o trecho de Sao Paulo. */
  setDestaque: (intensity: number) => void;
};

type BuildingExplorerProps = {
  model: BuildingModel;
  /* O scroll dirige a cena por fora do React: um `setState` por quadro de
     rolagem re-renderizaria a arvore inteira a 60 Hz por nada. */
  apiRef?: React.RefObject<ExplorerApi | null>;
  /* Progresso ja acumulado quando a cena monta. Sem isso, trocar de modelo no
     meio da secao reiniciaria o predio do zero. */
  progressRef?: React.RefObject<number>;
  /* Andar a marcar na fachada da torre (o do escritorio de Sao Paulo é o 2º).
     Sem o prop nao existe marcador nenhum: o explorador da propria secao 360°
     continua como era. */
  andarDestacado?: number;
  rotuloDestaque?: string;
  /* Bussola, vistas rapidas e orbita pela mao do visitante. Desligados quando o
     predio entra como cena de apoio dentro de OUTRA secao dirigida por rolagem:
     ali a roda do mouse tem de continuar rolando a pagina, e nao dar zoom. */
  mostrarControles?: boolean;
};

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
/* easeOutCubic: o modulo desacelera ao encaixar, em vez de bater na posicao. */
const encaixar = (t: number) => 1 - (1 - t) ** 3;

/* Primeira fatia do scroll monta o edificio; o resto gira a camera. */
const FASE_MONTAGEM = 0.55;
/* Altura de onde cada modulo desce. Queda, e nao subida: subir atravessaria o
   piso e o anel da base. */
const ALTURA_ENTRADA = 7;
const VOLTA_ORBITA = Math.PI * 1.8;

type ViewApi = {
  setView: (view: "front" | "back" | "left" | "right") => void;
  reset: () => void;
};

type MaterialSet = {
  glass: THREE.MeshPhysicalMaterial;
  glassDark: THREE.MeshPhysicalMaterial;
  metal: THREE.MeshStandardMaterial;
  metalDark: THREE.MeshStandardMaterial;
  roof: THREE.MeshStandardMaterial;
  cyan: THREE.MeshStandardMaterial;
};

/* Paleta do modelo: azuis da marca, nao o quase-preto do material de
   referencia. A escala vai do vidro claro (#1e7ab5) ao azul profundo
   (#0f5288), com metal em gelo (#c6dcea) — mesma familia dos tokens
   --color-bg / --color-bg-alt / --color-blue do projeto. */
const makeMaterials = (): MaterialSet => ({
  glass: new THREE.MeshPhysicalMaterial({
    color: 0x1e7ab5,
    metalness: 0.55,
    roughness: 0.2,
    clearcoat: 0.82,
    clearcoatRoughness: 0.15,
    envMapIntensity: 1.25,
  }),
  glassDark: new THREE.MeshPhysicalMaterial({
    color: 0x0f5288,
    metalness: 0.58,
    roughness: 0.27,
    clearcoat: 0.65,
    clearcoatRoughness: 0.2,
  }),
  metal: new THREE.MeshStandardMaterial({
    color: 0xc6dcea,
    metalness: 0.92,
    roughness: 0.24,
  }),
  metalDark: new THREE.MeshStandardMaterial({
    color: 0x4c7c9e,
    metalness: 0.9,
    roughness: 0.3,
  }),
  roof: new THREE.MeshStandardMaterial({
    color: 0x1a5f92,
    metalness: 0.78,
    roughness: 0.38,
  }),
  cyan: new THREE.MeshStandardMaterial({
    color: 0x66e6ff,
    emissive: 0x0a98c4,
    emissiveIntensity: 1.5,
    metalness: 0.28,
    roughness: 0.22,
  }),
});

function addBox(
  parent: THREE.Object3D,
  size: [number, number, number],
  position: [number, number, number],
  material: THREE.Material,
  rotation: [number, number, number] = [0, 0, 0],
) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function addEdges(parent: THREE.Object3D, mesh: THREE.Mesh, opacity = 0.24) {
  const edgeMaterial = new THREE.LineBasicMaterial({
    color: 0xa5f0ff,
    transparent: true,
    opacity,
  });
  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(mesh.geometry),
    edgeMaterial,
  );
  edges.position.copy(mesh.position);
  edges.rotation.copy(mesh.rotation);
  parent.add(edges);
}

type BlockConfig = {
  w: number;
  h: number;
  d: number;
  x: number;
  y: number;
  z: number;
  columns?: number;
  floors?: number;
  dark?: boolean;
  fins?: boolean;
};

function addArchitecturalBlock(
  parent: THREE.Object3D,
  materials: MaterialSet,
  config: BlockConfig,
) {
  const {
    w,
    h,
    d,
    x,
    y,
    z,
    columns = 8,
    floors = 9,
    dark = false,
    fins = true,
  } = config;
  const body = addBox(
    parent,
    [w, h, d],
    [x, y, z],
    dark ? materials.glassDark : materials.glass,
  );
  addEdges(parent, body, dark ? 0.14 : 0.23);

  addBox(
    parent,
    [w + 0.16, 0.16, d + 0.16],
    [x, y + h / 2 + 0.08, z],
    materials.roof,
  );
  addBox(
    parent,
    [w + 0.08, 0.22, d + 0.08],
    [x, y - h / 2 + 0.12, z],
    materials.metalDark,
  );

  for (let floor = 1; floor < floors; floor += 1) {
    const bandY = y - h / 2 + (h / floors) * floor;
    addBox(
      parent,
      [w + 0.06, 0.045, 0.07],
      [x, bandY, z + d / 2 + 0.038],
      materials.metalDark,
    );
    addBox(
      parent,
      [w + 0.06, 0.045, 0.07],
      [x, bandY, z - d / 2 - 0.038],
      materials.metalDark,
    );
    addBox(
      parent,
      [0.07, 0.045, d + 0.05],
      [x + w / 2 + 0.038, bandY, z],
      materials.metalDark,
    );
    addBox(
      parent,
      [0.07, 0.045, d + 0.05],
      [x - w / 2 - 0.038, bandY, z],
      materials.metalDark,
    );
  }

  if (fins) {
    for (let column = 1; column < columns; column += 1) {
      const finX = x - w / 2 + (w / columns) * column;
      addBox(
        parent,
        [0.055, h + 0.02, 0.11],
        [finX, y, z + d / 2 + 0.07],
        materials.metal,
      );
      addBox(
        parent,
        [0.055, h + 0.02, 0.11],
        [finX, y, z - d / 2 - 0.07],
        materials.metal,
      );
    }
  }

  const sideColumns = Math.max(3, Math.round((columns * d) / w));
  for (let column = 1; column < sideColumns; column += 1) {
    const finZ = z - d / 2 + (d / sideColumns) * column;
    addBox(
      parent,
      [0.11, h + 0.02, 0.055],
      [x + w / 2 + 0.07, y, finZ],
      materials.metalDark,
    );
    addBox(
      parent,
      [0.11, h + 0.02, 0.055],
      [x - w / 2 - 0.07, y, finZ],
      materials.metalDark,
    );
  }

  return body;
}

/* Um modelo agora é o grupo mais a lista de modulos que o compoem, de baixo
   para cima — é essa ordem que o scroll percorre ao montar o edificio. Os
   modulos sao grupos vazios na origem, entao as coordenadas dos volumes
   continuam sendo as mesmas de antes; a animacao desloca so a altura do grupo,
   o que funciona sem depender de pivo. */
type BuildingParts = {
  group: THREE.Group;
  modules: THREE.Group[];
};

/* ---------------------------------------------------------------------------
   Torre River Park — geometria fiel

   Portada de `src/app/sistran-river-park-3d/app/BuildingViewer.tsx`, que é o
   estudo entregue: corpo envidraçado com meia-cápsula de alumínio no eixo,
   fachada traseira idêntica à frontal (clone rotacionado), laterais em vidro
   azul com malha de esquadrias e cobertura em T com antena.

   A torre genérica de blocos que existia aqui saiu no lugar dela. O que veio da
   entrega é a GEOMETRIA e os MATERIAIS; a moldura (bússola, vistas rápidas,
   montagem por rolagem, cartão de local) segue sendo a desta página — o
   componente de origem trazia cabeçalho, h1 e rodapé próprios, que a página já
   tem.

   As medidas são as do arquivo entregue e não devem ser "arredondadas": elas
   vêm das vistas frontal e lateral do prédio real.
--------------------------------------------------------------------------- */

const BODY_WIDTH = 5.55;
const BODY_DEPTH = 2.72;
const FRONT_Z = BODY_DEPTH / 2;
const WING_TOP = 11.25;
const TOWER_TOP = 13.15;

type TowerMaterials = {
  glassFront: THREE.MeshPhysicalMaterial;
  glassSide: THREE.MeshPhysicalMaterial;
  glassDark: THREE.MeshPhysicalMaterial;
  steel: THREE.MeshStandardMaterial;
  steelBright: THREE.MeshStandardMaterial;
  steelDark: THREE.MeshStandardMaterial;
  frontMullion: THREE.MeshStandardMaterial;
  seam: THREE.MeshStandardMaterial;
  blueStrip: THREE.MeshPhysicalMaterial;
  lobby: THREE.MeshPhysicalMaterial;
};

const makeTowerMaterials = (): TowerMaterials => ({
  glassFront: new THREE.MeshPhysicalMaterial({
    color: 0x5e8aa5,
    metalness: 0.28,
    roughness: 0.18,
    clearcoat: 0.92,
    clearcoatRoughness: 0.16,
    envMapIntensity: 1.35,
  }),
  glassSide: new THREE.MeshPhysicalMaterial({
    color: 0x315f7b,
    metalness: 0.34,
    roughness: 0.2,
    clearcoat: 0.86,
    clearcoatRoughness: 0.18,
    envMapIntensity: 1.25,
  }),
  glassDark: new THREE.MeshPhysicalMaterial({
    color: 0x0b2638,
    metalness: 0.42,
    roughness: 0.24,
    clearcoat: 0.72,
  }),
  steel: new THREE.MeshStandardMaterial({
    color: 0xc6ced2,
    metalness: 0.88,
    roughness: 0.24,
    envMapIntensity: 1.45,
  }),
  steelBright: new THREE.MeshStandardMaterial({
    color: 0xe0e5e7,
    metalness: 0.9,
    roughness: 0.17,
    envMapIntensity: 1.6,
  }),
  steelDark: new THREE.MeshStandardMaterial({
    color: 0x68767d,
    metalness: 0.82,
    roughness: 0.3,
  }),
  frontMullion: new THREE.MeshStandardMaterial({
    color: 0x456a7f,
    metalness: 0.5,
    roughness: 0.34,
    transparent: true,
    opacity: 0.52,
  }),
  seam: new THREE.MeshStandardMaterial({
    color: 0x77858b,
    metalness: 0.72,
    roughness: 0.3,
    transparent: true,
    opacity: 0.62,
  }),
  blueStrip: new THREE.MeshPhysicalMaterial({
    color: 0x2f6f91,
    metalness: 0.34,
    roughness: 0.14,
    clearcoat: 0.9,
  }),
  lobby: new THREE.MeshPhysicalMaterial({
    color: 0x102c3d,
    metalness: 0.38,
    roughness: 0.22,
    clearcoat: 0.75,
  }),
});

function addMesh(
  parent: THREE.Object3D,
  geometry: THREE.BufferGeometry,
  material: THREE.Material,
  position: [number, number, number],
  name?: string,
) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  if (name) mesh.name = name;
  parent.add(mesh);
  return mesh;
}

/** Esquadrias da fachada frontal: linhas de piso e montantes verticais. */
function createFrontGrid(root: THREE.Object3D, materials: TowerMaterials) {
  const frontSurface = FRONT_Z + 0.068;
  for (let floor = 1; floor <= 28; floor += 1) {
    const y = 1.45 + floor * 0.335;
    if (y > 10.95) break;
    for (const x of [-1.72, 1.72]) {
      addMesh(
        root,
        new THREE.BoxGeometry(2.0, 0.016, 0.024),
        materials.frontMullion,
        [x, y, frontSurface],
        "subtle-front-floor-line",
      ).castShadow = false;
    }
  }

  for (const x of [-2.42, -2.06, -1.7, -1.34, 1.34, 1.7, 2.06, 2.42]) {
    addMesh(
      root,
      new THREE.BoxGeometry(0.018, 9.62, 0.024),
      materials.frontMullion,
      [x, 6.12, frontSurface + 0.004],
      "subtle-front-vertical-mullion",
    ).castShadow = false;
  }
}

/**
 * Conjunto da fachada frontal. Tudo o que pertence a ela entra neste grupo,
 * porque a fachada traseira é um `clone()` girado em 180° — o prédio real tem
 * as duas faces idênticas, e clonar garante que sigam idênticas se alguém
 * mexer nas medidas.
 */
function createFrontFacade(root: THREE.Object3D, materials: TowerMaterials) {
  const facade = new THREE.Group();
  facade.name = "front-facade-assembly";
  root.add(facade);

  for (const x of [-1.72, 1.72]) {
    addMesh(
      facade,
      new THREE.BoxGeometry(2.02, 10.45, 0.055),
      materials.glassFront,
      [x, 5.72, FRONT_Z + 0.032],
      "front-blue-glass-wing",
    );
  }

  const radius = 0.69;
  const capsuleProjection = 0.9;
  const capsuleZ = FRONT_Z + capsuleProjection;
  const cylinderBase = 0.48;
  const cylinderTop = 13.02;
  const cylinderHeight = cylinderTop - cylinderBase;

  // Meia-cápsula real: só a metade frontal existe, como nas fotos do prédio.
  addMesh(
    facade,
    new THREE.CylinderGeometry(
      radius,
      radius,
      cylinderHeight,
      48,
      1,
      true,
      -Math.PI / 2,
      Math.PI,
    ),
    materials.steel,
    [0, cylinderBase + cylinderHeight / 2, capsuleZ],
    "front-rounded-aluminium-capsule",
  );

  const crown = addMesh(
    facade,
    new THREE.SphereGeometry(radius, 48, 20, 0, Math.PI * 2, 0, Math.PI / 2),
    materials.steelBright,
    [0, cylinderTop, capsuleZ],
    "front-rounded-capsule-crown",
  );
  crown.scale.z = 0.72;

  addMesh(
    facade,
    new THREE.BoxGeometry(0.065, 12.65, 0.026),
    materials.blueStrip,
    [0, 6.77, capsuleZ + radius + 0.012],
    "front-central-blue-strip",
  );

  // Juntas horizontais acompanham apenas o semicírculo frontal.
  for (let i = 1; i <= 24; i += 1) {
    const ring = addMesh(
      facade,
      new THREE.TorusGeometry(radius + 0.003, 0.008, 5, 42, Math.PI),
      materials.seam,
      [0, 0.55 + i * 0.5, capsuleZ],
      "front-capsule-horizontal-seam",
    );
    ring.rotation.x = Math.PI / 2;
    ring.castShadow = false;
  }

  /* Retornos metálicos unem o volume avançado ao plano da fachada: preservam a
     sombra profunda da referência sem deixar a cápsula flutuando. */
  for (const x of [-radius, radius]) {
    addMesh(
      facade,
      new THREE.BoxGeometry(0.035, cylinderHeight, capsuleProjection + 0.035),
      materials.steelDark,
      [x, cylinderBase + cylinderHeight / 2, FRONT_Z + capsuleProjection / 2],
      "capsule-side-return",
    );
  }

  for (const x of [-0.86, 0.86]) {
    addMesh(
      facade,
      new THREE.BoxGeometry(0.095, 12.5, 0.095),
      materials.steelBright,
      [x, 6.73, FRONT_Z + 0.12],
      "front-inner-silver-rail",
    );
  }

  for (const side of [-1, 1]) {
    addMesh(
      facade,
      new THREE.CylinderGeometry(0.075, 0.075, 10.35, 24),
      materials.steelBright,
      [side * 2.3, 5.7, FRONT_Z + 0.14],
      "front-outer-rounded-column",
    );
    addMesh(
      facade,
      new THREE.BoxGeometry(0.04, 10.7, 0.055),
      materials.steel,
      [side * 2.69, 5.83, FRONT_Z + 0.025],
      "front-outer-edge-trim",
    );
  }

  for (const x of [-0.28, 0.28]) {
    addMesh(
      facade,
      new THREE.BoxGeometry(0.48, 0.82, 0.035),
      materials.glassDark,
      [x, 0.72, FRONT_Z + 0.065],
      "front-entry-door",
    );
  }

  createFrontGrid(facade, materials);
  return facade;
}

function createSideFacades(root: THREE.Object3D, materials: TowerMaterials) {
  for (const side of [-1, 1]) {
    const x = side * (BODY_WIDTH / 2 + 0.033);
    addMesh(
      root,
      new THREE.BoxGeometry(0.055, 10.75, BODY_DEPTH - 0.06),
      materials.glassSide,
      [x, 5.85, 0],
      "blue-glass-side-facade",
    );

    for (let floor = 1; floor <= 28; floor += 1) {
      const y = 1.42 + floor * 0.335;
      if (y > 11.05) break;
      addMesh(
        root,
        new THREE.BoxGeometry(0.025, 0.016, BODY_DEPTH - 0.08),
        materials.frontMullion,
        [x + side * 0.031, y, 0],
        "side-floor-line",
      ).castShadow = false;
    }

    for (const z of [-0.9, -0.45, 0, 0.45, 0.9]) {
      addMesh(
        root,
        new THREE.BoxGeometry(0.025, 10.3, 0.022),
        materials.frontMullion,
        [x + side * 0.034, 5.98, z],
        "side-vertical-mullion",
      ).castShadow = false;
    }
  }
}

/**
 * Torre River Park dividida nos módulos que a rolagem monta, de baixo para
 * cima: base, corpo, fachadas (frente + clone traseiro), laterais, núcleo alto
 * e cobertura. A divisão é só para a coreografia — as coordenadas de cada peça
 * são absolutas, como no arquivo de origem, porque os módulos são grupos vazios
 * na origem.
 */
function createTowerModel(): BuildingParts {
  const group = new THREE.Group();
  group.name = "river-park-faithful-geometry";
  const materials = makeTowerMaterials();
  const modules: THREE.Group[] = [];
  const novoModulo = () => {
    const modulo = new THREE.Group();
    group.add(modulo);
    modules.push(modulo);
    return modulo;
  };

  // 1. Base: platô elíptico e lobby de pé-direito duplo. Sempre visível.
  const base = novoModulo();
  const plinth = addMesh(
    base,
    new THREE.CylinderGeometry(3.36, 3.62, 0.22, 72),
    materials.steelDark,
    [0, 0.13, 0],
    "building-plinth",
  );
  plinth.scale.z = 0.56;
  addMesh(
    base,
    new THREE.BoxGeometry(BODY_WIDTH + 0.04, 1.18, BODY_DEPTH + 0.05),
    materials.lobby,
    [0, 0.88, 0],
    "double-height-lobby",
  );

  // 2. Corpo horizontal envidraçado.
  const corpo = novoModulo();
  addMesh(
    corpo,
    new THREE.BoxGeometry(BODY_WIDTH, WING_TOP - 0.35, BODY_DEPTH),
    materials.glassSide,
    [0, (WING_TOP + 0.35) / 2, 0],
    "main-glass-slab",
  );

  // 3. Fachada frontal e a traseira, que é o mesmo conjunto girado.
  const fachadas = novoModulo();
  const frontFacade = createFrontFacade(fachadas, materials);
  const rearFacade = frontFacade.clone();
  rearFacade.name = "rear-facade-identical-to-front";
  rearFacade.rotation.y = Math.PI;
  fachadas.add(rearFacade);

  // 4. Laterais em vidro azul com esquadrias.
  createSideFacades(novoModulo(), materials);

  // 5. Núcleo alto e os degraus que aparecem acima do corpo.
  const nucleo = novoModulo();
  addMesh(
    nucleo,
    new THREE.BoxGeometry(2.08, TOWER_TOP - 0.4, BODY_DEPTH + 0.04),
    materials.glassDark,
    [0, (TOWER_TOP + 0.4) / 2, 0],
    "upper-central-glass-core",
  );
  for (const x of [-1.43, 1.43]) {
    addMesh(
      nucleo,
      new THREE.BoxGeometry(1.1, 1.1, BODY_DEPTH - 0.08),
      materials.glassFront,
      [x, 11.62, 0],
      "upper-glass-shoulder",
    );
  }

  // 6. Terraço, cobertura em T e antena: o acabamento entra por último.
  const cobertura = novoModulo();
  addMesh(
    cobertura,
    new THREE.BoxGeometry(4.72, 0.15, BODY_DEPTH + 0.3),
    materials.steelDark,
    [0, 11.25, 0],
    "upper-setback-slab",
  );
  addMesh(
    cobertura,
    new THREE.BoxGeometry(3.62, 0.18, BODY_DEPTH + 0.48),
    materials.steelBright,
    [0, 13.2, -0.03],
    "t-shaped-roof-canopy",
  );
  addMesh(
    cobertura,
    new THREE.BoxGeometry(2.64, 0.16, 2.05),
    materials.steelDark,
    [0, 13.36, -0.08],
    "dark-roof-cap",
  );
  addMesh(
    cobertura,
    new THREE.CylinderGeometry(0.025, 0.025, 0.62, 12),
    materials.steelBright,
    [0, 13.72, -0.05],
    "roof-antenna",
  );

  return { group, modules };
}

function createCampusModel(materials: MaterialSet): BuildingParts {
  const group = new THREE.Group();
  const modules: THREE.Group[] = [];
  const novoModulo = () => {
    const modulo = new THREE.Group();
    group.add(modulo);
    modules.push(modulo);
    return modulo;
  };

  const base = novoModulo();
  addBox(base, [17.5, 0.32, 11.5], [0, 0.16, 0], materials.roof);

  const blocks: BlockConfig[] = [
    { w: 4.1, h: 5.7, d: 4.5, x: -5.1, y: 3.02, z: 1.9, columns: 9, floors: 8 },
    { w: 4.4, h: 6.8, d: 4.8, x: -0.3, y: 3.58, z: 2.2, columns: 9, floors: 9 },
    {
      w: 4.8,
      h: 6.25,
      d: 4.7,
      x: 5.0,
      y: 3.3,
      z: 1.55,
      columns: 10,
      floors: 8,
    },
    {
      w: 3.8,
      h: 4.8,
      d: 3.7,
      x: -5.45,
      y: 2.58,
      z: -3.1,
      columns: 8,
      floors: 7,
    },
    {
      w: 4.7,
      h: 7.55,
      d: 4.2,
      x: 0.2,
      y: 3.92,
      z: -3.45,
      columns: 10,
      floors: 10,
    },
    {
      w: 3.55,
      h: 5.35,
      d: 3.9,
      x: 5.55,
      y: 2.85,
      z: -3.2,
      columns: 8,
      floors: 7,
    },
  ];

  /* No complexo, cada bloco é um modulo: é literalmente o "numero variavel de
     modulos" que o scroll vai somando. */
  blocks.forEach((block, index) => {
    addArchitecturalBlock(novoModulo(), materials, {
      ...block,
      dark: index === 0 || index === 5,
      fins: true,
    });
  });

  const detalhes = novoModulo();

  addBox(
    detalhes,
    [5.0, 0.38, 4.2],
    [2.45, 1.15, 2.75],
    materials.metalDark,
    [-0.24, 0, 0],
  );
  for (let index = 0; index < 17; index += 1) {
    addBox(
      detalhes,
      [0.08, 0.08, 4.25],
      [0.18 + index * 0.28, 1.12, 2.75],
      materials.metal,
    );
  }

  addBox(detalhes, [4.35, 1.65, 3.6], [2.15, 1.15, -0.35], materials.glassDark);
  addBox(detalhes, [4.75, 0.12, 3.85], [2.15, 2.02, -0.35], materials.roof);

  blocks.forEach((block, index) => {
    const roofUnitHeight = index % 2 === 0 ? 0.58 : 0.82;
    addBox(
      detalhes,
      [block.w * 0.46, roofUnitHeight, block.d * 0.42],
      [block.x, block.y + block.h / 2 + roofUnitHeight / 2 + 0.18, block.z],
      materials.roof,
    );
  });

  const courtyard = new THREE.Mesh(
    new THREE.RingGeometry(1.4, 1.5, 64),
    new THREE.MeshBasicMaterial({
      color: 0x22b9ec,
      transparent: true,
      opacity: 0.42,
      side: THREE.DoubleSide,
    }),
  );
  courtyard.rotation.x = -Math.PI / 2;
  courtyard.position.set(-2.7, 0.36, -0.25);
  detalhes.add(courtyard);

  return { group, modules };
}

function getHeading(camera: THREE.PerspectiveCamera, target: THREE.Vector3) {
  const dx = camera.position.x - target.x;
  const dz = camera.position.z - target.z;
  const degrees = (Math.atan2(dx, dz) * 180) / Math.PI;
  const normalized = (degrees + 360) % 360;

  if (normalized < 45 || normalized >= 315) return "Frente";
  if (normalized < 135) return "Direita";
  if (normalized < 225) return "Traseira";
  return "Esquerda";
}

/* ---------------------------------------------------------------------------
   Marcador de andar

   Marca UM andar da torre — na cena dos escritorios, o 2º, onde fica o
   escritorio de Sao Paulo. Sao as mesmas medidas das esquadrias frontais
   (`createFrontGrid`), e nao valores parecidos: o marcador tem de cair
   exatamente sobre a laje daquele andar.

   Entra na fachada frontal E na traseira, que sao identicas no predio real: a
   camera da volta na secao, e um marcador só de um lado desapareceria por
   metade do percurso. O rotulo é um `Sprite`, que encara a camera sozinho — e
   com teste de profundidade ligado, para o rotulo do lado de tras ficar
   escondido pelo predio em vez de flutuar sobre ele.
--------------------------------------------------------------------------- */

const PISO_BASE = 1.45;
const PISO_ALTURA = 0.335;

type MarcadorApi = { setIntensidade: (valor: number) => void };

/** Rotulo em textura de canvas: texto no espaco 3D sem carregar fonte nenhuma. */
function criarRotulo(texto: string) {
  const canvas = document.createElement("canvas");
  const contexto = canvas.getContext("2d");
  if (!contexto) return null;

  /* Densidade fixa de 2: é textura, nao layout — nao acompanha o zoom da
     pagina, e 2 basta para o texto nao serrar. */
  const densidade = 2;
  const corpo = 30 * densidade;
  const fonte = `700 ${corpo}px system-ui, sans-serif`;
  contexto.font = fonte;
  canvas.width = Math.ceil(contexto.measureText(texto).width + 44 * densidade);
  canvas.height = Math.ceil(corpo * 2.1);

  // Redimensionar zera o contexto: a fonte precisa ser declarada de novo.
  contexto.font = fonte;
  contexto.textBaseline = "middle";
  contexto.fillStyle = "rgba(3, 12, 24, 0.82)";
  const raio = canvas.height / 2;
  contexto.beginPath();
  if (typeof contexto.roundRect === "function") {
    contexto.roundRect(1, 1, canvas.width - 2, canvas.height - 2, raio);
  } else {
    contexto.rect(1, 1, canvas.width - 2, canvas.height - 2);
  }
  contexto.fill();
  contexto.strokeStyle = "rgba(120, 214, 255, 0.75)";
  contexto.lineWidth = 2 * densidade;
  contexto.stroke();
  contexto.fillStyle = "#eaf8ff";
  contexto.fillText(texto, 22 * densidade, canvas.height / 2 + 1);

  const textura = new THREE.CanvasTexture(canvas);
  textura.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.SpriteMaterial({
    map: textura,
    transparent: true,
    opacity: 0,
  });
  const sprite = new THREE.Sprite(material);
  const altura = 0.46;
  sprite.scale.set((altura * canvas.width) / canvas.height, altura, 1);
  return { sprite, material };
}

function criarMarcadorAndar(andar: number, rotulo: string) {
  const group = new THREE.Group();
  group.name = "office-floor-marker";
  group.visible = false;

  /* Centro da faixa: entre a linha de piso do andar e a do andar seguinte. */
  const y = PISO_BASE + andar * PISO_ALTURA + PISO_ALTURA / 2;
  // Alguns milimetros a frente das esquadrias, senao as duas superficies brigam.
  const z = FRONT_Z + 0.078;
  // Ala esquerda da fachada frontal, a mesma de `createFrontFacade`.
  const x = -1.72;

  const faixaMaterial = new THREE.MeshBasicMaterial({
    color: 0x64d9ff,
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const tracoMaterial = new THREE.LineBasicMaterial({
    color: 0xf2fbff,
    transparent: true,
    opacity: 0,
  });
  const faixaGeometria = new THREE.PlaneGeometry(2.02, PISO_ALTURA * 0.86);

  const frente = new THREE.Group();
  const faixa = new THREE.Mesh(faixaGeometria, faixaMaterial);
  faixa.position.set(x, y, z);
  frente.add(faixa);

  const contorno = new THREE.LineSegments(
    new THREE.EdgesGeometry(faixaGeometria),
    tracoMaterial,
  );
  contorno.position.copy(faixa.position);
  frente.add(contorno);

  /* Haste em cotovelo, da borda da faixa até onde o rotulo pousa. */
  const haste = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(x - 1.01, y, z),
      new THREE.Vector3(x - 1.95, y + 0.78, z),
      new THREE.Vector3(x - 3.05, y + 0.78, z),
    ]),
    tracoMaterial,
  );
  frente.add(haste);

  const etiqueta = rotulo ? criarRotulo(rotulo) : null;
  if (etiqueta) {
    etiqueta.sprite.position.set(
      x - 3.05 - etiqueta.sprite.scale.x / 2,
      y + 0.78,
      z,
    );
    frente.add(etiqueta.sprite);
  }

  group.add(frente);
  /* Fachada traseira: `clone()` compartilha os materiais, entao os dois lados
     acendem juntos com uma unica escrita de opacidade. */
  const tras = frente.clone();
  tras.rotation.y = Math.PI;
  group.add(tras);

  const api: MarcadorApi = {
    setIntensidade: (valor) => {
      const t = clamp01(valor);
      group.visible = t > 0.002;
      faixaMaterial.opacity = 0.34 * t;
      tracoMaterial.opacity = 0.9 * t;
      if (etiqueta) etiqueta.material.opacity = t;
    },
  };

  return { group, api };
}

export function BuildingExplorer({
  model,
  apiRef,
  progressRef,
  andarDestacado,
  rotuloDestaque,
  mostrarControles = true,
}: BuildingExplorerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const viewApiRef = useRef<ViewApi | null>(null);
  const [heading, setHeading] = useState("Frente");
  /* Ausencia de WebGL é escrita direto no DOM, e nao em estado: `setState`
     sincrono dentro de efeito é proibido pelo lint deste projeto, e as duas
     versoes da arvore precisam existir desde o SSR de todo jeito. */
  const fallbackRef = useRef<HTMLParagraphElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      fallbackRef.current?.removeAttribute("hidden");
      hudRef.current?.setAttribute("hidden", "");
      return;
    }

    const estreito = window.innerWidth < 900;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.24;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.setAttribute("role", "img");
    renderer.domElement.setAttribute(
      "aria-label",
      "Modelo tridimensional do edifício. Arraste para girar e use a roda para aproximar.",
    );
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x1273bc, model === "tower" ? 0.017 : 0.012);

    /* Enquadramento da torre é o do estudo entregue (fov 34, alvo em 6.55, raio
       22.4): é ele que faz a meia-cápsula central caber inteira no quadro, do
       lobby à antena. */
    const camera = new THREE.PerspectiveCamera(
      model === "tower" ? 34 : 33,
      1,
      0.1,
      120,
    );
    const target = new THREE.Vector3(0, model === "tower" ? 6.55 : 2.9, 0);
    const distance = model === "tower" ? 22.4 : 24;
    const elevation = model === "tower" ? 8.2 : 10.5;
    camera.position.set(distance * 0.62, elevation, distance * 0.78);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.copy(target);
    controls.enableDamping = true;
    controls.dampingFactor = 0.065;
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.zoomSpeed = 0.72;
    controls.rotateSpeed = 0.62;
    controls.minDistance = model === "tower" ? 13 : 14;
    controls.maxDistance = model === "tower" ? 34 : 38;
    controls.minPolarAngle = 0.34;
    controls.maxPolarAngle = Math.PI / 2.03;
    /* Giro automatico é movimento decorativo: com preferencia por menos
       movimento a cena fica parada e o visitante gira quando quiser. */
    controls.autoRotate = !prefersReducedMotion();
    controls.autoRotateSpeed = 0.45;
    /* Sem a moldura de controles o predio é cena de apoio de outra secao: a
       roda do mouse ali tem de continuar rolando a pagina. */
    controls.enabled = mostrarControles;

    /* A torre traz os proprios materiais (os do estudo River Park); o complexo
       segue com a paleta azul da marca. Por isso `makeMaterials()` só é chamado
       quando é ele que entra — materiais criados e nao usados custam GPU. */
    const { group: building, modules } =
      model === "tower"
        ? createTowerModel()
        : createCampusModel(makeMaterials());
    scene.add(building);

    /* O marcador entra no grupo do predio, e nao na cena: assim ele acompanha
       qualquer transformacao que o edificio receba. Só a torre tem andares
       medidos — no complexo modular a nocao de "2º andar" nao existe. */
    const marcador =
      model === "tower" && andarDestacado
        ? criarMarcadorAndar(andarDestacado, rotuloDestaque ?? "")
        : null;
    if (marcador) building.add(marcador.group);

    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(model === "tower" ? 11 : 15, 96),
      new THREE.MeshStandardMaterial({
        color: 0x0d5a94,
        metalness: 0.62,
        roughness: 0.48,
      }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.02;
    ground.receiveShadow = true;
    scene.add(ground);

    const grid = new THREE.GridHelper(
      model === "tower" ? 24 : 34,
      model === "tower" ? 24 : 34,
      0x9fe3fa,
      0x2a9be0,
    );
    grid.position.y = 0.015;
    const gridMaterials = Array.isArray(grid.material)
      ? grid.material
      : [grid.material];
    gridMaterials.forEach((material) => {
      material.transparent = true;
      material.opacity = 0.32;
    });
    scene.add(grid);

    const ring = new THREE.Mesh(
      new THREE.RingGeometry(
        model === "tower" ? 6.7 : 10.4,
        model === "tower" ? 6.74 : 10.44,
        96,
      ),
      new THREE.MeshBasicMaterial({
        color: 0x29c9ef,
        transparent: true,
        opacity: 0.34,
        side: THREE.DoubleSide,
      }),
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.04;
    scene.add(ring);

    scene.add(new THREE.HemisphereLight(0xbfe9ff, 0x1273bc, 2.1));

    const keyLight = new THREE.DirectionalLight(0xdff6ff, 3.8);
    keyLight.position.set(7, 16, 11);
    keyLight.castShadow = true;
    const sombra = estreito ? 1024 : 2048;
    keyLight.shadow.mapSize.set(sombra, sombra);
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 50;
    keyLight.shadow.camera.left = -14;
    keyLight.shadow.camera.right = 14;
    keyLight.shadow.camera.top = 17;
    keyLight.shadow.camera.bottom = -7;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x18a9ee, 3.1);
    rimLight.position.set(-9, 7, -12);
    scene.add(rimLight);

    const cyanLight = new THREE.PointLight(
      0x25d6ff,
      model === "tower" ? 34 : 46,
      36,
      1.55,
    );
    cyanLight.position.set(0, model === "tower" ? 7 : 4, -8);
    scene.add(cyanLight);

    let lastHeading = "Frente";
    const updateHeading = () => {
      const nextHeading = getHeading(camera, controls.target);
      if (nextHeading !== lastHeading) {
        lastHeading = nextHeading;
        setHeading(nextHeading);
      }
    };
    controls.addEventListener("change", updateHeading);

    /* Enquanto o visitante nao toca na cena, o scroll manda na camera. No
       primeiro arraste ou clique de vista o controle passa para ele, e o scroll
       para de disputar o mesmo eixo — senao a cena brigaria com a mao. O botao
       ↻ devolve o comando ao scroll. */
    let usuarioAssumiu = false;
    controls.addEventListener("start", () => {
      controls.autoRotate = false;
      usuarioAssumiu = true;
    });

    const placeCamera = (azimuth: number, startAutoRotate = false) => {
      camera.position.set(
        target.x + Math.sin(azimuth) * distance,
        elevation,
        target.z + Math.cos(azimuth) * distance,
      );
      controls.target.copy(target);
      controls.autoRotate = startAutoRotate && !prefersReducedMotion();
      controls.update();
      updateHeading();
    };

    viewApiRef.current = {
      setView: (view) => {
        const angles = {
          front: 0,
          right: Math.PI / 2,
          back: Math.PI,
          left: -Math.PI / 2,
        };
        usuarioAssumiu = true;
        placeCamera(angles[view]);
      },
      reset: () => {
        usuarioAssumiu = false;
        placeCamera(Math.PI * 0.2, true);
      },
    };

    /* ---- Montagem e orbita dirigidas pelo scroll ---- */

    const azimuteInicial = Math.atan2(
      camera.position.x - target.x,
      camera.position.z - target.z,
    );

    /* Base e corpo ficam sempre postos: com só a base no lugar, o topo da secao
       mostrava um palco praticamente vazio — o predio aparecia depois de rolar,
       e antes disso o cartao de local e a bussola apontavam para o nada. Postos
       os dois, progresso 0 ja tem silhueta de edificio, e a rolagem veste ela
       com fachadas, nucleo e cobertura. */
    const postos = Math.min(2, modules.length);
    const montaveis = modules.slice(postos);

    const montar = (progresso: number) => {
      for (let i = 0; i < postos; i += 1) {
        modules[i].visible = true;
        modules[i].position.y = 0;
      }
      montaveis.forEach((modulo, indice) => {
        const fatia = 1 / montaveis.length;
        const t = clamp01((progresso - indice * fatia) / fatia);
        modulo.visible = t > 0.001;
        modulo.position.y = (1 - encaixar(t)) * ALTURA_ENTRADA;
      });
    };

    const orbitar = (progresso: number) => {
      if (usuarioAssumiu) return;
      const azimute = azimuteInicial + progresso * VOLTA_ORBITA;
      /* Aproximacao discreta no fim da volta: 12% de distancia, o suficiente
         para dar avanco sem cortar o topo do predio. */
      const raio = distance * (1 - progresso * 0.12);
      camera.position.set(
        target.x + Math.sin(azimute) * raio,
        elevation - progresso * 1.6,
        target.z + Math.cos(azimute) * raio,
      );
      controls.target.copy(target);
      controls.update();
      updateHeading();
    };

    const aplicarProgresso = (progresso: number) => {
      const p = clamp01(progresso);
      montar(clamp01(p / FASE_MONTAGEM));
      orbitar(clamp01((p - FASE_MONTAGEM) / (1 - FASE_MONTAGEM)));
    };

    if (apiRef) {
      apiRef.current = {
        setProgress: aplicarProgresso,
        setDestaque: (intensidade) => marcador?.api.setIntensidade(intensidade),
      };
    }

    /* Sem pai dirigindo o scroll — ou com preferencia por menos movimento, ou em
       tela estreita, casos em que o pai nao cria o gatilho — o edificio nasce
       completo. O predio nunca depende de rolagem para existir, e o andar do
       escritorio ja chega marcado: o estado final do marcador é aceso. */
    const dirigidoPeloScroll = Boolean(apiRef) && !prefersReducedMotion();
    if (dirigidoPeloScroll) {
      controls.autoRotate = false;
      aplicarProgresso(progressRef?.current ?? 0);
    } else {
      montar(1);
      marcador?.api.setIntensidade(1);
    }

    const resize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    resize();

    let animationFrame = 0;
    const render = () => {
      animationFrame = requestAnimationFrame(render);
      controls.update();
      renderer.render(scene, camera);
    };

    /* O laco só existe enquanto a cena esta na tela: WebGL rodando fora da
       viewport gasta GPU e bateria sem ninguem ver. */
    const ligar = () => {
      if (animationFrame) return;
      render();
    };
    const desligar = () => {
      if (!animationFrame) return;
      cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    };
    const visibilidade = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) ligar();
        else desligar();
      },
      { rootMargin: "120px" },
    );
    visibilidade.observe(mount);
    // Um quadro imediato para a cena nunca aparecer em branco.
    renderer.render(scene, camera);

    return () => {
      desligar();
      visibilidade.disconnect();
      resizeObserver.disconnect();
      controls.dispose();
      viewApiRef.current = null;
      if (apiRef) apiRef.current = null;
      scene.traverse((object) => {
        /* `Sprite` fica de fora do bloco abaixo porque a geometria dele é
           compartilhada pela biblioteca: descartar a geometria de um sprite
           quebraria qualquer outro. Material e textura sao nossos. */
        if (object instanceof THREE.Sprite) {
          object.material.map?.dispose();
          object.material.dispose();
          return;
        }
        if (
          object instanceof THREE.Mesh ||
          // `LineSegments` é subclasse de `Line`: a haste do marcador entra aqui.
          object instanceof THREE.Line
        ) {
          object.geometry.dispose();
          const objectMaterials = Array.isArray(object.material)
            ? object.material
            : [object.material];
          objectMaterials.forEach((material) => material.dispose());
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
    /* `apiRef`/`progressRef` sao refs estaveis do pai: entram na lista para o
       lint, mas nao reconstroem a cena. Quem reconstroi é a troca de modelo. */
  }, [model, apiRef, progressRef, andarDestacado, rotuloDestaque, mostrarControles]);

  return (
    <div className="three-explorer-shell">
      <div ref={mountRef} className="three-explorer" />

      {/* Sem WebGL nao existe render alternativo neste projeto, entao o lugar da
          cena explica o que falta em vez de ficar vazio. Nasce `hidden`: fora da
          arvore acessivel enquanto a cena funciona. */}
      <p className="three-fallback" hidden ref={fallbackRef}>
        Esta visualização tridimensional precisa de WebGL, que não está
        disponível neste dispositivo.
      </p>

      <div ref={hudRef} hidden={!mostrarControles || undefined}>
        <div className="compass-hud" aria-live="polite">
          <span className="compass-ring" aria-hidden="true">
            <i />
          </span>
          <span>
            <small>Vista atual</small>
            <strong>{heading}</strong>
          </span>
        </div>

        <div className="camera-presets" aria-label="Vistas rápidas do edifício">
          <button
            type="button"
            onClick={() => viewApiRef.current?.setView("front")}
          >
            Frente
          </button>
          <button
            type="button"
            onClick={() => viewApiRef.current?.setView("back")}
          >
            Traseira
          </button>
          <button
            type="button"
            onClick={() => viewApiRef.current?.setView("left")}
            aria-label="Ver lado esquerdo"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => viewApiRef.current?.setView("right")}
            aria-label="Ver lado direito"
          >
            →
          </button>
          <button
            type="button"
            className="reset-view"
            onClick={() => viewApiRef.current?.reset()}
            aria-label="Reiniciar visualização"
          >
            ↻
          </button>
        </div>

        <p className="gesture-hint">
          <span aria-hidden="true" className="gesture-icon">
            ↔
          </span>
          Arraste para girar · scroll ou pinça para zoom
        </p>
      </div>
    </div>
  );
}

export default BuildingExplorer;
