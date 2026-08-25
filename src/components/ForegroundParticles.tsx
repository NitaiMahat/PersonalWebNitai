"use client";

import { useEffect, useMemo, useState } from "react";

function seededRand(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

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
    return Array.from({ length: 14 }).map((_, i) => {
      const c = palette[Math.floor(seededRand(i * 7 + 1) * palette.length)];
      const near = seededRand(i * 11 + 2) < 0.35;
      const base = 2 + seededRand(i * 13 + 3) * 3;
      return {
        left: seededRand(i * 17 + 4) * 100,
        top: seededRand(i * 19 + 5) * 100,
        size: near ? base * 3 : base,
        color: c + (0.45 + seededRand(i * 23 + 6) * 0.4) + ")",
        blur: near ? 3 + seededRand(i * 29 + 7) * 4 : 0,
        dx: `${(seededRand(i * 31 + 8) * 2 - 1) * 50}px`,
        dy: `${(seededRand(i * 37 + 9) * 2 - 1) * 50}px`,
        op: near ? 0.35 + seededRand(i * 41 + 10) * 0.25 : 0.5 + seededRand(i * 43 + 11) * 0.4,
        dur: 9 + seededRand(i * 47 + 12) * 10,
        delay: seededRand(i * 53 + 13) * 6,
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
