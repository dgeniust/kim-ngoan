import path from "path";
import { DATA_DIR } from "@/lib/store/json-file";

export const UPLOAD_DIR = path.join(DATA_DIR, "uploads");
export const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/svg+xml": ".svg",
};
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
export const SAFE_NAME = /^[a-z0-9-]+\.(jpg|png|webp|gif|svg)$/;
