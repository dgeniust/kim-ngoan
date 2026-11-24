import type { ArtKind } from "@/lib/data/types";
import { cn } from "@/lib/utils";

/**
 * Hình minh hoạ vector cho sản phẩm khi CHƯA có ảnh chụp thật.
 * Khi khách gửi ảnh: điền `images` cho sản phẩm, <ProductVisual> sẽ tự ưu tiên ảnh.
 */

const STEEL = { hi: "#d9dbde", mid: "#a4a8ad", low: "#6b6f75", deep: "#2a2c2f" };

function Tyre({ variant }: { variant: "tyre" | "tyre-at" | "tyre-truck" }) {
  const tread = variant === "tyre" ? "5 3.2" : variant === "tyre-at" ? "11 5" : "8 4";
  const treadW = variant === "tyre" ? 9 : variant === "tyre-at" ? 15 : 12;
  const rimR = variant === "tyre-truck" ? 44 : variant === "tyre-at" ? 50 : 56;
  const spokes = variant === "tyre-at" ? 6 : 5;
  return (
    <>
      <ellipse cx="100" cy="186" rx="62" ry="6" fill="#000" opacity="0.28" />
      {/* thân lốp */}
      <circle cx="100" cy="100" r="84" fill="#1b1b1e" />
      <circle cx="100" cy="100" r="84" fill="none" stroke="#3b3b40" strokeWidth={treadW} strokeDasharray={tread} />
      <circle cx="100" cy="100" r={84 - treadW / 2 - 2} fill="#141416" />
      <circle cx="100" cy="100" r={rimR + 12} fill="none" stroke="#2c2c30" strokeWidth="1.5" />
      <circle cx="100" cy="100" r={rimR + 6} fill="none" stroke="var(--v-spark, #e25a0c)" strokeWidth="1.5" strokeDasharray="38 400" strokeLinecap="round" transform="rotate(-70 100 100)" />
      {/* mâm */}
      <circle cx="100" cy="100" r={rimR} fill={STEEL.low} />
      <circle cx="100" cy="100" r={rimR - 4} fill="#232326" />
      {variant === "tyre-truck" ? (
        <>
          <circle cx="100" cy="100" r={rimR - 8} fill={STEEL.mid} />
          {Array.from({ length: 8 }).map((_, i) => (
            <circle key={i} cx="100" cy={100 - (rimR - 18)} r="5" fill="#1b1b1e" transform={`rotate(${i * 45} 100 100)`} />
          ))}
          <circle cx="100" cy="100" r="13" fill={STEEL.low} />
          {Array.from({ length: 6 }).map((_, i) => (
            <circle key={i} cx="100" cy="91" r="1.8" fill={STEEL.hi} transform={`rotate(${i * 60} 100 100)`} />
          ))}
        </>
      ) : (
        <>
          {Array.from({ length: spokes }).map((_, i) => (
            <path
              key={i}
              d={`M94 100 L96 ${100 - rimR + 6} L104 ${100 - rimR + 6} L106 100 Z`}
              fill={i % 2 ? STEEL.mid : STEEL.hi}
              transform={`rotate(${(360 / spokes) * i} 100 100)`}
            />
          ))}
          <circle cx="100" cy="100" r="13" fill={STEEL.hi} />
          <circle cx="100" cy="100" r="6" fill="#232326" />
        </>
      )}
      {/* ánh sáng */}
      <path d="M38 62 A72 72 0 0 1 96 26" fill="none" stroke="#fff" strokeOpacity="0.14" strokeWidth="5" strokeLinecap="round" />
    </>
  );
}

function Rebar() {
  const bar = (y: number, x: number, key: number) => (
    <g key={key} transform={`translate(${x} ${y})`}>
      <rect x="0" y="0" width="150" height="15" rx="7.5" fill={STEEL.low} />
      <rect x="0" y="2" width="150" height="4" rx="2" fill={STEEL.hi} opacity="0.55" />
      {Array.from({ length: 13 }).map((_, i) => (
        <path key={i} d={`M${10 + i * 11} 0 l5 15`} stroke={STEEL.deep} strokeWidth="2.2" opacity="0.55" />
      ))}
      <circle cx="150" cy="7.5" r="7.5" fill={STEEL.mid} />
      <circle cx="150" cy="7.5" r="3.5" fill={STEEL.low} />
    </g>
  );
  return (
    <g transform="rotate(-14 100 100)">
      {[0, 1, 2, 3].map((i) => bar(58 + i * 21, 18 + (i % 2) * 10, i))}
      <rect x="62" y="52" width="9" height="88" rx="2" fill={STEEL.deep} />
      <rect x="120" y="52" width="9" height="88" rx="2" fill={STEEL.deep} />
    </g>
  );
}

