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

/* ── Deep Space Stars ────────────────────────────────────────────────── */
function DeepSpaceStars() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const stars = useMemo(
    () =>
      Array.from({ length: 180 }).map((_, i) => ({
        left: seededRand(i * 31) * 100,
        top: seededRand(i * 47) * 100,
        size: 0.5 + seededRand(i * 61) * 2.2,
        opacity: 0.15 + seededRand(i * 73) * 0.65,
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
              s.size > 1.6
                ? `0 0 ${s.size * 4}px rgba(255,255,255,0.7)`
                : undefined,
          }}
        />
      ))}
    </div>
  );
}

/* ── Glowing Nebula Clouds ───────────────────────────────────────────── */
function NebulaFog() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Top Right Orange/Pink Glow */}
      <div className="absolute -right-[10%] -top-[10%] h-[60vmin] w-[70vmin] rounded-full bg-[radial-gradient(circle,rgba(244,114,182,0.12),rgba(249,115,22,0.08),transparent_65%)] blur-3xl" />
      {/* Top Left Teal Glow */}
      <div className="absolute -left-[10%] -top-[10%] h-[55vmin] w-[65vmin] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.14),rgba(14,165,233,0.06),transparent_65%)] blur-3xl" />
      {/* Bottom Center Blue/Purple Fog */}
      <div className="absolute left-[25%] -bottom-[15%] h-[50vmin] w-[60vmin] rounded-full bg-[radial-gradient(circle,rgba(129,140,248,0.1),rgba(168,85,247,0.05),transparent_60%)] blur-3xl" />
    </div>
  );
}

/* ── Main Section ────────────────────────────────────────────────────── */
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
      className="relative overflow-hidden bg-[#04040a]"
      style={{ minHeight: "100vh" }}
    >
      {/* Background Starfield & Colored Nebulae */}
      <DeepSpaceStars />
      <NebulaFog />

      {/* Radial Vignette Mask */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_65%_at_50%_45%,transparent_25%,rgba(4,4,10,0.92)_100%)]" />

      {/* Main Content */}
      <div className="relative z-10 mx-auto max-w-[1440px] px-3 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.7 }}
          className="mb-2 sm:mb-4"
        >
          <p className="text-[0.6rem] sm:text-[0.65rem] font-bold uppercase tracking-[0.45em] text-cyan-400/80">
            Mission Log
          </p>
          <h2
            className="mt-1 font-display text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white"
            style={{ textShadow: "0 4px 30px rgba(0,0,0,0.7)" }}
          >
            Projects drifting through the cosmos
          </h2>

          {/* Swipeable Filter Pills on Mobile */}
          <div className="mt-4 sm:mt-5 flex flex-nowrap overflow-x-auto pb-2 pt-1 gap-2 scrollbar-none sm:flex-wrap">
            {projectFilters.map((filter) => {
              const active = filter === activeFilter;
              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`shrink-0 rounded-full px-3.5 sm:px-4 py-1 sm:py-1.5 text-[0.58rem] sm:text-[0.62rem] font-bold uppercase tracking-[0.2em] transition-all duration-300 ${
                    active
                      ? "border border-cyan-400/40 bg-cyan-500/15 text-cyan-200 shadow-[0_0_20px_rgba(6,182,212,0.25)]"
                      : "border border-white/5 bg-white/[0.02] text-slate-400 hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* 3D Solar System Scene Canvas */}
        <MeteorField3D
          projects={visibleProjects}
          selectedSlug={activeSlug}
          onSelect={setActiveSlug}
        />
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {activeProject && (
          <motion.div
            className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 md:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setActiveSlug(null)}
          >
            <motion.div
              className="absolute inset-0 bg-[#04040a]/80 backdrop-blur-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              key={activeProject.slug}
              initial={{ opacity: 0, y: 35, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-[95vw] sm:w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-[24px] sm:rounded-[28px] border border-cyan-500/30 bg-slate-950/95 p-5 sm:p-6 md:p-8 shadow-[0_0_80px_rgba(6,182,212,0.25)] backdrop-blur-2xl"
            >
              {/* Top Accent Line */}
              <div
                className="absolute inset-x-0 top-0 h-[2px] rounded-t-[28px]"
                style={{
                  background: `linear-gradient(90deg, transparent, ${activeProject.accent}, transparent)`,
                }}
              />

              <div className="relative">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span
                      className="text-[0.6rem] sm:text-[0.65rem] font-bold uppercase tracking-[0.32em]"
                      style={{ color: activeProject.accent }}
                    >
                      {activeProject.status}
                    </span>
                    <h3 className="mt-1 font-display text-xl sm:text-2xl md:text-3xl font-bold text-white">
                      {activeProject.name}
                    </h3>
                    <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm leading-relaxed text-slate-300">
                      {activeProject.summary}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveSlug(null)}
                    className="shrink-0 rounded-full border border-white/10 bg-white/5 p-2 text-slate-400 hover:border-white/30 hover:text-white"
                  >
                    <svg className="h-4 sm:h-5 w-4 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Highlights */}
                <div className="mt-5 sm:mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-5">
                  <p className="text-[0.58rem] sm:text-[0.6rem] font-bold uppercase tracking-[0.3em] text-cyan-400">
                    Key Highlights
                  </p>
                  <ul className="mt-2.5 sm:mt-3 space-y-2 sm:space-y-2.5">
                    {activeProject.highlights.map((h) => (
                      <li key={h} className="flex gap-2.5 text-xs leading-relaxed text-slate-300">
                        <span
                          className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ background: activeProject.accent }}
                        />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tech Stack Badges */}
                <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-5">
                  <p className="text-[0.58rem] sm:text-[0.6rem] font-bold uppercase tracking-[0.3em] text-cyan-400">
                    Technologies Used
                  </p>
                  <div className="mt-2.5 sm:mt-3 flex flex-wrap gap-1.5 sm:gap-2">
                    {activeProject.tech.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-cyan-500/20 bg-cyan-950/40 px-2.5 sm:px-3 py-0.5 sm:py-1 text-[0.6rem] sm:text-[0.65rem] font-medium uppercase tracking-wider text-cyan-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Close Button */}
                <div className="mt-5 sm:mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setActiveSlug(null)}
                    className="rounded-full border border-white/15 bg-white/5 px-4 sm:px-5 py-1.5 sm:py-2 text-xs font-semibold uppercase tracking-wider text-slate-300 hover:border-white/30 hover:text-white"
                  >
                    Close
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
