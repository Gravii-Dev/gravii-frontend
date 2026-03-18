const F2 = 0.5 * (Math.sqrt(3) - 1);
const G2 = (3 - Math.sqrt(3)) / 6;
const grad3: ReadonlyArray<readonly [number, number]> = [
  [1, 1],
  [-1, 1],
  [1, -1],
  [-1, -1],
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

export type PermTable = {
  perm: Uint8Array;
  permMod8: Uint8Array;
};

export function buildPermTable(seed: number): PermTable {
  const p = new Uint8Array(256);

  for (let i = 0; i < 256; i += 1) {
    p[i] = i;
  }

  let s = seed;
  for (let i = 255; i > 0; i -= 1) {
    s = (s * 16807) % 2147483647;
    const j = s % (i + 1);
    [p[i], p[j]] = [p[j], p[i]];
  }

  const perm = new Uint8Array(512);
  const permMod8 = new Uint8Array(512);
  for (let i = 0; i < 512; i += 1) {
    perm[i] = p[i & 255];
    permMod8[i] = perm[i] % 8;
  }

  return { perm, permMod8 };
}

export function simplex2D(
  x: number,
  y: number,
  perm: Uint8Array,
  permMod8: Uint8Array,
): number {
  const s = (x + y) * F2;
  const i = Math.floor(x + s);
  const j = Math.floor(y + s);
  const t = (i + j) * G2;
  const X0 = i - t;
  const Y0 = j - t;
  const x0 = x - X0;
  const y0 = y - Y0;
  const i1 = x0 > y0 ? 1 : 0;
  const j1 = x0 > y0 ? 0 : 1;
  const x1 = x0 - i1 + G2;
  const y1 = y0 - j1 + G2;
  const x2 = x0 - 1 + 2 * G2;
  const y2 = y0 - 1 + 2 * G2;
  const ii = i & 255;
  const jj = j & 255;

  let n0 = 0;
  let n1 = 0;
  let n2 = 0;
  let t0 = 0.5 - x0 * x0 - y0 * y0;

  if (t0 > 0) {
    t0 *= t0;
    const g = grad3[permMod8[ii + perm[jj]]];
    n0 = t0 * t0 * (g[0] * x0 + g[1] * y0);
  }

  let t1 = 0.5 - x1 * x1 - y1 * y1;
  if (t1 > 0) {
    t1 *= t1;
    const g = grad3[permMod8[ii + i1 + perm[jj + j1]]];
    n1 = t1 * t1 * (g[0] * x1 + g[1] * y1);
  }

  let t2 = 0.5 - x2 * x2 - y2 * y2;
  if (t2 > 0) {
    t2 *= t2;
    const g = grad3[permMod8[ii + 1 + perm[jj + 1]]];
    n2 = t2 * t2 * (g[0] * x2 + g[1] * y2);
  }

  return 70 * (n0 + n1 + n2);
}
