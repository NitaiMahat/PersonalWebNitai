"use client";

import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

const NAME = "NITAI MAHAT";

export default function Intro({ onDone }: { onDone: () => void }) {
  const [show, setShow] = useState(true);
  const reduce = useReducedMotion();

  useEffect(() => {
    const t = setTimeout(() => setShow(false), reduce ? 200 : 2300);
    return () => clearTimeout(t);
  }, [reduce]);

  return (
    <AnimatePresence onExitComplete={onDone}>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-background"
          exit={{ opacity: 0, y: -40, scale: 1.03 }}
          transition={{ duration: 0.9, ease: [0.7, 0, 0.2, 1] }}
        >
          <div className="flex font-display text-[clamp(1.8rem,8vw,5rem)] font-bold tracking-[0.15em]">
            {NAME.split("").map((char, i) => (
              <motion.span
                key={i}
                className="inline-block"
                style={{ width: char === " " ? "0.4em" : undefined }}
                initial={{ opacity: 0, y: "120%", rotate: 8 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{
                  delay: reduce ? 0 : 0.1 + i * 0.06,
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {char === " " ? " " : char}
              </motion.span>
            ))}
          </div>

          <div className="h-0.5 w-[min(280px,60vw)] overflow-hidden rounded bg-white/10">
            <motion.div
              className="h-full rounded bg-gradient-to-r from-accent to-accent-soft"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{
                delay: 0.4,
                duration: reduce ? 0.2 : 1.6,
                ease: [0.65, 0, 0.35, 1],
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
