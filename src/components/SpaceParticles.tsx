"use client";

import { useMemo } from "react";

function seededRandom(seed: number) {
  const value = Math.sin(seed * 9301 + 49297) * 49297;
  return value - Math.floor(value);
}

/** White particles drifting across a dark backdrop. Client-only (uses
 *  Math.random) to avoid hydration mismatch. Shared by About & Experience. */
export default function SpaceParticles({ count = 60 }: { count?: number }) {
  const dots = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        left: seededRandom(i * 11 + 1) * 100,
        top: seededRandom(i * 13 + 2) * 100,
        size: 1 + seededRandom(i * 17 + 3) * 2.5,
        op: 0.4 + seededRandom(i * 19 + 4) * 0.6,
        dx: `${(seededRandom(i * 23 + 5) * 2 - 1) * 70}px`,
        dy: `${(seededRandom(i * 29 + 6) * 2 - 1) * 70}px`,
        dur: 10 + seededRandom(i * 31 + 7) * 14,
        delay: seededRandom(i * 37 + 8) * 8,
      })),
    [count]
  );

  return (
    <div className="pointer-events-none absolute inset-0 z-0">
      {dots.map((d, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white"
          style={
            {
              left: `${d.left}%`,
              top: `${d.top}%`,
              width: d.size,
              height: d.size,
              boxShadow: `0 0 ${d.size * 3}px rgba(255,255,255,0.8)`,
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
