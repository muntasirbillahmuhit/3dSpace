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

// Sun Glow / Corona sprite texture
function createSunGlowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  const center = 128;

  const gradient = ctx.createRadialGradient(center, center, 0, center, center, 120);
  gradient.addColorStop(0.0, 'rgba(255, 255, 240, 1.0)');
  gradient.addColorStop(0.2, 'rgba(255, 200, 80, 0.85)');
  gradient.addColorStop(0.5, 'rgba(255, 120, 20, 0.35)');
  gradient.addColorStop(0.8, 'rgba(240, 60, 10, 0.08)');
  gradient.addColorStop(1.0, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 256);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export const SpaceCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene & Dark Cosmic Canvas
    const scene = new THREE.Scene();

    // Camera setup - elevated diagonal angle giving full view of the Solar System
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 15000);
    camera.position.set(0, 140, 260);

    // WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x010206, 1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.65;
    controls.zoomSpeed = 1.1;
    controls.panSpeed = 0.65;
    controls.minDistance = 20;
    controls.maxDistance = 2500;
    controls.target.set(0, 0, 0);

    // Ambient space light so the dark side of planets remains subtly legible
    const ambientLight = new THREE.AmbientLight(0x1a2233, 0.45);
    scene.add(ambientLight);

    // Solar Point Light originating from the Sun's core
    const sunPointLight = new THREE.PointLight(0xfff5ea, 3.2, 2000, 0.35);
    sunPointLight.position.set(0, 0, 0);
    scene.add(sunPointLight);

    // Generate Planetary Textures
    const starTex = createStarTexture();
    const sunGlowTex = createSunGlowTexture();
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
    });
    const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
    sunGroup.add(sunMesh);

    // Sun Corona Glow Sprite
    const coronaMat = new THREE.SpriteMaterial({
      map: sunGlowTex,
      color: 0xffffff,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const coronaSprite = new THREE.Sprite(coronaMat);
    coronaSprite.scale.set(sunRadius * 4.8, sunRadius * 4.8, 1);
    sunGroup.add(coronaSprite);

    // Outer Solar Atmosphere Shell
    const sunHaloGeom = new THREE.SphereGeometry(sunRadius * 1.08, 32, 32);
    const sunHaloMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
    });
    const sunHaloMesh = new THREE.Mesh(sunHaloGeom, sunHaloMat);
    sunGroup.add(sunHaloMesh);

    // ==========================================
    // 2. Solar System Planets & Orbital Systems
    // ==========================================
    interface PlanetInstance {
      id: string;
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
    };

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
      scene.add(orbitLine);

      // B. Planet Container Group
      const planetGroup = new THREE.Group();
      // Apply Axial Tilt
      planetGroup.rotation.z = (planetData.axialTilt * Math.PI) / 180;
      scene.add(planetGroup);

      // C. Planet Mesh
      const pGeom = new THREE.SphereGeometry(planetData.radius, 48, 48);
      const pMat = new THREE.MeshStandardMaterial({
        map: textureMap[planetData.id],
        roughness: planetData.id === 'earth' ? 0.4 : 0.8,
        metalness: 0.05,
      });
      const pMesh = new THREE.Mesh(pGeom, pMat);
      planetGroup.add(pMesh);

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
            map: moonTex,
            color: new THREE.Color(m.color),
            roughness: 0.9,
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
    // Animation Loop
    // ==========================================
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.1);

      // Sun slow rotation
      sunMesh.rotation.y += delta * 0.2;

      // Update each planet in our solar system
      planetInstances.forEach((p) => {
        // Orbit around the Sun
        p.angle += delta * p.orbitSpeed * 1.5;
        p.group.position.x = Math.cos(p.angle) * p.orbitDistance;
        p.group.position.z = Math.sin(p.angle) * p.orbitDistance;

        // Axial self-rotation (frame-rate independent & increased speed)
        p.mesh.rotation.y += p.rotationSpeed * delta * 50;

        // Earth dynamic clouds differential rotation
        if (p.cloudMesh) {
          p.cloudMesh.rotation.y += p.rotationSpeed * 1.35 * delta * 50;
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

      // Update Asteroid Belt orbital movement & tumbling
      for (let i = 0; i < asteroidCount; i++) {
        const rock = asteroidData[i];
        rock.angle += delta * rock.orbitSpeed * 1.5;
        rock.currentRot.x += rock.rotSpeed.x;
        rock.currentRot.y += rock.rotSpeed.y;
        rock.currentRot.z += rock.rotSpeed.z;

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
      controls.dispose();
      renderer.dispose();

      starTex.dispose();
      sunGlowTex.dispose();
      sunTex.dispose();
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
      moonTex.dispose();

      sunGeometry.dispose();
      sunMaterial.dispose();
      coronaMat.dispose();
      sunHaloGeom.dispose();
      sunHaloMat.dispose();
      distantGeom.dispose();
      distantMat.dispose();
      baseRockGeom.dispose();
      rockMat.dispose();
      asteroidMesh.dispose();

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
