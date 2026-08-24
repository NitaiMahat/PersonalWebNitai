"use client";

import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { OrbitControls, Stars, Sparkles, Float, Html, useTexture } from "@react-three/drei";
import { useReducedMotion } from "motion/react";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { Project } from "@/data/projects";

/* ── Texture Paths ──────────────────────────────────────────────────── */
const TEX = {
  sun: "/textures/sun.jpg",
  earthDay: "/textures/earth_day.jpg",
  earthNight: "/textures/earth_night.jpg",
  earthClouds: "/textures/earth_clouds.jpg",
  saturn: "/textures/saturn.jpg",
  saturnRing: "/textures/saturn_ring.png",
  mars: "/textures/mars.jpg",
  moon: "/textures/moon.jpg",
  jupiter: "/textures/jupiter.jpg",
  neptune: "/textures/neptune.jpg",
} as const;

/* ── Base 3D Celestial Coordinates ───────────────────────────────────── */
const CELESTIAL_POSITIONS: Record<string, [number, number, number]> = {
  "atlas-jobs": [0, 0, 0],                        // Center Sun Star
  "expense-tracker-application": [-2.2, 4.2, -1.0],// Top-left Ice Crystal
  "earth-twin": [3.6, -1.2, 1.8],                 // Lower-right Earth Globe
  "course-planning-assistant": [7.4, 2.8, -1.2],   // Far top-right Book Cluster
  "gus-marketplace": [1.2, -4.5, 2.2],            // Lower-center Saturn
  "hospital-management-system": [9.8, 0.6, -1.8], // Far right Moon
  "real-time-chat-application": [7.8, -4.2, 1.2],   // Far lower-right Cyber Chat Globe
  "used-car-price-prediction": [-7.2, -2.5, 1.2], // Mid-left Mars
  "clustering-research-paper": [-9.8, 1.2, -1.8],  // Far left Jupiter
  "screen-recorder-project": [-4.8, -5.8, 2.4],    // Far bottom-left Satellite
};

function getPositionForProject(slug: string, index: number, _total: number, isMobile: boolean): [number, number, number] {
  const base = CELESTIAL_POSITIONS[slug] || [
    Math.cos(index * 2.4) * Math.sqrt(index + 0.5) * 4.2,
    Math.sin(index * 2.4) * Math.sqrt(index + 0.5) * 2.4,
    0
  ];
  // On mobile portrait screens, scale coordinates slightly inward so all planets fit within vertical viewport
  if (isMobile) {
    return [base[0] * 0.68, base[1] * 0.78, base[2] * 0.7];
  }
  return base;
}

