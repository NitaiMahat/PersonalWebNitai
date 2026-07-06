"use client";

import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import SpaceParticles from "@/components/SpaceParticles";

type Exp = {
  x: number;
  y: number;
  role: string;
  org: string;
  location: string;
  period: string;
  color: string;
  bullets: string[];
  icon: React.ReactNode;
};

const I = (paths: React.ReactNode) => (
  <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
    {paths}
  </svg>
);

// Ordered oldest → newest so the pipe traces the timeline.
const exps: Exp[] = [
  {
    x: 9, y: 64, color: "#2dd4bf",
    role: "Desktop Application Intern",
    org: "Banglamukhi Enterprises",
    location: "Kathmandu, Nepal · Remote",
    period: "Aug 2023 – Nov 2023",
    icon: I(<><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M3 17h18M9 21h6" /><path d="M7 12l3-3 2 2 3-4" /></>),
    bullets: [
      "Built a custom expense tracker in Python (Tkinter + SQL) with to-do lists, printable reports, and visualization dashboards.",
      "Cut monthly expenses 10% by surfacing hidden costs in operations and utilities.",
    ],
  },
  {
    x: 22.5, y: 38, color: "#2fd27a",
    role: "Web Development Intern",
    org: "GreenApple Consultancy",
    location: "Remote",
    period: "Apr 2024 – Aug 2024",
    icon: I(<><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18M8 14h6" /></>),
    bullets: [
      "Refactored a legacy React frontend and optimized Node.js APIs, increasing user retention by 25%.",
      "Reduced average API response time by 30% with response caching and batched database queries.",
    ],
  },
  {
    x: 36, y: 64, color: "#ff6a2b",
    role: "Software Development Intern",
    org: "Attention.ad",
    location: "Dover, USA",
    period: "Jun 2025 – Aug 2025",
    icon: I(<><path d="M8 9l-3 3 3 3" /><path d="M16 9l3 3-3 3" /><path d="M13 6l-2 12" /></>),
    bullets: [
      "Built full-stack React/Node.js features backed by PostgreSQL, increasing user engagement by 25% while supporting 500+ daily transactions at 99.9% uptime.",
      "Reduced failed transaction confirmations by 40% using idempotent transaction flows with exponential backoff retries for reliable payment processing under network latency.",
    ],
  },
  {
    x: 49.5, y: 38, color: "#38bdf8",
    role: "Braven Fellow",
    org: "Braven",
    location: "Remote",
    period: "Sep 2025 – Dec 2025",
    icon: I(<><path d="M22 2L11 13" /><path d="M22 2l-7 20-4-9-9-4 20-7z" /></>),
    bullets: [
      "Collaborated with United Airlines to design a web solution promoting aviation careers for middle school students.",
      "Coordinated a multidisciplinary team, keeping research, design, and feedback connected and organized.",
    ],
  },
  {
    x: 63, y: 64, color: "#ec4899",
    role: "Career Prep Fellow (Top 2.3% Selected)",
    org: "Uber",
    location: "Remote · Part-time",
    period: "Jan 2026 – Jun 2026",
    icon: I(<><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" /></>),
    bullets: [
      "Selected for Uber's engineering development program, completing 40+ hours of technical interview preparation, mentorship, and coaching with Uber software engineers.",
      "Completed regular mock interviews on data structures and algorithms with practicing engineers.",
    ],
  },
  {
    x: 76.5, y: 38, color: "#9d4edd",
    role: "Research Assistant · AI for Agent-Based Model Analysis",
    org: "Augustana College",
    location: "Rock Island, IL · Prof. Forrest Stonedahl",
    period: "Feb 2026 – May 2026",
    icon: I(<><path d="M22 9L12 4 2 9l10 5 10-5z" /><path d="M6 11v5c0 1 3 3 6 3s6-2 6-3v-5" /></>),
    bullets: [
      "Developed multimodal LLM pipelines with Gemini to classify emergent behaviors in NetLogo simulation videos, automating large-scale analysis through few-shot prompting and Python workflows.",
      "Co-authored a 2026 NetLogo Conference paper showing lightweight frame-based prompting reached 84.6% accuracy, outperforming full-video classification (66.7%) while reducing API cost and token usage.",
    ],
  },
  {
    x: 90, y: 64, color: "#f59e0b",
    role: "Undergraduate Research Assistant · AI for Hyperacusis Therapy",
    org: "Augustana College",
    location: "Rock Island, IL · Dr. Ann Perreau",
    period: "Starting Fall 2026",
    icon: I(<><path d="M12 3v18" /><path d="M8 7v10" /><path d="M4 10v4" /><path d="M16 7v10" /><path d="M20 10v4" /></>),
    bullets: [
      "Developing Audalis, a Flutter-based application supporting AI-assisted hyperacusis therapy, testing, and clinical research.",
      "Collaborating with faculty to bring applied AI into hearing-therapy workflows for patients and clinicians.",
    ],
  },
];

function buildPipe(pts: { x: number; y: number }[], r = 26) {
  if (pts.length === 0) return "";
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    const midX = (a.x + b.x) / 2;
    const dirY = b.y > a.y ? 1 : -1;
    const rr = Math.min(r, Math.abs(b.x - a.x) / 2, Math.abs(b.y - a.y) / 2 || r);
    d +=
      ` L ${midX - rr} ${a.y}` +
      ` Q ${midX} ${a.y} ${midX} ${a.y + dirY * rr}` +
      ` L ${midX} ${b.y - dirY * rr}` +
      ` Q ${midX} ${b.y} ${midX + rr} ${b.y}` +
      ` L ${b.x} ${b.y}`;
  }
  return d;
}

export default function ExperienceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { margin: "-15%" });

  const [size, setSize] = useState({ w: 0, h: 0 });
  const [lit, setLit] = useState(0);
  const [active, setActive] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const played = useRef(false);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      setSize({ w: r.width, h: r.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const pts = useMemo(
    () => exps.map((e) => ({ x: (e.x / 100) * size.w, y: (e.y / 100) * size.h })),
    [size]
  );
  const pipeD = useMemo(() => buildPipe(pts), [pts]);

  useEffect(() => {
    if (!inView || played.current || size.w === 0) return;
    played.current = true;
    setPlaying(true);
    const cum = [0];
    for (let i = 1; i < pts.length; i++) {
      cum[i] = cum[i - 1] + Math.abs(pts[i].x - pts[i - 1].x) + Math.abs(pts[i].y - pts[i - 1].y);
    }
    const total = cum[cum.length - 1] || 1;
    const D = 7000;
    const timers = exps.map((_, i) =>
      setTimeout(() => {
        setLit((v) => Math.max(v, i + 1));
        setActive(i);
      }, 400 + (cum[i] / total) * D)
    );
    // After the intro, don't keep a popup pinned — it's hover-only from here.
    const clear = setTimeout(() => setActive(null), 400 + D + 1200);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(clear);
    };
  }, [inView, size, pts]);

  const displayActive = hovered ?? active;
  const isLit = (i: number) => i < lit || i === hovered;

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#04040a] px-6 py-24"
    >
      {inView && <SpaceParticles />}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(157,78,221,0.16),transparent_70%)] blur-2xl" />

      <h2 className="relative z-10 mb-2 font-display text-sm uppercase tracking-[0.3em] text-accent-soft">
        Experience
      </h2>
      <p className="relative z-10 mb-10 max-w-md text-center text-sm text-muted">
        Follow the line — each stop lights up the story.
      </p>

      <div ref={stageRef} className="relative z-10 w-full max-w-6xl" style={{ aspectRatio: "16 / 8" }}>
        {size.w > 0 && (
          <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" viewBox={`0 0 ${size.w} ${size.h}`}>
            <defs>
              <linearGradient id="pipeGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#2dd4bf" />
                <stop offset="0.167" stopColor="#2fd27a" />
                <stop offset="0.333" stopColor="#ff6a2b" />
                <stop offset="0.5" stopColor="#38bdf8" />
                <stop offset="0.667" stopColor="#ec4899" />
                <stop offset="0.833" stopColor="#9d4edd" />
                <stop offset="1" stopColor="#f59e0b" />
              </linearGradient>
            </defs>
            <path d={pipeD} stroke="rgba(255,255,255,0.06)" strokeWidth={3} fill="none" />
            <motion.path
              d={pipeD} stroke="url(#pipeGrad)" strokeWidth={16} fill="none" strokeLinecap="round" strokeLinejoin="round"
              style={{ filter: "blur(7px)", opacity: 0.5 }}
              initial={{ pathLength: 0 }} animate={{ pathLength: playing ? 1 : 0 }} transition={{ duration: 7, ease: "easeInOut" }}
            />
            <motion.path
              d={pipeD} stroke="url(#pipeGrad)" strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round"
              initial={{ pathLength: 0 }} animate={{ pathLength: playing ? 1 : 0 }} transition={{ duration: 7, ease: "easeInOut" }}
            />
            <motion.path
              d={pipeD} stroke="#fff" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round"
              style={{ filter: "drop-shadow(0 0 4px #fff)" }}
              initial={{ pathLength: 0 }} animate={{ pathLength: playing ? 1 : 0 }} transition={{ duration: 7, ease: "easeInOut" }}
            />
          </svg>
        )}

        {exps.map((e, i) => {
          const litNow = isLit(i);
          return (
            <div
              key={i}
              className="absolute z-10"
              style={{ left: `${e.x}%`, top: `${e.y}%`, transform: "translate(-50%,-50%)", perspective: "800px" }}
            >
              <div className="absolute left-1/2 top-[52px] h-8 w-28 -translate-x-1/2 rounded-[50%] blur-xl transition-all duration-500" style={{ background: e.color, opacity: litNow ? 0.7 : 0.12 }} />
              <div className="absolute left-1/2 top-[48px] h-14 w-24 -translate-x-1/2 rounded-2xl border transition-all duration-500" style={{ borderColor: litNow ? e.color : "rgba(255,255,255,0.08)", boxShadow: litNow ? `0 0 22px ${e.color}66` : "none" }} />
              <div className="absolute left-1/2 top-[104px] h-9 w-20 -translate-x-1/2 rounded-[50%] blur-md transition-opacity duration-500" style={{ background: e.color, opacity: litNow ? 0.18 : 0 }} />

              <motion.button
                data-cursor="view"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(i)}
                onBlur={() => setHovered(null)}
                className="pointer-events-auto relative block cursor-pointer"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4 + i * 0.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
                aria-label={`${e.role} at ${e.org}`}
              >
                <div style={{ transform: "rotateX(22deg)", transformStyle: "preserve-3d" }}>
                  <div className="absolute inset-0 rounded-[1.3rem]" style={{ transform: "translateZ(-18px)", background: "#050507" }} />
                  <div
                    className="relative grid h-24 w-24 place-items-center rounded-[1.3rem] border"
                    style={{
                      background: "linear-gradient(155deg,#2a2a33 0%,#131318 55%,#0a0a0e 100%)",
                      borderColor: litNow ? `${e.color}aa` : "rgba(255,255,255,0.14)",
                      color: litNow ? "#fff" : "rgba(255,255,255,0.55)",
                      boxShadow: litNow
                        ? `0 0 32px ${e.color}77, inset 0 2px 0 rgba(255,255,255,0.18), inset 0 -12px 22px rgba(0,0,0,0.65), inset 0 -2px 0 ${e.color}`
                        : "inset 0 2px 0 rgba(255,255,255,0.10), inset 0 -12px 22px rgba(0,0,0,0.65)",
                    }}
                  >
                    <span className="pointer-events-none absolute inset-x-3 top-2 h-7 rounded-full bg-white/12 blur-md" />
                    {e.icon}
                  </div>
                </div>
                <span className="absolute -right-1 top-2 h-1.5 w-1.5 rounded-full transition-all duration-500" style={{ background: "#ff6a2b", boxShadow: litNow ? "0 0 10px #ff6a2b" : "none", opacity: litNow ? 1 : 0.4 }} />
              </motion.button>

              <div className="absolute left-1/2 top-[132px] w-32 -translate-x-1/2 text-center">
                <p className="font-display text-[0.72rem] font-semibold leading-tight text-white/90">{e.org}</p>
                <p className="mt-0.5 text-[0.6rem] uppercase tracking-[0.1em] text-muted/70">{e.period}</p>
              </div>
            </div>
          );
        })}

        <AnimatePresence mode="wait">
          {displayActive !== null && isLit(displayActive) && (
            <motion.div
              key={displayActive}
              className="pointer-events-none absolute z-30 w-72"
              style={{
                left: exps[displayActive].x < 50 ? `calc(${exps[displayActive].x}% + 90px)` : `calc(${exps[displayActive].x}% - 90px)`,
                top: `${exps[displayActive].y}%`,
                transform: exps[displayActive].x < 50 ? "translateY(-50%)" : "translate(-100%,-50%)",
              }}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="rounded-2xl border bg-white/[0.07] p-5 text-left shadow-[0_8px_40px_rgba(0,0,0,0.55)] backdrop-blur-xl" style={{ borderColor: `${exps[displayActive].color}55` }}>
                <div className="flex items-center justify-between">
                  <span className="font-display text-[0.65rem] uppercase tracking-[0.2em]" style={{ color: exps[displayActive].color }}>
                    {exps[displayActive].period}
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: exps[displayActive].color }} />
                </div>
                <h3 className="mt-2 font-display text-base font-bold leading-snug text-white">{exps[displayActive].role}</h3>
                <p className="text-sm text-white/80">{exps[displayActive].org}</p>
                <p className="text-[0.7rem] text-muted">{exps[displayActive].location}</p>
                <div className="my-3 h-px w-full bg-white/10" />
                <ul className="space-y-2">
                  {exps[displayActive].bullets.map((b, bi) => (
                    <li key={bi} className="flex gap-2 text-[0.78rem] leading-relaxed text-muted">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full" style={{ background: exps[displayActive].color }} />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="relative z-10 mt-10 text-[0.7rem] uppercase tracking-[0.2em] text-muted/50">
        hover a tile to revisit its story
      </p>
    </section>
  );
}
