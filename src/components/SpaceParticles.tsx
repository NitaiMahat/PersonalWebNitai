"use client";

import { useEffect, useMemo, useState } from "react";

function seededRand(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

/** White particles drifting across a dark backdrop. Shared by About & Experience. */
export default function SpaceParticles({ count = 60 }: { count?: number }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const dots = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        left: seededRand(i * 13 + 1) * 100,
        top: seededRand(i * 17 + 2) * 100,
        size: 1 + seededRand(i * 19 + 3) * 2.5,
        op: 0.4 + seededRand(i * 23 + 4) * 0.6,
        dx: `${(seededRand(i * 29 + 5) * 2 - 1) * 70}px`,
        dy: `${(seededRand(i * 31 + 6) * 2 - 1) * 70}px`,
        dur: 10 + seededRand(i * 37 + 7) * 14,
        delay: seededRand(i * 41 + 8) * 8,
      })),
    [count]
  );

  if (!mounted) return null;

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
