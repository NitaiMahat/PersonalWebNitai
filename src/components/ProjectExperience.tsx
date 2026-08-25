"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { projectFilters, projects, type ProjectFilter } from "@/data/projects";

export default function ProjectExperience() {
  const [activeFilter, setActiveFilter] = useState<ProjectFilter>("All");

  const visibleProjects = useMemo(() => {
    if (activeFilter === "All") {
      return projects;
    }

    return projects.filter((project) => project.tags.includes(activeFilter));
  }, [activeFilter]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f3efe6] px-3 sm:px-4 py-14 sm:py-20 text-[#1f2937] md:px-6 md:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.16),transparent_22%),radial-gradient(circle_at_85%_12%,rgba(249,115,22,0.12),transparent_18%),linear-gradient(180deg,#f8f3ea_0%,#efe8db_38%,#f5f1e8_100%)]" />
      <div className="absolute left-6 top-8 h-24 w-24 rounded-full border border-[#0f3d4c]/10" />
      <div className="absolute bottom-10 right-6 h-36 w-36 rounded-full border border-[#0f3d4c]/10" />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="grid gap-6 sm:gap-8 xl:grid-cols-[320px_minmax(0,1fr)]"
        >
          <aside className="xl:sticky xl:top-8 xl:self-start">
            <Link
              href="/#projects"
              className="inline-flex rounded-full border border-[#0f3d4c]/15 bg-white/70 px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#0f3d4c] backdrop-blur-sm transition-colors hover:border-[#0f3d4c]/35 hover:bg-white"
            >
              Back home
            </Link>

            <p className="mt-6 sm:mt-8 text-[0.7rem] sm:text-xs font-semibold uppercase tracking-[0.32em] text-[#0f766e]">
              Full project atlas
            </p>
            <h1 className="mt-2 sm:mt-3 font-display text-2xl sm:text-4xl font-bold text-[#102a43] md:text-5xl">
              Explore the work without unlocking anything.
            </h1>
            <p className="mt-3 sm:mt-4 text-xs sm:text-sm leading-6 sm:leading-7 text-[#334e68]">
              This page keeps the creative feel, but the projects are immediately
              accessible. Filter by stack, scan the highlights, and jump to what
              matters fastest.
            </p>

            <div className="mt-6 sm:mt-8 grid grid-cols-3 gap-2 sm:gap-3 text-center">
              <div className="rounded-2xl border border-[#0f3d4c]/10 bg-white/70 p-3 sm:p-4">
                <p className="text-[0.65rem] sm:text-[0.7rem] uppercase tracking-[0.18em] text-[#486581]">
                  Projects
                </p>
                <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-semibold text-[#102a43]">
                  {projects.length}
                </p>
              </div>
              <div className="rounded-2xl border border-[#0f3d4c]/10 bg-white/70 p-3 sm:p-4">
                <p className="text-[0.65rem] sm:text-[0.7rem] uppercase tracking-[0.18em] text-[#486581]">
                  Categories
                </p>
                <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-semibold text-[#102a43]">8</p>
              </div>
              <div className="rounded-2xl border border-[#0f3d4c]/10 bg-white/70 p-3 sm:p-4">
                <p className="text-[0.65rem] sm:text-[0.7rem] uppercase tracking-[0.18em] text-[#486581]">
                  Live
                </p>
                <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-semibold text-[#102a43]">
                  {projects.filter((project) => project.status === "Live").length}
                </p>
              </div>
            </div>

            <div className="mt-6 sm:mt-8 flex flex-wrap gap-1.5 sm:gap-2 xl:max-w-[18rem]">
              {projectFilters.map((filter) => {
                const active = filter === activeFilter;

                return (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveFilter(filter)}
                    className={`rounded-full border px-3 sm:px-4 py-1.5 sm:py-2 text-[0.68rem] sm:text-xs font-semibold uppercase tracking-[0.16em] transition-colors ${
                      active
                        ? "border-[#0f766e]/40 bg-[#0f766e]/10 text-[#0f766e]"
                        : "border-[#0f3d4c]/10 bg-white/65 text-[#486581] hover:border-[#0f3d4c]/25 hover:text-[#102a43]"
                    }`}
                  >
                    {filter}
                  </button>
                );
              })}
            </div>
          </aside>

          <section className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2">
            {visibleProjects.map((project, index) => (
              <motion.article
                key={project.slug}
                id={project.slug}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.03 }}
                className="relative overflow-hidden rounded-[22px] sm:rounded-[30px] border border-[#0f3d4c]/10 bg-white/78 p-4 sm:p-6 shadow-[0_22px_60px_rgba(15,61,76,0.08)] backdrop-blur-sm"
              >
                <div
                  className="absolute inset-x-0 top-0 h-1.5"
                  style={{ background: project.accent }}
                />
                <div
                  className="absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-70 blur-3xl"
                  style={{ background: `${project.accent}25` }}
                />

                <div className="relative">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p
                        className="text-[0.65rem] sm:text-[0.7rem] font-semibold uppercase tracking-[0.24em]"
                        style={{ color: project.accent }}
                      >
                        {project.status}
                      </p>
                      <h2 className="mt-1.5 sm:mt-2 font-display text-xl sm:text-2xl font-bold text-[#102a43]">
                        {project.name}
                      </h2>
                      <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-[#486581]">{project.tagline}</p>
                    </div>
                    <span
                      className="mt-1 h-3.5 w-3.5 rotate-45 rounded-[2px]"
                      style={{ background: project.accent }}
                    />
                  </div>

                  <p className="mt-4 sm:mt-5 text-xs sm:text-sm leading-6 sm:leading-7 text-[#334e68]">
                    {project.summary}
                  </p>

                  <ul className="mt-4 sm:mt-5 space-y-2 sm:space-y-3 text-xs sm:text-sm leading-5 sm:leading-6 text-[#243b53]">
                    {project.highlights.map((highlight) => (
                      <li key={highlight} className="flex gap-2.5 sm:gap-3">
                        <span
                          className="mt-1.5 sm:mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ background: project.accent }}
                        />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 sm:mt-5 flex flex-wrap gap-1.5 sm:gap-2">
                    {project.tech.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-[#0f3d4c]/10 bg-[#f8fbfc] px-2.5 sm:px-3 py-0.5 sm:py-1 text-[0.65rem] sm:text-[0.7rem] font-medium uppercase tracking-[0.14em] text-[#486581]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 sm:mt-6 border-t border-[#0f3d4c]/10 pt-3 sm:pt-4 text-[0.68rem] sm:text-xs uppercase tracking-[0.18em] text-[#486581]">
                    {project.tags.join(" / ")}
                  </div>
                </div>
              </motion.article>
            ))}
          </section>
        </motion.div>
      </div>
    </main>
  );
}
