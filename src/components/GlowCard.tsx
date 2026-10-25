import React, { useRef, useState, useCallback } from 'react';

export interface GlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  tilt?: boolean;
  glowColor?: 'cyan' | 'violet' | 'multi';
  className?: string;
}

export const GlowCard: React.FC<GlowCardProps> = ({
  children,
  tilt = true,
  glowColor = 'cyan',
  className = '',
  ...rest
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [tiltStyle, setTiltStyle] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCoords({ x, y });

    if (tilt) {
      // Gentle tilt calculation (-3 to +3 degrees)
      const tiltX = ((y / rect.height) - 0.5) * -5;
      const tiltY = ((x / rect.width) - 0.5) * 5;
      setTiltStyle({ x: tiltX, y: tiltY });
    }
  }, [tilt]);

  const handlePointerEnter = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setIsHovered(true);
  }, []);

  const handlePointerLeave = useCallback(() => {
    setIsHovered(false);
    if (tilt) {
      setTiltStyle({ x: 0, y: 0 });
    }
  }, [tilt]);

  // Spotlight gradient based on selected accent color
  const spotlightGradient = {
    cyan: `radial-gradient(350px circle at ${coords.x}px ${coords.y}px, rgba(66, 232, 245, 0.1), rgba(66, 232, 245, 0) 70%)`,
    violet: `radial-gradient(350px circle at ${coords.x}px ${coords.y}px, rgba(149, 128, 255, 0.1), rgba(149, 128, 255, 0) 70%)`,
    multi: `radial-gradient(400px circle at ${coords.x}px ${coords.y}px, rgba(66, 232, 245, 0.09) 0%, rgba(149, 128, 255, 0.05) 50%, rgba(0, 0, 0, 0) 75%)`,
  }[glowColor];

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      className={`
        group relative rounded-2xl bg-[#121C2B] border border-[rgba(160,190,220,0.14)]
        transition-all duration-300 ease-out
        hover:-translate-y-1.5 hover:border-[#42E8F5]/40
        hover:shadow-[0_16px_40px_-10px_rgba(0,0,0,0.7),0_0_24px_-4px_rgba(66,232,245,0.18)]
        overflow-hidden
        ${className}
      `}
      style={{
        transform: tilt && isHovered
          ? `perspective(1000px) rotateX(${tiltStyle.x}deg) rotateY(${tiltStyle.y}deg)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
        transformStyle: 'preserve-3d',
      }}
      {...rest}
    >
      {/* Interactive Cursor Spotlight Glow Layer */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300 ease-out"
        style={{
          background: spotlightGradient,
          opacity: isHovered ? 1 : 0,
        }}
      />

      {/* Subtle corner specular highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#42E8F5]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      />

      {/* Card Content Layer */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};
