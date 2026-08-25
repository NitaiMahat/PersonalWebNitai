"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

/* Each star is a glowing point. The vertex shader spins every star around the
   galactic centre with DIFFERENTIAL rotation (inner stars orbit faster), which
   is what makes it read as a living galaxy instead of a flat picture. */
const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  attribute float aScale;
  attribute vec3 aColor;
  varying vec3 vColor;

  void main() {
    vec3 p = position;
    float radius = length(p.xz);
    float angle = atan(p.z, p.x);
    angle += uTime * (0.35 / (radius + 0.4)); // inner = faster
    p.x = cos(angle) * radius;
    p.z = sin(angle) * radius;

    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = uSize * aScale;
    gl_PointSize *= (1.0 / -mvPosition.z);

    vColor = aColor;
  }
`;

const fragmentShader = /* glsl */ `
  varying vec3 vColor;

  void main() {
    // soft glowing disc per particle
    float d = distance(gl_PointCoord, vec2(0.5));
    float strength = 0.05 / d - 0.1;
    strength = clamp(strength, 0.0, 1.0);
    gl_FragColor = vec4(vColor, strength);
  }
`;

function seededRandGalaxy(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

function ParticleGalaxy() {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const reduce = useReducedMotion();

  const geometry = useMemo(() => {
    const COUNT = 16000;
    const RADIUS = 8;
    const BRANCHES = 4;
    const SPIN = 0.9;
    const RANDOMNESS = 0.35;
    const POWER = 3;
    const inside = new THREE.Color("#ffe9fb"); // bright violet-white core
    const outside = new THREE.Color("#5a2ea6"); // deep purple arms

    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const scales = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;
      const r = seededRandGalaxy(i * 5 + 1) * RADIUS;
      const branchAngle = ((i % BRANCHES) / BRANCHES) * Math.PI * 2;
      const baseAngle = branchAngle + r * SPIN;
      const scatter = (mul = 1, seedOffset = 0) =>
        Math.pow(seededRandGalaxy(i * 13 + seedOffset + 2), POWER) *
        (seededRandGalaxy(i * 17 + seedOffset + 3) < 0.5 ? 1 : -1) *
        RANDOMNESS *
        r *
        mul;

      positions[i3] = Math.cos(baseAngle) * r + scatter(1, 0);
      positions[i3 + 1] = scatter(0.5, 100); // keep the disc fairly flat
      positions[i3 + 2] = Math.sin(baseAngle) * r + scatter(1, 200);

      const col = inside.clone().lerp(outside, r / RADIUS);
      colors[i3] = col.r;
      colors[i3 + 1] = col.g;
      colors[i3 + 2] = col.b;

      scales[i] = seededRandGalaxy(i * 23 + 4);
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
    g.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    return g;
  }, []);

  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uSize: { value: 38 } }),
    []
  );

  useFrame((state) => {
    if (matRef.current && !reduce) {
      matRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <points geometry={geometry}>
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function GalaxyBackground() {
  const reduce = useReducedMotion();

  // Pause the galaxy once the hero scrolls off-screen so it doesn't keep
  // burning frames behind the rest of the page.
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
    <div ref={wrapRef} className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing touch-pan-y pointer-events-none sm:pointer-events-auto">
      {/* Zoomed-in, oblique view. OrbitControls = drag to orbit, scroll to zoom. */}
      <Canvas
        camera={{ position: [0, 3, 6], fov: 60 }}
        dpr={[1, 1.75]}
        frameloop={onScreen ? "always" : "never"}
      >
        <color attach="background" args={["#05050a"]} />
        <ParticleGalaxy />
        <Stars radius={140} depth={70} count={2000} factor={4} fade speed={0.5} />

        <OrbitControls
          makeDefault
          enablePan={false}
          enableZoom={false}
          enableDamping
          dampingFactor={0.08}
          rotateSpeed={0.6}
          autoRotate={!reduce}
          autoRotateSpeed={0.45}
          minPolarAngle={Math.PI * 0.1}
          maxPolarAngle={Math.PI * 0.9}
        />
      </Canvas>

      {/* Light vignette so the centered figure + name stay readable */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_65%_at_50%_50%,transparent_45%,var(--background)_100%)]" />

      {/* Discoverability hint */}
      <div className="pointer-events-none absolute bottom-4 sm:bottom-6 left-4 sm:left-6 z-10 hidden sm:flex items-center gap-2 text-[0.65rem] sm:text-[0.7rem] uppercase tracking-[0.2em] text-muted/70">
        <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-accent-soft" />
        Drag to orbit
      </div>
    </div>
  );
}
