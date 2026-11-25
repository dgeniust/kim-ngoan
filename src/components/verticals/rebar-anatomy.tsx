import { kgPerM } from "@/constants/vertical-extras";

const fmt = (n: number) => n.toLocaleString("vi-VN", { maximumFractionDigits: 3, minimumFractionDigits: 3 });

const POINTS = [
  { n: 1, x: 190, label: "Ký hiệu nhà máy", text: "Dập nổi lặp lại dọc thân cây thép. Thép không có ký hiệu, ký hiệu mờ hoặc lạ cần hỏi rõ nguồn gốc." },
  { n: 2, x: 330, label: "Đường kính", text: "Số dập nổi trùng với đường kính đặt mua (VD 16 = Ø16)." },
  { n: 3, x: 470, label: "Mác thép", text: "Ký hiệu mác (CB300 / CB400…) phải khớp hoá đơn và CO/CQ của lô." },
  { n: 4, x: 610, label: "Gân vằn", text: "Gân đều, sắc nét; bề mặt không nứt, không gỉ thành vảy." },
];

/**
 * "Spot genuine steel" – technical drawing of a ribbed rebar with 4 callouts, next to the
 * weight table for a spot check on delivery. Illustrative: real mill markings differ per mill.
 */
export function RebarAnatomy() {
  const ribs = Array.from({ length: 30 }, (_, i) => 52 + i * 22);
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 [&>*]:min-w-0">
      <figure className="flex flex-col justify-center rounded-2xl bg-v-raise p-4 sm:p-6 lg:col-span-8">
        <div className="overflow-x-auto">
        <svg viewBox="0 0 760 330" className="w-full min-w-[560px]" role="img" aria-label="Bản vẽ đoạn thép thanh vằn với 4 điểm kiểm tra: ký hiệu nhà máy, đường kính, mác thép, gân vằn">
          {/* length dimension */}
          <g stroke="#8b8b92" strokeWidth="1" fill="none">
            <path d="M40 92 V108 M720 92 V108 M40 100 H720" />
            <path d="M40 100 l10 -4 v8 Z M720 100 l-10 -4 v8 Z" fill="#8b8b92" />
          </g>
          <text x="380" y="92" textAnchor="middle" fontSize="13" fill="#66666d" fontWeight="600">L = 11,7 m / cây</text>
          {/* bar body */}
          <rect x="40" y="130" width="680" height="56" rx="8" fill="#f4f4f5" stroke="#111" strokeWidth="2" />
          <path d="M40 140 H720 M40 176 H720" stroke="#111" strokeWidth="1.2" opacity="0.5" />
          {ribs.map((x) => (
            <path key={x} d={`M${x} 131 q 9 27 0 54`} stroke="#111" strokeWidth="1.6" fill="none" opacity="0.55" />
          ))}
          {/* rolled-in markings (illustrative) */}
          <g fontWeight="800" fontSize="15" fill="#111" textAnchor="middle">
            <rect x="172" y="148" width="36" height="20" rx="3" fill="#fff" stroke="#111" />
            <text x="190" y="163">◆◆</text>
            <rect x="314" y="148" width="32" height="20" rx="3" fill="#fff" stroke="#111" />
            <text x="330" y="163">16</text>
            <rect x="440" y="148" width="60" height="20" rx="3" fill="#fff" stroke="#111" />
            <text x="470" y="163">CB400</text>
          </g>
          {/* diameter dimension */}
          <g stroke="#8b8b92" strokeWidth="1">
            <path d="M730 130 H752 M730 186 H752 M744 130 V186" />
            <path d="M744 130 l-4 9 h8 Z M744 186 l-4 -9 h8 Z" fill="#8b8b92" />
          </g>
          <text x="752" y="210" textAnchor="end" fontSize="13" fill="#66666d" fontWeight="600">Ø16</text>
          {/* callouts */}
          {POINTS.map((p) => (
            <g key={p.n}>
              <path d={`M${p.x} 188 V250`} stroke="#111" strokeWidth="1.2" strokeDasharray="3 3" />
              <circle cx={p.x} cy={266} r={16} fill="#111" />
              <text x={p.x} y={271} textAnchor="middle" fontSize="14" fontWeight="700" fill="#fff">{p.n}</text>
              <text x={p.x} y={304} textAnchor="middle" fontSize="13" fontWeight="600" fill="#111">{p.label}</text>
            </g>
          ))}
        </svg>
        </div>
        <figcaption className="mt-2 text-caption text-v-mute">Bản vẽ minh hoạ. Ký hiệu dập nổi thật khác nhau theo từng nhà máy — đối chiếu với catalogue của hãng.</figcaption>
      </figure>

      <div className="flex flex-col gap-4 lg:col-span-4">
        <ol className="rounded-2xl bg-v-raise p-6">
          {POINTS.map((p) => (
            <li key={p.n} className="grid grid-cols-[1.75rem_1fr] gap-2 border-t border-v-line py-3 first:border-0 first:pt-0 last:pb-0">
              <span className="grid size-6 place-items-center rounded-full bg-v-fg text-micro font-bold text-v-bg">{p.n}</span>
              <span>
                <span className="block text-body font-semibold text-v-fg">{p.label}</span>
                <span className="mt-0.5 block text-small leading-relaxed text-v-mute">{p.text}</span>
              </span>
            </li>
          ))}
        </ol>
        <div className="rounded-2xl bg-v-raise p-6">
          <p className="text-body font-semibold text-v-fg">Cân thử theo barem</p>
          <p className="mt-1 text-small text-v-mute">Cân vài cây ngẫu nhiên, so với khối lượng lý thuyết:</p>
          <table className="mt-3 w-full text-small">
            <tbody>
              {[10, 12, 16, 20].map((d) => (
                <tr key={d} className="border-t border-v-line [&>td]:py-1.5">
                  <td className="font-semibold tabular-nums text-v-fg">Ø{d}</td>
                  <td className="text-right tabular-nums text-v-mute">{fmt(kgPerM(d))} kg/m</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-caption leading-relaxed text-v-mute">Chênh vài phần trăm là bình thường; nhẹ hơn nhiều là dấu hiệu thép thiếu chuẩn — báo ngay cho người bán.</p>
        </div>
      </div>
    </div>
  );
}
