import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

export const CyberStreamBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { settings } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const columns = Math.floor(width / 24);
    const drops: number[] = new Array(columns).fill(1);
    const chars = '01RAKSHASAFE92PROTECT';

    let animId: number;
    let isVisible = true;
    const handleVisibility = () => {
      isVisible = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', handleVisibility);

    let lastTime = 0;
    const fpsInterval = 1000 / (24 * settings.animationSpeed);

    const render = (time: number) => {
      animId = requestAnimationFrame(render);
      if (!isVisible || !settings.animationsEnabled) return;

      const elapsed = time - lastTime;
      if (elapsed < fpsInterval) return;
      lastTime = time - (elapsed % fpsInterval);

      // Translucent wash for cyber trail
      ctx.fillStyle = 'rgba(7, 17, 31, 0.14)';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#42E8F5';
      ctx.font = '12px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * 24;
        const y = drops[i] * 18;

        // Alternate cyan / soft violet for cyber look
        ctx.fillStyle = i % 3 === 0 ? '#8B7CFF' : '#42E8F5';
        ctx.fillText(text, x, y);

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [settings.animationsEnabled, settings.animationSpeed]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover"
        style={{ opacity: settings.bgIntensity * 0.45 }}
      />
      {/* Contrast preserving gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#07111F] via-[#07111F]/80 to-[#07111F]/60" />
    </div>
  );
};
