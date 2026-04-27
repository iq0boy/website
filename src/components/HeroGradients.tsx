import { useState, useEffect } from 'react';

export default function HeroGradients() {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const handler = (e: MouseEvent) =>
      setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  return (
    <>
      <div style={{
        position: 'absolute', width: '60vw', height: '60vw', borderRadius: '50%',
        background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)',
        top: '10%', right: '-15%',
        transform: `translate(${mousePos.x * -30}px, ${mousePos.y * -30}px)`,
        transition: 'transform 0.8s ease-out', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', width: '40vw', height: '40vw', borderRadius: '50%',
        background: 'radial-gradient(circle, oklch(0.6 0.12 280 / 0.04) 0%, transparent 70%)',
        bottom: '-10%', left: '-10%',
        transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px)`,
        transition: 'transform 0.8s ease-out', pointerEvents: 'none',
      }} />
    </>
  );
}