function IBeam() {
  // Thép chữ I phối cảnh trục đo
  return (
    <g>
      <ellipse cx="104" cy="176" rx="74" ry="7" fill="#000" opacity="0.14" />
      {/* cánh trên */}
      <path d="M22 62 L122 30 L178 46 L78 78 Z" fill={STEEL.hi} />
      <path d="M22 62 L78 78 L78 88 L22 72 Z" fill={STEEL.mid} />
      <path d="M78 78 L178 46 L178 56 L78 88 Z" fill={STEEL.low} />
      {/* bụng */}
      <path d="M44 78 L56 82 L56 140 L44 136 Z" fill={STEEL.mid} />
      <path d="M56 82 L156 50 L156 108 L56 140 Z" fill={STEEL.low} />
      <path d="M56 82 L156 50 L156 60 L56 92 Z" fill={STEEL.deep} opacity="0.35" />
      {/* cánh dưới */}
      <path d="M22 130 L44 123 L56 127 L56 140 L78 146 L178 114 L178 124 L78 156 L22 140 Z" fill={STEEL.mid} />
      <path d="M78 146 L178 114 L178 124 L78 156 Z" fill={STEEL.deep} opacity="0.55" />
      <path d="M22 130 L78 146 L78 156 L22 140 Z" fill={STEEL.hi} />
    </g>
  );
}

function Pipes({ square }: { square?: boolean }) {
  const rows = [
    [0, 1, 2],
    [0.5, 1.5],
    [1],
  ];
  const size = 46;
  return (
    <g>
      <ellipse cx="100" cy="178" rx="78" ry="6" fill="#000" opacity="0.14" />
      {rows.map((row, r) =>
        row.map((c) => {
          const x = 31 + c * size;
          const y = 128 - r * (square ? size : size * 0.87);
          return square ? (
            <g key={`${r}-${c}`}>
              <rect x={x} y={y} width={size - 4} height={size - 4} rx="3" fill={STEEL.mid} />
              <rect x={x + 6} y={y + 6} width={size - 16} height={size - 16} rx="1.5" fill={STEEL.deep} />
              <path d={`M${x + 3} ${y + 3} h${size - 10}`} stroke={STEEL.hi} strokeWidth="2.5" strokeLinecap="round" />
            </g>
          ) : (
            <g key={`${r}-${c}`}>
              <circle cx={x + size / 2} cy={y + size / 2} r={size / 2 - 1} fill={STEEL.mid} />
              <circle cx={x + size / 2} cy={y + size / 2} r={size / 2 - 7} fill={STEEL.deep} />
              <path
                d={`M${x + 8} ${y + 14} A${size / 2 - 3} ${size / 2 - 3} 0 0 1 ${x + size - 12} ${y + 8}`}
                stroke={STEEL.hi}
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
              />
            </g>
          );
        }),
      )}
    </g>
  );
}

function Roofing() {
  // Tấm tôn sóng vuông nhìn chéo
  const waves = Array.from({ length: 7 });
  return (
    <g>
      <ellipse cx="100" cy="176" rx="80" ry="6" fill="#000" opacity="0.12" />
      {waves.map((_, i) => {
        const x = 18 + i * 22;
        return (
          <g key={i}>
            <path d={`M${x} 150 L${x + 34} 50 L${x + 46} 50 L${x + 12} 150 Z`} fill={i % 2 ? STEEL.mid : STEEL.hi} />
            <path d={`M${x + 12} 150 L${x + 46} 50 L${x + 56} 56 L${x + 22} 156 Z`} fill={STEEL.low} />
          </g>
        );
      })}
      <path d="M18 150 L52 50" stroke="#fff" strokeOpacity="0.5" strokeWidth="1.5" />
    </g>
  );
}

function Coil() {
  return (
    <g>
      <ellipse cx="104" cy="176" rx="76" ry="7" fill="#000" opacity="0.14" />
      <path d="M100 30 h34 a70 70 0 0 1 0 140 h-34 Z" fill={STEEL.low} />
      <circle cx="100" cy="100" r="70" fill={STEEL.mid} />
      {[62, 54, 46, 38].map((r) => (
        <circle key={r} cx="100" cy="100" r={r} fill="none" stroke={STEEL.low} strokeWidth="1.5" opacity="0.7" />
      ))}
      <circle cx="100" cy="100" r="28" fill={STEEL.deep} />
      <path d="M48 66 A62 62 0 0 1 98 38" stroke={STEEL.hi} strokeWidth="5" fill="none" strokeLinecap="round" />
    </g>
  );
}

function Plate() {
  const sheet = (dy: number, fill: string, key: number) => (
    <g key={key} transform={`translate(0 ${dy})`}>
      <path d="M20 96 L112 62 L182 84 L90 118 Z" fill={fill} />
      <path d="M20 96 L90 118 L90 125 L20 103 Z" fill={STEEL.low} />
      <path d="M90 118 L182 84 L182 91 L90 125 Z" fill={STEEL.deep} opacity="0.6" />
    </g>
  );
  return (
    <g>
      <ellipse cx="100" cy="170" rx="80" ry="6" fill="#000" opacity="0.12" />
      {[36, 18, 0, -18].map((dy, i) => sheet(dy, i === 3 ? STEEL.hi : STEEL.mid, i))}
    </g>
  );
}

export function ProductArt({ kind, className, title }: { kind: ArtKind; className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      className={cn("size-full", className)}
    >
      {kind === "tyre" || kind === "tyre-at" || kind === "tyre-truck" ? <Tyre variant={kind} /> : null}
      {kind === "rebar" && <Rebar />}
      {kind === "ibeam" && <IBeam />}
      {kind === "pipe" && <Pipes />}
      {kind === "box" && <Pipes square />}
      {kind === "roofing" && <Roofing />}
      {kind === "coil" && <Coil />}
      {kind === "plate" && <Plate />}
    </svg>
  );
}
