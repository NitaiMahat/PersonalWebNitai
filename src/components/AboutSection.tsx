"use client";

import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import SpaceParticles from "@/components/SpaceParticles";

function BookOrbit() {
  const rings = [
    { count: 10, radius: 235, dur: 28, dir: 1 },
    { count: 14, radius: 305, dur: 44, dir: -1 },
  ];
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2">
      {rings.map((r, ri) => (
        <motion.div
          key={ri}
          className="absolute left-0 top-0"
          animate={{ rotate: 360 * r.dir }}
          transition={{ duration: r.dur, repeat: Infinity, ease: "linear" }}
        >
          {Array.from({ length: r.count }).map((_, i) => {
            const a = (i / r.count) * Math.PI * 2;
            return (
              <span
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  left: Math.cos(a) * r.radius,
                  top: Math.sin(a) * r.radius,
                  width: 2 + ((i * 5) % 3),
                  height: 2 + ((i * 5) % 3),
                  opacity: 0.55 + ((i * 3) % 4) * 0.1,
                  boxShadow: "0 0 8px rgba(199,178,255,0.85)",
                }}
              />
            );
          })}
        </motion.div>
      ))}
    </div>
  );
}

/* ===== Animated hand-drawn illustrations (SVG path "drawing") ===== */
const draw = (active: boolean, delay = 0, duration = 1.3) => ({
  initial: { pathLength: 0, opacity: 0 },
  animate: { pathLength: active ? 1 : 0, opacity: active ? 1 : 0 },
  transition: { duration, delay, ease: "easeInOut" as const },
});

function NepalDrawing({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 160 110" className="h-28 w-44" fill="none">
      <motion.circle
        cx="122" cy="34" r="13"
        stroke="#e0892f" strokeWidth="2.5"
        {...draw(active, 0.1, 0.9)}
      />
      <motion.path
        d="M8 96 L42 44 L66 78 L92 32 L128 96"
        stroke="#161616" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"
        {...draw(active, 0.2, 1.5)}
      />
      <motion.path
        d="M150 96 L8 96"
        stroke="#161616" strokeWidth="2" strokeLinecap="round"
        {...draw(active, 1.2, 0.6)}
      />
      {/* flag pin */}
      <motion.path
        d="M92 78 L92 56 L108 61 L92 66"
        stroke="#9d2235" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"
        {...draw(active, 1.0, 0.7)}
      />
    </svg>
  );
}

function CollegeDrawing({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 160 110" className="h-28 w-44" fill="none">
      <motion.path
        d="M22 50 L80 22 L138 50"
        stroke="#161616" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"
        {...draw(active, 0.1, 0.9)}
      />
      <motion.path
        d="M32 50 L32 92 M128 50 L128 92 M32 92 L128 92"
        stroke="#161616" strokeWidth="2.5" strokeLinecap="round"
        {...draw(active, 0.5, 1.1)}
      />
      <motion.path
        d="M50 92 L50 56 M68 92 L68 56 M92 92 L92 56 L110 56 L110 92"
        stroke="#1f6b3b" strokeWidth="2.5" strokeLinecap="round"
        {...draw(active, 0.9, 1.1)}
      />
      {/* flag on roof */}
      <motion.path
        d="M80 22 L80 10 L92 14 L80 18"
        stroke="#9d2235" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"
        {...draw(active, 1.3, 0.6)}
      />
    </svg>
  );
}

