"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";

/**
 * A bespoke crosshair cursor: a small exact dot + a lagging ring that grows and
 * shows a label when hovering interactive elements. Add a `data-cursor="word"`
 * attribute to any element to set the label; links/buttons grow automatically.
 * Only enabled for fine pointers (mouse) — untouched on touch devices.
 */
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);
  const [label, setLabel] = useState("");

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.5 });
  const ry = useSpring(y, { stiffness: 500, damping: 40, mass: 0.5 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    document.documentElement.classList.add("custom-cursor");

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target as Element | null;
      const el = target?.closest?.("a,button,[data-cursor]");
      setActive(!!el);
      setLabel(el?.getAttribute("data-cursor") ?? "");
    };

    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.classList.remove("custom-cursor");
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      {/* exact inner dot */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9999]"
        style={{ x, y }}
      >
        <div className="h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white mix-blend-difference" />
      </motion.div>

      {/* lagging ring */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9999]"
        style={{ x: rx, y: ry }}
      >
        <motion.div
          className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white mix-blend-difference"
          animate={{
            width: active ? (label ? 72 : 56) : 28,
            height: active ? (label ? 72 : 56) : 28,
            opacity: active ? 1 : 0.6,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          {label && (
            <span className="select-none text-[0.55rem] font-medium uppercase tracking-[0.18em] text-white">
              {label}
            </span>
          )}
        </motion.div>
      </motion.div>
    </>
  );
}
