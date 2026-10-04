import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { MoveHorizontal } from "lucide-react";
import { box, iso, onLeftFace, onRightFace, pts, C, S, STAGE_H, STAGE_W, type Pt } from "./iso";
import "./harbor.css";

const r1 = (n: number) => Math.round(n * 10) / 10;

/* ---------------------------------------------------------------------------
   Primitives
--------------------------------------------------------------------------- */

const Box = ({
  x,
  y,
  z,
  w,
  d,
  h,
  className = "",
}: {
  x: number;
  y: number;
  z: number;
  w: number;
  d: number;
  h: number;
  className?: string;
}) => {
  const f = box(x, y, z, w, d, h);
  return (
    <g className={className}>
      <polygon className="hb-top" points={f.top} />
      <polygon className="hb-left" points={f.left} />
      <polygon className="hb-right" points={f.right} />
    </g>
  );
};

// A positioned SVG that only covers its own bounding box, so animated pieces
// become small compositor layers instead of full-stage textures.
const Sprite = ({
  x,
  y,
  w,
  h,
  className = "",
  style,
  children,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) => (
  <div
    className={`hb-sprite ${className}`}
    style={{ left: x, top: y, width: w, height: h, ...style }}
  >
    <svg
      width={w}
      height={h}
      viewBox={`${x} ${y} ${w} ${h}`}
      overflow="visible"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  </div>
);

/* ---------------------------------------------------------------------------
   Ship
--------------------------------------------------------------------------- */

const DECK_Z = 34;
const CRATE = { w: 54, d: 31, h: 26 };
const BACK_Y = 3;
const FRONT_Y = 36;

interface Crate {
  x: number;
  y: number;
  level: number;
  label?: string;
  tip?: string;
  color: string;
}

const CRATES: Crate[] = [
  { x: -100, y: BACK_Y, level: 0, color: "teal" },
  { x: -100, y: BACK_Y, level: 1, label: "Kafka", tip: "Event streaming", color: "rust" },
  { x: -100, y: FRONT_Y, level: 0, label: "PostgreSQL", tip: "Relational data", color: "blue" },
  { x: -42, y: BACK_Y, level: 0, color: "rust" },
  { x: -42, y: FRONT_Y, level: 0, label: "MongoDB", tip: "Document store", color: "green" },
  { x: -42, y: FRONT_Y, level: 1, label: "AWS", tip: "Cloud platform", color: "mustard" },
  { x: 16, y: BACK_Y, level: 0, color: "mustard" },
  { x: 16, y: BACK_Y, level: 1, label: "RabbitMQ", tip: "Message broker", color: "teal" },
  { x: 16, y: FRONT_Y, level: 0, label: "Redis", tip: "Caching", color: "red" },
];

// The column under the crane's boom: unloaded onto the quay and back on a loop
// by CargoOps, so these are drawn separately from the static stacks.
const CARGO: Crate[] = [
  { x: 74, y: FRONT_Y, level: 0, label: "k6", tip: "Load testing", color: "purple" },
  { x: 74, y: BACK_Y, level: 1, label: "Nginx", tip: "Edge proxy", color: "green" },
  { x: 74, y: BACK_Y, level: 0, label: "Terraform", tip: "Infrastructure as code", color: "blue" },
];

// Crates with another crate stacked on top slide out on hover instead of lifting.
const crateHoverClass = (c: Crate, stack: Crate[]) =>
  stack.some((o) => o.x === c.x && o.y === c.y && o.level === c.level + 1)
    ? "hb-crate hb-crate--slide"
    : "hb-crate";

type HoverTip = { label: string; tip: string; x: number; y: number } | null;

const crateTipAnchor = (c: Crate, baseZ = DECK_Z): Pt => {
  const z = baseZ + (c.level + 1) * CRATE.h;
  const [sx, sy] = iso(c.x + CRATE.w / 2, c.y + CRATE.d / 2, z);
  return [sx, sy - 16];
};

const CrateShape = ({ c, z }: { c: Crate; z: number }) => {
  const { w, d, h } = CRATE;
  const ribs = [];
  for (let i = 6; i < w - 2; i += 6) ribs.push(i);
  return (
    <g className={`hb-c-${c.color}`}>
      <Box x={c.x} y={c.y} z={z} w={w} d={d} h={h} />
      {/* Corrugated roof: transverse ribs between the end rails. */}
      <path
        className="hb-rib hb-roof"
        d={ribs
          .map((i) => {
            const [ax, ay] = iso(c.x + i, c.y + 2, z + h);
            const [bx, by] = iso(c.x + i, c.y + d - 2, z + h);
            return `M${r1(ax)} ${r1(ay)}L${r1(bx)} ${r1(by)}`;
          })
          .join("")}
      />
      <g transform={onLeftFace(c.x, c.y + d, z)} className="hb-rib">
        {ribs.map((i) => (
          <line key={i} x1={i} y1={-h + 3} x2={i} y2={-3} />
        ))}
        {c.label && (
          <text
            x={w / 2}
            y={-9}
            textAnchor="middle"
            className="hb-label hb-crate-label"
            {...(c.label.length > 6
              ? { textLength: w - 10, lengthAdjust: "spacingAndGlyphs" }
              : {})}
          >
            {c.label}
          </text>
        )}
      </g>
      <g transform={onRightFace(c.x + w, c.y + d, z)} className="hb-rib">
        <line x1={d / 2} y1={-h + 3} x2={d / 2} y2={-3} />
        <line x1={d / 2 - 4} y1={-h + 6} x2={d / 2 - 4} y2={-6} />
        <line x1={d / 2 + 4} y1={-h + 6} x2={d / 2 + 4} y2={-6} />
      </g>
    </g>
  );
};

// Rounded bow in plan: a half-ellipse from the port rail (y=0) to the
// starboard rail (y=70). The keel line is tucked in for a little flare.
const BOW_STEPS = 18;
const bowCurve = (
  base: number,
  reach: number,
  z: number,
  { reverse = false, from = 0 }: { reverse?: boolean; from?: number } = {}
): Pt[] => {
  const out: Pt[] = [];
  for (let i = 0; i <= BOW_STEPS; i++) {
    const t = from + ((Math.PI - from) * i) / BOW_STEPS;
    out.push(iso(base + reach * Math.sin(t), 35 - 35 * Math.cos(t), z));
  }
  return reverse ? out.reverse() : out;
};
// Only the hull that faces the viewer (outward normal . (1,1) > 0) is drawn;
// the rest sits under the deck.
const bowVisible = (reach: number) => ({ from: Math.atan2(reach, 35) });

// Foam hugging the hull where it meets the water: along the flank, round the
// bow. Offset from the keel curve (base 146, reach 40) so it stays concentric.
const SHIP_FOAM = (() => {
  const g = 4;
  const from = Math.atan2(40 + g, 35 + g);
  const bow: Pt[] = [];
  for (let i = 0; i <= BOW_STEPS; i++) {
    const t = Math.PI - ((Math.PI - from) * i) / BOW_STEPS;
    bow.push(iso(146 + (40 + g) * Math.sin(t), 35 - (35 + g) * Math.cos(t), -8));
  }
  return `M${pts([iso(-158, 70 + g, -8), ...bow]).replace(/ /g, "L")}`;
})();

// Mooring lines: quay bollard -> ship cleat, sagging toward the water. A
// spring line leads aft and a bow line leads forward, like a real berth; both
// cleats sit forward of the deck cargo so the lines stay visible.
const CLEATS = [
  { x: 134, y: 1 },
  { x: 166, y: 8 },
];

const BRIDGE_H = 40;
const CAB_Z = DECK_Z + BRIDGE_H + 3;
const CAB_H = 17;
const ROOF_Z = CAB_Z + CAB_H + 3;
const RADAR_MAST_H = 16;
// Pivot points (top of each pedestal) for the spinning radar dishes.
const RADAR_MAIN = { x: -128, y: 42, z: ROOF_Z + 5 };
const RADAR_AUX = { x: -144, y: 20, z: ROOF_Z + RADAR_MAST_H + 4 };

// Painted deck, inset from the hull edge so a strip of worn steel shows round
// the gunwale. Inner bow: base 150, reach 40, half-beam 31.
const PAINT_IN = 4;
const paintBow = (t: number) => [150 + 40 * Math.sin(t), 35 - 31 * Math.cos(t)];
const DECK_PAINT = pts([
  iso(-160, PAINT_IN, DECK_Z),
  ...Array.from({ length: BOW_STEPS + 1 }, (_, i) => {
    const [x, y] = paintBow((Math.PI * i) / BOW_STEPS);
    return iso(x, y, DECK_Z);
  }),
  iso(-160, 70 - PAINT_IN, DECK_Z),
]);
// Transverse plate seams across the foredeck, clipped to the painted bow.
const DECK_SEAMS = [136, 152, 168, 182]
  .map((x) => {
    const half = x <= 150 ? 31 : 31 * Math.sqrt(1 - ((x - 150) / 40) ** 2);
    const [ax, ay] = iso(x, 35 - half, DECK_Z);
    const [bx, by] = iso(x, 35 + half, DECK_Z);
    return `M${r1(ax)} ${r1(ay)}L${r1(bx)} ${r1(by)}`;
  })
  .join("");
// Scuffs where crew and chain work: [x, y, rx, ry] (screen radii).
const DECK_GRIME: [number, number, number, number][] = [
  [158, 30, 9, 4],
  [170, 46, 7, 3],
  [140, 22, 6, 2.5],
  [178, 18, 5, 2],
];

// Anchor windlass: twin gypsies on a bedplate, chain running to the hawse
// pipes at the bow.
const WINDLASS = { x: 150, y: 22, w: 9, d: 26 };
const GYPSIES = [27, 43];
const HAWSE = [21, 49].map((y): Pt => {
  const t = Math.acos((35 - y) / 31);
  const [x] = paintBow(t);
  return [x - 2, y];
});

const Foredeck = () => {
  const gz = DECK_Z + 3;
  const chains = GYPSIES.map((gy, i) => {
    const [ax, ay] = iso(WINDLASS.x + WINDLASS.w / 2, gy, gz + 3);
    const [bx, by] = iso(HAWSE[i][0], HAWSE[i][1], DECK_Z);
    return `M${r1(ax)} ${r1(ay)}L${r1(bx)} ${r1(by)}`;
  }).join("");
  return (
    <>
      {/* Forepeak hatch, slightly proud of the deck. */}
      <Box x={134} y={44} z={DECK_Z} w={12} d={14} h={2} className="hb-c-hatch" />
      {HAWSE.map(([hx, hy]) => {
        const [sx, sy] = iso(hx, hy, DECK_Z);
        return <ellipse key={hy} className="hb-hawse" cx={sx} cy={sy} rx={3} ry={1.6} />;
      })}
      <path className="hb-chain" d={chains} />
      <path className="hb-chain hb-chain-link" d={chains} />
      <Box
        x={WINDLASS.x}
        y={WINDLASS.y}
        z={DECK_Z}
        w={WINDLASS.w}
        d={WINDLASS.d}
        h={3}
        className="hb-bollard"
      />
      {GYPSIES.map((gy) => (
        <Cylinder
          key={gy}
          cx={WINDLASS.x + WINDLASS.w / 2}
          cy={gy}
          z0={gz}
          z1={gz + 5}
          r0={3.6}
          r1={3.6}
          className="hb-c-red"
        />
      ))}
      {/* Mushroom vents. */}
      {[
        [142, 62],
        [150, 62],
      ].map(([vx, vy]) => (
        <g key={vx} className="hb-c-white">
          <Cylinder cx={vx} cy={vy} z0={DECK_Z} z1={DECK_Z + 6} r0={1.2} r1={1.2} />
          <Cylinder cx={vx} cy={vy} z0={DECK_Z + 6} z1={DECK_Z + 8} r0={2.8} r1={2.4} />
        </g>
      ))}
    </>
  );
};

const Ship = ({ onHover }: { onHover: (t: HoverTip) => void }) => {
  const deck = pts([iso(-160, 0, DECK_Z), ...bowCurve(150, 44, DECK_Z), iso(-160, 70, DECK_Z)]);
  const side = pts([
    iso(-152, 70, -8),
    iso(146, 70, -8),
    iso(150, 70, DECK_Z),
    iso(-160, 70, DECK_Z),
  ]);
  const bow = pts([
    ...bowCurve(150, 44, DECK_Z, bowVisible(44)),
    ...bowCurve(146, 40, -8, { ...bowVisible(40), reverse: true }),
  ]);
  const band = pts([iso(-152, 70, -8), iso(146, 70, -8), iso(147, 70, 4), iso(-154, 70, 4)]);
  const bowBand = pts([
    ...bowCurve(146, 40, -8, bowVisible(40)),
    ...bowCurve(147, 41, 4, { ...bowVisible(41), reverse: true }),
  ]);
  // One outline for the hull's silhouette so the flat side and curved bow read
  // as a single surface (no seam where the two polygons meet).
  const hullOutline = `M${pts([
    iso(-160, 70, DECK_Z),
    iso(-152, 70, -8),
    ...bowCurve(146, 40, -8, { ...bowVisible(40), reverse: true }),
    bowCurve(150, 44, DECK_Z, bowVisible(44))[0],
  ]).replace(/ /g, "L")}`;

  const sorted = [...CRATES].sort((a, b) => a.x + a.y - (b.x + b.y) || a.level - b.level);

  const shadow = pts([iso(-150, 70, 0), iso(146, 70, 0), iso(166, 94, 0), iso(-136, 94, 0)]);

  return (
    <>
      <polygon className="hb-cast" points={shadow} />
      <g className="hb-c-hull">
        <polygon className="hb-left hb-seamless" points={side} />
        <polygon className="hb-left hb-seamless" points={bow} />
        <polygon className="hb-hull-band hb-seamless" points={band} />
        <polygon className="hb-hull-band hb-seamless" points={bowBand} />
        <path className="hb-ink" d={hullOutline} />
        <g transform={onLeftFace(-108, 70, 13)}>
          <text className="hb-label hb-hull-label">JAVA · SPRING BOOT · K8S</text>
        </g>
      </g>
      <g className="hb-c-deck">
        <polygon className="hb-deck-rim" points={deck} />
        <polygon className="hb-top hb-seamless" points={DECK_PAINT} />
        <path className="hb-deck-seam" d={DECK_SEAMS} />
        <g className="hb-grime">
          {DECK_GRIME.map(([gx, gy, rx, ry], i) => {
            const [sx, sy] = iso(gx, gy, DECK_Z);
            return <ellipse key={i} cx={sx} cy={sy} rx={rx} ry={ry} />;
          })}
        </g>
      </g>
      <Foredeck />

      {CLEATS.map((c) => (
        <Box key={c.x} x={c.x} y={c.y} z={DECK_Z} w={5} d={5} h={4} className="hb-bollard" />
      ))}

      {/* Bridge: white accommodation block, then a wraparound glass wheelhouse. */}
      <g className="hb-c-white">
        <Box x={-156} y={8} z={DECK_Z} w={44} d={54} h={BRIDGE_H} />
        <g transform={onLeftFace(-156, 62, DECK_Z + BRIDGE_H)}>
          {[8, 20].flatMap((wy) =>
            [5, 15, 25, 35].map((wx) => (
              <rect key={`${wx}-${wy}`} x={wx} y={wy} width={5} height={5} className="hb-window" />
            ))
          )}
        </g>
        <g transform={onRightFace(-112, 62, DECK_Z + BRIDGE_H)}>
          {[8, 20].flatMap((wy) =>
            [6, 17, 28, 39].map((wx) => (
              <rect key={`${wx}-${wy}`} x={wx} y={wy} width={5} height={5} className="hb-window" />
            ))
          )}
        </g>
        <Box x={-160} y={4} z={DECK_Z + BRIDGE_H} w={52} d={62} h={3} />
      </g>
      <g className="hb-c-glass">
        <Box x={-152} y={13} z={CAB_Z} w={36} d={44} h={CAB_H} />
        <g transform={onLeftFace(-152, 57, CAB_Z + CAB_H)}>
          <path className="hb-glare" d={`M6 0h7l-9 ${CAB_H}h-4v-6zM18 0h3l-9 ${CAB_H}h-3z`} />
        </g>
        <g transform={onRightFace(-116, 57, CAB_Z + CAB_H)}>
          <path className="hb-glare" d={`M8 0h6l-9 ${CAB_H}h-5v-4zM22 0h3l-9 ${CAB_H}h-3z`} />
        </g>
      </g>
      <Box x={-155} y={10} z={CAB_Z + CAB_H} w={42} d={50} h={3} className="hb-c-white" />
      {/* Roof gear: whip antennas, a mast for the aux radar, pedestal for the main. */}
      <path
        className="hb-antenna"
        d={[
          [-151, 13, 26],
          [-118, 13, 20],
        ]
          .map(([ax, ay, ah]) => {
            const [bx0, by0] = iso(ax, ay, ROOF_Z);
            return `M${r1(bx0)} ${r1(by0)}v${-ah}`;
          })
          .join("")}
      />
      {[
        [-151, 13, 26],
        [-118, 13, 20],
      ].map(([ax, ay, ah]) => {
        const [bx0, by0] = iso(ax, ay, ROOF_Z + ah);
        return <circle key={ax} className="hb-antenna-tip" cx={bx0} cy={by0} r={1.6} />;
      })}
      <g className="hb-c-white">
        <Box x={RADAR_AUX.x - 2} y={RADAR_AUX.y - 2} z={ROOF_Z} w={4} d={4} h={RADAR_MAST_H} />
        <Box
          x={RADAR_AUX.x - 5}
          y={RADAR_AUX.y - 5}
          z={ROOF_Z + RADAR_MAST_H}
          w={10}
          d={10}
          h={2}
        />
      </g>
      <g className="hb-c-radar">
        <Cylinder
          cx={RADAR_AUX.x}
          cy={RADAR_AUX.y}
          z0={ROOF_Z + RADAR_MAST_H + 2}
          z1={RADAR_AUX.z}
          r0={2.6}
          r1={2}
        />
        <Cylinder
          cx={RADAR_MAIN.x}
          cy={RADAR_MAIN.y}
          z0={ROOF_Z}
          z1={RADAR_MAIN.z}
          r0={3.4}
          r1={2.6}
        />
      </g>

      {sorted.map((c, i) => {
        const z = DECK_Z + c.level * CRATE.h;
        if (!c.label) return <CrateShape key={i} c={c} z={z} />;
        const [tx, ty] = crateTipAnchor(c);
        return (
          <g
            key={i}
            className={crateHoverClass(c, CRATES)}
            onPointerEnter={() => onHover({ label: c.label!, tip: c.tip!, x: tx, y: ty })}
            onPointerLeave={() => onHover(null)}
          >
            <CrateShape c={c} z={z} />
          </g>
        );
      })}
    </>
  );
};

/* ---------------------------------------------------------------------------
   Crane (static portal) + cargo ops (animated)
--------------------------------------------------------------------------- */

const CRANE_X = 96;
const BOOM_Z = 216;
const BOOM_END_Y = 66;
const BOOM_BACK_Y = -230;
// Portal legs straddle the boom, set back so the quay slot under it stays clear.
const LEG_Y = -206;
const LEG = 10;
const LEGS_X = [80, 116];
const CAB = { x: 128, y: -210 };

// Faces only rise from the waterline; a tinted band + foam reads as submerged.
const QUAY_WATERLINE = 5;
// Quay slab with rounded corners in plan. Visible walls are the arcs whose
// outward normal faces the viewer (-45deg..135deg); they split at 45deg into
// the right-lit and left-lit faces, like a box's two visible sides.
const QUAY_Z = 24;
// The slab is the shore: it runs back and right well past the water and is
// clipped to the puddle's outline, so no water shows behind it. The working
// yard (grime, label, reflections) is the original front-left strip.
const QUAY_YARD = { y0: -210, x1: 340 };
const QUAY = { x0: 10, y0: -760, x1: 760, y1: -100, r: 18, h: QUAY_Z };
type Plan = [number, number][];
const quayArc = (cx: number, cy: number, a0: number, a1: number, n = 6): Plan =>
  Array.from({ length: n + 1 }, (_, i) => {
    const a = ((a0 + ((a1 - a0) * i) / n) * Math.PI) / 180;
    return [cx + QUAY.r * Math.cos(a), cy + QUAY.r * Math.sin(a)];
  });
const Q_BR: Pt = [QUAY.x1 - QUAY.r, QUAY.y0 + QUAY.r];
const Q_FR: Pt = [QUAY.x1 - QUAY.r, QUAY.y1 - QUAY.r];
const Q_FL: Pt = [QUAY.x0 + QUAY.r, QUAY.y1 - QUAY.r];
const Q_BL: Pt = [QUAY.x0 + QUAY.r, QUAY.y0 + QUAY.r];
const QUAY_RIGHT: Plan = [...quayArc(...Q_BR, -45, 0, 3), ...quayArc(...Q_FR, 0, 45, 3)];
const QUAY_LEFT: Plan = [...quayArc(...Q_FR, 45, 90, 3), ...quayArc(...Q_FL, 90, 135, 3)];
const quayWall = (run: Plan, z0: number, z1: number) =>
  pts([
    ...run.map(([x, y]) => iso(x, y, z0)),
    ...[...run].reverse().map(([x, y]) => iso(x, y, z1)),
  ]);
const quayTop = pts(
  [
    ...quayArc(...Q_BR, -90, 0),
    ...quayArc(...Q_FR, 0, 90),
    ...quayArc(...Q_FL, 90, 180),
    ...quayArc(...Q_BL, 180, 270),
  ].map(([x, y]) => iso(x, y, QUAY.h))
);
const quayFoam = `M${pts([...QUAY_RIGHT, ...QUAY_LEFT].map(([x, y]) => iso(x, y, 0))).replace(/ /g, "L")}`;

// Weathering: grime blotches (clusters of plan circles so each reads as one
// irregular stain), oil spots, hairline cracks, and rust runs below the bollards.
const QUAY_BOLLARDS = [40, 180, 250, 310];
const QUAY_GRIME = (() => {
  let seed = 7;
  const rnd = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const ellipse = (x: number, y: number, r: number) => {
    const [cx, cy] = iso(x, y, QUAY.h);
    return { cx: r1(cx), cy: r1(cy), rx: r1(r * 1.22), ry: r1(r * 0.71) };
  };
  const stains: ReturnType<typeof ellipse>[] = [];
  for (let i = 0; i < 9; i++) {
    const x = QUAY.x0 + 20 + rnd() * (QUAY_YARD.x1 - QUAY.x0 - 40);
    const y = QUAY_YARD.y0 + 14 + rnd() * (QUAY.y1 - QUAY_YARD.y0 - 28);
    const r = 8 + rnd() * 14;
    for (let k = 0; k < 3; k++)
      stains.push(
        ellipse(x + (rnd() - 0.5) * r * 1.6, y + (rnd() - 0.5) * r, r * (0.45 + rnd() * 0.5))
      );
  }
  const oil = [
    ellipse(132, -134, 5),
    ellipse(138, -131, 3),
    ellipse(226, -168, 6),
    ellipse(72, -150, 3.5),
  ];
  const crack = (x: number, y: number, len: number) => {
    const p: Pt[] = [];
    for (let i = 0; i <= 5; i++)
      p.push(iso(x + (len * i) / 5, y + (rnd() - 0.5) * 6 + i * 1.5, QUAY.h));
    return `M${pts(p).replace(/ /g, "L")}`;
  };
  const cracks = [crack(30, -190, 46), crack(196, -138, 38), crack(268, -196, 30)].join("");
  // Runs drip down the wall facing the ship below the bollards clear of the label.
  const rust = [40, 250, 310]
    .map((bx, i) => {
      const x = bx + 3 + (i % 2) * 2;
      const len = 9 + (i % 3) * 3;
      const [ax, ay] = iso(x, QUAY.y1, QUAY.h - 1);
      const [bx2, by2] = iso(x + 2, QUAY.y1, QUAY.h - 1);
      return `M${r1(ax)} ${r1(ay)}L${r1(bx2)} ${r1(by2)}L${r1(bx2)} ${r1(by2 + len)}L${r1(ax)} ${r1(ay + len * 0.7)}Z`;
    })
    .join("");
  // Wear on the open apron beyond the yard, added last so the yard's own
  // scatter stays put.
  for (let i = 0; i < 9; i++) {
    const x = QUAY_YARD.x1 - 40 + rnd() * 220;
    const y = -330 + rnd() * 210;
    const r = 8 + rnd() * 16;
    for (let k = 0; k < 3; k++)
      stains.push(
        ellipse(x + (rnd() - 0.5) * r * 1.6, y + (rnd() - 0.5) * r, r * (0.45 + rnd() * 0.5))
      );
  }
  return { stains, oil, cracks, rust };
})();
const QuayGrime = () => (
  <>
    <clipPath id="hb-quay-clip">
      <polygon points={quayTop} />
    </clipPath>
    <g clipPath="url(#hb-quay-clip)">
      <g className="hb-grime">
        {QUAY_GRIME.stains.map((e, i) => (
          <ellipse key={i} {...e} />
        ))}
      </g>
      <g className="hb-oil">
        {QUAY_GRIME.oil.map((e, i) => (
          <ellipse key={i} {...e} />
        ))}
      </g>
      <path className="hb-crack" d={QUAY_GRIME.cracks} />
    </g>
    <path className="hb-rust-run" d={QUAY_GRIME.rust} />
  </>
);

const Quay = ({ yoe }: { yoe: string }) => (
  <g className="hb-quay" clipPath="url(#hb-shore-clip)">
    <clipPath id="hb-shore-clip">
      <path d={SLAB_TOP} />
    </clipPath>
    <polygon className="hb-top hb-seamless" points={quayTop} />
    <polygon
      className="hb-left hb-seamless"
      points={quayWall([...QUAY_RIGHT, ...QUAY_LEFT], 0, QUAY.h)}
    />
    <polygon className="hb-submerged" points={quayWall(QUAY_RIGHT, 0, QUAY_WATERLINE)} />
    <polygon className="hb-submerged" points={quayWall(QUAY_LEFT, 0, QUAY_WATERLINE)} />
    <path className="hb-foam-line" d={quayFoam} />
    <QuayGrime />
    <QuayMarkings />
    {QUAY_BOLLARDS.map((bx) => (
      <Box key={bx} x={bx} y={-120} z={QUAY_Z} w={8} d={8} h={8} className="hb-bollard" />
    ))}
    <g transform={onLeftFace((QUAY.x0 + QUAY_YARD.x1) / 2 + 22, QUAY.y1, QUAY_WATERLINE + 4)}>
      <text className="hb-label hb-manifest" textAnchor="middle">{`${yoe} AT SEA`}</text>
    </g>
  </g>
);

/* ---- Terminal dressing: ground paint, light masts, clutter, crew ---------- */

const groundLine = (a: [number, number], b: [number, number]) => {
  const [ax, ay] = iso(a[0], a[1], QUAY_Z);
  const [bx, by] = iso(b[0], b[1], QUAY_Z);
  return `M${r1(ax)} ${r1(ay)}L${r1(bx)} ${r1(by)}`;
};
const groundRect = (x: number, y: number, w: number, d: number) =>
  pts([iso(x, y, QUAY_Z), iso(x + w, y, QUAY_Z), iso(x + w, y + d, QUAY_Z), iso(x, y + d, QUAY_Z)]);
// Maps flat local drawing onto the ground: local x -> plan +x, local y -> plan +y.
const onGround = (x: number, y: number) => {
  const [sx, sy] = iso(x, y, QUAY_Z);
  return `matrix(${C} ${S} ${-C} ${S} ${r1(sx)} ${r1(sy)})`;
};

// Empty apron bays continuing the crate rows, numbered on from the yard.
const BAYS = [340, 396, 452].flatMap((x, i) =>
  [-200, -168].map((y, j) => ({ x, y, n: String(7 + i * 2 + j).padStart(2, "0") }))
);
const HAZARD_ZONES = LEGS_X.map((x) => [x - 7, LEG_Y - 7, LEG + 14, 22] as const);
const MASTS = [
  { x: 150, y: -240, h: 132 },
  { x: 520, y: -118, h: 120 },
];

const QuayMarkings = () => (
  <g className="hb-markings">
    <defs>
      <pattern
        id="hb-hatch"
        width={6}
        height={6}
        patternUnits="userSpaceOnUse"
        patternTransform="rotate(35)"
      >
        <rect width={3} height={6} className="hb-hatch-stripe" />
      </pattern>
      <radialGradient id="hb-pool-grad">
        <stop offset="0" className="hb-pool-stop-in" />
        <stop offset="1" className="hb-pool-stop-out" />
      </radialGradient>
    </defs>
    {MASTS.map((m) => {
      const [cx, cy] = iso(m.x + 10, m.y + 10, QUAY_Z);
      return <ellipse key={m.x} className="hb-light-pool" cx={cx} cy={cy} rx={70} ry={38} />;
    })}
    {/* Painted twice: a wide orange pass under a narrow black one gives an outlined line. */}
    {["hb-mark-under", "hb-mark-over"].map((layer) => (
      <g key={layer} className={layer}>
        <path
          className="hb-mark"
          d={[groundLine([136, -210], [620, -210]), groundLine([146, -204], [146, -133])].join("")}
        />
        <path className="hb-mark hb-mark-dash" d={groundLine([14, -128], [620, -128])} />
        {BAYS.map((b) => (
          <polygon key={b.n} className="hb-mark" points={groundRect(b.x, b.y, 50, 28)} />
        ))}
      </g>
    ))}
    {BAYS.map((b) => (
      <g key={b.n} transform={onGround(b.x + 25, b.y + 18)}>
        <text className="hb-bay-num" textAnchor="middle">
          {b.n}
        </text>
      </g>
    ))}
    {HAZARD_ZONES.map(([x, y, w, d]) => (
      <polygon key={x} className="hb-hazard" points={groundRect(x, y, w, d)} />
    ))}
  </g>
);

const LightMast = ({ x, y, h }: { x: number; y: number; h: number }) => {
  const top = QUAY_Z + h;
  const lamps = [-5, 0, 5].map((o) => iso(x + 1.5 + o, y + 1.5 - o, top + 2));
  return (
    <g>
      <Box x={x - 3} y={y - 3} z={QUAY_Z} w={9} d={9} h={3} className="hb-c-steel" />
      <Box x={x} y={y} z={QUAY_Z + 3} w={3} d={3} h={h - 3} className="hb-c-steel" />
      <Box x={x - 6} y={y - 6} z={top} w={15} d={15} h={3} className="hb-c-steel" />
      {lamps.map(([lx, ly], i) => (
        <g key={i}>
          <circle className="hb-lamp-glow" cx={lx} cy={ly} r={9} />
          <circle className="hb-lamp" cx={lx} cy={ly} r={1.8} />
        </g>
      ))}
    </g>
  );
};

// A crew member in a hi-vis vest and hard hat, ~14 units tall.
const Worker = ({ x, y }: { x: number; y: number }) => {
  const [hx, hy] = iso(x + 1.5, y + 1.5, QUAY_Z + 12);
  return (
    <g>
      <Box x={x} y={y} z={QUAY_Z} w={3} d={3} h={5} className="hb-c-overall" />
      <Box x={x - 0.5} y={y - 0.5} z={QUAY_Z + 5} w={4} d={4} h={5} className="hb-c-hivis" />
      <circle className="hb-skin" cx={hx} cy={hy} r={1.7} />
      <ellipse className="hb-hardhat" cx={hx} cy={hy - 1.3} rx={2.3} ry={1.2} />
    </g>
  );
};

const Drum = ({ x, y, color }: { x: number; y: number; color: string }) => (
  <Cylinder cx={x} cy={y} z0={QUAY_Z} z1={QUAY_Z + 9} r0={3.2} r1={3.2} className={color} />
);
const Cone = ({ x, y }: { x: number; y: number }) => (
  <Cylinder cx={x} cy={y} z0={QUAY_Z} z1={QUAY_Z + 6} r0={2.2} r1={0.5} className="hb-c-cone" />
);

const OFFICE = { x: 290, y: -278, w: 40, d: 24, h: 20 };
const SiteOffice = () => {
  const o = OFFICE;
  return (
    <g>
      <g className="hb-c-white">
        <Box x={o.x} y={o.y} z={QUAY_Z} w={o.w} d={o.d} h={o.h} />
        <g transform={onLeftFace(o.x, o.y + o.d, QUAY_Z + o.h)}>
          {[5, 15, 25].map((wx) => (
            <rect key={wx} x={wx} y={5} width={7} height={5} className="hb-window" />
          ))}
          <rect x={33} y={6} width={4} height={14} className="hb-door" />
        </g>
        <g transform={onRightFace(o.x + o.w, o.y + o.d, QUAY_Z + o.h)}>
          <rect x={8} y={5} width={8} height={5} className="hb-window" />
        </g>
      </g>
      <Box
        x={o.x - 2}
        y={o.y - 2}
        z={QUAY_Z + o.h}
        w={o.w + 4}
        d={o.d + 4}
        h={2}
        className="hb-c-steel"
      />
    </g>
  );
};

const Pallets = ({ x, y, n }: { x: number; y: number; n: number }) => (
  <>
    {Array.from({ length: n }, (_, k) => (
      <Box key={k} x={x} y={y} z={QUAY_Z + k * 3} w={14} d={14} h={3} className="hb-c-wood" />
    ))}
  </>
);

// Rooftop-style sign on the back edge of the quay, face toward the water.
// Local face coords: x runs along +x (BOARD.w long), y runs down the panel.
const BOARD = { x: 150, y: -298, w: 180, d: 3, z: QUAY_Z + 42, h: 42 };
const BOARD_LEGS = [34, 140];
const Billboard = ({ name }: { name: string }) => {
  const b = BOARD;
  const top = b.z + b.h;
  const legY = b.y - 6;
  const lamps = [45, 135];
  return (
    <g className="hb-board">
      <defs>
        <linearGradient id="hb-board-wash-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" className="hb-board-wash-in" />
          <stop offset="0.7" className="hb-board-wash-out" />
        </linearGradient>
      </defs>
      {BOARD_LEGS.map((lx) => (
        <Box
          key={lx}
          x={b.x + lx}
          y={legY}
          z={QUAY_Z}
          w={6}
          d={6}
          h={top - QUAY_Z - 6}
          className="hb-c-steel"
        />
      ))}
      <Box x={b.x} y={b.y} z={b.z} w={b.w} d={b.d} h={b.h} className="hb-c-board" />
      <g transform={onLeftFace(b.x, b.y + b.d, top)}>
        <rect className="hb-board-face" x={3} y={3} width={b.w - 6} height={b.h - 6} />
        <rect className="hb-board-wash" x={3} y={3} width={b.w - 6} height={b.h - 6} />
        <text className="hb-board-name" x={b.w / 2} y={22} textAnchor="middle">
          {name.toUpperCase()}
        </text>
        <text className="hb-board-role" x={b.w / 2} y={31} textAnchor="middle">
          SOFTWARE ENGINEER
        </text>
        <rect className="hb-board-band" x={3} y={b.h - 8} width={b.w - 6} height={5} />
      </g>
      <Box x={b.x} y={b.y + b.d} z={b.z - 2} w={b.w} d={6} h={2} className="hb-c-steel" />
      {lamps.map((lx) => {
        const [ax, ay] = iso(b.x + lx, b.y + b.d, top);
        const [hx, hy] = iso(b.x + lx, b.y + b.d + 9, top + 4);
        return (
          <g key={lx}>
            <line className="hb-board-arm" x1={ax} y1={ay} x2={hx} y2={hy} />
            <circle className="hb-lamp-glow" cx={hx} cy={hy} r={5} />
            <circle className="hb-lamp" cx={hx} cy={hy} r={1.4} />
          </g>
        );
      })}
    </g>
  );
};

// Behind the front crate block (drawn before it).
const QuayPropsBack = () => (
  <>
    <SiteOffice />
    <Pallets x={256} y={-272} n={3} />
    <Pallets x={262} y={-254} n={2} />
    <LightMast {...MASTS[0]} />
  </>
);

// In front of everything on the quay.
const QuayPropsFront = () => (
  <>
    <Worker x={56} y={-142} />
    <Cone x={150} y={-131} />
    <Cone x={160} y={-129} />
    <Drum x={356} y={-134} color="hb-c-blue" />
    <Drum x={364} y={-128} color="hb-c-blue" />
    <Drum x={350} y={-125} color="hb-c-red" />
    <LightMast {...MASTS[1]} />
  </>
);

const MOORING = (() => {
  const line = ([ax, ay, az]: number[], [bx, by, bz]: number[], sag: number) => {
    const p: Pt[] = [];
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      p.push(
        iso(ax + (bx - ax) * t, ay + (by - ay) * t, az + (bz - az) * t - sag * 4 * t * (1 - t))
      );
    }
    return `M${pts(p).replace(/ /g, "L")}`;
  };
  return [
    line([44, -116, QUAY_Z + 6], [CLEATS[0].x + 2, CLEATS[0].y + 2, DECK_Z + 3], 26),
    line([314, -116, QUAY_Z + 6], [CLEATS[1].x + 2, CLEATS[1].y + 2, DECK_Z + 3], 20),
  ];
})();

