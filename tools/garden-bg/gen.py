"""
Dựng bộ ảnh nền “vườn xanh” cho landing tổng Kim Ngoan (render thủ tục, không dùng ảnh ngoài).

Đầu ra (public/garden/):
  light.webp           1920×1080  nền ánh sáng: nắng sớm góc phải, mảng xanh loang hai mép, bokeh, cỏ mờ dưới chân
  light-m.webp         1080×1920  bản dọc cho điện thoại (lá mờ ở góc, giữa sạch để đọc chữ)
  frame-{l,r}-{1,2,3}.webp  600×1300  khung lá trong suốt bám mép trái/phải; 3 biến thể để đổi nhẹ theo từng khối

Chạy:  python3 tools/garden-bg/gen.py public/garden
"""
import math
import os
import random
import sys

import numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter, zoom

OUT = sys.argv[1] if len(sys.argv) > 1 else "public/garden"
os.makedirs(OUT, exist_ok=True)
SS = 2  # siêu lấy mẫu cho mép lá mịn
BG = np.array([246, 249, 241], float)  # màu nền để “hoà khí quyển” cho lá xa


def hexc(h):
    h = h.lstrip("#")
    return np.array([int(h[i : i + 2], 16) for i in (0, 2, 4)], float)


# Bảng màu lá thật (tối gốc → sáng ngọn) – xanh lục tươi, hơi ngả vàng ở rìa
PALETTES = [
    (hexc("#2d5829"), hexc("#5c9442"), hexc("#a3c972")),
    (hexc("#30602f"), hexc("#669f4b"), hexc("#b0d381")),
    (hexc("#284f2b"), hexc("#538a40"), hexc("#97c069")),
    (hexc("#3a682d"), hexc("#70a54f"), hexc("#bdd98f")),
    (hexc("#25472a"), hexc("#4c7f3f"), hexc("#8eb766")),
]


# ---------------------------------------------------------------- canvas
class Canvas:
    """RGBA premultiplied, float 0..1, kích thước thật × SS."""

    def __init__(self, w, h, ss=SS):
        self.ss = ss
        self.w, self.h = w, h
        self.a = np.zeros((h * ss, w * ss, 4), np.float32)

    def comp(self, patch, x0, y0):
        """Đặt patch premultiplied (h,w,4) tại (x0,y0) theo toạ độ siêu mẫu, toán tử over."""
        H, W = self.a.shape[:2]
        ph, pw = patch.shape[:2]
        xa, ya = max(0, x0), max(0, y0)
        xb, yb = min(W, x0 + pw), min(H, y0 + ph)
        if xa >= xb or ya >= yb:
            return
        p = patch[ya - y0 : yb - y0, xa - x0 : xb - x0]
        d = self.a[ya:yb, xa:xb]
        d[:] = p + d * (1 - p[..., 3:4])

    def blurred(self, sigma):
        out = np.empty_like(self.a)
        for c in range(4):
            out[..., c] = gaussian_filter(self.a[..., c], sigma * self.ss)
        self.a = out
        return self

    def fade_to(self, color, amount, alpha=1.0):
        """Đẩy màu về phía nền (lá xa) và giảm độ đậm."""
        al = self.a[..., 3:4]
        rgb = self.a[..., :3]
        self.a[..., :3] = rgb * (1 - amount) + (color / 255.0) * al * amount
        self.a *= alpha
        return self

    def under(self, other):
        """Vẽ canvas này lên trên `other` (other là lớp dưới)."""
        other.a = self.a + other.a * (1 - self.a[..., 3:4])
        return other

    def image(self):
        a = self.a.reshape(self.h, self.ss, self.w, self.ss, 4).mean(axis=(1, 3))
        al = a[..., 3:4]
        rgb = np.where(al > 1e-4, a[..., :3] / np.maximum(al, 1e-4), 0)
        out = np.dstack([np.clip(rgb, 0, 1), np.clip(al, 0, 1)]) * 255
        return Image.fromarray(out.round().astype(np.uint8), "RGBA")


