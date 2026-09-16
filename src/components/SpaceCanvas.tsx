import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { SOLAR_SYSTEM_PLANETS } from './solarSystemData';
import {
  createSunTexture,
  createMercuryTexture,
  createVenusTexture,
  createEarthTexture,
  createEarthCloudTexture,
  createMarsTexture,
  createJupiterTexture,
  createSaturnTexture,
  createSaturnRingTexture,
  createUranusTexture,
  createNeptuneTexture,
  createMoonTexture,
  createPlutoTexture,
  createCharonTexture,
} from './planetTextures';

// Star texture generator for cosmic background
function createStarTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.15, 'rgba(235, 245, 255, 0.9)');
  gradient.addColorStop(0.4, 'rgba(147, 197, 253, 0.35)');
  gradient.addColorStop(0.8, 'rgba(59, 130, 246, 0.08)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// Comet Coma glow texture
function createCometGlowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  grad.addColorStop(0.2, 'rgba(165, 243, 252, 0.95)');
  grad.addColorStop(0.5, 'rgba(34, 211, 238, 0.35)');
  grad.addColorStop(0.85, 'rgba(6, 182, 212, 0.08)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

// 3D Planet Name Label Sprite generator
function createPlanetLabelSprite(name: string, color: string, id: string): THREE.Sprite {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  // Dark glass pill background
  ctx.fillStyle = 'rgba(6, 11, 19, 0.82)';
  ctx.beginPath();
  ctx.roundRect(14, 10, 228, 44, 22);
  ctx.fill();

  // Subtle border glow
  ctx.lineWidth = 2.0;
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
  ctx.stroke();

  // Planet color dot
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.arc(38, 32, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Planet label typography
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 21px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(name, 56, 33);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;

  const mat = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false,
    depthWrite: false,
  });

  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(13, 3.25, 1);
  sprite.userData = { id, type: 'label' };
  return sprite;
}

export interface SpaceCanvasProps {
  showOrbits?: boolean;
  showAsteroids?: boolean;
  showKuiperBelt?: boolean;
  showComet?: boolean;
  showLabels?: boolean;
  reduceSunGlare?: boolean;
  simSpeed?: number;
  rotationSpeed?: number;
  selectedBodyId?: string | null;
  onSelectBody?: (id: string | null) => void;
}

export const SpaceCanvas: React.FC<SpaceCanvasProps> = ({
  showOrbits = true,
  showAsteroids = true,
  showKuiperBelt = true,
  showComet = true,
  showLabels = true,
  reduceSunGlare = false,
  simSpeed = 1,
  rotationSpeed = 2,
  selectedBodyId = null,
  onSelectBody,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const showOrbitsRef = useRef(showOrbits);
  const showAsteroidsRef = useRef(showAsteroids);
  const showKuiperBeltRef = useRef(showKuiperBelt);
  const showCometRef = useRef(showComet);
  const showLabelsRef = useRef(showLabels);
  const reduceSunGlareRef = useRef(reduceSunGlare);
  const simSpeedRef = useRef(simSpeed);
  const rotationSpeedRef = useRef(rotationSpeed);
  const selectedBodyIdRef = useRef(selectedBodyId);
  const onSelectBodyRef = useRef(onSelectBody);

  const orbitsGroupRef = useRef<THREE.Group | null>(null);
  const asteroidMeshRef = useRef<THREE.InstancedMesh | null>(null);
  const kuiperMeshRef = useRef<THREE.InstancedMesh | null>(null);
  const cometGroupRef = useRef<THREE.Group | null>(null);
  const labelsListRef = useRef<THREE.Sprite[]>([]);
  const sunPointLightRef = useRef<THREE.PointLight | null>(null);
  const sunCoreLightRef = useRef<THREE.PointLight | null>(null);
  const sunHaloMatRef = useRef<THREE.MeshBasicMaterial | null>(null);

  useEffect(() => {
    selectedBodyIdRef.current = selectedBodyId;
  }, [selectedBodyId]);

  useEffect(() => {
    onSelectBodyRef.current = onSelectBody;
  }, [onSelectBody]);

  useEffect(() => {
    showOrbitsRef.current = showOrbits;
    if (orbitsGroupRef.current) {
      orbitsGroupRef.current.visible = showOrbits;
    }
  }, [showOrbits]);

  useEffect(() => {
    showAsteroidsRef.current = showAsteroids;
    if (asteroidMeshRef.current) {
      asteroidMeshRef.current.visible = showAsteroids;
    }
  }, [showAsteroids]);

  useEffect(() => {
    showKuiperBeltRef.current = showKuiperBelt;
    if (kuiperMeshRef.current) {
      kuiperMeshRef.current.visible = showKuiperBelt;
    }
  }, [showKuiperBelt]);

  useEffect(() => {
    showCometRef.current = showComet;
    if (cometGroupRef.current) {
      cometGroupRef.current.visible = showComet;
    }
  }, [showComet]);

  useEffect(() => {
    showLabelsRef.current = showLabels;
    labelsListRef.current.forEach((s) => {
      s.visible = showLabels;
    });
  }, [showLabels]);

  useEffect(() => {
    reduceSunGlareRef.current = reduceSunGlare;
    if (sunPointLightRef.current) {
      sunPointLightRef.current.intensity = reduceSunGlare ? 2.8 : 7.8;
    }
    if (sunCoreLightRef.current) {
      sunCoreLightRef.current.intensity = reduceSunGlare ? 1.5 : 4.2;
    }
    if (sunHaloMatRef.current) {
      sunHaloMatRef.current.opacity = reduceSunGlare ? 0.05 : 0.15;
    }
  }, [reduceSunGlare]);

  useEffect(() => {
    simSpeedRef.current = simSpeed;
  }, [simSpeed]);

  useEffect(() => {
    rotationSpeedRef.current = rotationSpeed;
  }, [rotationSpeed]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene & Dark Cosmic Canvas
    const scene = new THREE.Scene();

    // Camera setup - elevated diagonal angle giving full view of the Solar System including Pluto
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 18000);
    camera.position.set(0, 160, 310);

    // WebGL Renderer with High-Contrast ACES Filmic Tone Mapping
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000103, 1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    container.appendChild(renderer.domElement);

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.65;
    controls.zoomSpeed = 1.1;
    controls.panSpeed = 0.65;
    controls.minDistance = 20;
    controls.maxDistance = 4000;
    controls.target.set(0, 0, 0);

    // Ambient space light: subtle fill to maintain deep space contrast on unlit planetary hemispheres
    const ambientLight = new THREE.AmbientLight(0x0a1224, 0.16);
    scene.add(ambientLight);

    // Primary Solar Point Light: intensely bright direct sunlight reaching out past Pluto
    const sunPointLight = new THREE.PointLight(0xfffbf2, reduceSunGlareRef.current ? 2.8 : 7.8, 3800, 0.2);
    sunPointLight.position.set(0, 0, 0);
    scene.add(sunPointLight);
    sunPointLightRef.current = sunPointLight;

    // Secondary core radiant point light for dazzling inner solar illumination
    const sunCoreLight = new THREE.PointLight(0xffe2b8, reduceSunGlareRef.current ? 1.5 : 4.2, 950, 0.35);
    sunCoreLight.position.set(0, 0, 0);
    scene.add(sunCoreLight);
    sunCoreLightRef.current = sunCoreLight;

    // Generate Planetary Textures
    const starTex = createStarTexture();
    const sunTex = createSunTexture();
    const mercuryTex = createMercuryTexture();
    const venusTex = createVenusTexture();
    const earthTex = createEarthTexture();
    const earthCloudTex = createEarthCloudTexture();
    const marsTex = createMarsTexture();
    const jupiterTex = createJupiterTexture();
    const saturnTex = createSaturnTexture();
    const saturnRingTex = createSaturnRingTexture();
    const uranusTex = createUranusTexture();
    const neptuneTex = createNeptuneTexture();
    const plutoTex = createPlutoTexture();
    const charonTex = createCharonTexture();
    const moonTex = createMoonTexture();

    // ==========================================
    // 1. The Central Sun
    // ==========================================
    const sunRadius = 12.0;
    const sunGroup = new THREE.Group();
    scene.add(sunGroup);

    // Sun Photosphere Mesh
    const sunGeometry = new THREE.SphereGeometry(sunRadius, 64, 64);
    const sunMaterial = new THREE.MeshBasicMaterial({
      map: sunTex,
      color: 0xffffff,
    });
    const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
    sunGroup.add(sunMesh);

    // Outer Solar Atmosphere Shell
    const sunHaloGeom = new THREE.SphereGeometry(sunRadius * 1.02, 32, 32);
    const sunHaloMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: reduceSunGlareRef.current ? 0.05 : 0.15,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
    });
    const sunHaloMesh = new THREE.Mesh(sunHaloGeom, sunHaloMat);
    sunGroup.add(sunHaloMesh);
    sunHaloMatRef.current = sunHaloMat;

    // Sun Name Label Sprite
    const sunLabel = createPlanetLabelSprite('Sun', '#f59e0b', 'sun');
    sunLabel.position.set(0, sunRadius + 3.8, 0);
    sunGroup.add(sunLabel);

    const clickableObjects: THREE.Object3D[] = [sunMesh, sunLabel];
    const allLabelSprites: THREE.Sprite[] = [sunLabel];

    // ==========================================
    // 2. Solar System Planets & Orbital Systems
    // ==========================================
    interface PlanetInstance {
      id: string;
      radius: number;
      group: THREE.Group;
      mesh: THREE.Mesh;
      cloudMesh?: THREE.Mesh;
      orbitDistance: number;
      orbitSpeed: number;
      rotationSpeed: number;
      angle: number;
      moons: {
        mesh: THREE.Mesh;
        distance: number;
        speed: number;
        angle: number;
      }[];
    }

    const planetInstances: PlanetInstance[] = [];

    // Helper map of textures per planet
    const textureMap: Record<string, THREE.CanvasTexture> = {
      mercury: mercuryTex,
      venus: venusTex,
      earth: earthTex,
      mars: marsTex,
      jupiter: jupiterTex,
      saturn: saturnTex,
      uranus: uranusTex,
      neptune: neptuneTex,
      pluto: plutoTex,
    };

    const orbitsGroup = new THREE.Group();
    orbitsGroup.visible = showOrbitsRef.current;
    orbitsGroupRef.current = orbitsGroup;
    scene.add(orbitsGroup);

    SOLAR_SYSTEM_PLANETS.forEach((planetData, idx) => {
      // A. Orbital Guide Path (Circular Ellipse)
      const orbitCurve = new THREE.EllipseCurve(
        0,
        0,
        planetData.distance,
        planetData.distance,
        0,
        2 * Math.PI,
        false,
        0,
      );
      const orbitPoints = orbitCurve.getPoints(128);
      const orbitGeom = new THREE.BufferGeometry().setFromPoints(
        orbitPoints.map((p) => new THREE.Vector3(p.x, 0, p.y)),
      );
      const orbitMat = new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.12,
      });
      const orbitLine = new THREE.Line(orbitGeom, orbitMat);
      orbitsGroup.add(orbitLine);

      // B. Planet Container Group
      const planetGroup = new THREE.Group();
      // Apply Axial Tilt
      planetGroup.rotation.z = (planetData.axialTilt * Math.PI) / 180;
      scene.add(planetGroup);

      // C. Planet Mesh
      const pGeom = new THREE.SphereGeometry(planetData.radius, 48, 48);
      const pMat = new THREE.MeshStandardMaterial({
        map: textureMap[planetData.id],
        roughness: planetData.id === 'earth' ? 0.35 : planetData.id === 'pluto' ? 0.82 : 0.72,
        metalness: 0.08,
      });
      const pMesh = new THREE.Mesh(pGeom, pMat);
      pMesh.userData = { id: planetData.id, type: 'planet' };
      planetGroup.add(pMesh);

      // Planet Name Label Sprite
      const pLabel = createPlanetLabelSprite(planetData.name, planetData.color, planetData.id);
      pLabel.position.set(0, planetData.radius + 3.0, 0);
      planetGroup.add(pLabel);
      allLabelSprites.push(pLabel);

      clickableObjects.push(pMesh, pLabel);

      // D. Special Features: Earth Clouds
      let cloudMesh: THREE.Mesh | undefined;
      if (planetData.hasClouds) {
        const cGeom = new THREE.SphereGeometry(planetData.radius * 1.018, 48, 48);
        const cMat = new THREE.MeshStandardMaterial({
          map: earthCloudTex,
          transparent: true,
          opacity: 0.8,
          blending: THREE.NormalBlending,
          depthWrite: false,
        });
        cloudMesh = new THREE.Mesh(cGeom, cMat);
        planetGroup.add(cloudMesh);
      }

      // E. Special Features: Planetary Rings (Saturn / Uranus)
      if (planetData.hasRings && planetData.ringInner && planetData.ringOuter) {
        const ringGeom = new THREE.RingGeometry(
          planetData.ringInner,
          planetData.ringOuter,
          96,
        );
        const pos = ringGeom.attributes.position;
        const uv = ringGeom.attributes.uv;
        for (let i = 0; i < pos.count; i++) {
          const x = pos.getX(i);
          const y = pos.getY(i);
          const d = Math.sqrt(x * x + y * y);
          const u = (d - planetData.ringInner) / (planetData.ringOuter - planetData.ringInner);
          uv.setXY(i, u, 0.5);
        }
        uv.needsUpdate = true;

        const ringMat = new THREE.MeshStandardMaterial({
          map: planetData.id === 'saturn' ? saturnRingTex : undefined,
          color: planetData.id === 'uranus' ? 0xb0e0e6 : 0xffffff,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: planetData.id === 'saturn' ? 0.95 : 0.4,
          roughness: 0.6,
        });
        const ringMesh = new THREE.Mesh(ringGeom, ringMat);
        ringMesh.rotation.x = Math.PI / 2;
        planetGroup.add(ringMesh);
      }

      // F. Moons System
      const moonInstances: PlanetInstance['moons'] = [];
      if (planetData.moons) {
        planetData.moons.forEach((m, mIdx) => {
          const mGeom = new THREE.SphereGeometry(m.radius, 24, 24);
          const mMat = new THREE.MeshStandardMaterial({
            map: m.name === 'Charon' ? charonTex : moonTex,
            color: new THREE.Color(m.color),
            roughness: 0.85,
          });
          const mMesh = new THREE.Mesh(mGeom, mMat);
          planetGroup.add(mMesh);

          moonInstances.push({
            mesh: mMesh,
            distance: m.distance,
            speed: m.speed,
            angle: (mIdx * Math.PI) / 2,
          });
        });
      }

      // Spread initial orbital positions
      const initialAngle = (idx / SOLAR_SYSTEM_PLANETS.length) * Math.PI * 2 + idx * 0.4;
      planetGroup.position.set(
        Math.cos(initialAngle) * planetData.distance,
        0,
        Math.sin(initialAngle) * planetData.distance,
      );

      planetInstances.push({
        id: planetData.id,
        radius: planetData.radius,
        group: planetGroup,
        mesh: pMesh,
        cloudMesh,
        orbitDistance: planetData.distance,
        orbitSpeed: planetData.speed * 0.08,
        rotationSpeed: planetData.rotationSpeed,
        angle: initialAngle,
        moons: moonInstances,
      });
    });

    // ==========================================
    // 2.5 Realistic Asteroid Belt (Between Mars & Jupiter)
    // ==========================================
    const asteroidBeltInner = 92;
    const asteroidBeltOuter = 108;
    const asteroidCount = 3500;

    const baseRockGeom = new THREE.DodecahedronGeometry(1, 1);
    const posAttr = baseRockGeom.attributes.position;
    const seedNoise = (x: number, y: number, z: number) => {
      return Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453;
    };
    for (let i = 0; i < posAttr.count; i++) {
      const vx = posAttr.getX(i);
      const vy = posAttr.getY(i);
      const vz = posAttr.getZ(i);
      const noiseVal = ((seedNoise(vx, vy, vz) % 1) - 0.5) * 0.45;
      posAttr.setXYZ(i, vx * (1 + noiseVal), vy * (1 + noiseVal), vz * (1 + noiseVal));
    }
    baseRockGeom.computeVertexNormals();

    const rockMat = new THREE.MeshStandardMaterial({
      color: 0x8c827a,
      roughness: 0.92,
      metalness: 0.15,
      flatShading: true,
    });

    const asteroidMesh = new THREE.InstancedMesh(baseRockGeom, rockMat, asteroidCount);
    asteroidMesh.visible = showAsteroidsRef.current;
    asteroidMeshRef.current = asteroidMesh;
    scene.add(asteroidMesh);

    const asteroidData: {
      orbitRadius: number;
      angle: number;
      orbitSpeed: number;
      inclination: number;
      verticalOffset: number;
      scale: THREE.Vector3;
      rotSpeed: THREE.Vector3;
      currentRot: THREE.Euler;
    }[] = [];

    const dummy = new THREE.Object3D();
    const rockColor = new THREE.Color();

    for (let i = 0; i < asteroidCount; i++) {
      const rDist = Math.random() * 0.5 + Math.random() * 0.5;
      const orbitRadius = asteroidBeltInner + rDist * (asteroidBeltOuter - asteroidBeltInner);
      const angle = Math.random() * Math.PI * 2;
      
      const orbitSpeed = (0.58 / Math.sqrt(orbitRadius / 80)) * 0.08 * (0.95 + Math.random() * 0.1);
      
      const verticalSpread = (Math.random() - 0.5) * (1.8 + Math.random() * 2.2);
      const inclination = (Math.random() - 0.5) * 0.08;

      const sizeCategory = Math.random();
      let baseScale = 0.15 + Math.random() * 0.25;
      if (sizeCategory > 0.985) {
        baseScale = 0.65 + Math.random() * 0.45;
      } else if (sizeCategory > 0.92) {
        baseScale = 0.35 + Math.random() * 0.25;
      }

      const scaleX = baseScale * (0.7 + Math.random() * 0.6);
      const scaleY = baseScale * (0.7 + Math.random() * 0.6);
      const scaleZ = baseScale * (0.7 + Math.random() * 0.6);

      const rotSpeed = new THREE.Vector3(
        (Math.random() - 0.5) * 0.04,
        (Math.random() - 0.5) * 0.04,
        (Math.random() - 0.5) * 0.04
      );
      const currentRot = new THREE.Euler(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );

      const tone = 0.45 + Math.random() * 0.45;
      rockColor.setRGB(tone * 0.9, tone * 0.85, tone * 0.8);
      asteroidMesh.setColorAt(i, rockColor);

      asteroidData.push({
        orbitRadius,
        angle,
        orbitSpeed,
        inclination,
        verticalOffset: verticalSpread,
        scale: new THREE.Vector3(scaleX, scaleY, scaleZ),
        rotSpeed,
        currentRot,
      });
    }
    if (asteroidMesh.instanceColor) {
      asteroidMesh.instanceColor.needsUpdate = true;
    }

    // ==========================================
    // 2.7 Kuiper Belt (Outer Trans-Neptunian Icy Belt)
    // ==========================================
    const kuiperBeltInner = 285;
    const kuiperBeltOuter = 360;
    const kuiperCount = 2000;
    const kuiperRockGeom = new THREE.DodecahedronGeometry(1, 1);
    const kuiperMat = new THREE.MeshStandardMaterial({
      roughness: 0.88,
      metalness: 0.05,
    });
    const kuiperMesh = new THREE.InstancedMesh(kuiperRockGeom, kuiperMat, kuiperCount);
    kuiperMesh.visible = showKuiperBeltRef.current;
    kuiperMeshRef.current = kuiperMesh;
    scene.add(kuiperMesh);

    const kuiperData: {
      orbitRadius: number;
      angle: number;
      orbitSpeed: number;
      inclination: number;
      verticalOffset: number;
      scale: THREE.Vector3;
      rotSpeed: THREE.Vector3;
      currentRot: THREE.Euler;
    }[] = [];

    const iceColor = new THREE.Color();
    for (let i = 0; i < kuiperCount; i++) {
      const rNorm = Math.pow(Math.random(), 0.9);
      const orbitRadius = kuiperBeltInner + rNorm * (kuiperBeltOuter - kuiperBeltInner);
      const angle = Math.random() * Math.PI * 2;
      const orbitSpeed = (0.012 / Math.sqrt(orbitRadius / 100)) * (0.85 + Math.random() * 0.3);
      const verticalSpread = (Math.random() - 0.5) * 12;
      const inclination = (Math.random() - 0.5) * 0.12;

      const baseScale = 0.22 + Math.random() * 0.35;
      const scale = new THREE.Vector3(
        baseScale * (0.8 + Math.random() * 0.4),
        baseScale * (0.8 + Math.random() * 0.4),
        baseScale * (0.8 + Math.random() * 0.4)
      );

      const rotSpeed = new THREE.Vector3(
        (Math.random() - 0.5) * 0.03,
        (Math.random() - 0.5) * 0.03,
        (Math.random() - 0.5) * 0.03
      );
      const currentRot = new THREE.Euler(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );

      const tone = 0.6 + Math.random() * 0.35;
      iceColor.setRGB(tone * 0.8, tone * 0.9, tone);
      kuiperMesh.setColorAt(i, iceColor);

      kuiperData.push({
        orbitRadius,
        angle,
        orbitSpeed,
        inclination,
        verticalOffset: verticalSpread,
        scale,
        rotSpeed,
        currentRot,
      });
    }
    if (kuiperMesh.instanceColor) {
      kuiperMesh.instanceColor.needsUpdate = true;
    }

    // ==========================================
    // 2.8 Halley's Comet (1P/Halley)
    // ==========================================
    const cometGroup = new THREE.Group();
    cometGroup.visible = showCometRef.current;
    cometGroupRef.current = cometGroup;
    scene.add(cometGroup);

    const cometA = 160;
    const cometB = 58;
    const cometInclination = (18 * Math.PI) / 180;
    const cometOrbitPoints: THREE.Vector3[] = [];
    for (let i = 0; i <= 128; i++) {
      const theta = (i / 128) * Math.PI * 2;
      const x = cometA * Math.cos(theta) - 75;
      const z = cometB * Math.sin(theta);
      const y = z * Math.sin(cometInclination);
      cometOrbitPoints.push(new THREE.Vector3(x, y, z * Math.cos(cometInclination)));
    }
    const cometOrbitGeom = new THREE.BufferGeometry().setFromPoints(cometOrbitPoints);
    const cometOrbitMat = new THREE.LineBasicMaterial({
      color: 0x67e8f9,
      transparent: true,
      opacity: 0.18,
    });
    const cometOrbitLine = new THREE.Line(cometOrbitGeom, cometOrbitMat);
    orbitsGroup.add(cometOrbitLine);

    const cometHeadGroup = new THREE.Group();
    cometGroup.add(cometHeadGroup);

    const cometGlowTex = createCometGlowTexture();
    const cometNucleusGeom = new THREE.SphereGeometry(0.7, 16, 16);
    const cometNucleusMat = new THREE.MeshStandardMaterial({
      color: 0xdff9ff,
      roughness: 0.85,
    });
    const cometNucleusMesh = new THREE.Mesh(cometNucleusGeom, cometNucleusMat);
    cometNucleusMesh.userData = { id: 'comet', type: 'comet' };
    cometHeadGroup.add(cometNucleusMesh);

    const cometComaMat = new THREE.SpriteMaterial({
      map: cometGlowTex,
      color: 0xa5f3fc,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const cometComaSprite = new THREE.Sprite(cometComaMat);
    cometComaSprite.scale.set(7.5, 7.5, 1);
    cometHeadGroup.add(cometComaSprite);

    const cometTailGeom = new THREE.ConeGeometry(2.4, 38, 24, 1, true);
    cometTailGeom.rotateX(-Math.PI / 2);
    cometTailGeom.translate(0, 0, 19);
    const cometTailMat = new THREE.MeshBasicMaterial({
      color: 0x67e8f9,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const cometTailMesh = new THREE.Mesh(cometTailGeom, cometTailMat);
    cometHeadGroup.add(cometTailMesh);

    const cometLabel = createPlanetLabelSprite('1P/Halley', '#67e8f9', 'comet');
    cometLabel.position.set(0, 3.2, 0);
    cometHeadGroup.add(cometLabel);
    allLabelSprites.push(cometLabel);

    clickableObjects.push(cometNucleusMesh, cometLabel);

    let cometAngle = 0.8;

    // Synchronize labels array
    labelsListRef.current = allLabelSprites;
    allLabelSprites.forEach((lbl) => {
      lbl.visible = showLabelsRef.current;
    });

    // ==========================================
    // 3. Deep Background Cosmos Starfield (10,000 stars)
    // ==========================================
    const distantCount = 10000;
    const distantGeom = new THREE.BufferGeometry();
    const distantPos = new Float32Array(distantCount * 3);
    const distantColors = new Float32Array(distantCount * 3);

    const stellarPalette = [
      new THREE.Color(0x9db4ff),
      new THREE.Color(0xbbccff),
      new THREE.Color(0xf8f9fa),
      new THREE.Color(0xfff4e8),
      new THREE.Color(0xffddb4),
    ];

    for (let i = 0; i < distantCount; i++) {
      const radius = 2500 + Math.random() * 4500;
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const sinPhi = Math.sin(phi);

      distantPos[i * 3] = radius * sinPhi * Math.cos(theta);
      distantPos[i * 3 + 1] = radius * sinPhi * Math.sin(theta);
      distantPos[i * 3 + 2] = radius * Math.cos(phi);

      const color = stellarPalette[Math.floor(Math.random() * stellarPalette.length)];
      distantColors[i * 3] = color.r;
      distantColors[i * 3 + 1] = color.g;
      distantColors[i * 3 + 2] = color.b;
    }

    distantGeom.setAttribute('position', new THREE.BufferAttribute(distantPos, 3));
    distantGeom.setAttribute('color', new THREE.BufferAttribute(distantColors, 3));

    const distantMat = new THREE.PointsMaterial({
      size: 2.0,
      map: starTex,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const distantStars = new THREE.Points(distantGeom, distantMat);
    scene.add(distantStars);

    // ==========================================
    // Responsive Resize Observer
    // ==========================================
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newWidth, height: newHeight } = entry.contentRect;
        if (newWidth > 0 && newHeight > 0) {
          camera.aspect = newWidth / newHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(newWidth, newHeight);
        }
      }
    });
    resizeObserver.observe(container);

    // ==========================================
    // View Reset & Controls Interaction
    // ==========================================
    let isResetting = false;
    const initialCameraPos = new THREE.Vector3(0, 160, 310);
    const initialTargetPos = new THREE.Vector3(0, 0, 0);

    const handleResetView = () => {
      isResetting = true;
    };
    window.addEventListener('reset-space-view', handleResetView);

    controls.addEventListener('start', () => {
      isResetting = false;
    });

    // ==========================================
    // Raycasting & Pointer Interaction
    // ==========================================
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let pointerDownPos = { x: 0, y: 0 };
    let pointerDownTime = 0;

    const onPointerDown = (e: MouseEvent) => {
      pointerDownPos = { x: e.clientX, y: e.clientY };
      pointerDownTime = performance.now();
    };

    const onPointerUp = (e: MouseEvent) => {
      const dx = e.clientX - pointerDownPos.x;
      const dy = e.clientY - pointerDownPos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const duration = performance.now() - pointerDownTime;

      // Only select if not dragging view
      if (dist < 6 && duration < 400) {
        const rect = container.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(clickableObjects, true);

        if (intersects.length > 0) {
          let hit: THREE.Object3D | null = intersects[0].object;
          while (hit && !hit.userData?.id && hit.parent) {
            hit = hit.parent;
          }
          if (hit?.userData?.id && onSelectBodyRef.current) {
            onSelectBodyRef.current(hit.userData.id);
          }
        }
      }
    };

    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(clickableObjects, true);
      container.style.cursor = intersects.length > 0 ? 'pointer' : 'grab';
    };

    container.addEventListener('pointerdown', onPointerDown);
    container.addEventListener('pointerup', onPointerUp);
    container.addEventListener('pointermove', onPointerMove);

    // ==========================================
    // Animation Loop
    // ==========================================
    let animationFrameId: number;
    const clock = new THREE.Clock();

    let currentSelectedId: string | null = null;
    let isSwitchingTarget = false;
    let switchStartTime = 0;
    const lastBodyPos = new THREE.Vector3();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.1) * simSpeedRef.current;

      // Camera Tracking & Smooth Focus
      if (selectedBodyIdRef.current !== currentSelectedId) {
        currentSelectedId = selectedBodyIdRef.current;
        isSwitchingTarget = true;
        switchStartTime = performance.now();
      }

      if (currentSelectedId) {
        let targetWorldPos = new THREE.Vector3(0, 0, 0);
        let bodyRadius = 12;

        if (currentSelectedId === 'sun') {
          targetWorldPos.set(0, 0, 0);
          bodyRadius = 12;
        } else if (currentSelectedId === 'comet') {
          targetWorldPos.copy(cometHeadGroup.position);
          bodyRadius = 1.0;
        } else {
          const pInst = planetInstances.find((p) => p.id === currentSelectedId);
          if (pInst) {
            targetWorldPos.copy(pInst.group.position);
            bodyRadius = pInst.radius;
          }
        }

        if (isSwitchingTarget) {
          controls.target.lerp(targetWorldPos, 0.08);
          const viewDist = Math.max(bodyRadius * 4.2 + 5.0, 7.0);
          const desiredCamPos = targetWorldPos.clone().add(new THREE.Vector3(viewDist * 0.75, viewDist * 0.45, viewDist * 0.75));
          camera.position.lerp(desiredCamPos, 0.08);

          if (camera.position.distanceTo(desiredCamPos) < 0.6 || performance.now() - switchStartTime > 2000) {
            isSwitchingTarget = false;
          }
          lastBodyPos.copy(targetWorldPos);
        } else {
          // Lock to moving orbit while preserving user's manual orbit rotation angle
          const deltaMove = targetWorldPos.clone().sub(lastBodyPos);
          camera.position.add(deltaMove);
          controls.target.add(deltaMove);
          lastBodyPos.copy(targetWorldPos);
        }
      } else if (isResetting) {
        camera.position.lerp(initialCameraPos, 0.08);
        controls.target.lerp(initialTargetPos, 0.08);
        if (camera.position.distanceTo(initialCameraPos) < 0.25) {
          camera.position.copy(initialCameraPos);
          controls.target.copy(initialTargetPos);
          isResetting = false;
        }
      }

      // Sun rotation (enhanced speed & vitality)
      sunMesh.rotation.y += delta * 0.45 * rotationSpeedRef.current;

      // Update each planet in our solar system
      planetInstances.forEach((p) => {
        // Orbit around the Sun
        p.angle += delta * p.orbitSpeed * 1.5;
        p.group.position.x = Math.cos(p.angle) * p.orbitDistance;
        p.group.position.z = Math.sin(p.angle) * p.orbitDistance;

        // Axial self-rotation (frame-rate independent, increased baseline and dynamic speed control)
        p.mesh.rotation.y += p.rotationSpeed * delta * 120 * rotationSpeedRef.current;

        // Earth dynamic clouds differential rotation
        if (p.cloudMesh) {
          p.cloudMesh.rotation.y += p.rotationSpeed * 1.35 * delta * 120 * rotationSpeedRef.current;
        }

        // Moons orbit around their parent planet
        p.moons.forEach((m) => {
          m.angle += delta * m.speed * 1.5;
          m.mesh.position.set(
            Math.cos(m.angle) * m.distance,
            Math.sin(m.angle) * 0.2 * m.distance,
            Math.sin(m.angle) * m.distance,
          );
        });
      });

      // Update Halley's Comet Position & Dynamic Ion Tail
      cometAngle += delta * 0.12 * 1.5;
      const cx = cometA * Math.cos(cometAngle) - 75;
      const cz = cometB * Math.sin(cometAngle);
      const cy = cz * Math.sin(cometInclination);
      const currentCometPos = new THREE.Vector3(cx, cy, cz * Math.cos(cometInclination));
      cometHeadGroup.position.copy(currentCometPos);

      // Tail always points radially outward away from the Sun
      const tailDirection = currentCometPos.clone().normalize();
      cometTailMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tailDirection);

      // Scale tail based on distance to Sun
      const cometDistToSun = currentCometPos.length();
      const cometTailScale = Math.max(0.5, 2.4 - cometDistToSun / 130);
      cometTailMesh.scale.set(cometTailScale, cometTailScale, cometTailScale * 1.6);
      cometTailMat.opacity = Math.min(0.75, 0.2 + cometTailScale * 0.22);

      // Update Asteroid Belt orbital movement & tumbling
      for (let i = 0; i < asteroidCount; i++) {
        const rock = asteroidData[i];
        rock.angle += delta * rock.orbitSpeed * 1.5;
        rock.currentRot.x += rock.rotSpeed.x * 2.0 * rotationSpeedRef.current;
        rock.currentRot.y += rock.rotSpeed.y * 2.0 * rotationSpeedRef.current;
        rock.currentRot.z += rock.rotSpeed.z * 2.0 * rotationSpeedRef.current;

        const px = Math.cos(rock.angle) * rock.orbitRadius;
        const py = rock.verticalOffset + Math.sin(rock.angle) * (rock.orbitRadius * rock.inclination);
        const pz = Math.sin(rock.angle) * rock.orbitRadius;

        dummy.position.set(px, py, pz);
        dummy.rotation.copy(rock.currentRot);
        dummy.scale.copy(rock.scale);
        dummy.updateMatrix();
        asteroidMesh.setMatrixAt(i, dummy.matrix);
      }
      asteroidMesh.instanceMatrix.needsUpdate = true;

      // Update Kuiper Belt orbit & tumble
      for (let i = 0; i < kuiperCount; i++) {
        const kRock = kuiperData[i];
        kRock.angle += delta * kRock.orbitSpeed * 1.5;
        kRock.currentRot.x += kRock.rotSpeed.x * 2.0 * rotationSpeedRef.current;
        kRock.currentRot.y += kRock.rotSpeed.y * 2.0 * rotationSpeedRef.current;
        kRock.currentRot.z += kRock.rotSpeed.z * 2.0 * rotationSpeedRef.current;

        const kx = Math.cos(kRock.angle) * kRock.orbitRadius;
        const ky = kRock.verticalOffset + Math.sin(kRock.angle) * (kRock.orbitRadius * kRock.inclination);
        const kz = Math.sin(kRock.angle) * kRock.orbitRadius;

        dummy.position.set(kx, ky, kz);
        dummy.rotation.copy(kRock.currentRot);
        dummy.scale.copy(kRock.scale);
        dummy.updateMatrix();
        kuiperMesh.setMatrixAt(i, dummy.matrix);
      }
      kuiperMesh.instanceMatrix.needsUpdate = true;

      // Ambient celestial drift
      distantStars.rotation.y += delta * 0.001;

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // ==========================================
    // Cleanup
    // ==========================================
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      window.removeEventListener('reset-space-view', handleResetView);
      container.removeEventListener('pointerdown', onPointerDown);
      container.removeEventListener('pointerup', onPointerUp);
      container.removeEventListener('pointermove', onPointerMove);

      orbitsGroupRef.current = null;
      asteroidMeshRef.current = null;
      kuiperMeshRef.current = null;
      cometGroupRef.current = null;
      labelsListRef.current = [];
      sunPointLightRef.current = null;
      sunCoreLightRef.current = null;
      sunHaloMatRef.current = null;
      controls.dispose();
      renderer.dispose();

      starTex.dispose();
      sunTex.dispose();
      cometGlowTex.dispose();
      mercuryTex.dispose();
      venusTex.dispose();
      earthTex.dispose();
      earthCloudTex.dispose();
      marsTex.dispose();
      jupiterTex.dispose();
      saturnTex.dispose();
      saturnRingTex.dispose();
      uranusTex.dispose();
      neptuneTex.dispose();
      plutoTex.dispose();
      charonTex.dispose();
      moonTex.dispose();

      sunGeometry.dispose();
      sunMaterial.dispose();
      sunHaloGeom.dispose();
      sunHaloMat.dispose();
      distantGeom.dispose();
      distantMat.dispose();
      baseRockGeom.dispose();
      rockMat.dispose();
      asteroidMesh.dispose();
      kuiperRockGeom.dispose();
      kuiperMat.dispose();
      kuiperMesh.dispose();
      cometNucleusGeom.dispose();
      cometNucleusMat.dispose();
      cometComaMat.dispose();
      cometTailGeom.dispose();
      cometTailMat.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      id="space-canvas-container"
      ref={containerRef}
      className="w-full h-full absolute inset-0 overflow-hidden cursor-grab active:cursor-grabbing bg-[#010206]"
    />
  );
};