const QUAY_CRATES_BACK: Crate[] = [
  { x: 20, y: -200, level: 0, color: "rust" },
  { x: 20, y: -200, level: 1, color: "green", label: "Python", tip: "Scripting & tooling" },
  { x: 20, y: -200, level: 2, color: "blue", label: "DynamoDB", tip: "Key-value store" },
];
const QUAY_CRATES_FRONT: Crate[] = [
  { x: 166, y: -200, level: 0, color: "teal" },
  { x: 166, y: -200, level: 1, color: "mustard", label: "Gradle", tip: "Build automation" },
  { x: 222, y: -200, level: 0, color: "blue" },
  { x: 166, y: -168, level: 0, color: "rust", label: "Grafana", tip: "Dashboards & alerting" },
  { x: 222, y: -200, level: 1, color: "teal", label: "Elastic", tip: "Search & logs" },
  { x: 222, y: -168, level: 0, color: "red", label: "Jenkins", tip: "CI/CD pipelines" },
  { x: 278, y: -200, level: 0, color: "mustard" },
  { x: 278, y: -168, level: 0, color: "purple", label: "ActiveMQ", tip: "JMS messaging" },
  { x: 278, y: -200, level: 1, color: "rust", label: "Tomcat", tip: "Servlet container" },
];

const QuayCrates = ({ crates, onHover }: { crates: Crate[]; onHover: (t: HoverTip) => void }) => (
  <>
    {[...crates]
      .sort((a, b) => a.x + a.y - (b.x + b.y) || a.level - b.level)
      .map((c, i) => {
        const z = QUAY_Z + c.level * CRATE.h;
        if (!c.label) return <CrateShape key={i} c={c} z={z} />;
        const [tx, ty] = crateTipAnchor(c, QUAY_Z);
        return (
          <g
            key={i}
            className={crateHoverClass(c, crates)}
            onPointerEnter={() => onHover({ label: c.label!, tip: c.tip!, x: tx, y: ty })}
            onPointerLeave={() => onHover(null)}
          >
            <CrateShape c={c} z={z} />
          </g>
        );
      })}
  </>
);

