// Kim Ngoan → Figma: dựng lại trang web từ file JSON xuất từ code (nhánh fe/notion-style-v1.1).
// Không cần mạng. Chạy trong Figma Desktop: Plugins → Development → Import plugin from manifest…

figma.showUI(__html__, { width: 380, height: 420, themeColors: true });

const STYLE_BY_WEIGHT = { 100: "Thin", 200: "ExtraLight", 300: "Light", 400: "Regular", 500: "Medium", 600: "SemiBold", 700: "Bold", 800: "ExtraBold", 900: "Black" };
const FALLBACK_FAMILY = "Inter";
const fontOk = new Map(); // "Family|Style" → FontName đã nạp được

function styleName(w, italic) {
  const base = STYLE_BY_WEIGHT[Math.round((w || 400) / 100) * 100] || "Regular";
  if (!italic) return base;
  return base === "Regular" ? "Italic" : base + " Italic";
}

async function tryLoad(family, style) {
  const key = family + "|" + style;
  if (fontOk.has(key)) return fontOk.get(key);
  let res = null;
  try {
    await figma.loadFontAsync({ family, style });
    res = { family, style };
  } catch {
    res = null;
  }
  fontOk.set(key, res);
  return res;
}

// Tìm font gần nhất: đúng họ → đúng họ, bỏ nghiêng → đúng họ, độ đậm gần → Inter
async function resolveFont(f) {
  const fam = f.family || FALLBACK_FAMILY;
  const want = Math.round((f.weight || 400) / 100) * 100;
  const order = [want, want + 100, want - 100, 600, 500, 400, 700].filter((w) => w >= 100 && w <= 900);
  for (const family of [fam, FALLBACK_FAMILY]) {
    for (const w of order) {
      const r = (f.italic && (await tryLoad(family, styleName(w, true)))) || (await tryLoad(family, styleName(w, false)));
      if (r) return r;
    }
  }
  return { family: "Inter", style: "Regular" };
}

const rgb = (c) => ({ r: c.r, g: c.g, b: c.b });

function gradientTransform(angleDeg) {
  // CSS: 0deg = hướng lên, 90deg = sang phải. Figma: ma trận từ hộp đơn vị của layer → không gian gradient (x: 0→1).
  const a = ((angleDeg - 90) * Math.PI) / 180;
  const cos = Math.cos(a), sin = Math.sin(a);
  // gradient chạy từ (0,0.5) → (1,0.5) trong không gian gradient; xoay quanh tâm
  return [
    [cos, sin, 0.5 - 0.5 * cos - 0.5 * sin],
    [-sin, cos, 0.5 + 0.5 * sin - 0.5 * cos],
  ];
}

function toPaints(fills) {
  const out = [];
  for (const f of fills || []) {
    if (f.type === "SOLID") out.push({ type: "SOLID", color: rgb(f.color), opacity: f.color.a });
    else if (f.type === "GRADIENT") {
      const stops = f.stops.map((s) => ({ position: s.position, color: { r: s.color.r, g: s.color.g, b: s.color.b, a: s.color.a } }));
      if (f.kind === "radial") {
        out.push({ type: "GRADIENT_RADIAL", gradientStops: stops, gradientTransform: [[1, 0, 0], [0, 1, 0]] });
      } else {
        out.push({ type: "GRADIENT_LINEAR", gradientStops: stops, gradientTransform: gradientTransform(f.angle) });
      }
    }
  }
  return out;
}

function applyBox(node, d) {
  const paints = toPaints(d.fills);
  node.fills = paints;
  if (d.radius) {
    const [tl, tr, br, bl] = d.radius;
    if (tl === tr && tr === br && br === bl) node.cornerRadius = tl;
    else {
      node.topLeftRadius = tl;
      node.topRightRadius = tr;
      node.bottomRightRadius = br;
      node.bottomLeftRadius = bl;
    }
  }
  if (d.strokes) {
    const s = d.strokes;
    node.strokes = [{ type: "SOLID", color: rgb(s.color), opacity: s.color.a }];
    node.strokeAlign = s.align || "INSIDE";
    const [t, r, b, l] = s.weights;
    if (t === r && r === b && b === l) node.strokeWeight = t;
    else {
      node.strokeTopWeight = t;
      node.strokeRightWeight = r;
      node.strokeBottomWeight = b;
      node.strokeLeftWeight = l;
    }
    if (s.dashed) node.dashPattern = [4, 4];
  }
  if (d.effects && d.effects.length) {
    node.effects = d.effects.map((e) =>
      e.type === "BACKGROUND_BLUR"
        ? { type: "BACKGROUND_BLUR", radius: e.radius, visible: true }
        : { type: e.type, color: { r: e.color.r, g: e.color.g, b: e.color.b, a: e.color.a }, offset: e.offset, radius: e.radius, spread: e.spread || 0, visible: true, blendMode: "NORMAL" }
    );
  }
  if (d.opacity != null && d.opacity < 1) node.opacity = d.opacity;
}

let progress = { done: 0, total: 1 };
function tick() {
  progress.done++;
  if (progress.done % 60 === 0) figma.ui.postMessage({ type: "progress", done: progress.done, total: progress.total });
}

