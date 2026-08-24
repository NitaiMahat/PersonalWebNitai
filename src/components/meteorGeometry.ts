import * as THREE from "three";

/* ── Deterministic RNG ────────────────────────────────────────────────
   mulberry32 — small, fast, seedable. Same seed → same rock, every render
   (and matching on server/client so hydration stays stable).            */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ── 3D Simplex noise ───────────────────────────────────────────────── */
const GRAD3: ReadonlyArray<readonly [number, number, number]> = [
  [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
  [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
  [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1],
];

class SimplexNoise3D {
  private perm: number[] = new Array(512);

  constructor(random: () => number = Math.random) {
    const p: number[] = new Array(256);
    for (let i = 0; i < 256; i++) p[i] = Math.floor(random() * 256);
    for (let i = 0; i < 512; i++) this.perm[i] = p[i & 255];
  }

  private static dot(
    g: readonly [number, number, number],
    x: number,
    y: number,
    z: number
  ): number {
    return g[0] * x + g[1] * y + g[2] * z;
  }

  noise(xin: number, yin: number, zin: number): number {
    const perm = this.perm;
    let n0 = 0, n1 = 0, n2 = 0, n3 = 0;

    const F3 = 1.0 / 3.0;
    const s = (xin + yin + zin) * F3;
    const i = Math.floor(xin + s);
    const j = Math.floor(yin + s);
    const k = Math.floor(zin + s);
    const G3 = 1.0 / 6.0;
    const t = (i + j + k) * G3;
    const X0 = i - t, Y0 = j - t, Z0 = k - t;
    const x0 = xin - X0, y0 = yin - Y0, z0 = zin - Z0;

    let i1: number, j1: number, k1: number;
    let i2: number, j2: number, k2: number;
    if (x0 >= y0) {
      if (y0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
      else if (x0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1; }
      else { i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1; }
    } else {
      if (y0 < z0) { i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1; }
      else if (x0 < z0) { i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1; }
      else { i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
    }

    const x1 = x0 - i1 + G3, y1 = y0 - j1 + G3, z1 = z0 - k1 + G3;
    const x2 = x0 - i2 + 2.0 * G3, y2 = y0 - j2 + 2.0 * G3, z2 = z0 - k2 + 2.0 * G3;
    const x3 = x0 - 1.0 + 3.0 * G3, y3 = y0 - 1.0 + 3.0 * G3, z3 = z0 - 1.0 + 3.0 * G3;

    const ii = i & 255, jj = j & 255, kk = k & 255;
    const gi0 = perm[ii + perm[jj + perm[kk]]] % 12;
    const gi1 = perm[ii + i1 + perm[jj + j1 + perm[kk + k1]]] % 12;
    const gi2 = perm[ii + i2 + perm[jj + j2 + perm[kk + k2]]] % 12;
    const gi3 = perm[ii + 1 + perm[jj + 1 + perm[kk + 1]]] % 12;

    let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
    if (t0 >= 0) { t0 *= t0; n0 = t0 * t0 * SimplexNoise3D.dot(GRAD3[gi0], x0, y0, z0); }
    let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
    if (t1 >= 0) { t1 *= t1; n1 = t1 * t1 * SimplexNoise3D.dot(GRAD3[gi1], x1, y1, z1); }
    let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
    if (t2 >= 0) { t2 *= t2; n2 = t2 * t2 * SimplexNoise3D.dot(GRAD3[gi2], x2, y2, z2); }
    let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
    if (t3 >= 0) { t3 *= t3; n3 = t3 * t3 * SimplexNoise3D.dot(GRAD3[gi3], x3, y3, z3); }

    return 32.0 * (n0 + n1 + n2 + n3);
  }
}

/* ── Realistic meteor geometry ────────────────────────────────────────
   Subdivided icosahedron deformed by multi-octave 3D simplex noise, impact
   craters, and procedural vertex coloring for mineral veins & burnt crust. */
export function makeMeteorGeometry(
  seed: number,
  accentHex: string = "#3fb6ff",
  radius = 1,
  detail = 4
): THREE.BufferGeometry {
  const rng = mulberry32(seed);
  const simplex = new SimplexNoise3D(rng);

  const geo = new THREE.IcosahedronGeometry(radius, detail);
  const pos = geo.attributes.position as THREE.BufferAttribute;

  const accent = new THREE.Color(accentHex);

  // Pre-pick a few crater centres (unit directions) with depth + radius.
  const craterCount = 3 + Math.floor(rng() * 3); // 3–5 craters
  const craters = Array.from({ length: craterCount }, () => {
    const dir = new THREE.Vector3(
      rng() * 2 - 1,
      rng() * 2 - 1,
      rng() * 2 - 1
    ).normalize();
    return {
      dir,
      angRadius: 0.25 + rng() * 0.35,
      depth: 0.12 + rng() * 0.16,
    };
  });

  const v = new THREE.Vector3();
  const n = new THREE.Vector3();

  const colors = new Float32Array(pos.count * 3);

  // Base rock colors
  const darkRock = new THREE.Color("#1c1b22"); // burnt crust / inner crater
  const midRock = new THREE.Color("#4a464f");  // main granite / basalt
  const highRock = new THREE.Color("#827d8a"); // mineral ridge highlights

  const tempColor = new THREE.Color();

  for (let idx = 0; idx < pos.count; idx++) {
    v.fromBufferAttribute(pos, idx);
    n.copy(v).normalize();

    // 4 octaves of simplex for organic noise detail
    let amp = 0.5;
    let freq = 1.2;
    let fbm = 0;
    for (let o = 0; o < 4; o++) {
      fbm += amp * simplex.noise(n.x * freq, n.y * freq, n.z * freq);
      amp *= 0.5;
      freq *= 2.1;
    }

    let disp = 1 + fbm * 0.35;
    let craterDepthFactor = 0;

    // Carve craters
    for (const c of craters) {
      const ang = n.angleTo(c.dir);
      if (ang < c.angRadius) {
        const tt = ang / c.angRadius;
        const bowl = Math.cos(tt * Math.PI * 0.5);
        const d = c.depth * bowl * bowl;
        disp -= d;
        craterDepthFactor += bowl;
        if (tt > 0.72) disp += c.depth * 0.4 * (tt - 0.72) * 3.5;
      }
    }

    v.copy(n).multiplyScalar(radius * disp);
    pos.setXYZ(idx, v.x, v.y, v.z);

    // Color calculation
    // Crevices & craters get dark rock tone
    // Ridges get lighter rock tone
    // Mineral veins (where fbm noise falls in a thin band) get glowing accent tint!
    const heightFactor = Math.min(1, Math.max(0, (disp - 0.75) / 0.6));
    tempColor.copy(darkRock).lerp(midRock, heightFactor);

    if (heightFactor > 0.65) {
      tempColor.lerp(highRock, (heightFactor - 0.65) * 2.8);
    }

    if (craterDepthFactor > 0.3) {
      tempColor.lerp(darkRock, Math.min(1, craterDepthFactor * 0.8));
    }

    // Energy vein: glowing accent lines running through the rock
    const veinNoise = Math.abs(simplex.noise(n.x * 3.5, n.y * 3.5, n.z * 3.5));
    if (veinNoise < 0.08) {
      const veinIntensity = (1 - veinNoise / 0.08) * 0.85;
      tempColor.lerp(accent, veinIntensity);
    }

    colors[idx * 3] = tempColor.r;
    colors[idx * 3 + 1] = tempColor.g;
    colors[idx * 3 + 2] = tempColor.b;
  }

  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  pos.needsUpdate = true;
  geo.computeVertexNormals();
  geo.computeBoundingSphere();
  return geo;
}
