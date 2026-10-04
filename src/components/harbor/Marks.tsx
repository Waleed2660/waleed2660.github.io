import "./marks.css";

// Small harbour motifs reused outside the hero. All decorative.

const wave = (y: number, x0: number) => `M${x0} ${y}q12.5 -3 25 0` + " t25 0".repeat(17);

export const WaveDivider = () => (
  <div aria-hidden="true" className="relative h-px mx-8 sm:mx-24 pointer-events-none">
    <svg
      className="mk-fade absolute inset-x-0 top-1/2 -translate-y-1/2 w-full h-3 text-slate-400/40 dark:text-white/[0.09]"
      viewBox="0 0 400 12"
      preserveAspectRatio="none"
      fill="none"
      stroke="currentColor"
    >
      <path d={wave(4, 0)} vectorEffect="non-scaling-stroke" />
      <path d={wave(9, -12)} vectorEffect="non-scaling-stroke" opacity="0.6" />
    </svg>
  </div>
);

export const Pennant = ({ className = "" }: { className?: string }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 14 14"
    className={`pointer-events-none shrink-0 ${className}`}
  >
    <line x1="1.5" y1="1" x2="1.5" y2="13.5" stroke="currentColor" />
    <path d="M1.5 1.5h11l-3 3 3 3h-11Z" className="fill-brand" />
  </svg>
);

// Corrugated container ribs along a card's top edge, with a box code.
export const ContainerTag = ({ code }: { code: string }) => (
  <div aria-hidden="true" className="pointer-events-none select-none">
    <div className="mk-ribs absolute top-3 left-8 right-24 h-2 text-slate-400/40 dark:text-white/10" />
    <span className="absolute top-2 right-8 font-mono text-[10px] leading-none tracking-widest text-slate-400 dark:text-white/30">
      {code}
    </span>
  </div>
);
