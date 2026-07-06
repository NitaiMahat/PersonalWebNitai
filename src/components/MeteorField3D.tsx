"use client";

import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { OrbitControls, Stars, Sparkles, Float, Html } from "@react-three/drei";
import { useReducedMotion } from "motion/react";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { Project } from "@/data/projects";
import { makeMeteorGeometry } from "./meteorGeometry";

/* Stable per-string seed so each project always gets the same rock. */
function hashSeed(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function seededRand(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

/* Golden-angle spiral spreads any number of meteors evenly across the
   view — organic, never overlapping, works for 1 or 10 projects. */
function layoutPosition(i: number, total: number): [number, number, number] {
  const golden = 2.399963229728653;
  const r = Math.sqrt((i + 0.5) / total);
  const theta = i * golden;
  const x = Math.cos(theta) * r * 8.4;
  const y = Math.sin(theta) * r * 4.5;
  const z = (seededRand(i * 3.7 + 1.3) - 0.5) * 3.2;
  return [x, y, z];
}

/* ── One meteor ──────────────────────────────────────────────────────── */

interface MeteorProps {
  project: Project;
  index: number;
  total: number;
  selected: boolean;
  reduce: boolean;
  onSelect: (slug: string) => void;
}

function Meteor({ project, index, total, selected, reduce, onSelect }: MeteorProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const [hovered, setHovered] = useState(false);

  const seed = useMemo(() => hashSeed(project.slug), [project.slug]);
  const radius = useMemo(() => 0.62 + seededRand(seed) * 0.5, [seed]);
  const position = useMemo(() => layoutPosition(index, total), [index, total]);
  const spin = useMemo(() => 0.08 + seededRand(seed * 1.7) * 0.14, [seed]);
  const tilt = useMemo(() => (seededRand(seed * 2.3) - 0.5) * 0.9, [seed]);

  // detail 4 (~5k tris) keeps the lumpy rock silhouette + craters while being
  // ~16× lighter than detail 6, which is the difference between smooth and laggy.
  const geometry = useMemo(
    () => makeMeteorGeometry(seed, radius, 4),
    [seed, radius]
  );

  const accent = useMemo(() => new THREE.Color(project.accent), [project.accent]);
  const active = hovered || selected;

  useFrame((_, delta) => {
    if (meshRef.current && !reduce) {
      meshRef.current.rotation.y += delta * spin;
      meshRef.current.rotation.x += delta * spin * 0.35;
    }
    if (matRef.current) {
      // ease the accent glow in/out on hover / selection
      const target = active ? 0.9 : 0.0;
      matRef.current.emissiveIntensity +=
        (target - matRef.current.emissiveIntensity) * Math.min(1, delta * 8);
    }
  });

  return (
    <Float
      enabled={!reduce}
      speed={1.1 + seededRand(seed * 3.1)}
      rotationIntensity={0.35}
      floatIntensity={0.7}
      position={position}
    >
      <mesh
        ref={meshRef}
        geometry={geometry}
        rotation={[tilt, 0, tilt * 0.5]}
        scale={active ? 1.12 : 1}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          onSelect(project.slug);
        }}
      >
        <meshStandardMaterial
          ref={matRef}
          color="#6b6157"
          roughness={0.95}
          metalness={0.18}
          emissive={accent}
          emissiveIntensity={0}
          flatShading={false}
        />
      </mesh>

      {/* floating label — no boxes, matches the site's typographic style */}
      <Html
        position={[0, -radius - 0.55, 0]}
        center
        distanceFactor={9}
        pointerEvents="none"
        zIndexRange={[20, 0]}
      >
        <div
          className="pointer-events-none select-none text-center transition-all duration-300"
          style={{
            width: 190,
            transform: `translateY(${active ? -2 : 0}px)`,
            opacity: active ? 1 : 0.78,
          }}
        >
          <p
            className="text-[0.5rem] font-bold uppercase tracking-[0.32em]"
            style={{ color: project.accent, textShadow: `0 0 12px ${project.accent}66` }}
          >
            {project.status}
          </p>
          <h3
            className="mt-0.5 font-display text-[0.95rem] font-bold leading-tight text-white"
            style={{ textShadow: "0 2px 12px rgba(0,0,0,0.9)" }}
          >
            {project.name}
          </h3>
          <p
            className="mt-1 text-[0.62rem] leading-snug text-white/45 transition-all duration-300"
            style={{
              textShadow: "0 1px 8px rgba(0,0,0,0.8)",
              maxHeight: active ? 40 : 0,
              opacity: active ? 1 : 0,
              overflow: "hidden",
            }}
          >
            {project.tagline}
          </p>
        </div>
      </Html>
    </Float>
  );
}

