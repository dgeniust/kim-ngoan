/**
 * Edge motifs that replace the leaf frames while the hub products block shows the Tyres / Steel tab.
 * Flat, faint SVG in each sector's colour pair (design.md §6): tyres = slate #1E293B + orange #EA580C,
 * steel = steel blue #0F4C81 + brick #DC2626. `side` mirrors the drawing for the right edge.
 */
type Side = "l" | "r";

const range = (n: number) => Array.from({ length: n }, (_, i) => i);

function Tyre({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const blocks = 40;
  return (
    <g>
      {/* tread blocks */}
      {range(blocks).map((i) => (
        <rect
          key={i}
          x={cx - r * 0.07}
          y={cy - r - r * 0.12}
          width={r * 0.14}
          height={r * 0.2}
          rx={r * 0.03}
          transform={`rotate(${(360 / blocks) * i} ${cx} ${cy})`}
          fill="#1E293B"
          fillOpacity={0.16}
        />
      ))}
      <circle cx={cx} cy={cy} r={r * 0.86} fill="none" stroke="#1E293B" strokeOpacity={0.14} strokeWidth={r * 0.24} />
      {/* rim */}
      <circle cx={cx} cy={cy} r={r * 0.56} fill="none" stroke="#EA580C" strokeOpacity={0.55} strokeWidth={4} />
      <circle cx={cx} cy={cy} r={r * 0.14} fill="#EA580C" fillOpacity={0.35} />
      {range(5).map((i) => (
        <line
          key={i}
          x1={cx}
          y1={cy - r * 0.18}
          x2={cx}
          y2={cy - r * 0.52}
          stroke="#1E293B"
          strokeOpacity={0.22}
          strokeWidth={r * 0.07}
          strokeLinecap="round"
          transform={`rotate(${72 * i} ${cx} ${cy})`}
        />
      ))}
    </g>
  );
}

export function TyreMotif({ side, className, style }: { side: Side; className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 300 1000" preserveAspectRatio={side === "l" ? "xMinYMid slice" : "xMaxYMid slice"} aria-hidden className={className} style={style}>
      <g transform={side === "r" ? "translate(300 0) scale(-1 1)" : undefined}>
        <Tyre cx={20} cy={250} r={210} />
        <Tyre cx={150} cy={720} r={130} />
        {/* tyre tracks */}
        {range(14).map((i) => (
          <rect key={i} x={250} y={420 + i * 42} width={26} height={20} rx={3} fill="#EA580C" fillOpacity={i % 3 === 0 ? 0.35 : 0.12} transform="skewY(-8)" />
        ))}
      </g>
    </svg>
  );
}

function IBeam({ x, y, w }: { x: number; y: number; w: number }) {
  const h = w * 1.15;
  const f = w * 0.16;
  const web = w * 0.14;
  return (
    <path
      d={`M${x},${y} h${w} v${f} h${-(w - web) / 2} v${h - 2 * f} h${(w - web) / 2} v${f} h${-w} v${-f} h${(w - web) / 2} v${-(h - 2 * f)} h${-(w - web) / 2} Z`}
      fill="#0F4C81"
      fillOpacity={0.14}
      stroke="#0F4C81"
      strokeOpacity={0.35}
      strokeWidth={2}
    />
  );
}

function Rebar({ x, y, len }: { x: number; y: number; len: number }) {
  return (
    <g>
      <rect x={x} y={y} width={18} height={len} rx={9} fill="#0F4C81" fillOpacity={0.16} />
      {range(Math.floor(len / 26)).map((i) => (
        <line key={i} x1={x} y1={y + 14 + i * 26} x2={x + 18} y2={y + 4 + i * 26} stroke="#0F4C81" strokeOpacity={0.4} strokeWidth={3} strokeLinecap="round" />
      ))}
    </g>
  );
}

export function SteelMotif({ side, className, style }: { side: Side; className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 300 1000" preserveAspectRatio={side === "l" ? "xMinYMid slice" : "xMaxYMid slice"} aria-hidden className={className} style={style}>
      <g transform={side === "r" ? "translate(300 0) scale(-1 1)" : undefined}>
        {/* drafting grid */}
        {range(11).map((i) => (
          <line key={`h${i}`} x1={0} y1={i * 100} x2={300} y2={i * 100} stroke="#0F4C81" strokeOpacity={0.08} />
        ))}
        {range(4).map((i) => (
          <line key={`v${i}`} x1={i * 100} y1={0} x2={i * 100} y2={1000} stroke="#0F4C81" strokeOpacity={0.08} />
        ))}
        <IBeam x={30} y={110} w={120} />
        <IBeam x={170} y={260} w={80} />
        <Rebar x={60} y={330} len={420} />
        <Rebar x={100} y={380} len={360} />
        <Rebar x={140} y={430} len={300} />
        <IBeam x={40} y={790} w={100} />
        {/* brick-red accents */}
        <rect x={200} y={560} width={60} height={60} fill="#DC2626" fillOpacity={0.22} />
        <rect x={230} y={640} width={30} height={30} fill="#DC2626" fillOpacity={0.4} />
        <rect x={180} y={120} width={14} height={14} fill="#DC2626" fillOpacity={0.5} />
      </g>
    </svg>
  );
}
