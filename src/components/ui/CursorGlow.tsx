'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from '@/lib/motion';

export default function CursorGlow() {
  const rm = useReducedMotion();
  const [pos, setPos] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    if (rm) return;
    const onMove = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [rm]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        display: rm ? 'none' : undefined,
        background: `radial-gradient(400px circle at ${pos.x}px ${pos.y}px, rgba(0,153,230,0.10), transparent 60%)`,
      }}
    />
  );
}