async function build(d, parent, ox, oy) {
  tick();
  let node;
  if (d.type === "TEXT") {
    node = figma.createText();
    const segs = d.segs;
    const fonts = [];
    for (const s of segs) fonts.push(await resolveFont(s.font));
    node.fontName = fonts[0];
    node.characters = segs.map((s) => s.text).join("");
    const first = segs[0];
    node.fontSize = Math.max(1, first.size);
    node.lineHeight = { value: first.lineHeight, unit: "PIXELS" };
    node.letterSpacing = { value: first.letterSpacing, unit: "PIXELS" };
    node.fills = [{ type: "SOLID", color: rgb(first.color), opacity: first.color.a }];
    let at = 0;
    segs.forEach((s, i) => {
      const end = at + s.text.length;
      if (end > at) {
        node.setRangeFontName(at, end, fonts[i]);
        node.setRangeFontSize(at, end, Math.max(1, s.size));
        node.setRangeLineHeight(at, end, { value: s.lineHeight, unit: "PIXELS" });
        node.setRangeLetterSpacing(at, end, { value: s.letterSpacing, unit: "PIXELS" });
        node.setRangeFills(at, end, [{ type: "SOLID", color: rgb(s.color), opacity: s.color.a }]);
        if (s.deco && s.deco !== "NONE") node.setRangeTextDecoration(at, end, s.deco);
      }
      at = end;
    });
    node.textAlignHorizontal = d.align || "LEFT";
    if (d.multi || d.align !== "LEFT") {
      node.textAutoResize = "HEIGHT";
      node.resize(Math.max(1, d.w), Math.max(1, d.h));
      node.textAutoResize = "HEIGHT";
    } else {
      node.textAutoResize = "WIDTH_AND_HEIGHT";
    }
    node.name = d.name || "Text";
  } else if (d.type === "SVG") {
    try {
      node = figma.createNodeFromSvg(d.svg);
      node.resize(Math.max(0.01, d.w), Math.max(0.01, d.h));
      node.fills = [];
      node.clipsContent = false;
    } catch {
      node = figma.createRectangle();
      node.resize(Math.max(0.01, d.w), Math.max(0.01, d.h));
      node.fills = [];
    }
    node.name = d.name || "svg";
  } else if (d.type === "IMAGE") {
    node = figma.createRectangle();
    node.resize(Math.max(0.01, d.w), Math.max(0.01, d.h));
    if (d.data) {
      try {
        const img = figma.createImage(figma.base64Decode(d.data));
        node.fills = [{ type: "IMAGE", imageHash: img.hash, scaleMode: "FILL" }];
      } catch {
        node.fills = [{ type: "SOLID", color: { r: 0.85, g: 0.88, b: 0.83 } }];
      }
    } else node.fills = [{ type: "SOLID", color: { r: 0.85, g: 0.88, b: 0.83 } }];
    node.name = "🖼 " + (d.name || "Ảnh");
  } else {
    node = figma.createFrame();
    node.resize(Math.max(0.01, d.w), Math.max(0.01, d.h));
    applyBox(node, d);
    node.clipsContent = !!d.clip;
    node.name = d.name || "frame";
  }
  parent.appendChild(node);
  node.x = Math.round((d.x - ox) * 10) / 10;
  node.y = Math.round((d.y - oy) * 10) / 10;
  if (d.type === "FRAME" && d.children) {
    for (const c of d.children) await build(c, node, d.x, d.y);
  }
  return node;
}

function count(d) {
  let n = 1;
  for (const c of d.children || []) n += count(c);
  return n;
}

async function getOrCreatePage(name) {
  let p = figma.root.children.find((x) => x.name === name);
  if (!p) {
    try {
      p = figma.createPage();
      p.name = name;
    } catch {
      // gói Starter giới hạn 3 trang/file → dựng vào trang hiện tại
      p = figma.currentPage;
    }
  }
  if (p.loadAsync) await p.loadAsync();
  return p;
}

figma.ui.onmessage = async (msg) => {
  if (msg.type !== "build") return;
  try {
    const docs = msg.docs; // [{name, page, width, height, root}]
    progress = { done: 0, total: docs.reduce((s, d) => s + count(d.root), 0) };
    // nạp trước font thường dùng
    await resolveFont({ family: "Be Vietnam Pro", weight: 400 });
    const usePages = msg.usePages !== false;
    const built = [];
    const pageX = new Map();
    // desktop trước, mobile sau, cùng trang Figma đặt cạnh nhau
    docs.sort((a, b) => (a.page || "").localeCompare(b.page || "") || b.width - a.width);
    for (const doc of docs) {
      const page = usePages ? await getOrCreatePage(doc.page || "Kim Ngoan") : figma.currentPage;
      let x = pageX.has(page.id) ? pageX.get(page.id) : Math.max(0, ...page.children.map((c) => c.x + c.width + 200), 0);
      const frame = figma.createFrame();
      frame.name = doc.name || "Trang";
      frame.resize(doc.width, doc.height);
      page.appendChild(frame);
      frame.x = x;
      frame.y = 0;
      applyBox(frame, doc.root);
      frame.clipsContent = true;
      for (const c of doc.root.children || []) await build(c, frame, 0, 0);
      pageX.set(page.id, x + doc.width + 200);
      built.push({ page, frame });
    }
    const missing = [...fontOk.entries()].filter(([k, v]) => !v && !k.startsWith(FALLBACK_FAMILY)).map(([k]) => k.replace("|", " "));
    if (built.length) {
      await figma.setCurrentPageAsync(built[0].page);
      figma.viewport.scrollAndZoomIntoView(built.filter((b) => b.page === built[0].page).map((b) => b.frame));
    }
    figma.ui.postMessage({ type: "done", frames: built.length, nodes: progress.done, missing: [...new Set(missing)] });
    figma.notify("Đã dựng " + built.length + " frame Kim Ngoan ✓");
  } catch (e) {
    figma.ui.postMessage({ type: "error", message: String((e && e.stack) || e) });
  }
};
