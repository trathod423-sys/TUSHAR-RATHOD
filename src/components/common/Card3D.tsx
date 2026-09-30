import React, { useRef, useState, useEffect } from 'react';

interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number; // max tilt degrees, e.g. 10
  glare?: boolean;
  scale?: number; // scale on hover, e.g. 1.02
}

export const Card3D: React.FC<Card3DProps> = ({
  children,
  className = '',
  maxTilt = 8,
  glare = true,
  scale = 1.02,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [waveTilt, setWaveTilt] = useState<{ rx: number; ry: number; scale: number } | null>(null);

  useEffect(() => {
    const handleWave = () => {
      // Stagger random jitter for a wave ripple across cards
      const delay = Math.random() * 180;
      const t0 = setTimeout(() => {
        setWaveTilt({ rx: -maxTilt * 0.9, ry: maxTilt * 0.9, scale: 1.03 });
        setGlarePos({ x: 25, y: 25 });
      }, delay);

      const t1 = setTimeout(() => {
        setWaveTilt({ rx: maxTilt * 0.7, ry: -maxTilt * 0.7, scale: 1.02 });
        setGlarePos({ x: 75, y: 75 });
      }, delay + 650);

      const t2 = setTimeout(() => {
        setWaveTilt(null);
      }, delay + 1500);

      return () => {
        clearTimeout(t0);
        clearTimeout(t1);
        clearTimeout(t2);
      };
    };

    window.addEventListener('feedbackiq:3d-demo-wave', handleWave);
    return () => window.removeEventListener('feedbackiq:3d-demo-wave', handleWave);
  }, [maxTilt]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -maxTilt;
    const rY = ((x - centerX) / centerX) * maxTilt;

    setRotateX(rX);
    setRotateY(rY);
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: '1400px',
        transformStyle: 'preserve-3d',
      }}
      className={`relative transition-transform duration-200 ease-out card-3d-depth ${className}`}
    >
      <div
        style={{
          transform: isHovered
            ? `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`
            : waveTilt
            ? `rotateX(${waveTilt.rx}deg) rotateY(${waveTilt.ry}deg) scale(${waveTilt.scale})`
            : 'rotateX(0deg) rotateY(0deg) scale(1)',
          transformStyle: 'preserve-3d',
          transition: isHovered
            ? 'transform 0.08s ease-out'
            : waveTilt
            ? 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)'
            : 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="w-full h-full relative rounded-inherit"
      >
        {children}

        {/* Dynamic Specular 3D Glare Reflection */}
        {glare && (isHovered || waveTilt) && (
          <div
            className="absolute inset-0 pointer-events-none rounded-inherit overflow-hidden transition-opacity duration-200 z-30"
            style={{
              background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.24) 0%, rgba(96, 165, 250, 0.12) 35%, transparent 65%)`,
              borderRadius: 'inherit',
            }}
          />
        )}
      </div>
    </div>
  );
};
