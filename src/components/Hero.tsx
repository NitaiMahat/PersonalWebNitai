"use client";

import {
  motion,
  useAnimate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.13, delayChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const menu = [
  { label: "About Me", href: "#about", n: "01" },
  { label: "Experiences", href: "#experience", n: "02" },
  { label: "Projects", href: "#projects", n: "03" },
  { label: "Contact Me", href: "#contact", n: "04" },
];

const menuVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

function seededRandHero(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

// A drifting particle aura that spills out around the label (not boxed in).
function ParticleAura() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const dots = useMemo(() => {
    const palette = [
      "rgba(255,255,255,",
      "rgba(199,125,255,",
      "rgba(157,78,221,",
      "rgba(123,47,247,",
    ];
    return Array.from({ length: 18 }).map((_, i) => {
      const c = palette[Math.floor(seededRandHero(i * 7 + 1) * palette.length)];
      return {
        left: seededRandHero(i * 11 + 2) * 100,
        top: seededRandHero(i * 13 + 3) * 100,
        size: 2 + seededRandHero(i * 17 + 4) * 3,
        color: c + (0.5 + seededRandHero(i * 19 + 5) * 0.45) + ")",
        dx: `${(seededRandHero(i * 23 + 6) * 2 - 1) * 18}px`,
        dy: `${(seededRandHero(i * 29 + 7) * 2 - 1) * 18}px`,
        op: 0.45 + seededRandHero(i * 31 + 8) * 0.5,
        dur: 4 + seededRandHero(i * 37 + 9) * 5,
        delay: seededRandHero(i * 41 + 10) * 4,
      };
    });
  }, []);

  if (!mounted)
    return <div className="pointer-events-none absolute -inset-5 z-0" />;

  return (
    <div className="pointer-events-none absolute -inset-5 z-0">
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
              boxShadow: `0 0 6px ${d.color}`,
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

function ParticleNavItem({
  label,
  n,
  href,
  index,
}: {
  label: string;
  n: string;
  href: string;
  index: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
        },
      }}
    >
      <motion.a
        href={href}
        data-cursor="view"
        className="pointer-events-auto group relative flex items-center gap-2 sm:gap-2.5 rounded-full px-4 py-2 sm:px-6 sm:py-3"
        animate={reduce ? undefined : { y: [0, -7, 0] }}
        transition={{
          duration: 4 + index * 0.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: index * 0.3,
        }}
        whileHover={{ scale: 1.07 }}
      >
        {/* soft galactic glow — strengthens on hover */}
        <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(157,78,221,0.28),transparent_70%)] opacity-60 blur-md transition-opacity duration-300 group-hover:opacity-100" />
        {/* the particle aura itself */}
        <ParticleAura />

        <span className="relative z-10 font-display text-[0.65rem] sm:text-xs text-accent-soft/70">
          {n}
        </span>
        <span className="relative z-10 whitespace-nowrap font-display text-xs sm:text-sm md:text-base font-medium text-foreground/90 transition-colors duration-300 group-hover:text-white">
          {label}
        </span>
      </motion.a>
    </motion.div>
  );
}

