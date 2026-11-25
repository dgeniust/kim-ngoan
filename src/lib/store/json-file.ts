import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { DATA_DIR_SETTING } from "@/lib/env";

/**
 * JSON-file data store in the data/ directory (like lib/content/store.ts).
 * When deploying to a host without a writable filesystem (serverless), replace this module with a DB –
 * the rest of the app only depends on readJson / writeJson.
 */
// turbopackIgnore: the data directory is decided by an env var at runtime – keep it out of the build bundle
export const DATA_DIR = path.resolve(/* turbopackIgnore: true */ process.cwd(), DATA_DIR_SETTING);

export async function readJson(file: string): Promise<unknown | undefined> {
  try {
    return JSON.parse(await fs.readFile(path.join(DATA_DIR, file), "utf8"));
  } catch {
    return undefined; // no file yet → use defaults
  }
}

export async function writeJson(file: string, data: unknown): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const target = path.join(DATA_DIR, file);
  const tmp = `${target}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), "utf8");
  await fs.rename(tmp, target); // atomic write
}

export async function removeJson(file: string): Promise<void> {
  await fs.rm(path.join(DATA_DIR, file), { force: true });
}