function MajorDrawing({ active }: { active: boolean }) {
  const bars = [
    { x: 96, h: 18, c: "#9d4edd" },
    { x: 110, h: 30, c: "#1f6b3b" },
    { x: 124, h: 44, c: "#e0892f" },
  ];
  return (
    <svg viewBox="0 0 160 110" className="h-28 w-44" fill="none">
      {/* monitor */}
      <motion.path
        d="M14 24 L78 24 L78 70 L14 70 Z"
        stroke="#161616" strokeWidth="2.5" strokeLinejoin="round"
        {...draw(active, 0.1, 1.1)}
      />
      <motion.path
        d="M40 70 L40 82 M30 82 L62 82"
        stroke="#161616" strokeWidth="2.5" strokeLinecap="round"
        {...draw(active, 0.9, 0.6)}
      />
      {/* </> */}
      <motion.path
        d="M34 38 L26 47 L34 56 M58 38 L66 47 L58 56 M50 36 L42 58"
        stroke="#1f6b3b" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"
        {...draw(active, 0.6, 1.2)}
      />
      {/* data bars */}
      {bars.map((b, i) => (
        <motion.rect
          key={i}
          x={b.x}
          width="9"
          rx="1.5"
          fill={b.c}
          initial={{ height: 0, y: 92 }}
          animate={{ height: active ? b.h : 0, y: active ? 92 - b.h : 92 }}
          transition={{ duration: 0.6, delay: 1 + i * 0.18, ease: "easeOut" }}
        />
      ))}
      <motion.path
        d="M90 92 L140 92"
        stroke="#161616" strokeWidth="2" strokeLinecap="round"
        {...draw(active, 0.9, 0.5)}
      />
    </svg>
  );
}

function GpaDrawing({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 160 110" className="h-28 w-44" fill="none">
      <motion.path
        d="M80 16 L92 44 L122 47 L99 67 L106 96 L80 80 L54 96 L61 67 L38 47 L68 44 Z"
        stroke="#e0892f" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"
        {...draw(active, 0.1, 1.6)}
      />
      <motion.text
        x="80" y="64" textAnchor="middle"
        className="font-display"
        style={{ fontSize: 20, fontWeight: 700, fill: "#161616" }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0.5 }}
        transition={{ duration: 0.5, delay: 1.2 }}
      >
        4.0
      </motion.text>
      {[
        [26, 24],
        [134, 28],
        [30, 86],
        [132, 84],
      ].map(([cx, cy], i) => (
        <motion.path
          key={i}
          d={`M${cx - 5} ${cy} L${cx + 5} ${cy} M${cx} ${cy - 5} L${cx} ${cy + 5}`}
          stroke="#9d4edd" strokeWidth="2" strokeLinecap="round"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0 }}
          transition={{ duration: 0.4, delay: 1.4 + i * 0.12 }}
        />
      ))}
    </svg>
  );
}

/* ── Backend / systems ── */
function BackendDrawing({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 160 110" className="h-28 w-44" fill="none">
      {/* database cylinder */}
      <motion.ellipse cx="56" cy="32" rx="26" ry="8" stroke="#161616" strokeWidth="2.5" {...draw(active, 0.1, 0.9)} />
      <motion.path d="M30 32 L30 72" stroke="#161616" strokeWidth="2.5" strokeLinecap="round" {...draw(active, 0.4, 0.7)} />
      <motion.path d="M82 32 L82 72" stroke="#161616" strokeWidth="2.5" strokeLinecap="round" {...draw(active, 0.4, 0.7)} />
      <motion.path d="M30 52 C30 60 82 60 82 52" stroke="#161616" strokeWidth="2" strokeLinecap="round" {...draw(active, 0.7, 0.7)} />
      <motion.path d="M30 72 C30 80 82 80 82 72" stroke="#161616" strokeWidth="2.5" strokeLinecap="round" {...draw(active, 0.9, 0.7)} />
      {/* gear */}
      <motion.circle cx="120" cy="66" r="14" stroke="#1f6b3b" strokeWidth="2.5" {...draw(active, 1.0, 1.0)} />
      <motion.circle cx="120" cy="66" r="5" stroke="#1f6b3b" strokeWidth="2.5" {...draw(active, 1.4, 0.5)} />
      <motion.path
        d="M120 48 L120 52 M120 80 L120 84 M102 66 L106 66 M134 66 L138 66"
        stroke="#1f6b3b" strokeWidth="2" strokeLinecap="round" {...draw(active, 1.5, 0.6)}
      />
      {/* connector */}
      <motion.path d="M84 46 L104 58" stroke="#e0892f" strokeWidth="2.5" strokeLinecap="round" {...draw(active, 1.2, 0.5)} />
    </svg>
  );
}