/* ── 3D Concentric Elliptical Orbital Grid Floor ─────────────────────── */
function OrbitalGrid({ isMobile }: { isMobile: boolean }) {
  const rings = isMobile ? [2.8, 5.0, 7.5, 10.0] : [3.8, 6.8, 9.8, 13.2, 16.5];

  return (
    <group rotation={[Math.PI * 0.44, 0, 0]} position={[0, -1.0, -1]}>
      {rings.map((r, i) => (
        <mesh key={i}>
          <ringGeometry args={[r, r + 0.04, 64]} />
          <meshBasicMaterial
            color={i % 2 === 0 ? "#38bdf8" : "#818cf8"}
            transparent
            opacity={0.14 - i * 0.02}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
      {[...Array(12)].map((_, i) => (
        <group key={i} rotation={[0, 0, (i * Math.PI) / 6]}>
          <mesh position={[0, 8.5, 0]}>
            <planeGeometry args={[0.02, 17]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.04} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ── Sun (NASA Texture) ─────────────────────────────────────────────── */
function SunObject({ active }: { active: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const sunMap = useTexture(TEX.sun);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const children = groupRef.current.children as THREE.Mesh[];
    if (children[0]) children[0].rotation.y += delta * 0.08;
    if (children[1]) children[1].rotation.z -= delta * 0.06;
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial
          map={sunMap}
          emissiveMap={sunMap}
          emissive="#ff6600"
          emissiveIntensity={active ? 2.8 : 2.0}
          roughness={0.3}
          metalness={0.0}
        />
      </mesh>
    </group>
  );
}

/* ── Earth Globe (NASA Blue Marble + Clouds + Night Lights) ─────────── */
function EarthObject({ active }: { active: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const [dayMap, nightMap, cloudsMap] = useTexture([TEX.earthDay, TEX.earthNight, TEX.earthClouds]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const children = groupRef.current.children as THREE.Mesh[];
    if (children[0]) children[0].rotation.y += delta * 0.08;
    if (children[1]) children[1].rotation.y += delta * 0.12;
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[0.95, 32, 32]} />
        <meshStandardMaterial
          map={dayMap}
          emissiveMap={nightMap}
          emissive="#ffcc66"
          emissiveIntensity={active ? 1.8 : 1.2}
          roughness={0.45}
          metalness={0.08}
        />
      </mesh>
      <mesh scale={1.025}>
        <sphereGeometry args={[0.95, 24, 24]} />
        <meshStandardMaterial
          map={cloudsMap}
          transparent
          opacity={0.45}
          roughness={0.9}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/* ── Saturn (NASA Texture + Ring) ────────────────────────────────────── */
function SaturnObject({ active }: { active: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const [saturnMap, ringMap] = useTexture([TEX.saturn, TEX.saturnRing]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const children = groupRef.current.children as THREE.Object3D[];
    if (children[0]) children[0].rotation.y += delta * 0.07;
    if (children[1]) children[1].rotation.z += delta * 0.04;
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[0.9, 32, 32]} />
        <meshStandardMaterial
          map={saturnMap}
          roughness={0.5}
          metalness={0.1}
          emissive="#b8860b"
          emissiveIntensity={active ? 0.6 : 0.35}
        />
      </mesh>
      <group rotation={[Math.PI * 0.38, 0, 0]}>
        <mesh>
          <ringGeometry args={[1.15, 1.85, 64]} />
          <meshStandardMaterial
            map={ringMap}
            transparent
            opacity={0.92}
            side={THREE.DoubleSide}
            roughness={0.35}
          />
        </mesh>
      </group>
    </group>
  );
}

/* ── Jupiter (NASA Texture) ─────────────────────────────────────────── */
function JupiterObject({ active }: { active: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const jupiterMap = useTexture(TEX.jupiter);

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.06;
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.05, 32, 32]} />
        <meshStandardMaterial
          map={jupiterMap}
          roughness={0.45}
          metalness={0.1}
          emissive="#cc7722"
          emissiveIntensity={active ? 0.6 : 0.35}
        />
      </mesh>
    </group>
  );
}

/* ── Mars (NASA Texture) ────────────────────────────────────────────── */
function MarsObject({ active }: { active: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const marsMap = useTexture(TEX.mars);

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.09;
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.88, 32, 32]} />
        <meshStandardMaterial
          map={marsMap}
          roughness={0.55}
          metalness={0.15}
          emissive="#aa3300"
          emissiveIntensity={active ? 0.6 : 0.35}
        />
      </mesh>
    </group>
  );
}

/* ── Moon (NASA Texture) ────────────────────────────────────────────── */
function MoonObject({ active }: { active: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const moonMap = useTexture(TEX.moon);

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.05;
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.88, 32, 32]} />
        <meshStandardMaterial
          map={moonMap}
          roughness={0.75}
          metalness={0.05}
          emissive="#9ca3af"
          emissiveIntensity={active ? 0.45 : 0.2}
        />
      </mesh>
      <group position={[0, 0, 0.84]}>
        <mesh>
          <boxGeometry args={[0.48, 0.15, 0.12]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1.5} />
        </mesh>
        <mesh>
          <boxGeometry args={[0.15, 0.48, 0.12]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1.5} />
        </mesh>
      </group>
    </group>
  );
}

/* ── Neptune Ice Planet (Expense Tracker) ────────────────────────────── */
function NeptuneObject({ active }: { active: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const neptuneMap = useTexture(TEX.neptune);

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.07;
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.92, 32, 32]} />
        <meshStandardMaterial
          map={neptuneMap}
          roughness={0.5}
          metalness={0.08}
          emissive="#1e3a5f"
          emissiveIntensity={active ? 0.5 : 0.25}
        />
      </mesh>
    </group>
  );
}

/* ── Book Cluster (Procedural — no real-world equivalent) ────────────── */
function BookClusterObject({ active }: { active: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.22;
      groupRef.current.rotation.x += delta * 0.1;
    }
  });

  const books = [
    { pos: [0, 0, 0], rot: [0.2, 0.4, 0], color: "#f59e0b" },
    { pos: [0.5, 0.32, 0.2], rot: [-0.3, 0.6, 0.2], color: "#38bdf8" },
    { pos: [-0.45, -0.28, 0.3], rot: [0.4, -0.2, 0.5], color: "#ec4899" },
    { pos: [0.22, -0.42, -0.3], rot: [-0.5, -0.4, -0.2], color: "#10b981" },
    { pos: [-0.38, 0.42, -0.2], rot: [0.3, 0.7, -0.4], color: "#a855f7" },
  ];

  return (
    <group ref={groupRef}>
      {books.map((b, i) => (
        <mesh key={i} position={b.pos as [number, number, number]} rotation={b.rot as [number, number, number]}>
          <boxGeometry args={[0.6, 0.75, 0.2]} />
          <meshStandardMaterial
            color={b.color}
            roughness={0.35}
            metalness={0.2}
            emissive={b.color}
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
      <mesh rotation={[Math.PI * 0.4, 0, 0]}>
        <ringGeometry args={[1.0, 1.1, 32]} />
        <meshBasicMaterial color="#f59e0b" transparent opacity={0.65} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

/* ── Cyber Holographic Quantum Chat Globe (Procedural) ───────────────── */
function TerminalAsteroidObject({ active }: { active: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const children = groupRef.current.children as THREE.Object3D[];
    if (children[0]) children[0].rotation.y += delta * 0.2;
    if (children[1]) children[1].rotation.y -= delta * 0.25;
    if (children[2]) children[2].rotation.z += delta * 0.4;
    if (children[3]) children[3].rotation.x -= delta * 0.35;
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <icosahedronGeometry args={[0.88, 2]} />
        <meshStandardMaterial
          color="#fb7185"
          roughness={0.15}
          metalness={0.8}
          emissive="#fb7185"
          emissiveIntensity={active ? 2.2 : 1.4}
          transparent
          opacity={0.85}
        />
      </mesh>
      <group>
        <mesh position={[0, 0.05, 0]}>
          <torusGeometry args={[0.35, 0.12, 16, 32]} />
          <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={active ? 3.5 : 2.2} roughness={0.1} />
        </mesh>
        <mesh position={[0.22, -0.32, 0]} rotation={[0, 0, -0.6]}>
          <coneGeometry args={[0.12, 0.28, 4]} />
          <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={active ? 3.5 : 2.2} />
        </mesh>
      </group>
      <mesh rotation={[Math.PI * 0.35, 0, 0]}>
        <ringGeometry args={[1.15, 1.25, 64]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.75} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[0, Math.PI * 0.4, 0]}>
        <ringGeometry args={[1.32, 1.38, 64]} />
        <meshBasicMaterial color="#fb7185" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>


    </group>
  );
}

/* ── Detailed Satellite Spacecraft (Screen Recorder) ─────────────────── */
function SatelliteObject({ active }: { active: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.12;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main spacecraft bus — gold Kapton foil insulation */}
      <mesh>
        <boxGeometry args={[0.55, 0.55, 0.7]} />
        <meshStandardMaterial color="#d4a017" metalness={0.7} roughness={0.35} />
      </mesh>

      {/* Left solar panel arm */}
      <mesh position={[-0.42, 0, 0]}>
        <boxGeometry args={[0.28, 0.04, 0.04]} />
        <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.15} />
      </mesh>
      {/* Left solar panel */}
      <group position={[-0.92, 0, 0]}>
        {/* Panel backing */}
        <mesh>
          <boxGeometry args={[0.72, 0.52, 0.03]} />
          <meshStandardMaterial color="#1e3a5f" metalness={0.6} roughness={0.3} />
        </mesh>
        {/* Solar cell grid — 6 cells */}
        {[-0.22, 0, 0.22].map((cx, ci) =>
          [-0.13, 0.13].map((cy, ri) => (
            <mesh key={`l-${ci}-${ri}`} position={[cx, cy, 0.018]}>
              <boxGeometry args={[0.2, 0.22, 0.005]} />
              <meshStandardMaterial color="#0c4a6e" emissive="#0369a1" emissiveIntensity={active ? 0.8 : 0.4} metalness={0.85} roughness={0.1} />
            </mesh>
          ))
        )}
      </group>

      {/* Right solar panel arm */}
      <mesh position={[0.42, 0, 0]}>
        <boxGeometry args={[0.28, 0.04, 0.04]} />
        <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.15} />
      </mesh>
      {/* Right solar panel */}
      <group position={[0.92, 0, 0]}>
        <mesh>
          <boxGeometry args={[0.72, 0.52, 0.03]} />
          <meshStandardMaterial color="#1e3a5f" metalness={0.6} roughness={0.3} />
        </mesh>
        {[-0.22, 0, 0.22].map((cx, ci) =>
          [-0.13, 0.13].map((cy, ri) => (
            <mesh key={`r-${ci}-${ri}`} position={[cx, cy, 0.018]}>
              <boxGeometry args={[0.2, 0.22, 0.005]} />
              <meshStandardMaterial color="#0c4a6e" emissive="#0369a1" emissiveIntensity={active ? 0.8 : 0.4} metalness={0.85} roughness={0.1} />
            </mesh>
          ))
        )}
      </group>

      {/* Antenna boom */}
      <mesh position={[0, 0.48, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.5, 8]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* Parabolic communication dish */}
      <mesh position={[0, 0.75, 0]} rotation={[0.3, 0, 0]}>
        <sphereGeometry args={[0.22, 24, 12, 0, Math.PI * 2, 0, Math.PI * 0.45]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.85} roughness={0.1} side={THREE.DoubleSide} />
      </mesh>

      {/* Dish feed horn */}
      <mesh position={[0, 0.76, 0.08]}>
        <cylinderGeometry args={[0.02, 0.02, 0.12, 6]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Bottom thruster nozzle */}
      <mesh position={[0, -0.35, 0]}>
        <coneGeometry args={[0.1, 0.15, 12]} />
        <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.25} />
      </mesh>
    </group>
  );
}

