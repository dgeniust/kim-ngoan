import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { DATA_DIR_SETTING } from "@/lib/env";

/**
 * Kho dữ liệu dạng file JSON trong thư mục data/ (giống lib/content/store.ts).
 * Khi triển khai lên host không ghi được file (serverless), thay module này bằng DB
 * – phần còn lại của ứng dụng chỉ phụ thuộc readJson / writeJson.
 */
// turbopackIgnore: thư mục dữ liệu do biến môi trường quyết định lúc chạy – không đưa vào gói build
export const DATA_DIR = path.resolve(/* turbopackIgnore: true */ process.cwd(), DATA_DIR_SETTING);

export async function readJson(file: string): Promise<unknown | undefined> {
  try {
    return JSON.parse(await fs.readFile(path.join(DATA_DIR, file), "utf8"));
  } catch {
    return undefined; // chưa có file → dùng mặc định
  }
}

export async function writeJson(file: string, data: unknown): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const target = path.join(DATA_DIR, file);
  const tmp = `${target}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), "utf8");
  await fs.rename(tmp, target); // ghi nguyên tử
}

export async function removeJson(file: string): Promise<void> {
  await fs.rm(path.join(DATA_DIR, file), { force: true });
}