export default function Hero({ start }: { start: boolean }) {
  const [imgFailed, setImgFailed] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const reduce = useReducedMotion();

  // Cursor-driven tilt for the figure (same "alive with the screen" feel as
  // the galaxy). Maps pointer position to a gentle 3D rotation.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [14, -14]), {
    stiffness: 120,
    damping: 18,
  });
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [-12, 12]), {
    stiffness: 120,
    damping: 18,
  });

  useEffect(() => {
    if (reduce) return;
    const onMove = (e: MouseEvent) => {
      px.set(e.clientX / window.innerWidth - 0.5);
      py.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [px, py, reduce]);

  // ---- Drag-to-slot mini feature ----
  const [scope, animate] = useAnimate();
  const bandRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLImageElement>(null);
  const rightRef = useRef<HTMLImageElement>(null);

  // Centre X of an element, or null if it's hidden (e.g. on small screens).
  const centerOf = (el: HTMLElement | null) => {
    if (!el || el.offsetParent === null) return null;
    const r = el.getBoundingClientRect();
    return r.left + r.width / 2;
  };

  // On release, snap the character to whichever slot (left / centre / right)
  // its centre is nearest to — measured live, so it lands exactly on the slot.
  const snapToNearest = () => {
    const el = scope.current as HTMLElement | null;
    const band = bandRef.current;
    if (!el || !band) return;

    const r = el.getBoundingClientRect();
    const charCenter = r.left + r.width / 2;
    const bandRect = band.getBoundingClientRect();
    const homeCenter = bandRect.left + bandRect.width / 2;

    const targets = [homeCenter, centerOf(leftRef.current), centerOf(rightRef.current)].filter(
      (v): v is number => v !== null
    );

    let nearest = homeCenter;
    for (const t of targets) {
      if (Math.abs(t - charCenter) < Math.abs(nearest - charCenter)) nearest = t;
    }

    animate(
      el,
      { x: nearest - homeCenter, y: 0 },
      { type: "spring", stiffness: 350, damping: 30 }
    );
  };

  // Once the hero has settled, fade the particle menu in (figure stays put).
  useEffect(() => {
    if (!start) return;
    const t = setTimeout(() => setExpanded(true), reduce ? 200 : 1200);
    return () => clearTimeout(t);
  }, [start, reduce]);

  return (
    <header className="pointer-events-none relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-4 sm:px-6 pb-20 pt-16 sm:pt-8 text-center">
      {/* Top bar */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between px-[clamp(1.25rem,5vw,4rem)] py-5 sm:py-6">
        <span className="pointer-events-auto font-display text-lg sm:text-xl font-bold tracking-[0.1em]">
          NM
        </span>
      </div>

      {/* Centered hero column */}
      <motion.div
        className="pointer-events-none relative z-10 flex max-w-3xl flex-col items-center text-center"
        variants={container}
        initial="hidden"
        animate={start ? "show" : "hidden"}
      >
        <motion.p
          variants={item}
          className="mb-4 sm:mb-6 text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.25em] text-accent-soft"
        >
          Welcome to my portfolio
        </motion.p>

        {/* Drag-me game: drag the character onto a gray outline to lock it in.
            Slots show on large screens (they need horizontal room). */}
        <motion.div
          ref={bandRef}
          variants={item}
          className="relative z-10 flex w-[min(96vw,1100px)] items-center justify-center"
        >
          {/* Left & right gray outline slots */}
          {!imgFailed && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={leftRef}
                src="/images/hero-cutout.png"
                alt=""
                aria-hidden
                draggable={false}
                className="pointer-events-none absolute left-[1%] top-1/2 hidden h-[clamp(240px,42vh,500px)] w-auto -translate-y-1/2 object-contain opacity-[0.15] lg:block"
                style={{ filter: "brightness(0) invert(1)" }}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={rightRef}
                src="/images/hero-cutout.png"
                alt=""
                aria-hidden
                draggable={false}
                className="pointer-events-none absolute right-[1%] top-1/2 hidden h-[clamp(240px,42vh,500px)] w-auto -translate-y-1/2 object-contain opacity-[0.15] lg:block"
                style={{ filter: "brightness(0) invert(1)" }}
              />
            </>
          )}

          {/* Draggable character */}
          <motion.a
            ref={scope}
            href="#about"
            aria-label="About Me"
            data-cursor="drag"
            drag
            dragConstraints={bandRef}
            dragElastic={0.15}
            dragMomentum={false}
            onDragEnd={snapToNearest}
            whileDrag={{ scale: 1.04 }}
            style={{ rotateX, rotateY, transformPerspective: 900 }}
            className="pointer-events-auto group relative z-10 cursor-grab touch-pan-y select-none active:cursor-grabbing"
          >
            {/* hover glow halo */}
            <span className="pointer-events-none absolute inset-0 -z-10 rounded-[45%] bg-[radial-gradient(circle_at_50%_45%,rgba(157,78,221,0.55),transparent_65%)] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

            {/* perpetual float on an inner element so it doesn't fight drag/tilt */}
            <motion.div
              animate={reduce ? undefined : { y: [0, -14, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="transition-transform duration-500 group-hover:scale-[1.03]"
            >
              {imgFailed ? (
                <div className="grid h-[clamp(220px,36vh,480px)] w-[min(260px,75vw)] place-items-center rounded-2xl border border-dashed border-accent-soft/50 bg-background-soft p-4 text-center text-xs sm:text-sm leading-relaxed text-muted">
                  Add your photo to
                  <br />
                  <code className="text-xs text-accent-soft">
                    public/images/hero-cutout.png
                  </code>
                </div>
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src="/images/hero-cutout.png"
                  alt="Nitai Mahat"
                  onError={() => setImgFailed(true)}
                  draggable={false}
                  className="h-[clamp(220px,36vh,480px)] w-auto object-contain drop-shadow-[0_30px_50px_rgba(0,0,0,0.55)]"
                />
              )}
              <div className="absolute -bottom-3 left-1/2 h-5 w-[55%] -translate-x-1/2 rounded-[50%] bg-black/60 blur-2xl" />
            </motion.div>

            {/* hint */}
            <span className="pointer-events-none absolute -bottom-2 left-1/2 -translate-x-1/2 translate-y-1/2 whitespace-nowrap rounded-full border border-white/15 bg-white/10 px-3 sm:px-4 py-1 sm:py-1.5 text-[0.65rem] sm:text-xs uppercase tracking-[0.2em] text-foreground/90 opacity-0 backdrop-blur-md transition-all duration-300 group-hover:translate-y-full group-hover:opacity-100">
              Drag me · click for About
            </span>
          </motion.a>
        </motion.div>

        {/* Name */}
        <motion.h1
          variants={item}
          className="-mt-2 sm:-mt-4 flex flex-col font-display text-[clamp(2rem,9.5vw,5.5rem)] font-bold leading-[0.92] tracking-[0.02em]"
        >
          <span className="text-gradient">NITAI</span>
          <span className="text-gradient">MAHAT</span>
        </motion.h1>
      </motion.div>

      {/* Particle-themed menu — centered row below */}
      <motion.nav
        className="pointer-events-none relative z-10 mt-8 sm:mt-12 flex flex-wrap items-center justify-center gap-x-3 gap-y-3 sm:gap-x-6 sm:gap-y-5 px-2"
        variants={menuVariants}
        initial="hidden"
        animate={expanded ? "show" : "hidden"}
      >
        {menu.map((m, i) => (
          <ParticleNavItem key={m.href} {...m} index={i} />
        ))}
      </motion.nav>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-4 sm:bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1.5 sm:gap-2.5 text-[0.65rem] sm:text-xs uppercase tracking-[0.2em] text-muted"
        initial={{ opacity: 0 }}
        animate={{ opacity: start ? 1 : 0 }}
        transition={{ delay: 1.3, duration: 0.8 }}
      >
        <span>Scroll</span>
        <motion.div
          className="h-8 sm:h-10 w-px bg-gradient-to-b from-accent-soft to-transparent"
          animate={{ scaleY: [0.6, 1, 0.6], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </header>
  );
}