/* ── Celestial Body Router ───────────────────────────────────────────── */
function CelestialBody({ slug, active }: { slug: string; active: boolean }) {
  switch (slug) {
    case "atlas-jobs":
      return <SunObject active={active} />;
    case "earth-twin":
      return <EarthObject active={active} />;
    case "expense-tracker-application":
      return <NeptuneObject active={active} />;
    case "course-planning-assistant":
      return <BookClusterObject active={active} />;
    case "gus-marketplace":
      return <SaturnObject active={active} />;
    case "clustering-research-paper":
      return <JupiterObject active={active} />;
    case "hospital-management-system":
      return <MoonObject active={active} />;
    case "real-time-chat-application":
      return <TerminalAsteroidObject active={active} />;
    case "screen-recorder-project":
      return <SatelliteObject active={active} />;
    case "used-car-price-prediction":
      return <MarsObject active={active} />;
    default:
      return <SunObject active={active} />;
  }
}

/* ── Holographic Code Cards ─────────────────────────────────────────── */
function HoloCodeCard({ project, isMobile }: { project: Project; isMobile: boolean }) {
  const codeSnippets: Record<string, Array<{ label: string; code: string }>> = {
    "atlas-jobs": [
      { label: "Java", code: "SELECT * FROM jobs WHERE status='PENDING' FOR UPDATE SKIP LOCKED;" },
      { label: "Spring Boot", code: "@Scheduled(fixedDelay = 1000)\npublic void processBatch() { ... }" },
    ],
    "earth-twin": [
      { label: "FastAPI", code: "@app.post('/simulate')\nasync def geo_sim(req: SimInput):" },
      { label: "Cesium", code: "viewer.entities.add({ position: Cartographic... });" },
    ],
  };

  const snippets = codeSnippets[project.slug] || [
    { label: project.tech[0] || "Tech", code: `// ${project.tagline}` },
  ];

  if (isMobile) return null; // Keep mobile view clean without floating code boxes

  return (
    <div className="pointer-events-none absolute -top-14 left-full ml-3 flex flex-col gap-1.5">
      {snippets.map((s, i) => (
        <div
          key={i}
          className="w-48 overflow-hidden rounded-xl border border-cyan-500/30 bg-slate-950/90 p-2 shadow-[0_0_24px_rgba(6,182,212,0.25)] backdrop-blur-md transition-all duration-300"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-1 text-[0.52rem] font-bold uppercase tracking-widest text-cyan-400">
            <span>{s.label}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
          </div>
          <pre className="mt-1 font-mono text-[0.5rem] leading-snug text-slate-300 whitespace-pre-wrap break-all">
            <code>{s.code}</code>
          </pre>
        </div>
      ))}
    </div>
  );
}

