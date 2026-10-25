import React, { useEffect, useRef } from 'react';

export interface CursorSpotlightProps {
  className?: string;
  size?: number;
  intensity?: number;
}

export const CursorSpotlight: React.FC<CursorSpotlightProps> = ({
  className = '',
  size = 600,
  intensity = 0.07,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -1000, y: -1000 });
  const targetPosRef = useRef({ x: -1000, y: -1000 });
  const rafId = useRef<number | null>(null);
  const isSupportedRef = useRef(false);

  useEffect(() => {
    // Only enable on non-touch devices with fine pointers and no reduced-motion preference
    const mediaFine = window.matchMedia('(pointer: fine)');
    const mediaReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (!mediaFine.matches || mediaReduced.matches) {
      return;
    }
    isSupportedRef.current = true;

    const handlePointerMove = (e: PointerEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      // Only track if pointer is somewhat near or inside container
      if (
        e.clientX >= rect.left - 200 &&
        e.clientX <= rect.right + 200 &&
        e.clientY >= rect.top - 200 &&
        e.clientY <= rect.bottom + 200
      ) {
        targetPosRef.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        };
      }
    };

    const handlePointerLeave = () => {
      targetPosRef.current = { x: -1000, y: -1000 };
    };

    // Smooth animation loop using interpolation
    const updateLoop = () => {
      // Lerp position for silky smooth movement
      posRef.current.x += (targetPosRef.current.x - posRef.current.x) * 0.15;
      posRef.current.y += (targetPosRef.current.y - posRef.current.y) * 0.15;

      if (spotlightRef.current) {
        spotlightRef.current.style.transform = `translate3d(${posRef.current.x - size / 2}px, ${posRef.current.y - size / 2}px, 0)`;
      }

      rafId.current = requestAnimationFrame(updateLoop);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave, { passive: true });
    rafId.current = requestAnimationFrame(updateLoop);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [size]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden z-0 ${className}`}
    >
      <div
        ref={spotlightRef}
        className="absolute top-0 left-0 rounded-full blur-3xl will-change-transform"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          background: `radial-gradient(circle, rgba(66, 232, 245, ${intensity}) 0%, rgba(149, 128, 255, ${intensity * 0.6}) 40%, rgba(0, 0, 0, 0) 70%)`,
          transform: 'translate3d(-1000px, -1000px, 0)',
        }}
      />
    </div>
  );
};