/* ── Full-stack ── */
function FullStackDrawing({ active }: { active: boolean }) {
  const dots = [
    { cx: 34, c: "#9d2235" },
    { cx: 40, c: "#e0892f" },
    { cx: 46, c: "#1f6b3b" },
  ];
  return (
    <svg viewBox="0 0 160 110" className="h-28 w-44" fill="none">
      {/* browser window */}
      <motion.path d="M26 18 L134 18 L134 50 L26 50 Z" stroke="#161616" strokeWidth="2.5" strokeLinejoin="round" {...draw(active, 0.1, 1.1)} />
      <motion.path d="M26 28 L134 28" stroke="#161616" strokeWidth="2" {...draw(active, 0.6, 0.6)} />
      {dots.map((d, i) => (
        <motion.circle
          key={i} cx={d.cx} cy="23" r="1.8" fill={d.c}
          initial={{ opacity: 0 }} animate={{ opacity: active ? 1 : 0 }}
          transition={{ duration: 0.3, delay: 0.7 + i * 0.1 }}
        />
      ))}
      {/* server */}
      <motion.path d="M40 66 L120 66 L120 92 L40 92 Z" stroke="#1f6b3b" strokeWidth="2.5" strokeLinejoin="round" {...draw(active, 0.9, 1.0)} />
      <motion.path d="M48 74 L112 74 M48 84 L112 84" stroke="#1f6b3b" strokeWidth="2" strokeLinecap="round" {...draw(active, 1.3, 0.7)} />
      {/* connector */}
      <motion.path d="M80 50 L80 66" stroke="#e0892f" strokeWidth="2.5" strokeLinecap="round" {...draw(active, 1.1, 0.5)} />
    </svg>
  );
}

/* ── AI & research ── */
function AiDrawing({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 160 110" className="h-28 w-44" fill="none">
      {/* chip */}
      <motion.path d="M50 32 L110 32 L110 82 L50 82 Z" stroke="#161616" strokeWidth="2.5" strokeLinejoin="round" {...draw(active, 0.1, 1.1)} />
      {/* pins */}
      <motion.path
        d="M50 44 L40 44 M50 60 L40 60 M50 74 L40 74 M110 44 L120 44 M110 60 L120 60 M110 74 L120 74 M66 32 L66 22 M80 32 L80 22 M94 32 L94 22 M66 82 L66 92 M80 82 L80 92 M94 82 L94 92"
        stroke="#161616" strokeWidth="2" strokeLinecap="round" {...draw(active, 0.6, 1.2)}
      />
      <motion.text
        x="80" y="65" textAnchor="middle" className="font-display"
        style={{ fontSize: 20, fontWeight: 700, fill: "#9d4edd" }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0.5 }}
        transition={{ duration: 0.5, delay: 1.2 }}
      >
        AI
      </motion.text>
    </svg>
  );
}

/* ── Soccer ── */
function SoccerDrawing({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 160 110" className="h-28 w-44" fill="none">
      <motion.circle cx="76" cy="56" r="30" stroke="#161616" strokeWidth="2.5" {...draw(active, 0.1, 1.3)} />
      <motion.path
        d="M76 42 L88 51 L83 65 L69 65 L64 51 Z"
        stroke="#161616" strokeWidth="2.5" strokeLinejoin="round" fill="#161616" {...draw(active, 0.6, 1.0)}
      />
      <motion.path
        d="M76 42 L76 26 M88 51 L104 46 M83 65 L94 79 M69 65 L58 79 M64 51 L48 46"
        stroke="#161616" strokeWidth="2" strokeLinecap="round" {...draw(active, 1.0, 1.0)}
      />
      {/* motion lines */}
      <motion.path
        d="M114 40 L132 36 M116 54 L136 52 M114 68 L132 72"
        stroke="#e0892f" strokeWidth="2.5" strokeLinecap="round" {...draw(active, 1.4, 0.6)}
      />
    </svg>
  );
}