interface MeteorProps {
  project: Project;
  index: number;
  total: number;
  selected: boolean;
  reduce: boolean;
  isMobile: boolean;
  onSelect: (slug: string) => void;
}

function Meteor({ project, index, total, selected, reduce, isMobile, onSelect }: MeteorProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const position = useMemo(
    () => getPositionForProject(project.slug, index, total, isMobile),
    [project.slug, index, total, isMobile]
  );

  const active = hovered || selected;

  return (
    <Float
      enabled={!reduce}
      speed={1.1 + (index % 3) * 0.4}
      rotationIntensity={0.18}
      floatIntensity={0.45}
      position={position}
    >
      <group
        ref={groupRef}
        scale={active ? 1.2 : 1}
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
        {active && (
          <mesh rotation={[Math.PI * 0.4, 0, 0]}>
            <ringGeometry args={[1.5, 1.58, 32]} />
            <meshBasicMaterial color={project.accent} transparent opacity={0.85} side={THREE.DoubleSide} />
          </mesh>
        )}

        {!reduce && active && (
          <Sparkles
            count={isMobile ? 10 : 18}
            scale={[2.2, 2.2, 2.2]}
            size={3.5}
            speed={0.4}
            opacity={0.65}
            color={project.accent}
          />
        )}

        <CelestialBody slug={project.slug} active={active} />

        <Html
          position={[0, -1.35, 0]}
          center
          distanceFactor={isMobile ? 15 : 11}
          pointerEvents="none"
          zIndexRange={[20, 0]}
        >
          <div className="relative pointer-events-none select-none text-center transition-all duration-300">
            <p
              className="text-[0.52rem] sm:text-[0.55rem] font-bold uppercase tracking-[0.32em]"
              style={{ color: project.accent, textShadow: `0 0 14px ${project.accent}88` }}
            >
              {project.status}
            </p>
            <h3
              className="mt-0.5 font-display text-[0.92rem] sm:text-[1.05rem] font-bold leading-tight text-white whitespace-nowrap"
              style={{ textShadow: "0 2px 16px rgba(0,0,0,0.95)" }}
            >
              {project.name}
            </h3>

            <div className="mt-1 flex justify-center gap-1">
              {project.tech.slice(0, isMobile ? 2 : 3).map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/15 bg-slate-950/80 px-2 py-0.5 text-[0.5rem] sm:text-[0.54rem] uppercase tracking-wider text-slate-200 backdrop-blur-md"
                >
                  {item}
                </span>
              ))}
            </div>

            {hovered && <HoloCodeCard project={project} isMobile={isMobile} />}
          </div>
        </Html>
      </group>
    </Float>
  );
}



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
  const wrapRef = useRef<HTMLDivElement>(null);
  const [onScreen, setOnScreen] = useState(true);

  // Responsive Device Detection (Mobile / Tablet / Desktop)
  const [windowWidth, setWindowWidth] = useState<number>(1200);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;
  const cameraZ = isMobile ? 36 : isTablet ? 27 : 22;

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), { rootMargin: "150px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="relative h-[78vh] sm:h-[82vh] md:h-[85vh] min-h-[500px] sm:min-h-[600px] md:min-h-[660px] w-full cursor-grab active:cursor-grabbing touch-none">
      <Canvas
        camera={{ position: [0, 0, cameraZ], fov: isMobile ? 48 : 45 }}
        dpr={isMobile ? [1, 1] : [1, 1.5]}
        frameloop={onScreen ? "always" : "never"}
        gl={{ alpha: true, antialias: !isMobile, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.6} color="#475569" />
        <directionalLight position={[10, 12, 10]} intensity={3.2} color="#fff7ed" />
        <directionalLight position={[-10, -6, -8]} intensity={1.4} color="#1e3a8a" />

        <Suspense fallback={null}>
          <OrbitalGrid isMobile={isMobile} />

          {projects.map((project, index) => (
            <Meteor
              key={project.slug}
              project={project}
              index={index}
              total={projects.length}
              selected={selectedSlug === project.slug}
              reduce={reduce}
              isMobile={isMobile}
              onSelect={onSelect}
            />
          ))}

          <Sparkles count={isMobile ? 30 : 50} scale={[30, 20, 15]} size={isMobile ? 2 : 3} speed={reduce ? 0 : 0.35} opacity={0.65} color="#e0f2fe" />
          <Stars radius={110} depth={60} count={isMobile ? 400 : 800} factor={4.5} fade speed={reduce ? 0 : 0.4} />
        </Suspense>

        <OrbitControls
          makeDefault
          enablePan={false}
          enableZoom={false}
          enableDamping
          dampingFactor={0.08}
          rotateSpeed={isMobile ? 0.6 : 0.45}
          autoRotate={false}
          minPolarAngle={Math.PI * 0.28}
          maxPolarAngle={Math.PI * 0.68}
          minAzimuthAngle={-0.6}
          maxAzimuthAngle={0.6}
          touches={{ ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.PAN }}
        />
      </Canvas>

      <div className="pointer-events-none absolute bottom-3 sm:bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-slate-950/75 px-3.5 sm:px-4 py-1.5 text-[0.55rem] sm:text-[0.62rem] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-slate-200 backdrop-blur-md shadow-lg whitespace-nowrap">
        <span className="inline-block h-1.5 w-1.5 animate-ping rounded-full bg-cyan-400" />
        {isMobile ? "Swipe to Rotate · Tap a Planet" : "Drag to Orbit · Click a Planet"}
      </div>
    </div>
  );
}
