import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export const ZeroSpaceCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene & Environment
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050508); // Very dark, near black void

    // Add a Grid for experimental grounding
    const gridHelper = new THREE.GridHelper(100, 100, 0x444444, 0x111111);
    scene.add(gridHelper);

    // 2. Camera Setup
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10000);
    camera.position.set(15, 10, 20);

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    container.appendChild(renderer.domElement);

    // 4. Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 2;
    controls.maxDistance = 500;
    controls.target.set(0, 0, 0);

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.5);
    mainLight.position.set(10, 20, 15);
    scene.add(mainLight);
    
    // Add a point light for dramatic shading
    const pointLight = new THREE.PointLight(0x38bdf8, 2, 50);
    pointLight.position.set(-5, 5, -5);
    scene.add(pointLight);

    // 5.5 Starry Background (Particle System)
    const starCount = 5000;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      // Random positions in a large spherical shell
      const radius = 100 + Math.random() * 800; 
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);

      starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = radius * Math.cos(phi);

      // Subtle color variations (white, blue-ish, yellow-ish)
      const colorType = Math.random();
      let r = 1, g = 1, b = 1;
      if (colorType > 0.8) {
        r = 0.8; g = 0.9; b = 1; // Blueish
      } else if (colorType > 0.6) {
        r = 1; g = 0.95; b = 0.8; // Yellowish
      }
      starColors[i * 3] = r;
      starColors[i * 3 + 1] = g;
      starColors[i * 3 + 2] = b;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 1.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true
    });

    const starParticles = new THREE.Points(starGeometry, starMaterial);
    scene.add(starParticles);

    // 6. Basic Experimental Objects
    // (Empty sandbox - no placeholder objects)

    // 7. Click-to-Glide Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const intersectPoint = new THREE.Vector3();

    const targetControls = new THREE.Vector3().copy(controls.target);
    const targetCamera = new THREE.Vector3().copy(camera.position);
    let isGliding = false;

    controls.addEventListener('start', () => {
      isGliding = false;
      targetControls.copy(controls.target);
      targetCamera.copy(camera.position);
    });

    let pointerDownPos = { x: 0, y: 0 };
    const onPointerDown = (e: PointerEvent) => {
      pointerDownPos = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = (e: PointerEvent) => {
      const dx = e.clientX - pointerDownPos.x;
      const dy = e.clientY - pointerDownPos.y;
      
      // If it's a click and not a drag/pan
      if (Math.abs(dx) < 5 && Math.abs(dy) < 5) {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        if (raycaster.ray.intersectPlane(groundPlane, intersectPoint)) {
          const offset = new THREE.Vector3().subVectors(intersectPoint, controls.target);
          
          targetControls.copy(intersectPoint);
          targetCamera.copy(camera.position).add(offset);
          isGliding = true;
        }
      }
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointerup', onPointerUp);

    const handleResetView = () => {
      targetCamera.set(15, 10, 20);
      targetControls.set(0, 0, 0);
      isGliding = true;
    };
    window.addEventListener('reset-space-view', handleResetView);

    // 8. Resize Handler
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

    // 9. Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      if (isGliding) {
        camera.position.lerp(targetCamera, 0.08);
        controls.target.lerp(targetControls, 0.08);
        
        if (camera.position.distanceTo(targetCamera) < 0.05) {
          isGliding = false;
          camera.position.copy(targetCamera);
          controls.target.copy(targetControls);
        }
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // 10. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('reset-space-view', handleResetView);
      controls.dispose();
      renderer.dispose();
      
      starGeometry.dispose();
      starMaterial.dispose();
      
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      id="zero-space-canvas-container"
      ref={containerRef}
      className="w-full h-full absolute inset-0 overflow-hidden cursor-grab active:cursor-grabbing bg-[#050508]"
    />
  );
};