/* ── Slow drift of the whole field for parallax life ─────────────────── */

function FieldRig({ reduce, children }: { reduce: boolean; children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (group.current && !reduce) {
      const t = state.clock.elapsedTime;
      group.current.rotation.y = Math.sin(t * 0.06) * 0.08;
      group.current.rotation.x = Math.cos(t * 0.05) * 0.04;
    }
  });
  return <group ref={group}>{children}</group>;
}

/* ── Public component ────────────────────────────────────────────────── */

interface MeteorField3DProps {
  projects: Project[];
  selectedSlug: string | null;
  onSelect: (slug: string) => void;
}

export default function MeteorField3D({
  projects,
  selectedSlug,
  onSelect,
}: MeteorField3DProps) {
  const reduce = useReducedMotion() ?? false;

  // Only render the WebGL scene while it's on (or near) the screen — a second
  // always-on canvas is the main source of scroll jank on this page.
  const wrapRef = useRef<HTMLDivElement>(null);
  const [onScreen, setOnScreen] = useState(true);
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { rootMargin: "150px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={wrapRef}
      className="relative h-[78vh] min-h-[560px] w-full cursor-grab active:cursor-grabbing"
    >
      <Canvas
        camera={{ position: [0, 0, 15], fov: 42 }}
        dpr={[1, 1.75]}
        frameloop={onScreen ? "always" : "never"}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        {/* space lighting: cool ambient fill + warm key sun + cold rim */}
        <ambientLight intensity={0.3} color="#4a5578" />
        <directionalLight position={[6, 7, 6]} intensity={2.4} color="#fff2df" />
        <directionalLight position={[-7, -3, -5]} intensity={0.6} color="#3a5a8a" />

        <Suspense fallback={null}>
          <FieldRig reduce={reduce}>
            {projects.map((project, index) => (
              <Meteor
                key={project.slug}
                project={project}
                index={index}
                total={projects.length}
                selected={selectedSlug === project.slug}
                reduce={reduce}
                onSelect={onSelect}
              />
            ))}
          </FieldRig>

          {/* faint drifting dust + far starfield for depth */}
          <Sparkles
            count={60}
            scale={[20, 12, 8]}
            size={2}
            speed={reduce ? 0 : 0.3}
            opacity={0.5}
            color="#cfe4ff"
          />
          <Stars radius={80} depth={40} count={1200} factor={3} fade speed={reduce ? 0 : 0.4} />
        </Suspense>

        <OrbitControls
          makeDefault
          enablePan={false}
          enableZoom={false}
          enableDamping
          dampingFactor={0.08}
          rotateSpeed={0.4}
          autoRotate={false}
          minPolarAngle={Math.PI * 0.32}
          maxPolarAngle={Math.PI * 0.68}
          minAzimuthAngle={-0.55}
          maxAzimuthAngle={0.55}
        />
      </Canvas>

      {/* discoverability hint */}
      <div className="pointer-events-none absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 text-[0.6rem] uppercase tracking-[0.25em] text-white/25">
        <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#8be9ff]/70" />
        Drag to orbit · click a meteor
      </div>
    </div>
  );
}
