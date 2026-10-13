"use client";

import { useMemo } from "react";

function seededRandom(seed: number) {
  const value = Math.sin(seed * 9301 + 49297) * 49297;
  return value - Math.floor(value);
}

/**
 * A sparse layer of particles that float IN FRONT of the figure to add depth —
 * a few are large and blurred (out-of-focus "bokeh", i.e. close to camera) so it
 * reads as 3D space rather than a flat backdrop. Kept intentionally light.
 */
export default function ForegroundParticles() {
  const dots = useMemo(() => {
    const palette = [
      "rgba(255,255,255,",
      "rgba(199,125,255,",
      "rgba(157,78,221,",
    ];
    return Array.from({ length: 10 }).map((_, i) => {
      const c = palette[Math.floor(seededRandom(i * 11 + 1) * palette.length)];
      const near = seededRandom(i * 13 + 2) < 0.35;
      const base = 2 + seededRandom(i * 17 + 3) * 3;
      return {
        left: seededRandom(i * 19 + 4) * 100,
        top: seededRandom(i * 23 + 5) * 100,
        size: near ? base * 3 : base,
        color: c + (0.45 + seededRandom(i * 29 + 6) * 0.4) + ")",
        blur: near ? 3 + seededRandom(i * 31 + 7) * 4 : 0,
        dx: `${(seededRandom(i * 37 + 8) * 2 - 1) * 50}px`,
        dy: `${(seededRandom(i * 41 + 9) * 2 - 1) * 50}px`,
        op: near ? 0.35 + seededRandom(i * 43 + 10) * 0.25 : 0.5 + seededRandom(i * 47 + 11) * 0.4,
        dur: 9 + seededRandom(i * 53 + 12) * 10,
        delay: seededRandom(i * 59 + 13) * 6,
      };
    });
  }, []);

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
