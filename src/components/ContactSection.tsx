"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";
import SpaceParticles from "@/components/SpaceParticles";

const EMAIL = "mahatnitai@gmail.com";
const LINKEDIN = "https://www.linkedin.com/in/nitai-mahat-47079b347/";
const GITHUB = "https://github.com/NitaiMahat";

type Channel = {
  label: string;
  value: string;
  href: string;
  color: string;
  icon: React.ReactNode;
  external?: boolean;
};

const channels: Channel[] = [
  {
    label: "Email",
    value: EMAIL,
    href: `mailto:${EMAIL}`,
    color: "#ea4335",
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M3 6l9 7 9-7" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    value: "in/nitai-mahat",
    href: LINKEDIN,
    color: "#0a66c2",
    external: true,
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
      </svg>
    ),
  },
  {
    label: "GitHub",
    value: "NitaiMahat",
    href: GITHUB,
    color: "#c9d1d9",
    external: true,
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
        <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.04-.02-2.05-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.11-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.65 1.65.24 2.87.12 3.17.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.63-5.49 5.92.43.37.81 1.1.81 2.22 0 1.61-.01 2.9-.01 3.29 0 .32.21.7.82.58A12.01 12.01 0 0 0 24 12.5C24 5.87 18.63.5 12 .5z" />
      </svg>
    ),
  },
];

function ChannelCard({ channel, index }: { channel: Channel; index: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.a
      href={channel.href}
      target={channel.external ? "_blank" : undefined}
      rel={channel.external ? "noopener noreferrer" : undefined}
      data-cursor="view"
      className="group pointer-events-auto relative flex w-full items-center gap-4 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] px-5 py-4 backdrop-blur-md transition-colors duration-300 hover:border-white/20 sm:w-64 sm:flex-col sm:items-start sm:gap-5 sm:px-6 sm:py-7"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      whileHover={reduce ? undefined : { y: -6 }}
    >
      {/* glow that blooms on hover */}
      <span
        className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: channel.color }}
      />

      <span
        className="relative grid h-12 w-12 shrink-0 place-items-center rounded-xl border transition-all duration-300"
        style={{
          borderColor: `${channel.color}55`,
          color: channel.color,
          boxShadow: `0 0 0 rgba(0,0,0,0)`,
        }}
      >
        {channel.icon}
      </span>

      <div className="relative min-w-0">
        <p className="font-display text-[0.62rem] uppercase tracking-[0.28em] text-white/40">
          {channel.label}
        </p>
        <p className="mt-1 truncate font-display text-[0.95rem] font-semibold text-white/90 transition-colors duration-300 group-hover:text-white">
          {channel.value}
        </p>
      </div>
    </motion.a>
  );
}

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { margin: "-15%" });
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked — the mailto card still works */
    }
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#050510] px-6 py-24"
    >
      {inView && <SpaceParticles count={50} />}

      {/* ambient glows */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(47,148,87,0.14),transparent_70%)] blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,transparent_35%,rgba(5,5,16,0.85)_100%)]" />

      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center text-center">
        <motion.p
          className="font-display text-[0.7rem] uppercase tracking-[0.4em] text-accent-soft/70"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Contact Me
        </motion.p>

        <motion.h2
          className="mt-4 font-display text-3xl font-bold text-white md:text-5xl"
          style={{ textShadow: "0 4px 30px rgba(0,0,0,0.6)" }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.05 }}
        >
          Let&apos;s build something together
        </motion.h2>

        <motion.p
          className="mt-4 max-w-md text-sm leading-relaxed text-muted"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.12 }}
        >
          Open to internships, research, and collaboration. Reach out on any
          channel and I&apos;ll get back to you soon.
        </motion.p>

        {/* channels */}
        <div className="mt-12 flex w-full flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-stretch">
          {channels.map((c, i) => (
            <ChannelCard key={c.label} channel={c} index={i} />
          ))}
        </div>

        {/* quick copy email */}
        <motion.button
          type="button"
          onClick={copyEmail}
          data-cursor="view"
          className="pointer-events-auto mt-10 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-2.5 text-[0.72rem] uppercase tracking-[0.2em] text-white/70 backdrop-blur-md transition-colors hover:border-accent-soft/60 hover:text-white"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          {copied ? "Copied to clipboard" : "Copy email address"}
        </motion.button>

        <p className="mt-14 text-[0.65rem] uppercase tracking-[0.2em] text-white/25">
          © 2026 Nitai Mahat
        </p>
      </div>
    </section>
  );
}
