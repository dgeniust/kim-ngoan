import { createCn } from "cn/config";

/**
 * Gộp class Tailwind. PHẢI khai báo thang chữ riêng (text-display … text-micro, xem globals.css):
 * nếu không, `cn` coi `text-body` là MÀU chữ và xoá mất `text-white` / `text-v-on-accent` đi kèm.
 */
export const cn = createCn({
  extend: {
    classGroups: {
      "font-size": [{ text: ["display", "h1", "h2", "h3", "h4", "title", "lead", "body", "small", "caption", "micro"] }],
    },
  },
});
