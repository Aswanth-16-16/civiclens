import React, { useRef, useState, useCallback } from 'react';

export interface GlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
}

export const GlowButton: React.FC<GlowButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  children,
  className = '',
  disabled = false,
  onClick,
  ...rest
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [coords, setCoords] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
    if (disabled || !buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, [disabled]);

  const handlePointerEnter = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
    if (disabled || !buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setIsHovered(true);
  }, [disabled]);

  const handlePointerLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  // Size styling
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs gap-1.5 rounded-lg',
    md: 'px-5 py-2.5 text-xs sm:text-sm gap-2 rounded-xl',
    lg: 'px-7 py-3.5 text-sm sm:text-base gap-2.5 rounded-xl font-bold',
  }[size];

  // Variant base styling
  const variantClasses = {
    primary:
      'bg-gradient-to-r from-[#42E8F5] via-[#48EBF8] to-[#5CF0FD] text-[#080D16] font-bold border border-[#42E8F5] shadow-[0_0_15px_rgba(66,232,245,0.28)] hover:shadow-[0_0_28px_rgba(66,232,245,0.55)] hover:border-white',
    secondary:
      'bg-[#0C1320] text-[#F4F7FC] font-semibold border border-[rgba(160,190,220,0.18)] hover:border-[#42E8F5] hover:text-[#42E8F5] shadow-[0_4px_16px_rgba(0,0,0,0.4)] hover:shadow-[0_0_22px_rgba(66,232,245,0.22)]',
    ghost:
      'bg-transparent text-[#A6B4C8] hover:text-[#F4F7FC] border border-transparent hover:border-[rgba(160,190,220,0.25)] hover:bg-[#121C2B]',
    outline:
      'bg-transparent text-[#42E8F5] font-semibold border border-[#42E8F5]/40 hover:border-[#42E8F5] hover:bg-[#42E8F5]/10 hover:shadow-[0_0_20px_rgba(66,232,245,0.25)]',
  }[variant];

  // Radial glow color based on variant
  const radialGlow = variant === 'primary'
    ? `radial-gradient(circle 80px at ${coords.x}px ${coords.y}px, rgba(255, 255, 255, 0.45), rgba(255, 255, 255, 0) 75%)`
    : `radial-gradient(circle 100px at ${coords.x}px ${coords.y}px, rgba(66, 232, 245, 0.28), rgba(66, 232, 245, 0) 75%)`;

  return (
    <button
      ref={buttonRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onClick={onClick}
      disabled={disabled}
      className={`
        relative inline-flex items-center justify-center select-none overflow-hidden
        transition-all duration-200 ease-out
        ${!disabled ? 'hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] cursor-pointer' : 'opacity-50 cursor-not-allowed'}
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#42E8F5] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080D16]
        ${sizeClasses}
        ${variantClasses}
        ${className}
      `}
      {...rest}
    >
      {/* Interactive Cursor-Following Radial Glow Layer */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300 ease-out"
        style={{
          background: radialGlow,
          opacity: isHovered && !disabled ? 1 : 0,
        }}
      />

      {/* Button Content with elevated z-index */}
      <span className="relative z-10 flex items-center justify-center gap-inherit leading-none pointer-events-none">
        {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
        <span>{children}</span>
        {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
      </span>
    </button>
  );
};
