// Chạy trong trang (Chrome). Trả về cây node mô tả bố cục để plugin Figma dựng lại.
// window.__knSerialize({ imgScale }) → Promise<{ width, height, root }>
(() => {
  const cv = document.createElement("canvas");
  cv.width = cv.height = 1;
  const cx = cv.getContext("2d", { willReadFrequently: true });
  const cache = new Map();
  // Mọi chuỗi màu CSS (oklch, oklab, color-mix…) → {r,g,b,a} 0..1 qua canvas
  function color(str) {
    if (!str || str === "transparent" || str === "none") return null;
    if (cache.has(str)) return cache.get(str);
    cx.clearRect(0, 0, 1, 1);
    cx.fillStyle = "#000";
    cx.fillStyle = str;
    cx.fillRect(0, 0, 1, 1);
    const d = cx.getImageData(0, 0, 1, 1).data;
    const c = d[3] === 0 ? null : { r: d[0] / 255, g: d[1] / 255, b: d[2] / 255, a: +(d[3] / 255).toFixed(3) };
    cache.set(str, c);
    return c;
  }
  const px = (v) => parseFloat(v) || 0;
  const r1 = (n) => Math.round(n * 10) / 10;

  // tách theo dấu phẩy cấp ngoài cùng
  function splitTop(s, sep = ",") {
    const out = [];
    let depth = 0, cur = "";
    for (const ch of s) {
      if (ch === "(") depth++;
      if (ch === ")") depth--;
      if (ch === sep && depth === 0) { out.push(cur.trim()); cur = ""; } else cur += ch;
    }
    if (cur.trim()) out.push(cur.trim());
    return out;
  }
  function splitSpace(s) {
    return splitTop(s, " ").filter(Boolean);
  }

  function parseGradient(str, w, h) {
    const m = /^(repeating-)?(linear|radial)-gradient\((.*)\)$/s.exec(str.trim());
    if (!m || m[1]) return null;
    const parts = splitTop(m[3]);
    let angle = 180, kind = m[2];
    if (kind === "linear") {
      const first = parts[0].replace(/\s+in\s+[a-z-]+(\s+[a-z]+ hue)?/, "").trim();
      const dirs = { "to top": 0, "to right": 90, "to bottom": 180, "to left": 270, "to top right": 45, "to right top": 45, "to bottom right": 135, "to right bottom": 135, "to bottom left": 225, "to left bottom": 225, "to top left": 315, "to left top": 315 };
      if (/deg$/.test(first)) { angle = parseFloat(first); parts.shift(); }
      else if (/turn$/.test(first)) { angle = parseFloat(first) * 360; parts.shift(); }
      else if (first in dirs) { angle = dirs[first]; parts.shift(); }
      else if (/^in\s/.test(parts[0])) parts.shift();
    } else {
      if (!/(oklab|oklch|rgb|#|hsl|color|transparent)/.test(parts[0].split(" ")[0])) parts.shift();
    }
    const stops = [];
    parts.forEach((p, i) => {
      const toks = splitSpace(p);
      const c = color(toks[0]);
      let pos = toks[1] ? (toks[1].endsWith("%") ? parseFloat(toks[1]) / 100 : null) : null;
      stops.push({ c: c || { r: 0, g: 0, b: 0, a: 0 }, pos });
    });
    if (stops.length < 2) return null;
    stops.forEach((s, i) => { if (s.pos == null) s.pos = i === 0 ? 0 : i === stops.length - 1 ? 1 : null; });
    // nội suy vị trí thiếu
    for (let i = 1; i < stops.length - 1; i++) if (stops[i].pos == null) {
      let j = i; while (stops[j].pos == null) j++;
      const a = stops[i - 1].pos, b = stops[j].pos;
      for (let k = i; k < j; k++) stops[k].pos = a + ((b - a) * (k - i + 1)) / (j - i + 1);
    }
    return { kind, angle, stops: stops.map((s) => ({ color: s.c, position: Math.min(1, Math.max(0, s.pos)) })) };
  }

  function parseShadows(str) {
    if (!str || str === "none") return [];
    return splitTop(str).map((s) => {
      const inset = /\binset\b/.test(s);
      s = s.replace(/\binset\b/, "").trim();
      const toks = splitSpace(s);
      let c = null; const nums = [];
      for (const t of toks) { if (/^-?[\d.]+(px)?$/.test(t)) nums.push(parseFloat(t)); else c = color(t); }
      const [x = 0, y = 0, blur = 0, spread = 0] = nums;
      return { inset, x, y, blur, spread, color: c };
    }).filter((s) => s.color);
  }

  function radii(cs, w, h) {
    const one = (v) => {
      const a = v.split(" ")[0];
      const n = a.endsWith("%") ? (parseFloat(a) / 100) * Math.min(w, h) : px(a);
      return r1(Math.min(n, Math.min(w, h) / 2));
    };
    return [one(cs.borderTopLeftRadius), one(cs.borderTopRightRadius), one(cs.borderBottomRightRadius), one(cs.borderBottomLeftRadius)];
  }

  const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEMPLATE", "HEAD", "META", "LINK", "BR", "WBR"]);
  const isSrOnly = (el, cs) => (cs.position === "absolute" || cs.position === "fixed") && (/inset\(50%/.test(cs.clipPath) || cs.clip === "rect(0px, 0px, 0px, 0px)" || el.offsetWidth <= 1 || el.offsetHeight <= 1);

  function fontOf(cs) {
    const fam = cs.fontFamily.split(",")[0].replace(/["']/g, "").trim();
    return { family: fam, weight: parseInt(cs.fontWeight) || 400, italic: cs.fontStyle === "italic" };
  }
  function transformText(t, cs) {
    if (cs.textTransform === "uppercase") return t.toLocaleUpperCase("vi");
    if (cs.textTransform === "lowercase") return t.toLocaleLowerCase("vi");
    if (cs.textTransform === "capitalize") return t.replace(/(^|\s)(\p{L})/gu, (m, a, b) => a + b.toLocaleUpperCase("vi"));
    return t;
  }
  function textStyle(cs) {
    const fs = px(cs.fontSize);
    const lh = cs.lineHeight === "normal" ? r1(fs * 1.2) : r1(px(cs.lineHeight));
    const deco = cs.textDecorationLine.includes("underline") ? "UNDERLINE" : cs.textDecorationLine.includes("line-through") ? "STRIKETHROUGH" : "NONE";
    return {
      font: fontOf(cs), size: r1(fs), lineHeight: lh,
      letterSpacing: cs.letterSpacing === "normal" ? 0 : r1(px(cs.letterSpacing)),
      color: color(cs.color) || { r: 0, g: 0, b: 0, a: 1 }, deco,
    };
  }
  const collapse = (cs) => !/^(pre|pre-wrap|break-spaces)$/.test(cs.whiteSpace);

  // Khối chỉ chứa chữ và thẻ inline "trơn" (không nền, không viền, không ảnh/svg)
  function plainInline(el) {
    for (const n of el.childNodes) {
      if (n.nodeType === 3) continue;
      if (n.nodeType !== 1) continue;
      if (n.tagName === "BR") continue;
      const cs = getComputedStyle(n);
      if (cs.display === "none") continue;
      if (isSrOnly(n, cs)) continue;
      if (cs.display !== "inline") return false;
      if (color(cs.backgroundColor) || cs.backgroundImage !== "none" || px(cs.borderTopWidth) || px(cs.borderBottomWidth) || cs.boxShadow !== "none") return false;
      if (n.querySelector("svg,img,input,button,select,textarea,iframe,canvas,video")) return false;
      if (n.tagName === "SVG" || n.tagName === "svg" || n.tagName === "IMG") return false;
      if (!plainInline(n)) return false;
    }
    return true;
  }
  function segmentsOf(el) {
    const segs = [];
    const walk = (node) => {
      for (const n of node.childNodes) {
        if (n.nodeType === 3) {
          const cs = getComputedStyle(n.parentElement);
          let t = n.nodeValue;
          if (collapse(cs)) t = t.replace(/\s+/g, " ");
          if (t) segs.push({ text: transformText(t, cs), ...textStyle(cs), href: n.parentElement.closest("a")?.getAttribute("href") || null });
        } else if (n.nodeType === 1) {
          if (n.tagName === "BR") { segs.push({ text: "\n", ...textStyle(getComputedStyle(node)) }); continue; }
          const cs = getComputedStyle(n);
          if (cs.display === "none" || isSrOnly(n, cs)) continue;
          walk(n);
        }
      }
    };
    walk(el);
    // gộp & cắt khoảng trắng đầu/cuối, khoảng trắng đôi giữa các đoạn
    let s = "";
    for (const g of segs) {
      if (g.text !== "\n" && s.endsWith(" ") && g.text.startsWith(" ")) g.text = g.text.slice(1);
      if ((s === "" || s.endsWith("\n")) && g.text !== "\n") g.text = g.text.replace(/^ +/, "");
      s += g.text;
    }
    for (let i = segs.length - 1; i >= 0; i--) { segs[i].text = segs[i].text.replace(/ +$/, ""); if (segs[i].text) break; }
    return segs.filter((g) => g.text);
  }

  function rangeBox(nodeOrEl) {
    const r = document.createRange();
    r.selectNodeContents(nodeOrEl);
    const rects = [...r.getClientRects()].filter((q) => q.width > 0 && q.height > 0);
    if (!rects.length) return null;
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const q of rects) { x0 = Math.min(x0, q.left); y0 = Math.min(y0, q.top); x1 = Math.max(x1, q.right); y1 = Math.max(y1, q.bottom); }
    const lines = new Set(rects.map((q) => Math.round(q.top / 4))).size;
    const fh = Math.max(...rects.filter((q) => Math.abs(q.top - y0) < 4).map((q) => q.height));
    return { x: x0 + scrollX, y: y0 + scrollY + OFF, w: x1 - x0, h: y1 - y0, lines, fh };
  }

  function textNodeFor(el, segs, cs) {
    const b = rangeBox(el);
    if (!b) return null;
    const align = { center: "CENTER", right: "RIGHT", end: "RIGHT", justify: "JUSTIFIED" }[cs.textAlign] || "LEFT";
    const multi = b.lines > 1 || segs.some((s) => s.text.includes("\n"));
    let x = b.x, w = b.w;
    if (multi || align !== "LEFT") {
      // dùng hộp nội dung của khối để giữ chỗ xuống dòng / canh giữa
      const er = el.getBoundingClientRect();
      const cl = er.left + scrollX + px(cs.paddingLeft) + px(cs.borderLeftWidth);
      const cw = er.width - px(cs.paddingLeft) - px(cs.paddingRight) - px(cs.borderLeftWidth) - px(cs.borderRightWidth);
      if (cs.display.includes("inline") && !multi) { /* giữ hộp chữ */ } else { x = cl; w = cw; }
    }
    const lh0 = Math.max(...segs.map((s) => s.lineHeight));
    return {
      type: "TEXT", name: segs.map((s) => s.text).join("").slice(0, 40),
      x: r1(x), y: r1(b.y + (b.fh - lh0) / 2), w: r1(w + (multi ? 0 : 1)), h: r1(b.h), multi, align,
      segs: segs.map(({ href, ...s }) => s),
    };
  }
  function looseTextNode(tn, pcs) {
    let t = tn.nodeValue;
    if (collapse(pcs)) t = t.replace(/\s+/g, " ").trim();
    if (!t) return null;
    const b = rangeBox(tn);
    if (!b) return null;
    return {
      type: "TEXT", name: t.slice(0, 40), x: r1(b.x), y: r1(b.y + (b.fh - textStyle(pcs).lineHeight) / 2), w: r1(b.w + 1), h: r1(b.h),
      multi: b.lines > 1, align: "LEFT", segs: [{ text: transformText(t, pcs), ...textStyle(pcs) }],
    };
  }

  // SVG nội tuyến: chép màu đã tính vào thuộc tính để Figma đọc được
  const SVG_PROPS = ["fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin", "stroke-dasharray", "stroke-dashoffset", "opacity", "fill-opacity", "stroke-opacity", "fill-rule", "font-size", "font-weight", "font-family", "text-anchor", "dominant-baseline"];
  function svgNode(el, box) {
    const clone = el.cloneNode(true);
    const src = [el, ...el.querySelectorAll("*")];
    const dst = [clone, ...clone.querySelectorAll("*")];
    src.forEach((s, i) => {
      const d = dst[i];
      const cs = getComputedStyle(s);
      if (cs.display === "none") { d.remove(); return; }
      for (const p of SVG_PROPS) {
        let v = cs.getPropertyValue(p);
        if (!v) continue;
        if (p === "fill" || p === "stroke") {
          if (v === "none") { d.setAttribute(p, "none"); continue; }
          if (v.startsWith("url(")) continue;
          const c = color(v);
          if (!c) { d.setAttribute(p, "none"); continue; }
          d.setAttribute(p, `rgb(${Math.round(c.r * 255)},${Math.round(c.g * 255)},${Math.round(c.b * 255)})`);
          if (c.a < 1) d.setAttribute(p + "-opacity", String(c.a * (parseFloat(cs.getPropertyValue(p + "-opacity")) || 1)));
          continue;
        }
        if (p === "font-family") v = v.split(",")[0].replace(/["']/g, "");
        if (p === "stroke-dasharray" && v === "none") continue;
        if (p === "stroke-dashoffset" && px(v) === 0) continue;
        if (p === "opacity" && v === "1") continue;
        d.setAttribute(p, v);
      }
      if (s.tagName.toLowerCase() === "text" || s.tagName.toLowerCase() === "tspan") {
        // giữ chữ SVG
      }
      d.removeAttribute("class");
      d.removeAttribute("style");
      d.removeAttribute("pathLength") ;
      if (s.getAttribute("pathLength")) {
        // nét đã vẽ xong → bỏ dasharray tương đối theo pathLength
        d.removeAttribute("stroke-dasharray");
        d.removeAttribute("stroke-dashoffset");
      }
    });
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    clone.setAttribute("width", r1(box.w));
    clone.setAttribute("height", r1(box.h));
    if (!clone.getAttribute("viewBox")) clone.setAttribute("viewBox", `0 0 ${box.w} ${box.h}`);
    clone.removeAttribute("role");
    clone.removeAttribute("aria-hidden");
    clone.removeAttribute("aria-label");
    clone.style.cssText = "";
    const label = el.getAttribute("aria-label") || [...el.classList].find((c) => c.startsWith("lucide-") && c !== "lucide") || "svg";
    return { type: "SVG", name: label.replace("lucide-", "icon/"), x: r1(box.x), y: r1(box.y), w: r1(box.w), h: r1(box.h), svg: new XMLSerializer().serializeToString(clone) };
  }

  const imgJobs = [];
  function imageNode(el, box, cs, scale) {
    const node = { type: "IMAGE", name: el.getAttribute("alt") || "Ảnh", x: r1(box.x), y: r1(box.y), w: r1(box.w), h: r1(box.h), data: null };
    imgJobs.push((async () => {
      try {
        if (!el.complete) await new Promise((r) => { el.onload = el.onerror = r; setTimeout(r, 5000); });
        const nw = el.naturalWidth, nh = el.naturalHeight;
        if (!nw || !nh) return;
        const s = Math.min(scale, 2400 / box.w, 2400 / box.h);
        const W = Math.max(1, Math.round(box.w * s)), H = Math.max(1, Math.round(box.h * s));
        const c = document.createElement("canvas"); c.width = W; c.height = H;
        const g = c.getContext("2d");
        const fit = cs.objectFit;
        let dw = W, dh = H;
        if (fit === "cover" || fit === "contain") {
          const k = fit === "cover" ? Math.max(W / nw, H / nh) : Math.min(W / nw, H / nh);
          dw = nw * k; dh = nh * k;
        }
        const [ox = "50%", oy = "50%"] = cs.objectPosition.split(" ");
        const pos = (v, free) => (v.endsWith("%") ? (parseFloat(v) / 100) * free : px(v) * s);
        g.drawImage(el, pos(ox, W - dw), pos(oy, H - dh), dw, dh);
        const png = /\.(png|svg|gif)(\b|&|%|$)/i.test(el.currentSrc || el.src);
        node.data = c.toDataURL(png ? "image/png" : "image/jpeg", 0.86).split(",")[1];
      } catch (e) { node.error = String(e); }
    })());
    return node;
  }
  function bgImageNode(url, box, cs, scale) {
    const n = { type: "IMAGE", name: "Ảnh nền", x: r1(box.x), y: r1(box.y), w: r1(box.w), h: r1(box.h), data: null };
    const im = new Image();
    im.src = url;
    const size = cs.backgroundSize === "contain" ? "contain" : "cover";
    imgJobs.push((async () => {
      try {
        await new Promise((r) => { if (im.complete) r(); else { im.onload = im.onerror = r; setTimeout(r, 5000); } });
        const nw = im.naturalWidth, nh = im.naturalHeight; if (!nw) return;
        const s = Math.min(scale, 2400 / box.w, 2400 / box.h);
        const W = Math.max(1, Math.round(box.w * s)), H = Math.max(1, Math.round(box.h * s));
        const c = document.createElement("canvas"); c.width = W; c.height = H;
        const k = size === "cover" ? Math.max(W / nw, H / nh) : Math.min(W / nw, H / nh);
        c.getContext("2d").drawImage(im, (W - nw * k) / 2, (H - nh * k) / 2, nw * k, nh * k);
        n.data = c.toDataURL(/\.png/i.test(url) ? "image/png" : "image/jpeg", 0.86).split(",")[1];
      } catch (e) { n.error = String(e); }
    })());
    return n;
  }

  function nameOf(el) {
    const tag = el.tagName.toLowerCase();
    const aria = el.getAttribute("aria-label");
    if (aria) return aria;
    const lb = el.getAttribute("aria-labelledby");
    if (lb) { const t = document.getElementById(lb.split(" ")[0]); if (t) return tag + " · " + t.textContent.trim().slice(0, 50); }
    if (el.id) return tag + " #" + el.id;
    if (["section", "header", "footer", "nav", "main", "aside", "article", "form"].includes(tag)) {
      const h = el.querySelector("h1,h2,h3");
      if (h) return tag + " · " + h.textContent.trim().slice(0, 50);
      return tag;
    }
    if (["a", "button"].includes(tag)) return tag + " · " + el.textContent.trim().slice(0, 30);
    if (/^h[1-6]$/.test(tag) || tag === "p" || tag === "li") return tag;
    return tag;
  }

  let OFF = 0; // dịch dọc cho phần tử fixed (đưa thanh dưới đáy xuống cuối trang)
  function walk(el, scale) {
    const cs = getComputedStyle(el);
    if (cs.position === "fixed") {
      const rr = el.getBoundingClientRect();
      if (rr.bottom >= innerHeight - 2 && rr.top > innerHeight / 2) {
        const prev = OFF;
        OFF = document.documentElement.scrollHeight - innerHeight - scrollY;
        try { return walk2(el, cs, scale); } finally { OFF = prev; }
      }
      if (rr.top < 4 && rr.height > innerHeight * 0.8) return null; // lớp phủ toàn màn hình
    }
    const res = walk2(el, cs, scale);
    if (res && res._z === undefined && cs.position !== "static") {
      const z = parseInt(cs.zIndex);
      res._z = isNaN(z) ? 0.5 : z < 0 ? z : z + 0.5;
    }
    return res;
  }
  function walk2(el, cs, scale) {
    if (cs.display === "none" || cs.visibility === "hidden" || cs.contentVisibility === "hidden") return null;
    if (parseFloat(cs.opacity) === 0) return null;
    if (isSrOnly(el, cs)) return null;
    if (el.classList.contains("splash")) return null;
    const rect = el.getBoundingClientRect();
    const box = { x: rect.left + scrollX, y: rect.top + scrollY + OFF, w: rect.width, h: rect.height };
    const tag = el.tagName;
    if (tag === "svg" || tag === "SVG") {
      if (box.w < 1 || box.h < 1) return null;
      return svgNode(el, box);
    }
    if (tag === "IMG") {
      if (box.w < 2 || box.h < 2) return null;
      return imageNode(el, box, cs, scale);
    }
    const node = {
      type: "FRAME", name: nameOf(el), x: r1(box.x), y: r1(box.y), w: r1(box.w), h: r1(box.h),
      fills: [], strokes: null, effects: [], radius: radii(cs, box.w, box.h),
      opacity: parseFloat(cs.opacity) < 1 ? +parseFloat(cs.opacity).toFixed(3) : 1,
      clip: (cs.overflowX !== "visible" || cs.overflowY !== "visible") && tag !== "BODY" && tag !== "HTML",
      children: [],
    };
    const bg = color(cs.backgroundColor);
    if (bg) node.fills.push({ type: "SOLID", color: bg });
    if (cs.backgroundImage !== "none") {
      for (const layer of splitTop(cs.backgroundImage).reverse()) {
        const um = /^url\(["']?(.*?)["']?\)$/.exec(layer);
        if (um) { node.bgImage = bgImageNode(um[1], box, cs, scale); continue; }
        const g = parseGradient(layer, box.w, box.h);
        if (g) node.fills.push({ type: "GRADIENT", ...g });
      }
    }
    // viền
    const bw = [cs.borderTopWidth, cs.borderRightWidth, cs.borderBottomWidth, cs.borderLeftWidth].map(px);
    const bcols = [cs.borderTopColor, cs.borderRightColor, cs.borderBottomColor, cs.borderLeftColor];
    const bst = [cs.borderTopStyle, cs.borderRightStyle, cs.borderBottomStyle, cs.borderLeftStyle];
    const side = bw.findIndex((w, i) => w > 0 && bst[i] !== "none" && color(bcols[i]));
    if (side >= 0) node.strokes = { color: color(bcols[side]), weights: bw.map((w, i) => (bst[i] === "none" ? 0 : w)), dashed: bst[side] === "dashed" || bst[side] === "dotted", align: "INSIDE" };
    // bóng & ring
    for (const s of parseShadows(cs.boxShadow)) {
      if (s.blur === 0 && s.x === 0 && s.y === 0 && s.spread > 0) {
        if (!node.strokes) node.strokes = { color: s.color, weights: [s.spread, s.spread, s.spread, s.spread], dashed: false, align: s.inset ? "INSIDE" : "OUTSIDE" };
        continue;
      }
      if (s.blur === 0 && s.spread === 0 && s.x === 0 && s.y === 0) continue;
      node.effects.push({ type: s.inset ? "INNER_SHADOW" : "DROP_SHADOW", color: s.color, offset: { x: s.x, y: s.y }, radius: s.blur, spread: s.spread });
    }
    const bf = /blur\(([\d.]+)px\)/.exec(cs.backdropFilter || "");
    if (bf) node.effects.push({ type: "BACKGROUND_BLUR", radius: parseFloat(bf[1]) });
    if (node.bgImage) { node.children.push(node.bgImage); delete node.bgImage; }

    if (tag === "IFRAME") {
      node.fills = [{ type: "SOLID", color: { r: 0.9, g: 0.92, b: 0.89, a: 1 } }];
      node.name = "Bản đồ nhúng (Google Maps)";
      node.children.push({ type: "TEXT", name: "map", x: r1(box.x + 16), y: r1(box.y + box.h / 2 - 10), w: r1(box.w - 32), h: 20, multi: false, align: "CENTER", segs: [{ text: "Bản đồ Google Maps (nhúng)", font: { family: "Be Vietnam Pro", weight: 500, italic: false }, size: 14, lineHeight: 20, letterSpacing: 0, color: { r: 0.35, g: 0.4, b: 0.35, a: 1 }, deco: "NONE" }] });
      return node;
    }
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") {
      let t = el.value, pcs = cs;
      if (tag === "SELECT") t = el.options[el.selectedIndex]?.text || "";
      if (!t && el.placeholder) { t = el.placeholder; pcs = getComputedStyle(el, "::placeholder"); }
      if (t && el.type !== "checkbox" && el.type !== "radio" && el.type !== "hidden") {
        const st = textStyle(cs);
        st.color = color(pcs.color) || st.color;
        const pl = px(cs.paddingLeft) + px(cs.borderLeftWidth);
        const lh = st.lineHeight;
        node.children.push({ type: "TEXT", name: t.slice(0, 40), x: r1(box.x + pl), y: r1(tag === "TEXTAREA" ? box.y + px(cs.paddingTop) : box.y + (box.h - lh) / 2), w: r1(box.w - pl - px(cs.paddingRight)), h: lh, multi: tag === "TEXTAREA", align: "LEFT", segs: [{ text: t, ...st }] });
      }
      return node;
    }

    if (plainInline(el) && el.textContent.trim()) {
      const segs = segmentsOf(el);
      const t = segs.length ? textNodeFor(el, segs, cs) : null;
      if (t) node.children.push(t);
    } else {
      for (const ch of el.childNodes) {
        if (ch.nodeType === 3) {
          if (!ch.nodeValue.trim()) continue;
          const t = looseTextNode(ch, cs);
          if (t) node.children.push(t);
        } else if (ch.nodeType === 1 && !SKIP_TAGS.has(ch.tagName)) {
          const c = walk(ch, scale);
          if (c) node.children.push(c);
        }
      }
      // z-index: phần tử định vị có z cao vẽ sau
      node.children = node.children
        .map((c, i) => ({ c, i, z: c._z ?? 0 }))
        .sort((a, b) => a.z - b.z || a.i - b.i)
        .map((o) => o.c);
    }
    // thứ tự vẽ: phần tử định vị (absolute/relative/sticky…) vẽ trên phần tử thường cùng cấp
    const z = parseInt(cs.zIndex);
    if (cs.position !== "static") node._z = isNaN(z) ? 0.5 : z < 0 ? z : z + 0.5;

    // gộp khung "rỗng" (không nền, không viền, không bo cắt) → đưa con lên trên
    const visual = node.fills.length || node.strokes || node.effects.length || node.opacity < 1 || node.clip;
    if (!visual) {
      if (node.children.length === 0) return null;
      if (node.children.length === 1 && !["SECTION", "HEADER", "FOOTER", "NAV", "MAIN", "ARTICLE", "UL", "OL", "FORM", "A", "BUTTON", "LI"].includes(tag)) {
        const only = node.children[0];
        if (node._z && !only._z) only._z = node._z;
        return only;
      }
    }
    return node;
  }

  window.__knSerialize = async ({ imgScale = 2 } = {}) => {
    imgJobs.length = 0;
    const root = walk(document.body, imgScale);
    await Promise.all(imgJobs);
    const W = document.documentElement.clientWidth, H = document.documentElement.scrollHeight;
    root.type = "FRAME";
    root.x = 0; root.y = 0; root.w = W; root.h = H;
    const bodyBg = color(getComputedStyle(document.body).backgroundColor) || color(getComputedStyle(document.documentElement).backgroundColor) || { r: 1, g: 1, b: 1, a: 1 };
    root.fills = [{ type: "SOLID", color: bodyBg }];
    root.clip = true;
    const strip = (n) => { delete n._z; (n.children || []).forEach(strip); };
    strip(root);
    let count = 0, imgs = 0, fails = 0;
    const cnt = (n) => { count++; if (n.type === "IMAGE") { imgs++; if (!n.data) fails++; } (n.children || []).forEach(cnt); };
    cnt(root);
    return { width: W, height: H, root, stats: { nodes: count, images: imgs, imageFails: fails } };
  };
})();
