import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { ParticleCanvas } from './ParticleCanvas';
import { ThreeDBackground } from './ThreeDBackground';
import { CyberStreamBackground } from './CyberStreamBackground';

export const GlobalBackground: React.FC = () => {
  const { settings } = useTheme();

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none transition-colors duration-500">
      {/* 1. Plain Theme */}
      {settings.bgTheme === 'plain' && (
        <div
          className={`w-full h-full ${
            settings.plainVariant === 'navy'
              ? 'bg-[#0B1730]'
              : settings.plainVariant === 'black'
              ? 'bg-[#040810]'
              : settings.plainVariant === 'light'
              ? 'bg-[#F1F5F9]'
              : 'bg-[#FFFFFF]'
          }`}
        />
      )}

      {/* 2. Premium Gradient Theme */}
      {settings.bgTheme === 'gradient' && (
        <div className="relative w-full h-full bg-[#07111F]">
          {/* Ambient Glowing Orbs */}
          <div
            className={`absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#42E8F5]/10 blur-[130px] ${
              settings.animationsEnabled ? 'animate-pulse-glow' : ''
            }`}
          />
          <div
            className={`absolute bottom-[-15%] right-[-10%] w-[55vw] h-[55vw] rounded-full bg-[#8B7CFF]/12 blur-[140px] ${
              settings.animationsEnabled ? 'animate-pulse-glow' : ''
            }`}
            style={{ animationDelay: '2s' }}
          />
          <div className="absolute top-[35%] left-[25%] w-[40vw] h-[40vw] rounded-full bg-[#0B1730] blur-[100px]" />
          {/* Subtle Grid Lines */}
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage:
                'linear-gradient(rgba(66, 232, 245, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(66, 232, 245, 0.1) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />
        </div>
      )}

      {/* 3. Animated Particles Theme */}
      {settings.bgTheme === 'particles' && (
        <div className="relative w-full h-full bg-[#07111F]">
          <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-[#42E8F5]/8 blur-[120px] rounded-full" />
          <ParticleCanvas />
        </div>
      )}

      {/* 4. Cinematic 3D Theme */}
      {settings.bgTheme === '3d' && (
        <div className="relative w-full h-full bg-[#07111F]">
          <ThreeDBackground />
        </div>
      )}

      {/* 5. Animated Cyber-Stream Theme */}
      {settings.bgTheme === 'cyber-stream' && (
        <div className="relative w-full h-full bg-[#07111F]">
          <CyberStreamBackground />
        </div>
      )}

      {/* Global Adjustable Dimming Overlay to ensure text readability */}
      {settings.bgTheme !== 'plain' && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            backgroundColor: `rgba(7, 17, 31, ${settings.bgDimming})`,
          }}
        />
      )}
    </div>
  );
};