/* ── Purpose / ideas ── */
function PurposeDrawing({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 160 110" className="h-28 w-44" fill="none">
      <motion.circle cx="80" cy="44" r="22" stroke="#e0892f" strokeWidth="2.5" {...draw(active, 0.1, 1.1)} />
      <motion.path d="M74 44 L78 52 L82 42 L86 52" stroke="#1f6b3b" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" {...draw(active, 0.6, 0.9)} />
      <motion.path d="M68 66 L92 66 M70 74 L90 74 M74 82 L86 82" stroke="#161616" strokeWidth="2.5" strokeLinecap="round" {...draw(active, 0.9, 0.8)} />
      <motion.path
        d="M80 14 L80 6 M52 24 L46 18 M108 24 L114 18 M44 46 L36 46 M116 46 L124 46"
        stroke="#9d4edd" strokeWidth="2" strokeLinecap="round" {...draw(active, 1.2, 0.8)}
      />
    </svg>
  );
}

/* ── What's next / rocket ── */
function NextDrawing({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 160 110" className="h-28 w-44" fill="none">
      <motion.path
        d="M80 16 C92 28 92 50 88 64 L72 64 C68 50 68 28 80 16 Z"
        stroke="#161616" strokeWidth="2.5" strokeLinejoin="round" {...draw(active, 0.1, 1.3)}
      />
      <motion.circle cx="80" cy="38" r="7" stroke="#9d4edd" strokeWidth="2.5" {...draw(active, 0.8, 0.8)} />
      <motion.path d="M72 56 L60 72 L72 66 M88 56 L100 72 L88 66" stroke="#161616" strokeWidth="2.5" strokeLinejoin="round" {...draw(active, 1.0, 0.9)} />
      <motion.path d="M74 64 L80 88 L86 64" stroke="#e0892f" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" {...draw(active, 1.3, 0.7)} />
      <motion.path
        d="M40 28 L40 36 M36 32 L44 32 M124 42 L124 50 M120 46 L128 46"
        stroke="#1f6b3b" strokeWidth="2" strokeLinecap="round" {...draw(active, 1.5, 0.7)}
      />
    </svg>
  );
}

type Chapter = {
  title: string;
  text: React.ReactNode;
  Drawing: (p: { active: boolean }) => React.ReactElement;
};

const chapters: Chapter[] = [
  {
    title: "Born in Nepal",
    text: "My story began in Nepal, in the shadow of the Himalayas, where I learned that the biggest dreams start small and curiosity became my greatest strength.",
    Drawing: NepalDrawing,
  },
  {
    title: "Off to College",
    text: "Leaving home to study in the United States was exciting and intimidating. Every challenge became a chance to adapt, solve problems, and build a future from scratch.",
    Drawing: CollegeDrawing,
  },
  {
    title: "Computer Science & Data Science",
    text: "A junior at Augustana College, double majoring in Computer Science and Data Science, fascinated by how software works and how data turns ideas into real solutions.",
    Drawing: MajorDrawing,
  },
  {
    title: "4.0 GPA",
    text: "A perfect 4.0 taught me that consistency beats talent when talent stops working. Every late night debugging session sharpened both my skills and my discipline.",
    Drawing: GpaDrawing,
  },
  {
    title: "Building Systems",
    text: "Backend engineering is where I feel most at home: designing APIs, optimizing databases, and taming concurrency. Java is my language for scalable, reliable software.",
    Drawing: BackendDrawing,
  },
  {
    title: "Full-Stack Builder",
    text: "Great engineers understand the whole product. From intuitive interfaces to robust services, I love building complete applications people genuinely enjoy using.",
    Drawing: FullStackDrawing,
  },
  {
    title: "AI & Research",
    text: "AI opened a whole new world: researching LLMs, experimenting with computer vision, and exploring tools that solve meaningful problems. There's always more to discover.",
    Drawing: AiDrawing,
  },
  {
    title: "The Beautiful Game",
    text: "Away from the keyboard, I'm watching or playing soccer. It teaches teamwork, resilience, and calm under pressure, the same qualities that make better engineers.",
    Drawing: SoccerDrawing,
  },
  {
    title: "Projects with Purpose",
    text: "Every project starts with one question: can this solve a real problem? Across AI apps, scalable backends, and full-stack platforms, I build software people can actually use.",
    Drawing: PurposeDrawing,
  },
  {
    title: "What's Next?",
    text: "This is only the beginning. I'm always learning, experimenting, and pushing to become a better engineer. Countless problems remain, and I'm excited to build what's next.",
    Drawing: NextDrawing,
  },
];

