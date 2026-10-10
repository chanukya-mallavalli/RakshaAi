import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';

export const ThreeDBackground: React.FC = () => {
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

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 24;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x0b1730, 2);
    scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(0x42e8f5, 4, 60);
    cyanLight.position.set(10, 10, 15);
    scene.add(cyanLight);

    const violetLight = new THREE.PointLight(0x8b7cff, 3, 60);
    violetLight.position.set(-10, -10, 10);
    scene.add(violetLight);

    // Group for objects
    const group = new THREE.Group();
    scene.add(group);

    // Ring 1 (Torus)
    const ringGeo1 = new THREE.TorusGeometry(8, 0.08, 16, 100);
    const ringMat1 = new THREE.MeshStandardMaterial({
      color: 0x42e8f5,
      emissive: 0x164e63,
      roughness: 0.2,
      metalness: 0.8,
      wireframe: true,
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    group.add(ring1);

    // Ring 2 (Torus tilted)
    const ringGeo2 = new THREE.TorusGeometry(11, 0.06, 16, 100);
    const ringMat2 = new THREE.MeshStandardMaterial({
      color: 0x8b7cff,
      emissive: 0x312e81,
      roughness: 0.3,
      metalness: 0.7,
      wireframe: true,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = Math.PI / 3;
    group.add(ring2);

    // Floating Shield Node (Icosahedron in center)
    const icoGeo = new THREE.IcosahedronGeometry(3.5, 1);
    const icoMat = new THREE.MeshStandardMaterial({
      color: 0x07111f,
      emissive: 0x42e8f5,
      roughness: 0.1,
      metalness: 0.9,
      wireframe: true,
    });
    const icoMesh = new THREE.Mesh(icoGeo, icoMat);
    group.add(icoMesh);

    // Threat intelligence floating particle cloud
    const particlesCount = 200;
    const positions = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 45;
      positions[i + 1] = (Math.random() - 0.5) * 35;
      positions[i + 2] = (Math.random() - 0.5) * 30;
    }

    const particlesGeo = new THREE.BufferGeometry();
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particlesMat = new THREE.PointsMaterial({
      color: 0x42e8f5,
      size: 0.18,
      transparent: true,
      opacity: 0.6,
    });
    const particlePoints = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particlePoints);

    // Mouse movement parallax
    let targetX = 0;
    let targetY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 0.4;
      targetY = (e.clientY / window.innerHeight - 0.5) * 0.4;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let isVisible = true;
    const handleVisibility = () => {
      isVisible = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', handleVisibility);

    const animate = () => {
      if (isVisible && settings.animationsEnabled) {
        const speed = settings.animationSpeed;
        ring1.rotation.z += 0.002 * speed;
        ring1.rotation.x += 0.001 * speed;
        ring2.rotation.y += 0.003 * speed;
        icoMesh.rotation.y -= 0.004 * speed;
        icoMesh.rotation.x += 0.002 * speed;
        particlePoints.rotation.y += 0.0005 * speed;

        // Smooth camera tilt towards mouse
        camera.position.x += (targetX * 6 - camera.position.x) * 0.05;
        camera.position.y += (-targetY * 6 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      // Dispose resources
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      icoGeo.dispose();
      icoMat.dispose();
      particlesGeo.dispose();
      particlesMat.dispose();
      renderer.dispose();
    };
  }, [settings.threeDEnabled, settings.animationsEnabled, settings.animationSpeed]);

  if (webGLFailed || !settings.threeDEnabled) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-[#07111F] via-[#0B1730] to-[#111C38] opacity-80" />
    );
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none w-full h-full overflow-hidden"
      style={{ opacity: settings.bgIntensity }}
    />
  );
};
