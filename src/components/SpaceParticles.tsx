"use client";

import { useEffect, useMemo, useState } from "react";

/** White particles drifting across a dark backdrop. Client-only (uses
 *  Math.random) to avoid hydration mismatch. Shared by About & Experience. */
export default function SpaceParticles({ count = 60 }: { count?: number }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const dots = useMemo(
    () =>
      Array.from({ length: count }).map(() => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 1 + Math.random() * 2.5,
        op: 0.4 + Math.random() * 0.6,
        dx: `${(Math.random() * 2 - 1) * 70}px`,
        dy: `${(Math.random() * 2 - 1) * 70}px`,
        dur: 10 + Math.random() * 14,
        delay: Math.random() * 8,
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
