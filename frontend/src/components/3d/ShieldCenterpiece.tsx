
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ShieldCheck, Orbit, Sparkles } from 'lucide-react';


interface ShieldCenterpieceProps {
  className?: string;
}

const ShieldCenterpiece: React.FC<ShieldCenterpieceProps> = ({
  className = '',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;

    if (!mount) return;

    let renderer: THREE.WebGLRenderer;

    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
      });
    } catch (error) {
      console.error('Unable to initialize the 3D shield:', error);
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(
      mount.clientWidth || 320,
      mount.clientHeight || 320
    );

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      45,
      (mount.clientWidth || 320) / (mount.clientHeight || 320),
      0.1,
      100
    );

    camera.position.z = 6;

    const shieldShape = new THREE.Shape();

    shieldShape.moveTo(0, 1.8);
    shieldShape.lineTo(1.25, 1.25);
    shieldShape.lineTo(1.05, -0.3);
    shieldShape.quadraticCurveTo(0.8, -1.35, 0, -1.8);
    shieldShape.quadraticCurveTo(-0.8, -1.35, -1.05, -0.3);
    shieldShape.lineTo(-1.25, 1.25);
    shieldShape.closePath();

    const shieldGeometry = new THREE.ExtrudeGeometry(shieldShape, {
      depth: 0.18,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.06,
      bevelThickness: 0.06,
    });

    const shieldMaterial = new THREE.MeshStandardMaterial({
      color: 0x14b8ff,
      metalness: 0.65,
      roughness: 0.25,
      emissive: 0x063c65,
      emissiveIntensity: 0.45,
    });

    const shield = new THREE.Mesh(shieldGeometry, shieldMaterial);
    shield.position.z = -0.1;
    scene.add(shield);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(0x00d9ff, 45);
    cyanLight.position.set(3, 3, 4);
    scene.add(cyanLight);

    const violetLight = new THREE.PointLight(0x8855ff, 30);
    violetLight.position.set(-3, -2, 3);
    scene.add(violetLight);

    const ringGeometry = new THREE.TorusGeometry(1.75, 0.012, 8, 120);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x39d9ff,
      transparent: true,
      opacity: 0.65,
    });

    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2.7;
    scene.add(ring);

    let animationFrame = 0;
    let isDisposed = false;

    const animate = () => {
      if (isDisposed) return;

      animationFrame = window.requestAnimationFrame(animate);

      shield.rotation.y += 0.004;
      shield.rotation.x = Math.sin(Date.now() * 0.0005) * 0.08;
      ring.rotation.z += 0.002;

      renderer.render(scene, camera);
    };

    const resizeObserver = new ResizeObserver(() => {
      if (!mount || isDisposed) return;

      const width = mount.clientWidth;
      const height = mount.clientHeight;

      if (width <= 0 || height <= 0) return;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });

    resizeObserver.observe(mount);

    setIsReady(true);
    animate();

    return () => {
      isDisposed = true;
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();

      shieldGeometry.dispose();
      shieldMaterial.dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();

      renderer.dispose();

      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      className={`shield-centerpiece ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '420px',
        height: '380px',
        margin: '0 auto',
        overflow: 'hidden',
      }}
    >
      <div
        ref={mountRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '74px',
            height: '74px',
            borderRadius: '22px',
            color: '#ffffff',
            background:
              'linear-gradient(135deg, rgba(0,217,255,0.9), rgba(95,75,255,0.9))',
            boxShadow: '0 0 45px rgba(0,217,255,0.3)',
          }}
        >
          <ShieldCheck size={42} strokeWidth={1.7} />
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            marginTop: '18px',
            padding: '8px 14px',
            border: '1px solid rgba(80,200,255,0.25)',
            borderRadius: '999px',
            background: 'rgba(10,25,50,0.72)',
            color: '#b9edff',
            fontSize: '12px',
            letterSpacing: '1.5px',
            backdropFilter: 'blur(12px)',
          }}
        >
          <Sparkles size={14} />
          RAKSHAAI PROTECTION
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginTop: '10px',
            color: '#8ca9c7',
            fontSize: '11px',
          }}
        >
          <Orbit size={13} />
          {isReady ? '3D SYSTEM ACTIVE' : 'INITIALIZING 3D SYSTEM'}
        </div>
      </div>
    </div>
  );
};

export default ShieldCenterpiece;