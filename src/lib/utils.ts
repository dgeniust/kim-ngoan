import { createCn } from "cn/config";

/**
 * Merges Tailwind classes. The custom type scale MUST be declared (text-display … text-micro, see globals.css):
 * otherwise `cn` treats `text-body` as a text COLOUR and drops the accompanying `text-white` / `text-v-on-accent`.
 */
export const cn = createCn({
  extend: {
    classGroups: {
      "font-size": [{ text: ["display", "h1", "h2", "h3", "h4", "title", "lead", "body", "small", "caption", "micro"] }],
    },
  },
});
