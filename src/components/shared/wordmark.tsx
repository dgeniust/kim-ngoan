import { cn } from "@/lib/utils";

/* =====================================================================
 * "kim ngoan" wordmark – single-line strokes with round caps. Shared by the splash, headers and the home masthead.
 * Coordinates: baseline y=100, x-height 100, stroke 24. Colour follows `currentColor`.
 * With `animate`: the pen draws the joined "ng", then m-i-k pop in from the left and o-a-n from the right
 * (keyframes .splash-draw / .splash-letter-* trong globals.css).
 * ===================================================================== */
const STROKE = 24;
type Glyph = { x: number; d: string; dot?: [number, number]; side: "l" | "r"; order: number };
const GLYPHS: Glyph[] = [
  { x: 0, d: "M12,-55 V100 M62,2 L12,64 M32,42 L64,100", side: "l", order: 2 }, // k
  { x: 96, d: "M12,0 V100", dot: [12, -42], side: "l", order: 1 }, // i
  { x: 138, d: "M12,100 V44 Q12,0 50,0 Q88,0 88,44 V100 M88,44 Q88,0 126,0 Q164,0 164,44 V100", side: "l", order: 0 }, // m
  { x: 608, d: "M112,50 A50,50 0 1 1 12,50 A50,50 0 1 1 112,50", side: "r", order: 0 }, // o
  { x: 750, d: "M112,50 A50,50 0 1 1 12,50 A50,50 0 1 1 112,50 M112,0 V100", side: "r", order: 1 }, // a
  { x: 892, d: "M12,100 V44 Q12,0 52,0 Q92,0 92,44 V100", side: "r", order: 2 }, // n
];
// joined "ng": n stem → arch → right leg → loop up into the g bowl → full circle → g stem → tail hook
const NG =
  "M12,100 V44 Q12,0 52,0 Q92,0 92,44 V80 Q92,102 106,102 Q120,102 120,82 V50 A50,50 0 0 1 170,0 A50,50 0 0 1 220,50 A50,50 0 0 1 170,100 A50,50 0 0 1 120,50 A50,50 0 0 1 170,0 A50,50 0 0 1 220,50 V125 Q220,170 176,170 Q142,170 126,152";
const NG_X = 362;

export function Wordmark({
  className,
  animate = false,
  delay = 0,
  label,
}: {
  className?: string;
  animate?: boolean;
  /** Delay (ms) before drawing starts, when animated. */
  delay?: number;
  /** With a label → role="img"; without → decorative (aria-hidden). */
  label?: string;
}) {
  return (
    <svg
      viewBox="-4 -72 1004 258"
      className={cn("block overflow-visible", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={STROKE}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
    >
      <path d={NG} transform={`translate(${NG_X} 0)`} pathLength={1} className={animate ? "splash-draw" : undefined} style={animate && delay ? { animationDelay: `${40 + delay}ms` } : undefined} />
      {GLYPHS.map((g, i) => (
        <g key={i} transform={`translate(${g.x} 0)`}>
          <g className={animate ? (g.side === "l" ? "splash-letter-l" : "splash-letter-r") : undefined} style={animate ? { animationDelay: `${delay + 430 + g.order * 55}ms` } : undefined}>
            <path d={g.d} />
            {g.dot && <circle cx={g.dot[0]} cy={g.dot[1]} r={14} fill="currentColor" stroke="none" />}
          </g>
        </g>
      ))}
    </svg>
  );
}