def value_noise(h, w, cell, rng):
    gh, gw = h // cell + 3, w // cell + 3
    g = rng.standard_normal((gh, gw)).astype(np.float32)
    z = zoom(g, cell, order=3)
    return z[:h, :w]


# ---------------------------------------------------------------- lá
def leaf(base, angle, L, rng, pal=None, width=None, bend=None, shadow=0.0):
    """Trả về (patch premultiplied, x0, y0) cho một chiếc lá, toạ độ siêu mẫu.
    base: điểm cuống (px thật); angle: hướng ngọn (rad); L: dài (px thật)."""
    ss = SS
    L = L * ss
    bx, by = base[0] * ss, base[1] * ss
    pal = pal or PALETTES[rng.randrange(len(PALETTES))]
    tone = rng.uniform(0.86, 1.08)  # mỗi lá một độ sáng: lá úp tối, lá ngửa sáng
    wr = width if width is not None else rng.uniform(0.17, 0.23)
    bend = bend if bend is not None else rng.uniform(-0.09, 0.09)
    asym = rng.uniform(-0.08, 0.08)
    ux, uy = math.cos(angle), math.sin(angle)
    nx, ny = -uy, ux
    hwmax = wr * L * 1.15
    # khung bao
    pts = [(bx, by), (bx + ux * L, by + uy * L)]
    pad = hwmax + abs(bend) * L + 4 * ss + shadow * 3 * ss
    xs = [p[0] for p in pts]
    ys = [p[1] for p in pts]
    x0, x1 = int(min(xs) - pad), int(max(xs) + pad)
    y0, y1 = int(min(ys) - pad), int(max(ys) + pad)
    yy, xx = np.mgrid[y0:y1, x0:x1].astype(np.float32)
    dx, dy = xx - bx, yy - by
    t = (dx * ux + dy * uy) / L
    lat = dx * nx + dy * ny
    tc = np.clip(t, 0, 1)
    mid = bend * L * np.sin(np.pi * tc)  # gân giữa cong
    lat = lat - mid
    prof = np.clip(np.sin(np.pi * np.power(tc, 0.88)), 0, 1) ** 1.05 * (1 - 0.12 * tc)
    hw = wr * L * prof * np.where(lat > 0, 1 + asym, 1 - asym)
    s = lat / np.maximum(hw, 1e-3)  # -1..1 trong lá
    inside = (t >= 0) & (t <= 1) & (np.abs(s) <= 1)
    # khử răng cưa: độ phủ mềm theo khoảng cách tới mép (≈1px siêu mẫu)
    edge_px = (hw - np.abs(lat))
    cov = np.clip(edge_px / 1.2 + 0.5, 0, 1) * (t >= 0) * np.clip((1 - t) * L / 1.2 + 0.5, 0, 1)
    cov = np.where(np.abs(s) <= 1.15, cov, 0).astype(np.float32)

    # màu: gốc tối → ngọn sáng; nửa đón sáng sáng hơn
    dark, midc, light = pal
    k = np.clip(0.15 + 0.75 * tc, 0, 1)[..., None]
    col = np.where(k < 0.5, dark + (midc - dark) * (k / 0.5), midc + (light - midc) * ((k - 0.5) / 0.5))
    lit = np.tanh(s * 3.0)[..., None]
    col = col * (1 + 0.11 * lit)
    # lá hơi gấp theo gân giữa: nửa khuất tối hơn, sát gân phía sáng có vệt tối mảnh
    fold = np.exp(-((s - 0.08) / 0.12) ** 2)[..., None]
    col = col * (1 - 0.1 * fold)
    col = col * tone
    # rìa lá trong mờ, ngả vàng lục khi ngược sáng
    rim = np.clip((np.abs(s) - 0.72) / 0.28, 0, 1)[..., None] ** 1.5
    col = col * (1 - 0.22 * rim) + hexc("#d2e79a") * 0.22 * rim
    # dải bóng loáng dọc nửa trên
    sheen = np.exp(-(((s - 0.38) / 0.2) ** 2))[..., None] * (1 - 0.6 * tc[..., None])
    col = col + 26 * sheen
    # gân giữa
    midrib = np.exp(-((lat / (0.009 * L + 0.9 * ss)) ** 2))[..., None] * (1 - 0.75 * tc[..., None])
    col = col * (1 - 0.45 * midrib) + hexc("#dcecbc") * 0.45 * midrib
    # gân phụ xiên về ngọn
    N = rng.uniform(7, 9)
    vphase = (tc * N - np.abs(s) * N * 0.38)
    vein = np.power(np.clip(np.cos(2 * np.pi * vphase), 0, 1), 26)[..., None]
    vein *= np.clip(1 - np.abs(s)[..., None], 0, 1) ** 0.6 * np.clip(tc * 6, 0, 1)[..., None] * (1 - tc[..., None]) * 1.4
    col = col * (1 - 0.14 * vein) + 235 * 0.14 * vein
    # vân màu tự nhiên
    nz = value_noise(y1 - y0, x1 - x0, max(6, int(L / 9)), np.random.default_rng(rng.randrange(1 << 30)))
    col = col * (1 + 0.035 * nz[..., None])
    col = np.clip(col / 255.0, 0, 1)

    patch = np.zeros((y1 - y0, x1 - x0, 4), np.float32)
    patch[..., :3] = col * cov[..., None]
    patch[..., 3] = cov
    if shadow > 0:
        sh = gaussian_filter(cov, 6 * ss)
        off = int(7 * ss)
        shp = np.zeros_like(patch)
        shp[off:, off // 2 :, 3] = sh[:-off, : sh.shape[1] - off // 2] * shadow
        shp[..., :3] = (hexc("#1b3a1c") / 255.0) * shp[..., 3:4]
        patch = patch + shp * (1 - patch[..., 3:4])
    return patch, x0, y0


def stem(cv, pts, w0, w1, color="#3d6b30"):
    """Cuống thon dần, tô bằng chuỗi hình tròn (toạ độ px thật)."""
    ss = cv.ss
    c = hexc(color) / 255.0
    # lấy mẫu lại theo độ dài cung, bước ≤ 0.35px để nét liền
    dense = [pts[0]]
    for (xa, ya), (xb, yb) in zip(pts, pts[1:]):
        seg = math.hypot(xb - xa, yb - ya)
        k = max(1, int(seg / 0.35))
        dense += [(xa + (xb - xa) * j / k, ya + (yb - ya) * j / k) for j in range(1, k + 1)]
    pts = dense
    for i, (x, y) in enumerate(pts):
        r = (w0 + (w1 - w0) * i / max(1, len(pts) - 1)) * ss / 2
        R = int(r + 2)
        cx, cy = x * ss, y * ss
        yy, xx = np.mgrid[-R:R + 1, -R:R + 1].astype(np.float32)
        d = np.sqrt(xx**2 + yy**2)
        cov = np.clip(r - d + 0.5, 0, 1)
        shade = 1 + 0.18 * np.clip(-yy / max(r, 1), -1, 1)  # mép trên sáng hơn
        p = np.zeros((2 * R + 1, 2 * R + 1, 4), np.float32)
        p[..., :3] = np.clip(c * shade[..., None], 0, 1) * cov[..., None]
        p[..., 3] = cov
        cv.comp(p, int(cx) - R, int(cy) - R)


def bez(p, t):
    (x0, y0), (x1, y1), (x2, y2), (x3, y3) = p
    m = 1 - t
    return (m**3 * x0 + 3 * m * m * t * x1 + 3 * m * t * t * x2 + t**3 * x3, m**3 * y0 + 3 * m * m * t * y1 + 3 * m * t * t * y2 + t**3 * y3)


def sprig(cv, ctrl, n, size, rng, shadow=0.0, terminal=True, start=0.16):
    """Nhành lá: cuống bezier bậc 3 + lá mọc so le, to dần rồi nhỏ về ngọn."""
    pts = [bez(ctrl, i / 120) for i in range(121)]
    stem(cv, pts, max(2.2, size * 0.034), max(1.0, size * 0.012))
    order = []
    for k in range(n):
        t = start + (0.97 - start) * k / max(1, n - 1)
        order.append(t)
    for k, t in enumerate(order):
        x, y = bez(ctrl, t)
        x2, y2 = bez(ctrl, min(1, t + 0.01))
        ang = math.atan2(y2 - y, x2 - x)
        side = 1 if k % 2 == 0 else -1
        is_tip = terminal and k == n - 1
        a = ang if is_tip else ang + side * math.radians(rng.uniform(34, 58))
        grow = math.sin(math.pi * (0.25 + 0.65 * t))
        L = size * (0.6 + 0.5 * grow) * rng.uniform(0.88, 1.1) * (0.85 if is_tip else 1)
        # cuống lá ngắn
        px, py = x + math.cos(a) * L * 0.07, y + math.sin(a) * L * 0.07
        stem(cv, [(x + (px - x) * i / 6, y + (py - y) * i / 6) for i in range(7)], max(1.6, size * 0.018), max(1.2, size * 0.014))
        patch, x0, y0 = leaf((px, py), a, L, rng, bend=side * rng.uniform(0.02, 0.1), shadow=shadow)
        cv.comp(patch, x0, y0)


def lone_leaf(cv, base, angle, L, rng, shadow=0.0):
    patch, x0, y0 = leaf(base, angle, L, rng, shadow=shadow)
    cv.comp(patch, x0, y0)


# ---------------------------------------------------------------- khung lá mép trang
FW, FH = 600, 1300


def frame(side, variant, seed):
    """Khung lá bám mép. Vẽ cho mép trái (x=0 là mép màn hình) rồi lật nếu là mép phải."""
    rng = random.Random(seed)
    # 1) tán lá xa – rất mờ, nhạt, hoà vào nền
    far = Canvas(FW, FH)
    spots = {1: [0.08, 0.3, 0.55, 0.82], 2: [0.18, 0.42, 0.7, 0.96], 3: [0.02, 0.26, 0.5, 0.78]}[variant]
    for yf in spots:
        y = yf * FH + rng.uniform(-30, 30)
        for _ in range(rng.randint(4, 6)):  # cụm lá dày sát mép
            a = rng.uniform(-1.1, 0.9)
            lone_leaf(far, (rng.uniform(-80, 60), y + rng.uniform(-120, 120)), a, rng.uniform(170, 250), rng)
        reach = rng.uniform(200, 290)
        sprig(far, [(-60, y + 120), (60, y + 40), (150, y - 30), (reach, y - rng.uniform(90, 160))], rng.randint(5, 7), rng.uniform(130, 160), rng)
    far.blurred(rng.uniform(15, 18)).fade_to(BG, 0.38, 0.6)

    # 2) nhành chính – nét, có bóng đổ
    main = Canvas(FW, FH)
    if variant == 1:
        sprig(main, [(-40, 1180), (60, 960), (120, 760), (250, 560)], 11, 118, rng, shadow=0.2)
        sprig(main, [(-30, 120), (70, 170), (150, 260), (205, 380)], 7, 84, rng, shadow=0.2)
    elif variant == 2:
        sprig(main, [(-40, 260), (80, 380), (150, 560), (215, 760)], 10, 112, rng, shadow=0.2)
        sprig(main, [(-30, 1260), (40, 1130), (110, 1050), (190, 990)], 6, 90, rng, shadow=0.2)
    else:
        sprig(main, [(-40, 760), (70, 640), (130, 480), (255, 330)], 10, 116, rng, shadow=0.2)
        sprig(main, [(-30, 1120), (60, 1170), (140, 1230), (230, 1240)], 6, 80, rng, shadow=0.2)

    # 3) tiền cảnh – lá lớn sát ống kính, nhoè mạnh
    fore = Canvas(FW, FH)
    fy = {1: (FH * 0.66, -0.6), 2: (FH * 0.08, 0.5), 3: (FH * 0.95, -0.9)}[variant]
    lone_leaf(fore, (-90, fy[0]), fy[1], 330, rng)
    lone_leaf(fore, (-70, fy[0] + 120), fy[1] + 0.5, 260, rng)
    fore.blurred(26).fade_to(BG, 0.15, 0.62)

    # ghép: xa → chính → tiền cảnh; mép trong phai dần để không có đường cắt
    far = main.under(far)
    comp = fore.under(far)
    xs = np.linspace(0, 1, comp.a.shape[1], dtype=np.float32)
    fade = np.clip((1 - xs) / 0.25, 0, 1) ** 1.4  # 25% cuối phía trong mờ dần
    comp.a *= fade[None, :, None]
    img = comp.image()
    if side == "r":
        img = img.transpose(Image.FLIP_LEFT_RIGHT)
    return img


# ---------------------------------------------------------------- nền ánh sáng
def radial(h, w, cx, cy, rx, ry, power=2.0):
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    d = np.sqrt(((xx - cx) / rx) ** 2 + ((yy - cy) / ry) ** 2)
    return np.clip(1 - d, 0, 1) ** power


def light(w, h, seed, portrait=False):
    rng = np.random.default_rng(seed)
    top, bot = hexc("#f8faf3"), hexc("#f1f6ea")
    g = np.linspace(0, 1, h, dtype=np.float32)[:, None, None]
    img = (top + (bot - top) * g) * np.ones((h, w, 3), np.float32)

    def mix(mask, color, a):
        nonlocal img
        m = (mask * a)[..., None]
        img = img * (1 - m) + hexc(color) * m

    # nắng sớm ấm ở góc trên phải
    mix(radial(h, w, w * 0.92, -h * 0.12, w * 0.55, h * 0.75, 1.6), "#fff4d6", 0.75)
    # mảng xanh loang so le hai mép
    mix(radial(h, w, -w * 0.05, h * 0.62, w * 0.36, h * 0.6, 1.8), "#cfe3b2", 0.5)
    mix(radial(h, w, w * 1.04, h * 0.3, w * 0.32, h * 0.5, 1.8), "#d6e9bc", 0.42)
    mix(radial(h, w, w * 0.5, h * 1.25, w * 0.75, h * 0.5, 1.4), "#dcebc6", 0.5)
    # cỏ mờ dưới chân, chỉ ở hai góc: tích luỹ màu premultiplied rồi làm nhoè (tránh viền xám)
    acc = np.zeros((h, w, 4), np.float32)
    nb = int(w * (1.1 if portrait else 0.75))
    greens = [hexc(c) / 255 for c in ("#8fbf62", "#a6cf79", "#7aae55", "#bcdc93", "#6e9f4c")]
    for _ in range(nb):
        x = rng.uniform(-20, w + 20)
        edge = min(x, w - x) / (w * 0.5)
        if rng.random() < edge * 1.8:
            continue
        bh = rng.uniform(0.05, 0.17) * h * (1 - edge * 0.7)
        lean = rng.uniform(-0.35, 0.35) * bh
        col = greens[rng.integers(len(greens))]
        a0 = rng.uniform(0.35, 0.75)
        bw = rng.uniform(2.0, 4.5)
        for i in range(40):
            tt = i / 39
            px = x + lean * tt * tt
            py = h - 1 - bh * tt
            half = bw * (1 - tt) + 0.4
            xa, xb = int(max(0, px - half)), int(min(w, px + half + 1))
            yi = int(py)
            if 0 <= yi < h and xa < xb:
                al = a0 * (1 - 0.6 * tt)
                seg = acc[yi, xa:xb]
                seg[:, :3] = col * al + seg[:, :3] * (1 - al)
                seg[:, 3] = al + seg[:, 3] * (1 - al)
    for c in range(4):
        acc[..., c] = gaussian_filter(acc[..., c], 2.6)
    # gò đất phủ cỏ rất mờ ở hai góc
    mound = np.maximum(radial(h, w, -w * 0.02, h * 1.05, w * 0.3, h * 0.2, 1.2), radial(h, w, w * 1.02, h * 1.06, w * 0.32, h * 0.2, 1.2))
    img = img * (1 - mound[..., None] * 0.55) + hexc("#b9d796") * mound[..., None] * 0.55
    img = img * (1 - acc[..., 3:4]) + acc[..., :3] * 255
    # bokeh: đốm sáng mềm ở mép trên và hai bên
    bok = np.zeros((h, w), np.float32)
    for _ in range(46 if not portrait else 30):
        x = rng.uniform(0, w)
        y = rng.uniform(0, h * 0.85)
        edge = min(x, w - x) / (w * 0.5)
        if rng.random() < edge * 1.4 and y > h * 0.2:
            continue
        r = rng.uniform(6, 30) * (w / 1920 if not portrait else 1080 / 1080)
        yy, xx = np.ogrid[max(0, int(y - r - 3)) : min(h, int(y + r + 3)), max(0, int(x - r - 3)) : min(w, int(x + r + 3))]
        d = np.sqrt((xx - x) ** 2 + (yy - y) ** 2)
        disk = np.clip(r - d, 0, 1) * (0.55 + 0.45 * np.clip((d / r) ** 6, 0, 1))  # viền sáng hơn như bokeh thật
        sl = bok[max(0, int(y - r - 3)) : min(h, int(y + r + 3)), max(0, int(x - r - 3)) : min(w, int(x + r + 3))]
        np.maximum(sl, disk * rng.uniform(0.25, 0.6), out=sl)
    bok = gaussian_filter(bok, 1.6)
    mix(bok, "#fffbe8", 0.85)
    # giữ vùng giữa sạch để đọc chữ
    center = radial(h, w, w * 0.5, h * 0.45, w * (0.34 if not portrait else 0.6), h * 0.55, 1.2)
    base = (top + (bot - top) * g) * np.ones((h, w, 3), np.float32)
    k = (center * 0.55)[..., None]
    img = img * (1 - k) + base * k
    # hạt mịn chống dải màu
    img += rng.normal(0, 0.9, img.shape).astype(np.float32)
    return Image.fromarray(np.clip(img, 0, 255).round().astype(np.uint8), "RGB")


def place(dst, src, x, y, scale=1.0, alpha=1.0):
    s = src.resize((int(src.width * scale), int(src.height * scale)), Image.LANCZOS)
    if alpha < 1:
        a = np.asarray(s).copy()
        a[..., 3] = (a[..., 3] * alpha).astype(np.uint8)
        s = Image.fromarray(a, "RGBA")
    dst.alpha_composite(s, (int(x), int(y)))


if __name__ == "__main__":
    frames = {}
    for v, seed in ((1, 11), (2, 23), (3, 37)):
        for side, off in (("l", 0), ("r", 100)):
            path = f"{OUT}/frame-{side}-{v}.webp"
            if os.path.exists(path) and "--force" not in sys.argv:
                frames[(side, v)] = Image.open(path).convert("RGBA")
                continue
            im = frame(side, v, seed + off)
            frames[(side, v)] = im
            im.save(f"{OUT}/frame-{side}-{v}.webp", quality=84, method=6)
            print("frame", side, v, im.size, os.path.getsize(f"{OUT}/frame-{side}-{v}.webp") // 1024, "KB")

    bg = light(1920, 1080, 5)
    bg.save(f"{OUT}/light.webp", quality=82, method=6)
    print("light", os.path.getsize(f"{OUT}/light.webp") // 1024, "KB")

    # bản điện thoại: nền dọc + lá ở góc (nhỏ, nhạt hơn) – giữa trang sạch
    def soft(img, top=True, bottom=True, size=0.35):
        a = np.asarray(img).astype(np.float32)
        hh = a.shape[0]
        ys = np.linspace(0, 1, hh, dtype=np.float32)
        f = np.ones(hh, np.float32)
        if top:
            f *= np.clip(ys / size, 0, 1)
        if bottom:
            f *= np.clip((1 - ys) / size, 0, 1)
        a[..., 3] *= f[:, None] ** 1.3
        return Image.fromarray(a.round().astype(np.uint8), "RGBA")

    m = light(1080, 1920, 9, portrait=True).convert("RGBA")
    place(m, soft(frames[("r", 2)].crop((0, 0, 600, 760)), top=False), 1080 - 360, -30, 0.6, 0.8)
    place(m, soft(frames[("l", 1)].crop((0, 520, 600, 1300)), bottom=False), -30, 1920 - 470, 0.6, 0.8)
    m.convert("RGB").save(f"{OUT}/light-m.webp", quality=80, method=6)
    print("light-m", os.path.getsize(f"{OUT}/light-m.webp") // 1024, "KB")
