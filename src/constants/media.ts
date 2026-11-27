/**
 * Shared helpers for stock media on the sector home pages (see lopxe-media.ts, satthep-media.ts).
 * Unsplash (Unsplash License) and Mixkit (Mixkit Stock Video Free License) both allow commercial use
 * without attribution. Before go-live, prefer downloading the files into /public and pointing `src` at them.
 */
export type MediaImage = { src: string; alt: string; credit?: string };
export type MediaVideo = {
  /** Tried in order – the browser plays the first one it can load. */
  sources: readonly string[];
  poster: string;
  /** Short description for screen readers. */
  label: string;
  credit?: string;
};

/** Unsplash CDN URL for a photo id (or an `uploads/…` path), resized to `w` px wide. */
export const unsplash = (id: string, w = 1600) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=75`;
/** Mixkit clip in descending quality; the 360p file always exists. */
export const mixkit = (id: number) => [720, 360].map((q) => `https://assets.mixkit.co/videos/${id}/${id}-${q}.mp4`);
