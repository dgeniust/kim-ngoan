import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { BUTTON_SIZES } from "@/lib/ui";
import { cn } from "@/lib/utils";

/**
 * Sector-site button: 6px corners, 500 weight, 200 ms colour transition.
 * accent = the single primary action; tint = secondary; quiet = text button; onInvert = on a colour field.
 */
const vButton = cva(
  "group/btn inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-colors duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:transition-transform [&_svg]:duration-200 hover:[&_svg.arrow]:translate-x-0.5",
  {
    variants: {
      variant: {
        accent: "bg-v-accent text-v-on-accent hover:bg-v-accent-hover",
        tint: "bg-v-tint text-v-on-tint hover:brightness-110",
        quiet: "bg-v-raise text-v-fg hover:bg-v-tint hover:text-v-on-tint",
        onInvert: "bg-v-on-invert text-v-invert hover:opacity-90",
        /** legacy name kept for compatibility */
        solid: "bg-v-tint text-v-on-tint hover:brightness-110",
      },
      size: BUTTON_SIZES,
    },
    defaultVariants: { variant: "accent", size: "md" },
  },
);

export function VButton({
  className,
  variant,
  size,
  asChild,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof vButton> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(vButton({ variant, size }), className)} {...props} />;
}
