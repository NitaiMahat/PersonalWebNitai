"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState, useMemo } from "react";
import {
  projectFilters,
  projects,
  type Project,
  type ProjectFilter,
} from "@/data/projects";
import MeteorField3D from "@/components/MeteorField3D";

/* ── helpers ─────────────────────────────────────────────────────────── */

function projectMatchesFilter(project: Project, filter: ProjectFilter) {
  return filter === "All" || project.tags.includes(filter);
}

function getVisibleProjects(filter: ProjectFilter) {
  return projects.filter((project) => projectMatchesFilter(project, filter));
}

function seededRand(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

/* ── Pre-baked asteroid blob border-radius shapes ────────────────────── */
const ASTEROID_SHAPES = [
  "62% 38% 46% 54% / 60% 44% 56% 40%",
  "42% 58% 55% 45% / 38% 62% 48% 52%",
  "55% 45% 38% 62% / 52% 40% 60% 48%",
  "48% 52% 60% 40% / 44% 56% 42% 58%",
  "58% 42% 44% 56% / 55% 38% 62% 45%",
  "40% 60% 52% 48% / 58% 42% 45% 55%",
  "50% 50% 42% 58% / 62% 38% 50% 50%",
  "45% 55% 58% 42% / 48% 52% 55% 45%",
  "53% 47% 40% 60% / 42% 58% 52% 48%",
  "60% 40% 48% 52% / 50% 45% 55% 50%",
];

/* ── Background stars ────────────────────────────────────────────────── */

function DeepSpaceStars() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const stars = useMemo(
    () =>
      Array.from({ length: 180 }).map((_, i) => ({
        left: seededRand(i * 31) * 100,
        top: seededRand(i * 47) * 100,
        size: 0.4 + seededRand(i * 61) * 2.2,
        opacity: 0.1 + seededRand(i * 73) * 0.6,
        twinkleDur: 3 + seededRand(i * 89) * 7,
        twinkleDelay: seededRand(i * 97) * 6,
      })),
    []
  );

  if (!mounted) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {stars.map((s, i) => (
        <span
          key={i}
          className="star-twinkle absolute rounded-full bg-white"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            opacity: s.opacity,
            animationDuration: `${s.twinkleDur}s`,
            animationDelay: `${s.twinkleDelay}s`,
            boxShadow:
              s.size > 1.5
                ? `0 0 ${s.size * 4}px rgba(255,255,255,0.6)`
                : undefined,
          }}
        />
      ))}
    </div>
  );
}

/* ── Shooting stars ──────────────────────────────────────────────────── */

function ShootingStars() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const shooters = useMemo(
    () =>
      Array.from({ length: 4 }).map((_, i) => ({
        top: 5 + seededRand(i * 137) * 45,
        left: 10 + seededRand(i * 211) * 55,
        delay: i * 8 + seededRand(i * 311) * 5,
        duration: 1.2 + seededRand(i * 419) * 0.8,
      })),
    []
  );

  if (!mounted) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {shooters.map((s, i) => (
        <div
          key={i}
          className="shooting-star absolute"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ── Nebula fog ──────────────────────────────────────────────────────── */

function NebulaFog() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="nebula-drift absolute -left-[15%] top-[5%] h-[65vmin] w-[85vmin] rounded-full bg-[radial-gradient(circle,rgba(30,60,120,0.08),transparent_55%)] blur-3xl" />
      <div className="nebula-drift-reverse absolute -right-[10%] top-[35%] h-[55vmin] w-[75vmin] rounded-full bg-[radial-gradient(circle,rgba(80,40,120,0.06),transparent_50%)] blur-3xl" />
      <div className="nebula-drift absolute left-[20%] bottom-[0%] h-[45vmin] w-[65vmin] rounded-full bg-[radial-gradient(circle,rgba(40,80,100,0.05),transparent_50%)] blur-3xl" />
      {/* Central warm glow like the reference comet area */}
      <div className="absolute left-[35%] top-[30%] h-[40vmin] w-[30vmin] rounded-full bg-[radial-gradient(circle,rgba(255,200,100,0.04),transparent_60%)] blur-3xl" />
    </div>
  );
}

/* ── Central comet decoration ────────────────────────────────────────── */

function CentralComet() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Comet head */}
      <div
        className="absolute"
        style={{
          left: "42%",
          top: "38%",
          width: 90,
          height: 70,
          borderRadius: "55% 45% 50% 50% / 60% 50% 50% 40%",
          background: `
            radial-gradient(ellipse 70% 60% at 40% 35%, rgba(255,240,200,0.35), transparent 60%),
            radial-gradient(ellipse 100% 100% at 50% 50%, rgba(200,180,140,0.2), rgba(100,90,70,0.15))
          `,
          boxShadow: "0 0 50px rgba(255,220,150,0.12), 0 0 100px rgba(255,200,100,0.06)",
          transform: "rotate(-25deg)",
        }}
      />
      {/* Comet tail */}
      <div
        className="absolute"
        style={{
          left: "46%",
          top: "34%",
          width: 280,
          height: 4,
          background: "linear-gradient(to right, rgba(255,230,160,0.2), rgba(255,200,100,0.08), transparent)",
          transform: "rotate(-32deg)",
          borderRadius: "0 999px 999px 0",
          filter: "blur(3px)",
        }}
      />
      <div
        className="absolute"
        style={{
          left: "47%",
          top: "36%",
          width: 200,
          height: 2,
          background: "linear-gradient(to right, rgba(255,240,200,0.15), rgba(255,200,100,0.04), transparent)",
          transform: "rotate(-28deg)",
          borderRadius: "0 999px 999px 0",
          filter: "blur(1px)",
        }}
      />
    </div>
  );
}

