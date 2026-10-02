import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
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
  { x: 74, y: BACK_Y, level: 0, color: "blue" },
  { x: 74, y: BACK_Y, level: 1, label: "Nginx", tip: "Edge proxy", color: "green" },
];

const HOIST_CRATE: Crate = {
  x: 74,
  y: FRONT_Y,
  level: 0,
  label: "k6",
  color: "purple",
  tip: "Load testing",
};

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

// Foam hugging the hull where it meets the water: along the flank, round the bow.
const SHIP_FOAM = (() => {
  const from = Math.atan2(46, 39);
  const bow: Pt[] = [];
  for (let i = 0; i <= BOW_STEPS; i++) {
    const t = Math.PI - ((Math.PI - from) * i) / BOW_STEPS;
    bow.push(iso(149 + 46 * Math.sin(t), 35 - 39 * Math.cos(t), -8));
  }
  return `M${pts([iso(-158, 75, -8), iso(149, 74, -8), ...bow]).replace(/ /g, "L")}`;
})();

const BRIDGE_H = 40;
const CAB_Z = DECK_Z + BRIDGE_H + 3;
const CAB_H = 17;
const ROOF_Z = CAB_Z + CAB_H + 3;
const RADAR_MAST_H = 16;
// Pivot points (top of each pedestal) for the spinning radar dishes.
const RADAR_MAIN = { x: -128, y: 42, z: ROOF_Z + 5 };
const RADAR_AUX = { x: -144, y: 20, z: ROOF_Z + RADAR_MAST_H + 4 };

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
        <polygon className="hb-top" points={deck} />
      </g>

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
   Crane (static) + hoist (animated)
--------------------------------------------------------------------------- */

const CRANE_X = 96;
const BOOM_Z = 216;
const BOOM_END_Y = 66;
const TROLLEY: Pt = iso(CRANE_X + 7, FRONT_Y + CRATE.d / 2, BOOM_Z - 10);
const HOIST_TOP: Pt = iso(CRANE_X + 7, FRONT_Y + CRATE.d / 2, DECK_Z + CRATE.h + 3);
export const HOIST_LIFT = 110;

// Faces only rise from the waterline; a tinted band + foam reads as submerged.
const QUAY_WATERLINE = 5;
// Quay slab with rounded corners in plan. Visible walls are the arcs whose
// outward normal faces the viewer (-45deg..135deg); they split at 45deg into
// the right-lit and left-lit faces, like a box's two visible sides.
const QUAY_Z = 24;
const QUAY = { x0: 10, y0: -210, x1: 340, y1: -100, r: 18, h: QUAY_Z };
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

const Quay = ({ yoe }: { yoe: string }) => (
  <g className="hb-quay">
    <polygon className="hb-top hb-seamless" points={quayTop} />
    <polygon
      className="hb-left hb-seamless"
      points={quayWall([...QUAY_RIGHT, ...QUAY_LEFT], 0, QUAY.h)}
    />
    <polygon className="hb-submerged" points={quayWall(QUAY_RIGHT, 0, QUAY_WATERLINE)} />
    <polygon className="hb-submerged" points={quayWall(QUAY_LEFT, 0, QUAY_WATERLINE)} />
    <path className="hb-foam-line" d={quayFoam} />
    {[40, 110, 180, 250, 310].map((bx) => (
      <Box key={bx} x={bx} y={-120} z={QUAY_Z} w={8} d={8} h={8} className="hb-bollard" />
    ))}
    <g transform={onLeftFace((QUAY.x0 + QUAY.x1) / 2, QUAY.y1, QUAY_WATERLINE + 4)}>
      <text className="hb-label hb-manifest" textAnchor="middle">{`${yoe} AT SEA`}</text>
    </g>
  </g>
);

