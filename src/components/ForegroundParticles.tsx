"use client";

import { useEffect, useMemo, useState } from "react";

/**
 * A sparse layer of particles that float IN FRONT of the figure to add depth —
 * a few are large and blurred (out-of-focus "bokeh", i.e. close to camera) so it
 * reads as 3D space rather than a flat backdrop. Kept intentionally light.
 */
export default function ForegroundParticles() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const dots = useMemo(() => {
    const palette = [
      "rgba(255,255,255,",
      "rgba(199,125,255,",
      "rgba(157,78,221,",
    ];
    return Array.from({ length: 14 }).map(() => {
      const c = palette[Math.floor(Math.random() * palette.length)];
      const near = Math.random() < 0.35; // a few close, blurred particles
      const base = 2 + Math.random() * 3;
      return {
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: near ? base * 3 : base,
        color: c + (0.45 + Math.random() * 0.4) + ")",
        blur: near ? 3 + Math.random() * 4 : 0,
        dx: `${(Math.random() * 2 - 1) * 50}px`,
        dy: `${(Math.random() * 2 - 1) * 50}px`,
        op: near ? 0.35 + Math.random() * 0.25 : 0.5 + Math.random() * 0.4,
        dur: 9 + Math.random() * 10,
        delay: Math.random() * 6,
      };
    });
  }, []);

  // Avoid SSR/client mismatch from Math.random().
  if (!mounted) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      {dots.map((d, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={
            {
              left: `${d.left}%`,
              top: `${d.top}%`,
              width: d.size,
              height: d.size,
              background: d.color,
              boxShadow: `0 0 ${d.size * 2}px ${d.color}`,
              filter: d.blur ? `blur(${d.blur}px)` : undefined,
              animation: `cardParticle ${d.dur}s ease-in-out ${d.delay}s infinite`,
              "--dx": d.dx,
              "--dy": d.dy,
              "--op": `${d.op}`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