/* ── Scroll to explore indicator ─────────────────────────────────────── */

function ScrollIndicator() {
  return (
    <motion.div
      className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 1.5, duration: 1 }}
    >
      {/* Animated scroll circle */}
      <div className="relative h-8 w-5 rounded-full border border-white/20">
        <motion.div
          className="absolute left-1/2 top-1.5 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-white/50"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <span className="text-[0.68rem] tracking-[0.2em] text-white/30">
        Scroll to explore
      </span>
    </motion.div>
  );
}

/* ── Main section ────────────────────────────────────────────────────── */

export default function ProjectsSection() {
  const [activeFilter, setActiveFilter] = useState<ProjectFilter>("All");
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const visibleProjects = getVisibleProjects(activeFilter);
  const activeProject =
    visibleProjects.find((project) => project.slug === activeSlug) ?? null;

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setActiveSlug(null);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    if (activeSlug && !visibleProjects.some((p) => p.slug === activeSlug)) {
      setActiveSlug(null);
    }
  }, [activeSlug, visibleProjects]);

  return (
    <section
      id="projects"
      className="relative overflow-hidden bg-[#050510]"
      style={{ minHeight: "100vh" }}
    >
      {/* ── Deep space background layers ─── */}
      <DeepSpaceStars />
      <ShootingStars />
      <NebulaFog />
      <CentralComet />

      {/* Vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_60%_at_50%_45%,transparent_30%,rgba(5,5,16,0.9)_100%)]" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-[1400px] px-4 py-16 md:px-8 md:py-20">
        {/* ── Header — minimal, blends into space ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.7 }}
          className="mb-6"
        >
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-[#8be9ff]/50">
            Mission Log
          </p>
          <h2
            className="mt-2 font-display text-3xl font-bold text-white/90 md:text-5xl"
            style={{ textShadow: "0 4px 30px rgba(0,0,0,0.6)" }}
          >
            Projects drifting through the cosmos
          </h2>

          {/* ── Filters ─── */}
          <div className="mt-6 flex flex-wrap gap-2">
            {projectFilters.map((filter) => {
              const active = filter === activeFilter;
              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`rounded-full px-3.5 py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.2em] transition-all duration-300 ${
                    active
                      ? "bg-white/[0.08] text-[#c8eeff] shadow-[0_0_16px_rgba(101,214,255,0.1)]"
                      : "text-white/30 hover:bg-white/[0.03] hover:text-white/50"
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* ── 3D meteor field ─── */}
        <MeteorField3D
          projects={visibleProjects}
          selectedSlug={activeSlug}
          onSelect={setActiveSlug}
        />

        <ScrollIndicator />
      </div>

      {/* ── Detail modal ─── */}
      <AnimatePresence>
        {activeProject && (
          <motion.div
            className="fixed inset-0 z-[120] flex items-center justify-center px-4 py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setActiveSlug(null)}
          >
            <motion.div
              className="absolute inset-0 bg-[#050510]/80 backdrop-blur-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              key={activeProject.slug}
              initial={{ opacity: 0, y: 40, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-[28px] border border-white/[0.06] bg-[#0a0a18]/95 shadow-[0_0_80px_rgba(0,0,0,0.6)] backdrop-blur-2xl"
            >
              {/* Top accent glow line */}
              <div
                className="absolute inset-x-0 top-0 h-[2px] rounded-t-[28px]"
                style={{
                  background: `linear-gradient(90deg, transparent, ${activeProject.accent}88, transparent)`,
                }}
              />

              {/* Ambient glows */}
              <div
                className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full blur-[80px]"
                style={{ background: `${activeProject.accent}15` }}
              />

              {/* Mini stars */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[28px] opacity-40">
                {[...Array(6)].map((_, i) => (
                  <span
                    key={i}
                    className="star-twinkle absolute rounded-full bg-white"
                    style={{
                      width: 1 + seededRand(i * 71) * 1,
                      height: 1 + seededRand(i * 71) * 1,
                      left: `${seededRand(i * 83) * 100}%`,
                      top: `${seededRand(i * 97) * 100}%`,
                      opacity: 0.3 + seededRand(i * 101) * 0.4,
                      animationDuration: `${3 + seededRand(i * 113) * 5}s`,
                    }}
                  />
                ))}
              </div>

              <div className="relative p-6 md:p-8">
                {/* Header with asteroid */}
                <div className="flex items-start gap-5">
                  {/* Mini asteroid in modal */}
                  <div
                    className="mt-1 h-14 w-14 shrink-0"
                    style={{
                      borderRadius: ASTEROID_SHAPES[projects.indexOf(activeProject) % ASTEROID_SHAPES.length],
                      background: `
                        radial-gradient(ellipse 90% 80% at 30% 25%, rgba(180,175,160,0.35), transparent 60%),
                        radial-gradient(ellipse 100% 100% at 50% 50%, rgba(60,58,52,0.9), rgba(35,33,30,1))
                      `,
                      boxShadow: `inset -4px -3px 10px rgba(0,0,0,0.6), inset 2px 2px 6px rgba(200,195,180,0.1), 0 0 20px ${activeProject.accent}20`,
                    }}
                  />
                  <div className="flex-1">
                    <p
                      className="text-[0.65rem] font-bold uppercase tracking-[0.3em]"
                      style={{ color: activeProject.accent }}
                    >
                      {activeProject.status}
                    </p>
                    <h3 className="mt-2 font-display text-2xl font-bold text-white md:text-3xl">
                      {activeProject.name}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-white/55 md:text-base">
                      {activeProject.summary}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveSlug(null)}
                    className="group/close shrink-0 rounded-full p-2 text-white/30 transition-colors hover:text-white/60"
                    aria-label="Close"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Highlights — no bordered box, just subtle section */}
                <div className="mt-8">
                  <p className="text-[0.6rem] uppercase tracking-[0.3em] text-white/25">
                    Key highlights
                  </p>
                  <ul className="mt-4 space-y-3">
                    {activeProject.highlights.map((highlight) => (
                      <li key={highlight} className="flex gap-3 text-sm leading-7 text-white/55">
                        <span
                          className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{
                            background: activeProject.accent,
                            boxShadow: `0 0 8px ${activeProject.accent}66`,
                          }}
                        />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Divider — very subtle */}
                <div className="my-6 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

                {/* Tech stack — just text, no boxes */}
                <div>
                  <p className="text-[0.6rem] uppercase tracking-[0.3em] text-white/25">
                    Tech stack
                  </p>
                  <p className="mt-3 text-[0.75rem] leading-relaxed tracking-wide text-white/40">
                    {activeProject.tech.join(" · ")}
                  </p>
                </div>

                {/* Close */}
                <div className="mt-8">
                  <button
                    type="button"
                    onClick={() => setActiveSlug(null)}
                    className="text-[0.65rem] uppercase tracking-[0.25em] text-white/25 transition-colors hover:text-white/50"
                  >
                    ← Back to cosmos
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