const QUAY_CRATES_BACK: Crate[] = [
  { x: 20, y: -200, level: 0, color: "rust" },
  { x: 20, y: -168, level: 0, color: "blue", label: "DynamoDB", tip: "Key-value store" },
  { x: 20, y: -200, level: 1, color: "green", label: "Python", tip: "Scripting & tooling" },
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

const Crane = () => {
  const towerY = -160;
  const braces: string[] = [];
  for (let z = QUAY_Z; z < BOOM_Z - 20; z += 24) {
    const a = iso(CRANE_X, towerY + 14, z);
    const b = iso(CRANE_X + 14, towerY + 14, z + 24);
    const c2 = iso(CRANE_X + 14, towerY + 14, z);
    const d2 = iso(CRANE_X, towerY + 14, z + 24);
    braces.push(
      `M${r1(a[0])} ${r1(a[1])}L${r1(b[0])} ${r1(b[1])}M${r1(c2[0])} ${r1(c2[1])}L${r1(d2[0])} ${r1(d2[1])}`
    );
  }
  const [tbx, tby] = iso(CRANE_X + 7, towerY + 7, BOOM_Z + 10);
  const [apx, apy] = iso(CRANE_X + 7, towerY + 7, BOOM_Z + 46);
  const [frx, fry] = iso(CRANE_X + 7, BOOM_END_Y, BOOM_Z + 10);
  const [bkx, bky] = iso(CRANE_X + 7, -196, BOOM_Z + 10);

  return (
    <g className="hb-c-crane">
      <Box x={CRANE_X - 6} y={towerY - 6} z={QUAY_Z} w={26} d={26} h={6} />
      <Box x={CRANE_X} y={towerY} z={QUAY_Z + 6} w={14} d={14} h={BOOM_Z - QUAY_Z - 6} />
      <path className="hb-rib" d={braces.join("")} />
      <Box x={CRANE_X - 2} y={-202} z={BOOM_Z - 18} w={18} d={28} h={18} className="hb-c-red" />
      {/* Operator cab: white floor and roof around a tall wraparound glass box. */}
      <Box
        x={CRANE_X - 5}
        y={towerY + 13}
        z={CAB_GLASS_Z - 4}
        w={24}
        d={24}
        h={4}
        className="hb-c-white"
      />
      <g className="hb-c-glass">
        <Box x={CRANE_X - 4} y={towerY + 14} z={CAB_GLASS_Z} w={22} d={22} h={CAB_GLASS_H} />
        {[
          onLeftFace(CRANE_X - 4, towerY + 36, CAB_GLASS_Z + CAB_GLASS_H),
          onRightFace(CRANE_X + 18, towerY + 36, CAB_GLASS_Z + CAB_GLASS_H),
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
        x={CRANE_X - 5}
        y={towerY + 13}
        z={CAB_GLASS_Z + CAB_GLASS_H}
        w={24}
        d={24}
        h={5}
        className="hb-c-white"
      />
      <Box x={CRANE_X} y={-196} z={BOOM_Z} w={14} d={BOOM_END_Y + 196} h={10} />
      <line className="hb-ink" x1={tbx} y1={tby} x2={apx} y2={apy} />
      <line className="hb-ink hb-thin" x1={apx} y1={apy} x2={frx} y2={fry} />
      <line className="hb-ink hb-thin" x1={apx} y1={apy} x2={bkx} y2={bky} />
    </g>
  );
};

const HOIST_BOX = { x: 590, y: 120, w: 140, h: 320 };

const Hoist = ({ onHover }: { onHover: (t: HoverTip) => void }) => {
  const [tx, ty] = crateTipAnchor(HOIST_CRATE);
  const cableLen = HOIST_TOP[1] - TROLLEY[1];
  return (
    <>
      <div
        className="hb-sprite hb-cable hb-anim"
        style={{ left: TROLLEY[0] - 6, top: TROLLEY[1], width: 12, height: cableLen }}
      />
      <Sprite {...HOIST_BOX} className="hb-hoist hb-anim">
        <g
          className="hb-crate"
          onPointerEnter={() =>
            onHover({ label: HOIST_CRATE.label!, tip: HOIST_CRATE.tip!, x: tx, y: ty })
          }
          onPointerLeave={() => onHover(null)}
        >
          <CrateShape c={HOIST_CRATE} z={DECK_Z} />
          <Box
            x={HOIST_CRATE.x + 6}
            y={HOIST_CRATE.y + 4}
            z={DECK_Z + CRATE.h}
            w={CRATE.w - 12}
            d={CRATE.d - 8}
            h={3}
          />
        </g>
      </Sprite>
      <Sprite x={TROLLEY[0] - 30} y={TROLLEY[1] - 30} w={60} h={40}>
        <Box
          x={CRANE_X}
          y={FRONT_Y + 6}
          z={BOOM_Z - 10}
          w={14}
          d={BOOM_END_Y - FRONT_Y - 6}
          h={10}
          className="hb-c-crane hb-trolley"
        />
      </Sprite>
    </>
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

// The name lies on the water: its baseline runs along the +x iso axis (parallel
// to the hull) and glyph "down" along +y, so it faces the sky.
const NAME_BOX = { x: 196, y: 509, w: 600, h: 70 };
const NAME_FLOOR = `matrix(${C}, 0.5, ${-C}, 0.5, 0, 0)`;
const LH_BASE: Pt = iso(LH.x, LH.y, 0);

/* ---------------------------------------------------------------------------
   Water slab: a rounded-rectangle tray of sea lying on the floor plane. Only
   the near half of its outline (outward normal facing the viewer) grows a
   wall, cut through the water column and the sand bed beneath it.
--------------------------------------------------------------------------- */

const SLAB = { x0: -420, y0: -280, x1: 490, y1: 430, r: 355 };
const SLAB_DEPTH = 60;
const SAND_DEPTH = 19;
const WATER_BANDS = 12;

// Outline in world units, resampled every ~6 units; `a` is the outward normal
// in degrees, `s` the running arc length (drives the sand ripple).
const SLAB_OUTLINE = (() => {
  const { x0, y0, x1, y1, r } = SLAB;
  const raw: { p: Pt; a: number }[] = [];
  const corners: [number, number, number][] = [
    [x1 - r, y0 + r, -90],
    [x1 - r, y1 - r, 0],
    [x0 + r, y1 - r, 90],
    [x0 + r, y0 + r, 180],
  ];
  for (const [cx, cy, a0] of corners)
    for (let i = 0; i <= 64; i++) {
      const a = a0 + (90 * i) / 64;
      const t = (a * Math.PI) / 180;
      raw.push({ p: [cx + r * Math.cos(t), cy + r * Math.sin(t)], a });
    }
  const out: { p: Pt; a: number; s: number }[] = [];
  let s = 0;
  raw.forEach((q, i) => {
    const prev = raw[i - 1];
    if (prev) {
      const len = Math.hypot(q.p[0] - prev.p[0], q.p[1] - prev.p[1]);
      const n = Math.max(1, Math.round(len / 6));
      for (let k = 1; k < n; k++)
        out.push({
          p: [
            prev.p[0] + ((q.p[0] - prev.p[0]) * k) / n,
            prev.p[1] + ((q.p[1] - prev.p[1]) * k) / n,
          ],
          a: q.a,
          s: s + (len * k) / n,
        });
      s += len;
    }
    out.push({ ...q, s });
  });
  return out;
})();
const SLAB_FRONT = SLAB_OUTLINE.filter(({ a }) => a >= -45 && a <= 135);
const sandTop = (s: number) =>
  -(SLAB_DEPTH - SAND_DEPTH) + 2.6 * Math.sin(s * 0.042) + 1.3 * Math.sin(s * 0.13 + 1);
const slabBand = (z0: (s: number) => number, z1: (s: number) => number) =>
  pts([
    ...SLAB_FRONT.map(({ p, s }) => iso(p[0], p[1], z0(s))),
    ...SLAB_FRONT.map(({ p, s }) => iso(p[0], p[1], z1(s))).reverse(),
  ]);
const slabRun = (z: number, dy = 0) =>
  `M${pts(SLAB_FRONT.map(({ p }) => iso(p[0], p[1], z)).map(([x, y]) => [x, y + dy] as Pt)).replace(/ /g, "L")}`;
const SLAB_TOP = `M${pts(SLAB_OUTLINE.map(({ p }) => iso(...p))).replace(/ /g, "L")}Z`;
const SLAB_CENTRE = iso((SLAB.x0 + SLAB.x1) / 2, (SLAB.y0 + SLAB.y1) / 2);
const SLAB_KEEL = iso(SLAB.x1 - SLAB.r * (1 - Math.SQRT1_2), SLAB.y1 - SLAB.r * (1 - Math.SQRT1_2));
// Pebbles and shells bedded in the sand: [arc length, depth above the floor, size, shell?]
const SLAB_STONES: [number, number, number, boolean][] = [
  [260, 7, 3.2, false],
  [300, 5, 2.2, false],
  [520, 9, 4, true],
  [760, 6, 2.6, false],
  [990, 8, 3.6, false],
  [1020, 5, 2, false],
  [1230, 9, 3.6, true],
  [1420, 6, 3, false],
  [1660, 7, 2.4, false],
];

// Schools patrol the front wall on rails following the slab's curve. `z` is the
// depth below the surface, `dur` a lap in seconds, `n` the school size.
const FISH_SCHOOLS = [
  { z: -17, dur: 38, n: 4, scale: 1.3, reverse: false },
  { z: -29, dur: 52, n: 3, scale: 1.05, reverse: true },
  { z: -23, dur: 30, n: 3, scale: 1.45, reverse: false },
];
const FISH_COLOURS = [
  "hsl(28 95% 58%)",
  "hsl(48 95% 60%)",
  "hsl(350 85% 66%)",
  "hsl(172 70% 52%)",
  "hsl(268 75% 72%)",
  "hsl(200 90% 78%)",
];
const FISH_RAILS = FISH_SCHOOLS.map(({ z, reverse }) => {
  const run = SLAB_FRONT.map(({ p }) => iso(p[0], p[1], z));
  return `M${pts(reverse ? run.reverse() : run).replace(/ /g, "L")}`;
});

const WaterSlab = () => {
  const front0 = SLAB_FRONT[0].s;
  const stones = SLAB_STONES.map(([ds, h, size, shell]) => {
    const target = front0 + ds;
    const q = SLAB_FRONT.find(({ s }) => s >= target) ?? SLAB_FRONT[SLAB_FRONT.length - 1];
    const [x, y] = iso(q.p[0], q.p[1], -SLAB_DEPTH + h);
    return { x: r1(x), y: r1(y), size, shell };
  });
  const [kx, ky] = SLAB_KEEL;
  const fadeXs = SLAB_FRONT.map(({ p }) => iso(p[0], p[1])[0]);
  const fx0 = Math.min(...fadeXs);
  const fx1 = Math.max(...fadeXs);
  return (
    <svg
      className="hb-sprite hb-slab"
      width={STAGE_W}
      height={STAGE_H}
      viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient
          id="hb-slab-sea"
          gradientUnits="userSpaceOnUse"
          cx={SLAB_CENTRE[0]}
          cy={SLAB_CENTRE[1]}
          r={560}
          gradientTransform={`translate(${r1(SLAB_CENTRE[0])} ${r1(SLAB_CENTRE[1])}) scale(1 0.58) translate(${r1(-SLAB_CENTRE[0])} ${r1(-SLAB_CENTRE[1])})`}
        >
          <stop className="hb-slab-sea-0" offset="0" />
          <stop className="hb-slab-sea-mid" offset="0.55" />
          <stop className="hb-slab-sea-1" offset="1" />
        </radialGradient>
        <linearGradient
          id="hb-slab-turn"
          gradientUnits="userSpaceOnUse"
          x1={r1(kx - 140)}
          y1={0}
          x2={r1(kx + 220)}
          y2={0}
        >
          <stop className="hb-slab-turn-0" offset="0" />
          <stop className="hb-slab-turn-1" offset="1" />
        </linearGradient>
        <pattern id="hb-slab-grain" width={13} height={9} patternUnits="userSpaceOnUse">
          <circle cx={2} cy={2} r={0.8} />
          <circle cx={8.5} cy={1.5} r={0.6} />
          <circle cx={5} cy={5.5} r={0.9} />
          <circle cx={11} cy={6.5} r={0.6} />
          <circle cx={1} cy={7.5} r={0.5} />
        </pattern>
        <linearGradient
          id="hb-slab-fade"
          gradientUnits="userSpaceOnUse"
          x1={r1(fx0)}
          y1={0}
          x2={r1(fx1)}
          y2={0}
        >
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.14" stopColor="#fff" stopOpacity="1" />
          <stop offset="0.9" stopColor="#fff" stopOpacity="1" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask
          id="hb-slab-mask"
          maskUnits="userSpaceOnUse"
          x={0}
          y={0}
          width={STAGE_W}
          height={STAGE_H}
        >
          <rect width={STAGE_W} height={STAGE_H} fill="url(#hb-slab-fade)" />
        </mask>
        <filter id="hb-slab-soft" x="-5%" y="-20%" width="110%" height="140%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>
      <g mask="url(#hb-slab-mask)">
        <path className="hb-slab-shadow" d={slabRun(-SLAB_DEPTH, 6)} filter="url(#hb-slab-soft)" />
        <polygon
          className="hb-slab-deep"
          points={slabBand(
            () => 0,
            () => -SLAB_DEPTH
          )}
        />
        {FISH_SCHOOLS.map(({ dur, n, scale, reverse }, si) =>
          Array.from({ length: n }, (_, i) => (
            <g
              key={`${si}-${i}`}
              className="hb-fish hb-anim"
              style={{
                ["--hb-fish" as string]: FISH_COLOURS[(si * 3 + i * 2 + si) % FISH_COLOURS.length],
                offsetPath: `path('${FISH_RAILS[si]}')`,
                offsetDistance: `${r1(((i + 0.4 * si) / n) * 100)}%`,
                animationDuration: `${dur}s`,
                animationDelay: `${r1((-i * dur) / n - si * 3)}s`,
              }}
            >
              <g
                transform={`translate(0 ${[0, 3, -2.5, 1.5][i % 4]}) scale(${scale} ${reverse ? -scale : scale})`}
              >
                <path d="M-4 0Q0-2.5 4 0Q0 2.5-4 0ZM-4 0L-7-2.2V2.2Z" />
              </g>
            </g>
          ))
        )}
        {Array.from({ length: WATER_BANDS }, (_, i) => {
          const zTop = -((SLAB_DEPTH - SAND_DEPTH + 3) * i) / WATER_BANDS;
          const zBot = -((SLAB_DEPTH - SAND_DEPTH + 3) * (i + 1)) / WATER_BANDS;
          return (
            <polygon
              key={i}
              className="hb-slab-shallow"
              style={{ fillOpacity: r1((1 - i / WATER_BANDS) * 0.9) }}
              points={slabBand(
                () => zTop,
                () => zBot
              )}
            />
          );
        })}
        <polygon className="hb-slab-sand" points={slabBand(sandTop, () => -SLAB_DEPTH)} />
        <polygon className="hb-slab-grain" points={slabBand(sandTop, () => -SLAB_DEPTH)} />
        <path
          className="hb-slab-crest"
          d={`M${pts(SLAB_FRONT.map(({ p, s }) => iso(p[0], p[1], sandTop(s)))).replace(/ /g, "L")}`}
        />
        {stones.map(({ x, y, size, shell }, i) =>
          shell ? (
            <path
              key={i}
              className="hb-slab-shell"
              d={`M${r1(x - size * 1.3)} ${y}A${r1(size * 1.3)} ${r1(size * 1.1)} 0 0 1 ${r1(x + size * 1.3)} ${y}Z`}
            />
          ) : (
            <ellipse key={i} className="hb-slab-pebble" cx={x} cy={y} rx={size * 1.4} ry={size} />
          )
        )}
        <polygon
          className="hb-slab-turn"
          points={slabBand(
            () => 0,
            () => -SLAB_DEPTH
          )}
        />
        <path className="hb-slab-floor" d={slabRun(-SLAB_DEPTH)} />
      </g>
      <path className="hb-slab-top" d={SLAB_TOP} />
      <polygon
        className="hb-cast"
        points={pts([
          iso(QUAY.x0 + 6, QUAY.y1 - 4, 0),
          iso(QUAY.x1 - 6, QUAY.y1 - 4, 0),
          iso(QUAY.x1 + 14, QUAY.y1 + 22, 0),
          iso(QUAY.x0 + 20, QUAY.y1 + 22, 0),
        ])}
      />
      <path className="hb-slab-rim" d={slabRun(0)} mask="url(#hb-slab-mask)" />
    </svg>
  );
};

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

const HarborScene = ({ name, yoe }: HarborSceneProps) => {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(0.6);
  const [paused, setPaused] = useState(false);
  const [tip, setTip] = useState<HoverTip>(null);

  useLayoutEffect(() => {
    const node = viewportRef.current;
    if (!node) return;
    const measure = () => setScale(node.clientHeight / (STAGE_H - STAGE_TOP));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(node);
    return () => ro.disconnect();
  }, []);

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
    <div ref={viewportRef} className="hb-viewport">
      <div
        className={`hb-stage${paused ? " hb-paused" : ""}`}
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
        <Sprite x={600} y={-30} w={440} h={420}>
          <Quay yoe={yoe} />
          <QuayCrates crates={QUAY_CRATES_BACK} onHover={setTip} />
          <Crane />
          <QuayCrates crates={QUAY_CRATES_FRONT} onHover={setTip} />
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
          </svg>
          <Sprite x={330} y={140} w={440} h={250} className="hb-ship hb-anim">
            <Ship onHover={setTip} />
          </Sprite>
          <Radar at={RADAR_AUX} w={22} h={6} period="1.6s" />
          <Radar at={RADAR_MAIN} w={34} h={9} period="2.4s" />
          <Hoist onHover={setTip} />
        </>

        {/* Front plane */}
        <>
          {BUOYS.map((b) => (
            <Buoy key={b.label} {...b} />
          ))}
          <div
            className="hb-name-wrap hb-anim"
            style={{ left: NAME_BOX.x, top: NAME_BOX.y, width: NAME_BOX.w, height: NAME_BOX.h }}
          >
            <h1 className="hb-name" data-text={name} style={{ transform: NAME_FLOOR }}>
              {name}
            </h1>
          </div>
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
  );
};

export default HarborScene;