const CAB_GLASS_Z = BOOM_Z - 23;
const CAB_GLASS_H = 18;

const legBraces = (x: number) => {
  const out: string[] = [];
  const y = LEG_Y + LEG;
  for (let z = QUAY_Z + 4; z < BOOM_Z - 30; z += 22) {
    const a = iso(x, y, z);
    const b = iso(x + LEG, y, z + 22);
    const c = iso(x + LEG, y, z);
    const d = iso(x, y, z + 22);
    out.push(
      `M${r1(a[0])} ${r1(a[1])}L${r1(b[0])} ${r1(b[1])}M${r1(c[0])} ${r1(c[1])}L${r1(d[0])} ${r1(d[1])}`
    );
  }
  return out.join("");
};

// Drawn after the trolley (in CargoOps) so the boom hides the top of it.
const Boom = () => {
  const midY = LEG_Y + LEG / 2;
  const [tbx, tby] = iso(CRANE_X + 7, midY, BOOM_Z + 10);
  const [apx, apy] = iso(CRANE_X + 7, midY, BOOM_Z + 46);
  const [frx, fry] = iso(CRANE_X + 7, BOOM_END_Y, BOOM_Z + 10);
  const [bkx, bky] = iso(CRANE_X + 7, BOOM_BACK_Y + 4, BOOM_Z + 10);
  return (
    <g className="hb-c-crane">
      <Box x={CRANE_X} y={BOOM_BACK_Y} z={BOOM_Z} w={14} d={BOOM_END_Y - BOOM_BACK_Y} h={10} />
      <line className="hb-ink" x1={tbx} y1={tby} x2={apx} y2={apy} />
      <line className="hb-ink hb-thin" x1={apx} y1={apy} x2={frx} y2={fry} />
      <line className="hb-ink hb-thin" x1={apx} y1={apy} x2={bkx} y2={bky} />
    </g>
  );
};

