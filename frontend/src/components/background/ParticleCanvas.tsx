
import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
}

export const ParticleCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const { settings } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let isVisible = document.visibilityState === 'visible';
    let isDisposed = false;

    let mouseX = -1000;
    let mouseY = -1000;

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    const handleVisibility = () => {
      isVisible = document.visibilityState === 'visible';
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('visibilitychange', handleVisibility);

    const particleCount = Math.max(
      0,
      Math.floor(settings.particleDensity * (width < 768 ? 0.5 : 1))
    );

    const colors = ['#42E8F5', '#8B7CFF', '#32D583', '#60A5FA'];
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.7 * settings.animationSpeed,
        vy: (Math.random() - 0.5) * 0.7 * settings.animationSpeed,
        size: Math.random() * 2.2 + 1,
        alpha: Math.random() * 0.6 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const render = () => {
      if (isDisposed) return;

      animationFrameId.current = requestAnimationFrame(render);

      if (!isVisible || !settings.animationsEnabled) return;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i];

        // Gently repel particles near the mouse pointer.
        const mouseDx = particle.x - mouseX;
        const mouseDy = particle.y - mouseY;
        const mouseDistance = Math.sqrt(
          mouseDx * mouseDx + mouseDy * mouseDy
        );

        if (mouseDistance > 0 && mouseDistance < 100) {
          const force = (100 - mouseDistance) / 100;

          particle.vx += (mouseDx / mouseDistance) * force * 0.025;
          particle.vy += (mouseDy / mouseDistance) * force * 0.025;
        }

        // Keep particle movement controlled.
        const maxSpeed =
          1.5 * Math.max(settings.animationSpeed, 0.1);

        const speed = Math.sqrt(
          particle.vx * particle.vx + particle.vy * particle.vy
        );

        if (speed > maxSpeed) {
          particle.vx = (particle.vx / speed) * maxSpeed;
          particle.vy = (particle.vy / speed) * maxSpeed;
        }

        // Draw connection lines to nearby particles.
        for (let j = i + 1; j < particles.length; j++) {
          const other = particles[j];
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            const lineAlpha =
              (1 - distance / 120) * 0.22 * settings.bgIntensity;

            ctx.strokeStyle = `rgba(66, 232, 245, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }

        // Move particles.
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap particles around screen edges.
        if (particle.x < 0) particle.x = width;
        if (particle.x > width) particle.x = 0;
        if (particle.y < 0) particle.y = height;
        if (particle.y > height) particle.y = 0;

        // Draw particle nodes.
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.alpha * settings.bgIntensity;
        ctx.beginPath();
        ctx.arc(
          particle.x,
          particle.y,
          particle.size,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }

      ctx.globalAlpha = 1;
    };

    render();

    return () => {
      isDisposed = true;

      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibility);

      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
    };
  }, [
    settings.particleDensity,
    settings.animationSpeed,
    settings.bgIntensity,
    settings.animationsEnabled,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none w-full h-full"
      style={{ opacity: settings.bgIntensity }}
      aria-hidden="true"
    />
  );
};

export default ParticleCanvas;
