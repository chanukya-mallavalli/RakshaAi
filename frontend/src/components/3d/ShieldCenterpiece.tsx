import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ShieldCheck, Sparkles, Orbit } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const ShieldCenterpiece: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { settings } = useTheme();
  const [webGLFailed, setWebGLFailed] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !settings.threeDEnabled) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebGLFailed(true);
      return;
    }

    const width = container.clientWidth || 380;
    const height = container.clientHeight || 380;

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 10;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(0x42e8f5, 8, 30);
    cyanLight.position.set(4, 4, 6);
    scene.add(cyanLight);

    const violetLight = new THREE.PointLight(0x8b7cff, 6, 30);
    violetLight.position.set(-4, -4, 5);
    scene.add(violetLight);

    const shieldGroup = new THREE.Group();
    scene.add(shieldGroup);

    // Create 3D Shield Shape
    const shape = new THREE.Shape();
    shape.moveTo(0, 2.2);
    shape.quadraticCurveTo(2.0, 2.0, 2.0, 0.3);
    shape.quadraticCurveTo(1.8, -1.8, 0, -2.5);
    shape.quadraticCurveTo(-1.8, -1.8, -2.0, 0.3);
    shape.quadraticCurveTo(-2.0, 2.0, 0, 2.2);

    const extrudeSettings = {
      depth: 0.35,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.1,
      bevelThickness: 0.15,
    };

    const shieldGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    shieldGeo.center();

    // Futuristic translucent material with iridescent edges
    const shieldMat = new THREE.MeshPhysicalMaterial({
      color: 0x0b1730,
      emissive: 0x1e3a8a,
      emissiveIntensity: 0.4,
      metalness: 0.85,
      roughness: 0.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      wireframe: false,
    });

    const shieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
    shieldGroup.add(shieldMesh);

    // Wireframe Shield Overlay
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x42e8f5,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const wireMesh = new THREE.Mesh(shieldGeo, wireMat);
    wireMesh.scale.set(1.02, 1.02, 1.02);
    shieldGroup.add(wireMesh);

    // Concentric Orbit Ring
    const ringGeo = new THREE.TorusGeometry(3.2, 0.04, 16, 80);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x42e8f5,
      emissive: 0x42e8f5,
      emissiveIntensity: 0.6,
      wireframe: true,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2.5;
    shieldGroup.add(ring);

    // Second Orbit Ring
    const ringGeo2 = new THREE.TorusGeometry(3.6, 0.03, 16, 80);
    const ringMat2 = new THREE.MeshStandardMaterial({
      color: 0x8b7cff,
      emissive: 0x8b7cff,
      emissiveIntensity: 0.5,
      wireframe: true,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = -Math.PI / 3;
    shieldGroup.add(ring2);

    // Orbital Threat Node (Sphere)
    const nodeGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const nodeMat = new THREE.MeshStandardMaterial({
      color: 0x32d583,
      emissive: 0x32d583,
      emissiveIntensity: 1,
    });
    const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
    shieldGroup.add(nodeMesh);

    // Interactive mouse movement
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 1.5;
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 1.5;
    };
    container.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!settings.animationsEnabled) {
        renderer.render(scene, camera);
        return;
      }

      const t = clock.getElapsedTime() * settings.animationSpeed;

      // Gentle floating and tilting
      shieldMesh.position.y = Math.sin(t * 1.5) * 0.15;
      wireMesh.position.y = shieldMesh.position.y;

      shieldGroup.rotation.y += 0.006 * settings.animationSpeed;
      ring.rotation.z += 0.008 * settings.animationSpeed;
      ring2.rotation.z -= 0.007 * settings.animationSpeed;

      // Orbit node around shield
      nodeMesh.position.x = Math.cos(t * 1.8) * 3.3;
      nodeMesh.position.z = Math.sin(t * 1.8) * 3.3;
      nodeMesh.position.y = Math.sin(t * 2.5) * 0.8;

      // Mouse interactive response
      shieldGroup.rotation.x += (mouseY * 0.8 - shieldGroup.rotation.x) * 0.08;
      shieldGroup.rotation.y += (mouseX * 0.8 - shieldGroup.rotation.y) * 0.08;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mousemove', handleMouseMove);
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      shieldGeo.dispose();
      shieldMat.dispose();
      wireMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      nodeGeo.dispose();
      nodeMat.dispose();
      renderer.dispose();
    };
  }, [settings.threeDEnabled, settings.animationsEnabled, settings.animationSpeed]);

  // Fallback if 3D is disabled or WebGL is unavailable
  if (webGLFailed || !settings.threeDEnabled) {
    return (
      <div className="relative w-72 h-72 sm:w-84 sm:h-84 flex items-center justify-center mx-auto">
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#42E8F5]/20 to-[#8B7CFF]/20 blur-2xl animate-pulse" />
        <div className="relative w-56 h-56 rounded-3xl bg-[#0B1730]/80 border-2 border-[#42E8F5]/40 flex flex-col items-center justify-center shadow-2xl backdrop-blur-xl">
          <ShieldCheck className="w-24 h-24 text-[#42E8F5] drop-shadow-[0_0_20px_rgba(66,232,245,0.6)]" />
          <span className="text-xs font-semibold text-[#8B7CFF] mt-2 tracking-wider uppercase">
            Holographic Shield
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* 3D WebGL Canvas Container */}
      <div
        ref={containerRef}
        className="w-80 h-80 sm:w-96 sm:h-96 cursor-grab active:cursor-grabbing flex items-center justify-center"
      />
      {/* Indicator pill */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0B1730]/70 border border-[#42E8F5]/30 text-[#42E8F5] text-xs font-medium shadow-md backdrop-blur-md -mt-4">
        <Orbit className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
        <span>Interactive 3D Security Shield</span>
      </div>
    </div>
  );
};