const Crane = () => {
  const spanX0 = LEGS_X[0] - 2;
  const spanX1 = LEGS_X[1] + LEG + 2;

  return (
    <g className="hb-c-crane">
      {/* Counterweight hangs behind the portal and cab, so it goes first. */}
      <Box
        x={CRANE_X - 2}
        y={BOOM_BACK_Y}
        z={BOOM_Z - 18}
        w={18}
        d={22}
        h={18}
        className="hb-c-red"
      />
      {/* Portal: a knee beam between the legs (drawn before the nearer leg so
          it tucks behind it) and a heavy crossbeam carrying the boom. */}
      {LEGS_X.map((x, i) => (
        <g key={x}>
          {i === 1 && (
            <Box
              x={LEGS_X[0] + LEG}
              y={LEG_Y + 2}
              z={QUAY_Z + 70}
              w={LEGS_X[1] - LEGS_X[0] - LEG}
              d={6}
              h={6}
            />
          )}
          <Box x={x - 3} y={LEG_Y - 3} z={QUAY_Z} w={LEG + 6} d={LEG + 6} h={4} />
          <Box x={x} y={LEG_Y} z={QUAY_Z + 4} w={LEG} d={LEG} h={BOOM_Z - QUAY_Z - 16} />
          <path className="hb-rib" d={legBraces(x)} />
        </g>
      ))}
      <Box x={spanX0} y={LEG_Y - 1} z={BOOM_Z - 12} w={spanX1 - spanX0} d={LEG + 2} h={12} />
      {/* Operator cab hung off the landside leg, looking down the boom. */}
      <Box
        x={CAB.x - 1}
        y={CAB.y - 1}
        z={CAB_GLASS_Z - 4}
        w={24}
        d={24}
        h={4}
        className="hb-c-white"
      />
      <g className="hb-c-glass">
        <Box x={CAB.x} y={CAB.y} z={CAB_GLASS_Z} w={22} d={22} h={CAB_GLASS_H} />
        {[
          onLeftFace(CAB.x, CAB.y + 22, CAB_GLASS_Z + CAB_GLASS_H),
          onRightFace(CAB.x + 22, CAB.y + 22, CAB_GLASS_Z + CAB_GLASS_H),
        ].map((t) => (
          <g key={t} transform={t}>
            <path
              className="hb-glare"
              d={`M4 0h5l-9 ${CAB_GLASS_H * 0.55}v-9zM13 0h2.5l-15 ${CAB_GLASS_H}v-5z`}
            />
          </g>
        ))}
      </g>
      <Box
        x={CAB.x - 1}
        y={CAB.y - 1}
        z={CAB_GLASS_Z + CAB_GLASS_H}
        w={24}
        d={24}
        h={5}
        className="hb-c-white"
      />
    </g>
  );
};

/* ---- Cargo ops ------------------------------------------------------------
   The crane empties the boom column onto a quay slot one crate at a time, then
   puts them back in reverse. Driven by rAF writing transforms straight to small
   sprites, so React never re-renders per frame. */

const SLOT_Y = -190;
const HOOK_X = CRANE_X + 7;
// Crate-top height while carrying: clears the ship stack (86) and quay stack (102).
const TRAVEL_Z = 150;
const TROLLEY_Z = BOOM_Z - 7;

type Spot = { y: number; z: number };
type Seg = { t0: number; dur: number; from: Spot; to: Spot; carry: number; pos: Spot[] };

