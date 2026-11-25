/**
 * SINGLE button size scale for the whole site (hub, fertilizer, tyres, steel).
 *   sm   36px – secondary buttons in cards, filters
 *   md   44px – default (meets the 44px touch-target guideline)
 *   lg   52px – primary hero / call-to-action buttons
 *   icon 44×44px
 * Text: sm = text-small (14px), md/lg = text-body (16px). Corner radius is up to each brand.
 */
export const BUTTON_SIZES = {
  sm: "h-9 px-4 text-small",
  md: "h-11 px-5 text-body",
  lg: "h-13 px-7 text-body",
  icon: "size-11",
} as const;
