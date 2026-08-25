"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const BODY_WIDTH = 5.55;
const BODY_DEPTH = 2.72;
const FRONT_Z = BODY_DEPTH / 2;
const WING_TOP = 11.25;
const TOWER_TOP = 13.15;

type ViewName = "front" | "side" | "back" | "free";

function addMesh(
  parent: THREE.Object3D,
  geometry: THREE.BufferGeometry,
  material: THREE.Material | THREE.Material[],
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

function createMaterials() {
  return {
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
    ground: new THREE.MeshStandardMaterial({
      color: 0x111a21,
      metalness: 0.18,
      roughness: 0.74,
    }),
  };
}

type Materials = ReturnType<typeof createMaterials>;

function createMainMassing(root: THREE.Group, materials: Materials) {
  // Corpo horizontal envidraçado observado nas vistas frontal e lateral.
  addMesh(
    root,
    new THREE.BoxGeometry(BODY_WIDTH, WING_TOP - 0.35, BODY_DEPTH),
    materials.glassSide,
    [0, (WING_TOP + 0.35) / 2, 0],
    "main-glass-slab",
  );

  // Núcleo alto que permanece visível nas vistas lateral e traseira.
  addMesh(
    root,
    new THREE.BoxGeometry(2.08, TOWER_TOP - 0.4, BODY_DEPTH + 0.04),
    materials.glassDark,
    [0, (TOWER_TOP + 0.4) / 2, 0],
    "upper-central-glass-core",
  );

  // Degraus superiores atrás do volume arredondado.
  for (const x of [-1.43, 1.43]) {
    addMesh(
      root,
      new THREE.BoxGeometry(1.1, 1.1, BODY_DEPTH - 0.08),
      materials.glassFront,
      [x, 11.62, 0],
      "upper-glass-shoulder",
    );
  }

  // Lobby frontal e traseiro com pé-direito visualmente mais alto.
  addMesh(
    root,
    new THREE.BoxGeometry(BODY_WIDTH + 0.04, 1.18, BODY_DEPTH + 0.05),
    materials.lobby,
    [0, 0.88, 0],
    "double-height-lobby",
  );
}

function createFrontGrid(root: THREE.Group, materials: Materials) {
  const frontSurface = FRONT_Z + 0.068;
  for (let floor = 1; floor <= 28; floor += 1) {
    const y = 1.45 + floor * 0.335;
    if (y > 10.95) break;
    for (const x of [-1.72, 1.72]) {
      const band = addMesh(
        root,
        new THREE.BoxGeometry(2.0, 0.016, 0.024),
        materials.frontMullion,
        [x, y, frontSurface],
        "subtle-front-floor-line",
      );
      band.castShadow = false;
    }
  }

  for (const x of [-2.42, -2.06, -1.7, -1.34, 1.34, 1.7, 2.06, 2.42]) {
    const mullion = addMesh(
      root,
      new THREE.BoxGeometry(0.018, 9.62, 0.024),
      materials.frontMullion,
      [x, 6.12, frontSurface + 0.004],
      "subtle-front-vertical-mullion",
    );
    mullion.castShadow = false;
  }
}

function createFrontFacade(root: THREE.Group, materials: Materials) {
  const facade = new THREE.Group();
  facade.name = "front-facade-assembly";
  root.add(facade);

  // Estes painéis pertencem ao conjunto da fachada para que a cópia traseira
  // seja geometricamente idêntica, incluindo cores, proporções e acabamentos.
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

  // Meia-cápsula real: somente a metade frontal é visível, como nas fotografias.
  const shaft = addMesh(
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
  shaft.castShadow = true;

  // Coroamento arredondado da cápsula.
  const crown = addMesh(
    facade,
    new THREE.SphereGeometry(radius, 48, 20, 0, Math.PI * 2, 0, Math.PI / 2),
    materials.steelBright,
    [0, cylinderTop, capsuleZ],
    "front-rounded-capsule-crown",
  );
  crown.scale.z = 0.72;

  // Friso de vidro azul no eixo da peça metálica.
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

  // Retornos metálicos unem o volume avançado ao plano da fachada. Eles
  // preservam a sombra profunda da referência sem deixar a cápsula flutuando.
  for (const x of [-radius, radius]) {
    addMesh(
      facade,
      new THREE.BoxGeometry(0.035, cylinderHeight, capsuleProjection + 0.035),
      materials.steelDark,
      [x, cylinderBase + cylinderHeight / 2, FRONT_Z + capsuleProjection / 2],
      "capsule-side-return",
    );
  }

  // Trilhos altos que enquadram o corpo arredondado.
  for (const x of [-0.86, 0.86]) {
    addMesh(
      facade,
      new THREE.BoxGeometry(0.095, 12.5, 0.095),
      materials.steelBright,
      [x, 6.73, FRONT_Z + 0.12],
      "front-inner-silver-rail",
    );
  }

  // Tubos externos finos e totalmente retos, conforme o detalhe indicado.
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

  // Entradas também fazem parte do conjunto espelhado.
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
}

function createSideFacades(root: THREE.Group, materials: Materials) {
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
      const band = addMesh(
        root,
        new THREE.BoxGeometry(0.025, 0.016, BODY_DEPTH - 0.08),
        materials.frontMullion,
        [x + side * 0.031, y, 0],
        "side-floor-line",
      );
      band.castShadow = false;
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

function createRoofAndBase(root: THREE.Group, materials: Materials) {
  // Terraço intermediário e cobertura em balanço formam o perfil visto de lado.
  addMesh(
    root,
    new THREE.BoxGeometry(4.72, 0.15, BODY_DEPTH + 0.3),
    materials.steelDark,
    [0, 11.25, 0],
    "upper-setback-slab",
  );
  addMesh(
    root,
    new THREE.BoxGeometry(3.62, 0.18, BODY_DEPTH + 0.48),
    materials.steelBright,
    [0, 13.2, -0.03],
    "t-shaped-roof-canopy",
  );
  addMesh(
    root,
    new THREE.BoxGeometry(2.64, 0.16, 2.05),
    materials.steelDark,
    [0, 13.36, -0.08],
    "dark-roof-cap",
  );
  addMesh(
    root,
    new THREE.CylinderGeometry(0.025, 0.025, 0.62, 12),
    materials.steelBright,
    [0, 13.72, -0.05],
    "roof-antenna",
  );

  const plinth = addMesh(
    root,
    new THREE.CylinderGeometry(3.36, 3.62, 0.22, 72),
    materials.steelDark,
    [0, 0.13, 0],
    "building-plinth",
  );
  plinth.scale.z = 0.56;

}

function createBuilding() {
  const root = new THREE.Group();
  root.name = "river-park-faithful-geometry";
  const materials = createMaterials();
  createMainMassing(root, materials);
  createFrontFacade(root, materials);
  const frontFacade = root.getObjectByName("front-facade-assembly");
  if (frontFacade) {
    const rearFacade = frontFacade.clone();
    rearFacade.name = "rear-facade-identical-to-front";
    rearFacade.rotation.y = Math.PI;
    root.add(rearFacade);
  }
  createSideFacades(root, materials);
  createRoofAndBase(root, materials);
  return { root, materials };
}

export default function BuildingViewer() {
  const hostRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const [ready, setReady] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [interacting, setInteracting] = useState(false);
  const [activeView, setActiveView] = useState<ViewName>("free");

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x06101f, 0.014);

    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 6.75, 22.4);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    host.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 6.55, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.055;
    controls.enablePan = false;
    controls.minDistance = 13.5;
    controls.maxDistance = 30;
    controls.minPolarAngle = 0.46;
    controls.maxPolarAngle = 1.96;
    controls.rotateSpeed = 0.62;
    controls.zoomSpeed = 0.72;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    controls.update();
    controls.saveState();
    controlsRef.current = controls;

    const onStart = () => {
      setInteracting(true);
      setActiveView("free");
    };
    const onEnd = () => setInteracting(false);
    controls.addEventListener("start", onStart);
    controls.addEventListener("end", onEnd);

    scene.add(new THREE.HemisphereLight(0xd1edff, 0x0b1620, 2.45));

    const keyLight = new THREE.DirectionalLight(0xffffff, 5.9);
    keyLight.position.set(8, 16, 11);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    keyLight.shadow.camera.left = -9;
    keyLight.shadow.camera.right = 9;
    keyLight.shadow.camera.top = 17;
    keyLight.shadow.camera.bottom = -3;
    scene.add(keyLight);

    const coolFill = new THREE.DirectionalLight(0x66c9f2, 4.4);
    coolFill.position.set(-9, 9, -10);
    scene.add(coolFill);

    const frontFill = new THREE.PointLight(0xe3f5ff, 24, 30, 2);
    frontFill.position.set(-5, 6, 10);
    scene.add(frontFill);

    const { root, materials } = createBuilding();
    scene.add(root);

    const ground = addMesh(
      scene,
      new THREE.CircleGeometry(10, 96),
      materials.ground,
      [0, -0.01, 0],
      "shadow-ground",
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    ground.castShadow = false;

    const glow = new THREE.Mesh(
      new THREE.RingGeometry(3.45, 7.2, 96),
      new THREE.MeshBasicMaterial({
        color: 0x2b86ae,
        transparent: true,
        opacity: 0.085,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    );
    glow.rotation.x = -Math.PI / 2;
    glow.position.y = 0.014;
    scene.add(glow);

    const resize = () => {
      const { width, height } = host.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    resize();

    let frame = 0;
    const render = () => {
      frame = window.requestAnimationFrame(render);
      controls.update();
      renderer.render(scene, camera);
    };
    render();
    setReady(true);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      controls.removeEventListener("start", onStart);
      controls.removeEventListener("end", onEnd);
      controls.dispose();
      controlsRef.current = null;
      cameraRef.current = null;
      scene.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;
        object.geometry.dispose();
        const objectMaterials = Array.isArray(object.material)
          ? object.material
          : [object.material];
        objectMaterials.forEach((material) => material.dispose());
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  useEffect(() => {
    if (controlsRef.current) controlsRef.current.autoRotate = autoRotate;
  }, [autoRotate]);

  const toggleAutoRotate = () => {
    const nextValue = !autoRotate;
    setAutoRotate(nextValue);
    if (nextValue) setActiveView("free");
  };

  const showView = (view: Exclude<ViewName, "free">) => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;
    const positions: Record<Exclude<ViewName, "free">, [number, number, number]> = {
      front: [0, 6.75, 22.4],
      side: [20.5, 6.85, 0],
      back: [0, 6.75, -22.4],
    };
    camera.position.set(...positions[view]);
    controls.target.set(0, 6.55, 0);
    controls.update();
    setAutoRotate(false);
    setActiveView(view);
  };

  const resetView = () => {
    controlsRef.current?.reset();
    setAutoRotate(true);
    setActiveView("free");
  };

  return (
    <section className="viewer-shell" aria-label="Modelo geométrico 3D do edifício River Park">
      <div ref={hostRef} className="viewer-canvas" />

      <div className={`loading-state ${ready ? "is-ready" : ""}`} aria-hidden={ready}>
        <span className="loading-orbit" />
        <span>Construindo geometria fiel</span>
      </div>

      <header className="viewer-header">
        <div>
          <span className="eyebrow">Sistran · River Park</span>
          <h1>Modelo arquitetônico · 360°</h1>
        </div>
        <span className="model-status">
          <i /> Geometria 3D real
        </span>
      </header>

      <div className="viewer-toolbar" aria-label="Controles do modelo 3D">
        <button
          type="button"
          className={autoRotate ? "is-active" : ""}
          onClick={toggleAutoRotate}
          aria-pressed={autoRotate}
          title={autoRotate ? "Pausar rotação" : "Ativar rotação"}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20 7v5h-5M4 17v-5h5" />
            <path d="M6.1 8.3A7 7 0 0 1 18.7 7M17.9 15.7A7 7 0 0 1 5.3 17" />
          </svg>
          <span>{autoRotate ? "Giro ativo" : "Giro pausado"}</span>
        </button>
        <button type="button" onClick={resetView} title="Centralizar modelo">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
            <path d="M3 3v5h5" />
          </svg>
          <span>Centralizar</span>
        </button>
      </div>

      <nav className="view-switcher" aria-label="Vistas do edifício">
        {(["front", "side", "back"] as const).map((view) => (
          <button
            key={view}
            type="button"
            className={activeView === view ? "is-active" : ""}
            onClick={() => showView(view)}
          >
            {view === "front" ? "Frente" : view === "side" ? "Lado" : "Trás"}
          </button>
        ))}
      </nav>

      <div className={`interaction-hint ${interacting ? "is-hidden" : ""}`}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8 11V7a1.5 1.5 0 0 1 3 0v4-6a1.5 1.5 0 0 1 3 0v6-4a1.5 1.5 0 0 1 3 0v5-2a1.5 1.5 0 0 1 3 0v5c0 3.3-2.7 6-6 6h-1.2a6 6 0 0 1-5-2.7L5 14.2a1.6 1.6 0 0 1 2.5-2l.5.6V11Z" />
        </svg>
        <span>Arraste para girar · role para aproximar</span>
      </div>

      <div className="compass" aria-hidden="true">
        <span>360°</span>
      </div>
    </section>
  );
}