const CARGO_PLAN = (() => {
  const T = { reach: 1.1, grab: 0.5, lift: 1.1, travel: 2.2, rest: 3 };
  const pos: Spot[] = CARGO.map((c) => ({ y: c.y, z: DECK_Z + c.level * CRATE.h }));
  const segs: Seg[] = [];
  let hook: Spot = { y: CARGO[0].y, z: TRAVEL_Z };
  let t = 0;
  const push = (dur: number, to: Spot, carry = -1) => {
    segs.push({ t0: t, dur, from: hook, to, carry, pos: pos.map((p) => ({ ...p })) });
    hook = to;
    t += dur;
  };
  const move = (i: number, dest: Spot) => {
    const { y, z } = pos[i];
    if (hook.y !== y) push(T.travel, { y, z: TRAVEL_Z });
    push(T.reach, { y, z: z + CRATE.h });
    push(T.grab, hook);
    push(T.lift, { y, z: TRAVEL_Z }, i);
    push(T.travel, { y: dest.y, z: TRAVEL_Z }, i);
    push(T.reach, { y: dest.y, z: dest.z + CRATE.h }, i);
    pos[i] = dest;
    push(T.grab, hook);
    push(T.lift, { y: dest.y, z: TRAVEL_Z });
  };
  const home = pos.map((p) => ({ ...p }));
  // Starts working straight away; the between-loop rest sits at the end.
  [0, 1, 2].forEach((i) => move(i, { y: SLOT_Y, z: QUAY_Z + i * CRATE.h }));
  push(T.rest, hook);
  [2, 1, 0].forEach((i) => move(i, home[i]));
  push(T.rest, hook);
  return { segs, total: t, home };
})();

const ease = (u: number) => (u < 0.5 ? 4 * u * u * u : 1 - (-2 * u + 2) ** 3 / 2);

const cargoPose = (time: number) => {
  const { segs, total } = CARGO_PLAN;
  const t = ((time % total) + total) % total;
  const seg = segs.find((s) => t < s.t0 + s.dur) ?? segs[segs.length - 1];
  const u = ease(Math.min(1, (t - seg.t0) / seg.dur));
  const hook: Spot = {
    y: seg.from.y + (seg.to.y - seg.from.y) * u,
    z: seg.from.z + (seg.to.z - seg.from.z) * u,
  };
  const crates = seg.pos.map((p, i) => (i === seg.carry ? { y: hook.y, z: hook.z - CRATE.h } : p));
  return { hook, crates, carry: seg.carry };
};

// Screen offset for a plan move along y and a lift along z.
const shift = (dy: number, dz: number): Pt => [-dy * C, dy * S - dz];

const boxBounds = (x: number, y: number, z: number, w: number, d: number, h: number, pad = 12) => {
  const c = [
    iso(x, y, z + h),
    iso(x + w, y, z),
    iso(x, y + d, z),
    iso(x + w, y + d, z),
    iso(x + w, y, z + h),
    iso(x, y + d, z + h),
  ];
  const xs = c.map((p) => p[0]);
  const ys = c.map((p) => p[1]);
  const x0 = Math.floor(Math.min(...xs) - pad);
  const y0 = Math.floor(Math.min(...ys) - pad);
  return {
    x: x0,
    y: y0,
    w: Math.ceil(Math.max(...xs) + pad) - x0,
    h: Math.ceil(Math.max(...ys) + pad) - y0,
  };
};

const HOOK_HOME: Spot = { y: CARGO[0].y, z: TRAVEL_Z };
const SPREADER = { x: CARGO[0].x + 6, dy: 4, w: CRATE.w - 12, d: CRATE.d - 8, h: 3 };
const TROLLEY = { x: CRANE_X - 2, dy: CRATE.d / 2 - 9, w: 18, d: 18, h: 9 };

const CABLE_TOP: Pt = iso(HOOK_X, HOOK_HOME.y + CRATE.d / 2, TROLLEY_Z);
const cableLen = (z: number) => TROLLEY_Z - (z + SPREADER.h);
const CABLE_H0 = cableLen(HOOK_HOME.z);

const CARGO_START_DELAY = 500;
// Phone still frame: first crate hoisted clear of the stacks, hanging over the
// water just behind the hull (back edge at y = 0), clear of the quay edge.
const CARGO_STILL_POSE: ReturnType<typeof cargoPose> = (() => {
  const hook: Spot = { y: -CRATE.d - 3, z: TRAVEL_Z };
  const crates = CARGO_PLAN.home.map((p, i) => (i === 0 ? { y: hook.y, z: hook.z - CRATE.h } : p));
  return { hook, crates, carry: 0 };
})();

