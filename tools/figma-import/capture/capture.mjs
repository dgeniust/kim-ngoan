// Dùng: node capture.mjs <đường-dẫn> <rộng> <mobile 0|1> <tên-file> "<tên frame>" "<trang Figma>"
// Cần: Chrome mở cổng CDP 9333 (google-chrome --headless=new --remote-debugging-port=9333)
//       và site chạy ở BASE (mặc định http://localhost:3111).
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const DIR = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.env.BASE || "http://localhost:3111";
const OUT = path.resolve(DIR, "../data");
const [route, W, mob, name, label] = [process.argv[2], Number(process.argv[3]), process.argv[4] === "1", process.argv[5], process.argv[6]];
const list = await (await fetch("http://127.0.0.1:9333/json")).json();
const ws = new WebSocket(list.find((t) => t.type === "page").webSocketDebuggerUrl);
let id = 0; const pending = new Map();
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d.result ?? d.error); pending.delete(d.id); } };
await new Promise((r) => (ws.onopen = r));
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (e) => { const r = await send("Runtime.evaluate", { expression: e, returnByValue: true, awaitPromise: true }); if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails).slice(0, 800)); return r.result.value; };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
await send("Page.enable");
await send("Emulation.setDeviceMetricsOverride", { width: W, height: mob ? 844 : 900, deviceScaleFactor: 1, mobile: mob });
await send("Emulation.setEmulatedMedia", { media: "screen", features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
await send("Page.navigate", { url: BASE + route }); await sleep(3000);
await ev("localStorage.setItem('kn-vuon','sau-rieng'); dispatchEvent(new Event('kn-vuon'))");
const H0 = await ev("document.documentElement.scrollHeight");
for (let y = 0; y < H0; y += 500) { await ev(`scrollTo(0,${y})`); await sleep(90); }
await ev(`document.querySelectorAll('.reveal').forEach(e=>e.dataset.visible='true');
  document.querySelectorAll('button[aria-label="Lên đầu trang"]').forEach(e=>e.style.display='none');
  scrollTo(0,0); document.fonts.ready.then(()=>1)`);
await ev(`Promise.all([...document.images].map(i=>{i.loading='eager'; return i.complete?1:new Promise(r=>{i.onload=i.onerror=r; setTimeout(r,4000)})}))`);
await sleep(1500);
const H = await ev("document.documentElement.scrollHeight");
await ev(`document.head.insertAdjacentHTML('beforeend','<style>html{scrollbar-width:none}::-webkit-scrollbar{display:none}</style>')`); await sleep(300);
await send("Emulation.setDeviceMetricsOverride", { width: W, height: mob ? 844 : 900, deviceScaleFactor: 1, mobile: mob }); await ev("scrollTo(0,0)"); await sleep(800);
fs.mkdirSync(OUT, { recursive: true });
await ev(fs.readFileSync(path.join(DIR, "serialize.js"), "utf8"));
const data = await ev(`__knSerialize({imgScale:${mob ? 2.5 : 1.6}})`);
data.name = label; data.page = process.argv[7]; data.source = (process.env.SOURCE || "kim-ngoan") + " · " + route;
fs.writeFileSync(path.join(OUT, `${name}.json`), JSON.stringify(data));
console.log(name, W, H, data.stats, (fs.statSync(path.join(OUT, `${name}.json`)).size / 1e6).toFixed(1) + "MB");
process.exit(0);
