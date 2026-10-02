// Isometric projection helpers. World axes: +x runs down-right on screen, +y runs
// down-left, +z is straight up. Everything is in scene pixels (1200 x 800 stage).

export const STAGE_W = 1200;
export const STAGE_H = 800;
export const ORIGIN_X = 600;
export const ORIGIN_Y = 350;

export const C = Math.cos(Math.PI / 6);
export const S = 0.5;

export type Pt = [number, number];

export const iso = (x: number, y: number, z = 0): Pt => [
  ORIGIN_X + (x - y) * C,
  ORIGIN_Y + (x + y) * S - z,
];

const r = (n: number) => Math.round(n * 10) / 10;

export const pts = (list: Pt[]) => list.map(([a, b]) => `${r(a)},${r(b)}`).join(" ");

export interface BoxFaces {
  top: string;
  left: string; // face at y = y + d (spans x, faces down-left)
  right: string; // face at x = x + w (spans y, faces down-right)
}

export const box = (
  x: number,
  y: number,
  z: number,
  w: number,
  d: number,
  h: number
): BoxFaces => ({
  top: pts([
    iso(x, y, z + h),
    iso(x + w, y, z + h),
    iso(x + w, y + d, z + h),
    iso(x, y + d, z + h),
  ]),
  left: pts([
    iso(x, y + d, z),
    iso(x + w, y + d, z),
    iso(x + w, y + d, z + h),
    iso(x, y + d, z + h),
  ]),
  right: pts([
    iso(x + w, y, z),
    iso(x + w, y + d, z),
    iso(x + w, y + d, z + h),
    iso(x + w, y, z + h),
  ]),
});

// SVG transforms that map flat local drawing (x right, y down) onto a box face.
export const onLeftFace = (x: number, y: number, z: number) => {
  const [sx, sy] = iso(x, y, z);
  return `matrix(${C} ${S} 0 1 ${r(sx)} ${r(sy)})`;
};

export const onRightFace = (x: number, y: number, z: number) => {
  const [sx, sy] = iso(x, y, z);
  return `matrix(${C} ${-S} 0 1 ${r(sx)} ${r(sy)})`;
};