const CargoOps = ({
  paused,
  still,
  onHover,
}: {
  paused: boolean;
  still: boolean;
  onHover: (t: HoverTip) => void;
}) => {
  const crateRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hitRefs = useRef<(SVGGElement | null)[]>([]);
  const spreaderRef = useRef<HTMLDivElement | null>(null);
  const cableRef = useRef<HTMLDivElement | null>(null);
  const trolleyRef = useRef<HTMLDivElement | null>(null);
  const timeRef = useRef(0);
  const poseRef = useRef(still ? CARGO_STILL_POSE : cargoPose(0));
  const orderRef = useRef("");

  useEffect(() => {
    const apply = () => {
      const pose = still ? CARGO_STILL_POSE : cargoPose(timeRef.current);
      poseRef.current = pose;
      const { home } = CARGO_PLAN;
      pose.crates.forEach((p, i) => {
        const el = crateRefs.current[i];
        if (!el) return;
        const [dx, dy] = shift(p.y - home[i].y, p.z - home[i].z);
        el.style.transform = `translate(${r1(dx)}px, ${r1(dy)}px)`;
      });
      // Re-stack only when the order changes: quay before ship, back to front,
      // bottom to top, and whatever is on the hook last.
      const rank = pose.crates
        .map((p, i) => ({ p, i }))
        .sort(
          (a, b) =>
            (a.i === pose.carry ? 1 : 0) - (b.i === pose.carry ? 1 : 0) ||
            a.p.y - b.p.y ||
            a.p.z - b.p.z
        )
        .map((e) => e.i);
      const key = `${rank.join("")}${pose.carry}`;
      if (key !== orderRef.current) {
        orderRef.current = key;
        rank.forEach((i, k) => {
          const el = crateRefs.current[i];
          if (el) el.style.zIndex = String(k + 1);
          const hit = hitRefs.current[i];
          if (!hit) return;
          const p = pose.crates[i];
          const covered = pose.crates.some(
            (o, j) => j !== i && j !== pose.carry && o.y === p.y && o.z === p.z + CRATE.h
          );
          hit.setAttribute("class", covered ? "hb-crate hb-crate--slide" : "hb-crate");
        });
      }
      const [hx, hy] = shift(pose.hook.y - HOOK_HOME.y, 0);
      if (trolleyRef.current)
        trolleyRef.current.style.transform = `translate(${r1(hx)}px, ${r1(hy)}px)`;
      const [sx, sy] = shift(pose.hook.y - HOOK_HOME.y, pose.hook.z - HOOK_HOME.z);
      if (spreaderRef.current)
        spreaderRef.current.style.transform = `translate(${r1(sx)}px, ${r1(sy)}px)`;
      if (cableRef.current)
        cableRef.current.style.transform = `translate(${r1(hx)}px, ${r1(hy)}px) scaleY(${(
          cableLen(pose.hook.z) / CABLE_H0
        ).toFixed(4)})`;
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    apply();
    if (paused || still || reduce.matches) return;
    let raf = 0;
    let last = 0;
    const tick = (now: number) => {
      timeRef.current += Math.min(now - last, 100) / 1000;
      last = now;
      apply();
      raf = requestAnimationFrame(tick);
    };
    const begin = () => {
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    // Short beat after load before the first lift; resumes after a pause start at once.
    const wait = timeRef.current === 0 ? window.setTimeout(begin, CARGO_START_DELAY) : 0;
    if (!wait) begin();
    return () => {
      clearTimeout(wait);
      cancelAnimationFrame(raf);
    };
  }, [paused, still]);

  const { home } = CARGO_PLAN;
  return (
    <div className="hb-cargo">
      {CARGO.map((c, i) => {
        const b = boxBounds(c.x, c.y, home[i].z, CRATE.w, CRATE.d, CRATE.h);
        const shape = <CrateShape c={c} z={home[i].z} />;
        return (
          <div
            key={i}
            ref={(el) => {
              crateRefs.current[i] = el;
            }}
            className="hb-sprite"
            style={{ left: b.x, top: b.y, width: b.w, height: b.h, zIndex: i + 1 }}
          >
            <svg
              width={b.w}
              height={b.h}
              viewBox={`${b.x} ${b.y} ${b.w} ${b.h}`}
              overflow="visible"
              aria-hidden="true"
              focusable="false"
            >
              {c.label ? (
                <g
                  ref={(el) => {
                    hitRefs.current[i] = el;
                  }}
                  className="hb-crate"
                  onPointerEnter={() => {
                    const p = poseRef.current.crates[i];
                    const [x, y] = crateTipAnchor({ ...c, y: p.y, level: 0 }, p.z);
                    onHover({ label: c.label!, tip: c.tip!, x, y });
                  }}
                  onPointerLeave={() => onHover(null)}
                >
                  {shape}
                </g>
              ) : (
                shape
              )}
            </svg>
          </div>
        );
      })}
      <div ref={spreaderRef} className="hb-sprite hb-hook">
        <Sprite
          {...boxBounds(
            SPREADER.x,
            HOOK_HOME.y + SPREADER.dy,
            HOOK_HOME.z,
            SPREADER.w,
            SPREADER.d,
            SPREADER.h,
            4
          )}
        >
          <Box
            x={SPREADER.x}
            y={HOOK_HOME.y + SPREADER.dy}
            z={HOOK_HOME.z}
            w={SPREADER.w}
            d={SPREADER.d}
            h={SPREADER.h}
            className="hb-spreader"
          />
        </Sprite>
      </div>
      <div
        ref={cableRef}
        className="hb-sprite hb-cable hb-hook"
        style={{ left: CABLE_TOP[0] - 6, top: CABLE_TOP[1], width: 12, height: CABLE_H0 }}
      />
      <div ref={trolleyRef} className="hb-sprite hb-hook">
        <Sprite
          {...boxBounds(
            TROLLEY.x,
            HOOK_HOME.y + TROLLEY.dy,
            TROLLEY_Z,
            TROLLEY.w,
            TROLLEY.d,
            TROLLEY.h,
            4
          )}
        >
          <g className="hb-c-red">
            <Box
              x={TROLLEY.x}
              y={HOOK_HOME.y + TROLLEY.dy}
              z={TROLLEY_Z}
              w={TROLLEY.w}
              d={TROLLEY.d}
              h={TROLLEY.h}
            />
          </g>
        </Sprite>
      </div>
      <Sprite
        {...boxBounds(CRANE_X, BOOM_BACK_Y, BOOM_Z, 14, BOOM_END_Y - BOOM_BACK_Y, 10, 40)}
        style={{ zIndex: 11 }}
      >
        <Boom />
      </Sprite>
    </div>
  );
};

/* ---------------------------------------------------------------------------
   Lighthouse
--------------------------------------------------------------------------- */

const LH = { x: -270, y: 170, base: 14, height: 112 };
const LAMP: Pt = iso(LH.x, LH.y, LH.base + LH.height + 10);

const Cylinder = ({
  cx,
  cy,
  z0,
  z1,
  r0,
  r1: rTop,
  className = "",
}: {
  cx: number;
  cy: number;
  z0: number;
  z1: number;
  r0: number;
  r1: number;
  className?: string;
}) => {
  const [bx, by] = iso(cx, cy, z0);
  const [tx, ty] = iso(cx, cy, z1);
  const k = Math.SQRT2;
  const rxb = r0 * k * C;
  const ryb = r0 * k * S;
  const rxt = rTop * k * C;
  const ryt = rTop * k * S;
  return (
    <g className={className}>
      <path
        className="hb-left"
        d={`M${r1(bx - rxb)} ${r1(by)}L${r1(tx - rxt)} ${r1(ty)}L${r1(tx + rxt)} ${r1(ty)}L${r1(bx + rxb)} ${r1(by)}A${r1(rxb)} ${r1(ryb)} 0 0 1 ${r1(bx - rxb)} ${r1(by)}Z`}
      />
      <ellipse className="hb-top" cx={tx} cy={ty} rx={rxt} ry={ryt} />
    </g>
  );
};

/* Egg-shaped rock poking out of the water: only a short rim shows above the
   waterline, topped with grass. Egg = cubic halves with unequal left/right reach. */
const ISLAND_H = 8;
const egg = (cx: number, cy: number, a: number, c: number, b: number) =>
  `M${r1(cx - a)} ${r1(cy)}C${r1(cx - a)} ${r1(cy - 1.33 * b)} ${r1(cx + c)} ${r1(cy - 1.33 * b)} ${r1(cx + c)} ${r1(cy)}C${r1(cx + c)} ${r1(cy + 1.33 * b)} ${r1(cx - a)} ${r1(cy + 1.33 * b)} ${r1(cx - a)} ${r1(cy)}Z`;

const Island = () => {
  const [lx, cy] = iso(LH.x, LH.y, 0);
  const a = 100;
  const c = 60;
  const b = 40;
  // Shift the egg so its visual midpoint sits under the tower.
  const cx = lx + (a - c) / 2;
  const top = cy - ISLAND_H;
  const rim = `M${r1(cx - a)} ${r1(top)}L${r1(cx - a)} ${r1(cy)}C${r1(cx - a)} ${r1(cy + 1.33 * b)} ${r1(cx + c)} ${r1(cy + 1.33 * b)} ${r1(cx + c)} ${r1(cy)}L${r1(cx + c)} ${r1(top)}Z`;
  // Deterministic scatter over the grass, skipping the plinth footprint.
  const gx = cx - 8;
  const ga = a - 18;
  const gc = c - 10;
  const gb = b - 8;
  const tufts: [number, number, number][] = [];
  let seed = 11;
  const rnd = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  for (let n = 0; tufts.length < 30 && n < 600; n++) {
    const t = rnd() * Math.PI * 2;
    const r = 0.5 + rnd() * 0.42;
    const tx = gx + Math.cos(t) * (Math.cos(t) < 0 ? ga : gc) * r;
    const ty = top + Math.sin(t) * gb * r;
    if (Math.abs(tx - lx) / 54 + Math.abs(ty - top - 4) / 30 < 1) continue;
    tufts.push([tx, ty, 5 + rnd() * 5]);
  }
  return (
    <g className="hb-island">
      <path className="hb-foam-line" d={egg(cx, cy + 1, a + 8, c + 8, b + 6)} />
      <path className="hb-island-rim" d={rim} />
      <path className="hb-island-rock" d={egg(cx, top, a, c, b)} />
      <path className="hb-island-grass" d={egg(cx - 8, top - 1, a - 18, c - 10, b - 8)} />
      <path
        className="hb-tuft"
        d={tufts
          .map(
            ([tx, ty, h]) =>
              `M${r1(tx - 3)} ${r1(ty)}l1.5 ${r1(-h * 0.7)}M${r1(tx)} ${r1(ty)}l0 ${r1(-h)}M${r1(tx + 3)} ${r1(ty)}l-1.5 ${r1(-h * 0.7)}`
          )
          .join("")}
      />
    </g>
  );
};

const Lighthouse = () => {
  const { x, y, base, height } = LH;
  return (
    <>
      <Island />
      <Cylinder cx={x} cy={y} z0={ISLAND_H} z1={base} r0={27} r1={25} className="hb-c-teal" />
      <g className="hb-c-white">
        <Cylinder cx={x} cy={y} z0={base} z1={base + height} r0={15} r1={10} />
        {[0.3, 0.62].map((t) => {
          const za = base + height * t;
          const zb = za + 12;
          const ra = 15 - 5 * t;
          const rb = 15 - 5 * (t + 12 / height);
          const [ax, ay] = iso(x, y, za);
          const [bx2, by2] = iso(x, y, zb);
          const k = Math.SQRT2 * C;
          const kk = Math.SQRT2 * S;
          return (
            <path
              key={t}
              className="hb-stripe hb-stripe--red"
              d={`M${r1(ax - ra * k)} ${r1(ay)}L${r1(bx2 - rb * k)} ${r1(by2)}A${r1(rb * k)} ${r1(rb * kk)} 0 0 0 ${r1(bx2 + rb * k)} ${r1(by2)}L${r1(ax + ra * k)} ${r1(ay)}A${r1(ra * k)} ${r1(ra * kk)} 0 0 1 ${r1(ax - ra * k)} ${r1(ay)}Z`}
            />
          );
        })}
        <Cylinder cx={x} cy={y} z0={base + height} z1={base + height + 3} r0={15} r1={15} />
      </g>
      <Cylinder
        cx={x}
        cy={y}
        z0={base + height + 3}
        z1={base + height + 17}
        r0={8}
        r1={8}
        className="hb-lamp"
      />
      <path
        className="hb-top hb-roof"
        d={(() => {
          const [cx2, cy2] = iso(x, y, base + height + 17);
          const [px, py] = iso(x, y, base + height + 30);
          // Circular base in plan, so the brim follows the scene's ground plane.
          const rx = 10 * Math.SQRT2 * C;
          const ry = 10 * Math.SQRT2 * S;
          return `M${r1(cx2 - rx)} ${r1(cy2)}Q${r1(cx2 - rx * 0.4)} ${r1(py + 2)} ${r1(px)} ${r1(py)}Q${r1(cx2 + rx * 0.4)} ${r1(py + 2)} ${r1(cx2 + rx)} ${r1(cy2)}A${r1(rx)} ${r1(ry)} 0 0 1 ${r1(cx2 - rx)} ${r1(cy2)}Z`;
        })()}
      />
    </>
  );
};

// Beam lies on the scene's horizontal plane at lamp height and sweeps in plan.
const BEAM_PLANE = `matrix(${C}, 0.5, ${-C}, 0.5, 0, 0)`;

const Beam = () => (
  <div
    className="hb-sprite hb-beam-plane"
    style={{ left: LAMP[0], top: LAMP[1], transform: BEAM_PLANE }}
    aria-hidden="true"
  >
    <div
      className="hb-sprite hb-beam hb-anim"
      style={{ left: 0, top: -30, width: 300, height: 60 }}
    >
      <svg width={300} height={60} viewBox="0 0 300 60" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="hb-beam-grad" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="hsl(var(--brand))" stopOpacity="0.55" />
            <stop offset="1" stopColor="hsl(var(--brand))" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points="0,30 300,0 300,60" fill="url(#hb-beam-grad)" className="hb-beam-fill" />
      </svg>
    </div>
  </div>
);

/* ---------------------------------------------------------------------------
   Shark circling the island: one CSS 3D rig (same iso trick as the radars).
   A tilted frame spins about the vertical axis and carries the underwater
   shadow, the surface foam and an upright fin, so the fin yaws with the body.
   The rig is drawn twice, behind and in front of the island; the fin and foam
   of each copy only show on its half of the orbit (hb-fin-front/back).
--------------------------------------------------------------------------- */

// 95 world units → rig px (the tilted frame shrinks horizontal lengths by 1/RADAR_V).
const SHARK_R = 95 * Math.SQRT2 * C;
const SHARK_O: Pt = iso(LH.x + 11.5, LH.y - 11.5, 0);
const FIN = 0.65;

const SharkRig = ({ half }: { half: "back" | "front" }) => {
  const front = half === "front";
  const vis = `hb-shark-leaf hb-fin-${half}`;
  return (
    <div className="hb-shark" style={{ left: SHARK_O[0], top: SHARK_O[1] }} aria-hidden="true">
      <div className="hb-shark-tilt">
        <div className="hb-shark-spin hb-anim">
          <div className="hb-shark-carrier" style={{ transform: `translateX(${r1(SHARK_R)}px)` }}>
            {!front && (
              <div className="hb-shark-leaf hb-shark-flat">
                <svg
                  className="hb-sprite"
                  style={{ left: -20, top: -40 }}
                  width={40}
                  height={70}
                  viewBox="-20 -40 40 70"
                  focusable="false"
                >
                  <defs>
                    <filter id="hb-shark-blur" x="-30%" y="-30%" width="160%" height="160%">
                      <feGaussianBlur stdDeviation="1.6" />
                    </filter>
                  </defs>
                  {/* Top-down silhouette, nose toward travel (+y), dorsal fin at the origin. */}
                  <path
                    className="hb-shark-shadow"
                    filter="url(#hb-shark-blur)"
                    d="M0 25C4 23 7 15 7.5 6L17 -3L7 -1C6 -12 3.5 -22 2 -28L7 -38L0 -32L-6 -36L-2 -28C-3.5 -22 -6 -12 -7 -1L-17 -3L-7.5 6C-7 15 -4 23 0 25Z"
                  />
                </svg>
              </div>
            )}
            <div className={`${vis} hb-shark-flat`} style={{ opacity: front ? 1 : 0 }}>
              <svg
                className="hb-sprite"
                style={{ left: -10, top: -24 }}
                width={20}
                height={34}
                viewBox="-10 -24 20 34"
                focusable="false"
              >
                <path className="hb-fin-wake" d="M-2.2 -4.5q-1 -6 -3.2 -13M2.2 -4.5q1 -6 3.2 -13" />
                <path className="hb-fin-foam" d="M-3.2 -3Q0 11 3.2 -3" />
              </svg>
            </div>
            <div className={`${vis} hb-shark-upright`} style={{ opacity: front ? 1 : 0 }}>
              <svg
                className="hb-sprite"
                style={{ left: -10 * FIN, top: -19 * FIN * RADAR_V }}
                width={20 * FIN}
                height={20 * FIN * RADAR_V}
                viewBox="-10 -19 20 20"
                preserveAspectRatio="none"
                focusable="false"
              >
                {/* Profile with the nose at -x; rotateY(90deg) points it along travel. */}
                <path className="hb-fin-body" d="M-10 0C-8 -7 -3 -14 5 -17C3 -11 3.5 -5 9.5 0Z" />
                <path className="hb-fin-edge" d="M-9 -1C-7 -7 -2.5 -13 4.5 -16.3" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------------------
   Buoys, whale, name
--------------------------------------------------------------------------- */

const BUOYS = [
  { x: 960, y: 560, label: "JMeter", delay: "0s", color: "red" },
  { x: 340, y: 430, label: "Prometheus", delay: "-1.3s", color: "green" },
  { x: 820, y: 630, label: "Git", delay: "-2.1s", color: "mustard" },
];

const Buoy = ({ x, y, label, delay, color }: (typeof BUOYS)[number]) => {
  // A hover knocks the buoy; it plays one damped rock to completion, then settles.
  const [rocking, setRocking] = useState(false);
  return (
    <Sprite
      x={x - 12}
      y={y - 48}
      w={120}
      h={58}
      className={`hb-buoy hb-anim hb-c-${color}`}
      style={{ animationDelay: delay }}
    >
      <ellipse className="hb-ripple-static" cx={x} cy={y + 1} rx={16} ry={5} />
      <g
        className={`hb-buoy-body${rocking ? " hb-rocking" : ""}`}
        style={{ transformOrigin: `${x}px ${y}px` }}
        onMouseEnter={() => setRocking(true)}
        onAnimationEnd={(e) => {
          if (e.animationName === "hb-rock") setRocking(false);
        }}
      >
        <path
          className="hb-left"
          d={`M${x - 8} ${y}L${x - 4} ${y - 18}L${x + 4} ${y - 18}L${x + 8} ${y}A8 4 0 0 1 ${x - 8} ${y}Z`}
        />
        <path
          className="hb-stripe"
          d={`M${x - 6.5} ${y - 7}L${x - 5} ${y - 12}L${x + 5} ${y - 12}L${x + 6.5} ${y - 7}Z`}
        />
        <ellipse className="hb-top" cx={x} cy={y - 18} rx={4} ry={2} />
        <line className="hb-ink" x1={x} y1={y - 18} x2={x} y2={y - 40} />
        <path
          className="hb-flag"
          d={`M${x} ${y - 40}h${label.length * 6 + 14}l-5 6 5 6h-${label.length * 6 + 14}z`}
        />
        <text className="hb-label hb-tiny" x={x + 5} y={y - 30.5}>
          {label}
        </text>
      </g>
    </Sprite>
  );
};

const WHALE_BOX = { x: 225, y: 375, w: 550, h: 170 };
const WHALE_START: Pt = [315, 515];
// The clip box's bottom edge is the water line. hb-leap crosses it ~54px after
// the start going up and ~340px after the start coming down.
const WHALE_SURFACE = WHALE_BOX.y + WHALE_BOX.h;
const WHALE_ENTRY: Pt = [WHALE_START[0] + 62, WHALE_SURFACE];
const WHALE_EXIT: Pt = [WHALE_START[0] + 330, WHALE_SURFACE];
const SPRAY: [number, number, number][] = [
  [-14, -16, 2.2],
  [-6, -24, 2.6],
  [3, -28, 2.4],
  [11, -20, 2.2],
  [18, -12, 1.8],
  [-20, -8, 1.6],
];

const Splash = ({ at, phase }: { at: Pt; phase: "rise" | "dive" }) => (
  <div className={`hb-splash hb-splash--${phase}`} style={{ left: at[0], top: at[1] }}>
    <span className="hb-splash-ring hb-anim" />
    <span className="hb-splash-ring hb-splash-ring--late hb-anim" />
    <svg
      className="hb-spray hb-anim"
      width={60}
      height={40}
      viewBox="-30 -34 60 40"
      aria-hidden="true"
      focusable="false"
    >
      {SPRAY.map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} />
      ))}
    </svg>
  </div>
);

const Whale = () => (
  <>
    <Splash at={WHALE_ENTRY} phase="rise" />
    <Splash at={WHALE_EXIT} phase="dive" />
    <div
      className="hb-sprite hb-whale-clip"
      style={{ left: WHALE_BOX.x, top: WHALE_BOX.y, width: WHALE_BOX.w, height: WHALE_BOX.h }}
    >
      <div
        className="hb-whale hb-anim hb-c-whale"
        style={{ left: WHALE_START[0] - WHALE_BOX.x, top: WHALE_START[1] - WHALE_BOX.y }}
      >
        <svg
          width={140}
          height={90}
          viewBox="-70 -45 140 90"
          overflow="visible"
          aria-hidden="true"
          focusable="false"
        >
          <path
            className="hb-top"
            d="M-46 -6 Q-56 -16 -60 -32 Q-52 -30 -47 -24 Q-50 -34 -42 -38 Q-42 -24 -36 -12 Z"
          />
          <path
            className="hb-top"
            d="M-44 -2 Q-40 24 2 25 Q42 25 52 -4 Q55 -12 47 -12 L-36 -12 Q-46 -12 -44 -2 Z"
          />
          <path className="hb-rib" d="M-30 10 Q4 20 40 6" />
          <circle className="hb-eye" cx={36} cy={0} r={2.2} />
          {[
            [-24, -21],
            [-12, -21],
            [0, -21],
            [12, -21],
            [-12, -30],
            [0, -30],
            [0, -39],
          ].map(([cx, cy], i) => (
            <rect
              key={i}
              className={i === 6 ? "hb-whale-crate hb-whale-crate--hot" : "hb-whale-crate"}
              x={cx}
              y={cy}
              width={11}
              height={8}
            />
          ))}
          <text className="hb-label hb-tiny" x={-6} y={14}>
            Docker
          </text>
        </svg>
      </div>
    </div>
  </>
);

const LH_BASE: Pt = iso(LH.x, LH.y, 0);

/* ---------------------------------------------------------------------------
   Puddle: a flat film of water on the floor plane. Crisp, uneven shoreline
   with stepped depth contours inward, and flat silhouette reflections of
   everything standing in it (static shapes, no filters, painted once).
--------------------------------------------------------------------------- */

const SLAB = { x0: -420, y0: -340, x1: 550, y1: 430, r: 355 };

// Rounded-rectangle outline resampled every ~6 units, each point carrying its
// outward normal angle so contours can be inset along it.
const SLAB_BASE = (() => {
  const { x0, y0, x1, y1, r } = SLAB;
  const raw: { p: Pt; a: number }[] = [];
  const corners: [number, number, number][] = [
    [x1 - r, y0 + r, -90],
    [x1 - r, y1 - r, 0],
    [x0 + r, y1 - r, 90],
    [x0 + r, y0 + r, 180],
  ];
  for (const [cx, cy, a0] of corners)
    for (let i = 0; i < 64; i++) {
      const a = a0 + (90 * i) / 64;
      const t = (a * Math.PI) / 180;
      raw.push({ p: [cx + r * Math.cos(t), cy + r * Math.sin(t)], a });
    }
  const dense: { p: Pt; a: number }[] = [];
  raw.forEach((q, i) => {
    const next = raw[(i + 1) % raw.length];
    const len = Math.hypot(next.p[0] - q.p[0], next.p[1] - q.p[1]);
    const n = Math.max(1, Math.round(len / 6));
    for (let k = 0; k < n; k++)
      dense.push({
        p: [q.p[0] + ((next.p[0] - q.p[0]) * k) / n, q.p[1] + ((next.p[1] - q.p[1]) * k) / n],
        a: q.a,
      });
  });
  return dense;
})();

// Shoreline wobble: a few incommensurate waves with jittered phase so it never
// reads as a regular scallop. Each inner contour adds its own drift so the
// steps pinch and widen like real shallows.
const shoreline = (th: number) =>
  18 * Math.sin(2 * th + 0.6) +
  12 * Math.sin(3 * th + 2.1 + 0.4 * Math.sin(th)) +
  7 * Math.sin(7 * th + 0.3) +
  3 * Math.sin(13 * th + 1.9) +
  1.4 * Math.sin(29 * th + 0.8);
const CONTOURS = [
  { inset: 0, drift: 0 },
  { inset: 24, drift: 12 },
  { inset: 74, drift: 28 },
  { inset: 150, drift: 40 },
];
const contourPath = (inset: number, drift: number, seed: number) => {
  const N = SLAB_BASE.length;
  const ring = SLAB_BASE.map((q, i) => {
    const th = (2 * Math.PI * i) / N;
    const d =
      shoreline(th) - inset + drift * Math.sin(2 * th + seed) * Math.sin(3 * th + seed * 1.7);
    const t = (q.a * Math.PI) / 180;
    return iso(q.p[0] + d * Math.cos(t), q.p[1] + d * Math.sin(t));
  });
  return `M${pts(ring).replace(/ /g, "L")}Z`;
};
const SLAB_RINGS = CONTOURS.map(({ inset, drift }, i) => contourPath(inset, drift, i * 1.3));
const SLAB_TOP = SLAB_RINGS[0];

// Reflections: mirror z -> -z about the waterline. A box at height z..z+h
// reflects to -(z+h)..-z; drawing all three faces gives its silhouette.
type WBox = [number, number, number, number, number, number];
const mirrorBox = ([x, y, z, w, d, h]: WBox) => {
  const f = box(x, y, -(z + h), w, d, h);
  return [f.top, f.left, f.right];
};
const crateBox = (c: Crate, baseZ: number): WBox => [
  c.x,
  c.y,
  baseZ + c.level * CRATE.h,
  CRATE.w,
  CRATE.d,
  CRATE.h,
];
const REFLECT_BOXES: WBox[] = [
  // Ship superstructure + cargo
  [-156, 8, DECK_Z, 44, 54, BRIDGE_H],
  [-160, 4, DECK_Z + BRIDGE_H, 52, 62, 3],
  [-152, 13, CAB_Z, 36, 44, CAB_H],
  [-155, 10, CAB_Z + CAB_H, 42, 50, 3],
  ...CRATES.map((c) => crateBox(c, DECK_Z)),
  // Quay, cargo and crane
  [QUAY.x0, QUAY_YARD.y0, 0, 560 - QUAY.x0, QUAY.y1 - QUAY_YARD.y0, QUAY_Z],
  ...[...QUAY_CRATES_BACK, ...QUAY_CRATES_FRONT].map((c) => crateBox(c, QUAY_Z)),
  ...LEGS_X.map((x): WBox => [x, LEG_Y, QUAY_Z, LEG, LEG, BOOM_Z - QUAY_Z]),
  [LEGS_X[0] - 2, LEG_Y - 1, BOOM_Z - 12, LEGS_X[1] - LEGS_X[0] + LEG + 4, LEG + 2, 12],
  [CAB.x - 1, CAB.y - 1, CAB_GLASS_Z - 4, 24, 24, CAB_GLASS_H + 9],
  [CRANE_X - 2, BOOM_BACK_Y, BOOM_Z - 18, 18, 22, 18],
  [CRANE_X, BOOM_BACK_Y, BOOM_Z, 14, BOOM_END_Y - BOOM_BACK_Y, 10],
];
const REFLECT_HULL = [
  pts([iso(-160, 70, 0), iso(150, 70, 0), iso(150, 70, -DECK_Z), iso(-160, 70, -DECK_Z)]),
  pts([iso(-160, 0, -DECK_Z), ...bowCurve(150, 44, -DECK_Z), iso(-160, 70, -DECK_Z)]),
  pts([
    ...bowCurve(150, 44, -DECK_Z, bowVisible(44)),
    ...bowCurve(146, 40, 0, { ...bowVisible(40), reverse: true }),
  ]),
];
// Lighthouse: tapered tower + lantern as a trapezoid stack under the island.
const REFLECT_TOWER = (() => {
  const k = Math.SQRT2 * C;
  const [bx, by] = iso(LH.x, LH.y);
  const seg = (z0: number, z1: number, r0: number, rt: number) =>
    pts([
      [bx - r0 * k, by + z0],
      [bx + r0 * k, by + z0],
      [bx + rt * k, by + z1],
      [bx - rt * k, by + z1],
    ]);
  const top = LH.base + LH.height;
  return [
    seg(ISLAND_H, LH.base, 27, 25),
    seg(LH.base, top, 15, 10),
    seg(top, top + 17, 11, 11),
    seg(top + 17, top + 26, 13, 2),
  ];
})();
// Reflections fade with distance from the waterline: each piece joins a tier
// by its height, and each tier is one group so overlaps never double up.
const REFLECT_TIERS = (() => {
  const tiers = [
    { below: 60, fade: 1, polys: [] as string[] },
    { below: 130, fade: 0.6, polys: [] as string[] },
    { below: Infinity, fade: 0.3, polys: [] as string[] },
  ];
  const add = (z: number, polys: string[]) => tiers.find((t) => z < t.below)!.polys.push(...polys);
  REFLECT_BOXES.forEach((b) => add(b[2], mirrorBox(b)));
  add(0, REFLECT_HULL);
  const top = LH.base + LH.height;
  [ISLAND_H, LH.base, top, top + 17].forEach((z, i) => add(z, [REFLECT_TOWER[i]]));
  return tiers;
})();
const REFLECT_LAMP: Pt = (() => {
  const [bx, by] = iso(LH.x, LH.y);
  return [bx, by + LH.base + LH.height + 9];
})();

const WaterSlab = () => (
  <svg
    className="hb-sprite hb-slab"
    width={STAGE_W}
    height={STAGE_H}
    viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <clipPath id="hb-slab-clip">
        <path d={SLAB_TOP} />
      </clipPath>
      {/* Thin horizontal breaks so reflections read as resting on water. */}
      <pattern id="hb-ripple" width={10} height={5} patternUnits="userSpaceOnUse">
        <rect width={10} height={3.4} fill="#fff" />
      </pattern>
      <mask
        id="hb-ripple-mask"
        maskUnits="userSpaceOnUse"
        x={0}
        y={0}
        width={STAGE_W}
        height={STAGE_H}
      >
        <rect width={STAGE_W} height={STAGE_H} fill="url(#hb-ripple)" />
      </mask>
    </defs>
    {SLAB_RINGS.map((d, i) => (
      <path key={i} className={`hb-slab-ring hb-slab-ring-${i}`} d={d} />
    ))}
    <g className="hb-reflect" clipPath="url(#hb-slab-clip)">
      <g mask="url(#hb-ripple-mask)">
        {REFLECT_TIERS.map((tier, k) => (
          <g key={k} className="hb-reflect-body" style={{ opacity: tier.fade }}>
            {tier.polys.map((p, i) => (
              <polygon key={i} points={p} />
            ))}
          </g>
        ))}
        <ellipse
          className="hb-reflect-lamp"
          cx={r1(REFLECT_LAMP[0])}
          cy={r1(REFLECT_LAMP[1])}
          rx={9}
          ry={5}
        />
      </g>
    </g>
    <polygon
      className="hb-cast"
      clipPath="url(#hb-slab-clip)"
      points={pts([
        iso(QUAY.x0 + 6, QUAY.y1 - 4, 0),
        iso(QUAY.x1, QUAY.y1 - 4, 0),
        iso(QUAY.x1, QUAY.y1 + 22, 0),
        iso(QUAY.x0 + 20, QUAY.y1 + 22, 0),
      ])}
    />
  </svg>
);

/* ---------------------------------------------------------------------------
   Scene
--------------------------------------------------------------------------- */

interface HarborSceneProps {
  name: string;
  yoe: string;
}

/* A slotted-waveguide reflector spinning about its vertical axis. The tilt
   wrapper turns an orthographic CSS 3D view into the scene's isometric view
   (rotateX of asin(tan 30deg) maps horizontal circles onto iso ellipses), so
   the dish genuinely sweeps around the scene's horizontal plane. */
const RADAR_V = 1 / Math.cos(Math.asin(Math.tan(Math.PI / 6)));

const Radar = ({
  at,
  w,
  h,
  period,
}: {
  at: { x: number; y: number; z: number };
  w: number;
  h: number;
  period: string;
}) => {
  const [px, py] = iso(at.x, at.y, at.z);
  const fh = h * RADAR_V;
  const lift = 3 * RADAR_V;
  const dish = `M0 1Q${w / 2} ${fh * 0.34} ${w} 1L${w - 1} ${fh - 2}Q${w / 2} ${fh + fh * 0.18} 1 ${fh - 2}Z`;
  const face = (side: "front" | "back") => (
    <svg
      className={`hb-radar-face hb-radar-face--${side}`}
      style={{ left: -w / 2, top: -fh - lift, width: w, height: fh + 2 }}
      viewBox={`0 0 ${w} ${fh + 2}`}
      aria-hidden="true"
      focusable="false"
    >
      <path d={dish} />
    </svg>
  );
  return (
    <div className="hb-radar" style={{ left: px, top: py }} aria-hidden="true">
      <div className="hb-radar-tilt">
        <div className="hb-radar-spin hb-anim" style={{ animationDuration: period }}>
          {face("front")}
          {face("back")}
          <div className="hb-radar-rim" style={{ left: -w / 2, top: -fh - lift + 1, width: w }} />
          <div
            className="hb-radar-arm"
            style={{ left: -1.5, top: -lift, height: w * 0.32 * RADAR_V }}
          />
          <div className="hb-radar-hub" style={{ left: -3, top: -lift - 1, height: lift + 1 }} />
        </div>
      </div>
    </div>
  );
};

// Empty sky above the crane is cropped off so the slab wall gets the room.
const STAGE_TOP = 40;
// Narrow screens get a cropped, enlarged scene that pans sideways, opening on
// the ship and crane (as a fraction of the stage width).
const PAN_QUERY = "(max-width: 640px)";
const PAN_FOCUS_X = 0.55;
// The pan view also trims the outer water rim below the slab to zoom in further.
const PAN_BOTTOM = 740;
const PAN_PEEK = 56;

const HarborScene = ({ name, yoe }: HarborSceneProps) => {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(0.6);
  const [paused, setPaused] = useState(false);
  // Phones get a still frame: every animated piece is its own compositor layer,
  // and iOS re-rasterises all of them at pinch-zoom scale until it runs out of
  // memory and reloads the page. Tablets (shorter side >= 600px) keep motion.
  const [still] = useState(
    () =>
      window.matchMedia("(hover: none) and (pointer: coarse)").matches &&
      Math.min(window.screen.width, window.screen.height) < 600
  );
  const [tip, setTip] = useState<HoverTip>(null);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [pan, setPan] = useState(() => window.matchMedia(PAN_QUERY).matches);
  const [panned, setPanned] = useState(false);
  const panWidth = r1(STAGE_W * scale);

  useEffect(() => {
    const mq = window.matchMedia(PAN_QUERY);
    const sync = () => setPan(mq.matches);
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Keep the focal point centred until the visitor pans themselves.
  useLayoutEffect(() => {
    const node = scrollerRef.current;
    if (!node) return;
    node.scrollLeft = pan && !panned ? panWidth * PAN_FOCUS_X - node.clientWidth / 2 : 0;
  }, [pan, panned, panWidth]);

  // One gentle sideways nudge the first time the scene is seen, hinting it moves.
  useEffect(() => {
    const node = scrollerRef.current;
    if (!pan || panned || paused || !node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const out = window.setTimeout(() => node.scrollBy({ left: PAN_PEEK, behavior: "smooth" }), 900);
    const back = window.setTimeout(
      () => node.scrollBy({ left: -PAN_PEEK, behavior: "smooth" }),
      1500
    );
    return () => {
      clearTimeout(out);
      clearTimeout(back);
    };
    // Only on first sight: later visibility changes shouldn't nudge again.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pan, paused]);

  useLayoutEffect(() => {
    const node = viewportRef.current;
    if (!node) return;
    const span = (pan ? PAN_BOTTOM : STAGE_H) - STAGE_TOP;
    const measure = () => setScale(node.clientHeight / span);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(node);
    return () => ro.disconnect();
  }, [pan]);

  useEffect(() => {
    const node = viewportRef.current;
    if (!node) return;
    const io = new IntersectionObserver(([entry]) => setPaused(!entry.isIntersecting), {
      threshold: 0,
    });
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={viewportRef} className={`hb-viewport${pan ? " hb-viewport--pan" : ""}`}>
      <h1 className="sr-only">{name}</h1>
      <div
        ref={scrollerRef}
        className="hb-scroller"
        onTouchStart={() => setPanned(true)}
        onPointerDown={() => setPanned(true)}
        onWheel={(e) => e.deltaX !== 0 && setPanned(true)}
      >
        <div className="hb-pan" style={pan ? { width: panWidth } : undefined}>
          <div
            className={`hb-stage${paused ? " hb-paused" : ""}${still ? " hb-static" : ""}`}
            style={{
              width: STAGE_W,
              height: STAGE_H,
              transform: `translate(-50%, ${r1(-STAGE_TOP * scale)}px) scale(${scale})`,
            }}
          >
            {/* Water */}
            <WaterSlab />

            {/* Back plane */}
            <SharkRig half="back" />
            <div
              className="hb-lh hb-anim"
              style={{ transformOrigin: `${LH_BASE[0]}px ${LH_BASE[1]}px` }}
            >
              <Sprite x={80} y={110} w={300} h={290}>
                <Lighthouse />
              </Sprite>
            </div>
            <SharkRig half="front" />
            <Sprite x={560} y={-60} w={640} h={460}>
              <Quay yoe={yoe} />
              <Billboard name={name} />
              <QuayCrates crates={QUAY_CRATES_BACK} onHover={setTip} />
              <Crane />
              <QuayPropsBack />
              <QuayCrates crates={QUAY_CRATES_FRONT} onHover={setTip} />
              <QuayPropsFront />
            </Sprite>

            {/* Mid plane */}
            <>
              <svg
                className="hb-sprite"
                width={STAGE_W}
                height={STAGE_H}
                viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
                aria-hidden="true"
                focusable="false"
              >
                <path className="hb-wake" d={SHIP_FOAM} />
                {MOORING.map((d) => (
                  <g key={d} className="hb-rope">
                    <path d={d} />
                    <path className="hb-rope-twist" d={d} />
                  </g>
                ))}
              </svg>
              <Sprite x={330} y={140} w={440} h={250} className="hb-ship hb-anim">
                <Ship onHover={setTip} />
              </Sprite>
              <Radar at={RADAR_AUX} w={22} h={6} period="1.6s" />
              <Radar at={RADAR_MAIN} w={34} h={9} period="2.4s" />
              <CargoOps paused={paused} still={still} onHover={setTip} />
              {/* In front of the cargo slot, so it must paint over the moving crates. */}
              <Sprite x={560} y={-60} w={640} h={460}>
                <Worker x={138} y={-152} />
              </Sprite>
            </>

            {/* Front plane */}
            <>
              {BUOYS.map((b) => (
                <Buoy key={b.label} {...b} />
              ))}
              <Whale />
            </>

            {/* Beam last so the light is never hidden behind the ship */}
            <div
              className="hb-lh hb-anim"
              style={{ transformOrigin: `${LH_BASE[0]}px ${LH_BASE[1]}px` }}
            >
              <Beam />
            </div>

            {tip && (
              <div className="hb-tip" style={{ left: tip.x, top: tip.y }} role="presentation">
                <strong>{tip.label}</strong>
                <span>{tip.tip}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      {pan && (
        <div className={`hb-pan-hint${panned ? " hb-pan-hint--gone" : ""}`} aria-hidden="true">
          <MoveHorizontal className="w-3.5 h-3.5" />
          Swipe to explore
        </div>
      )}
    </div>
  );
};

export default HarborScene;
