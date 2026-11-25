/**
 * Rolling orchard hills at the foot of the hub footer (pure SVG, no image: light and sharp on any screen).
 * Three hill layers – far/light to near/dark – a row of round trees on the far hill, crop rows on the middle one.
 * Coordinates are deterministic (no runtime randomness) so server and client markup match.
 */
const W = 1440;
const H = 240;

/** Hill height at x (sum of a few sine waves). */
const hill = (x: number, base: number, waves: [number, number, number][]) => waves.reduce((y, [amp, len, phase]) => y + amp * Math.sin((x / len) * Math.PI * 2 + phase), base);

const FAR: [number, number, number][] = [[18, 900, 0.4], [9, 340, 1.7], [4, 130, 0.2]];
const MID: [number, number, number][] = [[22, 1100, 2.6], [8, 420, 0.9], [3, 150, 1.1]];
const NEAR: [number, number, number][] = [[14, 1300, 4.1], [6, 380, 2.2]];

function ridge(base: number, waves: [number, number, number][]) {
  let d = `M0 ${H} L0 ${hill(0, base, waves).toFixed(1)}`;
  for (let x = 12; x <= W; x += 12) d += ` L${x} ${hill(x, base, waves).toFixed(1)}`;
  return `${d} L${W} ${H} Z`;
}

/** Row of round-canopy trees along the far ridge (deterministic pseudo-random). */
function treeLine() {
  const out: { x: number; y: number; r: number }[] = [];
  let seed = 7;
  const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
  for (let x = -10; x < W + 10; ) {
    const r = 5 + rnd() * 9;
    // trees grow in clusters, with gaps between orchards
    if (rnd() > 0.18) out.push({ x, y: hill(x, 118, FAR) - r * 0.55, r });
    x += r * (1.1 + rnd() * 0.9);
  }
  return out;
}
const TREES = treeLine();

/** A few large standalone trees on the middle hill. */
const BIG_TREES = [
  { x: 210, r: 20 },
  { x: 236, r: 14 },
  { x: 1010, r: 24 },
  { x: 1042, r: 16 },
  { x: 1290, r: 18 },
].map((t) => ({ ...t, y: hill(t.x, 160, MID) - t.r * 0.9 }));

export function FooterLandscape({ className }: { className?: string }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax slice" aria-hidden className={className}>
      <defs>
        <radialGradient id="ft-glow" cx="0.6" cy="0.8" r="0.42">
          <stop offset="0" stopColor="#2f8f55" stopOpacity="0.35" />
          <stop offset="1" stopColor="#2f8f55" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ft-mist" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c9e2b0" stopOpacity="0" />
          <stop offset="0.6" stopColor="#c9e2b0" stopOpacity="0.1" />
          <stop offset="1" stopColor="#c9e2b0" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#ft-glow)" />
      {/* far hill + tree row */}
      <path d={ridge(118, FAR)} fill="#174a30" />
      <g fill="#174a30">
        {TREES.map((t, i) => (
          <circle key={i} cx={t.x.toFixed(1)} cy={t.y.toFixed(1)} r={t.r.toFixed(1)} />
        ))}
      </g>
      <rect y="90" width={W} height="90" fill="url(#ft-mist)" />
      {/* middle hill + crop rows + large trees */}
      <path d={ridge(160, MID)} fill="#0f3a24" />
      <g stroke="#1d5a38" strokeOpacity="0.55" strokeWidth="2" strokeLinecap="round" fill="none">
        {Array.from({ length: 7 }, (_, i) => {
          const y0 = 176 + i * 8;
          let d = "";
          for (let x = 380; x <= 900; x += 20) d += `${x === 380 ? "M" : " L"}${x} ${(hill(x, 160, MID) + (y0 - 160) * (1 + i * 0.05)).toFixed(1)}`;
          return <path key={i} d={d} />;
        })}
      </g>
      <g fill="#0b2f1d">
        {BIG_TREES.map((t, i) => (
          <g key={i}>
            <rect x={t.x - 1.5} y={t.y + t.r * 0.6} width="3" height={t.r * 0.9} />
            <circle cx={t.x} cy={t.y} r={t.r} />
            <circle cx={t.x - t.r * 0.6} cy={t.y + t.r * 0.25} r={t.r * 0.7} />
            <circle cx={t.x + t.r * 0.55} cy={t.y + t.r * 0.3} r={t.r * 0.65} />
          </g>
        ))}
      </g>
      {/* near hill – backdrop for the copyright line */}
      <path d={ridge(206, NEAR)} fill="#041a0f" />
    </svg>
  );
}