/* ===== Epilogue page — closes the story and opens the portfolio ===== */
function FinaleContent({
  active,
  onEnter,
}: {
  active: boolean;
  onEnter: (e: React.MouseEvent) => void;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-7 text-center text-[#2c2a26]">
      <span className="font-display text-[0.6rem] uppercase tracking-[0.25em] text-[#161616]/50">
        Epilogue
      </span>
      <div className="h-px w-12 bg-[#161616]/30" />
      <p className="font-display text-[0.98rem] font-semibold leading-relaxed text-[#161616]">
        Every chapter you&apos;ve read shaped the engineer I am today.
      </p>
      <p className="text-[0.82rem] leading-relaxed text-[#2c2a26]/80">
        Now it&apos;s time to see what I&apos;ve built.
      </p>
      <motion.button
        onClick={onEnter}
        onPointerDown={(e) => e.stopPropagation()}
        onPointerUp={(e) => e.stopPropagation()}
        data-cursor="open"
        className="mt-2 rounded-full bg-[#16243f] px-5 py-2.5 font-display text-[0.68rem] uppercase tracking-[0.2em] text-white shadow-lg transition-transform hover:scale-105"
        animate={active ? { opacity: [0.65, 1, 0.65] } : { opacity: 1 }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      >
        See what I&apos;ve built →
      </motion.button>
    </div>
  );
}

function ChapterContent({
  chapter,
  index,
  active,
}: {
  chapter: Chapter;
  index: number;
  active: boolean;
}) {
  const { Drawing } = chapter;
  return (
    <div className="flex h-full flex-col p-6 text-[#2c2a26]">
      <span className="font-display text-[0.6rem] uppercase tracking-[0.25em] text-[#161616]/50">
        Chapter {index + 1}
      </span>
      <h3 className="mt-1 font-display text-xl font-bold text-[#161616]">
        {chapter.title}
      </h3>
      <div className="my-3 h-px w-12 bg-[#161616]/30" />
      <div className="grid flex-1 place-items-center">
        <Drawing active={active} />
      </div>
      <p className="text-[0.8rem] leading-relaxed">{chapter.text}</p>
      <span className="mt-2 self-end text-[0.6rem] text-[#161616]/40">
        {index + 1} / {chapters.length}
      </span>
    </div>
  );
}

/* ===== Section ===== */
export default function AboutSection() {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [finishing, setFinishing] = useState(false);
  const reduce = useReducedMotion();

  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { margin: "200px" });

  // cursor tilt for the closed book
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-16, 16]), {
    stiffness: 120,
    damping: 18,
  });
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [10, -10]), {
    stiffness: 120,
    damping: 18,
  });
  const handleMove = (e: React.MouseEvent) => {
    if (open || reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const resetTilt = () => {
    px.set(0);
    py.set(0);
  };

  // page-turn controls — the last leaf (index === chapters.length) is the epilogue
  const finaleIndex = chapters.length;
  const last = finaleIndex;
  const advance = () => setPage((p) => Math.min(p + 1, last));
  const back = () => setPage((p) => Math.max(p - 1, 0));

  // Finale: close the book, let it recede (zoom-out), then glide into projects
  const goToProjects = (e: React.MouseEvent) => {
    e.stopPropagation();
    stopHold();
    setFinishing(true);
    setOpen(false);
    window.setTimeout(
      () =>
        document
          .getElementById("projects")
          ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }),
      reduce ? 0 : 950
    );
    window.setTimeout(
      () => {
        setFinishing(false);
        setPage(0);
      },
      reduce ? 200 : 2400
    );
  };

  // hold-to-flip
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const downAt = useRef(0);

  const stopHold = () => {
    if (holdTimer.current) clearTimeout(holdTimer.current);
    if (autoTimer.current) clearInterval(autoTimer.current);
    holdTimer.current = null;
    autoTimer.current = null;
  };
  useEffect(() => stopHold, []);

  const onPointerDown = () => {
    if (!open) return;
    downAt.current = Date.now();
    holdTimer.current = setTimeout(() => {
      autoTimer.current = setInterval(() => {
        setPage((p) => {
          if (p >= last) {
            stopHold();
            return p;
          }
          return p + 1;
        });
      }, 1000);
    }, 280);
  };
  const onPointerUp = () => {
    if (!open) return;
    const held = Date.now() - downAt.current;
    stopHold();
    if (held < 280) advance(); // quick tap = one page
  };

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#04040a] px-6 py-24"
    >
      {inView && <SpaceParticles />}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(157,78,221,0.18),transparent_70%)] blur-2xl" />

      <div className="relative z-10 flex flex-col items-center">
        <div
          className="relative"
          style={{ perspective: 1600 }}
          onMouseMove={handleMove}
          onMouseLeave={resetTilt}
        >
          {inView && <BookOrbit />}

          <motion.div
            data-cursor={open ? "hold" : "open"}
            className="relative z-10 h-[460px] w-[320px] cursor-pointer"
            style={{
              transformStyle: "preserve-3d",
              rotateX: open || finishing ? 0 : rotateX,
              rotateY: open || finishing ? 0 : rotateY,
            }}
            animate={{
              scale: finishing ? 0.5 : open ? 1.08 : 1,
              x: finishing ? 0 : open ? 150 : 0,
              y: reduce ? 0 : finishing ? -50 : open ? 0 : [0, -10, 0],
              opacity: finishing ? 0 : 1,
            }}
            transition={{
              scale: { duration: finishing ? 1.1 : 0.7, ease: [0.22, 1, 0.36, 1] },
              x: { duration: 0.9, ease: [0.6, 0, 0.2, 1] },
              opacity: { duration: finishing ? 1.1 : 0.3 },
              y:
                open || finishing
                  ? { duration: finishing ? 1.1 : 0.5 }
                  : { duration: 6, repeat: Infinity, ease: "easeInOut" },
            }}
            onClick={() => !open && setOpen(true)}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerLeave={stopHold}
          >
            {/* spine + left inside page (behind the leaves) */}
            <div className="absolute inset-0 rounded-l-sm rounded-r-md bg-gradient-to-br from-[#efe7d6] to-[#ded2b9]" />
            <div className="absolute left-0 top-0 h-full w-3 rounded-l-md bg-black/40" />

            {/* FLIPBOOK LEAVES — chapters + a final epilogue leaf */}
            {Array.from({ length: finaleIndex + 1 }).map((_, i) => {
              const flipped = i < page;
              const isFinale = i === finaleIndex;
              const totalLeaves = finaleIndex + 1;
              return (
                <motion.div
                  key={i}
                  className="absolute inset-0"
                  style={{
                    transformStyle: "preserve-3d",
                    transformOrigin: "left center",
                    zIndex: flipped ? totalLeaves + i : totalLeaves - i,
                  }}
                  animate={{ rotateY: flipped ? -180 : 0 }}
                  transition={{ duration: 0.8, ease: [0.6, 0, 0.2, 1] }}
                >
                  {/* front = chapter (or epilogue) content */}
                  <div
                    className="absolute inset-0 overflow-hidden rounded-r-md rounded-l-sm bg-gradient-to-br from-[#f6f0e2] to-[#e7dcc6] shadow-[inset_8px_0_24px_rgba(0,0,0,0.10)]"
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    {isFinale ? (
                      <FinaleContent
                        active={open && page === finaleIndex}
                        onEnter={goToProjects}
                      />
                    ) : (
                      <ChapterContent
                        chapter={chapters[i]}
                        index={i}
                        active={open && i === page}
                      />
                    )}
                  </div>
                  {/* back = blank page */}
                  <div
                    className="absolute inset-0 rounded-r-md rounded-l-sm bg-gradient-to-bl from-[#efe7d6] to-[#ddd0b6]"
                    style={{
                      transform: "rotateY(180deg)",
                      backfaceVisibility: "hidden",
                    }}
                  >
                    <div className="absolute inset-5 rounded-sm border border-[#161616]/10" />
                  </div>
                </motion.div>
              );
            })}

            {/* FRONT COVER (always above the leaves; swings open) */}
            <motion.div
              className="absolute inset-0"
              style={{
                transformStyle: "preserve-3d",
                transformOrigin: "left center",
                zIndex: 50,
              }}
              animate={{ rotateY: open ? -160 : 0 }}
              transition={{ duration: 0.9, ease: [0.6, 0, 0.2, 1] }}
            >
              <div
                className="absolute inset-0 rounded-l-sm rounded-r-md bg-[#16243f] shadow-2xl"
                style={{
                  backfaceVisibility: "hidden",
                  backgroundImage:
                    "repeating-linear-gradient(45deg, rgba(255,255,255,0.025) 0 2px, transparent 2px 4px), repeating-linear-gradient(-45deg, rgba(0,0,0,0.06) 0 2px, transparent 2px 4px)",
                }}
              >
                <div className="absolute inset-3 rounded-sm border border-white/30" />
                <div className="absolute inset-[15px] rounded-sm border border-white/15" />
                <div className="absolute left-1/2 top-7 -translate-x-1/2 h-4 w-4 rounded-full border border-white/50" />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                  <p className="font-display text-sm tracking-[0.35em] text-white/90">
                    THE STORY OF
                  </p>
                  <p className="mt-2 font-display text-lg font-bold tracking-[0.15em] text-white">
                    NITAI MAHAT
                  </p>
                </div>
                <div className="absolute bottom-9 left-1/2 flex -translate-x-1/2 items-center gap-2.5">
                  <span className="font-display text-[0.65rem] tracking-[0.25em] text-white/80">
                    ABOUT
                  </span>
                  <span className="grid h-10 w-10 place-items-center rounded-full border border-white/50 font-display text-sm text-white/90">
                    NM
                  </span>
                  <span className="font-display text-[0.65rem] tracking-[0.25em] text-white/80">
                    ME
                  </span>
                </div>
              </div>
              <div
                className="absolute inset-0 rounded-l-sm rounded-r-md bg-[#0f1830]"
                style={{
                  transform: "rotateY(180deg)",
                  backfaceVisibility: "hidden",
                }}
              >
                <div className="absolute inset-4 rounded-sm border border-white/10" />
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Controls */}
        <div className="mt-12 flex h-8 items-center gap-4">
          {open ? (
            <>
              <button
                onClick={back}
                disabled={page === 0}
                className="grid h-8 w-8 place-items-center rounded-full border border-white/20 bg-white/5 text-foreground/80 backdrop-blur-md transition-colors hover:border-accent-soft/60 disabled:opacity-30"
                aria-label="Previous page"
              >
                ‹
              </button>
              <button
                onClick={() => {
                  setOpen(false);
                  setPage(0);
                }}
                className="rounded-full border border-white/20 bg-white/5 px-5 py-2 text-xs uppercase tracking-[0.2em] text-foreground/80 backdrop-blur-md transition-colors hover:border-accent-soft/60 hover:text-white"
              >
                Close book
              </button>
              <button
                onClick={advance}
                disabled={page === last}
                className="grid h-8 w-8 place-items-center rounded-full border border-white/20 bg-white/5 text-foreground/80 backdrop-blur-md transition-colors hover:border-accent-soft/60 disabled:opacity-30"
                aria-label="Next page"
              >
                ›
              </button>
            </>
          ) : (
            <motion.p
              className="text-xs uppercase tracking-[0.25em] text-muted/70"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            >
              Click the book to open
            </motion.p>
          )}
        </div>
        {open && (
          <p className="mt-3 text-[0.7rem] uppercase tracking-[0.2em] text-muted/50">
            hold the book to flip through · or tap / use arrows
          </p>
        )}
      </div>
    </section>
  );
}
